"""供应商评价 / 模板 / 环保资料 API（R-03）。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaizhizao.schemas.supplier_evaluation import (
    SupplierEvalEnvDocumentCreate,
    SupplierEvalEnvDocumentListResponse,
    SupplierEvalEnvDocumentResponse,
    SupplierEvalEnvDocumentUpdate,
    SupplierEvalPlanCreate,
    SupplierEvalPlanGenerateResult,
    SupplierEvalPlanListResponse,
    SupplierEvalPlanResponse,
    SupplierEvalPlanUpdate,
    SupplierEvalSummaryResponse,
    SupplierEvalTemplateCreate,
    SupplierEvalTemplateListResponse,
    SupplierEvalTemplateResponse,
    SupplierEvalTemplateUpdate,
    SupplierEvaluationCloseRectificationRequest,
    SupplierEvaluationCreate,
    SupplierEvaluationListResponse,
    SupplierEvaluationResponse,
    SupplierEvaluationRevokeRequest,
    SupplierEvaluationUpdate,
)
from apps.kuaizhizao.services.supplier_eval_plan_service import (
    SupplierEvalPlanService,
    SupplierEvalSummaryService,
)
from apps.kuaizhizao.services.supplier_evaluation_service import (
    SupplierEvalEnvDocumentService,
    SupplierEvalTemplateService,
    SupplierEvaluationService,
)
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(prefix="/supplier-evaluations", tags=["App - Kuaizhizao - Supplier Evaluation"])
service = SupplierEvaluationService()
env_service = SupplierEvalEnvDocumentService()
template_service = SupplierEvalTemplateService()
plan_service = SupplierEvalPlanService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get(
    "/templates",
    response_model=SupplierEvalTemplateListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def list_templates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    is_active: Optional[bool] = None,
    period_type: Optional[str] = None,
    order_by: str = Query("-created_at"),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await template_service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            is_active=is_active,
            period_type=period_type,
            order_by=order_by,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/templates",
    response_model=SupplierEvalTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:create"))],
)
async def create_template(
    data: SupplierEvalTemplateCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await template_service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/templates/{template_id}",
    response_model=SupplierEvalTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def get_template(
    template_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await template_service.get(tenant_id, template_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/templates/{template_id}",
    response_model=SupplierEvalTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def update_template(
    template_id: int,
    data: SupplierEvalTemplateUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await template_service.update(tenant_id, template_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/templates/{template_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:delete"))],
)
async def delete_template(
    template_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await template_service.delete(tenant_id, template_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/summary",
    response_model=SupplierEvalSummaryResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def evaluation_summary(
    period_type: Optional[str] = None,
    period_year: Optional[int] = None,
    period_quarter: Optional[int] = None,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await SupplierEvalSummaryService.summarize(
            tenant_id,
            period_type=period_type,
            period_year=period_year,
            period_quarter=period_quarter,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/plans",
    response_model=SupplierEvalPlanListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def list_plans(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    period_type: Optional[str] = None,
    period_year: Optional[int] = None,
    order_by: str = Query("-created_at"),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await plan_service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            status=status,
            period_type=period_type,
            period_year=period_year,
            order_by=order_by,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/plans",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:create"))],
)
async def create_plan(
    data: SupplierEvalPlanCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/plans/{plan_id}",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def get_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await plan_service.get(tenant_id, plan_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/plans/{plan_id}",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def update_plan(
    plan_id: int,
    data: SupplierEvalPlanUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.update(tenant_id, plan_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/plans/{plan_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:delete"))],
)
async def delete_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await plan_service.delete(tenant_id, plan_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/plans/{plan_id}/release",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:submit"))],
)
async def release_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.release(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/plans/{plan_id}/reopen-draft",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def reopen_plan_draft(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.reopen_draft(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/plans/{plan_id}/close",
    response_model=SupplierEvalPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def close_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.close(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/plans/{plan_id}/generate",
    response_model=SupplierEvalPlanGenerateResult,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:create"))],
)
async def generate_plan_evaluations(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await plan_service.generate_evaluations(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:create"))],
)
async def create_evaluation(
    data: SupplierEvaluationCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "",
    response_model=SupplierEvaluationListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def list_evaluations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    period_type: Optional[str] = None,
    period_year: Optional[int] = None,
    supplier_id: Optional[int] = None,
    order_by: str = Query("-created_at"),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            status=status,
            period_type=period_type,
            period_year=period_year,
            supplier_id=supplier_id,
            order_by=order_by,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/env-documents",
    response_model=SupplierEvalEnvDocumentListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def list_env_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    supplier_id: Optional[int] = None,
    doc_type: Optional[str] = None,
    order_by: str = Query("-created_at"),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await env_service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            supplier_id=supplier_id,
            doc_type=doc_type,
            order_by=order_by,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/env-documents",
    response_model=SupplierEvalEnvDocumentResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:create"))],
)
async def create_env_document(
    data: SupplierEvalEnvDocumentCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await env_service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/env-documents/{doc_id}",
    response_model=SupplierEvalEnvDocumentResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def get_env_document(
    doc_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await env_service.get(tenant_id, doc_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/env-documents/{doc_id}",
    response_model=SupplierEvalEnvDocumentResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def update_env_document(
    doc_id: int,
    data: SupplierEvalEnvDocumentUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await env_service.update(tenant_id, doc_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/env-documents/{doc_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:delete"))],
)
async def delete_env_document(
    doc_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await env_service.delete(tenant_id, doc_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/{eval_id}",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:read"))],
)
async def get_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.get(tenant_id, eval_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{eval_id}",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def update_evaluation(
    eval_id: int,
    data: SupplierEvaluationUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update(tenant_id, eval_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/{eval_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:delete"))],
)
async def delete_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await service.delete(tenant_id, eval_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/submit",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:submit"))],
)
async def submit_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.submit(tenant_id, eval_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/approve",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:approve"))],
)
async def approve_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.approve(tenant_id, eval_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/reject",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:reject"))],
)
async def reject_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.reject(tenant_id, eval_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/revoke",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def revoke_evaluation(
    eval_id: int,
    data: SupplierEvaluationRevokeRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.revoke(tenant_id, eval_id, data.reason, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/recalculate",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def recalculate_evaluation(
    eval_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.recalculate(tenant_id, eval_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{eval_id}/close-rectification",
    response_model=SupplierEvaluationResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:supplier-eval:update"))],
)
async def close_rectification(
    eval_id: int,
    data: SupplierEvaluationCloseRectificationRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.close_rectification(tenant_id, eval_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc
