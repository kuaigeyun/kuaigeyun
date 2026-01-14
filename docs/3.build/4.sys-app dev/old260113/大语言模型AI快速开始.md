# 大语言模型 AI 快速开始指南

> 5 分钟快速接入 DeepSeek（默认）或 OpenAI 到当前项目

---

## 1. 安装依赖

```bash
cd riveredge-backend
uv pip install openai>=1.0.0
```

---

## 2. 配置环境变量

在 `.env` 文件中添加：

```bash
# LLM 提供商（默认 deepseek）
LLM_PROVIDER=deepseek

# DeepSeek API Key（必填）
DEEPSEEK_API_KEY=sk-...

# 模型选择（可选，默认 deepseek-chat）
DEEPSEEK_MODEL=deepseek-chat

# API 地址（可选，默认 https://api.deepseek.com/v1）
# DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

**或者使用 OpenAI**：

```bash
# LLM 提供商
LLM_PROVIDER=openai

# OpenAI API Key（必填）
OPENAI_API_KEY=sk-...

# 模型选择（可选，默认 gpt-4o-mini）
OPENAI_MODEL=gpt-4o-mini
```

---

## 3. 使用示例

### 3.1 基础使用

```python
from core.services.ai.llm import LLMService

# 生成文本
text = await LLMService.generate_text(
    prompt="分析这个物料：塑料颗粒A，规格100g",
    system_prompt="你是一个物料管理专家",
)

print(text)
```

### 3.2 在物料 AI 服务中使用

```python
from core.services.ai.llm import LLMService

# 生成建议
suggestion = await LLMService.generate_suggestions(
    prompt="为这个物料提供配置建议",
    context={
        "material_type": "RAW",
        "specification": "100g",
        "base_unit": "kg"
    }
)
```

### 3.3 在 Inngest 工作流中使用

```python
from core.services.ai.llm import LLMService

async def material_ai_suggestion_workflow(event: Event):
    response = await LLMService.chat_completion(
        messages=[
            {"role": "system", "content": "你是一个物料管理专家"},
            {"role": "user", "content": f"分析物料：{material_name}"}
        ],
        temperature=0.7,
    )
    
    ai_suggestion = response.content
    # 使用建议...
```

---

## 4. 验证

### 4.1 测试 LLM 服务

创建测试脚本 `test_llm.py`：

```python
import asyncio
from core.services.ai.llm import LLMService

async def test():
    text = await LLMService.generate_text(
        prompt="你好，请介绍一下你自己",
        system_prompt="你是一个友好的助手",
    )
    print(text)

asyncio.run(test())
```

运行：

```bash
cd riveredge-backend
uv run python test_llm.py
```

### 4.2 在 API 中测试

1. 启动后端服务
2. 打开 API 文档：http://localhost:8000/docs
3. 找到物料 AI 建议接口
4. 测试接口，查看是否包含 LLM 生成的建议

---

## 5. 常见问题

### 5.1 API Key 错误

**错误**：`DEEPSEEK_API_KEY 环境变量未设置`

**解决**：检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 配置

**注意**：如果使用 OpenAI，错误信息为 `OPENAI_API_KEY 环境变量未设置`

### 5.2 导入错误

**错误**：`ModuleNotFoundError: No module named 'openai'`

**解决**：运行 `uv pip install openai>=1.0.0`

### 5.3 调用失败

**错误**：`OpenAI API 调用失败` 或 `DeepSeek API 调用失败`

**解决**：
- 检查 API Key 是否正确
- 检查网络连接
- 检查账户余额（DeepSeek 或 OpenAI）
- 检查 API 地址是否正确（DeepSeek 默认：https://api.deepseek.com/v1）

---

## 6. 下一步

- 查看完整方案：[大语言模型AI接入方案.md](./大语言模型AI接入方案.md)
- 查看集成示例：`riveredge-backend/src/apps/master_data/services/ai/material_ai_service_with_llm.py.example`
- 在现有服务中集成 LLM
