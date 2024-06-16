// ----------
// Utility
// ----------
Util = {};
Util.timeStamp = function() {
  return window.performance.now();
};
Util.random = function(min, max) {
  return min + Math.random() * (max - min);
};
Util.array2D = function(tableau, largeur) {
  var result = [];
  for (var i = 0; i < tableau.length; i += largeur)
    result.push(tableau.slice(i, i + largeur));
  return result;
};
Util.toDio = function(array) {
  let tab = array.map(x => {
    if (x !== 0) {
      return x - 1;
    } else {
      return x;
    }
  });
  let render = Util.array2D(tab, 16);
  return JSON.stringify(render);
};
Util.map = function(a, b, c, d, e) {
  return (a - b) / (c - b) * (e - d) + d;
};
Util.lerp = function(value1, value2, amount) {
  return value1 + (value2 - value1) * amount;
};
Util.linearTween = function(currentTime, start, degreeOfChange, duration) {
  return degreeOfChange * currentTime / duration + start;
};
Util.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
Util.easeInOutExpo = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};

// ----------
// Scene
// ----------
class Scene {
  constructor(name) {
    this.name = name;
    this.loop = true;
    this.init_once = false;
  }
  giveWorld(world) {
    this.world = world;
    this.ctx = world.ctx;
  }
  keyEvents(event) {}
  init() {}
  render() {}
  addEntity() {}
}
class Entity {
  constructor(scene, x, y) {
    this.scene = scene;
    this.world = scene.world;
    this.ctx = this.world.ctx;
    this.body = new Body(this, x, y);
  }
  setSprite(sprite_data) {
    this.sprite = new Sprite(this, sprite_data);
  }
  display() {
    if (this.sprite === undefined) {
      this.ctx.strokeStyle = "#000";
      this.ctx.strokeRect(
        this.body.position.x,
        this.body.position.y,
        this.body.size.x,
        this.body.size.y
      );
    } else {
      this.sprite.display();
    }
  }
  integration() {
    this.body.integration();
  }
}

// class for animated sprites !
class Sprite {
  constructor(entity, sprite_data) {
    this.entity = entity;
    this.world = this.entity.world;
    this.tile_size = this.world.tile_size;
    this.ctx = this.world.ctx;
    // image data
    this.image = this.world.assets.image[sprite_data.image].image;
    // sprite
    this.size = sprite_data.size;
    this.current_frame = 0;
    this.animations = {};
    this.current_animation = undefined;
    this.width = this.image.width / this.size.x;
    this.height = this.image.height / this.size.y;
    // timer
    this.tick = 0;
    this.speed = 0.2;
    // offset
    this.offset = {
      x: 0,
      y: 0
    };
  }
  addAnimation(name, frames) {
    this.animations[name] = frames;
    this.current_animation = name;
  }
  animate(animation_name) {
    this.current_animation = animation_name;
    if (this.tick < 1) {
      this.tick += this.speed;
    } else {
      this.tick = 0;
      if (this.current_frame < this.animations[animation_name].length - 1) {
        this.current_frame += 1;
      } else {
        this.current_frame = 0;
      }
    }
  }
  display() {
    this.ctx.drawImage(
      this.image,
      Math.floor(
        this.animations[this.current_animation][this.current_frame] % this.width
      ) * this.size.x,
      Math.floor(
        this.animations[this.current_animation][this.current_frame] / this.width
      ) * this.size.y,
      this.size.x,
      this.size.y,
      this.entity.body.position.x +
        (this.tile_size / 2 - this.size.x / 2) +
        this.offset.x,
      this.entity.body.position.y +
        (this.tile_size / 2 - this.size.x / 2) +
        this.offset.y,
      this.size.x,
      this.size.y
    );
  }
}

class Body {
  constructor(entity, x, y) {
    this.world = entity.world;
    this.step = this.world.FPS.step;
    this.position = new Vector(x, y);
    this.next_position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.stepped_velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.drag = 0.98;
    this.size = {
      x: 16,
      y: 16
    };
  }
  setSize(x, y) {
    this.size.x = x;
    this.size.y = y;
  }
  updateVelocity() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(this.drag);
    this.stepped_velocity = this.velocity.copy();
    this.stepped_velocity.mult(this.step);
    this.next_position = this.position.copy();
    this.next_position.add(this.stepped_velocity);
    // reset acceleration
    this.acceleration.mult(0);
  }
  updatePosition() {
    this.position.add(this.stepped_velocity);
  }
  integration() {
    this.updateVelocity();
    this.updatePosition();
  }
  applyForce(force_vector) {
    this.acceleration.add(force_vector);
  }
}

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  div(scalar) {
    this.x /= scalar;
    this.y /= scalar;
  }
  limit(limit_value) {
    if (this.mag() > limit_value) this.setMag(limit_value);
  }
  mag() {
    return Math.hypot(this.x, this.y);
  }
  setMag(new_mag) {
    if (this.mag() > 0) {
      this.normalize();
    } else {
      this.x = 1;
      this.y = 0;
    }
    this.mult(new_mag);
  }
  dist(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y).mag();
  }
  normalize() {
    let mag = this.mag();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
    }
  }
  heading() {
    return Math.atan2(this.x, this.y);
  }
  setHeading(angle) {
    let mag = this.mag();
    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;
  }
  copy() {
    return new Vector(this.x, this.y);
  }
}

class Box {
  constructor(world, box_data) {
    this.world = world;
    this.ctx = world.ctx;
    this.c_ctx = world.c_ctx;
    this.box_data = box_data;
    this.resolution = box_data.resolution;
    this.image = world.assets.image[box_data.image].image;
  }
  display(x, y, width, height) {
    // background
    this.ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
    // corners
    this.ctx.lineWidth = 2;
    let coners = [0, 2, 6, 8];
    for (let i = 0; i < 4; i++) {
      let pos_x = x + Math.floor(i % 2) * (width - this.resolution),
        pos_y = y + Math.floor(i / 2) * (height - this.resolution);
      let clip_x = Math.floor(i % 2) * (this.resolution * 2),
        clip_y = Math.floor(i / 2) * (this.resolution * 2);
      this.ctx.drawImage(
        this.image,
        clip_x,
        clip_y,
        this.resolution,
        this.resolution,
        pos_x,
        pos_y,
        this.resolution,
        this.resolution
      );
    }
    let offset = this.resolution * 3;
    // top
    this.ctx.drawImage(
      this.image,
      8,
      0,
      this.resolution,
      this.resolution,
      x + 8,
      y,
      this.resolution + width - offset,
      this.resolution
    );
    // bottom
    this.ctx.drawImage(
      this.image,
      8,
      16,
      this.resolution,
      this.resolution,
      x + 8,
      y + height - this.resolution,
      this.resolution + width - offset,
      this.resolution
    );
    // left
    this.ctx.drawImage(
      this.image,
      0,
      8,
      this.resolution,
      this.resolution,
      x,
      y + 8,
      this.resolution,
      this.resolution + height - offset
    );
    // right
    this.ctx.drawImage(
      this.image,
      16,
      8,
      this.resolution,
      this.resolution,
      x + width - this.resolution,
      y + this.resolution,
      this.resolution,
      this.resolution + height - offset
    );
  }
}
// ----------
// 🕹️ Diorama.js
// ----------
class Diorama {
  constructor(parameters) {
    this.parameters = parameters;
    // Game and author's name
    this.game_info = {
      name: parameters.name || "Untitled",
      author: parameters.author || "Anonymous"
    };
    // canvas
    this.background_color = parameters.background_color || "#000";
    this.initCanvas(parameters);
    // Assets
    this.counter = 0;
    this.toLoad = parameters.assets.length;
    this.assets = {
      image: {},
      audio: {}
    };
    this.audio_muted = false;
    // keyboard event
    this.keys = {};
    // Scenes
    this.scenes = {};
    this.start_screen = parameters.start_screen || undefined;
    this.current_scene = "";
    // Bitmap font Data
    this.alphabet =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]";
    this.fonts = {};
    // Maps
    this.tile_size = parameters.tile_size || 16;
    this.tiles_data = {};
    if (parameters.tiles !== undefined) {
      parameters.tiles.map(tile => {
        this.tiles_data[tile.id] = tile;
      });
    }
    this.mapsMax = parameters.maps.length;
    this.maps = {};
    if (parameters.maps !== undefined) {
      parameters.maps.map(map => {
        this.maps[map.name] = map;
      });
    }
    // Box system
    this.boxes = {};
    // By default the current font is the first font you create
    this.currentFont = undefined;
    // Game loop Data
    this.FPS = {
      now: 0,
      delta: 0,
      last: Util.timeStamp(),
      step: 1 / (parameters.frame_rate || 60)
    };
    this.requestChange = {
      value: false,
      action: ""
    };
    this.main_loop = undefined;
  }
  // ---
  // Setup & Loading
  // ---
  ready() {
    this.loadAssets(this.parameters.assets);
  }
  initCanvas(parameters) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.W = this.canvas.width = parameters.width || 256;
    this.H = this.canvas.height = parameters.height || 256;
    this.scale = parameters.scale || 1;
    this.full = false;
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.classList.add("crisp");
    document.body.appendChild(this.canvas);
    // cache canvas
    this.cache = document.createElement("canvas");
    this.c_ctx = this.cache.getContext("2d");
  }
  loader() {
    // increment loader
    this.clear("#222");
    this.counter += 1;
    let padding = 20;
    let width = this.W - padding * 2,
      x = padding,
      y = this.H - padding * 2;
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(x, y, width, 20);
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(x, y, this.counter * width / this.toLoad, 20);
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(x, y, width, 20);
    if (this.counter === this.toLoad) {
      this.launch();
    }
  }
  loadAssets(assets) {
    if (assets === undefined) console.log("Nothing to load");
    assets.map(obj => this.checkAssets(obj));
  }
  checkAssets(obj) {
    let subject = obj;
    switch (obj.type) {
      case "img":
        let img = new Image();
        img.onload = () => {
          this.loader();
        };
        img.onerror = () => {
          console.log("can't load Image: " + obj.name);
        };
        img.src = obj.path;
        subject.image = img;
        this.assets.image[obj.name] = subject;
        break;
      case "audio":
        let audio = new Audio(obj.path);
        audio.addEventListener("canplaythrough", this.loader());
        audio.onerror = () => {
          console.log("can't load audio: " + obj.name);
        };
        subject.audio = audio;
        this.assets.audio[obj.name] = subject;
        break;
      case undefined:
        console.log(obj.name, " doesn't have any type");
        break;
      default:
        console.log(obj.name, " has a none known type");
    }
  }
  launch() {
    this.eventSetup();
    this.initBoxes(this.parameters.boxes);
    this.initFonts(this.parameters.fonts);
    this.startScene(this.start_screen);
  }
  initBoxes(boxes_data) {
    if (boxes_data === undefined) return false;
    boxes_data.map(box => {
      this.boxes[box.name] = new Box(this, box);
    });
  }
  drawBox(box_name, x, y, width, height) {
    this.boxes[box_name].display(x, y, width, height);
  }
  // ---
  // Font manager
  // ---
  setFont(font_name) {
    this.currentFont = font_name;
  }
  initFonts(fonts_data) {
    if (fonts_data === undefined && fonts_data.length > 0) return false;
    fonts_data.map(font => {
      if (this.assets.image[font.image] === undefined) {
        console.log("can't load font, " + font.image + " doesn't exist");
        return false;
      }
      font.image = this.assets.image[font.image].image;
      this.fonts[font.name] = font;
    });
    // set current font to the first font !
    this.currentFont = Object.keys(this.fonts)[0];
  }
  write(text, x, y, justify, colorID) {
    if (this.currentFont === undefined) {
      console.log("No bitmap_font");
      return false;
    }
    if (typeof justify === "string") {
      switch (justify) {
        case "center":
          x -= text.length * this.fonts[this.currentFont].size.x / 2;
          break;
        case "right":
          x -= text.length * this.fonts[this.currentFont].size.x;
          break;
        default:
      }
      this.writeLine(text, x, y, colorID || 0);
    } else {
      this.writeParagraph(text, x, y, justify, colorID || 0);
    }
  }
  writeParagraph(text, x, y, justify, colorID) {
    let y_offset = 0,
      line_height = this.fonts[this.currentFont].size.y + 5,
      size_x = this.fonts[this.currentFont].size.x,
      words = text.split(" "),
      line = "";
    for (let i = 0; i < words.length; i++) {
      line += words[i] + " ";
      let nextword_width = 0,
        next_word = words[i + 1],
        line_length = line.length * size_x;
      next_word ? (nextword_width = next_word.length * size_x) : 0;
      if (line_length + nextword_width > justify) {
        this.writeLine(line, x, y + y_offset, 0, colorID);
        y_offset += line_height;
        line = "";
      } else {
        this.writeLine(line, x, y + y_offset, 0, colorID);
      }
    }
  }
  writeLine(text, x, y, colorID) {
    // write line
    let size_x = this.fonts[this.currentFont].size.x,
      size_y = this.fonts[this.currentFont].size.y,
      font_img = this.fonts[this.currentFont].image;
    for (let i = 0; i < text.length; i++) {
      let index = this.alphabet.indexOf(text.charAt(i)),
        clipX = size_x * index,
        posX = x + i * size_x;
      this.ctx.drawImage(
        font_img,
        clipX,
        colorID * size_y,
        size_x,
        size_y,
        posX,
        y,
        size_x,
        size_y
      );
    }
  }
  // -----------------
  // Events
  // -----------------
  eventSetup() {
    document.addEventListener("keydown", event => this.keyDown(event), false);
    document.addEventListener("keyup", event => this.keyUp(event), false);
  }
  keyDown(event) {
    event.preventDefault();
    this.keys[event.code] = true;
    if (this.keys.KeyF) {
      this.fullScreen();
    }
    if (this.keys.KeyM) {
      this.mute();
    }
    this.current_scene.keyEvents(event);
  }
  keyUp(event) {
    event.preventDefault();
    this.keys[event.code] = false;
  }
  // ---
  // Scene Manager
  // ---
  startScene(scene_name) {
    // check if the scene exist
    if (this.scenes[scene_name] === undefined)
      return scene_name + " - doesn't exist";
    // request the change of scene if this.main_loop is active
    if (this.main_loop !== undefined) {
      this.requestChange.value = true;
      this.requestChange.action = scene_name;
      return false;
    }
    this.requestChange.value = false;
    this.requestChange.action = "";
    this.FPS.last = Util.timeStamp();
    this.current_scene = this.scenes[scene_name];
    this.initScene();
    // does this scenes needs a gameloop ?
    if (this.current_scene.loop === true) {
      this.gameLoop();
    } else {
      this.mainRender();
    }
  }
  initScene() {
    if (this.current_scene.init_once) return false;
    this.current_scene.init();
  }
  addScene(scene) {
    // links this world to this scene
    scene.giveWorld(this);
    this.scenes[scene.name] = scene;
  }
  // ---
  // Main Loop
  // ---
  mainRender() {
    this.clear();
    this.current_scene.render();
  }
  loopCheck() {
    if (this.requestChange.value === false) {
      this.main_loop = requestAnimationFrame(() => this.gameLoop());
    } else {
      cancelAnimationFrame(this.main_loop);
      this.main_loop = undefined;
      this.startScene(this.requestChange.action);
    }
  }
  gameLoop() {
    this.FPS.now = Util.timeStamp();
    this.FPS.delta += Math.min(1, (this.FPS.now - this.FPS.last) / 1000);
    while (this.FPS.delta > this.FPS.step) {
      this.FPS.delta -= this.FPS.step;
      this.mainRender();
    }
    this.FPS.last = this.FPS.now;
    this.loopCheck();
  }
  // Basic functions
  soundLevel(volume) {
    for (let [k, v] of Object.entries(this.assets.audio)) {
      v.audio.volume = volume;
    }
  }
  mute() {
    this.audio_muted = !this.audio_muted;
    for (let [k, v] of Object.entries(this.assets.audio)) {
      v.audio.muted = this.audio_muted;
    }
  }
  clear(custom_color) {
    this.ctx.fillStyle = custom_color || this.background_color;
    this.ctx.fillRect(0, 0, this.W, this.H);
  }
  setScale() {
    this.canvas.style.width = this.W * this.scale + "px";
    this.canvas.style.height = this.H * this.scale + "px";
  }
  fullScreen() {
    this.full = !this.full;
    if (!this.full) {
      this.setScale();
    } else {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
    }
  }
  // ---
  // Tile map
  // ---
  getTile(layer_id, x, y) {
    if (x < 0 || x > this.terrain.layers[layer_id].size.x - 1) return false;
    if (y < 0 || y > this.terrain.layers[layer_id].size.y - 1) return false;
    let tile = this.tiles_data[this.terrain.layers[layer_id].geometry[y][x]];
    if (tile === undefined) return false;
    return tile;
  }
  findTile(layer_id, tile_id) {
    let layer = this.terrain.layers[layer_id];
    let result = [];
    for (let y = 0; y < layer.size.y; y++) {
      for (let x = 0; x < layer.size.x; x++) {
        let id = layer.geometry[y][x];
        if (id === tile_id) {
          result.push({ x: x, y: y });
        }
      }
    }
    return result;
  }
  initMap(map_name) {
    this.terrain = JSON.parse(JSON.stringify(this.maps[map_name]));
    // give size to layers
    for (var i = 0; i < this.terrain.layers.length; i++) {
      this.terrain.layers[i].size = {
        x: this.terrain.layers[i].geometry[0].length,
        y: this.terrain.layers[i].geometry.length
      };
    }
    this.terrain.tileset = this.assets.image[this.maps[map_name].tileset].image;
    this.terrain.tileset_size = {
      width: this.terrain.tileset.width / this.tile_size,
      height: this.terrain.tileset.height / this.tile_size + 1
    };
    this.terrain.layers.forEach((layer, index) => {
      this.marchingSquare(layer);
      this.bitMasking(layer);

      // create a cache for reducing draw call in the gameLoop
      this.terrainCache(layer);
      // prepare animated tiles
      layer.animated = [];
      for (var id in this.tiles_data) {
        if (this.tiles_data[id].animated === true) {
          let tiles = this.findTile(index, parseInt(id));
          layer.animated.push({
            id: id,
            spritesheet: this.assets.image[this.tiles_data[id].spritesheet]
              .image,
            positions: tiles,
            current: 0,
            steps: this.tiles_data[id].steps,
            max_frame:
              this.assets.image[this.tiles_data[id].spritesheet].image.width /
              this.tile_size
          });
        }
      }
    });
    this.clear("black");
  }
  terrainCache(layer) {
    layer.cache = {};
    let c = (layer.cache.c = document.createElement("canvas"));
    let ctx = (layer.cache.ctx = layer.cache.c.getContext("2d"));
    let W = (c.width = layer.size.x * this.tile_size),
      H = (c.height = layer.size.y * this.tile_size);
    // Draw on cache
    this.ctx.clearRect(0, 0, W, H);
    this.drawLayer(layer);
    ctx.drawImage(this.canvas, 0, 0);
    this.clear();
  }
  marchingSquare(layer) {
    layer.square = [];
    for (let y = 0; y < layer.size.y; y++) {
      for (let x = 0; x < layer.size.x; x++) {
        let p1 = 0,
          p2 = 0,
          p3 = 0,
          p4 = 0;

        if (y + 1 < layer.size.y && x + 1 < layer.size.x) {
          p1 = layer.geometry[y][x];
          p2 = layer.geometry[y][x + 1];
          p3 = layer.geometry[y + 1][x + 1];
          p4 = layer.geometry[y + 1][x];
        }
        let id = p1 * 8 + p2 * 4 + p3 * 2 + p4;
        layer.square.push(id);
      }
    }

    layer.square = Util.array2D(layer.square, layer.size.x);
  }
  bitMasking(layer) {
    layer.bitMask = [];
    for (let y = 0; y < layer.size.y; y++) {
      for (let x = 0; x < layer.size.x; x++) {
        let id = layer.geometry[y][x];
        let neighbor = [0, 0, 0, 0];
        if (y - 1 > -1) {
          if (id === layer.geometry[y - 1][x]) {
            //top
            neighbor[0] = 1;
          }
        } else {
          neighbor[0] = 1;
        }
        if (x - 1 > -1) {
          if (id === layer.geometry[y][x - 1]) {
            // left
            neighbor[1] = 1;
          }
        } else {
          neighbor[1] = 1;
        }
        if (x + 1 < layer.size.x) {
          if (id === layer.geometry[y][x + 1]) {
            // right
            neighbor[2] = 1;
          }
        } else {
          neighbor[2] = 1;
        }

        if (y + 1 < layer.size.y) {
          if (id === layer.geometry[y + 1][x]) {
            //down
            neighbor[3] = 1;
          }
        } else {
          neighbor[3] = 1;
        }
        id =
          1 * neighbor[0] + 2 * neighbor[1] + 4 * neighbor[2] + 8 * neighbor[3];
        layer.bitMask.push(id);
      }
    }
    layer.bitMask = Util.array2D(layer.bitMask, layer.size.x);
  }
  renderMap() {
    this.terrain.layers.forEach(layer => {
      this.ctx.drawImage(layer.cache.c, 0, 0);
      // draw animated layer
      layer.animated.forEach(tile => {
        if (tile.current < tile.max_frame - 1) {
          tile.current += tile.steps;
        } else {
          tile.current = 0;
        }
        // render animated tiles
        tile.positions.forEach(position => {
          let x = position.x * this.tile_size,
            y = position.y * this.tile_size;
          this.ctx.drawImage(
            tile.spritesheet,
            Math.floor(tile.current) * this.tile_size,
            0,
            this.tile_size,
            this.tile_size,
            x,
            y,
            this.tile_size,
            this.tile_size
          );
        });
      });
    });
  }
  drawMap() {
    this.terrain.layers.forEach(layer => {
      this.drawLayer(layer);
    });
  }
  drawLayer(layer) {
    for (let y = 0; y < layer.size.y; y++) {
      for (let x = 0; x < layer.size.x; x++) {
        // ID of the tile
        let id = layer.geometry[y][x];
        // Don't draw invisible tiles
        // Position of the tile :)
        let positionX = x * this.tile_size + layer.offset.x,
          positionY = y * this.tile_size + layer.offset.y;
        let sourceX =
            Math.floor(id % this.terrain.tileset_size.width) * this.tile_size,
          sourceY =
            Math.floor(id / this.terrain.tileset_size.width) * this.tile_size;
        if (this.tiles_data[id] && this.tiles_data[id].look === "bitmask") {
          sourceX = Math.floor(layer.bitMask[y][x]) * this.tile_size;
          sourceY = this.tiles_data[id].line * this.tile_size;
        }

        if (layer.look === "square") {
          if (layer.square[y][x] === 0) continue;
          positionX += this.tile_size / 2;
          positionY += this.tile_size / 2;
          sourceX = Math.floor(layer.square[y][x] % 16) * 16;
          sourceY = 7 * this.tile_size;
        }

        if (this.tiles_data[id] && this.tiles_data[id].animated === true) {
          // hide animated sprites on the cache
          continue;
        }

        // render tile

        this.ctx.drawImage(
          this.terrain.tileset,
          sourceX,
          sourceY,
          this.tile_size,
          this.tile_size,
          positionX,
          positionY,
          this.tile_size,
          this.tile_size
        );
      }
    }
  }
}
let parameters = {
  name: "Copycat",
  start_screen: "menu",
  background_color: "#223d8c",
  width: 256,
  height: 256,
  tile_size: 16,
  assets: [
    // Images
    {
      type: "img",
      name: "coderscrux_font",
      path: "https://image.ibb.co/fCOd7T/coderscrux_font.png"
    },
    {
      type: "img",
      name: "controls",
      path: "https://image.ibb.co/nApwu8/controls.png"
    },
    {
      type: "img",
      name: "player_sprite",
      path: "https://image.ibb.co/co3NZ8/player.png"
    },
    {
      type: "img",
      name: "spawn_effect",
      path: "https://image.ibb.co/njVQnT/spawn_effect.png"
    },
    {
      type: "img",
      name: "water_splash",
      path: "https://image.ibb.co/jm7hZ8/water_splash.png"
    },
    {
      type: "img",
      name: "shadow",
      path: "https://image.ibb.co/djchZ8/shadow.png"
    },
    {
      type: "img",
      name: "main_title",
      path: "https://image.ibb.co/mrBLMo/main_title.png"
    },
    {
      type: "img",
      name: "origami_dark",
      path: "https://image.ibb.co/gzk2Z8/origami_dark.png"
    },
    {
      type: "img",
      name: "origami_light",
      path: "https://image.ibb.co/jruknT/origami_light.png"
    },
    {
      type: "img",
      name: "box_texture",
      path: "https://image.ibb.co/kpO0Mo/box.png"
    },
    {
      type: "img",
      name: "selection",
      path: "https://image.ibb.co/fmJpE8/selection.png"
    },
    {
      type: "img",
      name: "flat_frame",
      path: "https://image.ibb.co/hqSugo/flat_frame.png"
    },
    {
      type: "img",
      name: "pattern",
      path: "https://image.ibb.co/cv02Z8/pattern.png"
    },
    {
      type: "img",
      name: "cursor",
      path: "https://image.ibb.co/bFiNZ8/cursor.png"
    },
    {
      type: "img",
      name: "demo_tileset",
      path: "https://image.ibb.co/b8rLMo/demo_tileset.png"
    },
    {
      type: "img",
      name: "exit",
      path: "https://image.ibb.co/esCS1o/exit.png"
    },
    {
      type: "img",
      name: "water_sprite",
      path: "https://image.ibb.co/cSFEgo/water_sprite.png"
    },
    {
      type: "img",
      name: "dust_effect",
      path: "https://image.ibb.co/mKy0Mo/dust.png"
    },
    // Audio
    {
      type: "audio",
      name: "jingle",
      path: "http://www.noiseforfun.com/waves/musical-and-jingles/NFF-bravo.wav"
    },
    {
      type: "audio",
      name: "mouvement",
      path:
        "http://www.noiseforfun.com/waves/interface-and-media/NFF-select-04.wav"
    },
    {
      type: "audio",
      name: "selection",
      path:
        "http://www.noiseforfun.com/waves/interface-and-media/NFF-select.wav"
    },
    {
      type: "audio",
      name: "apparition",
      path:
        "http://www.noiseforfun.com/waves/interface-and-media/NFF-bubble-input.wav"
    },
    {
      type: "audio",
      name: "eboulement",
      path:
        "http://www.noiseforfun.com/waves/action-and-game/NFF-moving-block.wav"
    },
    {
      type: "audio",
      name: "splash",
      path:
        "http://www.noiseforfun.com/waves/action-and-game/NFF-mud-splash.wav"
    },
    {
      type: "audio",
      name: "bump",
      path: "http://www.noiseforfun.com/waves/action-and-game/NFF-bump.wav"
    }

    // Bitmap font
  ],
  fonts: [
    // basic font
    {
      name: "coderscrux",
      image: "coderscrux_font",
      size: { x: 6, y: 9 }
    },
    {
      name: "origami_dark",
      image: "origami_dark",
      size: { x: 8, y: 9 }
    },
    {
      name: "origami_light",
      image: "origami_light",
      size: { x: 8, y: 9 }
    }
  ],
  // box system
  boxes: [
    {
      name: "box",
      resolution: 8,
      image: "box_texture"
    },
    {
      name: "selection",
      resolution: 8,
      image: "selection"
    },
    {
      name: "flat_frame",
      resolution: 8,
      image: "flat_frame"
    }
  ],
  tiles: [
    { name: "empty", id: 0, collision: false, visibility: false },
    { name: "water", id: 1, collision: false, look: "square", line: 7 },
    { name: "shores", id: 2, collision: false, look: "bitmask", line: 6 },
    { name: "ground", id: 3, collision: false, look: "bitmask", line: 1 },
    { name: "wall", id: 4, collision: true, look: "bitmask", line: 2 },
    { name: "fence", id: 11, collision: true, look: "bitmask", line: 4 },
    { name: "bush", id: 5, collision: true },
    { name: "ice", id: 6, collision: false, look: "bitmask", line: 3 },
    { name: "spawn", id: 7, collision: false },
    {
      name: "exit",
      id: 8,
      collision: false,
      animated: true,
      spritesheet: "exit",
      steps: 0.4
    },
    {
      name: "waves",
      id: 16,
      collision: false,
      animated: true,
      spritesheet: "water_sprite",
      steps: 0.2
    },
    { name: "trap", id: 9, collision: false },
    { name: "hole", id: 10, collision: true },
    // arrows
    { name: "arrowLeft", id: 12, collision: false },
    { name: "arrowUp", id: 13, collision: false },
    { name: "arrowRight", id: 14, collision: false },
    { name: "arrowDown", id: 15, collision: false }
  ],
  maps: [
    // map 1
    {
      name: "map_1",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 3, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        }
        // wall layer
      ]
    },
    // map 2
    {
      name: "map_2",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 11, 11, 11, 11, 11, 0, 0, 11, 11, 11, 11, 11, 0, 0],
            [0, 0, 11, 0, 0, 0, 11, 0, 0, 11, 0, 0, 0, 11, 0, 0],
            [0, 0, 11, 0, 8, 0, 11, 0, 0, 11, 0, 8, 0, 11, 0, 0],
            [0, 0, 11, 0, 0, 0, 11, 0, 0, 11, 0, 0, 0, 11, 0, 0],
            [0, 0, 11, 0, 0, 0, 11, 0, 0, 11, 0, 0, 0, 11, 0, 0],
            [0, 0, 11, 4, 4, 0, 11, 0, 0, 11, 0, 0, 0, 11, 0, 0],
            [0, 0, 11, 0, 0, 0, 11, 0, 0, 11, 0, 4, 4, 11, 0, 0],
            [0, 0, 11, 0, 0, 0, 11, 0, 0, 11, 0, 0, 0, 11, 0, 0],
            [0, 0, 11, 0, 7, 0, 11, 0, 0, 11, 0, 7, 0, 11, 0, 0],
            [0, 0, 11, 11, 11, 11, 11, 0, 0, 11, 11, 11, 11, 11, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        }
        // wall layer
      ]
    },
    {
      name: "map_3",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 4, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
            [0, 0, 4, 8, 0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
            [0, 0, 4, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
            [0, 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 4, 0, 0],
            [0, 0, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        }
        // wall layer
      ]
    },

    {
      name: "map_4",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
            [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11, 11, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 11, 11, 0, 0, 0, 11, 0, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 11, 0, 0, 0, 11, 0, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 11, 0, 0, 0, 11, 9, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 8, 11, 0, 0, 0, 11, 8, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 11, 0, 0, 0, 11, 7, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 11, 0, 0, 0, 11, 0, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 11, 5, 0, 0, 11, 11, 11, 0, 0, 0],
            [0, 0, 0, 0, 11, 7, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
        } // wall layer
      ]
    },
    {
      name: "map_5",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 0, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 8, 4, 4],
            [4, 4, 4, 6, 6, 4, 6, 6, 4, 6, 4, 4, 6, 4, 4, 4],
            [4, 4, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 5, 6, 6, 6, 6, 0, 0, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 0, 7, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4],
            [4, 5, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
          ]
        } // wall layer
      ]
    },

    {
      name: "map_6",
      tileset: "demo_tileset",
      // ground
      layers: [
        // ground layer
        {
          name: "ground",
          offset: {
            x: 0,
            y: 4
          },
          geometry: [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
          ]
        },
        // ice / arrows / layer
        {
          name: "onGround",
          offset: {
            x: 0,
            y: 0
          },
          geometry: [
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 6, 6, 14, 0, 6, 6, 6, 6, 15, 4, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 8, 6, 6, 6, 4, 6, 6, 4, 4, 4],
            [4, 4, 4, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 4, 4, 4],
            [4, 4, 4, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 4, 4, 4],
            [4, 4, 4, 6, 6, 14, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 0, 6, 4, 4, 4, 4],
            [4, 4, 4, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 8, 13, 4, 4, 4],
            [4, 4, 4, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
          ]
        } // wall layer
      ]
    }
  ]
};

// Don't mind me
// just too lazy to modify the maps by hand
parameters.maps.forEach(map => {
  new_layer = {};
  new_layer.name = "water";
  new_layer.look = "square";
  new_layer.offset = { x: 0, y: 8 };
  new_layer.geometry = Array(16)
    .fill()
    .map(() => Array(16).fill(0));
  map.layers.unshift(new_layer);
  //
  new_layer = {};
  new_layer.name = "splash";
  new_layer.offset = { x: 0, y: 8 };
  new_layer.geometry = Array(16)
    .fill()
    .map(() => Array(16).fill(0));
  map.layers.splice(2, 0, new_layer);

  let water = map.layers[0];
  let ground = map.layers[1];
  let splash = map.layers[2];

  for (let y = 0; y < ground.geometry.length; y++) {
    for (let x = 0; x < ground.geometry[0].length; x++) {
      if (
        y - 1 > 0 &&
        ground.geometry[y][x] !== 3 &&
        ground.geometry[y - 1][x] == 3
      ) {
        ground.geometry[y][x] = 2;
      }
    }
  }

  for (let y = 0; y < ground.geometry.length; y++) {
    for (let x = 0; x < ground.geometry[0].length; x++) {
      if (ground.geometry[y][x] == 2) {
        splash.geometry[y][x] = 16;
      }
    }
  }

  for (let y = 0; y < water.geometry.length; y++) {
    for (let x = 0; x < water.geometry[0].length; x++) {
      if (ground.geometry[y][x] == 3) {
        water.geometry[y][x] = 1;
      }

      if (ground.geometry[y][x] !== 3 && ground.geometry[y][x + 1] == 3) {
        water.geometry[y][x] = 1;
      }
      if (ground.geometry[y][x] !== 3 && ground.geometry[y][x - 1] == 3) {
        water.geometry[y][x] = 1;
      }
      if (
        y + 1 < water.geometry.length &&
        ground.geometry[y][x] !== 3 &&
        ground.geometry[y + 1][x] == 3
      ) {
        water.geometry[y][x] = 1;
      }
      if (
        y - 1 > 0 &&
        ground.geometry[y][x] !== 3 &&
        ground.geometry[y - 1][x] == 3
      ) {
        water.geometry[y][x] = 1;
      }
    }
  }

  for (let y = 0; y < water.geometry.length; y++) {
    for (let x = 0; x < water.geometry[0].length; x++) {
      if (water.geometry[y][x] == -1) {
        water.geometry[y][x] = 1;
      }
    }
  }
});
// menu scene
let menu = new Scene("menu");
menu.keyEvents = function(event) {
  if (this.world.keys.ArrowDown && this.selection < this.button.length - 1) {
    this.world.assets.audio.selection.audio.play();
    this.selection += 1;
  } else if (this.world.keys.ArrowUp && this.selection > 0) {
    this.world.assets.audio.selection.audio.play();
    this.selection -= 1;
  }
  if (this.world.keys.KeyX) {
    this.world.assets.audio.selection.audio.play();
    this.world.startScene(this.button[this.selection].link);
  }
};
menu.init = function() {
  this.init_once = true;
  // custom data
  this.button = [
    {
      name: "PLAY",
      link: "inGame"
    },
    {
      name: "SELECT",
      link: "levels"
    },
    {
      name: "CONTROLS",
      link: "controls"
    }
  ];
  this.texteMax =
    Math.max(...this.button.map(button => button.name.length)) * 6;
  this.selection = 0;
  this.select_pos = {
    x: this.world.W / 2,
    y: 110
  };
  this.cursor_phase = 0;
  this.cursor = this.world.assets.image.cursor.image;
  // background
  let background_image = this.world.assets.image.pattern.image;
  this.pattern = this.world.ctx.createPattern(background_image, "repeat");
  this.offset = {
    x: 0,
    y: 0
  };
  // add cat on
  this.cat = new Entity(this, -this.world.tile_size, -this.world.tile_size);
  let sprite_data = {
    image: "player_sprite",
    size: {
      x: 18,
      y: 18
    }
  };
  this.cat.setSprite(sprite_data);
  this.cat.sprite.addAnimation("idle", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  this.cat.sprite.speed = 0.2;
  this.cat.sprite.offset.y = -3;
};
menu.render = function() {
  this.animatedBackground();
  this.ctx.drawImage(this.world.assets.image["main_title"].image, 0, 0);
  this.displaySelection();
  // notice
  this.world.ctx.fillStyle = "rgba(0,0,0,0.6)";
  this.world.ctx.fillRect(0, this.world.H - 50, this.world.W, 33);
  this.world.setFont("origami_light");
  this.world.write(
    "Arrow keys to select",
    this.world.W / 2,
    this.world.H - 46,
    "center"
  );
  this.world.write(
    "[x] to Confirm",
    this.world.W / 2,
    this.world.H - 30,
    "center"
  );
};
menu.displaySelection = function() {
  // display box
  this.ctx.fillStyle = "#82769e";
  this.world.drawBox(
    "box",
    this.select_pos.x - (this.texteMax + 60) / 2,
    this.select_pos.y - 16,
    this.texteMax + 60,
    this.button.length * 20 + 20
  );
  // display text and cursor
  for (i in this.button) {
    if (i == this.selection) {
      this.world.setFont("origami_light");
    } else {
      this.world.setFont("origami_dark");
    }
    let title = this.button[i].name;
    this.world.write(
      title,
      this.select_pos.x,
      this.select_pos.y + i * 20,
      "center"
    );
  }
  this.cursor_phase += 0.1;
  if (this.cursor_phase > 1 / Math.sin(0.2)) {
    this.cursor_phase = -1;
  }
  let x = this.select_pos.x + Math.sin(this.cursor_phase) * 2 - 20;
  this.world.ctx.drawImage(
    this.cursor,
    x - this.button[this.selection].name.length * 10 / 2,
    this.select_pos.y + 20 * this.selection - 2
  );
};
menu.animatedBackground = function() {
  this.offset.x += 0.8;
  this.offset.y += 0.6;
  if (this.offset.x > 63) {
    this.offset.x = 0;
  }
  if (this.offset.y > 63) {
    this.offset.y = 0;
  }
  let ctx = this.world.ctx;
  ctx.save();
  ctx.translate(this.offset.x, this.offset.y);
  ctx.fillStyle = this.pattern;
  ctx.fillRect(-this.offset.x, -this.offset.y, this.world.W, this.world.H);
  ctx.restore();
};
let levels = new Scene("levels");
levels.keyEvents = function(event) {
  if (this.world.keys.KeyE) {
    this.world.assets.audio.selection.audio.play();
    this.world.startScene("menu");
  }
  if (this.world.keys.ArrowDown && this.selection + 5 < this.world.mapsMax) {
    this.world.assets.audio.selection.audio.play();
    this.selection += 5;
  }
  if (this.world.keys.ArrowUp && this.selection - 5 >= 0) {
    this.world.assets.audio.selection.audio.play();
    this.selection -= 5;
  }
  if (this.world.keys.ArrowRight && this.selection + 1 < this.world.mapsMax) {
    this.world.assets.audio.selection.audio.play();
    this.selection += 1;
  }
  if (this.world.keys.ArrowLeft && this.selection - 1 >= 0) {
    this.world.assets.audio.selection.audio.play();
    this.selection -= 1;
  }
  if (this.world.keys.KeyX) {
    this.world.assets.audio.selection.audio.play();
    this.world.current_level = this.selection + 1;
    this.world.startScene("inGame");
  }
};
levels.init = function() {
  this.init_once = true;
  this.selection = 0;
  this.scale = 0;
};
levels.render = function() {
  this.world.clear("black");
  // animate selection
  this.scale += 0.1;
  if (this.scale > 1 / Math.sin(0.2)) {
    this.scale = -1;
  }
  let offset = Math.sin(this.scale) * 2;
  // display box
  this.ctx.fillStyle = "#82769e";
  this.world.drawBox("box", 16, 16, this.world.W - 32, this.world.H - 46 - 32);
  this.world.setFont("origami_light");
  this.world.setFont("origami_dark");
  let show = Math.min(this.world.mapsMax, 20);
  for (let i = 0; i < show; i++) {
    let level_id = i + 20 * Math.floor(this.selection / 20);
    let position_x = 32 + Math.floor(i % 5) * 40,
      position_y = 32 + Math.floor(i / 5) * 40;
    if (level_id == this.selection) {
      this.world.setFont("origami_light");
      this.world.drawBox(
        "selection",
        position_x - offset / 2,
        position_y - offset / 2,
        24 + offset,
        24 + offset
      );
    } else {
      this.world.setFont("origami_dark");
      this.world.drawBox("flat_frame", position_x, position_y, 24, 24);
    }
    this.world.write(
      (level_id + 1).toString(),
      position_x + 13,
      position_y + 8,
      "center"
    );
  }
  // notice
  this.world.ctx.fillStyle = "rgba(0,0,0,0.6)";
  this.world.ctx.fillRect(0, this.world.H - 50, this.world.W, 33);
  this.world.setFont("origami_light");
  this.world.write(
    "Arrow keys to select",
    this.world.W / 2,
    this.world.H - 46,
    "center"
  );
  this.world.write(
    "[x] to Confirm, [E] to exit",
    this.world.W / 2,
    this.world.H - 30,
    "center"
  );
};
let inGame = new Scene("inGame");
inGame.keyEvents = function(event) {
  if (this.world.keys.KeyE && this.userInput) {
    this.transition.start(
      0,
      Math.max(this.world.W / 2, this.world.H / 2),
      () => {
        this.world.startScene("menu");
      }
    );
  }
  if (this.world.keys.KeyR && this.userInput) {
    this.transition.start(
      0,
      Math.max(this.world.W / 2, this.world.H / 2),
      () => {
        this.world.startScene("inGame");
      }
    );
  }
};
inGame.init = function() {
  this.won = false;
  this.userInput = true;
  this.world.initMap("map_" + this.world.current_level);
  this.cats = [];
  let spawn_cat = () => {
    // add cats on spawn tile_size
    let spawns = this.world.findTile(3, 7);
    spawns.forEach(spawn => {
      this.addCat(spawn.x, spawn.y);
    });
  };
  // effects
  this.effects = [];
  // transition effects
  this.transition = {
    scene: this,
    active: true,
    // between 0 and 100
    state: 0,
    value: 0,
    duration: 500,
    start: 0,
    // between whatever and whatever
    from: 0,
    to: Math.max(this.world.W, this.world.H),
    //
    start: function(from, to, callback) {
      this.scene.userInput = false;
      this.active = true;
      this.from = from;
      this.start_time = new Date();
      this.to = to;
      this.callback = callback;
    },
    update: function() {
      let time = new Date() - this.start_time;
      if (time < this.duration) {
        this.value = Util.easeInOutQuad(
          time,
          this.from,
          this.to - this.from,
          this.duration
        );
      } else {
        this.active = false;
        this.scene.userInput = true;
        if (this.callback !== undefined) {
          this.callback();
        }
      }
    },
    render: function() {
      this.scene.ctx.fillStyle = "black";
      this.scene.ctx.fillRect(0, 0, this.scene.world.W, this.value);
      this.scene.ctx.fillRect(
        0,
        this.scene.world.H,
        this.scene.world.W,
        -this.value
      );
      this.scene.ctx.fillRect(0, 0, this.value, this.scene.world.H);
      this.scene.ctx.fillRect(
        this.scene.world.W,
        0,
        -this.value,
        this.scene.world.H
      );
    }
  };
  this.transition.start(
    Math.max(this.world.W / 2, this.world.H / 2),
    0,
    spawn_cat
  );
};
inGame.addCat = function(x, y) {
  let cat = new Cat(this, x, y);
  let sprite_data = {
    image: "player_sprite",
    size: {
      x: 18,
      y: 18
    }
  };
  cat.setSprite(sprite_data);
  cat.sprite.addAnimation("idle", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  cat.sprite.speed = 0.2;
  cat.sprite.offset.y = -3;
  let spawn_data = {
    image: "spawn_effect",
    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    size: {
      x: 20,
      y: 40
    }
  };
  let spawn_effect = new Effect(this, spawn_data, x, y - 1, () => {
    this.cats.push(cat);
    this.world.assets.audio.apparition.audio.play();
  });
  spawn_effect.trigger = 4;
  this.effects.push(spawn_effect);
};
inGame.render = function() {
  this.control();
  this.world.renderMap();
  for (let i = this.cats.length; i--; ) {
    this.cats[i].sprite.animate("idle");
    // draw shadow and cat
    this.ctx.drawImage(
      this.world.assets.image["shadow"].image,
      this.cats[i].body.position.x,
      this.cats[i].body.position.y + 2
    );
    this.cats[i].display();
    this.cats[i].translation();
  }
  for (let i = this.effects.length; i--; ) {
    this.effects[i].render();
  }
  if (this.transition.active) {
    this.transition.update();
    this.transition.render();
  }
};
inGame.control = function() {
  if (this.userInput == false) return false;
  if (this.world.keys.ArrowUp) {
    this.moveCats(0, -1);
  }
  if (this.world.keys.ArrowDown) {
    this.moveCats(0, 1);
  }
  if (this.world.keys.ArrowLeft) {
    this.moveCats(-1, 0);
  }
  if (this.world.keys.ArrowRight) {
    this.moveCats(1, 0);
  }
};
inGame.moveCats = function(x, y) {
  // see if every cat are ready to move
  let canMove = this.cats.every(cat => {
    return cat.inTranslation == false;
  });
  if (!canMove) return false;
  this.cats.forEach(cat => {
    if (cat.canBeControlled === false) return false;
    if (cat.isDead) return false;
    cat.move(x, y);
  });
  this.collisionCats();
  this.cats.forEach(cat => {
    cat.applyMove();
  });
};
inGame.collisionCats = function() {
  // check for other cats !
  let need_to_check = true;
  while (need_to_check === true) {
    need_to_check = false;
    this.cats.forEach(cat => {
      if (cat.checkOthers()) {
        cat.target = cat.old_position.copy();
        need_to_check = true;
      }
    });
  }
};
inGame.checkWin = function() {
  if (this.cats.length === 0) {
    // everyone is dead :/
    this.transition.start(
      0,
      Math.max(this.world.W / 2, this.world.H / 2),
      () => {
        this.world.startScene("inGame");
      }
    );
    return false;
  }
  let win = this.cats.every(cat => {
    let tile = this.world.getTile(3, cat.target.x, cat.target.y);
    return tile.name == "exit";
  });
  if (
    win === true &&
    this.cats.length >= this.world.findTile(3, 8).length &&
    !this.won
  ) {
    this.won = true;

    this.world.assets.audio.jingle.audio.play();

    if (
      this.world.maps["map_" + (this.world.current_level + 1)] !== undefined
    ) {
      this.transition.start(
        0,
        Math.max(this.world.W / 2, this.world.H / 2),
        () => {
          this.world.current_level += 1;
          this.world.startScene("inGame");
        }
      );
    } else {
      this.transition.start(
        0,
        Math.max(this.world.W / 2, this.world.H / 2),
        () => {
          this.world.startScene("menu");
        }
      );
    }
  }
};
// destroy itself when animation is finish
class Effect extends Entity {
  constructor(scene, sprite_data, x, y, callback) {
    super(scene, x * scene.world.tile_size, y * scene.world.tile_size);
    this.setSprite(sprite_data);
    this.sprite.addAnimation("full", sprite_data.frames);
    this.sprite.speed = 0.4;
    this.sprite.offset.y = -3;
    this.trigger = sprite_data.frames.length;
    this.callback = callback || undefined;
  }
  render() {
    if (this.sprite.current_frame + 1 === this.trigger) {
      if (this.callback !== undefined) {
        this.callback();
        this.callback = undefined;
      }
    }
    if (
      this.sprite.current_frame + 1 ===
      this.sprite.animations[this.sprite.current_animation].length
    ) {
      this.scene.effects.splice(this.scene.effects.indexOf(this), 1);
    }
    this.sprite.animate("full");
    this.display();
  }
}
class Cat extends Entity {
  constructor(scene, x, y) {
    super(scene, x * scene.world.tile_size, y * scene.world.tile_size);
    this.old_position = new Vector(x, y);
    this.target = new Vector(x, y);
    this.canBeControlled = true;
    this.inTranslation = false;
    this.lastDirection = new Vector(0, 0);
    this.isDead = false;
    // Trasnlation of the cat when they move
    this.transition = {
      start: new Date(),
      duration: 300,
      type: Util.easeInOutQuad,
      start_pos: new Vector()
    };
  }
  // apply translation on cat when necessary
  translation() {
    if (this.inTranslation) {
      // get current time !
      let time = new Date() - this.transition.start;
      if (time < this.transition.duration) {
        let x = this.transition.type(
            time,
            this.transition.start_pos.x,
            this.transition.target.x - this.transition.start_pos.x,
            this.transition.duration
          ),
          y = this.transition.type(
            time,
            this.transition.start_pos.y,
            this.transition.target.y - this.transition.start_pos.y,
            this.transition.duration
          );
        this.body.position = new Vector(x, y);
      } else {
        // apply position when translation is finish :) !
        this.old_position = this.target.copy();
        let next_move = this.target.copy();
        next_move.mult(this.world.tile_size);
        this.body.position = next_move;
        this.inTranslation = false;
        if (this.isDead) {
          // delete cat
          let spawn_data = {
            image: "water_splash",
            frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            size: {
              x: 20,
              y: 32
            }
          };
          let spawn_effect = new Effect(
            this.scene,
            spawn_data,
            this.target.x,
            this.target.y - 1,
            () => {
              this.scene.cats.splice(this.scene.cats.indexOf(this), 1);
              this.world.assets.audio.splash.audio.play();
              this.scene.checkWin();
            }
          );
          spawn_effect.sprite.offset.y = 0;
          spawn_effect.trigger = 2;
          this.scene.effects.push(spawn_effect);
        }
        if (this.canBeControlled === false) {
          this.move(this.lastDirection.x, this.lastDirection.y);
          this.scene.collisionCats();
          this.applyMove();
        } else {
          this.world.assets.audio.mouvement.audio.play();
          // check arrows
          let current_tile = this.world.getTile(
            3,
            this.target.x,
            this.target.y
          );
          switch (current_tile.name) {
            case "arrowRight":
              this.move(1, 0);
              this.scene.collisionCats();
              this.applyMove();
              break;
            case "arrowLeft":
              this.move(-1, 0);
              this.scene.collisionCats();
              this.applyMove();
              break;
            case "arrowUp":
              this.move(0, -1);
              this.scene.collisionCats();
              this.applyMove();
              break;
            case "arrowDown":
              this.move(0, 1);
              this.scene.collisionCats();
              this.applyMove();
              break;
            default:
          }
        }
        // check if we won when a cat finish a step
        this.scene.checkWin();
      }
    }
  }
  move(x, y) {
    this.target = this.old_position.copy();
    let direction = new Vector(x, y);
    // get future position
    let future_position = this.target.copy();
    future_position.add(direction);
    let layers = this.world.terrain.layers;
    let future_tile = layers.map(layer => {
      let index = layers.indexOf(layer);
      return this.world.getTile(index, future_position.x, future_position.y);
    });
    let collision = future_tile.every(tile => {
      if (tile == false) {
        return tile == false;
      } else {
        return tile.collision === false;
      }
    });
    if (collision == true) {
      this.target.add(direction);
    }
    if (future_tile[3].name === "ice") {
      this.canBeControlled = false;
      this.transition.type = Util.linearTween;
      this.transition.duration = 100;
      return false;
    }
    if (future_tile[3].name === "trap") {
      let dust_data = {
        image: "dust_effect",
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        size: {
          x: 32,
          y: 32
        }
      };
      let dust_effect = new Effect(
        this.scene,
        dust_data,
        this.target.x,
        this.target.y
      );
      this.scene.effects.push(dust_effect);
      this.world.assets.audio.eboulement.audio.play();

      this.world.terrain.layers[3].geometry[future_position.y][
        future_position.x
      ] = 10;
      // cache the map
      this.world.terrainCache(this.world.terrain.layers[3]);
      return false;
    }
    if (future_tile[1].name !== "ground") {
      this.transition.type = Util.easeInOutQuad;
      this.transition.duration = 200;
      this.isDead = true;
      return false;
    } else {
      this.canBeControlled = true;
      this.transition.type = Util.easeInOutQuad;
      this.transition.duration = 200;
      return false;
    }
  }
  applyMove() {
    // prevent cat to move if his target equal his actual position :V
    if (
      this.old_position.x === this.target.x &&
      this.old_position.y === this.target.y
    ) {
      this.canBeControlled = true;
      this.world.assets.audio.bump.audio.play();
      return false;
    }
    this.lastDirection = new Vector(
      this.target.x - this.old_position.x,
      this.target.y - this.old_position.y
    );
    this.shouldMove = false;
    this.transition.start_pos = this.old_position.copy();
    this.transition.start_pos.mult(this.world.tile_size);
    this.transition.target = this.target.copy();
    this.transition.target.mult(this.world.tile_size);
    this.transition.start = new Date();
    this.inTranslation = true;
  }
  checkOthers() {
    let others = this.scene.cats;
    let result = false;
    for (let i = 0; i < others.length; i++) {
      if (this === others[i]) continue;
      if (
        others[i].target.x === this.target.x &&
        others[i].target.y === this.target.y
      ) {
        result = true;
        break;
      }
    }
    return result;
  }
}
let controls = new Scene("controls");
controls.keyEvents = function(event) {
  if (this.world.keys.KeyE) {
    this.world.startScene("menu");
  }
};
controls.init = function() {
  this.loop = false;
  this.controls = this.world.assets.image.controls.image;
};
controls.render = function() {
  this.world.clear("black");
  this.ctx.drawImage(this.controls, 0, 0);
  // notice
  this.world.setFont("origami_light");
  this.world.write(
    "[E] to exit",
    this.world.W / 2,
    this.world.H - 46,
    "center"
  );
};

let game = new Diorama(parameters);
// global variables
game.current_level = 1;
// Add the different scenes here
// the addScene function link the scene with the world (game)
game.addScene(menu);
game.addScene(levels);
game.addScene(controls);
game.addScene(inGame);
game.ready();
// everything start being loaded now !
// the ready function must be called last !
// Making the game full screen and with a 10% audio volume by default
game.soundLevel(0.2);
game.fullScreen();