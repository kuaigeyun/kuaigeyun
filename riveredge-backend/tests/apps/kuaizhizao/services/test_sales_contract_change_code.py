from unittest.mock import AsyncMock

import pytest
from apps.kuaizhizao.services.sales_contract_service import SalesContractService
from core.services.business.code_generation_service import CodeGenerationService
from core.config.code_rule_pages import CODE_RULE_PAGES


@pytest.mark.asyncio
async def test_contract_change_uses_its_own_code_rule(monkeypatch):
    generate = AsyncMock(return_value="CHANGE-001")
    monkeypatch.setattr(CodeGenerationService, "generate_code", generate)
    code = await SalesContractService()._generate_change_code(42)
    assert code == "CHANGE-001"
    assert generate.call_args.kwargs["tenant_id"] == 42
    expected = next(p["rule_code"] for p in CODE_RULE_PAGES if p["page_code"] == "kuaizhizao-sales-contract-change")
    assert generate.call_args.kwargs["rule_code"] == expected
    assert generate.call_args.kwargs["context"]["date"]
