import{r as n,j as e,M as E,D as v,a8 as z,V as x,b3 as $,a2 as C,ag as s}from"./vendor-CcdesEVG.js";import{g as L,b as W}from"./printTemplateSchemas-DgnvH_Rx.js";import{b as M,aX as w,D as O}from"./clientRelease-CtJNrLVJ.js";import{_ as D}from"./main-78GuBDiM.js";import"./LinkedDocumentDetailContext-B6ZUauuE.js";import"./detailDrawerTimeFields-D-x7iQRM.js";import"./index.es-BdcupwLt.js";import"./sessionCurrentUser-_EM-Z6JG.js";import"./globalStore-SnCko561.js";import"./restoredUser-2BZ5rTNX.js";import"./tokenRefresh-A_HaYpRa.js";import"./building-2-CDdMm-h3.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-Dg74TbyF.js";import"./statusBadges-CoaLHFHo.js";/* empty css                            */import"./UniLifecycleStepper-BJ8f1XG-.js";import"./globalLifecycleI18n-DwIKnxFP.js";import"./send-DUwjNG4M.js";import"./package-check-D7yb0Sf0.js";import"./japanese-yen-DsXoE2eV.js";import"./file-DbCT8_nf.js";import"./documentLifecycleStatusTag-BAnbZtj8.js";import"./documentStatusColors-DJknZOGv.js";import"./operationColumn-DfXuwg_I.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-CoyLM9Ux.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-CCxmbGGB.js";import"./index-DmYbaWlQ.js";import"./timer-haTt7V0m.js";import"./user-BpCAQzHe.js";import"./userDisplay-Dgzi7KM0.js";import"./QuantityWithUnitDisplay-BfzovFtL.js";import"./materialUnitDisplay-D5BJhPrC.js";import"./material-unit-f-CM-vBW.js";import"./formDate-D-hNwXpm.js";import"./index-CxW7TZ85.js";import"./kuaireportSharedFilePreview-RR_b6A6U.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-DXN52XMX.js";import"./index-DgqZOyhs.js";import"./index--Z2-DmRH.js";import"./index-BX_M1GWk.js";import"./createForOfIteratorHelper-B1C7pzVE.js";import"./index-CAocZU88.js";import"./vendor-libredwg-M0t8kVuM.js";import"./vendor-three-BPXNOO5B.js";import"./index-BF2LDzU6.js";import"./index-easXPupJ.js";import"./index-BcNkjLDC.js";import"./isObject-kSsxi8J4.js";import"./_baseIsEqual-CVp41FqN.js";import"./debounce-DVZ6Gka2.js";import"./throttle-C3XVEalA.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-B1sVi0uy.js";import"./useResourcePermissions-DSgvQt94.js";import"./documentStatus-Dzt5UJBp.js";import"./purchase-BkUzX1_K.js";import"./fieldPermissionResources-CfDwkGLv.js";import"./demandType-CukRcrDd.js";import"./quotation-piwMlqUX.js";import"./warehouseMarkerTags-D5Gw513U.js";import"./warehouse-execution-zR2ECPi7.js";import"./sales-order-C_BwIYR1.js";import"./dataDictionary-CKPkKAy6.js";import"./material-Dra_U8ot.js";import"./purchase-requisition-C30DmK8m.js";import"./demand-computation-C0cU4Eep.js";import"./availableInventoryCell-CGcK_nVD.js";import"./MrpMaterialPlanPanel-ipSVhEsT.js";import"./workOrderReporting-DhdlRPTS.js";import"./documentAttachments-C7mKd2pY.js";import"./WorkOrderMaterialMovementsPanel-BlJRc4Vr.js";import"./work-order-BEkFTjDl.js";import"./logisticsListPresentation-iQpXs3YP.js";import"./reporting-BZZqHpWN.js";import"./afterSalesListPresentation-DJ0Bhk4y.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-SJYIdnuv.js";import"./index-TZfB7UkB.js";import"./index-CAWNUVpa.js";import"./index-RKo-DE99.js";import"./LineAttachmentsUpload-MfdfSgQV.js";import"./AuditPhaseBadge-zlkPq-pj.js";import"./formListItems-DcSxpq1Y.js";const kr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=M(),[b,P]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});P(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===W.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:b.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
      `})]})};export{kr as default};
