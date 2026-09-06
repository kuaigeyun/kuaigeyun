// 检查真实页面导出初始化表达式，避免当前页导出触发全量请求。
// node --test scripts/regression/current-page-export.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const files = [
  'pages/system/equipment/list/index.tsx',
  'apps/kuaizhizao/pages/plan-management/demand-management/index.tsx',
  'pages/system/approval-processes/instances/index.tsx',
  'pages/system/maintenance-plans/list/index.tsx',
  'pages/system/molds/list/index.tsx',
  'pages/system/applications/list/index.tsx',
  'pages/infra/scripts/list/index.tsx',
  'pages/infra/scheduled-tasks/list/index.tsx',
  'pages/system/messages/template/index.tsx',
  'pages/system/messages/config/index.tsx',
  'pages/system/equipment-faults/list/index.tsx',
  'apps/kuaizhizao/pages/purchase-management/purchase-requisitions/index.tsx',
  'apps/kuaizhizao/pages/sales-management/sales-orders/index.tsx',
  'apps/kuaizhizao/pages/sales-management/sales-contracts/index.tsx',
  'apps/kuaizhizao/pages/purchase-management/purchase-orders/index.tsx',
  'apps/kuaizhizao/pages/warehouse-management/material-borrows/index.tsx',
];

function sourceExpressions(file) {
  const source = fs.readFileSync(path.join(root, 'src', file), 'utf8');
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let initializer, callback;
  function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.getText(tree) === 'onExport' && node.initializer && ts.isJsxExpression(node.initializer)) {
      const fn = node.initializer.expression;
      if (fn && ts.isArrowFunction(fn) && fn.getText(tree).includes('await fetchAllListItems')) {
        callback = fn.getText(tree);
        function find(n) {
          if (!initializer && ts.isVariableDeclaration(n) && n.initializer?.getText(tree).includes('await fetchAllListItems')) initializer = n.initializer.getText(tree);
          ts.forEachChild(n, find);
        }
        find(fn.body);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.ok(initializer, file);
  return { initializer, callback };
}

function compile(expression, context = {}) {
  const module = { exports: undefined };
  const code = ts.transpileModule('module.exports = ' + expression, {compilerOptions:{target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS}}).outputText;
  new Function('module', ...Object.keys(context), code)(module, ...Object.values(context));
  return module.exports;
}

for (const file of files) {
  const {initializer} = sourceExpressions(file);
  const initialize = compile(`async (type, pageData, fetchAllListItems) => (${initializer})`);
  for (const mode of ['currentPage', 'emptyPage', 'all', 'selected']) {
    test(`${file}：${mode}`, async () => {
      const pageData = mode === 'emptyPage' ? undefined : [{id:1}];
      const remote = [{id:2}];
      let calls = 0;
      const result = await initialize(mode === 'emptyPage' ? 'currentPage' : mode, pageData, async () => {
        calls++;
        if (mode === 'currentPage' || mode === 'emptyPage') throw Error('不应请求全部数据');
        return remote;
      });
      assert.deepEqual(result, mode === 'currentPage' ? pageData : mode === 'emptyPage' ? [] : remote);
      assert.equal(calls, mode === 'currentPage' || mode === 'emptyPage' ? 0 : 1);
    });
  }
}

for (const file of files.filter(p => p.includes('purchase-requisitions') || p.includes('demand-management'))) {
  test(`${file}：完整当前页导出回调`, async () => {
    const {callback} = sourceExpressions(file);
    const page = [{id:1},{id:2}];
    let requests = 0, exported;
    const handler = compile(callback, {
      fetchAllListItems: async () => { requests++; throw Error('全量请求失败'); },
      downloadRecordsAsXlsx: async rows => { exported = rows; },
      todaySiteDateString: () => '2026-09-06', t: key => key,
      messageApi: {success() {}, warning() {}, error(error) { throw Error(error); }},
    });
    await handler('currentPage', [], page);
    assert.equal(requests, 0);
    assert.deepEqual(exported, page);
  });
}
