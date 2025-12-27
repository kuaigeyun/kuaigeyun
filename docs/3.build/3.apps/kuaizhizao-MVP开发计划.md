# 快智造（kuaizhizao）MVP开发计划

## 📋 项目概述

**应用名称：** 快智造（kuaizhizao）  
**应用代码：** `kuaizhizao`  
**定位：** 超轻量MES系统，面向中小型制造业企业  
**目标：** 易实施、快速上线、核心功能完整  
**开发策略：** MVP先行，收集反馈后迭代高级版

---

## 1. MVP功能范围定义

### 1.1 MVP核心原则

1. **最小可行产品（MVP）**
   - 只包含最核心、最必要的功能
   - 能够支撑基本的生产管理流程
   - 快速上线，快速验证

2. **易实施、快速上线**
   - 简化配置，减少初始化工作量
   - 提供默认配置和模板
   - 一键导入示例数据

3. **聚焦MES核心**
   - 以生产执行为核心
   - 简化计划管理（暂不支持MRP/LRP）
   - 简化质量管理（基础检验即可）

### 1.2 MVP功能清单

#### ✅ 包含功能（MVP核心）

**基础数据层（最小化）**
- ✅ 产品管理（物料主数据、BOM管理）
- ✅ 工厂建模（工厂、车间、工作中心）
- ✅ 组织架构（部门、员工）- 复用系统级功能

**业务单据层（核心）**
- ✅ 工单管理（工单创建、下达、执行、完工）
- ✅ 报工管理（扫码报工、进度汇报）
- ✅ 仓储管理（生产领料、成品入库）
- ✅ 简单计划（手动创建工单，暂不支持MRP）

**报表层（基础）**
- ✅ 生产看板（工单进度、状态监控）
- ✅ 库存查询（实时库存查询）

#### ❌ 暂不包含（高级版）

**计划管理**
- ❌ MRP/LRP运算（高级版）
- ❌ 高级排产（高级版）
- ❌ 销售预测/订单管理（高级版）

**质量管理**
- ❌ 来料检验（高级版）
- ❌ 过程检验（高级版）
- ❌ 成品检验（高级版）

**财务协同**
- ❌ 应付管理（高级版）
- ❌ 应收管理（高级版）

**高级报表**
- ❌ 库存周转率（高级版）
- ❌ 工单绩效分析（高级版）
- ❌ 质量合格率统计（高级版）

---

## 2. MVP数据模型设计

### 2.1 核心数据实体

#### 工厂建模
```
Factory（工厂）
├── id, uuid, name, code, description
├── tenant_id, is_active
└── created_at, updated_at

Workshop（车间）
├── id, uuid, name, code, description
├── factory_id, tenant_id, is_active
└── created_at, updated_at

WorkCenter（工作中心）
├── id, uuid, name, code, description
├── workshop_id, tenant_id, is_active
└── created_at, updated_at
```

#### 产品管理
```
Material（物料）
├── id, uuid, code, name, specification
├── material_type（原材料/半成品/成品）
├── unit（单位）, tenant_id
└── created_at, updated_at

BOM（物料清单）
├── id, uuid, parent_material_id（父件）
├── child_material_id（子件）
├── quantity（用量）, unit
├── tenant_id
└── created_at, updated_at
```

#### 生产执行
```
WorkOrder（工单）
├── id, uuid, work_order_no（工单号）
├── material_id（产品）, quantity（数量）
├── planned_start_time, planned_end_time
├── workshop_id, work_center_id
├── status（创建/下达/执行/完工/取消）
├── tenant_id, created_by
└── created_at, updated_at

WorkOrderProcess（工单工序）
├── id, uuid, work_order_id
├── process_name（工序名称）
├── work_center_id, sequence（工序顺序）
├── planned_quantity, actual_quantity
├── status（待执行/执行中/已完成）
└── created_at, updated_at

WorkReport（报工记录）
├── id, uuid, work_order_id, work_order_process_id
├── report_time, reporter_id（报工人）
├── quantity（完成数量）, qualified_quantity（合格数）
├── work_hours（工时）, remark
└── created_at, updated_at
```

#### 仓储管理
```
Warehouse（仓库）
├── id, uuid, name, code, description
├── tenant_id, is_active
└── created_at, updated_at

Inventory（库存）
├── id, uuid, warehouse_id, material_id
├── quantity（数量）, available_quantity（可用数量）
├── tenant_id
└── updated_at

StockIn（入库单）
├── id, uuid, warehouse_id, material_id
├── quantity, stock_in_type（采购入库/生产入库/其他）
├── work_order_id（关联工单，可选）
├── tenant_id, created_by
└── created_at, updated_at

StockOut（出库单）
├── id, uuid, warehouse_id, material_id
├── quantity, stock_out_type（生产领料/销售出库/其他）
├── work_order_id（关联工单，可选）
├── tenant_id, created_by
└── created_at, updated_at
```

### 2.2 数据关系图

```
Factory
  └── Workshop
        └── WorkCenter
              └── WorkOrder
                    ├── WorkOrderProcess
                    │     └── WorkReport
                    └── StockOut (生产领料)
                          └── StockIn (成品入库)

Material
  ├── BOM (父子件关系)
  └── Inventory (库存)
        └── Warehouse
```

---

## 3. MVP开发计划

### 3.1 开发阶段划分

#### 阶段1：基础架构搭建（1周）

**目标：** 搭建应用基础架构

**任务清单：**
- [ ] 创建应用目录结构
- [ ] 注册应用到系统（Application模型）
- [ ] 创建应用路由注册
- [ ] 创建应用菜单配置
- [ ] 创建基础数据模型（Factory, Workshop, WorkCenter, Material, BOM）
- [ ] 创建数据库迁移脚本

**交付物：**
- ✅ 应用基础架构
- ✅ 基础数据模型
- ✅ 数据库表结构

#### 阶段2：基础数据管理（1周）

**目标：** 实现基础数据管理功能

**任务清单：**
- [ ] 工厂管理API（CRUD）
- [ ] 车间管理API（CRUD）
- [ ] 工作中心管理API（CRUD）
- [ ] 物料管理API（CRUD）
- [ ] BOM管理API（CRUD）
- [ ] 前端页面：工厂管理
- [ ] 前端页面：车间管理
- [ ] 前端页面：工作中心管理
- [ ] 前端页面：物料管理
- [ ] 前端页面：BOM管理

**交付物：**
- ✅ 基础数据管理API
- ✅ 基础数据管理页面

#### 阶段3：工单管理（1.5周）

**目标：** 实现工单管理核心功能

**任务清单：**
- [ ] 工单管理API（创建、下达、查询、状态更新）
- [ ] 工单工序管理API
- [ ] 前端页面：工单列表
- [ ] 前端页面：工单创建/编辑
- [ ] 前端页面：工单详情
- [ ] 工单状态流转逻辑

**交付物：**
- ✅ 工单管理API
- ✅ 工单管理页面

#### 阶段4：报工管理（1周）

**目标：** 实现报工管理功能

**任务清单：**
- [ ] 报工API（扫码报工、进度汇报）
- [ ] 报工记录查询API
- [ ] 前端页面：报工界面（支持扫码）
- [ ] 前端页面：报工记录查询
- [ ] 报工后自动更新工单进度

**交付物：**
- ✅ 报工管理API
- ✅ 报工管理页面

#### 阶段5：仓储管理（1周）

**目标：** 实现基础仓储管理功能

**任务清单：**
- [ ] 仓库管理API（CRUD）
- [ ] 库存管理API（查询、更新）
- [ ] 入库单API（创建、查询）
- [ ] 出库单API（创建、查询）
- [ ] 前端页面：仓库管理
- [ ] 前端页面：库存查询
- [ ] 前端页面：入库单管理
- [ ] 前端页面：出库单管理
- [ ] 生产领料功能（关联工单）
- [ ] 成品入库功能（关联工单）

**交付物：**
- ✅ 仓储管理API
- ✅ 仓储管理页面

#### 阶段6：生产看板（0.5周）

**目标：** 实现生产看板功能

**任务清单：**
- [ ] 生产看板API（工单进度、状态统计）
- [ ] 前端页面：生产看板（实时数据展示）
- [ ] 工单进度可视化

**交付物：**
- ✅ 生产看板API
- ✅ 生产看板页面

#### 阶段7：测试与优化（1周）

**目标：** 测试MVP功能，优化用户体验

**任务清单：**
- [ ] 功能测试（所有功能点）
- [ ] 性能测试（大数据量场景）
- [ ] 用户体验优化
- [ ] 文档编写（用户手册、API文档）
- [ ] 示例数据准备

**交付物：**
- ✅ 测试报告
- ✅ 用户手册
- ✅ 示例数据

---

## 4. 技术实现方案

### 4.1 后端实现

#### 应用结构
```
riveredge-backend/src/apps/kuaizhizao/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── factory.py          # 工厂模型
│   ├── workshop.py          # 车间模型
│   ├── work_center.py       # 工作中心模型
│   ├── material.py          # 物料模型
│   ├── bom.py               # BOM模型
│   ├── work_order.py        # 工单模型
│   ├── work_order_process.py # 工单工序模型
│   ├── work_report.py       # 报工记录模型
│   ├── warehouse.py         # 仓库模型
│   ├── inventory.py         # 库存模型
│   ├── stock_in.py          # 入库单模型
│   └── stock_out.py         # 出库单模型
├── schemas/
│   ├── __init__.py
│   ├── factory.py
│   ├── workshop.py
│   ├── work_center.py
│   ├── material.py
│   ├── bom.py
│   ├── work_order.py
│   ├── work_order_process.py
│   ├── work_report.py
│   ├── warehouse.py
│   ├── inventory.py
│   ├── stock_in.py
│   └── stock_out.py
├── services/
│   ├── __init__.py
│   ├── factory_service.py
│   ├── workshop_service.py
│   ├── work_center_service.py
│   ├── material_service.py
│   ├── bom_service.py
│   ├── work_order_service.py
│   ├── work_report_service.py
│   ├── warehouse_service.py
│   ├── inventory_service.py
│   └── stock_service.py
└── api/
    ├── __init__.py
    ├── factories.py          # 工厂API
    ├── workshops.py          # 车间API
    ├── work_centers.py       # 工作中心API
    ├── materials.py          # 物料API
    ├── boms.py               # BOM API
    ├── work_orders.py        # 工单API
    ├── work_reports.py       # 报工API
    ├── warehouses.py         # 仓库API
    ├── inventories.py        # 库存API
    ├── stock_ins.py          # 入库单API
    └── stock_outs.py          # 出库单API
```

#### 路由注册
```python
# apps/kuaizhizao/api/__init__.py
from fastapi import APIRouter
from .factories import router as factories_router
from .workshops import router as workshops_router
# ... 其他路由

router = APIRouter(prefix="/kuaizhizao", tags=["快智造"])

router.include_router(factories_router, prefix="/factories", tags=["工厂管理"])
router.include_router(workshops_router, prefix="/workshops", tags=["车间管理"])
# ... 其他路由
```

### 4.2 前端实现

#### 页面结构
```
riveredge-frontend/src/pages/apps/kuaizhizao/
├── factories/
│   └── list/
│       └── index.tsx
├── workshops/
│   └── list/
│       └── index.tsx
├── work-centers/
│   └── list/
│       └── index.tsx
├── materials/
│   └── list/
│       └── index.tsx
├── boms/
│   └── list/
│       └── index.tsx
├── work-orders/
│   ├── list/
│   │   └── index.tsx
│   └── detail/
│       └── index.tsx
├── work-reports/
│   ├── report/
│   │   └── index.tsx
│   └── list/
│       └── index.tsx
├── warehouses/
│   └── list/
│       └── index.tsx
├── inventories/
│   └── list/
│       └── index.tsx
├── stock-ins/
│   └── list/
│       └── index.tsx
├── stock-outs/
│   └── list/
│       └── index.tsx
└── dashboard/
    └── index.tsx
```

#### 菜单配置
```typescript
// 在应用注册时配置菜单
{
  code: 'kuaizhizao',
  name: '快智造',
  menu_items: [
    {
      path: '/apps/kuaizhizao/dashboard',
      name: '生产看板',
      icon: 'DashboardOutlined'
    },
    {
      path: '/apps/kuaizhizao/work-orders',
      name: '工单管理',
      icon: 'FileTextOutlined'
    },
    {
      path: '/apps/kuaizhizao/work-reports',
      name: '报工管理',
      icon: 'CheckCircleOutlined'
    },
    {
      path: '/apps/kuaizhizao/inventories',
      name: '库存查询',
      icon: 'DatabaseOutlined'
    },
    {
      path: '/apps/kuaizhizao/base-data',
      name: '基础数据',
      icon: 'SettingOutlined',
      children: [
        { path: '/apps/kuaizhizao/factories', name: '工厂管理' },
        { path: '/apps/kuaizhizao/workshops', name: '车间管理' },
        { path: '/apps/kuaizhizao/work-centers', name: '工作中心' },
        { path: '/apps/kuaizhizao/materials', name: '物料管理' },
        { path: '/apps/kuaizhizao/boms', name: 'BOM管理' },
        { path: '/apps/kuaizhizao/warehouses', name: '仓库管理' }
      ]
    }
  ]
}
```

### 4.3 核心业务流程

#### 工单创建流程
```
1. 用户选择产品（Material）
2. 输入生产数量
3. 选择车间和工作中心
4. 设置计划开始/结束时间
5. 系统创建工单（状态：创建）
6. 用户下达工单（状态：下达）
```

#### 报工流程
```
1. 工人扫码工单二维码
2. 系统显示工单信息
3. 工人选择工序
4. 输入完成数量、合格数量、工时
5. 提交报工
6. 系统更新工单进度
7. 如果所有工序完成，工单状态变为"完工"
```

#### 生产领料流程
```
1. 工单下达后，系统根据BOM生成领料需求
2. 车间办理生产领料（创建出库单）
3. 系统检查库存是否充足
4. 扣减库存
5. 关联工单
```

#### 成品入库流程
```
1. 工单报工完成
2. 车间办理成品入库（创建入库单）
3. 输入入库数量
4. 系统增加库存
5. 关联工单
```

---

## 5. 开发时间表

### 5.1 详细时间计划

| 阶段 | 任务 | 时间 | 状态 |
|------|------|------|------|
| 第1周 | 基础架构搭建 | 1周 | ⏳ |
| 第2周 | 基础数据管理 | 1周 | ⏳ |
| 第3-4周 | 工单管理 | 1.5周 | ⏳ |
| 第4周 | 报工管理 | 1周 | ⏳ |
| 第5周 | 仓储管理 | 1周 | ⏳ |
| 第5周 | 生产看板 | 0.5周 | ⏳ |
| 第6周 | 测试与优化 | 1周 | ⏳ |

**总计：** 6周（约1.5个月）

### 5.2 里程碑

- **里程碑1（第1周末）：** 基础架构完成
- **里程碑2（第2周末）：** 基础数据管理完成
- **里程碑3（第4周末）：** 工单和报工管理完成
- **里程碑4（第5周末）：** 仓储管理和看板完成
- **里程碑5（第6周末）：** MVP发布

---

## 6. 易实施、快速上线策略

### 6.1 简化配置

**策略1：提供默认配置**
- 默认创建一个工厂、一个车间、一个工作中心
- 提供示例物料和BOM模板
- 提供示例工单模板

**策略2：一键初始化**
- 提供初始化脚本，一键创建基础数据
- 提供示例数据导入功能

**策略3：减少必填项**
- 只保留最核心的必填字段
- 其他字段提供默认值

### 6.2 快速上手

**策略1：引导式配置**
- 首次使用提供配置向导
- 分步骤引导用户完成基础配置

**策略2：帮助文档**
- 提供简洁的操作手册
- 提供视频教程（可选）

**策略3：示例数据**
- 提供完整的示例数据
- 用户可以基于示例数据快速理解系统

### 6.3 移动端支持

**策略1：响应式设计**
- 所有页面支持移动端访问
- 报工界面优先考虑移动端体验

**策略2：扫码功能**
- 支持工单二维码扫码
- 支持物料条码扫码

---

## 7. 高级版功能规划（后续迭代）

### 7.1 计划管理模块

- MRP/LRP运算
- 高级排产（甘特图）
- 销售预测/订单管理

### 7.2 质量管理模块

- 来料检验
- 过程检验
- 成品检验
- 质量合格率统计

### 7.3 财务协同模块

- 应付管理
- 应收管理
- 成本核算

### 7.4 高级报表

- 库存周转率分析
- 工单绩效分析
- 设备利用率分析
- 生产效率分析

### 7.5 其他高级功能

- 设备管理
- 工艺路线管理
- 批次管理
- 序列号管理

---

## 8. 成功标准

### 8.1 MVP成功标准

- ✅ 能够创建和管理工单
- ✅ 能够进行报工操作
- ✅ 能够管理库存（入库、出库）
- ✅ 能够查看生产看板
- ✅ 系统响应速度<2秒
- ✅ 支持50+并发用户

### 8.2 用户体验标准

- ✅ 新用户30分钟内完成基础配置
- ✅ 报工操作<30秒完成
- ✅ 移动端体验良好

### 8.3 技术标准

- ✅ 代码规范符合项目标准
- ✅ 单元测试覆盖率>60%
- ✅ API文档完整
- ✅ 用户手册完整

---

## 9. 风险与应对

### 9.1 技术风险

**风险1：数据模型设计不合理**
- **应对：** 充分调研中小型制造业需求，参考行业最佳实践
- **缓解措施：** MVP阶段保持模型简单，后续可扩展

**风险2：性能问题**
- **应对：** 提前进行性能测试，优化查询
- **缓解措施：** 使用缓存、索引优化

### 9.2 业务风险

**风险1：功能不符合用户需求**
- **应对：** MVP阶段聚焦核心功能，快速收集反馈
- **缓解措施：** 预留扩展接口，便于后续迭代

**风险2：实施难度大**
- **应对：** 简化配置，提供引导和示例
- **缓解措施：** 提供实施支持服务

### 9.3 时间风险

**风险1：开发时间超出预期**
- **应对：** 分阶段开发，优先完成核心功能
- **缓解措施：** 预留缓冲时间（20%）

---

## 10. 总结

### 10.1 MVP核心价值

1. **快速上线：** 6周完成MVP开发
2. **易实施：** 简化配置，提供引导
3. **核心功能完整：** 覆盖MES核心流程
4. **可扩展：** 为高级版预留扩展空间

### 10.2 关键成功因素

1. **聚焦核心功能：** 不做过度设计
2. **用户体验优先：** 简化操作流程
3. **快速迭代：** 收集反馈，持续优化
4. **技术规范：** 遵循项目代码规范

---

**文档创建时间：** 2025-12-27  
**文档作者：** Luigi Lu  
**预计MVP完成时间：** 2026-02-07（6周后）

