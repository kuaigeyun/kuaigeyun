"""自组菜单布局校验单元测试。"""

import asyncio
from unittest.mock import AsyncMock, patch

import pytest

from core.schemas.menu import CustomMenuLayoutNode
from core.services.system.menu_service import MenuService
from infra.exceptions.exceptions import ValidationError


def _mock_source_lookup() -> dict:
    source_tree = MenuService._collect_menu_tree_lookup([])  # noqa: SLF001
    # 直接注入最小源菜单映射；仅校验 UUID 存在性与 path 一致性
    source_tree["menu-1"] = type("Node", (), {"path": "/apps/a/b"})()
    source_tree["menu-2"] = type("Node", (), {"path": "/apps/a/c"})()
    return source_tree


def test_custom_layout_duplicate_node_id_rejected():
    nodes = [
        CustomMenuLayoutNode(
            id="grp-1",
            type="custom_group",
            title="分组A",
            children=[
                CustomMenuLayoutNode(id="dup", type="menu_ref", menu_uuid="menu-1"),
            ],
        ),
        CustomMenuLayoutNode(
            id="grp-2",
            type="custom_group",
            title="分组B",
            children=[
                CustomMenuLayoutNode(id="dup", type="menu_ref", menu_uuid="menu-2"),
            ],
        ),
    ]
    with pytest.raises(ValidationError):
        asyncio.run(
            MenuService._validate_custom_menu_layout_nodes(  # noqa: SLF001
                1, nodes, _mock_source_lookup()
            )
        )


def test_custom_layout_missing_menu_ref_rejected():
    nodes = [
        CustomMenuLayoutNode(
            id="grp-1",
            type="app_group",
            title="应用组",
            children=[
                CustomMenuLayoutNode(id="ref-1", type="menu_ref", menu_uuid="menu-x"),
            ],
        ),
    ]
    with patch.object(
        MenuService,
        "_resolve_active_menu_ref_paths",
        new=AsyncMock(return_value={}),
    ):
        with pytest.raises(ValidationError):
            asyncio.run(
                MenuService._validate_custom_menu_layout_nodes(  # noqa: SLF001
                    1, nodes, _mock_source_lookup()
                )
            )


def test_custom_layout_path_mismatch_rejected():
    nodes = [
        CustomMenuLayoutNode(
            id="grp-1",
            type="app_group",
            title="应用组",
            children=[
                CustomMenuLayoutNode(
                    id="ref-1",
                    type="menu_ref",
                    menu_uuid="menu-1",
                    menu_path="/apps/a/wrong",
                ),
            ],
        ),
    ]
    with pytest.raises(ValidationError):
        asyncio.run(
            MenuService._validate_custom_menu_layout_nodes(  # noqa: SLF001
                1, nodes, _mock_source_lookup()
            )
        )


def test_custom_layout_db_fallback_path_accepted():
    """树中不可达但库内仍启用的菜单，应能通过校验。"""
    nodes = [
        CustomMenuLayoutNode(
            id="grp-1",
            type="app_group",
            title="应用组",
            children=[
                CustomMenuLayoutNode(
                    id="ref-1",
                    type="menu_ref",
                    menu_uuid="menu-orphan",
                    menu_path="/apps/a/orphan",
                ),
            ],
        ),
    ]
    with patch.object(
        MenuService,
        "_resolve_active_menu_ref_paths",
        new=AsyncMock(return_value={"menu-orphan": "/apps/a/orphan"}),
    ):
        asyncio.run(
            MenuService._validate_custom_menu_layout_nodes(  # noqa: SLF001
                1, nodes, _mock_source_lookup()
            )
        )


def test_normalize_custom_menu_layout_keeps_disabled_when_menu_refs_exist():
    raw = {
        "enabled": False,
        "show_app_names": True,
        "version": 3,
        "nodes": [
            {
                "id": "app-1",
                "type": "app_group",
                "title": "快制造",
                "children": [
                    {
                        "id": "purchase",
                        "type": "custom_group",
                        "title": "采购管理",
                        "children": [
                            {
                                "id": "mrp",
                                "type": "menu_ref",
                                "menu_uuid": "menu-mrp",
                                "menu_path": "/apps/kuaizhizao/plan-management/demand-computation",
                                "children": [],
                            }
                        ],
                    }
                ],
            }
        ],
    }
    normalized = MenuService._normalize_custom_menu_layout(raw)  # noqa: SLF001
    assert normalized["enabled"] is False
    assert normalized["version"] == 3
    assert len(normalized["nodes"]) == 1


def test_normalize_custom_menu_layout_stays_disabled_without_menu_refs():
    raw = {
        "enabled": False,
        "nodes": [{"id": "g1", "type": "custom_group", "title": "空分组", "children": []}],
    }
    normalized = MenuService._normalize_custom_menu_layout(raw)  # noqa: SLF001
    assert normalized["enabled"] is False


def test_normalize_custom_menu_layout_respects_explicit_enabled():
    raw = {
        "enabled": True,
        "nodes": [
            {
                "id": "m1",
                "type": "menu_ref",
                "menu_uuid": "menu-1",
                "children": [],
            }
        ],
    }
    normalized = MenuService._normalize_custom_menu_layout(raw)  # noqa: SLF001
    assert normalized["enabled"] is True


def test_update_custom_menu_layout_source_keeps_disabled_with_menu_refs():
    """保存路径不得因存在 menu_ref 把 enabled 强制改回 True（源码契约）。"""
    src = open(
        "src/core/services/system/menu_service.py", encoding="utf-8"
    ).read()
    # 定位 update_custom_menu_layout 函数体片段
    start = src.index("async def update_custom_menu_layout")
    end = src.index("async def create_menu", start)
    body = src[start:end]
    assert "layout_enabled = True" not in body
    assert "layout_enabled = bool(data.enabled)" in body
    # 关闭启用时不得走 menu_ref 存在性校验，否则同步后关不掉
    assert "if layout_enabled:" in body
    assert "_validate_custom_menu_layout_nodes" in body


def test_sync_all_menus_never_writes_custom_menu_layout():
    """一键同步菜单不得写自组布局键（源码契约）。"""
    src = open(
        "src/core/services/system/menu_service.py", encoding="utf-8"
    ).read()
    start = src.index("async def sync_all_menus_from_applications")
    end = src.find("\n    async def ", start + 10)
    if end < 0:
        end = len(src)
    body = src[start:end]
    assert "_CUSTOM_MENU_LAYOUT_KEY" not in body
    assert "禁止读写 custom_menu_layout" in body
    assert "update_custom_menu_layout" not in body
