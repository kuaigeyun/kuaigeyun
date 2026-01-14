# 大语言模型 AI 接入方案

> 如何将大语言模型（LLM）接入当前项目，支持 DeepSeek（默认）、OpenAI、Claude、本地模型等

**创建日期**：2026-01-09  
**适用版本**：RiverEdge v1.0+

---

## 1. 接入方案概述

### 1.1 设计目标

- ✅ **统一接口**：提供统一的 LLM 调用接口，屏蔽不同提供商的差异
- ✅ **多提供商支持**：支持 OpenAI、Claude、本地模型等
- ✅ **配置灵活**：通过配置文件管理不同提供商的 API Key 和参数
- ✅ **易于扩展**：新增提供商只需实现接口即可
- ✅ **错误处理**：完善的错误处理和重试机制
- ✅ **成本控制**：支持 Token 使用统计和限流

### 2.2 架构设计

```
┌─────────────────────────────────────────┐
│         业务服务层                        │
│  (MaterialAIService, etc.)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         LLM 服务层                        │
│  LLMService (统一接口)                    │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ DeepSeek    │  │ OpenAI      │  │ Claude      │  │ Local Model │
│ Provider    │  │ Provider    │  │ Provider    │  │ Provider    │
│ (默认)      │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**注意**：DeepSeek 使用 OpenAI 兼容的 API，因此复用 `OpenAIProvider` 实现。

---

## 3. 实施步骤

### 3.1 安装依赖

在 `pyproject.toml` 中添加 LLM SDK 依赖：

```toml
dependencies = [
    # ... 现有依赖
    "openai>=1.0.0",  # OpenAI SDK
    "anthropic>=0.18.0",  # Claude SDK (可选)
    # "ollama>=0.1.0",  # 本地模型 (可选)
]
```

### 3.2 已创建的文件

✅ **核心服务**：
- `core/services/ai/llm/llm_service.py` - LLM 统一服务接口
- `core/services/ai/llm/providers/base.py` - 提供商基类
- `core/services/ai/llm/providers/openai_provider.py` - OpenAI 提供商实现

✅ **示例代码**：
- `apps/master_data/services/ai/material_ai_service_with_llm.py.example` - 集成示例

✅ **文档**：
- `docs/3.build/4.sys-app dev/大语言模型AI接入方案.md` - 完整方案
- `docs/3.build/4.sys-app dev/大语言模型AI快速开始.md` - 快速开始

### 3.3 配置环境变量

在 `.env` 文件中添加 OpenAI 配置（见下方配置说明）

### 3.4 使用 LLM 服务

参考下方使用示例，在业务代码中调用 `LLMService`

---

## 4. 使用示例

### 4.1 在物料 AI 服务中使用

```python
from core.services.ai.llm import LLMService

# 生成 AI 建议
suggestions = await LLMService.generate_suggestions(
    prompt="分析以下物料信息，提供配置建议：...",
    context={"material_type": "RAW", "specification": "100g"}
)
```

### 4.2 在 Inngest 工作流中使用

```python
# 在工作流中调用 LLM
result = await LLMService.chat_completion(
    messages=[
        {"role": "system", "content": "你是一个物料管理专家"},
        {"role": "user", "content": "分析这个物料..."}
    ]
)
```

---

## 5. 配置说明

### 5.1 环境变量配置

```bash
# LLM 提供商选择（默认 deepseek）
LLM_PROVIDER=deepseek  # deepseek, openai, claude, local

# DeepSeek 配置（默认提供商）
DEEPSEEK_API_KEY=sk-...  # 必填
DEEPSEEK_MODEL=deepseek-chat  # 可选，默认 deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1  # 可选，默认 https://api.deepseek.com/v1

# OpenAI 配置（可选）
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选，支持代理

# Claude 配置 (可选)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# 本地模型配置 (可选)
LOCAL_MODEL_URL=http://localhost:11434
LOCAL_MODEL_NAME=llama2
```

**DeepSeek 模型说明**：
- `deepseek-chat`：通用对话模型（推荐，默认）
- `deepseek-coder`：代码专用模型
- 其他模型请参考 [DeepSeek 官方文档](https://platform.deepseek.com/docs)

---

## 6. 使用示例

### 5.1 成本控制

- 设置 Token 使用上限
- 实现请求限流
- 记录使用统计

### 5.2 错误处理

- API 调用失败重试
- 超时处理
- 降级策略（LLM 失败时使用规则引擎）

### 5.3 安全性

- API Key 加密存储
- 请求内容审查
- 响应内容过滤

---

### 6.1 基础使用

**方式1：直接调用 LLM 服务**

```python
from core.services.ai.llm import LLMService

# 生成文本
text = await LLMService.generate_text(
    prompt="分析这个物料：塑料颗粒A，规格100g，单位kg",
    system_prompt="你是一个物料管理专家",
    temperature=0.7,
)

# 生成建议（带上下文）
suggestion = await LLMService.generate_suggestions(
    prompt="为这个物料提供配置建议",
    context={
        "material_type": "RAW",
        "specification": "100g",
        "base_unit": "kg"
    }
)
```

### 6.2 在现有服务中集成

参考示例文件：`riveredge-backend/src/apps/master_data/services/ai/material_ai_service_with_llm.py.example`

### 6.3 在 Inngest 工作流中使用

```python
from core.services.ai.llm import LLMService

async def material_ai_suggestion_workflow(event: Event):
    # 在工作流中调用 LLM
    response = await LLMService.chat_completion(
        messages=[
            {"role": "system", "content": "你是一个物料管理专家"},
            {"role": "user", "content": f"分析物料：{material_name}"}
        ],
        temperature=0.7,
    )
    
    # 使用响应内容
    ai_suggestion = response.content
    # ...
```

---

## 7. 注意事项

在 `.env` 文件中添加：

```bash
# LLM 提供商选择
LLM_PROVIDER=openai  # openai, claude, local

# OpenAI 配置
OPENAI_API_KEY=sk-...  # 必填
OPENAI_MODEL=gpt-4o-mini  # 可选，默认 gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选，用于代理服务

# Claude 配置 (可选，待实现)
# ANTHROPIC_API_KEY=sk-ant-...
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# 本地模型配置 (可选，待实现)
# LOCAL_MODEL_URL=http://localhost:11434
# LOCAL_MODEL_NAME=llama2
```

### 7.1 成本控制

- ✅ 设置 `max_tokens` 限制响应长度
- ✅ 使用较便宜的模型（如 `gpt-4o-mini`）
- ✅ 实现请求限流
- ✅ 记录 Token 使用统计

### 7.2 错误处理

- ✅ LLM 调用失败时降级到规则引擎
- ✅ 实现重试机制
- ✅ 超时处理

### 7.3 安全性

- ✅ API Key 存储在环境变量中，不提交到代码库
- ✅ 请求内容审查（避免敏感信息泄露）
- ✅ 响应内容过滤（避免不当内容）

---

## 8. 后续扩展

- 支持更多 LLM 提供商（Claude、Gemini、通义千问等）
- 实现流式响应（Streaming）
- 支持 Function Calling
- 实现上下文管理
- 支持多轮对话
- Token 使用统计和成本分析
