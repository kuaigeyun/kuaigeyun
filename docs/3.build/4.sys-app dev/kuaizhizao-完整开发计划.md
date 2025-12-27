# 快智造（kuaizhizao）完整开发计划

## 📋 项目概述

**应用名称：** 快智造（kuaizhizao）  
**应用代码：** `kuaizhizao`  
**定位：** 以MES为核心，覆盖MTS/MTO模式的极简制造业管理系统  
**目标：** 易实施、快速上线、功能完整  
**开发策略：** MVP先行，分阶段迭代，逐步完善

---

## 1. 功能范围定义（基于快格轻制造APP规划）

### 1.1 系统整体架构

根据"快格轻制造APP.md"的规划，系统分为三层：

**基础数据层** - 由 master_data 应用管理
- 组织与资源（部门、员工）- 系统级功能
- 工厂建模（工厂、车间、工作中心）- master_data
- 产品与工艺（物料、BOM、工艺路线）- master_data
- 供应链主数据（客户、供应商）- master_data

**业务单据层** - kuaizhizao 应用开发
- 计划管理（MTS/MTO模式）
- 生产执行（MES核心）
- 质量管理
- 物流与仓储
- 财务协同

**报表层** - kuaizhizao 应用开发
- 生产监控
- 经营分析

### 1.2 完整功能清单

#### ✅ MVP阶段功能（核心功能，快速上线）

**生产执行（MES核心）**
- ✅ 工单管理（工单列表、工单创建、工单下达、状态跟踪）
- ✅ 报工管理（扫码报工、进度汇报、工时记录）

**物流与仓储（基础）**
- ✅ 生产领料（根据工单和BOM生成领料需求）
- ✅ 成品入库（工单完工后入库）
- ✅ 库存查询（实时库存查询）

**报表层（基础）**
- ✅ 生产看板（工单进度、状态监控）

#### ⏳ 第一阶段扩展功能（MVP后1-2个月）

**计划管理（MTS/MTO模式）**
- ⏳ 需求管理
  - 销售预测（MTS模式起点）
  - 销售订单（MTO模式起点）
- ⏳ 计划排程
  - MRP运算（MTS模式）
  - LRP运算（MTO模式）
- ⏳ 高级排产
  - 排产甘特图（可视化排程）

**物流与仓储（扩展）**
- ⏳ 采购入库（采购物料入库）
- ⏳ 生产退料（工单剩余或不良物料退回）
- ⏳ 销售出库（MTO直接关联订单，MTS从库存发货）

**报表层（扩展）**
- ⏳ 设备看板（设备状态监控）

#### ⏳ 第二阶段扩展功能（第一阶段后2-3个月）

**质量管理**
- ⏳ 来料检验（采购到货物料质量检验）
- ⏳ 过程检验（生产报工环节关键工序检验）
- ⏳ 成品检验（生产完工成品最终检验）

**财务协同**
- ⏳ 应付管理（根据采购入库单与供应商对账和付款申请）
- ⏳ 应收管理（根据销售出库单与客户对账和收款核销）

**报表层（高级）**
- ⏳ 库存报表
  - 库存周转率分析
- ⏳ 生产报表
  - 工单绩效分析（准时完工率、计划达成率）
- ⏳ 质量报表
  - 质量合格率统计（按产品、工序等维度）

---

## 2. 数据模型设计（完整版）

### 2.1 基础数据（master_data应用）

**工厂建模：**
- Factory（工厂）- 需要确认是否需要添加
- Workshop（车间）
- ProductionLine（产线/工作中心）
- Workstation（工位）- 可选

**产品与工艺：**
- Material（物料）
- BOM（物料清单）
- ProcessRoute（工艺路线）- MVP后需要
- Operation（工序）- MVP后需要

**供应链主数据：**
- Customer（客户）- 第一阶段需要
- Supplier（供应商）- 第一阶段需要

### 2.2 业务单据数据（kuaizhizao应用）

#### MVP阶段数据模型

**工单管理：**
```
WorkOrder（工单）
├── id, uuid, work_order_no（工单号）
├── material_id（产品，关联master_data.Material）
├── quantity（数量）
├── planned_start_time, planned_end_time
├── workshop_id（关联master_data.Workshop）
├── production_line_id（关联master_data.ProductionLine）
├── status（创建/下达/执行/完工/取消）
├── order_type（MTS/MTO，MVP阶段默认为手动创建）
├── tenant_id, created_by
└── created_at, updated_at

WorkOrderProcess（工单工序）
├── id, uuid, work_order_id
├── process_name（工序名称）
├── production_line_id, sequence（工序顺序）
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

**仓储管理：**
```
Inventory（库存）
├── id, uuid, warehouse_id（关联master_data.Warehouse）
├── material_id（关联master_data.Material）
├── quantity（数量）, available_quantity（可用数量）
├── reserved_quantity（预留数量，MTO订单专属库存）
├── tenant_id
└── updated_at

StockIn（入库单）
├── id, uuid, warehouse_id, material_id
├── quantity, stock_in_type（采购入库/生产入库/其他）
├── work_order_id（关联工单，可选）
├── purchase_order_id（关联采购单，可选）
├── tenant_id, created_by
└── created_at, updated_at

StockOut（出库单）
├── id, uuid, warehouse_id, material_id
├── quantity, stock_out_type（生产领料/销售出库/其他）
├── work_order_id（关联工单，可选）
├── sales_order_id（关联销售订单，可选）
├── tenant_id, created_by
└── created_at, updated_at
```

#### 第一阶段扩展数据模型

**需求管理：**
```
SalesForecast（销售预测 - MTS模式）
├── id, uuid, forecast_no（预测单号）
├── material_id（产品）
├── forecast_quantity（预测数量）
├── forecast_date（预测日期）
├── tenant_id, created_by
└── created_at, updated_at

SalesOrder（销售订单 - MTO模式）
├── id, uuid, order_no（订单号）
├── customer_id（关联master_data.Customer）
├── material_id（产品）
├── order_quantity（订单数量）
├── delivery_date（交货日期）
├── status（待处理/已排产/生产中/已完成/已取消）
├── tenant_id, created_by
└── created_at, updated_at
```

**计划排程：**
```
MRPResult（MRP运算结果）
├── id, uuid, mrp_no（MRP单号）
├── forecast_id（关联销售预测）
├── material_id（物料）
├── required_quantity（需求数量）
├── available_quantity（可用库存）
├── shortage_quantity（缺料数量）
├── suggested_work_order_quantity（建议工单数量）
├── suggested_purchase_quantity（建议采购数量）
├── tenant_id, created_by
└── created_at, updated_at

LRPResult（LRP运算结果）
├── id, uuid, lrp_no（LRP单号）
├── sales_order_id（关联销售订单）
├── material_id（物料）
├── required_quantity（需求数量）
├── available_quantity（可用库存）
├── shortage_quantity（缺料数量）
├── suggested_work_order_quantity（建议工单数量）
├── suggested_purchase_quantity（建议采购数量）
├── tenant_id, created_by
└── created_at, updated_at
```

**高级排产：**
```
ProductionSchedule（排产计划）
├── id, uuid, schedule_no（排产单号）
├── work_order_id（关联工单）
├── production_line_id（工作中心）
├── planned_start_time, planned_end_time
├── actual_start_time, actual_end_time
├── status（已排产/执行中/已完成）
├── tenant_id, created_by
└── created_at, updated_at
```

**采购管理：**
```
PurchaseOrder（采购单）
├── id, uuid, purchase_no（采购单号）
├── supplier_id（关联master_data.Supplier）
├── material_id（物料）
├── quantity（采购数量）
├── expected_delivery_date（预计到货日期）
├── status（待采购/已采购/部分到货/已到货/已取消）
├── tenant_id, created_by
└── created_at, updated_at
```

#### 第二阶段扩展数据模型

**质量管理：**
```
IncomingInspection（来料检验）
├── id, uuid, inspection_no（检验单号）
├── purchase_order_id（关联采购单）
├── material_id（物料）
├── quantity（检验数量）
├── qualified_quantity（合格数量）
├── defective_quantity（不良数量）
├── inspection_result（合格/不合格/部分合格）
├── inspector_id（检验人）
├── tenant_id, created_by
└── created_at, updated_at

ProcessInspection（过程检验）
├── id, uuid, inspection_no（检验单号）
├── work_order_id（关联工单）
├── work_order_process_id（关联工单工序）
├── quantity（检验数量）
├── qualified_quantity（合格数量）
├── defective_quantity（不良数量）
├── defect_type_id（不良品类型，关联master_data.DefectType）
├── inspection_result（合格/不合格）
├── inspector_id（检验人）
├── tenant_id, created_by
└── created_at, updated_at

FinishedProductInspection（成品检验）
├── id, uuid, inspection_no（检验单号）
├── work_order_id（关联工单）
├── quantity（检验数量）
├── qualified_quantity（合格数量）
├── defective_quantity（不良数量）
├── inspection_result（合格/不合格）
├── inspector_id（检验人）
├── tenant_id, created_by
└── created_at, updated_at
```

**财务协同：**
```
AccountsPayable（应付管理）
├── id, uuid, payable_no（应付单号）
├── purchase_order_id（关联采购单）
├── supplier_id（关联master_data.Supplier）
├── amount（应付金额）
├── paid_amount（已付金额）
├── status（待付款/部分付款/已付款）
├── tenant_id, created_by
└── created_at, updated_at

AccountsReceivable（应收管理）
├── id, uuid, receivable_no（应收单号）
├── sales_order_id（关联销售订单）
├── customer_id（关联master_data.Customer）
├── amount（应收金额）
├── received_amount（已收金额）
├── status（待收款/部分收款/已收款）
├── tenant_id, created_by
└── created_at, updated_at
```

---

## 3. 开发阶段规划

### 3.1 MVP阶段（6周）- 核心功能

**目标：** 快速上线，验证核心MES功能

**功能范围：**
- 工单管理（创建、下达、执行、完工）
- 报工管理（扫码报工、进度汇报）
- 仓储操作（生产领料、成品入库、库存查询）
- 生产看板（工单进度、状态监控）

**数据模型：**
- WorkOrder、WorkOrderProcess、WorkReport
- Inventory、StockIn、StockOut

**依赖：**
- master_data：工厂数据、物料数据、BOM数据、仓库数据

### 3.2 第一阶段扩展（8-10周）- MTS/MTO模式

**目标：** 支持MTS/MTO模式，完善计划管理

**功能范围：**
- 需求管理（销售预测、销售订单）
- 计划排程（MRP运算、LRP运算）
- 高级排产（排产甘特图）
- 采购管理（采购单、采购入库）
- 销售出库（MTO关联订单、MTS从库存发货）
- 生产退料
- 设备看板

**数据模型：**
- SalesForecast、SalesOrder
- MRPResult、LRPResult
- ProductionSchedule
- PurchaseOrder

**依赖：**
- master_data：客户数据、供应商数据、工艺路线数据（用于MRP/LRP）

### 3.3 第二阶段扩展（6-8周）- 质量与财务

**目标：** 完善质量管理，增加财务协同

**功能范围：**
- 质量管理（来料检验、过程检验、成品检验）
- 财务协同（应付管理、应收管理）
- 高级报表（库存周转率、工单绩效分析、质量合格率统计）

**数据模型：**
- IncomingInspection、ProcessInspection、FinishedProductInspection
- AccountsPayable、AccountsReceivable

**依赖：**
- master_data：不良品类型数据（DefectType）

---

## 4. MVP阶段详细开发计划

### 4.1 阶段1：基础架构搭建（0.5周）

**目标：** 搭建应用基础架构

**任务清单：**
- [ ] 创建应用目录结构
- [ ] 注册应用到系统（Application模型）
- [ ] 创建应用路由注册
- [ ] 创建应用菜单配置
- [ ] 创建核心数据模型（WorkOrder、WorkOrderProcess、WorkReport、Inventory、StockIn、StockOut）
- [ ] 创建数据库迁移脚本
- [ ] 集成 master_data API（调用基础数据）

**交付物：**
- ✅ 应用基础架构
- ✅ 核心数据模型
- ✅ 数据库表结构
- ✅ master_data API集成

### 4.2 阶段2：基础数据API集成（0.5周）

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

### 4.3 阶段3：工单管理（1.5周）

**目标：** 实现工单管理核心功能

**任务清单：**
- [ ] 工单管理API（创建、下达、查询、状态更新）
- [ ] 工单工序管理API
- [ ] 工单号自动生成（基于编码规则）
- [ ] 前端页面：工单列表
- [ ] 前端页面：工单创建/编辑（选择物料、车间、工作中心）
- [ ] 前端页面：工单详情
- [ ] 工单状态流转逻辑（创建→下达→执行→完工）
- [ ] 工单二维码生成（用于扫码报工）

**交付物：**
- ✅ 工单管理API
- ✅ 工单管理页面
- ✅ 工单状态流转逻辑

### 4.4 阶段4：报工管理（1周）

**目标：** 实现报工管理功能

**任务清单：**
- [ ] 报工API（扫码报工、进度汇报）
- [ ] 报工记录查询API
- [ ] 前端页面：报工界面（支持扫码，移动端优化）
- [ ] 前端页面：报工记录查询
- [ ] 报工后自动更新工单进度
- [ ] 工单完工自动判断（所有工序完成）

**交付物：**
- ✅ 报工管理API
- ✅ 报工管理页面（移动端优化）

### 4.5 阶段5：仓储管理（1周）

**目标：** 实现基础仓储管理功能

**任务清单：**
- [ ] 库存管理API（查询、更新）
- [ ] 入库单API（创建、查询）
- [ ] 出库单API（创建、查询）
- [ ] 前端页面：库存查询
- [ ] 前端页面：入库单管理
- [ ] 前端页面：出库单管理
- [ ] 生产领料功能（关联工单，根据BOM生成领料需求）
- [ ] 成品入库功能（关联工单）
- [ ] 库存自动更新（入库/出库后更新库存）

**交付物：**
- ✅ 仓储管理API
- ✅ 仓储管理页面

### 4.6 阶段6：生产看板（0.5周）

**目标：** 实现生产看板功能

**任务清单：**
- [ ] 生产看板API（工单进度、状态统计）
- [ ] 前端页面：生产看板（实时数据展示）
- [ ] 工单进度可视化（进度条、状态卡片）
- [ ] 关键指标统计（进行中工单数、完工工单数、延期工单数）

**交付物：**
- ✅ 生产看板API
- ✅ 生产看板页面

### 4.7 阶段7：测试与优化（1周）

**目标：** 测试MVP功能，优化用户体验

**任务清单：**
- [ ] 功能测试（所有功能点）
- [ ] 性能测试（大数据量场景）
- [ ] 移动端测试（报工界面）
- [ ] 用户体验优化
- [ ] 文档编写（用户手册、API文档）
- [ ] 示例数据准备

**交付物：**
- ✅ 测试报告
- ✅ 用户手册
- ✅ 示例数据

---

## 5. 第一阶段扩展详细开发计划（MTS/MTO模式）

### 5.1 需求管理（2周）

**目标：** 实现MTS/MTO需求管理

**任务清单：**
- [ ] 销售预测API（MTS模式）
- [ ] 销售订单API（MTO模式）
- [ ] 前端页面：销售预测管理
- [ ] 前端页面：销售订单管理
- [ ] 需求数据导入功能（Excel导入）

**交付物：**
- ✅ 需求管理API
- ✅ 需求管理页面

### 5.2 计划排程（3周）

**目标：** 实现MRP/LRP运算

**任务清单：**
- [ ] MRP运算引擎（根据销售预测和库存计算物料需求）
- [ ] LRP运算引擎（根据销售订单计算批次需求）
- [ ] MRP结果API
- [ ] LRP结果API
- [ ] 前端页面：MRP运算界面
- [ ] 前端页面：LRP运算界面
- [ ] 前端页面：MRP/LRP结果展示
- [ ] 自动生成工单建议（根据MRP/LRP结果）
- [ ] 自动生成采购建议（根据MRP/LRP结果）

**交付物：**
- ✅ MRP/LRP运算引擎
- ✅ MRP/LRP运算API
- ✅ MRP/LRP运算页面

### 5.3 高级排产（2周）

**目标：** 实现可视化排产

**任务清单：**
- [ ] 排产计划API
- [ ] 排产甘特图API（获取排产数据）
- [ ] 前端页面：排产甘特图（可视化排程）
- [ ] 拖拽调整排产计划
- [ ] 工作中心能力检查

**交付物：**
- ✅ 排产计划API
- ✅ 排产甘特图页面

### 5.4 采购管理（1.5周）

**目标：** 实现采购管理功能

**任务清单：**
- [ ] 采购单API
- [ ] 前端页面：采购单管理
- [ ] 根据MRP/LRP采购建议生成采购单
- [ ] 采购入库功能（关联采购单）

**交付物：**
- ✅ 采购管理API
- ✅ 采购管理页面

### 5.5 销售出库（1周）

**目标：** 实现销售出库功能

**任务清单：**
- [ ] 销售出库API（MTO关联订单，MTS从库存发货）
- [ ] 前端页面：销售出库管理
- [ ] MTO订单专属库存管理
- [ ] 生产退料功能

**交付物：**
- ✅ 销售出库API
- ✅ 销售出库页面

### 5.6 设备看板（0.5周）

**目标：** 实现设备看板功能

**任务清单：**
- [ ] 设备看板API（设备状态监控）
- [ ] 前端页面：设备看板
- [ ] 设备状态实时更新

**交付物：**
- ✅ 设备看板API
- ✅ 设备看板页面

---

## 6. 第二阶段扩展详细开发计划（质量与财务）

### 6.1 质量管理（3周）

**目标：** 实现完整的质量管理功能

**任务清单：**
- [ ] 来料检验API
- [ ] 过程检验API
- [ ] 成品检验API
- [ ] 前端页面：来料检验管理
- [ ] 前端页面：过程检验管理
- [ ] 前端页面：成品检验管理
- [ ] 检验结果关联库存（合格/不合格分别处理）
- [ ] 不良品处理流程

**交付物：**
- ✅ 质量管理API
- ✅ 质量管理页面

### 6.2 财务协同（2周）

**目标：** 实现财务协同功能

**任务清单：**
- [ ] 应付管理API
- [ ] 应收管理API
- [ ] 前端页面：应付管理
- [ ] 前端页面：应收管理
- [ ] 自动生成应付单（采购入库后）
- [ ] 自动生成应收单（销售出库后）

**交付物：**
- ✅ 财务协同API
- ✅ 财务协同页面

### 6.3 高级报表（2周）

**目标：** 实现高级报表功能

**任务清单：**
- [ ] 库存周转率分析API
- [ ] 工单绩效分析API
- [ ] 质量合格率统计API
- [ ] 前端页面：库存报表
- [ ] 前端页面：生产报表
- [ ] 前端页面：质量报表
- [ ] 报表导出功能（Excel、PDF）

**交付物：**
- ✅ 高级报表API
- ✅ 高级报表页面

---

## 7. 技术实现方案

### 7.1 后端实现

#### 应用结构
```
riveredge-backend/src/apps/kuaizhizao/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── work_order.py         # 工单模型
│   ├── work_order_process.py # 工单工序模型
│   ├── work_report.py        # 报工记录模型
│   ├── inventory.py          # 库存模型
│   ├── stock_in.py           # 入库单模型
│   ├── stock_out.py          # 出库单模型
│   ├── sales_forecast.py     # 销售预测模型（第一阶段）
│   ├── sales_order.py        # 销售订单模型（第一阶段）
│   ├── mrp_result.py         # MRP结果模型（第一阶段）
│   ├── lrp_result.py         # LRP结果模型（第一阶段）
│   ├── production_schedule.py # 排产计划模型（第一阶段）
│   ├── purchase_order.py     # 采购单模型（第一阶段）
│   ├── incoming_inspection.py # 来料检验模型（第二阶段）
│   ├── process_inspection.py  # 过程检验模型（第二阶段）
│   ├── finished_product_inspection.py # 成品检验模型（第二阶段）
│   ├── accounts_payable.py   # 应付管理模型（第二阶段）
│   └── accounts_receivable.py # 应收管理模型（第二阶段）
├── schemas/
│   ├── __init__.py
│   ├── work_order.py
│   ├── work_order_process.py
│   ├── work_report.py
│   ├── inventory.py
│   ├── stock_in.py
│   ├── stock_out.py
│   └── ...（其他schemas）
├── services/
│   ├── __init__.py
│   ├── master_data_client.py # master_data API客户端服务
│   ├── work_order_service.py
│   ├── work_report_service.py
│   ├── inventory_service.py
│   ├── stock_service.py
│   ├── mrp_service.py         # MRP运算服务（第一阶段）
│   ├── lrp_service.py         # LRP运算服务（第一阶段）
│   ├── inspection_service.py  # 检验服务（第二阶段）
│   └── financial_service.py    # 财务服务（第二阶段）
└── api/
    ├── __init__.py
    ├── router.py             # 路由汇总
    ├── work_orders.py        # 工单API
    ├── work_reports.py       # 报工API
    ├── inventories.py        # 库存API
    ├── stock_ins.py          # 入库单API
    ├── stock_outs.py         # 出库单API
    ├── sales_forecasts.py    # 销售预测API（第一阶段）
    ├── sales_orders.py       # 销售订单API（第一阶段）
    ├── mrp.py                # MRP运算API（第一阶段）
    ├── lrp.py                # LRP运算API（第一阶段）
    ├── production_schedules.py # 排产计划API（第一阶段）
    ├── purchase_orders.py    # 采购单API（第一阶段）
    ├── inspections.py        # 检验API（第二阶段）
    ├── accounts_payable.py   # 应付管理API（第二阶段）
    ├── accounts_receivable.py # 应收管理API（第二阶段）
    └── reports.py            # 报表API（第二阶段）
```

### 7.2 前端实现

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
├── sales-forecasts/        # 第一阶段
│   └── list/
│       └── index.tsx
├── sales-orders/            # 第一阶段
│   └── list/
│       └── index.tsx
├── mrp/                     # 第一阶段
│   └── index.tsx
├── lrp/                     # 第一阶段
│   └── index.tsx
├── production-schedules/    # 第一阶段
│   └── gantt/
│       └── index.tsx
├── purchase-orders/         # 第一阶段
│   └── list/
│       └── index.tsx
├── inspections/            # 第二阶段
│   ├── incoming/
│   │   └── index.tsx
│   ├── process/
│   │   └── index.tsx
│   └── finished-product/
│       └── index.tsx
├── accounts-payable/        # 第二阶段
│   └── list/
│       └── index.tsx
├── accounts-receivable/     # 第二阶段
│   └── list/
│       └── index.tsx
├── reports/                 # 第二阶段
│   ├── inventory/
│   │   └── index.tsx
│   ├── production/
│   │   └── index.tsx
│   └── quality/
│       └── index.tsx
└── dashboard/
    └── index.tsx
```

### 7.3 菜单配置

```typescript
// 完整版菜单配置
{
  code: 'kuaizhizao',
  name: '快智造',
  dependencies: ['master_data'],
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
      path: '/apps/kuaizhizao/planning',
      name: '计划管理',
      icon: 'CalendarOutlined',
      children: [
        { path: '/apps/kuaizhizao/sales-forecasts', name: '销售预测(MTS)' },
        { path: '/apps/kuaizhizao/sales-orders', name: '销售订单(MTO)' },
        { path: '/apps/kuaizhizao/mrp', name: 'MRP运算(MTS)' },
        { path: '/apps/kuaizhizao/lrp', name: 'LRP运算(MTO)' },
        { path: '/apps/kuaizhizao/production-schedules', name: '排产甘特图' }
      ]
    },
    {
      path: '/apps/kuaizhizao/warehouse',
      name: '仓储管理',
      icon: 'InboxOutlined',
      children: [
        { path: '/apps/kuaizhizao/inventories', name: '库存查询' },
        { path: '/apps/kuaizhizao/stock-ins', name: '入库管理' },
        { path: '/apps/kuaizhizao/stock-outs', name: '出库管理' },
        { path: '/apps/kuaizhizao/purchase-orders', name: '采购单' }
      ]
    },
    {
      path: '/apps/kuaizhizao/quality',
      name: '质量管理',
      icon: 'SafetyOutlined',
      children: [
        { path: '/apps/kuaizhizao/inspections/incoming', name: '来料检验' },
        { path: '/apps/kuaizhizao/inspections/process', name: '过程检验' },
        { path: '/apps/kuaizhizao/inspections/finished-product', name: '成品检验' }
      ]
    },
    {
      path: '/apps/kuaizhizao/financial',
      name: '财务协同',
      icon: 'DollarOutlined',
      children: [
        { path: '/apps/kuaizhizao/accounts-payable', name: '应付管理' },
        { path: '/apps/kuaizhizao/accounts-receivable', name: '应收管理' }
      ]
    },
    {
      path: '/apps/kuaizhizao/reports',
      name: '报表分析',
      icon: 'BarChartOutlined',
      children: [
        { path: '/apps/kuaizhizao/reports/inventory', name: '库存报表' },
        { path: '/apps/kuaizhizao/reports/production', name: '生产报表' },
        { path: '/apps/kuaizhizao/reports/quality', name: '质量报表' }
      ]
    }
  ]
}
```

---

## 8. 核心业务流程设计

### 8.1 MTS模式流程

```
1. 创建销售预测（SalesForecast）
   ↓
2. 运行MRP运算（根据预测和库存计算物料需求）
   ↓
3. 生成工单建议和采购建议
   ↓
4. 创建工单（WorkOrder）
   ↓
5. 高级排产（排产甘特图）
   ↓
6. 工单下达
   ↓
7. 生产领料（根据BOM）
   ↓
8. 报工（WorkReport）
   ↓
9. 成品入库（StockIn）
   ↓
10. 销售出库（从库存发货）
```

### 8.2 MTO模式流程

```
1. 创建销售订单（SalesOrder）
   ↓
2. 运行LRP运算（根据订单计算批次需求）
   ↓
3. 生成工单建议和采购建议
   ↓
4. 创建工单（WorkOrder，关联销售订单）
   ↓
5. 高级排产（排产甘特图）
   ↓
6. 工单下达
   ↓
7. 生产领料（根据BOM）
   ↓
8. 报工（WorkReport）
   ↓
9. 成品入库（StockIn，形成订单专属库存）
   ↓
10. 销售出库（关联销售订单）
```

### 8.3 MVP阶段简化流程

```
1. 手动创建工单（WorkOrder）
   ↓
2. 工单下达
   ↓
3. 生产领料（根据BOM，手动创建出库单）
   ↓
4. 报工（WorkReport）
   ↓
5. 成品入库（手动创建入库单）
```

---

## 9. 开发时间表

### 9.1 MVP阶段（6周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第1周 | 基础架构搭建 + 基础数据API集成 | ⏳ |
| 第2-3周 | 工单管理 | ⏳ |
| 第3-4周 | 报工管理 | ⏳ |
| 第4-5周 | 仓储管理 | ⏳ |
| 第5周 | 生产看板 | ⏳ |
| 第6周 | 测试与优化 | ⏳ |

### 9.2 第一阶段扩展（8-10周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第7-8周 | 需求管理（销售预测、销售订单） | ⏳ |
| 第9-11周 | 计划排程（MRP/LRP运算） | ⏳ |
| 第12-13周 | 高级排产（排产甘特图） | ⏳ |
| 第14-15周 | 采购管理 | ⏳ |
| 第16周 | 销售出库 + 设备看板 | ⏳ |

### 9.3 第二阶段扩展（6-8周）

| 周次 | 任务 | 状态 |
|------|------|------|
| 第17-19周 | 质量管理（来料检验、过程检验、成品检验） | ⏳ |
| 第20-21周 | 财务协同（应付管理、应收管理） | ⏳ |
| 第22-23周 | 高级报表（库存报表、生产报表、质量报表） | ⏳ |

**总计：** 20-24周（约5-6个月）

---

## 10. 里程碑

- **里程碑1（第6周末）：** MVP发布
- **里程碑2（第16周末）：** MTS/MTO模式完成
- **里程碑3（第23周末）：** 完整功能发布

---

## 11. 依赖关系

### 11.1 对master_data的依赖

**MVP阶段：**
- Workshop（车间）
- ProductionLine（产线/工作中心）
- Material（物料）
- BOM（物料清单）
- Warehouse（仓库）

**第一阶段扩展：**
- Customer（客户）
- Supplier（供应商）
- ProcessRoute（工艺路线）- 用于MRP/LRP运算

**第二阶段扩展：**
- DefectType（不良品类型）

### 11.2 对系统级功能的依赖

- 部门管理（Department）
- 员工管理（User）
- 编码规则（CodeRule）- 用于工单号生成
- 审批流程（ApprovalProcess）- 可选，用于工单审批

---

## 12. 成功标准

### 12.1 MVP成功标准

- ✅ 能够创建和管理工单
- ✅ 能够进行报工操作
- ✅ 能够管理库存（入库、出库）
- ✅ 能够查看生产看板
- ✅ 系统响应速度<2秒
- ✅ 支持50+并发用户

### 12.2 第一阶段扩展成功标准

- ✅ 支持MTS模式（销售预测→MRP→工单）
- ✅ 支持MTO模式（销售订单→LRP→工单）
- ✅ 支持可视化排产
- ✅ 支持采购管理
- ✅ 支持销售出库

### 12.3 第二阶段扩展成功标准

- ✅ 支持完整的质量管理流程
- ✅ 支持财务协同（应付、应收）
- ✅ 支持高级报表分析

---

**文档创建时间：** 2025-12-27  
**文档作者：** Luigi Lu  
**预计MVP完成时间：** 2026-02-07（6周后）  
**预计完整功能完成时间：** 2026-06-15（23周后）

