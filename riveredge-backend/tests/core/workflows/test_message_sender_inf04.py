"""INF-04：业务邮件必须使用渲染后的主题/正文，短信禁止模拟成功。"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from core.workflows.functions import message_sender


@pytest.mark.asyncio
async def test_send_email_uses_business_subject_and_content():
    config = MagicMock()
    config.config = {"smtp_host": "h", "smtp_username": "u", "smtp_password": "p"}

    with patch(
        "core.workflows.functions.message_sender.MessageConfigService.get_message_config_by_uuid",
        new_callable=AsyncMock,
        return_value=config,
    ), patch(
        "core.workflows.functions.message_sender.MessageConfigService._send_email",
        new_callable=AsyncMock,
        return_value=(True, "ok", None),
    ) as send_email:
        result = await message_sender._send_email(
            1, "cfg-uuid", "a@b.com", "交期延误提醒", "订单 SO001 已延误"
        )
    assert result["success"] is True
    send_email.assert_awaited_once_with(
        config.config,
        "a@b.com",
        subject="交期延误提醒",
        content="订单 SO001 已延误",
    )


@pytest.mark.asyncio
async def test_send_sms_fails_without_real_provider():
    config = MagicMock()
    config.config = {"provider": "mock"}

    with patch(
        "core.workflows.functions.message_sender.MessageConfigService.get_message_config_by_uuid",
        new_callable=AsyncMock,
        return_value=config,
    ):
        result = await message_sender._send_sms(1, "cfg-uuid", "13800000000", "正文")
    assert result["success"] is False
    assert "禁止模拟成功" in (result.get("error") or "")


@pytest.mark.asyncio
async def test_send_sms_fails_when_provider_adapter_missing():
    config = MagicMock()
    config.config = {"provider": "aliyun"}

    with patch(
        "core.workflows.functions.message_sender.MessageConfigService.get_message_config_by_uuid",
        new_callable=AsyncMock,
        return_value=config,
    ):
        result = await message_sender._send_sms(1, "cfg-uuid", "13800000000", "正文")
    assert result["success"] is False
    assert "尚未实现" in (result.get("error") or "")
