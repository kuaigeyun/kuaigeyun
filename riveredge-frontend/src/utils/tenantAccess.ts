import dayjs from '../config/dayjs';
import { getTimezoneFromSiteSetting } from './format';

/** 组织订阅/到期时刻是否已过（按站点墙钟比较，与后端 expires_at 展示一致） */
export function isTenantSubscriptionExpired(
  expiresAt: string | null | undefined,
): boolean {
  if (expiresAt == null || String(expiresAt).trim() === '') {
    return false;
  }
  const tz = getTimezoneFromSiteSetting();
  const text = String(expiresAt).trim();
  let deadline = dayjs.tz(text.replace('T', ' '), tz);
  if (!deadline.isValid() && /^\d{4}-\d{2}-\d{2}$/.test(text)) {
    deadline = dayjs.tz(`${text} 23:59:59`, tz);
  }
  if (!deadline.isValid()) {
    return false;
  }
  return dayjs().tz(tz).isAfter(deadline);
}

export const TENANT_EXPIRED_MESSAGE = '组织已过期，请联系管理员续期';

export function isTenantExpiredApiDetail(detail: unknown): boolean {
  const text = typeof detail === 'string' ? detail : '';
  return text.includes('组织已过期') || text.includes('已过期，请联系管理员');
}
