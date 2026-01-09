# Inngest 和 AI 验证指南

> 简化的验证步骤，快速验证 Inngest 和 AI 建议功能

**创建日期**：2026-01-09  
**适用版本**：RiverEdge v1.0+

---

## 快速验证步骤

## 1. 启动服务

### 1.1 启动 Inngest Dev Server

```bash
cd bin/inngest
./start-inngest.sh  # 或 bash start-inngest.sh (Windows)
```

**验证**：打开浏览器访问 http://localhost:8288，应该能看到 Inngest Dashboard

### 1.2 启动后端服务

```bash
cd riveredge-backend
./start-backend.sh  # 或 bash start-backend.sh (Windows)
```

**验证**：打开浏览器访问 http://localhost:8000/docs，应该能看到 API 文档

---

## 2. 验证界面操作

### 2.1 验证 Inngest 事件发送

**操作步骤**：
1. 在前端或 API 文档中创建物料
2. 打开 **Inngest Dashboard** (http://localhost:8288)
3. 点击左侧菜单 **"Events"**
4. 查看是否有 `material/created` 事件
5. 点击事件查看详情，确认包含物料信息

**验证要点**：
- ✅ 事件出现在 Events 列表中
- ✅ 事件数据包含 `material_id`、`material_name` 等字段

### 2.2 验证 Inngest 工作流执行

**操作步骤**：
1. 在 **Inngest Dashboard** 中点击左侧菜单 **"Functions"**
2. 找到 `material-ai-suggestion-workflow`
3. 点击查看执行历史
4. 查看最近的工作流执行记录
5. 点击执行记录查看详情

**验证要点**：
- ✅ 工作流已触发
- ✅ 执行状态为 "Success"
- ✅ 执行结果包含 `suggestions_count`

### 2.3 验证 AI 建议预览接口

**操作步骤**：
1. 打开 **API 文档** (http://localhost:8000/docs)
2. 找到 `GET /api/v1/apps/master-data/materials/ai-suggestions/preview`
3. 点击 "Try it out"
4. 填写参数：
   - `material_name`: 塑料颗粒A
   - `specification`: 100g (可选)
   - `base_unit`: kg (可选)
   - `material_type`: RAW (可选)
5. 点击 "Execute"

**验证要点**：
- ✅ 返回 200 状态码
- ✅ 响应包含 `suggestions` 数组
- ✅ 如果有重复物料，能看到重复物料建议

### 2.4 验证 AI 建议查询接口

**操作步骤**：
1. 先创建一个物料，获取 `uuid`
2. 在 **API 文档** 中找到 `GET /api/v1/apps/master-data/materials/{material_uuid}/ai-suggestions`
3. 点击 "Try it out"
4. 填写 `material_uuid` 参数
5. 点击 "Execute"

**验证要点**：
- ✅ 返回 200 状态码
- ✅ 响应包含 `suggestions` 数组
- ✅ 能看到配置建议和数据完整性检查建议

---

## 3. 验证检查清单

### 3.1 服务启动检查

- [ ] Inngest Dev Server 已启动 (http://localhost:8288)
- [ ] 后端服务已启动 (http://localhost:8000)
- [ ] API 文档可访问 (http://localhost:8000/docs)

### 3.2 Inngest 集成检查

- [ ] 创建物料后，在 Inngest Dashboard → Events 中能看到 `material/created` 事件
- [ ] 在 Inngest Dashboard → Functions 中能看到 `material-ai-suggestion-workflow` 执行记录
- [ ] 工作流执行状态为 "Success"

### 3.3 AI 建议功能检查

- [ ] 预览接口 (`/ai-suggestions/preview`) 返回建议列表
- [ ] 查询接口 (`/{material_uuid}/ai-suggestions`) 返回建议列表
- [ ] 如果有重复物料，能看到重复物料建议

---

## 4. 常见问题

### 4.1 Inngest Dashboard 无法访问

**检查**：http://localhost:8288 无法打开

**解决**：
- 确认 Inngest Dev Server 已启动
- 检查端口 8288 是否被占用

### 4.2 事件未出现在 Inngest Dashboard

**检查**：创建物料后，Events 列表中没有 `material/created` 事件

**解决**：
- 检查后端日志，查看是否有错误
- 确认 Inngest Dev Server 正在运行
- 检查环境变量 `INNGEST_EVENT_API_URL` 配置

### 4.3 工作流未执行

**检查**：Events 中有事件，但 Functions 中没有执行记录

**解决**：
- 在 Inngest Dashboard → Functions 中查看是否有错误
- 检查工作流函数是否已注册
- 查看工作流执行日志中的错误信息

### 4.4 API 接口返回错误

**检查**：AI 建议接口返回 500 错误

**解决**：
- 查看后端日志中的错误堆栈
- 检查数据库连接是否正常
- 确认请求参数格式正确

---

## 5. 快速验证命令（可选）

如果需要快速验证代码是否正确，可以运行：

```bash
cd riveredge-backend
uv run python scripts/test_inngest_ai_integration.py
```

这会检查所有模块导入、方法存在性、API 路由注册等，无需启动服务。