"""R-05 质量投诉分析：直接聚合投诉真源，禁止复制到第二统计表。"""

from __future__ import annotations

import re
import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.kuaizhizao.constants.quality_complaint_types import (
    QUALITY_COMPLAINT_DEFECT_LABELS_ZH,
    QUALITY_COMPLAINT_TYPE_LABELS_ZH,
)
from apps.kuaizhizao.models.quality_complaint import QualityComplaint
from apps.kuaizhizao.models.quality_complaint_batch_month import QualityComplaintBatchMonth
from apps.kuaizhizao.schemas.quality_complaint_batch_month import (
    QualityComplaintBatchMonthListResponse,
    QualityComplaintBatchMonthResponse,
    QualityComplaintBatchMonthUpsert,
)
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.exceptions.exceptions import ValidationError
from infra.models.user import User

_YEAR_MONTH_RE = re.compile(r"^\d{4}-\d{2}$")
_OPEN_STATUSES = frozenset({"pending", "approved", "processing", "rejected"})
_TERMINAL_STATUSES = frozenset({"closed", "revoked", "draft"})


def _year_month_of(dt: Optional[datetime]) -> Optional[str]:
    if not dt:
        return None
    site_day = to_site_date(dt)
    return f"{site_day.year:04d}-{site_day.month:02d}"


def _complaint_base_query(
    tenant_id: int,
    *,
    date_start: Optional[datetime] = None,
    date_end: Optional[datetime] = None,
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    supplier_id: Optional[int] = None,
    supplier_name: Optional[str] = None,
):
    query = QualityComplaint.filter(tenant_id=tenant_id, deleted_at__isnull=True)
    if date_start:
        query = query.filter(created_at__gte=date_start)
    if date_end:
        query = query.filter(created_at__lte=date_end)
    if status:
        query = query.filter(status=status.strip().lower())
    if supplier_id:
        query = query.filter(supplier_id=int(supplier_id))
    if supplier_name:
        query = query.filter(supplier_name__icontains=supplier_name.strip())
    if keyword:
        kw = keyword.strip()
        if kw:
            query = query.filter(
                Q(code__icontains=kw)
                | Q(title__icontains=kw)
                | Q(material_code__icontains=kw)
                | Q(material_name__icontains=kw)
                | Q(supplier_name__icontains=kw)
                | Q(customer_name__icontains=kw)
                | Q(batch_no__icontains=kw)
            )
    return query


async def build_quality_complaint_analysis_report(
    tenant_id: int,
    report_type: str,
    *,
    date_start: Optional[datetime] = None,
    date_end: Optional[datetime] = None,
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    supplier_id: Optional[int] = None,
    supplier_name: Optional[str] = None,
) -> Dict[str, Any]:
    rt = (report_type or "").strip().lower().replace("-", "_")
    query = _complaint_base_query(
        tenant_id,
        date_start=date_start,
        date_end=date_end,
        keyword=keyword,
        status=status,
        supplier_id=supplier_id,
        supplier_name=supplier_name,
    )

    if rt in {"complaint_monthly_list", "quality_complaint_monthly_list"}:
        rows = await query.order_by("-created_at", "-id").values(
            "id",
            "code",
            "title",
            "business_type",
            "status",
            "defect_category",
            "supplier_code",
            "supplier_name",
            "customer_name",
            "material_code",
            "material_name",
            "batch_no",
            "quantity",
            "due_at",
            "supplier_response",
            "created_at",
            "closed_at",
        )
        data = []
        for row in rows:
            created = row.get("created_at")
            data.append(
                {
                    **row,
                    "year_month": _year_month_of(created),
                    "business_type_label": QUALITY_COMPLAINT_TYPE_LABELS_ZH.get(
                        row.get("business_type") or "", row.get("business_type") or ""
                    ),
                    "defect_category_label": QUALITY_COMPLAINT_DEFECT_LABELS_ZH.get(
                        row.get("defect_category") or "", row.get("defect_category") or ""
                    ),
                    "quantity": float(row.get("quantity") or 0) if row.get("quantity") is not None else None,
                    "has_supplier_response": bool((row.get("supplier_response") or "").strip()),
                }
            )
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {"count": float(len(data))},
        }

    if rt in {"complaint_defect_distribution", "quality_complaint_defect_distribution"}:
        rows = await query.values("defect_category")
        counter: Dict[str, int] = defaultdict(int)
        for row in rows:
            key = (row.get("defect_category") or "").strip().lower() or "unset"
            counter[key] += 1
        total = sum(counter.values())
        data = []
        for key, count in sorted(counter.items(), key=lambda x: (-x[1], x[0])):
            data.append(
                {
                    "id": key,
                    "defect_category": key if key != "unset" else None,
                    "defect_category_label": (
                        QUALITY_COMPLAINT_DEFECT_LABELS_ZH.get(key, key)
                        if key != "unset"
                        else "未分类"
                    ),
                    "count": count,
                    "share_pct": round(count / total * 100, 2) if total else 0.0,
                }
            )
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {"count": float(total)},
        }

    if rt in {"complaint_supplier_rank", "quality_complaint_supplier_rank"}:
        rows = await query.filter(supplier_name__isnull=False).exclude(supplier_name="").values(
            "supplier_id", "supplier_code", "supplier_name", "batch_no"
        )
        # 按供方聚合：投诉次数 + 涉及批次数（去重 batch_no）
        agg: Dict[str, Dict[str, Any]] = {}
        for row in rows:
            name = (row.get("supplier_name") or "").strip()
            if not name:
                continue
            key = f"{row.get('supplier_id') or ''}:{name}"
            bucket = agg.setdefault(
                key,
                {
                    "id": key,
                    "supplier_id": row.get("supplier_id"),
                    "supplier_code": row.get("supplier_code") or "",
                    "supplier_name": name,
                    "complaint_count": 0,
                    "batch_nos": set(),
                },
            )
            bucket["complaint_count"] += 1
            batch = (row.get("batch_no") or "").strip()
            if batch:
                bucket["batch_nos"].add(batch)
        data = []
        for bucket in agg.values():
            batch_count = len(bucket.pop("batch_nos"))
            data.append({**bucket, "batch_fail_count": batch_count})
        data.sort(key=lambda x: (-int(x["batch_fail_count"]), -int(x["complaint_count"]), x["supplier_name"]))
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {
                "count": float(sum(int(x["complaint_count"]) for x in data)),
                "batch_fail_count": float(sum(int(x["batch_fail_count"]) for x in data)),
            },
        }

    if rt in {"complaint_supplier_trend", "quality_complaint_supplier_trend"}:
        if not supplier_id and not (supplier_name or "").strip():
            return {
                "data": [],
                "total": 0,
                "success": True,
                "summary": {"count": 0.0},
            }
        rows = await query.order_by("created_at").values("created_at", "batch_no", "status")
        month_map: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"complaint_count": 0, "batch_nos": set()}
        )
        for row in rows:
            ym = _year_month_of(row.get("created_at"))
            if not ym:
                continue
            bucket = month_map[ym]
            bucket["complaint_count"] += 1
            batch = (row.get("batch_no") or "").strip()
            if batch:
                bucket["batch_nos"].add(batch)
        data = []
        for ym in sorted(month_map.keys()):
            bucket = month_map[ym]
            data.append(
                {
                    "id": ym,
                    "year_month": ym,
                    "complaint_count": bucket["complaint_count"],
                    "batch_fail_count": len(bucket["batch_nos"]),
                }
            )
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {
                "count": float(sum(int(x["complaint_count"]) for x in data)),
            },
        }

    if rt in {"complaint_alert", "quality_complaint_alert"}:
        now = resolve_business_datetime()
        rows = await query.order_by("-due_at", "-created_at").values(
            "id",
            "code",
            "title",
            "business_type",
            "status",
            "supplier_name",
            "material_code",
            "material_name",
            "batch_no",
            "due_at",
            "supplier_response",
            "closed_at",
            "created_at",
        )
        data = []
        for row in rows:
            status_v = (row.get("status") or "").strip().lower()
            response = (row.get("supplier_response") or "").strip()
            due_at = row.get("due_at")
            alerts: List[str] = []
            if status_v in _OPEN_STATUSES and not response:
                alerts.append("unanswered")
            if due_at and status_v not in _TERMINAL_STATUSES and due_at < now:
                alerts.append("overdue")
            if status_v == "closed" and not response:
                alerts.append("closed_unverified")
            if not alerts:
                continue
            data.append(
                {
                    **row,
                    "id": row.get("id"),
                    "alert_types": ",".join(alerts),
                    "alert_type_label": " / ".join(
                        {
                            "unanswered": "未回复",
                            "overdue": "逾期未关闭",
                            "closed_unverified": "关闭未验证",
                        }.get(a, a)
                        for a in alerts
                    ),
                    "business_type_label": QUALITY_COMPLAINT_TYPE_LABELS_ZH.get(
                        row.get("business_type") or "", row.get("business_type") or ""
                    ),
                }
            )
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {"count": float(len(data))},
        }

    if rt in {"complaint_batch_rate", "quality_complaint_batch_rate"}:
        rows = await query.values("created_at", "batch_no")
        month_complaints: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"complaint_count": 0, "batch_nos": set()}
        )
        for row in rows:
            ym = _year_month_of(row.get("created_at"))
            if not ym:
                continue
            bucket = month_complaints[ym]
            bucket["complaint_count"] += 1
            batch = (row.get("batch_no") or "").strip()
            if batch:
                bucket["batch_nos"].add(batch)
        batch_rows = await QualityComplaintBatchMonth.filter(
            tenant_id=tenant_id, deleted_at__isnull=True
        ).values("year_month", "total_batch_count", "remarks")
        batch_map = {
            r["year_month"]: r for r in batch_rows if r.get("year_month")
        }
        months = sorted(set(month_complaints.keys()) | set(batch_map.keys()))
        data = []
        for ym in months:
            c = month_complaints.get(ym) or {"complaint_count": 0, "batch_nos": set()}
            b = batch_map.get(ym) or {}
            total_batches = int(b.get("total_batch_count") or 0)
            complaint_count = int(c["complaint_count"])
            rate = round(complaint_count / total_batches * 100, 2) if total_batches > 0 else None
            data.append(
                {
                    "id": ym,
                    "year_month": ym,
                    "complaint_count": complaint_count,
                    "batch_fail_count": len(c.get("batch_nos") or set()),
                    "total_batch_count": total_batches if total_batches > 0 else None,
                    "complaint_rate_pct": rate,
                    "remarks": b.get("remarks"),
                }
            )
        return {
            "data": data,
            "total": len(data),
            "success": True,
            "summary": {
                "count": float(sum(int(x["complaint_count"]) for x in data)),
            },
        }

    raise ValidationError(f"未知投诉分析报表类型: {report_type}")


class QualityComplaintBatchMonthService:
    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 50,
        year_month: Optional[str] = None,
    ) -> QualityComplaintBatchMonthListResponse:
        query = QualityComplaintBatchMonth.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if year_month:
            query = query.filter(year_month=year_month.strip())
        total = await query.count()
        rows = await query.order_by("-year_month").offset(skip).limit(limit)
        return QualityComplaintBatchMonthListResponse(
            data=[QualityComplaintBatchMonthResponse.model_validate(r) for r in rows],
            total=total,
            success=True,
        )

    async def upsert(
        self,
        tenant_id: int,
        data: QualityComplaintBatchMonthUpsert,
        user: User,
    ) -> QualityComplaintBatchMonthResponse:
        ym = data.year_month.strip()
        if not _YEAR_MONTH_RE.match(ym):
            raise ValidationError("统计月格式须为 YYYY-MM")
        row = await QualityComplaintBatchMonth.filter(
            tenant_id=tenant_id, year_month=ym, deleted_at__isnull=True
        ).first()
        if row:
            row.total_batch_count = int(data.total_batch_count)
            row.remarks = data.remarks
            apply_update_audit(row, user)
            await row.save()
        else:
            row = QualityComplaintBatchMonth(
                tenant_id=tenant_id,
                uuid=str(uuid.uuid4()),
                year_month=ym,
                total_batch_count=int(data.total_batch_count),
                remarks=data.remarks,
            )
            apply_create_audit(row, user)
            await row.save()
        return QualityComplaintBatchMonthResponse.model_validate(row)
