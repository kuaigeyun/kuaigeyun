"""采购询价：未提交草稿的 review_status 从 PENDING 回填为 DRAFT。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        UPDATE "apps_kuaizhizao_purchase_inquiries"
        SET "review_status" = 'DRAFT'
        WHERE "deleted_at" IS NULL
          AND "status" = 'DRAFT'
          AND UPPER(TRIM(COALESCE("review_status", ''))) IN ('PENDING', '待审核');
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        UPDATE "apps_kuaizhizao_purchase_inquiries"
        SET "review_status" = 'PENDING'
        WHERE "deleted_at" IS NULL
          AND "status" = 'DRAFT'
          AND UPPER(TRIM(COALESCE("review_status", ''))) = 'DRAFT';
    """
