var O = Object.defineProperty;
var j = (r, e, o) => e in r ? O(r, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[e] = o;
var c = (r, e, o) => j(r, typeof e != "symbol" ? e + "" : e, o);
import { fork as U } from "node:child_process";
import l from "node:process";
import { Inject as P, Injector as v, IConfigService as C, Plugin as R, merge as S, ILogService as k } from "@univerjs/core";
import { IRPCChannelService as N, ChannelService as I, DataSyncPrimaryController as h, IRemoteSyncService as D, RemoteSyncPrimaryService as W, DataSyncReplicaController as _, IRemoteInstanceService as G, WebWorkerRemoteInstanceService as x } from "@univerjs/rpc";
import { Observable as w, shareReplay as E } from "rxjs";
const F = "rpc-node.main-thread.config", f = {}, L = "rpc-node.worker-thread.config", p = {};
var b = Object.getOwnPropertyDescriptor, y = (r, e, o, n) => {
  for (var i = n > 1 ? void 0 : n ? b(e, o) : e, t = r.length - 1, s; t >= 0; t--)
    (s = r[t]) && (i = s(i) || i);
  return i;
}, a = (r, e) => (o, n) => e(o, n, r), g;
let u = (g = class extends R {
  constructor(e = f, o, n) {
    super();
    c(this, "_child", null);
    this._config = e, this._injector = o, this._configService = n;
    const { ...i } = S(
      {},
      f,
      this._config
    );
    this._configService.setConfig(F, i);
  }
  onStarting() {
    const { workerSrc: e } = this._config;
    if (!e)
      throw new Error("[UniverRPCNodeMainPlugin] workerSrc is required for UniverRPCNodeMainPlugin");
    const [o, n] = A(this._injector, e);
    [
      [N, {
        useFactory: () => new I(o)
      }],
      [h],
      [D, { useClass: W }]
    ].forEach((t) => this._injector.add(t)), this._injector.get(h), this._child = n;
  }
  dispose() {
    if (super.dispose(), this._child) {
      try {
        this._child.kill();
      } catch (e) {
        console.error("Failed to kill child process:", e);
      }
      this._child = null;
    }
  }
}, c(g, "pluginName", "UNIVER_RPC_NODE_MAIN_PLUGIN"), g);
u = y([
  a(1, P(v)),
  a(2, C)
], u);
var d;
let m = (d = class extends R {
  constructor(r = p, e, o) {
    super(), this._config = r, this._injector = e, this._configService = o;
    const { ...n } = S(
      {},
      p,
      this._config
    );
    this._configService.setConfig(L, n);
  }
  onStarting() {
    [
      [_],
      [N, {
        useFactory: () => new I(K())
      }],
      [G, { useClass: x }]
    ].forEach((r) => this._injector.add(r)), this._injector.get(_);
  }
}, c(d, "pluginName", "UNIVER_RPC_NODE_WORKER_PLUGIN"), d);
m = y([
  a(1, P(v)),
  a(2, C)
], m);
function A(r, e) {
  const o = r.get(k), n = U(e);
  return n.on("spawn", () => o.log("Child computing process spawned!")), n.on("error", (t) => o.error(t)), [{
    send(t) {
      n.send(t);
    },
    onMessage: new w((t) => {
      const s = (M) => {
        t.next(M);
      };
      return n.on("message", s), () => n.off("message", s);
    }).pipe(E(1))
  }, n];
}
function K() {
  return {
    send(r) {
      l.send(r);
    },
    onMessage: new w((r) => {
      const e = (o) => {
        r.next(o);
      };
      return l.on("message", e), () => l.off("message", e);
    }).pipe(E(1))
  };
}
export {
  u as UniverRPCNodeMainPlugin,
  m as UniverRPCNodeWorkerPlugin
};
