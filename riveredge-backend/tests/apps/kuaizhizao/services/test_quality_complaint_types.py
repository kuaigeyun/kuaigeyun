"""质量投诉业务类型常量测试。"""

from apps.kuaizhizao.constants.quality_complaint_types import (
    COMPLAINT_CUSTOMER,
    COMPLAINT_IQC_INCOMING,
    QUALITY_COMPLAINT_TYPE_DEFAULT,
    QUALITY_COMPLAINT_TYPES,
)


def test_quality_complaint_types_are_generic_codes():
    assert QUALITY_COMPLAINT_TYPE_DEFAULT == COMPLAINT_IQC_INCOMING
    assert COMPLAINT_CUSTOMER in QUALITY_COMPLAINT_TYPES
    assert len(QUALITY_COMPLAINT_TYPES) == 5
    for code in QUALITY_COMPLAINT_TYPES:
        assert "RC" not in code.upper()
        assert "FUNIDE" not in code.upper()


def test_quality_complaint_defect_categories_are_generic():
    from apps.kuaizhizao.constants.quality_complaint_types import (
        QUALITY_COMPLAINT_DEFECT_CATEGORIES,
    )

    assert "performance" in QUALITY_COMPLAINT_DEFECT_CATEGORIES
    assert "structure" in QUALITY_COMPLAINT_DEFECT_CATEGORIES
    assert "appearance" in QUALITY_COMPLAINT_DEFECT_CATEGORIES
    for code in QUALITY_COMPLAINT_DEFECT_CATEGORIES:
        assert " " not in code
