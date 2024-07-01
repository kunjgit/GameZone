function Matrix() {
  var e = Array.prototype.concat.apply([], arguments);
  e.length || (e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    (this.m = hasFloat32Array ? new Float32Array(e) : e);
}
function Indexer() {
  (this.unique = []), (this.indices = []), (this.map = {});
}
function Buffer(e, t) {
  (this.buffer = null), (this.target = e), (this.type = t), (this.data = []);
}
function Mesh(e) {
  (e = e || {}),
    (this.vertexBuffers = {}),
    (this.indexBuffers = {}),
    this.addVertexBuffer("vertices", "gl_Vertex"),
    (this.dynamic = !1),
    e.coords && this.addVertexBuffer("coords", "gl_TexCoord"),
    e.normals && this.addVertexBuffer("normals", "gl_Normal"),
    e.colors && this.addVertexBuffer("colors", "gl_Color"),
    ("triangles" in e && !e.triangles) || this.addIndexBuffer("triangles"),
    e.lines && this.addIndexBuffer("lines");
}
function pickOctant(e) {
  return new Vector(2 * (1 & e) - 1, (2 & e) - 1, (4 & e) / 2 - 1);
}
function regexMap(e, t, r) {
  for (; null !== (result = e.exec(t)); ) r(result);
}
function Shader(e, t) {
  function r(e) {
    var t = document.getElementById(e);
    return t ? t.text : e;
  }
  function a(e, t) {
    var r = {},
      a = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(t);
    return (
      (t = a ? a[1] + e + t.substr(a[1].length) : e + t),
      regexMap(/\bgl_\w+\b/g, e, function (e) {
        e in r ||
          ((t = t.replace(
            new RegExp("\\b" + e + "\\b", "g"),
            LIGHTGL_PREFIX + e
          )),
          (r[e] = !0));
      }),
      t
    );
  }
  function n(e, t) {
    var r = gl.createShader(e);
    if (
      (gl.shaderSource(r, t),
      gl.compileShader(r),
      !gl.getShaderParameter(r, gl.COMPILE_STATUS))
    )
      throw new Error("compile error: " + gl.getShaderInfoLog(r));
    return r;
  }
  (e = r(e)), (t = r(t));
  var i =
      "    uniform mat3 gl_NormalMatrix;    uniform mat4 gl_ModelViewMatrix;    uniform mat4 gl_ProjectionMatrix;    uniform mat4 gl_ModelViewProjectionMatrix;    uniform mat4 gl_ModelViewMatrixInverse;    uniform mat4 gl_ProjectionMatrixInverse;    uniform mat4 gl_ModelViewProjectionMatrixInverse;  ",
    o =
      i +
      "    attribute vec4 gl_Vertex;    attribute vec4 gl_TexCoord;    attribute vec3 gl_Normal;    attribute vec4 gl_Color;    vec4 ftransform() {      return gl_ModelViewProjectionMatrix * gl_Vertex;    }  ",
    s = "    precision highp float;  " + i,
    l = e + t,
    h = {};
  if (
    (regexMap(/\b(gl_[^;]*)\b;/g, i, function (e) {
      var t = e[1];
      if (l.indexOf(t) !== -1) {
        var r = t.replace(/[a-z_]/g, "");
        h[r] = LIGHTGL_PREFIX + t;
      }
    }),
    l.indexOf("ftransform") !== -1 &&
      (h.MVPM = LIGHTGL_PREFIX + "gl_ModelViewProjectionMatrix"),
    (this.usedMatrices = h),
    (e = a(o, e)),
    (t = a(s, t)),
    (this.program = gl.createProgram()),
    gl.attachShader(this.program, n(gl.VERTEX_SHADER, e)),
    gl.attachShader(this.program, n(gl.FRAGMENT_SHADER, t)),
    gl.linkProgram(this.program),
    !gl.getProgramParameter(this.program, gl.LINK_STATUS))
  )
    throw new Error("link error: " + gl.getProgramInfoLog(this.program));
  (this.attributes = {}), (this.uniformLocations = {});
  var c = {};
  regexMap(
    /uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g,
    e + t,
    function (e) {
      c[e[2]] = 1;
    }
  ),
    (this.isSampler = c);
}
function isArray(e) {
  var t = Object.prototype.toString.call(e);
  return "[object Array]" === t || "[object Float32Array]" === t;
}
function isNumber(e) {
  var t = Object.prototype.toString.call(e);
  return "[object Number]" === t || "[object Boolean]" === t;
}
function Vector(e, t, r) {
  (this.x = e || 0), (this.y = t || 0), (this.z = r || 0);
}
function addMatrixStack() {
  (gl.MODELVIEW = 1 | ENUM), (gl.PROJECTION = 2 | ENUM);
  var e = new Matrix(),
    t = new Matrix();
  (gl.modelviewMatrix = new Matrix()), (gl.projectionMatrix = new Matrix());
  var r,
    a,
    n = [],
    i = [];
  (gl.matrixMode = function (e) {
    switch (e) {
      case gl.MODELVIEW:
        (r = "modelviewMatrix"), (a = n);
        break;
      case gl.PROJECTION:
        (r = "projectionMatrix"), (a = i);
        break;
      default:
        throw new Error("invalid matrix mode " + e);
    }
  }),
    (gl.loadIdentity = function () {
      Matrix.identity(gl[r]);
    }),
    (gl.loadMatrix = function (e) {
      for (var t = e.m, a = gl[r].m, n = 0; n < 16; n++) a[n] = t[n];
    }),
    (gl.multMatrix = function (e) {
      gl.loadMatrix(Matrix.multiply(gl[r], e, t));
    }),
    (gl.perspective = function (t, r, a, n) {
      gl.multMatrix(Matrix.perspective(t, r, a, n, e));
    }),
    (gl.frustum = function (t, r, a, n, i, o) {
      gl.multMatrix(Matrix.frustum(t, r, a, n, i, o, e));
    }),
    (gl.scale = function (t, r, a) {
      gl.multMatrix(Matrix.scale(t, r, a, e));
    }),
    (gl.translate = function (t, r, a) {
      gl.multMatrix(Matrix.translate(t, r, a, e));
    }),
    (gl.rotate = function (t, r, a, n) {
      gl.multMatrix(Matrix.rotate(t, r, a, n, e));
    }),
    gl.matrixMode(gl.MODELVIEW);
}
function addEventListeners() {
  function e() {
    if (isLocked) return !0;
    for (var e in c) if (f.call(c, e) && c[e]) return !0;
    return !1;
  }
  function t(t) {
    var r = {};
    for (var a in t)
      "function" == typeof t[a]
        ? (r[a] = (function (e) {
            return function () {
              e.apply(t, arguments);
            };
          })(t[a]))
        : (r[a] = t[a]);
    (r.original = t), (r.x = r.pageX), (r.y = r.pageY);
    for (var n = gl.canvas; n; n = n.offsetParent)
      (r.x -= n.offsetLeft), (r.y -= n.offsetTop);
    return (
      u
        ? ((r.deltaX = r.x - l), (r.deltaY = r.y - h))
        : ((r.deltaX = 0), (r.deltaY = 0), (u = !0)),
      (l = r.x),
      (h = r.y),
      (r.dragging = e()),
      r.dragging && ((r.deltaX = r.movementX), (r.deltaY = r.movementY)),
      (r.preventDefault = function () {
        r.original.preventDefault();
      }),
      (r.stopPropagation = function () {
        r.original.stopPropagation();
      }),
      r
    );
  }
  function r(r) {
    (gl = s),
      e() ||
        (on(document, "mousemove", a),
        on(document, "mouseup", n),
        off(gl.canvas, "mousemove", a),
        off(gl.canvas, "mouseup", n)),
      (c[r.which] = !0),
      (r = t(r)),
      gl.onmousedown && gl.onmousedown(r),
      r.preventDefault();
  }
  function a(e) {
    (gl = s),
      (e = t(e)),
      gl.onmousemove && gl.onmousemove(e),
      e.preventDefault();
  }
  function n(r) {
    (gl = s),
      (c[r.which] = !1),
      e() ||
        (off(document, "mousemove", a),
        off(document, "mouseup", n),
        on(gl.canvas, "mousemove", a),
        on(gl.canvas, "mouseup", n)),
      (r = t(r)),
      gl.onmouseup && gl.onmouseup(r),
      r.preventDefault();
  }
  function i() {
    u = !1;
  }
  function o() {
    (c = {}), (u = !1);
  }
  var s = gl,
    l = 0,
    h = 0,
    c = {},
    u = !1,
    f = Object.prototype.hasOwnProperty;
  on(gl.canvas, "mousedown", r),
    on(gl.canvas, "mousemove", a),
    on(gl.canvas, "mouseup", n),
    on(gl.canvas, "mouseover", i),
    on(gl.canvas, "mouseout", i),
    on(document, "contextmenu", o);
}
function mapKeyCode(e) {
  var t = {
    8: "BACKSPACE",
    9: "TAB",
    13: "ENTER",
    16: "SHIFT",
    27: "ESCAPE",
    32: "SPACE",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
  };
  return t[e] || (e >= 65 && e <= 90 ? String.fromCharCode(e) : null);
}
function on(e, t, r) {
  e.addEventListener(t, r);
}
function off(e, t, r) {
  e.removeEventListener(t, r);
}
function addOtherMethods() {
  (function (e) {
    gl.makeCurrent = function () {
      gl = e;
    };
  })(gl),
    (gl.animate = function () {
      function e() {
        gl = r;
        var a = new Date().getTime();
        gl.onupdate && gl.onupdate((a - t) / 1e3),
          gl.ondraw && gl.ondraw(),
          (t = a),
          requestAnimationFrame(e);
      }
      var t = new Date().getTime(),
        r = gl;
      e();
    }),
    (gl.fullscreen = function (e) {
      function t() {
        (gl.canvas.width = window.innerWidth - a - n),
          (gl.canvas.height = window.innerHeight - r - i),
          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height),
          (!e.camera && "camera" in e) ||
            (gl.matrixMode(gl.PROJECTION),
            gl.loadIdentity(),
            gl.perspective(
              e.fov || 45,
              gl.canvas.width / gl.canvas.height,
              e.near || 0.1,
              e.far || 1e3
            ),
            gl.matrixMode(gl.MODELVIEW)),
          gl.ondraw && gl.ondraw();
      }
      e = e || {};
      var r = e.paddingTop || 0,
        a = e.paddingLeft || 0,
        n = e.paddingRight || 0,
        i = e.paddingBottom || 0;
      if (!document.body) throw new Error("gl.fullscreen()");
      document.body.appendChild(gl.canvas),
        (document.body.style.overflow = "hidden"),
        (gl.canvas.style.position = "absolute"),
        (gl.canvas.style.left = a + "px"),
        (gl.canvas.style.top = r + "px"),
        on(window, "resize", t),
        t();
    });
}
function getRandom(e, t) {
  return Math.random() * (t - e) + e;
}
function getRandomInt(e, t) {
  return (
    (e = Math.ceil(e)),
    (t = Math.floor(t)),
    Math.floor(Math.random() * (t - e)) + e
  );
}
function degToRad(e) {
  return (e * Math.PI) / 180;
}
function intersection(e, t, r) {
  var a = new Float32Array(3),
    n = distance(e, t, r);
  if (n === +(1 / 0) || n === -(1 / 0)) a = null;
  else {
    a = a || [];
    for (var i = 0; i < e.length; i++) a[i] = e[i] + t[i] * n;
  }
  return null === a ? null : new GL.Vector(a[0], a[1], a[2]);
}
function distance(e, t, r) {
  for (var a = e.length, n = -(1 / 0), i = +(1 / 0), o = 0; o < a; o++) {
    var s = 0,
      l = 0;
    0 === o && ((s = r.min.x), (l = r.max.x)),
      1 === o && ((s = r.min.y), (l = r.max.y)),
      2 === o && ((s = r.min.z), (l = r.max.z));
    var h = (s - e[o]) / t[o],
      c = (l - e[o]) / t[o];
    if (h > c) {
      var u = h;
      (h = c), (c = u);
    }
    if (c < n || h > i) return 1 / 0;
    h > n && (n = h), c < i && (i = c);
  }
  return n > i ? 1 / 0 : n;
}
function inteceptCircleLineSeg(e, t, r, a) {
  var n, i, o, s, l, h, c, u, f, m;
  return (
    (f = {}),
    (m = {}),
    (f.x = r.z - t.z),
    (f.y = r.x - t.x),
    (m.x = t.z - e.z),
    (m.y = t.x - e.x),
    (n = f.x * m.x + f.y * m.y),
    (i = 2 * (f.x * f.x + f.y * f.y)),
    (n *= -2),
    (o = Math.sqrt(n * n - 2 * i * (m.x * m.x + m.y * m.y - a * a))),
    !isNaN(o) &&
      ((s = (n - o) / i),
      (l = (n + o) / i),
      (c = {}),
      (u = {}),
      (h = []),
      s <= 1 &&
        s >= 0 &&
        ((c.x = t.z + f.x * s), (c.y = t.x + f.y * s), (h[0] = c)),
      l <= 1 &&
        l >= 0 &&
        ((u.x = t.z + f.x * l), (u.y = t.x + f.y * l), (h[h.length] = u)),
      2 === h.length || 1 === h.length)
  );
}
function newMaze(e, t) {
  for (var r = e * t, a = new Array(), n = new Array(), i = 0; i < t; i++) {
    (a[i] = new Array()), (n[i] = new Array());
    for (var o = 0; o < e; o++) (a[i][o] = [0, 0, 0, 0]), (n[i][o] = !0);
  }
  var s = [Math.floor(Math.random() * t), Math.floor(Math.random() * e)],
    l = [s];
  n[s[0]][s[1]] = !1;
  for (var h = 1; h < r; ) {
    for (
      var c = [
          [s[0] - 1, s[1], 0, 2],
          [s[0], s[1] + 1, 1, 3],
          [s[0] + 1, s[1], 2, 0],
          [s[0], s[1] - 1, 3, 1],
        ],
        u = new Array(),
        f = 0;
      f < 4;
      f++
    )
      c[f][0] > -1 &&
        c[f][0] < t &&
        c[f][1] > -1 &&
        c[f][1] < e &&
        n[c[f][0]][c[f][1]] &&
        u.push(c[f]);
    u.length
      ? ((next = u[Math.floor(Math.random() * u.length)]),
        (a[s[0]][s[1]][next[2]] = 1),
        (a[next[0]][next[1]][next[3]] = 1),
        (n[next[0]][next[1]] = !1),
        h++,
        (s = [next[0], next[1]]),
        l.push(s))
      : (s = l.pop());
  }
  return a;
}
function pointInAABB(e, t) {
  return (
    e.x > t.min.x &&
    e.x < t.max.x &&
    e.y > t.min.y &&
    e.y < t.max.y &&
    e.z > t.min.z &&
    e.z < t.max.z
  );
}
function lerp(e, t, r) {
  return (r = r < 0 ? 0 : r), (r = r > 1 ? 1 : r), e + (t - e) * r;
}
function easeInSine(e, t, r, a) {
  return -r * Math.cos((e / a) * (Math.PI / 2)) + r + t;
}
function removeIsDeadArray(e) {
  if (null !== e && 0 !== e.length) {
    for (var t = new Array(), r = 0; r < e.length; r++)
      e[r].isDead() && t.push(r);
    for (var a = 0; a < t.length; a++) e.splice(t[a], 1);
  }
}
function getCookie(e) {
  for (
    var t = e + "=",
      r = decodeURIComponent(document.cookie),
      a = r.split(";"),
      n = 0;
    n < a.length;
    n++
  ) {
    for (var i = a[n]; " " === i.charAt(0); ) i = i.substring(1);
    if (0 === i.indexOf(t)) return i.substring(t.length, i.length);
  }
  return "";
}
function Hero() {
  (this.Camera = new GL.Vector(0, 0, 0)),
    (this.arrayEffects = new Array()),
    (this.health = 1),
    (this.update = function (e) {
      for (var t = 0; t < this.arrayEffects.length; t++)
        this.arrayEffects[t].update(e);
      removeIsDeadArray(this.arrayEffects);
    }),
    (this.playScanSoundEffect = function (e) {}),
    (this.takeHit = function () {
      this.arrayEffects.push(new HeroCameraShakeEfect(this, 0.5, 12e3)),
        (this.health -= 0.2);
    }),
    (this.isDead = function () {
      return this.health < 0;
    }),
    (this.addCameraShakeEffect = function () {
      this.arrayEffects.push(new HeroCameraShakeEfect(this, 0.15, 6e3));
    });
}
function HeroCameraShakeEfect(e, t, r) {
  (this.hero = e),
    (this.lifespan = t),
    (this.joggingAngle = 0),
    (this.update = function (e) {
      (this.lifespan -= e),
        (this.joggingAngle += e * r),
        (this.hero.Camera.y = 2 + Math.sin(degToRad(this.joggingAngle)) / 20);
    }),
    (this.isDead = function () {
      return this.lifespan < 0;
    });
}
function BoxEnemy(e, t, r, a, n, i, o) {
  (this.arrayMaze = t),
    (this.position = e),
    (this.lastDirInverted = -1),
    (this.effects = new Array()),
    (this.fireSpheres = new Array()),
    (this.blockSize = r),
    (this.oneBlockSpeed = a),
    (this.scanTotalTime = n),
    (this.scanRadius = i),
    (this.isScanActive = !1),
    (this.health = 1),
    (this.color = new GL.Vector(0, this.health, 0)),
    (this.hero = o),
    (this.mesh = GL.Mesh.cube({ normals: !0, coords: !0 })
      .transform(GL.Matrix.scale(1, 1, 1))
      .transform(
        GL.Matrix.translate(this.position.x, this.position.y, this.position.z)
      )),
    (this.update = function (e) {
      0 === this.effects.length &&
        this.effects.push(new ScanEffect(this, this.scanTotalTime));
      for (var t = 0; t < this.effects.length; t++) this.effects[t].update(e);
      removeIsDeadArray(this.effects);
      for (var r = 0; r < this.fireSpheres.length; r++)
        this.fireSpheres[r].update(e);
      removeIsDeadArray(this.fireSpheres),
        (this.mesh = GL.Mesh.cube({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(1, 1, 1))
          .transform(
            GL.Matrix.translate(
              this.position.x,
              this.position.y,
              this.position.z
            )
          ));
      var a = GL.Vector.distance(this.hero.Camera, this.position);
      a < 2 && this.hero.takeHit();
    }),
    (this.isDead = function () {
      return this.health <= 0;
    }),
    (this.isHeroNear = function () {
      var e = GL.Vector.distance(this.position, this.hero.Camera);
      return e < this.scanRadius;
    }),
    (this.fire = function () {
      this.fireSpheres.push(
        new FireSpheres(this, this.scanRadius, this.scanTotalTime)
      );
    }),
    (this.takeHit = function () {
      (this.health -= 0.25), (this.color = this.color.subtract(0.25));
    }),
    (this.nextNormalMovement = function () {
      for (var e = null, r = 0; r < t.length; r++)
        if (pointInAABB(this.position, t[r].AABB)) {
          e = t[r];
          break;
        }
      if (null !== e) {
        var a = -1,
          n = new Array();
        if (
          (1 === e.MazePosition[0] && n.push(0),
          1 === e.MazePosition[1] && n.push(1),
          1 === e.MazePosition[2] && n.push(2),
          1 === e.MazePosition[3] && n.push(3),
          1 === n.length)
        )
          a = n[0];
        else {
          a = n[getRandomInt(0, n.length)];
          for (var i = 0; i < 5 && this.lastDirInverted === a; i++)
            a = n[getRandomInt(0, n.length)];
        }
        if (a !== -1) {
          var o = null;
          0 === a &&
            ((o = new GL.Vector(
              this.position.x - this.blockSize,
              this.position.y,
              this.position.z
            )),
            (this.lastDirInverted = 2)),
            1 === a &&
              ((o = new GL.Vector(
                this.position.x,
                this.position.y,
                this.position.z - this.blockSize
              )),
              (this.lastDirInverted = 3)),
            2 === a &&
              ((o = new GL.Vector(
                this.position.x + this.blockSize,
                this.position.y,
                this.position.z
              )),
              (this.lastDirInverted = 0)),
            3 === a &&
              ((o = new GL.Vector(
                this.position.x,
                this.position.y,
                this.position.z + this.blockSize
              )),
              (this.lastDirInverted = 1)),
            null !== o &&
              this.effects.push(
                new BoxMovementEfect(this, this.position, o, this.oneBlockSpeed)
              );
        }
      }
    });
}
function BoxMovementEfect(e, t, r, a) {
  (this.startPosition = t.clone()),
    (this.endPosition = r.clone()),
    (this.totalTime = a),
    (this.timeElapsed = 0),
    (this.finished = !1),
    (this.update = function (t) {
      (this.timeElapsed += t),
        (e.position = GL.Vector.lerp(
          this.startPosition,
          this.endPosition,
          this.timeElapsed / this.totalTime
        ));
    }),
    (this.isDead = function () {
      return this.timeElapsed > this.totalTime;
    });
}
function ScanEffect(e, t) {
  (this.box = e),
    (this.totalTime = t),
    (this.timeElapsed = 0),
    (this.boxOldColor = e.color.clone()),
    (this.box.color = new GL.Vector(0, 0, 0)),
    (this.up = !0),
    (this.timeElapsedColor = 0),
    (this.update = function (e) {
      (this.timeElapsed += e),
        (this.timeElapsedColor += e),
        this.timeElapsed > this.totalTime
          ? this.box.isHeroNear()
            ? (this.box.fire(), (this.timeElapsed = 0))
            : ((this.box.color = this.boxOldColor),
              this.box.nextNormalMovement())
          : (this.up === !0
              ? (this.box.color.x = lerp(0, 1, this.timeElapsedColor))
              : (this.box.color.x = lerp(1, 0, this.timeElapsedColor)),
            this.timeElapsedColor > 1 &&
              ((this.up = !this.up), (this.timeElapsedColor = 0)));
    }),
    (this.isDead = function () {
      return this.timeElapsed > this.totalTime;
    });
}
function FireSpheres(e, t, r) {
  (this.box = e),
    (this.totalTime = r),
    (this.timeElapsed = 0),
    (this.maxRadius = t),
    (this.currentRadius = 0),
    (this.mesh = GL.Mesh.sphere({ normals: !0, coords: !0 })
      .transform(
        GL.Matrix.scale(
          this.currentRadius,
          this.currentRadius,
          this.currentRadius
        )
      )
      .transform(
        GL.Matrix.translate(
          this.box.position.x,
          this.box.position.y,
          this.box.position.z
        )
      )),
    (this.update = function (e) {
      (this.timeElapsed += e),
        (this.currentRadius = easeInSine(
          this.timeElapsed,
          0,
          this.maxRadius,
          this.totalTime
        )),
        (this.mesh = GL.Mesh.sphere({ normals: !0, coords: !0 })
          .transform(
            GL.Matrix.scale(
              this.currentRadius,
              this.currentRadius,
              this.currentRadius
            )
          )
          .transform(
            GL.Matrix.translate(
              this.box.position.x,
              this.box.position.y,
              this.box.position.z
            )
          ));
      var t = GL.Vector.distance(this.box.hero.Camera, this.box.position);
      t < this.currentRadius &&
        (this.box.hero.takeHit(), (this.timeElapsed = this.totalTime + e));
    }),
    (this.isDead = function () {
      return this.timeElapsed > this.totalTime;
    });
}
function HitLine(e, t, r, a, n) {
  (this.mesh = new Mesh.square(e, t, r, a)),
    (this.lifespan = n),
    (this.update = function (e) {
      this.lifespan -= e;
    }),
    (this.isDead = function () {
      return this.lifespan < 0;
    });
}
function MazeBlock() {
  (this.Center = null),
    (this.AABB = null),
    (this.MazePosition = null),
    (this.ArrayObjects = new Array()),
    (this.ArrayAABBs = new Array()),
    (this.init = function (e, t) {
      (this.MazePosition = e),
        (this.Center = new GL.Vector(t.x, t.y, t.z * -1));
      var r = 2,
        a = 1.95,
        n = GL.Mesh.plane({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(r, r))
          .transform(GL.Matrix.rotate(-90, 1, 0, 0))
          .transform(GL.Matrix.translate(this.Center.x, 0, this.Center.z))
          .computeNormals();
      if (
        (this.ArrayObjects.push(n),
        this.ArrayAABBs.push(n.getAABB()),
        0 === e[0])
      ) {
        var i = GL.Mesh.plane({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(r, r))
          .transform(GL.Matrix.rotate(90, 0, 1, 0))
          .transform(GL.Matrix.translate(this.Center.x - r, 2, this.Center.z))
          .computeNormals();
        this.ArrayObjects.push(i);
        var o = GL.Mesh.plane({ normals: !0, coords: !0 })
            .transform(GL.Matrix.scale(a, a))
            .transform(GL.Matrix.rotate(90, 0, 1, 0))
            .transform(GL.Matrix.translate(this.Center.x - a, 2, this.Center.z))
            .computeNormals(),
          s = o.getAABB();
        (s.Plane = 0), this.ArrayAABBs.push(s);
      }
      if (0 === e[1]) {
        var l = GL.Mesh.plane({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(r, r))
          .transform(GL.Matrix.translate(this.Center.x, 2, this.Center.z - r))
          .computeNormals();
        this.ArrayObjects.push(l);
        var h = GL.Mesh.plane({ normals: !0, coords: !0 })
            .transform(GL.Matrix.scale(a, a))
            .transform(GL.Matrix.translate(this.Center.x, 2, this.Center.z - a))
            .computeNormals(),
          c = h.getAABB();
        (c.Plane = 1), this.ArrayAABBs.push(c);
      }
      if (0 === e[2]) {
        var u = GL.Mesh.plane({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(r, r))
          .transform(GL.Matrix.rotate(-90, 0, 1, 0))
          .transform(GL.Matrix.translate(this.Center.x + r, 2, this.Center.z))
          .computeNormals();
        this.ArrayObjects.push(u);
        var f = GL.Mesh.plane({ normals: !0, coords: !0 })
            .transform(GL.Matrix.scale(a, a))
            .transform(GL.Matrix.rotate(-90, 0, 1, 0))
            .transform(GL.Matrix.translate(this.Center.x + a, 2, this.Center.z))
            .computeNormals(),
          m = f.getAABB();
        (m.Plane = 2), this.ArrayAABBs.push(m);
      }
      if (0 === e[3]) {
        var d = GL.Mesh.plane({ normals: !0, coords: !0 })
          .transform(GL.Matrix.scale(r, r))
          .transform(GL.Matrix.rotate(180, 0, 1, 0))
          .transform(GL.Matrix.translate(this.Center.x, 2, this.Center.z + r))
          .computeNormals();
        this.ArrayObjects.push(d);
        var g = GL.Mesh.plane({ normals: !0, coords: !0 })
            .transform(GL.Matrix.scale(a, a))
            .transform(GL.Matrix.rotate(180, 0, 1, 0))
            .transform(GL.Matrix.translate(this.Center.x, 2, this.Center.z + a))
            .computeNormals(),
          x = g.getAABB();
        (x.Plane = 3), this.ArrayAABBs.push(x);
      }
      var y = GL.Mesh.cube()
        .transform(GL.Matrix.scale(r, r, r))
        .transform(GL.Matrix.translate(this.Center.x, 2, this.Center.z));
      this.AABB = y.getAABB();
    });
}
function Particle(e) {
  (this.loc = e.loc || new GL.Vector()),
    (this.vel = e.vec || new GL.Vector()),
    (this.acc = e.acc || new GL.Vector()),
    (this.lifespan = e.lifespan || 5 * Math.random()),
    (this.update = function (e) {
      (this.vel = this.vel.add(this.acc.multiply(e))),
        (this.loc = this.loc.add(this.vel.multiply(e))),
        (this.lifespan -= e);
    }),
    (this.isDead = function () {
      return this.lifespan < 0;
    });
}
function onloadFunction() {
  document.addEventListener("pointerlockchange", pointerlockchange, !1),
    document.addEventListener("mspointerlockchange", pointerlockchange, !1),
    document.addEventListener("mozpointerlockchange", pointerlockchange, !1),
    document.addEventListener("webkitpointerlockchange", pointerlockchange, !1),
    (meshParticles = GL.Mesh.cube({ normals: !0, coords: !0 }).transform(
      GL.Matrix.scale(0.05, 0.05, 0.05)
    )),
    meshParticles.createOriginalVerticesNormals();
  var e = getCookie("currentLevel");
  if (null !== e && "" !== e) {
    var t = parseInt(e);
    isNaN(t) || (currentLevel = t);
  }
  loadCurrentLevel();
}
var hasFloat32Array = "undefined" != typeof Float32Array;
(Matrix.prototype = {
  inverse: function () {
    return Matrix.inverse(this, new Matrix());
  },
  transpose: function () {
    return Matrix.transpose(this, new Matrix());
  },
  multiply: function (e) {
    return Matrix.multiply(this, e, new Matrix());
  },
  transformPoint: function (e) {
    var t = this.m;
    return new Vector(
      t[0] * e.x + t[1] * e.y + t[2] * e.z + t[3],
      t[4] * e.x + t[5] * e.y + t[6] * e.z + t[7],
      t[8] * e.x + t[9] * e.y + t[10] * e.z + t[11]
    ).divide(t[12] * e.x + t[13] * e.y + t[14] * e.z + t[15]);
  },
  transformVector: function (e) {
    var t = this.m;
    return new Vector(
      t[0] * e.x + t[1] * e.y + t[2] * e.z,
      t[4] * e.x + t[5] * e.y + t[6] * e.z,
      t[8] * e.x + t[9] * e.y + t[10] * e.z
    );
  },
}),
  (Matrix.inverse = function (e, t) {
    t = t || new Matrix();
    var r = e.m,
      a = t.m;
    (a[0] =
      r[5] * r[10] * r[15] -
      r[5] * r[14] * r[11] -
      r[6] * r[9] * r[15] +
      r[6] * r[13] * r[11] +
      r[7] * r[9] * r[14] -
      r[7] * r[13] * r[10]),
      (a[1] =
        -r[1] * r[10] * r[15] +
        r[1] * r[14] * r[11] +
        r[2] * r[9] * r[15] -
        r[2] * r[13] * r[11] -
        r[3] * r[9] * r[14] +
        r[3] * r[13] * r[10]),
      (a[2] =
        r[1] * r[6] * r[15] -
        r[1] * r[14] * r[7] -
        r[2] * r[5] * r[15] +
        r[2] * r[13] * r[7] +
        r[3] * r[5] * r[14] -
        r[3] * r[13] * r[6]),
      (a[3] =
        -r[1] * r[6] * r[11] +
        r[1] * r[10] * r[7] +
        r[2] * r[5] * r[11] -
        r[2] * r[9] * r[7] -
        r[3] * r[5] * r[10] +
        r[3] * r[9] * r[6]),
      (a[4] =
        -r[4] * r[10] * r[15] +
        r[4] * r[14] * r[11] +
        r[6] * r[8] * r[15] -
        r[6] * r[12] * r[11] -
        r[7] * r[8] * r[14] +
        r[7] * r[12] * r[10]),
      (a[5] =
        r[0] * r[10] * r[15] -
        r[0] * r[14] * r[11] -
        r[2] * r[8] * r[15] +
        r[2] * r[12] * r[11] +
        r[3] * r[8] * r[14] -
        r[3] * r[12] * r[10]),
      (a[6] =
        -r[0] * r[6] * r[15] +
        r[0] * r[14] * r[7] +
        r[2] * r[4] * r[15] -
        r[2] * r[12] * r[7] -
        r[3] * r[4] * r[14] +
        r[3] * r[12] * r[6]),
      (a[7] =
        r[0] * r[6] * r[11] -
        r[0] * r[10] * r[7] -
        r[2] * r[4] * r[11] +
        r[2] * r[8] * r[7] +
        r[3] * r[4] * r[10] -
        r[3] * r[8] * r[6]),
      (a[8] =
        r[4] * r[9] * r[15] -
        r[4] * r[13] * r[11] -
        r[5] * r[8] * r[15] +
        r[5] * r[12] * r[11] +
        r[7] * r[8] * r[13] -
        r[7] * r[12] * r[9]),
      (a[9] =
        -r[0] * r[9] * r[15] +
        r[0] * r[13] * r[11] +
        r[1] * r[8] * r[15] -
        r[1] * r[12] * r[11] -
        r[3] * r[8] * r[13] +
        r[3] * r[12] * r[9]),
      (a[10] =
        r[0] * r[5] * r[15] -
        r[0] * r[13] * r[7] -
        r[1] * r[4] * r[15] +
        r[1] * r[12] * r[7] +
        r[3] * r[4] * r[13] -
        r[3] * r[12] * r[5]),
      (a[11] =
        -r[0] * r[5] * r[11] +
        r[0] * r[9] * r[7] +
        r[1] * r[4] * r[11] -
        r[1] * r[8] * r[7] -
        r[3] * r[4] * r[9] +
        r[3] * r[8] * r[5]),
      (a[12] =
        -r[4] * r[9] * r[14] +
        r[4] * r[13] * r[10] +
        r[5] * r[8] * r[14] -
        r[5] * r[12] * r[10] -
        r[6] * r[8] * r[13] +
        r[6] * r[12] * r[9]),
      (a[13] =
        r[0] * r[9] * r[14] -
        r[0] * r[13] * r[10] -
        r[1] * r[8] * r[14] +
        r[1] * r[12] * r[10] +
        r[2] * r[8] * r[13] -
        r[2] * r[12] * r[9]),
      (a[14] =
        -r[0] * r[5] * r[14] +
        r[0] * r[13] * r[6] +
        r[1] * r[4] * r[14] -
        r[1] * r[12] * r[6] -
        r[2] * r[4] * r[13] +
        r[2] * r[12] * r[5]),
      (a[15] =
        r[0] * r[5] * r[10] -
        r[0] * r[9] * r[6] -
        r[1] * r[4] * r[10] +
        r[1] * r[8] * r[6] +
        r[2] * r[4] * r[9] -
        r[2] * r[8] * r[5]);
    for (
      var n = r[0] * a[0] + r[1] * a[4] + r[2] * a[8] + r[3] * a[12], i = 0;
      i < 16;
      i++
    )
      a[i] /= n;
    return t;
  }),
  (Matrix.transpose = function (e, t) {
    t = t || new Matrix();
    var r = e.m,
      a = t.m;
    return (
      (a[0] = r[0]),
      (a[1] = r[4]),
      (a[2] = r[8]),
      (a[3] = r[12]),
      (a[4] = r[1]),
      (a[5] = r[5]),
      (a[6] = r[9]),
      (a[7] = r[13]),
      (a[8] = r[2]),
      (a[9] = r[6]),
      (a[10] = r[10]),
      (a[11] = r[14]),
      (a[12] = r[3]),
      (a[13] = r[7]),
      (a[14] = r[11]),
      (a[15] = r[15]),
      t
    );
  }),
  (Matrix.multiply = function (e, t, r) {
    r = r || new Matrix();
    var a = e.m,
      n = t.m,
      i = r.m;
    return (
      (i[0] = a[0] * n[0] + a[1] * n[4] + a[2] * n[8] + a[3] * n[12]),
      (i[1] = a[0] * n[1] + a[1] * n[5] + a[2] * n[9] + a[3] * n[13]),
      (i[2] = a[0] * n[2] + a[1] * n[6] + a[2] * n[10] + a[3] * n[14]),
      (i[3] = a[0] * n[3] + a[1] * n[7] + a[2] * n[11] + a[3] * n[15]),
      (i[4] = a[4] * n[0] + a[5] * n[4] + a[6] * n[8] + a[7] * n[12]),
      (i[5] = a[4] * n[1] + a[5] * n[5] + a[6] * n[9] + a[7] * n[13]),
      (i[6] = a[4] * n[2] + a[5] * n[6] + a[6] * n[10] + a[7] * n[14]),
      (i[7] = a[4] * n[3] + a[5] * n[7] + a[6] * n[11] + a[7] * n[15]),
      (i[8] = a[8] * n[0] + a[9] * n[4] + a[10] * n[8] + a[11] * n[12]),
      (i[9] = a[8] * n[1] + a[9] * n[5] + a[10] * n[9] + a[11] * n[13]),
      (i[10] = a[8] * n[2] + a[9] * n[6] + a[10] * n[10] + a[11] * n[14]),
      (i[11] = a[8] * n[3] + a[9] * n[7] + a[10] * n[11] + a[11] * n[15]),
      (i[12] = a[12] * n[0] + a[13] * n[4] + a[14] * n[8] + a[15] * n[12]),
      (i[13] = a[12] * n[1] + a[13] * n[5] + a[14] * n[9] + a[15] * n[13]),
      (i[14] = a[12] * n[2] + a[13] * n[6] + a[14] * n[10] + a[15] * n[14]),
      (i[15] = a[12] * n[3] + a[13] * n[7] + a[14] * n[11] + a[15] * n[15]),
      r
    );
  }),
  (Matrix.identity = function (e) {
    e = e || new Matrix();
    var t = e.m;
    return (
      (t[0] = t[5] = t[10] = t[15] = 1),
      (t[1] =
        t[2] =
        t[3] =
        t[4] =
        t[6] =
        t[7] =
        t[8] =
        t[9] =
        t[11] =
        t[12] =
        t[13] =
        t[14] =
          0),
      e
    );
  }),
  (Matrix.perspective = function (e, t, r, a, n) {
    var i = Math.tan((e * Math.PI) / 360) * r,
      o = i * t;
    return Matrix.frustum(-o, o, -i, i, r, a, n);
  }),
  (Matrix.frustum = function (e, t, r, a, n, i, o) {
    o = o || new Matrix();
    var s = o.m;
    return (
      (s[0] = (2 * n) / (t - e)),
      (s[1] = 0),
      (s[2] = (t + e) / (t - e)),
      (s[3] = 0),
      (s[4] = 0),
      (s[5] = (2 * n) / (a - r)),
      (s[6] = (a + r) / (a - r)),
      (s[7] = 0),
      (s[8] = 0),
      (s[9] = 0),
      (s[10] = -(i + n) / (i - n)),
      (s[11] = (-2 * i * n) / (i - n)),
      (s[12] = 0),
      (s[13] = 0),
      (s[14] = -1),
      (s[15] = 0),
      o
    );
  }),
  (Matrix.scale = function (e, t, r, a) {
    a = a || new Matrix();
    var n = a.m;
    return (
      (n[0] = e),
      (n[1] = 0),
      (n[2] = 0),
      (n[3] = 0),
      (n[4] = 0),
      (n[5] = t),
      (n[6] = 0),
      (n[7] = 0),
      (n[8] = 0),
      (n[9] = 0),
      (n[10] = r),
      (n[11] = 0),
      (n[12] = 0),
      (n[13] = 0),
      (n[14] = 0),
      (n[15] = 1),
      a
    );
  }),
  (Matrix.translate = function (e, t, r, a) {
    a = a || new Matrix();
    var n = a.m;
    return (
      (n[0] = 1),
      (n[1] = 0),
      (n[2] = 0),
      (n[3] = e),
      (n[4] = 0),
      (n[5] = 1),
      (n[6] = 0),
      (n[7] = t),
      (n[8] = 0),
      (n[9] = 0),
      (n[10] = 1),
      (n[11] = r),
      (n[12] = 0),
      (n[13] = 0),
      (n[14] = 0),
      (n[15] = 1),
      a
    );
  }),
  (Matrix.rotate = function (e, t, r, a, n) {
    if (!e || (!t && !r && !a)) return Matrix.identity(n);
    n = n || new Matrix();
    var i = n.m,
      o = Math.sqrt(t * t + r * r + a * a);
    (e *= Math.PI / 180), (t /= o), (r /= o), (a /= o);
    var s = Math.cos(e),
      l = Math.sin(e),
      h = 1 - s;
    return (
      (i[0] = t * t * h + s),
      (i[1] = t * r * h - a * l),
      (i[2] = t * a * h + r * l),
      (i[3] = 0),
      (i[4] = r * t * h + a * l),
      (i[5] = r * r * h + s),
      (i[6] = r * a * h - t * l),
      (i[7] = 0),
      (i[8] = a * t * h - r * l),
      (i[9] = a * r * h + t * l),
      (i[10] = a * a * h + s),
      (i[11] = 0),
      (i[12] = 0),
      (i[13] = 0),
      (i[14] = 0),
      (i[15] = 1),
      n
    );
  }),
  (Indexer.prototype = {
    add: function (e) {
      var t = JSON.stringify(e);
      return (
        t in this.map ||
          ((this.map[t] = this.unique.length), this.unique.push(e)),
        this.map[t]
      );
    },
  }),
  (Buffer.prototype = {
    compile: function (e) {
      for (var t = [], r = 0, a = 1e4; r < this.data.length; r += a)
        t = Array.prototype.concat.apply(t, this.data.slice(r, r + a));
      var n = this.data.length ? t.length / this.data.length : 0;
      if (n !== Math.round(n)) throw new Error("not consistent size");
      (this.buffer = this.buffer || gl.createBuffer()),
        (this.buffer.length = t.length),
        (this.buffer.spacing = n),
        gl.bindBuffer(this.target, this.buffer),
        gl.bufferData(this.target, new this.type(t), e || gl.STATIC_DRAW);
    },
  }),
  (Mesh.prototype = {
    addVertexBuffer: function (e, t) {
      var r = (this.vertexBuffers[t] = new Buffer(
        gl.ARRAY_BUFFER,
        Float32Array
      ));
      (r.name = e), (this[e] = []);
    },
    addIndexBuffer: function (e) {
      this.indexBuffers[e] = new Buffer(gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
      this[e] = [];
    },
    compile: function () {
      for (var e in this.vertexBuffers) {
        var t = this.vertexBuffers[e];
        (t.data = this[t.name]), t.compile();
      }
      for (var r in this.indexBuffers) {
        var a = this.indexBuffers[r];
        (a.data = this[r]), a.compile();
      }
    },
    transform: function (e) {
      var t = this.dynamic ? this.verticesOriginal : this.vertices,
        r = this.dynamic ? this.normalsOriginal : this.normals;
      if (
        ((this.vertices = t.map(function (t) {
          return e.transformPoint(Vector.fromArray(t)).toArray();
        })),
        this.normals)
      ) {
        var a = e.inverse().transpose();
        this.normals = r.map(function (e) {
          return a.transformVector(Vector.fromArray(e)).unit().toArray();
        });
      }
      return this.compile(), this;
    },
    computeNormals: function () {
      this.normals || this.addVertexBuffer("normals", "gl_Normal");
      for (var e = 0; e < this.vertices.length; e++)
        this.normals[e] = new Vector();
      for (var t = 0; t < this.triangles.length; t++) {
        var r = this.triangles[t],
          a = Vector.fromArray(this.vertices[r[0]]),
          n = Vector.fromArray(this.vertices[r[1]]),
          i = Vector.fromArray(this.vertices[r[2]]),
          o = n.subtract(a).cross(i.subtract(a)).unit();
        (this.normals[r[0]] = this.normals[r[0]].add(o)),
          (this.normals[r[1]] = this.normals[r[1]].add(o)),
          (this.normals[r[2]] = this.normals[r[2]].add(o));
      }
      for (var s = 0; s < this.vertices.length; s++)
        this.normals[s] = this.normals[s].unit().toArray();
      return this.compile(), this;
    },
    getAABB: function () {
      var e = {
        min: new Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
      };
      e.max = e.min.negative();
      for (var t = 0; t < this.vertices.length; t++) {
        var r = Vector.fromArray(this.vertices[t]);
        (e.min = Vector.min(e.min, r)), (e.max = Vector.max(e.max, r));
      }
      return e;
    },
    createOriginalVerticesNormals: function () {
      (this.dynamic = !0), (this.verticesOriginal = new Array());
      for (var e = 0; e < this.vertices.length; e++)
        this.verticesOriginal.push([
          this.vertices[e][0],
          this.vertices[e][1],
          this.vertices[e][2],
        ]);
      this.normalsOriginal = new Array();
      for (var t = 0; t < this.normals.length; t++)
        this.normalsOriginal.push([
          this.normals[t][0],
          this.normals[t][1],
          this.normals[t][2],
        ]);
    },
  }),
  (Mesh.plane = function (e) {
    e = e || {};
    var t = new Mesh(e);
    (detailX = e.detailX || e.detail || 1),
      (detailY = e.detailY || e.detail || 1);
    for (var r = 0; r <= detailY; r++)
      for (var a = r / detailY, n = 0; n <= detailX; n++) {
        var i = n / detailX;
        if (
          (t.vertices.push([2 * i - 1, 2 * a - 1, 0]),
          t.coords && t.coords.push([i, a]),
          t.normals && t.normals.push([0, 0, 1]),
          n < detailX && r < detailY)
        ) {
          var o = n + r * (detailX + 1);
          t.triangles.push([o, o + 1, o + detailX + 1]),
            t.triangles.push([o + detailX + 1, o + 1, o + detailX + 2]);
        }
      }
    return t.compile(), t;
  }),
  (Mesh.square = function (e, t, r, a) {
    var n = new Mesh();
    return (
      n.vertices.push([e.x, e.y, e.z]),
      n.vertices.push([t.x, t.y, t.z]),
      n.vertices.push([r.x, r.y, r.z]),
      n.vertices.push([a.x, a.y, a.z]),
      n.triangles.push([0, 1, 2]),
      n.triangles.push([2, 1, 3]),
      n.compile(),
      n
    );
  });
var cubeData = [
  [0, 4, 2, 6, -1, 0, 0],
  [1, 3, 5, 7, 1, 0, 0],
  [0, 1, 4, 5, 0, -1, 0],
  [2, 6, 3, 7, 0, 1, 0],
  [0, 2, 1, 3, 0, 0, -1],
  [4, 5, 6, 7, 0, 0, 1],
];
(Mesh.cube = function (e) {
  for (var t = new Mesh(e), r = 0; r < cubeData.length; r++) {
    for (var a = cubeData[r], n = 4 * r, i = 0; i < 4; i++) {
      var o = a[i];
      t.vertices.push(pickOctant(o).toArray()),
        t.coords && t.coords.push([1 & i, (2 & i) / 2]),
        t.normals && t.normals.push(a.slice(4, 7));
    }
    t.triangles.push([n, n + 1, n + 2]),
      t.triangles.push([n + 2, n + 1, n + 3]);
  }
  return t.compile(), t;
}),
  (Mesh.sphere = function (e) {
    function t(e, t, r) {
      return s ? [e, r, t] : [e, t, r];
    }
    function r(e) {
      return e + (e - e * e) / 2;
    }
    e = e || {};
    var a = new Mesh(e),
      n = new Indexer();
    detail = e.detail || 6;
    for (var i = 0; i < 8; i++)
      for (
        var o = pickOctant(i), s = o.x * o.y * o.z > 0, l = [], h = 0;
        h <= detail;
        h++
      ) {
        for (var c = 0; h + c <= detail; c++) {
          var u = h / detail,
            f = c / detail,
            m = (detail - h - c) / detail,
            d = {
              vertex: new Vector(r(u), r(f), r(m)).unit().multiply(o).toArray(),
            };
          a.coords && (d.coord = o.y > 0 ? [1 - u, m] : [m, 1 - u]),
            l.push(n.add(d));
        }
        if (h > 0)
          for (var g = 0; h + g <= detail; g++) {
            var x =
                (h - 1) * (detail + 1) + (h - 1 - (h - 1) * (h - 1)) / 2 + g,
              y = h * (detail + 1) + (h - h * h) / 2 + g;
            a.triangles.push(t(l[x], l[x + 1], l[y])),
              h + g < detail && a.triangles.push(t(l[y], l[x + 1], l[y + 1]));
          }
      }
    return (
      (a.vertices = n.unique.map(function (e) {
        return e.vertex;
      })),
      a.coords &&
        (a.coords = n.unique.map(function (e) {
          return e.coord;
        })),
      a.normals && (a.normals = a.vertices),
      a.compile(),
      a
    );
  });
var LIGHTGL_PREFIX = "LIGHTGL",
  tempMatrix = new Matrix(),
  resultMatrix = new Matrix();
(Shader.prototype = {
  uniforms: function (e) {
    gl.useProgram(this.program);
    for (var t in e) {
      var r =
        this.uniformLocations[t] || gl.getUniformLocation(this.program, t);
      if (r) {
        this.uniformLocations[t] = r;
        var a = e[t];
        if (
          (a instanceof Vector
            ? (a = [a.x, a.y, a.z])
            : a instanceof Matrix && (a = a.m),
          isArray(a))
        )
          switch (a.length) {
            case 1:
              gl.uniform1fv(r, new Float32Array(a));
              break;
            case 2:
              gl.uniform2fv(r, new Float32Array(a));
              break;
            case 3:
              gl.uniform3fv(r, new Float32Array(a));
              break;
            case 4:
              gl.uniform4fv(r, new Float32Array(a));
              break;
            case 9:
              gl.uniformMatrix3fv(
                r,
                !1,
                new Float32Array([
                  a[0],
                  a[3],
                  a[6],
                  a[1],
                  a[4],
                  a[7],
                  a[2],
                  a[5],
                  a[8],
                ])
              );
              break;
            case 16:
              gl.uniformMatrix4fv(
                r,
                !1,
                new Float32Array([
                  a[0],
                  a[4],
                  a[8],
                  a[12],
                  a[1],
                  a[5],
                  a[9],
                  a[13],
                  a[2],
                  a[6],
                  a[10],
                  a[14],
                  a[3],
                  a[7],
                  a[11],
                  a[15],
                ])
              );
              break;
            default:
              throw new Error(
                "don't know how to load uniform \"" +
                  t +
                  '" of length ' +
                  a.length
              );
          }
        else {
          if (!isNumber(a))
            throw new Error(
              'attempted to set uniform "' + t + '" to invalid value ' + a
            );
          (this.isSampler[t] ? gl.uniform1i : gl.uniform1f).call(gl, r, a);
        }
      }
    }
    return this;
  },
  draw: function (e, t) {
    this.drawBuffers(
      e.vertexBuffers,
      e.indexBuffers[t === gl.LINES ? "lines" : "triangles"],
      arguments.length < 2 ? gl.TRIANGLES : t
    );
  },
  drawBuffers: function (e, t, r) {
    var a = this.usedMatrices,
      n = gl.modelviewMatrix,
      i = gl.projectionMatrix,
      o = a.MVMI || a.NM ? n.inverse() : null,
      s = a.PMI ? i.inverse() : null,
      l = a.MVPM || a.MVPMI ? i.multiply(n) : null,
      h = {};
    if (
      (a.MVM && (h[a.MVM] = n),
      a.MVMI && (h[a.MVMI] = o),
      a.PM && (h[a.PM] = i),
      a.PMI && (h[a.PMI] = s),
      a.MVPM && (h[a.MVPM] = l),
      a.MVPMI && (h[a.MVPMI] = l.inverse()),
      a.NM)
    ) {
      var c = o.m;
      h[a.NM] = [c[0], c[4], c[8], c[1], c[5], c[9], c[2], c[6], c[10]];
    }
    this.uniforms(h);
    var u = 0;
    for (var f in e) {
      var m = e[f],
        d =
          this.attributes[f] ||
          gl.getAttribLocation(
            this.program,
            f.replace(/^(gl_.*)$/, LIGHTGL_PREFIX + "$1")
          );
      d !== -1 &&
        m.buffer &&
        ((this.attributes[f] = d),
        gl.bindBuffer(gl.ARRAY_BUFFER, m.buffer),
        gl.enableVertexAttribArray(d),
        gl.vertexAttribPointer(d, m.buffer.spacing, gl.FLOAT, !1, 0, 0),
        (u = m.buffer.length / m.buffer.spacing));
    }
    for (var g in this.attributes)
      g in e || gl.disableVertexAttribArray(this.attributes[g]);
    return (
      !u ||
        (t && !t.buffer) ||
        (t
          ? (gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, t.buffer),
            gl.drawElements(r, t.buffer.length, gl.UNSIGNED_SHORT, 0))
          : gl.drawArrays(r, 0, u)),
      this
    );
  },
}),
  (Vector.prototype = {
    set: function (e, t, r) {
      (this.x = e), (this.y = t), (this.z = r);
    },
    negative: function () {
      return new Vector(-this.x, -this.y, -this.z);
    },
    add: function (e) {
      return e instanceof Vector
        ? new Vector(this.x + e.x, this.y + e.y, this.z + e.z)
        : new Vector(this.x + e, this.y + e, this.z + e);
    },
    subtract: function (e) {
      return e instanceof Vector
        ? new Vector(this.x - e.x, this.y - e.y, this.z - e.z)
        : new Vector(this.x - e, this.y - e, this.z - e);
    },
    multiply: function (e) {
      return e instanceof Vector
        ? new Vector(this.x * e.x, this.y * e.y, this.z * e.z)
        : new Vector(this.x * e, this.y * e, this.z * e);
    },
    divide: function (e) {
      return e instanceof Vector
        ? new Vector(this.x / e.x, this.y / e.y, this.z / e.z)
        : new Vector(this.x / e, this.y / e, this.z / e);
    },
    equals: function (e) {
      return this.x === e.x && this.y === e.y && this.z === e.z;
    },
    dot: function (e) {
      return this.x * e.x + this.y * e.y + this.z * e.z;
    },
    cross: function (e) {
      return new Vector(
        this.y * e.z - this.z * e.y,
        this.z * e.x - this.x * e.z,
        this.x * e.y - this.y * e.x
      );
    },
    length: function () {
      return Math.sqrt(this.dot(this));
    },
    unit: function () {
      return this.divide(this.length());
    },
    min: function () {
      return Math.min(Math.min(this.x, this.y), this.z);
    },
    max: function () {
      return Math.max(Math.max(this.x, this.y), this.z);
    },
    toArray: function (e) {
      return [this.x, this.y, this.z].slice(0, e || 3);
    },
    clone: function () {
      return new Vector(this.x, this.y, this.z);
    },
    init: function (e, t, r) {
      return (this.x = e), (this.y = t), (this.z = r), this;
    },
  }),
  (Vector.negative = function (e, t) {
    return (t.x = -e.x), (t.y = -e.y), (t.z = -e.z), t;
  }),
  (Vector.add = function (e, t, r) {
    return (
      t instanceof Vector
        ? ((r.x = e.x + t.x), (r.y = e.y + t.y), (r.z = e.z + t.z))
        : ((r.x = e.x + t), (r.y = e.y + t), (r.z = e.z + t)),
      r
    );
  }),
  (Vector.subtract = function (e, t, r) {
    return (
      t instanceof Vector
        ? ((r.x = e.x - t.x), (r.y = e.y - t.y), (r.z = e.z - t.z))
        : ((r.x = e.x - t), (r.y = e.y - t), (r.z = e.z - t)),
      r
    );
  }),
  (Vector.scale = function (e, t) {
    (e.x *= t), (e.y *= t), (e.z *= t);
  }),
  (Vector.multiply = function (e, t, r) {
    return (
      t instanceof Vector
        ? ((r.x = e.x * t.x), (r.y = e.y * t.y), (r.z = e.z * t.z))
        : ((r.x = e.x * t), (r.y = e.y * t), (r.z = e.z * t)),
      r
    );
  }),
  (Vector.divide = function (e, t, r) {
    return (
      t instanceof Vector
        ? ((r.x = e.x / t.x), (r.y = e.y / t.y), (r.z = e.z / t.z))
        : ((r.x = e.x / t), (r.y = e.y / t), (r.z = e.z / t)),
      r
    );
  }),
  (Vector.cross = function (e, t, r) {
    return (
      (r.x = e.y * t.z - e.z * t.y),
      (r.y = e.z * t.x - e.x * t.z),
      (r.z = e.x * t.y - e.y * t.x),
      r
    );
  }),
  (Vector.unit = function (e, t) {
    var r = e.length();
    return (t.x = e.x / r), (t.y = e.y / r), (t.z = e.z / r), t;
  }),
  (Vector.fromAngles = function (e, t) {
    return new Vector(
      Math.cos(e) * Math.cos(t),
      Math.sin(t),
      Math.sin(e) * Math.cos(t)
    );
  }),
  (Vector.min = function (e, t) {
    return new Vector(
      Math.min(e.x, t.x),
      Math.min(e.y, t.y),
      Math.min(e.z, t.z)
    );
  }),
  (Vector.max = function (e, t) {
    return new Vector(
      Math.max(e.x, t.x),
      Math.max(e.y, t.y),
      Math.max(e.z, t.z)
    );
  }),
  (Vector.lerp = function (e, t, r) {
    return r > 1 ? t : t.subtract(e).multiply(r).add(e);
  }),
  (Vector.fromArray = function (e) {
    return new Vector(e[0], e[1], e[2]);
  }),
  (Vector.distance = function (e, t) {
    var r = e.x - t.x,
      a = e.y - t.y,
      n = e.z - t.z;
    return Math.sqrt(r * r + a * a + n * n);
  });
var gl,
  GL = {
    create: function (e) {
      e = e || {};
      var t = document.createElement("canvas");
      (t.width = 800), (t.height = 600), "alpha" in e || (e.alpha = !1);
      try {
        gl = t.getContext("webgl", e);
      } catch (e) {
        console.log(e);
      }
      try {
        gl = t.getContext("experimental-webgl", e);
      } catch (e) {
        console.log(e);
      }
      if (!gl) throw new Error("WebGL not supported");
      return (
        (gl.HALF_FLOAT_OES = 36193),
        addMatrixStack(),
        addEventListeners(),
        addOtherMethods(),
        gl
      );
    },
    keys: {},
    Matrix: Matrix,
    Indexer: Indexer,
    Buffer: Buffer,
    Mesh: Mesh,
    Shader: Shader,
    Vector: Vector,
  };
on(document, "keydown", function (e) {
  if (!e.altKey && !e.ctrlKey && !e.metaKey) {
    var t = mapKeyCode(e.keyCode);
    t && (GL.keys[t] = !0), (GL.keys[e.keyCode] = !0);
  }
}),
  on(document, "keyup", function (e) {
    if (!e.altKey && !e.ctrlKey && !e.metaKey) {
      var t = mapKeyCode(e.keyCode);
      t && (GL.keys[t] = !1), (GL.keys[e.keyCode] = !1);
    }
  });
var ENUM = 305397760,
  isLocked = !1,
  arrayBullets = null,
  arrayParticles = null,
  arrayBoxEnemies = null,
  hitLineLifeSpan = 0.15,
  arrayHitLines = null,
  blockSize = 4,
  arrayMaze = null,
  fristMazeBlock = null,
  lastMazeBlock = null,
  currentLevel = 1,
  currentLevelIsReady = !1,
  angleX = 0,
  angleY = 0,
  joggingAngle = 0,
  hero = null,
  gunCoolDown = 1,
  meshParticles = null,
  lastStep = 0,
  gl = GL.create(),
  pointerlockchange = function () {
    var e =
      document.mozPointerLockElement ||
      document.webkitPointerLockElement ||
      document.msPointerLockElement ||
      document.pointerLockElement ||
      null;
    isLocked = !!e;
  },
  createParticlesAndLaserForShot = function (e) {
    var t = new GL.Matrix();
    t = GL.Matrix.rotate(angleY, 0, 1, 0, t);
    var r = t.transformVector(new GL.Vector(-0.05, -0.5, 0)),
      a = t.transformVector(new GL.Vector(0.05, -0.5, 0));
    arrayHitLines.push(
      new HitLine(hero.Camera.add(r), hero.Camera.add(a), e, e, hitLineLifeSpan)
    ),
      hero.addCameraShakeEffect();
    for (var n = 0; n < 10; n++) {
      var i = new Particle({
        acc: new GL.Vector(0, -9.81, 0),
        vec: new GL.Vector(
          getRandom(-2, 2),
          getRandom(-2, 2),
          getRandom(-2, 2)
        ),
        loc: e,
        lifespan: 1.5,
      });
      arrayParticles.push(i);
    }
  },
  loadCurrentLevel = function () {
    (currentLevelIsReady = !1),
      (arrayBullets = new Array()),
      (arrayParticles = new Array()),
      (arrayBoxEnemies = new Array()),
      (arrayHitLines = new Array()),
      (arrayMaze = new Array()),
      (fristMazeBlock = null),
      (lastMazeBlock = null),
      (angleX = 0),
      (angleY = 0),
      (joggingAngle = 0),
      (hero = new Hero()),
      (hero.Camera = new GL.Vector(0, 2, 0)),
      (mazeCL = 3 + this.currentLevel),
      (mazeObj = newMaze(mazeCL, mazeCL));
    for (var e = 0; e < mazeCL; e++)
      for (var t = 0; t < mazeCL; t++) {
        var r = new MazeBlock();
        r.init(mazeObj[e][t], new GL.Vector(e * blockSize, -1, t * blockSize)),
          arrayMaze.push(r);
      }
    (fristMazeBlock = arrayMaze[0]),
      (lastMazeBlock = arrayMaze[arrayMaze.length - 1]);
    for (var a = (mazeCL / 3) >> 0, n = 0; n < a; n++) {
      var i = getRandomInt(1, arrayMaze.length),
        o = getRandom(2, 8),
        s = getRandom(2, 8),
        l = getRandom(5, 10);
      arrayBoxEnemies.push(
        new BoxEnemy(
          new GL.Vector(arrayMaze[i].Center.x, 2, arrayMaze[i].Center.z),
          arrayMaze,
          blockSize,
          o,
          s,
          l,
          hero
        )
      );
    }
    (meshPortal = GL.Mesh.sphere({ normals: !0, coords: !0 })
      .transform(GL.Matrix.scale(2, 2, 2))
      .transform(
        GL.Matrix.translate(lastMazeBlock.Center.x, 2, lastMazeBlock.Center.z)
      )
      .computeNormals()),
      (meshPortalAABB = meshPortal.getAABB());
    var h = document.getElementById("levelDescription");
    (h.style.display = "block"),
      1 === currentLevel
        ? (h.innerHTML = "Welcome to Lost in the Maze")
        : (h.innerHTML = "Level " + currentLevel),
      (document.cookie = "currentLevel=" + currentLevel),
      setTimeout(function () {
        var e = document.getElementById("levelDescription");
        e.style.display = "none";
      }, 5e3),
      (currentLevelIsReady = !0);
  },
  shader = new GL.Shader("vertex-Maze", "fragment-Maze"),
  shaderEnemies = new GL.Shader("vertex-Enemy", "fragment-Enemy"),
  shaderPortal = new GL.Shader("vertex-Portal", "fragment-Portal"),
  shaderBullets = new GL.Shader("vertex-Enemy", "fragment-Enemy"),
  shaderHitLines = new GL.Shader("vertex-hitline", "fragment-hitline");
(gl.canvas.onclick = function () {
  if (isLocked) {
    if (gunCoolDown > 0) return;
    var e = GL.Vector.fromAngles(
        ((90 - angleY) * Math.PI) / 180,
        ((180 - angleX) * Math.PI) / 180
      ),
      t = hero.Camera.add(e.multiply(2)),
      r = new GL.Vector(0, 0, 0);
    GL.Vector.subtract(hero.Camera, t, r);
    const a = new Float32Array([hero.Camera.x, hero.Camera.y, hero.Camera.z]),
      n = new Float32Array([r.x, r.y, r.z]);
    for (
      var i = Number.MAX_SAFE_INTEGER, o = null, s = null, l = null, h = 0;
      h < arrayMaze.length;
      h++
    ) {
      var c = intersection(a, n, arrayMaze[h].AABB);
      if (null !== c)
        for (var u = 0; u < arrayMaze[h].ArrayAABBs.length; u++) {
          var f = intersection(a, n, arrayMaze[h].ArrayAABBs[u]);
          if (null !== f) {
            var m = hero.Camera.subtract(t),
              d = hero.Camera.subtract(f),
              g = m.dot(d);
            if (g > 0) {
              var x = GL.Vector.distance(hero.Camera, f);
              x < i && ((i = x), (o = f));
            }
          }
        }
    }
    for (var y = 0; y < arrayBoxEnemies.length; y++) {
      var p = intersection(a, n, arrayBoxEnemies[y].mesh.getAABB());
      if (null !== p) {
        var v = hero.Camera.subtract(t),
          M = hero.Camera.subtract(p),
          L = v.dot(M);
        if (L > 0) {
          var A = GL.Vector.distance(hero.Camera, p);
          A < i && ((i = A), (o = null), (s = p), (l = arrayBoxEnemies[y]));
        }
      }
    }
    if (null !== o) {
      var w = GL.Mesh.sphere({ normals: !0, coords: !0 })
        .transform(GL.Matrix.scale(0.25, 0.25, 0.25))
        .transform(GL.Matrix.translate(o.x, o.y, o.z))
        .computeNormals();
      arrayBullets.push(w),
        createParticlesAndLaserForShot(o),
        (gunCoolDown = 1);
    } else
      null !== l &&
        null !== s &&
        (l.takeHit(), createParticlesAndLaserForShot(s), (gunCoolDown = 1));
  } else
    (gl.canvas.requestPointerLock =
      gl.canvas.requestPointerLock ||
      gl.canvas.mozRequestPointerLock ||
      gl.canvas.webkitRequestPointerLock),
      gl.canvas.requestPointerLock();
}),
  (gl.onmousemove = function (e) {
    (isLocked || e.dragging) &&
      ((angleY -= 0.25 * e.deltaX),
      (angleX = Math.max(-90, Math.min(90, angleX - 0.25 * e.deltaY))));
  }),
  (gl.onupdate = function (e) {
    if (((lastStep += e), currentLevelIsReady)) {
      gunCoolDown > 0 && (gunCoolDown -= e);
      var t = 6 * e,
        r = hero.Camera.clone(),
        a = GL.keys.W | GL.keys.UP,
        n = GL.keys.S | GL.keys.DOWN,
        i = GL.Vector.fromAngles(
          ((90 - angleY) * Math.PI) / 180,
          ((180 - angleX) * Math.PI) / 180
        );
      r = r.add(i.multiply(t * (a - n)));
      var o = GL.keys.A | GL.keys.LEFT,
        s = GL.keys.D | GL.keys.RIGHT,
        l = GL.Vector.fromAngles((-angleY * Math.PI) / 180, 0);
      r = r.add(l.multiply(t * (s - o)));
      for (var h = 0; h < arrayParticles.length; h++)
        arrayParticles[h].update(e);
      removeIsDeadArray(arrayParticles);
      for (var c = 0; c < arrayHitLines.length; c++) arrayHitLines[c].update(e);
      removeIsDeadArray(arrayHitLines);
      for (var u = 0; u < arrayBoxEnemies.length; u++)
        arrayBoxEnemies[u].update(e);
      if (
        (removeIsDeadArray(arrayBoxEnemies),
        pointInAABB(hero.Camera, meshPortalAABB))
      )
        return currentLevel++, void loadCurrentLevel();
      if (hero.isDead()) {
        currentLevelIsReady = !1;
        var f = document.getElementById("levelDescription");
        return (
          (f.style.display = "block"),
          (f.innerHTML = "HASTED"),
          void setTimeout(function () {
            var e = document.getElementById("levelDescription");
            (e.style.display = "none"), loadCurrentLevel();
          }, 5e3)
        );
      }
      for (var m = !1, d = !1, g = 0; g < arrayMaze.length; g++)
        if (GL.Vector.distance(r, arrayMaze[g].Center) <= 10)
          for (var x = 0; x < arrayMaze[g].ArrayAABBs.length; x++)
            inteceptCircleLineSeg(
              r,
              arrayMaze[g].ArrayAABBs[x].min,
              arrayMaze[g].ArrayAABBs[x].max,
              1
            ) &&
              (0 === arrayMaze[g].ArrayAABBs[x].Plane && (d = !0),
              1 === arrayMaze[g].ArrayAABBs[x].Plane && (m = !0),
              2 === arrayMaze[g].ArrayAABBs[x].Plane && (d = !0),
              3 === arrayMaze[g].ArrayAABBs[x].Plane && (m = !0));
      m && (r.z = hero.Camera.z),
        d && (r.x = hero.Camera.x),
        (hero.Camera = r),
        (a || n || o || s) &&
          ((joggingAngle += 600 * e),
          (hero.Camera.y = 2 + Math.sin(degToRad(joggingAngle)) / 20)),
        hero.update(e);
    }
  }),
  (gl.ondraw = function () {
    if (currentLevelIsReady) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
        gl.loadIdentity(),
        gl.rotate(-angleX, 1, 0, 0),
        gl.rotate(-angleY, 0, 1, 0),
        gl.translate(-hero.Camera.x, -hero.Camera.y, -hero.Camera.z);
      var e = GL.Vector.distance(fristMazeBlock.Center, lastMazeBlock.Center),
        t = GL.Vector.distance(hero.Camera, lastMazeBlock.Center),
        r = 100 - (100 * t) / e;
      r < 10 && (r = 10);
      for (var a = 0; a < arrayMaze.length; a++)
        for (var n = 0; n < arrayMaze[a].ArrayObjects.length; n++)
          shader
            .uniforms({ brightness: r })
            .draw(arrayMaze[a].ArrayObjects[n], gl.TRIANGLES);
      for (var i = 0; i < arrayBullets.length; i++)
        shaderBullets
          .uniforms({ time: lastStep, color: new GL.Vector(1, 0.25, 0.25) })
          .draw(arrayBullets[i], gl.TRIANGLES);
      for (var o = 0; o < arrayParticles.length; o++)
        meshParticles.transform(
          GL.Matrix.translate(
            arrayParticles[o].loc.x,
            arrayParticles[o].loc.y,
            arrayParticles[o].loc.z
          )
        ),
          shaderEnemies
            .uniforms({ time: lastStep, color: new GL.Vector(1, 1, 1) })
            .draw(meshParticles, gl.TRIANGLES);
      for (var s = 0; s < arrayBoxEnemies.length; s++)
        shaderEnemies
          .uniforms({ time: lastStep, color: arrayBoxEnemies[s].color })
          .draw(arrayBoxEnemies[s].mesh, gl.TRIANGLES);
      for (var l = 0; l < arrayBoxEnemies.length; l++)
        for (var h = 0; h < arrayBoxEnemies[l].fireSpheres.length; h++)
          shaderEnemies
            .uniforms({ time: lastStep, color: arrayBoxEnemies[l].color })
            .draw(arrayBoxEnemies[l].fireSpheres[h].mesh, gl.TRIANGLES);
      for (var c = 0; c < arrayHitLines.length; c++)
        shaderHitLines.uniforms().draw(arrayHitLines[c].mesh, gl.TRIANGLES);
      shaderPortal.uniforms({ time: lastStep }).draw(meshPortal, gl.TRIANGLES);
    }
  }),
  gl.fullscreen(),
  gl.animate(),
  gl.enable(gl.CULL_FACE),
  gl.enable(gl.POLYGON_OFFSET_FILL),
  gl.polygonOffset(1, 1),
  gl.clearColor(0.8, 0.8, 0.8, 1),
  gl.enable(gl.DEPTH_TEST);
