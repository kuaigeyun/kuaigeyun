"""生产文件中心（R-06 / #18、#29）。

同一中心两类目录策略：
- pe_production：工序 → 产品型号；生产使用方仅最新生产版（INF-05 PRODUCTION）
- rd_tool：项目代号 → 发布日期；保留历史（制定方/全局总查看可见）

不替代产品固件（R-15 #28），不替代 R-16 扫码打印作业。
"""

from tortoise import fields

from core.models.base import BaseModel


class ProductionFile(BaseModel):
    """生产文件目录头表（当前版本快照）。"""

    class Meta:
        table = "apps_kuaiplm_production_files"
        table_description = "快研发 - 生产文件中心"
        unique_together = [("tenant_id", "file_code")]
        indexes = [
            ("tenant_id", "catalog_kind", "status"),
            ("tenant_id", "process_code", "product_model"),
            ("tenant_id", "project_id"),
            ("tenant_id", "file_type"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    file_code = fields.CharField(max_length=50, description="文件单号")
    catalog_kind = fields.CharField(
        max_length=20,
        description="pe_production / rd_tool",
    )
    file_type = fields.CharField(max_length=40, description="文件类型")
    title = fields.CharField(max_length=200, description="标题")
    # PE 目录
    process_code = fields.CharField(max_length=80, null=True, description="工序编码")
    process_name = fields.CharField(max_length=200, null=True, description="工序名称")
    product_model = fields.CharField(max_length=120, null=True, description="产品型号")
    # 研发目录
    project_id = fields.IntField(null=True, description="研发项目ID")
    project_code = fields.CharField(max_length=50, null=True, description="项目代号快照")
    project_name = fields.CharField(max_length=200, null=True, description="项目名称快照")
    release_date = fields.DateField(null=True, description="当前版发布日期")
    # 当前版本快照
    version = fields.CharField(max_length=30, description="当前版本号")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/effective/obsolete/rejected",
    )
    file_uuid = fields.CharField(max_length=36, null=True, description="core file UUID")
    file_name = fields.CharField(max_length=200, null=True, description="文件名快照")
    checksum = fields.CharField(max_length=128, null=True, description="校验和")
    change_summary = fields.TextField(null=True, description="更改明细")
    remarks = fields.TextField(null=True, description="备注")
    issued_by = fields.IntField(null=True, description="最近发放人")
    issued_by_name = fields.CharField(max_length=100, null=True, description="发放人姓名")
    issued_at = fields.DatetimeField(null=True, description="最近发放时间")
    receiver_names = fields.CharField(max_length=500, null=True, description="接收人姓名快照")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    approved_at = fields.DatetimeField(null=True, description="审核通过并生效时间")
    obsolete_at = fields.DatetimeField(null=True, description="作废时间")
    deleted_at = fields.DatetimeField(null=True, description="软删除")


class ProductionFileVersion(BaseModel):
    """生产文件版本链（INF-05）。"""

    class Meta:
        table = "apps_kuaiplm_production_file_versions"
        table_description = "快研发 - 生产文件版本链"
        unique_together = [("tenant_id", "file_id", "version")]
        indexes = [
            ("tenant_id", "file_id", "status"),
            ("tenant_id", "file_id", "is_effective"),
            ("tenant_id", "file_id", "is_production_effective"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    file_id = fields.IntField(description="生产文件头表 ID")
    file_code = fields.CharField(max_length=50, description="文件单号快照")
    version = fields.CharField(max_length=30, description="版本号")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/effective/obsolete/rejected",
    )
    is_effective = fields.BooleanField(default=False, description="是否当前生效版")
    is_production_effective = fields.BooleanField(
        default=False,
        description="是否当前生产下发版（PE 策略）",
    )
    title = fields.CharField(max_length=200, description="标题快照")
    file_type = fields.CharField(max_length=40, null=True, description="类型快照")
    release_date = fields.DateField(null=True, description="发布日期")
    file_uuid = fields.CharField(max_length=36, null=True, description="core file UUID")
    file_name = fields.CharField(max_length=200, null=True, description="文件名")
    checksum = fields.CharField(max_length=128, null=True, description="校验和")
    change_summary = fields.TextField(null=True, description="更改明细")
    effective_at = fields.DatetimeField(null=True, description="生效时间")
    obsolete_at = fields.DatetimeField(null=True, description="作废时间")
    deleted_at = fields.DatetimeField(null=True, description="软删除")


class ProductionFileAccessLog(BaseModel):
    """发放、调阅、下载记录。"""

    class Meta:
        table = "apps_kuaiplm_production_file_access_logs"
        table_description = "快研发 - 生产文件访问日志"
        indexes = [
            ("tenant_id", "file_id", "created_at"),
            ("tenant_id", "action"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    file_id = fields.IntField(description="生产文件头表 ID")
    file_code = fields.CharField(max_length=50, description="文件单号快照")
    version_id = fields.IntField(null=True, description="版本行 ID")
    version = fields.CharField(max_length=30, null=True, description="版本号快照")
    action = fields.CharField(max_length=20, description="view/download/issue")
    actor_user_id = fields.IntField(null=True, description="操作人")
    actor_name = fields.CharField(max_length=100, null=True, description="操作人姓名")
    receiver_names = fields.CharField(max_length=500, null=True, description="接收人（发放）")
    remark = fields.CharField(max_length=500, null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True, description="软删除")
