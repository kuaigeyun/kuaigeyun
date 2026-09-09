"""
单据编号可编辑性（全站统一规则）

规则：仅当「草稿」或「无下游单据」时允许修改编号；否则锁定。
编号规则页的 allow_manual_edit 仅控制是否允许手填/改号，不替代下游门禁。
"""

from __future__ import annotations

from typing import Optional, Tuple

REASON_HAS_DOWNSTREAM = "document_code.has_downstream"
REASON_MANUAL_EDIT_DISABLED = "document_code.manual_edit_disabled"
REASON_CODE_REQUIRED = "document_code.required"
REASON_CODE_DUPLICATE = "document_code.duplicate"


def resolve_document_code_editable(
    *,
    is_draft: bool,
    has_downstream: bool,
    allow_manual_edit: bool = True,
) -> Tuple[bool, Optional[str]]:
    """返回 (可编辑, 锁定原因码)。"""
    if not allow_manual_edit:
        return False, REASON_MANUAL_EDIT_DISABLED
    if is_draft or not has_downstream:
        return True, None
    return False, REASON_HAS_DOWNSTREAM
