"""
设备运营表（点检/巡检/保养等）补齐 BaseModel 审计列。

427 建表时未含 created_by / created_by_name 等；若环境未吃到 454 全库补齐，
新建点检单会报 column "created_by_name" does not exist。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True

_TABLES = (
    "apps_kuaizhizao_equipment_inspection_items",
    "apps_kuaizhizao_equipment_inspection_schemes",
    "apps_kuaizhizao_equipment_inspection_scheme_lines",
    "apps_kuaizhizao_equipment_scheme_bindings",
    "apps_kuaizhizao_equipment_patrol_routes",
    "apps_kuaizhizao_equipment_patrol_route_steps",
    "apps_kuaizhizao_equipment_maintenance_items",
    "apps_kuaizhizao_equipment_maintenance_schemes",
    "apps_kuaizhizao_equipment_maintenance_scheme_lines",
    "apps_kuaizhizao_equipment_spot_checks",
    "apps_kuaizhizao_equipment_spot_check_lines",
    "apps_kuaizhizao_equipment_route_patrols",
    "apps_kuaizhizao_equipment_route_patrol_lines",
    "apps_kuaizhizao_equipment_scrap_applications",
)

_ADD_SQL = """
ALTER TABLE "{table}"
    ADD COLUMN IF NOT EXISTS "created_by" INT,
    ADD COLUMN IF NOT EXISTS "created_by_name" VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "updated_by" INT,
    ADD COLUMN IF NOT EXISTS "updated_by_name" VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "deleted_by" INT,
    ADD COLUMN IF NOT EXISTS "deleted_by_name" VARCHAR(100);
"""


async def upgrade(db: BaseDBAsyncClient) -> str:
    return "\n".join(_ADD_SQL.format(table=t) for t in _TABLES)


async def downgrade(db: BaseDBAsyncClient) -> str:
    # 生产库可能已有数据与依赖，回滚不删列
    return ""
