"""R-11 质量投诉业务类型（通用码，禁止客户专名 / RC 硬编码）。"""

from __future__ import annotations

# IQC 来料批次投诉
COMPLAINT_IQC_INCOMING = "iqc_incoming"
# 产线来料投诉
COMPLAINT_LINE_INCOMING = "line_incoming"
# PQC 投诉
COMPLAINT_PQC = "pqc"
# OQC 投诉
COMPLAINT_OQC = "oqc"
# 客户投诉（可关联既有 8D）
COMPLAINT_CUSTOMER = "customer"

QUALITY_COMPLAINT_TYPES = frozenset(
    {
        COMPLAINT_IQC_INCOMING,
        COMPLAINT_LINE_INCOMING,
        COMPLAINT_PQC,
        COMPLAINT_OQC,
        COMPLAINT_CUSTOMER,
    }
)

QUALITY_COMPLAINT_TYPE_DEFAULT = COMPLAINT_IQC_INCOMING

# 默认工作日时效（可被单头 sla_workdays 覆盖）
QUALITY_COMPLAINT_DEFAULT_SLA_WORKDAYS = 5

QUALITY_COMPLAINT_TYPE_LABELS_ZH = {
    COMPLAINT_IQC_INCOMING: "IQC来料批次投诉",
    COMPLAINT_LINE_INCOMING: "产线来料投诉",
    COMPLAINT_PQC: "PQC投诉",
    COMPLAINT_OQC: "OQC投诉",
    COMPLAINT_CUSTOMER: "客户投诉",
}

# 缺陷分类（R-05 分析维度；通用码）
DEFECT_PERFORMANCE = "performance"
DEFECT_STRUCTURE = "structure"
DEFECT_APPEARANCE = "appearance"
DEFECT_OTHER = "other"

QUALITY_COMPLAINT_DEFECT_CATEGORIES = frozenset(
    {
        DEFECT_PERFORMANCE,
        DEFECT_STRUCTURE,
        DEFECT_APPEARANCE,
        DEFECT_OTHER,
    }
)

QUALITY_COMPLAINT_DEFECT_LABELS_ZH = {
    DEFECT_PERFORMANCE: "性能",
    DEFECT_STRUCTURE: "结构",
    DEFECT_APPEARANCE: "外观",
    DEFECT_OTHER: "其他",
}
