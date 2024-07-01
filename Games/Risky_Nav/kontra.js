kontra = {
  init(t) {
    var n = (this.canvas =
      document.getElementById(t) || t || document.querySelector("canvas"));
    this.context = n.getContext("2d");
  },
  _noop: new Function(),
  _tick: new Function(),
};
kontra.gameLoop = function (e) {
  let t,
    n,
    a,
    r,
    o = (e = e || {}).fps || 60,
    i = 0,
    p = 1e3 / o,
    c = 1 / o,
    s =
      !1 === e.clearCanvas
        ? kontra._noop
        : function () {
            kontra.context.clearRect(
              0,
              0,
              kontra.canvas.width,
              kontra.canvas.height
            );
          };
  function d() {
    if (
      ((n = requestAnimationFrame(d)),
      (a = performance.now()),
      (r = a - t),
      (t = a),
      !(r > 1e3))
    ) {
      for (kontra._tick(), i += r; i >= p; ) m.update(c), (i -= p);
      s(), m.render();
    }
  }
  let m = {
    update: e.update,
    render: e.render,
    isStopped: !0,
    start() {
      (t = performance.now()), (this.isStopped = !1), requestAnimationFrame(d);
    },
    stop() {
      (this.isStopped = !0), cancelAnimationFrame(n);
    },
  };
  return m;
};
