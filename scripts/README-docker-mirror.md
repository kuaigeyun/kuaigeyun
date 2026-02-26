# Docker 镜像加速配置

## 腾讯云加速（Docker Hub）

在**部署服务器**上执行（需 root 或 sudo）：

```bash
# 从本仓库获取脚本后执行
sudo bash scripts/setup-docker-tencent-mirror.sh
```

或直接执行：

```bash
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

**加速范围**：Docker Hub (docker.io) 镜像，如 `postgres`、`redis`、`caddy`、`inngest` 等。

## ghcr.io 加速（riveredge 镜像）

腾讯云镜像**不加速** ghcr.io。若拉取 `ghcr.io/kuaigeyun/riveredge-*` 较慢，可改用南京大学镜像：

在服务器 `/opt/riveredge/docker-compose.prod.yml` 中，将镜像地址替换为：

```yaml
# 原：ghcr.io/kuaigeyun/riveredge-backend:latest
# 改为：
image: ghcr.nju.edu.cn/kuaigeyun/riveredge-backend:latest

# 原：ghcr.io/kuaigeyun/riveredge-frontend:latest  
# 改为：
image: ghcr.nju.edu.cn/kuaigeyun/riveredge-frontend:latest
```

镜像会从 ghcr.nju.edu.cn 拉取（该站会代理 ghcr.io）。
