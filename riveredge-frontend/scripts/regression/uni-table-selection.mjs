/**
 * Real-browser regression for UniTable's controlled-selection feedback loop.
 * Run from riveredge-frontend: node scripts/regression/uni-table-selection.mjs
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
import React, { Profiler, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { App, ConfigProvider } from 'antd';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import UniTable from '/src/components/uni-table';
import '/src/components/uni-table/uni-table.less';
import { useGlobalStore } from '/src/stores/globalStore';
await i18n.use(initReactI18next).init({lng:'en', resources:{en:{translation:{
  common:{confirm:'Confirm',cancel:'Cancel'},
  components:{uniTable:{clearSelectionFooter:'Clear selection'}}
}}}});
useGlobalStore.setState({currentUser:{id:1,username:'fixture',is_tenant_admin:true}});
window.selectionTest = {commits:0,changes:[],deleted:[]};
const params = new URLSearchParams(location.search);
const controlled = !params.has('uncontrolled');
const rows = Array.from({length:Number(params.get('rows') ?? 20)}, (_,i)=>({id:i+1,name:'Item '+(i+1)}));
const request = async ({current=1,pageSize=20})=>({data:rows.slice((current-1)*pageSize,current*pageSize),total:rows.length,success:true});
const columns = [{title:'Name',dataIndex:'name',key:'name',width:220}];
function Fixture() {
  const [keys,setKeys] = useState([]);
  const actionRef = useRef();
  return <>
    <button onClick={()=>setKeys([])}>Parent clear</button>
    <button onClick={()=>actionRef.current?.clearSelected()}>Action clear</button>
    <UniTable columns={columns} request={request} rowKey="id" actionRef={actionRef}
      enableRowSelection {...(controlled ? {selectedRowKeys:keys} : {})}
      onRowSelectionChange={next=>{window.selectionTest.changes.push([...next]);setKeys(next)}}
      showDeleteButton deleteButtonText="Delete rows" deleteConfirmTitle="Confirm deletion"
      onDelete={async next=>{window.selectionTest.deleted.push([...next])}}
      showImportButton={false} showExportButton={false}
      showFuzzySearch={false} showAdvancedSearch={false} viewTypes={['table']} />
  </>;
}
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:false}}})}>
    <MemoryRouter initialEntries={['/infra/table-test']}><ConfigProvider><App>
      <Profiler id="table" onRender={()=>window.selectionTest.commits++}><Fixture/></Profiler>
    </App></ConfigProvider></MemoryRouter>
  </QueryClientProvider>
);
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
  for (const query of ['?rows=0', '?rows=20', '?rows=20&uncontrolled']) {
    const page = await browser.newPage({viewport:{width:1440,height:900}})
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (/Maximum update depth|Too many re-renders/.test(message.text())) errors.push(message.text())
    })
    // The fixture is local only; never send application requests to a backend.
    await page.route('**/api/**', request => request.fulfill({json:{data:[],items:[],success:true}}))
    await page.goto('http://127.0.0.1:'+port+route+query)
    await page.waitForFunction(() => window.selectionTest?.commits > 0)
    await page.locator('.ant-table').waitFor()
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Performance.enable')
    async function assertIdle(label) {
      await page.waitForTimeout(1500)
      const before = await page.evaluate(() => ({commits:window.selectionTest.commits, changes:window.selectionTest.changes.length}))
      const m1 = await cdp.send('Performance.getMetrics')
      await page.waitForTimeout(1000)
      const after = await page.evaluate(() => ({commits:window.selectionTest.commits, changes:window.selectionTest.changes.length}))
      const m2 = await cdp.send('Performance.getMetrics')
      const metric = (m,name) => m.metrics.find(x=>x.name===name).value
      const taskMs = Math.round((metric(m2,'TaskDuration')-metric(m1,'TaskDuration'))*1000)
      console.log(JSON.stringify({query,label,idleCommits:after.commits-before.commits,idleCallbacks:after.changes-before.changes,taskMs}))
      assert.equal(after.commits-before.commits,0,label+': table must stop committing while idle')
      assert.equal(after.changes-before.changes,0,label+': selection callbacks must stop while idle')
      assert.deepEqual(errors,[],label+': browser errors')
    }
    await assertIdle('initial empty selection')
    if (query !== '?rows=0') {
      // Exclude rc-table's hidden measurement row, which also contains a checkbox.
      const checkboxes = page.locator('.ant-table-tbody .ant-table-row input[type=checkbox]')
      const first = checkboxes.first()
      for (const action of ['last checkbox', 'Clear selection', 'Parent clear', 'Action clear', 'Delete rows']) {
        if (action === 'Parent clear' && query.includes('uncontrolled')) continue
        await first.check()
        assert.equal(await first.isChecked(),true)
        const changesBeforeClear = await page.evaluate(() => window.selectionTest.changes.length)
        if (action === 'last checkbox') await first.uncheck()
        else if (action === 'Clear selection') await page.getByText(action,{exact:true}).click()
        else if (action === 'Delete rows') {
          await page.getByRole('button',{name:/Delete rows/}).click()
          await page.locator('.ant-popconfirm').getByRole('button',{name:'Confirm',exact:true}).click()
          await page.waitForFunction(() => window.selectionTest.deleted.length === 1)
          assert.deepEqual(await page.evaluate(() => window.selectionTest.deleted),[[1]])
        } else await page.getByRole('button',{name:action,exact:true}).click()
        await page.waitForFunction(() => document.querySelectorAll('.ant-table-tbody .ant-table-row input:checked').length === 0)
        assert.equal(await page.getByText('Clear selection',{exact:true}).count(),0)
        if (action === 'Parent clear') {
          assert.equal(await page.evaluate(() => window.selectionTest.changes.length),changesBeforeClear,
            'Syncing a controlled prop must not emit a selection callback')
        }
        await assertIdle(action)
      }
    }
    await page.close()
  }
  console.log('PASS: UniTable controlled/uncontrolled selection and clear/delete interactions')
} finally {
  await browser?.close()
  await server?.close()
  await rm(cacheDir,{recursive:true,force:true})
}
