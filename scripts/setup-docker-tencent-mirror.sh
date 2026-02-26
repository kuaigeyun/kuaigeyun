#!/bin/bash
# 在部署服务器上配置 Docker 腾讯云镜像加速
# 用法：SSH 到服务器后执行：sudo bash setup-docker-tencent-mirror.sh

set -e

DAEMON_JSON="/etc/docker/daemon.json"
BACKUP_JSON="/etc/docker/daemon.json.bak.$(date +%Y%m%d%H%M%S)"

# 腾讯云镜像加速（建议腾讯云服务器使用）
# 仅加速 Docker Hub (docker.io)，如 postgres、redis、caddy、inngest 等
TENCENT_MIRROR="https://mirror.ccs.tencentyun.com"

echo "配置 Docker 腾讯云镜像加速..."

# 备份现有配置
if [ -f "$DAEMON_JSON" ]; then
    cp "$DAEMON_JSON" "$BACKUP_JSON"
    echo "已备份: $BACKUP_JSON"
fi

# 合并或创建配置
if [ -f "$DAEMON_JSON" ] && [ -s "$DAEMON_JSON" ]; then
    # 已有配置，使用 jq 合并（若未安装 jq 则覆盖）
    if command -v jq &>/dev/null; then
        jq '. + {"registry-mirrors": (."registry-mirrors" // [] | . + ["'"$TENCENT_MIRROR"'"] | unique)}' "$DAEMON_JSON" > "${DAEMON_JSON}.tmp"
        mv "${DAEMON_JSON}.tmp" "$DAEMON_JSON"
    else
        cat > "$DAEMON_JSON" << 'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
    fi
else
    mkdir -p /etc/docker
    cat > "$DAEMON_JSON" << EOF
{
  "registry-mirrors": ["${TENCENT_MIRROR}"]
}
EOF
fi

echo "当前配置:"
cat "$DAEMON_JSON"

# 重启 Docker
echo "重启 Docker 服务..."
systemctl daemon-reload
systemctl restart docker

echo "✅ 腾讯云镜像加速已配置"
echo ""
echo "说明：此配置加速 Docker Hub (docker.io) 镜像，如 postgres、redis、caddy、inngest。"
echo "ghcr.io 镜像（riveredge-backend、riveredge-frontend）需单独处理，可考虑："
echo "  1. 在 docker-compose 中将 ghcr.io 替换为 ghcr.nju.edu.cn（南京大学镜像）"
echo "  2. 或将镜像推送至腾讯云 TCR，从国内拉取"
