"""
超级管理员模型模块

定义超级管理员数据模型，独立于租户系统（不包含 tenant_id）
"""

from typing import Optional
from datetime import datetime

from tortoise.models import Model
from tortoise import fields
from passlib.context import CryptContext


# 密码加密上下文（使用 bcrypt）
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class SuperAdmin(Model):
    """
    超级管理员模型
    
    用于管理系统级别的超级管理员账户。
    独立于租户系统，不包含 tenant_id，可以跨租户访问和管理数据。
    
    Attributes:
        id: 超级管理员 ID（主键）
        username: 用户名（全局唯一）
        email: 用户邮箱（可选，符合中国用户使用习惯）
        password_hash: 密码哈希值（使用 bcrypt 加密）
        full_name: 用户全名（可选）
        is_active: 是否激活
        last_login: 最后登录时间（可选）
        device_fingerprint: 设备指纹（可选，用于设备绑定，后续实现）
        created_at: 创建时间
        updated_at: 更新时间
    """
    
    id = fields.IntField(primary_key=True, description="主键 ID")
    username = fields.CharField(max_length=50, unique=True, description="用户名（全局唯一）")
    email = fields.CharField(max_length=255, null=True, description="用户邮箱（可选，符合中国用户使用习惯）")
    password_hash = fields.CharField(max_length=255, description="密码哈希值（使用 bcrypt 加密）")
    full_name = fields.CharField(max_length=100, null=True, description="用户全名（可选）")
    is_active = fields.BooleanField(default=True, description="是否激活")
    last_login = fields.DatetimeField(null=True, description="最后登录时间（可选）")
    device_fingerprint = fields.CharField(max_length=255, null=True, description="设备指纹（可选，用于设备绑定）")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        """
        模型元数据
        """
        table = "core_superadmins"  # 表名必须包含模块前缀（core_）
        indexes = [
            ("username",),  # 用户名索引
        ]
    
    def set_password(self, password: str) -> None:
        """
        设置密码
        
        使用 bcrypt 加密密码并保存到 password_hash 字段。
        
        Args:
            password: 明文密码
            
        Example:
            >>> admin = SuperAdmin()
            >>> admin.set_password("password123")
            >>> len(admin.password_hash) > 0
            True
        """
        self.password_hash = pwd_context.hash(password)
    
    def verify_password(self, password: str) -> bool:
        """
        验证密码
        
        使用 bcrypt 验证密码是否匹配。
        
        Args:
            password: 明文密码
            
        Returns:
            bool: 密码是否匹配
            
        Example:
            >>> admin = SuperAdmin()
            >>> admin.set_password("password123")
            >>> admin.verify_password("password123")
            True
            >>> admin.verify_password("wrong_password")
            False
        """
        return pwd_context.verify(password, self.password_hash)
    
    def update_last_login(self) -> None:
        """
        更新最后登录时间
        
        将 last_login 字段更新为当前时间。
        """
        self.last_login = datetime.utcnow()

