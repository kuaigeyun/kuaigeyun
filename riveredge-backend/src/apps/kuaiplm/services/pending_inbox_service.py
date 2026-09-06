"""优先一跨项目待办聚合（R-15 / R-08 / R-04）。"""

from __future__ import annotations

from typing import List, Optional

from apps.kuaiplm.models.bom_collaboration import BomCollaboration
from apps.kuaiplm.models.engineering_change import EngineeringChange
from apps.kuaiplm.models.material_review import MaterialReview
from apps.kuaiplm.models.mold_sample_order import MoldSampleOrder
from apps.kuaiplm.models.product_firmware import ProductFirmware
from apps.kuaiplm.models.project_proposal import ProjectProposal
from apps.kuaiplm.models.sample_process import SampleProcessApplication
from apps.kuaiplm.models.trial_flow import TrialFlow
from apps.kuaiplm.schemas.rd_project import PendingInboxItem, PendingInboxListResponse


class PendingInboxService:
    """聚合待审状态单据，供跨项目待办与联调演示。"""

    async def list(
        self,
        tenant_id: int,
        *,
        project_id: Optional[int] = None,
        doc_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> PendingInboxListResponse:
        items: List[PendingInboxItem] = []

        async def _collect_firmware() -> None:
            q = ProductFirmware.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="product_firmware",
                        doc_id=row.id,
                        doc_code=row.firmware_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/product-firmwares",
                    )
                )

        async def _collect_sample() -> None:
            q = SampleProcessApplication.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="sample_process",
                        doc_id=row.id,
                        doc_code=row.application_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/sample-process-applications",
                    )
                )

        async def _collect_material_review() -> None:
            q = MaterialReview.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="material_review",
                        doc_id=row.id,
                        doc_code=row.review_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/material-reviews",
                    )
                )

        async def _collect_bom() -> None:
            q = BomCollaboration.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="bom_collab",
                        doc_id=row.id,
                        doc_code=row.collab_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/bom-collaborations",
                    )
                )

        async def _collect_proposal() -> None:
            q = ProjectProposal.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="project_proposal",
                        doc_id=row.id,
                        doc_code=row.proposal_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/project-proposals",
                    )
                )

        async def _collect_mold() -> None:
            q = MoldSampleOrder.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="mold_sample",
                        doc_id=row.id,
                        doc_code=row.order_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/mold-sample-orders",
                    )
                )

        async def _collect_trial() -> None:
            q = TrialFlow.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="trial_flow",
                        doc_id=row.id,
                        doc_code=row.trial_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/trial-flows",
                    )
                )

        async def _collect_ecn() -> None:
            q = EngineeringChange.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                status__in=["pending", "erp_pending"],
            )
            if project_id:
                q = q.filter(project_id=project_id)
            for row in await q.order_by("-updated_at").limit(200):
                items.append(
                    PendingInboxItem(
                        doc_type="engineering_change",
                        doc_id=row.id,
                        doc_code=row.ecn_code,
                        title=row.title,
                        status=row.status,
                        project_id=row.project_id,
                        project_code=row.project_code,
                        project_name=row.project_name,
                        updated_at=row.updated_at,
                        list_path="/apps/kuaiplm/change-management?tab=ecn",
                    )
                )

        collectors = {
            "product_firmware": _collect_firmware,
            "sample_process": _collect_sample,
            "material_review": _collect_material_review,
            "bom_collab": _collect_bom,
            "project_proposal": _collect_proposal,
            "mold_sample": _collect_mold,
            "trial_flow": _collect_trial,
            "engineering_change": _collect_ecn,
        }
        if doc_type:
            fn = collectors.get(doc_type)
            if fn:
                await fn()
        else:
            for fn in collectors.values():
                await fn()

        items.sort(key=lambda x: x.updated_at or x.doc_id, reverse=True)
        total = len(items)
        page = items[skip : skip + limit]
        return PendingInboxListResponse(items=page, total=total)

    async def pending_count(self, tenant_id: int) -> int:
        firmware = await ProductFirmware.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        sample = await SampleProcessApplication.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        material = await MaterialReview.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        bom = await BomCollaboration.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        proposal = await ProjectProposal.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        mold = await MoldSampleOrder.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        trial = await TrialFlow.filter(
            tenant_id=tenant_id, deleted_at__isnull=True, status="pending"
        ).count()
        ecn = await EngineeringChange.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            status__in=["pending", "erp_pending"],
        ).count()
        return firmware + sample + material + bom + proposal + mold + trial + ecn
