"""固定资产导入模板列定义（与前端新增资产表单字段一致）。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

FA_ASSET_IMPORT_HEADERS: List[str] = [
    "资产编号",
    "资产名称",
    "资产类别",
    "变动方式",
    "数量",
    "计量单位",
    "预计使用期间数",
    "使用部门",
    "使用人",
    "使用状态",
    "存放地点",
    "开始使用日期",
    "入账日期",
    "规格型号",
    "备注",
    "折旧方法",
    "原值",
    "减值准备",
    "已折旧期间数",
    "累计折旧",
    "净残值率",
    "累计折旧科目",
    "折旧费用科目",
    "固定资产科目",
]

HEADER_FIELD_ALIASES: Dict[str, str] = {
    "资产编号": "asset_code",
    "资产名称": "asset_name",
    "资产类别": "category_name",
    "类别": "category_name",
    "变动方式": "change_method",
    "数量": "quantity",
    "计量单位": "unit",
    "单位": "unit",
    "预计使用期间数": "useful_life_months",
    "使用月数": "useful_life_months",
    "预计折旧期间数": "useful_life_months",
    "使用部门": "department_name",
    "使用人": "user_name",
    "使用状态": "status",
    "状态": "status",
    "存放地点": "location",
    "开始使用日期": "start_use_date",
    "入账日期": "entry_date",
    "规格型号": "specification",
    "备注": "notes",
    "折旧方法": "depreciation_method",
    "原值": "original_value",
    "减值准备": "impairment_value",
    "已折旧期间数": "depreciated_periods",
    "累计折旧": "accumulated_depreciation",
    "净残值率": "residual_rate",
    "残值率": "residual_rate",
    "累计折旧科目": "accumulated_depreciation_account_code",
    "折旧费用科目": "expense_account_code",
    "固定资产科目": "asset_account_code",
}

STATUS_LABEL_TO_CODE = {
    "在用": "active",
    "闲置": "idle",
    "已清理": "disposed",
    "已报废": "scrapped",
    "active": "active",
    "idle": "idle",
    "disposed": "disposed",
    "scrapped": "scrapped",
}

DEPRECIATION_LABEL_TO_CODE = {
    "年限平均法": "straight_line",
    "直线法": "straight_line",
    "straight_line": "straight_line",
}


def resolve_header_index_map(headers: List[Any]) -> Dict[str, int]:
    index_map: Dict[str, int] = {}
    for idx, raw in enumerate(headers):
        key = str(raw or "").strip().lstrip("*")
        field = HEADER_FIELD_ALIASES.get(key)
        if field and field not in index_map:
            index_map[field] = idx
    return index_map


def _cell(row: tuple[Any, ...], index_map: Dict[str, int], field: str) -> str:
    idx = index_map.get(field)
    if idx is None or idx >= len(row):
        return ""
    return str(row[idx]).strip() if row[idx] is not None else ""


def _parse_residual_rate(raw: str) -> Optional[float]:
    if not raw:
        return None
    if raw.endswith("%"):
        try:
            return float(raw[:-1]) / 100
        except ValueError:
            return None
    try:
        val = float(raw)
    except ValueError:
        return None
    return val / 100 if val > 1 else val


def row_to_create_payload(row: tuple[Any, ...], index_map: Dict[str, int]) -> Dict[str, Any]:
    status_raw = _cell(row, index_map, "status")
    depr_raw = _cell(row, index_map, "depreciation_method")
    residual_raw = _cell(row, index_map, "residual_rate")
    payload: Dict[str, Any] = {
        "asset_code": _cell(row, index_map, "asset_code") or None,
        "asset_name": _cell(row, index_map, "asset_name"),
        "category_name": _cell(row, index_map, "category_name"),
        "change_method": _cell(row, index_map, "change_method") or "import",
        "quantity": _cell(row, index_map, "quantity") or 1,
        "unit": _cell(row, index_map, "unit") or None,
        "useful_life_months": _cell(row, index_map, "useful_life_months") or None,
        "department_name": _cell(row, index_map, "department_name") or None,
        "user_name": _cell(row, index_map, "user_name") or None,
        "status": STATUS_LABEL_TO_CODE.get(status_raw, status_raw or "active"),
        "location": _cell(row, index_map, "location") or None,
        "start_use_date": _cell(row, index_map, "start_use_date")[:10] or None,
        "entry_date": _cell(row, index_map, "entry_date")[:10] or None,
        "specification": _cell(row, index_map, "specification") or None,
        "notes": _cell(row, index_map, "notes") or None,
        "depreciation_method": DEPRECIATION_LABEL_TO_CODE.get(depr_raw, depr_raw or "straight_line"),
        "original_value": _cell(row, index_map, "original_value") or 0,
        "impairment_value": _cell(row, index_map, "impairment_value") or 0,
        "depreciated_periods": _cell(row, index_map, "depreciated_periods") or 0,
        "accumulated_depreciation": _cell(row, index_map, "accumulated_depreciation") or 0,
        "accumulated_depreciation_account_code": _cell(row, index_map, "accumulated_depreciation_account_code")
        or None,
        "expense_account_code": _cell(row, index_map, "expense_account_code") or None,
        "asset_account_code": _cell(row, index_map, "asset_account_code") or None,
    }
    parsed_residual = _parse_residual_rate(residual_raw)
    if parsed_residual is not None:
        payload["residual_rate"] = parsed_residual
    return payload
