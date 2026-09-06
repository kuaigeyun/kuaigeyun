"""标签工位 API（R-16）。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from apps.kuaizhizao.schemas.label_station import (
    LabelCleanupRequest,
    LabelLockRequest,
    LabelModelConfigCreate,
    LabelModelConfigUpdate,
    LabelReprintRequest,
    LabelScanRequest,
    LabelSessionOpen,
    LabelStationCreate,
    LabelStationUpdate,
    LabelUnbindRequest,
    LabelUnlockRequest,
)
from apps.kuaizhizao.services.label_station_service import LabelStationService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(prefix="/label-station", tags=["App - Kuaizhizao - Label Station"])
service = LabelStationService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get("/models", summary="List label model configs")
async def list_models(
    active_only: bool = Query(False),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:read")),
    tenant_id: int = Depends(get_current_tenant),
):
    rows = await service.list_models(tenant_id, active_only=active_only)
    return {"data": rows, "total": len(rows), "success": True}


@router.post("/models", status_code=status.HTTP_201_CREATED, summary="Create label model config")
async def create_model(
    data: LabelModelConfigCreate,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:create")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.create_model(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.put("/models/{model_id}", summary="Update label model config")
async def update_model(
    data: LabelModelConfigUpdate,
    model_id: int = Path(..., ge=1),
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:update")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.update_model(tenant_id, model_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.get("/stations", summary="List label stations")
async def list_stations(
    active_only: bool = Query(False),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:read")),
    tenant_id: int = Depends(get_current_tenant),
):
    rows = await service.list_stations(tenant_id, active_only=active_only)
    return {"data": rows, "total": len(rows), "success": True}


@router.post("/stations", status_code=status.HTTP_201_CREATED, summary="Create label station")
async def create_station(
    data: LabelStationCreate,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:create")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.create_station(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.put("/stations/{station_id}", summary="Update label station")
async def update_station(
    data: LabelStationUpdate,
    station_id: int = Path(..., ge=1),
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:update")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.update_station(tenant_id, station_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/sessions/open", summary="Open label station session")
async def open_session(
    data: LabelSessionOpen,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:execute")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.open_session(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.get("/sessions/{session_id}", summary="Get label station session snapshot")
async def get_session(
    session_id: int = Path(..., ge=1),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:read")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.get_snapshot(tenant_id, session_id)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/sessions/{session_id}/close", summary="Close label station session")
async def close_session(
    session_id: int = Path(..., ge=1),
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:execute")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.close_session(tenant_id, session_id, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/scan", summary="Scan barcode into current box")
async def scan_barcode(
    data: LabelScanRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:packing-bind:execute")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.scan_barcode(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/lock", summary="Lock station session")
async def lock_session(
    data: LabelLockRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:update")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.lock_session(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/unlock", summary="Unlock station session")
async def unlock_session(
    data: LabelUnlockRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:update")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.unlock_session(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/unbind", summary="Unbind barcode or whole box")
async def unbind(
    data: LabelUnbindRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:packing-bind:update")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.unbind(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/reprint", summary="Reprint box label")
async def reprint(
    data: LabelReprintRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:print")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.reprint(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post("/cleanup", summary="Cleanup historical label station data")
async def cleanup_history(
    data: LabelCleanupRequest,
    current_user: User = Depends(get_current_user),
    _auth=Depends(require_permission_codes("kuaizhizao:label-station:delete")),
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        row = await service.cleanup_history(tenant_id, data, current_user)
        return {"data": row, "success": True}
    except Exception as exc:
        raise _http(exc) from exc
