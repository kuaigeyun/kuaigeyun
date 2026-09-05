"""单据时间修正：按工作时段改写业务日 / created_at（运维造数）。"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta, timezone
from importlib import import_module
from typing import Any
from zoneinfo import ZoneInfo

from core.utils.timezone_utils import now_utc, site_timezone_name, to_site_date


@dataclass(frozen=True)
class RewriteDocSpec:
    doc_type: str
    label: str
    model_path: str  # "pkg.mod:Class"
    code_field: str
    date_fields: tuple[str, ...] = ()
    datetime_fields: tuple[str, ...] = ("created_at", "updated_at")
    optional_datetime_fields: tuple[str, ...] = ("review_time",)


REWRITE_SPECS: tuple[RewriteDocSpec, ...] = (
    RewriteDocSpec(
        doc_type="sales_order",
        label="销售订单",
        model_path="apps.kuaizhizao.models.sales_order:SalesOrder",
        code_field="order_code",
        date_fields=("order_date",),
        optional_datetime_fields=("review_time",),
    ),
    RewriteDocSpec(
        doc_type="purchase_order",
        label="采购订单",
        model_path="apps.kuaizhizao.models.purchase_order:PurchaseOrder",
        code_field="order_code",
        date_fields=("order_date",),
        optional_datetime_fields=("review_time",),
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
    ),
    RewriteDocSpec(
        doc_type="demand",
        label="需求计划",
        model_path="apps.kuaizhizao.models.demand:Demand",
        code_field="demand_code",
        date_fields=("start_date", "end_date"),
        optional_datetime_fields=("review_time",),
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


def _as_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


class DocumentTimeRewriteService:
    @staticmethod
    async def list_recent_documents(
        *,
        tenant_id: int,
        doc_type: str,
        limit: int = 50,
        code_keyword: str = "",
    ) -> list[dict[str, Any]]:
        spec = get_rewrite_spec(doc_type)
        model = _load_model(spec.model_path)
        qs = model.filter(tenant_id=tenant_id)
        if hasattr(model, "deleted_at"):
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
                }
            )
        return out

    @staticmethod
    async def rewrite_document_times(
        *,
        tenant_id: int,
        doc_type: str,
        document_ids: list[int],
        schedule: WorkScheduleParams,
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

        for doc_id, issue_at in zip(ids, issue_times):
            try:
                row = await model.get_or_none(tenant_id=tenant_id, id=doc_id)
                if not row:
                    raise ValueError(f"单据不存在: {doc_id}")
                biz_day = to_site_date(issue_at)
                payload: dict[str, Any] = {}
                for field_name in spec.date_fields:
                    if hasattr(row, field_name):
                        payload[field_name] = biz_day
                for field_name in spec.datetime_fields:
                    if hasattr(row, field_name):
                        payload[field_name] = _as_utc(issue_at)
                for field_name in spec.optional_datetime_fields:
                    if not hasattr(row, field_name):
                        continue
                    current = getattr(row, field_name, None)
                    if current is None:
                        continue
                    if isinstance(current, date) and not isinstance(current, datetime):
                        payload[field_name] = biz_day
                    else:
                        payload[field_name] = _as_utc(issue_at)
                if not payload:
                    raise ValueError("无可改写字段")
                await model.filter(tenant_id=tenant_id, id=doc_id).update(**payload)
                updated += 1
            except Exception as exc:
                failed += 1
                errors.append(f"id={doc_id}: {exc}")

        return {
            "updated": updated,
            "failed": failed,
            "errors": errors,
            "timezone": timezone_name,
        }
