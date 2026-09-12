"""会计科目编码规则与级次解析。"""

from apps.kuaicaiwu.services.gl.coa_service import CoaService


def test_code_lengths_from_rule_default():
    assert CoaService.code_lengths_from_rule("4-2-2-2") == [4, 6, 8, 10]


def test_code_lengths_from_rule_custom():
    assert CoaService.code_lengths_from_rule("4-3-3") == [4, 7, 10]


def test_cas_manufacturing_cost_accounts_sequential():
    from apps.kuaicaiwu.services.gl.coa_templates import COA_TEMPLATES

    codes = [
        row["account_code"]
        for row in COA_TEMPLATES["cas_manufacturing"]["accounts"]
        if row.get("account_type") == "cost"
    ]
    assert codes == ["5001", "5101", "5201", "5301", "5401", "5402", "5403"]


def test_cas_core_equity_includes_4102():
    from apps.kuaicaiwu.services.gl.coa_templates import COA_TEMPLATES

    equity_codes = [
        row["account_code"]
        for row in COA_TEMPLATES["cas_manufacturing"]["accounts"]
        if row.get("account_type") == "equity"
    ]
    assert "4102" in equity_codes
    idx_4101 = equity_codes.index("4101")
    idx_4102 = equity_codes.index("4102")
    idx_4103 = equity_codes.index("4103")
    assert idx_4101 < idx_4102 < idx_4103
