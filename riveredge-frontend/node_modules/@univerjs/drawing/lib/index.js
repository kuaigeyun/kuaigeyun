var Rt = Object.defineProperty;
var xt = (a, e, n) => e in a ? Rt(a, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : a[e] = n;
var F = (a, e, n) => xt(a, typeof e != "symbol" ? e + "" : e, n);
import { createIdentifier as Bt, CommandType as Wt, sortRules as Gt, sortRulesByDesc as Lt, ImageSourceType as at, ImageUploadStatusType as et, generateRandomId as qt, Inject as Kt, Injector as $t, IConfigService as Ft, ICommandService as Vt, Plugin as Ht, merge as zt, mergeOverrideWithDependencies as Xt, IImageIoService as Jt } from "@univerjs/core";
import { IImageIoService as In, ImageSourceType as En, ImageUploadStatusType as Dn } from "@univerjs/core";
import { Subject as be } from "rxjs";
const _n = 500, vn = 500, mn = 10, Yt = 5 * 1024 * 1024, Zt = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/bmp"], Mt = Bt("univer.drawing-manager.service"), Qt = {
  id: "drawing.operation.set-drawing-selected",
  type: Wt.OPERATION,
  handler: (a, e) => {
    const n = a.get(Mt);
    return e == null ? !1 : (n.focusDrawing(e), !0);
  }
}, en = "drawing.config", vt = {};
var Ve = {}, Ze = {}, tt = {}, mt;
function tn() {
  if (mt) return tt;
  mt = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  function a(t, r) {
    if (Array.isArray(r))
      return !1;
    for (let u in t)
      if (!n(t[u], r[u]))
        return !1;
    for (let u in r)
      if (t[u] === void 0)
        return !1;
    return !0;
  }
  function e(t, r) {
    if (!Array.isArray(r) || t.length !== r.length)
      return !1;
    for (let u = 0; u < t.length; u++)
      if (!n(t[u], r[u]))
        return !1;
    return !0;
  }
  function n(t, r) {
    return t === r ? !0 : t === null || r === null || typeof t != "object" || typeof r != "object" ? !1 : Array.isArray(t) ? e(t, r) : a(t, r);
  }
  return tt.default = n, tt;
}
var nt = {}, Ot;
function nn() {
  if (Ot) return nt;
  Ot = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  function a(e) {
    if (e === null)
      return null;
    if (Array.isArray(e))
      return e.map(a);
    if (typeof e == "object") {
      const n = {};
      for (let t in e)
        n[t] = a(e[t]);
      return n;
    } else
      return e;
  }
  return nt.default = a, nt;
}
var lt = {}, wt;
function St() {
  return wt || (wt = 1, (function(a) {
    Object.defineProperty(a, "__esModule", { value: !0 }), a.eachChildOf = a.advancer = a.readCursor = a.writeCursor = a.WriteCursor = a.ReadCursor = a.isValidPathItem = void 0;
    function e(_, s) {
      if (!_)
        throw new Error(s);
    }
    const n = (_) => _ != null && typeof _ == "object" && !Array.isArray(_), t = (_, s) => (
      // All the numbers, then all the letters. Just as the gods of ascii intended.
      typeof _ == typeof s ? _ > s : typeof _ == "string" && typeof s == "number"
    );
    function r(_, s) {
      for (let c in _) {
        const h = c;
        s.write(h, _[h]);
      }
    }
    a.isValidPathItem = (_) => typeof _ == "number" || typeof _ == "string" && _ !== "__proto__";
    class u {
      constructor(s = null) {
        this.parents = [], this.indexes = [], this.lcIdx = -1, this.idx = -1, this.container = s;
      }
      ascend() {
        e(this.parents.length === this.indexes.length / 2), this.idx === 0 ? this.parents.length ? (this.lcIdx = this.indexes.pop(), this.container = this.parents.pop(), this.idx = this.indexes.pop()) : (this.lcIdx = 0, this.idx = -1) : (e(this.idx > 0), this.idx--, n(this.container[this.idx]) && this.idx--);
      }
      getPath() {
        const s = [];
        let c = this.container, h = this.parents.length - 1, U = this.idx;
        for (; U >= 0; )
          s.unshift(c[U]), U === 0 ? (U = this.indexes[h * 2], c = this.parents[h--]) : U -= n(c[U - 1]) ? 2 : 1;
        return s;
      }
    }
    class o extends u {
      get() {
        return this.container ? this.container.slice(this.idx + 1) : null;
      }
      // Its only valid to call this after descending into a child.
      getKey() {
        return e(this.container != null, "Invalid call to getKey before cursor descended"), this.container[this.idx];
      }
      getComponent() {
        let s;
        return this.container && this.container.length > this.idx + 1 && n(s = this.container[this.idx + 1]) ? s : null;
      }
      descendFirst() {
        let s = this.idx + 1;
        if (!this.container || s >= this.container.length || n(this.container[s]) && s + 1 >= this.container.length)
          return !1;
        n(this.container[s]) && s++;
        const c = this.container[s];
        return Array.isArray(c) ? (this.indexes.push(this.idx), this.parents.push(this.container), this.indexes.push(s), this.idx = 0, this.container = c) : this.idx = s, !0;
      }
      nextSibling() {
        if (e(this.parents.length === this.indexes.length / 2), this.idx > 0 || this.parents.length === 0)
          return !1;
        const s = this.indexes[this.indexes.length - 1] + 1, c = this.parents[this.parents.length - 1];
        return s >= c.length ? !1 : (e(!isNaN(s)), this.indexes[this.indexes.length - 1] = s, this.container = c[s], !0);
      }
      _init(s, c, h, U) {
        this.container = s, this.idx = c, this.parents = h.slice(), this.indexes = U.slice();
      }
      clone() {
        const s = new o();
        return s._init(this.container, this.idx, this.parents, this.indexes), s;
      }
      *[Symbol.iterator]() {
        if (this.descendFirst()) {
          do
            yield this.getKey();
          while (this.nextSibling());
          this.ascend();
        }
      }
      // TODO(cleanup): Consider moving these functions out of cursor, since
      // they're really just helper methods.
      // It'd be really nice to do this using generators.
      traverse(s, c) {
        const h = this.getComponent();
        h && c(h, s);
        for (const U of this)
          s && s.descend(U), this.traverse(s, c), s && s.ascend();
      }
      eachPick(s, c) {
        this.traverse(s, (h, U) => {
          h.p != null && c(h.p, U);
        });
      }
      eachDrop(s, c) {
        this.traverse(s, (h, U) => {
          h.d != null && c(h.d, U);
        });
      }
    }
    a.ReadCursor = o;
    class l extends u {
      constructor(s = null) {
        super(s), this.pendingDescent = [], this._op = s;
      }
      flushDescent() {
        e(this.parents.length === this.indexes.length / 2), this.container === null && (this._op = this.container = []);
        for (let s = 0; s < this.pendingDescent.length; s++) {
          const c = this.pendingDescent[s];
          let h = this.idx + 1;
          if (h < this.container.length && n(this.container[h]) && h++, e(h === this.container.length || !n(this.container[h])), h === this.container.length)
            this.container.push(c), this.idx = h;
          else if (this.container[h] === c)
            this.idx = h;
          else {
            if (!Array.isArray(this.container[h])) {
              const U = this.container.splice(h, this.container.length - h);
              this.container.push(U), this.lcIdx > -1 && (this.lcIdx = h);
            }
            for (this.indexes.push(this.idx), this.parents.push(this.container), this.lcIdx !== -1 && (e(t(c, this.container[this.lcIdx][0])), h = this.lcIdx + 1, this.lcIdx = -1); h < this.container.length && t(c, this.container[h][0]); )
              h++;
            if (this.indexes.push(h), this.idx = 0, h < this.container.length && this.container[h][0] === c)
              this.container = this.container[h];
            else {
              const U = [c];
              this.container.splice(h, 0, U), this.container = U;
            }
          }
        }
        this.pendingDescent.length = 0;
      }
      reset() {
        this.lcIdx = -1;
      }
      // Creates and returns a component, creating one if need be. You should
      // probably write to it immediately - ops are not valid with empty
      // components.
      getComponent() {
        this.flushDescent();
        const s = this.idx + 1;
        if (s < this.container.length && n(this.container[s]))
          return this.container[s];
        {
          const c = {};
          return this.container.splice(s, 0, c), c;
        }
      }
      write(s, c) {
        const h = this.getComponent();
        e(h[s] == null || h[s] === c, "Internal consistency error: Overwritten component. File a bug"), h[s] = c;
      }
      get() {
        return this._op;
      }
      descend(s) {
        if (!a.isValidPathItem(s))
          throw Error("Invalid JSON key");
        this.pendingDescent.push(s);
      }
      descendPath(s) {
        return this.pendingDescent.push(...s), this;
      }
      ascend() {
        this.pendingDescent.length ? this.pendingDescent.pop() : super.ascend();
      }
      mergeTree(s, c = r) {
        if (s === null)
          return;
        if (e(Array.isArray(s)), s === this._op)
          throw Error("Cannot merge into my own tree");
        const h = this.lcIdx, U = this.parents.length;
        let Y = 0;
        for (let pe = 0; pe < s.length; pe++) {
          const Z = s[pe];
          typeof Z == "string" || typeof Z == "number" ? (Y++, this.descend(Z)) : Array.isArray(Z) ? this.mergeTree(Z, c) : typeof Z == "object" && c(Z, this);
        }
        for (; Y--; )
          this.ascend();
        this.lcIdx = this.parents.length === U ? h : -1;
      }
      at(s, c) {
        this.descendPath(s), c(this);
        for (let h = 0; h < s.length; h++)
          this.ascend();
        return this;
      }
      // This is used by helpers, so the strict ordering guarantees are
      // relaxed.
      writeAtPath(s, c, h) {
        return this.at(s, () => this.write(c, h)), this.reset(), this;
      }
      writeMove(s, c, h = 0) {
        return this.writeAtPath(s, "p", h).writeAtPath(c, "d", h);
      }
      getPath() {
        const s = super.getPath();
        return s.push(...this.pendingDescent), s;
      }
    }
    a.WriteCursor = l, a.writeCursor = () => new l(), a.readCursor = (_) => new o(_);
    function E(_, s, c) {
      let h, U;
      U = h = _ ? _.descendFirst() : !1;
      function Y(pe) {
        let Z;
        for (; U; ) {
          const Ce = Z = _.getKey();
          if (pe != null) {
            let qe = !1;
            if (s && typeof Ce == "number" && (Z = s(Ce, _.getComponent()), Z < 0 && (Z = ~Z, qe = !0)), t(Z, pe))
              return null;
            if (Z === pe && !qe)
              return _;
          }
          c && typeof Z == "number" && c(Z, _.getComponent()), U = _.nextSibling();
        }
        return null;
      }
      return Y.end = () => {
        h && _.ascend();
      }, Y;
    }
    a.advancer = E;
    function B(_, s, c) {
      let h, U, Y, pe;
      for (h = U = _ && _.descendFirst(), Y = pe = s && s.descendFirst(); h || Y; ) {
        let Z = h ? _.getKey() : null, Ce = Y ? s.getKey() : null;
        Z !== null && Ce !== null && (t(Ce, Z) ? Ce = null : Z !== Ce && (Z = null)), c(Z == null ? Ce : Z, Z != null ? _ : null, Ce != null ? s : null), Z != null && h && (h = _.nextSibling()), Ce != null && Y && (Y = s.nextSibling());
      }
      U && _.ascend(), pe && s.ascend();
    }
    a.eachChildOf = B;
  })(lt)), lt;
}
var ut = {}, bt;
function kt() {
  return bt || (bt = 1, (function(a) {
    Object.defineProperty(a, "__esModule", { value: !0 }), a.ConflictType = void 0, (function(e) {
      e[e.RM_UNEXPECTED_CONTENT = 1] = "RM_UNEXPECTED_CONTENT", e[e.DROP_COLLISION = 2] = "DROP_COLLISION", e[e.BLACKHOLE = 3] = "BLACKHOLE";
    })(a.ConflictType || (a.ConflictType = {}));
  })(ut)), ut;
}
var Ue = {}, He = {}, Ct;
function pt() {
  return Ct || (Ct = 1, Object.defineProperty(He, "__esModule", { value: !0 }), He.uniToStrPos = He.strPosToUni = void 0, He.strPosToUni = (a, e = a.length) => {
    let n = 0, t = 0;
    for (; t < e; t++) {
      const r = a.charCodeAt(t);
      r >= 55296 && r <= 57343 && (n++, t++);
    }
    if (t !== e)
      throw Error("Invalid offset - splits unicode bytes");
    return t - n;
  }, He.uniToStrPos = (a, e) => {
    let n = 0;
    for (; e > 0; e--) {
      const t = a.charCodeAt(n);
      n += t >= 55296 && t <= 57343 ? 2 : 1;
    }
    return n;
  }), He;
}
var ct = {}, It;
function ht() {
  return It || (It = 1, (function(a) {
    Object.defineProperty(a, "__esModule", { value: !0 }), a.uniSlice = a.dlen = a.eachOp = void 0;
    const e = pt(), n = (f) => {
      if (!Array.isArray(f))
        throw Error("Op must be an array of components");
      let y = null;
      for (let b = 0; b < f.length; b++) {
        const q = f[b];
        switch (typeof q) {
          case "object":
            if (typeof q.d != "number" && typeof q.d != "string")
              throw Error("Delete must be number or string");
            if (a.dlen(q.d) <= 0)
              throw Error("Deletes must not be empty");
            break;
          case "string":
            if (!(q.length > 0))
              throw Error("Inserts cannot be empty");
            break;
          case "number":
            if (!(q > 0))
              throw Error("Skip components must be >0");
            if (typeof y == "number")
              throw Error("Adjacent skip components should be combined");
            break;
        }
        y = q;
      }
      if (typeof y == "number")
        throw Error("Op has a trailing skip");
    };
    function t(f, y) {
      let b = 0, q = 0;
      for (let z = 0; z < f.length; z++) {
        const K = f[z];
        switch (y(K, b, q), typeof K) {
          case "object":
            b += a.dlen(K.d);
            break;
          case "string":
            q += e.strPosToUni(K);
            break;
          case "number":
            b += K, q += K;
            break;
        }
      }
    }
    a.eachOp = t;
    function r(f, y) {
      const b = [], q = l(b);
      return t(f, (z, K, Ee) => {
        q(y(z, K, Ee));
      }), s(b);
    }
    const u = (f) => f, o = (f) => r(f, u);
    a.dlen = (f) => typeof f == "number" ? f : e.strPosToUni(f);
    const l = (f) => (y) => {
      if (!(!y || y.d === 0 || y.d === "")) if (f.length === 0)
        f.push(y);
      else if (typeof y == typeof f[f.length - 1])
        if (typeof y == "object") {
          const b = f[f.length - 1];
          b.d = typeof b.d == "string" && typeof y.d == "string" ? b.d + y.d : a.dlen(b.d) + a.dlen(y.d);
        } else
          f[f.length - 1] += y;
      else
        f.push(y);
    }, E = (f) => typeof f == "number" ? f : typeof f == "string" ? e.strPosToUni(f) : typeof f.d == "number" ? f.d : e.strPosToUni(f.d);
    a.uniSlice = (f, y, b) => {
      const q = e.uniToStrPos(f, y), z = b == null ? 1 / 0 : e.uniToStrPos(f, b);
      return f.slice(q, z);
    };
    const B = (f, y, b) => typeof f == "number" ? b == null ? f - y : Math.min(f, b) - y : a.uniSlice(f, y, b), _ = (f) => {
      let y = 0, b = 0;
      return { take: (K, Ee) => {
        if (y === f.length)
          return K === -1 ? null : K;
        const ce = f[y];
        let ne;
        if (typeof ce == "number")
          return K === -1 || ce - b <= K ? (ne = ce - b, ++y, b = 0, ne) : (b += K, K);
        if (typeof ce == "string") {
          if (K === -1 || Ee === "i" || e.strPosToUni(ce.slice(b)) <= K)
            return ne = ce.slice(b), ++y, b = 0, ne;
          {
            const le = b + e.uniToStrPos(ce.slice(b), K);
            return ne = ce.slice(b, le), b = le, ne;
          }
        } else {
          if (K === -1 || Ee === "d" || a.dlen(ce.d) - b <= K)
            return ne = { d: B(ce.d, b) }, ++y, b = 0, ne;
          {
            let le = B(ce.d, b, b + K);
            return b += K, { d: le };
          }
        }
      }, peek: () => f[y] };
    }, s = (f) => (f.length > 0 && typeof f[f.length - 1] == "number" && f.pop(), f);
    function c(f, y, b) {
      if (b !== "left" && b !== "right")
        throw Error("side (" + b + ") must be 'left' or 'right'");
      n(f), n(y);
      const q = [], z = l(q), { take: K, peek: Ee } = _(f);
      for (let ne = 0; ne < y.length; ne++) {
        const le = y[ne];
        let ge, De;
        switch (typeof le) {
          case "number":
            for (ge = le; ge > 0; )
              De = K(ge, "i"), z(De), typeof De != "string" && (ge -= E(De));
            break;
          case "string":
            b === "left" && typeof Ee() == "string" && z(K(-1)), z(e.strPosToUni(le));
            break;
          case "object":
            for (ge = a.dlen(le.d); ge > 0; )
              switch (De = K(ge, "i"), typeof De) {
                case "number":
                  ge -= De;
                  break;
                case "string":
                  z(De);
                  break;
                case "object":
                  ge -= a.dlen(De.d);
              }
            break;
        }
      }
      let ce;
      for (; ce = K(-1); )
        z(ce);
      return s(q);
    }
    function h(f, y) {
      n(f), n(y);
      const b = [], q = l(b), { take: z } = _(f);
      for (let Ee = 0; Ee < y.length; Ee++) {
        const ce = y[Ee];
        let ne, le;
        switch (typeof ce) {
          case "number":
            for (ne = ce; ne > 0; )
              le = z(ne, "d"), q(le), typeof le != "object" && (ne -= E(le));
            break;
          case "string":
            q(ce);
            break;
          case "object":
            ne = a.dlen(ce.d);
            let ge = 0;
            for (; ge < ne; )
              switch (le = z(ne - ge, "d"), typeof le) {
                case "number":
                  q({ d: B(ce.d, ge, ge + le) }), ge += le;
                  break;
                case "string":
                  ge += e.strPosToUni(le);
                  break;
                case "object":
                  q(le);
              }
            break;
        }
      }
      let K;
      for (; K = z(-1); )
        q(K);
      return s(b);
    }
    const U = (f, y) => {
      let b = 0;
      for (let q = 0; q < y.length && f > b; q++) {
        const z = y[q];
        switch (typeof z) {
          case "number": {
            b += z;
            break;
          }
          case "string":
            const K = e.strPosToUni(z);
            b += K, f += K;
            break;
          case "object":
            f -= Math.min(a.dlen(z.d), f - b);
            break;
        }
      }
      return f;
    }, Y = (f, y) => typeof f == "number" ? U(f, y) : f.map((b) => U(b, y));
    function pe(f, y, b) {
      return r(f, (q, z) => typeof q == "object" && typeof q.d == "number" ? { d: b.slice(y, z, z + q.d) } : q);
    }
    function Z(f) {
      return r(f, (y) => {
        switch (typeof y) {
          case "object":
            if (typeof y.d == "number")
              throw Error("Cannot invert text op: Deleted characters missing from operation. makeInvertible must be called first.");
            return y.d;
          // delete -> insert
          case "string":
            return { d: y };
          // Insert -> delete
          case "number":
            return y;
        }
      });
    }
    function Ce(f) {
      return r(f, (y) => typeof y == "object" && typeof y.d == "string" ? { d: e.strPosToUni(y.d) } : y);
    }
    function qe(f) {
      let y = !0;
      return t(f, (b) => {
        typeof b == "object" && typeof b.d == "number" && (y = !1);
      }), y;
    }
    function ve(f) {
      return {
        name: "text-unicode",
        uri: "http://sharejs.org/types/text-unicode",
        trim: s,
        normalize: o,
        checkOp: n,
        /** Create a new text snapshot.
         *
         * @param {string} initial - initial snapshot data. Optional. Defaults to ''.
         * @returns {Snap} Initial document snapshot object
         */
        create(y = "") {
          if (typeof y != "string")
            throw Error("Initial data must be a string");
          return f.create(y);
        },
        /** Apply an operation to a document snapshot
         */
        apply(y, b) {
          n(b);
          const q = f.builder(y);
          for (let z = 0; z < b.length; z++) {
            const K = b[z];
            switch (typeof K) {
              case "number":
                q.skip(K);
                break;
              case "string":
                q.append(K);
                break;
              case "object":
                q.del(a.dlen(K.d));
                break;
            }
          }
          return q.build();
        },
        transform: c,
        compose: h,
        transformPosition: U,
        transformSelection: Y,
        isInvertible: qe,
        makeInvertible(y, b) {
          return pe(y, b, f);
        },
        stripInvertible: Ce,
        invert: Z,
        invertWithDoc(y, b) {
          return Z(pe(y, b, f));
        },
        isNoop: (y) => y.length === 0
      };
    }
    a.default = ve;
  })(ct)), ct;
}
var rt = {}, Et;
function rn() {
  if (Et) return rt;
  Et = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const a = ht(), e = pt();
  function n(t, r) {
    return {
      // Returns the text content of the document
      get: t,
      // Returns the number of characters in the string
      getLength() {
        return t().length;
      },
      // Insert the specified text at the given position in the document
      insert(u, o, l) {
        const E = e.strPosToUni(t(), u);
        return r([E, o], l);
      },
      remove(u, o, l) {
        const E = e.strPosToUni(t(), u);
        return r([E, { d: o }], l);
      },
      // When you use this API, you should implement these two methods
      // in your editing context.
      //onInsert: function(pos, text) {},
      //onRemove: function(pos, removedLength) {},
      _onOp(u) {
        a.eachOp(u, (o, l, E) => {
          switch (typeof o) {
            case "string":
              this.onInsert && this.onInsert(E, o);
              break;
            case "object":
              const B = a.dlen(o.d);
              this.onRemove && this.onRemove(E, B);
          }
        });
      },
      onInsert: null,
      onRemove: null
    };
  }
  return rt.default = n, n.provides = { text: !0 }, rt;
}
var Dt;
function sn() {
  return Dt || (Dt = 1, (function(a) {
    var e = Ue && Ue.__createBinding || (Object.create ? (function(c, h, U, Y) {
      Y === void 0 && (Y = U), Object.defineProperty(c, Y, { enumerable: !0, get: function() {
        return h[U];
      } });
    }) : (function(c, h, U, Y) {
      Y === void 0 && (Y = U), c[Y] = h[U];
    })), n = Ue && Ue.__setModuleDefault || (Object.create ? (function(c, h) {
      Object.defineProperty(c, "default", { enumerable: !0, value: h });
    }) : function(c, h) {
      c.default = h;
    }), t = Ue && Ue.__importStar || function(c) {
      if (c && c.__esModule) return c;
      var h = {};
      if (c != null) for (var U in c) Object.hasOwnProperty.call(c, U) && e(h, c, U);
      return n(h, c), h;
    }, r = Ue && Ue.__importDefault || function(c) {
      return c && c.__esModule ? c : { default: c };
    };
    Object.defineProperty(a, "__esModule", { value: !0 }), a.type = a.remove = a.insert = void 0;
    const u = pt(), o = t(ht()), l = r(rn()), E = {
      create(c) {
        return c;
      },
      toString(c) {
        return c;
      },
      builder(c) {
        if (typeof c != "string")
          throw Error("Invalid document snapshot: " + c);
        const h = [];
        return {
          skip(U) {
            let Y = u.uniToStrPos(c, U);
            if (Y > c.length)
              throw Error("The op is too long for this document");
            h.push(c.slice(0, Y)), c = c.slice(Y);
          },
          append(U) {
            h.push(U);
          },
          del(U) {
            c = c.slice(u.uniToStrPos(c, U));
          },
          build() {
            return h.join("") + c;
          }
        };
      },
      slice: o.uniSlice
    }, B = o.default(E), _ = Object.assign(Object.assign({}, B), { api: l.default });
    a.type = _, a.insert = (c, h) => h.length === 0 ? [] : c === 0 ? [h] : [c, h], a.remove = (c, h) => o.dlen(h) === 0 ? [] : c === 0 ? [{ d: h }] : [c, { d: h }];
    var s = ht();
    Object.defineProperty(a, "makeType", { enumerable: !0, get: function() {
      return s.default;
    } });
  })(Ue)), Ue;
}
var Pt;
function on() {
  return Pt || (Pt = 1, (function(a) {
    var e = Ze && Ze.__importDefault || function(i) {
      return i && i.__esModule ? i : {
        default: i
      };
    };
    Object.defineProperty(a, "__esModule", {
      value: !0
    }), a.editOp = a.replaceOp = a.insertOp = a.moveOp = a.removeOp = a.type = void 0;
    const n = e(tn()), t = e(nn()), r = St(), u = kt();
    function o(i, d) {
      if (!i) throw new Error(d);
    }
    a.type = {
      name: "json1",
      uri: "http://sharejs.org/types/JSONv1",
      readCursor: r.readCursor,
      writeCursor: r.writeCursor,
      create: (i) => i,
      isNoop: (i) => i == null,
      setDebug(i) {
      },
      registerSubtype: Z,
      checkValidOp: z,
      normalize: K,
      apply: Ee,
      transformPosition: ce,
      compose: ne,
      tryTransform: st,
      transform: jt,
      makeInvertible: De,
      invert: le,
      invertWithDoc: Ut,
      RM_UNEXPECTED_CONTENT: u.ConflictType.RM_UNEXPECTED_CONTENT,
      DROP_COLLISION: u.ConflictType.DROP_COLLISION,
      BLACKHOLE: u.ConflictType.BLACKHOLE,
      transformNoConflict: (i, d, m) => yt(() => !0, i, d, m),
      typeAllowingConflictsPred: (i) => Object.assign(Object.assign({}, a.type), {
        transform: (d, m, D) => yt(i, d, m, D)
      })
    };
    const l = (i) => i ? i.getComponent() : null;
    function E(i) {
      return i && typeof i == "object" && !Array.isArray(i);
    }
    const B = (i) => Array.isArray(i) ? i.slice() : i !== null && typeof i == "object" ? Object.assign({}, i) : i, _ = (i) => i && (i.p != null || i.r !== void 0), s = (i) => i && (i.d != null || i.i !== void 0);
    function c(i, d) {
      return o(i != null), typeof d == "number" ? (o(Array.isArray(i), "Invalid key - child is not an array"), (i = i.slice()).splice(d, 1)) : (o(E(i), "Invalid key - child is not an object"), delete (i = Object.assign({}, i))[d]), i;
    }
    function h(i, d, m) {
      return typeof d == "number" ? (o(i != null, "Container is missing for key"), o(Array.isArray(i), "Cannot use numerical key for object container"), o(i.length >= d, "Cannot insert into out of bounds index"), i.splice(d, 0, m)) : (o(E(i), "Cannot insert into missing item"), o(i[d] === void 0, "Trying to overwrite value at key. Your op needs to remove it first"), i[d] = m), m;
    }
    a.removeOp = (i, d = !0) => r.writeCursor().writeAtPath(i, "r", d).get(), a.moveOp = (i, d) => r.writeCursor().writeMove(i, d).get(), a.insertOp = (i, d) => r.writeCursor().writeAtPath(i, "i", d).get(), a.replaceOp = (i, d, m) => r.writeCursor().at(i, (D) => {
      D.write("r", d), D.write("i", m);
    }).get(), a.editOp = (i, d, m, D = !1) => r.writeCursor().at(i, (O) => y(O, d, m, D)).get();
    const U = (i, d) => i != null && (typeof d == "number" ? Array.isArray(i) : typeof i == "object"), Y = (i, d) => U(i, d) ? i[d] : void 0, pe = {};
    function Z(i) {
      let d = i.type ? i.type : i;
      d.name && (pe[d.name] = d), d.uri && (pe[d.uri] = d);
    }
    const Ce = (i) => {
      const d = pe[i];
      if (d) return d;
      throw Error("Missing type: " + i);
    };
    Z(sn());
    const qe = (i, d) => i + d;
    Z({
      name: "number",
      apply: qe,
      compose: qe,
      invert: (i) => -i,
      transform: (i) => i
    });
    const ve = (i) => i == null ? null : i.et ? Ce(i.et) : i.es ? pe["text-unicode"] : i.ena != null ? pe.number : null, f = (i) => i.es ? i.es : i.ena != null ? i.ena : i.e, y = (i, d, m, D = !1) => {
      const [O, I] = typeof d == "string" ? [Ce(d), d] : [d, d.name];
      !D && O.isNoop && O.isNoop(m) || (I === "number" ? i.write("ena", m) : I === "text-unicode" ? i.write("es", m) : (i.write("et", I), i.write("e", m)));
    };
    function b(i) {
      o(typeof i == "number"), o(i >= 0), o(i === (0 | i));
    }
    function q(i) {
      typeof i == "number" ? b(i) : o(typeof i == "string");
    }
    function z(i) {
      if (i === null) return;
      const d = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), D = (I) => {
        let x = !0, N = !1;
        for (let p in I) {
          const v = I[p];
          if (x = !1, o(p === "p" || p === "r" || p === "d" || p === "i" || p === "e" || p === "es" || p === "ena" || p === "et", "Invalid component item '" + p + "'"), p === "p") b(v), o(!d.has(v)), d.add(v), o(I.r === void 0);
          else if (p === "d") b(v), o(!m.has(v)), m.add(v), o(I.i === void 0);
          else if (p === "e" || p === "es" || p === "ena") {
            o(!N), N = !0;
            const w = ve(I);
            o(w, "Missing type in edit"), w.checkValidOp && w.checkValidOp(f(I));
          }
        }
        o(!x);
      }, O = (I, x, N) => {
        if (!Array.isArray(I)) throw Error("Op must be null or a list");
        if (I.length === 0) throw Error("Empty descent");
        x || q(I[0]);
        let p = 1, v = 0, w = 0;
        for (let C = 0; C < I.length; C++) {
          const R = I[C];
          if (o(R != null), Array.isArray(R)) {
            const W = O(R, !1);
            if (v) {
              const g = typeof w, S = typeof W;
              g === S ? o(w < W, "descent keys are not in order") : o(g === "number" && S === "string");
            }
            w = W, v++, p = 3;
          } else typeof R == "object" ? (o(p === 1, `Prev not scalar - instead ${p}`), D(R), p = 2) : (o(p !== 3), q(R), o(r.isValidPathItem(R), "Invalid path key"), p = 1);
        }
        return o(v !== 1, "Operation makes multiple descents. Remove some []"), o(p === 2 || p === 3), I[0];
      };
      O(i, !0), o(d.size === m.size, "Mismatched picks and drops in op");
      for (let I = 0; I < d.size; I++) o(d.has(I)), o(m.has(I));
    }
    function K(i) {
      let d = 0, m = [];
      const D = r.writeCursor();
      return D.mergeTree(i, (O, I) => {
        const x = ve(O);
        if (x) {
          const p = f(O);
          y(I, x, x.normalize ? x.normalize(p) : p);
        }
        for (const p of ["r", "p", "i", "d"]) if (O[p] !== void 0) {
          const v = p === "p" || p === "d" ? (N = O[p], m[N] == null && (m[N] = d++), m[N]) : O[p];
          I.write(p, v);
        }
        var N;
      }), D.get();
    }
    function Ee(i, d) {
      if (z(d), d === null) return i;
      const m = [];
      return (function D(O, I) {
        let x = O, N = 0, p = {
          root: O
        }, v = 0, w = p, C = "root";
        function R() {
          for (; v < N; v++) {
            let W = I[v];
            typeof W != "object" && (o(U(w, C)), w = w[C] = B(w[C]), C = W);
          }
        }
        for (; N < I.length; N++) {
          const W = I[N];
          if (Array.isArray(W)) {
            const g = D(x, W);
            g !== x && g !== void 0 && (R(), x = w[C] = g);
          } else if (typeof W == "object") {
            W.d != null ? (R(), x = h(w, C, m[W.d])) : W.i !== void 0 && (R(), x = h(w, C, W.i));
            const g = ve(W);
            if (g) R(), x = w[C] = g.apply(x, f(W));
            else if (W.e !== void 0) throw Error("Subtype " + W.et + " undefined");
          } else x = Y(x, W);
        }
        return p.root;
      })(i = (function D(O, I) {
        const x = [];
        let N = 0;
        for (; N < I.length; N++) {
          const C = I[N];
          if (Array.isArray(C)) break;
          typeof C != "object" && (x.push(O), O = Y(O, C));
        }
        for (let C = I.length - 1; C >= N; C--) O = D(O, I[C]);
        for (--N; N >= 0; N--) {
          const C = I[N];
          if (typeof C != "object") {
            const R = x.pop();
            O = O === Y(R, C) ? R : O === void 0 ? c(R, C) : (v = C, w = O, (p = B(p = R))[v] = w, p);
          } else _(C) && (o(O !== void 0, "Cannot pick up or remove undefined"), C.p != null && (m[C.p] = O), O = void 0);
        }
        var p, v, w;
        return O;
      })(i, d), d);
    }
    function ce(i, d) {
      i = i.slice(), z(d);
      const m = r.readCursor(d);
      let D, O, I = !1;
      const x = [];
      for (let p = 0; ; p++) {
        const v = i[p], w = m.getComponent();
        if (w && (w.r !== void 0 ? I = !0 : w.p != null && (I = !1, D = w.p, O = p)), p >= i.length) break;
        let C = 0;
        const R = r.advancer(m, void 0, (g, S) => {
          _(S) && C++;
        });
        x.unshift(R);
        const W = R(v);
        if (typeof v == "number" && (i[p] -= C), !W) break;
      }
      if (x.forEach((p) => p.end()), I) return null;
      const N = () => {
        let p = 0;
        if (D != null) {
          const v = m.getPath();
          p = v.length, i = v.concat(i.slice(O));
        }
        for (; p < i.length; p++) {
          const v = i[p], w = l(m), C = ve(w);
          if (C) {
            const g = f(w);
            C.transformPosition && (i[p] = C.transformPosition(i[p], g));
            break;
          }
          let R = 0;
          const W = r.advancer(m, (g, S) => s(S) ? ~(g - R) : g - R, (g, S) => {
            s(S) && R++;
          })(v);
          if (typeof v == "number" && (i[p] += R), !W) break;
        }
      };
      return D != null ? m.eachDrop(null, (p) => {
        p === D && N();
      }) : N(), i;
    }
    function ne(i, d) {
      if (z(i), z(d), i == null) return d;
      if (d == null) return i;
      let m = 0;
      const D = r.readCursor(i), O = r.readCursor(d), I = r.writeCursor(), x = [], N = [], p = [], v = [], w = [], C = [], R = /* @__PURE__ */ new Set();
      D.traverse(null, (g) => {
        g.p != null && (p[g.p] = D.clone());
      }), O.traverse(null, (g) => {
        g.d != null && (v[g.d] = O.clone());
      });
      const W = r.writeCursor();
      return (function g(S, re, te, $, se, Re, Oe, ye) {
        o(re || te);
        const oe = l(re), Pe = l(te), Ae = !!Pe && Pe.r !== void 0, Ke = !!oe && oe.i !== void 0, Te = oe ? oe.d : null, Ie = Pe ? Pe.p : null, xe = (Re || Ae) && Ie == null;
        if (Ie != null) $ = v[Ie], Oe = N[Ie] = new r.WriteCursor();
        else if (Pe && Pe.r !== void 0) $ = null;
        else {
          const T = l($);
          T && T.d != null && ($ = null);
        }
        const Q = l($);
        if (Te != null) if (S = p[Te], ye = x[Te] = new r.WriteCursor(), xe) Re && !Ae && ye.write("r", !0);
        else {
          const T = w[Te] = m++;
          Oe.write("d", T);
        }
        else if (oe && oe.i !== void 0) S = null;
        else {
          const T = l(S);
          T && T.p != null && (S = null);
        }
        let A;
        Ke ? (o(se === void 0), A = oe.i) : A = se;
        const G = (Ie == null ? !Ke || Re || Ae : A === void 0) ? null : Oe.getComponent();
        if (Ie != null) {
          if (!(se !== void 0 || Ke)) {
            const T = Te != null ? w[Te] : m++;
            C[Ie] = T, ye.write("p", T);
          }
        } else Ae && (Ke || se !== void 0 || (Pe.r, ye.write("r", Pe.r)));
        const M = xe ? null : ve(oe), P = ve(Q);
        if ((M || P) && (M && M.name, P && P.name), M && P) {
          o(M === P);
          const T = f(oe), L = f(Q), he = M.compose(T, L);
          y(Oe, M, he), R.add(Q);
        } else M ? y(Oe, M, f(oe)) : P && (y(Oe, P, f(Q)), R.add(Q));
        const k = typeof A == "object" && A != null;
        let J = !1, X = 0, ee = 0, fe = 0, de = 0, ae = 0;
        const me = r.advancer($, (T, L) => s(L) ? de - T - 1 : T - de, (T, L) => {
          s(L) && de++;
        }), H = r.advancer(S, (T, L) => _(L) ? X - T - 1 : T - X, (T, L) => {
          _(L) && X++;
        });
        if (r.eachChildOf(re, te, (T, L, he) => {
          let we, Be, $e = T, Me = T, Ye = T;
          if (typeof T == "number") {
            let _e = T + fe;
            Be = me(_e), Me = _e + de;
            let ue = T + ee;
            we = H(ue), s(l(Be)) && (we = null), $e = ue + X, Ye = T + ae, o($e >= 0, "p1PickKey is negative"), o(Me >= 0, "p2DropKey is negative");
            const Se = s(l(L)), We = _(l(he));
            (Se || We && !xe) && ae--, Se && ee--, We && fe--;
          } else we = H(T), Be = me(T);
          ye.descend($e), Oe.descend(Me);
          const Xe = k && !s(l(L)) ? A[Ye] : void 0, je = g(we, L, he, Be, Xe, xe, Oe, ye);
          var Ne, j, ie;
          k && !xe ? Xe !== je && (J || (A = Array.isArray(A) ? A.slice() : Object.assign({}, A), J = !0), Ne = A, ie = je, typeof (j = Ye) == "number" ? (o(Array.isArray(Ne)), o(j < Ne.length)) : (o(!Array.isArray(Ne)), o(Ne[j] !== void 0)), ie === void 0 ? typeof j == "number" ? Ne.splice(j, 1) : delete Ne[j] : Ne[j] = ie) : o(je === void 0), Oe.ascend(), ye.ascend();
        }), H.end(), me.end(), G != null) G.i = A;
        else if (!Re && !Ae && Ie == null) return A;
      })(D, D.clone(), O, O.clone(), void 0, !1, I, W), I.reset(), I.mergeTree(W.get()), I.reset(), I.get(), x.map((g) => g.get()), N.map((g) => g.get()), D.traverse(I, (g, S) => {
        const re = g.p;
        if (re != null) {
          const te = w[re];
          te != null && S.write("p", te);
          const $ = x[re];
          $ && $.get(), $ && S.mergeTree($.get());
        } else g.r !== void 0 && S.write("r", g.r);
      }), I.reset(), I.get(), O.traverse(I, (g, S) => {
        const re = g.d;
        if (re != null) {
          const $ = C[re];
          $ != null && S.write("d", $);
          const se = N[re];
          se && S.mergeTree(se.get());
        } else g.i !== void 0 && S.write("i", g.i);
        const te = ve(g);
        te && !R.has(g) && y(S, te, f(g));
      }), I.get();
    }
    function le(i) {
      if (i == null) return null;
      const d = new r.ReadCursor(i), m = new r.WriteCursor();
      let D;
      const O = [], I = [];
      return (function x(N, p, v) {
        const w = N.getComponent();
        let C, R = !1;
        if (w) {
          w.p != null && (p.write("d", w.p), O[w.p] = N.clone()), w.r !== void 0 && p.write("i", w.r), w.d != null && (p.write("p", w.d), v = void 0), w.i !== void 0 && (v = C = w.i);
          const g = ve(w);
          g && (v === void 0 ? (D || (D = /* @__PURE__ */ new Set()), D.add(w)) : (f(w), v = g.apply(v, f(w)), R = !0));
        }
        let W = 0;
        for (const g of N) {
          p.descend(g);
          const S = typeof g == "number" ? g - W : g, re = Y(v, S);
          s(N.getComponent()) && W++;
          const te = x(N, p, re);
          if (v !== void 0 && te !== void 0) {
            if (R || (R = !0, v = B(v)), !U(v, S)) throw Error("Cannot modify child - invalid operation");
            v[S] = te;
          }
          p.ascend();
        }
        if (C === void 0) return R ? v : void 0;
        p.write("r", v);
      })(d, m, void 0), D && (m.reset(), (function x(N, p, v) {
        const w = p.getComponent();
        if (w) {
          const g = w.d;
          if (g != null && (N = O[g], v = I[g] = r.writeCursor()), D.has(w)) {
            const S = ve(w);
            if (!S.invert) throw Error(`Cannot invert subtype ${S.name}`);
            y(v, S, S.invert(f(w)));
          }
        }
        let C = 0, R = 0;
        const W = r.advancer(N, (g, S) => _(S) ? C - g - 1 : g - C, (g, S) => {
          _(S) && C++;
        });
        for (const g of p) if (typeof g == "number") {
          const S = g - R, re = W(S), te = S + C;
          v.descend(te), x(re, p, v), s(p.getComponent()) && R++, v.ascend();
        } else v.descend(g), x(W(g), p, v), v.ascend();
        W.end();
      })(d.clone(), d, m), I.length && (m.reset(), d.traverse(m, (x, N) => {
        const p = x.p;
        if (p != null) {
          const v = I[p];
          v && v.get(), v && N.mergeTree(v.get());
        }
      }))), m.get();
    }
    const ge = (i, d) => i.some((m) => typeof m == "object" && (Array.isArray(m) ? ge(m, d) : d(m)));
    function De(i, d) {
      if (i == null || !ge(i, (p) => {
        var v;
        return p.r !== void 0 || ((v = ve(p)) === null || v === void 0 ? void 0 : v.makeInvertible) != null;
      })) return i;
      const m = new r.ReadCursor(i), D = new r.WriteCursor();
      let O = !1;
      const I = [], x = [], N = (p, v, w) => {
        const C = p.getComponent();
        let R = !1;
        if (C) {
          C.d != null && v.write("d", C.d), C.i !== void 0 && v.write("i", C.i);
          const g = C.p;
          if (g != null && (I[g] = p.clone(), o(w !== void 0, "Operation picks up at an invalid key"), x[g] = w, v.write("p", C.p)), C.r !== void 0 && w === void 0) throw Error("Invalid doc / op in makeInvertible: removed item missing from doc");
          const S = ve(C);
          S && (S.makeInvertible ? O = !0 : y(v, S, f(C), !0));
        }
        let W = 0;
        for (const g of p) {
          v.descend(g);
          const S = typeof g == "number" ? g - W : g, re = Y(w, S), te = N(p, v, re);
          re !== te && (R || (R = !0, w = B(w)), te === void 0 ? (w = c(w, S), typeof g == "number" && W++) : w[S] = te), v.ascend();
        }
        return C && (C.r !== void 0 ? (v.write("r", t.default(w)), w = void 0) : C.p != null && (w = void 0)), w;
      };
      return N(m, D, d), D.get(), O && (D.reset(), (function p(v, w, C, R, W) {
        const g = w.getComponent();
        if (g) {
          g.i !== void 0 ? (R = g.i, W = !0) : g.d != null && (R = x[g.d], v = I[g.d], W = !1, g.d);
          let $ = ve(g);
          if ($ && $.makeInvertible) {
            const se = f(g);
            y(C, $, $.makeInvertible(se, R), !0);
          }
        }
        let S = 0, re = 0;
        const te = r.advancer(v, ($, se) => _(se) ? S - $ - 1 : $ - S, ($, se) => {
          _(se) && S++;
        });
        for (const $ of w) if (typeof $ == "number") {
          const se = $ - re, Re = te(se), Oe = se + S, ye = Y(R, W ? se : Oe);
          C.descend($), p(Re, w, C, ye, W), s(w.getComponent()) && re++, C.ascend();
        } else {
          const se = Y(R, $);
          C.descend($), p(te($), w, C, se, W), C.ascend();
        }
        te.end();
      })(m.clone(), m, D, d, !1)), D.get();
    }
    function Ut(i, d) {
      return le(De(i, d));
    }
    const it = (i) => {
      if (i == null) return null;
      const d = i.slice();
      for (let m = 0; m < i.length; m++) {
        const D = d[m];
        Array.isArray(D) && (d[m] = it(D));
      }
      return d;
    };
    function st(i, d, m) {
      o(m === "left" || m === "right", "Direction must be left or right");
      const D = m === "left" ? 0 : 1;
      if (d == null) return {
        ok: !0,
        result: i
      };
      z(i), z(d);
      let O = null;
      const I = [], x = [], N = [], p = [], v = [], w = [], C = [], R = [], W = [], g = [], S = [], re = [], te = [], $ = [], se = [];
      let Re = 0;
      const Oe = r.readCursor(i), ye = r.readCursor(d), oe = r.writeCursor();
      if ((function Q(A, G = null, M) {
        const P = l(G);
        P && (P.r !== void 0 ? M = G.clone() : P.p != null && (M = null, w[P.p] = A.clone()));
        const k = A.getComponent();
        let J;
        k && (J = k.p) != null && (v[J] = G ? G.clone() : null, N[J] = A.clone(), M && (g[J] = !0, W[J] = M), P && P.p != null && ($[J] = P.p));
        const X = r.advancer(G);
        for (const ee of A) Q(A, X(ee), M);
        X.end();
      })(ye, Oe, null), (function Q(A, G, M, P, k) {
        const J = M.getComponent();
        let X, ee = !1;
        J && ((X = J.d) != null ? (p[X] = M.clone(), P != null && (se[P] == null && (se[P] = []), se[P].push(X)), g[X], A = v[X] || null, G = N[X] || null, g[X] ? (k && (S[X] = !0), k = W[X] || null) : !k || D !== 1 && $[X] != null || O == null && (O = {
          type: u.ConflictType.RM_UNEXPECTED_CONTENT,
          op1: a.removeOp(k.getPath()),
          op2: a.moveOp(G.getPath(), M.getPath())
        }), ee = !0) : J.i !== void 0 && (A = G = null, ee = !0, k && O == null && (O = {
          type: u.ConflictType.RM_UNEXPECTED_CONTENT,
          op1: a.removeOp(k.getPath()),
          op2: a.insertOp(M.getPath(), J.i)
        })));
        const fe = l(A);
        fe && (fe.r !== void 0 ? k = A.clone() : fe.p != null && (fe.p, P = fe.p, k = null));
        const de = ve(J);
        de && k && O == null && (O = {
          type: u.ConflictType.RM_UNEXPECTED_CONTENT,
          op1: a.removeOp(k.getPath()),
          op2: a.editOp(M.getPath(), de, f(J), !0)
        });
        let ae = 0, me = 0;
        const H = r.advancer(G, (L, he) => _(he) ? ae - L - 1 : L - ae, (L, he) => {
          _(he) && ae++;
        }), T = r.advancer(A);
        for (const L of M) if (typeof L == "number") {
          const he = L - me, we = H(he);
          me += +Q(T(he + ae), we, M, P, k);
        } else {
          const he = H(L);
          Q(T(L), he, M, P, k);
        }
        return H.end(), T.end(), ee;
      })(Oe, ye, ye.clone(), null, null), p.map((Q) => Q && Q.get()), O) return {
        ok: !1,
        conflict: O
      };
      S.map((Q) => !!Q);
      const Pe = [];
      let Ae = null;
      (function Q(A, G, M, P, k) {
        let J = !1;
        const X = l(G);
        if (_(X)) {
          const H = X.p;
          H != null ? (M = p[H], P = re[H] = r.writeCursor(), J = !0, k = null) : (M = null, k = G.clone());
        } else s(l(M)) && (M = null);
        const ee = A.getComponent();
        if (ee) {
          const H = ee.p;
          H != null ? (k && (R[H] = k), Pe[H] = k || D === 1 && J ? null : P.getComponent(), I[H] = A.clone(), M && (C[H] = M.clone())) : ee.r !== void 0 && (k || P.write("r", !0), (k || J) && (Ae == null && (Ae = /* @__PURE__ */ new Set()), Ae.add(ee)));
        }
        let fe = 0, de = 0;
        const ae = r.advancer(G, void 0, (H, T) => {
          _(T) && fe++;
        }), me = r.advancer(M, (H, T) => s(T) ? ~(H - de) : H - de, (H, T) => {
          s(T) && de++;
        });
        if (A) for (const H of A) if (typeof H == "string") {
          const T = ae(H), L = me(H);
          P.descend(H), Q(A, T, L, P, k), P.ascend();
        } else {
          const T = ae(H), L = H - fe, he = _(l(T)) ? null : me(L), we = L + de;
          o(we >= 0), P.descend(we), Q(A, T, he, P, k), P.ascend();
        }
        ae.end(), me.end();
      })(Oe, ye, ye.clone(), oe, null), oe.reset();
      let Ke = [];
      if ((function Q(A, G, M, P, k, J) {
        o(G);
        const X = G.getComponent();
        let ee = l(P), fe = !1;
        const de = (j, ie, _e) => j ? a.moveOp(j.getPath(), ie.getPath()) : a.insertOp(ie.getPath(), _e.i);
        if (s(X)) {
          const j = X.d;
          j != null && (x[j] = G.clone());
          const ie = j != null ? Pe[j] : null;
          let _e = !1;
          if (X.i !== void 0 || j != null && ie) {
            let ue;
            ee && (ee.i !== void 0 || (ue = ee.d) != null && !g[ue]) && (_e = ue != null ? j != null && j === $[ue] : n.default(ee.i, X.i), _e || ue != null && D !== 1 && $[ue] != null || O == null && (O = {
              type: u.ConflictType.DROP_COLLISION,
              op1: de(j != null ? I[j] : null, G, X),
              op2: de(ue != null ? N[ue] : null, P, ee)
            })), _e || (J ? O == null && (O = {
              type: u.ConflictType.RM_UNEXPECTED_CONTENT,
              op1: de(j != null ? I[j] : null, G, X),
              op2: a.removeOp(J.getPath())
            }) : (j != null ? (Ke[Re] = j, k.write("d", ie.p = Re++)) : k.write("i", t.default(X.i)), fe = !0));
          } else if (j != null && !ie) {
            const ue = R[j];
            ue && (J = ue.clone());
          }
          j != null ? (A = I[j], M = w[j], P = C[j]) : X.i !== void 0 && (A = M = null, _e || (P = null));
        } else _(l(A)) && (A = M = P = null);
        const ae = l(A), me = l(M);
        if (_(me)) {
          const j = me.p;
          me.r !== void 0 && (!ae || ae.r === void 0) || g[j] ? (P = null, J = M.clone()) : j != null && (P = p[j], D !== 1 && $[j] != null || ((k = te[j]) || (k = te[j] = r.writeCursor()), k.reset(), J = null));
        } else !s(X) && s(ee) && (P = null);
        ee = P != null ? P.getComponent() : null;
        const H = ve(X);
        if (H) {
          const j = f(X);
          if (J) O == null && (O = {
            type: u.ConflictType.RM_UNEXPECTED_CONTENT,
            op1: a.editOp(G.getPath(), H, j, !0),
            op2: a.removeOp(J.getPath())
          });
          else {
            const ie = ve(ee);
            let _e;
            if (ie) {
              if (H !== ie) throw Error("Transforming incompatible types");
              const ue = f(ee);
              _e = H.transform(j, ue, m);
            } else _e = t.default(j);
            y(k, H, _e);
          }
        }
        let T = 0, L = 0, he = 0, we = 0, Be = 0, $e = 0, Me = A != null && A.descendFirst(), Ye = Me;
        const Xe = r.advancer(M, void 0, (j, ie) => {
          _(ie) && he++;
        });
        let je = P != null && P.descendFirst(), Ne = je;
        for (const j of G) if (typeof j == "number") {
          let ie;
          const _e = s(G.getComponent()), ue = j - L;
          {
            let Ge;
            for (; Me && typeof (Ge = A.getKey()) == "number"; ) {
              Ge += T;
              const ke = A.getComponent(), Je = _(ke);
              if (Ge > ue || Ge === ue && (!Je || D === 0 && _e)) break;
              if (Je) {
                T--;
                const Fe = ke.p;
                $.includes(Fe), ke.d, l(te[ke.d]), _(l(te[ke.d])), (ke.r === void 0 || Ae && Ae.has(ke)) && (Fe == null || !Pe[Fe] || D !== 1 && $.includes(Fe)) || Be--;
              }
              Me = A.nextSibling();
            }
            ie = Me && Ge === ue ? A : null;
          }
          const Se = ue - T;
          let We = Xe(Se);
          const ot = Se - he;
          let Qe = null;
          {
            let Ge, ke;
            for (; je && typeof (Ge = P.getKey()) == "number"; ) {
              ke = Ge - we;
              const Je = P.getComponent(), Fe = s(Je);
              if (ke > ot) break;
              if (ke === ot) {
                if (!Fe) {
                  Qe = P;
                  break;
                }
                {
                  if (D === 0 && _e) {
                    Qe = P;
                    break;
                  }
                  const Le = We && _(We.getComponent());
                  if (D === 0 && Le) break;
                }
              }
              if (Fe) {
                const Le = Je.d;
                g[Le], $[Le], Je.i === void 0 && (g[Le] || $[Le] != null && D !== 1) ? (g[Le] || $[Le] != null && D === 0) && (we++, $e--) : we++;
              }
              je = P.nextSibling();
            }
          }
          const _t = ot + we + Be + $e;
          o(_t >= 0, "trying to descend to a negative index"), k.descend(_t), _e && (ie = We = Qe = null, L++), Q(ie, G, We, Qe, k, J) && $e++, k.ascend();
        } else {
          let ie;
          for (; Me && (ie = A.getKey(), typeof ie != "string" || !(ie > j || ie === j)); ) Me = A.nextSibling();
          const _e = Me && ie === j ? A : null, ue = Xe(j);
          let Se;
          for (; je && (Se = P.getKey(), typeof Se != "string" || !(Se > j || Se === j)); ) je = P.nextSibling();
          const We = je && Se === j ? P : null;
          k.descend(j), Q(_e, G, ue, We, k, J), k.ascend();
        }
        return Xe.end(), Ye && A.ascend(), Ne && P.ascend(), fe;
      })(Oe, Oe.clone(), ye, ye.clone(), oe, null), O) return {
        ok: !1,
        conflict: O
      };
      oe.reset();
      const Te = (Q, A, G) => Q.traverse(A, (M, P) => {
        M.d != null && G(M.d, Q, P);
      });
      (g.length || re.length) && (Te(ye, oe, (Q, A, G) => {
        g[Q] && !S[Q] && G.write("r", !0), re[Q] && G.mergeTree(re[Q].get());
      }), oe.reset());
      const Ie = [], xe = [];
      if ((te.length || g.length) && !O) {
        const Q = r.readCursor(it(oe.get()));
        if (Te(Q, null, (A, G) => {
          Ie[A] = G.clone();
        }), te.forEach((A) => {
          A && Te(r.readCursor(A.get()), null, (G, M) => {
            Ie[G] = M.clone();
          });
        }), (function A(G, M, P, k, J, X) {
          const ee = l(M);
          if (ee && _(ee)) if (ee.p != null) {
            const T = ee.p;
            Ie[T].getPath(), P = Ie[T], k = xe[T] = r.writeCursor();
          } else ee.r !== void 0 && (P = null);
          else s(l(P)) && (P = null);
          const fe = G.getComponent();
          if (fe) {
            let T;
            if ((T = fe.d) != null) {
              const L = te[T];
              L && (L.get(), k.mergeTree(L.get()), P = r.readCursor(L.get()));
            }
          }
          let de = 0, ae = 0;
          const me = r.advancer(M, void 0, (T, L) => {
            _(L) && de--;
          }), H = r.advancer(P, (T, L) => s(L) ? -(T - ae) - 1 : T - ae, (T, L) => {
            s(L) && ae++;
          });
          for (const T of G) if (typeof T == "number") {
            const L = me(T), he = T + de, we = H(he), Be = he + ae;
            k.descend(Be), A(G, L, we, k), k.ascend();
          } else k.descend(T), A(G, me(T), H(T), k), k.ascend();
          me.end(), H.end();
        })(ye, Q, Q.clone(), oe), oe.reset(), O) return {
          ok: !1,
          conflict: O
        };
        if (oe.get(), xe.length) {
          const A = xe.map((M) => M ? M.get() : null), G = r.readCursor(it(oe.get()));
          if (Te(G, oe, (M, P, k) => {
            const J = A[M];
            J && (k.mergeTree(J), A[M] = null);
          }), A.find((M) => M)) {
            const M = r.writeCursor(), P = r.writeCursor();
            let k = 0, J = 0;
            A.forEach((X) => {
              X != null && Te(r.readCursor(X), null, (ee) => {
                const fe = Ke[ee];
                M.writeMove(I[fe].getPath(), x[fe].getPath(), k++);
                const de = se[fe];
                de && de.forEach((ae) => {
                  g[ae] || D !== 1 && $[ae] != null || P.writeMove(N[ae].getPath(), p[ae].getPath(), J++);
                });
              });
            }), O = {
              type: u.ConflictType.BLACKHOLE,
              op1: M.get(),
              op2: P.get()
            };
          }
        }
      }
      return O ? {
        ok: !1,
        conflict: O
      } : {
        ok: !0,
        result: oe.get()
      };
    }
    const gt = (i) => {
      const d = new Error("Transform detected write conflict");
      throw d.conflict = i, d.type = d.name = "writeConflict", d;
    };
    function jt(i, d, m) {
      const D = st(i, d, m);
      if (D.ok) return D.result;
      gt(D.conflict);
    }
    const ze = (i) => {
      const d = r.writeCursor();
      return r.readCursor(i).traverse(d, (m, D) => {
        (s(m) || ve(m)) && D.write("r", !0);
      }), d.get();
    }, Nt = (i, d) => {
      const { type: m, op1: D, op2: O } = i;
      switch (m) {
        case u.ConflictType.DROP_COLLISION:
          return d === "left" ? [null, ze(O)] : [ze(D), null];
        case u.ConflictType.RM_UNEXPECTED_CONTENT:
          let I = !1;
          return r.readCursor(D).traverse(null, (x) => {
            x.r !== void 0 && (I = !0);
          }), I ? [null, ze(O)] : [ze(D), null];
        case u.ConflictType.BLACKHOLE:
          return [ze(D), ze(O)];
        default:
          throw Error("Unrecognised conflict: " + m);
      }
    };
    function yt(i, d, m, D) {
      let O = null;
      for (; ; ) {
        const I = st(d, m, D);
        if (I.ok) return ne(O, I.result);
        {
          const { conflict: x } = I;
          i(x) || gt(x);
          const [N, p] = Nt(x, D);
          d = ne(K(d), N), m = ne(K(m), p), O = ne(O, p);
        }
      }
    }
  })(Ze)), Ze;
}
var Tt;
function an() {
  return Tt || (Tt = 1, (function(a) {
    var e = Ve && Ve.__createBinding || (Object.create ? (function(u, o, l, E) {
      E === void 0 && (E = l), Object.defineProperty(u, E, { enumerable: !0, get: function() {
        return o[l];
      } });
    }) : (function(u, o, l, E) {
      E === void 0 && (E = l), u[E] = o[l];
    })), n = Ve && Ve.__exportStar || function(u, o) {
      for (var l in u) l !== "default" && !o.hasOwnProperty(l) && e(o, u, l);
    };
    Object.defineProperty(a, "__esModule", { value: !0 }), n(on(), a);
    var t = St();
    Object.defineProperty(a, "ReadCursor", { enumerable: !0, get: function() {
      return t.ReadCursor;
    } }), Object.defineProperty(a, "WriteCursor", { enumerable: !0, get: function() {
      return t.WriteCursor;
    } });
    var r = kt();
    Object.defineProperty(a, "ConflictType", { enumerable: !0, get: function() {
      return r.ConflictType;
    } });
  })(Ve)), Ve;
}
var V = an();
class ln {
  constructor() {
    F(this, "drawingManagerData", {});
    F(this, "_oldDrawingManagerData", {});
    F(this, "_focusDrawings", []);
    F(this, "_remove$", new be());
    F(this, "remove$", this._remove$.asObservable());
    F(this, "_add$", new be());
    F(this, "add$", this._add$.asObservable());
    F(this, "_update$", new be());
    F(this, "update$", this._update$.asObservable());
    F(this, "_order$", new be());
    F(this, "order$", this._order$.asObservable());
    F(this, "_group$", new be());
    F(this, "group$", this._group$.asObservable());
    F(this, "_ungroup$", new be());
    F(this, "ungroup$", this._ungroup$.asObservable());
    F(this, "_refreshTransform$", new be());
    F(this, "refreshTransform$", this._refreshTransform$.asObservable());
    F(this, "_visible$", new be());
    F(this, "visible$", this._visible$.asObservable());
    // private readonly _externalUpdate$ = new Subject<T[]>();
    // readonly externalUpdate$ = this._externalUpdate$.asObservable();
    F(this, "_focus$", new be());
    F(this, "focus$", this._focus$.asObservable());
    F(this, "_featurePluginUpdate$", new be());
    F(this, "featurePluginUpdate$", this._featurePluginUpdate$.asObservable());
    F(this, "_featurePluginAdd$", new be());
    F(this, "featurePluginAdd$", this._featurePluginAdd$.asObservable());
    F(this, "_featurePluginRemove$", new be());
    F(this, "featurePluginRemove$", this._featurePluginRemove$.asObservable());
    F(this, "_featurePluginOrderUpdate$", new be());
    F(this, "featurePluginOrderUpdate$", this._featurePluginOrderUpdate$.asObservable());
    F(this, "_featurePluginGroupUpdate$", new be());
    F(this, "featurePluginGroupUpdate$", this._featurePluginGroupUpdate$.asObservable());
    F(this, "_featurePluginUngroupUpdate$", new be());
    F(this, "featurePluginUngroupUpdate$", this._featurePluginUngroupUpdate$.asObservable());
    F(this, "_visible", !0);
    F(this, "_editable", !0);
  }
  dispose() {
    this._remove$.complete(), this._add$.complete(), this._update$.complete(), this._order$.complete(), this._focus$.complete(), this._featurePluginUpdate$.complete(), this._featurePluginAdd$.complete(), this._featurePluginRemove$.complete(), this._featurePluginOrderUpdate$.complete(), this.drawingManagerData = {}, this._oldDrawingManagerData = {};
  }
  visibleNotification(e) {
    this._visible$.next(e);
  }
  refreshTransform(e) {
    e.forEach((n) => {
      const t = this._getCurrentBySearch(n);
      t != null && (t.transform = n.transform, t.transforms = n.transforms, t.isMultiTransform = n.isMultiTransform);
    }), this.refreshTransformNotification(e);
  }
  getDrawingDataForUnit(e) {
    return this.drawingManagerData[e] || {};
  }
  removeDrawingDataForUnit(e) {
    const n = this.drawingManagerData[e];
    if (n == null)
      return;
    delete this.drawingManagerData[e];
    const t = [];
    Object.keys(n).forEach((r) => {
      const u = n[r];
      (u == null ? void 0 : u.data) != null && Object.keys(u.data).forEach((o) => {
        t.push({ unitId: e, subUnitId: r, drawingId: o });
      });
    }), t.length > 0 && this.removeNotification(t);
  }
  registerDrawingData(e, n) {
    this.drawingManagerData[e] = n;
  }
  initializeNotification(e) {
    const n = [], t = this.drawingManagerData[e];
    t != null && (Object.keys(t).forEach((r) => {
      this._establishDrawingMap(e, r);
      const u = t[r];
      Object.keys(u.data).forEach((o) => {
        const l = u.data[o];
        l.unitId = e, l.subUnitId = r, n.push(l);
      });
    }), n.length > 0 && this.addNotification(n));
  }
  getDrawingData(e, n) {
    return this._getDrawingData(e, n);
  }
  // Use in doc only.
  setDrawingData(e, n, t) {
    this.drawingManagerData[e][n].data = t;
  }
  getBatchAddOp(e) {
    const n = [], t = [], r = [];
    e.forEach((B) => {
      const { op: _, invertOp: s } = this._addByParam(B);
      n.push({ unitId: B.unitId, subUnitId: B.subUnitId, drawingId: B.drawingId }), t.push(_), r.push(s);
    });
    const u = t.reduce(V.type.compose, null), o = r.reduce(V.type.compose, null), { unitId: l, subUnitId: E } = e[0];
    return { undo: o, redo: u, unitId: l, subUnitId: E, objects: n };
  }
  getBatchRemoveOp(e) {
    const n = [], t = [];
    e.forEach((E) => {
      const { op: B, invertOp: _ } = this._removeByParam(E);
      n.unshift(B), t.push(_);
    });
    const r = n.reduce(V.type.compose, null), u = t.reduce(V.type.compose, null), { unitId: o, subUnitId: l } = e[0];
    return { undo: u, redo: r, unitId: o, subUnitId: l, objects: e };
  }
  getBatchUpdateOp(e) {
    const n = [], t = [], r = [];
    e.forEach((B) => {
      const { op: _, invertOp: s } = this._updateByParam(B);
      n.push({ unitId: B.unitId, subUnitId: B.subUnitId, drawingId: B.drawingId }), t.push(_), r.push(s);
    });
    const u = t.reduce(V.type.compose, null), o = r.reduce(V.type.compose, null), { unitId: l, subUnitId: E } = e[0];
    return { undo: o, redo: u, unitId: l, subUnitId: E, objects: n };
  }
  removeNotification(e) {
    this._remove$.next(e);
  }
  addNotification(e) {
    this._add$.next(e);
  }
  updateNotification(e) {
    this._update$.next(e);
  }
  orderNotification(e) {
    this._order$.next(e);
  }
  groupUpdateNotification(e) {
    this._group$.next(e);
  }
  ungroupUpdateNotification(e) {
    this._ungroup$.next(e);
  }
  refreshTransformNotification(e) {
    this._refreshTransform$.next(e);
  }
  getGroupDrawingOp(e) {
    const n = [], { unitId: t, subUnitId: r } = e[0].parent;
    e.forEach((l) => {
      n.push(this._getGroupDrawingOp(l));
    });
    const u = n.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(u, this.drawingManagerData), redo: u, unitId: t, subUnitId: r, objects: e };
  }
  getUngroupDrawingOp(e) {
    const n = [], { unitId: t, subUnitId: r } = e[0].parent;
    e.forEach((l) => {
      n.push(this._getUngroupDrawingOp(l));
    });
    const u = n.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(u, this.drawingManagerData), redo: u, unitId: t, subUnitId: r, objects: e };
  }
  getDrawingsByGroup(e) {
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    if (this.getDrawingByParam({ unitId: n, subUnitId: t, drawingId: r }) == null)
      return [];
    const o = this._getDrawingData(n, t), l = [];
    return Object.keys(o).forEach((E) => {
      const B = o[E];
      B.groupId === r && l.push(B);
    }), l;
  }
  _getGroupDrawingOp(e) {
    const { parent: n, children: t } = e, { unitId: r, subUnitId: u, drawingId: o } = n, l = [];
    l.push(
      V.insertOp([r, u, "data", o], n)
    );
    let E = Number.NEGATIVE_INFINITY;
    return t.forEach((B) => {
      const { unitId: _, subUnitId: s, drawingId: c } = B, h = this._hasDrawingOrder({ unitId: _, subUnitId: s, drawingId: c });
      E = Math.max(E, h), l.push(
        ...this._getUpdateParamCompareOp(B, this.getDrawingByParam({ unitId: _, subUnitId: s, drawingId: c }))
      );
    }), E === Number.NEGATIVE_INFINITY && (E = this._getDrawingOrder(r, u).length), l.push(
      V.insertOp([r, u, "order", E], o)
    ), l.reduce(V.type.compose, null);
  }
  _getUngroupDrawingOp(e) {
    const { parent: n, children: t } = e, { unitId: r, subUnitId: u, drawingId: o } = n, l = [];
    return t.forEach((E) => {
      const { unitId: B, subUnitId: _, drawingId: s } = E;
      l.push(
        ...this._getUpdateParamCompareOp(E, this.getDrawingByParam({ unitId: B, subUnitId: _, drawingId: s }))
      );
    }), l.push(
      V.removeOp([r, u, "data", o], !0)
    ), l.push(
      V.removeOp([r, u, "order", this._getDrawingOrder(r, u).indexOf(o)], !0)
    ), l.reduce(V.type.compose, null);
  }
  applyJson1(e, n, t) {
    this._establishDrawingMap(e, n), this._oldDrawingManagerData = { ...this.drawingManagerData }, this.drawingManagerData = V.type.apply(this.drawingManagerData, t);
  }
  // private _fillMissingFields(jsonOp: JSONOp) {
  //     if (jsonOp == null) {
  //         return;
  //     }
  //     let object: { [key: string]: {} } = this.drawingManagerData;
  //     for (let i = 0; i < jsonOp.length; i++) {
  //         const op = jsonOp[i];
  //         if (Array.isArray(op)) {
  //             const opKey = op[0] as string;
  //             if (!(opKey in object)) {
  //                 object[opKey] = null as unknown as never;
  //             }
  //         } else if (typeof op === 'string') {
  //             object = object[op];
  //             if (object == null) {
  //                 break;
  //             }
  //         }
  //     }
  // }
  featurePluginUpdateNotification(e) {
    this._featurePluginUpdate$.next(e);
  }
  featurePluginOrderUpdateNotification(e) {
    this._featurePluginOrderUpdate$.next(e);
  }
  featurePluginAddNotification(e) {
    this._featurePluginAdd$.next(e);
  }
  featurePluginRemoveNotification(e) {
    this._featurePluginRemove$.next(e);
  }
  featurePluginGroupUpdateNotification(e) {
    this._featurePluginGroupUpdate$.next(e);
  }
  featurePluginUngroupUpdateNotification(e) {
    this._featurePluginUngroupUpdate$.next(e);
  }
  getDrawingByParam(e) {
    return this._getCurrentBySearch(e);
  }
  getOldDrawingByParam(e) {
    return this._getOldBySearch(e);
  }
  getDrawingOKey(e) {
    const [n, t, r] = e.split("#-#");
    return this._getCurrentBySearch({ unitId: n, subUnitId: t, drawingId: r });
  }
  focusDrawing(e) {
    if (e == null || e.length === 0) {
      this._focusDrawings = [], this._focus$.next([]);
      return;
    }
    const n = [];
    e.forEach((t) => {
      var E;
      const { unitId: r, subUnitId: u, drawingId: o } = t, l = (E = this._getDrawingData(r, u)) == null ? void 0 : E[o];
      l != null && n.push(l);
    }), n.length > 0 && (this._focusDrawings = n, this._focus$.next(n));
  }
  getFocusDrawings() {
    const e = [];
    return this._focusDrawings.forEach((n) => {
      var l;
      const { unitId: t, subUnitId: r, drawingId: u } = n, o = (l = this._getDrawingData(t, r)) == null ? void 0 : l[u];
      o != null && e.push(o);
    }), e;
  }
  getDrawingOrder(e, n) {
    return this._getDrawingOrder(e, n);
  }
  // Use in doc only.
  setDrawingOrder(e, n, t) {
    this.drawingManagerData[e][n].order = t;
  }
  orderUpdateNotification(e) {
    this._order$.next(e);
  }
  getForwardDrawingsOp(e) {
    const { unitId: n, subUnitId: t, drawingIds: r } = e, u = [], o = this.getDrawingOrder(n, t), l = [...r];
    r.forEach((_) => {
      const s = this._hasDrawingOrder({ unitId: n, subUnitId: t, drawingId: _ });
      if (s === -1 || s === o.length - 1)
        return;
      const c = V.moveOp([n, t, "order", s], [n, t, "order", s + 1]);
      u.push(c), l.includes(o[s + 1]) || l.push(o[s + 1]);
    });
    const E = u.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(E, this.drawingManagerData), redo: E, unitId: n, subUnitId: t, objects: { ...e, drawingIds: l } };
  }
  getBackwardDrawingOp(e) {
    const { unitId: n, subUnitId: t, drawingIds: r } = e, u = [], o = this.getDrawingOrder(n, t), l = [...r];
    r.forEach((_) => {
      const s = this._hasDrawingOrder({ unitId: n, subUnitId: t, drawingId: _ });
      if (s === -1 || s === 0)
        return;
      const c = V.moveOp([n, t, "order", s], [n, t, "order", s - 1]);
      u.push(c), l.includes(o[s - 1]) || l.push(o[s - 1]);
    });
    const E = u.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(E, this.drawingManagerData), redo: E, unitId: n, subUnitId: t, objects: { ...e, drawingIds: l } };
  }
  getFrontDrawingsOp(e) {
    const { unitId: n, subUnitId: t, drawingIds: r } = e, u = this._getOrderFromSearchParams(n, t, r), o = [...r], l = this.getDrawingOrder(n, t), E = [];
    u.forEach((s) => {
      const { drawingId: c } = s, h = this._getDrawingCount(n, t) - 1, U = V.moveOp([n, t, "order", this._getDrawingOrder(n, t).indexOf(c)], [n, t, "order", h]);
      E.push(U), o.includes(l[h]) || o.push(l[h]);
    });
    const B = E.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(B, this.drawingManagerData), redo: B, unitId: n, subUnitId: t, objects: { ...e, drawingIds: o } };
  }
  getBackDrawingsOp(e) {
    const { unitId: n, subUnitId: t, drawingIds: r } = e, u = this._getOrderFromSearchParams(n, t, r, !0), o = [...r], l = this.getDrawingOrder(n, t), E = [];
    u.forEach((s) => {
      const { drawingId: c } = s, h = V.moveOp([n, t, "order", this._getDrawingOrder(n, t).indexOf(c)], [n, t, "order", 0]);
      E.push(h), o.includes(l[0]) || o.push(l[0]);
    });
    const B = E.reduce(V.type.compose, null);
    return { undo: V.type.invertWithDoc(B, this.drawingManagerData), redo: B, unitId: n, subUnitId: t, objects: { ...e, drawingIds: o } };
  }
  _getDrawingCount(e, n) {
    return this.getDrawingOrder(e, n).length || 0;
  }
  _getOrderFromSearchParams(e, n, t, r = !1) {
    return t.map((u) => {
      const o = this._hasDrawingOrder({ unitId: e, subUnitId: n, drawingId: u });
      return { drawingId: u, zIndex: o };
    }).sort(r === !1 ? Gt : Lt);
  }
  _hasDrawingOrder(e) {
    if (e == null)
      return -1;
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    return this._establishDrawingMap(n, t), this._getDrawingOrder(n, t).indexOf(r);
  }
  _getCurrentBySearch(e) {
    var u, o, l;
    if (e == null)
      return;
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    return (l = (o = (u = this.drawingManagerData[n]) == null ? void 0 : u[t]) == null ? void 0 : o.data) == null ? void 0 : l[r];
  }
  _getOldBySearch(e) {
    var u, o, l;
    if (e == null)
      return;
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    return (l = (o = (u = this._oldDrawingManagerData[n]) == null ? void 0 : u[t]) == null ? void 0 : o.data) == null ? void 0 : l[r];
  }
  _establishDrawingMap(e, n, t) {
    var r;
    return this.drawingManagerData[e] || (this.drawingManagerData[e] = {}), this.drawingManagerData[e][n] || (this.drawingManagerData[e][n] = {
      data: {},
      order: []
    }), t == null ? null : (r = this.drawingManagerData[e][n].data) == null ? void 0 : r[t];
  }
  _addByParam(e) {
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    this._establishDrawingMap(n, t, r);
    const u = V.insertOp([n, t, "data", r], e), o = V.insertOp([n, t, "order", this._getDrawingOrder(n, t).length], r), l = [u, o].reduce(V.type.compose, null), E = V.type.invertWithDoc(l, this.drawingManagerData);
    return { op: l, invertOp: E };
  }
  _removeByParam(e) {
    if (e == null)
      return { op: [], invertOp: [] };
    const { unitId: n, subUnitId: t, drawingId: r } = e;
    if (this._establishDrawingMap(n, t, r) == null)
      return { op: [], invertOp: [] };
    const o = V.removeOp([n, t, "data", r], !0), l = V.removeOp([n, t, "order", this._getDrawingOrder(n, t).indexOf(r)], !0), E = [o, l].reduce(V.type.compose, null), B = V.type.invertWithDoc(E, this.drawingManagerData);
    return { op: E, invertOp: B };
  }
  _updateByParam(e) {
    const { unitId: n, subUnitId: t, drawingId: r } = e, u = this._establishDrawingMap(n, t, r);
    if (u == null)
      return { op: [], invertOp: [] };
    const l = this._getUpdateParamCompareOp(e, u).reduce(V.type.compose, null), E = V.type.invertWithDoc(l, this.drawingManagerData);
    return { op: l, invertOp: E };
  }
  // private _initializeDrawingData(updateParam: T, oldParam: T) {
  //     Object.keys(updateParam).forEach((key) => {
  //         if (!(key in oldParam)) {
  //             oldParam[key as keyof IDrawingParam] = null as unknown as never;
  //         }
  //     });
  // }
  _getUpdateParamCompareOp(e, n) {
    const { unitId: t, subUnitId: r, drawingId: u } = e, o = [];
    return Object.keys(e).forEach((l) => {
      const E = e[l], B = n[l];
      B !== E && o.push(
        V.replaceOp([t, r, "data", u, l], B, E)
      );
    }), o;
  }
  _getDrawingData(e, n) {
    var t, r;
    return ((r = (t = this.drawingManagerData[e]) == null ? void 0 : t[n]) == null ? void 0 : r.data) || {};
  }
  _getDrawingOrder(e, n) {
    var t, r;
    return ((r = (t = this.drawingManagerData[e]) == null ? void 0 : t[n]) == null ? void 0 : r.order) || [];
  }
  getDrawingVisible() {
    return this._visible;
  }
  getDrawingEditable() {
    return this._editable;
  }
  setDrawingVisible(e) {
    this._visible = e;
  }
  setDrawingEditable(e) {
    this._editable = e;
  }
}
class un extends ln {
}
class cn {
  constructor() {
    F(this, "_waitCount", 0);
    F(this, "_change$", new be());
    F(this, "change$", this._change$);
    F(this, "_imageSourceCache", /* @__PURE__ */ new Map());
  }
  setWaitCount(e) {
    this._waitCount = e, this._change$.next(e);
  }
  getImageSourceCache(e, n) {
    if (n === at.BASE64) {
      const t = new Image();
      return t.src = e, t;
    }
    return this._imageSourceCache.get(e);
  }
  addImageSourceCache(e, n, t) {
    n === at.BASE64 || t == null || this._imageSourceCache.set(e, t);
  }
  async getImage(e) {
    return Promise.resolve(e);
  }
  async saveImage(e) {
    return new Promise((n, t) => {
      if (!Zt.includes(e.type)) {
        t(new Error(et.ERROR_IMAGE_TYPE)), this._decreaseWaiting();
        return;
      }
      if (e.size > Yt) {
        t(new Error(et.ERROR_EXCEED_SIZE)), this._decreaseWaiting();
        return;
      }
      const r = new FileReader();
      r.readAsDataURL(e), r.onload = (u) => {
        var E;
        const o = (E = u.target) == null ? void 0 : E.result;
        if (o == null) {
          t(new Error(et.ERROR_IMAGE)), this._decreaseWaiting();
          return;
        }
        const l = qt(6);
        n({
          imageId: l,
          imageSourceType: at.BASE64,
          source: o,
          base64Cache: o,
          status: et.SUCCUSS
        }), this._decreaseWaiting();
      };
    });
  }
  _decreaseWaiting() {
    this._waitCount -= 1, this._change$.next(this._waitCount);
  }
}
var dn = Object.getOwnPropertyDescriptor, fn = (a, e, n, t) => {
  for (var r = t > 1 ? void 0 : t ? dn(e, n) : e, u = a.length - 1, o; u >= 0; u--)
    (o = a[u]) && (r = o(r) || r);
  return r;
}, dt = (a, e) => (n, t) => e(n, t, a);
const hn = "UNIVER_DRAWING_PLUGIN";
var ft;
let At = (ft = class extends Ht {
  constructor(a = vt, e, n, t) {
    super(), this._config = a, this._injector = e, this._configService = n, this._commandService = t;
    const { ...r } = zt(
      {},
      vt,
      this._config
    );
    this._configService.setConfig(en, r);
  }
  onStarting() {
    this._initCommands(), this._initDependencies();
  }
  _initDependencies() {
    var n;
    Xt([
      [Jt, { useClass: cn }],
      [Mt, { useClass: un }]
    ], (n = this._config) == null ? void 0 : n.override).forEach((t) => this._injector.add(t));
  }
  _initCommands() {
    [
      Qt
    ].forEach((a) => this.disposeWithMe(this._commandService.registerCommand(a)));
  }
}, F(ft, "pluginName", hn), ft);
At = fn([
  dt(1, Kt($t)),
  dt(2, Ft),
  dt(3, Vt)
], At);
function On({ unitId: a, subUnitId: e, drawingId: n }, t) {
  return typeof t == "number" ? `${a}#-#${e}#-#${n}#-#${t}` : `${a}#-#${e}#-#${n}`;
}
const wn = async (a) => new Promise((e, n) => {
  const t = new Image();
  t.src = a, t.onload = () => {
    e({
      width: t.width,
      height: t.height,
      image: t
    });
  }, t.onerror = (r) => {
    n(r);
  };
});
export {
  Zt as DRAWING_IMAGE_ALLOW_IMAGE_LIST,
  Yt as DRAWING_IMAGE_ALLOW_SIZE,
  mn as DRAWING_IMAGE_COUNT_LIMIT,
  vn as DRAWING_IMAGE_HEIGHT_LIMIT,
  _n as DRAWING_IMAGE_WIDTH_LIMIT,
  un as DrawingManagerService,
  Mt as IDrawingManagerService,
  In as IImageIoService,
  cn as ImageIoService,
  En as ImageSourceType,
  Dn as ImageUploadStatusType,
  Qt as SetDrawingSelectedOperation,
  ln as UnitDrawingService,
  At as UniverDrawingPlugin,
  On as getDrawingShapeKeyByDrawingSearch,
  wn as getImageSize
};
