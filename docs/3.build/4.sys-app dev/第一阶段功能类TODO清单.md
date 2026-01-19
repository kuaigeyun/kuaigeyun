# 第一阶段功能类TODO任务清单

> **文档说明：**  
> 本文档列出第一阶段开发计划中遗漏的功能类TODO任务（排除测试相关任务）。  
> 
> **创建时间：** 2026-01-27  
> **文档版本：** v1.0

---

## 📋 遗漏的功能类TODO任务

### ✅ 已修复的文档标记问题

1. **功能点1.3.3：单据下推和上拉功能**
   - **问题**：功能已实现，但完成标记中"功能已实现"未勾选
   - **状态**：✅ 已修复（已更新文档标记）
   - **说明**：`DocumentPushPullService`和API已实现，功能正常

2. **功能点1.3.5：单据关联追溯查询**
   - **问题**：功能已实现，但完成标记中"功能已实现"未勾选
   - **状态**：✅ 已修复（已更新文档标记）
   - **说明**：`trace_document_chain`方法和API已实现，功能正常

---

### ⚠️ 待完成的功能类任务

#### 1. 功能点1.2.1：统一需求计算数据模型设计

**任务描述：**  
创建`DemandComputation`和`DemandComputationItem`表的数据库迁移脚本。

**当前状态：**
- ✅ 模型代码已编写（`DemandComputation`和`DemandComputationItem`模型）
- ❌ **数据库迁移脚本未创建**（标记为`[ ] 数据库迁移脚本已创建`）

**需要完成的工作：**
- 创建数据库迁移脚本，包含：
  - `apps_kuaizhizao_demand_computations`表
  - `apps_kuaizhizao_demand_computation_items`表
  - 必要的索引和约束
  - 表注释和字段注释

**相关文件：**
- 模型定义：`riveredge-backend/src/apps/kuaizhizao/models/demand_computation.py`
- 迁移脚本位置：`riveredge-backend/migrations/models/`

**建议操作：**
```bash
# 使用Aerich生成迁移脚本
cd riveredge-backend
uv run aerich migrate --name add_demand_computation_tables
```

---

#### 2. 功能点1.3.1：单据关联关系模型设计

**任务描述：**  
创建`DocumentRelation`表的数据库迁移脚本。

**当前状态：**
- ✅ 模型代码已编写（`DocumentRelation`模型）
- ❌ **数据库迁移脚本未创建**（标记为`[ ] 数据库迁移脚本已创建`）

**需要完成的工作：**
- 创建数据库迁移脚本，包含：
  - `apps_kuaizhizao_document_relations`表
  - 必要的索引和约束
  - 表注释和字段注释

**相关文件：**
- 模型定义：`riveredge-backend/src/apps/kuaizhizao/models/document_relation.py`
- 迁移脚本位置：`riveredge-backend/migrations/models/`

**建议操作：**
```bash
# 使用Aerich生成迁移脚本
cd riveredge-backend
uv run aerich migrate --name add_document_relation_tables
```

---

## 📊 任务统计

**总任务数：** 2个  
**待完成：** 2个  
**已完成：** 0个  
**完成度：** 0/2 (0%)

---

## 📝 注意事项

1. **数据库迁移脚本创建方式：**
   - 推荐使用Aerich自动生成迁移脚本（`uv run aerich migrate`）
   - 也可以手动创建迁移脚本，参考其他迁移文件的格式

2. **迁移脚本命名规范：**
   - 格式：`{序号}_{日期}_{描述}.py`
   - 示例：`41_20260127000003_add_demand_computation_tables.py`

3. **迁移脚本内容要求：**
   - 必须包含`upgrade`和`downgrade`函数
   - 必须包含表注释和字段注释
   - 必须包含必要的索引和约束
   - 必须使用幂等性检查（`IF NOT EXISTS`）

4. **执行迁移：**
   - 迁移脚本创建后，需要在开发环境测试
   - 确认无误后，再在生产环境执行

---

**文档创建时间：** 2026-01-27  
**文档作者：** Auto (AI Assistant)  
**文档版本：** v1.0
