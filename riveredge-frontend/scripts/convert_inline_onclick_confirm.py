#!/usr/bin/env python3
"""Convert inline onClick Modal.confirm to ActionConfirmPopconfirm.

DEPRECATED — DO NOT RUN. See .cursor/rules/no-batch-codemod.mdc
"""

from __future__ import annotations

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
SKIP_DIRS = {"haoligo"}
CONFIRM_RE = re.compile(
    r"(?:Modal\.confirm|getAntdModal\(\)\.confirm|modal\.confirm|modalApi\.confirm)\("
)


def rel_import(path: Path) -> str:
    rel = os.path.relpath(ROOT / "components" / "action-confirm", path.parent).replace("\\", "/")
    return rel if rel.startswith(".") else "./" + rel


def add_import(content: str, path: Path) -> str:
    line = f"import {{ ActionConfirmPopconfirm }} from '{rel_import(path)}';"
    if "ActionConfirmPopconfirm" in content:
        return content
    ims = list(re.finditer(r"^import .+;$", content, re.M))
    if ims:
        p = ims[-1].end()
        return content[:p] + "\n" + line + content[p:]
    return line + "\n" + content


def is_jsx_content_block(block: str) -> bool:
    m = re.search(r"\bcontent\s*:\s*", block)
    if not m:
        return False
    rest = block[m.end() :].lstrip()
    if rest.startswith("("):
        rest = rest[1:].lstrip()
    return rest.startswith("<")


def extract_on_ok(block: str) -> str | None:
    m = re.search(r"\bonOk\s*:\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{", block)
    if not m:
        m = re.search(r"\bonOk\s*:\s*(?:async\s*)?\(\)\s*=>\s*\{", block)
    if not m:
        m = re.search(r"\bonOk\s*:\s*\(\)\s*=>\s*", block)
        if m:
            # single expression onOk: () => foo()
            rest = block[m.end() :].lstrip()
            expr = rest.split(",")[0].strip()
            return f"void {expr}" if not expr.startswith("void") else expr
        return None
    start = block.find("{", m.start())
    depth = 0
    i = start
    while i < len(block):
        if block[i] == "{":
            depth += 1
        elif block[i] == "}":
            depth -= 1
            if depth == 0:
                return block[start + 1 : i].strip()
        i += 1
    return None


def extract_title(block: str) -> str | None:
    m = re.search(r"\btitle\s*:\s*", block)
    if not m:
        return None
    rest = block[m.end() :].lstrip()
    depth = 0
    i = 0
    while i < len(rest):
        c = rest[i]
        if c in "'\"`":
            q = c
            i += 1
            while i < len(rest):
                if rest[i] == "\\":
                    i += 2
                    continue
                if rest[i] == q:
                    break
                i += 1
        elif c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == "," and depth == 0:
            return rest[:i].strip()
        i += 1
    return rest.strip().rstrip(",")


def extract_description(block: str) -> str | None:
    m = re.search(r"\bcontent\s*:\s*", block)
    if not m:
        return None
    rest = block[m.end() :].lstrip()
    if rest.startswith("<"):
        return None
    if rest.startswith("("):
        rest = rest[1:].lstrip()
        if rest.startswith("<"):
            return None
    depth = 0
    i = 0
    while i < len(rest):
        c = rest[i]
        if c in "'\"`":
            q = c
            i += 1
            while i < len(rest):
                if rest[i] == "\\":
                    i += 2
                    continue
                if rest[i] == q:
                    break
                i += 1
        elif c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == "," and depth == 0:
            return rest[:i].strip()
        i += 1
    return rest.strip().rstrip(",")


def convert_file(path: Path) -> int:
    if any(part in SKIP_DIRS for part in path.parts):
        return 0
    text = path.read_text(encoding="utf-8")
    if not CONFIRM_RE.search(text):
        return 0
    converted = 0
    # Pattern: onClick={() => { ... confirm({...}); }}
    pattern = re.compile(
        r"onClick=\{\(\)\s*=>\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\}",
        re.S,
    )
    for m in list(pattern.finditer(text)):
        body = m.group(1)
        cm = CONFIRM_RE.search(body)
        if not cm:
            continue
        # find confirm block
        cb_start = body.find("{", cm.end() - 1)
        depth = 0
        i = cb_start
        while i < len(body):
            if body[i] == "{":
                depth += 1
            elif body[i] == "}":
                depth -= 1
                if depth == 0:
                    cb_end = i
                    break
            i += 1
        else:
            continue
        props = body[cb_start + 1 : cb_end]
        if is_jsx_content_block(props):
            continue
        on_ok = extract_on_ok(props)
        if not on_ok:
            continue
        title = extract_title(props)
        if not title:
            continue
        desc = extract_description(props)
        ok_type_m = re.search(r"okType\s*:\s*'([^']+)'", props)
        ok_type = ok_type_m.group(1) if ok_type_m else None

        onclick_start = m.start()
        btn_start = text.rfind("<Button", 0, onclick_start)
        if btn_start < 0:
            btn_start = text.rfind("<Button", max(0, onclick_start - 500), onclick_start)
        if btn_start < 0:
            continue
        sc = text.find("/>", m.end())
        close = text.find("</Button>", m.end())
        if sc != -1 and (close == -1 or sc < close):
            btn_end = sc + 2
        else:
            if close == -1:
                continue
            btn_end = close + len("</Button>")

        attrs = [f"title={{{title}}}"]
        if desc:
            attrs.append(f"description={{{desc}}}")
        if ok_type:
            attrs.append(f'okType="{ok_type}"')
        pop = (
            f"<ActionConfirmPopconfirm {' '.join(attrs)} onConfirm={{async () => {{\n"
            f"                {on_ok}\n"
            f"              }}}}\n"
            f"            >\n"
            f"              {text[btn_start:btn_end].replace(m.group(0), 'onClick={(e) => e.stopPropagation()}')}\n"
            f"            </ActionConfirmPopconfirm>"
        )
        text = text[:btn_start] + pop + text[btn_end:]
        converted += 1

    if converted:
        text = add_import(text, path)
        if "getAntdModal()" not in text:
            text = re.sub(r"^import \{ getAntdModal \} from '[^']+';\n", "", text, flags=re.M)
        text = re.sub(
            r"const \{\s*message(?:: messageApi)?,\s*modal(?:: modalApi)?\s*\} = App\.useApp\(\);",
            lambda m: m.group(0).replace(", modal", "").replace(", modal: modalApi", "").replace("modal: modalApi, ", "").replace("modal, ", ""),
            text,
        )
        path.write_text(text, encoding="utf-8")
    return converted


def main() -> None:
    total = 0
    for dp, _, fns in os.walk(ROOT):
        if "haoligo" in dp.replace("\\", "/").split("/"):
            continue
        for fn in fns:
            if fn.endswith((".tsx", ".ts")):
                n = convert_file(Path(dp) / fn)
                if n:
                    print(f"{Path(dp).relative_to(ROOT) / fn}: {n}")
                    total += n
    print("total", total)


if __name__ == "__main__":
    main()
