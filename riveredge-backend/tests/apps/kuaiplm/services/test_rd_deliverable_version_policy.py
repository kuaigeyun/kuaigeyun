"""R-01 / INF-05：研发交付物版本状态映射与可见性。"""

from apps.kuaiplm.utils.deliverable_version import (
    bump_deliverable_version,
    deliverable_version_policy_row,
    head_status_to_version_status,
)
from core.services.file.document_version_policy import (
    DocumentVersionAudience,
    filter_version_rows,
)


def test_bump_deliverable_version():
    assert bump_deliverable_version("A0") == "A1"
    assert bump_deliverable_version("B12") == "B13"
    assert bump_deliverable_version("rev") == "rev.1"


def test_head_status_to_version_status():
    assert head_status_to_version_status("PENDING") == "draft"
    assert head_status_to_version_status("SUBMITTED") == "pending"
    assert head_status_to_version_status("APPROVED") == "effective"
    assert head_status_to_version_status("REJECTED") == "rejected"


def test_deliverable_versions_consumer_hides_draft_and_rejected():
    rows = [
        deliverable_version_policy_row(
            type(
                "V",
                (),
                {
                    "id": 1,
                    "deliverable_id": 9,
                    "version": "A0",
                    "status": "obsolete",
                    "is_effective": False,
                    "created_by": 1,
                    "name": "t",
                },
            )()
        ),
        deliverable_version_policy_row(
            type(
                "V",
                (),
                {
                    "id": 2,
                    "deliverable_id": 9,
                    "version": "A1",
                    "status": "effective",
                    "is_effective": True,
                    "created_by": 1,
                    "name": "t",
                },
            )()
        ),
        deliverable_version_policy_row(
            type(
                "V",
                (),
                {
                    "id": 3,
                    "deliverable_id": 9,
                    "version": "A2",
                    "status": "rejected",
                    "is_effective": False,
                    "created_by": 1,
                    "name": "t",
                },
            )()
        ),
        deliverable_version_policy_row(
            type(
                "V",
                (),
                {
                    "id": 4,
                    "deliverable_id": 9,
                    "version": "A3",
                    "status": "draft",
                    "is_effective": False,
                    "created_by": 1,
                    "name": "t",
                },
            )()
        ),
    ]
    out = filter_version_rows(rows, audience=DocumentVersionAudience.CONSUMER)
    assert [r["version"] for r in out] == ["A1"]
