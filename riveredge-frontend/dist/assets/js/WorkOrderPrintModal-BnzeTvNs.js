import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BXoj0HS6.js";import{g as L,b as M}from"./printTemplateSchemas-DeS537li.js";import{b as W,aZ as w,D as O}from"./clientRelease-B_GZvAgh.js";import{M as D}from"./main-DbGCCMcv.js";import"./LinkedDocumentDetailContext-bUXtQK_g.js";import"./detailDrawerTimeFields-BtsO1mSE.js";import"./index.es-BuhyOxvg.js";import"./sessionCurrentUser-Bg0qLilW.js";import"./globalStore-B4H4f21p.js";import"./restoredUser-zqaRNcbu.js";import"./tokenRefresh-8_D3ndTZ.js";import"./building-2-VR6WDz95.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-I6y1s3eh.js";import"./statusBadges-Brgk67nE.js";/* empty css                            */import"./UniLifecycleStepper-Cd5k1LbG.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-C4HtZTSk.js";import"./documentStatusColors-DTQchMuh.js";import"./operationColumn-BglgkavV.js";import"./ActionConfirmPopconfirm-C3qRfAJA.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract--OibVXtw.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-BnelfMiy.js";import"./index-DzLHzEPO.js";import"./timer-haTt7V0m.js";import"./user-DkaLZj9z.js";import"./userDisplay-yA9bOP-M.js";import"./QuantityWithUnitDisplay-n3EyXz0q.js";import"./materialUnitDisplay-C0_WZ3Cu.js";import"./material-unit-BwY0m2Sm.js";import"./formDate-Baa22N-x.js";import"./index-Cs_Q3o1w.js";import"./kuaireportSharedFilePreview-tl6CJuNC.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-C2p6bbp8.js";import"./index-CCffkZFd.js";import"./index-BGau8AJz.js";import"./index-C1GnmFm-.js";import"./createForOfIteratorHelper-BjgfPXKr.js";import"./index-BAkP3XNH.js";import"./vendor-libredwg-cAhUaR8i.js";import"./vendor-three-BPXNOO5B.js";import"./index-CcD3GnDs.js";import"./index-Bwf6gBxO.js";import"./index-Bhrw_bQ1.js";import"./isObject-CjxmFLU8.js";import"./_baseIsEqual-CYd0xhfb.js";import"./debounce-CGiwlvCa.js";import"./throttle-CFTd8z0o.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-CDLnQvEs.js";import"./useResourcePermissions-DxDITusM.js";import"./documentStatus-D5U-Qx61.js";import"./purchase-DIuWaSpg.js";import"./fieldPermissionResources-BNYrNanR.js";import"./demandType-Di6epbEt.js";import"./quotation-BUlbch5p.js";import"./warehouseMarkerTags-_h0THd_0.js";import"./warehouse-execution-CeGYeacc.js";import"./sales-order-C8UqWJpc.js";import"./dataDictionary-DnlmihdJ.js";import"./material-BTsKJnAQ.js";import"./purchase-requisition-BGTl_rz8.js";import"./demand-computation-2UeJSPg_.js";import"./availableInventoryCell-CQY1XA_k.js";import"./MrpMaterialPlanPanel-BbyMLNlY.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-B6WdEa6q.js";import"./WorkOrderMaterialMovementsPanel-BKr8VFF0.js";import"./work-order-C07Q1YBx.js";import"./logisticsListPresentation-bTyc2nwC.js";import"./reporting-Dqaerfl-.js";import"./afterSalesListPresentation-D4i9KANE.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-pHb_QW38.js";import"./index-C1KL3chk.js";import"./index-C0w3Oi9k.js";import"./index-gE9ZKyu9.js";import"./LineAttachmentsUpload-iM9dvnHx.js";import"./AuditPhaseBadge-BEUnFKIv.js";import"./formListItems-DcSxpq1Y.js";const hr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
        .work-order-print-modal-wrap .ant-modal {
          max-width: calc(100vw - 32px) !important;
        }
        .work-order-print-modal-wrap .ant-modal-body .ant-spin-nested-loading,
        .work-order-print-modal-wrap .ant-modal-body .ant-spin-container,
        .work-order-print-modal-wrap .work-order-print-preview {
          height: 100% !important;
        }
        .work-order-print-modal-wrap .work-order-print-iframe {
          width: 100% !important;
          height: 100% !important;
          min-height: 500px !important;
          border: none !important;
          display: block !important;
          background: #fff !important;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .ant-modal-wrap,
          .ant-modal-wrap *,
          .ant-modal-content,
          .ant-modal-content *,
          .work-order-print-preview,
          .work-order-print-preview * {
            visibility: visible !important;
          }
          .ant-modal-wrap {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .ant-modal-content {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            background: white;
          }
          .work-order-print-preview {
            width: 100% !important;
            min-height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print, .ant-modal-footer, .ant-modal-header, .ant-modal-close {
            display: none !important;
          }
        }
      `})]})};export{hr as default};
