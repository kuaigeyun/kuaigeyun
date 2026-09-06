"""标签工位扫码校验链扩展点（行业包可注册钩子，禁止在通用层写客户规则）。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Awaitable, Callable, Dict, List, Optional

from infra.exceptions.exceptions import BusinessLogicError

ValidatorFn = Callable[..., Awaitable[None]]


@dataclass
class LabelScanContext:
    tenant_id: int
    barcode: str
    model_code: str
    session_id: int
    station_id: int
    box_id: Optional[int]
    hooks: List[str]


_VALIDATORS: Dict[str, ValidatorFn] = {}


def register_label_scan_validator(code: str, fn: ValidatorFn) -> None:
    key = (code or "").strip()
    if not key:
        raise ValueError("校验钩子 code 不能为空")
    _VALIDATORS[key] = fn


async def run_label_scan_validators(ctx: LabelScanContext) -> None:
    for code in ctx.hooks or []:
        key = str(code or "").strip()
        if not key:
            continue
        fn = _VALIDATORS.get(key)
        if not fn:
            raise BusinessLogicError(f"未注册的标签校验钩子: {key}")
        await fn(ctx)


async def _builtin_reject_empty(ctx: LabelScanContext) -> None:
    if not (ctx.barcode or "").strip():
        raise BusinessLogicError("条码不能为空")


register_label_scan_validator("builtin.reject_empty", _builtin_reject_empty)
