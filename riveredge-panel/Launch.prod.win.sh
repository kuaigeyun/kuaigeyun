#!/bin/bash
# RiverEdge 生产环境启动脚本 (Windows - 需 Git Bash)
# 构建前端、手机端，启动后端、Inngest、Caddy 反向代理
# Caddyfile 由面板根据 deploy-config.json 生成；独立运行时从模板生成
#
# 用法: ./Launch.prod.win.sh [start|stop|status|build]
# 需在项目根目录执行，或通过 riveredge-panel 调用

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# 配置
BACKEND_PORT="${BACKEND_PORT:-8200}"
PROXY_PORT="${PROXY_PORT:-8080}"
INNGEST_PORT="${INNGEST_PORT:-8288}"

mkdir -p .logs
log() { echo "[$(date +'%H:%M:%S')] $*"; }
log_ok() { echo "[$(date +'%H:%M:%S')] ✓ $*"; }
log_err() { echo "[$(date +'%H:%M:%S')] ✗ $*" >&2; }

# 生成 Caddyfile：若面板已生成则直接使用，否则从模板生成
gen_caddyfile() {
    local out="$SCRIPT_DIR/caddy/Caddyfile"
    local tpl="$SCRIPT_DIR/caddy/Caddyfile.template"
    if [ -f "$out" ]; then
        log_ok "使用面板生成的 Caddyfile"
        return 0
    fi
    if [ -f "$tpl" ]; then
        sed -e "s|{{PROJECT_ROOT}}|$PROJECT_ROOT|g" \
            -e "s|{{PROXY_PORT}}|$PROXY_PORT|g" \
            -e "s|{{BACKEND_PORT}}|$BACKEND_PORT|g" \
            "$tpl" > "$out"
        log_ok "已从模板生成 Caddyfile"
    else
        log_err "Caddyfile 模板不存在，请先在面板中保存 Caddy 配置"
        return 1
    fi
}

# 构建前端
do_build() {
    log "构建 Web 前端..."
    cd riveredge-frontend
    npm run build
    cd ..
    log_ok "Web 前端构建完成"

    if [ -d "riveredge-mobile" ]; then
        log "构建手机端 Web..."
        cd riveredge-mobile
        npx expo export -p web 2>/dev/null || log "手机端构建跳过"
        cd ..
        log_ok "手机端构建完成"
    fi
}

# 启动后端
start_backend() {
    if [ -f .logs/backend.pid ] && kill -0 $(cat .logs/backend.pid) 2>/dev/null; then
        log "后端已在运行"
        return 0
    fi
    log "启动后端..."
    cd riveredge-backend
    export PORT=$BACKEND_PORT
    export HOST=127.0.0.1
    export ENVIRONMENT=production
    export DEBUG=false
    export SETUPTOOLS_EGG_INFO_DIR="$PROJECT_ROOT/.logs"
    PYTHONPATH="$(pwd)/src" nohup uv run uvicorn server.main:app --host 127.0.0.1 --port $BACKEND_PORT > ../.logs/backend.log 2>&1 &
    echo $! > ../.logs/backend.pid
    cd ..
    sleep 4
    if curl -s "http://127.0.0.1:$BACKEND_PORT/health" >/dev/null 2>&1; then
        log_ok "后端已启动 (端口 $BACKEND_PORT)"
    else
        log_err "后端启动失败，查看 .logs/backend.log"
        return 1
    fi
}

# 启动 Inngest（Windows 优先 .exe）
start_inngest() {
    local exe=""
    for p in bin/inngest/inngest-windows-amd64.exe bin/inngest/inngest.exe bin/inngest/inngest bin/inngest.exe; do
        [ -f "$p" ] && exe="$p" && break
    done
    [ -z "$exe" ] && log "未找到 Inngest，跳过" && return 0
    if [ -f .logs/inngest.pid ] && kill -0 $(cat .logs/inngest.pid) 2>/dev/null; then
        log "Inngest 已在运行"
        return 0
    fi
    log "启动 Inngest..."
    nohup "$exe" dev -u "http://127.0.0.1:$BACKEND_PORT/api/inngest" --no-discovery --host 127.0.0.1 --port $INNGEST_PORT >> .logs/inngest.log 2>&1 &
    echo $! > .logs/inngest.pid
    log_ok "Inngest 已启动 (端口 $INNGEST_PORT)"
}

# 启动 Caddy
start_caddy() {
    gen_caddyfile || return 1
    if ! command -v caddy &>/dev/null; then
        log_err "未安装 Caddy。从 https://github.com/caddyserver/caddy/releases 下载 caddy_*_windows_amd64.zip 解压到 PATH"
        return 1
    fi
    if [ -f .logs/caddy.pid ] && kill -0 $(cat .logs/caddy.pid) 2>/dev/null; then
        log "Caddy 已在运行"
        return 0
    fi
    log "启动 Caddy..."
    nohup caddy run --config "$SCRIPT_DIR/caddy/Caddyfile" >> .logs/caddy.log 2>&1 &
    echo $! > .logs/caddy.pid
    sleep 2
    log_ok "Caddy 已启动"
}

# 停止（Windows 使用 taskkill）
do_stop() {
    for name in caddy inngest backend; do
        pidf=".logs/${name}.pid"
        if [ -f "$pidf" ]; then
            pid=$(cat "$pidf")
            if kill -0 $pid 2>/dev/null; then
                taskkill //PID $pid //F 2>/dev/null || kill $pid 2>/dev/null || true
                log "已停止 $name (PID $pid)"
            fi
            rm -f "$pidf"
        fi
    done
    log_ok "生产服务已停止"
}

# 状态
do_status() {
    echo "=== RiverEdge 生产环境状态 ==="
    for name in backend inngest caddy; do
        pidf=".logs/${name}.pid"
        if [ -f "$pidf" ] && kill -0 $(cat "$pidf") 2>/dev/null; then
            echo "  $name: 运行中 (PID $(cat $pidf))"
        else
            echo "  $name: 未运行"
        fi
    done
    echo ""
    echo "访问地址: http://127.0.0.1:$PROXY_PORT （或面板配置的域名）"
}

# 主流程
case "${1:-start}" in
    build)   do_build ;;
    start)
        do_build
        start_backend
        start_inngest
        start_caddy
        log_ok "生产环境已启动"
        start "" "http://127.0.0.1:$PROXY_PORT" 2>/dev/null || true
        ;;
    stop)     do_stop ;;
    status)   do_status ;;
    *)        echo "用法: $0 {start|stop|status|build}"; exit 1 ;;
esac
