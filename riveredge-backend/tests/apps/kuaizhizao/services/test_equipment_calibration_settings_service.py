"""设备校准到期提醒配置校验。"""

import pytest

from apps.kuaizhizao.constants.equipment_calibration_settings import (
    DEFAULT_CALIBRATION_REMINDER_ADVANCE_DAYS,
)
from apps.kuaizhizao.services.equipment_calibration_settings_service import (
    validate_calibration_reminder_advance_days,
)
from infra.exceptions.exceptions import ValidationError


def test_validate_calibration_reminder_advance_days_default():
    assert validate_calibration_reminder_advance_days(None) == DEFAULT_CALIBRATION_REMINDER_ADVANCE_DAYS


def test_validate_calibration_reminder_advance_days_accepts_range():
    assert validate_calibration_reminder_advance_days(18) == 18
    assert validate_calibration_reminder_advance_days(365) == 365


@pytest.mark.parametrize("raw", [0, 366, "abc"])
def test_validate_calibration_reminder_advance_days_rejects_invalid(raw):
    with pytest.raises(ValidationError):
        validate_calibration_reminder_advance_days(raw)
