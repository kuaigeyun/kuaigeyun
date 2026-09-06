from core.config.industry_pack import (
    INDUSTRY_PACK_APP_CODE,
    is_industry_module_app_code,
    is_industry_pack_shell_code,
    manifest_to_industry_pack_menu_item,
    resolve_industry_pack_navigation_visible,
)


def test_resolve_industry_pack_navigation_visible_requires_active_modules() -> None:
    assert resolve_industry_pack_navigation_visible(
        is_installed=True,
        active_module_count=0,
    ) is False
    assert resolve_industry_pack_navigation_visible(
        is_installed=True,
        active_module_count=1,
    ) is True
    assert resolve_industry_pack_navigation_visible(
        is_installed=False,
        active_module_count=1,
    ) is False


def test_manifest_module_group_has_no_path_when_children_exist() -> None:
    item = manifest_to_industry_pack_menu_item(
        {
            "code": "kuaielectronics",
            "route_path": "/apps/kuaielectronics",
            "icon": "cpu",
            "sort_order": 310,
            "industry_pack_menu": {
                "children": [
                    {
                        "title": "app.kuaielectronics.menu.esdDashboard",
                        "path": "/apps/kuaielectronics/esd/dashboard",
                        "permission": "kuaielectronics:esd:read",
                        "sort_order": 1,
                    }
                ]
            },
        }
    )
    assert item is not None
    assert item["path"] is None
    assert item["icon"] == "cpu"
    assert item["title"] == "app.kuaielectronics.name"
    assert item["children"][0]["path"] == "/apps/kuaielectronics/esd/dashboard"
