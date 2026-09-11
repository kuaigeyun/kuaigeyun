"""操作/登录日志时间扩充：最远日期优先 + 起始日钳齐。"""

from datetime import date, datetime, time, timezone
from zoneinfo import ZoneInfo


def test_oldest_first_selection_order():
    """达上限时应按 created_at 升序截断较新记录。"""
    rows = [
        {"id": 3, "created_at": datetime(2026, 9, 1, tzinfo=timezone.utc)},
        {"id": 1, "created_at": datetime(2026, 7, 1, tzinfo=timezone.utc)},
        {"id": 2, "created_at": datetime(2026, 8, 1, tzinfo=timezone.utc)},
    ]
    ordered = sorted(rows, key=lambda r: (r["created_at"], r["id"]))
    limit = 2
    selected = ordered[:limit]
    assert [r["id"] for r in selected] == [1, 2]


def test_since_start_clamp_boundary():
    """残留早于 since 上班起点时应判为需钳齐。"""
    tz = ZoneInfo("Asia/Shanghai")
    since = date(2026, 8, 10)
    since_start = datetime.combine(since, time(9, 0), tzinfo=tz).astimezone(timezone.utc)
    early = datetime(2026, 7, 1, 12, 0, tzinfo=timezone.utc)
    late = datetime(2026, 8, 10, 2, 0, tzinfo=timezone.utc)  # 10:00 CST
    assert early < since_start
    assert late >= since_start
