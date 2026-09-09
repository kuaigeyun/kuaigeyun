"""document_code_page_registry 与 document_code_service 单元测试。"""

from core.config.document_code_page_registry import (
    PAGE_CODE_TO_DOCUMENT_TYPE,
    resolve_document_code_page_entry,
)
from core.services.document_code_editability import (
    REASON_HAS_DOWNSTREAM,
    REASON_MANUAL_EDIT_DISABLED,
    resolve_document_code_editable,
)


def test_resolve_document_code_page_entry_sales_order():
    entry = resolve_document_code_page_entry("kuaizhizao-sales-order")
    assert entry is not None
    assert entry.code_field == "order_code"
    assert entry.document_type == "sales_order"


def test_resolve_document_code_page_entry_unknown():
    assert resolve_document_code_page_entry("non-existent-page") is None


def test_page_code_document_type_coverage_for_major_docs():
    for page_code in (
        "kuaizhizao-sales-order",
        "kuaizhizao-purchase-order",
        "kuaizhizao-purchase-requisition",
        "kuaizhizao-production-work-order",
    ):
        assert page_code in PAGE_CODE_TO_DOCUMENT_TYPE


def test_resolve_document_code_editable_matrix():
    ok, reason = resolve_document_code_editable(
        is_draft=True,
        has_downstream=True,
        allow_manual_edit=True,
    )
    assert ok is True
    assert reason is None

    ok, reason = resolve_document_code_editable(
        is_draft=False,
        has_downstream=True,
        allow_manual_edit=True,
    )
    assert ok is False
    assert reason == REASON_HAS_DOWNSTREAM

    ok, reason = resolve_document_code_editable(
        is_draft=False,
        has_downstream=False,
        allow_manual_edit=False,
    )
    assert ok is False
    assert reason == REASON_MANUAL_EDIT_DISABLED
