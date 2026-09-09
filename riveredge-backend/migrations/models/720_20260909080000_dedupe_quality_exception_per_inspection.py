"""
质量异常按检验单去重回填。

真源曾在闭环（不合格品处置 / 8D 关闭）后仍可再次 create_from_inspection，
同检验单会再冒出「待处理」，跟踪报表看起来永远待处理。
本迁移：
1) 同检验单已有 closed 时，软删除仍未闭环的重复行
2) 同检验单仅有多条未闭环时，保留最早一条，软删除其余
3) 再按不合格品已处置 / 8D 已关闭回写 closed
4) 同检验单多条 closed 时，保留最新一条，软删除其余
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        -- 1) 同检验单已有 closed：软删除仍未闭环的重复创建（先于回写，避免回写后无法识别「重复待处理」）
        UPDATE "apps_kuaizhizao_quality_exceptions" AS qe
        SET
            "deleted_at" = CURRENT_TIMESTAMP,
            "updated_at" = CURRENT_TIMESTAMP,
            "remarks" = CASE
                WHEN qe."remarks" IS NULL OR TRIM(qe."remarks") = ''
                THEN '[系统] 同检验单质量异常已闭环，软删除重复待处理记录'
                ELSE qe."remarks" || E'\\n' || '[系统] 同检验单质量异常已闭环，软删除重复待处理记录'
            END
        WHERE qe."deleted_at" IS NULL
          AND qe."status" IN ('pending', 'investigating', 'correcting')
          AND qe."inspection_record_id" IS NOT NULL
          AND qe."inspection_source_type" IS NOT NULL
          AND qe."exception_type" = 'inspection_failure'
          AND EXISTS (
            SELECT 1
            FROM "apps_kuaizhizao_quality_exceptions" AS closed
            WHERE closed."tenant_id" = qe."tenant_id"
              AND closed."deleted_at" IS NULL
              AND closed."status" = 'closed'
              AND closed."exception_type" = qe."exception_type"
              AND closed."inspection_source_type" = qe."inspection_source_type"
              AND closed."inspection_record_id" = qe."inspection_record_id"
          );

        -- 2) 同检验单多条未闭环：保留最早 id，软删除其余
        WITH ranked AS (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    PARTITION BY
                        tenant_id,
                        inspection_source_type,
                        inspection_record_id,
                        exception_type
                    ORDER BY id ASC
                ) AS rn
            FROM "apps_kuaizhizao_quality_exceptions"
            WHERE deleted_at IS NULL
              AND status IN ('pending', 'investigating', 'correcting')
              AND inspection_record_id IS NOT NULL
              AND inspection_source_type IS NOT NULL
              AND exception_type = 'inspection_failure'
        )
        UPDATE "apps_kuaizhizao_quality_exceptions" AS qe
        SET
            "deleted_at" = CURRENT_TIMESTAMP,
            "updated_at" = CURRENT_TIMESTAMP,
            "remarks" = CASE
                WHEN qe."remarks" IS NULL OR TRIM(qe."remarks") = ''
                THEN '[系统] 同检验单重复创建，软删除重复未闭环记录'
                ELSE qe."remarks" || E'\\n' || '[系统] 同检验单重复创建，软删除重复未闭环记录'
            END
        FROM ranked
        WHERE qe.id = ranked.id
          AND ranked.rn > 1;

        -- 3a) 不合格品已处置 → 关联质量异常 closed
        UPDATE "apps_kuaizhizao_quality_exceptions" AS qe
        SET
            "status" = 'closed',
            "actual_completion_date" = COALESCE(qe."actual_completion_date", dr."processed_at", CURRENT_TIMESTAMP),
            "handled_at" = COALESCE(qe."handled_at", dr."processed_at", CURRENT_TIMESTAMP),
            "handled_by" = COALESCE(qe."handled_by", dr."processed_by"),
            "handled_by_name" = COALESCE(qe."handled_by_name", dr."processed_by_name"),
            "verification_result" = COALESCE(
                NULLIF(TRIM(qe."verification_result"), ''),
                '不合格品台账已处置完成（去重回填）'
            ),
            "updated_at" = CURRENT_TIMESTAMP
        FROM "apps_kuaizhizao_defect_records" AS dr
        WHERE qe."tenant_id" = dr."tenant_id"
          AND qe."deleted_at" IS NULL
          AND dr."deleted_at" IS NULL
          AND dr."status" = 'processed'
          AND qe."status" IN ('pending', 'investigating', 'correcting')
          AND (
            (
              qe."inspection_source_type" = 'incoming_inspection'
              AND qe."inspection_record_id" = dr."incoming_inspection_id"
            )
            OR (
              qe."inspection_source_type" = 'process_inspection'
              AND qe."inspection_record_id" = dr."process_inspection_id"
            )
            OR (
              qe."inspection_source_type" = 'finished_goods_inspection'
              AND qe."inspection_record_id" = dr."finished_goods_inspection_id"
            )
          );

        -- 3b) 8D 已关闭 → 关联质量异常 closed
        UPDATE "apps_kuaizhizao_quality_exceptions" AS qe
        SET
            "status" = 'closed',
            "actual_completion_date" = COALESCE(qe."actual_completion_date", r."closed_at", CURRENT_TIMESTAMP),
            "handled_at" = COALESCE(qe."handled_at", r."closed_at", CURRENT_TIMESTAMP),
            "verification_result" = COALESCE(
                NULLIF(TRIM(qe."verification_result"), ''),
                NULLIF(TRIM(r."verification_result"), ''),
                '8D 报告已关闭（去重回填）'
            ),
            "updated_at" = CURRENT_TIMESTAMP
        FROM "apps_kuaizhizao_quality_8d_reports" AS r
        WHERE qe."id" = r."quality_exception_id"
          AND qe."tenant_id" = r."tenant_id"
          AND qe."deleted_at" IS NULL
          AND r."deleted_at" IS NULL
          AND r."status" = 'closed'
          AND qe."status" IN ('pending', 'investigating', 'correcting');

        -- 4) 同检验单多条 closed：保留最新 id，软删除其余
        WITH ranked AS (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    PARTITION BY
                        tenant_id,
                        inspection_source_type,
                        inspection_record_id,
                        exception_type
                    ORDER BY id DESC
                ) AS rn
            FROM "apps_kuaizhizao_quality_exceptions"
            WHERE deleted_at IS NULL
              AND status = 'closed'
              AND inspection_record_id IS NOT NULL
              AND inspection_source_type IS NOT NULL
              AND exception_type = 'inspection_failure'
        )
        UPDATE "apps_kuaizhizao_quality_exceptions" AS qe
        SET
            "deleted_at" = CURRENT_TIMESTAMP,
            "updated_at" = CURRENT_TIMESTAMP,
            "remarks" = CASE
                WHEN qe."remarks" IS NULL OR TRIM(qe."remarks") = ''
                THEN '[系统] 同检验单重复闭环记录，软删除历史重复行'
                ELSE qe."remarks" || E'\\n' || '[系统] 同检验单重复闭环记录，软删除历史重复行'
            END
        FROM ranked
        WHERE qe.id = ranked.id
          AND ranked.rn > 1;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: quality exception dedupe backfill is irreversible"
