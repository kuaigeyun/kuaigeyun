#!/usr/bin/env python3
"""Strip Modal.confirm from UniTable onDelete handlers; UniBatchDeleteButton already uses Popconfirm."""

from __future__ import annotations

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"

# Reuse brace matcher from sibling script
import importlib.util

spec = importlib.util.spec_from_file_location(
    "cc", Path(__file__).parent / "convert_confirm_to_popconfirm.py"
)
cc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cc)  # type: ignore

match_brace = cc.match_brace
get_on_ok_body = cc.get_on_ok_body
get_expr_prop = cc.get_expr_prop
CONFIRM_RE = cc.CONFIRM_RE


def strip_ondelete_confirm(content: str) -> tuple[str, int]:
    changed = 0
    pattern = re.compile(
        r"const\s+(handleDelete\w*|handleBatchDelete)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>\s*\{",
        re.M,
    )
    pattern2 = re.compile(
        r"const\s+(handleBatchDelete)\s*=\s*\(\)\s*=>\s*\{",
        re.M,
    )
    matches = list(pattern.finditer(content)) + list(pattern2.finditer(content))
    for m in matches:
        name = m.group(1)
        params = m.group(2).strip() if m.lastindex and m.lastindex >= 2 and m.group(2) else "keys: React.Key[]"
        b0 = m.end() - 1
        b1 = match_brace(content, b0)
        if b1 < 0:
            continue
        body = content[b0 + 1 : b1]
        cm = CONFIRM_RE.search(body)
        if not cm:
            continue
        cb0 = body.find("{", cm.end() - 1)
        cb1 = match_brace(body, cb0)
        if cb1 < 0:
            continue
        props = body[cb0 + 1 : cb1]
        if cc.is_jsx_content(props):
            continue
        on_ok = get_on_ok_body(props)
        if not on_ok:
            continue
        # entire body should be mostly confirm
        before = body[: cm.start()].strip()
        after = body[cb1 + 1 :].strip()
        after = re.sub(r"^\)\s*;?\s*$", "", after)
        if after:
            continue
        title = get_expr_prop(props, "title")
        desc = get_expr_prop(props, "content")
        pre_confirm = before
        on_ok_final = on_ok
        if pre_confirm:
            on_ok_final = pre_confirm + "\n    " + on_ok
        on_ok_final = re.sub(r"selectedRowKeys\.length", "keys.length", on_ok_final)
        on_ok_final = re.sub(r"for \(const key of selectedRowKeys\)", "for (const key of keys)", on_ok_final)
        on_ok_final = re.sub(r"selectedRowKeys", "keys", on_ok_final)
        new_fn = f"const {name} = async ({params}) => {{\n    {on_ok_final}\n  }};"
        content = content[: m.start()] + new_fn + content[b1 + 1 :]
        changed += 1
        if (title or desc) and "deleteConfirmTitle" not in content:
            props_lines = []
            if title:
                props_lines.append(f"deleteConfirmTitle={{{title}}}")
            if desc:
                if "keys.length" in desc:
                    desc_fn = re.sub(r"keys\.length", "count", desc)
                    props_lines.append(f"deleteConfirmDescription={{(count) => {desc_fn}}}")
                elif "count:" in desc:
                    props_lines.append(f"deleteConfirmDescription={{(count) => {desc}}}")
                else:
                    props_lines.append(f"deleteConfirmDescription={{{desc}}}")
            insert = "\n          ".join(props_lines) + "\n          "
            content = re.sub(
                r"(\n\s*onDelete=\{" + name + r"\})",
                insert + r"\1",
                content,
                count=1,
            )
            content = re.sub(
                r"onDelete=\{handleBatchDelete\}",
                f"onDelete={{{name}}}",
                content,
                count=1,
            )
    if "getAntdModal()" not in content:
        content = re.sub(r"^import \{ getAntdModal \} from '[^']+';\n", "", content, flags=re.M)
    return content, changed


def main() -> None:
    total = 0
    for dp, _, fns in os.walk(ROOT):
        for fn in fns:
            if not fn.endswith((".tsx", ".ts")):
                continue
            path = Path(dp) / fn
            text = path.read_text(encoding="utf-8")
            if "onDelete=" not in text or not CONFIRM_RE.search(text):
                continue
            new, n = strip_ondelete_confirm(text)
            if n:
                path.write_text(new, encoding="utf-8")
                total += n
                print(f"{path.relative_to(ROOT)}: {n}")
    print("total", total)


if __name__ == "__main__":
    main()
