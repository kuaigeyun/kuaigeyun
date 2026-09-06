"""
返工单数据验证Schema模块

定义返工单相关的Pydantic数据验证Schema。
"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal

from apps.kuaizhizao.services.document_action_policy.types import ActionCapability


class ReworkOrderBase(BaseModel):
    """返工单基础Schema"""
    model_config = ConfigDict(from_attributes=True)

    code: Optional[str] = Field(None, description="返工单编码（可选，创建时自动生成）")
    original_work_order_id: Optional[int] = Field(None, description="原工单ID（关联WorkOrder）")
    original_work_order_uuid: Optional[str] = Field(None, max_length=36, description="原工单UUID")
    original_work_order_code: Optional[str] = Field(None, max_length=50, description="原工单号（展示用）")

    product_id: int = Field(..., description="产品ID（关联物料）")
    product_code: str = Field(..., max_length=50, description="产品编码")
    product_name: str = Field(..., max_length=200, description="产品名称")
    quantity: Decimal = Field(..., description="返工数量")
    rework_reason: str = Field(..., description="返工原因")
    rework_type: str = Field(..., max_length=50, description="返工类型（返工、返修、报废）")
    business_type: str = Field(
        "simple_exec",
        max_length=30,
        description="返工业务类型：multi_signoff/simple_exec/inventory_verify",
    )
    no_scrap_confirmed: bool = Field(False, description="无报废明确确认")
    need_warehouse_in: bool = Field(False, description="是否入库")
    product_line_code: Optional[str] = Field(None, max_length=50, description="产品线代码")
    verify_month: Optional[str] = Field(None, max_length=7, description="验证月份 YYYY-MM")
    show_to_customer: bool = Field(False, description="是否向客户展示")
    pqc_summary: Optional[str] = Field(None, description="PQC 质量记录汇总")
    pqc_summary_file_uuid: Optional[str] = Field(None, max_length=36)

    route_id: Optional[int] = Field(None, description="返工工艺路线ID")
    route_name: Optional[str] = Field(None, max_length=200, description="返工工艺路线名称")
    planned_start_date: Optional[datetime] = Field(None, description="计划开始日期")
    planned_end_date: Optional[datetime] = Field(None, description="计划结束日期")
    work_center_id: Optional[int] = Field(None, description="工作中心ID")
    work_center_name: Optional[str] = Field(None, max_length=200, description="工作中心名称")
    operator_id: Optional[int] = Field(None, description="操作员ID")
    operator_name: Optional[str] = Field(None, max_length=100, description="操作员姓名")
    remarks: Optional[str] = Field(None, description="备注")
    attachments: Optional[List[dict]] = Field(None, description="附件列表")


class ReworkOrderMaterialReqItem(BaseModel):
    """返工物料需求行"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    line_no: int = 1
    material_id: Optional[int] = None
    material_code: str = Field(..., max_length=80)
    material_name: str = Field(..., max_length=200)
    qty: Decimal = Field(...)
    unit: Optional[str] = Field(None, max_length=20)
    required_at: Optional[datetime] = None
    arrived_at: Optional[datetime] = None
    remarks: Optional[str] = Field(None, max_length=500)


class ReworkOrderScrapLineItem(BaseModel):
    """返工报废明细行"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    line_no: int = 1
    material_id: Optional[int] = None
    material_code: str = Field(..., max_length=80)
    material_name: str = Field(..., max_length=200)
    qty: Decimal = Field(...)
    unit: Optional[str] = Field(None, max_length=20)
    scrap_reason: Optional[str] = Field(None, max_length=500)
    remarks: Optional[str] = Field(None, max_length=500)


class ReworkOrderPositionPlanItem(BaseModel):
    """排位策划行（与制造执行工序正交）"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    line_no: int = 1
    sequence: int = 1
    station_name: str = Field(..., max_length=100, description="工序名称")
    section_name: Optional[str] = Field(None, max_length=100, description="工段/产线")
    station_code: Optional[str] = Field(None, max_length=50, description="工位/设备")
    planned_headcount: Optional[Decimal] = Field(None, description="计划人数")
    standard_minutes: Optional[Decimal] = Field(None, description="标准工时（分钟）")
    planned_start_at: Optional[datetime] = Field(None, description="计划开始")
    planned_end_at: Optional[datetime] = Field(None, description="计划完成")
    planned_qty: Optional[Decimal] = None
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    remarks: Optional[str] = Field(None, max_length=500)


class ReworkOrderSignoffItem(BaseModel):
    """会签结果行（响应）"""
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    dept_code: str
    dept_name: str
    sort_order: int = 0
    status: str = "pending"
    result: Optional[str] = None
    signer_id: Optional[int] = None
    signer_name: Optional[str] = None
    signed_at: Optional[datetime] = None
    notes: Optional[str] = None


class ReworkOrderOperationItem(BaseModel):
    """返工单工序行（响应）"""
    id: Optional[int] = Field(None, description="返工工序行 ID")
    work_order_operation_id: int = Field(..., description="工单工序ID")
    operation_code: Optional[str] = Field(None, description="工序编码")
    operation_name: Optional[str] = Field(None, description="工序名称")
    sequence: Optional[int] = Field(None, description="工序顺序")
    role: Optional[str] = Field(None, description="工序角色 start/planned/dynamic")
    status: Optional[str] = Field(None, description="执行状态 pending/active/completed/skipped")
    input_quantity: Optional[Decimal] = Field(None, description="投入数量")
    qualified_quantity: Optional[Decimal] = Field(None, description="合格数量")
    unqualified_quantity: Optional[Decimal] = Field(None, description="不合格数量")
    started_at: Optional[datetime] = Field(None, description="开始时间")
    completed_at: Optional[datetime] = Field(None, description="完成时间")
    decision_reason: Optional[str] = Field(None, description="动态决策原因")
    decided_by_name: Optional[str] = Field(None, description="决策人")
    decided_at: Optional[datetime] = Field(None, description="决策时间")
    is_start: bool = Field(False, description="是否为起始工序")
    is_current: bool = Field(False, description="是否为当前激活工序")


class ReworkOrderCapabilities(BaseModel):
    """返工单业务态 capabilities"""
    update: ActionCapability
    delete: ActionCapability
    release: ActionCapability
    execute: ActionCapability
    advance_next: ActionCapability
    request_complete: ActionCapability
    quality_release: ActionCapability
    finance_sign: ActionCapability
    pqc_check: ActionCapability
    oqc_notify: ActionCapability
    close: ActionCapability
    cancel: ActionCapability
    hold: ActionCapability
    resume: ActionCapability
    print: ActionCapability


class ReworkOrderCreate(ReworkOrderBase):
    """返工单创建Schema"""
    code: Optional[str] = Field(None, description="返工单编码（可选，自动生成）")
    routing_mode: str = Field("DYNAMIC", description="路线模式 DYNAMIC/PREDEFINED")
    verification_required: bool = Field(False, description="是否需要复检")
    start_work_order_operation_id: Optional[int] = Field(
        None, description="动态路线起始工序 ID（不选则取原工单首道工序）"
    )
    predefined_operation_ids: Optional[List[int]] = Field(
        None, description="预设路线有序工序 ID 列表（含起始工序）"
    )
    source_inspection_id: Optional[int] = Field(None, description="来源成品检验单 ID")
    material_reqs: Optional[List[ReworkOrderMaterialReqItem]] = Field(
        None, description="物料需求行（会签型）"
    )
    scrap_lines: Optional[List[ReworkOrderScrapLineItem]] = Field(
        None, description="报废明细行（会签型）"
    )
    position_plans: Optional[List[ReworkOrderPositionPlanItem]] = Field(
        None, description="排位策划行（会签型，与执行工序正交）"
    )


class ReworkOrderUpdate(BaseModel):
    """返工单更新Schema（草稿态字段，禁止直接写 status）"""
    model_config = ConfigDict(from_attributes=True)

    product_id: Optional[int] = Field(None, description="产品ID")
    product_code: Optional[str] = Field(None, max_length=50, description="产品编码")
    product_name: Optional[str] = Field(None, max_length=200, description="产品名称")
    quantity: Optional[Decimal] = Field(None, description="返工数量")
    rework_reason: Optional[str] = Field(None, description="返工原因")
    rework_type: Optional[str] = Field(None, max_length=50, description="返工类型")
    business_type: Optional[str] = Field(
        None, max_length=30, description="返工业务类型：multi_signoff/simple_exec/inventory_verify"
    )
    no_scrap_confirmed: Optional[bool] = Field(None, description="无报废明确确认")
    need_warehouse_in: Optional[bool] = Field(None, description="是否入库")
    product_line_code: Optional[str] = Field(None, max_length=50, description="产品线代码")
    verify_month: Optional[str] = Field(None, max_length=7, description="验证月份 YYYY-MM")
    show_to_customer: Optional[bool] = Field(None, description="是否向客户展示")
    pqc_summary: Optional[str] = Field(None, description="PQC 质量记录汇总")
    pqc_summary_file_uuid: Optional[str] = Field(None, max_length=36)
    route_id: Optional[int] = Field(None, description="返工工艺路线ID")
    route_name: Optional[str] = Field(None, max_length=200, description="返工工艺路线名称")
    planned_start_date: Optional[datetime] = Field(None, description="计划开始日期")
    planned_end_date: Optional[datetime] = Field(None, description="计划结束日期")
    work_center_id: Optional[int] = Field(None, description="工作中心ID")
    work_center_name: Optional[str] = Field(None, max_length=200, description="工作中心名称")
    operator_id: Optional[int] = Field(None, description="操作员ID")
    operator_name: Optional[str] = Field(None, description="操作员姓名")
    verification_required: Optional[bool] = Field(None, description="是否需要复检")
    remarks: Optional[str] = Field(None, description="备注")
    attachments: Optional[List[dict]] = Field(None, description="附件列表")
    start_work_order_operation_id: Optional[int] = Field(None, description="动态路线起始工序")
    predefined_operation_ids: Optional[List[int]] = Field(None, description="预设路线工序列表")
    material_reqs: Optional[List[ReworkOrderMaterialReqItem]] = Field(
        None, description="物料需求行（传入则全量替换）"
    )
    scrap_lines: Optional[List[ReworkOrderScrapLineItem]] = Field(
        None, description="报废明细行（传入则全量替换）"
    )
    position_plans: Optional[List[ReworkOrderPositionPlanItem]] = Field(
        None, description="排位策划行（传入则全量替换）"
    )


class ReworkOrderResponse(ReworkOrderBase):
    """返工单响应Schema"""
    id: int = Field(..., description="主键ID")
    uuid: str = Field(..., description="业务ID（UUID）")
    tenant_id: int = Field(..., description="组织ID")
    routing_mode: str = Field("DYNAMIC", description="路线模式")
    verification_required: bool = Field(False, description="是否需要复检")
    start_work_order_operation_id: Optional[int] = Field(None, description="起始工序 ID")
    current_operation_link_id: Optional[int] = Field(None, description="当前激活工序行 ID")
    status: str = Field(..., description="返工状态")
    completed_quantity: Optional[Decimal] = Field(None, description="完修数量")
    actual_start_date: Optional[datetime] = Field(None, description="实际开始日期")
    actual_end_date: Optional[datetime] = Field(None, description="实际结束日期")
    completion_requested_at: Optional[datetime] = Field(None, description="申请完修时间")
    completion_requested_by_name: Optional[str] = Field(None, description="申请完修人")
    quality_released_at: Optional[datetime] = Field(None, description="质量放行时间")
    quality_released_by_name: Optional[str] = Field(None, description="质量放行人")
    closed_at: Optional[datetime] = Field(None, description="关闭时间")
    closed_by_name: Optional[str] = Field(None, description="关闭人")
    finance_signed_at: Optional[datetime] = Field(None, description="财务会签时间")
    finance_signed_by_name: Optional[str] = Field(None, description="财务会签人")
    product_line_code: Optional[str] = Field(None, description="产品线代码")
    source_inspection_id: Optional[int] = Field(None, description="来源检验单 ID")
    verification_inspection_id: Optional[int] = Field(None, description="复检单 ID")
    verification_inspection_type: Optional[str] = Field(
        None,
        description="复检单类型：process_inspection（工序）/ finished_goods_inspection（成品）",
    )
    cost: Decimal = Field(Decimal("0"), description="返工成本")
    created_by: Optional[int] = Field(None, description="创建人ID")
    created_by_name: Optional[str] = Field(None, description="创建人姓名")
    updated_by: Optional[int] = Field(None, description="更新人ID")
    updated_by_name: Optional[str] = Field(None, description="更新人姓名")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    lifecycle: Optional[dict] = Field(None, description="生命周期")
    rework_operations: Optional[List[ReworkOrderOperationItem]] = Field(None, description="返工路线工序")
    material_reqs: Optional[List[ReworkOrderMaterialReqItem]] = Field(None, description="物料需求")
    scrap_lines: Optional[List[ReworkOrderScrapLineItem]] = Field(None, description="报废明细")
    position_plans: Optional[List[ReworkOrderPositionPlanItem]] = Field(None, description="排位策划")
    signoffs: Optional[List[ReworkOrderSignoffItem]] = Field(None, description="会签行")
    capabilities: Optional[ReworkOrderCapabilities] = Field(None, description="业务态 capabilities")


class ReworkOrderListResponse(BaseModel):
    """返工单列表响应Schema"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    code: str
    original_work_order_id: Optional[int]
    original_work_order_uuid: Optional[str]
    original_work_order_code: Optional[str] = None
    product_id: int
    product_code: str
    product_name: str
    quantity: Decimal
    rework_reason: str
    rework_type: str
    business_type: str = "simple_exec"
    product_line_code: Optional[str] = None
    verify_month: Optional[str] = None
    show_to_customer: bool = False
    pqc_summary: Optional[str] = None
    pqc_summary_file_uuid: Optional[str] = None
    pqc_checked_at: Optional[datetime] = None
    pqc_checked_by_name: Optional[str] = None
    routing_mode: str = "DYNAMIC"
    verification_required: bool = False
    status: str
    planned_start_date: Optional[datetime]
    planned_end_date: Optional[datetime]
    work_center_name: Optional[str]
    operator_name: Optional[str]
    cost: Decimal
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    lifecycle: Optional[dict] = Field(None, description="生命周期")
    capabilities: Optional[ReworkOrderCapabilities] = Field(None, description="业务态 capabilities")


class ReworkOrderFromWorkOrderRequest(BaseModel):
    """从工单创建返工单请求Schema"""
    rework_reason: str = Field(..., description="返工原因")
    rework_type: str = Field(..., max_length=50, description="返工类型")
    business_type: str = Field(
        "simple_exec",
        max_length=30,
        description="返工业务类型：multi_signoff/simple_exec",
    )
    quantity: Optional[Decimal] = Field(None, description="返工数量")
    routing_mode: str = Field("DYNAMIC", description="路线模式 DYNAMIC/PREDEFINED")
    verification_required: bool = Field(False, description="是否需要复检")
    route_id: Optional[int] = Field(None, description="返工工艺路线ID")
    work_center_id: Optional[int] = Field(None, description="工作中心ID")
    start_work_order_operation_id: Optional[int] = Field(None, description="动态路线起始工序")
    predefined_operation_ids: Optional[List[int]] = Field(None, description="预设路线工序列表")
    planned_start_date: Optional[datetime] = Field(None, description="计划开始时间")
    planned_end_date: Optional[datetime] = Field(None, description="计划结束时间")
    remarks: Optional[str] = Field(None, description="备注")
    product_line_code: Optional[str] = Field(None, max_length=50, description="产品线代码")


class ReworkFromWorkOrderPreviewResponse(BaseModel):
    """从工单创建返工单：可返工数量预览"""
    reworkable_quantity: Decimal = Field(..., description="可返工数量")
    unqualified_quantity: Decimal = Field(..., description="不合格数量（来源口径）")
    already_rework_quantity: Decimal = Field(..., description="已创建返工单占用数量")
    start_work_order_operation_id: Optional[int] = Field(
        None, description="预览所依据的起始工序"
    )


class ReworkAdvanceNextRequest(BaseModel):
    """动态路线追加下一工序"""
    next_work_order_operation_id: int = Field(..., description="下一道工序 ID")
    input_quantity: Optional[Decimal] = Field(None, description="投入数量（默认取上道合格数）")
    decision_reason: Optional[str] = Field(None, description="决策原因")


class ReworkRequestCompleteRequest(BaseModel):
    """申请完修"""
    completed_quantity: Optional[Decimal] = Field(None, description="完修数量（默认取末道合格数）")
    remarks: Optional[str] = Field(None, description="备注")


class ReworkQualityReleaseRequest(BaseModel):
    """质量放行（复检通过后）"""
    remarks: Optional[str] = Field(None, description="备注")


class ReworkCloseRequest(BaseModel):
    """关闭返工单"""
    remarks: Optional[str] = Field(None, description="关闭备注")


class ReworkFinanceSignRequest(BaseModel):
    """财务会签（会签型关闭前必经）"""
    notes: Optional[str] = Field(None, max_length=500, description="会签备注")


class ReworkPqcCheckRequest(BaseModel):
    """库存验证 PQC 主管核对"""
    pqc_summary: Optional[str] = Field(None, description="PQC 质量记录汇总（可顺带写入）")
    pqc_summary_file_uuid: Optional[str] = Field(None, max_length=36, description="汇总扫描件")
    notes: Optional[str] = Field(None, max_length=500, description="核对备注")


class ReworkOqcNotifyRequest(BaseModel):
    """库存验证 OQC 结果通知（勾选接收人）"""
    recipient_user_ids: List[int] = Field(..., min_length=1, description="通知接收人用户 ID")
    remarks: Optional[str] = Field(None, max_length=500, description="通知备注")


class ReworkCancelRequest(BaseModel):
    """取消返工单"""
    reason: Optional[str] = Field(None, description="取消原因")


class ReworkHoldRequest(BaseModel):
    """暂停返工单"""
    reason: Optional[str] = Field(None, description="暂停原因")


class ReworkReportingCreate(BaseModel):
    """返工单报工请求"""
    work_order_operation_id: int = Field(..., description="原工单工序 ID")
    worker_id: int = Field(..., description="操作工 ID")
    worker_name: str = Field(..., description="操作工姓名")
    reported_quantity: Decimal = Field(..., description="报工数量")
    qualified_quantity: Decimal = Field(..., description="合格数量")
    unqualified_quantity: Decimal = Field(..., description="不合格数量")
    work_hours: Decimal = Field(Decimal("0"), description="工时（小时）")
    reported_at: datetime = Field(..., description="报工时间")
    remarks: Optional[str] = Field(None, description="备注")


class ReworkReportingOptionItem(BaseModel):
    """返工报工可选工序"""
    work_order_operation_id: int
    operation_code: Optional[str] = None
    operation_name: Optional[str] = None
    sequence: Optional[int] = None
    is_start_operation: bool = False
    is_current_operation: bool = False
    reported_quantity: Decimal = Decimal("0")
    qualified_quantity: Decimal = Decimal("0")
    selectable: bool = True


class ReworkReportingOptionsResponse(BaseModel):
    """返工报工选项"""
    rework_order_id: int
    rework_order_code: str
    routing_mode: str
    rework_quantity: Decimal
    current_work_order_operation_id: Optional[int] = None
    current_operation_name: Optional[str] = None
    remaining_input_quantity: Decimal = Decimal("0")
    total_qualified_quantity: Decimal = Decimal("0")
    operations: List[ReworkReportingOptionItem]
