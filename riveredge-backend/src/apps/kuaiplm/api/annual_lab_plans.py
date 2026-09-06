"""年度实验计划 API（R-07）。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaiplm.schemas.annual_lab_plan import (
    AnnualLabPlanCreate,
    AnnualLabPlanIssueRejectRequest,
    AnnualLabPlanListResponse,
    AnnualLabPlanMonthUpdate,
    AnnualLabPlanRejectRequest,
    AnnualLabPlanResponse,
    AnnualLabPlanUpdate,
)
from apps.kuaiplm.services.annual_lab_plan_service import AnnualLabPlanService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/annual-lab-plans",
    tags=["App - Kuaiplm - Annual Lab Plan"],
)
service = AnnualLabPlanService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "",
    response_model=AnnualLabPlanResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:create"))],
)
async def create_plan(
    data: AnnualLabPlanCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "",
    response_model=AnnualLabPlanListResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:read"))],
)
async def list_plans(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    plan_year: Optional[int] = None,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            status=status_filter,
            plan_year=plan_year,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/{plan_id}",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:read"))],
)
async def get_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.get(tenant_id, plan_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{plan_id}",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:update"))],
)
async def update_plan(
    plan_id: int,
    data: AnnualLabPlanUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update(tenant_id, plan_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/submit",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:submit"))],
)
async def submit_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.submit(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/approve",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:approve"))],
)
async def approve_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.approve(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/reject",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:reject"))],
)
async def reject_plan(
    plan_id: int,
    data: AnnualLabPlanRejectRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.reject(tenant_id, plan_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/close",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:update"))],
)
async def close_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.close(tenant_id, plan_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/{plan_id}",
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:delete"))],
)
async def delete_plan(
    plan_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await service.delete(tenant_id, plan_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{plan_id}/months/{month_id}",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:update"))],
)
async def update_month(
    plan_id: int,
    month_id: int,
    data: AnnualLabPlanMonthUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update_month(
            tenant_id, plan_id, month_id, data, current_user
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/months/{month_id}/issue/submit",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:submit"))],
)
async def submit_issue(
    plan_id: int,
    month_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.submit_issue(tenant_id, plan_id, month_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/months/{month_id}/issue/approve",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:approve"))],
)
async def approve_issue(
    plan_id: int,
    month_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.approve_issue(tenant_id, plan_id, month_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{plan_id}/months/{month_id}/issue/reject",
    response_model=AnnualLabPlanResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:annual-lab-plan:reject"))],
)
async def reject_issue(
    plan_id: int,
    month_id: int,
    data: AnnualLabPlanIssueRejectRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.reject_issue(
            tenant_id, plan_id, month_id, data, current_user
        )
    except Exception as exc:
        raise _http(exc) from exc
