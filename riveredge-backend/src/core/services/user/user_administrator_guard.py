"""将管理员身份和管理员账号维护与普通用户资料编辑权限分开。"""
from core.models.role import Role
from core.services.authorization.user_permission_service import UserPermissionService
from infra.exceptions.exceptions import AuthorizationError
from infra.models.user import User


def _administrator_role(role) -> bool:
    return (
        (role.code or "").strip().upper() in UserPermissionService.ADMIN_ROLE_CODES
        or (role.name or "").strip() == UserPermissionService.ADMIN_ROLE_NAME
    )


async def authorize_administrator_management(
    tenant_id: int, data, current_user_id: int, *, current_user=None, target_user=None,
) -> None:
    # 租户账号不能通过组织用户接口变成平台账号，包括平台管理员发起的请求。
    if getattr(data, "is_infra_admin", None) is True:
        raise AuthorizationError("组织用户不能设置为平台管理员，请使用平台账号管理")

    desired_admin = getattr(data, "is_tenant_admin", None)
    sensitive = desired_admin is not None and desired_admin != bool(
        getattr(target_user, "is_tenant_admin", False)
    )
    if target_user is not None:
        target_roles = await UserPermissionService.get_user_roles(target_user.id, tenant_id)
        sensitive = sensitive or bool(target_user.is_tenant_admin or target_user.is_infra_admin)
        sensitive = sensitive or any(_administrator_role(role) for role in target_roles)
    if getattr(data, "role_uuids", None):
        roles = await Role.filter(
            tenant_id=tenant_id, uuid__in=data.role_uuids, deleted_at__isnull=True,
        ).all()
        sensitive = sensitive or any(_administrator_role(role) for role in roles)
    if not sensitive:
        return

    # 虚拟平台管理员与租户用户可能使用相同数字 ID，不能仅凭 ID 推断其身份。
    actor = current_user
    if actor is None:
        actor = await User.get_or_none(
            id=current_user_id, tenant_id=tenant_id, is_active=True, deleted_at__isnull=True,
        )
    if actor is None or actor.id != current_user_id or not actor.is_active:
        raise AuthorizationError("仅管理员可以维护管理员账号或授予管理员身份")
    if actor.tenant_id is None and actor.is_infra_admin:
        return
    if actor.tenant_id == tenant_id:
        if actor.is_tenant_admin:
            return
        actor_roles = await UserPermissionService.get_user_roles(actor.id, tenant_id)
        if any(_administrator_role(role) for role in actor_roles):
            return
    raise AuthorizationError("仅本组织管理员或平台管理员可以维护管理员账号或授予管理员身份")
