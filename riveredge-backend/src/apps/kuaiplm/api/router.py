"""
快研发 (kuaiplm) APP - 主路由
"""

from fastapi import APIRouter

from .projects import router as projects_router
from .knowledge import router as knowledge_router
from .changes import router as changes_router
from .dashboard import router as dashboard_router
from .phase2 import router as phase2_router
from .gate_templates import router as gate_templates_router
from .product_firmwares import router as product_firmwares_router
from .production_files import router as production_files_router
from .trial_flows import router as trial_flows_router
from .lab_requests import router as lab_requests_router
from .lab_judgment_rules import router as lab_judgment_rules_router
from .annual_lab_plans import router as annual_lab_plans_router
from .engineering_changes import router as engineering_changes_router
from apps.kuaiplm.services import kuaiplm_business_notification as _kuaiplm_notify  # noqa: F401
from .sample_processes import router as sample_processes_router
from .material_reviews import router as material_reviews_router
from .bom_collaborations import router as bom_collaborations_router
from .project_proposals import router as project_proposals_router
from .mold_sample_orders import router as mold_sample_orders_router
from .routes_config import router as config_router

router = APIRouter(tags=["App - Kuaiplm - Overview"])

router.include_router(projects_router)
router.include_router(knowledge_router)
router.include_router(changes_router)
router.include_router(dashboard_router)
router.include_router(phase2_router)
router.include_router(gate_templates_router)
router.include_router(product_firmwares_router)
router.include_router(production_files_router)
router.include_router(trial_flows_router)
router.include_router(lab_requests_router)
router.include_router(lab_judgment_rules_router)
router.include_router(annual_lab_plans_router)
router.include_router(engineering_changes_router)
router.include_router(sample_processes_router)
router.include_router(material_reviews_router)
router.include_router(bom_collaborations_router)
router.include_router(project_proposals_router)
router.include_router(mold_sample_orders_router)
router.include_router(config_router)


@router.get("/health")
async def health_check():
    return {"status": "ok", "app": "kuaiplm"}
