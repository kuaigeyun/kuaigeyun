from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest
from apps.kuaizhizao.services import sales_service as module
from core.utils.timezone_utils import site_day_bounds_utc, to_site_date


def fixture_query(monkeypatch):
    query = MagicMock()
    query.filter.return_value = query
    query.exclude.return_value = query
    query.count = AsyncMock(return_value=7)
    monkeypatch.setattr(module.SalesForecast, "filter", lambda **kw: query)
    now = datetime(2026, 9, 5, 18, tzinfo=timezone.utc)
    monkeypatch.setattr(module, "resolve_business_datetime", lambda: now)
    return query, now


@pytest.mark.asyncio
async def test_today_and_trends_count_in_site_day_boundaries(monkeypatch):
    query, now = fixture_query(monkeypatch)
    result = await module.SalesForecastService().get_forecast_statistics(1)
    assert result["today_new_count"] == 7
    assert [row["value"] for row in result["trend_today_new"]] == [7] * 7
    start, end = site_day_bounds_utc(to_site_date(now))
    assert any(call.kwargs == {"created_at__gte": start, "created_at__lt": end} for call in query.filter.call_args_list)


@pytest.mark.asyncio
async def test_failed_query_is_not_reported_as_business_zero(monkeypatch):
    query, _ = fixture_query(monkeypatch)
    query.count.side_effect = RuntimeError("fixture database unavailable")
    with pytest.raises(RuntimeError, match="fixture database unavailable"):
        await module.SalesForecastService().get_forecast_statistics(1)
