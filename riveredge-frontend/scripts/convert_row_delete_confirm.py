#!/usr/bin/env python3
"""Convert inline row delete Modal.confirm to ActionConfirmPopconfirm.

DEPRECATED — DO NOT RUN. See .cursor/rules/no-batch-codemod.mdc
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"

INLINE_CONFIRM = re.compile(
    r"onClick=\{\(e\)\s*=>\s*\{\s*e\.stopPropagation\(\);\s*"
    r"getAntdModal\(\)\.confirm\(\{\s*"
    r"title:\s*t\('common\.deleteTitle'\),\s*"
    r"onOk:\s*\(\)\s*=>\s*record\.id\s*&&\s*handleDelete\(\[record\.id\]\),\s*"
    r"\}\);\s*\}\s*\}\s*>",
    re.S,
)

REPLACEMENT = """onClick={(e) => e.stopPropagation()}
                >
                  {t('common.delete')}
                </Button>
              </ActionConfirmPopconfirm>
            )}
            __MARKER__"""

# Simpler approach: file-by-file known pattern
FILES = list(ROOT.glob("apps/kuaizhizao/pages/equipment-management/**/index.tsx"))


def rel_import(path: Path) -> str:
    import os

    rel = os.path.relpath(ROOT / "components" / "action-confirm", path.parent).replace("\\", "/")
    return rel if rel.startswith(".") else "./" + rel


def convert_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "onOk: () => record.id && handleDelete" not in text:
        return False
    orig = text

    # strip batch handleDelete confirm if present
    text = re.sub(
        r"const handleDelete = async \(keys: React\.Key\[\]\) => \{\s*"
        r"getAntdModal\(\)\.confirm\(\{[\s\S]*?\}\);\s*\};",
        lambda m: re.sub(
            r"getAntdModal\(\)\.confirm\(\{([\s\S]*?)onOk: async \(\) => \{([\s\S]*?)\},\s*\}\);",
            r"\2",
            m.group(0).replace("const handleDelete", "const executeDelete", 1),
        ).replace("getAntdModal().confirm({", "").replace("});", "", 1)
        if "getAntdModal().confirm" in m.group(0)
        else m.group(0),
        text,
        count=1,
    )

    # manual strip for handleDelete confirm block
    if "const handleDelete = async" in text and "getAntdModal().confirm" in text:
        m = re.search(r"const handleDelete = async \(keys: React\.Key\[\]\) => \{", text)
        if m:
            start = m.start()
            # find matching close
            from convert_confirm_to_popconfirm import match_brace, get_on_ok_body, CONFIRM_RE

            b0 = text.find("{", m.end() - 1)
            b1 = match_brace(text, b0)
            body = text[b0 + 1 : b1]
            cm = CONFIRM_RE.search(body)
            if cm:
                cb0 = body.find("{", cm.end() - 1)
                cb1 = match_brace(body, cb0)
                on_ok = get_on_ok_body(body[cb0 + 1 : cb1])
                if on_ok:
                    text = (
                        text[:start]
                        + f"const executeDelete = async (keys: React.Key[]) => {{\n    {on_ok}\n  }};"
                        + text[b1 + 1 :]
                    )

    text = text.replace("handleDelete([record.id])", "executeDelete([record.id])")

    old_block = re.search(
        r"\{perms\.canDelete && record\.status === '草稿' && \(\s*"
        r"<Button[\s\S]*?"
        r"getAntdModal\(\)\.confirm\(\{[\s\S]*?\}\);\s*"
        r"\}\s*\}\s*>[\s\S]*?"
        r"\{t\('common\.delete'\)\}\s*"
        r"</Button>\s*"
        r"\)\}",
        text,
    )
    if old_block:
        new_block = """{perms.canDelete && record.status === '草稿' && (
              <ActionConfirmPopconfirm
                title={t('common.deleteTitle')}
                onConfirm={() => record.id && void executeDelete([record.id])}
              >
                <Button
                  {...rowActionKind('delete')}
                  type="link"
                  size="small"
                  danger
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('common.delete')}
                </Button>
              </ActionConfirmPopconfirm>
            )}"""
        text = text[: old_block.start()] + new_block + text[old_block.end() :]

    if "ActionConfirmPopconfirm" in text and "ActionConfirmPopconfirm" not in orig:
        imp = f"import {{ ActionConfirmPopconfirm }} from '{rel_import(path)}';"
        if imp not in text:
            ims = list(re.finditer(r"^import .+;$", text, re.M))
            text = text[: ims[-1].end()] + "\n" + imp + text[ims[-1].end() :]
    if "getAntdModal()" not in text:
        text = re.sub(r"^import \{ getAntdModal \} from '[^']+';\n", "", text, flags=re.M)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "cc", Path(__file__).parent / "convert_confirm_to_popconfirm.py"
    )
    global match_brace, get_on_ok_body, CONFIRM_RE
    cc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cc)

    n = 0
    for path in FILES:
        if convert_file(path):
            print(path.relative_to(ROOT))
            n += 1
    print("converted", n)


if __name__ == "__main__":
    main()
