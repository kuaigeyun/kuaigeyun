"""
计量器具台账：回填设备性质与校准标记。

将历史台账中符合计量器具特征、且尚未标记为「测量设备」的设备写入 equipment_nature，
并开启 needs_calibration，便于计量器具模块与设备检定列表隔离展示。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        UPDATE "apps_kuaizhizao_equipment" AS e
        SET
            "equipment_nature" = '测量设备',
            "needs_calibration" = TRUE,
            "calibration_period" = COALESCE(
                e."calibration_period",
                CASE
                    WHEN e."last_calibration_date" IS NOT NULL
                         AND e."next_calibration_date" IS NOT NULL
                         AND e."next_calibration_date" > e."last_calibration_date"
                    THEN (e."next_calibration_date" - e."last_calibration_date")
                    ELSE NULL
                END
            ),
            "updated_at" = NOW()
        WHERE e."deleted_at" IS NULL
          AND COALESCE(e."equipment_nature", '') <> '测量设备'
          AND (
              e."needs_calibration" IS TRUE
              OR e."name" ILIKE '%测量机%'
              OR e."name" ILIKE '%测量仪%'
              OR e."name" ILIKE '%量具%'
              OR e."name" ILIKE '%卡尺%'
              OR e."name" ILIKE '%千分尺%'
              OR e."name" ILIKE '%三坐标%'
              OR e."name" ILIKE '%影像测量%'
              OR e."name" ILIKE '%检定仪%'
              OR e."name" ILIKE '%计量%'
              OR e."code" ILIKE '%CMM%'
              OR e."code" ILIKE '%VMS%'
              OR e."name" ILIKE '%CMM%'
              OR e."name" ILIKE '%VMS%'
          );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: measuring instrument equipment_nature backfill is irreversible"
