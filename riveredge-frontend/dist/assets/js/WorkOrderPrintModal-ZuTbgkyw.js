import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BOyyiuK3.js";import{g as L,b as M}from"./printTemplateSchemas-Ba-rXozJ.js";import{b as W,aZ as w,D as O}from"./clientRelease-Dr-u9KJm.js";import{M as D}from"./main-CQJ1F-x9.js";import"./LinkedDocumentDetailContext-9z3i20ik.js";import"./detailDrawerTimeFields-BwtWGL_9.js";import"./index.es-BiJ2UQJs.js";import"./sessionCurrentUser-8hr45TcJ.js";import"./globalStore-DdNIeBTT.js";import"./restoredUser-BZQ1l-Pq.js";import"./tokenRefresh-BxADn0y0.js";import"./building-2-CXsh_SiJ.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-CI5nDLNC.js";import"./statusBadges-DVZbuENo.js";/* empty css                            */import"./UniLifecycleStepper-ztXLFZVm.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-DsNOv5_a.js";import"./documentStatusColors-ekx4QF42.js";import"./operationColumn-98d9Lert.js";import"./ActionConfirmPopconfirm-BgboNpRv.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-BXwd-uut.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-sKDGh8GS.js";import"./index-9S6mXnLI.js";import"./timer-haTt7V0m.js";import"./user-URfYoYRP.js";import"./userDisplay-Coog_5AU.js";import"./QuantityWithUnitDisplay-C3XcNMUg.js";import"./materialUnitDisplay-DHrQs1om.js";import"./material-unit-B6FISWrM.js";import"./formDate-_zA5l_Lr.js";import"./index-U3w4UXX_.js";import"./kuaireportSharedFilePreview-S5tmdUCo.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-C9CtHrz5.js";import"./index-V9QwmvuF.js";import"./index-C4GjHW91.js";import"./index-DrXLKP6s.js";import"./createForOfIteratorHelper-LG5cD1hu.js";import"./index-Cfi8vONz.js";import"./vendor-libredwg-X5N4-Ybg.js";import"./vendor-three-BPXNOO5B.js";import"./index-B8ti_4p2.js";import"./index--rqSH5FC.js";import"./index-QxNKnXmh.js";import"./isObject-BkYevyyA.js";import"./_baseIsEqual-BVoPldMj.js";import"./debounce-CiZkRc3K.js";import"./throttle-CkK6Vh-y.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-6Yt5XmRA.js";import"./useResourcePermissions-DAHeMAO4.js";import"./documentStatus-MmufW_7w.js";import"./purchase-BpavGAJ_.js";import"./fieldPermissionResources-C7LnZ6yz.js";import"./demandType-CqqBecIf.js";import"./quotation-BBwtrHJN.js";import"./warehouseMarkerTags-DqCkkGIz.js";import"./warehouse-execution-BkXXz3yt.js";import"./sales-order-CGrPGbsl.js";import"./dataDictionary-Ck-f6RDf.js";import"./material-v1TarGNV.js";import"./purchase-requisition-CYAbu9yB.js";import"./demand-computation-BwUtMNOF.js";import"./availableInventoryCell-CSNfqXjN.js";import"./MrpMaterialPlanPanel-CZe42DEV.js";import"./workOrderReporting-DhdlRPTS.js";import"./documentAttachments-cWbTp_Uc.js";import"./WorkOrderMaterialMovementsPanel-DEfU_Xoh.js";import"./work-order-B8rNkYAq.js";import"./logisticsListPresentation-CHI2PjU1.js";import"./reporting-8S2alH9n.js";import"./afterSalesListPresentation-CKQ5s84X.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-B8dS8Rgf.js";import"./index-CaG3DoAj.js";import"./index-BCvQ2xSk.js";import"./index-uPh0xARQ.js";import"./LineAttachmentsUpload-B4xXJcCG.js";import"./AuditPhaseBadge-Dbw0ycTh.js";import"./formListItems-DcSxpq1Y.js";const hr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
