"""单据时间修正：按工作时段改写业务日 / created_at（运维造数）。"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta, timezone
from importlib import import_module
from typing import Any
from zoneinfo import ZoneInfo

from core.utils.timezone_utils import (
    now_utc,
    resolve_business_datetime,
    site_timezone_name,
    to_site_date,
)


@dataclass(frozen=True)
class RewriteDocSpec:
    doc_type: str
    label: str
    model_path: str  # "pkg.mod:Class"
    code_field: str
    date_fields: tuple[str, ...] = ()
    datetime_fields: tuple[str, ...] = ("created_at", "updated_at")
    optional_datetime_fields: tuple[str, ...] = ("review_time",)
    # 造数对齐：更新人/创建人 ← 单据业务人员
    person_id_field: str | None = None
    person_name_field: str | None = None
    # 与主单号同步改写日期段（如报价系列号）
    extra_code_fields: tuple[str, ...] = ()


REWRITE_SPECS: tuple[RewriteDocSpec, ...] = (
    RewriteDocSpec(
        doc_type="sales_order",
        label="销售订单",
        model_path="apps.kuaizhizao.models.sales_order:SalesOrder",
        code_field="order_code",
        date_fields=("order_date",),
        optional_datetime_fields=("review_time",),
        person_id_field="salesman_id",
        person_name_field="salesman_name",
    ),
    RewriteDocSpec(
        doc_type="purchase_order",
        label="采购订单",
        model_path="apps.kuaizhizao.models.purchase_order:PurchaseOrder",
        code_field="order_code",
        date_fields=("order_date",),
        optional_datetime_fields=("review_time",),
        person_id_field="buyer_id",
        person_name_field="buyer_name",
    ),
    RewriteDocSpec(
        doc_type="work_order",
        label="生产工单",
        model_path="apps.kuaizhizao.models.work_order:WorkOrder",
        code_field="code",
        date_fields=(),
        optional_datetime_fields=("review_time", "planned_start_date", "planned_end_date"),
    ),
    RewriteDocSpec(
        doc_type="quotation",
        label="销售报价",
        model_path="apps.kuaizhizao.models.quotation:Quotation",
        code_field="quotation_code",
        date_fields=("quotation_date", "valid_until", "delivery_date"),
        optional_datetime_fields=("review_time",),
        person_id_field="salesman_id",
        person_name_field="salesman_name",
        extra_code_fields=("quotation_series_code",),
    ),
    RewriteDocSpec(
        doc_type="demand",
        label="需求计划",
        model_path="apps.kuaizhizao.models.demand:Demand",
        code_field="demand_code",
        date_fields=("start_date", "end_date"),
        optional_datetime_fields=("review_time",),
        person_id_field="salesman_id",
        person_name_field="salesman_name",
    ),
    RewriteDocSpec(
        doc_type="sales_delivery",
        label="销售出库",
        model_path="apps.kuaizhizao.models.sales_delivery:SalesDelivery",
        code_field="delivery_code",
        date_fields=(),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="purchase_receipt",
        label="采购入库",
        model_path="apps.kuaizhizao.models.purchase_receipt:PurchaseReceipt",
        code_field="receipt_code",
        date_fields=(),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="incoming_inspection",
        label="来料检验",
        model_path="apps.kuaizhizao.models.incoming_inspection:IncomingInspection",
        code_field="inspection_code",
        date_fields=(),
        optional_datetime_fields=("review_time", "inspection_time"),
        person_id_field="inspector_id",
        person_name_field="inspector_name",
    ),
    RewriteDocSpec(
        doc_type="finished_goods_inspection",
        label="成品检验",
        model_path="apps.kuaizhizao.models.finished_goods_inspection:FinishedGoodsInspection",
        code_field="inspection_code",
        date_fields=(),
        optional_datetime_fields=("review_time", "inspection_time"),
        person_id_field="inspector_id",
        person_name_field="inspector_name",
    ),
    RewriteDocSpec(
        doc_type="production_picking",
        label="生产领料",
        model_path="apps.kuaizhizao.models.production_picking:ProductionPicking",
        code_field="picking_code",
        date_fields=(),
        optional_datetime_fields=("review_time", "picking_time"),
        person_id_field="picker_id",
        person_name_field="picker_name",
    ),
    RewriteDocSpec(
        doc_type="finished_goods_receipt",
        label="成品入库",
        model_path="apps.kuaizhizao.models.finished_goods_receipt:FinishedGoodsReceipt",
        code_field="receipt_code",
        date_fields=(),
        optional_datetime_fields=("review_time", "receipt_time"),
        person_id_field="receiver_id",
        person_name_field="receiver_name",
    ),
    RewriteDocSpec(
        doc_type="payable",
        label="应付单",
        model_path="apps.kuaicaiwu.models.payable:Payable",
        code_field="payable_code",
        date_fields=("business_date",),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="receivable",
        label="应收单",
        model_path="apps.kuaicaiwu.models.receivable:Receivable",
        code_field="receivable_code",
        date_fields=("business_date",),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="payment",
        label="付款单",
        model_path="apps.kuaicaiwu.models.payment:Payment",
        code_field="payment_code",
        date_fields=("payment_date",),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="receipt",
        label="收款单",
        model_path="apps.kuaicaiwu.models.receipt:Receipt",
        code_field="receipt_code",
        date_fields=("receipt_date",),
        optional_datetime_fields=("review_time",),
    ),
)


def _parse_hhmm(raw: str, *, field_name: str) -> time:
    text = (raw or "").strip()
    try:
        hour_s, minute_s = text.split(":", 1)
        hour = int(hour_s)
        minute = int(minute_s)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{field_name} 格式须为 HH:MM，例如 09:00") from exc
    if hour < 0 or hour > 23 or minute < 0 or minute > 59:
        raise ValueError(f"{field_name} 非法：{text}")
    return time(hour=hour, minute=minute)


@dataclass
class WorkScheduleParams:
    weekdays: list[int] = field(default_factory=lambda: [0, 1, 2, 3, 4])
    start_time: str = "09:00"
    end_time: str = "18:00"
    lookback_days: int = 14

    def validate(self) -> None:
        days = sorted({int(d) for d in self.weekdays})
        if not days:
            raise ValueError("至少勾选一个工作日")
        if any(d < 0 or d > 6 for d in days):
            raise ValueError("工作日须在周一至周日范围内")
        start = _parse_hhmm(self.start_time, field_name="上班时间")
        end = _parse_hhmm(self.end_time, field_name="下班时间")
        if start >= end:
            raise ValueError("上班时间必须早于下班时间")
        if self.lookback_days < 1 or self.lookback_days > 365:
            raise ValueError("回溯天数须在 1–365 之间")
        self.weekdays = days
        self.start_time = f"{start.hour:02d}:{start.minute:02d}"
        self.end_time = f"{end.hour:02d}:{end.minute:02d}"

    @property
    def start_tod(self) -> time:
        return _parse_hhmm(self.start_time, field_name="上班时间")

    @property
    def end_tod(self) -> time:
        return _parse_hhmm(self.end_time, field_name="下班时间")

    def is_workday(self, day: date) -> bool:
        return int(day.weekday()) in set(self.weekdays)

    def window_on(self, day: date, tz: ZoneInfo) -> tuple[datetime, datetime] | None:
        if not self.is_workday(day):
            return None
        start = datetime(
            day.year,
            day.month,
            day.day,
            self.start_tod.hour,
            self.start_tod.minute,
            tzinfo=tz,
        )
        end = datetime(
            day.year,
            day.month,
            day.day,
            self.end_tod.hour,
            self.end_tod.minute,
            tzinfo=tz,
        )
        return start, end

    def work_segments_until(
        self,
        *,
        now_site: datetime,
        lookback_days: int | None = None,
    ) -> list[tuple[datetime, datetime]]:
        if now_site.tzinfo is None:
            raise ValueError("now_site 必须是带时区的站点墙钟时刻")
        tz = ZoneInfo(str(now_site.tzinfo))
        days = lookback_days if lookback_days is not None else self.lookback_days
        start_day = now_site.date() - timedelta(days=days)
        segments: list[tuple[datetime, datetime]] = []
        day = start_day
        while day <= now_site.date():
            window = self.window_on(day, tz)
            if window is not None:
                start, end = window
                if end > start and start < now_site:
                    segments.append((start, min(end, now_site)))
            day += timedelta(days=1)
        return [(a, b) for a, b in segments if b > a]

    def clamp_to_work_time(self, when_site: datetime) -> datetime:
        if when_site.tzinfo is None:
            raise ValueError("when_site 必须是带时区的站点墙钟时刻")
        tz = ZoneInfo(str(when_site.tzinfo))
        day = when_site.date()
        for _ in range(400):
            window = self.window_on(day, tz)
            if window is not None:
                start, end = window
                if day == when_site.date():
                    if when_site < start:
                        day -= timedelta(days=1)
                        continue
                    if when_site >= end:
                        return end - timedelta(seconds=1)
                    return when_site
                return end - timedelta(seconds=1)
            day -= timedelta(days=1)
        raise ValueError("在回溯范围内找不到可用工作日，请检查工作日设置")

    def issue_times_utc(self, count: int, *, timezone_name: str) -> list[datetime]:
        if count < 1:
            raise ValueError("数量至少为 1")
        self.validate()
        tz = ZoneInfo(timezone_name)
        anchor_utc = now_utc()
        now_site = anchor_utc.astimezone(tz)
        end_site = self.clamp_to_work_time(now_site)
        segments = self.work_segments_until(
            now_site=end_site + timedelta(microseconds=1),
            lookback_days=self.lookback_days,
        )
        if not segments:
            window = self.window_on(end_site.date(), tz)
            if window is None:
                raise ValueError("找不到可用工作时段，请检查工作日与上下班时间")
            start, end = window
            clipped_end = min(end, end_site + timedelta(seconds=1))
            if clipped_end <= start:
                raise ValueError("找不到可用工作时段")
            segments = [(start, clipped_end)]

        total = sum((b - a).total_seconds() for a, b in segments)
        if total <= 0:
            raise ValueError("可用工作时长为 0")

        times_site: list[datetime] = []
        if count == 1:
            times_site.append(end_site)
        else:
            span = max(total - 1.0, 0.0)
            for i in range(count):
                target = (i / (count - 1)) * span
                cursor = 0.0
                chosen = end_site
                for a, b in segments:
                    length = (b - a).total_seconds()
                    if cursor + length >= target:
                        chosen = a + timedelta(seconds=target - cursor)
                        break
                    cursor += length
                if chosen > end_site:
                    chosen = end_site
                times_site.append(chosen)

        return [dt.astimezone(timezone.utc) for dt in times_site]

    def issue_times_utc_since(
        self,
        count: int,
        *,
        timezone_name: str,
        since: date,
    ) -> list[datetime]:
        """从 since（含）到当前工作时刻，均匀铺 count 个业务时刻。"""
        if count < 1:
            raise ValueError("数量至少为 1")
        # 校验工作日/上下班，但不套用 lookback_days≤365 限制（起始日可更早）
        days = sorted({int(d) for d in self.weekdays})
        if not days:
            raise ValueError("至少勾选一个工作日")
        if any(d < 0 or d > 6 for d in days):
            raise ValueError("工作日须在周一至周日范围内")
        start = _parse_hhmm(self.start_time, field_name="上班时间")
        end = _parse_hhmm(self.end_time, field_name="下班时间")
        if start >= end:
            raise ValueError("上班时间必须早于下班时间")

        tz = ZoneInfo(timezone_name)
        now_site = now_utc().astimezone(tz)
        if since > now_site.date():
            raise ValueError("起始日期不能晚于今天")
        end_site = self.clamp_to_work_time(now_site)

        segments: list[tuple[datetime, datetime]] = []
        day = since
        while day <= end_site.date():
            window = self.window_on(day, tz)
            if window is not None:
                a, b = window
                if b > a and a < end_site + timedelta(microseconds=1):
                    segments.append((a, min(b, end_site + timedelta(microseconds=1))))
            day += timedelta(days=1)
        segments = [(a, b) for a, b in segments if b > a]
        if not segments:
            raise ValueError("起始日至今日之间没有可用工作时段")

        total = sum((b - a).total_seconds() for a, b in segments)
        if total <= 0:
            raise ValueError("可用工作时长为 0")

        times_site: list[datetime] = []
        if count == 1:
            times_site.append(end_site)
        else:
            span = max(total - 1.0, 0.0)
            for i in range(count):
                target = (i / (count - 1)) * span
                cursor = 0.0
                chosen = end_site
                for a, b in segments:
                    length = (b - a).total_seconds()
                    if cursor + length >= target:
                        chosen = a + timedelta(seconds=target - cursor)
                        break
                    cursor += length
                if chosen > end_site:
                    chosen = end_site
                times_site.append(chosen)

        return [dt.astimezone(timezone.utc) for dt in times_site]


# 主数据实体：改 updated_at（造数测试用）
MASTER_DATA_UPDATE_SPECS: tuple[tuple[str, str], ...] = (
    ("apps.master_data.models.customer:Customer", "客户"),
    ("apps.master_data.models.supplier:Supplier", "供应商"),
    ("apps.master_data.models.material:Material", "物料"),
    ("apps.master_data.models.material:MaterialGroup", "物料分组"),
    ("apps.master_data.models.material:BOM", "物料清单"),
    ("apps.master_data.models.warehouse:Warehouse", "仓库"),
    ("apps.master_data.models.warehouse:StorageArea", "库区"),
    ("apps.master_data.models.warehouse:StorageLocation", "库位"),
    ("apps.master_data.models.factory:Plant", "厂区"),
    ("apps.master_data.models.factory:Workshop", "车间"),
    ("apps.master_data.models.factory:ProductionLine", "产线"),
    ("apps.master_data.models.factory:Workstation", "工位"),
    ("apps.master_data.models.factory:WorkCenter", "工作中心"),
    ("apps.master_data.models.process:Operation", "工序"),
    ("apps.master_data.models.process:ProcessRoute", "工艺路线"),
    ("apps.master_data.models.process:DefectType", "不良品类型"),
    ("apps.master_data.models.unit:MaterialUnit", "单位"),
    ("apps.master_data.models.product:Product", "产品"),
)


def list_rewrite_doc_types() -> list[dict[str, str]]:
    return [{"doc_type": s.doc_type, "label": s.label} for s in REWRITE_SPECS]


def get_rewrite_spec(doc_type: str) -> RewriteDocSpec:
    for spec in REWRITE_SPECS:
        if spec.doc_type == doc_type:
            return spec
    raise ValueError(f"未知单据类型: {doc_type}")


def _load_model(model_path: str) -> Any:
    module_name, class_name = model_path.split(":", 1)
    mod = import_module(module_name)
    return getattr(mod, class_name)


def _model_has_field(model: Any, field_name: str) -> bool:
    """Tortoise 字段在 _meta.fields_map；hasattr(Model, name) 对继承字段恒为 False。"""
    fields_map = getattr(getattr(model, "_meta", None), "fields_map", None) or {}
    return field_name in fields_map


def _as_utc(dt: datetime) -> datetime:
    return resolve_business_datetime(dt)


_DATE_IN_CODE_RE = re.compile(r"^(\D*)(\d{8})")


def _replace_code_date(code: str, biz_day: date) -> str:
    """将单号中紧随前缀的 YYYYMMDD 换成业务日；无日期段则原样返回。"""
    text = (code or "").strip()
    if not text:
        return text
    match = _DATE_IN_CODE_RE.match(text)
    if not match:
        return text
    new_token = biz_day.strftime("%Y%m%d")
    if match.group(2) == new_token:
        return text
    return f"{match.group(1)}{new_token}{text[match.end() :]}"


async def _allocate_unique_code(
    *,
    model: Any,
    tenant_id: int,
    code_field: str,
    desired: str,
    exclude_id: int,
) -> str:
    """若 desired 已被其它单据占用，则递增末尾数字直至唯一。"""
    candidate = desired
    for _ in range(500):
        # 勿提前 await QuerySet（await 会变成 list，没有 .exists）
        qs = model.filter(tenant_id=tenant_id).filter(**{code_field: candidate}).exclude(
            id=exclude_id
        )
        if _model_has_field(model, "deleted_at"):
            qs = qs.filter(deleted_at__isnull=True)
        if not await qs.exists():
            return candidate
        trail = re.search(r"(\d+)(?!.*\d)", candidate)
        if not trail:
            raise ValueError(f"单号冲突且无法递增: {candidate}")
        width = len(trail.group(1))
        nxt = int(trail.group(1)) + 1
        candidate = candidate[: trail.start(1)] + str(nxt).zfill(width) + candidate[trail.end(1) :]
    raise ValueError(f"单号冲突次数过多: {desired}")


class DocumentTimeRewriteService:
    @staticmethod
    async def list_recent_documents(
        *,
        tenant_id: int,
        doc_type: str,
        limit: int = 50,
        code_keyword: str = "",
        include_deleted: bool = True,
    ) -> list[dict[str, Any]]:
        """列出最近单据。造数/时间修正默认含软删，避免测试单被删后工具侧「无数据」。"""
        spec = get_rewrite_spec(doc_type)
        model = _load_model(spec.model_path)
        qs = model.filter(tenant_id=tenant_id)
        if (not include_deleted) and _model_has_field(model, "deleted_at"):
            qs = qs.filter(deleted_at__isnull=True)
        keyword = (code_keyword or "").strip()
        if keyword:
            qs = qs.filter(**{f"{spec.code_field}__icontains": keyword})
        rows = await qs.order_by("-id").limit(max(1, min(int(limit), 500))).all()
        out: list[dict[str, Any]] = []
        for row in rows:
            out.append(
                {
                    "id": int(row.id),
                    "code": str(getattr(row, spec.code_field, None) or row.id),
                    "created_at": getattr(row, "created_at", None),
                    "deleted": bool(getattr(row, "deleted_at", None)),
                }
            )
        return out

    @staticmethod
    async def _build_payload(
        *,
        row: Any,
        model: Any,
        tenant_id: int,
        spec: RewriteDocSpec,
        issue_at: datetime,
        sync_operator: bool,
        rewrite_code_date: bool,
        preserve_relative_dates: bool,
    ) -> dict[str, Any]:
        issue_utc = _as_utc(issue_at)
        biz_day = to_site_date(issue_utc)
        payload: dict[str, Any] = {}

        primary_date_field = spec.date_fields[0] if spec.date_fields else None
        primary_before: date | None = None
        if primary_date_field and hasattr(row, primary_date_field):
            raw = getattr(row, primary_date_field, None)
            if isinstance(raw, datetime):
                primary_before = to_site_date(raw)
            elif isinstance(raw, date):
                primary_before = raw

        for field_name in spec.date_fields:
            if not hasattr(row, field_name):
                continue
            current = getattr(row, field_name, None)
            if (
                preserve_relative_dates
                and primary_before is not None
                and field_name != primary_date_field
                and isinstance(current, date)
                and not isinstance(current, datetime)
            ):
                delta = current - primary_before
                payload[field_name] = biz_day + delta
            else:
                payload[field_name] = biz_day

        for field_name in spec.datetime_fields:
            if hasattr(row, field_name):
                payload[field_name] = issue_utc
        for field_name in spec.optional_datetime_fields:
            if not hasattr(row, field_name):
                continue
            current = getattr(row, field_name, None)
            if current is None:
                continue
            if isinstance(current, date) and not isinstance(current, datetime):
                payload[field_name] = biz_day
            else:
                payload[field_name] = issue_utc

        if sync_operator and spec.person_id_field and hasattr(row, spec.person_id_field):
            person_id = getattr(row, spec.person_id_field, None)
            person_name = None
            if spec.person_name_field and hasattr(row, spec.person_name_field):
                person_name = getattr(row, spec.person_name_field, None)
            if person_id is not None:
                if hasattr(row, "created_by"):
                    payload["created_by"] = int(person_id)
                if hasattr(row, "updated_by"):
                    payload["updated_by"] = int(person_id)
                if person_name:
                    name = str(person_name).strip()
                    if name:
                        if hasattr(row, "created_by_name"):
                            payload["created_by_name"] = name
                        if hasattr(row, "updated_by_name"):
                            payload["updated_by_name"] = name

        if rewrite_code_date and spec.code_field and hasattr(row, spec.code_field):
            old_code = str(getattr(row, spec.code_field, "") or "")
            desired = _replace_code_date(old_code, biz_day)
            if desired and desired != old_code:
                unique = await _allocate_unique_code(
                    model=model,
                    tenant_id=tenant_id,
                    code_field=spec.code_field,
                    desired=desired,
                    exclude_id=int(row.id),
                )
                payload[spec.code_field] = unique
                for extra in spec.extra_code_fields:
                    if not hasattr(row, extra):
                        continue
                    old_extra = str(getattr(row, extra, "") or "")
                    if not old_extra:
                        continue
                    # 系列号通常等于旧主号；主号改写后同步替换日期段
                    if old_extra == old_code:
                        payload[extra] = unique
                    else:
                        payload[extra] = _replace_code_date(old_extra, biz_day)

        if not payload:
            raise ValueError("无可改写字段")
        return payload

    @staticmethod
    async def rewrite_document_times(
        *,
        tenant_id: int,
        doc_type: str,
        document_ids: list[int],
        schedule: WorkScheduleParams,
        sync_operator: bool = True,
        rewrite_code_date: bool = True,
    ) -> dict[str, Any]:
        schedule.validate()
        timezone_name = site_timezone_name()
        spec = get_rewrite_spec(doc_type)
        model = _load_model(spec.model_path)
        ids = [int(i) for i in document_ids]
        if not ids:
            raise ValueError("未选择单据")

        issue_times = schedule.issue_times_utc(len(ids), timezone_name=timezone_name)
        updated = 0
        failed = 0
        errors: list[str] = []
        codes_out: list[dict[str, Any]] = []

        for doc_id, issue_at in zip(ids, issue_times):
            try:
                row = await model.get_or_none(tenant_id=tenant_id, id=doc_id)
                if not row:
                    raise ValueError(f"单据不存在: {doc_id}")
                payload = await DocumentTimeRewriteService._build_payload(
                    row=row,
                    model=model,
                    tenant_id=tenant_id,
                    spec=spec,
                    issue_at=issue_at,
                    sync_operator=sync_operator,
                    rewrite_code_date=rewrite_code_date,
                    preserve_relative_dates=True,
                )
                await model.filter(tenant_id=tenant_id, id=doc_id).update(**payload)
                updated += 1
                new_code = payload.get(spec.code_field)
                if new_code is None:
                    new_code = getattr(row, spec.code_field, None)
                codes_out.append({"id": doc_id, "code": str(new_code or doc_id)})
            except Exception as exc:
                failed += 1
                errors.append(f"id={doc_id}: {exc}")

        return {
            "updated": updated,
            "failed": failed,
            "errors": errors,
            "timezone": timezone_name,
            "codes": codes_out,
        }

    @staticmethod
    async def rewrite_documents_at_exact_times(
        *,
        tenant_id: int,
        doc_type: str,
        items: list[dict[str, Any]],
        sync_operator: bool = True,
        rewrite_code_date: bool = True,
        preserve_business_dates: bool = True,
    ) -> dict[str, Any]:
        """
        按明确业务时刻改写（造数链条逐步对齐）。

        preserve_business_dates=True：不改业务日字段（已由生成器写入），
        只改 created_at/updated_at、可选审核时刻、更新人、单号日期。
        """
        timezone_name = site_timezone_name()
        spec = get_rewrite_spec(doc_type)
        model = _load_model(spec.model_path)
        if not items:
            raise ValueError("未选择单据")

        updated = 0
        failed = 0
        errors: list[str] = []
        codes_out: list[dict[str, Any]] = []

        for item in items:
            doc_id = int(item["id"])
            try:
                issued_raw = item.get("issued_at")
                if issued_raw is None:
                    raise ValueError("缺少 issued_at")
                if isinstance(issued_raw, datetime):
                    issue_at = issued_raw
                else:
                    text = str(issued_raw).strip().replace("Z", "+00:00")
                    issue_at = datetime.fromisoformat(text)
                row = await model.get_or_none(tenant_id=tenant_id, id=doc_id)
                if not row:
                    raise ValueError(f"单据不存在: {doc_id}")

                if preserve_business_dates:
                    # 只动系统戳 / 人 / 单号；业务日保持生成器写入值
                    slim = RewriteDocSpec(
                        doc_type=spec.doc_type,
                        label=spec.label,
                        model_path=spec.model_path,
                        code_field=spec.code_field,
                        date_fields=(),
                        datetime_fields=spec.datetime_fields,
                        optional_datetime_fields=spec.optional_datetime_fields,
                        person_id_field=spec.person_id_field,
                        person_name_field=spec.person_name_field,
                        extra_code_fields=spec.extra_code_fields,
                    )
                    payload = await DocumentTimeRewriteService._build_payload(
                        row=row,
                        model=model,
                        tenant_id=tenant_id,
                        spec=slim,
                        issue_at=issue_at,
                        sync_operator=sync_operator,
                        rewrite_code_date=rewrite_code_date,
                        preserve_relative_dates=False,
                    )
                else:
                    payload = await DocumentTimeRewriteService._build_payload(
                        row=row,
                        model=model,
                        tenant_id=tenant_id,
                        spec=spec,
                        issue_at=issue_at,
                        sync_operator=sync_operator,
                        rewrite_code_date=rewrite_code_date,
                        preserve_relative_dates=True,
                    )
                await model.filter(tenant_id=tenant_id, id=doc_id).update(**payload)
                updated += 1
                new_code = payload.get(spec.code_field)
                if new_code is None:
                    new_code = getattr(row, spec.code_field, None)
                codes_out.append({"id": doc_id, "code": str(new_code or doc_id)})
            except Exception as exc:
                failed += 1
                errors.append(f"id={doc_id}: {exc}")

        return {
            "updated": updated,
            "failed": failed,
            "errors": errors,
            "timezone": timezone_name,
            "codes": codes_out,
        }

    @staticmethod
    async def align_documents_to_own_fields(
        *,
        tenant_id: int,
        doc_type: str,
        document_ids: list[int],
        sync_operator: bool = True,
        rewrite_code_date: bool = True,
    ) -> dict[str, Any]:
        """
        用单据自身业务日/业务人员对齐审计戳与单号日期（不重排业务日）。
        无业务日字段时，保留 created_at 的日历日，仅同步人员与单号。
        """
        timezone_name = site_timezone_name()
        tz = ZoneInfo(timezone_name)
        spec = get_rewrite_spec(doc_type)
        model = _load_model(spec.model_path)
        ids = [int(i) for i in document_ids]
        if not ids:
            raise ValueError("未选择单据")

        updated = 0
        failed = 0
        errors: list[str] = []
        codes_out: list[dict[str, Any]] = []

        for doc_id in ids:
            try:
                row = await model.get_or_none(tenant_id=tenant_id, id=doc_id)
                if not row:
                    raise ValueError(f"单据不存在: {doc_id}")

                biz_day: date | None = None
                primary = spec.date_fields[0] if spec.date_fields else None
                if primary and hasattr(row, primary):
                    raw = getattr(row, primary, None)
                    if isinstance(raw, datetime):
                        biz_day = to_site_date(raw)
                    elif isinstance(raw, date):
                        biz_day = raw
                if biz_day is None:
                    created = getattr(row, "created_at", None)
                    if isinstance(created, datetime):
                        biz_day = to_site_date(created)
                if biz_day is None:
                    raise ValueError("无业务日可对齐")

                issue_at = datetime(
                    biz_day.year, biz_day.month, biz_day.day, 12, 0, 0, tzinfo=tz
                )
                slim = RewriteDocSpec(
                    doc_type=spec.doc_type,
                    label=spec.label,
                    model_path=spec.model_path,
                    code_field=spec.code_field,
                    date_fields=(),
                    datetime_fields=spec.datetime_fields,
                    optional_datetime_fields=spec.optional_datetime_fields,
                    person_id_field=spec.person_id_field,
                    person_name_field=spec.person_name_field,
                    extra_code_fields=spec.extra_code_fields,
                )
                payload = await DocumentTimeRewriteService._build_payload(
                    row=row,
                    model=model,
                    tenant_id=tenant_id,
                    spec=slim,
                    issue_at=issue_at,
                    sync_operator=sync_operator,
                    rewrite_code_date=rewrite_code_date,
                    preserve_relative_dates=False,
                )
                await model.filter(tenant_id=tenant_id, id=doc_id).update(**payload)
                updated += 1
                new_code = payload.get(spec.code_field)
                if new_code is None:
                    new_code = getattr(row, spec.code_field, None)
                codes_out.append({"id": doc_id, "code": str(new_code or doc_id)})
            except Exception as exc:
                failed += 1
                errors.append(f"id={doc_id}: {exc}")

        return {
            "updated": updated,
            "failed": failed,
            "errors": errors,
            "timezone": timezone_name,
            "codes": codes_out,
        }

    @staticmethod
    async def expand_operation_logs_since(
        *,
        tenant_id: int,
        since: date,
        schedule: WorkScheduleParams,
        max_rows: int = 5000,
    ) -> dict[str, Any]:
        """
        将本租户已有操作日志的 created_at 按工作时段均匀摊开到
        「since ～ 当前」区间（保持 id 升序相对先后），使时间线扩充到指定日起。
        """
        from core.models.operation_log import OperationLog

        schedule.validate()
        timezone_name = site_timezone_name()
        tz = ZoneInfo(timezone_name)
        now_site = now_utc().astimezone(tz)
        if since > now_site.date():
            raise ValueError("起始日期不能晚于今天")

        limit = max(1, min(int(max_rows), 20000))
        rows = (
            await OperationLog.filter(tenant_id=tenant_id)
            .order_by("id")
            .limit(limit)
            .all()
        )
        if not rows:
            raise ValueError("该租户暂无操作日志，无法扩充")

        times = schedule.issue_times_utc_since(
            len(rows), timezone_name=timezone_name, since=since
        )
        updated = 0
        for row, issued in zip(rows, times):
            await OperationLog.filter(id=row.id, tenant_id=tenant_id).update(
                created_at=issued
            )
            updated += 1

        return {
            "updated": updated,
            "scanned": len(rows),
            "since": since.isoformat(),
            "timezone": timezone_name,
            "truncated": len(rows) >= limit,
        }

    @staticmethod
    async def rewrite_master_data_updated_at(
        *,
        tenant_id: int,
        target_day: date,
        schedule: WorkScheduleParams,
    ) -> dict[str, Any]:
        """
        将主数据实体 updated_at 的日历日改到目标日，时分秒保持原样（站点时区）。
        若改写后 created_at 晚于 updated_at，则对 created_at 同样只改日期；仍晚则压到 updated_at。
        schedule 仅保留接口兼容，不参与计算。
        """
        del schedule  # 接口兼容；时分秒取自原记录
        timezone_name = site_timezone_name()
        tz = ZoneInfo(timezone_name)
        now_site = now_utc().astimezone(tz)
        if target_day > now_site.date():
            raise ValueError("目标日期不能晚于今天")

        per_type: list[dict[str, Any]] = []
        total_updated = 0
        total_created_clamped = 0
        for model_path, label in MASTER_DATA_UPDATE_SPECS:
            try:
                model = _load_model(model_path)
            except Exception as exc:
                per_type.append(
                    {
                        "label": label,
                        "model": model_path,
                        "updated": 0,
                        "error": str(exc),
                    }
                )
                continue
            if not _model_has_field(model, "updated_at"):
                per_type.append(
                    {
                        "label": label,
                        "model": model_path,
                        "updated": 0,
                        "error": "无 updated_at 字段",
                    }
                )
                continue
            rows = await model.filter(tenant_id=tenant_id).all()
            if not rows:
                per_type.append({"label": label, "model": model_path, "updated": 0})
                continue
            updated = 0
            clamped = 0
            for row in rows:
                raw_updated = getattr(row, "updated_at", None)
                if raw_updated is None:
                    continue
                updated_site = _as_utc(raw_updated).astimezone(tz)
                new_updated_site = updated_site.replace(
                    year=target_day.year,
                    month=target_day.month,
                    day=target_day.day,
                )
                new_updated_utc = _as_utc(new_updated_site)
                payload: dict[str, Any] = {"updated_at": new_updated_utc}
                if _model_has_field(model, "created_at"):
                    raw_created = getattr(row, "created_at", None)
                    if raw_created is not None:
                        created_utc = _as_utc(raw_created)
                        if created_utc > new_updated_utc:
                            created_site = created_utc.astimezone(tz)
                            new_created_site = created_site.replace(
                                year=target_day.year,
                                month=target_day.month,
                                day=target_day.day,
                            )
                            new_created_utc = _as_utc(new_created_site)
                            if new_created_utc > new_updated_utc:
                                new_created_utc = new_updated_utc
                            payload["created_at"] = new_created_utc
                            clamped += 1
                await model.filter(tenant_id=tenant_id, id=int(row.id)).update(**payload)
                updated += 1
            total_updated += updated
            total_created_clamped += clamped
            per_type.append(
                {
                    "label": label,
                    "model": model_path,
                    "updated": updated,
                    "created_clamped": clamped,
                }
            )

        return {
            "updated": total_updated,
            "created_clamped": total_created_clamped,
            "target_day": target_day.isoformat(),
            "issued_at": target_day.isoformat(),
            "timezone": timezone_name,
            "items": per_type,
        }

