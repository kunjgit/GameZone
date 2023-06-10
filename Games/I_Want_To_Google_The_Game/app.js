!(function () {
  "use strict";
  let t = 44100,
    e = (
      e = 1,
      s = 0.05,
      i = 220,
      n = 0,
      r = 0,
      a = 0.1,
      o = 0,
      c = 1,
      l = 0,
      h = 0,
      f = 0,
      d = 0,
      u = 0,
      x = 0,
      p = 0,
      g = 0,
      y = 0,
      v = 1,
      w = 0,
      b = 0
    ) => {
      let M,
        S,
        k = 2 * Math.PI,
        m = (t) => (t > 0 ? 1 : -1),
        P = (l *= (500 * k) / t ** 2),
        T = (m(p) * k) / 4,
        E = (i *= ((1 + 2 * s * Math.random() - s) * k) / t),
        I = [],
        R = 0,
        C = 0,
        A = 0,
        V = 1,
        q = 0,
        L = 0,
        B = 0;
      for (
        h *= (500 * k) / t ** 3,
          p *= k / t,
          f *= k / t,
          d *= t,
          u = (u * t) | 0,
          S =
            ((n = 99 + n * t) + (w *= t) + (r *= t) + (a *= t) + (y *= t)) | 0;
        A < S;
        I[A++] = B
      )
        ++L % ((100 * g) | 0) ||
          ((B = o
            ? o > 1
              ? o > 2
                ? o > 3
                  ? Math.sin((R % k) ** 3)
                  : Math.max(Math.min(Math.tan(R), 1), -1)
                : 1 - (((((2 * R) / k) % 2) + 2) % 2)
              : 1 - 4 * Math.abs(Math.round(R / k) - R / k)
            : Math.sin(R)),
          (B =
            (u ? 1 - b + b * Math.sin((2 * Math.PI * A) / u) : 1) *
            m(B) *
            Math.abs(B) ** c *
            e *
            0.5 *
            (A < n
              ? A / n
              : A < n + w
              ? 1 - ((A - n) / w) * (1 - v)
              : A < n + w + r
              ? v
              : A < S - y
              ? ((S - A - y) / a) * v
              : 0)),
          (B = y
            ? B / 2 +
              (y > A ? 0 : ((A < S - y ? 1 : (S - A) / y) * I[(A - y) | 0]) / 2)
            : B)),
          (M = (i += l += h) * Math.sin(C * p - T)),
          (R += M - M * x * (1 - ((1e9 * (Math.sin(A) + 1)) % 2))),
          (C += M - M * x * (1 - ((1e9 * (Math.sin(A) ** 2 + 1)) % 2))),
          V && ++V > d && ((i += f), (E += f), (V = 0)),
          !u || ++q % u || ((i = E), (l = P), (V = V || 1));
      return I;
    };
  function s(t, e) {
    const s = t.audioContext || new AudioContext(),
      i = t.sampleRate || s.sampleRate,
      n = t.channels || 2,
      r = 1.5 * t.decay,
      a = Math.ceil(i * r),
      o = Math.ceil(i * t.fadeIn),
      c = Math.ceil(i * t.decay),
      l = Math.pow(0.001, 1 / c),
      h = s.createBuffer(n, a, i);
    for (let t = 0; t < n; ++t) {
      const e = h.getChannelData(t);
      for (let t = 0; t < a; ++t)
        e[t] =
          ((Math.floor(9007199254740992 * Math.random()) / 9007199254740991) *
            2 -
            1) *
          Math.pow(l, t);
      for (let t = 0; t < o; ++t) e[t] *= t / o;
    }
    !(function (t, e, s, i, n) {
      if (!e) return void n(t);
      (e = Math.min(e, 0.5 * t.sampleRate)),
        (s = Math.min(s, 0.5 * t.sampleRate));
      const r = (function (t) {
          const e = [];
          for (let s = 0; s < t.numberOfChannels; ++s)
            e[s] = t.getChannelData(s);
          return e;
        })(t),
        a = new OfflineAudioContext(
          t.numberOfChannels,
          r[0].length,
          t.sampleRate
        ),
        o = a.createBufferSource(),
        c = a.createBiquadFilter();
      (c.type = "lowpass"),
        (c.Q.value = 1e-4),
        c.frequency.setValueAtTime(e, 0),
        c.frequency.linearRampToValueAtTime(s, i),
        c.connect(a.destination),
        (o.buffer = t),
        o.connect(c),
        o.start(),
        (a.oncomplete = function (t) {
          n(t.renderedBuffer);
        }),
        a.startRendering();
    })(h, t.lpFreqStart, t.lpFreqEnd, t.decay, e);
  }
  "undefined" == typeof AudioContext &&
    ((window.AudioContext = window.webkitAudioContext),
    (window.OfflineAudioContext = window.webkitOfflineAudioContext));
  const i = 120 / 118;
  let n, r, a;
  function o() {
    return (
      (n = new AudioContext()),
      (r = n.createGain()),
      (r.gain.value = 0.4),
      (function () {
        const t = n.createConvolver(),
          e = n.createGain(),
          a = n.createGain();
        return (
          (e.gain.value = 2 / 3),
          (a.gain.value = 1 / 3),
          r.connect(t),
          r.connect(e),
          t.connect(a),
          e.connect(n.destination),
          a.connect(n.destination),
          new Promise(function (e) {
            s(
              {
                audioContext: n,
                fadeIn: 1e-5,
                decay: 1.5 * i,
                lpFreqStart: 16e3,
                lpFreqEnd: 1e3,
              },
              function (s) {
                (t.buffer = s), e();
              }
            );
          })
        );
      })()
    );
  }
  function c(t, e, s) {
    const o = (function (t) {
      return 440 * Math.pow(2, (t - 69) / 12);
    })(t);
    (e *= i), (s *= i);
    const c = n.createOscillator();
    (c.type = "square"),
      (c.frequency.value = o),
      (function (t, e) {
        const s = n.createGain();
        return (
          s.gain.setValueAtTime(0.5, a + e),
          s.gain.exponentialRampToValueAtTime(1e-5, a + e + 1.5 * i),
          t.connect(s),
          s
        );
      })(c, e).connect(r),
      c.start(a + e),
      c.stop(a + s);
  }
  function l(t) {
    switch (t > 51 ? ((t - 8) % 44) + 8 : t) {
      case 0:
        c(57, t + 0, t + 0.25),
          c(45, t + 0, t + 2),
          c(60, t + 0.25, t + 0.5),
          c(57, t + 0.5, t + 0.75),
          c(64, t + 0.75, t + 1.25);
        break;
      case 1:
        c(60, t + 0.25, t + 0.75), c(60, t + 0.75, t + 1);
        break;
      case 2:
        c(52, t + 0, t + 1),
          c(60, t + 0.25, t + 0.5),
          c(57, t + 0.5, t + 0.75),
          c(64, t + 0.75, t + 1.25);
        break;
      case 3:
        c(52, t + 0, t + 0.75),
          c(60, t + 0.25, t + 0.75),
          c(60, t + 0.75, t + 1),
          c(52, t + 0.75, t + 1);
        break;
      case 4:
        c(45, t + 0, t + 1.75),
          c(57, t + 0.25, t + 0.5),
          c(60, t + 0.5, t + 0.75),
          c(64, t + 0.75, t + 1.25),
          c(57, t + 0.75, t + 1.25);
        break;
      case 5:
        c(57, t + 0.25, t + 0.5), c(60, t + 0.5, t + 1), c(52, t + 0.75, t + 1);
        break;
      case 6:
        c(60, t + 0, t + 1), c(52, t + 0, t + 0.5), c(52, t + 0.5, t + 1.5);
        break;
      case 7:
        c(64, t + 0, t + 1), c(52, t + 0.5, t + 0.75), c(52, t + 0.75, t + 1);
        break;
      case 8:
        c(57, t + 0, t + 0.25),
          c(45, t + 0, t + 0.75),
          c(57, t + 0.25, t + 0.5),
          c(57, t + 0.5, t + 0.75),
          c(60, t + 0.75, t + 1.25),
          c(52, t + 0.75, t + 1.75);
        break;
      case 9:
        c(69, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(69, t + 0.75, t + 1),
          c(52, t + 0.75, t + 1);
        break;
      case 10:
        c(69, t + 0, t + 0.75),
          c(41, t + 0, t + 0.25),
          c(48, t + 0.25, t + 0.5),
          c(55, t + 0.5, t + 1.5),
          c(57, t + 0.75, t + 1.75);
        break;
      case 11:
        c(55, t + 0.5, t + 0.75),
          c(67, t + 0.75, t + 1),
          c(50, t + 0.75, t + 1);
        break;
      case 12:
        c(67, t + 0, t + 0.25),
          c(55, t + 0, t + 0.75),
          c(67, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(66, t + 0.75, t + 1.25),
          c(57, t + 0.75, t + 1.75),
          c(54, t + 0.75, t + 1.75);
        break;
      case 13:
        c(67, t + 0.25, t + 0.5),
          c(66, t + 0.5, t + 0.75),
          c(64, t + 0.75, t + 1),
          c(47, t + 0.75, t + 1);
        break;
      case 14:
        c(52, t + 0, t + 0.25),
          c(47, t + 0, t + 2),
          c(54, t + 0.25, t + 0.5),
          c(56, t + 0.5, t + 0.75),
          c(59, t + 0.75, t + 1.75);
        break;
      case 15:
        c(57, t + 0.75, t + 1);
        break;
      case 16:
        c(57, t + 0, t + 0.25),
          c(45, t + 0, t + 0.75),
          c(57, t + 0.25, t + 0.5),
          c(57, t + 0.5, t + 0.75),
          c(60, t + 0.75, t + 1.25),
          c(52, t + 0.75, t + 1.25);
        break;
      case 17:
        c(69, t + 0.25, t + 0.5),
          c(57, t + 0.25, t + 1),
          c(67, t + 0.5, t + 0.75),
          c(69, t + 0.75, t + 1);
        break;
      case 18:
        c(69, t + 0, t + 0.75),
          c(57, t + 0, t + 0.25),
          c(53, t + 0, t + 0.25),
          c(48, t + 0, t + 0.25),
          c(48, t + 0.25, t + 0.5),
          c(55, t + 0.5, t + 0.75),
          c(65, t + 0.75, t + 1.75),
          c(57, t + 0.75, t + 1.25);
        break;
      case 19:
        c(57, t + 0.25, t + 0.5), c(60, t + 0.5, t + 1), c(67, t + 0.75, t + 1);
        break;
      case 20:
        c(67, t + 0, t + 0.25),
          c(43, t + 0, t + 0.5),
          c(59, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(50, t + 0.5, t + 0.75),
          c(66, t + 0.75, t + 1.25),
          c(47, t + 0.75, t + 1.75);
        break;
      case 21:
        c(67, t + 0.25, t + 0.5),
          c(66, t + 0.5, t + 0.75),
          c(64, t + 0.75, t + 1),
          c(47, t + 0.75, t + 1);
        break;
      case 22:
        c(52, t + 0, t + 0.25),
          c(47, t + 0, t + 2),
          c(54, t + 0.25, t + 0.5),
          c(56, t + 0.5, t + 0.75),
          c(59, t + 0.75, t + 1.75);
        break;
      case 23:
        c(67, t + 0.75, t + 1);
        break;
      case 24:
        c(67, t + 0, t + 0.25),
          c(59, t + 0, t + 0.5),
          c(55, t + 0, t + 0.5),
          c(62, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(59, t + 0.5, t + 0.75),
          c(67, t + 0.75, t + 1.25),
          c(57, t + 0.75, t + 1.25);
        break;
      case 25:
        c(67, t + 0.25, t + 0.5),
          c(50, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(43, t + 0.5, t + 1),
          c(68, t + 0.75, t + 1),
          c(64, t + 0.75, t + 1);
        break;
      case 26:
        c(68, t + 0, t + 0.25),
          c(64, t + 0, t + 0.25),
          c(40, t + 0, t + 0.5),
          c(64, t + 0.25, t + 0.5),
          c(62, t + 0.5, t + 0.75),
          c(47, t + 0.5, t + 0.75),
          c(62, t + 0.75, t + 1.25),
          c(52, t + 0.75, t + 1.5);
        break;
      case 27:
        c(60, t + 0.25, t + 0.75),
          c(52, t + 0.5, t + 0.75),
          c(57, t + 0.75, t + 1),
          c(47, t + 0.75, t + 1);
        break;
      case 28:
        c(60, t + 0, t + 0.5),
          c(45, t + 0, t + 0.5),
          c(72, t + 0.5, t + 1),
          c(64, t + 0.5, t + 1),
          c(57, t + 0.5, t + 0.75),
          c(48, t + 0.75, t + 1);
        break;
      case 29:
        c(60, t + 0, t + 0.25),
          c(57, t + 0, t + 0.75),
          c(53, t + 0, t + 0.75),
          c(65, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1),
          c(43, t + 0.75, t + 1);
        break;
      case 30:
        c(72, t + 0, t + 0.25),
          c(64, t + 0, t + 0.25),
          c(60, t + 0, t + 0.25),
          c(48, t + 0, t + 0.5),
          c(36, t + 0, t + 0.5),
          c(72, t + 0.25, t + 0.5),
          c(64, t + 0.25, t + 0.5),
          c(60, t + 0.25, t + 0.5),
          c(72, t + 0.5, t + 0.75),
          c(64, t + 0.5, t + 0.75),
          c(60, t + 0.5, t + 0.75),
          c(55, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(64, t + 0.75, t + 1.25),
          c(60, t + 0.75, t + 1.25),
          c(50, t + 0.75, t + 1.5);
        break;
      case 31:
        c(71, t + 0.25, t + 1),
          c(62, t + 0.25, t + 1),
          c(59, t + 0.25, t + 1),
          c(57, t + 0.5, t + 0.75),
          c(50, t + 0.75, t + 1);
        break;
      case 32:
        c(72, t + 0, t + 0.25),
          c(64, t + 0, t + 0.25),
          c(60, t + 0, t + 0.25),
          c(57, t + 0, t + 0.5),
          c(52, t + 0, t + 0.5),
          c(45, t + 0, t + 0.5),
          c(72, t + 0.25, t + 0.5),
          c(72, t + 0.5, t + 0.75),
          c(59, t + 0.5, t + 1),
          c(72, t + 0.75, t + 1.25);
        break;
      case 33:
        c(57, t + 0, t + 0.5),
          c(53, t + 0, t + 0.5),
          c(48, t + 0, t + 0.5),
          c(71, t + 0.25, t + 0.5),
          c(69, t + 0.5, t + 0.75),
          c(48, t + 0.5, t + 1),
          c(67, t + 0.75, t + 1),
          c(64, t + 0.75, t + 1),
          c(60, t + 0.75, t + 1);
        break;
      case 34:
        c(67, t + 0, t + 0.25),
          c(64, t + 0, t + 0.25),
          c(60, t + 0, t + 0.25),
          c(36, t + 0, t + 0.5),
          c(69, t + 0.25, t + 0.5),
          c(71, t + 0.5, t + 0.75),
          c(43, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(68, t + 0.75, t + 1.25),
          c(64, t + 0.75, t + 1.25),
          c(48, t + 0.75, t + 1);
        break;
      case 35:
        c(40, t + 0, t + 0.5),
          c(71, t + 0.25, t + 1),
          c(56, t + 0.5, t + 0.75),
          c(52, t + 0.75, t + 1);
        break;
      case 36:
        c(60, t + 0, t + 0.5),
          c(45, t + 0, t + 0.25),
          c(52, t + 0.25, t + 0.5),
          c(72, t + 0.5, t + 1),
          c(64, t + 0.5, t + 1),
          c(60, t + 0.5, t + 1),
          c(57, t + 0.5, t + 1);
        break;
      case 37:
        c(60, t + 0, t + 0.25),
          c(57, t + 0, t + 0.5),
          c(53, t + 0, t + 0.5),
          c(65, t + 0.25, t + 0.5),
          c(67, t + 0.5, t + 0.75),
          c(48, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1),
          c(60, t + 0.75, t + 1),
          c(43, t + 0.75, t + 1);
        break;
      case 38:
        c(72, t + 0, t + 0.25),
          c(67, t + 0, t + 0.25),
          c(60, t + 0, t + 0.25),
          c(48, t + 0, t + 0.5),
          c(72, t + 0.25, t + 0.5),
          c(60, t + 0.25, t + 0.5),
          c(72, t + 0.5, t + 0.75),
          c(60, t + 0.5, t + 0.75),
          c(55, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(67, t + 0.75, t + 1.25),
          c(62, t + 0.75, t + 1.25),
          c(50, t + 0.75, t + 1);
        break;
      case 39:
        c(43, t + 0, t + 0.25),
          c(71, t + 0.25, t + 0.75),
          c(67, t + 0.25, t + 0.75),
          c(62, t + 0.25, t + 0.75),
          c(50, t + 0.25, t + 0.5),
          c(57, t + 0.5, t + 1),
          c(59, t + 0.75, t + 1);
        break;
      case 40:
        c(72, t + 0, t + 0.5),
          c(64, t + 0, t + 0.5),
          c(60, t + 0, t + 0.5),
          c(52, t + 0, t + 0.5),
          c(45, t + 0, t + 0.5),
          c(72, t + 0.5, t + 0.75),
          c(64, t + 0.5, t + 0.75),
          c(60, t + 0.5, t + 0.75),
          c(57, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(67, t + 0.75, t + 1.25),
          c(60, t + 0.75, t + 1.25),
          c(48, t + 0.75, t + 1);
        break;
      case 41:
        c(57, t + 0, t + 0.5),
          c(53, t + 0, t + 0.5),
          c(48, t + 0, t + 0.5),
          c(71, t + 0.25, t + 0.5),
          c(69, t + 0.5, t + 0.75),
          c(60, t + 0.5, t + 0.75),
          c(57, t + 0.5, t + 0.75),
          c(67, t + 0.75, t + 1),
          c(53, t + 0.75, t + 1);
        break;
      case 42:
        c(67, t + 0, t + 0.25),
          c(48, t + 0, t + 0.25),
          c(36, t + 0, t + 0.25),
          c(69, t + 0.25, t + 0.5),
          c(43, t + 0.25, t + 0.5),
          c(71, t + 0.5, t + 0.75),
          c(48, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(68, t + 0.75, t + 1.25),
          c(64, t + 0.75, t + 1.25),
          c(60, t + 0.75, t + 1.25),
          c(44, t + 0.75, t + 1);
        break;
      case 43:
        c(52, t + 0, t + 0.25),
          c(71, t + 0.25, t + 1),
          c(68, t + 0.25, t + 1),
          c(64, t + 0.25, t + 1),
          c(47, t + 0.25, t + 0.5),
          c(56, t + 0.5, t + 0.75),
          c(52, t + 0.75, t + 1);
        break;
      case 44:
        c(72, t + 0, t + 0.5),
          c(64, t + 0, t + 0.5),
          c(60, t + 0, t + 0.5),
          c(57, t + 0, t + 0.25),
          c(45, t + 0, t + 0.25),
          c(52, t + 0.25, t + 0.5),
          c(72, t + 0.5, t + 0.75),
          c(60, t + 0.5, t + 0.75),
          c(57, t + 0.5, t + 0.75),
          c(72, t + 0.75, t + 1.25),
          c(67, t + 0.75, t + 1.25),
          c(60, t + 0.75, t + 1.25),
          c(48, t + 0.75, t + 1);
        break;
      case 45:
        c(57, t + 0, t + 0.25),
          c(53, t + 0, t + 0.25),
          c(71, t + 0.25, t + 0.5),
          c(55, t + 0.25, t + 0.5),
          c(69, t + 0.5, t + 0.75),
          c(48, t + 0.5, t + 1),
          c(67, t + 0.75, t + 1),
          c(64, t + 0.75, t + 1),
          c(60, t + 0.75, t + 1);
        break;
      case 46:
        c(67, t + 0, t + 0.25),
          c(64, t + 0, t + 0.25),
          c(60, t + 0, t + 0.25),
          c(48, t + 0, t + 0.25),
          c(36, t + 0, t + 0.25),
          c(69, t + 0.25, t + 0.5),
          c(43, t + 0.25, t + 0.5),
          c(71, t + 0.5, t + 0.75),
          c(48, t + 0.5, t + 1),
          c(72, t + 0.75, t + 1.25),
          c(68, t + 0.75, t + 1.25),
          c(60, t + 0.75, t + 1.25);
        break;
      case 47:
        c(52, t + 0, t + 0.5),
          c(40, t + 0, t + 0.5),
          c(71, t + 0.25, t + 1),
          c(68, t + 0.25, t + 1),
          c(62, t + 0.25, t + 1),
          c(47, t + 0.5, t + 0.75),
          c(52, t + 0.75, t + 1);
        break;
      case 48:
        c(71, t + 0, t + 2),
          c(68, t + 0, t + 2),
          c(62, t + 0, t + 2),
          c(52, t + 0, t + 0.25),
          c(54, t + 0.25, t + 0.75),
          c(56, t + 0.75, t + 1.25);
        break;
      case 49:
        c(54, t + 0.25, t + 0.5), c(56, t + 0.5, t + 1);
        break;
      case 50:
        c(64, t + 0, t + 1.75);
        break;
      case 51:
        c(52, t + 0.75, t + 1);
    }
  }
  let h = -1;
  function f() {
    let t = n.currentTime - a + 4,
      e = (h + 1) * i;
    if (!(e > t)) for (t += 4; e < t; ) l(++h), (e += i);
  }
  function d() {
    (a = n.currentTime + 0.05), f(), setInterval(f, 999);
  }
  class u {
    constructor(t = 0, e = 0) {
      (this.x = t), (this.y = e);
    }
    set(t, e) {
      (this.x = t), (this.y = e);
    }
    setTo(t) {
      (this.x = t.x), (this.y = t.y);
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distanceSquared(t) {
      const e = this.x - t.x,
        s = this.y - t.y;
      return e * e + s * s;
    }
    add(t) {
      (this.x += t.x), (this.y += t.y);
    }
    subtract(t) {
      (this.x -= t.x), (this.y -= t.y);
    }
    setSubtract(t, e) {
      (this.x = t.x - e.x), (this.y = t.y - e.y);
    }
    dot(t) {
      return this.x * t.x + this.y * t.y;
    }
    scalarMult(t) {
      (this.x *= t), (this.y *= t);
    }
    setScalarMult(t, e) {
      (this.x = t.x * e), (this.y = t.y * e);
    }
    setNormal(t, e) {
      (this.x = t.y - e.y), (this.y = e.x - t.x);
      const s = this.length();
      s < Number.MIN_VALUE || this.scalarMult(1 / s);
    }
  }
  const x = 2 * Math.PI,
    p = 0.5 * Math.PI,
    g = 0.25 * Math.PI,
    y = 0.125 * Math.PI;
  function v(t, e, s) {
    return t * (1 - s) + e * s;
  }
  function w(t) {
    return t * t;
  }
  function b(t) {
    return t * (2 - t);
  }
  function M(t) {
    return t < 0.5 ? 2 * t * t : 2 * t * (2 - t) - 1;
  }
  function S(t, e, s, i) {
    W.translate(t, e), W.scale((s - t) / 512, (i - e) / 512);
  }
  function k(t, e, s) {
    const i = document.createElement("canvas"),
      n = i.getContext("2d");
    return j(i, n, t, e), s(n), i;
  }
  const m = new u(),
    P = new u();
  function T(e) {
    try {
      null === e.buf &&
        ((e.buf = n.createBuffer(1, e.raw.length, t)),
        e.buf.getChannelData(0).set(e.raw));
      const s = n.createBufferSource();
      (s.buffer = e.buf), s.connect(n.destination), s.start();
    } catch (t) {}
  }
  const E = {
      raw: e.apply(null, [
        ,
        ,
        132,
        ,
        ,
        0.46,
        ,
        0.11,
        9.1,
        ,
        ,
        ,
        ,
        0.1,
        ,
        ,
        0.04,
        0.56,
        0.05,
      ]),
      buf: null,
    },
    I = {
      raw: e.apply(null, [
        ,
        ,
        382,
        ,
        ,
        0.48,
        2,
        0.35,
        -0.6,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        0.2,
        0.72,
        0.09,
      ]),
      buf: null,
    },
    R = {
      raw: e.apply(null, [
        ,
        ,
        345,
        0.01,
        0.17,
        0.87,
        1,
        1.05,
        0.2,
        ,
        67,
        0.03,
        0.02,
        ,
        -0.2,
        ,
        ,
        0.79,
        ,
        0.04,
      ]),
      buf: null,
    };
  let C = !1;
  function A() {
    try {
      o().then(d);
    } catch (t) {}
    C = !0;
  }
  class V {
    constructor(t, e, s) {
      (this.parent = t),
        (this.position = new u(e, s)),
        (this.oldPosition = new u(e, s)),
        (this.interpolated = new u()),
        t.vertices.push(this),
        t.positions.push(this.position),
        t.scene.vertices.push(this);
    }
    integrate(t = 0, e = 0) {
      const s = this.position,
        i = this.oldPosition,
        n = s.x,
        r = s.y;
      (s.x += 1 * (s.x - i.x)),
        (s.y += 1 * (s.y - i.y) + t),
        i.set(n, r),
        s.y < 0
          ? (s.y = 0)
          : s.y >= 540 && ((s.x -= (s.x - i.x) * e), (s.y = 539)),
        s.x < 0 ? (s.x = 0) : s.x >= 960 && (s.x = 959);
    }
    interpolate(t) {
      this.interpolated.set(
        v(this.oldPosition.x, this.position.x, t),
        v(this.oldPosition.y, this.position.y, t)
      );
    }
  }
  class q extends V {
    constructor(t, e, s) {
      super(t, e, s), (this.x = e), (this.y = s);
    }
    set(t, e) {
      (this.x = t), (this.y = e);
    }
    integrate() {
      this.position.set(this.x, this.y), this.oldPosition.set(this.x, this.y);
    }
    interpolate(t) {
      this.interpolated.set(this.x, this.y);
    }
  }
  class L {
    constructor(t, e, s, i = !1, n = 1) {
      if (
        ((this.parent = t),
        (this.v0 = e),
        (this.v1 = s),
        (this.p0 = e.position),
        (this.p1 = s.position),
        (this.dist = this.p0.distanceSquared(this.p1)),
        (this.edge = i),
        (this.stiffness = n),
        !this.dist)
      )
        throw Error("Overlapping vertices.");
      t.constraints.push(this),
        i && t.edges.push(this),
        t.scene.constraints.push(this);
    }
    solve() {
      m.setSubtract(this.p0, this.p1);
      const t = this.dist / (m.dot(m) + this.dist) - 0.5;
      m.scalarMult(t * this.stiffness), this.p0.add(m), this.p1.subtract(m);
    }
  }
  class B {
    constructor(t, e = 1) {
      (this.scene = t),
        (this.vertices = []),
        (this.positions = []),
        (this.constraints = []),
        (this.edges = []),
        (this.center = new u()),
        (this.halfExtents = new u()),
        (this.pMin = 0),
        (this.pMax = 0),
        (this.mass = e),
        t.bodies.push(this);
    }
    boundingBox() {
      let t = this.positions[0],
        e = t.x,
        s = t.x,
        i = t.y,
        n = t.y;
      for (let r = 1; r < this.positions.length; ++r)
        (t = this.positions[r]),
          t.x < e ? (e = t.x) : t.x > s && (s = t.x),
          t.y < i ? (i = t.y) : t.y > n && (n = t.y);
      this.center.set(0.5 * (e + s), 0.5 * (i + n)),
        this.halfExtents.set(0.5 * (s - e), 0.5 * (n - i));
    }
    projectOn(t) {
      let e = this.positions[0].dot(t);
      this.pMin = this.pMax = e;
      for (let s = 1; s < this.positions.length; ++s)
        (e = this.positions[s].dot(t)),
          e < this.pMin ? (this.pMin = e) : e > this.pMax && (this.pMax = e);
    }
    paint(t, e) {
      for (const t of this.vertices) t.interpolate(e);
      t.beginPath();
      for (const e of this.constraints)
        e.edge ||
          (t.moveTo(e.v0.interpolated.x, e.v0.interpolated.y),
          t.lineTo(e.v1.interpolated.x, e.v1.interpolated.y));
      (t.strokeStyle = "#ffac7f"), t.stroke(), t.beginPath();
      for (const e of this.vertices)
        t.lineTo(e.interpolated.x, e.interpolated.y);
      t.closePath(), (t.strokeStyle = "#99c2db"), t.stroke();
    }
  }
  const D = (function () {
    const t = new u();
    let e, s, i;
    function n(t, e, s) {
      return (
        m.setNormal(s.p0, s.p1),
        t.projectOn(m),
        e.projectOn(m),
        t.pMin < e.pMin ? e.pMin - t.pMax : t.pMin - e.pMax
      );
    }
    return function (r, a) {
      const o = r.edges.length,
        c = a.edges.length;
      if (0 === o || 0 === c) return;
      if (
        Math.abs(a.center.x - r.center.x) >=
          r.halfExtents.x + a.halfExtents.x ||
        Math.abs(a.center.y - r.center.y) >= r.halfExtents.y + a.halfExtents.y
      )
        return;
      (e = n(r, a, (s = r.edges[0]))), t.setTo(m);
      for (let i = 1; i < o; ++i) {
        const o = r.edges[i],
          c = n(r, a, o);
        if (c > 0) return;
        c > e && ((e = c), (s = o), t.setTo(m));
      }
      for (let i = 0; i < c; ++i) {
        const o = a.edges[i],
          c = n(r, a, o);
        if (c > 0) return;
        c > e && ((e = c), (s = o), t.setTo(m));
      }
      if (s.parent !== a) {
        const t = r;
        (r = a), (a = t);
      }
      m.setSubtract(r.center, a.center),
        m.dot(t) < 0 && t.scalarMult(-1),
        m.setSubtract(r.positions[0], a.center);
      let l = t.dot(m);
      i = r.vertices[0];
      for (let e = 1; e < r.positions.length; ++e) {
        m.setSubtract(r.positions[e], a.center);
        const s = t.dot(m);
        s < l && ((l = s), (i = r.vertices[e]));
      }
      !(function () {
        const n = s.p0,
          r = s.p1,
          a = (s.v0.oldPosition, s.v1.oldPosition, i.position);
        i.oldPosition;
        m.setScalarMult(t, -e), P.setSubtract(r, n);
        const o =
          0 === P.x && 0 === P.y
            ? 0.5
            : Math.abs(P.x) > Math.abs(P.y)
            ? (a.x - m.x - n.x) / P.x
            : (a.y - m.y - n.y) / P.y;
        let c = i.parent.mass,
          l = s.parent.mass;
        const h = c + l;
        (c /= 2 * h), (l /= h);
        const f = c / (o * o + (1 - o) * (1 - o)),
          d = (1 - o) * f,
          u = o * f;
        (n.x -= m.x * d),
          (n.y -= m.y * d),
          (r.x -= m.x * u),
          (r.y -= m.y * u),
          (a.x += m.x * l),
          (a.y += m.y * l),
          0;
      })();
    };
  })();
  class O extends B {
    constructor(t, e, s, i, n = 9, r = 0.5, a = 1) {
      super(t, a);
      const o = x / n;
      for (let t = 0; t < n; ++t) {
        const n = o * t;
        new V(this, e + i * Math.cos(n), s + i * Math.sin(n));
      }
      for (let t = 0; t < this.vertices.length - 1; ++t)
        for (let e = t + 1; e < this.vertices.length; ++e)
          new L(this, this.vertices[t], this.vertices[e], e === t + 1, r);
      this.center.set(e, s), this.halfExtents.set(i, i);
    }
  }
  function j(t, e, s, i) {
    window.devicePixelRatio > 1.44
      ? ((t.height = 2 * i), (t.width = 2 * s), e.scale(2, 2))
      : ((t.height = i), (t.width = s));
  }
  const G = ((F = ".can"), document.querySelector(F));
  var F;
  const W = G.getContext("2d");
  j(G, W, 960, 540);
  const U = 16 / 9;
  let N = 1,
    z = "transform";
  z in G.style || (z = "webkitTransform");
  const $ = "undefined" != typeof visualViewport;
  function H() {
    let t = $ ? visualViewport.width : innerWidth,
      e = $ ? visualViewport.height : innerHeight;
    t / e > U ? (t = e * U) : (e = t / U), (N = 960 / t);
    const s = t / 960;
    G.style[z] = `scale3d(${s},${s},1)`;
  }
  addEventListener("resize", H),
    addEventListener("orientationchange", H),
    $ && visualViewport.addEventListener("resize", H);
  const Q = "16px -apple-system, 'Segoe UI', system-ui, Roboto, sans-serif",
    X = Q.replace("16", "bold 48");
  G.addEventListener("contextmenu", (t) => {
    t.preventDefault();
  });
  const Y = { dragging: !1, x: 0, y: 0 };
  function _(t) {
    const e = G.getBoundingClientRect();
    (Y.x = (t.clientX - e.left) * N), (Y.y = (t.clientY - e.top) * N);
  }
  document.addEventListener("mousedown", (t) => {
    t.preventDefault(), (Y.dragging = !0), _(t);
  }),
    document.addEventListener("mousemove", (t) => {
      t.preventDefault(), _(t);
    }),
    document.addEventListener("mouseup", (t) => {
      t.preventDefault(), (Y.dragging = !1), (Y.vertex = void 0), C || A();
    }),
    document.addEventListener("touchstart", (t) => {
      t.preventDefault(), (Y.dragging = !0), _(t.targetTouches[0]);
    }),
    document.addEventListener("touchmove", (t) => {
      t.preventDefault(), _(t.targetTouches[0]);
    }),
    document.addEventListener("touchend", (t) => {
      t.preventDefault(), (Y.dragging = !1), (Y.vertex = void 0), C || A();
    }),
    document.addEventListener("touchcancel", (t) => {
      t.preventDefault(), (Y.dragging = !1), (Y.vertex = void 0);
    });
  const J = (function () {
    let t = (t) => {},
      e = (t) => {};
    const s = 0.02;
    let i = -1,
      n = 0;
    function r(a) {
      requestAnimationFrame(r),
        -1 === i && (i = a),
        (n += 0.001 * (a - i)),
        (i = a);
      let o = 2;
      for (; n > 0; ) (n -= s), o > 0 && (t(s), --o);
      e(n / s + 1);
    }
    return function (s, i) {
      (t = s), (e = i), requestAnimationFrame(r);
    };
  })();
  class K extends B {
    constructor(t, e) {
      super(t),
        (this.startingVertex = new q(this, e.x, e.y)),
        (this.targetingVertex = new V(this, e.x - 0.001, e.y)),
        (this.lastPosition = new u(e.x, e.y));
      const s = new L(this, this.startingVertex, this.targetingVertex, !1, 0.1),
        i = s.solve;
      s.solve = () => {
        Y.vertex || (i.call(s), this.startingVertex.position.setTo(e));
      };
    }
    paint(t, e) {
      this.targetingVertex.interpolate(e);
      const s = this.startingVertex.position,
        i = this.targetingVertex.interpolated;
      t.beginPath(),
        t.moveTo(i.x, i.y),
        t.lineTo(s.x, s.y),
        (t.strokeStyle = Pt),
        t.stroke(),
        t.beginPath(),
        t.arc(i.x, i.y, 9, 0, x),
        t.arc(s.x, s.y, 4, 0, x),
        (t.fillStyle = Pt),
        t.fill();
    }
  }
  class Z extends B {
    constructor(t, e, s, i, n = 0, r = 1, a = 9) {
      super(t, a);
      const o = p;
      for (let t = 0; t < 4; ++t) {
        const r = o * t + n;
        new V(this, e + i * Math.cos(r), s + i * Math.sin(r));
      }
      for (let t = 0; t < this.vertices.length - 1; ++t)
        for (let e = t + 1; e < this.vertices.length; ++e)
          new L(this, this.vertices[t], this.vertices[e], e === t + 1, r);
    }
    retract() {
      (this.scene.vertices.length -= this.vertices.length),
        (this.scene.constraints.length -= this.constraints.length),
        this.scene.bodies.pop();
    }
    paint() {}
  }
  class tt extends O {
    constructor(t, e, s) {
      super(t, e, s, 32, 16, 0.016), (this.relInterp = []);
      for (let t = 0; t < 16; ++t) this.relInterp.push(new u());
    }
    interpolate(t) {
      let e = this.vertices[0];
      e.interpolate(t);
      let s = e.interpolated,
        i = s.x,
        n = s.x,
        r = s.y,
        a = s.y;
      for (let o = 1; o < 16; ++o)
        (e = this.vertices[o]),
          e.interpolate(t),
          (s = e.interpolated),
          s.x < i ? (i = s.x) : s.x > n && (n = s.x),
          s.y < r ? (r = s.y) : s.y > a && (a = s.y);
      this.center.set(0.5 * (i + n), 0.5 * (r + a)),
        this.halfExtents.set(0.5 * (n - i), 0.5 * (a - r));
      for (let t = 0; t < 16; ++t)
        this.relInterp[t].setSubtract(
          this.vertices[t].interpolated,
          this.center
        );
    }
    tracePath(t, e) {
      t.beginPath();
      for (const [s, i, n, r] of e)
        m.setScalarMult(this.relInterp[s], n),
          P.setScalarMult(this.relInterp[i], r),
          m.add(P),
          m.add(this.center),
          t.lineTo(m.x, m.y);
      t.closePath();
    }
  }
  const et = [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [2, 2, 1, 0],
      [3, 3, 1, 0],
      [4, 4, 1, 0],
      [5, 5, 1, 0],
      [6, 6, 1, 0],
      [7, 7, 1, 0],
      [8, 8, 1, 0],
      [9, 9, 1, 0],
      [10, 9, 0.56, 0.44],
      [10, 11, 0.75, 0.21],
      [10, 9, 0.59, 0.18],
      [11, 10, 0.6, 0.16],
      [10, 11, 0.39, 0.16],
      [12, 11, 0.2, 0],
      [8, 7, 0.25, 0.22],
      [7, 8, 0.46, 0.01],
      [6, 7, 0.46, 0.01],
      [5, 6, 0.46, 0.01],
      [4, 3, 0.46, 0],
      [3, 4, 0.46, 0],
      [2, 1, 0.45, 0],
      [1, 0, 0.42, 0.01],
      [0, 15, 0.4, 0.01],
      [15, 14, 0.39, 0.01],
      [14, 13, 0.37, 0.01],
      [13, 14, 0.21, 0.17],
      [14, 13, 0.43, 0.01],
      [15, 14, 0.35, 0.17],
      [14, 13, 0.51, 0.01],
      [13, 12, 0.6, 0.01],
      [13, 12, 0.52, 0.34],
      [13, 12, 0.81, 0.31],
      [13, 12, 1, 0.01],
      [14, 15, 0.65, 0.25],
      [15, 0, 0.85, 0.04],
      [15, 14, 0.54, 0.4],
      [14, 15, 0.78, 0.19],
      [14, 15, 0.52, 0.48],
      [15, 15, 1, 0],
    ],
    st = W.createRadialGradient(256, 576, 256, 256, -192, 256);
  st.addColorStop(1 - 0.7, "#e31587"),
    st.addColorStop(0.47, "#ff3647"),
    st.addColorStop(0.63, "#ff980e"),
    st.addColorStop(0.95, "#fff44f");
  const it = W.createLinearGradient(0, 540, 960, 0);
  it.addColorStop(0, "#4facfe"), it.addColorStop(1, "#00f2fe");
  class nt extends tt {
    paint(t, e) {
      this.interpolate(e), t.beginPath();
      for (const e of this.vertices)
        t.lineTo(e.interpolated.x, e.interpolated.y);
      t.closePath(),
        (t.fillStyle = it),
        t.fill(),
        this.tracePath(t, et),
        t.save(),
        S(
          this.center.x - this.halfExtents.x,
          this.center.y - this.halfExtents.y,
          this.center.x + this.halfExtents.x,
          this.center.y + this.halfExtents.y
        ),
        (t.fillStyle = st),
        t.fill(),
        t.restore();
    }
  }
  const rt = [
      [1, 1, 1, 0],
      [2, 2, 1, 0],
      [3, 3, 1, 0],
      [4, 4, 1, 0],
      [5, 5, 1, 0],
      [6, 6, 1, 0],
      [7, 7, 1, 0],
      [8, 8, 1, 0],
      [9, 9, 1, 0],
      [10, 10, 1, 0],
      [11, 11, 1, 0],
      [12, 12, 1, 0],
      [13, 13, 1, 0],
      [14, 14, 1, 0],
      [15, 15, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 0.68, 0.33],
      [8, 7, 0.48, 0.33],
      [8, 9, 0.43, 0.38],
      [15, 0, 0.38, 0.08],
      [15, 14, 0.46, 0],
      [14, 13, 0.51, 0.01],
      [13, 12, 0.54, 0.01],
      [12, 11, 0.55, 0.01],
      [11, 12, 0.54, 0.01],
      [10, 11, 0.51, 0],
      [9, 8, 0.47, 0],
      [9, 8, 0.38, 0.09],
      [7, 8, 0.33, 0.14],
      [7, 8, 0.46, 0.01],
      [6, 7, 0.51, 0.01],
      [5, 6, 0.55, 0],
      [4, 5, 0.54, 0.01],
      [3, 4, 0.54, 0.01],
      [2, 1, 0.52, 0],
      [2, 1, 0.41, 0.11],
      [1, 0, 0.86, 0.14],
    ],
    at = W.createRadialGradient(256, 256, 363, 256, 128, 0);
  at.addColorStop(0, "#0d79c8"),
    at.addColorStop(0.7376, "#86e8fd"),
    at.addColorStop(1, "#89eafe");
  class ot extends tt {
    paint(t, e) {
      this.interpolate(e),
        this.tracePath(t, rt),
        t.save(),
        S(
          this.center.x - this.halfExtents.x,
          this.center.y - this.halfExtents.y,
          this.center.x + this.halfExtents.x,
          this.center.y + this.halfExtents.y
        ),
        (t.fillStyle = at),
        t.fill(),
        t.restore();
    }
  }
  const ct = [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [2, 2, 1, 0],
      [3, 3, 1, 0],
      [4, 4, 1, 0],
      [5, 5, 1, 0],
      [1, 2, 0.31, 0.15],
      [12, 11, 0.44, 0.01],
      [14, 14, 1, 0],
      [15, 15, 1, 0],
    ],
    lt = [
      [5, 5, 1, 0],
      [6, 6, 1, 0],
      [7, 7, 1, 0],
      [8, 8, 1, 0],
      [9, 9, 1, 0],
      [10, 10, 1, 0],
      [7, 6, 0.31, 0.15],
      [1, 2, 0.31, 0.15],
      [4, 5, 0.88, 0.12],
    ],
    ht = [
      [10, 10, 1, 0],
      [11, 11, 1, 0],
      [12, 12, 1, 0],
      [13, 13, 1, 0],
      [14, 14, 1, 0],
      [15, 14, 0.78, 0.22],
      [12, 11, 0.44, 0.01],
      [7, 6, 0.31, 0.15],
      [9, 10, 0.56, 0.44],
    ],
    ft = [
      [0, 1, 0.45, 0],
      [1, 0, 0.44, 0.01],
      [2, 3, 0.44, 0.01],
      [3, 4, 0.44, 0.01],
      [4, 3, 0.45, 0],
      [5, 6, 0.44, 0.01],
      [6, 7, 0.45, 0.01],
      [7, 8, 0.44, 0.01],
      [8, 9, 0.46, 0],
      [9, 10, 0.45, 0.01],
      [10, 11, 0.45, 0.01],
      [11, 10, 0.45, 0],
      [12, 11, 0.44, 0.01],
      [13, 12, 0.44, 0.01],
      [14, 13, 0.44, 0.01],
      [15, 14, 0.44, 0.01],
    ];
  class dt extends tt {
    paint(t, e) {
      this.interpolate(e),
        this.tracePath(t, ct),
        (t.fillStyle = "#ffcd40"),
        t.fill(),
        this.tracePath(t, lt),
        (t.fillStyle = "#0f9d58"),
        t.fill(),
        this.tracePath(t, ht),
        (t.fillStyle = "#db4437"),
        t.fill(),
        this.tracePath(t, ft),
        (t.fillStyle = "#4285f4"),
        t.fill(),
        (t.lineWidth = 2.5),
        (t.strokeStyle = "#f1f1f1"),
        t.stroke(),
        (t.lineWidth = 1);
    }
  }
  class ut extends B {
    constructor(t, e, s, i = 1, n = 9) {
      super(t, n);
      const r = new q(this, e, s),
        a = new q(this, e + 64, s),
        o = new q(this, e + 64, s + 256),
        c = new q(this, e, s + 256);
      new L(this, r, a, !0, i),
        new L(this, a, o, !0, i),
        new L(this, o, c, !0, i),
        new L(this, c, r, !0, i),
        new L(this, r, o, !1, i),
        new L(this, a, c, !1, i),
        this.center.set(e + 32, s + 128),
        this.halfExtents.set(32, 128);
    }
    rotate(t) {
      const e = Math.cos(t),
        s = Math.sin(t);
      for (const t of this.vertices)
        m.setSubtract(t.position, this.center),
          t.set(
            this.center.x + m.x * e - m.y * s,
            this.center.y + m.x * s + m.y * e
          ),
          t.integrate();
    }
    paint(t, e) {
      for (const t of this.vertices) t.interpolate(e);
      t.beginPath();
      for (let e = 0; e < 4; ++e)
        t.lineTo(
          this.vertices[e].interpolated.x,
          this.vertices[e].interpolated.y
        );
      t.closePath(),
        t.save(),
        t.clip(),
        t.drawImage(Rt, 0, 0, 960, 540),
        t.restore(),
        (t.strokeStyle = Pt),
        t.stroke();
    }
  }
  class xt extends B {
    constructor(t, e, s, i, n = 0.5, r = 1) {
      super(t, r),
        this.center.set(e, s),
        this.halfExtents.set(0.5 * i, 0.5 * i);
      const a = p,
        o = this.halfExtents.length();
      for (let t = 0; t < 4; ++t) {
        const i = a * t + g;
        new V(this, e + o * Math.cos(i), s + o * Math.sin(i));
      }
      for (let t = 0; t < this.vertices.length - 1; ++t)
        for (let e = t + 1; e < this.vertices.length; ++e)
          new L(this, this.vertices[t], this.vertices[e], e === t + 1, n);
    }
  }
  xt.prototype.paint = ut.prototype.paint;
  class pt extends B {
    constructor(t, e, s, i = 0.5, n = 1) {
      super(t, n);
      const r = new V(this, e, s),
        a = new V(this, e + 110, s),
        o = new V(this, e + 110, s + 196),
        c = new V(this, e, s + 196);
      new L(this, r, a, !0, i),
        new L(this, a, o, !0, i),
        new L(this, o, c, !0, i),
        new L(this, c, r, !0, i),
        new L(this, r, o, !1, i),
        new L(this, a, c, !1, i),
        this.center.set(e + 55, s + 98),
        this.halfExtents.set(55, 98);
    }
    paint(t, e) {
      for (const t of this.vertices) t.interpolate(e);
      t.beginPath();
      let s = 0,
        i = 0;
      for (let e = 0; e < 4; ++e) {
        const n = this.vertices[e].interpolated;
        t.lineTo(n.x, n.y), (s += n.x), (i += n.y);
      }
      t.closePath(),
        (t.fillStyle = "#f1f1f1"),
        t.fill(),
        m.setSubtract(
          this.vertices[1].interpolated,
          this.vertices[0].interpolated
        ),
        P.setSubtract(
          this.vertices[2].interpolated,
          this.vertices[3].interpolated
        ),
        t.save(),
        t.translate(0.25 * s, 0.25 * i),
        t.rotate(0.5 * (Math.atan2(m.y, m.x) + Math.atan2(P.y, P.x))),
        t.drawImage(vt, -44, -32, 88, 64),
        t.restore();
    }
  }
  const gt = "#4285f4",
    yt = "#ea4335",
    vt = k(88, 64, (t) => {
      (t.fillStyle = "#f1f1f1"),
        t.fillRect(0, 0, 88, 64),
        t.save(),
        t.translate(1, 0),
        t.scale(5, 5),
        (t.fillStyle = gt),
        t.fillRect(0, 0, 3, 3),
        (t.fillStyle = yt),
        t.fillRect(4, 1, 2, 2),
        (t.fillStyle = "#fbbc05"),
        t.fillRect(7, 1, 2, 2),
        (t.fillStyle = gt),
        t.fillRect(10, 1, 2, 3),
        (t.fillStyle = "#34a853"),
        t.fillRect(13, 0, 1, 3),
        (t.fillStyle = yt),
        t.fillRect(15, 1, 2, 2),
        t.restore(),
        t.save(),
        t.translate(0, 30),
        t.scale(3, 3),
        (t.fillStyle = "#ddd"),
        t.fillRect(0, 0, 29, 4),
        (t.fillStyle = "#cdcdcd"),
        t.fillRect(3, 7, 10, 4),
        t.fillRect(16, 7, 10, 4),
        t.restore();
    });
  class wt {
    constructor() {
      (this.x = 850), (this.y = 172), (this.width = 110), (this.height = 196);
    }
    update() {}
    contains(t) {
      return (
        t.x >= this.x &&
        t.x - this.x < this.width &&
        t.y >= this.y &&
        t.y - this.y < this.height
      );
    }
    paint(t, e) {
      (t.fillStyle = "#f1f1f1"),
        t.fillRect(this.x, this.y, this.width, this.height),
        t.drawImage(vt, this.x + 11, this.y + 66, 88, 64);
    }
  }
  class bt extends wt {
    constructor() {
      super(),
        (this.n = 0),
        (this.old = {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
        });
    }
    update() {
      if (!(this.n > 80))
        if (
          (++this.n,
          (this.old.x = this.x),
          (this.old.y = this.y),
          (this.old.width = this.width),
          (this.old.height = this.height),
          this.n <= 25)
        ) {
          const t = 0.04 * this.n;
          (this.x = v(850, 807, w(t))),
            (this.y = v(172, 387, w(t))),
            (this.width = v(110, 153, w(t))),
            (this.height = v(196, 153, w(t)));
        } else {
          const t = (this.n - 25) / 55;
          (this.x = v(807, 252, b(t))),
            (this.y = v(387, 430, b(t))),
            (this.width = v(153, 196, b(t))),
            (this.height = v(153, 110, b(t)));
        }
    }
    paint(t, e) {
      let s, i, n, r;
      this.n > 80
        ? ((s = this.x), (i = this.y), (n = this.width), (r = this.height))
        : ((s = v(this.old.x, this.x, e)),
          (i = v(this.old.y, this.y, e)),
          (n = v(this.old.width, this.width, e)),
          (r = v(this.old.height, this.height, e))),
        (t.fillStyle = "#f1f1f1"),
        t.fillRect(s, i, n, r),
        t.drawImage(vt, s + 0.5 * (n - 88), i + 0.5 * (r - 64), 88, 64);
    }
  }
  class Mt extends wt {
    contains() {
      return !1;
    }
    paint() {}
  }
  class St extends class {
    constructor() {
      (this.vertices = []), (this.constraints = []), (this.bodies = []);
    }
    integrate() {
      for (let t = 0; t < this.vertices.length; ++t)
        this.vertices[t].integrate();
    }
    solve() {
      for (let t = 0; t < 10; ++t) {
        for (const t of this.constraints) t.solve();
        for (const t of this.bodies) t.boundingBox();
        for (let t = 0; t < this.bodies.length - 1; ++t)
          for (let e = t + 1; e < this.bodies.length; ++e)
            D(this.bodies[t], this.bodies[e]);
      }
    }
  } {
    constructor(t, e = 0) {
      super(),
        (this.startingPoint = t),
        (this.reticle = new K(this, t)),
        (this.projectile = new (this.constructor.getUserAgent())(
          this,
          t.x,
          t.y
        )),
        (this.firingPin = null),
        (this.website = new wt()),
        (this.state = 0),
        (this.duration = 144),
        (this.waited = 0),
        (this.curtain = e),
        (this.curtainPicture = Et),
        (this.autoWin = !1);
    }
    static getUserAgent() {
      return null !== location.search.match(/firefox=1/)
        ? nt
        : null !== location.search.match(/piracy=1/) ||
          (document.monetization && "started" === document.monetization.state)
        ? dt
        : nt;
    }
    updateTargeting(t) {
      this.reticle.lastPosition.setTo(t);
    }
    launch() {
      let t, e;
      return (
        m.setSubtract(
          this.reticle.lastPosition,
          (t = this.reticle.startingVertex.position)
        ),
        !((e = m.length()) < 16) &&
          (m.scalarMult(
            ((1 - (e - (s = 16)) / (256 - s)) * (30 - (i = 10)) + i) / e
          ),
          (this.firingPin = new Z(
            this,
            m.x + t.x,
            m.y + t.y,
            32,
            Math.atan2(m.y, m.x) + g,
            1,
            9999
          )),
          !0)
      );
      var s, i;
    }
    getIndex() {
      return 0;
    }
  }
  class kt extends St {
    constructor(t, e = 0) {
      super(t, e), (this.wall = new ut(this, t.x + 256, 142, 1, 9999));
    }
    getIndex() {
      return 1;
    }
  }
  class mt extends St {
    static getUserAgent() {
      return nt;
    }
    constructor(t, e = 0) {
      super(t, e),
        (this.website = new Mt()),
        new ot(this, 480, 270),
        new dt(this, 960 - this.startingPoint.x, 270);
      for (let t = 1; t <= 3; ++t)
        for (let e = 0; e < t; ++e)
          new xt(
            this,
            960 - 64 * e - 32 * (3 - t) - 33,
            540 - 64 * (3 - t) - 33,
            64,
            0.5,
            0.5
          );
    }
    solve() {
      super.solve(), 3 === this.state && (this.state = 0);
    }
    getIndex() {
      return 9;
    }
  }
  const Pt = W.createLinearGradient(0, 0, 960, 0);
  function Tt(t, e) {
    (t.font = Q),
      (t.textAlign = "center"),
      (t.textBaseline = "top"),
      (t.fillStyle = "#fff");
    for (let s = 80; s < 960; s += 160)
      for (let i = 15; i < 540; i += 45) t.fillText(e, s, i);
  }
  Pt.addColorStop(0, "#f857a6"), Pt.addColorStop(1, "#ff5858");
  const Et = k(960, 540, (t) => {
      (t.fillStyle = Pt), t.fillRect(0, 0, 960, 540), Tt(t, "404 Not Found");
    }),
    It = k(960, 540, (t) => {
      (t.fillStyle = Pt), t.fillRect(0, 0, 960, 540), Tt(t, "301 Moved");
    }),
    Rt = k(960, 540, (t) => {
      t.beginPath();
      for (let e = 0; e < 1500; e += 20) t.moveTo(e, 0), t.lineTo(e - 540, 540);
      (t.strokeStyle = Pt), t.stroke();
    });
  function Ct(t, e, s) {
    t.clearRect(0, 0, 960, 540),
      s.constructor === St
        ? ((t.font = Q),
          (t.textAlign = "center"),
          (t.textBaseline = "top"),
          (t.fillStyle = "#f1f1f1"),
          t.fillText("1. Pull", s.startingPoint.x, s.startingPoint.y + 48),
          t.fillText(
            "2. Release",
            s.startingPoint.x - 256,
            s.startingPoint.y + 48
          ))
        : s.constructor === mt &&
          ((t.font = Q),
          (t.textAlign = "center"),
          (t.textBaseline = "middle"),
          (t.fillStyle = "#f1f1f1"),
          t.fillText(
            "",
            480,
            516
          ),
          (t.font = X),
          (t.fillStyle = it),
          t.fillText("Thank you for playing!", 480, 135));
  }
  function At(t, e, s, i, n, r = 0) {
    t.save(),
      t.translate(s, i),
      t.rotate(-0.5124),
      t.beginPath(),
      t.lineTo(r, -500),
      t.lineTo(n, -500),
      t.lineTo(n, 1e3),
      t.lineTo(r, 1e3),
      t.closePath(),
      t.restore(),
      t.save(),
      t.clip(),
      t.drawImage(e, 0, 0, 960, 540),
      t.restore();
  }
  const Vt = [
    St,
    kt,
    class extends St {
      constructor(t, e = 0) {
        super(t, e),
          new ut(this, t.x + 256, 2, 1, 9999).rotate(y),
          new ut(this, t.x + 256, 282, 1, 9999).rotate(-y);
      }
      getIndex() {
        return 2;
      }
    },
    class extends kt {
      constructor(t, e = 0) {
        super(t, e);
        for (let e = 0; e < 8; ++e)
          (e < 2 || e > 5) &&
            new xt(this, t.x + 256 + 32, 14 + 64 * e + 32, 64, 0.5, 0.5);
        new ut(this, t.x + 256, -242, 1, 9999),
          new ut(this, t.x + 256, 526, 1, 9999);
      }
      getIndex() {
        return 3;
      }
    },
    class extends kt {
      constructor(t, e = 0) {
        super(t, e), (this.duration = 196);
      }
      updateTargeting(t) {
        if (
          (this.reticle.lastPosition.setTo(t),
          m.setSubtract(this.startingPoint, t),
          m.length() < 16)
        )
          return;
        const e = Math.atan2(m.y, m.x),
          s = 64 * Math.cos(e),
          i = 64 * Math.sin(e);
        m.scalarMult(256 / m.length()), m.add(this.startingPoint);
        const n = this.wall.vertices;
        let r = m.x + 128 * Math.cos(e - p),
          a = m.y + 128 * Math.sin(e - p);
        n[0].set(r, a),
          n[1].set(r + s, a + i),
          (r = m.x + 128 * Math.cos(e + p)),
          (a = m.y + 128 * Math.sin(e + p)),
          n[2].set(r + s, a + i),
          n[3].set(r, a);
      }
      getIndex() {
        return 4;
      }
    },
    class extends St {
      constructor(t, e = 0) {
        super(t, e), m.set(0.5 * (850 - t.x), -67.5);
        for (const t of this.projectile.vertices)
          t.position.add(m), t.oldPosition.add(m);
        this.projectile.center.add(m), new xt(this, t.x, t.y, 64, 0.5, 4);
      }
      getIndex() {
        return 5;
      }
    },
    class extends St {
      constructor(t, e = 0) {
        super(t, e), (this.website = new bt()), (this.curtainPicture = It);
      }
      solve() {
        super.solve(),
          (3 !== this.state && 4 !== this.state && 6 !== this.state) ||
            this.website.update();
      }
      getIndex() {
        return 6;
      }
    },
    class extends St {
      constructor(t, e = 0) {
        super(t, e), (this.clone = new ot(this, 905, 270));
      }
      integrate() {
        do {
          if (3 !== this.state) break;
          m.setSubtract(this.projectile.center, this.clone.center);
          const t = m.length();
          if (t < 64) break;
          m.scalarMult(1 / t);
          for (const t of this.clone.vertices) t.position.add(m);
        } while (0);
        super.integrate();
      }
      getIndex() {
        return 7;
      }
    },
    class extends St {
      static getUserAgent() {
        return ot;
      }
      constructor(t, e = 0) {
        super(t, e),
          (this.website = new Mt()),
          (this.duration = 196),
          (this.autoWin = !0),
          new pt(this, 849, 172);
      }
      integrate() {
        let t, e;
        3 === this.state || 4 === this.state || 6 === this.state
          ? ((t = 0.9), (e = 0.5))
          : ((t = 0), (e = 0));
        for (let s = 0; s < this.vertices.length; ++s)
          this.vertices[s].integrate(t, e);
      }
      getIndex() {
        return 8;
      }
    },
    mt,
  ];
  let qt, Lt;
  !(function () {
    const t = new u(350, 270);
    let e, s, i;
    (qt = new Vt[0](t)),
      H(),
      J(
        function () {
          qt.integrate(),
            qt.solve(),
            2 === qt.state
              ? --e <= 0 &&
                (qt.firingPin.retract(),
                (qt.firingPin = null),
                (qt.state = 3),
                (s = 2))
              : 3 === qt.state
              ? ++qt.waited >= qt.duration
                ? qt.autoWin
                  ? ((qt.state = 6),
                    (Lt = new Vt[(qt.getIndex() + 1) % Vt.length](t)),
                    (i = 0),
                    (Y.dragging = !1),
                    (Y.vertex = void 0),
                    T(R))
                  : ((qt.state = 4), T(I))
                : qt.website.contains(qt.projectile.center) &&
                  --s <= 0 &&
                  ((qt.state = 6),
                  (Lt = new Vt[(qt.getIndex() + 1) % Vt.length](t)),
                  (i = 0),
                  (Y.dragging = !1),
                  (Y.vertex = void 0),
                  T(R))
              : 4 === qt.state
              ? ++qt.curtain >= 24 &&
                ((qt = new Vt[qt.getIndex()](t, 24)),
                (qt.state = 5),
                (Y.dragging = !1),
                (Y.vertex = void 0))
              : 5 === qt.state
              ? --qt.curtain <= 0 && (qt.state = 0)
              : 6 === qt.state && ++i > 69 && (qt = Lt);
        },
        function (s) {
          let n, r;
          if (6 === qt.state)
            (W.fillStyle = it),
              W.fillRect(0, 0, 960, 540),
              W.save(),
              (n = (i - 1 + s) / 69),
              (r = v(1, 0.5, M(n))),
              W.translate(480, 270),
              W.scale(r, r),
              W.translate(-480, -270),
              W.translate(v(0, -960, M(n)), 0),
              W.beginPath(),
              W.rect(0, 0, 960, 540),
              W.clip();
          else if (Y.dragging && 5 !== qt.state) {
            if (
              (!Y.vertex &&
                t.distanceSquared(Y) <= 4096 &&
                ((Y.vertex = qt.reticle.targetingVertex),
                0 === qt.state && (qt.state = 1)),
              Y.vertex)
            ) {
              const e = qt.reticle.targetingVertex.position;
              e.setTo(Y);
              const s = t.distanceSquared(e);
              s > 65536 &&
                (e.subtract(t), e.scalarMult(256 / Math.sqrt(s)), e.add(t)),
                qt.updateTargeting(e);
            }
          } else
            1 === qt.state &&
              (qt.launch() ? ((qt.state = 2), (e = 4), T(E)) : (qt.state = 0));
          Ct(W, 0, qt), qt.website.paint(W, s);
          for (const t of qt.bodies) t.paint(W, s);
          if (
            ((function (t, e, s) {
              let i;
              3 === s.state
                ? ((i = ((s.waited - 1 + e) / s.duration) * 960),
                  (t.fillStyle = Pt),
                  t.fillRect(0, 0, i, 3))
                : 4 === s.state
                ? ((i = 0.5 * b((s.curtain - 1 + e) / 24) * 1102),
                  (t.fillStyle = Pt),
                  t.fillRect(0, 0, 960, 3),
                  At(t, s.curtainPicture, 0, 540, i),
                  At(t, s.curtainPicture, 960, 0, -i))
                : 5 === s.state &&
                  ((i = 0.5 * w((s.curtain + 1 - e) / 24) * 1102),
                  At(t, s.curtainPicture, 480, 270, -i, i));
            })(W, s, qt),
            6 === qt.state)
          ) {
            W.restore(),
              W.save(),
              W.translate(v(960, 0, M(n)), 0),
              Ct(W, 0, Lt),
              Lt.website.paint(W, s);
            for (const t of Lt.bodies) t.paint(W, s);
            W.restore();
          }
        }
      );
  })();
})();
