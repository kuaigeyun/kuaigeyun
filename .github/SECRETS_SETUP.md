# GitHub Secrets 配置

在 https://github.com/kuaigeyun/kuaigeyun/settings/secrets/actions 添加：

| Name | Value |
|------|-------|
| DEPLOY_HOST | kuaigeyun.com |
| DEPLOY_USER | ubuntu |
| DEPLOY_SSH_KEY | 运行 `cat ~/.ssh/riveredge_deploy` 获取私钥，完整复制（含 BEGIN/END 行）粘贴 |

配置完成后，push 到 main 或 master 分支将自动触发部署。
