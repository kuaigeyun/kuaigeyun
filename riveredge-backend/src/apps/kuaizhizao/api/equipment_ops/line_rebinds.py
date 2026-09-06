"""设备换线绑定 API（R-10 WP-10.7）。"""

from typing import Optional

from fastapi import APIRouter, Depends, Path, Query, status
from fastapi import HTTPException

from apps.kuaizhizao.schemas.equipment_line_rebind import (
    EquipmentLineRebindAddRequest,
    EquipmentLineRebindCreate,
    EquipmentLineRebindItemResponse,
    EquipmentLineRebindListResponse,
    EquipmentLineRebindResponse,
    EquipmentLineRebindScanRequest,
)
from apps.kuaizhizao.services.equipment_line_rebind_service import EquipmentLineRebindService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user as soil_get_current_user
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/equipment-line-rebinds",
    tags=["App - Kuaige Zhizao - Equipment Line Rebind"],
)


def _http(exc: Exception, *, not_found: int = 404, bad: int = 422) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=not_found, detail=str(exc))
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=bad, detail=str(exc))
    return HTTPException(status_code=500, detail=str(exc))


def _to_response(header, items=None) -> EquipmentLineRebindResponse:
    data = EquipmentLineRebindResponse.model_validate(header)
    if items is not None:
        data.items = [EquipmentLineRebindItemResponse.model_validate(i) for i in items]
        data.item_count = len(items)
    return data


@router.post(
    "",
    response_model=EquipmentLineRebindResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:create"))],
)
async def create_line_rebind(
    data: EquipmentLineRebindCreate,
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        header = await EquipmentLineRebindService.create(
            tenant_id, data, current_user=current_user
        )
        items = await EquipmentLineRebindService._load_items(tenant_id, header.id)
        return _to_response(header, items)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.get(
    "",
    response_model=EquipmentLineRebindListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:read"))],
)
async def list_line_rebinds(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    production_line_id: Optional[int] = Query(None),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    rows, total = await EquipmentLineRebindService.list(
        tenant_id,
        skip=skip,
        limit=limit,
        status=status,
        keyword=keyword,
        production_line_id=production_line_id,
    )
    items = []
    for row in rows:
        line_items = await EquipmentLineRebindService._load_items(tenant_id, row.id)
        items.append(_to_response(row, line_items))
    return EquipmentLineRebindListResponse(
        items=items, total=total, skip=skip, limit=limit
    )


@router.get(
    "/{row_id}",
    response_model=EquipmentLineRebindResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:read"))],
)
async def get_line_rebind(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        header, items = await EquipmentLineRebindService.get_with_items(tenant_id, row_id)
        return _to_response(header, items)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/scan",
    response_model=EquipmentLineRebindItemResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:update"))],
)
async def scan_line_rebind(
    data: EquipmentLineRebindScanRequest,
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        item = await EquipmentLineRebindService.scan(
            tenant_id, row_id, scan_code=data.scan_code, current_user=current_user
        )
        return EquipmentLineRebindItemResponse.model_validate(item)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/items",
    response_model=EquipmentLineRebindItemResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:update"))],
)
async def add_line_rebind_item(
    data: EquipmentLineRebindAddRequest,
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        item = await EquipmentLineRebindService.add_equipment(
            tenant_id, row_id, equipment_id=data.equipment_id, current_user=current_user
        )
        return EquipmentLineRebindItemResponse.model_validate(item)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.delete(
    "/{row_id}/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:update"))],
)
async def remove_line_rebind_item(
    row_id: int = Path(..., ge=1),
    item_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        await EquipmentLineRebindService.remove_item(
            tenant_id, row_id, item_id, current_user=current_user
        )
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/complete",
    response_model=EquipmentLineRebindResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:submit"))],
)
async def complete_line_rebind(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        header = await EquipmentLineRebindService.complete(
            tenant_id, row_id, current_user=current_user
        )
        items = await EquipmentLineRebindService._load_items(tenant_id, header.id)
        return _to_response(header, items)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.post(
    "/{row_id}/cancel",
    response_model=EquipmentLineRebindResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:update"))],
)
async def cancel_line_rebind(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        header = await EquipmentLineRebindService.cancel(
            tenant_id, row_id, current_user=current_user
        )
        items = await EquipmentLineRebindService._load_items(tenant_id, header.id)
        return _to_response(header, items)
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e


@router.delete(
    "/{row_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission_codes("kuaizhizao:equipment-line-rebind:delete"))],
)
async def delete_line_rebind(
    row_id: int = Path(..., ge=1),
    current_user: User = Depends(soil_get_current_user),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        await EquipmentLineRebindService.delete(
            tenant_id, row_id, current_user=current_user
        )
    except (NotFoundError, ValidationError) as e:
        raise _http(e) from e
