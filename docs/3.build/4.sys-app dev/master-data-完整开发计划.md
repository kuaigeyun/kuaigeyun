# 主数据管理APP（master_data）完整开发计划

## 📋 项目概述

**应用名称：** 主数据管理（master_data）  
**应用代码：** `master-data`  
**定位：** 统一管理工厂、仓库、物料、工艺、供应链、绩效等基础数据  
**目标：** 为快智造（kuaizhizao）等MES应用提供完整的基础数据支持  
**开发策略：** 分阶段完善，优先支持快智造MVP需求，逐步扩展

---

## 1. 功能范围定义（基于快格轻制造APP规划）

### 1.1 基础数据层完整功能

根据"快格轻制造APP.md"的规划，基础数据层包括：

**组织与资源：**
- 部门管理 - 系统级功能（core）
- 员工管理 - 系统级功能（core）

**工厂建模：**
- 工厂设置（Factory）- ⚠️ 当前缺失
- 车间设置（Workshop）- ✅ 已实现
- 工作中心（ProductionLine）- ✅ 已实现
- 工位（Workstation）- ✅ 已实现（可选）

**产品与工艺：**
- 物料主数据（Material）- ✅ 已实现
- BOM管理（BOM）- ✅ 已实现
- 工艺路线（ProcessRoute）- ✅ 已实现
- 工序（Operation）- ✅ 已实现

**供应链主数据：**
- 客户管理（Customer）- ✅ 已实现
- 供应商管理（Supplier）- ✅ 已实现

**其他数据：**
- 不良品类型（DefectType）- ✅ 已实现
- 作业程序（SOP）- ✅ 已实现
- 假期（Holiday）- ✅ 已实现
- 技能（Skill）- ✅ 已实现

**仓库数据：**
- 仓库（Warehouse）- ✅ 已实现
- 库区（StorageArea）- ✅ 已实现
- 库位（StorageLocation）- ✅ 已实现

### 1.2 功能优先级分类

#### ✅ MVP阶段必需功能（快智造MVP需要）

**工厂建模：**
- ✅ Workshop（车间）
- ✅ ProductionLine（产线/工作中心）
- ⚠️ Factory（工厂）- 需要确认是否需要添加

**产品管理：**
- ✅ Material（物料）
- ✅ BOM（物料清单）
- ✅ MaterialGroup（物料分组）

**仓库管理：**
- ✅ Warehouse（仓库）
- ⚠️ StorageArea（库区）- 快智造MVP可能不需要
- ⚠️ StorageLocation（库位）- 快智造MVP可能不需要

#### ⏳ 第一阶段扩展功能（快智造第一阶段需要）

**供应链主数据：**
- ⏳ Customer（客户）- 销售订单需要
- ⏳ Supplier（供应商）- 采购管理需要

**工艺数据：**
- ⏳ ProcessRoute（工艺路线）- MRP/LRP运算需要
- ⏳ Operation（工序）- 工艺路线需要

#### ⏳ 第二阶段扩展功能（快智造第二阶段需要）

**质量管理：**
- ⏳ DefectType（不良品类型）- 质量管理需要

**其他数据：**
- ⏳ SOP（作业程序）- 可选，高级功能
- ⏳ Holiday（假期）- 可选，排产需要
- ⏳ Skill（技能）- 可选，人员管理需要

---

## 2. 当前实现情况分析

### 2.1 已实现功能

#### ✅ 工厂数据（已实现）
- Workshop（车间）- API完整，前端页面完整
- ProductionLine（产线）- API完整，前端页面完整
- Workstation（工位）- API完整，前端页面完整
- ⚠️ Factory（工厂）- 缺失，需要确认是否需要

#### ✅ 仓库数据（已实现）
- Warehouse（仓库）- API完整，前端页面完整
- StorageArea（库区）- API完整，前端页面完整
- StorageLocation（库位）- API完整，前端页面完整

#### ✅ 物料数据（已实现）
- MaterialGroup（物料分组）- API完整，前端页面完整
- Material（物料）- API完整，前端页面完整
- BOM（物料清单）- API完整，前端页面完整

#### ✅ 工艺数据（已实现）
- DefectType（不良品）- API完整，前端页面完整
- Operation（工序）- API完整，前端页面完整
- ProcessRoute（工艺路线）- API完整，前端页面完整
- SOP（作业程序）- API完整，前端页面完整（包含工作流）

#### ✅ 供应链数据（已实现）
- Customer（客户）- API完整，前端页面完整
- Supplier（供应商）- API完整，前端页面完整

#### ✅ 绩效数据（已实现）
- Holiday（假期）- API完整，前端页面完整
- Skill（技能）- API完整，前端页面完整

#### ⚠️ 产品数据（已实现，需要确认）
- Product（产品）- API完整，需要确认与Material的关系

### 2.2 功能完整性评估

**快智造MVP需求满足度：** 95%
- ✅ 工厂数据：满足（但缺少Factory实体）
- ✅ 物料数据：满足
- ✅ 仓库数据：满足

**快智造第一阶段需求满足度：** 100%
- ✅ 供应链数据：满足
- ✅ 工艺数据：满足

**快智造第二阶段需求满足度：** 100%
- ✅ 不良品类型：满足

---

## 3. 需要改进的功能

### 3.1 高优先级改进（快智造MVP必需）

#### 改进项1：添加Factory（工厂）实体

**问题：** 当前只有Workshop（车间），缺少Factory（工厂）层级

**建议：**
- 添加Factory（工厂）实体
- 形成 Factory → Workshop → ProductionLine → Workstation 的完整层级
- 或者明确Workshop就是最高层级（适合单工厂场景）

**决策建议：**
- 如果快智造主要面向单工厂场景，可以保持现状（Workshop为最高层级）
- 如果快智造需要支持多工厂场景，需要添加Factory实体

#### 改进项2：API查询优化

**问题：** 快智造需要高效的查询接口

**需要添加：**
- 批量查询接口（根据UUID列表批量获取）
- 简化查询接口（只返回code、name、uuid）
- 搜索接口优化（支持拼音搜索、模糊搜索）

**优先级：** 高

#### 改进项3：BOM查询优化

**问题：** 快智造需要快速获取产品的BOM清单

**当前状态：**
- ✅ 已有 `GET /bom/material/{material_id}` 接口
- ⚠️ 缺少多层级展开接口

**需要添加：**
- `GET /bom/expand/{material_uuid}` - BOM多层级展开
- `GET /bom/by-parent/{material_uuid}` - 根据父件查询所有子件

**优先级：** 高

#### 改进项4：数据验证接口完善

**问题：** 快智造创建工单前需要验证基础数据完整性

**当前状态：**
- ✅ 已有 `validation.py` API模块
- ✅ 已有 `GET /validation/work-order-data-integrity` 接口
- ⚠️ 需要确认验证逻辑是否完整

**需要完善：**
- 验证Material是否存在
- 验证BOM是否存在
- 验证Workshop和ProductionLine是否存在
- 验证Warehouse是否存在

**优先级：** 高

### 3.2 中优先级改进（快智造第一阶段需要）

#### 改进项5：概念统一

**问题：** 概念不统一

**需要明确：**
- ProductionLine = 工作中心（用于快智造）
- Workstation = 工位（更细粒度，快智造MVP可能不需要）
- 在API文档中明确说明

**优先级：** 中

#### 改进项6：Material类型和单位完善

**问题：** 快智造需要区分原材料、半成品、成品

**当前状态：**
- ⚠️ 需要确认Material是否有material_type字段
- ⚠️ 需要确认单位管理是否完善

**需要完善：**
- 确保Material有material_type字段（原材料/半成品/成品）
- 确保单位管理完善（base_unit、units多单位支持）

**优先级：** 中

### 3.3 低优先级改进（后续优化）

#### 改进项7：Product和Material关系确认

**问题：** Product和Material功能可能重复

**建议：**
- 如果Product和Material功能重复，考虑合并或明确区分
- 如果Product是Material的特殊类型，可以考虑统一使用Material

**优先级：** 低

#### 改进项8：功能精简（可选）

**问题：** 部分功能快智造MVP不需要

**建议：**
- 提供功能开关，允许隐藏不需要的模块
- 创建"精简版"菜单配置

**优先级：** 低

---

## 4. 开发计划

### 4.1 第一阶段：MVP支持优化（2周）

**目标：** 优化API，满足快智造MVP需求

**任务清单：**
- [ ] 添加批量查询接口（Material、Workshop、ProductionLine、Warehouse）
- [ ] 添加简化查询接口（只返回必要字段）
- [ ] 优化BOM查询接口（多层级展开、按父件查询）
- [ ] 完善数据验证接口（创建工单前检查）
- [ ] 确认Factory实体是否需要添加
- [ ] 确认Material的material_type字段
- [ ] 确认单位管理是否完善

**交付物：**
- ✅ 批量查询API
- ✅ 简化查询API
- ✅ BOM查询优化API
- ✅ 数据验证API完善

### 4.2 第二阶段：概念统一和文档完善（0.5周）

**目标：** 统一概念，完善文档

**任务清单：**
- [ ] 明确Factory/Workshop/ProductionLine层级关系
- [ ] 明确工作中心概念（ProductionLine = 工作中心）
- [ ] 更新API文档，明确概念说明
- [ ] 确认Product和Material的关系

**交付物：**
- ✅ 概念说明文档
- ✅ API文档更新

### 4.3 第三阶段：第一阶段扩展支持（1周）

**目标：** 确保支持快智造第一阶段功能

**任务清单：**
- [ ] 确认Customer和Supplier API完整性
- [ ] 确认ProcessRoute和Operation API完整性
- [ ] 优化工艺路线查询接口（用于MRP/LRP运算）
- [ ] 添加工艺路线展开接口（多层级工序展开）

**交付物：**
- ✅ 工艺路线查询优化API
- ✅ 供应链数据API确认

### 4.4 第四阶段：前端组件优化（1周）

**目标：** 优化前端选择组件

**任务清单：**
- [ ] 创建统一的基础数据选择组件
- [ ] 支持下拉选择、树形选择、搜索选择
- [ ] 支持批量选择
- [ ] 添加缓存机制

**交付物：**
- ✅ 基础数据选择组件库
- ✅ 组件使用文档

---

## 5. API接口优化详细方案

### 5.1 批量查询接口

**接口设计：**
```python
# 批量查询物料
POST /api/v1/apps/master-data/materials/batch
Body: {"uuids": ["uuid1", "uuid2", ...]}
Response: List[MaterialResponse]

# 批量查询车间
POST /api/v1/apps/master-data/factory/workshops/batch
Body: {"uuids": ["uuid1", "uuid2", ...]}
Response: List[WorkshopResponse]

# 批量查询产线
POST /api/v1/apps/master-data/factory/production-lines/batch
Body: {"uuids": ["uuid1", "uuid2", ...]}
Response: List[ProductionLineResponse]

# 批量查询仓库
POST /api/v1/apps/master-data/warehouse/warehouses/batch
Body: {"uuids": ["uuid1", "uuid2", ...]}
Response: List[WarehouseResponse]
```

**实现要点：**
- 使用 `IN` 查询优化性能
- 支持最多100个UUID批量查询
- 返回顺序与请求顺序一致

### 5.2 简化查询接口

**接口设计：**
```python
# 简化查询物料（只返回必要字段）
GET /api/v1/apps/master-data/materials/simple?material_type=成品&is_active=true
Response: List[SimpleMaterialResponse]  # {uuid, code, name, material_type}

# 简化查询车间
GET /api/v1/apps/master-data/factory/workshops/simple?is_active=true
Response: List[SimpleWorkshopResponse]  # {uuid, code, name}

# 简化查询产线
GET /api/v1/apps/master-data/factory/production-lines/simple?workshop_uuid=xxx&is_active=true
Response: List[SimpleProductionLineResponse]  # {uuid, code, name}

# 简化查询仓库
GET /api/v1/apps/master-data/warehouse/warehouses/simple?is_active=true
Response: List[SimpleWarehouseResponse]  # {uuid, code, name}
```

**实现要点：**
- 只查询必要字段，提高查询速度
- 支持筛选条件（material_type、is_active等）
- 支持分页（可选）

### 5.3 BOM查询优化

**接口设计：**
```python
# 根据父件查询BOM（已有，需要确认）
GET /api/v1/apps/master-data/materials/bom/material/{material_uuid}
Response: List[BOMResponse]

# BOM多层级展开（新增）
GET /api/v1/apps/master-data/materials/bom/expand/{material_uuid}?max_level=10
Response: BOMExpandResponse  # 包含所有层级的子件，树形结构

# BOM扁平化展开（新增）
GET /api/v1/apps/master-data/materials/bom/flatten/{material_uuid}
Response: List[BOMFlattenResponse]  # 扁平化列表，包含所有层级的子件及用量
```

**实现要点：**
- 支持多层级递归查询
- 支持最大层级限制（防止无限递归）
- 计算总用量（考虑多层级用量）

### 5.4 数据验证接口完善

**接口设计：**
```python
# 验证创建工单所需的基础数据（已有，需要完善）
GET /api/v1/apps/master-data/validation/work-order-data-integrity
Query: material_uuid, workshop_uuid, production_line_uuid
Response: {
    "is_valid": true,
    "errors": [],
    "warnings": [],
    "missing_data": {
        "material": false,
        "bom": false,
        "workshop": false,
        "production_line": false,
        "warehouse": false
    },
    "data_status": {
        "material": {
            "exists": true,
            "is_active": true,
            "has_bom": true
        },
        "workshop": {
            "exists": true,
            "is_active": true
        },
        "production_line": {
            "exists": true,
            "is_active": true,
            "belongs_to_workshop": true
        }
    }
}
```

**实现要点：**
- 检查数据是否存在
- 检查数据是否启用
- 检查关联关系是否正确
- 检查BOM是否存在

---

## 6. 前端组件优化方案

### 6.1 统一的基础数据选择组件

**组件设计：**
```typescript
// MaterialSelector - 物料选择组件
<MaterialSelector
  value={materialUuid}
  onChange={handleMaterialChange}
  materialType="成品"  // 可选：原材料/半成品/成品
  showSearch={true}
  allowClear={true}
/>

// WorkshopSelector - 车间选择组件
<WorkshopSelector
  value={workshopUuid}
  onChange={handleWorkshopChange}
  showSearch={true}
/>

// ProductionLineSelector - 产线选择组件
<ProductionLineSelector
  value={productionLineUuid}
  onChange={handleProductionLineChange}
  workshopUuid={workshopUuid}  // 可选：筛选特定车间的产线
  showSearch={true}
/>

// WarehouseSelector - 仓库选择组件
<WarehouseSelector
  value={warehouseUuid}
  onChange={handleWarehouseChange}
  showSearch={true}
/>

// BOMTreeSelector - BOM树形选择组件
<BOMTreeSelector
  materialUuid={materialUuid}
  onSelect={handleBOMSelect}
  expandAll={false}
/>
```

**功能特性：**
- 支持下拉选择、树形选择、搜索选择
- 支持缓存，减少API调用
- 支持异步加载（大数据量场景）
- 支持自定义显示字段

---

## 7. 开发时间表

### 7.1 第一阶段：MVP支持优化（2周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第1周 | 批量查询接口、简化查询接口 | ⏳ |
| 第2周 | BOM查询优化、数据验证接口完善 | ⏳ |

### 7.2 第二阶段：概念统一和文档完善（0.5周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第2.5周 | 概念统一、文档更新 | ⏳ |

### 7.3 第三阶段：第一阶段扩展支持（1周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第3.5周 | 工艺路线查询优化、供应链数据API确认 | ⏳ |

### 7.4 第四阶段：前端组件优化（1周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第4.5周 | 统一选择组件、缓存机制 | ⏳ |

**总计：** 4.5周（约1个月）

---

## 8. 优先级排序

### 8.1 高优先级（快智造MVP必需）

1. **批量查询接口** - 快智造需要批量获取基础数据
2. **简化查询接口** - 下拉选择只需要必要字段
3. **BOM查询优化** - 快智造需要快速获取BOM清单
4. **数据验证接口完善** - 创建工单前需要验证

### 8.2 中优先级（快智造第一阶段需要）

1. **概念统一** - 明确工作中心概念
2. **Material类型确认** - 确保有material_type字段
3. **工艺路线查询优化** - MRP/LRP运算需要

### 8.3 低优先级（后续优化）

1. **Product和Material关系确认**
2. **功能精简**（提供功能开关）
3. **前端组件优化**（统一选择组件）

---

## 9. 总结

### 9.1 当前状态

**已满足快智造需求：**
- ✅ 工厂数据（Workshop、ProductionLine、Workstation）
- ✅ 仓库数据（Warehouse、StorageArea、StorageLocation）
- ✅ 物料数据（Material、BOM、MaterialGroup）
- ✅ 供应链数据（Customer、Supplier）
- ✅ 工艺数据（ProcessRoute、Operation）
- ✅ 不良品类型（DefectType）

**需要改进：**
- ⚠️ API查询优化（批量查询、简化查询）
- ⚠️ BOM查询优化（多层级展开）
- ⚠️ 数据验证接口完善
- ⚠️ 概念统一（工作中心、工厂层级）
- ⚠️ Factory实体确认（是否需要添加）

### 9.2 改进效果

**API优化后：**
- 快智造可以高效获取基础数据
- 减少API调用次数
- 提高用户体验

**概念统一后：**
- 减少概念混淆
- 提高开发效率
- 便于后续扩展

---

**文档创建时间：** 2025-12-27  
**文档作者：** Luigi Lu  
**预计完成时间：** 2026-01-27（4.5周后）

