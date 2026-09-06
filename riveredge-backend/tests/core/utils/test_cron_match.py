"""INF-03：标准 cron 匹配。"""

from datetime import datetime

import pytest

from core.utils.cron_match import assert_cron_valid, match_cron


def test_match_every_minute():
    now = datetime(2026, 9, 5, 10, 7, 0)
    assert match_cron("* * * * *", now)


def test_match_step_minutes():
    now = datetime(2026, 9, 5, 10, 10, 0)
    assert match_cron("*/5 * * * *", now)
    assert not match_cron("*/5 * * * *", datetime(2026, 9, 5, 10, 11, 0))


def test_match_weekday_monday():
    # 2026-09-07 是周一 → cron weekday=1
    monday = datetime(2026, 9, 7, 9, 0, 0)
    assert match_cron("0 9 * * 1", monday)
    assert not match_cron("0 9 * * 1", datetime(2026, 9, 8, 9, 0, 0))


def test_match_range_and_list():
    now = datetime(2026, 9, 5, 8, 30, 0)
    assert match_cron("30 8-9 * 9 0,5,6", now)


def test_invalid_cron_returns_false():
    assert not match_cron("bad", datetime(2026, 9, 5, 8, 0, 0))


def test_assert_cron_valid():
    assert_cron_valid("0 9 * * 1")
    with pytest.raises(ValueError):
        assert_cron_valid("0 9 *")
