"""固定资产折旧计提与报表服务。"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Optional

from apps.kuaicaiwu.models.fixed_asset import (
    FaAsset,
    FaDepreciationAdjustment,
    FaDepreciationRun,
    FaDepreciationRunLine,
    FaPeriodClose,
)
from apps.kuaicaiwu.services.fa_core import (
    compute_net_value,
    generate_daily_code,
    model_to_dict,
    quantize_money,
    touch_updated,
)
from apps.kuaicaiwu.services.accounting_event_service import AccountingEventService
from apps.kuaicaiwu.services.finance_integration_hooks import record_finance_accounting_event
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User


class FaDepreciationService:
    async def _ensure_period_open(self, tenant_id: int, year: int, month: int) -> None:
        closed = await FaPeriodClose.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            deleted_at__isnull=True,
        ).exists()
        if closed:
            raise BusinessLogicError(f"{year:04d}-{month:02d} 资产期间已结账，不可计提或调整")

    async def preview_run(
        self, tenant_id: int, year: int, month: int, user: User
    ) -> dict[str, Any]:
        await self._ensure_period_open(tenant_id, year, month)
        existing = await FaDepreciationRun.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            status="confirmed",
            deleted_at__isnull=True,
        ).exists()
        if existing:
            raise BusinessLogicError("该期间已完成折旧计提")

        draft = await FaDepreciationRun.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            status="draft",
            deleted_at__isnull=True,
        ).first()
        if draft:
            await FaDepreciationRunLine.filter(tenant_id=tenant_id, run_id=draft.id).delete()
            run = draft
        else:
            run_code = await generate_daily_code(
                FaDepreciationRun, tenant_id, "FDR", "run_code"
            )
            run = await FaDepreciationRun.create(
                tenant_id=tenant_id,
                run_code=run_code,
                period_year=year,
                period_month=month,
                status="draft",
                total_amount=Decimal("0"),
                created_at=resolve_business_datetime(),
                updated_at=resolve_business_datetime(),
                created_by=user.id,
                created_by_name=getattr(user, "name", None) or getattr(user, "username", None),
            )

        assets = await FaAsset.filter(
            tenant_id=tenant_id, status="active", deleted_at__isnull=True
        ).all()
        total = Decimal("0")
        lines: list[FaDepreciationRunLine] = []
        for asset in assets:
            if int(asset.depreciated_periods or 0) >= int(asset.useful_life_months or 0):
                continue
            net = compute_net_value(
                quantize_money(asset.original_value),
                quantize_money(asset.accumulated_depreciation),
                quantize_money(asset.impairment_value),
            )
            residual = quantize_money(
                quantize_money(asset.original_value) * quantize_money(asset.residual_rate)
            )
            if net <= residual:
                continue
            calc = quantize_money(asset.monthly_depreciation)
            if calc <= 0:
                continue
            if net - calc < residual:
                calc = quantize_money(net - residual)
            if calc <= 0:
                continue
            line = await FaDepreciationRunLine.create(
                tenant_id=tenant_id,
                run_id=run.id,
                asset_id=asset.id,
                asset_code=asset.asset_code,
                asset_name=asset.asset_name,
                calculated_amount=calc,
                final_amount=calc,
                created_at=resolve_business_datetime(),
                updated_at=resolve_business_datetime(),
            )
            lines.append(line)
            total += calc

        run.total_amount = total
        await run.save()
        return {
            **model_to_dict(run),
            "lines": [model_to_dict(l) for l in lines],
        }

    async def get_run(self, tenant_id: int, run_id: int) -> dict[str, Any]:
        run = await FaDepreciationRun.get_or_none(
            id=run_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not run:
            raise NotFoundError("折旧计提批次不存在")
        lines = await FaDepreciationRunLine.filter(
            tenant_id=tenant_id, run_id=run_id, deleted_at__isnull=True
        ).order_by("id")
        return {**model_to_dict(run), "lines": [model_to_dict(l) for l in lines]}

    async def list_runs(
        self, tenant_id: int, *, skip: int = 0, limit: int = 50
    ) -> dict[str, Any]:
        q = FaDepreciationRun.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        total = await q.count()
        rows = await q.order_by("-period_year", "-period_month", "-id").offset(skip).limit(limit)
        return {
            "items": [model_to_dict(r) for r in rows],
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def update_line_amount(
        self,
        tenant_id: int,
        run_id: int,
        line_id: int,
        final_amount: Decimal,
        user: User,
    ) -> dict[str, Any]:
        run = await FaDepreciationRun.get_or_none(
            id=run_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not run:
            raise NotFoundError("折旧计提批次不存在")
        if run.status != "draft":
            raise BusinessLogicError("仅草稿批次可修改明细金额")
        line = await FaDepreciationRunLine.get_or_none(
            id=line_id, tenant_id=tenant_id, run_id=run_id, deleted_at__isnull=True
        )
        if not line:
            raise NotFoundError("计提明细不存在")
        amt = quantize_money(final_amount)
        if amt < 0:
            raise ValidationError("计提金额不能为负")
        line.final_amount = amt
        if amt != quantize_money(line.calculated_amount):
            line.adjusted_by = user.id
            line.adjusted_by_name = getattr(user, "name", None) or getattr(user, "username", None)
            line.adjusted_at = resolve_business_datetime()
        await line.save()

        lines = await FaDepreciationRunLine.filter(
            tenant_id=tenant_id, run_id=run_id, deleted_at__isnull=True
        )
        run.total_amount = sum(quantize_money(l.final_amount) for l in lines)
        await run.save()
        return model_to_dict(line)

    async def confirm_run(self, tenant_id: int, run_id: int, user: User) -> dict[str, Any]:
        run = await FaDepreciationRun.get_or_none(
            id=run_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not run:
            raise NotFoundError("折旧计提批次不存在")
        if run.status != "draft":
            raise BusinessLogicError("该批次已确认")
        await self._ensure_period_open(tenant_id, run.period_year, run.period_month)

        lines = await FaDepreciationRunLine.filter(
            tenant_id=tenant_id, run_id=run_id, deleted_at__isnull=True
        ).all()
        if not lines:
            raise BusinessLogicError("无可计提明细")

        for line in lines:
            amt = quantize_money(line.final_amount)
            if amt <= 0:
                continue
            asset = await FaAsset.get_or_none(
                id=line.asset_id, tenant_id=tenant_id, deleted_at__isnull=True
            )
            if not asset:
                continue
            asset.accumulated_depreciation = quantize_money(asset.accumulated_depreciation) + amt
            asset.depreciated_periods = int(asset.depreciated_periods or 0) + 1
            await asset.save()

            event = await AccountingEventService.record_event(
                tenant_id=tenant_id,
                event_type="FA_DEPRECIATION",
                business_type="fixed_asset",
                source_doc_type="fa_depr_run_line",
                source_doc_id=line.id,
                source_doc_code=f"{run.run_code}-{asset.asset_code}",
                target_doc_type="fa_asset",
                target_doc_id=asset.id,
                target_doc_code=asset.asset_code,
                amount=amt,
                operator_id=user.id,
                notes=f"{run.period_year:04d}-{run.period_month:02d} 固定资产折旧 {asset.asset_name}",
                payload={
                    "expense_account_code": asset.expense_account_code,
                    "accumulated_depreciation_account_code": asset.accumulated_depreciation_account_code,
                    "asset_account_code": asset.asset_account_code,
                    "department_id": asset.department_id,
                    "department_name": asset.department_name,
                    "asset_code": asset.asset_code,
                    "asset_name": asset.asset_name,
                    "period_year": run.period_year,
                    "period_month": run.period_month,
                },
            )
            line.accounting_event_id = event.id
            await line.save()

        run.status = "confirmed"
        run.confirmed_at = resolve_business_datetime()
        run.confirmed_by = user.id
        run.confirmed_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        await run.save()
        return await self.get_run(tenant_id, run_id)

    async def depreciation_detail_report(
        self,
        tenant_id: int,
        *,
        year: Optional[int] = None,
        month: Optional[int] = None,
        asset_code: Optional[str] = None,
        asset_name: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        q = FaDepreciationRunLine.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if asset_code:
            q = q.filter(asset_code__icontains=asset_code.strip())
        if asset_name:
            q = q.filter(asset_name__icontains=asset_name.strip())
        lines = await q.order_by("-id").limit(5000)
        run_ids = {l.run_id for l in lines}
        runs = {
            r.id: r
            for r in await FaDepreciationRun.filter(id__in=list(run_ids)).all()
        }
        asset_ids = {l.asset_id for l in lines}
        assets = {
            a.id: a
            for a in await FaAsset.filter(id__in=list(asset_ids), deleted_at__isnull=True).all()
        }
        result: list[dict[str, Any]] = []
        for line in lines:
            run = runs.get(line.run_id)
            if not run or run.status != "confirmed":
                continue
            if year and run.period_year != year:
                continue
            if month and run.period_month != month:
                continue
            item = model_to_dict(line)
            item["period_year"] = run.period_year
            item["period_month"] = run.period_month
            item["run_code"] = run.run_code
            item["confirmed_by_name"] = run.confirmed_by_name
            item["confirmed_at"] = run.confirmed_at
            calculated = quantize_money(line.calculated_amount or 0)
            final = quantize_money(line.final_amount or 0)
            item["adjustment_amount"] = float(final - calculated)
            asset = assets.get(line.asset_id)
            if asset:
                item["category_name"] = asset.category_name
                item["department_name"] = asset.department_name
                item["user_name"] = asset.user_name
                item["original_value"] = float(asset.original_value or 0)
                item["accumulated_depreciation"] = float(asset.accumulated_depreciation or 0)
                item["net_value"] = float(compute_net_value(asset))
                item["expense_account_code"] = asset.expense_account_code
            result.append(item)
        return result

    async def depreciation_summary_report(
        self,
        tenant_id: int,
        *,
        year: Optional[int] = None,
        month: Optional[int] = None,
    ) -> list[dict[str, Any]]:
        details = await self.depreciation_detail_report(
            tenant_id, year=year, month=month
        )
        bucket: dict[tuple[int, int], dict[str, Any]] = {}
        for row in details:
            key = (int(row["period_year"]), int(row["period_month"]))
            if key not in bucket:
                bucket[key] = {
                    "calculated_total": Decimal("0"),
                    "total_amount": Decimal("0"),
                    "adjustment_total": Decimal("0"),
                    "line_count": 0,
                    "run_codes": set(),
                }
            entry = bucket[key]
            calculated = quantize_money(row.get("calculated_amount") or 0)
            final = quantize_money(row.get("final_amount") or 0)
            entry["calculated_total"] += calculated
            entry["total_amount"] += final
            entry["adjustment_total"] += final - calculated
            entry["line_count"] += 1
            run_code = row.get("run_code")
            if run_code:
                entry["run_codes"].add(str(run_code))
        return [
            {
                "period_year": y,
                "period_month": m,
                "period": f"{y:04d}-{m:02d}",
                "line_count": entry["line_count"],
                "run_count": len(entry["run_codes"]),
                "calculated_total": float(entry["calculated_total"]),
                "adjustment_total": float(entry["adjustment_total"]),
                "total_amount": float(entry["total_amount"]),
            }
            for (y, m), entry in sorted(bucket.items(), reverse=True)
        ]


class FaAdjustmentService:
    async def list_adjustments(self, tenant_id: int) -> list[dict[str, Any]]:
        rows = await FaDepreciationAdjustment.filter(
            tenant_id=tenant_id, deleted_at__isnull=True
        ).order_by("-created_at", "-id")
        return [model_to_dict(r) for r in rows]

    async def create_adjustment(
        self, tenant_id: int, data: dict[str, Any], user: User
    ) -> dict[str, Any]:
        year = int(data["period_year"])
        month = int(data["period_month"])
        await FaDepreciationService()._ensure_period_open(tenant_id, year, month)
        asset = await FaAsset.get_or_none(
            id=int(data["asset_id"]), tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        code = await generate_daily_code(
            FaDepreciationAdjustment, tenant_id, "FAD", "adjustment_code"
        )
        row = await FaDepreciationAdjustment.create(
            tenant_id=tenant_id,
            adjustment_code=code,
            asset_id=asset.id,
            asset_code=asset.asset_code,
            asset_name=asset.asset_name,
            period_year=year,
            period_month=month,
            adjustment_amount=quantize_money(data["adjustment_amount"]),
            reason=data.get("reason"),
            status="draft",
            created_at=resolve_business_datetime(),
            updated_at=resolve_business_datetime(),
            created_by=user.id,
            created_by_name=getattr(user, "name", None) or getattr(user, "username", None),
        )
        return model_to_dict(row)

    async def confirm_adjustment(
        self, tenant_id: int, adjustment_id: int, user: User
    ) -> dict[str, Any]:
        row = await FaDepreciationAdjustment.get_or_none(
            id=adjustment_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("折旧调整单不存在")
        if row.status != "draft":
            raise BusinessLogicError("调整单已确认")
        await FaDepreciationService()._ensure_period_open(
            tenant_id, row.period_year, row.period_month
        )
        asset = await FaAsset.get_or_none(
            id=row.asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        amt = quantize_money(row.adjustment_amount)
        asset.accumulated_depreciation = quantize_money(asset.accumulated_depreciation) + amt
        await asset.save()
        await record_finance_accounting_event(
            tenant_id=tenant_id,
            event_type="FA_DEPRECIATION",
            business_type="fixed_asset_adjustment",
            source_doc_type="fa_depr_adjustment",
            source_doc_id=row.id,
            source_doc_code=row.adjustment_code,
            target_doc_type="fa_asset",
            target_doc_id=asset.id,
            target_doc_code=asset.asset_code,
            amount=abs(amt),
            operator_id=user.id,
            notes=row.reason or f"折旧调整 {row.adjustment_code}",
            payload={
                "expense_account_code": asset.expense_account_code,
                "accumulated_depreciation_account_code": asset.accumulated_depreciation_account_code,
                "department_id": asset.department_id,
                "department_name": asset.department_name,
            },
        )
        row.status = "confirmed"
        await touch_updated(row, user)
        await row.save()
        return model_to_dict(row)


class FaPeriodCloseService:
    async def list_closes(self, tenant_id: int) -> list[dict[str, Any]]:
        rows = await FaPeriodClose.filter(
            tenant_id=tenant_id, deleted_at__isnull=True
        ).order_by("-period_year", "-period_month")
        return [model_to_dict(r) for r in rows]

    async def close_period(
        self, tenant_id: int, year: int, month: int, user: User, notes: Optional[str] = None
    ) -> dict[str, Any]:
        exists = await FaPeriodClose.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            deleted_at__isnull=True,
        ).exists()
        if exists:
            raise BusinessLogicError(f"{year:04d}-{month:02d} 已结账")
        draft_run = await FaDepreciationRun.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            status="draft",
            deleted_at__isnull=True,
        ).exists()
        if draft_run:
            raise BusinessLogicError("存在未确认的折旧计提草稿，请先处理")
        row = await FaPeriodClose.create(
            tenant_id=tenant_id,
            period_year=year,
            period_month=month,
            closed_at=resolve_business_datetime(),
            closed_by=user.id,
            closed_by_name=getattr(user, "name", None) or getattr(user, "username", None),
            notes=notes,
            created_at=resolve_business_datetime(),
            updated_at=resolve_business_datetime(),
            created_by=user.id,
            created_by_name=getattr(user, "name", None) or getattr(user, "username", None),
        )
        return model_to_dict(row)
