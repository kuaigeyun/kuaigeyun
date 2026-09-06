"""industry_extensions 解析与槽位冲突。"""

from core.config.industry_extension_registry import (
    assert_no_replace_slot_conflict,
    parse_industry_extensions,
)


def test_parse_electronics_style_extensions():
    manifest = {
        "industry_extensions": [
            {
                "id": "electronics.sample_process",
                "kind": "replace",
                "strategy": "profile",
                "host_app": "kuaiplm",
                "menu_path": "/apps/kuaiplm/sample-process-applications",
                "resource": "kuaiplm:sample-process",
                "profile_key": "kuaiplm.sample_process",
            },
            {"id": "electronics.esd", "kind": "standalone"},
        ]
    }
    decls = parse_industry_extensions("kuaielectronics", manifest)
    assert len(decls) == 2
    assert decls[0].strategy == "profile"
    assert decls[1].kind == "standalone"


def test_standalone_rejects_host_fields():
    try:
        parse_industry_extensions(
            "bad",
            {
                "industry_extensions": [
                    {
                        "id": "x",
                        "kind": "standalone",
                        "host_app": "kuaiplm",
                    }
                ]
            },
        )
        assert False, "expected ValueError"
    except ValueError as e:
        assert "standalone" in str(e)


def test_parse_document_replacement_extension():
    decls = parse_industry_extensions(
        "kuaielectronics",
        {
            "industry_extensions": [
                {
                    "id": "electronics.label_oem",
                    "kind": "replace",
                    "strategy": "document",
                    "host_app": "kuaizhizao",
                    "menu_path": "/apps/kuaizhizao/production-execution/label-station",
                    "resource": "kuaizhizao:label-station",
                    "replacement_app": "kuaielectronics",
                    "replacement_path": "/apps/kuaielectronics/label-oem",
                }
            ]
        },
    )
    assert len(decls) == 1
    assert decls[0].strategy == "document"
    assert decls[0].replacement_path == "/apps/kuaielectronics/label-oem"


def test_document_replacement_payload():
    from core.config.industry_extension_registry import document_replacement_payload

    decls = parse_industry_extensions(
        "kuaielectronics",
        {
            "industry_extensions": [
                {
                    "id": "electronics.label_oem",
                    "kind": "replace",
                    "strategy": "document",
                    "host_app": "kuaizhizao",
                    "menu_path": "/apps/kuaizhizao/production-execution/label-station",
                    "resource": "kuaizhizao:label-station",
                    "replacement_app": "kuaielectronics",
                    "replacement_path": "/apps/kuaielectronics/label-oem",
                }
            ]
        },
    )
    payload = document_replacement_payload(decls[0])
    assert payload["extension_id"] == "electronics.label_oem"
    assert payload["host_app"] == "kuaizhizao"


def test_replace_slot_conflict():
    a = parse_industry_extensions(
        "a",
        {
            "industry_extensions": [
                {
                    "id": "a.sample",
                    "kind": "replace",
                    "strategy": "profile",
                    "host_app": "kuaiplm",
                    "menu_path": "/apps/kuaiplm/sample-process-applications",
                    "resource": "kuaiplm:sample-process",
                    "profile_key": "kuaiplm.sample_process",
                }
            ]
        },
    )
    b = parse_industry_extensions(
        "b",
        {
            "industry_extensions": [
                {
                    "id": "b.sample",
                    "kind": "replace",
                    "strategy": "profile",
                    "host_app": "kuaiplm",
                    "menu_path": "/apps/kuaiplm/sample-process-applications",
                    "resource": "kuaiplm:sample-process",
                    "profile_key": "kuaiplm.sample_process",
                }
            ]
        },
    )
    try:
        assert_no_replace_slot_conflict(a + b)
        assert False, "expected conflict"
    except ValueError as e:
        assert "替代冲突" in str(e)
