class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }}


class OffScreenCanvas {
  constructor(width, height) {
    let c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    this.ctx = c.getContext('2d');
    this.canvas = c;
  }}


class Opening {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw($) {
    let center = this.x - $.state.pos.x,
    l = getCirclePoint(600, 800, center - $.platform.width / 2),
    r = getCirclePoint(600, 800, center + $.platform.width / 2);

    if (l > r) {
      let sl = getCirclePoint(560, 800, center - $.platform.width / 2),
      sr = getCirclePoint(560, 800, center + $.platform.width / 2),
      c = new OffScreenCanvas(1600, 250),
      sc = new OffScreenCanvas(1600, 250),
      smallDoor = drawDoor(sc, '#b9e2d7', sr, sl - sr, 250, '#262525'),
      bigDoor = drawDoor(c, $.ctx.createPattern(smallDoor, 'no-repeat'), r, l - r, 250);

      $.ctx.drawImage(bigDoor, 0, this.y + $.state.pos.y);
    }
  }}


function prepareGraphics() {
  const b = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21151/';

  prepareImage($, b + 'c-standing.png', 'standing', 0, false);
  prepareImage($, b + 'c-standing.png', 'standing', 1, true);

  prepareImage($, b + 'c-jumping3.png', 'jumpingUp', 0, false);
  prepareImage($, b + 'c-jumping3.png', 'jumpingUp', 1, true);

  prepareImage($, b + 'c-jumpingdown.png', 'jumpingDown', 0, false);
  prepareImage($, b + 'c-jumpingdown.png', 'jumpingDown', 1, true);

  prepareImage($, b + 'Slice 1_copy.png', 'runningLeft', 0, false);
  prepareImage($, b + 'Slice 1_copy.png', 'runningLeft', 1, false);
  prepareImage($, b + 'c-walking3.png', 'runningLeft', 2, false);
  prepareImage($, b + 'c-walking3.png', 'runningLeft', 3, false);

  prepareImage($, b + 'Slice 1_copy.png', 'runningRight', 0, true);
  prepareImage($, b + 'Slice 1_copy.png', 'runningRight', 1, true);
  prepareImage($, b + 'c-walking3.png', 'runningRight', 2, true);
  prepareImage($, b + 'c-walking3.png', 'runningRight', 3, true);
}

function prepareImage($, src, type, index, flipped) {
  let temp = new OffScreenCanvas(317, 300),
  image = new Image();

  image.onload = function () {
    if (flipped) {
      temp.ctx.save();
      temp.ctx.scale(-1, 1);
    }

    temp.ctx.drawImage(image, 0, 0, 317 * (flipped ? -1 : 1), 300);

    if (flipped) {
      temp.ctx.restore();
    }

    $.animationFrames[type][index] = temp.canvas;
  };

  image.src = src;

  return temp.canvas;
}

function drawDoor(c, color, x, width, height, bg) {
  let y = 90;

  if (bg) {
    c.ctx.fillStyle = bg;
    c.ctx.fillRect(0, 0, c.canvas.width, c.canvas.height);
  }

  c.ctx.fillStyle = color;
  c.ctx.beginPath();
  c.ctx.moveTo(x, y);
  c.ctx.lineTo(x, y + height);
  c.ctx.lineTo(x + width, y + height);
  c.ctx.lineTo(x + width, y);
  c.ctx.ellipse(x + width / 2, y, width / 2, 90, 0, 0, Math.PI, true);
  c.ctx.fill();

  return c.canvas;
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.infront = false;
    this.outerBox = null;
  }

  getY($) {
    return this.y + $.state.pos.y;
  }

  isInFront($) {
    let center = this.x - $.state.pos.x,
    innerBox = getBox($, 600, center),
    outerBox = getBox($, 680, center);

    this.infront = outerBox.left > outerBox.right;
    return this.infront;
  }

  drawFront($) {
    $.ctx.fillStyle = $.colors.wood2;
    $.ctx.fillRect(this.outerBox.left, this.getY($), this.outerBox.width, $.platform.height);
  }

  draw($) {
    let center = this.x - $.state.pos.x,
    innerBox = getBox($, 600, center),
    outerBox = getBox($, 680, center),
    isLeftSide = innerBox.left > outerBox.left;

    this.infront = outerBox.left > outerBox.right;

    for (let dir of ['left', 'right']) {
      let adjust = dir === 'left' ? outerBox.unit : outerBox.unit * 6,
      outer = {
        top: {
          left: new Point(outerBox.left + adjust, this.getY($) + $.platform.height),
          right: new Point(outerBox.left + outerBox.unit + adjust, this.getY($) + $.platform.height) },

        bottom: {
          left: new Point(innerBox.left + adjust, this.getY($) + 70),
          right: new Point(innerBox.left + innerBox.unit + adjust, this.getY($) + 70) } },


      inner = {
        top: {
          left: new Point(outerBox.left + adjust, this.getY($) + ($.platform.height - 10)),
          right: new Point(outerBox.left + outerBox.unit + adjust, this.getY($) + ($.platform.height - 10)) },

        bottom: {
          left: new Point(innerBox.left + adjust, this.getY($) + 60),
          right: new Point(innerBox.left + innerBox.unit + adjust, this.getY($) + 60) } };



      drawPolygon($, $.colors.wood3, inner.top.left, inner.bottom.left, inner.bottom.right, inner.top.right);
      drawPolygon($, $.colors.wood4, outer.top.left, outer.bottom.left, outer.bottom.right, outer.top.right);

      if (!isLeftSide) {
        drawPolygon($, $.colors.wood5, inner.top.right, outer.top.right, outer.bottom.right, inner.bottom.right);
      } else {
        drawPolygon($, $.colors.wood5, inner.top.left, outer.top.left, outer.bottom.left, inner.bottom.left);
      }
    }

    $.ctx.fillStyle = $.colors.wood1;
    if (isLeftSide) {
      $.ctx.fillRect(innerBox.left, this.getY($), outerBox.left - innerBox.left, $.platform.height);
    } else {
      $.ctx.fillRect(outerBox.right, this.getY($), innerBox.left - outerBox.left, $.platform.height);
    }

    this.outerBox = outerBox;
  }}


function drawPolygon($, color, ...points) {
  $.ctx.fillStyle = color;
  $.ctx.beginPath();
  $.ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    $.ctx.lineTo(points[i].x, points[i].y);
  }
  $.ctx.fill();
}

function getBox($, radius, center) {
  let l = getCirclePoint(radius, 800, center - $.platform.width / 2),
  r = getCirclePoint(radius, 800, center + $.platform.width / 2);

  return {
    left: l,
    right: r,
    width: r - l,
    unit: (r - l) / 8 };

}

var fallbackCanvas = new OffScreenCanvas(10, 10).canvas;

var $ = {
  container: null,
  canvas: null,
  ctx: null,
  platforms: [new Platform(1600, 600),
  new Platform(1585, 600),
  new Platform(1570, 600),
  new Platform(1540, 500),
  new Platform(1525, 500),
  new Platform(1480, 500),
  new Platform(1465, 500),
  new Platform(1435, 400),
  new Platform(1415, 270),
  new Platform(1435, 135),
  new Platform(1465, 40),
  new Platform(1480, 40),
  new Platform(1500, -80),
  new Platform(1520, -200),
  new Platform(1520, -335),
  new Platform(1490, -460),
  new Platform(1460, -535),
  new Platform(1430, -610),
  new Platform(1415, -610),
  new Platform(1370, -610),
  new Platform(1355, -610),
  new Platform(1355, -610),
  new Platform(1330, -710),
  new Platform(1305, -810),
  new Platform(1280, -910),
  new Platform(1265, -910),
  new Platform(1220, -910),
  new Platform(1205, -910),
  new Platform(1150, -910),
  new Platform(1100, -910)],
  openings: [new Opening(1600, 350),
  new Opening(1205, -1160)],
  brick: {
    shine: "",
    shade: "rgba(256, 256, 256, 0.8)",
    color: "rgba(186, 186, 173, 0.8)", // #BABAAD
    width: 16,
    height: 48,
    padding: 4 },

  platform: {
    height: 22,
    width: 13, /* Degrees */
    color: '#5A4142' },

  tower: {
    width: 1200,
    shadowWidth: 130,
    skyWidth: 200 },

  sky: {
    bg: '#1F0B22',
    starSizes: [2, 3, 4, 5],
    starColors: ['#6C586F',
    '#857188',
    '#D1BDD4',
    '#E6D1A8'] },

  colors: {
    bg: '#FBD0D0',
    wood1: '#BC8550', // side
    wood2: '#ECC897', // front
    wood3: '#4B3937', // back support
    wood4: '#FFB287', // front support
    wood5: '#D58212' // side support
  },
  settings: {
    maxSpeed: 0.09, // left right
    minSpeed: 0.01, // left right
    friction: 0.7, // left right
    acceleration: 0.02, // left right
    jump: {
      gravity: {
        boost: 0.0014,
        normal: 0.003,
        down: 0.004 },

      maxSpeed: 0.6,
      fallStartSpeed: 0.07,
      friction: 0.98 } },


  storage: {
    bricks: null,
    sky: null,
    shadows: null },

  input: {
    left: false,
    right: false,
    jump: false },

  animationFrames: {
    standing: [fallbackCanvas, fallbackCanvas],
    jumpingUp: [fallbackCanvas, fallbackCanvas],
    jumpingDown: [fallbackCanvas, fallbackCanvas],
    runningLeft: [fallbackCanvas, fallbackCanvas, fallbackCanvas, fallbackCanvas],
    runningRight: [fallbackCanvas, fallbackCanvas, fallbackCanvas, fallbackCanvas] },

  savedState: null,
  state: {
    paused: false,
    titles: {
      opacity: 0,
      ready: false,
      text: "Game Over" },

    climbstarted: false,
    time: null,
    dt: null,
    climbspeed: {
      normal: 0.05,
      fast: 0.12 },

    pos: {
      x: 1485,
      y: 0 },

    activePlatforms: [],
    jump: {
      isGrounded: true,
      isJumping: false,
      isBoosting: false,
      speed: 0,
      nextY: 0 },

    player: {
      dir: 1,
      x: 725,
      y: 350,
      prevY: 350,
      speed: 0,
      animationFrame: 0,
      animationFrameCount: 0 } } };




$.container = document.getElementById('container');
$.canvas = document.getElementsByTagName('canvas')[0];
$.ctx = $.canvas.getContext('2d');

resize();
if (!$.savedState) {
  $.savedState = JSON.parse(JSON.stringify($.state));
}

prepareGraphics();
draw();

window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

function keyUp(e) {
  move(e, false);
}

function keyDown(e) {
  move(e, true);
}

function move(e, keyDown) {
  if (e.keyCode === 37)
  $.input.left = keyDown;
  if (e.keyCode === 39)
  $.input.right = keyDown;
  if (e.keyCode === 32)
  $.input.jump = keyDown;
}

function resize() {
  $.rect = $.container.getBoundingClientRect();

  if ($.canvas.height > window.innerHeight) {
    $.container.style.transform = `scale(${window.innerHeight / $.canvas.height})`;
  }
}

window.addEventListener('resize', function (event) {
  resize();
});

function draw() {
  let now = new Date().getTime();
  $.state.dt = now - ($.state.time || now);
  $.state.time = now;

  if (!$.state.paused) {
    doCalculations();
  }

  if (!$.state.paused && $.state.titles.opacity !== 100) {
    drawSky();
    drawPlatforms(false);
    drawBricks();
    drawDoors();
    drawShadows();
    drawPlatforms(true);
    drawPlayer($);
  }

  if ($.state.paused) {
    drawTitles();
  }

  requestAnimationFrame(draw);
}

function drawTitles() {
  if ($.state.titles.opacity < 100) {
    $.state.titles.opacity += Math.floor($.state.dt * 0.2);
  }

  if ($.state.titles.opacity > 100)
  $.state.titles.opacity = 100;

  $.ctx.fillStyle = "rgba(0, 0, 0, " + $.state.titles.opacity / 100 + ")";
  $.ctx.rect(0, 0, $.canvas.width, $.canvas.height);
  $.ctx.fill();

  $.ctx.fillStyle = "rgba(251, 199, 15, " + $.state.titles.opacity / 100 + ")";
  $.ctx.font = "96px 'Germania One', cursive";
  $.ctx.fillText($.state.titles.text, 600, 520 - easing($.state.titles.opacity / 100) * 40);

  if ($.state.titles.opacity == 100 && !$.input.jump) {
    $.state.titles.ready = true;
  }

  if ($.state.titles.ready && $.input.jump) {
    $.state = JSON.parse(JSON.stringify($.savedState));
  }
}

function easing(n) {
  // https://github.com/component/ease
  var s = 1.70158;
  return --n * n * ((s + 1) * n + s) + 1;
}

function drawPlayer($) {
  let drawY = $.state.player.y + $.state.pos.y - 48,
  drawX = $.state.player.x - ($.state.player.dir ? 120 : 80);

  if ($.state.jump.isJumping) {
    if ($.state.jump.speed > 0) {
      $.ctx.drawImage($.animationFrames.jumpingUp[$.state.player.dir], drawX, drawY);
    } else {
      $.ctx.drawImage($.animationFrames.jumpingDown[$.state.player.dir], drawX, drawY);
    }
  } else
  if ($.state.player.speed !== 0) {
    if ($.state.player.dir) {
      $.ctx.drawImage($.animationFrames.runningRight[$.state.player.animationFrame], drawX, drawY);
    } else {
      $.ctx.drawImage($.animationFrames.runningLeft[$.state.player.animationFrame], drawX, drawY);
    }
  } else {
    $.ctx.drawImage($.animationFrames.standing[$.state.player.dir], drawX, drawY);
  }

  //$.ctx.fillRect($.state.player.x, $.state.player.y + $.state.pos.y, 150, 250);
  $.state.player.animationFrameCount += $.state.dt;

  if ($.state.player.animationFrameCount > 50) {
    $.state.player.animationFrame += 1;
    $.state.player.animationFrameCount = 0;
  }

  if ($.state.player.animationFrame > 3) {
    $.state.player.animationFrame = 0;
  }
}

function drawDoors() {
  for (let i = 0; i < $.openings.length; i++) {
    let opening = $.openings[i];

    if (opening.x < $.state.pos.x - 40)
    continue;

    if (opening.x > $.state.pos.x + 220)
    continue;

    opening.draw($);
  }
}

function drawPlatforms(drawInfrontPlatforms) {
  if (drawInfrontPlatforms) {
    $.state.activePlatforms = [];
  }

  for (let i = 0; i < $.platforms.length; i++) {
    let platform = $.platforms[i];

    if (platform.x < $.state.pos.x - 40)
    continue;

    if (platform.x > $.state.pos.x + 220)
    continue;

    if (drawInfrontPlatforms) {
      if (platform.isInFront($)) {
        platform.draw($);
        $.state.activePlatforms.push(platform);
      }
    } else
    if (!platform.isInFront($)) {
      platform.draw($);
    }
  }

  for (let i = 0; i < $.state.activePlatforms.length; i++) {
    $.state.activePlatforms[i].drawFront($);
  }
}

function doCalculations() {
  if ($.input.left) {
    $.state.player.speed += $.settings.acceleration;
  } else
  if ($.input.right) {
    $.state.player.speed -= $.settings.acceleration;
  } else if ($.state.player.speed !== 0) {
    $.state.player.speed *= $.state.jump.isJumping ? $.settings.jump.friction : $.settings.friction;
  }

  if (Math.abs($.state.player.speed) > $.settings.maxSpeed) {
    $.state.player.speed = $.state.player.speed > 0 ? $.settings.maxSpeed : -1 * $.settings.maxSpeed;
  } else if (Math.abs($.state.player.speed) < $.settings.minSpeed) {
    $.state.player.speed = 0;
  }

  if ($.state.player.speed !== 0) {
    let currentSpeed = $.state.jump.isJumping ? $.state.player.speed * 0.7 : $.state.player.speed;
    $.state.pos.x += $.state.player.speed < 0 ? Math.ceil(currentSpeed * $.state.dt) : Math.floor(currentSpeed * $.state.dt);
    $.state.player.dir = currentSpeed > 0 ? 0 : 1;
  }

  if (!$.state.climbstarted && $.input.jump) {
    $.state.climbstarted = true;
  }

  if ($.input.jump || $.state.jump.isJumping) {
    if ($.state.jump.isGrounded) {
      $.state.jump.isGrounded = false;
      $.state.jump.isJumping = true;
      $.state.jump.isBoosting = true;
      $.state.jump.speed = $.settings.jump.maxSpeed;
    }

    if ($.state.jump.isJumping) {
      let upwards = $.state.jump.speed > 0,
      adjust = $.state.dt < 30 ? 30 - $.state.dt : 0; // .·´¯`(>▂<)´¯`·.

      if (!upwards && $.state.jump.isBoosting) {
        $.state.jump.isBoosting = false;
      }

      $.state.player.prevY = $.state.player.y;
      $.state.player.y -= $.state.jump.speed * $.state.dt;
      $.state.jump.speed -= ($.settings.jump.gravity[upwards ? $.state.jump.isBoosting ? 'boost' : 'normal' : 'down'] - adjust * 0.00002) * $.state.dt;
    }
  }

  if ($.state.jump.isBoosting && !$.input.jump) {
    $.state.jump.isBoosting = false;
  }

  if ($.state.climbstarted && $.state.pos.y < 1440) {
    $.state.pos.y += ($.state.player.y + $.state.pos.y < 250 ? $.state.climbspeed.fast : $.state.climbspeed.normal) * $.state.dt;
  }

  collisionDetection();

  if ($.state.player.y + $.state.pos.y > 900) {
    $.state.paused = true;
  }
}

function collisionDetection() {
  if ($.state.jump.isJumping && $.state.jump.speed < 0) {
    for (let i = 0; i < $.state.activePlatforms.length; i++) {
      let platform = $.state.activePlatforms[i];

      if (Math.abs(platform.x - ($.state.pos.x + 90)) < 10) {
        let playerFloor = $.state.player.y + 250,
        playerFloorPrev = $.state.player.prevY + 250;

        if (playerFloor > platform.y &&
        playerFloorPrev < platform.y) {
          $.state.player.y = platform.y - 250;
          $.state.jump.isGrounded = true;
          $.state.jump.isJumping = false;
          $.state.jump.isBoosting = false;
          $.state.jump.speed = 0;
        }
      }
    }
  } else if ($.state.jump.isGrounded) {
    let groundToStandOnFound = false;

    for (let i = 0; i < $.state.activePlatforms.length; i++) {
      let platform = $.state.activePlatforms[i];

      if (Math.abs(platform.x - ($.state.pos.x + 90)) < 10) {
        if (platform.y - ($.state.player.y + 250) === 0) {
          groundToStandOnFound = true;
          break;
        }
      }
    }

    if (!groundToStandOnFound) {
      $.state.jump.isGrounded = false;
      $.state.jump.isJumping = true;
      $.state.jump.isBoosting = true;
      $.state.jump.speed = $.settings.jump.fallStartSpeed;
    }
  }
}

function drawSky() {
  if ($.storage.sky == null) {
    let height = $.canvas.height,
    temp = new OffScreenCanvas($.canvas.width, height);
    temp.ctx.fillStyle = $.sky.bg;
    temp.ctx.fillRect(0, 0, $.canvas.width, height);

    for (let i = 0; i < 150; i++) {
      let starSize = Math.floor(Math.random() * $.sky.starSizes.length);
      temp.ctx.fillStyle = $.sky.starColors[starSize];
      temp.ctx.beginPath();
      temp.ctx.arc(Math.floor(Math.random() * $.canvas.width),
      Math.floor(Math.random() * height),
      $.sky.starSizes[starSize], 0, 2 * Math.PI);
      temp.ctx.fill();
    }

    $.storage.sky = temp.canvas;
  } else {
    let skypos = ($.state.pos.x - 2000) % 200 * 8 * -1,
    skyYPos = $.state.pos.y % $.canvas.height;

    $.ctx.drawImage($.storage.sky, skypos, skyYPos);
    $.ctx.drawImage($.storage.sky, skypos - $.canvas.width, skyYPos);
    $.ctx.drawImage($.storage.sky, skypos, skyYPos - $.canvas.height);
    $.ctx.drawImage($.storage.sky, skypos - $.canvas.width, skyYPos - $.canvas.height);
  }
}

function drawShadows() {
  if ($.storage.shadows) {
    $.ctx.drawImage($.storage.shadows, $.tower.skyWidth, 0);
  } else {
    var temp = new OffScreenCanvas($.tower.width, $.canvas.height);
    drawTowerShadow(temp.ctx, 0, $.tower.shadowWidth + 80, $.canvas.height, '#727C80', 'transparent');
    drawTowerShadow(temp.ctx, 0, $.tower.shadowWidth, $.canvas.height, '#00011F', 'transparent');
    drawTowerShadow(temp.ctx, temp.canvas.width - ($.tower.shadowWidth + 80), $.tower.shadowWidth + 80, $.canvas.height, 'transparent', '#727C80');
    drawTowerShadow(temp.ctx, temp.canvas.width - $.tower.shadowWidth, $.tower.shadowWidth, $.canvas.height, 'transparent', '#00011F');
    $.storage.shadows = temp.canvas;
  }
}

function drawTowerShadow(ctx, start, width, height, from, to) {
  let grd = ctx.createLinearGradient(start, 0, start + width, 0);
  grd.addColorStop(0, from);
  grd.addColorStop(1, to);

  ctx.fillStyle = grd;
  ctx.fillRect(start, 0, width, height);
}

function drawBricks() {
  let brickRowHeight = $.brick.height * 2 + $.brick.padding * 2;

  if (!$.storage.bricks) {
    $.storage.bricks = {};
    for (let i = 0; i < 16; i++) {
      $.storage.bricks["brick" + i] = brickFactory(brickRowHeight, i);
    }
  }

  for (let row = -1; row < 12; row++) {
    $.ctx.drawImage($.storage.bricks["brick" + $.state.pos.x % $.brick.width], $.tower.skyWidth, brickRowHeight * row + $.state.pos.y % brickRowHeight);
  }
}

function brickFactory(height, pos) {
  let temp = new OffScreenCanvas($.tower.width, height),
  x = $.brick.padding,
  y = $.brick.padding,
  pointA = { x: 0, y: 0 },
  pointB,
  step = $.brick.width,
  halfrow = true,
  gradient = temp.ctx.createLinearGradient(0, 0, temp.canvas.width, height);

  gradient.addColorStop(0, "black");
  gradient.addColorStop(0.35, "#353637");
  gradient.addColorStop(0.65, "#353637");
  gradient.addColorStop(1, "black");

  temp.ctx.fillStyle = gradient;

  temp.ctx.fillRect(0, 0, temp.canvas.width, temp.canvas.height);

  for (let i = 0; i < 2; i++) {
    for (let j = 180 + pos; j <= 360; j += step) {
      pointA = getCirclePoint(600, 600, j);

      if (halfrow) {
        j += step / 2;
        halfrow = false;
      }

      pointB = getCirclePoint(600, 600, j + step);

      // Main
      temp.ctx.fillStyle = $.brick.color;
      temp.ctx.fillRect(pointA, y, pointB - pointA - $.brick.padding, $.brick.height);

      // Shade
      temp.ctx.fillStyle = $.brick.shade;
      temp.ctx.fillRect(pointA, y, pointB - pointA - $.brick.padding, 3);
    }

    y += $.brick.padding;
    y += $.brick.height;
  }

  return temp.canvas;
}

function getCirclePoint(radius, center, angle) {
  var radian = angle / 180 * Math.PI;

  return center + radius * Math.cos(radian);
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}