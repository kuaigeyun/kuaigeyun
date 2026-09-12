import{r as n,j as e,M as E,D as v,a8 as z,V as x,a$ as $,a2 as C,ag as s}from"./vendor-BeIC7Gcm.js";import{g as L,b as M}from"./printTemplateSchemas-BobMKvL6.js";import{b as W,a$ as w,D as O}from"./clientRelease-FjXFErC-.js";import{M as D}from"./main-CIyKdKIK.js";import"./LinkedDocumentDetailContext-BQ0-s0pg.js";import"./detailDrawerTimeFields-BgDSJsPA.js";import"./index.es-BGr9S0L0.js";import"./sessionCurrentUser-DG-9byvJ.js";import"./globalStore-DDZSpCcl.js";import"./restoredUser-HRx9YSH4.js";import"./tokenRefresh-ro2vsWKY.js";import"./building-2-YTGSpcn_.js";import"./clearSessionQueries-Db_KN_8V.js";import"./index-BXHHEM46.js";import"./statusBadges-DykiXS5J.js";/* empty css                            */import"./UniLifecycleStepper-DHTv8BJM.js";import"./globalLifecycleI18n-9A7Tav4Q.js";import"./documentLifecycleStatusTag-DB1reIKz.js";import"./documentStatusColors-BNjzS576.js";import"./operationColumn-C_EVRQ3w.js";import"./ActionConfirmPopconfirm-Cb-Su9ke.js";import"./listLifecycleStage-BIJOhOUg.js";import"./permissionContract-CsfOqryl.js";import"./permissionResource-C4537ZA2.js";import"./approvalInstance-BW7L_pNe.js";import"./index-CFcActFP.js";import"./timer-haTt7V0m.js";import"./user-MrN03Rnh.js";import"./displayContract-BlayUjT7.js";import"./userDisplay-BGtCimAr.js";import"./QuantityWithUnitDisplay-Ctr0Z4Ex.js";import"./materialUnitDisplay-D8Fwd8hC.js";import"./material-unit-BxVxfNVo.js";import"./formDate-DWJYfTt5.js";import"./index-D7qLS-u6.js";import"./kuaireportSharedFilePreview-h-9Lw1he.js";import"./customFieldJsonUtils-DpNbUP6i.js";import"./index-qUa75_12.js";import"./index-rEcN4v8f.js";import"./index-Dq9ePEWq.js";import"./index-CymP2Rp0.js";import"./createForOfIteratorHelper-CwLVT261.js";import"./index-CF66eOXH.js";import"./vendor-libredwg-BzljkpKo.js";import"./vendor-three-BPXNOO5B.js";import"./index-0QR0Jcgi.js";import"./index-BC5INaCl.js";import"./index-P5Thewhv.js";import"./isObject-Dzx-PX-3.js";import"./_baseIsEqual-CMJf4-so.js";import"./debounce-BqNeJp67.js";import"./throttle-Bn9nBP-3.js";import"./routes-DdvewRji.js";import"./workOrderLifecycle-CC7ihPh-.js";import"./systemDictionaryI18n-CzXHyYH5.js";import"./orderPaymentMilestonesFields-BDQ32EXx.js";import"./index-yRaMkbht.js";import"./index-DhMAXZws.js";import"./index-CdGWIGDy.js";import"./useResourcePermissions-B5jA4u6s.js";import"./documentStatus-D-XhJlTT.js";import"./purchase-Ben44axo.js";import"./fieldPermissionResources-QA9N-bSF.js";import"./demandType-Cn1gYoMh.js";import"./quotation-DtF9RPDa.js";import"./warehouseMarkerTags-C-dYT_qD.js";import"./warehouse-execution-CgZhtPYH.js";import"./sales-order-RWRtXNC0.js";import"./dataDictionary-C3TLP6Wg.js";import"./material-DrxnORYn.js";import"./purchase-requisition-CkEyM6tB.js";import"./demand-computation-D6s20ced.js";import"./availableInventoryCell-BBebpB_K.js";import"./MrpMaterialPlanPanel-BfspoMpf.js";import"./workOrderReporting-D5XZA1-Q.js";import"./documentAttachments-CsCMLQnl.js";import"./WorkOrderMaterialMovementsPanel-C2m_dnUx.js";import"./work-order-5Eiw_8L0.js";import"./logisticsListPresentation-BplsqJJ8.js";import"./reporting-DTY0oke4.js";import"./afterSalesListPresentation-Bo-8jSRC.js";import"./modalEventIsolation-Cy-kpAMJ.js";import"./after-sales-service-DXsgWEjQ.js";import"./index-TvhxcvUQ.js";import"./LineAttachmentsUpload-BGxYjIOo.js";import"./AuditPhaseBadge-BE4uZ9AY.js";import"./formListItems-DcSxpq1Y.js";const gr=({visible:m,onCancel:f,workOrderData:T,workOrderId:j})=>{const{t}=W(),[P,b]=n.useState([]),[k,g]=n.useState(!1),[y,d]=n.useState(!1),[a,u]=n.useState(),[h,l]=n.useState(""),c=n.useRef({}),p=j??T?.id;c.current={selectedTemplateId:a,effectiveWorkOrderId:p},n.useEffect(()=>{m&&(_(),u(void 0),l(""))},[m]),n.useEffect(()=>{m&&a&&p?I():l("")},[m,a,p]);const _=async()=>{g(!0);try{const r=await L({is_active:!0,document_type:"work_order"});b(r);const i=r.find(o=>o.is_default)??r.find(o=>o.code===M.work_order)??r[0];i&&u(i.uuid)}catch(r){w(r,t("app.kuaizhizao.workOrder.msgLoadPrintTemplateFailed"))}finally{g(!1)}},I=async()=>{if(!p||!a)return;const r=`${a}-${p}`;d(!0);try{const i=await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}),o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;l(i?.content??"")}catch(i){const o=c.current;if(r!==`${o.selectedTemplateId}-${o.effectiveWorkOrderId}`)return;w(i,t("app.kuaizhizao.workOrder.msgLoadPreviewFailed")),l("")}finally{const i=c.current;r===`${i.selectedTemplateId}-${i.effectiveWorkOrderId}`&&d(!1)}},S=async()=>{if(!p){s.warning(t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPrint"));return}if(!a){s.warning(t("app.kuaizhizao.workOrder.msgSelectPrintTemplate"));return}d(!0);try{const i=(await O(`/apps/kuaizhizao/work-orders/${p}/print`,{method:"GET",params:{template_uuid:a,output_format:"html",response_format:"json"}}))?.content??"";if(!i){s.error(t("app.kuaizhizao.workOrder.msgPrintContentEmpty"));return}const o=window.open("","_blank");o?(o.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("common.print")}</title></head><body>${i}</body></html>`),o.document.close(),o.focus(),o.print(),o.close(),s.success(t("app.kuaizhizao.workOrder.msgPrintSent"))):s.error(t("app.kuaizhizao.workOrder.msgPrintPopupBlocked"))}catch(r){w(r,t("app.kuaizhizao.workOrder.msgPrintFailed"))}finally{d(!1)}};return e.jsxs(E,{title:e.jsxs("div",{className:"no-print",style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:16},children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:t("app.kuaizhizao.workOrder.modalPrintTitle")}),e.jsx(C,{style:{width:260,flexShrink:0},placeholder:t("app.kuaizhizao.workOrder.msgSelectPrintTemplatePlaceholder"),value:a,onChange:u,loading:k,options:P.map(r=>({label:r.name,value:r.uuid}))})]}),open:m,onCancel:f,width:D.LARGE_WIDTH,wrapClassName:"work-order-print-modal-wrap",styles:{body:{padding:0,overflow:"hidden",height:"70vh",minHeight:500}},footer:[e.jsx(x,{onClick:f,children:t("common.cancel")},"cancel"),e.jsx(x,{type:"primary",icon:e.jsx($,{}),onClick:S,loading:y,disabled:!a||!p,children:t("common.print")},"print")],className:"work-order-print-modal",children:[e.jsx(v,{spinning:k,children:e.jsx("div",{className:"work-order-print-preview",style:{height:"100%",overflow:"auto"},children:p?y&&!h?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",minHeight:400},children:e.jsx(v,{description:t("app.kuaizhizao.workOrder.msgLoadingPreview"),children:e.jsx("div",{style:{minHeight:24}})})}):h?e.jsx("div",{dangerouslySetInnerHTML:{__html:h},style:{height:"100%",overflow:"auto",padding:16}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgSelectValidPrintTemplate"),style:{paddingTop:100}}):e.jsx(z,{description:t("app.kuaizhizao.workOrder.msgWorkOrderIdMissingPreview"),style:{paddingTop:100}})})}),e.jsx("style",{children:`
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
