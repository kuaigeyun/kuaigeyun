"""固定资产导入模板解析。"""

from apps.kuaicaiwu.services.fa_asset_import_template import (
    FA_ASSET_IMPORT_HEADERS,
    resolve_header_index_map,
    row_to_create_payload,
)


def test_import_header_map_covers_template():
    index_map = resolve_header_index_map(FA_ASSET_IMPORT_HEADERS)
    assert index_map["asset_name"] == 1
    assert index_map["category_name"] == 2
    assert index_map["original_value"] == 16
    assert index_map["expense_account_code"] == 22


def test_row_to_create_payload_parses_status_and_residual():
    index_map = resolve_header_index_map(FA_ASSET_IMPORT_HEADERS)
    row = [
        "FA001",
        "测试设备",
        "办公设备",
        "购入",
        "2",
        "台",
        "36",
        "行政部",
        "李四",
        "在用",
        "仓库",
        "2026-09-01",
        "2026-09-01",
        "型号A",
        "备注",
        "年限平均法",
        "5000",
        "0",
        "0",
        "100",
        "5%",
        "1602",
        "6602",
        "1601",
    ]
    payload = row_to_create_payload(tuple(row), index_map)
    assert payload["asset_name"] == "测试设备"
    assert payload["status"] == "active"
    assert payload["depreciation_method"] == "straight_line"
    assert float(payload["residual_rate"]) == 0.05
