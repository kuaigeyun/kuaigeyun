"""行业扩展登记（独立功能型 / 替代功能型）。

真源：各行业模块 manifest.json 的 industry_extensions。
禁止客户公司名；同一宿主 menu_path 同时只能有一个启用中的 replace。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Literal, Optional, Tuple

ExtensionKind = Literal["standalone", "replace"]
ReplaceStrategy = Literal["profile", "document"]


@dataclass(frozen=True)
class IndustryExtensionDecl:
    id: str
    module_app_code: str
    kind: ExtensionKind
    strategy: Optional[ReplaceStrategy] = None
    host_app: Optional[str] = None
    menu_path: Optional[str] = None
    resource: Optional[str] = None
    profile_key: Optional[str] = None
    replacement_app: Optional[str] = None
    replacement_path: Optional[str] = None
    pack_menu: bool = True
    seed: Optional[Dict[str, Any]] = None


def _require_str(raw: Dict[str, Any], key: str) -> str:
    val = str(raw.get(key) or "").strip()
    if not val:
        raise ValueError(f"industry_extensions 项缺少 {key}")
    return val


def parse_industry_extensions(
    module_app_code: str, manifest: Dict[str, Any]
) -> List[IndustryExtensionDecl]:
    """解析并校验单个模块的 industry_extensions。"""
    raw_list = manifest.get("industry_extensions")
    if raw_list is None:
        return []
    if not isinstance(raw_list, list):
        raise ValueError(f"{module_app_code}: industry_extensions 须为数组")

    out: List[IndustryExtensionDecl] = []
    seen_ids: set[str] = set()
    for idx, item in enumerate(raw_list):
        if not isinstance(item, dict):
            raise ValueError(f"{module_app_code}: industry_extensions[{idx}] 须为对象")
        ext_id = _require_str(item, "id")
        if ext_id in seen_ids:
            raise ValueError(f"{module_app_code}: 重复扩展 id {ext_id}")
        seen_ids.add(ext_id)
        kind = str(item.get("kind") or "").strip()
        if kind not in {"standalone", "replace"}:
            raise ValueError(f"{module_app_code}/{ext_id}: kind 须为 standalone|replace")

        if kind == "standalone":
            if item.get("host_app") or item.get("menu_path") or item.get("strategy"):
                raise ValueError(
                    f"{module_app_code}/{ext_id}: standalone 不得声明 host_app/menu_path/strategy"
                )
            out.append(
                IndustryExtensionDecl(
                    id=ext_id,
                    module_app_code=module_app_code,
                    kind="standalone",
                    pack_menu=bool(item.get("pack_menu", True)),
                )
            )
            continue

        strategy = str(item.get("strategy") or "").strip()
        if strategy not in {"profile", "document"}:
            raise ValueError(f"{module_app_code}/{ext_id}: replace.strategy 须为 profile|document")
        host_app = _require_str(item, "host_app")
        menu_path = _require_str(item, "menu_path")
        resource = _require_str(item, "resource")
        seed = item.get("seed")
        if seed is not None and not isinstance(seed, dict):
            raise ValueError(f"{module_app_code}/{ext_id}: seed 须为对象")

        if strategy == "profile":
            profile_key = _require_str(item, "profile_key")
            out.append(
                IndustryExtensionDecl(
                    id=ext_id,
                    module_app_code=module_app_code,
                    kind="replace",
                    strategy="profile",
                    host_app=host_app,
                    menu_path=menu_path,
                    resource=resource,
                    profile_key=profile_key,
                    seed=seed,
                )
            )
        else:
            replacement_app = _require_str(item, "replacement_app")
            replacement_path = _require_str(item, "replacement_path")
            out.append(
                IndustryExtensionDecl(
                    id=ext_id,
                    module_app_code=module_app_code,
                    kind="replace",
                    strategy="document",
                    host_app=host_app,
                    menu_path=menu_path,
                    resource=resource,
                    replacement_app=replacement_app,
                    replacement_path=replacement_path,
                )
            )
    return out


def collect_extensions_from_manifests(
    manifests: Iterable[Tuple[str, Dict[str, Any]]],
) -> List[IndustryExtensionDecl]:
    """从 (app_code, manifest) 列表收集全部扩展声明。"""
    all_ext: List[IndustryExtensionDecl] = []
    for code, manifest in manifests:
        all_ext.extend(parse_industry_extensions(code, manifest))
    return all_ext


def assert_no_replace_slot_conflict(active: List[IndustryExtensionDecl]) -> None:
    """同一 host_app + menu_path 不得有多个 replace。"""
    slots: Dict[Tuple[str, str], str] = {}
    for ext in active:
        if ext.kind != "replace" or not ext.host_app or not ext.menu_path:
            continue
        key = (ext.host_app, ext.menu_path)
        if key in slots:
            raise ValueError(
                f"替代冲突: {key[0]}{key[1]} 已被 {slots[key]} 占用，无法再启用 {ext.id}"
            )
        slots[key] = ext.id


def tenant_config_key_for_profile(profile_key: str) -> str:
    """TenantConfig.config_key，最长 100。"""
    key = f"industry.ext.{profile_key.strip()}"
    if len(key) > 100:
        raise ValueError(f"profile_key 过长: {profile_key}")
    return key


DOCUMENT_REPLACEMENTS_CONFIG_KEY = "industry.ext.document_replacements"


def document_replacement_payload(decl: IndustryExtensionDecl) -> Dict[str, Any]:
    """写入租户配置的 document 替代快照。"""
    if decl.kind != "replace" or decl.strategy != "document":
        raise ValueError(f"{decl.id} 不是 document 替代扩展")
    return {
        "extension_id": decl.id,
        "module_app_code": decl.module_app_code,
        "host_app": decl.host_app,
        "menu_path": decl.menu_path,
        "resource": decl.resource,
        "replacement_app": decl.replacement_app,
        "replacement_path": decl.replacement_path,
    }