"""R-01 / INF-05：体系文件版本可见与升版号。"""

from apps.kuaizhizao.services.quality_qms_service import _bump_version, _version_policy_row
from core.services.file.document_version_policy import (
    DocumentVersionAudience,
    filter_version_rows,
    resolve_audience,
)


def test_bump_version_alpha_numeric():
    assert _bump_version("A0") == "A1"
    assert _bump_version("B12") == "B13"
    assert _bump_version("rev") == "rev.1"


def test_qms_version_rows_respect_inf05_consumer():
    rows = [
        _version_policy_row(
            type("V", (), {"id": 1, "document_id": 9, "document_code": "D1", "version": "A0", "status": "obsolete", "is_effective": False, "title": "t", "created_by": 1})()
        ),
        _version_policy_row(
            type("V", (), {"id": 2, "document_id": 9, "document_code": "D1", "version": "A1", "status": "effective", "is_effective": True, "title": "t", "created_by": 1})()
        ),
        _version_policy_row(
            type("V", (), {"id": 3, "document_id": 9, "document_code": "D1", "version": "A2", "status": "rejected", "is_effective": False, "title": "t", "created_by": 1})()
        ),
        _version_policy_row(
            type("V", (), {"id": 4, "document_id": 9, "document_code": "D1", "version": "A3", "status": "draft", "is_effective": False, "title": "t", "created_by": 1})()
        ),
    ]
    out = filter_version_rows(rows, audience=DocumentVersionAudience.CONSUMER)
    assert [r["version"] for r in out] == ["A1"]


def test_rejected_version_never_in_any_audience_history():
    """INF-05：驳回版本永不进履历目录（含全局总查看）。"""
    rows = [
        {"version": "A0", "status": "obsolete", "is_effective": False},
        {"version": "A1", "status": "effective", "is_effective": True},
        {"version": "A2", "status": "rejected"},
        {"version": "A3", "status": "draft", "created_by": 9},
    ]
    for audience in (
        DocumentVersionAudience.CONSUMER,
        DocumentVersionAudience.AUTHOR,
        DocumentVersionAudience.GLOBAL_VIEWER,
    ):
        out = filter_version_rows(rows, audience=audience, current_user_id=9)
        assert "A2" not in [r["version"] for r in out]


def test_global_viewer_sees_non_rejected_history():
    audience = resolve_audience(permission_codes=["system:document-global-view:read"])
    assert audience == DocumentVersionAudience.GLOBAL_VIEWER
    rows = [
        {"version": "A0", "status": "obsolete", "is_effective": False},
        {"version": "A1", "status": "effective", "is_effective": True},
        {"version": "A2", "status": "rejected"},
        {"version": "A3", "status": "draft", "created_by": 9},
    ]
    out = filter_version_rows(rows, audience=audience, current_user_id=1)
    assert [r["version"] for r in out] == ["A0", "A1", "A3"]
