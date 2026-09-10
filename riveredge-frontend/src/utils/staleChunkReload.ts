/**
 * 发版后旧 tab / 磁盘缓存仍引用已下线的 hashed chunk 时，
 * 动态 import 会报 Failed to fetch dynamically imported module。
 * 生产环境自动硬刷新一次；成功挂载后清标记，便于下次发版再恢复。
 */

const RELOAD_FLAG_KEY = 're:stale-chunk-reload';

export function isStaleChunkError(error: unknown): boolean {
  const name = error instanceof Error ? error.name : '';
  if (name === 'ChunkLoadError') return true;

  const msg = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase();

  return (
    msg.includes('failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('importing a module script failed') ||
    msg.includes('unable to preload css')
  );
}

/** @returns true 表示已发起刷新，调用方勿再抛给用户 */
export function reloadForStaleChunkOnce(): boolean {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return false;
  }
  if (sessionStorage.getItem(RELOAD_FLAG_KEY) === '1') {
    return false;
  }
  try {
    sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
  } catch {
    // sessionStorage 不可用时仍尝试刷新一次
  }
  window.location.reload();
  return true;
}

/** 应用成功挂载后调用，允许下一次发版再自动刷新 */
export function clearStaleChunkReloadFlag(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
  } catch {
    // ignore
  }
}

/** 在入口注册：Vite preload 失败 + 未捕获的动态 import 失败 */
export function installStaleChunkReloadHandlers(): void {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return;

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadForStaleChunkOnce();
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (!isStaleChunkError(event.reason)) return;
    if (reloadForStaleChunkOnce()) {
      event.preventDefault();
    }
  });
}
