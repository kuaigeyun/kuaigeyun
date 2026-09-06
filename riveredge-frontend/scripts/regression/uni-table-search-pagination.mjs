/**
 * 通用表格服务端搜索分页回归：总数、翻页和隐藏字段匹配结果。
 * Run from riveredge-frontend: node scripts/regression/uni-table-search-pagination.mjs
 * No backend or login needed. Optional PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
 */
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const entry = '/__unitable_selection_test__.tsx'
const route = '/__unitable_selection_test__'
const fixture = `
import React, {useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router-dom';
import {ConfigProvider,App} from 'antd';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import UniTable from '/src/components/uni-table';
import '/src/components/uni-table/uni-table.less';
await i18n.use(initReactI18next).init({lng:'en',resources:{en:{translation:{components:{uniTable:{paginationTotal:'Total {{total}}'}}}}}});
const params=new URLSearchParams(location.search);
window.audit={rows:[],calls:0};
const columns=[{title:'Name',dataIndex:'name',key:'name',width:220}];
const allRows=Array.from({length:120},(_,i)=>({id:i+1,name:(params.has('hidden')?'result ':'part ')+(i+1)}));
const request=async ({current=1,pageSize=20})=>{window.audit.calls++;return {data:allRows.slice((current-1)*pageSize,current*pageSize),success:true,total:120}};
function Fixture(){
 const actionRef=useRef();
 const searchParamsRef=useRef({keyword:'part'});
 window.auditRead=()=>({rows:window.audit.rows.length,calls:window.audit.calls});
 return <UniTable actionRef={actionRef} searchParamsRef={searchParamsRef} columns={columns} request={request}
 skipFuzzyPinyinClientFilter={params.has('skip')} onTableDataChange={rows=>{window.audit.rows=rows}}
 showImportButton={false} showExportButton={false} showFuzzySearch={false} showAdvancedSearch={false} viewTypes={['table']}/>;
}
createRoot(document.getElementById('root')).render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/infra/test']}><ConfigProvider><App><Fixture/></App></ConfigProvider></MemoryRouter></QueryClientProvider>);
`
const cacheDir = await mkdtemp(resolve(tmpdir(), 'unitable-selection-vite-'))
let server
let browser
try {
  server = await createServer({
    configFile: false, root, cacheDir,
    plugins: [{
      name: 'unitable-selection-fixture',
      resolveId(id) { if (id === entry) return entry },
      load(id) { if (id === entry) return fixture },
      configureServer(vite) {
        vite.middlewares.use(async (req, res, next) => {
          if (req.url?.split('?')[0] !== route) return next()
          try {
            const html = await vite.transformIndexHtml(route,
              '<html><body><div id="root"></div><script type="module" src="'+entry+'"></script></body></html>')
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          } catch (error) { next(error) }
        })
      },
    }, react()],
    resolve: {alias: {'@': resolve(root, 'src')}},
    optimizeDeps: {entries: []},
    server: {host:'127.0.0.1',port:0},
  })
  await server.listen()
  const {port} = server.httpServer.address()
  browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}),
  })
  for (const query of ['?keyword=part','?keyword=part&skip','?keyword=part&hidden']) {
    const page=await browser.newPage({viewport:{width:1440,height:900}})
    page.on('pageerror', e=>console.log('browser error:',e.message))
    await page.route('**/api/**',r=>r.fulfill({json:{data:[],success:true}}))
    await page.goto('http://127.0.0.1:'+port+route+query)
    await page.waitForFunction(()=>window.auditRead?.()?.rows===20)
    await page.waitForTimeout(1000)
    const result=await page.evaluate(()=>({...window.auditRead(),visibleTotal:document.querySelector('.ant-pagination-total-text')?.textContent}))
    console.log(JSON.stringify({query,serverTotal:120,...result}))
    assert.equal(result.visibleTotal,'Total 120')
    await page.locator('.ant-pagination-item-2').click()
    await page.waitForFunction(()=>window.audit.rows[0]?.id===21)
    assert.equal(await page.locator('.ant-pagination-total-text').textContent(),'Total 120')
    await page.close()
  }
  console.log('通过：服务端搜索总数、第二页及隐藏字段匹配行均保留。')

} finally {
  await browser?.close()
  await server?.close()
  await rm(cacheDir,{recursive:true,force:true})
}
