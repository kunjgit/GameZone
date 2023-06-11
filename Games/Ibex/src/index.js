var x, y, i, j;

var deaths = [
  [
    3,
    ,
    0.45,
    0.73,
    0.5,
    0.08,
    ,
    0.04,
    -0.04,
    0.15,
    0.05,
    ,
    ,
    ,
    ,
    ,
    0.3799,
    0.02,
    0.08,
    ,
    0.35,
    0.65,
    0.08,
    0.6
  ], // fall in cliff
  [
    3,
    0.04,
    0.34,
    0.76,
    0.62,
    0.26,
    ,
    -0.04,
    -0.14,
    0.62,
    0.35,
    ,
    ,
    0.33,
    0.28,
    ,
    -0.06,
    0.3799,
    0.13,
    -0.0999,
    ,
    0.28,
    -0.14,
    0.2
  ], // stuck in earth
  [
    3,
    0.35,
    0.67,
    ,
    0.52,
    0.12,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    0.6799,
    ,
    0.25,
    -0.04,
    ,
    ,
    -0.0999,
    0.2
  ] // fire
].map(jsfxr);

var jumps = [];
var stepsSounds = [];
var screams = [];
for (i = 0; i < 4; ++i) {
  screams.push(
    jsfxr([
      1,
      0.61,
      0.36,
      0.14,
      0.75,
      0.68,
      ,
      -0.16,
      -0.02,
      0.73,
      0.12,
      -0.0999,
      0.32,
      Math.random() / 2,
      0.32,
      0.22,
      0.1999,
      -0.02,
      0.4,
      -0.06,
      0.18,
      0.78,
      ,
      0.3
    ])
  );
  jumps.push(
    jsfxr([
      0,
      0.03,
      0.3,
      0.13,
      0.2,
      0.26 + i / 20,
      ,
      0.1399,
      ,
      0.02,
      0.07,
      -0.06,
      ,
      0.42,
      ,
      ,
      -0.06,
      -0.02,
      0.34,
      0.04,
      ,
      0.28,
      0.06,
      0.2
    ])
  );
  stepsSounds.push(
    jsfxr([
      3,
      0.15 + 0.1 * Math.random(),
      0.1749,
      ,
      0.22,
      0.05 + i / 9,
      ,
      -0.16,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      0.08,
      -0.06,
      ,
      0.8,
      ,
      0.6
    ])
  );
}

var wakeUpSound = jsfxr([
  1,
  0.16,
  0.18,
  ,
  0.45,
  0.23,
  ,
  ,
  0.1,
  0.37,
  0.2,
  0.58,
  0.44,
  ,
  ,
  ,
  ,
  ,
  0.3,
  ,
  0.21,
  0.15,
  0.34,
  0.3
]);

var gameoverSound = jsfxr([
  0,
  0.11,
  1,
  0.22,
  0.7,
  0.61,
  ,
  -0.06,
  -0.0799,
  0.21,
  0.28,
  -0.04,
  0.2,
  0.56,
  -0.4,
  ,
  0.28,
  -0.54,
  0.1,
  -0.04,
  0.52,
  0.8,
  -0.02,
  0.8
]);

///////////// UTILITIES ////////////////////

function play(src, volume) {
  if (volume <= 0) return;
  var player = new Audio();
  player.src = src;
  player.volume = volume || 1;
  player.play();
}

function positionVolume(p) {
  return Math.pow(
    step(80, 10, distance(p, posToWorld(cursorCenterPos()))),
    2.0
  );
}

function shuffle(arr) {
  return arr[~~(Math.random() * arr.length)];
}

function distance(a, b) {
  var dx = a[0] - b[0],
    dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function parseColors(bufin, bufout) {
  // bufin: RGBA colors, bufout: element indexes
  // bufin size == 4 * bufout size
  for (var i = 0; i < bufin.length; i += 4) {
    bufout[i / 4] = ~~(0.5 + 9 * bufin[i] / 256);
  }
}

////// Game constants / states /////

var C = document.createElement("canvas");

var started = 0;
var gameover = 0;
var saved = 0;
var topScore = +(localStorage.ibex || 0);
var score = topScore;
var tiles = new Image();
tiles.src = "t.png";

// in milliseconds

var colors = [
  0.11,
  0.16,
  0.23, // 0: air
  0.74,
  0.66,
  0.51, // 1: earth
  0.84,
  0.17,
  0.08, // 2: fire
  0.4,
  0.75,
  0.9, // 3: water

  // spawners
  0.6,
  0.0,
  0.0, // 4: volcano (fire spawner)
  0.3,
  0.6,
  0.7, // 5: source (water spawner)

  0.15,
  0.2,
  0.27, // 6: wind left
  0.07,
  0.12,
  0.19, // 7: wind right
  0.2,
  0.6,
  0.2 // 8: grass (forest)
];

var tick = 0;
var startTick = 0;
var worldRefreshTick = 0;
var worldWindow = 128; // The size of the world chunk window in X
var worldSize = [256, 256];
var rescueSpawnMinY = 10;
var rescueSpawnMaxY = 150;
var worldPixelRawBuf = new Uint8Array(worldSize[0] * worldSize[1] * 4);
var worldPixelBuf = new Uint8Array(worldSize[0] * worldSize[1]);
var worldStartX = 0;

var windowResolution;
var resolution;
var zoom = 4;
var camera; // Camera is in resolution coordinate (not worldSize)
var cameraV = [0, 0];
var mouse = [0, 0];
var animalSpots = [];

var dragStart;
var dragCam;
var selectElStart;
var draw = 0;
var drawPosition;
var drawObject = 0;
var drawRadius = 6;

var animals = [];
var alive;
var toRescue;

//////// Game events /////

function clamp(a, b, x) {
  return Math.max(a, Math.min(x, b));
}

function posToWorld(p) {
  return [(camera[0] + p[0]) / zoom, (camera[1] + p[1]) / zoom];
}

function setCam(c) {
  camera = [
    clamp(
      -resolution[0] / 2,
      resolution[0] / 2 + zoom * worldSize[0] - resolution[0],
      c[0]
    ),
    clamp(-resolution[1] / 2, zoom * worldSize[1] - resolution[1] / 2, c[1])
  ];
}

function posE(e) {
  return [
    e.clientX * resolution[0] / windowResolution[0],
    resolution[1] - e.clientY * resolution[1] / windowResolution[1]
  ];
}

function resetMouse() {
  camStart = dragStart = dragCam = selectElStart = 0;
  C.style.cursor = started ? "default" : "pointer";
}
resetMouse();

function uiSelectElement(p) {
  var height = 2 * 4 * zoom;
  var originY = resolution[1] / 2 - 14 * zoom - height / 2;
  if (originY - 5 < p[1] && p[1] < originY + height + 5) {
    var width = 8 * zoom + 8;
    var x = (resolution[0] - 4 * width) / 2;
    var i = ~~((p[0] - x) / width);
    if (0 <= i && i < 4) {
      return i;
    }
  }
  return -1;
}

function isCursor(p) {
  return distance(cursorCenterPos(), p) < zoom * 8;
}
function cursorCenterPos() {
  return [resolution[0] / 2, resolution[1] / 2];
}

C.addEventListener("mouseleave", resetMouse);

C.addEventListener("mousedown", function(e) {
  e.preventDefault();
  if (!started || gameover) return;
  dragStart = posE(e);
  dragCam = !isCursor(dragStart);
  selectElStart = uiSelectElement(dragStart);
  camStart = [].concat(camera);
});

C.addEventListener("mouseup", function(e) {
  if (!started) start();
  if (!started || gameover) return;
  if (selectElStart != -1) {
    var selectElP = uiSelectElement(posE(e));
    if (selectElStart == selectElP) {
      drawObject = selectElStart;
    }
  }
  resetMouse();
});

C.addEventListener("mousemove", function(e) {
  if (!started || gameover) return;
  var selectElP = uiSelectElement((mouse = posE(e)));

  C.style.cursor = dragStart
    ? !dragCam ? "none" : "move"
    : isCursor(mouse) || selectElP != -1 ? "pointer" : "default";

  if (dragStart) {
    var dx = mouse[0] - dragStart[0];
    var dy = mouse[1] - dragStart[1];

    if (dragCam) {
      setCam([camStart[0] - dx, camStart[1] - dy]);
    } else {
      setCam([camStart[0] + dx, camStart[1] + dy]);
    }
  }
});

// Mouse wheel

var wheel = 0;
onwheel = onmousewheel = function(e) {
  var w = ~~((wheel += e.deltaY) / 100);
  drawObject = (16 + drawObject + w) % 4;
  wheel -= 100 * w;
};

// Keyboard

var keysDown = new Uint8Array(200); // we do that because nicely initialized to 0

function keyDraw() {
  var space = keysDown[32];
  if (space && !started) start();
  if (!started || gameover) return;
  if (space) {
    draw = 1;
  }
  if (keysDown[87] || keysDown[90]) {
    drawObject = 0;
  } else if (keysDown[88]) {
    drawObject = 1;
  } else if (keysDown[67]) {
    drawObject = 2;
  } else if (keysDown[86]) {
    drawObject = 3;
  }
  if (!draw && dragStart && !dragCam) {
    draw = 1;
  }
  drawPosition = posToWorld(cursorCenterPos());
}

//
//       38
//    37 40 39
var currentCamKeys,
  lastCamKeysChange = Date.now();
function handleKeys() {
  var s = 6,
    dx = keysDown[39] - keysDown[37],
    dy = keysDown[38] - keysDown[40];
  var camKeys = dx + "_" + dy;
  if (camKeys != currentCamKeys) {
    currentCamKeys = camKeys;
    lastCamKeysChange = Date.now();
  }
  cameraV = [s * dx, s * dy];
}

document.body.addEventListener(
  "keyup",
  function(e) {
    var w = e.which;
    keysDown[w] = 0;
    if (
      (37 <= w && w <= 40) ||
      w == 87 ||
      w == 90 ||
      w == 88 ||
      w == 67 ||
      w == 86
    ) {
      handleKeys();
    }
  },
  false
);

document.body.addEventListener(
  "keydown",
  function(e) {
    var w = e.which;
    keysDown[w] = 1;
    if (
      (37 <= w && w <= 40) ||
      w == 87 ||
      w == 90 ||
      w == 88 ||
      w == 67 ||
      w == 86
    ) {
      e.preventDefault();
      handleKeys();
    }
  },
  false
);

///////// UTILS /////////////////////

function ground(i) {
  return i == 1 || i == 4 || i == 5;
}

/////////// ANIMAL ///////////////////

var sightw = 32,
  sighth = 18,
  sighthalfw = sightw / 2,
  sighthalfh = sighth / 2;

function Animal(initialPosition, t) {
  var self = this;
  // p: position, t: targetted position
  self.p = initialPosition;
  self.t = t || [];
  // v: velocity
  self.v = [0, 0];
  // dt: next decision time
  // T: death time
  self.T = self.dt = 0;

  // this.d <- the animal status.
  //      *  -1  animal to rescue.
  //      *   0  alive.
  //      * > 0  died, with a reason code
  // this.sl <- stats left
  // this.sr <- stats right
  // this.s <- size
  // this.h <- hash for caching the animalSyncSight
}

function animalPixel(animal, x, y) {
  var sx = ~~(animal.p[0] - sighthalfw) + x - worldStartX;
  if (sx < 0 || sx >= worldSize[0]) return 1;
  var sy = ~~(animal.p[1] - sighthalfh) + y;
  if (sy < 0 || sy >= worldSize[1]) return 1;
  return worldPixelBuf[sx + sy * worldSize[0]];
}

// Animal functions
// I'm not doing prototype to save bytes (better limit the usage of fields which are hard to minimize)

function animalSyncSight(animal) {
  var h = worldRefreshTick + "_" + ~~animal.p[0] + "_" + ~~animal.p[1];
  if (animal.h == h) return;
  animal.h = h;

  /**
   * Stats:
   * sl & sr are 2 arrays of left & right exploration stats.
   *
   * Each array contains an object with:
   * f (floor): the position of a solid block (under the animal)
   * c (ceil): the position of the ceil on top of this solid block
   * h (height): ceil - floor - 1
   * s (slope): the slope in pixels – how much pixel to reach next pixels? (pixels because may be smoothed)
   * e (elements): count of elements in the [floor,ceil] range. (array with same indexes)
   * v (elements viewable)
   * a (accessible): 1 if next pixel can be accessed. 0 otherwise
   * l: all elements in front whatever the slope is.
   *
   * The array also contains fields:
   * a (accessible count): number of pixels that can be accessed
   */
  function stats(dir) {
    var a,
      x,
      y,
      i,
      ret = [];

    var floors = [];
    for (x = sighthalfw, y = sighthalfh; 0 <= x && x < sightw; x += dir) {
      if (y == sighth) y--;
      if (y == -1) y++;
      while (y < sighth && ground(animalPixel(animal, x, y))) y++;
      if (y < sighth) while (y >= 0 && !ground(animalPixel(animal, x, y))) y--;
      floors.push(y);
    }

    var countA = 0;
    for (i = 0, x = sighthalfw, a = 1; 0 <= x && x < sightw; x += dir, ++i) {
      var f = floors[i],
        c,
        h,
        s,
        l = animalPixel(animal, x, sighthalfh),
        e = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ve = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      var pixels = new Uint8Array(sighth);
      for (y = 0; y < sighth; ++y) pixels[y] = animalPixel(animal, x, y);

      // Compute slope
      s =
        ((i < sighthalfw - 1 ? floors[i + 1] : f) +
          (i < sighthalfw - 2 ? floors[i + 2] : f)) /
          2 -
        f;
      // Compute ceil
      for (c = f + 1; c < sighth && !ground(pixels[c]); c++);
      // Compute height
      h = c - f - 1;
      // Stop if conditions are reachable for the animal
      if (h < 4 /* min height */ || s < -4 || 4 < s /* max fall / climb */) {
        a = 0;
      }
      // Compute elements
      for (y = f; y <= c; ++y) e[pixels[y]]++;
      for (y = 0; y < sighth; ++y) ve[pixels[y]]++;

      ret.push({ f: f, c: c, h: h, s: s, e: e, v: ve, a: a, l: l });
      if (a) countA++;
    }
    ret.a = countA;
    return ret;
  }
  animal.sl = stats(-1);
  animal.sr = stats(1);
}

/**
 * reasons
 * 0: falls in a cliff
 * 1: stuck in earth
 * 2: burned by fire
 */
function animalDie(animal, reason) {
  animal.d = 1 + reason;
  animal.T = Date.now();
  play(deaths[reason], positionVolume(animal.p));
  play(shuffle(screams));
}

function animalUpdate(animal, center) {
  if (animal.d > 0) return;
  animalSyncSight(animal);

  var x,
    y,
    i,
    s = animal.sl[0],
    f = s.f,
    groundDiff = sighthalfh - (f + 1);

  // fire burns animal
  if (s.e[2]) {
    for (y = 0; y <= 5; ++y) {
      if (animalPixel(animal, sighthalfw, sighthalfh + y) == 2) {
        animalDie(animal, 2);
        break;
      }
    }
  }

  // animal reaches the ground violently
  if (!groundDiff && animal.v[1] < -3) {
    return animalDie(animal, 0);
  }

  if (groundDiff) {
    // ground buries animal
    if (f > sighthalfh && groundDiff < -5) {
      var airLeft = 0,
        airRight = 0;
      for (i = 0; i < 5; ++i) {
        if (airLeft == i && ground(animal.sl[i].l)) airLeft++;
        if (airRight == i && ground(animal.sr[i].l)) airRight++;
      }
      if (airLeft != 5) {
        animal.p[0] -= airLeft;
        if (animal.v[0] > 0) {
          animal.v[0] *= -0.5;
        }
      } else if (airRight != 5) {
        animal.p[0] += airLeft;
        if (animal.v[0] < 0) {
          animal.v[0] *= -0.5;
        }
      } else {
        return animalDie(animal, 1);
      }
    }

    if (groundDiff > 0) {
      // Gravity
      animal.v[1] -= 0.12;
    } else {
      // move up
      animal.p[1] -= groundDiff;
      animal.v = [0, 0];
    }
  } else {
    animal.v[1] = 0;
    animal.p[1] = ~~animal.p[1];
  }

  // Edge case where the animal would fall forever
  if (animal.p[1] < 0) return animalDie(animal, 0);

  animalSyncSight(animal);

  //////// Animal decision (each 500ms - 1s) ///////

  var now = Date.now();
  if (
    !animal.d &&
    (animal.t.length == 0 || (animal.t[0] != "n" && now > animal.dt))
  ) {
    if (now > animal.dt) {
      animal.t = []; // Forget the previous decision
    }

    // Next re-decision time
    animal.dt = now + 500 + 500 * Math.random();

    // Is there water nearby?
    var water = 0,
      waterDistance;
    var maxWaterSee = sighthalfw;
    for (i = 0; i < maxWaterSee; ++i) {
      if (animal.sl[i] && animal.sl[i].e[3]) {
        water = -1;
        waterDistance = i;
        break;
      }
      if (animal.sr[i] && animal.sr[i].e[3]) {
        water = 1;
        waterDistance = i;
        break;
      }
    }

    // Is there fire nearby?
    var fire = 0,
      fireDistance;
    var maxFireSee = sighthalfw;
    for (i = 0; i < maxFireSee; ++i) {
      if (animal.sl[i] && animal.sl[i].v[2]) {
        fire = -1;
        fireDistance = i;
        break;
      }
      if (animal.sr[i] && animal.sr[i].v[2]) {
        fire = 1;
        fireDistance = i;
        break;
      }
    }

    // Distance with center of all animals
    var deltaCenter = [center[0] - animal.p[0], center[1] - animal.p[1]];

    // Cliff at right & following plateform?
    var cliffRight = 0,
      cliffRightFollowedBySafePlatform;
    var cliffRightLastPlatform, cliffRightAfterPlatform;
    for (i = 0; i < sighthalfw; ++i) {
      var r = animal.sr[i];
      if (!r.a) {
        if (r.s < -3) {
          // select cliff only
          cliffRight = 1;
          cliffRightLastPlatform = [i, r.f];
        }
        break;
      }
    }
    if (cliffRight) {
      for (i = cliffRightLastPlatform[0] + 2; i < sighthalfw; ++i) {
        var r = animal.sr[i];
        var dy = r.f - cliffRightLastPlatform[1];
        if (r.f != -1 && -8 <= dy && dy <= 5) {
          // valid jump conditions
          if (r.h >= 4) {
            // safety conditions
            cliffRightFollowedBySafePlatform = 1;
            cliffRightAfterPlatform = [i, r.f];
          }
          break;
        }
      }
    }

    x = ~~animal.p[0];
    y = ~~animal.p[1];

    var decision = [];

    // decision format:
    // noop: ['n', time, _ ]
    // walk: ['w', xVel, xEnd]
    // run: ['r', xVel, xEnd]
    // jump: ['j', xVel, yVel]

    // TODO from new events, compute if or not the animal should reconsider previous decisions

    if (
      (fire < 0 || (!fire && Math.random() < 0.5)) &&
      cliffRight &&
      cliffRightFollowedBySafePlatform
    ) {
      var vx =
          0.1 + 0.09 * (cliffRightAfterPlatform[0] - cliffRightLastPlatform[0]),
        vy = 1;

      decision = [
        "r",
        0.7,
        x + cliffRightLastPlatform[0] - 1,
        "j",
        vx,
        vy,
        "n",
        500,
        0
      ];
    } else if (fire) {
      decision = [
        "r",
        -1 * fire,
        x + (fire < 0 ? 30 : -30) + 10 * (0.5 - Math.random()),
        "w",
        -0.5 * fire,
        x + (fire < 0 ? 50 : -50) + 10 * (0.5 - Math.random())
      ];
    } else {
      var r = Math.random();
      var wnearby = water && waterDistance < 8;
      var d =
        wnearby && Math.random() < 0.7
          ? water
          : Math.random() < 0.1
            ? animal.sr.a - animal.sl.a
            : Math.random() < 0.1 && Math.abs(deltaCenter[0]) > 80
              ? deltaCenter[0]
              : 1;
      if (r < 0.9 || wnearby) {
        decision = [
          "w",
          (d >= 0 ? 1 : -1) *
            (0.4 - (wnearby ? 0.3 * step(8, 0, waterDistance) : 0.0)),
          x + (d >= 0 ? animal.sr.a - 1 : -animal.sl.a + 1)
        ];
      } else {
        decision = ["n", 800, 0];
      }
    }

    animal.t = animal.t.concat(decision); // append the decision
  }

  //// Animal apply move & check collision

  if (groundDiff == 0) {
    var i,
      c = 1;
    for (i = 0; i < animal.t.length && c; i += 3) {
      c = 0;
      var action = animal.t[i];
      var a = animal.t[i + 1];
      var b = animal.t[i + 2];
      if (action == "n") {
        if (!b) b = animal.t[i + 2] = Date.now() + a;
        if (Date.now() > b) {
          c = 1;
        }
      }
      if (action == "w" || action == "r") {
        var dirS = a < 0 ? animal.sl : animal.sr;
        if (
          !dirS[0].a ||
          (a > 0 && b <= animal.p[0]) ||
          (a < 0 && b >= animal.p[0])
        ) {
          animal.v[0] = 0;
          c = 1;
        } else {
          animal.v[0] = a;
        }
      }
      if (action == "j") {
        c = 1;
        animal.p[1]++;
        animal.v = [a, b];
        play(
          shuffle(jumps),
          Math.random() * 0.3 + 0.7 * positionVolume(animal.p)
        );
      }
    }
    if (!c) i -= 3;
    if (i > 0) animal.t.splice(0, i);
  }

  animalSyncSight(animal);

  // apply the real velocity from the environnement
  var v = [].concat(animal.v);
  var els = animal.sl[0].e;
  if (v[0]) {
    var add = [0, 0];
    var friction = 1;
    var wind = els[7] - els[6];
    if (wind > 3) add[0] += 0.1;
    if (wind < 3) add[0] -= 0.1;
    if (groundDiff == 0) {
      friction *= 1 + step(0, 3, els[8]);
      friction *= 1 - 0.2 * step(0, 3, els[3]);
    }
    v[0] += add[0];
    v[1] += add[1];
    v[0] *= friction;
    v[1] *= friction;
  }

  if (v[0] && Math.random() < 0.04)
    play(
      shuffle(stepsSounds),
      Math.random() * 0.3 + 0.7 * positionVolume(animal.p)
    );

  // TODO implement 2D collision detection (avoid animal being stuck)
  var p = [animal.p[0] + v[0], animal.p[1] + v[1]];
  if (groundDiff == 0) {
    var dx = ~~p[0] - ~~animal.p[0];
    if (dx) {
      var s = dx > 0 ? animal.sr : animal.sl;
      dx = Math.abs(dx);
      if (s[dx] && s[dx].a) {
        animal.p = p;
      }
    } else {
      animal.p = p;
    }
  } else {
    animal.p = p;
  }
}

//////////////////////////////////////

var gl = C.getContext("webgl") || C.getContext("experimental-webgl");

var shader, shaderSrc, shaderType, program;

/// Rendering program
program = gl.createProgram();

shaderSrc = VERTEX_RENDER;
shaderType = gl.VERTEX_SHADER;
shader = gl.createShader(shaderType);
gl.shaderSource(shader, shaderSrc);
gl.compileShader(shader);
//validate(shader, shaderSrc);
gl.attachShader(program, shader);

shaderSrc = FRAGMENT_RENDER;
shaderType = gl.FRAGMENT_SHADER;
shader = gl.createShader(shaderType);
gl.shaderSource(shader, shaderSrc);
gl.compileShader(shader);
//validate(shader, shaderSrc);
gl.attachShader(program, shader);

gl.linkProgram(program);
//validateProg(program);
gl.useProgram(program);

var buffer = gl.createBuffer();
var renderPositionL = gl.getAttribLocation(program, "P");
gl.enableVertexAttribArray(renderPositionL);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(renderPositionL, 2, gl.FLOAT, false, 0, 0);

onresize = function() {
  var real = [innerWidth, innerHeight];
  windowResolution = real;
  var h = Math.min(real[0], 512);
  var w = ~~(h * real[0] / real[1]);
  if (!started) camera = [0, 256 * zoom - h];
  resolution = [w, h];
  C.style.width = real[0] + "px";
  C.style.height = real[1] + "px";
  C.width = resolution[0];
  C.height = resolution[1];
  gl.viewport(0, 0, C.width, C.height);
  var x1 = 0,
    y1 = 0,
    x2 = resolution[0],
    y2 = resolution[1];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
  gl.uniform2fv(resolutionL, resolution);
};
onresize();

var renderTimeL = gl.getUniformLocation(program, "time");
var renderAliveL = gl.getUniformLocation(program, "alive");
var renderToRescueL = gl.getUniformLocation(program, "TR");
var renderZoomL = gl.getUniformLocation(program, "ZM");
var renderStartedL = gl.getUniformLocation(program, "ST");
var renderGameOverL = gl.getUniformLocation(program, "GO");
var renderScoreL = gl.getUniformLocation(program, "score");
var renderStateL = gl.getUniformLocation(program, "state");
var renderWorldSizeL = gl.getUniformLocation(program, "WS");
var renderAnimalsL = gl.getUniformLocation(program, "AN");
var renderAnimalsLengthL = gl.getUniformLocation(program, "AL");
var renderAnimalsTilesL = gl.getUniformLocation(program, "tiles");
var renderColorsL = gl.getUniformLocation(program, "CL");
var renderDrawObjectL = gl.getUniformLocation(program, "DO");
//var renderDrawRadiusL = gl.getUniformLocation(program, "drawRadius");

var cameraL = gl.getUniformLocation(program, "CM");
//var mouseL = gl.getUniformLocation(program, "mouse");
var drawingL = gl.getUniformLocation(program, "DR");
var resolutionL = gl.getUniformLocation(program, "RES");

var texture = gl.createTexture();
tiles.onload = function() {
  gl.useProgram(renderProgram);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tiles);
  gl.uniform1i(renderAnimalsTilesL, 1);
  gl.activeTexture(gl.TEXTURE0);
};

gl.uniform1i(renderStateL, 0);
gl.uniform3fv(renderColorsL, colors);

var renderProgram = program;

/// Logic program
program = gl.createProgram();

shaderSrc = VERTEX_LOGIC;
shaderType = gl.VERTEX_SHADER;
shader = gl.createShader(shaderType);
gl.shaderSource(shader, shaderSrc);
gl.compileShader(shader);
//validate(shader, shaderSrc);
gl.attachShader(program, shader);

shaderSrc = FRAGMENT_LOGIC;
shaderType = gl.FRAGMENT_SHADER;
shader = gl.createShader(shaderType);
gl.shaderSource(shader, shaderSrc);
gl.compileShader(shader);
//validate(shader, shaderSrc);
gl.attachShader(program, shader);

gl.linkProgram(program);
//validateProg(program);

var logicSeedL = gl.getUniformLocation(program, "SD");
var logicRunningL = gl.getUniformLocation(program, "RU");
var logicTickL = gl.getUniformLocation(program, "TI");
var logicWorldStartL = gl.getUniformLocation(program, "ST");
var logicStartTickL = gl.getUniformLocation(program, "TS");
var logicStateL = gl.getUniformLocation(program, "state");
var logicSizeL = gl.getUniformLocation(program, "SZ");
var logicDrawL = gl.getUniformLocation(program, "draw");
var logicDrawPositionL = gl.getUniformLocation(program, "DP");
var logicDrawObjectL = gl.getUniformLocation(program, "DO");
var logicDrawRadiusL = gl.getUniformLocation(program, "DR");
var logicPositionL = gl.getAttribLocation(program, "P");

gl.enableVertexAttribArray(logicPositionL);

var logicTexture2 = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, logicTexture2);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

var logicFramebuffer2 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, logicFramebuffer2);
gl.framebufferTexture2D(
  gl.FRAMEBUFFER,
  gl.COLOR_ATTACHMENT0,
  gl.TEXTURE_2D,
  logicTexture2,
  0
);

var logicTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, logicTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

var logicFramebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, logicFramebuffer);
gl.framebufferTexture2D(
  gl.FRAMEBUFFER,
  gl.COLOR_ATTACHMENT0,
  gl.TEXTURE_2D,
  logicTexture,
  0
);

var logicSwap = 0;

gl.useProgram(program);
gl.uniform1f(logicSeedL, Math.random());
gl.uniform1i(logicStateL, 0);

var logicProgram = program;

function step(a, b, x) {
  return Math.max(0, Math.min((x - a) / (b - a), 1));
}

function affectColor(buf, i, c) {
  buf[i] = ~~(256 * c / 9);
  buf[i + 3] = 1;
}

var generated = 0;
function generate(startX) {
  var initial = !generated;
  generated = 1;
  var randTerrainAmount = initial ? 0 : 0.08 * Math.random() * Math.random();
  var randTerrainDown = initial ? 0 : 100 * Math.random() * Math.random();
  var waterInGeneration =
    Math.random() < 0.3 ? 24 * Math.random() * Math.random() : 0;
  var volcanoInGeneration =
    Math.random() < -0.1 * waterInGeneration + 0.4
      ? 16 * Math.random() * Math.random()
      : 0;

  // This could be implemented in a 3rd shader for performance.

  var w = worldSize[0],
    h = worldSize[1];

  function get(b, x, y) {
    if (x >= 0 && x < w && y >= 0 && y < h) {
      return b[x + y * w];
    }
    return y > 50 ? 1 : 0;
  }

  function set(b, x, y, e) {
    if (x >= 0 && x < w && y >= 0 && y < h) {
      b[x + y * w] = e;
    }
  }

  // The map generation code has become messy and
  // super crazy do not try to understand it XD
  // That is a weird cellular automaton

  var K = 26;

  var x, y, i, k, e;
  for (x = startX; x < worldSize[0]; ++x) {
    for (y = 0; y < worldSize[1]; ++y) {
      if (startX && x <= startX) {
        // This try to make the world more seamless, not perfect yet.
        e = ground(get(worldPixelBuf, startX - 1, y)) ? 1 : 0;
      } else {
        e = +(
          Math.random() >
          -0.25 * (1 - step(0, 100, y / 2 + x + worldStartX)) +
            0.09 +
            randTerrainAmount +
            0.3 *
              (step(0, 25, y) +
                step(
                  worldSize[1] - 50 - randTerrainDown,
                  worldSize[1] - 2 - 0.2 * randTerrainDown,
                  y
                ))
        );
      }
      set(worldPixelBuf, x, y, e);
    }
  }

  var swp = new Uint8Array(worldPixelBuf);
  var cur = worldPixelBuf;

  for (k = 0; k < K; ++k) {
    for (x = startX; x < worldSize[0]; ++x) {
      for (y = 0; y < worldSize[1]; ++y) {
        var me = get(cur, x, y);
        var sum =
          0.1 * me +
          (0.9 + 0.1 * Math.random()) * !!get(cur, x - 1, y - 1) +
          (0.9 + 0.1 * Math.random()) * !!get(cur, x, y - 1) +
          (0.9 + 0.1 * Math.random()) * !!get(cur, x + 1, y - 1) +
          (1.4 + 0.2 * Math.random()) * !!get(cur, x - 1, y) +
          (1.1 + 0.2 * Math.random()) * !!get(cur, x + 1, y) +
          (1.6 - 0.1 * Math.random()) * !!get(cur, x - 1, y + 1) +
          (1.2 - 0.2 * Math.random()) * !!get(cur, x, y + 1) +
          (1.0 - 0.1 * Math.random()) * !!get(cur, x + 1, y + 1);

        var e = +(sum <= 6 + (Math.random() - 0.5) * (1 - k / K));
        if (
          e &&
          sum >= 6 - Math.random() * waterInGeneration + 4 * step(110, 0, y)
        )
          e = 5;
        if (
          e &&
          sum >= 6 - Math.random() * volcanoInGeneration + 6 * step(20, 60, y)
        )
          e = 4;
        set(swp, x, y, e);
      }
    }

    var tmp = swp;
    swp = cur;
    cur = tmp;
  }

  if (swp === cur) worldPixelBuf = swp;

  for (i = 0; i < worldPixelBuf.length; ++i) {
    affectColor(worldPixelRawBuf, 4 * i, worldPixelBuf[i]);
  }

  // Locate good spots to spawn some animals to rescue

  var nbSpots,
    spots = [];

  // Dichotomic search starting from the center
  function locateSpot(xMin, xMax, maxIteration) {
    if (!maxIteration-- || nbSpots <= spots.length) return;
    var xCenter = ~~(xMin + (xMax - xMin) / 2);
    var airOnTop = 0;
    for (
      y = ~~(
        rescueSpawnMaxY -
        0.5 * Math.random() * (rescueSpawnMaxY - rescueSpawnMinY)
      ); // Not always spawn from the top
      y > rescueSpawnMinY;
      y--
    ) {
      var isEarth = get(worldPixelBuf, xCenter, y);
      if (airOnTop > 6 && isEarth) {
        spots.push([worldStartX + xCenter, y + 1]);
        break;
      }
      airOnTop = isEarth ? 0 : airOnTop + 1;
    }
    if (Math.random() < 0.5) {
      locateSpot(xMin, xCenter, maxIteration);
      locateSpot(xCenter, xMax, maxIteration);
    } else {
      locateSpot(xCenter, xMax, maxIteration);
      locateSpot(xMin, xCenter, maxIteration);
    }
  }

  if (initial) {
    nbSpots = 8;
    locateSpot(50, 128, 8);
    animalSpots = spots;
    spots = [];
    startX += 128;
  }

  nbSpots = initial
    ? 5
    : Math.min(
        -1 - Math.random() * 4 + 6 * Math.random() * Math.random(),
        30 - animals.length
      );

  locateSpot(startX + 1, worldSize[0] - 1, 6);
  for (var i = 0; i < spots.length; ++i) {
    var animal = new Animal(spots[i]);
    animal.d = -1;
    animals.push(animal);
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, logicTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    worldSize[0],
    worldSize[1],
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    worldPixelRawBuf
  );

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, logicTexture2);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    worldSize[0],
    worldSize[1],
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    worldPixelRawBuf
  );
}

function rechunk(fromX, toX) {
  var newWorldStartX = worldStartX + fromX;
  var newWorldSize = [toX - fromX, worldSize[1]];
  var newWorldPixelRawBuf = new Uint8Array(
    newWorldSize[0] * newWorldSize[1] * 4
  );
  var newWorldPixelBuf = new Uint8Array(newWorldSize[0] * newWorldSize[1]);
  var genStartX = worldSize[0] - fromX;

  for (var x = 0; x < newWorldSize[0] && fromX + x < worldSize[0]; ++x) {
    for (var y = 0; y < newWorldSize[1]; ++y) {
      var e = worldPixelBuf[fromX + x + y * worldSize[0]];
      var i = x + y * newWorldSize[0];
      newWorldPixelBuf[i] = e;
    }
  }

  worldStartX = newWorldStartX;
  worldSize = newWorldSize;
  worldPixelRawBuf = newWorldPixelRawBuf;
  worldPixelBuf = newWorldPixelBuf;
  generate(genStartX);

  camera[0] -= fromX * zoom;
  if (camStart) camStart[0] -= fromX * zoom;
}

function checkRechunk() {
  var alives = [];
  for (var i = 0; i < animals.length; ++i) {
    if (!animals[i].d) alives.push(animals[i]);
  }
  var minX, maxX;
  if (alives.length == 0) {
    minX = worldStartX + camera[0] / zoom;
    maxX = worldStartX + (camera[0] + resolution[0]) / zoom;
  } else {
    (minX = alives[0].p[0]), (maxX = minX);
    for (var i = 0; i < alives.length; ++i) {
      var animal = alives[i];
      minX = Math.min(animal.p[0], minX);
      maxX = Math.max(animal.p[0], maxX);
    }
  }
  var windowInf = Math.max(
    worldStartX,
    worldWindow * ~~(minX / worldWindow - 2)
  );
  var windowSup = Math.max(
    worldStartX + worldSize[0],
    worldWindow * ~~(maxX / worldWindow + 2)
  );

  var fromX = Math.max(0, windowInf - worldStartX); // No going back
  var toX = Math.max(worldSize[0], fromX + (windowSup - windowInf)); // No going back

  if (fromX || toX - fromX - worldSize[0]) {
    rechunk(fromX, toX);
    return 1;
  }
}

//////////// RUN THE GAME /////////////////

generate(0);

var tops = new Uint8Array(100);

for (x = 0; x < 100; ++x) {
  for (var y = worldSize[1] - 1; y > 0; y--) {
    if (ground(worldPixelBuf[x + y * worldSize[0]])) {
      tops[x] = y;
      break;
    }
  }
}

function init() {
  topScore = 0;
  for (var i = 0; i < animalSpots.length; ++i) {
    var a = new Animal(animalSpots[i], ["n", 3000 + 3000 * Math.random(), 0]);
    animals.push(a);
  }
}

function gameOver() {
  play(gameoverSound);
  localStorage.ibex = Math.max(topScore, localStorage.ibex || 0);
  setTimeout(function() {
    onclick = location.reload.bind(location);
  }, 2000);
}

function start() {
  started = 1;
  init();

  cameraV[1] = -4;
  var camT = Date.now();
  (function check() {
    if (Date.now() - camT > 4000 || camera[1] < 0) {
      cameraV[1] = 0;
      startTick = tick;
    } else setTimeout(check, 0);
  })();
}

var startTime = Date.now();
var lastUpdate = 0;
var lastRefreshWorld = 0;
function update() {
  var now = Date.now();
  var needRead = now - lastRefreshWorld >= 300;
  if (!needRead && now - lastUpdate < 35) return;
  lastUpdate = now;
  gl.useProgram(logicProgram);
  gl.uniform2fv(logicSizeL, worldSize);
  gl.uniform1f(logicTickL, tick);
  gl.uniform1f(logicWorldStartL, worldStartX);
  gl.uniform1f(logicStartTickL, startTick);
  gl.uniform1i(logicRunningL, started);
  gl.uniform1i(logicDrawL, draw);
  if (draw) {
    draw = 0;
    gl.uniform2iv(logicDrawPositionL, drawPosition);
    gl.uniform1f(logicDrawRadiusL, drawRadius);
    gl.uniform1i(logicDrawObjectL, drawObject);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(logicPositionL, 2, gl.FLOAT, gl.FALSE, 0, 0);
  gl.bindFramebuffer(
    gl.FRAMEBUFFER,
    logicSwap ? logicFramebuffer : logicFramebuffer2
  );

  if (!logicSwap) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, logicTexture);
  } else {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, logicTexture2);
  }
  gl.uniform1i(logicStateL, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  logicSwap = logicSwap ? 0 : 1;

  if (needRead) {
    lastRefreshWorld = now;
    gl.readPixels(
      0,
      0,
      worldSize[0],
      worldSize[1],
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      worldPixelRawBuf
    );
    parseColors(worldPixelRawBuf, worldPixelBuf);
    if (checkRechunk()) {
      gl.readPixels(
        0,
        0,
        worldSize[0],
        worldSize[1],
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        worldPixelRawBuf
      );
      parseColors(worldPixelRawBuf, worldPixelBuf);
    }
    worldRefreshTick++;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  tick++;
}

function render() {
  requestAnimationFrame(render);
  keyDraw();
  var drawing = draw;
  update();

  // Update Animals
  var centerAnimals = [0, 0];
  for (i = 0; i < animals.length; i++) {
    var self = animals[i];
    if (!self.d) {
      centerAnimals[0] += self.p[0];
      centerAnimals[1] += self.p[1];
    } else if (self.d < 0) {
      for (j = 0; j < animals.length; j++) {
        var other = animals[j];
        if (!other.d && distance(self.p, other.p) < 16) {
          self.d = 0;
          saved++;
          play(wakeUpSound);
          break;
        }
      }
    }
  }
  centerAnimals[0] /= animals.length;
  centerAnimals[1] /= animals.length;
  alive = 0;
  toRescue = 0;
  for (var i = 0; i < animals.length; ) {
    var animal = animals[i];
    animalUpdate(animal, centerAnimals);
    if (!animal.d) {
      topScore = Math.max(topScore, ~~animal.p[0] + 500 * saved);
      alive++;
    } else if (animal.d < 0) {
      toRescue++;
    }
    if (
      (animal.d < 0 && animal.p[0] < worldStartX) ||
      (animal.d > 0 && Date.now() - animal.T > 3000)
    ) {
      animals.splice(i, 1);
    } else {
      ++i;
    }
  }

  score = score + 0.01 * (topScore - score);

  if (started && !alive) {
    if (!gameover) {
      gameOver();
    }
    cameraV[0] = 1;
    gameover = 1;
    score = topScore;
  }

  var camVel = drawing ? 0.5 : 1; //(currentCamKeys!="0_0" && Date.now()-lastCamKeysChange > 500 ? 2 : 1);
  camVel *= step(0, 120, Date.now() - lastCamKeysChange);
  var dx = camVel * cameraV[0];
  var dy = camVel * cameraV[1];
  if (camStart) {
    camStart[0] += dx;
    camStart[1] += dy;
  }
  setCam([camera[0] + dx, camera[1] + dy]);

  var animalsData = [];
  for (var i = 0; i < animals.length; ++i) {
    var animal = animals[i];
    var statBack = animal.v[0] > 0 ? animal.sl : animal.sr;
    var slope =
      statBack[0].f + 1 == sighthalfh && statBack[3].a
        ? statBack[0].f - statBack[3].f
        : 0;
    animalsData.push(
      animal.p[0] - worldStartX,
      animal.p[1],
      animal.v[0],
      animal.v[1],
      animal.d || 0,
      animal.d > 0 ? (Date.now() - animal.T) / 999 : 0,
      slope
    );
  }

  var time = (Date.now() - startTime) / 999;
  gl.useProgram(renderProgram);
  gl.uniform2fv(resolutionL, resolution);
  gl.uniform2fv(renderWorldSizeL, worldSize);
  gl.uniform1f(renderTimeL, time);
  gl.uniform1f(renderAliveL, alive);
  gl.uniform1f(renderToRescueL, gameover ? saved : toRescue);
  gl.uniform1f(renderZoomL, zoom);
  gl.uniform2fv(cameraL, camera);
  //gl.uniform2fv(mouseL, mouse);
  gl.uniform1i(drawingL, drawing);
  gl.uniform1i(renderStartedL, started);
  gl.uniform1i(renderGameOverL, gameover);
  gl.uniform1f(renderScoreL, score);
  if (animalsData.length) {
    gl.uniform1fv(renderAnimalsL, animalsData);
  }
  gl.uniform1i(renderAnimalsLengthL, animals.length);
  //gl.uniform1f(renderDrawRadiusL, drawRadius);
  gl.uniform1i(renderDrawObjectL, drawObject);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(renderPositionL, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

document.body.innerHTML = "";
document.body.appendChild(C);

render();

/*
// TODO: Remove in the final release

function validate (shader, shaderSource) {
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var lastError = gl.getShaderInfoLog(shader);
    var split = lastError.split(":");
    var col = parseInt(split[1], 10);
    var line = parseInt(split[2], 10);
    var s = "";
    if (!isNaN(col)) {
      var spaces = ""; for (var i=0; i<col; ++i) spaces+=" ";
      s = "\n"+spaces+"^";
    }
    console.log(lastError+"\n"+shaderSource.split("\n")[line-1]+s);
    gl.deleteShader(shader);
    throw new Error(shader+" "+lastError);
  }
}
function validateProg (program) {
   var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!linked) {
     gl.deleteProgram(program);
     throw new Error(program+" "+gl.getProgramInfoLog(program));
   }
}

*/
