"""单据时间修正 API（受限：造数工具走已登录 HTTP，不直连库）。"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from core.api.deps.access import AuthContext, require_permission_codes
from core.services.document_time_rewrite_service import (
    DocumentTimeRewriteService,
    WorkScheduleParams,
    list_rewrite_doc_types,
)

router = APIRouter(prefix="/document-time-rewrite", tags=["Core - Document Time Rewrite"])


class WorkScheduleBody(BaseModel):
    weekdays: list[int] = Field(default_factory=lambda: [0, 1, 2, 3, 4])
    start_time: str = "09:00"
    end_time: str = "18:00"
    lookback_days: int = 14


class RewriteRequest(BaseModel):
    doc_type: str
    document_ids: list[int] = Field(min_length=1)
    work: WorkScheduleBody
    sync_operator: bool = True
    rewrite_code_date: bool = True


class RewriteExactItem(BaseModel):
    id: int
    issued_at: datetime


class RewriteExactRequest(BaseModel):
    doc_type: str
    items: list[RewriteExactItem] = Field(min_length=1)
    sync_operator: bool = True
    rewrite_code_date: bool = True
    preserve_business_dates: bool = True


@router.get("/doc-types", summary="可修正的单据类型")
async def get_doc_types(
    _auth: AuthContext = Depends(require_permission_codes("system:document-time-rewrite:read")),
) -> dict[str, Any]:
    return {"items": list_rewrite_doc_types()}


@router.get("/documents", summary="最近单据列表（时间修正）")
async def list_documents(
    doc_type: str = Query(...),
    limit: int = Query(50, ge=1, le=500),
    keyword: str = Query(""),
    auth: AuthContext = Depends(require_permission_codes("system:document-time-rewrite:read")),
) -> dict[str, Any]:
    try:
        items = await DocumentTimeRewriteService.list_recent_documents(
            tenant_id=int(auth.tenant_id),
            doc_type=doc_type,
            limit=limit,
            code_keyword=keyword,
        )
        return {"items": items, "total": len(items)}
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/rewrite", summary="按工作时段改写单据时间")
async def rewrite_times(
    body: RewriteRequest,
    auth: AuthContext = Depends(require_permission_codes("system:document-time-rewrite:execute")),
) -> dict[str, Any]:
    schedule = WorkScheduleParams(
        weekdays=list(body.work.weekdays),
        start_time=body.work.start_time,
        end_time=body.work.end_time,
        lookback_days=int(body.work.lookback_days),
    )
    try:
        return await DocumentTimeRewriteService.rewrite_document_times(
            tenant_id=int(auth.tenant_id),
            doc_type=body.doc_type,
            document_ids=list(body.document_ids),
            schedule=schedule,
            sync_operator=bool(body.sync_operator),
            rewrite_code_date=bool(body.rewrite_code_date),
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/rewrite-exact", summary="按明确业务时刻改写单据时间/人员/单号日期")
async def rewrite_times_exact(
    body: RewriteExactRequest,
    auth: AuthContext = Depends(require_permission_codes("system:document-time-rewrite:execute")),
) -> dict[str, Any]:
    try:
        return await DocumentTimeRewriteService.rewrite_documents_at_exact_times(
            tenant_id=int(auth.tenant_id),
            doc_type=body.doc_type,
            items=[{"id": it.id, "issued_at": it.issued_at} for it in body.items],
            sync_operator=bool(body.sync_operator),
            rewrite_code_date=bool(body.rewrite_code_date),
            preserve_business_dates=bool(body.preserve_business_dates),
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


class AlignOwnRequest(BaseModel):
    doc_type: str
    document_ids: list[int] = Field(min_length=1)
    sync_operator: bool = True
    rewrite_code_date: bool = True


@router.post("/align-own", summary="按单据自身业务日/人员对齐更新时间与单号日期")
async def align_own(
    body: AlignOwnRequest,
    auth: AuthContext = Depends(require_permission_codes("system:document-time-rewrite:execute")),
) -> dict[str, Any]:
    try:
        return await DocumentTimeRewriteService.align_documents_to_own_fields(
            tenant_id=int(auth.tenant_id),
            doc_type=body.doc_type,
            document_ids=list(body.document_ids),
            sync_operator=bool(body.sync_operator),
            rewrite_code_date=bool(body.rewrite_code_date),
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
