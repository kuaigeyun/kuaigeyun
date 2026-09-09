"""财务确认时点：手工立账与开票开关互斥。"""

from infra.services.business_config_service import coerce_finance_parameter_dict


def test_coerce_manual_disables_invoice_auto_switches():
    fin = coerce_finance_parameter_dict(
        {
            "revenue_recognition": "manual",
            "payable_recognition": "manual",
            "auto_generate_receivable_from_sales_invoice": True,
            "auto_generate_payable_from_purchase_invoice": True,
        }
    )
    assert fin["revenue_recognition"] == "manual"
    assert fin["payable_recognition"] == "manual"
    assert fin["auto_generate_receivable_from_sales_invoice"] is False
    assert fin["auto_generate_payable_from_purchase_invoice"] is False


def test_coerce_on_invoice_keeps_receivable_auto_switch():
    fin = coerce_finance_parameter_dict(
        {
            "revenue_recognition": "on_invoice",
            "payable_recognition": "on_purchase_invoice",
            "auto_generate_receivable_from_sales_invoice": True,
            "auto_generate_payable_from_purchase_invoice": False,
        }
    )
    assert fin["auto_generate_receivable_from_sales_invoice"] is True
    assert fin["auto_generate_payable_from_purchase_invoice"] is False


def test_coerce_on_shipment_forces_receivable_invoice_auto_off():
    fin = coerce_finance_parameter_dict(
        {
            "revenue_recognition": "on_shipment",
            "auto_generate_receivable_from_sales_invoice": True,
        }
    )
    assert fin["auto_generate_receivable_from_sales_invoice"] is False
