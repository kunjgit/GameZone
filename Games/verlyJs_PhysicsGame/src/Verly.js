import Mouse from "./Mouse";

/**
 * @class Verly
 * @version 1.3.0
 * @author <hazru.anurag@gmail.com>
 */
class Verly {
  /**
   *
   * @param {Number} iterations
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(iterations, canvas, ctx) {
    this.entities = [];
    this.iterations = iterations;
    this.currentFrame = 0;
    this.canvas = canvas;
    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;
    this.ctx = ctx;
    this.mouse = new Mouse(this.entities, this.canvas, this.ctx);
  }

  /**
   * sets the canvas DPI for better rendering quality
   */
  setDPI() {
    // Set up CSS size.
    this.canvas.style.width =
      this.canvas.style.width || this.canvas.width + "px";
    this.canvas.style.height =
      this.canvas.style.height || this.canvas.height + "px";

    // Get size information.
    var scaleFactor = window.devicePixelRatio / 1;
    var width = parseFloat(this.canvas.style.width);
    var height = parseFloat(this.canvas.style.height);

    // Backup the this.canvas contents.
    var oldScale = this.canvas.width / width;
    var backupScale = scaleFactor / oldScale;
    var backup = this.canvas.cloneNode(false);
    backup.getContext("2d").drawImage(this.canvas, 0, 0);

    // Resize the this.canvas.
    this.canvas.width = Math.ceil(width * scaleFactor);
    this.canvas.height = Math.ceil(height * scaleFactor);

    // Redraw the this.canvas image and scale future draws.
    this.ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
    this.ctx.drawImage(backup, 0, 0);
    this.ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  }

  /**
   * @param  {...Entity} args
   * @description Joins two Entity Class Together
   *
   * @example
   * let canvas = document.getElementById('c');
   * let ctx = canvas.getContext('2d');
   * let width = canvas.width = 600;
   * let height = canvas.height = 500;
   *
   * let verly = new Verly(16, canvas, ctx);
   * let box = verly.createBox(100, 100, 100, 100);
   * let rope = verly.createRope(100, 100, 15, 10, 0);
   *
   * // verly.joinEntities(...Entity)
   * let mix = verly.joinEntities(box, rope);
   * mix.addStick(0, 18, 20)
   *
   * function animate() {
   *  ctx.clearRect(0, 0, width, height);
   *
   *  verly.update();
   *  verly.render();
   *  verly.interact();
   *  verly.renderPointIndex();
   *
   *  requestAnimationFrame(animate);
   * }
   * animate();
   *
   */
  joinEntities(...args) {
    let mixEntity = new Entity(this.iterations, this);

    let points = [];
    let sticks = [];

    // loop through the args and push points and sticks to the array
    for (let i = 0; i < args.length; i++) {
      points.push(args[i].points);
      sticks.push(args[i].sticks);

      // get the index which item we should splice in [this.entities]
      let index = this.entities.indexOf(args[i]);
      this.entities.splice(index, 1);
    }

    // join multiple arrays
    points = [].concat.apply([], points);
    sticks = [].concat.apply([], sticks);

    // add the arrays to the mix::Entity
    mixEntity.points = points;
    mixEntity.sticks = sticks;

    // add the mix::Entity to [this.entities]
    this.addEntity(mixEntity);
    return mixEntity; // return for chaining
  }

  /**
   * @param {Entity} e
   */
  addEntity(e) {
    this.entities.push(e);
  }

  /**
   * drags points
   */
  interact() {
    this.mouse.drag();
  }

  /**
   * updates all the physics stuff
   */
  update() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }

    this.currentFrame++;
  }

  /**
   */
  renderPointIndex() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].renderPointIndex(this.ctx);
    }
  }

  /**
   * renders all the entity
   */
  render() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.ctx);
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  createBox(x, y, w, h) {
    const box = new Entity(this.iterations, this, "Box");
    box.addPoint(x, y, 0, 0);
    box.addPoint(x + w, y, 0, 0);
    box.addPoint(x + w, y + h, 0, 0);
    box.addPoint(x, y + h, 0, 0);
    box.addStick(0, 1);
    box.addStick(1, 2);
    box.addStick(2, 3);
    box.addStick(3, 0);
    box.addStick(3, 1);
    this.addEntity(box);
    return box;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} segments
   * @param {number} radius=50
   * @param {number} stride1=1
   * @param {number} stride2=5
   */
  createHexagon(x, y, segments, radius = 50, stride1 = 1, stride2 = 5) {
    const hexagon = new Entity(this.iterations, this, "Hexagon");

    let stride = (2 * Math.PI) / segments;

    // points
    for (let i = 0; i < segments; ++i) {
      let theta = i * stride;
      hexagon.addPoint(
        x + Math.cos(theta) * radius,
        y + Math.sin(theta) * radius,
        0,
        0
      );
    }

    let center = hexagon.addPoint(x, y, 0, 0);

    // sticks
    for (let i = 0; i < segments; ++i) {
      hexagon.addStick(i, (i + stride1) % segments);
      hexagon.addStick(new Stick(hexagon.points[i], center));
      hexagon.addStick(i, (i + stride2) % segments);
    }

    this.addEntity(hexagon);
    return hexagon;
  }

  /**
   * @param {number} posx
   * @param {number} posy
   * @param {number} w
   * @param {number} h
   * @param {number} segments
   * @param {number} pinOffset
   */
  createCloth(posx, posy, w, h, segments, pinOffset) {
    let cloth = new Entity(this.iterations, this, "Cloth");

    let xStride = w / segments;
    let yStride = h / segments;

    let x, y;
    for (y = 0; y < segments; ++y) {
      for (x = 0; x < segments; ++x) {
        let px = posx + x * xStride - w / 2 + xStride / 2;
        let py = posy + y * yStride - h / 2 + yStride / 2;
        cloth.addPoint(px, py);

        if (x > 0) {
          cloth.addStick(y * segments + x, y * segments + x - 1);
        }

        if (y > 0) {
          cloth.addStick(y * segments + x, (y - 1) * segments + x);
        }
      }
    }

    // as the name suggest
    function tear(threshold) {
      for (let i = 0; i < cloth.sticks.length; i++) {
        // find the distance between two points
        let dist = cloth.sticks[i].startPoint.pos.dist(
          cloth.sticks[i].endPoint.pos
        );
        if (dist > (threshold || 20)) {
          // remove if the dist is > than threshold
          cloth.removeSticks(cloth.sticks[i].startPoint);
        }
      }
    }

    cloth.tear = tear;

    for (x = 0; x < segments; ++x) {
      if (x % pinOffset == 0) {
        // magic
        cloth.pin(x);
      }
    }

    !this.dontPush && this.addEntity(cloth);
    return cloth;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} segments=10
   * @param {number} gap=15
   * @param {number} pin=0
   */
  createRope(x, y, segments = 10, gap = 15, pin) {
    let rope = new Entity(this.iterations, this, 'Rope');

    for (let i = 0; i < segments; i++) {
      rope.addPoint(x + i * gap, y, 0, 0);
    }

    for (let i = 0; i < segments - 1; i++) {
      rope.addStick(i, (i + 1) % segments);
    }

    if (pin !== undefined) {
      rope.pin(pin);
    }
    this.addEntity(rope);
    return rope;
  }

  createRagdoll(x0, y0) {
    let ragdoll = new Entity(this.iterations, this, 'Ragdoll');

    // Head
    ragdoll.addPoint(x0, y0).setRadius(15).setMass(5);

    // Groin
    ragdoll.addPoint(x0, y0 + 100);

    // Hips
    ragdoll.addPoint(x0 + 30, y0 + 90);
    ragdoll.addPoint(x0 - 30, y0 + 90);

    // Knees
    ragdoll.addPoint(x0 + 20, y0 + 150);
    ragdoll.addPoint(x0 - 20, y0 + 150);

    // Feet
    ragdoll
      .addPoint(x0 + 30, y0 + 190)
      .setRadius(10)
      .setMass(20);
    ragdoll
      .addPoint(x0 - 30, y0 + 190)
      .setRadius(10)
      .setMass(20);

    // Neck
    ragdoll.addPoint(x0, y0 + 25);

    // Shoulders
    ragdoll.addPoint(x0 + 25, y0 + 30);
    ragdoll.addPoint(x0 - 25, y0 + 30);

    // Hands
    ragdoll
      .addPoint(x0 + 15, y0 + 105)
      .setRadius(10)
      .setMass(5);
    ragdoll
      .addPoint(x0 - 15, y0 + 105)
      .setRadius(10)
      .setMass(5);

    // "Muscles"
    // Head - shoulders
    ragdoll.addStick(0, 9);
    ragdoll.addStick(0, 10);
    // Shoulder - shoulder
    ragdoll.addStick(9, 10);

    // Shoulders - hips
    ragdoll.addStick(9, 2);
    ragdoll.addStick(10, 3);
    // Shoulders - hips opposite side
    ragdoll.addStick(9, 3);
    ragdoll.addStick(10, 2);

    // Hips - feet
    ragdoll.addStick(2, 6);
    ragdoll.addStick(3, 7);

    // Hips - feet, opposite
    ragdoll.addStick(2, 7);
    ragdoll.addStick(3, 6);

    // Head - groin
    ragdoll.addStick(0, 1);

    // Hip - hip
    ragdoll.addStick(2, 3);
    // Shoulder - hip
    ragdoll.addStick(9, 2);
    ragdoll.addStick(10, 3);

    // Head - knee
    ragdoll.addStick(0, 4);
    // Head - knee
    ragdoll.addStick(0, 5);

    // Head feet
    ragdoll.addStick(0, 6);
    ragdoll.addStick(0, 7);

    // Body parts
    // Hips
    ragdoll.addStick(1, 2);
    ragdoll.addStick(1, 3);
    // Legs
    ragdoll.addStick(2, 4);
    ragdoll.addStick(3, 5);
    ragdoll.addStick(4, 6);
    ragdoll.addStick(5, 7);

    ragdoll.addStick(0, 8);
    ragdoll.addStick(8, 1);

    // Left arm
    ragdoll.addStick(8, 9);
    ragdoll.addStick(9, 11);

    // Right arm
    ragdoll.addStick(8, 10);
    ragdoll.addStick(10, 12);

    this.addEntity(ragdoll);
    return ragdoll;
  }
}

export default Verly;
