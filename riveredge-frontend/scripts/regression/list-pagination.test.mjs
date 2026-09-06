// node --experimental-strip-types --test scripts/regression/list-pagination.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchAllListItems, fetchAllCurrentPageItems } from '../../src/utils/fetchAllListPages.ts';
import { countWithPagedRequests } from '../../src/utils/pagedCount.ts';

const rows = (total, skip, limit) => Array.from({length:Math.min(limit,Math.max(0,total-skip))},(_,i)=>skip+i);

test('超过全量导出上限必须报错，不能返回残缺结果', async () => {
  await assert.rejects(fetchAllListItems(async ({skip,limit}) => ({total:200001,items:rows(200001,skip,limit)})), /未.*完/);
});
test('超过计数上限必须报错，不能把 22000 当成 20000', async () => {
  await assert.rejects(countWithPagedRequests(async ({skip,limit})=>rows(22000,skip,limit),{}), /未.*完/);
});
test('恰好达到计数上限且无后续数据时返回准确总数', async () => {
  assert.equal(await countWithPagedRequests(async ({skip,limit})=>rows(20000,skip,limit),{}),20000);
});
test('已知总数且恰好达到导出上限时正常完成', async () => {
  assert.deepEqual(await fetchAllListItems(async ({skip,limit})=>({total:4,items:rows(4,skip,limit)}),{pageSize:2,maxPages:2}),[0,1,2,3]);
});
test('未知总数的完整末页在探测无后续数据后完成', async () => {
  assert.deepEqual(await fetchAllListItems(async ({skip,limit})=>rows(4,skip,limit),{pageSize:2,maxPages:2}),[0,1,2,3]);
});
test('未知总数达到上限但还有数据时失败', async () => {
  await assert.rejects(fetchAllListItems(async ({skip,limit})=>rows(5,skip,limit),{pageSize:2,maxPages:2}),/未.*完/);
});
test('已知总数时不能把后端较小的分页上限误判成末页', async () => {
  assert.deepEqual(await fetchAllListItems(async ({skip})=>({total:5,items:rows(5,skip,2)}),{pageSize:3,maxPages:3}),[0,1,2,3,4]);
});
test('报表分页达到上限仍有数据时失败', async () => {
  await assert.rejects(fetchAllCurrentPageItems(async ({current,page_size})=>({total:5,items:rows(5,(current-1)*page_size,page_size)}),{pageSize:2,maxPages:2}),/未.*完/);
});
test('报表未知总数完整边界的探测仍使用原分页大小', async () => {
  assert.deepEqual(await fetchAllCurrentPageItems(async ({current,page_size})=>rows(4,(current-1)*page_size,page_size),{pageSize:2,maxPages:2}),[0,1,2,3]);
});
test('空数据集可以正常完成', async () => {
  assert.deepEqual(await fetchAllListItems(async()=>[]),[]);
  assert.equal(await countWithPagedRequests(async()=>[],{}),0);
});
