"""打印工位桥接服务（INF-07）。"""

from __future__ import annotations

from typing import Any, Dict, Optional

from tortoise.exceptions import IntegrityError

from core.models.print_job import PrintJob
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import ValidationError


class PrintBridgeService:
    """受控打印请求：幂等登记，成功仅以桥接回执为准。"""

    @staticmethod
    async def submit_job(
        tenant_id: int,
        *,
        idempotency_key: str,
        template_uuid: str,
        payload_snapshot: Dict[str, Any],
        copies: int = 1,
        device_uuid: Optional[str] = None,
        template_version: Optional[int] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[int] = None,
        entity_uuid: Optional[str] = None,
        is_reprint: bool = False,
        source_job_id: Optional[int] = None,
        requested_by: Optional[int] = None,
        requested_by_name: Optional[str] = None,
    ) -> PrintJob:
        key = str(idempotency_key or "").strip()
        if not key:
            raise ValidationError("打印幂等键不能为空")
        if not template_uuid:
            raise ValidationError("打印模板不能为空")
        if not isinstance(payload_snapshot, dict) or not payload_snapshot:
            raise ValidationError("打印数据快照不能为空")
        if copies < 1:
            raise ValidationError("打印份数必须大于 0")

        existing = await PrintJob.filter(
            tenant_id=tenant_id,
            idempotency_key=key,
            deleted_at__isnull=True,
        ).first()
        if existing:
            return existing

        try:
            return await PrintJob.create(
                tenant_id=tenant_id,
                idempotency_key=key,
                template_uuid=str(template_uuid),
                template_version=template_version,
                device_uuid=device_uuid,
                copies=copies,
                entity_type=entity_type,
                entity_id=entity_id,
                entity_uuid=entity_uuid,
                payload_snapshot=payload_snapshot,
                status="pending",
                is_reprint=is_reprint,
                source_job_id=source_job_id,
                requested_by=requested_by,
                requested_by_name=requested_by_name,
            )
        except IntegrityError:
            existing = await PrintJob.filter(
                tenant_id=tenant_id,
                idempotency_key=key,
                deleted_at__isnull=True,
            ).first()
            if existing:
                return existing
            raise

    @staticmethod
    async def mark_sent_to_bridge(tenant_id: int, job_id: int) -> PrintJob:
        job = await PrintJob.filter(
            tenant_id=tenant_id, id=job_id, deleted_at__isnull=True
        ).first()
        if not job:
            raise ValidationError("打印任务不存在")
        if job.status == "success":
            return job
        job.status = "sent"
        await job.save(update_fields=["status", "updated_at"])
        return job

    @staticmethod
    async def apply_bridge_receipt(
        tenant_id: int,
        job_id: int,
        *,
        success: bool,
        receipt: Optional[Dict[str, Any]] = None,
        error_message: Optional[str] = None,
    ) -> PrintJob:
        """桥接回执：仅此处可将任务标为 success。生成预览不算成功。"""
        job = await PrintJob.filter(
            tenant_id=tenant_id, id=job_id, deleted_at__isnull=True
        ).first()
        if not job:
            raise ValidationError("打印任务不存在")
        job.bridge_receipt = receipt or {}
        if success:
            job.status = "success"
            job.error_message = None
            job.completed_at = resolve_business_datetime()
        else:
            job.status = "failed"
            job.error_message = (error_message or "桥接打印失败")[:2000]
        await job.save(
            update_fields=[
                "bridge_receipt",
                "status",
                "error_message",
                "completed_at",
                "updated_at",
            ]
        )
        return job

    @staticmethod
    async def create_reprint(
        tenant_id: int,
        source_job_id: int,
        *,
        idempotency_key: str,
        requested_by: Optional[int] = None,
        requested_by_name: Optional[str] = None,
    ) -> PrintJob:
        source = await PrintJob.filter(
            tenant_id=tenant_id, id=source_job_id, deleted_at__isnull=True
        ).first()
        if not source:
            raise ValidationError("原打印任务不存在，无法补打")
        if source.status != "success":
            raise ValidationError("仅成功打印任务允许补打")
        return await PrintBridgeService.submit_job(
            tenant_id,
            idempotency_key=idempotency_key,
            template_uuid=source.template_uuid,
            payload_snapshot=dict(source.payload_snapshot or {}),
            copies=source.copies,
            device_uuid=source.device_uuid,
            template_version=source.template_version,
            entity_type=source.entity_type,
            entity_id=source.entity_id,
            entity_uuid=source.entity_uuid,
            is_reprint=True,
            source_job_id=source.id,
            requested_by=requested_by,
            requested_by_name=requested_by_name,
        )
