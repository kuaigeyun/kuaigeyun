"""生产文件中心（R-06）目录策略与类型常量。"""

from __future__ import annotations

# 同一中心两类目录策略（不共享错误的历史可见规则）
CATALOG_PE = "pe_production"  # 工序 → 产品型号；生产方仅最新生产版
CATALOG_RD = "rd_tool"  # 项目代号 → 发布日期；保留历史

CATALOG_KINDS = frozenset({CATALOG_PE, CATALOG_RD})

# PE 生产软件类型
PE_FILE_TYPES = frozenset(
    {
        "burn",  # 烧录软件
        "laser",  # 镭雕软件
        "bluetooth_ir",  # 蓝牙红外测试
        "aoi",  # AOI
        "label_template",  # 标签模板文件（非 R-16 扫码作业）
        "other_pe",
    }
)

# 研发烧录工具 / 产测
RD_FILE_TYPES = frozenset(
    {
        "rd_burn_tool",
        "rd_prod_test",
        "other_rd",
    }
)

FILE_TYPES = PE_FILE_TYPES | RD_FILE_TYPES

# INF-05 版本状态
VERSION_STATUSES = frozenset({"draft", "pending", "effective", "obsolete", "rejected"})

ACCESS_ACTIONS = frozenset({"view", "download", "issue"})
