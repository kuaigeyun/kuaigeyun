# RiverEdge 部署面板

**单二进制、零运行时依赖**。用于在空白 Windows/Linux 环境下图形化准备 RiverEdge 部署所需的环境（Node、Python、PostgreSQL、Redis 等），并完成配置与一键启动。

## 设计原则

- **零依赖**：编译后的可执行文件不依赖 Node.js、Python、npm 等
- **单文件分发**：用户只需下载一个 `.exe`（Windows）或二进制（Linux）
- **即开即用**：双击运行后打开浏览器访问 `http://127.0.0.1:8300`

## 功能

1. **环境检测**：检测 Node.js、Python、UV、npm、PostgreSQL、Redis 安装状态与版本
2. **配置填写**：数据库、Redis、端口、超管密码等，保存到 `deploy-config.json`
3. **安装引导**：展示 winget/apt 等安装命令，用户复制执行
4. **部署执行**：生成 `.env`、执行 `aerich upgrade`、调用 `Launch.sh` 启动主系统

## 构建

构建需要安装 [Go 1.22+](https://go.dev/dl/)。构建产物为单文件，无需再安装任何运行时。

```bash
cd riveredge-panel

# 当前平台
go build -o riveredge-panel ./cmd/panel

# 或使用 Makefile 跨平台编译
make build-windows   # 生成 riveredge-panel-windows-amd64.exe
make build-linux     # 生成 riveredge-panel-linux-amd64
make build-all       # 同时生成 Windows 和 Linux 版本
```

## 使用

1. 将编译好的 `riveredge-panel.exe`（或 Linux 二进制）放入 RiverEdge 项目目录，例如：
   ```
   riveredge/
   ├── riveredge-panel/
   │   └── riveredge-panel.exe   # 或 riveredge-panel
   ├── riveredge-backend/
   ├── riveredge-frontend/
   └── Launch.sh
   ```
2. 运行 `riveredge-panel.exe`（Windows 双击或命令行）
3. 浏览器访问 http://127.0.0.1:8300
4. 按向导完成：环境检测 → 配置保存 → 安装缺失依赖 → 部署执行

## 配置存储

- `deploy-config.json` 位于可执行文件同目录，存储检测结果与用户配置
- 生成的 `riveredge-backend/.env` 由「部署执行」根据配置写入

## 与主项目关系

- 部署面板为独立子项目，不依赖主项目业务代码
- 仅依赖：`riveredge-backend/.env.example`、`Launch.sh`、aerich 迁移
- 主项目 README 或 docs 可增加「使用部署面板」的简要说明
