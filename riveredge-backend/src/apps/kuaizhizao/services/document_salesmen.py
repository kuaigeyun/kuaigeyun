"""销售单据列表：从当前可见单据中汇总销售人员选项。"""

from __future__ import annotations

from typing import Any


async def collect_document_salesmen(query) -> list[dict[str, Any]]:
    """从已应用数据范围的 QuerySet 中提取去重销售人员。

    仅包含有 salesman_id 的单据；同 ID 多名称时优先非空姓名。
    """
    rows = (
        await query.filter(salesman_id__isnull=False)
        .exclude(salesman_id=0)
        .group_by("salesman_id", "salesman_name")
        .values("salesman_id", "salesman_name")
    )
    by_id: dict[int, str] = {}
    for row in rows:
        raw_id = row.get("salesman_id")
        if raw_id is None:
            continue
        sid = int(raw_id)
        name = str(row.get("salesman_name") or "").strip()
        prev = by_id.get(sid)
        if prev is None or (not prev and name):
            by_id[sid] = name
    return [
        {"id": sid, "name": name}
        for sid, name in sorted(by_id.items(), key=lambda item: ((item[1] or "").casefold(), item[0]))
    ]
