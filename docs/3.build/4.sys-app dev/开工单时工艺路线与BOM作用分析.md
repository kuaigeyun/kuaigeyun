# 开工单时工艺路线与 BOM 作用分析

> 基于当前代码与逻辑梳理，便于与《制造SOP开发计划》中的「工单以 SOP 为依据产生流程单据」对齐。  
> 日期：2026-01-27

---

## 一、结论概览

| 维度 | 开工单时是否使用 | 何时使用、如何起作用 |
|------|------------------|------------------------|
| **工艺路线** | ✅ 是 | 创建工单时**自动按产品（物料）匹配**工艺路线，并据此**生成工单工序单**（工序、顺序、计划时间等）。 |
| **BOM** | ❌ 不在创建时用 | 创建工单**不**读 BOM；BOM 在**一键领料**、**需求/MRP 运算**、**成本核算**等后续环节才参与。 |
| **SOP** | ⚠️ 尚未接入 | 工序单当前**未**关联 SOP；计划通过「按物料匹配 SOP」在工单/报工侧接入作业指导与报工数据采集项。 |

---

## 二、工艺路线在开工单时如何起作用

### 2.1 触发时机与入口

- **入口**：`WorkOrderService.create_work_order()`（`riveredge-backend/src/apps/kuaizhizao/services/work_order_service.py`）。
- **何时用工艺路线**：在工单主体创建完成后，若**没有**在请求里带「工单工序列表 `operations`」，则走「自动匹配工艺路线并生成工序单」分支。

### 2.2 工艺路线匹配规则（按产品/物料）

匹配在 `_match_process_route_for_material(tenant_id, material_id)` 中完成，**只看产品物料**，优先级为：

1. **物料直接绑定的工艺路线**  
   - 使用 `Material.process_route_id`。  
   - 若存在且对应工艺路线有效（同 tenant、is_active、未软删），则直接返回该工艺路线。

2. **物料所属分组的工艺路线**  
   - 若物料未直接绑定，则用 `material.group_id` 找到物料组，再取 `MaterialGroup.process_route_id`。  
   - 若存在且对应工艺路线有效，则返回该工艺路线。

3. **都未配置**  
   - 返回 `None`，本工单不会自动生成工序单，仅记录告警日志。

匹配时**只依赖主数据里的工艺路线绑定关系**，不依赖 SOP、不依赖 BOM。

### 2.3 用工艺路线生成工单工序单

当匹配到工艺路线后，调用 `_generate_work_order_operations_from_route(...)`：

- **输入**：当前工单、匹配到的 `ProcessRoute`、创建人。
- **依据**：工艺路线的 `operation_sequence`（工序序列）。
- **产出**：为工单创建多条 `WorkOrderOperation` 记录，每条对应一个工序，包含例如：
  - 工序、顺序、车间/工作中心（来自工序或工艺路线中的 extra 配置）
  - 计划开始/结束时间（按准备时间、标准工时 × 工单数量推算）
  - 报工类型、是否允许跳转（来自工序或工艺路线里的配置）

工单、工序单模型里**没有** `process_route_id`、`sop_id` 等字段；工艺路线仅在「创建时」被用来生成工序单，不落库到工单表。

### 2.4 数据来源小结（工艺路线）

- **谁决定用哪条工艺路线**：产品物料（`work_order.product_id`）在**物料主数据 / 物料分组**上的工艺路线绑定。
- **主数据侧接口**：`ProcessService.get_process_route_for_material(tenant_id, material_uuid)` 提供「按物料查工艺路线」的契约，工单服务内部则用 `_match_process_route_for_material(tenant_id, material_id)` 自实现，逻辑与「物料 → 物料组 → 工艺路线」一致。

---

## 三、BOM 在开工单时是否起作用

### 3.1 创建工单阶段：不使用 BOM

- `create_work_order` 中**没有**调用 BOM、没有按 BOM 展开用料、没有根据 BOM 生成任何单据。
- 工单创建只依赖：产品（物料）、数量、计划时间、可选工序列表等；若未提供工序列表，则依赖「产品 → 工艺路线 → 工序序列」生成工序单。

### 3.2 BOM 在后续环节的作用

BOM 在以下场景被使用（均在「工单已存在」之后）：

| 场景 | 位置/入口 | 作用 |
|------|-----------|------|
| **一键领料** | `WarehouseService.create_material_issue_from_work_order()` | 按工单产品 + 数量，通过 `calculate_material_requirements_from_bom()` 展开 BOM 得到用料需求，生成生产领料单及明细。 |
| **需求/MRP 运算** | `DemandComputationService`、MRP/LRP | 按需求物料与数量展开 BOM，做物料需求计划、生产/采购计划；自制件会结合工艺路线等生成工单或计划。 |
| **成本核算** | `ProductionCostService`、委外成本等 | 按 BOM 展开计算材料成本；加工成本另从工艺路线/工序取。 |

因此：**开工单**只用到「产品 + 工艺路线」；**BOM 不在开工单时起作用**，而在领料、需求运算、成本等后续流程中起作用。

---

## 四、与《制造SOP开发计划》的关系

### 4.1 当前缺口

- 工单工序单（`WorkOrderOperation`）**没有** `sop_id` / `sop_uuid`，报工、作业指导无法「按工序绑定 SOP」从模型上直接读出。
- 计划中的「**开工单时以 SOP 为依据，产生对应的流程单据**」尚未在工单创建链路里实现；当前实现的是「以**工艺路线**为依据产生工序单」。

### 4.2 已具备的契约（可被工单/报工复用）

- **按物料匹配 SOP**：`GET /process/sop/for-material?material_uuid=xx&operation_uuid=yy`、`ProcessService.get_sop_for_material()`，规则为「具体物料优先于物料组」。
- 工单创建时已有「产品 `product_id`」；报工时有「工单 + 工序」。若在**创建工单或生成工序单后**再根据「产品 + 工序」调用上述接口，即可得到该工序应使用的 SOP，进而带出：
  - 作业指导（ESOP / flow_config）
  - 报工数据采集项（form_config）

### 4.3 可落地的改造方向（不做具体实现，只列方向）

1. **在生成工序单时关联 SOP（推荐）**  
   - 在 `_generate_work_order_operations_from_route`（以及「按用户提供 operations 创建」的分支）中，对每个工序：  
     - 用 `product_id`（或物料 uuid）+ `operation_id`（或 operation_uuid）调用 `get_sop_for_material(tenant_id, material_uuid, operation_uuid)`，得到 SOP。  
   - 若希望「流程单据」落库：可为 `WorkOrderOperation` 增加 `sop_id`/`sop_uuid`，或单独建「工单工序-SOP」关联表，并将匹配到的 SOP 写进去。  
   - 这样后续报工、现场展示作业指导时，可直接按工序取 SOP，无需再按物料+工序实时查。

2. **报工按 SOP 展示与校验**  
   - 报工页根据「工单 + 工序」取得 SOP（若工序单已存 sop_id 则直接取，否则再调 `get_sop_for_material(product_id 对应物料 uuid, operation_uuid)`）。  
   - 用 SOP 的 `form_config` 渲染报工数据采集项，并按其中必填、校验规则做提交前校验。

3. **BOM 与 SOP 的协同**  
   - 开发计划中 SOP 有「BOM 载入方式」等配置，用于**在现场/报工端展示领料参考、BOM 结构**等，不改变「开工单时由工艺路线生成工序单」的既有逻辑。  
   - 一键领料仍按「工单产品 + BOM」计算用料；若要做「按 SOP 指定 BOM 领料」，可在领料或物料需求计算时，优先采用工单/工序所关联 SOP 上配置的 BOM（若存在），否则仍用产品默认 BOM。

---

## 五、简要流程图（现状）

```
用户发起「创建工单」
   ↓
填写/选择：产品(物料)、数量、计划时间、车间等；可选「工序列表」
   ↓
WorkOrderService.create_work_order()
   ↓
写入工单主表（product_id, quantity, ...）
   ↓
┌─ 若请求中带了 operations ────────────────────────────────────┐
│  按用户提供的工序列表创建 WorkOrderOperation，不改动工艺路线    │
└───────────────────────────────────────────────────────────────┘
   ↓
┌─ 若未带 operations ───────────────────────────────────────────┐
│  _match_process_route_for_material(tenant_id, product_id)     │
│     → 物料.process_route_id ? 用其工艺路线                     │
│     → 否则 物料组.process_route_id ? 用其工艺路线              │
│     → 否则 返回 None，不生成工序单                             │
│  若匹配到工艺路线：                                             │
│    _generate_work_order_operations_from_route(...)            │
│     → 按 operation_sequence 生成多条 WorkOrderOperation       │
│     → 工序、顺序、计划时间、报工类型等来自工艺路线/工序          │
│  【当前未做】按物料+工序匹配 SOP、写工序单与 SOP 的关联         │
└───────────────────────────────────────────────────────────────┘
   ↓
工单创建完成

BOM：不在此流程中出现；在「一键领料 / 需求运算 / 成本」等后续步骤才按产品+BOM 展开。
```

---

**文档结束**
