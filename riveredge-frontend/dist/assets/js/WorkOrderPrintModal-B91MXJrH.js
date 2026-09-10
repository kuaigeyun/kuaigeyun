import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BgmQd21M.js";import{g as L,b as M}from"./printTemplateSchemas-Cnwmaj6h.js";import{b as W,aZ as w,D as O}from"./clientRelease-CTrXbop8.js";import{M as D}from"./main-CpDCnUQJ.js";import"./LinkedDocumentDetailContext-B5Wc4Co1.js";import"./detailDrawerTimeFields-sb_AErKy.js";import"./index.es-GYidTBvO.js";import"./sessionCurrentUser-BV6HVLWU.js";import"./globalStore-BqnLjJGz.js";import"./restoredUser-CmLa2osA.js";import"./tokenRefresh-C7hamr9p.js";import"./building-2-X3B0jEki.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-PVpMAtib.js";import"./statusBadges-CyBM8k5d.js";/* empty css                            */import"./UniLifecycleStepper-e0OO5Bba.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-X9eItHev.js";import"./documentStatusColors-csTcXhmH.js";import"./operationColumn-BR5VKPzp.js";import"./ActionConfirmPopconfirm-DI29l689.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-BFyF4yeE.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-DKamRfRi.js";import"./index-C3EnTlOE.js";import"./timer-haTt7V0m.js";import"./user-BetZy6bv.js";import"./userDisplay-fYKGFdCd.js";import"./QuantityWithUnitDisplay-CKeB4IYQ.js";import"./materialUnitDisplay-BbDUUJ7c.js";import"./material-unit-DprS2aRL.js";import"./formDate-DwspON15.js";import"./index-DzvUGYKm.js";import"./kuaireportSharedFilePreview-BEgYfadi.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-DkIGQtJO.js";import"./index-D-ly8pnl.js";import"./index-BiJboJgy.js";import"./index-zNWaKDAX.js";import"./createForOfIteratorHelper-C-Id44jC.js";import"./index-DcHGvfYW.js";import"./vendor-libredwg-VTSW1NtS.js";import"./vendor-three-BPXNOO5B.js";import"./index-N0OWTNCH.js";import"./index-By7_iEpO.js";import"./index-CfjQThiY.js";import"./isObject-qu80Zj8d.js";import"./_baseIsEqual-HmFT_Mjm.js";import"./debounce-DIociwGl.js";import"./throttle-BtxV9QxR.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-hwxpyRuT.js";import"./useResourcePermissions-ZhM_FsaO.js";import"./documentStatus-BTtqhtlu.js";import"./purchase-kgIh9JiG.js";import"./fieldPermissionResources-p_57ICsd.js";import"./demandType-D8uatmga.js";import"./quotation-sORPraum.js";import"./warehouseMarkerTags-BRq2R5Y3.js";import"./warehouse-execution-CY0HKAbV.js";import"./sales-order-CoU-3jyk.js";import"./dataDictionary-B6cfdSV-.js";import"./material-CzHSKCgW.js";import"./purchase-requisition-5QNyNjG9.js";import"./demand-computation-0egIg22V.js";import"./availableInventoryCell-DvDpvWMH.js";import"./MrpMaterialPlanPanel-ChTuPSyu.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-BePt6ERx.js";import"./WorkOrderMaterialMovementsPanel-Zv0ngfU8.js";import"./work-order-DAZ_lLdw.js";import"./logisticsListPresentation-Bk-JQ9f6.js";import"./reporting-BpMvnroY.js";import"./afterSalesListPresentation-FqfgSECd.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-D08FW6Ir.js";import"./index-SggjUCLk.js";import"./index-BVThzDod.js";import"./index-q1P6yqnL.js";import"./LineAttachmentsUpload-DbA11NMZ.js";import"./AuditPhaseBadge-BS4L_QWf.js";import"./formListItems-DcSxpq1Y.js";const hr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
