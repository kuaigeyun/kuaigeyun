# RiverEdge SaaS - Inngest 服务独立启动脚本

此目录包含 Inngest 服务的独立启动脚本，完全独立于主项目启动流程。

## 文件说明

- `start-inngest.sh` - Inngest 服务启动脚本
- `inngest.exe` - Inngest 可执行文件 (Windows)
- `inngest.config.json` - Inngest 配置文件（仅包含数据库和日志配置，不包含端口配置）

## 使用方法

### 基本用法

```bash
# 启动 Inngest 服务（使用 Inngest 默认配置）
./start-inngest.sh

# 停止 Inngest 服务
./start-inngest.sh stop

# 查看服务状态
./start-inngest.sh status

# 显示帮助信息
./start-inngest.sh help
```

### 环境变量配置

```bash
# 指定后端API URL（Inngest需要连接的后端地址）
BACKEND_URL=http://localhost:8200/api/inngest ./start-inngest.sh start

# 指定日志目录
LOG_DIR=/path/to/logs ./start-inngest.sh start
```

## 配置说明

### 默认配置
- **端口**: 完全使用 Inngest 官方默认端口配置，不进行任何自定义
- **后端URL**: http://127.0.0.1:8200/api/inngest（可通过 BACKEND_URL 环境变量覆盖）
- **日志目录**: ../../.logs (相对于脚本目录)
- **PID文件**: ../../.logs/inngest.pid
- **日志文件**: ../../.logs/inngest.log

### 配置文件
`inngest.config.json` 仅包含数据库和日志配置，**不包含任何端口配置**，端口完全由 Inngest 自动管理。

### 重要说明
- Inngest 服务**完全独立启动**，不与项目主启动脚本集成
- 启动后请查看日志确认 Inngest 实际使用的端口
- 后端项目通过环境变量 `INNGEST_EVENT_API_URL` 或 `INNGEST_HOST` + `INNGEST_PORT` 连接到 Inngest

## 服务访问

启动成功后，可以通过以下地址访问（端口由 Inngest 自动分配）：

- **Inngest Dashboard**: http://localhost:{PORT}/_dashboard（请查看日志确认实际端口）
- **Inngest API**: http://localhost:{PORT}（请查看日志确认实际端口）

## 日志和调试

- **服务日志**: `../../.logs/inngest.log`
- **进程ID**: `../../.logs/inngest.pid`
- **清理日志**: `../../.logs/taskkill.log` (仅Windows)

## 兼容性

- ✅ **Windows Git Bash**: 完全支持
- ✅ **Linux**: 完全支持
- ✅ **macOS**: 完全支持

## 故障排除

### Windows 端口保留问题

如果遇到错误：`bind: An attempt was made to access a socket in a way forbidden by its access permissions`

**原因**：Windows 系统保留了端口范围（如 8262-8361），Inngest 默认端口 8288 可能在此范围内。

**解决方案**：

1. **以管理员身份运行**（推荐）
   - 右键点击 Git Bash，选择"以管理员身份运行"
   - 然后执行 `./bin/inngest/start-inngest.sh start`

2. **释放 Windows 端口保留范围**（需要管理员权限）
   ```bash
   # 查看端口保留范围
   netsh interface ipv4 show excludedportrange protocol=tcp
   
   # 释放特定范围（需要管理员权限，谨慎操作）
   # 注意：这可能会影响其他服务，请谨慎操作
   ```

3. **检查端口占用**
   ```bash
   # 检查端口是否被占用
   netstat -ano | findstr 8288
   
   # 清理残留进程
   taskkill /F /IM inngest.exe
   ```

### 服务启动失败
1. 检查日志文件: `../../.logs/inngest.log`
2. 确认后端服务正在运行
3. 确认配置文件存在且格式正确
4. 查看日志确认 Inngest 使用的实际端口
5. 如果是 Windows，检查端口保留问题（见上方）

### 权限问题
```bash
# 添加执行权限 (Linux/macOS)
chmod +x start-inngest.sh

# Windows: 以管理员身份运行 Git Bash
```

## 与主启动脚本的关系

此脚本已从主启动脚本 `Launch.sh` 中分离，提供以下优势：

- **独立管理**: 可以独立启动/停止 Inngest 服务
- **灵活配置**: 支持自定义端口和配置
- **简化主脚本**: 主启动脚本专注于核心服务 (前端+后端)
- **便于调试**: 单独管理 Inngest 的日志和状态

## 注意事项

- 确保后端服务正在运行，Inngest 需要连接到后端API
- 使用 Inngest 官方默认端口配置，不自定义端口
- 脚本会自动清理之前的进程和日志文件
- 启动后请查看日志确认 Inngest 实际使用的端口
