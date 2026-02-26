from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

# --- InvoiceItem Schemas ---

class InvoiceItemBase(BaseModel):
    item_name: str = Field(..., description="货物或应税劳务名称")
    spec_model: str | None = Field(None, description="规格型号")
    unit: str | None = Field(None, description="单位")
    quantity: Decimal | None = Field(None, description="数量")
    unit_price: Decimal | None = Field(None, description="单价(不含税)")
    amount: Decimal = Field(..., description="金额(不含税)")
    tax_rate: Decimal = Field(..., description="税率")
    tax_amount: Decimal = Field(..., description="税额")

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemUpdate(BaseModel):
    item_name: str | None = None
    spec_model: str | None = None
    unit: str | None = None
    quantity: Decimal | None = None
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    tax_rate: Decimal | None = None
    tax_amount: Decimal | None = None

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int

    model_config = ConfigDict(from_attributes=True)


# --- Invoice Schemas ---

class InvoiceBase(BaseModel):
    invoice_number: str = Field(..., description="发票号码")
    invoice_details_code: str | None = Field(None, description="发票代码")
    category: str = Field(default="IN", description="IN=进项(采购), OUT=销项(销售)")
    invoice_type: str = Field(default="VAT_SPECIAL", description="发票类型")
    
    partner_id: int = Field(..., description="往来单位ID")
    partner_name: str = Field(..., description="往来单位名称")
    partner_tax_no: str | None = Field(None, description="往来单位税号")
    partner_bank_info: str | None = Field(None, description="往来单位开户行及账号")
    partner_address_phone: str | None = Field(None, description="往来单位地址及电话")

    amount_excluding_tax: Decimal = Field(..., description="不含税金额")
    tax_amount: Decimal = Field(..., description="税额")
    total_amount: Decimal = Field(..., description="价税合计")
    tax_rate: Decimal = Field(default=0.13, description="税率")
    
    invoice_date: date = Field(..., description="开票日期")
    received_date: date | None = Field(None, description="收票/开具日期")
    
    status: str = Field(default="DRAFT", description="状态")
    verification_date: date | None = Field(None, description="认证日期")
    source_document_code: str | None = Field(None, description="来源单据号")
    attachment_uuid: str | None = Field(None, description="附件ID")
    description: str | None = Field(None, description="备注")

class InvoiceCreate(InvoiceBase):
    items: list[InvoiceItemCreate] = []

class InvoiceUpdate(BaseModel):
    invoice_number: str | None = None
    invoice_details_code: str | None = None
    category: str | None = None
    invoice_type: str | None = None
    partner_id: int | None = None
    partner_name: str | None = None
    partner_tax_no: str | None = None
    partner_bank_info: str | None = None
    partner_address_phone: str | None = None
    amount_excluding_tax: Decimal | None = None
    tax_amount: Decimal | None = None
    total_amount: Decimal | None = None
    tax_rate: Decimal | None = None
    invoice_date: date | None = None
    received_date: date | None = None
    status: str | None = None
    verification_date: date | None = None
    source_document_code: str | None = None
    attachment_uuid: str | None = None
    description: str | None = None

class InvoiceResponse(InvoiceBase):
    id: int
    tenant_id: int
    invoice_code: str
    items: list[InvoiceItemResponse] = []
    created_at: datetime
    updated_at: datetime
    created_by: int | None
    updated_by: int | None

    model_config = ConfigDict(from_attributes=True)

class InvoiceListResponse(BaseModel):
    items: list[InvoiceResponse]
    total: int
    skip: int
    limit: int
