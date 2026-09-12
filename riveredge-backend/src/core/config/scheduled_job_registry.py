"""
租户级内置定时任务目录（唯一真源）。

业务配置「定时任务」Tab 展示并可编辑 cron/启用；执行由 ScheduledTask + scheduled-task/execute 统一调度。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, FrozenSet, List, Optional


@dataclass(frozen=True)
class ScheduledJobPreset:
    code: str
    name: str
    description: str
    module: str
    required_app: str
    default_cron: str
    default_active: bool = True


# 模块 id 对齐配置中心 BASE_MODULES
SCHEDULED_JOB_PRESETS: List[ScheduledJobPreset] = [
    ScheduledJobPreset(
        code="kuaizhizao.inventory_alert_check",
        name="库存预警检查",
        description="扫描即时库存，按预警规则与物料阈值生成或解除低库存、高库存、过期预警记录",
        module="warehouse",
        required_app="kuaizhizao",
        default_cron="*/30 * * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.exception_detection",
        name="异常自动检测",
        description="检测在制工单缺料与销售交期延误等异常并写入异常中心",
        module="production",
        required_app="kuaizhizao",
        default_cron="0 * * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.work_order_score_recalc",
        name="工单综合分重算",
        description="批量重算已下达工单的排程与领料综合分",
        module="production",
        required_app="kuaizhizao",
        default_cron="*/30 * * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.maintenance_reminder",
        name="设备保养提醒",
        description="扫描保养计划并生成到期保养提醒",
        module="equipment",
        required_app="kuaizhizao",
        default_cron="0 8 * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.equipment_supervision",
        name="设备点检督促",
        description="检查点检未完成与审核超时并发送督促通知",
        module="equipment",
        required_app="kuaizhizao",
        default_cron="30 8 * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.delivery_delay_notification",
        name="交期延误提醒",
        description="检查销售与采购订单交期延误并发送站内提醒",
        module="sales",
        required_app="kuaizhizao",
        default_cron="0 9 * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.customer_pool_recycle",
        name="客户池自动回收",
        description="将到达回收时间的私海客户自动回收到客户池",
        module="sales",
        required_app="kuaizhizao",
        default_cron="30 2 * * *",
    ),
    ScheduledJobPreset(
        code="kuaizhizao.external_master_data_sync",
        name="外部主数据定时同步",
        description="按绑定配置同步外部单位、物料、客户、订单等主数据",
        module="common",
        required_app="kuaizhizao",
        default_cron="*/5 * * * *",
    ),
]

PRESET_BY_CODE: Dict[str, ScheduledJobPreset] = {p.code: p for p in SCHEDULED_JOB_PRESETS}

PRESET_CODES: FrozenSet[str] = frozenset(PRESET_BY_CODE.keys())


def get_preset(code: str) -> Optional[ScheduledJobPreset]:
    return PRESET_BY_CODE.get((code or "").strip())
