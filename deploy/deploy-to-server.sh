#!/bin/bash
# 将部署文件同步到服务器并启动
# 用法：./deploy-to-server.sh 用户@服务器IP
# 示例：./deploy-to-server.sh root@1.2.3.4

set -e
if [ -z "$1" ]; then
    echo "用法: $0 用户@服务器IP"
    echo "示例: $0 root@1.2.3.4"
    exit 1
fi
TARGET="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== 同步部署文件到 $TARGET ==="

# 确保 .env 存在
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "未找到 $SCRIPT_DIR/.env"
    echo "请先运行: cd deploy && bash setup-env.sh"
    exit 1
fi

# 创建远程目录
ssh "$TARGET" "mkdir -p /opt/riveredge/deploy/postgres"

# 同步文件
scp "$PROJECT_ROOT/docker-compose.prod.yml" "$TARGET:/opt/riveredge/"
scp "$SCRIPT_DIR/.env" "$TARGET:/opt/riveredge/.env"
scp "$SCRIPT_DIR/Caddyfile" "$TARGET:/opt/riveredge/deploy/"
scp "$SCRIPT_DIR/postgres/init-inngest.sql" "$TARGET:/opt/riveredge/deploy/postgres/"

echo ""
echo "=== 在服务器上启动服务 ==="
ssh "$TARGET" "cd /opt/riveredge && sudo docker compose -f docker-compose.prod.yml pull && sudo docker compose -f docker-compose.prod.yml up -d --remove-orphans"

echo ""
echo "✅ 部署完成"
echo "查看状态: ssh $TARGET 'cd /opt/riveredge && sudo docker compose -f docker-compose.prod.yml ps'"
echo "查看日志: ssh $TARGET 'cd /opt/riveredge && sudo docker compose -f docker-compose.prod.yml logs -f'"
