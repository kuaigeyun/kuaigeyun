"""生产日报服务（R-13）：模板驱动录入与汇总。"""

from __future__ import annotations

from typing import Any, List, Optional

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaizhizao.models.production_daily import (
    ProductionDailyReport,
    ProductionDailyTemplate,
)
from apps.kuaizhizao.schemas.production_daily import (
    ProductionDailyFieldDef,
    ProductionDailyReportCreate,
    ProductionDailyReportListResponse,
    ProductionDailyReportResponse,
    ProductionDailyReportUpdate,
    ProductionDailyTemplateCreate,
    ProductionDailyTemplateListResponse,
    ProductionDailyTemplateResponse,
    ProductionDailyTemplateUpdate,
)
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

ALLOWED_FIELD_TYPES = frozenset({"text", "number", "textarea", "select"})

DEFAULT_TEMPLATES: list[dict[str, Any]] = [
    {
        "template_code": "line_daily",
        "template_name": "产线日报",
        "description": "通用产线/班组生产日报（可改字段）",
        "sort_order": 10,
        "field_schema": [
            {"key": "plan_qty", "label": "计划产量", "type": "number", "required": False},
            {"key": "actual_qty", "label": "实际产量", "type": "number", "required": True},
            {"key": "ok_qty", "label": "合格数", "type": "number", "required": False},
            {"key": "ng_qty", "label": "不良数", "type": "number", "required": False},
            {"key": "manpower", "label": "出勤人数", "type": "number", "required": False},
            {"key": "note", "label": "说明", "type": "textarea", "required": False},
        ],
    },
    {
        "template_code": "dadp_daily",
        "template_name": "DADP日报",
        "description": "DADP 类日报模板（可改字段）",
        "sort_order": 20,
        "field_schema": [
            {"key": "item_name", "label": "项目", "type": "text", "required": True},
            {"key": "plan_qty", "label": "计划数", "type": "number", "required": False},
            {"key": "actual_qty", "label": "完成数", "type": "number", "required": True},
            {"key": "progress_note", "label": "进度说明", "type": "textarea", "required": False},
        ],
    },
    {
        "template_code": "exception_daily",
        "template_name": "异常日报",
        "description": "异常类日报模板（可改字段）",
        "sort_order": 30,
        "field_schema": [
            {"key": "exception_type", "label": "异常类型", "type": "text", "required": True},
            {"key": "exception_count", "label": "异常次数", "type": "number", "required": False},
            {"key": "impact_qty", "label": "影响数量", "type": "number", "required": False},
            {"key": "exception_desc", "label": "异常描述", "type": "textarea", "required": True},
        ],
    },
]


def _normalize_field_schema(raw: Any) -> list[dict[str, Any]]:
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise ValidationError("field_schema 必须为数组")
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for idx, item in enumerate(raw):
        if isinstance(item, ProductionDailyFieldDef):
            data = item.model_dump()
        elif isinstance(item, dict):
            data = ProductionDailyFieldDef.model_validate(item).model_dump()
        else:
            raise ValidationError(f"field_schema[{idx}] 格式无效")
        key = str(data["key"]).strip()
        if not key:
            raise ValidationError(f"field_schema[{idx}].key 不能为空")
        if key in seen:
            raise ValidationError(f"字段键重复: {key}")
        seen.add(key)
        ftype = str(data.get("type") or "text").strip().lower()
        if ftype not in ALLOWED_FIELD_TYPES:
            raise ValidationError(f"不支持的字段类型: {ftype}")
        data["key"] = key
        data["type"] = ftype
        data["label"] = str(data.get("label") or key).strip()
        if ftype == "select":
            opts = data.get("options") or []
            if not isinstance(opts, list) or not opts:
                raise ValidationError(f"字段 {key} 为 select 时须提供 options")
        out.append(data)
    return out


def _validate_field_values(schema: list[dict[str, Any]], values: dict[str, Any]) -> dict[str, Any]:
    vals = dict(values or {})
    cleaned: dict[str, Any] = {}
    schema_keys = {str(f["key"]) for f in schema}
    for key in vals:
        if key not in schema_keys:
            raise ValidationError(f"字段不在模板中: {key}")
    for field in schema:
        key = str(field["key"])
        raw = vals.get(key)
        required = bool(field.get("required"))
        ftype = str(field.get("type") or "text")
        if raw is None or (isinstance(raw, str) and not raw.strip()):
            if required:
                raise ValidationError(f"必填字段未填写: {field.get('label') or key}")
            continue
        if ftype == "number":
            try:
                cleaned[key] = float(raw) if not isinstance(raw, bool) else float(int(raw))
            except (TypeError, ValueError) as exc:
                raise ValidationError(f"字段 {field.get('label') or key} 须为数字") from exc
        elif ftype == "select":
            text = str(raw).strip()
            options = [str(o) for o in (field.get("options") or [])]
            if text not in options:
                raise ValidationError(f"字段 {field.get('label') or key} 取值不在选项中")
            cleaned[key] = text
        else:
            cleaned[key] = str(raw).strip()
    return cleaned


class ProductionDailyTemplateService(AppBaseService[ProductionDailyTemplate]):
    code_field = "template_code"
    rule_code = "PRODUCTION_DAILY_TEMPLATE_CODE"
    code_prefix = "PDT"

    def __init__(self) -> None:
        super().__init__(ProductionDailyTemplate)
        self.model = ProductionDailyTemplate

    async def ensure_defaults(self, tenant_id: int, user: Optional[User] = None) -> int:
        created = 0
        for preset in DEFAULT_TEMPLATES:
            exists = await ProductionDailyTemplate.filter(
                tenant_id=tenant_id,
                template_code=preset["template_code"],
                deleted_at__isnull=True,
            ).exists()
            if exists:
                continue
            payload: dict[str, Any] = {
                "tenant_id": tenant_id,
                "template_code": preset["template_code"],
                "template_name": preset["template_name"],
                "description": preset.get("description"),
                "field_schema": _normalize_field_schema(preset.get("field_schema") or []),
                "sort_order": int(preset.get("sort_order") or 0),
                "is_active": True,
                "is_system": True,
            }
            if user is not None:
                apply_create_audit(payload, user)
            await ProductionDailyTemplate.create(**payload)
            created += 1
        return created

    async def list_templates(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        active_only: bool = False,
        ensure_seed: bool = True,
        user: Optional[User] = None,
    ) -> ProductionDailyTemplateListResponse:
        if ensure_seed:
            await self.ensure_defaults(tenant_id, user)
        q = ProductionDailyTemplate.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if active_only:
            q = q.filter(is_active=True)
        if keyword:
            kw = keyword.strip()
            if kw:
                q = q.filter(
                    Q(template_code__icontains=kw) | Q(template_name__icontains=kw)
                )
        rows = await q.order_by("sort_order", "id")
        items = [ProductionDailyTemplateResponse.model_validate(r) for r in rows]
        return ProductionDailyTemplateListResponse(items=items, total=len(items))

    async def get(self, tenant_id: int, template_id: int) -> ProductionDailyTemplateResponse:
        row = await ProductionDailyTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("日报模板不存在")
        return ProductionDailyTemplateResponse.model_validate(row)

    async def create(
        self, tenant_id: int, data: ProductionDailyTemplateCreate, user: User
    ) -> ProductionDailyTemplateResponse:
        code = (data.template_code or "").strip()
        if code:
            exists = await ProductionDailyTemplate.filter(
                tenant_id=tenant_id, template_code=code, deleted_at__isnull=True
            ).exists()
            if exists:
                raise ValidationError(f"模板编码已存在: {code}")
        else:
            code = await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)
        payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "template_code": code,
            "template_name": data.template_name.strip(),
            "description": data.description,
            "field_schema": _normalize_field_schema(data.field_schema),
            "sort_order": data.sort_order,
            "is_active": data.is_active,
            "is_system": False,
        }
        apply_create_audit(payload, user)
        row = await ProductionDailyTemplate.create(**payload)
        return ProductionDailyTemplateResponse.model_validate(row)

    async def update(
        self,
        tenant_id: int,
        template_id: int,
        data: ProductionDailyTemplateUpdate,
        user: User,
    ) -> ProductionDailyTemplateResponse:
        row = await ProductionDailyTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("日报模板不存在")
        payload = data.model_dump(exclude_unset=True)
        if "template_name" in payload and payload["template_name"] is not None:
            payload["template_name"] = str(payload["template_name"]).strip()
        if "field_schema" in payload:
            payload["field_schema"] = _normalize_field_schema(payload["field_schema"])
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return ProductionDailyTemplateResponse.model_validate(row)

    async def delete(self, tenant_id: int, template_id: int, user: User) -> None:
        row = await ProductionDailyTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("日报模板不存在")
        if row.is_system:
            raise BusinessLogicError("系统预置模板不可删除，可停用")
        in_use = await ProductionDailyReport.filter(
            tenant_id=tenant_id, template_id=template_id, deleted_at__isnull=True
        ).exists()
        if in_use:
            raise BusinessLogicError("模板已被日报引用，不能删除，可停用")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()


class ProductionDailyReportService(AppBaseService[ProductionDailyReport]):
    code_field = "code"
    rule_code = "PRODUCTION_DAILY_REPORT_CODE"
    code_prefix = "PDR"

    def __init__(self) -> None:
        super().__init__(ProductionDailyReport)
        self.model = ProductionDailyReport
        self.template_service = ProductionDailyTemplateService()

    async def _get_template(
        self, tenant_id: int, template_id: int
    ) -> ProductionDailyTemplate:
        row = await ProductionDailyTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("日报模板不存在")
        if not row.is_active:
            raise BusinessLogicError("日报模板已停用")
        return row

    async def list_reports(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        template_code: Optional[str] = None,
        team_name: Optional[str] = None,
        status: Optional[str] = None,
        date_start: Optional[str] = None,
        date_end: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> ProductionDailyReportListResponse:
        q = ProductionDailyReport.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if template_code:
            q = q.filter(template_code=template_code.strip())
        if team_name:
            q = q.filter(team_name__icontains=team_name.strip())
        if status:
            q = q.filter(status=status.strip())
        if date_start:
            q = q.filter(report_date__gte=date_start)
        if date_end:
            q = q.filter(report_date__lte=date_end)
        if keyword:
            kw = keyword.strip()
            if kw:
                q = q.filter(
                    Q(code__icontains=kw)
                    | Q(team_name__icontains=kw)
                    | Q(template_name__icontains=kw)
                )
        total = await q.count()
        rows = (
            await q.order_by("-report_date", "-id")
            .offset(max(0, skip))
            .limit(max(1, min(limit, 200)))
        )
        items = [ProductionDailyReportResponse.model_validate(r) for r in rows]
        return ProductionDailyReportListResponse(items=items, total=total)

    async def get(self, tenant_id: int, report_id: int) -> ProductionDailyReportResponse:
        row = await ProductionDailyReport.get_or_none(
            id=report_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("生产日报不存在")
        return ProductionDailyReportResponse.model_validate(row)

    async def create(
        self, tenant_id: int, data: ProductionDailyReportCreate, user: User
    ) -> ProductionDailyReportResponse:
        template = await self._get_schema_template(tenant_id, data.template_id)
        schema = _normalize_field_schema(template.field_schema or [])
        values = _validate_field_values(schema, data.field_values)
        code = await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)
        payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "code": code,
            "template_id": template.id,
            "template_code": template.template_code,
            "template_name": template.template_name,
            "report_date": data.report_date,
            "team_name": (data.team_name or "").strip() or None,
            "shift_name": (data.shift_name or "").strip() or None,
            "workshop_name": (data.workshop_name or "").strip() or None,
            "plant_name": (data.plant_name or "").strip() or None,
            "field_values": values,
            "remarks": data.remarks,
            "status": "draft",
        }
        if data.submit:
            payload["status"] = "submitted"
            payload["submitted_at"] = resolve_business_datetime()
        apply_create_audit(payload, user)
        row = await ProductionDailyReport.create(**payload)
        return ProductionDailyReportResponse.model_validate(row)

    async def _get_schema_template(
        self, tenant_id: int, template_id: int
    ) -> ProductionDailyTemplate:
        return await self._get_template(tenant_id, template_id)

    async def update(
        self,
        tenant_id: int,
        report_id: int,
        data: ProductionDailyReportUpdate,
        user: User,
    ) -> ProductionDailyReportResponse:
        row = await ProductionDailyReport.get_or_none(
            id=report_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("生产日报不存在")
        if row.status not in {"draft"}:
            raise BusinessLogicError("仅草稿可编辑")
        template = await ProductionDailyTemplate.get_or_none(
            id=row.template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not template:
            raise NotFoundError("日报模板不存在")
        payload = data.model_dump(exclude_unset=True)
        if "field_values" in payload:
            schema = _normalize_field_schema(template.field_schema or [])
            payload["field_values"] = _validate_field_values(schema, payload["field_values"] or {})
        for key in ("team_name", "shift_name", "workshop_name", "plant_name"):
            if key in payload and payload[key] is not None:
                text = str(payload[key]).strip()
                payload[key] = text or None
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return ProductionDailyReportResponse.model_validate(row)

    async def submit(
        self, tenant_id: int, report_id: int, user: User
    ) -> ProductionDailyReportResponse:
        row = await ProductionDailyReport.get_or_none(
            id=report_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("生产日报不存在")
        if row.status != "draft":
            raise BusinessLogicError("仅草稿可提交")
        template = await ProductionDailyTemplate.get_or_none(
            id=row.template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not template:
            raise NotFoundError("日报模板不存在")
        schema = _normalize_field_schema(template.field_schema or [])
        row.field_values = _validate_field_values(schema, row.field_values or {})
        row.status = "submitted"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return ProductionDailyReportResponse.model_validate(row)

    async def delete(self, tenant_id: int, report_id: int, user: User) -> None:
        row = await ProductionDailyReport.get_or_none(
            id=report_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("生产日报不存在")
        if row.status not in {"draft"}:
            raise BusinessLogicError("仅草稿可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

    async def summarize(
        self,
        tenant_id: int,
        *,
        template_code: Optional[str] = None,
        team_name: Optional[str] = None,
        date_start: Optional[Any] = None,
        date_end: Optional[Any] = None,
        keyword: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> dict[str, Any]:
        """汇总：一行一日报，展开 field_values 为列。"""
        q = ProductionDailyReport.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if template_code:
            q = q.filter(template_code=str(template_code).strip())
        if team_name:
            q = q.filter(team_name__icontains=str(team_name).strip())
        if date_start:
            q = q.filter(report_date__gte=date_start.date() if hasattr(date_start, "date") else date_start)
        if date_end:
            end_v = date_end.date() if hasattr(date_end, "date") else date_end
            q = q.filter(report_date__lte=end_v)
        if keyword:
            kw = str(keyword).strip()
            if kw:
                q = q.filter(
                    Q(code__icontains=kw)
                    | Q(team_name__icontains=kw)
                    | Q(template_name__icontains=kw)
                )
        total = await q.count()
        rows = (
            await q.order_by("-report_date", "-id")
            .offset(max(0, skip))
            .limit(max(1, min(int(limit or 100), 500)))
        )
        items: List[dict[str, Any]] = []
        for row in rows:
            item: dict[str, Any] = {
                "id": row.id,
                "code": row.code,
                "template_code": row.template_code,
                "template_name": row.template_name,
                "report_date": row.report_date.isoformat() if row.report_date else None,
                "team_name": row.team_name,
                "shift_name": row.shift_name,
                "workshop_name": row.workshop_name,
                "plant_name": row.plant_name,
                "status": row.status,
                "remarks": row.remarks,
                "created_by_name": row.created_by_name,
            }
            values = row.field_values if isinstance(row.field_values, dict) else {}
            for k, v in values.items():
                item[f"f_{k}"] = v
            items.append(item)
        return {"items": items, "total": total, "summary": {}}
