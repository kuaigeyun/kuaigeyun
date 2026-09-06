"""生产日报 API（R-13）。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from apps.kuaizhizao.schemas.production_daily import (
    ProductionDailyReportCreate,
    ProductionDailyReportListResponse,
    ProductionDailyReportResponse,
    ProductionDailyReportUpdate,
    ProductionDailyTemplateCreate,
    ProductionDailyTemplateListResponse,
    ProductionDailyTemplateResponse,
    ProductionDailyTemplateUpdate,
)
from apps.kuaizhizao.services.production_daily_service import (
    ProductionDailyReportService,
    ProductionDailyTemplateService,
)
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

template_router = APIRouter(
    prefix="/production-daily-templates",
    tags=["App - Kuaizhizao - Production Daily Template"],
)
report_router = APIRouter(
    prefix="/production-daily-reports",
    tags=["App - Kuaizhizao - Production Daily Report"],
)
template_service = ProductionDailyTemplateService()
report_service = ProductionDailyReportService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@template_router.get(
    "",
    response_model=ProductionDailyTemplateListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:read"))],
)
async def list_templates(
    keyword: Optional[str] = Query(None),
    active_only: bool = Query(False),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    return await template_service.list_templates(
        tenant_id, keyword=keyword, active_only=active_only, user=current_user
    )


@template_router.post(
    "/ensure-defaults",
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:create"))],
)
async def ensure_default_templates(
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    created = await template_service.ensure_defaults(tenant_id, current_user)
    return {"data": {"created": created}, "success": True}


@template_router.get(
    "/{template_id}",
    response_model=ProductionDailyTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:read"))],
)
async def get_template(
    template_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await template_service.get(tenant_id, template_id)
    except Exception as exc:
        raise _http(exc) from exc


@template_router.post(
    "",
    response_model=ProductionDailyTemplateResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:create"))],
)
async def create_template(
    data: ProductionDailyTemplateCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await template_service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@template_router.put(
    "/{template_id}",
    response_model=ProductionDailyTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:update"))],
)
async def update_template(
    data: ProductionDailyTemplateUpdate,
    template_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await template_service.update(tenant_id, template_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@template_router.delete(
    "/{template_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily-template:delete"))],
)
async def delete_template(
    template_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await template_service.delete(tenant_id, template_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@report_router.get(
    "",
    response_model=ProductionDailyReportListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:read"))],
)
async def list_reports(
    keyword: Optional[str] = Query(None),
    template_code: Optional[str] = Query(None),
    team_name: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    tenant_id: int = Depends(get_current_tenant),
):
    return await report_service.list_reports(
        tenant_id,
        keyword=keyword,
        template_code=template_code,
        team_name=team_name,
        status=status_filter,
        date_start=date_start,
        date_end=date_end,
        skip=skip,
        limit=limit,
    )


@report_router.get(
    "/{report_id}",
    response_model=ProductionDailyReportResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:read"))],
)
async def get_report(
    report_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await report_service.get(tenant_id, report_id)
    except Exception as exc:
        raise _http(exc) from exc


@report_router.post(
    "",
    response_model=ProductionDailyReportResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:create"))],
)
async def create_report(
    data: ProductionDailyReportCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await report_service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@report_router.put(
    "/{report_id}",
    response_model=ProductionDailyReportResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:update"))],
)
async def update_report(
    data: ProductionDailyReportUpdate,
    report_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await report_service.update(tenant_id, report_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@report_router.post(
    "/{report_id}/submit",
    response_model=ProductionDailyReportResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:update"))],
)
async def submit_report(
    report_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await report_service.submit(tenant_id, report_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@report_router.delete(
    "/{report_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:production-daily:delete"))],
)
async def delete_report(
    report_id: int = Path(..., ge=1),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await report_service.delete(tenant_id, report_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc
