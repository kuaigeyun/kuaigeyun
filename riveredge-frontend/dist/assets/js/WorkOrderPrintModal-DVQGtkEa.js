import{r as n,j as e,M as E,D as v,a8 as z,V as x,b3 as $,a2 as C,ag as s}from"./vendor-CC_RGxZu.js";import{g as L,b as W}from"./printTemplateSchemas-BqonLo3q.js";import{b as M,aY as w,D as O}from"./clientRelease-Aaf-Lume.js";import{_ as D}from"./main-DqBPc4A5.js";import"./LinkedDocumentDetailContext-jHqxanf_.js";import"./detailDrawerTimeFields-qp91fZU2.js";import"./index.es-BgNvkqs8.js";import"./sessionCurrentUser-NF1xaV-5.js";import"./globalStore-DApYhCqM.js";import"./restoredUser-CXcV1B7l.js";import"./tokenRefresh-C8ABYxC6.js";import"./building-2-D2A32xlO.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-BoFgj4ww.js";import"./statusBadges-30XwrE6e.js";/* empty css                            */import"./UniLifecycleStepper-Ct1W4pb-.js";import"./globalLifecycleI18n-DwIKnxFP.js";import"./send-BRrOou0I.js";import"./package-check-BudwM75X.js";import"./japanese-yen-CdIEdOyP.js";import"./file-QFMGglvT.js";import"./documentLifecycleStatusTag-B22elOVB.js";import"./documentStatusColors-DSl4kdE0.js";import"./operationColumn-O4cSvIjj.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-CnZLShv_.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-zniUgE9s.js";import"./index-BukYIKP_.js";import"./timer-haTt7V0m.js";import"./user-yHSldRcB.js";import"./userDisplay-Ds7VW0Q9.js";import"./QuantityWithUnitDisplay-BkQBzzkX.js";import"./materialUnitDisplay-DnpXCt7S.js";import"./material-unit-L838DuD6.js";import"./formDate-CwUkFwLo.js";import"./index-B11LeK56.js";import"./kuaireportSharedFilePreview-dWv7XVlB.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-C1TLpSDm.js";import"./index-CctITeRC.js";import"./index-CVlq-Gex.js";import"./index-BLQvH0Hm.js";import"./createForOfIteratorHelper-BLJ_ZNUw.js";import"./index-BDvoHkpS.js";import"./vendor-libredwg-CXo8ATMA.js";import"./vendor-three-BPXNOO5B.js";import"./index-D5w6s-Ks.js";import"./index-VF9vi4bI.js";import"./index-B0C5EYgA.js";import"./isObject-C5ttYDnH.js";import"./_baseIsEqual-C0P7VnfP.js";import"./debounce-B5QxSry9.js";import"./throttle-DitNHgMk.js";import"./routes-BB6gW3_s.js";import"./workOrderLifecycle-Bxzp7H20.js";import"./useResourcePermissions-v4oXNeKs.js";import"./documentStatus-D6kPdgtQ.js";import"./purchase-CkHCELzE.js";import"./fieldPermissionResources-CQFuZNFy.js";import"./demandType-CJYCFj-R.js";import"./quotation-CNrZ9nhX.js";import"./warehouseMarkerTags-BzUo4-MM.js";import"./warehouse-execution-C-YwCNI3.js";import"./sales-order-C-53D7vD.js";import"./dataDictionary-CNA0xiYx.js";import"./material-BR2qeUFP.js";import"./purchase-requisition-D7NIa6Un.js";import"./demand-computation-BcO4zlNA.js";import"./availableInventoryCell-DwUjKvfQ.js";import"./MrpMaterialPlanPanel-B8027M37.js";import"./workOrderReporting-DhdlRPTS.js";import"./documentAttachments-znTmP3dc.js";import"./WorkOrderMaterialMovementsPanel-2oHGtz3K.js";import"./work-order-D3y2pgxA.js";import"./logisticsListPresentation-eRLAHRZw.js";import"./reporting-DHi_elvU.js";import"./afterSalesListPresentation-BXufLLVr.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-D_AJkp6m.js";import"./index-e53pfE6u.js";import"./index-Dovnoa3m.js";import"./index-CHjaA4-D.js";import"./LineAttachmentsUpload-ClKFMx06.js";import"./AuditPhaseBadge-D06YIA1X.js";import"./formListItems-DcSxpq1Y.js";const kr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=M(),[b,P]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});P(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===W.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:b.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
