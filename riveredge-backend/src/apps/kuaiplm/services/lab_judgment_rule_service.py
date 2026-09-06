"""实验判定规则服务（版本化主数据）。"""

from __future__ import annotations

from typing import Optional

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.lab_judgment_rule import LabJudgmentRule
from apps.kuaiplm.schemas.lab_judgment_rule import (
    LabJudgmentRuleCreate,
    LabJudgmentRuleListResponse,
    LabJudgmentRuleOption,
    LabJudgmentRuleResponse,
    LabJudgmentRuleReviseRequest,
    LabJudgmentRuleUpdate,
)
from apps.kuaiplm.services.lab_judgment_engine import COMPARE_TYPES
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User


class LabJudgmentRuleService(AppBaseService[LabJudgmentRule]):
    code_field = "rule_code"
    rule_code = "KUAI_PLM_LAB_JUDGMENT_RULE_CODE"
    code_prefix = "LJR"

    def __init__(self) -> None:
        super().__init__(LabJudgmentRule)
        self.model = LabJudgmentRule

    def _validate_compare_type(self, raw: Optional[str]) -> str:
        cmp = (raw or "range").strip().lower()
        if cmp not in COMPARE_TYPES:
            raise ValidationError(f"非法比较方式: {raw}")
        return cmp

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    def _to_response(self, row: LabJudgmentRule) -> LabJudgmentRuleResponse:
        return LabJudgmentRuleResponse.model_validate(row)

    def _to_option(self, row: LabJudgmentRule) -> LabJudgmentRuleOption:
        label = f"{row.rule_name}（{row.rule_code}@{row.version}）"
        return LabJudgmentRuleOption(
            id=row.id,
            rule_code=row.rule_code,
            rule_name=row.rule_name,
            version=row.version,
            compare_type=row.compare_type,
            standard_min=row.standard_min,
            standard_max=row.standard_max,
            standard_value=row.standard_value,
            unit=row.unit,
            item_name=row.item_name,
            label=label,
        )

    async def _get_row(self, tenant_id: int, rule_id: int) -> LabJudgmentRule:
        row = await LabJudgmentRule.filter(
            tenant_id=tenant_id, id=rule_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("判定规则不存在")
        return row

    async def create(
        self, tenant_id: int, data: LabJudgmentRuleCreate, current_user: User
    ) -> LabJudgmentRuleResponse:
        code = await self._ensure_code(tenant_id, data.rule_code)
        version = (data.version or "1").strip() or "1"
        clash = await LabJudgmentRule.filter(
            tenant_id=tenant_id,
            rule_code=code,
            version=version,
            deleted_at__isnull=True,
        ).exists()
        if clash:
            raise BusinessLogicError(f"规则编码与版本已存在: {code}@{version}")
        row = LabJudgmentRule(
            tenant_id=tenant_id,
            rule_code=code,
            rule_name=(data.rule_name or "").strip(),
            version=version,
            compare_type=self._validate_compare_type(data.compare_type),
            standard_min=(data.standard_min or "").strip() or None,
            standard_max=(data.standard_max or "").strip() or None,
            standard_value=(data.standard_value or "").strip() or None,
            unit=(data.unit or "").strip() or None,
            item_name=(data.item_name or "").strip() or None,
            is_active=bool(data.is_active),
            remarks=(data.remarks or "").strip() or None,
        )
        if not row.rule_name:
            raise ValidationError("规则名称不能为空")
        apply_create_audit(row, current_user)
        await row.save()
        return self._to_response(row)

    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
        keyword: Optional[str] = None,
        is_active: Optional[bool] = None,
        rule_code: Optional[str] = None,
    ) -> LabJudgmentRuleListResponse:
        query = LabJudgmentRule.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if is_active is not None:
            query = query.filter(is_active=is_active)
        if rule_code:
            query = query.filter(rule_code=rule_code.strip())
        if keyword:
            kw = keyword.strip()
            query = query.filter(
                Q(rule_code__icontains=kw)
                | Q(rule_name__icontains=kw)
                | Q(version__icontains=kw)
                | Q(item_name__icontains=kw)
            )
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return LabJudgmentRuleListResponse(
            data=[self._to_response(r) for r in rows],
            total=total,
            success=True,
        )

    async def list_options(
        self, tenant_id: int, *, keyword: Optional[str] = None, limit: int = 100
    ) -> list[LabJudgmentRuleOption]:
        """启用中的规则（选用试验项时下拉）。"""
        query = LabJudgmentRule.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, is_active=True
        )
        if keyword:
            kw = keyword.strip()
            query = query.filter(
                Q(rule_code__icontains=kw)
                | Q(rule_name__icontains=kw)
                | Q(version__icontains=kw)
            )
        rows = await query.order_by("rule_code", "-version", "-id").limit(limit)
        return [self._to_option(r) for r in rows]

    async def get(self, tenant_id: int, rule_id: int) -> LabJudgmentRuleResponse:
        return self._to_response(await self._get_row(tenant_id, rule_id))

    async def update(
        self,
        tenant_id: int,
        rule_id: int,
        data: LabJudgmentRuleUpdate,
        current_user: User,
    ) -> LabJudgmentRuleResponse:
        row = await self._get_row(tenant_id, rule_id)
        payload = data.model_dump(exclude_unset=True)
        if "rule_name" in payload:
            name = (payload["rule_name"] or "").strip()
            if not name:
                raise ValidationError("规则名称不能为空")
            row.rule_name = name
        if "compare_type" in payload:
            row.compare_type = self._validate_compare_type(payload.get("compare_type"))
        for field in (
            "standard_min",
            "standard_max",
            "standard_value",
            "unit",
            "item_name",
            "remarks",
        ):
            if field in payload:
                val = payload.get(field)
                setattr(row, field, (val or "").strip() or None if isinstance(val, str) or val is None else val)
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        apply_update_audit(row, current_user)
        await row.save()
        return self._to_response(row)

    def _next_version(self, current: str) -> str:
        text = (current or "1").strip()
        if text.isdigit():
            return str(int(text) + 1)
        return f"{text}-rev"

    async def revise(
        self,
        tenant_id: int,
        rule_id: int,
        data: LabJudgmentRuleReviseRequest,
        current_user: User,
    ) -> LabJudgmentRuleResponse:
        src = await self._get_row(tenant_id, rule_id)
        new_version = (data.version or "").strip() or self._next_version(src.version)
        clash = await LabJudgmentRule.filter(
            tenant_id=tenant_id,
            rule_code=src.rule_code,
            version=new_version,
            deleted_at__isnull=True,
        ).exists()
        if clash:
            raise BusinessLogicError(f"规则版本已存在: {src.rule_code}@{new_version}")
        row = LabJudgmentRule(
            tenant_id=tenant_id,
            rule_code=src.rule_code,
            rule_name=(data.rule_name or src.rule_name or "").strip(),
            version=new_version,
            compare_type=self._validate_compare_type(
                data.compare_type or src.compare_type
            ),
            standard_min=(
                (data.standard_min if data.standard_min is not None else src.standard_min)
                or ""
            ).strip()
            or None,
            standard_max=(
                (data.standard_max if data.standard_max is not None else src.standard_max)
                or ""
            ).strip()
            or None,
            standard_value=(
                (
                    data.standard_value
                    if data.standard_value is not None
                    else src.standard_value
                )
                or ""
            ).strip()
            or None,
            unit=((data.unit if data.unit is not None else src.unit) or "").strip()
            or None,
            item_name=(
                (data.item_name if data.item_name is not None else src.item_name) or ""
            ).strip()
            or None,
            is_active=True,
            remarks=(
                (data.remarks if data.remarks is not None else src.remarks) or ""
            ).strip()
            or None,
        )
        apply_create_audit(row, current_user)
        await row.save()
        if data.deactivate_previous and src.is_active:
            src.is_active = False
            apply_update_audit(src, current_user)
            await src.save()
        return self._to_response(row)

    async def delete(
        self, tenant_id: int, rule_id: int, current_user: User
    ) -> None:
        row = await self._get_row(tenant_id, rule_id)
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, current_user)
        await row.save()
