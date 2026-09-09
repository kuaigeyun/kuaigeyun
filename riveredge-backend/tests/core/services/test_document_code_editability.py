from core.services.document_code_editability import resolve_document_code_editable


def test_draft_with_downstream_editable():
    ok, reason = resolve_document_code_editable(is_draft=True, has_downstream=True)
    assert ok is True
    assert reason is None


def test_non_draft_with_downstream_locked():
    ok, reason = resolve_document_code_editable(is_draft=False, has_downstream=True)
    assert ok is False
    assert reason == "document_code.has_downstream"


def test_non_draft_without_downstream_editable():
    ok, reason = resolve_document_code_editable(is_draft=False, has_downstream=False)
    assert ok is True
    assert reason is None


def test_manual_edit_disabled():
    ok, reason = resolve_document_code_editable(
        is_draft=True,
        has_downstream=False,
        allow_manual_edit=False,
    )
    assert ok is False
    assert reason == "document_code.manual_edit_disabled"
