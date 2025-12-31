# 快格轻制造App - 基础流程完善计划

**创建时间：** 2025-01-01  
**基于：** [快格轻制造App-基础流程开发计划.md](./快格轻制造App-基础流程开发计划.md)

## 📊 当前开发进度分析

### ✅ 已完成的核心功能

#### 1. 数据模型（100%完成）
- ✅ 工单（WorkOrder）
- ✅ 报工记录（ReportingRecord）
- ✅ 生产领料（ProductionPicking）
- ✅ 成品入库（FinishedGoodsReceipt）
- ✅ 销售出库（SalesDelivery）
- ✅ 采购入库（PurchaseReceipt）
- ✅ 采购单（PurchaseOrder）
- ✅ 销售预测（SalesForecast）
- ✅ 销售订单（SalesOrder）
- ✅ 质量管理（IncomingInspection, ProcessInspection, FinishedGoodsInspection）
- ✅ 财务协同（Payable, PurchaseInvoice, Receivable）
- ✅ MRP/LRP运算（MRPResult, LRPResult）

#### 2. 服务层（100%完成）
- ✅ 所有业务单据服务类已统一继承 `AppBaseService`
- ✅ 代码生成、用户信息获取已统一
- ✅ CRUD操作已实现

#### 3. API端点（约90%完成）
- ✅ 基础CRUD操作（创建、查询、更新、删除）
- ✅ 审核功能
- ✅ 批量操作（部分实现）
- ✅ 打印功能（部分实现）
- ✅ MRP/LRP运算
- ⚠️ 单据下推功能（部分实现）
- ⚠️ 单据关联关系（部分实现）

### ⚠️ 待完善的功能

#### 1. 单据下推功能（优先级：高）
**缺失的功能：**
- ⚠️ 销售预测 → MRP运算（下推）
- ⚠️ MRP运算 → 工单/采购单（一键生成）
- ⚠️ 销售订单 → LRP运算（下推）
- ⚠️ LRP运算 → 工单/采购单（一键生成）
- ⚠️ 工单 → 生产领料（下推）
- ⚠️ 工单 → 成品入库（下推）
- ⚠️ 采购单 → 采购入库（下推）
- ⚠️ 采购入库 → 采购发票（下推）
- ⚠️ 销售出库 → 应收单（自动生成）

**已实现的功能：**
- ✅ 工单 → 生产领料（一键领料）
- ✅ 工单 → 成品入库（一键入库）

#### 2. 单据关联关系（优先级：高）
**缺失的功能：**
- ⚠️ 完整的单据关联关系展示
- ⚠️ 单据追溯功能
- ⚠️ 单据关联链展示

**已实现的功能：**
- ✅ 基础的单据关联服务（DocumentRelationService）
- ✅ 部分API端点

#### 3. 异常处理（优先级：中）
**缺失的功能：**
- ⚠️ 缺料检测和预警
- ⚠️ 交期延期检测和预警
- ⚠️ 质量异常检测和预警

#### 4. 打印功能（优先级：中）
**缺失的功能：**
- ⚠️ 完整的打印模板
- ⚠️ 打印数据格式化
- ⚠️ 打印预览功能

**已实现的功能：**
- ✅ 基础打印服务（DocumentPrintService）
- ✅ 部分打印API端点

#### 5. 批量操作（优先级：低）
**缺失的功能：**
- ⚠️ 批量导入（Excel）
- ⚠️ 批量导出（Excel）
- ⚠️ 批量审核

**已实现的功能：**
- ✅ 批量创建、更新、删除（部分单据）

## 🎯 分步完善计划

### 第一阶段：完善单据下推功能（预计2-3天）

#### 步骤1.1：完善销售预测 → MRP运算下推
**任务：**
- [ ] 在销售预测服务中添加 `push_to_mrp()` 方法
- [ ] 在销售预测API中添加下推端点
- [ ] 实现MRP运算自动执行逻辑

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/sales_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤1.2：完善MRP运算 → 工单/采购单一键生成
**任务：**
- [ ] 在计划服务中完善 `generate_orders_from_mrp()` 方法
- [ ] 实现批量生成工单逻辑
- [ ] 实现批量生成采购单逻辑
- [ ] 建立单据关联关系

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/planning_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤1.3：完善销售订单 → LRP运算下推
**任务：**
- [ ] 在销售订单服务中添加 `push_to_lrp()` 方法
- [ ] 在销售订单API中添加下推端点
- [ ] 实现LRP运算自动执行逻辑

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/sales_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤1.4：完善LRP运算 → 工单/采购单一键生成
**任务：**
- [ ] 在计划服务中完善 `generate_orders_from_lrp()` 方法
- [ ] 实现MTO模式工单生成（关联销售订单）
- [ ] 实现批量生成采购单逻辑
- [ ] 建立单据关联关系

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/planning_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤1.5：完善采购单 → 采购入库下推
**任务：**
- [ ] 在采购服务中添加 `push_to_receipt()` 方法
- [ ] 在采购API中添加下推端点
- [ ] 实现采购入库单自动生成逻辑

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/purchase_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/purchase.py`

#### 步骤1.6：完善采购入库 → 采购发票/应付单自动生成
**任务：**
- [ ] 在采购入库服务中添加自动生成应付单逻辑
- [ ] 在采购入库确认时自动创建应付单
- [ ] 建立单据关联关系

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/warehouse_service.py`
- `riveredge-backend/src/apps/kuaizhizao/services/finance_service.py`

#### 步骤1.7：完善销售出库 → 应收单自动生成
**任务：**
- [ ] 在销售出库服务中添加自动生成应收单逻辑
- [ ] 在销售出库确认时自动创建应收单
- [ ] 建立单据关联关系

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/warehouse_service.py`
- `riveredge-backend/src/apps/kuaizhizao/services/finance_service.py`

---

### 第二阶段：完善单据关联关系（预计1-2天）

#### 步骤2.1：完善单据关联关系服务
**任务：**
- [ ] 完善 `DocumentRelationService` 的关联关系建立逻辑
- [ ] 实现完整的上下游关联关系查询
- [ ] 实现单据追溯功能

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/document_relation_service.py`

#### 步骤2.2：完善单据关联关系API
**任务：**
- [ ] 完善单据关联关系查询API
- [ ] 实现单据追溯API
- [ ] 实现单据关联链展示API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤2.3：在所有单据创建/更新时建立关联关系
**任务：**
- [ ] 在工单创建时建立与MRP/LRP的关联
- [ ] 在生产领料创建时建立与工单的关联
- [ ] 在成品入库创建时建立与工单的关联
- [ ] 在销售出库创建时建立与销售预测/订单的关联
- [ ] 在采购入库创建时建立与采购单的关联
- [ ] 在应付单创建时建立与采购入库的关联
- [ ] 在应收单创建时建立与销售出库的关联

**文件：**
- 所有服务类文件

---

### 第三阶段：完善异常处理（预计2-3天）

#### 步骤3.1：实现缺料检测和预警
**任务：**
- [ ] 在工单服务中添加 `check_material_shortage()` 方法
- [ ] 实现缺料检测逻辑（基于BOM和库存）
- [ ] 实现缺料预警API
- [ ] 在工单下达前自动检查缺料

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/work_order_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤3.2：实现交期延期检测和预警
**任务：**
- [ ] 在工单服务中添加延期检测逻辑
- [ ] 实现延期工单查询API
- [ ] 实现延期原因分析API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/work_order_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤3.3：实现质量异常检测和预警
**任务：**
- [ ] 在质量服务中添加异常检测逻辑
- [ ] 实现质量异常查询API
- [ ] 实现质量统计分析API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/quality_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

---

### 第四阶段：完善打印功能（预计1-2天）

#### 步骤4.1：完善打印服务
**任务：**
- [ ] 完善 `DocumentPrintService` 的打印模板
- [ ] 实现打印数据格式化
- [ ] 实现打印预览功能

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/print_service.py`

#### 步骤4.2：完善打印API
**任务：**
- [ ] 完善所有单据的打印API
- [ ] 实现打印模板配置
- [ ] 实现打印预览API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

---

### 第五阶段：完善批量操作（预计1-2天）

#### 步骤5.1：实现批量导入功能
**任务：**
- [ ] 实现Excel导入功能
- [ ] 实现数据验证和错误提示
- [ ] 实现批量导入API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/batch_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

#### 步骤5.2：实现批量导出功能
**任务：**
- [ ] 实现Excel导出功能
- [ ] 实现数据格式化
- [ ] 实现批量导出API

**文件：**
- `riveredge-backend/src/apps/kuaizhizao/services/batch_service.py`
- `riveredge-backend/src/apps/kuaizhizao/api/production.py`

---

## 📋 实施优先级

### 高优先级（必须完成）
1. ✅ **第一阶段：完善单据下推功能** - 这是业务流程闭环的核心
2. ✅ **第二阶段：完善单据关联关系** - 这是数据追溯的基础

### 中优先级（建议完成）
3. ⚠️ **第三阶段：完善异常处理** - 提升系统健壮性
4. ⚠️ **第四阶段：完善打印功能** - 提升用户体验

### 低优先级（可选完成）
5. ⚠️ **第五阶段：完善批量操作** - 提升操作效率

---

## 🎯 验收标准

### 功能完整性
- ✅ 所有单据下推功能正常
- ✅ 所有单据关联关系正常
- ✅ 所有异常处理功能正常
- ✅ 所有打印功能正常
- ✅ 所有批量操作功能正常

### 数据完整性
- ✅ 单据关联关系数据完整
- ✅ 单据追溯数据完整
- ✅ 异常检测数据准确

### 性能要求
- ✅ 单据下推响应时间 < 3秒
- ✅ 单据关联查询响应时间 < 2秒
- ✅ 异常检测响应时间 < 2秒

---

## 📝 注意事项

1. **数据一致性**：所有单据下推操作必须保证数据一致性，使用事务管理
2. **错误处理**：所有操作必须有完善的错误处理和用户提示
3. **日志记录**：所有关键操作必须记录操作日志
4. **权限控制**：所有操作必须进行权限验证
5. **性能优化**：批量操作需要考虑性能优化，避免超时

---

**最后更新：** 2025-01-01  
**作者：** Auto (AI Assistant)

