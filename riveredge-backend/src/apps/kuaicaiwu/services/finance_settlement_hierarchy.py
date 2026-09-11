"""
收/付款单挂到应收/应付单之下的层级排序（伙伴对账单、业务单据对账往来缺口共用）。
"""

from __future__ import annotations

from collections import defaultdict
from typing import Any, Dict, List, Optional, Set, Tuple


async def order_lines_by_settlement_hierarchy(
    tenant_id: int,
    lines: List[Dict[str, Any]],
    *,
    parent_doc_types: Set[str],
    child_doc_types: Set[str],
    rel_source: str,
    rel_target: str,
    debit_doc_type: str,
    credit_doc_type: str,
    sort_date_key: str = "sort_date",
    date_fallback_key: str = "date",
    return_offset_child_doc_types: Optional[Set[str]] = None,
    return_offset_credit_doc_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    将收/付款（含退款）与退货冲减台账挂到对应应收/应付单之下（扁平列表 + tree_level）。

    关联顺序：
    1. DocumentRelation 应收/应付 → 收/付款（加载创建）
    2. SettlementRecord 正向核销（应收借 / 收款贷）
    3. SettlementRecord 退款冲回（收款借 / 应收贷）
    4. DocumentRelation 收/付款 → 收/付款（退款从源收款加载）：继承源单父应收，或再查源单核销
    5. SettlementRecord 退货未结冲减（蓝字应收/应付借 / SalesReturnOffset|PurchaseReturnOffset 贷）
    """
    if not lines:
        return lines

    return_offset_types = set(return_offset_child_doc_types or ())
    all_child_types = set(child_doc_types) | return_offset_types

    parents = [ln for ln in lines if ln.get("doc_type") in parent_doc_types]
    children = [ln for ln in lines if ln.get("doc_type") in all_child_types]
    others = [
        ln
        for ln in lines
        if ln.get("doc_type") not in parent_doc_types and ln.get("doc_type") not in all_child_types
    ]
    if not parents or not children:
        for ln in lines:
            ln.setdefault("tree_level", 0)
        return lines

    parent_by_id = {
        int(p["doc_id"]): p for p in parents if p.get("doc_id") is not None
    }
    parent_ids = set(parent_by_id.keys())
    child_ids = [int(c["doc_id"]) for c in children if c.get("doc_id") is not None]
    child_parent: Dict[int, int] = {}

    if child_ids:
        from apps.kuaizhizao.models.document_relation import DocumentRelation

        rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            source_type=rel_source,
            target_type=rel_target,
            target_id__in=child_ids,
        ).all()
        for rel in rels:
            if not rel.source_id or not rel.target_id:
                continue
            sid, tid = int(rel.source_id), int(rel.target_id)
            if sid in parent_ids:
                child_parent.setdefault(tid, sid)

    unset_ids = [cid for cid in child_ids if cid not in child_parent]
    if unset_ids:
        from apps.kuaicaiwu.models.settlement import SettlementRecord

        # 正向核销：应收/应付 借，收/付款 贷
        settles = await SettlementRecord.filter(
            tenant_id=tenant_id,
            debit_doc_type=debit_doc_type,
            credit_doc_type=credit_doc_type,
            credit_doc_id__in=unset_ids,
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        by_credit: Dict[int, List[Any]] = defaultdict(list)
        for s in settles:
            if s.debit_doc_id and int(s.debit_doc_id) in parent_ids:
                by_credit[int(s.credit_doc_id)].append(s)
        for cid, lst in by_credit.items():
            best = max(lst, key=lambda x: abs(float(x.amount or 0)))
            child_parent[cid] = int(best.debit_doc_id)

    # 退款冲回：收/付款 借，应收/应付 贷（debit=退款单，credit=应收/应付）
    unset_ids = [cid for cid in child_ids if cid not in child_parent]
    if unset_ids:
        from apps.kuaicaiwu.models.settlement import SettlementRecord

        reverse_settles = await SettlementRecord.filter(
            tenant_id=tenant_id,
            debit_doc_type=credit_doc_type,
            credit_doc_type=debit_doc_type,
            debit_doc_id__in=unset_ids,
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        by_debit: Dict[int, List[Any]] = defaultdict(list)
        for s in reverse_settles:
            if s.credit_doc_id and int(s.credit_doc_id) in parent_ids:
                by_debit[int(s.debit_doc_id)].append(s)
        for cid, lst in by_debit.items():
            best = max(lst, key=lambda x: abs(float(x.amount or 0)))
            child_parent[cid] = int(best.credit_doc_id)

    # 退款从源收/付款加载：target=退款，source=源收/付款 → 继承源单父级或再查源单核销
    unset_ids = [cid for cid in child_ids if cid not in child_parent]
    if unset_ids:
        from apps.kuaizhizao.models.document_relation import DocumentRelation
        from apps.kuaicaiwu.models.settlement import SettlementRecord

        voucher_rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            source_type=rel_target,
            target_type=rel_target,
            target_id__in=unset_ids,
            relation_mode="pull",
        ).all()
        refund_to_source: Dict[int, int] = {}
        for rel in voucher_rels:
            if not rel.source_id or not rel.target_id:
                continue
            sid, tid = int(rel.source_id), int(rel.target_id)
            refund_to_source[tid] = sid

        for tid, sid in refund_to_source.items():
            if tid in child_parent:
                continue
            inherited = child_parent.get(sid)
            if inherited is not None and inherited in parent_ids:
                child_parent[tid] = inherited

        still_unset = [
            (tid, sid)
            for tid, sid in refund_to_source.items()
            if tid not in child_parent
        ]
        if still_unset:
            source_ids = list({sid for _, sid in still_unset})
            # 源收/付款正向核销到应收/应付
            source_settles = await SettlementRecord.filter(
                tenant_id=tenant_id,
                debit_doc_type=debit_doc_type,
                credit_doc_type=credit_doc_type,
                credit_doc_id__in=source_ids,
                is_active=True,
                deleted_at__isnull=True,
            ).all()
            source_parent: Dict[int, int] = {}
            by_source_credit: Dict[int, List[Any]] = defaultdict(list)
            for s in source_settles:
                if s.debit_doc_id and int(s.debit_doc_id) in parent_ids:
                    by_source_credit[int(s.credit_doc_id)].append(s)
            for sid, lst in by_source_credit.items():
                best = max(lst, key=lambda x: abs(float(x.amount or 0)))
                source_parent[sid] = int(best.debit_doc_id)
            for tid, sid in still_unset:
                pid = source_parent.get(sid)
                if pid is not None:
                    child_parent[tid] = pid

    # 退货未结冲减：蓝字应收/应付 借，SalesReturnOffset|PurchaseReturnOffset 贷
    # 对账行 doc_id 是红字应收/应付；Settlement.credit_doc_id 是退货单 id（= 红字 source_id）
    if return_offset_types and return_offset_credit_doc_type:
        return_children = [
            c
            for c in children
            if c.get("doc_type") in return_offset_types
            and c.get("doc_id") is not None
            and int(c["doc_id"]) not in child_parent
        ]
        if return_children:
            from apps.kuaicaiwu.models.settlement import SettlementRecord

            child_to_return_id: Dict[int, int] = {}
            need_lookup: List[int] = []
            for c in return_children:
                cid = int(c["doc_id"])
                raw_oid = c.get("offset_source_id")
                if raw_oid is not None and str(raw_oid).strip() != "":
                    child_to_return_id[cid] = int(raw_oid)
                else:
                    need_lookup.append(cid)

            if need_lookup:
                if debit_doc_type == "Payable":
                    from apps.kuaicaiwu.models.payable import Payable

                    rows = await Payable.filter(
                        tenant_id=tenant_id, id__in=need_lookup, deleted_at__isnull=True
                    ).all()
                    for row in rows:
                        if row.source_id:
                            child_to_return_id[int(row.id)] = int(row.source_id)
                else:
                    from apps.kuaicaiwu.models.receivable import Receivable

                    rows = await Receivable.filter(
                        tenant_id=tenant_id, id__in=need_lookup, deleted_at__isnull=True
                    ).all()
                    for row in rows:
                        if row.source_id:
                            child_to_return_id[int(row.id)] = int(row.source_id)

            return_ids = list({rid for rid in child_to_return_id.values()})
            if return_ids:
                offset_settles = await SettlementRecord.filter(
                    tenant_id=tenant_id,
                    debit_doc_type=debit_doc_type,
                    credit_doc_type=return_offset_credit_doc_type,
                    credit_doc_id__in=return_ids,
                    is_active=True,
                    deleted_at__isnull=True,
                ).all()
                by_return: Dict[int, List[Any]] = defaultdict(list)
                for s in offset_settles:
                    if s.debit_doc_id and int(s.debit_doc_id) in parent_ids:
                        by_return[int(s.credit_doc_id)].append(s)
                return_to_parent: Dict[int, int] = {}
                for rid, lst in by_return.items():
                    best = max(lst, key=lambda x: abs(float(x.amount or 0)))
                    return_to_parent[rid] = int(best.debit_doc_id)
                for cid, rid in child_to_return_id.items():
                    pid = return_to_parent.get(rid)
                    if pid is not None:
                        child_parent[cid] = pid

    buckets: Dict[int, List[Dict[str, Any]]] = defaultdict(list)
    orphans: List[Dict[str, Any]] = []
    for c in children:
        row = dict(c)
        cid = int(row["doc_id"]) if row.get("doc_id") is not None else None
        pid = child_parent.get(cid) if cid is not None else None
        if pid is not None and pid in parent_by_id:
            parent = parent_by_id[pid]
            row["tree_level"] = 1
            row["parent_doc_id"] = pid
            row["parent_doc_code"] = parent.get("doc_code")
            buckets[pid].append(row)
        else:
            row["tree_level"] = 0
            orphans.append(row)

    def _line_sort_key(ln: Dict[str, Any]) -> Tuple[Any, ...]:
        return (
            ln.get(sort_date_key) or ln.get(date_fallback_key) or "",
            ln.get("doc_type") or "",
            ln.get("doc_id") or 0,
        )

    for pid in buckets:
        buckets[pid].sort(key=_line_sort_key)

    top_items: List[Tuple[str, Dict[str, Any]]] = []
    for p in parents:
        row = dict(p)
        row["tree_level"] = 0
        top_items.append(("parent", row))
    for o in orphans:
        top_items.append(("orphan", o))
    for o in others:
        row = dict(o)
        row.setdefault("tree_level", 0)
        top_items.append(("other", row))

    top_items.sort(
        key=lambda item: (
            item[1].get(sort_date_key) or item[1].get(date_fallback_key) or "",
            0 if item[0] == "parent" else 1,
            item[1].get("doc_type") or "",
            item[1].get("doc_id") or 0,
        )
    )

    result: List[Dict[str, Any]] = []
    for kind, item in top_items:
        result.append(item)
        if kind == "parent":
            pid = item.get("doc_id")
            if pid is not None:
                result.extend(buckets.get(int(pid), []))
    return result
