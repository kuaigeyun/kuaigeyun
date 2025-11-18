"""
使用同步方式测试 PostgreSQL 连接
"""

try:
    import psycopg2
    print("✓ psycopg2 已安装")
except ImportError:
    print("✗ psycopg2 未安装，尝试安装...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    import psycopg2

print("\n1. 测试连接到 postgres 数据库...")
try:
    import os
    # 设置环境变量避免编码问题
    os.environ['PGCLIENTENCODING'] = 'UTF8'
    # 使用连接字符串而不是参数，避免编码问题
    conn = psycopg2.connect(
        "host=localhost port=5432 user=postgres password=postgres dbname=postgres connect_timeout=5",
        connect_timeout=5
    )
    print("✓ PostgreSQL 连接成功（使用 psycopg2）")
    
    cur = conn.cursor()
    cur.execute('SELECT version()')
    version = cur.fetchone()[0]
    print(f"  版本: {version.split(',')[0]}")
    
    # 检查 riveredge 数据库
    cur.execute("SELECT 1 FROM pg_database WHERE datname = 'riveredge'")
    exists = cur.fetchone()
    if exists:
        print("✓ riveredge 数据库存在")
    else:
        print("✗ riveredge 数据库不存在")
    
    conn.close()
except Exception as e:
    print(f"✗ 连接失败: {e}")
    import traceback
    traceback.print_exc()

print("\n2. 测试连接到 riveredge 数据库...")
try:
    import os
    os.environ['PGCLIENTENCODING'] = 'UTF8'
    # 使用连接字符串而不是参数，避免编码问题
    conn = psycopg2.connect(
        "host=localhost port=5432 user=postgres password=postgres dbname=riveredge connect_timeout=5",
        connect_timeout=5
    )
    print("✓ riveredge 数据库连接成功")
    
    cur = conn.cursor()
    cur.execute(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_schema = 'public' AND table_name LIKE 'core_%' "
        "ORDER BY table_name"
    )
    tables = cur.fetchall()
    print(f"✓ 找到 {len(tables)} 个 core_* 表")
    if tables:
        print("  表列表:")
        for table in tables[:10]:
            print(f"    - {table[0]}")
    else:
        print("  ✗ 没有找到 core_* 表，需要创建表结构")
    
    conn.close()
except Exception as e:
    print(f"✗ 连接失败: {e}")
    import traceback
    traceback.print_exc()

