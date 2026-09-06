"""R-11 返工业务类型常量测试。"""

from apps.kuaizhizao.constants.rework_business_types import (
    REWORK_BUSINESS_MULTI_SIGNOFF,
    REWORK_BUSINESS_SIMPLE_EXEC,
    REWORK_BUSINESS_TYPE_DEFAULT,
    REWORK_BUSINESS_TYPES,
)


def test_rework_business_types_are_generic_codes():
    assert REWORK_BUSINESS_TYPE_DEFAULT == "simple_exec"
    assert REWORK_BUSINESS_SIMPLE_EXEC in REWORK_BUSINESS_TYPES
    assert REWORK_BUSINESS_MULTI_SIGNOFF in REWORK_BUSINESS_TYPES
    # 禁止客户专名硬编码进默认集合
    for code in REWORK_BUSINESS_TYPES:
        assert "FR" not in code.upper()
        assert "RC" not in code.upper()
