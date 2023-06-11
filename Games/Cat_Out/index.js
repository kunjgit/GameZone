!(function () {
  "use strict";
  var t =
      "uniform mat4 projection;attribute vec2 vertexPosition;attribute vec2 vertexTexCoord;varying vec2 texCoord;varying float tint;void main(){gl_PointSize=128.0;gl_Position=projection*vec4(vertexPosition,0.0,1.0);texCoord=vertexTexCoord;}",
    e =
      "precision highp float;uniform sampler2D tex;varying vec2 texCoord;void main(){vec2 texCoord=mix((vec2(16.0)*texCoord)/vec2(80.0,32.0),(vec2(16.0)*(texCoord+vec2(1.0)))/vec2(80.0,32.0),gl_PointCoord);gl_FragColor=texture2D(tex,texCoord);if(gl_FragColor.a<0.1){discard;}}";
  class s {
    constructor(s, r) {
      this.gl = s;
      const i = s.createShader(s.VERTEX_SHADER);
      s.shaderSource(i, t), s.compileShader(i);
      const h = s.createShader(s.FRAGMENT_SHADER);
      s.shaderSource(h, e),
        s.compileShader(h),
        (this.program = s.createProgram()),
        s.attachShader(this.program, i),
        s.attachShader(this.program, h),
        s.linkProgram(this.program),
        (this.projection = s.getUniformLocation(this.program, "projection")),
        (this.vertexPosition = s.getAttribLocation(
          this.program,
          "vertexPosition"
        )),
        (this.vertexTexCoord = s.getAttribLocation(
          this.program,
          "vertexTexCoord"
        )),
        s.useProgram(this.program),
        this.gl.uniformMatrix4fv(this.projection, !1, r);
    }
    use() {
      this.gl.enableVertexAttribArray(this.vertexPosition),
        this.gl.enableVertexAttribArray(this.vertexTexCoord),
        this.gl.vertexAttribPointer(
          this.vertexPosition,
          2,
          this.gl.FLOAT,
          !1,
          16,
          0
        ),
        this.gl.vertexAttribPointer(
          this.vertexTexCoord,
          2,
          this.gl.FLOAT,
          !1,
          16,
          8
        );
    }
  }
  class r {
    constructor() {
      (this.canvasContainer = document.createElement("div")),
        (this.canvasContainer.id = "canvas-container"),
        document.body.appendChild(this.canvasContainer),
        (this.canvas = document.createElement("canvas")),
        (this.canvas.width = 1024),
        (this.canvas.height = 600),
        (this.gl = this.canvas.getContext("webgl")),
        this.gl.clearColor(0, 0.63, 1, 1),
        this.gl.enable(this.gl.BLEND),
        this.canvasContainer.appendChild(this.canvas),
        (this.textCanvas = document.createElement("canvas")),
        (this.textCanvas.id = "text-canvas"),
        (this.textCanvas.width = 1024),
        (this.textCanvas.height = 600),
        (this.textContext = this.textCanvas.getContext("2d")),
        (this.textContext.font = "48px Verdana, Arial, Helvetica, sans-serif"),
        (this.textContext.textAlign = "center"),
        (this.textContext.fillStyle = "white"),
        this.canvasContainer.appendChild(this.textCanvas),
        (this.projection = new Float32Array([
          2 / 1024,
          0,
          0,
          0,
          0,
          -2 / 600,
          0,
          0,
          0,
          0,
          -1,
          0,
          -1,
          1,
          0,
          1,
        ])),
        (this.shader = new s(this.gl, this.projection)),
        (this.texture = this.gl.createTexture()),
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture),
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          1,
          1,
          0,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          new Uint8Array([0, 0, 255, 255])
        ),
        this.setUpTexture();
      const t = new Image();
      t.addEventListener("load", () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture),
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            t
          ),
          this.setUpTexture();
      }),
        (t.crossOrigin = ""),
        (t.src = "textures/tiles.png");
    }
    setUpTexture() {
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_T,
          this.gl.CLAMP_TO_EDGE
        ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MIN_FILTER,
          this.gl.NEAREST
        ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MAG_FILTER,
          this.gl.NEAREST
        );
    }
    clear() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT),
        this.textContext.clearRect(0, 0, 1024, 600);
    }
    draw(t) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, t),
        this.shader.use(),
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
    drawText(t, e, s, r = 4) {
      (this.textContext.fillStyle = "black"),
        this.textContext.fillText(t, e - r, s - r),
        (this.textContext.fillStyle = "white"),
        this.textContext.fillText(t, e, s);
    }
  }
  class i {
    constructor() {
      (this.spacePressed = !1),
        (this.lastPressed = !1),
        (this.justPressed = !1),
        addEventListener("keydown", (t) => {
          32 == t.keyCode && ((this.spacePressed = !0), t.preventDefault());
        }),
        addEventListener("keyup", (t) => {
          32 == t.keyCode && ((this.spacePressed = !1), t.preventDefault());
        });
    }
    update() {
      (this.justPressed = !this.lastPressed && this.spacePressed),
        (this.lastPressed = this.spacePressed);
    }
  }
  class h {
    constructor() {
      this.audioContext = new AudioContext();
    }
    play(t, e, s, r) {
      const i = this.audioContext.createOscillator(),
        h = this.audioContext.createGain();
      (i.type = t),
        i.frequency.setValueAtTime(e, this.audioContext.currentTime),
        i.frequency.exponentialRampToValueAtTime(
          s,
          this.audioContext.currentTime + r
        ),
        h.gain.setValueAtTime(0.2, this.audioContext.currentTime),
        h.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + r
        ),
        i.connect(h),
        h.connect(this.audioContext.destination),
        i.start(),
        i.stop(this.audioContext.currentTime + r);
    }
  }
  class a {
    constructor(t, e, s, r, i) {
      (this.renderer = t),
        (this.vertices = new Float32Array([e, s, r, i])),
        (this.vertexBuffer = t.gl.createBuffer()),
        this.updateBuffer();
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(
        this.renderer.gl.ARRAY_BUFFER,
        this.vertexBuffer
      ),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    draw() {
      this.renderer.draw(this.vertexBuffer);
    }
  }
  class n extends a {
    constructor(t, e, s, r, i, h, a, n) {
      super(t, i, h, a, n),
        (this.input = e),
        (this.audio = s),
        (this.game = r),
        (this.timer = 0),
        (this.x = i),
        (this.y = h),
        (this.dy = 0),
        (this.ay = 0);
    }
    update(t, e, s) {
      (this.timer += 1e3 / 60),
        this.timer >= 25e3 / t &&
          410 === this.y &&
          ((this.timer = 0),
          (this.vertices[2] = 0 === this.vertices[2] ? 1 : 0),
          this.audio.play("sawtooth", 200, 300, 0.2)),
        this.input.justPressed &&
          410 === this.y &&
          ((this.dy = -22),
          (this.ay = 1),
          this.audio.play("square", 400, 600, 0.5)),
        (this.dy += this.ay),
        (this.y += this.dy),
        (this.vertices[1] = Math.round(this.y)),
        this.y >= 410 && ((this.y = 410), (this.ay = 0), (this.dy = 0)),
        this.updateBuffer();
      for (const t of e)
        if (Math.abs(t.x - this.x) < 100 && Math.abs(t.y - this.y) < 100)
          return this.audio.play("square", 500, 300, 0.5), !0;
      for (const t of s)
        Math.abs(t.x - this.x) < 100 &&
          Math.abs(t.y - this.y) < 100 &&
          ((t.active = !1),
          this.audio.play("triangle", 600, 800, 0.5),
          (this.game.score += 100));
      return !1;
    }
  }
  let o = null;
  class d {
    constructor(t, e, s) {
      (this.renderer = t),
        (this.vertices = new Float32Array([e, s, 2, 0])),
        o || (o = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = e),
        (this.y = s);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, o),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.x -= t / 15), (this.vertices[0] = Math.round(this.x));
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(o);
    }
  }
  let l = null;
  class c {
    constructor(t, e, s) {
      (this.renderer = t),
        (this.vertices = new Float32Array([e, s, 3, 0])),
        l || (l = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = e),
        (this.y = s),
        (this.dy = -30),
        (this.ay = 1),
        (this.active = !0);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, l),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.x -= t / 15),
        (this.dy += this.ay),
        (this.y += this.dy),
        (this.vertices[0] = Math.round(this.x)),
        (this.vertices[1] = Math.round(this.y)),
        (this.vertices[3] = this.dy < 0 ? 0 : 1),
        (this.y > 500 || this.x < -150) && (this.active = !1);
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(l);
    }
  }
  let u = null;
  class x {
    constructor(t, e, s, r) {
      (this.renderer = t),
        (this.game = e),
        (this.vertices = new Float32Array([s, r, 2, 1])),
        u || (u = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = s),
        (this.y = r),
        (this.launch = 1e3 * Math.random()),
        (this.launched = !1);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, u),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.x -= t / 15),
        (this.vertices[0] = Math.round(this.x)),
        (this.launch -= 1e3 / 60),
        !this.launched &&
          this.launch <= 0 &&
          (this.game.bonuses.push(new c(this.renderer, this.x, this.y - 50)),
          (this.launched = !0));
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(u);
    }
  }
  let f = null;
  class g {
    constructor(t, e, s) {
      (this.renderer = t),
        (this.vertices = new Float32Array([e, s, 0, 1])),
        f || (f = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = e),
        (this.y = s);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, f),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.x -= t / 15), (this.vertices[0] = Math.round(this.x));
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(f);
    }
  }
  let p = null;
  class A {
    constructor(t, e, s) {
      (this.renderer = t),
        (this.vertices = new Float32Array([
          Math.round(e),
          Math.round(s),
          1,
          1,
        ])),
        p || (p = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = e),
        (this.y = s);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, p),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.x -= t / 30), (this.vertices[0] = Math.round(this.x));
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(p);
    }
  }
  let v = null;
  class T {
    constructor(t, e, s) {
      (this.renderer = t),
        (this.vertices = new Float32Array([
          Math.round(e),
          Math.round(s),
          4,
          0,
        ])),
        v || (v = t.gl.createBuffer()),
        this.updateBuffer(),
        (this.x = e),
        (this.y = s),
        (this.timer = 0);
    }
    updateBuffer() {
      this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, v),
        this.renderer.gl.bufferData(
          this.renderer.gl.ARRAY_BUFFER,
          this.vertices,
          this.renderer.gl.STATIC_DRAW
        );
    }
    update(t) {
      (this.timer += 1e3 / 60),
        this.timer >= 400 &&
          ((this.timer = 0),
          (this.vertices[3] = 0 === this.vertices[3] ? 1 : 0)),
        (this.x -= t / 22),
        (this.vertices[0] = Math.round(this.x));
    }
    draw() {
      this.updateBuffer(), this.renderer.draw(v);
    }
  }
  new (class {
    constructor() {
      (this.renderer = new r()),
        (this.input = new i()),
        (this.audio = new h()),
        (this.tama = new n(
          this.renderer,
          this.input,
          this.audio,
          this,
          100,
          410,
          0,
          0
        )),
        (this.obstacles = []),
        (this.decorations = []),
        (this.bonuses = []),
        (this.lastTimestamp = 0),
        (this.timeAccumulator = 0),
        (this.speed = 100),
        (this.lastDecoration = 0),
        (this.lastObstacle = 0),
        (this.lastCloud = 0),
        (this.lastBird = 0),
        (this.score = 0),
        (this.bestScore = 0),
        (this.start = !0),
        (this.over = !1),
        (this.started = !1);
    }
    update(t) {
      requestAnimationFrame((t) => this.update(t));
      const e = t - this.lastTimestamp;
      if (((this.lastTimestamp = t), !(e > 2500))) {
        for (this.timeAccumulator += e; this.timeAccumulator >= 1e3 / 60; ) {
          for (
            this.input.update(),
              this.input.justPressed &&
                !this.started &&
                ((this.started = !0),
                (this.start = !1),
                (this.over = !1),
                (this.speed = 100),
                (this.lastObstacle = 0),
                (this.lastCloud = 0),
                (this.lastBird = 0),
                (this.score = 0),
                (this.obstacles = []),
                (this.bonuses = []));
            this.lastDecoration <= 1152;

          )
            this.decorations.push(
              new g(this.renderer, this.lastDecoration, 538)
            ),
              this.lastCloud++,
              this.lastCloud >= 5 &&
                Math.random() > 0.8 &&
                ((this.lastCloud = 0),
                this.decorations.push(
                  new A(
                    this.renderer,
                    this.lastDecoration,
                    100 + 150 * Math.random()
                  )
                )),
              this.lastBird++,
              this.lastBird >= 7 &&
                Math.random() > 0.5 &&
                ((this.lastBird = 0),
                this.decorations.push(
                  new T(
                    this.renderer,
                    this.lastDecoration,
                    100 + 150 * Math.random()
                  )
                )),
              (this.lastDecoration += 128);
          if (this.started) {
            for (const t of this.decorations) t.update(this.speed);
            this.decorations = this.decorations.filter((t) => t.x >= -130);
            for (const t of this.obstacles) t.update(this.speed);
            this.obstacles = this.obstacles.filter((t) => t.x >= -130);
            for (const t of this.bonuses) t.update(this.speed);
            if (
              ((this.bonuses = this.bonuses.filter((t) => t.active)),
              this.tama.update(this.speed, this.obstacles, this.bonuses) &&
                ((this.started = !1), (this.over = !0)),
              (this.lastDecoration -= this.speed / 15),
              this.lastObstacle++,
              this.lastObstacle > 80 && Math.random() > 0.8)
            ) {
              let t = 1 + Math.floor(this.speed / 180);
              for (let e = 0; e < t; e++)
                Math.random() < 0.66
                  ? this.obstacles.push(
                      new d(this.renderer, 1200 + 128 * e, 410)
                    )
                  : this.obstacles.push(
                      new x(this.renderer, this, 1200 + 128 * e, 498)
                    );
              this.lastObstacle = 0;
            }
            (this.speed += 0.1),
              (this.score += 0.1),
              this.score > this.bestScore && (this.bestScore = this.score),
              750 === this.speed && (this.speed = 750);
          }
          this.timeAccumulator -= 1e3 / 60;
        }
        this.renderer.clear();
        for (const t of this.decorations) t.draw();
        for (const t of this.obstacles) t.draw();
        for (const t of this.bonuses) t.draw();
        this.tama.draw(),
          this.start
            ? ((this.renderer.textContext.textAlign = "center"),
              (this.renderer.textContext.font =
                "92px Verdana, Arial, Helvetica, sans-serif"),
              this.renderer.drawText("CAT OUT!", 512, 100, 8),
              (this.renderer.textContext.font =
                "48px Verdana, Arial, Helvetica, sans-serif"),
              this.renderer.drawText("PRESS SPACE TO BEGIN", 512, 450))
            : this.over
            ? ((this.renderer.textContext.textAlign = "center"),
              (this.renderer.textContext.font =
                "92px Verdana, Arial, Helvetica, sans-serif"),
              this.renderer.drawText("GAME OVER!", 512, 100, 8),
              (this.renderer.textContext.font =
                "48px Verdana, Arial, Helvetica, sans-serif"),
              this.renderer.drawText(
                `FINAL SCORE: ${Math.round(this.score)}`,
                512,
                200
              ),
              this.score >= this.bestScore &&
                this.renderer.drawText("NEW HIGH SCORE!", 512, 260),
              this.renderer.drawText("PRESS SPACE TO TRY AGAIN", 512, 450))
            : ((this.renderer.textContext.font =
                "48px Verdana, Arial, Helvetica, sans-serif"),
              (this.renderer.textContext.textAlign = "left"),
              this.renderer.drawText(
                `SCORE: ${Math.round(this.score)}`,
                20,
                50
              ),
              (this.renderer.textContext.textAlign = "right"),
              this.renderer.drawText(
                `HIGH SCORE: ${Math.round(this.bestScore)}`,
                1004,
                50
              ));
      }
    }
    run() {
      requestAnimationFrame((t) => this.update(t));
    }
  })().run();
})();
