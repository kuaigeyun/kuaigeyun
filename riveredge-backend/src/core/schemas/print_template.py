"""
打印模板 Schema 模块

定义打印模板相关的 Pydantic Schema，用于数据验证和序列化。
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class PrintTemplateBase(BaseModel):
    """打印模板基础 Schema"""
    name: str = Field(..., max_length=200, description="模板名称")
    code: str = Field(..., max_length=50, description="模板代码")
    type: str = Field(..., max_length=50, description="模板类型")
    description: str | None = Field(None, description="模板描述")
    content: str = Field(..., description="模板内容")
    config: dict[str, Any] | None = Field(None, description="模板配置")
    
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        """验证模板类型"""
        allowed_types = ['pdf', 'html', 'word', 'excel', 'other']
        if v not in allowed_types:
            raise ValueError(f'模板类型必须是 {allowed_types} 之一')
        return v


class PrintTemplateCreate(PrintTemplateBase):
    """创建打印模板 Schema"""
    pass


class PrintTemplateUpdate(BaseModel):
    """更新打印模板 Schema"""
    name: str | None = Field(None, max_length=200, description="模板名称")
    description: str | None = Field(None, description="模板描述")
    content: str | None = Field(None, description="模板内容")
    config: dict[str, Any] | None = Field(None, description="模板配置")
    is_active: bool | None = Field(None, description="是否启用")
    is_default: bool | None = Field(None, description="是否默认模板")


class PrintTemplateRenderRequest(BaseModel):
    """渲染打印模板请求 Schema"""
    data: dict[str, Any] = Field(..., description="模板数据")
    output_format: str | None = Field("pdf", description="输出格式")
    async_execution: bool = Field(False, description="是否异步执行（通过 Inngest）")


class PrintTemplateResponse(PrintTemplateBase):
    """打印模板响应 Schema"""
    uuid: UUID = Field(..., description="打印模板UUID")
    tenant_id: int = Field(..., description="组织ID")
    is_active: bool = Field(..., description="是否启用")
    is_default: bool = Field(..., description="是否默认模板")
    inngest_function_id: str | None = Field(None, description="Inngest 函数ID")
    usage_count: int = Field(..., description="使用次数")
    last_used_at: datetime | None = Field(None, description="最后使用时间")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    
    model_config = ConfigDict(from_attributes=True)


class PrintTemplateRenderResponse(BaseModel):
    """打印模板渲染响应 Schema"""
    success: bool = Field(..., description="是否成功")
    file_url: str | None = Field(None, description="生成文件URL")
    file_uuid: str | None = Field(None, description="生成文件UUID")
    error: str | None = Field(None, description="错误信息")
    inngest_run_id: str | None = Field(None, description="Inngest 运行ID（如果异步执行）")

