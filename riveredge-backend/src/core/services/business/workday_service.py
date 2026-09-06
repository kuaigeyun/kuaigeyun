"""工作日判定（INF-03）：唯一读取主数据假期与工作日历，禁止业务硬写周末。"""

from __future__ import annotations

from datetime import date, timedelta

from core.utils.timezone_utils import to_site_date, resolve_business_datetime


async def is_workday(tenant_id: int, day: date) -> bool:
    """是否为工作日（排除主数据假期；周休规则由假期导入/工作日历配置决定）。"""
    from apps.kuaizhizao.utils.work_calendar import load_holiday_dates

    holidays = await load_holiday_dates(tenant_id, day, day)
    return day not in holidays


async def next_workday(tenant_id: int, day: date, *, max_lookahead: int = 30) -> date:
    """从 day 起（含）找下一个工作日；节假日顺延。"""
    cursor = day
    for _ in range(max_lookahead + 1):
        if await is_workday(tenant_id, cursor):
            return cursor
        cursor = cursor + timedelta(days=1)
    raise RuntimeError(f"在 {max_lookahead} 天内未找到工作日（tenant={tenant_id}, from={day})")


async def shift_by_workdays(tenant_id: int, start: date, offset_days: int) -> date:
    """按工作日偏移（offset_days>0 向后，<0 向前）。"""
    if offset_days == 0:
        return await next_workday(tenant_id, start)
    step = 1 if offset_days > 0 else -1
    remaining = abs(offset_days)
    cursor = start
    while remaining > 0:
        cursor = cursor + timedelta(days=step)
        if await is_workday(tenant_id, cursor):
            remaining -= 1
    return cursor


def today_site_date() -> date:
    return to_site_date(resolve_business_datetime())
