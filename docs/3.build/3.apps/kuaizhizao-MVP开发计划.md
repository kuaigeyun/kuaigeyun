# 快智造（kuaizhizao）MVP开发计划

## 📋 项目概述

**应用名称：** 快智造（kuaizhizao）  
**应用代码：** `kuaizhizao`  
**定位：** 超轻量MES系统，面向中小型制造业企业  
**目标：** 易实施、快速上线、核心功能完整  
**开发策略：** MVP先行，收集反馈后迭代高级版  
**核心原则：** **聚焦业务单据，不管理基础数据** - 基础数据完全在主数据管理APP（master_data）中管理，快智造只通过API读取基础数据用于业务单据

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

**业务单据层（核心 - kuaizhizao开发）**
- ✅ 工单管理（工单创建、下达、执行、完工）
- ✅ 报工管理（扫码报工、进度汇报）
- ✅ 仓储操作（生产领料、成品入库、库存查询）
- ✅ 简单计划（手动创建工单，暂不支持MRP）

**报表层（基础 - kuaizhizao开发）**
- ✅ 生产看板（工单进度、状态监控）
- ✅ 库存查询（实时库存查询）

**说明：**
- 基础数据（工厂、车间、工作中心、物料、BOM、仓库）**不在快智造中管理**
- 基础数据**完全在主数据管理APP（master_data）中管理**
- 快智造通过API调用master_data获取基础数据（只读），用于业务单据
- 组织架构（部门、员工）使用系统级功能

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

#### 基础数据（复用 master_data，不在此应用开发）
**工厂建模** - 复用 `master_data` 应用
- Factory（工厂）
- Workshop（车间）
- ProductionLine（产线）/ WorkCenter（工作中心）

**产品管理** - 复用 `master_data` 应用
- Material（物料）
- BOM（物料清单）

**仓库管理** - 复用 `master_data` 应用
- Warehouse（仓库）
- StorageArea（库区）
- StorageLocation（库位）

**说明：** kuaizhizao 应用通过 API 调用 master_data 应用的基础数据，不重复开发。

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
[master_data 应用]
Factory
  └── Workshop
        └── ProductionLine/WorkCenter
Material
  ├── BOM (父子件关系)
  └── Warehouse

[kuaizhizao 应用 - 通过API调用master_data]
WorkOrder (工单)
  ├── WorkOrderProcess (工单工序)
  │     └── WorkReport (报工记录)
  ├── StockOut (生产领料) → 关联 master_data.Material
  └── StockIn (成品入库) → 关联 master_data.Material

Inventory (库存) → 关联 master_data.Material 和 master_data.Warehouse
```

**数据依赖关系：**
- WorkOrder 通过 `workshop_id` 关联 master_data.Workshop
- WorkOrder 通过 `work_center_id` 关联 master_data.ProductionLine/WorkCenter
- WorkOrder 通过 `material_id` 关联 master_data.Material
- StockIn/StockOut 通过 `material_id` 关联 master_data.Material
- StockIn/StockOut 通过 `warehouse_id` 关联 master_data.Warehouse
- Inventory 通过 `material_id` 和 `warehouse_id` 关联 master_data

---

## 3. MVP开发计划

### 3.1 开发阶段划分

#### 阶段1：基础架构搭建（0.5周）

**目标：** 搭建应用基础架构

**任务清单：**
- [ ] 创建应用目录结构
- [ ] 注册应用到系统（Application模型）
- [ ] 创建应用路由注册
- [ ] 创建应用菜单配置
- [ ] 创建核心数据模型（WorkOrder, WorkOrderProcess, WorkReport, Inventory, StockIn, StockOut）
- [ ] 创建数据库迁移脚本
- [ ] 集成 master_data API（调用基础数据）

**交付物：**
- ✅ 应用基础架构
- ✅ 核心数据模型
- ✅ 数据库表结构
- ✅ master_data API集成

#### 阶段2：基础数据API集成（0.5周）

**目标：** 集成主数据管理APP的基础数据API（只读）

**任务清单：**
- [ ] 创建 master_data API 客户端服务（只读调用）
- [ ] 实现工厂/车间/工作中心数据获取接口
- [ ] 实现物料/BOM数据获取接口
- [ ] 实现仓库数据获取接口
- [ ] 前端页面：基础数据选择组件（下拉选择、树形选择）
- [ ] 前端页面：基础数据展示组件（只读展示）
- [ ] 前端页面：提供跳转链接到 master_data 应用进行基础数据管理

**交付物：**
- ✅ master_data API客户端服务（只读）
- ✅ 基础数据选择/展示组件
- ✅ 基础数据管理跳转链接

**说明：**
- 快智造不提供基础数据的增删改功能
- 所有基础数据管理操作都在 master_data 应用中完成
- 快智造只读取基础数据用于业务单据

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
│   ├── work_order.py         # 工单模型
│   ├── work_order_process.py # 工单工序模型
│   ├── work_report.py        # 报工记录模型
│   ├── inventory.py          # 库存模型（kuaizhizao的库存操作记录）
│   ├── stock_in.py           # 入库单模型
│   └── stock_out.py          # 出库单模型
├── schemas/
│   ├── __init__.py
│   ├── work_order.py
│   ├── work_order_process.py
│   ├── work_report.py
│   ├── inventory.py
│   ├── stock_in.py
│   └── stock_out.py
├── services/
│   ├── __init__.py
│   ├── master_data_client.py # master_data API客户端服务
│   ├── work_order_service.py
│   ├── work_report_service.py
│   ├── inventory_service.py
│   └── stock_service.py
└── api/
    ├── __init__.py
    ├── router.py             # 路由汇总
    ├── work_orders.py        # 工单API
    ├── work_reports.py       # 报工API
    ├── inventories.py        # 库存API
    ├── stock_ins.py          # 入库单API
    └── stock_outs.py         # 出库单API
```

**说明：**
- 基础数据（Factory, Workshop, Material, BOM, Warehouse）通过 `master_data_client.py` 调用 master_data 应用的 API
- kuaizhizao 只开发 MES 核心功能相关的模型和API

#### 路由注册
```python
# apps/kuaizhizao/api/router.py
from fastapi import APIRouter
from .work_orders import router as work_orders_router
from .work_reports import router as work_reports_router
from .inventories import router as inventories_router
from .stock_ins import router as stock_ins_router
from .stock_outs import router as stock_outs_router

router = APIRouter(prefix="/kuaizhizao", tags=["快智造"])

router.include_router(work_orders_router, prefix="/work-orders", tags=["工单管理"])
router.include_router(work_reports_router, prefix="/work-reports", tags=["报工管理"])
router.include_router(inventories_router, prefix="/inventories", tags=["库存管理"])
router.include_router(stock_ins_router, prefix="/stock-ins", tags=["入库管理"])
router.include_router(stock_outs_router, prefix="/stock-outs", tags=["出库管理"])
```

**说明：**
- 基础数据API通过 master_data 应用提供，kuaizhizao 不重复实现
- kuaizhizao 只提供 MES 核心功能的 API

### 4.2 前端实现

#### 页面结构
```
riveredge-frontend/src/pages/apps/kuaizhizao/
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

**说明：**
- 基础数据管理页面（工厂、车间、物料、BOM、仓库）使用 master_data 应用的页面
- kuaizhizao 只开发 MES 核心功能页面
- 在工单、报工等页面中，通过选择组件调用 master_data API 获取基础数据

#### 菜单配置
```typescript
// 在应用注册时配置菜单
{
  code: 'kuaizhizao',
  name: '快智造',
  dependencies: ['master_data'], // 依赖主数据管理APP
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
      path: '/apps/kuaizhizao/stock-ins',
      name: '入库管理',
      icon: 'InboxOutlined'
    },
    {
      path: '/apps/kuaizhizao/stock-outs',
      name: '出库管理',
      icon: 'InboxInlined'
    }
  ]
}
```

**说明：**
- 基础数据管理菜单在 master_data 应用中，kuaizhizao 不重复配置
- kuaizhizao 菜单只包含 MES 核心功能
- 在工单创建等页面中，通过链接跳转到 master_data 应用的基础数据管理页面

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
| 第1周 | 基础架构搭建 | 0.5周 | ⏳ |
| 第1周 | 基础数据集成 | 0.5周 | ⏳ |
| 第2-3周 | 工单管理 | 1.5周 | ⏳ |
| 第3-4周 | 报工管理 | 1周 | ⏳ |
| 第4-5周 | 仓储管理 | 1周 | ⏳ |
| 第5周 | 生产看板 | 0.5周 | ⏳ |
| 第5-6周 | 测试与优化 | 1周 | ⏳ |

**总计：** 5-6周（约1.5个月）

**优化说明：**
- 移除基础数据管理开发时间（复用 master_data）
- 减少基础架构搭建时间（不需要开发基础数据模型）
- 增加基础数据集成时间（API集成和组件开发）

### 5.2 里程碑

- **里程碑1（第1周末）：** 基础架构和master_data集成完成
- **里程碑2（第3周末）：** 工单管理完成
- **里程碑3（第4周末）：** 报工管理完成
- **里程碑4（第5周末）：** 仓储管理和看板完成
- **里程碑5（第6周末）：** MVP发布

---

## 6. 易实施、快速上线策略

### 6.1 简化配置

**策略1：依赖 master_data 应用**
- **基础数据管理完全在 master_data 应用中完成**
- kuaizhizao 应用启动时检查 master_data 是否已安装
- 如果未安装，提示用户先安装 master_data 应用
- 快智造不提供基础数据管理功能，只读取基础数据

**策略2：提供默认配置**
- 提供示例工单模板
- 提供示例报工模板

**策略3：一键初始化**
- 提供初始化脚本，一键创建示例工单数据
- 提供示例数据导入功能

**策略4：减少必填项**
- 只保留最核心的必填字段
- 其他字段提供默认值

### 6.2 快速上手

**策略1：引导式配置**
- 首次使用提示用户**先在 master_data 应用中配置基础数据**
- 提供跳转链接到 master_data 应用进行基础数据管理
- 分步骤引导用户完成工单配置（使用已配置的基础数据）

**策略2：帮助文档**
- 提供简洁的操作手册
- 说明与 master_data 应用的集成关系
- 提供视频教程（可选）

**策略3：示例数据**
- 提供完整的示例工单数据
- 用户可以基于示例数据快速理解系统
- 示例数据依赖 master_data 的基础数据

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

**风险1：master_data API集成问题**
- **应对：** 提前了解 master_data API 接口规范（只读接口）
- **缓解措施：** 创建统一的 API 客户端，封装错误处理和缓存机制
- **说明：** 快智造只调用 master_data 的查询接口，不涉及增删改操作

**风险2：数据模型设计不合理**
- **应对：** 充分调研中小型制造业需求，参考行业最佳实践
- **缓解措施：** MVP阶段保持模型简单，后续可扩展

**风险3：性能问题**
- **应对：** 提前进行性能测试，优化查询
- **缓解措施：** 使用缓存、索引优化，减少对 master_data API 的调用频率

### 9.2 业务风险

**风险1：master_data 应用未安装**
- **应对：** 应用启动时检查依赖，提示用户先安装 master_data 应用
- **缓解措施：** 提供安装指引和快速安装脚本
- **说明：** 快智造依赖 master_data 的基础数据，必须先安装并配置基础数据

**风险2：功能不符合用户需求**
- **应对：** MVP阶段聚焦核心功能，快速收集反馈
- **缓解措施：** 预留扩展接口，便于后续迭代

**风险3：实施难度大**
- **应对：** 简化配置，提供引导和示例
- **缓解措施：** 提供实施支持服务，说明与 master_data 的集成关系

### 9.3 时间风险

**风险1：开发时间超出预期**
- **应对：** 分阶段开发，优先完成核心功能
- **缓解措施：** 预留缓冲时间（20%）

---

## 10. 总结

### 10.1 MVP核心价值

1. **快速上线：** 5-6周完成MVP开发
2. **易实施：** 简化配置，提供引导
3. **核心功能完整：** 覆盖MES核心业务流程（工单、报工、仓储）
4. **职责清晰：** 基础数据在 master_data 管理，快智造聚焦业务单据
5. **可扩展：** 为高级版预留扩展空间

### 10.2 关键成功因素

1. **聚焦业务单据：** 不管理基础数据，专注MES核心业务流程
2. **职责分离：** 基础数据管理在 master_data，快智造只读取使用
3. **用户体验优先：** 简化操作流程，提供清晰的基础数据选择界面
4. **快速迭代：** 收集反馈，持续优化
5. **技术规范：** 遵循项目代码规范

---

**文档创建时间：** 2025-12-27  
**文档作者：** Luigi Lu  
**预计MVP完成时间：** 2026-02-07（6周后）

