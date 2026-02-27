var en = Object.defineProperty;
var tn = (n, e, a) => e in n ? en(n, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : n[e] = a;
var w = (n, e, a) => tn(n, typeof e != "symbol" ? e + "" : e, a);
import { CommandType as Yt, ICommandService as re, ObjectMatrix as v, generateRandomId as Xt, IUniverInstanceService as Ee, Rectangle as fe, sequenceExecuteAsync as an, Inject as H, Disposable as z, CellValueType as gt, createDocumentModelWithStyle as nn, WrapTextType as rn, PositionedObjectLayoutType as on, BooleanNumber as un, ObjectRelativeFromV as mn, ObjectRelativeFromH as fn, ImageSourceType as cn, DrawingTypeEnum as ln, BuildTextUtils as sn, InterceptorEffectEnum as ht, LifecycleService as dn, ILogService as pn, IConfigService as be, LocaleService as Wt, isFormulaString as ye, isFormulaId as Ia, cellToRange as Na, Tools as Ke, Direction as Qe, getIntersectRange as ke, RANGE_TYPE as W, UniverInstanceType as j, Injector as st, isRealNum as Ln, createIdentifier as Kt, toDisposable as ee, moveRangeByOffset as qt, DisposableCollection as $e, AbsoluteRefType as je, Optional as Pn, DependentOn as Ra, Plugin as Sa, merge as Aa, touchDependencies as ve, isNodeEnv as jt } from "@univerjs/core";
import { SetRangeValuesCommand as Ca, SheetsSelectionsService as Tn, getSheetCommandTarget as En, findFirstNonEmptyCell as In, alignToMergedCellsBorders as Rt, expandToContinuousRange as Nn, SetSelectionsOperation as Rn, SheetInterceptorService as dt, INTERCEPTOR_POINT as Da, InterceptCellContentPriority as Sn, SetRangeValuesMutation as Q, SetStyleCommand as kt, SetBorderCommand as ba, ClearSelectionFormatCommand as Oa, handleMoveCols as Ma, EffectRefRangId as Y, runRefRangeMutations as X, handleMoveRows as xa, handleMoveRange as _a, handleInsertRangeMoveRight as ya, handleInsertRangeMoveDown as ga, handleDeleteRangeMoveUp as ha, handleDeleteRangeMoveLeft as qa, handleIRemoveCol as Ua, handleIRemoveRow as Fa, handleInsertCol as Ba, handleInsertRow as va, RemoveDefinedNameCommand as Va, SetDefinedNameCommand as Ga, RemoveSheetCommand as An, SetWorksheetNameCommand as Cn, DeleteRangeMoveLeftCommand as Dn, DeleteRangeMoveUpCommand as bn, RemoveColCommand as On, RemoveRowCommand as Mn, InsertRangeMoveDownCommand as xn, InsertRangeMoveRightCommand as _n, InsertColCommand as yn, InsertRowCommand as gn, MoveColsCommand as hn, MoveRowsCommand as qn, MoveRangeCommand as Un, RemoveSheetMutation as Ut, InsertSheetMutation as Ft, MoveRangeMutation as zt, MoveRowsMutation as Zt, MoveColsMutation as Jt, ReorderRangeMutation as ea, RemoveRowMutation as ta, RemoveColMutation as aa, InsertColMutation as na, InsertRowMutation as ia, SetRowHiddenMutation as ra, SetRowVisibleMutation as oa, SetWorksheetActiveOperation as Ha, SCOPE_WORKBOOK_VALUE_DEFINED_NAME as St, RefRangeService as Fn, handleDefaultRangeChangeWithEffectRefCommands as ua, getSeparateEffectedRangesOnCommand as Bn, handleCommonDefaultRangeChangeWithEffectRefCommands as vn, UniverSheetsPlugin as Vn } from "@univerjs/sheets";
import { serializeRange as Ce, FormulaDataModel as qe, ErrorType as k, SetImageFormulaDataMutation as Gn, IActiveDirtyManagerService as Qt, SetFormulaCalculationResultMutation as wa, RemoveOtherFormulaMutation as Hn, SetOtherFormulaMutation as wn, SetFormulaCalculationStartMutation as Ne, SetFormulaCalculationStopMutation as ma, ENGINE_FORMULA_CYCLE_REFERENCE_COUNT as fa, SetFormulaCalculationNotificationMutation as Yn, FormulaExecuteStageType as Ve, FormulaExecutedStateType as Me, sequenceNodeType as ie, deserializeRangeWithSheetWithCache as Pe, serializeRangeToRefString as pt, IDefinedNamesService as Lt, LexerTreeBuilder as Pt, generateStringWithSequence as ze, SetDefinedNameMutation as De, SetFormulaDataMutation as Ge, SetArrayFormulaDataMutation as Bt, initSheetFormulaData as ca, RemoveDefinedNameMutation as vt, IFunctionService as Tt, stripErrorMargin as Xn, FunctionType as t, FUNCTION_NAMES_ARRAY as la, FUNCTION_NAMES_COMPATIBILITY as _, FUNCTION_NAMES_CUBE as de, FUNCTION_NAMES_DATABASE as $, FUNCTION_NAMES_DATE as V, FUNCTION_NAMES_ENGINEERING as C, FUNCTION_NAMES_FINANCIAL as D, FUNCTION_NAMES_INFORMATION as G, FUNCTION_NAMES_LOGICAL as K, FUNCTION_NAMES_LOOKUP as g, FUNCTION_NAMES_MATH as E, FUNCTION_NAMES_STATISTICAL as s, FUNCTION_NAMES_TEXT as b, FUNCTION_NAMES_WEB as At, isReferenceStrings as Wn, functionArray as Kn, functionCompatibility as kn, functionCube as Qn, functionDatabase as $n, functionDate as jn, functionEngineering as zn, functionFinancial as Zn, functionInformation as Jn, functionLogical as ei, functionLookup as ti, functionMath as ai, functionMeta as ni, functionStatistical as ii, functionText as ri, functionUniver as oi, functionWeb as ui, SetSuperTableMutation as mi, RemoveSuperTableMutation as fi, serializeRangeWithSheet as Ze, ISuperTableService as ci, serializeRangeWithSpreadsheet as sa, CustomFunction as Vt, AsyncCustomFunction as Ya, UniverFormulaEnginePlugin as Xa, IFormulaCurrentConfigService as li, Lexer as si, AstTreeBuilder as di, Interpreter as pi, generateExecuteAstNodeData as Li, getObjectValue as Pi } from "@univerjs/engine-formula";
import { Subject as da, BehaviorSubject as Wa, bufferWhen as Ti, filter as pa, map as Ei } from "rxjs";
import { IRPCChannelService as Ka, fromModule as Ii, toModule as Ni } from "@univerjs/rpc";
const Ri = {
  id: "formula.command.insert-function",
  type: Yt.COMMAND,
  handler: async (n, e) => {
    const { list: a, listOfRangeHasNumber: i } = e, r = n.get(re), o = new v();
    a.forEach((f) => {
      const { range: m, primary: c, formula: l } = f, { row: p, column: T } = c, L = Xt(6);
      o.setValue(p, T, {
        f: l,
        si: L
      });
      const { startRow: I, startColumn: A, endRow: N, endColumn: d } = m;
      for (let S = I; S <= N; S++)
        for (let R = A; R <= d; R++)
          (S !== p || R !== T) && o.setValue(S, R, {
            si: L
          });
    }), i && i.length > 0 && i.forEach((f) => {
      const { primary: m, formula: c } = f;
      o.setValue(m.row, m.column, {
        f: c
      });
    });
    const u = {
      value: o.getData()
    };
    return r.executeCommand(Ca.id, u);
  }
}, Si = {
  id: "sheets-formula.command.quick-sum",
  type: Yt.COMMAND,
  handler: async (n) => {
    const a = n.get(Tn).getCurrentLastSelection();
    if (!a) return !1;
    const i = n.get(Ee), r = En(i);
    if (!r) return !1;
    const o = a.range, { worksheet: u } = r;
    let f = In(o, u);
    if (!f) return !1;
    f = Rt(f, u);
    const m = Nn({
      startRow: f.startRow,
      startColumn: f.startColumn,
      endRow: o.endRow,
      endColumn: o.endColumn
    }, { left: !0, right: !0, up: !0, down: !0 }, u), c = new v(), l = Rt({
      startRow: m.endRow,
      endRow: m.endRow,
      startColumn: m.startColumn,
      endColumn: m.endColumn
    }, u);
    if (!fe.equals(l, m))
      for (const L of u.iterateByColumn(l))
        (!L.value || !u.cellHasValue(L.value)) && c.setValue(L.row, L.col, {
          f: `=SUM(${Ce({
            startColumn: L.col,
            endColumn: L.col,
            startRow: m.startRow,
            endRow: L.row - 1
          })})`
        });
    const p = Rt({
      startRow: m.startRow,
      startColumn: m.endColumn,
      endRow: m.endRow,
      endColumn: m.endColumn
    }, u);
    if (!fe.equals(p, m))
      for (const L of u.iterateByRow(p))
        (!L.value || !u.cellHasValue(L.value)) && c.setValue(L.row, L.col, {
          f: `=SUM(${Ce({
            startColumn: m.startColumn,
            endColumn: L.col - 1,
            startRow: L.row,
            endRow: L.row
          })})`
        });
    const T = n.get(re);
    return (await an([
      {
        id: Ca.id,
        params: {
          range: m,
          value: c.getMatrix()
        }
      },
      {
        id: Rn.id,
        params: {
          unitId: r.unitId,
          subUnitId: r.subUnitId,
          selections: [{
            range: m,
            primary: fe.contains(m, a.primary) ? a.primary : { ...f, actualRow: f.startRow, actualColumn: f.startColumn },
            style: null
          }]
        }
      }
    ], T)).result;
  }
}, _e = {
  type: Yt.MUTATION,
  id: "sheet.mutation.data-validation-formula-mark-dirty",
  handler() {
    return !0;
  }
}, Ue = "sheets-formula.base.config";
var Te = /* @__PURE__ */ ((n) => (n[n.FORCED = 0] = "FORCED", n[n.WHEN_EMPTY = 1] = "WHEN_EMPTY", n[n.NO_CALCULATION = 2] = "NO_CALCULATION", n))(Te || {});
const La = {}, Ai = "sheets-formula.remote.config", Pa = {};
var Ci = Object.getOwnPropertyDescriptor, Di = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Ci(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, Ct = (n, e) => (a, i) => e(a, i, n);
let Je = class extends z {
  constructor(e, a, i) {
    super();
    w(this, "_errorValueCell", {
      v: k.VALUE,
      t: gt.STRING
    });
    w(this, "_refreshRender");
    this._commandService = e, this._sheetInterceptorService = a, this._formulaDataModel = i, this._initialize();
  }
  _initialize() {
    this._commandExecutedListener(), this._initInterceptorCellContent();
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted(async (e) => {
        if (e.id === Gn.id) {
          const a = e.params;
          if (!a) return;
          const { imageFormulaData: i } = a;
          if (!i || i.length === 0) return;
          const r = await Promise.all(
            i.map((u) => this._getImageNatureSize(u))
          ), o = {};
          r.forEach((u) => {
            const { unitId: f, sheetId: m, row: c, column: l, ...p } = u;
            o[f] || (o[f] = {}), o[f][m] || (o[f][m] = new v()), o[f][m].setValue(c, l, p);
          }), this._formulaDataModel.mergeUnitImageFormulaData(o), this._refreshRender();
        }
      })
    );
  }
  // eslint-disable-next-line max-lines-per-function
  _initInterceptorCellContent() {
    this.disposeWithMe(
      this._sheetInterceptorService.intercept(Da.CELL_CONTENT, {
        priority: Sn.CELL_IMAGE,
        effect: ht.Value | ht.Style,
        // eslint-disable-next-line max-lines-per-function
        handler: (e, a, i) => {
          var h, M;
          const { unitId: r, subUnitId: o, row: u, col: f } = a, m = this._formulaDataModel.getUnitImageFormulaData(), c = (M = (h = m == null ? void 0 : m[r]) == null ? void 0 : h[o]) == null ? void 0 : M.getValue(u, f);
          if (!c)
            return i(e);
          const {
            source: l,
            // altText,
            // sizing,
            height: p,
            width: T,
            isErrorImage: L,
            imageNaturalWidth: I,
            imageNaturalHeight: A
          } = c;
          if (L)
            return i(this._errorValueCell);
          const N = T || I, d = p || A, S = nn("", {}), R = {
            unitId: r,
            subUnitId: o,
            drawingId: Xt(),
            drawingType: ln.DRAWING_IMAGE,
            imageSourceType: cn.URL,
            source: l,
            transform: {
              left: 0,
              top: 0,
              width: N,
              height: d
            },
            docTransform: {
              size: {
                width: N,
                height: d
              },
              positionH: {
                relativeFrom: fn.PAGE,
                posOffset: 0
              },
              positionV: {
                relativeFrom: mn.PARAGRAPH,
                posOffset: 0
              },
              angle: 0
            },
            behindDoc: un.FALSE,
            title: "",
            description: "",
            layoutType: on.INLINE,
            // Insert inline drawing by default.
            wrapText: rn.BOTH_SIDES,
            distB: 0,
            distL: 0,
            distR: 0,
            distT: 0
          }, P = sn.drawing.add({
            documentDataModel: S,
            drawings: [R],
            selection: {
              collapsed: !0,
              startOffset: 0,
              endOffset: 0
            }
          });
          return P ? (S.apply(P), i({
            ...e,
            p: S.getSnapshot()
          })) : i(this._errorValueCell);
        }
      })
    );
  }
  async _getImageNatureSize(e) {
    const a = await this._getImageSize(e.source);
    return a.image ? {
      ...e,
      isErrorImage: !1,
      imageNaturalHeight: a.height,
      imageNaturalWidth: a.width
    } : { ...e, isErrorImage: !0 };
  }
  async _getImageSize(e) {
    return new Promise((a) => {
      const i = new Image();
      i.src = e, i.onload = () => {
        a({
          width: i.width,
          height: i.height,
          image: i
        });
      }, i.onerror = () => {
        a({
          width: 0,
          height: 0,
          image: null
        });
      };
    });
  }
  registerRefreshRenderFunction(e) {
    this._refreshRender = e;
  }
};
Je = Di([
  Ct(0, re),
  Ct(1, H(dt)),
  Ct(2, H(qe))
], Je);
var Re = /* @__PURE__ */ ((n) => (n[n.NOT_REGISTER = 1] = "NOT_REGISTER", n[n.SUCCESS = 2] = "SUCCESS", n[n.WAIT = 3] = "WAIT", n[n.ERROR = 4] = "ERROR", n))(Re || {}), bi = Object.getOwnPropertyDescriptor, Oi = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? bi(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, Dt = (n, e) => (a, i) => e(a, i, n);
let et = class extends z {
  constructor(e, a, i) {
    super();
    w(this, "_formulaCacheMap", /* @__PURE__ */ new Map());
    w(this, "_formulaChangeWithRange$", new da());
    w(this, "formulaChangeWithRange$", this._formulaChangeWithRange$.asObservable());
    // FIXME: this design could be improved.
    w(this, "_formulaResult$", new da());
    w(this, "formulaResult$", this._formulaResult$.asObservable());
    w(this, "calculateStarted$", new Wa(!1));
    this._commandService = e, this._activeDirtyManagerService = a, this._lifecycleService = i, this._initFormulaRegister(), this._initFormulaCalculationResultChange();
  }
  dispose() {
    super.dispose(), this._formulaChangeWithRange$.complete(), this._formulaResult$.complete(), this.calculateStarted$.complete();
  }
  _ensureCacheMap(e, a) {
    let i = this._formulaCacheMap.get(e);
    i || (i = /* @__PURE__ */ new Map(), this._formulaCacheMap.set(e, i));
    let r = i.get(a);
    return r || (r = /* @__PURE__ */ new Map(), i.set(a, r)), r;
  }
  _createFormulaId(e, a) {
    return `formula.${e}_${a}_${Xt(8)}`;
  }
  _initFormulaRegister() {
    this._activeDirtyManagerService.register(
      _e.id,
      {
        commandId: _e.id,
        getDirtyData(a) {
          return {
            dirtyUnitOtherFormulaMap: a.params
          };
        }
      }
    );
    const e = (a) => {
      const { unitId: i, subUnitId: r, formulaText: o, formulaId: u, ranges: f } = a;
      if (!this._ensureCacheMap(i, r).has(u))
        return;
      const c = {
        unitId: i,
        subUnitId: r,
        formulaMap: {
          [u]: {
            f: o,
            ranges: f
          }
        }
      };
      this._commandService.executeCommand(wn.id, c).then(() => {
        this._commandService.executeCommand(
          _e.id,
          { [i]: { [r]: { [u]: !0 } } }
        );
      });
    };
    this.disposeWithMe(
      this._formulaChangeWithRange$.pipe(Ti(() => this.calculateStarted$.pipe(pa((a) => a)))).subscribe((a) => a.forEach(e))
    ), this.disposeWithMe(
      this._formulaChangeWithRange$.pipe(pa(() => this.calculateStarted$.getValue())).subscribe(e)
    );
  }
  _initFormulaCalculationResultChange() {
    this.disposeWithMe(this._commandService.onCommandExecuted((e) => {
      if (e.id === wa.id) {
        const a = e.params, { unitOtherData: i } = a, r = {};
        for (const o in i) {
          const u = i[o], f = {};
          r[o] = f;
          for (const m in u) {
            const c = this._ensureCacheMap(o, m), l = u[m], p = [];
            f[m] = p;
            for (const T in l) {
              const L = l[T];
              if (c.has(T)) {
                const I = c.get(T);
                if (!I)
                  continue;
                I.result || (I.result = {});
                const A = new v(L), N = new v(I.result);
                A.forValue((d, S, R) => {
                  N.setValue(d, S, R);
                }), I.status = Re.SUCCESS, I.callbacks.forEach((d) => {
                  d(L);
                }), I.callbacks.clear(), p.push(I);
              }
            }
          }
        }
        this._formulaResult$.next(r);
      }
    }));
  }
  registerFormulaWithRange(e, a, i, r = [{ startRow: 0, endRow: 0, startColumn: 0, endColumn: 0 }], o) {
    const u = this._createFormulaId(e, a);
    return this._ensureCacheMap(e, a).set(u, {
      result: void 0,
      status: Re.WAIT,
      formulaId: u,
      callbacks: /* @__PURE__ */ new Set(),
      extra: o
    }), this._formulaChangeWithRange$.next({
      unitId: e,
      subUnitId: a,
      formulaText: i,
      formulaId: u,
      ranges: r
    }), u;
  }
  deleteFormula(e, a, i) {
    const r = {
      unitId: e,
      subUnitId: a,
      formulaIdList: i
    };
    this._commandService.executeCommand(Hn.id, r);
    const o = this._ensureCacheMap(e, a);
    i.forEach((u) => o.delete(u));
  }
  getFormulaValue(e, a, i) {
    const r = this._ensureCacheMap(e, a), o = r.get(i);
    return o ? o.status === Re.SUCCESS || o.status === Re.ERROR ? Promise.resolve(o) : new Promise((u) => {
      o.callbacks.add(() => {
        u(r.get(i));
      });
    }) : Promise.resolve(null);
  }
  getFormulaValueSync(e, a, i) {
    return this._ensureCacheMap(e, a).get(i);
  }
  markFormulaDirty(e, a, i) {
    const r = this.getFormulaValueSync(e, a, i);
    r && (r.status = Re.WAIT, this._commandService.executeCommand(
      _e.id,
      { [e]: { [a]: { [i]: !0 } } }
    ));
  }
};
et = Oi([
  Dt(0, re),
  Dt(1, Qt),
  Dt(2, H(dn))
], et);
var Mi = Object.getOwnPropertyDescriptor, xi = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Mi(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, pe = (n, e) => (a, i) => e(a, i, n);
const Ta = { done: 0, count: 0 }, bt = { onlyLocal: !0 };
let ge = class extends z {
  constructor(e, a, i, r, o, u, f) {
    super();
    w(this, "_waitingCommandQueue", []);
    w(this, "_executingDirtyData", {
      forceCalculation: !1,
      dirtyRanges: [],
      dirtyNameMap: {},
      dirtyDefinedNameMap: {},
      dirtyUnitFeatureMap: {},
      dirtyUnitOtherFormulaMap: {},
      clearDependencyTreeCache: {}
    });
    w(this, "_setTimeoutKey", -1);
    w(this, "_startExecutionTime", 0);
    w(this, "_totalCalculationTaskCount", 0);
    w(this, "_doneCalculationTaskCount", 0);
    w(this, "_executionInProgressParams", null);
    w(this, "_restartCalculation", !1);
    /**
     * The mark of forced calculation. If a new mutation triggers dirty area calculation during the forced calculation process, forced calculation is still required.
     */
    w(this, "_forceCalculating", !1);
    w(this, "_progress$", new Wa(Ta));
    w(this, "progress$", this._progress$.asObservable());
    this._commandService = e, this._activeDirtyManagerService = a, this._logService = i, this._configService = r, this._formulaDataModel = o, this._localeService = u, this._registerOtherFormulaService = f, this._commandExecutedListener(), this._initialExecuteFormulaProcessListener(), this._initialExecuteFormula();
  }
  _emitProgress(e) {
    this._progress$.next({ done: this._doneCalculationTaskCount, count: this._totalCalculationTaskCount, label: e });
  }
  _startProgress() {
    this._doneCalculationTaskCount = 0, this._totalCalculationTaskCount = 1;
    const e = this._localeService.t("formula.progress.analyzing");
    this._emitProgress(e);
  }
  _calculateProgress(e) {
    if (this._executionInProgressParams) {
      const { totalFormulasToCalculate: a, completedFormulasCount: i, totalArrayFormulasToCalculate: r, completedArrayFormulasCount: o } = this._executionInProgressParams;
      if (this._doneCalculationTaskCount = i + o, this._totalCalculationTaskCount = a + r, this._totalCalculationTaskCount === 0)
        return;
      this._emitProgress(e);
    }
  }
  _completeProgress() {
    this._doneCalculationTaskCount = this._totalCalculationTaskCount = 1;
    const e = this._localeService.t("formula.progress.done");
    this._emitProgress(e);
  }
  clearProgress() {
    this._doneCalculationTaskCount = 0, this._totalCalculationTaskCount = 0, this._emitProgress();
  }
  dispose() {
    super.dispose(), this._progress$.next(Ta), this._progress$.complete(), clearTimeout(this._setTimeoutKey);
  }
  _getCalculationMode() {
    var a;
    const e = this._configService.getConfig(Ue);
    return (a = e == null ? void 0 : e.initialFormulaComputing) != null ? a : Te.WHEN_EMPTY;
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.beforeCommandExecuted((e) => {
        if (e.id === Ne.id) {
          const a = e.params;
          a.rowData = this._formulaDataModel.getHiddenRowsFiltered();
        }
      })
    ), this.disposeWithMe(
      this._commandService.onCommandExecuted((e, a) => {
        if (this._activeDirtyManagerService.get(e.id)) {
          if (e.id === Q.id) {
            const i = e.params;
            if (a && a.onlyLocal === !0 || i.trigger === kt.id || i.trigger === ba.id || i.trigger === Oa.id)
              return;
          }
          this._waitingCommandQueue.push(e), clearTimeout(this._setTimeoutKey), this._setTimeoutKey = setTimeout(() => {
            const i = this._generateDirty(this._waitingCommandQueue);
            this._executingDirtyData = this._mergeDirty(this._executingDirtyData, i), this._executionInProgressParams == null ? this._commandService.executeCommand(Ne.id, { ...this._executingDirtyData }, bt) : (this._restartCalculation = !0, this._commandService.executeCommand(ma.id, {})), this._waitingCommandQueue = [];
          }, 100);
        }
      })
    );
  }
  _generateDirty(e) {
    const a = [], i = {}, r = {}, o = {}, u = {}, f = {};
    for (const m of e) {
      const c = this._activeDirtyManagerService.get(m.id);
      if (c == null)
        continue;
      const l = c.getDirtyData(m), { dirtyRanges: p, dirtyNameMap: T, dirtyDefinedNameMap: L, dirtyUnitFeatureMap: I, dirtyUnitOtherFormulaMap: A, clearDependencyTreeCache: N } = l;
      p != null && this._mergeDirtyRanges(a, p), T != null && this._mergeDirtyNameMap(i, T), L != null && this._mergeDirtyNameMap(r, L), I != null && this._mergeDirtyUnitFeatureOrOtherFormulaMap(o, I), A != null && this._mergeDirtyUnitFeatureOrOtherFormulaMap(u, A), N != null && this._mergeDirtyNameMap(f, N);
    }
    return {
      dirtyRanges: a,
      dirtyNameMap: i,
      dirtyDefinedNameMap: r,
      dirtyUnitFeatureMap: o,
      dirtyUnitOtherFormulaMap: u,
      forceCalculation: !1,
      clearDependencyTreeCache: f,
      maxIteration: this._configService.getConfig(fa)
      // numfmtItemMap,
    };
  }
  _mergeDirty(e, a) {
    const i = [...e.dirtyRanges, ...a.dirtyRanges], r = { ...e.dirtyNameMap }, o = { ...e.dirtyDefinedNameMap }, u = { ...e.dirtyUnitFeatureMap }, f = { ...e.dirtyUnitOtherFormulaMap }, m = { ...e.clearDependencyTreeCache };
    this._mergeDirtyNameMap(r, a.dirtyNameMap), this._mergeDirtyNameMap(o, a.dirtyDefinedNameMap), this._mergeDirtyUnitFeatureOrOtherFormulaMap(u, a.dirtyUnitFeatureMap), this._mergeDirtyUnitFeatureOrOtherFormulaMap(f, a.dirtyUnitOtherFormulaMap), this._mergeDirtyNameMap(m, a.clearDependencyTreeCache);
    const c = e.maxIteration || a.maxIteration;
    return {
      dirtyRanges: i,
      dirtyNameMap: r,
      dirtyDefinedNameMap: o,
      dirtyUnitFeatureMap: u,
      dirtyUnitOtherFormulaMap: f,
      forceCalculation: !!this._forceCalculating,
      clearDependencyTreeCache: m,
      maxIteration: c
    };
  }
  /**
   * dirtyRanges may overlap with the ranges in allDirtyRanges and need to be deduplicated
   * @param allDirtyRanges
   * @param dirtyRanges
   */
  _mergeDirtyRanges(e, a) {
    for (const i of a) {
      let r = !1;
      for (const o of e)
        if (i.unitId === o.unitId && i.sheetId === o.sheetId) {
          const { startRow: u, startColumn: f, endRow: m, endColumn: c } = i.range, { startRow: l, startColumn: p, endRow: T, endColumn: L } = o.range;
          if (u === l && f === p && m === T && c === L) {
            r = !0;
            break;
          }
        }
      r || e.push(i);
    }
  }
  _mergeDirtyNameMap(e, a) {
    Object.keys(a).forEach((i) => {
      e[i] == null && (e[i] = {}), Object.keys(a[i]).forEach((r) => {
        var o;
        (o = a[i]) != null && o[r] && (e[i][r] = a[i][r]);
      });
    });
  }
  _mergeDirtyUnitFeatureOrOtherFormulaMap(e, a) {
    Object.keys(a).forEach((i) => {
      e[i] == null && (e[i] = {}), Object.keys(a[i]).forEach((r) => {
        e[i][r] == null && (e[i][r] = {}), Object.keys(a[i][r]).forEach((o) => {
          e[i][r][o] = a[i][r][o] || !1;
        });
      });
    });
  }
  // eslint-disable-next-line max-lines-per-function
  _initialExecuteFormulaProcessListener() {
    let e = null, a = 0;
    this.disposeWithMe(
      // eslint-disable-next-line max-lines-per-function, complexity
      this._commandService.onCommandExecuted((i) => {
        if (i.id === Ne.id) {
          const { forceCalculation: o = !1 } = i.params;
          o && (this._forceCalculating = !0);
        } else i.id === ma.id && this.clearProgress();
        if (i.id !== Yn.id)
          return;
        const r = i.params;
        if (r.stageInfo != null) {
          const {
            stage: o
          } = r.stageInfo;
          if (o === Ve.START)
            a === 0 && (this._startExecutionTime = performance.now()), a++, e !== null && (clearTimeout(e), e = null), e = setTimeout(() => {
              e = null, this._startProgress();
            }, 1e3);
          else if (o === Ve.CURRENTLY_CALCULATING) {
            if (this._executionInProgressParams = r.stageInfo, e === null) {
              const u = this._localeService.t("formula.progress.calculating");
              this._calculateProgress(u);
            }
          } else if (o === Ve.START_DEPENDENCY_ARRAY_FORMULA) {
            if (this._executionInProgressParams = r.stageInfo, e === null) {
              const u = this._localeService.t("formula.progress.array-analysis");
              this._calculateProgress(u);
            }
          } else if (o === Ve.CURRENTLY_CALCULATING_ARRAY_FORMULA && (this._executionInProgressParams = r.stageInfo, e === null)) {
            const u = this._localeService.t("formula.progress.array-calculation");
            this._calculateProgress(u);
          }
        } else {
          const o = r.functionsExecutedState;
          let u = "";
          switch (a--, o) {
            case Me.NOT_EXECUTED:
              u = "No tasks are being executed anymore", this._resetExecutingDirtyData();
              break;
            case Me.STOP_EXECUTION:
              u = "The execution of the formula has been stopped", a = 0;
              break;
            case Me.SUCCESS:
              u = "Formula calculation succeeded", (a === 0 || a === -1) && (u += `. Total time consumed: ${performance.now() - this._startExecutionTime} ms`), this._resetExecutingDirtyData();
              break;
            case Me.INITIAL:
              u = "Waiting for calculation", this._resetExecutingDirtyData();
              break;
          }
          (a === 0 || a === -1) && (e ? (clearTimeout(e), e = null, this.clearProgress()) : this._completeProgress(), a = 0, this._doneCalculationTaskCount = 0, this._totalCalculationTaskCount = 0, this._forceCalculating = !1), o === Me.STOP_EXECUTION && this._restartCalculation ? (this._restartCalculation = !1, this._commandService.executeCommand(
            Ne.id,
            {
              ...this._executingDirtyData
            },
            bt
          )) : this._executionInProgressParams = null, this._logService.debug("[TriggerCalculationController]", u);
        }
      })
    );
  }
  _resetExecutingDirtyData() {
    this._executingDirtyData = {
      dirtyRanges: [],
      dirtyNameMap: {},
      dirtyDefinedNameMap: {},
      dirtyUnitFeatureMap: {},
      dirtyUnitOtherFormulaMap: {},
      forceCalculation: !1,
      clearDependencyTreeCache: {}
    };
  }
  _initialExecuteFormula() {
    const e = this._getCalculationMode(), a = this._getDirtyDataByCalculationMode(e);
    this._commandService.executeCommand(Ne.id, a, bt), this._registerOtherFormulaService.calculateStarted$.next(!0);
  }
  _getDirtyDataByCalculationMode(e) {
    const a = e === Te.FORCED, i = e === Te.WHEN_EMPTY ? this._formulaDataModel.getFormulaDirtyRanges() : [];
    return {
      forceCalculation: a,
      dirtyRanges: i,
      dirtyNameMap: {},
      dirtyDefinedNameMap: {},
      dirtyUnitFeatureMap: {},
      dirtyUnitOtherFormulaMap: {},
      clearDependencyTreeCache: {},
      maxIteration: this._configService.getConfig(fa)
    };
  }
};
ge = xi([
  pe(0, re),
  pe(1, Qt),
  pe(2, pn),
  pe(3, be),
  pe(4, H(qe)),
  pe(5, H(Wt)),
  pe(6, H(et))
], ge);
function _i(n, e, a) {
  var i;
  return n == null || n[e] == null || ((i = n[e]) == null ? void 0 : i[a]) == null;
}
function Ot(n, e, a) {
  var i;
  if (a) {
    if (n && n[e] && ((i = n[e]) != null && i[a]))
      return delete n[e][a], {
        [e]: {
          [a]: null
        }
      };
  } else if (n && n[e])
    return delete n[e], {
      [e]: null
    };
}
var y = /* @__PURE__ */ ((n) => (n[n.MoveRange = 0] = "MoveRange", n[n.MoveRows = 1] = "MoveRows", n[n.MoveCols = 2] = "MoveCols", n[n.InsertRow = 3] = "InsertRow", n[n.InsertColumn = 4] = "InsertColumn", n[n.RemoveRow = 5] = "RemoveRow", n[n.RemoveColumn = 6] = "RemoveColumn", n[n.DeleteMoveLeft = 7] = "DeleteMoveLeft", n[n.DeleteMoveUp = 8] = "DeleteMoveUp", n[n.InsertMoveDown = 9] = "InsertMoveDown", n[n.InsertMoveRight = 10] = "InsertMoveRight", n[n.SetName = 11] = "SetName", n[n.RemoveSheet = 12] = "RemoveSheet", n[n.SetDefinedName = 13] = "SetDefinedName", n[n.RemoveDefinedName = 14] = "RemoveDefinedName", n))(y || {});
const yi = [
  11,
  12,
  13,
  14
  /* RemoveDefinedName */
];
function gi(n, e, a) {
  const { type: i } = a;
  return yi.includes(i) ? hi(n, e) : qi(n, e, a);
}
function hi(n, e) {
  const a = [], i = [];
  return Object.keys(e).forEach((r) => {
    const o = e[r], u = n[r];
    if (o == null || u == null)
      return !0;
    Object.keys(o).forEach((f) => {
      const m = new v(o[f] || {}), c = new v(u[f] || {}), l = new v(), p = new v();
      if (m.forValue((N, d, S) => {
        if (S == null)
          return !0;
        const R = he(S);
        R !== null && (l.setValue(N, d, R), p.setValue(N, d, c.getValue(N, d)));
      }), l.getSizeOf() === 0)
        return;
      const T = {
        subUnitId: f,
        unitId: r,
        cellValue: l.getMatrix()
      }, L = {
        id: Q.id,
        params: T
      };
      i.push(L);
      const I = {
        subUnitId: f,
        unitId: r,
        cellValue: p.getMatrix()
      }, A = {
        id: Q.id,
        params: I
      };
      a.push(A);
    });
  }), {
    undos: a,
    redos: i
  };
}
function qi(n, e, a) {
  const { redoFormulaData: i, undoFormulaData: r } = Ui(n, e, a), o = [], u = [];
  return Object.keys(i).forEach((f) => {
    Object.keys(i[f]).forEach((m) => {
      if (Object.keys(i[f][m]).length !== 0) {
        const c = {
          subUnitId: m,
          unitId: f,
          cellValue: i[f][m]
        }, l = {
          id: Q.id,
          params: c
        };
        o.push(l);
      }
    });
  }), Object.keys(r).forEach((f) => {
    Object.keys(r[f]).forEach((m) => {
      if (Object.keys(r[f][m]).length !== 0) {
        const c = {
          subUnitId: m,
          unitId: f,
          cellValue: r[f][m]
        }, l = {
          id: Q.id,
          params: c
        };
        u.push(l);
      }
    });
  }), {
    undos: u,
    redos: o
  };
}
function Ui(n, e, a) {
  const i = {}, r = {}, { unitId: o, sheetId: u } = a;
  return (/* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e)])).forEach((m) => {
    if (_i(n, m, u))
      return;
    (/* @__PURE__ */ new Set([
      ...Object.keys(n[m] || {}),
      ...Object.keys(e[m] || {})
    ])).forEach((l) => {
      var S, R;
      const p = (S = n[m]) == null ? void 0 : S[l], T = (R = e[m]) == null ? void 0 : R[l], L = new v(p || {}), I = new v(T || {});
      let A = [];
      m !== o || l !== u ? A = Bi(I) : A = Fi(L, I, a);
      const N = zi(A, L, I), d = Zi(A, L);
      i[m] || (i[m] = {}), r[m] || (r[m] = {}), i[m][l] = {
        ...i[m][l],
        ...N
      }, r[m][l] = {
        ...r[m][l],
        ...d
      };
    });
  }), {
    redoFormulaData: i,
    undoFormulaData: r
  };
}
function Fi(n, e, a) {
  const { type: i, from: r, to: o, range: u } = a, f = [];
  return n.forValue((m, c, l) => {
    if (l == null || !ka(l)) return !0;
    const p = Na(m, c);
    let T = null, L = !1;
    if ([
      0,
      1,
      2
      /* MoveCols */
    ].includes(i))
      T = vi(i, r, o, p);
    else if (u != null) {
      const I = Vi(p, a);
      T = I.newCell, L = I.isReverse;
    }
    if (Ke.diffValue(p, T) && !e.getValue(m, c))
      return !0;
    L ? f.unshift({ oldCell: p, newCell: T }) : f.push({ oldCell: p, newCell: T });
  }), f;
}
function Bi(n) {
  const e = [];
  return n.forValue((a, i, r) => {
    if (r == null || !ka(r)) return !0;
    const o = Na(a, i);
    e.push({ oldCell: o, newCell: o });
  }), e;
}
function vi(n, e, a, i) {
  if (e == null || a == null)
    return null;
  switch (n) {
    case 0:
      return Gi(e, a, i);
    case 1:
      return Hi(e, a, i);
    case 2:
      return wi(e, a, i);
    default:
      return null;
  }
}
function Vi(n, e) {
  const { type: a, rangeFilteredRows: i } = e, r = e.range;
  let o = null, u = !1;
  switch (a) {
    case 3:
      o = Yi(r, n), u = !0;
      break;
    case 4:
      o = Xi(r, n), u = !0;
      break;
    case 5:
      o = Wi(r, n, i);
      break;
    case 6:
      o = Ki(r, n);
      break;
    case 7:
      o = ki(r, n);
      break;
    case 8:
      o = Qi(r, n);
      break;
    case 9:
      o = $i(r, n), u = !0;
      break;
    case 10:
      o = ji(r, n), u = !0;
      break;
  }
  return { newCell: o, isReverse: u };
}
function Gi(n, e, a) {
  const i = _a(
    {
      id: Y.MoveRangeCommandId,
      params: { toRange: e, fromRange: n }
    },
    a
  );
  return X(i, a);
}
function Hi(n, e, a) {
  const i = xa(
    {
      id: Y.MoveRowsCommandId,
      params: { toRange: e, fromRange: n }
    },
    a
  );
  return X(i, a);
}
function wi(n, e, a) {
  const i = Ma(
    {
      id: Y.MoveColsCommandId,
      params: { toRange: e, fromRange: n }
    },
    a
  );
  return X(i, a);
}
function Yi(n, e) {
  const a = va(
    {
      id: Y.InsertRowCommandId,
      params: { range: n, unitId: "", subUnitId: "", direction: Qe.DOWN }
    },
    e
  );
  return X(a, e);
}
function Xi(n, e) {
  const a = Ba(
    {
      id: Y.InsertColCommandId,
      params: { range: n, unitId: "", subUnitId: "", direction: Qe.RIGHT }
    },
    e
  );
  return X(a, e);
}
function Wi(n, e, a) {
  const i = Fa(
    {
      id: Y.RemoveRowCommandId,
      params: { range: n }
    },
    e,
    a
  );
  return X(i, e);
}
function Ki(n, e) {
  const a = Ua(
    {
      id: Y.RemoveColCommandId,
      params: { range: n }
    },
    e
  );
  return X(a, e);
}
function ki(n, e) {
  const a = qa(
    {
      id: Y.DeleteRangeMoveLeftCommandId,
      params: { range: n }
    },
    e
  );
  return X(a, e);
}
function Qi(n, e) {
  const a = ha(
    {
      id: Y.DeleteRangeMoveUpCommandId,
      params: { range: n }
    },
    e
  );
  return X(a, e);
}
function $i(n, e) {
  const a = ga(
    {
      id: Y.InsertRangeMoveDownCommandId,
      params: { range: n }
    },
    e
  );
  return X(a, e);
}
function ji(n, e) {
  const a = ya(
    {
      id: Y.InsertRangeMoveRightCommandId,
      params: { range: n }
    },
    e
  );
  return X(a, e);
}
function zi(n, e, a) {
  var r, o, u;
  const i = new v({});
  for (let f = 0; f < n.length; f++) {
    const { oldCell: m, newCell: c } = n[f];
    if ((r = i.getValue(m.startRow, m.startColumn)) != null && r.f || (o = i.getValue(m.startRow, m.startColumn)) != null && o.si || i.setValue(m.startRow, m.startColumn, { f: null, si: null }), c) {
      const l = (u = a.getValue(m.startRow, m.startColumn)) != null ? u : e.getValue(m.startRow, m.startColumn), p = he(l);
      i.setValue(c.startRow, c.startColumn, p);
    }
  }
  return i.getMatrix();
}
function Zi(n, e) {
  const a = new v({});
  for (let i = n.length - 1; i >= 0; i--) {
    const { oldCell: r, newCell: o } = n[i], u = e.getValue(r.startRow, r.startColumn), f = he(u);
    if (a.setValue(r.startRow, r.startColumn, f), o) {
      const m = e.getValue(o.startRow, o.startColumn), c = he(m);
      a.setValue(o.startRow, o.startColumn, c != null ? c : { f: null, si: null });
    }
  }
  return a.getMatrix();
}
function he(n) {
  if (n == null)
    return null;
  const { f: e, si: a, x: i = 0, y: r = 0 } = n, o = ye(e), u = Ia(a);
  if (!o && !u)
    return {
      f: null,
      si: null
    };
  const f = {};
  return u && (f.si = a), o && i === 0 && r === 0 && (f.f = e), f.f === void 0 && (f.f = null), f.si === void 0 && (f.si = null), f;
}
function Ji(n) {
  const e = new v({});
  return new v(n).forValue((i, r, o) => {
    const u = he(o);
    u !== void 0 && e.setValue(i, r, u);
  }), e.getMatrix();
}
function ka(n) {
  const e = (n == null ? void 0 : n.f) || "", a = (n == null ? void 0 : n.si) || "", i = ye(e), r = Ia(a);
  return !!(i || r);
}
function Qa(n, e, a, i, r, o) {
  if ((r == null || r.length === 0) && (o == null || o.length === 0)) {
    if (n === a && e === i)
      return !0;
  } else if ((n === r || r == null || r.length === 0) && e === o)
    return !0;
  return !1;
}
function $a(n, e, a = 0, i = 0) {
  const r = [];
  for (let o = 0, u = n.length; o < u; o++) {
    const f = n[o];
    if (typeof f == "string" || f.nodeType !== ie.REFERENCE || e.includes(o)) {
      r.push(f);
      continue;
    }
    const { token: m } = f, c = Pe(m), { range: l, sheetName: p, unitId: T } = c, L = fe.moveOffset(l, a, i);
    r.push({
      ...f,
      token: pt({
        range: L,
        unitId: T,
        sheetName: p
      })
    });
  }
  return r;
}
function ja(n, e, a, i) {
  const { type: r, unitId: o, sheetId: u, range: f, from: m, to: c, rangeFilteredRows: l } = e, {
    range: p,
    sheetId: T,
    unitId: L,
    sheetName: I,
    refOffsetX: A,
    refOffsetY: N
  } = n;
  if (!Qa(
    o,
    u,
    a,
    i,
    L,
    T
  ))
    return;
  const d = fe.moveOffset(p, A, N);
  let S = null;
  if (r === y.MoveRange) {
    if (m == null || c == null)
      return;
    const R = xt(d, m), P = ke(d, m);
    if (P == null || R !== 4)
      return;
    const h = _a(
      { id: Y.MoveRangeCommandId, params: { toRange: c, fromRange: m } },
      P
    ), M = X(h, P);
    if (M == null)
      return k.REF;
    S = Mt(R, M, m, c, d, P);
  } else if (r === y.MoveRows) {
    if (m == null || c == null)
      return;
    const R = xt(d, m);
    let P = ke(d, m);
    if (P == null && (m.endRow < d.startRow && c.endRow <= d.startRow || m.startRow > d.endRow && c.startRow > d.endRow))
      return;
    P == null && (P = {
      startRow: d.startRow,
      endRow: d.endRow,
      startColumn: d.startColumn,
      endColumn: d.endColumn,
      rangeType: W.NORMAL
    });
    const h = xa(
      { id: Y.MoveRowsCommandId, params: { toRange: c, fromRange: m } },
      P
    ), M = X(h, P);
    if (M == null)
      return k.REF;
    S = Mt(R, M, m, c, d, P);
  } else if (r === y.MoveCols) {
    if (m == null || c == null)
      return;
    const R = xt(d, m);
    let P = ke(d, m);
    if (P == null && (m.endColumn < d.startColumn && c.endColumn <= d.startColumn || m.startColumn > d.endColumn && c.startColumn > d.endColumn))
      return;
    P == null && (P = {
      startRow: d.startRow,
      endRow: d.endRow,
      startColumn: d.startColumn,
      endColumn: d.endColumn,
      rangeType: W.NORMAL
    });
    const h = Ma(
      { id: Y.MoveColsCommandId, params: { toRange: c, fromRange: m } },
      P
    ), M = X(h, P);
    if (M == null)
      return k.REF;
    S = Mt(R, M, m, c, d, P);
  }
  if (f != null) {
    if (r === y.InsertRow) {
      const R = va(
        {
          id: Y.InsertRowCommandId,
          params: { range: f, unitId: "", subUnitId: "", direction: Qe.DOWN }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.InsertColumn) {
      const R = Ba(
        {
          id: Y.InsertColCommandId,
          params: { range: f, unitId: "", subUnitId: "", direction: Qe.RIGHT }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.RemoveRow) {
      const R = Fa(
        {
          id: Y.RemoveRowCommandId,
          params: { range: f }
        },
        d,
        l
      ), P = X(R, d);
      if (P == null)
        return k.REF;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.RemoveColumn) {
      const R = Ua(
        {
          id: Y.RemoveColCommandId,
          params: { range: f }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return k.REF;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.DeleteMoveLeft) {
      const R = qa(
        {
          id: Y.DeleteRangeMoveLeftCommandId,
          params: { range: f }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return k.REF;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.DeleteMoveUp) {
      const R = ha(
        {
          id: Y.DeleteRangeMoveUpCommandId,
          params: { range: f }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return k.REF;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.InsertMoveDown) {
      const R = ga(
        {
          id: Y.InsertRangeMoveDownCommandId,
          params: { range: f }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return;
      S = {
        ...d,
        ...P
      };
    } else if (r === y.InsertMoveRight) {
      const R = ya(
        {
          id: Y.InsertRangeMoveRightCommandId,
          params: { range: f }
        },
        d
      ), P = X(R, d);
      if (P == null)
        return;
      S = {
        ...d,
        ...P
      };
    }
  }
  if (S != null)
    return pt({
      range: S,
      sheetName: I,
      unitId: L
    });
}
function Mt(n, e, a, i, r, o) {
  const { startRow: u, endRow: f, startColumn: m, endColumn: c, rangeType: l } = xe(e), {
    startRow: p,
    startColumn: T,
    endRow: L,
    endColumn: I,
    rangeType: A = W.NORMAL
  } = xe(a), { startRow: N, startColumn: d, endRow: S, endColumn: R } = xe(i), {
    startRow: P,
    endRow: h,
    startColumn: M,
    endColumn: U
  } = xe(o), {
    startRow: q,
    endRow: x,
    startColumn: F,
    endColumn: B,
    rangeType: ae = W.NORMAL
  } = xe(r), O = { ...r };
  function ce() {
    return l === W.COLUMN && ae === W.COLUMN ? !0 : m >= F && c <= B;
  }
  function ne() {
    return l === W.ROW && ae === W.ROW ? !0 : u >= q && f <= x;
  }
  if (n === 0)
    if (ce())
      if (u < q)
        O.startRow = u;
      else if (u >= x)
        O.endRow -= L + 1 - q;
      else
        return;
    else
      return;
  else if (n === 1)
    if (ce())
      if (f > x)
        O.endRow = f;
      else if (f <= q)
        O.startRow += x - p + 1;
      else
        return;
    else
      return;
  else if (n === 2)
    if (ne())
      if (m < F)
        O.startColumn = m;
      else if (m >= B)
        O.endColumn -= I + 1 - F;
      else
        return;
    else
      return;
  else if (n === 3)
    if (ne())
      if (c > B)
        O.endColumn = c;
      else if (c <= F)
        O.startColumn += B - T + 1;
      else
        return;
    else
      return;
  else n === 4 ? (O.startRow = u, O.startColumn = m, O.endRow = f, O.endColumn = c) : T <= F && I >= B || A === W.ROW && ae === W.ROW ? a.endRow < q ? (N >= q && (O.startRow -= L - p + 1), N >= x && (O.endRow -= L - p + 1)) : a.startRow > x ? (S <= x && (O.endRow += L - p + 1), S <= q && (O.startRow += L - p + 1)) : a.startRow >= q && a.endRow <= x && (N <= q ? O.startRow += L - p + 1 : N >= x && (O.endRow -= L - p + 1)) : p <= q && L >= x || A === W.COLUMN && ae === W.COLUMN ? a.endColumn < F ? (d >= F && (O.startColumn -= I - T + 1), d >= B && (O.endColumn -= I - T + 1)) : a.startColumn > B ? (R <= B && (O.endColumn += I - T + 1), R <= F && (O.startColumn += I - T + 1)) : a.startColumn >= F && a.endColumn <= B && (d <= F ? O.startColumn += I - T + 1 : d >= B && (O.endColumn -= I - T + 1)) : ((d <= U + 1 && R >= B || d <= F && R >= M - 1) && N <= q && S >= x || (N <= h + 1 && S >= x || N <= q && S >= P - 1) && d <= F && R >= B, O.startRow = u, O.startColumn = m, O.endRow = f, O.endColumn = c);
  return O;
}
function xt(n, e) {
  const a = Se(n.startRow), i = Ae(n.endRow), r = Se(n.startColumn), o = Ae(n.endColumn), u = Se(e.startRow), f = Ae(e.endRow), m = Se(e.startColumn), c = Ae(e.endColumn);
  function l() {
    return n.rangeType === W.COLUMN && e.rangeType === W.COLUMN ? !0 : a >= u && i <= f;
  }
  function p() {
    return n.rangeType === W.ROW && e.rangeType === W.ROW ? !0 : r >= m && o <= c;
  }
  function T() {
    return n.rangeType === W.ALL && e.rangeType === W.ALL;
  }
  return l() && p() || T() ? 4 : p() && a >= u && a <= f && i > f ? 0 : p() && i >= u && i <= f && a < u ? 1 : l() && r >= m && r <= c && o > c ? 2 : l() && o >= m && o <= c && r < m ? 3 : null;
}
function Se(n) {
  return isNaN(n) ? -1 / 0 : n;
}
function Ae(n) {
  return isNaN(n) ? 1 / 0 : n;
}
function xe(n) {
  const { startRow: e, endRow: a, startColumn: i, endColumn: r } = n;
  return {
    ...n,
    startRow: Se(e),
    endRow: Ae(a),
    startColumn: Se(i),
    endColumn: Ae(r)
  };
}
function za(n, e) {
  const { id: a } = e;
  let i = null;
  switch (a) {
    case Un.id:
      i = er(e, n);
      break;
    case qn.id:
      i = tr(e, n);
      break;
    case hn.id:
      i = ar(e, n);
      break;
    case gn.id:
      i = nr(e);
      break;
    case yn.id:
      i = ir(e);
      break;
    case _n.id:
      i = rr(e, n);
      break;
    case xn.id:
      i = or(e, n);
      break;
    case Mn.id:
      i = ur(e, n);
      break;
    case On.id:
      i = mr(e, n);
      break;
    case bn.id:
      i = fr(e, n);
      break;
    case Dn.id:
      i = cr(e, n);
      break;
    case Cn.id:
      i = lr(e, n);
      break;
    case An.id:
      i = sr(e, n);
      break;
    case Ga.id:
      i = dr(e, n);
      break;
    case Va.id:
      i = pr(e, n);
      break;
  }
  return i;
}
function te(n) {
  var i;
  const e = n.getUnitId(), a = ((i = n.getActiveSheet()) == null ? void 0 : i.getSheetId()) || "";
  return {
    unitId: e,
    sheetId: a
  };
}
function er(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { fromRange: i, toRange: r } = a;
  if (!i || !r) return null;
  const { unitId: o, sheetId: u } = te(e);
  return {
    type: y.MoveRange,
    from: i,
    to: r,
    unitId: o,
    sheetId: u
  };
}
function tr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const {
    fromRange: { startRow: i, endRow: r },
    toRange: { startRow: o, endRow: u }
  } = a, f = e.getUnitId(), m = e.getActiveSheet();
  if (!m) return null;
  const c = m.getSheetId(), l = {
    startRow: i,
    startColumn: 0,
    endRow: r,
    endColumn: m.getColumnCount() - 1,
    rangeType: W.ROW
  }, p = {
    startRow: o,
    startColumn: 0,
    endRow: u,
    endColumn: m.getColumnCount() - 1,
    rangeType: W.ROW
  };
  return {
    type: y.MoveRows,
    from: l,
    to: p,
    unitId: f,
    sheetId: c
  };
}
function ar(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const {
    fromRange: { startColumn: i, endColumn: r },
    toRange: { startColumn: o, endColumn: u }
  } = a, f = e.getUnitId(), m = e.getActiveSheet();
  if (!m) return null;
  const c = m.getSheetId(), l = {
    startRow: 0,
    startColumn: i,
    endRow: m.getRowCount() - 1,
    endColumn: r,
    rangeType: W.COLUMN
  }, p = {
    startRow: 0,
    startColumn: o,
    endRow: m.getRowCount() - 1,
    endColumn: u,
    rangeType: W.COLUMN
  };
  return {
    type: y.MoveCols,
    from: l,
    to: p,
    unitId: f,
    sheetId: c
  };
}
function nr(n) {
  const { params: e } = n;
  if (!e) return null;
  const { range: a, unitId: i, subUnitId: r } = e;
  return {
    type: y.InsertRow,
    range: a,
    unitId: i,
    sheetId: r
  };
}
function ir(n) {
  const { params: e } = n;
  if (!e) return null;
  const { range: a, unitId: i, subUnitId: r } = e;
  return {
    type: y.InsertColumn,
    range: a,
    unitId: i,
    sheetId: r
  };
}
function rr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.InsertMoveRight,
    range: i,
    unitId: r,
    sheetId: o
  };
}
function or(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.InsertMoveDown,
    range: i,
    unitId: r,
    sheetId: o
  };
}
function ur(n, e) {
  var u, f;
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.RemoveRow,
    range: i,
    unitId: r,
    sheetId: o,
    rangeFilteredRows: (f = (u = e.getSheetBySheetId(o)) == null ? void 0 : u.getRangeFilterRows(i)) != null ? f : []
  };
}
function mr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.RemoveColumn,
    range: i,
    unitId: r,
    sheetId: o
  };
}
function fr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.DeleteMoveUp,
    range: i,
    unitId: r,
    sheetId: o
  };
}
function cr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { range: i } = a, { unitId: r, sheetId: o } = te(e);
  return {
    type: y.DeleteMoveLeft,
    range: i,
    unitId: r,
    sheetId: o
  };
}
function lr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { unitId: i, subUnitId: r, name: o } = a, { unitId: u, sheetId: f } = te(e);
  return {
    type: y.SetName,
    unitId: i || u,
    sheetId: r || f,
    sheetName: o
  };
}
function sr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { unitId: i, subUnitId: r } = a, { unitId: o, sheetId: u } = te(e);
  return {
    type: y.RemoveSheet,
    unitId: i || o,
    sheetId: r || u
  };
}
function dr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { unitId: i, name: r, id: o } = a, { sheetId: u } = te(e);
  return {
    type: y.SetDefinedName,
    unitId: i,
    sheetId: u,
    definedName: r,
    definedNameId: o
  };
}
function pr(n, e) {
  const { params: a } = n;
  if (!a) return null;
  const { unitId: i, name: r, id: o } = a, { sheetId: u } = te(e);
  return {
    type: y.RemoveDefinedName,
    unitId: i,
    sheetId: u,
    definedName: r,
    definedNameId: o
  };
}
var Lr = Object.getOwnPropertyDescriptor, Pr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Lr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, He = (n, e) => (a, i) => e(a, i, n);
let tt = class extends z {
  constructor(n, e, a, i) {
    super(), this._definedNamesService = n, this._univerInstanceService = e, this._sheetInterceptorService = a, this._lexerTreeBuilder = i, this._initialize();
  }
  _initialize() {
    this._commandExecutedListener();
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._sheetInterceptorService.interceptCommand({
        getMutations: (n) => {
          if (n.id === Ga.id || n.id === Va.id)
            return {
              redos: [],
              undos: []
            };
          const e = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET);
          if (e == null)
            return {
              redos: [],
              undos: []
            };
          const a = za(e, n);
          return a ? this._getUpdateDefinedNameMutations(e, a) : {
            redos: [],
            undos: []
          };
        }
      })
    );
  }
  // eslint-disable-next-line max-lines-per-function
  _getUpdateDefinedNameMutations(n, e) {
    const { type: a, unitId: i, sheetId: r } = e, o = this._definedNamesService.getDefinedNameMap(i);
    if (!o)
      return {
        redos: [],
        undos: []
      };
    const u = [], f = [];
    return Object.values(o).forEach((m) => {
      var N;
      const { formulaOrRefString: c } = m, l = this._lexerTreeBuilder.sequenceNodesBuilder(c);
      if (l == null)
        return !0;
      let p = !1;
      const T = [];
      for (let d = 0, S = l.length; d < S; d++) {
        const R = l[d];
        if (typeof R == "string" || R.nodeType !== ie.REFERENCE)
          continue;
        const { token: P } = R, h = Pe(P), { range: M, sheetName: U, unitId: q } = h, x = ((N = n.getSheetBySheetName(U)) == null ? void 0 : N.getSheetId()) || "", F = {
          range: M,
          sheetId: x,
          unitId: q,
          sheetName: U,
          refOffsetX: 0,
          refOffsetY: 0
        };
        let B = null;
        if (a === y.RemoveSheet)
          B = this._removeSheet(m, i, r);
        else if (a === y.SetName) {
          const {
            sheetId: ae,
            sheetName: O
          } = e;
          if (O == null || x == null || x.length === 0 || ae !== x)
            continue;
          B = pt({
            range: M,
            sheetName: O,
            unitId: q
          });
        } else
          B = ja(
            F,
            e,
            i,
            r
          );
        B != null && (l[d] = {
          ...R,
          token: B
        }, p = !0, T.push(d));
      }
      if (!p)
        return !0;
      const L = ze($a(l, T)), I = {
        id: De.id,
        params: {
          unitId: i,
          ...m,
          formulaOrRefString: L
        }
      };
      u.push(I);
      const A = {
        id: De.id,
        params: {
          unitId: i,
          ...m
        }
      };
      f.push(A);
    }), {
      redos: u,
      undos: f
    };
  }
  _removeSheet(n, e, a) {
    var o;
    const { formulaOrRefString: i } = n;
    return ((o = this._definedNamesService.getWorksheetByRef(e, i)) == null ? void 0 : o.getSheetId()) === a ? k.REF : null;
  }
};
tt = Pr([
  He(0, Lt),
  He(1, Ee),
  He(2, H(dt)),
  He(3, H(Pt))
], tt);
var Tr = Object.getOwnPropertyDescriptor, Er = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Tr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, me = (n, e) => (a, i) => e(a, i, n);
let at = class extends z {
  constructor(n, e, a, i, r, o, u, f) {
    super(), this._univerInstanceService = n, this._commandService = e, this._lexerTreeBuilder = a, this._formulaDataModel = i, this._sheetInterceptorService = r, this._definedNamesService = o, this._configService = u, this._injector = f, this._commandExecutedListener();
  }
  _commandExecutedListener() {
    this.disposeWithMe(this._sheetInterceptorService.interceptCommand({
      getMutations: (n) => this._getUpdateFormula(n)
    })), this.disposeWithMe(
      this._commandService.onCommandExecuted((n) => {
        if (n.params)
          if (n.id === Ut.id) {
            const { subUnitId: e, unitId: a } = n.params;
            this._handleWorkbookDisposed(a, e);
          } else n.id === Ft.id && this._handleInsertSheetMutation(n.params);
      })
    ), this.disposeWithMe(
      this._commandService.beforeCommandExecuted((n, e) => {
        if (n.id === Q.id) {
          const a = n.params;
          if (e && e.onlyLocal === !0 || e && e.syncOnly === !0 || a.trigger === kt.id || a.trigger === ba.id || a.trigger === Oa.id)
            return;
          this._handleSetRangeValuesMutation(a);
        }
      })
    ), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitAdded$(j.UNIVER_SHEET).subscribe((n) => this._handleWorkbookAdded(n))), this.disposeWithMe(this._univerInstanceService.getTypeOfUnitDisposed$(j.UNIVER_SHEET).pipe(Ei((n) => n.getUnitId())).subscribe((n) => this._handleWorkbookDisposed(n)));
  }
  _handleSetRangeValuesMutation(n) {
    const { subUnitId: e, unitId: a, cellValue: i } = n;
    if (i == null)
      return;
    const r = this._formulaDataModel.updateFormulaData(a, e, i);
    if (Object.keys(r).length === 0)
      return;
    const o = {
      [a]: {
        [e]: r
      }
    };
    this._commandService.executeCommand(
      Q.id,
      {
        unitId: a,
        subUnitId: e,
        cellValue: Ji(r)
      },
      {
        onlyLocal: !0,
        fromFormula: !0
      }
    ), this._formulaDataModel.updateArrayFormulaCellData(a, e, i), this._formulaDataModel.updateArrayFormulaRange(a, e, i), this._formulaDataModel.updateImageFormulaData(a, e, i), this._commandService.executeCommand(
      Ge.id,
      {
        formulaData: o
      },
      {
        onlyLocal: !0
      }
    ), this._commandService.executeCommand(
      Bt.id,
      {
        arrayFormulaRange: this._formulaDataModel.getArrayFormulaRange(),
        arrayFormulaCellData: this._formulaDataModel.getArrayFormulaCellData()
      },
      {
        onlyLocal: !0,
        remove: !0
        // remove array formula range shape
      }
    );
  }
  _handleWorkbookDisposed(n, e) {
    const a = this._formulaDataModel.getFormulaData(), i = Ot(a, n, e), r = this._formulaDataModel.getArrayFormulaRange(), o = Ot(r, n, e), u = this._formulaDataModel.getArrayFormulaCellData(), f = Ot(u, n, e);
    i && this._commandService.executeCommand(
      Ge.id,
      {
        formulaData: i
      },
      {
        onlyLocal: !0
      }
    ), o && f && this._commandService.executeCommand(
      Bt.id,
      {
        arrayFormulaRange: r,
        arrayFormulaCellData: u
      },
      {
        onlyLocal: !0
      }
    );
  }
  _handleInsertSheetMutation(n) {
    const { sheet: e, unitId: a } = n, i = this._formulaDataModel.getFormulaData(), { id: r, cellData: o } = e, u = new v(o), f = ca(i, a, r, u);
    this._commandService.executeCommand(
      Ge.id,
      {
        formulaData: f
      },
      {
        onlyLocal: !0
      }
    );
  }
  _handleWorkbookAdded(n) {
    var m;
    const e = {}, a = n.getUnitId(), i = { [a]: {} };
    n.getSheets().forEach((c) => {
      var L;
      const l = c.getCellMatrix(), p = c.getSheetId(), T = ca(e, a, p, l);
      i[a][p] = (L = T[a]) == null ? void 0 : L[p];
    }), this._commandService.executeCommand(Ge.id, { formulaData: i }, { onlyLocal: !0 });
    const o = this._configService.getConfig(Ue), u = (m = o == null ? void 0 : o.initialFormulaComputing) != null ? m : Te.WHEN_EMPTY, f = this._getDirtyDataByCalculationMode(u);
    this._commandService.executeCommand(Ne.id, f, { onlyLocal: !0 });
  }
  _getDirtyDataByCalculationMode(n) {
    const e = n === Te.FORCED, a = n === Te.WHEN_EMPTY ? this._formulaDataModel.getFormulaDirtyRanges() : [];
    return {
      forceCalculation: e,
      dirtyRanges: a,
      dirtyNameMap: {},
      dirtyDefinedNameMap: {},
      dirtyUnitFeatureMap: {},
      dirtyUnitOtherFormulaMap: {},
      clearDependencyTreeCache: {}
    };
  }
  _getUpdateFormula(n) {
    const e = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET);
    if (!e)
      return {
        undos: [],
        redos: []
      };
    const a = za(e, n);
    if (a) {
      const { unitSheetNameMap: i } = this._formulaDataModel.getCalculateData(), r = this._formulaDataModel.getFormulaData(), { newFormulaData: o } = this._getFormulaReferenceMoveInfo(
        r,
        i,
        a
      ), { undos: u, redos: f } = gi(r, o, a);
      return {
        undos: u,
        redos: f
      };
    }
    return {
      undos: [],
      redos: []
    };
  }
  // eslint-disable-next-line max-lines-per-function
  _getFormulaReferenceMoveInfo(n, e, a) {
    if (!Ke.isDefine(n)) return { newFormulaData: {}, oldFormulaData: {} };
    const i = Object.keys(n);
    if (i.length === 0) return { newFormulaData: {}, oldFormulaData: {} };
    const r = {}, o = {};
    for (const u of i) {
      const f = n[u];
      if (f == null)
        continue;
      const m = Object.keys(f);
      Ke.isDefine(r[u]) || (r[u] = {}), Ke.isDefine(o[u]) || (o[u] = {});
      for (const c of m) {
        const l = new v(f[c] || {}), p = new v(), T = [];
        l.forValue((L, I, A) => {
          var F;
          if (!A) return !0;
          const { f: N, x: d, y: S, si: R } = A, P = this._lexerTreeBuilder.sequenceNodesBuilder(N);
          if (P == null)
            return !0;
          let h = !1;
          const M = [], { type: U, from: q } = a;
          for (let B = 0, ae = P.length; B < ae; B++) {
            const O = P[B];
            if (typeof O == "string")
              continue;
            const { token: ce, nodeType: ne } = O;
            if ((U === y.SetDefinedName || U === y.RemoveDefinedName) && (ne === ie.DEFINED_NAME || ne === ie.FUNCTION)) {
              const { definedNameId: Be, definedName: Ie } = a;
              if (Be === void 0 || Ie === void 0)
                continue;
              const se = this._definedNamesService.getValueById(u, Be);
              if (se == null || se.name !== ce)
                continue;
              P[B] = {
                ...O,
                token: U === y.SetDefinedName ? Ie : k.REF
              }, h = !0, M.push(B);
              continue;
            } else if (ne !== ie.REFERENCE)
              continue;
            const le = Pe(ce), { range: Z, sheetName: oe, unitId: ue } = le, Fe = ue == null || ue.length === 0 ? u : ue, J = ((F = e == null ? void 0 : e[Fe]) == null ? void 0 : F[oe]) || "";
            if (!Qa(
              a.unitId,
              a.sheetId,
              u,
              c,
              ue,
              J
            ))
              continue;
            const Nt = {
              range: Z,
              sheetId: J,
              unitId: ue,
              sheetName: oe,
              refOffsetX: d || 0,
              refOffsetY: S || 0
            };
            let Oe = null;
            if (U === y.SetName) {
              const {
                unitId: Be,
                sheetId: Ie,
                sheetName: se
              } = a;
              if (se == null || J == null || J.length === 0 || Ie !== J)
                continue;
              Oe = pt({
                range: Z,
                sheetName: se,
                unitId: ue
              });
            } else if (U === y.RemoveSheet) {
              const {
                unitId: Be,
                sheetId: Ie,
                sheetName: se
              } = a;
              if (J == null || J.length === 0 || Ie !== J)
                continue;
              Oe = k.REF;
            } else U !== y.SetDefinedName && (Oe = ja(
              Nt,
              a,
              u,
              c
            ));
            Oe != null && (P[B] = {
              ...O,
              token: Oe
            }, h = !0, M.push(B), R && (d != null ? d : 0) === 0 && (S != null ? S : 0) === 0 && T.push(R));
          }
          if (!h)
            if (R && [y.MoveRows, y.MoveCols, y.MoveRange].includes(U)) {
              if (q && q.startRow <= L && L <= q.endRow && q.startColumn <= I && I <= q.endColumn)
                (d != null ? d : 0) === 0 && (S != null ? S : 0) === 0 && T.push(R);
              else if (!T.includes(R))
                return !0;
            } else
              return !0;
          const x = $a(P, M, d, S);
          p.setValue(L, I, {
            f: `=${ze(x)}`
          });
        }), o[u] && (o[u][c] = p.getData());
      }
    }
    return { newFormulaData: o };
  }
};
at = Er([
  me(0, Ee),
  me(1, re),
  me(2, H(Pt)),
  me(3, H(qe)),
  me(4, H(dt)),
  me(5, Lt),
  me(6, be),
  me(7, H(st))
], at);
const Ir = "SHEETS_FORMULA_PLUGIN";
var Nr = Object.getOwnPropertyDescriptor, Rr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Nr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, _t = (n, e) => (a, i) => e(a, i, n);
let nt = class extends z {
  constructor(n, e, a) {
    super(), this._activeDirtyManagerService = n, this._univerInstanceService = e, this._formulaDataModel = a, this._initialize();
  }
  _initialize() {
    this._initialConversion();
  }
  _initialConversion() {
    this._activeDirtyManagerService.register(Q.id, {
      commandId: Q.id,
      getDirtyData: (n) => {
        const e = n.params;
        return e.trigger === kt.id ? {} : {
          dirtyRanges: this._getSetRangeValuesMutationDirtyRange(e)
        };
      }
    }), this._initialMove(), this._initialRowAndColumn(), this._initialHideRow(), this._initialSheet(), this._initialDefinedName();
  }
  _initialMove() {
    this._activeDirtyManagerService.register(zt.id, {
      commandId: zt.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getMoveRangeMutationDirtyRange(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.to.subUnitId]: "1",
              [e.from.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(Zt.id, {
      commandId: Zt.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getMoveRowsMutationDirtyRange(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(Jt.id, {
      commandId: Jt.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getMoveRowsMutationDirtyRange(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(ea.id, {
      commandId: ea.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getReorderRangeMutationDirtyRange(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    });
  }
  _initialRowAndColumn() {
    this._activeDirtyManagerService.register(ta.id, {
      commandId: ta.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getRemoveRowOrColumnMutation(e, !0),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(aa.id, {
      commandId: aa.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getRemoveRowOrColumnMutation(e, !1),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(na.id, {
      commandId: na.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(ia.id, {
      commandId: ia.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    });
  }
  _initialHideRow() {
    this._activeDirtyManagerService.register(ra.id, {
      commandId: ra.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getHideRowMutation(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(oa.id, {
      commandId: oa.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyRanges: this._getHideRowMutation(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    });
  }
  _initialSheet() {
    this._activeDirtyManagerService.register(Ut.id, {
      commandId: Ut.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyNameMap: this._getRemoveSheetMutation(e),
          clearDependencyTreeCache: {
            [e.unitId]: {
              [e.subUnitId]: "1"
            }
          }
        };
      }
    }), this._activeDirtyManagerService.register(Ft.id, {
      commandId: Ft.id,
      getDirtyData: (n) => {
        const e = n.params;
        return {
          dirtyNameMap: this._getInsertSheetMutation(e)
        };
      }
    });
  }
  _initialDefinedName() {
    this._activeDirtyManagerService.register(De.id, {
      commandId: De.id,
      getDirtyData: (n) => {
        const e = n.params;
        return { dirtyDefinedNameMap: this._getDefinedNameMutation(e) };
      }
    }), this._activeDirtyManagerService.register(vt.id, {
      commandId: vt.id,
      getDirtyData: (n) => {
        const e = n.params;
        return { dirtyDefinedNameMap: this._getDefinedNameMutation(e) };
      }
    });
  }
  _getDefinedNameMutation(n) {
    const { unitId: e, name: a, formulaOrRefString: i } = n, r = {};
    return n == null ? {} : (r[e] = {}, r[e][a] = i, r);
  }
  _getSetRangeValuesMutationDirtyRange(n) {
    const { subUnitId: e, unitId: a, cellValue: i } = n, r = [];
    return i == null || (r.push(...this._getDirtyRangesByCellValue(a, e, i)), r.push(...this._getDirtyRangesForArrayFormula(a, e, i))), r;
  }
  _getMoveRangeMutationDirtyRange(n) {
    const { unitId: e, from: a, to: i } = n, r = [];
    return r.push(...this._getDirtyRangesByCellValue(e, a.subUnitId, a.value)), r.push(...this._getDirtyRangesByCellValue(e, i.subUnitId, i.value)), r.push(...this._getDirtyRangesForArrayFormula(e, i.subUnitId, i.value)), r;
  }
  _getMoveRowsMutationDirtyRange(n) {
    const { subUnitId: e, unitId: a, sourceRange: i, targetRange: r } = n, o = [], u = this._rangeToMatrix(i).getData(), f = this._rangeToMatrix(r).getData();
    return o.push(...this._getDirtyRangesByCellValue(a, e, u)), o.push(...this._getDirtyRangesByCellValue(a, e, f)), o.push(...this._getDirtyRangesForArrayFormula(a, e, f)), o;
  }
  _getReorderRangeMutationDirtyRange(n) {
    const { unitId: e, subUnitId: a, range: i } = n, r = this._rangeToMatrix(i).getData(), o = [];
    return o.push(...this._getDirtyRangesByCellValue(e, a, r)), o.push(...this._getDirtyRangesForArrayFormula(e, a, r)), o;
  }
  _getRemoveRowOrColumnMutation(n, e = !0) {
    const { subUnitId: a, unitId: i, range: r } = n, o = [], u = this._univerInstanceService.getUniverSheetInstance(i), f = u == null ? void 0 : u.getSheetBySheetId(a), m = (f == null ? void 0 : f.getRowCount()) || 0, c = (f == null ? void 0 : f.getColumnCount()) || 0;
    let l = null;
    const { startRow: p, endRow: T, startColumn: L, endColumn: I } = r;
    e === !0 ? l = this._rangeToMatrix({
      startRow: p,
      startColumn: 0,
      endRow: T,
      endColumn: c - 1
    }) : l = this._rangeToMatrix({
      startRow: 0,
      startColumn: L,
      endRow: m,
      endColumn: I
    });
    const A = l.getData();
    return o.push(...this._getDirtyRangesByCellValue(i, a, A)), o.push(...this._getDirtyRangesForArrayFormula(i, a, A)), o;
  }
  _getHideRowMutation(n) {
    const { subUnitId: e, unitId: a, ranges: i } = n, r = [];
    return i.forEach((o) => {
      const u = this._rangeToMatrix(o).getMatrix();
      r.push(...this._getDirtyRangesByCellValue(a, e, u));
    }), r;
  }
  _getRemoveSheetMutation(n) {
    const e = {}, { subUnitId: a, unitId: i, subUnitName: r } = n;
    return e[i] == null && (e[i] = {}), e[i][a] = r, e;
  }
  _getInsertSheetMutation(n) {
    const e = {}, { sheet: a, unitId: i } = n;
    return e[i] == null && (e[i] = {}), e[i][a.id] = a.name, e;
  }
  _rangeToMatrix(n) {
    const e = new v(), { startRow: a, startColumn: i, endRow: r, endColumn: o } = n;
    for (let u = a; u <= r; u++)
      for (let f = i; f <= o; f++)
        e.setValue(u, f, {});
    return e;
  }
  _getDirtyRangesByCellValue(n, e, a) {
    const i = [];
    return a == null || new v(a).getDiscreteRanges().forEach((u) => {
      i.push({ unitId: n, sheetId: e, range: u });
    }), i;
  }
  /**
   * The array formula is a range where only the top-left corner contains the formula value.
   * All other positions, apart from the top-left corner, need to be marked as dirty.
   */
  _getDirtyRangesForArrayFormula(n, e, a) {
    var u, f;
    const i = [];
    if (a == null)
      return i;
    const r = new v(a), o = this._formulaDataModel.getArrayFormulaRange();
    if ((u = o == null ? void 0 : o[n]) != null && u[e]) {
      const m = new v((f = o == null ? void 0 : o[n]) == null ? void 0 : f[e]);
      r.forValue((c, l) => {
        m.forValue((p, T, L) => {
          if (L == null)
            return !0;
          const { startRow: I, startColumn: A, endRow: N, endColumn: d } = L;
          c >= I && c <= N && l >= A && l <= d && i.push({
            unitId: n,
            sheetId: e,
            range: {
              startRow: I,
              startColumn: A,
              endRow: I,
              endColumn: A
            }
          });
        });
      });
    }
    return i;
  }
};
nt = Rr([
  _t(0, Qt),
  _t(1, Ee),
  _t(2, H(qe))
], nt);
var Sr = Object.getOwnPropertyDescriptor, Ar = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Sr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, Le = (n, e) => (a, i) => e(a, i, n);
let it = class extends z {
  constructor(n, e, a, i, r, o, u) {
    super(), this._commandService = n, this._configService = e, this._sheetInterceptorService = a, this._formulaDataModel = i, this._lexerTreeBuilder = r, this._functionService = o, this._definedNamesService = u, this._initialize();
  }
  _initialize() {
    this._commandExecutedListener(), this._initInterceptorCellContent();
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((n) => {
        var a;
        const e = (a = this._configService.getConfig(Ue)) == null ? void 0 : a.writeArrayFormulaToSnapshot;
        if (n.id === Bt.id) {
          const i = n.params;
          if (i == null)
            return;
          const { arrayFormulaRange: r, arrayFormulaCellData: o, arrayFormulaEmbedded: u } = i;
          this._formulaDataModel.setArrayFormulaRange(r), this._formulaDataModel.setArrayFormulaCellData(o), e && this._writeArrayFormulaToSnapshot(r, o, u);
        } else n.id === wa.id && e && (this._addPrefixToFunctionSnapshot(), this._addPrefixToDefinedNamesFunctionSnapshot());
      })
    );
  }
  _addPrefixToDefinedNamesFunctionSnapshot() {
    const n = this._definedNamesService.getAllDefinedNames();
    Object.entries(n).forEach(([e, a]) => {
      a && Array.from(Object.entries(a)).forEach(([i, r]) => {
        const { formulaOrRefString: o } = r;
        if (o.substring(0, 1) === "=") {
          const u = this._lexerTreeBuilder.getNewFormulaWithPrefix(o, this._functionService.hasExecutor.bind(this._functionService));
          u && this._commandService.executeCommand(De.id, {
            ...r,
            unitId: e,
            formulaOrRefStringWithPrefix: u
          }, {
            onlyLocal: !0,
            fromFormula: !0
          });
        }
      });
    });
  }
  _addPrefixToFunctionSnapshot() {
    const n = this._formulaDataModel.getFormulaData(), e = /* @__PURE__ */ new Map();
    Object.entries(n).forEach(([a, i]) => {
      i && Array.from(Object.entries(i)).forEach(([r, o]) => {
        if (!o)
          return;
        const u = new v();
        new v(o).forValue((m, c, l) => {
          const p = l == null ? void 0 : l.f;
          if ((l == null ? void 0 : l.x) != null || !p || p.length === 0)
            return;
          if (e.has(p)) {
            const L = e.get(p);
            u.setValue(m, c, { xf: L });
            return;
          }
          const T = this._lexerTreeBuilder.getNewFormulaWithPrefix(p, this._functionService.hasExecutor.bind(this._functionService));
          T && (u.setValue(m, c, { xf: T }), e.set(p, T));
        }), this._commandService.executeCommand(Q.id, {
          unitId: a,
          subUnitId: r,
          cellValue: u.getMatrix()
        }, {
          onlyLocal: !0,
          fromFormula: !0
        });
      });
    }), e.clear();
  }
  _writeArrayFormulaToSnapshot(n, e, a) {
    n && Object.entries(n).forEach(([i, r]) => {
      r && Array.from(Object.entries(r)).forEach(([o, u]) => {
        const f = new v();
        new v(u).forValue((c, l, p) => {
          f.setValue(c, l, { ref: Ce(p) });
        }), this._commandService.executeCommand(Q.id, {
          unitId: i,
          subUnitId: o,
          cellValue: f.getMatrix()
        }, {
          onlyLocal: !0,
          fromFormula: !0
        });
      });
    }), a && Object.entries(a).forEach(([i, r]) => {
      r && Array.from(Object.entries(r)).forEach(([o, u]) => {
        const f = new v();
        new v(u).forValue((c, l) => {
          var T, L, I;
          (I = (L = (T = n == null ? void 0 : n[i]) == null ? void 0 : T[o]) == null ? void 0 : L[c]) != null && I[l] || f.setValue(c, l, {
            ref: Ce({
              startRow: c,
              endRow: c,
              startColumn: l,
              endColumn: l
            })
          });
        }), this._commandService.executeCommand(Q.id, {
          unitId: i,
          subUnitId: o,
          cellValue: f.getMatrix()
        }, {
          onlyLocal: !0,
          fromFormula: !0
        });
      });
    }), e && Object.entries(e).forEach(([i, r]) => {
      r && Array.from(Object.entries(r)).forEach(([o, u]) => {
        this._commandService.executeCommand(Q.id, {
          unitId: i,
          subUnitId: o,
          cellValue: u
        }, {
          onlyLocal: !0,
          fromFormula: !0
        });
      });
    });
  }
  _initInterceptorCellContent() {
    this.disposeWithMe(
      this._sheetInterceptorService.intercept(Da.CELL_CONTENT, {
        priority: 100,
        effect: ht.Value,
        handler: (n, e, a) => {
          var l, p, T;
          let i = n;
          const { unitId: r, subUnitId: o, row: u, col: f } = e, m = this._formulaDataModel.getArrayFormulaCellData(), c = (T = (p = (l = m == null ? void 0 : m[r]) == null ? void 0 : l[o]) == null ? void 0 : p[u]) == null ? void 0 : T[f];
          return c == null ? a(i) : ((!i || i === e.rawData) && (i = { ...e.rawData }), c.v == null && c.t == null ? (i.v = 0, i.t = gt.NUMBER, a(i)) : (i == null ? void 0 : i.t) === gt.NUMBER && i.v !== void 0 && i.v !== null && Ln(i.v) ? (i.v = Xn(Number(i.v)), a(i)) : (i.v = c.v, i.t = c.t, a(i)));
        }
      })
    );
  }
};
it = Ar([
  Le(0, re),
  Le(1, be),
  Le(2, H(dt)),
  Le(3, H(qe)),
  Le(4, H(Pt)),
  Le(5, Tt),
  Le(6, Lt)
], it);
const Cr = [
  {
    functionName: la.ARRAY_CONSTRAIN,
    functionType: t.Array,
    description: "formula.functionList.ARRAY_CONSTRAIN.description",
    abstract: "formula.functionList.ARRAY_CONSTRAIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.inputRange.name",
        detail: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.inputRange.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.numRows.name",
        detail: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.numRows.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.numCols.name",
        detail: "formula.functionList.ARRAY_CONSTRAIN.functionParameter.numCols.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: la.FLATTEN,
    functionType: t.Array,
    description: "formula.functionList.FLATTEN.description",
    abstract: "formula.functionList.FLATTEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FLATTEN.functionParameter.range1.name",
        detail: "formula.functionList.FLATTEN.functionParameter.range1.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FLATTEN.functionParameter.range2.name",
        detail: "formula.functionList.FLATTEN.functionParameter.range2.detail",
        example: "D1:F3",
        require: 0,
        repeat: 1
      }
    ]
  }
], Dr = [
  {
    functionName: _.BETADIST,
    functionType: t.Compatibility,
    description: "formula.functionList.BETADIST.description",
    abstract: "formula.functionList.BETADIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BETADIST.functionParameter.x.name",
        detail: "formula.functionList.BETADIST.functionParameter.x.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETADIST.functionParameter.alpha.name",
        detail: "formula.functionList.BETADIST.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETADIST.functionParameter.beta.name",
        detail: "formula.functionList.BETADIST.functionParameter.beta.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETADIST.functionParameter.A.name",
        detail: "formula.functionList.BETADIST.functionParameter.A.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.BETADIST.functionParameter.B.name",
        detail: "formula.functionList.BETADIST.functionParameter.B.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.BETAINV,
    functionType: t.Compatibility,
    description: "formula.functionList.BETAINV.description",
    abstract: "formula.functionList.BETAINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BETAINV.functionParameter.probability.name",
        detail: "formula.functionList.BETAINV.functionParameter.probability.detail",
        example: "0.685470581",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETAINV.functionParameter.alpha.name",
        detail: "formula.functionList.BETAINV.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETAINV.functionParameter.beta.name",
        detail: "formula.functionList.BETAINV.functionParameter.beta.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETAINV.functionParameter.A.name",
        detail: "formula.functionList.BETAINV.functionParameter.A.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.BETAINV.functionParameter.B.name",
        detail: "formula.functionList.BETAINV.functionParameter.B.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.BINOMDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.BINOMDIST.description",
    abstract: "formula.functionList.BINOMDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BINOMDIST.functionParameter.numberS.name",
        detail: "formula.functionList.BINOMDIST.functionParameter.numberS.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOMDIST.functionParameter.trials.name",
        detail: "formula.functionList.BINOMDIST.functionParameter.trials.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOMDIST.functionParameter.probabilityS.name",
        detail: "formula.functionList.BINOMDIST.functionParameter.probabilityS.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOMDIST.functionParameter.cumulative.name",
        detail: "formula.functionList.BINOMDIST.functionParameter.cumulative.detail",
        example: "false",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.CHIDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.CHIDIST.description",
    abstract: "formula.functionList.CHIDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHIDIST.functionParameter.x.name",
        detail: "formula.functionList.CHIDIST.functionParameter.x.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHIDIST.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHIDIST.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.CHIINV,
    functionType: t.Compatibility,
    description: "formula.functionList.CHIINV.description",
    abstract: "formula.functionList.CHIINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHIINV.functionParameter.probability.name",
        detail: "formula.functionList.CHIINV.functionParameter.probability.detail",
        example: "0.93",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHIINV.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHIINV.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.CHITEST,
    functionType: t.Compatibility,
    description: "formula.functionList.CHITEST.description",
    abstract: "formula.functionList.CHITEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHITEST.functionParameter.actualRange.name",
        detail: "formula.functionList.CHITEST.functionParameter.actualRange.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHITEST.functionParameter.expectedRange.name",
        detail: "formula.functionList.CHITEST.functionParameter.expectedRange.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.CONFIDENCE,
    functionType: t.Compatibility,
    description: "formula.functionList.CONFIDENCE.description",
    abstract: "formula.functionList.CONFIDENCE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONFIDENCE.functionParameter.alpha.name",
        detail: "formula.functionList.CONFIDENCE.functionParameter.alpha.detail",
        example: "0.05",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE.functionParameter.standardDev.name",
        detail: "formula.functionList.CONFIDENCE.functionParameter.standardDev.detail",
        example: "2.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE.functionParameter.size.name",
        detail: "formula.functionList.CONFIDENCE.functionParameter.size.detail",
        example: "50",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.COVAR,
    functionType: t.Compatibility,
    description: "formula.functionList.COVAR.description",
    abstract: "formula.functionList.COVAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COVAR.functionParameter.array1.name",
        detail: "formula.functionList.COVAR.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COVAR.functionParameter.array2.name",
        detail: "formula.functionList.COVAR.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.CRITBINOM,
    functionType: t.Compatibility,
    description: "formula.functionList.CRITBINOM.description",
    abstract: "formula.functionList.CRITBINOM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CRITBINOM.functionParameter.trials.name",
        detail: "formula.functionList.CRITBINOM.functionParameter.trials.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CRITBINOM.functionParameter.probabilityS.name",
        detail: "formula.functionList.CRITBINOM.functionParameter.probabilityS.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CRITBINOM.functionParameter.alpha.name",
        detail: "formula.functionList.CRITBINOM.functionParameter.alpha.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.EXPONDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.EXPONDIST.description",
    abstract: "formula.functionList.EXPONDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EXPONDIST.functionParameter.x.name",
        detail: "formula.functionList.EXPONDIST.functionParameter.x.detail",
        example: "0.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPONDIST.functionParameter.lambda.name",
        detail: "formula.functionList.EXPONDIST.functionParameter.lambda.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPONDIST.functionParameter.cumulative.name",
        detail: "formula.functionList.EXPONDIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.FDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.FDIST.description",
    abstract: "formula.functionList.FDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FDIST.functionParameter.x.name",
        detail: "formula.functionList.FDIST.functionParameter.x.detail",
        example: "15.2069",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FDIST.functionParameter.degFreedom1.name",
        detail: "formula.functionList.FDIST.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FDIST.functionParameter.degFreedom2.name",
        detail: "formula.functionList.FDIST.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.FINV,
    functionType: t.Compatibility,
    description: "formula.functionList.FINV.description",
    abstract: "formula.functionList.FINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FINV.functionParameter.probability.name",
        detail: "formula.functionList.FINV.functionParameter.probability.detail",
        example: "0.01",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FINV.functionParameter.degFreedom1.name",
        detail: "formula.functionList.FINV.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FINV.functionParameter.degFreedom2.name",
        detail: "formula.functionList.FINV.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.FTEST,
    functionType: t.Compatibility,
    description: "formula.functionList.FTEST.description",
    abstract: "formula.functionList.FTEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FTEST.functionParameter.array1.name",
        detail: "formula.functionList.FTEST.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FTEST.functionParameter.array2.name",
        detail: "formula.functionList.FTEST.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.GAMMADIST,
    functionType: t.Compatibility,
    description: "formula.functionList.GAMMADIST.description",
    abstract: "formula.functionList.GAMMADIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMADIST.functionParameter.x.name",
        detail: "formula.functionList.GAMMADIST.functionParameter.x.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMADIST.functionParameter.alpha.name",
        detail: "formula.functionList.GAMMADIST.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMADIST.functionParameter.beta.name",
        detail: "formula.functionList.GAMMADIST.functionParameter.beta.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMADIST.functionParameter.cumulative.name",
        detail: "formula.functionList.GAMMADIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.GAMMAINV,
    functionType: t.Compatibility,
    description: "formula.functionList.GAMMAINV.description",
    abstract: "formula.functionList.GAMMAINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMAINV.functionParameter.probability.name",
        detail: "formula.functionList.GAMMAINV.functionParameter.probability.detail",
        example: "0.068094",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMAINV.functionParameter.alpha.name",
        detail: "formula.functionList.GAMMAINV.functionParameter.alpha.detail",
        example: "9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMAINV.functionParameter.beta.name",
        detail: "formula.functionList.GAMMAINV.functionParameter.beta.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.HYPGEOMDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.HYPGEOMDIST.description",
    abstract: "formula.functionList.HYPGEOMDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HYPGEOMDIST.functionParameter.sampleS.name",
        detail: "formula.functionList.HYPGEOMDIST.functionParameter.sampleS.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOMDIST.functionParameter.numberSample.name",
        detail: "formula.functionList.HYPGEOMDIST.functionParameter.numberSample.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOMDIST.functionParameter.populationS.name",
        detail: "formula.functionList.HYPGEOMDIST.functionParameter.populationS.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOMDIST.functionParameter.numberPop.name",
        detail: "formula.functionList.HYPGEOMDIST.functionParameter.numberPop.detail",
        example: "20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.LOGINV,
    functionType: t.Compatibility,
    description: "formula.functionList.LOGINV.description",
    abstract: "formula.functionList.LOGINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOGINV.functionParameter.probability.name",
        detail: "formula.functionList.LOGINV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGINV.functionParameter.mean.name",
        detail: "formula.functionList.LOGINV.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGINV.functionParameter.standardDev.name",
        detail: "formula.functionList.LOGINV.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.LOGNORMDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.LOGNORMDIST.description",
    abstract: "formula.functionList.LOGNORMDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOGNORMDIST.functionParameter.x.name",
        detail: "formula.functionList.LOGNORMDIST.functionParameter.x.detail",
        example: "42",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORMDIST.functionParameter.mean.name",
        detail: "formula.functionList.LOGNORMDIST.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORMDIST.functionParameter.standardDev.name",
        detail: "formula.functionList.LOGNORMDIST.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.MODE,
    functionType: t.Compatibility,
    description: "formula.functionList.MODE.description",
    abstract: "formula.functionList.MODE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MODE.functionParameter.number1.name",
        detail: "formula.functionList.MODE.functionParameter.number1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MODE.functionParameter.number2.name",
        detail: "formula.functionList.MODE.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: _.NEGBINOMDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.NEGBINOMDIST.description",
    abstract: "formula.functionList.NEGBINOMDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NEGBINOMDIST.functionParameter.numberF.name",
        detail: "formula.functionList.NEGBINOMDIST.functionParameter.numberF.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NEGBINOMDIST.functionParameter.numberS.name",
        detail: "formula.functionList.NEGBINOMDIST.functionParameter.numberS.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NEGBINOMDIST.functionParameter.probabilityS.name",
        detail: "formula.functionList.NEGBINOMDIST.functionParameter.probabilityS.detail",
        example: "0.25",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.NORMDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.NORMDIST.description",
    abstract: "formula.functionList.NORMDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORMDIST.functionParameter.x.name",
        detail: "formula.functionList.NORMDIST.functionParameter.x.detail",
        example: "42",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORMDIST.functionParameter.mean.name",
        detail: "formula.functionList.NORMDIST.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORMDIST.functionParameter.standardDev.name",
        detail: "formula.functionList.NORMDIST.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORMDIST.functionParameter.cumulative.name",
        detail: "formula.functionList.NORMDIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.NORMINV,
    functionType: t.Compatibility,
    description: "formula.functionList.NORMINV.description",
    abstract: "formula.functionList.NORMINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORMINV.functionParameter.probability.name",
        detail: "formula.functionList.NORMINV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORMINV.functionParameter.mean.name",
        detail: "formula.functionList.NORMINV.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORMINV.functionParameter.standardDev.name",
        detail: "formula.functionList.NORMINV.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.NORMSDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.NORMSDIST.description",
    abstract: "formula.functionList.NORMSDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORMSDIST.functionParameter.z.name",
        detail: "formula.functionList.NORMSDIST.functionParameter.z.detail",
        example: "1.333333",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.NORMSINV,
    functionType: t.Compatibility,
    description: "formula.functionList.NORMSINV.description",
    abstract: "formula.functionList.NORMSINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORMSINV.functionParameter.probability.name",
        detail: "formula.functionList.NORMSINV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.PERCENTILE,
    functionType: t.Compatibility,
    description: "formula.functionList.PERCENTILE.description",
    abstract: "formula.functionList.PERCENTILE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTILE.functionParameter.array.name",
        detail: "formula.functionList.PERCENTILE.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTILE.functionParameter.k.name",
        detail: "formula.functionList.PERCENTILE.functionParameter.k.detail",
        example: "0.3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.PERCENTRANK,
    functionType: t.Compatibility,
    description: "formula.functionList.PERCENTRANK.description",
    abstract: "formula.functionList.PERCENTRANK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTRANK.functionParameter.array.name",
        detail: "formula.functionList.PERCENTRANK.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK.functionParameter.x.name",
        detail: "formula.functionList.PERCENTRANK.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK.functionParameter.significance.name",
        detail: "formula.functionList.PERCENTRANK.functionParameter.significance.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.POISSON,
    functionType: t.Compatibility,
    description: "formula.functionList.POISSON.description",
    abstract: "formula.functionList.POISSON.abstract",
    functionParameter: [
      {
        name: "formula.functionList.POISSON.functionParameter.x.name",
        detail: "formula.functionList.POISSON.functionParameter.x.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.POISSON.functionParameter.mean.name",
        detail: "formula.functionList.POISSON.functionParameter.mean.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.POISSON.functionParameter.cumulative.name",
        detail: "formula.functionList.POISSON.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.QUARTILE,
    functionType: t.Compatibility,
    description: "formula.functionList.QUARTILE.description",
    abstract: "formula.functionList.QUARTILE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.QUARTILE.functionParameter.array.name",
        detail: "formula.functionList.QUARTILE.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.QUARTILE.functionParameter.quart.name",
        detail: "formula.functionList.QUARTILE.functionParameter.quart.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.RANK,
    functionType: t.Compatibility,
    description: "formula.functionList.RANK.description",
    abstract: "formula.functionList.RANK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RANK.functionParameter.number.name",
        detail: "formula.functionList.RANK.functionParameter.number.detail",
        example: "A3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK.functionParameter.ref.name",
        detail: "formula.functionList.RANK.functionParameter.ref.detail",
        example: "A2:A6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK.functionParameter.order.name",
        detail: "formula.functionList.RANK.functionParameter.order.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.STDEV,
    functionType: t.Compatibility,
    description: "formula.functionList.STDEV.description",
    abstract: "formula.functionList.STDEV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEV.functionParameter.number1.name",
        detail: "formula.functionList.STDEV.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEV.functionParameter.number2.name",
        detail: "formula.functionList.STDEV.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: _.STDEVP,
    functionType: t.Compatibility,
    description: "formula.functionList.STDEVP.description",
    abstract: "formula.functionList.STDEVP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEVP.functionParameter.number1.name",
        detail: "formula.functionList.STDEVP.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEVP.functionParameter.number2.name",
        detail: "formula.functionList.STDEVP.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: _.TDIST,
    functionType: t.Compatibility,
    description: "formula.functionList.TDIST.description",
    abstract: "formula.functionList.TDIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TDIST.functionParameter.x.name",
        detail: "formula.functionList.TDIST.functionParameter.x.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TDIST.functionParameter.degFreedom.name",
        detail: "formula.functionList.TDIST.functionParameter.degFreedom.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TDIST.functionParameter.tails.name",
        detail: "formula.functionList.TDIST.functionParameter.tails.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.TINV,
    functionType: t.Compatibility,
    description: "formula.functionList.TINV.description",
    abstract: "formula.functionList.TINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TINV.functionParameter.probability.name",
        detail: "formula.functionList.TINV.functionParameter.probability.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TINV.functionParameter.degFreedom.name",
        detail: "formula.functionList.TINV.functionParameter.degFreedom.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.TTEST,
    functionType: t.Compatibility,
    description: "formula.functionList.TTEST.description",
    abstract: "formula.functionList.TTEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TTEST.functionParameter.array1.name",
        detail: "formula.functionList.TTEST.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TTEST.functionParameter.array2.name",
        detail: "formula.functionList.TTEST.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TTEST.functionParameter.tails.name",
        detail: "formula.functionList.TTEST.functionParameter.tails.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TTEST.functionParameter.type.name",
        detail: "formula.functionList.TTEST.functionParameter.type.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.VAR,
    functionType: t.Compatibility,
    description: "formula.functionList.VAR.description",
    abstract: "formula.functionList.VAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VAR.functionParameter.number1.name",
        detail: "formula.functionList.VAR.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VAR.functionParameter.number2.name",
        detail: "formula.functionList.VAR.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: _.VARP,
    functionType: t.Compatibility,
    description: "formula.functionList.VARP.description",
    abstract: "formula.functionList.VARP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VARP.functionParameter.number1.name",
        detail: "formula.functionList.VARP.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VARP.functionParameter.number2.name",
        detail: "formula.functionList.VARP.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: _.WEIBULL,
    functionType: t.Compatibility,
    description: "formula.functionList.WEIBULL.description",
    abstract: "formula.functionList.WEIBULL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WEIBULL.functionParameter.x.name",
        detail: "formula.functionList.WEIBULL.functionParameter.x.detail",
        example: "105",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL.functionParameter.alpha.name",
        detail: "formula.functionList.WEIBULL.functionParameter.alpha.detail",
        example: "20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL.functionParameter.beta.name",
        detail: "formula.functionList.WEIBULL.functionParameter.beta.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL.functionParameter.cumulative.name",
        detail: "formula.functionList.WEIBULL.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: _.ZTEST,
    functionType: t.Compatibility,
    description: "formula.functionList.ZTEST.description",
    abstract: "formula.functionList.ZTEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ZTEST.functionParameter.array.name",
        detail: "formula.functionList.ZTEST.functionParameter.array.detail",
        example: "A2:A11",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ZTEST.functionParameter.x.name",
        detail: "formula.functionList.ZTEST.functionParameter.x.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ZTEST.functionParameter.sigma.name",
        detail: "formula.functionList.ZTEST.functionParameter.sigma.detail",
        example: "10",
        require: 0,
        repeat: 0
      }
    ]
  }
], br = [
  {
    functionName: de.CUBEKPIMEMBER,
    functionType: t.Cube,
    description: "formula.functionList.CUBEKPIMEMBER.description",
    abstract: "formula.functionList.CUBEKPIMEMBER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBEKPIMEMBER.functionParameter.number1.name",
        detail: "formula.functionList.CUBEKPIMEMBER.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBEKPIMEMBER.functionParameter.number2.name",
        detail: "formula.functionList.CUBEKPIMEMBER.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBEMEMBER,
    functionType: t.Cube,
    description: "formula.functionList.CUBEMEMBER.description",
    abstract: "formula.functionList.CUBEMEMBER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBEMEMBER.functionParameter.number1.name",
        detail: "formula.functionList.CUBEMEMBER.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBEMEMBER.functionParameter.number2.name",
        detail: "formula.functionList.CUBEMEMBER.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBEMEMBERPROPERTY,
    functionType: t.Cube,
    description: "formula.functionList.CUBEMEMBERPROPERTY.description",
    abstract: "formula.functionList.CUBEMEMBERPROPERTY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBEMEMBERPROPERTY.functionParameter.number1.name",
        detail: "formula.functionList.CUBEMEMBERPROPERTY.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBEMEMBERPROPERTY.functionParameter.number2.name",
        detail: "formula.functionList.CUBEMEMBERPROPERTY.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBERANKEDMEMBER,
    functionType: t.Cube,
    description: "formula.functionList.CUBERANKEDMEMBER.description",
    abstract: "formula.functionList.CUBERANKEDMEMBER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBERANKEDMEMBER.functionParameter.number1.name",
        detail: "formula.functionList.CUBERANKEDMEMBER.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBERANKEDMEMBER.functionParameter.number2.name",
        detail: "formula.functionList.CUBERANKEDMEMBER.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBESET,
    functionType: t.Cube,
    description: "formula.functionList.CUBESET.description",
    abstract: "formula.functionList.CUBESET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBESET.functionParameter.number1.name",
        detail: "formula.functionList.CUBESET.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBESET.functionParameter.number2.name",
        detail: "formula.functionList.CUBESET.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBESETCOUNT,
    functionType: t.Cube,
    description: "formula.functionList.CUBESETCOUNT.description",
    abstract: "formula.functionList.CUBESETCOUNT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBESETCOUNT.functionParameter.number1.name",
        detail: "formula.functionList.CUBESETCOUNT.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBESETCOUNT.functionParameter.number2.name",
        detail: "formula.functionList.CUBESETCOUNT.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: de.CUBEVALUE,
    functionType: t.Cube,
    description: "formula.functionList.CUBEVALUE.description",
    abstract: "formula.functionList.CUBEVALUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUBEVALUE.functionParameter.number1.name",
        detail: "formula.functionList.CUBEVALUE.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUBEVALUE.functionParameter.number2.name",
        detail: "formula.functionList.CUBEVALUE.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  }
], Or = [
  {
    functionName: $.DAVERAGE,
    functionType: t.Database,
    description: "formula.functionList.DAVERAGE.description",
    abstract: "formula.functionList.DAVERAGE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DAVERAGE.functionParameter.database.name",
        detail: "formula.functionList.DAVERAGE.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DAVERAGE.functionParameter.field.name",
        detail: "formula.functionList.DAVERAGE.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DAVERAGE.functionParameter.criteria.name",
        detail: "formula.functionList.DAVERAGE.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DCOUNT,
    functionType: t.Database,
    description: "formula.functionList.DCOUNT.description",
    abstract: "formula.functionList.DCOUNT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DCOUNT.functionParameter.database.name",
        detail: "formula.functionList.DCOUNT.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DCOUNT.functionParameter.field.name",
        detail: "formula.functionList.DCOUNT.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DCOUNT.functionParameter.criteria.name",
        detail: "formula.functionList.DCOUNT.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DCOUNTA,
    functionType: t.Database,
    description: "formula.functionList.DCOUNTA.description",
    abstract: "formula.functionList.DCOUNTA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DCOUNTA.functionParameter.database.name",
        detail: "formula.functionList.DCOUNTA.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DCOUNTA.functionParameter.field.name",
        detail: "formula.functionList.DCOUNTA.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DCOUNTA.functionParameter.criteria.name",
        detail: "formula.functionList.DCOUNTA.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DGET,
    functionType: t.Database,
    description: "formula.functionList.DGET.description",
    abstract: "formula.functionList.DGET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DGET.functionParameter.database.name",
        detail: "formula.functionList.DGET.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DGET.functionParameter.field.name",
        detail: "formula.functionList.DGET.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DGET.functionParameter.criteria.name",
        detail: "formula.functionList.DGET.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DMAX,
    functionType: t.Database,
    description: "formula.functionList.DMAX.description",
    abstract: "formula.functionList.DMAX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DMAX.functionParameter.database.name",
        detail: "formula.functionList.DMAX.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DMAX.functionParameter.field.name",
        detail: "formula.functionList.DMAX.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DMAX.functionParameter.criteria.name",
        detail: "formula.functionList.DMAX.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DMIN,
    functionType: t.Database,
    description: "formula.functionList.DMIN.description",
    abstract: "formula.functionList.DMIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DMIN.functionParameter.database.name",
        detail: "formula.functionList.DMIN.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DMIN.functionParameter.field.name",
        detail: "formula.functionList.DMIN.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DMIN.functionParameter.criteria.name",
        detail: "formula.functionList.DMIN.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DPRODUCT,
    functionType: t.Database,
    description: "formula.functionList.DPRODUCT.description",
    abstract: "formula.functionList.DPRODUCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DPRODUCT.functionParameter.database.name",
        detail: "formula.functionList.DPRODUCT.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DPRODUCT.functionParameter.field.name",
        detail: "formula.functionList.DPRODUCT.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DPRODUCT.functionParameter.criteria.name",
        detail: "formula.functionList.DPRODUCT.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DSTDEV,
    functionType: t.Database,
    description: "formula.functionList.DSTDEV.description",
    abstract: "formula.functionList.DSTDEV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DSTDEV.functionParameter.database.name",
        detail: "formula.functionList.DSTDEV.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSTDEV.functionParameter.field.name",
        detail: "formula.functionList.DSTDEV.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSTDEV.functionParameter.criteria.name",
        detail: "formula.functionList.DSTDEV.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DSTDEVP,
    functionType: t.Database,
    description: "formula.functionList.DSTDEVP.description",
    abstract: "formula.functionList.DSTDEVP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DSTDEVP.functionParameter.database.name",
        detail: "formula.functionList.DSTDEVP.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSTDEVP.functionParameter.field.name",
        detail: "formula.functionList.DSTDEVP.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSTDEVP.functionParameter.criteria.name",
        detail: "formula.functionList.DSTDEVP.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DSUM,
    functionType: t.Database,
    description: "formula.functionList.DSUM.description",
    abstract: "formula.functionList.DSUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DSUM.functionParameter.database.name",
        detail: "formula.functionList.DSUM.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSUM.functionParameter.field.name",
        detail: "formula.functionList.DSUM.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DSUM.functionParameter.criteria.name",
        detail: "formula.functionList.DSUM.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DVAR,
    functionType: t.Database,
    description: "formula.functionList.DVAR.description",
    abstract: "formula.functionList.DVAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DVAR.functionParameter.database.name",
        detail: "formula.functionList.DVAR.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DVAR.functionParameter.field.name",
        detail: "formula.functionList.DVAR.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DVAR.functionParameter.criteria.name",
        detail: "formula.functionList.DVAR.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: $.DVARP,
    functionType: t.Database,
    description: "formula.functionList.DVARP.description",
    abstract: "formula.functionList.DVARP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DVARP.functionParameter.database.name",
        detail: "formula.functionList.DVARP.functionParameter.database.detail",
        example: "A4:E10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DVARP.functionParameter.field.name",
        detail: "formula.functionList.DVARP.functionParameter.field.detail",
        example: "D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DVARP.functionParameter.criteria.name",
        detail: "formula.functionList.DVARP.functionParameter.criteria.detail",
        example: "A1:B2",
        require: 1,
        repeat: 0
      }
    ]
  }
], Mr = [
  {
    functionName: V.DATE,
    functionType: t.Date,
    description: "formula.functionList.DATE.description",
    abstract: "formula.functionList.DATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DATE.functionParameter.year.name",
        detail: "formula.functionList.DATE.functionParameter.year.detail",
        example: "2024",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DATE.functionParameter.month.name",
        detail: "formula.functionList.DATE.functionParameter.month.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DATE.functionParameter.day.name",
        detail: "formula.functionList.DATE.functionParameter.day.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.DATEDIF,
    functionType: t.Date,
    description: "formula.functionList.DATEDIF.description",
    abstract: "formula.functionList.DATEDIF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DATEDIF.functionParameter.startDate.name",
        detail: "formula.functionList.DATEDIF.functionParameter.startDate.detail",
        example: '"2001-6-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DATEDIF.functionParameter.endDate.name",
        detail: "formula.functionList.DATEDIF.functionParameter.endDate.detail",
        example: '"2002-8-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DATEDIF.functionParameter.method.name",
        detail: "formula.functionList.DATEDIF.functionParameter.method.detail",
        example: '"D"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.DATEVALUE,
    functionType: t.Date,
    description: "formula.functionList.DATEVALUE.description",
    abstract: "formula.functionList.DATEVALUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DATEVALUE.functionParameter.dateText.name",
        detail: "formula.functionList.DATEVALUE.functionParameter.dateText.detail",
        example: '"2024-8-8"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.DAY,
    functionType: t.Date,
    description: "formula.functionList.DAY.description",
    abstract: "formula.functionList.DAY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DAY.functionParameter.serialNumber.name",
        detail: "formula.functionList.DAY.functionParameter.serialNumber.detail",
        example: '"1969-7-20"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.DAYS,
    functionType: t.Date,
    description: "formula.functionList.DAYS.description",
    abstract: "formula.functionList.DAYS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DAYS.functionParameter.endDate.name",
        detail: "formula.functionList.DAYS.functionParameter.endDate.detail",
        example: '"2021-12-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DAYS.functionParameter.startDate.name",
        detail: "formula.functionList.DAYS.functionParameter.startDate.detail",
        example: '"2021-1-1"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.DAYS360,
    functionType: t.Date,
    description: "formula.functionList.DAYS360.description",
    abstract: "formula.functionList.DAYS360.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DAYS360.functionParameter.startDate.name",
        detail: "formula.functionList.DAYS360.functionParameter.startDate.detail",
        example: '"2021-1-29"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DAYS360.functionParameter.endDate.name",
        detail: "formula.functionList.DAYS360.functionParameter.endDate.detail",
        example: '"2021-3-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DAYS360.functionParameter.method.name",
        detail: "formula.functionList.DAYS360.functionParameter.method.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.EDATE,
    functionType: t.Date,
    description: "formula.functionList.EDATE.description",
    abstract: "formula.functionList.EDATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EDATE.functionParameter.startDate.name",
        detail: "formula.functionList.EDATE.functionParameter.startDate.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EDATE.functionParameter.months.name",
        detail: "formula.functionList.EDATE.functionParameter.months.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.EOMONTH,
    functionType: t.Date,
    description: "formula.functionList.EOMONTH.description",
    abstract: "formula.functionList.EOMONTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EOMONTH.functionParameter.startDate.name",
        detail: "formula.functionList.EOMONTH.functionParameter.startDate.detail",
        example: '"2011-1-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EOMONTH.functionParameter.months.name",
        detail: "formula.functionList.EOMONTH.functionParameter.months.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.EPOCHTODATE,
    functionType: t.Date,
    description: "formula.functionList.EPOCHTODATE.description",
    abstract: "formula.functionList.EPOCHTODATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EPOCHTODATE.functionParameter.timestamp.name",
        detail: "formula.functionList.EPOCHTODATE.functionParameter.timestamp.detail",
        example: "1655906710",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EPOCHTODATE.functionParameter.unit.name",
        detail: "formula.functionList.EPOCHTODATE.functionParameter.unit.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.HOUR,
    functionType: t.Date,
    description: "formula.functionList.HOUR.description",
    abstract: "formula.functionList.HOUR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HOUR.functionParameter.serialNumber.name",
        detail: "formula.functionList.HOUR.functionParameter.serialNumber.detail",
        example: '"2011-7-18 7:45"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.ISOWEEKNUM,
    functionType: t.Date,
    description: "formula.functionList.ISOWEEKNUM.description",
    abstract: "formula.functionList.ISOWEEKNUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISOWEEKNUM.functionParameter.date.name",
        detail: "formula.functionList.ISOWEEKNUM.functionParameter.date.detail",
        example: '"2012-3-9"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.MINUTE,
    functionType: t.Date,
    description: "formula.functionList.MINUTE.description",
    abstract: "formula.functionList.MINUTE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MINUTE.functionParameter.serialNumber.name",
        detail: "formula.functionList.MINUTE.functionParameter.serialNumber.detail",
        example: '"12:45"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.MONTH,
    functionType: t.Date,
    description: "formula.functionList.MONTH.description",
    abstract: "formula.functionList.MONTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MONTH.functionParameter.serialNumber.name",
        detail: "formula.functionList.MONTH.functionParameter.serialNumber.detail",
        example: '"1969-7-20"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.NETWORKDAYS,
    functionType: t.Date,
    description: "formula.functionList.NETWORKDAYS.description",
    abstract: "formula.functionList.NETWORKDAYS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NETWORKDAYS.functionParameter.startDate.name",
        detail: "formula.functionList.NETWORKDAYS.functionParameter.startDate.detail",
        example: '"2012-10-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NETWORKDAYS.functionParameter.endDate.name",
        detail: "formula.functionList.NETWORKDAYS.functionParameter.endDate.detail",
        example: '"2013-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NETWORKDAYS.functionParameter.holidays.name",
        detail: "formula.functionList.NETWORKDAYS.functionParameter.holidays.detail",
        example: '"2012-11-22"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.NETWORKDAYS_INTL,
    functionType: t.Date,
    description: "formula.functionList.NETWORKDAYS_INTL.description",
    abstract: "formula.functionList.NETWORKDAYS_INTL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NETWORKDAYS_INTL.functionParameter.startDate.name",
        detail: "formula.functionList.NETWORKDAYS_INTL.functionParameter.startDate.detail",
        example: '"2012-10-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NETWORKDAYS_INTL.functionParameter.endDate.name",
        detail: "formula.functionList.NETWORKDAYS_INTL.functionParameter.endDate.detail",
        example: '"2013-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NETWORKDAYS_INTL.functionParameter.weekend.name",
        detail: "formula.functionList.NETWORKDAYS_INTL.functionParameter.weekend.detail",
        example: "6",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.NETWORKDAYS_INTL.functionParameter.holidays.name",
        detail: "formula.functionList.NETWORKDAYS_INTL.functionParameter.holidays.detail",
        example: '"2012-11-22"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.NOW,
    functionType: t.Date,
    description: "formula.functionList.NOW.description",
    abstract: "formula.functionList.NOW.abstract",
    functionParameter: []
  },
  {
    functionName: V.SECOND,
    functionType: t.Date,
    description: "formula.functionList.SECOND.description",
    abstract: "formula.functionList.SECOND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SECOND.functionParameter.serialNumber.name",
        detail: "formula.functionList.SECOND.functionParameter.serialNumber.detail",
        example: '"4:48:18"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.TIME,
    functionType: t.Date,
    description: "formula.functionList.TIME.description",
    abstract: "formula.functionList.TIME.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TIME.functionParameter.hour.name",
        detail: "formula.functionList.TIME.functionParameter.hour.detail",
        example: "15",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TIME.functionParameter.minute.name",
        detail: "formula.functionList.TIME.functionParameter.minute.detail",
        example: "20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TIME.functionParameter.second.name",
        detail: "formula.functionList.TIME.functionParameter.second.detail",
        example: "59",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.TIMEVALUE,
    functionType: t.Date,
    description: "formula.functionList.TIMEVALUE.description",
    abstract: "formula.functionList.TIMEVALUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TIMEVALUE.functionParameter.timeText.name",
        detail: "formula.functionList.TIMEVALUE.functionParameter.timeText.detail",
        example: '"15:20:59"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.TO_DATE,
    functionType: t.Date,
    description: "formula.functionList.TO_DATE.description",
    abstract: "formula.functionList.TO_DATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TO_DATE.functionParameter.value.name",
        detail: "formula.functionList.TO_DATE.functionParameter.value.detail",
        example: "40826.4375",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.TODAY,
    functionType: t.Date,
    description: "formula.functionList.TODAY.description",
    abstract: "formula.functionList.TODAY.abstract",
    functionParameter: []
  },
  {
    functionName: V.WEEKDAY,
    functionType: t.Date,
    description: "formula.functionList.WEEKDAY.description",
    abstract: "formula.functionList.WEEKDAY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WEEKDAY.functionParameter.serialNumber.name",
        detail: "formula.functionList.WEEKDAY.functionParameter.serialNumber.detail",
        example: '"2008-2-14"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEEKDAY.functionParameter.returnType.name",
        detail: "formula.functionList.WEEKDAY.functionParameter.returnType.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.WEEKNUM,
    functionType: t.Date,
    description: "formula.functionList.WEEKNUM.description",
    abstract: "formula.functionList.WEEKNUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WEEKNUM.functionParameter.serialNumber.name",
        detail: "formula.functionList.WEEKNUM.functionParameter.serialNumber.detail",
        example: '"2012-3-9"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEEKNUM.functionParameter.returnType.name",
        detail: "formula.functionList.WEEKNUM.functionParameter.returnType.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.WORKDAY,
    functionType: t.Date,
    description: "formula.functionList.WORKDAY.description",
    abstract: "formula.functionList.WORKDAY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WORKDAY.functionParameter.startDate.name",
        detail: "formula.functionList.WORKDAY.functionParameter.startDate.detail",
        example: '"2008-10-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WORKDAY.functionParameter.days.name",
        detail: "formula.functionList.WORKDAY.functionParameter.days.detail",
        example: "151",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WORKDAY.functionParameter.holidays.name",
        detail: "formula.functionList.WORKDAY.functionParameter.holidays.detail",
        example: '"2008-11-26"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.WORKDAY_INTL,
    functionType: t.Date,
    description: "formula.functionList.WORKDAY_INTL.description",
    abstract: "formula.functionList.WORKDAY_INTL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WORKDAY_INTL.functionParameter.startDate.name",
        detail: "formula.functionList.WORKDAY_INTL.functionParameter.startDate.detail",
        example: '"2008-10-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WORKDAY_INTL.functionParameter.days.name",
        detail: "formula.functionList.WORKDAY_INTL.functionParameter.days.detail",
        example: "151",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WORKDAY_INTL.functionParameter.weekend.name",
        detail: "formula.functionList.WORKDAY_INTL.functionParameter.weekend.detail",
        example: "6",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.WORKDAY_INTL.functionParameter.holidays.name",
        detail: "formula.functionList.WORKDAY_INTL.functionParameter.holidays.detail",
        example: '"2008-11-26"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.YEAR,
    functionType: t.Date,
    description: "formula.functionList.YEAR.description",
    abstract: "formula.functionList.YEAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.YEAR.functionParameter.serialNumber.name",
        detail: "formula.functionList.YEAR.functionParameter.serialNumber.detail",
        example: '"1969-7-20"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: V.YEARFRAC,
    functionType: t.Date,
    description: "formula.functionList.YEARFRAC.description",
    abstract: "formula.functionList.YEARFRAC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.YEARFRAC.functionParameter.startDate.name",
        detail: "formula.functionList.YEARFRAC.functionParameter.startDate.detail",
        example: '"2012-1-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YEARFRAC.functionParameter.endDate.name",
        detail: "formula.functionList.YEARFRAC.functionParameter.endDate.detail",
        example: '"2012-7-30"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YEARFRAC.functionParameter.basis.name",
        detail: "formula.functionList.YEARFRAC.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  }
], xr = [
  {
    functionName: C.BESSELI,
    functionType: t.Engineering,
    description: "formula.functionList.BESSELI.description",
    abstract: "formula.functionList.BESSELI.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BESSELI.functionParameter.x.name",
        detail: "formula.functionList.BESSELI.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BESSELI.functionParameter.n.name",
        detail: "formula.functionList.BESSELI.functionParameter.n.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BESSELJ,
    functionType: t.Engineering,
    description: "formula.functionList.BESSELJ.description",
    abstract: "formula.functionList.BESSELJ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BESSELJ.functionParameter.x.name",
        detail: "formula.functionList.BESSELJ.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BESSELJ.functionParameter.n.name",
        detail: "formula.functionList.BESSELJ.functionParameter.n.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BESSELK,
    functionType: t.Engineering,
    description: "formula.functionList.BESSELK.description",
    abstract: "formula.functionList.BESSELK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BESSELK.functionParameter.x.name",
        detail: "formula.functionList.BESSELK.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BESSELK.functionParameter.n.name",
        detail: "formula.functionList.BESSELK.functionParameter.n.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BESSELY,
    functionType: t.Engineering,
    description: "formula.functionList.BESSELY.description",
    abstract: "formula.functionList.BESSELY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BESSELY.functionParameter.x.name",
        detail: "formula.functionList.BESSELY.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BESSELY.functionParameter.n.name",
        detail: "formula.functionList.BESSELY.functionParameter.n.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BIN2DEC,
    functionType: t.Engineering,
    description: "formula.functionList.BIN2DEC.description",
    abstract: "formula.functionList.BIN2DEC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BIN2DEC.functionParameter.number.name",
        detail: "formula.functionList.BIN2DEC.functionParameter.number.detail",
        example: "1100100",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BIN2HEX,
    functionType: t.Engineering,
    description: "formula.functionList.BIN2HEX.description",
    abstract: "formula.functionList.BIN2HEX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BIN2HEX.functionParameter.number.name",
        detail: "formula.functionList.BIN2HEX.functionParameter.number.detail",
        example: "11111011",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BIN2HEX.functionParameter.places.name",
        detail: "formula.functionList.BIN2HEX.functionParameter.places.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BIN2OCT,
    functionType: t.Engineering,
    description: "formula.functionList.BIN2OCT.description",
    abstract: "formula.functionList.BIN2OCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BIN2OCT.functionParameter.number.name",
        detail: "formula.functionList.BIN2OCT.functionParameter.number.detail",
        example: "1001",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BIN2OCT.functionParameter.places.name",
        detail: "formula.functionList.BIN2OCT.functionParameter.places.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BITAND,
    functionType: t.Engineering,
    description: "formula.functionList.BITAND.description",
    abstract: "formula.functionList.BITAND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BITAND.functionParameter.number1.name",
        detail: "formula.functionList.BITAND.functionParameter.number1.detail",
        example: "13",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BITAND.functionParameter.number2.name",
        detail: "formula.functionList.BITAND.functionParameter.number2.detail",
        example: "25",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BITLSHIFT,
    functionType: t.Engineering,
    description: "formula.functionList.BITLSHIFT.description",
    abstract: "formula.functionList.BITLSHIFT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BITLSHIFT.functionParameter.number.name",
        detail: "formula.functionList.BITLSHIFT.functionParameter.number.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BITLSHIFT.functionParameter.shiftAmount.name",
        detail: "formula.functionList.BITLSHIFT.functionParameter.shiftAmount.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BITOR,
    functionType: t.Engineering,
    description: "formula.functionList.BITOR.description",
    abstract: "formula.functionList.BITOR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BITOR.functionParameter.number1.name",
        detail: "formula.functionList.BITOR.functionParameter.number1.detail",
        example: "23",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BITOR.functionParameter.number2.name",
        detail: "formula.functionList.BITOR.functionParameter.number2.detail",
        example: "10",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BITRSHIFT,
    functionType: t.Engineering,
    description: "formula.functionList.BITRSHIFT.description",
    abstract: "formula.functionList.BITRSHIFT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BITRSHIFT.functionParameter.number.name",
        detail: "formula.functionList.BITRSHIFT.functionParameter.number.detail",
        example: "13",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BITRSHIFT.functionParameter.shiftAmount.name",
        detail: "formula.functionList.BITRSHIFT.functionParameter.shiftAmount.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.BITXOR,
    functionType: t.Engineering,
    description: "formula.functionList.BITXOR.description",
    abstract: "formula.functionList.BITXOR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BITXOR.functionParameter.number1.name",
        detail: "formula.functionList.BITXOR.functionParameter.number1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BITXOR.functionParameter.number2.name",
        detail: "formula.functionList.BITXOR.functionParameter.number2.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.COMPLEX,
    functionType: t.Engineering,
    description: "formula.functionList.COMPLEX.description",
    abstract: "formula.functionList.COMPLEX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COMPLEX.functionParameter.realNum.name",
        detail: "formula.functionList.COMPLEX.functionParameter.realNum.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COMPLEX.functionParameter.iNum.name",
        detail: "formula.functionList.COMPLEX.functionParameter.iNum.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COMPLEX.functionParameter.suffix.name",
        detail: "formula.functionList.COMPLEX.functionParameter.suffix.detail",
        example: '"i"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.CONVERT,
    functionType: t.Engineering,
    description: "formula.functionList.CONVERT.description",
    abstract: "formula.functionList.CONVERT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONVERT.functionParameter.number.name",
        detail: "formula.functionList.CONVERT.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONVERT.functionParameter.fromUnit.name",
        detail: "formula.functionList.CONVERT.functionParameter.fromUnit.detail",
        example: '"lbm"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONVERT.functionParameter.toUnit.name",
        detail: "formula.functionList.CONVERT.functionParameter.toUnit.detail",
        example: '"kg"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.DEC2BIN,
    functionType: t.Engineering,
    description: "formula.functionList.DEC2BIN.description",
    abstract: "formula.functionList.DEC2BIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DEC2BIN.functionParameter.number.name",
        detail: "formula.functionList.DEC2BIN.functionParameter.number.detail",
        example: "9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DEC2BIN.functionParameter.places.name",
        detail: "formula.functionList.DEC2BIN.functionParameter.places.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.DEC2HEX,
    functionType: t.Engineering,
    description: "formula.functionList.DEC2HEX.description",
    abstract: "formula.functionList.DEC2HEX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DEC2HEX.functionParameter.number.name",
        detail: "formula.functionList.DEC2HEX.functionParameter.number.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DEC2HEX.functionParameter.places.name",
        detail: "formula.functionList.DEC2HEX.functionParameter.places.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.DEC2OCT,
    functionType: t.Engineering,
    description: "formula.functionList.DEC2OCT.description",
    abstract: "formula.functionList.DEC2OCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DEC2OCT.functionParameter.number.name",
        detail: "formula.functionList.DEC2OCT.functionParameter.number.detail",
        example: "58",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DEC2OCT.functionParameter.places.name",
        detail: "formula.functionList.DEC2OCT.functionParameter.places.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.DELTA,
    functionType: t.Engineering,
    description: "formula.functionList.DELTA.description",
    abstract: "formula.functionList.DELTA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DELTA.functionParameter.number1.name",
        detail: "formula.functionList.DELTA.functionParameter.number1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DELTA.functionParameter.number2.name",
        detail: "formula.functionList.DELTA.functionParameter.number2.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.ERF,
    functionType: t.Engineering,
    description: "formula.functionList.ERF.description",
    abstract: "formula.functionList.ERF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ERF.functionParameter.lowerLimit.name",
        detail: "formula.functionList.ERF.functionParameter.lowerLimit.detail",
        example: "0.745",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ERF.functionParameter.upperLimit.name",
        detail: "formula.functionList.ERF.functionParameter.upperLimit.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.ERF_PRECISE,
    functionType: t.Engineering,
    description: "formula.functionList.ERF_PRECISE.description",
    abstract: "formula.functionList.ERF_PRECISE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ERF_PRECISE.functionParameter.x.name",
        detail: "formula.functionList.ERF_PRECISE.functionParameter.x.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.ERFC,
    functionType: t.Engineering,
    description: "formula.functionList.ERFC.description",
    abstract: "formula.functionList.ERFC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ERFC.functionParameter.x.name",
        detail: "formula.functionList.ERFC.functionParameter.x.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.ERFC_PRECISE,
    functionType: t.Engineering,
    description: "formula.functionList.ERFC_PRECISE.description",
    abstract: "formula.functionList.ERFC_PRECISE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ERFC_PRECISE.functionParameter.x.name",
        detail: "formula.functionList.ERFC_PRECISE.functionParameter.x.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.GESTEP,
    functionType: t.Engineering,
    description: "formula.functionList.GESTEP.description",
    abstract: "formula.functionList.GESTEP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GESTEP.functionParameter.number.name",
        detail: "formula.functionList.GESTEP.functionParameter.number.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GESTEP.functionParameter.step.name",
        detail: "formula.functionList.GESTEP.functionParameter.step.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.HEX2BIN,
    functionType: t.Engineering,
    description: "formula.functionList.HEX2BIN.description",
    abstract: "formula.functionList.HEX2BIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HEX2BIN.functionParameter.number.name",
        detail: "formula.functionList.HEX2BIN.functionParameter.number.detail",
        example: '"F"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HEX2BIN.functionParameter.places.name",
        detail: "formula.functionList.HEX2BIN.functionParameter.places.detail",
        example: "8",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.HEX2DEC,
    functionType: t.Engineering,
    description: "formula.functionList.HEX2DEC.description",
    abstract: "formula.functionList.HEX2DEC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HEX2DEC.functionParameter.number.name",
        detail: "formula.functionList.HEX2DEC.functionParameter.number.detail",
        example: '"A5"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.HEX2OCT,
    functionType: t.Engineering,
    description: "formula.functionList.HEX2OCT.description",
    abstract: "formula.functionList.HEX2OCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HEX2OCT.functionParameter.number.name",
        detail: "formula.functionList.HEX2OCT.functionParameter.number.detail",
        example: '"F"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HEX2OCT.functionParameter.places.name",
        detail: "formula.functionList.HEX2OCT.functionParameter.places.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMABS,
    functionType: t.Engineering,
    description: "formula.functionList.IMABS.description",
    abstract: "formula.functionList.IMABS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMABS.functionParameter.inumber.name",
        detail: "formula.functionList.IMABS.functionParameter.inumber.detail",
        example: '"5+12i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMAGINARY,
    functionType: t.Engineering,
    description: "formula.functionList.IMAGINARY.description",
    abstract: "formula.functionList.IMAGINARY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMAGINARY.functionParameter.inumber.name",
        detail: "formula.functionList.IMAGINARY.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMARGUMENT,
    functionType: t.Engineering,
    description: "formula.functionList.IMARGUMENT.description",
    abstract: "formula.functionList.IMARGUMENT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMARGUMENT.functionParameter.inumber.name",
        detail: "formula.functionList.IMARGUMENT.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCONJUGATE,
    functionType: t.Engineering,
    description: "formula.functionList.IMCONJUGATE.description",
    abstract: "formula.functionList.IMCONJUGATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCONJUGATE.functionParameter.inumber.name",
        detail: "formula.functionList.IMCONJUGATE.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCOS,
    functionType: t.Engineering,
    description: "formula.functionList.IMCOS.description",
    abstract: "formula.functionList.IMCOS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCOS.functionParameter.inumber.name",
        detail: "formula.functionList.IMCOS.functionParameter.inumber.detail",
        example: '"1+i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCOSH,
    functionType: t.Engineering,
    description: "formula.functionList.IMCOSH.description",
    abstract: "formula.functionList.IMCOSH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCOSH.functionParameter.inumber.name",
        detail: "formula.functionList.IMCOSH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCOT,
    functionType: t.Engineering,
    description: "formula.functionList.IMCOT.description",
    abstract: "formula.functionList.IMCOT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCOT.functionParameter.inumber.name",
        detail: "formula.functionList.IMCOT.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCOTH,
    functionType: t.Engineering,
    description: "formula.functionList.IMCOTH.description",
    abstract: "formula.functionList.IMCOTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCOTH.functionParameter.inumber.name",
        detail: "formula.functionList.IMCOTH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCSC,
    functionType: t.Engineering,
    description: "formula.functionList.IMCSC.description",
    abstract: "formula.functionList.IMCSC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCSC.functionParameter.inumber.name",
        detail: "formula.functionList.IMCSC.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMCSCH,
    functionType: t.Engineering,
    description: "formula.functionList.IMCSCH.description",
    abstract: "formula.functionList.IMCSCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMCSCH.functionParameter.inumber.name",
        detail: "formula.functionList.IMCSCH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMDIV,
    functionType: t.Engineering,
    description: "formula.functionList.IMDIV.description",
    abstract: "formula.functionList.IMDIV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMDIV.functionParameter.inumber1.name",
        detail: "formula.functionList.IMDIV.functionParameter.inumber1.detail",
        example: '"-238+240i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMDIV.functionParameter.inumber2.name",
        detail: "formula.functionList.IMDIV.functionParameter.inumber2.detail",
        example: '"10+24i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMEXP,
    functionType: t.Engineering,
    description: "formula.functionList.IMEXP.description",
    abstract: "formula.functionList.IMEXP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMEXP.functionParameter.inumber.name",
        detail: "formula.functionList.IMEXP.functionParameter.inumber.detail",
        example: '"1+i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMLN,
    functionType: t.Engineering,
    description: "formula.functionList.IMLN.description",
    abstract: "formula.functionList.IMLN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMLN.functionParameter.inumber.name",
        detail: "formula.functionList.IMLN.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMLOG,
    functionType: t.Engineering,
    description: "formula.functionList.IMLOG.description",
    abstract: "formula.functionList.IMLOG.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMLOG.functionParameter.inumber.name",
        detail: "formula.functionList.IMLOG.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMLOG.functionParameter.base.name",
        detail: "formula.functionList.IMLOG.functionParameter.base.detail",
        example: "10",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMLOG10,
    functionType: t.Engineering,
    description: "formula.functionList.IMLOG10.description",
    abstract: "formula.functionList.IMLOG10.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMLOG10.functionParameter.inumber.name",
        detail: "formula.functionList.IMLOG10.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMLOG2,
    functionType: t.Engineering,
    description: "formula.functionList.IMLOG2.description",
    abstract: "formula.functionList.IMLOG2.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMLOG2.functionParameter.inumber.name",
        detail: "formula.functionList.IMLOG2.functionParameter.inumber.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMPOWER,
    functionType: t.Engineering,
    description: "formula.functionList.IMPOWER.description",
    abstract: "formula.functionList.IMPOWER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMPOWER.functionParameter.inumber.name",
        detail: "formula.functionList.IMPOWER.functionParameter.inumber.detail",
        example: '"2+3i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMPOWER.functionParameter.number.name",
        detail: "formula.functionList.IMPOWER.functionParameter.number.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMPRODUCT,
    functionType: t.Engineering,
    description: "formula.functionList.IMPRODUCT.description",
    abstract: "formula.functionList.IMPRODUCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMPRODUCT.functionParameter.inumber1.name",
        detail: "formula.functionList.IMPRODUCT.functionParameter.inumber1.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMPRODUCT.functionParameter.inumber2.name",
        detail: "formula.functionList.IMPRODUCT.functionParameter.inumber2.detail",
        example: '"5-3i"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: C.IMREAL,
    functionType: t.Engineering,
    description: "formula.functionList.IMREAL.description",
    abstract: "formula.functionList.IMREAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMREAL.functionParameter.inumber.name",
        detail: "formula.functionList.IMREAL.functionParameter.inumber.detail",
        example: '"6-9i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSEC,
    functionType: t.Engineering,
    description: "formula.functionList.IMSEC.description",
    abstract: "formula.functionList.IMSEC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSEC.functionParameter.inumber.name",
        detail: "formula.functionList.IMSEC.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSECH,
    functionType: t.Engineering,
    description: "formula.functionList.IMSECH.description",
    abstract: "formula.functionList.IMSECH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSECH.functionParameter.inumber.name",
        detail: "formula.functionList.IMSECH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSIN,
    functionType: t.Engineering,
    description: "formula.functionList.IMSIN.description",
    abstract: "formula.functionList.IMSIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSIN.functionParameter.inumber.name",
        detail: "formula.functionList.IMSIN.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSINH,
    functionType: t.Engineering,
    description: "formula.functionList.IMSINH.description",
    abstract: "formula.functionList.IMSINH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSINH.functionParameter.inumber.name",
        detail: "formula.functionList.IMSINH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSQRT,
    functionType: t.Engineering,
    description: "formula.functionList.IMSQRT.description",
    abstract: "formula.functionList.IMSQRT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSQRT.functionParameter.inumber.name",
        detail: "formula.functionList.IMSQRT.functionParameter.inumber.detail",
        example: '"1+i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSUB,
    functionType: t.Engineering,
    description: "formula.functionList.IMSUB.description",
    abstract: "formula.functionList.IMSUB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSUB.functionParameter.inumber1.name",
        detail: "formula.functionList.IMSUB.functionParameter.inumber1.detail",
        example: '"13+4i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMSUB.functionParameter.inumber2.name",
        detail: "formula.functionList.IMSUB.functionParameter.inumber2.detail",
        example: '"5+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMSUM,
    functionType: t.Engineering,
    description: "formula.functionList.IMSUM.description",
    abstract: "formula.functionList.IMSUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMSUM.functionParameter.inumber1.name",
        detail: "formula.functionList.IMSUM.functionParameter.inumber1.detail",
        example: '"3+4i"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMSUM.functionParameter.inumber2.name",
        detail: "formula.functionList.IMSUM.functionParameter.inumber2.detail",
        example: '"5-3i"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: C.IMTAN,
    functionType: t.Engineering,
    description: "formula.functionList.IMTAN.description",
    abstract: "formula.functionList.IMTAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMTAN.functionParameter.inumber.name",
        detail: "formula.functionList.IMTAN.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.IMTANH,
    functionType: t.Engineering,
    description: "formula.functionList.IMTANH.description",
    abstract: "formula.functionList.IMTANH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMTANH.functionParameter.inumber.name",
        detail: "formula.functionList.IMTANH.functionParameter.inumber.detail",
        example: '"4+3i"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.OCT2BIN,
    functionType: t.Engineering,
    description: "formula.functionList.OCT2BIN.description",
    abstract: "formula.functionList.OCT2BIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.OCT2BIN.functionParameter.number.name",
        detail: "formula.functionList.OCT2BIN.functionParameter.number.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OCT2BIN.functionParameter.places.name",
        detail: "formula.functionList.OCT2BIN.functionParameter.places.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.OCT2DEC,
    functionType: t.Engineering,
    description: "formula.functionList.OCT2DEC.description",
    abstract: "formula.functionList.OCT2DEC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.OCT2DEC.functionParameter.number.name",
        detail: "formula.functionList.OCT2DEC.functionParameter.number.detail",
        example: "54",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: C.OCT2HEX,
    functionType: t.Engineering,
    description: "formula.functionList.OCT2HEX.description",
    abstract: "formula.functionList.OCT2HEX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.OCT2HEX.functionParameter.number.name",
        detail: "formula.functionList.OCT2HEX.functionParameter.number.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OCT2HEX.functionParameter.places.name",
        detail: "formula.functionList.OCT2HEX.functionParameter.places.detail",
        example: "4",
        require: 0,
        repeat: 0
      }
    ]
  }
], _r = [
  {
    functionName: D.ACCRINT,
    functionType: t.Financial,
    description: "formula.functionList.ACCRINT.description",
    abstract: "formula.functionList.ACCRINT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACCRINT.functionParameter.issue.name",
        detail: "formula.functionList.ACCRINT.functionParameter.issue.detail",
        example: '"2008-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.firstInterest.name",
        detail: "formula.functionList.ACCRINT.functionParameter.firstInterest.detail",
        example: '"2008-8-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.settlement.name",
        detail: "formula.functionList.ACCRINT.functionParameter.settlement.detail",
        example: '"2008-5-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.rate.name",
        detail: "formula.functionList.ACCRINT.functionParameter.rate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.par.name",
        detail: "formula.functionList.ACCRINT.functionParameter.par.detail",
        example: "1000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.frequency.name",
        detail: "formula.functionList.ACCRINT.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.basis.name",
        detail: "formula.functionList.ACCRINT.functionParameter.basis.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINT.functionParameter.calcMethod.name",
        detail: "formula.functionList.ACCRINT.functionParameter.calcMethod.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.ACCRINTM,
    functionType: t.Financial,
    description: "formula.functionList.ACCRINTM.description",
    abstract: "formula.functionList.ACCRINTM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACCRINTM.functionParameter.issue.name",
        detail: "formula.functionList.ACCRINTM.functionParameter.issue.detail",
        example: '"2008-4-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINTM.functionParameter.settlement.name",
        detail: "formula.functionList.ACCRINTM.functionParameter.settlement.detail",
        example: '"2008-6-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINTM.functionParameter.rate.name",
        detail: "formula.functionList.ACCRINTM.functionParameter.rate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINTM.functionParameter.par.name",
        detail: "formula.functionList.ACCRINTM.functionParameter.par.detail",
        example: "1000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ACCRINTM.functionParameter.basis.name",
        detail: "formula.functionList.ACCRINTM.functionParameter.basis.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.AMORDEGRC,
    functionType: t.Financial,
    description: "formula.functionList.AMORDEGRC.description",
    abstract: "formula.functionList.AMORDEGRC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AMORDEGRC.functionParameter.number1.name",
        detail: "formula.functionList.AMORDEGRC.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORDEGRC.functionParameter.number2.name",
        detail: "formula.functionList.AMORDEGRC.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.AMORLINC,
    functionType: t.Financial,
    description: "formula.functionList.AMORLINC.description",
    abstract: "formula.functionList.AMORLINC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AMORLINC.functionParameter.cost.name",
        detail: "formula.functionList.AMORLINC.functionParameter.cost.detail",
        example: "2400",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.datePurchased.name",
        detail: "formula.functionList.AMORLINC.functionParameter.datePurchased.detail",
        example: '"2008-8-19"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.firstPeriod.name",
        detail: "formula.functionList.AMORLINC.functionParameter.firstPeriod.detail",
        example: '"2008-12-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.salvage.name",
        detail: "formula.functionList.AMORLINC.functionParameter.salvage.detail",
        example: "300",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.period.name",
        detail: "formula.functionList.AMORLINC.functionParameter.period.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.rate.name",
        detail: "formula.functionList.AMORLINC.functionParameter.rate.detail",
        example: "15%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AMORLINC.functionParameter.basis.name",
        detail: "formula.functionList.AMORLINC.functionParameter.basis.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPDAYBS,
    functionType: t.Financial,
    description: "formula.functionList.COUPDAYBS.description",
    abstract: "formula.functionList.COUPDAYBS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPDAYBS.functionParameter.settlement.name",
        detail: "formula.functionList.COUPDAYBS.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYBS.functionParameter.maturity.name",
        detail: "formula.functionList.COUPDAYBS.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYBS.functionParameter.frequency.name",
        detail: "formula.functionList.COUPDAYBS.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYBS.functionParameter.basis.name",
        detail: "formula.functionList.COUPDAYBS.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPDAYS,
    functionType: t.Financial,
    description: "formula.functionList.COUPDAYS.description",
    abstract: "formula.functionList.COUPDAYS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPDAYS.functionParameter.settlement.name",
        detail: "formula.functionList.COUPDAYS.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYS.functionParameter.maturity.name",
        detail: "formula.functionList.COUPDAYS.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYS.functionParameter.frequency.name",
        detail: "formula.functionList.COUPDAYS.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYS.functionParameter.basis.name",
        detail: "formula.functionList.COUPDAYS.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPDAYSNC,
    functionType: t.Financial,
    description: "formula.functionList.COUPDAYSNC.description",
    abstract: "formula.functionList.COUPDAYSNC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPDAYSNC.functionParameter.settlement.name",
        detail: "formula.functionList.COUPDAYSNC.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYSNC.functionParameter.maturity.name",
        detail: "formula.functionList.COUPDAYSNC.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYSNC.functionParameter.frequency.name",
        detail: "formula.functionList.COUPDAYSNC.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPDAYSNC.functionParameter.basis.name",
        detail: "formula.functionList.COUPDAYSNC.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPNCD,
    functionType: t.Financial,
    description: "formula.functionList.COUPNCD.description",
    abstract: "formula.functionList.COUPNCD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPNCD.functionParameter.settlement.name",
        detail: "formula.functionList.COUPNCD.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNCD.functionParameter.maturity.name",
        detail: "formula.functionList.COUPNCD.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNCD.functionParameter.frequency.name",
        detail: "formula.functionList.COUPNCD.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNCD.functionParameter.basis.name",
        detail: "formula.functionList.COUPNCD.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPNUM,
    functionType: t.Financial,
    description: "formula.functionList.COUPNUM.description",
    abstract: "formula.functionList.COUPNUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPNUM.functionParameter.settlement.name",
        detail: "formula.functionList.COUPNUM.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNUM.functionParameter.maturity.name",
        detail: "formula.functionList.COUPNUM.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNUM.functionParameter.frequency.name",
        detail: "formula.functionList.COUPNUM.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPNUM.functionParameter.basis.name",
        detail: "formula.functionList.COUPNUM.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.COUPPCD,
    functionType: t.Financial,
    description: "formula.functionList.COUPPCD.description",
    abstract: "formula.functionList.COUPPCD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUPPCD.functionParameter.settlement.name",
        detail: "formula.functionList.COUPPCD.functionParameter.settlement.detail",
        example: '"2011-1-25"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPPCD.functionParameter.maturity.name",
        detail: "formula.functionList.COUPPCD.functionParameter.maturity.detail",
        example: '"2011-11-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPPCD.functionParameter.frequency.name",
        detail: "formula.functionList.COUPPCD.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUPPCD.functionParameter.basis.name",
        detail: "formula.functionList.COUPPCD.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.CUMIPMT,
    functionType: t.Financial,
    description: "formula.functionList.CUMIPMT.description",
    abstract: "formula.functionList.CUMIPMT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUMIPMT.functionParameter.rate.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.rate.detail",
        example: "9%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMIPMT.functionParameter.nper.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.nper.detail",
        example: "30*12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMIPMT.functionParameter.pv.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.pv.detail",
        example: "125000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMIPMT.functionParameter.startPeriod.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.startPeriod.detail",
        example: "13",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMIPMT.functionParameter.endPeriod.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.endPeriod.detail",
        example: "24",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMIPMT.functionParameter.type.name",
        detail: "formula.functionList.CUMIPMT.functionParameter.type.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.CUMPRINC,
    functionType: t.Financial,
    description: "formula.functionList.CUMPRINC.description",
    abstract: "formula.functionList.CUMPRINC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CUMPRINC.functionParameter.rate.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.rate.detail",
        example: "9%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMPRINC.functionParameter.nper.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.nper.detail",
        example: "30*12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMPRINC.functionParameter.pv.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.pv.detail",
        example: "125000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMPRINC.functionParameter.startPeriod.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.startPeriod.detail",
        example: "13",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMPRINC.functionParameter.endPeriod.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.endPeriod.detail",
        example: "24",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CUMPRINC.functionParameter.type.name",
        detail: "formula.functionList.CUMPRINC.functionParameter.type.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DB,
    functionType: t.Financial,
    description: "formula.functionList.DB.description",
    abstract: "formula.functionList.DB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DB.functionParameter.cost.name",
        detail: "formula.functionList.DB.functionParameter.cost.detail",
        example: "10000000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DB.functionParameter.salvage.name",
        detail: "formula.functionList.DB.functionParameter.salvage.detail",
        example: "1000000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DB.functionParameter.life.name",
        detail: "formula.functionList.DB.functionParameter.life.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DB.functionParameter.period.name",
        detail: "formula.functionList.DB.functionParameter.period.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DB.functionParameter.month.name",
        detail: "formula.functionList.DB.functionParameter.month.detail",
        example: "7",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DDB,
    functionType: t.Financial,
    description: "formula.functionList.DDB.description",
    abstract: "formula.functionList.DDB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DDB.functionParameter.cost.name",
        detail: "formula.functionList.DDB.functionParameter.cost.detail",
        example: "24000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DDB.functionParameter.salvage.name",
        detail: "formula.functionList.DDB.functionParameter.salvage.detail",
        example: "3000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DDB.functionParameter.life.name",
        detail: "formula.functionList.DDB.functionParameter.life.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DDB.functionParameter.period.name",
        detail: "formula.functionList.DDB.functionParameter.period.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DDB.functionParameter.factor.name",
        detail: "formula.functionList.DDB.functionParameter.factor.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DISC,
    functionType: t.Financial,
    description: "formula.functionList.DISC.description",
    abstract: "formula.functionList.DISC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DISC.functionParameter.settlement.name",
        detail: "formula.functionList.DISC.functionParameter.settlement.detail",
        example: '"2018-7-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DISC.functionParameter.maturity.name",
        detail: "formula.functionList.DISC.functionParameter.maturity.detail",
        example: '"2048-1-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DISC.functionParameter.pr.name",
        detail: "formula.functionList.DISC.functionParameter.pr.detail",
        example: "97.975",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DISC.functionParameter.redemption.name",
        detail: "formula.functionList.DISC.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DISC.functionParameter.basis.name",
        detail: "formula.functionList.DISC.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DOLLARDE,
    functionType: t.Financial,
    description: "formula.functionList.DOLLARDE.description",
    abstract: "formula.functionList.DOLLARDE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DOLLARDE.functionParameter.fractionalDollar.name",
        detail: "formula.functionList.DOLLARDE.functionParameter.fractionalDollar.detail",
        example: "1.02",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DOLLARDE.functionParameter.fraction.name",
        detail: "formula.functionList.DOLLARDE.functionParameter.fraction.detail",
        example: "16",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DOLLARFR,
    functionType: t.Financial,
    description: "formula.functionList.DOLLARFR.description",
    abstract: "formula.functionList.DOLLARFR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DOLLARFR.functionParameter.decimalDollar.name",
        detail: "formula.functionList.DOLLARFR.functionParameter.decimalDollar.detail",
        example: "1.125",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DOLLARFR.functionParameter.fraction.name",
        detail: "formula.functionList.DOLLARFR.functionParameter.fraction.detail",
        example: "16",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.DURATION,
    functionType: t.Financial,
    description: "formula.functionList.DURATION.description",
    abstract: "formula.functionList.DURATION.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DURATION.functionParameter.settlement.name",
        detail: "formula.functionList.DURATION.functionParameter.settlement.detail",
        example: '"2018-7-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DURATION.functionParameter.maturity.name",
        detail: "formula.functionList.DURATION.functionParameter.maturity.detail",
        example: '"2048-1-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DURATION.functionParameter.coupon.name",
        detail: "formula.functionList.DURATION.functionParameter.coupon.detail",
        example: "8%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DURATION.functionParameter.yld.name",
        detail: "formula.functionList.DURATION.functionParameter.yld.detail",
        example: "9%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DURATION.functionParameter.frequency.name",
        detail: "formula.functionList.DURATION.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DURATION.functionParameter.basis.name",
        detail: "formula.functionList.DURATION.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.EFFECT,
    functionType: t.Financial,
    description: "formula.functionList.EFFECT.description",
    abstract: "formula.functionList.EFFECT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EFFECT.functionParameter.nominalRate.name",
        detail: "formula.functionList.EFFECT.functionParameter.nominalRate.detail",
        example: "5.25%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EFFECT.functionParameter.npery.name",
        detail: "formula.functionList.EFFECT.functionParameter.npery.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.FV,
    functionType: t.Financial,
    description: "formula.functionList.FV.description",
    abstract: "formula.functionList.FV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FV.functionParameter.rate.name",
        detail: "formula.functionList.FV.functionParameter.rate.detail",
        example: "6%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FV.functionParameter.nper.name",
        detail: "formula.functionList.FV.functionParameter.nper.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FV.functionParameter.pmt.name",
        detail: "formula.functionList.FV.functionParameter.pmt.detail",
        example: "-200",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FV.functionParameter.pv.name",
        detail: "formula.functionList.FV.functionParameter.pv.detail",
        example: "-500",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.FV.functionParameter.type.name",
        detail: "formula.functionList.FV.functionParameter.type.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.FVSCHEDULE,
    functionType: t.Financial,
    description: "formula.functionList.FVSCHEDULE.description",
    abstract: "formula.functionList.FVSCHEDULE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FVSCHEDULE.functionParameter.principal.name",
        detail: "formula.functionList.FVSCHEDULE.functionParameter.principal.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FVSCHEDULE.functionParameter.schedule.name",
        detail: "formula.functionList.FVSCHEDULE.functionParameter.schedule.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.INTRATE,
    functionType: t.Financial,
    description: "formula.functionList.INTRATE.description",
    abstract: "formula.functionList.INTRATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INTRATE.functionParameter.settlement.name",
        detail: "formula.functionList.INTRATE.functionParameter.settlement.detail",
        example: '"2008-2-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INTRATE.functionParameter.maturity.name",
        detail: "formula.functionList.INTRATE.functionParameter.maturity.detail",
        example: '"2008-5-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INTRATE.functionParameter.investment.name",
        detail: "formula.functionList.INTRATE.functionParameter.investment.detail",
        example: "10000000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INTRATE.functionParameter.redemption.name",
        detail: "formula.functionList.INTRATE.functionParameter.redemption.detail",
        example: "10144200",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INTRATE.functionParameter.basis.name",
        detail: "formula.functionList.INTRATE.functionParameter.basis.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.IPMT,
    functionType: t.Financial,
    description: "formula.functionList.IPMT.description",
    abstract: "formula.functionList.IPMT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IPMT.functionParameter.rate.name",
        detail: "formula.functionList.IPMT.functionParameter.rate.detail",
        example: "10%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IPMT.functionParameter.per.name",
        detail: "formula.functionList.IPMT.functionParameter.per.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IPMT.functionParameter.nper.name",
        detail: "formula.functionList.IPMT.functionParameter.nper.detail",
        example: "3*12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IPMT.functionParameter.pv.name",
        detail: "formula.functionList.IPMT.functionParameter.pv.detail",
        example: "80000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IPMT.functionParameter.fv.name",
        detail: "formula.functionList.IPMT.functionParameter.fv.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.IPMT.functionParameter.type.name",
        detail: "formula.functionList.IPMT.functionParameter.type.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.IRR,
    functionType: t.Financial,
    description: "formula.functionList.IRR.description",
    abstract: "formula.functionList.IRR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IRR.functionParameter.values.name",
        detail: "formula.functionList.IRR.functionParameter.values.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IRR.functionParameter.guess.name",
        detail: "formula.functionList.IRR.functionParameter.guess.detail",
        example: "0.1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.ISPMT,
    functionType: t.Financial,
    description: "formula.functionList.ISPMT.description",
    abstract: "formula.functionList.ISPMT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISPMT.functionParameter.rate.name",
        detail: "formula.functionList.ISPMT.functionParameter.rate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISPMT.functionParameter.per.name",
        detail: "formula.functionList.ISPMT.functionParameter.per.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISPMT.functionParameter.nper.name",
        detail: "formula.functionList.ISPMT.functionParameter.nper.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISPMT.functionParameter.pv.name",
        detail: "formula.functionList.ISPMT.functionParameter.pv.detail",
        example: "1000",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.MDURATION,
    functionType: t.Financial,
    description: "formula.functionList.MDURATION.description",
    abstract: "formula.functionList.MDURATION.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MDURATION.functionParameter.settlement.name",
        detail: "formula.functionList.MDURATION.functionParameter.settlement.detail",
        example: '"2018-7-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MDURATION.functionParameter.maturity.name",
        detail: "formula.functionList.MDURATION.functionParameter.maturity.detail",
        example: '"2048-1-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MDURATION.functionParameter.coupon.name",
        detail: "formula.functionList.MDURATION.functionParameter.coupon.detail",
        example: "8%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MDURATION.functionParameter.yld.name",
        detail: "formula.functionList.MDURATION.functionParameter.yld.detail",
        example: "9%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MDURATION.functionParameter.frequency.name",
        detail: "formula.functionList.MDURATION.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MDURATION.functionParameter.basis.name",
        detail: "formula.functionList.MDURATION.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.MIRR,
    functionType: t.Financial,
    description: "formula.functionList.MIRR.description",
    abstract: "formula.functionList.MIRR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MIRR.functionParameter.values.name",
        detail: "formula.functionList.MIRR.functionParameter.values.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MIRR.functionParameter.financeRate.name",
        detail: "formula.functionList.MIRR.functionParameter.financeRate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MIRR.functionParameter.reinvestRate.name",
        detail: "formula.functionList.MIRR.functionParameter.reinvestRate.detail",
        example: "12%",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.NOMINAL,
    functionType: t.Financial,
    description: "formula.functionList.NOMINAL.description",
    abstract: "formula.functionList.NOMINAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NOMINAL.functionParameter.effectRate.name",
        detail: "formula.functionList.NOMINAL.functionParameter.effectRate.detail",
        example: "5.3543%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NOMINAL.functionParameter.npery.name",
        detail: "formula.functionList.NOMINAL.functionParameter.npery.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.NPER,
    functionType: t.Financial,
    description: "formula.functionList.NPER.description",
    abstract: "formula.functionList.NPER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NPER.functionParameter.rate.name",
        detail: "formula.functionList.NPER.functionParameter.rate.detail",
        example: "12%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NPER.functionParameter.pmt.name",
        detail: "formula.functionList.NPER.functionParameter.pmt.detail",
        example: "-100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NPER.functionParameter.pv.name",
        detail: "formula.functionList.NPER.functionParameter.pv.detail",
        example: "-1000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NPER.functionParameter.fv.name",
        detail: "formula.functionList.NPER.functionParameter.fv.detail",
        example: "10000",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.NPER.functionParameter.type.name",
        detail: "formula.functionList.NPER.functionParameter.type.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.NPV,
    functionType: t.Financial,
    description: "formula.functionList.NPV.description",
    abstract: "formula.functionList.NPV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NPV.functionParameter.rate.name",
        detail: "formula.functionList.NPV.functionParameter.rate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NPV.functionParameter.value1.name",
        detail: "formula.functionList.NPV.functionParameter.value1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NPV.functionParameter.value2.name",
        detail: "formula.functionList.NPV.functionParameter.value2.detail",
        example: "-9000",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: D.ODDFPRICE,
    functionType: t.Financial,
    description: "formula.functionList.ODDFPRICE.description",
    abstract: "formula.functionList.ODDFPRICE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.settlement.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.maturity.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.issue.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.issue.detail",
        example: '"2008-10-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.firstCoupon.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.firstCoupon.detail",
        example: '"2009-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.rate.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.rate.detail",
        example: "7.85%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.yld.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.yld.detail",
        example: "6.25%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.redemption.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.frequency.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFPRICE.functionParameter.basis.name",
        detail: "formula.functionList.ODDFPRICE.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.ODDFYIELD,
    functionType: t.Financial,
    description: "formula.functionList.ODDFYIELD.description",
    abstract: "formula.functionList.ODDFYIELD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.settlement.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.maturity.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.issue.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.issue.detail",
        example: '"2008-10-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.firstCoupon.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.firstCoupon.detail",
        example: '"2009-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.rate.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.rate.detail",
        example: "5.75%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.pr.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.pr.detail",
        example: "84.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.redemption.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.frequency.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDFYIELD.functionParameter.basis.name",
        detail: "formula.functionList.ODDFYIELD.functionParameter.basis.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.ODDLPRICE,
    functionType: t.Financial,
    description: "formula.functionList.ODDLPRICE.description",
    abstract: "formula.functionList.ODDLPRICE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.settlement.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.settlement.detail",
        example: '"2008-2-7"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.maturity.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.maturity.detail",
        example: '"2008-6-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.lastInterest.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.lastInterest.detail",
        example: '"2007-10-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.rate.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.rate.detail",
        example: "3.75%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.yld.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.yld.detail",
        example: "4.05%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.redemption.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.frequency.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLPRICE.functionParameter.basis.name",
        detail: "formula.functionList.ODDLPRICE.functionParameter.basis.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.ODDLYIELD,
    functionType: t.Financial,
    description: "formula.functionList.ODDLYIELD.description",
    abstract: "formula.functionList.ODDLYIELD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.settlement.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.settlement.detail",
        example: '"2008-4-20"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.maturity.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.maturity.detail",
        example: '"2008-6-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.lastInterest.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.lastInterest.detail",
        example: '"2007-12-24"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.rate.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.rate.detail",
        example: "3.75%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.pr.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.pr.detail",
        example: "99.875",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.redemption.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.frequency.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ODDLYIELD.functionParameter.basis.name",
        detail: "formula.functionList.ODDLYIELD.functionParameter.basis.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PDURATION,
    functionType: t.Financial,
    description: "formula.functionList.PDURATION.description",
    abstract: "formula.functionList.PDURATION.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PDURATION.functionParameter.rate.name",
        detail: "formula.functionList.PDURATION.functionParameter.rate.detail",
        example: "2.5%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PDURATION.functionParameter.pv.name",
        detail: "formula.functionList.PDURATION.functionParameter.pv.detail",
        example: "2000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PDURATION.functionParameter.fv.name",
        detail: "formula.functionList.PDURATION.functionParameter.fv.detail",
        example: "2200",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PMT,
    functionType: t.Financial,
    description: "formula.functionList.PMT.description",
    abstract: "formula.functionList.PMT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PMT.functionParameter.rate.name",
        detail: "formula.functionList.PMT.functionParameter.rate.detail",
        example: "8%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PMT.functionParameter.nper.name",
        detail: "formula.functionList.PMT.functionParameter.nper.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PMT.functionParameter.pv.name",
        detail: "formula.functionList.PMT.functionParameter.pv.detail",
        example: "10000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PMT.functionParameter.fv.name",
        detail: "formula.functionList.PMT.functionParameter.fv.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.PMT.functionParameter.type.name",
        detail: "formula.functionList.PMT.functionParameter.type.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PPMT,
    functionType: t.Financial,
    description: "formula.functionList.PPMT.description",
    abstract: "formula.functionList.PPMT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PPMT.functionParameter.rate.name",
        detail: "formula.functionList.PPMT.functionParameter.rate.detail",
        example: "10%/12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PPMT.functionParameter.per.name",
        detail: "formula.functionList.PPMT.functionParameter.per.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PPMT.functionParameter.nper.name",
        detail: "formula.functionList.PPMT.functionParameter.nper.detail",
        example: "3*12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PPMT.functionParameter.pv.name",
        detail: "formula.functionList.PPMT.functionParameter.pv.detail",
        example: "80000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PPMT.functionParameter.fv.name",
        detail: "formula.functionList.PPMT.functionParameter.fv.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.PPMT.functionParameter.type.name",
        detail: "formula.functionList.PPMT.functionParameter.type.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PRICE,
    functionType: t.Financial,
    description: "formula.functionList.PRICE.description",
    abstract: "formula.functionList.PRICE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PRICE.functionParameter.settlement.name",
        detail: "formula.functionList.PRICE.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.maturity.name",
        detail: "formula.functionList.PRICE.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.rate.name",
        detail: "formula.functionList.PRICE.functionParameter.rate.detail",
        example: "7.85%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.yld.name",
        detail: "formula.functionList.PRICE.functionParameter.yld.detail",
        example: "6.25%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.redemption.name",
        detail: "formula.functionList.PRICE.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.frequency.name",
        detail: "formula.functionList.PRICE.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICE.functionParameter.basis.name",
        detail: "formula.functionList.PRICE.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PRICEDISC,
    functionType: t.Financial,
    description: "formula.functionList.PRICEDISC.description",
    abstract: "formula.functionList.PRICEDISC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PRICEDISC.functionParameter.settlement.name",
        detail: "formula.functionList.PRICEDISC.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEDISC.functionParameter.maturity.name",
        detail: "formula.functionList.PRICEDISC.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEDISC.functionParameter.discount.name",
        detail: "formula.functionList.PRICEDISC.functionParameter.discount.detail",
        example: "6.25%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEDISC.functionParameter.redemption.name",
        detail: "formula.functionList.PRICEDISC.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEDISC.functionParameter.basis.name",
        detail: "formula.functionList.PRICEDISC.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PRICEMAT,
    functionType: t.Financial,
    description: "formula.functionList.PRICEMAT.description",
    abstract: "formula.functionList.PRICEMAT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PRICEMAT.functionParameter.settlement.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEMAT.functionParameter.maturity.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEMAT.functionParameter.issue.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.issue.detail",
        example: '"2008-10-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEMAT.functionParameter.rate.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.rate.detail",
        example: "7.85%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEMAT.functionParameter.yld.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.yld.detail",
        example: "6.25%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRICEMAT.functionParameter.basis.name",
        detail: "formula.functionList.PRICEMAT.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.PV,
    functionType: t.Financial,
    description: "formula.functionList.PV.description",
    abstract: "formula.functionList.PV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PV.functionParameter.rate.name",
        detail: "formula.functionList.PV.functionParameter.rate.detail",
        example: "2%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PV.functionParameter.nper.name",
        detail: "formula.functionList.PV.functionParameter.nper.detail",
        example: "12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PV.functionParameter.pmt.name",
        detail: "formula.functionList.PV.functionParameter.pmt.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PV.functionParameter.fv.name",
        detail: "formula.functionList.PV.functionParameter.fv.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.PV.functionParameter.type.name",
        detail: "formula.functionList.PV.functionParameter.type.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.RATE,
    functionType: t.Financial,
    description: "formula.functionList.RATE.description",
    abstract: "formula.functionList.RATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RATE.functionParameter.nper.name",
        detail: "formula.functionList.RATE.functionParameter.nper.detail",
        example: "4*12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RATE.functionParameter.pmt.name",
        detail: "formula.functionList.RATE.functionParameter.pmt.detail",
        example: "-200",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RATE.functionParameter.pv.name",
        detail: "formula.functionList.RATE.functionParameter.pv.detail",
        example: "8000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RATE.functionParameter.fv.name",
        detail: "formula.functionList.RATE.functionParameter.fv.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RATE.functionParameter.type.name",
        detail: "formula.functionList.RATE.functionParameter.type.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RATE.functionParameter.guess.name",
        detail: "formula.functionList.RATE.functionParameter.guess.detail",
        example: "0.1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.RECEIVED,
    functionType: t.Financial,
    description: "formula.functionList.RECEIVED.description",
    abstract: "formula.functionList.RECEIVED.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RECEIVED.functionParameter.settlement.name",
        detail: "formula.functionList.RECEIVED.functionParameter.settlement.detail",
        example: '"2008-2-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RECEIVED.functionParameter.maturity.name",
        detail: "formula.functionList.RECEIVED.functionParameter.maturity.detail",
        example: '"2008-3-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RECEIVED.functionParameter.investment.name",
        detail: "formula.functionList.RECEIVED.functionParameter.investment.detail",
        example: "10000000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RECEIVED.functionParameter.discount.name",
        detail: "formula.functionList.RECEIVED.functionParameter.discount.detail",
        example: "5.75%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RECEIVED.functionParameter.basis.name",
        detail: "formula.functionList.RECEIVED.functionParameter.basis.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.RRI,
    functionType: t.Financial,
    description: "formula.functionList.RRI.description",
    abstract: "formula.functionList.RRI.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RRI.functionParameter.nper.name",
        detail: "formula.functionList.RRI.functionParameter.nper.detail",
        example: "96",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RRI.functionParameter.pv.name",
        detail: "formula.functionList.RRI.functionParameter.pv.detail",
        example: "10000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RRI.functionParameter.fv.name",
        detail: "formula.functionList.RRI.functionParameter.fv.detail",
        example: "11000",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.SLN,
    functionType: t.Financial,
    description: "formula.functionList.SLN.description",
    abstract: "formula.functionList.SLN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SLN.functionParameter.cost.name",
        detail: "formula.functionList.SLN.functionParameter.cost.detail",
        example: "300000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SLN.functionParameter.salvage.name",
        detail: "formula.functionList.SLN.functionParameter.salvage.detail",
        example: "75000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SLN.functionParameter.life.name",
        detail: "formula.functionList.SLN.functionParameter.life.detail",
        example: "10",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.SYD,
    functionType: t.Financial,
    description: "formula.functionList.SYD.description",
    abstract: "formula.functionList.SYD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SYD.functionParameter.cost.name",
        detail: "formula.functionList.SYD.functionParameter.cost.detail",
        example: "300000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SYD.functionParameter.salvage.name",
        detail: "formula.functionList.SYD.functionParameter.salvage.detail",
        example: "75000",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SYD.functionParameter.life.name",
        detail: "formula.functionList.SYD.functionParameter.life.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SYD.functionParameter.per.name",
        detail: "formula.functionList.SYD.functionParameter.per.detail",
        example: "10",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.TBILLEQ,
    functionType: t.Financial,
    description: "formula.functionList.TBILLEQ.description",
    abstract: "formula.functionList.TBILLEQ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TBILLEQ.functionParameter.settlement.name",
        detail: "formula.functionList.TBILLEQ.functionParameter.settlement.detail",
        example: '"2008-3-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLEQ.functionParameter.maturity.name",
        detail: "formula.functionList.TBILLEQ.functionParameter.maturity.detail",
        example: '"2008-6-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLEQ.functionParameter.discount.name",
        detail: "formula.functionList.TBILLEQ.functionParameter.discount.detail",
        example: "9.14%",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.TBILLPRICE,
    functionType: t.Financial,
    description: "formula.functionList.TBILLPRICE.description",
    abstract: "formula.functionList.TBILLPRICE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TBILLPRICE.functionParameter.settlement.name",
        detail: "formula.functionList.TBILLPRICE.functionParameter.settlement.detail",
        example: '"2008-3-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLPRICE.functionParameter.maturity.name",
        detail: "formula.functionList.TBILLPRICE.functionParameter.maturity.detail",
        example: '"2008-6-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLPRICE.functionParameter.discount.name",
        detail: "formula.functionList.TBILLPRICE.functionParameter.discount.detail",
        example: "9.14%",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.TBILLYIELD,
    functionType: t.Financial,
    description: "formula.functionList.TBILLYIELD.description",
    abstract: "formula.functionList.TBILLYIELD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TBILLYIELD.functionParameter.settlement.name",
        detail: "formula.functionList.TBILLYIELD.functionParameter.settlement.detail",
        example: '"2008-3-31"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLYIELD.functionParameter.maturity.name",
        detail: "formula.functionList.TBILLYIELD.functionParameter.maturity.detail",
        example: '"2008-6-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TBILLYIELD.functionParameter.pr.name",
        detail: "formula.functionList.TBILLYIELD.functionParameter.pr.detail",
        example: "98.45",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.VDB,
    functionType: t.Financial,
    description: "formula.functionList.VDB.description",
    abstract: "formula.functionList.VDB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VDB.functionParameter.cost.name",
        detail: "formula.functionList.VDB.functionParameter.cost.detail",
        example: "2400",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.salvage.name",
        detail: "formula.functionList.VDB.functionParameter.salvage.detail",
        example: "300",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.life.name",
        detail: "formula.functionList.VDB.functionParameter.life.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.startPeriod.name",
        detail: "formula.functionList.VDB.functionParameter.startPeriod.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.endPeriod.name",
        detail: "formula.functionList.VDB.functionParameter.endPeriod.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.factor.name",
        detail: "formula.functionList.VDB.functionParameter.factor.detail",
        example: "2",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.VDB.functionParameter.noSwitch.name",
        detail: "formula.functionList.VDB.functionParameter.noSwitch.detail",
        example: "false",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.XIRR,
    functionType: t.Financial,
    description: "formula.functionList.XIRR.description",
    abstract: "formula.functionList.XIRR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.XIRR.functionParameter.values.name",
        detail: "formula.functionList.XIRR.functionParameter.values.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XIRR.functionParameter.dates.name",
        detail: "formula.functionList.XIRR.functionParameter.dates.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XIRR.functionParameter.guess.name",
        detail: "formula.functionList.XIRR.functionParameter.guess.detail",
        example: "0.1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.XNPV,
    functionType: t.Financial,
    description: "formula.functionList.XNPV.description",
    abstract: "formula.functionList.XNPV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.XNPV.functionParameter.rate.name",
        detail: "formula.functionList.XNPV.functionParameter.rate.detail",
        example: "10%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XNPV.functionParameter.values.name",
        detail: "formula.functionList.XNPV.functionParameter.values.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XNPV.functionParameter.dates.name",
        detail: "formula.functionList.XNPV.functionParameter.dates.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.YIELD,
    functionType: t.Financial,
    description: "formula.functionList.YIELD.description",
    abstract: "formula.functionList.YIELD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.YIELD.functionParameter.settlement.name",
        detail: "formula.functionList.YIELD.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.maturity.name",
        detail: "formula.functionList.YIELD.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.rate.name",
        detail: "formula.functionList.YIELD.functionParameter.rate.detail",
        example: "7.85%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.pr.name",
        detail: "formula.functionList.YIELD.functionParameter.pr.detail",
        example: "98.45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.redemption.name",
        detail: "formula.functionList.YIELD.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.frequency.name",
        detail: "formula.functionList.YIELD.functionParameter.frequency.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELD.functionParameter.basis.name",
        detail: "formula.functionList.YIELD.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.YIELDDISC,
    functionType: t.Financial,
    description: "formula.functionList.YIELDDISC.description",
    abstract: "formula.functionList.YIELDDISC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.YIELDDISC.functionParameter.settlement.name",
        detail: "formula.functionList.YIELDDISC.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDDISC.functionParameter.maturity.name",
        detail: "formula.functionList.YIELDDISC.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDDISC.functionParameter.pr.name",
        detail: "formula.functionList.YIELDDISC.functionParameter.pr.detail",
        example: "98.45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDDISC.functionParameter.redemption.name",
        detail: "formula.functionList.YIELDDISC.functionParameter.redemption.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDDISC.functionParameter.basis.name",
        detail: "formula.functionList.YIELDDISC.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: D.YIELDMAT,
    functionType: t.Financial,
    description: "formula.functionList.YIELDMAT.description",
    abstract: "formula.functionList.YIELDMAT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.YIELDMAT.functionParameter.settlement.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.settlement.detail",
        example: '"2008-11-11"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDMAT.functionParameter.maturity.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.maturity.detail",
        example: '"2021-3-1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDMAT.functionParameter.issue.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.issue.detail",
        example: '"2008-10-15"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDMAT.functionParameter.rate.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.rate.detail",
        example: "7.85%",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDMAT.functionParameter.pr.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.pr.detail",
        example: "98.45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.YIELDMAT.functionParameter.basis.name",
        detail: "formula.functionList.YIELDMAT.functionParameter.basis.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  }
], yr = [
  {
    functionName: G.CELL,
    functionType: t.Information,
    description: "formula.functionList.CELL.description",
    abstract: "formula.functionList.CELL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CELL.functionParameter.infoType.name",
        detail: "formula.functionList.CELL.functionParameter.infoType.detail",
        example: '"type"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CELL.functionParameter.reference.name",
        detail: "formula.functionList.CELL.functionParameter.reference.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ERROR_TYPE,
    functionType: t.Information,
    description: "formula.functionList.ERROR_TYPE.description",
    abstract: "formula.functionList.ERROR_TYPE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ERROR_TYPE.functionParameter.errorVal.name",
        detail: "formula.functionList.ERROR_TYPE.functionParameter.errorVal.detail",
        example: '"#NULL!"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.INFO,
    functionType: t.Information,
    description: "formula.functionList.INFO.description",
    abstract: "formula.functionList.INFO.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INFO.functionParameter.number1.name",
        detail: "formula.functionList.INFO.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INFO.functionParameter.number2.name",
        detail: "formula.functionList.INFO.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISBETWEEN,
    functionType: t.Information,
    description: "formula.functionList.ISBETWEEN.description",
    abstract: "formula.functionList.ISBETWEEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISBETWEEN.functionParameter.valueToCompare.name",
        detail: "formula.functionList.ISBETWEEN.functionParameter.valueToCompare.detail",
        example: "7.9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISBETWEEN.functionParameter.lowerValue.name",
        detail: "formula.functionList.ISBETWEEN.functionParameter.lowerValue.detail",
        example: "1.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISBETWEEN.functionParameter.upperValue.name",
        detail: "formula.functionList.ISBETWEEN.functionParameter.upperValue.detail",
        example: "12.45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISBETWEEN.functionParameter.lowerValueIsInclusive.name",
        detail: "formula.functionList.ISBETWEEN.functionParameter.lowerValueIsInclusive.detail",
        example: "true",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.ISBETWEEN.functionParameter.upperValueIsInclusive.name",
        detail: "formula.functionList.ISBETWEEN.functionParameter.upperValueIsInclusive.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISBLANK,
    functionType: t.Information,
    description: "formula.functionList.ISBLANK.description",
    abstract: "formula.functionList.ISBLANK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISBLANK.functionParameter.value.name",
        detail: "formula.functionList.ISBLANK.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISDATE,
    functionType: t.Information,
    description: "formula.functionList.ISDATE.description",
    abstract: "formula.functionList.ISDATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISDATE.functionParameter.value.name",
        detail: "formula.functionList.ISDATE.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISEMAIL,
    functionType: t.Information,
    description: "formula.functionList.ISEMAIL.description",
    abstract: "formula.functionList.ISEMAIL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISEMAIL.functionParameter.value.name",
        detail: "formula.functionList.ISEMAIL.functionParameter.value.detail",
        example: '"developer@univer.ai"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISERR,
    functionType: t.Information,
    description: "formula.functionList.ISERR.description",
    abstract: "formula.functionList.ISERR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISERR.functionParameter.value.name",
        detail: "formula.functionList.ISERR.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISERROR,
    functionType: t.Information,
    description: "formula.functionList.ISERROR.description",
    abstract: "formula.functionList.ISERROR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISERROR.functionParameter.value.name",
        detail: "formula.functionList.ISERROR.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISEVEN,
    functionType: t.Information,
    description: "formula.functionList.ISEVEN.description",
    abstract: "formula.functionList.ISEVEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISEVEN.functionParameter.value.name",
        detail: "formula.functionList.ISEVEN.functionParameter.value.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISFORMULA,
    functionType: t.Information,
    description: "formula.functionList.ISFORMULA.description",
    abstract: "formula.functionList.ISFORMULA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISFORMULA.functionParameter.reference.name",
        detail: "formula.functionList.ISFORMULA.functionParameter.reference.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISLOGICAL,
    functionType: t.Information,
    description: "formula.functionList.ISLOGICAL.description",
    abstract: "formula.functionList.ISLOGICAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISLOGICAL.functionParameter.value.name",
        detail: "formula.functionList.ISLOGICAL.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISNA,
    functionType: t.Information,
    description: "formula.functionList.ISNA.description",
    abstract: "formula.functionList.ISNA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISNA.functionParameter.value.name",
        detail: "formula.functionList.ISNA.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISNONTEXT,
    functionType: t.Information,
    description: "formula.functionList.ISNONTEXT.description",
    abstract: "formula.functionList.ISNONTEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISNONTEXT.functionParameter.value.name",
        detail: "formula.functionList.ISNONTEXT.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISNUMBER,
    functionType: t.Information,
    description: "formula.functionList.ISNUMBER.description",
    abstract: "formula.functionList.ISNUMBER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISNUMBER.functionParameter.value.name",
        detail: "formula.functionList.ISNUMBER.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISODD,
    functionType: t.Information,
    description: "formula.functionList.ISODD.description",
    abstract: "formula.functionList.ISODD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISODD.functionParameter.value.name",
        detail: "formula.functionList.ISODD.functionParameter.value.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISOMITTED,
    functionType: t.Information,
    description: "formula.functionList.ISOMITTED.description",
    abstract: "formula.functionList.ISOMITTED.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISOMITTED.functionParameter.number1.name",
        detail: "formula.functionList.ISOMITTED.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISOMITTED.functionParameter.number2.name",
        detail: "formula.functionList.ISOMITTED.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISREF,
    functionType: t.Information,
    description: "formula.functionList.ISREF.description",
    abstract: "formula.functionList.ISREF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISREF.functionParameter.value.name",
        detail: "formula.functionList.ISREF.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISTEXT,
    functionType: t.Information,
    description: "formula.functionList.ISTEXT.description",
    abstract: "formula.functionList.ISTEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISTEXT.functionParameter.value.name",
        detail: "formula.functionList.ISTEXT.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.ISURL,
    functionType: t.Information,
    description: "formula.functionList.ISURL.description",
    abstract: "formula.functionList.ISURL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISURL.functionParameter.value.name",
        detail: "formula.functionList.ISURL.functionParameter.value.detail",
        example: '"univer.ai"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.N,
    functionType: t.Information,
    description: "formula.functionList.N.description",
    abstract: "formula.functionList.N.abstract",
    functionParameter: [
      {
        name: "formula.functionList.N.functionParameter.value.name",
        detail: "formula.functionList.N.functionParameter.value.detail",
        example: "7",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.NA,
    functionType: t.Information,
    description: "formula.functionList.NA.description",
    abstract: "formula.functionList.NA.abstract",
    functionParameter: []
  },
  {
    functionName: G.SHEET,
    functionType: t.Information,
    description: "formula.functionList.SHEET.description",
    abstract: "formula.functionList.SHEET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SHEET.functionParameter.value.name",
        detail: "formula.functionList.SHEET.functionParameter.value.detail",
        example: "A1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: G.SHEETS,
    functionType: t.Information,
    description: "formula.functionList.SHEETS.description",
    abstract: "formula.functionList.SHEETS.abstract",
    functionParameter: []
  },
  {
    functionName: G.TYPE,
    functionType: t.Information,
    description: "formula.functionList.TYPE.description",
    abstract: "formula.functionList.TYPE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TYPE.functionParameter.value.name",
        detail: "formula.functionList.TYPE.functionParameter.value.detail",
        example: "A2",
        require: 1,
        repeat: 0
      }
    ]
  }
], gr = [
  {
    functionName: K.AND,
    functionType: t.Logical,
    description: "formula.functionList.AND.description",
    abstract: "formula.functionList.AND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AND.functionParameter.logical1.name",
        detail: "formula.functionList.AND.functionParameter.logical1.detail",
        example: "A1=1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AND.functionParameter.logical2.name",
        detail: "formula.functionList.AND.functionParameter.logical2.detail",
        example: "A2=2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: K.BYCOL,
    functionType: t.Logical,
    description: "formula.functionList.BYCOL.description",
    abstract: "formula.functionList.BYCOL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BYCOL.functionParameter.array.name",
        detail: "formula.functionList.BYCOL.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BYCOL.functionParameter.lambda.name",
        detail: "formula.functionList.BYCOL.functionParameter.lambda.detail",
        example: "LAMBDA(array, MAX(array))",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.BYROW,
    functionType: t.Logical,
    description: "formula.functionList.BYROW.description",
    abstract: "formula.functionList.BYROW.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BYROW.functionParameter.array.name",
        detail: "formula.functionList.BYROW.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BYROW.functionParameter.lambda.name",
        detail: "formula.functionList.BYROW.functionParameter.lambda.detail",
        example: "LAMBDA(array, MAX(array))",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.FALSE,
    functionType: t.Logical,
    description: "formula.functionList.FALSE.description",
    abstract: "formula.functionList.FALSE.abstract",
    functionParameter: []
  },
  {
    functionName: K.IF,
    functionType: t.Logical,
    description: "formula.functionList.IF.description",
    abstract: "formula.functionList.IF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IF.functionParameter.logicalTest.name",
        detail: "formula.functionList.IF.functionParameter.logicalTest.detail",
        example: 'A2 = "foo"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IF.functionParameter.valueIfTrue.name",
        detail: "formula.functionList.IF.functionParameter.valueIfTrue.detail",
        example: '"A2 is foo"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IF.functionParameter.valueIfFalse.name",
        detail: "formula.functionList.IF.functionParameter.valueIfFalse.detail",
        example: '"A2 is not foo"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.IFERROR,
    functionType: t.Logical,
    description: "formula.functionList.IFERROR.description",
    abstract: "formula.functionList.IFERROR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IFERROR.functionParameter.value.name",
        detail: "formula.functionList.IFERROR.functionParameter.value.detail",
        example: "A2/B2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IFERROR.functionParameter.valueIfError.name",
        detail: "formula.functionList.IFERROR.functionParameter.valueIfError.detail",
        example: '"Error in calculation"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.IFNA,
    functionType: t.Logical,
    description: "formula.functionList.IFNA.description",
    abstract: "formula.functionList.IFNA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IFNA.functionParameter.value.name",
        detail: "formula.functionList.IFNA.functionParameter.value.detail",
        example: "VLOOKUP(C3,C6:D11,2,FALSE)",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IFNA.functionParameter.valueIfNa.name",
        detail: "formula.functionList.IFNA.functionParameter.valueIfNa.detail",
        example: '"Not Found"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.IFS,
    functionType: t.Logical,
    description: "formula.functionList.IFS.description",
    abstract: "formula.functionList.IFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IFS.functionParameter.logicalTest1.name",
        detail: "formula.functionList.IFS.functionParameter.logicalTest1.detail",
        example: 'A2 = "foo"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IFS.functionParameter.valueIfTrue1.name",
        detail: "formula.functionList.IFS.functionParameter.valueIfTrue1.detail",
        example: '"A2 is foo"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IFS.functionParameter.logicalTest2.name",
        detail: "formula.functionList.IFS.functionParameter.logicalTest2.detail",
        example: "F2=1",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.IFS.functionParameter.valueIfTrue2.name",
        detail: "formula.functionList.IFS.functionParameter.valueIfTrue2.detail",
        example: "D2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: K.LAMBDA,
    functionType: t.Logical,
    description: "formula.functionList.LAMBDA.description",
    abstract: "formula.functionList.LAMBDA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LAMBDA.functionParameter.parameter.name",
        detail: "formula.functionList.LAMBDA.functionParameter.parameter.detail",
        example: "[x, y, …,]",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.LAMBDA.functionParameter.calculation.name",
        detail: "formula.functionList.LAMBDA.functionParameter.calculation.detail",
        example: "x+y",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.LET,
    functionType: t.Logical,
    description: "formula.functionList.LET.description",
    abstract: "formula.functionList.LET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LET.functionParameter.name1.name",
        detail: "formula.functionList.LET.functionParameter.name1.detail",
        example: "x",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LET.functionParameter.nameValue1.name",
        detail: "formula.functionList.LET.functionParameter.nameValue1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LET.functionParameter.calculationOrName2.name",
        detail: "formula.functionList.LET.functionParameter.calculationOrName2.detail",
        example: "y",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LET.functionParameter.nameValue2.name",
        detail: "formula.functionList.LET.functionParameter.nameValue2.detail",
        example: "6",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.LET.functionParameter.calculationOrName3.name",
        detail: "formula.functionList.LET.functionParameter.calculationOrName3.detail",
        example: "SUM(x,y)",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: K.MAKEARRAY,
    aliasFunctionName: "formula.functionList.MAKEARRAY.aliasFunctionName",
    functionType: t.Logical,
    description: "formula.functionList.MAKEARRAY.description",
    abstract: "formula.functionList.MAKEARRAY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MAKEARRAY.functionParameter.number1.name",
        detail: "formula.functionList.MAKEARRAY.functionParameter.number1.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAKEARRAY.functionParameter.number2.name",
        detail: "formula.functionList.MAKEARRAY.functionParameter.number2.detail",
        example: "7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAKEARRAY.functionParameter.value3.name",
        detail: "formula.functionList.MAKEARRAY.functionParameter.value3.detail",
        example: "LAMBDA(r,c, r*c)",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.MAP,
    functionType: t.Logical,
    description: "formula.functionList.MAP.description",
    abstract: "formula.functionList.MAP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MAP.functionParameter.array1.name",
        detail: "formula.functionList.MAP.functionParameter.array1.detail",
        example: "D2:D11",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAP.functionParameter.array2.name",
        detail: "formula.functionList.MAP.functionParameter.array2.detail",
        example: "E2:E11",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.MAP.functionParameter.lambda.name",
        detail: "formula.functionList.MAP.functionParameter.lambda.detail",
        example: 'LAMBDA(s,c,AND(s="Large",c="Red"))',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.NOT,
    functionType: t.Logical,
    description: "formula.functionList.NOT.description",
    abstract: "formula.functionList.NOT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NOT.functionParameter.logical.name",
        detail: "formula.functionList.NOT.functionParameter.logical.detail",
        example: "A2>100",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.OR,
    functionType: t.Logical,
    description: "formula.functionList.OR.description",
    abstract: "formula.functionList.OR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.OR.functionParameter.logical1.name",
        detail: "formula.functionList.OR.functionParameter.logical1.detail",
        example: "A1=1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OR.functionParameter.logical2.name",
        detail: "formula.functionList.OR.functionParameter.logical2.detail",
        example: "A2=2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: K.REDUCE,
    functionType: t.Logical,
    description: "formula.functionList.REDUCE.description",
    abstract: "formula.functionList.REDUCE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REDUCE.functionParameter.initialValue.name",
        detail: "formula.functionList.REDUCE.functionParameter.initialValue.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REDUCE.functionParameter.array.name",
        detail: "formula.functionList.REDUCE.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REDUCE.functionParameter.lambda.name",
        detail: "formula.functionList.REDUCE.functionParameter.lambda.detail",
        example: "LAMBDA(a,b,a+b^2)",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.SCAN,
    functionType: t.Logical,
    description: "formula.functionList.SCAN.description",
    abstract: "formula.functionList.SCAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SCAN.functionParameter.initialValue.name",
        detail: "formula.functionList.SCAN.functionParameter.initialValue.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SCAN.functionParameter.array.name",
        detail: "formula.functionList.SCAN.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SCAN.functionParameter.lambda.name",
        detail: "formula.functionList.SCAN.functionParameter.lambda.detail",
        example: "LAMBDA(a,b,a+b^2)",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: K.SWITCH,
    functionType: t.Logical,
    description: "formula.functionList.SWITCH.description",
    abstract: "formula.functionList.SWITCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SWITCH.functionParameter.expression.name",
        detail: "formula.functionList.SWITCH.functionParameter.expression.detail",
        example: "WEEKDAY(A2)",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SWITCH.functionParameter.value1.name",
        detail: "formula.functionList.SWITCH.functionParameter.value1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SWITCH.functionParameter.result1.name",
        detail: "formula.functionList.SWITCH.functionParameter.result1.detail",
        example: '"Sunday"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SWITCH.functionParameter.defaultOrValue2.name",
        detail: "formula.functionList.SWITCH.functionParameter.defaultOrValue2.detail",
        example: "2",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.SWITCH.functionParameter.result2.name",
        detail: "formula.functionList.SWITCH.functionParameter.result2.detail",
        example: '"Monday"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: K.TRUE,
    functionType: t.Logical,
    description: "formula.functionList.TRUE.description",
    abstract: "formula.functionList.TRUE.abstract",
    functionParameter: []
  },
  {
    functionName: K.XOR,
    functionType: t.Logical,
    description: "formula.functionList.XOR.description",
    abstract: "formula.functionList.XOR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.XOR.functionParameter.logical1.name",
        detail: "formula.functionList.XOR.functionParameter.logical1.detail",
        example: "3>0",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XOR.functionParameter.logical2.name",
        detail: "formula.functionList.XOR.functionParameter.logical2.detail",
        example: "2<9",
        require: 0,
        repeat: 1
      }
    ]
  }
], hr = [
  {
    functionName: g.ADDRESS,
    functionType: t.Lookup,
    description: "formula.functionList.ADDRESS.description",
    abstract: "formula.functionList.ADDRESS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ADDRESS.functionParameter.row_num.name",
        detail: "formula.functionList.ADDRESS.functionParameter.row_num.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ADDRESS.functionParameter.column_num.name",
        detail: "formula.functionList.ADDRESS.functionParameter.column_num.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ADDRESS.functionParameter.abs_num.name",
        detail: "formula.functionList.ADDRESS.functionParameter.abs_num.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.ADDRESS.functionParameter.a1.name",
        detail: "formula.functionList.ADDRESS.functionParameter.a1.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.ADDRESS.functionParameter.sheet_text.name",
        detail: "formula.functionList.ADDRESS.functionParameter.sheet_text.detail",
        example: '"Sheet2"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.AREAS,
    functionType: t.Lookup,
    description: "formula.functionList.AREAS.description",
    abstract: "formula.functionList.AREAS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AREAS.functionParameter.reference.name",
        detail: "formula.functionList.AREAS.functionParameter.reference.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.CHOOSE,
    functionType: t.Lookup,
    description: "formula.functionList.CHOOSE.description",
    abstract: "formula.functionList.CHOOSE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHOOSE.functionParameter.indexNum.name",
        detail: "formula.functionList.CHOOSE.functionParameter.indexNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSE.functionParameter.value1.name",
        detail: "formula.functionList.CHOOSE.functionParameter.value1.detail",
        example: '"Hello"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSE.functionParameter.value2.name",
        detail: "formula.functionList.CHOOSE.functionParameter.value2.detail",
        example: '"Univer"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.CHOOSECOLS,
    functionType: t.Lookup,
    description: "formula.functionList.CHOOSECOLS.description",
    abstract: "formula.functionList.CHOOSECOLS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHOOSECOLS.functionParameter.array.name",
        detail: "formula.functionList.CHOOSECOLS.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSECOLS.functionParameter.colNum1.name",
        detail: "formula.functionList.CHOOSECOLS.functionParameter.colNum1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSECOLS.functionParameter.colNum2.name",
        detail: "formula.functionList.CHOOSECOLS.functionParameter.colNum2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.CHOOSEROWS,
    functionType: t.Lookup,
    description: "formula.functionList.CHOOSEROWS.description",
    abstract: "formula.functionList.CHOOSEROWS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHOOSEROWS.functionParameter.array.name",
        detail: "formula.functionList.CHOOSEROWS.functionParameter.array.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSEROWS.functionParameter.rowNum1.name",
        detail: "formula.functionList.CHOOSEROWS.functionParameter.rowNum1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHOOSEROWS.functionParameter.rowNum2.name",
        detail: "formula.functionList.CHOOSEROWS.functionParameter.rowNum2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.COLUMN,
    functionType: t.Lookup,
    description: "formula.functionList.COLUMN.description",
    abstract: "formula.functionList.COLUMN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COLUMN.functionParameter.reference.name",
        detail: "formula.functionList.COLUMN.functionParameter.reference.detail",
        example: "A1:A20",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.COLUMNS,
    functionType: t.Lookup,
    description: "formula.functionList.COLUMNS.description",
    abstract: "formula.functionList.COLUMNS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COLUMNS.functionParameter.array.name",
        detail: "formula.functionList.COLUMNS.functionParameter.array.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.DROP,
    functionType: t.Lookup,
    description: "formula.functionList.DROP.description",
    abstract: "formula.functionList.DROP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DROP.functionParameter.array.name",
        detail: "formula.functionList.DROP.functionParameter.array.detail",
        example: "A2:C4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DROP.functionParameter.rows.name",
        detail: "formula.functionList.DROP.functionParameter.rows.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DROP.functionParameter.columns.name",
        detail: "formula.functionList.DROP.functionParameter.columns.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.EXPAND,
    functionType: t.Lookup,
    description: "formula.functionList.EXPAND.description",
    abstract: "formula.functionList.EXPAND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EXPAND.functionParameter.array.name",
        detail: "formula.functionList.EXPAND.functionParameter.array.detail",
        example: "A2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPAND.functionParameter.rows.name",
        detail: "formula.functionList.EXPAND.functionParameter.rows.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPAND.functionParameter.columns.name",
        detail: "formula.functionList.EXPAND.functionParameter.columns.detail",
        example: "3",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPAND.functionParameter.padWith.name",
        detail: "formula.functionList.EXPAND.functionParameter.padWith.detail",
        example: '"-"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.FILTER,
    functionType: t.Lookup,
    description: "formula.functionList.FILTER.description",
    abstract: "formula.functionList.FILTER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FILTER.functionParameter.array.name",
        detail: "formula.functionList.FILTER.functionParameter.array.detail",
        example: "A5:D20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FILTER.functionParameter.include.name",
        detail: "formula.functionList.FILTER.functionParameter.include.detail",
        example: '(C5:C20="Apple")*(A5:A20="East")',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FILTER.functionParameter.ifEmpty.name",
        detail: "formula.functionList.FILTER.functionParameter.ifEmpty.detail",
        example: '""',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.FORMULATEXT,
    functionType: t.Lookup,
    description: "formula.functionList.FORMULATEXT.description",
    abstract: "formula.functionList.FORMULATEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORMULATEXT.functionParameter.reference.name",
        detail: "formula.functionList.FORMULATEXT.functionParameter.reference.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.GETPIVOTDATA,
    functionType: t.Lookup,
    description: "formula.functionList.GETPIVOTDATA.description",
    abstract: "formula.functionList.GETPIVOTDATA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GETPIVOTDATA.functionParameter.number1.name",
        detail: "formula.functionList.GETPIVOTDATA.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GETPIVOTDATA.functionParameter.number2.name",
        detail: "formula.functionList.GETPIVOTDATA.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.HLOOKUP,
    functionType: t.Lookup,
    description: "formula.functionList.HLOOKUP.description",
    abstract: "formula.functionList.HLOOKUP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HLOOKUP.functionParameter.lookupValue.name",
        detail: "formula.functionList.HLOOKUP.functionParameter.lookupValue.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HLOOKUP.functionParameter.tableArray.name",
        detail: "formula.functionList.HLOOKUP.functionParameter.tableArray.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HLOOKUP.functionParameter.rowIndexNum.name",
        detail: "formula.functionList.HLOOKUP.functionParameter.rowIndexNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HLOOKUP.functionParameter.rangeLookup.name",
        detail: "formula.functionList.HLOOKUP.functionParameter.rangeLookup.detail",
        example: "false",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.HSTACK,
    functionType: t.Lookup,
    description: "formula.functionList.HSTACK.description",
    abstract: "formula.functionList.HSTACK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HSTACK.functionParameter.array1.name",
        detail: "formula.functionList.HSTACK.functionParameter.array1.detail",
        example: "A2:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HSTACK.functionParameter.array2.name",
        detail: "formula.functionList.HSTACK.functionParameter.array2.detail",
        example: "E2:G3",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.HYPERLINK,
    functionType: t.Lookup,
    description: "formula.functionList.HYPERLINK.description",
    abstract: "formula.functionList.HYPERLINK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HYPERLINK.functionParameter.url.name",
        detail: "formula.functionList.HYPERLINK.functionParameter.url.detail",
        example: '"https://univer.ai/"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPERLINK.functionParameter.linkLabel.name",
        detail: "formula.functionList.HYPERLINK.functionParameter.linkLabel.detail",
        example: '"Univer"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.IMAGE,
    functionType: t.Lookup,
    description: "formula.functionList.IMAGE.description",
    abstract: "formula.functionList.IMAGE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.IMAGE.functionParameter.source.name",
        detail: "formula.functionList.IMAGE.functionParameter.source.detail",
        example: '"https://github.com/dream-num.png"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.IMAGE.functionParameter.altText.name",
        detail: "formula.functionList.IMAGE.functionParameter.altText.detail",
        example: '"Univer Logo"',
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.IMAGE.functionParameter.sizing.name",
        detail: "formula.functionList.IMAGE.functionParameter.sizing.detail",
        example: "3",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.IMAGE.functionParameter.height.name",
        detail: "formula.functionList.IMAGE.functionParameter.height.detail",
        example: "100",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.IMAGE.functionParameter.width.name",
        detail: "formula.functionList.IMAGE.functionParameter.width.detail",
        example: "100",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.INDEX,
    functionType: t.Lookup,
    description: "formula.functionList.INDEX.description",
    abstract: "formula.functionList.INDEX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INDEX.functionParameter.reference.name",
        detail: "formula.functionList.INDEX.functionParameter.reference.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INDEX.functionParameter.rowNum.name",
        detail: "formula.functionList.INDEX.functionParameter.rowNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INDEX.functionParameter.columnNum.name",
        detail: "formula.functionList.INDEX.functionParameter.columnNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.INDEX.functionParameter.areaNum.name",
        detail: "formula.functionList.INDEX.functionParameter.areaNum.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.INDIRECT,
    functionType: t.Lookup,
    description: "formula.functionList.INDIRECT.description",
    abstract: "formula.functionList.INDIRECT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INDIRECT.functionParameter.refText.name",
        detail: "formula.functionList.INDIRECT.functionParameter.refText.detail",
        example: '"A1"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INDIRECT.functionParameter.a1.name",
        detail: "formula.functionList.INDIRECT.functionParameter.a1.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.LOOKUP,
    functionType: t.Lookup,
    description: "formula.functionList.LOOKUP.description",
    abstract: "formula.functionList.LOOKUP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOOKUP.functionParameter.lookupValue.name",
        detail: "formula.functionList.LOOKUP.functionParameter.lookupValue.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOOKUP.functionParameter.lookupVectorOrArray.name",
        detail: "formula.functionList.LOOKUP.functionParameter.lookupVectorOrArray.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOOKUP.functionParameter.resultVector.name",
        detail: "formula.functionList.LOOKUP.functionParameter.resultVector.detail",
        example: "A1:A20",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.MATCH,
    functionType: t.Lookup,
    description: "formula.functionList.MATCH.description",
    abstract: "formula.functionList.MATCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MATCH.functionParameter.lookupValue.name",
        detail: "formula.functionList.MATCH.functionParameter.lookupValue.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MATCH.functionParameter.lookupArray.name",
        detail: "formula.functionList.MATCH.functionParameter.lookupArray.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MATCH.functionParameter.matchType.name",
        detail: "formula.functionList.MATCH.functionParameter.matchType.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.OFFSET,
    functionType: t.Lookup,
    description: "formula.functionList.OFFSET.description",
    abstract: "formula.functionList.OFFSET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.OFFSET.functionParameter.reference.name",
        detail: "formula.functionList.OFFSET.functionParameter.reference.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OFFSET.functionParameter.rows.name",
        detail: "formula.functionList.OFFSET.functionParameter.rows.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OFFSET.functionParameter.cols.name",
        detail: "formula.functionList.OFFSET.functionParameter.cols.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.OFFSET.functionParameter.height.name",
        detail: "formula.functionList.OFFSET.functionParameter.height.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.OFFSET.functionParameter.width.name",
        detail: "formula.functionList.OFFSET.functionParameter.width.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.ROW,
    functionType: t.Lookup,
    description: "formula.functionList.ROW.description",
    abstract: "formula.functionList.ROW.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROW.functionParameter.reference.name",
        detail: "formula.functionList.ROW.functionParameter.reference.detail",
        example: "A1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.ROWS,
    functionType: t.Lookup,
    description: "formula.functionList.ROWS.description",
    abstract: "formula.functionList.ROWS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROWS.functionParameter.array.name",
        detail: "formula.functionList.ROWS.functionParameter.array.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.RTD,
    functionType: t.Lookup,
    description: "formula.functionList.RTD.description",
    abstract: "formula.functionList.RTD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RTD.functionParameter.number1.name",
        detail: "formula.functionList.RTD.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RTD.functionParameter.number2.name",
        detail: "formula.functionList.RTD.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.SORT,
    functionType: t.Lookup,
    description: "formula.functionList.SORT.description",
    abstract: "formula.functionList.SORT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SORT.functionParameter.array.name",
        detail: "formula.functionList.SORT.functionParameter.array.detail",
        example: "A2:A17",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SORT.functionParameter.sortIndex.name",
        detail: "formula.functionList.SORT.functionParameter.sortIndex.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.SORT.functionParameter.sortOrder.name",
        detail: "formula.functionList.SORT.functionParameter.sortOrder.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.SORT.functionParameter.byCol.name",
        detail: "formula.functionList.SORT.functionParameter.byCol.detail",
        example: "false",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.SORTBY,
    functionType: t.Lookup,
    description: "formula.functionList.SORTBY.description",
    abstract: "formula.functionList.SORTBY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SORTBY.functionParameter.array.name",
        detail: "formula.functionList.SORTBY.functionParameter.array.detail",
        example: "D2:D9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SORTBY.functionParameter.byArray1.name",
        detail: "formula.functionList.SORTBY.functionParameter.byArray1.detail",
        example: "E2:E9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SORTBY.functionParameter.sortOrder1.name",
        detail: "formula.functionList.SORTBY.functionParameter.sortOrder1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SORTBY.functionParameter.byArray2.name",
        detail: "formula.functionList.SORTBY.functionParameter.byArray2.detail",
        example: "E2:E9",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.SORTBY.functionParameter.sortOrder2.name",
        detail: "formula.functionList.SORTBY.functionParameter.sortOrder2.detail",
        example: "1",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.TAKE,
    functionType: t.Lookup,
    description: "formula.functionList.TAKE.description",
    abstract: "formula.functionList.TAKE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TAKE.functionParameter.array.name",
        detail: "formula.functionList.TAKE.functionParameter.array.detail",
        example: "A2:C4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TAKE.functionParameter.rows.name",
        detail: "formula.functionList.TAKE.functionParameter.rows.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TAKE.functionParameter.columns.name",
        detail: "formula.functionList.TAKE.functionParameter.columns.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.TOCOL,
    functionType: t.Lookup,
    description: "formula.functionList.TOCOL.description",
    abstract: "formula.functionList.TOCOL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TOCOL.functionParameter.array.name",
        detail: "formula.functionList.TOCOL.functionParameter.array.detail",
        example: "A2:D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TOCOL.functionParameter.ignore.name",
        detail: "formula.functionList.TOCOL.functionParameter.ignore.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TOCOL.functionParameter.scanByColumn.name",
        detail: "formula.functionList.TOCOL.functionParameter.scanByColumn.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.TOROW,
    functionType: t.Lookup,
    description: "formula.functionList.TOROW.description",
    abstract: "formula.functionList.TOROW.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TOROW.functionParameter.array.name",
        detail: "formula.functionList.TOROW.functionParameter.array.detail",
        example: "A2:D4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TOROW.functionParameter.ignore.name",
        detail: "formula.functionList.TOROW.functionParameter.ignore.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TOROW.functionParameter.scanByColumn.name",
        detail: "formula.functionList.TOROW.functionParameter.scanByColumn.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.TRANSPOSE,
    functionType: t.Lookup,
    description: "formula.functionList.TRANSPOSE.description",
    abstract: "formula.functionList.TRANSPOSE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TRANSPOSE.functionParameter.array.name",
        detail: "formula.functionList.TRANSPOSE.functionParameter.array.detail",
        example: "A2:F9",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.UNIQUE,
    functionType: t.Lookup,
    description: "formula.functionList.UNIQUE.description",
    abstract: "formula.functionList.UNIQUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.UNIQUE.functionParameter.array.name",
        detail: "formula.functionList.UNIQUE.functionParameter.array.detail",
        example: "A2:A12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.UNIQUE.functionParameter.byCol.name",
        detail: "formula.functionList.UNIQUE.functionParameter.byCol.detail",
        example: "false",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.UNIQUE.functionParameter.exactlyOnce.name",
        detail: "formula.functionList.UNIQUE.functionParameter.exactlyOnce.detail",
        example: "false",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.VLOOKUP,
    functionType: t.Lookup,
    description: "formula.functionList.VLOOKUP.description",
    abstract: "formula.functionList.VLOOKUP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VLOOKUP.functionParameter.lookupValue.name",
        detail: "formula.functionList.VLOOKUP.functionParameter.lookupValue.detail",
        example: "B2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VLOOKUP.functionParameter.tableArray.name",
        detail: "formula.functionList.VLOOKUP.functionParameter.tableArray.detail",
        example: "C2:E7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VLOOKUP.functionParameter.colIndexNum.name",
        detail: "formula.functionList.VLOOKUP.functionParameter.colIndexNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VLOOKUP.functionParameter.rangeLookup.name",
        detail: "formula.functionList.VLOOKUP.functionParameter.rangeLookup.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.VSTACK,
    functionType: t.Lookup,
    description: "formula.functionList.VSTACK.description",
    abstract: "formula.functionList.VSTACK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VSTACK.functionParameter.array1.name",
        detail: "formula.functionList.VSTACK.functionParameter.array1.detail",
        example: "A2:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VSTACK.functionParameter.array2.name",
        detail: "formula.functionList.VSTACK.functionParameter.array2.detail",
        example: "E2:G3",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: g.WRAPCOLS,
    functionType: t.Lookup,
    description: "formula.functionList.WRAPCOLS.description",
    abstract: "formula.functionList.WRAPCOLS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WRAPCOLS.functionParameter.vector.name",
        detail: "formula.functionList.WRAPCOLS.functionParameter.vector.detail",
        example: "A2:G2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WRAPCOLS.functionParameter.wrapCount.name",
        detail: "formula.functionList.WRAPCOLS.functionParameter.wrapCount.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WRAPCOLS.functionParameter.padWith.name",
        detail: "formula.functionList.WRAPCOLS.functionParameter.padWith.detail",
        example: '"x"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.WRAPROWS,
    functionType: t.Lookup,
    description: "formula.functionList.WRAPROWS.description",
    abstract: "formula.functionList.WRAPROWS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WRAPROWS.functionParameter.vector.name",
        detail: "formula.functionList.WRAPROWS.functionParameter.vector.detail",
        example: "A2:G2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WRAPROWS.functionParameter.wrapCount.name",
        detail: "formula.functionList.WRAPROWS.functionParameter.wrapCount.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WRAPROWS.functionParameter.padWith.name",
        detail: "formula.functionList.WRAPROWS.functionParameter.padWith.detail",
        example: '"x"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.XLOOKUP,
    functionType: t.Lookup,
    description: "formula.functionList.XLOOKUP.description",
    abstract: "formula.functionList.XLOOKUP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.XLOOKUP.functionParameter.lookupValue.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.lookupValue.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XLOOKUP.functionParameter.lookupArray.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.lookupArray.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XLOOKUP.functionParameter.returnArray.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.returnArray.detail",
        example: "B1:B20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XLOOKUP.functionParameter.ifNotFound.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.ifNotFound.detail",
        example: "default",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.XLOOKUP.functionParameter.matchMode.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.matchMode.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.XLOOKUP.functionParameter.searchMode.name",
        detail: "formula.functionList.XLOOKUP.functionParameter.searchMode.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: g.XMATCH,
    functionType: t.Lookup,
    description: "formula.functionList.XMATCH.description",
    abstract: "formula.functionList.XMATCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.XMATCH.functionParameter.lookupValue.name",
        detail: "formula.functionList.XMATCH.functionParameter.lookupValue.detail",
        example: "B1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XMATCH.functionParameter.lookupArray.name",
        detail: "formula.functionList.XMATCH.functionParameter.lookupArray.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.XMATCH.functionParameter.matchMode.name",
        detail: "formula.functionList.XMATCH.functionParameter.matchMode.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.XMATCH.functionParameter.searchMode.name",
        detail: "formula.functionList.XMATCH.functionParameter.searchMode.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  }
], qr = [
  {
    functionName: E.ABS,
    functionType: t.Math,
    description: "formula.functionList.ABS.description",
    abstract: "formula.functionList.ABS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ABS.functionParameter.number.name",
        detail: "formula.functionList.ABS.functionParameter.number.detail",
        example: "-2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ACOS,
    functionType: t.Math,
    description: "formula.functionList.ACOS.description",
    abstract: "formula.functionList.ACOS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACOS.functionParameter.number.name",
        detail: "formula.functionList.ACOS.functionParameter.number.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ACOSH,
    functionType: t.Math,
    description: "formula.functionList.ACOSH.description",
    abstract: "formula.functionList.ACOSH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACOSH.functionParameter.number.name",
        detail: "formula.functionList.ACOSH.functionParameter.number.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ACOT,
    functionType: t.Math,
    description: "formula.functionList.ACOT.description",
    abstract: "formula.functionList.ACOT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACOT.functionParameter.number.name",
        detail: "formula.functionList.ACOT.functionParameter.number.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ACOTH,
    functionType: t.Math,
    description: "formula.functionList.ACOTH.description",
    abstract: "formula.functionList.ACOTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ACOTH.functionParameter.number.name",
        detail: "formula.functionList.ACOTH.functionParameter.number.detail",
        example: "6",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.AGGREGATE,
    functionType: t.Math,
    description: "formula.functionList.AGGREGATE.description",
    abstract: "formula.functionList.AGGREGATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AGGREGATE.functionParameter.functionNum.name",
        detail: "formula.functionList.AGGREGATE.functionParameter.functionNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AGGREGATE.functionParameter.options.name",
        detail: "formula.functionList.AGGREGATE.functionParameter.options.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AGGREGATE.functionParameter.ref1.name",
        detail: "formula.functionList.AGGREGATE.functionParameter.ref1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AGGREGATE.functionParameter.ref2.name",
        detail: "formula.functionList.AGGREGATE.functionParameter.ref2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.ARABIC,
    functionType: t.Math,
    description: "formula.functionList.ARABIC.description",
    abstract: "formula.functionList.ARABIC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ARABIC.functionParameter.text.name",
        detail: "formula.functionList.ARABIC.functionParameter.text.detail",
        example: '"LVII"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ASIN,
    functionType: t.Math,
    description: "formula.functionList.ASIN.description",
    abstract: "formula.functionList.ASIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ASIN.functionParameter.number.name",
        detail: "formula.functionList.ASIN.functionParameter.number.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ASINH,
    functionType: t.Math,
    description: "formula.functionList.ASINH.description",
    abstract: "formula.functionList.ASINH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ASINH.functionParameter.number.name",
        detail: "formula.functionList.ASINH.functionParameter.number.detail",
        example: "10",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ATAN,
    functionType: t.Math,
    description: "formula.functionList.ATAN.description",
    abstract: "formula.functionList.ATAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ATAN.functionParameter.number.name",
        detail: "formula.functionList.ATAN.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ATAN2,
    functionType: t.Math,
    description: "formula.functionList.ATAN2.description",
    abstract: "formula.functionList.ATAN2.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ATAN2.functionParameter.xNum.name",
        detail: "formula.functionList.ATAN2.functionParameter.xNum.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ATAN2.functionParameter.yNum.name",
        detail: "formula.functionList.ATAN2.functionParameter.yNum.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ATANH,
    functionType: t.Math,
    description: "formula.functionList.ATANH.description",
    abstract: "formula.functionList.ATANH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ATANH.functionParameter.number.name",
        detail: "formula.functionList.ATANH.functionParameter.number.detail",
        example: "0.1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.BASE,
    functionType: t.Math,
    description: "formula.functionList.BASE.description",
    abstract: "formula.functionList.BASE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BASE.functionParameter.number.name",
        detail: "formula.functionList.BASE.functionParameter.number.detail",
        example: "15",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BASE.functionParameter.radix.name",
        detail: "formula.functionList.BASE.functionParameter.radix.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BASE.functionParameter.minLength.name",
        detail: "formula.functionList.BASE.functionParameter.minLength.detail",
        example: "10",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.CEILING,
    functionType: t.Math,
    description: "formula.functionList.CEILING.description",
    abstract: "formula.functionList.CEILING.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CEILING.functionParameter.number.name",
        detail: "formula.functionList.CEILING.functionParameter.number.detail",
        example: "2.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CEILING.functionParameter.significance.name",
        detail: "formula.functionList.CEILING.functionParameter.significance.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.CEILING_MATH,
    functionType: t.Math,
    description: "formula.functionList.CEILING_MATH.description",
    abstract: "formula.functionList.CEILING_MATH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CEILING_MATH.functionParameter.number.name",
        detail: "formula.functionList.CEILING_MATH.functionParameter.number.detail",
        example: "-5.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CEILING_MATH.functionParameter.significance.name",
        detail: "formula.functionList.CEILING_MATH.functionParameter.significance.detail",
        example: "2",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.CEILING_MATH.functionParameter.mode.name",
        detail: "formula.functionList.CEILING_MATH.functionParameter.mode.detail",
        example: "-1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.CEILING_PRECISE,
    functionType: t.Math,
    description: "formula.functionList.CEILING_PRECISE.description",
    abstract: "formula.functionList.CEILING_PRECISE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CEILING_PRECISE.functionParameter.number.name",
        detail: "formula.functionList.CEILING_PRECISE.functionParameter.number.detail",
        example: "4.3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CEILING_PRECISE.functionParameter.significance.name",
        detail: "formula.functionList.CEILING_PRECISE.functionParameter.significance.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COMBIN,
    functionType: t.Math,
    description: "formula.functionList.COMBIN.description",
    abstract: "formula.functionList.COMBIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COMBIN.functionParameter.number.name",
        detail: "formula.functionList.COMBIN.functionParameter.number.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COMBIN.functionParameter.numberChosen.name",
        detail: "formula.functionList.COMBIN.functionParameter.numberChosen.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COMBINA,
    functionType: t.Math,
    description: "formula.functionList.COMBINA.description",
    abstract: "formula.functionList.COMBINA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COMBINA.functionParameter.number.name",
        detail: "formula.functionList.COMBINA.functionParameter.number.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COMBINA.functionParameter.numberChosen.name",
        detail: "formula.functionList.COMBINA.functionParameter.numberChosen.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COS,
    functionType: t.Math,
    description: "formula.functionList.COS.description",
    abstract: "formula.functionList.COS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COS.functionParameter.number.name",
        detail: "formula.functionList.COS.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COSH,
    functionType: t.Math,
    description: "formula.functionList.COSH.description",
    abstract: "formula.functionList.COSH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COSH.functionParameter.number.name",
        detail: "formula.functionList.COSH.functionParameter.number.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COT,
    functionType: t.Math,
    description: "formula.functionList.COT.description",
    abstract: "formula.functionList.COT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COT.functionParameter.number.name",
        detail: "formula.functionList.COT.functionParameter.number.detail",
        example: "30",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.COTH,
    functionType: t.Math,
    description: "formula.functionList.COTH.description",
    abstract: "formula.functionList.COTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COTH.functionParameter.number.name",
        detail: "formula.functionList.COTH.functionParameter.number.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.CSC,
    functionType: t.Math,
    description: "formula.functionList.CSC.description",
    abstract: "formula.functionList.CSC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CSC.functionParameter.number.name",
        detail: "formula.functionList.CSC.functionParameter.number.detail",
        example: "15",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.CSCH,
    functionType: t.Math,
    description: "formula.functionList.CSCH.description",
    abstract: "formula.functionList.CSCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CSCH.functionParameter.number.name",
        detail: "formula.functionList.CSCH.functionParameter.number.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.DECIMAL,
    functionType: t.Math,
    description: "formula.functionList.DECIMAL.description",
    abstract: "formula.functionList.DECIMAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DECIMAL.functionParameter.text.name",
        detail: "formula.functionList.DECIMAL.functionParameter.text.detail",
        example: '"FF"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DECIMAL.functionParameter.radix.name",
        detail: "formula.functionList.DECIMAL.functionParameter.radix.detail",
        example: "16",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.DEGREES,
    functionType: t.Math,
    description: "formula.functionList.DEGREES.description",
    abstract: "formula.functionList.DEGREES.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DEGREES.functionParameter.angle.name",
        detail: "formula.functionList.DEGREES.functionParameter.angle.detail",
        example: "PI()",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.EVEN,
    functionType: t.Math,
    description: "formula.functionList.EVEN.description",
    abstract: "formula.functionList.EVEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EVEN.functionParameter.number.name",
        detail: "formula.functionList.EVEN.functionParameter.number.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.EXP,
    functionType: t.Math,
    description: "formula.functionList.EXP.description",
    abstract: "formula.functionList.EXP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EXP.functionParameter.number.name",
        detail: "formula.functionList.EXP.functionParameter.number.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.FACT,
    functionType: t.Math,
    description: "formula.functionList.FACT.description",
    abstract: "formula.functionList.FACT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FACT.functionParameter.number.name",
        detail: "formula.functionList.FACT.functionParameter.number.detail",
        example: "5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.FACTDOUBLE,
    functionType: t.Math,
    description: "formula.functionList.FACTDOUBLE.description",
    abstract: "formula.functionList.FACTDOUBLE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FACTDOUBLE.functionParameter.number.name",
        detail: "formula.functionList.FACTDOUBLE.functionParameter.number.detail",
        example: "6",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.FLOOR,
    functionType: t.Math,
    description: "formula.functionList.FLOOR.description",
    abstract: "formula.functionList.FLOOR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FLOOR.functionParameter.number.name",
        detail: "formula.functionList.FLOOR.functionParameter.number.detail",
        example: "3.7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FLOOR.functionParameter.significance.name",
        detail: "formula.functionList.FLOOR.functionParameter.significance.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.FLOOR_MATH,
    functionType: t.Math,
    description: "formula.functionList.FLOOR_MATH.description",
    abstract: "formula.functionList.FLOOR_MATH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FLOOR_MATH.functionParameter.number.name",
        detail: "formula.functionList.FLOOR_MATH.functionParameter.number.detail",
        example: "-5.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FLOOR_MATH.functionParameter.significance.name",
        detail: "formula.functionList.FLOOR_MATH.functionParameter.significance.detail",
        example: "2",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.FLOOR_MATH.functionParameter.mode.name",
        detail: "formula.functionList.FLOOR_MATH.functionParameter.mode.detail",
        example: "-1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.FLOOR_PRECISE,
    functionType: t.Math,
    description: "formula.functionList.FLOOR_PRECISE.description",
    abstract: "formula.functionList.FLOOR_PRECISE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FLOOR_PRECISE.functionParameter.number.name",
        detail: "formula.functionList.FLOOR_PRECISE.functionParameter.number.detail",
        example: "-3.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FLOOR_PRECISE.functionParameter.significance.name",
        detail: "formula.functionList.FLOOR_PRECISE.functionParameter.significance.detail",
        example: "-1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.GCD,
    functionType: t.Math,
    description: "formula.functionList.GCD.description",
    abstract: "formula.functionList.GCD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GCD.functionParameter.number1.name",
        detail: "formula.functionList.GCD.functionParameter.number1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GCD.functionParameter.number2.name",
        detail: "formula.functionList.GCD.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.INT,
    functionType: t.Math,
    description: "formula.functionList.INT.description",
    abstract: "formula.functionList.INT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INT.functionParameter.number.name",
        detail: "formula.functionList.INT.functionParameter.number.detail",
        example: "8.9",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ISO_CEILING,
    functionType: t.Math,
    description: "formula.functionList.ISO_CEILING.description",
    abstract: "formula.functionList.ISO_CEILING.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ISO_CEILING.functionParameter.number1.name",
        detail: "formula.functionList.ISO_CEILING.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ISO_CEILING.functionParameter.number2.name",
        detail: "formula.functionList.ISO_CEILING.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.LCM,
    functionType: t.Math,
    description: "formula.functionList.LCM.description",
    abstract: "formula.functionList.LCM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LCM.functionParameter.number1.name",
        detail: "formula.functionList.LCM.functionParameter.number1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LCM.functionParameter.number2.name",
        detail: "formula.functionList.LCM.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.LET,
    functionType: t.Math,
    description: "formula.functionList.LET.description",
    abstract: "formula.functionList.LET.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LET.functionParameter.number1.name",
        detail: "formula.functionList.LET.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LET.functionParameter.number2.name",
        detail: "formula.functionList.LET.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.LN,
    functionType: t.Math,
    description: "formula.functionList.LN.description",
    abstract: "formula.functionList.LN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LN.functionParameter.number.name",
        detail: "formula.functionList.LN.functionParameter.number.detail",
        example: "EXP(3)",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.LOG,
    functionType: t.Math,
    description: "formula.functionList.LOG.description",
    abstract: "formula.functionList.LOG.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOG.functionParameter.number.name",
        detail: "formula.functionList.LOG.functionParameter.number.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOG.functionParameter.base.name",
        detail: "formula.functionList.LOG.functionParameter.base.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.LOG10,
    functionType: t.Math,
    description: "formula.functionList.LOG10.description",
    abstract: "formula.functionList.LOG10.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOG10.functionParameter.number.name",
        detail: "formula.functionList.LOG10.functionParameter.number.detail",
        example: "100000",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MDETERM,
    functionType: t.Math,
    description: "formula.functionList.MDETERM.description",
    abstract: "formula.functionList.MDETERM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MDETERM.functionParameter.array.name",
        detail: "formula.functionList.MDETERM.functionParameter.array.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MINVERSE,
    functionType: t.Math,
    description: "formula.functionList.MINVERSE.description",
    abstract: "formula.functionList.MINVERSE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MINVERSE.functionParameter.array.name",
        detail: "formula.functionList.MINVERSE.functionParameter.array.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MMULT,
    functionType: t.Math,
    description: "formula.functionList.MMULT.description",
    abstract: "formula.functionList.MMULT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MMULT.functionParameter.array1.name",
        detail: "formula.functionList.MMULT.functionParameter.array1.detail",
        example: "A2:B3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MMULT.functionParameter.array2.name",
        detail: "formula.functionList.MMULT.functionParameter.array2.detail",
        example: "A5:B6",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MOD,
    functionType: t.Math,
    description: "formula.functionList.MOD.description",
    abstract: "formula.functionList.MOD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MOD.functionParameter.number.name",
        detail: "formula.functionList.MOD.functionParameter.number.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MOD.functionParameter.divisor.name",
        detail: "formula.functionList.MOD.functionParameter.divisor.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MROUND,
    functionType: t.Math,
    description: "formula.functionList.MROUND.description",
    abstract: "formula.functionList.MROUND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MROUND.functionParameter.number.name",
        detail: "formula.functionList.MROUND.functionParameter.number.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MROUND.functionParameter.multiple.name",
        detail: "formula.functionList.MROUND.functionParameter.multiple.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.MULTINOMIAL,
    functionType: t.Math,
    description: "formula.functionList.MULTINOMIAL.description",
    abstract: "formula.functionList.MULTINOMIAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MULTINOMIAL.functionParameter.number1.name",
        detail: "formula.functionList.MULTINOMIAL.functionParameter.number1.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MULTINOMIAL.functionParameter.number2.name",
        detail: "formula.functionList.MULTINOMIAL.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.MUNIT,
    functionType: t.Math,
    description: "formula.functionList.MUNIT.description",
    abstract: "formula.functionList.MUNIT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MUNIT.functionParameter.dimension.name",
        detail: "formula.functionList.MUNIT.functionParameter.dimension.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ODD,
    functionType: t.Math,
    description: "formula.functionList.ODD.description",
    abstract: "formula.functionList.ODD.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ODD.functionParameter.number.name",
        detail: "formula.functionList.ODD.functionParameter.number.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.PI,
    functionType: t.Math,
    description: "formula.functionList.PI.description",
    abstract: "formula.functionList.PI.abstract",
    functionParameter: []
  },
  {
    functionName: E.POWER,
    functionType: t.Math,
    description: "formula.functionList.POWER.description",
    abstract: "formula.functionList.POWER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.POWER.functionParameter.number.name",
        detail: "formula.functionList.POWER.functionParameter.number.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.POWER.functionParameter.power.name",
        detail: "formula.functionList.POWER.functionParameter.power.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.PRODUCT,
    functionType: t.Math,
    description: "formula.functionList.PRODUCT.description",
    abstract: "formula.functionList.PRODUCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PRODUCT.functionParameter.number1.name",
        detail: "formula.functionList.PRODUCT.functionParameter.number1.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PRODUCT.functionParameter.number2.name",
        detail: "formula.functionList.PRODUCT.functionParameter.number2.detail",
        example: "A2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.QUOTIENT,
    functionType: t.Math,
    description: "formula.functionList.QUOTIENT.description",
    abstract: "formula.functionList.QUOTIENT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.QUOTIENT.functionParameter.numerator.name",
        detail: "formula.functionList.QUOTIENT.functionParameter.numerator.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.QUOTIENT.functionParameter.denominator.name",
        detail: "formula.functionList.QUOTIENT.functionParameter.denominator.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.RADIANS,
    functionType: t.Math,
    description: "formula.functionList.RADIANS.description",
    abstract: "formula.functionList.RADIANS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RADIANS.functionParameter.angle.name",
        detail: "formula.functionList.RADIANS.functionParameter.angle.detail",
        example: "270",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.RAND,
    functionType: t.Math,
    description: "formula.functionList.RAND.description",
    abstract: "formula.functionList.RAND.abstract",
    functionParameter: []
  },
  {
    functionName: E.RANDARRAY,
    functionType: t.Math,
    description: "formula.functionList.RANDARRAY.description",
    abstract: "formula.functionList.RANDARRAY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RANDARRAY.functionParameter.rows.name",
        detail: "formula.functionList.RANDARRAY.functionParameter.rows.detail",
        example: "5",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RANDARRAY.functionParameter.columns.name",
        detail: "formula.functionList.RANDARRAY.functionParameter.columns.detail",
        example: "3",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RANDARRAY.functionParameter.min.name",
        detail: "formula.functionList.RANDARRAY.functionParameter.min.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RANDARRAY.functionParameter.max.name",
        detail: "formula.functionList.RANDARRAY.functionParameter.max.detail",
        example: "100",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.RANDARRAY.functionParameter.wholeNumber.name",
        detail: "formula.functionList.RANDARRAY.functionParameter.wholeNumber.detail",
        example: "TRUE",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.RANDBETWEEN,
    functionType: t.Math,
    description: "formula.functionList.RANDBETWEEN.description",
    abstract: "formula.functionList.RANDBETWEEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RANDBETWEEN.functionParameter.bottom.name",
        detail: "formula.functionList.RANDBETWEEN.functionParameter.bottom.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANDBETWEEN.functionParameter.top.name",
        detail: "formula.functionList.RANDBETWEEN.functionParameter.top.detail",
        example: "100",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ROMAN,
    functionType: t.Math,
    description: "formula.functionList.ROMAN.description",
    abstract: "formula.functionList.ROMAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROMAN.functionParameter.number.name",
        detail: "formula.functionList.ROMAN.functionParameter.number.detail",
        example: "499",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ROMAN.functionParameter.form.name",
        detail: "formula.functionList.ROMAN.functionParameter.form.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ROUND,
    functionType: t.Math,
    description: "formula.functionList.ROUND.description",
    abstract: "formula.functionList.ROUND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROUND.functionParameter.number.name",
        detail: "formula.functionList.ROUND.functionParameter.number.detail",
        example: "2.15",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ROUND.functionParameter.numDigits.name",
        detail: "formula.functionList.ROUND.functionParameter.numDigits.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ROUNDBANK,
    functionType: t.Math,
    description: "formula.functionList.ROUNDBANK.description",
    abstract: "formula.functionList.ROUNDBANK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROUNDBANK.functionParameter.number.name",
        detail: "formula.functionList.ROUNDBANK.functionParameter.number.detail",
        example: "2.345",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ROUNDBANK.functionParameter.numDigits.name",
        detail: "formula.functionList.ROUNDBANK.functionParameter.numDigits.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ROUNDDOWN,
    functionType: t.Math,
    description: "formula.functionList.ROUNDDOWN.description",
    abstract: "formula.functionList.ROUNDDOWN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROUNDDOWN.functionParameter.number.name",
        detail: "formula.functionList.ROUNDDOWN.functionParameter.number.detail",
        example: "3.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ROUNDDOWN.functionParameter.numDigits.name",
        detail: "formula.functionList.ROUNDDOWN.functionParameter.numDigits.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.ROUNDUP,
    functionType: t.Math,
    description: "formula.functionList.ROUNDUP.description",
    abstract: "formula.functionList.ROUNDUP.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ROUNDUP.functionParameter.number.name",
        detail: "formula.functionList.ROUNDUP.functionParameter.number.detail",
        example: "3.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ROUNDUP.functionParameter.numDigits.name",
        detail: "formula.functionList.ROUNDUP.functionParameter.numDigits.detail",
        example: "0",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SEC,
    functionType: t.Math,
    description: "formula.functionList.SEC.description",
    abstract: "formula.functionList.SEC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SEC.functionParameter.number.name",
        detail: "formula.functionList.SEC.functionParameter.number.detail",
        example: "30",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SECH,
    functionType: t.Math,
    description: "formula.functionList.SECH.description",
    abstract: "formula.functionList.SECH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SECH.functionParameter.number.name",
        detail: "formula.functionList.SECH.functionParameter.number.detail",
        example: "30",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SERIESSUM,
    functionType: t.Math,
    description: "formula.functionList.SERIESSUM.description",
    abstract: "formula.functionList.SERIESSUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SERIESSUM.functionParameter.x.name",
        detail: "formula.functionList.SERIESSUM.functionParameter.x.detail",
        example: "0.785398163",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SERIESSUM.functionParameter.n.name",
        detail: "formula.functionList.SERIESSUM.functionParameter.n.detail",
        example: "0",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SERIESSUM.functionParameter.m.name",
        detail: "formula.functionList.SERIESSUM.functionParameter.m.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SERIESSUM.functionParameter.coefficients.name",
        detail: "formula.functionList.SERIESSUM.functionParameter.coefficients.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SEQUENCE,
    functionType: t.Math,
    description: "formula.functionList.SEQUENCE.description",
    abstract: "formula.functionList.SEQUENCE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SEQUENCE.functionParameter.rows.name",
        detail: "formula.functionList.SEQUENCE.functionParameter.rows.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SEQUENCE.functionParameter.columns.name",
        detail: "formula.functionList.SEQUENCE.functionParameter.columns.detail",
        example: "5",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.SEQUENCE.functionParameter.start.name",
        detail: "formula.functionList.SEQUENCE.functionParameter.start.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.SEQUENCE.functionParameter.step.name",
        detail: "formula.functionList.SEQUENCE.functionParameter.step.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SIGN,
    functionType: t.Math,
    description: "formula.functionList.SIGN.description",
    abstract: "formula.functionList.SIGN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SIGN.functionParameter.number.name",
        detail: "formula.functionList.SIGN.functionParameter.number.detail",
        example: "10",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SIN,
    functionType: t.Math,
    description: "formula.functionList.SIN.description",
    abstract: "formula.functionList.SIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SIN.functionParameter.number.name",
        detail: "formula.functionList.SIN.functionParameter.number.detail",
        example: "30*PI()/180",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SINH,
    functionType: t.Math,
    description: "formula.functionList.SINH.description",
    abstract: "formula.functionList.SINH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SINH.functionParameter.number.name",
        detail: "formula.functionList.SINH.functionParameter.number.detail",
        example: "0.0342*1.03",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SQRT,
    functionType: t.Math,
    description: "formula.functionList.SQRT.description",
    abstract: "formula.functionList.SQRT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SQRT.functionParameter.number.name",
        detail: "formula.functionList.SQRT.functionParameter.number.detail",
        example: "16",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SQRTPI,
    functionType: t.Math,
    description: "formula.functionList.SQRTPI.description",
    abstract: "formula.functionList.SQRTPI.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SQRTPI.functionParameter.number.name",
        detail: "formula.functionList.SQRTPI.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SUBTOTAL,
    functionType: t.Math,
    description: "formula.functionList.SUBTOTAL.description",
    abstract: "formula.functionList.SUBTOTAL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUBTOTAL.functionParameter.functionNum.name",
        detail: "formula.functionList.SUBTOTAL.functionParameter.functionNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUBTOTAL.functionParameter.ref1.name",
        detail: "formula.functionList.SUBTOTAL.functionParameter.ref1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUBTOTAL.functionParameter.ref2.name",
        detail: "formula.functionList.SUBTOTAL.functionParameter.ref2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.SUM,
    aliasFunctionName: "formula.functionList.SUM.aliasFunctionName",
    functionType: t.Math,
    description: "formula.functionList.SUM.description",
    abstract: "formula.functionList.SUM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUM.functionParameter.number1.name",
        detail: "formula.functionList.SUM.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUM.functionParameter.number2.name",
        detail: "formula.functionList.SUM.functionParameter.number2.detail",
        example: "B2:B10",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.SUMIF,
    aliasFunctionName: "formula.functionList.SUMIF.aliasFunctionName",
    functionType: t.Math,
    description: "formula.functionList.SUMIF.description",
    abstract: "formula.functionList.SUMIF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMIF.functionParameter.range.name",
        detail: "formula.functionList.SUMIF.functionParameter.range.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMIF.functionParameter.criteria.name",
        detail: "formula.functionList.SUMIF.functionParameter.criteria.detail",
        example: '">5"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMIF.functionParameter.sumRange.name",
        detail: "formula.functionList.SUMIF.functionParameter.sumRange.detail",
        example: "B1:B20",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SUMIFS,
    functionType: t.Math,
    description: "formula.functionList.SUMIFS.description",
    abstract: "formula.functionList.SUMIFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMIFS.functionParameter.sumRange.name",
        detail: "formula.functionList.SUMIFS.functionParameter.sumRange.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMIFS.functionParameter.criteriaRange1.name",
        detail: "formula.functionList.SUMIFS.functionParameter.criteriaRange1.detail",
        example: "B1:B20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMIFS.functionParameter.criteria1.name",
        detail: "formula.functionList.SUMIFS.functionParameter.criteria1.detail",
        example: '">10"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMIFS.functionParameter.criteriaRange2.name",
        detail: "formula.functionList.SUMIFS.functionParameter.criteriaRange2.detail",
        example: "C1:C20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.SUMIFS.functionParameter.criteria2.name",
        detail: "formula.functionList.SUMIFS.functionParameter.criteria2.detail",
        example: '"<20"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.SUMPRODUCT,
    functionType: t.Math,
    description: "formula.functionList.SUMPRODUCT.description",
    abstract: "formula.functionList.SUMPRODUCT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMPRODUCT.functionParameter.array1.name",
        detail: "formula.functionList.SUMPRODUCT.functionParameter.array1.detail",
        example: "C2:C5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMPRODUCT.functionParameter.array2.name",
        detail: "formula.functionList.SUMPRODUCT.functionParameter.array2.detail",
        example: "D2:D5",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.SUMSQ,
    functionType: t.Math,
    description: "formula.functionList.SUMSQ.description",
    abstract: "formula.functionList.SUMSQ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMSQ.functionParameter.number1.name",
        detail: "formula.functionList.SUMSQ.functionParameter.number1.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMSQ.functionParameter.number2.name",
        detail: "formula.functionList.SUMSQ.functionParameter.number2.detail",
        example: "4",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: E.SUMX2MY2,
    functionType: t.Math,
    description: "formula.functionList.SUMX2MY2.description",
    abstract: "formula.functionList.SUMX2MY2.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMX2MY2.functionParameter.arrayX.name",
        detail: "formula.functionList.SUMX2MY2.functionParameter.arrayX.detail",
        example: "A2:A8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMX2MY2.functionParameter.arrayY.name",
        detail: "formula.functionList.SUMX2MY2.functionParameter.arrayY.detail",
        example: "B2:B8",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SUMX2PY2,
    functionType: t.Math,
    description: "formula.functionList.SUMX2PY2.description",
    abstract: "formula.functionList.SUMX2PY2.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMX2PY2.functionParameter.arrayX.name",
        detail: "formula.functionList.SUMX2PY2.functionParameter.arrayX.detail",
        example: "A2:A8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMX2PY2.functionParameter.arrayY.name",
        detail: "formula.functionList.SUMX2PY2.functionParameter.arrayY.detail",
        example: "B2:B8",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.SUMXMY2,
    functionType: t.Math,
    description: "formula.functionList.SUMXMY2.description",
    abstract: "formula.functionList.SUMXMY2.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUMXMY2.functionParameter.arrayX.name",
        detail: "formula.functionList.SUMXMY2.functionParameter.arrayX.detail",
        example: "A2:A8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUMXMY2.functionParameter.arrayY.name",
        detail: "formula.functionList.SUMXMY2.functionParameter.arrayY.detail",
        example: "B2:B8",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.TAN,
    functionType: t.Math,
    description: "formula.functionList.TAN.description",
    abstract: "formula.functionList.TAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TAN.functionParameter.number.name",
        detail: "formula.functionList.TAN.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.TANH,
    functionType: t.Math,
    description: "formula.functionList.TANH.description",
    abstract: "formula.functionList.TANH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TANH.functionParameter.number.name",
        detail: "formula.functionList.TANH.functionParameter.number.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: E.TRUNC,
    functionType: t.Math,
    description: "formula.functionList.TRUNC.description",
    abstract: "formula.functionList.TRUNC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TRUNC.functionParameter.number.name",
        detail: "formula.functionList.TRUNC.functionParameter.number.detail",
        example: "0.45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TRUNC.functionParameter.numDigits.name",
        detail: "formula.functionList.TRUNC.functionParameter.numDigits.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  }
], Ur = [
  {
    functionName: s.AVEDEV,
    functionType: t.Statistical,
    description: "formula.functionList.AVEDEV.description",
    abstract: "formula.functionList.AVEDEV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVEDEV.functionParameter.number1.name",
        detail: "formula.functionList.AVEDEV.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVEDEV.functionParameter.number2.name",
        detail: "formula.functionList.AVEDEV.functionParameter.number2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.AVERAGE,
    aliasFunctionName: "formula.functionList.AVERAGE.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.AVERAGE.description",
    abstract: "formula.functionList.AVERAGE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVERAGE.functionParameter.number1.name",
        detail: "formula.functionList.AVERAGE.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGE.functionParameter.number2.name",
        detail: "formula.functionList.AVERAGE.functionParameter.number2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.AVERAGE_WEIGHTED,
    aliasFunctionName: "formula.functionList.AVERAGE_WEIGHTED.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.AVERAGE_WEIGHTED.description",
    abstract: "formula.functionList.AVERAGE_WEIGHTED.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.values.name",
        detail: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.values.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.weights.name",
        detail: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.weights.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.additionalValues.name",
        detail: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.additionalValues.detail",
        example: "20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.additionalWeights.name",
        detail: "formula.functionList.AVERAGE_WEIGHTED.functionParameter.additionalWeights.detail",
        example: "3",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.AVERAGEA,
    functionType: t.Statistical,
    description: "formula.functionList.AVERAGEA.description",
    abstract: "formula.functionList.AVERAGEA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVERAGEA.functionParameter.value1.name",
        detail: "formula.functionList.AVERAGEA.functionParameter.value1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEA.functionParameter.value2.name",
        detail: "formula.functionList.AVERAGEA.functionParameter.value2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.AVERAGEIF,
    functionType: t.Statistical,
    description: "formula.functionList.AVERAGEIF.description",
    abstract: "formula.functionList.AVERAGEIF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVERAGEIF.functionParameter.range.name",
        detail: "formula.functionList.AVERAGEIF.functionParameter.range.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEIF.functionParameter.criteria.name",
        detail: "formula.functionList.AVERAGEIF.functionParameter.criteria.detail",
        example: '">5"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEIF.functionParameter.averageRange.name",
        detail: "formula.functionList.AVERAGEIF.functionParameter.averageRange.detail",
        example: "B1:B20",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.AVERAGEIFS,
    functionType: t.Statistical,
    description: "formula.functionList.AVERAGEIFS.description",
    abstract: "formula.functionList.AVERAGEIFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.AVERAGEIFS.functionParameter.averageRange.name",
        detail: "formula.functionList.AVERAGEIFS.functionParameter.averageRange.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEIFS.functionParameter.criteriaRange1.name",
        detail: "formula.functionList.AVERAGEIFS.functionParameter.criteriaRange1.detail",
        example: "B1:B20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEIFS.functionParameter.criteria1.name",
        detail: "formula.functionList.AVERAGEIFS.functionParameter.criteria1.detail",
        example: '">10"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.AVERAGEIFS.functionParameter.criteriaRange2.name",
        detail: "formula.functionList.AVERAGEIFS.functionParameter.criteriaRange2.detail",
        example: "C1:C20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.AVERAGEIFS.functionParameter.criteria2.name",
        detail: "formula.functionList.AVERAGEIFS.functionParameter.criteria2.detail",
        example: '"<20"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.BETA_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.BETA_DIST.description",
    abstract: "formula.functionList.BETA_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BETA_DIST.functionParameter.x.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.x.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_DIST.functionParameter.alpha.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_DIST.functionParameter.beta.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.beta.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_DIST.functionParameter.A.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.A.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_DIST.functionParameter.B.name",
        detail: "formula.functionList.BETA_DIST.functionParameter.B.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.BETA_INV,
    functionType: t.Statistical,
    description: "formula.functionList.BETA_INV.description",
    abstract: "formula.functionList.BETA_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BETA_INV.functionParameter.probability.name",
        detail: "formula.functionList.BETA_INV.functionParameter.probability.detail",
        example: "0.685470581",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_INV.functionParameter.alpha.name",
        detail: "formula.functionList.BETA_INV.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_INV.functionParameter.beta.name",
        detail: "formula.functionList.BETA_INV.functionParameter.beta.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_INV.functionParameter.A.name",
        detail: "formula.functionList.BETA_INV.functionParameter.A.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.BETA_INV.functionParameter.B.name",
        detail: "formula.functionList.BETA_INV.functionParameter.B.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.BINOM_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.BINOM_DIST.description",
    abstract: "formula.functionList.BINOM_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BINOM_DIST.functionParameter.numberS.name",
        detail: "formula.functionList.BINOM_DIST.functionParameter.numberS.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST.functionParameter.trials.name",
        detail: "formula.functionList.BINOM_DIST.functionParameter.trials.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST.functionParameter.probabilityS.name",
        detail: "formula.functionList.BINOM_DIST.functionParameter.probabilityS.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.BINOM_DIST.functionParameter.cumulative.detail",
        example: "false",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.BINOM_DIST_RANGE,
    functionType: t.Statistical,
    description: "formula.functionList.BINOM_DIST_RANGE.description",
    abstract: "formula.functionList.BINOM_DIST_RANGE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BINOM_DIST_RANGE.functionParameter.trials.name",
        detail: "formula.functionList.BINOM_DIST_RANGE.functionParameter.trials.detail",
        example: "60",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST_RANGE.functionParameter.probabilityS.name",
        detail: "formula.functionList.BINOM_DIST_RANGE.functionParameter.probabilityS.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST_RANGE.functionParameter.numberS.name",
        detail: "formula.functionList.BINOM_DIST_RANGE.functionParameter.numberS.detail",
        example: "45",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_DIST_RANGE.functionParameter.numberS2.name",
        detail: "formula.functionList.BINOM_DIST_RANGE.functionParameter.numberS2.detail",
        example: "50",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.BINOM_INV,
    functionType: t.Statistical,
    description: "formula.functionList.BINOM_INV.description",
    abstract: "formula.functionList.BINOM_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BINOM_INV.functionParameter.trials.name",
        detail: "formula.functionList.BINOM_INV.functionParameter.trials.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_INV.functionParameter.probabilityS.name",
        detail: "formula.functionList.BINOM_INV.functionParameter.probabilityS.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.BINOM_INV.functionParameter.alpha.name",
        detail: "formula.functionList.BINOM_INV.functionParameter.alpha.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CHISQ_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.CHISQ_DIST.description",
    abstract: "formula.functionList.CHISQ_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHISQ_DIST.functionParameter.x.name",
        detail: "formula.functionList.CHISQ_DIST.functionParameter.x.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_DIST.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHISQ_DIST.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.CHISQ_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CHISQ_DIST_RT,
    functionType: t.Statistical,
    description: "formula.functionList.CHISQ_DIST_RT.description",
    abstract: "formula.functionList.CHISQ_DIST_RT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHISQ_DIST_RT.functionParameter.x.name",
        detail: "formula.functionList.CHISQ_DIST_RT.functionParameter.x.detail",
        example: "0.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_DIST_RT.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHISQ_DIST_RT.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CHISQ_INV,
    functionType: t.Statistical,
    description: "formula.functionList.CHISQ_INV.description",
    abstract: "formula.functionList.CHISQ_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHISQ_INV.functionParameter.probability.name",
        detail: "formula.functionList.CHISQ_INV.functionParameter.probability.detail",
        example: "0.93",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_INV.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHISQ_INV.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CHISQ_INV_RT,
    functionType: t.Statistical,
    description: "formula.functionList.CHISQ_INV_RT.description",
    abstract: "formula.functionList.CHISQ_INV_RT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHISQ_INV_RT.functionParameter.probability.name",
        detail: "formula.functionList.CHISQ_INV_RT.functionParameter.probability.detail",
        example: "0.93",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_INV_RT.functionParameter.degFreedom.name",
        detail: "formula.functionList.CHISQ_INV_RT.functionParameter.degFreedom.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CHISQ_TEST,
    functionType: t.Statistical,
    description: "formula.functionList.CHISQ_TEST.description",
    abstract: "formula.functionList.CHISQ_TEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHISQ_TEST.functionParameter.actualRange.name",
        detail: "formula.functionList.CHISQ_TEST.functionParameter.actualRange.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CHISQ_TEST.functionParameter.expectedRange.name",
        detail: "formula.functionList.CHISQ_TEST.functionParameter.expectedRange.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CONFIDENCE_NORM,
    functionType: t.Statistical,
    description: "formula.functionList.CONFIDENCE_NORM.description",
    abstract: "formula.functionList.CONFIDENCE_NORM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONFIDENCE_NORM.functionParameter.alpha.name",
        detail: "formula.functionList.CONFIDENCE_NORM.functionParameter.alpha.detail",
        example: "0.05",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE_NORM.functionParameter.standardDev.name",
        detail: "formula.functionList.CONFIDENCE_NORM.functionParameter.standardDev.detail",
        example: "2.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE_NORM.functionParameter.size.name",
        detail: "formula.functionList.CONFIDENCE_NORM.functionParameter.size.detail",
        example: "50",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CONFIDENCE_T,
    functionType: t.Statistical,
    description: "formula.functionList.CONFIDENCE_T.description",
    abstract: "formula.functionList.CONFIDENCE_T.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONFIDENCE_T.functionParameter.alpha.name",
        detail: "formula.functionList.CONFIDENCE_T.functionParameter.alpha.detail",
        example: "0.05",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE_T.functionParameter.standardDev.name",
        detail: "formula.functionList.CONFIDENCE_T.functionParameter.standardDev.detail",
        example: "2.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONFIDENCE_T.functionParameter.size.name",
        detail: "formula.functionList.CONFIDENCE_T.functionParameter.size.detail",
        example: "50",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.CORREL,
    functionType: t.Statistical,
    description: "formula.functionList.CORREL.description",
    abstract: "formula.functionList.CORREL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CORREL.functionParameter.array1.name",
        detail: "formula.functionList.CORREL.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CORREL.functionParameter.array2.name",
        detail: "formula.functionList.CORREL.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.COUNT,
    aliasFunctionName: "formula.functionList.COUNT.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.COUNT.description",
    abstract: "formula.functionList.COUNT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUNT.functionParameter.value1.name",
        detail: "formula.functionList.COUNT.functionParameter.value1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUNT.functionParameter.value2.name",
        detail: "formula.functionList.COUNT.functionParameter.value2.detail",
        example: "B2:B10",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.COUNTA,
    aliasFunctionName: "formula.functionList.COUNTA.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.COUNTA.description",
    abstract: "formula.functionList.COUNTA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUNTA.functionParameter.number1.name",
        detail: "formula.functionList.COUNTA.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUNTA.functionParameter.number2.name",
        detail: "formula.functionList.COUNTA.functionParameter.number2.detail",
        example: "B2:B10",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.COUNTBLANK,
    functionType: t.Statistical,
    description: "formula.functionList.COUNTBLANK.description",
    abstract: "formula.functionList.COUNTBLANK.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUNTBLANK.functionParameter.range.name",
        detail: "formula.functionList.COUNTBLANK.functionParameter.range.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.COUNTIF,
    functionType: t.Statistical,
    description: "formula.functionList.COUNTIF.description",
    abstract: "formula.functionList.COUNTIF.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUNTIF.functionParameter.range.name",
        detail: "formula.functionList.COUNTIF.functionParameter.range.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUNTIF.functionParameter.criteria.name",
        detail: "formula.functionList.COUNTIF.functionParameter.criteria.detail",
        example: '">5"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.COUNTIFS,
    functionType: t.Statistical,
    description: "formula.functionList.COUNTIFS.description",
    abstract: "formula.functionList.COUNTIFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COUNTIFS.functionParameter.criteriaRange1.name",
        detail: "formula.functionList.COUNTIFS.functionParameter.criteriaRange1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUNTIFS.functionParameter.criteria1.name",
        detail: "formula.functionList.COUNTIFS.functionParameter.criteria1.detail",
        example: '">10"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COUNTIFS.functionParameter.criteriaRange2.name",
        detail: "formula.functionList.COUNTIFS.functionParameter.criteriaRange2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.COUNTIFS.functionParameter.criteria2.name",
        detail: "formula.functionList.COUNTIFS.functionParameter.criteria2.detail",
        example: '"<20"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.COVARIANCE_P,
    functionType: t.Statistical,
    description: "formula.functionList.COVARIANCE_P.description",
    abstract: "formula.functionList.COVARIANCE_P.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COVARIANCE_P.functionParameter.array1.name",
        detail: "formula.functionList.COVARIANCE_P.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COVARIANCE_P.functionParameter.array2.name",
        detail: "formula.functionList.COVARIANCE_P.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.COVARIANCE_S,
    functionType: t.Statistical,
    description: "formula.functionList.COVARIANCE_S.description",
    abstract: "formula.functionList.COVARIANCE_S.abstract",
    functionParameter: [
      {
        name: "formula.functionList.COVARIANCE_S.functionParameter.array1.name",
        detail: "formula.functionList.COVARIANCE_S.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.COVARIANCE_S.functionParameter.array2.name",
        detail: "formula.functionList.COVARIANCE_S.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.DEVSQ,
    functionType: t.Statistical,
    description: "formula.functionList.DEVSQ.description",
    abstract: "formula.functionList.DEVSQ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DEVSQ.functionParameter.number1.name",
        detail: "formula.functionList.DEVSQ.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DEVSQ.functionParameter.number2.name",
        detail: "formula.functionList.DEVSQ.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.EXPON_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.EXPON_DIST.description",
    abstract: "formula.functionList.EXPON_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EXPON_DIST.functionParameter.x.name",
        detail: "formula.functionList.EXPON_DIST.functionParameter.x.detail",
        example: "0.2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPON_DIST.functionParameter.lambda.name",
        detail: "formula.functionList.EXPON_DIST.functionParameter.lambda.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXPON_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.EXPON_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.F_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.F_DIST.description",
    abstract: "formula.functionList.F_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.F_DIST.functionParameter.x.name",
        detail: "formula.functionList.F_DIST.functionParameter.x.detail",
        example: "15.2069",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_DIST.functionParameter.degFreedom1.name",
        detail: "formula.functionList.F_DIST.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_DIST.functionParameter.degFreedom2.name",
        detail: "formula.functionList.F_DIST.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.F_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.F_DIST_RT,
    functionType: t.Statistical,
    description: "formula.functionList.F_DIST_RT.description",
    abstract: "formula.functionList.F_DIST_RT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.F_DIST_RT.functionParameter.x.name",
        detail: "formula.functionList.F_DIST_RT.functionParameter.x.detail",
        example: "15.2069",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_DIST_RT.functionParameter.degFreedom1.name",
        detail: "formula.functionList.F_DIST_RT.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_DIST_RT.functionParameter.degFreedom2.name",
        detail: "formula.functionList.F_DIST_RT.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.F_INV,
    functionType: t.Statistical,
    description: "formula.functionList.F_INV.description",
    abstract: "formula.functionList.F_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.F_INV.functionParameter.probability.name",
        detail: "formula.functionList.F_INV.functionParameter.probability.detail",
        example: "0.01",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_INV.functionParameter.degFreedom1.name",
        detail: "formula.functionList.F_INV.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_INV.functionParameter.degFreedom2.name",
        detail: "formula.functionList.F_INV.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.F_INV_RT,
    functionType: t.Statistical,
    description: "formula.functionList.F_INV_RT.description",
    abstract: "formula.functionList.F_INV_RT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.F_INV_RT.functionParameter.probability.name",
        detail: "formula.functionList.F_INV_RT.functionParameter.probability.detail",
        example: "0.01",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_INV_RT.functionParameter.degFreedom1.name",
        detail: "formula.functionList.F_INV_RT.functionParameter.degFreedom1.detail",
        example: "6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_INV_RT.functionParameter.degFreedom2.name",
        detail: "formula.functionList.F_INV_RT.functionParameter.degFreedom2.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.F_TEST,
    functionType: t.Statistical,
    description: "formula.functionList.F_TEST.description",
    abstract: "formula.functionList.F_TEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.F_TEST.functionParameter.array1.name",
        detail: "formula.functionList.F_TEST.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.F_TEST.functionParameter.array2.name",
        detail: "formula.functionList.F_TEST.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FISHER,
    functionType: t.Statistical,
    description: "formula.functionList.FISHER.description",
    abstract: "formula.functionList.FISHER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FISHER.functionParameter.x.name",
        detail: "formula.functionList.FISHER.functionParameter.x.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FISHERINV,
    functionType: t.Statistical,
    description: "formula.functionList.FISHERINV.description",
    abstract: "formula.functionList.FISHERINV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FISHERINV.functionParameter.y.name",
        detail: "formula.functionList.FISHERINV.functionParameter.y.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST.description",
    abstract: "formula.functionList.FORECAST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST.functionParameter.x.name",
        detail: "formula.functionList.FORECAST.functionParameter.x.detail",
        example: "30",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST.functionParameter.knownYs.name",
        detail: "formula.functionList.FORECAST.functionParameter.knownYs.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST.functionParameter.knownXs.name",
        detail: "formula.functionList.FORECAST.functionParameter.knownXs.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST_ETS,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST_ETS.description",
    abstract: "formula.functionList.FORECAST_ETS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST_ETS.functionParameter.number1.name",
        detail: "formula.functionList.FORECAST_ETS.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_ETS.functionParameter.number2.name",
        detail: "formula.functionList.FORECAST_ETS.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST_ETS_CONFINT,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST_ETS_CONFINT.description",
    abstract: "formula.functionList.FORECAST_ETS_CONFINT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST_ETS_CONFINT.functionParameter.number1.name",
        detail: "formula.functionList.FORECAST_ETS_CONFINT.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_ETS_CONFINT.functionParameter.number2.name",
        detail: "formula.functionList.FORECAST_ETS_CONFINT.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST_ETS_SEASONALITY,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST_ETS_SEASONALITY.description",
    abstract: "formula.functionList.FORECAST_ETS_SEASONALITY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST_ETS_SEASONALITY.functionParameter.number1.name",
        detail: "formula.functionList.FORECAST_ETS_SEASONALITY.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_ETS_SEASONALITY.functionParameter.number2.name",
        detail: "formula.functionList.FORECAST_ETS_SEASONALITY.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST_ETS_STAT,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST_ETS_STAT.description",
    abstract: "formula.functionList.FORECAST_ETS_STAT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST_ETS_STAT.functionParameter.number1.name",
        detail: "formula.functionList.FORECAST_ETS_STAT.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_ETS_STAT.functionParameter.number2.name",
        detail: "formula.functionList.FORECAST_ETS_STAT.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FORECAST_LINEAR,
    functionType: t.Statistical,
    description: "formula.functionList.FORECAST_LINEAR.description",
    abstract: "formula.functionList.FORECAST_LINEAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FORECAST_LINEAR.functionParameter.x.name",
        detail: "formula.functionList.FORECAST_LINEAR.functionParameter.x.detail",
        example: "30",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_LINEAR.functionParameter.knownYs.name",
        detail: "formula.functionList.FORECAST_LINEAR.functionParameter.knownYs.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FORECAST_LINEAR.functionParameter.knownXs.name",
        detail: "formula.functionList.FORECAST_LINEAR.functionParameter.knownXs.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.FREQUENCY,
    functionType: t.Statistical,
    description: "formula.functionList.FREQUENCY.description",
    abstract: "formula.functionList.FREQUENCY.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FREQUENCY.functionParameter.dataArray.name",
        detail: "formula.functionList.FREQUENCY.functionParameter.dataArray.detail",
        example: "A2:A10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FREQUENCY.functionParameter.binsArray.name",
        detail: "formula.functionList.FREQUENCY.functionParameter.binsArray.detail",
        example: "B2:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAMMA,
    functionType: t.Statistical,
    description: "formula.functionList.GAMMA.description",
    abstract: "formula.functionList.GAMMA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMA.functionParameter.number.name",
        detail: "formula.functionList.GAMMA.functionParameter.number.detail",
        example: "2.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAMMA_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.GAMMA_DIST.description",
    abstract: "formula.functionList.GAMMA_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMA_DIST.functionParameter.x.name",
        detail: "formula.functionList.GAMMA_DIST.functionParameter.x.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMA_DIST.functionParameter.alpha.name",
        detail: "formula.functionList.GAMMA_DIST.functionParameter.alpha.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMA_DIST.functionParameter.beta.name",
        detail: "formula.functionList.GAMMA_DIST.functionParameter.beta.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMA_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.GAMMA_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAMMA_INV,
    functionType: t.Statistical,
    description: "formula.functionList.GAMMA_INV.description",
    abstract: "formula.functionList.GAMMA_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMA_INV.functionParameter.probability.name",
        detail: "formula.functionList.GAMMA_INV.functionParameter.probability.detail",
        example: "0.068094",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMA_INV.functionParameter.alpha.name",
        detail: "formula.functionList.GAMMA_INV.functionParameter.alpha.detail",
        example: "9",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GAMMA_INV.functionParameter.beta.name",
        detail: "formula.functionList.GAMMA_INV.functionParameter.beta.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAMMALN,
    functionType: t.Statistical,
    description: "formula.functionList.GAMMALN.description",
    abstract: "formula.functionList.GAMMALN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMALN.functionParameter.x.name",
        detail: "formula.functionList.GAMMALN.functionParameter.x.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAMMALN_PRECISE,
    functionType: t.Statistical,
    description: "formula.functionList.GAMMALN_PRECISE.description",
    abstract: "formula.functionList.GAMMALN_PRECISE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAMMALN_PRECISE.functionParameter.x.name",
        detail: "formula.functionList.GAMMALN_PRECISE.functionParameter.x.detail",
        example: "4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GAUSS,
    functionType: t.Statistical,
    description: "formula.functionList.GAUSS.description",
    abstract: "formula.functionList.GAUSS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GAUSS.functionParameter.z.name",
        detail: "formula.functionList.GAUSS.functionParameter.z.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.GEOMEAN,
    functionType: t.Statistical,
    description: "formula.functionList.GEOMEAN.description",
    abstract: "formula.functionList.GEOMEAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GEOMEAN.functionParameter.number1.name",
        detail: "formula.functionList.GEOMEAN.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GEOMEAN.functionParameter.number2.name",
        detail: "formula.functionList.GEOMEAN.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.GROWTH,
    functionType: t.Statistical,
    description: "formula.functionList.GROWTH.description",
    abstract: "formula.functionList.GROWTH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.GROWTH.functionParameter.knownYs.name",
        detail: "formula.functionList.GROWTH.functionParameter.knownYs.detail",
        example: "B2:B7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.GROWTH.functionParameter.knownXs.name",
        detail: "formula.functionList.GROWTH.functionParameter.knownXs.detail",
        example: "A2:A7",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.GROWTH.functionParameter.newXs.name",
        detail: "formula.functionList.GROWTH.functionParameter.newXs.detail",
        example: "A9:A10",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.GROWTH.functionParameter.constb.name",
        detail: "formula.functionList.GROWTH.functionParameter.constb.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.HARMEAN,
    functionType: t.Statistical,
    description: "formula.functionList.HARMEAN.description",
    abstract: "formula.functionList.HARMEAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HARMEAN.functionParameter.number1.name",
        detail: "formula.functionList.HARMEAN.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HARMEAN.functionParameter.number2.name",
        detail: "formula.functionList.HARMEAN.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.HYPGEOM_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.HYPGEOM_DIST.description",
    abstract: "formula.functionList.HYPGEOM_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.HYPGEOM_DIST.functionParameter.sampleS.name",
        detail: "formula.functionList.HYPGEOM_DIST.functionParameter.sampleS.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOM_DIST.functionParameter.numberSample.name",
        detail: "formula.functionList.HYPGEOM_DIST.functionParameter.numberSample.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOM_DIST.functionParameter.populationS.name",
        detail: "formula.functionList.HYPGEOM_DIST.functionParameter.populationS.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOM_DIST.functionParameter.numberPop.name",
        detail: "formula.functionList.HYPGEOM_DIST.functionParameter.numberPop.detail",
        example: "20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.HYPGEOM_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.HYPGEOM_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.INTERCEPT,
    functionType: t.Statistical,
    description: "formula.functionList.INTERCEPT.description",
    abstract: "formula.functionList.INTERCEPT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.INTERCEPT.functionParameter.knownYs.name",
        detail: "formula.functionList.INTERCEPT.functionParameter.knownYs.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.INTERCEPT.functionParameter.knownXs.name",
        detail: "formula.functionList.INTERCEPT.functionParameter.knownXs.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.KURT,
    functionType: t.Statistical,
    description: "formula.functionList.KURT.description",
    abstract: "formula.functionList.KURT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.KURT.functionParameter.number1.name",
        detail: "formula.functionList.KURT.functionParameter.number1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.KURT.functionParameter.number2.name",
        detail: "formula.functionList.KURT.functionParameter.number2.detail",
        example: "4",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.LARGE,
    functionType: t.Statistical,
    description: "formula.functionList.LARGE.description",
    abstract: "formula.functionList.LARGE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LARGE.functionParameter.array.name",
        detail: "formula.functionList.LARGE.functionParameter.array.detail",
        example: "A2:B6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LARGE.functionParameter.k.name",
        detail: "formula.functionList.LARGE.functionParameter.k.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.LINEST,
    functionType: t.Statistical,
    description: "formula.functionList.LINEST.description",
    abstract: "formula.functionList.LINEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LINEST.functionParameter.knownYs.name",
        detail: "formula.functionList.LINEST.functionParameter.knownYs.detail",
        example: "B2:B7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LINEST.functionParameter.knownXs.name",
        detail: "formula.functionList.LINEST.functionParameter.knownXs.detail",
        example: "A2:A7",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.LINEST.functionParameter.constb.name",
        detail: "formula.functionList.LINEST.functionParameter.constb.detail",
        example: "true",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.LINEST.functionParameter.stats.name",
        detail: "formula.functionList.LINEST.functionParameter.stats.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.LOGEST,
    functionType: t.Statistical,
    description: "formula.functionList.LOGEST.description",
    abstract: "formula.functionList.LOGEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOGEST.functionParameter.knownYs.name",
        detail: "formula.functionList.LOGEST.functionParameter.knownYs.detail",
        example: "B2:B7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGEST.functionParameter.knownXs.name",
        detail: "formula.functionList.LOGEST.functionParameter.knownXs.detail",
        example: "A2:A7",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGEST.functionParameter.constb.name",
        detail: "formula.functionList.LOGEST.functionParameter.constb.detail",
        example: "true",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGEST.functionParameter.stats.name",
        detail: "formula.functionList.LOGEST.functionParameter.stats.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.LOGNORM_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.LOGNORM_DIST.description",
    abstract: "formula.functionList.LOGNORM_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOGNORM_DIST.functionParameter.x.name",
        detail: "formula.functionList.LOGNORM_DIST.functionParameter.x.detail",
        example: "42",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORM_DIST.functionParameter.mean.name",
        detail: "formula.functionList.LOGNORM_DIST.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORM_DIST.functionParameter.standardDev.name",
        detail: "formula.functionList.LOGNORM_DIST.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORM_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.LOGNORM_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.LOGNORM_INV,
    functionType: t.Statistical,
    description: "formula.functionList.LOGNORM_INV.description",
    abstract: "formula.functionList.LOGNORM_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOGNORM_INV.functionParameter.probability.name",
        detail: "formula.functionList.LOGNORM_INV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORM_INV.functionParameter.mean.name",
        detail: "formula.functionList.LOGNORM_INV.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LOGNORM_INV.functionParameter.standardDev.name",
        detail: "formula.functionList.LOGNORM_INV.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.MARGINOFERROR,
    aliasFunctionName: "formula.functionList.MARGINOFERROR.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.MARGINOFERROR.description",
    abstract: "formula.functionList.MARGINOFERROR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MARGINOFERROR.functionParameter.range.name",
        detail: "formula.functionList.MARGINOFERROR.functionParameter.range.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MARGINOFERROR.functionParameter.confidence.name",
        detail: "formula.functionList.MARGINOFERROR.functionParameter.confidence.detail",
        example: "0.95",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.MAX,
    aliasFunctionName: "formula.functionList.MAX.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.MAX.description",
    abstract: "formula.functionList.MAX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MAX.functionParameter.number1.name",
        detail: "formula.functionList.MAX.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAX.functionParameter.number2.name",
        detail: "formula.functionList.MAX.functionParameter.number2.detail",
        example: "B2:B10",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MAXA,
    functionType: t.Statistical,
    description: "formula.functionList.MAXA.description",
    abstract: "formula.functionList.MAXA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MAXA.functionParameter.value1.name",
        detail: "formula.functionList.MAXA.functionParameter.value1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAXA.functionParameter.value2.name",
        detail: "formula.functionList.MAXA.functionParameter.value2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MAXIFS,
    functionType: t.Statistical,
    description: "formula.functionList.MAXIFS.description",
    abstract: "formula.functionList.MAXIFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MAXIFS.functionParameter.maxRange.name",
        detail: "formula.functionList.MAXIFS.functionParameter.maxRange.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAXIFS.functionParameter.criteriaRange1.name",
        detail: "formula.functionList.MAXIFS.functionParameter.criteriaRange1.detail",
        example: "B1:B20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAXIFS.functionParameter.criteria1.name",
        detail: "formula.functionList.MAXIFS.functionParameter.criteria1.detail",
        example: '">10"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MAXIFS.functionParameter.criteriaRange2.name",
        detail: "formula.functionList.MAXIFS.functionParameter.criteriaRange2.detail",
        example: "C1:C20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.MAXIFS.functionParameter.criteria2.name",
        detail: "formula.functionList.MAXIFS.functionParameter.criteria2.detail",
        example: '"<20"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MEDIAN,
    functionType: t.Statistical,
    description: "formula.functionList.MEDIAN.description",
    abstract: "formula.functionList.MEDIAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MEDIAN.functionParameter.number1.name",
        detail: "formula.functionList.MEDIAN.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MEDIAN.functionParameter.number2.name",
        detail: "formula.functionList.MEDIAN.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MIN,
    aliasFunctionName: "formula.functionList.MIN.aliasFunctionName",
    functionType: t.Statistical,
    description: "formula.functionList.MIN.description",
    abstract: "formula.functionList.MIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MIN.functionParameter.number1.name",
        detail: "formula.functionList.MIN.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MIN.functionParameter.number2.name",
        detail: "formula.functionList.MIN.functionParameter.number2.detail",
        example: "B2:B10",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MINA,
    functionType: t.Statistical,
    description: "formula.functionList.MINA.description",
    abstract: "formula.functionList.MINA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MINA.functionParameter.value1.name",
        detail: "formula.functionList.MINA.functionParameter.value1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MINA.functionParameter.value2.name",
        detail: "formula.functionList.MINA.functionParameter.value2.detail",
        example: "B1:B20",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MINIFS,
    functionType: t.Statistical,
    description: "formula.functionList.MINIFS.description",
    abstract: "formula.functionList.MINIFS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MINIFS.functionParameter.minRange.name",
        detail: "formula.functionList.MINIFS.functionParameter.minRange.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MINIFS.functionParameter.criteriaRange1.name",
        detail: "formula.functionList.MINIFS.functionParameter.criteriaRange1.detail",
        example: "B1:B20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MINIFS.functionParameter.criteria1.name",
        detail: "formula.functionList.MINIFS.functionParameter.criteria1.detail",
        example: '">10"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MINIFS.functionParameter.criteriaRange2.name",
        detail: "formula.functionList.MINIFS.functionParameter.criteriaRange2.detail",
        example: "C1:C20",
        require: 0,
        repeat: 1
      },
      {
        name: "formula.functionList.MINIFS.functionParameter.criteria2.name",
        detail: "formula.functionList.MINIFS.functionParameter.criteria2.detail",
        example: '"<20"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MODE_MULT,
    functionType: t.Statistical,
    description: "formula.functionList.MODE_MULT.description",
    abstract: "formula.functionList.MODE_MULT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MODE_MULT.functionParameter.number1.name",
        detail: "formula.functionList.MODE_MULT.functionParameter.number1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MODE_MULT.functionParameter.number2.name",
        detail: "formula.functionList.MODE_MULT.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.MODE_SNGL,
    functionType: t.Statistical,
    description: "formula.functionList.MODE_SNGL.description",
    abstract: "formula.functionList.MODE_SNGL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MODE_SNGL.functionParameter.number1.name",
        detail: "formula.functionList.MODE_SNGL.functionParameter.number1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MODE_SNGL.functionParameter.number2.name",
        detail: "formula.functionList.MODE_SNGL.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.NEGBINOM_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.NEGBINOM_DIST.description",
    abstract: "formula.functionList.NEGBINOM_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NEGBINOM_DIST.functionParameter.numberF.name",
        detail: "formula.functionList.NEGBINOM_DIST.functionParameter.numberF.detail",
        example: "10",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NEGBINOM_DIST.functionParameter.numberS.name",
        detail: "formula.functionList.NEGBINOM_DIST.functionParameter.numberS.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NEGBINOM_DIST.functionParameter.probabilityS.name",
        detail: "formula.functionList.NEGBINOM_DIST.functionParameter.probabilityS.detail",
        example: "0.25",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NEGBINOM_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.NEGBINOM_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.NORM_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.NORM_DIST.description",
    abstract: "formula.functionList.NORM_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORM_DIST.functionParameter.x.name",
        detail: "formula.functionList.NORM_DIST.functionParameter.x.detail",
        example: "42",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_DIST.functionParameter.mean.name",
        detail: "formula.functionList.NORM_DIST.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_DIST.functionParameter.standardDev.name",
        detail: "formula.functionList.NORM_DIST.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.NORM_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.NORM_INV,
    functionType: t.Statistical,
    description: "formula.functionList.NORM_INV.description",
    abstract: "formula.functionList.NORM_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORM_INV.functionParameter.probability.name",
        detail: "formula.functionList.NORM_INV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_INV.functionParameter.mean.name",
        detail: "formula.functionList.NORM_INV.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_INV.functionParameter.standardDev.name",
        detail: "formula.functionList.NORM_INV.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.NORM_S_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.NORM_S_DIST.description",
    abstract: "formula.functionList.NORM_S_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORM_S_DIST.functionParameter.z.name",
        detail: "formula.functionList.NORM_S_DIST.functionParameter.z.detail",
        example: "1.333333",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NORM_S_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.NORM_S_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.NORM_S_INV,
    functionType: t.Statistical,
    description: "formula.functionList.NORM_S_INV.description",
    abstract: "formula.functionList.NORM_S_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NORM_S_INV.functionParameter.probability.name",
        detail: "formula.functionList.NORM_S_INV.functionParameter.probability.detail",
        example: "0.908789",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PEARSON,
    functionType: t.Statistical,
    description: "formula.functionList.PEARSON.description",
    abstract: "formula.functionList.PEARSON.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PEARSON.functionParameter.array1.name",
        detail: "formula.functionList.PEARSON.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PEARSON.functionParameter.array2.name",
        detail: "formula.functionList.PEARSON.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERCENTILE_EXC,
    functionType: t.Statistical,
    description: "formula.functionList.PERCENTILE_EXC.description",
    abstract: "formula.functionList.PERCENTILE_EXC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTILE_EXC.functionParameter.array.name",
        detail: "formula.functionList.PERCENTILE_EXC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTILE_EXC.functionParameter.k.name",
        detail: "formula.functionList.PERCENTILE_EXC.functionParameter.k.detail",
        example: "0.3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERCENTILE_INC,
    functionType: t.Statistical,
    description: "formula.functionList.PERCENTILE_INC.description",
    abstract: "formula.functionList.PERCENTILE_INC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTILE_INC.functionParameter.array.name",
        detail: "formula.functionList.PERCENTILE_INC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTILE_INC.functionParameter.k.name",
        detail: "formula.functionList.PERCENTILE_INC.functionParameter.k.detail",
        example: "0.3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERCENTRANK_EXC,
    functionType: t.Statistical,
    description: "formula.functionList.PERCENTRANK_EXC.description",
    abstract: "formula.functionList.PERCENTRANK_EXC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTRANK_EXC.functionParameter.array.name",
        detail: "formula.functionList.PERCENTRANK_EXC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK_EXC.functionParameter.x.name",
        detail: "formula.functionList.PERCENTRANK_EXC.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK_EXC.functionParameter.significance.name",
        detail: "formula.functionList.PERCENTRANK_EXC.functionParameter.significance.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERCENTRANK_INC,
    functionType: t.Statistical,
    description: "formula.functionList.PERCENTRANK_INC.description",
    abstract: "formula.functionList.PERCENTRANK_INC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERCENTRANK_INC.functionParameter.array.name",
        detail: "formula.functionList.PERCENTRANK_INC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK_INC.functionParameter.x.name",
        detail: "formula.functionList.PERCENTRANK_INC.functionParameter.x.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERCENTRANK_INC.functionParameter.significance.name",
        detail: "formula.functionList.PERCENTRANK_INC.functionParameter.significance.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERMUT,
    functionType: t.Statistical,
    description: "formula.functionList.PERMUT.description",
    abstract: "formula.functionList.PERMUT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERMUT.functionParameter.number.name",
        detail: "formula.functionList.PERMUT.functionParameter.number.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERMUT.functionParameter.numberChosen.name",
        detail: "formula.functionList.PERMUT.functionParameter.numberChosen.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PERMUTATIONA,
    functionType: t.Statistical,
    description: "formula.functionList.PERMUTATIONA.description",
    abstract: "formula.functionList.PERMUTATIONA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PERMUT.functionParameter.number.name",
        detail: "formula.functionList.PERMUT.functionParameter.number.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PERMUT.functionParameter.numberChosen.name",
        detail: "formula.functionList.PERMUT.functionParameter.numberChosen.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PHI,
    functionType: t.Statistical,
    description: "formula.functionList.PHI.description",
    abstract: "formula.functionList.PHI.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PHI.functionParameter.x.name",
        detail: "formula.functionList.PHI.functionParameter.x.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.POISSON_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.POISSON_DIST.description",
    abstract: "formula.functionList.POISSON_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.POISSON_DIST.functionParameter.x.name",
        detail: "formula.functionList.POISSON_DIST.functionParameter.x.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.POISSON_DIST.functionParameter.mean.name",
        detail: "formula.functionList.POISSON_DIST.functionParameter.mean.detail",
        example: "5",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.POISSON_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.POISSON_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.PROB,
    functionType: t.Statistical,
    description: "formula.functionList.PROB.description",
    abstract: "formula.functionList.PROB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PROB.functionParameter.xRange.name",
        detail: "formula.functionList.PROB.functionParameter.xRange.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PROB.functionParameter.probRange.name",
        detail: "formula.functionList.PROB.functionParameter.probRange.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PROB.functionParameter.lowerLimit.name",
        detail: "formula.functionList.PROB.functionParameter.lowerLimit.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PROB.functionParameter.upperLimit.name",
        detail: "formula.functionList.PROB.functionParameter.upperLimit.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.QUARTILE_EXC,
    functionType: t.Statistical,
    description: "formula.functionList.QUARTILE_EXC.description",
    abstract: "formula.functionList.QUARTILE_EXC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.QUARTILE_EXC.functionParameter.array.name",
        detail: "formula.functionList.QUARTILE_EXC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.QUARTILE_EXC.functionParameter.quart.name",
        detail: "formula.functionList.QUARTILE_EXC.functionParameter.quart.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.QUARTILE_INC,
    functionType: t.Statistical,
    description: "formula.functionList.QUARTILE_INC.description",
    abstract: "formula.functionList.QUARTILE_INC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.QUARTILE_INC.functionParameter.array.name",
        detail: "formula.functionList.QUARTILE_INC.functionParameter.array.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.QUARTILE_INC.functionParameter.quart.name",
        detail: "formula.functionList.QUARTILE_INC.functionParameter.quart.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.RANK_AVG,
    functionType: t.Statistical,
    description: "formula.functionList.RANK_AVG.description",
    abstract: "formula.functionList.RANK_AVG.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RANK_AVG.functionParameter.number.name",
        detail: "formula.functionList.RANK_AVG.functionParameter.number.detail",
        example: "A3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK_AVG.functionParameter.ref.name",
        detail: "formula.functionList.RANK_AVG.functionParameter.ref.detail",
        example: "A2:A6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK_AVG.functionParameter.order.name",
        detail: "formula.functionList.RANK_AVG.functionParameter.order.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.RANK_EQ,
    functionType: t.Statistical,
    description: "formula.functionList.RANK_EQ.description",
    abstract: "formula.functionList.RANK_EQ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RANK_EQ.functionParameter.number.name",
        detail: "formula.functionList.RANK_EQ.functionParameter.number.detail",
        example: "A3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK_EQ.functionParameter.ref.name",
        detail: "formula.functionList.RANK_EQ.functionParameter.ref.detail",
        example: "A2:A6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RANK_EQ.functionParameter.order.name",
        detail: "formula.functionList.RANK_EQ.functionParameter.order.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.RSQ,
    functionType: t.Statistical,
    description: "formula.functionList.RSQ.description",
    abstract: "formula.functionList.RSQ.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RSQ.functionParameter.array1.name",
        detail: "formula.functionList.RSQ.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RSQ.functionParameter.array2.name",
        detail: "formula.functionList.RSQ.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.SKEW,
    functionType: t.Statistical,
    description: "formula.functionList.SKEW.description",
    abstract: "formula.functionList.SKEW.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SKEW.functionParameter.number1.name",
        detail: "formula.functionList.SKEW.functionParameter.number1.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SKEW.functionParameter.number2.name",
        detail: "formula.functionList.SKEW.functionParameter.number2.detail",
        example: "4",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.SKEW_P,
    functionType: t.Statistical,
    description: "formula.functionList.SKEW_P.description",
    abstract: "formula.functionList.SKEW_P.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SKEW_P.functionParameter.number1.name",
        detail: "formula.functionList.SKEW_P.functionParameter.number1.detail",
        example: "A1:C3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SKEW_P.functionParameter.number2.name",
        detail: "formula.functionList.SKEW_P.functionParameter.number2.detail",
        example: "4",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.SLOPE,
    functionType: t.Statistical,
    description: "formula.functionList.SLOPE.description",
    abstract: "formula.functionList.SLOPE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SLOPE.functionParameter.knownYs.name",
        detail: "formula.functionList.SLOPE.functionParameter.knownYs.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SLOPE.functionParameter.knownXs.name",
        detail: "formula.functionList.SLOPE.functionParameter.knownXs.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.SMALL,
    functionType: t.Statistical,
    description: "formula.functionList.SMALL.description",
    abstract: "formula.functionList.SMALL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SMALL.functionParameter.array.name",
        detail: "formula.functionList.SMALL.functionParameter.array.detail",
        example: "A2:B6",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SMALL.functionParameter.k.name",
        detail: "formula.functionList.SMALL.functionParameter.k.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.STANDARDIZE,
    functionType: t.Statistical,
    description: "formula.functionList.STANDARDIZE.description",
    abstract: "formula.functionList.STANDARDIZE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STANDARDIZE.functionParameter.x.name",
        detail: "formula.functionList.STANDARDIZE.functionParameter.x.detail",
        example: "42",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STANDARDIZE.functionParameter.mean.name",
        detail: "formula.functionList.STANDARDIZE.functionParameter.mean.detail",
        example: "40",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STANDARDIZE.functionParameter.standardDev.name",
        detail: "formula.functionList.STANDARDIZE.functionParameter.standardDev.detail",
        example: "1.5",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.STDEV_P,
    functionType: t.Statistical,
    description: "formula.functionList.STDEV_P.description",
    abstract: "formula.functionList.STDEV_P.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEV_P.functionParameter.number1.name",
        detail: "formula.functionList.STDEV_P.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEV_P.functionParameter.number2.name",
        detail: "formula.functionList.STDEV_P.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.STDEV_S,
    functionType: t.Statistical,
    description: "formula.functionList.STDEV_S.description",
    abstract: "formula.functionList.STDEV_S.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEV_S.functionParameter.number1.name",
        detail: "formula.functionList.STDEV_S.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEV_S.functionParameter.number2.name",
        detail: "formula.functionList.STDEV_S.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.STDEVA,
    functionType: t.Statistical,
    description: "formula.functionList.STDEVA.description",
    abstract: "formula.functionList.STDEVA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEVA.functionParameter.value1.name",
        detail: "formula.functionList.STDEVA.functionParameter.value1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEVA.functionParameter.value2.name",
        detail: "formula.functionList.STDEVA.functionParameter.value2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.STDEVPA,
    functionType: t.Statistical,
    description: "formula.functionList.STDEVPA.description",
    abstract: "formula.functionList.STDEVPA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STDEVPA.functionParameter.value1.name",
        detail: "formula.functionList.STDEVPA.functionParameter.value1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STDEVPA.functionParameter.value2.name",
        detail: "formula.functionList.STDEVPA.functionParameter.value2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.STEYX,
    functionType: t.Statistical,
    description: "formula.functionList.STEYX.description",
    abstract: "formula.functionList.STEYX.abstract",
    functionParameter: [
      {
        name: "formula.functionList.STEYX.functionParameter.knownYs.name",
        detail: "formula.functionList.STEYX.functionParameter.knownYs.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.STEYX.functionParameter.knownXs.name",
        detail: "formula.functionList.STEYX.functionParameter.knownXs.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.T_DIST.description",
    abstract: "formula.functionList.T_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_DIST.functionParameter.x.name",
        detail: "formula.functionList.T_DIST.functionParameter.x.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_DIST.functionParameter.degFreedom.name",
        detail: "formula.functionList.T_DIST.functionParameter.degFreedom.detail",
        example: "3",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.T_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_DIST_2T,
    functionType: t.Statistical,
    description: "formula.functionList.T_DIST_2T.description",
    abstract: "formula.functionList.T_DIST_2T.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_DIST_2T.functionParameter.x.name",
        detail: "formula.functionList.T_DIST_2T.functionParameter.x.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_DIST_2T.functionParameter.degFreedom.name",
        detail: "formula.functionList.T_DIST_2T.functionParameter.degFreedom.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_DIST_RT,
    functionType: t.Statistical,
    description: "formula.functionList.T_DIST_RT.description",
    abstract: "formula.functionList.T_DIST_RT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_DIST_RT.functionParameter.x.name",
        detail: "formula.functionList.T_DIST_RT.functionParameter.x.detail",
        example: "8",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_DIST_RT.functionParameter.degFreedom.name",
        detail: "formula.functionList.T_DIST_RT.functionParameter.degFreedom.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_INV,
    functionType: t.Statistical,
    description: "formula.functionList.T_INV.description",
    abstract: "formula.functionList.T_INV.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_INV.functionParameter.probability.name",
        detail: "formula.functionList.T_INV.functionParameter.probability.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_INV.functionParameter.degFreedom.name",
        detail: "formula.functionList.T_INV.functionParameter.degFreedom.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_INV_2T,
    functionType: t.Statistical,
    description: "formula.functionList.T_INV_2T.description",
    abstract: "formula.functionList.T_INV_2T.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_INV_2T.functionParameter.probability.name",
        detail: "formula.functionList.T_INV_2T.functionParameter.probability.detail",
        example: "0.75",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_INV_2T.functionParameter.degFreedom.name",
        detail: "formula.functionList.T_INV_2T.functionParameter.degFreedom.detail",
        example: "2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.T_TEST,
    functionType: t.Statistical,
    description: "formula.functionList.T_TEST.description",
    abstract: "formula.functionList.T_TEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T_TEST.functionParameter.array1.name",
        detail: "formula.functionList.T_TEST.functionParameter.array1.detail",
        example: "A1:A4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_TEST.functionParameter.array2.name",
        detail: "formula.functionList.T_TEST.functionParameter.array2.detail",
        example: "B1:B4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_TEST.functionParameter.tails.name",
        detail: "formula.functionList.T_TEST.functionParameter.tails.detail",
        example: "2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.T_TEST.functionParameter.type.name",
        detail: "formula.functionList.T_TEST.functionParameter.type.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.TREND,
    functionType: t.Statistical,
    description: "formula.functionList.TREND.description",
    abstract: "formula.functionList.TREND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TREND.functionParameter.knownYs.name",
        detail: "formula.functionList.TREND.functionParameter.knownYs.detail",
        example: "B2:B7",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TREND.functionParameter.knownXs.name",
        detail: "formula.functionList.TREND.functionParameter.knownXs.detail",
        example: "A2:A7",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TREND.functionParameter.newXs.name",
        detail: "formula.functionList.TREND.functionParameter.newXs.detail",
        example: "A9:A10",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TREND.functionParameter.constb.name",
        detail: "formula.functionList.TREND.functionParameter.constb.detail",
        example: "true",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.TRIMMEAN,
    functionType: t.Statistical,
    description: "formula.functionList.TRIMMEAN.description",
    abstract: "formula.functionList.TRIMMEAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TRIMMEAN.functionParameter.array.name",
        detail: "formula.functionList.TRIMMEAN.functionParameter.array.detail",
        example: "A2:A12",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TRIMMEAN.functionParameter.percent.name",
        detail: "formula.functionList.TRIMMEAN.functionParameter.percent.detail",
        example: "0.2",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.VAR_P,
    functionType: t.Statistical,
    description: "formula.functionList.VAR_P.description",
    abstract: "formula.functionList.VAR_P.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VAR_P.functionParameter.number1.name",
        detail: "formula.functionList.VAR_P.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VAR_P.functionParameter.number2.name",
        detail: "formula.functionList.VAR_P.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.VAR_S,
    functionType: t.Statistical,
    description: "formula.functionList.VAR_S.description",
    abstract: "formula.functionList.VAR_S.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VAR_S.functionParameter.number1.name",
        detail: "formula.functionList.VAR_S.functionParameter.number1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VAR_S.functionParameter.number2.name",
        detail: "formula.functionList.VAR_S.functionParameter.number2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.VARA,
    functionType: t.Statistical,
    description: "formula.functionList.VARA.description",
    abstract: "formula.functionList.VARA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VARA.functionParameter.value1.name",
        detail: "formula.functionList.VARA.functionParameter.value1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VARA.functionParameter.value2.name",
        detail: "formula.functionList.VARA.functionParameter.value2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.VARPA,
    functionType: t.Statistical,
    description: "formula.functionList.VARPA.description",
    abstract: "formula.functionList.VARPA.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VARPA.functionParameter.value1.name",
        detail: "formula.functionList.VARPA.functionParameter.value1.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VARPA.functionParameter.value2.name",
        detail: "formula.functionList.VARPA.functionParameter.value2.detail",
        example: "2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: s.WEIBULL_DIST,
    functionType: t.Statistical,
    description: "formula.functionList.WEIBULL_DIST.description",
    abstract: "formula.functionList.WEIBULL_DIST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WEIBULL_DIST.functionParameter.x.name",
        detail: "formula.functionList.WEIBULL_DIST.functionParameter.x.detail",
        example: "105",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL_DIST.functionParameter.alpha.name",
        detail: "formula.functionList.WEIBULL_DIST.functionParameter.alpha.detail",
        example: "20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL_DIST.functionParameter.beta.name",
        detail: "formula.functionList.WEIBULL_DIST.functionParameter.beta.detail",
        example: "100",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEIBULL_DIST.functionParameter.cumulative.name",
        detail: "formula.functionList.WEIBULL_DIST.functionParameter.cumulative.detail",
        example: "true",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: s.Z_TEST,
    functionType: t.Statistical,
    description: "formula.functionList.Z_TEST.description",
    abstract: "formula.functionList.Z_TEST.abstract",
    functionParameter: [
      {
        name: "formula.functionList.Z_TEST.functionParameter.array.name",
        detail: "formula.functionList.Z_TEST.functionParameter.array.detail",
        example: "A2:A11",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.Z_TEST.functionParameter.x.name",
        detail: "formula.functionList.Z_TEST.functionParameter.x.detail",
        example: "4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.Z_TEST.functionParameter.sigma.name",
        detail: "formula.functionList.Z_TEST.functionParameter.sigma.detail",
        example: "10",
        require: 0,
        repeat: 0
      }
    ]
  }
], Fr = [
  {
    functionName: b.ASC,
    functionType: t.Text,
    description: "formula.functionList.ASC.description",
    abstract: "formula.functionList.ASC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ASC.functionParameter.text.name",
        detail: "formula.functionList.ASC.functionParameter.text.detail",
        example: '"Ｕｎｉｖｅｒ"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.ARRAYTOTEXT,
    functionType: t.Text,
    description: "formula.functionList.ARRAYTOTEXT.description",
    abstract: "formula.functionList.ARRAYTOTEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ARRAYTOTEXT.functionParameter.array.name",
        detail: "formula.functionList.ARRAYTOTEXT.functionParameter.array.detail",
        example: "A2:B4",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.ARRAYTOTEXT.functionParameter.format.name",
        detail: "formula.functionList.ARRAYTOTEXT.functionParameter.format.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.BAHTTEXT,
    functionType: t.Text,
    description: "formula.functionList.BAHTTEXT.description",
    abstract: "formula.functionList.BAHTTEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.BAHTTEXT.functionParameter.number.name",
        detail: "formula.functionList.BAHTTEXT.functionParameter.number.detail",
        example: "1234",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.CHAR,
    functionType: t.Text,
    description: "formula.functionList.CHAR.description",
    abstract: "formula.functionList.CHAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CHAR.functionParameter.number.name",
        detail: "formula.functionList.CHAR.functionParameter.number.detail",
        example: "65",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.CLEAN,
    functionType: t.Text,
    description: "formula.functionList.CLEAN.description",
    abstract: "formula.functionList.CLEAN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CLEAN.functionParameter.text.name",
        detail: "formula.functionList.CLEAN.functionParameter.text.detail",
        example: 'CHAR(1)&"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.CODE,
    functionType: t.Text,
    description: "formula.functionList.CODE.description",
    abstract: "formula.functionList.CODE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CODE.functionParameter.text.name",
        detail: "formula.functionList.CODE.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.CONCAT,
    functionType: t.Text,
    description: "formula.functionList.CONCAT.description",
    abstract: "formula.functionList.CONCAT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONCAT.functionParameter.text1.name",
        detail: "formula.functionList.CONCAT.functionParameter.text1.detail",
        example: '"Hello"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONCAT.functionParameter.text2.name",
        detail: "formula.functionList.CONCAT.functionParameter.text2.detail",
        example: '"Univer"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: b.CONCATENATE,
    functionType: t.Text,
    description: "formula.functionList.CONCATENATE.description",
    abstract: "formula.functionList.CONCATENATE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CONCATENATE.functionParameter.text1.name",
        detail: "formula.functionList.CONCATENATE.functionParameter.text1.detail",
        example: "A1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CONCATENATE.functionParameter.text2.name",
        detail: "formula.functionList.CONCATENATE.functionParameter.text2.detail",
        example: "A2",
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: b.DBCS,
    functionType: t.Text,
    description: "formula.functionList.DBCS.description",
    abstract: "formula.functionList.DBCS.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DBCS.functionParameter.text.name",
        detail: "formula.functionList.DBCS.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.DOLLAR,
    functionType: t.Text,
    description: "formula.functionList.DOLLAR.description",
    abstract: "formula.functionList.DOLLAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.DOLLAR.functionParameter.number.name",
        detail: "formula.functionList.DOLLAR.functionParameter.number.detail",
        example: "1234.567",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.DOLLAR.functionParameter.decimals.name",
        detail: "formula.functionList.DOLLAR.functionParameter.decimals.detail",
        example: "2",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.EXACT,
    functionType: t.Text,
    description: "formula.functionList.EXACT.description",
    abstract: "formula.functionList.EXACT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EXACT.functionParameter.text1.name",
        detail: "formula.functionList.EXACT.functionParameter.text1.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EXACT.functionParameter.text2.name",
        detail: "formula.functionList.EXACT.functionParameter.text2.detail",
        example: '"univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.FIND,
    functionType: t.Text,
    description: "formula.functionList.FIND.description",
    abstract: "formula.functionList.FIND.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FIND.functionParameter.findText.name",
        detail: "formula.functionList.FIND.functionParameter.findText.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FIND.functionParameter.withinText.name",
        detail: "formula.functionList.FIND.functionParameter.withinText.detail",
        example: '"Hello Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FIND.functionParameter.startNum.name",
        detail: "formula.functionList.FIND.functionParameter.startNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.FINDB,
    functionType: t.Text,
    description: "formula.functionList.FINDB.description",
    abstract: "formula.functionList.FINDB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FINDB.functionParameter.findText.name",
        detail: "formula.functionList.FINDB.functionParameter.findText.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FINDB.functionParameter.withinText.name",
        detail: "formula.functionList.FINDB.functionParameter.withinText.detail",
        example: '"Hello Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FINDB.functionParameter.startNum.name",
        detail: "formula.functionList.FINDB.functionParameter.startNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.FIXED,
    functionType: t.Text,
    description: "formula.functionList.FIXED.description",
    abstract: "formula.functionList.FIXED.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FIXED.functionParameter.number.name",
        detail: "formula.functionList.FIXED.functionParameter.number.detail",
        example: "1234.567",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FIXED.functionParameter.decimals.name",
        detail: "formula.functionList.FIXED.functionParameter.decimals.detail",
        example: "2",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.FIXED.functionParameter.noCommas.name",
        detail: "formula.functionList.FIXED.functionParameter.noCommas.detail",
        example: "0",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.LEFT,
    functionType: t.Text,
    description: "formula.functionList.LEFT.description",
    abstract: "formula.functionList.LEFT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LEFT.functionParameter.text.name",
        detail: "formula.functionList.LEFT.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LEFT.functionParameter.numChars.name",
        detail: "formula.functionList.LEFT.functionParameter.numChars.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.LEFTB,
    functionType: t.Text,
    description: "formula.functionList.LEFTB.description",
    abstract: "formula.functionList.LEFTB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LEFTB.functionParameter.text.name",
        detail: "formula.functionList.LEFTB.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.LEFTB.functionParameter.numBytes.name",
        detail: "formula.functionList.LEFTB.functionParameter.numBytes.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.LEN,
    functionType: t.Text,
    description: "formula.functionList.LEN.description",
    abstract: "formula.functionList.LEN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LEN.functionParameter.text.name",
        detail: "formula.functionList.LEN.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.LENB,
    functionType: t.Text,
    description: "formula.functionList.LENB.description",
    abstract: "formula.functionList.LENB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LENB.functionParameter.text.name",
        detail: "formula.functionList.LENB.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.LOWER,
    functionType: t.Text,
    description: "formula.functionList.LOWER.description",
    abstract: "formula.functionList.LOWER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.LOWER.functionParameter.text.name",
        detail: "formula.functionList.LOWER.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.MID,
    functionType: t.Text,
    description: "formula.functionList.MID.description",
    abstract: "formula.functionList.MID.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MID.functionParameter.text.name",
        detail: "formula.functionList.MID.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MID.functionParameter.startNum.name",
        detail: "formula.functionList.MID.functionParameter.startNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MID.functionParameter.numChars.name",
        detail: "formula.functionList.MID.functionParameter.numChars.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.MIDB,
    functionType: t.Text,
    description: "formula.functionList.MIDB.description",
    abstract: "formula.functionList.MIDB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.MIDB.functionParameter.text.name",
        detail: "formula.functionList.MIDB.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MIDB.functionParameter.startNum.name",
        detail: "formula.functionList.MIDB.functionParameter.startNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.MIDB.functionParameter.numBytes.name",
        detail: "formula.functionList.MIDB.functionParameter.numBytes.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.NUMBERSTRING,
    functionType: t.Text,
    description: "formula.functionList.NUMBERSTRING.description",
    abstract: "formula.functionList.NUMBERSTRING.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NUMBERSTRING.functionParameter.number.name",
        detail: "formula.functionList.NUMBERSTRING.functionParameter.number.detail",
        example: "123",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NUMBERSTRING.functionParameter.type.name",
        detail: "formula.functionList.NUMBERSTRING.functionParameter.type.detail",
        example: "1",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.NUMBERVALUE,
    functionType: t.Text,
    description: "formula.functionList.NUMBERVALUE.description",
    abstract: "formula.functionList.NUMBERVALUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.NUMBERVALUE.functionParameter.text.name",
        detail: "formula.functionList.NUMBERVALUE.functionParameter.text.detail",
        example: '"2.500,27"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.NUMBERVALUE.functionParameter.decimalSeparator.name",
        detail: "formula.functionList.NUMBERVALUE.functionParameter.decimalSeparator.detail",
        example: '","',
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.NUMBERVALUE.functionParameter.groupSeparator.name",
        detail: "formula.functionList.NUMBERVALUE.functionParameter.groupSeparator.detail",
        example: '"."',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.PHONETIC,
    functionType: t.Text,
    description: "formula.functionList.PHONETIC.description",
    abstract: "formula.functionList.PHONETIC.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PHONETIC.functionParameter.number1.name",
        detail: "formula.functionList.PHONETIC.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.PHONETIC.functionParameter.number2.name",
        detail: "formula.functionList.PHONETIC.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.PROPER,
    functionType: t.Text,
    description: "formula.functionList.PROPER.description",
    abstract: "formula.functionList.PROPER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.PROPER.functionParameter.text.name",
        detail: "formula.functionList.PROPER.functionParameter.text.detail",
        example: '"hello univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REGEXEXTRACT,
    functionType: t.Text,
    description: "formula.functionList.REGEXEXTRACT.description",
    abstract: "formula.functionList.REGEXEXTRACT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REGEXEXTRACT.functionParameter.text.name",
        detail: "formula.functionList.REGEXEXTRACT.functionParameter.text.detail",
        example: '"abcdefg"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REGEXEXTRACT.functionParameter.regularExpression.name",
        detail: "formula.functionList.REGEXEXTRACT.functionParameter.regularExpression.detail",
        example: '"c.*f"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REGEXMATCH,
    functionType: t.Text,
    description: "formula.functionList.REGEXMATCH.description",
    abstract: "formula.functionList.REGEXMATCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REGEXMATCH.functionParameter.text.name",
        detail: "formula.functionList.REGEXMATCH.functionParameter.text.detail",
        example: '"Spreadsheets"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REGEXMATCH.functionParameter.regularExpression.name",
        detail: "formula.functionList.REGEXMATCH.functionParameter.regularExpression.detail",
        example: '"S.r"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REGEXREPLACE,
    functionType: t.Text,
    description: "formula.functionList.REGEXREPLACE.description",
    abstract: "formula.functionList.REGEXREPLACE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REGEXREPLACE.functionParameter.text.name",
        detail: "formula.functionList.REGEXREPLACE.functionParameter.text.detail",
        example: '"abcedfg"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REGEXREPLACE.functionParameter.regularExpression.name",
        detail: "formula.functionList.REGEXREPLACE.functionParameter.regularExpression.detail",
        example: '"a.*d"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REGEXREPLACE.functionParameter.replacement.name",
        detail: "formula.functionList.REGEXREPLACE.functionParameter.replacement.detail",
        example: '"xyz"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REPLACE,
    functionType: t.Text,
    description: "formula.functionList.REPLACE.description",
    abstract: "formula.functionList.REPLACE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REPLACE.functionParameter.oldText.name",
        detail: "formula.functionList.REPLACE.functionParameter.oldText.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACE.functionParameter.startNum.name",
        detail: "formula.functionList.REPLACE.functionParameter.startNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACE.functionParameter.numChars.name",
        detail: "formula.functionList.REPLACE.functionParameter.numChars.detail",
        example: "0",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACE.functionParameter.newText.name",
        detail: "formula.functionList.REPLACE.functionParameter.newText.detail",
        example: '"Hello "',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REPLACEB,
    functionType: t.Text,
    description: "formula.functionList.REPLACEB.description",
    abstract: "formula.functionList.REPLACEB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REPLACEB.functionParameter.oldText.name",
        detail: "formula.functionList.REPLACEB.functionParameter.oldText.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACEB.functionParameter.startNum.name",
        detail: "formula.functionList.REPLACEB.functionParameter.startNum.detail",
        example: "1",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACEB.functionParameter.numBytes.name",
        detail: "formula.functionList.REPLACEB.functionParameter.numBytes.detail",
        example: "0",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPLACEB.functionParameter.newText.name",
        detail: "formula.functionList.REPLACEB.functionParameter.newText.detail",
        example: '"Hello "',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REPT,
    functionType: t.Text,
    description: "formula.functionList.REPT.description",
    abstract: "formula.functionList.REPT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REPT.functionParameter.text.name",
        detail: "formula.functionList.REPT.functionParameter.text.detail",
        example: '"*-"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REPT.functionParameter.numberTimes.name",
        detail: "formula.functionList.REPT.functionParameter.numberTimes.detail",
        example: "3",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.RIGHT,
    functionType: t.Text,
    description: "formula.functionList.RIGHT.description",
    abstract: "formula.functionList.RIGHT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RIGHT.functionParameter.text.name",
        detail: "formula.functionList.RIGHT.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RIGHT.functionParameter.numChars.name",
        detail: "formula.functionList.RIGHT.functionParameter.numChars.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.RIGHTB,
    functionType: t.Text,
    description: "formula.functionList.RIGHTB.description",
    abstract: "formula.functionList.RIGHTB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.RIGHTB.functionParameter.text.name",
        detail: "formula.functionList.RIGHTB.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.RIGHTB.functionParameter.numBytes.name",
        detail: "formula.functionList.RIGHTB.functionParameter.numBytes.detail",
        example: "3",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.SEARCH,
    functionType: t.Text,
    description: "formula.functionList.SEARCH.description",
    abstract: "formula.functionList.SEARCH.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SEARCH.functionParameter.findText.name",
        detail: "formula.functionList.SEARCH.functionParameter.findText.detail",
        example: '"univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SEARCH.functionParameter.withinText.name",
        detail: "formula.functionList.SEARCH.functionParameter.withinText.detail",
        example: '"Hello Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SEARCH.functionParameter.startNum.name",
        detail: "formula.functionList.SEARCH.functionParameter.startNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.SEARCHB,
    functionType: t.Text,
    description: "formula.functionList.SEARCHB.description",
    abstract: "formula.functionList.SEARCHB.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SEARCHB.functionParameter.findText.name",
        detail: "formula.functionList.SEARCHB.functionParameter.findText.detail",
        example: '"univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SEARCHB.functionParameter.withinText.name",
        detail: "formula.functionList.SEARCHB.functionParameter.withinText.detail",
        example: '"Hello Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SEARCHB.functionParameter.startNum.name",
        detail: "formula.functionList.SEARCHB.functionParameter.startNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.SUBSTITUTE,
    functionType: t.Text,
    description: "formula.functionList.SUBSTITUTE.description",
    abstract: "formula.functionList.SUBSTITUTE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.SUBSTITUTE.functionParameter.text.name",
        detail: "formula.functionList.SUBSTITUTE.functionParameter.text.detail",
        example: '"Hello Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUBSTITUTE.functionParameter.oldText.name",
        detail: "formula.functionList.SUBSTITUTE.functionParameter.oldText.detail",
        example: '"Hello"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUBSTITUTE.functionParameter.newText.name",
        detail: "formula.functionList.SUBSTITUTE.functionParameter.newText.detail",
        example: '"Hi"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.SUBSTITUTE.functionParameter.instanceNum.name",
        detail: "formula.functionList.SUBSTITUTE.functionParameter.instanceNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.T,
    functionType: t.Text,
    description: "formula.functionList.T.description",
    abstract: "formula.functionList.T.abstract",
    functionParameter: [
      {
        name: "formula.functionList.T.functionParameter.value.name",
        detail: "formula.functionList.T.functionParameter.value.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.TEXT,
    functionType: t.Text,
    description: "formula.functionList.TEXT.description",
    abstract: "formula.functionList.TEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TEXT.functionParameter.value.name",
        detail: "formula.functionList.TEXT.functionParameter.value.detail",
        example: "1.23",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXT.functionParameter.formatText.name",
        detail: "formula.functionList.TEXT.functionParameter.formatText.detail",
        example: '"$0.00"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.TEXTAFTER,
    functionType: t.Text,
    description: "formula.functionList.TEXTAFTER.description",
    abstract: "formula.functionList.TEXTAFTER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.text.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.text.detail",
        example: '"Red riding hood’s, red hood"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.delimiter.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.delimiter.detail",
        example: '"hood"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.instanceNum.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.instanceNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.matchMode.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.matchMode.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.matchEnd.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.matchEnd.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTAFTER.functionParameter.ifNotFound.name",
        detail: "formula.functionList.TEXTAFTER.functionParameter.ifNotFound.detail",
        example: '"not found"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.TEXTBEFORE,
    functionType: t.Text,
    description: "formula.functionList.TEXTBEFORE.description",
    abstract: "formula.functionList.TEXTBEFORE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.text.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.text.detail",
        example: '"Red riding hood’s, red hood"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.delimiter.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.delimiter.detail",
        example: '"hood"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.instanceNum.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.instanceNum.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.matchMode.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.matchMode.detail",
        example: "1",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.matchEnd.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.matchEnd.detail",
        example: "0",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTBEFORE.functionParameter.ifNotFound.name",
        detail: "formula.functionList.TEXTBEFORE.functionParameter.ifNotFound.detail",
        example: '"not found"',
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.TEXTJOIN,
    functionType: t.Text,
    description: "formula.functionList.TEXTJOIN.description",
    abstract: "formula.functionList.TEXTJOIN.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TEXTJOIN.functionParameter.delimiter.name",
        detail: "formula.functionList.TEXTJOIN.functionParameter.delimiter.detail",
        example: '", "',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTJOIN.functionParameter.ignoreEmpty.name",
        detail: "formula.functionList.TEXTJOIN.functionParameter.ignoreEmpty.detail",
        example: "true",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTJOIN.functionParameter.text1.name",
        detail: "formula.functionList.TEXTJOIN.functionParameter.text1.detail",
        example: '"Hi"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTJOIN.functionParameter.text2.name",
        detail: "formula.functionList.TEXTJOIN.functionParameter.text2.detail",
        example: '"Univer"',
        require: 0,
        repeat: 1
      }
    ]
  },
  {
    functionName: b.TEXTSPLIT,
    functionType: t.Text,
    description: "formula.functionList.TEXTSPLIT.description",
    abstract: "formula.functionList.TEXTSPLIT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.text.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.text.detail",
        example: "A1:C2",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.colDelimiter.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.colDelimiter.detail",
        example: '","',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.rowDelimiter.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.rowDelimiter.detail",
        example: '";"',
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.ignoreEmpty.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.ignoreEmpty.detail",
        example: "",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.matchMode.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.matchMode.detail",
        example: "",
        require: 0,
        repeat: 0
      },
      {
        name: "formula.functionList.TEXTSPLIT.functionParameter.padWith.name",
        detail: "formula.functionList.TEXTSPLIT.functionParameter.padWith.detail",
        example: "",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.TRIM,
    functionType: t.Text,
    description: "formula.functionList.TRIM.description",
    abstract: "formula.functionList.TRIM.abstract",
    functionParameter: [
      {
        name: "formula.functionList.TRIM.functionParameter.text.name",
        detail: "formula.functionList.TRIM.functionParameter.text.detail",
        example: '" Hello  Univer "',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.UNICHAR,
    functionType: t.Text,
    description: "formula.functionList.UNICHAR.description",
    abstract: "formula.functionList.UNICHAR.abstract",
    functionParameter: [
      {
        name: "formula.functionList.UNICHAR.functionParameter.number.name",
        detail: "formula.functionList.UNICHAR.functionParameter.number.detail",
        example: "65",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.UNICODE,
    functionType: t.Text,
    description: "formula.functionList.UNICODE.description",
    abstract: "formula.functionList.UNICODE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.UNICODE.functionParameter.text.name",
        detail: "formula.functionList.UNICODE.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.UPPER,
    functionType: t.Text,
    description: "formula.functionList.UPPER.description",
    abstract: "formula.functionList.UPPER.abstract",
    functionParameter: [
      {
        name: "formula.functionList.UPPER.functionParameter.text.name",
        detail: "formula.functionList.UPPER.functionParameter.text.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.VALUE,
    functionType: t.Text,
    description: "formula.functionList.VALUE.description",
    abstract: "formula.functionList.VALUE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VALUE.functionParameter.text.name",
        detail: "formula.functionList.VALUE.functionParameter.text.detail",
        example: '"123"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.VALUETOTEXT,
    functionType: t.Text,
    description: "formula.functionList.VALUETOTEXT.description",
    abstract: "formula.functionList.VALUETOTEXT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.VALUETOTEXT.functionParameter.value.name",
        detail: "formula.functionList.VALUETOTEXT.functionParameter.value.detail",
        example: '"Univer"',
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.VALUETOTEXT.functionParameter.format.name",
        detail: "formula.functionList.VALUETOTEXT.functionParameter.format.detail",
        example: "1",
        require: 0,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.CALL,
    functionType: t.Text,
    description: "formula.functionList.CALL.description",
    abstract: "formula.functionList.CALL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.CALL.functionParameter.number1.name",
        detail: "formula.functionList.CALL.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.CALL.functionParameter.number2.name",
        detail: "formula.functionList.CALL.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.EUROCONVERT,
    functionType: t.Text,
    description: "formula.functionList.EUROCONVERT.description",
    abstract: "formula.functionList.EUROCONVERT.abstract",
    functionParameter: [
      {
        name: "formula.functionList.EUROCONVERT.functionParameter.number1.name",
        detail: "formula.functionList.EUROCONVERT.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.EUROCONVERT.functionParameter.number2.name",
        detail: "formula.functionList.EUROCONVERT.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: b.REGISTER_ID,
    functionType: t.Text,
    description: "formula.functionList.REGISTER_ID.description",
    abstract: "formula.functionList.REGISTER_ID.abstract",
    functionParameter: [
      {
        name: "formula.functionList.REGISTER_ID.functionParameter.number1.name",
        detail: "formula.functionList.REGISTER_ID.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.REGISTER_ID.functionParameter.number2.name",
        detail: "formula.functionList.REGISTER_ID.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  }
], Br = [], vr = [
  {
    functionName: At.ENCODEURL,
    functionType: t.Web,
    description: "formula.functionList.ENCODEURL.description",
    abstract: "formula.functionList.ENCODEURL.abstract",
    functionParameter: [
      {
        name: "formula.functionList.ENCODEURL.functionParameter.text.name",
        detail: "formula.functionList.ENCODEURL.functionParameter.text.detail",
        example: '"https://univer.ai/"',
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: At.FILTERXML,
    functionType: t.Web,
    description: "formula.functionList.FILTERXML.description",
    abstract: "formula.functionList.FILTERXML.abstract",
    functionParameter: [
      {
        name: "formula.functionList.FILTERXML.functionParameter.number1.name",
        detail: "formula.functionList.FILTERXML.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.FILTERXML.functionParameter.number2.name",
        detail: "formula.functionList.FILTERXML.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  },
  {
    functionName: At.WEBSERVICE,
    functionType: t.Web,
    description: "formula.functionList.WEBSERVICE.description",
    abstract: "formula.functionList.WEBSERVICE.abstract",
    functionParameter: [
      {
        name: "formula.functionList.WEBSERVICE.functionParameter.number1.name",
        detail: "formula.functionList.WEBSERVICE.functionParameter.number1.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      },
      {
        name: "formula.functionList.WEBSERVICE.functionParameter.number2.name",
        detail: "formula.functionList.WEBSERVICE.functionParameter.number2.detail",
        example: "A1:A20",
        require: 1,
        repeat: 0
      }
    ]
  }
], Vr = [
  ..._r,
  ...Mr,
  ...qr,
  ...Ur,
  ...hr,
  ...Or,
  ...Fr,
  ...gr,
  ...yr,
  ...xr,
  ...br,
  ...Dr,
  ...vr,
  ...Cr,
  ...Br
];
function Gr(n, e) {
  let a = "";
  return n.aliasFunctionName ? (a = e.t(n.aliasFunctionName), a === n.aliasFunctionName && (a = n.functionName)) : a = n.functionName, a;
}
var Hr = Object.getOwnPropertyDescriptor, wr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Hr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, yt = (n, e) => (a, i) => e(a, i, n);
const Et = Kt("formula.description-service");
let Gt = class {
  constructor(n, e, a) {
    w(this, "_descriptions", []);
    this._functionService = n, this._localeService = e, this._configService = a, this._initialize();
  }
  dispose() {
    this._localeService.localeChanged$.complete();
  }
  getDescriptions() {
    return this._functionService.getDescriptions();
  }
  hasFunction(n) {
    return this._functionService.getDescriptions().get(n.toLocaleUpperCase()) !== void 0;
  }
  getFunctionInfo(n) {
    return this._functionService.getDescriptions().get(n.toLocaleUpperCase());
  }
  getSearchListByName(n) {
    const e = [], a = this._functionService.getDescriptions(), i = n.toLocaleUpperCase().trim();
    return a.forEach((r) => {
      const { functionName: o, abstract: u, functionType: f } = r;
      o.toLocaleUpperCase().indexOf(i) > -1 && f !== t.DefinedName && e.push({ name: o, desc: u });
    }), e;
  }
  getSearchListByNameFirstLetter(n) {
    const e = [], a = this._functionService.getDescriptions(), i = n.toLocaleUpperCase().trim();
    return a.forEach((r) => {
      const { functionName: o, abstract: u, functionType: f } = r;
      o.toLocaleUpperCase().indexOf(i) === 0 && e.push({ name: o, desc: u, functionType: f });
    }), e;
  }
  getSearchListByType(n) {
    const e = [];
    return this._functionService.getDescriptions().forEach((i) => {
      const { functionName: r, functionType: o, abstract: u } = i;
      (o === n || n === -1) && o !== t.DefinedName && e.push({ name: r, desc: u });
    }), e;
  }
  registerDescriptions(n) {
    return this._descriptions = this._descriptions.concat(n), this._registerDescriptions(), ee(() => {
      const e = n.map((a) => a.functionName);
      this.unregisterDescriptions(e);
    });
  }
  unregisterDescriptions(n) {
    this._descriptions = this._descriptions.filter((e) => !n.includes(e.functionName)), this._functionService.unregisterDescriptions(...n);
  }
  hasDescription(n) {
    return this._descriptions.some((e) => e.functionName === n);
  }
  hasDefinedNameDescription(n) {
    return this._descriptions.some((e) => e.functionName === n && e.functionType === t.DefinedName);
  }
  isFormulaDefinedName(n) {
    const e = this._descriptions.filter((i) => i.functionName === n && i.functionType === t.DefinedName);
    if (e.length === 0)
      return !1;
    const a = e[0].description;
    return !Wn(a);
  }
  _initialize() {
    this._localeService.localeChanged$.subscribe(() => {
      this._registerDescriptions();
    }), this._initDescription(), this._registerDescriptions();
  }
  _initDescription() {
    var i;
    const n = [
      ...Kn,
      ...kn,
      ...Qn,
      ...$n,
      ...jn,
      ...zn,
      ...Zn,
      ...Jn,
      ...ei,
      ...ti,
      ...ai,
      ...ni,
      ...ii,
      ...ri,
      ...oi,
      ...ui
    ].map((r) => r[1]), e = Vr.filter((r) => n.includes(r.functionName)), a = this._configService.getConfig(Ue);
    this._descriptions = e.concat((i = a == null ? void 0 : a.description) != null ? i : []);
  }
  _registerDescriptions() {
    const n = this._localeService, e = this._descriptions.map((a) => ({
      functionName: Gr(a, n),
      functionType: a.functionType,
      description: n.t(a.description),
      abstract: n.t(a.abstract),
      functionParameter: a.functionParameter.map((i) => ({
        name: n.t(i.name),
        detail: n.t(i.detail),
        example: i.example,
        require: i.require,
        repeat: i.repeat
      }))
    }));
    this._functionService.registerDescriptions(...e);
  }
};
Gt = wr([
  yt(0, Tt),
  yt(1, H(Wt)),
  yt(2, be)
], Gt);
var Yr = Object.getOwnPropertyDescriptor, Xr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Yr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, we = (n, e) => (a, i) => e(a, i, n);
let rt = class extends z {
  constructor(e, a, i, r) {
    super();
    w(this, "_preUnitId", null);
    this._descriptionService = e, this._definedNamesService = a, this._univerInstanceService = i, this._commandService = r, this._initialize();
  }
  _initialize() {
    this._descriptionListener(), this._changeUnitListener(), this._changeSheetListener();
  }
  _descriptionListener() {
    ee(
      this._definedNamesService.update$.subscribe(() => {
        this._registerDescriptions();
      })
    );
  }
  _changeUnitListener() {
    ee(
      this._univerInstanceService.getCurrentTypeOfUnit$(j.UNIVER_SHEET).subscribe(() => {
        this._unRegisterDescriptions(), this._registerDescriptions();
      })
    );
  }
  _changeSheetListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((e, a) => {
        if (!(a != null && a.fromCollab)) {
          if (e.id === Ha.id)
            this._unregisterDescriptionsForNotInSheetId(), this._registerDescriptions();
          else if (e.id === De.id) {
            const i = e.params;
            this._registerDescription(i);
          } else if (e.id === vt.id) {
            const i = e.params;
            this._unregisterDescription(i);
          }
        }
      })
    );
  }
  _registerDescription(e) {
    const { unitId: a, sheetId: i } = this._getUnitIdAndSheetId();
    if (a == null || i == null)
      return;
    const { name: r, comment: o, formulaOrRefString: u, localSheetId: f } = e;
    !this._descriptionService.hasDescription(r) && (f == null || f === St || f === i) && this._descriptionService.registerDescriptions([{
      functionName: r,
      description: u + (o || ""),
      abstract: u,
      functionType: t.DefinedName,
      functionParameter: []
    }]);
  }
  _unregisterDescription(e) {
    const { name: a } = e;
    this._descriptionService.unregisterDescriptions([a]);
  }
  _unRegisterDescriptions() {
    if (this._preUnitId == null)
      return;
    const e = this._definedNamesService.getDefinedNameMap(this._preUnitId);
    if (e == null)
      return;
    const a = [];
    Array.from(Object.values(e)).forEach((i) => {
      const { name: r } = i;
      a.push(r);
    }), this._descriptionService.unregisterDescriptions(a), this._preUnitId = null;
  }
  _getUnitIdAndSheetId() {
    const e = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET);
    if (e == null)
      return {};
    const a = e.getActiveSheet();
    return a == null ? {} : {
      unitId: e.getUnitId(),
      sheetId: a.getSheetId()
    };
  }
  _registerDescriptions() {
    const { unitId: e, sheetId: a } = this._getUnitIdAndSheetId();
    if (e == null || a == null)
      return;
    const i = this._definedNamesService.getDefinedNameMap(e);
    if (!i)
      return;
    const r = [];
    this._preUnitId = e, Array.from(Object.values(i)).forEach((o) => {
      const { name: u, comment: f, formulaOrRefString: m, localSheetId: c } = o;
      !this._descriptionService.hasDescription(u) && (c == null || c === St || c === a) && r.push({
        functionName: u,
        description: m + (f || ""),
        abstract: m,
        functionType: t.DefinedName,
        functionParameter: []
      });
    }), this._descriptionService.registerDescriptions(r);
  }
  _unregisterDescriptionsForNotInSheetId() {
    const { unitId: e, sheetId: a } = this._getUnitIdAndSheetId();
    if (e == null || a == null)
      return;
    const i = this._definedNamesService.getDefinedNameMap(e);
    if (!i)
      return;
    const r = [];
    Array.from(Object.values(i)).forEach((o) => {
      const { name: u, localSheetId: f } = o;
      f !== St && f !== a && r.push(u);
    }), this._descriptionService.unregisterDescriptions(r);
  }
};
rt = Xr([
  we(0, Et),
  we(1, Lt),
  we(2, Ee),
  we(3, re)
], rt);
var Wr = Object.getOwnPropertyDescriptor, Kr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Wr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, kr = (n, e) => (a, i) => e(a, i, n);
let ot = class extends z {
  constructor(n) {
    super(), this._commandService = n, [
      Ri,
      Si,
      _e
    ].forEach((e) => this._commandService.registerCommand(e));
  }
};
ot = Kr([
  kr(0, re)
], ot);
var Qr = Object.getOwnPropertyDescriptor, $r = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Qr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, Ye = (n, e) => (a, i) => e(a, i, n);
let ut = class extends z {
  constructor(e, a, i, r) {
    super();
    w(this, "_preUnitId", null);
    this._descriptionService = e, this._univerInstanceService = a, this._commandService = i, this._superTableService = r, this._initialize();
  }
  _initialize() {
    this._descriptionListener(), this._changeUnitListener(), this._changeSheetListener();
  }
  _descriptionListener() {
    ee(
      this._superTableService.update$.subscribe(() => {
        this._registerDescriptions();
      })
    );
  }
  _changeUnitListener() {
    ee(
      this._univerInstanceService.getCurrentTypeOfUnit$(j.UNIVER_SHEET).subscribe(() => {
        this._unRegisterDescriptions(), this._registerDescriptions();
      })
    );
  }
  _changeSheetListener() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((e, a) => {
        if (!(a != null && a.fromCollab)) {
          if (e.id === Ha.id)
            this._unregisterDescriptionsForNotInSheetId(), this._registerDescriptions();
          else if (e.id === mi.id) {
            const i = e.params;
            this._registerDescription(i);
          } else if (e.id === fi.id) {
            const i = e.params;
            this._unregisterDescription(i);
          }
        }
      })
    );
  }
  _registerDescription(e) {
    var u, f;
    const { unitId: a, sheetId: i } = this._getUnitIdAndSheetId();
    if (a == null || i == null)
      return;
    const { tableName: r, reference: o } = e;
    if (!this._descriptionService.hasDescription(r)) {
      const m = ((f = (u = this._univerInstanceService.getUnit(a)) == null ? void 0 : u.getSheetBySheetId(o.sheetId)) == null ? void 0 : f.getName()) || "", c = Ze(m, o.range);
      this._descriptionService.registerDescriptions([{
        functionName: r,
        description: c,
        abstract: c,
        functionType: t.Table,
        functionParameter: []
      }]);
    }
  }
  _unregisterDescription(e) {
    const { tableName: a } = e;
    this._descriptionService.unregisterDescriptions([a]);
  }
  _unRegisterDescriptions() {
    if (this._preUnitId == null)
      return;
    const e = this._superTableService.getTableMap(this._preUnitId);
    if (e == null)
      return;
    const a = [];
    e.forEach((i, r) => {
      a.push(r);
    }), this._descriptionService.unregisterDescriptions(a), this._preUnitId = null;
  }
  _getUnitIdAndSheetId() {
    const e = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET);
    if (e == null)
      return {};
    const a = e.getActiveSheet();
    return a == null ? {} : {
      unitId: e.getUnitId(),
      sheetId: a.getSheetId()
    };
  }
  _registerDescriptions() {
    const { unitId: e, sheetId: a } = this._getUnitIdAndSheetId();
    if (e == null || a == null)
      return;
    const i = this._superTableService.getTableMap(e);
    if (!i)
      return;
    const r = [];
    this._preUnitId = e, i.forEach((o, u) => {
      var c, l;
      const f = ((l = (c = this._univerInstanceService.getUnit(e)) == null ? void 0 : c.getSheetBySheetId(o.sheetId)) == null ? void 0 : l.getName()) || "", m = Ze(f, o.range);
      this._descriptionService.hasDescription(u) || r.push({
        functionName: u,
        description: m,
        abstract: m,
        functionType: t.Table,
        functionParameter: []
      });
    }), this._descriptionService.registerDescriptions(r);
  }
  _unregisterDescriptionsForNotInSheetId() {
    const { unitId: e, sheetId: a } = this._getUnitIdAndSheetId();
    if (e == null || a == null)
      return;
    const i = this._superTableService.getTableMap(e);
    if (!i)
      return;
    const r = [];
    i.forEach((o, u) => {
      r.push(u);
    }), this._descriptionService.unregisterDescriptions(r);
  }
};
ut = $r([
  Ye(0, Et),
  Ye(1, Ee),
  Ye(2, re),
  Ye(3, ci)
], ut);
var jr = Object.getOwnPropertyDescriptor, zr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? jr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, Xe = (n, e) => (a, i) => e(a, i, n);
function Ea(n, e, a, i) {
  const r = n.sequenceNodesBuilder(e);
  if (r == null)
    return e;
  const o = [];
  for (let u = 0, f = r.length; u < f; u++) {
    const m = r[u];
    if (typeof m == "string" || m.nodeType !== ie.REFERENCE)
      continue;
    const { token: c } = m, l = Pe(c), { sheetName: p, unitId: T } = l;
    let L = l.range;
    L.startAbsoluteRefType === je.ALL && L.endAbsoluteRefType === je.ALL || (L = qt(L, a, i), o.push({
      unitId: T,
      sheetName: p,
      range: L
    }));
  }
  return o.map((u) => `${u.unitId}!${u.sheetName}!${u.range.startRow}!${u.range.endRow}!${u.range.startColumn}!${u.range.endColumn}`).join("|");
}
let Ht = class extends z {
  constructor(n, e, a, i) {
    super(), this._refRangeService = n, this._lexerTreeBuilder = e, this._univerInstanceService = a, this._injector = i;
  }
  transformFormulaByEffectCommand(n, e, a, i) {
    const r = this._lexerTreeBuilder.sequenceNodesBuilder(a), o = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET), u = o.getActiveSheet(), f = o.getUnitId(), m = u.getSheetId(), c = r == null ? void 0 : r.map((l) => {
      if (typeof l == "object" && l.nodeType === ie.REFERENCE) {
        const p = Pe(l.token), { range: T, unitId: L, sheetName: I } = p, A = this._univerInstanceService.getUnit(L || n), N = I ? A == null ? void 0 : A.getSheetBySheetName(I) : A == null ? void 0 : A.getSheetBySheetId(e);
        if (!N)
          throw new Error("Sheet not found");
        const d = A.getUnitId(), S = N.getSheetId();
        if (d !== f || S !== m)
          return l;
        const R = ua(T, i);
        let P = "";
        if (R) {
          const h = R.startColumn - T.startColumn, M = R.startRow - T.startRow, U = qt(T, h, M);
          L && I ? P = sa(L, I, U) : I ? P = Ze(I, U) : P = Ce(U);
        } else
          P = k.REF;
        return {
          ...l,
          token: P
        };
      } else
        return l;
    });
    return c ? `=${ze(c)}` : "";
  }
  registerFormula(n, e, a, i) {
    const r = /* @__PURE__ */ new Map(), o = this._lexerTreeBuilder.sequenceNodesBuilder(a), u = new $e(), f = (m) => {
      const c = this._univerInstanceService.getCurrentUnitForType(j.UNIVER_SHEET), l = c.getActiveSheet(), p = c.getUnitId(), T = l.getSheetId(), L = o == null ? void 0 : o.map((A) => {
        if (typeof A == "object" && A.nodeType === ie.REFERENCE) {
          const N = r.get(A.token);
          if (N.unitId !== p || N.subUnitId !== T)
            return A;
          const d = ua(N.range, m);
          let S = "";
          if (d) {
            const R = d.startColumn - N.range.startColumn, P = d.startRow - N.range.startRow, h = qt(N.range, R, P);
            N.unitId && N.sheetName ? S = sa(N.unitId, N.sheetName, h) : N.sheetName ? S = Ze(N.sheetName, h) : S = Ce(h);
          } else
            S = k.REF;
          return {
            ...A,
            token: S
          };
        } else
          return A;
      }), I = L && ze(L);
      return i(`=${I}`);
    };
    return o == null || o.forEach((m) => {
      if (typeof m == "object" && m.nodeType === ie.REFERENCE) {
        const c = Pe(m.token), { range: l, unitId: p, sheetName: T } = c, L = this._univerInstanceService.getUnit(p || n), I = T ? L == null ? void 0 : L.getSheetBySheetName(T) : L == null ? void 0 : L.getSheetBySheetId(e);
        if (!I)
          return;
        const A = L.getUnitId(), N = I.getSheetId(), d = {
          unitId: A,
          subUnitId: N,
          range: l,
          sheetName: T
        };
        r.set(m.token, d), u.add(this._refRangeService.registerRefRange(l, f, A, N));
      }
    }), u;
  }
  _getFormulaDependcy(n, e, a, i) {
    const r = ye(a) ? this._lexerTreeBuilder.sequenceNodesBuilder(a) : null, o = [];
    return r == null || r.forEach((u) => {
      if (typeof u == "object" && u.nodeType === ie.REFERENCE) {
        const f = Pe(u.token), { range: m, unitId: c, sheetName: l } = f;
        if (m.startAbsoluteRefType === je.ALL && m.endAbsoluteRefType === je.ALL)
          return;
        const p = this._univerInstanceService.getUnit(c || n), T = l ? p == null ? void 0 : p.getSheetBySheetName(l) : p == null ? void 0 : p.getSheetBySheetId(e);
        if (!T)
          return;
        const L = p.getUnitId(), I = T.getSheetId(), A = i[0].startRow, N = i[0].startColumn, d = m.startRow, S = m.startColumn, R = i.map((P) => ({
          startRow: P.startRow - A + d,
          endRow: P.endRow - A + d,
          startColumn: P.startColumn - N + S,
          endColumn: P.endColumn - N + S
        }));
        o.push({
          unitId: L,
          subUnitId: I,
          ranges: R
        });
      }
    }), o;
  }
  // eslint-disable-next-line max-lines-per-function
  registerRangeFormula(n, e, a, i, r) {
    const o = new $e(), u = i.map((m) => this._getFormulaDependcy(n, e, m, a)), f = (m) => {
      const c = a[0].startRow, l = a[0].startColumn, p = [{ unitId: n, subUnitId: e, ranges: a }, ...u.flat()], T = [], L = Bn(this._injector, m);
      for (const { unitId: I, subUnitId: A, ranges: N } of p)
        if (I === L.unitId && A === L.subUnitId) {
          const d = [], S = N[0].startRow, R = N[0].startColumn, P = S - c, h = R - l;
          for (const M of L.ranges) {
            const U = N.map((q) => ke(M, q)).filter(Boolean);
            U.length > 0 && d.push(...U);
          }
          d.length > 0 && T.push(
            d.map((M) => ({
              startRow: M.startRow - P,
              endRow: M.endRow - P,
              startColumn: M.startColumn - h,
              endColumn: M.endColumn - h
            }))
          );
        }
      if (T.length > 0) {
        const I = fe.splitIntoGrid([...T.flat()]), A = fe.subtractMulti(a, I);
        A.sort((P, h) => P.startRow - h.startRow || P.startColumn - h.startColumn);
        const N = /* @__PURE__ */ new Map();
        for (let P = 0; P < I.length; P++) {
          const h = I[P], M = h.startRow, U = h.startColumn, q = M - c, x = U - l, F = vn(h, m).sort((Z, oe) => Z.startRow - oe.startRow || Z.startColumn - oe.startColumn);
          if (!F.length)
            continue;
          const B = F[0].startRow, ae = F[0].startColumn, O = B - c, ce = ae - l, ne = [];
          for (let Z = 0; Z < i.length; Z++) {
            const oe = i[Z], ue = ye(oe), Fe = ue ? this._lexerTreeBuilder.moveFormulaRefOffset(oe, x, q) : oe, J = ue ? this.transformFormulaByEffectCommand(n, e, Fe, m) : Fe, Nt = Ea(this._lexerTreeBuilder, J, -ce, -O);
            ne.push({
              newFormula: J,
              orginFormula: Nt
            });
          }
          const le = {
            formulas: ne,
            ranges: F,
            key: ne.map((Z) => Z.orginFormula).join("_")
          };
          N.has(le.key) ? N.get(le.key).push(le) : N.set(le.key, [le]);
        }
        const d = i.map((P) => Ea(this._lexerTreeBuilder, P, 0, 0)).join("_");
        if (A.length > 0) {
          const P = A[0].startRow, h = A[0].startColumn, M = [];
          for (let q = 0; q < i.length; q++) {
            const x = i[q];
            M.push({
              newFormula: ye(x) ? this._lexerTreeBuilder.moveFormulaRefOffset(x, h - l, P - c) : x,
              orginFormula: x
            });
          }
          const U = {
            formulas: M,
            ranges: A,
            key: d
          };
          N.has(U.key) ? N.get(U.key).push(U) : N.set(U.key, [U]);
        }
        const S = [], R = Array.from(N.keys());
        for (let P = R.length - 1; P >= 0; P--) {
          const h = R[P], M = N.get(h).sort((x, F) => x.ranges[0].startRow - F.ranges[0].startRow || x.ranges[0].startColumn - F.ranges[0].startColumn), U = [];
          for (let x = 0; x < M[0].formulas.length; x++)
            U.push(M[0].formulas[x].newFormula);
          const q = fe.mergeRanges(M.map((x) => x.ranges).flat());
          q.sort((x, F) => x.startRow - F.startRow || x.startColumn - F.startColumn), S.push({
            formulas: U,
            ranges: q
          });
        }
        return r(S);
      }
      return {
        undos: [],
        redos: []
      };
    };
    return a.forEach((m) => {
      const c = this._refRangeService.registerRefRange(m, f, n, e);
      o.add(c);
    }), [...u.flat()].forEach(({ unitId: m, subUnitId: c, ranges: l }) => {
      l.forEach((p) => {
        const T = this._refRangeService.registerRefRange(p, f, m, c);
        o.add(T);
      });
    }), o;
  }
};
Ht = zr([
  Xe(0, H(Fn)),
  Xe(1, H(Pt)),
  Xe(2, Ee),
  Xe(3, H(st))
], Ht);
var Zr = Object.getOwnPropertyDescriptor, Jr = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? Zr(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, eo = (n, e) => (a, i) => e(a, i, n);
const $t = "sheets-formula.remote-register-function.service", Za = Kt($t);
let mt = class {
  constructor(n) {
    this._functionService = n;
  }
  async registerFunctions(n) {
    const e = n.map(([a, i]) => to(a, i));
    this._functionService.registerExecutors(...e);
  }
  async registerAsyncFunctions(n) {
    const e = n.map(([a, i]) => ao(a, i));
    this._functionService.registerExecutors(...e);
  }
  async unregisterFunctions(n) {
    this._functionService.unregisterExecutors(...n), this._functionService.unregisterDescriptions(...n), this._functionService.deleteFormulaAstCacheKey(...n);
  }
};
mt = Jr([
  eo(0, Tt)
], mt);
function to(n, e) {
  const a = new Vt(e), i = new Function(`return ${n}`)();
  return a.calculateCustom = i, a;
}
function ao(n, e) {
  const a = new Ya(e), i = new Function(`return ${n}`)();
  return a.calculateCustom = i, a;
}
var no = Object.getOwnPropertyDescriptor, io = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? no(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, We = (n, e) => (a, i) => e(a, i, n);
const ro = Kt(
  "sheets-formula.register-function-service"
);
let wt = class extends z {
  constructor(n, e, a, i) {
    super(), this._localeService = n, this._descriptionService = e, this._functionService = a, this._remoteRegisterFunctionService = i;
  }
  registerFunction(n) {
    return this._registerSingleFunction(n);
  }
  registerAsyncFunction(n) {
    return this._registerSingleFunction({ ...n, async: !0 });
  }
  registerFunctions(n) {
    const { locales: e, description: a, calculate: i } = n;
    e && this._localeService.load(e);
    const r = new $e();
    if (a)
      r.add(this._descriptionService.registerDescriptions(a));
    else {
      const o = i.map(([u, f, m]) => ({
        functionName: f,
        functionType: t.User,
        description: "",
        abstract: m || "",
        functionParameter: []
      }));
      r.add(this._functionService.registerDescriptions(...o));
    }
    return r.add(this._registerLocalExecutors(i)), this._remoteRegisterFunctionService && r.add(this._registerRemoteExecutors(i)), r;
  }
  _registerSingleFunction(n) {
    const { name: e, func: a, description: i, locales: r, async: o = !1 } = n, u = new $e();
    if (r && this._localeService.load(r), typeof i == "string") {
      const m = {
        functionName: e,
        functionType: t.User,
        description: i,
        abstract: i || "",
        functionParameter: []
      };
      u.add(this._descriptionService.registerDescriptions([m]));
    } else
      u.add(this._descriptionService.registerDescriptions([i]));
    const f = o ? new Ya(e) : new Vt(e);
    return f.calculateCustom = a, this._functionService.registerExecutors(f), u.add(ee(() => this._functionService.unregisterExecutors(e))), u.add(ee(() => this._functionService.unregisterDescriptions(e))), u.add(ee(() => this._functionService.deleteFormulaAstCacheKey(e))), this._remoteRegisterFunctionService && (this._remoteRegisterFunctionService.registerAsyncFunctions([[a.toString(), e]]), u.add(
      ee(() => this._remoteRegisterFunctionService.unregisterFunctions([e]))
    )), u;
  }
  _registerLocalExecutors(n) {
    const e = n.map(([i, r]) => r), a = n.map(([i, r]) => {
      const o = new Vt(r);
      return o.calculateCustom = i, o;
    });
    return this._functionService.registerExecutors(...a), ee(() => this._functionService.unregisterExecutors(...e));
  }
  _registerRemoteExecutors(n) {
    const e = [], a = n.map(([i, r]) => (e.push(r), [i.toString(), r]));
    return this._remoteRegisterFunctionService.registerFunctions(a), ee(() => this._remoteRegisterFunctionService.unregisterFunctions(e));
  }
};
wt = io([
  We(0, H(Wt)),
  We(1, H(Et)),
  We(2, Tt),
  We(3, Pn(Za))
], wt);
var oo = Object.defineProperty, uo = Object.getOwnPropertyDescriptor, mo = (n, e, a) => e in n ? oo(n, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : n[e] = a, Ja = (n, e, a, i) => {
  for (var r = i > 1 ? void 0 : i ? uo(e, a) : e, o = n.length - 1, u; o >= 0; o--)
    (u = n[o]) && (r = u(r) || r);
  return r;
}, ft = (n, e) => (a, i) => e(a, i, n), It = (n, e, a) => mo(n, typeof e != "symbol" ? e + "" : e, a);
let ct = class extends Sa {
  constructor(n = Pa, e, a) {
    super(), this._config = n, this._injector = e, this._configService = a;
    const { ...i } = Aa(
      {},
      Pa,
      this._config
    );
    this._configService.setConfig(Ai, i);
  }
  onStarting() {
    this._injector.add([mt]), this._injector.get(Ka).registerChannel(
      $t,
      Ii(this._injector.get(mt))
    );
  }
};
It(ct, "pluginName", "SHEET_FORMULA_REMOTE_PLUGIN");
It(ct, "type", j.UNIVER_SHEET);
ct = Ja([
  Ra(Xa),
  ft(1, H(st)),
  ft(2, be)
], ct);
let lt = class extends Sa {
  constructor(n = La, e, a) {
    super(), this._config = n, this._injector = e, this._configService = a;
    const { ...i } = Aa(
      {},
      La,
      this._config
    );
    this._configService.setConfig(Ue, i, { merge: !0 });
  }
  onStarting() {
    const n = this._injector, e = [
      [ro, { useClass: wt }],
      [Et, { useClass: Gt }],
      [ot],
      [Ht],
      [et],
      [it],
      [Je],
      [ge],
      [at],
      [nt],
      [rt],
      [tt],
      [ut]
    ];
    if (this._config.notExecuteFormula) {
      const a = n.get(Ka);
      e.push([Za, {
        useFactory: () => Ni(a.requestChannel($t))
      }]);
    }
    e.forEach((a) => n.add(a));
  }
  onReady() {
    ve(this._injector, [
      [ot],
      [nt],
      [it],
      [Je],
      [at],
      [tt]
    ]), jt() && ve(this._injector, [
      [ge]
    ]);
  }
  onRendered() {
    ve(this._injector, [
      [rt],
      [ut]
    ]), jt() || ve(this._injector, [
      [ge]
    ]);
  }
};
It(lt, "pluginName", Ir);
It(lt, "type", j.UNIVER_SHEET);
lt = Ja([
  Ra(Xa, Vn),
  ft(1, H(st)),
  ft(2, be)
], lt);
function Po(n, e, a, i) {
  const r = n.get(li), o = n.get(si), u = n.get(di), f = n.get(pi);
  r.load({
    formulaData: {},
    arrayFormulaCellData: {},
    arrayFormulaRange: {},
    forceCalculate: !1,
    dirtyRanges: [],
    dirtyNameMap: {},
    dirtyDefinedNameMap: {},
    dirtyUnitFeatureMap: {},
    excludedCell: {},
    allUnitData: {
      [a]: i
    },
    dirtyUnitOtherFormulaMap: {}
  });
  const m = o.treeBuilder(e), c = u.parse(m), l = f.execute(Li(c));
  return Pi(l);
}
export {
  Te as CalculationMode,
  Gt as DescriptionService,
  Ht as FormulaRefRangeService,
  Et as IDescriptionService,
  ro as IRegisterFunctionService,
  Za as IRemoteRegisterFunctionService,
  Je as ImageFormulaCellInterceptorController,
  Ri as InsertFunctionCommand,
  _e as OtherFormulaMarkDirty,
  Ue as PLUGIN_CONFIG_KEY_BASE,
  Si as QuickSumCommand,
  wt as RegisterFunctionService,
  et as RegisterOtherFormulaService,
  mt as RemoteRegisterFunctionService,
  ge as TriggerCalculationController,
  ct as UniverRemoteSheetsFormulaPlugin,
  lt as UniverSheetsFormulaPlugin,
  tt as UpdateDefinedNameController,
  at as UpdateFormulaController,
  Po as calculateFormula
};
