"""返工排位策划模板 API。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaizhizao.schemas.rework_position_plan_template import (
    ReworkPositionPlanTemplateCreate,
    ReworkPositionPlanTemplateListResponse,
    ReworkPositionPlanTemplateResponse,
    ReworkPositionPlanTemplateUpdate,
)
from apps.kuaizhizao.services.rework_position_plan_template_service import (
    ReworkPositionPlanTemplateService,
)
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/rework-position-plan-templates",
    tags=["App - Kuaizhizao - Rework Position Plan Template"],
)
service = ReworkPositionPlanTemplateService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "",
    response_model=ReworkPositionPlanTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:rework-position-plan-template:create"))],
)
async def create_template(
    data: ReworkPositionPlanTemplateCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "",
    response_model=ReworkPositionPlanTemplateListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:rework-position-plan-template:read"))],
)
async def list_templates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    product_line_code: Optional[str] = None,
    is_active: Optional[bool] = None,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            product_line_code=product_line_code,
            is_active=is_active,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/{template_id}",
    response_model=ReworkPositionPlanTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:rework-position-plan-template:read"))],
)
async def get_template(
    template_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.get(tenant_id, template_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{template_id}",
    response_model=ReworkPositionPlanTemplateResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:rework-position-plan-template:update"))],
)
async def update_template(
    template_id: int,
    data: ReworkPositionPlanTemplateUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update(tenant_id, template_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/{template_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:rework-position-plan-template:delete"))],
)
async def delete_template(
    template_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await service.delete(tenant_id, template_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc
