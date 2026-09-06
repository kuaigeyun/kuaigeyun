"""标准 5 段 cron 匹配（INF-03）。

支持：``*``、单值、列表 ``1,2,5``、区间 ``1-5``、步长 ``*/5`` / ``1-10/2``。
星期：0=周日 … 6=周六（与常见 crontab 一致）。
不保留旧的「仅精确数字」简化匹配。
"""

from __future__ import annotations

from datetime import datetime
from typing import Set


def _parse_field(expr: str, minimum: int, maximum: int) -> Set[int]:
    text = (expr or "").strip()
    if not text:
        raise ValueError("cron 字段为空")
    values: Set[int] = set()
    for part in text.split(","):
        token = part.strip()
        if not token:
            raise ValueError(f"非法 cron 片段: {part!r}")
        if "/" in token:
            base, step_s = token.split("/", 1)
            step = int(step_s)
            if step <= 0:
                raise ValueError(f"非法 cron 步长: {token!r}")
        else:
            base, step = token, 1

        if base == "*":
            start, end = minimum, maximum
        elif "-" in base:
            a, b = base.split("-", 1)
            start, end = int(a), int(b)
        else:
            start = end = int(base)

        if start > end or start < minimum or end > maximum:
            raise ValueError(f"cron 字段越界: {token!r} 允许 {minimum}-{maximum}")
        values.update(range(start, end + 1, step))
    return values


def match_cron(cron_expr: str, now: datetime) -> bool:
    """判断 ``now``（应用站点墙钟或调度传入时刻）是否命中 5 段 cron。"""
    parts = (cron_expr or "").strip().split()
    if len(parts) != 5:
        return False
    try:
        minute_s, hour_s, day_s, month_s, weekday_s = parts
        if now.minute not in _parse_field(minute_s, 0, 59):
            return False
        if now.hour not in _parse_field(hour_s, 0, 23):
            return False
        if now.month not in _parse_field(month_s, 1, 12):
            return False

        day_values = _parse_field(day_s, 1, 31)
        # Python: Monday=0 … Sunday=6 → cron: Sunday=0 … Saturday=6
        cron_weekday = (now.weekday() + 1) % 7
        weekday_values = _parse_field(weekday_s, 0, 6)

        day_star = day_s.strip() == "*"
        weekday_star = weekday_s.strip() == "*"
        day_ok = now.day in day_values
        weekday_ok = cron_weekday in weekday_values

        if day_star and weekday_star:
            return True
        if day_star:
            return weekday_ok
        if weekday_star:
            return day_ok
        # 两者都指定时：OR（标准 crontab 行为）
        return day_ok or weekday_ok
    except Exception:
        return False


def assert_cron_valid(cron_expr: str) -> None:
    parts = (cron_expr or "").strip().split()
    if len(parts) != 5:
        raise ValueError("cron 必须为 5 段：分 时 日 月 周")
    _parse_field(parts[0], 0, 59)
    _parse_field(parts[1], 0, 23)
    _parse_field(parts[2], 1, 31)
    _parse_field(parts[3], 1, 12)
    _parse_field(parts[4], 0, 6)
