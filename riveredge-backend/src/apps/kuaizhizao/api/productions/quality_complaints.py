"""质量投诉 API（R-11 WP-11B）。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaizhizao.schemas.quality_complaint import (
    QualityComplaintCreate,
    QualityComplaintListResponse,
    QualityComplaintResponse,
    QualityComplaintRevokeRequest,
    QualityComplaintSupplierResponseRequest,
    QualityComplaintUpdate,
)
from apps.kuaizhizao.services.quality_complaint_service import QualityComplaintService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(prefix="/quality-complaints", tags=["App - Kuaizhizao - Quality Complaint"])
service = QualityComplaintService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:create"))],
)
async def create_complaint(
    data: QualityComplaintCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "",
    response_model=QualityComplaintListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:read"))],
)
async def list_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    business_type: Optional[str] = None,
    include_export_masked: bool = Query(True, description="是否包含导出屏蔽记录"),
    defect_category: Optional[str] = None,
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
            business_type=business_type,
            defect_category=defect_category,
            include_export_masked=include_export_masked,
            order_by=order_by,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/{complaint_id}",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:read"))],
)
async def get_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.get(tenant_id, complaint_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{complaint_id}",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:update"))],
)
async def update_complaint(
    complaint_id: int,
    data: QualityComplaintUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update(tenant_id, complaint_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/{complaint_id}",
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:delete"))],
)
async def delete_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await service.delete(tenant_id, complaint_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/submit",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:submit"))],
)
async def submit_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.submit(tenant_id, complaint_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/approve",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:approve"))],
)
async def approve_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.approve(tenant_id, complaint_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/reject",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:reject"))],
)
async def reject_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.reject(tenant_id, complaint_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/supplier-response",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:update"))],
)
async def supplier_response(
    complaint_id: int,
    data: QualityComplaintSupplierResponseRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.save_supplier_response(tenant_id, complaint_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/close",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:close"))],
)
async def close_complaint(
    complaint_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.close(tenant_id, complaint_id, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/revoke",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:revoke"))],
)
async def revoke_complaint(
    complaint_id: int,
    data: QualityComplaintRevokeRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.revoke(tenant_id, complaint_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{complaint_id}/export-mask",
    response_model=QualityComplaintResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-complaint:export"))],
)
async def mask_for_export(
    complaint_id: int,
    masked: bool = Query(True),
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.set_export_masked(tenant_id, complaint_id, masked, current_user)
    except Exception as exc:
        raise _http(exc) from exc
