const DEBUG = !1;
function log(a) {
  DEBUG && console.log(a);
}
const buildShortcut = (a) =>
    a.substr(0, 3) + a.substr(-3) + (a[a.length - 8] || "_"),
  buildShortcuts = (a) => {
    for (const b in a) {
      const c = buildShortcut(b);
      c in a || (log(`Shortcut '${c}' for '${b}'`), (a[c] = a[b]));
    }
  };
const icon = "\ud83d\udc68\u200d\ud83d\ude80",
  gameName = "Captain Callisto",
  addTrophy = (a, b = "") => {
    localStorage[`OS13kTrophy,${icon},${gameName},${a}`] = b;
  },
  registerSong = (a, b) => {
    localStorage[`OS13kMusic,${a}`] = JSON.stringify(b);
  };
class RNG {
  constructor(a) {
    this.m = 2147483648;
    this.a = 1103515245;
    this.c = 12345;
    this.state = a;
  }
  nextInt() {
    return (this.state = (this.a * this.state + this.c) % this.m);
  }
  nextFloat() {
    return this.nextInt() / (this.m - 1);
  }
  nextRange(a, b) {
    b -= a;
    const c = this.nextInt() / this.m;
    return a + ((c * b) | 0);
  }
}
const vec3 = {
  create: () => new Float32Array(3),
  clone: (a) => new Float32Array(a),
  magnitude: (a) => Math.hypot(a[0], a[1], a[2]),
  fromValues: (a, b, c) => new Float32Array([a, b, c]),
  copy: (a, b) => {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    return a;
  },
  set: (a, b, c, d) => {
    a[0] = b;
    a[1] = c;
    a[2] = d;
    return a;
  },
  add: (a, b, c) => {
    a[0] = b[0] + c[0];
    a[1] = b[1] + c[1];
    a[2] = b[2] + c[2];
    return a;
  },
  subtract: (a, b, c) => {
    a[0] = b[0] - c[0];
    a[1] = b[1] - c[1];
    a[2] = b[2] - c[2];
    return a;
  },
  multiply: (a, b, c) => {
    a[0] = b[0] * c[0];
    a[1] = b[1] * c[1];
    a[2] = b[2] * c[2];
    return a;
  },
  divide: (a, b, c) => {
    a[0] = b[0] / c[0];
    a[1] = b[1] / c[1];
    a[2] = b[2] / c[2];
    return a;
  },
  ceil: (a, b) => {
    a[0] = Math.ceil(b[0]);
    a[1] = Math.ceil(b[1]);
    a[2] = Math.ceil(b[2]);
    return a;
  },
  min: (a, b, c) => {
    a[0] = Math.min(b[0], c[0]);
    a[1] = Math.min(b[1], c[1]);
    a[2] = Math.min(b[2], c[2]);
    return a;
  },
  max: (a, b, c) => {
    a[0] = Math.max(b[0], c[0]);
    a[1] = Math.max(b[1], c[1]);
    a[2] = Math.max(b[2], c[2]);
    return a;
  },
  scale: (a, b, c) => {
    a[0] = b[0] * c;
    a[1] = b[1] * c;
    a[2] = b[2] * c;
    return a;
  },
  scaleAndAdd: (a, b, c, d) => {
    a[0] = b[0] + c[0] * d;
    a[1] = b[1] + c[1] * d;
    a[2] = b[2] + c[2] * d;
    return a;
  },
  distance: (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]),
  squaredDistance: (a, b) => {
    const c = b[0] - a[0],
      d = b[1] - a[1];
    a = b[2] - a[2];
    return c * c + d * d + a * a;
  },
  squaredLength: (a) => {
    const b = a[0],
      c = a[1];
    a = a[2];
    return b * b + c * c + a * a;
  },
  negate: (a, b) => {
    a[0] = -b[0];
    a[1] = -b[1];
    a[2] = -b[2];
    return a;
  },
  inverse: (a, b) => {
    a[0] = 1 / b[0];
    a[1] = 1 / b[1];
    a[2] = 1 / b[2];
    return a;
  },
  normalize: (a, b) => {
    const c = vec3.magnitude(b);
    return 0 < c ? vec3.scale(a, b, 1 / c) : vec3.copy(a, b);
  },
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b, c) => {
    const d = b[0],
      e = b[1];
    b = b[2];
    const f = c[0],
      g = c[1];
    c = c[2];
    a[0] = e * c - b * g;
    a[1] = b * f - d * c;
    a[2] = d * g - e * f;
    return a;
  },
  cross2: (a, b, c, d) => {
    const e = c[0] - b[0],
      f = c[1] - b[1];
    c = c[2] - b[2];
    const g = d[0] - b[0],
      h = d[1] - b[1];
    b = d[2] - b[2];
    a[0] = f * b - c * h;
    a[1] = c * g - e * b;
    a[2] = e * h - f * g;
    return a;
  },
  lerp: (a, b, c, d) => {
    a[0] = b[0] + d * (c[0] - b[0]);
    a[1] = b[1] + d * (c[1] - b[1]);
    a[2] = b[2] + d * (c[2] - b[2]);
    return a;
  },
  transformMat4: (a, b, c) => {
    const d = b[0],
      e = b[1];
    b = b[2];
    let f = c[3] * d + c[7] * e + c[11] * b + c[15];
    f = f || 1;
    a[0] = (c[0] * d + c[4] * e + c[8] * b + c[12]) / f;
    a[1] = (c[1] * d + c[5] * e + c[9] * b + c[13]) / f;
    a[2] = (c[2] * d + c[6] * e + c[10] * b + c[14]) / f;
    return a;
  },
  rotateX: (a, b, c, d) => {
    const e = [],
      f = [];
    e[0] = b[0] - c[0];
    e[1] = b[1] - c[1];
    e[2] = b[2] - c[2];
    f[0] = e[0];
    f[1] = e[1] * Math.cos(d) - e[2] * Math.sin(d);
    f[2] = e[1] * Math.sin(d) + e[2] * Math.cos(d);
    a[0] = f[0] + c[0];
    a[1] = f[1] + c[1];
    a[2] = f[2] + c[2];
    return a;
  },
  rotateY: (a, b, c, d) => {
    const e = [],
      f = [];
    e[0] = b[0] - c[0];
    e[1] = b[1] - c[1];
    e[2] = b[2] - c[2];
    f[0] = e[2] * Math.sin(d) + e[0] * Math.cos(d);
    f[1] = e[1];
    f[2] = e[2] * Math.cos(d) - e[0] * Math.sin(d);
    a[0] = f[0] + c[0];
    a[1] = f[1] + c[1];
    a[2] = f[2] + c[2];
    return a;
  },
  rotateZ: (a, b, c, d) => {
    const e = [],
      f = [];
    e[0] = b[0] - c[0];
    e[1] = b[1] - c[1];
    e[2] = b[2] - c[2];
    f[0] = e[0] * Math.cos(d) - e[1] * Math.sin(d);
    f[1] = e[0] * Math.sin(d) + e[1] * Math.cos(d);
    f[2] = e[2];
    a[0] = f[0] + c[0];
    a[1] = f[1] + c[1];
    a[2] = f[2] + c[2];
    return a;
  },
  angle: (a, b) => {
    a = vec3.fromValues(a[0], a[1], a[2]);
    b = vec3.fromValues(b[0], b[1], b[2]);
    vec3.normalize(a, a);
    vec3.normalize(b, b);
    b = vec3.dot(a, b);
    return 1 < b ? 0 : -1 > b ? Math.PI : Math.acos(b);
  },
  str: (a) =>
    "vec3(" +
    a[0].toFixed(4) +
    ", " +
    a[1].toFixed(4) +
    ", " +
    a[2].toFixed(4) +
    ")",
  exactEquals: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2],
  equals: (a, b) => {
    const c = a[0],
      d = a[1];
    a = a[2];
    const e = b[0],
      f = b[1];
    b = b[2];
    return (
      Math.abs(c - e) <= EPSILON * Math.max(1, Math.abs(c), Math.abs(e)) &&
      Math.abs(d - f) <= EPSILON * Math.max(1, Math.abs(d), Math.abs(f)) &&
      Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b))
    );
  },
};
const mat4 = {
  create: () => {
    const a = new Float32Array(16);
    a[0] = 1;
    a[5] = 1;
    a[10] = 1;
    a[15] = 1;
    return a;
  },
  clone: (a) => {
    const b = new Float32Array(16);
    b[0] = a[0];
    b[1] = a[1];
    b[2] = a[2];
    b[3] = a[3];
    b[4] = a[4];
    b[5] = a[5];
    b[6] = a[6];
    b[7] = a[7];
    b[8] = a[8];
    b[9] = a[9];
    b[10] = a[10];
    b[11] = a[11];
    b[12] = a[12];
    b[13] = a[13];
    b[14] = a[14];
    b[15] = a[15];
    return b;
  },
  copy: (a, b) => {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];
    a[6] = b[6];
    a[7] = b[7];
    a[8] = b[8];
    a[9] = b[9];
    a[10] = b[10];
    a[11] = b[11];
    a[12] = b[12];
    a[13] = b[13];
    a[14] = b[14];
    a[15] = b[15];
    return a;
  },
  fromValues: (a, b, c, d, e, f, g, h, k, m, p, q, v, y, x, w) => {
    const l = new Float32Array(16);
    l[0] = a;
    l[1] = b;
    l[2] = c;
    l[3] = d;
    l[4] = e;
    l[5] = f;
    l[6] = g;
    l[7] = h;
    l[8] = k;
    l[9] = m;
    l[10] = p;
    l[11] = q;
    l[12] = v;
    l[13] = y;
    l[14] = x;
    l[15] = w;
    return l;
  },
  set: (a, b, c, d, e, f, g, h, k, m, p, q, v, y, x, w, l) => {
    a[0] = b;
    a[1] = c;
    a[2] = d;
    a[3] = e;
    a[4] = f;
    a[5] = g;
    a[6] = h;
    a[7] = k;
    a[8] = m;
    a[9] = p;
    a[10] = q;
    a[11] = v;
    a[12] = y;
    a[13] = x;
    a[14] = w;
    a[15] = l;
    return a;
  },
  identity: (a) => {
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 0;
    a[5] = 1;
    a[6] = 0;
    a[7] = 0;
    a[8] = 0;
    a[9] = 0;
    a[10] = 1;
    a[11] = 0;
    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
    return a;
  },
  transpose: (a, b) => {
    if (a === b) {
      const c = b[1],
        d = b[2],
        e = b[3],
        f = b[6],
        g = b[7],
        h = b[11];
      a[1] = b[4];
      a[2] = b[8];
      a[3] = b[12];
      a[4] = c;
      a[6] = b[9];
      a[7] = b[13];
      a[8] = d;
      a[9] = f;
      a[11] = b[14];
      a[12] = e;
      a[13] = g;
      a[14] = h;
    } else
      (a[0] = b[0]),
        (a[1] = b[4]),
        (a[2] = b[8]),
        (a[3] = b[12]),
        (a[4] = b[1]),
        (a[5] = b[5]),
        (a[6] = b[9]),
        (a[7] = b[13]),
        (a[8] = b[2]),
        (a[9] = b[6]),
        (a[10] = b[10]),
        (a[11] = b[14]),
        (a[12] = b[3]),
        (a[13] = b[7]),
        (a[14] = b[11]),
        (a[15] = b[15]);
    return a;
  },
  invert: (a, b) => {
    const c = b[0],
      d = b[1],
      e = b[2],
      f = b[3],
      g = b[4],
      h = b[5],
      k = b[6],
      m = b[7],
      p = b[8],
      q = b[9],
      v = b[10],
      y = b[11],
      x = b[12],
      w = b[13],
      l = b[14];
    b = b[15];
    const A = c * h - d * g,
      u = c * k - e * g,
      t = c * m - f * g,
      r = d * k - e * h,
      n = d * m - f * h,
      D = e * m - f * k,
      C = p * w - q * x,
      F = p * l - v * x,
      z = p * b - y * x,
      E = q * l - v * w,
      G = q * b - y * w,
      H = v * b - y * l;
    let B = A * H - u * G + t * E + r * z - n * F + D * C;
    if (!B) return null;
    B = 1 / B;
    a[0] = (h * H - k * G + m * E) * B;
    a[1] = (e * G - d * H - f * E) * B;
    a[2] = (w * D - l * n + b * r) * B;
    a[3] = (v * n - q * D - y * r) * B;
    a[4] = (k * z - g * H - m * F) * B;
    a[5] = (c * H - e * z + f * F) * B;
    a[6] = (l * t - x * D - b * u) * B;
    a[7] = (p * D - v * t + y * u) * B;
    a[8] = (g * G - h * z + m * C) * B;
    a[9] = (d * z - c * G - f * C) * B;
    a[10] = (x * n - w * t + b * A) * B;
    a[11] = (q * t - p * n - y * A) * B;
    a[12] = (h * F - g * E - k * C) * B;
    a[13] = (c * E - d * F + e * C) * B;
    a[14] = (w * u - x * r - l * A) * B;
    a[15] = (p * r - q * u + v * A) * B;
    return a;
  },
  multiply: (a, b, c) => {
    const d = b[0],
      e = b[1],
      f = b[2],
      g = b[3],
      h = b[4],
      k = b[5],
      m = b[6],
      p = b[7],
      q = b[8],
      v = b[9],
      y = b[10],
      x = b[11],
      w = b[12],
      l = b[13],
      A = b[14];
    b = b[15];
    let u = c[0],
      t = c[1],
      r = c[2],
      n = c[3];
    a[0] = u * d + t * h + r * q + n * w;
    a[1] = u * e + t * k + r * v + n * l;
    a[2] = u * f + t * m + r * y + n * A;
    a[3] = u * g + t * p + r * x + n * b;
    u = c[4];
    t = c[5];
    r = c[6];
    n = c[7];
    a[4] = u * d + t * h + r * q + n * w;
    a[5] = u * e + t * k + r * v + n * l;
    a[6] = u * f + t * m + r * y + n * A;
    a[7] = u * g + t * p + r * x + n * b;
    u = c[8];
    t = c[9];
    r = c[10];
    n = c[11];
    a[8] = u * d + t * h + r * q + n * w;
    a[9] = u * e + t * k + r * v + n * l;
    a[10] = u * f + t * m + r * y + n * A;
    a[11] = u * g + t * p + r * x + n * b;
    u = c[12];
    t = c[13];
    r = c[14];
    n = c[15];
    a[12] = u * d + t * h + r * q + n * w;
    a[13] = u * e + t * k + r * v + n * l;
    a[14] = u * f + t * m + r * y + n * A;
    a[15] = u * g + t * p + r * x + n * b;
    return a;
  },
  translate: (a, b, c) => {
    const d = c[0],
      e = c[1];
    c = c[2];
    let f, g, h, k, m, p, q, v, y, x, w, l;
    b === a
      ? ((a[12] = b[0] * d + b[4] * e + b[8] * c + b[12]),
        (a[13] = b[1] * d + b[5] * e + b[9] * c + b[13]),
        (a[14] = b[2] * d + b[6] * e + b[10] * c + b[14]),
        (a[15] = b[3] * d + b[7] * e + b[11] * c + b[15]))
      : ((f = b[0]),
        (g = b[1]),
        (h = b[2]),
        (k = b[3]),
        (m = b[4]),
        (p = b[5]),
        (q = b[6]),
        (v = b[7]),
        (y = b[8]),
        (x = b[9]),
        (w = b[10]),
        (l = b[11]),
        (a[0] = f),
        (a[1] = g),
        (a[2] = h),
        (a[3] = k),
        (a[4] = m),
        (a[5] = p),
        (a[6] = q),
        (a[7] = v),
        (a[8] = y),
        (a[9] = x),
        (a[10] = w),
        (a[11] = l),
        (a[12] = f * d + m * e + y * c + b[12]),
        (a[13] = g * d + p * e + x * c + b[13]),
        (a[14] = h * d + q * e + w * c + b[14]),
        (a[15] = k * d + v * e + l * c + b[15]));
    return a;
  },
  scale: (a, b, c) => {
    const d = c[0],
      e = c[1];
    c = c[2];
    a[0] = b[0] * d;
    a[1] = b[1] * d;
    a[2] = b[2] * d;
    a[3] = b[3] * d;
    a[4] = b[4] * e;
    a[5] = b[5] * e;
    a[6] = b[6] * e;
    a[7] = b[7] * e;
    a[8] = b[8] * c;
    a[9] = b[9] * c;
    a[10] = b[10] * c;
    a[11] = b[11] * c;
    a[12] = b[12];
    a[13] = b[13];
    a[14] = b[14];
    a[15] = b[15];
    return a;
  },
  rotate: (a, b, c, d) => {
    var e = d[0],
      f = d[1];
    d = d[2];
    var g = Math.sqrt(e * e + f * f + d * d);
    let h, k, m, p, q, v, y, x, w, l, A, u, t, r, n, D, C, F, z, E;
    if (Math.abs(g) < EPSILON) return null;
    g = 1 / g;
    e *= g;
    f *= g;
    d *= g;
    h = Math.sin(c);
    k = Math.cos(c);
    m = 1 - k;
    c = b[0];
    g = b[1];
    p = b[2];
    q = b[3];
    v = b[4];
    y = b[5];
    x = b[6];
    w = b[7];
    l = b[8];
    A = b[9];
    u = b[10];
    t = b[11];
    r = e * e * m + k;
    n = f * e * m + d * h;
    D = d * e * m - f * h;
    C = e * f * m - d * h;
    F = f * f * m + k;
    z = d * f * m + e * h;
    E = e * d * m + f * h;
    e = f * d * m - e * h;
    f = d * d * m + k;
    a[0] = c * r + v * n + l * D;
    a[1] = g * r + y * n + A * D;
    a[2] = p * r + x * n + u * D;
    a[3] = q * r + w * n + t * D;
    a[4] = c * C + v * F + l * z;
    a[5] = g * C + y * F + A * z;
    a[6] = p * C + x * F + u * z;
    a[7] = q * C + w * F + t * z;
    a[8] = c * E + v * e + l * f;
    a[9] = g * E + y * e + A * f;
    a[10] = p * E + x * e + u * f;
    a[11] = q * E + w * e + t * f;
    b !== a &&
      ((a[12] = b[12]), (a[13] = b[13]), (a[14] = b[14]), (a[15] = b[15]));
    return a;
  },
  rotateX: (a, b, c) => {
    const d = Math.sin(c);
    c = Math.cos(c);
    const e = b[4],
      f = b[5],
      g = b[6],
      h = b[7],
      k = b[8],
      m = b[9],
      p = b[10],
      q = b[11];
    b !== a &&
      ((a[0] = b[0]),
      (a[1] = b[1]),
      (a[2] = b[2]),
      (a[3] = b[3]),
      (a[12] = b[12]),
      (a[13] = b[13]),
      (a[14] = b[14]),
      (a[15] = b[15]));
    a[4] = e * c + k * d;
    a[5] = f * c + m * d;
    a[6] = g * c + p * d;
    a[7] = h * c + q * d;
    a[8] = k * c - e * d;
    a[9] = m * c - f * d;
    a[10] = p * c - g * d;
    a[11] = q * c - h * d;
    return a;
  },
  rotateY: (a, b, c) => {
    const d = Math.sin(c);
    c = Math.cos(c);
    const e = b[0],
      f = b[1],
      g = b[2],
      h = b[3],
      k = b[8],
      m = b[9],
      p = b[10],
      q = b[11];
    b !== a &&
      ((a[4] = b[4]),
      (a[5] = b[5]),
      (a[6] = b[6]),
      (a[7] = b[7]),
      (a[12] = b[12]),
      (a[13] = b[13]),
      (a[14] = b[14]),
      (a[15] = b[15]));
    a[0] = e * c - k * d;
    a[1] = f * c - m * d;
    a[2] = g * c - p * d;
    a[3] = h * c - q * d;
    a[8] = e * d + k * c;
    a[9] = f * d + m * c;
    a[10] = g * d + p * c;
    a[11] = h * d + q * c;
    return a;
  },
  rotateZ: (a, b, c) => {
    const d = Math.sin(c);
    c = Math.cos(c);
    const e = b[0],
      f = b[1],
      g = b[2],
      h = b[3],
      k = b[4],
      m = b[5],
      p = b[6],
      q = b[7];
    b !== a &&
      ((a[8] = b[8]),
      (a[9] = b[9]),
      (a[10] = b[10]),
      (a[11] = b[11]),
      (a[12] = b[12]),
      (a[13] = b[13]),
      (a[14] = b[14]),
      (a[15] = b[15]));
    a[0] = e * c + k * d;
    a[1] = f * c + m * d;
    a[2] = g * c + p * d;
    a[3] = h * c + q * d;
    a[4] = k * c - e * d;
    a[5] = m * c - f * d;
    a[6] = p * c - g * d;
    a[7] = q * c - h * d;
    return a;
  },
  getTranslation: (a, b) => {
    a[0] = b[12];
    a[1] = b[13];
    a[2] = b[14];
    return a;
  },
  perspective: (a, b, c, d, e) => {
    b = 1 / Math.tan(b / 2);
    const f = 1 / (d - e);
    a[0] = b / c;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 0;
    a[5] = b;
    a[6] = 0;
    a[7] = 0;
    a[8] = 0;
    a[9] = 0;
    a[10] = -(e + d) * f;
    a[11] = 1;
    a[12] = 0;
    a[13] = 0;
    a[14] = 2 * e * d * f;
    a[15] = 0;
    return a;
  },
};
const buildRoundedCube = (a, b) => {
    const c = [],
      d = vec3.fromValues(-1, 1, -1),
      e = vec3.fromValues(1, 1, -1),
      f = vec3.fromValues(1, 1, 1),
      g = vec3.fromValues(-1, 1, 1),
      h = vec3.fromValues(-1, -1, -1),
      k = vec3.fromValues(1, -1, -1),
      m = vec3.fromValues(1, -1, 1),
      p = vec3.fromValues(-1, -1, 1),
      q = vec3.create(),
      v = vec3.create(),
      y = vec3.create(),
      x = vec3.create(),
      w = vec3.create(),
      l = vec3.create(),
      A = (u, t, r) => {
        vec3.subtract(q, t, u);
        vec3.subtract(v, r, u);
        t = (n, D, C) => {
          vec3.scaleAndAdd(n, u, q, D / a);
          vec3.scaleAndAdd(n, n, v, C / a);
          D = vec3.magnitude(n);
          D > b && vec3.scale(n, n, b / D);
        };
        for (r = 0; r < a; r++)
          for (let n = 0; n < a; n++)
            t(y, r, n),
              t(x, r + 1, n),
              t(w, r + 1, n + 1),
              t(l, r, n + 1),
              addQuad(c, y, x, w, l);
      };
    A(d, e, g);
    A(p, m, h);
    A(e, d, k);
    A(g, f, p);
    A(d, g, h);
    A(f, e, m);
    return new Float32Array(c);
  },
  addQuad = (a, b, c, d, e) => {
    addTriangle(a, b, c, d);
    addTriangle(a, b, d, e);
  },
  addTriangle = (a, b, c, d) => {
    addPoint(a, b);
    addPoint(a, c);
    addPoint(a, d);
  },
  addPoint = (a, b) => a.push(...b);
const BYTES_PER_COMPONENT = 4,
  COMPONENTS_PER_VERTEX = 3,
  BYTES_PER_VERTEX = COMPONENTS_PER_VERTEX * BYTES_PER_COMPONENT,
  COMPONENTS_PER_MATRIX = 16,
  BYTES_PER_MATRIX = COMPONENTS_PER_MATRIX * BYTES_PER_COMPONENT,
  COMPONENTS_PER_INSTANCE = 1 + COMPONENTS_PER_MATRIX,
  BYTES_PER_INSTANCE = COMPONENTS_PER_INSTANCE * BYTES_PER_COMPONENT;
let GLenum;
class BufferSet {
  constructor(a, b, c) {
    this.usage = a;
    this.verticesPerInstance = b.length / COMPONENTS_PER_VERTEX;
    this.instanceCount = 0;
    this.vao = gl.createVertexArray();
    gl.binrayt(this.vao);
    this.geometryBuffer = gl.createBuffer();
    gl.binfern(ARRAY_BUFFER, this.geometryBuffer);
    gl.bufataf(ARRAY_BUFFER, b, STATIC_DRAW);
    gl.enarayr(positionAttrib);
    gl.verterb(positionAttrib, 3, FLOAT, !1, BYTES_PER_VERTEX, 0);
    this.instanceData = new Uint32Array(c * COMPONENTS_PER_INSTANCE);
    this.instanceBuffer = gl.createBuffer();
    gl.binfern(ARRAY_BUFFER, this.instanceBuffer);
    gl.bufataf(ARRAY_BUFFER, this.instanceData, a);
    gl.enarayr(colorAttrib);
    gl.verterb(colorAttrib, 4, UNSIGNED_BYTE, !0, BYTES_PER_INSTANCE, 0);
    gl.vertexAttribDivisor(colorAttrib, 1);
    this.matrices = Array(c);
    for (a = 0; a < c; a++)
      this.matrices[a] = new Float32Array(
        this.instanceData.buffer,
        1 * BYTES_PER_COMPONENT + a * BYTES_PER_INSTANCE,
        COMPONENTS_PER_MATRIX
      );
    gl.enarayr(worldMatrixAttrib);
    for (c = 0; 4 > c; c++)
      (a = worldMatrixAttrib + c),
        gl.enarayr(a),
        gl.verterb(a, 4, FLOAT, !1, BYTES_PER_INSTANCE, 4 + 16 * c),
        gl.vertexAttribDivisor(a, 1);
  }
  resetBuffers() {
    this.instanceCount = 0;
  }
  addInstance(a) {
    const b = this.instanceCount++;
    if (DEBUG && b * COMPONENTS_PER_INSTANCE >= this.instanceData.length)
      throw Error(
        "Out of instances (i=" +
          b +
          ", max=" +
          this.instanceData.length / COMPONENTS_PER_INSTANCE +
          ")"
      );
    this.instanceData[b * COMPONENTS_PER_INSTANCE] = a;
    return mat4.identity(this.matrices[b]);
  }
  updateBuffers() {
    gl.binfern(ARRAY_BUFFER, this.instanceBuffer);
    gl.bufataf(ARRAY_BUFFER, this.instanceData, this.usage);
  }
  render() {
    gl.binrayt(this.vao);
    this.usage === DYNAMIC_DRAW &&
      (gl.binfern(ARRAY_BUFFER, this.instanceBuffer),
      gl.bufferSubData(
        ARRAY_BUFFER,
        0,
        this.instanceData,
        0,
        this.instanceCount * COMPONENTS_PER_INSTANCE
      ));
    gl.drawArraysInstanced(
      TRIANGLES,
      0,
      this.verticesPerInstance,
      this.instanceCount
    );
  }
}
const killEvent = (a) => {
  a.preventDefault();
  a.stopPropagation();
};
const KEYBOARD_ENABLED = !0,
  KEY_COUNT = 256,
  KEY_ENTER = 13,
  KEY_SHIFT = 16,
  KEY_ESCAPE = 27,
  KEY_SPACE = 32,
  KEY_LEFT = 37,
  KEY_UP = 38,
  KEY_RIGHT = 39,
  KEY_DOWN = 40,
  KEY_1 = 49,
  KEY_2 = 50,
  KEY_3 = 51,
  KEY_4 = 52,
  KEY_5 = 53,
  KEY_6 = 54,
  KEY_7 = 55,
  KEY_8 = 56,
  KEY_9 = 57,
  KEY_A = 65,
  KEY_D = 68,
  KEY_M = 77,
  KEY_Q = 81,
  KEY_R = 82,
  KEY_S = 83,
  KEY_W = 87,
  KEY_X = 88,
  KEY_Z = 90;
let Key;
const keys = Array(256)
    .fill(void 0)
    .map(() => ({ down: !1, downCount: 0, upCount: 1 })),
  anyKey = { down: !1, downCount: 0, upCount: 1 },
  updateKeys = () => {
    anyKey.down = !1;
    keys.forEach((a) => {
      a.down
        ? ((anyKey.down = !0), (a.upCount = 0), a.downCount++)
        : (a.upCount++, (a.downCount = 0));
    });
    anyKey.down
      ? ((anyKey.upCount = 0), anyKey.downCount++)
      : (anyKey.upCount++, (anyKey.downCount = 0));
  },
  resetKeys = () => {
    anyKey.down = !1;
    keys.forEach((a) => (a.down = !1));
    updateKeys();
  },
  isKeyDown = (a) => KEYBOARD_ENABLED && keys[a].down,
  isKeyPressed = (a) => KEYBOARD_ENABLED && 1 === keys[a].upCount;
document.addEventListener("keydown", (a) => {
  killEvent(a);
  keys[a.keyCode].down = !0;
});
document.addEventListener("keyup", (a) => {
  killEvent(a);
  keys[a.keyCode].down = !1;
});
window.addEventListener("blur", resetKeys);
const ZERO = 0,
  ONE = 1,
  DEPTH_BUFFER_BIT = 256,
  COLOR_BUFFER_BIT = 16384,
  TRIANGLES = 4,
  LEQUAL = 515,
  SRC_ALPHA = 770,
  ONE_MINUS_SRC_ALPHA = 771,
  CULL_FACE = 2884,
  DEPTH_TEST = 2929,
  BLEND = 3042,
  TEXTURE_2D = 3553,
  UNSIGNED_BYTE = 5121,
  UNSIGNED_SHORT = 5123,
  FLOAT = 5126,
  DEPTH_COMPONENT = 6402,
  RGBA = 6408,
  NEAREST = 9728,
  LINEAR = 9729,
  TEXTURE_MAG_FILTER = 10240,
  TEXTURE_MIN_FILTER = 10241,
  TEXTURE_WRAP_S = 10242,
  TEXTURE_WRAP_T = 10243,
  CLAMP_TO_EDGE = 33071,
  DEPTH_COMPONENT16 = 33189,
  TEXTURE0 = 33984,
  TEXTURE1 = 33985,
  TEXTURE2 = 33986,
  ARRAY_BUFFER = 34962,
  ELEMENT_ARRAY_BUFFER = 34963,
  STATIC_DRAW = 35044,
  DYNAMIC_DRAW = 35048,
  FRAGMENT_SHADER = 35632,
  VERTEX_SHADER = 35633,
  COMPILE_STATUS = 35713,
  LINK_STATUS = 35714,
  DEPTH_COMPONENT32F = 36012,
  COLOR_ATTACHMENT0 = 36064,
  DEPTH_ATTACHMENT = 36096,
  FRAMEBUFFER = 36160,
  RENDERBUFFER = 36161,
  EPSILON = 1e-5;
const OVERLAY_WHITE = "#f0f0f0",
  OVERLAY_BLACK = "#000",
  OVERLAY_LIGHT_GRAY = "#aaa",
  OVERLAY_DARK_GRAY = "#444",
  OVERLAY_YELLOW = "#fffe37",
  OVERLAY_DARK_YELLOW = "#881",
  OVERLAY_GREEN = "#0c0",
  OVERLAY_DARK_GREEN = "#080",
  OVERLAY_ORANGE = "#fe9400",
  ALIGN_LEFT = "left",
  ALIGN_CENTER = "center",
  ALIGN_RIGHT = "right";
function drawText(a, b, c, d = OVERLAY_BLACK) {
  overlayCtx.fillStyle = d;
  overlayCtx.fillText(a, b, c);
}
function drawShadowText(a, b, c, d = OVERLAY_WHITE) {
  drawText(a, b + 2, c + 2);
  drawText(a, b, c, d);
}
function setFontSize(a, b = "") {
  overlayCtx.font = `bold ${b} ${a}px Comic Sans MS`;
}
function setTextAlign(a) {
  overlayCtx.textAlign = a;
}
function drawKeyIcon(a, b, c, d = 36) {
  drawRectangle(b - d / 2, c - 8, d, 36, "rgba(0,0,0,0.5)", OVERLAY_WHITE);
  drawShadowText(a, b, c);
}
function drawRectangle(a, b, c, d, e, f) {
  overlayCtx.fillStyle = e;
  overlayCtx.fillRect(a, b, c, d);
  overlayCtx.strokeStyle = f;
  overlayCtx.lineWidth = 3;
  overlayCtx.strokeRect(a, b, c, d);
}
let FBO;
const createFbo = (a) => {
    const b = gl.createTexture();
    gl.binured(TEXTURE_2D, b);
    gl.texImage2D(TEXTURE_2D, 0, RGBA, a, a, 0, RGBA, UNSIGNED_BYTE, null);
    gl.texerir(TEXTURE_2D, TEXTURE_MIN_FILTER, LINEAR);
    gl.texerir(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texerir(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
    const c = gl.createTexture();
    gl.binured(gl.TEXTURE_2D, c);
    gl.texImage2D(
      TEXTURE_2D,
      0,
      DEPTH_COMPONENT32F,
      a,
      a,
      0,
      DEPTH_COMPONENT,
      FLOAT,
      null
    );
    gl.texerir(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
    gl.texerir(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
    gl.texerir(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texerir(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
    const d = gl.createFramebuffer();
    gl.bindFramebuffer(FRAMEBUFFER, d);
    gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, b, 0);
    gl.framebufferTexture2D(FRAMEBUFFER, DEPTH_ATTACHMENT, TEXTURE_2D, c, 0);
    return { size: a, colorTexture: b, depthTexture: c, frameBuffer: d };
  },
  bindFbo = (a) => {
    gl.bindFramebuffer(FRAMEBUFFER, a.frameBuffer);
    gl.viewport(0, 0, a.size, a.size);
  },
  bindScreen = () => {
    gl.bindFramebuffer(FRAMEBUFFER, null);
    gl.viewport(0, 0, WIDTH, HEIGHT);
  };
let Camera;
const createCamera = () => ({
    source: vec3.create(),
    pitch: 0,
    yaw: 0,
    fov: 0,
    distance: 0,
  }),
  setCamera = (a, b, c, d, e, f, g) => {
    vec3.set(a.source, b, c, d);
    a.pitch = e;
    a.yaw = f;
    a.fov = g;
  },
  lookAt = (a, b, c, d) => {
    vec3.copy(a.source, b);
    vec3.subtract(tempVec, c, b);
    a.distance = vec3.magnitude(tempVec);
    a.yaw = Math.atan2(tempVec[0], tempVec[2]);
    a.pitch = Math.atan2(tempVec[1], Math.hypot(tempVec[0], tempVec[2]));
    a.fov = d;
  };
const ATTRIBUTE_COLOR = "a",
  ATTRIBUTE_POSITION = "b",
  ATTRIBUTE_TEXCOORD = "c",
  ATTRIBUTE_WORLDMATRIX = "d",
  UNIFORM_BLOOMTEXTURE = "f",
  UNIFORM_COLORTEXTURE = "g",
  UNIFORM_DEPTHTEXTURE = "h",
  UNIFORM_ITERATION = "i",
  UNIFORM_LIGHTCOLORS = "j",
  UNIFORM_LIGHTPOSITIONS = "k",
  UNIFORM_PROJECTIONMATRIX = "l",
  UNIFORM_SHADOWMAPMATRIX = "m",
  UNIFORM_VIEWMATRIX = "n",
  GLSL_PREFIX = "#version 300 es\nprecision highp float;",
  BLOOM_FRAG =
    GLSL_PREFIX +
    "uniform sampler2D g;uniform int i;in vec2 s;out vec4 e;float w=0.99;float x[11]=float[11](0.01,0.02,0.04,0.08,0.16,0.38,0.16,0.08,0.04,0.02,0.01);void main(){if(i==0){vec4 t=texture(g,s);if(t.r>w||t.g>w||t.b>w){e=t;}else{discard;}}else if(i==1||i==3){vec4 u=vec4(0);float v=0.0;for(int xi=-5;xi<=5;xi++){vec4 t=texture(g,s+vec2(float(xi)/512.0,0.0));u.rgb+=x[xi+5]*t.rgb*t.a;v+=x[xi+5]*t.a;}if(v==0.0){e=vec4(0,0,0,1);}else{u.rgb/=v;u.a=v;e=u;}}else{vec4 u=vec4(0);float v=0.0;for(int yi=-5;yi<=5;yi++){vec4 t=texture(g,s+vec2(0.0,float(yi)/512.0));u.rgb+=x[yi+5]*t.rgb*t.a;v+=x[yi+5]*t.a;}if(v==0.0){e=vec4(0,0,0,1);}else{u.rgb/=v;u.a=v;e=u;}}}",
  BLOOM_VERT =
    GLSL_PREFIX +
    "in vec2 b;in vec2 c;out vec2 s;void main(){gl_Position=vec4(b,0,1);s=c;}",
  MAIN_FRAG =
    GLSL_PREFIX +
    "uniform sampler2D g;uniform sampler2D h;uniform vec3 k[16];uniform vec3 j[16];in vec4 o;in float p;in vec4 q;in vec4 r;out vec4 e;void main(){if(o.r>0.99||o.g>0.99||o.b>0.99){e=o;return;}if(o.r<0.1&&o.g<0.1&&o.b<0.1){vec3 v=normalize(normalize((-q).xyz)-.5);float w,cody_a=w=0.;for(int cody_i=0;cody_i<15;cody_i+=1){v=abs(v)/dot(v,v)-.49;cody_a+=abs(length(v)-w);w=length(v);}cody_a*=cody_a*cody_a;e.rgb=.5*clamp((pow(vec3(cody_a/2e5,cody_a/2e5,cody_a/1e5),vec3(.9))),0.,2.)+vec3(0.03,0.0,0.12);e.a=1.0;return;}vec3 S=normalize(cross(dFdx(q.xyz),dFdy(q.xyz)));vec3 E=vec3(-.25,-.75,.2);vec3 N=E-2.0*dot(E,S)*S;vec3 t=normalize(vec3(0,0,1));float P=20.0;vec3 K=r.xyz/r.w;float H=0.0;float u=0.0;for(float M=-3.0;M<=3.0;M+=1.0){for(float L=-3.0;L<=3.0;L+=1.0){if(((texture(h,K.xy+vec2(L,M)/2048.0)).r)<=(K.z*0.99999965)){u+=1.0;}H+=1.0;}}float O=(K.x>=0.0&&K.x<=1.0&&K.y>=0.0&&K.y<=1.0)?1.0-0.5*u/H:1.0;vec3 R=mix(vec3(0.0,0.1,0.4),o.rgb,(clamp((0.5+0.5*(max(dot(S,E),0.0))*O)+O*(0.0),0.0,1.0)));for(int light=0;light<16;light++){vec3 G=q.xyz-k[light];float C=length(G);R.rgb+=0.2*max(0.0,dot(normalize(G),S))*(clamp((2.0)/(C*C),0.0,1.0))*j[light];}e.rgb=R.rgb;e.a=1.0;}",
  MAIN_VERT =
    GLSL_PREFIX +
    "in vec4 b;in vec4 a;in mat4 d;uniform mat4 l;uniform mat4 n;uniform mat4 m;out vec4 q;out vec4 o;out float p;out vec4 r;void main(){q=d*b;o=a;p=-(n*q).z;r=m*q;gl_Position=l*n*q;}",
  POST_FRAG =
    GLSL_PREFIX +
    "uniform sampler2D g;uniform sampler2D f;in vec2 s;out vec4 e;void main(){vec4 t=texture(f,s);e=vec4((texture(g,s)).rgb+2.0*t.a*t.rgb,1);}",
  POST_VERT =
    GLSL_PREFIX +
    "in vec2 b;in vec2 c;out vec2 s;void main(){gl_Position=vec4(b,0,1);s=c;}",
  SHADOW_FRAG = GLSL_PREFIX + "out vec4 e;void main(){e=vec4(1,1,1,1);}",
  SHADOW_VERT =
    GLSL_PREFIX +
    "in vec4 b;in mat4 d;uniform mat4 l;uniform mat4 n;void main(){gl_Position=l*n*d*b;}";
function initShaderProgram(a, b, c) {
  a = loadShader(VERTEX_SHADER, a);
  const d = loadShader(FRAGMENT_SHADER, b);
  b = gl.createProgram();
  gl.attachShader(b, a);
  gl.attachShader(b, d);
  c &&
    (gl.bindAttribLocation(b, positionAttrib, ATTRIBUTE_POSITION),
    gl.bindAttribLocation(b, colorAttrib, ATTRIBUTE_COLOR),
    gl.bindAttribLocation(b, worldMatrixAttrib, ATTRIBUTE_WORLDMATRIX));
  gl.linkProgram(b);
  DEBUG &&
    ((c = gl.getProgramParameter(b, LINK_STATUS)),
    log("Program compiled: " + c),
    (c = gl.getProgramInfoLog(b)),
    log("Program compiler log: " + c));
  return b;
}
function loadShader(a, b) {
  a = gl.createShader(a);
  gl.shaderSource(a, b);
  gl.compileShader(a);
  DEBUG &&
    ((b = gl.getShaderParameter(a, COMPILE_STATUS)),
    log("Shader compiled: " + b),
    (b = gl.getShaderInfoLog(a)),
    log("Shader compiler log: " + b));
  return a;
}
function getUniform(a, b) {
  return gl.getUniformLocation(a, b);
}
function resetGl() {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(DEPTH_TEST);
  gl.depthFunc(LEQUAL);
  gl.enable(BLEND);
  gl.blendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
}
function setupCamera(a, b, c) {
  mat4.perspective(projectionMatrix, a.fov, b / c, 0.1, 1e3);
  mat4.rotateX(pitchMatrix, mat4.identity(pitchMatrix), a.pitch);
  mat4.rotateY(yawMatrix, mat4.identity(yawMatrix), -a.yaw);
  mat4.multiply(modelViewMatrix, pitchMatrix, yawMatrix);
  vec3.subtract(cameraTranslate, origin, a.source);
  mat4.translate(modelViewMatrix, modelViewMatrix, cameraTranslate);
}
const WIDTH = 1920,
  HEIGHT = 1080,
  CENTER_X = WIDTH / 2,
  CENTER_Y = HEIGHT / 2,
  MAIN_FBO_SIZE = 2048,
  BLOOM_FBO_SIZE = 512,
  canvases = document.querySelectorAll("canvas"),
  canvas = canvases[0],
  overlayCanvas = canvases[1],
  overlayCtx = overlayCanvas.getContext("2d"),
  origin = vec3.create(),
  forward = vec3.fromValues(0, 0, 1),
  tempVec = vec3.create(),
  camera = createCamera(),
  lightSource = createCamera(),
  cameraTranslate = vec3.create(),
  projectionMatrix = mat4.create(),
  modelViewMatrix = mat4.create(),
  pitchMatrix = mat4.create(),
  yawMatrix = mat4.create(),
  identity = mat4.create(),
  shadowMapMatrix = mat4.create(),
  positionAttrib = 0,
  colorAttrib = 1,
  worldMatrixAttrib = 2,
  gl = canvas.getContext("webgl2", { alpha: !1 });
buildShortcuts(gl);
const shadowProgram = initShaderProgram(SHADOW_VERT, SHADOW_FRAG, !0),
  viewMatrixUniform1 = getUniform(shadowProgram, UNIFORM_VIEWMATRIX),
  projectionMatrixUniform1 = getUniform(
    shadowProgram,
    UNIFORM_PROJECTIONMATRIX
  ),
  mainProgram = initShaderProgram(MAIN_VERT, MAIN_FRAG, !0),
  viewMatrixUniform2 = getUniform(mainProgram, UNIFORM_VIEWMATRIX),
  projectionMatrixUniform2 = getUniform(mainProgram, UNIFORM_PROJECTIONMATRIX),
  colorTextureSamplerUniform = getUniform(mainProgram, UNIFORM_COLORTEXTURE),
  shadowMapMatrixUniform = getUniform(mainProgram, UNIFORM_SHADOWMAPMATRIX),
  depthTextureSamplerUniform = getUniform(mainProgram, UNIFORM_DEPTHTEXTURE),
  lightColorsUniform = getUniform(mainProgram, UNIFORM_LIGHTCOLORS),
  lightPositionsUniform = getUniform(mainProgram, UNIFORM_LIGHTPOSITIONS),
  lightColors = new Float32Array(48),
  lightPositions = new Float32Array(48);
let nextLight = 0;
const buffers = [],
  shadowFbo = createFbo(MAIN_FBO_SIZE),
  mainFbo = createFbo(MAIN_FBO_SIZE),
  pingPongFbo1 = createFbo(BLOOM_FBO_SIZE),
  pingPongFbo2 = createFbo(BLOOM_FBO_SIZE),
  bloomProgram = initShaderProgram(BLOOM_VERT, BLOOM_FRAG),
  bloomPositionAttrib = gl.getAttribLocation(bloomProgram, ATTRIBUTE_POSITION),
  bloomTexCoordAttrib = gl.getAttribLocation(bloomProgram, ATTRIBUTE_TEXCOORD),
  bloomColorTextureUniform = getUniform(bloomProgram, UNIFORM_COLORTEXTURE),
  bloomIterationUniform = getUniform(bloomProgram, UNIFORM_ITERATION),
  depthOfFieldProgram = initShaderProgram(POST_VERT, POST_FRAG),
  depthOfFieldPositionAttrib = gl.getAttribLocation(
    depthOfFieldProgram,
    ATTRIBUTE_POSITION
  ),
  depthOfFieldTexCoordAttrib = gl.getAttribLocation(
    depthOfFieldProgram,
    ATTRIBUTE_TEXCOORD
  ),
  depthOfFieldColorTextureUniform = getUniform(
    depthOfFieldProgram,
    UNIFORM_COLORTEXTURE
  ),
  depthOfFieldDepthTextureUniform = getUniform(
    depthOfFieldProgram,
    UNIFORM_DEPTHTEXTURE
  ),
  depthOfFieldBloomTextureUniform = getUniform(
    depthOfFieldProgram,
    UNIFORM_BLOOMTEXTURE
  ),
  depthOfFieldVao = gl.createVertexArray();
gl.binrayt(depthOfFieldVao);
const depthOfFieldPositionBuffer = gl.createBuffer();
gl.binfern(ARRAY_BUFFER, depthOfFieldPositionBuffer);
gl.bufataf(
  ARRAY_BUFFER,
  new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
  STATIC_DRAW
);
gl.enarayr(depthOfFieldPositionAttrib);
gl.verterb(depthOfFieldPositionAttrib, 2, FLOAT, !1, 0, 0);
const depthOfFieldTextureBuffer = gl.createBuffer();
gl.binfern(ARRAY_BUFFER, depthOfFieldTextureBuffer);
gl.bufataf(
  ARRAY_BUFFER,
  new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1]),
  STATIC_DRAW
);
gl.enarayr(depthOfFieldTexCoordAttrib);
gl.verterb(depthOfFieldTexCoordAttrib, 2, FLOAT, !1, 0, 0);
let time = 0,
  gameTime = 0,
  dt = 0,
  drawCount = 0,
  triangleCount = 0,
  lastRenderTime = 0,
  fps = 0,
  averageFps = 0;
const pixelString = (a) => Math.floor(a) + "px";
window.addEventListener("resize", handleResizeEvent, !1);
handleResizeEvent();
function handleResizeEvent() {
  var a = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  const b = a * WIDTH;
  a *= HEIGHT;
  const c = (window.innerWidth - b) / 2,
    d = (window.innerHeight - a) / 2;
  canvas &&
    ((canvas.width = WIDTH),
    (canvas.height = HEIGHT),
    (canvas.style.left = pixelString(c)),
    (canvas.style.top = pixelString(d)),
    (canvas.style.width = pixelString(b)),
    (canvas.style.height = pixelString(a)));
  overlayCanvas &&
    ((overlayCanvas.width = WIDTH),
    (overlayCanvas.height = HEIGHT),
    (overlayCanvas.style.left = pixelString(c)),
    (overlayCanvas.style.top = pixelString(d)),
    (overlayCanvas.style.width = pixelString(b)),
    (overlayCanvas.style.height = pixelString(a)));
}
function render(a) {
  if (DEBUG)
    if (((triangleCount = drawCount = 0), 0 === lastRenderTime))
      lastRenderTime = a;
    else {
      var b = a - lastRenderTime;
      lastRenderTime = a;
      fps = 1e3 / b;
      averageFps = 0.9 * averageFps + 0.1 * fps;
    }
  a *= 0.001;
  dt = Math.min(a - time, 1 / 30);
  time = a;
  gameState !== GameState.PLAYING || menu || (gameTime += dt);
  updateKeys();
  overlayCtx.clearRect(0, 0, WIDTH, HEIGHT);
  overlayCtx.textBaseline = "top";
  buffers.forEach((c) => c.usage === DYNAMIC_DRAW && c.resetBuffers());
  update();
  buffers.forEach((c) => c.usage === DYNAMIC_DRAW && c.updateBuffers());
  bindFbo(shadowFbo);
  resetGl();
  setupCamera(lightSource, shadowFbo.size, shadowFbo.size);
  gl.useProgram(shadowProgram);
  gl.uni4fva(projectionMatrixUniform1, !1, projectionMatrix);
  gl.uni4fva(viewMatrixUniform1, !1, modelViewMatrix);
  renderScene();
  mat4.identity(shadowMapMatrix);
  mat4.translate(
    shadowMapMatrix,
    shadowMapMatrix,
    vec3.fromValues(0.5, 0.5, 0.5)
  );
  mat4.scale(shadowMapMatrix, shadowMapMatrix, vec3.fromValues(0.5, 0.5, 0.5));
  mat4.multiply(shadowMapMatrix, shadowMapMatrix, projectionMatrix);
  mat4.multiply(shadowMapMatrix, shadowMapMatrix, modelViewMatrix);
  bindFbo(mainFbo);
  resetGl();
  setupCamera(camera, WIDTH, HEIGHT);
  gl.useProgram(mainProgram);
  gl.uni4fva(projectionMatrixUniform2, !1, projectionMatrix);
  gl.uni4fva(viewMatrixUniform2, !1, modelViewMatrix);
  gl.uni4fva(shadowMapMatrixUniform, !1, shadowMapMatrix);
  gl.uniform3fv(lightColorsUniform, lightColors);
  gl.uniform3fv(lightPositionsUniform, lightPositions);
  gl.acturee(TEXTURE0);
  gl.binured(TEXTURE_2D, shadowFbo.depthTexture);
  gl.uniform1i(depthTextureSamplerUniform, 0);
  renderScene();
  a = mainFbo;
  b = pingPongFbo1;
  gl.useProgram(bloomProgram);
  for (let c = 0; 5 > c; c++)
    bindFbo(b),
      resetGl(),
      gl.binrayt(depthOfFieldVao),
      gl.acturee(TEXTURE0),
      gl.binured(TEXTURE_2D, a.colorTexture),
      gl.uniform1i(bloomColorTextureUniform, 0),
      gl.uniform1i(bloomIterationUniform, c),
      gl.drawArrays(TRIANGLES, 0, 6),
      0 === c % 2
        ? ((a = pingPongFbo1), (b = pingPongFbo2))
        : ((a = pingPongFbo2), (b = pingPongFbo1));
  bindScreen();
  gl.useProgram(depthOfFieldProgram);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  gl.binrayt(depthOfFieldVao);
  gl.acturee(TEXTURE0);
  gl.binured(TEXTURE_2D, mainFbo.colorTexture);
  gl.uniform1i(depthOfFieldColorTextureUniform, 0);
  gl.acturee(TEXTURE1);
  gl.binured(TEXTURE_2D, mainFbo.depthTexture);
  gl.uniform1i(depthOfFieldDepthTextureUniform, 1);
  gl.acturee(TEXTURE2);
  gl.binured(TEXTURE_2D, pingPongFbo1.colorTexture);
  gl.uniform1i(depthOfFieldBloomTextureUniform, 2);
  gl.drawArrays(TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
function renderScene() {
  buffers.forEach((a) => a.render());
}
function resetLights() {
  lightColors.fill(0);
  lightPositions.fill(0);
  nextLight = 0;
}
function addLight(a, b) {
  lightColors[3 * nextLight] = b[0];
  lightColors[3 * nextLight + 1] = b[1];
  lightColors[3 * nextLight + 2] = b[2];
  lightPositions[3 * nextLight] = a[0];
  lightPositions[3 * nextLight + 1] = a[1];
  lightPositions[3 * nextLight + 2] = a[2];
  nextLight++;
}
class GameEntity {
  constructor(a, b, c) {
    this.pos = vec3.fromValues(a || 0, b || 0, c || 0);
    this.velocity = vec3.create();
    this.transformMatrix = mat4.create();
    this.health = 100;
    this.yaw = 0;
    this.accelerating = !1;
    this.groundedTime = 0;
    this.groundedPlatform = null;
    this.bounciness = this.shootTime = 0;
    this.waypoints = [];
    this.waypointIndex = 0;
    this.rendered = !0;
  }
  isGrounded() {
    return this.groundedTime === gameTime;
  }
  canShoot() {
    return 0.5 < gameTime - this.shootTime;
  }
  jump() {
    this.velocity[1] = JUMP_POWER;
    this.groundedTime = 0;
    this.groundedPlatform = null;
    this === player && playJumpSound();
  }
  update() {}
  render() {}
  getDistanceToPlayer() {
    return 0 >= player.health ? 1e3 : vec3.distance(player.pos, this.pos);
  }
  updateWaypoints() {
    if (0 === this.waypoints.length) return null;
    const a = this.waypoints[this.waypointIndex];
    0.1 > vec3.distance(this.pos, a) &&
      (this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length);
    return a;
  }
  setupTransformMatrix() {
    var a = Math.hypot(this.velocity[0], this.velocity[2]);
    const b = this.bounciness * Math.sin(20 * time) * a;
    a *= 0.02;
    vec3.copy(tempVec, this.pos);
    this.isGrounded() && (tempVec[1] += b);
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, tempVec);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);
    mat4.rotateX(this.transformMatrix, this.transformMatrix, a);
  }
  createSphere(a) {
    a = buffers[DYNAMIC_SPHERES].addInstance(a);
    mat4.multiply(a, a, this.transformMatrix);
    return a;
  }
}
class Alien extends GameEntity {
  constructor(a, b, c) {
    super(a, b, c);
    this.acceleration = 60;
    this.aggroRange = 15;
    this.color = COLOR_ALIEN_GREEN;
    this.bounciness = 0.01;
  }
  update() {
    const a = this.updateWaypoints(),
      b = this.getDistanceToPlayer();
    1.5 > b
      ? player.pos[1] > this.pos[1]
        ? ((this.health = 0),
          (player.pos[1] = this.pos[1] + 2),
          player.jump(),
          createExplosion(this.pos, this.color, 15))
        : ((player.health = 0),
          (player.rendered = !1),
          playerDie(),
          createExplosion(player.pos, this.color))
      : b < this.aggroRange
      ? (vec3.subtract(tempVec, player.pos, this.pos),
        (tempVec[1] = 0),
        vec3.normalize(tempVec, tempVec),
        vec3.scaleAndAdd(
          this.velocity,
          this.velocity,
          tempVec,
          dt * this.acceleration
        ))
      : a &&
        (vec3.subtract(tempVec, a, this.pos),
        vec3.normalize(tempVec, tempVec),
        vec3.scaleAndAdd(
          this.velocity,
          this.velocity,
          tempVec,
          dt * this.acceleration
        ));
    updateEntity(this);
  }
  render() {
    var a = this.createSphere(this.color);
    mat4.translate(a, a, vec3.fromValues(0, 0.8, 0));
    mat4.scale(a, a, vec3.fromValues(0.8, 0.8, 0.7));
    a = this.createSphere(COLOR_BLACK);
    mat4.translate(a, a, vec3.fromValues(-0.25, 0.9, 0.7));
    mat4.rotateZ(a, a, -1);
    mat4.scale(a, a, vec3.fromValues(0.2, 0.1, 0.025));
    a = this.createSphere(COLOR_BLACK);
    mat4.translate(a, a, vec3.fromValues(0.25, 0.9, 0.7));
    mat4.rotateZ(a, a, 1);
    mat4.scale(a, a, vec3.fromValues(0.2, 0.1, 0.025));
  }
}
class Coin extends GameEntity {
  update() {
    const a = this.getDistanceToPlayer();
    1 > a
      ? ((this.health = 0),
        coins++,
        coinSequence++,
        (lastCoinTime = gameTime),
        playCoinSound())
      : 3 > a &&
        ((this.pos[0] = 0.9 * this.pos[0] + 0.1 * player.pos[0]),
        (this.pos[1] = 0.9 * this.pos[1] + 0.1 * player.pos[1]),
        (this.pos[2] = 0.9 * this.pos[2] + 0.1 * player.pos[2]));
  }
  render() {
    const a = (time % 1) * 2 * Math.PI,
      b = 1.5 + 0.2 * Math.sin(a),
      c = this.createSphere(COLOR_YELLOW);
    mat4.translate(c, c, vec3.fromValues(0, b, 0));
    mat4.rotateY(c, c, a);
    mat4.scale(c, c, vec3.fromValues(0.5, 0.5, 0.1));
  }
}
class Flagpole extends GameEntity {
  constructor(a, b, c) {
    super(a, b, c);
    this.triggered = !1;
  }
  update() {
    const a = this.getDistanceToPlayer();
    coins === availableCoins &&
      2 > a &&
      !this.triggered &&
      (playMusic(flagpoleSongData),
      (bestTimes[level] = bestTimes[level]
        ? Math.min(bestTimes[level], gameTime)
        : gameTime),
      (localStorage["callisto-times"] = JSON.stringify(bestTimes)),
      addTrophy(`Level ${level}`, `${gameTime.toFixed(1)} sec`),
      stopJetpackSound(),
      setMenu(winScreen),
      (gameState = GameState.AFTER_LEVEL),
      (this.triggered = !0));
  }
  render() {
    const a = (time % 1) * 2 * Math.PI,
      b = 4.7 + 0.1 * Math.sin(a);
    var c = this.createSphere(COLOR_SILVER);
    mat4.translate(c, c, vec3.fromValues(0, 2.5, 0));
    mat4.scale(c, c, vec3.fromValues(0.2, 2.5, 0.2));
    c = this.createSphere(COLOR_SILVER);
    mat4.scale(c, c, vec3.fromValues(0.5, 0.5, 0.5));
    c = this.createSphere(COLOR_RED);
    mat4.translate(c, c, vec3.fromValues(0, b, 0));
    mat4.rotateY(c, c, a);
    mat4.scale(c, c, vec3.fromValues(0.5, 0.5, 0.5));
  }
}
class Fuel extends GameEntity {
  constructor(a, b, c, d) {
    super(a, b, c);
    this.amount = d || 30;
  }
  update() {
    const a = this.getDistanceToPlayer();
    1 > a
      ? ((player.fuel += this.amount),
        (this.amount = this.health = 0),
        playFuelSound())
      : 4 > a &&
        ((this.pos[0] = 0.9 * this.pos[0] + 0.1 * player.pos[0]),
        (this.pos[1] = 0.9 * this.pos[1] + 0.1 * player.pos[1]),
        (this.pos[2] = 0.9 * this.pos[2] + 0.1 * player.pos[2]));
  }
  render() {
    const a = (time % 1) * 2 * Math.PI,
      b = 1.5 + 0.2 * Math.sin(a);
    var c = this.createSphere(COLOR_DARK_SILVER);
    mat4.translate(c, c, vec3.fromValues(-0.24, b, 0));
    mat4.rotateY(c, c, a);
    mat4.scale(c, c, vec3.fromValues(0.3, 0.64, 0.3));
    c = this.createSphere(COLOR_DARK_SILVER);
    mat4.translate(c, c, vec3.fromValues(0.24, b, 0));
    mat4.rotateY(c, c, a);
    mat4.scale(c, c, vec3.fromValues(0.3, 0.64, 0.3));
  }
}
class Hero extends GameEntity {
  constructor(a, b, c) {
    super(a, b, c);
    this.bounciness = 0.01;
    this.fuel = 100;
    this.jetpack = !1;
  }
  render() {
    var a = 0;
    let b = 1.2;
    var c = 0;
    let d = -1.2;
    var e = 0;
    let f = 0;
    this.isGrounded() && gameState !== GameState.AFTER_LEVEL
      ? this.accelerating &&
        ((f = a =
          0.07 *
          Math.hypot(this.velocity[0], this.velocity[2]) *
          Math.sin(((gameTime % 0.8) / 0.8) * 2 * Math.PI)),
        (c = e = -a),
        (b = 1.2),
        (d = -1.2))
      : ((b = -0.5), (d = 0.5));
    var g = this.createSphere(COLOR_ORANGE);
    mat4.translate(g, g, vec3.fromValues(0, 1.8, 0));
    mat4.scale(g, g, vec3.fromValues(0.38, 0.38, 0.38));
    g = this.createSphere(COLOR_WHITE);
    mat4.translate(g, g, vec3.fromValues(0, 1.8, -0.08));
    mat4.scale(g, g, vec3.fromValues(0.45, 0.5, 0.38));
    g = this.createSphere(COLOR_WHITE);
    mat4.translate(g, g, vec3.fromValues(0, 1.05, 0));
    mat4.scale(g, g, vec3.fromValues(0.3, 0.47, 0.27));
    g = this.createSphere(COLOR_DARK_SILVER);
    mat4.translate(g, g, vec3.fromValues(-0.12, 1.2, -0.35));
    mat4.scale(g, g, vec3.fromValues(0.15, 0.32, 0.15));
    g = this.createSphere(COLOR_DARK_SILVER);
    mat4.translate(g, g, vec3.fromValues(0.12, 1.2, -0.35));
    mat4.scale(g, g, vec3.fromValues(0.15, 0.32, 0.15));
    this.jetpack &&
      ((g = this.createSphere(4278231295)),
      mat4.translate(g, g, vec3.fromValues(0, 0.9, -0.35)),
      mat4.scale(g, g, vec3.fromValues(0.2, 0.2, 0.2)),
      addLight(
        vec3.fromValues(this.pos[0], this.pos[1] + 1, this.pos[2]),
        vec3.fromValues(1, 0.75, 0)
      ));
    g = this.createSphere(COLOR_WHITE);
    mat4.translate(g, g, vec3.fromValues(-0.3, 1.4, 0));
    mat4.rotateX(g, g, a);
    mat4.rotateZ(g, g, b);
    mat4.translate(g, g, vec3.fromValues(-0.4, 0, 0));
    mat4.scale(g, g, vec3.fromValues(0.4, 0.16, 0.16));
    a = this.createSphere(COLOR_WHITE);
    mat4.translate(a, a, vec3.fromValues(0.3, 1.4, 0));
    mat4.rotateX(a, a, c);
    mat4.rotateZ(a, a, d);
    mat4.translate(a, a, vec3.fromValues(0.4, 0, 0));
    mat4.scale(a, a, vec3.fromValues(0.4, 0.16, 0.16));
    c = this.createSphere(COLOR_WHITE);
    mat4.translate(c, c, vec3.fromValues(0, 1.1, 0));
    mat4.rotateX(c, c, e);
    mat4.translate(c, c, vec3.fromValues(-0.21, -0.6, 0));
    mat4.scale(c, c, vec3.fromValues(0.18, 0.6, 0.18));
    e = this.createSphere(COLOR_WHITE);
    mat4.translate(e, e, vec3.fromValues(0, 1.1, 0));
    mat4.rotateX(e, e, f);
    mat4.translate(e, e, vec3.fromValues(0.21, -0.6, 0));
    mat4.scale(e, e, vec3.fromValues(0.18, 0.6, 0.18));
  }
}
class Kang extends GameEntity {
  constructor() {
    super(16, 5, 16);
    this.nextShootTime = 0;
  }
  update() {
    this.yaw = Math.atan2(
      player.pos[0] - this.pos[0],
      player.pos[2] - this.pos[2]
    );
    this.pos[1] = player.pos[1] + 6 + Math.sin(2 * time);
    this.velocity[1] = 0;
    if (
      gameState === GameState.PLAYING &&
      gameTime > this.nextShootTime &&
      0 < player.health
    ) {
      const a = new Particle();
      a.projectile = ProjectileType.Enemy;
      a.color = 4282401023;
      a.deathRate = 10;
      a.lightColor = vec3.fromValues(1, 0, 0);
      a.size = 0.5;
      vec3.copy(a.pos, this.pos);
      a.pos[1] += 3;
      const b = vec3.fromValues(
        player.pos[0],
        player.pos[1] + 1,
        player.pos[2]
      );
      vec3.subtract(a.velocity, b, a.pos);
      vec3.normalize(a.velocity, a.velocity);
      vec3.scale(a.velocity, a.velocity, 40);
      entities.push(a);
      this.nextShootTime = gameTime + 5;
      playKangShootSound();
    }
  }
  render() {
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, this.pos);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);
    var a = this.createSphere(COLOR_ALIEN_GREEN);
    mat4.scale(a, a, vec3.fromValues(3, 7, 3));
    a = this.createSphere(COLOR_KANG_EYE_YELLOW);
    mat4.translate(a, a, vec3.fromValues(0, 3, 1.2));
    mat4.scale(a, a, vec3.fromValues(2, 2, 2));
    a = this.createSphere(
      4281545523 +
        204 * Math.min((5 - (this.nextShootTime - gameTime)) / 4.5, 1)
    );
    mat4.translate(a, a, vec3.fromValues(0, 3, 3));
    mat4.scale(a, a, vec3.fromValues(0.5, 1.2, 0.3));
    for (a = 0; 10 > a; a++) {
      const b = this.createSphere(COLOR_ALIEN_GREEN);
      mat4.rotateY(b, b, (a / 10) * Math.PI * 2);
      mat4.rotateX(b, b, 0.5 + 0.4 * Math.sin(4 * time + a));
      mat4.translate(b, b, vec3.fromValues(0, -2, 4));
      mat4.scale(b, b, vec3.fromValues(0.5, 0.5, 4));
    }
  }
}
const mysteryColors = [
  4294914096, 4281401088, 4281348351, 4294967088, 4294914303, 4281401343,
];
class Mystery extends GameEntity {
  constructor(a, b, c, d, e, f) {
    super(a, b, c);
    this.deathRate = 20;
    this.color = mysteryColors[(6 * Math.random()) | 0];
    this.scale = vec3.fromValues(d, e, f);
  }
  update() {
    vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt);
    this.health -= dt * this.deathRate;
  }
  render() {
    const a = buffers[DYNAMIC_CUBES].addInstance(this.color);
    mat4.multiply(a, a, this.transformMatrix);
    mat4.scale(a, a, this.scale);
  }
}
const ProjectileType = { None: 0, Player: 1, Enemy: 2 };
class Particle extends GameEntity {
  constructor(a, b, c) {
    super(a, b, c);
    this.size = 0.2;
    this.deathRate = 100;
    this.color = COLOR_WHITE;
    this.acceleration = vec3.create();
    this.lightColor = null;
    this.projectile = ProjectileType.None;
  }
  update() {
    vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt);
    this.health -= dt * this.deathRate;
  }
  render() {
    const a = (this.health / 100) * this.size,
      b = this.createSphere(this.color);
    mat4.scale(b, b, vec3.fromValues(a, a, a));
    this.lightColor && addLight(this.pos, this.lightColor);
  }
}
class Platform extends GameEntity {
  constructor(a, b, c) {
    super(a, b, c);
    this.color = COLOR_SILVER;
    this.scale = vec3.fromValues(1, 1, 1);
    this.waypoints = [];
    this.waypointIndex = 0;
  }
  update() {
    const a = this.updateWaypoints();
    a &&
      (vec3.subtract(this.velocity, a, this.pos),
      vec3.normalize(this.velocity, this.velocity),
      vec3.scale(this.velocity, this.velocity, 6),
      vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt));
  }
  render() {
    if (0 < this.waypoints.length) {
      var a = buffers[DYNAMIC_CUBES].addInstance(COLOR_YELLOW);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.scale(a, a, this.scale);
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.rotateY(a, a, Math.PI / 4);
      mat4.scale(a, a, vec3.fromValues(2.5, 0.31, 0.32));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.rotateY(a, a, Math.PI / 4);
      mat4.translate(a, a, vec3.fromValues(0, 0, -1.2));
      mat4.scale(a, a, vec3.fromValues(1.35, 0.31, 0.32));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.rotateY(a, a, Math.PI / 4);
      mat4.translate(a, a, vec3.fromValues(0, 0, 1.2));
      mat4.scale(a, a, vec3.fromValues(1.35, 0.31, 0.32));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.translate(a, a, vec3.fromValues(0, 0, -1.82));
      mat4.scale(a, a, vec3.fromValues(2.04, 0.32, 0.2));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.translate(a, a, vec3.fromValues(0, 0, 1.82));
      mat4.scale(a, a, vec3.fromValues(2.04, 0.32, 0.2));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.translate(a, a, vec3.fromValues(-1.82, 0, 0));
      mat4.scale(a, a, vec3.fromValues(0.2, 0.32, 2.04));
      a = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
      mat4.multiply(a, a, this.transformMatrix);
      mat4.translate(a, a, vec3.fromValues(1.82, 0, 0));
      mat4.scale(a, a, vec3.fromValues(0.2, 0.32, 2.04));
    } else
      (a = buffers[DYNAMIC_CUBES].addInstance(this.color)),
        mat4.multiply(a, a, this.transformMatrix),
        mat4.scale(a, a, this.scale);
  }
}
class Shooter extends GameEntity {
  constructor(a, b, c, d, e) {
    super(a, b, c);
    this.yaw = d;
    this.nextShootTime = e;
  }
  update() {
    this.pos[1] += 0.5 * dt * Math.sin(2 * time);
    this.velocity[1] = 0;
    if (
      gameState === GameState.PLAYING &&
      gameTime > this.nextShootTime &&
      0 < player.health
    ) {
      const a = new Particle();
      a.projectile = ProjectileType.Enemy;
      a.color = 4282401023;
      a.deathRate = 10;
      a.lightColor = vec3.fromValues(1, 0, 0);
      a.size = 0.5;
      vec3.copy(a.pos, this.pos);
      a.pos[1] += 0.75;
      vec3.rotateY(a.velocity, forward, origin, this.yaw);
      vec3.scale(a.velocity, a.velocity, 20);
      entities.push(a);
      this.nextShootTime = gameTime + 5;
      playKangShootSound();
    }
  }
  render() {
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, this.pos);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);
    var a = this.createSphere(COLOR_ALIEN_GREEN);
    mat4.translate(a, a, vec3.fromValues(0, 0.8, 0));
    mat4.scale(a, a, vec3.fromValues(0.5, 0.5, 0.5));
    a = this.createSphere(COLOR_SILVER);
    mat4.translate(a, a, vec3.fromValues(0, 0.4, 0));
    mat4.scale(a, a, vec3.fromValues(0.5, 0.5, 0.5));
    a = this.createSphere(4278231295);
    mat4.translate(a, a, vec3.fromValues(0, -0.2, 0));
    mat4.scale(a, a, vec3.fromValues(0.3, 0.3, 0.3));
    a = this.createSphere(COLOR_BLACK);
    mat4.translate(a, a, vec3.fromValues(-0.25, 1, 0.4));
    mat4.rotateZ(a, a, -1);
    mat4.scale(a, a, vec3.fromValues(0.15, 0.1, 0.1));
    a = this.createSphere(COLOR_BLACK);
    mat4.translate(a, a, vec3.fromValues(0.25, 1, 0.4));
    mat4.rotateZ(a, a, 1);
    mat4.scale(a, a, vec3.fromValues(0.15, 0.1, 0.1));
  }
}
class Spaceship extends GameEntity {
  render() {
    var a = COLOR_WHITE,
      b = COLOR_ORANGE,
      c = COLOR_DARK_SILVER;
    const d = this.createSphere(a);
    mat4.scale(d, d, vec3.fromValues(5, 1, 1.3));
    b = this.createSphere(b);
    mat4.translate(b, b, vec3.fromValues(1.5, 0.5, 0));
    mat4.scale(b, b, vec3.fromValues(2, 0.6, 0.8));
    b = this.createSphere(a);
    mat4.translate(b, b, vec3.fromValues(0, 0, 2));
    mat4.rotateY(b, b, 0.5);
    mat4.scale(b, b, vec3.fromValues(3, 0.3, 1));
    a = this.createSphere(a);
    mat4.translate(a, a, vec3.fromValues(0, 0, -2));
    mat4.rotateY(a, a, -0.5);
    mat4.scale(a, a, vec3.fromValues(3, 0.3, 1));
    a = this.createSphere(c);
    mat4.translate(a, a, vec3.fromValues(-3, 0.3, 0.7));
    mat4.scale(a, a, vec3.fromValues(3, 0.5, 0.5));
    c = this.createSphere(c);
    mat4.translate(c, c, vec3.fromValues(-3, 0.3, -0.7));
    mat4.scale(c, c, vec3.fromValues(3, 0.5, 0.5));
  }
}
const zzfxV = 0.3,
  zzfxG = (
    a = 1,
    b,
    c = 220,
    d = 0,
    e = 0,
    f = 0.1,
    g = 0,
    h = 1,
    k = 0,
    m = 0,
    p = 0,
    q = 0,
    v = 0,
    y = 0,
    x = 0,
    w = 0,
    l = 0,
    A = 1,
    u = 0,
    t = 0
  ) => {
    b = 2 * Math.PI;
    let r = (k *= (500 * b) / zzfxR / zzfxR),
      n = (c *= b / zzfxR),
      D = [],
      C = 0,
      F = 0,
      z = 0,
      E = 1,
      G = 0,
      H = 0,
      B = 0,
      J,
      I;
    d = d * zzfxR + 9;
    u *= zzfxR;
    e *= zzfxR;
    f *= zzfxR;
    l *= zzfxR;
    m *= (500 * b) / zzfxR ** 3;
    x *= b / zzfxR;
    p *= b / zzfxR;
    q *= zzfxR;
    v = (v * zzfxR) | 0;
    for (I = (d + u + e + f + l) | 0; z < I; D[z++] = B)
      ++H % ((100 * w) | 0) ||
        ((B = g
          ? 1 < g
            ? 2 < g
              ? 3 < g
                ? Math.sin((C % b) ** 3)
                : Math.max(Math.min(Math.tan(C), 1), -1)
              : 1 - (((((2 * C) / b) % 2) + 2) % 2)
            : 1 - 4 * Math.abs(Math.round(C / b) - C / b)
          : Math.sin(C)),
        (B =
          (v ? 1 - t + t * Math.sin((b * z) / v) : 1) *
          (0 < B ? 1 : -1) *
          Math.abs(B) ** h *
          a *
          zzfxV *
          (z < d
            ? z / d
            : z < d + u
            ? 1 - ((z - d) / u) * (1 - A)
            : z < d + u + e
            ? A
            : z < I - l
            ? ((I - z - l) / f) * A
            : 0)),
        (B = l
          ? B / 2 +
            (l > z ? 0 : ((z < I - l ? 1 : (I - z) / l) * D[(z - l) | 0]) / 2)
          : B)),
        (J = (c += k += m) * Math.cos(x * F++)),
        (C += J - J * y * (1 - ((1e9 * (Math.sin(z) + 1)) % 2))),
        E && ++E > q && ((c += p), (n += p), (E = 0)),
        !v || ++G % v || ((c = n), (k = r), (E = E || 1));
    return D;
  },
  zzfxP = (...a) => {
    const b = zzfxX.createBufferSource(),
      c = zzfxX.createBuffer(a.length, a[0].length, zzfxR);
    a.map((d, e) => c.getChannelData(e).set(d));
    b.buffer = c;
    b.connect(zzfxX.destination);
    b.connect(reverbConvolver);
    b.start();
    return b;
  },
  zzfx = (...a) => zzfxP(zzfxG(...a)),
  zzfxX = new AudioContext(),
  zzfxR = 44100;
function createReverbConvolver(a) {
  var b = zzfxX.sampleRate;
  a *= b;
  b = zzfxX.createBuffer(2, a, b);
  const c = b.getChannelData(0),
    d = b.getChannelData(1);
  for (let e = 0; e < a; e++)
    (c[e] = 0.5 * (2 * Math.random() - 1) * Math.pow(1 - e / a, 1.5)),
      (d[e] = 0.5 * (2 * Math.random() - 1) * Math.pow(1 - e / a, 1.5));
  a = zzfxX.createConvolver();
  a.buffer = b;
  a.connect(zzfxX.destination);
  return a;
}
const reverbConvolver = createReverbConvolver(1);
const Channel = {},
  Pattern = {},
  Instrument = {},
  boolToInt = (a) => (a ? 1 : 0),
  zzfxM = (a, b, c, d = 125) => {
    let e,
      f,
      g,
      h,
      k,
      m,
      p,
      q,
      v,
      y,
      x,
      w,
      l,
      A = 0,
      u,
      t = [];
    const r = [],
      n = [];
    let D = 0,
      C = 0,
      F = 1;
    const z = {},
      E = ((zzfxR / d) * 60) >> 2;
    for (; F; D++)
      (t = [(F = q = w = 0)]),
        c.map((G, H) => {
          p = b[G][D] || [0, 0, 0];
          F |= boolToInt(!!b[G][D]);
          u = w + (b[G][0].length - 2 - boolToInt(!q)) * E;
          l = H == c.length - 1;
          f = 2;
          for (h = w; f < p.length + l; q = ++f) {
            k = p[f];
            v =
              (f == p.length + l - 1 && l) ||
              boolToInt(y != (p[0] || 0)) | k | 0;
            for (g = 0; g < E && q; )
              (m = ((1 - x) * t[A++]) / 2 || 0),
                (r[h] = (r[h] || 0) - m * C + m),
                (n[h] = (n[h++] || 0) + m * C + m),
                g++ > E - 99 && v && (x += boolToInt(1 > x) / 99);
            k &&
              ((x = k % 1), (C = p[1] || 0), (k |= 0)) &&
              (t = z[[(y = p[(A = 0)] || 0), k]] =
                z[[y, k]] ||
                ((e = [...a[y]]),
                (e[2] *= 2 ** ((k - 12) / 12)),
                0 < k ? zzfxG(...e) : []));
          }
          w = u;
        });
    return [r, n];
  };
const playJumpSound = () =>
    zzfx(...[0.6, 0, 130, 0.01, 0.02, , , 0.4, 5, , , , , , , , , 0.9]),
  playCoinSound = () =>
    zzfx(
      ...[
        0.7,
        0,
        1e3 * (1 + 1 / 12) ** coinSequence,
        ,
        0.05,
        ,
        1,
        1.5,
        ,
        ,
        300,
        0.1,
        ,
        ,
        ,
        ,
        ,
        0.5,
        0.05,
      ]
    ),
  playFuelSound = () =>
    zzfx(
      ...[
        0.5,
        0,
        328,
        0.04,
        0.1,
        0.35,
        ,
        0.97,
        ,
        0.5,
        9,
        0.01,
        0.06,
        ,
        12,
        0.1,
        ,
        0.74,
        0.08,
      ]
    ),
  playShootSound = () =>
    zzfx(
      ...[
        0.3,
        0,
        40,
        0.02,
        0.02,
        0.04,
        4,
        0.87,
        ,
        0.9,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        0.83,
        0.02,
        0.28,
      ]
    ),
  playKangShootSound = () =>
    zzfx(
      ...[
        0.2,
        0,
        20,
        0.02,
        0.1,
        ,
        4,
        0.87,
        ,
        0.9,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        0.83,
        0.02,
        0.28,
      ]
    ),
  playExplosionSound = () =>
    zzfx(
      ...[0.5, 0, 101, , , 0.5, 4, 2.8, , , , , , , 0.8, 0.4, , 0.95, , 0.42]
    ),
  playMenuBeep = () =>
    zzfx(
      ...[0.5, 0, 80, 0.02, 0.04, 0.02, 1, 0.3, 56, , , , , 0.1, 7.5, , , 0.39]
    ),
  jetpackAudioBuffer = zzfxG(
    ...[0.05, 0, 900, 0.2, 3, 0, 4, 0, , , , , , 4, , 0.1]
  );
let jetpackSound;
const startJetpackSound = () => {
    jetpackSound ||
      ((jetpackSound = zzfxP(jetpackAudioBuffer)), (jetpackSound.loop = !0));
  },
  stopJetpackSound = () => {
    jetpackSound && (jetpackSound.stop(), (jetpackSound = null));
  };
const milkyWaySong = [
    [
      [, 0, 240, 0.01, 0.09, 0.2, 1, 2, , , , , , , , , , 0.5],
      [0.1, 0, 120, , 0.07, 0.07, 1, 0, , , 0.5, 0.01],
      [0.8, 0, 240, 0.01, 0.4, 0.2, 1, 2, , , , , , , , , , 0.5],
    ],
    [
      [
        [
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          1,
          ,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
        ],
        [
          1,
          ,
          24,
          17,
          20,
          15,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
          24,
          17,
          20,
          12,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
        ],
      ],
      [
        [
          2,
          ,
          20,
          ,
          ,
          17,
          ,
          ,
          20,
          ,
          19,
          ,
          17,
          ,
          15,
          ,
          12,
          ,
          17,
          ,
          ,
          ,
          12,
          ,
          ,
          ,
          15,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          24,
          ,
          ,
          17,
          ,
          ,
          24,
          ,
          22,
          ,
          20,
          ,
          19,
          ,
          15,
          ,
          17,
          ,
          ,
          ,
          20,
          ,
          ,
          ,
          19,
          ,
          ,
          ,
          22,
          ,
          ,
          ,
        ],
        [
          1,
          ,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
        ],
        [
          1,
          ,
          24,
          17,
          20,
          15,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
          24,
          17,
          20,
          12,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
        ],
      ],
      [
        [
          2,
          ,
          17,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          15,
          ,
          ,
          ,
          10,
          ,
          ,
          ,
          17,
          ,
          ,
          ,
          ,
          ,
          20,
          ,
          19,
          ,
          ,
          ,
          22,
          ,
          ,
          ,
          24,
          ,
          ,
          ,
          17,
          ,
          ,
          ,
          24,
          ,
          22,
          ,
          20,
          ,
          19,
          ,
          17,
          ,
          ,
          ,
          ,
          ,
          19,
          17,
          19,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          1,
          ,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
        ],
        [
          1,
          ,
          24,
          17,
          20,
          15,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
          24,
          17,
          20,
          12,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
        ],
      ],
      [
        [
          2,
          ,
          24,
          ,
          20,
          ,
          17,
          ,
          ,
          24,
          22,
          ,
          19,
          ,
          15,
          ,
          ,
          22,
          24,
          ,
          22,
          ,
          ,
          ,
          ,
          ,
          22,
          ,
          ,
          15,
          ,
          19,
          15,
          22,
          24,
          ,
          20,
          ,
          17,
          ,
          ,
          24,
          22,
          ,
          19,
          ,
          15,
          ,
          ,
          22,
          24,
          ,
          20,
          ,
          ,
          ,
          ,
          ,
          22,
          ,
          ,
          15,
          ,
          19,
          15,
          22,
        ],
        [
          1,
          ,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
          24,
          24,
          20,
          20,
          17,
          17,
          17,
          24,
          22,
          22,
          19,
          19,
          15,
          15,
          15,
          22,
          24,
          24,
          20,
          20,
          8,
          13,
          8,
          8,
          22,
          22,
          22,
          15,
          15,
          19,
          15,
          22,
        ],
        [
          1,
          ,
          24,
          17,
          20,
          15,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
          24,
          17,
          20,
          12,
          17,
          8,
          5,
          24,
          22,
          15,
          19,
          10,
          15,
          7,
          3,
          22,
          24,
          19,
          20,
          13,
          8,
          8,
          8,
          5,
          22,
          10,
          3,
          15,
          3,
          19,
          15,
          22,
        ],
      ],
    ],
    [0, 1, 2, 3],
    70,
  ],
  deathSongData = [
    [
      [0.9, 0, 240, 0.01, 0.09, 0.2, 1, 2, , , , , , , , , , 0.5],
      [0.2, 0, 120, , 0.07, 0.07, 1, 0, , , 0.5, 0.01],
    ],
    [
      [
        [
          ,
          ,
          27,
          ,
          26,
          ,
          25,
          ,
          24,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          ,
          ,
          15,
          ,
          14,
          ,
          13,
          ,
          12,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          1,
          ,
          15,
          15,
          14,
          14,
          13,
          13,
          12,
          12,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
      ],
    ],
    [0],
  ],
  flagpoleSongData = [
    [
      [0.9, 0, 240, 0.01, 0.09, 0.2, 1, 2, , , , , , , , , , 0.5],
      [0.2, 0, 120, , 0.07, 0.07, 1, 0, , , 0.5, 0.01],
      [0.9, 0, 240, 0.01, 0.4, 0.2, 1, 2, , , , , , , , , , 0.5],
    ],
    [
      [
        [
          ,
          ,
          1,
          1,
          1,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          ,
          ,
          5,
          5,
          5,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          ,
          ,
          8,
          8,
          8,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          2,
          ,
          ,
          ,
          ,
          ,
          8,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          2,
          ,
          ,
          ,
          ,
          ,
          12,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
        [
          2,
          ,
          ,
          ,
          ,
          ,
          15,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
        ],
      ],
    ],
    [0],
  ];
let backgroundMusicNode = null;
const playMusic = (a, b) => {
    a = zzfxM(...a);
    a = zzfxP(...a);
    b && (stopBackgroundMusic(), (a.loop = !0), (backgroundMusicNode = a));
  },
  stopBackgroundMusic = () => {
    backgroundMusicNode &&
      (backgroundMusicNode.stop(), (backgroundMusicNode = null));
  },
  toggleBackgroundMusic = () => {
    backgroundMusicNode
      ? (stopBackgroundMusic(), (localStorage["music-off"] = "t"))
      : (playMusic(milkyWaySong, !0), localStorage.removeItem("music-off"));
  };
const ACCELERATION = 100,
  FRICTION = 8,
  GRAVITY = 40,
  FLOATY_GRAVITY = 20,
  JUMP_GRACE_TIME = 0.25,
  JUMP_POWER = 12,
  MAX_X = 32,
  MAX_Y = 64,
  MAX_Z = 32,
  TILE_SIZE = 1,
  STATIC_CUBES = 0,
  STATIC_SPHERES = 1,
  DYNAMIC_CUBES = 2,
  DYNAMIC_SPHERES = 3;
const COLOR_STARS = 4278190080,
  COLOR_DARK_GREEN = 4282685713,
  COLOR_MEDIUM_GREEN = 4283808597,
  COLOR_LIGHT_GREEN = 4285575280,
  COLOR_BLACK = 4281545523,
  COLOR_WHITE = 4293980400,
  COLOR_ORANGE = 4279352304,
  COLOR_RED = 4279313117,
  COLOR_YELLOW = 4282710264,
  COLOR_SILVER = 4291607466,
  COLOR_DARK_SILVER = 4289374368,
  COLOR_DARK_BLUE = 4289366118,
  COLOR_LIGHT_BLUE = 4289374839,
  COLOR_ALIEN_GREEN = 4279422123,
  COLOR_KANG_EYE_YELLOW = 4289130736;
function drawHud() {
  gameState === GameState.CREDITS
    ? (setTextAlign(ALIGN_CENTER),
      setFontSize(24, "italic"),
      drawShadowText("THE ADVENTURES OF", CENTER_X, 60),
      setFontSize(64, "italic"),
      drawShadowText("CAPTAIN CALLISTO", CENTER_X, 120),
      setFontSize(72, "italic"),
      setTextAlign(ALIGN_CENTER),
      drawShadowText("THANK YOU FOR PLAYING", CENTER_X, CENTER_Y))
    : (setFontSize(48),
      setTextAlign(ALIGN_LEFT),
      drawShadowText(
        "\u2b50 " + coins + " / " + availableCoins,
        20,
        20,
        OVERLAY_YELLOW
      ),
      drawShadowText("\ud83d\ude80 " + player.fuel.toFixed(0) + "%", 20, 100),
      setTextAlign(ALIGN_RIGHT),
      drawShadowText(gameTime.toFixed(1), WIDTH - 20, 20, OVERLAY_LIGHT_GRAY),
      setFontSize(24),
      setTextAlign(ALIGN_CENTER),
      drawKeyIcon("W", WIDTH - 445, HEIGHT - 370),
      drawKeyIcon("A", WIDTH - 490, HEIGHT - 325),
      drawKeyIcon("S", WIDTH - 445, HEIGHT - 325),
      drawKeyIcon("D", WIDTH - 400, HEIGHT - 325),
      drawKeyIcon("\u2b06", WIDTH - 295, HEIGHT - 370),
      drawKeyIcon("\u2b05", WIDTH - 340, HEIGHT - 325),
      drawKeyIcon("\u2b07", WIDTH - 295, HEIGHT - 325),
      drawKeyIcon("\u27a1", WIDTH - 250, HEIGHT - 325),
      drawKeyIcon("SPACE", WIDTH - 327, HEIGHT - 270, 100),
      drawKeyIcon("Z", WIDTH - 250, HEIGHT - 270),
      drawKeyIcon("SHIFT", WIDTH - 327, HEIGHT - 215, 100),
      drawKeyIcon("X", WIDTH - 250, HEIGHT - 215),
      drawKeyIcon("R", WIDTH - 250, HEIGHT - 160),
      drawKeyIcon("M", WIDTH - 250, HEIGHT - 105),
      drawKeyIcon("ESC", WIDTH - 262, HEIGHT - 50, 60),
      setTextAlign(ALIGN_LEFT),
      drawShadowText("Move", WIDTH - 210, HEIGHT - 315, OVERLAY_LIGHT_GRAY),
      drawShadowText("Jump", WIDTH - 210, HEIGHT - 270, OVERLAY_LIGHT_GRAY),
      drawShadowText("Jetpack", WIDTH - 210, HEIGHT - 215, OVERLAY_LIGHT_GRAY),
      drawShadowText(
        "Restart level",
        WIDTH - 210,
        HEIGHT - 160,
        OVERLAY_LIGHT_GRAY
      ),
      drawShadowText(
        "Toggle music",
        WIDTH - 210,
        HEIGHT - 105,
        OVERLAY_LIGHT_GRAY
      ),
      drawShadowText(
        "Main menu",
        WIDTH - 210,
        HEIGHT - 50,
        OVERLAY_LIGHT_GRAY
      ));
}
function drawDebugOverlay() {
  DEBUG &&
    (setTextAlign(ALIGN_LEFT),
    setFontSize(20),
    drawShadowText("Player: " + vec3.str(player.pos), 10, 300),
    drawShadowText("Focus dist: " + cameraDistance.toFixed(2), 10, 340),
    drawShadowText("Camera: " + vec3.str(camera.source), 10, 360),
    drawShadowText("Menu: " + !!menu, 10, 380),
    drawShadowText("State: " + gameState, 10, 400),
    drawShadowText("Level: " + level, 10, 420),
    setTextAlign(ALIGN_CENTER),
    setFontSize(24),
    drawShadowText(
      "FPS: " + averageFps.toFixed(0),
      CENTER_X,
      HEIGHT - 50,
      OVERLAY_LIGHT_GRAY
    ));
}
const introText = [
  ,
  [["OUR HERO, CAPTAIN CALLISTO, BLASTS THROUGH SPACE", "SEEKING ADVENTURE"]],
  [["APPROACHING THE ZETA AIR FORTRESS", "BEWARE: SENSORS SHOW SIGNS OF LIFE"]],
  [
    ,
    ["COLLECT ALL TREASURE AND", "REACH THE TRANSPORTER TO PROCEED"],
    ["THE PATH IS TREACHEROUS", "PROCEED WITH CAUTION"],
    ["THERE'S MORE THAN ONE WAY TO SKIN A WOMP RAT", ""],
    ["MORE ALIEN ACTIVITY THAN EXPECTED", "PROCEED WITH CAUTION"],
    ["WE ARE DEEP INTO ALIEN TERRITORY", "HIGH ALERT"],
    ["EVIDENCE OF COMPLEX CIVILIZATION", "DO NOT UNDERESTIMATE THE ENEMY"],
    ["ALIEN DEFENSES ARRIVED", "WATCH OUT FOR MISSILES"],
    ["CLIMB THE GREAT PYRAMID", "TREASURE AWAITS"],
    ["THE GREAT SPIRES OF KODOS", "WE MUST BE NEAR!"],
    ["THE INNER SANCTUM!  THE GREAT KANG!", "YOU ARE DOOMED!"],
  ],
  [["OH NO!", "TRY AGAIN!"]],
];
let Menu;
const levelIntro = () => ({
    callback: () => {
      gameState = GameState.PLAYING;
      gameTime = 0;
      setMenu(null);
    },
  }),
  deathScreen = {
    callback: () => {
      gameState = GameState.BEFORE_LEVEL;
      showLevelIntro();
    },
  },
  winScreen = {
    callback: () => {
      gameState = GameState.BEFORE_LEVEL;
      setLevel(level + 1);
      showLevelIntro();
    },
  },
  clickToStart = {
    callback: () => {
      0 === gameState &&
        (zzfxX.resume(),
        localStorage["music-off"] || playMusic(milkyWaySong, !0));
      ++gameState > GameState.INTRO_STORY2 && (setLevel(1), showLevelIntro());
    },
  },
  mainMenu = {
    callback: () => {
      log("main menu callback");
    },
  },
  levelsMenu = {
    callback: () => {
      log("levels menu callback");
    },
  };
let menuStartTime = 0,
  menu = clickToStart,
  prevMenu = null,
  menuY = 0;
function setMenu(a) {
  prevMenu = menu;
  menuStartTime = time;
  menu = a;
  menuY = 0;
}
function showLevelIntro() {
  initGame();
  setMenu(levelIntro());
}
const drawMenu = () => {
  if (
    gameState === GameState.CREDITS &&
    menu !== mainMenu &&
    menu !== levelsMenu
  )
    menu = null;
  else {
    if (
      gameState <= GameState.INTRO_STORY2 ||
      menu === mainMenu ||
      menu == levelsMenu
    )
      setTextAlign(ALIGN_CENTER),
        setFontSize(24, "italic"),
        drawShadowText("THE ADVENTURES OF", CENTER_X, 60),
        setFontSize(64, "italic"),
        drawShadowText("CAPTAIN CALLISTO", CENTER_X, 120);
    if (menu === mainMenu) {
      setTextAlign(ALIGN_LEFT);
      setFontSize(48, "italic");
      drawShadowText(
        "NEW GAME",
        250,
        400,
        0 === menuY ? OVERLAY_YELLOW : OVERLAY_WHITE
      );
      drawShadowText(
        "CONTINUE",
        250,
        500,
        1 === menuY ? OVERLAY_YELLOW : OVERLAY_WHITE
      );
      drawShadowText(
        "LEVELS",
        250,
        600,
        2 === menuY ? OVERLAY_YELLOW : OVERLAY_WHITE
      );
      if (isKeyPressed(KEY_UP) || isKeyPressed(KEY_W))
        (menuY = (menuY + 2) % 3), playMenuBeep();
      if (isKeyPressed(KEY_DOWN) || isKeyPressed(KEY_S))
        (menuY = (menuY + 1) % 3), playMenuBeep();
      isKeyPressed(KEY_ESCAPE) &&
        (resetKeys(), setMenu(prevMenu), playMenuBeep());
      if (
        isKeyPressed(KEY_ENTER) ||
        isKeyPressed(KEY_SPACE) ||
        isKeyPressed(KEY_Z)
      )
        0 === menuY &&
          ((gameState = GameState.INTRO_STORY1),
          setLevel(0),
          initGame(),
          setMenu(clickToStart),
          playMenuBeep()),
          1 === menuY && (setMenu(null), playMenuBeep()),
          2 === menuY && (setMenu(levelsMenu), playMenuBeep());
    } else if (menu === levelsMenu) {
      setFontSize(32, "italic");
      for (var a = 0; 10 > a; a++) {
        setTextAlign(ALIGN_LEFT);
        drawShadowText(
          `LEVEL ${a + 1}`,
          250,
          350 + 60 * a,
          menuY === a ? OVERLAY_YELLOW : OVERLAY_WHITE
        );
        const b = bestTimes[a + 1];
        b &&
          (setTextAlign(ALIGN_RIGHT),
          drawShadowText(
            `${b.toFixed(1)} sec`,
            600,
            350 + 60 * a,
            OVERLAY_LIGHT_GRAY
          ));
      }
      if (isKeyPressed(KEY_UP) || isKeyPressed(KEY_W))
        (menuY = (menuY + 9) % 10), playMenuBeep();
      if (isKeyPressed(KEY_DOWN) || isKeyPressed(KEY_S))
        (menuY = (menuY + 1) % 10), playMenuBeep();
      isKeyPressed(KEY_ESCAPE) && (setMenu(prevMenu), playMenuBeep());
      if (
        isKeyPressed(KEY_ENTER) ||
        isKeyPressed(KEY_SPACE) ||
        isKeyPressed(KEY_Z)
      )
        (gameState = GameState.BEFORE_LEVEL),
          setLevel(menuY + 1),
          showLevelIntro(),
          playMenuBeep();
    } else
      0.5 < time - menuStartTime && 1 === anyKey.upCount
        ? menu.callback()
        : gameState === GameState.WAITING_FOR_FIRST_CLICK
        ? (setTextAlign(ALIGN_CENTER),
          setFontSize(32, "italic"),
          drawShadowText("PRESS ANY KEY TO CONTINUE", CENTER_X, HEIGHT - 90))
        : gameState === GameState.AFTER_LEVEL
        ? (setTextAlign(ALIGN_CENTER),
          setFontSize(64, "italic"),
          drawShadowText(`LEVEL ${level} CLEARED`, CENTER_X, 120),
          setFontSize(48, "italic"),
          drawShadowText(gameTime.toFixed(1) + " sec", CENTER_X, 220),
          setFontSize(32, "italic"),
          drawShadowText("PRESS ANY KEY TO CONTINUE", CENTER_X, HEIGHT - 90))
        : (drawRectangle(20, HEIGHT - 180, 900, 160, "#cb6", OVERLAY_BLACK),
          (a = gameState === GameState.BEFORE_LEVEL ? level : 0),
          DEBUG &&
            (introText[gameState]
              ? introText[gameState][a] || log("no intro text for level: " + a)
              : log("no intro text for gameState: " + gameState)),
          setTextAlign(ALIGN_LEFT),
          setFontSize(28, "italic"),
          drawText(introText[gameState][a][0], 30, HEIGHT - 165),
          drawText(introText[gameState][a][1], 30, HEIGHT - 122),
          setFontSize(20, "italic"),
          drawText("PRESS ANY KEY TO CONTINUE", 30, HEIGHT - 53));
  }
};
const rng = new RNG(1),
  levelDefinitions = [
    () => {
      log("Openening scene");
      entities.push(new Spaceship());
    },
    () => {
      log("Level 1 - Intro level");
      createMetalPlatform(4, 0, 0, 32, 4, 4);
      createCoins(14, 5, 2, 4, 0, 3);
      createMetalPlatform(28, 0, 4, 32, 4, 8);
      createLift(30, 3, 10, 30, 8, 10);
      createMetalPlatform(0, 4, 12, 32, 8, 16);
      createCoins(14, 9, 14, 4, 0, 3);
      createMetalPlatform(0, 4, 16, 4, 8, 20);
      createLift(2, 12, 22, 2, 7, 22);
      createMetalPlatform(0, 8, 24, 16, 12, 28);
      createMetalPlatform(16, 8, 24, 32, 10, 28);
      const a = new Alien();
      a.aggroRange = 0;
      vec3.set(a.pos, 18, 10, 26);
      a.waypoints = [vec3.fromValues(17, 10, 26), vec3.fromValues(27, 10, 26)];
      entities.push(a);
      entities.push(new Flagpole(30, 10, 26));
      vec3.set(player.pos, 6, 4, 2);
    },
    () => {
      log("Level 2 - Maze level");
      createMetalPlatform(12, 3.5, 0, 20, 4.5, 8);
      createMetalPlatform(0, 4, 8, 32, 5, 12);
      createMetalPlatform(8, 4.5, 12, 12, 5.5, 16);
      createMetalPlatform(0, 5, 16, 32, 6, 20);
      createMetalPlatform(20, 5.5, 20, 24, 6.5, 24);
      createMetalPlatform(0, 6, 24, 32, 7, 28);
      createCoins(2, 6, 10, 28, 0, 2);
      createCoins(2, 7, 18, 28, 0, 2);
      createCoins(10, 8, 26, 4, 0, 4);
      var a = new Alien(4, 5, 10);
      a.aggroRange = 0;
      a.waypoints = [vec3.fromValues(4, 5, 10), vec3.fromValues(28, 5, 10)];
      entities.push(a);
      a = new Alien(4, 6, 18);
      a.aggroRange = 0;
      a.waypoints = [vec3.fromValues(4, 6, 18), vec3.fromValues(28, 6, 18)];
      entities.push(a);
      vec3.set(player.pos, 16, 4, 2);
      entities.push(new Flagpole(2, 7, 26));
    },
    () => {
      log("Level 3 - Lotsa lifts");
      createMetalPlatform(0, 0, 0, 4, 4, 36);
      createMetalPlatform(32, 0, 0, 36, 4, 36);
      entities.push(new Fuel(2, 5, 30, 50));
      for (let a = 6; 30 >= a; a += 4)
        createLift(a, 3, 16, a, 10, 16).pos[1] = (2 * a) % 11;
      createCoins(6, 12, 16, 4, 0, 7);
      vec3.set(player.pos, 2, 4, 16);
      entities.push(new Flagpole(34, 4, 16));
    },
    () => {
      log("Level 4 - Four Corners");
      const a = (b, c, d) => {
        createMetalPlatform(b, c, d, b + 12, c + 4, d + 12);
        (0 === b && 0 === d) || entities.push(new Coin(b + 2, c + 4, d + 2));
        entities.push(new Coin(b + 10, c + 4, d + 2));
        entities.push(new Coin(b + 10, c + 4, d + 10));
        entities.push(new Coin(b + 2, c + 4, d + 10));
        if (0 < c) {
          const e = new Alien(b + 2, c + 4, d + 2);
          e.aggroRange = 0;
          e.acceleration = 50;
          e.waypoints = [
            vec3.fromValues(b + 2, c + 4, d + 2),
            vec3.fromValues(b + 10, c + 4, d + 2),
            vec3.fromValues(b + 10, c + 4, d + 10),
            vec3.fromValues(b + 2, c + 4, d + 10),
          ];
          entities.push(e);
        }
      };
      a(0, 0, 0);
      entities.push(new Fuel(6, 5, 6, 20));
      vec3.set(player.pos, 1, 5, 1);
      a(20, 4, 0);
      entities.push(new Fuel(26, 9, 6, 20));
      a(20, 8, 20);
      entities.push(new Fuel(26, 13, 26, 20));
      a(0, 12, 20);
      entities.push(new Flagpole(6, 16, 26));
    },
    () => {
      log("Level 5 - The Pit");
      createMetalPlatform(0, 0, 0, 32, 4, 32);
      createMetalPlatform(0, 4, 0, 32, 8, 4);
      createMetalPlatform(0, 4, 28, 32, 12, 32);
      createMetalPlatform(0, 4, 4, 4, 10, 28);
      createMetalPlatform(28, 4, 4, 32, 8, 28);
      vec3.set(player.pos, 30, 8, 2);
      for (let a = 10; 26 >= a; a += 4) {
        const b = new Alien(a, 4, a);
        b.color = COLOR_ORANGE;
        b.aggroRange = 12;
        b.acceleration = 50;
        b.waypoints = [vec3.fromValues(22, 4, a), vec3.fromValues(10, 4, a)];
        entities.push(b);
      }
      createLift(6, 4, 26, 6, 15, 26);
      createCoins(6, 5, 10, 0, 4, 4);
      createCoins(26, 5, 10, 0, 4, 4);
      createCoins(10, 13, 30, 4, 0, 4);
      entities.push(new Flagpole(30, 12, 30));
    },
    () => {
      log("Level 6 - Moat and Castle");
      createMetalPlatform(0, 0, 0, 32, 1, 32);
      vec3.set(player.pos, 26, 2, 16);
      createMetalPlatform(0, 0, 28, 32, 6, 32);
      for (var a = 0; 10 > a; a++)
        createMetalPlatform(4, 1, 18 + a, 8, 1 + a / 2, 19 + a);
      createLift(2, 5, 26, 2, 5, 6);
      createCoins(2, 7, 10, 0, 4, 4);
      createMetalPlatform(0, 0, 0, 4, 6, 4);
      createLift(26, 5, 2, 6, 5, 2);
      createCoins(10, 7, 2, 4, 0, 4);
      createMetalPlatform(28, 0, 0, 32, 6, 4);
      createLift(30, 5, 26, 30, 5, 6);
      createCoins(30, 7, 10, 0, 4, 4);
      createMetalPlatform(8, 0, 16, 24, 6, 32);
      for (a = 0; 12 > a; a++)
        createMetalPlatform(23 - a, 1, 16, 24 - a, 6 + a / 2, 20);
      createMetalPlatform(8, 1, 16, 12, 12, 20);
      createMetalPlatform(8, 1, 20, 20, 12, 32);
      entities.push(new Flagpole(14, 12, 26));
      a = [
        vec3.fromValues(10, 12, 30),
        vec3.fromValues(18, 12, 30),
        vec3.fromValues(18, 12, 22),
        vec3.fromValues(10, 12, 22),
      ];
      for (let b = 0; 4 > b; b++) {
        const c = new Alien(a[b][0], a[b][1], a[b][2]);
        c.aggroRange = 0;
        c.waypoints = a;
        c.waypointIndex = b;
        entities.push(c);
      }
    },
    () => {
      log("Level 7 - Firing Squad");
      createMetalPlatform(0, 0, 0, 32, 4, 32);
      for (var a = 4; 28 >= a; a += 8)
        for (var b = 4; 28 >= b; b += 8) entities.push(new Coin(b, 5, a));
      vec3.set(player.pos, 16, 5, 2);
      a = 0;
      for (b = 4; 28 >= b; b += 8)
        entities.push(new Shooter(b, 5, 34, Math.PI, (a += 0.5)));
      for (b = 4; 28 >= b; b += 8) {
        let c = -2,
          d = Math.PI / 2;
        0 !== ((b - 4) / 8) % 2 && ((c = 34), (d = -d));
        entities.push(new Shooter(c, 5, b, d, (a += 0.5)));
      }
      entities.push(new Flagpole(16, 4, 16));
    },
    () => {
      log("Level 8 - Pyramid");
      createMetalPlatform(0, 0, 0, 32, 4, 32);
      createMetalPlatform(4, 4, 8, 28, 8, 32);
      createMetalPlatform(8, 8, 16, 24, 12, 32);
      createMetalPlatform(12, 12, 24, 20, 16, 32);
      createMetalPlatform(0, 4, 28, 4, 4.7, 32);
      createLift(2, 4.5, 30, 2, 8, 30);
      createMetalPlatform(24, 8, 28, 28, 8.7, 32);
      createLift(26, 8.5, 30, 26, 12, 30);
      createMetalPlatform(8, 12, 28, 12, 12.7, 32);
      createLift(10, 12.5, 30, 10, 16, 30);
      entities.push(new Shooter(-2, 9, 10, Math.PI / 2, 0.5));
      entities.push(new Shooter(-2, 9, 14, Math.PI / 2, 0.5));
      entities.push(new Shooter(-2, 13, 18, Math.PI / 2, 1));
      entities.push(new Shooter(-2, 13, 22, Math.PI / 2, 1));
      entities.push(new Shooter(34, 13, 18, -Math.PI / 2, 1.5));
      entities.push(new Shooter(34, 13, 22, -Math.PI / 2, 1.5));
      const a = new Alien(30, 4, 30);
      a.color = COLOR_ORANGE;
      a.aggroRange = 12;
      a.acceleration = 80;
      a.waypoints = [vec3.fromValues(30, 4, 30), vec3.fromValues(30, 4, 16)];
      entities.push(a);
      createCoins(30, 5, 2, 0, 4, 4);
      vec3.set(player.pos, 16, 4, 2);
      entities.push(new Flagpole(16, 16, 30));
    },
    () => {
      log("Level 9 - Spires of Kodo");
      vec3.set(player.pos, 16, 4, 2);
      createMetalPlatform(0, 0, 0, 32, 4, 32);
      createMetalPlatform(0, 4, 24, 8, 32, 32);
      createMetalPlatform(4, 4, 20, 8, 4.7, 24);
      createLift(6, 4.5, 22, 6, 15, 22);
      createLift(2, 24, 22, 2, 13.5, 22);
      createLift(6, 22.5, 22, 6, 33, 22);
      createCoins(2, 33, 26, 4, 0, 2);
      createCoins(2, 33, 30, 4, 0, 2);
      createMetalPlatform(24, 4, 24, 32, 32, 32);
      createLift(10, 31.5, 30, 22, 31.5, 30);
      createLift(22, 31.5, 26, 10, 31.5, 26);
      createCoins(26, 33, 26, 4, 0, 2);
      createCoins(26, 33, 30, 4, 0, 2);
      createMetalPlatform(24, 4, 0, 32, 32, 8);
      createLift(26, 31.5, 10, 26, 31.5, 22);
      createLift(30, 31.5, 22, 30, 31.5, 10);
      createCoins(26, 33, 2, 4, 0, 2);
      createCoins(26, 33, 6, 4, 0, 2);
      entities.push(new Flagpole(28, 32, 4));
    },
    () => {
      log("Level 10 - Kang");
      createMetalPlatform(0, 0, 0, 32, 4, 8);
      createMetalPlatform(0, 4, 4, 8, 8, 8);
      createLift(30, 3.5, 10, 30, 11.5, 10);
      for (let a = 10; 42 >= a; a += 16)
        createMetalPlatform(28, a, 12, 32, a + 2, 32),
          createCoins(30, a + 3, 18, 0, 4, 3),
          entities.push(new Fuel(30, a + 3, 30, 100)),
          createMetalPlatform(0, a + 8, 12, 4, a + 10, 32),
          createCoins(2, a + 11, 18, 0, 4, 3),
          entities.push(new Fuel(2, a + 11, 30, 100));
      entities.push(new Flagpole(2, 52, 14));
      entities.push(new Kang());
      vec3.set(player.pos, 2, 4, 2);
    },
    () => {
      log("Level 11 - credits");
      gameState = GameState.CREDITS;
    },
  ],
  createPlatform = (a, b, c, d, e, f, g) => {
    g = new Platform();
    vec3.set(g.pos, (a + d) / 2, (b + e) / 2, (c + f) / 2);
    vec3.set(g.scale, (d - a) / 2, (e - b) / 2, (f - c) / 2);
    entities.push(g);
  },
  createMetalPlatform = (a, b, c, d, e, f, g) => {
    createPlatform(a, b, c, d, e, f, COLOR_SILVER);
    for (b = a + 2; b < d; b += 4)
      for (var h = c + 2; h < f; h += 4) {
        var k = buffers[STATIC_CUBES].addInstance(COLOR_DARK_BLUE);
        mat4.translate(k, k, vec3.fromValues(b, e + 0.01, h));
        mat4.scale(k, k, vec3.fromValues(1.8, 0.02, 1.8));
      }
    d -= a;
    f -= c;
    if (g)
      for (g = 0; g < d * f * 0.01; g++)
        (b = a + 0.5 + rng.nextFloat() * (d - 1)),
          (h = c + 0.5 + rng.nextFloat() * (f - 1)),
          (k = new Alien()),
          vec3.set(k.pos, b, e, h),
          entities.push(k);
  },
  createLift = (a, b, c, d, e, f) => {
    const g = new Platform();
    vec3.set(g.pos, a, b, c);
    vec3.set(g.scale, 2, 0.3, 2);
    g.waypoints = [vec3.fromValues(a, b, c), vec3.fromValues(d, e, f)];
    entities.push(g);
    return g;
  },
  createCoins = (a, b, c, d, e, f) => {
    for (let g = 0; g < f; g++) {
      const h = new Coin();
      vec3.set(h.pos, a, b, c);
      entities.push(h);
      a += d;
      c += e;
    }
  },
  createStairs = (a, b, c, d, e, f) => {
    for (let g = 0; g < f; g++)
      createPlatform(a, b, c, a + 4, b + 1, c + 4, COLOR_SILVER),
        (a += d),
        b++,
        (c += e);
  };
function initGame() {
  buffers.forEach((b) => b.usage === STATIC_DRAW && b.resetBuffers());
  entities.length = 0;
  vec3.set(player.pos, 16, 4, 16);
  vec3.set(player.velocity, 0, 0, 0);
  player.rendered = !0;
  player.jetpack = !1;
  player.health = 1;
  player.fuel = 0;
  player.yaw = 3;
  player.groundedTime = 0;
  coinSequence = lastCoinTime = coins = player.shootTime = 0;
  entities.push(player);
  stopJetpackSound();
  const a = buffers[STATIC_CUBES].addInstance(COLOR_STARS);
  mat4.scale(a, a, vec3.fromValues(500, 500, 500));
  (0, levelDefinitions[level % levelDefinitions.length])();
  availableCoins = entities.filter((b) => b instanceof Coin).length;
  buffers.forEach((b) => b.usage === STATIC_DRAW && b.updateBuffers());
}
const cameraTarget = vec3.fromValues(0, 0, 0),
  preferredCameraPosition = vec3.fromValues(0, 0, 0),
  lightPosition = vec3.fromValues(200, 400, -32),
  cubeGeometry = buildRoundedCube(1, 2),
  sphereGeometry = buildRoundedCube(21, 1);
buffers.push(
  new BufferSet(STATIC_DRAW, cubeGeometry, 2e5),
  new BufferSet(STATIC_DRAW, sphereGeometry, 1e3),
  new BufferSet(DYNAMIC_DRAW, cubeGeometry, 4e3),
  new BufferSet(DYNAMIC_DRAW, sphereGeometry, 2e3)
);
const entities = [],
  player = new Hero(),
  cameraDistance = 52;
let coins = 0,
  availableCoins = 0,
  lastCoinTime = 0,
  coinSequence = 0;
function throwaway() {
  gameState = GameState.PLAYING;
  coins++;
  availableCoins++;
  lastCoinTime++;
  coinSequence++;
}
let level = 0,
  lastEngineBurst = 0;
const GameState = {
  WAITING_FOR_FIRST_CLICK: 0,
  INTRO_STORY1: 1,
  INTRO_STORY2: 2,
  BEFORE_LEVEL: 3,
  PLAYING: 4,
  AFTER_LEVEL: 5,
  MAIN_MENU: 99,
  CREDITS: 100,
};
let gameState = GameState.WAITING_FOR_FIRST_CLICK;
initGame();
registerSong("Milky Way by Ben Prunty", milkyWaySong);
function setLevel(a) {
  level = a;
}
const flyoverCamera = () => {
  const a = 0.2 * time,
    b = 0.05 * time,
    c = 50 + 20 * Math.sin(0.2 * time);
  vec3.set(
    camera.source,
    c * Math.sin(b) * Math.sin(a),
    c * Math.abs(Math.cos(b)),
    c * Math.sin(b) * Math.cos(a)
  );
};
function update() {
  updateWorld();
  menu !== mainMenu &&
    isKeyPressed(KEY_ESCAPE) &&
    (resetKeys(), setMenu(mainMenu), playMenuBeep());
  menu ? drawMenu() : (handleInput(), drawHud());
  DEBUG && drawDebugOverlay();
  if (gameState === GameState.CREDITS)
    (player.yaw = 0),
      (player.jetpack = !0),
      vec3.lerp(
        camera.source,
        camera.source,
        vec3.fromValues(0, 50, -15),
        0.01
      ),
      vec3.lerp(player.pos, player.pos, vec3.fromValues(0, 80, 0), 0.01),
      vec3.set(player.velocity, 0, 0, 0),
      lookAt(
        camera,
        camera.source,
        vec3.fromValues(player.pos[0], player.pos[1] + 15, player.pos[2]),
        0.4
      ),
      createJetpackParticles();
  else if (gameState === GameState.AFTER_LEVEL)
    (player.yaw += 5 * dt),
      (player.jetpack = !0),
      vec3.lerp(
        camera.source,
        camera.source,
        vec3.fromValues(0, 90, -25),
        0.01
      ),
      vec3.lerp(player.pos, player.pos, vec3.fromValues(0, 80, 0), 0.01),
      vec3.set(player.velocity, 0, 0, 0),
      (cameraTarget[0] = player.pos[0]),
      (cameraTarget[1] = player.pos[1] + 2),
      (cameraTarget[2] = player.pos[2]),
      lookAt(camera, camera.source, cameraTarget, 0.4),
      createJetpackParticles();
  else if (
    gameState === GameState.BEFORE_LEVEL ||
    gameState === GameState.PLAYING
  )
    (lightSource[0] = player.pos[0] + 8),
      (lightSource[1] = 80),
      (lightSource[2] = player.pos[2] - 16),
      (cameraTarget[0] = 8 + 0.5 * player.pos[0]),
      (cameraTarget[1] = 0.9 * cameraTarget[1] + 0.1 * player.pos[1]),
      (cameraTarget[2] = 4 + 0.75 * player.pos[2]),
      vec3.set(
        preferredCameraPosition,
        3.2 + 0.8 * cameraTarget[0],
        cameraTarget[1] + cameraDistance,
        2 + 0.75 * cameraTarget[2] - cameraDistance
      ),
      (camera.source[0] = preferredCameraPosition[0]),
      vec3.lerp(camera.source, camera.source, preferredCameraPosition, 0.02),
      lookAt(camera, camera.source, cameraTarget, 0.4);
  else if (
    gameState <= GameState.INTRO_STORY2 &&
    (flyoverCamera(),
    vec3.set(cameraTarget, 0, 0, 0),
    lookAt(camera, camera.source, cameraTarget, 0.4),
    (player.pos[1] = 400),
    (player.velocity[1] = 0),
    0.08 < time - lastEngineBurst)
  ) {
    lastEngineBurst = time;
    const a = new Particle(),
      b = new Particle();
    a.size = b.size = 0.25;
    a.color = b.color = 4294901808;
    vec3.set(a.pos, -6, 0.3, 0.7);
    vec3.set(a.velocity, -10, 0, 0);
    vec3.set(b.pos, -6, 0.3, -0.7);
    vec3.set(b.velocity, -10, 0, 0);
    entities.push(a, b);
  }
  lookAt(lightSource, lightPosition, vec3.fromValues(16, 0, 16), 0.1);
  renderEntities(entities);
}
function inRangeOfPlayer(a) {
  return (
    a.pos[0] > player.pos[0] - 20 &&
    a.pos[0] < player.pos[0] + 20 &&
    a.pos[2] > player.pos[2] - 15 &&
    a.pos[2] < player.pos[2] + 40
  );
}
function renderEntities(a) {
  resetLights();
  for (let b = a.length - 1; 0 <= b; b--) {
    const c = a[b];
    c !== player && 0 >= c.health
      ? a.splice(b, 1)
      : c.rendered && (c.setupTransformMatrix(), c.render());
  }
}
function playerDie() {
  playMusic(deathSongData);
  stopJetpackSound();
  setMenu(deathScreen);
}
function handleInput() {
  player.accelerating = !1;
  if (gameState !== GameState.AFTER_LEVEL && gameState !== GameState.CREDITS) {
    if (isKeyDown(KEY_UP) || isKeyDown(KEY_W))
      (player.velocity[2] += dt * ACCELERATION), (player.accelerating = !0);
    if (isKeyDown(KEY_DOWN) || isKeyDown(KEY_S))
      (player.velocity[2] -= dt * ACCELERATION), (player.accelerating = !0);
    if (isKeyDown(KEY_LEFT) || isKeyDown(KEY_A))
      (player.velocity[0] -= dt * ACCELERATION), (player.accelerating = !0);
    if (isKeyDown(KEY_RIGHT) || isKeyDown(KEY_D))
      (player.velocity[0] += dt * ACCELERATION), (player.accelerating = !0);
    (isKeyDown(KEY_X) || isKeyDown(KEY_SHIFT)) && 0 < player.fuel
      ? ((player.velocity[1] += 60 * dt),
        (player.jetpack = !0),
        (player.fuel = Math.max(0, player.fuel - 20 * dt)),
        createJetpackParticles())
      : (player.jetpack = !1);
    player.jetpack && !jetpackSound && startJetpackSound();
    !player.jetpack && jetpackSound && stopJetpackSound();
    !player.isGrounded() ||
      (1 !== keys[KEY_Z].downCount && 1 !== keys[KEY_SPACE].downCount) ||
      player.jump();
    isKeyPressed(KEY_R) && playerDie();
    isKeyPressed(KEY_M) && toggleBackgroundMusic();
  }
}
function createJetpackParticles() {
  if (0.3 > Math.random()) {
    const a = new Particle();
    a.size = 0.2;
    a.velocity[1] =
      gameState === GameState.AFTER_LEVEL || gameState === GameState.CREDITS
        ? -10
        : -0.3;
    vec3.copy(a.pos, player.pos);
    a.pos[0] -= 0.3 * Math.sin(player.yaw);
    a.pos[1] += 0.8;
    a.pos[2] -= 0.3 * Math.cos(player.yaw);
    entities.push(a);
  }
}
function updateWorld() {
  if (0.02 > Math.random()) {
    var a = new Particle();
    a.size = 0.08;
    a.velocity[1] = 1;
    vec3.copy(a.pos, player.pos);
    a.pos[0] += 30 * (Math.random() - 0.5);
    a.pos[2] += 30 * (Math.random() - 0.5);
    entities.push(a);
  }
  1 < gameTime - lastCoinTime && (coinSequence = 0);
  for (a = 0; a < entities.length; a++) entities[a].update();
  a = 0 < player.health;
  for (let c = 0; c < entities.length; c++)
    for (let d = 0; d < entities.length; d++) {
      if (
        entities[c] instanceof Platform &&
        !(entities[d] instanceof Platform)
      ) {
        const e = entities[c],
          f = entities[d],
          g = f.pos[0],
          h = f.pos[1],
          k = f.pos[2],
          m = f instanceof Particle && 0 < f.projectile;
        var b = m ? 0.1 : 0.7;
        const p = m ? 0.1 : 2.5,
          q = e.pos[0] - e.scale[0] - b,
          v = e.pos[1] - e.scale[1],
          y = e.pos[2] - e.scale[2] - b,
          x = e.pos[0] + e.scale[0] + b,
          w = e.pos[1] + e.scale[1];
        b = e.pos[2] + e.scale[2] + b;
        g > q &&
          g < x &&
          k > y &&
          k < b &&
          (m && h < w && h > v
            ? (f.health = 0)
            : h > w - 1 && h < w
            ? ((f.pos[1] = w),
              0 > f.velocity[1] &&
                ((f.velocity[1] = 0),
                (f.groundedTime = gameTime),
                (f.groundedPlatform = e)))
            : h < w &&
              h + p > v &&
              (g < e.pos[0] - e.scale[0]
                ? (f.pos[0] = q)
                : g > e.pos[0] + e.scale[0]
                ? (f.pos[0] = x)
                : (f.pos[2] = k < e.pos[2] - e.scale[2] ? y : b)));
      }
      vec3.copy(tempVec, player.pos);
      tempVec[1] += 1;
      entities[c] instanceof Hero &&
        entities[d] instanceof Particle &&
        entities[d].projectile === ProjectileType.Enemy &&
        1.5 > vec3.distance(tempVec, entities[d].pos) &&
        gameState === GameState.PLAYING &&
        ((player.health = 0),
        (player.rendered = !1),
        (entities[d].health = 0),
        playExplosionSound(),
        createExplosion(player.pos, COLOR_WHITE));
    }
  updateEntity(player);
  a && 0 >= player.health && playerDie();
}
function createExplosion(a, b = COLOR_WHITE, c = 40) {
  log("Create explosion");
  for (let d = 0; d < c; d++) {
    const e = new Particle();
    vec3.copy(e.pos, a);
    e.pos[1] += 1;
    e.color = b;
    e.size = 0.4;
    const f = 0.2 + 5 * Math.random(),
      g = 6.28 * Math.random();
    e.velocity[0] = Math.sin(g) * f;
    e.velocity[1] = 2;
    e.velocity[2] = Math.cos(g) * f;
    e.acceleration[1] = -0.5;
    entities.push(e);
  }
}
function updateEntity(a) {
  a.isGrounded() &&
    a.groundedPlatform &&
    vec3.scaleAndAdd(a.pos, a.pos, a.groundedPlatform.velocity, dt);
  a.velocity[0] *= 1 - dt * FRICTION;
  a.velocity[2] *= 1 - dt * FRICTION;
  a.pos[0] += dt * a.velocity[0];
  a.pos[2] += dt * a.velocity[2];
  var b = vec3.magnitude(a.velocity);
  0.1 < vec3.magnitude(a.velocity)
    ? (a.yaw = Math.atan2(a.velocity[0], a.velocity[2]))
    : vec3.set(a.velocity, 0, 0, 0);
  if (gameState === GameState.CREDITS) {
    if (((player.yaw = 0), 0.5 > Math.random())) {
      const c = new Mystery(
        (0.5 > Math.random() ? -1 : 1) * (10 + 40 * Math.random()),
        600,
        (0.5 > Math.random() ? -1 : 1) * (10 + 40 * Math.random()),
        2 + 2 * Math.random(),
        4 + 20 * Math.random(),
        2 + 2 * Math.random()
      );
      c.velocity[1] = -100 - 400 * Math.random();
      entities.push(c);
    }
  } else
    gameState !== GameState.AFTER_LEVEL &&
      ((a.velocity[1] -= dt * GRAVITY), (a.pos[1] += dt * a.velocity[1]));
  a.isGrounded() &&
    5 < b &&
    0.2 > Math.random() &&
    ((b = new Particle()),
    (b.velocity[1] = 0.1),
    vec3.copy(b.pos, a.pos),
    entities.push(b));
  -30 > a.pos[1] && ((a.pos[1] = -30), (a.health = 0));
}
const bestTimesStr = localStorage["callisto-times"],
  bestTimes = bestTimesStr ? JSON.parse(bestTimesStr) : [];
