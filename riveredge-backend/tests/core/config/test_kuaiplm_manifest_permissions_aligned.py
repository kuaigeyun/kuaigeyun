"""快研发前后端 manifest 权限声明必须一致（INF-01）。"""

from __future__ import annotations

import json
from pathlib import Path


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def _load_permissions(manifest_path: Path) -> set[str]:
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    codes = data.get("permissions") or []
    if not isinstance(codes, list):
        raise AssertionError(f"{manifest_path} permissions 必须是数组")
    return {str(c).strip().lower() for c in codes if str(c).strip()}


def test_kuaiplm_frontend_backend_permissions_aligned():
    backend_root = _repo_root()
    be = backend_root / "src" / "apps" / "kuaiplm" / "manifest.json"
    fe = backend_root.parent / "riveredge-frontend" / "src" / "apps" / "kuaiplm" / "manifest.json"

    assert be.exists(), f"缺少后端 manifest: {be}"
    assert fe.exists(), f"缺少前端 manifest: {fe}"

    fe_codes = _load_permissions(fe)
    be_codes = _load_permissions(be)

    only_fe = sorted(fe_codes - be_codes)
    only_be = sorted(be_codes - fe_codes)
    assert not only_fe and not only_be, (
        f"kuaiplm 前后端 permissions 不一致\n仅前端: {only_fe}\n仅后端: {only_be}"
    )


def test_document_global_view_in_core_permissions():
    registry = _repo_root() / "src" / "core" / "services" / "authorization" / "permission_registry_service.py"
    text = registry.read_text(encoding="utf-8")
    assert 'system:document-global-view:read' in text

    labels = _repo_root() / "src" / "core" / "config" / "permission_action_spec.py"
    label_text = labels.read_text(encoding="utf-8")
    assert 'system:document-global-view:read' in label_text
