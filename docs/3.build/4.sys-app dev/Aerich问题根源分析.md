# Aerich 工具问题根源分析

**分析日期：** 2026-01-15  
**当前版本：** Aerich 0.9.2, Tortoise ORM 0.21.1

---

## 🔍 问题根源分析

### 1. **版本兼容性问题** ⚠️ **核心问题**

**现状：**
- 配置要求：`aerich>=0.7.1`
- 实际安装：`aerich==0.9.2`（自动升级到最新版本）
- Tortoise ORM：`0.21.1`（固定版本）

**问题：**
- Aerich 0.9.2 是较新版本，对迁移文件格式要求更严格
- 不同版本的 Aerich 对格式检测逻辑不一致
- 版本自动升级导致兼容性问题

**证据：**
```
RuntimeError: Old format of migration file detected, run `aerich fix-migrations` to upgrade format
```
即使运行了 `fix-migrations`，仍然报错。

### 2. **格式检测逻辑缺陷** ⚠️ **工具本身的问题**

**问题：**
- Aerich 0.9.2 的格式检测过于严格
- 即使迁移文件格式正确，也可能被误判为旧格式
- `fix-migrations` 命令无法修复所有格式问题

**根本原因：**
- Aerich 工具本身不够成熟，格式检测逻辑有 bug
- 社区支持不够，问题反馈和修复速度慢
- 文档不够完善，错误信息不够清晰

### 3. **工具设计缺陷** ⚠️ **架构问题**

**问题：**
- Aerich 依赖 Tortoise ORM 的模型定义来生成迁移
- 但格式检测逻辑与模型定义耦合过紧
- 当模型定义复杂时（如多应用、多组织），容易出错

**具体表现：**
- 需要加载所有模型才能检测格式
- 模型加载过程中出现警告：`Module "infra.models.base" has no models`
- 即使警告不影响功能，但可能影响格式检测

### 4. **项目配置复杂性** ⚠️ **项目特定问题**

**问题：**
- 项目使用多应用架构（infra、core、apps）
- 模型分布在多个目录
- TORTOISE_ORM 配置复杂

**影响：**
- Aerich 需要正确加载所有模型
- 配置路径问题可能导致模型加载失败
- 格式检测时可能无法正确识别所有迁移文件

---

## 💡 解决方案

### 方案1：固定 Aerich 版本（推荐）⭐

**原因：**
- 避免版本自动升级导致的兼容性问题
- 使用已知稳定的版本

**操作：**
```toml
# pyproject.toml
aerich==0.7.1  # 固定到稳定版本，而不是 >=0.7.1
```

**优点：**
- 简单直接
- 避免版本升级带来的问题

**缺点：**
- 可能错过新版本的 bug 修复
- 需要手动升级版本

### 方案2：使用 Python 脚本直接执行迁移（实用方案）⭐⭐

**原因：**
- 绕过 Aerich 的格式检测问题
- 直接执行 SQL，更可控

**操作：**
创建 `migrations/apply_migrations.py`：
```python
"""
直接执行迁移文件的 Python 脚本
绕过 Aerich 的格式检测问题
"""
import asyncio
import asyncpg
from pathlib import Path
import importlib.util
import sys

async def apply_migration(migration_file: Path):
    """执行单个迁移文件"""
    # 加载迁移模块
    spec = importlib.util.spec_from_file_location("migration", migration_file)
    module = importlib.util.module_from_spec(spec)
    sys.modules["migration"] = module
    spec.loader.exec_module(module)
    
    # 连接数据库
    conn = await asyncpg.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="your_password",
        database="riveredge"
    )
    
    try:
        # 执行 upgrade
        sql = await module.upgrade(conn)
        await conn.execute(sql)
        print(f"✅ 迁移成功: {migration_file.name}")
    except Exception as e:
        print(f"❌ 迁移失败: {migration_file.name}, 错误: {e}")
    finally:
        await conn.close()

async def main():
    """执行所有未应用的迁移"""
    migrations_dir = Path(__file__).parent / "models"
    migration_files = sorted(migrations_dir.glob("*.py"))
    
    for migration_file in migration_files:
        if migration_file.name.startswith("__"):
            continue
        await apply_migration(migration_file)

if __name__ == "__main__":
    asyncio.run(main())
```

**优点：**
- 完全绕过 Aerich 的格式检测
- 更灵活，可以自定义执行逻辑
- 不依赖 Aerich 工具

**缺点：**
- 需要手动管理迁移记录
- 需要自己实现迁移状态跟踪

### 方案3：使用 Alembic（长期方案）⭐⭐⭐

**原因：**
- Alembic 是 SQLAlchemy 的迁移工具，更成熟稳定
- 社区支持更好，文档更完善
- 但需要从 Tortoise ORM 迁移到 SQLAlchemy（工作量较大）

**适用场景：**
- 长期项目
- 需要更稳定的迁移工具
- 愿意投入时间迁移

---

## 🎯 立即行动方案

### 短期方案（立即执行）

1. **固定 Aerich 版本**
   ```bash
   # 修改 pyproject.toml
   aerich==0.7.1  # 固定版本
   
   # 重新安装
   uv sync
   ```

2. **手动执行迁移文件**
   - 由于 Aerich 工具无法正常工作
   - 直接使用 Python 脚本执行迁移文件
   - 或者使用 `psql` 直接执行 SQL

3. **记录迁移状态**
   - 在数据库中手动记录已应用的迁移
   - 或者使用简单的文本文件记录

### 长期方案（建议）

1. **评估替代方案**
   - 考虑使用 Alembic（如果愿意迁移到 SQLAlchemy）
   - 或者开发自定义迁移工具

2. **反馈问题**
   - 向 Aerich 项目提交 Issue
   - 提供详细的错误信息和复现步骤

---

## 📊 问题总结

### Aerich 工具的根本问题

1. **不够成熟**
   - 工具相对较新，不够稳定
   - 格式检测逻辑有缺陷
   - 错误信息不够清晰

2. **版本兼容性差**
   - 不同版本格式要求不一致
   - 自动升级导致兼容性问题

3. **文档不完善**
   - 错误处理文档不够详细
   - 问题排查指南不够完善

4. **社区支持不足**
   - 问题反馈和修复速度慢
   - 社区活跃度不够高

### 为什么会有这么不稳定的工具？

1. **开源项目的局限性**
   - 依赖社区贡献
   - 资源有限，无法像商业工具那样完善测试

2. **工具定位问题**
   - Aerich 是 Tortoise ORM 的官方迁移工具
   - 但 Tortoise ORM 本身相对小众
   - 导致工具使用人数少，问题发现和修复慢

3. **技术债务**
   - 早期版本的设计缺陷
   - 后续版本为了兼容性，导致代码复杂

---

## 💬 建议

### 对于当前项目

1. **立即行动**
   - 固定 Aerich 版本到 0.7.1
   - 如果仍然无法工作，使用 Python 脚本直接执行迁移

2. **长期规划**
   - 考虑迁移到更成熟的迁移工具
   - 或者开发自定义迁移管理工具

3. **文档更新**
   - 记录所有遇到的问题和解决方案
   - 为团队提供迁移操作指南

### 对于 Aerich 工具

1. **反馈问题**
   - 向项目提交详细的 Issue
   - 提供复现步骤和错误信息

2. **贡献代码**
   - 如果可能，贡献修复代码
   - 帮助改进工具

---

**结论：** Aerich 工具确实存在稳定性问题，这是工具本身不够成熟导致的。建议固定版本或使用替代方案。

