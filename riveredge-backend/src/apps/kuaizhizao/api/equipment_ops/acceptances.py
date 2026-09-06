"""设备工装验收 API。"""

from typing import Optional

from fastapi import APIRouter, Depends, Path, Query, status

from apps.kuaizhizao.schemas.equipment_acceptance import (
    EquipmentAcceptanceCreate,
    EquipmentAcceptanceListResponse,
    EquipmentAcceptanceRejectRequest,
    EquipmentAcceptanceResponse,
    EquipmentAcceptanceUpdate,
)
from apps.kuaizhizao.services.equipment_acceptance_service import EquipmentAcceptanceService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user as soil_get_current_user
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User
from fastapi import HTTPException

router = APIRouter(prefix="/equipment-acceptances", tags=["App - Kuaige Zhizao - Equipment Acceptance"])


def _http(exc: Exception, *, not_found: int = 404, bad: int = 422) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=not_found, detail=str(exc))
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=bad, detail=str(exc))
    return HTTPException(status_code=500, detail=str(exc))


@router.post(
    "",
    response_model=EquipmentAcceptanceResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:create"))],
)
async def create_acceptance(
    data: EquipmentAcceptanceCreate,
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.create(
            tenant_id, data, current_user=current_user
        )
        return EquipmentAcceptanceResponse.model_validate(row)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.get(
    "",
    response_model=EquipmentAcceptanceListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:read"))],
)
async def list_acceptances(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    target_type: Optional[str] = Query(None),
    target_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    order_by: Optional[str] = Query(None),
    due_start_date: Optional[str] = Query(None),
    due_end_date: Optional[str] = Query(None),
    created_start_date: Optional[str] = Query(None),
    created_end_date: Optional[str] = Query(None),
    updated_start_date: Optional[str] = Query(None),
    updated_end_date: Optional[str] = Query(None),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    items, total = await EquipmentAcceptanceService.list(
        tenant_id,
        skip=skip,
        limit=limit,
        target_type=target_type,
        target_id=target_id,
        category=category,
        status=status,
        keyword=keyword,
        search=search,
        order_by=order_by,
        due_start_date=due_start_date,
        due_end_date=due_end_date,
        created_start_date=created_start_date,
        created_end_date=created_end_date,
        updated_start_date=updated_start_date,
        updated_end_date=updated_end_date,
    )
    return EquipmentAcceptanceListResponse(
        items=[EquipmentAcceptanceResponse.model_validate(i) for i in items],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{row_id}",
    response_model=EquipmentAcceptanceResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:read"))],
)
async def get_acceptance(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        return EquipmentAcceptanceResponse.model_validate(row)
    except NotFoundError as e:
        raise _http(e) from e


@router.put(
    "/{row_id}",
    response_model=EquipmentAcceptanceResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:update"))],
)
async def update_acceptance(
    data: EquipmentAcceptanceUpdate,
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.update(
            tenant_id, row_id, data, current_user=current_user
        )
        return EquipmentAcceptanceResponse.model_validate(row)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/submit",
    response_model=EquipmentAcceptanceResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:submit"))],
)
async def submit_acceptance(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.submit(
            tenant_id, row_id, current_user=current_user
        )
        return EquipmentAcceptanceResponse.model_validate(row)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/approve",
    response_model=EquipmentAcceptanceResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:approve"))],
)
async def approve_acceptance(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.approve(
            tenant_id, row_id, current_user=current_user
        )
        return EquipmentAcceptanceResponse.model_validate(row)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/reject",
    response_model=EquipmentAcceptanceResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:reject"))],
)
async def reject_acceptance(
    data: EquipmentAcceptanceRejectRequest,
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await EquipmentAcceptanceService.reject(
            tenant_id,
            row_id,
            reject_reason=data.reject_reason,
            current_user=current_user,
        )
        return EquipmentAcceptanceResponse.model_validate(row)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.delete(
    "/{row_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-acceptance:delete"))],
)
async def delete_acceptance(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        await EquipmentAcceptanceService.delete(
            tenant_id, row_id, current_user=current_user
        )
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e
