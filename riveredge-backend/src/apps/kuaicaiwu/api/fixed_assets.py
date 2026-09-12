"""固定资产 API。"""

from decimal import Decimal
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import Field

from apps.kuaicaiwu.api._kuaicaiwu_route_access import require_kuaicaiwu_module_access
from apps.kuaicaiwu.services.fa_asset_service import FaAssetService
from apps.kuaicaiwu.services.fa_category_service import FaCategoryService
from apps.kuaicaiwu.services.fa_change_service import FaChangeService, FaDisposalService
from apps.kuaicaiwu.services.fa_depreciation_service import (
    FaAdjustmentService,
    FaDepreciationService,
    FaPeriodCloseService,
)
from core.api.deps.deps import get_current_user
from core.schemas.base import BaseSchema
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/fixed-assets",
    tags=["App - Kuaicaiwu - Fixed Assets"],
)

category_service = FaCategoryService()
asset_service = FaAssetService()
depr_service = FaDepreciationService()
adjustment_service = FaAdjustmentService()
change_service = FaChangeService()
disposal_service = FaDisposalService()
period_close_service = FaPeriodCloseService()


class FaCategoryBody(BaseSchema):
    category_code: str = Field(..., max_length=50)
    category_name: str = Field(..., max_length=200)
    depreciation_method: str = Field("straight_line", max_length=30)
    useful_life_months: int = Field(60, ge=1)
    residual_rate: Decimal = Field(Decimal("0.05"))
    asset_account_code: str = Field("1601", max_length=20)
    accumulated_depreciation_account_code: str = Field("1602", max_length=20)
    expense_account_code: str = Field("6602", max_length=20)
    is_active: bool = True
    notes: Optional[str] = None


class FaCategoryUpdateBody(BaseSchema):
    category_name: Optional[str] = None
    depreciation_method: Optional[str] = None
    useful_life_months: Optional[int] = Field(None, ge=1)
    residual_rate: Optional[Decimal] = None
    asset_account_code: Optional[str] = None
    accumulated_depreciation_account_code: Optional[str] = None
    expense_account_code: Optional[str] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class FaAssetBody(BaseSchema):
    asset_code: Optional[str] = None
    asset_name: str
    category_id: Optional[int] = None
    quantity: Decimal = Field(Decimal("1"))
    unit: Optional[str] = None
    change_method: Optional[str] = None
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    status: str = "active"
    location: Optional[str] = None
    start_use_date: Optional[str] = None
    entry_date: Optional[str] = None
    specification: Optional[str] = None
    notes: Optional[str] = None
    attachment_uuids: Optional[List[str]] = None
    depreciation_method: str = "straight_line"
    original_value: Decimal = Field(Decimal("0"))
    impairment_value: Decimal = Field(Decimal("0"))
    useful_life_months: int = Field(60, ge=1)
    depreciated_periods: int = Field(0, ge=0)
    accumulated_depreciation: Decimal = Field(Decimal("0"))
    residual_rate: Decimal = Field(Decimal("0.05"))
    asset_account_code: str = "1601"
    accumulated_depreciation_account_code: str = "1602"
    expense_account_code: str = "6602"


class FaDeprPreviewBody(BaseSchema):
    period_year: int = Field(..., ge=2000, le=2100)
    period_month: int = Field(..., ge=1, le=12)


class FaDeprLineUpdateBody(BaseSchema):
    final_amount: Decimal


class FaChangeBody(BaseSchema):
    asset_id: int
    change_type: str
    change_date: str
    after_snapshot: Optional[dict[str, Any]] = None
    notes: Optional[str] = None


class FaDisposalBody(BaseSchema):
    asset_id: int
    disposal_date: str
    disposal_type: str = "sale"
    disposal_amount: Decimal = Field(Decimal("0"))
    notes: Optional[str] = None


class FaAdjustmentBody(BaseSchema):
    asset_id: int
    period_year: int
    period_month: int
    adjustment_amount: Decimal
    reason: Optional[str] = None


class FaPeriodCloseBody(BaseSchema):
    period_year: int
    period_month: int
    notes: Optional[str] = None


def _err(exc: Exception):
    from fastapi import HTTPException

    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=400, detail=str(exc))
    from infra.exceptions.exceptions import BusinessLogicError

    if isinstance(exc, BusinessLogicError):
        return HTTPException(status_code=400, detail=str(exc))
    return HTTPException(status_code=400, detail=str(exc))


# --- 类别 ---
@router.get(
    "/categories",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def list_categories(
    keyword: Optional[str] = None,
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
):
    return await category_service.list_categories(
        current_user.tenant_id, keyword=keyword, is_active=is_active
    )


@router.post(
    "/categories",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def create_category(body: FaCategoryBody, current_user: User = Depends(get_current_user)):
    return await category_service.create_category(
        current_user.tenant_id, body.model_dump(), current_user
    )


@router.put(
    "/categories/{category_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def update_category(
    category_id: int, body: FaCategoryUpdateBody, current_user: User = Depends(get_current_user)
):
    return await category_service.update_category(
        current_user.tenant_id,
        category_id,
        body.model_dump(exclude_unset=True),
        current_user,
    )


@router.delete(
    "/categories/{category_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def delete_category(category_id: int, current_user: User = Depends(get_current_user)):
    await category_service.delete_category(current_user.tenant_id, category_id, current_user)
    return {"ok": True}


# --- 资产清单 ---
@router.get(
    "/assets",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def list_assets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
):
    return await asset_service.list_assets(
        current_user.tenant_id,
        skip=skip,
        limit=limit,
        keyword=keyword,
        status=status,
        category_id=category_id,
    )


@router.get(
    "/assets/export/excel",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def export_assets(current_user: User = Depends(get_current_user)):
    stream = await asset_service.export_excel(current_user.tenant_id)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=fixed_assets.xlsx"},
    )


@router.post(
    "/assets/import/excel",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def import_assets(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    return await asset_service.import_excel(current_user.tenant_id, content, current_user)


@router.get(
    "/assets/{asset_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def get_asset(asset_id: int, current_user: User = Depends(get_current_user)):
    try:
        return await asset_service.get_asset(current_user.tenant_id, asset_id)
    except NotFoundError as exc:
        raise _err(exc)


@router.post(
    "/assets",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def create_asset(body: FaAssetBody, current_user: User = Depends(get_current_user)):
    return await asset_service.create_asset(
        current_user.tenant_id, body.model_dump(), current_user
    )


@router.put(
    "/assets/{asset_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def update_asset(
    asset_id: int, body: FaAssetBody, current_user: User = Depends(get_current_user)
):
    return await asset_service.update_asset(
        current_user.tenant_id, asset_id, body.model_dump(), current_user
    )


@router.delete(
    "/assets/{asset_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def delete_asset(asset_id: int, current_user: User = Depends(get_current_user)):
    await asset_service.delete_asset(current_user.tenant_id, asset_id, current_user)
    return {"ok": True}


# --- 折旧计提 ---
@router.get(
    "/depreciation-runs",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def list_depr_runs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
):
    return await depr_service.list_runs(current_user.tenant_id, skip=skip, limit=limit)


@router.post(
    "/depreciation-runs/preview",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def preview_depr_run(body: FaDeprPreviewBody, current_user: User = Depends(get_current_user)):
    return await depr_service.preview_run(
        current_user.tenant_id, body.period_year, body.period_month, current_user
    )


@router.get(
    "/depreciation-runs/{run_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def get_depr_run(run_id: int, current_user: User = Depends(get_current_user)):
    try:
        return await depr_service.get_run(current_user.tenant_id, run_id)
    except NotFoundError as exc:
        raise _err(exc)


@router.patch(
    "/depreciation-runs/{run_id}/lines/{line_id}",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def update_depr_line(
    run_id: int,
    line_id: int,
    body: FaDeprLineUpdateBody,
    current_user: User = Depends(get_current_user),
):
    return await depr_service.update_line_amount(
        current_user.tenant_id, run_id, line_id, body.final_amount, current_user
    )


@router.post(
    "/depreciation-runs/{run_id}/confirm",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def confirm_depr_run(run_id: int, current_user: User = Depends(get_current_user)):
    return await depr_service.confirm_run(current_user.tenant_id, run_id, current_user)


# --- 折旧调整 ---
@router.get(
    "/depreciation-adjustments",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def list_adjustments(current_user: User = Depends(get_current_user)):
    return await adjustment_service.list_adjustments(current_user.tenant_id)


@router.post(
    "/depreciation-adjustments",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def create_adjustment(body: FaAdjustmentBody, current_user: User = Depends(get_current_user)):
    return await adjustment_service.create_adjustment(
        current_user.tenant_id, body.model_dump(), current_user
    )


@router.post(
    "/depreciation-adjustments/{adjustment_id}/confirm",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-depreciation"))],
)
async def confirm_adjustment(
    adjustment_id: int, current_user: User = Depends(get_current_user)
):
    return await adjustment_service.confirm_adjustment(
        current_user.tenant_id, adjustment_id, current_user
    )


# --- 资产变动 ---
@router.get(
    "/changes",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def list_changes(current_user: User = Depends(get_current_user)):
    return await change_service.list_changes(current_user.tenant_id)


@router.post(
    "/changes",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def create_change(body: FaChangeBody, current_user: User = Depends(get_current_user)):
    return await change_service.create_change(
        current_user.tenant_id, body.model_dump(), current_user
    )


@router.post(
    "/changes/{change_id}/confirm",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def confirm_change(change_id: int, current_user: User = Depends(get_current_user)):
    return await change_service.confirm_change(current_user.tenant_id, change_id, current_user)


# --- 资产清理 ---
@router.get(
    "/disposals",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def list_disposals(current_user: User = Depends(get_current_user)):
    return await disposal_service.list_disposals(current_user.tenant_id)


@router.post(
    "/disposals",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def create_disposal(body: FaDisposalBody, current_user: User = Depends(get_current_user)):
    return await disposal_service.create_disposal(
        current_user.tenant_id, body.model_dump(), current_user
    )


@router.post(
    "/disposals/{disposal_id}/confirm",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def confirm_disposal(disposal_id: int, current_user: User = Depends(get_current_user)):
    return await disposal_service.confirm_disposal(
        current_user.tenant_id, disposal_id, current_user
    )


# --- 资产结账 ---
@router.get(
    "/period-closes",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def list_period_closes(current_user: User = Depends(get_current_user)):
    return await period_close_service.list_closes(current_user.tenant_id)


@router.post(
    "/period-close",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset"))],
)
async def close_period(body: FaPeriodCloseBody, current_user: User = Depends(get_current_user)):
    return await period_close_service.close_period(
        current_user.tenant_id,
        body.period_year,
        body.period_month,
        current_user,
        body.notes,
    )


# --- 报表 ---
@router.get(
    "/reports/depreciation-detail",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-report"))],
)
async def depreciation_detail_report(
    period_year: Optional[int] = None,
    period_month: Optional[int] = None,
    asset_code: Optional[str] = None,
    asset_name: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    return await depr_service.depreciation_detail_report(
        current_user.tenant_id,
        year=period_year,
        month=period_month,
        asset_code=asset_code,
        asset_name=asset_name,
    )


@router.get(
    "/reports/depreciation-summary",
    dependencies=[Depends(require_kuaicaiwu_module_access("fixed-asset-report"))],
)
async def depreciation_summary_report(
    period_year: Optional[int] = None,
    period_month: Optional[int] = None,
    current_user: User = Depends(get_current_user),
):
    return await depr_service.depreciation_summary_report(
        current_user.tenant_id, year=period_year, month=period_month
    )
