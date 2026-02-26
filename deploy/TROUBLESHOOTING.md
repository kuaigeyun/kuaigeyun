# 部署问题排查

## 后端一直重启

在服务器上查看日志：

```bash
cd /opt/riveredge
sudo docker compose -f docker-compose.prod.yml logs backend --tail 100
```

**常见原因：**

1. **缺少 INNGEST 密钥**：`.env` 必须包含 `INNGEST_EVENT_KEY` 和 `INNGEST_SIGNING_KEY`（可用 `openssl rand -hex 32` 生成）
2. **数据库密码错误**：`DB_PASSWORD` 需与 postgres 容器的 `POSTGRES_PASSWORD` 一致
3. **数据库未就绪**：首次启动时 postgres 可能较慢，可稍等 1–2 分钟后重启 backend

## 缺少 Caddy、Inngest 容器

说明服务器上的 `docker-compose.prod.yml` 不是最新版本。需要：

1. 将最新的 `docker-compose.prod.yml` 和 `deploy/` 目录同步到服务器 `/opt/riveredge/`
2. 执行：

```bash
cd /opt/riveredge
sudo docker compose -f docker-compose.prod.yml down
sudo docker compose -f docker-compose.prod.yml pull
sudo docker compose -f docker-compose.prod.yml up -d
```

## 目录结构要求

```
/opt/riveredge/
├── .env
├── docker-compose.prod.yml
└── deploy/
    ├── Caddyfile
    ├── env.prod.example
    └── postgres/
        └── init-inngest.sql
```
