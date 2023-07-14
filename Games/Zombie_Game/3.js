!(function (e, t) {
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e.document
        ? t(e, !0)
        : function (e) {
            if (!e.document)
              throw new Error("jQuery requires a window with a document");
            return t(e);
          })
    : t(e);
})("undefined" != typeof window ? window : this, function (e, t) {
  function n(e) {
    var t = "length" in e && e.length,
      n = Z.type(e);
    return (
      "function" !== n &&
      !Z.isWindow(e) &&
      (!(1 !== e.nodeType || !t) ||
        "array" === n ||
        0 === t ||
        ("number" == typeof t && t > 0 && t - 1 in e))
    );
  }
  function r(e, t, n) {
    if (Z.isFunction(t))
      return Z.grep(e, function (e, r) {
        return !!t.call(e, r, e) !== n;
      });
    if (t.nodeType)
      return Z.grep(e, function (e) {
        return (e === t) !== n;
      });
    if ("string" == typeof t) {
      if (ae.test(t)) return Z.filter(t, e, n);
      t = Z.filter(t, e);
    }
    return Z.grep(e, function (e) {
      return $.call(t, e) >= 0 !== n;
    });
  }
  function i(e, t) {
    for (; (e = e[t]) && 1 !== e.nodeType; );
    return e;
  }
  function s(e) {
    var t = (fe[e] = {});
    return (
      Z.each(e.match(pe) || [], function (e, n) {
        t[n] = !0;
      }),
      t
    );
  }
  function o() {
    K.removeEventListener("DOMContentLoaded", o, !1),
      e.removeEventListener("load", o, !1),
      Z.ready();
  }
  function a() {
    Object.defineProperty((this.cache = {}), 0, {
      get: function () {
        return {};
      },
    }),
      (this.expando = Z.expando + a.uid++);
  }
  function u(e, t, n) {
    var r;
    if (void 0 === n && 1 === e.nodeType)
      if (
        ((r = "data-" + t.replace(be, "-$1").toLowerCase()),
        (n = e.getAttribute(r)),
        "string" == typeof n)
      ) {
        try {
          n =
            "true" === n ||
            ("false" !== n &&
              ("null" === n
                ? null
                : +n + "" === n
                ? +n
                : ye.test(n)
                ? Z.parseJSON(n)
                : n));
        } catch (i) {}
        _e.set(e, t, n);
      } else n = void 0;
    return n;
  }
  function c() {
    return !0;
  }
  function l() {
    return !1;
  }
  function d() {
    try {
      return K.activeElement;
    } catch (e) {}
  }
  function h(e, t) {
    return Z.nodeName(e, "table") &&
      Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr")
      ? e.getElementsByTagName("tbody")[0] ||
          e.appendChild(e.ownerDocument.createElement("tbody"))
      : e;
  }
  function p(e) {
    return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
  }
  function f(e) {
    var t = Ie.exec(e.type);
    return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
  }
  function g(e, t) {
    for (var n = 0, r = e.length; n < r; n++)
      ve.set(e[n], "globalEval", !t || ve.get(t[n], "globalEval"));
  }
  function m(e, t) {
    var n, r, i, s, o, a, u, c;
    if (1 === t.nodeType) {
      if (
        ve.hasData(e) &&
        ((s = ve.access(e)), (o = ve.set(t, s)), (c = s.events))
      ) {
        delete o.handle, (o.events = {});
        for (i in c)
          for (n = 0, r = c[i].length; n < r; n++) Z.event.add(t, i, c[i][n]);
      }
      _e.hasData(e) &&
        ((a = _e.access(e)), (u = Z.extend({}, a)), _e.set(t, u));
    }
  }
  function v(e, t) {
    var n = e.getElementsByTagName
      ? e.getElementsByTagName(t || "*")
      : e.querySelectorAll
      ? e.querySelectorAll(t || "*")
      : [];
    return void 0 === t || (t && Z.nodeName(e, t)) ? Z.merge([e], n) : n;
  }
  function _(e, t) {
    var n = t.nodeName.toLowerCase();
    "input" === n && Se.test(e.type)
      ? (t.checked = e.checked)
      : ("input" !== n && "textarea" !== n) ||
        (t.defaultValue = e.defaultValue);
  }
  function y(t, n) {
    var r,
      i = Z(n.createElement(t)).appendTo(n.body),
      s =
        e.getDefaultComputedStyle && (r = e.getDefaultComputedStyle(i[0]))
          ? r.display
          : Z.css(i[0], "display");
    return i.detach(), s;
  }
  function b(e) {
    var t = K,
      n = Ue[e];
    return (
      n ||
        ((n = y(e, t)),
        ("none" !== n && n) ||
          ((Oe = (
            Oe || Z("<iframe frameborder='0' width='0' height='0'/>")
          ).appendTo(t.documentElement)),
          (t = Oe[0].contentDocument),
          t.write(),
          t.close(),
          (n = y(e, t)),
          Oe.detach()),
        (Ue[e] = n)),
      n
    );
  }
  function T(e, t, n) {
    var r,
      i,
      s,
      o,
      a = e.style;
    return (
      (n = n || Xe(e)),
      n && (o = n.getPropertyValue(t) || n[t]),
      n &&
        ("" !== o || Z.contains(e.ownerDocument, e) || (o = Z.style(e, t)),
        Be.test(o) &&
          Fe.test(t) &&
          ((r = a.width),
          (i = a.minWidth),
          (s = a.maxWidth),
          (a.minWidth = a.maxWidth = a.width = o),
          (o = n.width),
          (a.width = r),
          (a.minWidth = i),
          (a.maxWidth = s))),
      void 0 !== o ? o + "" : o
    );
  }
  function x(e, t) {
    return {
      get: function () {
        return e()
          ? void delete this.get
          : (this.get = t).apply(this, arguments);
      },
    };
  }
  function E(e, t) {
    if (t in e) return t;
    for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Ge.length; i--; )
      if (((t = Ge[i] + n), t in e)) return t;
    return r;
  }
  function S(e, t, n) {
    var r = We.exec(t);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t;
  }
  function j(e, t, n, r, i) {
    for (
      var s = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0,
        o = 0;
      s < 4;
      s += 2
    )
      "margin" === n && (o += Z.css(e, n + xe[s], !0, i)),
        r
          ? ("content" === n && (o -= Z.css(e, "padding" + xe[s], !0, i)),
            "margin" !== n &&
              (o -= Z.css(e, "border" + xe[s] + "Width", !0, i)))
          : ((o += Z.css(e, "padding" + xe[s], !0, i)),
            "padding" !== n &&
              (o += Z.css(e, "border" + xe[s] + "Width", !0, i)));
    return o;
  }
  function P(e, t, n) {
    var r = !0,
      i = "width" === t ? e.offsetWidth : e.offsetHeight,
      s = Xe(e),
      o = "border-box" === Z.css(e, "boxSizing", !1, s);
    if (i <= 0 || null == i) {
      if (
        ((i = T(e, t, s)), (i < 0 || null == i) && (i = e.style[t]), Be.test(i))
      )
        return i;
      (r = o && (J.boxSizingReliable() || i === e.style[t])),
        (i = parseFloat(i) || 0);
    }
    return i + j(e, t, n || (o ? "border" : "content"), r, s) + "px";
  }
  function w(e, t) {
    for (var n, r, i, s = [], o = 0, a = e.length; o < a; o++)
      (r = e[o]),
        r.style &&
          ((s[o] = ve.get(r, "olddisplay")),
          (n = r.style.display),
          t
            ? (s[o] || "none" !== n || (r.style.display = ""),
              "" === r.style.display &&
                Ee(r) &&
                (s[o] = ve.access(r, "olddisplay", b(r.nodeName))))
            : ((i = Ee(r)),
              ("none" === n && i) ||
                ve.set(r, "olddisplay", i ? n : Z.css(r, "display"))));
    for (o = 0; o < a; o++)
      (r = e[o]),
        r.style &&
          ((t && "none" !== r.style.display && "" !== r.style.display) ||
            (r.style.display = t ? s[o] || "" : "none"));
    return e;
  }
  function A(e, t, n, r, i) {
    return new A.prototype.init(e, t, n, r, i);
  }
  function L() {
    return (
      setTimeout(function () {
        Je = void 0;
      }),
      (Je = Z.now())
    );
  }
  function C(e, t) {
    var n,
      r = 0,
      i = { height: e };
    for (t = t ? 1 : 0; r < 4; r += 2 - t)
      (n = xe[r]), (i["margin" + n] = i["padding" + n] = e);
    return t && (i.opacity = i.width = e), i;
  }
  function N(e, t, n) {
    for (
      var r, i = (nt[t] || []).concat(nt["*"]), s = 0, o = i.length;
      s < o;
      s++
    )
      if ((r = i[s].call(n, t, e))) return r;
  }
  function D(e, t, n) {
    var r,
      i,
      s,
      o,
      a,
      u,
      c,
      l,
      d = this,
      h = {},
      p = e.style,
      f = e.nodeType && Ee(e),
      g = ve.get(e, "fxshow");
    n.queue ||
      ((a = Z._queueHooks(e, "fx")),
      null == a.unqueued &&
        ((a.unqueued = 0),
        (u = a.empty.fire),
        (a.empty.fire = function () {
          a.unqueued || u();
        })),
      a.unqueued++,
      d.always(function () {
        d.always(function () {
          a.unqueued--, Z.queue(e, "fx").length || a.empty.fire();
        });
      })),
      1 === e.nodeType &&
        ("height" in t || "width" in t) &&
        ((n.overflow = [p.overflow, p.overflowX, p.overflowY]),
        (c = Z.css(e, "display")),
        (l = "none" === c ? ve.get(e, "olddisplay") || b(e.nodeName) : c),
        "inline" === l &&
          "none" === Z.css(e, "float") &&
          (p.display = "inline-block")),
      n.overflow &&
        ((p.overflow = "hidden"),
        d.always(function () {
          (p.overflow = n.overflow[0]),
            (p.overflowX = n.overflow[1]),
            (p.overflowY = n.overflow[2]);
        }));
    for (r in t)
      if (((i = t[r]), Qe.exec(i))) {
        if (
          (delete t[r], (s = s || "toggle" === i), i === (f ? "hide" : "show"))
        ) {
          if ("show" !== i || !g || void 0 === g[r]) continue;
          f = !0;
        }
        h[r] = (g && g[r]) || Z.style(e, r);
      } else c = void 0;
    if (Z.isEmptyObject(h))
      "inline" === ("none" === c ? b(e.nodeName) : c) && (p.display = c);
    else {
      g ? "hidden" in g && (f = g.hidden) : (g = ve.access(e, "fxshow", {})),
        s && (g.hidden = !f),
        f
          ? Z(e).show()
          : d.done(function () {
              Z(e).hide();
            }),
        d.done(function () {
          var t;
          ve.remove(e, "fxshow");
          for (t in h) Z.style(e, t, h[t]);
        });
      for (r in h)
        (o = N(f ? g[r] : 0, r, d)),
          r in g ||
            ((g[r] = o.start),
            f &&
              ((o.end = o.start),
              (o.start = "width" === r || "height" === r ? 1 : 0)));
    }
  }
  function R(e, t) {
    var n, r, i, s, o;
    for (n in e)
      if (
        ((r = Z.camelCase(n)),
        (i = t[r]),
        (s = e[n]),
        Z.isArray(s) && ((i = s[1]), (s = e[n] = s[0])),
        n !== r && ((e[r] = s), delete e[n]),
        (o = Z.cssHooks[r]),
        o && "expand" in o)
      ) {
        (s = o.expand(s)), delete e[r];
        for (n in s) n in e || ((e[n] = s[n]), (t[n] = i));
      } else t[r] = i;
  }
  function k(e, t, n) {
    var r,
      i,
      s = 0,
      o = tt.length,
      a = Z.Deferred().always(function () {
        delete u.elem;
      }),
      u = function () {
        if (i) return !1;
        for (
          var t = Je || L(),
            n = Math.max(0, c.startTime + c.duration - t),
            r = n / c.duration || 0,
            s = 1 - r,
            o = 0,
            u = c.tweens.length;
          o < u;
          o++
        )
          c.tweens[o].run(s);
        return (
          a.notifyWith(e, [c, s, n]),
          s < 1 && u ? n : (a.resolveWith(e, [c]), !1)
        );
      },
      c = a.promise({
        elem: e,
        props: Z.extend({}, t),
        opts: Z.extend(!0, { specialEasing: {} }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: Je || L(),
        duration: n.duration,
        tweens: [],
        createTween: function (t, n) {
          var r = Z.Tween(
            e,
            c.opts,
            t,
            n,
            c.opts.specialEasing[t] || c.opts.easing
          );
          return c.tweens.push(r), r;
        },
        stop: function (t) {
          var n = 0,
            r = t ? c.tweens.length : 0;
          if (i) return this;
          for (i = !0; n < r; n++) c.tweens[n].run(1);
          return t ? a.resolveWith(e, [c, t]) : a.rejectWith(e, [c, t]), this;
        },
      }),
      l = c.props;
    for (R(l, c.opts.specialEasing); s < o; s++)
      if ((r = tt[s].call(c, e, l, c.opts))) return r;
    return (
      Z.map(l, N, c),
      Z.isFunction(c.opts.start) && c.opts.start.call(e, c),
      Z.fx.timer(Z.extend(u, { elem: e, anim: c, queue: c.opts.queue })),
      c
        .progress(c.opts.progress)
        .done(c.opts.done, c.opts.complete)
        .fail(c.opts.fail)
        .always(c.opts.always)
    );
  }
  function H(e) {
    return function (t, n) {
      "string" != typeof t && ((n = t), (t = "*"));
      var r,
        i = 0,
        s = t.toLowerCase().match(pe) || [];
      if (Z.isFunction(n))
        for (; (r = s[i++]); )
          "+" === r[0]
            ? ((r = r.slice(1) || "*"), (e[r] = e[r] || []).unshift(n))
            : (e[r] = e[r] || []).push(n);
    };
  }
  function I(e, t, n, r) {
    function i(a) {
      var u;
      return (
        (s[a] = !0),
        Z.each(e[a] || [], function (e, a) {
          var c = a(t, n, r);
          return "string" != typeof c || o || s[c]
            ? o
              ? !(u = c)
              : void 0
            : (t.dataTypes.unshift(c), i(c), !1);
        }),
        u
      );
    }
    var s = {},
      o = e === yt;
    return i(t.dataTypes[0]) || (!s["*"] && i("*"));
  }
  function q(e, t) {
    var n,
      r,
      i = Z.ajaxSettings.flatOptions || {};
    for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
    return r && Z.extend(!0, e, r), e;
  }
  function M(e, t, n) {
    for (var r, i, s, o, a = e.contents, u = e.dataTypes; "*" === u[0]; )
      u.shift(),
        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
    if (r)
      for (i in a)
        if (a[i] && a[i].test(r)) {
          u.unshift(i);
          break;
        }
    if (u[0] in n) s = u[0];
    else {
      for (i in n) {
        if (!u[0] || e.converters[i + " " + u[0]]) {
          s = i;
          break;
        }
        o || (o = i);
      }
      s = s || o;
    }
    if (s) return s !== u[0] && u.unshift(s), n[s];
  }
  function O(e, t, n, r) {
    var i,
      s,
      o,
      a,
      u,
      c = {},
      l = e.dataTypes.slice();
    if (l[1]) for (o in e.converters) c[o.toLowerCase()] = e.converters[o];
    for (s = l.shift(); s; )
      if (
        (e.responseFields[s] && (n[e.responseFields[s]] = t),
        !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
        (u = s),
        (s = l.shift()))
      )
        if ("*" === s) s = u;
        else if ("*" !== u && u !== s) {
          if (((o = c[u + " " + s] || c["* " + s]), !o))
            for (i in c)
              if (
                ((a = i.split(" ")),
                a[1] === s && (o = c[u + " " + a[0]] || c["* " + a[0]]))
              ) {
                o === !0
                  ? (o = c[i])
                  : c[i] !== !0 && ((s = a[0]), l.unshift(a[1]));
                break;
              }
          if (o !== !0)
            if (o && e["throws"]) t = o(t);
            else
              try {
                t = o(t);
              } catch (d) {
                return {
                  state: "parsererror",
                  error: o ? d : "No conversion from " + u + " to " + s,
                };
              }
        }
    return { state: "success", data: t };
  }
  function U(e, t, n, r) {
    var i;
    if (Z.isArray(t))
      Z.each(t, function (t, i) {
        n || St.test(e)
          ? r(e, i)
          : U(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r);
      });
    else if (n || "object" !== Z.type(t)) r(e, t);
    else for (i in t) U(e + "[" + i + "]", t[i], n, r);
  }
  function F(e) {
    return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView;
  }
  var B = [],
    X = B.slice,
    V = B.concat,
    W = B.push,
    $ = B.indexOf,
    Y = {},
    z = Y.toString,
    G = Y.hasOwnProperty,
    J = {},
    K = e.document,
    Q = "2.1.4",
    Z = function (e, t) {
      return new Z.fn.init(e, t);
    },
    ee = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    te = /^-ms-/,
    ne = /-([\da-z])/gi,
    re = function (e, t) {
      return t.toUpperCase();
    };
  (Z.fn = Z.prototype =
    {
      jquery: Q,
      constructor: Z,
      selector: "",
      length: 0,
      toArray: function () {
        return X.call(this);
      },
      get: function (e) {
        return null != e
          ? e < 0
            ? this[e + this.length]
            : this[e]
          : X.call(this);
      },
      pushStack: function (e) {
        var t = Z.merge(this.constructor(), e);
        return (t.prevObject = this), (t.context = this.context), t;
      },
      each: function (e, t) {
        return Z.each(this, e, t);
      },
      map: function (e) {
        return this.pushStack(
          Z.map(this, function (t, n) {
            return e.call(t, n, t);
          })
        );
      },
      slice: function () {
        return this.pushStack(X.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      eq: function (e) {
        var t = this.length,
          n = +e + (e < 0 ? t : 0);
        return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
      },
      end: function () {
        return this.prevObject || this.constructor(null);
      },
      push: W,
      sort: B.sort,
      splice: B.splice,
    }),
    (Z.extend = Z.fn.extend =
      function () {
        var e,
          t,
          n,
          r,
          i,
          s,
          o = arguments[0] || {},
          a = 1,
          u = arguments.length,
          c = !1;
        for (
          "boolean" == typeof o && ((c = o), (o = arguments[a] || {}), a++),
            "object" == typeof o || Z.isFunction(o) || (o = {}),
            a === u && ((o = this), a--);
          a < u;
          a++
        )
          if (null != (e = arguments[a]))
            for (t in e)
              (n = o[t]),
                (r = e[t]),
                o !== r &&
                  (c && r && (Z.isPlainObject(r) || (i = Z.isArray(r)))
                    ? (i
                        ? ((i = !1), (s = n && Z.isArray(n) ? n : []))
                        : (s = n && Z.isPlainObject(n) ? n : {}),
                      (o[t] = Z.extend(c, s, r)))
                    : void 0 !== r && (o[t] = r));
        return o;
      }),
    Z.extend({
      expando: "jQuery" + (Q + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function (e) {
        throw new Error(e);
      },
      noop: function () {},
      isFunction: function (e) {
        return "function" === Z.type(e);
      },
      isArray: Array.isArray,
      isWindow: function (e) {
        return null != e && e === e.window;
      },
      isNumeric: function (e) {
        return !Z.isArray(e) && e - parseFloat(e) + 1 >= 0;
      },
      isPlainObject: function (e) {
        return (
          "object" === Z.type(e) &&
          !e.nodeType &&
          !Z.isWindow(e) &&
          !(e.constructor && !G.call(e.constructor.prototype, "isPrototypeOf"))
        );
      },
      isEmptyObject: function (e) {
        var t;
        for (t in e) return !1;
        return !0;
      },
      type: function (e) {
        return null == e
          ? e + ""
          : "object" == typeof e || "function" == typeof e
          ? Y[z.call(e)] || "object"
          : typeof e;
      },
      globalEval: function (e) {
        var t,
          n = eval;
        (e = Z.trim(e)),
          e &&
            (1 === e.indexOf("use strict")
              ? ((t = K.createElement("script")),
                (t.text = e),
                K.head.appendChild(t).parentNode.removeChild(t))
              : n(e));
      },
      camelCase: function (e) {
        return e.replace(te, "ms-").replace(ne, re);
      },
      nodeName: function (e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
      },
      each: function (e, t, r) {
        var i,
          s = 0,
          o = e.length,
          a = n(e);
        if (r) {
          if (a) for (; s < o && ((i = t.apply(e[s], r)), i !== !1); s++);
          else for (s in e) if (((i = t.apply(e[s], r)), i === !1)) break;
        } else if (a)
          for (; s < o && ((i = t.call(e[s], s, e[s])), i !== !1); s++);
        else for (s in e) if (((i = t.call(e[s], s, e[s])), i === !1)) break;
        return e;
      },
      trim: function (e) {
        return null == e ? "" : (e + "").replace(ee, "");
      },
      makeArray: function (e, t) {
        var r = t || [];
        return (
          null != e &&
            (n(Object(e))
              ? Z.merge(r, "string" == typeof e ? [e] : e)
              : W.call(r, e)),
          r
        );
      },
      inArray: function (e, t, n) {
        return null == t ? -1 : $.call(t, e, n);
      },
      merge: function (e, t) {
        for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
        return (e.length = i), e;
      },
      grep: function (e, t, n) {
        for (var r, i = [], s = 0, o = e.length, a = !n; s < o; s++)
          (r = !t(e[s], s)), r !== a && i.push(e[s]);
        return i;
      },
      map: function (e, t, r) {
        var i,
          s = 0,
          o = e.length,
          a = n(e),
          u = [];
        if (a) for (; s < o; s++) (i = t(e[s], s, r)), null != i && u.push(i);
        else for (s in e) (i = t(e[s], s, r)), null != i && u.push(i);
        return V.apply([], u);
      },
      guid: 1,
      proxy: function (e, t) {
        var n, r, i;
        if (
          ("string" == typeof t && ((n = e[t]), (t = e), (e = n)),
          Z.isFunction(e))
        )
          return (
            (r = X.call(arguments, 2)),
            (i = function () {
              return e.apply(t || this, r.concat(X.call(arguments)));
            }),
            (i.guid = e.guid = e.guid || Z.guid++),
            i
          );
      },
      now: Date.now,
      support: J,
    }),
    Z.each(
      "Boolean Number String Function Array Date RegExp Object Error".split(
        " "
      ),
      function (e, t) {
        Y["[object " + t + "]"] = t.toLowerCase();
      }
    );
  var ie = (function (e) {
    function t(e, t, n, r) {
      var i, s, o, a, u, c, d, p, f, g;
      if (
        ((t ? t.ownerDocument || t : U) !== D && N(t),
        (t = t || D),
        (n = n || []),
        (a = t.nodeType),
        "string" != typeof e || !e || (1 !== a && 9 !== a && 11 !== a))
      )
        return n;
      if (!r && k) {
        if (11 !== a && (i = _e.exec(e)))
          if ((o = i[1])) {
            if (9 === a) {
              if (((s = t.getElementById(o)), !s || !s.parentNode)) return n;
              if (s.id === o) return n.push(s), n;
            } else if (
              t.ownerDocument &&
              (s = t.ownerDocument.getElementById(o)) &&
              M(t, s) &&
              s.id === o
            )
              return n.push(s), n;
          } else {
            if (i[2]) return Q.apply(n, t.getElementsByTagName(e)), n;
            if ((o = i[3]) && T.getElementsByClassName)
              return Q.apply(n, t.getElementsByClassName(o)), n;
          }
        if (T.qsa && (!H || !H.test(e))) {
          if (
            ((p = d = O),
            (f = t),
            (g = 1 !== a && e),
            1 === a && "object" !== t.nodeName.toLowerCase())
          ) {
            for (
              c = j(e),
                (d = t.getAttribute("id"))
                  ? (p = d.replace(be, "\\$&"))
                  : t.setAttribute("id", p),
                p = "[id='" + p + "'] ",
                u = c.length;
              u--;

            )
              c[u] = p + h(c[u]);
            (f = (ye.test(e) && l(t.parentNode)) || t), (g = c.join(","));
          }
          if (g)
            try {
              return Q.apply(n, f.querySelectorAll(g)), n;
            } catch (m) {
            } finally {
              d || t.removeAttribute("id");
            }
        }
      }
      return w(e.replace(ue, "$1"), t, n, r);
    }
    function n() {
      function e(n, r) {
        return (
          t.push(n + " ") > x.cacheLength && delete e[t.shift()],
          (e[n + " "] = r)
        );
      }
      var t = [];
      return e;
    }
    function r(e) {
      return (e[O] = !0), e;
    }
    function i(e) {
      var t = D.createElement("div");
      try {
        return !!e(t);
      } catch (n) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), (t = null);
      }
    }
    function s(e, t) {
      for (var n = e.split("|"), r = e.length; r--; ) x.attrHandle[n[r]] = t;
    }
    function o(e, t) {
      var n = t && e,
        r =
          n &&
          1 === e.nodeType &&
          1 === t.nodeType &&
          (~t.sourceIndex || Y) - (~e.sourceIndex || Y);
      if (r) return r;
      if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
      return e ? 1 : -1;
    }
    function a(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return "input" === n && t.type === e;
      };
    }
    function u(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return ("input" === n || "button" === n) && t.type === e;
      };
    }
    function c(e) {
      return r(function (t) {
        return (
          (t = +t),
          r(function (n, r) {
            for (var i, s = e([], n.length, t), o = s.length; o--; )
              n[(i = s[o])] && (n[i] = !(r[i] = n[i]));
          })
        );
      });
    }
    function l(e) {
      return e && "undefined" != typeof e.getElementsByTagName && e;
    }
    function d() {}
    function h(e) {
      for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
      return r;
    }
    function p(e, t, n) {
      var r = t.dir,
        i = n && "parentNode" === r,
        s = B++;
      return t.first
        ? function (t, n, s) {
            for (; (t = t[r]); ) if (1 === t.nodeType || i) return e(t, n, s);
          }
        : function (t, n, o) {
            var a,
              u,
              c = [F, s];
            if (o) {
              for (; (t = t[r]); )
                if ((1 === t.nodeType || i) && e(t, n, o)) return !0;
            } else
              for (; (t = t[r]); )
                if (1 === t.nodeType || i) {
                  if (
                    ((u = t[O] || (t[O] = {})),
                    (a = u[r]) && a[0] === F && a[1] === s)
                  )
                    return (c[2] = a[2]);
                  if (((u[r] = c), (c[2] = e(t, n, o)))) return !0;
                }
          };
    }
    function f(e) {
      return e.length > 1
        ? function (t, n, r) {
            for (var i = e.length; i--; ) if (!e[i](t, n, r)) return !1;
            return !0;
          }
        : e[0];
    }
    function g(e, n, r) {
      for (var i = 0, s = n.length; i < s; i++) t(e, n[i], r);
      return r;
    }
    function m(e, t, n, r, i) {
      for (var s, o = [], a = 0, u = e.length, c = null != t; a < u; a++)
        (s = e[a]) && ((n && !n(s, r, i)) || (o.push(s), c && t.push(a)));
      return o;
    }
    function v(e, t, n, i, s, o) {
      return (
        i && !i[O] && (i = v(i)),
        s && !s[O] && (s = v(s, o)),
        r(function (r, o, a, u) {
          var c,
            l,
            d,
            h = [],
            p = [],
            f = o.length,
            v = r || g(t || "*", a.nodeType ? [a] : a, []),
            _ = !e || (!r && t) ? v : m(v, h, e, a, u),
            y = n ? (s || (r ? e : f || i) ? [] : o) : _;
          if ((n && n(_, y, a, u), i))
            for (c = m(y, p), i(c, [], a, u), l = c.length; l--; )
              (d = c[l]) && (y[p[l]] = !(_[p[l]] = d));
          if (r) {
            if (s || e) {
              if (s) {
                for (c = [], l = y.length; l--; )
                  (d = y[l]) && c.push((_[l] = d));
                s(null, (y = []), c, u);
              }
              for (l = y.length; l--; )
                (d = y[l]) &&
                  (c = s ? ee(r, d) : h[l]) > -1 &&
                  (r[c] = !(o[c] = d));
            }
          } else (y = m(y === o ? y.splice(f, y.length) : y)), s ? s(null, o, y, u) : Q.apply(o, y);
        })
      );
    }
    function _(e) {
      for (
        var t,
          n,
          r,
          i = e.length,
          s = x.relative[e[0].type],
          o = s || x.relative[" "],
          a = s ? 1 : 0,
          u = p(
            function (e) {
              return e === t;
            },
            o,
            !0
          ),
          c = p(
            function (e) {
              return ee(t, e) > -1;
            },
            o,
            !0
          ),
          l = [
            function (e, n, r) {
              var i =
                (!s && (r || n !== A)) ||
                ((t = n).nodeType ? u(e, n, r) : c(e, n, r));
              return (t = null), i;
            },
          ];
        a < i;
        a++
      )
        if ((n = x.relative[e[a].type])) l = [p(f(l), n)];
        else {
          if (((n = x.filter[e[a].type].apply(null, e[a].matches)), n[O])) {
            for (r = ++a; r < i && !x.relative[e[r].type]; r++);
            return v(
              a > 1 && f(l),
              a > 1 &&
                h(
                  e
                    .slice(0, a - 1)
                    .concat({ value: " " === e[a - 2].type ? "*" : "" })
                ).replace(ue, "$1"),
              n,
              a < r && _(e.slice(a, r)),
              r < i && _((e = e.slice(r))),
              r < i && h(e)
            );
          }
          l.push(n);
        }
      return f(l);
    }
    function y(e, n) {
      var i = n.length > 0,
        s = e.length > 0,
        o = function (r, o, a, u, c) {
          var l,
            d,
            h,
            p = 0,
            f = "0",
            g = r && [],
            v = [],
            _ = A,
            y = r || (s && x.find.TAG("*", c)),
            b = (F += null == _ ? 1 : Math.random() || 0.1),
            T = y.length;
          for (c && (A = o !== D && o); f !== T && null != (l = y[f]); f++) {
            if (s && l) {
              for (d = 0; (h = e[d++]); )
                if (h(l, o, a)) {
                  u.push(l);
                  break;
                }
              c && (F = b);
            }
            i && ((l = !h && l) && p--, r && g.push(l));
          }
          if (((p += f), i && f !== p)) {
            for (d = 0; (h = n[d++]); ) h(g, v, o, a);
            if (r) {
              if (p > 0) for (; f--; ) g[f] || v[f] || (v[f] = J.call(u));
              v = m(v);
            }
            Q.apply(u, v),
              c && !r && v.length > 0 && p + n.length > 1 && t.uniqueSort(u);
          }
          return c && ((F = b), (A = _)), g;
        };
      return i ? r(o) : o;
    }
    var b,
      T,
      x,
      E,
      S,
      j,
      P,
      w,
      A,
      L,
      C,
      N,
      D,
      R,
      k,
      H,
      I,
      q,
      M,
      O = "sizzle" + 1 * new Date(),
      U = e.document,
      F = 0,
      B = 0,
      X = n(),
      V = n(),
      W = n(),
      $ = function (e, t) {
        return e === t && (C = !0), 0;
      },
      Y = 1 << 31,
      z = {}.hasOwnProperty,
      G = [],
      J = G.pop,
      K = G.push,
      Q = G.push,
      Z = G.slice,
      ee = function (e, t) {
        for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
        return -1;
      },
      te =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      ne = "[\\x20\\t\\r\\n\\f]",
      re = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      ie = re.replace("w", "w#"),
      se =
        "\\[" +
        ne +
        "*(" +
        re +
        ")(?:" +
        ne +
        "*([*^$|!~]?=)" +
        ne +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        ie +
        "))|)" +
        ne +
        "*\\]",
      oe =
        ":(" +
        re +
        ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
        se +
        ")*)|.*)\\)|)",
      ae = new RegExp(ne + "+", "g"),
      ue = new RegExp(
        "^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$",
        "g"
      ),
      ce = new RegExp("^" + ne + "*," + ne + "*"),
      le = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
      de = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
      he = new RegExp(oe),
      pe = new RegExp("^" + ie + "$"),
      fe = {
        ID: new RegExp("^#(" + re + ")"),
        CLASS: new RegExp("^\\.(" + re + ")"),
        TAG: new RegExp("^(" + re.replace("w", "w*") + ")"),
        ATTR: new RegExp("^" + se),
        PSEUDO: new RegExp("^" + oe),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            ne +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            ne +
            "*(?:([+-]|)" +
            ne +
            "*(\\d+)|))" +
            ne +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + te + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            ne +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            ne +
            "*((?:-\\d)?\\d*)" +
            ne +
            "*\\)|)(?=[^-]|$)",
          "i"
        ),
      },
      ge = /^(?:input|select|textarea|button)$/i,
      me = /^h\d$/i,
      ve = /^[^{]+\{\s*\[native \w/,
      _e = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ye = /[+~]/,
      be = /'|\\/g,
      Te = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
      xe = function (e, t, n) {
        var r = "0x" + t - 65536;
        return r !== r || n
          ? t
          : r < 0
          ? String.fromCharCode(r + 65536)
          : String.fromCharCode((r >> 10) | 55296, (1023 & r) | 56320);
      },
      Ee = function () {
        N();
      };
    try {
      Q.apply((G = Z.call(U.childNodes)), U.childNodes),
        G[U.childNodes.length].nodeType;
    } catch (Se) {
      Q = {
        apply: G.length
          ? function (e, t) {
              K.apply(e, Z.call(t));
            }
          : function (e, t) {
              for (var n = e.length, r = 0; (e[n++] = t[r++]); );
              e.length = n - 1;
            },
      };
    }
    (T = t.support = {}),
      (S = t.isXML =
        function (e) {
          var t = e && (e.ownerDocument || e).documentElement;
          return !!t && "HTML" !== t.nodeName;
        }),
      (N = t.setDocument =
        function (e) {
          var t,
            n,
            r = e ? e.ownerDocument || e : U;
          return r !== D && 9 === r.nodeType && r.documentElement
            ? ((D = r),
              (R = r.documentElement),
              (n = r.defaultView),
              n &&
                n !== n.top &&
                (n.addEventListener
                  ? n.addEventListener("unload", Ee, !1)
                  : n.attachEvent && n.attachEvent("onunload", Ee)),
              (k = !S(r)),
              (T.attributes = i(function (e) {
                return (e.className = "i"), !e.getAttribute("className");
              })),
              (T.getElementsByTagName = i(function (e) {
                return (
                  e.appendChild(r.createComment("")),
                  !e.getElementsByTagName("*").length
                );
              })),
              (T.getElementsByClassName = ve.test(r.getElementsByClassName)),
              (T.getById = i(function (e) {
                return (
                  (R.appendChild(e).id = O),
                  !r.getElementsByName || !r.getElementsByName(O).length
                );
              })),
              T.getById
                ? ((x.find.ID = function (e, t) {
                    if ("undefined" != typeof t.getElementById && k) {
                      var n = t.getElementById(e);
                      return n && n.parentNode ? [n] : [];
                    }
                  }),
                  (x.filter.ID = function (e) {
                    var t = e.replace(Te, xe);
                    return function (e) {
                      return e.getAttribute("id") === t;
                    };
                  }))
                : (delete x.find.ID,
                  (x.filter.ID = function (e) {
                    var t = e.replace(Te, xe);
                    return function (e) {
                      var n =
                        "undefined" != typeof e.getAttributeNode &&
                        e.getAttributeNode("id");
                      return n && n.value === t;
                    };
                  })),
              (x.find.TAG = T.getElementsByTagName
                ? function (e, t) {
                    return "undefined" != typeof t.getElementsByTagName
                      ? t.getElementsByTagName(e)
                      : T.qsa
                      ? t.querySelectorAll(e)
                      : void 0;
                  }
                : function (e, t) {
                    var n,
                      r = [],
                      i = 0,
                      s = t.getElementsByTagName(e);
                    if ("*" === e) {
                      for (; (n = s[i++]); ) 1 === n.nodeType && r.push(n);
                      return r;
                    }
                    return s;
                  }),
              (x.find.CLASS =
                T.getElementsByClassName &&
                function (e, t) {
                  if (k) return t.getElementsByClassName(e);
                }),
              (I = []),
              (H = []),
              (T.qsa = ve.test(r.querySelectorAll)) &&
                (i(function (e) {
                  (R.appendChild(e).innerHTML =
                    "<a id='" +
                    O +
                    "'></a><select id='" +
                    O +
                    "-\f]' msallowcapture=''><option selected=''></option></select>"),
                    e.querySelectorAll("[msallowcapture^='']").length &&
                      H.push("[*^$]=" + ne + "*(?:''|\"\")"),
                    e.querySelectorAll("[selected]").length ||
                      H.push("\\[" + ne + "*(?:value|" + te + ")"),
                    e.querySelectorAll("[id~=" + O + "-]").length ||
                      H.push("~="),
                    e.querySelectorAll(":checked").length || H.push(":checked"),
                    e.querySelectorAll("a#" + O + "+*").length ||
                      H.push(".#.+[+~]");
                }),
                i(function (e) {
                  var t = r.createElement("input");
                  t.setAttribute("type", "hidden"),
                    e.appendChild(t).setAttribute("name", "D"),
                    e.querySelectorAll("[name=d]").length &&
                      H.push("name" + ne + "*[*^$|!~]?="),
                    e.querySelectorAll(":enabled").length ||
                      H.push(":enabled", ":disabled"),
                    e.querySelectorAll("*,:x"),
                    H.push(",.*:");
                })),
              (T.matchesSelector = ve.test(
                (q =
                  R.matches ||
                  R.webkitMatchesSelector ||
                  R.mozMatchesSelector ||
                  R.oMatchesSelector ||
                  R.msMatchesSelector)
              )) &&
                i(function (e) {
                  (T.disconnectedMatch = q.call(e, "div")),
                    q.call(e, "[s!='']:x"),
                    I.push("!=", oe);
                }),
              (H = H.length && new RegExp(H.join("|"))),
              (I = I.length && new RegExp(I.join("|"))),
              (t = ve.test(R.compareDocumentPosition)),
              (M =
                t || ve.test(R.contains)
                  ? function (e, t) {
                      var n = 9 === e.nodeType ? e.documentElement : e,
                        r = t && t.parentNode;
                      return (
                        e === r ||
                        !(
                          !r ||
                          1 !== r.nodeType ||
                          !(n.contains
                            ? n.contains(r)
                            : e.compareDocumentPosition &&
                              16 & e.compareDocumentPosition(r))
                        )
                      );
                    }
                  : function (e, t) {
                      if (t)
                        for (; (t = t.parentNode); ) if (t === e) return !0;
                      return !1;
                    }),
              ($ = t
                ? function (e, t) {
                    if (e === t) return (C = !0), 0;
                    var n =
                      !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n
                      ? n
                      : ((n =
                          (e.ownerDocument || e) === (t.ownerDocument || t)
                            ? e.compareDocumentPosition(t)
                            : 1),
                        1 & n ||
                        (!T.sortDetached && t.compareDocumentPosition(e) === n)
                          ? e === r || (e.ownerDocument === U && M(U, e))
                            ? -1
                            : t === r || (t.ownerDocument === U && M(U, t))
                            ? 1
                            : L
                            ? ee(L, e) - ee(L, t)
                            : 0
                          : 4 & n
                          ? -1
                          : 1);
                  }
                : function (e, t) {
                    if (e === t) return (C = !0), 0;
                    var n,
                      i = 0,
                      s = e.parentNode,
                      a = t.parentNode,
                      u = [e],
                      c = [t];
                    if (!s || !a)
                      return e === r
                        ? -1
                        : t === r
                        ? 1
                        : s
                        ? -1
                        : a
                        ? 1
                        : L
                        ? ee(L, e) - ee(L, t)
                        : 0;
                    if (s === a) return o(e, t);
                    for (n = e; (n = n.parentNode); ) u.unshift(n);
                    for (n = t; (n = n.parentNode); ) c.unshift(n);
                    for (; u[i] === c[i]; ) i++;
                    return i
                      ? o(u[i], c[i])
                      : u[i] === U
                      ? -1
                      : c[i] === U
                      ? 1
                      : 0;
                  }),
              r)
            : D;
        }),
      (t.matches = function (e, n) {
        return t(e, null, null, n);
      }),
      (t.matchesSelector = function (e, n) {
        if (
          ((e.ownerDocument || e) !== D && N(e),
          (n = n.replace(de, "='$1']")),
          T.matchesSelector && k && (!I || !I.test(n)) && (!H || !H.test(n)))
        )
          try {
            var r = q.call(e, n);
            if (
              r ||
              T.disconnectedMatch ||
              (e.document && 11 !== e.document.nodeType)
            )
              return r;
          } catch (i) {}
        return t(n, D, null, [e]).length > 0;
      }),
      (t.contains = function (e, t) {
        return (e.ownerDocument || e) !== D && N(e), M(e, t);
      }),
      (t.attr = function (e, t) {
        (e.ownerDocument || e) !== D && N(e);
        var n = x.attrHandle[t.toLowerCase()],
          r = n && z.call(x.attrHandle, t.toLowerCase()) ? n(e, t, !k) : void 0;
        return void 0 !== r
          ? r
          : T.attributes || !k
          ? e.getAttribute(t)
          : (r = e.getAttributeNode(t)) && r.specified
          ? r.value
          : null;
      }),
      (t.error = function (e) {
        throw new Error("Syntax error, unrecognized expression: " + e);
      }),
      (t.uniqueSort = function (e) {
        var t,
          n = [],
          r = 0,
          i = 0;
        if (
          ((C = !T.detectDuplicates),
          (L = !T.sortStable && e.slice(0)),
          e.sort($),
          C)
        ) {
          for (; (t = e[i++]); ) t === e[i] && (r = n.push(i));
          for (; r--; ) e.splice(n[r], 1);
        }
        return (L = null), e;
      }),
      (E = t.getText =
        function (e) {
          var t,
            n = "",
            r = 0,
            i = e.nodeType;
          if (i) {
            if (1 === i || 9 === i || 11 === i) {
              if ("string" == typeof e.textContent) return e.textContent;
              for (e = e.firstChild; e; e = e.nextSibling) n += E(e);
            } else if (3 === i || 4 === i) return e.nodeValue;
          } else for (; (t = e[r++]); ) n += E(t);
          return n;
        }),
      (x = t.selectors =
        {
          cacheLength: 50,
          createPseudo: r,
          match: fe,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" },
          },
          preFilter: {
            ATTR: function (e) {
              return (
                (e[1] = e[1].replace(Te, xe)),
                (e[3] = (e[3] || e[4] || e[5] || "").replace(Te, xe)),
                "~=" === e[2] && (e[3] = " " + e[3] + " "),
                e.slice(0, 4)
              );
            },
            CHILD: function (e) {
              return (
                (e[1] = e[1].toLowerCase()),
                "nth" === e[1].slice(0, 3)
                  ? (e[3] || t.error(e[0]),
                    (e[4] = +(e[4]
                      ? e[5] + (e[6] || 1)
                      : 2 * ("even" === e[3] || "odd" === e[3]))),
                    (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                  : e[3] && t.error(e[0]),
                e
              );
            },
            PSEUDO: function (e) {
              var t,
                n = !e[6] && e[2];
              return fe.CHILD.test(e[0])
                ? null
                : (e[3]
                    ? (e[2] = e[4] || e[5] || "")
                    : n &&
                      he.test(n) &&
                      (t = j(n, !0)) &&
                      (t = n.indexOf(")", n.length - t) - n.length) &&
                      ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                  e.slice(0, 3));
            },
          },
          filter: {
            TAG: function (e) {
              var t = e.replace(Te, xe).toLowerCase();
              return "*" === e
                ? function () {
                    return !0;
                  }
                : function (e) {
                    return e.nodeName && e.nodeName.toLowerCase() === t;
                  };
            },
            CLASS: function (e) {
              var t = X[e + " "];
              return (
                t ||
                ((t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) &&
                  X(e, function (e) {
                    return t.test(
                      ("string" == typeof e.className && e.className) ||
                        ("undefined" != typeof e.getAttribute &&
                          e.getAttribute("class")) ||
                        ""
                    );
                  }))
              );
            },
            ATTR: function (e, n, r) {
              return function (i) {
                var s = t.attr(i, e);
                return null == s
                  ? "!=" === n
                  : !n ||
                      ((s += ""),
                      "=" === n
                        ? s === r
                        : "!=" === n
                        ? s !== r
                        : "^=" === n
                        ? r && 0 === s.indexOf(r)
                        : "*=" === n
                        ? r && s.indexOf(r) > -1
                        : "$=" === n
                        ? r && s.slice(-r.length) === r
                        : "~=" === n
                        ? (" " + s.replace(ae, " ") + " ").indexOf(r) > -1
                        : "|=" === n &&
                          (s === r || s.slice(0, r.length + 1) === r + "-"));
              };
            },
            CHILD: function (e, t, n, r, i) {
              var s = "nth" !== e.slice(0, 3),
                o = "last" !== e.slice(-4),
                a = "of-type" === t;
              return 1 === r && 0 === i
                ? function (e) {
                    return !!e.parentNode;
                  }
                : function (t, n, u) {
                    var c,
                      l,
                      d,
                      h,
                      p,
                      f,
                      g = s !== o ? "nextSibling" : "previousSibling",
                      m = t.parentNode,
                      v = a && t.nodeName.toLowerCase(),
                      _ = !u && !a;
                    if (m) {
                      if (s) {
                        for (; g; ) {
                          for (d = t; (d = d[g]); )
                            if (
                              a
                                ? d.nodeName.toLowerCase() === v
                                : 1 === d.nodeType
                            )
                              return !1;
                          f = g = "only" === e && !f && "nextSibling";
                        }
                        return !0;
                      }
                      if (((f = [o ? m.firstChild : m.lastChild]), o && _)) {
                        for (
                          l = m[O] || (m[O] = {}),
                            c = l[e] || [],
                            p = c[0] === F && c[1],
                            h = c[0] === F && c[2],
                            d = p && m.childNodes[p];
                          (d = (++p && d && d[g]) || (h = p = 0) || f.pop());

                        )
                          if (1 === d.nodeType && ++h && d === t) {
                            l[e] = [F, p, h];
                            break;
                          }
                      } else if (
                        _ &&
                        (c = (t[O] || (t[O] = {}))[e]) &&
                        c[0] === F
                      )
                        h = c[1];
                      else
                        for (
                          ;
                          (d = (++p && d && d[g]) || (h = p = 0) || f.pop()) &&
                          ((a
                            ? d.nodeName.toLowerCase() !== v
                            : 1 !== d.nodeType) ||
                            !++h ||
                            (_ && ((d[O] || (d[O] = {}))[e] = [F, h]),
                            d !== t));

                        );
                      return (h -= i), h === r || (h % r === 0 && h / r >= 0);
                    }
                  };
            },
            PSEUDO: function (e, n) {
              var i,
                s =
                  x.pseudos[e] ||
                  x.setFilters[e.toLowerCase()] ||
                  t.error("unsupported pseudo: " + e);
              return s[O]
                ? s(n)
                : s.length > 1
                ? ((i = [e, e, "", n]),
                  x.setFilters.hasOwnProperty(e.toLowerCase())
                    ? r(function (e, t) {
                        for (var r, i = s(e, n), o = i.length; o--; )
                          (r = ee(e, i[o])), (e[r] = !(t[r] = i[o]));
                      })
                    : function (e) {
                        return s(e, 0, i);
                      })
                : s;
            },
          },
          pseudos: {
            not: r(function (e) {
              var t = [],
                n = [],
                i = P(e.replace(ue, "$1"));
              return i[O]
                ? r(function (e, t, n, r) {
                    for (var s, o = i(e, null, r, []), a = e.length; a--; )
                      (s = o[a]) && (e[a] = !(t[a] = s));
                  })
                : function (e, r, s) {
                    return (
                      (t[0] = e), i(t, null, s, n), (t[0] = null), !n.pop()
                    );
                  };
            }),
            has: r(function (e) {
              return function (n) {
                return t(e, n).length > 0;
              };
            }),
            contains: r(function (e) {
              return (
                (e = e.replace(Te, xe)),
                function (t) {
                  return (t.textContent || t.innerText || E(t)).indexOf(e) > -1;
                }
              );
            }),
            lang: r(function (e) {
              return (
                pe.test(e || "") || t.error("unsupported lang: " + e),
                (e = e.replace(Te, xe).toLowerCase()),
                function (t) {
                  var n;
                  do
                    if (
                      (n = k
                        ? t.lang
                        : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                    )
                      return (
                        (n = n.toLowerCase()),
                        n === e || 0 === n.indexOf(e + "-")
                      );
                  while ((t = t.parentNode) && 1 === t.nodeType);
                  return !1;
                }
              );
            }),
            target: function (t) {
              var n = e.location && e.location.hash;
              return n && n.slice(1) === t.id;
            },
            root: function (e) {
              return e === R;
            },
            focus: function (e) {
              return (
                e === D.activeElement &&
                (!D.hasFocus || D.hasFocus()) &&
                !!(e.type || e.href || ~e.tabIndex)
              );
            },
            enabled: function (e) {
              return e.disabled === !1;
            },
            disabled: function (e) {
              return e.disabled === !0;
            },
            checked: function (e) {
              var t = e.nodeName.toLowerCase();
              return (
                ("input" === t && !!e.checked) ||
                ("option" === t && !!e.selected)
              );
            },
            selected: function (e) {
              return (
                e.parentNode && e.parentNode.selectedIndex, e.selected === !0
              );
            },
            empty: function (e) {
              for (e = e.firstChild; e; e = e.nextSibling)
                if (e.nodeType < 6) return !1;
              return !0;
            },
            parent: function (e) {
              return !x.pseudos.empty(e);
            },
            header: function (e) {
              return me.test(e.nodeName);
            },
            input: function (e) {
              return ge.test(e.nodeName);
            },
            button: function (e) {
              var t = e.nodeName.toLowerCase();
              return ("input" === t && "button" === e.type) || "button" === t;
            },
            text: function (e) {
              var t;
              return (
                "input" === e.nodeName.toLowerCase() &&
                "text" === e.type &&
                (null == (t = e.getAttribute("type")) ||
                  "text" === t.toLowerCase())
              );
            },
            first: c(function () {
              return [0];
            }),
            last: c(function (e, t) {
              return [t - 1];
            }),
            eq: c(function (e, t, n) {
              return [n < 0 ? n + t : n];
            }),
            even: c(function (e, t) {
              for (var n = 0; n < t; n += 2) e.push(n);
              return e;
            }),
            odd: c(function (e, t) {
              for (var n = 1; n < t; n += 2) e.push(n);
              return e;
            }),
            lt: c(function (e, t, n) {
              for (var r = n < 0 ? n + t : n; --r >= 0; ) e.push(r);
              return e;
            }),
            gt: c(function (e, t, n) {
              for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
              return e;
            }),
          },
        }),
      (x.pseudos.nth = x.pseudos.eq);
    for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
      x.pseudos[b] = a(b);
    for (b in { submit: !0, reset: !0 }) x.pseudos[b] = u(b);
    return (
      (d.prototype = x.filters = x.pseudos),
      (x.setFilters = new d()),
      (j = t.tokenize =
        function (e, n) {
          var r,
            i,
            s,
            o,
            a,
            u,
            c,
            l = V[e + " "];
          if (l) return n ? 0 : l.slice(0);
          for (a = e, u = [], c = x.preFilter; a; ) {
            (r && !(i = ce.exec(a))) ||
              (i && (a = a.slice(i[0].length) || a), u.push((s = []))),
              (r = !1),
              (i = le.exec(a)) &&
                ((r = i.shift()),
                s.push({ value: r, type: i[0].replace(ue, " ") }),
                (a = a.slice(r.length)));
            for (o in x.filter)
              !(i = fe[o].exec(a)) ||
                (c[o] && !(i = c[o](i))) ||
                ((r = i.shift()),
                s.push({ value: r, type: o, matches: i }),
                (a = a.slice(r.length)));
            if (!r) break;
          }
          return n ? a.length : a ? t.error(e) : V(e, u).slice(0);
        }),
      (P = t.compile =
        function (e, t) {
          var n,
            r = [],
            i = [],
            s = W[e + " "];
          if (!s) {
            for (t || (t = j(e)), n = t.length; n--; )
              (s = _(t[n])), s[O] ? r.push(s) : i.push(s);
            (s = W(e, y(i, r))), (s.selector = e);
          }
          return s;
        }),
      (w = t.select =
        function (e, t, n, r) {
          var i,
            s,
            o,
            a,
            u,
            c = "function" == typeof e && e,
            d = !r && j((e = c.selector || e));
          if (((n = n || []), 1 === d.length)) {
            if (
              ((s = d[0] = d[0].slice(0)),
              s.length > 2 &&
                "ID" === (o = s[0]).type &&
                T.getById &&
                9 === t.nodeType &&
                k &&
                x.relative[s[1].type])
            ) {
              if (
                ((t = (x.find.ID(o.matches[0].replace(Te, xe), t) || [])[0]),
                !t)
              )
                return n;
              c && (t = t.parentNode), (e = e.slice(s.shift().value.length));
            }
            for (
              i = fe.needsContext.test(e) ? 0 : s.length;
              i-- && ((o = s[i]), !x.relative[(a = o.type)]);

            )
              if (
                (u = x.find[a]) &&
                (r = u(
                  o.matches[0].replace(Te, xe),
                  (ye.test(s[0].type) && l(t.parentNode)) || t
                ))
              ) {
                if ((s.splice(i, 1), (e = r.length && h(s)), !e))
                  return Q.apply(n, r), n;
                break;
              }
          }
          return (
            (c || P(e, d))(r, t, !k, n, (ye.test(e) && l(t.parentNode)) || t), n
          );
        }),
      (T.sortStable = O.split("").sort($).join("") === O),
      (T.detectDuplicates = !!C),
      N(),
      (T.sortDetached = i(function (e) {
        return 1 & e.compareDocumentPosition(D.createElement("div"));
      })),
      i(function (e) {
        return (
          (e.innerHTML = "<a href='#'></a>"),
          "#" === e.firstChild.getAttribute("href")
        );
      }) ||
        s("type|href|height|width", function (e, t, n) {
          if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
        }),
      (T.attributes &&
        i(function (e) {
          return (
            (e.innerHTML = "<input/>"),
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
          );
        })) ||
        s("value", function (e, t, n) {
          if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
        }),
      i(function (e) {
        return null == e.getAttribute("disabled");
      }) ||
        s(te, function (e, t, n) {
          var r;
          if (!n)
            return e[t] === !0
              ? t.toLowerCase()
              : (r = e.getAttributeNode(t)) && r.specified
              ? r.value
              : null;
        }),
      t
    );
  })(e);
  (Z.find = ie),
    (Z.expr = ie.selectors),
    (Z.expr[":"] = Z.expr.pseudos),
    (Z.unique = ie.uniqueSort),
    (Z.text = ie.getText),
    (Z.isXMLDoc = ie.isXML),
    (Z.contains = ie.contains);
  var se = Z.expr.match.needsContext,
    oe = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ae = /^.[^:#\[\.,]*$/;
  (Z.filter = function (e, t, n) {
    var r = t[0];
    return (
      n && (e = ":not(" + e + ")"),
      1 === t.length && 1 === r.nodeType
        ? Z.find.matchesSelector(r, e)
          ? [r]
          : []
        : Z.find.matches(
            e,
            Z.grep(t, function (e) {
              return 1 === e.nodeType;
            })
          )
    );
  }),
    Z.fn.extend({
      find: function (e) {
        var t,
          n = this.length,
          r = [],
          i = this;
        if ("string" != typeof e)
          return this.pushStack(
            Z(e).filter(function () {
              for (t = 0; t < n; t++) if (Z.contains(i[t], this)) return !0;
            })
          );
        for (t = 0; t < n; t++) Z.find(e, i[t], r);
        return (
          (r = this.pushStack(n > 1 ? Z.unique(r) : r)),
          (r.selector = this.selector ? this.selector + " " + e : e),
          r
        );
      },
      filter: function (e) {
        return this.pushStack(r(this, e || [], !1));
      },
      not: function (e) {
        return this.pushStack(r(this, e || [], !0));
      },
      is: function (e) {
        return !!r(
          this,
          "string" == typeof e && se.test(e) ? Z(e) : e || [],
          !1
        ).length;
      },
    });
  var ue,
    ce = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    le = (Z.fn.init = function (e, t) {
      var n, r;
      if (!e) return this;
      if ("string" == typeof e) {
        if (
          ((n =
            "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3
              ? [null, e, null]
              : ce.exec(e)),
          !n || (!n[1] && t))
        )
          return !t || t.jquery
            ? (t || ue).find(e)
            : this.constructor(t).find(e);
        if (n[1]) {
          if (
            ((t = t instanceof Z ? t[0] : t),
            Z.merge(
              this,
              Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : K, !0)
            ),
            oe.test(n[1]) && Z.isPlainObject(t))
          )
            for (n in t)
              Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
          return this;
        }
        return (
          (r = K.getElementById(n[2])),
          r && r.parentNode && ((this.length = 1), (this[0] = r)),
          (this.context = K),
          (this.selector = e),
          this
        );
      }
      return e.nodeType
        ? ((this.context = this[0] = e), (this.length = 1), this)
        : Z.isFunction(e)
        ? "undefined" != typeof ue.ready
          ? ue.ready(e)
          : e(Z)
        : (void 0 !== e.selector &&
            ((this.selector = e.selector), (this.context = e.context)),
          Z.makeArray(e, this));
    });
  (le.prototype = Z.fn), (ue = Z(K));
  var de = /^(?:parents|prev(?:Until|All))/,
    he = { children: !0, contents: !0, next: !0, prev: !0 };
  Z.extend({
    dir: function (e, t, n) {
      for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
        if (1 === e.nodeType) {
          if (i && Z(e).is(n)) break;
          r.push(e);
        }
      return r;
    },
    sibling: function (e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    },
  }),
    Z.fn.extend({
      has: function (e) {
        var t = Z(e, this),
          n = t.length;
        return this.filter(function () {
          for (var e = 0; e < n; e++) if (Z.contains(this, t[e])) return !0;
        });
      },
      closest: function (e, t) {
        for (
          var n,
            r = 0,
            i = this.length,
            s = [],
            o =
              se.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0;
          r < i;
          r++
        )
          for (n = this[r]; n && n !== t; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (o
                ? o.index(n) > -1
                : 1 === n.nodeType && Z.find.matchesSelector(n, e))
            ) {
              s.push(n);
              break;
            }
        return this.pushStack(s.length > 1 ? Z.unique(s) : s);
      },
      index: function (e) {
        return e
          ? "string" == typeof e
            ? $.call(Z(e), this[0])
            : $.call(this, e.jquery ? e[0] : e)
          : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      },
      add: function (e, t) {
        return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))));
      },
      addBack: function (e) {
        return this.add(
          null == e ? this.prevObject : this.prevObject.filter(e)
        );
      },
    }),
    Z.each(
      {
        parent: function (e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
          return Z.dir(e, "parentNode");
        },
        parentsUntil: function (e, t, n) {
          return Z.dir(e, "parentNode", n);
        },
        next: function (e) {
          return i(e, "nextSibling");
        },
        prev: function (e) {
          return i(e, "previousSibling");
        },
        nextAll: function (e) {
          return Z.dir(e, "nextSibling");
        },
        prevAll: function (e) {
          return Z.dir(e, "previousSibling");
        },
        nextUntil: function (e, t, n) {
          return Z.dir(e, "nextSibling", n);
        },
        prevUntil: function (e, t, n) {
          return Z.dir(e, "previousSibling", n);
        },
        siblings: function (e) {
          return Z.sibling((e.parentNode || {}).firstChild, e);
        },
        children: function (e) {
          return Z.sibling(e.firstChild);
        },
        contents: function (e) {
          return e.contentDocument || Z.merge([], e.childNodes);
        },
      },
      function (e, t) {
        Z.fn[e] = function (n, r) {
          var i = Z.map(this, t, n);
          return (
            "Until" !== e.slice(-5) && (r = n),
            r && "string" == typeof r && (i = Z.filter(r, i)),
            this.length > 1 &&
              (he[e] || Z.unique(i), de.test(e) && i.reverse()),
            this.pushStack(i)
          );
        };
      }
    );
  var pe = /\S+/g,
    fe = {};
  (Z.Callbacks = function (e) {
    e = "string" == typeof e ? fe[e] || s(e) : Z.extend({}, e);
    var t,
      n,
      r,
      i,
      o,
      a,
      u = [],
      c = !e.once && [],
      l = function (s) {
        for (
          t = e.memory && s, n = !0, a = i || 0, i = 0, o = u.length, r = !0;
          u && a < o;
          a++
        )
          if (u[a].apply(s[0], s[1]) === !1 && e.stopOnFalse) {
            t = !1;
            break;
          }
        (r = !1),
          u && (c ? c.length && l(c.shift()) : t ? (u = []) : d.disable());
      },
      d = {
        add: function () {
          if (u) {
            var n = u.length;
            !(function s(t) {
              Z.each(t, function (t, n) {
                var r = Z.type(n);
                "function" === r
                  ? (e.unique && d.has(n)) || u.push(n)
                  : n && n.length && "string" !== r && s(n);
              });
            })(arguments),
              r ? (o = u.length) : t && ((i = n), l(t));
          }
          return this;
        },
        remove: function () {
          return (
            u &&
              Z.each(arguments, function (e, t) {
                for (var n; (n = Z.inArray(t, u, n)) > -1; )
                  u.splice(n, 1), r && (n <= o && o--, n <= a && a--);
              }),
            this
          );
        },
        has: function (e) {
          return e ? Z.inArray(e, u) > -1 : !(!u || !u.length);
        },
        empty: function () {
          return (u = []), (o = 0), this;
        },
        disable: function () {
          return (u = c = t = void 0), this;
        },
        disabled: function () {
          return !u;
        },
        lock: function () {
          return (c = void 0), t || d.disable(), this;
        },
        locked: function () {
          return !c;
        },
        fireWith: function (e, t) {
          return (
            !u ||
              (n && !c) ||
              ((t = t || []),
              (t = [e, t.slice ? t.slice() : t]),
              r ? c.push(t) : l(t)),
            this
          );
        },
        fire: function () {
          return d.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!n;
        },
      };
    return d;
  }),
    Z.extend({
      Deferred: function (e) {
        var t = [
            ["resolve", "done", Z.Callbacks("once memory"), "resolved"],
            ["reject", "fail", Z.Callbacks("once memory"), "rejected"],
            ["notify", "progress", Z.Callbacks("memory")],
          ],
          n = "pending",
          r = {
            state: function () {
              return n;
            },
            always: function () {
              return i.done(arguments).fail(arguments), this;
            },
            then: function () {
              var e = arguments;
              return Z.Deferred(function (n) {
                Z.each(t, function (t, s) {
                  var o = Z.isFunction(e[t]) && e[t];
                  i[s[1]](function () {
                    var e = o && o.apply(this, arguments);
                    e && Z.isFunction(e.promise)
                      ? e
                          .promise()
                          .done(n.resolve)
                          .fail(n.reject)
                          .progress(n.notify)
                      : n[s[0] + "With"](
                          this === r ? n.promise() : this,
                          o ? [e] : arguments
                        );
                  });
                }),
                  (e = null);
              }).promise();
            },
            promise: function (e) {
              return null != e ? Z.extend(e, r) : r;
            },
          },
          i = {};
        return (
          (r.pipe = r.then),
          Z.each(t, function (e, s) {
            var o = s[2],
              a = s[3];
            (r[s[1]] = o.add),
              a &&
                o.add(
                  function () {
                    n = a;
                  },
                  t[1 ^ e][2].disable,
                  t[2][2].lock
                ),
              (i[s[0]] = function () {
                return i[s[0] + "With"](this === i ? r : this, arguments), this;
              }),
              (i[s[0] + "With"] = o.fireWith);
          }),
          r.promise(i),
          e && e.call(i, i),
          i
        );
      },
      when: function (e) {
        var t,
          n,
          r,
          i = 0,
          s = X.call(arguments),
          o = s.length,
          a = 1 !== o || (e && Z.isFunction(e.promise)) ? o : 0,
          u = 1 === a ? e : Z.Deferred(),
          c = function (e, n, r) {
            return function (i) {
              (n[e] = this),
                (r[e] = arguments.length > 1 ? X.call(arguments) : i),
                r === t ? u.notifyWith(n, r) : --a || u.resolveWith(n, r);
            };
          };
        if (o > 1)
          for (t = new Array(o), n = new Array(o), r = new Array(o); i < o; i++)
            s[i] && Z.isFunction(s[i].promise)
              ? s[i]
                  .promise()
                  .done(c(i, r, s))
                  .fail(u.reject)
                  .progress(c(i, n, t))
              : --a;
        return a || u.resolveWith(r, s), u.promise();
      },
    });
  var ge;
  (Z.fn.ready = function (e) {
    return Z.ready.promise().done(e), this;
  }),
    Z.extend({
      isReady: !1,
      readyWait: 1,
      holdReady: function (e) {
        e ? Z.readyWait++ : Z.ready(!0);
      },
      ready: function (e) {
        (e === !0 ? --Z.readyWait : Z.isReady) ||
          ((Z.isReady = !0),
          (e !== !0 && --Z.readyWait > 0) ||
            (ge.resolveWith(K, [Z]),
            Z.fn.triggerHandler &&
              (Z(K).triggerHandler("ready"), Z(K).off("ready"))));
      },
    }),
    (Z.ready.promise = function (t) {
      return (
        ge ||
          ((ge = Z.Deferred()),
          "complete" === K.readyState
            ? setTimeout(Z.ready)
            : (K.addEventListener("DOMContentLoaded", o, !1),
              e.addEventListener("load", o, !1))),
        ge.promise(t)
      );
    }),
    Z.ready.promise();
  var me = (Z.access = function (e, t, n, r, i, s, o) {
    var a = 0,
      u = e.length,
      c = null == n;
    if ("object" === Z.type(n)) {
      i = !0;
      for (a in n) Z.access(e, t, a, n[a], !0, s, o);
    } else if (
      void 0 !== r &&
      ((i = !0),
      Z.isFunction(r) || (o = !0),
      c &&
        (o
          ? (t.call(e, r), (t = null))
          : ((c = t),
            (t = function (e, t, n) {
              return c.call(Z(e), n);
            }))),
      t)
    )
      for (; a < u; a++) t(e[a], n, o ? r : r.call(e[a], a, t(e[a], n)));
    return i ? e : c ? t.call(e) : u ? t(e[0], n) : s;
  });
  (Z.acceptData = function (e) {
    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
  }),
    (a.uid = 1),
    (a.accepts = Z.acceptData),
    (a.prototype = {
      key: function (e) {
        if (!a.accepts(e)) return 0;
        var t = {},
          n = e[this.expando];
        if (!n) {
          n = a.uid++;
          try {
            (t[this.expando] = { value: n }), Object.defineProperties(e, t);
          } catch (r) {
            (t[this.expando] = n), Z.extend(e, t);
          }
        }
        return this.cache[n] || (this.cache[n] = {}), n;
      },
      set: function (e, t, n) {
        var r,
          i = this.key(e),
          s = this.cache[i];
        if ("string" == typeof t) s[t] = n;
        else if (Z.isEmptyObject(s)) Z.extend(this.cache[i], t);
        else for (r in t) s[r] = t[r];
        return s;
      },
      get: function (e, t) {
        var n = this.cache[this.key(e)];
        return void 0 === t ? n : n[t];
      },
      access: function (e, t, n) {
        var r;
        return void 0 === t || (t && "string" == typeof t && void 0 === n)
          ? ((r = this.get(e, t)),
            void 0 !== r ? r : this.get(e, Z.camelCase(t)))
          : (this.set(e, t, n), void 0 !== n ? n : t);
      },
      remove: function (e, t) {
        var n,
          r,
          i,
          s = this.key(e),
          o = this.cache[s];
        if (void 0 === t) this.cache[s] = {};
        else {
          Z.isArray(t)
            ? (r = t.concat(t.map(Z.camelCase)))
            : ((i = Z.camelCase(t)),
              t in o
                ? (r = [t, i])
                : ((r = i), (r = r in o ? [r] : r.match(pe) || []))),
            (n = r.length);
          for (; n--; ) delete o[r[n]];
        }
      },
      hasData: function (e) {
        return !Z.isEmptyObject(this.cache[e[this.expando]] || {});
      },
      discard: function (e) {
        e[this.expando] && delete this.cache[e[this.expando]];
      },
    });
  var ve = new a(),
    _e = new a(),
    ye = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    be = /([A-Z])/g;
  Z.extend({
    hasData: function (e) {
      return _e.hasData(e) || ve.hasData(e);
    },
    data: function (e, t, n) {
      return _e.access(e, t, n);
    },
    removeData: function (e, t) {
      _e.remove(e, t);
    },
    _data: function (e, t, n) {
      return ve.access(e, t, n);
    },
    _removeData: function (e, t) {
      ve.remove(e, t);
    },
  }),
    Z.fn.extend({
      data: function (e, t) {
        var n,
          r,
          i,
          s = this[0],
          o = s && s.attributes;
        if (void 0 === e) {
          if (
            this.length &&
            ((i = _e.get(s)), 1 === s.nodeType && !ve.get(s, "hasDataAttrs"))
          ) {
            for (n = o.length; n--; )
              o[n] &&
                ((r = o[n].name),
                0 === r.indexOf("data-") &&
                  ((r = Z.camelCase(r.slice(5))), u(s, r, i[r])));
            ve.set(s, "hasDataAttrs", !0);
          }
          return i;
        }
        return "object" == typeof e
          ? this.each(function () {
              _e.set(this, e);
            })
          : me(
              this,
              function (t) {
                var n,
                  r = Z.camelCase(e);
                if (s && void 0 === t) {
                  if (((n = _e.get(s, e)), void 0 !== n)) return n;
                  if (((n = _e.get(s, r)), void 0 !== n)) return n;
                  if (((n = u(s, r, void 0)), void 0 !== n)) return n;
                } else
                  this.each(function () {
                    var n = _e.get(this, r);
                    _e.set(this, r, t),
                      e.indexOf("-") !== -1 &&
                        void 0 !== n &&
                        _e.set(this, e, t);
                  });
              },
              null,
              t,
              arguments.length > 1,
              null,
              !0
            );
      },
      removeData: function (e) {
        return this.each(function () {
          _e.remove(this, e);
        });
      },
    }),
    Z.extend({
      queue: function (e, t, n) {
        var r;
        if (e)
          return (
            (t = (t || "fx") + "queue"),
            (r = ve.get(e, t)),
            n &&
              (!r || Z.isArray(n)
                ? (r = ve.access(e, t, Z.makeArray(n)))
                : r.push(n)),
            r || []
          );
      },
      dequeue: function (e, t) {
        t = t || "fx";
        var n = Z.queue(e, t),
          r = n.length,
          i = n.shift(),
          s = Z._queueHooks(e, t),
          o = function () {
            Z.dequeue(e, t);
          };
        "inprogress" === i && ((i = n.shift()), r--),
          i &&
            ("fx" === t && n.unshift("inprogress"),
            delete s.stop,
            i.call(e, o, s)),
          !r && s && s.empty.fire();
      },
      _queueHooks: function (e, t) {
        var n = t + "queueHooks";
        return (
          ve.get(e, n) ||
          ve.access(e, n, {
            empty: Z.Callbacks("once memory").add(function () {
              ve.remove(e, [t + "queue", n]);
            }),
          })
        );
      },
    }),
    Z.fn.extend({
      queue: function (e, t) {
        var n = 2;
        return (
          "string" != typeof e && ((t = e), (e = "fx"), n--),
          arguments.length < n
            ? Z.queue(this[0], e)
            : void 0 === t
            ? this
            : this.each(function () {
                var n = Z.queue(this, e, t);
                Z._queueHooks(this, e),
                  "fx" === e && "inprogress" !== n[0] && Z.dequeue(this, e);
              })
        );
      },
      dequeue: function (e) {
        return this.each(function () {
          Z.dequeue(this, e);
        });
      },
      clearQueue: function (e) {
        return this.queue(e || "fx", []);
      },
      promise: function (e, t) {
        var n,
          r = 1,
          i = Z.Deferred(),
          s = this,
          o = this.length,
          a = function () {
            --r || i.resolveWith(s, [s]);
          };
        for (
          "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
          o--;

        )
          (n = ve.get(s[o], e + "queueHooks")),
            n && n.empty && (r++, n.empty.add(a));
        return a(), i.promise(t);
      },
    });
  var Te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    xe = ["Top", "Right", "Bottom", "Left"],
    Ee = function (e, t) {
      return (
        (e = t || e),
        "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
      );
    },
    Se = /^(?:checkbox|radio)$/i;
  !(function () {
    var e = K.createDocumentFragment(),
      t = e.appendChild(K.createElement("div")),
      n = K.createElement("input");
    n.setAttribute("type", "radio"),
      n.setAttribute("checked", "checked"),
      n.setAttribute("name", "t"),
      t.appendChild(n),
      (J.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (t.innerHTML = "<textarea>x</textarea>"),
      (J.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue);
  })();
  var je = "undefined";
  J.focusinBubbles = "onfocusin" in e;
  var Pe = /^key/,
    we = /^(?:mouse|pointer|contextmenu)|click/,
    Ae = /^(?:focusinfocus|focusoutblur)$/,
    Le = /^([^.]*)(?:\.(.+)|)$/;
  (Z.event = {
    global: {},
    add: function (e, t, n, r, i) {
      var s,
        o,
        a,
        u,
        c,
        l,
        d,
        h,
        p,
        f,
        g,
        m = ve.get(e);
      if (m)
        for (
          n.handler && ((s = n), (n = s.handler), (i = s.selector)),
            n.guid || (n.guid = Z.guid++),
            (u = m.events) || (u = m.events = {}),
            (o = m.handle) ||
              (o = m.handle =
                function (t) {
                  return typeof Z !== je && Z.event.triggered !== t.type
                    ? Z.event.dispatch.apply(e, arguments)
                    : void 0;
                }),
            t = (t || "").match(pe) || [""],
            c = t.length;
          c--;

        )
          (a = Le.exec(t[c]) || []),
            (p = g = a[1]),
            (f = (a[2] || "").split(".").sort()),
            p &&
              ((d = Z.event.special[p] || {}),
              (p = (i ? d.delegateType : d.bindType) || p),
              (d = Z.event.special[p] || {}),
              (l = Z.extend(
                {
                  type: p,
                  origType: g,
                  data: r,
                  handler: n,
                  guid: n.guid,
                  selector: i,
                  needsContext: i && Z.expr.match.needsContext.test(i),
                  namespace: f.join("."),
                },
                s
              )),
              (h = u[p]) ||
                ((h = u[p] = []),
                (h.delegateCount = 0),
                (d.setup && d.setup.call(e, r, f, o) !== !1) ||
                  (e.addEventListener && e.addEventListener(p, o, !1))),
              d.add &&
                (d.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)),
              i ? h.splice(h.delegateCount++, 0, l) : h.push(l),
              (Z.event.global[p] = !0));
    },
    remove: function (e, t, n, r, i) {
      var s,
        o,
        a,
        u,
        c,
        l,
        d,
        h,
        p,
        f,
        g,
        m = ve.hasData(e) && ve.get(e);
      if (m && (u = m.events)) {
        for (t = (t || "").match(pe) || [""], c = t.length; c--; )
          if (
            ((a = Le.exec(t[c]) || []),
            (p = g = a[1]),
            (f = (a[2] || "").split(".").sort()),
            p)
          ) {
            for (
              d = Z.event.special[p] || {},
                p = (r ? d.delegateType : d.bindType) || p,
                h = u[p] || [],
                a =
                  a[2] &&
                  new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                o = s = h.length;
              s--;

            )
              (l = h[s]),
                (!i && g !== l.origType) ||
                  (n && n.guid !== l.guid) ||
                  (a && !a.test(l.namespace)) ||
                  (r && r !== l.selector && ("**" !== r || !l.selector)) ||
                  (h.splice(s, 1),
                  l.selector && h.delegateCount--,
                  d.remove && d.remove.call(e, l));
            o &&
              !h.length &&
              ((d.teardown && d.teardown.call(e, f, m.handle) !== !1) ||
                Z.removeEvent(e, p, m.handle),
              delete u[p]);
          } else for (p in u) Z.event.remove(e, p + t[c], n, r, !0);
        Z.isEmptyObject(u) && (delete m.handle, ve.remove(e, "events"));
      }
    },
    trigger: function (t, n, r, i) {
      var s,
        o,
        a,
        u,
        c,
        l,
        d,
        h = [r || K],
        p = G.call(t, "type") ? t.type : t,
        f = G.call(t, "namespace") ? t.namespace.split(".") : [];
      if (
        ((o = a = r = r || K),
        3 !== r.nodeType &&
          8 !== r.nodeType &&
          !Ae.test(p + Z.event.triggered) &&
          (p.indexOf(".") >= 0 &&
            ((f = p.split(".")), (p = f.shift()), f.sort()),
          (c = p.indexOf(":") < 0 && "on" + p),
          (t = t[Z.expando] ? t : new Z.Event(p, "object" == typeof t && t)),
          (t.isTrigger = i ? 2 : 3),
          (t.namespace = f.join(".")),
          (t.namespace_re = t.namespace
            ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (t.result = void 0),
          t.target || (t.target = r),
          (n = null == n ? [t] : Z.makeArray(n, [t])),
          (d = Z.event.special[p] || {}),
          i || !d.trigger || d.trigger.apply(r, n) !== !1))
      ) {
        if (!i && !d.noBubble && !Z.isWindow(r)) {
          for (
            u = d.delegateType || p, Ae.test(u + p) || (o = o.parentNode);
            o;
            o = o.parentNode
          )
            h.push(o), (a = o);
          a === (r.ownerDocument || K) &&
            h.push(a.defaultView || a.parentWindow || e);
        }
        for (s = 0; (o = h[s++]) && !t.isPropagationStopped(); )
          (t.type = s > 1 ? u : d.bindType || p),
            (l = (ve.get(o, "events") || {})[t.type] && ve.get(o, "handle")),
            l && l.apply(o, n),
            (l = c && o[c]),
            l &&
              l.apply &&
              Z.acceptData(o) &&
              ((t.result = l.apply(o, n)),
              t.result === !1 && t.preventDefault());
        return (
          (t.type = p),
          i ||
            t.isDefaultPrevented() ||
            (d._default && d._default.apply(h.pop(), n) !== !1) ||
            !Z.acceptData(r) ||
            (c &&
              Z.isFunction(r[p]) &&
              !Z.isWindow(r) &&
              ((a = r[c]),
              a && (r[c] = null),
              (Z.event.triggered = p),
              r[p](),
              (Z.event.triggered = void 0),
              a && (r[c] = a))),
          t.result
        );
      }
    },
    dispatch: function (e) {
      e = Z.event.fix(e);
      var t,
        n,
        r,
        i,
        s,
        o = [],
        a = X.call(arguments),
        u = (ve.get(this, "events") || {})[e.type] || [],
        c = Z.event.special[e.type] || {};
      if (
        ((a[0] = e),
        (e.delegateTarget = this),
        !c.preDispatch || c.preDispatch.call(this, e) !== !1)
      ) {
        for (
          o = Z.event.handlers.call(this, e, u), t = 0;
          (i = o[t++]) && !e.isPropagationStopped();

        )
          for (
            e.currentTarget = i.elem, n = 0;
            (s = i.handlers[n++]) && !e.isImmediatePropagationStopped();

          )
            (e.namespace_re && !e.namespace_re.test(s.namespace)) ||
              ((e.handleObj = s),
              (e.data = s.data),
              (r = (
                (Z.event.special[s.origType] || {}).handle || s.handler
              ).apply(i.elem, a)),
              void 0 !== r &&
                (e.result = r) === !1 &&
                (e.preventDefault(), e.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, e), e.result;
      }
    },
    handlers: function (e, t) {
      var n,
        r,
        i,
        s,
        o = [],
        a = t.delegateCount,
        u = e.target;
      if (a && u.nodeType && (!e.button || "click" !== e.type))
        for (; u !== this; u = u.parentNode || this)
          if (u.disabled !== !0 || "click" !== e.type) {
            for (r = [], n = 0; n < a; n++)
              (s = t[n]),
                (i = s.selector + " "),
                void 0 === r[i] &&
                  (r[i] = s.needsContext
                    ? Z(i, this).index(u) >= 0
                    : Z.find(i, this, null, [u]).length),
                r[i] && r.push(s);
            r.length && o.push({ elem: u, handlers: r });
          }
      return a < t.length && o.push({ elem: this, handlers: t.slice(a) }), o;
    },
    props:
      "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
        " "
      ),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (e, t) {
        return (
          null == e.which &&
            (e.which = null != t.charCode ? t.charCode : t.keyCode),
          e
        );
      },
    },
    mouseHooks: {
      props:
        "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(
          " "
        ),
      filter: function (e, t) {
        var n,
          r,
          i,
          s = t.button;
        return (
          null == e.pageX &&
            null != t.clientX &&
            ((n = e.target.ownerDocument || K),
            (r = n.documentElement),
            (i = n.body),
            (e.pageX =
              t.clientX +
              ((r && r.scrollLeft) || (i && i.scrollLeft) || 0) -
              ((r && r.clientLeft) || (i && i.clientLeft) || 0)),
            (e.pageY =
              t.clientY +
              ((r && r.scrollTop) || (i && i.scrollTop) || 0) -
              ((r && r.clientTop) || (i && i.clientTop) || 0))),
          e.which ||
            void 0 === s ||
            (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
          e
        );
      },
    },
    fix: function (e) {
      if (e[Z.expando]) return e;
      var t,
        n,
        r,
        i = e.type,
        s = e,
        o = this.fixHooks[i];
      for (
        o ||
          (this.fixHooks[i] = o =
            we.test(i) ? this.mouseHooks : Pe.test(i) ? this.keyHooks : {}),
          r = o.props ? this.props.concat(o.props) : this.props,
          e = new Z.Event(s),
          t = r.length;
        t--;

      )
        (n = r[t]), (e[n] = s[n]);
      return (
        e.target || (e.target = K),
        3 === e.target.nodeType && (e.target = e.target.parentNode),
        o.filter ? o.filter(e, s) : e
      );
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function () {
          if (this !== d() && this.focus) return this.focus(), !1;
        },
        delegateType: "focusin",
      },
      blur: {
        trigger: function () {
          if (this === d() && this.blur) return this.blur(), !1;
        },
        delegateType: "focusout",
      },
      click: {
        trigger: function () {
          if (
            "checkbox" === this.type &&
            this.click &&
            Z.nodeName(this, "input")
          )
            return this.click(), !1;
        },
        _default: function (e) {
          return Z.nodeName(e.target, "a");
        },
      },
      beforeunload: {
        postDispatch: function (e) {
          void 0 !== e.result &&
            e.originalEvent &&
            (e.originalEvent.returnValue = e.result);
        },
      },
    },
    simulate: function (e, t, n, r) {
      var i = Z.extend(new Z.Event(), n, {
        type: e,
        isSimulated: !0,
        originalEvent: {},
      });
      r ? Z.event.trigger(i, null, t) : Z.event.dispatch.call(t, i),
        i.isDefaultPrevented() && n.preventDefault();
    },
  }),
    (Z.removeEvent = function (e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n, !1);
    }),
    (Z.Event = function (e, t) {
      return this instanceof Z.Event
        ? (e && e.type
            ? ((this.originalEvent = e),
              (this.type = e.type),
              (this.isDefaultPrevented =
                e.defaultPrevented ||
                (void 0 === e.defaultPrevented && e.returnValue === !1)
                  ? c
                  : l))
            : (this.type = e),
          t && Z.extend(this, t),
          (this.timeStamp = (e && e.timeStamp) || Z.now()),
          void (this[Z.expando] = !0))
        : new Z.Event(e, t);
    }),
    (Z.Event.prototype = {
      isDefaultPrevented: l,
      isPropagationStopped: l,
      isImmediatePropagationStopped: l,
      preventDefault: function () {
        var e = this.originalEvent;
        (this.isDefaultPrevented = c),
          e && e.preventDefault && e.preventDefault();
      },
      stopPropagation: function () {
        var e = this.originalEvent;
        (this.isPropagationStopped = c),
          e && e.stopPropagation && e.stopPropagation();
      },
      stopImmediatePropagation: function () {
        var e = this.originalEvent;
        (this.isImmediatePropagationStopped = c),
          e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
          this.stopPropagation();
      },
    }),
    Z.each(
      {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout",
      },
      function (e, t) {
        Z.event.special[e] = {
          delegateType: t,
          bindType: t,
          handle: function (e) {
            var n,
              r = this,
              i = e.relatedTarget,
              s = e.handleObj;
            return (
              (i && (i === r || Z.contains(r, i))) ||
                ((e.type = s.origType),
                (n = s.handler.apply(this, arguments)),
                (e.type = t)),
              n
            );
          },
        };
      }
    ),
    J.focusinBubbles ||
      Z.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
        var n = function (e) {
          Z.event.simulate(t, e.target, Z.event.fix(e), !0);
        };
        Z.event.special[t] = {
          setup: function () {
            var r = this.ownerDocument || this,
              i = ve.access(r, t);
            i || r.addEventListener(e, n, !0), ve.access(r, t, (i || 0) + 1);
          },
          teardown: function () {
            var r = this.ownerDocument || this,
              i = ve.access(r, t) - 1;
            i
              ? ve.access(r, t, i)
              : (r.removeEventListener(e, n, !0), ve.remove(r, t));
          },
        };
      }),
    Z.fn.extend({
      on: function (e, t, n, r, i) {
        var s, o;
        if ("object" == typeof e) {
          "string" != typeof t && ((n = n || t), (t = void 0));
          for (o in e) this.on(o, t, n, e[o], i);
          return this;
        }
        if (
          (null == n && null == r
            ? ((r = t), (n = t = void 0))
            : null == r &&
              ("string" == typeof t
                ? ((r = n), (n = void 0))
                : ((r = n), (n = t), (t = void 0))),
          r === !1)
        )
          r = l;
        else if (!r) return this;
        return (
          1 === i &&
            ((s = r),
            (r = function (e) {
              return Z().off(e), s.apply(this, arguments);
            }),
            (r.guid = s.guid || (s.guid = Z.guid++))),
          this.each(function () {
            Z.event.add(this, e, r, n, t);
          })
        );
      },
      one: function (e, t, n, r) {
        return this.on(e, t, n, r, 1);
      },
      off: function (e, t, n) {
        var r, i;
        if (e && e.preventDefault && e.handleObj)
          return (
            (r = e.handleObj),
            Z(e.delegateTarget).off(
              r.namespace ? r.origType + "." + r.namespace : r.origType,
              r.selector,
              r.handler
            ),
            this
          );
        if ("object" == typeof e) {
          for (i in e) this.off(i, t, e[i]);
          return this;
        }
        return (
          (t !== !1 && "function" != typeof t) || ((n = t), (t = void 0)),
          n === !1 && (n = l),
          this.each(function () {
            Z.event.remove(this, e, n, t);
          })
        );
      },
      trigger: function (e, t) {
        return this.each(function () {
          Z.event.trigger(e, t, this);
        });
      },
      triggerHandler: function (e, t) {
        var n = this[0];
        if (n) return Z.event.trigger(e, t, n, !0);
      },
    });
  var Ce =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    Ne = /<([\w:]+)/,
    De = /<|&#?\w+;/,
    Re = /<(?:script|style|link)/i,
    ke = /checked\s*(?:[^=]|=\s*.checked.)/i,
    He = /^$|\/(?:java|ecma)script/i,
    Ie = /^true\/(.*)/,
    qe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    Me = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""],
    };
  (Me.optgroup = Me.option),
    (Me.tbody = Me.tfoot = Me.colgroup = Me.caption = Me.thead),
    (Me.th = Me.td),
    Z.extend({
      clone: function (e, t, n) {
        var r,
          i,
          s,
          o,
          a = e.cloneNode(!0),
          u = Z.contains(e.ownerDocument, e);
        if (
          !(
            J.noCloneChecked ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            Z.isXMLDoc(e)
          )
        )
          for (o = v(a), s = v(e), r = 0, i = s.length; r < i; r++)
            _(s[r], o[r]);
        if (t)
          if (n)
            for (s = s || v(e), o = o || v(a), r = 0, i = s.length; r < i; r++)
              m(s[r], o[r]);
          else m(e, a);
        return (
          (o = v(a, "script")), o.length > 0 && g(o, !u && v(e, "script")), a
        );
      },
      buildFragment: function (e, t, n, r) {
        for (
          var i,
            s,
            o,
            a,
            u,
            c,
            l = t.createDocumentFragment(),
            d = [],
            h = 0,
            p = e.length;
          h < p;
          h++
        )
          if (((i = e[h]), i || 0 === i))
            if ("object" === Z.type(i)) Z.merge(d, i.nodeType ? [i] : i);
            else if (De.test(i)) {
              for (
                s = s || l.appendChild(t.createElement("div")),
                  o = (Ne.exec(i) || ["", ""])[1].toLowerCase(),
                  a = Me[o] || Me._default,
                  s.innerHTML = a[1] + i.replace(Ce, "<$1></$2>") + a[2],
                  c = a[0];
                c--;

              )
                s = s.lastChild;
              Z.merge(d, s.childNodes),
                (s = l.firstChild),
                (s.textContent = "");
            } else d.push(t.createTextNode(i));
        for (l.textContent = "", h = 0; (i = d[h++]); )
          if (
            (!r || Z.inArray(i, r) === -1) &&
            ((u = Z.contains(i.ownerDocument, i)),
            (s = v(l.appendChild(i), "script")),
            u && g(s),
            n)
          )
            for (c = 0; (i = s[c++]); ) He.test(i.type || "") && n.push(i);
        return l;
      },
      cleanData: function (e) {
        for (
          var t, n, r, i, s = Z.event.special, o = 0;
          void 0 !== (n = e[o]);
          o++
        ) {
          if (
            Z.acceptData(n) &&
            ((i = n[ve.expando]), i && (t = ve.cache[i]))
          ) {
            if (t.events)
              for (r in t.events)
                s[r] ? Z.event.remove(n, r) : Z.removeEvent(n, r, t.handle);
            ve.cache[i] && delete ve.cache[i];
          }
          delete _e.cache[n[_e.expando]];
        }
      },
    }),
    Z.fn.extend({
      text: function (e) {
        return me(
          this,
          function (e) {
            return void 0 === e
              ? Z.text(this)
              : this.empty().each(function () {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    (this.textContent = e);
                });
          },
          null,
          e,
          arguments.length
        );
      },
      append: function () {
        return this.domManip(arguments, function (e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = h(this, e);
            t.appendChild(e);
          }
        });
      },
      prepend: function () {
        return this.domManip(arguments, function (e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = h(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function () {
        return this.domManip(arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function () {
        return this.domManip(arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      remove: function (e, t) {
        for (
          var n, r = e ? Z.filter(e, this) : this, i = 0;
          null != (n = r[i]);
          i++
        )
          t || 1 !== n.nodeType || Z.cleanData(v(n)),
            n.parentNode &&
              (t && Z.contains(n.ownerDocument, n) && g(v(n, "script")),
              n.parentNode.removeChild(n));
        return this;
      },
      empty: function () {
        for (var e, t = 0; null != (e = this[t]); t++)
          1 === e.nodeType && (Z.cleanData(v(e, !1)), (e.textContent = ""));
        return this;
      },
      clone: function (e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function () {
            return Z.clone(this, e, t);
          })
        );
      },
      html: function (e) {
        return me(
          this,
          function (e) {
            var t = this[0] || {},
              n = 0,
              r = this.length;
            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
            if (
              "string" == typeof e &&
              !Re.test(e) &&
              !Me[(Ne.exec(e) || ["", ""])[1].toLowerCase()]
            ) {
              e = e.replace(Ce, "<$1></$2>");
              try {
                for (; n < r; n++)
                  (t = this[n] || {}),
                    1 === t.nodeType &&
                      (Z.cleanData(v(t, !1)), (t.innerHTML = e));
                t = 0;
              } catch (i) {}
            }
            t && this.empty().append(e);
          },
          null,
          e,
          arguments.length
        );
      },
      replaceWith: function () {
        var e = arguments[0];
        return (
          this.domManip(arguments, function (t) {
            (e = this.parentNode),
              Z.cleanData(v(this)),
              e && e.replaceChild(t, this);
          }),
          e && (e.length || e.nodeType) ? this : this.remove()
        );
      },
      detach: function (e) {
        return this.remove(e, !0);
      },
      domManip: function (e, t) {
        e = V.apply([], e);
        var n,
          r,
          i,
          s,
          o,
          a,
          u = 0,
          c = this.length,
          l = this,
          d = c - 1,
          h = e[0],
          g = Z.isFunction(h);
        if (g || (c > 1 && "string" == typeof h && !J.checkClone && ke.test(h)))
          return this.each(function (n) {
            var r = l.eq(n);
            g && (e[0] = h.call(this, n, r.html())), r.domManip(e, t);
          });
        if (
          c &&
          ((n = Z.buildFragment(e, this[0].ownerDocument, !1, this)),
          (r = n.firstChild),
          1 === n.childNodes.length && (n = r),
          r)
        ) {
          for (i = Z.map(v(n, "script"), p), s = i.length; u < c; u++)
            (o = n),
              u !== d &&
                ((o = Z.clone(o, !0, !0)), s && Z.merge(i, v(o, "script"))),
              t.call(this[u], o, u);
          if (s)
            for (
              a = i[i.length - 1].ownerDocument, Z.map(i, f), u = 0;
              u < s;
              u++
            )
              (o = i[u]),
                He.test(o.type || "") &&
                  !ve.access(o, "globalEval") &&
                  Z.contains(a, o) &&
                  (o.src
                    ? Z._evalUrl && Z._evalUrl(o.src)
                    : Z.globalEval(o.textContent.replace(qe, "")));
        }
        return this;
      },
    }),
    Z.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (e, t) {
        Z.fn[e] = function (e) {
          for (var n, r = [], i = Z(e), s = i.length - 1, o = 0; o <= s; o++)
            (n = o === s ? this : this.clone(!0)),
              Z(i[o])[t](n),
              W.apply(r, n.get());
          return this.pushStack(r);
        };
      }
    );
  var Oe,
    Ue = {},
    Fe = /^margin/,
    Be = new RegExp("^(" + Te + ")(?!px)[a-z%]+$", "i"),
    Xe = function (t) {
      return t.ownerDocument.defaultView.opener
        ? t.ownerDocument.defaultView.getComputedStyle(t, null)
        : e.getComputedStyle(t, null);
    };
  !(function () {
    function t() {
      (o.style.cssText =
        "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute"),
        (o.innerHTML = ""),
        i.appendChild(s);
      var t = e.getComputedStyle(o, null);
      (n = "1%" !== t.top), (r = "4px" === t.width), i.removeChild(s);
    }
    var n,
      r,
      i = K.documentElement,
      s = K.createElement("div"),
      o = K.createElement("div");
    o.style &&
      ((o.style.backgroundClip = "content-box"),
      (o.cloneNode(!0).style.backgroundClip = ""),
      (J.clearCloneStyle = "content-box" === o.style.backgroundClip),
      (s.style.cssText =
        "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute"),
      s.appendChild(o),
      e.getComputedStyle &&
        Z.extend(J, {
          pixelPosition: function () {
            return t(), n;
          },
          boxSizingReliable: function () {
            return null == r && t(), r;
          },
          reliableMarginRight: function () {
            var t,
              n = o.appendChild(K.createElement("div"));
            return (
              (n.style.cssText = o.style.cssText =
                "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
              (n.style.marginRight = n.style.width = "0"),
              (o.style.width = "1px"),
              i.appendChild(s),
              (t = !parseFloat(e.getComputedStyle(n, null).marginRight)),
              i.removeChild(s),
              o.removeChild(n),
              t
            );
          },
        }));
  })(),
    (Z.swap = function (e, t, n, r) {
      var i,
        s,
        o = {};
      for (s in t) (o[s] = e.style[s]), (e.style[s] = t[s]);
      i = n.apply(e, r || []);
      for (s in t) e.style[s] = o[s];
      return i;
    });
  var Ve = /^(none|table(?!-c[ea]).+)/,
    We = new RegExp("^(" + Te + ")(.*)$", "i"),
    $e = new RegExp("^([+-])=(" + Te + ")", "i"),
    Ye = { position: "absolute", visibility: "hidden", display: "block" },
    ze = { letterSpacing: "0", fontWeight: "400" },
    Ge = ["Webkit", "O", "Moz", "ms"];
  Z.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = T(e, "opacity");
            return "" === n ? "1" : n;
          }
        },
      },
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: { float: "cssFloat" },
    style: function (e, t, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var i,
          s,
          o,
          a = Z.camelCase(t),
          u = e.style;
        return (
          (t = Z.cssProps[a] || (Z.cssProps[a] = E(u, a))),
          (o = Z.cssHooks[t] || Z.cssHooks[a]),
          void 0 === n
            ? o && "get" in o && void 0 !== (i = o.get(e, !1, r))
              ? i
              : u[t]
            : ((s = typeof n),
              "string" === s &&
                (i = $e.exec(n)) &&
                ((n = (i[1] + 1) * i[2] + parseFloat(Z.css(e, t))),
                (s = "number")),
              null != n &&
                n === n &&
                ("number" !== s || Z.cssNumber[a] || (n += "px"),
                J.clearCloneStyle ||
                  "" !== n ||
                  0 !== t.indexOf("background") ||
                  (u[t] = "inherit"),
                (o && "set" in o && void 0 === (n = o.set(e, n, r))) ||
                  (u[t] = n)),
              void 0)
        );
      }
    },
    css: function (e, t, n, r) {
      var i,
        s,
        o,
        a = Z.camelCase(t);
      return (
        (t = Z.cssProps[a] || (Z.cssProps[a] = E(e.style, a))),
        (o = Z.cssHooks[t] || Z.cssHooks[a]),
        o && "get" in o && (i = o.get(e, !0, n)),
        void 0 === i && (i = T(e, t, r)),
        "normal" === i && t in ze && (i = ze[t]),
        "" === n || n
          ? ((s = parseFloat(i)), n === !0 || Z.isNumeric(s) ? s || 0 : i)
          : i
      );
    },
  }),
    Z.each(["height", "width"], function (e, t) {
      Z.cssHooks[t] = {
        get: function (e, n, r) {
          if (n)
            return Ve.test(Z.css(e, "display")) && 0 === e.offsetWidth
              ? Z.swap(e, Ye, function () {
                  return P(e, t, r);
                })
              : P(e, t, r);
        },
        set: function (e, n, r) {
          var i = r && Xe(e);
          return S(
            e,
            n,
            r ? j(e, t, r, "border-box" === Z.css(e, "boxSizing", !1, i), i) : 0
          );
        },
      };
    }),
    (Z.cssHooks.marginRight = x(J.reliableMarginRight, function (e, t) {
      if (t)
        return Z.swap(e, { display: "inline-block" }, T, [e, "marginRight"]);
    })),
    Z.each({ margin: "", padding: "", border: "Width" }, function (e, t) {
      (Z.cssHooks[e + t] = {
        expand: function (n) {
          for (
            var r = 0, i = {}, s = "string" == typeof n ? n.split(" ") : [n];
            r < 4;
            r++
          )
            i[e + xe[r] + t] = s[r] || s[r - 2] || s[0];
          return i;
        },
      }),
        Fe.test(e) || (Z.cssHooks[e + t].set = S);
    }),
    Z.fn.extend({
      css: function (e, t) {
        return me(
          this,
          function (e, t, n) {
            var r,
              i,
              s = {},
              o = 0;
            if (Z.isArray(t)) {
              for (r = Xe(e), i = t.length; o < i; o++)
                s[t[o]] = Z.css(e, t[o], !1, r);
              return s;
            }
            return void 0 !== n ? Z.style(e, t, n) : Z.css(e, t);
          },
          e,
          t,
          arguments.length > 1
        );
      },
      show: function () {
        return w(this, !0);
      },
      hide: function () {
        return w(this);
      },
      toggle: function (e) {
        return "boolean" == typeof e
          ? e
            ? this.show()
            : this.hide()
          : this.each(function () {
              Ee(this) ? Z(this).show() : Z(this).hide();
            });
      },
    }),
    (Z.Tween = A),
    (A.prototype = {
      constructor: A,
      init: function (e, t, n, r, i, s) {
        (this.elem = e),
          (this.prop = n),
          (this.easing = i || "swing"),
          (this.options = t),
          (this.start = this.now = this.cur()),
          (this.end = r),
          (this.unit = s || (Z.cssNumber[n] ? "" : "px"));
      },
      cur: function () {
        var e = A.propHooks[this.prop];
        return e && e.get ? e.get(this) : A.propHooks._default.get(this);
      },
      run: function (e) {
        var t,
          n = A.propHooks[this.prop];
        return (
          this.options.duration
            ? (this.pos = t =
                Z.easing[this.easing](
                  e,
                  this.options.duration * e,
                  0,
                  1,
                  this.options.duration
                ))
            : (this.pos = t = e),
          (this.now = (this.end - this.start) * t + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : A.propHooks._default.set(this),
          this
        );
      },
    }),
    (A.prototype.init.prototype = A.prototype),
    (A.propHooks = {
      _default: {
        get: function (e) {
          var t;
          return null == e.elem[e.prop] ||
            (e.elem.style && null != e.elem.style[e.prop])
            ? ((t = Z.css(e.elem, e.prop, "")), t && "auto" !== t ? t : 0)
            : e.elem[e.prop];
        },
        set: function (e) {
          Z.fx.step[e.prop]
            ? Z.fx.step[e.prop](e)
            : e.elem.style &&
              (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop])
            ? Z.style(e.elem, e.prop, e.now + e.unit)
            : (e.elem[e.prop] = e.now);
        },
      },
    }),
    (A.propHooks.scrollTop = A.propHooks.scrollLeft =
      {
        set: function (e) {
          e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
        },
      }),
    (Z.easing = {
      linear: function (e) {
        return e;
      },
      swing: function (e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
    }),
    (Z.fx = A.prototype.init),
    (Z.fx.step = {});
  var Je,
    Ke,
    Qe = /^(?:toggle|show|hide)$/,
    Ze = new RegExp("^(?:([+-])=|)(" + Te + ")([a-z%]*)$", "i"),
    et = /queueHooks$/,
    tt = [D],
    nt = {
      "*": [
        function (e, t) {
          var n = this.createTween(e, t),
            r = n.cur(),
            i = Ze.exec(t),
            s = (i && i[3]) || (Z.cssNumber[e] ? "" : "px"),
            o =
              (Z.cssNumber[e] || ("px" !== s && +r)) &&
              Ze.exec(Z.css(n.elem, e)),
            a = 1,
            u = 20;
          if (o && o[3] !== s) {
            (s = s || o[3]), (i = i || []), (o = +r || 1);
            do (a = a || ".5"), (o /= a), Z.style(n.elem, e, o + s);
            while (a !== (a = n.cur() / r) && 1 !== a && --u);
          }
          return (
            i &&
              ((o = n.start = +o || +r || 0),
              (n.unit = s),
              (n.end = i[1] ? o + (i[1] + 1) * i[2] : +i[2])),
            n
          );
        },
      ],
    };
  (Z.Animation = Z.extend(k, {
    tweener: function (e, t) {
      Z.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.split(" "));
      for (var n, r = 0, i = e.length; r < i; r++)
        (n = e[r]), (nt[n] = nt[n] || []), nt[n].unshift(t);
    },
    prefilter: function (e, t) {
      t ? tt.unshift(e) : tt.push(e);
    },
  })),
    (Z.speed = function (e, t, n) {
      var r =
        e && "object" == typeof e
          ? Z.extend({}, e)
          : {
              complete: n || (!n && t) || (Z.isFunction(e) && e),
              duration: e,
              easing: (n && t) || (t && !Z.isFunction(t) && t),
            };
      return (
        (r.duration = Z.fx.off
          ? 0
          : "number" == typeof r.duration
          ? r.duration
          : r.duration in Z.fx.speeds
          ? Z.fx.speeds[r.duration]
          : Z.fx.speeds._default),
        (null != r.queue && r.queue !== !0) || (r.queue = "fx"),
        (r.old = r.complete),
        (r.complete = function () {
          Z.isFunction(r.old) && r.old.call(this),
            r.queue && Z.dequeue(this, r.queue);
        }),
        r
      );
    }),
    Z.fn.extend({
      fadeTo: function (e, t, n, r) {
        return this.filter(Ee)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: t }, e, n, r);
      },
      animate: function (e, t, n, r) {
        var i = Z.isEmptyObject(e),
          s = Z.speed(t, n, r),
          o = function () {
            var t = k(this, Z.extend({}, e), s);
            (i || ve.get(this, "finish")) && t.stop(!0);
          };
        return (
          (o.finish = o),
          i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
        );
      },
      stop: function (e, t, n) {
        var r = function (e) {
          var t = e.stop;
          delete e.stop, t(n);
        };
        return (
          "string" != typeof e && ((n = t), (t = e), (e = void 0)),
          t && e !== !1 && this.queue(e || "fx", []),
          this.each(function () {
            var t = !0,
              i = null != e && e + "queueHooks",
              s = Z.timers,
              o = ve.get(this);
            if (i) o[i] && o[i].stop && r(o[i]);
            else for (i in o) o[i] && o[i].stop && et.test(i) && r(o[i]);
            for (i = s.length; i--; )
              s[i].elem !== this ||
                (null != e && s[i].queue !== e) ||
                (s[i].anim.stop(n), (t = !1), s.splice(i, 1));
            (!t && n) || Z.dequeue(this, e);
          })
        );
      },
      finish: function (e) {
        return (
          e !== !1 && (e = e || "fx"),
          this.each(function () {
            var t,
              n = ve.get(this),
              r = n[e + "queue"],
              i = n[e + "queueHooks"],
              s = Z.timers,
              o = r ? r.length : 0;
            for (
              n.finish = !0,
                Z.queue(this, e, []),
                i && i.stop && i.stop.call(this, !0),
                t = s.length;
              t--;

            )
              s[t].elem === this &&
                s[t].queue === e &&
                (s[t].anim.stop(!0), s.splice(t, 1));
            for (t = 0; t < o; t++)
              r[t] && r[t].finish && r[t].finish.call(this);
            delete n.finish;
          })
        );
      },
    }),
    Z.each(["toggle", "show", "hide"], function (e, t) {
      var n = Z.fn[t];
      Z.fn[t] = function (e, r, i) {
        return null == e || "boolean" == typeof e
          ? n.apply(this, arguments)
          : this.animate(C(t, !0), e, r, i);
      };
    }),
    Z.each(
      {
        slideDown: C("show"),
        slideUp: C("hide"),
        slideToggle: C("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (e, t) {
        Z.fn[e] = function (e, n, r) {
          return this.animate(t, e, n, r);
        };
      }
    ),
    (Z.timers = []),
    (Z.fx.tick = function () {
      var e,
        t = 0,
        n = Z.timers;
      for (Je = Z.now(); t < n.length; t++)
        (e = n[t]), e() || n[t] !== e || n.splice(t--, 1);
      n.length || Z.fx.stop(), (Je = void 0);
    }),
    (Z.fx.timer = function (e) {
      Z.timers.push(e), e() ? Z.fx.start() : Z.timers.pop();
    }),
    (Z.fx.interval = 13),
    (Z.fx.start = function () {
      Ke || (Ke = setInterval(Z.fx.tick, Z.fx.interval));
    }),
    (Z.fx.stop = function () {
      clearInterval(Ke), (Ke = null);
    }),
    (Z.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (Z.fn.delay = function (e, t) {
      return (
        (e = Z.fx ? Z.fx.speeds[e] || e : e),
        (t = t || "fx"),
        this.queue(t, function (t, n) {
          var r = setTimeout(t, e);
          n.stop = function () {
            clearTimeout(r);
          };
        })
      );
    }),
    (function () {
      var e = K.createElement("input"),
        t = K.createElement("select"),
        n = t.appendChild(K.createElement("option"));
      (e.type = "checkbox"),
        (J.checkOn = "" !== e.value),
        (J.optSelected = n.selected),
        (t.disabled = !0),
        (J.optDisabled = !n.disabled),
        (e = K.createElement("input")),
        (e.value = "t"),
        (e.type = "radio"),
        (J.radioValue = "t" === e.value);
    })();
  var rt,
    it,
    st = Z.expr.attrHandle;
  Z.fn.extend({
    attr: function (e, t) {
      return me(this, Z.attr, e, t, arguments.length > 1);
    },
    removeAttr: function (e) {
      return this.each(function () {
        Z.removeAttr(this, e);
      });
    },
  }),
    Z.extend({
      attr: function (e, t, n) {
        var r,
          i,
          s = e.nodeType;
        if (e && 3 !== s && 8 !== s && 2 !== s)
          return typeof e.getAttribute === je
            ? Z.prop(e, t, n)
            : ((1 === s && Z.isXMLDoc(e)) ||
                ((t = t.toLowerCase()),
                (r = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? it : rt))),
              void 0 === n
                ? r && "get" in r && null !== (i = r.get(e, t))
                  ? i
                  : ((i = Z.find.attr(e, t)), null == i ? void 0 : i)
                : null !== n
                ? r && "set" in r && void 0 !== (i = r.set(e, n, t))
                  ? i
                  : (e.setAttribute(t, n + ""), n)
                : void Z.removeAttr(e, t));
      },
      removeAttr: function (e, t) {
        var n,
          r,
          i = 0,
          s = t && t.match(pe);
        if (s && 1 === e.nodeType)
          for (; (n = s[i++]); )
            (r = Z.propFix[n] || n),
              Z.expr.match.bool.test(n) && (e[r] = !1),
              e.removeAttribute(n);
      },
      attrHooks: {
        type: {
          set: function (e, t) {
            if (!J.radioValue && "radio" === t && Z.nodeName(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          },
        },
      },
    }),
    (it = {
      set: function (e, t, n) {
        return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n), n;
      },
    }),
    Z.each(Z.expr.match.bool.source.match(/\w+/g), function (e, t) {
      var n = st[t] || Z.find.attr;
      st[t] = function (e, t, r) {
        var i, s;
        return (
          r ||
            ((s = st[t]),
            (st[t] = i),
            (i = null != n(e, t, r) ? t.toLowerCase() : null),
            (st[t] = s)),
          i
        );
      };
    });
  var ot = /^(?:input|select|textarea|button)$/i;
  Z.fn.extend({
    prop: function (e, t) {
      return me(this, Z.prop, e, t, arguments.length > 1);
    },
    removeProp: function (e) {
      return this.each(function () {
        delete this[Z.propFix[e] || e];
      });
    },
  }),
    Z.extend({
      propFix: { for: "htmlFor", class: "className" },
      prop: function (e, t, n) {
        var r,
          i,
          s,
          o = e.nodeType;
        if (e && 3 !== o && 8 !== o && 2 !== o)
          return (
            (s = 1 !== o || !Z.isXMLDoc(e)),
            s && ((t = Z.propFix[t] || t), (i = Z.propHooks[t])),
            void 0 !== n
              ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                ? r
                : (e[t] = n)
              : i && "get" in i && null !== (r = i.get(e, t))
              ? r
              : e[t]
          );
      },
      propHooks: {
        tabIndex: {
          get: function (e) {
            return e.hasAttribute("tabindex") || ot.test(e.nodeName) || e.href
              ? e.tabIndex
              : -1;
          },
        },
      },
    }),
    J.optSelected ||
      (Z.propHooks.selected = {
        get: function (e) {
          var t = e.parentNode;
          return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
      }),
    Z.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        Z.propFix[this.toLowerCase()] = this;
      }
    );
  var at = /[\t\r\n\f]/g;
  Z.fn.extend({
    addClass: function (e) {
      var t,
        n,
        r,
        i,
        s,
        o,
        a = "string" == typeof e && e,
        u = 0,
        c = this.length;
      if (Z.isFunction(e))
        return this.each(function (t) {
          Z(this).addClass(e.call(this, t, this.className));
        });
      if (a)
        for (t = (e || "").match(pe) || []; u < c; u++)
          if (
            ((n = this[u]),
            (r =
              1 === n.nodeType &&
              (n.className ? (" " + n.className + " ").replace(at, " ") : " ")))
          ) {
            for (s = 0; (i = t[s++]); )
              r.indexOf(" " + i + " ") < 0 && (r += i + " ");
            (o = Z.trim(r)), n.className !== o && (n.className = o);
          }
      return this;
    },
    removeClass: function (e) {
      var t,
        n,
        r,
        i,
        s,
        o,
        a = 0 === arguments.length || ("string" == typeof e && e),
        u = 0,
        c = this.length;
      if (Z.isFunction(e))
        return this.each(function (t) {
          Z(this).removeClass(e.call(this, t, this.className));
        });
      if (a)
        for (t = (e || "").match(pe) || []; u < c; u++)
          if (
            ((n = this[u]),
            (r =
              1 === n.nodeType &&
              (n.className ? (" " + n.className + " ").replace(at, " ") : "")))
          ) {
            for (s = 0; (i = t[s++]); )
              for (; r.indexOf(" " + i + " ") >= 0; )
                r = r.replace(" " + i + " ", " ");
            (o = e ? Z.trim(r) : ""), n.className !== o && (n.className = o);
          }
      return this;
    },
    toggleClass: function (e, t) {
      var n = typeof e;
      return "boolean" == typeof t && "string" === n
        ? t
          ? this.addClass(e)
          : this.removeClass(e)
        : Z.isFunction(e)
        ? this.each(function (n) {
            Z(this).toggleClass(e.call(this, n, this.className, t), t);
          })
        : this.each(function () {
            if ("string" === n)
              for (
                var t, r = 0, i = Z(this), s = e.match(pe) || [];
                (t = s[r++]);

              )
                i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
            else
              (n !== je && "boolean" !== n) ||
                (this.className &&
                  ve.set(this, "__className__", this.className),
                (this.className =
                  this.className || e === !1
                    ? ""
                    : ve.get(this, "__className__") || ""));
          });
    },
    hasClass: function (e) {
      for (var t = " " + e + " ", n = 0, r = this.length; n < r; n++)
        if (
          1 === this[n].nodeType &&
          (" " + this[n].className + " ").replace(at, " ").indexOf(t) >= 0
        )
          return !0;
      return !1;
    },
  });
  var ut = /\r/g;
  Z.fn.extend({
    val: function (e) {
      var t,
        n,
        r,
        i = this[0];
      {
        if (arguments.length)
          return (
            (r = Z.isFunction(e)),
            this.each(function (n) {
              var i;
              1 === this.nodeType &&
                ((i = r ? e.call(this, n, Z(this).val()) : e),
                null == i
                  ? (i = "")
                  : "number" == typeof i
                  ? (i += "")
                  : Z.isArray(i) &&
                    (i = Z.map(i, function (e) {
                      return null == e ? "" : e + "";
                    })),
                (t =
                  Z.valHooks[this.type] ||
                  Z.valHooks[this.nodeName.toLowerCase()]),
                (t && "set" in t && void 0 !== t.set(this, i, "value")) ||
                  (this.value = i));
            })
          );
        if (i)
          return (
            (t = Z.valHooks[i.type] || Z.valHooks[i.nodeName.toLowerCase()]),
            t && "get" in t && void 0 !== (n = t.get(i, "value"))
              ? n
              : ((n = i.value),
                "string" == typeof n ? n.replace(ut, "") : null == n ? "" : n)
          );
      }
    },
  }),
    Z.extend({
      valHooks: {
        option: {
          get: function (e) {
            var t = Z.find.attr(e, "value");
            return null != t ? t : Z.trim(Z.text(e));
          },
        },
        select: {
          get: function (e) {
            for (
              var t,
                n,
                r = e.options,
                i = e.selectedIndex,
                s = "select-one" === e.type || i < 0,
                o = s ? null : [],
                a = s ? i + 1 : r.length,
                u = i < 0 ? a : s ? i : 0;
              u < a;
              u++
            )
              if (
                ((n = r[u]),
                (n.selected || u === i) &&
                  (J.optDisabled
                    ? !n.disabled
                    : null === n.getAttribute("disabled")) &&
                  (!n.parentNode.disabled ||
                    !Z.nodeName(n.parentNode, "optgroup")))
              ) {
                if (((t = Z(n).val()), s)) return t;
                o.push(t);
              }
            return o;
          },
          set: function (e, t) {
            for (
              var n, r, i = e.options, s = Z.makeArray(t), o = i.length;
              o--;

            )
              (r = i[o]), (r.selected = Z.inArray(r.value, s) >= 0) && (n = !0);
            return n || (e.selectedIndex = -1), s;
          },
        },
      },
    }),
    Z.each(["radio", "checkbox"], function () {
      (Z.valHooks[this] = {
        set: function (e, t) {
          if (Z.isArray(t)) return (e.checked = Z.inArray(Z(e).val(), t) >= 0);
        },
      }),
        J.checkOn ||
          (Z.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value;
          });
    }),
    Z.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
        " "
      ),
      function (e, t) {
        Z.fn[t] = function (e, n) {
          return arguments.length > 0
            ? this.on(t, null, e, n)
            : this.trigger(t);
        };
      }
    ),
    Z.fn.extend({
      hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      },
      bind: function (e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function (e, t) {
        return this.off(e, null, t);
      },
      delegate: function (e, t, n, r) {
        return this.on(t, e, n, r);
      },
      undelegate: function (e, t, n) {
        return 1 === arguments.length
          ? this.off(e, "**")
          : this.off(t, e || "**", n);
      },
    });
  var ct = Z.now(),
    lt = /\?/;
  (Z.parseJSON = function (e) {
    return JSON.parse(e + "");
  }),
    (Z.parseXML = function (e) {
      var t, n;
      if (!e || "string" != typeof e) return null;
      try {
        (n = new DOMParser()), (t = n.parseFromString(e, "text/xml"));
      } catch (r) {
        t = void 0;
      }
      return (
        (t && !t.getElementsByTagName("parsererror").length) ||
          Z.error("Invalid XML: " + e),
        t
      );
    });
  var dt = /#.*$/,
    ht = /([?&])_=[^&]*/,
    pt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    ft = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    gt = /^(?:GET|HEAD)$/,
    mt = /^\/\//,
    vt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    _t = {},
    yt = {},
    bt = "*/".concat("*"),
    Tt = e.location.href,
    xt = vt.exec(Tt.toLowerCase()) || [];
  Z.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: Tt,
      type: "GET",
      isLocal: ft.test(xt[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": bt,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript",
      },
      contents: { xml: /xml/, html: /html/, json: /json/ },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON",
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": Z.parseJSON,
        "text xml": Z.parseXML,
      },
      flatOptions: { url: !0, context: !0 },
    },
    ajaxSetup: function (e, t) {
      return t ? q(q(e, Z.ajaxSettings), t) : q(Z.ajaxSettings, e);
    },
    ajaxPrefilter: H(_t),
    ajaxTransport: H(yt),
    ajax: function (e, t) {
      function n(e, t, n, o) {
        var u,
          l,
          v,
          _,
          b,
          x = t;
        2 !== y &&
          ((y = 2),
          a && clearTimeout(a),
          (r = void 0),
          (s = o || ""),
          (T.readyState = e > 0 ? 4 : 0),
          (u = (e >= 200 && e < 300) || 304 === e),
          n && (_ = M(d, T, n)),
          (_ = O(d, _, T, u)),
          u
            ? (d.ifModified &&
                ((b = T.getResponseHeader("Last-Modified")),
                b && (Z.lastModified[i] = b),
                (b = T.getResponseHeader("etag")),
                b && (Z.etag[i] = b)),
              204 === e || "HEAD" === d.type
                ? (x = "nocontent")
                : 304 === e
                ? (x = "notmodified")
                : ((x = _.state), (l = _.data), (v = _.error), (u = !v)))
            : ((v = x), (!e && x) || ((x = "error"), e < 0 && (e = 0))),
          (T.status = e),
          (T.statusText = (t || x) + ""),
          u ? f.resolveWith(h, [l, x, T]) : f.rejectWith(h, [T, x, v]),
          T.statusCode(m),
          (m = void 0),
          c && p.trigger(u ? "ajaxSuccess" : "ajaxError", [T, d, u ? l : v]),
          g.fireWith(h, [T, x]),
          c &&
            (p.trigger("ajaxComplete", [T, d]),
            --Z.active || Z.event.trigger("ajaxStop")));
      }
      "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
      var r,
        i,
        s,
        o,
        a,
        u,
        c,
        l,
        d = Z.ajaxSetup({}, t),
        h = d.context || d,
        p = d.context && (h.nodeType || h.jquery) ? Z(h) : Z.event,
        f = Z.Deferred(),
        g = Z.Callbacks("once memory"),
        m = d.statusCode || {},
        v = {},
        _ = {},
        y = 0,
        b = "canceled",
        T = {
          readyState: 0,
          getResponseHeader: function (e) {
            var t;
            if (2 === y) {
              if (!o)
                for (o = {}; (t = pt.exec(s)); ) o[t[1].toLowerCase()] = t[2];
              t = o[e.toLowerCase()];
            }
            return null == t ? null : t;
          },
          getAllResponseHeaders: function () {
            return 2 === y ? s : null;
          },
          setRequestHeader: function (e, t) {
            var n = e.toLowerCase();
            return y || ((e = _[n] = _[n] || e), (v[e] = t)), this;
          },
          overrideMimeType: function (e) {
            return y || (d.mimeType = e), this;
          },
          statusCode: function (e) {
            var t;
            if (e)
              if (y < 2) for (t in e) m[t] = [m[t], e[t]];
              else T.always(e[T.status]);
            return this;
          },
          abort: function (e) {
            var t = e || b;
            return r && r.abort(t), n(0, t), this;
          },
        };
      if (
        ((f.promise(T).complete = g.add),
        (T.success = T.done),
        (T.error = T.fail),
        (d.url = ((e || d.url || Tt) + "")
          .replace(dt, "")
          .replace(mt, xt[1] + "//")),
        (d.type = t.method || t.type || d.method || d.type),
        (d.dataTypes = Z.trim(d.dataType || "*")
          .toLowerCase()
          .match(pe) || [""]),
        null == d.crossDomain &&
          ((u = vt.exec(d.url.toLowerCase())),
          (d.crossDomain = !(
            !u ||
            (u[1] === xt[1] &&
              u[2] === xt[2] &&
              (u[3] || ("http:" === u[1] ? "80" : "443")) ===
                (xt[3] || ("http:" === xt[1] ? "80" : "443")))
          ))),
        d.data &&
          d.processData &&
          "string" != typeof d.data &&
          (d.data = Z.param(d.data, d.traditional)),
        I(_t, d, t, T),
        2 === y)
      )
        return T;
      (c = Z.event && d.global),
        c && 0 === Z.active++ && Z.event.trigger("ajaxStart"),
        (d.type = d.type.toUpperCase()),
        (d.hasContent = !gt.test(d.type)),
        (i = d.url),
        d.hasContent ||
          (d.data &&
            ((i = d.url += (lt.test(i) ? "&" : "?") + d.data), delete d.data),
          d.cache === !1 &&
            (d.url = ht.test(i)
              ? i.replace(ht, "$1_=" + ct++)
              : i + (lt.test(i) ? "&" : "?") + "_=" + ct++)),
        d.ifModified &&
          (Z.lastModified[i] &&
            T.setRequestHeader("If-Modified-Since", Z.lastModified[i]),
          Z.etag[i] && T.setRequestHeader("If-None-Match", Z.etag[i])),
        ((d.data && d.hasContent && d.contentType !== !1) || t.contentType) &&
          T.setRequestHeader("Content-Type", d.contentType),
        T.setRequestHeader(
          "Accept",
          d.dataTypes[0] && d.accepts[d.dataTypes[0]]
            ? d.accepts[d.dataTypes[0]] +
                ("*" !== d.dataTypes[0] ? ", " + bt + "; q=0.01" : "")
            : d.accepts["*"]
        );
      for (l in d.headers) T.setRequestHeader(l, d.headers[l]);
      if (d.beforeSend && (d.beforeSend.call(h, T, d) === !1 || 2 === y))
        return T.abort();
      b = "abort";
      for (l in { success: 1, error: 1, complete: 1 }) T[l](d[l]);
      if ((r = I(yt, d, t, T))) {
        (T.readyState = 1),
          c && p.trigger("ajaxSend", [T, d]),
          d.async &&
            d.timeout > 0 &&
            (a = setTimeout(function () {
              T.abort("timeout");
            }, d.timeout));
        try {
          (y = 1), r.send(v, n);
        } catch (x) {
          if (!(y < 2)) throw x;
          n(-1, x);
        }
      } else n(-1, "No Transport");
      return T;
    },
    getJSON: function (e, t, n) {
      return Z.get(e, t, n, "json");
    },
    getScript: function (e, t) {
      return Z.get(e, void 0, t, "script");
    },
  }),
    Z.each(["get", "post"], function (e, t) {
      Z[t] = function (e, n, r, i) {
        return (
          Z.isFunction(n) && ((i = i || r), (r = n), (n = void 0)),
          Z.ajax({ url: e, type: t, dataType: i, data: n, success: r })
        );
      };
    }),
    (Z._evalUrl = function (e) {
      return Z.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        throws: !0,
      });
    }),
    Z.fn.extend({
      wrapAll: function (e) {
        var t;
        return Z.isFunction(e)
          ? this.each(function (t) {
              Z(this).wrapAll(e.call(this, t));
            })
          : (this[0] &&
              ((t = Z(e, this[0].ownerDocument).eq(0).clone(!0)),
              this[0].parentNode && t.insertBefore(this[0]),
              t
                .map(function () {
                  for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                  return e;
                })
                .append(this)),
            this);
      },
      wrapInner: function (e) {
        return Z.isFunction(e)
          ? this.each(function (t) {
              Z(this).wrapInner(e.call(this, t));
            })
          : this.each(function () {
              var t = Z(this),
                n = t.contents();
              n.length ? n.wrapAll(e) : t.append(e);
            });
      },
      wrap: function (e) {
        var t = Z.isFunction(e);
        return this.each(function (n) {
          Z(this).wrapAll(t ? e.call(this, n) : e);
        });
      },
      unwrap: function () {
        return this.parent()
          .each(function () {
            Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes);
          })
          .end();
      },
    }),
    (Z.expr.filters.hidden = function (e) {
      return e.offsetWidth <= 0 && e.offsetHeight <= 0;
    }),
    (Z.expr.filters.visible = function (e) {
      return !Z.expr.filters.hidden(e);
    });
  var Et = /%20/g,
    St = /\[\]$/,
    jt = /\r?\n/g,
    Pt = /^(?:submit|button|image|reset|file)$/i,
    wt = /^(?:input|select|textarea|keygen)/i;
  (Z.param = function (e, t) {
    var n,
      r = [],
      i = function (e, t) {
        (t = Z.isFunction(t) ? t() : null == t ? "" : t),
          (r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t));
      };
    if (
      (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional),
      Z.isArray(e) || (e.jquery && !Z.isPlainObject(e)))
    )
      Z.each(e, function () {
        i(this.name, this.value);
      });
    else for (n in e) U(n, e[n], t, i);
    return r.join("&").replace(Et, "+");
  }),
    Z.fn.extend({
      serialize: function () {
        return Z.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var e = Z.prop(this, "elements");
          return e ? Z.makeArray(e) : this;
        })
          .filter(function () {
            var e = this.type;
            return (
              this.name &&
              !Z(this).is(":disabled") &&
              wt.test(this.nodeName) &&
              !Pt.test(e) &&
              (this.checked || !Se.test(e))
            );
          })
          .map(function (e, t) {
            var n = Z(this).val();
            return null == n
              ? null
              : Z.isArray(n)
              ? Z.map(n, function (e) {
                  return { name: t.name, value: e.replace(jt, "\r\n") };
                })
              : { name: t.name, value: n.replace(jt, "\r\n") };
          })
          .get();
      },
    }),
    (Z.ajaxSettings.xhr = function () {
      try {
        return new XMLHttpRequest();
      } catch (e) {}
    });
  var At = 0,
    Lt = {},
    Ct = { 0: 200, 1223: 204 },
    Nt = Z.ajaxSettings.xhr();
  e.attachEvent &&
    e.attachEvent("onunload", function () {
      for (var e in Lt) Lt[e]();
    }),
    (J.cors = !!Nt && "withCredentials" in Nt),
    (J.ajax = Nt = !!Nt),
    Z.ajaxTransport(function (e) {
      var t;
      if (J.cors || (Nt && !e.crossDomain))
        return {
          send: function (n, r) {
            var i,
              s = e.xhr(),
              o = ++At;
            if (
              (s.open(e.type, e.url, e.async, e.username, e.password),
              e.xhrFields)
            )
              for (i in e.xhrFields) s[i] = e.xhrFields[i];
            e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType),
              e.crossDomain ||
                n["X-Requested-With"] ||
                (n["X-Requested-With"] = "XMLHttpRequest");
            for (i in n) s.setRequestHeader(i, n[i]);
            (t = function (e) {
              return function () {
                t &&
                  (delete Lt[o],
                  (t = s.onload = s.onerror = null),
                  "abort" === e
                    ? s.abort()
                    : "error" === e
                    ? r(s.status, s.statusText)
                    : r(
                        Ct[s.status] || s.status,
                        s.statusText,
                        "string" == typeof s.responseText
                          ? { text: s.responseText }
                          : void 0,
                        s.getAllResponseHeaders()
                      ));
              };
            }),
              (s.onload = t()),
              (s.onerror = t("error")),
              (t = Lt[o] = t("abort"));
            try {
              s.send((e.hasContent && e.data) || null);
            } catch (a) {
              if (t) throw a;
            }
          },
          abort: function () {
            t && t();
          },
        };
    }),
    Z.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /(?:java|ecma)script/ },
      converters: {
        "text script": function (e) {
          return Z.globalEval(e), e;
        },
      },
    }),
    Z.ajaxPrefilter("script", function (e) {
      void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
    }),
    Z.ajaxTransport("script", function (e) {
      if (e.crossDomain) {
        var t, n;
        return {
          send: function (r, i) {
            (t = Z("<script>")
              .prop({ async: !0, charset: e.scriptCharset, src: e.url })
              .on(
                "load error",
                (n = function (e) {
                  t.remove(),
                    (n = null),
                    e && i("error" === e.type ? 404 : 200, e.type);
                })
              )),
              K.head.appendChild(t[0]);
          },
          abort: function () {
            n && n();
          },
        };
      }
    });
  var Dt = [],
    Rt = /(=)\?(?=&|$)|\?\?/;
  Z.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = Dt.pop() || Z.expando + "_" + ct++;
      return (this[e] = !0), e;
    },
  }),
    Z.ajaxPrefilter("json jsonp", function (t, n, r) {
      var i,
        s,
        o,
        a =
          t.jsonp !== !1 &&
          (Rt.test(t.url)
            ? "url"
            : "string" == typeof t.data &&
              !(t.contentType || "").indexOf(
                "application/x-www-form-urlencoded"
              ) &&
              Rt.test(t.data) &&
              "data");
      if (a || "jsonp" === t.dataTypes[0])
        return (
          (i = t.jsonpCallback =
            Z.isFunction(t.jsonpCallback)
              ? t.jsonpCallback()
              : t.jsonpCallback),
          a
            ? (t[a] = t[a].replace(Rt, "$1" + i))
            : t.jsonp !== !1 &&
              (t.url += (lt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
          (t.converters["script json"] = function () {
            return o || Z.error(i + " was not called"), o[0];
          }),
          (t.dataTypes[0] = "json"),
          (s = e[i]),
          (e[i] = function () {
            o = arguments;
          }),
          r.always(function () {
            (e[i] = s),
              t[i] && ((t.jsonpCallback = n.jsonpCallback), Dt.push(i)),
              o && Z.isFunction(s) && s(o[0]),
              (o = s = void 0);
          }),
          "script"
        );
    }),
    (Z.parseHTML = function (e, t, n) {
      if (!e || "string" != typeof e) return null;
      "boolean" == typeof t && ((n = t), (t = !1)), (t = t || K);
      var r = oe.exec(e),
        i = !n && [];
      return r
        ? [t.createElement(r[1])]
        : ((r = Z.buildFragment([e], t, i)),
          i && i.length && Z(i).remove(),
          Z.merge([], r.childNodes));
    });
  var kt = Z.fn.load;
  (Z.fn.load = function (e, t, n) {
    if ("string" != typeof e && kt) return kt.apply(this, arguments);
    var r,
      i,
      s,
      o = this,
      a = e.indexOf(" ");
    return (
      a >= 0 && ((r = Z.trim(e.slice(a))), (e = e.slice(0, a))),
      Z.isFunction(t)
        ? ((n = t), (t = void 0))
        : t && "object" == typeof t && (i = "POST"),
      o.length > 0 &&
        Z.ajax({ url: e, type: i, dataType: "html", data: t })
          .done(function (e) {
            (s = arguments),
              o.html(r ? Z("<div>").append(Z.parseHTML(e)).find(r) : e);
          })
          .complete(
            n &&
              function (e, t) {
                o.each(n, s || [e.responseText, t, e]);
              }
          ),
      this
    );
  }),
    Z.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (e, t) {
        Z.fn[t] = function (e) {
          return this.on(t, e);
        };
      }
    ),
    (Z.expr.filters.animated = function (e) {
      return Z.grep(Z.timers, function (t) {
        return e === t.elem;
      }).length;
    });
  var Ht = e.document.documentElement;
  (Z.offset = {
    setOffset: function (e, t, n) {
      var r,
        i,
        s,
        o,
        a,
        u,
        c,
        l = Z.css(e, "position"),
        d = Z(e),
        h = {};
      "static" === l && (e.style.position = "relative"),
        (a = d.offset()),
        (s = Z.css(e, "top")),
        (u = Z.css(e, "left")),
        (c =
          ("absolute" === l || "fixed" === l) && (s + u).indexOf("auto") > -1),
        c
          ? ((r = d.position()), (o = r.top), (i = r.left))
          : ((o = parseFloat(s) || 0), (i = parseFloat(u) || 0)),
        Z.isFunction(t) && (t = t.call(e, n, a)),
        null != t.top && (h.top = t.top - a.top + o),
        null != t.left && (h.left = t.left - a.left + i),
        "using" in t ? t.using.call(e, h) : d.css(h);
    },
  }),
    Z.fn.extend({
      offset: function (e) {
        if (arguments.length)
          return void 0 === e
            ? this
            : this.each(function (t) {
                Z.offset.setOffset(this, e, t);
              });
        var t,
          n,
          r = this[0],
          i = { top: 0, left: 0 },
          s = r && r.ownerDocument;
        if (s)
          return (
            (t = s.documentElement),
            Z.contains(t, r)
              ? (typeof r.getBoundingClientRect !== je &&
                  (i = r.getBoundingClientRect()),
                (n = F(s)),
                {
                  top: i.top + n.pageYOffset - t.clientTop,
                  left: i.left + n.pageXOffset - t.clientLeft,
                })
              : i
          );
      },
      position: function () {
        if (this[0]) {
          var e,
            t,
            n = this[0],
            r = { top: 0, left: 0 };
          return (
            "fixed" === Z.css(n, "position")
              ? (t = n.getBoundingClientRect())
              : ((e = this.offsetParent()),
                (t = this.offset()),
                Z.nodeName(e[0], "html") || (r = e.offset()),
                (r.top += Z.css(e[0], "borderTopWidth", !0)),
                (r.left += Z.css(e[0], "borderLeftWidth", !0))),
            {
              top: t.top - r.top - Z.css(n, "marginTop", !0),
              left: t.left - r.left - Z.css(n, "marginLeft", !0),
            }
          );
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (
            var e = this.offsetParent || Ht;
            e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position");

          )
            e = e.offsetParent;
          return e || Ht;
        });
      },
    }),
    Z.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (t, n) {
        var r = "pageYOffset" === n;
        Z.fn[t] = function (i) {
          return me(
            this,
            function (t, i, s) {
              var o = F(t);
              return void 0 === s
                ? o
                  ? o[n]
                  : t[i]
                : void (o
                    ? o.scrollTo(r ? e.pageXOffset : s, r ? s : e.pageYOffset)
                    : (t[i] = s));
            },
            t,
            i,
            arguments.length,
            null
          );
        };
      }
    ),
    Z.each(["top", "left"], function (e, t) {
      Z.cssHooks[t] = x(J.pixelPosition, function (e, n) {
        if (n) return (n = T(e, t)), Be.test(n) ? Z(e).position()[t] + "px" : n;
      });
    }),
    Z.each({ Height: "height", Width: "width" }, function (e, t) {
      Z.each(
        { padding: "inner" + e, content: t, "": "outer" + e },
        function (n, r) {
          Z.fn[r] = function (r, i) {
            var s = arguments.length && (n || "boolean" != typeof r),
              o = n || (r === !0 || i === !0 ? "margin" : "border");
            return me(
              this,
              function (t, n, r) {
                var i;
                return Z.isWindow(t)
                  ? t.document.documentElement["client" + e]
                  : 9 === t.nodeType
                  ? ((i = t.documentElement),
                    Math.max(
                      t.body["scroll" + e],
                      i["scroll" + e],
                      t.body["offset" + e],
                      i["offset" + e],
                      i["client" + e]
                    ))
                  : void 0 === r
                  ? Z.css(t, n, o)
                  : Z.style(t, n, r, o);
              },
              t,
              s ? r : void 0,
              s,
              null
            );
          };
        }
      );
    }),
    (Z.fn.size = function () {
      return this.length;
    }),
    (Z.fn.andSelf = Z.fn.addBack),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function () {
        return Z;
      });
  var It = e.jQuery,
    qt = e.$;
  return (
    (Z.noConflict = function (t) {
      return e.$ === Z && (e.$ = qt), t && e.jQuery === Z && (e.jQuery = It), Z;
    }),
    typeof t === je && (e.jQuery = e.$ = Z),
    Z
  );
}),
  (this.createjs = this.createjs || {}),
  (function () {
    var e = (createjs.SoundJS = createjs.SoundJS || {});
    (e.version = "0.6.2"), (e.buildDate = "Thu, 26 Nov 2015 20:44:31 GMT");
  })(),
  (this.createjs = this.createjs || {}),
  (createjs.extend = function (e, t) {
    "use strict";
    function n() {
      this.constructor = e;
    }
    return (n.prototype = t.prototype), (e.prototype = new n());
  }),
  (this.createjs = this.createjs || {}),
  (createjs.promote = function (e, t) {
    "use strict";
    var n = e.prototype,
      r = (Object.getPrototypeOf && Object.getPrototypeOf(n)) || n.__proto__;
    if (r) {
      n[(t += "_") + "constructor"] = r.constructor;
      for (var i in r)
        n.hasOwnProperty(i) && "function" == typeof r[i] && (n[t + i] = r[i]);
    }
    return e;
  }),
  (this.createjs = this.createjs || {}),
  (createjs.indexOf = function (e, t) {
    "use strict";
    for (var n = 0, r = e.length; n < r; n++) if (t === e[n]) return n;
    return -1;
  }),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    createjs.proxy = function (e, t) {
      var n = Array.prototype.slice.call(arguments, 2);
      return function () {
        return e.apply(t, Array.prototype.slice.call(arguments, 0).concat(n));
      };
    };
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      throw "BrowserDetect cannot be instantiated";
    }
    var t = (e.agent = window.navigator.userAgent);
    (e.isWindowPhone =
      t.indexOf("IEMobile") > -1 || t.indexOf("Windows Phone") > -1),
      (e.isFirefox = t.indexOf("Firefox") > -1),
      (e.isOpera = null != window.opera),
      (e.isChrome = t.indexOf("Chrome") > -1),
      (e.isIOS =
        (t.indexOf("iPod") > -1 ||
          t.indexOf("iPhone") > -1 ||
          t.indexOf("iPad") > -1) &&
        !e.isWindowPhone),
      (e.isAndroid = t.indexOf("Android") > -1 && !e.isWindowPhone),
      (e.isBlackberry = t.indexOf("Blackberry") > -1),
      (createjs.BrowserDetect = e);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      (this._listeners = null), (this._captureListeners = null);
    }
    var t = e.prototype;
    (e.initialize = function (e) {
      (e.addEventListener = t.addEventListener),
        (e.on = t.on),
        (e.removeEventListener = e.off = t.removeEventListener),
        (e.removeAllEventListeners = t.removeAllEventListeners),
        (e.hasEventListener = t.hasEventListener),
        (e.dispatchEvent = t.dispatchEvent),
        (e._dispatchEvent = t._dispatchEvent),
        (e.willTrigger = t.willTrigger);
    }),
      (t.addEventListener = function (e, t, n) {
        var r;
        r = n
          ? (this._captureListeners = this._captureListeners || {})
          : (this._listeners = this._listeners || {});
        var i = r[e];
        return (
          i && this.removeEventListener(e, t, n),
          (i = r[e]),
          i ? i.push(t) : (r[e] = [t]),
          t
        );
      }),
      (t.on = function (e, t, n, r, i, s) {
        return (
          t.handleEvent && ((n = n || t), (t = t.handleEvent)),
          (n = n || this),
          this.addEventListener(
            e,
            function (e) {
              t.call(n, e, i), r && e.remove();
            },
            s
          )
        );
      }),
      (t.removeEventListener = function (e, t, n) {
        var r = n ? this._captureListeners : this._listeners;
        if (r) {
          var i = r[e];
          if (i)
            for (var s = 0, o = i.length; s < o; s++)
              if (i[s] == t) {
                1 == o ? delete r[e] : i.splice(s, 1);
                break;
              }
        }
      }),
      (t.off = t.removeEventListener),
      (t.removeAllEventListeners = function (e) {
        e
          ? (this._listeners && delete this._listeners[e],
            this._captureListeners && delete this._captureListeners[e])
          : (this._listeners = this._captureListeners = null);
      }),
      (t.dispatchEvent = function (e, t, n) {
        if ("string" == typeof e) {
          var r = this._listeners;
          if (!(t || (r && r[e]))) return !0;
          e = new createjs.Event(e, t, n);
        } else e.target && e.clone && (e = e.clone());
        try {
          e.target = this;
        } catch (i) {}
        if (e.bubbles && this.parent) {
          for (var s = this, o = [s]; s.parent; ) o.push((s = s.parent));
          var a,
            u = o.length;
          for (a = u - 1; a >= 0 && !e.propagationStopped; a--)
            o[a]._dispatchEvent(e, 1 + (0 == a));
          for (a = 1; a < u && !e.propagationStopped; a++)
            o[a]._dispatchEvent(e, 3);
        } else this._dispatchEvent(e, 2);
        return !e.defaultPrevented;
      }),
      (t.hasEventListener = function (e) {
        var t = this._listeners,
          n = this._captureListeners;
        return !!((t && t[e]) || (n && n[e]));
      }),
      (t.willTrigger = function (e) {
        for (var t = this; t; ) {
          if (t.hasEventListener(e)) return !0;
          t = t.parent;
        }
        return !1;
      }),
      (t.toString = function () {
        return "[EventDispatcher]";
      }),
      (t._dispatchEvent = function (e, t) {
        var n,
          r = 1 == t ? this._captureListeners : this._listeners;
        if (e && r) {
          var i = r[e.type];
          if (!i || !(n = i.length)) return;
          try {
            e.currentTarget = this;
          } catch (s) {}
          try {
            e.eventPhase = t;
          } catch (s) {}
          (e.removed = !1), (i = i.slice());
          for (var o = 0; o < n && !e.immediatePropagationStopped; o++) {
            var a = i[o];
            a.handleEvent ? a.handleEvent(e) : a(e),
              e.removed && (this.off(e.type, a, 1 == t), (e.removed = !1));
          }
        }
      }),
      (createjs.EventDispatcher = e);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      (this.type = e),
        (this.target = null),
        (this.currentTarget = null),
        (this.eventPhase = 0),
        (this.bubbles = !!t),
        (this.cancelable = !!n),
        (this.timeStamp = new Date().getTime()),
        (this.defaultPrevented = !1),
        (this.propagationStopped = !1),
        (this.immediatePropagationStopped = !1),
        (this.removed = !1);
    }
    var t = e.prototype;
    (t.preventDefault = function () {
      this.defaultPrevented = this.cancelable && !0;
    }),
      (t.stopPropagation = function () {
        this.propagationStopped = !0;
      }),
      (t.stopImmediatePropagation = function () {
        this.immediatePropagationStopped = this.propagationStopped = !0;
      }),
      (t.remove = function () {
        this.removed = !0;
      }),
      (t.clone = function () {
        return new e(this.type, this.bubbles, this.cancelable);
      }),
      (t.set = function (e) {
        for (var t in e) this[t] = e[t];
        return this;
      }),
      (t.toString = function () {
        return "[Event (type=" + this.type + ")]";
      }),
      (createjs.Event = e);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      this.Event_constructor("error"),
        (this.title = e),
        (this.message = t),
        (this.data = n);
    }
    var t = createjs.extend(e, createjs.Event);
    (t.clone = function () {
      return new createjs.ErrorEvent(this.title, this.message, this.data);
    }),
      (createjs.ErrorEvent = createjs.promote(e, "Event"));
  })(),
  (this.createjs = this.createjs || {}),
  (function (e) {
    "use strict";
    function t(e, t) {
      this.Event_constructor("progress"),
        (this.loaded = e),
        (this.total = null == t ? 1 : t),
        (this.progress = 0 == t ? 0 : this.loaded / this.total);
    }
    var n = createjs.extend(t, createjs.Event);
    (n.clone = function () {
      return new createjs.ProgressEvent(this.loaded, this.total);
    }),
      (createjs.ProgressEvent = createjs.promote(t, "Event"));
  })(window),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      (this.src = null),
        (this.type = null),
        (this.id = null),
        (this.maintainOrder = !1),
        (this.callback = null),
        (this.data = null),
        (this.method = createjs.LoadItem.GET),
        (this.values = null),
        (this.headers = null),
        (this.withCredentials = !1),
        (this.mimeType = null),
        (this.crossOrigin = null),
        (this.loadTimeout = n.LOAD_TIMEOUT_DEFAULT);
    }
    var t = (e.prototype = {}),
      n = e;
    (n.LOAD_TIMEOUT_DEFAULT = 8e3),
      (n.create = function (t) {
        if ("string" == typeof t) {
          var r = new e();
          return (r.src = t), r;
        }
        if (t instanceof n) return t;
        if (t instanceof Object && t.src)
          return (
            null == t.loadTimeout && (t.loadTimeout = n.LOAD_TIMEOUT_DEFAULT), t
          );
        throw new Error("Type not recognized.");
      }),
      (t.set = function (e) {
        for (var t in e) this[t] = e[t];
        return this;
      }),
      (createjs.LoadItem = n);
  })(),
  (function () {
    var e = {};
    (e.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i),
      (e.RELATIVE_PATT = /^[.\/]*?\//i),
      (e.EXTENSION_PATT = /\/?[^\/]+\.(\w{1,5})$/i),
      (e.parseURI = function (t) {
        var n = { absolute: !1, relative: !1 };
        if (null == t) return n;
        var r = t.indexOf("?");
        r > -1 && (t = t.substr(0, r));
        var i;
        return (
          e.ABSOLUTE_PATT.test(t)
            ? (n.absolute = !0)
            : e.RELATIVE_PATT.test(t) && (n.relative = !0),
          (i = t.match(e.EXTENSION_PATT)) && (n.extension = i[1].toLowerCase()),
          n
        );
      }),
      (e.formatQueryString = function (e, t) {
        if (null == e) throw new Error("You must specify data.");
        var n = [];
        for (var r in e) n.push(r + "=" + escape(e[r]));
        return t && (n = n.concat(t)), n.join("&");
      }),
      (e.buildPath = function (e, t) {
        if (null == t) return e;
        var n = [],
          r = e.indexOf("?");
        if (r != -1) {
          var i = e.slice(r + 1);
          n = n.concat(i.split("&"));
        }
        return r != -1
          ? e.slice(0, r) + "?" + this.formatQueryString(t, n)
          : e + "?" + this.formatQueryString(t, n);
      }),
      (e.isCrossDomain = function (e) {
        var t = document.createElement("a");
        t.href = e.src;
        var n = document.createElement("a");
        n.href = location.href;
        var r =
          "" != t.hostname &&
          (t.port != n.port ||
            t.protocol != n.protocol ||
            t.hostname != n.hostname);
        return r;
      }),
      (e.isLocal = function (e) {
        var t = document.createElement("a");
        return (t.href = e.src), "" == t.hostname && "file:" == t.protocol;
      }),
      (e.isBinary = function (e) {
        switch (e) {
          case createjs.AbstractLoader.IMAGE:
          case createjs.AbstractLoader.BINARY:
            return !0;
          default:
            return !1;
        }
      }),
      (e.isImageTag = function (e) {
        return e instanceof HTMLImageElement;
      }),
      (e.isAudioTag = function (e) {
        return !!window.HTMLAudioElement && e instanceof HTMLAudioElement;
      }),
      (e.isVideoTag = function (e) {
        return !!window.HTMLVideoElement && e instanceof HTMLVideoElement;
      }),
      (e.isText = function (e) {
        switch (e) {
          case createjs.AbstractLoader.TEXT:
          case createjs.AbstractLoader.JSON:
          case createjs.AbstractLoader.MANIFEST:
          case createjs.AbstractLoader.XML:
          case createjs.AbstractLoader.CSS:
          case createjs.AbstractLoader.SVG:
          case createjs.AbstractLoader.JAVASCRIPT:
          case createjs.AbstractLoader.SPRITESHEET:
            return !0;
          default:
            return !1;
        }
      }),
      (e.getTypeByExtension = function (e) {
        if (null == e) return createjs.AbstractLoader.TEXT;
        switch (e.toLowerCase()) {
          case "jpeg":
          case "jpg":
          case "gif":
          case "png":
          case "webp":
          case "bmp":
            return createjs.AbstractLoader.IMAGE;
          case "ogg":
          case "mp3":
          case "webm":
            return createjs.AbstractLoader.SOUND;
          case "mp4":
          case "webm":
          case "ts":
            return createjs.AbstractLoader.VIDEO;
          case "json":
            return createjs.AbstractLoader.JSON;
          case "xml":
            return createjs.AbstractLoader.XML;
          case "css":
            return createjs.AbstractLoader.CSS;
          case "js":
            return createjs.AbstractLoader.JAVASCRIPT;
          case "svg":
            return createjs.AbstractLoader.SVG;
          default:
            return createjs.AbstractLoader.TEXT;
        }
      }),
      (createjs.RequestUtils = e);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      this.EventDispatcher_constructor(),
        (this.loaded = !1),
        (this.canceled = !1),
        (this.progress = 0),
        (this.type = n),
        (this.resultFormatter = null),
        e ? (this._item = createjs.LoadItem.create(e)) : (this._item = null),
        (this._preferXHR = t),
        (this._result = null),
        (this._rawResult = null),
        (this._loadedItems = null),
        (this._tagSrcAttribute = null),
        (this._tag = null);
    }
    var t = createjs.extend(e, createjs.EventDispatcher),
      n = e;
    (n.POST = "POST"),
      (n.GET = "GET"),
      (n.BINARY = "binary"),
      (n.CSS = "css"),
      (n.IMAGE = "image"),
      (n.JAVASCRIPT = "javascript"),
      (n.JSON = "json"),
      (n.JSONP = "jsonp"),
      (n.MANIFEST = "manifest"),
      (n.SOUND = "sound"),
      (n.VIDEO = "video"),
      (n.SPRITESHEET = "spritesheet"),
      (n.SVG = "svg"),
      (n.TEXT = "text"),
      (n.XML = "xml"),
      (t.getItem = function () {
        return this._item;
      }),
      (t.getResult = function (e) {
        return e ? this._rawResult : this._result;
      }),
      (t.getTag = function () {
        return this._tag;
      }),
      (t.setTag = function (e) {
        this._tag = e;
      }),
      (t.load = function () {
        this._createRequest(),
          this._request.on("complete", this, this),
          this._request.on("progress", this, this),
          this._request.on("loadStart", this, this),
          this._request.on("abort", this, this),
          this._request.on("timeout", this, this),
          this._request.on("error", this, this);
        var e = new createjs.Event("initialize");
        (e.loader = this._request), this.dispatchEvent(e), this._request.load();
      }),
      (t.cancel = function () {
        (this.canceled = !0), this.destroy();
      }),
      (t.destroy = function () {
        this._request &&
          (this._request.removeAllEventListeners(), this._request.destroy()),
          (this._request = null),
          (this._item = null),
          (this._rawResult = null),
          (this._result = null),
          (this._loadItems = null),
          this.removeAllEventListeners();
      }),
      (t.getLoadedItems = function () {
        return this._loadedItems;
      }),
      (t._createRequest = function () {
        this._preferXHR
          ? (this._request = new createjs.XHRRequest(this._item))
          : (this._request = new createjs.TagRequest(
              this._item,
              this._tag || this._createTag(),
              this._tagSrcAttribute
            ));
      }),
      (t._createTag = function (e) {
        return null;
      }),
      (t._sendLoadStart = function () {
        this._isCanceled() || this.dispatchEvent("loadstart");
      }),
      (t._sendProgress = function (e) {
        if (!this._isCanceled()) {
          var t = null;
          "number" == typeof e
            ? ((this.progress = e),
              (t = new createjs.ProgressEvent(this.progress)))
            : ((t = e),
              (this.progress = e.loaded / e.total),
              (t.progress = this.progress),
              (isNaN(this.progress) || this.progress == 1 / 0) &&
                (this.progress = 0)),
            this.hasEventListener("progress") && this.dispatchEvent(t);
        }
      }),
      (t._sendComplete = function () {
        if (!this._isCanceled()) {
          this.loaded = !0;
          var e = new createjs.Event("complete");
          (e.rawResult = this._rawResult),
            null != this._result && (e.result = this._result),
            this.dispatchEvent(e);
        }
      }),
      (t._sendError = function (e) {
        !this._isCanceled() &&
          this.hasEventListener("error") &&
          (null == e && (e = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),
          this.dispatchEvent(e));
      }),
      (t._isCanceled = function () {
        return !(null != window.createjs && !this.canceled);
      }),
      (t.resultFormatter = null),
      (t.handleEvent = function (e) {
        switch (e.type) {
          case "complete":
            this._rawResult = e.target._response;
            var t = this.resultFormatter && this.resultFormatter(this);
            t instanceof Function
              ? t.call(
                  this,
                  createjs.proxy(this._resultFormatSuccess, this),
                  createjs.proxy(this._resultFormatFailed, this)
                )
              : ((this._result = t || this._rawResult), this._sendComplete());
            break;
          case "progress":
            this._sendProgress(e);
            break;
          case "error":
            this._sendError(e);
            break;
          case "loadstart":
            this._sendLoadStart();
            break;
          case "abort":
          case "timeout":
            this._isCanceled() ||
              this.dispatchEvent(
                new createjs.ErrorEvent(
                  "PRELOAD_" + e.type.toUpperCase() + "_ERROR"
                )
              );
        }
      }),
      (t._resultFormatSuccess = function (e) {
        (this._result = e), this._sendComplete();
      }),
      (t._resultFormatFailed = function (e) {
        this._sendError(e);
      }),
      (t.buildPath = function (e, t) {
        return createjs.RequestUtils.buildPath(e, t);
      }),
      (t.toString = function () {
        return "[PreloadJS AbstractLoader]";
      }),
      (createjs.AbstractLoader = createjs.promote(e, "EventDispatcher"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      this.AbstractLoader_constructor(e, t, n),
        (this.resultFormatter = this._formatResult),
        (this._tagSrcAttribute = "src"),
        this.on("initialize", this._updateXHR, this);
    }
    var t = createjs.extend(e, createjs.AbstractLoader);
    (t.load = function () {
      this._tag || (this._tag = this._createTag(this._item.src)),
        (this._tag.preload = "auto"),
        this._tag.load(),
        this.AbstractLoader_load();
    }),
      (t._createTag = function () {}),
      (t._createRequest = function () {
        this._preferXHR
          ? (this._request = new createjs.XHRRequest(this._item))
          : (this._request = new createjs.MediaTagRequest(
              this._item,
              this._tag || this._createTag(),
              this._tagSrcAttribute
            ));
      }),
      (t._updateXHR = function (e) {
        e.loader.setResponseType && e.loader.setResponseType("blob");
      }),
      (t._formatResult = function (e) {
        if (
          (this._tag.removeEventListener &&
            this._tag.removeEventListener(
              "canplaythrough",
              this._loadedHandler
            ),
          (this._tag.onstalled = null),
          this._preferXHR)
        ) {
          var t = window.URL || window.webkitURL,
            n = e.getResult(!0);
          e.getTag().src = t.createObjectURL(n);
        }
        return e.getTag();
      }),
      (createjs.AbstractMediaLoader = createjs.promote(e, "AbstractLoader"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    var e = function (e) {
        this._item = e;
      },
      t = createjs.extend(e, createjs.EventDispatcher);
    (t.load = function () {}),
      (t.destroy = function () {}),
      (t.cancel = function () {}),
      (createjs.AbstractRequest = createjs.promote(e, "EventDispatcher"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      this.AbstractRequest_constructor(e),
        (this._tag = t),
        (this._tagSrcAttribute = n),
        (this._loadedHandler = createjs.proxy(this._handleTagComplete, this)),
        (this._addedToDOM = !1),
        (this._startTagVisibility = null);
    }
    var t = createjs.extend(e, createjs.AbstractRequest);
    (t.load = function () {
      (this._tag.onload = createjs.proxy(this._handleTagComplete, this)),
        (this._tag.onreadystatechange = createjs.proxy(
          this._handleReadyStateChange,
          this
        )),
        (this._tag.onerror = createjs.proxy(this._handleError, this));
      var e = new createjs.Event("initialize");
      (e.loader = this._tag),
        this.dispatchEvent(e),
        this._hideTag(),
        (this._loadTimeout = setTimeout(
          createjs.proxy(this._handleTimeout, this),
          this._item.loadTimeout
        )),
        (this._tag[this._tagSrcAttribute] = this._item.src),
        null == this._tag.parentNode &&
          (window.document.body.appendChild(this._tag),
          (this._addedToDOM = !0));
    }),
      (t.destroy = function () {
        this._clean(), (this._tag = null), this.AbstractRequest_destroy();
      }),
      (t._handleReadyStateChange = function () {
        clearTimeout(this._loadTimeout);
        var e = this._tag;
        ("loaded" != e.readyState && "complete" != e.readyState) ||
          this._handleTagComplete();
      }),
      (t._handleError = function () {
        this._clean(), this.dispatchEvent("error");
      }),
      (t._handleTagComplete = function () {
        (this._rawResult = this._tag),
          (this._result =
            (this.resultFormatter && this.resultFormatter(this)) ||
            this._rawResult),
          this._clean(),
          this._showTag(),
          this.dispatchEvent("complete");
      }),
      (t._handleTimeout = function () {
        this._clean(), this.dispatchEvent(new createjs.Event("timeout"));
      }),
      (t._clean = function () {
        (this._tag.onload = null),
          (this._tag.onreadystatechange = null),
          (this._tag.onerror = null),
          this._addedToDOM &&
            null != this._tag.parentNode &&
            this._tag.parentNode.removeChild(this._tag),
          clearTimeout(this._loadTimeout);
      }),
      (t._hideTag = function () {
        (this._startTagVisibility = this._tag.style.visibility),
          (this._tag.style.visibility = "hidden");
      }),
      (t._showTag = function () {
        this._tag.style.visibility = this._startTagVisibility;
      }),
      (t._handleStalled = function () {}),
      (createjs.TagRequest = createjs.promote(e, "AbstractRequest"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n) {
      this.AbstractRequest_constructor(e),
        (this._tag = t),
        (this._tagSrcAttribute = n),
        (this._loadedHandler = createjs.proxy(this._handleTagComplete, this));
    }
    var t = createjs.extend(e, createjs.TagRequest);
    (t.load = function () {
      var e = createjs.proxy(this._handleStalled, this);
      this._stalledCallback = e;
      var t = createjs.proxy(this._handleProgress, this);
      (this._handleProgress = t),
        this._tag.addEventListener("stalled", e),
        this._tag.addEventListener("progress", t),
        this._tag.addEventListener &&
          this._tag.addEventListener("canplaythrough", this._loadedHandler, !1),
        this.TagRequest_load();
    }),
      (t._handleReadyStateChange = function () {
        clearTimeout(this._loadTimeout);
        var e = this._tag;
        ("loaded" != e.readyState && "complete" != e.readyState) ||
          this._handleTagComplete();
      }),
      (t._handleStalled = function () {}),
      (t._handleProgress = function (e) {
        if (e && !(e.loaded > 0 && 0 == e.total)) {
          var t = new createjs.ProgressEvent(e.loaded, e.total);
          this.dispatchEvent(t);
        }
      }),
      (t._clean = function () {
        this._tag.removeEventListener &&
          this._tag.removeEventListener("canplaythrough", this._loadedHandler),
          this._tag.removeEventListener("stalled", this._stalledCallback),
          this._tag.removeEventListener("progress", this._progressCallback),
          this.TagRequest__clean();
      }),
      (createjs.MediaTagRequest = createjs.promote(e, "TagRequest"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e) {
      this.AbstractRequest_constructor(e),
        (this._request = null),
        (this._loadTimeout = null),
        (this._xhrLevel = 1),
        (this._response = null),
        (this._rawResponse = null),
        (this._canceled = !1),
        (this._handleLoadStartProxy = createjs.proxy(
          this._handleLoadStart,
          this
        )),
        (this._handleProgressProxy = createjs.proxy(
          this._handleProgress,
          this
        )),
        (this._handleAbortProxy = createjs.proxy(this._handleAbort, this)),
        (this._handleErrorProxy = createjs.proxy(this._handleError, this)),
        (this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this)),
        (this._handleLoadProxy = createjs.proxy(this._handleLoad, this)),
        (this._handleReadyStateChangeProxy = createjs.proxy(
          this._handleReadyStateChange,
          this
        )),
        !this._createXHR(e);
    }
    var t = createjs.extend(e, createjs.AbstractRequest);
    (e.ACTIVEX_VERSIONS = [
      "Msxml2.XMLHTTP.6.0",
      "Msxml2.XMLHTTP.5.0",
      "Msxml2.XMLHTTP.4.0",
      "MSXML2.XMLHTTP.3.0",
      "MSXML2.XMLHTTP",
      "Microsoft.XMLHTTP",
    ]),
      (t.getResult = function (e) {
        return e && this._rawResponse ? this._rawResponse : this._response;
      }),
      (t.cancel = function () {
        (this.canceled = !0), this._clean(), this._request.abort();
      }),
      (t.load = function () {
        if (null == this._request) return void this._handleError();
        null != this._request.addEventListener
          ? (this._request.addEventListener(
              "loadstart",
              this._handleLoadStartProxy,
              !1
            ),
            this._request.addEventListener(
              "progress",
              this._handleProgressProxy,
              !1
            ),
            this._request.addEventListener("abort", this._handleAbortProxy, !1),
            this._request.addEventListener("error", this._handleErrorProxy, !1),
            this._request.addEventListener(
              "timeout",
              this._handleTimeoutProxy,
              !1
            ),
            this._request.addEventListener("load", this._handleLoadProxy, !1),
            this._request.addEventListener(
              "readystatechange",
              this._handleReadyStateChangeProxy,
              !1
            ))
          : ((this._request.onloadstart = this._handleLoadStartProxy),
            (this._request.onprogress = this._handleProgressProxy),
            (this._request.onabort = this._handleAbortProxy),
            (this._request.onerror = this._handleErrorProxy),
            (this._request.ontimeout = this._handleTimeoutProxy),
            (this._request.onload = this._handleLoadProxy),
            (this._request.onreadystatechange =
              this._handleReadyStateChangeProxy)),
          1 == this._xhrLevel &&
            (this._loadTimeout = setTimeout(
              createjs.proxy(this._handleTimeout, this),
              this._item.loadTimeout
            ));
        try {
          this._item.values && this._item.method != createjs.AbstractLoader.GET
            ? this._item.method == createjs.AbstractLoader.POST &&
              this._request.send(
                createjs.RequestUtils.formatQueryString(this._item.values)
              )
            : this._request.send();
        } catch (e) {
          this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, e));
        }
      }),
      (t.setResponseType = function (e) {
        "blob" === e &&
          ((e = window.URL ? "blob" : "arraybuffer"), (this._responseType = e)),
          (this._request.responseType = e);
      }),
      (t.getAllResponseHeaders = function () {
        return this._request.getAllResponseHeaders instanceof Function
          ? this._request.getAllResponseHeaders()
          : null;
      }),
      (t.getResponseHeader = function (e) {
        return this._request.getResponseHeader instanceof Function
          ? this._request.getResponseHeader(e)
          : null;
      }),
      (t._handleProgress = function (e) {
        if (e && !(e.loaded > 0 && 0 == e.total)) {
          var t = new createjs.ProgressEvent(e.loaded, e.total);
          this.dispatchEvent(t);
        }
      }),
      (t._handleLoadStart = function (e) {
        clearTimeout(this._loadTimeout), this.dispatchEvent("loadstart");
      }),
      (t._handleAbort = function (e) {
        this._clean(),
          this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, e));
      }),
      (t._handleError = function (e) {
        this._clean(), this.dispatchEvent(new createjs.ErrorEvent(e.message));
      }),
      (t._handleReadyStateChange = function (e) {
        4 == this._request.readyState && this._handleLoad();
      }),
      (t._handleLoad = function (e) {
        if (!this.loaded) {
          this.loaded = !0;
          var t = this._checkError();
          if (t) return void this._handleError(t);
          if (
            ((this._response = this._getResponse()),
            "arraybuffer" === this._responseType)
          )
            try {
              this._response = new Blob([this._response]);
            } catch (n) {
              if (
                ((window.BlobBuilder =
                  window.BlobBuilder ||
                  window.WebKitBlobBuilder ||
                  window.MozBlobBuilder ||
                  window.MSBlobBuilder),
                "TypeError" === n.name && window.BlobBuilder)
              ) {
                var r = new BlobBuilder();
                r.append(this._response), (this._response = r.getBlob());
              }
            }
          this._clean(), this.dispatchEvent(new createjs.Event("complete"));
        }
      }),
      (t._handleTimeout = function (e) {
        this._clean(),
          this.dispatchEvent(
            new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, e)
          );
      }),
      (t._checkError = function () {
        var e = parseInt(this._request.status);
        switch (e) {
          case 404:
          case 0:
            return new Error(e);
        }
        return null;
      }),
      (t._getResponse = function () {
        if (null != this._response) return this._response;
        if (null != this._request.response) return this._request.response;
        try {
          if (null != this._request.responseText)
            return this._request.responseText;
        } catch (e) {}
        try {
          if (null != this._request.responseXML)
            return this._request.responseXML;
        } catch (e) {}
        return null;
      }),
      (t._createXHR = function (e) {
        var t = createjs.RequestUtils.isCrossDomain(e),
          n = {},
          r = null;
        if (window.XMLHttpRequest)
          (r = new XMLHttpRequest()),
            t &&
              void 0 === r.withCredentials &&
              window.XDomainRequest &&
              (r = new XDomainRequest());
        else {
          for (var i = 0, o = s.ACTIVEX_VERSIONS.length; i < o; i++) {
            var a = s.ACTIVEX_VERSIONS[i];
            try {
              r = new ActiveXObject(a);
              break;
            } catch (u) {}
          }
          if (null == r) return !1;
        }
        null == e.mimeType &&
          createjs.RequestUtils.isText(e.type) &&
          (e.mimeType = "text/plain; charset=utf-8"),
          e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType),
          (this._xhrLevel = "string" == typeof r.responseType ? 2 : 1);
        var c = null;
        if (
          ((c =
            e.method == createjs.AbstractLoader.GET
              ? createjs.RequestUtils.buildPath(e.src, e.values)
              : e.src),
          r.open(e.method || createjs.AbstractLoader.GET, c, !0),
          t &&
            r instanceof XMLHttpRequest &&
            1 == this._xhrLevel &&
            (n.Origin = location.origin),
          e.values &&
            e.method == createjs.AbstractLoader.POST &&
            (n["Content-Type"] = "application/x-www-form-urlencoded"),
          t ||
            n["X-Requested-With"] ||
            (n["X-Requested-With"] = "XMLHttpRequest"),
          e.headers)
        )
          for (var l in e.headers) n[l] = e.headers[l];
        for (l in n) r.setRequestHeader(l, n[l]);
        return (
          r instanceof XMLHttpRequest &&
            void 0 !== e.withCredentials &&
            (r.withCredentials = e.withCredentials),
          (this._request = r),
          !0
        );
      }),
      (t._clean = function () {
        clearTimeout(this._loadTimeout),
          null != this._request.removeEventListener
            ? (this._request.removeEventListener(
                "loadstart",
                this._handleLoadStartProxy
              ),
              this._request.removeEventListener(
                "progress",
                this._handleProgressProxy
              ),
              this._request.removeEventListener(
                "abort",
                this._handleAbortProxy
              ),
              this._request.removeEventListener(
                "error",
                this._handleErrorProxy
              ),
              this._request.removeEventListener(
                "timeout",
                this._handleTimeoutProxy
              ),
              this._request.removeEventListener("load", this._handleLoadProxy),
              this._request.removeEventListener(
                "readystatechange",
                this._handleReadyStateChangeProxy
              ))
            : ((this._request.onloadstart = null),
              (this._request.onprogress = null),
              (this._request.onabort = null),
              (this._request.onerror = null),
              (this._request.ontimeout = null),
              (this._request.onload = null),
              (this._request.onreadystatechange = null));
      }),
      (t.toString = function () {
        return "[PreloadJS XHRRequest]";
      }),
      (createjs.XHRRequest = createjs.promote(e, "AbstractRequest"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t) {
      this.AbstractMediaLoader_constructor(e, t, createjs.AbstractLoader.SOUND),
        createjs.RequestUtils.isAudioTag(e)
          ? (this._tag = e)
          : createjs.RequestUtils.isAudioTag(e.src)
          ? (this._tag = e)
          : createjs.RequestUtils.isAudioTag(e.tag) &&
            (this._tag = createjs.RequestUtils.isAudioTag(e) ? e : e.src),
        null != this._tag && (this._preferXHR = !1);
    }
    var t = createjs.extend(e, createjs.AbstractMediaLoader),
      n = e;
    (n.canLoadItem = function (e) {
      return e.type == createjs.AbstractLoader.SOUND;
    }),
      (t._createTag = function (e) {
        var t = document.createElement("audio");
        return (t.autoplay = !1), (t.preload = "none"), (t.src = e), t;
      }),
      (createjs.SoundLoader = createjs.promote(e, "AbstractMediaLoader"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    var e = function () {
        (this.interrupt = null),
          (this.delay = null),
          (this.offset = null),
          (this.loop = null),
          (this.volume = null),
          (this.pan = null),
          (this.startTime = null),
          (this.duration = null);
      },
      t = (e.prototype = {}),
      n = e;
    (n.create = function (e) {
      if (e instanceof n || e instanceof Object) {
        var t = new createjs.PlayPropsConfig();
        return t.set(e), t;
      }
      throw new Error("Type not recognized.");
    }),
      (t.set = function (e) {
        for (var t in e) this[t] = e[t];
        return this;
      }),
      (t.toString = function () {
        return "[PlayPropsConfig]";
      }),
      (createjs.PlayPropsConfig = n);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      throw "Sound cannot be instantiated";
    }
    function t(e, t) {
      this.init(e, t);
    }
    var n = e;
    (n.INTERRUPT_ANY = "any"),
      (n.INTERRUPT_EARLY = "early"),
      (n.INTERRUPT_LATE = "late"),
      (n.INTERRUPT_NONE = "none"),
      (n.PLAY_INITED = "playInited"),
      (n.PLAY_SUCCEEDED = "playSucceeded"),
      (n.PLAY_INTERRUPTED = "playInterrupted"),
      (n.PLAY_FINISHED = "playFinished"),
      (n.PLAY_FAILED = "playFailed"),
      (n.SUPPORTED_EXTENSIONS = [
        "mp3",
        "ogg",
        "opus",
        "mpeg",
        "wav",
        "m4a",
        "mp4",
        "aiff",
        "wma",
        "mid",
      ]),
      (n.EXTENSION_MAP = { m4a: "mp4" }),
      (n.FILE_PATTERN =
        /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([\/.]*?(?:[^?]+)?\/)?((?:[^\/?]+)\.(\w+))(?:\?(\S+)?)?$/),
      (n.defaultInterruptBehavior = n.INTERRUPT_NONE),
      (n.alternateExtensions = []),
      (n.activePlugin = null),
      (n._masterVolume = 1),
      Object.defineProperty(n, "volume", {
        get: function () {
          return this._masterVolume;
        },
        set: function (e) {
          if (null == Number(e)) return !1;
          if (
            ((e = Math.max(0, Math.min(1, e))),
            (n._masterVolume = e),
            !this.activePlugin ||
              !this.activePlugin.setVolume ||
              !this.activePlugin.setVolume(e))
          )
            for (var t = this._instances, r = 0, i = t.length; r < i; r++)
              t[r].setMasterVolume(e);
        },
      }),
      (n._masterMute = !1),
      Object.defineProperty(n, "muted", {
        get: function () {
          return this._masterMute;
        },
        set: function (e) {
          if (null == e) return !1;
          if (
            ((this._masterMute = e),
            !this.activePlugin ||
              !this.activePlugin.setMute ||
              !this.activePlugin.setMute(e))
          )
            for (var t = this._instances, n = 0, r = t.length; n < r; n++)
              t[n].setMasterMute(e);
          return !0;
        },
      }),
      Object.defineProperty(n, "capabilities", {
        get: function () {
          return null == n.activePlugin ? null : n.activePlugin._capabilities;
        },
        set: function (e) {
          return !1;
        },
      }),
      (n._pluginsRegistered = !1),
      (n._lastID = 0),
      (n._instances = []),
      (n._idHash = {}),
      (n._preloadHash = {}),
      (n._defaultPlayPropsHash = {}),
      (n.addEventListener = null),
      (n.removeEventListener = null),
      (n.removeAllEventListeners = null),
      (n.dispatchEvent = null),
      (n.hasEventListener = null),
      (n._listeners = null),
      createjs.EventDispatcher.initialize(n),
      (n.getPreloadHandlers = function () {
        return {
          callback: createjs.proxy(n.initLoad, n),
          types: ["sound"],
          extensions: n.SUPPORTED_EXTENSIONS,
        };
      }),
      (n._handleLoadComplete = function (e) {
        var t = e.target.getItem().src;
        if (n._preloadHash[t])
          for (var r = 0, i = n._preloadHash[t].length; r < i; r++) {
            var s = n._preloadHash[t][r];
            if (((n._preloadHash[t][r] = !0), n.hasEventListener("fileload"))) {
              var e = new createjs.Event("fileload");
              (e.src = s.src),
                (e.id = s.id),
                (e.data = s.data),
                (e.sprite = s.sprite),
                n.dispatchEvent(e);
            }
          }
      }),
      (n._handleLoadError = function (e) {
        var t = e.target.getItem().src;
        if (n._preloadHash[t])
          for (var r = 0, i = n._preloadHash[t].length; r < i; r++) {
            var s = n._preloadHash[t][r];
            if (
              ((n._preloadHash[t][r] = !1), n.hasEventListener("fileerror"))
            ) {
              var e = new createjs.Event("fileerror");
              (e.src = s.src),
                (e.id = s.id),
                (e.data = s.data),
                (e.sprite = s.sprite),
                n.dispatchEvent(e);
            }
          }
      }),
      (n._registerPlugin = function (e) {
        return !!e.isSupported() && ((n.activePlugin = new e()), !0);
      }),
      (n.registerPlugins = function (e) {
        n._pluginsRegistered = !0;
        for (var t = 0, r = e.length; t < r; t++)
          if (n._registerPlugin(e[t])) return !0;
        return !1;
      }),
      (n.initializeDefaultPlugins = function () {
        return (
          null != n.activePlugin ||
          (!n._pluginsRegistered &&
            !!n.registerPlugins([
              createjs.WebAudioPlugin,
              createjs.HTMLAudioPlugin,
            ]))
        );
      }),
      (n.isReady = function () {
        return null != n.activePlugin;
      }),
      (n.getCapabilities = function () {
        return null == n.activePlugin ? null : n.activePlugin._capabilities;
      }),
      (n.getCapability = function (e) {
        return null == n.activePlugin ? null : n.activePlugin._capabilities[e];
      }),
      (n.initLoad = function (e) {
        return n._registerSound(e);
      }),
      (n._registerSound = function (e) {
        if (!n.initializeDefaultPlugins()) return !1;
        var r;
        if (
          (e.src instanceof Object
            ? ((r = n._parseSrc(e.src)), (r.src = e.path + r.src))
            : (r = n._parsePath(e.src)),
          null == r)
        )
          return !1;
        (e.src = r.src), (e.type = "sound");
        var i = e.data,
          s = null;
        if (
          null != i &&
          (isNaN(i.channels)
            ? isNaN(i) || (s = parseInt(i))
            : (s = parseInt(i.channels)),
          i.audioSprite)
        )
          for (var o, a = i.audioSprite.length; a--; )
            (o = i.audioSprite[a]),
              (n._idHash[o.id] = {
                src: e.src,
                startTime: parseInt(o.startTime),
                duration: parseInt(o.duration),
              }),
              o.defaultPlayProps &&
                (n._defaultPlayPropsHash[o.id] =
                  createjs.PlayPropsConfig.create(o.defaultPlayProps));
        null != e.id && (n._idHash[e.id] = { src: e.src });
        var u = n.activePlugin.register(e);
        return (
          t.create(e.src, s),
          null != i && isNaN(i)
            ? (e.data.channels = s || t.maxPerChannel())
            : (e.data = s || t.maxPerChannel()),
          u.type && (e.type = u.type),
          e.defaultPlayProps &&
            (n._defaultPlayPropsHash[e.src] = createjs.PlayPropsConfig.create(
              e.defaultPlayProps
            )),
          u
        );
      }),
      (n.registerSound = function (e, t, r, i, s) {
        var o = { src: e, id: t, data: r, defaultPlayProps: s };
        e instanceof Object && e.src && ((i = t), (o = e)),
          (o = createjs.LoadItem.create(o)),
          (o.path = i),
          null == i || o.src instanceof Object || (o.src = i + e);
        var a = n._registerSound(o);
        if (!a) return !1;
        if (
          (n._preloadHash[o.src] || (n._preloadHash[o.src] = []),
          n._preloadHash[o.src].push(o),
          1 == n._preloadHash[o.src].length)
        )
          a.on("complete", createjs.proxy(this._handleLoadComplete, this)),
            a.on("error", createjs.proxy(this._handleLoadError, this)),
            n.activePlugin.preload(a);
        else if (1 == n._preloadHash[o.src][0]) return !0;
        return o;
      }),
      (n.registerSounds = function (e, t) {
        var n = [];
        e.path && (t ? (t += e.path) : (t = e.path), (e = e.manifest));
        for (var r = 0, i = e.length; r < i; r++)
          n[r] = createjs.Sound.registerSound(
            e[r].src,
            e[r].id,
            e[r].data,
            t,
            e[r].defaultPlayProps
          );
        return n;
      }),
      (n.removeSound = function (e, r) {
        if (null == n.activePlugin) return !1;
        e instanceof Object && e.src && (e = e.src);
        var i;
        if (
          (e instanceof Object
            ? (i = n._parseSrc(e))
            : ((e = n._getSrcById(e).src), (i = n._parsePath(e))),
          null == i)
        )
          return !1;
        (e = i.src), null != r && (e = r + e);
        for (var s in n._idHash) n._idHash[s].src == e && delete n._idHash[s];
        return (
          t.removeSrc(e),
          delete n._preloadHash[e],
          n.activePlugin.removeSound(e),
          !0
        );
      }),
      (n.removeSounds = function (e, t) {
        var n = [];
        e.path && (t ? (t += e.path) : (t = e.path), (e = e.manifest));
        for (var r = 0, i = e.length; r < i; r++)
          n[r] = createjs.Sound.removeSound(e[r].src, t);
        return n;
      }),
      (n.removeAllSounds = function () {
        (n._idHash = {}),
          (n._preloadHash = {}),
          t.removeAll(),
          n.activePlugin && n.activePlugin.removeAllSounds();
      }),
      (n.loadComplete = function (e) {
        if (!n.isReady()) return !1;
        var t = n._parsePath(e);
        return (
          (e = t ? n._getSrcById(t.src).src : n._getSrcById(e).src),
          void 0 != n._preloadHash[e] && 1 == n._preloadHash[e][0]
        );
      }),
      (n._parsePath = function (e) {
        "string" != typeof e && (e = e.toString());
        var t = e.match(n.FILE_PATTERN);
        if (null == t) return !1;
        for (var r = t[4], i = t[5], s = n.capabilities, o = 0; !s[i]; )
          if (
            ((i = n.alternateExtensions[o++]), o > n.alternateExtensions.length)
          )
            return null;
        e = e.replace("." + t[5], "." + i);
        var a = { name: r, src: e, extension: i };
        return a;
      }),
      (n._parseSrc = function (e) {
        var t = { name: void 0, src: void 0, extension: void 0 },
          r = n.capabilities;
        for (var i in e)
          if (e.hasOwnProperty(i) && r[i]) {
            (t.src = e[i]), (t.extension = i);
            break;
          }
        if (!t.src) return !1;
        var s = t.src.lastIndexOf("/");
        return s != -1 ? (t.name = t.src.slice(s + 1)) : (t.name = t.src), t;
      }),
      (n.play = function (e, t, r, i, s, o, a, u, c) {
        var l;
        l =
          t instanceof Object || t instanceof createjs.PlayPropsConfig
            ? createjs.PlayPropsConfig.create(t)
            : createjs.PlayPropsConfig.create({
                interrupt: t,
                delay: r,
                offset: i,
                loop: s,
                volume: o,
                pan: a,
                startTime: u,
                duration: c,
              });
        var d = n.createInstance(e, l.startTime, l.duration),
          h = n._playInstance(d, l);
        return h || d._playFailed(), d;
      }),
      (n.createInstance = function (e, r, i) {
        if (!n.initializeDefaultPlugins())
          return new createjs.DefaultSoundInstance(e, r, i);
        var s = n._defaultPlayPropsHash[e];
        e = n._getSrcById(e);
        var o = n._parsePath(e.src),
          a = null;
        return (
          null != o && null != o.src
            ? (t.create(o.src),
              null == r && (r = e.startTime),
              (a = n.activePlugin.create(o.src, r, i || e.duration)),
              (s = s || n._defaultPlayPropsHash[o.src]),
              s && a.applyPlayProps(s))
            : (a = new createjs.DefaultSoundInstance(e, r, i)),
          (a.uniqueId = n._lastID++),
          a
        );
      }),
      (n.stop = function () {
        for (var e = this._instances, t = e.length; t--; ) e[t].stop();
      }),
      (n.setVolume = function (e) {
        if (null == Number(e)) return !1;
        if (
          ((e = Math.max(0, Math.min(1, e))),
          (n._masterVolume = e),
          !this.activePlugin ||
            !this.activePlugin.setVolume ||
            !this.activePlugin.setVolume(e))
        )
          for (var t = this._instances, r = 0, i = t.length; r < i; r++)
            t[r].setMasterVolume(e);
      }),
      (n.getVolume = function () {
        return this._masterVolume;
      }),
      (n.setMute = function (e) {
        if (null == e) return !1;
        if (
          ((this._masterMute = e),
          !this.activePlugin ||
            !this.activePlugin.setMute ||
            !this.activePlugin.setMute(e))
        )
          for (var t = this._instances, n = 0, r = t.length; n < r; n++)
            t[n].setMasterMute(e);
        return !0;
      }),
      (n.getMute = function () {
        return this._masterMute;
      }),
      (n.setDefaultPlayProps = function (e, t) {
        (e = n._getSrcById(e)),
          (n._defaultPlayPropsHash[n._parsePath(e.src).src] =
            createjs.PlayPropsConfig.create(t));
      }),
      (n.getDefaultPlayProps = function (e) {
        return (
          (e = n._getSrcById(e)),
          n._defaultPlayPropsHash[n._parsePath(e.src).src]
        );
      }),
      (n._playInstance = function (e, t) {
        var r = n._defaultPlayPropsHash[e.src] || {};
        if (
          (null == t.interrupt &&
            (t.interrupt = r.interrupt || n.defaultInterruptBehavior),
          null == t.delay && (t.delay = r.delay || 0),
          null == t.offset && (t.offset = e.getPosition()),
          null == t.loop && (t.loop = e.loop),
          null == t.volume && (t.volume = e.volume),
          null == t.pan && (t.pan = e.pan),
          0 == t.delay)
        ) {
          var i = n._beginPlaying(e, t);
          if (!i) return !1;
        } else {
          var s = setTimeout(function () {
            n._beginPlaying(e, t);
          }, t.delay);
          e.delayTimeoutId = s;
        }
        return this._instances.push(e), !0;
      }),
      (n._beginPlaying = function (e, n) {
        if (!t.add(e, n.interrupt)) return !1;
        var r = e._beginPlaying(n);
        if (!r) {
          var i = createjs.indexOf(this._instances, e);
          return i > -1 && this._instances.splice(i, 1), !1;
        }
        return !0;
      }),
      (n._getSrcById = function (e) {
        return n._idHash[e] || { src: e };
      }),
      (n._playFinished = function (e) {
        t.remove(e);
        var n = createjs.indexOf(this._instances, e);
        n > -1 && this._instances.splice(n, 1);
      }),
      (createjs.Sound = e),
      (t.channels = {}),
      (t.create = function (e, n) {
        var r = t.get(e);
        return null == r && ((t.channels[e] = new t(e, n)), !0);
      }),
      (t.removeSrc = function (e) {
        var n = t.get(e);
        return null != n && (n._removeAll(), delete t.channels[e], !0);
      }),
      (t.removeAll = function () {
        for (var e in t.channels) t.channels[e]._removeAll();
        t.channels = {};
      }),
      (t.add = function (e, n) {
        var r = t.get(e.src);
        return null != r && r._add(e, n);
      }),
      (t.remove = function (e) {
        var n = t.get(e.src);
        return null != n && (n._remove(e), !0);
      }),
      (t.maxPerChannel = function () {
        return r.maxDefault;
      }),
      (t.get = function (e) {
        return t.channels[e];
      });
    var r = t.prototype;
    (r.constructor = t),
      (r.src = null),
      (r.max = null),
      (r.maxDefault = 100),
      (r.length = 0),
      (r.init = function (e, t) {
        (this.src = e),
          (this.max = t || this.maxDefault),
          this.max == -1 && (this.max = this.maxDefault),
          (this._instances = []);
      }),
      (r._get = function (e) {
        return this._instances[e];
      }),
      (r._add = function (e, t) {
        return (
          !!this._getSlot(t, e) && (this._instances.push(e), this.length++, !0)
        );
      }),
      (r._remove = function (e) {
        var t = createjs.indexOf(this._instances, e);
        return t != -1 && (this._instances.splice(t, 1), this.length--, !0);
      }),
      (r._removeAll = function () {
        for (var e = this.length - 1; e >= 0; e--) this._instances[e].stop();
      }),
      (r._getSlot = function (t, n) {
        var r, i;
        if (t != e.INTERRUPT_NONE && ((i = this._get(0)), null == i)) return !0;
        for (var s = 0, o = this.max; s < o; s++) {
          if (((r = this._get(s)), null == r)) return !0;
          if (
            r.playState == e.PLAY_FINISHED ||
            r.playState == e.PLAY_INTERRUPTED ||
            r.playState == e.PLAY_FAILED
          ) {
            i = r;
            break;
          }
          t != e.INTERRUPT_NONE &&
            ((t == e.INTERRUPT_EARLY && r.getPosition() < i.getPosition()) ||
              (t == e.INTERRUPT_LATE && r.getPosition() > i.getPosition())) &&
            (i = r);
        }
        return null != i && (i._interrupt(), this._remove(i), !0);
      }),
      (r.toString = function () {
        return "[Sound SoundChannel]";
      });
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    var e = function (e, t, n, r) {
        this.EventDispatcher_constructor(),
          (this.src = e),
          (this.uniqueId = -1),
          (this.playState = null),
          (this.delayTimeoutId = null),
          (this._volume = 1),
          Object.defineProperty(this, "volume", {
            get: this.getVolume,
            set: this.setVolume,
          }),
          (this._pan = 0),
          Object.defineProperty(this, "pan", {
            get: this.getPan,
            set: this.setPan,
          }),
          (this._startTime = Math.max(0, t || 0)),
          Object.defineProperty(this, "startTime", {
            get: this.getStartTime,
            set: this.setStartTime,
          }),
          (this._duration = Math.max(0, n || 0)),
          Object.defineProperty(this, "duration", {
            get: this.getDuration,
            set: this.setDuration,
          }),
          (this._playbackResource = null),
          Object.defineProperty(this, "playbackResource", {
            get: this.getPlaybackResource,
            set: this.setPlaybackResource,
          }),
          r !== !1 && r !== !0 && this.setPlaybackResource(r),
          (this._position = 0),
          Object.defineProperty(this, "position", {
            get: this.getPosition,
            set: this.setPosition,
          }),
          (this._loop = 0),
          Object.defineProperty(this, "loop", {
            get: this.getLoop,
            set: this.setLoop,
          }),
          (this._muted = !1),
          Object.defineProperty(this, "muted", {
            get: this.getMuted,
            set: this.setMuted,
          }),
          (this._paused = !1),
          Object.defineProperty(this, "paused", {
            get: this.getPaused,
            set: this.setPaused,
          });
      },
      t = createjs.extend(e, createjs.EventDispatcher);
    (t.play = function (e, t, n, r, i, s) {
      var o;
      return (
        (o =
          e instanceof Object || e instanceof createjs.PlayPropsConfig
            ? createjs.PlayPropsConfig.create(e)
            : createjs.PlayPropsConfig.create({
                interrupt: e,
                delay: t,
                offset: n,
                loop: r,
                volume: i,
                pan: s,
              })),
        this.playState == createjs.Sound.PLAY_SUCCEEDED
          ? (this.applyPlayProps(o), void (this._paused && this.setPaused(!1)))
          : (this._cleanUp(), createjs.Sound._playInstance(this, o), this)
      );
    }),
      (t.stop = function () {
        return (
          (this._position = 0),
          (this._paused = !1),
          this._handleStop(),
          this._cleanUp(),
          (this.playState = createjs.Sound.PLAY_FINISHED),
          this
        );
      }),
      (t.destroy = function () {
        this._cleanUp(),
          (this.src = null),
          (this.playbackResource = null),
          this.removeAllEventListeners();
      }),
      (t.applyPlayProps = function (e) {
        return (
          null != e.offset && this.setPosition(e.offset),
          null != e.loop && this.setLoop(e.loop),
          null != e.volume && this.setVolume(e.volume),
          null != e.pan && this.setPan(e.pan),
          null != e.startTime &&
            (this.setStartTime(e.startTime), this.setDuration(e.duration)),
          this
        );
      }),
      (t.toString = function () {
        return "[AbstractSoundInstance]";
      }),
      (t.getPaused = function () {
        return this._paused;
      }),
      (t.setPaused = function (e) {
        if (
          !(
            (e !== !0 && e !== !1) ||
            this._paused == e ||
            (1 == e && this.playState != createjs.Sound.PLAY_SUCCEEDED)
          )
        )
          return (
            (this._paused = e),
            e ? this._pause() : this._resume(),
            clearTimeout(this.delayTimeoutId),
            this
          );
      }),
      (t.setVolume = function (e) {
        return e == this._volume
          ? this
          : ((this._volume = Math.max(0, Math.min(1, e))),
            this._muted || this._updateVolume(),
            this);
      }),
      (t.getVolume = function () {
        return this._volume;
      }),
      (t.setMuted = function (e) {
        if (e === !0 || e === !1)
          return (this._muted = e), this._updateVolume(), this;
      }),
      (t.getMuted = function () {
        return this._muted;
      }),
      (t.setPan = function (e) {
        return e == this._pan
          ? this
          : ((this._pan = Math.max(-1, Math.min(1, e))),
            this._updatePan(),
            this);
      }),
      (t.getPan = function () {
        return this._pan;
      }),
      (t.getPosition = function () {
        return (
          this._paused ||
            this.playState != createjs.Sound.PLAY_SUCCEEDED ||
            (this._position = this._calculateCurrentPosition()),
          this._position
        );
      }),
      (t.setPosition = function (e) {
        return (
          (this._position = Math.max(0, e)),
          this.playState == createjs.Sound.PLAY_SUCCEEDED &&
            this._updatePosition(),
          this
        );
      }),
      (t.getStartTime = function () {
        return this._startTime;
      }),
      (t.setStartTime = function (e) {
        return e == this._startTime
          ? this
          : ((this._startTime = Math.max(0, e || 0)),
            this._updateStartTime(),
            this);
      }),
      (t.getDuration = function () {
        return this._duration;
      }),
      (t.setDuration = function (e) {
        return e == this._duration
          ? this
          : ((this._duration = Math.max(0, e || 0)),
            this._updateDuration(),
            this);
      }),
      (t.setPlaybackResource = function (e) {
        return (
          (this._playbackResource = e),
          0 == this._duration && this._setDurationFromSource(),
          this
        );
      }),
      (t.getPlaybackResource = function () {
        return this._playbackResource;
      }),
      (t.getLoop = function () {
        return this._loop;
      }),
      (t.setLoop = function (e) {
        null != this._playbackResource &&
          (0 != this._loop && 0 == e
            ? this._removeLooping(e)
            : 0 == this._loop && 0 != e && this._addLooping(e)),
          (this._loop = e);
      }),
      (t._sendEvent = function (e) {
        var t = new createjs.Event(e);
        this.dispatchEvent(t);
      }),
      (t._cleanUp = function () {
        clearTimeout(this.delayTimeoutId),
          this._handleCleanUp(),
          (this._paused = !1),
          createjs.Sound._playFinished(this);
      }),
      (t._interrupt = function () {
        this._cleanUp(),
          (this.playState = createjs.Sound.PLAY_INTERRUPTED),
          this._sendEvent("interrupted");
      }),
      (t._beginPlaying = function (e) {
        return (
          this.setPosition(e.offset),
          this.setLoop(e.loop),
          this.setVolume(e.volume),
          this.setPan(e.pan),
          null != e.startTime &&
            (this.setStartTime(e.startTime), this.setDuration(e.duration)),
          null != this._playbackResource && this._position < this._duration
            ? ((this._paused = !1),
              this._handleSoundReady(),
              (this.playState = createjs.Sound.PLAY_SUCCEEDED),
              this._sendEvent("succeeded"),
              !0)
            : (this._playFailed(), !1)
        );
      }),
      (t._playFailed = function () {
        this._cleanUp(),
          (this.playState = createjs.Sound.PLAY_FAILED),
          this._sendEvent("failed");
      }),
      (t._handleSoundComplete = function (e) {
        return (
          (this._position = 0),
          0 != this._loop
            ? (this._loop--, this._handleLoop(), void this._sendEvent("loop"))
            : (this._cleanUp(),
              (this.playState = createjs.Sound.PLAY_FINISHED),
              void this._sendEvent("complete"))
        );
      }),
      (t._handleSoundReady = function () {}),
      (t._updateVolume = function () {}),
      (t._updatePan = function () {}),
      (t._updateStartTime = function () {}),
      (t._updateDuration = function () {}),
      (t._setDurationFromSource = function () {}),
      (t._calculateCurrentPosition = function () {}),
      (t._updatePosition = function () {}),
      (t._removeLooping = function (e) {}),
      (t._addLooping = function (e) {}),
      (t._pause = function () {}),
      (t._resume = function () {}),
      (t._handleStop = function () {}),
      (t._handleCleanUp = function () {}),
      (t._handleLoop = function () {}),
      (createjs.AbstractSoundInstance = createjs.promote(e, "EventDispatcher")),
      (createjs.DefaultSoundInstance = createjs.AbstractSoundInstance);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    var e = function () {
        (this._capabilities = null),
          (this._loaders = {}),
          (this._audioSources = {}),
          (this._soundInstances = {}),
          (this._volume = 1),
          this._loaderClass,
          this._soundInstanceClass;
      },
      t = e.prototype;
    (e._capabilities = null),
      (e.isSupported = function () {
        return !0;
      }),
      (t.register = function (e) {
        var t = this._loaders[e.src];
        return t && !t.canceled
          ? this._loaders[e.src]
          : ((this._audioSources[e.src] = !0),
            (this._soundInstances[e.src] = []),
            (t = new this._loaderClass(e)),
            t.on("complete", this._handlePreloadComplete, this),
            (this._loaders[e.src] = t),
            t);
      }),
      (t.preload = function (e) {
        e.on("error", this._handlePreloadError, this), e.load();
      }),
      (t.isPreloadStarted = function (e) {
        return null != this._audioSources[e];
      }),
      (t.isPreloadComplete = function (e) {
        return !(null == this._audioSources[e] || 1 == this._audioSources[e]);
      }),
      (t.removeSound = function (e) {
        if (this._soundInstances[e]) {
          for (var t = this._soundInstances[e].length; t--; ) {
            var n = this._soundInstances[e][t];
            n.destroy();
          }
          delete this._soundInstances[e],
            delete this._audioSources[e],
            this._loaders[e] && this._loaders[e].destroy(),
            delete this._loaders[e];
        }
      }),
      (t.removeAllSounds = function () {
        for (var e in this._audioSources) this.removeSound(e);
      }),
      (t.create = function (e, t, n) {
        this.isPreloadStarted(e) || this.preload(this.register(e));
        var r = new this._soundInstanceClass(e, t, n, this._audioSources[e]);
        return this._soundInstances[e].push(r), r;
      }),
      (t.setVolume = function (e) {
        return (this._volume = e), this._updateVolume(), !0;
      }),
      (t.getVolume = function () {
        return this._volume;
      }),
      (t.setMute = function (e) {
        return this._updateVolume(), !0;
      }),
      (t.toString = function () {
        return "[AbstractPlugin]";
      }),
      (t._handlePreloadComplete = function (e) {
        var t = e.target.getItem().src;
        this._audioSources[t] = e.result;
        for (var n = 0, r = this._soundInstances[t].length; n < r; n++) {
          var i = this._soundInstances[t][n];
          i.setPlaybackResource(this._audioSources[t]);
        }
      }),
      (t._handlePreloadError = function (e) {}),
      (t._updateVolume = function () {}),
      (createjs.AbstractPlugin = e);
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e) {
      this.AbstractLoader_constructor(e, !0, createjs.AbstractLoader.SOUND);
    }
    var t = createjs.extend(e, createjs.AbstractLoader);
    (e.context = null),
      (t.toString = function () {
        return "[WebAudioLoader]";
      }),
      (t._createRequest = function () {
        (this._request = new createjs.XHRRequest(this._item, !1)),
          this._request.setResponseType("arraybuffer");
      }),
      (t._sendComplete = function (t) {
        e.context.decodeAudioData(
          this._rawResult,
          createjs.proxy(this._handleAudioDecoded, this),
          createjs.proxy(this._sendError, this)
        );
      }),
      (t._handleAudioDecoded = function (e) {
        (this._result = e), this.AbstractLoader__sendComplete();
      }),
      (createjs.WebAudioLoader = createjs.promote(e, "AbstractLoader"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, r, i) {
      this.AbstractSoundInstance_constructor(e, t, r, i),
        (this.gainNode = n.context.createGain()),
        (this.panNode = n.context.createPanner()),
        (this.panNode.panningModel = n._panningModel),
        this.panNode.connect(this.gainNode),
        this._updatePan(),
        (this.sourceNode = null),
        (this._soundCompleteTimeout = null),
        (this._sourceNodeNext = null),
        (this._playbackStartTime = 0),
        (this._endedHandler = createjs.proxy(this._handleSoundComplete, this));
    }
    var t = createjs.extend(e, createjs.AbstractSoundInstance),
      n = e;
    (n.context = null),
      (n._scratchBuffer = null),
      (n.destinationNode = null),
      (n._panningModel = "equalpower"),
      (t.destroy = function () {
        this.AbstractSoundInstance_destroy(),
          this.panNode.disconnect(0),
          (this.panNode = null),
          this.gainNode.disconnect(0),
          (this.gainNode = null);
      }),
      (t.toString = function () {
        return "[WebAudioSoundInstance]";
      }),
      (t._updatePan = function () {
        this.panNode.setPosition(this._pan, 0, -0.5);
      }),
      (t._removeLooping = function (e) {
        this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
      }),
      (t._addLooping = function (e) {
        this.playState == createjs.Sound.PLAY_SUCCEEDED &&
          (this._sourceNodeNext = this._createAndPlayAudioNode(
            this._playbackStartTime,
            0
          ));
      }),
      (t._setDurationFromSource = function () {
        this._duration = 1e3 * this.playbackResource.duration;
      }),
      (t._handleCleanUp = function () {
        this.sourceNode &&
          this.playState == createjs.Sound.PLAY_SUCCEEDED &&
          ((this.sourceNode = this._cleanUpAudioNode(this.sourceNode)),
          (this._sourceNodeNext = this._cleanUpAudioNode(
            this._sourceNodeNext
          ))),
          0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0),
          clearTimeout(this._soundCompleteTimeout),
          (this._playbackStartTime = 0);
      }),
      (t._cleanUpAudioNode = function (e) {
        if (e) {
          e.stop(0), e.disconnect(0);
          try {
            e.buffer = n._scratchBuffer;
          } catch (t) {}
          e = null;
        }
        return e;
      }),
      (t._handleSoundReady = function (e) {
        this.gainNode.connect(n.destinationNode);
        var t = 0.001 * this._duration,
          r = 0.001 * this._position;
        r > t && (r = t),
          (this.sourceNode = this._createAndPlayAudioNode(
            n.context.currentTime - t,
            r
          )),
          (this._playbackStartTime = this.sourceNode.startTime - r),
          (this._soundCompleteTimeout = setTimeout(
            this._endedHandler,
            1e3 * (t - r)
          )),
          0 != this._loop &&
            (this._sourceNodeNext = this._createAndPlayAudioNode(
              this._playbackStartTime,
              0
            ));
      }),
      (t._createAndPlayAudioNode = function (e, t) {
        var r = n.context.createBufferSource();
        (r.buffer = this.playbackResource), r.connect(this.panNode);
        var i = 0.001 * this._duration;
        return (
          (r.startTime = e + i),
          r.start(r.startTime, t + 0.001 * this._startTime, i - t),
          r
        );
      }),
      (t._pause = function () {
        (this._position =
          1e3 * (n.context.currentTime - this._playbackStartTime)),
          (this.sourceNode = this._cleanUpAudioNode(this.sourceNode)),
          (this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)),
          0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0),
          clearTimeout(this._soundCompleteTimeout);
      }),
      (t._resume = function () {
        this._handleSoundReady();
      }),
      (t._updateVolume = function () {
        var e = this._muted ? 0 : this._volume;
        e != this.gainNode.gain.value && (this.gainNode.gain.value = e);
      }),
      (t._calculateCurrentPosition = function () {
        return 1e3 * (n.context.currentTime - this._playbackStartTime);
      }),
      (t._updatePosition = function () {
        (this.sourceNode = this._cleanUpAudioNode(this.sourceNode)),
          (this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)),
          clearTimeout(this._soundCompleteTimeout),
          this._paused || this._handleSoundReady();
      }),
      (t._handleLoop = function () {
        this._cleanUpAudioNode(this.sourceNode),
          (this.sourceNode = this._sourceNodeNext),
          (this._playbackStartTime = this.sourceNode.startTime),
          (this._sourceNodeNext = this._createAndPlayAudioNode(
            this._playbackStartTime,
            0
          )),
          (this._soundCompleteTimeout = setTimeout(
            this._endedHandler,
            this._duration
          ));
      }),
      (t._updateDuration = function () {
        this.playState == createjs.Sound.PLAY_SUCCEEDED &&
          (this._pause(), this._resume());
      }),
      (createjs.WebAudioSoundInstance = createjs.promote(
        e,
        "AbstractSoundInstance"
      ));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      this.AbstractPlugin_constructor(),
        (this._panningModel = n._panningModel),
        (this.context = n.context),
        (this.dynamicsCompressorNode = this.context.createDynamicsCompressor()),
        this.dynamicsCompressorNode.connect(this.context.destination),
        (this.gainNode = this.context.createGain()),
        this.gainNode.connect(this.dynamicsCompressorNode),
        (createjs.WebAudioSoundInstance.destinationNode = this.gainNode),
        (this._capabilities = n._capabilities),
        (this._loaderClass = createjs.WebAudioLoader),
        (this._soundInstanceClass = createjs.WebAudioSoundInstance),
        this._addPropsToClasses();
    }
    var t = createjs.extend(e, createjs.AbstractPlugin),
      n = e;
    (n._capabilities = null),
      (n._panningModel = "equalpower"),
      (n.context = null),
      (n._scratchBuffer = null),
      (n._unlocked = !1),
      (n.isSupported = function () {
        var e =
          createjs.BrowserDetect.isIOS ||
          createjs.BrowserDetect.isAndroid ||
          createjs.BrowserDetect.isBlackberry;
        return (
          !(
            "file:" == location.protocol &&
            !e &&
            !this._isFileXHRSupported()
          ) && (n._generateCapabilities(), null != n.context)
        );
      }),
      (n.playEmptySound = function () {
        if (null != n.context) {
          var e = n.context.createBufferSource();
          (e.buffer = n._scratchBuffer),
            e.connect(n.context.destination),
            e.start(0, 0, 0);
        }
      }),
      (n._isFileXHRSupported = function () {
        var e = !0,
          t = new XMLHttpRequest();
        try {
          t.open("GET", "WebAudioPluginTest.fail", !1);
        } catch (n) {
          return (e = !1);
        }
        (t.onerror = function () {
          e = !1;
        }),
          (t.onload = function () {
            e =
              404 == this.status ||
              200 == this.status ||
              (0 == this.status && "" != this.response);
          });
        try {
          t.send();
        } catch (n) {
          e = !1;
        }
        return e;
      }),
      (n._generateCapabilities = function () {
        if (null == n._capabilities) {
          var e = document.createElement("audio");
          if (null == e.canPlayType) return null;
          if (null == n.context)
            if (window.AudioContext) n.context = new AudioContext();
            else {
              if (!window.webkitAudioContext) return null;
              n.context = new webkitAudioContext();
            }
          null == n._scratchBuffer &&
            (n._scratchBuffer = n.context.createBuffer(1, 1, 22050)),
            n._compatibilitySetUp(),
            "ontouchstart" in window &&
              "running" != n.context.state &&
              (n._unlock(),
              document.addEventListener("mousedown", n._unlock, !0),
              document.addEventListener("touchend", n._unlock, !0)),
            (n._capabilities = { panning: !0, volume: !0, tracks: -1 });
          for (
            var t = createjs.Sound.SUPPORTED_EXTENSIONS,
              r = createjs.Sound.EXTENSION_MAP,
              i = 0,
              s = t.length;
            i < s;
            i++
          ) {
            var o = t[i],
              a = r[o] || o;
            n._capabilities[o] =
              ("no" != e.canPlayType("audio/" + o) &&
                "" != e.canPlayType("audio/" + o)) ||
              ("no" != e.canPlayType("audio/" + a) &&
                "" != e.canPlayType("audio/" + a));
          }
          n.context.destination.numberOfChannels < 2 &&
            (n._capabilities.panning = !1);
        }
      }),
      (n._compatibilitySetUp = function () {
        if (((n._panningModel = "equalpower"), !n.context.createGain)) {
          n.context.createGain = n.context.createGainNode;
          var e = n.context.createBufferSource();
          (e.__proto__.start = e.__proto__.noteGrainOn),
            (e.__proto__.stop = e.__proto__.noteOff),
            (n._panningModel = 0);
        }
      }),
      (n._unlock = function () {
        n._unlocked ||
          (n.playEmptySound(),
          "running" == n.context.state &&
            (document.removeEventListener("mousedown", n._unlock, !0),
            document.removeEventListener("touchend", n._unlock, !0),
            (n._unlocked = !0)));
      }),
      (t.toString = function () {
        return "[WebAudioPlugin]";
      }),
      (t._addPropsToClasses = function () {
        var e = this._soundInstanceClass;
        (e.context = this.context),
          (e._scratchBuffer = n._scratchBuffer),
          (e.destinationNode = this.gainNode),
          (e._panningModel = this._panningModel),
          (this._loaderClass.context = this.context);
      }),
      (t._updateVolume = function () {
        var e = createjs.Sound._masterMute ? 0 : this._volume;
        e != this.gainNode.gain.value && (this.gainNode.gain.value = e);
      }),
      (createjs.WebAudioPlugin = createjs.promote(e, "AbstractPlugin"));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      throw "HTMLAudioTagPool cannot be instantiated";
    }
    function t(e) {
      this._tags = [];
    }
    var n = e;
    (n._tags = {}),
      (n._tagPool = new t()),
      (n._tagUsed = {}),
      (n.get = function (e) {
        var t = n._tags[e];
        return (
          null == t
            ? ((t = n._tags[e] = n._tagPool.get()), (t.src = e))
            : n._tagUsed[e]
            ? ((t = n._tagPool.get()), (t.src = e))
            : (n._tagUsed[e] = !0),
          t
        );
      }),
      (n.set = function (e, t) {
        t == n._tags[e] ? (n._tagUsed[e] = !1) : n._tagPool.set(t);
      }),
      (n.remove = function (e) {
        var t = n._tags[e];
        return (
          null != t &&
          (n._tagPool.set(t), delete n._tags[e], delete n._tagUsed[e], !0)
        );
      }),
      (n.getDuration = function (e) {
        var t = n._tags[e];
        return null != t && t.duration ? 1e3 * t.duration : 0;
      }),
      (createjs.HTMLAudioTagPool = e);
    var r = t.prototype;
    (r.constructor = t),
      (r.get = function () {
        var e;
        return (
          (e = 0 == this._tags.length ? this._createTag() : this._tags.pop()),
          null == e.parentNode && document.body.appendChild(e),
          e
        );
      }),
      (r.set = function (e) {
        var t = createjs.indexOf(this._tags, e);
        t == -1 && ((this._tags.src = null), this._tags.push(e));
      }),
      (r.toString = function () {
        return "[TagPool]";
      }),
      (r._createTag = function () {
        var e = document.createElement("audio");
        return (e.autoplay = !1), (e.preload = "none"), e;
      });
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e(e, t, n, r) {
      this.AbstractSoundInstance_constructor(e, t, n, r),
        (this._audioSpriteStopTime = null),
        (this._delayTimeoutId = null),
        (this._endedHandler = createjs.proxy(this._handleSoundComplete, this)),
        (this._readyHandler = createjs.proxy(this._handleTagReady, this)),
        (this._stalledHandler = createjs.proxy(this._playFailed, this)),
        (this._audioSpriteEndHandler = createjs.proxy(
          this._handleAudioSpriteLoop,
          this
        )),
        (this._loopHandler = createjs.proxy(this._handleSoundComplete, this)),
        n
          ? (this._audioSpriteStopTime = 0.001 * (t + n))
          : (this._duration = createjs.HTMLAudioTagPool.getDuration(this.src));
    }
    var t = createjs.extend(e, createjs.AbstractSoundInstance);
    (t.setMasterVolume = function (e) {
      this._updateVolume();
    }),
      (t.setMasterMute = function (e) {
        this._updateVolume();
      }),
      (t.toString = function () {
        return "[HTMLAudioSoundInstance]";
      }),
      (t._removeLooping = function () {
        null != this._playbackResource &&
          ((this._playbackResource.loop = !1),
          this._playbackResource.removeEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._loopHandler,
            !1
          ));
      }),
      (t._addLooping = function () {
        null == this._playbackResource ||
          this._audioSpriteStopTime ||
          (this._playbackResource.addEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._loopHandler,
            !1
          ),
          (this._playbackResource.loop = !0));
      }),
      (t._handleCleanUp = function () {
        var e = this._playbackResource;
        if (null != e) {
          e.pause(),
            (e.loop = !1),
            e.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_ENDED,
              this._endedHandler,
              !1
            ),
            e.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_READY,
              this._readyHandler,
              !1
            ),
            e.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_STALLED,
              this._stalledHandler,
              !1
            ),
            e.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_SEEKED,
              this._loopHandler,
              !1
            ),
            e.removeEventListener(
              createjs.HTMLAudioPlugin._TIME_UPDATE,
              this._audioSpriteEndHandler,
              !1
            );
          try {
            e.currentTime = this._startTime;
          } catch (t) {}
          createjs.HTMLAudioTagPool.set(this.src, e),
            (this._playbackResource = null);
        }
      }),
      (t._beginPlaying = function (e) {
        return (
          (this._playbackResource = createjs.HTMLAudioTagPool.get(this.src)),
          this.AbstractSoundInstance__beginPlaying(e)
        );
      }),
      (t._handleSoundReady = function (e) {
        if (4 !== this._playbackResource.readyState) {
          var t = this._playbackResource;
          return (
            t.addEventListener(
              createjs.HTMLAudioPlugin._AUDIO_READY,
              this._readyHandler,
              !1
            ),
            t.addEventListener(
              createjs.HTMLAudioPlugin._AUDIO_STALLED,
              this._stalledHandler,
              !1
            ),
            (t.preload = "auto"),
            void t.load()
          );
        }
        this._updateVolume(),
          (this._playbackResource.currentTime =
            0.001 * (this._startTime + this._position)),
          this._audioSpriteStopTime
            ? this._playbackResource.addEventListener(
                createjs.HTMLAudioPlugin._TIME_UPDATE,
                this._audioSpriteEndHandler,
                !1
              )
            : (this._playbackResource.addEventListener(
                createjs.HTMLAudioPlugin._AUDIO_ENDED,
                this._endedHandler,
                !1
              ),
              0 != this._loop &&
                (this._playbackResource.addEventListener(
                  createjs.HTMLAudioPlugin._AUDIO_SEEKED,
                  this._loopHandler,
                  !1
                ),
                (this._playbackResource.loop = !0))),
          this._playbackResource.play();
      }),
      (t._handleTagReady = function (e) {
        this._playbackResource.removeEventListener(
          createjs.HTMLAudioPlugin._AUDIO_READY,
          this._readyHandler,
          !1
        ),
          this._playbackResource.removeEventListener(
            createjs.HTMLAudioPlugin._AUDIO_STALLED,
            this._stalledHandler,
            !1
          ),
          this._handleSoundReady();
      }),
      (t._pause = function () {
        this._playbackResource.pause();
      }),
      (t._resume = function () {
        this._playbackResource.play();
      }),
      (t._updateVolume = function () {
        if (null != this._playbackResource) {
          var e =
            this._muted || createjs.Sound._masterMute
              ? 0
              : this._volume * createjs.Sound._masterVolume;
          e != this._playbackResource.volume &&
            (this._playbackResource.volume = e);
        }
      }),
      (t._calculateCurrentPosition = function () {
        return 1e3 * this._playbackResource.currentTime - this._startTime;
      }),
      (t._updatePosition = function () {
        this._playbackResource.removeEventListener(
          createjs.HTMLAudioPlugin._AUDIO_SEEKED,
          this._loopHandler,
          !1
        ),
          this._playbackResource.addEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._handleSetPositionSeek,
            !1
          );
        try {
          this._playbackResource.currentTime =
            0.001 * (this._position + this._startTime);
        } catch (e) {
          this._handleSetPositionSeek(null);
        }
      }),
      (t._handleSetPositionSeek = function (e) {
        null != this._playbackResource &&
          (this._playbackResource.removeEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._handleSetPositionSeek,
            !1
          ),
          this._playbackResource.addEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._loopHandler,
            !1
          ));
      }),
      (t._handleAudioSpriteLoop = function (e) {
        this._playbackResource.currentTime <= this._audioSpriteStopTime ||
          (this._playbackResource.pause(),
          0 == this._loop
            ? this._handleSoundComplete(null)
            : ((this._position = 0),
              this._loop--,
              (this._playbackResource.currentTime = 0.001 * this._startTime),
              this._paused || this._playbackResource.play(),
              this._sendEvent("loop")));
      }),
      (t._handleLoop = function (e) {
        0 == this._loop &&
          ((this._playbackResource.loop = !1),
          this._playbackResource.removeEventListener(
            createjs.HTMLAudioPlugin._AUDIO_SEEKED,
            this._loopHandler,
            !1
          ));
      }),
      (t._updateStartTime = function () {
        (this._audioSpriteStopTime =
          0.001 * (this._startTime + this._duration)),
          this.playState == createjs.Sound.PLAY_SUCCEEDED &&
            (this._playbackResource.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_ENDED,
              this._endedHandler,
              !1
            ),
            this._playbackResource.addEventListener(
              createjs.HTMLAudioPlugin._TIME_UPDATE,
              this._audioSpriteEndHandler,
              !1
            ));
      }),
      (t._updateDuration = function () {
        (this._audioSpriteStopTime =
          0.001 * (this._startTime + this._duration)),
          this.playState == createjs.Sound.PLAY_SUCCEEDED &&
            (this._playbackResource.removeEventListener(
              createjs.HTMLAudioPlugin._AUDIO_ENDED,
              this._endedHandler,
              !1
            ),
            this._playbackResource.addEventListener(
              createjs.HTMLAudioPlugin._TIME_UPDATE,
              this._audioSpriteEndHandler,
              !1
            ));
      }),
      (t._setDurationFromSource = function () {
        (this._duration = createjs.HTMLAudioTagPool.getDuration(this.src)),
          (this._playbackResource = null);
      }),
      (createjs.HTMLAudioSoundInstance = createjs.promote(
        e,
        "AbstractSoundInstance"
      ));
  })(),
  (this.createjs = this.createjs || {}),
  (function () {
    "use strict";
    function e() {
      this.AbstractPlugin_constructor(),
        (this.defaultNumChannels = 2),
        (this._capabilities = n._capabilities),
        (this._loaderClass = createjs.SoundLoader),
        (this._soundInstanceClass = createjs.HTMLAudioSoundInstance);
    }
    var t = createjs.extend(e, createjs.AbstractPlugin),
      n = e;
    (n.MAX_INSTANCES = 30),
      (n._AUDIO_READY = "canplaythrough"),
      (n._AUDIO_ENDED = "ended"),
      (n._AUDIO_SEEKED = "seeked"),
      (n._AUDIO_STALLED = "stalled"),
      (n._TIME_UPDATE = "timeupdate"),
      (n._capabilities = null),
      (n.isSupported = function () {
        return n._generateCapabilities(), null != n._capabilities;
      }),
      (n._generateCapabilities = function () {
        if (null == n._capabilities) {
          var e = document.createElement("audio");
          if (null == e.canPlayType) return null;
          n._capabilities = { panning: !1, volume: !0, tracks: -1 };
          for (
            var t = createjs.Sound.SUPPORTED_EXTENSIONS,
              r = createjs.Sound.EXTENSION_MAP,
              i = 0,
              s = t.length;
            i < s;
            i++
          ) {
            var o = t[i],
              a = r[o] || o;
            n._capabilities[o] =
              ("no" != e.canPlayType("audio/" + o) &&
                "" != e.canPlayType("audio/" + o)) ||
              ("no" != e.canPlayType("audio/" + a) &&
                "" != e.canPlayType("audio/" + a));
          }
        }
      }),
      (t.register = function (e) {
        var t = createjs.HTMLAudioTagPool.get(e.src),
          n = this.AbstractPlugin_register(e);
        return n.setTag(t), n;
      }),
      (t.removeSound = function (e) {
        this.AbstractPlugin_removeSound(e), createjs.HTMLAudioTagPool.remove(e);
      }),
      (t.create = function (e, t, n) {
        var r = this.AbstractPlugin_create(e, t, n);
        return r.setPlaybackResource(null), r;
      }),
      (t.toString = function () {
        return "[HTMLAudioPlugin]";
      }),
      (t.setVolume = t.getVolume = t.setMute = null),
      (createjs.HTMLAudioPlugin = createjs.promote(e, "AbstractPlugin"));
  })();
