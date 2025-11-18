-- 将用户邮箱字段改为可选
-- 根据中国用户使用习惯，将邮箱字段改为可选（null=True），并去掉唯一性约束

-- 删除 email 字段的唯一性约束（如果存在）
ALTER TABLE "core_users" DROP CONSTRAINT IF EXISTS "core_users_email_key";

-- 将 email 字段改为允许 NULL
ALTER TABLE "core_users" ALTER COLUMN "email" DROP NOT NULL;

-- 删除 email 字段的索引（如果存在）
DROP INDEX IF EXISTS "idx_core_users_email_438fe9";

-- 更新注释说明
COMMENT ON COLUMN "core_users"."email" IS '用户邮箱（可选，符合中国用户使用习惯）';

