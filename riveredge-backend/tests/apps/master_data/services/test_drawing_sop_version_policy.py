"""R-01 / INF-05：图纸与 SOP 修订列表可见性映射。"""

from core.services.file.document_version_policy import (
    DocumentVersionAudience,
    can_view_historical_versions,
    filter_version_rows,
    resolve_audience,
)


def _drawing_policy_rows():
    """Released→effective；Obsolete→obsolete；其余→draft。"""
    rows = [
        {
            "uuid": "a",
            "revision": "A",
            "status": "obsolete",
            "is_effective": False,
            "is_latest_effective": False,
            "created_by": 1,
        },
        {
            "uuid": "b",
            "revision": "B",
            "status": "effective",
            "is_effective": True,
            "is_latest_effective": True,
            "created_by": 1,
        },
        {
            "uuid": "c",
            "revision": "C",
            "status": "draft",
            "is_effective": False,
            "is_latest_effective": False,
            "created_by": 1,
        },
        {
            "uuid": "d",
            "revision": "D",
            "status": "draft",
            "is_effective": False,
            "is_latest_effective": False,
            "created_by": 2,
        },
    ]
    return rows


def test_drawing_consumer_sees_only_effective():
    out = filter_version_rows(_drawing_policy_rows(), audience=DocumentVersionAudience.CONSUMER)
    assert [r["revision"] for r in out] == ["B"]


def test_drawing_author_sees_own_drafts_and_effective():
    out = filter_version_rows(
        _drawing_policy_rows(),
        audience=DocumentVersionAudience.AUTHOR,
        current_user_id=1,
    )
    assert [r["revision"] for r in out] == ["A", "B", "C"]


def test_drawing_global_viewer_sees_non_rejected_history():
    audience = resolve_audience(permission_codes=["system:document-global-view:read"])
    assert audience == DocumentVersionAudience.GLOBAL_VIEWER
    assert can_view_historical_versions(audience) is True
    out = filter_version_rows(_drawing_policy_rows(), audience=audience, current_user_id=9)
    assert [r["revision"] for r in out] == ["A", "B", "C", "D"]


def test_sop_consumer_hides_obsolete_history():
    rows = [
        {
            "id": 1,
            "status": "obsolete",
            "is_effective": False,
            "is_latest_effective": False,
            "created_by": 3,
        },
        {
            "id": 2,
            "status": "effective",
            "is_effective": True,
            "is_latest_effective": True,
            "created_by": 3,
        },
    ]
    out = filter_version_rows(rows, audience=DocumentVersionAudience.CONSUMER)
    assert [r["id"] for r in out] == [2]
