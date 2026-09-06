"""Tortoise ORM 模块注册（运行时按应用中心启用状态加载）。"""

ORM_MODEL_MODULES: list[str] = [
    "apps.kuaiplm.models.gate_template",
    "apps.kuaiplm.models.knowledge_base",
    "apps.kuaiplm.models.phase2",
    "apps.kuaiplm.models.rd_project",
    "apps.kuaiplm.models.rd_project_deliverable_version",
    "apps.kuaiplm.models.product_firmware",
    "apps.kuaiplm.models.production_file",
    "apps.kuaiplm.models.trial_flow",
    "apps.kuaiplm.models.lab_request",
    "apps.kuaiplm.models.lab_judgment_rule",
    "apps.kuaiplm.models.annual_lab_plan",
    "apps.kuaiplm.models.engineering_change",
    "apps.kuaiplm.models.sample_process",
    "apps.kuaiplm.models.material_review",
    "apps.kuaiplm.models.bom_collaboration",
    "apps.kuaiplm.models.project_proposal",
    "apps.kuaiplm.models.mold_sample_order",
]
