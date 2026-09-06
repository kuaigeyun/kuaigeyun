"""实验判定规则 API（R-02）。"""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from apps.kuaiplm.schemas.lab_judgment_rule import (
    LabJudgmentRuleCreate,
    LabJudgmentRuleListResponse,
    LabJudgmentRuleOption,
    LabJudgmentRuleResponse,
    LabJudgmentRuleReviseRequest,
    LabJudgmentRuleUpdate,
)
from apps.kuaiplm.services.lab_judgment_rule_service import LabJudgmentRuleService
from core.api.deps.access import require_permission_codes
from core.api.deps.deps import get_current_tenant
from infra.api.deps.deps import get_current_user
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

router = APIRouter(
    prefix="/lab-judgment-rules",
    tags=["App - Kuaiplm - Lab Judgment Rule"],
)
service = LabJudgmentRuleService()


def _http(exc: Exception) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ValidationError, BusinessLogicError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "",
    response_model=LabJudgmentRuleResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:create"))],
)
async def create_rule(
    data: LabJudgmentRuleCreate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.create(tenant_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "",
    response_model=LabJudgmentRuleListResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:read"))],
)
async def list_rules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    keyword: Optional[str] = None,
    is_active: Optional[bool] = None,
    rule_code: Optional[str] = None,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.list(
            tenant_id,
            skip=skip,
            limit=limit,
            keyword=keyword,
            is_active=is_active,
            rule_code=rule_code,
        )
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/options",
    response_model=List[LabJudgmentRuleOption],
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-request:read"))],
)
async def list_rule_options(
    keyword: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    tenant_id: int = Depends(get_current_tenant),
):
    """实验委托维护试验项时选用启用规则。"""
    try:
        return await service.list_options(tenant_id, keyword=keyword, limit=limit)
    except Exception as exc:
        raise _http(exc) from exc


@router.get(
    "/{rule_id}",
    response_model=LabJudgmentRuleResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:read"))],
)
async def get_rule(
    rule_id: int,
    tenant_id: int = Depends(get_current_tenant),
):
    try:
        return await service.get(tenant_id, rule_id)
    except Exception as exc:
        raise _http(exc) from exc


@router.put(
    "/{rule_id}",
    response_model=LabJudgmentRuleResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:update"))],
)
async def update_rule(
    rule_id: int,
    data: LabJudgmentRuleUpdate,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.update(tenant_id, rule_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.post(
    "/{rule_id}/revise",
    response_model=LabJudgmentRuleResponse,
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:create"))],
)
async def revise_rule(
    rule_id: int,
    data: LabJudgmentRuleReviseRequest,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        return await service.revise(tenant_id, rule_id, data, current_user)
    except Exception as exc:
        raise _http(exc) from exc


@router.delete(
    "/{rule_id}",
    dependencies=[Depends(require_permission_codes("kuaiplm:lab-judgment-rule:delete"))],
)
async def delete_rule(
    rule_id: int,
    tenant_id: int = Depends(get_current_tenant),
    current_user: User = Depends(get_current_user),
):
    try:
        await service.delete(tenant_id, rule_id, current_user)
        return {"success": True}
    except Exception as exc:
        raise _http(exc) from exc
