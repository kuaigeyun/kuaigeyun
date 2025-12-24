# RiverEdge SaaS - Inngest 服务独立启动脚本

此目录包含 Inngest 服务的独立启动脚本，从主启动脚本 `Launch.sh` 中分离出来，提供更灵活的 Inngest 服务管理。

## 文件说明

- `start-inngest.sh` - Inngest 服务启动脚本
- `inngest.exe` - Inngest 可执行文件 (Windows)
- `inngest.config.json` - Inngest 配置文件

## 使用方法

### 基本用法

```bash
# 启动 Inngest 服务 (使用默认端口 8288)
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
# 指定端口
INNGEST_PORT=8500 ./start-inngest.sh start

# 指定后端API URL
BACKEND_URL=http://localhost:8200/api/inngest ./start-inngest.sh start

# 指定日志目录
LOG_DIR=/path/to/logs ./start-inngest.sh start
```

## 配置说明

### 默认配置
- **端口**: Inngest 官方默认端口 8288 (自动管理)
- **后端URL**: http://127.0.0.1:8200/api/inngest
- **日志目录**: ../../startlogs (相对于脚本目录)
- **PID文件**: ../../startlogs/inngest.pid
- **日志文件**: ../../startlogs/inngest.log

### 配置文件
`inngest.config.json` 包含 Inngest 的详细配置，脚本会自动更新其中的端口配置。

## 服务访问

启动成功后，可以通过以下地址访问：

- **Inngest Dashboard**: http://localhost:{PORT}/_dashboard
- **Inngest API**: http://localhost:{PORT}

## 日志和调试

- **服务日志**: `../../startlogs/inngest.log`
- **进程ID**: `../../startlogs/inngest.pid`
- **清理日志**: `../../startlogs/taskkill.log` (仅Windows)

## 兼容性

- ✅ **Windows Git Bash**: 完全支持
- ✅ **Linux**: 完全支持
- ✅ **macOS**: 完全支持

## 故障排除

### 端口被占用
```bash
# 检查端口占用
netstat -ano | findstr :8300

# 停止服务
./start-inngest.sh stop
```

### 服务启动失败
1. 检查日志文件: `../../startlogs/inngest.log`
2. 确认后端服务正在运行
3. 确认配置文件存在且格式正确

### 权限问题
```bash
# 添加执行权限 (Linux/macOS)
chmod +x start-inngest.sh
```

## 与主启动脚本的关系

此脚本已从主启动脚本 `Launch.sh` 中分离，提供以下优势：

- **独立管理**: 可以独立启动/停止 Inngest 服务
- **灵活配置**: 支持自定义端口和配置
- **简化主脚本**: 主启动脚本专注于核心服务 (前端+后端)
- **便于调试**: 单独管理 Inngest 的日志和状态

## 注意事项

- 确保后端服务正在运行，Inngest 需要连接到后端API
- 使用 Inngest 官方默认端口 8288，完全由 Inngest 自动管理
- 脚本会自动清理之前的进程和日志文件
