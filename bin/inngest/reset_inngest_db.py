#!/usr/bin/env python3
"""
重置 Inngest 开发库，清除已持久化的 App 列表（解决「两个 App、一个 Not Synced」）。
使用前请先停止 Inngest 服务。

用法（在项目根目录）:
  uv run python bin/inngest/reset_inngest_db.py
  或: python bin/inngest/reset_inngest_db.py
"""
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(SCRIPT_DIR, "inngest.config.json")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_NAME = "inngest"

if os.path.exists(CONFIG_PATH):
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    db = cfg.get("database") or {}
    url = db.get("url", "")
    if url and url.startswith("postgresql://"):
        # 简单解析 postgresql://user:pass@host:port/dbname
        rest = url.replace("postgresql://", "").split("@", 1)
        if len(rest) == 2:
            user_pass, host_port_db = rest[0], rest[1]
            up = user_pass.split(":", 1)
            if len(up) == 2:
                DB_USER, DB_PASS = up[0], up[1]
            hpd = host_port_db.split("/", 1)
            if len(hpd) == 2:
                hp, DB_NAME = hpd[0], hpd[1].split("?")[0]
                if ":" in hp:
                    DB_HOST, DB_PORT = hp.rsplit(":", 1)
                    DB_PORT = int(DB_PORT)
                else:
                    DB_HOST = hp

def main():
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    except ImportError:
        print("未安装 psycopg2。请先停止 Inngest，然后手动在 PostgreSQL 中执行：")
        print(f"  DROP DATABASE IF EXISTS {DB_NAME};")
        print(f"  CREATE DATABASE {DB_NAME};")
        print("再重新启动 Inngest。")
        sys.exit(1)

    conn = None
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            dbname="postgres",
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # 终止对 inngest 库的连接
        cur.execute(
            "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = %s AND pid <> pg_backend_pid()",
            (DB_NAME,),
        )
        cur.close()

        cur = conn.cursor()
        cur.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        cur.execute(f"CREATE DATABASE {DB_NAME}")
        cur.close()
        print("Inngest 数据库已重置。请重新启动 Inngest，届时将只同步配置中的唯一 App。")
    except Exception as e:
        print(f"执行失败: {e}")
        print("请先停止 Inngest，然后手动在 PostgreSQL 中执行：")
        print(f"  DROP DATABASE IF EXISTS {DB_NAME};")
        print(f"  CREATE DATABASE {DB_NAME};")
        sys.exit(1)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
