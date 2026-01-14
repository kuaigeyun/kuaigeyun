# Inngest 和 AI 简易验证计划

> 验证 Inngest 工作流和 AI 建议功能如何与当前项目集成，重点验证流程可行性

**制定日期**：2026-01-09  
**验证目标**：验证 Inngest 和 AI 建议功能的集成流程可行性，而非完整功能实现

---

## 1. 验证场景选择

### 1.1 场景选择原则

- ✅ **简单易实现**：最小化实现复杂度，快速验证流程
- ✅ **不依赖复杂业务逻辑**：避免需要大量业务代码
- ✅ **可快速验证**：1-2天即可完成验证
- ✅ **验证核心流程**：重点验证集成方式，而非完整功能

### 1.2 选择的验证场景

#### 场景1：Inngest 验证 - 物料创建后的异步 AI 建议

**场景描述**：
- 用户创建物料后，系统立即返回成功
- 后台通过 Inngest 异步触发 AI 建议生成
- AI 分析物料信息，生成建议（如：重复物料提示、配置建议等）
- 建议通过消息或接口返回给前端展示

**为什么选择这个场景**：
1. ✅ 物料创建功能已完成，只需添加 Inngest 集成
2. ✅ 异步处理，不阻塞用户操作
3. ✅ 验证 Inngest 事件触发、工作流执行流程
4. ✅ 验证 AI 建议生成和返回流程

#### 场景2：AI 验证 - 物料创建时的智能建议

**场景描述**：
- 用户创建物料时，前端调用 AI 建议接口
- AI 分析物料信息，返回实时建议（如：重复物料提示、配置建议等）
- 建议以悬浮提示或侧边栏形式展示，不打断用户操作

**为什么选择这个场景**：
1. ✅ 同步调用，实时反馈
2. ✅ 不依赖复杂业务逻辑
3. ✅ 验证 AI 服务集成方式
4. ✅ 验证前端展示方式

---

## 2. Inngest 验证计划（简易版）

### 2.1 验证目标

验证 Inngest 工作流在物料创建后的异步 AI 建议场景中的集成流程。

### 2.2 实现方案

#### 2.2.1 修改物料创建接口

**在现有 `create_material` 接口中添加**：
```python
# 创建物料成功后，发送 Inngest 事件
from core.inngest.client import inngest_client

# 在 material_service.py 的 create_material 方法末尾添加
await inngest_client.send_sync(
    inngest_client.create_event(
        name="material/created",
        data={
            "tenant_id": tenant_id,
            "material_id": material.id,
            "material_uuid": str(material.uuid),
            "material_name": material.name,
            "material_type": material.material_type,
        }
    )
)
```

#### 2.2.2 创建 Inngest 工作流函数

**新建文件**：`riveredge-backend/src/apps/master_data/inngest/functions/material_ai_suggestion_workflow.py`

```python
"""
物料创建后的 AI 建议工作流

监听 material/created 事件，异步生成 AI 建议。
"""

from inngest import Event, TriggerEvent
from typing import Dict, Any
from loguru import logger

from core.inngest.client import inngest_client
from core.utils.inngest_tenant_isolation import with_tenant_isolation
from infra.domain.tenant_context import get_current_tenant_id


@inngest_client.create_function(
    fn_id="material-ai-suggestion-workflow",
    name="物料AI建议工作流",
    trigger=TriggerEvent(event="material/created"),
    retries=2,
)
@with_tenant_isolation
async def material_ai_suggestion_workflow(event: Event) -> Dict[str, Any]:
    """
    物料创建后的 AI 建议工作流
    
    步骤：
    1. 获取物料信息
    2. 调用 AI 服务生成建议
    3. 保存建议结果（可选）
    4. 返回建议结果
    """
    tenant_id = get_current_tenant_id()
    data = event.data or {}
    material_id = data.get("material_id")
    material_name = data.get("material_name")
    
    if not material_id:
        return {"success": False, "error": "缺少 material_id"}
    
    try:
        # 步骤1：调用 AI 服务生成建议
        from apps.master_data.services.ai.material_ai_service import MaterialAIService
        
        suggestions = await MaterialAIService.generate_suggestions(
            tenant_id=tenant_id,
            material_id=material_id,
            material_name=material_name,
        )
        
        logger.info(f"为物料 {material_id} 生成 AI 建议成功")
        
        return {
            "success": True,
            "material_id": material_id,
            "suggestions": suggestions,
        }
    except Exception as e:
        logger.error(f"生成 AI 建议失败: {e}")
        return {
            "success": False,
            "error": str(e),
        }
```

#### 2.2.3 创建 AI 建议服务（简化版）

**新建文件**：`riveredge-backend/src/apps/master_data/services/ai/material_ai_service.py`

```python
"""
物料 AI 建议服务（简易版）

提供物料相关的 AI 建议功能。
"""

from typing import Dict, Any, List
from loguru import logger

from apps.master_data.models.material import Material
from apps.master_data.services.material_code_service import MaterialCodeService


class MaterialAIService:
    """物料 AI 建议服务"""
    
    @staticmethod
    async def generate_suggestions(
        tenant_id: int,
        material_id: int,
        material_name: str,
    ) -> List[Dict[str, Any]]:
        """
        生成物料 AI 建议（简易版）
        
        当前实现：基于规则的简单建议
        后续可扩展：调用外部 AI API（如 OpenAI、Claude 等）
        
        Args:
            tenant_id: 租户ID
            material_id: 物料ID
            material_name: 物料名称
            
        Returns:
            List[Dict]: 建议列表
        """
        suggestions = []
        
        # 建议1：检查重复物料
        duplicates = await MaterialCodeService.find_duplicate_materials(
            tenant_id=tenant_id,
            name=material_name,
        )
        
        if duplicates:
            high_confidence = [d for d in duplicates if d["confidence"] == "high"]
            if high_confidence:
                suggestions.append({
                    "type": "duplicate_material",
                    "level": "warning",
                    "title": "发现重复物料",
                    "message": f"检测到 {len(high_confidence)} 个高置信度重复物料",
                    "details": [
                        {
                            "material_id": d["material"].id,
                            "material_name": d["material"].name,
                            "main_code": d["material"].main_code,
                            "confidence": d["confidence"],
                            "match_score": d["match_score"],
                        }
                        for d in high_confidence[:5]  # 最多显示5个
                    ],
                })
        
        # 建议2：配置建议（示例）
        # 可以根据物料类型、历史数据等提供配置建议
        suggestions.append({
            "type": "configuration",
            "level": "info",
            "title": "配置建议",
            "message": "建议配置安全库存和默认仓库",
            "details": [],
        })
        
        return suggestions
```

#### 2.2.4 创建建议查询接口

**在物料 API 中添加**：
```python
@router.get("/{material_uuid}/ai-suggestions", summary="获取物料AI建议")
async def get_material_ai_suggestions(
    material_uuid: str,
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_id: Annotated[int, Depends(get_current_tenant)]
):
    """
    获取物料的 AI 建议
    
    如果建议还未生成，返回空列表。
    建议通过 Inngest 异步生成。
    """
    # 实现逻辑：从缓存或数据库获取建议
    # 简化版：直接调用 AI 服务生成（同步）
    from apps.master_data.services.ai.material_ai_service import MaterialAIService
    from apps.master_data.services.material_service import MaterialService
    
    material = await MaterialService.get_material_by_uuid(tenant_id, material_uuid)
    
    suggestions = await MaterialAIService.generate_suggestions(
        tenant_id=tenant_id,
        material_id=material.id,
        material_name=material.name,
    )
    
    return {"suggestions": suggestions}
```

### 2.3 验证步骤

1. **创建物料** → 验证 Inngest 事件是否发送
2. **查看 Inngest Dashboard** → 验证工作流是否触发
3. **查询 AI 建议** → 验证建议是否生成
4. **查看日志** → 验证流程是否正常

### 2.4 验收标准

- ✅ 物料创建后，Inngest 事件成功发送
- ✅ Inngest 工作流成功触发和执行
- ✅ AI 建议成功生成
- ✅ 建议查询接口正常返回
- ✅ 日志记录完整，便于排查问题

---

## 3. AI 验证计划（简易版）

### 3.1 验证目标

验证 AI 建议功能在物料创建时的实时建议场景中的集成流程。

### 3.2 实现方案

#### 3.2.1 创建 AI 建议接口

**在物料 API 中添加**：
```python
@router.post("/ai-suggestions/preview", summary="预览AI建议（创建前）")
async def preview_material_ai_suggestions(
    data: MaterialCreate,  # 使用物料创建 Schema
    current_user: Annotated[User, Depends(get_current_user)],
    tenant_id: Annotated[int, Depends(get_current_tenant)]
):
    """
    预览物料 AI 建议（创建物料前）
    
    用户输入物料信息后，实时获取 AI 建议，不创建物料。
    """
    from apps.master_data.services.ai.material_ai_service import MaterialAIService
    
    # 生成建议（不创建物料）
    suggestions = await MaterialAIService.generate_suggestions(
        tenant_id=tenant_id,
        material_id=None,  # 还未创建，使用 None
        material_name=data.name,
        specification=data.specification,
        base_unit=data.base_unit,
    )
    
    return {"suggestions": suggestions}
```

#### 3.2.2 增强 AI 服务（支持创建前建议）

**修改 `MaterialAIService.generate_suggestions`**：
```python
@staticmethod
async def generate_suggestions(
    tenant_id: int,
    material_id: Optional[int] = None,  # 可选，创建前为 None
    material_name: str = None,
    specification: Optional[str] = None,
    base_unit: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    生成物料 AI 建议
    
    支持两种场景：
    1. 创建前预览（material_id=None）
    2. 创建后建议（material_id 有值）
    """
    suggestions = []
    
    # 建议1：检查重复物料（创建前和创建后都可用）
    if material_name:
        duplicates = await MaterialCodeService.find_duplicate_materials(
            tenant_id=tenant_id,
            name=material_name,
            specification=specification,
            base_unit=base_unit,
        )
        
        if duplicates:
            # 处理重复物料建议
            # ...
    
    # 建议2：配置建议
    # ...
    
    return suggestions
```

#### 3.2.3 前端集成（可选）

**在物料创建表单中添加**：
```typescript
// 用户输入物料名称后，实时获取建议
const handleNameChange = async (name: string) => {
  if (name && name.length > 2) {
    const response = await materialApi.previewAISuggestions({
      name,
      material_type: formData.material_type,
      // ... 其他字段
    });
    
    setAISuggestions(response.suggestions);
  }
};

// 展示建议（悬浮提示或侧边栏）
<AISuggestionPanel suggestions={aiSuggestions} />
```

### 3.3 验证步骤

1. **调用预览建议接口** → 验证 AI 服务是否正常
2. **查看建议内容** → 验证建议是否合理
3. **测试不同场景** → 验证建议准确性
4. **查看性能** → 验证响应时间

### 3.4 验收标准

- ✅ AI 建议接口正常（响应时间 < 1秒）
- ✅ 建议内容合理（重复物料识别准确）
- ✅ 支持创建前预览和创建后建议两种场景
- ✅ 错误处理正常（异常情况不崩溃）

---

## 4. 实施计划（简易版）

### 4.1 阶段1：Inngest 集成验证（预计1天）

**上午（2-3小时）**：
- [ ] 在物料创建接口中添加 Inngest 事件发送
- [ ] 创建 Inngest 工作流函数
- [ ] 创建 AI 建议服务（简化版）

**下午（2-3小时）**：
- [ ] 测试物料创建 → Inngest 事件发送
- [ ] 测试 Inngest 工作流执行
- [ ] 测试 AI 建议生成
- [ ] 验证完整流程

### 4.2 阶段2：AI 建议集成验证（预计1天）

**上午（2-3小时）**：
- [ ] 创建 AI 建议预览接口
- [ ] 增强 AI 服务（支持创建前建议）
- [ ] 优化重复物料识别算法（添加拼音匹配）

**下午（2-3小时）**：
- [ ] 测试预览建议接口
- [ ] 测试建议准确性
- [ ] 性能测试
- [ ] 验证完整流程

### 4.3 阶段3：联合验证（预计0.5天）

**验证完整流程**：
- [ ] 物料创建 → Inngest 异步建议
- [ ] 物料创建前 → 实时预览建议
- [ ] 两种方式对比验证
- [ ] 编写验证报告

---

## 5. 技术实现细节

### 5.1 Inngest 集成要点

#### 5.1.1 事件发送

```python
# 方式1：同步发送（推荐，简单）
await inngest_client.send_sync(
    inngest_client.create_event(
        name="material/created",
        data={"tenant_id": tenant_id, "material_id": material.id, ...}
    )
)

# 方式2：异步发送（可选）
inngest_client.send_async(...)
```

#### 5.1.2 工作流函数注册

```python
# 在 core/inngest/functions/__init__.py 中导入
from apps.master_data.inngest.functions.material_ai_suggestion_workflow import (
    material_ai_suggestion_workflow,
)
```

#### 5.1.3 租户隔离

```python
# 使用装饰器自动处理租户隔离
@with_tenant_isolation
async def material_ai_suggestion_workflow(event: Event):
    tenant_id = get_current_tenant_id()  # 自动获取
    # ...
```

### 5.2 AI 服务集成要点

#### 5.2.1 服务结构

```python
# 目录结构
apps/master_data/services/ai/
├── __init__.py
├── material_ai_service.py  # 物料 AI 服务
└── base_ai_service.py       # AI 服务基类（可选）
```

#### 5.2.2 建议数据结构

```python
{
    "type": "duplicate_material" | "configuration" | "optimization",
    "level": "info" | "warning" | "error",
    "title": "建议标题",
    "message": "建议消息",
    "details": [
        {
            "key": "value",
            # 具体建议详情
        }
    ],
    "actions": [  # 可选，建议的操作
        {
            "label": "查看详情",
            "action": "view_detail",
            "params": {...}
        }
    ]
}
```

### 5.3 前端集成要点（可选）

#### 5.3.1 建议展示组件

```typescript
// 方式1：悬浮提示（不打断操作）
<Popover content={<AISuggestions suggestions={suggestions} />}>
  <InfoCircleOutlined />
</Popover>

// 方式2：侧边栏（可展开查看）
<Drawer title="AI建议" open={showSuggestions}>
  <AISuggestionsList suggestions={suggestions} />
</Drawer>
```

---

## 6. 验证检查清单

### 6.1 Inngest 验证检查清单

- [ ] Inngest 服务正常运行（本地 Dev Server 或云服务）
- [ ] 物料创建接口成功发送事件
- [ ] Inngest Dashboard 显示事件和工作流
- [ ] 工作流函数成功执行
- [ ] AI 建议成功生成
- [ ] 日志记录完整
- [ ] 错误处理正常（失败重试）

### 6.2 AI 验证检查清单

- [ ] AI 建议接口正常响应
- [ ] 建议内容合理（重复物料识别准确）
- [ ] 支持创建前预览
- [ ] 支持创建后建议
- [ ] 性能满足要求（< 1秒）
- [ ] 错误处理正常

### 6.3 集成验证检查清单

- [ ] Inngest 和 AI 服务可以协同工作
- [ ] 两种建议方式（实时预览 + 异步建议）都可用
- [ ] 前端可以正常展示建议
- [ ] 完整流程无阻塞

---

## 7. 成功标准

### 7.1 流程可行性验证

- ✅ **Inngest 集成流程可行**：
  - 事件发送成功
  - 工作流触发成功
  - 异步处理正常
  - 租户隔离正常

- ✅ **AI 服务集成流程可行**：
  - 服务调用成功
  - 建议生成正常
  - 性能满足要求
  - 错误处理正常

- ✅ **端到端流程可行**：
  - 物料创建 → Inngest → AI 建议 → 前端展示
  - 物料创建前 → AI 预览建议 → 前端展示
  - 两种方式都可以正常工作

### 7.2 技术验证

- ✅ Inngest 工作流引擎可以正常集成到项目中
- ✅ AI 建议功能可以正常集成到项目中
- ✅ 两种技术可以协同工作
- ✅ 集成方式可以扩展到其他场景

---

## 8. 后续扩展方向

### 8.1 Inngest 扩展

验证成功后，可以扩展到：
- MRP运算异步处理
- 批量审批流程
- 定时报表生成
- 数据同步任务

### 8.2 AI 扩展

验证成功后，可以扩展到：
- 调用外部 AI API（OpenAI、Claude 等）
- 编码规则智能建议
- 物料配置智能建议
- MRP运算结果分析
- 异常预测和预警

---

## 9. 测试数据准备

### 9.1 Inngest 验证测试数据

**测试场景1：单个物料创建**
- 创建1个物料
- 验证事件发送和工作流执行

**测试场景2：多个物料创建**
- 连续创建5个物料
- 验证每个物料都触发工作流

**测试场景3：包含重复物料**
- 创建2个相似的物料（名称相同，规格相同）
- 验证 AI 建议是否正确识别重复

### 9.2 AI 验证测试数据

**测试场景1：精确重复**
- 物料名称："塑料颗粒A"
- 规格："100g"
- 单位："kg"
- 验证高置信度识别

**测试场景2：相似重复**
- 物料名称："塑料颗粒A" vs "塑料颗粒 A"（空格差异）
- 验证中置信度识别

**测试场景3：拼音重复**
- 物料名称："塑料颗粒" vs "suliao keliao"
- 验证拼音匹配功能

---

## 10. 常见问题处理

### 10.1 Inngest 相关问题

**问题1：Inngest 服务连接失败**
- 检查 Inngest Dev Server 是否启动
- 检查环境变量配置（INNGEST_EVENT_API_URL）
- 检查网络连接

**问题2：工作流未触发**
- 检查事件名称是否匹配
- 检查工作流函数是否注册
- 查看 Inngest Dashboard 日志

**问题3：租户隔离问题**
- 检查 `@with_tenant_isolation` 装饰器是否正确使用
- 检查事件数据中是否包含 `tenant_id`

### 10.2 AI 相关问题

**问题1：AI 建议生成慢**
- 优化重复物料识别算法
- 使用缓存减少数据库查询
- 考虑异步处理

**问题2：建议不准确**
- 优化相似度计算算法
- 添加更多匹配维度
- 收集用户反馈，持续优化

**问题3：AI 服务依赖**
- 第一阶段使用规则方法，不依赖外部服务
- 后续可逐步引入 AI 模型

---

## 11. 验证报告模板

### 11.1 验证结果记录

**Inngest 验证结果**：
- [ ] 事件发送：✅ 成功 / ❌ 失败
- [ ] 工作流触发：✅ 成功 / ❌ 失败
- [ ] 工作流执行：✅ 成功 / ❌ 失败
- [ ] AI 建议生成：✅ 成功 / ❌ 失败
- [ ] 性能：< 5秒 / > 5秒
- [ ] 错误处理：✅ 正常 / ❌ 异常

**AI 验证结果**：
- [ ] 建议接口：✅ 正常 / ❌ 异常
- [ ] 响应时间：< 1秒 / > 1秒
- [ ] 建议准确性：✅ 准确 / ❌ 不准确
- [ ] 创建前预览：✅ 可用 / ❌ 不可用
- [ ] 创建后建议：✅ 可用 / ❌ 不可用

### 11.2 问题记录

**遇到的问题**：
1. 问题描述
2. 解决方案
3. 是否解决

### 11.3 改进建议

**技术改进**：
- 建议1
- 建议2

**业务改进**：
- 建议1
- 建议2

---

## 12. 参考资料

- [用户使用场景推演-MTS-MTO.md](./用户使用场景推演-MTS-MTO.md) - 第1.2节、第2.3节
- [物料编码管理设计规范.md](./物料编码管理设计规范.md) - 第7节（智能识别重复物料）
- [Inngest 官方文档](https://www.inngest.com/docs)
- [项目 Inngest 集成文档](../4.optimise/inngest集成/)

---

**验证计划结束**

**下一步**：开始实施阶段1的 Inngest 集成验证

---

## 13. 验证测试报告

### 13.1 代码验证结果（2026-01-09）

✅ **所有代码验证测试通过**

**测试项目**：
- ✅ 模块导入测试：通过
- ✅ AI 服务方法检查：通过
- ✅ Inngest 客户端检查：通过
- ✅ API 路由注册检查：通过

**实施完成度**：
- ✅ AI 建议服务：100%
- ✅ Inngest 工作流函数：100%
- ✅ 物料创建事件发送：100%
- ✅ API 接口：100%
- ✅ 工作流函数注册：100%

**详细测试报告**：请参考 [Inngest和AI验证测试报告.md](./Inngest和AI验证测试报告.md)

### 13.2 下一步功能测试

需要启动服务进行功能测试：
1. 启动 Inngest Dev Server
2. 启动后端服务
3. 测试创建物料，验证 Inngest 事件发送
4. 测试 AI 建议 API 接口