#!/usr/bin/env python3
"""Convert pure-text Modal.confirm to ActionConfirmPopconfirm.

DEPRECATED — DO NOT RUN. See .cursor/rules/no-batch-codemod.mdc
Batch execution caused mass missing imports and truncated handlers (2026-09).
Use page-by-page manual migration only.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
CONFIRM_RE = re.compile(
    r"(?:Modal\.confirm|getAntdModal\(\)\.confirm|modal\.confirm|modalApi\.confirm)\("
)
SKIP = {"components/action-confirm/ActionConfirmPopconfirm.tsx"}


def match_brace(text: str, i: int) -> int:
    depth = 0
    sq = dq = bq = False
    tpl_expr = 0
    esc = False
    while i < len(text):
        c = text[i]
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif sq:
            if c == "'":
                sq = False
        elif dq:
            if c == '"':
                dq = False
        elif bq:
            if c == "`":
                bq = False
                tpl_expr = 0
            elif c == "$" and i + 1 < len(text) and text[i + 1] == "{":
                tpl_expr = 1
                i += 2
                continue
        elif tpl_expr:
            if c == "{":
                tpl_expr += 1
            elif c == "}":
                tpl_expr -= 1
            i += 1
            continue
        elif c == "'":
            sq = True
        elif c == '"':
            dq = True
        elif c == "`":
            bq = True
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def match_paren(text: str, i: int) -> int:
    depth = 0
    sq = dq = False
    esc = False
    while i < len(text):
        c = text[i]
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif sq:
            if c == "'":
                sq = False
        elif dq:
            if c == '"':
                dq = False
        elif c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def is_jsx_content(props: str) -> bool:
    m = re.search(r"\bcontent\s*:\s*", props)
    if not m:
        return False
    rest = props[m.end() :].lstrip()
    if rest.startswith("("):
        rest = rest[1:].lstrip()
    return rest.startswith("<")


def get_on_ok_body(props: str) -> str | None:
    m = re.search(r"\bonOk\s*:\s*(?:async\s*)?\(", props)
    if not m:
        return None
    p0 = props.find("(", m.start())
    p1 = match_paren(props, p0)
    if p1 < 0:
        return None
    j = p1 + 1
    while j < len(props) and props[j].isspace():
        j += 1
    if props.startswith("=>", j):
        j += 2
        while j < len(props) and props[j].isspace():
            j += 1
    if j >= len(props) or props[j] != "{":
        return None
    b1 = match_brace(props, j)
    if b1 < 0:
        return None
    return props[j + 1 : b1].strip()


def get_expr_prop(props: str, name: str) -> str | None:
    m = re.search(rf"\b{name}\s*:\s*", props)
    if not m:
        return None
    rest = props[m.end() :].lstrip()
    if not rest:
        return None
    if rest[0] in "'\"`":
        q = rest[0]
        out = []
        i = 1
        esc = False
        while i < len(rest):
            c = rest[i]
            if esc:
                out.append(c)
                esc = False
            elif c == "\\":
                esc = True
            elif c == q:
                return "".join(out)
            else:
                out.append(c)
            i += 1
        return "".join(out)
    # expression
    depth = 0
    i = 0
    start = 0
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
                    i += 1
                    break
                i += 1
            continue
        if c in "({":
            depth += 1
        elif c in ")}":
            depth -= 1
        elif c == "," and depth == 0:
            return rest[:i].strip()
        i += 1
    return rest.strip()


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


def cleanup(content: str) -> str:
    if "getAntdModal()" not in content:
        content = re.sub(r"^import \{ getAntdModal \} from '[^']+';\n", "", content, flags=re.M)
    if not re.search(r"\bmodal\.confirm\b|\bmodalApi\.confirm\b", content):
        for pat, repl in [
            (r"const \{ message: messageApi, modal \} = App\.useApp\(\);", "const { message: messageApi } = App.useApp();"),
            (r"const \{ modal, message: messageApi \} = App\.useApp\(\);", "const { message: messageApi } = App.useApp();"),
            (r"const \{ message, modal \} = App\.useApp\(\);", "const { message } = App.useApp();"),
            (r"const \{ modal, message \} = App\.useApp\(\);", "const { message } = App.useApp();"),
            (r"const \{ messageApi, modal \} = App\.useApp\(\);", "const { messageApi } = App.useApp();"),
            (r"const \{ modal, messageApi \} = App\.useApp\(\);", "const { messageApi } = App.useApp();"),
        ]:
            content = re.sub(pat, repl, content)
    return content


def find_handler(content: str, pos: int) -> tuple[str, str, int, int, bool] | None:
    """Return handler name, params, start, end, is_use_callback."""
    before = content[:pos]
    patterns = [
        (
            r"(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*useCallback\(\s*(?:async\s*)?\(([^)]*)\)\s*=>\s*\{",
            True,
        ),
        (
            r"(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>\s*\{",
            False,
        ),
    ]
    best = None
    for pat, is_uc in patterns:
        for m in re.finditer(pat, before):
            if best is None or m.start() > best[0].start():
                best = (m, is_uc)
    if not best:
        return None
    m, is_uc = best
    name, params = m.group(1), m.group(2)
    b0 = m.end() - 1
    b1 = match_brace(content, b0)
    if b1 < 0 or b1 < pos:
        return None
    if is_uc:
        # include trailing ), [deps]);
        rest = content[b1 + 1 : b1 + 200]
        close = re.match(r"\s*,\s*\[[^\]]*\]\s*,?\s*\)\s*;", rest)
        if not close:
            return None
        hend = b1 + 1 + close.end()
        return name, params, m.start(), hend, True
    return name, params, m.start(), b1 + 1, False


def wrap_trigger(content: str, handler: str, exec_name: str, pop_attrs: str) -> tuple[str, bool]:
    patterns = [
        rf"onClick=\{{\(\s*e\s*\)\s*=>\s*\{{\s*e(?:\?\.|\.)stopPropagation\(\);\s*{re.escape(handler)}\(([^)]*)\);\s*\}}\s*\}}",
        rf"onClick=\{{\(\)\s*=>\s*(?:void\s+)?{re.escape(handler)}\(([^)]*)\)\s*\}}",
        rf"onClick=\{{\(\)\s*=>\s*\{{\s*(?:void\s+)?{re.escape(handler)}\(([^)]*)\);\s*\}}\s*\}}",
    ]
    m = None
    for pat in patterns:
        m = re.search(pat, content)
        if m:
            break
    if not m:
        return content, False

    args = m.group(1)
    onclick_span = m.span()
    btn_start = content.rfind("<Button", 0, onclick_span[0])
    if btn_start < 0:
        return content, False
    sc = content.find("/>", onclick_span[1])
    close = content.find("</Button>", onclick_span[1])
    if sc != -1 and (close == -1 or sc < close):
        btn_end = sc + 2
    else:
        if close == -1:
            return content, False
        btn_end = close + len("</Button>")
    btn = content[btn_start:btn_end]
    new_btn = re.sub(
        rf"onClick=\{{[\s\S]*?\}}",
        "onClick={(e) => e.stopPropagation()}",
        btn,
        count=1,
    )
    wrapped = (
        f"<ActionConfirmPopconfirm {pop_attrs} onConfirm={{() => {exec_name}({args})}}>\n"
        f"              {new_btn}\n"
        f"            </ActionConfirmPopconfirm>"
    )
    return content[:btn_start] + wrapped + content[btn_end:], True


def process(path: Path) -> tuple[int, list[str]]:
    rel = path.relative_to(ROOT).as_posix()
    if rel in SKIP:
        return 0, []
    text = path.read_text(encoding="utf-8")
    if not CONFIRM_RE.search(text):
        return 0, []

    notes: list[str] = []
    converted = 0
    # collect blocks
    blocks = []
    for m in CONFIRM_RE.finditer(text):
        b0 = text.find("{", m.end() - 1)
        b1 = match_brace(text, b0)
        if b1 < 0:
            continue
        end = b1 + 2 if text[b1 + 1 : b1 + 2] == ")" else b1 + 1
        props = text[b0 + 1 : b1]
        if is_jsx_content(props):
            notes.append(f"KEEP JSX @{m.start()}")
            continue
        handler_info = find_handler(text, m.start())
        on_ok = get_on_ok_body(props)
        if not handler_info or not on_ok:
            notes.append(f"KEEP no-handler @{m.start()}")
            continue
        title = get_expr_prop(props, "title")
        ok_type = get_expr_prop(props, "okType")
        desc = get_expr_prop(props, "content")
        blocks.append((m.start(), end, handler_info, on_ok, title, desc, ok_type))

    if not blocks:
        return 0, notes

    new = text
    for start, end, handler_info, on_ok, title, desc, ok_type in reversed(blocks):
        hname, hparams, hstart, hend, is_uc = handler_info
        exec_name = "execute" + hname[6:] if hname.startswith("handle") else "execute" + hname
        old_handler = new[hstart:hend]
        if new[start:end] not in old_handler:
            notes.append(f"KEEP orphan {hname}")
            continue
        # preserve guard statements before confirm inside handler body
        inner_start = old_handler.find("{") + 1
        inner_end = old_handler.rfind("}")
        inner = old_handler[inner_start:inner_end]
        rel_confirm = inner.find(new[start - hstart : end - hstart])
        pre_confirm = ""
        if rel_confirm > 0:
            pre_confirm = inner[:rel_confirm].strip()
            if pre_confirm:
                pre_confirm = pre_confirm + "\n    "
        if is_uc:
            old_slice = new[hstart:hend]
            deps_m = re.search(r",\s*(\[[^\]]*\])\s*,?\s*\)\s*;", old_slice)
            deps = deps_m.group(1) if deps_m else "[]"
            exec_fn = (
                f"const {exec_name} = useCallback(async ({hparams}) => {{\n    {pre_confirm}{on_ok}\n  }}, {deps});"
            )
        else:
            exec_fn = f"const {exec_name} = async ({hparams}) => {{\n    {pre_confirm}{on_ok}\n  }};"
        new = new[:hstart] + exec_fn + new[hend:]

        attrs = []
        if title:
            attrs.append(f"title={{{title}}}")
        if desc:
            attrs.append(f"description={{{desc}}}")
        if ok_type:
            attrs.append(f'okType="{ok_type}"')
        pop_attrs = " ".join(attrs)
        new, ok = wrap_trigger(new, hname, exec_name, pop_attrs)
        if not ok:
            notes.append(f"MANUAL {hname} in {rel}")
            continue
        converted += 1

    if converted:
        new = add_import(new, path)
        new = cleanup(new)
        path.write_text(new, encoding="utf-8")
    return converted, notes


def main() -> None:
    total = 0
    all_notes: list[str] = []
    for dp, _, fns in os.walk(ROOT):
        for fn in fns:
            if fn.endswith((".tsx", ".ts")):
                p = Path(dp) / fn
                c, n = process(p)
                total += c
                all_notes.extend(f"{p.relative_to(ROOT).as_posix()}: {x}" for x in n)
    print("converted", total)
    for line in all_notes:
        print(line)


if __name__ == "__main__":
    main()
