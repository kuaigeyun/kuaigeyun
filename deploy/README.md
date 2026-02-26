# RiverEdge 生产环境部署

## 前置准备

### 1. 服务器目录结构

在部署服务器 `/opt/riveredge` 下准备：

```
/opt/riveredge/
├── .env                    # 环境变量（从 env.prod.example 复制并填写）
├── docker-compose.prod.yml # CI/CD 会自动同步，首次可手动放置
└── postgres/
    └── init-inngest.sql    # 从 deploy/postgres/ 复制
```

### 2. GitHub Secrets 配置

在仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret | 说明 |
|--------|------|
| `DEPLOY_HOST` | 部署服务器 IP 或域名 |
| `DEPLOY_USER` | SSH 登录用户名 |
| `DEPLOY_SSH_KEY` | SSH 私钥（完整内容，含 `-----BEGIN ... KEY-----`） |

### 3. 服务器权限

- `DEPLOY_USER` 需能 `sudo docker compose` 执行
- 建议在 `/etc/sudoers` 添加免密：`deploy-user ALL=(ALL) NOPASSWD: /usr/bin/docker compose *`

### 4. 镜像仓库

`docker-compose.prod.yml` 中镜像路径为 `ghcr.io/kuaigeyun/riveredge-*`。若仓库所属组织不同，需修改为 `ghcr.io/<你的组织>/riveredge-backend` 和 `riveredge-frontend`。

## 部署流程

- **触发**：推送代码到 `main` 或 `master` 分支
- **流程**：CI 检查 → 构建镜像 → 推送到 GHCR → 同步 compose → SSH 拉取并重启容器

## 可选：生产环境审批

在 **Settings → Environments** 中创建 `production`，可配置：
- Required reviewers：部署前需指定人员审批
- Deployment branches：限制仅 main/master 可部署
