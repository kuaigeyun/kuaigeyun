"""R-06：生产文件版本可见性消费 INF-05（含 PRODUCTION）。"""

from core.services.file.document_version_policy import (
    DocumentVersionAudience,
    filter_version_rows,
    resolve_audience,
)


def test_pe_production_audience_only_sees_production_effective():
    rows = [
        {
            "id": 1,
            "version": "A0",
            "status": "obsolete",
            "is_effective": False,
            "is_latest_effective": False,
            "is_production_effective": False,
            "created_by": 1,
        },
        {
            "id": 2,
            "version": "A1",
            "status": "effective",
            "is_effective": True,
            "is_latest_effective": True,
            "is_production_effective": True,
            "created_by": 1,
        },
    ]
    audience = resolve_audience(production_context=True)
    assert audience == DocumentVersionAudience.PRODUCTION
    visible = filter_version_rows(rows, audience=audience)
    assert [r["version"] for r in visible] == ["A1"]


def test_rd_author_sees_history_consumer_sees_latest_only():
    rows = [
        {
            "id": 1,
            "version": "A0",
            "status": "obsolete",
            "is_effective": False,
            "is_latest_effective": False,
            "is_production_effective": False,
            "created_by": 9,
        },
        {
            "id": 2,
            "version": "A1",
            "status": "effective",
            "is_effective": True,
            "is_latest_effective": True,
            "is_production_effective": True,
            "created_by": 9,
        },
    ]
    author = resolve_audience(is_author=True)
    consumer = resolve_audience()
    author_visible = filter_version_rows(rows, audience=author, current_user_id=9)
    consumer_visible = filter_version_rows(rows, audience=consumer)
    assert [r["version"] for r in author_visible] == ["A0", "A1"]
    assert [r["version"] for r in consumer_visible] == ["A1"]
