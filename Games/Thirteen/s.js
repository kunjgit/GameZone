import { createServer as e } from "http";
import { readFile as t } from "fs";
var o = {
    connection: "keep-alive",
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
  },
  c = { "content-type": "application/json" },
  n = {
    "content-type": "text/html;charset=utf-8",
    "cache-control": "no-cache",
  },
  r = { "cache-control": "no-cache" },
  a = { "content-type": "font/ttf", "cache-control": "max-age=86400" },
  l = 1,
  f = new Map();
setInterval(() => {
  for (let [, e] of f) (performance.now() - e.t > 5e3 || !h(e, 1, "")) && m(e);
}, 1e3);
var p = (e, t) => `id:${e}\ndata:${t}\n\n`,
  h = (e, t, o) => e.o.write(p(e.p++, t + o), (t) => t && m(e)),
  i = (e, t, o) => {
    for (let [c, n] of f) c != e && h(n, t, o);
  },
  m = (e) => {
    try {
      e.o.write(p(-1, "")), e.o.end();
    } catch {}
    f.delete(e.h), i(e.h, 4, "-" + e.h);
  },
  s = (e, o, c) =>
    t("." + e, (e, t) => {
      o.writeHead(e ? 404 : 200, c), o.end(t);
    }),
  v = (e, t) => {
    t.writeHead(500), t.end();
  },
  y = {
    G: {
      "/": (e, t) => s("/index.html", t, n),
      _(e, t) {
        t.writeHead(200, o);
        let c = [...f.keys()],
          n = l++,
          r = { h: n, t: performance.now(), o: t, p: 0 };
        f.set(n, r),
          c.unshift(n),
          e.on("close", () => m(r)),
          h(r, 2, "" + c),
          i(n, 4, "" + n);
      },
      l: (e, t) => s(e.url, t, n),
      f: (e, t) => s(e.url, t, a),
      s: (e, t) => s(e.url, t, r),
    },
    P: {
      _: (e, t) =>
        (async (e) => {
          let t = [];
          for await (let o of e) t.push(o);
          return JSON.parse(Buffer.concat(t).toString());
        })(e)
          .then((e) => {
            e || (t.writeHead(500), t.end());
            let o = f.get(e[0]);
            if (o) {
              o.t = performance.now();
              let n = 0;
              for (let t of e[1]) {
                let e = f.get(t[1]);
                e && h(e, 3, JSON.stringify(t)), ++n;
              }
              t.writeHead(200, c), t.end("" + n);
            } else t.writeHead(404), t.end();
          })
          .catch(() => {}),
    },
  };
e((e, t) => {
  var o;
  ((null == (o = y[e.method[0]]) ? void 0 : o[e.url.at(-1)]) ?? v)(e, t);
}).listen(+process.env.PORT || 8080);
