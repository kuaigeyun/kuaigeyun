# 快格轻制造App - 基础流程开发计划

## 📋 概述

本文档从《用户使用场景推演-MTS-MTO.md》中剥离出**基础业务单据全流程**，专注于实现业务单据的完整闭环，暂不考虑以下功能：
- ❌ 系统注册与登录（系统级应用处理）
- ❌ 快速初始化向导（系统级应用处理）
- ❌ 基础数据配置（基础数据管理APP处理）
- ❌ AI增强功能（高级功能，后续完善）
- ❌ 高级报表分析（高级功能，后续完善）
- ❌ 工位机触屏模式（高级功能，后续完善）
- ❌ 工作台快捷操作（高级功能，后续完善）

## 🎯 开发目标

实现**基础业务单据的全流程闭环**，确保：
1. ✅ MTS模式（按库存生产）完整流程
2. ✅ MTO模式（按订单生产）完整流程
3. ✅ 采购流程完整闭环
4. ✅ 质量管理基础流程（简化版）
5. ✅ 财务协同基础流程
6. ✅ 异常处理基础功能

## 📊 业务流程架构

```
┌─────────────────────────────────────────────────────────────┐
│                    需求管理阶段                              │
├─────────────────────────────────────────────────────────────┤
│  MTS模式：销售预测                                          │
│  MTO模式：销售订单                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    计划排程阶段                              │
├─────────────────────────────────────────────────────────────┤
│  MTS模式：MRP运算 → 生成工单建议、采购建议                  │
│  MTO模式：LRP运算 → 生成工单建议、采购建议                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌───────────────┐           ┌───────────────────────┐
│   生产流程    │           │      采购流程         │
├───────────────┤           ├───────────────────────┤
│ 1. 工单创建   │           │ 1. 采购单创建         │
│ 2. 工单下达   │           │ 2. 采购入库           │
│ 3. 生产领料   │           │ 3. 采购发票（应付）   │
│ 4. 报工       │           └───────────────────────┘
│ 5. 成品入库   │
│ 6. 销售出库   │
└───────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│                    质量管理流程（简化版）                    │
├─────────────────────────────────────────────────────────────┤
│  来料检验 → 过程检验 → 成品检验                             │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│                    财务协同流程                             │
├─────────────────────────────────────────────────────────────┤
│  应付管理（采购入库后自动生成）                              │
│  应收管理（销售出库后自动生成）                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 核心业务单据流程

### 1. MTS模式业务流程（按库存生产）

#### 1.1 需求管理阶段
**业务单据：销售预测**

**功能点：**
- ✅ 销售预测创建（支持批量导入）
- ✅ 销售预测列表查询
- ✅ 销售预测详情查看
- ✅ 销售预测编辑/删除
- ✅ 销售预测提交/审核
- ✅ 单据关联展示（下游：MRP运算、工单、销售出库单）
- ✅ 单据下推功能（下推到MRP运算）

**数据模型：**
- `apps_kuaizhizao_sales_forecasts`（销售预测主表）
- `apps_kuaizhizao_sales_forecast_items`（销售预测明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/sales-forecasts` - 创建销售预测
- `GET /api/apps/kuaizhizao/sales-forecasts` - 查询销售预测列表
- `GET /api/apps/kuaizhizao/sales-forecasts/{id}` - 查询销售预测详情
- `PUT /api/apps/kuaizhizao/sales-forecasts/{id}` - 更新销售预测
- `DELETE /api/apps/kuaizhizao/sales-forecasts/{id}` - 删除销售预测
- `POST /api/apps/kuaizhizao/sales-forecasts/{id}/submit` - 提交销售预测
- `POST /api/apps/kuaizhizao/sales-forecasts/{id}/push-to-mrp` - 下推到MRP运算

---

#### 1.2 计划排程阶段
**业务单据：MRP运算结果**

**功能点：**
- ✅ MRP运算执行（基于销售预测）
- ✅ MRP运算结果查看（物料需求清单、工单建议、采购建议）
- ✅ 一键生成工单和采购单（单据下推功能）
- ✅ 选择性生成工单和采购单
- ✅ MRP运算结果导出（Excel）
- ✅ 单据关联展示（上游：销售预测，下游：工单、采购单）

**数据模型：**
- `apps_kuaizhizao_mrp_results`（MRP运算结果主表）
- `apps_kuaizhizao_mrp_result_items`（MRP运算结果明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/mrp/run` - 执行MRP运算
- `GET /api/apps/kuaizhizao/mrp/results/{id}` - 查询MRP运算结果
- `POST /api/apps/kuaizhizao/mrp/results/{id}/generate-orders` - 一键生成工单和采购单
- `GET /api/apps/kuaizhizao/mrp/results/{id}/export` - 导出MRP运算结果

---

#### 1.3 工单创建阶段
**业务单据：工单**

**功能点：**
- ✅ 工单创建（手动创建或从MRP生成）
- ✅ 根据工艺路线自动生成工单工序
- ✅ 工单列表查询（高级搜索）
- ✅ 工单详情查看（显示工序列表）
- ✅ 工单编辑/删除
- ✅ 工单打印（包含工序信息）
- ✅ 单据关联展示（上游：销售预测、MRP运算，下游：生产领料、报工、成品入库、销售出库）
- ✅ 单据下推功能（下推到生产领料、报工、成品入库）

**数据模型：**
- `apps_kuaizhizao_work_orders`（工单主表）
- `apps_kuaizhizao_work_order_items`（工单明细表，如果支持多产品）

**API端点：**
- `POST /api/apps/kuaizhizao/work-orders` - 创建工单
- `GET /api/apps/kuaizhizao/work-orders` - 查询工单列表
- `GET /api/apps/kuaizhizao/work-orders/{id}` - 查询工单详情
- `PUT /api/apps/kuaizhizao/work-orders/{id}` - 更新工单
- `DELETE /api/apps/kuaizhizao/work-orders/{id}` - 删除工单
- `POST /api/apps/kuaizhizao/work-orders/{id}/release` - 下达工单
- `POST /api/apps/kuaizhizao/work-orders/{id}/push-to-picking` - 下推到生产领料
- `POST /api/apps/kuaizhizao/work-orders/{id}/push-to-receipt` - 下推到成品入库
- `GET /api/apps/kuaizhizao/work-orders/{id}/print` - 打印工单

---

#### 1.4 工单下达阶段
**功能点：**
- ✅ 工单下达（批量下达）
- ✅ 缺料检查（下达前自动检查）
- ✅ 工单状态更新（已下达）

**API端点：**
- `POST /api/apps/kuaizhizao/work-orders/{id}/release` - 下达工单
- `POST /api/apps/kuaizhizao/work-orders/batch-release` - 批量下达工单
- `GET /api/apps/kuaizhizao/work-orders/{id}/material-check` - 检查缺料情况

---

#### 1.5 生产领料阶段
**业务单据：生产领料出库单**

**功能点：**
- ✅ 一键领料（从工单下推）
- ✅ 批量领料（多工单）
- ✅ 手动创建出库单
- ✅ 根据BOM自动生成领料需求
- ✅ 库存检查（缺料预警）
- ✅ 出库单列表查询
- ✅ 出库单详情查看
- ✅ 出库单打印
- ✅ 单据关联展示（上游：工单，下游：报工记录）
- ✅ 单据下推功能（从工单下推）

**数据模型：**
- `apps_kuaizhizao_production_pickings`（生产领料出库单主表）
- `apps_kuaizhizao_production_picking_items`（生产领料出库单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/production-pickings/quick-pick` - 一键领料
- `POST /api/apps/kuaizhizao/production-pickings/batch-pick` - 批量领料
- `POST /api/apps/kuaizhizao/production-pickings` - 创建生产领料出库单
- `GET /api/apps/kuaizhizao/production-pickings` - 查询生产领料出库单列表
- `GET /api/apps/kuaizhizao/production-pickings/{id}` - 查询生产领料出库单详情
- `GET /api/apps/kuaizhizao/production-pickings/{id}/print` - 打印出库单

---

#### 1.6 报工阶段
**业务单据：报工记录**

**功能点：**
- ✅ 扫码报工（扫描工单二维码）
- ✅ 按数量报工（数量型工序）
- ✅ 按状态报工（状态型工序）
- ✅ 报工记录列表查询
- ✅ 报工记录详情查看
- ✅ 报工记录编辑/删除
- ✅ 单据关联展示（上游：工单、生产领料，下游：成品入库）
- ✅ 单据上拉功能（从报工记录上拉到工单）

**数据模型：**
- `apps_kuaizhizao_reporting_records`（报工记录表）

**API端点：**
- `POST /api/apps/kuaizhizao/reporting-records/scan` - 扫码报工
- `POST /api/apps/kuaizhizao/reporting-records` - 创建报工记录
- `GET /api/apps/kuaizhizao/reporting-records` - 查询报工记录列表
- `GET /api/apps/kuaizhizao/reporting-records/{id}` - 查询报工记录详情
- `PUT /api/apps/kuaizhizao/reporting-records/{id}` - 更新报工记录
- `DELETE /api/apps/kuaizhizao/reporting-records/{id}` - 删除报工记录

---

#### 1.7 成品入库阶段
**业务单据：成品入库单**

**功能点：**
- ✅ 一键入库（从工单下推）
- ✅ 批量入库（多工单）
- ✅ 手动创建入库单
- ✅ 批号管理（如果物料启用批号管理）
- ✅ 序列号管理（如果物料启用序列号管理）
- ✅ 入库单列表查询
- ✅ 入库单详情查看
- ✅ 入库单打印
- ✅ 单据关联展示（上游：工单、报工记录，下游：销售出库单）
- ✅ 单据下推功能（从工单下推）

**数据模型：**
- `apps_kuaizhizao_finished_goods_receipts`（成品入库单主表）
- `apps_kuaizhizao_finished_goods_receipt_items`（成品入库单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/finished-goods-receipts/quick-receipt` - 一键入库
- `POST /api/apps/kuaizhizao/finished-goods-receipts/batch-receipt` - 批量入库
- `POST /api/apps/kuaizhizao/finished-goods-receipts` - 创建成品入库单
- `GET /api/apps/kuaizhizao/finished-goods-receipts` - 查询成品入库单列表
- `GET /api/apps/kuaizhizao/finished-goods-receipts/{id}` - 查询成品入库单详情
- `GET /api/apps/kuaizhizao/finished-goods-receipts/{id}/print` - 打印入库单

---

#### 1.8 销售出库阶段
**业务单据：销售出库单**

**功能点：**
- ✅ 创建销售出库单
- ✅ 批号和序列号选择（如果物料启用）
- ✅ 出库单列表查询
- ✅ 出库单详情查看
- ✅ 出库单打印
- ✅ 单据关联展示（上游：销售预测、工单、成品入库单）
- ✅ 自动生成应收单（财务协同）

**数据模型：**
- `apps_kuaizhizao_sales_deliveries`（销售出库单主表）
- `apps_kuaizhizao_sales_delivery_items`（销售出库单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/sales-deliveries` - 创建销售出库单
- `GET /api/apps/kuaizhizao/sales-deliveries` - 查询销售出库单列表
- `GET /api/apps/kuaizhizao/sales-deliveries/{id}` - 查询销售出库单详情
- `GET /api/apps/kuaizhizao/sales-deliveries/{id}/print` - 打印出库单

---

### 2. MTO模式业务流程（按订单生产）

#### 2.1 需求管理阶段
**业务单据：销售订单**

**功能点：**
- ✅ 销售订单创建（支持批量导入）
- ✅ 销售订单列表查询
- ✅ 销售订单详情查看
- ✅ 销售订单编辑/删除
- ✅ 销售订单提交/审核
- ✅ 单据关联展示（下游：LRP运算、工单、销售出库单）
- ✅ 单据下推功能（下推到LRP运算）

**数据模型：**
- `apps_kuaizhizao_sales_orders`（销售订单主表）
- `apps_kuaizhizao_sales_order_items`（销售订单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/sales-orders` - 创建销售订单
- `GET /api/apps/kuaizhizao/sales-orders` - 查询销售订单列表
- `GET /api/apps/kuaizhizao/sales-orders/{id}` - 查询销售订单详情
- `PUT /api/apps/kuaizhizao/sales-orders/{id}` - 更新销售订单
- `DELETE /api/apps/kuaizhizao/sales-orders/{id}` - 删除销售订单
- `POST /api/apps/kuaizhizao/sales-orders/{id}/submit` - 提交销售订单
- `POST /api/apps/kuaizhizao/sales-orders/{id}/push-to-lrp` - 下推到LRP运算

---

#### 2.2 计划排程阶段
**业务单据：LRP运算结果**

**功能点：**
- ✅ LRP运算执行（基于销售订单）
- ✅ LRP运算结果查看（物料需求清单、工单建议、采购建议）
- ✅ 一键生成工单和采购单（单据下推功能）
- ✅ 选择性生成工单和采购单
- ✅ LRP运算结果导出（Excel）
- ✅ 单据关联展示（上游：销售订单，下游：工单、采购单）

**数据模型：**
- `apps_kuaizhizao_lrp_results`（LRP运算结果主表）
- `apps_kuaizhizao_lrp_result_items`（LRP运算结果明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/lrp/run` - 执行LRP运算
- `GET /api/apps/kuaizhizao/lrp/results/{id}` - 查询LRP运算结果
- `POST /api/apps/kuaizhizao/lrp/results/{id}/generate-orders` - 一键生成工单和采购单
- `GET /api/apps/kuaizhizao/lrp/results/{id}/export` - 导出LRP运算结果

---

#### 2.3-2.8 工单创建至销售出库阶段
**与MTS模式相同，但有以下差异：**

**差异点：**
- ✅ 工单关联销售订单（MTO模式关键）
- ✅ 生产领料标记为订单专属库存
- ✅ 成品入库标记为订单专属库存
- ✅ 销售出库关联销售订单

**数据模型：**
- 使用与MTS模式相同的数据模型，但增加订单关联字段

---

### 3. 采购流程

#### 3.1 采购单创建阶段
**业务单据：采购单**

**功能点：**
- ✅ 采购单创建（手动创建或从MRP/LRP生成）
- ✅ 采购单列表查询
- ✅ 采购单详情查看
- ✅ 采购单编辑/删除
- ✅ 采购单提交/审核
- ✅ 单据关联展示（上游：MRP/LRP运算，下游：采购入库、采购发票）
- ✅ 单据下推功能（下推到采购入库）

**数据模型：**
- `apps_kuaizhizao_purchase_orders`（采购单主表）
- `apps_kuaizhizao_purchase_order_items`（采购单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/purchase-orders` - 创建采购单
- `GET /api/apps/kuaizhizao/purchase-orders` - 查询采购单列表
- `GET /api/apps/kuaizhizao/purchase-orders/{id}` - 查询采购单详情
- `PUT /api/apps/kuaizhizao/purchase-orders/{id}` - 更新采购单
- `DELETE /api/apps/kuaizhizao/purchase-orders/{id}` - 删除采购单
- `POST /api/apps/kuaizhizao/purchase-orders/{id}/submit` - 提交采购单
- `POST /api/apps/kuaizhizao/purchase-orders/{id}/push-to-receipt` - 下推到采购入库

---

#### 3.2 采购入库阶段
**业务单据：采购入库单**

**功能点：**
- ✅ 创建采购入库单（从采购单下推）
- ✅ 批号管理（如果物料启用批号管理）
- ✅ 序列号管理（如果物料启用序列号管理）
- ✅ 入库单列表查询
- ✅ 入库单详情查看
- ✅ 入库单打印
- ✅ 单据关联展示（上游：采购单，下游：采购发票、应付单）
- ✅ 自动生成应付单（财务协同）

**数据模型：**
- `apps_kuaizhizao_purchase_receipts`（采购入库单主表）
- `apps_kuaizhizao_purchase_receipt_items`（采购入库单明细表）

**API端点：**
- `POST /api/apps/kuaizhizao/purchase-receipts` - 创建采购入库单
- `GET /api/apps/kuaizhizao/purchase-receipts` - 查询采购入库单列表
- `GET /api/apps/kuaizhizao/purchase-receipts/{id}` - 查询采购入库单详情
- `GET /api/apps/kuaizhizao/purchase-receipts/{id}/print` - 打印入库单

---

#### 3.3 采购发票阶段
**业务单据：采购发票（应付单）**

**功能点：**
- ✅ 创建采购发票（从采购入库单下推）
- ✅ 采购发票列表查询
- ✅ 采购发票详情查看
- ✅ 采购发票编辑/删除
- ✅ 记录付款信息
- ✅ 自动更新应付单状态
- ✅ 单据关联展示（上游：采购单、采购入库单）

**数据模型：**
- `apps_kuaizhizao_purchase_invoices`（采购发票表）
- `apps_kuaizhizao_payables`（应付单表）

**API端点：**
- `POST /api/apps/kuaizhizao/purchase-invoices` - 创建采购发票
- `GET /api/apps/kuaizhizao/purchase-invoices` - 查询采购发票列表
- `GET /api/apps/kuaizhizao/purchase-invoices/{id}` - 查询采购发票详情
- `PUT /api/apps/kuaizhizao/purchase-invoices/{id}` - 更新采购发票
- `POST /api/apps/kuaizhizao/purchase-invoices/{id}/record-payment` - 记录付款信息

---

### 4. 质量管理流程（简化版）

#### 4.1 来料检验
**业务单据：来料检验单**

**功能点：**
- ✅ 创建来料检验单（关联采购单）
- ✅ 记录检验数量、合格数量、不良数量
- ✅ 选择检验结果（合格/部分合格/不合格）
- ✅ 自动处理合格物料入库
- ✅ 自动处理不良物料标记
- ✅ 检验单列表查询
- ✅ 检验单详情查看

**数据模型：**
- `apps_kuaizhizao_incoming_inspections`（来料检验单表）

**API端点：**
- `POST /api/apps/kuaizhizao/incoming-inspections` - 创建来料检验单
- `GET /api/apps/kuaizhizao/incoming-inspections` - 查询来料检验单列表
- `GET /api/apps/kuaizhizao/incoming-inspections/{id}` - 查询来料检验单详情

---

#### 4.2 过程检验
**业务单据：过程检验单**

**功能点：**
- ✅ 创建过程检验单（关联工单、工序）
- ✅ 记录检验数量、合格数量、不良数量
- ✅ 选择不良品类型
- ✅ 自动更新报工合格数
- ✅ 自动标记不良品
- ✅ 检验单列表查询
- ✅ 检验单详情查看

**数据模型：**
- `apps_kuaizhizao_process_inspections`（过程检验单表）

**API端点：**
- `POST /api/apps/kuaizhizao/process-inspections` - 创建过程检验单
- `GET /api/apps/kuaizhizao/process-inspections` - 查询过程检验单列表
- `GET /api/apps/kuaizhizao/process-inspections/{id}` - 查询过程检验单详情

---

#### 4.3 成品检验
**业务单据：成品检验单**

**功能点：**
- ✅ 创建成品检验单（关联工单）
- ✅ 记录检验数量、合格数量、不良数量
- ✅ 选择检验结果（合格/部分合格/不合格）
- ✅ 合格数量允许入库
- ✅ 不良数量不允许入库
- ✅ 检验单列表查询
- ✅ 检验单详情查看

**数据模型：**
- `apps_kuaizhizao_finished_goods_inspections`（成品检验单表）

**API端点：**
- `POST /api/apps/kuaizhizao/finished-goods-inspections` - 创建成品检验单
- `GET /api/apps/kuaizhizao/finished-goods-inspections` - 查询成品检验单列表
- `GET /api/apps/kuaizhizao/finished-goods-inspections/{id}` - 查询成品检验单详情

---

### 5. 财务协同流程

#### 5.1 应付管理
**业务单据：应付单**

**功能点：**
- ✅ 自动生成应付单（采购入库后）
- ✅ 应付单列表查询
- ✅ 应付单详情查看
- ✅ 记录付款信息
- ✅ 自动更新应付单状态（部分付款/已付款）
- ✅ 应付单导出（Excel）
- ✅ 应付单打印

**数据模型：**
- `apps_kuaizhizao_payables`（应付单表）

**API端点：**
- `GET /api/apps/kuaizhizao/payables` - 查询应付单列表
- `GET /api/apps/kuaizhizao/payables/{id}` - 查询应付单详情
- `POST /api/apps/kuaizhizao/payables/{id}/record-payment` - 记录付款信息
- `GET /api/apps/kuaizhizao/payables/{id}/export` - 导出应付单
- `GET /api/apps/kuaizhizao/payables/{id}/print` - 打印应付单

---

#### 5.2 应收管理
**业务单据：应收单**

**功能点：**
- ✅ 自动生成应收单（销售出库后）
- ✅ 应收单列表查询
- ✅ 应收单详情查看
- ✅ 记录收款信息
- ✅ 自动更新应收单状态（部分收款/已收款）
- ✅ 应收单导出（Excel）
- ✅ 应收单打印

**数据模型：**
- `apps_kuaizhizao_receivables`（应收单表）

**API端点：**
- `GET /api/apps/kuaizhizao/receivables` - 查询应收单列表
- `GET /api/apps/kuaizhizao/receivables/{id}` - 查询应收单详情
- `POST /api/apps/kuaizhizao/receivables/{id}/record-payment` - 记录收款信息
- `GET /api/apps/kuaizhizao/receivables/{id}/export` - 导出应收单
- `GET /api/apps/kuaizhizao/receivables/{id}/print` - 打印应收单

---

### 6. 异常处理

#### 6.1 缺料异常处理
**功能点：**
- ✅ 缺料检测（工单下达前自动检查）
- ✅ 缺料预警（显示缺料物料和缺料数量）
- ✅ 缺料处理（等待到货/使用替代料/强制下达）

**API端点：**
- `GET /api/apps/kuaizhizao/work-orders/{id}/material-check` - 检查缺料情况
- `POST /api/apps/kuaizhizao/work-orders/{id}/handle-shortage` - 处理缺料异常

---

#### 6.2 交期延期异常处理
**功能点：**
- ✅ 延期风险检测（基于当前进度和计划时间）
- ✅ 延期工单自动标记
- ✅ 延期原因分析
- ✅ 延期应对措施建议

**API端点：**
- `GET /api/apps/kuaizhizao/work-orders/delayed` - 查询延期工单
- `GET /api/apps/kuaizhizao/work-orders/{id}/delay-analysis` - 延期原因分析

---

#### 6.3 质量异常处理
**功能点：**
- ✅ 质量异常检测（不良率超过阈值）
- ✅ 质量异常预警
- ✅ 不良品类型分布统计
- ✅ 不良品趋势分析

**API端点：**
- `GET /api/apps/kuaizhizao/quality-alerts` - 查询质量异常
- `GET /api/apps/kuaizhizao/quality-statistics` - 质量统计分析

---

## 📅 开发优先级

### 第一阶段：核心生产流程（MTS模式）
1. ✅ 工单管理（创建、查询、下达）
2. ✅ 生产领料（出库单）
3. ✅ 报工记录
4. ✅ 成品入库（入库单）

### 第二阶段：需求与计划
5. ✅ 销售预测
6. ✅ MRP运算
7. ✅ 销售出库

### 第三阶段：MTO模式
8. ✅ 销售订单
9. ✅ LRP运算
10. ✅ MTO模式工单（关联订单）
11. ✅ MTO模式库存管理（订单专属库存）

### 第四阶段：采购流程
12. ✅ 采购单管理
13. ✅ 采购入库
14. ✅ 采购发票（应付单）

### 第五阶段：质量管理
15. ✅ 来料检验
16. ✅ 过程检验
17. ✅ 成品检验

### 第六阶段：财务协同
18. ✅ 应付管理
19. ✅ 应收管理

### 第七阶段：异常处理
20. ✅ 缺料异常处理
21. ✅ 交期延期异常处理
22. ✅ 质量异常处理

---

## 🔗 单据关联关系

### 单据上下游关系图

```
销售预测 (MTS)
  ↓
MRP运算
  ↓
  ├─→ 工单
  │     ↓
  │     生产领料
  │     ↓
  │     报工
  │     ↓
  │     成品入库
  │     ↓
  │     销售出库
  │
  └─→ 采购单
        ↓
        采购入库
        ↓
        采购发票（应付单）

销售订单 (MTO)
  ↓
LRP运算
  ↓
  ├─→ 工单（关联订单）
  │     ↓
  │     生产领料（订单专属库存）
  │     ↓
  │     报工
  │     ↓
  │     成品入库（订单专属库存）
  │     ↓
  │     销售出库（关联订单）
  │
  └─→ 采购单
        ↓
        采购入库
        ↓
        采购发票（应付单）

采购入库 → 来料检验
工单 → 过程检验
成品入库 → 成品检验

采购入库 → 自动生成应付单
销售出库 → 自动生成应收单
```

---

## 📝 开发注意事项

### 1. 数据模型依赖
- 所有业务单据依赖基础数据管理APP的数据（物料、BOM、工艺路线等）
- 所有业务单据依赖系统级应用的数据（用户、组织、权限等）

### 2. 单据状态流转
- 每个业务单据需要定义明确的状态流转规则
- 状态流转需要记录操作日志

### 3. 单据关联
- 所有业务单据需要支持上下游关联展示
- 支持单据下推和上拉功能
- 支持单据关联追溯

### 4. 批量操作
- 支持批量创建、批量更新、批量删除
- 支持批量导入（Excel/universheet）

### 5. 打印功能
- 所有业务单据需要支持打印
- 打印模板需要可配置

### 6. 权限控制
- 所有业务单据需要权限控制
- 支持按角色、按部门、按用户设置权限

### 7. 数据验证
- 所有业务单据需要数据验证
- 验证规则需要可配置

### 8. 异常处理
- 所有业务操作需要异常处理
- 异常信息需要友好提示

---

## 🎯 验收标准

### 功能完整性
- ✅ 所有业务单据的CRUD操作正常
- ✅ 所有业务单据的状态流转正常
- ✅ 所有业务单据的关联关系正常
- ✅ 所有业务单据的批量操作正常

### 数据完整性
- ✅ 所有业务单据的数据验证正常
- ✅ 所有业务单据的数据关联正常
- ✅ 所有业务单据的数据追溯正常

### 性能要求
- ✅ 列表查询响应时间 < 2秒
- ✅ 详情查询响应时间 < 1秒
- ✅ 批量操作响应时间 < 5秒

### 用户体验
- ✅ 操作流程简单直观
- ✅ 错误提示友好明确
- ✅ 打印功能正常可用

---

## 📚 相关文档

- [用户使用场景推演-MTS-MTO.md](./用户使用场景推演-MTS-MTO.md) - 完整场景推演文档
- [系统级应用级协同开发计划.md](./系统级应用级协同开发计划.md) - 系统级应用开发计划
- [新应用创建流程.md](./新应用创建流程.md) - 新应用创建流程

---

**最后更新：** 2025-01-01  
**作者：** Auto (AI Assistant)

