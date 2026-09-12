"""凭证号前缀、序号解析与整理排序（无 ORM 依赖）。"""

from __future__ import annotations

from typing import Any, List


def voucher_code_prefix(voucher_word: str, year: int, month: int) -> str:
    return f"{voucher_word or '记'}{year:04d}{month:02d}"


def parse_voucher_sequence(voucher_code: str, prefix: str) -> int:
    if not voucher_code.startswith(prefix):
        return 999_999
    suffix = voucher_code[len(prefix) :]
    if len(suffix) < 4 or not suffix[:4].isdigit():
        return 999_999
    return int(suffix[:4])


def build_voucher_code(prefix: str, seq: int) -> str:
    return f"{prefix}{seq:04d}"


def order_vouchers_for_reorganize(
    vouchers: List[Any],
    *,
    prefix: str,
    method: str,
) -> List[Any]:
    if method == "by_date":
        return sorted(vouchers, key=lambda v: (v.voucher_date, v.id))
    return sorted(
        vouchers,
        key=lambda v: (parse_voucher_sequence(v.voucher_code, prefix), v.id),
    )
