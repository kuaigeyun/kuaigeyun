#!/usr/bin/env bash
# 重置 Inngest 开发库，清除已持久化的 App 列表（解决「两个 App、一个 Not Synced」）
# 使用前请先停止 Inngest 服务。
#
# 用法: ./reset-inngest-db.sh

set -e

# 与 inngest.config.json 中的数据库配置一致
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASS:-postgres}"
DB_NAME="inngest"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/inngest.config.json"

if [ -f "$CONFIG_FILE" ]; then
  # 若存在 jq，从配置文件读取 url（可选）
  if command -v jq &>/dev/null; then
    url=$(jq -r '.database.url // empty' "$CONFIG_FILE" 2>/dev/null)
    if [ -n "$url" ] && [[ "$url" == postgresql://* ]]; then
      # 简单解析 postgresql://user:pass@host:port/dbname
      if [[ "$url" =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/([^/?]+) ]]; then
        DB_USER="${BASH_REMATCH[1]}"
        DB_PASS="${BASH_REMATCH[2]}"
        DB_HOST="${BASH_REMATCH[3]}"
        DB_PORT="${BASH_REMATCH[4]}"
        DB_NAME="${BASH_REMATCH[5]}"
      fi
    fi
  fi
fi

export PGPASSWORD="$DB_PASS"

if ! command -v psql &>/dev/null; then
  echo "未找到 psql。请先停止 Inngest，然后手动在 PostgreSQL 中执行："
  echo "  DROP DATABASE IF EXISTS $DB_NAME;"
  echo "  CREATE DATABASE $DB_NAME;"
  echo "再重新启动 Inngest。"
  exit 1
fi

echo "正在终止对数据库 $DB_NAME 的连接..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 -c "
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();
" 2>/dev/null || true

echo "正在删除并重建数据库 $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $DB_NAME;"

unset PGPASSWORD
echo "Inngest 数据库已重置。请重新启动 Inngest，届时将只同步配置中的唯一 App。"
