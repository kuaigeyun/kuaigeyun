# RiverEdge 后端生产镜像（精简版）
FROM python:3.11-slim-bookworm

WORKDIR /app

# 安装 UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# 复制依赖文件
COPY pyproject.toml uv.lock ./
COPY src ./src
COPY migrations ./migrations

# 安装依赖（不含项目本身），清理缓存减小镜像
RUN uv sync --no-install-project --frozen --no-dev && \
    rm -rf /root/.cache /tmp/*

# 设置 Python 路径
ENV PYTHONPATH=/app/src
ENV PYTHONUNBUFFERED=1

EXPOSE 8200

# 启动脚本：先执行迁移，再启动服务
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
