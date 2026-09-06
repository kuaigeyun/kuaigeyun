/**
 * 列表分页拉取（对齐后端常见 le=1000 上限）。
 * 导出「全部」时禁止单次传超大 limit。
 */

export const LIST_API_MAX_LIMIT = 1000;
/** 报表类接口 current/page_size 上限（与后端 REPORT_LIST_MAX_LIMIT 一致） */
export const REPORT_API_MAX_PAGE_SIZE = 10_000;

export type ListPageParams = { skip: number; limit: number };

export type CurrentPageParams = { current: number; page_size: number };

export type ListPageResult<T> =
  | T[]
  | {
      items?: T[];
      data?: T[];
      total?: number;
    };

function extractItems<T>(res: ListPageResult<T>): T[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.data)) return res.data;
  return [];
}

function extractTotal<T>(res: ListPageResult<T>): number | undefined {
  if (Array.isArray(res)) return undefined;
  return typeof res.total === 'number' ? res.total : undefined;
}

/**
 * 按页拉取直至取完。pageSize 默认且上限为 LIST_API_MAX_LIMIT。
 */
export async function fetchAllListItems<T>(
  fetchPage: (params: ListPageParams) => Promise<ListPageResult<T>>,
  options?: { pageSize?: number; maxPages?: number },
): Promise<T[]> {
  const pageSize = Math.min(
    Math.max(1, options?.pageSize ?? LIST_API_MAX_LIMIT),
    LIST_API_MAX_LIMIT,
  );
  const maxPages = options?.maxPages ?? 200;
  if (!Number.isInteger(maxPages) || maxPages < 1) throw new Error('分页上限必须为正整数');
  let expectedTotal: number | undefined;
  const all: T[] = [];
  let skip = 0;

  for (let page = 0; page < maxPages; page += 1) {
    const res = await fetchPage({ skip, limit: pageSize });
    const items = extractItems(res);
    all.push(...items);
    const total = extractTotal(res);
    if (total !== undefined) expectedTotal = total;
    if (expectedTotal !== undefined) {
      if (all.length >= expectedTotal) return all;
      if (items.length === 0) throw new Error(`列表未取完：已读取 ${all.length} 条，总数为 ${expectedTotal} 条`);
    } else if (items.length < pageSize) {
      return all;
    }
    skip += items.length;
  }

  // 无总数且末页恰好填满时，额外探测一条以确认结束。
  if (expectedTotal === undefined && extractItems(await fetchPage({ skip, limit: 1 })).length === 0) return all;
  throw new Error(`列表未取完：已达到 ${maxPages} 页上限，请缩小范围或分批导出`);
}

/**
 * 按 current/page_size 分页拉取直至取完（报表 material-balances、batch-lines 等）。
 */
export async function fetchAllCurrentPageItems<T>(
  fetchPage: (params: CurrentPageParams) => Promise<ListPageResult<T>>,
  options?: { pageSize?: number; maxPages?: number },
): Promise<T[]> {
  const pageSize = Math.min(
    Math.max(1, options?.pageSize ?? REPORT_API_MAX_PAGE_SIZE),
    REPORT_API_MAX_PAGE_SIZE,
  );
  const maxPages = options?.maxPages ?? 200;
  if (!Number.isInteger(maxPages) || maxPages < 1) throw new Error('分页上限必须为正整数');
  let expectedTotal: number | undefined;
  const all: T[] = [];
  let current = 1;

  for (let page = 0; page < maxPages; page += 1) {
    const res = await fetchPage({ current, page_size: pageSize });
    const items = extractItems(res);
    all.push(...items);
    const total = extractTotal(res);
    if (total !== undefined) expectedTotal = total;
    if (expectedTotal !== undefined) {
      if (all.length >= expectedTotal) return all;
      if (items.length === 0) throw new Error(`列表未取完：已读取 ${all.length} 条，总数为 ${expectedTotal} 条`);
    } else if (items.length < pageSize) {
      return all;
    }
    current += 1;
  }

  // current/page_size 共同确定偏移，探测不能改变 page_size。
  if (expectedTotal === undefined && extractItems(await fetchPage({ current, page_size: pageSize })).length === 0) return all;
  throw new Error(`列表未取完：已达到 ${maxPages} 页上限，请缩小范围或分批导出`);
}
