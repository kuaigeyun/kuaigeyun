export async function countWithPagedRequests<T, P extends { skip?: number; limit?: number }>(
  fetchPage: (params: P) => Promise<T[]>,
  baseParams: Omit<P, 'skip' | 'limit'>,
  options?: {
    chunkSize?: number;
    maxRounds?: number;
  },
): Promise<number> {
  const chunkSize = options?.chunkSize ?? 100;
  const maxRounds = options?.maxRounds ?? 200;
  if (!Number.isInteger(chunkSize) || chunkSize < 1 || !Number.isInteger(maxRounds) || maxRounds < 1) {
    throw new Error('分页大小与计数上限必须为正整数');
  }

  let total = 0;
  let skip = 0;

  for (let i = 0; i < maxRounds; i += 1) {
    const page = await fetchPage({
      ...(baseParams as P),
      skip,
      limit: chunkSize,
    });
    const size = Array.isArray(page) ? page.length : 0;
    total += size;
    if (size < chunkSize) return total;
    skip += chunkSize;
  }

  const next = await fetchPage({ ...(baseParams as P), skip, limit: 1 });
  if (next.length === 0) return total;
  throw new Error(`计数未完成：已达到 ${maxRounds} 页上限，请缩小查询范围`);
}
