"""R-05 质量投诉总批次月录入 API。"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaizhizao.schemas.quality_complaint_batch_month import (
    QualityComplaintBatchMonthListResponse,
    QualityComplaintBatchMonthResponse,
    QualityComplaintBatchMonthUpsert,
)
from apps.kuaizhizao.services.quality_complaint_analysis_service import (
    QualityComplaintBatchMonthService,
)
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/quality-complaint-batch-months",
    tags=["App - Kuaizhizao - Quality Complaint Batch Month"],
)
service = QualityComplaintBatchMonthService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get(
    "",
    response_model=QualityComplaintBatchMonthListResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-analysis:read"))],
)
async def list_batch_months(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    year_month: Optional[str] = None,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.list(tenant_id, skip=skip, limit=limit, year_month=year_month)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "",
    response_model=QualityComplaintBatchMonthResponse,
    dependencies=[Depends(require_permission_codes("kuaizhizao:quality-analysis:update"))],
)
async def upsert_batch_month(
    data: QualityComplaintBatchMonthUpsert,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.upsert(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc
