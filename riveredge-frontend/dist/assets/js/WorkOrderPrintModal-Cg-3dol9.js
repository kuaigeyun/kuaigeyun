import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BPww9IVW.js";import{g as L,b as M}from"./printTemplateSchemas-DwkXc0sy.js";import{b as W,ba as w,F as O}from"./clientRelease-oFf-DLfD.js";import{M as H}from"./main-C_5RYLva.js";import"./LinkedDocumentDetailContext-CleQT6iO.js";import"./detailDrawerTimeFields-C0ilsVZJ.js";import"./index.es-r-6cmNqO.js";import"./sessionCurrentUser-Cm8LpDx4.js";import"./globalStore-DxlGIvZ4.js";import"./restoredUser-3Y_a7RD5.js";import"./tokenRefresh-wvHi5mnH.js";import"./building-2-CtO37XC5.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-C8BWLzWo.js";import"./statusBadges-0asCxdTM.js";/* empty css                            */import"./UniLifecycleStepper-DUwJcvMP.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-BXwyEFUG.js";import"./documentStatusColors-CaPlEx3V.js";import"./operationColumn-BZIJ8INy.js";import"./ActionConfirmPopconfirm-7UDNIcML.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-tFOhgIY3.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-BW5rjnBI.js";import"./index-DYruoh-D.js";import"./timer-haTt7V0m.js";import"./user-Dw7l966x.js";import"./displayContract-tzHR3wv1.js";import"./userDisplay-mC1wrrnI.js";import"./QuantityWithUnitDisplay-DpPMDzK4.js";import"./materialUnitDisplay-5Ek1sbfB.js";import"./material-unit-CoS7M2UF.js";import"./formDate-C7SdyspU.js";import"./index-CicbFKC8.js";import"./kuaireportSharedFilePreview-DDc_N0Cb.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-BkspzEfY.js";import"./index-DfNhYnYJ.js";import"./index-DDtPIRm2.js";import"./index-BTmavMLy.js";import"./createForOfIteratorHelper-75Wb2pQ3.js";import"./index-Bau_0xN9.js";import"./vendor-libredwg-BnvWj8Ow.js";import"./vendor-three-BPXNOO5B.js";import"./index-CsAaS8kw.js";import"./index-fqAlWkZf.js";import"./index-DIoWxeWT.js";import"./isObject-BNRemYuv.js";import"./_baseIsEqual-Duxv7QE7.js";import"./debounce-B86J2GO0.js";import"./throttle-DR0ZEz2i.js";import"./routes-DdvewRji.js";import"./workOrderLifecycle-BzTsURXa.js";import"./systemDictionaryI18n-CzXHyYH5.js";import"./orderPaymentMilestonesFields-BwhDEn2L.js";import"./index-DZdukL_W.js";import"./index-C1lL18b3.js";import"./index-BWhT4Uru.js";import"./useResourcePermissions-BwDSZ83u.js";import"./documentStatus-BA1GWcEB.js";import"./purchase-BauLuPU4.js";import"./fieldPermissionResources-Bit0wB6F.js";import"./demandType-Bhit75UH.js";import"./quotation-D9V01JJd.js";import"./warehouseMarkerTags-DXpK1yUw.js";import"./warehouse-execution-B_9rDLfH.js";import"./sales-order-Di81nzjU.js";import"./dataDictionary-JtPK47Ly.js";import"./material-Be8wemSz.js";import"./purchase-requisition-DKvdQIxC.js";import"./demand-computation-DvVW2_ge.js";import"./availableInventoryCell-DNN6797U.js";import"./MrpMaterialPlanPanel-Ck1q__m3.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-JkpIztwb.js";import"./WorkOrderMaterialMovementsPanel-RZlM8zlS.js";import"./work-order-CJFfCk7V.js";import"./logisticsListPresentation-CDREb5-I.js";import"./reporting-D09yt8tL.js";import"./afterSalesListPresentation-BR-6D9_B.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-C7d1q4sN.js";import"./index-FXY2UbdD.js";import"./LineAttachmentsUpload-D2o7-vtp.js";import"./AuditPhaseBadge-sWAjM_E-.js";import"./formListItems-DcSxpq1Y.js";const gr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[b,P]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});P(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:b.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:H.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
      `})]})};export{gr as default};
