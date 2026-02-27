import * as h from "react";
import K, { useRef as ye, createElement as xt, forwardRef as Ue, useState as De, Children as wi, cloneElement as Ns, createContext as Rc, useMemo as lt, useContext as Jn, isValidElement as Ds, useCallback as dt, useEffect as qe, memo as Wi, useLayoutEffect as Bi, version as Fp, useImperativeHandle as Mc } from "react";
import { jsx as R, jsxs as me, Fragment as dr } from "react/jsx-runtime";
import * as Pc from "react-dom";
import rn, { createPortal as _o, unstable_batchedUpdates as Hp, flushSync as Ya } from "react-dom";
import { createRoot as Wp } from "react-dom/client";
import { defaultTheme as lR, greenTheme as cR } from "@univerjs/themes";
function Ct({ ref: e, ...t }) {
  const { icon: n, id: r, className: o, extend: i, ...a } = t, s = `univerjs-icon univerjs-icon-${r} ${o || ""}`.trim(), l = ye(`_${Vp()}`);
  return Nc(n, `${r}`, {
    defIds: n.defIds,
    idSuffix: l.current
  }, {
    ref: e,
    className: s,
    ...a
  }, i);
}
function Nc(e, t, n, r, o) {
  return xt(e.tag, {
    key: t,
    ...Bp(e, n, o),
    ...r
  }, (jp(e, n).children || []).map((i, a) => Nc(i, `${t}-${e.tag}-${a}`, n, void 0, o)));
}
function Bp(e, t, n) {
  const r = { ...e.attrs };
  n != null && n.colorChannel1 && r.fill === "colorChannel1" && (r.fill = n.colorChannel1), e.tag === "mask" && r.id && (r.id = r.id + t.idSuffix), Object.entries(r).forEach(([i, a]) => {
    i === "mask" && typeof a == "string" && (r[i] = a.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: o } = t;
  return !o || o.length === 0 || (e.tag === "use" && r["xlink:href"] && (r["xlink:href"] = r["xlink:href"] + t.idSuffix), Object.entries(r).forEach(([i, a]) => {
    typeof a == "string" && (r[i] = a.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), r;
}
function jp(e, t) {
  var r;
  const { defIds: n } = t;
  return !n || n.length === 0 ? e : e.tag === "defs" && ((r = e.children) != null && r.length) ? {
    ...e,
    children: e.children.map((o) => typeof o.attrs.id == "string" && n && n.includes(o.attrs.id) ? {
      ...o,
      attrs: {
        ...o.attrs,
        id: o.attrs.id + t.idSuffix
      }
    } : o)
  } : e;
}
function Vp() {
  return Math.random().toString(36).substring(2, 8);
}
Ct.displayName = "UniverIcon";
const qp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.87598 11.8327C8.87598 11.5013 9.14461 11.2327 9.47598 11.2327H11.476C11.8073 11.2327 12.076 11.5013 12.076 11.8327C12.076 12.164 11.8073 12.4327 11.476 12.4327H9.47598C9.14461 12.4327 8.87598 12.164 8.87598 11.8327Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.80898 11.2327C4.47761 11.2327 4.20898 11.5013 4.20898 11.8327C4.20898 12.164 4.47761 12.4327 4.80898 12.4327H6.80898C7.14036 12.4327 7.40898 12.164 7.40898 11.8327C7.40898 11.5013 7.14036 11.2327 6.80898 11.2327H4.80898Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.87598 9.16592C8.87598 8.83455 9.14461 8.56592 9.47598 8.56592H11.476C11.8073 8.56592 12.076 8.83455 12.076 9.16592C12.076 9.49729 11.8073 9.76592 11.476 9.76592H9.47598C9.14461 9.76592 8.87598 9.49729 8.87598 9.16592Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.80898 8.56592C4.47761 8.56592 4.20898 8.83455 4.20898 9.16592C4.20898 9.49729 4.47761 9.76592 4.80898 9.76592H6.80898C7.14036 9.76592 7.40898 9.49729 7.40898 9.16592C7.40898 8.83455 7.14036 8.56592 6.80898 8.56592H4.80898Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M6.00615 1.69985C6.00615 1.36848 5.73752 1.09985 5.40615 1.09985C5.07478 1.09985 4.80615 1.36848 4.80615 1.69985V2.34009H3.64248C2.20654 2.34009 1.04248 3.50415 1.04248 4.94009V12.3C1.04248 13.7359 2.20654 14.9 3.64248 14.9H12.6425C14.0784 14.9 15.2425 13.7359 15.2425 12.3V4.94009C15.2425 3.50415 14.0784 2.34009 12.6425 2.34009H11.4798V1.69985C11.4798 1.36848 11.2112 1.09985 10.8798 1.09985C10.5484 1.09985 10.2798 1.36848 10.2798 1.69985V2.34009H6.00615V1.69985ZM14.0425 5.97021V4.94009C14.0425 4.16689 13.4157 3.54009 12.6425 3.54009H11.4798V4.09985C11.4798 4.43122 11.2112 4.69985 10.8798 4.69985C10.5484 4.69985 10.2798 4.43122 10.2798 4.09985V3.54009H6.00615V4.09985C6.00615 4.43122 5.73752 4.69985 5.40615 4.69985C5.07478 4.69985 4.80615 4.43122 4.80615 4.09985V3.54009H3.64248C2.86928 3.54009 2.24248 4.16689 2.24248 4.94009V5.97021H14.0425ZM2.24248 7.17021H14.0425V12.3C14.0425 13.0731 13.4157 13.7 12.6425 13.7H3.64248C2.86928 13.7 2.24248 13.0732 2.24248 12.3V7.17021Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, _s = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "calendar-icon",
    ref: n,
    icon: qp
  }));
});
_s.displayName = "CalendarIcon";
const Up = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M14.1544 3.75557C14.3887 3.98988 14.3887 4.36978 14.1544 4.6041L6.51409 12.2444C6.40157 12.3569 6.24896 12.4201 6.08983 12.4201C5.9307 12.4201 5.77808 12.3569 5.66556 12.2444L1.84541 8.42425C1.6111 8.18993 1.6111 7.81003 1.84541 7.57572C2.07973 7.34141 2.45963 7.34141 2.69394 7.57572L6.08983 10.9716L13.3059 3.75557C13.5402 3.52126 13.9201 3.52126 14.1544 3.75557Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Hr = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "check-mark-icon",
    ref: n,
    icon: Up
  }));
});
Hr.displayName = "CheckMarkIcon";
const Gp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.24483 4.80026C8.24487 4.46889 7.97627 4.20023 7.6449 4.2002C7.31353 4.20016 7.04487 4.46876 7.04483 4.80013L7.04443 8.40306C7.04442 8.56222 7.10763 8.71486 7.22017 8.82739L9.64664 11.2539C9.88095 11.4882 10.2608 11.4882 10.4952 11.2539C10.7295 11.0195 10.7295 10.6396 10.4952 10.4053L8.24446 8.15463L8.24483 4.80026Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.14248 0.899902C4.22126 0.899902 1.04248 4.07868 1.04248 7.9999C1.04248 11.9211 4.22126 15.0999 8.14248 15.0999C12.0637 15.0999 15.2425 11.9211 15.2425 7.9999C15.2425 4.07868 12.0637 0.899902 8.14248 0.899902ZM2.24248 7.9999C2.24248 4.74142 4.884 2.0999 8.14248 2.0999C11.401 2.0999 14.0425 4.74142 14.0425 7.9999C14.0425 11.2584 11.401 13.8999 8.14248 13.8999C4.884 13.8999 2.24248 11.2584 2.24248 7.9999Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Dc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "clock-icon",
    ref: n,
    icon: Gp
  }));
});
Dc.displayName = "ClockIcon";
const Kp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M3.71274 2.86421C3.47843 2.6299 3.09853 2.6299 2.86421 2.86421C2.6299 3.09853 2.6299 3.47843 2.86421 3.71274L7.15154 8.00007L2.86421 12.2874C2.6299 12.5217 2.6299 12.9016 2.86421 13.1359C3.09853 13.3702 3.47843 13.3702 3.71274 13.1359L8.00007 8.84859L12.2874 13.1359C12.5217 13.3702 12.9016 13.3702 13.1359 13.1359C13.3702 12.9016 13.3702 12.5217 13.1359 12.2874L8.84859 8.00007L13.1359 3.71274C13.3702 3.47843 13.3702 3.09853 13.1359 2.86421C12.9016 2.6299 12.5217 2.6299 12.2874 2.86421L8.00007 7.15154L3.71274 2.86421Z"
    }
  }]
}, ji = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "close-icon",
    ref: n,
    icon: Kp
  }));
});
ji.displayName = "CloseIcon";
const Yp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 20 20",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M10.5547 14.1884C10.2599 14.5214 9.74019 14.5214 9.4454 14.1884L3.71321 7.71335C3.29002 7.23532 3.6294 6.48161 4.26784 6.48161L15.7322 6.48161C16.3707 6.48161 16.7101 7.23532 16.2869 7.71335L10.5547 14.1884Z"
    }
  }]
}, _c = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "down-icon",
    ref: n,
    icon: Yp
  }));
});
_c.displayName = "DownIcon";
const Xp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.85869 12.9216C8.38445 13.4708 7.61555 13.4708 7.14131 12.9216L0.358114 5.06726C-0.406895 4.18144 0.134916 2.66683 1.2168 2.66683L14.7832 2.66683C15.8651 2.66683 16.4069 4.18144 15.6419 5.06726L8.85869 12.9216Z"
    }
  }]
}, Oc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "dropdown-icon",
    ref: n,
    icon: Xp
  }));
});
Oc.displayName = "DropdownIcon";
const Zp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM10.3097 5.69014C10.544 5.92445 10.544 6.30435 10.3097 6.53867L8.84843 7.9999L10.3099 9.46137C10.5442 9.69569 10.5442 10.0756 10.3099 10.3099C10.0756 10.5442 9.69569 10.5442 9.46137 10.3099L7.9999 8.84843L6.53842 10.3099C6.30411 10.5442 5.92421 10.5442 5.6899 10.3099C5.45558 10.0756 5.45558 9.69569 5.6899 9.46137L7.15137 7.9999L5.69014 6.53867C5.45583 6.30435 5.45583 5.92445 5.69014 5.69014C5.92445 5.45583 6.30435 5.45583 6.53867 5.69014L7.9999 7.15137L9.46113 5.69014C9.69544 5.45583 10.0753 5.45583 10.3097 5.69014Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, kc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "error-icon",
    ref: n,
    icon: Zp
  }));
});
kc.displayName = "ErrorIcon";
const Qp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.00016 1.33203C6.68162 1.33203 5.39269 1.72302 4.29636 2.45557C3.20004 3.18811 2.34555 4.2293 1.84097 5.44747C1.33638 6.66565 1.20436 8.00609 1.4616 9.2993C1.71883 10.5925 2.35377 11.7804 3.28612 12.7127C4.21847 13.6451 5.40636 14.28 6.69956 14.5373C7.99277 14.7945 9.33321 14.6625 10.5514 14.1579C11.7696 13.6533 12.8108 12.7988 13.5433 11.7025C14.2758 10.6062 14.6668 9.31724 14.6668 7.9987C14.6649 6.23118 13.9619 4.53662 12.7121 3.2868C11.4622 2.03697 9.76768 1.33397 8.00016 1.33203ZM7.66683 3.9987C7.86461 3.9987 8.05795 4.05735 8.2224 4.16723C8.38685 4.27711 8.51502 4.43329 8.59071 4.61601C8.6664 4.79874 8.6862 4.99981 8.64762 5.19379C8.60903 5.38777 8.51379 5.56595 8.37394 5.7058C8.23409 5.84566 8.0559 5.9409 7.86192 5.97948C7.66794 6.01807 7.46687 5.99826 7.28415 5.92258C7.10142 5.84689 6.94524 5.71872 6.83536 5.55427C6.72548 5.38982 6.66683 5.19648 6.66683 4.9987C6.66683 4.73348 6.77219 4.47913 6.95972 4.29159C7.14726 4.10405 7.40162 3.9987 7.66683 3.9987ZM9.3335 11.332H6.66683C6.49002 11.332 6.32045 11.2618 6.19543 11.1368C6.0704 11.0117 6.00016 10.8422 6.00016 10.6654C6.00016 10.4886 6.0704 10.319 6.19543 10.194C6.32045 10.0689 6.49002 9.9987 6.66683 9.9987H7.3335V7.9987H6.66683C6.49002 7.9987 6.32045 7.92846 6.19543 7.80343C6.0704 7.67841 6.00016 7.50884 6.00016 7.33203C6.00016 7.15522 6.0704 6.98565 6.19543 6.86063C6.32045 6.7356 6.49002 6.66536 6.66683 6.66536H8.00016C8.17698 6.66536 8.34655 6.7356 8.47157 6.86063C8.59659 6.98565 8.66683 7.15522 8.66683 7.33203V9.9987H9.3335C9.51031 9.9987 9.67988 10.0689 9.8049 10.194C9.92993 10.319 10.0002 10.4886 10.0002 10.6654C10.0002 10.8422 9.92993 11.0117 9.8049 11.1368C9.67988 11.2618 9.51031 11.332 9.3335 11.332Z"
    }
  }]
}, Tc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "info-icon",
    ref: n,
    icon: Qp
  }));
});
Tc.displayName = "InfoIcon";
const Jp = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M11.3536 6.14645C11.5488 6.34171 11.5488 6.65829 11.3536 6.85355L8.35355 9.85355C8.15829 10.0488 7.84171 10.0488 7.64645 9.85355L4.64645 6.85355C4.45118 6.65829 4.45118 6.34171 4.64645 6.14645C4.84171 5.95118 5.15829 5.95118 5.35355 6.14645L8 8.79289L10.6464 6.14645C10.8417 5.95118 11.1583 5.95118 11.3536 6.14645Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Os = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "more-down-icon",
    ref: n,
    icon: Jp
  }));
});
Os.displayName = "MoreDownIcon";
const eh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M10.3536 12.3536C10.1583 12.5488 9.84171 12.5488 9.64645 12.3536L6.64645 9.35355C6.45118 9.15829 6.45118 8.84171 6.64645 8.64645L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L7.70711 9L10.3536 11.6464C10.5488 11.8417 10.5488 12.1583 10.3536 12.3536Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Ic = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "more-left-icon",
    ref: n,
    icon: eh
  }));
});
Ic.displayName = "MoreLeftIcon";
const th = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M6.14645 4.64645C6.34171 4.45118 6.65829 4.45118 6.85355 4.64645L9.85355 7.64645C10.0488 7.84171 10.0488 8.15829 9.85355 8.35355L6.85355 11.3536C6.65829 11.5488 6.34171 11.5488 6.14645 11.3536C5.95118 11.1583 5.95118 10.8417 6.14645 10.6464L8.79289 8L6.14645 5.35355C5.95118 5.15829 5.95118 4.84171 6.14645 4.64645Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, wo = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "more-right-icon",
    ref: n,
    icon: th
  }));
});
wo.displayName = "MoreRightIcon";
const nh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M4.64645 9.85355C4.45118 9.65829 4.45118 9.34171 4.64645 9.14645L7.64645 6.14645C7.84171 5.95118 8.15829 5.95118 8.35355 6.14645L11.3536 9.14645C11.5488 9.34171 11.5488 9.65829 11.3536 9.85355C11.1583 10.0488 10.8417 10.0488 10.6464 9.85355L8 7.20711L5.35355 9.85355C5.15829 10.0488 4.84171 10.0488 4.64645 9.85355Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Ac = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "more-up-icon",
    ref: n,
    icon: nh
  }));
});
Ac.displayName = "MoreUpIcon";
const rh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M5.65252 5.41446C5.86681 5.53124 6.00016 5.75579 6.00016 5.99984V9.99984C6.00016 10.368 5.70168 10.6665 5.3335 10.6665C4.96531 10.6665 4.66683 10.368 4.66683 9.99984V7.22312L4.36151 7.42005C4.05209 7.61961 3.63948 7.53056 3.43992 7.22115C3.24035 6.91173 3.3294 6.49912 3.63882 6.29956L4.97215 5.43959C5.17724 5.30731 5.43822 5.29767 5.65252 5.41446Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M12.3335 5.99984C12.3335 5.75579 12.2001 5.53124 11.9858 5.41446C11.7716 5.29767 11.5106 5.30731 11.3055 5.43959L9.97215 6.29956C9.66274 6.49912 9.57368 6.91173 9.77325 7.22115C9.97281 7.53056 10.3854 7.61961 10.6948 7.42005L11.0002 7.22312V9.99984C11.0002 10.368 11.2986 10.6665 11.6668 10.6665C12.035 10.6665 12.3335 10.368 12.3335 9.99984V5.99984Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.00008 5.99984C8.36827 5.99984 8.66675 6.29831 8.66675 6.6665V6.99984C8.66675 7.36803 8.36827 7.6665 8.00008 7.6665C7.63189 7.6665 7.33341 7.36803 7.33341 6.99984V6.6665C7.33341 6.29831 7.63189 5.99984 8.00008 5.99984Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.66675 8.99984C8.66675 8.63165 8.36827 8.33317 8.00008 8.33317C7.63189 8.33317 7.33341 8.63165 7.33341 8.99984V9.33317C7.33341 9.70136 7.63189 9.99984 8.00008 9.99984C8.36827 9.99984 8.66675 9.70136 8.66675 9.33317V8.99984Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M0.666748 2.99984C0.666748 2.26346 1.2637 1.6665 2.00008 1.6665H14.0001C14.7365 1.6665 15.3334 2.26346 15.3334 2.99984V12.9998C15.3334 13.7362 14.7365 14.3332 14.0001 14.3332H2.00008C1.26371 14.3332 0.666748 13.7362 0.666748 12.9998V2.99984ZM14.0001 2.99984H2.00008V12.9998H14.0001V2.99984Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, Lc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "one-to-one-icon",
    ref: n,
    icon: rh
  }));
});
Lc.displayName = "OneToOneIcon";
const oh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11.7245 6.42417C11.9588 6.18985 11.9588 5.80995 11.7245 5.57564C11.4901 5.34132 11.1102 5.34132 10.8759 5.57564L7.3002 9.15137L5.72446 7.57564C5.49014 7.34132 5.11025 7.34132 4.87593 7.57564C4.64162 7.80995 4.64162 8.18985 4.87593 8.42417L6.87593 10.4242C7.11025 10.6585 7.49014 10.6585 7.72446 10.4242L11.7245 6.42417Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, $c = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "success-icon",
    ref: n,
    icon: oh
  }));
});
$c.displayName = "SuccessIcon";
const ih = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM8.00008 12.3671C8.46031 12.3671 8.83342 11.994 8.83342 11.5338C8.83342 11.0735 8.46031 10.7004 8.00008 10.7004C7.53985 10.7004 7.16675 11.0735 7.16675 11.5338C7.16675 11.994 7.53985 12.3671 8.00008 12.3671ZM8.5999 4.4335C8.5999 4.10213 8.33127 3.8335 7.9999 3.8335C7.66853 3.8335 7.3999 4.10213 7.3999 4.4335V9.36683C7.3999 9.6982 7.66853 9.96683 7.9999 9.96683C8.33127 9.96683 8.5999 9.6982 8.5999 9.36683V4.4335Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, zc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "warning-icon",
    ref: n,
    icon: ih
  }));
});
zc.displayName = "WarningIcon";
const ah = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.04883 5.38216C8.04883 5.01397 7.75035 4.71549 7.38216 4.71549C7.01397 4.71549 6.71549 5.01397 6.71549 5.38216V6.71897L5.3865 6.7207C5.01831 6.72117 4.72022 7.02004 4.7207 7.38823C4.72118 7.75642 5.02005 8.05451 5.38824 8.05403L6.71549 8.0523V9.38216C6.71549 9.75035 7.01397 10.0488 7.38216 10.0488C7.75035 10.0488 8.04883 9.75035 8.04883 9.38216V8.05056L9.38304 8.04883C9.75123 8.04835 10.0493 7.74948 10.0488 7.38129C10.0484 7.0131 9.74949 6.71502 9.3813 6.7155L8.04883 6.71723V5.38216Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M7.38216 1.04883C3.88437 1.04883 1.04883 3.88437 1.04883 7.38216C1.04883 10.88 3.88437 13.7155 7.38216 13.7155C8.89089 13.7155 10.2764 13.1879 11.3643 12.3072L13.813 14.7559C14.0733 15.0162 14.4954 15.0162 14.7558 14.7559C15.0161 14.4955 15.0161 14.0734 14.7558 13.8131L12.3071 11.3644C13.1879 10.2765 13.7155 8.89095 13.7155 7.38216C13.7155 3.88437 10.88 1.04883 7.38216 1.04883ZM2.38216 7.38216C2.38216 4.62075 4.62075 2.38216 7.38216 2.38216C10.1436 2.38216 12.3822 4.62075 12.3822 7.38216C12.3822 10.1436 10.1436 12.3822 7.38216 12.3822C4.62075 12.3822 2.38216 10.1436 2.38216 7.38216Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Fc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "zoom-in-icon",
    ref: n,
    icon: ah
  }));
});
Fc.displayName = "ZoomInIcon";
const sh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M4.71549 7.38216C4.71549 7.01397 5.01397 6.71549 5.38216 6.71549H9.38216C9.75035 6.71549 10.0488 7.01397 10.0488 7.38216C10.0488 7.75035 9.75035 8.04883 9.38216 8.04883H5.38216C5.01397 8.04883 4.71549 7.75035 4.71549 7.38216Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M1.04883 7.38216C1.04883 3.88437 3.88437 1.04883 7.38216 1.04883C10.88 1.04883 13.7155 3.88437 13.7155 7.38216C13.7155 8.89095 13.1879 10.2765 12.3071 11.3644L14.7558 13.8131C15.0161 14.0734 15.0161 14.4955 14.7558 14.7559C14.4954 15.0162 14.0733 15.0162 13.813 14.7559L11.3643 12.3072C10.2764 13.1879 8.89089 13.7155 7.38216 13.7155C3.88437 13.7155 1.04883 10.88 1.04883 7.38216ZM7.38216 2.38216C4.62075 2.38216 2.38216 4.62075 2.38216 7.38216C2.38216 10.1436 4.62075 12.3822 7.38216 12.3822C10.1436 12.3822 12.3822 10.1436 12.3822 7.38216C12.3822 4.62075 10.1436 2.38216 7.38216 2.38216Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Hc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "zoom-out-icon",
    ref: n,
    icon: sh
  }));
});
Hc.displayName = "ZoomOutIcon";
const uh = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "#0B9EFB",
      d: "M8.79993 14.0166C8.79993 14.4585 8.44176 14.8166 7.99993 14.8166C4.23529 14.8166 1.18345 11.7648 1.18345 8.00017C1.18345 4.23554 4.23529 1.18369 7.99993 1.1837C11.7646 1.1837 14.8164 4.23554 14.8164 8.00017C14.8164 8.442 14.4582 8.80017 14.0164 8.80017C13.5746 8.80017 13.2164 8.442 13.2164 8.00017C13.2164 5.11919 10.8809 2.7837 7.99993 2.7837C5.11895 2.7837 2.78345 5.11919 2.78345 8.00017C2.78345 10.8812 5.11895 13.2166 7.99993 13.2166C8.44176 13.2166 8.79993 13.5748 8.79993 14.0166Z",
      fillOpacity: 0.2,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "#0B9EFB",
      d: "M7.20007 1.98384C7.20007 1.54201 7.55824 1.18384 8.00007 1.18384C11.7647 1.18384 14.8165 4.23568 14.8165 8.00032C14.8165 11.765 11.7647 14.8168 8.00007 14.8168C4.23543 14.8168 1.18359 11.765 1.18359 8.00032C1.18359 7.55849 1.54177 7.20031 1.98359 7.20031C2.42542 7.20031 2.78359 7.55849 2.78359 8.00032C2.78359 10.8813 5.11909 13.2168 8.00007 13.2168C10.8811 13.2168 13.2165 10.8813 13.2165 8.00032C13.2165 5.11933 10.8811 2.78384 8.00007 2.78384C7.55824 2.78384 7.20007 2.42567 7.20007 1.98384Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Wc = Ue(function(t, n) {
  return xt(Ct, Object.assign({}, t, {
    id: "loading-multi-icon",
    ref: n,
    icon: uh
  }));
});
Wc.displayName = "LoadingMultiIcon";
function Bc(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Bc(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function jc() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Bc(e)) && (r && (r += " "), r += t);
  return r;
}
const ks = "-", lh = (e) => {
  const t = dh(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (a) => {
      const s = a.split(ks);
      return s[0] === "" && s.length !== 1 && s.shift(), Vc(s, t) || ch(a);
    },
    getConflictingClassGroupIds: (a, s) => {
      const l = n[a] || [];
      return s && r[a] ? [...l, ...r[a]] : l;
    }
  };
}, Vc = (e, t) => {
  var a;
  if (e.length === 0)
    return t.classGroupId;
  const n = e[0], r = t.nextPart.get(n), o = r ? Vc(e.slice(1), r) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const i = e.join(ks);
  return (a = t.validators.find(({
    validator: s
  }) => s(i))) == null ? void 0 : a.classGroupId;
}, Pu = /^\[(.+)\]$/, ch = (e) => {
  if (Pu.test(e)) {
    const t = Pu.exec(e)[1], n = t == null ? void 0 : t.substring(0, t.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}, dh = (e) => {
  const {
    theme: t,
    prefix: n
  } = e, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return vh(Object.entries(e.classGroups), n).forEach(([i, a]) => {
    Xa(a, r, i, t);
  }), r;
}, Xa = (e, t, n, r) => {
  e.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? t : Nu(t, o);
      i.classGroupId = n;
      return;
    }
    if (typeof o == "function") {
      if (fh(o)) {
        Xa(o(r), t, n, r);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: n
      });
      return;
    }
    Object.entries(o).forEach(([i, a]) => {
      Xa(a, Nu(t, i), n, r);
    });
  });
}, Nu = (e, t) => {
  let n = e;
  return t.split(ks).forEach((r) => {
    n.nextPart.has(r) || n.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(r);
  }), n;
}, fh = (e) => e.isThemeGetter, vh = (e, t) => t ? e.map(([n, r]) => {
  const o = r.map((i) => typeof i == "string" ? t + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([a, s]) => [t + a, s])) : i);
  return [n, o];
}) : e, ph = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  const o = (i, a) => {
    n.set(i, a), t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let a = n.get(i);
      if (a !== void 0)
        return a;
      if ((a = r.get(i)) !== void 0)
        return o(i, a), a;
    },
    set(i, a) {
      n.has(i) ? n.set(i, a) : o(i, a);
    }
  };
}, qc = "!", hh = (e) => {
  const {
    separator: t,
    experimentalParseClassName: n
  } = e, r = t.length === 1, o = t[0], i = t.length, a = (s) => {
    const l = [];
    let c = 0, f = 0, u;
    for (let d = 0; d < s.length; d++) {
      let v = s[d];
      if (c === 0) {
        if (v === o && (r || s.slice(d, d + i) === t)) {
          l.push(s.slice(f, d)), f = d + i;
          continue;
        }
        if (v === "/") {
          u = d;
          continue;
        }
      }
      v === "[" ? c++ : v === "]" && c--;
    }
    const y = l.length === 0 ? s : s.substring(f), m = y.startsWith(qc), g = m ? y.substring(1) : y, w = u && u > f ? u - f : void 0;
    return {
      modifiers: l,
      hasImportantModifier: m,
      baseClassName: g,
      maybePostfixModifierPosition: w
    };
  };
  return n ? (s) => n({
    className: s,
    parseClassName: a
  }) : a;
}, mh = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let n = [];
  return e.forEach((r) => {
    r[0] === "[" ? (t.push(...n.sort(), r), n = []) : n.push(r);
  }), t.push(...n.sort()), t;
}, gh = (e) => ({
  cache: ph(e.cacheSize),
  parseClassName: hh(e),
  ...lh(e)
}), yh = /\s+/, bh = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o
  } = t, i = [], a = e.trim().split(yh);
  let s = "";
  for (let l = a.length - 1; l >= 0; l -= 1) {
    const c = a[l], {
      modifiers: f,
      hasImportantModifier: u,
      baseClassName: y,
      maybePostfixModifierPosition: m
    } = n(c);
    let g = !!m, w = r(g ? y.substring(0, m) : y);
    if (!w) {
      if (!g) {
        s = c + (s.length > 0 ? " " + s : s);
        continue;
      }
      if (w = r(y), !w) {
        s = c + (s.length > 0 ? " " + s : s);
        continue;
      }
      g = !1;
    }
    const d = mh(f).join(":"), v = u ? d + qc : d, p = v + w;
    if (i.includes(p))
      continue;
    i.push(p);
    const b = o(w, g);
    for (let C = 0; C < b.length; ++C) {
      const x = b[C];
      i.push(v + x);
    }
    s = c + (s.length > 0 ? " " + s : s);
  }
  return s;
};
function wh() {
  let e = 0, t, n, r = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (n = Uc(t)) && (r && (r += " "), r += n);
  return r;
}
const Uc = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Uc(e[r])) && (n && (n += " "), n += t);
  return n;
};
function xh(e, ...t) {
  let n, r, o, i = a;
  function a(l) {
    const c = t.reduce((f, u) => u(f), e());
    return n = gh(c), r = n.cache.get, o = n.cache.set, i = s, s(l);
  }
  function s(l) {
    const c = r(l);
    if (c)
      return c;
    const f = bh(l, n);
    return o(l, f), f;
  }
  return function() {
    return i(wh.apply(null, arguments));
  };
}
const tt = (e) => {
  const t = (n) => n[e] || [];
  return t.isThemeGetter = !0, t;
}, Gc = /^\[(?:([a-z-]+):)?(.+)\]$/i, Ch = /^\d+\/\d+$/, Sh = /* @__PURE__ */ new Set(["px", "full", "screen"]), Eh = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Rh = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Mh = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, Ph = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Nh = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Rn = (e) => Tr(e) || Sh.has(e) || Ch.test(e), Bn = (e) => Wr(e, "length", Lh), Tr = (e) => !!e && !Number.isNaN(Number(e)), Ca = (e) => Wr(e, "number", Tr), Jr = (e) => !!e && Number.isInteger(Number(e)), Dh = (e) => e.endsWith("%") && Tr(e.slice(0, -1)), Ne = (e) => Gc.test(e), jn = (e) => Eh.test(e), _h = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Oh = (e) => Wr(e, _h, Kc), kh = (e) => Wr(e, "position", Kc), Th = /* @__PURE__ */ new Set(["image", "url"]), Ih = (e) => Wr(e, Th, zh), Ah = (e) => Wr(e, "", $h), eo = () => !0, Wr = (e, t, n) => {
  const r = Gc.exec(e);
  return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}, Lh = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Rh.test(e) && !Mh.test(e)
), Kc = () => !1, $h = (e) => Ph.test(e), zh = (e) => Nh.test(e), Fh = () => {
  const e = tt("colors"), t = tt("spacing"), n = tt("blur"), r = tt("brightness"), o = tt("borderColor"), i = tt("borderRadius"), a = tt("borderSpacing"), s = tt("borderWidth"), l = tt("contrast"), c = tt("grayscale"), f = tt("hueRotate"), u = tt("invert"), y = tt("gap"), m = tt("gradientColorStops"), g = tt("gradientColorStopPositions"), w = tt("inset"), d = tt("margin"), v = tt("opacity"), p = tt("padding"), b = tt("saturate"), C = tt("scale"), x = tt("sepia"), S = tt("skew"), E = tt("space"), M = tt("translate"), _ = () => ["auto", "contain", "none"], P = () => ["auto", "hidden", "clip", "visible", "scroll"], k = () => ["auto", Ne, t], I = () => [Ne, t], H = () => ["", Rn, Bn], A = () => ["auto", Tr, Ne], L = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], N = () => ["solid", "dashed", "dotted", "double", "none"], $ = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], T = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], z = () => ["", "0", Ne], B = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], W = () => [Tr, Ne];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [eo],
      spacing: [Rn, Bn],
      blur: ["none", "", jn, Ne],
      brightness: W(),
      borderColor: [e],
      borderRadius: ["none", "", "full", jn, Ne],
      borderSpacing: I(),
      borderWidth: H(),
      contrast: W(),
      grayscale: z(),
      hueRotate: W(),
      invert: z(),
      gap: I(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Dh, Bn],
      inset: k(),
      margin: k(),
      opacity: W(),
      padding: I(),
      saturate: W(),
      scale: W(),
      sepia: z(),
      skew: W(),
      space: I(),
      translate: I()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", Ne]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [jn]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": B()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": B()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...L(), Ne]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: P()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": P()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": P()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: _()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": _()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": _()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [w]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [w]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [w]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [w]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [w]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [w]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [w]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [w]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [w]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", Jr, Ne]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: k()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", Ne]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: z()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: z()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Jr, Ne]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [eo]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Jr, Ne]
        }, Ne]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": A()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": A()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [eo]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Jr, Ne]
        }, Ne]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": A()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": A()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", Ne]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", Ne]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [y]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [y]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [y]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...T()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...T(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...T(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [p]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [p]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [p]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [p]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [p]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [p]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [p]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [p]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [p]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [d]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [d]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [d]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [d]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [d]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [d]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [d]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [d]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [d]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [E]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [E]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", Ne, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [Ne, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [Ne, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [jn]
        }, jn]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [Ne, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [Ne, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [Ne, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [Ne, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", jn, Bn]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Ca]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [eo]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", Ne]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Tr, Ca]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Rn, Ne]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", Ne]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", Ne]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [v]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [v]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...N(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Rn, Bn]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Rn, Ne]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: I()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Ne]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", Ne]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [v]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...L(), kh]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", Oh]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Ih]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [g]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [g]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [g]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [m]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [m]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [m]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [i]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [i]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [i]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [i]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [i]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [i]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [i]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [i]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [i]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [i]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [i]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [i]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [i]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [i]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [i]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [s]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [s]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [s]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [s]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [s]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [s]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [s]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [s]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [s]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [v]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...N(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [s]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [s]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [v]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: N()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [o]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...N()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Rn, Ne]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Rn, Bn]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: H()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [v]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Rn, Bn]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", jn, Ah]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [eo]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...$(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": $()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [n]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [r]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [l]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", jn, Ne]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [f]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [u]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [b]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [x]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [n]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [r]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [l]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [f]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [u]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [b]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [x]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [a]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [a]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [a]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", Ne]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: W()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", Ne]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: W()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", Ne]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [C]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [C]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [C]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Jr, Ne]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [M]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [M]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [S]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [S]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", Ne]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Ne]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": I()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": I()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": I()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": I()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": I()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": I()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": I()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": I()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": I()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": I()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": I()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": I()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": I()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": I()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": I()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": I()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": I()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": I()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", Ne]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Rn, Bn, Ca]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, Hh = /* @__PURE__ */ xh(Fh);
function ie(...e) {
  return Hh(jc(e));
}
function aE(e) {
  const { className: t, items: n } = e, [r, o] = De(null), i = (a) => {
    o(r === a ? null : a);
  };
  return /* @__PURE__ */ R(
    "div",
    {
      "data-u-comp": "accordion",
      className: ie("univer-divide-x-0 univer-divide-y univer-divide-solid univer-divide-gray-200 dark:!univer-divide-gray-600", t),
      children: n.map((a, s) => /* @__PURE__ */ me("div", { children: [
        /* @__PURE__ */ me(
          "button",
          {
            className: "univer-box-border univer-flex univer-w-full univer-cursor-pointer univer-items-center univer-gap-1.5 univer-border-none univer-bg-transparent univer-p-4 univer-text-left univer-text-gray-700 hover:univer-text-gray-900 focus:univer-outline-none dark:!univer-text-gray-200 dark:hover:!univer-text-white",
            type: "button",
            onClick: () => i(s),
            children: [
              /* @__PURE__ */ R(
                _c,
                {
                  className: ie("univer-size-2.5 univer-flex-shrink-0 univer-transition-transform", {
                    "-univer-rotate-90": r !== s,
                    "univer-rotate-0": r === s
                  })
                }
              ),
              /* @__PURE__ */ R("span", { className: "univer-font-medium", children: a.label })
            ]
          }
        ),
        /* @__PURE__ */ R(
          "div",
          {
            className: ie("univer-overflow-hidden univer-transition-[max-height,opacity] univer-duration-500 univer-ease-in-out", {
              "univer-max-h-screen": r === s,
              "univer-max-h-0": r !== s
            }),
            children: /* @__PURE__ */ R("div", { className: "univer-box-border univer-px-4 univer-py-1.5", children: a.children })
          }
        )
      ] }, s))
    }
  );
}
const Du = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, _u = jc, Ts = (e, t) => (n) => {
  var r;
  if ((t == null ? void 0 : t.variants) == null) return _u(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: o, defaultVariants: i } = t, a = Object.keys(o).map((c) => {
    const f = n == null ? void 0 : n[c], u = i == null ? void 0 : i[c];
    if (f === null) return null;
    const y = Du(f) || Du(u);
    return o[c][y];
  }), s = n && Object.entries(n).reduce((c, f) => {
    let [u, y] = f;
    return y === void 0 || (c[u] = y), c;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, f) => {
    let { class: u, className: y, ...m } = f;
    return Object.entries(m).every((g) => {
      let [w, d] = g;
      return Array.isArray(d) ? d.includes({
        ...i,
        ...s
      }[w]) : {
        ...i,
        ...s
      }[w] === d;
    }) ? [
      ...c,
      u,
      y
    ] : c;
  }, []);
  return _u(e, a, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
}, Wh = Ts(
  `
      univer-relative univer-inline-block univer-overflow-hidden univer-whitespace-nowrap univer-bg-gray-200
      univer-text-center univer-align-middle univer-text-white
    `,
  {
    variants: {
      /**
       * The shape of the avatar
       * @default 'circle'
       */
      shape: {
        circle: "univer-rounded-full",
        square: "univer-rounded"
      },
      size: {
        middle: "univer-size-9 univer-leading-9",
        small: "univer-size-7 univer-leading-7"
      }
    },
    defaultVariants: {
      shape: "circle",
      size: "middle"
    }
  }
);
function sE(e) {
  const {
    children: t,
    className: n,
    style: r,
    title: o,
    alt: i,
    shape: a = "circle",
    size: s = "middle",
    src: l,
    fit: c = "fill",
    onError: f,
    onLoad: u
  } = e, y = typeof s == "number" ? {
    width: `${s}px`,
    height: `${s}px`,
    lineHeight: `${s}px`
  } : {}, m = { objectFit: c };
  return /* @__PURE__ */ me(
    "span",
    {
      className: ie(Wh({
        shape: a,
        size: typeof s == "number" ? "middle" : s
      }), {
        "univer-bg-transparent": l
      }, n),
      style: {
        ...y,
        ...r,
        ...l && m
      },
      children: [
        l && /* @__PURE__ */ R(
          "img",
          {
            className: "univer-block univer-size-full",
            src: l,
            title: o,
            alt: i,
            onError: f,
            onLoad: u
          }
        ),
        t
      ]
    }
  );
}
function Bh(e) {
  const { className: t, children: n, closable: r = !1, onClose: o } = e;
  return /* @__PURE__ */ me(
    "span",
    {
      "data-u-comp": "badge",
      className: ie(
        `
                  univer-box-border univer-inline-flex univer-items-center univer-gap-1 univer-truncate
                  univer-rounded-md univer-border univer-border-solid univer-border-gray-100 univer-bg-gray-100
                  univer-px-2.5 univer-py-0.5 univer-text-xs univer-font-medium univer-text-gray-900
                  dark:!univer-border-gray-500 dark:!univer-bg-gray-700 dark:!univer-text-gray-300
                `,
        t
      ),
      children: [
        /* @__PURE__ */ R("span", { className: "univer-flex-1 univer-truncate", children: n }),
        r && /* @__PURE__ */ R(
          "button",
          {
            className: "univer-flex univer-cursor-pointer univer-items-center univer-justify-center univer-border-none univer-p-0 univer-outline-none univer-transition-opacity hover:univer-opacity-70",
            type: "button",
            "aria-label": "Close badge",
            onClick: o,
            children: /* @__PURE__ */ R(ji, { className: "univer-text-current" })
          }
        )
      ]
    }
  );
}
function Ou(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Oo(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const i = Ou(o, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const i = r[o];
          typeof i == "function" ? i() : Ou(e[o], null);
        }
      };
  };
}
function gt(...e) {
  return h.useCallback(Oo(...e), e);
}
var jh = Symbol.for("react.lazy"), xi = h[" use ".trim().toString()];
function Vh(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function Yc(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === jh && "_payload" in e && Vh(e._payload);
}
// @__NO_SIDE_EFFECTS__
function Xc(e) {
  const t = /* @__PURE__ */ Uh(e), n = h.forwardRef((r, o) => {
    let { children: i, ...a } = r;
    Yc(i) && typeof xi == "function" && (i = xi(i._payload));
    const s = h.Children.toArray(i), l = s.find(Kh);
    if (l) {
      const c = l.props.children, f = s.map((u) => u === l ? h.Children.count(c) > 1 ? h.Children.only(null) : h.isValidElement(c) ? c.props.children : null : u);
      return /* @__PURE__ */ R(t, { ...a, ref: o, children: h.isValidElement(c) ? h.cloneElement(c, void 0, f) : null });
    }
    return /* @__PURE__ */ R(t, { ...a, ref: o, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
var qh = /* @__PURE__ */ Xc("Slot");
// @__NO_SIDE_EFFECTS__
function Uh(e) {
  const t = h.forwardRef((n, r) => {
    let { children: o, ...i } = n;
    if (Yc(o) && typeof xi == "function" && (o = xi(o._payload)), h.isValidElement(o)) {
      const a = Xh(o), s = Yh(i, o.props);
      return o.type !== h.Fragment && (s.ref = r ? Oo(r, a) : a), h.cloneElement(o, s);
    }
    return h.Children.count(o) > 1 ? h.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Gh = Symbol("radix.slottable");
function Kh(e) {
  return h.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Gh;
}
function Yh(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...s) => {
      const l = i(...s);
      return o(...s), l;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Xh(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
const Zh = Ts(
  `
      univer-box-border univer-inline-flex univer-cursor-pointer univer-select-none univer-items-center
      univer-justify-center univer-gap-2 univer-whitespace-nowrap univer-rounded-md univer-border univer-border-solid
      univer-text-sm univer-font-medium univer-transition-colors
      disabled:univer-pointer-events-none disabled:univer-cursor-not-allowed disabled:univer-opacity-50
      [&_svg]:univer-pointer-events-none [&_svg]:univer-size-4 [&_svg]:univer-shrink-0
    `,
  {
    variants: {
      variant: {
        default: `
                  univer-border-gray-200 univer-bg-white univer-text-gray-700
                  hover:univer-bg-gray-100
                  active:univer-bg-gray-200
                  dark:!univer-border-gray-600 dark:!univer-bg-gray-700 dark:!univer-text-white
                  dark:hover:!univer-bg-gray-600 dark:active:!univer-bg-gray-700
                `,
        primary: `
                  univer-border-primary-600 univer-bg-primary-600 univer-text-white
                  hover:univer-bg-primary-500
                  active:univer-bg-primary-700
                `,
        danger: `
                  univer-border-red-500 univer-bg-red-500 univer-text-white
                  hover:univer-border-red-400 hover:univer-bg-red-400
                  active:univer-border-red-600 active:univer-bg-red-600
                `,
        text: `
                  univer-border-transparent univer-bg-transparent univer-text-gray-900
                  hover:univer-bg-gray-100
                  active:univer-bg-gray-200
                  dark:!univer-text-white dark:hover:!univer-bg-gray-700 dark:active:!univer-bg-gray-600
                `,
        link: `
                  univer-underline-current univer-border-transparent univer-bg-transparent univer-text-primary-600
                  univer-underline-offset-4
                  hover:univer-text-primary-500 hover:univer-underline
                  active:univer-text-primary-700
                `,
        ghost: `
                  univer-border-transparent univer-bg-transparent univer-text-gray-900
                  hover:univer-bg-gray-100
                  active:univer-bg-gray-200
                  dark:!univer-text-white dark:hover:!univer-bg-gray-700 dark:active:!univer-bg-gray-600
                `
      },
      size: {
        small: "univer-h-6 univer-rounded-md univer-px-1.5 univer-text-xs",
        middle: "univer-h-8 univer-rounded-lg univer-px-2 univer-text-sm",
        large: "univer-h-10 univer-rounded-lg univer-px-3 univer-text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "middle"
    }
  }
), fr = Ue(
  ({ className: e, variant: t, size: n, asChild: r = !1, ...o }, i) => /* @__PURE__ */ R(
    r ? qh : "button",
    {
      className: ie(Zh({ variant: t, size: n, className: e })),
      ref: i,
      "data-u-comp": "button",
      ...o
    }
  )
);
fr.displayName = "Button";
const uE = ({
  className: e,
  orientation: t = "horizontal",
  children: n
}) => {
  const r = wi.count(n), o = t === "horizontal", i = t === "vertical";
  return /* @__PURE__ */ R(
    "div",
    {
      className: ie("univer-grid", {
        "univer-grid-flow-row": i,
        "univer-w-fit": i
      }, e),
      children: wi.map(n, (a, s) => {
        const l = s === 0, c = s === r - 1;
        return Ns(a, {
          className: ie(
            {
              "!univer-rounded-l-none": o && !l,
              "!univer-rounded-r-none": o && !c,
              "!univer-border-l-0": o && !l,
              "!univer-rounded-t-none": i && !l,
              "!univer-rounded-b-none": i && !c,
              "!univer-border-t-0": i && !l
            },
            a.props.className
          )
        });
      })
    }
  );
};
function Is() {
  return typeof window < "u" && typeof document < "u";
}
const Tn = Rc({
  mountContainer: Is() ? document.body : null
});
function lE(e) {
  const { children: t, locale: n, mountContainer: r } = e, o = lt(() => ({
    locale: n,
    mountContainer: r
  }), [n, r]);
  return /* @__PURE__ */ R(Tn.Provider, { value: o, children: t });
}
function As(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Zc(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var fi = { exports: {} }, Qh = fi.exports, ku;
function Jh() {
  return ku || (ku = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(Qh, (function() {
      var n = 1e3, r = 6e4, o = 36e5, i = "millisecond", a = "second", s = "minute", l = "hour", c = "day", f = "week", u = "month", y = "quarter", m = "year", g = "date", w = "Invalid Date", d = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, v = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, p = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(A) {
        var L = ["th", "st", "nd", "rd"], N = A % 100;
        return "[" + A + (L[(N - 20) % 10] || L[N] || L[0]) + "]";
      } }, b = function(A, L, N) {
        var $ = String(A);
        return !$ || $.length >= L ? A : "" + Array(L + 1 - $.length).join(N) + A;
      }, C = { s: b, z: function(A) {
        var L = -A.utcOffset(), N = Math.abs(L), $ = Math.floor(N / 60), T = N % 60;
        return (L <= 0 ? "+" : "-") + b($, 2, "0") + ":" + b(T, 2, "0");
      }, m: function A(L, N) {
        if (L.date() < N.date()) return -A(N, L);
        var $ = 12 * (N.year() - L.year()) + (N.month() - L.month()), T = L.clone().add($, u), z = N - T < 0, B = L.clone().add($ + (z ? -1 : 1), u);
        return +(-($ + (N - T) / (z ? T - B : B - T)) || 0);
      }, a: function(A) {
        return A < 0 ? Math.ceil(A) || 0 : Math.floor(A);
      }, p: function(A) {
        return { M: u, y: m, w: f, d: c, D: g, h: l, m: s, s: a, ms: i, Q: y }[A] || String(A || "").toLowerCase().replace(/s$/, "");
      }, u: function(A) {
        return A === void 0;
      } }, x = "en", S = {};
      S[x] = p;
      var E = "$isDayjsObject", M = function(A) {
        return A instanceof I || !(!A || !A[E]);
      }, _ = function A(L, N, $) {
        var T;
        if (!L) return x;
        if (typeof L == "string") {
          var z = L.toLowerCase();
          S[z] && (T = z), N && (S[z] = N, T = z);
          var B = L.split("-");
          if (!T && B.length > 1) return A(B[0]);
        } else {
          var W = L.name;
          S[W] = L, T = W;
        }
        return !$ && T && (x = T), T || !$ && x;
      }, P = function(A, L) {
        if (M(A)) return A.clone();
        var N = typeof L == "object" ? L : {};
        return N.date = A, N.args = arguments, new I(N);
      }, k = C;
      k.l = _, k.i = M, k.w = function(A, L) {
        return P(A, { locale: L.$L, utc: L.$u, x: L.$x, $offset: L.$offset });
      };
      var I = (function() {
        function A(N) {
          this.$L = _(N.locale, null, !0), this.parse(N), this.$x = this.$x || N.x || {}, this[E] = !0;
        }
        var L = A.prototype;
        return L.parse = function(N) {
          this.$d = (function($) {
            var T = $.date, z = $.utc;
            if (T === null) return /* @__PURE__ */ new Date(NaN);
            if (k.u(T)) return /* @__PURE__ */ new Date();
            if (T instanceof Date) return new Date(T);
            if (typeof T == "string" && !/Z$/i.test(T)) {
              var B = T.match(d);
              if (B) {
                var W = B[2] - 1 || 0, Y = (B[7] || "0").substring(0, 3);
                return z ? new Date(Date.UTC(B[1], W, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, Y)) : new Date(B[1], W, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, Y);
              }
            }
            return new Date(T);
          })(N), this.init();
        }, L.init = function() {
          var N = this.$d;
          this.$y = N.getFullYear(), this.$M = N.getMonth(), this.$D = N.getDate(), this.$W = N.getDay(), this.$H = N.getHours(), this.$m = N.getMinutes(), this.$s = N.getSeconds(), this.$ms = N.getMilliseconds();
        }, L.$utils = function() {
          return k;
        }, L.isValid = function() {
          return this.$d.toString() !== w;
        }, L.isSame = function(N, $) {
          var T = P(N);
          return this.startOf($) <= T && T <= this.endOf($);
        }, L.isAfter = function(N, $) {
          return P(N) < this.startOf($);
        }, L.isBefore = function(N, $) {
          return this.endOf($) < P(N);
        }, L.$g = function(N, $, T) {
          return k.u(N) ? this[$] : this.set(T, N);
        }, L.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, L.valueOf = function() {
          return this.$d.getTime();
        }, L.startOf = function(N, $) {
          var T = this, z = !!k.u($) || $, B = k.p(N), W = function(q, J) {
            var D = k.w(T.$u ? Date.UTC(T.$y, J, q) : new Date(T.$y, J, q), T);
            return z ? D : D.endOf(c);
          }, Y = function(q, J) {
            return k.w(T.toDate()[q].apply(T.toDate("s"), (z ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(J)), T);
          }, U = this.$W, V = this.$M, Z = this.$D, se = "set" + (this.$u ? "UTC" : "");
          switch (B) {
            case m:
              return z ? W(1, 0) : W(31, 11);
            case u:
              return z ? W(1, V) : W(0, V + 1);
            case f:
              var ge = this.$locale().weekStart || 0, j = (U < ge ? U + 7 : U) - ge;
              return W(z ? Z - j : Z + (6 - j), V);
            case c:
            case g:
              return Y(se + "Hours", 0);
            case l:
              return Y(se + "Minutes", 1);
            case s:
              return Y(se + "Seconds", 2);
            case a:
              return Y(se + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, L.endOf = function(N) {
          return this.startOf(N, !1);
        }, L.$set = function(N, $) {
          var T, z = k.p(N), B = "set" + (this.$u ? "UTC" : ""), W = (T = {}, T[c] = B + "Date", T[g] = B + "Date", T[u] = B + "Month", T[m] = B + "FullYear", T[l] = B + "Hours", T[s] = B + "Minutes", T[a] = B + "Seconds", T[i] = B + "Milliseconds", T)[z], Y = z === c ? this.$D + ($ - this.$W) : $;
          if (z === u || z === m) {
            var U = this.clone().set(g, 1);
            U.$d[W](Y), U.init(), this.$d = U.set(g, Math.min(this.$D, U.daysInMonth())).$d;
          } else W && this.$d[W](Y);
          return this.init(), this;
        }, L.set = function(N, $) {
          return this.clone().$set(N, $);
        }, L.get = function(N) {
          return this[k.p(N)]();
        }, L.add = function(N, $) {
          var T, z = this;
          N = Number(N);
          var B = k.p($), W = function(V) {
            var Z = P(z);
            return k.w(Z.date(Z.date() + Math.round(V * N)), z);
          };
          if (B === u) return this.set(u, this.$M + N);
          if (B === m) return this.set(m, this.$y + N);
          if (B === c) return W(1);
          if (B === f) return W(7);
          var Y = (T = {}, T[s] = r, T[l] = o, T[a] = n, T)[B] || 1, U = this.$d.getTime() + N * Y;
          return k.w(U, this);
        }, L.subtract = function(N, $) {
          return this.add(-1 * N, $);
        }, L.format = function(N) {
          var $ = this, T = this.$locale();
          if (!this.isValid()) return T.invalidDate || w;
          var z = N || "YYYY-MM-DDTHH:mm:ssZ", B = k.z(this), W = this.$H, Y = this.$m, U = this.$M, V = T.weekdays, Z = T.months, se = T.meridiem, ge = function(J, D, O, F) {
            return J && (J[D] || J($, z)) || O[D].slice(0, F);
          }, j = function(J) {
            return k.s(W % 12 || 12, J, "0");
          }, q = se || function(J, D, O) {
            var F = J < 12 ? "AM" : "PM";
            return O ? F.toLowerCase() : F;
          };
          return z.replace(v, (function(J, D) {
            return D || (function(O) {
              switch (O) {
                case "YY":
                  return String($.$y).slice(-2);
                case "YYYY":
                  return k.s($.$y, 4, "0");
                case "M":
                  return U + 1;
                case "MM":
                  return k.s(U + 1, 2, "0");
                case "MMM":
                  return ge(T.monthsShort, U, Z, 3);
                case "MMMM":
                  return ge(Z, U);
                case "D":
                  return $.$D;
                case "DD":
                  return k.s($.$D, 2, "0");
                case "d":
                  return String($.$W);
                case "dd":
                  return ge(T.weekdaysMin, $.$W, V, 2);
                case "ddd":
                  return ge(T.weekdaysShort, $.$W, V, 3);
                case "dddd":
                  return V[$.$W];
                case "H":
                  return String(W);
                case "HH":
                  return k.s(W, 2, "0");
                case "h":
                  return j(1);
                case "hh":
                  return j(2);
                case "a":
                  return q(W, Y, !0);
                case "A":
                  return q(W, Y, !1);
                case "m":
                  return String(Y);
                case "mm":
                  return k.s(Y, 2, "0");
                case "s":
                  return String($.$s);
                case "ss":
                  return k.s($.$s, 2, "0");
                case "SSS":
                  return k.s($.$ms, 3, "0");
                case "Z":
                  return B;
              }
              return null;
            })(J) || B.replace(":", "");
          }));
        }, L.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, L.diff = function(N, $, T) {
          var z, B = this, W = k.p($), Y = P(N), U = (Y.utcOffset() - this.utcOffset()) * r, V = this - Y, Z = function() {
            return k.m(B, Y);
          };
          switch (W) {
            case m:
              z = Z() / 12;
              break;
            case u:
              z = Z();
              break;
            case y:
              z = Z() / 3;
              break;
            case f:
              z = (V - U) / 6048e5;
              break;
            case c:
              z = (V - U) / 864e5;
              break;
            case l:
              z = V / o;
              break;
            case s:
              z = V / r;
              break;
            case a:
              z = V / n;
              break;
            default:
              z = V;
          }
          return T ? z : k.a(z);
        }, L.daysInMonth = function() {
          return this.endOf(u).$D;
        }, L.$locale = function() {
          return S[this.$L];
        }, L.locale = function(N, $) {
          if (!N) return this.$L;
          var T = this.clone(), z = _(N, $, !0);
          return z && (T.$L = z), T;
        }, L.clone = function() {
          return k.w(this.$d, this);
        }, L.toDate = function() {
          return new Date(this.valueOf());
        }, L.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, L.toISOString = function() {
          return this.$d.toISOString();
        }, L.toString = function() {
          return this.$d.toUTCString();
        }, A;
      })(), H = I.prototype;
      return P.prototype = H, [["$ms", i], ["$s", a], ["$m", s], ["$H", l], ["$W", c], ["$M", u], ["$y", m], ["$D", g]].forEach((function(A) {
        H[A[1]] = function(L) {
          return this.$g(L, A[0], A[1]);
        };
      })), P.extend = function(A, L) {
        return A.$i || (A(L, I, P), A.$i = !0), P;
      }, P.locale = _, P.isDayjs = M, P.unix = function(A) {
        return P(1e3 * A);
      }, P.en = S[x], P.Ls = S, P.p = {}, P;
    }));
  })(fi)), fi.exports;
}
var em = Jh();
const xo = /* @__PURE__ */ As(em), vr = "univer-scrollbar-thin univer-scrollbar-track-gray-50 univer-scrollbar-thumb-gray-300 dark:!univer-scrollbar-track-gray-900 dark:!univer-scrollbar-thumb-gray-700", Br = "univer-border-gray-200 dark:!univer-border-gray-600 univer-border-solid", kt = ie(Br, "univer-border"), cE = ie(Br, "univer-border-l univer-border-b univer-border-t-0 univer-border-r-0"), tm = ie(Br, "univer-border-l univer-border-b-0 univer-border-t-0 univer-border-r-0"), dE = ie(Br, "univer-border-l-0 univer-border-b-0 univer-border-t univer-border-r-0"), fE = ie(Br, "univer-border-l-0 univer-border-b univer-border-t-0 univer-border-r-0"), vE = ie(Br, "univer-border-l-0 univer-border-b-0 univer-border-t-0 univer-border-r"), pE = "univer-divide-gray-200 dark:!univer-divide-gray-600 univer-divide-y univer-divide-x-0 univer-divide-solid", hE = "univer-divide-gray-200 dark:!univer-divide-gray-600 univer-divide-x univer-divide-y-0 univer-divide-solid";
function nm(e) {
  const { className: t, value: n, onValueChange: r } = e;
  function o(i) {
    const a = xo(i.target.value, "HH:mm:ss").toDate();
    r == null || r(a);
  }
  return /* @__PURE__ */ me("div", { "data-u-comp": "time-input", className: "univer-relative univer-mx-auto univer-mt-1 univer-w-fit", children: [
    /* @__PURE__ */ R(
      Dc,
      {
        className: "univer-absolute univer-left-2 univer-top-1/2 -univer-translate-y-1/2 univer-text-gray-600 dark:!univer-text-gray-400"
      }
    ),
    /* @__PURE__ */ R(
      "input",
      {
        className: ie("univer-block univer-h-7 univer-w-fit univer-appearance-none univer-rounded-md univer-bg-transparent univer-pl-6 univer-pr-2 univer-text-center univer-text-gray-800 univer-shadow univer-outline-none univer-transition-all univer-duration-200 focus:univer-border-primary-600 dark:!univer-text-white dark:focus:!univer-border-primary-500 [&::-webkit-calendar-picker-indicator]:univer-hidden [&::-webkit-calendar-picker-indicator]:univer-appearance-none", kt, t),
        type: "time",
        step: "1",
        value: xo(n).format("HH:mm:ss"),
        onChange: o
      }
    )
  ] });
}
function rm(e, t) {
  return new Date(e, t + 1, 0).getDate();
}
function om(e, t) {
  return new Date(e, t, 1).getDay();
}
function Sa(e) {
  const { className: t, ...n } = e;
  return /* @__PURE__ */ R(
    "button",
    {
      className: ie("univer-size-7 univer-rounded-md univer-border-none univer-bg-transparent univer-p-1 univer-transition-all hover:univer-bg-gray-200 dark:hover:!univer-bg-gray-600", t),
      type: "button",
      ...n
    }
  );
}
function Za(e) {
  const { className: t, max: n, min: r, showTime: o = !1, value: i, onValueChange: a } = e, { locale: s } = Jn(Tn), { year: l, weekDays: c, months: f } = s == null ? void 0 : s.Calendar, u = /* @__PURE__ */ new Date(), [y, m] = De((i != null ? i : u).getFullYear()), [g, w] = De((i != null ? i : u).getMonth());
  function d() {
    w((P) => P === 0 ? (m((k) => k - 1), 11) : P - 1);
  }
  function v() {
    w((P) => P === 11 ? (m((k) => k + 1), 0) : P + 1);
  }
  const p = rm(y, g), b = om(y, g), C = lt(() => {
    const P = [];
    for (let k = 0; k < b; k++)
      P.push(null);
    for (let k = 1; k <= p; k++)
      P.push(k);
    return P;
  }, [p, b]);
  function x(P) {
    return P && y === (i == null ? void 0 : i.getFullYear()) && g === (i == null ? void 0 : i.getMonth()) && P === (i == null ? void 0 : i.getDate());
  }
  function S(P) {
    return P && y === u.getFullYear() && g === u.getMonth() && P === u.getDate();
  }
  function E(P) {
    var L, N, $;
    if (!P) return !1;
    const k = (L = i == null ? void 0 : i.getHours()) != null ? L : u.getHours(), I = (N = i == null ? void 0 : i.getMinutes()) != null ? N : u.getMinutes(), H = ($ = i == null ? void 0 : i.getSeconds()) != null ? $ : u.getSeconds(), A = new Date(y, g, P, k, I, H);
    return !!(r && A < r || n && A > n);
  }
  function M(P) {
    var L, N, $;
    if (E(P)) return;
    const k = (L = i == null ? void 0 : i.getHours()) != null ? L : u.getHours(), I = (N = i == null ? void 0 : i.getMinutes()) != null ? N : u.getMinutes(), H = ($ = i == null ? void 0 : i.getSeconds()) != null ? $ : u.getSeconds(), A = new Date(y, g, P, k, I, H);
    a == null || a(A);
  }
  function _(P) {
    var L;
    const k = P.getHours(), I = P.getMinutes(), H = P.getSeconds(), A = new Date(y, g, (L = i == null ? void 0 : i.getDate()) != null ? L : u.getDate(), k, I, H);
    a == null || a(A);
  }
  return /* @__PURE__ */ me(
    "div",
    {
      "data-u-comp": "calendar",
      className: ie("univer-mx-auto univer-max-w-xs univer-select-none univer-rounded univer-bg-white univer-text-gray-900 dark:!univer-bg-gray-900 dark:!univer-text-white", t),
      children: [
        /* @__PURE__ */ me(
          "nav",
          {
            className: "univer-mb-4 univer-flex univer-items-center univer-justify-between",
            children: [
              /* @__PURE__ */ R(
                Sa,
                {
                  className: "univer-text-lg univer-text-gray-500 dark:!univer-text-gray-200",
                  "aria-label": "Previous Month",
                  onClick: d,
                  children: /* @__PURE__ */ R(wo, { className: "univer-rotate-180" })
                }
              ),
              /* @__PURE__ */ me("span", { className: "univer-flex univer-gap-0.5 univer-text-sm univer-font-medium", children: [
                /* @__PURE__ */ R("span", { children: y }),
                /* @__PURE__ */ R("span", { children: l }),
                /* @__PURE__ */ R("span", { children: f[g] })
              ] }),
              /* @__PURE__ */ R(
                Sa,
                {
                  className: "univer-text-lg univer-text-gray-500 dark:!univer-text-gray-200",
                  "aria-label": "Next Month",
                  onClick: v,
                  children: /* @__PURE__ */ R(wo, {})
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ R(
          "div",
          {
            className: "univer-mb-1 univer-grid univer-grid-cols-7 univer-gap-1 univer-text-center univer-text-sm univer-text-gray-500 dark:!univer-text-gray-200",
            children: c.map((P) => /* @__PURE__ */ R("div", { children: P }, P))
          }
        ),
        /* @__PURE__ */ R("div", { className: "univer-grid univer-grid-cols-7 univer-gap-1 univer-text-center", children: C.map(
          (P, k) => P ? /* @__PURE__ */ R(
            Sa,
            {
              className: ie({
                "!univer-bg-primary-600 univer-font-bold univer-text-white": !S(P) && x(P),
                "dark:!univer-text-white": !S(P) && !x(P),
                "!univer-bg-primary-600 univer-text-white": S(P) && x(P),
                "univer-font-semibold univer-text-primary-600 dark:!univer-text-primary-500": S(P) && !x(P),
                "univer-cursor-not-allowed univer-opacity-40": E(P),
                "univer-hover:bg-primary-100 univer-cursor-pointer univer-text-gray-800": !x(P) && !E(P)
              }),
              onClick: () => M(P),
              disabled: E(P),
              children: P
            },
            k
          ) : /* @__PURE__ */ R("div", {}, k)
        ) }),
        o && /* @__PURE__ */ R(
          nm,
          {
            value: i,
            onValueChange: _
          }
        )
      ]
    }
  );
}
function Tu({ emptyText: e }) {
  return /* @__PURE__ */ R(
    "section",
    {
      className: "univer-h-8 univer-px-2 univer-pr-32 univer-text-sm/8 univer-text-gray-600 dark:!univer-text-gray-200",
      children: e
    }
  );
}
function mE(e) {
  const { value: t, options: n = [], onChange: r, contentClassName: o, wrapperClassName: i } = e, { locale: a } = Jn(Tn), s = lt(() => {
    const c = [n];
    return t.forEach((f, u) => {
      const y = c[u].find((m) => m.value === f);
      y != null && y.children && c.push(y.children);
    }), c;
  }, [t]);
  function l(c, f) {
    if (f === t[c])
      return;
    if (t[c + 1]) {
      const y = t.slice(0, c + 1);
      y[c] = f, r(y);
      return;
    }
    const u = [...t];
    u[c] = f, r(u);
  }
  return /* @__PURE__ */ me(
    "section",
    {
      "data-u-comp": "cascader-list",
      className: ie("univer-overflow-auto-y univer-grid univer-h-full univer-max-h-80 univer-grid-flow-col univer-rounded univer-py-2 univer-text-gray-900 dark:!univer-text-white [&>ul:not(:last-child)]:univer-border-0 [&>ul:not(:last-child)]:univer-border-r [&>ul:not(:last-child)]:univer-border-solid [&>ul:not(:last-child)]:univer-border-r-gray-200", kt, vr, i),
      children: [
        s.map(
          (c, f) => c.length ? /* @__PURE__ */ R(
            "ul",
            {
              className: ie("univer-m-0 univer-h-full univer-max-h-full univer-list-none univer-overflow-auto univer-px-2", vr, o),
              children: c.map((u) => /* @__PURE__ */ R("li", { children: /* @__PURE__ */ me(
                "a",
                {
                  className: ie("univer-relative univer-block univer-h-8 univer-cursor-pointer univer-rounded univer-text-sm/8", {
                    "univer-px-7": f > 0,
                    "univer-px-1.5": f === 0,
                    "univer-bg-gray-200 dark:!univer-bg-gray-600": u.value === t[f]
                  }),
                  onClick: () => l(f, u.value),
                  children: [
                    f > 0 && /* @__PURE__ */ R(
                      "span",
                      {
                        className: "univer-absolute univer-left-2 univer-flex univer-h-full univer-items-center",
                        children: u.value === t[f] && /* @__PURE__ */ R(
                          Hr,
                          {
                            className: "univer-text-primary-600"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ R("span", { children: u.label })
                  ]
                }
              ) }, u.value))
            },
            f
          ) : /* @__PURE__ */ R(Tu, { emptyText: a == null ? void 0 : a.CascaderList.empty }, f)
        ),
        t.length <= 0 && /* @__PURE__ */ R(Tu, { emptyText: a == null ? void 0 : a.CascaderList.empty })
      ]
    }
  );
}
function gE(e) {
  const { children: t, className: n, style: r, value: o, disabled: i, direction: a = "horizontal", onChange: s } = e, l = (c) => {
    o.includes(c) ? s(o.filter((f) => f !== c)) : s([...o, c]);
  };
  return /* @__PURE__ */ R(
    "div",
    {
      className: ie("univer-flex univer-gap-2", {
        "univer-flex-col": a === "vertical"
      }, n),
      style: r,
      children: wi.map(t, (c, f) => Ds(c) ? Ns(c, {
        key: f,
        children: c.props.children,
        checked: c.props.value ? o.includes(c.props.value) : !1,
        disabled: i != null ? i : c.props.disabled,
        onChange: l
      }) : c)
    }
  );
}
function im(e) {
  const { children: t, className: n, style: r, checked: o = !1, indeterminate: i = !1, value: a, disabled: s = !1, onChange: l, contentClassName: c } = e, f = ye(null);
  function u(y) {
    var m, g;
    if (y.stopPropagation(), !(!l || s))
      if (typeof a < "u")
        l == null || l(a);
      else {
        const w = (g = (m = f == null ? void 0 : f.current) == null ? void 0 : m.checked) != null ? g : !1;
        l == null || l(w);
      }
  }
  return /* @__PURE__ */ me(
    "label",
    {
      "data-u-comp": "checkbox",
      className: ie("univer-box-border univer-inline-flex univer-items-center univer-gap-2 univer-text-sm", {
        "univer-cursor-pointer univer-text-gray-900 dark:!univer-text-white": !s,
        "univer-text-gray-400": s
      }, n),
      style: r,
      children: [
        /* @__PURE__ */ me("span", { className: "univer-relative univer-block", children: [
          /* @__PURE__ */ R(
            "input",
            {
              ref: f,
              className: "univer-absolute univer-size-0 univer-opacity-0",
              type: "checkbox",
              checked: o,
              disabled: s,
              onChange: u
            }
          ),
          /* @__PURE__ */ me(
            "span",
            {
              className: ie("univer-relative univer-box-border univer-flex univer-size-4 univer-items-center univer-justify-center univer-overflow-hidden univer-rounded univer-border univer-border-solid univer-transition-colors", {
                "univer-opacity-50": s,
                "univer-border-primary-600 univer-bg-primary-600": o || i,
                "univer-border-gray-300 univer-bg-gray-50 dark:!univer-border-gray-500 dark:!univer-bg-gray-600": !o && !i
              }),
              children: [
                o && /* @__PURE__ */ R(
                  Hr,
                  {
                    className: "univer-absolute univer-left-1/2 univer-top-1/2 univer-block univer-size-3 -univer-translate-x-1/2 -univer-translate-y-1/2 univer-text-white"
                  }
                ),
                i && !o && /* @__PURE__ */ R(
                  "span",
                  {
                    className: "univer-absolute univer-left-1/2 univer-top-1/2 univer-block univer-h-0.5 univer-w-2.5 -univer-translate-x-1/2 -univer-translate-y-1/2 univer-rounded univer-bg-white"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ R("span", { className: ie("univer-select-none", c), children: t })
      ]
    }
  );
}
function Ce(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function am(e, t) {
  const n = h.createContext(t), r = (i) => {
    const { children: a, ...s } = i, l = h.useMemo(() => s, Object.values(s));
    return /* @__PURE__ */ R(n.Provider, { value: l, children: a });
  };
  r.displayName = e + "Provider";
  function o(i) {
    const a = h.useContext(n);
    if (a) return a;
    if (t !== void 0) return t;
    throw new Error(`\`${i}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function er(e, t = []) {
  let n = [];
  function r(i, a) {
    const s = h.createContext(a), l = n.length;
    n = [...n, a];
    const c = (u) => {
      var v;
      const { scope: y, children: m, ...g } = u, w = ((v = y == null ? void 0 : y[e]) == null ? void 0 : v[l]) || s, d = h.useMemo(() => g, Object.values(g));
      return /* @__PURE__ */ R(w.Provider, { value: d, children: m });
    };
    c.displayName = i + "Provider";
    function f(u, y) {
      var w;
      const m = ((w = y == null ? void 0 : y[e]) == null ? void 0 : w[l]) || s, g = h.useContext(m);
      if (g) return g;
      if (a !== void 0) return a;
      throw new Error(`\`${u}\` must be used within \`${i}\``);
    }
    return [c, f];
  }
  const o = () => {
    const i = n.map((a) => h.createContext(a));
    return function(s) {
      const l = (s == null ? void 0 : s[e]) || i;
      return h.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: l } }),
        [s, l]
      );
    };
  };
  return o.scopeName = e, [r, sm(o, ...t)];
}
function sm(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const a = r.reduce((s, { useScope: l, scopeName: c }) => {
        const u = l(i)[`__scope${c}`];
        return { ...s, ...u };
      }, {});
      return h.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
var Xn = globalThis != null && globalThis.document ? h.useLayoutEffect : () => {
}, um = h[" useId ".trim().toString()] || (() => {
}), lm = 0;
function Nn(e) {
  const [t, n] = h.useState(um());
  return Xn(() => {
    n((r) => r != null ? r : String(lm++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var cm = h[" useInsertionEffect ".trim().toString()] || Xn;
function jr({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, i, a] = dm({
    defaultProp: t,
    onChange: n
  }), s = e !== void 0, l = s ? e : o;
  {
    const f = h.useRef(e !== void 0);
    h.useEffect(() => {
      const u = f.current;
      u !== s && console.warn(
        `${r} is changing from ${u ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), f.current = s;
    }, [s, r]);
  }
  const c = h.useCallback(
    (f) => {
      var u;
      if (s) {
        const y = fm(f) ? f(e) : f;
        y !== e && ((u = a.current) == null || u.call(a, y));
      } else
        i(f);
    },
    [s, e, i, a]
  );
  return [l, c];
}
function dm({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = h.useState(e), o = h.useRef(n), i = h.useRef(t);
  return cm(() => {
    i.current = t;
  }, [t]), h.useEffect(() => {
    var a;
    o.current !== n && ((a = i.current) == null || a.call(i, n), o.current = n);
  }, [n, o]), [n, r, i];
}
function fm(e) {
  return typeof e == "function";
}
// @__NO_SIDE_EFFECTS__
function Lr(e) {
  const t = /* @__PURE__ */ vm(e), n = h.forwardRef((r, o) => {
    const { children: i, ...a } = r, s = h.Children.toArray(i), l = s.find(hm);
    if (l) {
      const c = l.props.children, f = s.map((u) => u === l ? h.Children.count(c) > 1 ? h.Children.only(null) : h.isValidElement(c) ? c.props.children : null : u);
      return /* @__PURE__ */ R(t, { ...a, ref: o, children: h.isValidElement(c) ? h.cloneElement(c, void 0, f) : null });
    }
    return /* @__PURE__ */ R(t, { ...a, ref: o, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function vm(e) {
  const t = h.forwardRef((n, r) => {
    const { children: o, ...i } = n;
    if (h.isValidElement(o)) {
      const a = gm(o), s = mm(i, o.props);
      return o.type !== h.Fragment && (s.ref = r ? Oo(r, a) : a), h.cloneElement(o, s);
    }
    return h.Children.count(o) > 1 ? h.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var pm = Symbol("radix.slottable");
function hm(e) {
  return h.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === pm;
}
function mm(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...s) => {
      const l = i(...s);
      return o(...s), l;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function gm(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var ym = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], at = ym.reduce((e, t) => {
  const n = /* @__PURE__ */ Lr(`Primitive.${t}`), r = h.forwardRef((o, i) => {
    const { asChild: a, ...s } = o, l = a ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ R(l, { ...s, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function Qc(e, t) {
  e && Pc.flushSync(() => e.dispatchEvent(t));
}
function bn(e) {
  const t = h.useRef(e);
  return h.useEffect(() => {
    t.current = e;
  }), h.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
function bm(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = bn(e);
  h.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var wm = "DismissableLayer", Qa = "dismissableLayer.update", xm = "dismissableLayer.pointerDownOutside", Cm = "dismissableLayer.focusOutside", Iu, Jc = h.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), ko = h.forwardRef(
  (e, t) => {
    var E;
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: a,
      onDismiss: s,
      ...l
    } = e, c = h.useContext(Jc), [f, u] = h.useState(null), y = (E = f == null ? void 0 : f.ownerDocument) != null ? E : globalThis == null ? void 0 : globalThis.document, [, m] = h.useState({}), g = gt(t, (M) => u(M)), w = Array.from(c.layers), [d] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1), v = w.indexOf(d), p = f ? w.indexOf(f) : -1, b = c.layersWithOutsidePointerEventsDisabled.size > 0, C = p >= v, x = Rm((M) => {
      const _ = M.target, P = [...c.branches].some((k) => k.contains(_));
      !C || P || (o == null || o(M), a == null || a(M), M.defaultPrevented || s == null || s());
    }, y), S = Mm((M) => {
      const _ = M.target;
      [...c.branches].some((k) => k.contains(_)) || (i == null || i(M), a == null || a(M), M.defaultPrevented || s == null || s());
    }, y);
    return bm((M) => {
      p === c.layers.size - 1 && (r == null || r(M), !M.defaultPrevented && s && (M.preventDefault(), s()));
    }, y), h.useEffect(() => {
      if (f)
        return n && (c.layersWithOutsidePointerEventsDisabled.size === 0 && (Iu = y.body.style.pointerEvents, y.body.style.pointerEvents = "none"), c.layersWithOutsidePointerEventsDisabled.add(f)), c.layers.add(f), Au(), () => {
          n && c.layersWithOutsidePointerEventsDisabled.size === 1 && (y.body.style.pointerEvents = Iu);
        };
    }, [f, y, n, c]), h.useEffect(() => () => {
      f && (c.layers.delete(f), c.layersWithOutsidePointerEventsDisabled.delete(f), Au());
    }, [f, c]), h.useEffect(() => {
      const M = () => m({});
      return document.addEventListener(Qa, M), () => document.removeEventListener(Qa, M);
    }, []), /* @__PURE__ */ R(
      at.div,
      {
        ...l,
        ref: g,
        style: {
          pointerEvents: b ? C ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: Ce(e.onFocusCapture, S.onFocusCapture),
        onBlurCapture: Ce(e.onBlurCapture, S.onBlurCapture),
        onPointerDownCapture: Ce(
          e.onPointerDownCapture,
          x.onPointerDownCapture
        )
      }
    );
  }
);
ko.displayName = wm;
var Sm = "DismissableLayerBranch", Em = h.forwardRef((e, t) => {
  const n = h.useContext(Jc), r = h.useRef(null), o = gt(t, r);
  return h.useEffect(() => {
    const i = r.current;
    if (i)
      return n.branches.add(i), () => {
        n.branches.delete(i);
      };
  }, [n.branches]), /* @__PURE__ */ R(at.div, { ...e, ref: o });
});
Em.displayName = Sm;
function Rm(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = bn(e), r = h.useRef(!1), o = h.useRef(() => {
  });
  return h.useEffect(() => {
    const i = (s) => {
      if (s.target && !r.current) {
        let l = function() {
          ed(
            xm,
            n,
            c,
            { discrete: !0 }
          );
        };
        const c = { originalEvent: s };
        s.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = l, t.addEventListener("click", o.current, { once: !0 })) : l();
      } else
        t.removeEventListener("click", o.current);
      r.current = !1;
    }, a = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(a), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function Mm(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = bn(e), r = h.useRef(!1);
  return h.useEffect(() => {
    const o = (i) => {
      i.target && !r.current && ed(Cm, n, { originalEvent: i }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function Au() {
  const e = new CustomEvent(Qa);
  document.dispatchEvent(e);
}
function ed(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Qc(o, i) : o.dispatchEvent(i);
}
var Ea = "focusScope.autoFocusOnMount", Ra = "focusScope.autoFocusOnUnmount", Lu = { bubbles: !1, cancelable: !0 }, Pm = "FocusScope", Vi = h.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...a
  } = e, [s, l] = h.useState(null), c = bn(o), f = bn(i), u = h.useRef(null), y = gt(t, (w) => l(w)), m = h.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  h.useEffect(() => {
    if (r) {
      let w = function(b) {
        if (m.paused || !s) return;
        const C = b.target;
        s.contains(C) ? u.current = C : Gn(u.current, { select: !0 });
      }, d = function(b) {
        if (m.paused || !s) return;
        const C = b.relatedTarget;
        C !== null && (s.contains(C) || Gn(u.current, { select: !0 }));
      }, v = function(b) {
        if (document.activeElement === document.body)
          for (const x of b)
            x.removedNodes.length > 0 && Gn(s);
      };
      document.addEventListener("focusin", w), document.addEventListener("focusout", d);
      const p = new MutationObserver(v);
      return s && p.observe(s, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", w), document.removeEventListener("focusout", d), p.disconnect();
      };
    }
  }, [r, s, m.paused]), h.useEffect(() => {
    if (s) {
      zu.add(m);
      const w = document.activeElement;
      if (!s.contains(w)) {
        const v = new CustomEvent(Ea, Lu);
        s.addEventListener(Ea, c), s.dispatchEvent(v), v.defaultPrevented || (Nm(Tm(td(s)), { select: !0 }), document.activeElement === w && Gn(s));
      }
      return () => {
        s.removeEventListener(Ea, c), setTimeout(() => {
          const v = new CustomEvent(Ra, Lu);
          s.addEventListener(Ra, f), s.dispatchEvent(v), v.defaultPrevented || Gn(w != null ? w : document.body, { select: !0 }), s.removeEventListener(Ra, f), zu.remove(m);
        }, 0);
      };
    }
  }, [s, c, f, m]);
  const g = h.useCallback(
    (w) => {
      if (!n && !r || m.paused) return;
      const d = w.key === "Tab" && !w.altKey && !w.ctrlKey && !w.metaKey, v = document.activeElement;
      if (d && v) {
        const p = w.currentTarget, [b, C] = Dm(p);
        b && C ? !w.shiftKey && v === C ? (w.preventDefault(), n && Gn(b, { select: !0 })) : w.shiftKey && v === b && (w.preventDefault(), n && Gn(C, { select: !0 })) : v === p && w.preventDefault();
      }
    },
    [n, r, m.paused]
  );
  return /* @__PURE__ */ R(at.div, { tabIndex: -1, ...a, ref: y, onKeyDown: g });
});
Vi.displayName = Pm;
function Nm(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Gn(r, { select: t }), document.activeElement !== n) return;
}
function Dm(e) {
  const t = td(e), n = $u(t, e), r = $u(t.reverse(), e);
  return [n, r];
}
function td(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function $u(e, t) {
  for (const n of e)
    if (!_m(n, { upTo: t })) return n;
}
function _m(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Om(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Gn(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Om(e) && t && e.select();
  }
}
var zu = km();
function km() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = Fu(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = Fu(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function Fu(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function Tm(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Im = "Portal", To = h.forwardRef((e, t) => {
  var s;
  const { container: n, ...r } = e, [o, i] = h.useState(!1);
  Xn(() => i(!0), []);
  const a = n || o && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return a ? rn.createPortal(/* @__PURE__ */ R(at.div, { ...r, ref: t }), a) : null;
});
To.displayName = Im;
function Am(e, t) {
  return h.useReducer((n, r) => {
    const o = t[n][r];
    return o != null ? o : n;
  }, e);
}
var Yt = (e) => {
  const { present: t, children: n } = e, r = Lm(t), o = typeof n == "function" ? n({ present: r.isPresent }) : h.Children.only(n), i = gt(r.ref, $m(o));
  return typeof n == "function" || r.isPresent ? h.cloneElement(o, { ref: i }) : null;
};
Yt.displayName = "Presence";
function Lm(e) {
  const [t, n] = h.useState(), r = h.useRef(null), o = h.useRef(e), i = h.useRef("none"), a = e ? "mounted" : "unmounted", [s, l] = Am(a, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return h.useEffect(() => {
    const c = Xo(r.current);
    i.current = s === "mounted" ? c : "none";
  }, [s]), Xn(() => {
    const c = r.current, f = o.current;
    if (f !== e) {
      const y = i.current, m = Xo(c);
      e ? l("MOUNT") : m === "none" || (c == null ? void 0 : c.display) === "none" ? l("UNMOUNT") : l(f && y !== m ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, l]), Xn(() => {
    var c;
    if (t) {
      let f;
      const u = (c = t.ownerDocument.defaultView) != null ? c : window, y = (g) => {
        const d = Xo(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && d && (l("ANIMATION_END"), !o.current)) {
          const v = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", f = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = v);
          });
        }
      }, m = (g) => {
        g.target === t && (i.current = Xo(r.current));
      };
      return t.addEventListener("animationstart", m), t.addEventListener("animationcancel", y), t.addEventListener("animationend", y), () => {
        u.clearTimeout(f), t.removeEventListener("animationstart", m), t.removeEventListener("animationcancel", y), t.removeEventListener("animationend", y);
      };
    } else
      l("ANIMATION_END");
  }, [t, l]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: h.useCallback((c) => {
      r.current = c ? getComputedStyle(c) : null, n(c);
    }, [])
  };
}
function Xo(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function $m(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Ma = 0;
function Ls() {
  h.useEffect(() => {
    var t, n;
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", (t = e[0]) != null ? t : Hu()), document.body.insertAdjacentElement("beforeend", (n = e[1]) != null ? n : Hu()), Ma++, () => {
      Ma === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((r) => r.remove()), Ma--;
    };
  }, []);
}
function Hu() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var mn = function() {
  return mn = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
  }, mn.apply(this, arguments);
};
function nd(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function zm(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, i; r < o; r++)
    (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var vi = "right-scroll-bar-position", pi = "width-before-scroll-bar", Fm = "with-scroll-bars-hidden", Hm = "--removed-body-scroll-bar-size";
function Pa(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Wm(e, t) {
  var n = De(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && (n.value = r, n.callback(r, o));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var Bm = typeof window < "u" ? h.useLayoutEffect : h.useEffect, Wu = /* @__PURE__ */ new WeakMap();
function jm(e, t) {
  var n = Wm(null, function(r) {
    return e.forEach(function(o) {
      return Pa(o, r);
    });
  });
  return Bm(function() {
    var r = Wu.get(n);
    if (r) {
      var o = new Set(r), i = new Set(e), a = n.current;
      o.forEach(function(s) {
        i.has(s) || Pa(s, null);
      }), i.forEach(function(s) {
        o.has(s) || Pa(s, a);
      });
    }
    Wu.set(n, e);
  }, [e]), n;
}
function Vm(e) {
  return e;
}
function qm(e, t) {
  t === void 0 && (t = Vm);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(i) {
      var a = t(i, r);
      return n.push(a), function() {
        n = n.filter(function(s) {
          return s !== a;
        });
      };
    },
    assignSyncMedium: function(i) {
      for (r = !0; n.length; ) {
        var a = n;
        n = [], a.forEach(i);
      }
      n = {
        push: function(s) {
          return i(s);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(i) {
      r = !0;
      var a = [];
      if (n.length) {
        var s = n;
        n = [], s.forEach(i), a = n;
      }
      var l = function() {
        var f = a;
        a = [], f.forEach(i);
      }, c = function() {
        return Promise.resolve().then(l);
      };
      c(), n = {
        push: function(f) {
          a.push(f), c();
        },
        filter: function(f) {
          return a = a.filter(f), n;
        }
      };
    }
  };
  return o;
}
function Um(e) {
  e === void 0 && (e = {});
  var t = qm(null);
  return t.options = mn({ async: !0, ssr: !1 }, e), t;
}
var rd = function(e) {
  var t = e.sideCar, n = nd(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return h.createElement(r, mn({}, n));
};
rd.isSideCarExport = !0;
function Gm(e, t) {
  return e.useMedium(t), rd;
}
var od = Um(), Na = function() {
}, qi = h.forwardRef(function(e, t) {
  var n = h.useRef(null), r = h.useState({
    onScrollCapture: Na,
    onWheelCapture: Na,
    onTouchMoveCapture: Na
  }), o = r[0], i = r[1], a = e.forwardProps, s = e.children, l = e.className, c = e.removeScrollBar, f = e.enabled, u = e.shards, y = e.sideCar, m = e.noRelative, g = e.noIsolation, w = e.inert, d = e.allowPinchZoom, v = e.as, p = v === void 0 ? "div" : v, b = e.gapMode, C = nd(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), x = y, S = jm([n, t]), E = mn(mn({}, C), o);
  return h.createElement(
    h.Fragment,
    null,
    f && h.createElement(x, { sideCar: od, removeScrollBar: c, shards: u, noRelative: m, noIsolation: g, inert: w, setCallbacks: i, allowPinchZoom: !!d, lockRef: n, gapMode: b }),
    a ? h.cloneElement(h.Children.only(s), mn(mn({}, E), { ref: S })) : h.createElement(p, mn({}, E, { className: l, ref: S }), s)
  );
});
qi.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
qi.classNames = {
  fullWidth: pi,
  zeroRight: vi
};
var Km = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Ym() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Km();
  return t && e.setAttribute("nonce", t), e;
}
function Xm(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Zm(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Qm = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = Ym()) && (Xm(t, n), Zm(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Jm = function() {
  var e = Qm();
  return function(t, n) {
    h.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, id = function() {
  var e = Jm(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, eg = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Da = function(e) {
  return parseInt(e || "", 10) || 0;
}, tg = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Da(n), Da(r), Da(o)];
}, ng = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return eg;
  var t = tg(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, rg = id(), Ir = "data-scroll-locked", og = function(e, t, n, r) {
  var o = e.left, i = e.top, a = e.right, s = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Fm, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(s, "px ").concat(r, `;
  }
  body[`).concat(Ir, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(a, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(s, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(vi, ` {
    right: `).concat(s, "px ").concat(r, `;
  }
  
  .`).concat(pi, ` {
    margin-right: `).concat(s, "px ").concat(r, `;
  }
  
  .`).concat(vi, " .").concat(vi, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(pi, " .").concat(pi, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Ir, `] {
    `).concat(Hm, ": ").concat(s, `px;
  }
`);
}, Bu = function() {
  var e = parseInt(document.body.getAttribute(Ir) || "0", 10);
  return isFinite(e) ? e : 0;
}, ig = function() {
  h.useEffect(function() {
    return document.body.setAttribute(Ir, (Bu() + 1).toString()), function() {
      var e = Bu() - 1;
      e <= 0 ? document.body.removeAttribute(Ir) : document.body.setAttribute(Ir, e.toString());
    };
  }, []);
}, ag = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  ig();
  var i = h.useMemo(function() {
    return ng(o);
  }, [o]);
  return h.createElement(rg, { styles: og(i, !t, o, n ? "" : "!important") });
}, Ja = !1;
if (typeof window < "u")
  try {
    var Zo = Object.defineProperty({}, "passive", {
      get: function() {
        return Ja = !0, !0;
      }
    });
    window.addEventListener("test", Zo, Zo), window.removeEventListener("test", Zo, Zo);
  } catch {
    Ja = !1;
  }
var Cr = Ja ? { passive: !1 } : !1, sg = function(e) {
  return e.tagName === "TEXTAREA";
}, ad = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !sg(e) && n[t] === "visible")
  );
}, ug = function(e) {
  return ad(e, "overflowY");
}, lg = function(e) {
  return ad(e, "overflowX");
}, ju = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = sd(e, r);
    if (o) {
      var i = ud(e, r), a = i[1], s = i[2];
      if (a > s)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, cg = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, dg = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, sd = function(e, t) {
  return e === "v" ? ug(t) : lg(t);
}, ud = function(e, t) {
  return e === "v" ? cg(t) : dg(t);
}, fg = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, vg = function(e, t, n, r, o) {
  var i = fg(e, window.getComputedStyle(t).direction), a = i * r, s = n.target, l = t.contains(s), c = !1, f = a > 0, u = 0, y = 0;
  do {
    if (!s)
      break;
    var m = ud(e, s), g = m[0], w = m[1], d = m[2], v = w - d - i * g;
    (g || v) && sd(e, s) && (u += v, y += g);
    var p = s.parentNode;
    s = p && p.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? p.host : p;
  } while (
    // portaled content
    !l && s !== document.body || // self content
    l && (t.contains(s) || t === s)
  );
  return (f && Math.abs(u) < 1 || !f && Math.abs(y) < 1) && (c = !0), c;
}, Qo = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Vu = function(e) {
  return [e.deltaX, e.deltaY];
}, qu = function(e) {
  return e && "current" in e ? e.current : e;
}, pg = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, hg = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, mg = 0, Sr = [];
function gg(e) {
  var t = h.useRef([]), n = h.useRef([0, 0]), r = h.useRef(), o = h.useState(mg++)[0], i = h.useState(id)[0], a = h.useRef(e);
  h.useEffect(function() {
    a.current = e;
  }, [e]), h.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var w = zm([e.lockRef.current], (e.shards || []).map(qu), !0).filter(Boolean);
      return w.forEach(function(d) {
        return d.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), w.forEach(function(d) {
          return d.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = h.useCallback(function(w, d) {
    if ("touches" in w && w.touches.length === 2 || w.type === "wheel" && w.ctrlKey)
      return !a.current.allowPinchZoom;
    var v = Qo(w), p = n.current, b = "deltaX" in w ? w.deltaX : p[0] - v[0], C = "deltaY" in w ? w.deltaY : p[1] - v[1], x, S = w.target, E = Math.abs(b) > Math.abs(C) ? "h" : "v";
    if ("touches" in w && E === "h" && S.type === "range")
      return !1;
    var M = ju(E, S);
    if (!M)
      return !0;
    if (M ? x = E : (x = E === "v" ? "h" : "v", M = ju(E, S)), !M)
      return !1;
    if (!r.current && "changedTouches" in w && (b || C) && (r.current = x), !x)
      return !0;
    var _ = r.current || x;
    return vg(_, d, w, _ === "h" ? b : C);
  }, []), l = h.useCallback(function(w) {
    var d = w;
    if (!(!Sr.length || Sr[Sr.length - 1] !== i)) {
      var v = "deltaY" in d ? Vu(d) : Qo(d), p = t.current.filter(function(x) {
        return x.name === d.type && (x.target === d.target || d.target === x.shadowParent) && pg(x.delta, v);
      })[0];
      if (p && p.should) {
        d.cancelable && d.preventDefault();
        return;
      }
      if (!p) {
        var b = (a.current.shards || []).map(qu).filter(Boolean).filter(function(x) {
          return x.contains(d.target);
        }), C = b.length > 0 ? s(d, b[0]) : !a.current.noIsolation;
        C && d.cancelable && d.preventDefault();
      }
    }
  }, []), c = h.useCallback(function(w, d, v, p) {
    var b = { name: w, delta: d, target: v, should: p, shadowParent: yg(v) };
    t.current.push(b), setTimeout(function() {
      t.current = t.current.filter(function(C) {
        return C !== b;
      });
    }, 1);
  }, []), f = h.useCallback(function(w) {
    n.current = Qo(w), r.current = void 0;
  }, []), u = h.useCallback(function(w) {
    c(w.type, Vu(w), w.target, s(w, e.lockRef.current));
  }, []), y = h.useCallback(function(w) {
    c(w.type, Qo(w), w.target, s(w, e.lockRef.current));
  }, []);
  h.useEffect(function() {
    return Sr.push(i), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: y
    }), document.addEventListener("wheel", l, Cr), document.addEventListener("touchmove", l, Cr), document.addEventListener("touchstart", f, Cr), function() {
      Sr = Sr.filter(function(w) {
        return w !== i;
      }), document.removeEventListener("wheel", l, Cr), document.removeEventListener("touchmove", l, Cr), document.removeEventListener("touchstart", f, Cr);
    };
  }, []);
  var m = e.removeScrollBar, g = e.inert;
  return h.createElement(
    h.Fragment,
    null,
    g ? h.createElement(i, { styles: hg(o) }) : null,
    m ? h.createElement(ag, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function yg(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const bg = Gm(od, gg);
var Ui = h.forwardRef(function(e, t) {
  return h.createElement(qi, mn({}, e, { ref: t, sideCar: bg }));
});
Ui.classNames = qi.classNames;
var wg = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Er = /* @__PURE__ */ new WeakMap(), Jo = /* @__PURE__ */ new WeakMap(), ei = {}, _a = 0, ld = function(e) {
  return e && (e.host || ld(e.parentNode));
}, xg = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = ld(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Cg = function(e, t, n, r) {
  var o = xg(t, Array.isArray(e) ? e : [e]);
  ei[n] || (ei[n] = /* @__PURE__ */ new WeakMap());
  var i = ei[n], a = [], s = /* @__PURE__ */ new Set(), l = new Set(o), c = function(u) {
    !u || s.has(u) || (s.add(u), c(u.parentNode));
  };
  o.forEach(c);
  var f = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(y) {
      if (s.has(y))
        f(y);
      else
        try {
          var m = y.getAttribute(r), g = m !== null && m !== "false", w = (Er.get(y) || 0) + 1, d = (i.get(y) || 0) + 1;
          Er.set(y, w), i.set(y, d), a.push(y), w === 1 && g && Jo.set(y, !0), d === 1 && y.setAttribute(n, "true"), g || y.setAttribute(r, "true");
        } catch (v) {
          console.error("aria-hidden: cannot operate on ", y, v);
        }
    });
  };
  return f(t), s.clear(), _a++, function() {
    a.forEach(function(u) {
      var y = Er.get(u) - 1, m = i.get(u) - 1;
      Er.set(u, y), i.set(u, m), y || (Jo.has(u) || u.removeAttribute(r), Jo.delete(u)), m || u.removeAttribute(n);
    }), _a--, _a || (Er = /* @__PURE__ */ new WeakMap(), Er = /* @__PURE__ */ new WeakMap(), Jo = /* @__PURE__ */ new WeakMap(), ei = {});
  };
}, $s = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = wg(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), Cg(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, Gi = "Dialog", [cd] = er(Gi), [Sg, un] = cd(Gi), dd = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    modal: a = !0
  } = e, s = h.useRef(null), l = h.useRef(null), [c, f] = jr({
    prop: r,
    defaultProp: o != null ? o : !1,
    onChange: i,
    caller: Gi
  });
  return /* @__PURE__ */ R(
    Sg,
    {
      scope: t,
      triggerRef: s,
      contentRef: l,
      contentId: Nn(),
      titleId: Nn(),
      descriptionId: Nn(),
      open: c,
      onOpenChange: f,
      onOpenToggle: h.useCallback(() => f((u) => !u), [f]),
      modal: a,
      children: n
    }
  );
};
dd.displayName = Gi;
var fd = "DialogTrigger", Eg = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = un(fd, n), i = gt(t, o.triggerRef);
    return /* @__PURE__ */ R(
      at.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Hs(o.open),
        ...r,
        ref: i,
        onClick: Ce(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Eg.displayName = fd;
var zs = "DialogPortal", [Rg, vd] = cd(zs, {
  forceMount: void 0
}), pd = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, i = un(zs, t);
  return /* @__PURE__ */ R(Rg, { scope: t, forceMount: n, children: h.Children.map(r, (a) => /* @__PURE__ */ R(Yt, { present: n || i.open, children: /* @__PURE__ */ R(To, { asChild: !0, container: o, children: a }) })) });
};
pd.displayName = zs;
var Ci = "DialogOverlay", hd = h.forwardRef(
  (e, t) => {
    const n = vd(Ci, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, i = un(Ci, e.__scopeDialog);
    return i.modal ? /* @__PURE__ */ R(Yt, { present: r || i.open, children: /* @__PURE__ */ R(Pg, { ...o, ref: t }) }) : null;
  }
);
hd.displayName = Ci;
var Mg = /* @__PURE__ */ Lr("DialogOverlay.RemoveScroll"), Pg = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = un(Ci, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ R(Ui, { as: Mg, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ R(
        at.div,
        {
          "data-state": Hs(o.open),
          ...r,
          ref: t,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), pr = "DialogContent", md = h.forwardRef(
  (e, t) => {
    const n = vd(pr, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, i = un(pr, e.__scopeDialog);
    return /* @__PURE__ */ R(Yt, { present: r || i.open, children: i.modal ? /* @__PURE__ */ R(Ng, { ...o, ref: t }) : /* @__PURE__ */ R(Dg, { ...o, ref: t }) });
  }
);
md.displayName = pr;
var Ng = h.forwardRef(
  (e, t) => {
    const n = un(pr, e.__scopeDialog), r = h.useRef(null), o = gt(t, n.contentRef, r);
    return h.useEffect(() => {
      const i = r.current;
      if (i) return $s(i);
    }, []), /* @__PURE__ */ R(
      gd,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Ce(e.onCloseAutoFocus, (i) => {
          var a;
          i.preventDefault(), (a = n.triggerRef.current) == null || a.focus();
        }),
        onPointerDownOutside: Ce(e.onPointerDownOutside, (i) => {
          const a = i.detail.originalEvent, s = a.button === 0 && a.ctrlKey === !0;
          (a.button === 2 || s) && i.preventDefault();
        }),
        onFocusOutside: Ce(
          e.onFocusOutside,
          (i) => i.preventDefault()
        )
      }
    );
  }
), Dg = h.forwardRef(
  (e, t) => {
    const n = un(pr, e.__scopeDialog), r = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ R(
      gd,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var a, s;
          (a = e.onCloseAutoFocus) == null || a.call(e, i), i.defaultPrevented || (r.current || (s = n.triggerRef.current) == null || s.focus(), i.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (i) => {
          var l, c;
          (l = e.onInteractOutside) == null || l.call(e, i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const a = i.target;
          ((c = n.triggerRef.current) == null ? void 0 : c.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), gd = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: i, ...a } = e, s = un(pr, n), l = h.useRef(null), c = gt(t, l);
    return Ls(), /* @__PURE__ */ me(dr, { children: [
      /* @__PURE__ */ R(
        Vi,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: o,
          onUnmountAutoFocus: i,
          children: /* @__PURE__ */ R(
            ko,
            {
              role: "dialog",
              id: s.contentId,
              "aria-describedby": s.descriptionId,
              "aria-labelledby": s.titleId,
              "data-state": Hs(s.open),
              ...a,
              ref: c,
              onDismiss: () => s.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ me(dr, { children: [
        /* @__PURE__ */ R(_g, { titleId: s.titleId }),
        /* @__PURE__ */ R(kg, { contentRef: l, descriptionId: s.descriptionId })
      ] })
    ] });
  }
), Fs = "DialogTitle", yd = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = un(Fs, n);
    return /* @__PURE__ */ R(at.h2, { id: o.titleId, ...r, ref: t });
  }
);
yd.displayName = Fs;
var bd = "DialogDescription", wd = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = un(bd, n);
    return /* @__PURE__ */ R(at.p, { id: o.descriptionId, ...r, ref: t });
  }
);
wd.displayName = bd;
var xd = "DialogClose", Cd = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = un(xd, n);
    return /* @__PURE__ */ R(
      at.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: Ce(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
Cd.displayName = xd;
function Hs(e) {
  return e ? "open" : "closed";
}
var Sd = "DialogTitleWarning", [yE, Ed] = am(Sd, {
  contentName: pr,
  titleName: Fs,
  docsSlug: "dialog"
}), _g = ({ titleId: e }) => {
  const t = Ed(Sd), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return h.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, Og = "DialogDescriptionWarning", kg = ({ contentRef: e, descriptionId: t }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Ed(Og).contentName}}.`;
  return h.useEffect(() => {
    var i;
    const o = (i = e.current) == null ? void 0 : i.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(r));
  }, [r, e, t]), null;
}, Tg = dd, Ig = pd, Rd = hd, Md = md, Pd = yd, Nd = wd, Ag = Cd;
const Lg = Tg, $g = Ig, Dd = Ue(({ className: e, ...t }, n) => /* @__PURE__ */ R(
  Rd,
  {
    ref: n,
    className: ie(
      `
              univer-bg-black/80 univer-fixed univer-inset-0 univer-z-[1080]
              data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0
              data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
            `,
      e
    ),
    ...t
  }
));
Dd.displayName = Rd.displayName;
const _d = Ue(({ className: e, children: t, closable: n = !0, onClickClose: r, ...o }, i) => /* @__PURE__ */ me($g, { children: [
  /* @__PURE__ */ R(Dd, {}),
  /* @__PURE__ */ me(
    Md,
    {
      ref: i,
      className: ie(
        `
                  data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0
                  data-[state=open]:univer-zoom-in-95 data-[state=open]:univer-slide-in-from-left-1/2
                  data-[state=open]:univer-slide-in-from-top-[48%]
                  data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
                  data-[state=closed]:univer-zoom-out-95 data-[state=closed]:univer-slide-out-to-left-1/2
                  data-[state=closed]:univer-slide-out-to-top-[48%]
                  univer-fixed univer-left-1/2 univer-top-1/2 univer-z-[1080] univer-box-border univer-grid
                  univer-w-full univer-max-w-lg -univer-translate-x-1/2 -univer-translate-y-1/2 univer-gap-4
                  univer-bg-white univer-p-4 univer-text-gray-500 univer-shadow-md univer-duration-200
                  sm:!univer-rounded-lg
                  dark:!univer-bg-gray-700 dark:!univer-text-gray-400
                `,
        kt,
        e
      ),
      ...o,
      children: [
        t,
        n && /* @__PURE__ */ me(
          Ag,
          {
            className: "univer-absolute univer-right-4 univer-top-4 univer-size-6 univer-cursor-pointer univer-rounded-sm univer-border-none univer-bg-transparent univer-p-0 univer-transition-opacity hover:univer-opacity-100 disabled:univer-pointer-events-none",
            onClick: r,
            children: [
              /* @__PURE__ */ R(ji, { className: "univer-size-4 univer-text-gray-400" }),
              /* @__PURE__ */ R("span", { className: "univer-sr-only", children: "Close" })
            ]
          }
        )
      ]
    }
  )
] }));
_d.displayName = Md.displayName;
const Od = ({
  className: e,
  ...t
}) => /* @__PURE__ */ R(
  "div",
  {
    className: ie(
      `
              univer-flex univer-flex-col univer-space-y-1.5 univer-text-center
              sm:!univer-text-left
            `,
      e
    ),
    ...t
  }
);
Od.displayName = "DialogHeader";
const kd = ({
  className: e,
  ...t
}) => /* @__PURE__ */ R(
  "div",
  {
    className: ie(
      `
              univer-flex univer-flex-col-reverse
              sm:!univer-flex-row sm:!univer-justify-end sm:!univer-space-x-2
            `,
      e
    ),
    ...t
  }
);
kd.displayName = "DialogFooter";
const Td = Ue(({ className: e, ...t }, n) => /* @__PURE__ */ R(
  Pd,
  {
    ref: n,
    className: ie(
      `
              univer-my-0 univer-text-lg univer-font-semibold univer-leading-none univer-tracking-tight
              univer-text-gray-900
              dark:!univer-text-white
            `,
      e
    ),
    ...t
  }
));
Td.displayName = Pd.displayName;
const Id = Ue(({ className: e, ...t }, n) => /* @__PURE__ */ R(
  Nd,
  {
    ref: n,
    className: ie("univer-text-sm univer-text-gray-500", e),
    ...t
  }
));
Id.displayName = Nd.displayName;
function zg(e = {}) {
  const t = dt(() => {
    const { innerWidth: d, innerHeight: v } = window;
    return {
      x: Math.max(0, (d - 0) / 2),
      y: Math.max(0, (v - 0) / 2)
    };
  }, []), { defaultPosition: n = t(), enabled: r = !1 } = e, [o, i] = De(n), [a, s] = De(!1), l = ye(null), c = ye({ x: 0, y: 0 }), f = ye({ x: 0, y: 0 }), u = ye(!1);
  qe(() => {
    if (!l.current || u.current || e.defaultPosition) return;
    const { width: d, height: v } = l.current.getBoundingClientRect(), { innerWidth: p, innerHeight: b } = window, C = Math.max(0, (p - d) / 2), x = Math.max(0, (b - v) / 2);
    i({ x: C, y: x }), c.current = { x: C, y: x }, u.current = !0;
  }, [e.defaultPosition]);
  const y = dt((d, v) => {
    if (!l.current) return { x: d, y: v };
    const p = l.current.getBoundingClientRect(), { clientWidth: b, clientHeight: C } = document.documentElement;
    let x = c.current.x + (d - f.current.x), S = c.current.y + (v - f.current.y);
    return x < 0 && (x = 0), S < 0 && (S = 0), x + p.width > b && (x = b - p.width), S + p.height > C && (S = C - p.height), { x, y: S };
  }, []), m = dt((d) => {
    r && (d.preventDefault(), d.stopPropagation(), c.current = { ...o }, f.current = { x: d.clientX, y: d.clientY }, s(!0), document.body.style.userSelect = "none");
  }, [r, o]), g = dt((d) => {
    if (!a) return;
    d.preventDefault(), d.stopPropagation();
    const v = y(d.clientX, d.clientY);
    i(v);
  }, [a, y]), w = dt(() => {
    s(!1), document.body.style.userSelect = "";
  }, []);
  return qe(() => {
    if (r)
      return document.addEventListener("mousemove", g), document.addEventListener("mouseup", w), () => {
        document.removeEventListener("mousemove", g), document.removeEventListener("mouseup", w);
      };
  }, [r, g, w]), {
    position: o,
    isDragging: a,
    elementRef: l,
    setElementRef: (d) => {
      if (l.current = d, d && !u.current && !e.defaultPosition) {
        const { width: v, height: p } = d.getBoundingClientRect(), { innerWidth: b, innerHeight: C } = window, x = Math.max(0, (b - v) / 2), S = Math.max(0, (C - p) / 2);
        i({ x, y: S }), c.current = { x, y: S }, u.current = !0;
      }
    },
    handleMouseDown: m
  };
}
function Ad(e) {
  var A, L, N, $;
  const {
    className: t,
    children: n,
    style: r,
    open: o = !1,
    title: i,
    width: a,
    draggable: s = !1,
    defaultPosition: l,
    destroyOnClose: c = !1,
    footer: f,
    mask: u = !0,
    keyboard: y = !0,
    closable: m = !0,
    maskClosable: g = !0,
    showOk: w,
    showCancel: d,
    onOpenChange: v,
    onClose: p,
    onOk: b,
    onCancel: C
  } = e, { locale: x } = Jn(Tn), { position: S, isDragging: E, setElementRef: M, handleMouseDown: _ } = zg({ defaultPosition: l, enabled: s }), P = f != null ? f : w || d ? /* @__PURE__ */ me("div", { className: "univer-flex univer-justify-end univer-gap-2", children: [
    d && /* @__PURE__ */ R(fr, { onClick: C, children: (L = (A = x == null ? void 0 : x.Confirm) == null ? void 0 : A.cancel) != null ? L : "Cancel" }),
    w && /* @__PURE__ */ R(fr, { variant: "primary", onClick: b, children: ($ = (N = x == null ? void 0 : x.Confirm) == null ? void 0 : N.confirm) != null ? $ : "OK" })
  ] }) : null, k = dt((T) => {
    T && s && M(T);
  }, [s, M]), I = dt((T) => {
    !g && !T || (v == null || v(T), T || p == null || p());
  }, [p, v]);
  function H() {
    v == null || v(!1), p == null || p();
  }
  return /* @__PURE__ */ R(
    Lg,
    {
      open: o,
      onOpenChange: I,
      modal: u !== !1,
      children: /* @__PURE__ */ me(
        _d,
        {
          ref: k,
          className: ie(t, {
            "!univer-animate-none": s
          }),
          style: {
            ...r,
            width: a ? typeof a == "number" ? `${a}px` : a : void 0,
            maxWidth: a ? "initial" : void 0,
            ...s ? {
              position: "absolute",
              margin: 0,
              left: 0,
              top: 0,
              transform: `translate(${S.x}px, ${S.y}px)`,
              transition: E ? "none" : void 0,
              cursor: E ? "grabbing" : void 0
            } : {}
          },
          closable: m,
          onClickClose: H,
          children: [
            /* @__PURE__ */ me(
              Od,
              {
                className: ie({
                  "!univer-hidden": !i
                }),
                "data-drag-handle": s ? "true" : void 0,
                style: {
                  cursor: s ? "grab" : void 0,
                  userSelect: s ? "none" : void 0,
                  touchAction: s ? "none" : void 0
                },
                onMouseDown: s ? _ : void 0,
                children: [
                  /* @__PURE__ */ R(Td, { children: i }),
                  /* @__PURE__ */ R(Id, { className: "univer-hidden" })
                ]
              }
            ),
            n,
            P && /* @__PURE__ */ R(kd, { children: P })
          ]
        }
      )
    }
  );
}
const Si = (e, t, n) => {
  t = t / 100, n = n / 100;
  const r = n * t, o = r * (1 - Math.abs(e / 60 % 2 - 1)), i = n - r;
  let a = 0, s = 0, l = 0;
  return e >= 0 && e < 60 ? (a = r, s = o, l = 0) : e >= 60 && e < 120 ? (a = o, s = r, l = 0) : e >= 120 && e < 180 ? (a = 0, s = r, l = o) : e >= 180 && e < 240 ? (a = 0, s = o, l = r) : e >= 240 && e < 300 ? (a = o, s = 0, l = r) : e >= 300 && e < 360 && (a = r, s = 0, l = o), [
    Math.round((a + i) * 255),
    Math.round((s + i) * 255),
    Math.round((l + i) * 255)
  ];
}, Ld = (e, t, n) => {
  const r = (o) => o.toString(16).padStart(2, "0");
  return `#${r(e)}${r(t)}${r(n)}`;
}, $d = (e, t, n) => {
  e /= 255, t /= 255, n /= 255;
  const r = Math.max(e, t, n), o = Math.min(e, t, n), i = r - o;
  let a = 0, s = 0;
  const l = r;
  return r !== 0 && (s = i / r), i !== 0 && (r === e ? a = (t - n) / i + (t < n ? 6 : 0) : r === t ? a = (n - e) / i + 2 : r === n && (a = (e - t) / i + 4), a *= 60), [
    a,
    s * 100,
    l * 100
  ];
}, Ws = (e) => {
  e.length === 4 && (e = `#${e.slice(1).split("").map((o) => o + o).join("")}`);
  const [t, n, r] = e.match(/\w\w/g).map((o) => Number.parseInt(o, 16));
  return $d(t, n, r);
}, Ei = (e, t, n) => {
  const [r, o, i] = Si(e, t, n);
  return Ld(r, o, i);
};
function Fg({ hsv: e, onChange: t }) {
  const [n, r] = De(""), o = lt(() => Ei(e[0], e[1], e[2]), [e]);
  qe(() => {
    r(o.replace(/^#/, ""));
  }, [o]);
  const i = (l) => /^[0-9A-Fa-f]{6}$/.test(l), a = (l) => {
    const c = l.target.value.trim();
    if (!(c.length > 6) && !(c !== "" && !/^[0-9A-Fa-f]*$/.test(c)) && (r(c), i(c))) {
      const f = Ws(c);
      f && t && t(...f);
    }
  }, s = () => {
    i(n) || r(o.replace(/^#/, ""));
  };
  return /* @__PURE__ */ me(dr, { children: [
    /* @__PURE__ */ R(
      "input",
      {
        className: ie("univer-w-full univer-px-2 !univer-pl-4 univer-uppercase focus:univer-border-primary-500 focus:univer-outline-none dark:!univer-text-white", kt),
        value: n,
        onChange: a,
        onBlur: s,
        maxLength: 6,
        spellCheck: !1
      }
    ),
    /* @__PURE__ */ R(
      "span",
      {
        className: "univer-absolute univer-left-1.5 univer-top-1/2 -univer-translate-y-1/2 univer-text-sm univer-text-gray-400",
        children: "#"
      }
    )
  ] });
}
function Hg({ hsv: e, onChange: t }) {
  const [n, r] = De({ r: 0, g: 0, b: 0 });
  qe(() => {
    const [a, s, l] = Si(e[0], e[1], e[2]);
    r({
      r: Math.round(a),
      g: Math.round(s),
      b: Math.round(l)
    });
  }, [e]);
  const o = (a, s) => {
    if (s !== "" && !/^\d*$/.test(s)) return;
    const l = s === "" ? 0 : Number.parseInt(s, 10);
    if (l > 255) return;
    const c = { ...n, [a]: l };
    if (r(c), t) {
      const f = $d(c.r, c.g, c.b);
      t(...f);
    }
  }, i = () => {
    const [a, s, l] = Si(e[0], e[1], e[2]);
    r({
      r: Math.round(a),
      g: Math.round(s),
      b: Math.round(l)
    });
  };
  return /* @__PURE__ */ me(
    "div",
    {
      className: "univer-flex univer-items-center univer-gap-2 [&>input]:univer-w-11 [&>input]:univer-border-gray-200 [&>input]:focus:univer-border-primary-500 dark:[&>input]:!univer-border-gray-600 dark:[&>input]:!univer-text-white",
      children: [
        /* @__PURE__ */ R(
          "input",
          {
            value: n.r,
            onChange: (a) => o("r", a.target.value),
            onBlur: i,
            maxLength: 3
          }
        ),
        /* @__PURE__ */ R(
          "input",
          {
            value: n.g,
            onChange: (a) => o("g", a.target.value),
            onBlur: i,
            maxLength: 3
          }
        ),
        /* @__PURE__ */ R(
          "input",
          {
            value: n.b,
            onChange: (a) => o("b", a.target.value),
            onBlur: i,
            maxLength: 3
          }
        )
      ]
    }
  );
}
function Wg({ hsv: e, onChange: t }) {
  return /* @__PURE__ */ R(
    "div",
    {
      className: "dark:![&_input]:univer-border-gray-600 dark:![&_input]:univer-text-white univer-flex univer-gap-2 [&_input]:univer-box-border [&_input]:univer-flex [&_input]:univer-h-7 [&_input]:univer-items-center [&_input]:univer-rounded [&_input]:univer-border [&_input]:univer-border-solid [&_input]:univer-border-gray-200 [&_input]:univer-bg-transparent [&_input]:univer-px-1.5 [&_input]:univer-text-sm [&_input]:univer-text-gray-700 [&_input]:univer-outline-none",
      children: /* @__PURE__ */ me("div", { className: "univer-relative univer-flex univer-flex-1 univer-gap-2", children: [
        /* @__PURE__ */ R(Fg, { hsv: e, onChange: t }),
        /* @__PURE__ */ R(Hg, { hsv: e, onChange: t })
      ] })
    }
  );
}
const Bg = [
  ["#FFFFFF", "#E1EFFE", "#FDE8E8", "#FEECDC", "#FFF4B9", "#DEF7EC", "#D5F5F6", "#EDEBFE", "#FCE8F3"],
  ["#CDD0D8", "#A4CAFE", "#F8B4B4", "#FDBA8C", "#FAC815", "#84E1BC", "#7EDCE2", "#CABFFD", "#F8B4D9"],
  ["#979DAC", "#3F83F8", "#F05252", "#FF5A1F", "#D49D0F", "#0DA471", "#0694A2", "#9061F9", "#E74694"],
  ["#414657", "#1A56DB", "#C81E1E", "#B43403", "#9A6D15", "#046C4E", "#036672", "#6C2BD9", "#BF125D"],
  ["#000000", "#233876", "#771D1D", "#771D1D", "#634312", "#014737", "#014451", "#4A1D96", "#751A3D"]
];
function jg({ hsv: e, onChange: t }) {
  const n = dt((o) => {
    const [i, a, s] = Ws(o);
    t(i, a, s);
  }, [t]), r = Ei(e[0], e[1], e[2]);
  return /* @__PURE__ */ R(
    "div",
    {
      "data-u-comp": "color-picker-presets",
      className: "univer-grid univer-content-center univer-gap-2",
      children: Bg.map((o, i) => /* @__PURE__ */ R(
        "div",
        {
          className: "univer-grid univer-grid-flow-col univer-items-center univer-justify-between univer-gap-2",
          children: o.map((a, s) => /* @__PURE__ */ R(
            "button",
            {
              type: "button",
              className: ie("univer-box-border univer-h-5 univer-w-5 univer-cursor-pointer univer-rounded-full univer-border univer-border-solid univer-border-transparent univer-bg-gray-300 univer-transition-shadow", {
                "univer-ring-2 univer-ring-offset-2 univer-ring-offset-white dark:!univer-ring-primary-600 dark:!univer-ring-offset-gray-600": a.toUpperCase() === r.toUpperCase(),
                "!univer-border-gray-200": i === 0 && s === 0
              }),
              style: { backgroundColor: a },
              onClick: () => n(a)
            },
            s
          ))
        },
        i
      ))
    }
  );
}
function Vg({ hsv: e, onChange: t, onChanged: n }) {
  const r = ye(null), o = ye(null), [i, a] = De(!1);
  qe(() => {
    const u = r.current;
    if (!u) return;
    const y = u.getContext("2d");
    if (!y) return;
    const m = y.createLinearGradient(0, 0, u.width, 0);
    m.addColorStop(0, `hsl(${e[0]}, 0%, 50%)`), m.addColorStop(1, `hsl(${e[0]}, 100%, 50%)`), y.fillStyle = m, y.fillRect(0, 0, u.width, u.height);
    const g = y.createLinearGradient(0, 0, 0, u.height);
    g.addColorStop(0, "rgba(255, 255, 255, 0)"), g.addColorStop(1, "rgba(0, 0, 0, 1)"), y.fillStyle = g, y.fillRect(0, 0, u.width, u.height);
  }, [e]);
  const s = (u) => {
    u.stopPropagation();
    const y = r.current;
    if (!y) return;
    const m = y.getBoundingClientRect(), g = Math.max(0, Math.min(u.clientX - m.left, m.width)), w = Math.max(0, Math.min(u.clientY - m.top, m.height)), d = g / m.width * 100, v = 100 - w / m.height * 100;
    t(e[0], d, v);
  }, l = dt(() => {
    a(!1);
  }, [e]);
  function c() {
    n == null || n(e[0], e[1], e[2]);
  }
  qe(() => {
    var u;
    return (u = o.current) == null || u.addEventListener("mouseup", c), window.addEventListener("pointerup", l), window.addEventListener("mouseup", l), () => {
      var y;
      (y = o.current) == null || y.removeEventListener("mouseup", c), window.removeEventListener("pointerup", l), window.removeEventListener("mouseup", l);
    };
  }, [e]);
  const f = () => {
    var v, p, b, C;
    const m = (p = (v = o.current) == null ? void 0 : v.clientWidth) != null ? p : 0, g = (C = (b = o.current) == null ? void 0 : b.clientHeight) != null ? C : 0, w = e[1] / 100 * m - 8, d = (100 - e[2]) / 100 * g - 8;
    return {
      transform: `translate(${w}px, ${d}px)`,
      transition: i ? "none" : "transform 0.1s ease-out"
    };
  };
  return qe(() => {
    const u = () => {
      a(!1);
    };
    return window.addEventListener("pointerup", u), window.addEventListener("mouseup", u), () => {
      window.removeEventListener("pointerup", u), window.removeEventListener("mouseup", u);
    };
  }, []), /* @__PURE__ */ me(
    "div",
    {
      "data-u-comp": "color-picker-spectrum",
      ref: o,
      className: "univer-relative univer-overflow-hidden",
      children: [
        /* @__PURE__ */ R(
          "canvas",
          {
            ref: r,
            className: "univer-h-full univer-w-full univer-cursor-crosshair univer-rounded",
            onPointerDown: (u) => {
              a(!0), s(u);
            },
            onPointerMove: (u) => i && s(u)
          }
        ),
        /* @__PURE__ */ R(
          "div",
          {
            className: "univer-pointer-events-none univer-absolute univer-left-0 univer-top-0 univer-size-4 univer-rounded-full univer-border-2 univer-border-white univer-shadow-md univer-ring-2 univer-ring-white univer-will-change-transform",
            style: f()
          }
        )
      ]
    }
  );
}
function qg({ hsv: e, onChange: t, onChanged: n }) {
  const [r, o] = De(!1), i = ye(null), a = ye(null), s = lt(() => {
    var y, m;
    return (m = (y = a.current) == null ? void 0 : y.clientWidth) != null ? m : 0;
  }, []), l = dt((y) => {
    const m = i.current;
    if (!m) return;
    const g = m.getBoundingClientRect(), w = g.width - s, d = Math.max(0, Math.min(y - g.left, w)), v = Math.round(d / w * 360);
    t(v, e[1], e[2]);
  }, [e, s, t]), c = dt((y) => {
    y.stopPropagation(), r && l(y.clientX);
  }, [r, l]), f = dt(() => {
    o(!1), n == null || n(e[0], e[1], e[2]);
  }, [e, n]);
  return qe(() => (r && (window.addEventListener("pointermove", c), window.addEventListener("pointerup", f), window.addEventListener("mouseup", f)), () => {
    window.removeEventListener("pointermove", c), window.removeEventListener("pointerup", f), window.removeEventListener("mouseup", f);
  }), [r, c, f]), /* @__PURE__ */ R(
    "div",
    {
      "data-u-comp": "color-picker-hue-slider",
      className: "univer-relative univer-w-full univer-select-none",
      children: /* @__PURE__ */ R(
        "div",
        {
          ref: i,
          className: "univer-relative univer-h-2 univer-w-full univer-cursor-pointer univer-rounded-full univer-shadow-inner",
          style: {
            background: `linear-gradient(to right,
                        hsl(0, 100%, 50%),
                        hsl(60, 100%, 50%),
                        hsl(120, 100%, 50%),
                        hsl(180, 100%, 50%),
                        hsl(240, 100%, 50%),
                        hsl(300, 100%, 50%),
                        hsl(360, 100%, 50%))`
          },
          onPointerDown: (y) => {
            o(!0), l(y.clientX);
          },
          children: /* @__PURE__ */ R(
            "div",
            {
              ref: a,
              className: "univer-absolute univer-top-1/2 univer-box-border univer-size-2 univer-rounded-full univer-bg-transparent univer-shadow-md univer-ring-2 univer-ring-white univer-transition-transform univer-duration-75 univer-will-change-transform",
              style: {
                left: (() => {
                  var m;
                  return `${Math.min(Math.max(e[0], 0), 360) / 360 * (100 - s / ((m = i.current) == null ? void 0 : m.clientWidth) * 100)}%`;
                })(),
                transform: "translateY(-50%)",
                transition: r ? "none" : "all 0.1s ease-out"
              }
            }
          )
        }
      )
    }
  );
}
const Ug = Wi(Vg), Gg = Wi(qg), Kg = Wi(Wg), Yg = Wi(jg);
function bE({ format: e = "hex", value: t = "#000000", onChange: n }) {
  if (!Is) return null;
  const { locale: r } = Jn(Tn), [o, i] = De([0, 100, 100]), [a, s] = De(!1), l = dt((y, m, g) => Si(y, m, g), []);
  qe(() => {
    try {
      if (e === "hex") {
        const [y, m, g] = t ? Ws(t) : o;
        i([y, m, g]);
      }
    } catch (y) {
      console.error("Invalid value:", y);
    }
  }, [t]);
  function c(y, m, g) {
    i([y, m, g]);
  }
  function f(y, m, g) {
    const [w, d, v] = l(y, m, g);
    if (e === "hex") {
      const p = Ld(w, d, v);
      n == null || n(p);
    }
  }
  function u() {
    const [y, m, g] = o, w = Ei(y, m, g);
    n == null || n(w), s(!1);
  }
  return /* @__PURE__ */ me(
    "div",
    {
      "data-u-comp": "color-picker",
      className: "univer-cursor-default univer-space-y-2 univer-rounded-lg univer-bg-white dark:!univer-bg-gray-700",
      onClick: (y) => y.stopPropagation(),
      children: [
        /* @__PURE__ */ R(
          Yg,
          {
            hsv: o,
            onChange: (y, m, g) => {
              c(y, m, g), f(y, m, g);
            }
          }
        ),
        /* @__PURE__ */ R("div", { className: "univer-flex univer-h-7 univer-items-center", children: /* @__PURE__ */ R(
          "a",
          {
            className: "univer-cursor-pointer univer-gap-2 univer-text-sm univer-text-gray-900 univer-transition-opacity hover:univer-opacity-80 dark:!univer-text-white",
            onClick: () => s(!0),
            children: r == null ? void 0 : r.ColorPicker.more
          }
        ) }),
        /* @__PURE__ */ R(
          Ad,
          {
            className: "!univer-w-fit !univer-p-2.5",
            closable: !1,
            maskClosable: !1,
            open: a,
            onOpenChange: s,
            children: /* @__PURE__ */ me("div", { className: "univer-grid univer-w-64 univer-gap-2", children: [
              /* @__PURE__ */ R(
                Ug,
                {
                  hsv: o,
                  onChange: c
                }
              ),
              /* @__PURE__ */ me("div", { className: "univer-flex univer-items-center univer-gap-2", children: [
                /* @__PURE__ */ R(
                  "div",
                  {
                    className: "univer-size-6 univer-flex-shrink-0 univer-rounded-sm",
                    style: {
                      backgroundColor: Ei(...o)
                    }
                  }
                ),
                /* @__PURE__ */ R(
                  Gg,
                  {
                    hsv: o,
                    onChange: c
                  }
                )
              ] }),
              /* @__PURE__ */ R(
                Kg,
                {
                  hsv: o,
                  onChange: c
                }
              ),
              /* @__PURE__ */ me("footer", { className: "univer-flex univer-items-center univer-justify-end univer-gap-2", children: [
                /* @__PURE__ */ R(fr, { onClick: () => s(!1), children: r == null ? void 0 : r.ColorPicker.cancel }),
                /* @__PURE__ */ R(fr, { variant: "primary", onClick: u, children: r == null ? void 0 : r.ColorPicker.confirm })
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function Xg(e) {
  const { locale: t, cancelText: n, confirmText: r, onClose: o, onConfirm: i, closable: a = !0 } = e;
  return /* @__PURE__ */ me("footer", { className: "univer-flex univer-items-center univer-justify-end univer-gap-2", children: [
    a && /* @__PURE__ */ R(fr, { onClick: o, children: n != null ? n : t == null ? void 0 : t.Confirm.cancel }),
    /* @__PURE__ */ R(fr, { variant: "primary", onClick: i, children: r != null ? r : t == null ? void 0 : t.Confirm.confirm })
  ] });
}
function wE(e) {
  const { children: t, visible: n = !1, title: r, cancelText: o, confirmText: i, width: a, onClose: s, onConfirm: l, closable: c = !0 } = e, { locale: f } = Jn(Tn);
  return /* @__PURE__ */ R(
    Ad,
    {
      open: n,
      title: r,
      maskClosable: !1,
      footer: /* @__PURE__ */ R(
        Xg,
        {
          locale: f,
          cancelText: o,
          confirmText: i,
          onClose: s,
          onConfirm: l,
          closable: c
        }
      ),
      onClose: s,
      width: a,
      closable: c,
      children: t
    }
  );
}
const Zg = ["top", "right", "bottom", "left"], Zn = Math.min, jt = Math.max, Ri = Math.round, ti = Math.floor, yn = (e) => ({
  x: e,
  y: e
}), Qg = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Jg = {
  start: "end",
  end: "start"
};
function es(e, t, n) {
  return jt(e, Zn(t, n));
}
function _n(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function On(e) {
  return e.split("-")[0];
}
function Vr(e) {
  return e.split("-")[1];
}
function Bs(e) {
  return e === "x" ? "y" : "x";
}
function js(e) {
  return e === "y" ? "height" : "width";
}
const e0 = /* @__PURE__ */ new Set(["top", "bottom"]);
function gn(e) {
  return e0.has(On(e)) ? "y" : "x";
}
function Vs(e) {
  return Bs(gn(e));
}
function t0(e, t, n) {
  n === void 0 && (n = !1);
  const r = Vr(e), o = Vs(e), i = js(o);
  let a = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (a = Mi(a)), [a, Mi(a)];
}
function n0(e) {
  const t = Mi(e);
  return [ts(e), t, ts(t)];
}
function ts(e) {
  return e.replace(/start|end/g, (t) => Jg[t]);
}
const Uu = ["left", "right"], Gu = ["right", "left"], r0 = ["top", "bottom"], o0 = ["bottom", "top"];
function i0(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Gu : Uu : t ? Uu : Gu;
    case "left":
    case "right":
      return t ? r0 : o0;
    default:
      return [];
  }
}
function a0(e, t, n, r) {
  const o = Vr(e);
  let i = i0(On(e), n === "start", r);
  return o && (i = i.map((a) => a + "-" + o), t && (i = i.concat(i.map(ts)))), i;
}
function Mi(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Qg[t]);
}
function s0(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function zd(e) {
  return typeof e != "number" ? s0(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Pi(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: o
  } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n
  };
}
function Ku(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const i = gn(t), a = Vs(t), s = js(a), l = On(t), c = i === "y", f = r.x + r.width / 2 - o.width / 2, u = r.y + r.height / 2 - o.height / 2, y = r[s] / 2 - o[s] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: f,
        y: r.y - o.height
      };
      break;
    case "bottom":
      m = {
        x: f,
        y: r.y + r.height
      };
      break;
    case "right":
      m = {
        x: r.x + r.width,
        y: u
      };
      break;
    case "left":
      m = {
        x: r.x - o.width,
        y: u
      };
      break;
    default:
      m = {
        x: r.x,
        y: r.y
      };
  }
  switch (Vr(t)) {
    case "start":
      m[a] -= y * (n && c ? -1 : 1);
      break;
    case "end":
      m[a] += y * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const u0 = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: a
  } = n, s = i.filter(Boolean), l = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let c = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: f,
    y: u
  } = Ku(c, r, l), y = r, m = {}, g = 0;
  for (let w = 0; w < s.length; w++) {
    const {
      name: d,
      fn: v
    } = s[w], {
      x: p,
      y: b,
      data: C,
      reset: x
    } = await v({
      x: f,
      y: u,
      initialPlacement: r,
      placement: y,
      strategy: o,
      middlewareData: m,
      rects: c,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    f = p != null ? p : f, u = b != null ? b : u, m = {
      ...m,
      [d]: {
        ...m[d],
        ...C
      }
    }, x && g <= 50 && (g++, typeof x == "object" && (x.placement && (y = x.placement), x.rects && (c = x.rects === !0 ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : x.rects), {
      x: f,
      y: u
    } = Ku(c, y, l)), w = -1);
  }
  return {
    x: f,
    y: u,
    placement: y,
    strategy: o,
    middlewareData: m
  };
};
async function Co(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: i,
    rects: a,
    elements: s,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: u = "floating",
    altBoundary: y = !1,
    padding: m = 0
  } = _n(t, e), g = zd(m), d = s[y ? u === "floating" ? "reference" : "floating" : u], v = Pi(await i.getClippingRect({
    element: (n = await (i.isElement == null ? void 0 : i.isElement(d))) == null || n ? d : d.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(s.floating)),
    boundary: c,
    rootBoundary: f,
    strategy: l
  })), p = u === "floating" ? {
    x: r,
    y: o,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, b = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(s.floating)), C = await (i.isElement == null ? void 0 : i.isElement(b)) ? await (i.getScale == null ? void 0 : i.getScale(b)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, x = Pi(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: p,
    offsetParent: b,
    strategy: l
  }) : p);
  return {
    top: (v.top - x.top + g.top) / C.y,
    bottom: (x.bottom - v.bottom + g.bottom) / C.y,
    left: (v.left - x.left + g.left) / C.x,
    right: (x.right - v.right + g.right) / C.x
  };
}
const l0 = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: o,
      rects: i,
      platform: a,
      elements: s,
      middlewareData: l
    } = t, {
      element: c,
      padding: f = 0
    } = _n(e, t) || {};
    if (c == null)
      return {};
    const u = zd(f), y = {
      x: n,
      y: r
    }, m = Vs(o), g = js(m), w = await a.getDimensions(c), d = m === "y", v = d ? "top" : "left", p = d ? "bottom" : "right", b = d ? "clientHeight" : "clientWidth", C = i.reference[g] + i.reference[m] - y[m] - i.floating[g], x = y[m] - i.reference[m], S = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c));
    let E = S ? S[b] : 0;
    (!E || !await (a.isElement == null ? void 0 : a.isElement(S))) && (E = s.floating[b] || i.floating[g]);
    const M = C / 2 - x / 2, _ = E / 2 - w[g] / 2 - 1, P = Zn(u[v], _), k = Zn(u[p], _), I = P, H = E - w[g] - k, A = E / 2 - w[g] / 2 + M, L = es(I, A, H), N = !l.arrow && Vr(o) != null && A !== L && i.reference[g] / 2 - (A < I ? P : k) - w[g] / 2 < 0, $ = N ? A < I ? A - I : A - H : 0;
    return {
      [m]: y[m] + $,
      data: {
        [m]: L,
        centerOffset: A - L - $,
        ...N && {
          alignmentOffset: $
        }
      },
      reset: N
    };
  }
}), c0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        middlewareData: i,
        rects: a,
        initialPlacement: s,
        platform: l,
        elements: c
      } = t, {
        mainAxis: f = !0,
        crossAxis: u = !0,
        fallbackPlacements: y,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: g = "none",
        flipAlignment: w = !0,
        ...d
      } = _n(e, t);
      if ((n = i.arrow) != null && n.alignmentOffset)
        return {};
      const v = On(o), p = gn(s), b = On(s) === s, C = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = y || (b || !w ? [Mi(s)] : n0(s)), S = g !== "none";
      !y && S && x.push(...a0(s, w, g, C));
      const E = [s, ...x], M = await Co(t, d), _ = [];
      let P = ((r = i.flip) == null ? void 0 : r.overflows) || [];
      if (f && _.push(M[v]), u) {
        const A = t0(o, a, C);
        _.push(M[A[0]], M[A[1]]);
      }
      if (P = [...P, {
        placement: o,
        overflows: _
      }], !_.every((A) => A <= 0)) {
        var k, I;
        const A = (((k = i.flip) == null ? void 0 : k.index) || 0) + 1, L = E[A];
        if (L && (!(u === "alignment" ? p !== gn(L) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        P.every((T) => gn(T.placement) === p ? T.overflows[0] > 0 : !0)))
          return {
            data: {
              index: A,
              overflows: P
            },
            reset: {
              placement: L
            }
          };
        let N = (I = P.filter(($) => $.overflows[0] <= 0).sort(($, T) => $.overflows[1] - T.overflows[1])[0]) == null ? void 0 : I.placement;
        if (!N)
          switch (m) {
            case "bestFit": {
              var H;
              const $ = (H = P.filter((T) => {
                if (S) {
                  const z = gn(T.placement);
                  return z === p || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  z === "y";
                }
                return !0;
              }).map((T) => [T.placement, T.overflows.filter((z) => z > 0).reduce((z, B) => z + B, 0)]).sort((T, z) => T[1] - z[1])[0]) == null ? void 0 : H[0];
              $ && (N = $);
              break;
            }
            case "initialPlacement":
              N = s;
              break;
          }
        if (o !== N)
          return {
            reset: {
              placement: N
            }
          };
      }
      return {};
    }
  };
};
function Yu(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Xu(e) {
  return Zg.some((t) => e[t] >= 0);
}
const d0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n
      } = t, {
        strategy: r = "referenceHidden",
        ...o
      } = _n(e, t);
      switch (r) {
        case "referenceHidden": {
          const i = await Co(t, {
            ...o,
            elementContext: "reference"
          }), a = Yu(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Xu(a)
            }
          };
        }
        case "escaped": {
          const i = await Co(t, {
            ...o,
            altBoundary: !0
          }), a = Yu(i, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Xu(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Fd = /* @__PURE__ */ new Set(["left", "top"]);
async function f0(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, i = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), a = On(n), s = Vr(n), l = gn(n) === "y", c = Fd.has(a) ? -1 : 1, f = i && l ? -1 : 1, u = _n(t, e);
  let {
    mainAxis: y,
    crossAxis: m,
    alignmentAxis: g
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return s && typeof g == "number" && (m = s === "end" ? g * -1 : g), l ? {
    x: m * f,
    y: y * c
  } : {
    x: y * c,
    y: m * f
  };
}
const v0 = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: o,
        y: i,
        placement: a,
        middlewareData: s
      } = t, l = await f0(t, e);
      return a === ((n = s.offset) == null ? void 0 : n.placement) && (r = s.arrow) != null && r.alignmentOffset ? {} : {
        x: o + l.x,
        y: i + l.y,
        data: {
          ...l,
          placement: a
        }
      };
    }
  };
}, p0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o
      } = t, {
        mainAxis: i = !0,
        crossAxis: a = !1,
        limiter: s = {
          fn: (d) => {
            let {
              x: v,
              y: p
            } = d;
            return {
              x: v,
              y: p
            };
          }
        },
        ...l
      } = _n(e, t), c = {
        x: n,
        y: r
      }, f = await Co(t, l), u = gn(On(o)), y = Bs(u);
      let m = c[y], g = c[u];
      if (i) {
        const d = y === "y" ? "top" : "left", v = y === "y" ? "bottom" : "right", p = m + f[d], b = m - f[v];
        m = es(p, m, b);
      }
      if (a) {
        const d = u === "y" ? "top" : "left", v = u === "y" ? "bottom" : "right", p = g + f[d], b = g - f[v];
        g = es(p, g, b);
      }
      const w = s.fn({
        ...t,
        [y]: m,
        [u]: g
      });
      return {
        ...w,
        data: {
          x: w.x - n,
          y: w.y - r,
          enabled: {
            [y]: i,
            [u]: a
          }
        }
      };
    }
  };
}, h0 = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        rects: i,
        middlewareData: a
      } = t, {
        offset: s = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = _n(e, t), f = {
        x: n,
        y: r
      }, u = gn(o), y = Bs(u);
      let m = f[y], g = f[u];
      const w = _n(s, t), d = typeof w == "number" ? {
        mainAxis: w,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...w
      };
      if (l) {
        const b = y === "y" ? "height" : "width", C = i.reference[y] - i.floating[b] + d.mainAxis, x = i.reference[y] + i.reference[b] - d.mainAxis;
        m < C ? m = C : m > x && (m = x);
      }
      if (c) {
        var v, p;
        const b = y === "y" ? "width" : "height", C = Fd.has(On(o)), x = i.reference[u] - i.floating[b] + (C && ((v = a.offset) == null ? void 0 : v[u]) || 0) + (C ? 0 : d.crossAxis), S = i.reference[u] + i.reference[b] + (C ? 0 : ((p = a.offset) == null ? void 0 : p[u]) || 0) - (C ? d.crossAxis : 0);
        g < x ? g = x : g > S && (g = S);
      }
      return {
        [y]: m,
        [u]: g
      };
    }
  };
}, m0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        rects: i,
        platform: a,
        elements: s
      } = t, {
        apply: l = () => {
        },
        ...c
      } = _n(e, t), f = await Co(t, c), u = On(o), y = Vr(o), m = gn(o) === "y", {
        width: g,
        height: w
      } = i.floating;
      let d, v;
      u === "top" || u === "bottom" ? (d = u, v = y === (await (a.isRTL == null ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (v = u, d = y === "end" ? "top" : "bottom");
      const p = w - f.top - f.bottom, b = g - f.left - f.right, C = Zn(w - f[d], p), x = Zn(g - f[v], b), S = !t.middlewareData.shift;
      let E = C, M = x;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (M = b), (r = t.middlewareData.shift) != null && r.enabled.y && (E = p), S && !y) {
        const P = jt(f.left, 0), k = jt(f.right, 0), I = jt(f.top, 0), H = jt(f.bottom, 0);
        m ? M = g - 2 * (P !== 0 || k !== 0 ? P + k : jt(f.left, f.right)) : E = w - 2 * (I !== 0 || H !== 0 ? I + H : jt(f.top, f.bottom));
      }
      await l({
        ...t,
        availableWidth: M,
        availableHeight: E
      });
      const _ = await a.getDimensions(s.floating);
      return g !== _.width || w !== _.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Ki() {
  return typeof window < "u";
}
function qr(e) {
  return Hd(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Vt(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Cn(e) {
  var t;
  return (t = (Hd(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Hd(e) {
  return Ki() ? e instanceof Node || e instanceof Vt(e).Node : !1;
}
function on(e) {
  return Ki() ? e instanceof Element || e instanceof Vt(e).Element : !1;
}
function wn(e) {
  return Ki() ? e instanceof HTMLElement || e instanceof Vt(e).HTMLElement : !1;
}
function Zu(e) {
  return !Ki() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Vt(e).ShadowRoot;
}
const g0 = /* @__PURE__ */ new Set(["inline", "contents"]);
function Io(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = an(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !g0.has(o);
}
const y0 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function b0(e) {
  return y0.has(qr(e));
}
const w0 = [":popover-open", ":modal"];
function Yi(e) {
  return w0.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const x0 = ["transform", "translate", "scale", "rotate", "perspective"], C0 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], S0 = ["paint", "layout", "strict", "content"];
function qs(e) {
  const t = Us(), n = on(e) ? an(e) : e;
  return x0.some((r) => n[r] ? n[r] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || C0.some((r) => (n.willChange || "").includes(r)) || S0.some((r) => (n.contain || "").includes(r));
}
function E0(e) {
  let t = Qn(e);
  for (; wn(t) && !$r(t); ) {
    if (qs(t))
      return t;
    if (Yi(t))
      return null;
    t = Qn(t);
  }
  return null;
}
function Us() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const R0 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function $r(e) {
  return R0.has(qr(e));
}
function an(e) {
  return Vt(e).getComputedStyle(e);
}
function Xi(e) {
  return on(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Qn(e) {
  if (qr(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Zu(e) && e.host || // Fallback.
    Cn(e)
  );
  return Zu(t) ? t.host : t;
}
function Wd(e) {
  const t = Qn(e);
  return $r(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : wn(t) && Io(t) ? t : Wd(t);
}
function So(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = Wd(e), i = o === ((r = e.ownerDocument) == null ? void 0 : r.body), a = Vt(o);
  if (i) {
    const s = ns(a);
    return t.concat(a, a.visualViewport || [], Io(o) ? o : [], s && n ? So(s) : []);
  }
  return t.concat(o, So(o, [], n));
}
function ns(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Bd(e) {
  const t = an(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = wn(e), i = o ? e.offsetWidth : n, a = o ? e.offsetHeight : r, s = Ri(n) !== i || Ri(r) !== a;
  return s && (n = i, r = a), {
    width: n,
    height: r,
    $: s
  };
}
function Gs(e) {
  return on(e) ? e : e.contextElement;
}
function Ar(e) {
  const t = Gs(e);
  if (!wn(t))
    return yn(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: i
  } = Bd(t);
  let a = (i ? Ri(n.width) : n.width) / r, s = (i ? Ri(n.height) : n.height) / o;
  return (!a || !Number.isFinite(a)) && (a = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: a,
    y: s
  };
}
const M0 = /* @__PURE__ */ yn(0);
function jd(e) {
  const t = Vt(e);
  return !Us() || !t.visualViewport ? M0 : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function P0(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== Vt(e) ? !1 : t;
}
function hr(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), i = Gs(e);
  let a = yn(1);
  t && (r ? on(r) && (a = Ar(r)) : a = Ar(e));
  const s = P0(i, n, r) ? jd(i) : yn(0);
  let l = (o.left + s.x) / a.x, c = (o.top + s.y) / a.y, f = o.width / a.x, u = o.height / a.y;
  if (i) {
    const y = Vt(i), m = r && on(r) ? Vt(r) : r;
    let g = y, w = ns(g);
    for (; w && r && m !== g; ) {
      const d = Ar(w), v = w.getBoundingClientRect(), p = an(w), b = v.left + (w.clientLeft + parseFloat(p.paddingLeft)) * d.x, C = v.top + (w.clientTop + parseFloat(p.paddingTop)) * d.y;
      l *= d.x, c *= d.y, f *= d.x, u *= d.y, l += b, c += C, g = Vt(w), w = ns(g);
    }
  }
  return Pi({
    width: f,
    height: u,
    x: l,
    y: c
  });
}
function Zi(e, t) {
  const n = Xi(e).scrollLeft;
  return t ? t.left + n : hr(Cn(e)).left + n;
}
function Vd(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - Zi(e, n), o = n.top + t.scrollTop;
  return {
    x: r,
    y: o
  };
}
function N0(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const i = o === "fixed", a = Cn(r), s = t ? Yi(t.floating) : !1;
  if (r === a || s && i)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = yn(1);
  const f = yn(0), u = wn(r);
  if ((u || !u && !i) && ((qr(r) !== "body" || Io(a)) && (l = Xi(r)), wn(r))) {
    const m = hr(r);
    c = Ar(r), f.x = m.x + r.clientLeft, f.y = m.y + r.clientTop;
  }
  const y = a && !u && !i ? Vd(a, l) : yn(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + f.x + y.x,
    y: n.y * c.y - l.scrollTop * c.y + f.y + y.y
  };
}
function D0(e) {
  return Array.from(e.getClientRects());
}
function _0(e) {
  const t = Cn(e), n = Xi(e), r = e.ownerDocument.body, o = jt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), i = jt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let a = -n.scrollLeft + Zi(e);
  const s = -n.scrollTop;
  return an(r).direction === "rtl" && (a += jt(t.clientWidth, r.clientWidth) - o), {
    width: o,
    height: i,
    x: a,
    y: s
  };
}
const Qu = 25;
function O0(e, t) {
  const n = Vt(e), r = Cn(e), o = n.visualViewport;
  let i = r.clientWidth, a = r.clientHeight, s = 0, l = 0;
  if (o) {
    i = o.width, a = o.height;
    const f = Us();
    (!f || f && t === "fixed") && (s = o.offsetLeft, l = o.offsetTop);
  }
  const c = Zi(r);
  if (c <= 0) {
    const f = r.ownerDocument, u = f.body, y = getComputedStyle(u), m = f.compatMode === "CSS1Compat" && parseFloat(y.marginLeft) + parseFloat(y.marginRight) || 0, g = Math.abs(r.clientWidth - u.clientWidth - m);
    g <= Qu && (i -= g);
  } else c <= Qu && (i += c);
  return {
    width: i,
    height: a,
    x: s,
    y: l
  };
}
const k0 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function T0(e, t) {
  const n = hr(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, i = wn(e) ? Ar(e) : yn(1), a = e.clientWidth * i.x, s = e.clientHeight * i.y, l = o * i.x, c = r * i.y;
  return {
    width: a,
    height: s,
    x: l,
    y: c
  };
}
function Ju(e, t, n) {
  let r;
  if (t === "viewport")
    r = O0(e, n);
  else if (t === "document")
    r = _0(Cn(e));
  else if (on(t))
    r = T0(t, n);
  else {
    const o = jd(e);
    r = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Pi(r);
}
function qd(e, t) {
  const n = Qn(e);
  return n === t || !on(n) || $r(n) ? !1 : an(n).position === "fixed" || qd(n, t);
}
function I0(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = So(e, [], !1).filter((s) => on(s) && qr(s) !== "body"), o = null;
  const i = an(e).position === "fixed";
  let a = i ? Qn(e) : e;
  for (; on(a) && !$r(a); ) {
    const s = an(a), l = qs(a);
    !l && s.position === "fixed" && (o = null), (i ? !l && !o : !l && s.position === "static" && !!o && k0.has(o.position) || Io(a) && !l && qd(e, a)) ? r = r.filter((f) => f !== a) : o = s, a = Qn(a);
  }
  return t.set(e, r), r;
}
function A0(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const a = [...n === "clippingAncestors" ? Yi(t) ? [] : I0(t, this._c) : [].concat(n), r], s = a[0], l = a.reduce((c, f) => {
    const u = Ju(t, f, o);
    return c.top = jt(u.top, c.top), c.right = Zn(u.right, c.right), c.bottom = Zn(u.bottom, c.bottom), c.left = jt(u.left, c.left), c;
  }, Ju(t, s, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function L0(e) {
  const {
    width: t,
    height: n
  } = Bd(e);
  return {
    width: t,
    height: n
  };
}
function $0(e, t, n) {
  const r = wn(t), o = Cn(t), i = n === "fixed", a = hr(e, !0, i, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = yn(0);
  function c() {
    l.x = Zi(o);
  }
  if (r || !r && !i)
    if ((qr(t) !== "body" || Io(o)) && (s = Xi(t)), r) {
      const m = hr(t, !0, i, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else o && c();
  i && !r && o && c();
  const f = o && !r && !i ? Vd(o, s) : yn(0), u = a.left + s.scrollLeft - l.x - f.x, y = a.top + s.scrollTop - l.y - f.y;
  return {
    x: u,
    y,
    width: a.width,
    height: a.height
  };
}
function Oa(e) {
  return an(e).position === "static";
}
function el(e, t) {
  if (!wn(e) || an(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return Cn(e) === n && (n = n.ownerDocument.body), n;
}
function Ud(e, t) {
  const n = Vt(e);
  if (Yi(e))
    return n;
  if (!wn(e)) {
    let o = Qn(e);
    for (; o && !$r(o); ) {
      if (on(o) && !Oa(o))
        return o;
      o = Qn(o);
    }
    return n;
  }
  let r = el(e, t);
  for (; r && b0(r) && Oa(r); )
    r = el(r, t);
  return r && $r(r) && Oa(r) && !qs(r) ? n : r || E0(e) || n;
}
const z0 = async function(e) {
  const t = this.getOffsetParent || Ud, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: $0(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function F0(e) {
  return an(e).direction === "rtl";
}
const H0 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: N0,
  getDocumentElement: Cn,
  getClippingRect: A0,
  getOffsetParent: Ud,
  getElementRects: z0,
  getClientRects: D0,
  getDimensions: L0,
  getScale: Ar,
  isElement: on,
  isRTL: F0
};
function Gd(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function W0(e, t) {
  let n = null, r;
  const o = Cn(e);
  function i() {
    var s;
    clearTimeout(r), (s = n) == null || s.disconnect(), n = null;
  }
  function a(s, l) {
    s === void 0 && (s = !1), l === void 0 && (l = 1), i();
    const c = e.getBoundingClientRect(), {
      left: f,
      top: u,
      width: y,
      height: m
    } = c;
    if (s || t(), !y || !m)
      return;
    const g = ti(u), w = ti(o.clientWidth - (f + y)), d = ti(o.clientHeight - (u + m)), v = ti(f), b = {
      rootMargin: -g + "px " + -w + "px " + -d + "px " + -v + "px",
      threshold: jt(0, Zn(1, l)) || 1
    };
    let C = !0;
    function x(S) {
      const E = S[0].intersectionRatio;
      if (E !== l) {
        if (!C)
          return a();
        E ? a(!1, E) : r = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      E === 1 && !Gd(c, e.getBoundingClientRect()) && a(), C = !1;
    }
    try {
      n = new IntersectionObserver(x, {
        ...b,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(x, b);
    }
    n.observe(e);
  }
  return a(!0), i;
}
function B0(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: i = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = Gs(e), f = o || i ? [...c ? So(c) : [], ...So(t)] : [];
  f.forEach((v) => {
    o && v.addEventListener("scroll", n, {
      passive: !0
    }), i && v.addEventListener("resize", n);
  });
  const u = c && s ? W0(c, n) : null;
  let y = -1, m = null;
  a && (m = new ResizeObserver((v) => {
    let [p] = v;
    p && p.target === c && m && (m.unobserve(t), cancelAnimationFrame(y), y = requestAnimationFrame(() => {
      var b;
      (b = m) == null || b.observe(t);
    })), n();
  }), c && !l && m.observe(c), m.observe(t));
  let g, w = l ? hr(e) : null;
  l && d();
  function d() {
    const v = hr(e);
    w && !Gd(w, v) && n(), w = v, g = requestAnimationFrame(d);
  }
  return n(), () => {
    var v;
    f.forEach((p) => {
      o && p.removeEventListener("scroll", n), i && p.removeEventListener("resize", n);
    }), u == null || u(), (v = m) == null || v.disconnect(), m = null, l && cancelAnimationFrame(g);
  };
}
const j0 = v0, V0 = p0, q0 = c0, U0 = m0, G0 = d0, tl = l0, K0 = h0, Y0 = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = {
    platform: H0,
    ...n
  }, i = {
    ...o.platform,
    _c: r
  };
  return u0(e, t, {
    ...o,
    platform: i
  });
};
var X0 = typeof document < "u", Z0 = function() {
}, hi = X0 ? Bi : Z0;
function Ni(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Ni(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const i = o[r];
      if (!(i === "_owner" && e.$$typeof) && !Ni(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function Kd(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function nl(e, t) {
  const n = Kd(e);
  return Math.round(t * n) / n;
}
function ka(e) {
  const t = h.useRef(e);
  return hi(() => {
    t.current = e;
  }), t;
}
function Q0(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: i,
      floating: a
    } = {},
    transform: s = !0,
    whileElementsMounted: l,
    open: c
  } = e, [f, u] = h.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [y, m] = h.useState(r);
  Ni(y, r) || m(r);
  const [g, w] = h.useState(null), [d, v] = h.useState(null), p = h.useCallback((T) => {
    T !== S.current && (S.current = T, w(T));
  }, []), b = h.useCallback((T) => {
    T !== E.current && (E.current = T, v(T));
  }, []), C = i || g, x = a || d, S = h.useRef(null), E = h.useRef(null), M = h.useRef(f), _ = l != null, P = ka(l), k = ka(o), I = ka(c), H = h.useCallback(() => {
    if (!S.current || !E.current)
      return;
    const T = {
      placement: t,
      strategy: n,
      middleware: y
    };
    k.current && (T.platform = k.current), Y0(S.current, E.current, T).then((z) => {
      const B = {
        ...z,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: I.current !== !1
      };
      A.current && !Ni(M.current, B) && (M.current = B, Pc.flushSync(() => {
        u(B);
      }));
    });
  }, [y, t, n, k, I]);
  hi(() => {
    c === !1 && M.current.isPositioned && (M.current.isPositioned = !1, u((T) => ({
      ...T,
      isPositioned: !1
    })));
  }, [c]);
  const A = h.useRef(!1);
  hi(() => (A.current = !0, () => {
    A.current = !1;
  }), []), hi(() => {
    if (C && (S.current = C), x && (E.current = x), C && x) {
      if (P.current)
        return P.current(C, x, H);
      H();
    }
  }, [C, x, H, P, _]);
  const L = h.useMemo(() => ({
    reference: S,
    floating: E,
    setReference: p,
    setFloating: b
  }), [p, b]), N = h.useMemo(() => ({
    reference: C,
    floating: x
  }), [C, x]), $ = h.useMemo(() => {
    const T = {
      position: n,
      left: 0,
      top: 0
    };
    if (!N.floating)
      return T;
    const z = nl(N.floating, f.x), B = nl(N.floating, f.y);
    return s ? {
      ...T,
      transform: "translate(" + z + "px, " + B + "px)",
      ...Kd(N.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: z,
      top: B
    };
  }, [n, s, N.floating, f.x, f.y]);
  return h.useMemo(() => ({
    ...f,
    update: H,
    refs: L,
    elements: N,
    floatingStyles: $
  }), [f, H, L, N, $]);
}
const J0 = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? tl({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? tl({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, ey = (e, t) => ({
  ...j0(e),
  options: [e, t]
}), ty = (e, t) => ({
  ...V0(e),
  options: [e, t]
}), ny = (e, t) => ({
  ...K0(e),
  options: [e, t]
}), ry = (e, t) => ({
  ...q0(e),
  options: [e, t]
}), oy = (e, t) => ({
  ...U0(e),
  options: [e, t]
}), iy = (e, t) => ({
  ...G0(e),
  options: [e, t]
}), ay = (e, t) => ({
  ...J0(e),
  options: [e, t]
});
var sy = "Arrow", Yd = h.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: o = 5, ...i } = e;
  return /* @__PURE__ */ R(
    at.svg,
    {
      ...i,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ R("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Yd.displayName = sy;
var uy = Yd;
function ly(e) {
  const [t, n] = h.useState(void 0);
  return Xn(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let a, s;
        if ("borderBoxSize" in i) {
          const l = i.borderBoxSize, c = Array.isArray(l) ? l[0] : l;
          a = c.inlineSize, s = c.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        n({ width: a, height: s });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
var Ks = "Popper", [Xd, Ur] = er(Ks), [cy, Zd] = Xd(Ks), Qd = (e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = h.useState(null);
  return /* @__PURE__ */ R(cy, { scope: t, anchor: r, onAnchorChange: o, children: n });
};
Qd.displayName = Ks;
var Jd = "PopperAnchor", ef = h.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e, i = Zd(Jd, n), a = h.useRef(null), s = gt(t, a), l = h.useRef(null);
    return h.useEffect(() => {
      const c = l.current;
      l.current = (r == null ? void 0 : r.current) || a.current, c !== l.current && i.onAnchorChange(l.current);
    }), r ? null : /* @__PURE__ */ R(at.div, { ...o, ref: s });
  }
);
ef.displayName = Jd;
var Ys = "PopperContent", [dy, fy] = Xd(Ys), tf = h.forwardRef(
  (e, t) => {
    var ge, j, q, J, D, O, F, G;
    const {
      __scopePopper: n,
      side: r = "bottom",
      sideOffset: o = 0,
      align: i = "center",
      alignOffset: a = 0,
      arrowPadding: s = 0,
      avoidCollisions: l = !0,
      collisionBoundary: c = [],
      collisionPadding: f = 0,
      sticky: u = "partial",
      hideWhenDetached: y = !1,
      updatePositionStrategy: m = "optimized",
      onPlaced: g,
      ...w
    } = e, d = Zd(Ys, n), [v, p] = h.useState(null), b = gt(t, (Q) => p(Q)), [C, x] = h.useState(null), S = ly(C), E = (ge = S == null ? void 0 : S.width) != null ? ge : 0, M = (j = S == null ? void 0 : S.height) != null ? j : 0, _ = r + (i !== "center" ? "-" + i : ""), P = typeof f == "number" ? f : { top: 0, right: 0, bottom: 0, left: 0, ...f }, k = Array.isArray(c) ? c : [c], I = k.length > 0, H = {
      padding: P,
      boundary: k.filter(py),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: I
    }, { refs: A, floatingStyles: L, placement: N, isPositioned: $, middlewareData: T } = Q0({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: _,
      whileElementsMounted: (...Q) => B0(...Q, {
        animationFrame: m === "always"
      }),
      elements: {
        reference: d.anchor
      },
      middleware: [
        ey({ mainAxis: o + M, alignmentAxis: a }),
        l && ty({
          mainAxis: !0,
          crossAxis: !1,
          limiter: u === "partial" ? ny() : void 0,
          ...H
        }),
        l && ry({ ...H }),
        oy({
          ...H,
          apply: ({ elements: Q, rects: X, availableWidth: oe, availableHeight: ee }) => {
            const { width: ne, height: be } = X.reference, we = Q.floating.style;
            we.setProperty("--radix-popper-available-width", `${oe}px`), we.setProperty("--radix-popper-available-height", `${ee}px`), we.setProperty("--radix-popper-anchor-width", `${ne}px`), we.setProperty("--radix-popper-anchor-height", `${be}px`);
          }
        }),
        C && ay({ element: C, padding: s }),
        hy({ arrowWidth: E, arrowHeight: M }),
        y && iy({ strategy: "referenceHidden", ...H })
      ]
    }), [z, B] = of(N), W = bn(g);
    Xn(() => {
      $ && (W == null || W());
    }, [$, W]);
    const Y = (q = T.arrow) == null ? void 0 : q.x, U = (J = T.arrow) == null ? void 0 : J.y, V = ((D = T.arrow) == null ? void 0 : D.centerOffset) !== 0, [Z, se] = h.useState();
    return Xn(() => {
      v && se(window.getComputedStyle(v).zIndex);
    }, [v]), /* @__PURE__ */ R(
      "div",
      {
        ref: A.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...L,
          transform: $ ? L.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: Z,
          "--radix-popper-transform-origin": [
            (O = T.transformOrigin) == null ? void 0 : O.x,
            (F = T.transformOrigin) == null ? void 0 : F.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((G = T.hide) == null ? void 0 : G.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ R(
          dy,
          {
            scope: n,
            placedSide: z,
            onArrowChange: x,
            arrowX: Y,
            arrowY: U,
            shouldHideArrow: V,
            children: /* @__PURE__ */ R(
              at.div,
              {
                "data-side": z,
                "data-align": B,
                ...w,
                ref: b,
                style: {
                  ...w.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: $ ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
tf.displayName = Ys;
var nf = "PopperArrow", vy = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, rf = h.forwardRef(function(t, n) {
  const { __scopePopper: r, ...o } = t, i = fy(nf, r), a = vy[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ R(
      "span",
      {
        ref: i.onArrowChange,
        style: {
          position: "absolute",
          left: i.arrowX,
          top: i.arrowY,
          [a]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[i.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[i.placedSide],
          visibility: i.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ R(
          uy,
          {
            ...o,
            ref: n,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
rf.displayName = nf;
function py(e) {
  return e !== null;
}
var hy = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var d, v, p, b, C;
    const { placement: n, rects: r, middlewareData: o } = t, a = ((d = o.arrow) == null ? void 0 : d.centerOffset) !== 0, s = a ? 0 : e.arrowWidth, l = a ? 0 : e.arrowHeight, [c, f] = of(n), u = { start: "0%", center: "50%", end: "100%" }[f], y = ((p = (v = o.arrow) == null ? void 0 : v.x) != null ? p : 0) + s / 2, m = ((C = (b = o.arrow) == null ? void 0 : b.y) != null ? C : 0) + l / 2;
    let g = "", w = "";
    return c === "bottom" ? (g = a ? u : `${y}px`, w = `${-l}px`) : c === "top" ? (g = a ? u : `${y}px`, w = `${r.floating.height + l}px`) : c === "right" ? (g = `${-l}px`, w = a ? u : `${m}px`) : c === "left" && (g = `${r.floating.width + l}px`, w = a ? u : `${m}px`), { data: { x: g, y: w } };
  }
});
function of(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Qi = Qd, Ji = ef, Xs = tf, Zs = rf, ea = "Popover", [af] = er(ea, [
  Ur
]), Ao = Ur(), [my, tr] = af(ea), sf = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    modal: a = !1
  } = e, s = Ao(t), l = h.useRef(null), [c, f] = h.useState(!1), [u, y] = jr({
    prop: r,
    defaultProp: o != null ? o : !1,
    onChange: i,
    caller: ea
  });
  return /* @__PURE__ */ R(Qi, { ...s, children: /* @__PURE__ */ R(
    my,
    {
      scope: t,
      contentId: Nn(),
      triggerRef: l,
      open: u,
      onOpenChange: y,
      onOpenToggle: h.useCallback(() => y((m) => !m), [y]),
      hasCustomAnchor: c,
      onCustomAnchorAdd: h.useCallback(() => f(!0), []),
      onCustomAnchorRemove: h.useCallback(() => f(!1), []),
      modal: a,
      children: n
    }
  ) });
};
sf.displayName = ea;
var uf = "PopoverAnchor", gy = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = tr(uf, n), i = Ao(n), { onCustomAnchorAdd: a, onCustomAnchorRemove: s } = o;
    return h.useEffect(() => (a(), () => s()), [a, s]), /* @__PURE__ */ R(Ji, { ...i, ...r, ref: t });
  }
);
gy.displayName = uf;
var lf = "PopoverTrigger", cf = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = tr(lf, n), i = Ao(n), a = gt(t, o.triggerRef), s = /* @__PURE__ */ R(
      at.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": hf(o.open),
        ...r,
        ref: a,
        onClick: Ce(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? s : /* @__PURE__ */ R(Ji, { asChild: !0, ...i, children: s });
  }
);
cf.displayName = lf;
var Qs = "PopoverPortal", [yy, by] = af(Qs, {
  forceMount: void 0
}), df = (e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: o } = e, i = tr(Qs, t);
  return /* @__PURE__ */ R(yy, { scope: t, forceMount: n, children: /* @__PURE__ */ R(Yt, { present: n || i.open, children: /* @__PURE__ */ R(To, { asChild: !0, container: o, children: r }) }) });
};
df.displayName = Qs;
var zr = "PopoverContent", ff = h.forwardRef(
  (e, t) => {
    const n = by(zr, e.__scopePopover), { forceMount: r = n.forceMount, ...o } = e, i = tr(zr, e.__scopePopover);
    return /* @__PURE__ */ R(Yt, { present: r || i.open, children: i.modal ? /* @__PURE__ */ R(xy, { ...o, ref: t }) : /* @__PURE__ */ R(Cy, { ...o, ref: t }) });
  }
);
ff.displayName = zr;
var wy = /* @__PURE__ */ Lr("PopoverContent.RemoveScroll"), xy = h.forwardRef(
  (e, t) => {
    const n = tr(zr, e.__scopePopover), r = h.useRef(null), o = gt(t, r), i = h.useRef(!1);
    return h.useEffect(() => {
      const a = r.current;
      if (a) return $s(a);
    }, []), /* @__PURE__ */ R(Ui, { as: wy, allowPinchZoom: !0, children: /* @__PURE__ */ R(
      vf,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Ce(e.onCloseAutoFocus, (a) => {
          var s;
          a.preventDefault(), i.current || (s = n.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: Ce(
          e.onPointerDownOutside,
          (a) => {
            const s = a.detail.originalEvent, l = s.button === 0 && s.ctrlKey === !0, c = s.button === 2 || l;
            i.current = c;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: Ce(
          e.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), Cy = h.forwardRef(
  (e, t) => {
    const n = tr(zr, e.__scopePopover), r = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ R(
      vf,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var a, s;
          (a = e.onCloseAutoFocus) == null || a.call(e, i), i.defaultPrevented || (r.current || (s = n.triggerRef.current) == null || s.focus(), i.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (i) => {
          var l, c;
          (l = e.onInteractOutside) == null || l.call(e, i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const a = i.target;
          ((c = n.triggerRef.current) == null ? void 0 : c.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), vf = h.forwardRef(
  (e, t) => {
    const {
      __scopePopover: n,
      trapFocus: r,
      onOpenAutoFocus: o,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: a,
      onEscapeKeyDown: s,
      onPointerDownOutside: l,
      onFocusOutside: c,
      onInteractOutside: f,
      ...u
    } = e, y = tr(zr, n), m = Ao(n);
    return Ls(), /* @__PURE__ */ R(
      Vi,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: o,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ R(
          ko,
          {
            asChild: !0,
            disableOutsidePointerEvents: a,
            onInteractOutside: f,
            onEscapeKeyDown: s,
            onPointerDownOutside: l,
            onFocusOutside: c,
            onDismiss: () => y.onOpenChange(!1),
            children: /* @__PURE__ */ R(
              Xs,
              {
                "data-state": hf(y.open),
                role: "dialog",
                id: y.contentId,
                ...m,
                ...u,
                ref: t,
                style: {
                  ...u.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), pf = "PopoverClose", Sy = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = tr(pf, n);
    return /* @__PURE__ */ R(
      at.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: Ce(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
Sy.displayName = pf;
var Ey = "PopoverArrow", Ry = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = Ao(n);
    return /* @__PURE__ */ R(Zs, { ...o, ...r, ref: t });
  }
);
Ry.displayName = Ey;
function hf(e) {
  return e ? "open" : "closed";
}
var My = sf, Py = cf, Ny = df, Dy = ff;
function _y({
  ...e
}) {
  return /* @__PURE__ */ R(My, { "data-slot": "popover", ...e });
}
function Oy({
  ...e
}) {
  return /* @__PURE__ */ R(Py, { "data-slot": "popover-trigger", ...e });
}
function ky({
  className: e,
  align: t = "center",
  sideOffset: n = 4,
  ...r
}) {
  return /* @__PURE__ */ R(Ny, { children: /* @__PURE__ */ R(
    Dy,
    {
      "data-slot": "popover-content",
      align: t,
      sideOffset: n,
      className: ie(
        `
                      univer-outline-hidden univer-z-[1080] univer-max-h-[var(--radix-popper-available-height)]
                      univer-overflow-y-auto univer-rounded-md univer-bg-white univer-text-gray-900 univer-shadow-md
                      data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0
                      data-[state=open]:univer-zoom-in-95
                      data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
                      data-[state=closed]:univer-zoom-out-95
                      data-[side=bottom]:univer-slide-in-from-top-2
                      data-[side=left]:univer-slide-in-from-right-2
                      data-[side=right]:univer-slide-in-from-left-2
                      data-[side=top]:univer-slide-in-from-bottom-2
                      dark:!univer-bg-gray-900 dark:!univer-text-white dark:focus-visible:!univer-border-gray-600
                    `,
        kt,
        vr,
        e
      ),
      ...r
    }
  ) });
}
function mf(e) {
  const {
    children: t,
    overlay: n,
    disabled: r,
    open: o,
    onOpenChange: i,
    ...a
  } = e, [s, l] = De(!1), c = o !== void 0, f = c ? o : s;
  function u(y) {
    r || (c || l(y), i == null || i(y));
  }
  return /* @__PURE__ */ me(_y, { open: f, onOpenChange: u, children: [
    /* @__PURE__ */ R(Oy, { asChild: !0, children: t }),
    /* @__PURE__ */ R(ky, { ...a, children: n })
  ] });
}
function xE(e) {
  const { value: t, onValueChange: n, className: r } = e, [o, i] = De(!1);
  function a(s) {
    n == null || n(s), i(!1);
  }
  return /* @__PURE__ */ R(
    mf,
    {
      align: "start",
      overlay: /* @__PURE__ */ R("div", { className: "univer-p-2", children: /* @__PURE__ */ R(Za, { value: t, onValueChange: a }) }),
      open: o,
      onOpenChange: i,
      children: /* @__PURE__ */ me(
        "button",
        {
          className: ie("univer-flex univer-h-8 univer-items-center univer-justify-between univer-gap-2 univer-rounded-md univer-bg-transparent univer-px-2 univer-text-sm univer-text-gray-800 univer-transition-all hover:univer-border-primary-600 dark:!univer-text-white", kt, r),
          type: "button",
          children: [
            xo(t).format("YYYY-MM-DD"),
            /* @__PURE__ */ R(
              _s,
              {
                className: "univer-text-gray-600 dark:!univer-text-gray-400"
              }
            )
          ]
        }
      )
    }
  );
}
function CE(e) {
  const { value: t = [/* @__PURE__ */ new Date(), /* @__PURE__ */ new Date()], onValueChange: n, className: r } = e, [o, i] = De(!1);
  function a(s) {
    let [l, c] = s;
    l > c && ([l, c] = [c, l]), n == null || n([l, c]), i(!1);
  }
  return /* @__PURE__ */ R(
    mf,
    {
      align: "start",
      overlay: /* @__PURE__ */ me("div", { className: "univer-grid univer-grid-cols-2 univer-gap-2 univer-p-2", children: [
        /* @__PURE__ */ R(
          Za,
          {
            value: t[0],
            max: t[1],
            onValueChange: (s) => {
              a([s, t[1]]);
            }
          }
        ),
        /* @__PURE__ */ R(
          Za,
          {
            value: t[1],
            min: t[0],
            onValueChange: (s) => {
              a([t[0], s]);
            }
          }
        )
      ] }),
      open: o,
      onOpenChange: i,
      children: /* @__PURE__ */ me(
        "button",
        {
          className: ie("univer-flex univer-h-8 univer-items-center univer-justify-between univer-gap-2 univer-rounded-md univer-bg-transparent univer-px-2 univer-text-sm univer-text-gray-800 univer-transition-all hover:univer-border-primary-600 dark:!univer-text-white", kt, r),
          type: "button",
          children: [
            /* @__PURE__ */ me("span", { className: "univer-flex univer-gap-1", children: [
              /* @__PURE__ */ R("span", { children: xo(t[0]).format("YYYY-MM-DD") }),
              /* @__PURE__ */ R("span", { children: "-" }),
              /* @__PURE__ */ R("span", { children: xo(t[1]).format("YYYY-MM-DD") })
            ] }),
            /* @__PURE__ */ R(
              _s,
              {
                className: "univer-text-gray-600 dark:!univer-text-gray-400"
              }
            )
          ]
        }
      )
    }
  );
}
var Ta = { exports: {} }, to = {}, ho = { exports: {} }, Ty = ho.exports, rl;
function Js() {
  return rl || (rl = 1, (function(e, t) {
    (function(n, r) {
      r(t);
    })(Ty, (function(n) {
      function r(j) {
        return function(J, D, O, F, G, Q, X) {
          return j(J, D, X);
        };
      }
      function o(j) {
        return function(J, D, O, F) {
          if (!J || !D || typeof J != "object" || typeof D != "object")
            return j(J, D, O, F);
          var G = F.get(J), Q = F.get(D);
          if (G && Q)
            return G === D && Q === J;
          F.set(J, D), F.set(D, J);
          var X = j(J, D, O, F);
          return F.delete(J), F.delete(D), X;
        };
      }
      function i(j, q) {
        var J = {};
        for (var D in j)
          J[D] = j[D];
        for (var D in q)
          J[D] = q[D];
        return J;
      }
      function a(j) {
        return j.constructor === Object || j.constructor == null;
      }
      function s(j) {
        return typeof j.then == "function";
      }
      function l(j, q) {
        return j === q || j !== j && q !== q;
      }
      var c = "[object Arguments]", f = "[object Boolean]", u = "[object Date]", y = "[object RegExp]", m = "[object Map]", g = "[object Number]", w = "[object Object]", d = "[object Set]", v = "[object String]", p = Object.prototype.toString;
      function b(j) {
        var q = j.areArraysEqual, J = j.areDatesEqual, D = j.areMapsEqual, O = j.areObjectsEqual, F = j.areRegExpsEqual, G = j.areSetsEqual, Q = j.createIsNestedEqual, X = Q(oe);
        function oe(ee, ne, be) {
          if (ee === ne)
            return !0;
          if (!ee || !ne || typeof ee != "object" || typeof ne != "object")
            return ee !== ee && ne !== ne;
          if (a(ee) && a(ne))
            return O(ee, ne, X, be);
          var we = Array.isArray(ee), pe = Array.isArray(ne);
          if (we || pe)
            return we === pe && q(ee, ne, X, be);
          var te = p.call(ee);
          return te !== p.call(ne) ? !1 : te === u ? J(ee, ne, X, be) : te === y ? F(ee, ne, X, be) : te === m ? D(ee, ne, X, be) : te === d ? G(ee, ne, X, be) : te === w || te === c ? s(ee) || s(ne) ? !1 : O(ee, ne, X, be) : te === f || te === g || te === v ? l(ee.valueOf(), ne.valueOf()) : !1;
        }
        return oe;
      }
      function C(j, q, J, D) {
        var O = j.length;
        if (q.length !== O)
          return !1;
        for (; O-- > 0; )
          if (!J(j[O], q[O], O, O, j, q, D))
            return !1;
        return !0;
      }
      var x = o(C);
      function S(j, q) {
        return l(j.valueOf(), q.valueOf());
      }
      function E(j, q, J, D) {
        var O = j.size === q.size;
        if (!O)
          return !1;
        if (!j.size)
          return !0;
        var F = {}, G = 0;
        return j.forEach(function(Q, X) {
          if (O) {
            var oe = !1, ee = 0;
            q.forEach(function(ne, be) {
              !oe && !F[ee] && (oe = J(X, be, G, ee, j, q, D) && J(Q, ne, X, be, j, q, D)) && (F[ee] = !0), ee++;
            }), G++, O = oe;
          }
        }), O;
      }
      var M = o(E), _ = "_owner", P = Object.prototype.hasOwnProperty;
      function k(j, q, J, D) {
        var O = Object.keys(j), F = O.length;
        if (Object.keys(q).length !== F)
          return !1;
        for (var G; F-- > 0; ) {
          if (G = O[F], G === _) {
            var Q = !!j.$$typeof, X = !!q.$$typeof;
            if ((Q || X) && Q !== X)
              return !1;
          }
          if (!P.call(q, G) || !J(j[G], q[G], G, G, j, q, D))
            return !1;
        }
        return !0;
      }
      var I = o(k);
      function H(j, q) {
        return j.source === q.source && j.flags === q.flags;
      }
      function A(j, q, J, D) {
        var O = j.size === q.size;
        if (!O)
          return !1;
        if (!j.size)
          return !0;
        var F = {};
        return j.forEach(function(G, Q) {
          if (O) {
            var X = !1, oe = 0;
            q.forEach(function(ee, ne) {
              !X && !F[oe] && (X = J(G, ee, Q, ne, j, q, D)) && (F[oe] = !0), oe++;
            }), O = X;
          }
        }), O;
      }
      var L = o(A), N = Object.freeze({
        areArraysEqual: C,
        areDatesEqual: S,
        areMapsEqual: E,
        areObjectsEqual: k,
        areRegExpsEqual: H,
        areSetsEqual: A,
        createIsNestedEqual: r
      }), $ = Object.freeze({
        areArraysEqual: x,
        areDatesEqual: S,
        areMapsEqual: M,
        areObjectsEqual: I,
        areRegExpsEqual: H,
        areSetsEqual: L,
        createIsNestedEqual: r
      }), T = b(N);
      function z(j, q) {
        return T(j, q, void 0);
      }
      var B = b(i(N, { createIsNestedEqual: function() {
        return l;
      } }));
      function W(j, q) {
        return B(j, q, void 0);
      }
      var Y = b($);
      function U(j, q) {
        return Y(j, q, /* @__PURE__ */ new WeakMap());
      }
      var V = b(i($, {
        createIsNestedEqual: function() {
          return l;
        }
      }));
      function Z(j, q) {
        return V(j, q, /* @__PURE__ */ new WeakMap());
      }
      function se(j) {
        return b(i(N, j(N)));
      }
      function ge(j) {
        var q = b(i($, j($)));
        return (function(J, D, O) {
          return O === void 0 && (O = /* @__PURE__ */ new WeakMap()), q(J, D, O);
        });
      }
      n.circularDeepEqual = U, n.circularShallowEqual = Z, n.createCustomCircularEqual = ge, n.createCustomEqual = se, n.deepEqual = z, n.sameValueZeroEqual = l, n.shallowEqual = W, Object.defineProperty(n, "__esModule", { value: !0 });
    }));
  })(ho, ho.exports)), ho.exports;
}
var ni = { exports: {} }, ol;
function eu() {
  if (ol) return ni.exports;
  ol = 1;
  function e(n) {
    var r, o, i = "";
    if (typeof n == "string" || typeof n == "number") i += n;
    else if (typeof n == "object") if (Array.isArray(n)) {
      var a = n.length;
      for (r = 0; r < a; r++) n[r] && (o = e(n[r])) && (i && (i += " "), i += o);
    } else for (o in n) n[o] && (i && (i += " "), i += o);
    return i;
  }
  function t() {
    for (var n, r, o = 0, i = "", a = arguments.length; o < a; o++) (n = arguments[o]) && (r = e(n)) && (i && (i += " "), i += r);
    return i;
  }
  return ni.exports = t, ni.exports.clsx = t, ni.exports;
}
var ke = {}, Ia, il;
function Iy() {
  return il || (il = 1, Ia = function(t, n, r) {
    return t === n ? !0 : t.className === n.className && r(t.style, n.style) && t.width === n.width && t.autoSize === n.autoSize && t.cols === n.cols && t.draggableCancel === n.draggableCancel && t.draggableHandle === n.draggableHandle && r(t.verticalCompact, n.verticalCompact) && r(t.compactType, n.compactType) && r(t.layout, n.layout) && r(t.margin, n.margin) && r(t.containerPadding, n.containerPadding) && t.rowHeight === n.rowHeight && t.maxRows === n.maxRows && t.isBounded === n.isBounded && t.isDraggable === n.isDraggable && t.isResizable === n.isResizable && t.allowOverlap === n.allowOverlap && t.preventCollision === n.preventCollision && t.useCSSTransforms === n.useCSSTransforms && t.transformScale === n.transformScale && t.isDroppable === n.isDroppable && r(t.resizeHandles, n.resizeHandles) && r(t.resizeHandle, n.resizeHandle) && t.onLayoutChange === n.onLayoutChange && t.onDragStart === n.onDragStart && t.onDrag === n.onDrag && t.onDragStop === n.onDragStop && t.onResizeStart === n.onResizeStart && t.onResize === n.onResize && t.onResizeStop === n.onResizeStop && t.onDrop === n.onDrop && r(t.droppingItem, n.droppingItem) && r(t.innerRef, n.innerRef);
  }), Ia;
}
var al;
function Gr() {
  if (al) return ke;
  al = 1, Object.defineProperty(ke, "__esModule", {
    value: !0
  }), ke.bottom = r, ke.childrenEqual = l, ke.cloneLayout = o, ke.cloneLayoutItem = s, ke.collides = f, ke.compact = u, ke.compactItem = g, ke.compactType = j, ke.correctBounds = w, ke.fastPositionEqual = c, ke.fastRGLPropsEqual = void 0, ke.getAllCollisions = p, ke.getFirstCollision = v, ke.getLayoutItem = d, ke.getStatics = b, ke.modifyLayout = i, ke.moveElement = C, ke.moveElementAwayFromCollision = x, ke.noop = void 0, ke.perc = S, ke.resizeItemInDirection = B, ke.setTopLeft = Y, ke.setTransform = W, ke.sortLayoutItems = U, ke.sortLayoutItemsByColRow = Z, ke.sortLayoutItemsByRowCol = V, ke.synchronizeLayoutWithChildren = se, ke.validateLayout = ge, ke.withLayoutItem = a;
  var e = /* @__PURE__ */ Js(), t = n(K);
  function n(D) {
    return D && D.__esModule ? D : { default: D };
  }
  function r(D) {
    let O = 0, F;
    for (let G = 0, Q = D.length; G < Q; G++)
      F = D[G].y + D[G].h, F > O && (O = F);
    return O;
  }
  function o(D) {
    const O = Array(D.length);
    for (let F = 0, G = D.length; F < G; F++)
      O[F] = s(D[F]);
    return O;
  }
  function i(D, O) {
    const F = Array(D.length);
    for (let G = 0, Q = D.length; G < Q; G++)
      O.i === D[G].i ? F[G] = O : F[G] = D[G];
    return F;
  }
  function a(D, O, F) {
    let G = d(D, O);
    return G ? (G = F(s(G)), D = i(D, G), [D, G]) : [D, null];
  }
  function s(D) {
    return {
      w: D.w,
      h: D.h,
      x: D.x,
      y: D.y,
      i: D.i,
      minW: D.minW,
      maxW: D.maxW,
      minH: D.minH,
      maxH: D.maxH,
      moved: !!D.moved,
      static: !!D.static,
      // These can be null/undefined
      isDraggable: D.isDraggable,
      isResizable: D.isResizable,
      resizeHandles: D.resizeHandles,
      isBounded: D.isBounded
    };
  }
  function l(D, O) {
    return (0, e.deepEqual)(t.default.Children.map(D, (F) => F == null ? void 0 : F.key), t.default.Children.map(O, (F) => F == null ? void 0 : F.key)) && (0, e.deepEqual)(t.default.Children.map(D, (F) => F == null ? void 0 : F.props["data-grid"]), t.default.Children.map(O, (F) => F == null ? void 0 : F.props["data-grid"]));
  }
  ke.fastRGLPropsEqual = Iy();
  function c(D, O) {
    return D.left === O.left && D.top === O.top && D.width === O.width && D.height === O.height;
  }
  function f(D, O) {
    return !(D.i === O.i || D.x + D.w <= O.x || D.x >= O.x + O.w || D.y + D.h <= O.y || D.y >= O.y + O.h);
  }
  function u(D, O, F, G) {
    const Q = b(D), X = U(D, O), oe = Array(D.length);
    for (let ee = 0, ne = X.length; ee < ne; ee++) {
      let be = s(X[ee]);
      be.static || (be = g(Q, be, O, F, X, G), Q.push(be)), oe[D.indexOf(X[ee])] = be, be.moved = !1;
    }
    return oe;
  }
  const y = {
    x: "w",
    y: "h"
  };
  function m(D, O, F, G) {
    const Q = y[G];
    O[G] += 1;
    const X = D.map((oe) => oe.i).indexOf(O.i);
    for (let oe = X + 1; oe < D.length; oe++) {
      const ee = D[oe];
      if (!ee.static) {
        if (ee.y > O.y + O.h) break;
        f(O, ee) && m(D, ee, F + O[Q], G);
      }
    }
    O[G] = F;
  }
  function g(D, O, F, G, Q, X) {
    const oe = F === "vertical", ee = F === "horizontal";
    if (oe)
      for (O.y = Math.min(r(D), O.y); O.y > 0 && !v(D, O); )
        O.y--;
    else if (ee)
      for (; O.x > 0 && !v(D, O); )
        O.x--;
    let ne;
    for (; (ne = v(D, O)) && !(F === null && X); )
      if (ee ? m(Q, O, ne.x + ne.w, "x") : m(Q, O, ne.y + ne.h, "y"), ee && O.x + O.w > G)
        for (O.x = G - O.w, O.y++; O.x > 0 && !v(D, O); )
          O.x--;
    return O.y = Math.max(O.y, 0), O.x = Math.max(O.x, 0), O;
  }
  function w(D, O) {
    const F = b(D);
    for (let G = 0, Q = D.length; G < Q; G++) {
      const X = D[G];
      if (X.x + X.w > O.cols && (X.x = O.cols - X.w), X.x < 0 && (X.x = 0, X.w = O.cols), !X.static) F.push(X);
      else
        for (; v(F, X); )
          X.y++;
    }
    return D;
  }
  function d(D, O) {
    for (let F = 0, G = D.length; F < G; F++)
      if (D[F].i === O) return D[F];
  }
  function v(D, O) {
    for (let F = 0, G = D.length; F < G; F++)
      if (f(D[F], O)) return D[F];
  }
  function p(D, O) {
    return D.filter((F) => f(F, O));
  }
  function b(D) {
    return D.filter((O) => O.static);
  }
  function C(D, O, F, G, Q, X, oe, ee, ne) {
    if (O.static && O.isDraggable !== !0 || O.y === G && O.x === F) return D;
    `${O.i}${String(F)}${String(G)}${O.x}${O.y}`;
    const be = O.x, we = O.y;
    typeof F == "number" && (O.x = F), typeof G == "number" && (O.y = G), O.moved = !0;
    let pe = U(D, oe);
    (oe === "vertical" && typeof G == "number" ? we >= G : oe === "horizontal" && typeof F == "number" ? be >= F : !1) && (pe = pe.reverse());
    const He = p(pe, O), Te = He.length > 0;
    if (Te && ne)
      return o(D);
    if (Te && X)
      return `${O.i}`, O.x = be, O.y = we, O.moved = !1, D;
    for (let Ee = 0, Ge = He.length; Ee < Ge; Ee++) {
      const ze = He[Ee];
      `${O.i}${O.x}${O.y}${ze.i}${ze.x}${ze.y}`, !ze.moved && (ze.static ? D = x(D, ze, O, Q, oe) : D = x(D, O, ze, Q, oe));
    }
    return D;
  }
  function x(D, O, F, G, Q, X) {
    const oe = Q === "horizontal", ee = Q === "vertical", ne = O.static;
    if (G) {
      G = !1;
      const pe = {
        x: oe ? Math.max(O.x - F.w, 0) : F.x,
        y: ee ? Math.max(O.y - F.h, 0) : F.y,
        w: F.w,
        h: F.h,
        i: "-1"
      }, te = v(D, pe), He = te && te.y + te.h > O.y, Te = te && O.x + O.w > te.x;
      if (te) {
        if (He && ee)
          return C(D, F, void 0, O.y + 1, G, ne, Q);
        if (He && Q == null)
          return O.y = F.y, F.y = F.y + F.h, D;
        if (Te && oe)
          return C(D, O, F.x, void 0, G, ne, Q);
      } else return `${F.i}${pe.x}${pe.y}`, C(D, F, oe ? pe.x : void 0, ee ? pe.y : void 0, G, ne, Q);
    }
    const be = oe ? F.x + 1 : void 0, we = ee ? F.y + 1 : void 0;
    return be == null && we == null ? D : C(D, F, oe ? F.x + 1 : void 0, ee ? F.y + 1 : void 0, G, ne, Q);
  }
  function S(D) {
    return D * 100 + "%";
  }
  const E = (D, O, F, G) => D + F > G ? O : F, M = (D, O, F) => D < 0 ? O : F, _ = (D) => Math.max(0, D), P = (D) => Math.max(0, D), k = (D, O, F) => {
    let {
      left: G,
      height: Q,
      width: X
    } = O;
    const oe = D.top - (Q - D.height);
    return {
      left: G,
      width: X,
      height: M(oe, D.height, Q),
      top: P(oe)
    };
  }, I = (D, O, F) => {
    let {
      top: G,
      left: Q,
      height: X,
      width: oe
    } = O;
    return {
      top: G,
      height: X,
      width: E(D.left, D.width, oe, F),
      left: _(Q)
    };
  }, H = (D, O, F) => {
    let {
      top: G,
      height: Q,
      width: X
    } = O;
    const oe = D.left - (X - D.width);
    return {
      height: Q,
      width: oe < 0 ? D.width : E(D.left, D.width, X, F),
      top: P(G),
      left: _(oe)
    };
  }, A = (D, O, F) => {
    let {
      top: G,
      left: Q,
      height: X,
      width: oe
    } = O;
    return {
      width: oe,
      left: Q,
      height: M(G, D.height, X),
      top: P(G)
    };
  }, z = {
    n: k,
    ne: function() {
      return k(arguments.length <= 0 ? void 0 : arguments[0], I(...arguments));
    },
    e: I,
    se: function() {
      return A(arguments.length <= 0 ? void 0 : arguments[0], I(...arguments));
    },
    s: A,
    sw: function() {
      return A(arguments.length <= 0 ? void 0 : arguments[0], H(...arguments));
    },
    w: H,
    nw: function() {
      return k(arguments.length <= 0 ? void 0 : arguments[0], H(...arguments));
    }
  };
  function B(D, O, F, G) {
    const Q = z[D];
    return Q ? Q(O, {
      ...O,
      ...F
    }, G) : F;
  }
  function W(D) {
    let {
      top: O,
      left: F,
      width: G,
      height: Q
    } = D;
    const X = `translate(${F}px,${O}px)`;
    return {
      transform: X,
      WebkitTransform: X,
      MozTransform: X,
      msTransform: X,
      OTransform: X,
      width: `${G}px`,
      height: `${Q}px`,
      position: "absolute"
    };
  }
  function Y(D) {
    let {
      top: O,
      left: F,
      width: G,
      height: Q
    } = D;
    return {
      top: `${O}px`,
      left: `${F}px`,
      width: `${G}px`,
      height: `${Q}px`,
      position: "absolute"
    };
  }
  function U(D, O) {
    return O === "horizontal" ? Z(D) : O === "vertical" ? V(D) : D;
  }
  function V(D) {
    return D.slice(0).sort(function(O, F) {
      return O.y > F.y || O.y === F.y && O.x > F.x ? 1 : O.y === F.y && O.x === F.x ? 0 : -1;
    });
  }
  function Z(D) {
    return D.slice(0).sort(function(O, F) {
      return O.x > F.x || O.x === F.x && O.y > F.y ? 1 : -1;
    });
  }
  function se(D, O, F, G, Q) {
    D = D || [];
    const X = [];
    t.default.Children.forEach(O, (ee) => {
      if ((ee == null ? void 0 : ee.key) == null) return;
      const ne = d(D, String(ee.key)), be = ee.props["data-grid"];
      ne && be == null ? X.push(s(ne)) : be ? X.push(s({
        ...be,
        i: ee.key
      })) : X.push(s({
        w: 1,
        h: 1,
        x: 0,
        y: r(X),
        i: String(ee.key)
      }));
    });
    const oe = w(X, {
      cols: F
    });
    return Q ? oe : u(oe, G, F);
  }
  function ge(D) {
    let O = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Layout";
    const F = ["x", "y", "w", "h"];
    if (!Array.isArray(D)) throw new Error(O + " must be an array!");
    for (let G = 0, Q = D.length; G < Q; G++) {
      const X = D[G];
      for (let oe = 0; oe < F.length; oe++) {
        const ee = F[oe], ne = X[ee];
        if (typeof ne != "number" || Number.isNaN(ne))
          throw new Error(`ReactGridLayout: ${O}[${G}].${ee} must be a number! Received: ${ne} (${typeof ne})`);
      }
      if (typeof X.i < "u" && typeof X.i != "string")
        throw new Error(`ReactGridLayout: ${O}[${G}].i must be a string! Received: ${X.i} (${typeof X.i})`);
    }
  }
  function j(D) {
    const {
      verticalCompact: O,
      compactType: F
    } = D || {};
    return O === !1 ? null : F;
  }
  function q() {
  }
  const J = () => {
  };
  return ke.noop = J, ke;
}
var Mn = {}, sl;
function tu() {
  if (sl) return Mn;
  sl = 1, Object.defineProperty(Mn, "__esModule", {
    value: !0
  }), Mn.calcGridColWidth = e, Mn.calcGridItemPosition = n, Mn.calcGridItemWHPx = t, Mn.calcWH = o, Mn.calcXY = r, Mn.clamp = i;
  function e(a) {
    const {
      margin: s,
      containerPadding: l,
      containerWidth: c,
      cols: f
    } = a;
    return (c - s[0] * (f - 1) - l[0] * 2) / f;
  }
  function t(a, s, l) {
    return Number.isFinite(a) ? Math.round(s * a + Math.max(0, a - 1) * l) : a;
  }
  function n(a, s, l, c, f, u) {
    const {
      margin: y,
      containerPadding: m,
      rowHeight: g
    } = a, w = e(a), d = {};
    return u && u.resizing ? (d.width = Math.round(u.resizing.width), d.height = Math.round(u.resizing.height)) : (d.width = t(c, w, y[0]), d.height = t(f, g, y[1])), u && u.dragging ? (d.top = Math.round(u.dragging.top), d.left = Math.round(u.dragging.left)) : u && u.resizing && typeof u.resizing.top == "number" && typeof u.resizing.left == "number" ? (d.top = Math.round(u.resizing.top), d.left = Math.round(u.resizing.left)) : (d.top = Math.round((g + y[1]) * l + m[1]), d.left = Math.round((w + y[0]) * s + m[0])), d;
  }
  function r(a, s, l, c, f) {
    const {
      margin: u,
      containerPadding: y,
      cols: m,
      rowHeight: g,
      maxRows: w
    } = a, d = e(a);
    let v = Math.round((l - y[0]) / (d + u[0])), p = Math.round((s - y[1]) / (g + u[1]));
    return v = i(v, 0, m - c), p = i(p, 0, w - f), {
      x: v,
      y: p
    };
  }
  function o(a, s, l, c, f, u) {
    const {
      margin: y,
      maxRows: m,
      cols: g,
      rowHeight: w
    } = a, d = e(a);
    let v = Math.round((s + y[0]) / (d + y[0])), p = Math.round((l + y[1]) / (w + y[1])), b = i(v, 0, g - c), C = i(p, 0, m - f);
    return ["sw", "w", "nw"].indexOf(u) !== -1 && (b = i(v, 0, g)), ["nw", "n", "ne"].indexOf(u) !== -1 && (C = i(p, 0, m)), {
      w: b,
      h: C
    };
  }
  function i(a, s, l) {
    return Math.max(Math.min(a, l), s);
  }
  return Mn;
}
var no = {}, Aa = { exports: {} }, La, ul;
function Ay() {
  if (ul) return La;
  ul = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return La = e, La;
}
var $a, ll;
function Ly() {
  if (ll) return $a;
  ll = 1;
  var e = /* @__PURE__ */ Ay();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, $a = function() {
    function r(a, s, l, c, f, u) {
      if (u !== e) {
        var y = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw y.name = "Invariant Violation", y;
      }
    }
    r.isRequired = r;
    function o() {
      return r;
    }
    var i = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: o,
      element: r,
      elementType: r,
      instanceOf: o,
      node: r,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: n,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, $a;
}
var cl;
function nr() {
  return cl || (cl = 1, Aa.exports = /* @__PURE__ */ Ly()()), Aa.exports;
}
var ro = { exports: {} }, za = {};
function gf(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (n = gf(e[t])) && (r && (r += " "), r += n);
  else for (t in e) e[t] && (r && (r += " "), r += t);
  return r;
}
function dl() {
  for (var e, t, n = 0, r = ""; n < arguments.length; ) (e = arguments[n++]) && (t = gf(e)) && (r && (r += " "), r += t);
  return r;
}
const $y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: dl,
  default: dl
}, Symbol.toStringTag, { value: "Module" })), zy = /* @__PURE__ */ Zc($y);
var ct = {}, Vn = {}, fl;
function ta() {
  if (fl) return Vn;
  fl = 1, Object.defineProperty(Vn, "__esModule", {
    value: !0
  }), Vn.dontSetMe = o, Vn.findInArray = e, Vn.int = r, Vn.isFunction = t, Vn.isNum = n;
  function e(i, a) {
    for (let s = 0, l = i.length; s < l; s++)
      if (a.apply(a, [i[s], s, i])) return i[s];
  }
  function t(i) {
    return typeof i == "function" || Object.prototype.toString.call(i) === "[object Function]";
  }
  function n(i) {
    return typeof i == "number" && !isNaN(i);
  }
  function r(i) {
    return parseInt(i, 10);
  }
  function o(i, a, s) {
    if (i[a])
      return new Error("Invalid prop ".concat(a, " passed to ").concat(s, " - do not set this, set it on the child."));
  }
  return Vn;
}
var qn = {}, vl;
function Fy() {
  if (vl) return qn;
  vl = 1, Object.defineProperty(qn, "__esModule", {
    value: !0
  }), qn.browserPrefixToKey = n, qn.browserPrefixToStyle = r, qn.default = void 0, qn.getPrefix = t;
  const e = ["Moz", "Webkit", "O", "ms"];
  function t() {
    var i;
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
    if (typeof window > "u") return "";
    const s = (i = window.document) === null || i === void 0 || (i = i.documentElement) === null || i === void 0 ? void 0 : i.style;
    if (!s || a in s) return "";
    for (let l = 0; l < e.length; l++)
      if (n(a, e[l]) in s) return e[l];
    return "";
  }
  function n(i, a) {
    return a ? "".concat(a).concat(o(i)) : i;
  }
  function r(i, a) {
    return a ? "-".concat(a.toLowerCase(), "-").concat(i) : i;
  }
  function o(i) {
    let a = "", s = !0;
    for (let l = 0; l < i.length; l++)
      s ? (a += i[l].toUpperCase(), s = !1) : i[l] === "-" ? s = !0 : a += i[l];
    return a;
  }
  return qn.default = t(), qn;
}
var pl;
function nu() {
  if (pl) return ct;
  pl = 1, Object.defineProperty(ct, "__esModule", {
    value: !0
  }), ct.addClassName = x, ct.addEvent = s, ct.addUserSelectStyles = b, ct.createCSSTransform = g, ct.createSVGTransform = w, ct.getTouch = v, ct.getTouchIdentifier = p, ct.getTranslation = d, ct.innerHeight = u, ct.innerWidth = y, ct.matchesSelector = i, ct.matchesSelectorAndParentsTo = a, ct.offsetXYFromParent = m, ct.outerHeight = c, ct.outerWidth = f, ct.removeClassName = S, ct.removeEvent = l, ct.removeUserSelectStyles = C;
  var e = ta(), t = r(Fy());
  function n(E) {
    if (typeof WeakMap != "function") return null;
    var M = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap();
    return (n = function(P) {
      return P ? _ : M;
    })(E);
  }
  function r(E, M) {
    if (E && E.__esModule)
      return E;
    if (E === null || typeof E != "object" && typeof E != "function")
      return { default: E };
    var _ = n(M);
    if (_ && _.has(E))
      return _.get(E);
    var P = {}, k = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var I in E)
      if (I !== "default" && Object.prototype.hasOwnProperty.call(E, I)) {
        var H = k ? Object.getOwnPropertyDescriptor(E, I) : null;
        H && (H.get || H.set) ? Object.defineProperty(P, I, H) : P[I] = E[I];
      }
    return P.default = E, _ && _.set(E, P), P;
  }
  let o = "";
  function i(E, M) {
    return o || (o = (0, e.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(_) {
      return (0, e.isFunction)(E[_]);
    })), (0, e.isFunction)(E[o]) ? E[o](M) : !1;
  }
  function a(E, M, _) {
    let P = E;
    do {
      if (i(P, M)) return !0;
      if (P === _) return !1;
      P = P.parentNode;
    } while (P);
    return !1;
  }
  function s(E, M, _, P) {
    if (!E) return;
    const k = {
      capture: !0,
      ...P
    };
    E.addEventListener ? E.addEventListener(M, _, k) : E.attachEvent ? E.attachEvent("on" + M, _) : E["on" + M] = _;
  }
  function l(E, M, _, P) {
    if (!E) return;
    const k = {
      capture: !0,
      ...P
    };
    E.removeEventListener ? E.removeEventListener(M, _, k) : E.detachEvent ? E.detachEvent("on" + M, _) : E["on" + M] = null;
  }
  function c(E) {
    let M = E.clientHeight;
    const _ = E.ownerDocument.defaultView.getComputedStyle(E);
    return M += (0, e.int)(_.borderTopWidth), M += (0, e.int)(_.borderBottomWidth), M;
  }
  function f(E) {
    let M = E.clientWidth;
    const _ = E.ownerDocument.defaultView.getComputedStyle(E);
    return M += (0, e.int)(_.borderLeftWidth), M += (0, e.int)(_.borderRightWidth), M;
  }
  function u(E) {
    let M = E.clientHeight;
    const _ = E.ownerDocument.defaultView.getComputedStyle(E);
    return M -= (0, e.int)(_.paddingTop), M -= (0, e.int)(_.paddingBottom), M;
  }
  function y(E) {
    let M = E.clientWidth;
    const _ = E.ownerDocument.defaultView.getComputedStyle(E);
    return M -= (0, e.int)(_.paddingLeft), M -= (0, e.int)(_.paddingRight), M;
  }
  function m(E, M, _) {
    const k = M === M.ownerDocument.body ? {
      left: 0,
      top: 0
    } : M.getBoundingClientRect(), I = (E.clientX + M.scrollLeft - k.left) / _, H = (E.clientY + M.scrollTop - k.top) / _;
    return {
      x: I,
      y: H
    };
  }
  function g(E, M) {
    const _ = d(E, M, "px");
    return {
      [(0, t.browserPrefixToKey)("transform", t.default)]: _
    };
  }
  function w(E, M) {
    return d(E, M, "");
  }
  function d(E, M, _) {
    let {
      x: P,
      y: k
    } = E, I = "translate(".concat(P).concat(_, ",").concat(k).concat(_, ")");
    if (M) {
      const H = "".concat(typeof M.x == "string" ? M.x : M.x + _), A = "".concat(typeof M.y == "string" ? M.y : M.y + _);
      I = "translate(".concat(H, ", ").concat(A, ")") + I;
    }
    return I;
  }
  function v(E, M) {
    return E.targetTouches && (0, e.findInArray)(E.targetTouches, (_) => M === _.identifier) || E.changedTouches && (0, e.findInArray)(E.changedTouches, (_) => M === _.identifier);
  }
  function p(E) {
    if (E.targetTouches && E.targetTouches[0]) return E.targetTouches[0].identifier;
    if (E.changedTouches && E.changedTouches[0]) return E.changedTouches[0].identifier;
  }
  function b(E) {
    if (!E) return;
    let M = E.getElementById("react-draggable-style-el");
    M || (M = E.createElement("style"), M.type = "text/css", M.id = "react-draggable-style-el", M.innerHTML = `.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`, M.innerHTML += `.react-draggable-transparent-selection *::selection {all: inherit;}
`, E.getElementsByTagName("head")[0].appendChild(M)), E.body && x(E.body, "react-draggable-transparent-selection");
  }
  function C(E) {
    if (E)
      try {
        if (E.body && S(E.body, "react-draggable-transparent-selection"), E.selection)
          E.selection.empty();
        else {
          const M = (E.defaultView || window).getSelection();
          M && M.type !== "Caret" && M.removeAllRanges();
        }
      } catch {
      }
  }
  function x(E, M) {
    E.classList ? E.classList.add(M) : E.className.match(new RegExp("(?:^|\\s)".concat(M, "(?!\\S)"))) || (E.className += " ".concat(M));
  }
  function S(E, M) {
    E.classList ? E.classList.remove(M) : E.className = E.className.replace(new RegExp("(?:^|\\s)".concat(M, "(?!\\S)"), "g"), "");
  }
  return ct;
}
var pn = {}, hl;
function yf() {
  if (hl) return pn;
  hl = 1, Object.defineProperty(pn, "__esModule", {
    value: !0
  }), pn.canDragX = o, pn.canDragY = i, pn.createCoreData = s, pn.createDraggableData = l, pn.getBoundPosition = n, pn.getControlPosition = a, pn.snapToGrid = r;
  var e = ta(), t = nu();
  function n(u, y, m) {
    if (!u.props.bounds) return [y, m];
    let {
      bounds: g
    } = u.props;
    g = typeof g == "string" ? g : c(g);
    const w = f(u);
    if (typeof g == "string") {
      const {
        ownerDocument: d
      } = w, v = d.defaultView;
      let p;
      if (g === "parent" ? p = w.parentNode : p = d.querySelector(g), !(p instanceof v.HTMLElement))
        throw new Error('Bounds selector "' + g + '" could not find an element.');
      const b = p, C = v.getComputedStyle(w), x = v.getComputedStyle(b);
      g = {
        left: -w.offsetLeft + (0, e.int)(x.paddingLeft) + (0, e.int)(C.marginLeft),
        top: -w.offsetTop + (0, e.int)(x.paddingTop) + (0, e.int)(C.marginTop),
        right: (0, t.innerWidth)(b) - (0, t.outerWidth)(w) - w.offsetLeft + (0, e.int)(x.paddingRight) - (0, e.int)(C.marginRight),
        bottom: (0, t.innerHeight)(b) - (0, t.outerHeight)(w) - w.offsetTop + (0, e.int)(x.paddingBottom) - (0, e.int)(C.marginBottom)
      };
    }
    return (0, e.isNum)(g.right) && (y = Math.min(y, g.right)), (0, e.isNum)(g.bottom) && (m = Math.min(m, g.bottom)), (0, e.isNum)(g.left) && (y = Math.max(y, g.left)), (0, e.isNum)(g.top) && (m = Math.max(m, g.top)), [y, m];
  }
  function r(u, y, m) {
    const g = Math.round(y / u[0]) * u[0], w = Math.round(m / u[1]) * u[1];
    return [g, w];
  }
  function o(u) {
    return u.props.axis === "both" || u.props.axis === "x";
  }
  function i(u) {
    return u.props.axis === "both" || u.props.axis === "y";
  }
  function a(u, y, m) {
    const g = typeof y == "number" ? (0, t.getTouch)(u, y) : null;
    if (typeof y == "number" && !g) return null;
    const w = f(m), d = m.props.offsetParent || w.offsetParent || w.ownerDocument.body;
    return (0, t.offsetXYFromParent)(g || u, d, m.props.scale);
  }
  function s(u, y, m) {
    const g = !(0, e.isNum)(u.lastX), w = f(u);
    return g ? {
      node: w,
      deltaX: 0,
      deltaY: 0,
      lastX: y,
      lastY: m,
      x: y,
      y: m
    } : {
      node: w,
      deltaX: y - u.lastX,
      deltaY: m - u.lastY,
      lastX: u.lastX,
      lastY: u.lastY,
      x: y,
      y: m
    };
  }
  function l(u, y) {
    const m = u.props.scale;
    return {
      node: y.node,
      x: u.state.x + y.deltaX / m,
      y: u.state.y + y.deltaY / m,
      deltaX: y.deltaX / m,
      deltaY: y.deltaY / m,
      lastX: u.state.x,
      lastY: u.state.y
    };
  }
  function c(u) {
    return {
      left: u.left,
      top: u.top,
      right: u.right,
      bottom: u.bottom
    };
  }
  function f(u) {
    const y = u.findDOMNode();
    if (!y)
      throw new Error("<DraggableCore>: Unmounted during event!");
    return y;
  }
  return pn;
}
var oo = {}, ri = {}, ml;
function bf() {
  if (ml) return ri;
  ml = 1, Object.defineProperty(ri, "__esModule", {
    value: !0
  }), ri.default = e;
  function e() {
  }
  return ri;
}
var gl;
function Hy() {
  if (gl) return oo;
  gl = 1, Object.defineProperty(oo, "__esModule", {
    value: !0
  }), oo.default = void 0;
  var e = c(K), t = s(/* @__PURE__ */ nr()), n = s(rn), r = nu(), o = yf(), i = ta(), a = s(bf());
  function s(d) {
    return d && d.__esModule ? d : { default: d };
  }
  function l(d) {
    if (typeof WeakMap != "function") return null;
    var v = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakMap();
    return (l = function(b) {
      return b ? p : v;
    })(d);
  }
  function c(d, v) {
    if (d && d.__esModule)
      return d;
    if (d === null || typeof d != "object" && typeof d != "function")
      return { default: d };
    var p = l(v);
    if (p && p.has(d))
      return p.get(d);
    var b = {}, C = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var x in d)
      if (x !== "default" && Object.prototype.hasOwnProperty.call(d, x)) {
        var S = C ? Object.getOwnPropertyDescriptor(d, x) : null;
        S && (S.get || S.set) ? Object.defineProperty(b, x, S) : b[x] = d[x];
      }
    return b.default = d, p && p.set(d, b), b;
  }
  function f(d, v, p) {
    return v = u(v), v in d ? Object.defineProperty(d, v, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : d[v] = p, d;
  }
  function u(d) {
    var v = y(d, "string");
    return typeof v == "symbol" ? v : String(v);
  }
  function y(d, v) {
    if (typeof d != "object" || d === null) return d;
    var p = d[Symbol.toPrimitive];
    if (p !== void 0) {
      var b = p.call(d, v);
      if (typeof b != "object") return b;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (v === "string" ? String : Number)(d);
  }
  const m = {
    touch: {
      start: "touchstart",
      move: "touchmove",
      stop: "touchend"
    },
    mouse: {
      start: "mousedown",
      move: "mousemove",
      stop: "mouseup"
    }
  };
  let g = m.mouse, w = class extends e.Component {
    constructor() {
      super(...arguments), f(this, "dragging", !1), f(this, "lastX", NaN), f(this, "lastY", NaN), f(this, "touchIdentifier", null), f(this, "mounted", !1), f(this, "handleDragStart", (v) => {
        if (this.props.onMouseDown(v), !this.props.allowAnyClick && typeof v.button == "number" && v.button !== 0) return !1;
        const p = this.findDOMNode();
        if (!p || !p.ownerDocument || !p.ownerDocument.body)
          throw new Error("<DraggableCore> not mounted on DragStart!");
        const {
          ownerDocument: b
        } = p;
        if (this.props.disabled || !(v.target instanceof b.defaultView.Node) || this.props.handle && !(0, r.matchesSelectorAndParentsTo)(v.target, this.props.handle, p) || this.props.cancel && (0, r.matchesSelectorAndParentsTo)(v.target, this.props.cancel, p))
          return;
        v.type === "touchstart" && v.preventDefault();
        const C = (0, r.getTouchIdentifier)(v);
        this.touchIdentifier = C;
        const x = (0, o.getControlPosition)(v, C, this);
        if (x == null) return;
        const {
          x: S,
          y: E
        } = x, M = (0, o.createCoreData)(this, S, E);
        (0, a.default)("DraggableCore: handleDragStart: %j", M), (0, a.default)("calling", this.props.onStart), !(this.props.onStart(v, M) === !1 || this.mounted === !1) && (this.props.enableUserSelectHack && (0, r.addUserSelectStyles)(b), this.dragging = !0, this.lastX = S, this.lastY = E, (0, r.addEvent)(b, g.move, this.handleDrag), (0, r.addEvent)(b, g.stop, this.handleDragStop));
      }), f(this, "handleDrag", (v) => {
        const p = (0, o.getControlPosition)(v, this.touchIdentifier, this);
        if (p == null) return;
        let {
          x: b,
          y: C
        } = p;
        if (Array.isArray(this.props.grid)) {
          let E = b - this.lastX, M = C - this.lastY;
          if ([E, M] = (0, o.snapToGrid)(this.props.grid, E, M), !E && !M) return;
          b = this.lastX + E, C = this.lastY + M;
        }
        const x = (0, o.createCoreData)(this, b, C);
        if ((0, a.default)("DraggableCore: handleDrag: %j", x), this.props.onDrag(v, x) === !1 || this.mounted === !1) {
          try {
            this.handleDragStop(new MouseEvent("mouseup"));
          } catch {
            const M = document.createEvent("MouseEvents");
            M.initMouseEvent("mouseup", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), this.handleDragStop(M);
          }
          return;
        }
        this.lastX = b, this.lastY = C;
      }), f(this, "handleDragStop", (v) => {
        if (!this.dragging) return;
        const p = (0, o.getControlPosition)(v, this.touchIdentifier, this);
        if (p == null) return;
        let {
          x: b,
          y: C
        } = p;
        if (Array.isArray(this.props.grid)) {
          let M = b - this.lastX || 0, _ = C - this.lastY || 0;
          [M, _] = (0, o.snapToGrid)(this.props.grid, M, _), b = this.lastX + M, C = this.lastY + _;
        }
        const x = (0, o.createCoreData)(this, b, C);
        if (this.props.onStop(v, x) === !1 || this.mounted === !1) return !1;
        const E = this.findDOMNode();
        E && this.props.enableUserSelectHack && (0, r.removeUserSelectStyles)(E.ownerDocument), (0, a.default)("DraggableCore: handleDragStop: %j", x), this.dragging = !1, this.lastX = NaN, this.lastY = NaN, E && ((0, a.default)("DraggableCore: Removing handlers"), (0, r.removeEvent)(E.ownerDocument, g.move, this.handleDrag), (0, r.removeEvent)(E.ownerDocument, g.stop, this.handleDragStop));
      }), f(this, "onMouseDown", (v) => (g = m.mouse, this.handleDragStart(v))), f(this, "onMouseUp", (v) => (g = m.mouse, this.handleDragStop(v))), f(this, "onTouchStart", (v) => (g = m.touch, this.handleDragStart(v))), f(this, "onTouchEnd", (v) => (g = m.touch, this.handleDragStop(v)));
    }
    componentDidMount() {
      this.mounted = !0;
      const v = this.findDOMNode();
      v && (0, r.addEvent)(v, m.touch.start, this.onTouchStart, {
        passive: !1
      });
    }
    componentWillUnmount() {
      this.mounted = !1;
      const v = this.findDOMNode();
      if (v) {
        const {
          ownerDocument: p
        } = v;
        (0, r.removeEvent)(p, m.mouse.move, this.handleDrag), (0, r.removeEvent)(p, m.touch.move, this.handleDrag), (0, r.removeEvent)(p, m.mouse.stop, this.handleDragStop), (0, r.removeEvent)(p, m.touch.stop, this.handleDragStop), (0, r.removeEvent)(v, m.touch.start, this.onTouchStart, {
          passive: !1
        }), this.props.enableUserSelectHack && (0, r.removeUserSelectStyles)(p);
      }
    }
    // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.
    findDOMNode() {
      var v, p;
      return (v = this.props) !== null && v !== void 0 && v.nodeRef ? (p = this.props) === null || p === void 0 || (p = p.nodeRef) === null || p === void 0 ? void 0 : p.current : n.default.findDOMNode(this);
    }
    render() {
      return /* @__PURE__ */ e.cloneElement(e.Children.only(this.props.children), {
        // Note: mouseMove handler is attached to document so it will still function
        // when the user drags quickly and leaves the bounds of the element.
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        // onTouchStart is added on `componentDidMount` so they can be added with
        // {passive: false}, which allows it to cancel. See
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        onTouchEnd: this.onTouchEnd
      });
    }
  };
  return oo.default = w, f(w, "displayName", "DraggableCore"), f(w, "propTypes", {
    /**
     * `allowAnyClick` allows dragging using any mouse button.
     * By default, we only accept the left button.
     *
     * Defaults to `false`.
     */
    allowAnyClick: t.default.bool,
    children: t.default.node.isRequired,
    /**
     * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
     * with the exception of `onMouseDown`, will not fire.
     */
    disabled: t.default.bool,
    /**
     * By default, we add 'user-select:none' attributes to the document body
     * to prevent ugly text selection during drag. If this is causing problems
     * for your app, set this to `false`.
     */
    enableUserSelectHack: t.default.bool,
    /**
     * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
     * instead of using the parent node.
     */
    offsetParent: function(d, v) {
      if (d[v] && d[v].nodeType !== 1)
        throw new Error("Draggable's offsetParent must be a DOM Node.");
    },
    /**
     * `grid` specifies the x and y that dragging should snap to.
     */
    grid: t.default.arrayOf(t.default.number),
    /**
     * `handle` specifies a selector to be used as the handle that initiates drag.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *         return (
     *            <Draggable handle=".handle">
     *              <div>
     *                  <div className="handle">Click me to drag</div>
     *                  <div>This is some other content</div>
     *              </div>
     *           </Draggable>
     *         );
     *       }
     *   });
     * ```
     */
    handle: t.default.string,
    /**
     * `cancel` specifies a selector to be used to prevent drag initialization.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *           return(
     *               <Draggable cancel=".cancel">
     *                   <div>
     *                     <div className="cancel">You can't drag from here</div>
     *                     <div>Dragging here works fine</div>
     *                   </div>
     *               </Draggable>
     *           );
     *       }
     *   });
     * ```
     */
    cancel: t.default.string,
    /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
     * Unfortunately, in order for <Draggable> to work properly, we need raw access
     * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
     * as in this example:
     *
     * function MyComponent() {
     *   const nodeRef = React.useRef(null);
     *   return (
     *     <Draggable nodeRef={nodeRef}>
     *       <div ref={nodeRef}>Example Target</div>
     *     </Draggable>
     *   );
     * }
     *
     * This can be used for arbitrarily nested components, so long as the ref ends up
     * pointing to the actual child DOM node and not a custom component.
     */
    nodeRef: t.default.object,
    /**
     * Called when dragging starts.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onStart: t.default.func,
    /**
     * Called while dragging.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onDrag: t.default.func,
    /**
     * Called when dragging stops.
     * If this function returns the boolean false, the drag will remain active.
     */
    onStop: t.default.func,
    /**
     * A workaround option which can be passed if onMouseDown needs to be accessed,
     * since it'll always be blocked (as there is internal use of onMouseDown)
     */
    onMouseDown: t.default.func,
    /**
     * `scale`, if set, applies scaling while dragging an element
     */
    scale: t.default.number,
    /**
     * These properties should be defined on the child, not here.
     */
    className: i.dontSetMe,
    style: i.dontSetMe,
    transform: i.dontSetMe
  }), f(w, "defaultProps", {
    allowAnyClick: !1,
    // by default only accept left click
    disabled: !1,
    enableUserSelectHack: !0,
    onStart: function() {
    },
    onDrag: function() {
    },
    onStop: function() {
    },
    onMouseDown: function() {
    },
    scale: 1
  }), oo;
}
var yl;
function Wy() {
  return yl || (yl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "DraggableCore", {
      enumerable: !0,
      get: function() {
        return l.default;
      }
    }), e.default = void 0;
    var t = y(K), n = f(/* @__PURE__ */ nr()), r = f(rn), o = f(zy), i = nu(), a = yf(), s = ta(), l = f(Hy()), c = f(bf());
    function f(p) {
      return p && p.__esModule ? p : { default: p };
    }
    function u(p) {
      if (typeof WeakMap != "function") return null;
      var b = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap();
      return (u = function(x) {
        return x ? C : b;
      })(p);
    }
    function y(p, b) {
      if (p && p.__esModule)
        return p;
      if (p === null || typeof p != "object" && typeof p != "function")
        return { default: p };
      var C = u(b);
      if (C && C.has(p))
        return C.get(p);
      var x = {}, S = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var E in p)
        if (E !== "default" && Object.prototype.hasOwnProperty.call(p, E)) {
          var M = S ? Object.getOwnPropertyDescriptor(p, E) : null;
          M && (M.get || M.set) ? Object.defineProperty(x, E, M) : x[E] = p[E];
        }
      return x.default = p, C && C.set(p, x), x;
    }
    function m() {
      return m = Object.assign ? Object.assign.bind() : function(p) {
        for (var b = 1; b < arguments.length; b++) {
          var C = arguments[b];
          for (var x in C)
            Object.prototype.hasOwnProperty.call(C, x) && (p[x] = C[x]);
        }
        return p;
      }, m.apply(this, arguments);
    }
    function g(p, b, C) {
      return b = w(b), b in p ? Object.defineProperty(p, b, { value: C, enumerable: !0, configurable: !0, writable: !0 }) : p[b] = C, p;
    }
    function w(p) {
      var b = d(p, "string");
      return typeof b == "symbol" ? b : String(b);
    }
    function d(p, b) {
      if (typeof p != "object" || p === null) return p;
      var C = p[Symbol.toPrimitive];
      if (C !== void 0) {
        var x = C.call(p, b);
        if (typeof x != "object") return x;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (b === "string" ? String : Number)(p);
    }
    class v extends t.Component {
      // React 16.3+
      // Arity (props, state)
      static getDerivedStateFromProps(b, C) {
        let {
          position: x
        } = b, {
          prevPropsPosition: S
        } = C;
        return x && (!S || x.x !== S.x || x.y !== S.y) ? ((0, c.default)("Draggable: getDerivedStateFromProps %j", {
          position: x,
          prevPropsPosition: S
        }), {
          x: x.x,
          y: x.y,
          prevPropsPosition: {
            ...x
          }
        }) : null;
      }
      constructor(b) {
        super(b), g(this, "onDragStart", (C, x) => {
          if ((0, c.default)("Draggable: onDragStart: %j", x), this.props.onStart(C, (0, a.createDraggableData)(this, x)) === !1) return !1;
          this.setState({
            dragging: !0,
            dragged: !0
          });
        }), g(this, "onDrag", (C, x) => {
          if (!this.state.dragging) return !1;
          (0, c.default)("Draggable: onDrag: %j", x);
          const S = (0, a.createDraggableData)(this, x), E = {
            x: S.x,
            y: S.y,
            slackX: 0,
            slackY: 0
          };
          if (this.props.bounds) {
            const {
              x: _,
              y: P
            } = E;
            E.x += this.state.slackX, E.y += this.state.slackY;
            const [k, I] = (0, a.getBoundPosition)(this, E.x, E.y);
            E.x = k, E.y = I, E.slackX = this.state.slackX + (_ - E.x), E.slackY = this.state.slackY + (P - E.y), S.x = E.x, S.y = E.y, S.deltaX = E.x - this.state.x, S.deltaY = E.y - this.state.y;
          }
          if (this.props.onDrag(C, S) === !1) return !1;
          this.setState(E);
        }), g(this, "onDragStop", (C, x) => {
          if (!this.state.dragging || this.props.onStop(C, (0, a.createDraggableData)(this, x)) === !1) return !1;
          (0, c.default)("Draggable: onDragStop: %j", x);
          const E = {
            dragging: !1,
            slackX: 0,
            slackY: 0
          };
          if (!!this.props.position) {
            const {
              x: _,
              y: P
            } = this.props.position;
            E.x = _, E.y = P;
          }
          this.setState(E);
        }), this.state = {
          // Whether or not we are currently dragging.
          dragging: !1,
          // Whether or not we have been dragged before.
          dragged: !1,
          // Current transform x and y.
          x: b.position ? b.position.x : b.defaultPosition.x,
          y: b.position ? b.position.y : b.defaultPosition.y,
          prevPropsPosition: {
            ...b.position
          },
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: !1
        }, b.position && !(b.onDrag || b.onStop) && console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
      }
      componentDidMount() {
        typeof window.SVGElement < "u" && this.findDOMNode() instanceof window.SVGElement && this.setState({
          isElementSVG: !0
        });
      }
      componentWillUnmount() {
        this.setState({
          dragging: !1
        });
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        var b, C;
        return (b = (C = this.props) === null || C === void 0 || (C = C.nodeRef) === null || C === void 0 ? void 0 : C.current) !== null && b !== void 0 ? b : r.default.findDOMNode(this);
      }
      render() {
        const {
          axis: b,
          bounds: C,
          children: x,
          defaultPosition: S,
          defaultClassName: E,
          defaultClassNameDragging: M,
          defaultClassNameDragged: _,
          position: P,
          positionOffset: k,
          scale: I,
          ...H
        } = this.props;
        let A = {}, L = null;
        const $ = !!!P || this.state.dragging, T = P || S, z = {
          // Set left if horizontal drag is enabled
          x: (0, a.canDragX)(this) && $ ? this.state.x : T.x,
          // Set top if vertical drag is enabled
          y: (0, a.canDragY)(this) && $ ? this.state.y : T.y
        };
        this.state.isElementSVG ? L = (0, i.createSVGTransform)(z, k) : A = (0, i.createCSSTransform)(z, k);
        const B = (0, o.default)(x.props.className || "", E, {
          [M]: this.state.dragging,
          [_]: this.state.dragged
        });
        return /* @__PURE__ */ t.createElement(l.default, m({}, H, {
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop
        }), /* @__PURE__ */ t.cloneElement(t.Children.only(x), {
          className: B,
          style: {
            ...x.props.style,
            ...A
          },
          transform: L
        }));
      }
    }
    e.default = v, g(v, "displayName", "Draggable"), g(v, "propTypes", {
      // Accepts all props <DraggableCore> accepts.
      ...l.default.propTypes,
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: n.default.oneOf(["both", "x", "y", "none"]),
      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: n.default.oneOfType([n.default.shape({
        left: n.default.number,
        right: n.default.number,
        top: n.default.number,
        bottom: n.default.number
      }), n.default.string, n.default.oneOf([!1])]),
      defaultClassName: n.default.string,
      defaultClassNameDragging: n.default.string,
      defaultClassNameDragged: n.default.string,
      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: n.default.shape({
        x: n.default.number,
        y: n.default.number
      }),
      positionOffset: n.default.shape({
        x: n.default.oneOfType([n.default.number, n.default.string]),
        y: n.default.oneOfType([n.default.number, n.default.string])
      }),
      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: n.default.shape({
        x: n.default.number,
        y: n.default.number
      }),
      /**
       * These properties should be defined on the child, not here.
       */
      className: s.dontSetMe,
      style: s.dontSetMe,
      transform: s.dontSetMe
    }), g(v, "defaultProps", {
      ...l.default.defaultProps,
      axis: "both",
      bounds: !1,
      defaultClassName: "react-draggable",
      defaultClassNameDragging: "react-draggable-dragging",
      defaultClassNameDragged: "react-draggable-dragged",
      defaultPosition: {
        x: 0,
        y: 0
      },
      scale: 1
    });
  })(za)), za;
}
var bl;
function ru() {
  if (bl) return ro.exports;
  bl = 1;
  const {
    default: e,
    DraggableCore: t
  } = Wy();
  return ro.exports = e, ro.exports.default = e, ro.exports.DraggableCore = t, ro.exports;
}
var io = { exports: {} }, ao = {}, oi = {}, wl;
function By() {
  if (wl) return oi;
  wl = 1, oi.__esModule = !0, oi.cloneElement = s;
  var e = t(K);
  function t(l) {
    return l && l.__esModule ? l : { default: l };
  }
  function n(l, c) {
    var f = Object.keys(l);
    if (Object.getOwnPropertySymbols) {
      var u = Object.getOwnPropertySymbols(l);
      c && (u = u.filter(function(y) {
        return Object.getOwnPropertyDescriptor(l, y).enumerable;
      })), f.push.apply(f, u);
    }
    return f;
  }
  function r(l) {
    for (var c = 1; c < arguments.length; c++) {
      var f = arguments[c] != null ? arguments[c] : {};
      c % 2 ? n(Object(f), !0).forEach(function(u) {
        o(l, u, f[u]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(l, Object.getOwnPropertyDescriptors(f)) : n(Object(f)).forEach(function(u) {
        Object.defineProperty(l, u, Object.getOwnPropertyDescriptor(f, u));
      });
    }
    return l;
  }
  function o(l, c, f) {
    return c = i(c), c in l ? Object.defineProperty(l, c, { value: f, enumerable: !0, configurable: !0, writable: !0 }) : l[c] = f, l;
  }
  function i(l) {
    var c = a(l, "string");
    return typeof c == "symbol" ? c : String(c);
  }
  function a(l, c) {
    if (typeof l != "object" || l === null) return l;
    var f = l[Symbol.toPrimitive];
    if (f !== void 0) {
      var u = f.call(l, c);
      if (typeof u != "object") return u;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (c === "string" ? String : Number)(l);
  }
  function s(l, c) {
    return c.style && l.props.style && (c.style = r(r({}, l.props.style), c.style)), c.className && l.props.className && (c.className = l.props.className + " " + c.className), /* @__PURE__ */ e.default.cloneElement(l, c);
  }
  return oi;
}
var so = {}, xl;
function wf() {
  if (xl) return so;
  xl = 1, so.__esModule = !0, so.resizableProps = void 0;
  var e = t(/* @__PURE__ */ nr());
  ru();
  function t(r) {
    return r && r.__esModule ? r : { default: r };
  }
  var n = {
    /*
    * Restricts resizing to a particular axis (default: 'both')
    * 'both' - allows resizing by width or height
    * 'x' - only allows the width to be changed
    * 'y' - only allows the height to be changed
    * 'none' - disables resizing altogether
    * */
    axis: e.default.oneOf(["both", "x", "y", "none"]),
    className: e.default.string,
    /*
    * Require that one and only one child be present.
    * */
    children: e.default.element.isRequired,
    /*
    * These will be passed wholesale to react-draggable's DraggableCore
    * */
    draggableOpts: e.default.shape({
      allowAnyClick: e.default.bool,
      cancel: e.default.string,
      children: e.default.node,
      disabled: e.default.bool,
      enableUserSelectHack: e.default.bool,
      offsetParent: e.default.node,
      grid: e.default.arrayOf(e.default.number),
      handle: e.default.string,
      nodeRef: e.default.object,
      onStart: e.default.func,
      onDrag: e.default.func,
      onStop: e.default.func,
      onMouseDown: e.default.func,
      scale: e.default.number
    }),
    /*
    * Initial height
    * */
    height: function() {
      for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++)
        i[a] = arguments[a];
      var s = i[0];
      if (s.axis === "both" || s.axis === "y") {
        var l;
        return (l = e.default.number).isRequired.apply(l, i);
      }
      return e.default.number.apply(e.default, i);
    },
    /*
    * Customize cursor resize handle
    * */
    handle: e.default.oneOfType([e.default.node, e.default.func]),
    /*
    * If you change this, be sure to update your css
    * */
    handleSize: e.default.arrayOf(e.default.number),
    lockAspectRatio: e.default.bool,
    /*
    * Max X & Y measure
    * */
    maxConstraints: e.default.arrayOf(e.default.number),
    /*
    * Min X & Y measure
    * */
    minConstraints: e.default.arrayOf(e.default.number),
    /*
    * Called on stop resize event
    * */
    onResizeStop: e.default.func,
    /*
    * Called on start resize event
    * */
    onResizeStart: e.default.func,
    /*
    * Called on resize event
    * */
    onResize: e.default.func,
    /*
    * Defines which resize handles should be rendered (default: 'se')
    * 's' - South handle (bottom-center)
    * 'w' - West handle (left-center)
    * 'e' - East handle (right-center)
    * 'n' - North handle (top-center)
    * 'sw' - Southwest handle (bottom-left)
    * 'nw' - Northwest handle (top-left)
    * 'se' - Southeast handle (bottom-right)
    * 'ne' - Northeast handle (top-center)
    * */
    resizeHandles: e.default.arrayOf(e.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
    /*
    * If `transform: scale(n)` is set on the parent, this should be set to `n`.
    * */
    transformScale: e.default.number,
    /*
     * Initial width
     */
    width: function() {
      for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++)
        i[a] = arguments[a];
      var s = i[0];
      if (s.axis === "both" || s.axis === "x") {
        var l;
        return (l = e.default.number).isRequired.apply(l, i);
      }
      return e.default.number.apply(e.default, i);
    }
  };
  return so.resizableProps = n, so;
}
var Cl;
function xf() {
  if (Cl) return ao;
  Cl = 1, ao.__esModule = !0, ao.default = void 0;
  var e = a(K), t = ru(), n = By(), r = wf(), o = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
  function i(v) {
    if (typeof WeakMap != "function") return null;
    var p = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap();
    return (i = function(x) {
      return x ? b : p;
    })(v);
  }
  function a(v, p) {
    if (v && v.__esModule)
      return v;
    if (v === null || typeof v != "object" && typeof v != "function")
      return { default: v };
    var b = i(p);
    if (b && b.has(v))
      return b.get(v);
    var C = {}, x = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var S in v)
      if (S !== "default" && Object.prototype.hasOwnProperty.call(v, S)) {
        var E = x ? Object.getOwnPropertyDescriptor(v, S) : null;
        E && (E.get || E.set) ? Object.defineProperty(C, S, E) : C[S] = v[S];
      }
    return C.default = v, b && b.set(v, C), C;
  }
  function s() {
    return s = Object.assign ? Object.assign.bind() : function(v) {
      for (var p = 1; p < arguments.length; p++) {
        var b = arguments[p];
        for (var C in b)
          Object.prototype.hasOwnProperty.call(b, C) && (v[C] = b[C]);
      }
      return v;
    }, s.apply(this, arguments);
  }
  function l(v, p) {
    if (v == null) return {};
    var b = {}, C = Object.keys(v), x, S;
    for (S = 0; S < C.length; S++)
      x = C[S], !(p.indexOf(x) >= 0) && (b[x] = v[x]);
    return b;
  }
  function c(v, p) {
    var b = Object.keys(v);
    if (Object.getOwnPropertySymbols) {
      var C = Object.getOwnPropertySymbols(v);
      p && (C = C.filter(function(x) {
        return Object.getOwnPropertyDescriptor(v, x).enumerable;
      })), b.push.apply(b, C);
    }
    return b;
  }
  function f(v) {
    for (var p = 1; p < arguments.length; p++) {
      var b = arguments[p] != null ? arguments[p] : {};
      p % 2 ? c(Object(b), !0).forEach(function(C) {
        u(v, C, b[C]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(v, Object.getOwnPropertyDescriptors(b)) : c(Object(b)).forEach(function(C) {
        Object.defineProperty(v, C, Object.getOwnPropertyDescriptor(b, C));
      });
    }
    return v;
  }
  function u(v, p, b) {
    return p = y(p), p in v ? Object.defineProperty(v, p, { value: b, enumerable: !0, configurable: !0, writable: !0 }) : v[p] = b, v;
  }
  function y(v) {
    var p = m(v, "string");
    return typeof p == "symbol" ? p : String(p);
  }
  function m(v, p) {
    if (typeof v != "object" || v === null) return v;
    var b = v[Symbol.toPrimitive];
    if (b !== void 0) {
      var C = b.call(v, p);
      if (typeof C != "object") return C;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (p === "string" ? String : Number)(v);
  }
  function g(v, p) {
    v.prototype = Object.create(p.prototype), v.prototype.constructor = v, w(v, p);
  }
  function w(v, p) {
    return w = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(C, x) {
      return C.__proto__ = x, C;
    }, w(v, p);
  }
  var d = /* @__PURE__ */ (function(v) {
    g(p, v);
    function p() {
      for (var C, x = arguments.length, S = new Array(x), E = 0; E < x; E++)
        S[E] = arguments[E];
      return C = v.call.apply(v, [this].concat(S)) || this, C.handleRefs = {}, C.lastHandleRect = null, C.slack = null, C;
    }
    var b = p.prototype;
    return b.componentWillUnmount = function() {
      this.resetData();
    }, b.resetData = function() {
      this.lastHandleRect = this.slack = null;
    }, b.runConstraints = function(x, S) {
      var E = this.props, M = E.minConstraints, _ = E.maxConstraints, P = E.lockAspectRatio;
      if (!M && !_ && !P) return [x, S];
      if (P) {
        var k = this.props.width / this.props.height, I = x - this.props.width, H = S - this.props.height;
        Math.abs(I) > Math.abs(H * k) ? S = x / k : x = S * k;
      }
      var A = x, L = S, N = this.slack || [0, 0], $ = N[0], T = N[1];
      return x += $, S += T, M && (x = Math.max(M[0], x), S = Math.max(M[1], S)), _ && (x = Math.min(_[0], x), S = Math.min(_[1], S)), this.slack = [$ + (A - x), T + (L - S)], [x, S];
    }, b.resizeHandler = function(x, S) {
      var E = this;
      return function(M, _) {
        var P = _.node, k = _.deltaX, I = _.deltaY;
        x === "onResizeStart" && E.resetData();
        var H = (E.props.axis === "both" || E.props.axis === "x") && S !== "n" && S !== "s", A = (E.props.axis === "both" || E.props.axis === "y") && S !== "e" && S !== "w";
        if (!(!H && !A)) {
          var L = S[0], N = S[S.length - 1], $ = P.getBoundingClientRect();
          if (E.lastHandleRect != null) {
            if (N === "w") {
              var T = $.left - E.lastHandleRect.left;
              k += T;
            }
            if (L === "n") {
              var z = $.top - E.lastHandleRect.top;
              I += z;
            }
          }
          E.lastHandleRect = $, N === "w" && (k = -k), L === "n" && (I = -I);
          var B = E.props.width + (H ? k / E.props.transformScale : 0), W = E.props.height + (A ? I / E.props.transformScale : 0), Y = E.runConstraints(B, W);
          B = Y[0], W = Y[1];
          var U = B !== E.props.width || W !== E.props.height, V = typeof E.props[x] == "function" ? E.props[x] : null, Z = x === "onResize" && !U;
          V && !Z && (M.persist == null || M.persist(), V(M, {
            node: P,
            size: {
              width: B,
              height: W
            },
            handle: S
          })), x === "onResizeStop" && E.resetData();
        }
      };
    }, b.renderResizeHandle = function(x, S) {
      var E = this.props.handle;
      if (!E)
        return /* @__PURE__ */ e.createElement("span", {
          className: "react-resizable-handle react-resizable-handle-" + x,
          ref: S
        });
      if (typeof E == "function")
        return E(x, S);
      var M = typeof E.type == "string", _ = f({
        ref: S
      }, M ? {} : {
        handleAxis: x
      });
      return /* @__PURE__ */ e.cloneElement(E, _);
    }, b.render = function() {
      var x = this, S = this.props, E = S.children, M = S.className, _ = S.draggableOpts;
      S.width, S.height, S.handle, S.handleSize, S.lockAspectRatio, S.axis, S.minConstraints, S.maxConstraints, S.onResize, S.onResizeStop, S.onResizeStart;
      var P = S.resizeHandles;
      S.transformScale;
      var k = l(S, o);
      return (0, n.cloneElement)(E, f(f({}, k), {}, {
        className: (M ? M + " " : "") + "react-resizable",
        children: [].concat(E.props.children, P.map(function(I) {
          var H, A = (H = x.handleRefs[I]) != null ? H : x.handleRefs[I] = /* @__PURE__ */ e.createRef();
          return /* @__PURE__ */ e.createElement(t.DraggableCore, s({}, _, {
            nodeRef: A,
            key: "resizableHandle-" + I,
            onStop: x.resizeHandler("onResizeStop", I),
            onStart: x.resizeHandler("onResizeStart", I),
            onDrag: x.resizeHandler("onResize", I)
          }), x.renderResizeHandle(I, A));
        }))
      }));
    }, p;
  })(e.Component);
  return ao.default = d, d.propTypes = r.resizableProps, d.defaultProps = {
    axis: "both",
    handleSize: [20, 20],
    lockAspectRatio: !1,
    minConstraints: [20, 20],
    maxConstraints: [1 / 0, 1 / 0],
    resizeHandles: ["se"],
    transformScale: 1
  }, ao;
}
var uo = {}, Sl;
function jy() {
  if (Sl) return uo;
  Sl = 1, uo.__esModule = !0, uo.default = void 0;
  var e = s(K), t = i(/* @__PURE__ */ nr()), n = i(xf()), r = wf(), o = ["handle", "handleSize", "onResize", "onResizeStart", "onResizeStop", "draggableOpts", "minConstraints", "maxConstraints", "lockAspectRatio", "axis", "width", "height", "resizeHandles", "style", "transformScale"];
  function i(p) {
    return p && p.__esModule ? p : { default: p };
  }
  function a(p) {
    if (typeof WeakMap != "function") return null;
    var b = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap();
    return (a = function(S) {
      return S ? C : b;
    })(p);
  }
  function s(p, b) {
    if (p && p.__esModule)
      return p;
    if (p === null || typeof p != "object" && typeof p != "function")
      return { default: p };
    var C = a(b);
    if (C && C.has(p))
      return C.get(p);
    var x = {}, S = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var E in p)
      if (E !== "default" && Object.prototype.hasOwnProperty.call(p, E)) {
        var M = S ? Object.getOwnPropertyDescriptor(p, E) : null;
        M && (M.get || M.set) ? Object.defineProperty(x, E, M) : x[E] = p[E];
      }
    return x.default = p, C && C.set(p, x), x;
  }
  function l() {
    return l = Object.assign ? Object.assign.bind() : function(p) {
      for (var b = 1; b < arguments.length; b++) {
        var C = arguments[b];
        for (var x in C)
          Object.prototype.hasOwnProperty.call(C, x) && (p[x] = C[x]);
      }
      return p;
    }, l.apply(this, arguments);
  }
  function c(p, b) {
    var C = Object.keys(p);
    if (Object.getOwnPropertySymbols) {
      var x = Object.getOwnPropertySymbols(p);
      b && (x = x.filter(function(S) {
        return Object.getOwnPropertyDescriptor(p, S).enumerable;
      })), C.push.apply(C, x);
    }
    return C;
  }
  function f(p) {
    for (var b = 1; b < arguments.length; b++) {
      var C = arguments[b] != null ? arguments[b] : {};
      b % 2 ? c(Object(C), !0).forEach(function(x) {
        u(p, x, C[x]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(p, Object.getOwnPropertyDescriptors(C)) : c(Object(C)).forEach(function(x) {
        Object.defineProperty(p, x, Object.getOwnPropertyDescriptor(C, x));
      });
    }
    return p;
  }
  function u(p, b, C) {
    return b = y(b), b in p ? Object.defineProperty(p, b, { value: C, enumerable: !0, configurable: !0, writable: !0 }) : p[b] = C, p;
  }
  function y(p) {
    var b = m(p, "string");
    return typeof b == "symbol" ? b : String(b);
  }
  function m(p, b) {
    if (typeof p != "object" || p === null) return p;
    var C = p[Symbol.toPrimitive];
    if (C !== void 0) {
      var x = C.call(p, b);
      if (typeof x != "object") return x;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (b === "string" ? String : Number)(p);
  }
  function g(p, b) {
    if (p == null) return {};
    var C = {}, x = Object.keys(p), S, E;
    for (E = 0; E < x.length; E++)
      S = x[E], !(b.indexOf(S) >= 0) && (C[S] = p[S]);
    return C;
  }
  function w(p, b) {
    p.prototype = Object.create(b.prototype), p.prototype.constructor = p, d(p, b);
  }
  function d(p, b) {
    return d = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(x, S) {
      return x.__proto__ = S, x;
    }, d(p, b);
  }
  var v = /* @__PURE__ */ (function(p) {
    w(b, p);
    function b() {
      for (var x, S = arguments.length, E = new Array(S), M = 0; M < S; M++)
        E[M] = arguments[M];
      return x = p.call.apply(p, [this].concat(E)) || this, x.state = {
        width: x.props.width,
        height: x.props.height,
        propsWidth: x.props.width,
        propsHeight: x.props.height
      }, x.onResize = function(_, P) {
        var k = P.size;
        x.props.onResize ? (_.persist == null || _.persist(), x.setState(k, function() {
          return x.props.onResize && x.props.onResize(_, P);
        })) : x.setState(k);
      }, x;
    }
    b.getDerivedStateFromProps = function(S, E) {
      return E.propsWidth !== S.width || E.propsHeight !== S.height ? {
        width: S.width,
        height: S.height,
        propsWidth: S.width,
        propsHeight: S.height
      } : null;
    };
    var C = b.prototype;
    return C.render = function() {
      var S = this.props, E = S.handle, M = S.handleSize;
      S.onResize;
      var _ = S.onResizeStart, P = S.onResizeStop, k = S.draggableOpts, I = S.minConstraints, H = S.maxConstraints, A = S.lockAspectRatio, L = S.axis;
      S.width, S.height;
      var N = S.resizeHandles, $ = S.style, T = S.transformScale, z = g(S, o);
      return /* @__PURE__ */ e.createElement(n.default, {
        axis: L,
        draggableOpts: k,
        handle: E,
        handleSize: M,
        height: this.state.height,
        lockAspectRatio: A,
        maxConstraints: H,
        minConstraints: I,
        onResizeStart: _,
        onResize: this.onResize,
        onResizeStop: P,
        resizeHandles: N,
        transformScale: T,
        width: this.state.width
      }, /* @__PURE__ */ e.createElement("div", l({}, z, {
        style: f(f({}, $), {}, {
          width: this.state.width + "px",
          height: this.state.height + "px"
        })
      })));
    }, b;
  })(e.Component);
  return uo.default = v, v.propTypes = f(f({}, r.resizableProps), {}, {
    children: t.default.element
  }), uo;
}
var El;
function Vy() {
  return El || (El = 1, io.exports = function() {
    throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
  }, io.exports.Resizable = xf().default, io.exports.ResizableBox = jy().default), io.exports;
}
var Pn = {}, Rl;
function Cf() {
  if (Rl) return Pn;
  Rl = 1, Object.defineProperty(Pn, "__esModule", {
    value: !0
  }), Pn.resizeHandleType = Pn.resizeHandleAxesType = Pn.default = void 0;
  var e = n(/* @__PURE__ */ nr()), t = n(K);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  const r = Pn.resizeHandleAxesType = e.default.arrayOf(e.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])), o = Pn.resizeHandleType = e.default.oneOfType([e.default.node, e.default.func]);
  return Pn.default = {
    //
    // Basic props
    //
    className: e.default.string,
    style: e.default.object,
    // This can be set explicitly. If it is not set, it will automatically
    // be set to the container width. Note that resizes will *not* cause this to adjust.
    // If you need that behavior, use WidthProvider.
    width: e.default.number,
    // If true, the container height swells and contracts to fit contents
    autoSize: e.default.bool,
    // # of cols.
    cols: e.default.number,
    // A selector that will not be draggable.
    draggableCancel: e.default.string,
    // A selector for the draggable handler
    draggableHandle: e.default.string,
    // Deprecated
    verticalCompact: function(i) {
      i.verticalCompact;
    },
    // Choose vertical or hotizontal compaction
    compactType: e.default.oneOf(["vertical", "horizontal"]),
    // layout is an array of object with the format:
    // {x: Number, y: Number, w: Number, h: Number, i: String}
    layout: function(i) {
      var a = i.layout;
      a !== void 0 && Gr().validateLayout(a, "layout");
    },
    //
    // Grid Dimensions
    //
    // Margin between items [x, y] in px
    margin: e.default.arrayOf(e.default.number),
    // Padding inside the container [x, y] in px
    containerPadding: e.default.arrayOf(e.default.number),
    // Rows have a static height, but you can change this based on breakpoints if you like
    rowHeight: e.default.number,
    // Default Infinity, but you can specify a max here if you like.
    // Note that this isn't fully fleshed out and won't error if you specify a layout that
    // extends beyond the row capacity. It will, however, not allow users to drag/resize
    // an item past the barrier. They can push items beyond the barrier, though.
    // Intentionally not documented for this reason.
    maxRows: e.default.number,
    //
    // Flags
    //
    isBounded: e.default.bool,
    isDraggable: e.default.bool,
    isResizable: e.default.bool,
    // If true, grid can be placed one over the other.
    allowOverlap: e.default.bool,
    // If true, grid items won't change position when being dragged over.
    preventCollision: e.default.bool,
    // Use CSS transforms instead of top/left
    useCSSTransforms: e.default.bool,
    // parent layout transform scale
    transformScale: e.default.number,
    // If true, an external element can trigger onDrop callback with a specific grid position as a parameter
    isDroppable: e.default.bool,
    // Resize handle options
    resizeHandles: r,
    resizeHandle: o,
    //
    // Callbacks
    //
    // Callback so you can save the layout. Calls after each drag & resize stops.
    onLayoutChange: e.default.func,
    // Calls when drag starts. Callback is of the signature (layout, oldItem, newItem, placeholder, e, ?node).
    // All callbacks below have the same signature. 'start' and 'stop' callbacks omit the 'placeholder'.
    onDragStart: e.default.func,
    // Calls on each drag movement.
    onDrag: e.default.func,
    // Calls when drag is complete.
    onDragStop: e.default.func,
    //Calls when resize starts.
    onResizeStart: e.default.func,
    // Calls when resize movement happens.
    onResize: e.default.func,
    // Calls when resize is complete.
    onResizeStop: e.default.func,
    // Calls when some element is dropped.
    onDrop: e.default.func,
    //
    // Other validations
    //
    droppingItem: e.default.shape({
      i: e.default.string.isRequired,
      w: e.default.number.isRequired,
      h: e.default.number.isRequired
    }),
    // Children must not have duplicate keys.
    children: function(i, a) {
      const s = i[a], l = {};
      t.default.Children.forEach(s, function(c) {
        if ((c == null ? void 0 : c.key) != null) {
          if (l[c.key])
            throw new Error('Duplicate child key "' + c.key + '" found! This will cause problems in ReactGridLayout.');
          l[c.key] = !0;
        }
      });
    },
    // Optional ref for getting a reference for the wrapping div.
    innerRef: e.default.any
  }, Pn;
}
var Ml;
function qy() {
  if (Ml) return no;
  Ml = 1, Object.defineProperty(no, "__esModule", {
    value: !0
  }), no.default = void 0;
  var e = c(K), t = rn, n = c(/* @__PURE__ */ nr()), r = ru(), o = Vy(), i = Gr(), a = tu(), s = Cf(), l = c(eu());
  function c(g) {
    return g && g.__esModule ? g : { default: g };
  }
  function f(g, w, d) {
    return w = u(w), w in g ? Object.defineProperty(g, w, { value: d, enumerable: !0, configurable: !0, writable: !0 }) : g[w] = d, g;
  }
  function u(g) {
    var w = y(g, "string");
    return typeof w == "symbol" ? w : String(w);
  }
  function y(g, w) {
    if (typeof g != "object" || g === null) return g;
    var d = g[Symbol.toPrimitive];
    if (d !== void 0) {
      var v = d.call(g, w);
      if (typeof v != "object") return v;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (w === "string" ? String : Number)(g);
  }
  let m = class extends e.default.Component {
    constructor() {
      super(...arguments), f(this, "state", {
        resizing: null,
        dragging: null,
        className: ""
      }), f(this, "elementRef", /* @__PURE__ */ e.default.createRef()), f(this, "onDragStart", (w, d) => {
        let {
          node: v
        } = d;
        const {
          onDragStart: p,
          transformScale: b
        } = this.props;
        if (!p) return;
        const C = {
          top: 0,
          left: 0
        }, {
          offsetParent: x
        } = v;
        if (!x) return;
        const S = x.getBoundingClientRect(), E = v.getBoundingClientRect(), M = E.left / b, _ = S.left / b, P = E.top / b, k = S.top / b;
        C.left = M - _ + x.scrollLeft, C.top = P - k + x.scrollTop, this.setState({
          dragging: C
        });
        const {
          x: I,
          y: H
        } = (0, a.calcXY)(this.getPositionParams(), C.top, C.left, this.props.w, this.props.h);
        return p.call(this, this.props.i, I, H, {
          e: w,
          node: v,
          newPosition: C
        });
      }), f(this, "onDrag", (w, d, v) => {
        let {
          node: p,
          deltaX: b,
          deltaY: C
        } = d;
        const {
          onDrag: x
        } = this.props;
        if (!x) return;
        if (!this.state.dragging)
          throw new Error("onDrag called before onDragStart.");
        let S = this.state.dragging.top + C, E = this.state.dragging.left + b;
        const {
          isBounded: M,
          i: _,
          w: P,
          h: k,
          containerWidth: I
        } = this.props, H = this.getPositionParams();
        if (M) {
          const {
            offsetParent: $
          } = p;
          if ($) {
            const {
              margin: T,
              rowHeight: z,
              containerPadding: B
            } = this.props, W = $.clientHeight - (0, a.calcGridItemWHPx)(k, z, T[1]);
            S = (0, a.clamp)(S - B[1], 0, W);
            const Y = (0, a.calcGridColWidth)(H), U = I - (0, a.calcGridItemWHPx)(P, Y, T[0]);
            E = (0, a.clamp)(E - B[0], 0, U);
          }
        }
        const A = {
          top: S,
          left: E
        };
        v ? this.setState({
          dragging: A
        }) : (0, t.flushSync)(() => {
          this.setState({
            dragging: A
          });
        });
        const {
          x: L,
          y: N
        } = (0, a.calcXY)(H, S, E, P, k);
        return x.call(this, _, L, N, {
          e: w,
          node: p,
          newPosition: A
        });
      }), f(this, "onDragStop", (w, d) => {
        let {
          node: v
        } = d;
        const {
          onDragStop: p
        } = this.props;
        if (!p) return;
        if (!this.state.dragging)
          throw new Error("onDragEnd called before onDragStart.");
        const {
          w: b,
          h: C,
          i: x
        } = this.props, {
          left: S,
          top: E
        } = this.state.dragging, M = {
          top: E,
          left: S
        };
        this.setState({
          dragging: null
        });
        const {
          x: _,
          y: P
        } = (0, a.calcXY)(this.getPositionParams(), E, S, b, C);
        return p.call(this, x, _, P, {
          e: w,
          node: v,
          newPosition: M
        });
      }), f(this, "onResizeStop", (w, d, v) => this.onResizeHandler(w, d, v, "onResizeStop")), f(this, "onResizeStart", (w, d, v) => this.onResizeHandler(w, d, v, "onResizeStart")), f(this, "onResize", (w, d, v) => this.onResizeHandler(w, d, v, "onResize"));
    }
    shouldComponentUpdate(w, d) {
      if (this.props.children !== w.children || this.props.droppingPosition !== w.droppingPosition) return !0;
      const v = (0, a.calcGridItemPosition)(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state), p = (0, a.calcGridItemPosition)(this.getPositionParams(w), w.x, w.y, w.w, w.h, d);
      return !(0, i.fastPositionEqual)(v, p) || this.props.useCSSTransforms !== w.useCSSTransforms;
    }
    componentDidMount() {
      this.moveDroppingItem({});
    }
    componentDidUpdate(w) {
      this.moveDroppingItem(w);
    }
    // When a droppingPosition is present, this means we should fire a move event, as if we had moved
    // this element by `x, y` pixels.
    moveDroppingItem(w) {
      const {
        droppingPosition: d
      } = this.props;
      if (!d) return;
      const v = this.elementRef.current;
      if (!v) return;
      const p = w.droppingPosition || {
        left: 0,
        top: 0
      }, {
        dragging: b
      } = this.state, C = b && d.left !== p.left || d.top !== p.top;
      if (!b)
        this.onDragStart(d.e, {
          node: v,
          deltaX: d.left,
          deltaY: d.top
        });
      else if (C) {
        const x = d.left - b.left, S = d.top - b.top;
        this.onDrag(
          d.e,
          {
            node: v,
            deltaX: x,
            deltaY: S
          },
          !0
          // dontFLush: avoid flushSync to temper warnings
        );
      }
    }
    getPositionParams() {
      let w = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.props;
      return {
        cols: w.cols,
        containerPadding: w.containerPadding,
        containerWidth: w.containerWidth,
        margin: w.margin,
        maxRows: w.maxRows,
        rowHeight: w.rowHeight
      };
    }
    /**
     * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
     * well when server rendering, and the only way to do that properly is to use percentage width/left because
     * we don't know exactly what the browser viewport is.
     * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
     * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
     *
     * @param  {Object} pos Position object with width, height, left, top.
     * @return {Object}     Style object.
     */
    createStyle(w) {
      const {
        usePercentages: d,
        containerWidth: v,
        useCSSTransforms: p
      } = this.props;
      let b;
      return p ? b = (0, i.setTransform)(w) : (b = (0, i.setTopLeft)(w), d && (b.left = (0, i.perc)(w.left / v), b.width = (0, i.perc)(w.width / v))), b;
    }
    /**
     * Mix a Draggable instance into a child.
     * @param  {Element} child    Child element.
     * @return {Element}          Child wrapped in Draggable.
     */
    mixinDraggable(w, d) {
      return /* @__PURE__ */ e.default.createElement(r.DraggableCore, {
        disabled: !d,
        onStart: this.onDragStart,
        onDrag: this.onDrag,
        onStop: this.onDragStop,
        handle: this.props.handle,
        cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : ""),
        scale: this.props.transformScale,
        nodeRef: this.elementRef
      }, w);
    }
    /**
     * Utility function to setup callback handler definitions for
     * similarily structured resize events.
     */
    curryResizeHandler(w, d) {
      return (v, p) => (
        /*: Function*/
        d(v, p, w)
      );
    }
    /**
     * Mix a Resizable instance into a child.
     * @param  {Element} child    Child element.
     * @param  {Object} position  Position object (pixel values)
     * @return {Element}          Child wrapped in Resizable.
     */
    mixinResizable(w, d, v) {
      const {
        cols: p,
        minW: b,
        minH: C,
        maxW: x,
        maxH: S,
        transformScale: E,
        resizeHandles: M,
        resizeHandle: _
      } = this.props, P = this.getPositionParams(), k = (0, a.calcGridItemPosition)(P, 0, 0, p, 0).width, I = (0, a.calcGridItemPosition)(P, 0, 0, b, C), H = (0, a.calcGridItemPosition)(P, 0, 0, x, S), A = [I.width, I.height], L = [Math.min(H.width, k), Math.min(H.height, 1 / 0)];
      return /* @__PURE__ */ e.default.createElement(
        o.Resizable,
        {
          draggableOpts: {
            disabled: !v
          },
          className: v ? void 0 : "react-resizable-hide",
          width: d.width,
          height: d.height,
          minConstraints: A,
          maxConstraints: L,
          onResizeStop: this.curryResizeHandler(d, this.onResizeStop),
          onResizeStart: this.curryResizeHandler(d, this.onResizeStart),
          onResize: this.curryResizeHandler(d, this.onResize),
          transformScale: E,
          resizeHandles: M,
          handle: _
        },
        w
      );
    }
    /**
     * Wrapper around resize events to provide more useful data.
     */
    onResizeHandler(w, d, v, p) {
      let {
        node: b,
        size: C,
        handle: x
      } = d;
      const S = this.props[p];
      if (!S) return;
      const {
        x: E,
        y: M,
        i: _,
        maxH: P,
        minH: k,
        containerWidth: I
      } = this.props, {
        minW: H,
        maxW: A
      } = this.props;
      let L = C;
      b && (L = (0, i.resizeItemInDirection)(x, v, C, I), (0, t.flushSync)(() => {
        this.setState({
          resizing: p === "onResizeStop" ? null : L
        });
      }));
      let {
        w: N,
        h: $
      } = (0, a.calcWH)(this.getPositionParams(), L.width, L.height, E, M, x);
      N = (0, a.clamp)(N, Math.max(H, 1), A), $ = (0, a.clamp)($, k, P), S.call(this, _, N, $, {
        e: w,
        node: b,
        size: L,
        handle: x
      });
    }
    render() {
      const {
        x: w,
        y: d,
        w: v,
        h: p,
        isDraggable: b,
        isResizable: C,
        droppingPosition: x,
        useCSSTransforms: S
      } = this.props, E = (0, a.calcGridItemPosition)(this.getPositionParams(), w, d, v, p, this.state), M = e.default.Children.only(this.props.children);
      let _ = /* @__PURE__ */ e.default.cloneElement(M, {
        ref: this.elementRef,
        className: (0, l.default)("react-grid-item", M.props.className, this.props.className, {
          static: this.props.static,
          resizing: !!this.state.resizing,
          "react-draggable": b,
          "react-draggable-dragging": !!this.state.dragging,
          dropping: !!x,
          cssTransforms: S
        }),
        // We can set the width and height on the child, but unfortunately we can't set the position.
        style: {
          ...this.props.style,
          ...M.props.style,
          ...this.createStyle(E)
        }
      });
      return _ = this.mixinResizable(_, E, C), _ = this.mixinDraggable(_, b), _;
    }
  };
  return no.default = m, f(m, "propTypes", {
    // Children must be only a single element
    children: n.default.element,
    // General grid attributes
    cols: n.default.number.isRequired,
    containerWidth: n.default.number.isRequired,
    rowHeight: n.default.number.isRequired,
    margin: n.default.array.isRequired,
    maxRows: n.default.number.isRequired,
    containerPadding: n.default.array.isRequired,
    // These are all in grid units
    x: n.default.number.isRequired,
    y: n.default.number.isRequired,
    w: n.default.number.isRequired,
    h: n.default.number.isRequired,
    // All optional
    minW: function(g, w) {
      const d = g[w];
      if (typeof d != "number") return new Error("minWidth not Number");
      if (d > g.w || d > g.maxW) return new Error("minWidth larger than item width/maxWidth");
    },
    maxW: function(g, w) {
      const d = g[w];
      if (typeof d != "number") return new Error("maxWidth not Number");
      if (d < g.w || d < g.minW) return new Error("maxWidth smaller than item width/minWidth");
    },
    minH: function(g, w) {
      const d = g[w];
      if (typeof d != "number") return new Error("minHeight not Number");
      if (d > g.h || d > g.maxH) return new Error("minHeight larger than item height/maxHeight");
    },
    maxH: function(g, w) {
      const d = g[w];
      if (typeof d != "number") return new Error("maxHeight not Number");
      if (d < g.h || d < g.minH) return new Error("maxHeight smaller than item height/minHeight");
    },
    // ID is nice to have for callbacks
    i: n.default.string.isRequired,
    // Resize handle options
    resizeHandles: s.resizeHandleAxesType,
    resizeHandle: s.resizeHandleType,
    // Functions
    onDragStop: n.default.func,
    onDragStart: n.default.func,
    onDrag: n.default.func,
    onResizeStop: n.default.func,
    onResizeStart: n.default.func,
    onResize: n.default.func,
    // Flags
    isDraggable: n.default.bool.isRequired,
    isResizable: n.default.bool.isRequired,
    isBounded: n.default.bool.isRequired,
    static: n.default.bool,
    // Use CSS transforms instead of top/left
    useCSSTransforms: n.default.bool.isRequired,
    transformScale: n.default.number,
    // Others
    className: n.default.string,
    // Selector for draggable handle
    handle: n.default.string,
    // Selector for draggable cancel (see react-draggable)
    cancel: n.default.string,
    // Current position of a dropping element
    droppingPosition: n.default.shape({
      e: n.default.object.isRequired,
      left: n.default.number.isRequired,
      top: n.default.number.isRequired
    })
  }), f(m, "defaultProps", {
    className: "",
    cancel: "",
    handle: "",
    minH: 1,
    minW: 1,
    maxH: 1 / 0,
    maxW: 1 / 0,
    transformScale: 1
  }), no;
}
var Pl;
function Sf() {
  if (Pl) return to;
  Pl = 1, Object.defineProperty(to, "__esModule", {
    value: !0
  }), to.default = void 0;
  var e = c(K), t = /* @__PURE__ */ Js(), n = s(eu()), r = Gr(), o = tu(), i = s(qy()), a = s(Cf());
  function s(d) {
    return d && d.__esModule ? d : { default: d };
  }
  function l(d) {
    if (typeof WeakMap != "function") return null;
    var v = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakMap();
    return (l = function(b) {
      return b ? p : v;
    })(d);
  }
  function c(d, v) {
    if (d && d.__esModule) return d;
    if (d === null || typeof d != "object" && typeof d != "function") return { default: d };
    var p = l(v);
    if (p && p.has(d)) return p.get(d);
    var b = { __proto__: null }, C = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var x in d) if (x !== "default" && Object.prototype.hasOwnProperty.call(d, x)) {
      var S = C ? Object.getOwnPropertyDescriptor(d, x) : null;
      S && (S.get || S.set) ? Object.defineProperty(b, x, S) : b[x] = d[x];
    }
    return b.default = d, p && p.set(d, b), b;
  }
  function f(d, v, p) {
    return v = u(v), v in d ? Object.defineProperty(d, v, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : d[v] = p, d;
  }
  function u(d) {
    var v = y(d, "string");
    return typeof v == "symbol" ? v : String(v);
  }
  function y(d, v) {
    if (typeof d != "object" || d === null) return d;
    var p = d[Symbol.toPrimitive];
    if (p !== void 0) {
      var b = p.call(d, v);
      if (typeof b != "object") return b;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (v === "string" ? String : Number)(d);
  }
  const m = "react-grid-layout";
  let g = !1;
  try {
    g = /firefox/i.test(navigator.userAgent);
  } catch {
  }
  class w extends e.Component {
    constructor() {
      super(...arguments), f(this, "state", {
        activeDrag: null,
        layout: (0, r.synchronizeLayoutWithChildren)(
          this.props.layout,
          this.props.children,
          this.props.cols,
          // Legacy support for verticalCompact: false
          (0, r.compactType)(this.props),
          this.props.allowOverlap
        ),
        mounted: !1,
        oldDragItem: null,
        oldLayout: null,
        oldResizeItem: null,
        resizing: !1,
        droppingDOMNode: null,
        children: []
      }), f(this, "dragEnterCounter", 0), f(this, "onDragStart", (v, p, b, C) => {
        let {
          e: x,
          node: S
        } = C;
        const {
          layout: E
        } = this.state, M = (0, r.getLayoutItem)(E, v);
        if (!M) return;
        const _ = {
          w: M.w,
          h: M.h,
          x: M.x,
          y: M.y,
          placeholder: !0,
          i: v
        };
        return this.setState({
          oldDragItem: (0, r.cloneLayoutItem)(M),
          oldLayout: E,
          activeDrag: _
        }), this.props.onDragStart(E, M, M, null, x, S);
      }), f(this, "onDrag", (v, p, b, C) => {
        let {
          e: x,
          node: S
        } = C;
        const {
          oldDragItem: E
        } = this.state;
        let {
          layout: M
        } = this.state;
        const {
          cols: _,
          allowOverlap: P,
          preventCollision: k
        } = this.props, I = (0, r.getLayoutItem)(M, v);
        if (!I) return;
        const H = {
          w: I.w,
          h: I.h,
          x: I.x,
          y: I.y,
          placeholder: !0,
          i: v
        };
        M = (0, r.moveElement)(M, I, p, b, !0, k, (0, r.compactType)(this.props), _, P), this.props.onDrag(M, E, I, H, x, S), this.setState({
          layout: P ? M : (0, r.compact)(M, (0, r.compactType)(this.props), _),
          activeDrag: H
        });
      }), f(this, "onDragStop", (v, p, b, C) => {
        let {
          e: x,
          node: S
        } = C;
        if (!this.state.activeDrag) return;
        const {
          oldDragItem: E
        } = this.state;
        let {
          layout: M
        } = this.state;
        const {
          cols: _,
          preventCollision: P,
          allowOverlap: k
        } = this.props, I = (0, r.getLayoutItem)(M, v);
        if (!I) return;
        M = (0, r.moveElement)(M, I, p, b, !0, P, (0, r.compactType)(this.props), _, k);
        const A = k ? M : (0, r.compact)(M, (0, r.compactType)(this.props), _);
        this.props.onDragStop(A, E, I, null, x, S);
        const {
          oldLayout: L
        } = this.state;
        this.setState({
          activeDrag: null,
          layout: A,
          oldDragItem: null,
          oldLayout: null
        }), this.onLayoutMaybeChanged(A, L);
      }), f(this, "onResizeStart", (v, p, b, C) => {
        let {
          e: x,
          node: S
        } = C;
        const {
          layout: E
        } = this.state, M = (0, r.getLayoutItem)(E, v);
        M && (this.setState({
          oldResizeItem: (0, r.cloneLayoutItem)(M),
          oldLayout: this.state.layout,
          resizing: !0
        }), this.props.onResizeStart(E, M, M, null, x, S));
      }), f(this, "onResize", (v, p, b, C) => {
        let {
          e: x,
          node: S,
          size: E,
          handle: M
        } = C;
        const {
          oldResizeItem: _
        } = this.state, {
          layout: P
        } = this.state, {
          cols: k,
          preventCollision: I,
          allowOverlap: H
        } = this.props;
        let A = !1, L, N, $;
        const [T, z] = (0, r.withLayoutItem)(P, v, (W) => {
          let Y;
          return N = W.x, $ = W.y, ["sw", "w", "nw", "n", "ne"].indexOf(M) !== -1 && (["sw", "nw", "w"].indexOf(M) !== -1 && (N = W.x + (W.w - p), p = W.x !== N && N < 0 ? W.w : p, N = N < 0 ? 0 : N), ["ne", "n", "nw"].indexOf(M) !== -1 && ($ = W.y + (W.h - b), b = W.y !== $ && $ < 0 ? W.h : b, $ = $ < 0 ? 0 : $), A = !0), I && !H && (Y = (0, r.getAllCollisions)(P, {
            ...W,
            w: p,
            h: b,
            x: N,
            y: $
          }).filter((V) => V.i !== W.i).length > 0, Y && ($ = W.y, b = W.h, N = W.x, p = W.w, A = !1)), W.w = p, W.h = b, W;
        });
        if (!z) return;
        L = T, A && (L = (0, r.moveElement)(T, z, N, $, !0, this.props.preventCollision, (0, r.compactType)(this.props), k, H));
        const B = {
          w: z.w,
          h: z.h,
          x: z.x,
          y: z.y,
          static: !0,
          i: v
        };
        this.props.onResize(L, _, z, B, x, S), this.setState({
          layout: H ? L : (0, r.compact)(L, (0, r.compactType)(this.props), k),
          activeDrag: B
        });
      }), f(this, "onResizeStop", (v, p, b, C) => {
        let {
          e: x,
          node: S
        } = C;
        const {
          layout: E,
          oldResizeItem: M
        } = this.state, {
          cols: _,
          allowOverlap: P
        } = this.props, k = (0, r.getLayoutItem)(E, v), I = P ? E : (0, r.compact)(E, (0, r.compactType)(this.props), _);
        this.props.onResizeStop(I, M, k, null, x, S);
        const {
          oldLayout: H
        } = this.state;
        this.setState({
          activeDrag: null,
          layout: I,
          oldResizeItem: null,
          oldLayout: null,
          resizing: !1
        }), this.onLayoutMaybeChanged(I, H);
      }), f(this, "onDragOver", (v) => {
        var T;
        if (v.preventDefault(), v.stopPropagation(), g && // $FlowIgnore can't figure this out
        !((T = v.nativeEvent.target) != null && T.classList.contains(m)))
          return !1;
        const {
          droppingItem: p,
          onDropDragOver: b,
          margin: C,
          cols: x,
          rowHeight: S,
          maxRows: E,
          width: M,
          containerPadding: _,
          transformScale: P
        } = this.props, k = b == null ? void 0 : b(v);
        if (k === !1)
          return this.state.droppingDOMNode && this.removeDroppingPlaceholder(), !1;
        const I = {
          ...p,
          ...k
        }, {
          layout: H
        } = this.state, A = v.currentTarget.getBoundingClientRect(), L = v.clientX - A.left, N = v.clientY - A.top, $ = {
          left: L / P,
          top: N / P,
          e: v
        };
        if (this.state.droppingDOMNode) {
          if (this.state.droppingPosition) {
            const {
              left: z,
              top: B
            } = this.state.droppingPosition;
            (z != L || B != N) && this.setState({
              droppingPosition: $
            });
          }
        } else {
          const z = {
            cols: x,
            margin: C,
            maxRows: E,
            rowHeight: S,
            containerWidth: M,
            containerPadding: _ || C
          }, B = (0, o.calcXY)(z, N, L, I.w, I.h);
          this.setState({
            droppingDOMNode: /* @__PURE__ */ e.createElement("div", {
              key: I.i
            }),
            droppingPosition: $,
            layout: [...H, {
              ...I,
              x: B.x,
              y: B.y,
              static: !1,
              isDraggable: !0
            }]
          });
        }
      }), f(this, "removeDroppingPlaceholder", () => {
        const {
          droppingItem: v,
          cols: p
        } = this.props, {
          layout: b
        } = this.state, C = (0, r.compact)(b.filter((x) => x.i !== v.i), (0, r.compactType)(this.props), p, this.props.allowOverlap);
        this.setState({
          layout: C,
          droppingDOMNode: null,
          activeDrag: null,
          droppingPosition: void 0
        });
      }), f(this, "onDragLeave", (v) => {
        v.preventDefault(), v.stopPropagation(), this.dragEnterCounter--, this.dragEnterCounter === 0 && this.removeDroppingPlaceholder();
      }), f(this, "onDragEnter", (v) => {
        v.preventDefault(), v.stopPropagation(), this.dragEnterCounter++;
      }), f(this, "onDrop", (v) => {
        v.preventDefault(), v.stopPropagation();
        const {
          droppingItem: p
        } = this.props, {
          layout: b
        } = this.state, C = b.find((x) => x.i === p.i);
        this.dragEnterCounter = 0, this.removeDroppingPlaceholder(), this.props.onDrop(b, C, v);
      });
    }
    componentDidMount() {
      this.setState({
        mounted: !0
      }), this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
    }
    static getDerivedStateFromProps(v, p) {
      let b;
      return p.activeDrag ? null : (!(0, t.deepEqual)(v.layout, p.propsLayout) || v.compactType !== p.compactType ? b = v.layout : (0, r.childrenEqual)(v.children, p.children) || (b = p.layout), b ? {
        layout: (0, r.synchronizeLayoutWithChildren)(b, v.children, v.cols, (0, r.compactType)(v), v.allowOverlap),
        // We need to save these props to state for using
        // getDerivedStateFromProps instead of componentDidMount (in which we would get extra rerender)
        compactType: v.compactType,
        children: v.children,
        propsLayout: v.layout
      } : null);
    }
    shouldComponentUpdate(v, p) {
      return (
        // NOTE: this is almost always unequal. Therefore the only way to get better performance
        // from SCU is if the user intentionally memoizes children. If they do, and they can
        // handle changes properly, performance will increase.
        this.props.children !== v.children || !(0, r.fastRGLPropsEqual)(this.props, v, t.deepEqual) || this.state.activeDrag !== p.activeDrag || this.state.mounted !== p.mounted || this.state.droppingPosition !== p.droppingPosition
      );
    }
    componentDidUpdate(v, p) {
      if (!this.state.activeDrag) {
        const b = this.state.layout, C = p.layout;
        this.onLayoutMaybeChanged(b, C);
      }
    }
    /**
     * Calculates a pixel value for the container.
     * @return {String} Container height in pixels.
     */
    containerHeight() {
      if (!this.props.autoSize) return;
      const v = (0, r.bottom)(this.state.layout), p = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
      return v * this.props.rowHeight + (v - 1) * this.props.margin[1] + p * 2 + "px";
    }
    onLayoutMaybeChanged(v, p) {
      p || (p = this.state.layout), (0, t.deepEqual)(p, v) || this.props.onLayoutChange(v);
    }
    /**
     * Create a placeholder object.
     * @return {Element} Placeholder div.
     */
    placeholder() {
      const {
        activeDrag: v
      } = this.state;
      if (!v) return null;
      const {
        width: p,
        cols: b,
        margin: C,
        containerPadding: x,
        rowHeight: S,
        maxRows: E,
        useCSSTransforms: M,
        transformScale: _
      } = this.props;
      return /* @__PURE__ */ e.createElement(i.default, {
        w: v.w,
        h: v.h,
        x: v.x,
        y: v.y,
        i: v.i,
        className: `react-grid-placeholder ${this.state.resizing ? "placeholder-resizing" : ""}`,
        containerWidth: p,
        cols: b,
        margin: C,
        containerPadding: x || C,
        maxRows: E,
        rowHeight: S,
        isDraggable: !1,
        isResizable: !1,
        isBounded: !1,
        useCSSTransforms: M,
        transformScale: _
      }, /* @__PURE__ */ e.createElement("div", null));
    }
    /**
     * Given a grid item, set its style attributes & surround in a <Draggable>.
     * @param  {Element} child React element.
     * @return {Element}       Element wrapped in draggable and properly placed.
     */
    processGridItem(v, p) {
      if (!v || !v.key) return;
      const b = (0, r.getLayoutItem)(this.state.layout, String(v.key));
      if (!b) return null;
      const {
        width: C,
        cols: x,
        margin: S,
        containerPadding: E,
        rowHeight: M,
        maxRows: _,
        isDraggable: P,
        isResizable: k,
        isBounded: I,
        useCSSTransforms: H,
        transformScale: A,
        draggableCancel: L,
        draggableHandle: N,
        resizeHandles: $,
        resizeHandle: T
      } = this.props, {
        mounted: z,
        droppingPosition: B
      } = this.state, W = typeof b.isDraggable == "boolean" ? b.isDraggable : !b.static && P, Y = typeof b.isResizable == "boolean" ? b.isResizable : !b.static && k, U = b.resizeHandles || $, V = W && I && b.isBounded !== !1;
      return /* @__PURE__ */ e.createElement(i.default, {
        containerWidth: C,
        cols: x,
        margin: S,
        containerPadding: E || S,
        maxRows: _,
        rowHeight: M,
        cancel: L,
        handle: N,
        onDragStop: this.onDragStop,
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.onResizeStop,
        isDraggable: W,
        isResizable: Y,
        isBounded: V,
        useCSSTransforms: H && z,
        usePercentages: !z,
        transformScale: A,
        w: b.w,
        h: b.h,
        x: b.x,
        y: b.y,
        i: b.i,
        minH: b.minH,
        minW: b.minW,
        maxH: b.maxH,
        maxW: b.maxW,
        static: b.static,
        droppingPosition: p ? B : void 0,
        resizeHandles: U,
        resizeHandle: T
      }, v);
    }
    render() {
      const {
        className: v,
        style: p,
        isDroppable: b,
        innerRef: C
      } = this.props, x = (0, n.default)(m, v), S = {
        height: this.containerHeight(),
        ...p
      };
      return /* @__PURE__ */ e.createElement("div", {
        ref: C,
        className: x,
        style: S,
        onDrop: b ? this.onDrop : r.noop,
        onDragLeave: b ? this.onDragLeave : r.noop,
        onDragEnter: b ? this.onDragEnter : r.noop,
        onDragOver: b ? this.onDragOver : r.noop
      }, e.Children.map(this.props.children, (E) => this.processGridItem(E)), b && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, !0), this.placeholder());
    }
  }
  return to.default = w, f(w, "displayName", "ReactGridLayout"), f(w, "propTypes", a.default), f(w, "defaultProps", {
    autoSize: !0,
    cols: 12,
    className: "",
    style: {},
    draggableHandle: "",
    draggableCancel: "",
    containerPadding: null,
    rowHeight: 150,
    maxRows: 1 / 0,
    // infinite vertical growth
    layout: [],
    margin: [10, 10],
    isBounded: !1,
    isDraggable: !0,
    isResizable: !0,
    allowOverlap: !1,
    isDroppable: !1,
    useCSSTransforms: !0,
    transformScale: 1,
    verticalCompact: !0,
    compactType: "vertical",
    preventCollision: !1,
    droppingItem: {
      i: "__dropping-elem__",
      h: 1,
      w: 1
    },
    resizeHandles: ["se"],
    onLayoutChange: r.noop,
    onDragStart: r.noop,
    onDrag: r.noop,
    onDragStop: r.noop,
    onResizeStart: r.noop,
    onResize: r.noop,
    onResizeStop: r.noop,
    onDrop: r.noop,
    onDropDragOver: r.noop
  }), to;
}
var lo = {}, sr = {}, Nl;
function Ef() {
  if (Nl) return sr;
  Nl = 1, Object.defineProperty(sr, "__esModule", {
    value: !0
  }), sr.findOrGenerateResponsiveLayout = r, sr.getBreakpointFromWidth = t, sr.getColsFromBreakpoint = n, sr.sortBreakpoints = o;
  var e = Gr();
  function t(i, a) {
    const s = o(i);
    let l = s[0];
    for (let c = 1, f = s.length; c < f; c++) {
      const u = s[c];
      a > i[u] && (l = u);
    }
    return l;
  }
  function n(i, a) {
    if (!a[i])
      throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + i + " is missing!");
    return a[i];
  }
  function r(i, a, s, l, c, f) {
    if (i[s]) return (0, e.cloneLayout)(i[s]);
    let u = i[l];
    const y = o(a), m = y.slice(y.indexOf(s));
    for (let g = 0, w = m.length; g < w; g++) {
      const d = m[g];
      if (i[d]) {
        u = i[d];
        break;
      }
    }
    return u = (0, e.cloneLayout)(u || []), (0, e.compact)((0, e.correctBounds)(u, {
      cols: c
    }), f, c);
  }
  function o(i) {
    return Object.keys(i).sort(function(s, l) {
      return i[s] - i[l];
    });
  }
  return sr;
}
var Dl;
function Uy() {
  if (Dl) return lo;
  Dl = 1, Object.defineProperty(lo, "__esModule", {
    value: !0
  }), lo.default = void 0;
  var e = l(K), t = a(/* @__PURE__ */ nr()), n = /* @__PURE__ */ Js(), r = Gr(), o = Ef(), i = a(Sf());
  function a(d) {
    return d && d.__esModule ? d : { default: d };
  }
  function s(d) {
    if (typeof WeakMap != "function") return null;
    var v = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakMap();
    return (s = function(b) {
      return b ? p : v;
    })(d);
  }
  function l(d, v) {
    if (d && d.__esModule) return d;
    if (d === null || typeof d != "object" && typeof d != "function") return { default: d };
    var p = s(v);
    if (p && p.has(d)) return p.get(d);
    var b = { __proto__: null }, C = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var x in d) if (x !== "default" && Object.prototype.hasOwnProperty.call(d, x)) {
      var S = C ? Object.getOwnPropertyDescriptor(d, x) : null;
      S && (S.get || S.set) ? Object.defineProperty(b, x, S) : b[x] = d[x];
    }
    return b.default = d, p && p.set(d, b), b;
  }
  function c() {
    return c = Object.assign ? Object.assign.bind() : function(d) {
      for (var v = 1; v < arguments.length; v++) {
        var p = arguments[v];
        for (var b in p)
          Object.prototype.hasOwnProperty.call(p, b) && (d[b] = p[b]);
      }
      return d;
    }, c.apply(this, arguments);
  }
  function f(d, v, p) {
    return v = u(v), v in d ? Object.defineProperty(d, v, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : d[v] = p, d;
  }
  function u(d) {
    var v = y(d, "string");
    return typeof v == "symbol" ? v : String(v);
  }
  function y(d, v) {
    if (typeof d != "object" || d === null) return d;
    var p = d[Symbol.toPrimitive];
    if (p !== void 0) {
      var b = p.call(d, v);
      if (typeof b != "object") return b;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (v === "string" ? String : Number)(d);
  }
  const m = (d) => Object.prototype.toString.call(d);
  function g(d, v) {
    return d == null ? null : Array.isArray(d) ? d : d[v];
  }
  let w = class extends e.Component {
    constructor() {
      super(...arguments), f(this, "state", this.generateInitialState()), f(this, "onLayoutChange", (v) => {
        this.props.onLayoutChange(v, {
          ...this.props.layouts,
          [this.state.breakpoint]: v
        });
      });
    }
    generateInitialState() {
      const {
        width: v,
        breakpoints: p,
        layouts: b,
        cols: C
      } = this.props, x = (0, o.getBreakpointFromWidth)(p, v), S = (0, o.getColsFromBreakpoint)(x, C), E = this.props.verticalCompact === !1 ? null : this.props.compactType;
      return {
        layout: (0, o.findOrGenerateResponsiveLayout)(b, p, x, x, S, E),
        breakpoint: x,
        cols: S
      };
    }
    static getDerivedStateFromProps(v, p) {
      if (!(0, n.deepEqual)(v.layouts, p.layouts)) {
        const {
          breakpoint: b,
          cols: C
        } = p;
        return {
          layout: (0, o.findOrGenerateResponsiveLayout)(v.layouts, v.breakpoints, b, b, C, v.compactType),
          layouts: v.layouts
        };
      }
      return null;
    }
    componentDidUpdate(v) {
      (this.props.width != v.width || this.props.breakpoint !== v.breakpoint || !(0, n.deepEqual)(this.props.breakpoints, v.breakpoints) || !(0, n.deepEqual)(this.props.cols, v.cols)) && this.onWidthChange(v);
    }
    /**
     * When the width changes work through breakpoints and reset state with the new width & breakpoint.
     * Width changes are necessary to figure out the widget widths.
     */
    onWidthChange(v) {
      const {
        breakpoints: p,
        cols: b,
        layouts: C,
        compactType: x
      } = this.props, S = this.props.breakpoint || (0, o.getBreakpointFromWidth)(this.props.breakpoints, this.props.width), E = this.state.breakpoint, M = (0, o.getColsFromBreakpoint)(S, b), _ = {
        ...C
      };
      if (E !== S || v.breakpoints !== p || v.cols !== b) {
        E in _ || (_[E] = (0, r.cloneLayout)(this.state.layout));
        let I = (0, o.findOrGenerateResponsiveLayout)(_, p, S, E, M, x);
        I = (0, r.synchronizeLayoutWithChildren)(I, this.props.children, M, x, this.props.allowOverlap), _[S] = I, this.props.onBreakpointChange(S, M), this.props.onLayoutChange(I, _), this.setState({
          breakpoint: S,
          layout: I,
          cols: M
        });
      }
      const P = g(this.props.margin, S), k = g(this.props.containerPadding, S);
      this.props.onWidthChange(this.props.width, P, M, k);
    }
    render() {
      const {
        breakpoint: v,
        breakpoints: p,
        cols: b,
        layouts: C,
        margin: x,
        containerPadding: S,
        onBreakpointChange: E,
        onLayoutChange: M,
        onWidthChange: _,
        ...P
      } = this.props;
      return /* @__PURE__ */ e.createElement(i.default, c({}, P, {
        // $FlowIgnore should allow nullable here due to DefaultProps
        margin: g(x, this.state.breakpoint),
        containerPadding: g(S, this.state.breakpoint),
        onLayoutChange: this.onLayoutChange,
        layout: this.state.layout,
        cols: this.state.cols
      }));
    }
  };
  return lo.default = w, f(w, "propTypes", {
    //
    // Basic props
    //
    // Optional, but if you are managing width yourself you may want to set the breakpoint
    // yourself as well.
    breakpoint: t.default.string,
    // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
    breakpoints: t.default.object,
    allowOverlap: t.default.bool,
    // # of cols. This is a breakpoint -> cols map
    cols: t.default.object,
    // # of margin. This is a breakpoint -> margin map
    // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
    // Margin between items [x, y] in px
    // e.g. [10, 10]
    margin: t.default.oneOfType([t.default.array, t.default.object]),
    // # of containerPadding. This is a breakpoint -> containerPadding map
    // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
    // Padding inside the container [x, y] in px
    // e.g. [10, 10]
    containerPadding: t.default.oneOfType([t.default.array, t.default.object]),
    // layouts is an object mapping breakpoints to layouts.
    // e.g. {lg: Layout, md: Layout, ...}
    layouts(d, v) {
      if (m(d[v]) !== "[object Object]")
        throw new Error("Layout property must be an object. Received: " + m(d[v]));
      Object.keys(d[v]).forEach((p) => {
        if (!(p in d.breakpoints))
          throw new Error("Each key in layouts must align with a key in breakpoints.");
        (0, r.validateLayout)(d.layouts[p], "layouts." + p);
      });
    },
    // The width of this component.
    // Required in this propTypes stanza because generateInitialState() will fail without it.
    width: t.default.number.isRequired,
    //
    // Callbacks
    //
    // Calls back with breakpoint and new # cols
    onBreakpointChange: t.default.func,
    // Callback so you can save the layout.
    // Calls back with (currentLayout, allLayouts). allLayouts are keyed by breakpoint.
    onLayoutChange: t.default.func,
    // Calls back with (containerWidth, margin, cols, containerPadding)
    onWidthChange: t.default.func
  }), f(w, "defaultProps", {
    breakpoints: {
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480,
      xxs: 0
    },
    cols: {
      lg: 12,
      md: 10,
      sm: 6,
      xs: 4,
      xxs: 2
    },
    containerPadding: {
      lg: null,
      md: null,
      sm: null,
      xs: null,
      xxs: null
    },
    layouts: {},
    margin: [10, 10],
    allowOverlap: !1,
    onBreakpointChange: r.noop,
    onLayoutChange: r.noop,
    onWidthChange: r.noop
  }), lo;
}
var ii = {}, Rf = (function() {
  if (typeof Map < "u")
    return Map;
  function e(t, n) {
    var r = -1;
    return t.some(function(o, i) {
      return o[0] === n ? (r = i, !0) : !1;
    }), r;
  }
  return (
    /** @class */
    (function() {
      function t() {
        this.__entries__ = [];
      }
      return Object.defineProperty(t.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function() {
          return this.__entries__.length;
        },
        enumerable: !0,
        configurable: !0
      }), t.prototype.get = function(n) {
        var r = e(this.__entries__, n), o = this.__entries__[r];
        return o && o[1];
      }, t.prototype.set = function(n, r) {
        var o = e(this.__entries__, n);
        ~o ? this.__entries__[o][1] = r : this.__entries__.push([n, r]);
      }, t.prototype.delete = function(n) {
        var r = this.__entries__, o = e(r, n);
        ~o && r.splice(o, 1);
      }, t.prototype.has = function(n) {
        return !!~e(this.__entries__, n);
      }, t.prototype.clear = function() {
        this.__entries__.splice(0);
      }, t.prototype.forEach = function(n, r) {
        r === void 0 && (r = null);
        for (var o = 0, i = this.__entries__; o < i.length; o++) {
          var a = i[o];
          n.call(r, a[1], a[0]);
        }
      }, t;
    })()
  );
})(), rs = typeof window < "u" && typeof document < "u" && window.document === document, Di = (function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
})(), Gy = (function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(Di) : function(e) {
    return setTimeout(function() {
      return e(Date.now());
    }, 1e3 / 60);
  };
})(), Ky = 2;
function Yy(e, t) {
  var n = !1, r = !1, o = 0;
  function i() {
    n && (n = !1, e()), r && s();
  }
  function a() {
    Gy(i);
  }
  function s() {
    var l = Date.now();
    if (n) {
      if (l - o < Ky)
        return;
      r = !0;
    } else
      n = !0, r = !1, setTimeout(a, t);
    o = l;
  }
  return s;
}
var Xy = 20, Zy = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], Qy = typeof MutationObserver < "u", Jy = (
  /** @class */
  (function() {
    function e() {
      this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = Yy(this.refresh.bind(this), Xy);
    }
    return e.prototype.addObserver = function(t) {
      ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
    }, e.prototype.removeObserver = function(t) {
      var n = this.observers_, r = n.indexOf(t);
      ~r && n.splice(r, 1), !n.length && this.connected_ && this.disconnect_();
    }, e.prototype.refresh = function() {
      var t = this.updateObservers_();
      t && this.refresh();
    }, e.prototype.updateObservers_ = function() {
      var t = this.observers_.filter(function(n) {
        return n.gatherActive(), n.hasActive();
      });
      return t.forEach(function(n) {
        return n.broadcastActive();
      }), t.length > 0;
    }, e.prototype.connect_ = function() {
      !rs || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), Qy ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
    }, e.prototype.disconnect_ = function() {
      !rs || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
    }, e.prototype.onTransitionEnd_ = function(t) {
      var n = t.propertyName, r = n === void 0 ? "" : n, o = Zy.some(function(i) {
        return !!~r.indexOf(i);
      });
      o && this.refresh();
    }, e.getInstance = function() {
      return this.instance_ || (this.instance_ = new e()), this.instance_;
    }, e.instance_ = null, e;
  })()
), Mf = (function(e, t) {
  for (var n = 0, r = Object.keys(t); n < r.length; n++) {
    var o = r[n];
    Object.defineProperty(e, o, {
      value: t[o],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return e;
}), Fr = (function(e) {
  var t = e && e.ownerDocument && e.ownerDocument.defaultView;
  return t || Di;
}), Pf = na(0, 0, 0, 0);
function _i(e) {
  return parseFloat(e) || 0;
}
function _l(e) {
  for (var t = [], n = 1; n < arguments.length; n++)
    t[n - 1] = arguments[n];
  return t.reduce(function(r, o) {
    var i = e["border-" + o + "-width"];
    return r + _i(i);
  }, 0);
}
function eb(e) {
  for (var t = ["top", "right", "bottom", "left"], n = {}, r = 0, o = t; r < o.length; r++) {
    var i = o[r], a = e["padding-" + i];
    n[i] = _i(a);
  }
  return n;
}
function tb(e) {
  var t = e.getBBox();
  return na(0, 0, t.width, t.height);
}
function nb(e) {
  var t = e.clientWidth, n = e.clientHeight;
  if (!t && !n)
    return Pf;
  var r = Fr(e).getComputedStyle(e), o = eb(r), i = o.left + o.right, a = o.top + o.bottom, s = _i(r.width), l = _i(r.height);
  if (r.boxSizing === "border-box" && (Math.round(s + i) !== t && (s -= _l(r, "left", "right") + i), Math.round(l + a) !== n && (l -= _l(r, "top", "bottom") + a)), !ob(e)) {
    var c = Math.round(s + i) - t, f = Math.round(l + a) - n;
    Math.abs(c) !== 1 && (s -= c), Math.abs(f) !== 1 && (l -= f);
  }
  return na(o.left, o.top, s, l);
}
var rb = /* @__PURE__ */ (function() {
  return typeof SVGGraphicsElement < "u" ? function(e) {
    return e instanceof Fr(e).SVGGraphicsElement;
  } : function(e) {
    return e instanceof Fr(e).SVGElement && typeof e.getBBox == "function";
  };
})();
function ob(e) {
  return e === Fr(e).document.documentElement;
}
function ib(e) {
  return rs ? rb(e) ? tb(e) : nb(e) : Pf;
}
function ab(e) {
  var t = e.x, n = e.y, r = e.width, o = e.height, i = typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object, a = Object.create(i.prototype);
  return Mf(a, {
    x: t,
    y: n,
    width: r,
    height: o,
    top: n,
    right: t + r,
    bottom: o + n,
    left: t
  }), a;
}
function na(e, t, n, r) {
  return { x: e, y: t, width: n, height: r };
}
var sb = (
  /** @class */
  (function() {
    function e(t) {
      this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = na(0, 0, 0, 0), this.target = t;
    }
    return e.prototype.isActive = function() {
      var t = ib(this.target);
      return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
    }, e.prototype.broadcastRect = function() {
      var t = this.contentRect_;
      return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t;
    }, e;
  })()
), ub = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t, n) {
      var r = ab(n);
      Mf(this, { target: t, contentRect: r });
    }
    return e;
  })()
), lb = (
  /** @class */
  (function() {
    function e(t, n, r) {
      if (this.activeObservations_ = [], this.observations_ = new Rf(), typeof t != "function")
        throw new TypeError("The callback provided as parameter 1 is not a function.");
      this.callback_ = t, this.controller_ = n, this.callbackCtx_ = r;
    }
    return e.prototype.observe = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof Fr(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) || (n.set(t, new sb(t)), this.controller_.addObserver(this), this.controller_.refresh());
      }
    }, e.prototype.unobserve = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof Fr(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) && (n.delete(t), n.size || this.controller_.removeObserver(this));
      }
    }, e.prototype.disconnect = function() {
      this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
    }, e.prototype.gatherActive = function() {
      var t = this;
      this.clearActive(), this.observations_.forEach(function(n) {
        n.isActive() && t.activeObservations_.push(n);
      });
    }, e.prototype.broadcastActive = function() {
      if (this.hasActive()) {
        var t = this.callbackCtx_, n = this.activeObservations_.map(function(r) {
          return new ub(r.target, r.broadcastRect());
        });
        this.callback_.call(t, n, t), this.clearActive();
      }
    }, e.prototype.clearActive = function() {
      this.activeObservations_.splice(0);
    }, e.prototype.hasActive = function() {
      return this.activeObservations_.length > 0;
    }, e;
  })()
), Nf = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Rf(), Df = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      if (!(this instanceof e))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var n = Jy.getInstance(), r = new lb(t, n, this);
      Nf.set(this, r);
    }
    return e;
  })()
);
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(e) {
  Df.prototype[e] = function() {
    var t;
    return (t = Nf.get(this))[e].apply(t, arguments);
  };
});
var _f = (function() {
  return typeof Di.ResizeObserver < "u" ? Di.ResizeObserver : Df;
})();
const cb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _f
}, Symbol.toStringTag, { value: "Module" })), db = /* @__PURE__ */ Zc(cb);
var Ol;
function fb() {
  if (Ol) return ii;
  Ol = 1, Object.defineProperty(ii, "__esModule", {
    value: !0
  }), ii.default = y;
  var e = a(K), t = o(/* @__PURE__ */ nr()), n = o(db), r = o(eu());
  function o(m) {
    return m && m.__esModule ? m : { default: m };
  }
  function i(m) {
    if (typeof WeakMap != "function") return null;
    var g = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap();
    return (i = function(d) {
      return d ? w : g;
    })(m);
  }
  function a(m, g) {
    if (m && m.__esModule) return m;
    if (m === null || typeof m != "object" && typeof m != "function") return { default: m };
    var w = i(g);
    if (w && w.has(m)) return w.get(m);
    var d = { __proto__: null }, v = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var p in m) if (p !== "default" && Object.prototype.hasOwnProperty.call(m, p)) {
      var b = v ? Object.getOwnPropertyDescriptor(m, p) : null;
      b && (b.get || b.set) ? Object.defineProperty(d, p, b) : d[p] = m[p];
    }
    return d.default = m, w && w.set(m, d), d;
  }
  function s() {
    return s = Object.assign ? Object.assign.bind() : function(m) {
      for (var g = 1; g < arguments.length; g++) {
        var w = arguments[g];
        for (var d in w)
          Object.prototype.hasOwnProperty.call(w, d) && (m[d] = w[d]);
      }
      return m;
    }, s.apply(this, arguments);
  }
  function l(m, g, w) {
    return g = c(g), g in m ? Object.defineProperty(m, g, { value: w, enumerable: !0, configurable: !0, writable: !0 }) : m[g] = w, m;
  }
  function c(m) {
    var g = f(m, "string");
    return typeof g == "symbol" ? g : String(g);
  }
  function f(m, g) {
    if (typeof m != "object" || m === null) return m;
    var w = m[Symbol.toPrimitive];
    if (w !== void 0) {
      var d = w.call(m, g);
      if (typeof d != "object") return d;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (g === "string" ? String : Number)(m);
  }
  const u = "react-grid-layout";
  function y(m) {
    var g;
    return g = class extends e.Component {
      constructor() {
        super(...arguments), l(this, "state", {
          width: 1280
        }), l(this, "elementRef", /* @__PURE__ */ e.createRef()), l(this, "mounted", !1), l(this, "resizeObserver", void 0);
      }
      componentDidMount() {
        this.mounted = !0, this.resizeObserver = new n.default((v) => {
          if (this.elementRef.current instanceof HTMLElement) {
            const b = v[0].contentRect.width;
            this.setState({
              width: b
            });
          }
        });
        const d = this.elementRef.current;
        d instanceof HTMLElement && this.resizeObserver.observe(d);
      }
      componentWillUnmount() {
        this.mounted = !1;
        const d = this.elementRef.current;
        d instanceof HTMLElement && this.resizeObserver.unobserve(d), this.resizeObserver.disconnect();
      }
      render() {
        const {
          measureBeforeMount: d,
          ...v
        } = this.props;
        return d && !this.mounted ? /* @__PURE__ */ e.createElement("div", {
          className: (0, r.default)(this.props.className, u),
          style: this.props.style,
          ref: this.elementRef
        }) : /* @__PURE__ */ e.createElement(m, s({
          innerRef: this.elementRef
        }, v, this.state));
      }
    }, l(g, "defaultProps", {
      measureBeforeMount: !1
    }), l(g, "propTypes", {
      // If true, will not render children until mounted. Useful for getting the exact width before
      // rendering, to prevent any unsightly resizing.
      measureBeforeMount: t.default.bool
    }), g;
  }
  return ii;
}
var kl;
function vb() {
  return kl || (kl = 1, (function(e) {
    e.exports = Sf().default, e.exports.utils = Gr(), e.exports.calculateUtils = tu(), e.exports.Responsive = Uy().default, e.exports.Responsive.utils = Ef(), e.exports.WidthProvider = fb().default;
  })(Ta)), Ta.exports;
}
var Of = vb();
const pb = /* @__PURE__ */ As(Of), hb = Of.WidthProvider(pb);
function PE(e) {
  const { list: t, onListChange: n, idKey: r, itemRender: o, ...i } = e, a = lt(() => {
    const l = /* @__PURE__ */ new Map();
    return t.forEach((c) => {
      const f = c[r];
      l.set(f, c);
    }), l;
  }, [r, t]), s = lt(() => t.map((l, c) => ({
    i: l[r],
    w: 12,
    h: 1,
    x: 0,
    y: c,
    col: 12
  })), [r, t]);
  return /* @__PURE__ */ R(
    hb,
    {
      ...i,
      cols: 12,
      preventCollision: !1,
      isResizable: !1,
      isDraggable: !0,
      onLayoutChange: (l) => {
        const c = l.sort((f, u) => f.y - u.y).map((f) => a.get(f.i));
        n(c);
      },
      children: s.map((l, c) => /* @__PURE__ */ R("div", { "data-grid": l, children: o(a.get(l.i), c) }, l.i))
    }
  );
}
function $e() {
  return $e = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, $e.apply(null, arguments);
}
function wt(e) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, wt(e);
}
function mb(e, t) {
  if (wt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (wt(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function kf(e) {
  var t = mb(e, "string");
  return wt(t) == "symbol" ? t : t + "";
}
function xe(e, t, n) {
  return (t = kf(t)) in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function gb(e) {
  if (Array.isArray(e)) return e;
}
function yb(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, a, s = [], l = !0, c = !1;
    try {
      if (i = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        l = !1;
      } else for (; !(l = (r = i.call(n)).done) && (s.push(r.value), s.length !== t); l = !0) ;
    } catch (f) {
      c = !0, o = f;
    } finally {
      try {
        if (!l && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (c) throw o;
      }
    }
    return s;
  }
}
function os(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Tf(e, t) {
  if (e) {
    if (typeof e == "string") return os(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? os(e, t) : void 0;
  }
}
function bb() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ae(e, t) {
  return gb(e) || yb(e, t) || Tf(e, t) || bb();
}
function ou(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
    if (t.indexOf(r) !== -1) continue;
    n[r] = e[r];
  }
  return n;
}
function ft(e, t) {
  if (e == null) return {};
  var n, r, o = ou(e, t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (o[n] = e[n]);
  }
  return o;
}
function Tl(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function re(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Tl(Object(n), !0).forEach(function(r) {
      xe(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Tl(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function kn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
var is = {}, wb = function(t) {
};
function xb(e, t) {
}
function Cb(e, t) {
}
function Sb() {
  is = {};
}
function If(e, t, n) {
  !t && !is[n] && (e(!1, n), is[n] = !0);
}
function Kr(e, t) {
  If(xb, e, t);
}
function Eb(e, t) {
  If(Cb, e, t);
}
Kr.preMessage = wb;
Kr.resetWarned = Sb;
Kr.noteOnce = Eb;
var Fa = { exports: {} }, Be = {};
var Il;
function Rb() {
  if (Il) return Be;
  Il = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), i = Symbol.for("react.provider"), a = Symbol.for("react.context"), s = Symbol.for("react.server_context"), l = Symbol.for("react.forward_ref"), c = Symbol.for("react.suspense"), f = Symbol.for("react.suspense_list"), u = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), m = Symbol.for("react.offscreen"), g;
  g = Symbol.for("react.module.reference");
  function w(d) {
    if (typeof d == "object" && d !== null) {
      var v = d.$$typeof;
      switch (v) {
        case e:
          switch (d = d.type, d) {
            case n:
            case o:
            case r:
            case c:
            case f:
              return d;
            default:
              switch (d = d && d.$$typeof, d) {
                case s:
                case a:
                case l:
                case y:
                case u:
                case i:
                  return d;
                default:
                  return v;
              }
          }
        case t:
          return v;
      }
    }
  }
  return Be.ContextConsumer = a, Be.ContextProvider = i, Be.Element = e, Be.ForwardRef = l, Be.Fragment = n, Be.Lazy = y, Be.Memo = u, Be.Portal = t, Be.Profiler = o, Be.StrictMode = r, Be.Suspense = c, Be.SuspenseList = f, Be.isAsyncMode = function() {
    return !1;
  }, Be.isConcurrentMode = function() {
    return !1;
  }, Be.isContextConsumer = function(d) {
    return w(d) === a;
  }, Be.isContextProvider = function(d) {
    return w(d) === i;
  }, Be.isElement = function(d) {
    return typeof d == "object" && d !== null && d.$$typeof === e;
  }, Be.isForwardRef = function(d) {
    return w(d) === l;
  }, Be.isFragment = function(d) {
    return w(d) === n;
  }, Be.isLazy = function(d) {
    return w(d) === y;
  }, Be.isMemo = function(d) {
    return w(d) === u;
  }, Be.isPortal = function(d) {
    return w(d) === t;
  }, Be.isProfiler = function(d) {
    return w(d) === o;
  }, Be.isStrictMode = function(d) {
    return w(d) === r;
  }, Be.isSuspense = function(d) {
    return w(d) === c;
  }, Be.isSuspenseList = function(d) {
    return w(d) === f;
  }, Be.isValidElementType = function(d) {
    return typeof d == "string" || typeof d == "function" || d === n || d === o || d === r || d === c || d === f || d === m || typeof d == "object" && d !== null && (d.$$typeof === y || d.$$typeof === u || d.$$typeof === i || d.$$typeof === a || d.$$typeof === l || d.$$typeof === g || d.getModuleId !== void 0);
  }, Be.typeOf = w, Be;
}
var Al;
function Mb() {
  return Al || (Al = 1, Fa.exports = Rb()), Fa.exports;
}
var Ha = Mb();
function Af(e, t, n) {
  var r = h.useRef({});
  return (!("value" in r.current) || n(r.current.condition, t)) && (r.current.value = e(), r.current.condition = t), r.current.value;
}
var Pb = Symbol.for("react.element"), Nb = Symbol.for("react.transitional.element"), Db = Symbol.for("react.fragment");
function Lf(e) {
  return (
    // Base object type
    e && wt(e) === "object" && // React Element type
    (e.$$typeof === Pb || e.$$typeof === Nb) && // React Fragment type
    e.type === Db
  );
}
var _b = Number(Fp.split(".")[0]), iu = function(t, n) {
  typeof t == "function" ? t(n) : wt(t) === "object" && t && "current" in t && (t.current = n);
}, ra = function() {
  for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
    n[r] = arguments[r];
  var o = n.filter(Boolean);
  return o.length <= 1 ? o[0] : function(i) {
    n.forEach(function(a) {
      iu(a, i);
    });
  };
}, oa = function() {
  for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
    n[r] = arguments[r];
  return Af(function() {
    return ra.apply(void 0, n);
  }, n, function(o, i) {
    return o.length !== i.length || o.every(function(a, s) {
      return a !== i[s];
    });
  });
}, Yr = function(t) {
  var n, r;
  if (!t)
    return !1;
  if ($f(t) && _b >= 19)
    return !0;
  var o = Ha.isMemo(t) ? t.type.type : t.type;
  return !(typeof o == "function" && !((n = o.prototype) !== null && n !== void 0 && n.render) && o.$$typeof !== Ha.ForwardRef || typeof t == "function" && !((r = t.prototype) !== null && r !== void 0 && r.render) && t.$$typeof !== Ha.ForwardRef);
};
function $f(e) {
  return /* @__PURE__ */ Ds(e) && !Lf(e);
}
var Lo = function(t) {
  if (t && $f(t)) {
    var n = t;
    return n.props.propertyIsEnumerable("ref") ? n.props.ref : n.ref;
  }
  return null;
}, zf = /* @__PURE__ */ h.createContext(null);
function Ob(e) {
  if (Array.isArray(e)) return os(e);
}
function kb(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Tb() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xn(e) {
  return Ob(e) || kb(e) || Tf(e) || Tb();
}
var Ll = kn() ? h.useLayoutEffect : h.useEffect, ht = function(t, n) {
  var r = h.useRef(!0);
  Ll(function() {
    return t(r.current);
  }, n), Ll(function() {
    return r.current = !1, function() {
      r.current = !0;
    };
  }, []);
}, $l = function(t, n) {
  ht(function(r) {
    if (!r)
      return t();
  }, n);
}, zl = [];
function Ib(e, t) {
  var n = h.useState(function() {
    if (!kn())
      return null;
    var g = document.createElement("div");
    return g;
  }), r = ae(n, 1), o = r[0], i = h.useRef(!1), a = h.useContext(zf), s = h.useState(zl), l = ae(s, 2), c = l[0], f = l[1], u = a || (i.current ? void 0 : function(g) {
    f(function(w) {
      var d = [g].concat(xn(w));
      return d;
    });
  });
  function y() {
    o.parentElement || document.body.appendChild(o), i.current = !0;
  }
  function m() {
    var g;
    (g = o.parentElement) === null || g === void 0 || g.removeChild(o), i.current = !1;
  }
  return ht(function() {
    return e ? a ? a(y) : y() : m(), m;
  }, [e]), ht(function() {
    c.length && (c.forEach(function(g) {
      return g();
    }), f(zl));
  }, [c]), [o, u];
}
function Ab(e, t) {
  if (!e)
    return !1;
  if (e.contains)
    return e.contains(t);
  for (var n = t; n; ) {
    if (n === e)
      return !0;
    n = n.parentNode;
  }
  return !1;
}
var Fl = "data-rc-order", Hl = "data-rc-priority", Lb = "rc-util-key", as = /* @__PURE__ */ new Map();
function Ff() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = e.mark;
  return t ? t.startsWith("data-") ? t : "data-".concat(t) : Lb;
}
function ia(e) {
  if (e.attachTo)
    return e.attachTo;
  var t = document.querySelector("head");
  return t || document.body;
}
function $b(e) {
  return e === "queue" ? "prependQueue" : e ? "prepend" : "append";
}
function au(e) {
  return Array.from((as.get(e) || e).children).filter(function(t) {
    return t.tagName === "STYLE";
  });
}
function Hf(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!kn())
    return null;
  var n = t.csp, r = t.prepend, o = t.priority, i = o === void 0 ? 0 : o, a = $b(r), s = a === "prependQueue", l = document.createElement("style");
  l.setAttribute(Fl, a), s && i && l.setAttribute(Hl, "".concat(i)), n != null && n.nonce && (l.nonce = n == null ? void 0 : n.nonce), l.innerHTML = e;
  var c = ia(t), f = c.firstChild;
  if (r) {
    if (s) {
      var u = (t.styles || au(c)).filter(function(y) {
        if (!["prepend", "prependQueue"].includes(y.getAttribute(Fl)))
          return !1;
        var m = Number(y.getAttribute(Hl) || 0);
        return i >= m;
      });
      if (u.length)
        return c.insertBefore(l, u[u.length - 1].nextSibling), l;
    }
    c.insertBefore(l, f);
  } else
    c.appendChild(l);
  return l;
}
function Wf(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = ia(t);
  return (t.styles || au(n)).find(function(r) {
    return r.getAttribute(Ff(t)) === e;
  });
}
function ss(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = Wf(e, t);
  if (n) {
    var r = ia(t);
    r.removeChild(n);
  }
}
function zb(e, t) {
  var n = as.get(e);
  if (!n || !Ab(document, n)) {
    var r = Hf("", t), o = r.parentNode;
    as.set(e, o), e.removeChild(r);
  }
}
function Bf(e, t) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = ia(n), o = au(r), i = re(re({}, n), {}, {
    styles: o
  });
  zb(r, i);
  var a = Wf(t, i);
  if (a) {
    var s, l;
    if ((s = i.csp) !== null && s !== void 0 && s.nonce && a.nonce !== ((l = i.csp) === null || l === void 0 ? void 0 : l.nonce)) {
      var c;
      a.nonce = (c = i.csp) === null || c === void 0 ? void 0 : c.nonce;
    }
    return a.innerHTML !== e && (a.innerHTML = e), a;
  }
  var f = Hf(e, i);
  return f.setAttribute(Ff(i), t), f;
}
function Fb(e) {
  var t = "rc-scrollbar-measure-".concat(Math.random().toString(36).substring(7)), n = document.createElement("div");
  n.id = t;
  var r = n.style;
  r.position = "absolute", r.left = "0", r.top = "0", r.width = "100px", r.height = "100px", r.overflow = "scroll";
  var o, i;
  if (e) {
    var a = getComputedStyle(e);
    r.scrollbarColor = a.scrollbarColor, r.scrollbarWidth = a.scrollbarWidth;
    var s = getComputedStyle(e, "::-webkit-scrollbar"), l = parseInt(s.width, 10), c = parseInt(s.height, 10);
    try {
      var f = l ? "width: ".concat(s.width, ";") : "", u = c ? "height: ".concat(s.height, ";") : "";
      Bf(`
#`.concat(t, `::-webkit-scrollbar {
`).concat(f, `
`).concat(u, `
}`), t);
    } catch (g) {
      console.error(g), o = l, i = c;
    }
  }
  document.body.appendChild(n);
  var y = e && o && !isNaN(o) ? o : n.offsetWidth - n.clientWidth, m = e && i && !isNaN(i) ? i : n.offsetHeight - n.clientHeight;
  return document.body.removeChild(n), ss(t), {
    width: y,
    height: m
  };
}
function Hb(e) {
  return typeof document > "u" || !e || !(e instanceof Element) ? {
    width: 0,
    height: 0
  } : Fb(e);
}
function Wb() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
}
var Bb = "rc-util-locker-".concat(Date.now()), Wl = 0;
function jb(e) {
  var t = !!e, n = h.useState(function() {
    return Wl += 1, "".concat(Bb, "_").concat(Wl);
  }), r = ae(n, 1), o = r[0];
  ht(function() {
    if (t) {
      var i = Hb(document.body).width, a = Wb();
      Bf(`
html body {
  overflow-y: hidden;
  `.concat(a ? "width: calc(100% - ".concat(i, "px);") : "", `
}`), o);
    } else
      ss(o);
    return function() {
      ss(o);
    };
  }, [t, o]);
}
var Vb = !1;
function qb(e) {
  return Vb;
}
var Bl = function(t) {
  return t === !1 ? !1 : !kn() || !t ? null : typeof t == "string" ? document.querySelector(t) : typeof t == "function" ? t() : t;
}, jf = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.open, r = e.autoLock, o = e.getContainer;
  e.debug;
  var i = e.autoDestroy, a = i === void 0 ? !0 : i, s = e.children, l = h.useState(n), c = ae(l, 2), f = c[0], u = c[1], y = f || n;
  h.useEffect(function() {
    (a || n) && u(n);
  }, [n, a]);
  var m = h.useState(function() {
    return Bl(o);
  }), g = ae(m, 2), w = g[0], d = g[1];
  h.useEffect(function() {
    var k = Bl(o);
    d(k != null ? k : null);
  });
  var v = Ib(y && !w), p = ae(v, 2), b = p[0], C = p[1], x = w != null ? w : b;
  jb(r && n && kn() && (x === b || x === document.body));
  var S = null;
  if (s && Yr(s) && t) {
    var E = s;
    S = E.ref;
  }
  var M = oa(S, t);
  if (!y || !kn() || w === void 0)
    return null;
  var _ = x === !1 || qb(), P = s;
  return t && (P = /* @__PURE__ */ h.cloneElement(s, {
    ref: M
  })), /* @__PURE__ */ h.createElement(zf.Provider, {
    value: C
  }, _ ? P : /* @__PURE__ */ _o(P, x));
}), Wa = { exports: {} };
var jl;
function Ub() {
  return jl || (jl = 1, (function(e) {
    (function() {
      var t = {}.hasOwnProperty;
      function n() {
        for (var i = "", a = 0; a < arguments.length; a++) {
          var s = arguments[a];
          s && (i = o(i, r(s)));
        }
        return i;
      }
      function r(i) {
        if (typeof i == "string" || typeof i == "number")
          return i;
        if (typeof i != "object")
          return "";
        if (Array.isArray(i))
          return n.apply(null, i);
        if (i.toString !== Object.prototype.toString && !i.toString.toString().includes("[native code]"))
          return i.toString();
        var a = "";
        for (var s in i)
          t.call(i, s) && i[s] && (a = o(a, s));
        return a;
      }
      function o(i, a) {
        return a ? i ? i + " " + a : i + a : i;
      }
      e.exports ? (n.default = n, e.exports = n) : window.classNames = n;
    })();
  })(Wa)), Wa.exports;
}
var Gb = Ub();
const it = /* @__PURE__ */ As(Gb);
function Oi(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [];
  return K.Children.forEach(e, function(r) {
    r == null && !t.keepEmpty || (Array.isArray(r) ? n = n.concat(Oi(r)) : Lf(r) && r.props ? n = n.concat(Oi(r.props.children, t)) : n.push(r));
  }), n;
}
function Eo(e) {
  return e instanceof HTMLElement || e instanceof SVGElement;
}
function Kb(e) {
  return e && wt(e) === "object" && Eo(e.nativeElement) ? e.nativeElement : Eo(e) ? e : null;
}
function mi(e) {
  var t = Kb(e);
  if (t)
    return t;
  if (e instanceof K.Component) {
    var n;
    return (n = rn.findDOMNode) === null || n === void 0 ? void 0 : n.call(rn, e);
  }
  return null;
}
var us = /* @__PURE__ */ h.createContext(null);
function Yb(e) {
  var t = e.children, n = e.onBatchResize, r = h.useRef(0), o = h.useRef([]), i = h.useContext(us), a = h.useCallback(function(s, l, c) {
    r.current += 1;
    var f = r.current;
    o.current.push({
      size: s,
      element: l,
      data: c
    }), Promise.resolve().then(function() {
      f === r.current && (n == null || n(o.current), o.current = []);
    }), i == null || i(s, l, c);
  }, [n, i]);
  return /* @__PURE__ */ h.createElement(us.Provider, {
    value: a
  }, t);
}
var Yn = /* @__PURE__ */ new Map();
function Xb(e) {
  e.forEach(function(t) {
    var n, r = t.target;
    (n = Yn.get(r)) === null || n === void 0 || n.forEach(function(o) {
      return o(r);
    });
  });
}
var Vf = new _f(Xb);
function Zb(e, t) {
  Yn.has(e) || (Yn.set(e, /* @__PURE__ */ new Set()), Vf.observe(e)), Yn.get(e).add(t);
}
function Qb(e, t) {
  Yn.has(e) && (Yn.get(e).delete(t), Yn.get(e).size || (Vf.unobserve(e), Yn.delete(e)));
}
function $o(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Vl(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, kf(r.key), r);
  }
}
function zo(e, t, n) {
  return t && Vl(e.prototype, t), n && Vl(e, n), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function ki(e, t) {
  return ki = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, ki(e, t);
}
function aa(e, t) {
  if (typeof t != "function" && t !== null) throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: e,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(e, "prototype", {
    writable: !1
  }), t && ki(e, t);
}
function Ti(e) {
  return Ti = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, Ti(e);
}
function qf() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (qf = function() {
    return !!e;
  })();
}
function ls(e) {
  if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Jb(e, t) {
  if (t && (wt(t) == "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return ls(e);
}
function sa(e) {
  var t = qf();
  return function() {
    var n, r = Ti(e);
    if (t) {
      var o = Ti(this).constructor;
      n = Reflect.construct(r, arguments, o);
    } else n = r.apply(this, arguments);
    return Jb(this, n);
  };
}
var e1 = /* @__PURE__ */ (function(e) {
  aa(n, e);
  var t = sa(n);
  function n() {
    return $o(this, n), t.apply(this, arguments);
  }
  return zo(n, [{
    key: "render",
    value: function() {
      return this.props.children;
    }
  }]), n;
})(h.Component);
function t1(e, t) {
  var n = e.children, r = e.disabled, o = h.useRef(null), i = h.useRef(null), a = h.useContext(us), s = typeof n == "function", l = s ? n(o) : n, c = h.useRef({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1
  }), f = !s && /* @__PURE__ */ h.isValidElement(l) && Yr(l), u = f ? Lo(l) : null, y = oa(u, o), m = function() {
    var v;
    return mi(o.current) || // Support `nativeElement` format
    (o.current && wt(o.current) === "object" ? mi((v = o.current) === null || v === void 0 ? void 0 : v.nativeElement) : null) || mi(i.current);
  };
  h.useImperativeHandle(t, function() {
    return m();
  });
  var g = h.useRef(e);
  g.current = e;
  var w = h.useCallback(function(d) {
    var v = g.current, p = v.onResize, b = v.data, C = d.getBoundingClientRect(), x = C.width, S = C.height, E = d.offsetWidth, M = d.offsetHeight, _ = Math.floor(x), P = Math.floor(S);
    if (c.current.width !== _ || c.current.height !== P || c.current.offsetWidth !== E || c.current.offsetHeight !== M) {
      var k = {
        width: _,
        height: P,
        offsetWidth: E,
        offsetHeight: M
      };
      c.current = k;
      var I = E === Math.round(x) ? x : E, H = M === Math.round(S) ? S : M, A = re(re({}, k), {}, {
        offsetWidth: I,
        offsetHeight: H
      });
      a == null || a(A, d, b), p && Promise.resolve().then(function() {
        p(A, d);
      });
    }
  }, []);
  return h.useEffect(function() {
    var d = m();
    return d && !r && Zb(d, w), function() {
      return Qb(d, w);
    };
  }, [o.current, r]), /* @__PURE__ */ h.createElement(e1, {
    ref: i
  }, f ? /* @__PURE__ */ h.cloneElement(l, {
    ref: y
  }) : l);
}
var n1 = /* @__PURE__ */ h.forwardRef(t1), r1 = "rc-observer-key";
function o1(e, t) {
  var n = e.children, r = typeof n == "function" ? [n] : Oi(n);
  return r.map(function(o, i) {
    var a = (o == null ? void 0 : o.key) || "".concat(r1, "-").concat(i);
    return /* @__PURE__ */ h.createElement(n1, $e({}, e, {
      key: a,
      ref: i === 0 ? t : void 0
    }), o);
  });
}
var mr = /* @__PURE__ */ h.forwardRef(o1);
mr.Collection = Yb;
function Uf(e) {
  var t;
  return e == null || (t = e.getRootNode) === null || t === void 0 ? void 0 : t.call(e);
}
function i1(e) {
  return Uf(e) instanceof ShadowRoot;
}
function cs(e) {
  return i1(e) ? Uf(e) : null;
}
function Ot(e) {
  var t = h.useRef();
  t.current = e;
  var n = h.useCallback(function() {
    for (var r, o = arguments.length, i = new Array(o), a = 0; a < o; a++)
      i[a] = arguments[a];
    return (r = t.current) === null || r === void 0 ? void 0 : r.call.apply(r, [t].concat(i));
  }, []);
  return n;
}
function a1() {
  var e = re({}, h);
  return e.useId;
}
var ql = 0, Ul = a1();
const s1 = Ul ? (
  // Use React `useId`
  (function(t) {
    var n = Ul();
    return t || n;
  })
) : (
  // Use compatible of `useId`
  (function(t) {
    var n = h.useState("ssr-id"), r = ae(n, 2), o = r[0], i = r[1];
    return h.useEffect(function() {
      var a = ql;
      ql += 1, i("rc_unique_".concat(a));
    }, []), t || o;
  })
), u1 = (function() {
  if (typeof navigator > "u" || typeof window > "u")
    return !1;
  var e = navigator.userAgent || navigator.vendor || window.opera;
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(e == null ? void 0 : e.substr(0, 4));
});
var l1 = /* @__PURE__ */ h.createContext({}), c1 = /* @__PURE__ */ (function(e) {
  aa(n, e);
  var t = sa(n);
  function n() {
    return $o(this, n), t.apply(this, arguments);
  }
  return zo(n, [{
    key: "render",
    value: function() {
      return this.props.children;
    }
  }]), n;
})(h.Component);
function Ro(e) {
  var t = h.useRef(!1), n = h.useState(e), r = ae(n, 2), o = r[0], i = r[1];
  h.useEffect(function() {
    return t.current = !1, function() {
      t.current = !0;
    };
  }, []);
  function a(s, l) {
    l && t.current || i(s);
  }
  return [o, a];
}
function Ba(e) {
  return e !== void 0;
}
function gi(e, t) {
  var n = t || {}, r = n.defaultValue, o = n.value, i = n.onChange, a = n.postState, s = Ro(function() {
    return Ba(o) ? o : Ba(r) ? typeof r == "function" ? r() : r : typeof e == "function" ? e() : e;
  }), l = ae(s, 2), c = l[0], f = l[1], u = o !== void 0 ? o : c, y = a ? a(u) : u, m = Ot(i), g = Ro([u]), w = ae(g, 2), d = w[0], v = w[1];
  $l(function() {
    var b = d[0];
    c !== b && m(c, b);
  }, [d]), $l(function() {
    Ba(o) || f(o);
  }, [o]);
  var p = Ot(function(b, C) {
    f(b, C), v([u], C);
  });
  return [y, p];
}
function d1(e) {
  var t = h.useReducer(function(s) {
    return s + 1;
  }, 0), n = ae(t, 2), r = n[1], o = h.useRef(e), i = Ot(function() {
    return o.current;
  }), a = Ot(function(s) {
    o.current = typeof s == "function" ? s(o.current) : s, r();
  });
  return [i, a];
}
var Kn = "none", ai = "appear", si = "enter", ui = "leave", Gl = "none", nn = "prepare", Or = "start", kr = "active", su = "end", Gf = "prepared";
function Kl(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit".concat(e)] = "webkit".concat(t), n["Moz".concat(e)] = "moz".concat(t), n["ms".concat(e)] = "MS".concat(t), n["O".concat(e)] = "o".concat(t.toLowerCase()), n;
}
function f1(e, t) {
  var n = {
    animationend: Kl("Animation", "AnimationEnd"),
    transitionend: Kl("Transition", "TransitionEnd")
  };
  return e && ("AnimationEvent" in t || delete n.animationend.animation, "TransitionEvent" in t || delete n.transitionend.transition), n;
}
var v1 = f1(kn(), typeof window < "u" ? window : {}), Kf = {};
if (kn()) {
  var p1 = document.createElement("div");
  Kf = p1.style;
}
var li = {};
function Yf(e) {
  if (li[e])
    return li[e];
  var t = v1[e];
  if (t)
    for (var n = Object.keys(t), r = n.length, o = 0; o < r; o += 1) {
      var i = n[o];
      if (Object.prototype.hasOwnProperty.call(t, i) && i in Kf)
        return li[e] = t[i], li[e];
    }
  return "";
}
var Xf = Yf("animationend"), Zf = Yf("transitionend"), Qf = !!(Xf && Zf), Yl = Xf || "animationend", Xl = Zf || "transitionend";
function Zl(e, t) {
  if (!e) return null;
  if (wt(e) === "object") {
    var n = t.replace(/-\w/g, function(r) {
      return r[1].toUpperCase();
    });
    return e[n];
  }
  return "".concat(e, "-").concat(t);
}
const h1 = (function(e) {
  var t = ye();
  function n(o) {
    o && (o.removeEventListener(Xl, e), o.removeEventListener(Yl, e));
  }
  function r(o) {
    t.current && t.current !== o && n(t.current), o && o !== t.current && (o.addEventListener(Xl, e), o.addEventListener(Yl, e), t.current = o);
  }
  return h.useEffect(function() {
    return function() {
      n(t.current);
    };
  }, []), [r, n];
});
var Jf = kn() ? Bi : qe, ev = function(t) {
  return +setTimeout(t, 16);
}, tv = function(t) {
  return clearTimeout(t);
};
typeof window < "u" && "requestAnimationFrame" in window && (ev = function(t) {
  return window.requestAnimationFrame(t);
}, tv = function(t) {
  return window.cancelAnimationFrame(t);
});
var Ql = 0, uu = /* @__PURE__ */ new Map();
function nv(e) {
  uu.delete(e);
}
var mt = function(t) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  Ql += 1;
  var r = Ql;
  function o(i) {
    if (i === 0)
      nv(r), t();
    else {
      var a = ev(function() {
        o(i - 1);
      });
      uu.set(r, a);
    }
  }
  return o(n), r;
};
mt.cancel = function(e) {
  var t = uu.get(e);
  return nv(e), tv(t);
};
const m1 = (function() {
  var e = h.useRef(null);
  function t() {
    mt.cancel(e.current);
  }
  function n(r) {
    var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    t();
    var i = mt(function() {
      o <= 1 ? r({
        isCanceled: function() {
          return i !== e.current;
        }
      }) : n(r, o - 1);
    });
    e.current = i;
  }
  return h.useEffect(function() {
    return function() {
      t();
    };
  }, []), [n, t];
});
var g1 = [nn, Or, kr, su], y1 = [nn, Gf], rv = !1, b1 = !0;
function ov(e) {
  return e === kr || e === su;
}
const w1 = (function(e, t, n) {
  var r = Ro(Gl), o = ae(r, 2), i = o[0], a = o[1], s = m1(), l = ae(s, 2), c = l[0], f = l[1];
  function u() {
    a(nn, !0);
  }
  var y = t ? y1 : g1;
  return Jf(function() {
    if (i !== Gl && i !== su) {
      var m = y.indexOf(i), g = y[m + 1], w = n(i);
      w === rv ? a(g, !0) : g && c(function(d) {
        function v() {
          d.isCanceled() || a(g, !0);
        }
        w === !0 ? v() : Promise.resolve(w).then(v);
      });
    }
  }, [e, i]), h.useEffect(function() {
    return function() {
      f();
    };
  }, []), [u, i];
});
function x1(e, t, n, r) {
  var o = r.motionEnter, i = o === void 0 ? !0 : o, a = r.motionAppear, s = a === void 0 ? !0 : a, l = r.motionLeave, c = l === void 0 ? !0 : l, f = r.motionDeadline, u = r.motionLeaveImmediately, y = r.onAppearPrepare, m = r.onEnterPrepare, g = r.onLeavePrepare, w = r.onAppearStart, d = r.onEnterStart, v = r.onLeaveStart, p = r.onAppearActive, b = r.onEnterActive, C = r.onLeaveActive, x = r.onAppearEnd, S = r.onEnterEnd, E = r.onLeaveEnd, M = r.onVisibleChanged, _ = Ro(), P = ae(_, 2), k = P[0], I = P[1], H = d1(Kn), A = ae(H, 2), L = A[0], N = A[1], $ = Ro(null), T = ae($, 2), z = T[0], B = T[1], W = L(), Y = ye(!1), U = ye(null);
  function V() {
    return n();
  }
  var Z = ye(!1);
  function se() {
    N(Kn), B(null, !0);
  }
  var ge = Ot(function(we) {
    var pe = L();
    if (pe !== Kn) {
      var te = V();
      if (!(we && !we.deadline && we.target !== te)) {
        var He = Z.current, Te;
        pe === ai && He ? Te = x == null ? void 0 : x(te, we) : pe === si && He ? Te = S == null ? void 0 : S(te, we) : pe === ui && He && (Te = E == null ? void 0 : E(te, we)), He && Te !== !1 && se();
      }
    }
  }), j = h1(ge), q = ae(j, 1), J = q[0], D = function(pe) {
    switch (pe) {
      case ai:
        return xe(xe(xe({}, nn, y), Or, w), kr, p);
      case si:
        return xe(xe(xe({}, nn, m), Or, d), kr, b);
      case ui:
        return xe(xe(xe({}, nn, g), Or, v), kr, C);
      default:
        return {};
    }
  }, O = h.useMemo(function() {
    return D(W);
  }, [W]), F = w1(W, !e, function(we) {
    if (we === nn) {
      var pe = O[nn];
      return pe ? pe(V()) : rv;
    }
    if (X in O) {
      var te;
      B(((te = O[X]) === null || te === void 0 ? void 0 : te.call(O, V(), null)) || null);
    }
    return X === kr && W !== Kn && (J(V()), f > 0 && (clearTimeout(U.current), U.current = setTimeout(function() {
      ge({
        deadline: !0
      });
    }, f))), X === Gf && se(), b1;
  }), G = ae(F, 2), Q = G[0], X = G[1], oe = ov(X);
  Z.current = oe;
  var ee = ye(null);
  Jf(function() {
    if (!(Y.current && ee.current === t)) {
      I(t);
      var we = Y.current;
      Y.current = !0;
      var pe;
      !we && t && s && (pe = ai), we && t && i && (pe = si), (we && !t && c || !we && u && !t && c) && (pe = ui);
      var te = D(pe);
      pe && (e || te[nn]) ? (N(pe), Q()) : N(Kn), ee.current = t;
    }
  }, [t]), qe(function() {
    // Cancel appear
    (W === ai && !s || // Cancel enter
    W === si && !i || // Cancel leave
    W === ui && !c) && N(Kn);
  }, [s, i, c]), qe(function() {
    return function() {
      Y.current = !1, clearTimeout(U.current);
    };
  }, []);
  var ne = h.useRef(!1);
  qe(function() {
    k && (ne.current = !0), k !== void 0 && W === Kn && ((ne.current || k) && (M == null || M(k)), ne.current = !0);
  }, [k, W]);
  var be = z;
  return O[nn] && X === Or && (be = re({
    transition: "none"
  }, be)), [W, X, be, k != null ? k : t];
}
function C1(e) {
  var t = e;
  wt(e) === "object" && (t = e.transitionSupport);
  function n(o, i) {
    return !!(o.motionName && t && i !== !1);
  }
  var r = /* @__PURE__ */ h.forwardRef(function(o, i) {
    var a = o.visible, s = a === void 0 ? !0 : a, l = o.removeOnLeave, c = l === void 0 ? !0 : l, f = o.forceRender, u = o.children, y = o.motionName, m = o.leavedClassName, g = o.eventProps, w = h.useContext(l1), d = w.motion, v = n(o, d), p = ye(), b = ye();
    function C() {
      try {
        return p.current instanceof HTMLElement ? p.current : mi(b.current);
      } catch {
        return null;
      }
    }
    var x = x1(v, s, C, o), S = ae(x, 4), E = S[0], M = S[1], _ = S[2], P = S[3], k = h.useRef(P);
    P && (k.current = !0);
    var I = h.useCallback(function(T) {
      p.current = T, iu(i, T);
    }, [i]), H, A = re(re({}, g), {}, {
      visible: s
    });
    if (!u)
      H = null;
    else if (E === Kn)
      P ? H = u(re({}, A), I) : !c && k.current && m ? H = u(re(re({}, A), {}, {
        className: m
      }), I) : f || !c && !m ? H = u(re(re({}, A), {}, {
        style: {
          display: "none"
        }
      }), I) : H = null;
    else {
      var L;
      M === nn ? L = "prepare" : ov(M) ? L = "active" : M === Or && (L = "start");
      var N = Zl(y, "".concat(E, "-").concat(L));
      H = u(re(re({}, A), {}, {
        className: it(Zl(y, E), xe(xe({}, N, N && L), y, typeof y == "string")),
        style: _
      }), I);
    }
    if (/* @__PURE__ */ h.isValidElement(H) && Yr(H)) {
      var $ = Lo(H);
      $ || (H = /* @__PURE__ */ h.cloneElement(H, {
        ref: I
      }));
    }
    return /* @__PURE__ */ h.createElement(c1, {
      ref: b
    }, H);
  });
  return r.displayName = "CSSMotion", r;
}
const ua = C1(Qf);
var ds = "add", fs = "keep", vs = "remove", ja = "removed";
function S1(e) {
  var t;
  return e && wt(e) === "object" && "key" in e ? t = e : t = {
    key: e
  }, re(re({}, t), {}, {
    key: String(t.key)
  });
}
function ps() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  return e.map(S1);
}
function E1() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], n = [], r = 0, o = t.length, i = ps(e), a = ps(t);
  i.forEach(function(c) {
    for (var f = !1, u = r; u < o; u += 1) {
      var y = a[u];
      if (y.key === c.key) {
        r < u && (n = n.concat(a.slice(r, u).map(function(m) {
          return re(re({}, m), {}, {
            status: ds
          });
        })), r = u), n.push(re(re({}, y), {}, {
          status: fs
        })), r += 1, f = !0;
        break;
      }
    }
    f || n.push(re(re({}, c), {}, {
      status: vs
    }));
  }), r < o && (n = n.concat(a.slice(r).map(function(c) {
    return re(re({}, c), {}, {
      status: ds
    });
  })));
  var s = {};
  n.forEach(function(c) {
    var f = c.key;
    s[f] = (s[f] || 0) + 1;
  });
  var l = Object.keys(s).filter(function(c) {
    return s[c] > 1;
  });
  return l.forEach(function(c) {
    n = n.filter(function(f) {
      var u = f.key, y = f.status;
      return u !== c || y !== vs;
    }), n.forEach(function(f) {
      f.key === c && (f.status = fs);
    });
  }), n;
}
var R1 = ["component", "children", "onVisibleChanged", "onAllRemoved"], M1 = ["status"], P1 = ["eventProps", "visible", "children", "motionName", "motionAppear", "motionEnter", "motionLeave", "motionLeaveImmediately", "motionDeadline", "removeOnLeave", "leavedClassName", "onAppearPrepare", "onAppearStart", "onAppearActive", "onAppearEnd", "onEnterStart", "onEnterActive", "onEnterEnd", "onLeaveStart", "onLeaveActive", "onLeaveEnd"];
function N1(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ua, n = /* @__PURE__ */ (function(r) {
    aa(i, r);
    var o = sa(i);
    function i() {
      var a;
      $o(this, i);
      for (var s = arguments.length, l = new Array(s), c = 0; c < s; c++)
        l[c] = arguments[c];
      return a = o.call.apply(o, [this].concat(l)), xe(ls(a), "state", {
        keyEntities: []
      }), xe(ls(a), "removeKey", function(f) {
        a.setState(function(u) {
          var y = u.keyEntities.map(function(m) {
            return m.key !== f ? m : re(re({}, m), {}, {
              status: ja
            });
          });
          return {
            keyEntities: y
          };
        }, function() {
          var u = a.state.keyEntities, y = u.filter(function(m) {
            var g = m.status;
            return g !== ja;
          }).length;
          y === 0 && a.props.onAllRemoved && a.props.onAllRemoved();
        });
      }), a;
    }
    return zo(i, [{
      key: "render",
      value: function() {
        var s = this, l = this.state.keyEntities, c = this.props, f = c.component, u = c.children, y = c.onVisibleChanged;
        c.onAllRemoved;
        var m = ft(c, R1), g = f || h.Fragment, w = {};
        return P1.forEach(function(d) {
          w[d] = m[d], delete m[d];
        }), delete m.keys, /* @__PURE__ */ h.createElement(g, m, l.map(function(d, v) {
          var p = d.status, b = ft(d, M1), C = p === ds || p === fs;
          return /* @__PURE__ */ h.createElement(t, $e({}, w, {
            key: b.key,
            visible: C,
            eventProps: b,
            onVisibleChanged: function(S) {
              y == null || y(S, {
                key: b.key
              }), S || s.removeKey(b.key);
            }
          }), function(x, S) {
            return u(re(re({}, x), {}, {
              index: v
            }), S);
          });
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function(s, l) {
        var c = s.keys, f = l.keyEntities, u = ps(c), y = E1(f, u);
        return {
          keyEntities: y.filter(function(m) {
            var g = f.find(function(w) {
              var d = w.key;
              return m.key === d;
            });
            return !(g && g.status === ja && m.status === vs);
          })
        };
      }
    }]), i;
  })(h.Component);
  return xe(n, "defaultProps", {
    component: "div"
  }), n;
}
N1(Qf);
function D1(e) {
  var t = e.prefixCls, n = e.align, r = e.arrow, o = e.arrowPos, i = r || {}, a = i.className, s = i.content, l = o.x, c = l === void 0 ? 0 : l, f = o.y, u = f === void 0 ? 0 : f, y = h.useRef();
  if (!n || !n.points)
    return null;
  var m = {
    position: "absolute"
  };
  if (n.autoArrow !== !1) {
    var g = n.points[0], w = n.points[1], d = g[0], v = g[1], p = w[0], b = w[1];
    d === p || !["t", "b"].includes(d) ? m.top = u : d === "t" ? m.top = 0 : m.bottom = 0, v === b || !["l", "r"].includes(v) ? m.left = c : v === "l" ? m.left = 0 : m.right = 0;
  }
  return /* @__PURE__ */ h.createElement("div", {
    ref: y,
    className: it("".concat(t, "-arrow"), a),
    style: m
  }, s);
}
function _1(e) {
  var t = e.prefixCls, n = e.open, r = e.zIndex, o = e.mask, i = e.motion;
  return o ? /* @__PURE__ */ h.createElement(ua, $e({}, i, {
    motionAppear: !0,
    visible: n,
    removeOnLeave: !0
  }), function(a) {
    var s = a.className;
    return /* @__PURE__ */ h.createElement("div", {
      style: {
        zIndex: r
      },
      className: it("".concat(t, "-mask"), s)
    });
  }) : null;
}
var O1 = /* @__PURE__ */ h.memo(function(e) {
  var t = e.children;
  return t;
}, function(e, t) {
  return t.cache;
}), k1 = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.popup, r = e.className, o = e.prefixCls, i = e.style, a = e.target, s = e.onVisibleChanged, l = e.open, c = e.keepDom, f = e.fresh, u = e.onClick, y = e.mask, m = e.arrow, g = e.arrowPos, w = e.align, d = e.motion, v = e.maskMotion, p = e.forceRender, b = e.getPopupContainer, C = e.autoDestroy, x = e.portal, S = e.zIndex, E = e.onMouseEnter, M = e.onMouseLeave, _ = e.onPointerEnter, P = e.onPointerDownCapture, k = e.ready, I = e.offsetX, H = e.offsetY, A = e.offsetR, L = e.offsetB, N = e.onAlign, $ = e.onPrepare, T = e.stretch, z = e.targetWidth, B = e.targetHeight, W = typeof n == "function" ? n() : n, Y = l || c, U = (b == null ? void 0 : b.length) > 0, V = h.useState(!b || !U), Z = ae(V, 2), se = Z[0], ge = Z[1];
  if (ht(function() {
    !se && U && a && ge(!0);
  }, [se, U, a]), !se)
    return null;
  var j = "auto", q = {
    left: "-1000vw",
    top: "-1000vh",
    right: j,
    bottom: j
  };
  if (k || !l) {
    var J, D = w.points, O = w.dynamicInset || ((J = w._experimental) === null || J === void 0 ? void 0 : J.dynamicInset), F = O && D[0][1] === "r", G = O && D[0][0] === "b";
    F ? (q.right = A, q.left = j) : (q.left = I, q.right = j), G ? (q.bottom = L, q.top = j) : (q.top = H, q.bottom = j);
  }
  var Q = {};
  return T && (T.includes("height") && B ? Q.height = B : T.includes("minHeight") && B && (Q.minHeight = B), T.includes("width") && z ? Q.width = z : T.includes("minWidth") && z && (Q.minWidth = z)), l || (Q.pointerEvents = "none"), /* @__PURE__ */ h.createElement(x, {
    open: p || Y,
    getContainer: b && function() {
      return b(a);
    },
    autoDestroy: C
  }, /* @__PURE__ */ h.createElement(_1, {
    prefixCls: o,
    open: l,
    zIndex: S,
    mask: y,
    motion: v
  }), /* @__PURE__ */ h.createElement(mr, {
    onResize: N,
    disabled: !l
  }, function(X) {
    return /* @__PURE__ */ h.createElement(ua, $e({
      motionAppear: !0,
      motionEnter: !0,
      motionLeave: !0,
      removeOnLeave: !1,
      forceRender: p,
      leavedClassName: "".concat(o, "-hidden")
    }, d, {
      onAppearPrepare: $,
      onEnterPrepare: $,
      visible: l,
      onVisibleChanged: function(ee) {
        var ne;
        d == null || (ne = d.onVisibleChanged) === null || ne === void 0 || ne.call(d, ee), s(ee);
      }
    }), function(oe, ee) {
      var ne = oe.className, be = oe.style, we = it(o, ne, r);
      return /* @__PURE__ */ h.createElement("div", {
        ref: ra(X, t, ee),
        className: we,
        style: re(re(re(re({
          "--arrow-x": "".concat(g.x || 0, "px"),
          "--arrow-y": "".concat(g.y || 0, "px")
        }, q), Q), be), {}, {
          boxSizing: "border-box",
          zIndex: S
        }, i),
        onMouseEnter: E,
        onMouseLeave: M,
        onPointerEnter: _,
        onClick: u,
        onPointerDownCapture: P
      }, m && /* @__PURE__ */ h.createElement(D1, {
        prefixCls: o,
        arrow: m,
        arrowPos: g,
        align: w
      }), /* @__PURE__ */ h.createElement(O1, {
        cache: !l && !f
      }, W));
    });
  }));
}), T1 = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.children, r = e.getTriggerDOMNode, o = Yr(n), i = h.useCallback(function(s) {
    iu(t, r ? r(s) : s);
  }, [r]), a = oa(i, Lo(n));
  return o ? /* @__PURE__ */ h.cloneElement(n, {
    ref: a
  }) : n;
}), Jl = /* @__PURE__ */ h.createContext(null);
function ec(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
function I1(e, t, n, r) {
  return h.useMemo(function() {
    var o = ec(n != null ? n : t), i = ec(r != null ? r : t), a = new Set(o), s = new Set(i);
    return e && (a.has("hover") && (a.delete("hover"), a.add("click")), s.has("hover") && (s.delete("hover"), s.add("click"))), [a, s];
  }, [e, t, n, r]);
}
const iv = (function(e) {
  if (!e)
    return !1;
  if (e instanceof Element) {
    if (e.offsetParent)
      return !0;
    if (e.getBBox) {
      var t = e.getBBox(), n = t.width, r = t.height;
      if (n || r)
        return !0;
    }
    if (e.getBoundingClientRect) {
      var o = e.getBoundingClientRect(), i = o.width, a = o.height;
      if (i || a)
        return !0;
    }
  }
  return !1;
});
function A1() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], n = arguments.length > 2 ? arguments[2] : void 0;
  return n ? e[0] === t[0] : e[0] === t[0] && e[1] === t[1];
}
function L1(e, t, n, r) {
  for (var o = n.points, i = Object.keys(e), a = 0; a < i.length; a += 1) {
    var s, l = i[a];
    if (A1((s = e[l]) === null || s === void 0 ? void 0 : s.points, o, r))
      return "".concat(t, "-placement-").concat(l);
  }
  return "";
}
function tc(e, t, n, r) {
  return t || (n ? {
    motionName: "".concat(e, "-").concat(n)
  } : r ? {
    motionName: r
  } : null);
}
function Fo(e) {
  return e.ownerDocument.defaultView;
}
function hs(e) {
  for (var t = [], n = e == null ? void 0 : e.parentElement, r = ["hidden", "scroll", "clip", "auto"]; n; ) {
    var o = Fo(n).getComputedStyle(n), i = o.overflowX, a = o.overflowY, s = o.overflow;
    [i, a, s].some(function(l) {
      return r.includes(l);
    }) && t.push(n), n = n.parentElement;
  }
  return t;
}
function Mo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  return Number.isNaN(e) ? t : e;
}
function co(e) {
  return Mo(parseFloat(e), 0);
}
function nc(e, t) {
  var n = re({}, e);
  return (t || []).forEach(function(r) {
    if (!(r instanceof HTMLBodyElement || r instanceof HTMLHtmlElement)) {
      var o = Fo(r).getComputedStyle(r), i = o.overflow, a = o.overflowClipMargin, s = o.borderTopWidth, l = o.borderBottomWidth, c = o.borderLeftWidth, f = o.borderRightWidth, u = r.getBoundingClientRect(), y = r.offsetHeight, m = r.clientHeight, g = r.offsetWidth, w = r.clientWidth, d = co(s), v = co(l), p = co(c), b = co(f), C = Mo(Math.round(u.width / g * 1e3) / 1e3), x = Mo(Math.round(u.height / y * 1e3) / 1e3), S = (g - w - p - b) * C, E = (y - m - d - v) * x, M = d * x, _ = v * x, P = p * C, k = b * C, I = 0, H = 0;
      if (i === "clip") {
        var A = co(a);
        I = A * C, H = A * x;
      }
      var L = u.x + P - I, N = u.y + M - H, $ = L + u.width + 2 * I - P - k - S, T = N + u.height + 2 * H - M - _ - E;
      n.left = Math.max(n.left, L), n.top = Math.max(n.top, N), n.right = Math.min(n.right, $), n.bottom = Math.min(n.bottom, T);
    }
  }), n;
}
function rc(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = "".concat(t), r = n.match(/^(.*)\%$/);
  return r ? e * (parseFloat(r[1]) / 100) : parseFloat(n);
}
function oc(e, t) {
  var n = t || [], r = ae(n, 2), o = r[0], i = r[1];
  return [rc(e.width, o), rc(e.height, i)];
}
function ic() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  return [e[0], e[1]];
}
function Rr(e, t) {
  var n = t[0], r = t[1], o, i;
  return n === "t" ? i = e.y : n === "b" ? i = e.y + e.height : i = e.y + e.height / 2, r === "l" ? o = e.x : r === "r" ? o = e.x + e.width : o = e.x + e.width / 2, {
    x: o,
    y: i
  };
}
function Un(e, t) {
  var n = {
    t: "b",
    b: "t",
    l: "r",
    r: "l"
  };
  return e.map(function(r, o) {
    return o === t ? n[r] || "c" : r;
  }).join("");
}
function $1(e, t, n, r, o, i, a) {
  var s = h.useState({
    ready: !1,
    offsetX: 0,
    offsetY: 0,
    offsetR: 0,
    offsetB: 0,
    arrowX: 0,
    arrowY: 0,
    scaleX: 1,
    scaleY: 1,
    align: o[r] || {}
  }), l = ae(s, 2), c = l[0], f = l[1], u = h.useRef(0), y = h.useMemo(function() {
    return t ? hs(t) : [];
  }, [t]), m = h.useRef({}), g = function() {
    m.current = {};
  };
  e || g();
  var w = Ot(function() {
    if (t && n && e) {
      let Gt = function(xr, Hn) {
        var Wn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : He, Qr = V.x + xr, Go = V.y + Hn, ya = Qr + F, ba = Go + O, wa = Math.max(Qr, Wn.left), he = Math.max(Go, Wn.top), Se = Math.min(ya, Wn.right), rt = Math.min(ba, Wn.bottom);
        return Math.max(0, (Se - wa) * (rt - he));
      }, Uo = function() {
        Ht = V.y + ue, Jt = Ht + O, At = V.x + fe, cn = At + F;
      };
      var p, b, C, x, S = t, E = S.ownerDocument, M = Fo(S), _ = M.getComputedStyle(S), P = _.width, k = _.height, I = _.position, H = S.style.left, A = S.style.top, L = S.style.right, N = S.style.bottom, $ = S.style.overflow, T = re(re({}, o[r]), i), z = E.createElement("div");
      (p = S.parentElement) === null || p === void 0 || p.appendChild(z), z.style.left = "".concat(S.offsetLeft, "px"), z.style.top = "".concat(S.offsetTop, "px"), z.style.position = I, z.style.height = "".concat(S.offsetHeight, "px"), z.style.width = "".concat(S.offsetWidth, "px"), S.style.left = "0", S.style.top = "0", S.style.right = "auto", S.style.bottom = "auto", S.style.overflow = "hidden";
      var B;
      if (Array.isArray(n))
        B = {
          x: n[0],
          y: n[1],
          width: 0,
          height: 0
        };
      else {
        var W, Y, U = n.getBoundingClientRect();
        U.x = (W = U.x) !== null && W !== void 0 ? W : U.left, U.y = (Y = U.y) !== null && Y !== void 0 ? Y : U.top, B = {
          x: U.x,
          y: U.y,
          width: U.width,
          height: U.height
        };
      }
      var V = S.getBoundingClientRect();
      V.x = (b = V.x) !== null && b !== void 0 ? b : V.left, V.y = (C = V.y) !== null && C !== void 0 ? C : V.top;
      var Z = E.documentElement, se = Z.clientWidth, ge = Z.clientHeight, j = Z.scrollWidth, q = Z.scrollHeight, J = Z.scrollTop, D = Z.scrollLeft, O = V.height, F = V.width, G = B.height, Q = B.width, X = {
        left: 0,
        top: 0,
        right: se,
        bottom: ge
      }, oe = {
        left: -D,
        top: -J,
        right: j - D,
        bottom: q - J
      }, ee = T.htmlRegion, ne = "visible", be = "visibleFirst";
      ee !== "scroll" && ee !== be && (ee = ne);
      var we = ee === be, pe = nc(oe, y), te = nc(X, y), He = ee === ne ? te : pe, Te = we ? te : He;
      S.style.left = "auto", S.style.top = "auto", S.style.right = "0", S.style.bottom = "0";
      var Ee = S.getBoundingClientRect();
      S.style.left = H, S.style.top = A, S.style.right = L, S.style.bottom = N, S.style.overflow = $, (x = S.parentElement) === null || x === void 0 || x.removeChild(z);
      var Ge = Mo(Math.round(F / parseFloat(P) * 1e3) / 1e3), ze = Mo(Math.round(O / parseFloat(k) * 1e3) / 1e3);
      if (Ge === 0 || ze === 0 || Eo(n) && !iv(n))
        return;
      var Ie = T.offset, Xe = T.targetOffset, Je = oc(V, Ie), je = ae(Je, 2), Ze = je[0], Ae = je[1], Fe = oc(B, Xe), Ke = ae(Fe, 2), vt = Ke[0], st = Ke[1];
      B.x -= vt, B.y -= st;
      var pt = T.points || [], zt = ae(pt, 2), St = zt[0], Tt = zt[1], ot = ic(Tt), ce = ic(St), _e = Rr(B, ot), Re = Rr(V, ce), de = re({}, T), fe = _e.x - Re.x + Ze, ue = _e.y - Re.y + Ae, Pe = Gt(fe, ue), nt = Gt(fe, ue, te), et = Rr(B, ["t", "l"]), Ve = Rr(V, ["t", "l"]), Xt = Rr(B, ["b", "r"]), yt = Rr(V, ["b", "r"]), It = T.overflow || {}, Zt = It.adjustX, An = It.adjustY, Ft = It.shiftX, Et = It.shiftY, Qt = function(Hn) {
        return typeof Hn == "boolean" ? Hn : Hn >= 0;
      }, Ht, Jt, At, cn;
      Uo();
      var Pt = Qt(An), Sn = ce[0] === ot[0];
      if (Pt && ce[0] === "t" && (Jt > Te.bottom || m.current.bt)) {
        var le = ue;
        Sn ? le -= O - G : le = et.y - yt.y - Ae;
        var ve = Gt(fe, le), Me = Gt(fe, le, te);
        // Of course use larger one
        ve > Pe || ve === Pe && (!we || // Choose recommend one
        Me >= nt) ? (m.current.bt = !0, ue = le, Ae = -Ae, de.points = [Un(ce, 0), Un(ot, 0)]) : m.current.bt = !1;
      }
      if (Pt && ce[0] === "b" && (Ht < Te.top || m.current.tb)) {
        var Oe = ue;
        Sn ? Oe += O - G : Oe = Xt.y - Ve.y - Ae;
        var Ye = Gt(fe, Oe), qt = Gt(fe, Oe, te);
        // Of course use larger one
        Ye > Pe || Ye === Pe && (!we || // Choose recommend one
        qt >= nt) ? (m.current.tb = !0, ue = Oe, Ae = -Ae, de.points = [Un(ce, 0), Un(ot, 0)]) : m.current.tb = !1;
      }
      var Lt = Qt(Zt), dn = ce[1] === ot[1];
      if (Lt && ce[1] === "l" && (cn > Te.right || m.current.rl)) {
        var en = fe;
        dn ? en -= F - Q : en = et.x - yt.x - Ze;
        var fn = Gt(en, ue), _t = Gt(en, ue, te);
        // Of course use larger one
        fn > Pe || fn === Pe && (!we || // Choose recommend one
        _t >= nt) ? (m.current.rl = !0, fe = en, Ze = -Ze, de.points = [Un(ce, 1), Un(ot, 1)]) : m.current.rl = !1;
      }
      if (Lt && ce[1] === "r" && (At < Te.left || m.current.lr)) {
        var tn = fe;
        dn ? tn += F - Q : tn = Xt.x - Ve.x - Ze;
        var yr = Gt(tn, ue), br = Gt(tn, ue, te);
        // Of course use larger one
        yr > Pe || yr === Pe && (!we || // Choose recommend one
        br >= nt) ? (m.current.lr = !0, fe = tn, Ze = -Ze, de.points = [Un(ce, 1), Un(ot, 1)]) : m.current.lr = !1;
      }
      Uo();
      var Wt = Ft === !0 ? 0 : Ft;
      typeof Wt == "number" && (At < te.left && (fe -= At - te.left - Ze, B.x + Q < te.left + Wt && (fe += B.x - te.left + Q - Wt)), cn > te.right && (fe -= cn - te.right - Ze, B.x > te.right - Wt && (fe += B.x - te.right + Wt)));
      var Bt = Et === !0 ? 0 : Et;
      typeof Bt == "number" && (Ht < te.top && (ue -= Ht - te.top - Ae, B.y + G < te.top + Bt && (ue += B.y - te.top + G - Bt)), Jt > te.bottom && (ue -= Jt - te.bottom - Ae, B.y > te.bottom - Bt && (ue += B.y - te.bottom + Bt)));
      var Ln = V.x + fe, $n = Ln + F, Ut = V.y + ue, Xr = Ut + O, Qe = B.x, Le = Qe + Q, We = B.y, Rt = We + G, Mt = Math.max(Ln, Qe), zn = Math.min($n, Le), Fn = (Mt + zn) / 2, Zr = Fn - Ln, wr = Math.max(Ut, We), or = Math.min(Xr, Rt), En = (wr + or) / 2, ir = En - Ut;
      a == null || a(t, de);
      var ar = Ee.right - V.x - (fe + V.width), vn = Ee.bottom - V.y - (ue + V.height);
      Ge === 1 && (fe = Math.round(fe), ar = Math.round(ar)), ze === 1 && (ue = Math.round(ue), vn = Math.round(vn));
      var ga = {
        ready: !0,
        offsetX: fe / Ge,
        offsetY: ue / ze,
        offsetR: ar / Ge,
        offsetB: vn / ze,
        arrowX: Zr / Ge,
        arrowY: ir / ze,
        scaleX: Ge,
        scaleY: ze,
        align: de
      };
      f(ga);
    }
  }), d = function() {
    u.current += 1;
    var b = u.current;
    Promise.resolve().then(function() {
      u.current === b && w();
    });
  }, v = function() {
    f(function(b) {
      return re(re({}, b), {}, {
        ready: !1
      });
    });
  };
  return ht(v, [r]), ht(function() {
    e || v();
  }, [e]), [c.ready, c.offsetX, c.offsetY, c.offsetR, c.offsetB, c.arrowX, c.arrowY, c.scaleX, c.scaleY, c.align, d];
}
function z1(e, t, n, r, o) {
  ht(function() {
    if (e && t && n) {
      let u = function() {
        r(), o();
      };
      var i = t, a = n, s = hs(i), l = hs(a), c = Fo(a), f = new Set([c].concat(xn(s), xn(l)));
      return f.forEach(function(y) {
        y.addEventListener("scroll", u, {
          passive: !0
        });
      }), c.addEventListener("resize", u, {
        passive: !0
      }), r(), function() {
        f.forEach(function(y) {
          y.removeEventListener("scroll", u), c.removeEventListener("resize", u);
        });
      };
    }
  }, [e, t, n]);
}
function F1(e, t, n, r, o, i, a, s) {
  var l = h.useRef(e);
  l.current = e;
  var c = h.useRef(!1);
  h.useEffect(function() {
    if (t && r && (!o || i)) {
      var u = function() {
        c.current = !1;
      }, y = function(d) {
        var v;
        l.current && !a(((v = d.composedPath) === null || v === void 0 || (v = v.call(d)) === null || v === void 0 ? void 0 : v[0]) || d.target) && !c.current && s(!1);
      }, m = Fo(r);
      m.addEventListener("pointerdown", u, !0), m.addEventListener("mousedown", y, !0), m.addEventListener("contextmenu", y, !0);
      var g = cs(n);
      return g && (g.addEventListener("mousedown", y, !0), g.addEventListener("contextmenu", y, !0)), function() {
        m.removeEventListener("pointerdown", u, !0), m.removeEventListener("mousedown", y, !0), m.removeEventListener("contextmenu", y, !0), g && (g.removeEventListener("mousedown", y, !0), g.removeEventListener("contextmenu", y, !0));
      };
    }
  }, [t, n, r, o, i]);
  function f() {
    c.current = !0;
  }
  return f;
}
var H1 = ["prefixCls", "children", "action", "showAction", "hideAction", "popupVisible", "defaultPopupVisible", "onPopupVisibleChange", "afterPopupVisibleChange", "mouseEnterDelay", "mouseLeaveDelay", "focusDelay", "blurDelay", "mask", "maskClosable", "getPopupContainer", "forceRender", "autoDestroy", "destroyPopupOnHide", "popup", "popupClassName", "popupStyle", "popupPlacement", "builtinPlacements", "popupAlign", "zIndex", "stretch", "getPopupClassNameFromAlign", "fresh", "alignPoint", "onPopupClick", "onPopupAlign", "arrow", "popupMotion", "maskMotion", "popupTransitionName", "popupAnimation", "maskTransitionName", "maskAnimation", "className", "getTriggerDOMNode"];
function W1() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : jf, t = /* @__PURE__ */ h.forwardRef(function(n, r) {
    var o = n.prefixCls, i = o === void 0 ? "rc-trigger-popup" : o, a = n.children, s = n.action, l = s === void 0 ? "hover" : s, c = n.showAction, f = n.hideAction, u = n.popupVisible, y = n.defaultPopupVisible, m = n.onPopupVisibleChange, g = n.afterPopupVisibleChange, w = n.mouseEnterDelay, d = n.mouseLeaveDelay, v = d === void 0 ? 0.1 : d, p = n.focusDelay, b = n.blurDelay, C = n.mask, x = n.maskClosable, S = x === void 0 ? !0 : x, E = n.getPopupContainer, M = n.forceRender, _ = n.autoDestroy, P = n.destroyPopupOnHide, k = n.popup, I = n.popupClassName, H = n.popupStyle, A = n.popupPlacement, L = n.builtinPlacements, N = L === void 0 ? {} : L, $ = n.popupAlign, T = n.zIndex, z = n.stretch, B = n.getPopupClassNameFromAlign, W = n.fresh, Y = n.alignPoint, U = n.onPopupClick, V = n.onPopupAlign, Z = n.arrow, se = n.popupMotion, ge = n.maskMotion, j = n.popupTransitionName, q = n.popupAnimation, J = n.maskTransitionName, D = n.maskAnimation, O = n.className, F = n.getTriggerDOMNode, G = ft(n, H1), Q = _ || P || !1, X = h.useState(!1), oe = ae(X, 2), ee = oe[0], ne = oe[1];
    ht(function() {
      ne(u1());
    }, []);
    var be = h.useRef({}), we = h.useContext(Jl), pe = h.useMemo(function() {
      return {
        registerSubPopup: function(Se, rt) {
          be.current[Se] = rt, we == null || we.registerSubPopup(Se, rt);
        }
      };
    }, [we]), te = s1(), He = h.useState(null), Te = ae(He, 2), Ee = Te[0], Ge = Te[1], ze = h.useRef(null), Ie = Ot(function(he) {
      ze.current = he, Eo(he) && Ee !== he && Ge(he), we == null || we.registerSubPopup(te, he);
    }), Xe = h.useState(null), Je = ae(Xe, 2), je = Je[0], Ze = Je[1], Ae = h.useRef(null), Fe = Ot(function(he) {
      Eo(he) && je !== he && (Ze(he), Ae.current = he);
    }), Ke = h.Children.only(a), vt = (Ke == null ? void 0 : Ke.props) || {}, st = {}, pt = Ot(function(he) {
      var Se, rt, bt = je;
      return (bt == null ? void 0 : bt.contains(he)) || ((Se = cs(bt)) === null || Se === void 0 ? void 0 : Se.host) === he || he === bt || (Ee == null ? void 0 : Ee.contains(he)) || ((rt = cs(Ee)) === null || rt === void 0 ? void 0 : rt.host) === he || he === Ee || Object.values(be.current).some(function(ut) {
        return (ut == null ? void 0 : ut.contains(he)) || he === ut;
      });
    }), zt = tc(i, se, q, j), St = tc(i, ge, D, J), Tt = h.useState(y || !1), ot = ae(Tt, 2), ce = ot[0], _e = ot[1], Re = u != null ? u : ce, de = Ot(function(he) {
      u === void 0 && _e(he);
    });
    ht(function() {
      _e(u || !1);
    }, [u]);
    var fe = h.useRef(Re);
    fe.current = Re;
    var ue = h.useRef([]);
    ue.current = [];
    var Pe = Ot(function(he) {
      var Se;
      de(he), ((Se = ue.current[ue.current.length - 1]) !== null && Se !== void 0 ? Se : Re) !== he && (ue.current.push(he), m == null || m(he));
    }), nt = h.useRef(), et = function() {
      clearTimeout(nt.current);
    }, Ve = function(Se) {
      var rt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      et(), rt === 0 ? Pe(Se) : nt.current = setTimeout(function() {
        Pe(Se);
      }, rt * 1e3);
    };
    h.useEffect(function() {
      return et;
    }, []);
    var Xt = h.useState(!1), yt = ae(Xt, 2), It = yt[0], Zt = yt[1];
    ht(function(he) {
      (!he || Re) && Zt(!0);
    }, [Re]);
    var An = h.useState(null), Ft = ae(An, 2), Et = Ft[0], Qt = Ft[1], Ht = h.useState(null), Jt = ae(Ht, 2), At = Jt[0], cn = Jt[1], Pt = function(Se) {
      cn([Se.clientX, Se.clientY]);
    }, Sn = $1(Re, Ee, Y && At !== null ? At : je, A, N, $, V), le = ae(Sn, 11), ve = le[0], Me = le[1], Oe = le[2], Ye = le[3], qt = le[4], Lt = le[5], dn = le[6], en = le[7], fn = le[8], _t = le[9], tn = le[10], yr = I1(ee, l, c, f), br = ae(yr, 2), Wt = br[0], Bt = br[1], Ln = Wt.has("click"), $n = Bt.has("click") || Bt.has("contextMenu"), Ut = Ot(function() {
      It || tn();
    }), Xr = function() {
      fe.current && Y && $n && Ve(!1);
    };
    z1(Re, je, Ee, Ut, Xr), ht(function() {
      Ut();
    }, [At, A]), ht(function() {
      Re && !(N != null && N[A]) && Ut();
    }, [JSON.stringify($)]);
    var Qe = h.useMemo(function() {
      var he = L1(N, i, _t, Y);
      return it(he, B == null ? void 0 : B(_t));
    }, [_t, B, N, i, Y]);
    h.useImperativeHandle(r, function() {
      return {
        nativeElement: Ae.current,
        popupElement: ze.current,
        forceAlign: Ut
      };
    });
    var Le = h.useState(0), We = ae(Le, 2), Rt = We[0], Mt = We[1], zn = h.useState(0), Fn = ae(zn, 2), Zr = Fn[0], wr = Fn[1], or = function() {
      if (z && je) {
        var Se = je.getBoundingClientRect();
        Mt(Se.width), wr(Se.height);
      }
    }, En = function() {
      or(), Ut();
    }, ir = function(Se) {
      Zt(!1), tn(), g == null || g(Se);
    }, ar = function() {
      return new Promise(function(Se) {
        or(), Qt(function() {
          return Se;
        });
      });
    };
    ht(function() {
      Et && (tn(), Et(), Qt(null));
    }, [Et]);
    function vn(he, Se, rt, bt) {
      st[he] = function(ut) {
        var Ko;
        bt == null || bt(ut), Ve(Se, rt);
        for (var xa = arguments.length, Mu = new Array(xa > 1 ? xa - 1 : 0), Yo = 1; Yo < xa; Yo++)
          Mu[Yo - 1] = arguments[Yo];
        (Ko = vt[he]) === null || Ko === void 0 || Ko.call.apply(Ko, [vt, ut].concat(Mu));
      };
    }
    (Ln || $n) && (st.onClick = function(he) {
      var Se;
      fe.current && $n ? Ve(!1) : !fe.current && Ln && (Pt(he), Ve(!0));
      for (var rt = arguments.length, bt = new Array(rt > 1 ? rt - 1 : 0), ut = 1; ut < rt; ut++)
        bt[ut - 1] = arguments[ut];
      (Se = vt.onClick) === null || Se === void 0 || Se.call.apply(Se, [vt, he].concat(bt));
    });
    var ga = F1(Re, $n, je, Ee, C, S, pt, Ve), Gt = Wt.has("hover"), Uo = Bt.has("hover"), xr, Hn;
    Gt && (vn("onMouseEnter", !0, w, function(he) {
      Pt(he);
    }), vn("onPointerEnter", !0, w, function(he) {
      Pt(he);
    }), xr = function(Se) {
      (Re || It) && Ee !== null && Ee !== void 0 && Ee.contains(Se.target) && Ve(!0, w);
    }, Y && (st.onMouseMove = function(he) {
      var Se;
      (Se = vt.onMouseMove) === null || Se === void 0 || Se.call(vt, he);
    })), Uo && (vn("onMouseLeave", !1, v), vn("onPointerLeave", !1, v), Hn = function() {
      Ve(!1, v);
    }), Wt.has("focus") && vn("onFocus", !0, p), Bt.has("focus") && vn("onBlur", !1, b), Wt.has("contextMenu") && (st.onContextMenu = function(he) {
      var Se;
      fe.current && Bt.has("contextMenu") ? Ve(!1) : (Pt(he), Ve(!0)), he.preventDefault();
      for (var rt = arguments.length, bt = new Array(rt > 1 ? rt - 1 : 0), ut = 1; ut < rt; ut++)
        bt[ut - 1] = arguments[ut];
      (Se = vt.onContextMenu) === null || Se === void 0 || Se.call.apply(Se, [vt, he].concat(bt));
    }), O && (st.className = it(vt.className, O));
    var Wn = re(re({}, vt), st), Qr = {}, Go = ["onContextMenu", "onClick", "onMouseDown", "onTouchStart", "onMouseEnter", "onMouseLeave", "onFocus", "onBlur"];
    Go.forEach(function(he) {
      G[he] && (Qr[he] = function() {
        for (var Se, rt = arguments.length, bt = new Array(rt), ut = 0; ut < rt; ut++)
          bt[ut] = arguments[ut];
        (Se = Wn[he]) === null || Se === void 0 || Se.call.apply(Se, [Wn].concat(bt)), G[he].apply(G, bt);
      });
    });
    var ya = /* @__PURE__ */ h.cloneElement(Ke, re(re({}, Wn), Qr)), ba = {
      x: Lt,
      y: dn
    }, wa = Z ? re({}, Z !== !0 ? Z : {}) : null;
    return /* @__PURE__ */ h.createElement(h.Fragment, null, /* @__PURE__ */ h.createElement(mr, {
      disabled: !Re,
      ref: Fe,
      onResize: En
    }, /* @__PURE__ */ h.createElement(T1, {
      getTriggerDOMNode: F
    }, ya)), /* @__PURE__ */ h.createElement(Jl.Provider, {
      value: pe
    }, /* @__PURE__ */ h.createElement(k1, {
      portal: e,
      ref: Ie,
      prefixCls: i,
      popup: k,
      className: it(I, Qe),
      style: H,
      target: je,
      onMouseEnter: xr,
      onMouseLeave: Hn,
      onPointerEnter: xr,
      zIndex: T,
      open: Re,
      keepDom: It,
      fresh: W,
      onClick: U,
      onPointerDownCapture: ga,
      mask: C,
      motion: zt,
      maskMotion: St,
      onVisibleChanged: ir,
      onPrepare: ar,
      forceRender: M,
      autoDestroy: Q,
      getPopupContainer: E,
      align: _t,
      arrow: wa,
      arrowPos: ba,
      ready: ve,
      offsetX: Me,
      offsetY: Oe,
      offsetR: Ye,
      offsetB: qt,
      onAlign: Ut,
      stretch: z,
      targetWidth: Rt / en,
      targetHeight: Zr / fn
    })));
  });
  return t;
}
const av = W1(jf);
var ln = {
  /**
   * TAB
   */
  TAB: 9,
  // NUMLOCK on FF/Safari Mac
  /**
   * ENTER
   */
  ENTER: 13,
  /**
   * ESC
   */
  ESC: 27,
  // also NUM_SOUTH_EAST
  /**
   * END
   */
  END: 35,
  // also NUM_SOUTH_WEST
  /**
   * HOME
   */
  HOME: 36,
  // also NUM_NORTH_WEST
  /**
   * LEFT
   */
  LEFT: 37,
  // also NUM_WEST
  /**
   * UP
   */
  UP: 38,
  // also NUM_NORTH
  /**
   * RIGHT
   */
  RIGHT: 39,
  // also NUM_EAST
  /**
   * DOWN
   */
  DOWN: 40
}, B1 = ln.ESC, j1 = ln.TAB;
function V1(e) {
  var t = e.visible, n = e.triggerRef, r = e.onVisibleChange, o = e.autoFocus, i = e.overlayRef, a = h.useRef(!1), s = function() {
    if (t) {
      var u, y;
      (u = n.current) === null || u === void 0 || (y = u.focus) === null || y === void 0 || y.call(u), r == null || r(!1);
    }
  }, l = function() {
    var u;
    return (u = i.current) !== null && u !== void 0 && u.focus ? (i.current.focus(), a.current = !0, !0) : !1;
  }, c = function(u) {
    switch (u.keyCode) {
      case B1:
        s();
        break;
      case j1: {
        var y = !1;
        a.current || (y = l()), y ? u.preventDefault() : s();
        break;
      }
    }
  };
  h.useEffect(function() {
    return t ? (window.addEventListener("keydown", c), o && mt(l, 3), function() {
      window.removeEventListener("keydown", c), a.current = !1;
    }) : function() {
      a.current = !1;
    };
  }, [t]);
}
var q1 = /* @__PURE__ */ Ue(function(e, t) {
  var n = e.overlay, r = e.arrow, o = e.prefixCls, i = lt(function() {
    var s;
    return typeof n == "function" ? s = n() : s = n, s;
  }, [n]), a = ra(t, Lo(i));
  return /* @__PURE__ */ K.createElement(K.Fragment, null, r && /* @__PURE__ */ K.createElement("div", {
    className: "".concat(o, "-arrow")
  }), /* @__PURE__ */ K.cloneElement(i, {
    ref: Yr(i) ? a : void 0
  }));
}), Mr = {
  adjustX: 1,
  adjustY: 1
}, Pr = [0, 0], U1 = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: Mr,
    offset: [0, -4],
    targetOffset: Pr
  },
  top: {
    points: ["bc", "tc"],
    overflow: Mr,
    offset: [0, -4],
    targetOffset: Pr
  },
  topRight: {
    points: ["br", "tr"],
    overflow: Mr,
    offset: [0, -4],
    targetOffset: Pr
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: Mr,
    offset: [0, 4],
    targetOffset: Pr
  },
  bottom: {
    points: ["tc", "bc"],
    overflow: Mr,
    offset: [0, 4],
    targetOffset: Pr
  },
  bottomRight: {
    points: ["tr", "br"],
    overflow: Mr,
    offset: [0, 4],
    targetOffset: Pr
  }
}, G1 = ["arrow", "prefixCls", "transitionName", "animation", "align", "placement", "placements", "getPopupContainer", "showAction", "hideAction", "overlayClassName", "overlayStyle", "visible", "trigger", "autoFocus", "overlay", "children", "onVisibleChange"];
function K1(e, t) {
  var n, r = e.arrow, o = r === void 0 ? !1 : r, i = e.prefixCls, a = i === void 0 ? "rc-dropdown" : i, s = e.transitionName, l = e.animation, c = e.align, f = e.placement, u = f === void 0 ? "bottomLeft" : f, y = e.placements, m = y === void 0 ? U1 : y, g = e.getPopupContainer, w = e.showAction, d = e.hideAction, v = e.overlayClassName, p = e.overlayStyle, b = e.visible, C = e.trigger, x = C === void 0 ? ["hover"] : C, S = e.autoFocus, E = e.overlay, M = e.children, _ = e.onVisibleChange, P = ft(e, G1), k = K.useState(), I = ae(k, 2), H = I[0], A = I[1], L = "visible" in e ? b : H, N = K.useRef(null), $ = K.useRef(null), T = K.useRef(null);
  K.useImperativeHandle(t, function() {
    return N.current;
  });
  var z = function(j) {
    A(j), _ == null || _(j);
  };
  V1({
    visible: L,
    triggerRef: T,
    onVisibleChange: z,
    autoFocus: S,
    overlayRef: $
  });
  var B = function(j) {
    var q = e.onOverlayClick;
    A(!1), q && q(j);
  }, W = function() {
    return /* @__PURE__ */ K.createElement(q1, {
      ref: $,
      overlay: E,
      prefixCls: a,
      arrow: o
    });
  }, Y = function() {
    return typeof E == "function" ? W : W();
  }, U = function() {
    var j = e.minOverlayWidthMatchTrigger, q = e.alignPoint;
    return "minOverlayWidthMatchTrigger" in e ? j : !q;
  }, V = function() {
    var j = e.openClassName;
    return j !== void 0 ? j : "".concat(a, "-open");
  }, Z = /* @__PURE__ */ K.cloneElement(M, {
    className: it((n = M.props) === null || n === void 0 ? void 0 : n.className, L && V()),
    ref: Yr(M) ? ra(T, Lo(M)) : void 0
  }), se = d;
  return !se && x.indexOf("contextMenu") !== -1 && (se = ["click"]), /* @__PURE__ */ K.createElement(av, $e({
    builtinPlacements: m
  }, P, {
    prefixCls: a,
    ref: N,
    popupClassName: it(v, xe({}, "".concat(a, "-show-arrow"), o)),
    popupStyle: p,
    action: x,
    showAction: w,
    hideAction: se,
    popupPlacement: u,
    popupAlign: c,
    popupTransitionName: s,
    popupAnimation: l,
    popupVisible: L,
    stretch: U() ? "minWidth" : "",
    popup: Y(),
    onPopupVisibleChange: z,
    onPopupClick: B,
    getPopupContainer: g
  }), Z);
}
const Y1 = /* @__PURE__ */ K.forwardRef(K1);
function NE(e) {
  const {
    className: t,
    placement: n,
    children: r,
    overlay: o,
    alignPoint: i = !1,
    align: a,
    disabled: s,
    onVisibleChange: l
  } = e, c = s ? [] : e.trigger || ["click"], { mountContainer: f } = Jn(Tn);
  return f && /* @__PURE__ */ R(
    Y1,
    {
      ...e,
      overlayClassName: t,
      prefixCls: "univer-dropdown",
      getPopupContainer: () => f,
      trigger: c,
      animation: "slide-up",
      placement: n,
      overlay: o,
      alignPoint: i,
      align: a,
      onVisibleChange: l,
      children: r
    }
  );
}
function sv(e) {
  const t = e + "CollectionProvider", [n, r] = er(t), [o, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (w) => {
    const { scope: d, children: v } = w, p = K.useRef(null), b = K.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ R(o, { scope: d, itemMap: b, collectionRef: p, children: v });
  };
  a.displayName = t;
  const s = e + "CollectionSlot", l = /* @__PURE__ */ Lr(s), c = K.forwardRef(
    (w, d) => {
      const { scope: v, children: p } = w, b = i(s, v), C = gt(d, b.collectionRef);
      return /* @__PURE__ */ R(l, { ref: C, children: p });
    }
  );
  c.displayName = s;
  const f = e + "CollectionItemSlot", u = "data-radix-collection-item", y = /* @__PURE__ */ Lr(f), m = K.forwardRef(
    (w, d) => {
      const { scope: v, children: p, ...b } = w, C = K.useRef(null), x = gt(d, C), S = i(f, v);
      return K.useEffect(() => (S.itemMap.set(C, { ref: C, ...b }), () => void S.itemMap.delete(C))), /* @__PURE__ */ R(y, { [u]: "", ref: x, children: p });
    }
  );
  m.displayName = f;
  function g(w) {
    const d = i(e + "CollectionConsumer", w);
    return K.useCallback(() => {
      const p = d.collectionRef.current;
      if (!p) return [];
      const b = Array.from(p.querySelectorAll(`[${u}]`));
      return Array.from(d.itemMap.values()).sort(
        (S, E) => b.indexOf(S.ref.current) - b.indexOf(E.ref.current)
      );
    }, [d.collectionRef, d.itemMap]);
  }
  return [
    { Provider: a, Slot: c, ItemSlot: m },
    g,
    r
  ];
}
var X1 = h.createContext(void 0);
function uv(e) {
  const t = h.useContext(X1);
  return e || t || "ltr";
}
var Va = "rovingFocusGroup.onEntryFocus", Z1 = { bubbles: !1, cancelable: !0 }, Ho = "RovingFocusGroup", [ms, lv, Q1] = sv(Ho), [J1, cv] = er(
  Ho,
  [Q1]
), [ew, tw] = J1(Ho), dv = h.forwardRef(
  (e, t) => /* @__PURE__ */ R(ms.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ R(ms.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ R(nw, { ...e, ref: t }) }) })
);
dv.displayName = Ho;
var nw = h.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: o = !1,
    dir: i,
    currentTabStopId: a,
    defaultCurrentTabStopId: s,
    onCurrentTabStopIdChange: l,
    onEntryFocus: c,
    preventScrollOnEntryFocus: f = !1,
    ...u
  } = e, y = h.useRef(null), m = gt(t, y), g = uv(i), [w, d] = jr({
    prop: a,
    defaultProp: s != null ? s : null,
    onChange: l,
    caller: Ho
  }), [v, p] = h.useState(!1), b = bn(c), C = lv(n), x = h.useRef(!1), [S, E] = h.useState(0);
  return h.useEffect(() => {
    const M = y.current;
    if (M)
      return M.addEventListener(Va, b), () => M.removeEventListener(Va, b);
  }, [b]), /* @__PURE__ */ R(
    ew,
    {
      scope: n,
      orientation: r,
      dir: g,
      loop: o,
      currentTabStopId: w,
      onItemFocus: h.useCallback(
        (M) => d(M),
        [d]
      ),
      onItemShiftTab: h.useCallback(() => p(!0), []),
      onFocusableItemAdd: h.useCallback(
        () => E((M) => M + 1),
        []
      ),
      onFocusableItemRemove: h.useCallback(
        () => E((M) => M - 1),
        []
      ),
      children: /* @__PURE__ */ R(
        at.div,
        {
          tabIndex: v || S === 0 ? -1 : 0,
          "data-orientation": r,
          ...u,
          ref: m,
          style: { outline: "none", ...e.style },
          onMouseDown: Ce(e.onMouseDown, () => {
            x.current = !0;
          }),
          onFocus: Ce(e.onFocus, (M) => {
            const _ = !x.current;
            if (M.target === M.currentTarget && _ && !v) {
              const P = new CustomEvent(Va, Z1);
              if (M.currentTarget.dispatchEvent(P), !P.defaultPrevented) {
                const k = C().filter((N) => N.focusable), I = k.find((N) => N.active), H = k.find((N) => N.id === w), L = [I, H, ...k].filter(
                  Boolean
                ).map((N) => N.ref.current);
                pv(L, f);
              }
            }
            x.current = !1;
          }),
          onBlur: Ce(e.onBlur, () => p(!1))
        }
      )
    }
  );
}), fv = "RovingFocusGroupItem", vv = h.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: o = !1,
      tabStopId: i,
      children: a,
      ...s
    } = e, l = Nn(), c = i || l, f = tw(fv, n), u = f.currentTabStopId === c, y = lv(n), { onFocusableItemAdd: m, onFocusableItemRemove: g, currentTabStopId: w } = f;
    return h.useEffect(() => {
      if (r)
        return m(), () => g();
    }, [r, m, g]), /* @__PURE__ */ R(
      ms.ItemSlot,
      {
        scope: n,
        id: c,
        focusable: r,
        active: o,
        children: /* @__PURE__ */ R(
          at.span,
          {
            tabIndex: u ? 0 : -1,
            "data-orientation": f.orientation,
            ...s,
            ref: t,
            onMouseDown: Ce(e.onMouseDown, (d) => {
              r ? f.onItemFocus(c) : d.preventDefault();
            }),
            onFocus: Ce(e.onFocus, () => f.onItemFocus(c)),
            onKeyDown: Ce(e.onKeyDown, (d) => {
              if (d.key === "Tab" && d.shiftKey) {
                f.onItemShiftTab();
                return;
              }
              if (d.target !== d.currentTarget) return;
              const v = iw(d, f.orientation, f.dir);
              if (v !== void 0) {
                if (d.metaKey || d.ctrlKey || d.altKey || d.shiftKey) return;
                d.preventDefault();
                let b = y().filter((C) => C.focusable).map((C) => C.ref.current);
                if (v === "last") b.reverse();
                else if (v === "prev" || v === "next") {
                  v === "prev" && b.reverse();
                  const C = b.indexOf(d.currentTarget);
                  b = f.loop ? aw(b, C + 1) : b.slice(C + 1);
                }
                setTimeout(() => pv(b));
              }
            }),
            children: typeof a == "function" ? a({ isCurrentTabStop: u, hasTabStop: w != null }) : a
          }
        )
      }
    );
  }
);
vv.displayName = fv;
var rw = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ow(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function iw(e, t, n) {
  const r = ow(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return rw[r];
}
function pv(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function aw(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var sw = dv, uw = vv, gs = ["Enter", " "], lw = ["ArrowDown", "PageUp", "Home"], hv = ["ArrowUp", "PageDown", "End"], cw = [...lw, ...hv], dw = {
  ltr: [...gs, "ArrowRight"],
  rtl: [...gs, "ArrowLeft"]
}, fw = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Wo = "Menu", [Po, vw, pw] = sv(Wo), [gr, mv] = er(Wo, [
  pw,
  Ur,
  cv
]), Bo = Ur(), gv = cv(), [yv, rr] = gr(Wo), [hw, jo] = gr(Wo), bv = (e) => {
  const { __scopeMenu: t, open: n = !1, children: r, dir: o, onOpenChange: i, modal: a = !0 } = e, s = Bo(t), [l, c] = h.useState(null), f = h.useRef(!1), u = bn(i), y = uv(o);
  return h.useEffect(() => {
    const m = () => {
      f.current = !0, document.addEventListener("pointerdown", g, { capture: !0, once: !0 }), document.addEventListener("pointermove", g, { capture: !0, once: !0 });
    }, g = () => f.current = !1;
    return document.addEventListener("keydown", m, { capture: !0 }), () => {
      document.removeEventListener("keydown", m, { capture: !0 }), document.removeEventListener("pointerdown", g, { capture: !0 }), document.removeEventListener("pointermove", g, { capture: !0 });
    };
  }, []), /* @__PURE__ */ R(Qi, { ...s, children: /* @__PURE__ */ R(
    yv,
    {
      scope: t,
      open: n,
      onOpenChange: u,
      content: l,
      onContentChange: c,
      children: /* @__PURE__ */ R(
        hw,
        {
          scope: t,
          onClose: h.useCallback(() => u(!1), [u]),
          isUsingKeyboardRef: f,
          dir: y,
          modal: a,
          children: r
        }
      )
    }
  ) });
};
bv.displayName = Wo;
var mw = "MenuAnchor", lu = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = Bo(n);
    return /* @__PURE__ */ R(Ji, { ...o, ...r, ref: t });
  }
);
lu.displayName = mw;
var cu = "MenuPortal", [gw, wv] = gr(cu, {
  forceMount: void 0
}), xv = (e) => {
  const { __scopeMenu: t, forceMount: n, children: r, container: o } = e, i = rr(cu, t);
  return /* @__PURE__ */ R(gw, { scope: t, forceMount: n, children: /* @__PURE__ */ R(Yt, { present: n || i.open, children: /* @__PURE__ */ R(To, { asChild: !0, container: o, children: r }) }) });
};
xv.displayName = cu;
var Kt = "MenuContent", [yw, du] = gr(Kt), Cv = h.forwardRef(
  (e, t) => {
    const n = wv(Kt, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, i = rr(Kt, e.__scopeMenu), a = jo(Kt, e.__scopeMenu);
    return /* @__PURE__ */ R(Po.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ R(Yt, { present: r || i.open, children: /* @__PURE__ */ R(Po.Slot, { scope: e.__scopeMenu, children: a.modal ? /* @__PURE__ */ R(bw, { ...o, ref: t }) : /* @__PURE__ */ R(ww, { ...o, ref: t }) }) }) });
  }
), bw = h.forwardRef(
  (e, t) => {
    const n = rr(Kt, e.__scopeMenu), r = h.useRef(null), o = gt(t, r);
    return h.useEffect(() => {
      const i = r.current;
      if (i) return $s(i);
    }, []), /* @__PURE__ */ R(
      fu,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: Ce(
          e.onFocusOutside,
          (i) => i.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), ww = h.forwardRef((e, t) => {
  const n = rr(Kt, e.__scopeMenu);
  return /* @__PURE__ */ R(
    fu,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), xw = /* @__PURE__ */ Lr("MenuContent.ScrollLock"), fu = h.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: r = !1,
      trapFocus: o,
      onOpenAutoFocus: i,
      onCloseAutoFocus: a,
      disableOutsidePointerEvents: s,
      onEntryFocus: l,
      onEscapeKeyDown: c,
      onPointerDownOutside: f,
      onFocusOutside: u,
      onInteractOutside: y,
      onDismiss: m,
      disableOutsideScroll: g,
      ...w
    } = e, d = rr(Kt, n), v = jo(Kt, n), p = Bo(n), b = gv(n), C = vw(n), [x, S] = h.useState(null), E = h.useRef(null), M = gt(t, E, d.onContentChange), _ = h.useRef(0), P = h.useRef(""), k = h.useRef(0), I = h.useRef(null), H = h.useRef("right"), A = h.useRef(0), L = g ? Ui : h.Fragment, N = g ? { as: xw, allowPinchZoom: !0 } : void 0, $ = (z) => {
      var ge, j;
      const B = P.current + z, W = C().filter((q) => !q.disabled), Y = document.activeElement, U = (ge = W.find((q) => q.ref.current === Y)) == null ? void 0 : ge.textValue, V = W.map((q) => q.textValue), Z = Tw(V, B, U), se = (j = W.find((q) => q.textValue === Z)) == null ? void 0 : j.ref.current;
      (function q(J) {
        P.current = J, window.clearTimeout(_.current), J !== "" && (_.current = window.setTimeout(() => q(""), 1e3));
      })(B), se && setTimeout(() => se.focus());
    };
    h.useEffect(() => () => window.clearTimeout(_.current), []), Ls();
    const T = h.useCallback((z) => {
      var W, Y;
      return H.current === ((W = I.current) == null ? void 0 : W.side) && Aw(z, (Y = I.current) == null ? void 0 : Y.area);
    }, []);
    return /* @__PURE__ */ R(
      yw,
      {
        scope: n,
        searchRef: P,
        onItemEnter: h.useCallback(
          (z) => {
            T(z) && z.preventDefault();
          },
          [T]
        ),
        onItemLeave: h.useCallback(
          (z) => {
            var B;
            T(z) || ((B = E.current) == null || B.focus(), S(null));
          },
          [T]
        ),
        onTriggerLeave: h.useCallback(
          (z) => {
            T(z) && z.preventDefault();
          },
          [T]
        ),
        pointerGraceTimerRef: k,
        onPointerGraceIntentChange: h.useCallback((z) => {
          I.current = z;
        }, []),
        children: /* @__PURE__ */ R(L, { ...N, children: /* @__PURE__ */ R(
          Vi,
          {
            asChild: !0,
            trapped: o,
            onMountAutoFocus: Ce(i, (z) => {
              var B;
              z.preventDefault(), (B = E.current) == null || B.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: a,
            children: /* @__PURE__ */ R(
              ko,
              {
                asChild: !0,
                disableOutsidePointerEvents: s,
                onEscapeKeyDown: c,
                onPointerDownOutside: f,
                onFocusOutside: u,
                onInteractOutside: y,
                onDismiss: m,
                children: /* @__PURE__ */ R(
                  sw,
                  {
                    asChild: !0,
                    ...b,
                    dir: v.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: x,
                    onCurrentTabStopIdChange: S,
                    onEntryFocus: Ce(l, (z) => {
                      v.isUsingKeyboardRef.current || z.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ R(
                      Xs,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Fv(d.open),
                        "data-radix-menu-content": "",
                        dir: v.dir,
                        ...p,
                        ...w,
                        ref: M,
                        style: { outline: "none", ...w.style },
                        onKeyDown: Ce(w.onKeyDown, (z) => {
                          const W = z.target.closest("[data-radix-menu-content]") === z.currentTarget, Y = z.ctrlKey || z.altKey || z.metaKey, U = z.key.length === 1;
                          W && (z.key === "Tab" && z.preventDefault(), !Y && U && $(z.key));
                          const V = E.current;
                          if (z.target !== V || !cw.includes(z.key)) return;
                          z.preventDefault();
                          const se = C().filter((ge) => !ge.disabled).map((ge) => ge.ref.current);
                          hv.includes(z.key) && se.reverse(), Ow(se);
                        }),
                        onBlur: Ce(e.onBlur, (z) => {
                          z.currentTarget.contains(z.target) || (window.clearTimeout(_.current), P.current = "");
                        }),
                        onPointerMove: Ce(
                          e.onPointerMove,
                          No((z) => {
                            const B = z.target, W = A.current !== z.clientX;
                            if (z.currentTarget.contains(B) && W) {
                              const Y = z.clientX > A.current ? "right" : "left";
                              H.current = Y, A.current = z.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Cv.displayName = Kt;
var Cw = "MenuGroup", vu = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ R(at.div, { role: "group", ...r, ref: t });
  }
);
vu.displayName = Cw;
var Sw = "MenuLabel", Sv = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ R(at.div, { ...r, ref: t });
  }
);
Sv.displayName = Sw;
var Ii = "MenuItem", ac = "menu.itemSelect", la = h.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: r, ...o } = e, i = h.useRef(null), a = jo(Ii, e.__scopeMenu), s = du(Ii, e.__scopeMenu), l = gt(t, i), c = h.useRef(!1), f = () => {
      const u = i.current;
      if (!n && u) {
        const y = new CustomEvent(ac, { bubbles: !0, cancelable: !0 });
        u.addEventListener(ac, (m) => r == null ? void 0 : r(m), { once: !0 }), Qc(u, y), y.defaultPrevented ? c.current = !1 : a.onClose();
      }
    };
    return /* @__PURE__ */ R(
      Ev,
      {
        ...o,
        ref: l,
        disabled: n,
        onClick: Ce(e.onClick, f),
        onPointerDown: (u) => {
          var y;
          (y = e.onPointerDown) == null || y.call(e, u), c.current = !0;
        },
        onPointerUp: Ce(e.onPointerUp, (u) => {
          var y;
          c.current || (y = u.currentTarget) == null || y.click();
        }),
        onKeyDown: Ce(e.onKeyDown, (u) => {
          const y = s.searchRef.current !== "";
          n || y && u.key === " " || gs.includes(u.key) && (u.currentTarget.click(), u.preventDefault());
        })
      }
    );
  }
);
la.displayName = Ii;
var Ev = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: r = !1, textValue: o, ...i } = e, a = du(Ii, n), s = gv(n), l = h.useRef(null), c = gt(t, l), [f, u] = h.useState(!1), [y, m] = h.useState("");
    return h.useEffect(() => {
      var w;
      const g = l.current;
      g && m(((w = g.textContent) != null ? w : "").trim());
    }, [i.children]), /* @__PURE__ */ R(
      Po.ItemSlot,
      {
        scope: n,
        disabled: r,
        textValue: o != null ? o : y,
        children: /* @__PURE__ */ R(uw, { asChild: !0, ...s, focusable: !r, children: /* @__PURE__ */ R(
          at.div,
          {
            role: "menuitem",
            "data-highlighted": f ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...i,
            ref: c,
            onPointerMove: Ce(
              e.onPointerMove,
              No((g) => {
                r ? a.onItemLeave(g) : (a.onItemEnter(g), g.defaultPrevented || g.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: Ce(
              e.onPointerLeave,
              No((g) => a.onItemLeave(g))
            ),
            onFocus: Ce(e.onFocus, () => u(!0)),
            onBlur: Ce(e.onBlur, () => u(!1))
          }
        ) })
      }
    );
  }
), Ew = "MenuCheckboxItem", Rv = h.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...o } = e;
    return /* @__PURE__ */ R(_v, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ R(
      la,
      {
        role: "menuitemcheckbox",
        "aria-checked": Ai(n) ? "mixed" : n,
        ...o,
        ref: t,
        "data-state": mu(n),
        onSelect: Ce(
          o.onSelect,
          () => r == null ? void 0 : r(Ai(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Rv.displayName = Ew;
var Mv = "MenuRadioGroup", [Rw, Mw] = gr(
  Mv,
  { value: void 0, onValueChange: () => {
  } }
), Pv = h.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: r, ...o } = e, i = bn(r);
    return /* @__PURE__ */ R(Rw, { scope: e.__scopeMenu, value: n, onValueChange: i, children: /* @__PURE__ */ R(vu, { ...o, ref: t }) });
  }
);
Pv.displayName = Mv;
var Nv = "MenuRadioItem", Dv = h.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, o = Mw(Nv, e.__scopeMenu), i = n === o.value;
    return /* @__PURE__ */ R(_v, { scope: e.__scopeMenu, checked: i, children: /* @__PURE__ */ R(
      la,
      {
        role: "menuitemradio",
        "aria-checked": i,
        ...r,
        ref: t,
        "data-state": mu(i),
        onSelect: Ce(
          r.onSelect,
          () => {
            var a;
            return (a = o.onValueChange) == null ? void 0 : a.call(o, n);
          },
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Dv.displayName = Nv;
var pu = "MenuItemIndicator", [_v, Pw] = gr(
  pu,
  { checked: !1 }
), Ov = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: r, ...o } = e, i = Pw(pu, n);
    return /* @__PURE__ */ R(
      Yt,
      {
        present: r || Ai(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ R(
          at.span,
          {
            ...o,
            ref: t,
            "data-state": mu(i.checked)
          }
        )
      }
    );
  }
);
Ov.displayName = pu;
var Nw = "MenuSeparator", kv = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ R(
      at.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
      }
    );
  }
);
kv.displayName = Nw;
var Dw = "MenuArrow", Tv = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = Bo(n);
    return /* @__PURE__ */ R(Zs, { ...o, ...r, ref: t });
  }
);
Tv.displayName = Dw;
var hu = "MenuSub", [_w, Iv] = gr(hu), Av = (e) => {
  const { __scopeMenu: t, children: n, open: r = !1, onOpenChange: o } = e, i = rr(hu, t), a = Bo(t), [s, l] = h.useState(null), [c, f] = h.useState(null), u = bn(o);
  return h.useEffect(() => (i.open === !1 && u(!1), () => u(!1)), [i.open, u]), /* @__PURE__ */ R(Qi, { ...a, children: /* @__PURE__ */ R(
    yv,
    {
      scope: t,
      open: r,
      onOpenChange: u,
      content: c,
      onContentChange: f,
      children: /* @__PURE__ */ R(
        _w,
        {
          scope: t,
          contentId: Nn(),
          triggerId: Nn(),
          trigger: s,
          onTriggerChange: l,
          children: n
        }
      )
    }
  ) });
};
Av.displayName = hu;
var mo = "MenuSubTrigger", Lv = h.forwardRef(
  (e, t) => {
    const n = rr(mo, e.__scopeMenu), r = jo(mo, e.__scopeMenu), o = Iv(mo, e.__scopeMenu), i = du(mo, e.__scopeMenu), a = h.useRef(null), { pointerGraceTimerRef: s, onPointerGraceIntentChange: l } = i, c = { __scopeMenu: e.__scopeMenu }, f = h.useCallback(() => {
      a.current && window.clearTimeout(a.current), a.current = null;
    }, []);
    return h.useEffect(() => f, [f]), h.useEffect(() => {
      const u = s.current;
      return () => {
        window.clearTimeout(u), l(null);
      };
    }, [s, l]), /* @__PURE__ */ R(lu, { asChild: !0, ...c, children: /* @__PURE__ */ R(
      Ev,
      {
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": o.contentId,
        "data-state": Fv(n.open),
        ...e,
        ref: Oo(t, o.onTriggerChange),
        onClick: (u) => {
          var y;
          (y = e.onClick) == null || y.call(e, u), !(e.disabled || u.defaultPrevented) && (u.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: Ce(
          e.onPointerMove,
          No((u) => {
            i.onItemEnter(u), !u.defaultPrevented && !e.disabled && !n.open && !a.current && (i.onPointerGraceIntentChange(null), a.current = window.setTimeout(() => {
              n.onOpenChange(!0), f();
            }, 100));
          })
        ),
        onPointerLeave: Ce(
          e.onPointerLeave,
          No((u) => {
            var m, g;
            f();
            const y = (m = n.content) == null ? void 0 : m.getBoundingClientRect();
            if (y) {
              const w = (g = n.content) == null ? void 0 : g.dataset.side, d = w === "right", v = d ? -5 : 5, p = y[d ? "left" : "right"], b = y[d ? "right" : "left"];
              i.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: u.clientX + v, y: u.clientY },
                  { x: p, y: y.top },
                  { x: b, y: y.top },
                  { x: b, y: y.bottom },
                  { x: p, y: y.bottom }
                ],
                side: w
              }), window.clearTimeout(s.current), s.current = window.setTimeout(
                () => i.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (i.onTriggerLeave(u), u.defaultPrevented) return;
              i.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: Ce(e.onKeyDown, (u) => {
          var m;
          const y = i.searchRef.current !== "";
          e.disabled || y && u.key === " " || dw[r.dir].includes(u.key) && (n.onOpenChange(!0), (m = n.content) == null || m.focus(), u.preventDefault());
        })
      }
    ) });
  }
);
Lv.displayName = mo;
var $v = "MenuSubContent", zv = h.forwardRef(
  (e, t) => {
    const n = wv(Kt, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, i = rr(Kt, e.__scopeMenu), a = jo(Kt, e.__scopeMenu), s = Iv($v, e.__scopeMenu), l = h.useRef(null), c = gt(t, l);
    return /* @__PURE__ */ R(Po.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ R(Yt, { present: r || i.open, children: /* @__PURE__ */ R(Po.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ R(
      fu,
      {
        id: s.contentId,
        "aria-labelledby": s.triggerId,
        ...o,
        ref: c,
        align: "start",
        side: a.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (f) => {
          var u;
          a.isUsingKeyboardRef.current && ((u = l.current) == null || u.focus()), f.preventDefault();
        },
        onCloseAutoFocus: (f) => f.preventDefault(),
        onFocusOutside: Ce(e.onFocusOutside, (f) => {
          f.target !== s.trigger && i.onOpenChange(!1);
        }),
        onEscapeKeyDown: Ce(e.onEscapeKeyDown, (f) => {
          a.onClose(), f.preventDefault();
        }),
        onKeyDown: Ce(e.onKeyDown, (f) => {
          var m;
          const u = f.currentTarget.contains(f.target), y = fw[a.dir].includes(f.key);
          u && y && (i.onOpenChange(!1), (m = s.trigger) == null || m.focus(), f.preventDefault());
        })
      }
    ) }) }) });
  }
);
zv.displayName = $v;
function Fv(e) {
  return e ? "open" : "closed";
}
function Ai(e) {
  return e === "indeterminate";
}
function mu(e) {
  return Ai(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Ow(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function kw(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
function Tw(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((c) => c === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1;
  let a = kw(e, Math.max(i, 0));
  o.length === 1 && (a = a.filter((c) => c !== n));
  const l = a.find(
    (c) => c.toLowerCase().startsWith(o.toLowerCase())
  );
  return l !== n ? l : void 0;
}
function Iw(e, t) {
  const { x: n, y: r } = e;
  let o = !1;
  for (let i = 0, a = t.length - 1; i < t.length; a = i++) {
    const s = t[i], l = t[a], c = s.x, f = s.y, u = l.x, y = l.y;
    f > r != y > r && n < (u - c) * (r - f) / (y - f) + c && (o = !o);
  }
  return o;
}
function Aw(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Iw(n, t);
}
function No(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var Lw = bv, $w = lu, zw = xv, Fw = Cv, Hw = vu, Ww = Sv, Bw = la, jw = Rv, Vw = Pv, qw = Dv, Uw = Ov, Gw = kv, Kw = Tv, Yw = Av, Xw = Lv, Zw = zv, ca = "DropdownMenu", [Qw] = er(
  ca,
  [mv]
), Dt = mv(), [Jw, Hv] = Qw(ca), Wv = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: r,
    open: o,
    defaultOpen: i,
    onOpenChange: a,
    modal: s = !0
  } = e, l = Dt(t), c = h.useRef(null), [f, u] = jr({
    prop: o,
    defaultProp: i != null ? i : !1,
    onChange: a,
    caller: ca
  });
  return /* @__PURE__ */ R(
    Jw,
    {
      scope: t,
      triggerId: Nn(),
      triggerRef: c,
      contentId: Nn(),
      open: f,
      onOpenChange: u,
      onOpenToggle: h.useCallback(() => u((y) => !y), [u]),
      modal: s,
      children: /* @__PURE__ */ R(Lw, { ...l, open: f, onOpenChange: u, dir: r, modal: s, children: n })
    }
  );
};
Wv.displayName = ca;
var Bv = "DropdownMenuTrigger", jv = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...o } = e, i = Hv(Bv, n), a = Dt(n);
    return /* @__PURE__ */ R($w, { asChild: !0, ...a, children: /* @__PURE__ */ R(
      at.button,
      {
        type: "button",
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": i.open,
        "aria-controls": i.open ? i.contentId : void 0,
        "data-state": i.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...o,
        ref: Oo(t, i.triggerRef),
        onPointerDown: Ce(e.onPointerDown, (s) => {
          !r && s.button === 0 && s.ctrlKey === !1 && (i.onOpenToggle(), i.open || s.preventDefault());
        }),
        onKeyDown: Ce(e.onKeyDown, (s) => {
          r || (["Enter", " "].includes(s.key) && i.onOpenToggle(), s.key === "ArrowDown" && i.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(s.key) && s.preventDefault());
        })
      }
    ) });
  }
);
jv.displayName = Bv;
var ex = "DropdownMenuPortal", Vv = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, r = Dt(t);
  return /* @__PURE__ */ R(zw, { ...r, ...n });
};
Vv.displayName = ex;
var qv = "DropdownMenuContent", Uv = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Hv(qv, n), i = Dt(n), a = h.useRef(!1);
    return /* @__PURE__ */ R(
      Fw,
      {
        id: o.contentId,
        "aria-labelledby": o.triggerId,
        ...i,
        ...r,
        ref: t,
        onCloseAutoFocus: Ce(e.onCloseAutoFocus, (s) => {
          var l;
          a.current || (l = o.triggerRef.current) == null || l.focus(), a.current = !1, s.preventDefault();
        }),
        onInteractOutside: Ce(e.onInteractOutside, (s) => {
          const l = s.detail.originalEvent, c = l.button === 0 && l.ctrlKey === !0, f = l.button === 2 || c;
          (!o.modal || f) && (a.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
Uv.displayName = qv;
var tx = "DropdownMenuGroup", nx = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
    return /* @__PURE__ */ R(Hw, { ...o, ...r, ref: t });
  }
);
nx.displayName = tx;
var rx = "DropdownMenuLabel", ox = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
    return /* @__PURE__ */ R(Ww, { ...o, ...r, ref: t });
  }
);
ox.displayName = rx;
var ix = "DropdownMenuItem", Gv = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
    return /* @__PURE__ */ R(Bw, { ...o, ...r, ref: t });
  }
);
Gv.displayName = ix;
var ax = "DropdownMenuCheckboxItem", Kv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(jw, { ...o, ...r, ref: t });
});
Kv.displayName = ax;
var sx = "DropdownMenuRadioGroup", Yv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(Vw, { ...o, ...r, ref: t });
});
Yv.displayName = sx;
var ux = "DropdownMenuRadioItem", Xv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(qw, { ...o, ...r, ref: t });
});
Xv.displayName = ux;
var lx = "DropdownMenuItemIndicator", Zv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(Uw, { ...o, ...r, ref: t });
});
Zv.displayName = lx;
var cx = "DropdownMenuSeparator", Qv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(Gw, { ...o, ...r, ref: t });
});
Qv.displayName = cx;
var dx = "DropdownMenuArrow", fx = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
    return /* @__PURE__ */ R(Kw, { ...o, ...r, ref: t });
  }
);
fx.displayName = dx;
var vx = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: o, defaultOpen: i } = e, a = Dt(t), [s, l] = jr({
    prop: r,
    defaultProp: i != null ? i : !1,
    onChange: o,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ R(Yw, { ...a, open: s, onOpenChange: l, children: n });
}, px = "DropdownMenuSubTrigger", Jv = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(Xw, { ...o, ...r, ref: t });
});
Jv.displayName = px;
var hx = "DropdownMenuSubContent", ep = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = Dt(n);
  return /* @__PURE__ */ R(
    Zw,
    {
      ...o,
      ...r,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
ep.displayName = hx;
var mx = Wv, gx = jv, tp = Vv, yx = Uv, bx = Gv, wx = Kv, xx = Yv, Cx = Xv, np = Zv, Sx = Qv, Ex = vx, Rx = Jv, Mx = ep;
function Px({
  ...e
}) {
  return /* @__PURE__ */ R(mx, { "data-slot": "dropdown-menu", ...e });
}
function Nx({
  ...e
}) {
  return /* @__PURE__ */ R(tp, { "data-slot": "dropdown-menu-portal", ...e });
}
function Dx({
  ...e
}) {
  return /* @__PURE__ */ R(
    gx,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function _x({
  ...e
}) {
  return /* @__PURE__ */ R(Ex, { "data-slot": "dropdown-menu-sub", ...e });
}
function Ox({
  ...e
}) {
  return /* @__PURE__ */ R(
    xx,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function kx({
  className: e,
  inset: t,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ me(
    Rx,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: ie(
        `
                  univer-flex univer-cursor-default univer-select-none univer-items-center univer-justify-between
                  univer-gap-2 univer-rounded univer-px-2 univer-py-1.5 univer-text-sm univer-outline-none
                  data-[state=open]:univer-bg-gray-100
                  focus:univer-bg-gray-100
                  dark:data-[state=open]:!univer-bg-gray-600 dark:focus:!univer-bg-gray-600
                  [&_svg]:univer-pointer-events-none [&_svg]:univer-size-4 [&_svg]:univer-shrink-0
                `,
        e
      ),
      ...r,
      children: [
        n,
        /* @__PURE__ */ R(wo, { className: "ml-auto" })
      ]
    }
  );
}
function Tx({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ R(
    Mx,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: ie(
        `
                  data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0
                  data-[state=open]:univer-zoom-in-95
                  data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
                  data-[state=closed]:univer-zoom-out-95
                  data-[side=bottom]:univer-slide-in-from-top-2
                  data-[side=left]:univer-slide-in-from-right-2
                  data-[side=right]:univer-slide-in-from-left-2
                  data-[side=top]:univer-slide-in-from-bottom-2
                  univer-z-[1080] univer-box-border univer-max-h-[var(--radix-popper-available-height)]
                  univer-overflow-y-auto univer-rounded-md univer-bg-white univer-p-1.5 univer-text-gray-900
                  univer-shadow-md
                  dark:!univer-bg-gray-700 dark:!univer-text-white
                `,
        kt,
        vr,
        e
      ),
      ...t
    }
  );
}
function Ix({
  className: e,
  sideOffset: t = 4,
  ...n
}) {
  return /* @__PURE__ */ R(tp, { children: /* @__PURE__ */ R(
    yx,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: ie(
        `
                      data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0
                      data-[state=open]:univer-zoom-in-95
                      data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
                      data-[state=closed]:univer-zoom-out-95
                      data-[side=bottom]:univer-slide-in-from-top-2
                      data-[side=left]:univer-slide-in-from-right-2
                      data-[side=right]:univer-slide-in-from-left-2
                      data-[side=top]:univer-slide-in-from-bottom-2
                      univer-z-[1080] univer-box-border univer-max-h-[var(--radix-popper-available-height)]
                      univer-overflow-y-auto univer-rounded-md univer-bg-white univer-p-1.5 univer-text-gray-900
                      univer-shadow-md
                      dark:!univer-bg-gray-700 dark:!univer-text-white
                    `,
        kt,
        vr,
        e
      ),
      ...n
    }
  ) });
}
function Ax({
  className: e,
  inset: t,
  variant: n = "default",
  ...r
}) {
  return /* @__PURE__ */ R(
    bx,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": n,
      className: ie(
        `
                  univer-relative univer-flex univer-cursor-default univer-select-none univer-items-center univer-gap-2
                  univer-rounded univer-px-2 univer-py-1.5 univer-text-sm univer-outline-none univer-transition-colors
                  data-[disabled]:univer-pointer-events-none data-[disabled]:univer-opacity-50
                  focus:univer-bg-gray-100
                  dark:focus:!univer-bg-gray-600
                  [&>svg]:univer-size-4 [&>svg]:univer-shrink-0
                `,
        e
      ),
      ...r
    }
  );
}
function Lx({
  className: e,
  children: t,
  hideIndicator: n,
  checked: r,
  ...o
}) {
  return /* @__PURE__ */ me(
    wx,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: ie(
        `
                  univer-relative univer-flex univer-cursor-default univer-select-none univer-items-center
                  univer-rounded univer-py-1.5 univer-pr-2 univer-text-sm univer-outline-none univer-transition-colors
                  data-[disabled]:univer-pointer-events-none data-[disabled]:univer-opacity-50
                  focus:univer-bg-gray-100
                  dark:focus:!univer-bg-gray-600
                `,
        {
          "univer-pl-8": !n,
          "univer-pl-2": n
        },
        e
      ),
      checked: r,
      ...o,
      children: [
        !n && /* @__PURE__ */ R(
          "span",
          {
            className: "univer-absolute univer-left-2 univer-flex univer-h-3.5 univer-w-3.5 univer-items-center univer-justify-center",
            children: /* @__PURE__ */ R(np, { children: /* @__PURE__ */ R(
              Hr,
              {
                className: "univer-block univer-size-4 univer-fill-current univer-text-primary-600"
              }
            ) })
          }
        ),
        t
      ]
    }
  );
}
function $x({
  className: e,
  children: t,
  hideIndicator: n,
  ...r
}) {
  return /* @__PURE__ */ me(
    Cx,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: ie(
        `
                  univer-relative univer-flex univer-cursor-default univer-select-none univer-items-center
                  univer-rounded univer-py-1.5 univer-pr-2 univer-text-sm univer-outline-none univer-transition-colors
                  data-[disabled]:univer-pointer-events-none data-[disabled]:univer-opacity-50
                  focus:univer-bg-gray-100
                  dark:focus:!univer-bg-gray-600
                `,
        {
          "univer-pl-8": !n,
          "univer-pl-2": n
        },
        e
      ),
      ...r,
      children: [
        !n && /* @__PURE__ */ R(
          "span",
          {
            className: "univer-absolute univer-left-2 univer-flex univer-h-3.5 univer-w-3.5 univer-items-center univer-justify-center",
            children: /* @__PURE__ */ R(np, { children: /* @__PURE__ */ R(
              Hr,
              {
                className: "univer-block univer-size-4 univer-fill-current univer-text-primary-600"
              }
            ) })
          }
        ),
        t
      ]
    }
  );
}
function sc({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ R(
    Sx,
    {
      className: ie("-univer-mx-1 univer-my-1 univer-h-px univer-bg-gray-200 dark:!univer-bg-gray-600", e),
      ...t
    }
  );
}
function rp(e) {
  const {
    children: t,
    items: n,
    disabled: r,
    open: o,
    onOpenChange: i,
    ...a
  } = e, [s, l] = De(!1), c = o !== void 0, f = c ? o : s;
  function u(m) {
    r || (c || l(m), i == null || i(m));
  }
  function y(m, g) {
    var v;
    const { className: w, type: d } = m;
    if (d === "separator")
      return /* @__PURE__ */ R(sc, { className: w }, g);
    if (d === "radio")
      return /* @__PURE__ */ R(
        Ox,
        {
          className: w,
          value: m.value,
          onValueChange: m.onSelect,
          children: m.options.map((p, b) => {
            if ("type" in p) {
              if (p.type === "separator")
                return /* @__PURE__ */ R(sc, { className: p.className }, b);
            } else {
              if (p.value === void 0)
                throw new Error("[DropdownMenu]: `value` is required");
              return /* @__PURE__ */ R(
                $x,
                {
                  value: p.value,
                  disabled: p.disabled,
                  hideIndicator: m.hideIndicator,
                  children: p.label
                },
                p.value
              );
            }
            return null;
          })
        },
        g
      );
    if (d === "checkbox")
      return /* @__PURE__ */ R(
        Lx,
        {
          className: w,
          disabled: m.disabled,
          checked: m.checked,
          onSelect: () => {
            var p;
            (p = m.onSelect) == null || p.call(m, m.value);
          },
          children: m.label
        },
        g
      );
    if (d === "item")
      return /* @__PURE__ */ R(
        Ax,
        {
          className: w,
          disabled: m.disabled,
          onSelect: () => {
            var p;
            (p = m.onSelect) == null || p.call(m, m);
          },
          children: m.children
        },
        g
      );
    if (d === "subItem")
      return /* @__PURE__ */ me(_x, { children: [
        /* @__PURE__ */ R(kx, { children: m.children }),
        /* @__PURE__ */ R(Nx, { children: /* @__PURE__ */ R(Tx, { sideOffset: 12, children: (v = m.options) == null ? void 0 : v.map((p, b) => y(p, b)) }) })
      ] }, g);
  }
  return /* @__PURE__ */ me(Px, { modal: !1, open: f, onOpenChange: u, children: [
    /* @__PURE__ */ R(Dx, { asChild: !0, children: t }),
    /* @__PURE__ */ R(
      Ix,
      {
        className: "univer-text-sm",
        collisionPadding: { top: 12, bottom: 12 },
        onWheel: (m) => m.stopPropagation(),
        ...a,
        children: n.map((m, g) => y(m, g))
      }
    )
  ] });
}
const zx = Rc(!1), DE = (e) => {
  const { label: t, desc: n, children: r, style: o, className: i, error: a, contentStyle: s, collapsable: l = !1, defaultCollapsed: c = !1 } = e, [f, u] = De(c);
  return /* @__PURE__ */ R(zx.Provider, { value: !0, children: /* @__PURE__ */ me("div", { "data-u-comp": "form-layout", className: ie("univer-mb-3 univer-flex univer-flex-col", i), style: o, children: [
    t && /* @__PURE__ */ me(
      "div",
      {
        className: ie("univer-mb-2 univer-flex univer-min-h-3.5 univer-items-center univer-text-sm univer-text-gray-900 dark:!univer-text-white", {
          "univer-cursor-pointer": l
        }),
        onClick: () => u(!f),
        children: [
          t,
          l && /* @__PURE__ */ R(
            Ac,
            {
              className: ie("univer-ml-1 univer-transition-transform", {
                "univer-rotate-180": f
              })
            }
          )
        ]
      }
    ),
    f && l ? null : /* @__PURE__ */ me(dr, { children: [
      n && /* @__PURE__ */ R(
        "div",
        {
          className: "univer-mt-1 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200",
          children: n
        }
      ),
      r ? /* @__PURE__ */ me(
        "div",
        {
          className: ie("last:univer-mb-0 [&_[data-u-comp=input]]:univer-w-full [&_[data-u-comp=select]]:univer-w-full", {
            "[&_[data-u-comp=input]]:univer-border-red-500": a,
            "[&_[data-u-comp=select]]:univer-border-red-500": a
          }),
          style: s,
          children: [
            r,
            a ? /* @__PURE__ */ R("div", { className: "univer-mt-1 univer-text-xs univer-text-red-500", children: a }) : null
          ]
        }
      ) : null
    ] })
  ] }) });
}, _E = (e) => /* @__PURE__ */ R(
  "div",
  {
    className: "univer-flex univer-justify-between [&_[data-u-comp=form-layout]]:univer-max-w-[calc(50%-8px)] [&_[data-u-comp=form-layout]]:univer-shrink [&_[data-u-comp=form-layout]]:univer-grow",
    children: e.children
  }
);
function Fx(e) {
  const { className: t, value: n = 0, total: r = 0, loop: o, text: i, onChange: a } = e, s = lt(() => i != null ? i : `${n}/${r}`, [n, r, i]), l = r > 0, c = () => {
    n === 1 ? o && (a == null || a(r)) : a == null || a(n - 1);
  }, f = () => {
    n === r ? o && (a == null || a(1)) : a == null || a(n + 1);
  };
  return /* @__PURE__ */ R(
    "div",
    {
      "data-u-comp": "pager",
      className: ie("univer-flex univer-flex-shrink-0 univer-items-center univer-text-sm univer-text-gray-700 dark:!univer-text-gray-400", t),
      children: l ? /* @__PURE__ */ me(dr, { children: [
        /* @__PURE__ */ R(
          "button",
          {
            "data-u-comp": "pager-left-arrow",
            className: "univer-inline-flex univer-size-4 univer-cursor-pointer univer-items-center univer-rounded univer-border-none univer-bg-transparent univer-p-0 hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-600",
            type: "button",
            role: "button",
            onClick: c,
            children: /* @__PURE__ */ R(Ic, {})
          }
        ),
        /* @__PURE__ */ R("span", { className: "univer-mx-1", children: s }),
        /* @__PURE__ */ R(
          "button",
          {
            "data-u-comp": "pager-right-arrow",
            className: "univer-inline-flex univer-size-4 univer-cursor-pointer univer-items-center univer-rounded univer-border-none univer-bg-transparent univer-p-0 hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-600",
            type: "button",
            role: "button",
            onClick: f,
            children: /* @__PURE__ */ R(wo, {})
          }
        )
      ] }) : /* @__PURE__ */ R("div", { className: "univer-mx-1", children: s })
    }
  );
}
const qa = `
    univer-flex univer-cursor-pointer univer-items-center univer-justify-center univer-border-none
    univer-bg-transparent univer-p-0 univer-text-current
    hover:univer-text-white
`;
function OE(e) {
  const { className: t, images: n, open: r, onOpenChange: o } = e, [i, a] = De(!1), [s, l] = De(0), [c, f] = De(1), u = ye(null), y = lt(() => n[s], [s, n]);
  if (qe(() => {
    r && u.current && u.current.focus();
  }, [r]), qe(() => {
    if (!r) return;
    const g = (w) => {
      w.key === "Escape" && (o == null || o(!1));
    };
    return window.addEventListener("keydown", g), () => window.removeEventListener("keydown", g);
  }, [r, o]), qe(() => {
    if (r)
      a(!0);
    else {
      const g = setTimeout(() => {
        a(!1);
      }, 150);
      return () => clearTimeout(g);
    }
  }, [r]), !r && !i) return null;
  function m(g) {
    if (g === "reset") {
      f(1);
      return;
    }
    const w = c + g;
    w < 0.5 || w > 2 || f(w);
  }
  return _o(
    /* @__PURE__ */ me(
      "div",
      {
        "data-u-comp": "gallery",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Image gallery",
        tabIndex: -1,
        ref: u,
        className: ie(
          `
                  univer-absolute univer-inset-0 univer-z-[1080] univer-flex univer-size-full univer-select-none
                  univer-items-center univer-justify-center
                `,
          {
            "univer-animate-in univer-fade-in": r,
            "univer-animate-out univer-fade-out": !r
          },
          t
        ),
        children: [
          /* @__PURE__ */ R(
            "div",
            {
              className: "univer-absolute univer-inset-0 univer-size-full univer-bg-gray-900 univer-opacity-80",
              "aria-hidden": "true",
              onClick: () => o == null ? void 0 : o(!1)
            }
          ),
          /* @__PURE__ */ R("div", { className: "univer-relative", children: y && /* @__PURE__ */ R(
            "img",
            {
              className: "univer-max-h-[40vh] univer-max-w-[60vw] univer-transition-transform univer-duration-300 univer-ease-out",
              style: {
                transform: `scale(${c})`
              },
              src: y,
              alt: `Image ${s + 1} of ${n.length}`,
              draggable: !1
            }
          ) }),
          /* @__PURE__ */ me(
            "footer",
            {
              className: "univer-absolute univer-bottom-6 univer-left-1/2 univer-flex -univer-translate-x-1/2 univer-items-center univer-gap-3 univer-rounded-full univer-bg-gray-800 univer-px-6 univer-py-3 univer-text-gray-400",
              children: [
                /* @__PURE__ */ R(
                  Fx,
                  {
                    className: "!univer-text-gray-400 [&_[data-u-comp=pager-left-arrow]:hover]:!univer-bg-gray-600 [&_[data-u-comp=pager-right-arrow]:hover]:!univer-bg-gray-600",
                    value: s + 1,
                    total: n.length,
                    onChange: (g) => l(g - 1)
                  }
                ),
                /* @__PURE__ */ R(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Zoom in",
                    className: qa,
                    onClick: () => m(0.25),
                    children: /* @__PURE__ */ R(Fc, { "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ R(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Zoom out",
                    className: qa,
                    onClick: () => m(-0.25),
                    children: /* @__PURE__ */ R(Hc, { "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ R(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Reset zoom",
                    className: qa,
                    onClick: () => m("reset"),
                    children: /* @__PURE__ */ R(Lc, { "aria-hidden": "true" })
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    document.body
  );
}
var Ua, da = "HoverCard", [op] = er(da, [
  Ur
]), fa = Ur(), [Hx, va] = op(da), ip = (e) => {
  const {
    __scopeHoverCard: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: i,
    openDelay: a = 700,
    closeDelay: s = 300
  } = e, l = fa(t), c = h.useRef(0), f = h.useRef(0), u = h.useRef(!1), y = h.useRef(!1), [m, g] = jr({
    prop: r,
    defaultProp: o != null ? o : !1,
    onChange: i,
    caller: da
  }), w = h.useCallback(() => {
    clearTimeout(f.current), c.current = window.setTimeout(() => g(!0), a);
  }, [a, g]), d = h.useCallback(() => {
    clearTimeout(c.current), !u.current && !y.current && (f.current = window.setTimeout(() => g(!1), s));
  }, [s, g]), v = h.useCallback(() => g(!1), [g]);
  return h.useEffect(() => () => {
    clearTimeout(c.current), clearTimeout(f.current);
  }, []), /* @__PURE__ */ R(
    Hx,
    {
      scope: t,
      open: m,
      onOpenChange: g,
      onOpen: w,
      onClose: d,
      onDismiss: v,
      hasSelectionRef: u,
      isPointerDownOnContentRef: y,
      children: /* @__PURE__ */ R(Qi, { ...l, children: n })
    }
  );
};
ip.displayName = da;
var ap = "HoverCardTrigger", sp = h.forwardRef(
  (e, t) => {
    const { __scopeHoverCard: n, ...r } = e, o = va(ap, n), i = fa(n);
    return /* @__PURE__ */ R(Ji, { asChild: !0, ...i, children: /* @__PURE__ */ R(
      at.a,
      {
        "data-state": o.open ? "open" : "closed",
        ...r,
        ref: t,
        onPointerEnter: Ce(e.onPointerEnter, $i(o.onOpen)),
        onPointerLeave: Ce(e.onPointerLeave, $i(o.onClose)),
        onFocus: Ce(e.onFocus, o.onOpen),
        onBlur: Ce(e.onBlur, o.onClose),
        onTouchStart: Ce(e.onTouchStart, (a) => a.preventDefault())
      }
    ) });
  }
);
sp.displayName = ap;
var gu = "HoverCardPortal", [Wx, Bx] = op(gu, {
  forceMount: void 0
}), up = (e) => {
  const { __scopeHoverCard: t, forceMount: n, children: r, container: o } = e, i = va(gu, t);
  return /* @__PURE__ */ R(Wx, { scope: t, forceMount: n, children: /* @__PURE__ */ R(Yt, { present: n || i.open, children: /* @__PURE__ */ R(To, { asChild: !0, container: o, children: r }) }) });
};
up.displayName = gu;
var Li = "HoverCardContent", lp = h.forwardRef(
  (e, t) => {
    const n = Bx(Li, e.__scopeHoverCard), { forceMount: r = n.forceMount, ...o } = e, i = va(Li, e.__scopeHoverCard);
    return /* @__PURE__ */ R(Yt, { present: r || i.open, children: /* @__PURE__ */ R(
      jx,
      {
        "data-state": i.open ? "open" : "closed",
        ...o,
        onPointerEnter: Ce(e.onPointerEnter, $i(i.onOpen)),
        onPointerLeave: Ce(e.onPointerLeave, $i(i.onClose)),
        ref: t
      }
    ) });
  }
);
lp.displayName = Li;
var jx = h.forwardRef((e, t) => {
  const {
    __scopeHoverCard: n,
    onEscapeKeyDown: r,
    onPointerDownOutside: o,
    onFocusOutside: i,
    onInteractOutside: a,
    ...s
  } = e, l = va(Li, n), c = fa(n), f = h.useRef(null), u = gt(t, f), [y, m] = h.useState(!1);
  return h.useEffect(() => {
    if (y) {
      const g = document.body;
      return Ua = g.style.userSelect || g.style.webkitUserSelect, g.style.userSelect = "none", g.style.webkitUserSelect = "none", () => {
        g.style.userSelect = Ua, g.style.webkitUserSelect = Ua;
      };
    }
  }, [y]), h.useEffect(() => {
    if (f.current) {
      const g = () => {
        m(!1), l.isPointerDownOnContentRef.current = !1, setTimeout(() => {
          var d;
          ((d = document.getSelection()) == null ? void 0 : d.toString()) !== "" && (l.hasSelectionRef.current = !0);
        });
      };
      return document.addEventListener("pointerup", g), () => {
        document.removeEventListener("pointerup", g), l.hasSelectionRef.current = !1, l.isPointerDownOnContentRef.current = !1;
      };
    }
  }, [l.isPointerDownOnContentRef, l.hasSelectionRef]), h.useEffect(() => {
    f.current && Ux(f.current).forEach((w) => w.setAttribute("tabindex", "-1"));
  }), /* @__PURE__ */ R(
    ko,
    {
      asChild: !0,
      disableOutsidePointerEvents: !1,
      onInteractOutside: a,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: Ce(i, (g) => {
        g.preventDefault();
      }),
      onDismiss: l.onDismiss,
      children: /* @__PURE__ */ R(
        Xs,
        {
          ...c,
          ...s,
          onPointerDown: Ce(s.onPointerDown, (g) => {
            g.currentTarget.contains(g.target) && m(!0), l.hasSelectionRef.current = !1, l.isPointerDownOnContentRef.current = !0;
          }),
          ref: u,
          style: {
            ...s.style,
            userSelect: y ? "text" : void 0,
            // Safari requires prefix
            WebkitUserSelect: y ? "text" : void 0,
            "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
            "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
            "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      )
    }
  );
}), Vx = "HoverCardArrow", qx = h.forwardRef(
  (e, t) => {
    const { __scopeHoverCard: n, ...r } = e, o = fa(n);
    return /* @__PURE__ */ R(Zs, { ...o, ...r, ref: t });
  }
);
qx.displayName = Vx;
function $i(e) {
  return (t) => t.pointerType === "touch" ? void 0 : e();
}
function Ux(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
var Gx = ip, Kx = sp, Yx = up, cp = lp;
const Xx = Gx, Zx = Yx, Qx = Kx, dp = Ue(({ className: e, align: t = "center", sideOffset: n = 4, ...r }, o) => /* @__PURE__ */ R(
  cp,
  {
    ref: o,
    align: t,
    sideOffset: n,
    className: ie(
      `
              data-[state=open]:univer-animate-in data-[state=open]:univer-fade-in-0 data-[state=open]:univer-zoom-in-95
              data-[state=closed]:univer-animate-out data-[state=closed]:univer-fade-out-0
              data-[state=closed]:univer-zoom-out-95
              data-[side=bottom]:univer-slide-in-from-top-2
              data-[side=left]:univer-slide-in-from-right-2
              data-[side=right]:univer-slide-in-from-left-2
              data-[side=top]:univer-slide-in-from-bottom-2
              univer-z-[1080] univer-w-64 univer-origin-[--radix-hover-card-content-transform-origin] univer-rounded-md
              univer-bg-white univer-text-gray-900 univer-shadow-md univer-outline-none
              dark:!univer-bg-gray-900 dark:!univer-text-white
            `,
      kt,
      e
    ),
    ...r
  }
));
dp.displayName = cp.displayName;
function kE(e) {
  const {
    children: t,
    overlay: n,
    disabled: r,
    openDelay: o = 200,
    open: i,
    onOpenChange: a,
    ...s
  } = e, [l, c] = De(!1), f = i !== void 0, u = f ? i : l;
  function y(m) {
    r || (f || c(m), a == null || a(m));
  }
  return /* @__PURE__ */ me(Xx, { open: u, onOpenChange: y, openDelay: o, children: [
    /* @__PURE__ */ R(Qx, { asChild: !0, children: t }),
    /* @__PURE__ */ R(Zx, { children: /* @__PURE__ */ R(dp, { ...s, children: n }) })
  ] });
}
const Jx = Ts(
  `
      univer-box-border univer-w-full univer-rounded-md univer-bg-white univer-transition-colors univer-duration-200
      placeholder:univer-text-gray-400
      focus:univer-border-primary-600 focus:univer-outline-none focus:univer-ring-2 focus:univer-ring-primary-50
      dark:!univer-bg-gray-700 dark:!univer-text-white dark:focus:!univer-ring-primary-900
    `,
  {
    variants: {
      size: {
        mini: "univer-h-7 univer-px-1.5 univer-text-sm",
        small: "univer-h-8 univer-px-2 univer-text-sm",
        middle: "univer-h-10 univer-px-3 univer-text-base",
        large: "univer-h-12 univer-px-4 univer-text-lg"
      }
    },
    defaultVariants: {
      size: "small"
    }
  }
), eC = Ue(
  ({
    autoFocus: e = !1,
    className: t,
    style: n,
    type: r = "text",
    placeholder: o,
    value: i,
    size: a = "small",
    allowClear: s = !1,
    disabled: l = !1,
    onClick: c,
    onKeyDown: f,
    onChange: u,
    onFocus: y,
    onBlur: m,
    slot: g,
    inputClass: w,
    inputStyle: d,
    ...v
  }, p) => {
    const b = (_) => {
      _.stopPropagation(), u == null || u("");
    }, C = (_) => {
      u == null || u(_.target.value);
    }, x = lt(() => s && i && !l || g, [s, l, g, i]), [S, E] = De(0), M = ye(null);
    return qe(() => {
      let _ = null;
      return g && M.current && (_ = new MutationObserver(() => {
        M.current && E(M.current.offsetWidth + 8);
      }), _.observe(M.current, { childList: !0, subtree: !0 }), E(M.current.offsetWidth + 8)), () => _ == null ? void 0 : _.disconnect();
    }, [M.current]), qe(() => {
      s && !(g && M.current) && E(26);
    }, []), /* @__PURE__ */ me(
      "div",
      {
        "data-u-comp": "input",
        className: ie(
          "univer-relative univer-inline-flex univer-w-full univer-items-center univer-rounded-md",
          l && "univer-cursor-not-allowed",
          t
        ),
        style: n,
        children: [
          /* @__PURE__ */ R(
            "input",
            {
              ref: p,
              type: r,
              className: ie(
                Jx({ size: a }),
                kt,
                l && `
                          univer-cursor-not-allowed univer-bg-gray-50 univer-text-gray-400
                          dark:!univer-text-gray-500
                        `,
                s && !g && "univer-pr-8",
                w
              ),
              placeholder: o,
              value: i,
              disabled: l,
              autoFocus: e,
              onClick: c,
              onKeyDown: f,
              onChange: C,
              onFocus: y,
              onBlur: m,
              style: { ...d, paddingRight: S },
              ...v
            }
          ),
          x && /* @__PURE__ */ me(
            "div",
            {
              className: "univer-absolute univer-right-2 univer-flex univer-items-center univer-gap-1 univer-rounded-full",
              ref: M,
              children: [
                g,
                s && i && !l && /* @__PURE__ */ R(
                  "button",
                  {
                    type: "button",
                    onClick: b,
                    className: "univer-flex univer-size-4 univer-cursor-pointer univer-items-center univer-rounded-full univer-border-none univer-bg-transparent univer-p-1 univer-text-gray-400 univer-transition-colors univer-duration-200 hover:univer-text-gray-500 focus:univer-outline-none",
                    children: /* @__PURE__ */ R(ji, { className: "univer-size-3" })
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
), TE = Ue(
  ({
    value: e,
    defaultValue: t,
    size: n = "small",
    min: r = Number.MIN_SAFE_INTEGER,
    max: o = Number.MAX_SAFE_INTEGER,
    step: i = 1,
    precision: a,
    formatter: s,
    parser: l,
    controls: c = !0,
    className: f,
    inputClassName: u,
    controlsClassName: y,
    disabled: m,
    onChange: g,
    onKeyDown: w,
    onPressEnter: d,
    onFocus: v,
    onBlur: p,
    allowEmpty: b = !1
  }, C) => {
    const [x, S] = De(
      e !== void 0 ? e : t !== void 0 ? t : null
    ), E = ye(x), [M, _] = De(A(x)), P = ye(null), k = ye(null), I = ye(null), H = (W) => {
      C && (typeof C == "function" ? C(W) : C.current = W), P.current = W;
    };
    qe(() => {
      e !== void 0 && e !== x && (S(e), E.current = e, _(A(e)));
    }, [e]), qe(() => {
      x !== null && (E.current = x);
    }, [x]), qe(() => () => {
      k.current && clearTimeout(k.current), I.current && clearInterval(I.current);
    }, []);
    function A(W) {
      if (W == null) return "";
      let Y = W;
      return a !== void 0 && (Y = Number(W).toFixed(a)), s ? s(Y) : String(Y);
    }
    function L(W) {
      if (!W) return null;
      let Y = W;
      l && (Y = l(W));
      try {
        const V = Y.replace(/[^\d.-]/g, "").split("."), Z = V[0], se = V.length > 1 ? V.slice(1).join("") : "", ge = Z + (se ? `.${se}` : ""), j = Number(ge);
        if (Number.isNaN(j))
          return null;
        let q;
        if (a !== void 0) {
          const J = 10 ** a, D = Math.round(j * J) / J;
          D.toString().includes("e") ? q = Number.parseFloat(D.toFixed(a)) : q = D;
        } else
          j.toString().includes("e") ? q = Number.parseFloat(j.toFixed(16).replace(/\.?0+$/, "")) : q = j;
        return o !== void 0 && q > o && (q = o), r !== void 0 && q < r && (q = r), q;
      } catch {
        return null;
      }
    }
    function N(W) {
      if (_(W), b && W === "") {
        S(null), g == null || g(null);
        return;
      }
      const Y = L(W);
      S(Y), g == null || g(Y);
    }
    function $(W) {
      if (x === null) {
        if (M === "" && b)
          g && g(null);
        else {
          const U = E.current;
          S(U), _(A(U)), g && g(U);
        }
        p == null || p(W);
        return;
      }
      let Y = x;
      o !== void 0 && Y > o && (Y = o), r !== void 0 && Y < r && (Y = r), Y !== x ? (S(Y), _(A(Y)), g == null || g(Y)) : _(A(x)), p == null || p(W);
    }
    function T(W) {
      if (m) return;
      const Y = W ? i : -i;
      let U;
      x !== null ? U = x : E.current !== null ? U = E.current : U = r > 0 ? r : 0;
      let V = U + Y;
      o !== void 0 && V > o && (V = o), r !== void 0 && V < r && (V = r), V !== U && (S(V), E.current = V, _(A(V)), g == null || g(V));
    }
    function z(W) {
      m || (w == null || w(W), W.key === "ArrowUp" ? (W.preventDefault(), T(!0)) : W.key === "ArrowDown" ? (W.preventDefault(), T(!1)) : W.key === "Enter" && (d == null || d(W)));
    }
    function B(W) {
      var Y;
      m || (T(W), (Y = P.current) == null || Y.focus());
    }
    return /* @__PURE__ */ R("div", { className: ie("univer-inline-block", f), children: /* @__PURE__ */ me("div", { className: "univer-relative univer-w-full", children: [
      /* @__PURE__ */ R(
        eC,
        {
          ref: H,
          className: ie("univer-box-border", u),
          size: n,
          value: M,
          disabled: m,
          onChange: N,
          onFocus: v,
          onBlur: $,
          onKeyDown: z
        }
      ),
      c && /* @__PURE__ */ me(
        "div",
        {
          className: ie(
            `
                                  univer-absolute univer-right-px univer-top-px univer-flex univer-h-[calc(100%-2px)]
                                  univer-flex-col univer-overflow-hidden univer-rounded-r-md
                                  before:univer-absolute before:univer-top-1/2 before:univer-block before:univer-h-px
                                  before:univer-w-full before:-univer-translate-y-1/2 before:univer-bg-gray-200
                                  before:univer-content-[""]
                                  dark:before:!univer-bg-gray-600
                                `,
            tm,
            y
          ),
          children: [
            /* @__PURE__ */ R(
              "button",
              {
                className: "univer-box-border univer-flex univer-h-1/2 univer-w-5 univer-cursor-pointer univer-items-center univer-justify-center univer-border-none univer-bg-transparent univer-p-0 univer-transition-colors hover:univer-bg-gray-100 dark:!univer-text-white dark:hover:!univer-bg-gray-600",
                type: "button",
                "aria-label": "increment",
                tabIndex: -1,
                disabled: m || o !== void 0 && x !== null && x >= o,
                onClick: () => B(!0),
                children: "+"
              }
            ),
            /* @__PURE__ */ R(
              "button",
              {
                className: "univer-box-border univer-flex univer-h-1/2 univer-w-5 univer-cursor-pointer univer-items-center univer-justify-center univer-border-none univer-bg-transparent univer-p-0 univer-transition-colors hover:univer-bg-gray-100 dark:!univer-text-white dark:hover:!univer-bg-gray-600",
                type: "button",
                "aria-label": "decrement",
                tabIndex: -1,
                disabled: m || r !== void 0 && x !== null && x <= r,
                onClick: () => B(!1),
                children: "-"
              }
            )
          ]
        }
      )
    ] }) });
  }
);
function IE(e) {
  const { keyboard: t, className: n } = e, r = t.split("+");
  return /* @__PURE__ */ R(
    "span",
    {
      className: ie("univer-inline-block univer-h-6 univer-select-none univer-whitespace-nowrap univer-rounded-md univer-bg-gray-50 univer-px-2 univer-font-mono univer-text-xs/6 univer-font-medium univer-text-gray-700 dark:!univer-bg-gray-700 dark:!univer-text-white", kt, n),
      children: r.map((o, i) => /* @__PURE__ */ me(dr, { children: [
        /* @__PURE__ */ R(
          "kbd",
          {
            className: "univer-inline-block univer-h-full",
            children: o
          }
        ),
        i < r.length - 1 && /* @__PURE__ */ R("span", { className: "univer-inline-block univer-h-full univer-px-1", children: "+" })
      ] }, i))
    }
  );
}
var tC = ["prefixCls", "invalidate", "item", "renderItem", "responsive", "responsiveDisabled", "registerSize", "itemKey", "className", "style", "children", "display", "order", "component"], Nr = void 0;
function nC(e, t) {
  var n = e.prefixCls, r = e.invalidate, o = e.item, i = e.renderItem, a = e.responsive, s = e.responsiveDisabled, l = e.registerSize, c = e.itemKey, f = e.className, u = e.style, y = e.children, m = e.display, g = e.order, w = e.component, d = w === void 0 ? "div" : w, v = ft(e, tC), p = a && !m;
  function b(M) {
    l(c, M);
  }
  h.useEffect(function() {
    return function() {
      b(null);
    };
  }, []);
  var C = i && o !== Nr ? i(o, {
    index: g
  }) : y, x;
  r || (x = {
    opacity: p ? 0 : 1,
    height: p ? 0 : Nr,
    overflowY: p ? "hidden" : Nr,
    order: a ? g : Nr,
    pointerEvents: p ? "none" : Nr,
    position: p ? "absolute" : Nr
  });
  var S = {};
  p && (S["aria-hidden"] = !0);
  var E = /* @__PURE__ */ h.createElement(d, $e({
    className: it(!r && n, f),
    style: re(re({}, x), u)
  }, S, v, {
    ref: t
  }), C);
  return a && (E = /* @__PURE__ */ h.createElement(mr, {
    onResize: function(_) {
      var P = _.offsetWidth;
      b(P);
    },
    disabled: s
  }, E)), E;
}
var bo = /* @__PURE__ */ h.forwardRef(nC);
bo.displayName = "Item";
function rC(e) {
  if (typeof MessageChannel > "u")
    mt(e);
  else {
    var t = new MessageChannel();
    t.port1.onmessage = function() {
      return e();
    }, t.port2.postMessage(void 0);
  }
}
function oC() {
  var e = h.useRef(null), t = function(r) {
    e.current || (e.current = [], rC(function() {
      Hp(function() {
        e.current.forEach(function(o) {
          o();
        }), e.current = null;
      });
    })), e.current.push(r);
  };
  return t;
}
function fo(e, t) {
  var n = h.useState(t), r = ae(n, 2), o = r[0], i = r[1], a = Ot(function(s) {
    e(function() {
      i(s);
    });
  });
  return [o, a];
}
var zi = /* @__PURE__ */ K.createContext(null), iC = ["component"], aC = ["className"], sC = ["className"], uC = function(t, n) {
  var r = h.useContext(zi);
  if (!r) {
    var o = t.component, i = o === void 0 ? "div" : o, a = ft(t, iC);
    return /* @__PURE__ */ h.createElement(i, $e({}, a, {
      ref: n
    }));
  }
  var s = r.className, l = ft(r, aC), c = t.className, f = ft(t, sC);
  return /* @__PURE__ */ h.createElement(zi.Provider, {
    value: null
  }, /* @__PURE__ */ h.createElement(bo, $e({
    ref: n,
    className: it(s, c)
  }, l, f)));
}, fp = /* @__PURE__ */ h.forwardRef(uC);
fp.displayName = "RawItem";
var lC = ["prefixCls", "data", "renderItem", "renderRawItem", "itemKey", "itemWidth", "ssr", "style", "className", "maxCount", "renderRest", "renderRawRest", "suffix", "component", "itemComponent", "onVisibleChange"], vp = "responsive", pp = "invalidate";
function cC(e) {
  return "+ ".concat(e.length, " ...");
}
function dC(e, t) {
  var n = e.prefixCls, r = n === void 0 ? "rc-overflow" : n, o = e.data, i = o === void 0 ? [] : o, a = e.renderItem, s = e.renderRawItem, l = e.itemKey, c = e.itemWidth, f = c === void 0 ? 10 : c, u = e.ssr, y = e.style, m = e.className, g = e.maxCount, w = e.renderRest, d = e.renderRawRest, v = e.suffix, p = e.component, b = p === void 0 ? "div" : p, C = e.itemComponent, x = e.onVisibleChange, S = ft(e, lC), E = u === "full", M = oC(), _ = fo(M, null), P = ae(_, 2), k = P[0], I = P[1], H = k || 0, A = fo(M, /* @__PURE__ */ new Map()), L = ae(A, 2), N = L[0], $ = L[1], T = fo(M, 0), z = ae(T, 2), B = z[0], W = z[1], Y = fo(M, 0), U = ae(Y, 2), V = U[0], Z = U[1], se = fo(M, 0), ge = ae(se, 2), j = ge[0], q = ge[1], J = De(null), D = ae(J, 2), O = D[0], F = D[1], G = De(null), Q = ae(G, 2), X = Q[0], oe = Q[1], ee = h.useMemo(function() {
    return X === null && E ? Number.MAX_SAFE_INTEGER : X || 0;
  }, [X, k]), ne = De(!1), be = ae(ne, 2), we = be[0], pe = be[1], te = "".concat(r, "-item"), He = Math.max(B, V), Te = g === vp, Ee = i.length && Te, Ge = g === pp, ze = Ee || typeof g == "number" && i.length > g, Ie = lt(function() {
    var de = i;
    return Ee ? k === null && E ? de = i : de = i.slice(0, Math.min(i.length, H / f)) : typeof g == "number" && (de = i.slice(0, g)), de;
  }, [i, f, k, g, Ee]), Xe = lt(function() {
    return Ee ? i.slice(ee + 1) : i.slice(Ie.length);
  }, [i, Ie, Ee, ee]), Je = dt(function(de, fe) {
    var ue;
    return typeof l == "function" ? l(de) : (ue = l && (de == null ? void 0 : de[l])) !== null && ue !== void 0 ? ue : fe;
  }, [l]), je = dt(a || function(de) {
    return de;
  }, [a]);
  function Ze(de, fe, ue) {
    X === de && (fe === void 0 || fe === O) || (oe(de), ue || (pe(de < i.length - 1), x == null || x(de)), fe !== void 0 && F(fe));
  }
  function Ae(de, fe) {
    I(fe.clientWidth);
  }
  function Fe(de, fe) {
    $(function(ue) {
      var Pe = new Map(ue);
      return fe === null ? Pe.delete(de) : Pe.set(de, fe), Pe;
    });
  }
  function Ke(de, fe) {
    Z(fe), W(V);
  }
  function vt(de, fe) {
    q(fe);
  }
  function st(de) {
    return N.get(Je(Ie[de], de));
  }
  ht(function() {
    if (H && typeof He == "number" && Ie) {
      var de = j, fe = Ie.length, ue = fe - 1;
      if (!fe) {
        Ze(0, null);
        return;
      }
      for (var Pe = 0; Pe < fe; Pe += 1) {
        var nt = st(Pe);
        if (E && (nt = nt || 0), nt === void 0) {
          Ze(Pe - 1, void 0, !0);
          break;
        }
        if (de += nt, // Only one means `totalWidth` is the final width
        ue === 0 && de <= H || // Last two width will be the final width
        Pe === ue - 1 && de + st(ue) <= H) {
          Ze(ue, null);
          break;
        } else if (de + He > H) {
          Ze(Pe - 1, de - nt - j + V);
          break;
        }
      }
      v && st(0) + j > H && F(null);
    }
  }, [H, N, V, j, Je, Ie]);
  var pt = we && !!Xe.length, zt = {};
  O !== null && Ee && (zt = {
    position: "absolute",
    left: O,
    top: 0
  });
  var St = {
    prefixCls: te,
    responsive: Ee,
    component: C,
    invalidate: Ge
  }, Tt = s ? function(de, fe) {
    var ue = Je(de, fe);
    return /* @__PURE__ */ h.createElement(zi.Provider, {
      key: ue,
      value: re(re({}, St), {}, {
        order: fe,
        item: de,
        itemKey: ue,
        registerSize: Fe,
        display: fe <= ee
      })
    }, s(de, fe));
  } : function(de, fe) {
    var ue = Je(de, fe);
    return /* @__PURE__ */ h.createElement(bo, $e({}, St, {
      order: fe,
      key: ue,
      item: de,
      renderItem: je,
      itemKey: ue,
      registerSize: Fe,
      display: fe <= ee
    }));
  }, ot = {
    order: pt ? ee : Number.MAX_SAFE_INTEGER,
    className: "".concat(te, "-rest"),
    registerSize: Ke,
    display: pt
  }, ce = w || cC, _e = d ? /* @__PURE__ */ h.createElement(zi.Provider, {
    value: re(re({}, St), ot)
  }, d(Xe)) : /* @__PURE__ */ h.createElement(bo, $e({}, St, ot), typeof ce == "function" ? ce(Xe) : ce), Re = /* @__PURE__ */ h.createElement(b, $e({
    className: it(!Ge && r, m),
    style: y,
    ref: t
  }, S), Ie.map(Tt), ze ? _e : null, v && /* @__PURE__ */ h.createElement(bo, $e({}, St, {
    responsive: Te,
    responsiveDisabled: !Ee,
    order: ee,
    className: "".concat(te, "-suffix"),
    registerSize: vt,
    display: !0,
    style: zt
  }), v));
  return Te ? /* @__PURE__ */ h.createElement(mr, {
    onResize: Ae,
    disabled: !Ee
  }, Re) : Re;
}
var Dn = /* @__PURE__ */ h.forwardRef(dC);
Dn.displayName = "Overflow";
Dn.Item = fp;
Dn.RESPONSIVE = vp;
Dn.INVALIDATE = pp;
function hp(e, t) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, r = /* @__PURE__ */ new Set();
  function o(i, a) {
    var s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1, l = r.has(i);
    if (Kr(!l, "Warning: There may be circular references"), l)
      return !1;
    if (i === a)
      return !0;
    if (n && s > 1)
      return !1;
    r.add(i);
    var c = s + 1;
    if (Array.isArray(i)) {
      if (!Array.isArray(a) || i.length !== a.length)
        return !1;
      for (var f = 0; f < i.length; f++)
        if (!o(i[f], a[f], c))
          return !1;
      return !0;
    }
    if (i && a && wt(i) === "object" && wt(a) === "object") {
      var u = Object.keys(i);
      return u.length !== Object.keys(a).length ? !1 : u.every(function(y) {
        return o(i[y], a[y], c);
      });
    }
    return !1;
  }
  return o(e, t);
}
var mp = /* @__PURE__ */ h.createContext(null);
function gp(e, t) {
  return e === void 0 ? null : "".concat(e, "-").concat(t);
}
function yp(e) {
  var t = h.useContext(mp);
  return gp(t, e);
}
var fC = ["children", "locked"], sn = /* @__PURE__ */ h.createContext(null);
function vC(e, t) {
  var n = re({}, e);
  return Object.keys(t).forEach(function(r) {
    var o = t[r];
    o !== void 0 && (n[r] = o);
  }), n;
}
function Do(e) {
  var t = e.children, n = e.locked, r = ft(e, fC), o = h.useContext(sn), i = Af(function() {
    return vC(o, r);
  }, [o, r], function(a, s) {
    return !n && (a[0] !== s[0] || !hp(a[1], s[1], !0));
  });
  return /* @__PURE__ */ h.createElement(sn.Provider, {
    value: i
  }, t);
}
var pC = [], bp = /* @__PURE__ */ h.createContext(null);
function pa() {
  return h.useContext(bp);
}
var wp = /* @__PURE__ */ h.createContext(pC);
function Vo(e) {
  var t = h.useContext(wp);
  return h.useMemo(function() {
    return e !== void 0 ? [].concat(xn(t), [e]) : t;
  }, [t, e]);
}
var xp = /* @__PURE__ */ h.createContext(null), yu = /* @__PURE__ */ h.createContext({});
function uc(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  if (iv(e)) {
    var n = e.nodeName.toLowerCase(), r = (
      // Focusable element
      ["input", "select", "textarea", "button"].includes(n) || // Editable element
      e.isContentEditable || // Anchor with href element
      n === "a" && !!e.getAttribute("href")
    ), o = e.getAttribute("tabindex"), i = Number(o), a = null;
    return o && !Number.isNaN(i) ? a = i : r && a === null && (a = 0), r && e.disabled && (a = null), a !== null && (a >= 0 || t && a < 0);
  }
  return !1;
}
function hC(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = xn(e.querySelectorAll("*")).filter(function(r) {
    return uc(r, t);
  });
  return uc(e, t) && n.unshift(e), n;
}
var ys = ln.LEFT, bs = ln.RIGHT, ws = ln.UP, yi = ln.DOWN, bi = ln.ENTER, Cp = ln.ESC, vo = ln.HOME, po = ln.END, lc = [ws, yi, ys, bs];
function mC(e, t, n, r) {
  var o, i = "prev", a = "next", s = "children", l = "parent";
  if (e === "inline" && r === bi)
    return {
      inlineTrigger: !0
    };
  var c = xe(xe({}, ws, i), yi, a), f = xe(xe(xe(xe({}, ys, n ? a : i), bs, n ? i : a), yi, s), bi, s), u = xe(xe(xe(xe(xe(xe({}, ws, i), yi, a), bi, s), Cp, l), ys, n ? s : l), bs, n ? l : s), y = {
    inline: c,
    horizontal: f,
    vertical: u,
    inlineSub: c,
    horizontalSub: u,
    verticalSub: u
  }, m = (o = y["".concat(e).concat(t ? "" : "Sub")]) === null || o === void 0 ? void 0 : o[r];
  switch (m) {
    case i:
      return {
        offset: -1,
        sibling: !0
      };
    case a:
      return {
        offset: 1,
        sibling: !0
      };
    case l:
      return {
        offset: -1,
        sibling: !1
      };
    case s:
      return {
        offset: 1,
        sibling: !1
      };
    default:
      return null;
  }
}
function gC(e) {
  for (var t = e; t; ) {
    if (t.getAttribute("data-menu-list"))
      return t;
    t = t.parentElement;
  }
  return null;
}
function yC(e, t) {
  for (var n = e || document.activeElement; n; ) {
    if (t.has(n))
      return n;
    n = n.parentElement;
  }
  return null;
}
function bu(e, t) {
  var n = hC(e, !0);
  return n.filter(function(r) {
    return t.has(r);
  });
}
function cc(e, t, n) {
  var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
  if (!e)
    return null;
  var o = bu(e, t), i = o.length, a = o.findIndex(function(s) {
    return n === s;
  });
  return r < 0 ? a === -1 ? a = i - 1 : a -= 1 : r > 0 && (a += 1), a = (a + i) % i, o[a];
}
var xs = function(t, n) {
  var r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  return t.forEach(function(a) {
    var s = document.querySelector("[data-menu-id='".concat(gp(n, a), "']"));
    s && (r.add(s), i.set(s, a), o.set(a, s));
  }), {
    elements: r,
    key2element: o,
    element2key: i
  };
};
function bC(e, t, n, r, o, i, a, s, l, c) {
  var f = h.useRef(), u = h.useRef();
  u.current = t;
  var y = function() {
    mt.cancel(f.current);
  };
  return h.useEffect(function() {
    return function() {
      y();
    };
  }, []), function(m) {
    var g = m.which;
    if ([].concat(lc, [bi, Cp, vo, po]).includes(g)) {
      var w = i(), d = xs(w, r), v = d, p = v.elements, b = v.key2element, C = v.element2key, x = b.get(t), S = yC(x, p), E = C.get(S), M = mC(e, a(E, !0).length === 1, n, g);
      if (!M && g !== vo && g !== po)
        return;
      (lc.includes(g) || [vo, po].includes(g)) && m.preventDefault();
      var _ = function($) {
        if ($) {
          var T = $, z = $.querySelector("a");
          z != null && z.getAttribute("href") && (T = z);
          var B = C.get($);
          s(B), y(), f.current = mt(function() {
            u.current === B && T.focus();
          });
        }
      };
      if ([vo, po].includes(g) || M.sibling || !S) {
        var P;
        !S || e === "inline" ? P = o.current : P = gC(S);
        var k, I = bu(P, p);
        g === vo ? k = I[0] : g === po ? k = I[I.length - 1] : k = cc(P, p, S, M.offset), _(k);
      } else if (M.inlineTrigger)
        l(E);
      else if (M.offset > 0)
        l(E, !0), y(), f.current = mt(function() {
          d = xs(w, r);
          var N = S.getAttribute("aria-controls"), $ = document.getElementById(N), T = cc($, d.elements);
          _(T);
        }, 5);
      else if (M.offset < 0) {
        var H = a(E, !0), A = H[H.length - 2], L = b.get(A);
        l(A, !1), _(L);
      }
    }
    c == null || c(m);
  };
}
function wC(e) {
  Promise.resolve().then(e);
}
var wu = "__RC_UTIL_PATH_SPLIT__", dc = function(t) {
  return t.join(wu);
}, xC = function(t) {
  return t.split(wu);
}, Cs = "rc-menu-more";
function CC() {
  var e = h.useState({}), t = ae(e, 2), n = t[1], r = ye(/* @__PURE__ */ new Map()), o = ye(/* @__PURE__ */ new Map()), i = h.useState([]), a = ae(i, 2), s = a[0], l = a[1], c = ye(0), f = ye(!1), u = function() {
    f.current || n({});
  }, y = dt(function(b, C) {
    var x = dc(C);
    o.current.set(x, b), r.current.set(b, x), c.current += 1;
    var S = c.current;
    wC(function() {
      S === c.current && u();
    });
  }, []), m = dt(function(b, C) {
    var x = dc(C);
    o.current.delete(x), r.current.delete(b);
  }, []), g = dt(function(b) {
    l(b);
  }, []), w = dt(function(b, C) {
    var x = r.current.get(b) || "", S = xC(x);
    return C && s.includes(S[0]) && S.unshift(Cs), S;
  }, [s]), d = dt(function(b, C) {
    return b.filter(function(x) {
      return x !== void 0;
    }).some(function(x) {
      var S = w(x, !0);
      return S.includes(C);
    });
  }, [w]), v = function() {
    var C = xn(r.current.keys());
    return s.length && C.push(Cs), C;
  }, p = dt(function(b) {
    var C = "".concat(r.current.get(b)).concat(wu), x = /* @__PURE__ */ new Set();
    return xn(o.current.keys()).forEach(function(S) {
      S.startsWith(C) && x.add(o.current.get(S));
    }), x;
  }, []);
  return h.useEffect(function() {
    return function() {
      f.current = !0;
    };
  }, []), {
    // Register
    registerPath: y,
    unregisterPath: m,
    refreshOverflowKeys: g,
    // Util
    isSubPathKey: d,
    getKeyPath: w,
    getKeys: v,
    getSubPathKeys: p
  };
}
function go(e) {
  var t = h.useRef(e);
  t.current = e;
  var n = h.useCallback(function() {
    for (var r, o = arguments.length, i = new Array(o), a = 0; a < o; a++)
      i[a] = arguments[a];
    return (r = t.current) === null || r === void 0 ? void 0 : r.call.apply(r, [t].concat(i));
  }, []);
  return e ? n : void 0;
}
var SC = Math.random().toFixed(5).toString().slice(2), fc = 0;
function EC(e) {
  var t = gi(e, {
    value: e
  }), n = ae(t, 2), r = n[0], o = n[1];
  return h.useEffect(function() {
    fc += 1;
    var i = "".concat(SC, "-").concat(fc);
    o("rc-menu-uuid-".concat(i));
  }, []), r;
}
function xu(e, t) {
  var n = Object.assign({}, e);
  return Array.isArray(t) && t.forEach(function(r) {
    delete n[r];
  }), n;
}
function Sp(e, t, n, r) {
  var o = h.useContext(sn), i = o.activeKey, a = o.onActive, s = o.onInactive, l = {
    active: i === e
  };
  return t || (l.onMouseEnter = function(c) {
    n == null || n({
      key: e,
      domEvent: c
    }), a(e);
  }, l.onMouseLeave = function(c) {
    r == null || r({
      key: e,
      domEvent: c
    }), s(e);
  }), l;
}
function Ep(e) {
  var t = h.useContext(sn), n = t.mode, r = t.rtl, o = t.inlineIndent;
  if (n !== "inline")
    return null;
  var i = e;
  return r ? {
    paddingRight: i * o
  } : {
    paddingLeft: i * o
  };
}
function Rp(e) {
  var t = e.icon, n = e.props, r = e.children, o;
  return t === null || t === !1 ? null : (typeof t == "function" ? o = /* @__PURE__ */ h.createElement(t, re({}, n)) : typeof t != "boolean" && (o = t), o || r || null);
}
var RC = ["item"];
function Fi(e) {
  var t = e.item, n = ft(e, RC);
  return Object.defineProperty(n, "item", {
    get: function() {
      return Kr(!1, "`info.item` is deprecated since we will move to function component that not provides React Node instance in future."), t;
    }
  }), n;
}
var MC = ["title", "attribute", "elementRef"], PC = ["style", "className", "eventKey", "warnKey", "disabled", "itemIcon", "children", "role", "onMouseEnter", "onMouseLeave", "onClick", "onKeyDown", "onFocus"], NC = ["active"], DC = /* @__PURE__ */ (function(e) {
  aa(n, e);
  var t = sa(n);
  function n() {
    return $o(this, n), t.apply(this, arguments);
  }
  return zo(n, [{
    key: "render",
    value: function() {
      var o = this.props, i = o.title, a = o.attribute, s = o.elementRef, l = ft(o, MC), c = xu(l, ["eventKey", "popupClassName", "popupOffset", "onTitleClick"]);
      return Kr(!a, "`attribute` of Menu.Item is deprecated. Please pass attribute directly."), /* @__PURE__ */ h.createElement(Dn.Item, $e({}, a, {
        title: typeof i == "string" ? i : void 0
      }, c, {
        ref: s
      }));
    }
  }]), n;
})(h.Component), _C = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.style, r = e.className, o = e.eventKey;
  e.warnKey;
  var i = e.disabled, a = e.itemIcon, s = e.children, l = e.role, c = e.onMouseEnter, f = e.onMouseLeave, u = e.onClick, y = e.onKeyDown, m = e.onFocus, g = ft(e, PC), w = yp(o), d = h.useContext(sn), v = d.prefixCls, p = d.onItemClick, b = d.disabled, C = d.overflowDisabled, x = d.itemIcon, S = d.selectedKeys, E = d.onActive, M = h.useContext(yu), _ = M._internalRenderMenuItem, P = "".concat(v, "-item"), k = h.useRef(), I = h.useRef(), H = b || i, A = oa(t, I), L = Vo(o), N = function(q) {
    return {
      key: o,
      // Note: For legacy code is reversed which not like other antd component
      keyPath: xn(L).reverse(),
      item: k.current,
      domEvent: q
    };
  }, $ = a || x, T = Sp(o, H, c, f), z = T.active, B = ft(T, NC), W = S.includes(o), Y = Ep(L.length), U = function(q) {
    if (!H) {
      var J = N(q);
      u == null || u(Fi(J)), p(J);
    }
  }, V = function(q) {
    if (y == null || y(q), q.which === ln.ENTER) {
      var J = N(q);
      u == null || u(Fi(J)), p(J);
    }
  }, Z = function(q) {
    E(o), m == null || m(q);
  }, se = {};
  e.role === "option" && (se["aria-selected"] = W);
  var ge = /* @__PURE__ */ h.createElement(DC, $e({
    ref: k,
    elementRef: A,
    role: l === null ? "none" : l || "menuitem",
    tabIndex: i ? null : -1,
    "data-menu-id": C && w ? null : w
  }, xu(g, ["extra"]), B, se, {
    component: "li",
    "aria-disabled": i,
    style: re(re({}, Y), n),
    className: it(P, xe(xe(xe({}, "".concat(P, "-active"), z), "".concat(P, "-selected"), W), "".concat(P, "-disabled"), H), r),
    onClick: U,
    onKeyDown: V,
    onFocus: Z
  }), s, /* @__PURE__ */ h.createElement(Rp, {
    props: re(re({}, e), {}, {
      isSelected: W
    }),
    icon: $
  }));
  return _ && (ge = _(ge, e, {
    selected: W
  })), ge;
});
function OC(e, t) {
  var n = e.eventKey, r = pa(), o = Vo(n);
  return h.useEffect(function() {
    if (r)
      return r.registerPath(n, o), function() {
        r.unregisterPath(n, o);
      };
  }, [o]), r ? null : /* @__PURE__ */ h.createElement(_C, $e({}, e, {
    ref: t
  }));
}
const ha = /* @__PURE__ */ h.forwardRef(OC);
var kC = ["className", "children"], TC = function(t, n) {
  var r = t.className, o = t.children, i = ft(t, kC), a = h.useContext(sn), s = a.prefixCls, l = a.mode, c = a.rtl;
  return /* @__PURE__ */ h.createElement("ul", $e({
    className: it(s, c && "".concat(s, "-rtl"), "".concat(s, "-sub"), "".concat(s, "-").concat(l === "inline" ? "inline" : "vertical"), r),
    role: "menu"
  }, i, {
    "data-menu-list": !0,
    ref: n
  }), o);
}, Cu = /* @__PURE__ */ h.forwardRef(TC);
Cu.displayName = "SubMenuList";
function Su(e, t) {
  return Oi(e).map(function(n, r) {
    if (/* @__PURE__ */ h.isValidElement(n)) {
      var o, i, a = n.key, s = (o = (i = n.props) === null || i === void 0 ? void 0 : i.eventKey) !== null && o !== void 0 ? o : a, l = s == null;
      l && (s = "tmp_key-".concat([].concat(xn(t), [r]).join("-")));
      var c = {
        key: s,
        eventKey: s
      };
      return /* @__PURE__ */ h.cloneElement(n, c);
    }
    return n;
  });
}
var Nt = {
  adjustX: 1,
  adjustY: 1
}, IC = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: Nt
  },
  topRight: {
    points: ["br", "tr"],
    overflow: Nt
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: Nt
  },
  bottomRight: {
    points: ["tr", "br"],
    overflow: Nt
  },
  leftTop: {
    points: ["tr", "tl"],
    overflow: Nt
  },
  leftBottom: {
    points: ["br", "bl"],
    overflow: Nt
  },
  rightTop: {
    points: ["tl", "tr"],
    overflow: Nt
  },
  rightBottom: {
    points: ["bl", "br"],
    overflow: Nt
  }
}, AC = {
  topLeft: {
    points: ["bl", "tl"],
    overflow: Nt
  },
  topRight: {
    points: ["br", "tr"],
    overflow: Nt
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: Nt
  },
  bottomRight: {
    points: ["tr", "br"],
    overflow: Nt
  },
  rightTop: {
    points: ["tr", "tl"],
    overflow: Nt
  },
  rightBottom: {
    points: ["br", "bl"],
    overflow: Nt
  },
  leftTop: {
    points: ["tl", "tr"],
    overflow: Nt
  },
  leftBottom: {
    points: ["bl", "br"],
    overflow: Nt
  }
};
function Mp(e, t, n) {
  if (t)
    return t;
  if (n)
    return n[e] || n.other;
}
var LC = {
  horizontal: "bottomLeft",
  vertical: "rightTop",
  "vertical-left": "rightTop",
  "vertical-right": "leftTop"
};
function $C(e) {
  var t = e.prefixCls, n = e.visible, r = e.children, o = e.popup, i = e.popupStyle, a = e.popupClassName, s = e.popupOffset, l = e.disabled, c = e.mode, f = e.onVisibleChange, u = h.useContext(sn), y = u.getPopupContainer, m = u.rtl, g = u.subMenuOpenDelay, w = u.subMenuCloseDelay, d = u.builtinPlacements, v = u.triggerSubMenuAction, p = u.forceSubMenuRender, b = u.rootClassName, C = u.motion, x = u.defaultMotions, S = h.useState(!1), E = ae(S, 2), M = E[0], _ = E[1], P = re(m ? re({}, AC) : re({}, IC), d), k = LC[c], I = Mp(c, C, x), H = h.useRef(I);
  c !== "inline" && (H.current = I);
  var A = re(re({}, H.current), {}, {
    leavedClassName: "".concat(t, "-hidden"),
    removeOnLeave: !1,
    motionAppear: !0
  }), L = h.useRef();
  return h.useEffect(function() {
    return L.current = mt(function() {
      _(n);
    }), function() {
      mt.cancel(L.current);
    };
  }, [n]), /* @__PURE__ */ h.createElement(av, {
    prefixCls: t,
    popupClassName: it("".concat(t, "-popup"), xe({}, "".concat(t, "-rtl"), m), a, b),
    stretch: c === "horizontal" ? "minWidth" : null,
    getPopupContainer: y,
    builtinPlacements: P,
    popupPlacement: k,
    popupVisible: M,
    popup: o,
    popupStyle: i,
    popupAlign: s && {
      offset: s
    },
    action: l ? [] : [v],
    mouseEnterDelay: g,
    mouseLeaveDelay: w,
    onPopupVisibleChange: f,
    forceRender: p,
    popupMotion: A,
    fresh: !0
  }, r);
}
function zC(e) {
  var t = e.id, n = e.open, r = e.keyPath, o = e.children, i = "inline", a = h.useContext(sn), s = a.prefixCls, l = a.forceSubMenuRender, c = a.motion, f = a.defaultMotions, u = a.mode, y = h.useRef(!1);
  y.current = u === i;
  var m = h.useState(!y.current), g = ae(m, 2), w = g[0], d = g[1], v = y.current ? n : !1;
  h.useEffect(function() {
    y.current && d(!1);
  }, [u]);
  var p = re({}, Mp(i, c, f));
  r.length > 1 && (p.motionAppear = !1);
  var b = p.onVisibleChanged;
  return p.onVisibleChanged = function(C) {
    return !y.current && !C && d(!0), b == null ? void 0 : b(C);
  }, w ? null : /* @__PURE__ */ h.createElement(Do, {
    mode: i,
    locked: !y.current
  }, /* @__PURE__ */ h.createElement(ua, $e({
    visible: v
  }, p, {
    forceRender: l,
    removeOnLeave: !1,
    leavedClassName: "".concat(s, "-hidden")
  }), function(C) {
    var x = C.className, S = C.style;
    return /* @__PURE__ */ h.createElement(Cu, {
      id: t,
      className: x,
      style: S
    }, o);
  }));
}
var FC = ["style", "className", "title", "eventKey", "warnKey", "disabled", "internalPopupClose", "children", "itemIcon", "expandIcon", "popupClassName", "popupOffset", "popupStyle", "onClick", "onMouseEnter", "onMouseLeave", "onTitleClick", "onTitleMouseEnter", "onTitleMouseLeave"], HC = ["active"], WC = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.style, r = e.className, o = e.title, i = e.eventKey;
  e.warnKey;
  var a = e.disabled, s = e.internalPopupClose, l = e.children, c = e.itemIcon, f = e.expandIcon, u = e.popupClassName, y = e.popupOffset, m = e.popupStyle, g = e.onClick, w = e.onMouseEnter, d = e.onMouseLeave, v = e.onTitleClick, p = e.onTitleMouseEnter, b = e.onTitleMouseLeave, C = ft(e, FC), x = yp(i), S = h.useContext(sn), E = S.prefixCls, M = S.mode, _ = S.openKeys, P = S.disabled, k = S.overflowDisabled, I = S.activeKey, H = S.selectedKeys, A = S.itemIcon, L = S.expandIcon, N = S.onItemClick, $ = S.onOpenChange, T = S.onActive, z = h.useContext(yu), B = z._internalRenderSubMenuItem, W = h.useContext(xp), Y = W.isSubPathKey, U = Vo(), V = "".concat(E, "-submenu"), Z = P || a, se = h.useRef(), ge = h.useRef(), j = c != null ? c : A, q = f != null ? f : L, J = _.includes(i), D = !k && J, O = Y(H, i), F = Sp(i, Z, p, b), G = F.active, Q = ft(F, HC), X = h.useState(!1), oe = ae(X, 2), ee = oe[0], ne = oe[1], be = function(Ke) {
    Z || ne(Ke);
  }, we = function(Ke) {
    be(!0), w == null || w({
      key: i,
      domEvent: Ke
    });
  }, pe = function(Ke) {
    be(!1), d == null || d({
      key: i,
      domEvent: Ke
    });
  }, te = h.useMemo(function() {
    return G || (M !== "inline" ? ee || Y([I], i) : !1);
  }, [M, G, I, ee, i, Y]), He = Ep(U.length), Te = function(Ke) {
    Z || (v == null || v({
      key: i,
      domEvent: Ke
    }), M === "inline" && $(i, !J));
  }, Ee = go(function(Fe) {
    g == null || g(Fi(Fe)), N(Fe);
  }), Ge = function(Ke) {
    M !== "inline" && $(i, Ke);
  }, ze = function() {
    T(i);
  }, Ie = x && "".concat(x, "-popup"), Xe = h.useMemo(function() {
    return /* @__PURE__ */ h.createElement(Rp, {
      icon: M !== "horizontal" ? q : void 0,
      props: re(re({}, e), {}, {
        isOpen: D,
        // [Legacy] Not sure why need this mark
        isSubMenu: !0
      })
    }, /* @__PURE__ */ h.createElement("i", {
      className: "".concat(V, "-arrow")
    }));
  }, [M, q, e, D, V]), Je = /* @__PURE__ */ h.createElement("div", $e({
    role: "menuitem",
    style: He,
    className: "".concat(V, "-title"),
    tabIndex: Z ? null : -1,
    ref: se,
    title: typeof o == "string" ? o : null,
    "data-menu-id": k && x ? null : x,
    "aria-expanded": D,
    "aria-haspopup": !0,
    "aria-controls": Ie,
    "aria-disabled": Z,
    onClick: Te,
    onFocus: ze
  }, Q), o, Xe), je = h.useRef(M);
  if (M !== "inline" && U.length > 1 ? je.current = "vertical" : je.current = M, !k) {
    var Ze = je.current;
    Je = /* @__PURE__ */ h.createElement($C, {
      mode: Ze,
      prefixCls: V,
      visible: !s && D && M !== "inline",
      popupClassName: u,
      popupOffset: y,
      popupStyle: m,
      popup: /* @__PURE__ */ h.createElement(
        Do,
        {
          mode: Ze === "horizontal" ? "vertical" : Ze
        },
        /* @__PURE__ */ h.createElement(Cu, {
          id: Ie,
          ref: ge
        }, l)
      ),
      disabled: Z,
      onVisibleChange: Ge
    }, Je);
  }
  var Ae = /* @__PURE__ */ h.createElement(Dn.Item, $e({
    ref: t,
    role: "none"
  }, C, {
    component: "li",
    style: n,
    className: it(V, "".concat(V, "-").concat(M), r, xe(xe(xe(xe({}, "".concat(V, "-open"), D), "".concat(V, "-active"), te), "".concat(V, "-selected"), O), "".concat(V, "-disabled"), Z)),
    onMouseEnter: we,
    onMouseLeave: pe
  }), Je, !k && /* @__PURE__ */ h.createElement(zC, {
    id: Ie,
    open: D,
    keyPath: U
  }, l));
  return B && (Ae = B(Ae, e, {
    selected: O,
    active: te,
    open: D,
    disabled: Z
  })), /* @__PURE__ */ h.createElement(Do, {
    onItemClick: Ee,
    mode: M === "horizontal" ? "vertical" : M,
    itemIcon: j,
    expandIcon: q
  }, Ae);
}), ma = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.eventKey, r = e.children, o = Vo(n), i = Su(r, o), a = pa();
  h.useEffect(function() {
    if (a)
      return a.registerPath(n, o), function() {
        a.unregisterPath(n, o);
      };
  }, [o]);
  var s;
  return a ? s = i : s = /* @__PURE__ */ h.createElement(WC, $e({
    ref: t
  }, e), i), /* @__PURE__ */ h.createElement(wp.Provider, {
    value: o
  }, s);
});
function Pp(e) {
  var t = e.className, n = e.style, r = h.useContext(sn), o = r.prefixCls, i = pa();
  return i ? null : /* @__PURE__ */ h.createElement("li", {
    role: "separator",
    className: it("".concat(o, "-item-divider"), t),
    style: n
  });
}
var BC = ["className", "title", "eventKey", "children"], jC = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.className, r = e.title;
  e.eventKey;
  var o = e.children, i = ft(e, BC), a = h.useContext(sn), s = a.prefixCls, l = "".concat(s, "-item-group");
  return /* @__PURE__ */ h.createElement("li", $e({
    ref: t,
    role: "presentation"
  }, i, {
    onClick: function(f) {
      return f.stopPropagation();
    },
    className: it(l, n)
  }), /* @__PURE__ */ h.createElement("div", {
    role: "presentation",
    className: "".concat(l, "-title"),
    title: typeof r == "string" ? r : void 0
  }, r), /* @__PURE__ */ h.createElement("ul", {
    role: "group",
    className: "".concat(l, "-list")
  }, o));
}), Eu = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.eventKey, r = e.children, o = Vo(n), i = Su(r, o), a = pa();
  return a ? i : /* @__PURE__ */ h.createElement(jC, $e({
    ref: t
  }, xu(e, ["warnKey"])), i);
}), VC = ["label", "children", "key", "type", "extra"];
function Ss(e, t, n) {
  var r = t.item, o = t.group, i = t.submenu, a = t.divider;
  return (e || []).map(function(s, l) {
    if (s && wt(s) === "object") {
      var c = s, f = c.label, u = c.children, y = c.key, m = c.type, g = c.extra, w = ft(c, VC), d = y != null ? y : "tmp-".concat(l);
      return u || m === "group" ? m === "group" ? /* @__PURE__ */ h.createElement(o, $e({
        key: d
      }, w, {
        title: f
      }), Ss(u, t, n)) : /* @__PURE__ */ h.createElement(i, $e({
        key: d
      }, w, {
        title: f
      }), Ss(u, t, n)) : m === "divider" ? /* @__PURE__ */ h.createElement(a, $e({
        key: d
      }, w)) : /* @__PURE__ */ h.createElement(r, $e({
        key: d
      }, w, {
        extra: g
      }), f, (!!g || g === 0) && /* @__PURE__ */ h.createElement("span", {
        className: "".concat(n, "-item-extra")
      }, g));
    }
    return null;
  }).filter(function(s) {
    return s;
  });
}
function vc(e, t, n, r, o) {
  var i = e, a = re({
    divider: Pp,
    item: ha,
    group: Eu,
    submenu: ma
  }, r);
  return t && (i = Ss(t, a, o)), Su(i, n);
}
var qC = ["prefixCls", "rootClassName", "style", "className", "tabIndex", "items", "children", "direction", "id", "mode", "inlineCollapsed", "disabled", "disabledOverflow", "subMenuOpenDelay", "subMenuCloseDelay", "forceSubMenuRender", "defaultOpenKeys", "openKeys", "activeKey", "defaultActiveFirst", "selectable", "multiple", "defaultSelectedKeys", "selectedKeys", "onSelect", "onDeselect", "inlineIndent", "motion", "defaultMotions", "triggerSubMenuAction", "builtinPlacements", "itemIcon", "expandIcon", "overflowedIndicator", "overflowedIndicatorPopupClassName", "getPopupContainer", "onClick", "onOpenChange", "onKeyDown", "openAnimation", "openTransitionName", "_internalRenderMenuItem", "_internalRenderSubMenuItem", "_internalComponents"], ur = [], UC = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n, r = e, o = r.prefixCls, i = o === void 0 ? "rc-menu" : o, a = r.rootClassName, s = r.style, l = r.className, c = r.tabIndex, f = c === void 0 ? 0 : c, u = r.items, y = r.children, m = r.direction, g = r.id, w = r.mode, d = w === void 0 ? "vertical" : w, v = r.inlineCollapsed, p = r.disabled, b = r.disabledOverflow, C = r.subMenuOpenDelay, x = C === void 0 ? 0.1 : C, S = r.subMenuCloseDelay, E = S === void 0 ? 0.1 : S, M = r.forceSubMenuRender, _ = r.defaultOpenKeys, P = r.openKeys, k = r.activeKey, I = r.defaultActiveFirst, H = r.selectable, A = H === void 0 ? !0 : H, L = r.multiple, N = L === void 0 ? !1 : L, $ = r.defaultSelectedKeys, T = r.selectedKeys, z = r.onSelect, B = r.onDeselect, W = r.inlineIndent, Y = W === void 0 ? 24 : W, U = r.motion, V = r.defaultMotions, Z = r.triggerSubMenuAction, se = Z === void 0 ? "hover" : Z, ge = r.builtinPlacements, j = r.itemIcon, q = r.expandIcon, J = r.overflowedIndicator, D = J === void 0 ? "..." : J, O = r.overflowedIndicatorPopupClassName, F = r.getPopupContainer, G = r.onClick, Q = r.onOpenChange, X = r.onKeyDown;
  r.openAnimation, r.openTransitionName;
  var oe = r._internalRenderMenuItem, ee = r._internalRenderSubMenuItem, ne = r._internalComponents, be = ft(r, qC), we = h.useMemo(function() {
    return [vc(y, u, ur, ne, i), vc(y, u, ur, {}, i)];
  }, [y, u, ne]), pe = ae(we, 2), te = pe[0], He = pe[1], Te = h.useState(!1), Ee = ae(Te, 2), Ge = Ee[0], ze = Ee[1], Ie = h.useRef(), Xe = EC(g), Je = m === "rtl", je = gi(_, {
    value: P,
    postState: function(Le) {
      return Le || ur;
    }
  }), Ze = ae(je, 2), Ae = Ze[0], Fe = Ze[1], Ke = function(Le) {
    var We = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    function Rt() {
      Fe(Le), Q == null || Q(Le);
    }
    We ? Ya(Rt) : Rt();
  }, vt = h.useState(Ae), st = ae(vt, 2), pt = st[0], zt = st[1], St = h.useRef(!1), Tt = h.useMemo(function() {
    return (d === "inline" || d === "vertical") && v ? ["vertical", v] : [d, !1];
  }, [d, v]), ot = ae(Tt, 2), ce = ot[0], _e = ot[1], Re = ce === "inline", de = h.useState(ce), fe = ae(de, 2), ue = fe[0], Pe = fe[1], nt = h.useState(_e), et = ae(nt, 2), Ve = et[0], Xt = et[1];
  h.useEffect(function() {
    Pe(ce), Xt(_e), St.current && (Re ? Fe(pt) : Ke(ur));
  }, [ce, _e]);
  var yt = h.useState(0), It = ae(yt, 2), Zt = It[0], An = It[1], Ft = Zt >= te.length - 1 || ue !== "horizontal" || b;
  h.useEffect(function() {
    Re && zt(Ae);
  }, [Ae]), h.useEffect(function() {
    return St.current = !0, function() {
      St.current = !1;
    };
  }, []);
  var Et = CC(), Qt = Et.registerPath, Ht = Et.unregisterPath, Jt = Et.refreshOverflowKeys, At = Et.isSubPathKey, cn = Et.getKeyPath, Pt = Et.getKeys, Sn = Et.getSubPathKeys, le = h.useMemo(function() {
    return {
      registerPath: Qt,
      unregisterPath: Ht
    };
  }, [Qt, Ht]), ve = h.useMemo(function() {
    return {
      isSubPathKey: At
    };
  }, [At]);
  h.useEffect(function() {
    Jt(Ft ? ur : te.slice(Zt + 1).map(function(Qe) {
      return Qe.key;
    }));
  }, [Zt, Ft]);
  var Me = gi(k || I && ((n = te[0]) === null || n === void 0 ? void 0 : n.key), {
    value: k
  }), Oe = ae(Me, 2), Ye = Oe[0], qt = Oe[1], Lt = go(function(Qe) {
    qt(Qe);
  }), dn = go(function() {
    qt(void 0);
  });
  Mc(t, function() {
    return {
      list: Ie.current,
      focus: function(Le) {
        var We, Rt = Pt(), Mt = xs(Rt, Xe), zn = Mt.elements, Fn = Mt.key2element, Zr = Mt.element2key, wr = bu(Ie.current, zn), or = Ye != null ? Ye : wr[0] ? Zr.get(wr[0]) : (We = te.find(function(ar) {
          return !ar.props.disabled;
        })) === null || We === void 0 ? void 0 : We.key, En = Fn.get(or);
        if (or && En) {
          var ir;
          En == null || (ir = En.focus) === null || ir === void 0 || ir.call(En, Le);
        }
      }
    };
  });
  var en = gi($ || [], {
    value: T,
    // Legacy convert key to array
    postState: function(Le) {
      return Array.isArray(Le) ? Le : Le == null ? ur : [Le];
    }
  }), fn = ae(en, 2), _t = fn[0], tn = fn[1], yr = function(Le) {
    if (A) {
      var We = Le.key, Rt = _t.includes(We), Mt;
      N ? Rt ? Mt = _t.filter(function(Fn) {
        return Fn !== We;
      }) : Mt = [].concat(xn(_t), [We]) : Mt = [We], tn(Mt);
      var zn = re(re({}, Le), {}, {
        selectedKeys: Mt
      });
      Rt ? B == null || B(zn) : z == null || z(zn);
    }
    !N && Ae.length && ue !== "inline" && Ke(ur);
  }, br = go(function(Qe) {
    G == null || G(Fi(Qe)), yr(Qe);
  }), Wt = go(function(Qe, Le) {
    var We = Ae.filter(function(Mt) {
      return Mt !== Qe;
    });
    if (Le)
      We.push(Qe);
    else if (ue !== "inline") {
      var Rt = Sn(Qe);
      We = We.filter(function(Mt) {
        return !Rt.has(Mt);
      });
    }
    hp(Ae, We, !0) || Ke(We, !0);
  }), Bt = function(Le, We) {
    var Rt = We != null ? We : !Ae.includes(Le);
    Wt(Le, Rt);
  }, Ln = bC(ue, Ye, Je, Xe, Ie, Pt, cn, qt, Bt, X);
  h.useEffect(function() {
    ze(!0);
  }, []);
  var $n = h.useMemo(function() {
    return {
      _internalRenderMenuItem: oe,
      _internalRenderSubMenuItem: ee
    };
  }, [oe, ee]), Ut = ue !== "horizontal" || b ? te : (
    // Need wrap for overflow dropdown that do not response for open
    te.map(function(Qe, Le) {
      return (
        // Always wrap provider to avoid sub node re-mount
        /* @__PURE__ */ h.createElement(Do, {
          key: Qe.key,
          overflowDisabled: Le > Zt
        }, Qe)
      );
    })
  ), Xr = /* @__PURE__ */ h.createElement(Dn, $e({
    id: g,
    ref: Ie,
    prefixCls: "".concat(i, "-overflow"),
    component: "ul",
    itemComponent: ha,
    className: it(i, "".concat(i, "-root"), "".concat(i, "-").concat(ue), l, xe(xe({}, "".concat(i, "-inline-collapsed"), Ve), "".concat(i, "-rtl"), Je), a),
    dir: m,
    style: s,
    role: "menu",
    tabIndex: f,
    data: Ut,
    renderRawItem: function(Le) {
      return Le;
    },
    renderRawRest: function(Le) {
      var We = Le.length, Rt = We ? te.slice(-We) : null;
      return /* @__PURE__ */ h.createElement(ma, {
        eventKey: Cs,
        title: D,
        disabled: Ft,
        internalPopupClose: We === 0,
        popupClassName: O
      }, Rt);
    },
    maxCount: ue !== "horizontal" || b ? Dn.INVALIDATE : Dn.RESPONSIVE,
    ssr: "full",
    "data-menu-list": !0,
    onVisibleChange: function(Le) {
      An(Le);
    },
    onKeyDown: Ln
  }, be));
  return /* @__PURE__ */ h.createElement(yu.Provider, {
    value: $n
  }, /* @__PURE__ */ h.createElement(mp.Provider, {
    value: Xe
  }, /* @__PURE__ */ h.createElement(Do, {
    prefixCls: i,
    rootClassName: a,
    mode: ue,
    openKeys: Ae,
    rtl: Je,
    disabled: p,
    motion: Ge ? U : null,
    defaultMotions: Ge ? V : null,
    activeKey: Ye,
    onActive: Lt,
    onInactive: dn,
    selectedKeys: _t,
    inlineIndent: Y,
    subMenuOpenDelay: x,
    subMenuCloseDelay: E,
    forceSubMenuRender: M,
    builtinPlacements: ge,
    triggerSubMenuAction: se,
    getPopupContainer: F,
    itemIcon: j,
    expandIcon: q,
    onItemClick: br,
    onOpenChange: Wt
  }, /* @__PURE__ */ h.createElement(xp.Provider, {
    value: ve
  }, Xr), /* @__PURE__ */ h.createElement("div", {
    style: {
      display: "none"
    },
    "aria-hidden": !0
  }, /* @__PURE__ */ h.createElement(bp.Provider, {
    value: le
  }, He)))));
}), qo = UC;
qo.Item = ha;
qo.SubMenu = ma;
qo.ItemGroup = Eu;
qo.Divider = Pp;
function Np(e) {
  var P, k;
  const {
    children: t,
    className: n,
    asChild: r = !0,
    title: o,
    placement: i = "bottom",
    showIfEllipsis: a = !1,
    visible: s,
    onVisibleChange: l
  } = e, [c, f] = De(!1), u = s !== void 0, y = u ? s : c, m = ye(null), g = ye(null), w = ye(null), [d, v] = De(null), [p, b] = De(i);
  function C(I) {
    return Math.abs(I.scrollWidth - I.clientWidth) > 1;
  }
  function x() {
    u ? l == null || l(!0) : f(!0);
  }
  function S() {
    u ? l == null || l(!1) : f(!1);
  }
  Bi(() => {
    if (!y) return;
    const I = m.current, H = g.current;
    if (!I || !H) return;
    const A = I.getBoundingClientRect(), L = H.getBoundingClientRect(), N = 8, $ = window.innerWidth, T = window.innerHeight, z = [i, "bottom", "top", "right", "left"];
    let B = i, W = 0, Y = 0;
    const U = (V) => {
      let Z = 0, se = 0;
      return V === "bottom" ? (Z = A.bottom + N, se = A.left + A.width / 2 - L.width / 2) : V === "top" ? (Z = A.top - L.height - N, se = A.left + A.width / 2 - L.width / 2) : V === "left" ? (Z = A.top + A.height / 2 - L.height / 2, se = A.left - L.width - N) : (Z = A.top + A.height / 2 - L.height / 2, se = A.right + N), { t: Z, l: se };
    };
    for (const V of z) {
      const { t: Z, l: se } = U(V), ge = se >= 0 && se + L.width <= $, j = Z >= 0 && Z + L.height <= T;
      if (ge && j) {
        B = V, W = Z, Y = se;
        break;
      }
    }
    if (!W && !Y) {
      const V = U(i);
      W = Math.min(Math.max(0, V.t), T - L.height), Y = Math.min(Math.max(0, V.l), $ - L.width);
    }
    b(B), v({ top: Math.round(W + window.scrollY), left: Math.round(Y + window.scrollX) });
  }, [y, i]), qe(() => {
    if (!y) return;
    const I = () => {
      if (!m.current || !g.current) return;
      const H = m.current.getBoundingClientRect(), A = g.current.getBoundingClientRect(), L = 8;
      let N = 0, $ = 0;
      p === "bottom" ? (N = H.bottom + L, $ = H.left + H.width / 2 - A.width / 2) : p === "top" ? (N = H.top - A.height - L, $ = H.left + H.width / 2 - A.width / 2) : p === "left" ? (N = H.top + H.height / 2 - A.height / 2, $ = H.left - A.width - L) : (N = H.top + H.height / 2 - A.height / 2, $ = H.right + L), v({ top: Math.round(N + window.scrollY), left: Math.round($ + window.scrollX) });
    };
    return window.addEventListener("scroll", I, !0), window.addEventListener("resize", I), () => {
      window.removeEventListener("scroll", I, !0), window.removeEventListener("resize", I);
    };
  }, [y, p]);
  const E = {
    ref: (I) => m.current = I,
    onMouseEnter: () => {
      a && m.current && !C(m.current) || x();
    },
    onMouseLeave: () => S(),
    onFocus: () => x(),
    onBlur: () => S()
  }, M = r ? /* @__PURE__ */ R("span", { ...E, className: "univer-inline-block univer-max-w-full univer-truncate", children: t }) : /* @__PURE__ */ R("button", { type: "button", ...E, children: t });
  let _ = null;
  return typeof document < "u" && y && o && document.body && (_ = _o(
    /* @__PURE__ */ me(
      "div",
      {
        ref: g,
        role: "tooltip",
        className: ie("univer-animate-in univer-fade-in-0 univer-zoom-in-95 univer-pointer-events-auto univer-absolute univer-z-[1081] univer-box-border univer-w-fit univer-max-w-sm univer-text-balance univer-rounded-lg univer-bg-gray-700 univer-px-2.5 univer-py-2 univer-text-xs univer-font-medium univer-text-white univer-shadow-lg univer-drop-shadow-sm dark:!univer-bg-gray-100 dark:!univer-text-gray-900", n),
        style: {
          top: (P = d == null ? void 0 : d.top) != null ? P : -9999,
          left: (k = d == null ? void 0 : d.left) != null ? k : -9999
        },
        onMouseEnter: () => x(),
        onMouseLeave: () => S(),
        children: [
          /* @__PURE__ */ R("div", { className: "univer-break-words", children: o }),
          /* @__PURE__ */ R(
            "div",
            {
              ref: w,
              className: "univer-absolute univer-size-2.5 univer-rotate-45 univer-rounded-sm univer-bg-gray-700 dark:!univer-bg-gray-100",
              style: {
                // position arrow based on placement
                ...p === "bottom" && { top: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" },
                ...p === "top" && { bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" },
                ...p === "left" && { right: -5, top: "50%", transform: "translateY(-50%) rotate(45deg)" },
                ...p === "right" && { left: -5, top: "50%", transform: "translateY(-50%) rotate(45deg)" }
              }
            }
          )
        ]
      }
    ),
    document.body
  )), /* @__PURE__ */ me(dr, { children: [
    M,
    _
  ] });
}
const AE = Ue((e, t) => {
  const { mountContainer: n } = Jn(Tn), { wrapperClass: r, ...o } = e;
  return n && /* @__PURE__ */ R(
    qo,
    {
      ref: t,
      prefixCls: ie("univer-menu", e.className),
      getPopupContainer: () => n,
      ...o,
      className: r
    }
  );
});
function LE(e) {
  return /* @__PURE__ */ R(ha, { ...e });
}
function $E(e) {
  return /* @__PURE__ */ R(ma, { ...e });
}
function zE(e) {
  return /* @__PURE__ */ R(Eu, { ...e });
}
function FE({ items: e }) {
  return /* @__PURE__ */ R(
    "div",
    {
      className: "univer-menu-item-group univer-flex univer-flex-wrap univer-gap-2.5 univer-p-1 univer-pl-0 univer-pr-0",
      children: e.map((t) => {
        const n = /* @__PURE__ */ R(
          "div",
          {
            className: ie("univer-flex univer-size-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-md hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-900", {
              "univer-bg-gray-50 dark:!univer-bg-gray-900": t.active
            }, t.className),
            onClick: () => t.onClick(),
            children: /* @__PURE__ */ R(
              t.Icon,
              {
                className: "univer-size-4 univer-text-gray-900 dark:!univer-text-gray-200"
              }
            )
          },
          t.key
        );
        return t.tooltip ? /* @__PURE__ */ R(Np, { title: t.tooltip, children: n }, t.key) : n;
      })
    }
  );
}
var GC = /* @__PURE__ */ ((e) => (e.Success = "success", e.Info = "info", e.Warning = "warning", e.Error = "error", e.Loading = "loading", e))(GC || {});
const KC = {
  success: /* @__PURE__ */ R($c, { className: "univer-text-green-500" }),
  info: /* @__PURE__ */ R(
    Tc,
    {
      className: "univer-text-indigo-600 dark:!univer-text-primary-500"
    }
  ),
  warning: /* @__PURE__ */ R(zc, { className: "univer-text-yellow-400" }),
  error: /* @__PURE__ */ R(kc, { className: "univer-text-red-500" }),
  loading: /* @__PURE__ */ R(Wc, { className: "univer-animate-spin univer-text-yellow-400" })
}, YC = ({
  content: e,
  type: t = "info"
  /* Info */
}) => {
  const n = lt(() => KC[t], [t]);
  return /* @__PURE__ */ R(
    "div",
    {
      className: ie(
        `
                  univer-animate-in univer-fade-in univer-slide-in-from-top-4 univer-min-w-[320px] univer-max-w-[480px]
                  univer-rounded-xl univer-border univer-border-solid univer-border-gray-200 univer-bg-white univer-p-4
                  univer-font-sans univer-shadow-md univer-transition-all univer-duration-300
                  dark:!univer-border-gray-600 dark:!univer-bg-gray-700
                `
      ),
      children: /* @__PURE__ */ me("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ R("span", { className: "[&>svg]:univer-relative [&>svg]:univer-top-0.5 [&>svg]:univer-block", children: n }),
        /* @__PURE__ */ R(
          "p",
          {
            className: "univer-m-0 univer-text-sm univer-text-gray-500 univer-opacity-90 dark:!univer-text-gray-400",
            children: e
          }
        )
      ] })
    }
  );
};
let XC = 0;
const ZC = /* @__PURE__ */ (() => {
  let e = () => {
  }, t = () => {
  };
  return {
    Messager: () => {
      if (!Is()) return null;
      const [r, o] = De({ messages: [] });
      return t = (i) => {
        i || o({
          messages: []
        }), o((a) => ({
          messages: a.messages.filter((s) => s.id !== i)
        }));
      }, qe(() => {
        const i = [];
        return e = (a) => {
          const s = String(XC++);
          if (o((l) => ({
            messages: [...l.messages, { ...a, id: s }]
          })), a.duration !== 1 / 0) {
            const l = window.setTimeout(() => {
              o((c) => ({
                messages: c.messages.filter((f) => f.id !== s)
              }));
            }, a.duration || 3e3);
            i.push(l);
          }
        }, () => {
          i.forEach((a) => {
            window.clearTimeout(a);
          });
        };
      }, []), _o(
        /* @__PURE__ */ R(
          "div",
          {
            className: "univer-fixed univer-left-1/2 univer-top-4 univer-z-50 univer-flex -univer-translate-x-1/2 univer-flex-col univer-items-center univer-gap-1",
            children: r.messages.map((i, a) => /* @__PURE__ */ R(
              "div",
              {
                style: {
                  position: "relative",
                  top: `${a * 4}px`,
                  zIndex: 50 - a
                },
                children: /* @__PURE__ */ R(YC, { ...i, onClose: () => t(i.id) })
              },
              i.id
            ))
          }
        ),
        document.body
      );
    },
    message: (r) => e(r),
    removeMessage: t
  };
})(), { Messager: HE, message: WE, removeMessage: BE } = ZC;
function Dp(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ki(e, t);
}
function QC(e, t) {
  return e.classList ? !!t && e.classList.contains(t) : (" " + (e.className.baseVal || e.className) + " ").indexOf(" " + t + " ") !== -1;
}
function JC(e, t) {
  e.classList ? e.classList.add(t) : QC(e, t) || (typeof e.className == "string" ? e.className = e.className + " " + t : e.setAttribute("class", (e.className && e.className.baseVal || "") + " " + t));
}
function pc(e, t) {
  return e.replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
}
function eS(e, t) {
  e.classList ? e.classList.remove(t) : typeof e.className == "string" ? e.className = pc(e.className, t) : e.setAttribute("class", pc(e.className && e.className.baseVal || "", t));
}
const hc = {
  disabled: !1
}, _p = K.createContext(null);
var Op = function(t) {
  return t.scrollTop;
}, yo = "unmounted", lr = "exited", cr = "entering", _r = "entered", Es = "exiting", In = /* @__PURE__ */ (function(e) {
  Dp(t, e);
  function t(r, o) {
    var i;
    i = e.call(this, r, o) || this;
    var a = o, s = a && !a.isMounting ? r.enter : r.appear, l;
    return i.appearStatus = null, r.in ? s ? (l = lr, i.appearStatus = cr) : l = _r : r.unmountOnExit || r.mountOnEnter ? l = yo : l = lr, i.state = {
      status: l
    }, i.nextCallback = null, i;
  }
  t.getDerivedStateFromProps = function(o, i) {
    var a = o.in;
    return a && i.status === yo ? {
      status: lr
    } : null;
  };
  var n = t.prototype;
  return n.componentDidMount = function() {
    this.updateStatus(!0, this.appearStatus);
  }, n.componentDidUpdate = function(o) {
    var i = null;
    if (o !== this.props) {
      var a = this.state.status;
      this.props.in ? a !== cr && a !== _r && (i = cr) : (a === cr || a === _r) && (i = Es);
    }
    this.updateStatus(!1, i);
  }, n.componentWillUnmount = function() {
    this.cancelNextCallback();
  }, n.getTimeouts = function() {
    var o = this.props.timeout, i, a, s;
    return i = a = s = o, o != null && typeof o != "number" && (i = o.exit, a = o.enter, s = o.appear !== void 0 ? o.appear : a), {
      exit: i,
      enter: a,
      appear: s
    };
  }, n.updateStatus = function(o, i) {
    if (o === void 0 && (o = !1), i !== null)
      if (this.cancelNextCallback(), i === cr) {
        if (this.props.unmountOnExit || this.props.mountOnEnter) {
          var a = this.props.nodeRef ? this.props.nodeRef.current : rn.findDOMNode(this);
          a && Op(a);
        }
        this.performEnter(o);
      } else
        this.performExit();
    else this.props.unmountOnExit && this.state.status === lr && this.setState({
      status: yo
    });
  }, n.performEnter = function(o) {
    var i = this, a = this.props.enter, s = this.context ? this.context.isMounting : o, l = this.props.nodeRef ? [s] : [rn.findDOMNode(this), s], c = l[0], f = l[1], u = this.getTimeouts(), y = s ? u.appear : u.enter;
    if (!o && !a || hc.disabled) {
      this.safeSetState({
        status: _r
      }, function() {
        i.props.onEntered(c);
      });
      return;
    }
    this.props.onEnter(c, f), this.safeSetState({
      status: cr
    }, function() {
      i.props.onEntering(c, f), i.onTransitionEnd(y, function() {
        i.safeSetState({
          status: _r
        }, function() {
          i.props.onEntered(c, f);
        });
      });
    });
  }, n.performExit = function() {
    var o = this, i = this.props.exit, a = this.getTimeouts(), s = this.props.nodeRef ? void 0 : rn.findDOMNode(this);
    if (!i || hc.disabled) {
      this.safeSetState({
        status: lr
      }, function() {
        o.props.onExited(s);
      });
      return;
    }
    this.props.onExit(s), this.safeSetState({
      status: Es
    }, function() {
      o.props.onExiting(s), o.onTransitionEnd(a.exit, function() {
        o.safeSetState({
          status: lr
        }, function() {
          o.props.onExited(s);
        });
      });
    });
  }, n.cancelNextCallback = function() {
    this.nextCallback !== null && (this.nextCallback.cancel(), this.nextCallback = null);
  }, n.safeSetState = function(o, i) {
    i = this.setNextCallback(i), this.setState(o, i);
  }, n.setNextCallback = function(o) {
    var i = this, a = !0;
    return this.nextCallback = function(s) {
      a && (a = !1, i.nextCallback = null, o(s));
    }, this.nextCallback.cancel = function() {
      a = !1;
    }, this.nextCallback;
  }, n.onTransitionEnd = function(o, i) {
    this.setNextCallback(i);
    var a = this.props.nodeRef ? this.props.nodeRef.current : rn.findDOMNode(this), s = o == null && !this.props.addEndListener;
    if (!a || s) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var l = this.props.nodeRef ? [this.nextCallback] : [a, this.nextCallback], c = l[0], f = l[1];
      this.props.addEndListener(c, f);
    }
    o != null && setTimeout(this.nextCallback, o);
  }, n.render = function() {
    var o = this.state.status;
    if (o === yo)
      return null;
    var i = this.props, a = i.children;
    i.in, i.mountOnEnter, i.unmountOnExit, i.appear, i.enter, i.exit, i.timeout, i.addEndListener, i.onEnter, i.onEntering, i.onEntered, i.onExit, i.onExiting, i.onExited, i.nodeRef;
    var s = ou(i, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return (
      // allows for nested Transitions
      /* @__PURE__ */ K.createElement(_p.Provider, {
        value: null
      }, typeof a == "function" ? a(o, s) : K.cloneElement(K.Children.only(a), s))
    );
  }, t;
})(K.Component);
In.contextType = _p;
In.propTypes = {};
function Dr() {
}
In.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: Dr,
  onEntering: Dr,
  onEntered: Dr,
  onExit: Dr,
  onExiting: Dr,
  onExited: Dr
};
In.UNMOUNTED = yo;
In.EXITED = lr;
In.ENTERING = cr;
In.ENTERED = _r;
In.EXITING = Es;
var tS = function(t, n) {
  return t && n && n.split(" ").forEach(function(r) {
    return JC(t, r);
  });
}, Ga = function(t, n) {
  return t && n && n.split(" ").forEach(function(r) {
    return eS(t, r);
  });
}, Ru = /* @__PURE__ */ (function(e) {
  Dp(t, e);
  function t() {
    for (var r, o = arguments.length, i = new Array(o), a = 0; a < o; a++)
      i[a] = arguments[a];
    return r = e.call.apply(e, [this].concat(i)) || this, r.appliedClasses = {
      appear: {},
      enter: {},
      exit: {}
    }, r.onEnter = function(s, l) {
      var c = r.resolveArguments(s, l), f = c[0], u = c[1];
      r.removeClasses(f, "exit"), r.addClass(f, u ? "appear" : "enter", "base"), r.props.onEnter && r.props.onEnter(s, l);
    }, r.onEntering = function(s, l) {
      var c = r.resolveArguments(s, l), f = c[0], u = c[1], y = u ? "appear" : "enter";
      r.addClass(f, y, "active"), r.props.onEntering && r.props.onEntering(s, l);
    }, r.onEntered = function(s, l) {
      var c = r.resolveArguments(s, l), f = c[0], u = c[1], y = u ? "appear" : "enter";
      r.removeClasses(f, y), r.addClass(f, y, "done"), r.props.onEntered && r.props.onEntered(s, l);
    }, r.onExit = function(s) {
      var l = r.resolveArguments(s), c = l[0];
      r.removeClasses(c, "appear"), r.removeClasses(c, "enter"), r.addClass(c, "exit", "base"), r.props.onExit && r.props.onExit(s);
    }, r.onExiting = function(s) {
      var l = r.resolveArguments(s), c = l[0];
      r.addClass(c, "exit", "active"), r.props.onExiting && r.props.onExiting(s);
    }, r.onExited = function(s) {
      var l = r.resolveArguments(s), c = l[0];
      r.removeClasses(c, "exit"), r.addClass(c, "exit", "done"), r.props.onExited && r.props.onExited(s);
    }, r.resolveArguments = function(s, l) {
      return r.props.nodeRef ? [r.props.nodeRef.current, s] : [s, l];
    }, r.getClassNames = function(s) {
      var l = r.props.classNames, c = typeof l == "string", f = c && l ? l + "-" : "", u = c ? "" + f + s : l[s], y = c ? u + "-active" : l[s + "Active"], m = c ? u + "-done" : l[s + "Done"];
      return {
        baseClassName: u,
        activeClassName: y,
        doneClassName: m
      };
    }, r;
  }
  var n = t.prototype;
  return n.addClass = function(o, i, a) {
    var s = this.getClassNames(i)[a + "ClassName"], l = this.getClassNames("enter"), c = l.doneClassName;
    i === "appear" && a === "done" && c && (s += " " + c), a === "active" && o && Op(o), s && (this.appliedClasses[i][a] = s, tS(o, s));
  }, n.removeClasses = function(o, i) {
    var a = this.appliedClasses[i], s = a.base, l = a.active, c = a.done;
    this.appliedClasses[i] = {}, s && Ga(o, s), l && Ga(o, l), c && Ga(o, c);
  }, n.render = function() {
    var o = this.props;
    o.classNames;
    var i = ou(o, ["classNames"]);
    return /* @__PURE__ */ K.createElement(In, $e({}, i, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  }, t;
})(K.Component);
Ru.defaultProps = {
  classNames: ""
};
Ru.propTypes = {};
function jE(e) {
  const { children: t, visible: n = !1, offset: r = [0, 0] } = e, o = ye(null), [i, a] = De(r), { mountContainer: s } = Jn(Tn);
  qe(() => {
    if (!n) {
      a([-9999, -9999]);
      return;
    }
    const [c, f] = r, { clientWidth: u, clientHeight: y } = o.current, { innerWidth: m, innerHeight: g } = window, w = c + u > m ? m - u : c, d = f + y > g ? g - y : f;
    a([w, d]);
  }, [r, n]);
  function l(c) {
    c.preventDefault();
  }
  return _o(
    /* @__PURE__ */ R(
      Ru,
      {
        in: n,
        nodeRef: o,
        timeout: 500,
        classNames: {
          enter: "univer-popup-enter",
          enterActive: "univer-popup-enter-active",
          enterDone: "univer-popup-enter-done",
          exitActive: "univer-popup-exit",
          exitDone: "univer-popup-exit-active"
        },
        children: /* @__PURE__ */ R(
          "section",
          {
            ref: o,
            className: "univer-popup",
            style: {
              // Fix #1089. If the popup does not have this 2px offset, the pointerup event's target would
              // become the popup itself not the canvas element, hence the selection gesture is not terminated.
              // It should be considered as debt of the rendering engine.
              left: i[0] + 2,
              top: i[1] + 2
            },
            onContextMenu: l,
            children: t
          }
        )
      }
    ),
    s
  );
}
function VE(e) {
  const { children: t, className: n, style: r, value: o, disabled: i = !1, direction: a = "horizontal", onChange: s } = e, l = (c) => {
    s(c);
  };
  return /* @__PURE__ */ R(
    "div",
    {
      className: ie("univer-flex univer-gap-2", {
        "univer-flex-col": a === "vertical"
      }, n),
      style: r,
      children: wi.map(t, (c, f) => Ds(c) ? Ns(c, {
        key: f,
        children: c.props.children,
        value: c.props.value,
        checked: o === c.props.value,
        disabled: i != null ? i : c.props.disabled,
        onChange: l
      }) : c)
    }
  );
}
function qE(e) {
  const { children: t, checked: n, value: r, disabled: o = !1, onChange: i } = e, a = ye(null);
  function s(l) {
    var c;
    if (l.stopPropagation(), !(!i || o))
      if (typeof r < "u")
        i && i(r);
      else {
        const f = (c = a == null ? void 0 : a.current) == null ? void 0 : c.checked;
        i && i(f);
      }
  }
  return /* @__PURE__ */ me(
    "label",
    {
      "data-u-comp": "radio",
      className: ie("univer-box-border univer-inline-flex univer-items-center univer-gap-2 univer-text-sm", {
        "univer-cursor-pointer univer-text-gray-900 dark:!univer-text-white": !o,
        "univer-text-gray-400": o
      }),
      children: [
        /* @__PURE__ */ me("span", { className: "univer-relative univer-block", children: [
          /* @__PURE__ */ R(
            "input",
            {
              ref: a,
              className: "univer-absolute univer-size-0 univer-opacity-0",
              type: "radio",
              checked: n,
              disabled: o,
              onChange: s
            }
          ),
          /* @__PURE__ */ R(
            "span",
            {
              className: ie("univer-relative univer-box-border univer-flex univer-size-4 univer-items-center univer-justify-center univer-overflow-hidden univer-rounded-full univer-border univer-border-solid univer-transition-colors", {
                "univer-opacity-50": o,
                "univer-border-primary-600 univer-bg-primary-600 dark:!univer-bg-primary-600": n,
                "univer-border-gray-300 univer-bg-gray-50 dark:!univer-border-gray-500 dark:!univer-bg-gray-600": !n
              }),
              children: n && /* @__PURE__ */ R(
                "span",
                {
                  className: "univer-absolute univer-left-1/2 univer-top-1/2 univer-block univer-size-2 -univer-translate-x-1/2 -univer-translate-y-1/2 univer-rounded-full univer-bg-white"
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ R("span", { children: t })
      ]
    }
  );
}
function UE({
  items: e,
  value: t,
  defaultValue: n,
  onChange: r,
  className: o = ""
}) {
  const [i, a] = De(
    t !== void 0 ? t : n || e[0].value
  ), [s, l] = De({}), c = ye(/* @__PURE__ */ new Map()), f = ye(null);
  qe(() => {
    t !== void 0 && t !== i && a(t);
  }, [t]);
  const u = (m, g) => {
    const w = c.current.get(m), d = g ? c.current.get(g) : null;
    if (w && f.current) {
      const v = f.current.getBoundingClientRect(), p = w.getBoundingClientRect(), b = p.left - v.left - 4;
      if (d) {
        const x = d.getBoundingClientRect().left - v.left - 4;
        l({
          "--slide-from": `${x}px`,
          "--slide-to": `${b}px`,
          width: `${p.width}px`,
          transform: `translateX(${b}px)`
        });
      } else
        l({
          width: `${p.width}px`,
          transform: `translateX(${b}px)`
        });
    }
  };
  qe(() => {
    u(i);
  }, [i]);
  const y = (m) => {
    const g = i;
    a(m), r == null || r(m), u(m, g);
  };
  return /* @__PURE__ */ me(
    "div",
    {
      "data-u-comp": "segmented",
      ref: f,
      className: ie("univer-relative univer-box-border univer-flex univer-gap-4 univer-rounded-lg univer-bg-gray-100 univer-p-1 dark:!univer-bg-gray-800", o),
      children: [
        /* @__PURE__ */ R(
          "div",
          {
            className: "univer-animate-univer-slide univer-absolute univer-h-6 univer-rounded-md univer-bg-white univer-shadow-sm univer-transition-all univer-duration-200 dark:!univer-bg-gray-700 dark:!univer-text-gray-400",
            style: s
          }
        ),
        e.map((m) => /* @__PURE__ */ R(
          "button",
          {
            ref: (g) => {
              g && c.current.set(m.value, g);
            },
            className: ie("univer-relative univer-box-border univer-flex-1 univer-cursor-pointer univer-border-none univer-bg-transparent univer-px-3 univer-py-1 univer-text-xs univer-font-medium univer-transition-colors", {
              "univer-text-gray-900 dark:!univer-text-white": i === m.value,
              "univer-text-gray-500 hover:univer-text-gray-900 dark:hover:!univer-text-white": i !== m.value
            }),
            type: "button",
            onClick: () => y(m.value),
            children: m.label
          },
          String(m.value)
        ))
      ]
    }
  );
}
function GE(e) {
  const { value: t, options: n = [], hideCheckMark: r = !1, onChange: o, multiple: i, className: a, optionClassName: s } = e, l = Array.isArray(t) ? t : [t];
  function c(f) {
    const u = l.indexOf(f);
    i ? u > -1 ? o(l.filter((y) => y === f)) : o([...l, f]) : u > -1 ? o(void 0) : o(f);
  }
  return /* @__PURE__ */ R(
    "ul",
    {
      className: ie("univer-m-0 univer-grid univer-max-h-80 univer-list-none univer-gap-1 univer-overflow-y-auto univer-rounded univer-p-1.5", kt, vr, a),
      children: n.map((f, u) => {
        const y = l.indexOf(f.value) > -1;
        return /* @__PURE__ */ R("li", { children: /* @__PURE__ */ me(
          "a",
          {
            className: ie("univer-relative univer-block univer-cursor-pointer univer-select-none univer-rounded univer-py-1.5 univer-pl-8 univer-pr-2 univer-text-sm univer-text-gray-900 univer-transition-colors hover:univer-bg-gray-100 dark:!univer-text-white dark:hover:!univer-bg-gray-600", s, {
              "univer-bg-gray-200 dark:!univer-bg-gray-500": y
            }),
            onClick: () => c(f.value),
            children: [
              !r && y && /* @__PURE__ */ R(
                Hr,
                {
                  className: "univer-absolute univer-left-0 univer-top-1/2 -univer-translate-y-1/2 univer-pl-2 univer-text-primary-600"
                }
              ),
              /* @__PURE__ */ R("span", { style: { color: f.color }, children: f.label })
            ]
          }
        ) }, u);
      })
    }
  );
}
const kp = ie("univer-box-border univer-inline-flex univer-h-8 univer-min-w-36 univer-items-center univer-justify-between univer-gap-2 univer-rounded-lg univer-bg-white univer-px-2.5 univer-transition-colors univer-duration-200 dark:!univer-bg-gray-700 dark:!univer-text-white", kt);
function KE(e) {
  const {
    className: t,
    value: n,
    disabled: r = !1,
    options: o = [],
    borderless: i = !1,
    onChange: a
  } = e, [s, l] = De(!1);
  function c(y) {
    l(y);
  }
  const f = lt(() => {
    const y = [];
    for (const m of o)
      m.options ? (m.options.forEach((g) => {
        y.push({
          label: g.label,
          value: g.value,
          disabled: g.disabled
        });
      }), y.push({
        type: "separator"
      })) : y.push({
        label: m.label,
        value: m.value,
        disabled: m.disabled
      });
    return [{
      type: "radio",
      value: n,
      hideIndicator: !0,
      options: y,
      onSelect: (m) => {
        a(m);
      }
    }];
  }, [o]), u = lt(() => {
    let y = null;
    for (const m of o)
      if (m.options) {
        for (const g of m.options)
          if (g.value === n) {
            y = g.label;
            break;
          }
      } else if (m.value === n) {
        y = m.label;
        break;
      }
    return y || n;
  }, [o, n]);
  return /* @__PURE__ */ R(
    rp,
    {
      className: "max-h univer-w-[var(--radix-popper-anchor-width)] univer-min-w-36",
      align: "start",
      open: s,
      items: f,
      disabled: r,
      onOpenChange: c,
      children: /* @__PURE__ */ me(
        "div",
        {
          "data-u-comp": "select",
          className: ie(kp, {
            "univer-border-primary-600 univer-outline-none univer-ring-2 univer-ring-primary-50 dark:!univer-ring-primary-900": s && !i,
            "univer-border-transparent univer-bg-transparent hover:univer-border-transparent": i,
            "univer-cursor-not-allowed": r,
            "hover:univer-border-primary-600": !r && !i,
            "univer-cursor-pointer": !r && !s
          }, t),
          children: [
            /* @__PURE__ */ R(
              "div",
              {
                className: "univer-flex-1 univer-truncate univer-text-sm univer-text-gray-500 dark:!univer-text-white",
                children: u
              }
            ),
            /* @__PURE__ */ R(
              Os,
              {
                className: "univer-flex-shrink-0 dark:!univer-text-white"
              }
            )
          ]
        }
      )
    }
  );
}
function YE(e) {
  const {
    className: t,
    value: n = [],
    disabled: r = !1,
    options: o = [],
    borderless: i = !1,
    onChange: a
  } = e, [s, l] = De(!1);
  function c(m) {
    l(m);
  }
  const f = lt(() => o.map((m) => ({
    type: "checkbox",
    value: m.value,
    label: m.label,
    disabled: m.disabled,
    checked: n.includes(m.value),
    onSelect: (g) => {
      const w = n.includes(g) ? n.filter((d) => d !== g) : [...n, g];
      a(w);
    }
  })), [o]);
  function u(m) {
    const g = n.filter((w) => w !== m);
    a(g);
  }
  const y = lt(() => o.filter((m) => n.includes(m.value)).map((m, g) => /* @__PURE__ */ R(
    Bh,
    {
      className: "univer-max-w-32",
      closable: !0,
      onClose: () => u(m.value),
      children: m.label
    },
    g
  )), [o, n]);
  return /* @__PURE__ */ R(
    rp,
    {
      className: "univer-w-[var(--radix-popper-anchor-width)] univer-min-w-36",
      align: "start",
      open: s,
      items: f,
      disabled: r,
      onOpenChange: c,
      children: /* @__PURE__ */ me(
        "div",
        {
          "data-u-comp": "multiple-select",
          className: ie(kp, {
            "univer-border-primary-600 univer-outline-none univer-ring-2 univer-ring-primary-50 dark:!univer-ring-primary-900": s && !i,
            "univer-border-transparent univer-bg-transparent hover:univer-border-transparent": i,
            "univer-cursor-not-allowed": r,
            "hover:univer-border-primary-600": !r && !i,
            "univer-cursor-pointer": !r && !s
          }, t),
          children: [
            /* @__PURE__ */ R(
              "div",
              {
                className: "univer-box-border univer-flex univer-w-[calc(100%-16px)] univer-gap-2 univer-pr-2",
                children: y
              }
            ),
            /* @__PURE__ */ R(
              Os,
              {
                className: "univer-flex-shrink-0 dark:!univer-text-white"
              }
            )
          ]
        }
      )
    }
  );
}
var nS = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], rS = nS.reduce((e, t) => {
  const n = /* @__PURE__ */ Xc(`Primitive.${t}`), r = h.forwardRef((o, i) => {
    const { asChild: a, ...s } = o, l = a ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ R(l, { ...s, ref: i });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {}), oS = "Separator", mc = "horizontal", iS = ["horizontal", "vertical"], Tp = h.forwardRef((e, t) => {
  const { decorative: n, orientation: r = mc, ...o } = e, i = aS(r) ? r : mc, s = n ? { role: "none" } : { "aria-orientation": i === "vertical" ? i : void 0, role: "separator" };
  return /* @__PURE__ */ R(
    rS.div,
    {
      "data-orientation": i,
      ...s,
      ...o,
      ref: t
    }
  );
});
Tp.displayName = oS;
function aS(e) {
  return iS.includes(e);
}
var sS = Tp;
function XE({
  className: e,
  orientation: t = "horizontal",
  decorative: n = !0,
  ...r
}) {
  return /* @__PURE__ */ R(
    sS,
    {
      "data-u-comp": "separator",
      "data-slot": "separator-root",
      decorative: n,
      orientation: t,
      className: ie(
        `
                  univer-shrink-0 univer-bg-gray-200
                  data-[orientation=horizontal]:univer-h-px data-[orientation=horizontal]:univer-w-full
                  data-[orientation=vertical]:univer-h-full data-[orientation=vertical]:univer-w-px
                  dark:!univer-bg-gray-600
                `,
        e
      ),
      ...r
    }
  );
}
const ZE = (e) => {
  const { defaultChecked: t = !1, onChange: n } = e, [r, o] = De(t), i = () => {
    o(!r), n == null || n(!r);
  };
  return qe(() => {
    o(t);
  }, [t]), /* @__PURE__ */ R("div", { className: "univer-h-4", children: /* @__PURE__ */ me("label", { className: "univer-relative univer-inline-block univer-h-4 univer-w-7", children: [
    /* @__PURE__ */ R(
      "input",
      {
        className: "univer-size-0 univer-opacity-0",
        type: "checkbox",
        checked: r,
        onChange: i
      }
    ),
    /* @__PURE__ */ R(
      "span",
      {
        className: ie("univer-absolute univer-inset-0 univer-cursor-pointer univer-rounded-2xl univer-transition-colors univer-duration-200", {
          "univer-bg-primary-600": r,
          "univer-bg-gray-200 dark:!univer-bg-gray-600": !r
        }),
        children: /* @__PURE__ */ R(
          "span",
          {
            className: ie("univer-absolute univer-bottom-0.5 univer-left-0.5 univer-h-3 univer-w-3 univer-rounded-full univer-bg-white univer-transition-transform univer-duration-200", {
              "univer-translate-x-3": r
            })
          }
        )
      }
    )
  ] }) });
}, QE = Ue((e, t) => {
  const n = ye(null), r = ye({ width: 0, height: 0 }), { className: o, onResize: i, onValueChange: a, ...s } = e;
  Mc(t, () => n.current, []), Bi(() => {
    const c = n.current;
    if (c && i) {
      const f = new ResizeObserver((u) => {
        const { width: y, height: m } = u[0].target.getBoundingClientRect();
        y === 0 || m === 0 || (r.current.width !== y || r.current.height !== m) && (r.current = { width: y, height: m }, i(y, m));
      });
      return f.observe(c), () => {
        f.unobserve(c), f.disconnect();
      };
    }
  }, [i]);
  function l(c) {
    const f = c.target.value;
    a == null || a(f);
  }
  return /* @__PURE__ */ R(
    "textarea",
    {
      ref: n,
      "data-u-comp": "textarea",
      "data-slot": "textarea",
      className: ie(
        `
                  univer-box-border univer-flex univer-w-full univer-resize univer-rounded-md univer-bg-transparent
                  univer-p-2 univer-text-base univer-text-gray-900 univer-outline-none
                  univer-transition-[color,box-shadow]
                  placeholder:univer-text-gray-200
                  disabled:univer-cursor-not-allowed disabled:univer-opacity-50
                  dark:!univer-text-white
                `,
        kt,
        vr,
        o
      ),
      onChange: l,
      ...s
    }
  );
});
function uS(e) {
  if (typeof document > "u") return;
  let t = document.head || document.getElementsByTagName("head")[0], n = document.createElement("style");
  n.type = "text/css", t.appendChild(n), n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e));
}
const lS = (e) => {
  switch (e) {
    case "success":
      return fS;
    case "info":
      return pS;
    case "warning":
      return vS;
    case "error":
      return hS;
    default:
      return null;
  }
}, cS = Array(12).fill(0), dS = ({ visible: e, className: t }) => /* @__PURE__ */ K.createElement("div", {
  className: [
    "sonner-loading-wrapper",
    t
  ].filter(Boolean).join(" "),
  "data-visible": e
}, /* @__PURE__ */ K.createElement("div", {
  className: "sonner-spinner"
}, cS.map((n, r) => /* @__PURE__ */ K.createElement("div", {
  className: "sonner-loading-bar",
  key: `spinner-bar-${r}`
})))), fS = /* @__PURE__ */ K.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ K.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
})), vS = /* @__PURE__ */ K.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ K.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
})), pS = /* @__PURE__ */ K.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ K.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
})), hS = /* @__PURE__ */ K.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ K.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
})), mS = /* @__PURE__ */ K.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /* @__PURE__ */ K.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ K.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})), gS = () => {
  const [e, t] = K.useState(document.hidden);
  return K.useEffect(() => {
    const n = () => {
      t(document.hidden);
    };
    return document.addEventListener("visibilitychange", n), () => window.removeEventListener("visibilitychange", n);
  }, []), e;
};
let Rs = 1;
class yS {
  constructor() {
    this.subscribe = (t) => (this.subscribers.push(t), () => {
      const n = this.subscribers.indexOf(t);
      this.subscribers.splice(n, 1);
    }), this.publish = (t) => {
      this.subscribers.forEach((n) => n(t));
    }, this.addToast = (t) => {
      this.publish(t), this.toasts = [
        ...this.toasts,
        t
      ];
    }, this.create = (t) => {
      var n;
      const { message: r, ...o } = t, i = typeof (t == null ? void 0 : t.id) == "number" || ((n = t.id) == null ? void 0 : n.length) > 0 ? t.id : Rs++, a = this.toasts.find((l) => l.id === i), s = t.dismissible === void 0 ? !0 : t.dismissible;
      return this.dismissedToasts.has(i) && this.dismissedToasts.delete(i), a ? this.toasts = this.toasts.map((l) => l.id === i ? (this.publish({
        ...l,
        ...t,
        id: i,
        title: r
      }), {
        ...l,
        ...t,
        id: i,
        dismissible: s,
        title: r
      }) : l) : this.addToast({
        title: r,
        ...o,
        dismissible: s,
        id: i
      }), i;
    }, this.dismiss = (t) => (t ? (this.dismissedToasts.add(t), requestAnimationFrame(() => this.subscribers.forEach((n) => n({
      id: t,
      dismiss: !0
    })))) : this.toasts.forEach((n) => {
      this.subscribers.forEach((r) => r({
        id: n.id,
        dismiss: !0
      }));
    }), t), this.message = (t, n) => this.create({
      ...n,
      message: t
    }), this.error = (t, n) => this.create({
      ...n,
      message: t,
      type: "error"
    }), this.success = (t, n) => this.create({
      ...n,
      type: "success",
      message: t
    }), this.info = (t, n) => this.create({
      ...n,
      type: "info",
      message: t
    }), this.warning = (t, n) => this.create({
      ...n,
      type: "warning",
      message: t
    }), this.loading = (t, n) => this.create({
      ...n,
      type: "loading",
      message: t
    }), this.promise = (t, n) => {
      if (!n)
        return;
      let r;
      n.loading !== void 0 && (r = this.create({
        ...n,
        promise: t,
        type: "loading",
        message: n.loading,
        description: typeof n.description != "function" ? n.description : void 0
      }));
      const o = Promise.resolve(t instanceof Function ? t() : t);
      let i = r !== void 0, a;
      const s = o.then(async (c) => {
        if (a = [
          "resolve",
          c
        ], K.isValidElement(c))
          i = !1, this.create({
            id: r,
            type: "default",
            message: c
          });
        else if (wS(c) && !c.ok) {
          i = !1;
          const u = typeof n.error == "function" ? await n.error(`HTTP error! status: ${c.status}`) : n.error, y = typeof n.description == "function" ? await n.description(`HTTP error! status: ${c.status}`) : n.description, g = typeof u == "object" && !K.isValidElement(u) ? u : {
            message: u
          };
          this.create({
            id: r,
            type: "error",
            description: y,
            ...g
          });
        } else if (c instanceof Error) {
          i = !1;
          const u = typeof n.error == "function" ? await n.error(c) : n.error, y = typeof n.description == "function" ? await n.description(c) : n.description, g = typeof u == "object" && !K.isValidElement(u) ? u : {
            message: u
          };
          this.create({
            id: r,
            type: "error",
            description: y,
            ...g
          });
        } else if (n.success !== void 0) {
          i = !1;
          const u = typeof n.success == "function" ? await n.success(c) : n.success, y = typeof n.description == "function" ? await n.description(c) : n.description, g = typeof u == "object" && !K.isValidElement(u) ? u : {
            message: u
          };
          this.create({
            id: r,
            type: "success",
            description: y,
            ...g
          });
        }
      }).catch(async (c) => {
        if (a = [
          "reject",
          c
        ], n.error !== void 0) {
          i = !1;
          const f = typeof n.error == "function" ? await n.error(c) : n.error, u = typeof n.description == "function" ? await n.description(c) : n.description, m = typeof f == "object" && !K.isValidElement(f) ? f : {
            message: f
          };
          this.create({
            id: r,
            type: "error",
            description: u,
            ...m
          });
        }
      }).finally(() => {
        i && (this.dismiss(r), r = void 0), n.finally == null || n.finally.call(n);
      }), l = () => new Promise((c, f) => s.then(() => a[0] === "reject" ? f(a[1]) : c(a[1])).catch(f));
      return typeof r != "string" && typeof r != "number" ? {
        unwrap: l
      } : Object.assign(r, {
        unwrap: l
      });
    }, this.custom = (t, n) => {
      const r = (n == null ? void 0 : n.id) || Rs++;
      return this.create({
        jsx: t(r),
        id: r,
        ...n
      }), r;
    }, this.getActiveToasts = () => this.toasts.filter((t) => !this.dismissedToasts.has(t.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const $t = new yS(), bS = (e, t) => {
  const n = (t == null ? void 0 : t.id) || Rs++;
  return $t.addToast({
    title: e,
    ...t,
    id: n
  }), n;
}, wS = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", xS = bS, CS = () => $t.toasts, SS = () => $t.getActiveToasts(), JE = Object.assign(xS, {
  success: $t.success,
  info: $t.info,
  warning: $t.warning,
  error: $t.error,
  custom: $t.custom,
  message: $t.message,
  promise: $t.promise,
  dismiss: $t.dismiss,
  loading: $t.loading
}, {
  getHistory: CS,
  getToasts: SS
});
uS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function ci(e) {
  return e.label !== void 0;
}
const ES = 3, RS = "24px", MS = "16px", gc = 4e3, PS = 356, NS = 14, DS = 45, _S = 200;
function hn(...e) {
  return e.filter(Boolean).join(" ");
}
function OS(e) {
  const [t, n] = e.split("-"), r = [];
  return t && r.push(t), n && r.push(n), r;
}
const kS = (e) => {
  var t, n, r, o, i, a, s, l, c;
  const { invert: f, toast: u, unstyled: y, interacting: m, setHeights: g, visibleToasts: w, heights: d, index: v, toasts: p, expanded: b, removeToast: C, defaultRichColors: x, closeButton: S, style: E, cancelButtonStyle: M, actionButtonStyle: _, className: P = "", descriptionClassName: k = "", duration: I, position: H, gap: A, expandByDefault: L, classNames: N, icons: $, closeButtonAriaLabel: T = "Close toast" } = e, [z, B] = K.useState(null), [W, Y] = K.useState(null), [U, V] = K.useState(!1), [Z, se] = K.useState(!1), [ge, j] = K.useState(!1), [q, J] = K.useState(!1), [D, O] = K.useState(!1), [F, G] = K.useState(0), [Q, X] = K.useState(0), oe = K.useRef(u.duration || I || gc), ee = K.useRef(null), ne = K.useRef(null), be = v === 0, we = v + 1 <= w, pe = u.type, te = u.dismissible !== !1, He = u.className || "", Te = u.descriptionClassName || "", Ee = K.useMemo(() => d.findIndex((ce) => ce.toastId === u.id) || 0, [
    d,
    u.id
  ]), Ge = K.useMemo(() => {
    var ce;
    return (ce = u.closeButton) != null ? ce : S;
  }, [
    u.closeButton,
    S
  ]), ze = K.useMemo(() => u.duration || I || gc, [
    u.duration,
    I
  ]), Ie = K.useRef(0), Xe = K.useRef(0), Je = K.useRef(0), je = K.useRef(null), [Ze, Ae] = H.split("-"), Fe = K.useMemo(() => d.reduce((ce, _e, Re) => Re >= Ee ? ce : ce + _e.height, 0), [
    d,
    Ee
  ]), Ke = gS(), vt = u.invert || f, st = pe === "loading";
  Xe.current = K.useMemo(() => Ee * A + Fe, [
    Ee,
    Fe
  ]), K.useEffect(() => {
    oe.current = ze;
  }, [
    ze
  ]), K.useEffect(() => {
    V(!0);
  }, []), K.useEffect(() => {
    const ce = ne.current;
    if (ce) {
      const _e = ce.getBoundingClientRect().height;
      return X(_e), g((Re) => [
        {
          toastId: u.id,
          height: _e,
          position: u.position
        },
        ...Re
      ]), () => g((Re) => Re.filter((de) => de.toastId !== u.id));
    }
  }, [
    g,
    u.id
  ]), K.useLayoutEffect(() => {
    if (!U) return;
    const ce = ne.current, _e = ce.style.height;
    ce.style.height = "auto";
    const Re = ce.getBoundingClientRect().height;
    ce.style.height = _e, X(Re), g((de) => de.find((ue) => ue.toastId === u.id) ? de.map((ue) => ue.toastId === u.id ? {
      ...ue,
      height: Re
    } : ue) : [
      {
        toastId: u.id,
        height: Re,
        position: u.position
      },
      ...de
    ]);
  }, [
    U,
    u.title,
    u.description,
    g,
    u.id,
    u.jsx,
    u.action,
    u.cancel
  ]);
  const pt = K.useCallback(() => {
    se(!0), G(Xe.current), g((ce) => ce.filter((_e) => _e.toastId !== u.id)), setTimeout(() => {
      C(u);
    }, _S);
  }, [
    u,
    C,
    g,
    Xe
  ]);
  K.useEffect(() => {
    if (u.promise && pe === "loading" || u.duration === 1 / 0 || u.type === "loading") return;
    let ce;
    return b || m || Ke ? (() => {
      if (Je.current < Ie.current) {
        const de = (/* @__PURE__ */ new Date()).getTime() - Ie.current;
        oe.current = oe.current - de;
      }
      Je.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      oe.current !== 1 / 0 && (Ie.current = (/* @__PURE__ */ new Date()).getTime(), ce = setTimeout(() => {
        u.onAutoClose == null || u.onAutoClose.call(u, u), pt();
      }, oe.current));
    })(), () => clearTimeout(ce);
  }, [
    b,
    m,
    u,
    pe,
    Ke,
    pt
  ]), K.useEffect(() => {
    u.delete && (pt(), u.onDismiss == null || u.onDismiss.call(u, u));
  }, [
    pt,
    u.delete
  ]);
  function zt() {
    var ce;
    if ($ != null && $.loading) {
      var _e;
      return /* @__PURE__ */ K.createElement("div", {
        className: hn(N == null ? void 0 : N.loader, u == null || (_e = u.classNames) == null ? void 0 : _e.loader, "sonner-loader"),
        "data-visible": pe === "loading"
      }, $.loading);
    }
    return /* @__PURE__ */ K.createElement(dS, {
      className: hn(N == null ? void 0 : N.loader, u == null || (ce = u.classNames) == null ? void 0 : ce.loader),
      visible: pe === "loading"
    });
  }
  const St = u.icon || ($ == null ? void 0 : $[pe]) || lS(pe);
  var Tt, ot;
  return /* @__PURE__ */ K.createElement("li", {
    tabIndex: 0,
    ref: ne,
    className: hn(P, He, N == null ? void 0 : N.toast, u == null || (t = u.classNames) == null ? void 0 : t.toast, N == null ? void 0 : N.default, N == null ? void 0 : N[pe], u == null || (n = u.classNames) == null ? void 0 : n[pe]),
    "data-sonner-toast": "",
    "data-rich-colors": (Tt = u.richColors) != null ? Tt : x,
    "data-styled": !(u.jsx || u.unstyled || y),
    "data-mounted": U,
    "data-promise": !!u.promise,
    "data-swiped": D,
    "data-removed": Z,
    "data-visible": we,
    "data-y-position": Ze,
    "data-x-position": Ae,
    "data-index": v,
    "data-front": be,
    "data-swiping": ge,
    "data-dismissible": te,
    "data-type": pe,
    "data-invert": vt,
    "data-swipe-out": q,
    "data-swipe-direction": W,
    "data-expanded": !!(b || L && U),
    "data-testid": u.testId,
    style: {
      "--index": v,
      "--toasts-before": v,
      "--z-index": p.length - v,
      "--offset": `${Z ? F : Xe.current}px`,
      "--initial-height": L ? "auto" : `${Q}px`,
      ...E,
      ...u.style
    },
    onDragEnd: () => {
      j(!1), B(null), je.current = null;
    },
    onPointerDown: (ce) => {
      ce.button !== 2 && (st || !te || (ee.current = /* @__PURE__ */ new Date(), G(Xe.current), ce.target.setPointerCapture(ce.pointerId), ce.target.tagName !== "BUTTON" && (j(!0), je.current = {
        x: ce.clientX,
        y: ce.clientY
      })));
    },
    onPointerUp: () => {
      var ce, _e, Re;
      if (q || !te) return;
      je.current = null;
      const de = Number(((ce = ne.current) == null ? void 0 : ce.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), fe = Number(((_e = ne.current) == null ? void 0 : _e.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), ue = (/* @__PURE__ */ new Date()).getTime() - ((Re = ee.current) == null ? void 0 : Re.getTime()), Pe = z === "x" ? de : fe, nt = Math.abs(Pe) / ue;
      if (Math.abs(Pe) >= DS || nt > 0.11) {
        G(Xe.current), u.onDismiss == null || u.onDismiss.call(u, u), Y(z === "x" ? de > 0 ? "right" : "left" : fe > 0 ? "down" : "up"), pt(), J(!0);
        return;
      } else {
        var et, Ve;
        (et = ne.current) == null || et.style.setProperty("--swipe-amount-x", "0px"), (Ve = ne.current) == null || Ve.style.setProperty("--swipe-amount-y", "0px");
      }
      O(!1), j(!1), B(null);
    },
    onPointerMove: (ce) => {
      var _e, Re, de;
      if (!je.current || !te || ((_e = window.getSelection()) == null ? void 0 : _e.toString().length) > 0) return;
      const ue = ce.clientY - je.current.y, Pe = ce.clientX - je.current.x;
      var nt;
      const et = (nt = e.swipeDirections) != null ? nt : OS(H);
      !z && (Math.abs(Pe) > 1 || Math.abs(ue) > 1) && B(Math.abs(Pe) > Math.abs(ue) ? "x" : "y");
      let Ve = {
        x: 0,
        y: 0
      };
      const Xt = (yt) => 1 / (1.5 + Math.abs(yt) / 20);
      if (z === "y") {
        if (et.includes("top") || et.includes("bottom"))
          if (et.includes("top") && ue < 0 || et.includes("bottom") && ue > 0)
            Ve.y = ue;
          else {
            const yt = ue * Xt(ue);
            Ve.y = Math.abs(yt) < Math.abs(ue) ? yt : ue;
          }
      } else if (z === "x" && (et.includes("left") || et.includes("right")))
        if (et.includes("left") && Pe < 0 || et.includes("right") && Pe > 0)
          Ve.x = Pe;
        else {
          const yt = Pe * Xt(Pe);
          Ve.x = Math.abs(yt) < Math.abs(Pe) ? yt : Pe;
        }
      (Math.abs(Ve.x) > 0 || Math.abs(Ve.y) > 0) && O(!0), (Re = ne.current) == null || Re.style.setProperty("--swipe-amount-x", `${Ve.x}px`), (de = ne.current) == null || de.style.setProperty("--swipe-amount-y", `${Ve.y}px`);
    }
  }, Ge && !u.jsx && pe !== "loading" ? /* @__PURE__ */ K.createElement("button", {
    "aria-label": T,
    "data-disabled": st,
    "data-close-button": !0,
    onClick: st || !te ? () => {
    } : () => {
      pt(), u.onDismiss == null || u.onDismiss.call(u, u);
    },
    className: hn(N == null ? void 0 : N.closeButton, u == null || (r = u.classNames) == null ? void 0 : r.closeButton)
  }, (ot = $ == null ? void 0 : $.close) != null ? ot : mS) : null, (pe || u.icon || u.promise) && u.icon !== null && (($ == null ? void 0 : $[pe]) !== null || u.icon) ? /* @__PURE__ */ K.createElement("div", {
    "data-icon": "",
    className: hn(N == null ? void 0 : N.icon, u == null || (o = u.classNames) == null ? void 0 : o.icon)
  }, u.promise || u.type === "loading" && !u.icon ? u.icon || zt() : null, u.type !== "loading" ? St : null) : null, /* @__PURE__ */ K.createElement("div", {
    "data-content": "",
    className: hn(N == null ? void 0 : N.content, u == null || (i = u.classNames) == null ? void 0 : i.content)
  }, /* @__PURE__ */ K.createElement("div", {
    "data-title": "",
    className: hn(N == null ? void 0 : N.title, u == null || (a = u.classNames) == null ? void 0 : a.title)
  }, u.jsx ? u.jsx : typeof u.title == "function" ? u.title() : u.title), u.description ? /* @__PURE__ */ K.createElement("div", {
    "data-description": "",
    className: hn(k, Te, N == null ? void 0 : N.description, u == null || (s = u.classNames) == null ? void 0 : s.description)
  }, typeof u.description == "function" ? u.description() : u.description) : null), /* @__PURE__ */ K.isValidElement(u.cancel) ? u.cancel : u.cancel && ci(u.cancel) ? /* @__PURE__ */ K.createElement("button", {
    "data-button": !0,
    "data-cancel": !0,
    style: u.cancelButtonStyle || M,
    onClick: (ce) => {
      ci(u.cancel) && te && (u.cancel.onClick == null || u.cancel.onClick.call(u.cancel, ce), pt());
    },
    className: hn(N == null ? void 0 : N.cancelButton, u == null || (l = u.classNames) == null ? void 0 : l.cancelButton)
  }, u.cancel.label) : null, /* @__PURE__ */ K.isValidElement(u.action) ? u.action : u.action && ci(u.action) ? /* @__PURE__ */ K.createElement("button", {
    "data-button": !0,
    "data-action": !0,
    style: u.actionButtonStyle || _,
    onClick: (ce) => {
      ci(u.action) && (u.action.onClick == null || u.action.onClick.call(u.action, ce), !ce.defaultPrevented && pt());
    },
    className: hn(N == null ? void 0 : N.actionButton, u == null || (c = u.classNames) == null ? void 0 : c.actionButton)
  }, u.action.label) : null);
};
function yc() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
function TS(e, t) {
  const n = {};
  return [
    e,
    t
  ].forEach((r, o) => {
    const i = o === 1, a = i ? "--mobile-offset" : "--offset", s = i ? MS : RS;
    function l(c) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((f) => {
        n[`${a}-${f}`] = typeof c == "number" ? `${c}px` : c;
      });
    }
    typeof r == "number" || typeof r == "string" ? l(r) : typeof r == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((c) => {
      r[c] === void 0 ? n[`${a}-${c}`] = s : n[`${a}-${c}`] = typeof r[c] == "number" ? `${r[c]}px` : r[c];
    }) : l(s);
  }), n;
}
const IS = /* @__PURE__ */ K.forwardRef(function(t, n) {
  const { id: r, invert: o, position: i = "bottom-right", hotkey: a = [
    "altKey",
    "KeyT"
  ], expand: s, closeButton: l, className: c, offset: f, mobileOffset: u, theme: y = "light", richColors: m, duration: g, style: w, visibleToasts: d = ES, toastOptions: v, dir: p = yc(), gap: b = NS, icons: C, containerAriaLabel: x = "Notifications" } = t, [S, E] = K.useState([]), M = K.useMemo(() => r ? S.filter((U) => U.toasterId === r) : S.filter((U) => !U.toasterId), [
    S,
    r
  ]), _ = K.useMemo(() => Array.from(new Set([
    i
  ].concat(M.filter((U) => U.position).map((U) => U.position)))), [
    M,
    i
  ]), [P, k] = K.useState([]), [I, H] = K.useState(!1), [A, L] = K.useState(!1), [N, $] = K.useState(y !== "system" ? y : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), T = K.useRef(null), z = a.join("+").replace(/Key/g, "").replace(/Digit/g, ""), B = K.useRef(null), W = K.useRef(!1), Y = K.useCallback((U) => {
    E((V) => {
      var Z;
      return (Z = V.find((se) => se.id === U.id)) != null && Z.delete || $t.dismiss(U.id), V.filter(({ id: se }) => se !== U.id);
    });
  }, []);
  return K.useEffect(() => $t.subscribe((U) => {
    if (U.dismiss) {
      requestAnimationFrame(() => {
        E((V) => V.map((Z) => Z.id === U.id ? {
          ...Z,
          delete: !0
        } : Z));
      });
      return;
    }
    setTimeout(() => {
      rn.flushSync(() => {
        E((V) => {
          const Z = V.findIndex((se) => se.id === U.id);
          return Z !== -1 ? [
            ...V.slice(0, Z),
            {
              ...V[Z],
              ...U
            },
            ...V.slice(Z + 1)
          ] : [
            U,
            ...V
          ];
        });
      });
    });
  }), [
    S
  ]), K.useEffect(() => {
    if (y !== "system") {
      $(y);
      return;
    }
    if (y === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? $("dark") : $("light")), typeof window > "u") return;
    const U = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      U.addEventListener("change", ({ matches: V }) => {
        $(V ? "dark" : "light");
      });
    } catch {
      U.addListener(({ matches: Z }) => {
        try {
          $(Z ? "dark" : "light");
        } catch (se) {
          console.error(se);
        }
      });
    }
  }, [
    y
  ]), K.useEffect(() => {
    S.length <= 1 && H(!1);
  }, [
    S
  ]), K.useEffect(() => {
    const U = (V) => {
      var Z;
      if (a.every((j) => V[j] || V.code === j)) {
        var ge;
        H(!0), (ge = T.current) == null || ge.focus();
      }
      V.code === "Escape" && (document.activeElement === T.current || (Z = T.current) != null && Z.contains(document.activeElement)) && H(!1);
    };
    return document.addEventListener("keydown", U), () => document.removeEventListener("keydown", U);
  }, [
    a
  ]), K.useEffect(() => {
    if (T.current)
      return () => {
        B.current && (B.current.focus({
          preventScroll: !0
        }), B.current = null, W.current = !1);
      };
  }, [
    T.current
  ]), // Remove item from normal navigation flow, only available via hotkey
  /* @__PURE__ */ K.createElement("section", {
    ref: n,
    "aria-label": `${x} ${z}`,
    tabIndex: -1,
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-atomic": "false",
    suppressHydrationWarning: !0
  }, _.map((U, V) => {
    var Z;
    const [se, ge] = U.split("-");
    return M.length ? /* @__PURE__ */ K.createElement("ol", {
      key: U,
      dir: p === "auto" ? yc() : p,
      tabIndex: -1,
      ref: T,
      className: c,
      "data-sonner-toaster": !0,
      "data-sonner-theme": N,
      "data-y-position": se,
      "data-x-position": ge,
      style: {
        "--front-toast-height": `${((Z = P[0]) == null ? void 0 : Z.height) || 0}px`,
        "--width": `${PS}px`,
        "--gap": `${b}px`,
        ...w,
        ...TS(f, u)
      },
      onBlur: (j) => {
        W.current && !j.currentTarget.contains(j.relatedTarget) && (W.current = !1, B.current && (B.current.focus({
          preventScroll: !0
        }), B.current = null));
      },
      onFocus: (j) => {
        j.target instanceof HTMLElement && j.target.dataset.dismissible === "false" || W.current || (W.current = !0, B.current = j.relatedTarget);
      },
      onMouseEnter: () => H(!0),
      onMouseMove: () => H(!0),
      onMouseLeave: () => {
        A || H(!1);
      },
      onDragEnd: () => H(!1),
      onPointerDown: (j) => {
        j.target instanceof HTMLElement && j.target.dataset.dismissible === "false" || L(!0);
      },
      onPointerUp: () => L(!1)
    }, M.filter((j) => !j.position && V === 0 || j.position === U).map((j, q) => {
      var J, D;
      return /* @__PURE__ */ K.createElement(kS, {
        key: j.id,
        icons: C,
        index: q,
        toast: j,
        defaultRichColors: m,
        duration: (J = v == null ? void 0 : v.duration) != null ? J : g,
        className: v == null ? void 0 : v.className,
        descriptionClassName: v == null ? void 0 : v.descriptionClassName,
        invert: o,
        visibleToasts: d,
        closeButton: (D = v == null ? void 0 : v.closeButton) != null ? D : l,
        interacting: A,
        position: U,
        style: v == null ? void 0 : v.style,
        unstyled: v == null ? void 0 : v.unstyled,
        classNames: v == null ? void 0 : v.classNames,
        cancelButtonStyle: v == null ? void 0 : v.cancelButtonStyle,
        actionButtonStyle: v == null ? void 0 : v.actionButtonStyle,
        closeButtonAriaLabel: v == null ? void 0 : v.closeButtonAriaLabel,
        removeToast: Y,
        toasts: M.filter((O) => O.position == j.position),
        heights: P.filter((O) => O.position == j.position),
        setHeights: k,
        expandByDefault: s,
        gap: b,
        expanded: I,
        swipeDirections: t.swipeDirections
      });
    })) : null;
  }));
});
function eR({ visibleToasts: e, ...t }) {
  return /* @__PURE__ */ R(
    IS,
    {
      className: "dark:![&_[data-description]]:univer-text-gray-200 [&_[data-description]]:univer-text-sm [&_[data-description]]:univer-text-gray-600 [&_[data-icon]>svg]:univer-relative [&_[data-icon]>svg]:univer-top-1 [&_[data-icon]]:univer-self-baseline [&_[data-sonner-toast]]:univer-shadow-md [&_[data-title]]:univer-text-sm [&_[data-title]]:univer-text-gray-900",
      toastOptions: {
        classNames: {
          content: "univer-leading-normal",
          success: "[&_[data-icon]]:univer-text-green-500",
          info: "[&_[data-icon]]:univer-text-primary-600",
          error: "[&_[data-icon]]:univer-text-red-500",
          warning: "[&_[data-icon]]:univer-text-yellow-500"
        }
      },
      visibleToasts: e != null ? e : 5,
      ...t
    }
  );
}
var Ip = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.height, r = e.offsetY, o = e.offsetX, i = e.children, a = e.prefixCls, s = e.onInnerResize, l = e.innerProps, c = e.rtl, f = e.extra, u = {}, y = {
    display: "flex",
    flexDirection: "column"
  };
  return r !== void 0 && (u = {
    height: n,
    position: "relative",
    overflow: "hidden"
  }, y = re(re({}, y), {}, xe(xe(xe(xe(xe({
    transform: "translateY(".concat(r, "px)")
  }, c ? "marginRight" : "marginLeft", -o), "position", "absolute"), "left", 0), "right", 0), "top", 0))), /* @__PURE__ */ h.createElement("div", {
    style: u
  }, /* @__PURE__ */ h.createElement(mr, {
    onResize: function(g) {
      var w = g.offsetHeight;
      w && s && s();
    }
  }, /* @__PURE__ */ h.createElement("div", $e({
    style: y,
    className: it(xe({}, "".concat(a, "-holder-inner"), a)),
    ref: t
  }, l), i, f)));
});
Ip.displayName = "Filler";
function AS(e) {
  var t = e.children, n = e.setRef, r = h.useCallback(function(o) {
    n(o);
  }, []);
  return /* @__PURE__ */ h.cloneElement(t, {
    ref: r
  });
}
function LS(e, t, n, r, o, i, a, s) {
  var l = s.getKey;
  return e.slice(t, n + 1).map(function(c, f) {
    var u = t + f, y = a(c, u, {
      style: {
        width: r
      },
      offsetX: o
    }), m = l(c);
    return /* @__PURE__ */ h.createElement(AS, {
      key: m,
      setRef: function(w) {
        return i(c, w);
      }
    }, y);
  });
}
function $S(e, t, n) {
  var r = e.length, o = t.length, i, a;
  if (r === 0 && o === 0)
    return null;
  r < o ? (i = e, a = t) : (i = t, a = e);
  var s = {
    __EMPTY_ITEM__: !0
  };
  function l(g) {
    return g !== void 0 ? n(g) : s;
  }
  for (var c = null, f = Math.abs(r - o) !== 1, u = 0; u < a.length; u += 1) {
    var y = l(i[u]), m = l(a[u]);
    if (y !== m) {
      c = u, f = f || y !== l(a[u + 1]);
      break;
    }
  }
  return c === null ? null : {
    index: c,
    multiple: f
  };
}
function zS(e, t, n) {
  var r = h.useState(e), o = ae(r, 2), i = o[0], a = o[1], s = h.useState(null), l = ae(s, 2), c = l[0], f = l[1];
  return h.useEffect(function() {
    var u = $S(i || [], e || [], t);
    (u == null ? void 0 : u.index) !== void 0 && f(e[u.index]), a(e);
  }, [e]), [c];
}
var bc = (typeof navigator > "u" ? "undefined" : wt(navigator)) === "object" && /Firefox/i.test(navigator.userAgent);
const Ap = (function(e, t, n, r) {
  var o = ye(!1), i = ye(null);
  function a() {
    clearTimeout(i.current), o.current = !0, i.current = setTimeout(function() {
      o.current = !1;
    }, 50);
  }
  var s = ye({
    top: e,
    bottom: t,
    left: n,
    right: r
  });
  return s.current.top = e, s.current.bottom = t, s.current.left = n, s.current.right = r, function(l, c) {
    var f = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, u = l ? (
      // Pass origin wheel when on the left
      c < 0 && s.current.left || // Pass origin wheel when on the right
      c > 0 && s.current.right
    ) : c < 0 && s.current.top || // Pass origin wheel when on the bottom
    c > 0 && s.current.bottom;
    return f && u ? (clearTimeout(i.current), o.current = !1) : (!u || o.current) && a(), !o.current && u;
  };
});
function FS(e, t, n, r, o, i, a) {
  var s = ye(0), l = ye(null), c = ye(null), f = ye(!1), u = Ap(t, n, r, o);
  function y(p, b) {
    if (mt.cancel(l.current), !u(!1, b)) {
      var C = p;
      if (!C._virtualHandled)
        C._virtualHandled = !0;
      else
        return;
      s.current += b, c.current = b, bc || C.preventDefault(), l.current = mt(function() {
        var x = f.current ? 10 : 1;
        a(s.current * x, !1), s.current = 0;
      });
    }
  }
  function m(p, b) {
    a(b, !0), bc || p.preventDefault();
  }
  var g = ye(null), w = ye(null);
  function d(p) {
    if (e) {
      mt.cancel(w.current), w.current = mt(function() {
        g.current = null;
      }, 2);
      var b = p.deltaX, C = p.deltaY, x = p.shiftKey, S = b, E = C;
      (g.current === "sx" || !g.current && x && C && !b) && (S = C, E = 0, g.current = "sx");
      var M = Math.abs(S), _ = Math.abs(E);
      g.current === null && (g.current = i && M > _ ? "x" : "y"), g.current === "y" ? y(p, E) : m(p, S);
    }
  }
  function v(p) {
    e && (f.current = p.detail === c.current);
  }
  return [d, v];
}
function HS(e, t, n, r) {
  var o = h.useMemo(function() {
    return [/* @__PURE__ */ new Map(), []];
  }, [e, n.id, r]), i = ae(o, 2), a = i[0], s = i[1], l = function(f) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : f, y = a.get(f), m = a.get(u);
    if (y === void 0 || m === void 0)
      for (var g = e.length, w = s.length; w < g; w += 1) {
        var d, v = e[w], p = t(v);
        a.set(p, w);
        var b = (d = n.get(p)) !== null && d !== void 0 ? d : r;
        if (s[w] = (s[w - 1] || 0) + b, p === f && (y = w), p === u && (m = w), y !== void 0 && m !== void 0)
          break;
      }
    return {
      top: s[y - 1] || 0,
      bottom: s[m]
    };
  };
  return l;
}
var WS = /* @__PURE__ */ (function() {
  function e() {
    $o(this, e), xe(this, "maps", void 0), xe(this, "id", 0), xe(this, "diffRecords", /* @__PURE__ */ new Map()), this.maps = /* @__PURE__ */ Object.create(null);
  }
  return zo(e, [{
    key: "set",
    value: function(n, r) {
      this.diffRecords.set(n, this.maps[n]), this.maps[n] = r, this.id += 1;
    }
  }, {
    key: "get",
    value: function(n) {
      return this.maps[n];
    }
    /**
     * CacheMap will record the key changed.
     * To help to know what's update in the next render.
     */
  }, {
    key: "resetRecord",
    value: function() {
      this.diffRecords.clear();
    }
  }, {
    key: "getRecord",
    value: function() {
      return this.diffRecords;
    }
  }]), e;
})();
function wc(e) {
  var t = parseFloat(e);
  return isNaN(t) ? 0 : t;
}
function BS(e, t, n) {
  var r = h.useState(0), o = ae(r, 2), i = o[0], a = o[1], s = ye(/* @__PURE__ */ new Map()), l = ye(new WS()), c = ye(0);
  function f() {
    c.current += 1;
  }
  function u() {
    var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    f();
    var g = function() {
      var v = !1;
      s.current.forEach(function(p, b) {
        if (p && p.offsetParent) {
          var C = p.offsetHeight, x = getComputedStyle(p), S = x.marginTop, E = x.marginBottom, M = wc(S), _ = wc(E), P = C + M + _;
          l.current.get(b) !== P && (l.current.set(b, P), v = !0);
        }
      }), v && a(function(p) {
        return p + 1;
      });
    };
    if (m)
      g();
    else {
      c.current += 1;
      var w = c.current;
      Promise.resolve().then(function() {
        w === c.current && g();
      });
    }
  }
  function y(m, g) {
    var w = e(m);
    s.current.get(w), g ? (s.current.set(w, g), u()) : s.current.delete(w);
  }
  return qe(function() {
    return f;
  }, []), [y, u, l.current, i];
}
var xc = 14 / 15;
function jS(e, t, n) {
  var r = ye(!1), o = ye(0), i = ye(0), a = ye(null), s = ye(null), l, c = function(m) {
    if (r.current) {
      var g = Math.ceil(m.touches[0].pageX), w = Math.ceil(m.touches[0].pageY), d = o.current - g, v = i.current - w, p = Math.abs(d) > Math.abs(v);
      p ? o.current = g : i.current = w;
      var b = n(p, p ? d : v, !1, m);
      b && m.preventDefault(), clearInterval(s.current), b && (s.current = setInterval(function() {
        p ? d *= xc : v *= xc;
        var C = Math.floor(p ? d : v);
        (!n(p, C, !0) || Math.abs(C) <= 0.1) && clearInterval(s.current);
      }, 16));
    }
  }, f = function() {
    r.current = !1, l();
  }, u = function(m) {
    l(), m.touches.length === 1 && !r.current && (r.current = !0, o.current = Math.ceil(m.touches[0].pageX), i.current = Math.ceil(m.touches[0].pageY), a.current = m.target, a.current.addEventListener("touchmove", c, {
      passive: !1
    }), a.current.addEventListener("touchend", f, {
      passive: !0
    }));
  };
  l = function() {
    a.current && (a.current.removeEventListener("touchmove", c), a.current.removeEventListener("touchend", f));
  }, ht(function() {
    return e && t.current.addEventListener("touchstart", u, {
      passive: !0
    }), function() {
      var y;
      (y = t.current) === null || y === void 0 || y.removeEventListener("touchstart", u), l(), clearInterval(s.current);
    };
  }, [e]);
}
function Cc(e) {
  return Math.floor(Math.pow(e, 0.5));
}
function Ms(e, t) {
  var n = "touches" in e ? e.touches[0] : e;
  return n[t ? "pageX" : "pageY"] - window[t ? "scrollX" : "scrollY"];
}
function VS(e, t, n) {
  h.useEffect(function() {
    var r = t.current;
    if (e && r) {
      var o = !1, i, a, s = function() {
        mt.cancel(i);
      }, l = function y() {
        s(), i = mt(function() {
          n(a), y();
        });
      }, c = function(m) {
        if (!(m.target.draggable || m.button !== 0)) {
          var g = m;
          g._virtualHandled || (g._virtualHandled = !0, o = !0);
        }
      }, f = function() {
        o = !1, s();
      }, u = function(m) {
        if (o) {
          var g = Ms(m, !1), w = r.getBoundingClientRect(), d = w.top, v = w.bottom;
          if (g <= d) {
            var p = d - g;
            a = -Cc(p), l();
          } else if (g >= v) {
            var b = g - v;
            a = Cc(b), l();
          } else
            s();
        }
      };
      return r.addEventListener("mousedown", c), r.ownerDocument.addEventListener("mouseup", f), r.ownerDocument.addEventListener("mousemove", u), function() {
        r.removeEventListener("mousedown", c), r.ownerDocument.removeEventListener("mouseup", f), r.ownerDocument.removeEventListener("mousemove", u), s();
      };
    }
  }, [e]);
}
var qS = 10;
function US(e, t, n, r, o, i, a, s) {
  var l = h.useRef(), c = h.useState(null), f = ae(c, 2), u = f[0], y = f[1];
  return ht(function() {
    if (u && u.times < qS) {
      if (!e.current) {
        y(function(z) {
          return re({}, z);
        });
        return;
      }
      i();
      var m = u.targetAlign, g = u.originAlign, w = u.index, d = u.offset, v = e.current.clientHeight, p = !1, b = m, C = null;
      if (v) {
        for (var x = m || g, S = 0, E = 0, M = 0, _ = Math.min(t.length - 1, w), P = 0; P <= _; P += 1) {
          var k = o(t[P]);
          E = S;
          var I = n.get(k);
          M = E + (I === void 0 ? r : I), S = M;
        }
        for (var H = x === "top" ? d : v - d, A = _; A >= 0; A -= 1) {
          var L = o(t[A]), N = n.get(L);
          if (N === void 0) {
            p = !0;
            break;
          }
          if (H -= N, H <= 0)
            break;
        }
        switch (x) {
          case "top":
            C = E - d;
            break;
          case "bottom":
            C = M - v + d;
            break;
          default: {
            var $ = e.current.scrollTop, T = $ + v;
            E < $ ? b = "top" : M > T && (b = "bottom");
          }
        }
        C !== null && a(C), C !== u.lastTop && (p = !0);
      }
      p && y(re(re({}, u), {}, {
        times: u.times + 1,
        targetAlign: b,
        lastTop: C
      }));
    }
  }, [u, e.current]), function(m) {
    if (m == null) {
      s();
      return;
    }
    if (mt.cancel(l.current), typeof m == "number")
      a(m);
    else if (m && wt(m) === "object") {
      var g, w = m.align;
      "index" in m ? g = m.index : g = t.findIndex(function(p) {
        return o(p) === m.key;
      });
      var d = m.offset, v = d === void 0 ? 0 : d;
      y({
        times: 0,
        index: g,
        offset: v,
        originAlign: w
      });
    }
  };
}
var Sc = /* @__PURE__ */ h.forwardRef(function(e, t) {
  var n = e.prefixCls, r = e.rtl, o = e.scrollOffset, i = e.scrollRange, a = e.onStartMove, s = e.onStopMove, l = e.onScroll, c = e.horizontal, f = e.spinSize, u = e.containerSize, y = e.style, m = e.thumbStyle, g = e.showScrollBar, w = h.useState(!1), d = ae(w, 2), v = d[0], p = d[1], b = h.useState(null), C = ae(b, 2), x = C[0], S = C[1], E = h.useState(null), M = ae(E, 2), _ = M[0], P = M[1], k = !r, I = h.useRef(), H = h.useRef(), A = h.useState(g), L = ae(A, 2), N = L[0], $ = L[1], T = h.useRef(), z = function() {
    g === !0 || g === !1 || (clearTimeout(T.current), $(!0), T.current = setTimeout(function() {
      $(!1);
    }, 3e3));
  }, B = i - u || 0, W = u - f || 0, Y = h.useMemo(function() {
    if (o === 0 || B === 0)
      return 0;
    var D = o / B;
    return D * W;
  }, [o, B, W]), U = function(O) {
    O.stopPropagation(), O.preventDefault();
  }, V = h.useRef({
    top: Y,
    dragging: v,
    pageY: x,
    startTop: _
  });
  V.current = {
    top: Y,
    dragging: v,
    pageY: x,
    startTop: _
  };
  var Z = function(O) {
    p(!0), S(Ms(O, c)), P(V.current.top), a(), O.stopPropagation(), O.preventDefault();
  };
  h.useEffect(function() {
    var D = function(Q) {
      Q.preventDefault();
    }, O = I.current, F = H.current;
    return O.addEventListener("touchstart", D, {
      passive: !1
    }), F.addEventListener("touchstart", Z, {
      passive: !1
    }), function() {
      O.removeEventListener("touchstart", D), F.removeEventListener("touchstart", Z);
    };
  }, []);
  var se = h.useRef();
  se.current = B;
  var ge = h.useRef();
  ge.current = W, h.useEffect(function() {
    if (v) {
      var D, O = function(Q) {
        var X = V.current, oe = X.dragging, ee = X.pageY, ne = X.startTop;
        mt.cancel(D);
        var be = I.current.getBoundingClientRect(), we = u / (c ? be.width : be.height);
        if (oe) {
          var pe = (Ms(Q, c) - ee) * we, te = ne;
          !k && c ? te -= pe : te += pe;
          var He = se.current, Te = ge.current, Ee = Te ? te / Te : 0, Ge = Math.ceil(Ee * He);
          Ge = Math.max(Ge, 0), Ge = Math.min(Ge, He), D = mt(function() {
            l(Ge, c);
          });
        }
      }, F = function() {
        p(!1), s();
      };
      return window.addEventListener("mousemove", O, {
        passive: !0
      }), window.addEventListener("touchmove", O, {
        passive: !0
      }), window.addEventListener("mouseup", F, {
        passive: !0
      }), window.addEventListener("touchend", F, {
        passive: !0
      }), function() {
        window.removeEventListener("mousemove", O), window.removeEventListener("touchmove", O), window.removeEventListener("mouseup", F), window.removeEventListener("touchend", F), mt.cancel(D);
      };
    }
  }, [v]), h.useEffect(function() {
    return z(), function() {
      clearTimeout(T.current);
    };
  }, [o]), h.useImperativeHandle(t, function() {
    return {
      delayHidden: z
    };
  });
  var j = "".concat(n, "-scrollbar"), q = {
    position: "absolute",
    visibility: N ? null : "hidden"
  }, J = {
    position: "absolute",
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: 99,
    cursor: "pointer",
    userSelect: "none"
  };
  return c ? (q.height = 8, q.left = 0, q.right = 0, q.bottom = 0, J.height = "100%", J.width = f, k ? J.left = Y : J.right = Y) : (q.width = 8, q.top = 0, q.bottom = 0, k ? q.right = 0 : q.left = 0, J.width = "100%", J.height = f, J.top = Y), /* @__PURE__ */ h.createElement("div", {
    ref: I,
    className: it(j, xe(xe(xe({}, "".concat(j, "-horizontal"), c), "".concat(j, "-vertical"), !c), "".concat(j, "-visible"), N)),
    style: re(re({}, q), y),
    onMouseDown: U,
    onMouseMove: z
  }, /* @__PURE__ */ h.createElement("div", {
    ref: H,
    className: it("".concat(j, "-thumb"), xe({}, "".concat(j, "-thumb-moving"), v)),
    style: re(re({}, J), m),
    onMouseDown: Z
  }));
}), GS = 20;
function Ec() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = e / t * e;
  return isNaN(n) && (n = 0), n = Math.max(n, GS), Math.floor(n);
}
var KS = ["prefixCls", "className", "height", "itemHeight", "fullHeight", "style", "data", "children", "itemKey", "virtual", "direction", "scrollWidth", "component", "onScroll", "onVirtualScroll", "onVisibleChange", "innerProps", "extraRender", "styles", "showScrollBar"], YS = [], XS = {
  overflowY: "auto",
  overflowAnchor: "none"
};
function ZS(e, t) {
  var n = e.prefixCls, r = n === void 0 ? "rc-virtual-list" : n, o = e.className, i = e.height, a = e.itemHeight, s = e.fullHeight, l = s === void 0 ? !0 : s, c = e.style, f = e.data, u = e.children, y = e.itemKey, m = e.virtual, g = e.direction, w = e.scrollWidth, d = e.component, v = d === void 0 ? "div" : d, p = e.onScroll, b = e.onVirtualScroll, C = e.onVisibleChange, x = e.innerProps, S = e.extraRender, E = e.styles, M = e.showScrollBar, _ = M === void 0 ? "optional" : M, P = ft(e, KS), k = h.useCallback(function(le) {
    return typeof y == "function" ? y(le) : le == null ? void 0 : le[y];
  }, [y]), I = BS(k), H = ae(I, 4), A = H[0], L = H[1], N = H[2], $ = H[3], T = !!(m !== !1 && i && a), z = h.useMemo(function() {
    return Object.values(N.maps).reduce(function(le, ve) {
      return le + ve;
    }, 0);
  }, [N.id, N.maps]), B = T && f && (Math.max(a * f.length, z) > i || !!w), W = g === "rtl", Y = it(r, xe({}, "".concat(r, "-rtl"), W), o), U = f || YS, V = ye(), Z = ye(), se = ye(), ge = De(0), j = ae(ge, 2), q = j[0], J = j[1], D = De(0), O = ae(D, 2), F = O[0], G = O[1], Q = De(!1), X = ae(Q, 2), oe = X[0], ee = X[1], ne = function() {
    ee(!0);
  }, be = function() {
    ee(!1);
  }, we = {
    getKey: k
  };
  function pe(le) {
    J(function(ve) {
      var Me;
      typeof le == "function" ? Me = le(ve) : Me = le;
      var Oe = ce(Me);
      return V.current.scrollTop = Oe, Oe;
    });
  }
  var te = ye({
    start: 0,
    end: U.length
  }), He = ye(), Te = zS(U, k), Ee = ae(Te, 1), Ge = Ee[0];
  He.current = Ge;
  var ze = h.useMemo(function() {
    if (!T)
      return {
        scrollHeight: void 0,
        start: 0,
        end: U.length - 1,
        offset: void 0
      };
    if (!B) {
      var le;
      return {
        scrollHeight: ((le = Z.current) === null || le === void 0 ? void 0 : le.offsetHeight) || 0,
        start: 0,
        end: U.length - 1,
        offset: void 0
      };
    }
    for (var ve = 0, Me, Oe, Ye, qt = U.length, Lt = 0; Lt < qt; Lt += 1) {
      var dn = U[Lt], en = k(dn), fn = N.get(en), _t = ve + (fn === void 0 ? a : fn);
      _t >= q && Me === void 0 && (Me = Lt, Oe = ve), _t > q + i && Ye === void 0 && (Ye = Lt), ve = _t;
    }
    return Me === void 0 && (Me = 0, Oe = 0, Ye = Math.ceil(i / a)), Ye === void 0 && (Ye = U.length - 1), Ye = Math.min(Ye + 1, U.length - 1), {
      scrollHeight: ve,
      start: Me,
      end: Ye,
      offset: Oe
    };
  }, [B, T, q, U, $, i]), Ie = ze.scrollHeight, Xe = ze.start, Je = ze.end, je = ze.offset;
  te.current.start = Xe, te.current.end = Je, h.useLayoutEffect(function() {
    var le = N.getRecord();
    if (le.size === 1) {
      var ve = Array.from(le.keys())[0], Me = le.get(ve), Oe = U[Xe];
      if (Oe && Me === void 0) {
        var Ye = k(Oe);
        if (Ye === ve) {
          var qt = N.get(ve), Lt = qt - a;
          pe(function(dn) {
            return dn + Lt;
          });
        }
      }
    }
    N.resetRecord();
  }, [Ie]);
  var Ze = h.useState({
    width: 0,
    height: i
  }), Ae = ae(Ze, 2), Fe = Ae[0], Ke = Ae[1], vt = function(ve) {
    Ke({
      width: ve.offsetWidth,
      height: ve.offsetHeight
    });
  }, st = ye(), pt = ye(), zt = h.useMemo(function() {
    return Ec(Fe.width, w);
  }, [Fe.width, w]), St = h.useMemo(function() {
    return Ec(Fe.height, Ie);
  }, [Fe.height, Ie]), Tt = Ie - i, ot = ye(Tt);
  ot.current = Tt;
  function ce(le) {
    var ve = le;
    return Number.isNaN(ot.current) || (ve = Math.min(ve, ot.current)), ve = Math.max(ve, 0), ve;
  }
  var _e = q <= 0, Re = q >= Tt, de = F <= 0, fe = F >= w, ue = Ap(_e, Re, de, fe), Pe = function() {
    return {
      x: W ? -F : F,
      y: q
    };
  }, nt = ye(Pe()), et = Ot(function(le) {
    if (b) {
      var ve = re(re({}, Pe()), le);
      (nt.current.x !== ve.x || nt.current.y !== ve.y) && (b(ve), nt.current = ve);
    }
  });
  function Ve(le, ve) {
    var Me = le;
    ve ? (Ya(function() {
      G(Me);
    }), et()) : pe(Me);
  }
  function Xt(le) {
    var ve = le.currentTarget.scrollTop;
    ve !== q && pe(ve), p == null || p(le), et();
  }
  var yt = function(ve) {
    var Me = ve, Oe = w ? w - Fe.width : 0;
    return Me = Math.max(Me, 0), Me = Math.min(Me, Oe), Me;
  }, It = Ot(function(le, ve) {
    ve ? (Ya(function() {
      G(function(Me) {
        var Oe = Me + (W ? -le : le);
        return yt(Oe);
      });
    }), et()) : pe(function(Me) {
      var Oe = Me + le;
      return Oe;
    });
  }), Zt = FS(T, _e, Re, de, fe, !!w, It), An = ae(Zt, 2), Ft = An[0], Et = An[1];
  jS(T, V, function(le, ve, Me, Oe) {
    var Ye = Oe;
    return ue(le, ve, Me) ? !1 : !Ye || !Ye._virtualHandled ? (Ye && (Ye._virtualHandled = !0), Ft({
      preventDefault: function() {
      },
      deltaX: le ? ve : 0,
      deltaY: le ? 0 : ve
    }), !0) : !1;
  }), VS(B, V, function(le) {
    pe(function(ve) {
      return ve + le;
    });
  }), ht(function() {
    function le(Me) {
      var Oe = _e && Me.detail < 0, Ye = Re && Me.detail > 0;
      T && !Oe && !Ye && Me.preventDefault();
    }
    var ve = V.current;
    return ve.addEventListener("wheel", Ft, {
      passive: !1
    }), ve.addEventListener("DOMMouseScroll", Et, {
      passive: !0
    }), ve.addEventListener("MozMousePixelScroll", le, {
      passive: !1
    }), function() {
      ve.removeEventListener("wheel", Ft), ve.removeEventListener("DOMMouseScroll", Et), ve.removeEventListener("MozMousePixelScroll", le);
    };
  }, [T, _e, Re]), ht(function() {
    if (w) {
      var le = yt(F);
      G(le), et({
        x: le
      });
    }
  }, [Fe.width, w]);
  var Qt = function() {
    var ve, Me;
    (ve = st.current) === null || ve === void 0 || ve.delayHidden(), (Me = pt.current) === null || Me === void 0 || Me.delayHidden();
  }, Ht = US(V, U, N, a, k, function() {
    return L(!0);
  }, pe, Qt);
  h.useImperativeHandle(t, function() {
    return {
      nativeElement: se.current,
      getScrollInfo: Pe,
      scrollTo: function(ve) {
        function Me(Oe) {
          return Oe && wt(Oe) === "object" && ("left" in Oe || "top" in Oe);
        }
        Me(ve) ? (ve.left !== void 0 && G(yt(ve.left)), Ht(ve.top)) : Ht(ve);
      }
    };
  }), ht(function() {
    if (C) {
      var le = U.slice(Xe, Je + 1);
      C(le, U);
    }
  }, [Xe, Je, U]);
  var Jt = HS(U, k, N, a), At = S == null ? void 0 : S({
    start: Xe,
    end: Je,
    virtual: B,
    offsetX: F,
    offsetY: je,
    rtl: W,
    getSize: Jt
  }), cn = LS(U, Xe, Je, w, F, A, u, we), Pt = null;
  i && (Pt = re(xe({}, l ? "height" : "maxHeight", i), XS), T && (Pt.overflowY = "hidden", w && (Pt.overflowX = "hidden"), oe && (Pt.pointerEvents = "none")));
  var Sn = {};
  return W && (Sn.dir = "rtl"), /* @__PURE__ */ h.createElement("div", $e({
    ref: se,
    style: re(re({}, c), {}, {
      position: "relative"
    }),
    className: Y
  }, Sn, P), /* @__PURE__ */ h.createElement(mr, {
    onResize: vt
  }, /* @__PURE__ */ h.createElement(v, {
    className: "".concat(r, "-holder"),
    style: Pt,
    ref: V,
    onScroll: Xt,
    onMouseEnter: Qt
  }, /* @__PURE__ */ h.createElement(Ip, {
    prefixCls: r,
    height: Ie,
    offsetX: F,
    offsetY: je,
    scrollWidth: w,
    onInnerResize: L,
    ref: Z,
    innerProps: x,
    rtl: W,
    extra: At
  }, cn))), B && Ie > i && /* @__PURE__ */ h.createElement(Sc, {
    ref: st,
    prefixCls: r,
    scrollOffset: q,
    scrollRange: Ie,
    rtl: W,
    onScroll: Ve,
    onStartMove: ne,
    onStopMove: be,
    spinSize: St,
    containerSize: Fe.height,
    style: E == null ? void 0 : E.verticalScrollBar,
    thumbStyle: E == null ? void 0 : E.verticalScrollBarThumb,
    showScrollBar: _
  }), B && w > Fe.width && /* @__PURE__ */ h.createElement(Sc, {
    ref: pt,
    prefixCls: r,
    scrollOffset: F,
    scrollRange: w,
    rtl: W,
    onScroll: Ve,
    onStartMove: ne,
    onStopMove: be,
    spinSize: zt,
    containerSize: Fe.width,
    horizontal: !0,
    style: E == null ? void 0 : E.horizontalScrollBar,
    thumbStyle: E == null ? void 0 : E.horizontalScrollBarThumb,
    showScrollBar: _
  }));
}
var Lp = /* @__PURE__ */ h.forwardRef(ZS);
Lp.displayName = "List";
const QS = (e, t) => {
  const n = [], r = (o) => {
    var i;
    if (n.push(o.key), t === o.key || (i = o.children) != null && i.length && o.children.some(r))
      return !0;
    n.pop();
  };
  return e.some(r), n;
}, $p = (e, t) => {
  const n = t != null ? t : /* @__PURE__ */ new Map();
  let r = e;
  return {
    findNodePathFromTreeWithCache: (o) => {
      const i = n.get(o);
      if (i)
        return i;
      const a = QS(r, o);
      return a.map((l, c, f) => {
        const u = [];
        for (let y = 0; y <= c; y++)
          u.push(f[y]);
        return u;
      }).reverse().forEach((l) => {
        const c = l[l.length - 1];
        n.set(c, l);
      }), a;
    },
    reset: (o) => {
      n.clear(), o && (r = o);
    }
  };
}, Ps = (e, t) => t.length ? t.reduce((n, r) => {
  const o = n.find((i) => i.key === r);
  return (o == null ? void 0 : o.children) || [];
}, e) : e, JS = (e, t) => {
  const n = t.slice(0), r = n.pop();
  return Ps(e, n).find((i) => i.key === r);
}, tR = (e, t, n) => {
  const r = new Set(t), o = n[n.length - 1], i = Ps(e, n);
  if (r.has(o)) {
    if (i.length) {
      const s = (l) => {
        r.delete(l.key), l.children && l.children.forEach((c) => s(c));
      };
      i.forEach(s);
    }
    n.map((s, l, c) => {
      const f = [];
      for (let u = 0; u <= l; u++)
        f.push(c[u]);
      return f;
    }).reverse().some((s) => {
      const l = Ps(e, s), c = s[s.length - 1];
      if (l.every((f) => !r.has(f.key)))
        r.delete(c);
      else
        return !0;
      return !1;
    });
  } else {
    const a = (s) => {
      r.add(s.key), s.children && s.children.forEach((l) => a(l));
    };
    n.forEach((s) => r.add(s)), i.length && i.forEach(a);
  }
  return [...r];
}, eE = (e, t) => {
  const n = t.children || [], r = (o) => {
    var i;
    return (i = o.children) != null && i.length ? !!o.children.every(r) : e.has(o.key);
  };
  return n.length ? n.some((o) => !r(o)) : !1;
}, nR = (e, t) => {
  const n = [], r = $p(e);
  return t.forEach((o) => {
    var s;
    const i = r.findNodePathFromTreeWithCache(o), a = JS(e, i);
    a && ((s = a.children) != null && s.length || n.push(a));
  }), n;
};
var tE = /* @__PURE__ */ ((e) => (e[e.ONLY_LEAF_NODE = 0] = "ONLY_LEAF_NODE", e[e.ALL = 1] = "ALL", e))(tE || {});
function zp(e, t, n = 1) {
  const r = [];
  return e.forEach((o) => {
    r.push({ ...o, level: n }), o.children && t.has(o.key) && r.push(...zp(o.children, t, n + 1));
  }), r;
}
function rR(e) {
  const { data: t = [], defaultCache: n, style: r, defaultExpandAll: o = !1, selectionMode: i = 1, valueGroup: a = [], onChange: s, onExpend: l, height: c = 200, itemHeight: f = 32, attachRender: u } = e, [y, m] = De({}), g = lt(() => /* @__PURE__ */ new Set(), []), w = lt(() => $p(t, n), [t, n]), d = lt(() => {
    const C = /* @__PURE__ */ new Set();
    return a.forEach((x) => {
      w.findNodePathFromTreeWithCache(x).forEach((E) => C.add(E));
    }), C;
  }, [a, w]);
  qe(() => {
    function C(x) {
      var S;
      g.add(x.key), (S = x.children) == null || S.forEach(C);
    }
    o && t.forEach(C), m({});
  }, [o, t]);
  const v = lt(() => zp(t, g), [t, y, g]);
  function p(C) {
    var x;
    (x = C.children) != null && x.length && (g.has(C.key) ? g.delete(C.key) : g.add(C.key), m({})), !(i === 0 && C.children) && (l == null || l(C.key));
  }
  function b(C) {
    const { title: x, key: S, level: E = 0 } = C, M = e.treeNodeClassName, _ = g.has(S), P = d.has(S), k = eE(d, C);
    return /* @__PURE__ */ R(
      "div",
      {
        className: ie("univer-tree-list-item", M),
        style: { paddingLeft: `${E * 20}px` },
        children: /* @__PURE__ */ me(
          "div",
          {
            className: ie("univer-tree-list-item-content", {
              "univer-tree-list-item-content-selected": P
            }),
            children: [
              C.children && C.children.length > 0 && /* @__PURE__ */ R(
                "span",
                {
                  className: ie("univer-tree-icon", {
                    "univer-tree-icon-expand": _
                  }),
                  onClick: (I) => {
                    I.stopPropagation(), p(C);
                  },
                  children: /* @__PURE__ */ R(Oc, {})
                }
              ),
              /* @__PURE__ */ R(
                im,
                {
                  checked: P && !k,
                  indeterminate: P && k,
                  onChange: () => {
                    s == null || s(C);
                  }
                }
              ),
              /* @__PURE__ */ R(
                "div",
                {
                  className: "univer-tree-list-item-title",
                  onClick: (I) => {
                    I.stopPropagation(), p(C);
                  },
                  children: /* @__PURE__ */ R(Np, { className: "univer-block", showIfEllipsis: !0, placement: "top", title: x, children: /* @__PURE__ */ R("span", { className: "univer-block", children: x }) })
                }
              ),
              u && u(C)
            ]
          }
        )
      },
      S
    );
  }
  return /* @__PURE__ */ R("section", { className: "univer-tree", children: /* @__PURE__ */ R("div", { className: "univer-tree-list", style: r, children: /* @__PURE__ */ R(
    Lp,
    {
      data: v,
      itemKey: (C) => C.key,
      height: c,
      itemHeight: f,
      children: (C) => b(C)
    }
  ) }) });
}
const Hi = /* @__PURE__ */ new WeakMap();
function oR(e, t) {
  let n = Hi.get(t);
  n || (n = Wp(t), Hi.set(t, n)), n.render(e);
}
function iR(e) {
  const t = Hi.get(e);
  t && (t.unmount(), Hi.delete(e));
}
const Ka = /* @__PURE__ */ new Set();
let di;
function aR(e) {
  return di || (di = new ResizeObserver((...t) => {
    Ka.forEach((n) => n(...t));
  })), {
    observe(t, n) {
      Ka.add(e), di.observe(t, n);
    },
    unobserve(t) {
      Ka.delete(e), di.unobserve(t);
    }
  };
}
export {
  aE as Accordion,
  sE as Avatar,
  Bh as Badge,
  fr as Button,
  uE as ButtonGroup,
  Za as Calendar,
  mE as CascaderList,
  im as Checkbox,
  gE as CheckboxGroup,
  bE as ColorPicker,
  Tn as ConfigContext,
  lE as ConfigProvider,
  wE as Confirm,
  xE as DatePicker,
  CE as DateRangePicker,
  Ad as Dialog,
  PE as DraggableList,
  mf as Dropdown,
  NE as DropdownLegacy,
  rp as DropdownMenu,
  _E as FormDualColumnLayout,
  DE as FormLayout,
  OE as Gallery,
  kE as HoverCard,
  eC as Input,
  TE as InputNumber,
  IE as KBD,
  AE as Menu,
  LE as MenuItem,
  zE as MenuItemGroup,
  GC as MessageType,
  HE as Messager,
  YE as MultipleSelect,
  Fx as Pager,
  jE as Popup,
  qE as Radio,
  VE as RadioGroup,
  hb as ReactGridLayout,
  UE as Segmented,
  KE as Select,
  GE as SelectList,
  XE as Separator,
  $E as SubMenu,
  ZE as Switch,
  QE as Textarea,
  nm as TimeInput,
  FE as TinyMenuGroup,
  eR as Toaster,
  Np as Tooltip,
  rR as Tree,
  tE as TreeSelectionMode,
  fE as borderBottomClassName,
  kt as borderClassName,
  cE as borderLeftBottomClassName,
  tm as borderLeftClassName,
  vE as borderRightClassName,
  dE as borderTopClassName,
  ie as clsx,
  lR as defaultTheme,
  hE as divideXClassName,
  pE as divideYClassName,
  nR as filterLeafNode,
  QS as findNodePathFromTree,
  Ps as findSubTreeFromPath,
  cR as greenTheme,
  Is as isBrowser,
  tR as mergeTreeSelected,
  WE as message,
  BE as removeMessage,
  oR as render,
  aR as resizeObserverCtor,
  vr as scrollbarClassName,
  JE as toast,
  iR as unmount
};
