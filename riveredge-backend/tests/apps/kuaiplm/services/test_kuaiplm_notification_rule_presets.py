"""快研发消息提醒预设测试。"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from apps.kuaiplm.services.kuaiplm_business_notification import (
    ACTION_LAB_REPORT_APPROVED,
    ACTION_LAB_REPORT_REJECTED,
    ACTION_LAB_REPORT_SUBMITTED,
    ACTION_TRIAL_APPROVAL_OVERDUE,
    ACTION_TRIAL_STEP_OVERDUE,
    TRIGGER_LAB_REQUEST,
    TRIGGER_TRIAL_FLOW,
)
from apps.kuaiplm.services.kuaiplm_notification_rule_presets import (
    KUAIPLM_NOTIFICATION_RULE_PRESETS,
    load_kuaiplm_notification_rule_presets,
)


def test_presets_cover_trial_and_lab_report_actions():
    pairs = {
        (str(p["trigger_document"]), str(p["trigger_action"]))
        for p in KUAIPLM_NOTIFICATION_RULE_PRESETS
    }
    assert (TRIGGER_TRIAL_FLOW, ACTION_TRIAL_APPROVAL_OVERDUE) in pairs
    assert (TRIGGER_TRIAL_FLOW, ACTION_TRIAL_STEP_OVERDUE) in pairs
    assert (TRIGGER_LAB_REQUEST, ACTION_LAB_REPORT_SUBMITTED) in pairs
    assert (TRIGGER_LAB_REQUEST, ACTION_LAB_REPORT_APPROVED) in pairs
    assert (TRIGGER_LAB_REQUEST, ACTION_LAB_REPORT_REJECTED) in pairs


@pytest.mark.asyncio
async def test_load_presets_creates_rules_when_empty():
    with patch(
        "apps.kuaiplm.services.kuaiplm_notification_rule_presets.MessageTemplateService.load_preset_sme",
        new_callable=AsyncMock,
        return_value=5,
    ), patch(
        "apps.kuaiplm.services.kuaiplm_notification_rule_presets.BusinessConfigService"
    ) as cfg_cls, patch(
        "apps.kuaiplm.services.kuaiplm_notification_rule_presets._template_uuid_by_code",
        new_callable=AsyncMock,
        return_value="tpl-uuid-1",
    ), patch(
        "apps.kuaiplm.services.kuaiplm_notification_rule_presets._rule_template_ref_invalid",
        new_callable=AsyncMock,
        return_value=False,
    ):
        cfg = cfg_cls.return_value
        cfg.get_business_config = AsyncMock(return_value={"parameters": {}})
        cfg.batch_update_process_parameters = AsyncMock()
        result = await load_kuaiplm_notification_rule_presets(1)
        assert result["created"] == 5
        cfg.batch_update_process_parameters.assert_awaited_once()
        saved = cfg.batch_update_process_parameters.await_args.args[1]
        rules = saved["notifications"]["rules"]
        assert len(rules) == 5
        assert rules[0]["trigger_document"] == TRIGGER_TRIAL_FLOW
