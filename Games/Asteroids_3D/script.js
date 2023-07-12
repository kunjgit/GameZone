/**
 * Easings
 */

// By easeings.net
function easeInExpo(x) {
   return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function easeOutExpo(x) {
   return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * Vector Operations
 */

const v3 = (x, y, z) =>
   y === undefined && z === undefined
      ? { x, y: x, z: x }
      : z === undefined
      ? { x, y, z: x }
      : { x, y, z };

const v3array = (v) => [v.x, v.y, v.z];
const v3add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const v3sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const v3xxx = (v) => v3(v.x);
const v3yyy = (v) => v3(v.y);
const v3zzz = (v) => v3(v.z);
const v3mul = (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s });
const v3div = (v, s) => ({ x: v.x / s, y: v.y / s, z: v.z / s });
const v3dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const v3normalize = (v) => v3div(v, v3mag(v));
const v3mag = (v) => Math.sqrt(v3dot(v, v));
const v3reflect = (v, n) => v3sub(v, v3mul(n, 2 * v3dot(v, n)));
const v3cross = (a, b) =>
   v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

/**
 * Asteroids 3D Software renderer
 */

const c = document.createElement("canvas").getContext("2d");
const { canvas } = c;

/**
 * v1, v2, v3, color, alpha
 * @type { Array<[number, number, number, number, number, number, number, number, number, string, number]> }
 */
let polygonBuffer = [];
const meshBuffer = [];
const objectBuffer = [];

const gameConfig = {
   score: 0,
   lives: 3,
   level: 1,
   planeDistance: 500
};

const renderConfig = {
   perspective: gameConfig.planeDistance,
   width: 800,
   height: 600,
   aspectRatio: 800 / 600,
   wireframe: true
};

const camera = {
   position: { x: 0, y: 0, z: -gameConfig.planeDistance },
   rotation: { x: 0, y: 0, z: 0 }
};

class Mesh {
   #_polygons = [];

   position = {
      x: 0,
      y: 0,
      z: 0
   };

   rotation = {
      x: 0,
      y: 0,
      z: 0
   };

   scale = {
      x: 1,
      y: 1,
      z: 1
   };

   alpha = 1;

   get polygons() {
      return this.#applyCameraTransformations(this.#applyTransformations());
   }

   constructor() {
      meshBuffer.push(this);
   }

   addPolygons(...polygons) {
      this.#_polygons.push(...polygons);
   }

   translate(x, y, z) {
      this.position.x += x;
      this.position.y += y;
      this.position.z += z;
   }

   rotate(x, y, z) {
      this.rotation.x += x;
      this.rotation.y += y;
      this.rotation.z += z;
   }

   destroy() {
      const index = meshBuffer.indexOf(this);

      if (index !== -1) {
         meshBuffer.splice(index, 1);
      }
   }

   #applyTransformations() {
      return this.applyTranslate(
         this.applyScale(this.applyRotation(this.#_polygons))
      );
   }

   #applyCameraTransformations(polygons) {
      return this.#applyCameraRotation(this.#applyCameraTranslate(polygons));
   }

   #applyCameraTranslate(polygons) {
      return this.applyTranslate(polygons, v3mul(camera.position, -1));
   }

   #applyCameraRotation(polygons) {
      const rotX = (polygons) => {
         const { x: rx } = camera.rotation;

         const sin = Math.sin(rx);
         const cos = Math.cos(rx);

         return polygons.map((polygon) => {
            const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

            return [
               x1,
               y1 * cos - z1 * sin,
               y1 * sin + z1 * cos,
               x2,
               y2 * cos - z2 * sin,
               y2 * sin + z2 * cos,
               x3,
               y3 * cos - z3 * sin,
               y3 * sin + z3 * cos,
               col,
               this.alpha
            ];
         });
      };

      const rotY = (polygons) => {
         const { y: ry } = camera.rotation;

         const sin = Math.sin(ry);
         const cos = Math.cos(ry);

         return polygons.map((polygon) => {
            const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

            return [
               x1 * cos + z1 * sin,
               y1,
               -x1 * sin + z1 * cos,
               x2 * cos + z2 * sin,
               y2,
               -x2 * sin + z2 * cos,
               x3 * cos + z3 * sin,
               y3,
               -x3 * sin + z3 * cos,
               col,
               this.alpha
            ];
         });
      };

      const rotZ = (polygons) => {
         const { z: rz } = camera.rotation;

         const sin = Math.sin(rz);
         const cos = Math.cos(rz);

         return polygons.map((polygon) => {
            const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

            return [
               x1 * cos - y1 * sin,
               x1 * sin + y1 * cos,
               z1,
               x2 * cos - y2 * sin,
               x2 * sin + y2 * cos,
               z2,
               x3 * cos - y3 * sin,
               x3 * sin + y3 * cos,
               z3,
               col,
               this.alpha
            ];
         });
      };

      return rotX(rotY(rotZ(polygons)));
   }

   applyTranslate(polygons, by) {
      const { x, y, z } = by || this.position;

      return polygons.map((polygon) => {
         const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

         return [
            x1 + x,
            y1 + y,
            z1 + z,
            x2 + x,
            y2 + y,
            z2 + z,
            x3 + x,
            y3 + y,
            z3 + z,
            col,
            this.alpha
         ];
      });
   }

   applyScale(polygons, by) {
      const { x, y, z } = by || this.scale;

      return polygons.map((polygon) => {
         const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

         return [
            x1 * x,
            y1 * y,
            z1 * z,
            x2 * x,
            y2 * y,
            z2 * z,
            x3 * x,
            y3 * y,
            z3 * z,
            col,
            this.alpha
         ];
      });
   }

   applyRotation(polygons, by) {
      const { x, y, z } = by || this.rotation;

      return this.applyRotateX(
         this.applyRotateY(this.applyRotateZ(polygons, z), y),
         x
      );
   }

   applyRotateX(polygons, rx) {
      rx = rx || this.rotation.x;

      const sin = Math.sin(rx);
      const cos = Math.cos(rx);

      return polygons.map((polygon) => {
         const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

         return [
            x1,
            y1 * cos - z1 * sin,
            y1 * sin + z1 * cos,
            x2,
            y2 * cos - z2 * sin,
            y2 * sin + z2 * cos,
            x3,
            y3 * cos - z3 * sin,
            y3 * sin + z3 * cos,
            col,
            this.alpha
         ];
      });
   }

   applyRotateY(polygons, ry) {
      ry = ry || this.rotation.y;

      const sin = Math.sin(ry);
      const cos = Math.cos(ry);

      return polygons.map((polygon) => {
         const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

         return [
            x1 * cos + z1 * sin,
            y1,
            -x1 * sin + z1 * cos,
            x2 * cos + z2 * sin,
            y2,
            -x2 * sin + z2 * cos,
            x3 * cos + z3 * sin,
            y3,
            -x3 * sin + z3 * cos,
            col,
            this.alpha
         ];
      });
   }

   applyRotateZ(polygons, rz) {
      rz = rz || this.rotation.z;

      const sin = Math.sin(rz);
      const cos = Math.cos(rz);

      return polygons.map((polygon) => {
         const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col] = polygon;

         return [
            x1 * cos - y1 * sin,
            x1 * sin + y1 * cos,
            z1,
            x2 * cos - y2 * sin,
            x2 * sin + y2 * cos,
            z2,
            x3 * cos - y3 * sin,
            x3 * sin + y3 * cos,
            z3,
            col,
            this.alpha
         ];
      });
   }
}

const clearBuffer = () => {
   polygonBuffer = [];
};

const polygonToScreenSpace = (polygon) => {
   const [x1, y1, z1, x2, y2, z2, x3, y3, z3, col, alpha] = polygon;

   const x1s = (x1 / z1) * renderConfig.perspective;
   const y1s = (y1 / z1) * renderConfig.perspective;
   const x2s = (x2 / z2) * renderConfig.perspective;
   const y2s = (y2 / z2) * renderConfig.perspective;
   const x3s = (x3 / z3) * renderConfig.perspective;
   const y3s = (y3 / z3) * renderConfig.perspective;

   return [x1s, y1s, x2s, y2s, x3s, y3s, col, alpha];
};

const renderPolygon = (polygon) => {
   const [x1s, y1s, x2s, y2s, x3s, y3s, col, alpha] = polygonToScreenSpace(
      polygon
   );

   const renderStyle = renderConfig.wireframe ? "stroke" : "fill";

   c.globalAlpha = alpha || 1;
   c[renderStyle + "Style"] = col;

   c.beginPath();
   c.moveTo(x1s, y1s);
   c.lineTo(x2s, y2s);
   c.lineTo(x3s, y3s);
   c.closePath();
   c[renderStyle]();

   c.globalAlpha = 1;
};

// Sort
const byAverageZ = (a, b) => {
   const az = getPolygonAverageZ(a);
   const bz = getPolygonAverageZ(b);

   return bz - az;
};

// Filter
const byAbleToRender = (polygon) => {
   const z1 = polygon[2];
   const z2 = polygon[5];
   const z3 = polygon[8];

   return z1 > 0 && z2 > 0 && z3 > 0;
};

const clearScreen = () => {
   c.fillStyle = "#111";
   c.fillRect(
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
   );
};

const renderBloom = () => {
   c.save();
   c.filter = `blur(8px)`;
   c.globalCompositeOperation = "lighten";
   c.drawImage(
      c.canvas,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
   );

   c.filter = `blur(32px)`;
   c.globalAlpha = GameManager.instance.getShake();
   c.drawImage(
      c.canvas,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
   );
   c.drawImage(
      c.canvas,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
   );
   c.restore();
};

const getPolygonAverageZ = (polygon) => {
   const z1 = polygon[2];
   const z2 = polygon[5];
   const z3 = polygon[8];

   return (z1 + z2 + z3) / 3;
};

const addPolygonsFromMeshes = () => {
   meshBuffer.forEach((mesh) => {
      const polygons = mesh.polygons;

      polygons.forEach((polygon) => {
         polygonBuffer.push(polygon);
      });
   });
};

const renderPolygons = () => {
   clearBuffer();
   addPolygonsFromMeshes();

   polygonBuffer.sort(byAverageZ).filter(byAbleToRender).forEach(renderPolygon);
};

const updateObjects = (dt) => {
   objectBuffer.forEach((object) => {
      object.update?.(dt);
   });
};

const setupCanvas = () => {
   canvas.width = 800;
   canvas.height = 600;

   c.translate(canvas.width / 2, canvas.height / 2);
};

let oldTimeStamp = 0;
const render = (timeStamp) => {
   requestAnimationFrame(render);

   const deltaTime = oldTimeStamp !== 0 ? (timeStamp - oldTimeStamp) / 1000 : 0;

   oldTimeStamp = timeStamp;

   clearScreen();
   renderPolygons();
   updateObjects(deltaTime);

   renderBloom();
};

const isPointOutOfCanvas = (x, y) => {
   return (
      x < -canvas.width / 2 ||
      x > canvas.width / 2 ||
      y < -canvas.height / 2 ||
      y > canvas.height / 2
   );
};

// Geometries
const createCubeMesh = (size, col) => {
   const polys = [];

   const halfSize = size / 2;

   const p1 = [-halfSize, -halfSize, -halfSize];
   const p2 = [-halfSize, +halfSize, -halfSize];
   const p3 = [+halfSize, +halfSize, -halfSize];
   const p4 = [+halfSize, -halfSize, -halfSize];

   const p5 = [-halfSize, -halfSize, +halfSize];
   const p6 = [-halfSize, +halfSize, +halfSize];
   const p7 = [+halfSize, +halfSize, +halfSize];
   const p8 = [+halfSize, -halfSize, +halfSize];

   polys.push(
      // front
      [...p1, ...p2, ...p3, col],
      [...p1, ...p3, ...p4, col],

      // back
      [...p5, ...p6, ...p7, col],
      [...p5, ...p7, ...p8, col],

      // left
      [...p1, ...p2, ...p6, col],
      [...p1, ...p6, ...p5, col],

      // right
      [...p4, ...p3, ...p7, col],
      [...p4, ...p7, ...p8, col],

      // top
      [...p2, ...p3, ...p7, col],
      [...p2, ...p7, ...p6, col],

      // bottom
      [...p1, ...p4, ...p8, col],
      [...p1, ...p8, ...p5, col]
   );

   return polys;
};

const createSphereGeometry = (radius, col) => {
   const vertices = [];
   const polys = [];

   const latitudes = 5;
   const longitudes = 5;

   for (let lat = 0; lat <= latitudes; lat++) {
      const theta = (lat * Math.PI) / latitudes;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longitudes; lon++) {
         const phi = (lon * 2 * Math.PI) / longitudes;
         const sinPhi = Math.sin(phi);
         const cosPhi = Math.cos(phi);

         const x = cosPhi * sinTheta;
         const y = cosTheta;
         const z = sinPhi * sinTheta;

         vertices.push([radius * x, radius * y, radius * z]);
      }
   }

   for (let lat = 0; lat < latitudes; lat++) {
      for (let lon = 0; lon < longitudes; lon++) {
         const first = lat * (longitudes + 1) + lon;
         const second = first + longitudes + 1;

         polys.push(
            [
               ...vertices[first],
               ...vertices[first + 1],
               ...vertices[second],
               col
            ],
            [
               ...vertices[first + 1],
               ...vertices[second + 1],
               ...vertices[second],
               col
            ]
         );
      }
   }

   return polys;
};

const createPyramidGeometry = (size, col) => {
   const halfSize = size / 2;

   const p1 = [-halfSize, -halfSize, -halfSize];
   const p2 = [-halfSize, +halfSize, -halfSize];
   const p3 = [+halfSize, +halfSize, -halfSize];
   const p4 = [+halfSize, -halfSize, -halfSize];

   const p5 = [0, 0, +halfSize];

   return [
      [...p1, ...p2, ...p3, col],
      [...p1, ...p3, ...p4, col],
      [...p1, ...p2, ...p5, col],
      [...p1, ...p4, ...p5, col],
      [...p2, ...p3, ...p5, col],
      [...p3, ...p4, ...p5, col]
   ];
};

const createPlaneGeometry = (width, height, col) => {
   const halfWidth = width / 2;
   const halfHeight = height / 2;

   const p1 = [-halfWidth, -halfHeight, 0];
   const p2 = [-halfWidth, +halfHeight, 0];
   const p3 = [+halfWidth, +halfHeight, 0];
   const p4 = [+halfWidth, -halfHeight, 0];

   return [
      [...p1, ...p2, ...p3, col],
      [...p1, ...p3, ...p4, col]
   ];
};

const animate = (cb, targetTime, onEnd) => {
   const start = performance.now();

   requestAnimationFrame(function animate(time) {
      const timeFraction = time - start;
      const progress = timeFraction / targetTime;

      cb(progress);

      if (progress < 1) {
         requestAnimationFrame(animate);
      } else {
         onEnd?.();
      }
   });
};

class Entity extends Mesh {
   constructor() {
      super();
      objectBuffer.push(this);
   }

   destroy() {
      super.destroy();
      const index = objectBuffer.indexOf(this);

      if (index !== -1) {
         objectBuffer.splice(index, 1);
      }
   }
}

class GameManager extends Entity {
   static instance;

   #time = 0;
   #shakeValue = 0;

   constructor() {
      if (GameManager.instance) return GameManager.instance;

      super();

      GameManager.instance = this;
   }

   update(dt) {
      this.#time += dt;

      this.updateCameraShake(dt);
   }

   updateCameraShake(dt) {
      camera.position.x = Math.sin(this.#time * 120) * this.#shakeValue;
      camera.position.y = Math.cos(this.#time * 100) * this.#shakeValue;

      this.#shakeValue -= this.#shakeValue * dt * 5;
   }

   getShake() {
      return this.#shakeValue;
   }

   addShake(val) {
      this.#shakeValue += val;
   }
}

class AsteroidPiece extends Entity {
   #velocity = v3(0);
   #scaleRange = 0.5;

   scale = {
      x: 1 + Math.random() * this.#scaleRange - this.#scaleRange / 2,
      y: 1 + Math.random() * this.#scaleRange - this.#scaleRange / 2,
      z: 1 + Math.random() * this.#scaleRange - this.#scaleRange / 2
   };

   constructor(impulseVector, size) {
      super();
      this.addPolygons(...createPyramidGeometry(size, "#900"));

      const impulseError = 10;

      const errorVector = v3mul(
         v3(Math.random(), Math.random(), Math.random()),
         impulseError
      );

      this.#velocity = v3add(this.#velocity, v3add(impulseVector, errorVector));
   }

   update(deltaTime) {
      this.translate(
         this.#velocity.x * deltaTime,
         this.#velocity.y * deltaTime,
         this.#velocity.z * deltaTime
      );

      this.rotate(...v3array(v3mul(this.#velocity, deltaTime * 0.01)));

      if (isPointOutOfCanvas(this.position.x, this.position.y)) {
         this.destroy();
      }
   }
}

class Explosion extends Entity {
   constructor(radius) {
      super();

      this.addPolygons(...createSphereGeometry(radius * 2, "#ff0"));

      this.rotate(
         Math.random() * Math.PI * 2,
         Math.random() * Math.PI * 2,
         Math.random() * Math.PI * 2
      );

      animate(
         (percent) => {
            percent = easeOutExpo(percent);
            this.scale = v3add(v3(1), v3(percent));
            this.alpha = 1 - percent;
         },
         2000,
         () => this.destroy()
      );
   }
}

class Asteroid extends Entity {
   #velocityRange = 100;
   #velocity = {
      x: Math.random() * this.#velocityRange - this.#velocityRange / 2,
      y: Math.random() * this.#velocityRange - this.#velocityRange / 2,
      z: 0
   };

   radius = 0;

   constructor(radius) {
      super();
      this.addPolygons(...createSphereGeometry(radius, "#f00"));
      this.radius = radius;
   }

   explode() {
      this.createAsteroidPieces();
      this.destroy();

      const exp = new Explosion(this.radius);

      exp.position = { ...this.position };

      GameManager.instance.addShake(10);
   }

   addVelocity(velocity) {
      this.#velocity = v3add(this.#velocity, velocity);
   }

   createAsteroidPieces() {
      const piecesRange = (this.radius / 2) >> 0;
      const piecesCount =
         Math.floor(Math.random() * piecesRange) + piecesRange / 2;

      for (let i = 0; i < piecesCount; i++) {
         const angle = Math.random() * Math.PI * 2;

         const tpos = {
            x: this.position.x + Math.cos(angle) * this.radius * 1.5,
            y: this.position.y + Math.sin(angle) * this.radius * 1.5,
            z: this.position.z
         };

         const diff = v3mul(v3sub(tpos, this.position), 7);

         const piece = new AsteroidPiece(diff, this.radius / 2);

         piece.translate(...v3array(tpos));
      }

      const addionalAsteroids = Math.round(
         this.radius > 30 ? this.radius / 15 : 0
      );

      for (let i = 0; i < addionalAsteroids; i++) {
         const asteroid = new Asteroid(this.radius / 2);
         asteroid.translate(...v3array(this.position));
         asteroid.addVelocity(v3mul(v3(Math.random(), Math.random(), 0), 100));
      }
   }

   update(dt) {
      const ng = (this.#velocity.x * dt) / 100;
      const r = this.radius;

      this.rotate(ng, ng * 0.6, ng * 0.2);
      this.translate(
         this.#velocity.x * dt,
         this.#velocity.y * dt,
         this.#velocity.z * dt
      );

      if (this.position.x > canvas.width / 2 + r) {
         this.position.x = -canvas.width / 2 - r;
      }

      if (this.position.x < -canvas.width / 2 - r) {
         this.position.x = canvas.width / 2 + r;
      }

      if (this.position.y > canvas.height / 2 + r) {
         this.position.y = -canvas.height / 2 - r;
      }

      if (this.position.y < -canvas.height / 2 - r) {
         this.position.y = canvas.height / 2 + r;
      }
   }
}

class Bullet extends Entity {
   #moveVector = v3(0);
   #moveSpeed = 1000;

   constructor(moveVector) {
      super();

      let polys = createPyramidGeometry(10, "#ff0");
      polys = this.applyRotateX(polys, Math.PI / 2);
      polys = this.applyRotateZ(polys, Math.PI / 2);
      polys = this.applyTranslate(polys, { x: 4, y: 0, z: 0 });

      this.addPolygons(...polys);
      this.#moveVector = moveVector;
   }

   applyRotation(polygons, by) {
      const { x, y, z } = by || this.rotation;

      return this.applyRotateZ(
         this.applyRotateY(this.applyRotateX(polygons, x), y),
         z
      );
   }

   update(dt) {
      this.translate(...v3array(v3mul(this.#moveVector, dt * this.#moveSpeed)));
      this.rotate(0.1, 0, 0);

      if (isPointOutOfCanvas(this.position.x, this.position.y)) {
         this.destroy();
         return;
      }

      this.checkAstroidsCollision();
   }

   checkAstroidsCollision() {
      objectBuffer
         .filter((obj) => obj instanceof Asteroid)
         .find((asteroid) => {
            const distance = v3mag(v3sub(this.position, asteroid.position));

            if (distance < asteroid.radius) {
               asteroid.explode();
               this.destroy();
               return true;
            }
         });
   }
}

class Player extends Entity {
   #keyCodeMap = [];
   #velocity = v3(0);
   #acceleration = 400;

   constructor() {
      super();

      let polys = createPyramidGeometry(20, "#0f0");
      polys = this.applyRotateX(polys, Math.PI / 2);
      polys = this.applyRotateZ(polys, Math.PI / 2);
      polys = this.applyTranslate(polys, { x: 4, y: 0, z: 0 });

      this.addPolygons(...polys);

      window.addEventListener("mousemove", this.#updateMousePos.bind(this));
      window.addEventListener("mousedown", this.#shoot.bind(this));

      window.addEventListener("keydown", this.#onKeyEvent.bind(this));
      window.addEventListener("keyup", this.#onKeyEvent.bind(this));
   }

   // override
   applyRotation(polygons, by) {
      const { x, y, z } = by || this.rotation;

      return this.applyRotateZ(
         this.applyRotateY(this.applyRotateX(polygons, x), y),
         z
      );
   }

   update(dt) {
      this.rotate(2 * dt, 0, 0);

      const leftRight = this.#isPressed("D") - this.#isPressed("A");
      const upDown = this.#isPressed("S") - this.#isPressed("W");

      this.#velocity = v3add(
         this.#velocity,
         v3mul(v3(leftRight, upDown, 0), dt * this.#acceleration)
      );

      this.#applyVelocity(dt);
   }

   #applyVelocity(dt) {
      const { x, y } = this.#velocity;

      this.translate(x * dt, y * dt, 0);

      this.#velocity = v3mul(this.#velocity, 0.99);
   }

   #shoot() {
      const { z } = this.rotation;

      const moveVector = v3normalize(v3(Math.cos(z), Math.sin(z), 0));

      moveVector.z = 0;

      const bullet = new Bullet(moveVector);
      bullet.translate(...v3array(this.position));
      bullet.rotation.z = this.rotation.z;
   }

   #updateMousePos(e) {
      const mx = e.clientX - canvas.offsetLeft - canvas.offsetWidth / 2;
      const my = e.clientY - canvas.offsetTop - canvas.offsetHeight / 2;

      const { x, y } = this.position;

      const dx = mx - x;
      const dy = my - y;

      this.rotation.z = Math.atan2(dy, dx);
   }

   #onKeyEvent(e) {
      this.#keyCodeMap[e.keyCode] = e.type === "keydown";
   }

   #isPressed(char) {
      if (typeof char === "number") return this.#keyCodeMap[char] ? 1 : 0;

      return this.#keyCodeMap[char.charCodeAt(0)] ? 1 : 0;
   }
}

const spawnAsteroids = () => {
   const asteroidsCount = gameConfig.level * 2 + 1;

   for (let i = 0; i < asteroidsCount; i++) {
      const asteroid = new Asteroid(30 + Math.random() * 60);
      asteroid.translate(
         Math.random() * canvas.width - canvas.width / 2,
         Math.random() * canvas.height - canvas.height / 2,
         0
      );
   }
};

setupCanvas();
spawnAsteroids();

const gameController = new GameManager();
const p = new Player();

document.body.appendChild(canvas);
requestAnimationFrame(render);