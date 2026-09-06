"""
变更工作台服务 — 聚合 BOM / 工艺路线 / 图纸 / 工程变更(ECN)

Author: RiverEdge Team
Date: 2026-05-28
"""

from typing import Optional

from apps.kuaiplm.models.engineering_change import EngineeringChange
from apps.kuaiplm.schemas.change_desk import (
    ChangeApproveRequest,
    ChangeBatchActionResponse,
    ChangeBatchItem,
    ChangeCreateRequest,
    ChangeDeskItem,
    ChangeDeskListResponse,
    ChangeExecuteRequest,
    ChangeSubmitRequest,
)
from apps.kuaiplm.services.engineering_change_service import EngineeringChangeService
from apps.master_data.schemas.drawing_change_schemas import DrawingChangeCreate
from apps.master_data.services.bom_change_service import BOMChangeService
from apps.master_data.services.drawing_change_service import DrawingChangeService
from apps.master_data.services.process_route_change_service import ProcessRouteChangeService
from core.services.approval.audit_record_enricher import enrich_items
from infra.exceptions.exceptions import ValidationError, NotFoundError
from infra.models.user import User
from infra.services.user_service import UserService


class ChangeDeskService:
    def __init__(self) -> None:
        self._ecn = EngineeringChangeService()

    async def _require_user(self, user_id: int) -> User:
        user = await UserService().get_user_by_id(user_id)
        if not user:
            raise ValidationError("用户不存在")
        return user

    async def _enrich_desk_items(self, tenant_id: int, items: list[ChangeDeskItem]) -> list[ChangeDeskItem]:
        if not items:
            return items
        bom_rows = [item for item in items if item.category == "bom"]
        route_rows = [item for item in items if item.category == "process_route"]
        drawing_rows = [item for item in items if item.category == "drawing"]
        ecn_rows = [item for item in items if item.category == "ecn"]
        bom_by_uuid: dict[str, ChangeDeskItem] = {}
        route_by_uuid: dict[str, ChangeDeskItem] = {}
        drawing_by_uuid: dict[str, ChangeDeskItem] = {}
        ecn_by_uuid: dict[str, ChangeDeskItem] = {}
        if bom_rows:
            enriched_bom = await enrich_items(tenant_id, "bom_change", bom_rows)
            bom_by_uuid = {item.uuid: item for item in enriched_bom}
        if route_rows:
            enriched_route = await enrich_items(tenant_id, "process_route_change", route_rows)
            route_by_uuid = {item.uuid: item for item in enriched_route}
        if drawing_rows:
            enriched_drawing = await enrich_items(tenant_id, "drawing_change", drawing_rows)
            drawing_by_uuid = {item.uuid: item for item in enriched_drawing}
        if ecn_rows:
            enriched_ecn = await enrich_items(tenant_id, "engineering_change", ecn_rows)
            ecn_by_uuid = {item.uuid: item for item in enriched_ecn}
        return [
            bom_by_uuid.get(item.uuid, item)
            if item.category == "bom"
            else route_by_uuid.get(item.uuid, item)
            if item.category == "process_route"
            else drawing_by_uuid.get(item.uuid, item)
            if item.category == "drawing"
            else ecn_by_uuid.get(item.uuid, item)
            if item.category == "ecn"
            else item
            for item in items
        ]

    def _append_ecn_row(self, items: list[ChangeDeskItem], row: EngineeringChange) -> None:
        items.append(
            ChangeDeskItem(
                id=row.id,
                category="ecn",
                change_type=row.change_kind,
                uuid=str(row.uuid),
                status=row.status,
                change_content=None,
                change_reason=row.change_reason,
                applicant_id=row.created_by,
                created_at=row.created_at,
                updated_at=row.updated_at,
                created_by_name=row.created_by_name,
                updated_by_name=row.updated_by_name,
                entity_code=row.ecn_code,
                entity_name=row.title,
                extra={
                    "project_id": row.project_id,
                    "project_code": row.project_code,
                    "project_name": row.project_name,
                    "erp_ecn_no": row.erp_ecn_no,
                    "erp_audit_status": row.erp_audit_status,
                },
            )
        )

    async def _list_ecn_rows(
        self,
        tenant_id: int,
        *,
        status: Optional[str],
        keyword: Optional[str],
        change_code: Optional[str],
        target_name: Optional[str],
        page: int,
        page_size: int,
    ):
        query = EngineeringChange.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            query = query.filter(status=status)
        if change_code:
            query = query.filter(ecn_code__icontains=change_code)
        if target_name:
            query = query.filter(title__icontains=target_name)
        if keyword:
            query = query.filter(title__icontains=keyword)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset((page - 1) * page_size).limit(page_size)
        return rows, total

    async def list_changes(
        self,
        tenant_id: int,
        status: Optional[str] = None,
        change_type: Optional[str] = None,
        keyword: Optional[str] = None,
        change_code: Optional[str] = None,
        target_name: Optional[str] = None,
        created_start_date: Optional[str] = None,
        created_end_date: Optional[str] = None,
        updated_start_date: Optional[str] = None,
        updated_end_date: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> ChangeDeskListResponse:
        items: list[ChangeDeskItem] = []
        bom_total = 0
        route_total = 0
        drawing_total = 0
        ecn_total = 0
        search_kwargs = {
            "keyword": keyword,
            "change_code": change_code,
            "target_name": target_name,
            "created_start_date": created_start_date,
            "created_end_date": created_end_date,
            "updated_start_date": updated_start_date,
            "updated_end_date": updated_end_date,
        }

        def append_bom_row(row) -> None:
            items.append(ChangeDeskItem(
                id=row.id,
                category="bom",
                change_type=row.change_type,
                uuid=row.uuid,
                status=row.status,
                change_content=row.change_content,
                change_reason=row.change_reason,
                applicant_id=row.applicant_id,
                created_at=row.created_at,
                updated_at=row.updated_at,
                created_by_name=getattr(row, "created_by_name", None),
                updated_by_name=getattr(row, "updated_by_name", None),
                entity_code=getattr(row, "material_code", None),
                entity_name=getattr(row, "material_name", None),
                extra={
                    "bom_code": row.bom_code,
                    "from_version": row.from_version,
                    "to_version": row.to_version,
                },
            ))

        def append_route_row(row) -> None:
            items.append(ChangeDeskItem(
                id=row.id,
                category="process_route",
                change_type=row.change_type,
                uuid=row.uuid,
                status=row.status,
                change_content=row.change_content,
                change_reason=row.change_reason,
                applicant_id=row.applicant_id,
                created_at=row.created_at,
                updated_at=row.updated_at,
                created_by_name=getattr(row, "created_by_name", None) or getattr(row, "applicant_name", None),
                updated_by_name=getattr(row, "updated_by_name", None),
                entity_code=getattr(row, "process_route_code", None),
                entity_name=getattr(row, "process_route_name", None),
            ))

        def append_drawing_row(row) -> None:
            items.append(ChangeDeskItem(
                id=row.id,
                category="drawing",
                change_type=row.change_type,
                uuid=row.uuid,
                status=row.status,
                change_content=row.change_content,
                change_reason=row.change_reason,
                applicant_id=row.applicant_id,
                created_at=row.created_at,
                updated_at=row.updated_at,
                created_by_name=getattr(row, "created_by_name", None),
                updated_by_name=getattr(row, "updated_by_name", None),
                entity_code=getattr(row, "drawing_code", None),
                entity_name=getattr(row, "drawing_name", None),
                extra={
                    "drawing_revision": getattr(row, "drawing_revision", None),
                    "result_drawing_uuid": getattr(row, "result_drawing_uuid", None),
                },
            ))

        if change_type is None:
            fetch_limit = page * page_size
            bom_resp = await BOMChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=1,
                page_size=fetch_limit,
                **search_kwargs,
            )
            bom_total = bom_resp.total
            for row in bom_resp.items:
                append_bom_row(row)

            route_resp = await ProcessRouteChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=1,
                page_size=fetch_limit,
                **search_kwargs,
            )
            route_total = route_resp.total
            for row in route_resp.items:
                append_route_row(row)

            drawing_resp = await DrawingChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=1,
                page_size=fetch_limit,
                **search_kwargs,
            )
            drawing_total = drawing_resp.total
            for row in drawing_resp.items:
                append_drawing_row(row)

            ecn_rows, ecn_total = await self._list_ecn_rows(
                tenant_id,
                status=status,
                keyword=keyword,
                change_code=change_code,
                target_name=target_name,
                page=1,
                page_size=fetch_limit,
            )
            for row in ecn_rows:
                self._append_ecn_row(items, row)

            items.sort(key=lambda x: x.created_at, reverse=True)
            offset = (page - 1) * page_size
            items = items[offset : offset + page_size]
            total = bom_total + route_total + drawing_total + ecn_total
        elif change_type == "bom":
            bom_resp = await BOMChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=page,
                page_size=page_size,
                **search_kwargs,
            )
            bom_total = bom_resp.total
            for row in bom_resp.items:
                append_bom_row(row)
            total = bom_total
        elif change_type == "drawing":
            drawing_resp = await DrawingChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=page,
                page_size=page_size,
                **search_kwargs,
            )
            drawing_total = drawing_resp.total
            for row in drawing_resp.items:
                append_drawing_row(row)
            total = drawing_total
        elif change_type == "process_route":
            route_resp = await ProcessRouteChangeService.list_changes(
                tenant_id=tenant_id,
                status=status,
                page=page,
                page_size=page_size,
                **search_kwargs,
            )
            route_total = route_resp.total
            for row in route_resp.items:
                append_route_row(row)
            total = route_total
        elif change_type == "ecn":
            ecn_rows, ecn_total = await self._list_ecn_rows(
                tenant_id,
                status=status,
                keyword=keyword,
                change_code=change_code,
                target_name=target_name,
                page=page,
                page_size=page_size,
            )
            for row in ecn_rows:
                self._append_ecn_row(items, row)
            total = ecn_total
        else:
            raise ValidationError(f"未知变更类型: {change_type}")

        items = await self._enrich_desk_items(tenant_id, items)
        return ChangeDeskListResponse(items=items, total=total)

    async def create_change(self, tenant_id: int, data: ChangeCreateRequest, user_id: int):
        if data.change_type != "drawing":
            raise ValidationError(
                "变更台仅支持在本页创建图纸变更；BOM/工艺请到主数据维护页；工程变更请用工程变更新建"
            )
        return await DrawingChangeService.create_change(
            tenant_id,
            DrawingChangeCreate.model_validate({
                "drawingUuid": data.drawing_uuid,
                "changeType": data.drawing_change_type,
                "changeReason": data.change_reason,
                "changeContent": data.change_content,
            }),
            user_id,
        )

    async def get_change(self, tenant_id: int, change_uuid: str, change_type: str):
        if change_type == "drawing":
            return await DrawingChangeService.get_change_by_uuid(tenant_id, change_uuid)
        if change_type == "bom":
            return await BOMChangeService.get_change_by_uuid(tenant_id, change_uuid)
        if change_type == "process_route":
            return await ProcessRouteChangeService.get_change_by_uuid(tenant_id, change_uuid)
        if change_type == "ecn":
            return await self._ecn.get_by_uuid(tenant_id, change_uuid)
        raise ValidationError(f"未知变更类型: {change_type}")

    async def submit_change(
        self, tenant_id: int, change_uuid: str, data: ChangeSubmitRequest, user_id: int
    ):
        if data.change_type == "bom":
            change = await BOMChangeService.get_change_by_uuid(tenant_id, change_uuid)
            return await BOMChangeService.submit_change(tenant_id, change.id, user_id)
        if data.change_type == "process_route":
            change = await ProcessRouteChangeService.get_change_by_uuid(tenant_id, change_uuid)
            return await ProcessRouteChangeService.submit_change(tenant_id, change.id, user_id)
        if data.change_type == "drawing":
            return await DrawingChangeService.submit_change(tenant_id, change_uuid, user_id)
        if data.change_type == "ecn":
            user = await self._require_user(user_id)
            detail = await self._ecn.get_by_uuid(tenant_id, change_uuid)
            return await self._ecn.submit(tenant_id, detail.id, user)
        raise ValidationError(f"未知变更类型: {data.change_type}")

    async def approve_change(
        self, tenant_id: int, change_uuid: str, data: ChangeApproveRequest, user_id: int
    ):
        if data.change_type == "bom":
            return await BOMChangeService.approve_change(
                tenant_id, change_uuid, user_id, data.approved, data.approval_comment
            )
        if data.change_type == "process_route":
            return await ProcessRouteChangeService.approve_change(
                tenant_id, change_uuid, user_id, data.approved, data.approval_comment
            )
        if data.change_type == "drawing":
            return await DrawingChangeService.approve_change(
                tenant_id, change_uuid, user_id, data.approved, data.approval_comment
            )
        if data.change_type == "ecn":
            user = await self._require_user(user_id)
            detail = await self._ecn.get_by_uuid(tenant_id, change_uuid)
            if data.approved:
                return await self._ecn.approve(tenant_id, detail.id, user)
            return await self._ecn.reject(tenant_id, detail.id, user)
        raise ValidationError(f"未知变更类型: {data.change_type}")

    async def execute_change(
        self, tenant_id: int, change_uuid: str, data: ChangeExecuteRequest, user_id: int
    ):
        if data.change_type == "bom":
            return await BOMChangeService.execute_change(tenant_id, change_uuid, user_id)
        if data.change_type == "process_route":
            return await ProcessRouteChangeService.execute_change(tenant_id, change_uuid, user_id)
        if data.change_type == "drawing":
            executor = await UserService().get_user_by_id(user_id)
            if not executor:
                raise ValidationError("执行人不存在")
            return await DrawingChangeService.execute_change(tenant_id, change_uuid, executor)
        if data.change_type == "ecn":
            raise ValidationError("工程变更无「执行」动作，请在详情中完成 ERP 稽核回填")
        raise ValidationError(f"未知变更类型: {data.change_type}")

    async def delete_change(
        self, tenant_id: int, change_uuid: str, change_type: str, user_id: Optional[int] = None
    ) -> None:
        if change_type == "bom":
            await BOMChangeService.delete_change(tenant_id, change_uuid)
            return
        if change_type == "process_route":
            await ProcessRouteChangeService.delete_change(tenant_id, change_uuid)
            return
        if change_type == "drawing":
            await DrawingChangeService.delete_change(tenant_id, change_uuid)
            return
        if change_type == "ecn":
            if user_id is None:
                raise ValidationError("删除工程变更须提供操作人")
            user = await self._require_user(user_id)
            await self._ecn.delete_by_uuid(tenant_id, change_uuid, user)
            return
        raise ValidationError(f"未知变更类型: {change_type}")

    async def batch_approve_changes(
        self,
        tenant_id: int,
        items: list[ChangeBatchItem],
        approved: bool,
        approval_comment: Optional[str],
        user_id: int,
    ) -> ChangeBatchActionResponse:
        success_count = 0
        failed_items: list[ChangeBatchItem] = []
        errors: list[str] = []
        for item in items:
            try:
                await self.approve_change(
                    tenant_id=tenant_id,
                    change_uuid=item.change_uuid,
                    data=ChangeApproveRequest(
                        change_type=item.change_type,
                        approved=approved,
                        approval_comment=approval_comment,
                    ),
                    user_id=user_id,
                )
                success_count += 1
            except (ValueError, ValidationError) as e:
                failed_items.append(item)
                errors.append(str(e))
        return ChangeBatchActionResponse(
            success_count=success_count,
            failed_count=len(failed_items),
            failed_items=failed_items,
            errors=errors,
        )

    async def batch_execute_changes(
        self,
        tenant_id: int,
        items: list[ChangeBatchItem],
        user_id: int,
    ) -> ChangeBatchActionResponse:
        success_count = 0
        failed_items: list[ChangeBatchItem] = []
        errors: list[str] = []
        for item in items:
            try:
                await self.execute_change(
                    tenant_id=tenant_id,
                    change_uuid=item.change_uuid,
                    data=ChangeExecuteRequest(change_type=item.change_type),
                    user_id=user_id,
                )
                success_count += 1
            except (ValueError, ValidationError) as e:
                failed_items.append(item)
                errors.append(str(e))
        return ChangeBatchActionResponse(
            success_count=success_count,
            failed_count=len(failed_items),
            failed_items=failed_items,
            errors=errors,
        )

    async def batch_delete_changes(
        self,
        tenant_id: int,
        items: list[ChangeBatchItem],
        user_id: Optional[int] = None,
    ) -> ChangeBatchActionResponse:
        success_count = 0
        failed_items: list[ChangeBatchItem] = []
        errors: list[str] = []
        seen: set[tuple[str, str]] = set()
        for item in items:
            dedupe_key = (item.change_uuid, item.change_type)
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)
            try:
                await self.delete_change(
                    tenant_id=tenant_id,
                    change_uuid=item.change_uuid,
                    change_type=item.change_type,
                    user_id=user_id,
                )
                success_count += 1
            except NotFoundError:
                success_count += 1
            except (ValueError, ValidationError) as e:
                failed_items.append(item)
                errors.append(str(e))
        return ChangeBatchActionResponse(
            success_count=success_count,
            failed_count=len(failed_items),
            failed_items=failed_items,
            errors=errors,
        )
