#!/bin/bash
# RiverEdge SaaS 多组织框架 - Inngest 服务独立启动脚本
# 独立启动 Inngest 服务，支持 Windows Git Bash 和 Linux/Mac
# 使用 Inngest 官方默认配置，不自定义任何端口设置
#
# 使用方法:
#   ./start-inngest.sh              # 启动 Inngest 服务 (使用默认配置)
#   ./start-inngest.sh stop         # 停止 Inngest 服务
#   ./start-inngest.sh status       # 查看服务状态

set -e  # 遇到错误立即退出

# ========================================
# 配置参数
# ========================================

# 后端API URL（用于连接 RiverEdge 后端）
BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8200/api/inngest}"

# 日志目录
LOG_DIR="${LOG_DIR:-../../.logs}"
PID_FILE="${PID_FILE:-$LOG_DIR/inngest.pid}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/inngest.log}"

# ========================================

# 颜色输出 (兼容性考虑)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# 日志函数
log_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "命令 '$1' 未找到，请确保已安装"
        exit 1
    fi
}





# 启动 Inngest 服务
start_inngest() {
    log_info "启动 Inngest 服务（使用默认配置，不自定义端口）..."

    # 检查 Inngest 可执行文件
    local inngest_exe=""
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # 查找 Inngest 可执行文件
    if [ -f "$script_dir/inngest.exe" ]; then
        inngest_exe="$script_dir/inngest.exe"
    elif [ -f "$script_dir/inngest" ]; then
        inngest_exe="$script_dir/inngest"
    elif [ -f "$script_dir/inngest-windows-amd64.exe" ]; then
        inngest_exe="$script_dir/inngest-windows-amd64.exe"
    else
        log_error "未找到 Inngest 可执行文件，请确保以下文件之一存在:"
        log_error "  - $script_dir/inngest.exe"
        log_error "  - $script_dir/inngest"
        log_error "  - $script_dir/inngest-windows-amd64.exe"
        exit 1
    fi

    # 检查配置文件
    local config_file="$script_dir/inngest.config.json"
    if [ ! -f "$config_file" ]; then
        log_error "未找到 Inngest 配置文件: $config_file"
        exit 1
    fi

    # 确保日志目录存在
    mkdir -p "$LOG_DIR" 2>/dev/null || true

    # 清理旧的PID文件
    rm -f "$PID_FILE"

    # 启动 Inngest 服务
    # 参考官方文档：https://www.inngest.com/docs/getting-started/python-quick-start
    # 官方默认端口：8288（完全使用默认配置，不自定义端口）
    # Windows端口保留问题：使用 --host 127.0.0.1 绑定到本地回环地址，可能可以绕过端口保留限制
    log_info "启动 Inngest 服务（使用官方默认端口8288，绑定到127.0.0.1）..."
    
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        # Windows: 绑定到127.0.0.1而不是0.0.0.0，可能可以绕过端口保留限制
        ("$inngest_exe" dev -u "$BACKEND_URL" --config "$config_file" --host 127.0.0.1 >> "$LOG_FILE" 2>&1) &
        local inngest_pid=$!
    else
        # Linux/Mac: 使用 nohup，使用默认端口8288
        nohup "$inngest_exe" dev -u "$BACKEND_URL" --config "$config_file" >> "$LOG_FILE" 2>&1 &
        local inngest_pid=$!
    fi

    # 等待进程启动
    sleep 2

    # 验证进程是否在运行
    local process_running=false

    if kill -0 $inngest_pid 2>/dev/null; then
        process_running=true
    fi

    if [ "$process_running" = false ]; then
        log_error "Inngest 进程启动失败，检查日志: $LOG_FILE"
        if [ -f "$LOG_FILE" ] && [ -s "$LOG_FILE" ]; then
            log_error "启动错误:"
            tail -10 "$LOG_FILE" | while read line; do
                log_error "  $line"
            done
        fi
        exit 1
    fi

    # 保存PID
    echo $inngest_pid > "$PID_FILE"

    log_success "Inngest 服务启动成功 (PID: $inngest_pid)"

    # 等待一段时间让服务启动
    sleep 3

    # 尝试检测端口（通过检查日志中的端口信息）
    local detected_port=""
    if [ -f "$LOG_FILE" ] && grep -q "listening on" "$LOG_FILE"; then
        detected_port=$(grep "listening on" "$LOG_FILE" | tail -1 | sed 's/.*listening on.*:\([0-9]*\).*/\1/')
    fi

    if [ ! -z "$detected_port" ]; then
        log_success "Inngest 服务运行在端口: $detected_port"
        log_success "Inngest Dashboard: http://localhost:$detected_port/_dashboard"
    else
        log_success "Inngest 服务已启动，请检查日志获取端口信息: $LOG_FILE"
        log_info "提示: Inngest 使用默认端口配置，请查看日志确认实际端口"
    fi
}

# 停止 Inngest 服务
stop_inngest() {
    log_info "停止 Inngest 服务..."

    if [ ! -f "$PID_FILE" ]; then
        log_warn "未找到 PID 文件: $PID_FILE"
        return 0
    fi

    local inngest_pid=$(cat "$PID_FILE" 2>/dev/null)
    if [ -z "$inngest_pid" ] || [ "$inngest_pid" = "0" ]; then
        log_warn "PID 文件内容无效"
        rm -f "$PID_FILE"
        return 0
    fi

    if kill -0 $inngest_pid 2>/dev/null; then
        log_info "停止 Inngest 服务 (PID: $inngest_pid)"
        kill -TERM $inngest_pid 2>/dev/null || true

        # Windows环境下也尝试taskkill
        if command -v taskkill &> /dev/null; then
            taskkill /PID $inngest_pid /F /T >> "$LOG_DIR/taskkill.log" 2>&1 || true
        fi

        # 等待进程结束
        local count=0
        while [ $count -lt 5 ] && kill -0 $inngest_pid 2>/dev/null; do
            sleep 0.5
            count=$((count + 1))
        done

        # 如果还在运行，强制终止
        if kill -0 $inngest_pid 2>/dev/null; then
            log_warn "强制停止 Inngest 服务 (PID: $inngest_pid)"
            kill -KILL $inngest_pid 2>/dev/null || true
        fi
    else
        log_warn "Inngest 进程 (PID: $inngest_pid) 已经停止"
    fi

    rm -f "$PID_FILE"
    log_success "Inngest 服务已停止"
}

# 显示服务状态
show_status() {
    log_info "Inngest 服务状态检查:"

    if [ -f "$PID_FILE" ]; then
        local inngest_pid=$(cat "$PID_FILE")
        if kill -0 $inngest_pid 2>/dev/null; then
            log_success "Inngest 服务运行中 (PID: $inngest_pid)"
        else
            log_warn "Inngest 服务PID文件存在但进程未运行"
        fi
    else
        log_warn "Inngest 服务未运行"
    fi

    # 检查运行状态
    log_info "Inngest 服务状态检查完成"
}

# 显示帮助信息
show_help() {
    cat << EOF
RiverEdge SaaS - Inngest 服务独立启动脚本

用法: $0 [命令]

命令:
    start         启动 Inngest 服务 (使用默认配置)
    stop          停止 Inngest 服务
    status        显示服务状态
    help          显示此帮助信息

环境变量:
    BACKEND_URL   指定后端API URL (默认: $BACKEND_URL)
    LOG_DIR       指定日志目录 (默认: $LOG_DIR)

示例:
    $0                          # 启动服务 (使用默认配置)
    $0 start                    # 启动服务 (使用默认配置)
    $0 stop                     # 停止服务
    $0 status                   # 查看状态

日志文件:
    $LOG_FILE                    # Inngest 服务日志

EOF
}

# 主函数
main() {
    # 确保日志目录存在
    mkdir -p "$LOG_DIR" 2>/dev/null || true

    case "${1:-start}" in
        start)
            if [ ! -z "$2" ]; then
                log_error "不再支持指定端口参数，请使用 Inngest 默认端口配置"
                exit 1
            fi
            start_inngest
            ;;
        stop)
            stop_inngest
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
