"""行业扩展 profile 内置种子与通用默认契约。"""

import json
from pathlib import Path

from core.config.industry_document_profiles import GENERIC_PROFILES_BY_KEY
from core.config.industry_extension_registry import parse_industry_extensions
from core.services.application.industry_extension_runtime_service import (
    IndustryExtensionRuntimeService,
)


def _electronics_manifest() -> dict:
    path = (
        Path(__file__).resolve().parents[4]
        / "src"
        / "apps"
        / "kuaielectronics"
        / "manifest.json"
    )
    return json.loads(path.read_text(encoding="utf-8"))


def test_electronics_builtin_seeds_cover_manifest_profile_keys():
    decls = parse_industry_extensions("kuaielectronics", _electronics_manifest())
    profile_keys = {
        d.profile_key for d in decls if d.kind == "replace" and d.strategy == "profile"
    }
    assert profile_keys == {"kuaiplm.sample_process", "kuaiplm.bom_collab"}
    for key in profile_keys:
        seed = IndustryExtensionRuntimeService._builtin_seed("kuaielectronics", key)
        assert seed is not None
        assert key in GENERIC_PROFILES_BY_KEY
    doc_ids = {
        d.id for d in decls if d.kind == "replace" and d.strategy == "document"
    }
    assert "electronics.label_oem" in doc_ids
    standalone = {d.id for d in decls if d.kind == "standalone"}
    assert "electronics.esd" in standalone


def test_generic_bom_sections_use_neutral_labels():
    bom = GENERIC_PROFILES_BY_KEY["kuaiplm.bom_collab"]
    labels = [s["label"] for s in bom["sections"]]
    assert labels == ["分区一", "分区二"]


def test_generic_sample_process_has_no_pcb_labels():
    sample = GENERIC_PROFILES_BY_KEY["kuaiplm.sample_process"]
    assert sample["field_labels"]["material_code"] == "物料编码"
    assert sample["field_labels"]["material_version"] == "物料版本"
    kind_codes = {x["code"] for x in sample["request_kinds"]}
    assert kind_codes == {"general"}


def test_electronics_manifest_is_installable_without_pro_gate():
    """交付扫尾：电子包须可在无 Pro 许可时启用，避免挡联调。"""
    assert _electronics_manifest().get("is_pro") is False
