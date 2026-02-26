# RiverEdge 部署清单

## 需要您提供的信息

| 项目 | 说明 | 示例 |
|------|------|------|
| **服务器 IP** | 部署目标服务器地址 | `1.2.3.4` 或 `kuaigeyun.com` |
| **SSH 用户** | 能执行 `sudo docker compose` 的用户 | `root` 或 `ubuntu` |
| **数据库密码** | Postgres 密码（可自动生成） | 留空则脚本生成 |
| **平台管理员密码** | 首次登录 /infra/login 的密码 | 默认 `platmaster@2026` |

## 一键部署步骤

### 1. 生成配置（本地执行）

```bash
cd deploy
bash setup-env.sh
```

按提示输入，直接回车可使用默认值。会生成 `deploy/.env`。

### 2. 同步并部署（本地执行）

```bash
cd deploy
bash deploy-to-server.sh 你的用户@服务器IP
```

例如：`bash deploy-to-server.sh root@1.2.3.4`

### 3. 前置条件（服务器需满足）

- 已安装 Docker 和 Docker Compose
- SSH 免密登录已配置（或准备好输入密码）
- 防火墙已开放 80、443 端口
- 域名 kuaigeyun.com 已解析到服务器 IP

### 4. 部署后验证

```bash
# 查看容器状态
ssh 用户@服务器 "cd /opt/riveredge && sudo docker compose -f docker-compose.prod.yml ps"

# 应看到 6 个容器均为 Up：backend、frontend、caddy、inngest、postgres、redis
```

访问：https://kuaigeyun.com/infra/login  
用户名：`infra_admin`  
密码：步骤 1 中设置的平台管理员密码
