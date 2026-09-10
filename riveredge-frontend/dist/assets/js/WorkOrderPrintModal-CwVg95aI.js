import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BgmQd21M.js";import{g as L,b as M}from"./printTemplateSchemas-DFbD5w9d.js";import{b as W,aZ as w,D as O}from"./clientRelease-Bm3rEe9Y.js";import{M as D}from"./main-23NkhUHR.js";import"./LinkedDocumentDetailContext-BE2gtJMM.js";import"./detailDrawerTimeFields-DAnX2QFV.js";import"./index.es-GYidTBvO.js";import"./sessionCurrentUser-lczUZ3bc.js";import"./globalStore-kuxPyIw9.js";import"./restoredUser-Ca0Qpr2S.js";import"./tokenRefresh-DUSNn2et.js";import"./building-2-X3B0jEki.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-PVpMAtib.js";import"./statusBadges-CyBM8k5d.js";/* empty css                            */import"./UniLifecycleStepper-CKra_B8A.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-X9eItHev.js";import"./documentStatusColors-csTcXhmH.js";import"./operationColumn-BuU17RpY.js";import"./ActionConfirmPopconfirm-DI29l689.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-DHQpdNEK.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-aEbctbe4.js";import"./index-CUVb1AoZ.js";import"./timer-haTt7V0m.js";import"./user-tnHCr8Cq.js";import"./userDisplay-DcZx0Ko-.js";import"./QuantityWithUnitDisplay-CprmNm24.js";import"./materialUnitDisplay-DdU1a4OQ.js";import"./material-unit-B3l8xWXQ.js";import"./formDate-CFR4C0aW.js";import"./index-rfqpUjeS.js";import"./kuaireportSharedFilePreview-D4wNk-Wm.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-CZmu_hsM.js";import"./index-D-ly8pnl.js";import"./index-BiJboJgy.js";import"./index-zNWaKDAX.js";import"./createForOfIteratorHelper-C-Id44jC.js";import"./index-DcHGvfYW.js";import"./vendor-libredwg-VTSW1NtS.js";import"./vendor-three-BPXNOO5B.js";import"./index-N0OWTNCH.js";import"./index-By7_iEpO.js";import"./index-CfjQThiY.js";import"./isObject-qu80Zj8d.js";import"./_baseIsEqual-HmFT_Mjm.js";import"./debounce-DIociwGl.js";import"./throttle-BtxV9QxR.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-hwxpyRuT.js";import"./useResourcePermissions-E1WKkeWZ.js";import"./documentStatus-CqoUm3BH.js";import"./purchase-Bh-adCN3.js";import"./fieldPermissionResources-e8jB0C2s.js";import"./demandType-C7SCdRYC.js";import"./quotation-WbBuBcbg.js";import"./warehouseMarkerTags-BRq2R5Y3.js";import"./warehouse-execution-Y14q2jSQ.js";import"./sales-order-39CTx-Du.js";import"./dataDictionary-BspwNEsE.js";import"./material-5LT6dLy4.js";import"./purchase-requisition-CFEYy3AI.js";import"./demand-computation-BSaIE5xx.js";import"./availableInventoryCell-C4abSJYX.js";import"./MrpMaterialPlanPanel-6b654KGY.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-2kvu-Hyq.js";import"./WorkOrderMaterialMovementsPanel-DP48V52p.js";import"./work-order-Diy1XnDV.js";import"./logisticsListPresentation-Bk-JQ9f6.js";import"./reporting-DM6eLnuV.js";import"./afterSalesListPresentation-FqfgSECd.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-hKFYgiv-.js";import"./index-SggjUCLk.js";import"./index-BVThzDod.js";import"./index-q1P6yqnL.js";import"./LineAttachmentsUpload-BeRe4zck.js";import"./AuditPhaseBadge-Dnqf7feq.js";import"./formListItems-DcSxpq1Y.js";const hr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
