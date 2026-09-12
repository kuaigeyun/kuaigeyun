"""采购订单付款里程碑（参照销售订单收款计划）。"""

from __future__ import annotations

from decimal import Decimal
from typing import List, Optional

from apps.kuaizhizao.models.purchase_order import PurchaseOrder
from apps.kuaizhizao.models.purchase_order_milestone import PurchaseOrderMilestone
from apps.kuaizhizao.schemas.purchase import (
    PurchaseOrderMilestoneCreate,
    PurchaseOrderMilestoneResponse,
)
from infra.exceptions.exceptions import BusinessLogicError


class PurchaseOrderTermsService:
    async def replace_order_milestones(
        self,
        tenant_id: int,
        purchase_order_id: int,
        milestones: Optional[List[PurchaseOrderMilestoneCreate]],
    ) -> None:
        if milestones is None:
            return
        prepay_count = sum(1 for ms in milestones if bool(getattr(ms, "is_prepayment", False)))
        if prepay_count > 1:
            raise BusinessLogicError("付款计划中最多只能有一个预付节点")
        existing = await PurchaseOrderMilestone.filter(
            tenant_id=tenant_id, purchase_order_id=purchase_order_id
        )
        for row in existing:
            if row.payable_id:
                raise BusinessLogicError("已有里程碑生成应付，不可删除或覆盖")
        await PurchaseOrderMilestone.filter(
            tenant_id=tenant_id, purchase_order_id=purchase_order_id
        ).delete()
        for ms in milestones:
            is_prepay = bool(ms.is_prepayment)
            auto_payable = bool(ms.auto_generate_payable) if not is_prepay else False
            await PurchaseOrderMilestone.create(
                tenant_id=tenant_id,
                purchase_order_id=purchase_order_id,
                milestone_name=ms.milestone_name,
                planned_date=ms.planned_date,
                planned_amount=Decimal(str(ms.planned_amount or 0)),
                planned_ratio=ms.planned_ratio,
                billing_trigger=ms.billing_trigger or "milestone",
                is_prepayment=is_prepay,
                auto_generate_payable=auto_payable,
                bank_account_id=ms.bank_account_id if is_prepay else None,
                notes=ms.notes,
            )
        await self.sync_order_prepayment_from_milestones(tenant_id, purchase_order_id)

    @classmethod
    async def sync_order_prepayment_from_milestones(
        cls, tenant_id: int, purchase_order_id: int
    ) -> None:
        """预付节点回写订单表头预付字段，保证确认后自动生成预付付款单逻辑不断。"""
        order = await PurchaseOrder.get_or_none(
            tenant_id=tenant_id, id=purchase_order_id, deleted_at__isnull=True
        )
        if not order:
            return
        prepay_rows = await PurchaseOrderMilestone.filter(
            tenant_id=tenant_id, purchase_order_id=purchase_order_id, is_prepayment=True
        )
        if len(prepay_rows) > 1:
            raise BusinessLogicError("付款计划中最多只能有一个预付节点")
        if not prepay_rows:
            order.prepayment_amount = None
            order.prepayment_bank_account_id = None
        else:
            row = prepay_rows[0]
            order.prepayment_amount = Decimal(str(row.planned_amount or 0))
            order.prepayment_bank_account_id = row.bank_account_id
        await order.save(
            update_fields=["prepayment_amount", "prepayment_bank_account_id", "updated_at"]
        )

    @staticmethod
    async def load_payment_milestones(
        tenant_id: int, purchase_order_id: int
    ) -> List[PurchaseOrderMilestoneResponse]:
        rows = await PurchaseOrderMilestone.filter(
            tenant_id=tenant_id, purchase_order_id=purchase_order_id
        ).order_by("planned_date", "id")
        if rows:
            return [PurchaseOrderMilestoneResponse.model_validate(r) for r in rows]

        order = await PurchaseOrder.get_or_none(
            tenant_id=tenant_id, id=purchase_order_id, deleted_at__isnull=True
        )
        if not order:
            return []
        amount = Decimal(str(order.prepayment_amount or 0))
        if amount <= 0:
            return []
        planned_date = order.order_date
        if planned_date is None:
            return []
        return [
            PurchaseOrderMilestoneResponse(
                id=0,
                uuid="",
                tenant_id=tenant_id,
                purchase_order_id=purchase_order_id,
                milestone_name="预付",
                planned_date=planned_date,
                planned_amount=amount,
                planned_ratio=None,
                billing_trigger="milestone",
                is_prepayment=True,
                auto_generate_payable=False,
                bank_account_id=order.prepayment_bank_account_id,
                status="pending",
                payable_id=None,
                payable_code=None,
                notes=None,
                created_at=order.created_at,
                updated_at=order.updated_at,
            )
        ]
