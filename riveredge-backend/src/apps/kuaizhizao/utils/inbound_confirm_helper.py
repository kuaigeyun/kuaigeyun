"""入库/出库确认：解析业务操作人（支持确认时二次选择）。"""

from datetime import datetime
from typing import Awaitable, Callable, Optional, Protocol, Tuple, Union

from core.utils.timezone_utils import resolve_business_datetime


class InboundConfirmReceiverPayload(Protocol):
    receiver_id: Optional[int]
    receiver_name: Optional[str]


class OutboundConfirmDelivererPayload(Protocol):
    deliverer_id: Optional[int]
    deliverer_name: Optional[str]


async def resolve_inbound_confirm_receiver(
    *,
    confirmed_by: int,
    confirmation_data: Optional[InboundConfirmReceiverPayload],
    get_user_name: Callable[[int], Awaitable[str]],
) -> Tuple[int, str]:
    """
    确认入库时的业务操作人（入库人/退料人/收货人）。

    若请求体显式传入 receiver_id，则以所选人员为准；否则默认为确认操作人。
    """
    if confirmation_data is not None:
        rid = getattr(confirmation_data, "receiver_id", None)
        if rid is not None and int(rid) > 0:
            receiver_id = int(rid)
            receiver_name = str(getattr(confirmation_data, "receiver_name", None) or "").strip()
            if not receiver_name:
                receiver_name = await get_user_name(receiver_id)
            return receiver_id, receiver_name

    confirmer_name = await get_user_name(confirmed_by)
    return confirmed_by, confirmer_name


async def resolve_outbound_confirm_deliverer(
    *,
    confirmed_by: int,
    confirmation_data: Optional[OutboundConfirmDelivererPayload],
    get_user_name: Callable[[int], Awaitable[str]],
    existing_deliverer_id: Optional[int] = None,
    existing_deliverer_name: Optional[str] = None,
) -> Tuple[int, str]:
    """
    确认出库时的业务出库人。

    优先级：请求体 deliverer_id → 单据已有出库人 → 确认操作人。
    """
    if confirmation_data is not None:
        did = getattr(confirmation_data, "deliverer_id", None)
        if did is not None and int(did) > 0:
            deliverer_id = int(did)
            deliverer_name = str(getattr(confirmation_data, "deliverer_name", None) or "").strip()
            if not deliverer_name:
                deliverer_name = await get_user_name(deliverer_id)
            return deliverer_id, deliverer_name
        name_only = str(getattr(confirmation_data, "deliverer_name", None) or "").strip()
        if name_only:
            if existing_deliverer_id is not None and int(existing_deliverer_id) > 0:
                return int(existing_deliverer_id), name_only
            return confirmed_by, name_only

    if existing_deliverer_id is not None and int(existing_deliverer_id) > 0:
        name = str(existing_deliverer_name or "").strip()
        if not name:
            name = await get_user_name(int(existing_deliverer_id))
        return int(existing_deliverer_id), name

    existing_name = str(existing_deliverer_name or "").strip()
    if existing_name:
        return confirmed_by, existing_name

    confirmer_name = await get_user_name(confirmed_by)
    return confirmed_by, confirmer_name


def resolve_inbound_confirm_business_time(
    confirmation_data: Optional[object],
    *,
    existing_time: Optional[Union[datetime, str]] = None,
) -> datetime:
    """
    确认入库业务时刻。

    优先级：请求体 receipt_time → 单据已有业务时刻 → 当前业务时刻。
    """
    request_time = None
    if confirmation_data is not None:
        request_time = getattr(confirmation_data, "receipt_time", None)
    return resolve_business_datetime(request_time or existing_time)
