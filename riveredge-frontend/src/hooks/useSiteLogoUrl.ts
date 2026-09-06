import { useEffect, useState } from 'react';
import { useConfigStore, getPersistedConfigs } from '../stores/configStore';
import {
  FILE_IMAGE_SIZE_LOGO,
  getSiteLogoPreview,
  normalizeFilePreviewUrl,
} from '../services/file';
import { toRelativeIfLocalhost } from '../utils/avatar';
import { DEFAULT_SITE_LOGO_URL } from '../constants/siteAssets';

const SITE_LOGO_CACHE_TTL_MS = 25 * 60 * 1000;
/** v3：顶栏改用 512 Logo 档，废弃旧 128 头像档缓存 */
const SITE_LOGO_CACHE_KEY_PREFIX = 'siteLogoUrlCache_v3_';

export type SiteLogoConfigKey = 'site_logo' | 'site_logo_dark';

export type UseSiteLogoUrlOptions = {
  /** 配置键；深色背景 Logo 用 site_logo_dark */
  configKey?: SiteLogoConfigKey;
  /**
   * 未配置时是否回退框架默认 Logo。
   * site_logo_dark 须为 false：空则由调用方回退到浅色 Logo。
   */
  fallbackToDefault?: boolean;
};

function getCachedSiteLogoUrl(logoUuid: string): string | undefined {
  try {
    const raw = localStorage.getItem(`${SITE_LOGO_CACHE_KEY_PREFIX}${logoUuid}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const { url, ts } = typeof parsed === 'object' ? parsed : { url: raw, ts: 0 };
    if (!url || typeof url !== 'string') return undefined;
    if (typeof ts === 'number' && Date.now() - ts > SITE_LOGO_CACHE_TTL_MS) return undefined;
    return normalizeFilePreviewUrl(toRelativeIfLocalhost(url));
  } catch {
    return undefined;
  }
}

function setCachedSiteLogoUrl(logoUuid: string, url: string): void {
  try {
    localStorage.setItem(
      `${SITE_LOGO_CACHE_KEY_PREFIX}${logoUuid}`,
      JSON.stringify({ url, ts: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

function clearCachedSiteLogoUrl(logoUuid: string): void {
  try {
    localStorage.removeItem(`${SITE_LOGO_CACHE_KEY_PREFIX}${logoUuid}`);
    localStorage.removeItem(`siteLogoUrlCache_${logoUuid}`);
  } catch {
    /* ignore */
  }
}

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function readSiteLogoConfigValue(configKey: SiteLogoConfigKey): string {
  const fromStore = String(useConfigStore.getState().getConfig(configKey, '') ?? '').trim();
  if (fromStore) return fromStore;
  const persisted = getPersistedConfigs()?.[configKey];
  return typeof persisted === 'string' ? persisted.trim() : '';
}

function resolveInitialDisplayUrl(configKey: SiteLogoConfigKey): string {
  const logoValue = readSiteLogoConfigValue(configKey);
  if (!logoValue) return '';
  if (isUUID(logoValue)) return getCachedSiteLogoUrl(logoValue) ?? '';
  return logoValue;
}

/**
 * 与顶栏一致的站点 Logo 解析。
 * 已配置自定义 Logo 时：首帧用缓存预览 URL，没有缓存则留空，绝不先画框架 PNG。
 * 仅在站点配置已加载且未设置 site_logo、且 fallbackToDefault 时，才使用框架默认 Logo。
 */
export function useSiteLogoUrl(options?: UseSiteLogoUrlOptions): string {
  const configKey: SiteLogoConfigKey = options?.configKey ?? 'site_logo';
  const fallbackToDefault = options?.fallbackToDefault ?? configKey === 'site_logo';
  const siteLogoValue =
    (useConfigStore((s) => (s.getConfig(configKey, '') as string)?.trim()) || '') || '';
  const initialized = useConfigStore((s) => s.initialized);

  const [siteLogoUrl, setSiteLogoUrl] = useState<string>(() => resolveInitialDisplayUrl(configKey));

  useEffect(() => {
    const logoValue = siteLogoValue || readSiteLogoConfigValue(configKey);
    let cancelled = false;

    const loadSiteLogo = async () => {
      if (!logoValue) {
        if (initialized) {
          setSiteLogoUrl(fallbackToDefault ? DEFAULT_SITE_LOGO_URL : '');
        } else {
          setSiteLogoUrl('');
        }
        return;
      }
      if (isUUID(logoValue)) {
        const cached = getCachedSiteLogoUrl(logoValue);
        if (cached) {
          setSiteLogoUrl(cached);
        }
        const previewInfo = await getSiteLogoPreview(logoValue, {
          size: FILE_IMAGE_SIZE_LOGO,
          brandingCategory: 'site-logo',
        });
        if (cancelled) return;
        if (!previewInfo?.preview_url) {
          clearCachedSiteLogoUrl(logoValue);
          setSiteLogoUrl(fallbackToDefault ? DEFAULT_SITE_LOGO_URL : '');
          return;
        }
        const newUrl = normalizeFilePreviewUrl(toRelativeIfLocalhost(previewInfo.preview_url));
        setSiteLogoUrl(newUrl);
        setCachedSiteLogoUrl(logoValue, newUrl);
        return;
      }
      setSiteLogoUrl(logoValue);
    };

    void loadSiteLogo().catch(() => {
      if (cancelled) return;
      setSiteLogoUrl((prev) => {
        if (prev) return prev;
        return fallbackToDefault ? DEFAULT_SITE_LOGO_URL : '';
      });
    });

    return () => {
      cancelled = true;
    };
  }, [siteLogoValue, initialized, configKey, fallbackToDefault]);

  return siteLogoUrl;
}
