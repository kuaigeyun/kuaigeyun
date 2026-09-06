"""供应商评价服务（R-03）。

供应商主体只引用主数据，不新建台账；
不回写主数据交期/IQC 运营评级（rating_grade/rating_score）。
公式/等级版本取自评价模板；已批准单据禁止静默改写得分与明细。
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, List, Optional, Sequence

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaizhizao.constants.supplier_eval import (
    ENV_DOC_TYPE_DEFAULT,
    ENV_DOC_TYPES,
    PERIOD_QUARTERLY,
    RECT_CLOSED,
    RECT_NONE,
    RECT_OPEN,
    STATUS_APPROVED,
    STATUS_DRAFT,
    STATUS_PENDING,
    STATUS_REJECTED,
    STATUS_REVOKED,
    SUPPLIER_EVAL_AUDIT_DEFAULT,
    SUPPLIER_EVAL_AUDIT_MODES,
    SUPPLIER_EVAL_PERIOD_DEFAULT,
    SUPPLIER_EVAL_PERIOD_TYPES,
    SUPPLIER_EVAL_RECT_STATUSES,
)
from apps.kuaizhizao.models.supplier_evaluation import (
    SupplierEvalEnvDocument,
    SupplierEvalTemplate,
    SupplierEvalTemplateClause,
    SupplierEvaluation,
    SupplierEvaluationLine,
)
from apps.kuaizhizao.schemas.supplier_evaluation import (
    SupplierEvalEnvDocumentCreate,
    SupplierEvalEnvDocumentListResponse,
    SupplierEvalEnvDocumentResponse,
    SupplierEvalEnvDocumentUpdate,
    SupplierEvalTemplateClauseInput,
    SupplierEvalTemplateClauseResponse,
    SupplierEvalTemplateCreate,
    SupplierEvalTemplateListItem,
    SupplierEvalTemplateListResponse,
    SupplierEvalTemplateResponse,
    SupplierEvalTemplateUpdate,
    SupplierEvaluationCloseRectificationRequest,
    SupplierEvaluationCreate,
    SupplierEvaluationLineInput,
    SupplierEvaluationLineResponse,
    SupplierEvaluationListItem,
    SupplierEvaluationListResponse,
    SupplierEvaluationResponse,
    SupplierEvaluationUpdate,
)
from apps.kuaizhizao.services.supplier_eval_scoring import (
    compute_weighted_score,
    normalize_grade_bands,
    resolve_grade,
)
from apps.master_data.models.supplier import Supplier
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "supplier_evaluation"


class SupplierEvalTemplateService(AppBaseService[SupplierEvalTemplate]):
    code_field = "code"
    rule_code = "SUPPLIER_EVAL_TEMPLATE_CODE"
    code_prefix = "SET"

    def __init__(self) -> None:
        super().__init__(SupplierEvalTemplate)
        self.model = SupplierEvalTemplate

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    def _validate_period_type(self, period_type: Optional[str]) -> Optional[str]:
        if period_type is None or str(period_type).strip() == "":
            return None
        pt = str(period_type).strip().lower()
        if pt not in SUPPLIER_EVAL_PERIOD_TYPES:
            raise ValidationError(f"非法评价周期类型: {period_type}")
        return pt

    def _normalize_clauses(
        self, clauses: Sequence[SupplierEvalTemplateClauseInput]
    ) -> List[SupplierEvalTemplateClauseInput]:
        if not clauses:
            raise ValidationError("评价模板至少需要一条条款")
        out: List[SupplierEvalTemplateClauseInput] = []
        codes = set()
        for idx, raw in enumerate(clauses, start=1):
            code = (raw.clause_code or "").strip()
            name = (raw.clause_name or "").strip()
            if not code or not name:
                raise ValidationError("条款编码与名称不能为空")
            if code in codes:
                raise ValidationError(f"条款编码重复: {code}")
            codes.add(code)
            weight = Decimal(str(raw.weight if raw.weight is not None else 1))
            max_score = Decimal(str(raw.max_score if raw.max_score is not None else 100))
            if weight <= 0:
                raise ValidationError(f"条款权重须大于 0: {code}")
            if max_score <= 0:
                raise ValidationError(f"条款满分须大于 0: {code}")
            out.append(
                SupplierEvalTemplateClauseInput(
                    line_no=raw.line_no or idx,
                    clause_code=code,
                    clause_name=name,
                    weight=weight,
                    max_score=max_score,
                    remarks=(raw.remarks or None),
                )
            )
        return out

    async def _get_row(self, tenant_id: int, template_id: int) -> SupplierEvalTemplate:
        row = await SupplierEvalTemplate.filter(
            tenant_id=tenant_id, id=template_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("评价模板不存在")
        return row

    async def _list_clauses(
        self, tenant_id: int, template_id: int
    ) -> List[SupplierEvalTemplateClause]:
        return (
            await SupplierEvalTemplateClause.filter(
                tenant_id=tenant_id, template_id=template_id, deleted_at__isnull=True
            )
            .order_by("line_no", "id")
            .all()
        )

    async def _replace_clauses(
        self,
        tenant_id: int,
        template_id: int,
        clauses: Sequence[SupplierEvalTemplateClauseInput],
        user: User,
    ) -> None:
        normalized = self._normalize_clauses(clauses)
        existing = await SupplierEvalTemplateClause.filter(
            tenant_id=tenant_id, template_id=template_id, deleted_at__isnull=True
        ).all()
        now = resolve_business_datetime()
        for row in existing:
            row.deleted_at = now
            apply_update_audit(row, user)
            await row.save()
        for item in normalized:
            clause = SupplierEvalTemplateClause(
                tenant_id=tenant_id,
                template_id=template_id,
                line_no=item.line_no or 1,
                clause_code=item.clause_code,
                clause_name=item.clause_name,
                weight=item.weight,
                max_score=item.max_score,
                remarks=item.remarks,
            )
            apply_create_audit(clause, user)
            await clause.save()

    async def _to_response(
        self, tenant_id: int, row: SupplierEvalTemplate
    ) -> SupplierEvalTemplateResponse:
        clauses = await self._list_clauses(tenant_id, row.id)
        data = SupplierEvalTemplateResponse.model_validate(row)
        data.clauses = [
            SupplierEvalTemplateClauseResponse.model_validate(c) for c in clauses
        ]
        data.grade_bands = normalize_grade_bands(row.grade_bands)
        return data

    async def create(
        self, tenant_id: int, data: SupplierEvalTemplateCreate, user: User
    ) -> SupplierEvalTemplateResponse:
        name = (data.name or "").strip()
        if not name:
            raise ValidationError("模板名称不能为空")
        code = await self._ensure_code(tenant_id, data.code)
        if await SupplierEvalTemplate.filter(
            tenant_id=tenant_id, code=code, deleted_at__isnull=True
        ).exists():
            raise ValidationError(f"模板编码已存在: {code}")
        row = SupplierEvalTemplate(
            tenant_id=tenant_id,
            code=code,
            name=name,
            version=(data.version or "v1").strip() or "v1",
            grade_version=(data.grade_version or "v1").strip() or "v1",
            grade_bands=normalize_grade_bands(data.grade_bands),
            period_type=self._validate_period_type(data.period_type),
            is_active=bool(data.is_active),
            remarks=data.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        await self._replace_clauses(tenant_id, row.id, data.clauses or [], user)
        return await self._to_response(tenant_id, row)

    async def update(
        self,
        tenant_id: int,
        template_id: int,
        data: SupplierEvalTemplateUpdate,
        user: User,
    ) -> SupplierEvalTemplateResponse:
        row = await self._get_row(tenant_id, template_id)
        payload = data.model_dump(exclude_unset=True, exclude={"clauses"})
        if "name" in payload and payload["name"] is not None:
            name = str(payload["name"]).strip()
            if not name:
                raise ValidationError("模板名称不能为空")
            payload["name"] = name
        if "period_type" in payload:
            payload["period_type"] = self._validate_period_type(payload.get("period_type"))
        if "grade_bands" in payload:
            payload["grade_bands"] = normalize_grade_bands(payload.get("grade_bands"))
        if "version" in payload and payload["version"] is not None:
            payload["version"] = str(payload["version"]).strip() or "v1"
        if "grade_version" in payload and payload["grade_version"] is not None:
            payload["grade_version"] = str(payload["grade_version"]).strip() or "v1"
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        if data.clauses is not None:
            await self._replace_clauses(tenant_id, row.id, data.clauses, user)
        return await self._to_response(tenant_id, row)

    async def get(self, tenant_id: int, template_id: int) -> SupplierEvalTemplateResponse:
        return await self._to_response(tenant_id, await self._get_row(tenant_id, template_id))

    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
        keyword: Optional[str] = None,
        is_active: Optional[bool] = None,
        period_type: Optional[str] = None,
        order_by: str = "-created_at",
    ) -> SupplierEvalTemplateListResponse:
        query = SupplierEvalTemplate.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if is_active is not None:
            query = query.filter(is_active=bool(is_active))
        if period_type:
            query = query.filter(period_type=period_type.strip().lower())
        if keyword:
            kw = keyword.strip()
            if kw:
                query = query.filter(Q(code__icontains=kw) | Q(name__icontains=kw))
        total = await query.count()
        allowed = {
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
            "code",
            "-code",
            "name",
            "-name",
        }
        order = order_by if order_by in allowed else "-created_at"
        rows = await query.order_by(order).offset(skip).limit(limit)
        items: List[SupplierEvalTemplateListItem] = []
        for row in rows:
            count = await SupplierEvalTemplateClause.filter(
                tenant_id=tenant_id, template_id=row.id, deleted_at__isnull=True
            ).count()
            item = SupplierEvalTemplateListItem.model_validate(row)
            item.clause_count = count
            items.append(item)
        return SupplierEvalTemplateListResponse(data=items, total=total, success=True)

    async def delete(self, tenant_id: int, template_id: int, user: User) -> bool:
        row = await self._get_row(tenant_id, template_id)
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, user)
        await row.save()
        clauses = await SupplierEvalTemplateClause.filter(
            tenant_id=tenant_id, template_id=template_id, deleted_at__isnull=True
        ).all()
        for clause in clauses:
            clause.deleted_at = now
            apply_update_audit(clause, user)
            await clause.save()
        return True


class SupplierEvaluationService(AppBaseService[SupplierEvaluation]):
    code_field = "code"
    rule_code = "SUPPLIER_EVALUATION_CODE"
    code_prefix = "SE"

    def __init__(self) -> None:
        super().__init__(SupplierEvaluation)
        self.model = SupplierEvaluation
        self.template_service = SupplierEvalTemplateService()

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    def _validate_period(
        self, period_type: str, period_year: int, period_quarter: Optional[int]
    ) -> tuple[str, int, Optional[int]]:
        pt = (period_type or SUPPLIER_EVAL_PERIOD_DEFAULT).strip().lower()
        if pt not in SUPPLIER_EVAL_PERIOD_TYPES:
            raise ValidationError(f"非法评价周期类型: {period_type}")
        year = int(period_year)
        if year < 2000 or year > 2100:
            raise ValidationError(f"非法评价年度: {period_year}")
        quarter = period_quarter
        if pt == PERIOD_QUARTERLY:
            if quarter is None:
                raise ValidationError("季评须填写季度")
            q = int(quarter)
            if q not in (1, 2, 3, 4):
                raise ValidationError(f"非法季度: {period_quarter}")
            return pt, year, q
        return pt, year, None

    def _validate_audit_mode(self, audit_mode: str) -> str:
        mode = (audit_mode or SUPPLIER_EVAL_AUDIT_DEFAULT).strip().lower()
        if mode not in SUPPLIER_EVAL_AUDIT_MODES:
            raise ValidationError(f"非法审核方式: {audit_mode}")
        return mode

    async def _resolve_supplier(
        self, tenant_id: int, supplier_id: int
    ) -> tuple[int, Optional[str], Optional[str]]:
        row = await Supplier.filter(
            tenant_id=tenant_id, id=supplier_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("供应商不存在（请从主数据选择）")
        return row.id, row.code, row.name

    async def _get_row(self, tenant_id: int, eval_id: int) -> SupplierEvaluation:
        row = await SupplierEvaluation.filter(
            tenant_id=tenant_id, id=eval_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("供应商评价单不存在")
        return row

    async def _list_lines(
        self, tenant_id: int, evaluation_id: int
    ) -> List[SupplierEvaluationLine]:
        return (
            await SupplierEvaluationLine.filter(
                tenant_id=tenant_id,
                evaluation_id=evaluation_id,
                deleted_at__isnull=True,
            )
            .order_by("line_no", "id")
            .all()
        )

    async def _to_response(
        self, tenant_id: int, row: SupplierEvaluation
    ) -> SupplierEvaluationResponse:
        data = SupplierEvaluationResponse.model_validate(row)
        lines = await self._list_lines(tenant_id, row.id)
        data.lines = [SupplierEvaluationLineResponse.model_validate(x) for x in lines]
        return data

    async def _load_template(
        self, tenant_id: int, template_id: int
    ) -> tuple[SupplierEvalTemplate, List[SupplierEvalTemplateClause]]:
        tpl = await SupplierEvalTemplate.filter(
            tenant_id=tenant_id, id=template_id, deleted_at__isnull=True
        ).first()
        if not tpl:
            raise NotFoundError("评价模板不存在")
        if not tpl.is_active:
            raise ValidationError("评价模板未启用")
        clauses = (
            await SupplierEvalTemplateClause.filter(
                tenant_id=tenant_id, template_id=tpl.id, deleted_at__isnull=True
            )
            .order_by("line_no", "id")
            .all()
        )
        if not clauses:
            raise ValidationError("评价模板无条款，无法用于打分")
        return tpl, clauses

    async def _soft_delete_lines(
        self, tenant_id: int, evaluation_id: int, user: User
    ) -> None:
        now = resolve_business_datetime()
        rows = await SupplierEvaluationLine.filter(
            tenant_id=tenant_id,
            evaluation_id=evaluation_id,
            deleted_at__isnull=True,
        ).all()
        for row in rows:
            row.deleted_at = now
            apply_update_audit(row, user)
            await row.save()

    def _normalize_line_inputs(
        self, lines: Sequence[SupplierEvaluationLineInput]
    ) -> List[SupplierEvaluationLineInput]:
        out: List[SupplierEvaluationLineInput] = []
        for idx, raw in enumerate(lines, start=1):
            code = (raw.clause_code or "").strip()
            name = (raw.clause_name or "").strip()
            if not code or not name:
                raise ValidationError("明细条款编码与名称不能为空")
            weight = Decimal(str(raw.weight if raw.weight is not None else 1))
            max_score = Decimal(str(raw.max_score if raw.max_score is not None else 100))
            if weight <= 0 or max_score <= 0:
                raise ValidationError(f"明细权重与满分须大于 0: {code}")
            score = raw.score
            if score is not None:
                sc = Decimal(str(score))
                if sc < 0 or sc > max_score:
                    raise ValidationError(f"得分须在 0~{max_score}：{code}")
                score = sc
            out.append(
                SupplierEvaluationLineInput(
                    line_no=raw.line_no or idx,
                    clause_code=code,
                    clause_name=name,
                    weight=weight,
                    max_score=max_score,
                    score=score,
                    remarks=raw.remarks,
                )
            )
        return out

    async def _write_lines(
        self,
        tenant_id: int,
        evaluation_id: int,
        lines: Sequence[SupplierEvaluationLineInput],
        user: User,
    ) -> List[SupplierEvaluationLine]:
        await self._soft_delete_lines(tenant_id, evaluation_id, user)
        normalized = self._normalize_line_inputs(lines)
        saved: List[SupplierEvaluationLine] = []
        for item in normalized:
            row = SupplierEvaluationLine(
                tenant_id=tenant_id,
                evaluation_id=evaluation_id,
                line_no=item.line_no or 1,
                clause_code=item.clause_code,
                clause_name=item.clause_name,
                weight=item.weight,
                max_score=item.max_score,
                score=item.score,
                remarks=item.remarks,
            )
            apply_create_audit(row, user)
            await row.save()
            saved.append(row)
        return saved

    async def _apply_score_from_lines(
        self,
        row: SupplierEvaluation,
        lines: Sequence[SupplierEvaluationLine],
        *,
        grade_bands: Any = None,
    ) -> None:
        score = compute_weighted_score(lines)
        row.score = score
        bands = grade_bands
        if bands is None and row.template_id:
            tpl = await SupplierEvalTemplate.filter(
                tenant_id=row.tenant_id, id=row.template_id, deleted_at__isnull=True
            ).first()
            bands = tpl.grade_bands if tpl else None
        row.grade = resolve_grade(score, bands)

    async def _seed_from_template(
        self,
        tenant_id: int,
        row: SupplierEvaluation,
        template_id: int,
        user: User,
        *,
        keep_scores: Optional[dict] = None,
    ) -> List[SupplierEvaluationLine]:
        tpl, clauses = await self._load_template(tenant_id, template_id)
        row.template_id = tpl.id
        row.template_code = tpl.code
        row.template_name = tpl.name
        row.formula_version = tpl.version
        row.grade_version = tpl.grade_version
        inputs = [
            SupplierEvaluationLineInput(
                line_no=c.line_no,
                clause_code=c.clause_code,
                clause_name=c.clause_name,
                weight=c.weight,
                max_score=c.max_score,
                score=(keep_scores or {}).get(c.clause_code),
                remarks=c.remarks,
            )
            for c in clauses
        ]
        lines = await self._write_lines(tenant_id, row.id, inputs, user)
        await self._apply_score_from_lines(row, lines, grade_bands=tpl.grade_bands)
        return lines

    async def create(
        self, tenant_id: int, data: SupplierEvaluationCreate, user: User
    ) -> SupplierEvaluationResponse:
        pt, year, quarter = self._validate_period(
            data.period_type, data.period_year, data.period_quarter
        )
        sid, scode, sname = await self._resolve_supplier(tenant_id, data.supplier_id)
        code = await self._ensure_code(tenant_id, data.code)
        if await SupplierEvaluation.filter(
            tenant_id=tenant_id, code=code, deleted_at__isnull=True
        ).exists():
            raise ValidationError(f"评价单号已存在: {code}")

        needs = bool(data.needs_rectification)
        rect_status = RECT_OPEN if needs else RECT_NONE
        row = SupplierEvaluation(
            tenant_id=tenant_id,
            code=code,
            period_type=pt,
            period_year=year,
            period_quarter=quarter,
            supplier_id=sid,
            supplier_code=scode,
            supplier_name=sname,
            audit_mode=self._validate_audit_mode(data.audit_mode),
            score=data.score,
            grade=(data.grade or "").strip().upper() or None,
            formula_version=(data.formula_version or "").strip() or None,
            grade_version=(data.grade_version or "").strip() or None,
            needs_rectification=needs,
            rectification_plan=data.rectification_plan,
            rectification_due=data.rectification_due,
            rectification_status=rect_status,
            attachments=data.attachments,
            remarks=data.remarks,
            status=STATUS_DRAFT,
        )
        apply_create_audit(row, user)
        await row.save()

        if data.template_id:
            await self._seed_from_template(tenant_id, row, int(data.template_id), user)
            apply_update_audit(row, user)
            await row.save()
        elif data.lines:
            lines = await self._write_lines(tenant_id, row.id, data.lines, user)
            await self._apply_score_from_lines(row, lines)
            apply_update_audit(row, user)
            await row.save()

        return await self._to_response(tenant_id, row)

    async def update(
        self,
        tenant_id: int,
        eval_id: int,
        data: SupplierEvaluationUpdate,
        user: User,
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status not in (STATUS_DRAFT, STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或驳回态可修改")
        if row.status == STATUS_APPROVED:
            raise BusinessLogicError("已批准评价禁止改写得分与明细")

        raw = data.model_dump(exclude_unset=True)
        has_lines = "lines" in raw
        lines_payload = raw.pop("lines", None) if has_lines else None
        has_template = "template_id" in raw
        template_id = raw.pop("template_id", None) if has_template else None
        payload = raw

        if "supplier_id" in payload and payload["supplier_id"] is not None:
            sid, scode, sname = await self._resolve_supplier(
                tenant_id, int(payload["supplier_id"])
            )
            payload["supplier_id"] = sid
            payload["supplier_code"] = scode
            payload["supplier_name"] = sname

        period_type = payload.get("period_type", row.period_type)
        period_year = payload.get("period_year", row.period_year)
        period_quarter = (
            payload.get("period_quarter")
            if "period_quarter" in payload
            else row.period_quarter
        )
        if any(k in payload for k in ("period_type", "period_year", "period_quarter")):
            pt, year, quarter = self._validate_period(
                str(period_type), int(period_year), period_quarter
            )
            payload["period_type"] = pt
            payload["period_year"] = year
            payload["period_quarter"] = quarter

        if "audit_mode" in payload and payload["audit_mode"] is not None:
            payload["audit_mode"] = self._validate_audit_mode(str(payload["audit_mode"]))
        if "grade" in payload and payload["grade"] is not None:
            payload["grade"] = str(payload["grade"]).strip().upper() or None
        if "rectification_status" in payload and payload["rectification_status"] is not None:
            rs = str(payload["rectification_status"]).strip().lower()
            if rs not in SUPPLIER_EVAL_RECT_STATUSES:
                raise ValidationError(f"非法整改状态: {payload['rectification_status']}")
            payload["rectification_status"] = rs
        if "needs_rectification" in payload and payload["needs_rectification"] is not None:
            needs = bool(payload["needs_rectification"])
            payload["needs_rectification"] = needs
            if needs and row.rectification_status == RECT_NONE and "rectification_status" not in payload:
                payload["rectification_status"] = RECT_OPEN
            if not needs and "rectification_status" not in payload:
                payload["rectification_status"] = RECT_NONE

        for key, value in payload.items():
            setattr(row, key, value)

        if template_id is not None:
            if int(template_id) != (row.template_id or 0):
                keep = {}
                for old in await self._list_lines(tenant_id, row.id):
                    if old.score is not None:
                        keep[old.clause_code] = old.score
                await self._seed_from_template(
                    tenant_id, row, int(template_id), user, keep_scores=keep
                )
            elif lines_payload is not None:
                lines = await self._write_lines(tenant_id, row.id, lines_payload, user)
                await self._apply_score_from_lines(row, lines)
        elif lines_payload is not None:
            lines = await self._write_lines(tenant_id, row.id, lines_payload, user)
            await self._apply_score_from_lines(row, lines)

        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)

    async def recalculate(
        self, tenant_id: int, eval_id: int, user: User
    ) -> SupplierEvaluationResponse:
        """按当前明细重算得分/等级；仅草稿或驳回。已批准禁止。"""
        row = await self._get_row(tenant_id, eval_id)
        if row.status not in (STATUS_DRAFT, STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或驳回态可重算；已批准结果不静默改写")
        lines = await self._list_lines(tenant_id, row.id)
        if not lines:
            raise ValidationError("无可重算明细")
        if row.template_id:
            tpl = await SupplierEvalTemplate.filter(
                tenant_id=tenant_id, id=row.template_id, deleted_at__isnull=True
            ).first()
            if tpl:
                row.formula_version = tpl.version
                row.grade_version = tpl.grade_version
                await self._apply_score_from_lines(row, lines, grade_bands=tpl.grade_bands)
            else:
                await self._apply_score_from_lines(row, lines)
        else:
            await self._apply_score_from_lines(row, lines)
        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)

    async def get(self, tenant_id: int, eval_id: int) -> SupplierEvaluationResponse:
        return await self._to_response(tenant_id, await self._get_row(tenant_id, eval_id))

    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        period_type: Optional[str] = None,
        period_year: Optional[int] = None,
        supplier_id: Optional[int] = None,
        order_by: str = "-created_at",
    ) -> SupplierEvaluationListResponse:
        query = SupplierEvaluation.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            query = query.filter(status=status.strip().lower())
        if period_type:
            query = query.filter(period_type=period_type.strip().lower())
        if period_year is not None:
            query = query.filter(period_year=int(period_year))
        if supplier_id is not None:
            query = query.filter(supplier_id=int(supplier_id))
        if keyword:
            kw = keyword.strip()
            if kw:
                query = query.filter(
                    Q(code__icontains=kw)
                    | Q(supplier_code__icontains=kw)
                    | Q(supplier_name__icontains=kw)
                    | Q(grade__icontains=kw)
                    | Q(template_code__icontains=kw)
                )
        total = await query.count()
        allowed = {
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
            "code",
            "-code",
            "period_year",
            "-period_year",
            "score",
            "-score",
        }
        order = order_by if order_by in allowed else "-created_at"
        rows = await query.order_by(order).offset(skip).limit(limit)
        return SupplierEvaluationListResponse(
            data=[SupplierEvaluationListItem.model_validate(r) for r in rows],
            total=total,
            success=True,
        )

    async def delete(self, tenant_id: int, eval_id: int, user: User) -> bool:
        row = await self._get_row(tenant_id, eval_id)
        if row.status not in (STATUS_DRAFT, STATUS_REJECTED, STATUS_REVOKED):
            raise BusinessLogicError("仅草稿、驳回或已撤销的评价可删除")
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, user)
        await row.save()
        await self._soft_delete_lines(tenant_id, eval_id, user)
        return True

    async def submit(
        self, tenant_id: int, eval_id: int, user: User
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status not in (STATUS_DRAFT, STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或驳回态可提交审核")
        lines = await self._list_lines(tenant_id, row.id)
        if row.template_id and not lines:
            raise ValidationError("已选模板但无打分明细，请先维护条款得分")
        if lines:
            await self._apply_score_from_lines(row, lines)
        row.status = STATUS_PENDING
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type=AUDIT_NODE,
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"供应商评价 {row.code}",
                content=f"{row.supplier_name or row.supplier_code or ''} {row.period_year}",
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return await self._to_response(tenant_id, row)

    async def approve(
        self, tenant_id: int, eval_id: int, user: User
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status != STATUS_PENDING:
            raise BusinessLogicError("仅待审评价可通过")
        now = resolve_business_datetime()
        # 批准时冻结版本；已有版本不覆盖，防止静默改写
        if not (row.formula_version or "").strip():
            row.formula_version = f"v{now.strftime('%Y%m%d')}"
        if not (row.grade_version or "").strip():
            row.grade_version = f"v{now.strftime('%Y%m%d')}"
        row.status = STATUS_APPROVED
        row.approved_at = now
        if row.needs_rectification and row.rectification_status == RECT_NONE:
            row.rectification_status = RECT_OPEN
        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)

    async def reject(
        self, tenant_id: int, eval_id: int, user: User
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status != STATUS_PENDING:
            raise BusinessLogicError("仅待审评价可驳回")
        row.status = STATUS_REJECTED
        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)

    async def revoke(
        self, tenant_id: int, eval_id: int, reason: str, user: User
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status != STATUS_APPROVED:
            raise BusinessLogicError("仅已批准评价可撤销")
        row.status = STATUS_REVOKED
        row.revoked_at = resolve_business_datetime()
        row.revoked_by = user.id
        row.revoked_by_name = getattr(user, "display_name", None) or getattr(
            user, "username", None
        )
        row.revoke_reason = (reason or "").strip()
        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)

    async def close_rectification(
        self,
        tenant_id: int,
        eval_id: int,
        data: SupplierEvaluationCloseRectificationRequest,
        user: User,
    ) -> SupplierEvaluationResponse:
        row = await self._get_row(tenant_id, eval_id)
        if row.status != STATUS_APPROVED:
            raise BusinessLogicError("仅已批准评价可关闭整改")
        if not row.needs_rectification or row.rectification_status != RECT_OPEN:
            raise BusinessLogicError("当前评价无进行中的整改")
        result = (data.result or "").strip()
        if not result:
            raise ValidationError("整改结果不能为空")
        row.rectification_result = result
        row.rectification_status = RECT_CLOSED
        row.rectification_closed_at = resolve_business_datetime()
        row.rectification_closed_by = user.id
        row.rectification_closed_by_name = getattr(user, "display_name", None) or getattr(
            user, "username", None
        )
        apply_update_audit(row, user)
        await row.save()
        return await self._to_response(tenant_id, row)


class SupplierEvalEnvDocumentService:
    """环保资料清单：挂主数据供应商；有效期走 INF-03 提醒。"""

    async def _resolve_supplier(
        self, tenant_id: int, supplier_id: int
    ) -> tuple[int, Optional[str], Optional[str]]:
        row = await Supplier.filter(
            tenant_id=tenant_id, id=supplier_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("供应商不存在（请从主数据选择）")
        return row.id, row.code, row.name

    def _validate_doc_type(self, doc_type: str) -> str:
        dt = (doc_type or ENV_DOC_TYPE_DEFAULT).strip().lower()
        if dt not in ENV_DOC_TYPES:
            raise ValidationError(f"非法环保资料类型: {doc_type}")
        return dt

    async def _get_row(self, tenant_id: int, doc_id: int) -> SupplierEvalEnvDocument:
        row = await SupplierEvalEnvDocument.filter(
            tenant_id=tenant_id, id=doc_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("环保资料不存在")
        return row

    def _to_response(self, row: SupplierEvalEnvDocument) -> SupplierEvalEnvDocumentResponse:
        return SupplierEvalEnvDocumentResponse.model_validate(row)

    async def create(
        self, tenant_id: int, data: SupplierEvalEnvDocumentCreate, user: User
    ) -> SupplierEvalEnvDocumentResponse:
        sid, scode, sname = await self._resolve_supplier(tenant_id, data.supplier_id)
        title = (data.title or "").strip()
        if not title:
            raise ValidationError("资料标题不能为空")
        row = SupplierEvalEnvDocument(
            tenant_id=tenant_id,
            supplier_id=sid,
            supplier_code=scode,
            supplier_name=sname,
            doc_type=self._validate_doc_type(data.doc_type),
            title=title,
            issued_at=data.issued_at,
            expires_at=data.expires_at,
            attachments=data.attachments,
            remarks=data.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        from apps.kuaizhizao.services.supplier_eval_env_reminder_service import (
            SupplierEvalEnvReminderService,
        )

        await SupplierEvalEnvReminderService.sync_after_saved(tenant_id, row)
        return self._to_response(row)

    async def update(
        self,
        tenant_id: int,
        doc_id: int,
        data: SupplierEvalEnvDocumentUpdate,
        user: User,
    ) -> SupplierEvalEnvDocumentResponse:
        row = await self._get_row(tenant_id, doc_id)
        payload = data.model_dump(exclude_unset=True)
        if "doc_type" in payload and payload["doc_type"] is not None:
            payload["doc_type"] = self._validate_doc_type(str(payload["doc_type"]))
        if "title" in payload and payload["title"] is not None:
            title = str(payload["title"]).strip()
            if not title:
                raise ValidationError("资料标题不能为空")
            payload["title"] = title
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        from apps.kuaizhizao.services.supplier_eval_env_reminder_service import (
            SupplierEvalEnvReminderService,
        )

        await SupplierEvalEnvReminderService.sync_after_saved(tenant_id, row)
        return self._to_response(row)

    async def get(self, tenant_id: int, doc_id: int) -> SupplierEvalEnvDocumentResponse:
        return self._to_response(await self._get_row(tenant_id, doc_id))

    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
        keyword: Optional[str] = None,
        supplier_id: Optional[int] = None,
        doc_type: Optional[str] = None,
        order_by: str = "-created_at",
    ) -> SupplierEvalEnvDocumentListResponse:
        query = SupplierEvalEnvDocument.filter(
            tenant_id=tenant_id, deleted_at__isnull=True
        )
        if supplier_id is not None:
            query = query.filter(supplier_id=int(supplier_id))
        if doc_type:
            query = query.filter(doc_type=doc_type.strip().lower())
        if keyword:
            kw = keyword.strip()
            if kw:
                query = query.filter(
                    Q(title__icontains=kw)
                    | Q(supplier_code__icontains=kw)
                    | Q(supplier_name__icontains=kw)
                )
        total = await query.count()
        allowed = {
            "created_at",
            "-created_at",
            "expires_at",
            "-expires_at",
            "title",
            "-title",
        }
        order = order_by if order_by in allowed else "-created_at"
        rows = await query.order_by(order).offset(skip).limit(limit)
        return SupplierEvalEnvDocumentListResponse(
            data=[SupplierEvalEnvDocumentResponse.model_validate(r) for r in rows],
            total=total,
            success=True,
        )

    async def delete(self, tenant_id: int, doc_id: int, user: User) -> bool:
        row = await self._get_row(tenant_id, doc_id)
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        from apps.kuaizhizao.services.supplier_eval_env_reminder_service import (
            SupplierEvalEnvReminderService,
        )

        await SupplierEvalEnvReminderService.stop_for_doc(
            tenant_id, row.id, reason="环保资料已删除"
        )
        return True
