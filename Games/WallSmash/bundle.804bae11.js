!(function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;
      var i = (n[r] = { exports: {}, id: r, loaded: !1 });
      return t[r].call(i.exports, i, i.exports, e), (i.loaded = !0), i.exports;
    }
    var n = {};
    return (e.m = t), (e.c = n), (e.p = ""), e(0);
  })([
    function (t, e, n) {
      t.exports = n(11);
    },
    function (t, e, n) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = n(17),
        i = (0, r.createFirebaseNamespace)();
      (e.default = i), (t.exports = e.default);
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = n(8),
        o = r(i),
        a = o.default.ref("gkc/highscore");
      (window.database = o.default), (window.scores = a), (e.default = a);
    },
    function (t, e) {
      t.exports = function () {
        var t = [];
        return (
          (t.toString = function () {
            for (var t = [], e = 0; e < this.length; e++) {
              var n = this[e];
              n[2] ? t.push("@media " + n[2] + "{" + n[1] + "}") : t.push(n[1]);
            }
            return t.join("");
          }),
          (t.i = function (e, n) {
            "string" == typeof e && (e = [[null, e, ""]]);
            for (var r = {}, i = 0; i < this.length; i++) {
              var o = this[i][0];
              "number" == typeof o && (r[o] = !0);
            }
            for (i = 0; i < e.length; i++) {
              var a = e[i];
              ("number" == typeof a[0] && r[a[0]]) ||
                (n && !a[2]
                  ? (a[2] = n)
                  : n && (a[2] = "(" + a[2] + ") and (" + n + ")"),
                t.push(a));
            }
          }),
          t
        );
      };
    },
    function (t, e, n) {
      (function (t) {
        /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var r = void 0;
        if ("undefined" != typeof t) r = t;
        else if ("undefined" != typeof self) r = self;
        else
          try {
            r = Function("return this")();
          } catch (t) {
            throw new Error(
              "polyfill failed because global object is unavailable in this environment"
            );
          }
        var i = r.Promise || n(21);
        e.local = { Promise: i, GoogPromise: i };
      }.call(
        e,
        (function () {
          return this;
        })()
      ));
    },
    function (t, e, n) {
      function r(t, e) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n],
            i = d[r.id];
          if (i) {
            i.refs++;
            for (var o = 0; o < i.parts.length; o++) i.parts[o](r.parts[o]);
            for (; o < r.parts.length; o++) i.parts.push(l(r.parts[o], e));
          } else {
            for (var a = [], o = 0; o < r.parts.length; o++)
              a.push(l(r.parts[o], e));
            d[r.id] = { id: r.id, refs: 1, parts: a };
          }
        }
      }
      function i(t) {
        for (var e = [], n = {}, r = 0; r < t.length; r++) {
          var i = t[r],
            o = i[0],
            a = i[1],
            s = i[2],
            c = i[3],
            l = { css: a, media: s, sourceMap: c };
          n[o] ? n[o].parts.push(l) : e.push((n[o] = { id: o, parts: [l] }));
        }
        return e;
      }
      function o(t, e) {
        var n = b(),
          r = y[y.length - 1];
        if ("top" === t.insertAt)
          r
            ? r.nextSibling
              ? n.insertBefore(e, r.nextSibling)
              : n.appendChild(e)
            : n.insertBefore(e, n.firstChild),
            y.push(e);
        else {
          if ("bottom" !== t.insertAt)
            throw new Error(
              "Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'."
            );
          n.appendChild(e);
        }
      }
      function a(t) {
        t.parentNode.removeChild(t);
        var e = y.indexOf(t);
        e >= 0 && y.splice(e, 1);
      }
      function s(t) {
        var e = document.createElement("style");
        return (e.type = "text/css"), o(t, e), e;
      }
      function c(t) {
        var e = document.createElement("link");
        return (e.rel = "stylesheet"), o(t, e), e;
      }
      function l(t, e) {
        var n, r, i;
        if (e.singleton) {
          var o = m++;
          (n = v || (v = s(e))),
            (r = u.bind(null, n, o, !1)),
            (i = u.bind(null, n, o, !0));
        } else
          t.sourceMap &&
          "function" == typeof URL &&
          "function" == typeof URL.createObjectURL &&
          "function" == typeof URL.revokeObjectURL &&
          "function" == typeof Blob &&
          "function" == typeof btoa
            ? ((n = c(e)),
              (r = h.bind(null, n)),
              (i = function () {
                a(n), n.href && URL.revokeObjectURL(n.href);
              }))
            : ((n = s(e)),
              (r = f.bind(null, n)),
              (i = function () {
                a(n);
              }));
        return (
          r(t),
          function (e) {
            if (e) {
              if (
                e.css === t.css &&
                e.media === t.media &&
                e.sourceMap === t.sourceMap
              )
                return;
              r((t = e));
            } else i();
          }
        );
      }
      function u(t, e, n, r) {
        var i = n ? "" : r.css;
        if (t.styleSheet) t.styleSheet.cssText = w(e, i);
        else {
          var o = document.createTextNode(i),
            a = t.childNodes;
          a[e] && t.removeChild(a[e]),
            a.length ? t.insertBefore(o, a[e]) : t.appendChild(o);
        }
      }
      function f(t, e) {
        var n = e.css,
          r = e.media;
        if ((r && t.setAttribute("media", r), t.styleSheet))
          t.styleSheet.cssText = n;
        else {
          for (; t.firstChild; ) t.removeChild(t.firstChild);
          t.appendChild(document.createTextNode(n));
        }
      }
      function h(t, e) {
        var n = e.css,
          r = e.sourceMap;
        r &&
          (n +=
            "\n/*# sourceMappingURL=data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(r)))) +
            " */");
        var i = new Blob([n], { type: "text/css" }),
          o = t.href;
        (t.href = URL.createObjectURL(i)), o && URL.revokeObjectURL(o);
      }
      var d = {},
        p = function (t) {
          var e;
          return function () {
            return "undefined" == typeof e && (e = t.apply(this, arguments)), e;
          };
        },
        g = p(function () {
          return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
        }),
        b = p(function () {
          return document.head || document.getElementsByTagName("head")[0];
        }),
        v = null,
        m = 0,
        y = [];
      t.exports = function (t, e) {
        (e = e || {}),
          "undefined" == typeof e.singleton && (e.singleton = g()),
          "undefined" == typeof e.insertAt && (e.insertAt = "bottom");
        var n = i(t);
        return (
          r(n, e),
          function (t) {
            for (var o = [], a = 0; a < n.length; a++) {
              var s = n[a],
                c = d[s.id];
              c.refs--, o.push(c);
            }
            if (t) {
              var l = i(t);
              r(l, e);
            }
            for (var a = 0; a < o.length; a++) {
              var c = o[a];
              if (0 === c.refs) {
                for (var u = 0; u < c.parts.length; u++) c.parts[u]();
                delete d[c.id];
              }
            }
          }
        );
      };
      var w = (function () {
        var t = [];
        return function (e, n) {
          return (t[e] = n), t.filter(Boolean).join("\n");
        };
      })();
    },
    function (t, e, n) {
      /*!
       * sweetalert2 v6.6.6
       * Released under the MIT License.
       */
      !(function (e, n) {
        t.exports = n();
      })(this, function () {
        "use strict";
        var t = {
            title: "",
            titleText: "",
            text: "",
            html: "",
            type: null,
            customClass: "",
            target: "body",
            animation: !0,
            allowOutsideClick: !0,
            allowEscapeKey: !0,
            allowEnterKey: !0,
            showConfirmButton: !0,
            showCancelButton: !1,
            preConfirm: null,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            confirmButtonClass: null,
            cancelButtonText: "Cancel",
            cancelButtonColor: "#aaa",
            cancelButtonClass: null,
            buttonsStyling: !0,
            reverseButtons: !1,
            focusCancel: !1,
            showCloseButton: !1,
            showLoaderOnConfirm: !1,
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            imageClass: null,
            timer: null,
            width: 500,
            padding: 20,
            background: "#fff",
            input: null,
            inputPlaceholder: "",
            inputValue: "",
            inputOptions: {},
            inputAutoTrim: !0,
            inputClass: null,
            inputAttributes: {},
            inputValidator: null,
            progressSteps: [],
            currentProgressStep: null,
            progressStepsDistance: "40px",
            onOpen: null,
            onClose: null,
            useRejections: !0,
          },
          e = "swal2-",
          n = function (t) {
            var n = {};
            for (var r in t) n[t[r]] = e + t[r];
            return n;
          },
          r = n([
            "container",
            "shown",
            "iosfix",
            "modal",
            "overlay",
            "fade",
            "show",
            "hide",
            "noanimation",
            "close",
            "title",
            "content",
            "buttonswrapper",
            "confirm",
            "cancel",
            "icon",
            "image",
            "input",
            "file",
            "range",
            "select",
            "radio",
            "checkbox",
            "textarea",
            "inputerror",
            "validationerror",
            "progresssteps",
            "activeprogressstep",
            "progresscircle",
            "progressline",
            "loading",
            "styled",
          ]),
          i = n(["success", "warning", "info", "question", "error"]),
          o = function (t, e) {
            (t = String(t).replace(/[^0-9a-f]/gi, "")),
              t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]),
              (e = e || 0);
            for (var n = "#", r = 0; r < 3; r++) {
              var i = parseInt(t.substr(2 * r, 2), 16);
              (i = Math.round(Math.min(Math.max(0, i + i * e), 255)).toString(
                16
              )),
                (n += ("00" + i).substr(i.length));
            }
            return n;
          },
          a = function (t) {
            var e = [];
            for (var n in t) e.indexOf(t[n]) === -1 && e.push(t[n]);
            return e;
          },
          s = {
            previousWindowKeyDown: null,
            previousActiveElement: null,
            previousBodyPadding: null,
          },
          c = function (t) {
            if ("undefined" == typeof document)
              return void console.error(
                "SweetAlert2 requires document to initialize"
              );
            var e = document.createElement("div");
            (e.className = r.container), (e.innerHTML = l);
            var n = document.querySelector(t.target);
            n ||
              (console.warn(
                "SweetAlert2: Can't find the target \"" + t.target + '"'
              ),
              (n = document.body)),
              n.appendChild(e);
            var i = f(),
              o = C(i, r.input),
              a = C(i, r.file),
              s = i.querySelector("." + r.range + " input"),
              c = i.querySelector("." + r.range + " output"),
              u = C(i, r.select),
              h = i.querySelector("." + r.checkbox + " input"),
              d = C(i, r.textarea);
            return (
              (o.oninput = function () {
                G.resetValidationError();
              }),
              (o.onkeydown = function (e) {
                setTimeout(function () {
                  13 === e.keyCode &&
                    t.allowEnterKey &&
                    (e.stopPropagation(), G.clickConfirm());
                }, 0);
              }),
              (a.onchange = function () {
                G.resetValidationError();
              }),
              (s.oninput = function () {
                G.resetValidationError(), (c.value = s.value);
              }),
              (s.onchange = function () {
                G.resetValidationError(), (s.previousSibling.value = s.value);
              }),
              (u.onchange = function () {
                G.resetValidationError();
              }),
              (h.onchange = function () {
                G.resetValidationError();
              }),
              (d.oninput = function () {
                G.resetValidationError();
              }),
              i
            );
          },
          l = (
            '\n <div role="dialog" aria-labelledby="' +
            r.title +
            '" aria-describedby="' +
            r.content +
            '" class="' +
            r.modal +
            '" tabindex="-1">\n   <ul class="' +
            r.progresssteps +
            '"></ul>\n   <div class="' +
            r.icon +
            " " +
            i.error +
            '">\n     <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n   </div>\n   <div class="' +
            r.icon +
            " " +
            i.question +
            '">?</div>\n   <div class="' +
            r.icon +
            " " +
            i.warning +
            '">!</div>\n   <div class="' +
            r.icon +
            " " +
            i.info +
            '">i</div>\n   <div class="' +
            r.icon +
            " " +
            i.success +
            '">\n     <div class="swal2-success-circular-line-left"></div>\n     <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n     <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n     <div class="swal2-success-circular-line-right"></div>\n   </div>\n   <img class="' +
            r.image +
            '" />\n   <h2 class="' +
            r.title +
            '" id="' +
            r.title +
            '"></h2>\n   <div id="' +
            r.content +
            '" class="' +
            r.content +
            '"></div>\n   <input class="' +
            r.input +
            '" />\n   <input type="file" class="' +
            r.file +
            '" />\n   <div class="' +
            r.range +
            '">\n     <output></output>\n     <input type="range" />\n   </div>\n   <select class="' +
            r.select +
            '"></select>\n   <div class="' +
            r.radio +
            '"></div>\n   <label for="' +
            r.checkbox +
            '" class="' +
            r.checkbox +
            '">\n     <input type="checkbox" />\n   </label>\n   <textarea class="' +
            r.textarea +
            '"></textarea>\n   <div class="' +
            r.validationerror +
            '"></div>\n   <div class="' +
            r.buttonswrapper +
            '">\n     <button type="button" class="' +
            r.confirm +
            '">OK</button>\n     <button type="button" class="' +
            r.cancel +
            '">Cancel</button>\n   </div>\n   <button type="button" class="' +
            r.close +
            '" aria-label="Close this dialog">×</button>\n </div>\n'
          ).replace(/(^|\n)\s*/g, ""),
          u = function () {
            return document.body.querySelector("." + r.container);
          },
          f = function () {
            return u() ? u().querySelector("." + r.modal) : null;
          },
          h = function () {
            var t = f();
            return t.querySelectorAll("." + r.icon);
          },
          d = function (t) {
            return u() ? u().querySelector("." + t) : null;
          },
          p = function () {
            return d(r.title);
          },
          g = function () {
            return d(r.content);
          },
          b = function () {
            return d(r.image);
          },
          v = function () {
            return d(r.buttonswrapper);
          },
          m = function () {
            return d(r.progresssteps);
          },
          y = function () {
            return d(r.validationerror);
          },
          w = function () {
            return d(r.confirm);
          },
          x = function () {
            return d(r.cancel);
          },
          k = function () {
            return d(r.close);
          },
          S = function (t) {
            var e = [w(), x()];
            t && e.reverse();
            var n = e.concat(
              Array.prototype.slice.call(
                f().querySelectorAll(
                  'button, input:not([type=hidden]), textarea, select, a, *[tabindex]:not([tabindex="-1"])'
                )
              )
            );
            return a(n);
          },
          E = function (t, e) {
            return !!t.classList && t.classList.contains(e);
          },
          A = function (t) {
            if ((t.focus(), "file" !== t.type)) {
              var e = t.value;
              (t.value = ""), (t.value = e);
            }
          },
          T = function (t, e) {
            if (t && e) {
              var n = e.split(/\s+/).filter(Boolean);
              n.forEach(function (e) {
                t.classList.add(e);
              });
            }
          },
          M = function (t, e) {
            if (t && e) {
              var n = e.split(/\s+/).filter(Boolean);
              n.forEach(function (e) {
                t.classList.remove(e);
              });
            }
          },
          C = function (t, e) {
            for (var n = 0; n < t.childNodes.length; n++)
              if (E(t.childNodes[n], e)) return t.childNodes[n];
          },
          L = function (t, e) {
            e || (e = "block"), (t.style.opacity = ""), (t.style.display = e);
          },
          P = function (t) {
            (t.style.opacity = ""), (t.style.display = "none");
          },
          j = function (t) {
            for (; t.firstChild; ) t.removeChild(t.firstChild);
          },
          I = function (t) {
            return t.offsetWidth || t.offsetHeight || t.getClientRects().length;
          },
          O = function (t, e) {
            t.style.removeProperty
              ? t.style.removeProperty(e)
              : t.style.removeAttribute(e);
          },
          D = function (t) {
            if (!I(t)) return !1;
            if ("function" == typeof MouseEvent) {
              var e = new MouseEvent("click", {
                view: window,
                bubbles: !1,
                cancelable: !0,
              });
              t.dispatchEvent(e);
            } else if (document.createEvent) {
              var n = document.createEvent("MouseEvents");
              n.initEvent("click", !1, !1), t.dispatchEvent(n);
            } else
              document.createEventObject
                ? t.fireEvent("onclick")
                : "function" == typeof t.onclick && t.onclick();
          },
          N = (function () {
            var t = document.createElement("div"),
              e = {
                WebkitAnimation: "webkitAnimationEnd",
                OAnimation: "oAnimationEnd oanimationend",
                msAnimation: "MSAnimationEnd",
                animation: "animationend",
              };
            for (var n in e)
              if (e.hasOwnProperty(n) && void 0 !== t.style[n]) return e[n];
            return !1;
          })(),
          F = function () {
            if (
              ((window.onkeydown = s.previousWindowKeyDown),
              s.previousActiveElement && s.previousActiveElement.focus)
            ) {
              var t = window.scrollX,
                e = window.scrollY;
              s.previousActiveElement.focus(), t && e && window.scrollTo(t, e);
            }
          },
          R = function () {
            var t = "ontouchstart" in window || navigator.msMaxTouchPoints;
            if (t) return 0;
            var e = document.createElement("div");
            (e.style.width = "50px"),
              (e.style.height = "50px"),
              (e.style.overflow = "scroll"),
              document.body.appendChild(e);
            var n = e.offsetWidth - e.clientWidth;
            return document.body.removeChild(e), n;
          },
          B = function (t, e) {
            var n = void 0;
            return function () {
              var r = function () {
                (n = null), t();
              };
              clearTimeout(n), (n = setTimeout(r, e));
            };
          },
          _ =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                },
          q =
            Object.assign ||
            function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e];
                for (var r in n)
                  Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
              }
              return t;
            },
          U = q({}, t),
          Q = [],
          W = void 0,
          V = function (e) {
            var n = f() || c(e);
            for (var o in e)
              t.hasOwnProperty(o) ||
                "extraParams" === o ||
                console.warn('SweetAlert2: Unknown parameter "' + o + '"');
            (n.style.width =
              "number" == typeof e.width ? e.width + "px" : e.width),
              (n.style.padding = e.padding + "px"),
              (n.style.background = e.background);
            for (
              var a = n.querySelectorAll(
                  "[class^=swal2-success-circular-line], .swal2-success-fix"
                ),
                s = 0;
              s < a.length;
              s++
            )
              a[s].style.background = e.background;
            var l = p(),
              u = g(),
              d = v(),
              y = w(),
              S = x(),
              E = k();
            if (
              (e.titleText
                ? (l.innerText = e.titleText)
                : (l.innerHTML = e.title.split("\n").join("<br />")),
              e.text || e.html)
            ) {
              if ("object" === _(e.html))
                if (((u.innerHTML = ""), 0 in e.html))
                  for (var A = 0; A in e.html; A++)
                    u.appendChild(e.html[A].cloneNode(!0));
                else u.appendChild(e.html.cloneNode(!0));
              else
                e.html
                  ? (u.innerHTML = e.html)
                  : e.text && (u.textContent = e.text);
              L(u);
            } else P(u);
            e.showCloseButton ? L(E) : P(E),
              (n.className = r.modal),
              e.customClass && T(n, e.customClass);
            var C = m(),
              I = parseInt(
                null === e.currentProgressStep
                  ? G.getQueueStep()
                  : e.currentProgressStep,
                10
              );
            e.progressSteps.length
              ? (L(C),
                j(C),
                I >= e.progressSteps.length &&
                  console.warn(
                    "SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"
                  ),
                e.progressSteps.forEach(function (t, n) {
                  var i = document.createElement("li");
                  if (
                    (T(i, r.progresscircle),
                    (i.innerHTML = t),
                    n === I && T(i, r.activeprogressstep),
                    C.appendChild(i),
                    n !== e.progressSteps.length - 1)
                  ) {
                    var o = document.createElement("li");
                    T(o, r.progressline),
                      (o.style.width = e.progressStepsDistance),
                      C.appendChild(o);
                  }
                }))
              : P(C);
            for (var D = h(), N = 0; N < D.length; N++) P(D[N]);
            if (e.type) {
              var F = !1;
              for (var R in i)
                if (e.type === R) {
                  F = !0;
                  break;
                }
              if (!F)
                return (
                  console.error("SweetAlert2: Unknown alert type: " + e.type), !1
                );
              var B = n.querySelector("." + r.icon + "." + i[e.type]);
              if ((L(B), e.animation))
                switch (e.type) {
                  case "success":
                    T(B, "swal2-animate-success-icon"),
                      T(
                        B.querySelector(".swal2-success-line-tip"),
                        "swal2-animate-success-line-tip"
                      ),
                      T(
                        B.querySelector(".swal2-success-line-long"),
                        "swal2-animate-success-line-long"
                      );
                    break;
                  case "error":
                    T(B, "swal2-animate-error-icon"),
                      T(B.querySelector(".swal2-x-mark"), "swal2-animate-x-mark");
                }
            }
            var q = b();
            e.imageUrl
              ? (q.setAttribute("src", e.imageUrl),
                L(q),
                e.imageWidth
                  ? q.setAttribute("width", e.imageWidth)
                  : q.removeAttribute("width"),
                e.imageHeight
                  ? q.setAttribute("height", e.imageHeight)
                  : q.removeAttribute("height"),
                (q.className = r.image),
                e.imageClass && T(q, e.imageClass))
              : P(q),
              e.showCancelButton ? (S.style.display = "inline-block") : P(S),
              e.showConfirmButton ? O(y, "display") : P(y),
              e.showConfirmButton || e.showCancelButton ? L(d) : P(d),
              (y.innerHTML = e.confirmButtonText),
              (S.innerHTML = e.cancelButtonText),
              e.buttonsStyling &&
                ((y.style.backgroundColor = e.confirmButtonColor),
                (S.style.backgroundColor = e.cancelButtonColor)),
              (y.className = r.confirm),
              T(y, e.confirmButtonClass),
              (S.className = r.cancel),
              T(S, e.cancelButtonClass),
              e.buttonsStyling
                ? (T(y, r.styled), T(S, r.styled))
                : (M(y, r.styled),
                  M(S, r.styled),
                  (y.style.backgroundColor =
                    y.style.borderLeftColor =
                    y.style.borderRightColor =
                      ""),
                  (S.style.backgroundColor =
                    S.style.borderLeftColor =
                    S.style.borderRightColor =
                      "")),
              e.animation === !0 ? M(n, r.noanimation) : T(n, r.noanimation);
          },
          K = function (t, e) {
            var n = u(),
              i = f();
            t ? (T(i, r.show), T(n, r.fade), M(i, r.hide)) : M(i, r.fade),
              L(i),
              (n.style.overflowY = "hidden"),
              N && !E(i, r.noanimation)
                ? i.addEventListener(N, function t() {
                    i.removeEventListener(N, t), (n.style.overflowY = "auto");
                  })
                : (n.style.overflowY = "auto"),
              T(document.documentElement, r.shown),
              T(document.body, r.shown),
              T(n, r.shown),
              H(),
              X(),
              (s.previousActiveElement = document.activeElement),
              null !== e &&
                "function" == typeof e &&
                setTimeout(function () {
                  e(i);
                });
          },
          H = function () {
            null === s.previousBodyPadding &&
              document.body.scrollHeight > window.innerHeight &&
              ((s.previousBodyPadding = document.body.style.paddingRight),
              (document.body.style.paddingRight = R() + "px"));
          },
          z = function () {
            null !== s.previousBodyPadding &&
              ((document.body.style.paddingRight = s.previousBodyPadding),
              (s.previousBodyPadding = null));
          },
          X = function () {
            var t =
              /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (t && !E(document.body, r.iosfix)) {
              var e = document.body.scrollTop;
              (document.body.style.top = e * -1 + "px"),
                T(document.body, r.iosfix);
            }
          },
          Y = function () {
            if (E(document.body, r.iosfix)) {
              var t = parseInt(document.body.style.top, 10);
              M(document.body, r.iosfix),
                (document.body.style.top = ""),
                (document.body.scrollTop = t * -1);
            }
          },
          G = function t() {
            for (var e = arguments.length, n = Array(e), i = 0; i < e; i++)
              n[i] = arguments[i];
            if (void 0 === n[0])
              return (
                console.error("SweetAlert2 expects at least 1 attribute!"), !1
              );
            var a = q({}, U);
            switch (_(n[0])) {
              case "string":
                (a.title = n[0]), (a.html = n[1]), (a.type = n[2]);
                break;
              case "object":
                q(a, n[0]),
                  (a.extraParams = n[0].extraParams),
                  "email" === a.input &&
                    null === a.inputValidator &&
                    (a.inputValidator = function (t) {
                      return new Promise(function (e, n) {
                        var r =
                          /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                        r.test(t) ? e() : n("Invalid email address");
                      });
                    }),
                  "url" === a.input &&
                    null === a.inputValidator &&
                    (a.inputValidator = function (t) {
                      return new Promise(function (e, n) {
                        var r =
                          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
                        r.test(t) ? e() : n("Invalid URL");
                      });
                    });
                break;
              default:
                return (
                  console.error(
                    'SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' +
                      _(n[0])
                  ),
                  !1
                );
            }
            V(a);
            var c = u(),
              l = f();
            return new Promise(function (e, n) {
              a.timer &&
                (l.timeout = setTimeout(function () {
                  t.closeModal(a.onClose),
                    a.useRejections ? n("timer") : e({ dismiss: "timer" });
                }, a.timer));
              var i = function (t) {
                  if (((t = t || a.input), !t)) return null;
                  switch (t) {
                    case "select":
                    case "textarea":
                    case "file":
                      return C(l, r[t]);
                    case "checkbox":
                      return l.querySelector("." + r.checkbox + " input");
                    case "radio":
                      return (
                        l.querySelector("." + r.radio + " input:checked") ||
                        l.querySelector("." + r.radio + " input:first-child")
                      );
                    case "range":
                      return l.querySelector("." + r.range + " input");
                    default:
                      return C(l, r.input);
                  }
                },
                h = function () {
                  var t = i();
                  if (!t) return null;
                  switch (a.input) {
                    case "checkbox":
                      return t.checked ? 1 : 0;
                    case "radio":
                      return t.checked ? t.value : null;
                    case "file":
                      return t.files.length ? t.files[0] : null;
                    default:
                      return a.inputAutoTrim ? t.value.trim() : t.value;
                  }
                };
              a.input &&
                setTimeout(function () {
                  var t = i();
                  t && A(t);
                }, 0);
              for (
                var d = function (n) {
                    a.showLoaderOnConfirm && t.showLoading(),
                      a.preConfirm
                        ? a.preConfirm(n, a.extraParams).then(
                            function (r) {
                              t.closeModal(a.onClose), e(r || n);
                            },
                            function (e) {
                              t.hideLoading(), e && t.showValidationError(e);
                            }
                          )
                        : (t.closeModal(a.onClose),
                          e(a.useRejections ? n : { value: n }));
                  },
                  E = function (r) {
                    var i = r || window.event,
                      s = i.target || i.srcElement,
                      c = w(),
                      l = x(),
                      u = c && (c === s || c.contains(s)),
                      f = l && (l === s || l.contains(s));
                    switch (i.type) {
                      case "mouseover":
                      case "mouseup":
                        a.buttonsStyling &&
                          (u
                            ? (c.style.backgroundColor = o(
                                a.confirmButtonColor,
                                -0.1
                              ))
                            : f &&
                              (l.style.backgroundColor = o(
                                a.cancelButtonColor,
                                -0.1
                              )));
                        break;
                      case "mouseout":
                        a.buttonsStyling &&
                          (u
                            ? (c.style.backgroundColor = a.confirmButtonColor)
                            : f &&
                              (l.style.backgroundColor = a.cancelButtonColor));
                        break;
                      case "mousedown":
                        a.buttonsStyling &&
                          (u
                            ? (c.style.backgroundColor = o(
                                a.confirmButtonColor,
                                -0.2
                              ))
                            : f &&
                              (l.style.backgroundColor = o(
                                a.cancelButtonColor,
                                -0.2
                              )));
                        break;
                      case "click":
                        if (u && t.isVisible())
                          if ((t.disableButtons(), a.input)) {
                            var p = h();
                            a.inputValidator
                              ? (t.disableInput(),
                                a.inputValidator(p, a.extraParams).then(
                                  function () {
                                    t.enableButtons(), t.enableInput(), d(p);
                                  },
                                  function (e) {
                                    t.enableButtons(),
                                      t.enableInput(),
                                      e && t.showValidationError(e);
                                  }
                                ))
                              : d(p);
                          } else d(!0);
                        else
                          f &&
                            t.isVisible() &&
                            (t.disableButtons(),
                            t.closeModal(a.onClose),
                            a.useRejections
                              ? n("cancel")
                              : e({ dismiss: "cancel" }));
                    }
                  },
                  j = l.querySelectorAll("button"),
                  O = 0;
                O < j.length;
                O++
              )
                (j[O].onclick = E),
                  (j[O].onmouseover = E),
                  (j[O].onmouseout = E),
                  (j[O].onmousedown = E);
              (k().onclick = function () {
                t.closeModal(a.onClose),
                  a.useRejections ? n("close") : e({ dismiss: "close" });
              }),
                (c.onclick = function (r) {
                  r.target === c &&
                    a.allowOutsideClick &&
                    (t.closeModal(a.onClose),
                    a.useRejections ? n("overlay") : e({ dismiss: "overlay" }));
                });
              var N = v(),
                F = w(),
                R = x();
              a.reverseButtons
                ? F.parentNode.insertBefore(R, F)
                : F.parentNode.insertBefore(F, R);
              var q = function (t, e) {
                  for (var n = S(a.focusCancel), r = 0; r < n.length; r++) {
                    (t += e),
                      t === n.length ? (t = 0) : t === -1 && (t = n.length - 1);
                    var i = n[t];
                    if (I(i)) return i.focus();
                  }
                },
                U = function (r) {
                  var i = r || window.event,
                    o = i.keyCode || i.which;
                  if ([9, 13, 32, 27, 37, 38, 39, 40].indexOf(o) !== -1) {
                    for (
                      var s = i.target || i.srcElement,
                        c = S(a.focusCancel),
                        l = -1,
                        u = 0;
                      u < c.length;
                      u++
                    )
                      if (s === c[u]) {
                        l = u;
                        break;
                      }
                    9 === o
                      ? (i.shiftKey ? q(l, -1) : q(l, 1),
                        i.stopPropagation(),
                        i.preventDefault())
                      : 37 === o || 38 === o || 39 === o || 40 === o
                      ? document.activeElement === F && I(R)
                        ? R.focus()
                        : document.activeElement === R && I(F) && F.focus()
                      : 13 === o || 32 === o
                      ? l === -1 &&
                        a.allowEnterKey &&
                        (a.focusCancel ? D(R, i) : D(F, i),
                        i.stopPropagation(),
                        i.preventDefault())
                      : 27 === o &&
                        a.allowEscapeKey === !0 &&
                        (t.closeModal(a.onClose),
                        a.useRejections ? n("esc") : e({ dismiss: "esc" }));
                  }
                };
              (window.onkeydown &&
                window.onkeydown.toString() === U.toString()) ||
                ((s.previousWindowKeyDown = window.onkeydown),
                (window.onkeydown = U)),
                a.buttonsStyling &&
                  ((F.style.borderLeftColor = a.confirmButtonColor),
                  (F.style.borderRightColor = a.confirmButtonColor)),
                (t.hideLoading = t.disableLoading =
                  function () {
                    a.showConfirmButton || (P(F), a.showCancelButton || P(v())),
                      M(N, r.loading),
                      M(l, r.loading),
                      (F.disabled = !1),
                      (R.disabled = !1);
                  }),
                (t.getTitle = function () {
                  return p();
                }),
                (t.getContent = function () {
                  return g();
                }),
                (t.getInput = function () {
                  return i();
                }),
                (t.getImage = function () {
                  return b();
                }),
                (t.getButtonsWrapper = function () {
                  return v();
                }),
                (t.getConfirmButton = function () {
                  return w();
                }),
                (t.getCancelButton = function () {
                  return x();
                }),
                (t.enableButtons = function () {
                  (F.disabled = !1), (R.disabled = !1);
                }),
                (t.disableButtons = function () {
                  (F.disabled = !0), (R.disabled = !0);
                }),
                (t.enableConfirmButton = function () {
                  F.disabled = !1;
                }),
                (t.disableConfirmButton = function () {
                  F.disabled = !0;
                }),
                (t.enableInput = function () {
                  var t = i();
                  if (!t) return !1;
                  if ("radio" === t.type)
                    for (
                      var e = t.parentNode.parentNode,
                        n = e.querySelectorAll("input"),
                        r = 0;
                      r < n.length;
                      r++
                    )
                      n[r].disabled = !1;
                  else t.disabled = !1;
                }),
                (t.disableInput = function () {
                  var t = i();
                  if (!t) return !1;
                  if (t && "radio" === t.type)
                    for (
                      var e = t.parentNode.parentNode,
                        n = e.querySelectorAll("input"),
                        r = 0;
                      r < n.length;
                      r++
                    )
                      n[r].disabled = !0;
                  else t.disabled = !0;
                }),
                (t.recalculateHeight = B(function () {
                  var t = f();
                  if (t) {
                    var e = t.style.display;
                    (t.style.minHeight = ""),
                      L(t),
                      (t.style.minHeight = t.scrollHeight + 1 + "px"),
                      (t.style.display = e);
                  }
                }, 50)),
                (t.showValidationError = function (t) {
                  var e = y();
                  (e.innerHTML = t), L(e);
                  var n = i();
                  n && (A(n), T(n, r.inputerror));
                }),
                (t.resetValidationError = function () {
                  var e = y();
                  P(e), t.recalculateHeight();
                  var n = i();
                  n && M(n, r.inputerror);
                }),
                (t.getProgressSteps = function () {
                  return a.progressSteps;
                }),
                (t.setProgressSteps = function (t) {
                  (a.progressSteps = t), V(a);
                }),
                (t.showProgressSteps = function () {
                  L(m());
                }),
                (t.hideProgressSteps = function () {
                  P(m());
                }),
                t.enableButtons(),
                t.hideLoading(),
                t.resetValidationError();
              for (
                var Q = [
                    "input",
                    "file",
                    "range",
                    "select",
                    "radio",
                    "checkbox",
                    "textarea",
                  ],
                  H = void 0,
                  z = 0;
                z < Q.length;
                z++
              ) {
                var X = r[Q[z]],
                  Y = C(l, X);
                if ((H = i(Q[z]))) {
                  for (var G in H.attributes)
                    if (H.attributes.hasOwnProperty(G)) {
                      var J = H.attributes[G].name;
                      "type" !== J && "value" !== J && H.removeAttribute(J);
                    }
                  for (var $ in a.inputAttributes)
                    H.setAttribute($, a.inputAttributes[$]);
                }
                (Y.className = X), a.inputClass && T(Y, a.inputClass), P(Y);
              }
              var Z = void 0;
              switch (a.input) {
                case "text":
                case "email":
                case "password":
                case "number":
                case "tel":
                case "url":
                  (H = C(l, r.input)),
                    (H.value = a.inputValue),
                    (H.placeholder = a.inputPlaceholder),
                    (H.type = a.input),
                    L(H);
                  break;
                case "file":
                  (H = C(l, r.file)),
                    (H.placeholder = a.inputPlaceholder),
                    (H.type = a.input),
                    L(H);
                  break;
                case "range":
                  var tt = C(l, r.range),
                    et = tt.querySelector("input"),
                    nt = tt.querySelector("output");
                  (et.value = a.inputValue),
                    (et.type = a.input),
                    (nt.value = a.inputValue),
                    L(tt);
                  break;
                case "select":
                  var rt = C(l, r.select);
                  if (((rt.innerHTML = ""), a.inputPlaceholder)) {
                    var it = document.createElement("option");
                    (it.innerHTML = a.inputPlaceholder),
                      (it.value = ""),
                      (it.disabled = !0),
                      (it.selected = !0),
                      rt.appendChild(it);
                  }
                  Z = function (t) {
                    for (var e in t) {
                      var n = document.createElement("option");
                      (n.value = e),
                        (n.innerHTML = t[e]),
                        a.inputValue === e && (n.selected = !0),
                        rt.appendChild(n);
                    }
                    L(rt), rt.focus();
                  };
                  break;
                case "radio":
                  var ot = C(l, r.radio);
                  (ot.innerHTML = ""),
                    (Z = function (t) {
                      for (var e in t) {
                        var n = document.createElement("input"),
                          i = document.createElement("label"),
                          o = document.createElement("span");
                        (n.type = "radio"),
                          (n.name = r.radio),
                          (n.value = e),
                          a.inputValue === e && (n.checked = !0),
                          (o.innerHTML = t[e]),
                          i.appendChild(n),
                          i.appendChild(o),
                          (i.for = n.id),
                          ot.appendChild(i);
                      }
                      L(ot);
                      var s = ot.querySelectorAll("input");
                      s.length && s[0].focus();
                    });
                  break;
                case "checkbox":
                  var at = C(l, r.checkbox),
                    st = i("checkbox");
                  (st.type = "checkbox"),
                    (st.value = 1),
                    (st.id = r.checkbox),
                    (st.checked = Boolean(a.inputValue));
                  var ct = at.getElementsByTagName("span");
                  ct.length && at.removeChild(ct[0]),
                    (ct = document.createElement("span")),
                    (ct.innerHTML = a.inputPlaceholder),
                    at.appendChild(ct),
                    L(at);
                  break;
                case "textarea":
                  var lt = C(l, r.textarea);
                  (lt.value = a.inputValue),
                    (lt.placeholder = a.inputPlaceholder),
                    L(lt);
                  break;
                case null:
                  break;
                default:
                  console.error(
                    'SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' +
                      a.input +
                      '"'
                  );
              }
              ("select" !== a.input && "radio" !== a.input) ||
                (a.inputOptions instanceof Promise
                  ? (t.showLoading(),
                    a.inputOptions.then(function (e) {
                      t.hideLoading(), Z(e);
                    }))
                  : "object" === _(a.inputOptions)
                  ? Z(a.inputOptions)
                  : console.error(
                      "SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " +
                        _(a.inputOptions)
                    )),
                K(a.animation, a.onOpen),
                a.allowEnterKey
                  ? q(-1, 1)
                  : document.activeElement && document.activeElement.blur(),
                (u().scrollTop = 0),
                "undefined" == typeof MutationObserver ||
                  W ||
                  ((W = new MutationObserver(t.recalculateHeight)),
                  W.observe(l, {
                    childList: !0,
                    characterData: !0,
                    subtree: !0,
                  }));
            });
          };
        return (
          (G.isVisible = function () {
            return !!f();
          }),
          (G.queue = function (t) {
            Q = t;
            var e = function () {
                (Q = []), document.body.removeAttribute("data-swal2-queue-step");
              },
              n = [];
            return new Promise(function (t, r) {
              !(function i(o, a) {
                o < Q.length
                  ? (document.body.setAttribute("data-swal2-queue-step", o),
                    G(Q[o]).then(
                      function (t) {
                        n.push(t), i(o + 1, a);
                      },
                      function (t) {
                        e(), r(t);
                      }
                    ))
                  : (e(), t(n));
              })(0);
            });
          }),
          (G.getQueueStep = function () {
            return document.body.getAttribute("data-swal2-queue-step");
          }),
          (G.insertQueueStep = function (t, e) {
            return e && e < Q.length ? Q.splice(e, 0, t) : Q.push(t);
          }),
          (G.deleteQueueStep = function (t) {
            "undefined" != typeof Q[t] && Q.splice(t, 1);
          }),
          (G.close = G.closeModal =
            function (t) {
              var e = u(),
                n = f();
              if (n) {
                M(n, r.show), T(n, r.hide), clearTimeout(n.timeout), F();
                var i = function () {
                  e.parentNode && e.parentNode.removeChild(e),
                    M(document.documentElement, r.shown),
                    M(document.body, r.shown),
                    z(),
                    Y();
                };
                N && !E(n, r.noanimation)
                  ? n.addEventListener(N, function t() {
                      n.removeEventListener(N, t), E(n, r.hide) && i();
                    })
                  : i(),
                  null !== t &&
                    "function" == typeof t &&
                    setTimeout(function () {
                      t(n);
                    });
              }
            }),
          (G.clickConfirm = function () {
            return w().click();
          }),
          (G.clickCancel = function () {
            return x().click();
          }),
          (G.showLoading = G.enableLoading =
            function () {
              var t = f();
              t || G("");
              var e = v(),
                n = w(),
                i = x();
              L(e),
                L(n, "inline-block"),
                T(e, r.loading),
                T(t, r.loading),
                (n.disabled = !0),
                (i.disabled = !0);
            }),
          (G.setDefaults = function (e) {
            if (!e || "object" !== ("undefined" == typeof e ? "undefined" : _(e)))
              return console.error(
                "SweetAlert2: the argument for setDefaults() is required and has to be a object"
              );
            for (var n in e)
              t.hasOwnProperty(n) ||
                "extraParams" === n ||
                (console.warn('SweetAlert2: Unknown parameter "' + n + '"'),
                delete e[n]);
            q(U, e);
          }),
          (G.resetDefaults = function () {
            U = q({}, t);
          }),
          (G.noop = function () {}),
          (G.version = "6.6.6"),
          (G.default = G),
          G
        );
      }),
        window.Sweetalert2 &&
          (window.sweetAlert = window.swal = window.Sweetalert2);
    },
    function (t, e) {
      "use strict";
      function n(t, e, n, r) {
        function o() {
          l
            ? (document.querySelector(e).classList.add("hidden"),
              (c.innerText = "Show " + r),
              (i = 0))
            : (document.querySelector(e).classList.remove("hidden"),
              (c.innerText = "Hide " + r)),
            s(l);
          try {
            localStorage[n] = l;
          } catch (t) {
            console.warn(t);
          }
        }
        var a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
          s =
            arguments.length > 5 && void 0 !== arguments[5]
              ? arguments[5]
              : function () {
                  return 0;
                },
          c = document.getElementById(t),
          l = localStorage[n] ? "true" === localStorage[n] : a;
        return (
          c.addEventListener("click", function (t) {
            (l = !l), o();
          }),
          o(),
          function () {
            return l;
          }
        );
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = database.ref("gkc/chat");
      e.default = r;
      var i = 0,
        o = document.querySelector(".messages"),
        a = n("chat_toggle", ".chat", "chat_hidden", "Chat", !0, function (t) {
          o.scrollTop = o.scrollHeight;
        });
      n("header_toggle", "#header", "header_hidden", "Header");
      r.limitToLast(50).on("value", function (t) {
        (o.innerHTML = ""),
          i++,
          a() &&
            (document.getElementById("chat_toggle").innerText =
              "Show Chat (" + i + ")");
        var e = Date.now(),
          n = [];
        t.forEach(function (t) {
          n.push(t.val());
        }),
          n.forEach(function (t, r) {
            try {
              var i = n[r - 1],
                a = document.createElement("div");
              if (t.achievement) {
                a.classList.add("achievement", t.achievement);
                var s =
                    t.score > 1e5
                      ? "diamond"
                      : t.score > 25e3
                      ? "gold"
                      : t.score > 5e3
                      ? "silver"
                      : "bronze",
                  c = { diamond: "💎", gold: "🥇", silver: "🥈", bronze: "🥉" };
                "good_score" === t.achievement && a.classList.add(s),
                  (a.innerText =
                    "good_score" === t.achievement
                      ? c[s] +
                        " " +
                        t.username +
                        " scored " +
                        (+t.score).toLocaleString()
                      : "personal_record" === t.achievement
                      ? t.username +
                        " set a new personal record: " +
                        (+t.score).toLocaleString()
                      : "weekly_record" === t.achievement
                      ? t.username +
                        " scored #" +
                        (t.place + 1) +
                        " weekly: " +
                        (+t.score).toLocaleString()
                      : "unknown achievement, reload the page?");
              } else (a.className = "message-item"), (a.innerHTML = '\n                    <div class="username">\n                        <div class="name"></div>\n                        ' + (t.score ? '<div class="score"></div>' : "") + '\n                        <div class="time"></div>\n                    </div>\t\n                    <div class="message"></div>\n                '), (a.querySelector(".message").innerText = t.message.toString().slice(0, 2e3)), (a.querySelector(".name").innerText = t.username), t.score && (a.querySelector(".score").innerText = (+t.score).toLocaleString()), (a.querySelector(".time").innerText = e - t.timestamp > 72e5 ? new Date(t.timestamp).toLocaleDateString() : new Date(t.timestamp).toLocaleTimeString());
              if (i && t.timestamp - i.timestamp > 9e5) {
                var l = document.createElement("div");
                (l.className = "message-spacer"), o.appendChild(l);
              }
              o.appendChild(a);
            } catch (t) {
              console.warn(t);
            }
          }),
          (o.scrollTop = o.scrollHeight);
      });
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = n(1),
        o = r(i);
      n(19),
        o.default.initializeApp({
          apiKey: "AIzaSyC575_7reOgsW_UQT3LRi2hZiX6LsQdu88",
          authDomain: "cleverstaginc.firebaseapp.com",
          databaseURL: "https://cleverstaginc.firebaseio.com",
        });
      var a = o.default.database();
      e.default = a;
    },
    function (t, e) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = (function () {
          function t(t, n) {
            (this.db = t),
              (this.roomName = n || "globe"),
              (this.room = this.db.ref(
                "gkc/online/" + encodeURIComponent(this.roomName)
              )),
              (this.myName = ""),
              (this.user = null),
              (this.join = function (t, n) {
                if (this.user) return console.error("Already joined."), !1;
                (this.myName = t || "Anonymous - " + e()),
                  (this.user = n ? this.room.child(n) : this.room.push());
                var r = this,
                  i = this.db.ref(".info/connected");
                return (
                  i.on("value", function (t) {
                    t.val() &&
                      (r.user.onDisconnect().remove(), r.user.set(r.myName));
                  }),
                  this.myName
                );
              }),
              (this.leave = function () {
                this.user.remove(), (this.myName = "");
              }),
              (this.over = function () {
                this.room.remove();
              }),
              (this.onUpdated = function (t) {
                "function" == typeof t
                  ? this.room.on("value", function (e) {
                      t(e.numChildren(), e.val());
                    })
                  : console.error(
                      "You have to pass a callback function to onUpdated(). That function will be called (with user count and hash of users as param) every time the user list changed."
                    );
              });
          }
          var e = function () {
            return Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, "")
              .substr(0, 5);
          };
          return t;
        })());
    },
    function (t, e) {
      "use strict";
      function n(t, e, n) {
        var r = i(t, 3),
          o = r[0],
          a = r[1],
          s = r[2],
          c = i(e, 3),
          l = c[0],
          u = c[1],
          f = c[2];
        return [o + (l - o) * n, a + (u - a) * n, s + (f - s) * n];
      }
      function r(t, e) {
        e = Math.min(Math.max(e, 0), 1);
        var r = o[t],
          i =
            1 === e
              ? r.length - 1
              : 0 === e
              ? 1
              : r.findIndex(function (t) {
                  return t.index > e;
                }),
          a = r[i - 1],
          s = r[i],
          c = n(a.rgb, s.rgb, (e - a.index) / (s.index - a.index));
        return c.map(Math.round);
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = (function () {
        function t(t, e) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (
              var a, s = t[Symbol.iterator]();
              !(r = (a = s.next()).done) &&
              (n.push(a.value), !e || n.length !== e);
              r = !0
            );
          } catch (t) {
            (i = !0), (o = t);
          } finally {
            try {
              !r && s.return && s.return();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        }
        return function (e, n) {
          if (Array.isArray(e)) return e;
          if (Symbol.iterator in Object(e)) return t(e, n);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
      e.default = r;
      var o = {
        stars: [
          { index: 0, rgb: [0, 0, 255] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        space: [
          { index: 0, rgb: [255, 255, 255] },
          { index: 0.05, rgb: [50, 5, 50] },
          { index: 1, rgb: [15, 5, 15] },
        ],
        hotish: [
          { index: 0, rgb: [230, 0, 0] },
          { index: 0.3, rgb: [255, 210, 0] },
          { index: 0.5, rgb: [200, 200, 200] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        yiorrd: [
          { index: 0, rgb: [128, 0, 38] },
          { index: 0.125, rgb: [189, 0, 38] },
          { index: 0.25, rgb: [227, 26, 28] },
          { index: 0.375, rgb: [252, 78, 42] },
          { index: 0.5, rgb: [253, 141, 60] },
          { index: 0.625, rgb: [254, 178, 76] },
          { index: 0.75, rgb: [254, 217, 118] },
          { index: 0.875, rgb: [255, 237, 160] },
          { index: 1, rgb: [255, 255, 204] },
        ],
        magma: [
          { index: 0, rgb: [28, 16, 68] },
          { index: 0.25, rgb: [79, 18, 123] },
          { index: 0.38, rgb: [129, 37, 129] },
          { index: 0.5, rgb: [181, 54, 122] },
          { index: 0.63, rgb: [229, 80, 100] },
          { index: 0.75, rgb: [251, 135, 97] },
          { index: 1, rgb: [254, 194, 135] },
        ],
        magma2: [
          { index: 0, rgb: [28, 16, 68] },
          { index: 0.13, rgb: [172, 0, 187] },
          { index: 0.25, rgb: [219, 0, 170] },
          { index: 0.38, rgb: [255, 0, 130] },
          { index: 0.5, rgb: [255, 63, 74] },
          { index: 0.63, rgb: [255, 123, 0] },
          { index: 0.75, rgb: [234, 176, 0] },
          { index: 0.88, rgb: [190, 228, 0] },
          { index: 1, rgb: [147, 255, 0] },
        ],
        progress: [
          { index: 0, rgb: [255, 255, 170] },
          { index: 0.072, rgb: [255, 170, 86] },
          { index: 0.142, rgb: [255, 0, 0] },
          { index: 0.249, rgb: [191, 0, 191] },
          { index: 0.35, rgb: [127, 127, 127] },
          { index: 0.47, rgb: [0, 191, 0] },
          { index: 0.63, rgb: [0, 127, 255] },
          { index: 0.805, rgb: [127, 0, 0] },
          { index: 1, rgb: [0, 0, 0] },
        ],
      };
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function i(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      function o() {
        (nt = "aiming"),
          (ut = 5),
          (ft = Array.from(new Array(ut - 1), function () {
            return "ball";
          })),
          (ht = Array.from(ft)),
          (st = []),
          (ct = []),
          (lt = []),
          (et = 0),
          (Z.innerHTML = et),
          (yt = []),
          (wt = new Set()),
          (ot = void 0);
        for (var t = 0; t < 4; t++) a();
      }
      function a() {
        yt.forEach(function (t) {
          t[0]++;
        }),
          wt.forEach(function (t) {
            t[0]++;
          });
        for (var t = 0.5, e = 0.2, n = 0; n < bt; n++)
          Math.random() <= t
            ? yt.push([0, n, ut])
            : Math.random() <= e &&
              (5 == ut
                ? wt.add([0, n, "laser"])
                : ut > 5 && ut < 15 && Math.random() > 0.5
                ? wt.add([0, n, "laser"])
                : ut > 15 && Math.random() > 0.95
                ? wt.add([0, n, "laser"])
                : wt.add([0, n, "ball"]));
      }
      function s(t) {
        xt++;
        var e = (t - Dt) / 1e3;
        (Dt = t), requestAnimationFrame(s);
        var n = document.getElementById("canvas-wrap").getBoundingClientRect(),
          r = n.width,
          i = n.height;
        if (
          ((canvas.width = 2 * r),
          (canvas.height = 2 * i),
          (dt = Math.max(Math.min(2e3, canvas.width), 1500)),
          M(e),
          C(e),
          k(t, e),
          "playing" === nt)
        )
          if (ht.length) {
            if (xt % 3 == 0) {
              var o = ht.shift();
              if ("ball" === o) {
                var c = Et(),
                  l = pt,
                  u = ot || canvas.width / 2,
                  f = F() - l;
                st.push({
                  x: u,
                  y: f,
                  vx: Math.cos(c) * dt,
                  vy: -1 * Math.sin(c) * dt,
                  r: l,
                  type: o,
                  last: !ht.filter(function (t) {
                    return "ball" === t;
                  }).length,
                });
              } else if ("laser" === o) {
                var h = Et((Math.sin((ht.length / 8) * Math.PI) * Math.PI) / 100),
                  d = pt,
                  p = ot || canvas.width / 2,
                  g = F() - d,
                  b = [p, g],
                  v = Math.cos(h) * (canvas.width + canvas.height),
                  m = -Math.sin(h) * (canvas.width + canvas.height),
                  y = [p + v, g + m];
                yt.forEach(function (t) {
                  var e = R(t, 3),
                    n = e[0],
                    r = e[1],
                    i = e[2];
                  if (!(i <= 0)) {
                    var o = N(n, r),
                      a = O(o, b, [1 / v, 1 / m], canvas.width + canvas.height);
                    if (a) {
                      var s = o.x,
                        c = o.y,
                        l = o.w,
                        u = o.h,
                        f = [
                          [
                            [s, c],
                            [s + l, c],
                          ],
                          [
                            [s + l, c],
                            [s + l, c + u],
                          ],
                          [
                            [s + l, c + u],
                            [s, c + u],
                          ],
                          [
                            [s, c + u],
                            [s, c],
                          ],
                        ];
                      f.forEach(function (e) {
                        var n = Pt(b, [v, m], e[0], Tt(e[1], e[0]));
                        n &&
                          !Ot(n, b) &&
                          At(n, b, y) &&
                          At(n, e[0], e[1]) &&
                          (j({
                            vx: v,
                            vy: m,
                            vr: 100,
                            f: 0.1,
                            x: n[0],
                            y: n[1],
                            r: 1,
                            lifetime: Math.random(),
                            color:
                              "rgba(" +
                              (0, V.default)("progress", i / 125) +
                              ",1)",
                          }),
                          t[2]--,
                          L());
                      });
                    }
                  }
                }),
                  j({
                    x: p,
                    y: g,
                    toX: y[0],
                    toY: y[1],
                    r: 1,
                    vr: 150,
                    fade: !0,
                    color: "#aaf",
                    lifetime: 0.2,
                  }),
                  j({
                    x: p,
                    y: g,
                    toX: y[0],
                    toY: y[1],
                    r: 2,
                    fade: !0,
                    color: mt,
                    lifetime: 0.2,
                  });
              }
            }
          } else
            st.every(function (t) {
              return t.gathered;
            }) &&
              ((st = []),
              ut++,
              (ot = at),
              (ht = Array.from(ft)),
              (nt = "levelup"),
              (rt = t),
              a());
      }
      function c(t) {
        32 == t.keyCode && u();
      }
      function l(t) {
        if ("aiming" == nt) {
          var e = canvas.getBoundingClientRect(),
            n = t.touches[0].pageX,
            r = t.touches[0].pageY;
          it = { x: 2 * (n - e.left), y: 2 * (r - e.top) };
        }
      }
      function u() {
        "aiming" === nt &&
          ((st = []), (nt = "playing"), (end_button.style.opacity = 1));
      }
      function f() {
        $.save(),
          ($.strokeStyle = vt),
          ($.lineWidth = 10),
          ($.globalAlpha = 0.3),
          lt.forEach(function (t) {
            var e,
              n,
              r = R(t, 2),
              o = r[0],
              a = r[1];
            $.beginPath(),
              (e = $).moveTo.apply(e, i(o)),
              (n = $).lineTo.apply(n, i(a)),
              $.stroke();
          }),
          $.restore();
      }
      function h() {
        st.forEach(function (t) {
          var e = t.x,
            n = t.y,
            r = (t.vx, t.vy, t.r),
            i = t.type;
          t.last;
          $.beginPath(),
            "ball" === i
              ? (($.fillStyle = vt), $.arc(e, n, r, 0, 2 * Math.PI))
              : "laser" === i &&
                (($.fillStyle = mt), $.fillRect(e - r / 2, n - r, r, 2 * r)),
            $.fill();
        });
      }
      function d() {
        ($.textBaseline = "bottom"), ($.font = "20px Avenir");
        var t = ht.filter(function (t) {
            return "ball" === t;
          }).length,
          e = ht.filter(function (t) {
            return "laser" === t;
          }).length,
          n = st
            .filter(function (t) {
              return t.gathered;
            })
            .map(function (t) {
              return t.type;
            })
            .filter(function (t) {
              return "ball" === t;
            }).length,
          r =
            ft.filter(function (t) {
              return "laser" === t;
            }).length -
            st
              .filter(function (t) {
                return !t.gathered;
              })
              .filter(function (t) {
                return "laser" === t.type;
              }).length,
          i = function (t, e, n) {
            ($.textAlign = "right"),
              ($.fillStyle = vt),
              t && $.fillText(t, n - pt, canvas.height),
              ($.textAlign = "left"),
              ($.fillStyle = mt),
              e && $.fillText(e, n + pt, canvas.height);
          };
        ot !== at && i(n, r, at || canvas.width / 2),
          i(t, e, ot || canvas.width / 2);
      }
      function p() {
        var t = ot || canvas.width / 2,
          e = F() - pt,
          n = Math.sqrt(
            canvas.height * canvas.height + canvas.width * canvas.width
          ),
          r = Et();
        $.save(),
          ($.strokeStyle = "#aaa"),
          $.beginPath(),
          $.setLineDash([5, 15]),
          ($.lineWidth = 5),
          $.moveTo(t, e),
          $.lineTo(t + n * Math.cos(r), e - n * Math.sin(r)),
          $.stroke(),
          $.restore(),
          $.beginPath(),
          ($.fillStyle = vt),
          $.arc(t, e, pt, 0, 2 * Math.PI),
          $.fill();
      }
      function g(t, e) {
        var n = R(t, 3),
          r = n[0],
          i = n[1],
          o = n[2];
        if (!(o <= 0)) {
          var a = N(r, i),
            s = a.w,
            c = a.h,
            l = a.x,
            u = a.y,
            f = a.cx,
            h = a.cy,
            d = e ? 10 * (Math.random() - 0.5) : 0,
            p = e ? 10 * (Math.random() - 0.5) : 0;
          if (
            (($.fillStyle =
              "rgba(" + (0, V.default)("progress", o / 125) + ",1)"),
            $.fillRect(l + d, u + p, s, c),
            e && $.translate(d, p),
            o > 130)
          ) {
            var g = Math.min((o - 130) / 60, 1);
            if (Math.random() < g / 10) {
              j({
                type: "circle",
                x: l + Math.random() * s,
                y: u + Math.random() * c,
                lifetime: 3,
                color: "rgba(" + (0, V.default)("stars", g) + ",1)",
                fade: !0,
                r: 3 * Math.random(),
              });
            }
          }
          ($.textBaseline = "middle"),
            ($.textAlign = "center"),
            ($.font = "40px Avenir"),
            ($.fillStyle = "black"),
            $.fillText(o, f + d, h + p + 2),
            ($.fillStyle = "white"),
            $.fillText(o, f + d, h + p),
            e && $.translate(-d, -p);
        }
      }
      function b() {
        yt.forEach(function (t) {
          return g(t);
        }),
          yt
            .filter(function (t) {
              return t.hit;
            })
            .forEach(function (t) {
              return g(t, !0);
            });
      }
      function v(t) {
        wt.forEach(function (e) {
          var n = R(e, 3),
            r = n[0],
            i = n[1],
            o = n[2];
          if ("ball" == o) {
            var a = N(r, i),
              s = (a.w, a.h, a.x, a.y, a.cx),
              c = a.cy;
            ($.fillStyle = vt),
              $.beginPath(),
              $.arc(s, c, 10, 0, 2 * Math.PI),
              $.fill(),
              ($.strokeStyle = vt),
              $.beginPath(),
              $.arc(s, c, 20 + 5 * Math.sin(t / 300), 0, 2 * Math.PI),
              $.stroke();
          } else if ("laser" == o) {
            var l = N(r, i),
              u = (l.w, l.h, l.x, l.y, l.cx),
              f = l.cy;
            ($.fillStyle = mt),
              $.fillRect(u - 5, f - 10, 10, 20),
              ($.strokeStyle = mt),
              $.beginPath(),
              $.arc(u, f, 20 + 5 * Math.sin(t / 300), 0, 2 * Math.PI),
              $.stroke();
          }
        });
      }
      function m() {
        ct.forEach(function (t) {
          var e = t.x,
            n = t.y,
            r = t.r,
            i = t.vx,
            o = t.vy,
            a = t.toX,
            s = t.toY,
            c = t.age,
            l = t.lifetime,
            u = t.text,
            f = t.color,
            h = t.fade,
            d = (t.startColor, t.endColor, t.colormap),
            p = t.type,
            g = Math.max(1 - c / l, 0);
          h && ($.globalAlpha = g),
            d && (f = "rgba(" + (0, V.default)(d, 1 - g) + ",1)"),
            f && (($.fillStyle = f), ($.strokeStyle = f)),
            "text" === p
              ? (($.font = r + "px Avenir"), $.fillText(u, e, n))
              : "circle" === p
              ? ($.beginPath(), $.arc(e, n, r, 0, 2 * Math.PI), $.fill())
              : ($.beginPath(),
                ($.lineWidth = r),
                $.moveTo(e, n),
                "undefined" != typeof a
                  ? $.lineTo(a, s)
                  : $.lineTo(e + i / 10, n + o / 10),
                $.stroke()),
            ($.globalAlpha = 1);
        });
      }
      function y() {
        ($.fillStyle = "rgba(0,0,0,.3)"),
          $.fillRect(0, 0, canvas.width, canvas.height),
          ($.textBaseline = "middle"),
          ($.textAlign = "center");
        var t = canvas.width / 15;
        $.font = t + "px Avenir";
        var e = [
          "You Lose 😱",
          "あなたは失う 😱",
          "Tu Perdiste 😱",
          "أنت تفقد 😱",
          "Tu As Perdu 😱",
          "你输了 😱",
        ];
        ($.fillStyle = "#f0f0f0"),
          $.fillText(
            e[Math.floor(Date.now() / 1500) % e.length],
            canvas.width / 2,
            canvas.height / 2
          ),
          ($.font = "30px Avenir"),
          $.fillText(
            "[tap to restart]",
            canvas.width / 2,
            canvas.height / 2 + t / 2 + 20
          );
      }
      function w(t, e) {
        if (($.save(), ut <= 120)) $.clearRect(0, 0, canvas.width, canvas.height);
        else {
          121 === ut && "levelup" == nt && ($.globalAlpha = t);
          for (
            var n = canvas.width / 2,
              r = canvas.height / 2,
              i = Math.max(canvas.width, canvas.height),
              o = e / 1e4,
              a = $.createLinearGradient(
                n - Math.sin(o) * i,
                r - Math.cos(o) * i,
                n + Math.sin(o) * i,
                r + Math.cos(o) * i
              ),
              s = 0;
            s < 3;
            s++
          ) {
            var c = (e + 1e4 * s) / 1e3;
            a.addColorStop(
              s / 3,
              "hsl(" + ((Math.sin(c) + 1) / 2) * 100 + ", 20%, 10%)"
            );
          }
          ($.fillStyle = a), $.fillRect(0, 0, canvas.width, canvas.height);
        }
        $.restore();
      }
      function x(t) {
        var e = -N(0, 0).h,
          n = t - rt,
          r = -1,
          i = r * n;
        return { total: e, r: Math.min(i / e, 1) };
      }
      function k(t, e) {
        var n = x(t),
          r = n.r,
          i = n.total;
        w(r, t),
          ($.fillStyle = "rgba(180,180,180,.3)"),
          $.fillRect(0, F(), canvas.width, canvas.height - F()),
          f(),
          h(),
          d(),
          "aiming" === nt && p(),
          "levelup" == nt &&
            (p(),
            r < 1
              ? $.translate(0, i * (1 - r))
              : ((nt = "aiming"),
                yt.forEach(function (t) {
                  t[0] === gt - 1 &&
                    t[2] > 0 &&
                    ("lost" != nt && T(), (nt = "lost"));
                }),
                (end_button.style.opacity = 0))),
          b(),
          v(t),
          m(),
          "lost" === nt && y();
      }
      function S(t) {
        X.default.push({
          messsage: "[system] Reload if you see this",
          username: t,
          achievement: "good_score",
          score: et,
          timestamp: _.default.database.ServerValue.TIMESTAMP,
        });
      }
      function E(t) {
        X.default.push({
          messsage: "[system] Reload if you see this",
          username: t,
          achievement: "personal_record",
          score: et,
          timestamp: _.default.database.ServerValue.TIMESTAMP,
        });
      }
      function A(t, e) {
        X.default.push({
          messsage: "[system] Reload if you see this",
          username: t,
          achievement: "weekly_record",
          score: et,
          place: e,
          timestamp: _.default.database.ServerValue.TIMESTAMP,
        });
      }
      function T() {
        var t = (localStorage.username, localStorage.pr || 0);
        console.log("Game state lost");
        var e = Q.weeklyScores.findIndex(function (t) {
          return t.score < et;
        });
        if (et > t) {
          tt.innerHTML = et.toLocaleString();
          try {
            localStorage.pr = et;
          } catch (t) {}
          (0, U.default)({
            title: "New high score!",
            text: et + " is your new personal record.",
            input: "text",
            inputPlaceholder: "Nickname for Leaderboard",
            inputValue: localStorage.username || "",
            showCancelButton: !0,
            confirmButtonText: "Submit",
            reverseButtons: !0,
            inputValidator: function (t) {
              return new Promise(function (e, n) {
                return t ? e() : n("You need to write something!");
              });
            },
          })
            .then(function (t) {
              try {
                localStorage.username = t;
              } catch (t) {}
              H.default.push(
                et > 1e5
                  ? { username: t, score: et, check: Math.pow(et % 823, 2) % 823 }
                  : { username: t, score: et }
              ),
                E(t),
                e >= 0
                  ? (Q.weeklyScores.splice(e, 0, { username: t, score: et }),
                    (0, Q.updateScoreFeed)(),
                    A(t, e))
                  : et > 1e3 && S(t);
            })
            .catch(function (t) {
              console.warn(t);
            });
        } else
          e >= 0
            ? (0, U.default)({
                title: "New high score!",
                text: "You got the #" + (e + 1) + " score this week!\b",
                input: "text",
                inputPlaceholder: "Nickname for Leaderboard",
                inputValue: localStorage.username || "",
                showCancelButton: !0,
                confirmButtonText: "Submit",
                reverseButtons: !0,
                inputValidator: function (t) {
                  return new Promise(function (e, n) {
                    return t ? e() : n("You need to write something!");
                  });
                },
              })
                .then(function (t) {
                  try {
                    localStorage.username = t;
                  } catch (t) {}
                  H.default.push({ username: t, score: et }),
                    Q.weeklyScores.splice(e, 0, { username: t, score: et }),
                    A(t, e),
                    (0, Q.updateScoreFeed)();
                })
                .catch(function (t) {
                  console.warn(t);
                })
            : et > 1e3 && S(St);
        var n = function t(e) {
          e.preventDefault(),
            o(),
            canvas.removeEventListener("click", t),
            canvas.removeEventListener("touchend", t);
        };
        canvas.addEventListener("click", n),
          canvas.addEventListener("touchend", n);
      }
      function M(t) {
        yt.forEach(function (t) {
          return (t.hit = !1);
        }),
          (lt = []),
          st.forEach(function (e) {
            if (e.done) {
              var n = at - (e.x + t * e.vx);
              (Math.abs(n) < 1e-8 || n / e.gather_dir < 0) &&
                ((e.x = at), (e.vx = 0), (e.gathered = !0));
            }
            P(e, t),
              e.y > F() - e.r &&
                !e.done &&
                ((e.y = F() - e.r),
                (e.vx = 0),
                (e.vy = 0),
                st.some(function (t) {
                  return t.done;
                })
                  ? ((e.vx = (at - e.x) * (2 + Math.random())),
                    (e.gather_dir = at - e.x || 1))
                  : ((at = Math.min(Math.max(e.x, e.r), canvas.width - e.r)),
                    (e.gathered = !0)),
                (e.done = !0));
          });
      }
      function C(t) {
        var e = [];
        ct.forEach(function (n) {
          n.age || (n.age = 0),
            n.age > n.lifetime ||
              ((n.vx += n.ax * t),
              (n.vy += n.ay * t),
              (n.vx *= 1 - n.f),
              (n.vy *= 1 - n.f),
              (n.vr += n.ar * t),
              (n.x += n.vx * t),
              (n.y += n.vy * t),
              (n.r += n.vr * t),
              n.r < 0 || ((n.age += t), e.push(n)));
        }),
          (ct = e);
      }
      function L() {
        var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        (et += t),
          (Z.innerHTML = et.toLocaleString()),
          (Z.style.transition = "none"),
          (Z.className = "gold"),
          setTimeout(function () {
            (Z.style.transition = "1s"), (Z.className = "");
          }, 0);
      }
      function P(t, e) {
        for (
          var n = t.r,
            r = Math.sqrt(t.vx * t.vx + t.vy * t.vy),
            o = r * e,
            a = function () {
              var e = D([t.vx, t.vy]),
                a = R(e, 2),
                c = a[0],
                l = a[1],
                u = [1 / c, 1 / l],
                f = [t.x, t.y],
                h = [t.x + c * o, t.y + l * o];
              if (isNaN(h[0])) throw "walp";
              var d = 1 / 0,
                p = void 0,
                g = void 0,
                b = void 0,
                v = [
                  [
                    [n, 0],
                    [n, canvas.height - n],
                  ],
                  [
                    [canvas.width - n, canvas.height - n],
                    [canvas.width - n, n],
                  ],
                  [
                    [canvas.width - n, n],
                    [n, n],
                  ],
                ];
              if (
                (t.done ||
                  t.falling ||
                  v.forEach(function (t) {
                    var e = Pt(f, Tt(f, h), t[0], Tt(t[1], t[0]));
                    if (e && !Ot(e, f) && At(e, f, h) && At(e, t[0], t[1])) {
                      var n = Ct(f, e);
                      n < d &&
                        ((d = n), (p = e), (b = D(jt(t[0], t[1]))), (g = !1));
                    }
                  }),
                t.done ||
                  t.falling ||
                  yt.forEach(function (t) {
                    var e = R(t, 3),
                      r = e[0],
                      i = e[1],
                      a = e[2];
                    if (!(a <= 0)) {
                      var s = N(r, i),
                        c = O(
                          {
                            x: s.x - n,
                            y: s.y - n,
                            w: s.w + 2 * n,
                            h: s.h + 2 * n,
                          },
                          f,
                          u,
                          o
                        );
                      if (c) {
                        var l = s.x,
                          v = s.y,
                          m = s.w,
                          y = s.h,
                          w = [
                            [l, v],
                            [l + m, v],
                            [l + m, v + y],
                            [l, v + y],
                          ],
                          x = [
                            [
                              [l, v - n],
                              [l + m, v - n],
                            ],
                            [
                              [l + m + n, v],
                              [l + m + n, v + y],
                            ],
                            [
                              [l + m, v + y + n],
                              [l, v + y + n],
                            ],
                            [
                              [l - n, v + y],
                              [l - n, v],
                            ],
                          ];
                        x.forEach(function (e) {
                          var n = Pt(f, Tt(f, h), e[0], Tt(e[1], e[0]));
                          if (
                            n &&
                            !Ot(n, f) &&
                            At(n, f, h) &&
                            At(n, e[0], e[1])
                          ) {
                            var r = Ct(f, n);
                            r < d &&
                              ((d = r),
                              (p = n),
                              (b = D(jt(e[0], e[1]))),
                              (g = t));
                          }
                        }),
                          w.forEach(function (e) {
                            var r = I(f, h, e, n);
                            if (r) {
                              var i = R(r, 2),
                                o = i[0],
                                a = i[1],
                                s = Ct(o, f),
                                c = Ct(a, f);
                              At(o, f, h) &&
                                s < d &&
                                !Ot(o, f) &&
                                ((d = s), (p = o), (b = D(Tt(o, e))), (g = t)),
                                At(a, f, h) &&
                                  c < d &&
                                  !Ot(a, f) &&
                                  ((d = c), (p = a), (b = D(Tt(a, e))), (g = t));
                            }
                          });
                      }
                    }
                  }),
                wt.forEach(function (e) {
                  var n = R(e, 3),
                    r = n[0],
                    i = n[1],
                    o = n[2],
                    a = N(r, i),
                    s = a.cx,
                    c = a.cy,
                    l = t.r + 30;
                  if (Ct([t.x, t.y], [s, c]) < l * l)
                    if ((wt.delete(e), "ball" === o)) {
                      ft.push("ball");
                      ((Math.random() - 0.5) * Math.PI * 1) / 16 +
                        Math.atan2(t.vy, t.vx);
                      st.push({
                        x: s,
                        y: c,
                        vx: 0,
                        vy: dt,
                        r: pt,
                        falling: !0,
                        type: "ball",
                      }),
                        j({
                          x: s,
                          y: c,
                          lifetime: 0.3,
                          r: 10,
                          vr: 200,
                          type: "circle",
                          fade: !0,
                          color: vt,
                        });
                    } else
                      "laser" === o &&
                        (ft.push("laser"),
                        st.push({
                          x: s,
                          y: c,
                          vx: 0,
                          vy: dt,
                          r: pt,
                          falling: !0,
                          type: "laser",
                        }));
                }),
                p)
              ) {
                var m = It(Tt(h, f), b),
                  y = Mt(D(Tt(Tt(h, f), Mt(b, 2 * m))), r);
                if (
                  ((t.x = p[0]),
                  (t.y = p[1]),
                  (t.vx = y[0]),
                  (t.vy = y[1]),
                  (o -= Lt(p, f)),
                  g)
                ) {
                  var w = 1;
                  for (g.hit = !0, s = 0; s < w; s++) {
                    var x = Mt(
                      D(Tt(Tt(h, f), Mt(b, (1 + Math.random()) * m))),
                      r * Math.random()
                    );
                    j({
                      vx: x[0],
                      vy: x[1],
                      vr: 100,
                      f: 0.1,
                      x: p[0],
                      y: p[1],
                      r: 1,
                      lifetime: Math.random(),
                      color:
                        "rgba(" + (0, V.default)("progress", g[2] / 125) + ",1)",
                    }),
                      g[2]--;
                  }
                  if ((L(w), g[2] <= 0))
                    for (s = 0; s < 10; s++) {
                      var k = N.apply(void 0, i(g)),
                        S = k.cx,
                        E = k.cy,
                        A = 2 * Math.random() * Math.PI,
                        T = Math.random();
                      j({
                        vx: 1e3 * Math.cos(A) * T,
                        vy: 1e3 * Math.sin(A) * T,
                        vr: 100,
                        f: 0.1,
                        x: S,
                        y: E,
                        r: 1,
                        lifetime: Math.random(),
                        color: "#ddd",
                      });
                    }
                }
              } else (t.x = h[0]), (t.y = h[1]), (o = 0);
              lt.push([f, [t.x, t.y]]);
            };
          o > 0;
  
        ) {
          var s, s;
          a();
        }
      }
      function j(t) {
        ct.push(
          Object.assign(
            {
              ax: 0,
              ay: 0,
              ar: 0,
              vx: 0,
              vy: 0,
              vr: 0,
              f: 0,
              x: canvas.width / 2,
              y: canvas.height / 2,
              r: 10,
              lifetime: 1,
            },
            t
          )
        );
      }
      function I(t, e, n, r) {
        var i = R(n, 2),
          o = i[0],
          a = i[1],
          s = R(t, 2),
          c = s[0],
          l = s[1],
          u = R(e, 2),
          f = u[0],
          h = u[1],
          d = f - c,
          p = h - l,
          g = d * d + p * p,
          b = d * (o - c) + p * (a - l),
          v =
            4 * b * b -
            4 *
              g *
              (o * o - 2 * o * c + a * a - 2 * a * l - r * r + c * c + l * l);
        if (v < 0) return !1;
        var m = d * o - d * c + p * a - p * l,
          y = Math.sqrt(v),
          w = (y / 2 + m) / g,
          x = (-y / 2 + m) / g;
        return [
          [c + w * d, l + w * p],
          [c + x * d, l + x * p],
        ];
      }
      function O(t, e, n, r) {
        var i = R(e, 2),
          o = i[0],
          a = i[1],
          s = R(n, 2),
          c = s[0],
          l = s[1],
          u = (t.x - o) * c,
          f = (t.x + t.w - o) * c,
          h = Math.min(u, f),
          d = Math.max(u, f),
          p = (t.y - a) * l,
          g = (t.y + t.h - a) * l;
        return (
          (h = Math.max(h, Math.min(p, g))),
          (d = Math.min(d, Math.max(p, g))),
          d > Math.max(h, 0) && h < r
        );
      }
      function D(t) {
        var e = R(t, 2),
          n = e[0],
          r = e[1],
          i = Math.sqrt(n * n + r * r);
        return [n / i, r / i];
      }
      function N(t, e) {
        var n = canvas.width / bt,
          r = F() / gt;
        return {
          w: n,
          h: r,
          x: n * e,
          y: r * t,
          cx: n * (e + 0.5),
          cy: r * (t + 0.5),
        };
      }
      function F() {
        return canvas.height - 30;
      }
      var R = (function () {
          function t(t, e) {
            var n = [],
              r = !0,
              i = !1,
              o = void 0;
            try {
              for (
                var a, s = t[Symbol.iterator]();
                !(r = (a = s.next()).done) &&
                (n.push(a.value), !e || n.length !== e);
                r = !0
              );
            } catch (t) {
              (i = !0), (o = t);
            } finally {
              try {
                !r && s.return && s.return();
              } finally {
                if (i) throw o;
              }
            }
            return n;
          }
          return function (e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        B = n(1),
        _ = r(B),
        q = n(6),
        U = r(q);
      n(23);
      var Q = n(12),
        W = n(10),
        V = r(W),
        K = n(2),
        H = r(K),
        z = n(7),
        X = r(z);
      n(24);
      var Y = n(9),
        G = r(Y),
        J = new G.default(database),
        $ = void 0,
        Z = void 0,
        tt = void 0,
        et = void 0,
        nt = void 0,
        rt = void 0,
        it = { x: 0, y: 0 },
        ot = void 0,
        at = void 0,
        st = void 0,
        ct = void 0,
        lt = void 0,
        ut = void 0,
        ft = void 0,
        ht = void 0,
        dt = void 0,
        pt = 10,
        gt = (Math.PI / 12, 10),
        bt = 10,
        vt = "#48f",
        mt = "#691c7e",
        yt = [],
        wt = new Set(),
        xt = 0;
      document
        .getElementById("canvas-wrap")
        .addEventListener("mousemove", function (t) {
          if ("aiming" === nt || "levelup" == nt) {
            var e = canvas.getBoundingClientRect();
            it = { x: 2 * (t.clientX - e.left), y: 2 * (t.clientY - e.top) };
          }
        }),
        document
          .getElementById("canvas-wrap")
          .addEventListener("keypress", c, !0),
        document.getElementById("canvas-wrap").addEventListener("click", u, !0),
        document
          .getElementById("canvas-wrap")
          .addEventListener("touchmove", l, !0),
        document
          .getElementById("canvas-wrap")
          .addEventListener("touchend", u, !0),
        document.addEventListener(
          "touchstart",
          function (t) {
            t.target === canvas &&
              (console.log("preventing scroll"), t.preventDefault());
          },
          { passive: !1 }
        ),
        end_button.addEventListener("click", function (t) {
          st.filter(function (t) {
            return !t.falling && !t.done && !t.gathered;
          }).forEach(function (t) {
            (t.vx = 0), (t.vy = dt), (t.falling = !0);
          });
        });
      var kt = document.querySelector(".compose input"),
        St =
          localStorage.username ||
          "anon_" + Math.floor(1e3 + 1e3 * Math.random());
      (kt.value = St),
        J.join(St),
        kt.addEventListener("change", function (t) {
          try {
            localStorage.username = t.target.value;
          } catch (t) {
            console.warn(t);
          }
        }),
        document
          .querySelector(".compose textarea")
          .addEventListener("keypress", function (t) {
            (t.target.value = t.target.value.slice(0, 2e3)),
              console.log(X.default),
              "Enter" !== t.key ||
                t.shiftKey ||
                "" === t.target.value.trim() ||
                (t.preventDefault(),
                X.default.push({
                  message: t.target.value,
                  username: kt.value,
                  score: et,
                  timestamp: _.default.database.ServerValue.TIMESTAMP,
                }),
                (t.target.value = ""));
          }),
        J.onUpdated(function (t) {
          document.querySelector(".online").innerText = t + " online";
        });
      var Et = function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          e = pt,
          n = ot || canvas.width / 2,
          r = F() - e,
          i = it.x - n,
          o = it.y - r,
          a = Math.atan2(-o, i) + t;
        a < -Math.PI / 2 && (a = Math.PI);
        var s = (canvas.width * (bt - 1)) / bt / 2,
          c = Math.atan2(canvas.height / gt, -s),
          l = Math.atan2(canvas.height / gt, s);
        return (a = Math.min(Math.max(l, a), c));
      };
      window.swal = U.default;
      var At = function (t, e, n) {
          var r = R(t, 2),
            i = r[0],
            o = r[1],
            a = R(e, 2),
            s = a[0],
            c = a[1],
            l = R(n, 2),
            u = l[0],
            f = l[1];
          return (
            i >= Math.min(s, u) &&
            i <= Math.max(s, u) &&
            o >= Math.min(c, f) &&
            o <= Math.max(c, f)
          );
        },
        Tt = function (t, e) {
          var n = R(t, 2),
            r = n[0],
            i = n[1],
            o = R(e, 2),
            a = o[0],
            s = o[1];
          return [r - a, i - s];
        },
        Mt = function (t, e) {
          var n = R(t, 2),
            r = n[0],
            i = n[1];
          return [r * e, i * e];
        },
        Ct = function (t, e) {
          var n = Tt(t, e),
            r = R(n, 2),
            i = r[0],
            o = r[1];
          return i * i + o * o;
        },
        Lt = function (t, e) {
          return Math.sqrt(Ct(t, e));
        },
        Pt = function (t, e, n, r) {
          var i = R(t, 2),
            o = i[0],
            a = i[1],
            s = R(e, 2),
            c = s[0],
            l = s[1],
            u = R(n, 2),
            f = u[0],
            h = u[1],
            d = R(r, 2),
            p = d[0],
            g = d[1],
            b = p * l - g * c;
          if (0 === b) return !1;
          var v = (c * (h - a) + l * (o - f)) / b;
          return [f + v * p, h + v * g];
        },
        jt = function (t, e) {
          var n = R(t, 2),
            r = n[0],
            i = n[1],
            o = R(e, 2),
            a = o[0],
            s = o[1];
          return [s - i, r - a];
        },
        It = function (t, e) {
          var n = R(t, 2),
            r = n[0],
            i = n[1],
            o = R(e, 2),
            a = o[0],
            s = o[1];
          return r * a + i * s;
        },
        Ot = function (t, e) {
          var n = R(t, 2),
            r = n[0],
            i = n[1],
            o = R(e, 2),
            a = o[0],
            s = o[1];
          return Math.abs(r - a) < 1e-8 && Math.abs(i - s) < 1e-8;
        },
        Dt = void 0;
      ($ = canvas.getContext("2d")),
        (Z = document.getElementById("score")),
        (tt = document.getElementById("record"));
      try {
        tt.innerHTML = (+(localStorage.pr || 0)).toLocaleString();
      } catch (t) {}
      o(),
        requestAnimationFrame(function (t) {
          (Dt = t), requestAnimationFrame(s);
        });
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function i(t) {
        var e = document.createElement("div");
        return e.appendChild(document.createTextNode(t)), e.innerHTML;
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.updateScoreFeed = e.weeklyScores = void 0);
      var o = n(2),
        a = r(o),
        s = n(6),
        c = r(s),
        l = function (t) {
          a.default
            .orderByChild("score")
            .limitToLast(100)
            .once("value", function (e) {
              t(e);
            });
        },
        u = (e.weeklyScores = void 0);
      a.default.limitToLast(200).once("value", function (t) {
        var n = {};
        t.forEach(function (t) {
          var e = t.val();
          (!n[e.username] || n[e.username].score < e.score) &&
            (n[e.username] = e);
        }),
          (e.weeklyScores = u =
            Object.values(n)
              .sort(function (t, e) {
                return e.score - t.score;
              })
              .filter(function (t) {
                return t.score > 1e3;
              })
              .slice(0, 30)),
          f();
      });
      var f = (e.updateScoreFeed = function () {
        var t =
            "\n      <div class='week-scores'>\n        <div>High Scores</div>\n        <div>This Week</div>\n      </div>\n      " +
            u
              .map(function (t, e) {
                var n = t.username,
                  r = t.score;
                return (
                  "\n      <div>\n      <div class='score-place'><span>#" +
                  (e + 1) +
                  " Weekly</span></div>\n        <div><b>" +
                  i(n.slice(0, 60)) +
                  "</b></div>\n        <div>" +
                  (+i(r)).toLocaleString() +
                  "</div>\n      </div>\n    "
                );
              })
              .join(""),
          e = document.querySelector(".scores-marquee");
        (e.innerHTML = t + t), e.classList.add("marquee");
      });
      document
        .querySelector(".scores-marquee")
        .addEventListener("click", function () {
          var t =
            '<div style="overflow: scroll; max-height: 300px">\n      <table id="scoreTable" style="width: 100%;">\n        <tbody>\n          <tr>\n            <th align="left" style="width: 10%;">Place</th>\n            <th align="center" style="width: 50%;">Username</th>\n            <th align="center" style="width: 40%;">Score</th>\n          </tr>\n          ' +
            u
              .map(function (t, e) {
                var n = t.username,
                  r = t.score;
                return (
                  '<tr>\n            <td align="center" style="width: 10%; padding: 5px;">' +
                  (e + 1) +
                  '</td>\n            <td align="center" style="width: 50%; padding: 5px;">' +
                  i(n.slice(0, 60)) +
                  '</td>\n            <td align="center" style="width: 40%; padding: 5px;">' +
                  (+i(r)).toLocaleString() +
                  "</td>\n          </tr>"
                );
              })
              .join("") +
            "\n        </tbody>\n      </table>\n    </div>";
          (0, c.default)({ title: "Wallsmash Weekly Top Scores", html: t });
        }),
        document
          .getElementById("scoreboardButton")
          .addEventListener("click", function () {
            return l(function (t) {
              var e = [];
              t.forEach(function (t) {
                e = [t.val()].concat(e);
              }),
                console.log(e);
              var n =
                '<div style="overflow: scroll; max-height: 300px">\n      <table id="scoreTable" style="width: 100%;">\n        <tbody>\n          <tr>\n            <th align="left" style="width: 10%;">Place</th>\n            <th align="center" style="width: 50%;">Username</th>\n            <th align="center" style="width: 40%;">Score</th>\n          </tr>\n          ' +
                e
                  .map(function (t, e) {
                    var n = t.username,
                      r = t.score;
                    return (
                      '<tr>\n            <td align="center" style="width: 10%; padding: 5px;">' +
                      (e + 1) +
                      '</td>\n            <td align="center" style="width: 50%; padding: 5px;">' +
                      i(n) +
                      '</td>\n            <td align="center" style="width: 40%; padding: 5px;">' +
                      (+i(r)).toLocaleString() +
                      "</td>\n          </tr>"
                    );
                  })
                  .join("") +
                "\n        </tbody>\n      </table>\n    </div>";
              (0, c.default)({ title: "Wallsmash All Time Top Scores", html: n });
            });
          });
    },
    function (t, e, n) {
      (e = t.exports = n(3)()),
        e.push([
          t.id,
          'body.swal2-shown{overflow-y:hidden}.swal2-container,body.swal2-iosfix{position:fixed;left:0;right:0}.swal2-container{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;top:0;bottom:0;padding:10px;background-color:transparent;z-index:1060}.swal2-container.swal2-fade{-webkit-transition:background-color .1s;transition:background-color .1s}.swal2-container.swal2-shown{background-color:rgba(0,0,0,.4)}.swal2-modal{background-color:#fff;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;border-radius:5px;-webkit-box-sizing:border-box;box-sizing:border-box;text-align:center;margin:auto;overflow-x:hidden;overflow-y:auto;display:none;position:relative;max-width:100%}.swal2-modal:focus{outline:none}.swal2-modal.swal2-loading{overflow-y:hidden}.swal2-modal .swal2-title{color:#595959;font-size:30px;text-align:center;font-weight:600;text-transform:none;position:relative;margin:0 0 .4em;padding:0;display:block;word-wrap:break-word}.swal2-modal .swal2-buttonswrapper{margin-top:15px}.swal2-modal .swal2-buttonswrapper:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4;cursor:no-drop}.swal2-modal .swal2-buttonswrapper.swal2-loading .swal2-styled.swal2-confirm{-webkit-box-sizing:border-box;box-sizing:border-box;border:4px solid transparent;border-color:transparent;width:40px;height:40px;padding:0;margin:7.5px;vertical-align:top;background-color:transparent!important;color:transparent;cursor:default;border-radius:100%;-webkit-animation:rotate-loading 1.5s linear 0s infinite normal;animation:rotate-loading 1.5s linear 0s infinite normal;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-modal .swal2-buttonswrapper.swal2-loading .swal2-styled.swal2-cancel{margin-left:30px;margin-right:30px}.swal2-modal .swal2-buttonswrapper.swal2-loading :not(.swal2-styled).swal2-confirm:after{display:inline-block;content:"";margin-left:5px 0 15px;vertical-align:-1px;height:15px;width:15px;border:3px solid #999;-webkit-box-shadow:1px 1px 1px #fff;box-shadow:1px 1px 1px #fff;border-right-color:transparent;border-radius:50%;-webkit-animation:rotate-loading 1.5s linear 0s infinite normal;animation:rotate-loading 1.5s linear 0s infinite normal}.swal2-modal .swal2-styled{border:0;border-radius:3px;-webkit-box-shadow:none;box-shadow:none;color:#fff;cursor:pointer;font-size:17px;font-weight:500;margin:15px 5px 0;padding:10px 32px}.swal2-modal .swal2-image{margin:20px auto;max-width:100%}.swal2-modal .swal2-close{background:transparent;border:0;margin:0;padding:0;width:38px;height:40px;font-size:36px;line-height:40px;font-family:serif;position:absolute;top:5px;right:8px;cursor:pointer;color:#ccc;-webkit-transition:color .1s ease;transition:color .1s ease}.swal2-modal .swal2-close:hover{color:#d55}.swal2-modal>.swal2-checkbox,.swal2-modal>.swal2-file,.swal2-modal>.swal2-input,.swal2-modal>.swal2-radio,.swal2-modal>.swal2-select,.swal2-modal>.swal2-textarea{display:none}.swal2-modal .swal2-content{font-size:18px;text-align:center;font-weight:300;position:relative;float:none;margin:0;padding:0;line-height:normal;color:#545454;word-wrap:break-word}.swal2-modal .swal2-checkbox,.swal2-modal .swal2-file,.swal2-modal .swal2-input,.swal2-modal .swal2-radio,.swal2-modal .swal2-select,.swal2-modal .swal2-textarea{margin:20px auto}.swal2-modal .swal2-file,.swal2-modal .swal2-input,.swal2-modal .swal2-textarea{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:18px;border-radius:3px;border:1px solid #d9d9d9;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.06);box-shadow:inset 0 1px 1px rgba(0,0,0,.06);-webkit-transition:border-color box-shadow .3s;transition:border-color box-shadow .3s}.swal2-modal .swal2-file.swal2-inputerror,.swal2-modal .swal2-input.swal2-inputerror,.swal2-modal .swal2-textarea.swal2-inputerror{border-color:#f27474!important;-webkit-box-shadow:0 0 2px #f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-modal .swal2-file:focus,.swal2-modal .swal2-input:focus,.swal2-modal .swal2-textarea:focus{outline:none;border:1px solid #b4dbed;-webkit-box-shadow:0 0 3px #c4e6f5;box-shadow:0 0 3px #c4e6f5}.swal2-modal .swal2-file:focus::-webkit-input-placeholder,.swal2-modal .swal2-input:focus::-webkit-input-placeholder,.swal2-modal .swal2-textarea:focus::-webkit-input-placeholder{-webkit-transition:opacity .3s ease .03s;transition:opacity .3s ease .03s;opacity:.8}.swal2-modal .swal2-file:focus:-ms-input-placeholder,.swal2-modal .swal2-input:focus:-ms-input-placeholder,.swal2-modal .swal2-textarea:focus:-ms-input-placeholder{-webkit-transition:opacity .3s ease .03s;transition:opacity .3s ease .03s;opacity:.8}.swal2-modal .swal2-file:focus::placeholder,.swal2-modal .swal2-input:focus::placeholder,.swal2-modal .swal2-textarea:focus::placeholder{-webkit-transition:opacity .3s ease .03s;transition:opacity .3s ease .03s;opacity:.8}.swal2-modal .swal2-file::-webkit-input-placeholder,.swal2-modal .swal2-input::-webkit-input-placeholder,.swal2-modal .swal2-textarea::-webkit-input-placeholder{color:#e6e6e6}.swal2-modal .swal2-file:-ms-input-placeholder,.swal2-modal .swal2-input:-ms-input-placeholder,.swal2-modal .swal2-textarea:-ms-input-placeholder{color:#e6e6e6}.swal2-modal .swal2-file::placeholder,.swal2-modal .swal2-input::placeholder,.swal2-modal .swal2-textarea::placeholder{color:#e6e6e6}.swal2-modal .swal2-range input{float:left;width:80%}.swal2-modal .swal2-range output{float:right;width:20%;font-size:20px;font-weight:600;text-align:center}.swal2-modal .swal2-range input,.swal2-modal .swal2-range output{height:43px;line-height:43px;vertical-align:middle;margin:20px auto;padding:0}.swal2-modal .swal2-input{height:43px;padding:0 12px}.swal2-modal .swal2-input[type=number]{max-width:150px}.swal2-modal .swal2-file{font-size:20px}.swal2-modal .swal2-textarea{height:108px;padding:12px}.swal2-modal .swal2-select{color:#545454;font-size:inherit;padding:5px 10px;min-width:40%;max-width:100%}.swal2-modal .swal2-radio{border:0}.swal2-modal .swal2-radio label:not(:first-child){margin-left:20px}.swal2-modal .swal2-radio input,.swal2-modal .swal2-radio span{vertical-align:middle}.swal2-modal .swal2-radio input{margin:0 3px 0 0}.swal2-modal .swal2-checkbox{color:#545454}.swal2-modal .swal2-checkbox input,.swal2-modal .swal2-checkbox span{vertical-align:middle}.swal2-modal .swal2-validationerror{background-color:#f0f0f0;margin:0 -20px;overflow:hidden;padding:10px;color:gray;font-size:16px;font-weight:300;display:none}.swal2-modal .swal2-validationerror:before{content:"!";display:inline-block;width:24px;height:24px;border-radius:50%;background-color:#ea7d7d;color:#fff;line-height:24px;text-align:center;margin-right:10px}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.swal2-range input{width:100%!important}.swal2-range output{display:none}}.swal2-icon{width:80px;height:80px;border:4px solid transparent;border-radius:50%;margin:20px auto 30px;padding:0;position:relative;-webkit-box-sizing:content-box;box-sizing:content-box;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon.swal2-error{border-color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;display:block}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}.swal2-icon.swal2-warning{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#f8bb86;border-color:#facea8}.swal2-icon.swal2-info,.swal2-icon.swal2-warning{font-size:60px;line-height:80px;text-align:center}.swal2-icon.swal2-info{font-family:Open Sans,sans-serif;color:#3fc3ee;border-color:#9de0f6}.swal2-icon.swal2-question{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#87adbd;border-color:#c9dae1;font-size:60px;line-height:80px;text-align:center}.swal2-icon.swal2-success{border-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{border-radius:50%;position:absolute;width:60px;height:120px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px}.swal2-icon.swal2-success .swal2-success-ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;-webkit-box-sizing:content-box;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal2-icon.swal2-success .swal2-success-fix{width:7px;height:90px;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-progresssteps{font-weight:600;margin:0 0 20px;padding:0}.swal2-progresssteps li{display:inline-block;position:relative}.swal2-progresssteps .swal2-progresscircle{background:#3085d6;border-radius:2em;color:#fff;height:2em;line-height:2em;text-align:center;width:2em;z-index:20}.swal2-progresssteps .swal2-progresscircle:first-child{margin-left:0}.swal2-progresssteps .swal2-progresscircle:last-child{margin-right:0}.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep{background:#3085d6}.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep~.swal2-progresscircle,.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep~.swal2-progressline{background:#add8e6}.swal2-progresssteps .swal2-progressline{background:#3085d6;height:.4em;margin:0 -1px;z-index:10}[class^=swal2]{-webkit-tap-highlight-color:transparent}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes hideSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@keyframes hideSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}to{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}.swal2-show{-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s}.swal2-show.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-hide{-webkit-animation:hideSweetAlert .15s forwards;animation:hideSweetAlert .15s forwards}.swal2-hide.swal2-noanimation{-webkit-animation:none;animation:none}@-webkit-keyframes animate-success-tip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animate-success-tip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animate-success-long{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animate-success-long{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}.swal2-animate-success-line-tip{-webkit-animation:animate-success-tip .75s;animation:animate-success-tip .75s}.swal2-animate-success-line-long{-webkit-animation:animate-success-long .75s;animation:animate-success-long .75s}.swal2-success.swal2-animate-success-icon .swal2-success-circular-line-right{-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}@-webkit-keyframes animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}.swal2-animate-error-icon{-webkit-animation:animate-error-icon .5s;animation:animate-error-icon .5s}@-webkit-keyframes animate-x-mark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animate-x-mark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal2-animate-x-mark{-webkit-animation:animate-x-mark .5s;animation:animate-x-mark .5s}@-webkit-keyframes rotate-loading{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes rotate-loading{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}',
          "",
        ]);
    },
    function (t, e, n) {
      (e = t.exports = n(3)()),
        e.push([
          t.id,
          "*{box-sizing:border-box}body,html{margin:0;height:100%;font-family:avenir}h1,h2,p{margin:0;padding:0}h1{padding:2% 0 0}h2{padding:0 0 2%;color:gray;font-size:75%;text-transform:uppercase;letter-spacing:2.5px}.game{display:flex;flex-direction:column;height:100%}.skip{position:absolute;bottom:0;right:0}#canvas-wrap{position:relative;flex:1;display:flex;overflow:hidden}#canvas{width:100%;flex:1;outline:none}#header{background:#333;display:flex;align-items:center;justify-content:space-between;height:75px}#header.hidden{display:none}#headerLeft{display:flex;flex-direction:row;align-items:center;justify-content:center}#title{font-size:200%;font-weight:700;padding:7px 10px;margin-bottom:-10px}#title svg{display:block}#scoreboardButton{padding:0 10px;cursor:pointer}#scoreTable{max-height:300px;overflow:scroll}.chrome{background:#444;color:#ccc}.spacer{flex:1}.week-scores{width:300px;flex-shrink:0;display:flex;justify-content:center;align-items:center;flex-direction:column}.scores-marquee-wrap{flex:1;overflow:hidden;height:100%;position:relative}.marquee{animation:marquee 100s linear infinite;display:flex;gap:10px;padding-left:10px;white-space:nowrap;align-items:center;height:100%;position:absolute}.scores-marquee:hover{animation-play-state:paused}.score-place span{font-size:80%;background:#222;border-radius:3px;padding:0 5px}@keyframes marquee{0%{transform:translateX(0)}to{transform:translateX(-50%)}}.button{background:hsla(0,0%,100%,.13);padding:0 10px;cursor:pointer;margin-right:10px}#score-wrap{padding-left:10px}#scoreInfo{display:flex;align-items:center}#score{font-size:150%;padding-left:5px;padding-right:10px}#username{border:0;background:#5c5c5c;outline:none;color:inherit;font-size:inherit;font-family:inherit;padding:0}.gold{color:#ff0}table tr:nth-child(2n) td{background-color:#d3d3d3}#path0_fill{fill:hsla(0,0%,100%,.8)}#end_button{opacity:0;transition:.2s}#end_button,#scoreboardButton{user-select:none;text-align:center}.achievements{position:absolute;right:0;bottom:0;padding:10px;color:hsla(0,0%,100%,.8);display:flex;flex-direction:column;align-items:flex-end}.achievements b{color:#fff}.achievements>div{height:0;margin:0;transition:.2s}.achievements .achievement{background:#333;box-shadow:0 0 10px rgba(0,0,0,.3);margin-top:10px;padding:5px 10px;border-radius:3px;height:auto}.achievements:hover{opacity:.5}.canvas-chat-wrap{flex:1}.canvas-chat-wrap,.chat{display:flex;overflow:hidden}.chat{background:#333;width:250px;max-width:30%;font-size:12px;flex-direction:column}@media(max-width:600px){#chat_toggle,.chat{display:none}}.chat.hidden{display:none}.chat:hover{opacity:1}.messages{flex:1;overflow:auto}.message-item{display:flex;gap:10px;padding:10px;align-items:flex-start;color:#ccc;border-top:1px solid #444;overflow:auto}.achievement{padding:0 10px;color:#ccc;overflow:auto}.achievement.diamond{background:#3782b8;color:#d4f9ff}.achievement.gold{background:#c4a50a;color:#fff199}.achievement.silver{background:#59646c;color:#ddd}.achievement.bronze{background:#814e02;color:#ffb54a}.achievement.personal_record{background:#2b523c;color:#b2cbbd}.achievement.weekly_record{background:#000;color:#ffaff1}.message-spacer{height:4px;background-color:#111}.username{font-weight:700;position:sticky;top:10px}.name{max-width:150px;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;white-space:nowrap}.time{opacity:.8}.score,.time{font-size:8px}.score{display:inline-block;background:#000;padding:2px 5px;border-radius:3px;margin-bottom:2px}.online{background:#444;color:#ccc;padding:2px 10px}.compose{background:#444;display:flex;flex-direction:column}.compose input{border:0;border-top-left-radius:3px;border-top-right-radius:3px}.compose input,.compose textarea{background-color:#333;color:#ccc;outline:none;padding:5px 10px;font:inherit}.compose textarea{border:0;border-top:1px solid #444;border-bottom-left-radius:3px;border-bottom-right-radius:3px;height:100px}",
          "",
        ]);
    },
    function (t, e) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
      "use strict";
      function n(t) {
        return r(void 0, t);
      }
      function r(t, e) {
        if (!(e instanceof Object)) return e;
        switch (e.constructor) {
          case Date:
            return new Date(e.getTime());
          case Object:
            void 0 === t && (t = {});
            break;
          case Array:
            t = [];
            break;
          default:
            return e;
        }
        for (var n in e) e.hasOwnProperty(n) && (t[n] = r(t[n], e[n]));
        return t;
      }
      function i(t, e, n) {
        t[e] = n;
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.deepCopy = n),
        (e.deepExtend = r),
        (e.patchProperty = i);
    },
    function (t, e) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
      "use strict";
      function n(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function r(t) {
        var e = a;
        return (a = t), e;
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.patchCapture = r;
      var o = "FirebaseError",
        a = Error.captureStackTrace,
        s = (e.FirebaseError = function t(e, r) {
          if ((n(this, t), (this.code = e), (this.message = r), a))
            a(this, c.prototype.create);
          else {
            var i = Error.apply(this, arguments);
            (this.name = o),
              Object.defineProperty(this, "stack", {
                get: function () {
                  return i.stack;
                },
              });
          }
        });
      (s.prototype = Object.create(Error.prototype)),
        (s.prototype.constructor = s),
        (s.prototype.name = o);
      var c = (e.ErrorFactory = (function () {
        function t(e, r, i) {
          n(this, t),
            (this.service = e),
            (this.serviceName = r),
            (this.errors = i),
            (this.pattern = /\{\$([^}]+)}/g);
        }
        return (
          i(t, [
            {
              key: "create",
              value: function (t, e) {
                void 0 === e && (e = {});
                var n = this.errors[t],
                  r = this.service + "/" + t,
                  i = void 0;
                (i =
                  void 0 === n
                    ? "Error"
                    : n.replace(this.pattern, function (t, n) {
                        var r = e[n];
                        return void 0 !== r ? r.toString() : "<" + n + "?>";
                      })),
                  (i = this.serviceName + ": " + i + " (" + r + ").");
                var o = new s(r, i);
                for (var a in e)
                  e.hasOwnProperty(a) && "_" !== a.slice(-1) && (o[a] = e[a]);
                return o;
              },
            },
          ]),
          t
        );
      })());
    },
    function (t, e, n) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
      "use strict";
      function r(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function i() {
        function t(t) {
          return (t = t || d), f(a, t) || o("no-app", { name: t }), a[t];
        }
        function e() {
          return Object.keys(a).map(function (t) {
            return a[t];
          });
        }
        function n(t, e) {
          Object.keys(p).forEach(function (n) {
            var i = r(t, n);
            null !== i && b[i] && b[i](e, t);
          });
        }
        function r(t, e) {
          return "serverAuth" === e ? null : (t.options, e);
        }
        var a = {},
          p = {},
          b = {},
          v = {
            __esModule: !0,
            initializeApp: function (t, e) {
              void 0 === e
                ? (e = d)
                : ("string" == typeof e && "" !== e) ||
                  o("bad-app-name", { name: e + "" }),
                f(a, e) && o("duplicate-app", { name: e });
              var r = new g(t, e, v);
              return (a[e] = r), n(r, "create"), r;
            },
            app: t,
            apps: null,
            Promise: h,
            SDK_VERSION: "4.1.3",
            INTERNAL: {
              registerService: function (n, r, i, a, s) {
                p[n] && o("duplicate-service", { name: n }),
                  (p[n] = r),
                  a &&
                    ((b[n] = a),
                    e().forEach(function (t) {
                      a("create", t);
                    }));
                var c = function () {
                  var e =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : t();
                  return (
                    "function" != typeof e[n] &&
                      o("invalid-app-argument", { name: n }),
                    e[n]()
                  );
                };
                return (
                  void 0 !== i && (0, u.deepExtend)(c, i),
                  (v[n] = c),
                  (g.prototype[n] = function () {
                    for (
                      var t = this._getService.bind(this, n),
                        e = arguments.length,
                        r = Array(e),
                        i = 0;
                      i < e;
                      i++
                    )
                      r[i] = arguments[i];
                    return t.apply(this, s ? r : []);
                  }),
                  c
                );
              },
              createFirebaseNamespace: i,
              extendNamespace: function (t) {
                (0, u.deepExtend)(v, t);
              },
              createSubscribe: s.createSubscribe,
              ErrorFactory: c.ErrorFactory,
              removeApp: function (t) {
                var e = a[t];
                n(e, "delete"), delete a[t];
              },
              factories: p,
              useAsService: r,
              Promise: l.local.GoogPromise,
              deepExtend: u.deepExtend,
            },
          };
        return (
          (0, u.patchProperty)(v, "default", v),
          Object.defineProperty(v, "apps", { get: e }),
          (0, u.patchProperty)(t, "App", g),
          v
        );
      }
      function o(t, e) {
        throw v.create(t, e);
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var a = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.createFirebaseNamespace = i;
      var s = n(18),
        c = n(16),
        l = n(4),
        u = n(15),
        f = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        },
        h = l.local.Promise,
        d = "[DEFAULT]",
        p = [],
        g = (function () {
          function t(e, n, i) {
            r(this, t),
              (this.firebase_ = i),
              (this.isDeleted_ = !1),
              (this.services_ = {}),
              (this.name_ = n),
              (this.options_ = (0, u.deepCopy)(e)),
              (this.INTERNAL = {
                getUid: function () {
                  return null;
                },
                getToken: function () {
                  return h.resolve(null);
                },
                addAuthTokenListener: function (t) {
                  p.push(t),
                    setTimeout(function () {
                      return t(null);
                    }, 0);
                },
                removeAuthTokenListener: function (t) {
                  p = p.filter(function (e) {
                    return e !== t;
                  });
                },
              });
          }
          return (
            a(t, [
              {
                key: "delete",
                value: function () {
                  var t = this;
                  return new h(function (e) {
                    t.checkDestroyed_(), e();
                  })
                    .then(function () {
                      t.firebase_.INTERNAL.removeApp(t.name_);
                      var e = [];
                      return (
                        Object.keys(t.services_).forEach(function (n) {
                          Object.keys(t.services_[n]).forEach(function (r) {
                            e.push(t.services_[n][r]);
                          });
                        }),
                        h.all(
                          e.map(function (t) {
                            return t.INTERNAL.delete();
                          })
                        )
                      );
                    })
                    .then(function () {
                      (t.isDeleted_ = !0), (t.services_ = {});
                    });
                },
              },
              {
                key: "_getService",
                value: function (t) {
                  var e =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : d;
                  if (
                    (this.checkDestroyed_(),
                    this.services_[t] || (this.services_[t] = {}),
                    !this.services_[t][e])
                  ) {
                    var n = e !== d ? e : void 0,
                      r = this.firebase_.INTERNAL.factories[t](
                        this,
                        this.extendApp.bind(this),
                        n
                      );
                    this.services_[t][e] = r;
                  }
                  return this.services_[t][e];
                },
              },
              {
                key: "extendApp",
                value: function (t) {
                  var e = this;
                  (0, u.deepExtend)(this, t),
                    t.INTERNAL &&
                      t.INTERNAL.addAuthTokenListener &&
                      (p.forEach(function (t) {
                        e.INTERNAL.addAuthTokenListener(t);
                      }),
                      (p = []));
                },
              },
              {
                key: "checkDestroyed_",
                value: function () {
                  this.isDeleted_ && o("app-deleted", { name: this.name_ });
                },
              },
              {
                key: "name",
                get: function () {
                  return this.checkDestroyed_(), this.name_;
                },
              },
              {
                key: "options",
                get: function () {
                  return this.checkDestroyed_(), this.options_;
                },
              },
            ]),
            t
          );
        })();
      (g.prototype.name && g.prototype.options) ||
        g.prototype.delete ||
        console.log("dc");
      var b = {
          "no-app":
            "No Firebase App '{$name}' has been created - call Firebase App.initializeApp()",
          "bad-app-name": "Illegal App name: '{$name}",
          "duplicate-app": "Firebase App named '{$name}' already exists",
          "app-deleted": "Firebase App named '{$name}' already deleted",
          "duplicate-service":
            "Firebase service named '{$name}' already registered",
          "sa-not-supported":
            "Initializing the Firebase SDK with a service account is only allowed in a Node.js environment. On client devices, you should instead initialize the SDK with an api key and auth domain",
          "invalid-app-argument":
            "firebase.{$name}() takes either no argument or a Firebase App instance.",
        },
        v = new c.ErrorFactory("app", "Firebase", b);
    },
    function (t, e, n) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/ */
      "use strict";
      function r(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function i(t, e) {
        var n = new h(t, e);
        return n.subscribe.bind(n);
      }
      function o(t, e) {
        return function () {
          for (var n = arguments.length, r = Array(n), i = 0; i < n; i++)
            r[i] = arguments[i];
          f.resolve(!0)
            .then(function () {
              t.apply(void 0, r);
            })
            .catch(function (t) {
              e && e(t);
            });
        };
      }
      function a(t, e) {
        if (
          "object" !== ("undefined" == typeof t ? "undefined" : c(t)) ||
          null === t
        )
          return !1;
        var n = !0,
          r = !1,
          i = void 0;
        try {
          for (
            var o, a = e[Symbol.iterator]();
            !(n = (o = a.next()).done);
            n = !0
          ) {
            var s = o.value;
            if (s in t && "function" == typeof t[s]) return !0;
          }
        } catch (t) {
          (r = !0), (i = t);
        } finally {
          try {
            !n && a.return && a.return();
          } finally {
            if (r) throw i;
          }
        }
        return !1;
      }
      function s() {}
      Object.defineProperty(e, "__esModule", { value: !0 });
      var c =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              },
        l = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })();
      (e.createSubscribe = i), (e.async = o);
      var u = n(4),
        f = u.local.Promise,
        h = (function () {
          function t(e, n) {
            var i = this;
            r(this, t),
              (this.observers = []),
              (this.unsubscribes = []),
              (this.observerCount = 0),
              (this.task = f.resolve()),
              (this.finalized = !1),
              (this.onNoObservers = n),
              this.task
                .then(function () {
                  e(i);
                })
                .catch(function (t) {
                  i.error(t);
                });
          }
          return (
            l(t, [
              {
                key: "next",
                value: function (t) {
                  this.forEachObserver(function (e) {
                    e.next(t);
                  });
                },
              },
              {
                key: "error",
                value: function (t) {
                  this.forEachObserver(function (e) {
                    e.error(t);
                  }),
                    this.close(t);
                },
              },
              {
                key: "complete",
                value: function () {
                  this.forEachObserver(function (t) {
                    t.complete();
                  }),
                    this.close();
                },
              },
              {
                key: "subscribe",
                value: function (t, e, n) {
                  var r = this,
                    i = void 0;
                  if (void 0 === t && void 0 === e && void 0 === n)
                    throw new Error("Missing Observer.");
                  (i = a(t, ["next", "error", "complete"])
                    ? t
                    : { next: t, error: e, complete: n }),
                    void 0 === i.next && (i.next = s),
                    void 0 === i.error && (i.error = s),
                    void 0 === i.complete && (i.complete = s);
                  var o = this.unsubscribeOne.bind(this, this.observers.length);
                  return (
                    this.finalized &&
                      this.task.then(function () {
                        try {
                          r.finalError ? i.error(r.finalError) : i.complete();
                        } catch (t) {}
                      }),
                    this.observers.push(i),
                    o
                  );
                },
              },
              {
                key: "unsubscribeOne",
                value: function (t) {
                  void 0 !== this.observers &&
                    void 0 !== this.observers[t] &&
                    (delete this.observers[t],
                    (this.observerCount -= 1),
                    0 === this.observerCount &&
                      void 0 !== this.onNoObservers &&
                      this.onNoObservers(this));
                },
              },
              {
                key: "forEachObserver",
                value: function (t) {
                  if (!this.finalized)
                    for (var e = 0; e < this.observers.length; e++)
                      this.sendOne(e, t);
                },
              },
              {
                key: "sendOne",
                value: function (t, e) {
                  var n = this;
                  this.task.then(function () {
                    if (void 0 !== n.observers && void 0 !== n.observers[t])
                      try {
                        e(n.observers[t]);
                      } catch (t) {
                        "undefined" != typeof console &&
                          console.error &&
                          console.error(t);
                      }
                  });
                },
              },
              {
                key: "close",
                value: function (t) {
                  var e = this;
                  this.finalized ||
                    ((this.finalized = !0),
                    void 0 !== t && (this.finalError = t),
                    this.task.then(function () {
                      (e.observers = void 0), (e.onNoObservers = void 0);
                    }));
                },
              },
            ]),
            t
          );
        })();
    },
    function (module, exports, __webpack_require__) {
      /*! @license Firebase v4.1.3
      Build: rev-1234895
      Terms: https://firebase.google.com/terms/
      
      ---
      
      typedarray.js
      Copyright (c) 2010, Linden Research, Inc.
      
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      
      The above copyright notice and this permission notice shall be included in
      all copies or substantial portions of the Software.
      
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
      THE SOFTWARE. */
      !(function () {
        function n(t) {
          return void 0 !== t;
        }
        function ba() {}
        function ca(t) {
          t.Vb = function () {
            return t.Ye ? t.Ye : (t.Ye = new t());
          };
        }
        function da(t) {
          var e = typeof t;
          if ("object" == e) {
            if (!t) return "null";
            if (t instanceof Array) return "array";
            if (t instanceof Object) return e;
            var n = Object.prototype.toString.call(t);
            if ("[object Window]" == n) return "object";
            if (
              "[object Array]" == n ||
              ("number" == typeof t.length &&
                "undefined" != typeof t.splice &&
                "undefined" != typeof t.propertyIsEnumerable &&
                !t.propertyIsEnumerable("splice"))
            )
              return "array";
            if (
              "[object Function]" == n ||
              ("undefined" != typeof t.call &&
                "undefined" != typeof t.propertyIsEnumerable &&
                !t.propertyIsEnumerable("call"))
            )
              return "function";
          } else if ("function" == e && "undefined" == typeof t.call)
            return "object";
          return e;
        }
        function ea(t) {
          return "array" == da(t);
        }
        function fa(t) {
          var e = da(t);
          return "array" == e || ("object" == e && "number" == typeof t.length);
        }
        function p(t) {
          return "string" == typeof t;
        }
        function ga(t) {
          return "number" == typeof t;
        }
        function ha(t) {
          return "function" == da(t);
        }
        function ia(t) {
          var e = typeof t;
          return ("object" == e && null != t) || "function" == e;
        }
        function ja(t, e, n) {
          return t.call.apply(t.bind, arguments);
        }
        function ka(t, e, n) {
          if (!t) throw Error();
          if (2 < arguments.length) {
            var r = Array.prototype.slice.call(arguments, 2);
            return function () {
              var n = Array.prototype.slice.call(arguments);
              return Array.prototype.unshift.apply(n, r), t.apply(e, n);
            };
          }
          return function () {
            return t.apply(e, arguments);
          };
        }
        function q(t, e, n) {
          return (
            (q =
              Function.prototype.bind &&
              -1 != Function.prototype.bind.toString().indexOf("native code")
                ? ja
                : ka),
            q.apply(null, arguments)
          );
        }
        function la(t, e) {
          function n() {}
          (n.prototype = e.prototype),
            (t.wg = e.prototype),
            (t.prototype = new n()),
            (t.prototype.constructor = t),
            (t.sg = function (t, n, r) {
              for (
                var i = Array(arguments.length - 2), o = 2;
                o < arguments.length;
                o++
              )
                i[o - 2] = arguments[o];
              return e.prototype[n].apply(t, i);
            });
        }
        function ma(a) {
          if (
            ((a = String(a)),
            /^\s*$/.test(a)
              ? 0
              : /^[\],:{}\s\u2028\u2029]*$/.test(
                  a
                    .replace(/\\["\\\/bfnrtu]/g, "@")
                    .replace(
                      /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                      "]"
                    )
                    .replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")
                ))
          )
            try {
              return eval("(" + a + ")");
            } catch (t) {}
          throw Error("Invalid JSON string: " + a);
        }
        function na() {
          this.Fd = void 0;
        }
        function oa(t, e, n) {
          switch (typeof e) {
            case "string":
              pa(e, n);
              break;
            case "number":
              n.push(isFinite(e) && !isNaN(e) ? e : "null");
              break;
            case "boolean":
              n.push(e);
              break;
            case "undefined":
              n.push("null");
              break;
            case "object":
              if (null == e) {
                n.push("null");
                break;
              }
              if (ea(e)) {
                var r = e.length;
                n.push("[");
                for (var i = "", o = 0; o < r; o++)
                  n.push(i),
                    (i = e[o]),
                    oa(t, t.Fd ? t.Fd.call(e, String(o), i) : i, n),
                    (i = ",");
                n.push("]");
                break;
              }
              n.push("{"), (r = "");
              for (o in e)
                Object.prototype.hasOwnProperty.call(e, o) &&
                  ((i = e[o]),
                  "function" != typeof i &&
                    (n.push(r),
                    pa(o, n),
                    n.push(":"),
                    oa(t, t.Fd ? t.Fd.call(e, o, i) : i, n),
                    (r = ",")));
              n.push("}");
              break;
            case "function":
              break;
            default:
              throw Error("Unknown type: " + typeof e);
          }
        }
        function pa(t, e) {
          e.push(
            '"',
            t.replace(ra, function (t) {
              if (t in qa) return qa[t];
              var e = t.charCodeAt(0),
                n = "\\u";
              return (
                16 > e
                  ? (n += "000")
                  : 256 > e
                  ? (n += "00")
                  : 4096 > e && (n += "0"),
                (qa[t] = n + e.toString(16))
              );
            }),
            '"'
          );
        }
        function sa() {
          this.Wa = -1;
        }
        function ta() {
          (this.Wa = -1),
            (this.Wa = 64),
            (this.M = []),
            (this.Wd = []),
            (this.Af = []),
            (this.zd = []),
            (this.zd[0] = 128);
          for (var t = 1; t < this.Wa; ++t) this.zd[t] = 0;
          (this.Pd = this.$b = 0), this.reset();
        }
        function ua(t, e, n) {
          n || (n = 0);
          var r = t.Af;
          if (p(e))
            for (var i = 0; 16 > i; i++)
              (r[i] =
                (e.charCodeAt(n) << 24) |
                (e.charCodeAt(n + 1) << 16) |
                (e.charCodeAt(n + 2) << 8) |
                e.charCodeAt(n + 3)),
                (n += 4);
          else
            for (i = 0; 16 > i; i++)
              (r[i] =
                (e[n] << 24) | (e[n + 1] << 16) | (e[n + 2] << 8) | e[n + 3]),
                (n += 4);
          for (i = 16; 80 > i; i++) {
            var o = r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16];
            r[i] = 4294967295 & ((o << 1) | (o >>> 31));
          }
          (e = t.M[0]), (n = t.M[1]);
          for (var a, s = t.M[2], c = t.M[3], l = t.M[4], i = 0; 80 > i; i++)
            40 > i
              ? 20 > i
                ? ((o = c ^ (n & (s ^ c))), (a = 1518500249))
                : ((o = n ^ s ^ c), (a = 1859775393))
              : 60 > i
              ? ((o = (n & s) | (c & (n | s))), (a = 2400959708))
              : ((o = n ^ s ^ c), (a = 3395469782)),
              (o = (((e << 5) | (e >>> 27)) + o + l + a + r[i]) & 4294967295),
              (l = c),
              (c = s),
              (s = 4294967295 & ((n << 30) | (n >>> 2))),
              (n = e),
              (e = o);
          (t.M[0] = (t.M[0] + e) & 4294967295),
            (t.M[1] = (t.M[1] + n) & 4294967295),
            (t.M[2] = (t.M[2] + s) & 4294967295),
            (t.M[3] = (t.M[3] + c) & 4294967295),
            (t.M[4] = (t.M[4] + l) & 4294967295);
        }
        function Da(t, e) {
          var n = Ea(t, e, void 0);
          return 0 > n ? null : p(t) ? t.charAt(n) : t[n];
        }
        function Ea(t, e, n) {
          for (var r = t.length, i = p(t) ? t.split("") : t, o = 0; o < r; o++)
            if (o in i && e.call(n, i[o], o, t)) return o;
          return -1;
        }
        function Fa(e, n) {
          var r = xa(e, n);
          0 <= r && t.splice.call(e, r, 1);
        }
        function Ga(e, n, r) {
          return 2 >= arguments.length
            ? t.slice.call(e, n)
            : t.slice.call(e, n, r);
        }
        function Ha(t, e) {
          t.sort(e || Ia);
        }
        function Ia(t, e) {
          return t > e ? 1 : t < e ? -1 : 0;
        }
        function v(t, e) {
          for (var n in t) e.call(void 0, t[n], n, t);
        }
        function Ja(t, e) {
          var n,
            r = {};
          for (n in t) r[n] = e.call(void 0, t[n], n, t);
          return r;
        }
        function Ka(t, e) {
          for (var n in t) if (!e.call(void 0, t[n], n, t)) return !1;
          return !0;
        }
        function La(t) {
          var e,
            n = 0;
          for (e in t) n++;
          return n;
        }
        function Ma(t) {
          for (var e in t) return e;
        }
        function Na(t) {
          var e,
            n = [],
            r = 0;
          for (e in t) n[r++] = t[e];
          return n;
        }
        function Oa(t) {
          var e,
            n = [],
            r = 0;
          for (e in t) n[r++] = e;
          return n;
        }
        function Pa(t, e) {
          for (var n in t) if (t[n] == e) return !0;
          return !1;
        }
        function Qa(t, e, n) {
          for (var r in t) if (e.call(n, t[r], r, t)) return r;
        }
        function Ra(t, e) {
          var n = Qa(t, e, void 0);
          return n && t[n];
        }
        function Sa(t) {
          for (var e in t) return !1;
          return !0;
        }
        function Ta(t) {
          var e,
            n = {};
          for (e in t) n[e] = t[e];
          return n;
        }
        function ab(t, e) {
          if (!fa(t))
            throw Error("encodeByteArray takes an array as a parameter");
          bb();
          for (var n = e ? Za : Ya, r = [], i = 0; i < t.length; i += 3) {
            var o = t[i],
              a = i + 1 < t.length,
              s = a ? t[i + 1] : 0,
              c = i + 2 < t.length,
              l = c ? t[i + 2] : 0,
              u = o >> 2,
              o = ((3 & o) << 4) | (s >> 4),
              s = ((15 & s) << 2) | (l >> 6),
              l = 63 & l;
            c || ((l = 64), a || (s = 64)), r.push(n[u], n[o], n[s], n[l]);
          }
          return r.join("");
        }
        function bb() {
          if (!Ya) {
            (Ya = {}), (Za = {}), ($a = {});
            for (var t = 0; 65 > t; t++)
              (Ya[t] =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
                  t
                )),
                (Za[t] =
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(
                    t
                  )),
                ($a[Za[t]] = t),
                62 <= t &&
                  ($a[
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
                      t
                    )
                  ] = t);
          }
        }
        function cb(t, e) {
          if (!t) throw db(e);
        }
        function db(t) {
          return Error(
            "Firebase Database (" +
              firebase.SDK_VERSION +
              ") INTERNAL ASSERT FAILED: " +
              t
          );
        }
        function eb(t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }
        function w(t, e) {
          if (Object.prototype.hasOwnProperty.call(t, e)) return t[e];
        }
        function fb(t, e) {
          for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
        }
        function gb(t) {
          var e = [];
          return (
            fb(t, function (t, n) {
              ea(n)
                ? ya(n, function (n) {
                    e.push(encodeURIComponent(t) + "=" + encodeURIComponent(n));
                  })
                : e.push(encodeURIComponent(t) + "=" + encodeURIComponent(n));
            }),
            e.length ? "&" + e.join("&") : ""
          );
        }
        function ib() {
          var t = this;
          (this.reject = this.resolve = null),
            (this.ra = new hb(function (e, n) {
              (t.resolve = e), (t.reject = n);
            }));
        }
        function jb(t, e) {
          return function (n, r) {
            n ? t.reject(n) : t.resolve(r),
              ha(e) && (kb(t.ra), 1 === e.length ? e(n) : e(n, r));
          };
        }
        function kb(t) {
          t.then(void 0, ba);
        }
        function lb(t) {
          return "undefined" != typeof JSON && n(JSON.parse)
            ? JSON.parse(t)
            : ma(t);
        }
        function x(t) {
          if ("undefined" != typeof JSON && n(JSON.stringify))
            t = JSON.stringify(t);
          else {
            var e = [];
            oa(new na(), t, e), (t = e.join(""));
          }
          return t;
        }
        function mb(t) {
          for (var e = [], n = 0, r = 0; r < t.length; r++) {
            var i = t.charCodeAt(r);
            55296 <= i &&
              56319 >= i &&
              ((i -= 55296),
              r++,
              cb(r < t.length, "Surrogate pair missing trail surrogate."),
              (i = 65536 + (i << 10) + (t.charCodeAt(r) - 56320))),
              128 > i
                ? (e[n++] = i)
                : (2048 > i
                    ? (e[n++] = (i >> 6) | 192)
                    : (65536 > i
                        ? (e[n++] = (i >> 12) | 224)
                        : ((e[n++] = (i >> 18) | 240),
                          (e[n++] = ((i >> 12) & 63) | 128)),
                      (e[n++] = ((i >> 6) & 63) | 128)),
                  (e[n++] = (63 & i) | 128));
          }
          return e;
        }
        function nb(t) {
          for (var e = 0, n = 0; n < t.length; n++) {
            var r = t.charCodeAt(n);
            128 > r
              ? e++
              : 2048 > r
              ? (e += 2)
              : 55296 <= r && 56319 >= r
              ? ((e += 4), n++)
              : (e += 3);
          }
          return e;
        }
        function y(t, e, n, r) {
          var i;
          if (
            (r < e
              ? (i = "at least " + e)
              : r > n && (i = 0 === n ? "none" : "no more than " + n),
            i)
          )
            throw Error(
              t +
                " failed: Was called with " +
                r +
                (1 === r ? " argument." : " arguments.") +
                " Expects " +
                i +
                "."
            );
        }
        function A(t, e, n) {
          var r = "";
          switch (e) {
            case 1:
              r = n ? "first" : "First";
              break;
            case 2:
              r = n ? "second" : "Second";
              break;
            case 3:
              r = n ? "third" : "Third";
              break;
            case 4:
              r = n ? "fourth" : "Fourth";
              break;
            default:
              throw Error(
                "errorPrefix called with argumentNumber > 4.  Need to update it?"
              );
          }
          return (t = t + " failed: " + (r + " argument "));
        }
        function B(t, e, r, i) {
          if ((!i || n(r)) && !ha(r))
            throw Error(A(t, e, i) + "must be a valid function.");
        }
        function ob(t, e, r) {
          if (n(r) && (!ia(r) || null === r))
            throw Error(A(t, e, !0) + "must be a valid context object.");
        }
        function pb() {
          return (
            "undefined" != typeof window &&
            !!(window.cordova || window.phonegap || window.PhoneGap) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(
              "undefined" != typeof navigator &&
                "string" == typeof navigator.userAgent
                ? navigator.userAgent
                : ""
            )
          );
        }
        function C(t, e) {
          (this.name = t), (this.R = e);
        }
        function qb(t, e) {
          return new C(t, e);
        }
        function rb(t, e) {
          return sb(t.name, e.name);
        }
        function tb(t, e) {
          return sb(t, e);
        }
        function ub(t) {
          (this.uc = t), (this.Cd = "firebase:");
        }
        function vb() {
          this.pc = {};
        }
        function wb(t) {
          try {
            if ("undefined" != typeof window && "undefined" != typeof window[t]) {
              var e = window[t];
              return (
                e.setItem("firebase:sentinel", "cache"),
                e.removeItem("firebase:sentinel"),
                new ub(e)
              );
            }
          } catch (t) {}
          return new vb();
        }
        function zb(t, e, n, r, i) {
          (this.host = t.toLowerCase()),
            (this.domain = this.host.substr(this.host.indexOf(".") + 1)),
            (this.Sc = e),
            (this.pe = n),
            (this.qg = r),
            (this.gf = i || ""),
            (this.$a = xb.get("host:" + t) || this.host);
        }
        function Ab(t, e) {
          e !== t.$a &&
            ((t.$a = e),
            "s-" === t.$a.substr(0, 2) && xb.set("host:" + t.host, t.$a));
        }
        function Bb(t, e, n) {
          if (
            (D("string" == typeof e, "typeof type must == string"),
            D("object" == typeof n, "typeof params must == object"),
            e === Cb)
          )
            e = (t.Sc ? "wss://" : "ws://") + t.$a + "/.ws?";
          else {
            if (e !== Db) throw Error("Unknown connection type: " + e);
            e = (t.Sc ? "https://" : "http://") + t.$a + "/.lp?";
          }
          t.host !== t.$a && (n.ns = t.pe);
          var r = [];
          return (
            v(n, function (t, e) {
              r.push(e + "=" + t);
            }),
            e + r.join("&")
          );
        }
        function Eb(t, e) {
          return t && "object" == typeof t
            ? (D(".sv" in t, "Unexpected leaf node or priority contents"),
              e[t[".sv"]])
            : t;
        }
        function Fb(t, e) {
          var n = new Gb();
          return (
            Hb(t, new E(""), function (t, r) {
              Ib(n, t, Jb(r, e));
            }),
            n
          );
        }
        function Jb(t, e) {
          var n,
            r = t.C().H(),
            r = Eb(r, e);
          if (t.J()) {
            var i = Eb(t.Ca(), e);
            return i !== t.Ca() || r !== t.C().H() ? new Kb(i, G(r)) : t;
          }
          return (
            (n = t),
            r !== t.C().H() && (n = n.fa(new Kb(r))),
            t.O(H, function (t, r) {
              var i = Jb(r, e);
              i !== r && (n = n.T(t, i));
            }),
            n
          );
        }
        function Nb(t) {
          try {
            var e;
            bb();
            for (var n = $a, r = [], i = 0; i < t.length; ) {
              var o = n[t.charAt(i++)],
                a = i < t.length ? n[t.charAt(i)] : 0;
              ++i;
              var s = i < t.length ? n[t.charAt(i)] : 64;
              ++i;
              var c = i < t.length ? n[t.charAt(i)] : 64;
              if ((++i, null == o || null == a || null == s || null == c))
                throw Error();
              r.push((o << 2) | (a >> 4)),
                64 != s &&
                  (r.push(((a << 4) & 240) | (s >> 2)),
                  64 != c && r.push(((s << 6) & 192) | c));
            }
            if (8192 > r.length) e = String.fromCharCode.apply(null, r);
            else {
              for (t = "", n = 0; n < r.length; n += 8192)
                t += String.fromCharCode.apply(null, Ga(r, n, n + 8192));
              e = t;
            }
            return e;
          } catch (t) {
            I("base64Decode failed: ", t);
          }
          return null;
        }
        function Ob(t) {
          var e = mb(t);
          (t = new ta()), t.update(e);
          var e = [],
            n = 8 * t.Pd;
          56 > t.$b
            ? t.update(t.zd, 56 - t.$b)
            : t.update(t.zd, t.Wa - (t.$b - 56));
          for (var r = t.Wa - 1; 56 <= r; r--) (t.Wd[r] = 255 & n), (n /= 256);
          for (ua(t, t.Wd), r = n = 0; 5 > r; r++)
            for (var i = 24; 0 <= i; i -= 8) (e[n] = (t.M[r] >> i) & 255), ++n;
          return ab(e);
        }
        function Pb(t) {
          for (var e = "", n = 0; n < arguments.length; n++)
            (e = fa(arguments[n])
              ? e + Pb.apply(null, arguments[n])
              : "object" == typeof arguments[n]
              ? e + x(arguments[n])
              : e + arguments[n]),
              (e += " ");
          return e;
        }
        function Sb(t, e) {
          cb(
            !e || !0 === t || !1 === t,
            "Can't turn on custom loggers persistently."
          ),
            !0 === t
              ? ("undefined" != typeof console &&
                  ("function" == typeof console.log
                    ? (Qb = q(console.log, console))
                    : "object" == typeof console.log &&
                      (Qb = function (t) {
                        console.log(t);
                      })),
                e && yb.set("logging_enabled", !0))
              : ha(t)
              ? (Qb = t)
              : ((Qb = null), yb.remove("logging_enabled"));
        }
        function I(t) {
          if (
            (!0 === Rb &&
              ((Rb = !1),
              null === Qb && !0 === yb.get("logging_enabled") && Sb(!0)),
            Qb)
          ) {
            var e = Pb.apply(null, arguments);
            Qb(e);
          }
        }
        function Tb(t) {
          return function () {
            I(t, arguments);
          };
        }
        function Ub(t) {
          if ("undefined" != typeof console) {
            var e = "FIREBASE INTERNAL ERROR: " + Pb.apply(null, arguments);
            "undefined" != typeof console.error
              ? console.error(e)
              : console.log(e);
          }
        }
        function Vb(t) {
          var e = Pb.apply(null, arguments);
          throw Error("FIREBASE FATAL ERROR: " + e);
        }
        function J(t) {
          if ("undefined" != typeof console) {
            var e = "FIREBASE WARNING: " + Pb.apply(null, arguments);
            "undefined" != typeof console.warn ? console.warn(e) : console.log(e);
          }
        }
        function Wb(t) {
          var e,
            n,
            r,
            i,
            o,
            a = t;
          if (((o = n = t = e = ""), (r = !0), (i = "https"), p(a))) {
            var s = a.indexOf("//");
            for (
              0 <= s && ((i = a.substring(0, s - 1)), (a = a.substring(s + 2))),
                s = a.indexOf("/"),
                -1 === s && (s = a.length),
                e = a.substring(0, s),
                o = "",
                a = a.substring(s).split("/"),
                s = 0;
              s < a.length;
              s++
            )
              if (0 < a[s].length) {
                var c = a[s];
                try {
                  c = decodeURIComponent(c.replace(/\+/g, " "));
                } catch (t) {}
                o += "/" + c;
              }
            (a = e.split(".")),
              3 === a.length
                ? ((t = a[1]), (n = a[0].toLowerCase()))
                : 2 === a.length && (t = a[0]),
              (s = e.indexOf(":")),
              0 <= s && (r = "https" === i || "wss" === i);
          }
          return (
            "firebase" === t &&
              Vb(
                e +
                  " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"
              ),
            (n && "undefined" != n) ||
              Vb(
                "Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"
              ),
            r ||
              ("undefined" != typeof window &&
                window.location &&
                window.location.protocol &&
                -1 !== window.location.protocol.indexOf("https:") &&
                J(
                  "Insecure Firebase access from a secure page. Please use https in calls to new Firebase()."
                )),
            { jc: new zb(e, r, n, "ws" === i || "wss" === i), path: new E(o) }
          );
        }
        function Xb(t) {
          return (
            ga(t) &&
            (t != t ||
              t == Number.POSITIVE_INFINITY ||
              t == Number.NEGATIVE_INFINITY)
          );
        }
        function Yb(t) {
          if ("complete" === document.readyState) t();
          else {
            var e = !1,
              n = function () {
                document.body
                  ? e || ((e = !0), t())
                  : setTimeout(n, Math.floor(10));
              };
            document.addEventListener
              ? (document.addEventListener("DOMContentLoaded", n, !1),
                window.addEventListener("load", n, !1))
              : document.attachEvent &&
                (document.attachEvent("onreadystatechange", function () {
                  "complete" === document.readyState && n();
                }),
                window.attachEvent("onload", n));
          }
        }
        function sb(t, e) {
          if (t === e) return 0;
          if ("[MIN_NAME]" === t || "[MAX_NAME]" === e) return -1;
          if ("[MIN_NAME]" === e || "[MAX_NAME]" === t) return 1;
          var n = Zb(t),
            r = Zb(e);
          return null !== n
            ? null !== r
              ? 0 == n - r
                ? t.length - e.length
                : n - r
              : -1
            : null !== r
            ? 1
            : t < e
            ? -1
            : 1;
        }
        function $b(t, e) {
          if (e && t in e) return e[t];
          throw Error("Missing required key (" + t + ") in object: " + x(e));
        }
        function ac(t) {
          if ("object" != typeof t || null === t) return x(t);
          var e,
            n = [];
          for (e in t) n.push(e);
          n.sort(), (e = "{");
          for (var r = 0; r < n.length; r++)
            0 !== r && (e += ","), (e += x(n[r])), (e += ":"), (e += ac(t[n[r]]));
          return e + "}";
        }
        function bc(t, e) {
          if (t.length <= e) return [t];
          for (var n = [], r = 0; r < t.length; r += e)
            r + e > t
              ? n.push(t.substring(r, t.length))
              : n.push(t.substring(r, r + e));
          return n;
        }
        function cc(t, e) {
          if (ea(t)) for (var n = 0; n < t.length; ++n) e(n, t[n]);
          else v(t, e);
        }
        function dc(t) {
          D(!Xb(t), "Invalid JSON number");
          var e, n, r, i;
          for (
            0 === t
              ? ((r = n = 0), (e = -(1 / 0) === 1 / t ? 1 : 0))
              : ((e = 0 > t),
                (t = Math.abs(t)),
                t >= Math.pow(2, -1022)
                  ? ((r = Math.min(Math.floor(Math.log(t) / Math.LN2), 1023)),
                    (n = r + 1023),
                    (r = Math.round(t * Math.pow(2, 52 - r) - Math.pow(2, 52))))
                  : ((n = 0), (r = Math.round(t / Math.pow(2, -1074))))),
              i = [],
              t = 52;
            t;
            --t
          )
            i.push(r % 2 ? 1 : 0), (r = Math.floor(r / 2));
          for (t = 11; t; --t) i.push(n % 2 ? 1 : 0), (n = Math.floor(n / 2));
          for (
            i.push(e ? 1 : 0), i.reverse(), e = i.join(""), n = "", t = 0;
            64 > t;
            t += 8
          )
            (r = parseInt(e.substr(t, 8), 2).toString(16)),
              1 === r.length && (r = "0" + r),
              (n += r);
          return n.toLowerCase();
        }
        function Zb(t) {
          return ec.test(t) &&
            ((t = Number(t)), -2147483648 <= t && 2147483647 >= t)
            ? t
            : null;
        }
        function fc(t) {
          try {
            t();
          } catch (t) {
            setTimeout(function () {
              throw (
                (J("Exception was thrown by user callback.", t.stack || ""), t)
              );
            }, Math.floor(0));
          }
        }
        function gc(t, e, n) {
          Object.defineProperty(t, e, { get: n });
        }
        function hc(t, e) {
          var n = setTimeout(t, e);
          return "object" == typeof n && n.unref && n.unref(), n;
        }
        function ic(t) {
          var e = {},
            n = {},
            r = {},
            i = "";
          try {
            var o = t.split("."),
              e = lb(Nb(o[0]) || ""),
              n = lb(Nb(o[1]) || ""),
              i = o[2],
              r = n.d || {};
            delete n.d;
          } catch (t) {}
          return { tg: e, Je: n, data: r, mg: i };
        }
        function jc(t) {
          t = ic(t);
          var e = t.Je;
          return !!t.mg && !!e && "object" == typeof e && e.hasOwnProperty("iat");
        }
        function kc(t) {
          return (t = ic(t).Je), "object" == typeof t && !0 === w(t, "admin");
        }
        function lc() {}
        function nc(t) {
          return q(t.compare, t);
        }
        function pc(t) {
          D(
            !t.e() && ".priority" !== K(t),
            "Can't create PathIndex with empty path or .priority key"
          ),
            (this.bc = t);
        }
        function rc() {}
        function sc() {}
        function uc() {}
        function xc(t, e) {
          (this.od = t), (this.cc = e);
        }
        function yc(t, e, n) {
          var r = Ja(t.od, function (r, i) {
            var o = w(t.cc, i);
            if ((D(o, "Missing index implementation for " + i), r === mc)) {
              if (o.xc(e.R)) {
                for (var a = [], s = n.Wb(qb), c = M(s); c; )
                  c.name != e.name && a.push(c), (c = M(s));
                return a.push(e), zc(a, nc(o));
              }
              return mc;
            }
            return (
              (o = n.get(e.name)),
              (a = r),
              o && (a = a.remove(new C(e.name, o))),
              a.Oa(e, e.R)
            );
          });
          return new xc(r, t.cc);
        }
        function Ac(t, e, n) {
          var r = Ja(t.od, function (t) {
            if (t === mc) return t;
            var r = n.get(e.name);
            return r ? t.remove(new C(e.name, r)) : t;
          });
          return new xc(r, t.cc);
        }
        function Kb(t, e) {
          (this.B = t),
            D(
              n(this.B) && null !== this.B,
              "LeafNode shouldn't be created with null/undefined value."
            ),
            (this.aa = e || L),
            Cc(this.aa),
            (this.Db = null);
        }
        function Gc() {
          this.set = {};
        }
        function Hc(t, e) {
          v(t.set, function (t, n) {
            e(n, t);
          });
        }
        function Ic(t) {
          D(ea(t) && 0 < t.length, "Requires a non-empty array"),
            (this.Bf = t),
            (this.Dc = {});
        }
        function Jc(t, e) {
          D(
            Da(t.Bf, function (t) {
              return t === e;
            }),
            "Unknown event: " + e
          );
        }
        function Lc() {
          if (
            (Ic.call(this, ["online"]),
            (this.hc = !0),
            "undefined" != typeof window &&
              "undefined" != typeof window.addEventListener &&
              !pb())
          ) {
            var t = this;
            window.addEventListener(
              "online",
              function () {
                t.hc || ((t.hc = !0), t.Ge("online", !0));
              },
              !1
            ),
              window.addEventListener(
                "offline",
                function () {
                  t.hc && ((t.hc = !1), t.Ge("online", !1));
                },
                !1
              );
          }
        }
        function Mc() {
          Ic.call(this, ["visible"]);
          var t, e;
          if (
            ("undefined" != typeof document &&
              "undefined" != typeof document.addEventListener &&
              ("undefined" != typeof document.hidden
                ? ((e = "visibilitychange"), (t = "hidden"))
                : "undefined" != typeof document.mozHidden
                ? ((e = "mozvisibilitychange"), (t = "mozHidden"))
                : "undefined" != typeof document.msHidden
                ? ((e = "msvisibilitychange"), (t = "msHidden"))
                : "undefined" != typeof document.webkitHidden &&
                  ((e = "webkitvisibilitychange"), (t = "webkitHidden"))),
            (this.Mb = !0),
            e)
          ) {
            var n = this;
            document.addEventListener(
              e,
              function () {
                var e = !document[t];
                e !== n.Mb && ((n.Mb = e), n.Ge("visible", e));
              },
              !1
            );
          }
        }
        function E(t, e) {
          if (1 == arguments.length) {
            this.o = t.split("/");
            for (var n = 0, r = 0; r < this.o.length; r++)
              0 < this.o[r].length && ((this.o[n] = this.o[r]), n++);
            (this.o.length = n), (this.Y = 0);
          } else (this.o = t), (this.Y = e);
        }
        function P(t, e) {
          var n = K(t);
          if (null === n) return e;
          if (n === K(e)) return P(N(t), N(e));
          throw Error(
            "INTERNAL ERROR: innerPath (" +
              e +
              ") is not within outerPath (" +
              t +
              ")"
          );
        }
        function Nc(t, e) {
          for (
            var n = t.slice(), r = e.slice(), i = 0;
            i < n.length && i < r.length;
            i++
          ) {
            var o = sb(n[i], r[i]);
            if (0 !== o) return o;
          }
          return n.length === r.length ? 0 : n.length < r.length ? -1 : 1;
        }
        function K(t) {
          return t.Y >= t.o.length ? null : t.o[t.Y];
        }
        function Ec(t) {
          return t.o.length - t.Y;
        }
        function N(t) {
          var e = t.Y;
          return e < t.o.length && e++, new E(t.o, e);
        }
        function Oc(t) {
          return t.Y < t.o.length ? t.o[t.o.length - 1] : null;
        }
        function Pc(t, e) {
          (this.Qa = t.slice()),
            (this.Ha = Math.max(1, this.Qa.length)),
            (this.Qe = e);
          for (var n = 0; n < this.Qa.length; n++) this.Ha += nb(this.Qa[n]);
          Qc(this);
        }
        function Qc(t) {
          if (768 < t.Ha)
            throw Error(
              t.Qe + "has a key path longer than 768 bytes (" + t.Ha + ")."
            );
          if (32 < t.Qa.length)
            throw Error(
              t.Qe +
                "path specified exceeds the maximum depth that can be written (32) or object contains a cycle " +
                Rc(t)
            );
        }
        function Rc(t) {
          return 0 == t.Qa.length ? "" : "in property '" + t.Qa.join(".") + "'";
        }
        function Sc() {
          (this.children = {}), (this.bd = 0), (this.value = null);
        }
        function Tc(t, e, n) {
          (this.ud = t ? t : ""),
            (this.Pc = e ? e : null),
            (this.A = n ? n : new Sc());
        }
        function Uc(t, e) {
          for (
            var n, r = e instanceof E ? e : new E(e), i = t;
            null !== (n = K(r));
  
          )
            (i = new Tc(n, i, w(i.A.children, n) || new Sc())), (r = N(r));
          return i;
        }
        function Vc(t, e) {
          D("undefined" != typeof e, "Cannot set value to undefined"),
            (t.A.value = e),
            Wc(t);
        }
        function Xc(t, e, n, r) {
          n && !r && e(t),
            t.O(function (t) {
              Xc(t, e, !0, r);
            }),
            n && r && e(t);
        }
        function Yc(t, e) {
          for (var n = t.parent(); null !== n && !e(n); ) n = n.parent();
        }
        function Wc(t) {
          if (null !== t.Pc) {
            var e = t.Pc,
              n = t.ud,
              r = t.e(),
              i = eb(e.A.children, n);
            r && i
              ? (delete e.A.children[n], e.A.bd--, Wc(e))
              : r || i || ((e.A.children[n] = t.A), e.A.bd++, Wc(e));
          }
        }
        function Zc(t, e) {
          (this.La = t), (this.ba = e ? e : $c);
        }
        function ad(t, e) {
          for (var n, r = t.ba, i = null; !r.e(); ) {
            if (((n = t.La(e, r.key)), 0 === n)) {
              if (r.left.e()) return i ? i.key : null;
              for (r = r.left; !r.right.e(); ) r = r.right;
              return r.key;
            }
            0 > n ? (r = r.left) : 0 < n && ((i = r), (r = r.right));
          }
          throw Error(
            "Attempted to find predecessor key for a nonexistent key.  What gives?"
          );
        }
        function bd(t, e, n, r, i) {
          for (this.Hd = i || null, this.le = r, this.Pa = [], i = 1; !t.e(); )
            if (((i = e ? n(t.key, e) : 1), r && (i *= -1), 0 > i))
              t = this.le ? t.left : t.right;
            else {
              if (0 === i) {
                this.Pa.push(t);
                break;
              }
              this.Pa.push(t), (t = this.le ? t.right : t.left);
            }
        }
        function M(t) {
          if (0 === t.Pa.length) return null;
          var e,
            n = t.Pa.pop();
          if (
            ((e = t.Hd ? t.Hd(n.key, n.value) : { key: n.key, value: n.value }),
            t.le)
          )
            for (n = n.left; !n.e(); ) t.Pa.push(n), (n = n.right);
          else for (n = n.right; !n.e(); ) t.Pa.push(n), (n = n.left);
          return e;
        }
        function cd(t) {
          if (0 === t.Pa.length) return null;
          var e;
          return (
            (e = t.Pa),
            (e = e[e.length - 1]),
            t.Hd ? t.Hd(e.key, e.value) : { key: e.key, value: e.value }
          );
        }
        function dd(t, e, n, r, i) {
          (this.key = t),
            (this.value = e),
            (this.color = null == n || n),
            (this.left = null != r ? r : $c),
            (this.right = null != i ? i : $c);
        }
        function ed(t) {
          return t.left.e() ? t : ed(t.left);
        }
        function hd(t) {
          return t.left.e()
            ? $c
            : (t.left.ea() || t.left.left.ea() || (t = id(t)),
              (t = t.X(null, null, null, hd(t.left), null)),
              gd(t));
        }
        function gd(t) {
          return (
            t.right.ea() && !t.left.ea() && (t = ld(t)),
            t.left.ea() && t.left.left.ea() && (t = jd(t)),
            t.left.ea() && t.right.ea() && (t = kd(t)),
            t
          );
        }
        function id(t) {
          return (
            (t = kd(t)),
            t.right.left.ea() &&
              ((t = t.X(null, null, null, null, jd(t.right))),
              (t = ld(t)),
              (t = kd(t))),
            t
          );
        }
        function ld(t) {
          return t.right.X(
            null,
            null,
            t.color,
            t.X(null, null, !0, null, t.right.left),
            null
          );
        }
        function jd(t) {
          return t.left.X(
            null,
            null,
            t.color,
            null,
            t.X(null, null, !0, t.left.right, null)
          );
        }
        function kd(t) {
          return t.X(
            null,
            null,
            !t.color,
            t.left.X(null, null, !t.left.color, null, null),
            t.right.X(null, null, !t.right.color, null, null)
          );
        }
        function md() {}
        function O(t, e, n) {
          (this.k = t),
            (this.aa = e) && Cc(this.aa),
            t.e() &&
              D(!this.aa || this.aa.e(), "An empty node cannot have a priority"),
            (this.yb = n),
            (this.Db = null);
        }
        function pd(t, e) {
          var n;
          return (
            (n = (n = od(t, e)) ? (n = n.Gc()) && n.name : t.k.Gc()),
            n ? new C(n, t.k.get(n)) : null
          );
        }
        function qd(t, e) {
          var n;
          return (
            (n = (n = od(t, e)) ? (n = n.ec()) && n.name : t.k.ec()),
            n ? new C(n, t.k.get(n)) : null
          );
        }
        function od(t, e) {
          return e === tc ? null : t.yb.get(e.toString());
        }
        function G(t, e) {
          if (null === t) return L;
          var n = null;
          if (
            ("object" == typeof t && ".priority" in t
              ? (n = t[".priority"])
              : "undefined" != typeof e && (n = e),
            D(
              null === n ||
                "string" == typeof n ||
                "number" == typeof n ||
                ("object" == typeof n && ".sv" in n),
              "Invalid priority type found: " + typeof n
            ),
            "object" == typeof t &&
              ".value" in t &&
              null !== t[".value"] &&
              (t = t[".value"]),
            "object" != typeof t || ".sv" in t)
          )
            return new Kb(t, G(n));
          if (t instanceof Array) {
            var r = L,
              i = t;
            return (
              v(i, function (t, e) {
                if (eb(i, e) && "." !== e.substring(0, 1)) {
                  var n = G(t);
                  (!n.J() && n.e()) || (r = r.T(e, n));
                }
              }),
              r.fa(G(n))
            );
          }
          var o = [],
            a = !1,
            s = t;
          if (
            (fb(s, function (t) {
              if ("string" != typeof t || "." !== t.substring(0, 1)) {
                var e = G(s[t]);
                e.e() || ((a = a || !e.C().e()), o.push(new C(t, e)));
              }
            }),
            0 == o.length)
          )
            return L;
          var c = zc(
            o,
            rb,
            function (t) {
              return t.name;
            },
            tb
          );
          if (a) {
            var l = zc(o, nc(H));
            return new O(c, G(n), new xc({ ".priority": l }, { ".priority": H }));
          }
          return new O(c, G(n), Bc);
        }
        function sd(t) {
          (this.count = parseInt(Math.log(t + 1) / rd, 10)),
            (this.Oe = this.count - 1),
            (this.Cf = (t + 1) & parseInt(Array(this.count + 1).join("1"), 2));
        }
        function td(t) {
          var e = !(t.Cf & (1 << t.Oe));
          return t.Oe--, e;
        }
        function zc(t, e, n, r) {
          function i(e, r) {
            var o = r - e;
            if (0 == o) return null;
            if (1 == o) {
              var a = t[e],
                s = n ? n(a) : a;
              return new dd(s, a.R, !1, null, null);
            }
            var a = parseInt(o / 2, 10) + e,
              o = i(e, a),
              c = i(a + 1, r),
              a = t[a],
              s = n ? n(a) : a;
            return new dd(s, a.R, !1, o, c);
          }
          t.sort(e);
          var o = (function (e) {
            function r(e, r) {
              var c = s - e,
                l = s;
              s -= e;
              var l = i(c + 1, l),
                c = t[c],
                u = n ? n(c) : c,
                l = new dd(u, c.R, r, null, l);
              o ? (o.left = l) : (a = l), (o = l);
            }
            for (var o = null, a = null, s = t.length, c = 0; c < e.count; ++c) {
              var l = td(e),
                u = Math.pow(2, e.count - (c + 1));
              l ? r(u, !1) : (r(u, !1), r(u, !0));
            }
            return a;
          })(new sd(t.length));
          return null !== o ? new Zc(r || e, o) : new Zc(r || e);
        }
        function Fc(t) {
          return "number" == typeof t ? "number:" + dc(t) : "string:" + t;
        }
        function Cc(t) {
          if (t.J()) {
            var e = t.H();
            D(
              "string" == typeof e ||
                "number" == typeof e ||
                ("object" == typeof e && eb(e, ".sv")),
              "Priority must be a string or number."
            );
          } else D(t === qc || t.e(), "priority of unexpected type.");
          D(
            t === qc || t.C().e(),
            "Priority nodes can't have a priority of their own."
          );
        }
        function ud() {
          O.call(this, new Zc(tb), L, Bc);
        }
        function vd(t, e) {
          (this.value = t), (this.children = e || wd);
        }
        function xd(t) {
          var e = R;
          return (
            v(t, function (t, n) {
              e = e.set(new E(n), t);
            }),
            e
          );
        }
        function yd(t, e, n) {
          if (null != t.value && n(t.value)) return { path: Q, value: t.value };
          if (e.e()) return null;
          var r = K(e);
          return (
            (t = t.children.get(r)),
            null !== t
              ? ((e = yd(t, N(e), n)),
                null != e ? { path: new E(r).n(e.path), value: e.value } : null)
              : null
          );
        }
        function zd(t, e) {
          return yd(t, e, function () {
            return !0;
          });
        }
        function Ad(t, e, n) {
          if (e.e()) return n;
          var r = K(e);
          return (
            (e = Ad(t.children.get(r) || R, N(e), n)),
            (r = e.e() ? t.children.remove(r) : t.children.Oa(r, e)),
            new vd(t.value, r)
          );
        }
        function Bd(t, e) {
          return Cd(t, Q, e);
        }
        function Cd(t, e, n) {
          var r = {};
          return (
            t.children.ha(function (t, i) {
              r[t] = Cd(i, e.n(t), n);
            }),
            n(e, t.value, r)
          );
        }
        function Dd(t, e, n) {
          return Ed(t, e, Q, n);
        }
        function Ed(t, e, n, r) {
          var i = !!t.value && r(n, t.value);
          return i
            ? i
            : e.e()
            ? null
            : ((i = K(e)),
              (t = t.children.get(i)) ? Ed(t, N(e), n.n(i), r) : null);
        }
        function Fd(t, e, n) {
          Gd(t, e, Q, n);
        }
        function Gd(t, e, n, r) {
          if (e.e()) return t;
          t.value && r(n, t.value);
          var i = K(e);
          return (t = t.children.get(i)) ? Gd(t, N(e), n.n(i), r) : R;
        }
        function Hd(t, e) {
          Id(t, Q, e);
        }
        function Id(t, e, n) {
          t.children.ha(function (t, r) {
            Id(r, e.n(t), n);
          }),
            t.value && n(e, t.value);
        }
        function Jd(t, e) {
          t.children.ha(function (t, n) {
            n.value && e(t, n.value);
          });
        }
        function Md(t) {
          return p(t) && 0 !== t.length && !Kd.test(t);
        }
        function Nd(t) {
          return (
            null === t || p(t) || (ga(t) && !Xb(t)) || (ia(t) && eb(t, ".sv"))
          );
        }
        function Od(t, e, r, i) {
          (i && !n(e)) || Pd(A(t, 1, i), e, r);
        }
        function Pd(t, e, r) {
          if ((r instanceof E && (r = new Pc(r, t)), !n(e)))
            throw Error(t + "contains undefined " + Rc(r));
          if (ha(e))
            throw Error(
              t +
                "contains a function " +
                Rc(r) +
                " with contents: " +
                e.toString()
            );
          if (Xb(e)) throw Error(t + "contains " + e.toString() + " " + Rc(r));
          if (p(e) && e.length > 10485760 / 3 && 10485760 < nb(e))
            throw Error(
              t +
                "contains a string greater than 10485760 utf8 bytes " +
                Rc(r) +
                " ('" +
                e.substring(0, 50) +
                "...')"
            );
          if (ia(e)) {
            var i = !1,
              o = !1;
            if (
              (fb(e, function (e, n) {
                if (".value" === e) i = !0;
                else if (".priority" !== e && ".sv" !== e && ((o = !0), !Md(e)))
                  throw Error(
                    t +
                      " contains an invalid key (" +
                      e +
                      ") " +
                      Rc(r) +
                      '.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"'
                  );
                r.push(e), Pd(t, n, r), r.pop();
              }),
              i && o)
            )
              throw Error(
                t +
                  ' contains ".value" child ' +
                  Rc(r) +
                  " in addition to actual children."
              );
          }
        }
        function Qd(t, e) {
          var n, r;
          for (n = 0; n < e.length; n++) {
            r = e[n];
            for (var i = r.slice(), o = 0; o < i.length; o++)
              if ((".priority" !== i[o] || o !== i.length - 1) && !Md(i[o]))
                throw Error(
                  t +
                    "contains an invalid key (" +
                    i[o] +
                    ") in path " +
                    r.toString() +
                    '. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"'
                );
          }
          for (e.sort(Nc), i = null, n = 0; n < e.length; n++) {
            if (((r = e[n]), null !== i && i.contains(r)))
              throw Error(
                t +
                  "contains a path " +
                  i.toString() +
                  " that is ancestor of another path " +
                  r.toString()
              );
            i = r;
          }
        }
        function Rd(t, e, n) {
          var r = A(t, 1, !1);
          if (!ia(e) || ea(e))
            throw Error(
              r + " must be an object containing the children to replace."
            );
          var i = [];
          fb(e, function (t, e) {
            var o = new E(t);
            if ((Pd(r, e, n.n(o)), ".priority" === Oc(o) && !Nd(e)))
              throw Error(
                r +
                  "contains an invalid value for '" +
                  o.toString() +
                  "', which must be a valid Firebase priority (a string, finite number, server value, or null)."
              );
            i.push(o);
          }),
            Qd(r, i);
        }
        function Sd(t, e, n) {
          if (Xb(n))
            throw Error(
              A(t, e, !1) +
                "is " +
                n.toString() +
                ", but must be a valid Firebase priority (a string, finite number, server value, or null)."
            );
          if (!Nd(n))
            throw Error(
              A(t, e, !1) +
                "must be a valid Firebase priority (a string, finite number, server value, or null)."
            );
        }
        function Td(t, e, r) {
          if (!r || n(e))
            switch (e) {
              case "value":
              case "child_added":
              case "child_removed":
              case "child_changed":
              case "child_moved":
                break;
              default:
                throw Error(
                  A(t, 1, r) +
                    'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".'
                );
            }
        }
        function Ud(t, e) {
          if (n(e) && !Md(e))
            throw Error(
              A(t, 2, !0) +
                'was an invalid key: "' +
                e +
                '".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").'
            );
        }
        function Vd(t, e) {
          if (!p(e) || 0 === e.length || Ld.test(e))
            throw Error(
              A(t, 1, !1) +
                'was an invalid path: "' +
                e +
                '". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"'
            );
        }
        function Wd(t, e) {
          if (".info" === K(e))
            throw Error(t + " failed: Can't modify data under /.info/");
        }
        function Xd(t, e) {
          var n,
            r = e.path.toString();
          if (
            (!(n = !p(e.jc.host) || 0 === e.jc.host.length || !Md(e.jc.pe)) &&
              (n = 0 !== r.length) &&
              (r && (r = r.replace(/^\/*\.info(\/|$)/, "/")),
              (n = !(p(r) && 0 !== r.length && !Ld.test(r)))),
            n)
          )
            throw Error(
              A(t, 1, !1) +
                'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".'
            );
        }
        function Gb() {
          this.k = this.B = null;
        }
        function Ib(t, e, n) {
          if (e.e()) (t.B = n), (t.k = null);
          else if (null !== t.B) t.B = t.B.F(e, n);
          else {
            null == t.k && (t.k = new Gc());
            var r = K(e);
            t.k.contains(r) || t.k.add(r, new Gb()),
              (t = t.k.get(r)),
              (e = N(e)),
              Ib(t, e, n);
          }
        }
        function Yd(t, e) {
          if (e.e()) return (t.B = null), (t.k = null), !0;
          if (null !== t.B) {
            if (t.B.J()) return !1;
            var n = t.B;
            return (
              (t.B = null),
              n.O(H, function (e, n) {
                Ib(t, new E(e), n);
              }),
              Yd(t, e)
            );
          }
          return (
            null === t.k ||
            ((n = K(e)),
            (e = N(e)),
            t.k.contains(n) && Yd(t.k.get(n), e) && t.k.remove(n),
            !!t.k.e() && ((t.k = null), !0))
          );
        }
        function Hb(t, e, n) {
          null !== t.B
            ? n(e, t.B)
            : t.O(function (t, r) {
                var i = new E(e.toString() + "/" + t);
                Hb(r, i, n);
              });
        }
        function Zd(t, e) {
          (this.type = $d), (this.source = t), (this.path = e);
        }
        function ae(t, e, n) {
          (this.type = be),
            (this.source = t),
            (this.path = e),
            (this.children = n);
        }
        function de(t, e, n) {
          (this.type = ee),
            (this.source = fe),
            (this.path = t),
            (this.Ob = e),
            (this.Id = n);
        }
        function ce(t, e, n) {
          (this.type = ge), (this.source = t), (this.path = e), (this.Ga = n);
        }
        function he(t, e, n, r) {
          (this.ee = t),
            (this.Se = e),
            (this.Hb = n),
            (this.Ee = r),
            D(!r || e, "Tagged queries must be from server.");
        }
        function je(t, e, n) {
          (this.A = t), (this.da = e), (this.Sb = n);
        }
        function ke(t) {
          return t.da;
        }
        function le(t) {
          return t.Sb;
        }
        function me(t, e) {
          return e.e() ? t.da && !t.Sb : ne(t, K(e));
        }
        function ne(t, e) {
          return (t.da && !t.Sb) || t.A.Da(e);
        }
        function oe(t, e) {
          (this.N = t), (this.Ld = e);
        }
        function pe(t, e, n, r) {
          return new oe(new je(e, n, r), t.Ld);
        }
        function qe(t) {
          return t.N.da ? t.N.j() : null;
        }
        function re(t) {
          return t.Ld.da ? t.Ld.j() : null;
        }
        function se() {}
        function ue(t, e, n) {
          (this.xf = t), (this.Ka = e), (this.yd = n);
        }
        function ve(t, e) {
          (this.Sd = t), (this.Df = e);
        }
        function we(t) {
          this.U = t;
        }
        function De(t, e, n, r, i, o) {
          var a = e.N;
          if (null != r.lc(n)) return e;
          var s;
          if (n.e())
            D(
              ke(e.w()),
              "If change path is empty, we must have complete server data"
            ),
              le(e.w())
                ? ((i = re(e)), (r = r.rc(i instanceof O ? i : L)))
                : (r = r.Aa(re(e))),
              (o = t.U.ya(e.N.j(), r, o));
          else {
            var c = K(n);
            if (".priority" == c)
              D(
                1 == Ec(n),
                "Can't have a priority with additional path components"
              ),
                (o = a.j()),
                (s = e.w().j()),
                (r = r.ad(n, o, s)),
                (o = null != r ? t.U.fa(o, r) : a.j());
            else {
              var l = N(n);
              ne(a, c)
                ? ((s = e.w().j()),
                  (r = r.ad(n, a.j(), s)),
                  (r = null != r ? a.j().Q(c).F(l, r) : a.j().Q(c)))
                : (r = r.qc(c, e.w())),
                (o = null != r ? t.U.F(a.j(), c, r, l, i, o) : a.j());
            }
          }
          return pe(e, o, a.da || n.e(), t.U.Na());
        }
        function ze(t, e, n, r, i, o, a, s) {
          var c = e.w();
          if (((a = a ? t.U : t.U.Ub()), n.e())) r = a.ya(c.j(), r, null);
          else if (a.Na() && !c.Sb)
            (r = c.j().F(n, r)), (r = a.ya(c.j(), r, null));
          else {
            var l = K(n);
            if (!me(c, n) && 1 < Ec(n)) return e;
            var u = N(n);
            (r = c.j().Q(l).F(u, r)),
              (r =
                ".priority" == l
                  ? a.fa(c.j(), r)
                  : a.F(c.j(), l, r, u, te, null));
          }
          return (
            (c = c.da || n.e()),
            (e = new oe(e.N, new je(r, c, a.Na()))),
            De(t, e, n, i, new ue(i, e, o), s)
          );
        }
        function ye(t, e, n, r, i, o, a) {
          var s = e.N;
          if (((i = new ue(i, e, o)), n.e()))
            (a = t.U.ya(e.N.j(), r, a)), (t = pe(e, a, !0, t.U.Na()));
          else if (((o = K(n)), ".priority" === o))
            (a = t.U.fa(e.N.j(), r)), (t = pe(e, a, s.da, s.Sb));
          else {
            n = N(n);
            var c = s.j().Q(o);
            if (!n.e()) {
              var l = i.Te(o);
              r =
                null != l
                  ? ".priority" === Oc(n) && l.P(n.parent()).e()
                    ? l
                    : l.F(n, r)
                  : L;
            }
            c.Z(r)
              ? (t = e)
              : ((a = t.U.F(s.j(), o, r, n, i, a)),
                (t = pe(e, a, s.da, t.U.Na())));
          }
          return t;
        }
        function Ae(t, e, n, r, i, o, a) {
          var s = e;
          return (
            Hd(r, function (r, c) {
              var l = n.n(r);
              ne(e.N, K(l)) && (s = ye(t, s, l, c, i, o, a));
            }),
            Hd(r, function (r, c) {
              var l = n.n(r);
              ne(e.N, K(l)) || (s = ye(t, s, l, c, i, o, a));
            }),
            s
          );
        }
        function Fe(t, e) {
          return (
            Hd(e, function (e, n) {
              t = t.F(e, n);
            }),
            t
          );
        }
        function Be(t, e, n, r, i, o, a, s) {
          if (e.w().j().e() && !ke(e.w())) return e;
          var c = e;
          n = n.e() ? r : Ad(R, n, r);
          var l = e.w().j();
          return (
            n.children.ha(function (n, r) {
              if (l.Da(n)) {
                var u = e.w().j().Q(n),
                  u = Fe(u, r);
                c = ze(t, c, new E(n), u, i, o, a, s);
              }
            }),
            n.children.ha(function (n, r) {
              var u = !ne(e.w(), n) && null == r.value;
              l.Da(n) ||
                u ||
                ((u = e.w().j().Q(n)),
                (u = Fe(u, r)),
                (c = ze(t, c, new E(n), u, i, o, a, s)));
            }),
            c
          );
        }
        function Ce(t, e, n, r, i, o, a) {
          if (null != i.lc(n)) return e;
          var s = le(e.w()),
            c = e.w();
          if (null != r.value) {
            if ((n.e() && c.da) || me(c, n))
              return ze(t, e, n, c.j().P(n), i, o, s, a);
            if (n.e()) {
              var l = R;
              return (
                c.j().O(tc, function (t, e) {
                  l = l.set(new E(t), e);
                }),
                Be(t, e, n, l, i, o, s, a)
              );
            }
            return e;
          }
          return (
            (l = R),
            Hd(r, function (t) {
              var e = n.n(t);
              me(c, e) && (l = l.set(t, c.j().P(e)));
            }),
            Be(t, e, n, l, i, o, s, a)
          );
        }
        function Ge(t) {
          (this.V = t), (this.g = t.m.g);
        }
        function He(t, e, n, r) {
          var i = [],
            o = [];
          return (
            ya(e, function (e) {
              e.type === Ie &&
                t.g.nd(e.qe, e.Ja) &&
                o.push(new S(Je, e.Ja, e.Xa));
            }),
            Ke(t, i, Le, e, r, n),
            Ke(t, i, Me, e, r, n),
            Ke(t, i, Je, o, r, n),
            Ke(t, i, Ie, e, r, n),
            Ke(t, i, Ne, e, r, n),
            i
          );
        }
        function Ke(t, e, n, r, i, o) {
          (r = za(r, function (t) {
            return t.type === n;
          })),
            Ha(r, q(t.Ff, t)),
            ya(r, function (n) {
              var r = Oe(t, n, o);
              ya(i, function (i) {
                i.nf(n.type) && e.push(i.createEvent(r, t.V));
              });
            });
        }
        function Oe(t, e, n) {
          return (
            "value" !== e.type &&
              "child_removed" !== e.type &&
              (e.Dd = n.Ve(e.Xa, e.Ja, t.g)),
            e
          );
        }
        function Pe(t, e) {
          this.V = t;
          var n = t.m,
            r = new Qe(n.g),
            n = T(n) ? new Qe(n.g) : n.xa ? new Re(n) : new Se(n);
          this.hf = new we(n);
          var i = e.w(),
            o = e.N,
            a = r.ya(L, i.j(), null),
            s = n.ya(L, o.j(), null);
          (this.Ka = new oe(new je(s, o.da, n.Na()), new je(a, i.da, r.Na()))),
            (this.Za = []),
            (this.Jf = new Ge(t));
        }
        function Te(t) {
          return t.V;
        }
        function Ve(t, e) {
          var n = t.Ka.N,
            r = [];
          return (
            n.j().J() ||
              n.j().O(H, function (t, e) {
                r.push(new S(Me, e, t));
              }),
            n.da && r.push(Ee(n.j())),
            Ue(t, r, n.j(), e)
          );
        }
        function Ue(t, e, n, r) {
          return He(t.Jf, e, n, r ? [r] : t.Za);
        }
        function We(t, e, n, r) {
          (this.ae = e), (this.Md = n), (this.Dd = r), (this.hd = t);
        }
        function Xe(t, e, n) {
          (this.ae = t), (this.error = e), (this.path = n);
        }
        function Ye() {
          this.vb = [];
        }
        function Ze(t, e) {
          for (var n = null, r = 0; r < e.length; r++) {
            var i = e[r],
              o = i.Yb();
            null === n || o.Z(n.Yb()) || (t.vb.push(n), (n = null)),
              null === n && (n = new $e(o)),
              n.add(i);
          }
          n && t.vb.push(n);
        }
        function af(t, e, n) {
          Ze(t, n),
            bf(t, function (t) {
              return t.Z(e);
            });
        }
        function cf(t, e, n) {
          Ze(t, n),
            bf(t, function (t) {
              return t.contains(e) || e.contains(t);
            });
        }
        function bf(t, e) {
          for (var n = !0, r = 0; r < t.vb.length; r++) {
            var i = t.vb[r];
            if (i)
              if (((i = i.Yb()), e(i))) {
                for (var i = t.vb[r], o = 0; o < i.jd.length; o++) {
                  var a = i.jd[o];
                  if (null !== a) {
                    i.jd[o] = null;
                    var s = a.Tb();
                    Qb && I("event: " + a.toString()), fc(s);
                  }
                }
                t.vb[r] = null;
              } else n = !1;
          }
          n && (t.vb = []);
        }
        function $e(t) {
          (this.qa = t), (this.jd = []);
        }
        function Qe(t) {
          this.g = t;
        }
        function Se(t) {
          (this.he = new Qe(t.g)), (this.g = t.g);
          var e;
          t.ka ? ((e = ef(t)), (e = t.g.Ec(ff(t), e))) : (e = t.g.Hc()),
            (this.Uc = e),
            t.na ? ((e = gf(t)), (t = t.g.Ec(hf(t), e))) : (t = t.g.Fc()),
            (this.vc = t);
        }
        function Re(t) {
          (this.sa = new Se(t)),
            (this.g = t.g),
            D(t.xa, "Only valid if limit has been set"),
            (this.oa = t.oa),
            (this.Ib = !jf(t));
        }
        function kf(t, e, n, r, i, o) {
          var a;
          if (t.Ib) {
            var s = nc(t.g);
            a = function (t, e) {
              return s(e, t);
            };
          } else a = nc(t.g);
          D(e.Eb() == t.oa, "");
          var c = new C(n, r),
            l = t.Ib ? pd(e, t.g) : qd(e, t.g),
            u = t.sa.matches(c);
          if (e.Da(n)) {
            for (
              var f = e.Q(n), l = i.fe(t.g, l, t.Ib);
              null != l && (l.name == n || e.Da(l.name));
  
            )
              l = i.fe(t.g, l, t.Ib);
            return (
              (i = null == l ? 1 : a(l, c)),
              u && !r.e() && 0 <= i
                ? (null != o && df(o, new S(Ie, r, n, f)), e.T(n, r))
                : (null != o && df(o, new S(Le, f, n)),
                  (e = e.T(n, L)),
                  null != l && t.sa.matches(l)
                    ? (null != o && df(o, new S(Me, l.R, l.name)),
                      e.T(l.name, l.R))
                    : e)
            );
          }
          return r.e()
            ? e
            : u && 0 <= a(l, c)
            ? (null != o &&
                (df(o, new S(Le, l.R, l.name)), df(o, new S(Me, r, n))),
              e.T(n, r).T(l.name, L))
            : e;
        }
        function S(t, e, n, r) {
          (this.type = t),
            (this.Ja = e),
            (this.Xa = n),
            (this.qe = r),
            (this.Dd = void 0);
        }
        function Ee(t) {
          return new S(Ne, t);
        }
        function xe() {
          this.fb = {};
        }
        function df(t, e) {
          var n = e.type,
            r = e.Xa;
          D(
            n == Me || n == Ie || n == Le,
            "Only child changes supported for tracking"
          ),
            D(
              ".priority" !== r,
              "Only non-priority child changes can be tracked."
            );
          var i = w(t.fb, r);
          if (i) {
            var o = i.type;
            if (n == Me && o == Le) t.fb[r] = new S(Ie, e.Ja, r, i.Ja);
            else if (n == Le && o == Me) delete t.fb[r];
            else if (n == Le && o == Ie) t.fb[r] = new S(Le, i.qe, r);
            else if (n == Ie && o == Me) t.fb[r] = new S(Me, e.Ja, r);
            else {
              if (n != Ie || o != Ie)
                throw Mb(
                  "Illegal combination of changes: " + e + " occurred after " + i
                );
              t.fb[r] = new S(Ie, e.Ja, r, i.qe);
            }
          } else t.fb[r] = e;
        }
        function lf() {
          (this.Rb = this.na = this.Kb = this.ka = this.xa = !1),
            (this.oa = 0),
            (this.mb = ""),
            (this.dc = null),
            (this.zb = ""),
            (this.ac = null),
            (this.xb = ""),
            (this.g = H);
        }
        function jf(t) {
          return "" === t.mb ? t.ka : "l" === t.mb;
        }
        function ff(t) {
          return D(t.ka, "Only valid if start has been set"), t.dc;
        }
        function ef(t) {
          return (
            D(t.ka, "Only valid if start has been set"),
            t.Kb ? t.zb : "[MIN_NAME]"
          );
        }
        function hf(t) {
          return D(t.na, "Only valid if end has been set"), t.ac;
        }
        function gf(t) {
          return (
            D(t.na, "Only valid if end has been set"), t.Rb ? t.xb : "[MAX_NAME]"
          );
        }
        function nf(t) {
          var e = new lf();
          return (
            (e.xa = t.xa),
            (e.oa = t.oa),
            (e.ka = t.ka),
            (e.dc = t.dc),
            (e.Kb = t.Kb),
            (e.zb = t.zb),
            (e.na = t.na),
            (e.ac = t.ac),
            (e.Rb = t.Rb),
            (e.xb = t.xb),
            (e.g = t.g),
            (e.mb = t.mb),
            e
          );
        }
        function of(t, e) {
          var n = nf(t);
          return (n.g = e), n;
        }
        function pf(t) {
          var e = {};
          if (
            (t.ka && ((e.sp = t.dc), t.Kb && (e.sn = t.zb)),
            t.na && ((e.ep = t.ac), t.Rb && (e.en = t.xb)),
            t.xa)
          ) {
            e.l = t.oa;
            var n = t.mb;
            "" === n && (n = jf(t) ? "l" : "r"), (e.vf = n);
          }
          return t.g !== H && (e.i = t.g.toString()), e;
        }
        function T(t) {
          return !(t.ka || t.na || t.xa);
        }
        function qf(t) {
          return T(t) && t.g == H;
        }
        function rf(t) {
          var e = {};
          if (qf(t)) return e;
          var n;
          return (
            t.g === H
              ? (n = "$priority")
              : t.g === wc
              ? (n = "$value")
              : t.g === tc
              ? (n = "$key")
              : (D(t.g instanceof pc, "Unrecognized index type!"),
                (n = t.g.toString())),
            (e.orderBy = x(n)),
            t.ka && ((e.startAt = x(t.dc)), t.Kb && (e.startAt += "," + x(t.zb))),
            t.na && ((e.endAt = x(t.ac)), t.Rb && (e.endAt += "," + x(t.xb))),
            t.xa && (jf(t) ? (e.limitToFirst = t.oa) : (e.limitToLast = t.oa)),
            e
          );
        }
        function sf(t) {
          this.W = t;
        }
        function uf(t, e, n) {
          if (e.e()) return new sf(new vd(n));
          var r = zd(t.W, e);
          if (null != r) {
            var i = r.path,
              r = r.value;
            return (e = P(i, e)), (r = r.F(e, n)), new sf(t.W.set(i, r));
          }
          return (t = Ad(t.W, e, new vd(n))), new sf(t);
        }
        function vf(t, e, n) {
          var r = t;
          return (
            fb(n, function (t, n) {
              r = uf(r, e.n(t), n);
            }),
            r
          );
        }
        function wf(t, e) {
          var n = zd(t.W, e);
          return null != n ? t.W.get(n.path).P(P(n.path, e)) : null;
        }
        function xf(t) {
          var e = [],
            n = t.W.value;
          return (
            null != n
              ? n.J() ||
                n.O(H, function (t, n) {
                  e.push(new C(t, n));
                })
              : t.W.children.ha(function (t, n) {
                  null != n.value && e.push(new C(t, n.value));
                }),
            e
          );
        }
        function yf(t, e) {
          if (e.e()) return t;
          var n = wf(t, e);
          return new sf(null != n ? new vd(n) : t.W.subtree(e));
        }
        function zf(t, e, n) {
          if (null != e.value) return n.F(t, e.value);
          var r = null;
          return (
            e.children.ha(function (e, i) {
              ".priority" === e
                ? (D(
                    null !== i.value,
                    "Priority writes must always be leaf nodes"
                  ),
                  (r = i.value))
                : (n = zf(t.n(e), i, n));
            }),
            n.P(t).e() || null === r || (n = n.F(t.n(".priority"), r)),
            n
          );
        }
        function Af() {
          this.Jd = L;
        }
        function Bf(t) {
          this.oc = t;
        }
        function Cf(t, e) {
          t.oc.INTERNAL.addAuthTokenListener(e);
        }
        function Df() {
          (this.S = tf), (this.la = []), (this.Bc = -1);
        }
        function Ef(t, e) {
          for (var n = 0; n < t.la.length; n++) {
            var r = t.la[n];
            if (r.Zc === e) return r;
          }
          return null;
        }
        function Ff(t, e) {
          return t.Ga
            ? t.path.contains(e)
            : !!Qa(t.children, function (n, r) {
                return t.path.n(r).contains(e);
              });
        }
        function Hf(t) {
          return t.visible;
        }
        function Gf(t, e, n) {
          for (var r = tf, i = 0; i < t.length; ++i) {
            var o = t[i];
            if (e(o)) {
              var a = o.path;
              if (o.Ga)
                n.contains(a)
                  ? ((a = P(n, a)), (r = uf(r, a, o.Ga)))
                  : a.contains(n) && ((a = P(a, n)), (r = uf(r, Q, o.Ga.P(a))));
              else {
                if (!o.children)
                  throw Mb("WriteRecord should have .snap or .children");
                n.contains(a)
                  ? ((a = P(n, a)), (r = vf(r, a, o.children)))
                  : a.contains(n) &&
                    ((a = P(a, n)),
                    a.e()
                      ? (r = vf(r, Q, o.children))
                      : (o = w(o.children, K(a))) &&
                        ((o = o.P(N(a))), (r = uf(r, Q, o))));
              }
            }
          }
          return r;
        }
        function If(t, e) {
          (this.Lb = t), (this.W = e);
        }
        function Jf(t, e) {
          (this.rf = {}), (this.Vc = new Kf(t)), (this.va = e);
          var n = 1e4 + 2e4 * Math.random();
          hc(q(this.lf, this), Math.floor(n));
        }
        function Lf() {
          this.tc = {};
        }
        function Mf(t, e, r) {
          n(r) || (r = 1), eb(t.tc, e) || (t.tc[e] = 0), (t.tc[e] += r);
        }
        function Kf(t) {
          (this.Ef = t), (this.rd = null);
        }
        function Pf(t) {
          return (t = t.toString()), Nf[t] || (Nf[t] = new Lf()), Nf[t];
        }
        function Qf(t, e) {
          var n = t.toString();
          return Of[n] || (Of[n] = e()), Of[n];
        }
        function Rf(t, e, n) {
          (this.f = Tb("p:rest:")),
            (this.L = t),
            (this.Gb = e),
            (this.$c = n),
            (this.$ = {});
        }
        function Sf(t, e) {
          return n(e)
            ? "tag$" + e
            : (D(qf(t.m), "should have a tag if it's not a default query."),
              t.path.toString());
        }
        function Tf(t, e, n, r) {
          (n = n || {}),
            (n.format = "export"),
            t.$c.getToken(!1).then(function (i) {
              (i = i && i.accessToken) && (n.auth = i);
              var o =
                (t.L.Sc ? "https://" : "http://") + t.L.host + e + "?" + gb(n);
              t.f("Sending REST request for " + o);
              var a = new XMLHttpRequest();
              (a.onreadystatechange = function () {
                if (r && 4 === a.readyState) {
                  t.f(
                    "REST Response for " + o + " received. status:",
                    a.status,
                    "response:",
                    a.responseText
                  );
                  var e = null;
                  if (200 <= a.status && 300 > a.status) {
                    try {
                      e = lb(a.responseText);
                    } catch (t) {
                      J(
                        "Failed to parse JSON response for " +
                          o +
                          ": " +
                          a.responseText
                      );
                    }
                    r(null, e);
                  } else
                    401 !== a.status &&
                      404 !== a.status &&
                      J(
                        "Got unsuccessful REST response for " +
                          o +
                          " Status: " +
                          a.status
                      ),
                      r(a.status);
                  r = null;
                }
              }),
                a.open("GET", o, !0),
                a.send();
            });
        }
        function Uf(t) {
          (this.te = t),
            (this.Bd = []),
            (this.Qb = 0),
            (this.Yd = -1),
            (this.Fb = null);
        }
        function Vf(t, e, n) {
          (t.Yd = e), (t.Fb = n), t.Yd < t.Qb && (t.Fb(), (t.Fb = null));
        }
        function Wf(t, e, n) {
          for (t.Bd[e] = n; t.Bd[t.Qb]; ) {
            var r = t.Bd[t.Qb];
            delete t.Bd[t.Qb];
            for (var i = 0; i < r.length; ++i)
              if (r[i]) {
                var o = t;
                fc(function () {
                  o.te(r[i]);
                });
              }
            if (t.Qb === t.Yd) {
              t.Fb && (clearTimeout(t.Fb), t.Fb(), (t.Fb = null));
              break;
            }
            t.Qb++;
          }
        }
        function Yf(t, e, n, r) {
          (this.Zd = t),
            (this.f = Tb(this.Zd)),
            (this.frames = this.zc = null),
            (this.pb = this.qb = this.Fe = 0),
            (this.Va = Pf(e)),
            (t = { v: "5" }),
            "undefined" != typeof location &&
              location.href &&
              -1 !== location.href.indexOf("firebaseio.com") &&
              (t.r = "f"),
            n && (t.s = n),
            r && (t.ls = r),
            (this.Ke = Bb(e, Cb, t));
        }
        function ag(t, e) {
          if ((t.frames.push(e), t.frames.length == t.Fe)) {
            var n = t.frames.join("");
            (t.frames = null), (n = lb(n)), t.Xf(n);
          }
        }
        function $f(t) {
          clearInterval(t.zc),
            (t.zc = setInterval(function () {
              t.Ia && bg(t, "0"), $f(t);
            }, Math.floor(45e3)));
        }
        function bg(t, e) {
          try {
            t.Ia.send(e);
          } catch (e) {
            t.f(
              "Exception thrown from WebSocket.send():",
              e.message || e.data,
              "Closing connection."
            ),
              setTimeout(q(t.bb, t), 0);
          }
        }
        function cg(t, e, n, r) {
          (this.Zd = t),
            (this.f = Tb(t)),
            (this.jc = e),
            (this.pb = this.qb = 0),
            (this.Va = Pf(e)),
            (this.tf = n),
            (this.wc = !1),
            (this.Cb = r),
            (this.Yc = function (t) {
              return Bb(e, Db, t);
            });
        }
        function gg(t, e) {
          var n = x(e).length;
          (t.pb += n), Mf(t.Va, "bytes_received", n);
        }
        function fg(t, e, n, r) {
          if (
            ((this.Yc = r),
            (this.ib = n),
            (this.ve = new Gc()),
            (this.Qc = []),
            (this.$d = Math.floor(1e8 * Math.random())),
            (this.Kd = !0),
            (this.Qd = Lb()),
            (window["pLPCommand" + this.Qd] = t),
            (window["pRTLPCB" + this.Qd] = e),
            (t = document.createElement("iframe")),
            (t.style.display = "none"),
            !document.body)
          )
            throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
          document.body.appendChild(t);
          try {
            t.contentWindow.document || I("No IE domain setting required");
          } catch (e) {
            t.src =
              "javascript:void((function(){document.open();document.domain='" +
              document.domain +
              "';document.close();})())";
          }
          t.contentDocument
            ? (t.gb = t.contentDocument)
            : t.contentWindow
            ? (t.gb = t.contentWindow.document)
            : t.document && (t.gb = t.document),
            (this.Ea = t),
            (t = ""),
            this.Ea.src &&
              "javascript:" === this.Ea.src.substr(0, 11) &&
              (t = '<script>document.domain="' + document.domain + '";</script>'),
            (t = "<html><body>" + t + "</body></html>");
          try {
            this.Ea.gb.open(), this.Ea.gb.write(t), this.Ea.gb.close();
          } catch (t) {
            I("frame writing exception"), t.stack && I(t.stack), I(t);
          }
        }
        function ig(t) {
          if (t.Ud && t.Kd && t.ve.count() < (0 < t.Qc.length ? 2 : 1)) {
            t.$d++;
            var e = {};
            (e.id = t.Vf), (e.pw = t.Wf), (e.ser = t.$d);
            for (
              var e = t.Yc(e), n = "", r = 0;
              0 < t.Qc.length && 1870 >= t.Qc[0].Pe.length + 30 + n.length;
  
            ) {
              var i = t.Qc.shift(),
                n =
                  n +
                  "&seg" +
                  r +
                  "=" +
                  i.jg +
                  "&ts" +
                  r +
                  "=" +
                  i.pg +
                  "&d" +
                  r +
                  "=" +
                  i.Pe;
              r++;
            }
            return jg(t, e + n, t.$d), !0;
          }
          return !1;
        }
        function jg(t, e, n) {
          function r() {
            t.ve.remove(n), ig(t);
          }
          t.ve.add(n, 1);
          var i = setTimeout(r, Math.floor(25e3));
          hg(t, e, function () {
            clearTimeout(i), r();
          });
        }
        function hg(t, e, n) {
          setTimeout(function () {
            try {
              if (t.Kd) {
                var r = t.Ea.gb.createElement("script");
                (r.type = "text/javascript"),
                  (r.async = !0),
                  (r.src = e),
                  (r.onload = r.onreadystatechange =
                    function () {
                      var t = r.readyState;
                      (t && "loaded" !== t && "complete" !== t) ||
                        ((r.onload = r.onreadystatechange = null),
                        r.parentNode && r.parentNode.removeChild(r),
                        n());
                    }),
                  (r.onerror = function () {
                    I("Long-poll script failed to load: " + e),
                      (t.Kd = !1),
                      t.close();
                  }),
                  t.Ea.gb.body.appendChild(r);
              }
            } catch (t) {}
          }, Math.floor(1));
        }
        function kg(t) {
          lg(this, t);
        }
        function lg(t, e) {
          var n = Yf && Yf.isAvailable(),
            r = n && !(xb.Ze || !0 === xb.get("previous_websocket_failure"));
          if (
            (e.qg &&
              (n ||
                J(
                  "wss:// URL used, but browser isn't known to support websockets.  Trying anyway."
                ),
              (r = !0)),
            r)
          )
            t.Wc = [Yf];
          else {
            var i = (t.Wc = []);
            cc(mg, function (t, e) {
              e && e.isAvailable() && i.push(e);
            });
          }
        }
        function ng(t) {
          if (0 < t.Wc.length) return t.Wc[0];
          throw Error("No transports available");
        }
        function og(t, e, n, r, i, o, a) {
          (this.id = t),
            (this.f = Tb("c:" + this.id + ":")),
            (this.te = n),
            (this.Lc = r),
            (this.ia = i),
            (this.se = o),
            (this.L = e),
            (this.Ad = []),
            (this.Le = 0),
            (this.sf = new kg(e)),
            (this.Ua = 0),
            (this.Cb = a),
            this.f("Connection created"),
            pg(this);
        }
        function pg(t) {
          var e = ng(t.sf);
          (t.I = new e("c:" + t.id + ":" + t.Le++, t.L, void 0, t.Cb)),
            (t.xe = e.responsesRequiredToBeHealthy || 0);
          var n = qg(t, t.I),
            r = rg(t, t.I);
          (t.Xc = t.I),
            (t.Rc = t.I),
            (t.D = null),
            (t.Bb = !1),
            setTimeout(function () {
              t.I && t.I.open(n, r);
            }, Math.floor(0)),
            (e = e.healthyTimeout || 0),
            0 < e &&
              (t.md = hc(function () {
                (t.md = null),
                  t.Bb ||
                    (t.I && 102400 < t.I.pb
                      ? (t.f(
                          "Connection exceeded healthy timeout but has received " +
                            t.I.pb +
                            " bytes.  Marking connection healthy."
                        ),
                        (t.Bb = !0),
                        t.I.sd())
                      : t.I && 10240 < t.I.qb
                      ? t.f(
                          "Connection exceeded healthy timeout but has sent " +
                            t.I.qb +
                            " bytes.  Leaving connection alive."
                        )
                      : (t.f("Closing unhealthy connection after timeout."),
                        t.close()));
              }, Math.floor(e)));
        }
        function rg(t, e) {
          return function (n) {
            e === t.I
              ? ((t.I = null),
                n || 0 !== t.Ua
                  ? 1 === t.Ua && t.f("Realtime connection lost.")
                  : (t.f("Realtime connection failed."),
                    "s-" === t.L.$a.substr(0, 2) &&
                      (xb.remove("host:" + t.L.host), (t.L.$a = t.L.host))),
                t.close())
              : e === t.D
              ? (t.f("Secondary connection lost."),
                (n = t.D),
                (t.D = null),
                (t.Xc !== n && t.Rc !== n) || t.close())
              : t.f("closing an old connection");
          };
        }
        function qg(t, e) {
          return function (n) {
            if (2 != t.Ua)
              if (e === t.Rc) {
                var r = $b("t", n);
                if (((n = $b("d", n)), "c" == r)) {
                  if (((r = $b("t", n)), "d" in n))
                    if (((n = n.d), "h" === r)) {
                      var r = n.ts,
                        i = n.v,
                        o = n.h;
                      (t.qf = n.s),
                        Ab(t.L, o),
                        0 == t.Ua &&
                          (t.I.start(),
                          sg(t, t.I, r),
                          "5" !== i && J("Protocol version mismatch detected"),
                          (n = t.sf),
                          (n = 1 < n.Wc.length ? n.Wc[1] : null) && tg(t, n));
                    } else if ("n" === r) {
                      for (
                        t.f("recvd end transmission on primary"),
                          t.Rc = t.D,
                          n = 0;
                        n < t.Ad.length;
                        ++n
                      )
                        t.wd(t.Ad[n]);
                      (t.Ad = []), ug(t);
                    } else
                      "s" === r
                        ? (t.f(
                            "Connection shutdown command received. Shutting down..."
                          ),
                          t.se && (t.se(n), (t.se = null)),
                          (t.ia = null),
                          t.close())
                        : "r" === r
                        ? (t.f("Reset packet received.  New host: " + n),
                          Ab(t.L, n),
                          1 === t.Ua ? t.close() : (vg(t), pg(t)))
                        : "e" === r
                        ? Ub("Server Error: " + n)
                        : "o" === r
                        ? (t.f("got pong on primary."), wg(t), xg(t))
                        : Ub("Unknown control packet command: " + r);
                } else "d" == r && t.wd(n);
              } else if (e === t.D)
                if (((r = $b("t", n)), (n = $b("d", n)), "c" == r))
                  "t" in n &&
                    ((n = n.t),
                    "a" === n
                      ? yg(t)
                      : "r" === n
                      ? (t.f("Got a reset on secondary, closing it"),
                        t.D.close(),
                        (t.Xc !== t.D && t.Rc !== t.D) || t.close())
                      : "o" === n &&
                        (t.f("got pong on secondary."), t.pf--, yg(t)));
                else {
                  if ("d" != r) throw Error("Unknown protocol layer: " + r);
                  t.Ad.push(n);
                }
              else t.f("message on old connection");
          };
        }
        function ug(t) {
          t.Xc === t.D &&
            t.Rc === t.D &&
            (t.f("cleaning up and promoting a connection: " + t.D.Zd),
            (t.I = t.D),
            (t.D = null));
        }
        function yg(t) {
          0 >= t.pf
            ? (t.f("Secondary connection is healthy."),
              (t.Bb = !0),
              t.D.sd(),
              t.D.start(),
              t.f("sending client ack on secondary"),
              t.D.send({ t: "c", d: { t: "a", d: {} } }),
              t.f("Ending transmission on primary"),
              t.I.send({ t: "c", d: { t: "n", d: {} } }),
              (t.Xc = t.D),
              ug(t))
            : (t.f("sending ping on secondary."),
              t.D.send({ t: "c", d: { t: "p", d: {} } }));
        }
        function wg(t) {
          t.Bb ||
            (t.xe--,
            0 >= t.xe &&
              (t.f("Primary connection is healthy."), (t.Bb = !0), t.I.sd()));
        }
        function tg(t, e) {
          (t.D = new e("c:" + t.id + ":" + t.Le++, t.L, t.qf)),
            (t.pf = e.responsesRequiredToBeHealthy || 0),
            t.D.open(qg(t, t.D), rg(t, t.D)),
            hc(function () {
              t.D && (t.f("Timed out trying to upgrade."), t.D.close());
            }, Math.floor(6e4));
        }
        function sg(t, e, n) {
          t.f("Realtime connection established."),
            (t.I = e),
            (t.Ua = 1),
            t.Lc && (t.Lc(n, t.qf), (t.Lc = null)),
            0 === t.xe
              ? (t.f("Primary connection is healthy."), (t.Bb = !0))
              : hc(function () {
                  xg(t);
                }, Math.floor(5e3));
        }
        function xg(t) {
          t.Bb ||
            1 !== t.Ua ||
            (t.f("sending ping on primary."),
            zg(t, { t: "c", d: { t: "p", d: {} } }));
        }
        function zg(t, e) {
          if (1 !== t.Ua) throw "Connection is not connected";
          t.Xc.send(e);
        }
        function vg(t) {
          t.f("Shutting down all connections"),
            t.I && (t.I.close(), (t.I = null)),
            t.D && (t.D.close(), (t.D = null)),
            t.md && (clearTimeout(t.md), (t.md = null));
        }
        function Ag(t, e, n, r, i, o) {
          if (
            ((this.id = Bg++),
            (this.f = Tb("p:" + this.id + ":")),
            (this.qd = {}),
            (this.$ = {}),
            (this.pa = []),
            (this.Oc = 0),
            (this.Kc = []),
            (this.ma = !1),
            (this.Sa = 1e3),
            (this.td = 3e5),
            (this.Gb = e),
            (this.Jc = n),
            (this.ue = r),
            (this.L = t),
            (this.ob = this.Fa = this.Cb = this.ze = null),
            (this.$c = i),
            (this.de = !1),
            (this.ke = 0),
            o)
          )
            throw Error(
              "Auth override specified in options, but not supported on non Node.js platforms"
            );
          (this.Vd = o),
            (this.ub = null),
            (this.Mb = !1),
            (this.Gd = {}),
            (this.ig = 0),
            (this.Re = !0),
            (this.Ac = this.me = null),
            Cg(this, 0),
            Mc.Vb().gc("visible", this.Zf, this),
            -1 === t.host.indexOf("fblocal") &&
              Lc.Vb().gc("online", this.Yf, this);
        }
        function Eg(t, e) {
          var n = e.eg,
            r = n.path.toString(),
            i = n.ja();
          t.f("Listen on " + r + " for " + i);
          var o = { p: r };
          e.tag && ((o.q = pf(n.m)), (o.t = e.tag)),
            (o.h = e.ld()),
            t.ua("q", o, function (o) {
              var a = o.d,
                s = o.s;
              if (a && "object" == typeof a && eb(a, "w")) {
                var c = w(a, "w");
                ea(c) &&
                  0 <= xa(c, "no_index") &&
                  J(
                    "Using an unspecified index. Consider adding " +
                      ('".indexOn": "' + n.m.g.toString() + '"') +
                      " at " +
                      n.path.toString() +
                      " to your security rules for better performance"
                  );
              }
              (t.$[r] && t.$[r][i]) === e &&
                (t.f("listen response", o),
                "ok" !== s && Fg(t, r, i),
                e.G && e.G(s, a));
            });
        }
        function Gg(t) {
          if (t.ma && t.ob) {
            var e = t.ob,
              n = jc(e) ? "auth" : "gauth",
              r = { cred: e };
            null === t.Vd
              ? (r.noauth = !0)
              : "object" == typeof t.Vd && (r.authvar = t.Vd),
              t.ua(n, r, function (n) {
                var r = n.s;
                (n = n.d || "error"),
                  t.ob === e && ("ok" === r ? (t.ke = 0) : Hg(t, r, n));
              });
          }
        }
        function Ig(t, e, n, r, i) {
          (n = { p: n, d: r }),
            t.f("onDisconnect " + e, n),
            t.ua(e, n, function (t) {
              i &&
                setTimeout(function () {
                  i(t.s, t.d);
                }, Math.floor(0));
            });
        }
        function Jg(t, e, r, i, o, a) {
          (i = { p: r, d: i }),
            n(a) && (i.h = a),
            t.pa.push({ action: e, mf: i, G: o }),
            t.Oc++,
            (e = t.pa.length - 1),
            t.ma ? Kg(t, e) : t.f("Buffering put: " + r);
        }
        function Kg(t, e) {
          var n = t.pa[e].action,
            r = t.pa[e].mf,
            i = t.pa[e].G;
          (t.pa[e].fg = t.ma),
            t.ua(n, r, function (r) {
              t.f(n + " response", r),
                delete t.pa[e],
                t.Oc--,
                0 === t.Oc && (t.pa = []),
                i && i(r.s, r.d);
            });
        }
        function Cg(t, e) {
          D(!t.Fa, "Scheduling a connect when we're already connected/ing?"),
            t.ub && clearTimeout(t.ub),
            (t.ub = setTimeout(function () {
              (t.ub = null), Ng(t);
            }, Math.floor(e)));
        }
        function Ng(t) {
          if (Og(t)) {
            t.f("Making a connection attempt"),
              (t.me = new Date().getTime()),
              (t.Ac = null);
            var e = q(t.wd, t),
              n = q(t.Lc, t),
              r = q(t.df, t),
              i = t.id + ":" + Dg++,
              o = t.Cb,
              a = !1,
              s = null,
              c = function () {
                s ? s.close() : ((a = !0), r());
              };
            t.Fa = {
              close: c,
              ua: function (t) {
                D(s, "sendRequest call when we're not connected not allowed."),
                  s.ua(t);
              },
            };
            var l = t.de;
            (t.de = !1),
              t.$c
                .getToken(l)
                .then(function (c) {
                  a
                    ? I("getToken() completed but was canceled")
                    : (I("getToken() completed. Creating connection."),
                      (t.ob = c && c.accessToken),
                      (s = new og(
                        i,
                        t.L,
                        e,
                        n,
                        r,
                        function (e) {
                          J(e + " (" + t.L.toString() + ")"), t.ab("server_kill");
                        },
                        o
                      )));
                })
                .then(null, function (e) {
                  t.f("Failed to get token: " + e), a || c();
                });
          }
        }
        function Lg(t, e, n) {
          (n = n
            ? Aa(n, function (t) {
                return ac(t);
              }).join("$")
            : "default"),
            (t = Fg(t, e, n)) && t.G && t.G("permission_denied");
        }
        function Fg(t, e, r) {
          e = new E(e).toString();
          var i;
          return (
            n(t.$[e])
              ? ((i = t.$[e][r]),
                delete t.$[e][r],
                0 === La(t.$[e]) && delete t.$[e])
              : (i = void 0),
            i
          );
        }
        function Hg(t, e, n) {
          I("Auth token revoked: " + e + "/" + n),
            (t.ob = null),
            (t.de = !0),
            t.Fa.close(),
            ("invalid_token" !== e && "permission_denied" !== e) ||
              (t.ke++,
              3 <= t.ke &&
                ((t.Sa = 3e4),
                (t = t.$c),
                (e =
                  'Provided authentication credentials for the app named "' +
                  t.oc.name +
                  '" are invalid. This usually indicates your app was not initialized correctly. '),
                (e =
                  "credential" in t.oc.options
                    ? e +
                      'Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.'
                    : "serviceAccount" in t.oc.options
                    ? e +
                      'Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.'
                    : e +
                      'Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.'),
                J(e)));
        }
        function Mg(t) {
          Gg(t),
            v(t.$, function (e) {
              v(e, function (e) {
                Eg(t, e);
              });
            });
          for (var e = 0; e < t.pa.length; e++) t.pa[e] && Kg(t, e);
          for (; t.Kc.length; )
            (e = t.Kc.shift()), Ig(t, e.action, e.we, e.data, e.G);
        }
        function Og(t) {
          var e;
          return (e = Lc.Vb().hc), Sa(t.qd) && e;
        }
        function Pg(t) {
          t instanceof Qg ||
            Vb(
              "Don't call new Database() directly - please use firebase.database()."
            ),
            (this.ta = t),
            (this.ba = new U(t, Q)),
            (this.INTERNAL = new Rg(this));
        }
        function Tg(t, e) {
          null === t.ta && Vb("Cannot call " + e + " on a deleted database.");
        }
        function Rg(t) {
          this.Ya = t;
        }
        function V(t, e, n) {
          (this.A = t), (this.V = e), (this.g = n);
        }
        function Vg(t, e, n) {
          (this.Pb = t), (this.rb = e), (this.tb = n || null);
        }
        function Wg(t, e, n) {
          (this.ga = t), (this.rb = e), (this.tb = n);
        }
        function Xg() {
          this.za = {};
        }
        function Zg(t) {
          return za(Na(t.za), function (t) {
            return !T(t.V.m);
          });
        }
        function $g(t, e) {
          if (T(e.m)) return Yg(t);
          var n = e.ja();
          return w(t.za, n);
        }
        function Yg(t) {
          return (
            Ra(t.za, function (t) {
              return T(t.V.m);
            }) || null
          );
        }
        function ah(t) {
          (this.wa = R),
            (this.jb = new Df()),
            (this.De = {}),
            (this.ic = {}),
            (this.Cc = t);
        }
        function bh(t, e, r, i, o) {
          var a = t.jb,
            s = o;
          return (
            D(i > a.Bc, "Stacking an older write on top of newer ones"),
            n(s) || (s = !0),
            a.la.push({ path: e, Ga: r, Zc: i, visible: s }),
            s && (a.S = uf(a.S, e, r)),
            (a.Bc = i),
            o ? ch(t, new ce(fe, e, r)) : []
          );
        }
        function dh(t, e, n, r) {
          var i = t.jb;
          return (
            D(r > i.Bc, "Stacking an older merge on top of newer ones"),
            i.la.push({ path: e, children: n, Zc: r, visible: !0 }),
            (i.S = vf(i.S, e, n)),
            (i.Bc = r),
            (n = xd(n)),
            ch(t, new ae(fe, e, n))
          );
        }
        function eh(t, e, n) {
          n = n || !1;
          var r = Ef(t.jb, e);
          if (t.jb.Ed(e)) {
            var i = R;
            return (
              null != r.Ga
                ? (i = i.set(Q, !0))
                : fb(r.children, function (t, e) {
                    i = i.set(new E(t), e);
                  }),
              ch(t, new de(r.path, i, n))
            );
          }
          return [];
        }
        function fh(t, e, n) {
          return (n = xd(n)), ch(t, new ae(ie, e, n));
        }
        function gh(t, e, n, r) {
          if (((r = hh(t, r)), null != r)) {
            var i = ih(r);
            return (
              (r = i.path),
              (i = i.Hb),
              (e = P(r, e)),
              (n = new ce(new he(!1, !0, i, !0), e, n)),
              jh(t, r, n)
            );
          }
          return [];
        }
        function kh(t, e, n, r) {
          if ((r = hh(t, r))) {
            var i = ih(r);
            return (
              (r = i.path),
              (i = i.Hb),
              (e = P(r, e)),
              (n = xd(n)),
              (n = new ae(new he(!1, !0, i, !0), e, n)),
              jh(t, r, n)
            );
          }
          return [];
        }
        function oh(t) {
          return Bd(t, function (t, e, n) {
            if (e && null != Yg(e)) return [Yg(e)];
            var r = [];
            return (
              e && (r = Zg(e)),
              v(n, function (t) {
                r = r.concat(t);
              }),
              r
            );
          });
        }
        function sh(t, e) {
          for (var n = 0; n < e.length; ++n) {
            var r = e[n];
            if (!T(r.m)) {
              var r = lh(r),
                i = t.ic[r];
              delete t.ic[r], delete t.De["_" + i];
            }
          }
        }
        function qh(t) {
          return T(t.m) && !qf(t.m) ? t.wb() : t;
        }
        function nh(t, e, n) {
          var r = e.path,
            i = rh(t, e);
          if (
            ((n = ph(t, n)),
            (e = t.Cc.Ae(qh(e), i, n.ld, n.G)),
            (r = t.wa.subtree(r)),
            i)
          )
            D(
              null == Yg(r.value),
              "If we're adding a query, it shouldn't be shadowed"
            );
          else
            for (
              i = Bd(r, function (t, e, n) {
                if (!t.e() && e && null != Yg(e)) return [Te(Yg(e))];
                var r = [];
                return (
                  e &&
                    (r = r.concat(
                      Aa(Zg(e), function (t) {
                        return t.V;
                      })
                    )),
                  v(n, function (t) {
                    r = r.concat(t);
                  }),
                  r
                );
              }),
                r = 0;
              r < i.length;
              ++r
            )
              (n = i[r]), t.Cc.Od(qh(n), rh(t, n));
          return e;
        }
        function ph(t, e) {
          var n = e.V,
            r = rh(t, n);
          return {
            ld: function () {
              return (e.w() || L).hash();
            },
            G: function (e) {
              if ("ok" === e) {
                if (r) {
                  var i = n.path;
                  if ((e = hh(t, r))) {
                    var o = ih(e);
                    (e = o.path),
                      (o = o.Hb),
                      (i = P(e, i)),
                      (i = new Zd(new he(!1, !0, o, !0), i)),
                      (e = jh(t, e, i));
                  } else e = [];
                } else e = ch(t, new Zd(ie, n.path));
                return e;
              }
              return (
                (i = "Unknown Error"),
                "too_big" === e
                  ? (i =
                      "The data requested exceeds the maximum size that can be accessed with a single request.")
                  : "permission_denied" == e
                  ? (i =
                      "Client doesn't have permission to access the desired data.")
                  : "unavailable" == e && (i = "The service is unavailable"),
                (i = Error(e + " at " + n.path.toString() + ": " + i)),
                (i.code = e.toUpperCase()),
                t.kb(n, null, i)
              );
            },
          };
        }
        function lh(t) {
          return t.path.toString() + "$" + t.ja();
        }
        function ih(t) {
          var e = t.indexOf("$");
          return (
            D(-1 !== e && e < t.length - 1, "Bad queryKey."),
            { Hb: t.substr(e + 1), path: new E(t.substr(0, e)) }
          );
        }
        function hh(t, e) {
          var n = t.De,
            r = "_" + e;
          return r in n ? n[r] : void 0;
        }
        function rh(t, e) {
          var n = lh(e);
          return w(t.ic, n);
        }
        function jh(t, e, n) {
          var r = t.wa.get(e);
          return (
            D(r, "Missing sync point for query tag that we're tracking"),
            r.eb(n, new If(e, t.jb), null)
          );
        }
        function ch(t, e) {
          return th(t, e, t.wa, null, new If(Q, t.jb));
        }
        function th(t, e, n, r, i) {
          if (e.path.e()) return uh(t, e, n, r, i);
          var o = n.get(Q);
          null == r && null != o && (r = o.hb(Q));
          var a = [],
            s = K(e.path),
            c = e.Mc(s);
          if ((n = n.children.get(s)) && c)
            var l = r ? r.Q(s) : null,
              s = i.n(s),
              a = a.concat(th(t, c, n, l, s));
          return o && (a = a.concat(o.eb(e, i, r))), a;
        }
        function uh(t, e, n, r, i) {
          var o = n.get(Q);
          null == r && null != o && (r = o.hb(Q));
          var a = [];
          return (
            n.children.ha(function (n, o) {
              var s = r ? r.Q(n) : null,
                c = i.n(n),
                l = e.Mc(n);
              l && (a = a.concat(uh(t, l, o, s, c)));
            }),
            o && (a = a.concat(o.eb(e, i, r))),
            a
          );
        }
        function Qg(t, e, n) {
          this.app = n;
          var r = new Bf(n);
          if (
            ((this.L = t),
            (this.Va = Pf(t)),
            (this.Vc = null),
            (this.ca = new Ye()),
            (this.vd = 1),
            (this.Ra = null),
            e ||
              0 <=
                (
                  ("object" == typeof window &&
                    window.navigator &&
                    window.navigator.userAgent) ||
                  ""
                ).search(
                  /googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i
                ))
          )
            (this.va = new Rf(this.L, q(this.Gb, this), r)),
              setTimeout(q(this.Jc, this, !0), 0);
          else {
            if (
              ((e = n.options.databaseAuthVariableOverride),
              "undefined" !== da(e) && null !== e)
            ) {
              if ("object" !== da(e))
                throw Error(
                  "Only objects are supported for option databaseAuthVariableOverride"
                );
              try {
                x(e);
              } catch (t) {
                throw Error("Invalid authOverride provided: " + t);
              }
            }
            this.va = this.Ra = new Ag(
              this.L,
              q(this.Gb, this),
              q(this.Jc, this),
              q(this.ue, this),
              r,
              e
            );
          }
          var i = this;
          Cf(r, function (t) {
            i.va.kf(t);
          }),
            (this.og = Qf(
              t,
              q(function () {
                return new Jf(this.Va, this.va);
              }, this)
            )),
            (this.mc = new Tc()),
            (this.ie = new Af()),
            (this.pd = new ah({
              Ae: function (t, e, n, r) {
                return (
                  (e = []),
                  (n = i.ie.j(t.path)),
                  n.e() ||
                    ((e = ch(i.pd, new ce(ie, t.path, n))),
                    setTimeout(function () {
                      r("ok");
                    }, 0)),
                  e
                );
              },
              Od: ba,
            })),
            vh(this, "connected", !1),
            (this.ia = new Gb()),
            (this.Ya = new Pg(this)),
            (this.fd = 0),
            (this.je = null),
            (this.K = new ah({
              Ae: function (t, e, n, r) {
                return (
                  i.va.$e(t, n, e, function (e, n) {
                    var o = r(e, n);
                    cf(i.ca, t.path, o);
                  }),
                  []
                );
              },
              Od: function (t, e) {
                i.va.uf(t, e);
              },
            }));
        }
        function wh(t) {
          return (
            (t = t.ie.j(new E(".info/serverTimeOffset")).H() || 0),
            new Date().getTime() + t
          );
        }
        function xh(t) {
          return (
            (t = t = { timestamp: wh(t) }),
            (t.timestamp = t.timestamp || new Date().getTime()),
            t
          );
        }
        function vh(t, e, n) {
          (e = new E("/.info/" + e)), (n = G(n));
          var r = t.ie;
          (r.Jd = r.Jd.F(e, n)), (n = ch(t.pd, new ce(ie, e, n))), cf(t.ca, e, n);
        }
        function zh(t) {
          t.f("onDisconnectEvents");
          var e = xh(t),
            n = [];
          Hb(Fb(t.ia, e), Q, function (e, r) {
            n = n.concat(ch(t.K, new ce(ie, e, r)));
            var i = Bh(t, e);
            yh(t, i);
          }),
            (t.ia = new Gb()),
            cf(t.ca, Q, n);
        }
        function Ch(t, e, n, r) {
          var i = G(n);
          t.va.re(e.toString(), i.H(!0), function (n, o) {
            "ok" === n && Ib(t.ia, e, i), Ah(r, n, o);
          });
        }
        function Dh(t, e, n, r, i) {
          var o = G(n, r);
          t.va.re(e.toString(), o.H(!0), function (n, r) {
            "ok" === n && Ib(t.ia, e, o), Ah(i, n, r);
          });
        }
        function Eh(t, e, n, r) {
          var i,
            o = !0;
          for (i in n) o = !1;
          o
            ? (I(
                "onDisconnect().update() called with empty data.  Don't do anything."
              ),
              Ah(r, "ok"))
            : t.va.cf(e.toString(), n, function (i, o) {
                if ("ok" === i)
                  for (var a in n) {
                    var s = G(n[a]);
                    Ib(t.ia, e.n(a), s);
                  }
                Ah(r, i, o);
              });
        }
        function Fh(t, e, n) {
          (n = ".info" === K(e.path) ? t.pd.Nb(e, n) : t.K.Nb(e, n)),
            af(t.ca, e.path, n);
        }
        function Ah(t, e, n) {
          t &&
            fc(function () {
              if ("ok" == e) t(null);
              else {
                var r = (e || "error").toUpperCase(),
                  i = r;
                n && (i += ": " + n), (i = Error(i)), (i.code = r), t(i);
              }
            });
        }
        function Gh(t, e, r, i, o) {
          function a() {}
          t.f("transaction on " + e);
          var s = new U(t, e);
          if (
            (s.gc("value", a),
            (r = {
              path: e,
              update: r,
              G: i,
              status: null,
              ef: Lb(),
              He: o,
              of: 0,
              Rd: function () {
                s.Ic("value", a);
              },
              Td: null,
              Ba: null,
              cd: null,
              dd: null,
              ed: null,
            }),
            (i = t.K.Aa(e, void 0) || L),
            (r.cd = i),
            (i = r.update(i.H())),
            n(i))
          ) {
            Pd("transaction failed: Data returned ", i, r.path),
              (r.status = 1),
              (o = Uc(t.mc, e));
            var c = o.Ca() || [];
            c.push(r),
              Vc(o, c),
              "object" == typeof i && null !== i && eb(i, ".priority")
                ? ((c = w(i, ".priority")),
                  D(
                    Nd(c),
                    "Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null."
                  ))
                : (c = (t.K.Aa(e) || L).C().H()),
              (o = xh(t)),
              (i = G(i, c)),
              (o = Jb(i, o)),
              (r.dd = i),
              (r.ed = o),
              (r.Ba = t.vd++),
              (r = bh(t.K, e, o, r.Ba, r.He)),
              cf(t.ca, e, r),
              Hh(t);
          } else
            r.Rd(),
              (r.dd = null),
              (r.ed = null),
              r.G && ((t = new V(r.cd, new U(t, r.path), H)), r.G(null, !1, t));
        }
        function Hh(t, e) {
          var n = e || t.mc;
          if ((e || Ih(t, n), null !== n.Ca())) {
            var r = Jh(t, n);
            D(0 < r.length, "Sending zero length transaction queue"),
              Ca(r, function (t) {
                return 1 === t.status;
              }) && Kh(t, n.path(), r);
          } else
            n.kd() &&
              n.O(function (e) {
                Hh(t, e);
              });
        }
        function Kh(t, e, n) {
          for (
            var r = Aa(n, function (t) {
                return t.Ba;
              }),
              i = t.K.Aa(e, r) || L,
              r = i,
              i = i.hash(),
              o = 0;
            o < n.length;
            o++
          ) {
            var a = n[o];
            D(
              1 === a.status,
              "tryToSendTransactionQueue_: items in queue should all be run."
            ),
              (a.status = 2),
              a.of++;
            var s = P(e, a.path),
              r = r.F(s, a.dd);
          }
          (r = r.H(!0)),
            t.va.put(
              e.toString(),
              r,
              function (r) {
                t.f("transaction put response", {
                  path: e.toString(),
                  status: r,
                });
                var i = [];
                if ("ok" === r) {
                  for (r = [], o = 0; o < n.length; o++) {
                    if (
                      ((n[o].status = 3),
                      (i = i.concat(eh(t.K, n[o].Ba))),
                      n[o].G)
                    ) {
                      var a = n[o].ed,
                        s = new U(t, n[o].path);
                      r.push(q(n[o].G, null, null, !0, new V(a, s, H)));
                    }
                    n[o].Rd();
                  }
                  for (
                    Ih(t, Uc(t.mc, e)), Hh(t), cf(t.ca, e, i), o = 0;
                    o < r.length;
                    o++
                  )
                    fc(r[o]);
                } else {
                  if ("datastale" === r)
                    for (o = 0; o < n.length; o++)
                      n[o].status = 4 === n[o].status ? 5 : 1;
                  else
                    for (
                      J("transaction at " + e.toString() + " failed: " + r),
                        o = 0;
                      o < n.length;
                      o++
                    )
                      (n[o].status = 5), (n[o].Td = r);
                  yh(t, e);
                }
              },
              i
            );
        }
        function yh(t, e) {
          var n = Lh(t, e),
            r = n.path(),
            n = Jh(t, n);
          return Mh(t, n, r), r;
        }
        function Mh(t, e, r) {
          if (0 !== e.length) {
            for (
              var i = [],
                o = [],
                a = za(e, function (t) {
                  return 1 === t.status;
                }),
                a = Aa(a, function (t) {
                  return t.Ba;
                }),
                s = 0;
              s < e.length;
              s++
            ) {
              var c,
                l = e[s],
                u = P(r, l.path),
                f = !1;
              if (
                (D(
                  null !== u,
                  "rerunTransactionsUnderNode_: relativePath should not be null."
                ),
                5 === l.status)
              )
                (f = !0), (c = l.Td), (o = o.concat(eh(t.K, l.Ba, !0)));
              else if (1 === l.status)
                if (25 <= l.of)
                  (f = !0), (c = "maxretry"), (o = o.concat(eh(t.K, l.Ba, !0)));
                else {
                  var h = t.K.Aa(l.path, a) || L;
                  l.cd = h;
                  var d = e[s].update(h.H());
                  n(d)
                    ? (Pd("transaction failed: Data returned ", d, l.path),
                      (u = G(d)),
                      ("object" == typeof d && null != d && eb(d, ".priority")) ||
                        (u = u.fa(h.C())),
                      (h = l.Ba),
                      (d = xh(t)),
                      (d = Jb(u, d)),
                      (l.dd = u),
                      (l.ed = d),
                      (l.Ba = t.vd++),
                      Fa(a, h),
                      (o = o.concat(bh(t.K, l.path, d, l.Ba, l.He))),
                      (o = o.concat(eh(t.K, h, !0))))
                    : ((f = !0),
                      (c = "nodata"),
                      (o = o.concat(eh(t.K, l.Ba, !0))));
                }
              cf(t.ca, r, o),
                (o = []),
                f &&
                  ((e[s].status = 3),
                  setTimeout(e[s].Rd, Math.floor(0)),
                  e[s].G &&
                    ("nodata" === c
                      ? ((l = new U(t, e[s].path)),
                        i.push(q(e[s].G, null, null, !1, new V(e[s].cd, l, H))))
                      : i.push(q(e[s].G, null, Error(c), !1, null))));
            }
            for (Ih(t, t.mc), s = 0; s < i.length; s++) fc(i[s]);
            Hh(t);
          }
        }
        function Lh(t, e) {
          for (var n, r = t.mc; null !== (n = K(e)) && null === r.Ca(); )
            (r = Uc(r, n)), (e = N(e));
          return r;
        }
        function Jh(t, e) {
          var n = [];
          return (
            Nh(t, e, n),
            n.sort(function (t, e) {
              return t.ef - e.ef;
            }),
            n
          );
        }
        function Nh(t, e, n) {
          var r = e.Ca();
          if (null !== r) for (var i = 0; i < r.length; i++) n.push(r[i]);
          e.O(function (e) {
            Nh(t, e, n);
          });
        }
        function Ih(t, e) {
          var n = e.Ca();
          if (n) {
            for (var r = 0, i = 0; i < n.length; i++)
              3 !== n[i].status && ((n[r] = n[i]), r++);
            (n.length = r), Vc(e, 0 < n.length ? n : null);
          }
          e.O(function (e) {
            Ih(t, e);
          });
        }
        function Bh(t, e) {
          var n = Lh(t, e).path(),
            r = Uc(t.mc, e);
          return (
            Yc(r, function (e) {
              Oh(t, e);
            }),
            Oh(t, r),
            Xc(r, function (e) {
              Oh(t, e);
            }),
            n
          );
        }
        function Oh(t, e) {
          var n = e.Ca();
          if (null !== n) {
            for (var r = [], i = [], o = -1, a = 0; a < n.length; a++)
              4 !== n[a].status &&
                (2 === n[a].status
                  ? (D(
                      o === a - 1,
                      "All SENT items should be at beginning of queue."
                    ),
                    (o = a),
                    (n[a].status = 4),
                    (n[a].Td = "set"))
                  : (D(
                      1 === n[a].status,
                      "Unexpected transaction status in abort"
                    ),
                    n[a].Rd(),
                    (i = i.concat(eh(t.K, n[a].Ba, !0))),
                    n[a].G && r.push(q(n[a].G, null, Error("set"), !1, null))));
            for (
              -1 === o ? Vc(e, null) : (n.length = o + 1),
                cf(t.ca, e.path(), i),
                a = 0;
              a < r.length;
              a++
            )
              fc(r[a]);
          }
        }
        function Ug() {
          (this.lb = {}), (this.wf = !1);
        }
        function Ph(t, e) {
          (this.committed = t), (this.snapshot = e);
        }
        function X(t, e, n, r) {
          (this.u = t), (this.path = e), (this.m = n), (this.Nc = r);
        }
        function Qh(t) {
          var e = null,
            n = null;
          if ((t.ka && (e = ff(t)), t.na && (n = hf(t)), t.g === tc)) {
            if (t.ka) {
              if ("[MIN_NAME]" != ef(t))
                throw Error(
                  "Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo()."
                );
              if ("string" != typeof e)
                throw Error(
                  "Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string."
                );
            }
            if (t.na) {
              if ("[MAX_NAME]" != gf(t))
                throw Error(
                  "Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo()."
                );
              if ("string" != typeof n)
                throw Error(
                  "Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string."
                );
            }
          } else if (t.g === H) {
            if ((null != e && !Nd(e)) || (null != n && !Nd(n)))
              throw Error(
                "Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string)."
              );
          } else if (
            (D(t.g instanceof pc || t.g === wc, "unknown index type."),
            (null != e && "object" == typeof e) ||
              (null != n && "object" == typeof n))
          )
            throw Error(
              "Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object."
            );
        }
        function Rh(t) {
          if (t.ka && t.na && t.xa && (!t.xa || "" === t.mb))
            throw Error(
              "Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead."
            );
        }
        function Sh(t, e) {
          if (!0 === t.Nc)
            throw Error(e + ": You can't combine multiple orderBy calls.");
        }
        function Th(t, e, n) {
          var r = { cancel: null, Ma: null };
          if (e && n)
            (r.cancel = e), B(t, 3, r.cancel, !0), (r.Ma = n), ob(t, 4, r.Ma);
          else if (e)
            if ("object" == typeof e && null !== e) r.Ma = e;
            else {
              if ("function" != typeof e)
                throw Error(
                  A(t, 3, !0) +
                    " must either be a cancel callback or a context object."
                );
              r.cancel = e;
            }
          return r;
        }
        function Y(t, e) {
          (this.ta = t), (this.qa = e);
        }
        function U(t, e) {
          if (!(t instanceof Qg))
            throw Error(
              "new Firebase() no longer supported - use app.database()."
            );
          X.call(this, t, e, mf, !1), (this.then = void 0), (this.catch = void 0);
        }
        var firebase = __webpack_require__(1),
          g,
          aa = this,
          qa = {
            '"': '\\"',
            "\\": "\\\\",
            "/": "\\/",
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            "\v": "\\u000b",
          },
          ra = /\uffff/.test("￿")
            ? /[\\\"\x00-\x1f\x7f-\uffff]/g
            : /[\\\"\x00-\x1f\x7f-\xff]/g;
        la(ta, sa),
          (ta.prototype.reset = function () {
            (this.M[0] = 1732584193),
              (this.M[1] = 4023233417),
              (this.M[2] = 2562383102),
              (this.M[3] = 271733878),
              (this.M[4] = 3285377520),
              (this.Pd = this.$b = 0);
          }),
          (ta.prototype.update = function (t, e) {
            if (null != t) {
              n(e) || (e = t.length);
              for (
                var r = e - this.Wa, i = 0, o = this.Wd, a = this.$b;
                i < e;
  
              ) {
                if (0 == a) for (; i <= r; ) ua(this, t, i), (i += this.Wa);
                if (p(t)) {
                  for (; i < e; )
                    if (((o[a] = t.charCodeAt(i)), ++a, ++i, a == this.Wa)) {
                      ua(this, o), (a = 0);
                      break;
                    }
                } else
                  for (; i < e; )
                    if (((o[a] = t[i]), ++a, ++i, a == this.Wa)) {
                      ua(this, o), (a = 0);
                      break;
                    }
              }
              (this.$b = a), (this.Pd += e);
            }
          });
        var r;
        t: {
          var va = aa.navigator;
          if (va) {
            var wa = va.userAgent;
            if (wa) {
              r = wa;
              break t;
            }
          }
          r = "";
        }
        var t = Array.prototype,
          xa = t.indexOf
            ? function (e, n, r) {
                return t.indexOf.call(e, n, r);
              }
            : function (t, e, n) {
                if (
                  ((n = null == n ? 0 : 0 > n ? Math.max(0, t.length + n) : n),
                  p(t))
                )
                  return p(e) && 1 == e.length ? t.indexOf(e, n) : -1;
                for (; n < t.length; n++) if (n in t && t[n] === e) return n;
                return -1;
              },
          ya = t.forEach
            ? function (e, n, r) {
                t.forEach.call(e, n, r);
              }
            : function (t, e, n) {
                for (
                  var r = t.length, i = p(t) ? t.split("") : t, o = 0;
                  o < r;
                  o++
                )
                  o in i && e.call(n, i[o], o, t);
              },
          za = t.filter
            ? function (e, n, r) {
                return t.filter.call(e, n, r);
              }
            : function (t, e, n) {
                for (
                  var r = t.length,
                    i = [],
                    o = 0,
                    a = p(t) ? t.split("") : t,
                    s = 0;
                  s < r;
                  s++
                )
                  if (s in a) {
                    var c = a[s];
                    e.call(n, c, s, t) && (i[o++] = c);
                  }
                return i;
              },
          Aa = t.map
            ? function (e, n, r) {
                return t.map.call(e, n, r);
              }
            : function (t, e, n) {
                for (
                  var r = t.length,
                    i = Array(r),
                    o = p(t) ? t.split("") : t,
                    a = 0;
                  a < r;
                  a++
                )
                  a in o && (i[a] = e.call(n, o[a], a, t));
                return i;
              },
          Ba = t.reduce
            ? function (e, n, r, i) {
                for (var o = [], a = 1, s = arguments.length; a < s; a++)
                  o.push(arguments[a]);
                return i && (o[0] = q(n, i)), t.reduce.apply(e, o);
              }
            : function (t, e, n, r) {
                var i = n;
                return (
                  ya(t, function (n, o) {
                    i = e.call(r, i, n, o, t);
                  }),
                  i
                );
              },
          Ca = t.every
            ? function (e, n, r) {
                return t.every.call(e, n, r);
              }
            : function (t, e, n) {
                for (
                  var r = t.length, i = p(t) ? t.split("") : t, o = 0;
                  o < r;
                  o++
                )
                  if (o in i && !e.call(n, i[o], o, t)) return !1;
                return !0;
              },
          Ua = -1 != r.indexOf("Opera") || -1 != r.indexOf("OPR"),
          Va = -1 != r.indexOf("Trident") || -1 != r.indexOf("MSIE"),
          Wa =
            -1 != r.indexOf("Gecko") &&
            -1 == r.toLowerCase().indexOf("webkit") &&
            !(-1 != r.indexOf("Trident") || -1 != r.indexOf("MSIE")),
          Xa = -1 != r.toLowerCase().indexOf("webkit");
        !(function () {
          var t,
            e = "";
          return Ua && aa.opera
            ? ((e = aa.opera.version), ha(e) ? e() : e)
            : (Wa
                ? (t = /rv\:([^\);]+)(\)|;)/)
                : Va
                ? (t = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/)
                : Xa && (t = /WebKit\/(\S+)/),
              t && (e = (e = t.exec(r)) ? e[1] : ""),
              Va &&
              ((t = (t = aa.document) ? t.documentMode : void 0),
              t > parseFloat(e))
                ? String(t)
                : e);
        })();
        var Ya = null,
          Za = null,
          $a = null,
          hb = firebase.Promise;
        (g = ub.prototype),
          (g.set = function (t, e) {
            null == e
              ? this.uc.removeItem(this.Cd + t)
              : this.uc.setItem(this.Cd + t, x(e));
          }),
          (g.get = function (t) {
            return (t = this.uc.getItem(this.Cd + t)), null == t ? null : lb(t);
          }),
          (g.remove = function (t) {
            this.uc.removeItem(this.Cd + t);
          }),
          (g.Ze = !1),
          (g.toString = function () {
            return this.uc.toString();
          }),
          (vb.prototype.set = function (t, e) {
            null == e ? delete this.pc[t] : (this.pc[t] = e);
          }),
          (vb.prototype.get = function (t) {
            return eb(this.pc, t) ? this.pc[t] : null;
          }),
          (vb.prototype.remove = function (t) {
            delete this.pc[t];
          }),
          (vb.prototype.Ze = !0);
        var xb = wb("localStorage"),
          yb = wb("sessionStorage");
        zb.prototype.toString = function () {
          var t = (this.Sc ? "https://" : "http://") + this.host;
          return this.gf && (t += "<" + this.gf + ">"), t;
        };
        var Lb = (function () {
            var t = 1;
            return function () {
              return t++;
            };
          })(),
          D = cb,
          Mb = db,
          Qb = null,
          Rb = !0,
          ec = /^-?\d{1,10}$/,
          mc = {};
        (lc.prototype.nd = function (t, e) {
          return (
            0 !== this.compare(new C("[MIN_NAME]", t), new C("[MIN_NAME]", e))
          );
        }),
          (lc.prototype.Hc = function () {
            return oc;
          }),
          la(pc, lc),
          (g = pc.prototype),
          (g.xc = function (t) {
            return !t.P(this.bc).e();
          }),
          (g.compare = function (t, e) {
            var n = t.R.P(this.bc),
              r = e.R.P(this.bc),
              n = n.sc(r);
            return 0 === n ? sb(t.name, e.name) : n;
          }),
          (g.Ec = function (t, e) {
            var n = G(t),
              n = L.F(this.bc, n);
            return new C(e, n);
          }),
          (g.Fc = function () {
            var t = L.F(this.bc, qc);
            return new C("[MAX_NAME]", t);
          }),
          (g.toString = function () {
            return this.bc.slice().join("/");
          }),
          la(rc, lc),
          (g = rc.prototype),
          (g.compare = function (t, e) {
            var n = t.R.C(),
              r = e.R.C(),
              n = n.sc(r);
            return 0 === n ? sb(t.name, e.name) : n;
          }),
          (g.xc = function (t) {
            return !t.C().e();
          }),
          (g.nd = function (t, e) {
            return !t.C().Z(e.C());
          }),
          (g.Hc = function () {
            return oc;
          }),
          (g.Fc = function () {
            return new C("[MAX_NAME]", new Kb("[PRIORITY-POST]", qc));
          }),
          (g.Ec = function (t, e) {
            var n = G(t);
            return new C(e, new Kb("[PRIORITY-POST]", n));
          }),
          (g.toString = function () {
            return ".priority";
          });
        var H = new rc();
        la(sc, lc),
          (g = sc.prototype),
          (g.compare = function (t, e) {
            return sb(t.name, e.name);
          }),
          (g.xc = function () {
            throw Mb("KeyIndex.isDefinedOn not expected to be called.");
          }),
          (g.nd = function () {
            return !1;
          }),
          (g.Hc = function () {
            return oc;
          }),
          (g.Fc = function () {
            return new C("[MAX_NAME]", L);
          }),
          (g.Ec = function (t) {
            return (
              D(p(t), "KeyIndex indexValue must always be a string."), new C(t, L)
            );
          }),
          (g.toString = function () {
            return ".key";
          });
        var tc = new sc();
        la(uc, lc),
          (g = uc.prototype),
          (g.compare = function (t, e) {
            var n = t.R.sc(e.R);
            return 0 === n ? sb(t.name, e.name) : n;
          }),
          (g.xc = function () {
            return !0;
          }),
          (g.nd = function (t, e) {
            return !t.Z(e);
          }),
          (g.Hc = function () {
            return oc;
          }),
          (g.Fc = function () {
            return vc;
          }),
          (g.Ec = function (t, e) {
            var n = G(t);
            return new C(e, n);
          }),
          (g.toString = function () {
            return ".value";
          });
        var wc = new uc();
        xc.prototype.get = function (t) {
          var e = w(this.od, t);
          if (!e) throw Error("No index defined for " + t);
          return e === mc ? null : e;
        };
        var Bc = new xc({ ".priority": mc }, { ".priority": H }),
          Dc = ["object", "boolean", "number", "string"];
        (g = Kb.prototype),
          (g.J = function () {
            return !0;
          }),
          (g.C = function () {
            return this.aa;
          }),
          (g.fa = function (t) {
            return new Kb(this.B, t);
          }),
          (g.Q = function (t) {
            return ".priority" === t ? this.aa : L;
          }),
          (g.P = function (t) {
            return t.e() ? this : ".priority" === K(t) ? this.aa : L;
          }),
          (g.Da = function () {
            return !1;
          }),
          (g.Ve = function () {
            return null;
          }),
          (g.T = function (t, e) {
            return ".priority" === t
              ? this.fa(e)
              : e.e() && ".priority" !== t
              ? this
              : L.T(t, e).fa(this.aa);
          }),
          (g.F = function (t, e) {
            var n = K(t);
            return null === n
              ? e
              : e.e() && ".priority" !== n
              ? this
              : (D(
                  ".priority" !== n || 1 === Ec(t),
                  ".priority must be the last token in a path"
                ),
                this.T(n, L.F(N(t), e)));
          }),
          (g.e = function () {
            return !1;
          }),
          (g.Eb = function () {
            return 0;
          }),
          (g.O = function () {
            return !1;
          }),
          (g.H = function (t) {
            return t && !this.C().e()
              ? { ".value": this.Ca(), ".priority": this.C().H() }
              : this.Ca();
          }),
          (g.hash = function () {
            if (null === this.Db) {
              var t = "";
              this.aa.e() || (t += "priority:" + Fc(this.aa.H()) + ":");
              var e = typeof this.B,
                t = t + (e + ":"),
                t = "number" === e ? t + dc(this.B) : t + this.B;
              this.Db = Ob(t);
            }
            return this.Db;
          }),
          (g.Ca = function () {
            return this.B;
          }),
          (g.sc = function (t) {
            if (t === L) return 1;
            if (t instanceof O) return -1;
            D(t.J(), "Unknown node type");
            var e = typeof t.B,
              n = typeof this.B,
              r = xa(Dc, e),
              i = xa(Dc, n);
            return (
              D(0 <= r, "Unknown leaf type: " + e),
              D(0 <= i, "Unknown leaf type: " + n),
              r === i
                ? "object" === n
                  ? 0
                  : this.B < t.B
                  ? -1
                  : this.B === t.B
                  ? 0
                  : 1
                : i - r
            );
          }),
          (g.nb = function () {
            return this;
          }),
          (g.yc = function () {
            return !0;
          }),
          (g.Z = function (t) {
            return t === this || (!!t.J() && this.B === t.B && this.aa.Z(t.aa));
          }),
          (g.toString = function () {
            return x(this.H(!0));
          }),
          (g = Gc.prototype),
          (g.add = function (t, e) {
            this.set[t] = null === e || e;
          }),
          (g.contains = function (t) {
            return eb(this.set, t);
          }),
          (g.get = function (t) {
            return this.contains(t) ? this.set[t] : void 0;
          }),
          (g.remove = function (t) {
            delete this.set[t];
          }),
          (g.clear = function () {
            this.set = {};
          }),
          (g.e = function () {
            return Sa(this.set);
          }),
          (g.count = function () {
            return La(this.set);
          }),
          (g.keys = function () {
            var t = [];
            return (
              v(this.set, function (e, n) {
                t.push(n);
              }),
              t
            );
          }),
          (Ic.prototype.Ge = function (t, e) {
            var n;
            n = this.Dc[t] || [];
            var r = n.length;
            if (0 < r) {
              for (var i = Array(r), o = 0; o < r; o++) i[o] = n[o];
              n = i;
            } else n = [];
            for (r = 0; r < n.length; r++)
              n[r].Ie.apply(n[r].Ma, Array.prototype.slice.call(arguments, 1));
          }),
          (Ic.prototype.gc = function (t, e, n) {
            Jc(this, t),
              (this.Dc[t] = this.Dc[t] || []),
              this.Dc[t].push({ Ie: e, Ma: n }),
              (t = this.Ue(t)) && e.apply(n, t);
          }),
          (Ic.prototype.Ic = function (t, e, n) {
            Jc(this, t), (t = this.Dc[t] || []);
            for (var r = 0; r < t.length; r++)
              if (t[r].Ie === e && (!n || n === t[r].Ma)) {
                t.splice(r, 1);
                break;
              }
          });
        var Kc = (function () {
          var t = 0,
            e = [];
          return function (n) {
            var r = n === t;
            t = n;
            for (var i = Array(8), o = 7; 0 <= o; o--)
              (i[o] =
                "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
                  n % 64
                )),
                (n = Math.floor(n / 64));
            if ((D(0 === n, "Cannot push at time == 0"), (n = i.join("")), r)) {
              for (o = 11; 0 <= o && 63 === e[o]; o--) e[o] = 0;
              e[o]++;
            } else for (o = 0; 12 > o; o++) e[o] = Math.floor(64 * Math.random());
            for (o = 0; 12 > o; o++)
              n +=
                "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
                  e[o]
                );
            return D(20 === n.length, "nextPushId: Length should be 20."), n;
          };
        })();
        la(Lc, Ic),
          (Lc.prototype.Ue = function (t) {
            return D("online" === t, "Unknown event type: " + t), [this.hc];
          }),
          ca(Lc),
          la(Mc, Ic),
          (Mc.prototype.Ue = function (t) {
            return D("visible" === t, "Unknown event type: " + t), [this.Mb];
          }),
          ca(Mc),
          (g = E.prototype),
          (g.toString = function () {
            for (var t = "", e = this.Y; e < this.o.length; e++)
              "" !== this.o[e] && (t += "/" + this.o[e]);
            return t || "/";
          }),
          (g.slice = function (t) {
            return this.o.slice(this.Y + (t || 0));
          }),
          (g.parent = function () {
            if (this.Y >= this.o.length) return null;
            for (var t = [], e = this.Y; e < this.o.length - 1; e++)
              t.push(this.o[e]);
            return new E(t, 0);
          }),
          (g.n = function (t) {
            for (var e = [], n = this.Y; n < this.o.length; n++)
              e.push(this.o[n]);
            if (t instanceof E) for (n = t.Y; n < t.o.length; n++) e.push(t.o[n]);
            else
              for (t = t.split("/"), n = 0; n < t.length; n++)
                0 < t[n].length && e.push(t[n]);
            return new E(e, 0);
          }),
          (g.e = function () {
            return this.Y >= this.o.length;
          }),
          (g.Z = function (t) {
            if (Ec(this) !== Ec(t)) return !1;
            for (var e = this.Y, n = t.Y; e <= this.o.length; e++, n++)
              if (this.o[e] !== t.o[n]) return !1;
            return !0;
          }),
          (g.contains = function (t) {
            var e = this.Y,
              n = t.Y;
            if (Ec(this) > Ec(t)) return !1;
            for (; e < this.o.length; ) {
              if (this.o[e] !== t.o[n]) return !1;
              ++e, ++n;
            }
            return !0;
          });
        var Q = new E("");
        (Pc.prototype.push = function (t) {
          0 < this.Qa.length && (this.Ha += 1),
            this.Qa.push(t),
            (this.Ha += nb(t)),
            Qc(this);
        }),
          (Pc.prototype.pop = function () {
            var t = this.Qa.pop();
            (this.Ha -= nb(t)), 0 < this.Qa.length && --this.Ha;
          }),
          (g = Tc.prototype),
          (g.Ca = function () {
            return this.A.value;
          }),
          (g.clear = function () {
            (this.A.value = null),
              (this.A.children = {}),
              (this.A.bd = 0),
              Wc(this);
          }),
          (g.kd = function () {
            return 0 < this.A.bd;
          }),
          (g.e = function () {
            return null === this.Ca() && !this.kd();
          }),
          (g.O = function (t) {
            var e = this;
            v(this.A.children, function (n, r) {
              t(new Tc(r, e, n));
            });
          }),
          (g.path = function () {
            return new E(
              null === this.Pc ? this.ud : this.Pc.path() + "/" + this.ud
            );
          }),
          (g.name = function () {
            return this.ud;
          }),
          (g.parent = function () {
            return this.Pc;
          }),
          (g = Zc.prototype),
          (g.Oa = function (t, e) {
            return new Zc(
              this.La,
              this.ba.Oa(t, e, this.La).X(null, null, !1, null, null)
            );
          }),
          (g.remove = function (t) {
            return new Zc(
              this.La,
              this.ba.remove(t, this.La).X(null, null, !1, null, null)
            );
          }),
          (g.get = function (t) {
            for (var e, n = this.ba; !n.e(); ) {
              if (((e = this.La(t, n.key)), 0 === e)) return n.value;
              0 > e ? (n = n.left) : 0 < e && (n = n.right);
            }
            return null;
          }),
          (g.e = function () {
            return this.ba.e();
          }),
          (g.count = function () {
            return this.ba.count();
          }),
          (g.Gc = function () {
            return this.ba.Gc();
          }),
          (g.ec = function () {
            return this.ba.ec();
          }),
          (g.ha = function (t) {
            return this.ba.ha(t);
          }),
          (g.Wb = function (t) {
            return new bd(this.ba, null, this.La, !1, t);
          }),
          (g.Xb = function (t, e) {
            return new bd(this.ba, t, this.La, !1, e);
          }),
          (g.Zb = function (t, e) {
            return new bd(this.ba, t, this.La, !0, e);
          }),
          (g.We = function (t) {
            return new bd(this.ba, null, this.La, !0, t);
          }),
          (g = dd.prototype),
          (g.X = function (t, e, n, r, i) {
            return new dd(
              null != t ? t : this.key,
              null != e ? e : this.value,
              null != n ? n : this.color,
              null != r ? r : this.left,
              null != i ? i : this.right
            );
          }),
          (g.count = function () {
            return this.left.count() + 1 + this.right.count();
          }),
          (g.e = function () {
            return !1;
          }),
          (g.ha = function (t) {
            return this.left.ha(t) || t(this.key, this.value) || this.right.ha(t);
          }),
          (g.Gc = function () {
            return ed(this).key;
          }),
          (g.ec = function () {
            return this.right.e() ? this.key : this.right.ec();
          }),
          (g.Oa = function (t, e, n) {
            var r, i;
            return (
              (i = this),
              (r = n(t, i.key)),
              (i =
                0 > r
                  ? i.X(null, null, null, i.left.Oa(t, e, n), null)
                  : 0 === r
                  ? i.X(null, e, null, null, null)
                  : i.X(null, null, null, null, i.right.Oa(t, e, n))),
              gd(i)
            );
          }),
          (g.remove = function (t, e) {
            var n, r;
            if (((n = this), 0 > e(t, n.key)))
              n.left.e() || n.left.ea() || n.left.left.ea() || (n = id(n)),
                (n = n.X(null, null, null, n.left.remove(t, e), null));
            else {
              if (
                (n.left.ea() && (n = jd(n)),
                n.right.e() ||
                  n.right.ea() ||
                  n.right.left.ea() ||
                  ((n = kd(n)), n.left.left.ea() && ((n = jd(n)), (n = kd(n)))),
                0 === e(t, n.key))
              ) {
                if (n.right.e()) return $c;
                (r = ed(n.right)),
                  (n = n.X(r.key, r.value, null, null, hd(n.right)));
              }
              n = n.X(null, null, null, null, n.right.remove(t, e));
            }
            return gd(n);
          }),
          (g.ea = function () {
            return this.color;
          }),
          (g = md.prototype),
          (g.X = function () {
            return this;
          }),
          (g.Oa = function (t, e) {
            return new dd(t, e, null);
          }),
          (g.remove = function () {
            return this;
          }),
          (g.count = function () {
            return 0;
          }),
          (g.e = function () {
            return !0;
          }),
          (g.ha = function () {
            return !1;
          }),
          (g.Gc = function () {
            return null;
          }),
          (g.ec = function () {
            return null;
          }),
          (g.ea = function () {
            return !1;
          });
        var $c = new md();
        (g = O.prototype),
          (g.J = function () {
            return !1;
          }),
          (g.C = function () {
            return this.aa || L;
          }),
          (g.fa = function (t) {
            return this.k.e() ? this : new O(this.k, t, this.yb);
          }),
          (g.Q = function (t) {
            return ".priority" === t
              ? this.C()
              : ((t = this.k.get(t)), null === t ? L : t);
          }),
          (g.P = function (t) {
            var e = K(t);
            return null === e ? this : this.Q(e).P(N(t));
          }),
          (g.Da = function (t) {
            return null !== this.k.get(t);
          }),
          (g.T = function (t, e) {
            if (
              (D(e, "We should always be passing snapshot nodes"),
              ".priority" === t)
            )
              return this.fa(e);
            var n,
              r,
              i = new C(t, e);
            return (
              e.e()
                ? ((n = this.k.remove(t)), (i = Ac(this.yb, i, this.k)))
                : ((n = this.k.Oa(t, e)), (i = yc(this.yb, i, this.k))),
              (r = n.e() ? L : this.aa),
              new O(n, r, i)
            );
          }),
          (g.F = function (t, e) {
            var n = K(t);
            if (null === n) return e;
            D(
              ".priority" !== K(t) || 1 === Ec(t),
              ".priority must be the last token in a path"
            );
            var r = this.Q(n).F(N(t), e);
            return this.T(n, r);
          }),
          (g.e = function () {
            return this.k.e();
          }),
          (g.Eb = function () {
            return this.k.count();
          });
        var nd = /^(0|[1-9]\d*)$/;
        (g = O.prototype),
          (g.H = function (t) {
            if (this.e()) return null;
            var e = {},
              n = 0,
              r = 0,
              i = !0;
            if (
              (this.O(H, function (o, a) {
                (e[o] = a.H(t)),
                  n++,
                  i && nd.test(o) ? (r = Math.max(r, Number(o))) : (i = !1);
              }),
              !t && i && r < 2 * n)
            ) {
              var o,
                a = [];
              for (o in e) a[o] = e[o];
              return a;
            }
            return t && !this.C().e() && (e[".priority"] = this.C().H()), e;
          }),
          (g.hash = function () {
            if (null === this.Db) {
              var t = "";
              this.C().e() || (t += "priority:" + Fc(this.C().H()) + ":"),
                this.O(H, function (e, n) {
                  var r = n.hash();
                  "" !== r && (t += ":" + e + ":" + r);
                }),
                (this.Db = "" === t ? "" : Ob(t));
            }
            return this.Db;
          }),
          (g.Ve = function (t, e, n) {
            return (n = od(this, n))
              ? (t = ad(n, new C(t, e)))
                ? t.name
                : null
              : ad(this.k, t);
          }),
          (g.O = function (t, e) {
            var n = od(this, t);
            return n
              ? n.ha(function (t) {
                  return e(t.name, t.R);
                })
              : this.k.ha(e);
          }),
          (g.Wb = function (t) {
            return this.Xb(t.Hc(), t);
          }),
          (g.Xb = function (t, e) {
            var n = od(this, e);
            if (n)
              return n.Xb(t, function (t) {
                return t;
              });
            for (
              var n = this.k.Xb(t.name, qb), r = cd(n);
              null != r && 0 > e.compare(r, t);
  
            )
              M(n), (r = cd(n));
            return n;
          }),
          (g.We = function (t) {
            return this.Zb(t.Fc(), t);
          }),
          (g.Zb = function (t, e) {
            var n = od(this, e);
            if (n)
              return n.Zb(t, function (t) {
                return t;
              });
            for (
              var n = this.k.Zb(t.name, qb), r = cd(n);
              null != r && 0 < e.compare(r, t);
  
            )
              M(n), (r = cd(n));
            return n;
          }),
          (g.sc = function (t) {
            return this.e()
              ? t.e()
                ? 0
                : -1
              : t.J() || t.e()
              ? 1
              : t === qc
              ? -1
              : 0;
          }),
          (g.nb = function (t) {
            if (t === tc || Pa(this.yb.cc, t.toString())) return this;
            var e = this.yb,
              n = this.k;
            D(
              t !== tc,
              "KeyIndex always exists and isn't meant to be added to the IndexMap."
            );
            for (var r = [], i = !1, n = n.Wb(qb), o = M(n); o; )
              (i = i || t.xc(o.R)), r.push(o), (o = M(n));
            return (
              (r = i ? zc(r, nc(t)) : mc),
              (i = t.toString()),
              (n = Ta(e.cc)),
              (n[i] = t),
              (t = Ta(e.od)),
              (t[i] = r),
              new O(this.k, this.aa, new xc(t, n))
            );
          }),
          (g.yc = function (t) {
            return t === tc || Pa(this.yb.cc, t.toString());
          }),
          (g.Z = function (t) {
            if (t === this) return !0;
            if (t.J()) return !1;
            if (this.C().Z(t.C()) && this.k.count() === t.k.count()) {
              var e = this.Wb(H);
              t = t.Wb(H);
              for (var n = M(e), r = M(t); n && r; ) {
                if (n.name !== r.name || !n.R.Z(r.R)) return !1;
                (n = M(e)), (r = M(t));
              }
              return null === n && null === r;
            }
            return !1;
          }),
          (g.toString = function () {
            return x(this.H(!0));
          });
        var rd = Math.log(2),
          L = new O(new Zc(tb), null, Bc);
        la(ud, O),
          (g = ud.prototype),
          (g.sc = function (t) {
            return t === this ? 0 : 1;
          }),
          (g.Z = function (t) {
            return t === this;
          }),
          (g.C = function () {
            return this;
          }),
          (g.Q = function () {
            return L;
          }),
          (g.e = function () {
            return !1;
          });
        var qc = new ud(),
          oc = new C("[MIN_NAME]", L),
          vc = new C("[MAX_NAME]", qc),
          wd = new Zc(function (t, e) {
            return t === e ? 0 : t < e ? -1 : 1;
          });
        (g = vd.prototype),
          (g.e = function () {
            return null === this.value && this.children.e();
          }),
          (g.subtree = function (t) {
            if (t.e()) return this;
            var e = this.children.get(K(t));
            return null !== e ? e.subtree(N(t)) : R;
          }),
          (g.set = function (t, e) {
            if (t.e()) return new vd(e, this.children);
            var n = K(t),
              r = (this.children.get(n) || R).set(N(t), e),
              n = this.children.Oa(n, r);
            return new vd(this.value, n);
          }),
          (g.remove = function (t) {
            if (t.e()) return this.children.e() ? R : new vd(null, this.children);
            var e = K(t),
              n = this.children.get(e);
            return n
              ? ((t = n.remove(N(t))),
                (e = t.e() ? this.children.remove(e) : this.children.Oa(e, t)),
                null === this.value && e.e() ? R : new vd(this.value, e))
              : this;
          }),
          (g.get = function (t) {
            if (t.e()) return this.value;
            var e = this.children.get(K(t));
            return e ? e.get(N(t)) : null;
          });
        var R = new vd(null);
        vd.prototype.toString = function () {
          var t = {};
          return (
            Hd(this, function (e, n) {
              t[e.toString()] = n.toString();
            }),
            x(t)
          );
        };
        var Kd = /[\[\].#$\/\u0000-\u001F\u007F]/,
          Ld = /[\[\].#$\u0000-\u001F\u007F]/;
        (Gb.prototype.find = function (t) {
          if (null != this.B) return this.B.P(t);
          if (t.e() || null == this.k) return null;
          var e = K(t);
          return (t = N(t)), this.k.contains(e) ? this.k.get(e).find(t) : null;
        }),
          (Gb.prototype.O = function (t) {
            null !== this.k &&
              Hc(this.k, function (e, n) {
                t(e, n);
              });
          }),
          (Zd.prototype.Mc = function () {
            return this.path.e()
              ? new Zd(this.source, Q)
              : new Zd(this.source, N(this.path));
          }),
          (Zd.prototype.toString = function () {
            return (
              "Operation(" +
              this.path +
              ": " +
              this.source.toString() +
              " listen_complete)"
            );
          }),
          (ae.prototype.Mc = function (t) {
            return this.path.e()
              ? ((t = this.children.subtree(new E(t))),
                t.e()
                  ? null
                  : t.value
                  ? new ce(this.source, Q, t.value)
                  : new ae(this.source, Q, t))
              : (D(
                  K(this.path) === t,
                  "Can't get a merge for a child not on the path of the operation"
                ),
                new ae(this.source, N(this.path), this.children));
          }),
          (ae.prototype.toString = function () {
            return (
              "Operation(" +
              this.path +
              ": " +
              this.source.toString() +
              " merge: " +
              this.children.toString() +
              ")"
            );
          }),
          (de.prototype.Mc = function (t) {
            return this.path.e()
              ? null != this.Ob.value
                ? (D(
                    this.Ob.children.e(),
                    "affectedTree should not have overlapping affected paths."
                  ),
                  this)
                : ((t = this.Ob.subtree(new E(t))), new de(Q, t, this.Id))
              : (D(
                  K(this.path) === t,
                  "operationForChild called for unrelated child."
                ),
                new de(N(this.path), this.Ob, this.Id));
          }),
          (de.prototype.toString = function () {
            return (
              "Operation(" +
              this.path +
              ": " +
              this.source.toString() +
              " ack write revert=" +
              this.Id +
              " affectedTree=" +
              this.Ob +
              ")"
            );
          }),
          (ce.prototype.Mc = function (t) {
            return this.path.e()
              ? new ce(this.source, Q, this.Ga.Q(t))
              : new ce(this.source, N(this.path), this.Ga);
          }),
          (ce.prototype.toString = function () {
            return (
              "Operation(" +
              this.path +
              ": " +
              this.source.toString() +
              " overwrite: " +
              this.Ga.toString() +
              ")"
            );
          });
        var ge = 0,
          be = 1,
          ee = 2,
          $d = 3,
          fe = new he(!0, !1, null, !1),
          ie = new he(!1, !0, null, !1);
        (he.prototype.toString = function () {
          return this.ee
            ? "user"
            : this.Ee
            ? "server(queryID=" + this.Hb + ")"
            : "server";
        }),
          (je.prototype.j = function () {
            return this.A;
          }),
          (oe.prototype.w = function () {
            return this.Ld;
          }),
          (se.prototype.Te = function () {
            return null;
          }),
          (se.prototype.fe = function () {
            return null;
          });
        var te = new se();
        (ue.prototype.Te = function (t) {
          var e = this.Ka.N;
          return ne(e, t)
            ? e.j().Q(t)
            : ((e = null != this.yd ? new je(this.yd, !0, !1) : this.Ka.w()),
              this.xf.qc(t, e));
        }),
          (ue.prototype.fe = function (t, e, n) {
            var r = null != this.yd ? this.yd : re(this.Ka);
            return (t = this.xf.Xd(r, e, 1, n, t)), 0 === t.length ? null : t[0];
          }),
          (we.prototype.eb = function (t, e, n, r) {
            var i,
              o = new xe();
            if (e.type === ge)
              e.source.ee
                ? (n = ye(this, t, e.path, e.Ga, n, r, o))
                : (D(e.source.Se, "Unknown source."),
                  (i = e.source.Ee || (le(t.w()) && !e.path.e())),
                  (n = ze(this, t, e.path, e.Ga, n, r, i, o)));
            else if (e.type === be)
              e.source.ee
                ? (n = Ae(this, t, e.path, e.children, n, r, o))
                : (D(e.source.Se, "Unknown source."),
                  (i = e.source.Ee || le(t.w())),
                  (n = Be(this, t, e.path, e.children, n, r, i, o)));
            else if (e.type === ee)
              if (e.Id)
                if (((e = e.path), null != n.lc(e))) n = t;
                else {
                  if (
                    ((i = new ue(n, t, r)),
                    (r = t.N.j()),
                    e.e() || ".priority" === K(e))
                  )
                    ke(t.w())
                      ? (e = n.Aa(re(t)))
                      : ((e = t.w().j()),
                        D(
                          e instanceof O,
                          "serverChildren would be complete if leaf node"
                        ),
                        (e = n.rc(e))),
                      (e = this.U.ya(r, e, o));
                  else {
                    var a = K(e),
                      s = n.qc(a, t.w());
                    null == s && ne(t.w(), a) && (s = r.Q(a)),
                      (e =
                        null != s
                          ? this.U.F(r, a, s, N(e), i, o)
                          : t.N.j().Da(a)
                          ? this.U.F(r, a, L, N(e), i, o)
                          : r),
                      e.e() &&
                        ke(t.w()) &&
                        ((r = n.Aa(re(t))), r.J() && (e = this.U.ya(e, r, o)));
                  }
                  (r = ke(t.w()) || null != n.lc(Q)),
                    (n = pe(t, e, r, this.U.Na()));
                }
              else n = Ce(this, t, e.path, e.Ob, n, r, o);
            else {
              if (e.type !== $d) throw Mb("Unknown operation type: " + e.type);
              (r = e.path),
                (e = t.w()),
                (i = e.j()),
                (a = e.da || r.e()),
                (n = De(this, new oe(t.N, new je(i, a, e.Sb)), r, n, te, o));
            }
            return (
              (o = Na(o.fb)),
              (r = n),
              (e = r.N),
              e.da &&
                ((i = e.j().J() || e.j().e()),
                (a = qe(t)),
                (0 < o.length ||
                  !t.N.da ||
                  (i && !e.j().Z(a)) ||
                  !e.j().C().Z(a.C())) &&
                  o.push(Ee(qe(r)))),
              new ve(n, o)
            );
          }),
          (Ge.prototype.Ff = function (t, e) {
            if (null == t.Xa || null == e.Xa)
              throw Mb("Should only compare child_ events.");
            return this.g.compare(new C(t.Xa, t.Ja), new C(e.Xa, e.Ja));
          }),
          (g = Pe.prototype),
          (g.w = function () {
            return this.Ka.w().j();
          }),
          (g.hb = function (t) {
            var e = re(this.Ka);
            return e && (T(this.V.m) || (!t.e() && !e.Q(K(t)).e()))
              ? e.P(t)
              : null;
          }),
          (g.e = function () {
            return 0 === this.Za.length;
          }),
          (g.Nb = function (t) {
            this.Za.push(t);
          }),
          (g.kb = function (t, e) {
            var n = [];
            if (e) {
              D(null == t, "A cancel should cancel all event registrations.");
              var r = this.V.path;
              ya(this.Za, function (t) {
                (t = t.Me(e, r)) && n.push(t);
              });
            }
            if (t) {
              for (var i = [], o = 0; o < this.Za.length; ++o) {
                var a = this.Za[o];
                if (a.matches(t)) {
                  if (t.Xe()) {
                    i = i.concat(this.Za.slice(o + 1));
                    break;
                  }
                } else i.push(a);
              }
              this.Za = i;
            } else this.Za = [];
            return n;
          }),
          (g.eb = function (t, e, n) {
            t.type === be &&
              null !== t.source.Hb &&
              (D(
                re(this.Ka),
                "We should always have a full cache before handling merges"
              ),
              D(
                qe(this.Ka),
                "Missing event cache, even though we have a server cache"
              ));
            var r = this.Ka;
            return (
              (t = this.hf.eb(r, t, e, n)),
              (e = this.hf),
              (n = t.Sd),
              D(n.N.j().yc(e.U.g), "Event snap not indexed"),
              D(n.w().j().yc(e.U.g), "Server snap not indexed"),
              D(
                ke(t.Sd.w()) || !ke(r.w()),
                "Once a server snap is complete, it should never go back"
              ),
              (this.Ka = t.Sd),
              Ue(this, t.Df, t.Sd.N.j(), null)
            );
          }),
          (We.prototype.Yb = function () {
            var t = this.Md.wb();
            return "value" === this.hd ? t.path : t.getParent().path;
          }),
          (We.prototype.ge = function () {
            return this.hd;
          }),
          (We.prototype.Tb = function () {
            return this.ae.Tb(this);
          }),
          (We.prototype.toString = function () {
            return this.Yb().toString() + ":" + this.hd + ":" + x(this.Md.be());
          }),
          (Xe.prototype.Yb = function () {
            return this.path;
          }),
          (Xe.prototype.ge = function () {
            return "cancel";
          }),
          (Xe.prototype.Tb = function () {
            return this.ae.Tb(this);
          }),
          (Xe.prototype.toString = function () {
            return this.path.toString() + ":cancel";
          }),
          ($e.prototype.add = function (t) {
            this.jd.push(t);
          }),
          ($e.prototype.Yb = function () {
            return this.qa;
          }),
          (g = Qe.prototype),
          (g.F = function (t, e, n, r, i, o) {
            return (
              D(
                t.yc(this.g),
                "A node must be indexed if only a child is updated"
              ),
              (i = t.Q(e)),
              i.P(r).Z(n.P(r)) && i.e() == n.e()
                ? t
                : (null != o &&
                    (n.e()
                      ? t.Da(e)
                        ? df(o, new S(Le, i, e))
                        : D(
                            t.J(),
                            "A child remove without an old child only makes sense on a leaf node"
                          )
                      : i.e()
                      ? df(o, new S(Me, n, e))
                      : df(o, new S(Ie, n, e, i))),
                  t.J() && n.e() ? t : t.T(e, n).nb(this.g))
            );
          }),
          (g.ya = function (t, e, n) {
            return (
              null != n &&
                (t.J() ||
                  t.O(H, function (t, r) {
                    e.Da(t) || df(n, new S(Le, r, t));
                  }),
                e.J() ||
                  e.O(H, function (e, r) {
                    if (t.Da(e)) {
                      var i = t.Q(e);
                      i.Z(r) || df(n, new S(Ie, r, e, i));
                    } else df(n, new S(Me, r, e));
                  })),
              e.nb(this.g)
            );
          }),
          (g.fa = function (t, e) {
            return t.e() ? L : t.fa(e);
          }),
          (g.Na = function () {
            return !1;
          }),
          (g.Ub = function () {
            return this;
          }),
          (g = Se.prototype),
          (g.matches = function (t) {
            return (
              0 >= this.g.compare(this.Uc, t) && 0 >= this.g.compare(t, this.vc)
            );
          }),
          (g.F = function (t, e, n, r, i, o) {
            return (
              this.matches(new C(e, n)) || (n = L), this.he.F(t, e, n, r, i, o)
            );
          }),
          (g.ya = function (t, e, n) {
            e.J() && (e = L);
            var r = e.nb(this.g),
              r = r.fa(L),
              i = this;
            return (
              e.O(H, function (t, e) {
                i.matches(new C(t, e)) || (r = r.T(t, L));
              }),
              this.he.ya(t, r, n)
            );
          }),
          (g.fa = function (t) {
            return t;
          }),
          (g.Na = function () {
            return !0;
          }),
          (g.Ub = function () {
            return this.he;
          }),
          (g = Re.prototype),
          (g.F = function (t, e, n, r, i, o) {
            return (
              this.sa.matches(new C(e, n)) || (n = L),
              t.Q(e).Z(n)
                ? t
                : t.Eb() < this.oa
                ? this.sa.Ub().F(t, e, n, r, i, o)
                : kf(this, t, e, n, i, o)
            );
          }),
          (g.ya = function (t, e, n) {
            var r;
            if (e.J() || e.e()) r = L.nb(this.g);
            else if (2 * this.oa < e.Eb() && e.yc(this.g)) {
              (r = L.nb(this.g)),
                (e = this.Ib
                  ? e.Zb(this.sa.vc, this.g)
                  : e.Xb(this.sa.Uc, this.g));
              for (var i = 0; 0 < e.Pa.length && i < this.oa; ) {
                var o,
                  a = M(e);
                if (
                  !(o = this.Ib
                    ? 0 >= this.g.compare(this.sa.Uc, a)
                    : 0 >= this.g.compare(a, this.sa.vc))
                )
                  break;
                (r = r.T(a.name, a.R)), i++;
              }
            } else {
              (r = e.nb(this.g)), (r = r.fa(L));
              var s, c, l;
              if (this.Ib) {
                (e = r.We(this.g)), (s = this.sa.vc), (c = this.sa.Uc);
                var u = nc(this.g);
                l = function (t, e) {
                  return u(e, t);
                };
              } else
                (e = r.Wb(this.g)),
                  (s = this.sa.Uc),
                  (c = this.sa.vc),
                  (l = nc(this.g));
              for (var i = 0, f = !1; 0 < e.Pa.length; )
                (a = M(e)),
                  !f && 0 >= l(s, a) && (f = !0),
                  (o = f && i < this.oa && 0 >= l(a, c))
                    ? i++
                    : (r = r.T(a.name, L));
            }
            return this.sa.Ub().ya(t, r, n);
          }),
          (g.fa = function (t) {
            return t;
          }),
          (g.Na = function () {
            return !0;
          }),
          (g.Ub = function () {
            return this.sa.Ub();
          });
        var Me = "child_added",
          Le = "child_removed",
          Ie = "child_changed",
          Je = "child_moved",
          Ne = "value",
          mf = new lf();
        (g = lf.prototype),
          (g.ne = function (t) {
            var e = nf(this);
            return (e.xa = !0), (e.oa = t), (e.mb = "l"), e;
          }),
          (g.oe = function (t) {
            var e = nf(this);
            return (e.xa = !0), (e.oa = t), (e.mb = "r"), e;
          }),
          (g.Nd = function (t, e) {
            var r = nf(this);
            return (
              (r.ka = !0),
              n(t) || (t = null),
              (r.dc = t),
              null != e ? ((r.Kb = !0), (r.zb = e)) : ((r.Kb = !1), (r.zb = "")),
              r
            );
          }),
          (g.gd = function (t, e) {
            var r = nf(this);
            return (
              (r.na = !0),
              n(t) || (t = null),
              (r.ac = t),
              n(e) ? ((r.Rb = !0), (r.xb = e)) : ((r.vg = !1), (r.xb = "")),
              r
            );
          }),
          (g.toString = function () {
            return x(pf(this));
          });
        var tf = new sf(new vd(null));
        (sf.prototype.Ed = function (t) {
          return t.e() ? tf : ((t = Ad(this.W, t, R)), new sf(t));
        }),
          (sf.prototype.e = function () {
            return this.W.e();
          }),
          (sf.prototype.apply = function (t) {
            return zf(Q, this.W, t);
          }),
          (Af.prototype.j = function (t) {
            return this.Jd.P(t);
          }),
          (Af.prototype.toString = function () {
            return this.Jd.toString();
          }),
          (Bf.prototype.getToken = function (t) {
            return this.oc.INTERNAL.getToken(t).then(null, function (t) {
              return t && "auth/token-not-initialized" === t.code
                ? (I(
                    "Got auth/token-not-initialized error.  Treating as null token."
                  ),
                  null)
                : Promise.reject(t);
            });
          }),
          (g = Df.prototype),
          (g.Ed = function (t) {
            var e = Ea(this.la, function (e) {
              return e.Zc === t;
            });
            D(0 <= e, "removeWrite called with nonexistent writeId.");
            var n = this.la[e];
            this.la.splice(e, 1);
            for (
              var r = n.visible, i = !1, o = this.la.length - 1;
              r && 0 <= o;
  
            ) {
              var a = this.la[o];
              a.visible &&
                (o >= e && Ff(a, n.path)
                  ? (r = !1)
                  : n.path.contains(a.path) && (i = !0)),
                o--;
            }
            if (r) {
              if (i)
                (this.S = Gf(this.la, Hf, Q)),
                  (this.Bc =
                    0 < this.la.length ? this.la[this.la.length - 1].Zc : -1);
              else if (n.Ga) this.S = this.S.Ed(n.path);
              else {
                var s = this;
                v(n.children, function (t, e) {
                  s.S = s.S.Ed(n.path.n(e));
                });
              }
              return !0;
            }
            return !1;
          }),
          (g.Aa = function (t, e, n, r) {
            if (n || r) {
              var i = yf(this.S, t);
              return !r && i.e()
                ? e
                : r || null != e || null != wf(i, Q)
                ? ((i = Gf(
                    this.la,
                    function (e) {
                      return (
                        (e.visible || r) &&
                        (!n || !(0 <= xa(n, e.Zc))) &&
                        (e.path.contains(t) || t.contains(e.path))
                      );
                    },
                    t
                  )),
                  (e = e || L),
                  i.apply(e))
                : null;
            }
            return (
              (i = wf(this.S, t)),
              null != i
                ? i
                : ((i = yf(this.S, t)),
                  i.e()
                    ? e
                    : null != e || null != wf(i, Q)
                    ? ((e = e || L), i.apply(e))
                    : null)
            );
          }),
          (g.rc = function (t, e) {
            var n = L,
              r = wf(this.S, t);
            if (r)
              r.J() ||
                r.O(H, function (t, e) {
                  n = n.T(t, e);
                });
            else if (e) {
              var i = yf(this.S, t);
              e.O(H, function (t, e) {
                var r = yf(i, new E(t)).apply(e);
                n = n.T(t, r);
              }),
                ya(xf(i), function (t) {
                  n = n.T(t.name, t.R);
                });
            } else
              (i = yf(this.S, t)),
                ya(xf(i), function (t) {
                  n = n.T(t.name, t.R);
                });
            return n;
          }),
          (g.ad = function (t, e, n, r) {
            return (
              D(
                n || r,
                "Either existingEventSnap or existingServerSnap must exist"
              ),
              (t = t.n(e)),
              null != wf(this.S, t)
                ? null
                : ((t = yf(this.S, t)), t.e() ? r.P(e) : t.apply(r.P(e)))
            );
          }),
          (g.qc = function (t, e, n) {
            t = t.n(e);
            var r = wf(this.S, t);
            return null != r
              ? r
              : ne(n, e)
              ? yf(this.S, t).apply(n.j().Q(e))
              : null;
          }),
          (g.lc = function (t) {
            return wf(this.S, t);
          }),
          (g.Xd = function (t, e, n, r, i, o) {
            var a;
            if (((t = yf(this.S, t)), (a = wf(t, Q)), null == a)) {
              if (null == e) return [];
              a = t.apply(e);
            }
            if (((a = a.nb(o)), a.e() || a.J())) return [];
            for (
              e = [], t = nc(o), i = i ? a.Zb(n, o) : a.Xb(n, o), o = M(i);
              o && e.length < r;
  
            )
              0 !== t(o, n) && e.push(o), (o = M(i));
            return e;
          }),
          (g = If.prototype),
          (g.Aa = function (t, e, n) {
            return this.W.Aa(this.Lb, t, e, n);
          }),
          (g.rc = function (t) {
            return this.W.rc(this.Lb, t);
          }),
          (g.ad = function (t, e, n) {
            return this.W.ad(this.Lb, t, e, n);
          }),
          (g.lc = function (t) {
            return this.W.lc(this.Lb.n(t));
          }),
          (g.Xd = function (t, e, n, r, i) {
            return this.W.Xd(this.Lb, t, e, n, r, i);
          }),
          (g.qc = function (t, e) {
            return this.W.qc(this.Lb, t, e);
          }),
          (g.n = function (t) {
            return new If(this.Lb.n(t), this.W);
          }),
          (Jf.prototype.lf = function () {
            var t,
              e = this.Vc.get(),
              n = {},
              r = !1;
            for (t in e) 0 < e[t] && eb(this.rf, t) && ((n[t] = e[t]), (r = !0));
            r && this.va.ye(n),
              hc(q(this.lf, this), Math.floor(6e5 * Math.random()));
          }),
          (Lf.prototype.get = function () {
            return Ta(this.tc);
          }),
          (Kf.prototype.get = function () {
            var t = this.Ef.get(),
              e = Ta(t);
            if (this.rd) for (var n in this.rd) e[n] -= this.rd[n];
            return (this.rd = t), e;
          });
        var Nf = {},
          Of = {};
        (g = Rf.prototype),
          (g.$e = function (t, e, n, r) {
            var i = t.path.toString();
            this.f("Listen called for " + i + " " + t.ja());
            var o = Sf(t, n),
              a = {};
            (this.$[o] = a), (t = rf(t.m));
            var s = this;
            Tf(this, i + ".json", t, function (t, e) {
              var c = e;
              404 === t && (t = c = null),
                null === t && s.Gb(i, c, !1, n),
                w(s.$, o) === a &&
                  r(
                    t
                      ? 401 == t
                        ? "permission_denied"
                        : "rest_error:" + t
                      : "ok",
                    null
                  );
            });
          }),
          (g.uf = function (t, e) {
            var n = Sf(t, e);
            delete this.$[n];
          }),
          (g.kf = function () {}),
          (g.re = function () {}),
          (g.cf = function () {}),
          (g.xd = function () {}),
          (g.put = function () {}),
          (g.af = function () {}),
          (g.ye = function () {});
        var Cb = "websocket",
          Db = "long_polling",
          Xf = null;
        "undefined" != typeof MozWebSocket
          ? (Xf = MozWebSocket)
          : "undefined" != typeof WebSocket && (Xf = WebSocket);
        var Zf;
        (Yf.prototype.open = function (t, e) {
          (this.ib = e),
            (this.Xf = t),
            this.f("Websocket connecting to " + this.Ke),
            (this.wc = !1),
            xb.set("previous_websocket_failure", !0);
          try {
            this.Ia = new Xf(this.Ke);
          } catch (t) {
            this.f("Error instantiating WebSocket.");
            var n = t.message || t.data;
            return n && this.f(n), void this.bb();
          }
          var r = this;
          (this.Ia.onopen = function () {
            r.f("Websocket connected."), (r.wc = !0);
          }),
            (this.Ia.onclose = function () {
              r.f("Websocket connection was disconnected."),
                (r.Ia = null),
                r.bb();
            }),
            (this.Ia.onmessage = function (t) {
              if (null !== r.Ia)
                if (
                  ((t = t.data),
                  (r.pb += t.length),
                  Mf(r.Va, "bytes_received", t.length),
                  $f(r),
                  null !== r.frames)
                )
                  ag(r, t);
                else {
                  t: {
                    if (
                      (D(null === r.frames, "We already have a frame buffer"),
                      6 >= t.length)
                    ) {
                      var e = Number(t);
                      if (!isNaN(e)) {
                        (r.Fe = e), (r.frames = []), (t = null);
                        break t;
                      }
                    }
                    (r.Fe = 1), (r.frames = []);
                  }
                  null !== t && ag(r, t);
                }
            }),
            (this.Ia.onerror = function (t) {
              r.f("WebSocket error.  Closing connection."),
                (t = t.message || t.data) && r.f(t),
                r.bb();
            });
        }),
          (Yf.prototype.start = function () {}),
          (Yf.isAvailable = function () {
            var t = !1;
            if ("undefined" != typeof navigator && navigator.userAgent) {
              var e = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
              e && 1 < e.length && 4.4 > parseFloat(e[1]) && (t = !0);
            }
            return !t && null !== Xf && !Zf;
          }),
          (Yf.responsesRequiredToBeHealthy = 2),
          (Yf.healthyTimeout = 3e4),
          (g = Yf.prototype),
          (g.sd = function () {
            xb.remove("previous_websocket_failure");
          }),
          (g.send = function (t) {
            $f(this),
              (t = x(t)),
              (this.qb += t.length),
              Mf(this.Va, "bytes_sent", t.length),
              (t = bc(t, 16384)),
              1 < t.length && bg(this, String(t.length));
            for (var e = 0; e < t.length; e++) bg(this, t[e]);
          }),
          (g.Tc = function () {
            (this.Ab = !0),
              this.zc && (clearInterval(this.zc), (this.zc = null)),
              this.Ia && (this.Ia.close(), (this.Ia = null));
          }),
          (g.bb = function () {
            this.Ab ||
              (this.f("WebSocket is closing itself"),
              this.Tc(),
              this.ib && (this.ib(this.wc), (this.ib = null)));
          }),
          (g.close = function () {
            this.Ab || (this.f("WebSocket is being closed"), this.Tc());
          });
        var dg, eg;
        (cg.prototype.open = function (t, e) {
          (this.Ne = 0), (this.ia = e), (this.bf = new Uf(t)), (this.Ab = !1);
          var n = this;
          (this.sb = setTimeout(function () {
            n.f("Timed out trying to connect."), n.bb(), (n.sb = null);
          }, Math.floor(3e4))),
            Yb(function () {
              if (!n.Ab) {
                n.Ta = new fg(
                  function (t, e, r, i, o) {
                    if ((gg(n, arguments), n.Ta))
                      if (
                        (n.sb && (clearTimeout(n.sb), (n.sb = null)),
                        (n.wc = !0),
                        "start" == t)
                      )
                        (n.id = e), (n.ff = r);
                      else {
                        if ("close" !== t)
                          throw Error("Unrecognized command received: " + t);
                        e
                          ? ((n.Ta.Kd = !1),
                            Vf(n.bf, e, function () {
                              n.bb();
                            }))
                          : n.bb();
                      }
                  },
                  function (t, e) {
                    gg(n, arguments), Wf(n.bf, t, e);
                  },
                  function () {
                    n.bb();
                  },
                  n.Yc
                );
                var t = { start: "t" };
                (t.ser = Math.floor(1e8 * Math.random())),
                  n.Ta.Qd && (t.cb = n.Ta.Qd),
                  (t.v = "5"),
                  n.tf && (t.s = n.tf),
                  n.Cb && (t.ls = n.Cb),
                  "undefined" != typeof location &&
                    location.href &&
                    -1 !== location.href.indexOf("firebaseio.com") &&
                    (t.r = "f"),
                  (t = n.Yc(t)),
                  n.f("Connecting via long-poll to " + t),
                  hg(n.Ta, t, function () {});
              }
            });
        }),
          (cg.prototype.start = function () {
            var t = this.Ta,
              e = this.ff;
            for (t.Vf = this.id, t.Wf = e, t.Ud = !0; ig(t); );
            (t = this.id),
              (e = this.ff),
              (this.fc = document.createElement("iframe"));
            var n = { dframe: "t" };
            (n.id = t),
              (n.pw = e),
              (this.fc.src = this.Yc(n)),
              (this.fc.style.display = "none"),
              document.body.appendChild(this.fc);
          }),
          (cg.isAvailable = function () {
            return (
              dg ||
              (!eg &&
                "undefined" != typeof document &&
                null != document.createElement &&
                !(
                  "object" == typeof window &&
                  window.chrome &&
                  window.chrome.extension &&
                  !/^chrome/.test(window.location.href)
                ) &&
                !("object" == typeof Windows && "object" == typeof Windows.rg) &&
                !0)
            );
          }),
          (g = cg.prototype),
          (g.sd = function () {}),
          (g.Tc = function () {
            (this.Ab = !0),
              this.Ta && (this.Ta.close(), (this.Ta = null)),
              this.fc && (document.body.removeChild(this.fc), (this.fc = null)),
              this.sb && (clearTimeout(this.sb), (this.sb = null));
          }),
          (g.bb = function () {
            this.Ab ||
              (this.f("Longpoll is closing itself"),
              this.Tc(),
              this.ia && (this.ia(this.wc), (this.ia = null)));
          }),
          (g.close = function () {
            this.Ab || (this.f("Longpoll is being closed."), this.Tc());
          }),
          (g.send = function (t) {
            (t = x(t)),
              (this.qb += t.length),
              Mf(this.Va, "bytes_sent", t.length),
              (t = mb(t)),
              (t = ab(t, !0)),
              (t = bc(t, 1840));
            for (var e = 0; e < t.length; e++) {
              var n = this.Ta;
              n.Qc.push({ jg: this.Ne, pg: t.length, Pe: t[e] }),
                n.Ud && ig(n),
                this.Ne++;
            }
          }),
          (fg.prototype.close = function () {
            if (((this.Ud = !1), this.Ea)) {
              this.Ea.gb.body.innerHTML = "";
              var t = this;
              setTimeout(function () {
                null !== t.Ea && (document.body.removeChild(t.Ea), (t.Ea = null));
              }, Math.floor(0));
            }
            var e = this.ib;
            e && ((this.ib = null), e());
          });
        var mg = [cg, Yf];
        (og.prototype.ua = function (t) {
          zg(this, { t: "d", d: t });
        }),
          (og.prototype.wd = function (t) {
            wg(this), this.te(t);
          }),
          (og.prototype.close = function () {
            2 !== this.Ua &&
              (this.f("Closing realtime connection."),
              (this.Ua = 2),
              vg(this),
              this.ia && (this.ia(), (this.ia = null)));
          });
        var Bg = 0,
          Dg = 0;
        (g = Ag.prototype),
          (g.ua = function (t, e, n) {
            var r = ++this.ig;
            (t = { r: r, a: t, b: e }),
              this.f(x(t)),
              D(
                this.ma,
                "sendRequest call when we're not connected not allowed."
              ),
              this.Fa.ua(t),
              n && (this.Gd[r] = n);
          }),
          (g.$e = function (t, e, n, r) {
            var i = t.ja(),
              o = t.path.toString();
            this.f("Listen called for " + o + " " + i),
              (this.$[o] = this.$[o] || {}),
              D(
                qf(t.m) || !T(t.m),
                "listen() called for non-default but complete query"
              ),
              D(!this.$[o][i], "listen() called twice for same path/queryId."),
              (t = { G: r, ld: e, eg: t, tag: n }),
              (this.$[o][i] = t),
              this.ma && Eg(this, t);
          }),
          (g.kf = function (t) {
            (this.ob = t),
              this.f("Auth token refreshed"),
              this.ob
                ? Gg(this)
                : this.ma && this.ua("unauth", {}, function () {}),
              ((t && 40 === t.length) || kc(t)) &&
                (this.f(
                  "Admin auth credential detected.  Reducing max reconnect time."
                ),
                (this.td = 3e4));
          }),
          (g.uf = function (t, e) {
            var n = t.path.toString(),
              r = t.ja();
            if (
              (this.f("Unlisten called for " + n + " " + r),
              D(
                qf(t.m) || !T(t.m),
                "unlisten() called for non-default but complete query"
              ),
              Fg(this, n, r) && this.ma)
            ) {
              var i = pf(t.m);
              this.f("Unlisten on " + n + " for " + r),
                (n = { p: n }),
                e && ((n.q = i), (n.t = e)),
                this.ua("n", n);
            }
          }),
          (g.re = function (t, e, n) {
            this.ma
              ? Ig(this, "o", t, e, n)
              : this.Kc.push({ we: t, action: "o", data: e, G: n });
          }),
          (g.cf = function (t, e, n) {
            this.ma
              ? Ig(this, "om", t, e, n)
              : this.Kc.push({ we: t, action: "om", data: e, G: n });
          }),
          (g.xd = function (t, e) {
            this.ma
              ? Ig(this, "oc", t, null, e)
              : this.Kc.push({ we: t, action: "oc", data: null, G: e });
          }),
          (g.put = function (t, e, n, r) {
            Jg(this, "p", t, e, n, r);
          }),
          (g.af = function (t, e, n, r) {
            Jg(this, "m", t, e, n, r);
          }),
          (g.ye = function (t) {
            this.ma &&
              ((t = { c: t }),
              this.f("reportStats", t),
              this.ua("s", t, function (t) {
                "ok" !== t.s &&
                  this.f("reportStats", "Error sending stats: " + t.d);
              }));
          }),
          (g.wd = function (t) {
            if ("r" in t) {
              this.f("from server: " + x(t));
              var e = t.r,
                n = this.Gd[e];
              n && (delete this.Gd[e], n(t.b));
            } else {
              if ("error" in t)
                throw "A server-side error has occurred: " + t.error;
              "a" in t &&
                ((e = t.a),
                (t = t.b),
                this.f("handleServerMessage", e, t),
                "d" === e
                  ? this.Gb(t.p, t.d, !1, t.t)
                  : "m" === e
                  ? this.Gb(t.p, t.d, !0, t.t)
                  : "c" === e
                  ? Lg(this, t.p, t.q)
                  : "ac" === e
                  ? Hg(this, t.s, t.d)
                  : "sd" === e
                  ? this.ze
                    ? this.ze(t)
                    : "msg" in t &&
                      "undefined" != typeof console &&
                      console.log(
                        "FIREBASE: " + t.msg.replace("\n", "\nFIREBASE: ")
                      )
                  : Ub(
                      "Unrecognized action received from server: " +
                        x(e) +
                        "\nAre you using the latest client?"
                    ));
            }
          }),
          (g.Lc = function (t, e) {
            if (
              (this.f("connection ready"),
              (this.ma = !0),
              (this.Ac = new Date().getTime()),
              this.ue({ serverTimeOffset: t - new Date().getTime() }),
              (this.Cb = e),
              this.Re)
            ) {
              var n = {};
              (n["sdk.js." + firebase.SDK_VERSION.replace(/\./g, "-")] = 1),
                pb()
                  ? (n["framework.cordova"] = 1)
                  : "object" == typeof navigator &&
                    "ReactNative" === navigator.product &&
                    (n["framework.reactnative"] = 1),
                this.ye(n);
            }
            Mg(this), (this.Re = !1), this.Jc(!0);
          }),
          (g.Zf = function (t) {
            t &&
              !this.Mb &&
              this.Sa === this.td &&
              (this.f("Window became visible.  Reducing delay."),
              (this.Sa = 1e3),
              this.Fa || Cg(this, 0)),
              (this.Mb = t);
          }),
          (g.Yf = function (t) {
            t
              ? (this.f("Browser went online."),
                (this.Sa = 1e3),
                this.Fa || Cg(this, 0))
              : (this.f("Browser went offline.  Killing connection."),
                this.Fa && this.Fa.close());
          }),
          (g.df = function () {
            this.f("data client disconnected"), (this.ma = !1), (this.Fa = null);
            for (var t = 0; t < this.pa.length; t++) {
              var e = this.pa[t];
              e &&
                "h" in e.mf &&
                e.fg &&
                (e.G && e.G("disconnect"), delete this.pa[t], this.Oc--);
            }
            0 === this.Oc && (this.pa = []),
              (this.Gd = {}),
              Og(this) &&
                (this.Mb
                  ? this.Ac &&
                    (3e4 < new Date().getTime() - this.Ac && (this.Sa = 1e3),
                    (this.Ac = null))
                  : (this.f("Window isn't visible.  Delaying reconnect."),
                    (this.Sa = this.td),
                    (this.me = new Date().getTime())),
                (t = Math.max(0, this.Sa - (new Date().getTime() - this.me))),
                (t *= Math.random()),
                this.f("Trying to reconnect in " + t + "ms"),
                Cg(this, t),
                (this.Sa = Math.min(this.td, 1.3 * this.Sa))),
              this.Jc(!1);
          }),
          (g.ab = function (t) {
            I("Interrupting connection for reason: " + t),
              (this.qd[t] = !0),
              this.Fa
                ? this.Fa.close()
                : (this.ub && (clearTimeout(this.ub), (this.ub = null)),
                  this.ma && this.df());
          }),
          (g.kc = function (t) {
            I("Resuming connection for reason: " + t),
              delete this.qd[t],
              Sa(this.qd) && ((this.Sa = 1e3), this.Fa || Cg(this, 0));
          });
        var Sg = { TIMESTAMP: { ".sv": "timestamp" } };
        (g = Pg.prototype),
          (g.app = null),
          (g.jf = function (t) {
            return (
              Tg(this, "ref"),
              y("database.ref", 0, 1, arguments.length),
              n(t) ? this.ba.n(t) : this.ba
            );
          }),
          (g.gg = function (t) {
            Tg(this, "database.refFromURL"),
              y("database.refFromURL", 1, 1, arguments.length);
            var e = Wb(t);
            Xd("database.refFromURL", e);
            var n = e.jc;
            return (
              n.host !== this.ta.L.host &&
                Vb(
                  "database.refFromURL: Host name does not match the current database: (found " +
                    n.host +
                    " but expected " +
                    this.ta.L.host +
                    ")"
                ),
              this.jf(e.path.toString())
            );
          }),
          (g.Pf = function () {
            y("database.goOffline", 0, 0, arguments.length),
              Tg(this, "goOffline"),
              this.ta.ab();
          }),
          (g.Qf = function () {
            y("database.goOnline", 0, 0, arguments.length),
              Tg(this, "goOnline"),
              this.ta.kc();
          }),
          Object.defineProperty(Pg.prototype, "app", {
            get: function () {
              return this.ta.app;
            },
          }),
          (Rg.prototype.delete = function () {
            Tg(this.Ya, "delete");
            var t = Ug.Vb(),
              e = this.Ya.ta;
            return (
              w(t.lb, e.app.name) !== e &&
                Vb("Database " + e.app.name + " has already been deleted."),
              e.ab(),
              delete t.lb[e.app.name],
              (this.Ya.ta = null),
              (this.Ya.ba = null),
              (this.Ya = this.Ya.INTERNAL = null),
              firebase.Promise.resolve()
            );
          }),
          (Pg.prototype.ref = Pg.prototype.jf),
          (Pg.prototype.refFromURL = Pg.prototype.gg),
          (Pg.prototype.goOnline = Pg.prototype.Qf),
          (Pg.prototype.goOffline = Pg.prototype.Pf),
          (Rg.prototype.delete = Rg.prototype.delete),
          (V.prototype.H = function () {
            return (
              y("Firebase.DataSnapshot.val", 0, 0, arguments.length), this.A.H()
            );
          }),
          (V.prototype.val = V.prototype.H),
          (V.prototype.be = function () {
            return (
              y("Firebase.DataSnapshot.exportVal", 0, 0, arguments.length),
              this.A.H(!0)
            );
          }),
          (V.prototype.exportVal = V.prototype.be),
          (V.prototype.toJSON = function () {
            return (
              y("Firebase.DataSnapshot.toJSON", 0, 1, arguments.length), this.be()
            );
          }),
          (V.prototype.toJSON = V.prototype.toJSON),
          (V.prototype.Lf = function () {
            return (
              y("Firebase.DataSnapshot.exists", 0, 0, arguments.length),
              !this.A.e()
            );
          }),
          (V.prototype.exists = V.prototype.Lf),
          (V.prototype.n = function (t) {
            y("Firebase.DataSnapshot.child", 0, 1, arguments.length),
              ga(t) && (t = String(t)),
              Vd("Firebase.DataSnapshot.child", t);
            var e = new E(t),
              n = this.V.n(e);
            return new V(this.A.P(e), n, H);
          }),
          (V.prototype.child = V.prototype.n),
          (V.prototype.Da = function (t) {
            y("Firebase.DataSnapshot.hasChild", 1, 1, arguments.length),
              Vd("Firebase.DataSnapshot.hasChild", t);
            var e = new E(t);
            return !this.A.P(e).e();
          }),
          (V.prototype.hasChild = V.prototype.Da),
          (V.prototype.C = function () {
            return (
              y("Firebase.DataSnapshot.getPriority", 0, 0, arguments.length),
              this.A.C().H()
            );
          }),
          (V.prototype.getPriority = V.prototype.C),
          (V.prototype.forEach = function (t) {
            if (
              (y("Firebase.DataSnapshot.forEach", 1, 1, arguments.length),
              B("Firebase.DataSnapshot.forEach", 1, t, !1),
              this.A.J())
            )
              return !1;
            var e = this;
            return !!this.A.O(this.g, function (n, r) {
              return t(new V(r, e.V.n(n), H));
            });
          }),
          (V.prototype.forEach = V.prototype.forEach),
          (V.prototype.kd = function () {
            return (
              y("Firebase.DataSnapshot.hasChildren", 0, 0, arguments.length),
              !this.A.J() && !this.A.e()
            );
          }),
          (V.prototype.hasChildren = V.prototype.kd),
          (V.prototype.getKey = function () {
            return (
              y("Firebase.DataSnapshot.key", 0, 0, arguments.length),
              this.V.getKey()
            );
          }),
          gc(V.prototype, "key", V.prototype.getKey),
          (V.prototype.Eb = function () {
            return (
              y("Firebase.DataSnapshot.numChildren", 0, 0, arguments.length),
              this.A.Eb()
            );
          }),
          (V.prototype.numChildren = V.prototype.Eb),
          (V.prototype.wb = function () {
            return y("Firebase.DataSnapshot.ref", 0, 0, arguments.length), this.V;
          }),
          gc(V.prototype, "ref", V.prototype.wb),
          (g = Vg.prototype),
          (g.nf = function (t) {
            return "value" === t;
          }),
          (g.createEvent = function (t, e) {
            var n = e.m.g;
            return new We("value", this, new V(t.Ja, e.wb(), n));
          }),
          (g.Tb = function (t) {
            var e = this.tb;
            if ("cancel" === t.ge()) {
              D(
                this.rb,
                "Raising a cancel event on a listener with no cancel callback"
              );
              var n = this.rb;
              return function () {
                n.call(e, t.error);
              };
            }
            var r = this.Pb;
            return function () {
              r.call(e, t.Md);
            };
          }),
          (g.Me = function (t, e) {
            return this.rb ? new Xe(this, t, e) : null;
          }),
          (g.matches = function (t) {
            return (
              t instanceof Vg &&
              (!t.Pb || !this.Pb || (t.Pb === this.Pb && t.tb === this.tb))
            );
          }),
          (g.Xe = function () {
            return null !== this.Pb;
          }),
          (g = Wg.prototype),
          (g.nf = function (t) {
            return (
              (t = "children_added" === t ? "child_added" : t),
              ("children_removed" === t ? "child_removed" : t) in this.ga
            );
          }),
          (g.Me = function (t, e) {
            return this.rb ? new Xe(this, t, e) : null;
          }),
          (g.createEvent = function (t, e) {
            D(null != t.Xa, "Child events should have a childName.");
            var n = e.wb().n(t.Xa);
            return new We(t.type, this, new V(t.Ja, n, e.m.g), t.Dd);
          }),
          (g.Tb = function (t) {
            var e = this.tb;
            if ("cancel" === t.ge()) {
              D(
                this.rb,
                "Raising a cancel event on a listener with no cancel callback"
              );
              var n = this.rb;
              return function () {
                n.call(e, t.error);
              };
            }
            var r = this.ga[t.hd];
            return function () {
              r.call(e, t.Md, t.Dd);
            };
          }),
          (g.matches = function (t) {
            if (t instanceof Wg) {
              if (!this.ga || !t.ga) return !0;
              if (this.tb === t.tb) {
                var e = La(t.ga);
                if (e === La(this.ga)) {
                  if (1 === e) {
                    var e = Ma(t.ga),
                      n = Ma(this.ga);
                    return !(
                      n !== e ||
                      (t.ga[e] && this.ga[n] && t.ga[e] !== this.ga[n])
                    );
                  }
                  return Ka(this.ga, function (e, n) {
                    return t.ga[n] === e;
                  });
                }
              }
            }
            return !1;
          }),
          (g.Xe = function () {
            return null !== this.ga;
          }),
          (g = Xg.prototype),
          (g.e = function () {
            return Sa(this.za);
          }),
          (g.eb = function (t, e, n) {
            var r = t.source.Hb;
            if (null !== r)
              return (
                (r = w(this.za, r)),
                D(null != r, "SyncTree gave us an op for an invalid query."),
                r.eb(t, e, n)
              );
            var i = [];
            return (
              v(this.za, function (r) {
                i = i.concat(r.eb(t, e, n));
              }),
              i
            );
          }),
          (g.Nb = function (t, e, n, r, i) {
            var o = t.ja(),
              a = w(this.za, o);
            if (!a) {
              var a = n.Aa(i ? r : null),
                s = !1;
              a ? (s = !0) : ((a = r instanceof O ? n.rc(r) : L), (s = !1)),
                (a = new Pe(t, new oe(new je(a, s, !1), new je(r, i, !1)))),
                (this.za[o] = a);
            }
            return a.Nb(e), Ve(a, e);
          }),
          (g.kb = function (t, e, n) {
            var r = t.ja(),
              i = [],
              o = [],
              a = null != Yg(this);
            if ("default" === r) {
              var s = this;
              v(this.za, function (t, r) {
                (o = o.concat(t.kb(e, n))),
                  t.e() && (delete s.za[r], T(t.V.m) || i.push(t.V));
              });
            } else {
              var c = w(this.za, r);
              c &&
                ((o = o.concat(c.kb(e, n))),
                c.e() && (delete this.za[r], T(c.V.m) || i.push(c.V)));
            }
            return (
              a && null == Yg(this) && i.push(new U(t.u, t.path)),
              { hg: i, Kf: o }
            );
          }),
          (g.hb = function (t) {
            var e = null;
            return (
              v(this.za, function (n) {
                e = e || n.hb(t);
              }),
              e
            );
          }),
          (ah.prototype.Nb = function (t, e) {
            var n = t.path,
              r = null,
              i = !1;
            Fd(this.wa, n, function (t, e) {
              var o = P(t, n);
              (r = r || e.hb(o)), (i = i || null != Yg(e));
            });
            var o = this.wa.get(n);
            o
              ? ((i = i || null != Yg(o)), (r = r || o.hb(Q)))
              : ((o = new Xg()), (this.wa = this.wa.set(n, o)));
            var a;
            null != r
              ? (a = !0)
              : ((a = !1),
                (r = L),
                Jd(this.wa.subtree(n), function (t, e) {
                  var n = e.hb(Q);
                  n && (r = r.T(t, n));
                }));
            var s = null != $g(o, t);
            if (!s && !T(t.m)) {
              var c = lh(t);
              D(!(c in this.ic), "View does not exist, but we have a tag");
              var l = mh++;
              (this.ic[c] = l), (this.De["_" + l] = c);
            }
            return (
              (a = o.Nb(t, e, new If(n, this.jb), r, a)),
              s || i || ((o = $g(o, t)), (a = a.concat(nh(this, t, o)))),
              a
            );
          }),
          (ah.prototype.kb = function (t, e, n) {
            var r = t.path,
              i = this.wa.get(r),
              o = [];
            if (i && ("default" === t.ja() || null != $g(i, t))) {
              (o = i.kb(t, e, n)),
                i.e() && (this.wa = this.wa.remove(r)),
                (i = o.hg),
                (o = o.Kf),
                (e =
                  -1 !==
                  Ea(i, function (t) {
                    return T(t.m);
                  }));
              var a = Dd(this.wa, r, function (t, e) {
                return null != Yg(e);
              });
              if (e && !a && ((r = this.wa.subtree(r)), !r.e()))
                for (var r = oh(r), s = 0; s < r.length; ++s) {
                  var c = r[s],
                    l = c.V,
                    c = ph(this, c);
                  this.Cc.Ae(qh(l), rh(this, l), c.ld, c.G);
                }
              if (!a && 0 < i.length && !n)
                if (e) this.Cc.Od(qh(t), null);
                else {
                  var u = this;
                  ya(i, function (t) {
                    t.ja();
                    var e = u.ic[lh(t)];
                    u.Cc.Od(qh(t), e);
                  });
                }
              sh(this, i);
            }
            return o;
          }),
          (ah.prototype.Aa = function (t, e) {
            var n = this.jb,
              r = Dd(this.wa, t, function (e, n) {
                var r = P(e, t);
                if ((r = n.hb(r))) return r;
              });
            return n.Aa(t, r, e, !0);
          });
        var mh = 1;
        (g = Qg.prototype),
          (g.toString = function () {
            return (this.L.Sc ? "https://" : "http://") + this.L.host;
          }),
          (g.name = function () {
            return this.L.pe;
          }),
          (g.Gb = function (t, e, n, r) {
            this.fd++;
            var i = new E(t);
            (e = this.je ? this.je(t, e) : e),
              (t = []),
              r
                ? n
                  ? ((e = Ja(e, function (t) {
                      return G(t);
                    })),
                    (t = kh(this.K, i, e, r)))
                  : ((e = G(e)), (t = gh(this.K, i, e, r)))
                : n
                ? ((r = Ja(e, function (t) {
                    return G(t);
                  })),
                  (t = fh(this.K, i, r)))
                : ((r = G(e)), (t = ch(this.K, new ce(ie, i, r)))),
              (r = i),
              0 < t.length && (r = yh(this, i)),
              cf(this.ca, r, t);
          }),
          (g.Jc = function (t) {
            vh(this, "connected", t), !1 === t && zh(this);
          }),
          (g.ue = function (t) {
            var e = this;
            cc(t, function (t, n) {
              vh(e, n, t);
            });
          }),
          (g.Jb = function (t, e, n, r) {
            this.f("set", { path: t.toString(), value: e, ug: n });
            var i = xh(this);
            e = G(e, n);
            var i = Jb(e, i),
              o = this.vd++,
              i = bh(this.K, t, i, o, !0);
            Ze(this.ca, i);
            var a = this;
            this.va.put(t.toString(), e.H(!0), function (e, n) {
              var i = "ok" === e;
              i || J("set at " + t + " failed: " + e),
                (i = eh(a.K, o, !i)),
                cf(a.ca, t, i),
                Ah(r, e, n);
            }),
              (i = Bh(this, t)),
              yh(this, i),
              cf(this.ca, i, []);
          }),
          (g.update = function (t, e, n) {
            this.f("update", { path: t.toString(), value: e });
            var r = !0,
              i = xh(this),
              o = {};
            if (
              (v(e, function (t, e) {
                r = !1;
                var n = G(t);
                o[e] = Jb(n, i);
              }),
              r)
            )
              I("update() called with empty data.  Don't do anything."),
                Ah(n, "ok");
            else {
              var a = this.vd++,
                s = dh(this.K, t, o, a);
              Ze(this.ca, s);
              var c = this;
              this.va.af(t.toString(), e, function (e, r) {
                var i = "ok" === e;
                i || J("update at " + t + " failed: " + e);
                var i = eh(c.K, a, !i),
                  o = t;
                0 < i.length && (o = yh(c, t)), cf(c.ca, o, i), Ah(n, e, r);
              }),
                v(e, function (e, n) {
                  var r = Bh(c, t.n(n));
                  yh(c, r);
                }),
                cf(this.ca, t, []);
            }
          }),
          (g.xd = function (t, e) {
            var n = this;
            this.va.xd(t.toString(), function (r, i) {
              "ok" === r && Yd(n.ia, t), Ah(e, r, i);
            });
          }),
          (g.ab = function () {
            this.Ra && this.Ra.ab("repo_interrupt");
          }),
          (g.kc = function () {
            this.Ra && this.Ra.kc("repo_interrupt");
          }),
          (g.Be = function (t) {
            if ("undefined" != typeof console) {
              t
                ? (this.Vc || (this.Vc = new Kf(this.Va)), (t = this.Vc.get()))
                : (t = this.Va.get());
              var e,
                n = Ba(
                  Oa(t),
                  function (t, e) {
                    return Math.max(e.length, t);
                  },
                  0
                );
              for (e in t) {
                for (var r = t[e], i = e.length; i < n + 2; i++) e += " ";
                console.log(e + r);
              }
            }
          }),
          (g.Ce = function (t) {
            Mf(this.Va, t), (this.og.rf[t] = !0);
          }),
          (g.f = function (t) {
            var e = "";
            this.Ra && (e = this.Ra.id + ":"), I(e, arguments);
          }),
          (Ug.prototype.ab = function () {
            for (var t in this.lb) this.lb[t].ab();
          }),
          (Ug.prototype.kc = function () {
            for (var t in this.lb) this.lb[t].kc();
          }),
          (Ug.prototype.ce = function (t) {
            this.wf = t;
          }),
          ca(Ug),
          (Ug.prototype.interrupt = Ug.prototype.ab),
          (Ug.prototype.resume = Ug.prototype.kc);
        var W = {};
        (W.nc = Ag),
          (W.DataConnection = W.nc),
          (Ag.prototype.ng = function (t, e) {
            this.ua("q", { p: t }, e);
          }),
          (W.nc.prototype.simpleListen = W.nc.prototype.ng),
          (Ag.prototype.Hf = function (t, e) {
            this.ua("echo", { d: t }, e);
          }),
          (W.nc.prototype.echo = W.nc.prototype.Hf),
          (Ag.prototype.interrupt = Ag.prototype.ab),
          (W.zf = og),
          (W.RealTimeConnection = W.zf),
          (og.prototype.sendRequest = og.prototype.ua),
          (og.prototype.close = og.prototype.close),
          (W.Rf = function (t) {
            var e = Ag.prototype.put;
            return (
              (Ag.prototype.put = function (r, i, o, a) {
                n(a) && (a = t()), e.call(this, r, i, o, a);
              }),
              function () {
                Ag.prototype.put = e;
              }
            );
          }),
          (W.hijackHash = W.Rf),
          (W.yf = zb),
          (W.ConnectionTarget = W.yf),
          (W.ja = function (t) {
            return t.ja();
          }),
          (W.queryIdentifier = W.ja),
          (W.Uf = function (t) {
            return t.u.Ra.$;
          }),
          (W.listens = W.Uf),
          (W.ce = function (t) {
            Ug.Vb().ce(t);
          }),
          (W.forceRestClient = W.ce),
          (W.Context = Ug),
          (g = X.prototype),
          (g.wb = function () {
            return (
              y("Query.ref", 0, 0, arguments.length), new U(this.u, this.path)
            );
          }),
          (g.gc = function (t, e, n, r) {
            y("Query.on", 2, 4, arguments.length),
              Td("Query.on", t, !1),
              B("Query.on", 2, e, !1);
            var i = Th("Query.on", n, r);
            if ("value" === t)
              Fh(this.u, this, new Vg(e, i.cancel || null, i.Ma || null));
            else {
              var o = {};
              (o[t] = e), Fh(this.u, this, new Wg(o, i.cancel, i.Ma));
            }
            return e;
          }),
          (g.Ic = function (t, e, n) {
            y("Query.off", 0, 3, arguments.length),
              Td("Query.off", t, !0),
              B("Query.off", 2, e, !0),
              ob("Query.off", 3, n);
            var r = null,
              i = null;
            "value" === t
              ? (r = new Vg(e || null, null, n || null))
              : t &&
                (e && ((i = {}), (i[t] = e)), (r = new Wg(i, null, n || null))),
              (i = this.u),
              (r = ".info" === K(this.path) ? i.pd.kb(this, r) : i.K.kb(this, r)),
              af(i.ca, this.path, r);
          }),
          (g.$f = function (t, e) {
            function n(s) {
              o && ((o = !1), i.Ic(t, n), e && e.call(r.Ma, s), a.resolve(s));
            }
            y("Query.once", 1, 4, arguments.length),
              Td("Query.once", t, !1),
              B("Query.once", 2, e, !0);
            var r = Th("Query.once", arguments[2], arguments[3]),
              i = this,
              o = !0,
              a = new ib();
            return (
              kb(a.ra),
              this.gc(t, n, function (e) {
                i.Ic(t, n), r.cancel && r.cancel.call(r.Ma, e), a.reject(e);
              }),
              a.ra
            );
          }),
          (g.ne = function (t) {
            if (
              (y("Query.limitToFirst", 1, 1, arguments.length),
              !ga(t) || Math.floor(t) !== t || 0 >= t)
            )
              throw Error(
                "Query.limitToFirst: First argument must be a positive integer."
              );
            if (this.m.xa)
              throw Error(
                "Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast)."
              );
            return new X(this.u, this.path, this.m.ne(t), this.Nc);
          }),
          (g.oe = function (t) {
            if (
              (y("Query.limitToLast", 1, 1, arguments.length),
              !ga(t) || Math.floor(t) !== t || 0 >= t)
            )
              throw Error(
                "Query.limitToLast: First argument must be a positive integer."
              );
            if (this.m.xa)
              throw Error(
                "Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast)."
              );
            return new X(this.u, this.path, this.m.oe(t), this.Nc);
          }),
          (g.ag = function (t) {
            if ((y("Query.orderByChild", 1, 1, arguments.length), "$key" === t))
              throw Error(
                'Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.'
              );
            if ("$priority" === t)
              throw Error(
                'Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.'
              );
            if ("$value" === t)
              throw Error(
                'Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.'
              );
            Vd("Query.orderByChild", t), Sh(this, "Query.orderByChild");
            var e = new E(t);
            if (e.e())
              throw Error(
                "Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead."
              );
            return (
              (e = new pc(e)),
              (e = of(this.m, e)),
              Qh(e),
              new X(this.u, this.path, e, !0)
            );
          }),
          (g.bg = function () {
            y("Query.orderByKey", 0, 0, arguments.length),
              Sh(this, "Query.orderByKey");
            var t = of(this.m, tc);
            return Qh(t), new X(this.u, this.path, t, !0);
          }),
          (g.cg = function () {
            y("Query.orderByPriority", 0, 0, arguments.length),
              Sh(this, "Query.orderByPriority");
            var t = of(this.m, H);
            return Qh(t), new X(this.u, this.path, t, !0);
          }),
          (g.dg = function () {
            y("Query.orderByValue", 0, 0, arguments.length),
              Sh(this, "Query.orderByValue");
            var t = of(this.m, wc);
            return Qh(t), new X(this.u, this.path, t, !0);
          }),
          (g.Nd = function (t, e) {
            y("Query.startAt", 0, 2, arguments.length),
              Od("Query.startAt", t, this.path, !0),
              Ud("Query.startAt", e);
            var r = this.m.Nd(t, e);
            if ((Rh(r), Qh(r), this.m.ka))
              throw Error(
                "Query.startAt: Starting point was already set (by another call to startAt or equalTo)."
              );
            return n(t) || (e = t = null), new X(this.u, this.path, r, this.Nc);
          }),
          (g.gd = function (t, e) {
            y("Query.endAt", 0, 2, arguments.length),
              Od("Query.endAt", t, this.path, !0),
              Ud("Query.endAt", e);
            var n = this.m.gd(t, e);
            if ((Rh(n), Qh(n), this.m.na))
              throw Error(
                "Query.endAt: Ending point was already set (by another call to endAt or equalTo)."
              );
            return new X(this.u, this.path, n, this.Nc);
          }),
          (g.If = function (t, e) {
            if (
              (y("Query.equalTo", 1, 2, arguments.length),
              Od("Query.equalTo", t, this.path, !1),
              Ud("Query.equalTo", e),
              this.m.ka)
            )
              throw Error(
                "Query.equalTo: Starting point was already set (by another call to startAt or equalTo)."
              );
            if (this.m.na)
              throw Error(
                "Query.equalTo: Ending point was already set (by another call to endAt or equalTo)."
              );
            return this.Nd(t, e).gd(t, e);
          }),
          (g.toString = function () {
            y("Query.toString", 0, 0, arguments.length);
            for (var t = this.path, e = "", n = t.Y; n < t.o.length; n++)
              "" !== t.o[n] && (e += "/" + encodeURIComponent(String(t.o[n])));
            return this.u.toString() + (e || "/");
          }),
          (g.toJSON = function () {
            return y("Query.toJSON", 0, 1, arguments.length), this.toString();
          }),
          (g.ja = function () {
            var t = ac(pf(this.m));
            return "{}" === t ? "default" : t;
          }),
          (g.isEqual = function (t) {
            if ((y("Query.isEqual", 1, 1, arguments.length), !(t instanceof X)))
              throw Error(
                "Query.isEqual failed: First argument must be an instance of firebase.database.Query."
              );
            var e = this.u === t.u,
              n = this.path.Z(t.path),
              r = this.ja() === t.ja();
            return e && n && r;
          }),
          (X.prototype.on = X.prototype.gc),
          (X.prototype.off = X.prototype.Ic),
          (X.prototype.once = X.prototype.$f),
          (X.prototype.limitToFirst = X.prototype.ne),
          (X.prototype.limitToLast = X.prototype.oe),
          (X.prototype.orderByChild = X.prototype.ag),
          (X.prototype.orderByKey = X.prototype.bg),
          (X.prototype.orderByPriority = X.prototype.cg),
          (X.prototype.orderByValue = X.prototype.dg),
          (X.prototype.startAt = X.prototype.Nd),
          (X.prototype.endAt = X.prototype.gd),
          (X.prototype.equalTo = X.prototype.If),
          (X.prototype.toString = X.prototype.toString),
          (X.prototype.isEqual = X.prototype.isEqual),
          gc(X.prototype, "ref", X.prototype.wb),
          (Y.prototype.cancel = function (t) {
            y("Firebase.onDisconnect().cancel", 0, 1, arguments.length),
              B("Firebase.onDisconnect().cancel", 1, t, !0);
            var e = new ib();
            return this.ta.xd(this.qa, jb(e, t)), e.ra;
          }),
          (Y.prototype.cancel = Y.prototype.cancel),
          (Y.prototype.remove = function (t) {
            y("Firebase.onDisconnect().remove", 0, 1, arguments.length),
              Wd("Firebase.onDisconnect().remove", this.qa),
              B("Firebase.onDisconnect().remove", 1, t, !0);
            var e = new ib();
            return Ch(this.ta, this.qa, null, jb(e, t)), e.ra;
          }),
          (Y.prototype.remove = Y.prototype.remove),
          (Y.prototype.set = function (t, e) {
            y("Firebase.onDisconnect().set", 1, 2, arguments.length),
              Wd("Firebase.onDisconnect().set", this.qa),
              Od("Firebase.onDisconnect().set", t, this.qa, !1),
              B("Firebase.onDisconnect().set", 2, e, !0);
            var n = new ib();
            return Ch(this.ta, this.qa, t, jb(n, e)), n.ra;
          }),
          (Y.prototype.set = Y.prototype.set),
          (Y.prototype.Jb = function (t, e, n) {
            y("Firebase.onDisconnect().setWithPriority", 2, 3, arguments.length),
              Wd("Firebase.onDisconnect().setWithPriority", this.qa),
              Od("Firebase.onDisconnect().setWithPriority", t, this.qa, !1),
              Sd("Firebase.onDisconnect().setWithPriority", 2, e),
              B("Firebase.onDisconnect().setWithPriority", 3, n, !0);
            var r = new ib();
            return Dh(this.ta, this.qa, t, e, jb(r, n)), r.ra;
          }),
          (Y.prototype.setWithPriority = Y.prototype.Jb),
          (Y.prototype.update = function (t, e) {
            if (
              (y("Firebase.onDisconnect().update", 1, 2, arguments.length),
              Wd("Firebase.onDisconnect().update", this.qa),
              ea(t))
            ) {
              for (var n = {}, r = 0; r < t.length; ++r) n["" + r] = t[r];
              (t = n),
                J(
                  "Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children."
                );
            }
            return (
              Rd("Firebase.onDisconnect().update", t, this.qa),
              B("Firebase.onDisconnect().update", 2, e, !0),
              (n = new ib()),
              Eh(this.ta, this.qa, t, jb(n, e)),
              n.ra
            );
          }),
          (Y.prototype.update = Y.prototype.update);
        var Z = {
          Mf: function () {
            dg = Zf = !0;
          },
        };
        if (
          ((Z.forceLongPolling = Z.Mf),
          (Z.Nf = function () {
            eg = !0;
          }),
          (Z.forceWebSockets = Z.Nf),
          (Z.Tf = function () {
            return Yf.isAvailable();
          }),
          (Z.isWebSocketsAvailable = Z.Tf),
          (Z.lg = function (t, e) {
            t.u.Ra.ze = e;
          }),
          (Z.setSecurityDebugCallback = Z.lg),
          (Z.Be = function (t, e) {
            t.u.Be(e);
          }),
          (Z.stats = Z.Be),
          (Z.Ce = function (t, e) {
            t.u.Ce(e);
          }),
          (Z.statsIncrementCounter = Z.Ce),
          (Z.fd = function (t) {
            return t.u.fd;
          }),
          (Z.dataUpdateCount = Z.fd),
          (Z.Sf = function (t, e) {
            t.u.je = e;
          }),
          (Z.interceptServerData = Z.Sf),
          la(U, X),
          (g = U.prototype),
          (g.getKey = function () {
            return (
              y("Firebase.key", 0, 0, arguments.length),
              this.path.e() ? null : Oc(this.path)
            );
          }),
          (g.n = function (t) {
            if ((y("Firebase.child", 1, 1, arguments.length), ga(t)))
              t = String(t);
            else if (!(t instanceof E))
              if (null === K(this.path)) {
                var e = t;
                e && (e = e.replace(/^\/*\.info(\/|$)/, "/")),
                  Vd("Firebase.child", e);
              } else Vd("Firebase.child", t);
            return new U(this.u, this.path.n(t));
          }),
          (g.getParent = function () {
            y("Firebase.parent", 0, 0, arguments.length);
            var t = this.path.parent();
            return null === t ? null : new U(this.u, t);
          }),
          (g.Of = function () {
            y("Firebase.ref", 0, 0, arguments.length);
            for (var t = this; null !== t.getParent(); ) t = t.getParent();
            return t;
          }),
          (g.Gf = function () {
            return this.u.Ya;
          }),
          (g.set = function (t, e) {
            y("Firebase.set", 1, 2, arguments.length),
              Wd("Firebase.set", this.path),
              Od("Firebase.set", t, this.path, !1),
              B("Firebase.set", 2, e, !0);
            var n = new ib();
            return this.u.Jb(this.path, t, null, jb(n, e)), n.ra;
          }),
          (g.update = function (t, e) {
            if (
              (y("Firebase.update", 1, 2, arguments.length),
              Wd("Firebase.update", this.path),
              ea(t))
            ) {
              for (var n = {}, r = 0; r < t.length; ++r) n["" + r] = t[r];
              (t = n),
                J(
                  "Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children."
                );
            }
            return (
              Rd("Firebase.update", t, this.path),
              B("Firebase.update", 2, e, !0),
              (n = new ib()),
              this.u.update(this.path, t, jb(n, e)),
              n.ra
            );
          }),
          (g.Jb = function (t, e, n) {
            if (
              (y("Firebase.setWithPriority", 2, 3, arguments.length),
              Wd("Firebase.setWithPriority", this.path),
              Od("Firebase.setWithPriority", t, this.path, !1),
              Sd("Firebase.setWithPriority", 2, e),
              B("Firebase.setWithPriority", 3, n, !0),
              ".length" === this.getKey() || ".keys" === this.getKey())
            )
              throw (
                "Firebase.setWithPriority failed: " +
                this.getKey() +
                " is a read-only object."
              );
            var r = new ib();
            return this.u.Jb(this.path, t, e, jb(r, n)), r.ra;
          }),
          (g.remove = function (t) {
            return (
              y("Firebase.remove", 0, 1, arguments.length),
              Wd("Firebase.remove", this.path),
              B("Firebase.remove", 1, t, !0),
              this.set(null, t)
            );
          }),
          (g.transaction = function (t, e, r) {
            if (
              (y("Firebase.transaction", 1, 3, arguments.length),
              Wd("Firebase.transaction", this.path),
              B("Firebase.transaction", 1, t, !1),
              B("Firebase.transaction", 2, e, !0),
              n(r) && "boolean" != typeof r)
            )
              throw Error(
                A("Firebase.transaction", 3, !0) + "must be a boolean."
              );
            if (".length" === this.getKey() || ".keys" === this.getKey())
              throw (
                "Firebase.transaction failed: " +
                this.getKey() +
                " is a read-only object."
              );
            "undefined" == typeof r && (r = !0);
            var i = new ib();
            return (
              ha(e) && kb(i.ra),
              Gh(
                this.u,
                this.path,
                t,
                function (t, n, r) {
                  t ? i.reject(t) : i.resolve(new Ph(n, r)), ha(e) && e(t, n, r);
                },
                r
              ),
              i.ra
            );
          }),
          (g.kg = function (t, e) {
            y("Firebase.setPriority", 1, 2, arguments.length),
              Wd("Firebase.setPriority", this.path),
              Sd("Firebase.setPriority", 1, t),
              B("Firebase.setPriority", 2, e, !0);
            var n = new ib();
            return this.u.Jb(this.path.n(".priority"), t, null, jb(n, e)), n.ra;
          }),
          (g.push = function (t, e) {
            y("Firebase.push", 0, 2, arguments.length),
              Wd("Firebase.push", this.path),
              Od("Firebase.push", t, this.path, !0),
              B("Firebase.push", 2, e, !0);
            var n = wh(this.u),
              r = Kc(n),
              n = this.n(r),
              i = this.n(r),
              r =
                null != t
                  ? n.set(t, e).then(function () {
                      return i;
                    })
                  : hb.resolve(i);
            return (
              (n.then = q(r.then, r)),
              (n.catch = q(r.then, r, void 0)),
              ha(e) && kb(r),
              n
            );
          }),
          (g.ib = function () {
            return (
              Wd("Firebase.onDisconnect", this.path), new Y(this.u, this.path)
            );
          }),
          (U.prototype.child = U.prototype.n),
          (U.prototype.set = U.prototype.set),
          (U.prototype.update = U.prototype.update),
          (U.prototype.setWithPriority = U.prototype.Jb),
          (U.prototype.remove = U.prototype.remove),
          (U.prototype.transaction = U.prototype.transaction),
          (U.prototype.setPriority = U.prototype.kg),
          (U.prototype.push = U.prototype.push),
          (U.prototype.onDisconnect = U.prototype.ib),
          gc(U.prototype, "database", U.prototype.Gf),
          gc(U.prototype, "key", U.prototype.getKey),
          gc(U.prototype, "parent", U.prototype.getParent),
          gc(U.prototype, "root", U.prototype.Of),
          "undefined" == typeof firebase)
        )
          throw Error(
            "Cannot install Firebase Database - be sure to load firebase-app.js first."
          );
        try {
          firebase.INTERNAL.registerService(
            "database",
            function (t) {
              var e = Ug.Vb(),
                r = t.options.databaseURL;
              n(r) ||
                Vb(
                  "Can't determine Firebase Database URL.  Be sure to include databaseURL option when calling firebase.intializeApp()."
                );
              var i = Wb(r),
                r = i.jc;
              return (
                Xd("Invalid Firebase Database URL", i),
                i.path.e() ||
                  Vb(
                    "Database URL must point to the root of a Firebase Database (not including a child path)."
                  ),
                (i = w(e.lb, t.name)) &&
                  Vb(
                    "FIREBASE INTERNAL ERROR: Database initialized multiple times."
                  ),
                (i = new Qg(r, e.wf, t)),
                (e.lb[t.name] = i),
                i.Ya
              );
            },
            {
              Reference: U,
              Query: X,
              Database: Pg,
              enableLogging: Sb,
              INTERNAL: Z,
              TEST_ACCESS: W,
              ServerValue: Sg,
            }
          );
        } catch (t) {
          Vb("Failed to register the Firebase Database Service (" + t + ")");
        }
        module.exports = firebase.database;
      })();
    },
    function (t, e) {
      function n() {
        throw new Error("setTimeout has not been defined");
      }
      function r() {
        throw new Error("clearTimeout has not been defined");
      }
      function i(t) {
        if (u === setTimeout) return setTimeout(t, 0);
        if ((u === n || !u) && setTimeout)
          return (u = setTimeout), setTimeout(t, 0);
        try {
          return u(t, 0);
        } catch (e) {
          try {
            return u.call(null, t, 0);
          } catch (e) {
            return u.call(this, t, 0);
          }
        }
      }
      function o(t) {
        if (f === clearTimeout) return clearTimeout(t);
        if ((f === r || !f) && clearTimeout)
          return (f = clearTimeout), clearTimeout(t);
        try {
          return f(t);
        } catch (e) {
          try {
            return f.call(null, t);
          } catch (e) {
            return f.call(this, t);
          }
        }
      }
      function a() {
        g &&
          d &&
          ((g = !1), d.length ? (p = d.concat(p)) : (b = -1), p.length && s());
      }
      function s() {
        if (!g) {
          var t = i(a);
          g = !0;
          for (var e = p.length; e; ) {
            for (d = p, p = []; ++b < e; ) d && d[b].run();
            (b = -1), (e = p.length);
          }
          (d = null), (g = !1), o(t);
        }
      }
      function c(t, e) {
        (this.fun = t), (this.array = e);
      }
      function l() {}
      var u,
        f,
        h = (t.exports = {});
      !(function () {
        try {
          u = "function" == typeof setTimeout ? setTimeout : n;
        } catch (t) {
          u = n;
        }
        try {
          f = "function" == typeof clearTimeout ? clearTimeout : r;
        } catch (t) {
          f = r;
        }
      })();
      var d,
        p = [],
        g = !1,
        b = -1;
      (h.nextTick = function (t) {
        var e = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
        p.push(new c(t, e)), 1 !== p.length || g || i(s);
      }),
        (c.prototype.run = function () {
          this.fun.apply(null, this.array);
        }),
        (h.title = "browser"),
        (h.browser = !0),
        (h.env = {}),
        (h.argv = []),
        (h.version = ""),
        (h.versions = {}),
        (h.on = l),
        (h.addListener = l),
        (h.once = l),
        (h.off = l),
        (h.removeListener = l),
        (h.removeAllListeners = l),
        (h.emit = l),
        (h.prependListener = l),
        (h.prependOnceListener = l),
        (h.listeners = function (t) {
          return [];
        }),
        (h.binding = function (t) {
          throw new Error("process.binding is not supported");
        }),
        (h.cwd = function () {
          return "/";
        }),
        (h.chdir = function (t) {
          throw new Error("process.chdir is not supported");
        }),
        (h.umask = function () {
          return 0;
        });
    },
    function (t, e, n) {
      (function (e) {
        !(function (n) {
          function r() {}
          function i(t, e) {
            return function () {
              t.apply(e, arguments);
            };
          }
          function o(t) {
            if ("object" != typeof this)
              throw new TypeError("Promises must be constructed via new");
            if ("function" != typeof t) throw new TypeError("not a function");
            (this._state = 0),
              (this._handled = !1),
              (this._value = void 0),
              (this._deferreds = []),
              f(t, this);
          }
          function a(t, e) {
            for (; 3 === t._state; ) t = t._value;
            return 0 === t._state
              ? void t._deferreds.push(e)
              : ((t._handled = !0),
                void o._immediateFn(function () {
                  var n = 1 === t._state ? e.onFulfilled : e.onRejected;
                  if (null === n)
                    return void (1 === t._state ? s : c)(e.promise, t._value);
                  var r;
                  try {
                    r = n(t._value);
                  } catch (t) {
                    return void c(e.promise, t);
                  }
                  s(e.promise, r);
                }));
          }
          function s(t, e) {
            try {
              if (e === t)
                throw new TypeError("A promise cannot be resolved with itself.");
              if (e && ("object" == typeof e || "function" == typeof e)) {
                var n = e.then;
                if (e instanceof o)
                  return (t._state = 3), (t._value = e), void l(t);
                if ("function" == typeof n) return void f(i(n, e), t);
              }
              (t._state = 1), (t._value = e), l(t);
            } catch (e) {
              c(t, e);
            }
          }
          function c(t, e) {
            (t._state = 2), (t._value = e), l(t);
          }
          function l(t) {
            2 === t._state &&
              0 === t._deferreds.length &&
              o._immediateFn(function () {
                t._handled || o._unhandledRejectionFn(t._value);
              });
            for (var e = 0, n = t._deferreds.length; e < n; e++)
              a(t, t._deferreds[e]);
            t._deferreds = null;
          }
          function u(t, e, n) {
            (this.onFulfilled = "function" == typeof t ? t : null),
              (this.onRejected = "function" == typeof e ? e : null),
              (this.promise = n);
          }
          function f(t, e) {
            var n = !1;
            try {
              t(
                function (t) {
                  n || ((n = !0), s(e, t));
                },
                function (t) {
                  n || ((n = !0), c(e, t));
                }
              );
            } catch (t) {
              if (n) return;
              (n = !0), c(e, t);
            }
          }
          var h = setTimeout;
          (o.prototype.catch = function (t) {
            return this.then(null, t);
          }),
            (o.prototype.then = function (t, e) {
              var n = new this.constructor(r);
              return a(this, new u(t, e, n)), n;
            }),
            (o.all = function (t) {
              var e = Array.prototype.slice.call(t);
              return new o(function (t, n) {
                function r(o, a) {
                  try {
                    if (a && ("object" == typeof a || "function" == typeof a)) {
                      var s = a.then;
                      if ("function" == typeof s)
                        return void s.call(
                          a,
                          function (t) {
                            r(o, t);
                          },
                          n
                        );
                    }
                    (e[o] = a), 0 === --i && t(e);
                  } catch (t) {
                    n(t);
                  }
                }
                if (0 === e.length) return t([]);
                for (var i = e.length, o = 0; o < e.length; o++) r(o, e[o]);
              });
            }),
            (o.resolve = function (t) {
              return t && "object" == typeof t && t.constructor === o
                ? t
                : new o(function (e) {
                    e(t);
                  });
            }),
            (o.reject = function (t) {
              return new o(function (e, n) {
                n(t);
              });
            }),
            (o.race = function (t) {
              return new o(function (e, n) {
                for (var r = 0, i = t.length; r < i; r++) t[r].then(e, n);
              });
            }),
            (o._immediateFn =
              ("function" == typeof e &&
                function (t) {
                  e(t);
                }) ||
              function (t) {
                h(t, 0);
              }),
            (o._unhandledRejectionFn = function (t) {
              "undefined" != typeof console &&
                console &&
                console.warn("Possible Unhandled Promise Rejection:", t);
            }),
            (o._setImmediateFn = function (t) {
              o._immediateFn = t;
            }),
            (o._setUnhandledRejectionFn = function (t) {
              o._unhandledRejectionFn = t;
            }),
            "undefined" != typeof t && t.exports
              ? (t.exports = o)
              : n.Promise || (n.Promise = o);
        })(this);
      }.call(e, n(25).setImmediate));
    },
    function (t, e, n) {
      (function (t, e) {
        !(function (t, n) {
          "use strict";
          function r(t) {
            "function" != typeof t && (t = new Function("" + t));
            for (
              var e = new Array(arguments.length - 1), n = 0;
              n < e.length;
              n++
            )
              e[n] = arguments[n + 1];
            var r = { callback: t, args: e };
            return (g[p] = r), d(p), p++;
          }
          function i(t) {
            delete g[t];
          }
          function o(t) {
            var e = t.callback,
              r = t.args;
            switch (r.length) {
              case 0:
                e();
                break;
              case 1:
                e(r[0]);
                break;
              case 2:
                e(r[0], r[1]);
                break;
              case 3:
                e(r[0], r[1], r[2]);
                break;
              default:
                e.apply(n, r);
            }
          }
          function a(t) {
            if (b) setTimeout(a, 0, t);
            else {
              var e = g[t];
              if (e) {
                b = !0;
                try {
                  o(e);
                } finally {
                  i(t), (b = !1);
                }
              }
            }
          }
          function s() {
            d = function (t) {
              e.nextTick(function () {
                a(t);
              });
            };
          }
          function c() {
            if (t.postMessage && !t.importScripts) {
              var e = !0,
                n = t.onmessage;
              return (
                (t.onmessage = function () {
                  e = !1;
                }),
                t.postMessage("", "*"),
                (t.onmessage = n),
                e
              );
            }
          }
          function l() {
            var e = "setImmediate$" + Math.random() + "$",
              n = function (n) {
                n.source === t &&
                  "string" == typeof n.data &&
                  0 === n.data.indexOf(e) &&
                  a(+n.data.slice(e.length));
              };
            t.addEventListener
              ? t.addEventListener("message", n, !1)
              : t.attachEvent("onmessage", n),
              (d = function (n) {
                t.postMessage(e + n, "*");
              });
          }
          function u() {
            var t = new MessageChannel();
            (t.port1.onmessage = function (t) {
              var e = t.data;
              a(e);
            }),
              (d = function (e) {
                t.port2.postMessage(e);
              });
          }
          function f() {
            var t = v.documentElement;
            d = function (e) {
              var n = v.createElement("script");
              (n.onreadystatechange = function () {
                a(e), (n.onreadystatechange = null), t.removeChild(n), (n = null);
              }),
                t.appendChild(n);
            };
          }
          function h() {
            d = function (t) {
              setTimeout(a, 0, t);
            };
          }
          if (!t.setImmediate) {
            var d,
              p = 1,
              g = {},
              b = !1,
              v = t.document,
              m = Object.getPrototypeOf && Object.getPrototypeOf(t);
            (m = m && m.setTimeout ? m : t),
              "[object process]" === {}.toString.call(t.process)
                ? s()
                : c()
                ? l()
                : t.MessageChannel
                ? u()
                : v && "onreadystatechange" in v.createElement("script")
                ? f()
                : h(),
              (m.setImmediate = r),
              (m.clearImmediate = i);
          }
        })(
          "undefined" == typeof self ? ("undefined" == typeof t ? this : t) : self
        );
      }.call(
        e,
        (function () {
          return this;
        })(),
        n(20)
      ));
    },
    function (t, e, n) {
      var r = n(13);
      "string" == typeof r && (r = [[t.id, r, ""]]);
      n(5)(r, {});
      r.locals && (t.exports = r.locals);
    },
    function (t, e, n) {
      var r = n(14);
      "string" == typeof r && (r = [[t.id, r, ""]]);
      n(5)(r, {});
      r.locals && (t.exports = r.locals);
    },
    function (t, e, n) {
      function r(t, e) {
        (this._id = t), (this._clearFn = e);
      }
      var i = Function.prototype.apply;
      (e.setTimeout = function () {
        return new r(i.call(setTimeout, window, arguments), clearTimeout);
      }),
        (e.setInterval = function () {
          return new r(i.call(setInterval, window, arguments), clearInterval);
        }),
        (e.clearTimeout = e.clearInterval =
          function (t) {
            t && t.close();
          }),
        (r.prototype.unref = r.prototype.ref = function () {}),
        (r.prototype.close = function () {
          this._clearFn.call(window, this._id);
        }),
        (e.enroll = function (t, e) {
          clearTimeout(t._idleTimeoutId), (t._idleTimeout = e);
        }),
        (e.unenroll = function (t) {
          clearTimeout(t._idleTimeoutId), (t._idleTimeout = -1);
        }),
        (e._unrefActive = e.active =
          function (t) {
            clearTimeout(t._idleTimeoutId);
            var e = t._idleTimeout;
            e >= 0 &&
              (t._idleTimeoutId = setTimeout(function () {
                t._onTimeout && t._onTimeout();
              }, e));
          }),
        n(22),
        (e.setImmediate = setImmediate),
        (e.clearImmediate = clearImmediate);
    },
  ]);
  