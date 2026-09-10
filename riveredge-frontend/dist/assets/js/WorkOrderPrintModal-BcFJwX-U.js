import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BXoj0HS6.js";import{g as L,b as M}from"./printTemplateSchemas-DwKy8ND5.js";import{b as W,aZ as w,D as O}from"./clientRelease-BGFqrjmA.js";import{M as D}from"./main-B2AJkVXE.js";import"./LinkedDocumentDetailContext-DlbTW3tJ.js";import"./detailDrawerTimeFields-Bo4gMQ0a.js";import"./index.es-BuhyOxvg.js";import"./sessionCurrentUser-Ns_Grbyo.js";import"./globalStore-BaQsNFMb.js";import"./restoredUser-B3Li0gXD.js";import"./tokenRefresh-DN7lemcq.js";import"./building-2-VR6WDz95.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-I6y1s3eh.js";import"./statusBadges-Brgk67nE.js";/* empty css                            */import"./UniLifecycleStepper-Dy70AI9h.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-C4HtZTSk.js";import"./documentStatusColors-DTQchMuh.js";import"./operationColumn-DjhZQ34u.js";import"./ActionConfirmPopconfirm-C3qRfAJA.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-8uBIRGOJ.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-C3YHb1eE.js";import"./index-BCDuO1h_.js";import"./timer-haTt7V0m.js";import"./user-CpvsyYFQ.js";import"./userDisplay-CATriOIy.js";import"./QuantityWithUnitDisplay-D8gBolUr.js";import"./materialUnitDisplay-ByRdKNDv.js";import"./material-unit-DjEwWLMs.js";import"./formDate-DFgHnRbC.js";import"./index-3ICnaJpz.js";import"./kuaireportSharedFilePreview-ji6E04z0.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-BPHu4vEy.js";import"./index-CCffkZFd.js";import"./index-BGau8AJz.js";import"./index-C1GnmFm-.js";import"./createForOfIteratorHelper-BjgfPXKr.js";import"./index-BAkP3XNH.js";import"./vendor-libredwg-cAhUaR8i.js";import"./vendor-three-BPXNOO5B.js";import"./index-CcD3GnDs.js";import"./index-Bwf6gBxO.js";import"./index-Bhrw_bQ1.js";import"./isObject-CjxmFLU8.js";import"./_baseIsEqual-CYd0xhfb.js";import"./debounce-CGiwlvCa.js";import"./throttle-CFTd8z0o.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-CDLnQvEs.js";import"./useResourcePermissions-ByF0_srv.js";import"./documentStatus-BjBHpNhg.js";import"./purchase-DTBGeeb0.js";import"./fieldPermissionResources-DYtwVHfx.js";import"./demandType-LGN5Ua7c.js";import"./quotation-DOFsZFiI.js";import"./warehouseMarkerTags-_h0THd_0.js";import"./warehouse-execution-BhS_akXl.js";import"./sales-order-coztmZs-.js";import"./dataDictionary-DXQBHeH5.js";import"./material-hXwsro54.js";import"./purchase-requisition-bI768zog.js";import"./demand-computation-CdNRlsgk.js";import"./availableInventoryCell-DKM9U_SK.js";import"./MrpMaterialPlanPanel-3SHgW0nB.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-DIcXh7wu.js";import"./WorkOrderMaterialMovementsPanel-Cs5VlVu4.js";import"./work-order-BkisonZa.js";import"./logisticsListPresentation-bTyc2nwC.js";import"./reporting-D7qJFG2e.js";import"./afterSalesListPresentation-D4i9KANE.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-DBBmvsUA.js";import"./index-C1KL3chk.js";import"./index-C0w3Oi9k.js";import"./index-gE9ZKyu9.js";import"./LineAttachmentsUpload-DwBTgf2Q.js";import"./AuditPhaseBadge-CZNd9ooG.js";import"./formListItems-DcSxpq1Y.js";const hr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
