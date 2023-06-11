// TODO:
// Make it move regularly - not when you press it.
// Make it multiplayer
// Add options to menu
// Improve maze
// Add sound
// Online

const LOADING = 1;
const MENU = 2;
const IN_GAME = 4;

const MAX_DELTA = 1000 / 20;
const TILE_SIDE = 12;
const HALF_TILE_SIDE = TILE_SIDE / 2;
const CABLE_SIDE = 2;

// Game elements
const EMPTY = 0;
const WALL = 1;
const PLAYER_1 = 2;
const PLAYER_2 = 3;
const GUARD = 4;
const ENGINEER = 5;
const MACHINE = 8;
const CABLE = 9;

// Directions and keys
const UP = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;
const NONE = 4;
const S = 5;
const ENTER = 6;

// Scoring
const CABLE_POINTS = 5;
const POINTS_PER_MOVE_LEFT = 10;

// Sprite map
const LOGO = 1;
const START = 2;
const YELLOW_FACE_HAPPY = 3;
const YELLOW_FACE_SAD = -1;
const GREEN_FACE = -2;
const RED_FACE = -3;
const BLUE_FACE = -4;
const ARE_YOU_READY = 4;
const GO = 5;
const UP_LEFT_CORNER = 6;
const UP_RIGHT_CORNER = 7;
const DOWN_LEFT_CORNER = 8;
const DOWN_RIGHT_CORNER = 9;
const LEFT_STRAIGHT = 10;
const RIGHT_STRAIGHT = 11;
const UP_STRAIGHT = 12;
const DOWN_STRAIGHT = 13;
const UP_LEFT_INSIDE_CORNER = 14;
const UP_RIGHT_INSIDE_CORNER = 15;
const DOWN_LEFT_INSIDE_CORNER = 16;
const DOWN_RIGHT_INSIDE_CORNER = 17;
const GAME_OVER_SIGN = 18;
const LEVEL_CLEAR_SIGN = 19;
const READY_SIGN = 20;
const GO_SIGN = 21;
const MACHINE_ONLINE = 22;
const MACHINE_OFFLINE = 24;
const CABLE_ONLINE = 25;
const CABLE_OFFLINE = 26;
const CABLE_NONE = 27;
const NUMBER_0 = 28;
const NUMBER_1 = 29;
const NUMBER_2 = 30;
const NUMBER_3 = 31;
const NUMBER_4 = 32;
const NUMBER_5 = 33;
const NUMBER_6 = 34;
const NUMBER_7 = 35;
const NUMBER_8 = 36;
const NUMBER_9 = 37;
const P_1 = 39;
const P_2 = 40;
const HI = 41;
const LEVEL_LABEL = 42;
const TIME_LABEL = 43;
const SPRITE_MAP = {};
SPRITE_MAP[LOGO] = {x: 0, y: 16, w: 71, h: 7};
SPRITE_MAP[START] = {x: 24, y: 23, w: 28, h: 7};
SPRITE_MAP[YELLOW_FACE_HAPPY] = {x: 108, y: 0, w: 12, h: 12};
SPRITE_MAP[YELLOW_FACE_SAD] = {x: 120, y: 0, w: 12, h: 12};
SPRITE_MAP[GREEN_FACE] = {x: 96, y: 0, w: 12, h: 12};
SPRITE_MAP[RED_FACE] = {x: 96, y: 12, w: 12, h: 12};
SPRITE_MAP[BLUE_FACE] = {x: 108, y: 12, w: 12, h: 12};
SPRITE_MAP[ARE_YOU_READY] = {x: 0, y: 30, w: 35, h: 7};
SPRITE_MAP[GO] = {x: 12, y: 23, w: 11, h: 7};
SPRITE_MAP[UP_LEFT_CORNER] = {x: 0, y: 37, w: 6, h: 6};
SPRITE_MAP[UP_RIGHT_CORNER] = {x: 6, y: 37, w: 6, h: 6};
SPRITE_MAP[DOWN_LEFT_CORNER] = {x: 0, y: 43, w: 6, h: 6};
SPRITE_MAP[DOWN_RIGHT_CORNER] = {x: 6, y: 43, w: 6, h: 6};
SPRITE_MAP[UP_STRAIGHT] = {x: 3, y: 37, w: 6, h: 6};
SPRITE_MAP[RIGHT_STRAIGHT] = {x: 6, y: 40, w: 6, h: 6};
SPRITE_MAP[DOWN_STRAIGHT] = {x: 3, y: 43, w: 6, h: 6};
SPRITE_MAP[LEFT_STRAIGHT] = {x: 0, y: 40, w: 6, h: 6};
SPRITE_MAP[UP_LEFT_INSIDE_CORNER] = {x: 12, y: 37, w: 6, h: 6};
SPRITE_MAP[UP_RIGHT_INSIDE_CORNER] = {x: 18, y: 37, w: 6, h: 6};
SPRITE_MAP[DOWN_LEFT_INSIDE_CORNER] = {x: 12, y: 43, w: 6, h: 6};
SPRITE_MAP[DOWN_RIGHT_INSIDE_CORNER] = {x: 18, y: 43, w: 6, h: 6};
SPRITE_MAP[GAME_OVER_SIGN] = {x: 132, y: 0, w: 35, h: 27};
SPRITE_MAP[LEVEL_CLEAR_SIGN] = {x: 167, y: 0, w: 41, h: 27};
SPRITE_MAP[READY_SIGN] = {x: 208, y: 0, w: 47, h: 19};
SPRITE_MAP[GO_SIGN] = {x: 208, y: 19, w: 26, h: 19};
SPRITE_MAP[MACHINE_ONLINE] = {x: 64, y: 23, w: 12, h: 12};
SPRITE_MAP[MACHINE_OFFLINE] = {x: 88, y: 23, w: 12, h: 12};
SPRITE_MAP[CABLE_ONLINE] = {x: 0, y: 0, w: 2, h: 2};
SPRITE_MAP[CABLE_OFFLINE] = {x: 2, y: 0, w: 2, h: 2};
SPRITE_MAP[CABLE_NONE] = {x: 4, y: 0, w: 2, h: 2};
SPRITE_MAP[NUMBER_1] = {x: 7, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_2] = {x: 13, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_3] = {x: 19, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_4] = {x: 25, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_5] = {x: 31, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_6] = {x: 37, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_7] = {x: 43, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_8] = {x: 49, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_9] = {x: 55, y: 0, w: 6, h: 7};
SPRITE_MAP[NUMBER_0] = {x: 61, y: 0, w: 6, h: 7};
SPRITE_MAP[P_1] = {x: 0, y: 8, w: 9, h: 7};
SPRITE_MAP[P_2] = {x: 11, y: 8, w: 11, h: 7};
SPRITE_MAP[HI] = {x: 25, y: 8, w: 11, h: 7};
SPRITE_MAP[LEVEL_LABEL] = {x: 173, y: 6, w: 29, h: 7};
SPRITE_MAP[TIME_LABEL] = {x: 67, y: 0, w: 23, h: 7};

let ART = null;

const Utils = {
  drawSprite: (graphicsContext, x, y, name) => {
    const sprite = SPRITE_MAP[name];
    graphicsContext.drawImage(ART, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
  },
  drawNumber: (graphicsContext, x, y, number, minLength) => {
    let str =('' + number);
    minLength = minLength || str.length
    while (str.length < minLength) {
      str = '0' + str;
    }
    str.split('').forEach(d => {
      const sprite = NUMBER_0 + (d << 0);
      Utils.drawSprite(graphicsContext, x, y, sprite);
      x += SPRITE_MAP[sprite].w;
    });
  },
  horizontallyCentreSprite: (graphicsContext, y, name, width) => {
    const sprite = SPRITE_MAP[name];
    const x = (width - sprite.w) / 2;
    Utils.drawSprite(graphicsContext, x, y, name);
  },
  centreSprite: (graphicsContext, name, width, height) => {
    const sprite = SPRITE_MAP[name];
    const x = (width - sprite.w) / 2;
    const y = (height - sprite.h) / 2;
    Utils.drawSprite(graphicsContext, x, y, name);
  },
  getCanvas: (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  clone: obj => JSON.parse(JSON.stringify(obj)),
  distanceBetween: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
  randomInt: max => Math.floor(Math.random() * max),
  shuffle: array => {
    let end = array.length - 1;
    while (end > 0) {
      const next = Utils.randomInt(end);
      const temp = array[end];
      array[end] = array[next];
      array[next] = temp;
      end--;
    }
    return array;
  },
  loadImage: (url, onLoad) => {
    const file = new Image();
    file.onload = e => onLoad(file);
    file.src = url + '?ts=' + Date.now();
  }
};

class GameElement {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    render(graphicsContext, transition, dimensions) {
      this.onRender(graphicsContext, transition, dimensions);
    }
    step(){}
    onRender(){}
}

class LevelGenerator {
  static generateLevel(width, height, machines, engineers, guards) {
    const evenWidth = width % 2 === 0;
    const evenHeight = height % 2 === 0;
    const quartWidth = Math.floor(width / 2);
    const minQuartHeight = 5;
    const maxQuartHeight = (Math.floor(height / 2) * 2) - minQuartHeight;
    const topQuartHeight = minQuartHeight + Math.floor(Math.random() * (maxQuartHeight - minQuartHeight));
    const bottomQuartHeight = height - topQuartHeight - (evenHeight ? 0 : 1);

    const machinesPerQuart = Math.max(2, machines / 4);
    const topLeftQuart = LevelGenerator.generateTopLeftQuart(quartWidth, topQuartHeight, machinesPerQuart);

    const bottomLeftQuart = LevelGenerator.flipVertically(
        LevelGenerator.generateTopLeftQuart(quartWidth, bottomQuartHeight, machinesPerQuart));
    const topLeftBottomRow = topLeftQuart[topLeftQuart.length - 1];
    bottomLeftQuart.shift();
    bottomLeftQuart.unshift(topLeftBottomRow.slice());

    const topRightQuart = LevelGenerator.flipHorizontally(topLeftQuart);
    const bottomRightQuart = LevelGenerator.flipHorizontally(bottomLeftQuart);

    //concat..
    const map = [];
    for (let i = 0; i < topQuartHeight; i++) {
      map.push.apply(map, topLeftQuart[i]);
      !evenWidth && map.push(topRightQuart[i][0]);
      map.push.apply(map, topRightQuart[i]);
    }

    if (!evenHeight) {
      map.push.apply(map, map.slice(map.length - width)); // copy last row.
    }

    for (let i = 0; i < bottomQuartHeight; i++) {
      map.push.apply(map, bottomLeftQuart[i]);
      !evenWidth && map.push(bottomRightQuart[i][0]);
      map.push.apply(map, bottomRightQuart[i]);
    }

    if (!evenWidth && Math.random() > 0.5) {
      // TODO: knock out middle of centre and sides..
    }

    if (!evenHeight && Math.random() > 0.5) {
      // TODO: knock out middle of centre and sides..
    }

    const objects = [];
    objects.push({ type: PLAYER_1, x: Math.floor(width / 2), y: height - bottomQuartHeight + 1 });
    objects.push({ type: PLAYER_2, x: Math.ceil(width / 2), y: topQuartHeight - 1 });

    const enemyStartPositions = Utils.shuffle([
      {x: 1, y: 1},
      {x: width - 2, y: 1},
      {x: 1, y: height - 2},
      {x: width - 2, y: height - 2},
      {x: quartWidth - 2, y: 1},
      {x: width - (quartWidth - 2), y: 1},
      {x: quartWidth - 2, y: height - 2},
      {x: width - (quartWidth - 2), y: height - 2},
      {x: 1, y: topQuartHeight - 2},
      {x: width - 2, y: topQuartHeight - 2},
      {x: 1, y: height - (bottomQuartHeight - 2)},
      {x: width - 2, y: height - (bottomQuartHeight - 2)}
    ]);

    const enemies = [];
    for (let i = 0; i < guards; i++) {
      enemies.push(GUARD);
    }
    for (let i = 0; i < engineers; i++) {
      enemies.push(ENGINEER);
    }

    for (let enemy of enemies) {
      const startPosition = enemyStartPositions.pop();
      objects.push({type: enemy, x: startPosition.x, y: startPosition.y});
      if (!enemyStartPositions.length) {
        break;
      }
    }

    return {map, width, objects};
  }

  static flipVertically(quartMap) {
    const flipped = [];
    for (let i = quartMap.length - 1; i >= 0; i--) {
      flipped.push(quartMap[i].slice());
    }
    return flipped;
  }

  static flipHorizontally(quartMap) {
    const flipped = [];
    for (let i = 0; i < quartMap.length; i++) {
      const row = quartMap[i];
      const flippedRow = [];
      flipped.push(flippedRow);
      for (let j = 0; j < row.length; j++) {
        flippedRow[row.length - 1 - j] = row[j];
      }
    }
    return flipped;
  }

  static generateTopLeftQuart(quartWidth, quartHeight, machines) {

    const mapQuart = [];

    for (let i = 0; i < quartHeight; i++) {
      const row = mapQuart[i] = [];
      for (let j = 0; j < quartWidth; j++) {
        row[j] = WALL;
      }
    }

    for (let i = 1; i < quartWidth - 1; i++) {
      mapQuart[1][i] = CABLE;
      mapQuart[quartHeight - 2][i] = CABLE;
    }

    for (let i = 1; i < quartHeight - 1; i++) {
      mapQuart[i][1] = CABLE;
      mapQuart[i][quartWidth - 2] = CABLE;
    }

    mapQuart[quartHeight - 1][quartWidth - 2] = EMPTY;
    mapQuart[quartHeight - 2][quartWidth - 2] = EMPTY;
    mapQuart[quartHeight - 2][quartWidth - 1] = EMPTY;

    // columns..
    for (let i = 3; i < quartWidth - 4; i++) {
      if (Math.random() > 0.5) {
        for (let j = 2; j < quartHeight - 2; j++) {
          mapQuart[j][i] = CABLE;
        }
        i++;
      }
    }

    // rows..
    for (let i = 3; i < quartHeight - 4; i++) {
      if (Math.random() > 0.5) {
        for (let j = 2; j < quartWidth - 2; j++) {
          mapQuart[i][j] = CABLE;
        }
        i++;
      }
    }

    // on right edge..
    for (let i = 1; i <= quartHeight - 4; i++) {
      if (Math.random() > 0.75) {
        mapQuart[i][quartWidth-1] = CABLE;
        i++;
      }
    }

    // on bottom edge..

    // make box wider maybe..
    let lastSpace = quartWidth - 2;
    for (let i = 0; i < 2; i++) {
      if (Math.random() > 0.5) {
        mapQuart[quartHeight-1][lastSpace] = WALL;
        lastSpace--;
        mapQuart[quartHeight-1][lastSpace] = EMPTY;
        mapQuart[quartHeight-2][lastSpace] = EMPTY;
      } else {
        break;
      }
    }

    for (let i = 1; i <= lastSpace - 2; i++) {
      if (Math.random() > 0.75) {
        mapQuart[quartHeight-1][i] = CABLE;
        i++;
      }
    }

    // add machines..

    mapQuart[2][2] = MACHINE;
    machines--;

    const potentialMachinePositions = {};
    for (let i = 1; i < mapQuart.length - 1; i++) {
      for (let j = 1; j < mapQuart[0].length - 1; j++) {
        const isWallWithAdjacentCable = mapQuart[i][j] === WALL && (
              mapQuart[i-1][j] === CABLE || mapQuart[i+1][j] === CABLE ||
              mapQuart[i][j-1] === CABLE || mapQuart[i][j+1] === CABLE
            );
        if (isWallWithAdjacentCable) {
          potentialMachinePositions[i + ',' + j] = true;
        }
      }
    }

    for (let position of Utils.shuffle(Object.keys(potentialMachinePositions))) {
      const [i,j] = position.split(',').map(v => v << 0);
      const nextToMachine = mapQuart[i-1][j] === MACHINE || mapQuart[i+1][j] === MACHINE ||
                            mapQuart[i][j-1] === MACHINE || mapQuart[i][j+1] === MACHINE;
      if (!nextToMachine) {
        mapQuart[i][j] = MACHINE;
        if (--machines <= 0) {
          break;
        }
      }
    }

    return mapQuart;
  }
}

class Scorer {
  constructor(players) {
    this.players = players;
    this.player1Score = 0;
    this.player2Score = 0;
    this.hiScore = localStorage.getItem('hiScore') || 500;
  }
  addToPlayerScore(isPlayer1, points) {
    let score;
    if (isPlayer1) {
      score = this.player1Score += points;
    } else {
      score = this.player2Score += points;
    }
    if (score > this.hiScore) {
      this.hiScore = score;
      localStorage.setItem('hiScore', score);
    }
  }
  render(graphicsContext, dimensions) {
    const letterWidth = 7;
    const topEdge = 7;
    const sideEdge = 24;

    if (this.players > 0) {
      Utils.drawSprite(graphicsContext, sideEdge, topEdge, P_1);
      Utils.drawNumber(graphicsContext, sideEdge + letterWidth * 3, topEdge, this.player1Score, 6);
    }

    const hiLength = Math.max(('' + this.hiScore).length, 6);
    const x = dimensions.width / 2 - ((hiLength + 3) * letterWidth) / 2;
    Utils.drawSprite(graphicsContext, x, topEdge, HI);
    Utils.drawNumber(graphicsContext, x + letterWidth * 3, topEdge, this.hiScore, 6);

    if (this.players > 1) {
      const x =  dimensions.width - sideEdge - 9 * letterWidth;
      Utils.drawSprite(graphicsContext, x, topEdge, P_2);
      Utils.drawNumber(graphicsContext, x + letterWidth * 3, topEdge, this.player1Score, 6);
    }
  }
}

class LevelLabel {
  constructor(difficulty) {
    this.difficulty = difficulty;
  }
  render(graphicsContext, dimensions) {
    const sideEdge = 50;
    const letterHeight = 7;
    const letterWidth = 7;
    const topEdge = dimensions.height - 7 - letterHeight;
    Utils.drawSprite(graphicsContext, sideEdge, topEdge, LEVEL_LABEL);
    Utils.drawNumber(graphicsContext, sideEdge + letterWidth * 6, topEdge, this.difficulty, 0);
  }
}

class Timer {
  constructor(maxTime) {
    this.maxTime = maxTime;
    this.timeLeft = maxTime;
  }
  tick() {
    this.timeLeft = Math.max(0, this.timeLeft-1);
  }
  reset() {
    this.timeLeft = this.maxTime;
  }
  isTimeOver() {
    return this.timeLeft <= 0;
  }
  render(graphicsContext, dimensions) {
    const letterWidth = 7;
    const sideEdge = dimensions.width - 50 - 8 * letterWidth;
    const letterHeight = 7;
    const topEdge = dimensions.height - 7 - letterHeight;
    Utils.drawSprite(graphicsContext, sideEdge, topEdge, TIME_LABEL);
    Utils.drawNumber(graphicsContext, sideEdge + letterWidth * 5, topEdge, this.timeLeft, 3);
  }
}

class Level extends GameElement {
  constructor(x, y, difficulty, scorer, timer) {
    super(x, y);

    this.frozenCount = 0;
    this.scorer = scorer;
    this.timer = timer;

    const width = Math.min(25, 15 + Math.floor(2 * Math.random() * difficulty));
    const height = Math.min(13, 11 + Math.floor(Math.random() * difficulty / 2));
    const machines = Math.min(15, 6 + Math.floor(2 * Math.random() * difficulty));
    const engineers = Math.ceil(difficulty / 2);
    const guards = 1 + Math.floor(difficulty / 2);

    this.setLevel(LevelGenerator.generateLevel(width, height, machines, engineers, guards));
  }

  freezeEnemies() {
    this.frozenCount = 3;
    for (let enemy of this.enemies) {
      enemy.freeze();
    }
  }

  unFreezeEnemies() {
    for (let enemy of this.enemies) {
      enemy.unFreeze();
    }
    this.frozenCount = 0;
  }

  step(key) {
    this.player1.step(this.map, key);

    // if they've moved onto an empty don't move it.
    let killer = null;
    for (let enemy of this.enemies) {
      if (enemy.x === this.player1.x && enemy.y === this.player1.y) {
        killer = enemy;
        break;
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.step(this.map, this.player1, killer !== enemy);
    }

    this.map.step();

    if (--this.frozenCount === 0) {
      this.unFreezeEnemies();
    }
  }

  isWin() {
    for (let machine of this.map.machines) {
      if (machine.isOnline()) {
        return false;
      }
    }
    return true;
  }

  machineWentOffline() {
    for (let machine of this.map.machines) {
      if (machine.wentOffline) {
        return true;
      }
    }
    return false;
  }

  isGameOver() {
    if (this.timer.isTimeOver()) {
      return true;
    }
    for (let enemy of this.enemies) {
      if (enemy.x === this.player1.x && enemy.y === this.player1.y) {
        return true;
      }
    }
    return false;
  }

  canStep(key) {
    return this.player1.canMove(this.map, key);
  }

  onRender(graphicsContext, transition, dimensions) {
    this.map.render(graphicsContext, transition);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].render(graphicsContext, transition);
    }
    this.player1.render(graphicsContext, transition);
    if (this.player2) {
      this.player2.render(graphicsContext, transition);
    }
  }

  setLevel(level) {
    let nextEnemyId = 0;
    this.enemies = [];

    for (let i = 0; i < level.objects.length; i++) {
      const object = level.objects[i];
      switch (object.type) {
        case PLAYER_1:
          this.player1 = new Player(object.x, object.y, this, true);
          break;
        case GUARD:
          this.enemies.push(new Guard(object.x, object.y, this, nextEnemyId++));
          break;
        case ENGINEER:
          this.enemies.push(new Engineer(object.x, object.y, this, nextEnemyId++));
          break;
      }
    }

    const width = level.width;
    const height = level.map.length / width;

    const rows = [];
    const staticElements = [];
    const walls = [];

    let row = [];

    for (let i = 0; i < level.map.length; i++) {
      const position = level.map[i];
      const x = i % width;
      const y = Math.floor(i / width);

      switch (position) {
        case WALL:
          const wall =new Wall(x, y, this.map);
          row.push(wall);
          walls.push(wall);
          break;
        case MACHINE:
          const machine = new Machine(x, y, { online: true });
          row.push(machine);
          staticElements.push(machine);
          break;
        default:
          const cable = position === CABLE;
          const space = new Space(x, y, { cable, online: true });
          row.push(space);
          staticElements.push(space);
      }

      if (x === width - 1) {
        rows.push(row);
        row = [];
      }
    }

    this.map = new Map(0, 0, rows);

    for (let wall of walls) {
      wall.map = this.map;
    }

    for (let staticElement of staticElements) {
      const neighbours = staticElement.neighbours;
      const x = staticElement.x;
      const y = staticElement.y;

      if (x < width - 1) {
        const right = rows[y][x+1];
        if (!(right instanceof Wall)) {
          neighbours[RIGHT] = right;
          right.neighbours[LEFT] = staticElement;
        }
      }
      if (y < height - 1) {
        const down = rows[y+1][x];
        if (!(down instanceof Wall)) {
          neighbours[DOWN] = down;
          down.neighbours[UP] = staticElement;
        }
      }

      staticElement.exits = this.map.getExits(x, y);
    }
  }
}

class Map extends GameElement {
  constructor(x, y, map) {
    super(0, 0);
    this.map = map;

    this.machines = [];
    this.forEach((cell) => {
      if (cell instanceof Machine) {
        this.machines.push(cell);
      }
    });

    this.width = this.map[0].length;
    this.height = this.map.length;
    this.maxDist = this.width + this.height;

    this.staticElementsImage = null;
  }

  createStaticElementsImage() {
    this.staticElementsImage = Utils.getCanvas(this.width * TILE_SIDE, this.height * TILE_SIDE);
    const context = this.staticElementsImage.getContext('2d');
    context.imageSmoothingEnabled = false;
    this.renderStaticElements(context);
  }

  isSpace(x, y) {
    return this.get(x, y) instanceof Space;
  }

  isEmptySpace(x, y) {
    return !this.get(x, y).isCable();
  }

  findNearestEmptySpace(x, y, dir) {
    const seen = {};
    seen[this._seenKey(x, y)] = true;
    return this._findNearestEmptySpace([{x, y, dir}], seen);
  }

  _seenKey(x, y) {
    return '' + x + ',' + y;
  }

  _findNearestEmptySpace(queue, seen) {
    const next = queue.shift();
    if (!next) {
      return;
    }
    if (this.isEmptySpace(next.x, next.y)) {
      return next;
    }

    const {x,y,dir} = next;
    const nextLot = [];
    const exits = this.getExits(x, y);
    if (exits[UP] && dir !== DOWN && !seen[this._seenKey(x, y - 1)]) {
      nextLot.push({x: x, y: y - 1, dir: UP});
    }
    if (exits[DOWN] && dir != UP && !seen[this._seenKey(x, y + 1)]) {
      nextLot.push({x: x, y: y + 1, dir: DOWN});
    }
    if (exits[LEFT] && dir != RIGHT && !seen[this._seenKey(x - 1, y)]) {
      nextLot.push({x: x - 1, y: y, dir: LEFT});
    }
    if (exits[RIGHT] && dir != LEFT && !seen[this._seenKey(x + 1, y)]) {
      nextLot.push({x: x + 1, y: y, dir: RIGHT});
    }
    for (let i = 0; i < nextLot.length; i++) {
      const after = nextLot[i];
      seen[this._seenKey(after.x, after.y)] = true;
    }
    Utils.shuffle(nextLot);

    queue.push.apply(queue, nextLot);

    return this._findNearestEmptySpace(queue, seen);
  }

  get(x, y) {
    return this.map[y][x];
  }

  forEach(func) {
    for (let i = 0; i < this.map.length; i++) {
      let row = this.map[i];
      for (let j = 0; j < row.length; j++) {
        func(row[j]);
      }
    }
  }

  getExits(x, y) {
    const exits = [false, false, false, false];
    const map = this.map;
    if (y > 0 && this.isSpace(x, y-1)) {
      exits[UP] = true;
    }
    if (y < map.length - 1 && this.isSpace(x, y+1)) {
      exits[DOWN] = true;
    }
    if (x < map[0].length - 1 && this.isSpace(x+1, y)) {
      exits[RIGHT] = true;
    }
    if (x > 0 && this.isSpace(x-1, y)) {
      exits[LEFT] = true;
    }

    return exits;
  }

  step() {
    const machines = [];
    const cables = [];

    // update online status..
    for (let row = 0; row < this.map.length; row++) {
      const rowData = this.map[row];
      for (let col = 0; col < rowData.length; col++) {
        const cell = rowData[col];
        cell.connectedTo = {};
        if (cell instanceof Machine) {
          machines.push(cell);
        } else if (cell instanceof Space && cell.isCable()) {
          cables.push(cell);
        }
      }
    }

    for (let machine of machines) {
      this._addConnectedTo(machine, machine);
    }

    for (let machine of machines) {
      machine.setState({ online: Object.keys(machine.connectedTo).length > 1 });
    }

    for (let cable of cables) {
      let online = false;
      const connectedToIds = Object.keys(cable.connectedTo);
      for (let connectedToId of connectedToIds) {
        if (cable.connectedTo[connectedToId].isOnline()) {
          online = true;
          break;
        }
      }
      cable.setState({cable: true, online});
    }

    for (let row = 0; row < this.map.length; row++) {
      const rowData = this.map[row];
      for (let col = 0; col < rowData.length; col++) {
        rowData[col].step();
      }
    }

  }

  _addConnectedTo(staticElement, machine) {
    if (!staticElement.connectedTo[machine.id]) {
      staticElement.connectedTo[machine.id] = machine;
      for (let neighbour of staticElement.neighbours) {
        if (neighbour && neighbour.isConnectable()) {
          this._addConnectedTo(neighbour, machine);
        }
      }
    }
  }

  renderStaticElements(graphicsContext) {
    const width = this.width * TILE_SIDE;
    const height =  this.height * TILE_SIDE;
    graphicsContext.fillStyle = 'black';
    graphicsContext.fillRect(0, 0, width, height);

    this.forEach(cell => (cell instanceof Wall) && cell.render(graphicsContext));
  }

  renderSpacesAndMachines(graphicsContext, transition) {
    this.forEach(cell => !(cell instanceof Wall) && cell.render(graphicsContext, transition));
  }

  onRender(graphicsContext, transition) {
    graphicsContext.translate(this.x, this.y);
    this.staticElementsImage || this.createStaticElementsImage();
    graphicsContext.drawImage(this.staticElementsImage, 0, 0);
    this.renderSpacesAndMachines(graphicsContext, transition);
  }
}

class Wall extends GameElement {
  constructor(x, y) {
    super(x, y);
    this.map = null; // Note: must be set before rendering.
  }
  onRender(graphicsContext) {
    const topLeftImage = this.getCornerImage(this.x - 1, this.y - 1, UP_LEFT_CORNER, LEFT_STRAIGHT, UP_STRAIGHT, UP_LEFT_INSIDE_CORNER);
    const topRightImage = this.getCornerImage(this.x + 1, this.y - 1, UP_RIGHT_CORNER, RIGHT_STRAIGHT, UP_STRAIGHT, UP_RIGHT_INSIDE_CORNER);
    const downLeftImage = this.getCornerImage(this.x - 1, this.y + 1, DOWN_LEFT_CORNER, LEFT_STRAIGHT, DOWN_STRAIGHT, DOWN_LEFT_INSIDE_CORNER);
    const downRightImage = this.getCornerImage(this.x + 1, this.y + 1, DOWN_RIGHT_CORNER, RIGHT_STRAIGHT, DOWN_STRAIGHT, DOWN_RIGHT_INSIDE_CORNER);

    const x = this.x * TILE_SIDE;
    const y = this.y * TILE_SIDE;

    topLeftImage && Utils.drawSprite(graphicsContext, x, y, topLeftImage);
    topRightImage && Utils.drawSprite(graphicsContext, x + HALF_TILE_SIDE, y, topRightImage);
    downLeftImage && Utils.drawSprite(graphicsContext, x, y + HALF_TILE_SIDE, downLeftImage);
    downRightImage && Utils.drawSprite(graphicsContext, x + HALF_TILE_SIDE, y + HALF_TILE_SIDE, downRightImage);
  }

  getCornerImage(alteredX, alteredY, cornerImage, horizontalStraightImage, verticalStraightImage, insideCornerImage) {
    if (alteredX < 0 ||  alteredX > this.map.width - 1 || alteredY < 0 || alteredY > this.map.height - 1) {
      return;
    }
    const spaceHorizontally = this.map.isSpace(alteredX, this.y);
    const spaceVertically = this.map.isSpace(this.x, alteredY);

    if (spaceHorizontally) {
      return spaceVertically ? cornerImage : horizontalStraightImage;
    }
    if (spaceVertically) {
      return verticalStraightImage;
    }

    const showCorner = this.map.isSpace(alteredX, alteredY);
    return showCorner ? insideCornerImage : undefined;
  }
}

class StaticElement extends GameElement {
  constructor(x, y, state) {
    super(x, y);
    this.state = state;
    this.oldState = state;
    this._stateSet = false;
    this.neighbours = []; // Note: must be set before rendering.
    this.exits = []; // Note: must be set before rendering.
    this.connectedTo = {}; //Updated on each step.
  }

  isConnectable() {
    return true;
  }

  setState(newState) {
    if (!this._stateSet) {
      this.oldState = this.state;
      this._stateSet = true;
    }
    this.state = newState;
  }

  step() {
    if (this._stateSet) {
      this._stateSet = false;
    } else {
      this.oldState = this.state;
    }
  }
}

let NEXT_MACHINE_ID = 1;

class Machine extends StaticElement {
  constructor(x, y, state) {
    super(x, y, state);
    this.id = NEXT_MACHINE_ID++;
    this.wentOffline = false;
  }

  isOnline() {
    return this.state.online;
  }

  setState(newState) {
    super.setState(newState);
    if (this.oldState.online && !this.state.online) {
      this.wentOffline = true;
    } else {
      this.wentOffline = false;
    }
  }

  spriteForState(state) {
    return state.online ? MACHINE_ONLINE : MACHINE_OFFLINE;
  }

  onRender(graphicsContext, transition) {
    const {x, y} = this;
    const oldSprite = this.spriteForState(this.oldState);
    const newSprite = this.spriteForState(this.state);

    Utils.drawSprite(graphicsContext, TILE_SIDE * x, TILE_SIDE * y, oldSprite);

    if (oldSprite != newSprite) {
      graphicsContext.save();
      graphicsContext.globalAlpha = Math.min(transition, graphicsContext.globalAlpha);
      Utils.drawSprite(graphicsContext, TILE_SIDE * x, TILE_SIDE * y, newSprite);
      graphicsContext.restore();
    }
  }
}

class Space extends StaticElement {
  constructor(x, y, state) {
    super(x, y, state);
  }

  isOnline() {
    return this.state.online;
  }

  isConnectable() {
    return this.isCable();
  }

  isCable() {
    return this.state.cable;
  }

  spriteForState(state) {
    return !state.cable ? CABLE_NONE :
            state.online ? CABLE_ONLINE : CABLE_OFFLINE;
  }

  renderCablePart(graphicsContext, direction, sprite) {
    let x = this.x * TILE_SIDE + 5;
    let y = this.y * TILE_SIDE + 5;
    const diff = 4;
    if (direction === RIGHT) {
      x += diff;
    } else if (direction === DOWN) {
      y += diff;
    } else if (direction === LEFT) {
      x -= diff;
    } else if (direction === UP) {
      y -= diff;
    }

    Utils.drawSprite(graphicsContext, x, y, sprite);
  }

  onRender(graphicsContext, transition) {
    const {x, y} = this;
    const oldSprite = this.spriteForState(this.oldState);
    const newSprite = this.spriteForState(this.state);

    for (let dir of [NONE, UP, RIGHT, DOWN, LEFT]) {
      if (dir === NONE || this.neighbours[dir]) {
        this.renderCablePart(graphicsContext, dir, oldSprite);
        if (oldSprite != newSprite) {
          graphicsContext.save();
          graphicsContext.globalAlpha = Math.min(transition, graphicsContext.globalAlpha);
          this.renderCablePart(graphicsContext, dir, newSprite);
          graphicsContext.restore();
        }
      }
    }
  }
}

class MovingElement extends GameElement {
  constructor(x, y, level) {
    super(x, y);
    this.level = level;
    this.oldX = x;
    this.oldY = y;
  }

  step() {
    this.oldX = this.x;
    this.oldY = this.y;
  }

  getInTransitX(transition) {
    return this.getInTransitValue(this.oldX, this.x, transition);
  }

  getInTransitY(transition) {
    return this.getInTransitValue(this.oldY, this.y, transition);
  }

  getInTransitValue(oldValue, value, transition) {
    return oldValue + (value - oldValue) * transition;
  }
}

class Player extends MovingElement {
  constructor(x, y, level, isPlayer1) {
    super(x, y, level);
    this.isPlayer1 = isPlayer1;
  }

  onRender(graphicsContext, transition) {
    const x = this.getInTransitX(transition)
    const y = this.getInTransitY(transition);
    const sprite = this.level.isGameOver() ? YELLOW_FACE_SAD : YELLOW_FACE_HAPPY;
    Utils.drawSprite(graphicsContext, TILE_SIDE * x, TILE_SIDE * y, sprite);
  }

  step(map, key) {
    super.step();

    switch (key.value) {
      case UP:
        this.y--;
        break;
      case LEFT:
        this.x--;
        break;
      case DOWN:
        this.y++;
        break;
      case RIGHT:
        this.x++;
        break;
    }

    const position = map.get(this.x, this.y);
    if (position.isCable()) {
      this.level.scorer.addToPlayerScore(this.isPlayer1, CABLE_POINTS);
      position.setState({cable: false});
    }
  }
  canMove(map, key) {
    const exits = map.getExits(this.x, this.y);
    if (!exits[key.value]) {
      return false;
    }

    return true;
  }
}

class Enemy extends MovingElement {
  constructor(x, y, level, id, sprite) {
    super(x, y, level);
    this.id = id;
    this.sprite = sprite;
    this.frozen = false;
    this.dir = NONE;
  }

  freeze() {
    this.oldFrozen = this.frozen;
    this.frozen = true;
  }

  unFreeze() {
    this.oldFrozen = this.frozen;
    this.frozen = false;
  }

  step() {
    super.step();
    this.oldFrozen = this.frozen;
  }

  goTowards(map, x, y) {
    let dir = NONE;
    const exits = map.getExits(this.x, this.y);

    if (exits[RIGHT] && this.dir !== LEFT &&
        (x > this.x || (!exits[UP] && !exits[DOWN]))) {
      dir = RIGHT;
    } else if (exits[LEFT] && this.dir !== RIGHT &&
        (x < this.x || (!exits[UP] && !exits[DOWN]))) {
      dir = LEFT;
    } else if (exits[UP] && this.dir !== DOWN &&
        (y < this.y || (!exits[LEFT] && !exits[RIGHT]))) {
      dir = UP;
    } else if (exits[DOWN] && this.dir !== UP &&
        (y > this.y || (!exits[LEFT] && !exits[RIGHT]))) {
      dir = DOWN;
    } else if (exits[this.dir]) {
      dir = this.dir; //carry on..
    } else {
      // pick a direction..
      switch (this.dir) {
        case UP:
          dir = exits[LEFT] ? LEFT : exits[RIGHT] ? RIGHT : NONE;
          break;
        case DOWN:
          dir = exits[RIGHT] ? RIGHT : exits[LEFT] ? LEFT : NONE;
          break;
        case LEFT:
          dir = exits[UP] ? UP : exits[DOWN] ? DOWN : NONE;
          break;
        case RIGHT:
          dir = exits[DOWN] ? DOWN : exits[UP] ? UP : NONE;
      }
    }

    const updatedPosition = this.getPositionInDirection(dir);
    for (let enemy of this.level.enemies) {
      if (enemy.id < this.id) {
        if (enemy.x === updatedPosition.x && enemy.y === updatedPosition.y) {
          dir = NONE;
          break;
        }
      } else {
        break;
      }
    }

    return dir;
  }

  getPositionInDirection(dir) {
    return {
      x: this.x + (dir === LEFT ? -1 : dir === RIGHT ? 1 : 0),
      y: this.y + (dir === DOWN ? 1 : dir === UP ? -1 : 0)
    };
  }

  updatePositionUsingDirection() {
    const updatedPosition = this.getPositionInDirection(this.dir);
    this.x = updatedPosition.x;
    this.y = updatedPosition.y;
  }

  randomTarget(map) {
    return { x: Utils.randomInt(map.width), y: Utils.randomInt(map.height)};
  }

  onRender(graphicsContext, transition) {
    const x = this.getInTransitX(transition);
    const y = this.getInTransitY(transition);

    const oldSprite = this.oldFrozen ? BLUE_FACE : this.sprite;
    const newSprite = this.frozen ? BLUE_FACE : this.sprite;

    Utils.drawSprite(graphicsContext, TILE_SIDE * x, TILE_SIDE * y, oldSprite);

    if (oldSprite != newSprite) {
      graphicsContext.save();
      graphicsContext.globalAlpha = Math.min(transition, graphicsContext.globalAlpha);
      Utils.drawSprite(graphicsContext, TILE_SIDE * x, TILE_SIDE * y, newSprite);
      graphicsContext.restore();
    }
  }
}

class Guard extends Enemy {
  constructor(x, y, level, id) {
    super(x, y, level, id, RED_FACE);
  }

  step(map, player, move) {
    super.step(map);

    if (move && !this.frozen) {
      const distToPlayer = Utils.distanceBetween(player, this);
      const followPlayer = Math.random() > distToPlayer / map.maxDist;

      const target = followPlayer ? player : this.randomTarget(map);

      this.dir = this.goTowards(map, target.x, target.y);
      this.updatePositionUsingDirection();
    }
  }
}

class Engineer extends Enemy {
  constructor(x, y, level, id) {
    super(x, y, level, id, GREEN_FACE);
    this.skipStep = true;
  }

  step(map, player, move) {
    super.step(map);

    if (this.frozen) {
      return;
    }

    if (!this.skipStep && move) {
      const target = map.findNearestEmptySpace(this.x, this.y, this.dir) || this.randomTarget(map);
      this.dir = this.goTowards(map, target.x, target.y);
      this.updatePositionUsingDirection();

      const cell = map.get(this.x, this.y);
      if (!cell.isCable()) {
        cell.setState({cable: true, online: false});
      }
    }

    this.skipStep = !this.skipStep;
  }
}

const KEYS_TO_HANDLE = [];

class Key {
  constructor(code, value) {
    this.code = code;
    this.value = value;
    this.isDown = false;
    Key.register(this);
  }

  keyDown() {
    this.isDown = true;
  }

  keyUp() {
    this.isDown = false;
  }

  clear() {
    this.isDown = false;
  }

  static register(key) {
    if (!KEYS_TO_HANDLE.length) {
      window.addEventListener('keydown', Key.keyDownHandler);
      window.addEventListener('keyup', Key.keyUpHandler);
    }
    KEYS_TO_HANDLE.push(key);
  }

  static keyDownHandler(e) {
    const code = e.code;

    for (let key of KEYS_TO_HANDLE) {
      if (key.code === code) {
        key.keyDown();
        break;
      }
    }
  }

  static keyUpHandler(e) {
    const code = e.code;
    for (let key of KEYS_TO_HANDLE) {
      if (key.code === code) {
        key.keyUp();
        break;
      }
    }
  }
}

class Inputs {
  constructor() {
    this.keys = [
      new Key('KeyN', NONE),
      new Key('ArrowUp', UP),
      new Key('ArrowRight', RIGHT),
      new Key('ArrowDown', DOWN),
      new Key('ArrowLeft', LEFT),
      new Key('KeyS', S),
      new Key('Enter', ENTER),
    ];
  }

  getInput() {
    for (let key of this.keys) {
      if (key.isDown) {
        return key;
      }
    }
  }

  clear() {
    for (let key of this.keys) {
      key.clear();
    }
  }
}

class State {
  constructor(id, inputs, toNextState) {
    this.id = id;
    this.inputs = inputs;
    this.toNextState = toNextState;
  }
  onFrame() {}
}


class Loading extends State {
  constructor(inputs, toNextState) {
    super(LOADING, inputs, toNextState);

    this.loaded = 0;
    this.toLoad = 1;

    Utils.loadImage('./art.png', image => {
      ART = image;
      this.loaded++;
    });
    // Utils.loadSpriteMap('./images/spriteMap.json', response => {
    //   spriteMap = JSON.parse(response.responseText);
    //   this.loaded++;
    // });
  }

  isReady() {
    return this.loaded === this.toLoad;
  }

  onFrame() {
    if (this.isReady()) {
      this.toNextState(MENU);
    } else {
      // TODO: show loading stuff..
    }
  }
}

class Menu extends State {
  constructor(inputs, toNextState) {
    super(MENU, inputs, toNextState);
    this.alpha = 0;
    this.step = 0.02;
    this.states = {
      FADE_IN: 1,
      WAITING: 2,
      FADE_OUT: 3
    };
    this.state = this.states.FADE_IN;
  }

  handleInput() {
    if (this.state === this.states.WAITING) {
      const key = this.inputs.getInput();
      if (key && (key.value === S || key.value === ENTER)) {
        this.state = this.states.FADE_OUT;
      }
    }
  }

  handleStateChanges() {
    switch (this.state) {
      case this.states.FADE_IN:
        this.alpha = Math.min(this.alpha + this.step, 1);
        if (this.alpha === 1) {
          this.state = this.states.WAITING;
        }
        break;
      case this.states.FADE_OUT:
        this.alpha = Math.max(0, this.alpha - this.step);
        if (this.alpha === 0) {
          this.toNextState(IN_GAME);
        }
    }
  }

  render(graphicsContext, dimensions) {
    graphicsContext.fillStyle = 'black';
    graphicsContext.fillRect(0, 0, dimensions.width, dimensions.height);

    graphicsContext.save();

    graphicsContext.globalAlpha = this.alpha;

    Utils.horizontallyCentreSprite(graphicsContext, 50, LOGO, dimensions.width);
    Utils.horizontallyCentreSprite(graphicsContext, 100, START, dimensions.width);

    graphicsContext.restore();
  }

  onFrame(graphicsContext, dimensions) {
    this.handleInput();
    this.handleStateChanges();
    this.render(graphicsContext, dimensions);
  }
}

class InGame extends State {
  constructor(inputs, toNextState) {
    super(IN_GAME, inputs, toNextState);

    this.states = {
      FADE_IN: 1,
      READY: {
        sign: READY_SIGN,
        framesToShowSign: 30,
        nextState: () => this.states.GO
      },
      GO: {
        sign: GO_SIGN,
        framesToShowSign: 30,
        nextState: () => this.states.PLAYING
      },
      PLAYING: 4,
      WIN: {
        sign: LEVEL_CLEAR_SIGN,
        framesToShowSign: 120,
        nextState: () => this.states.FADE_OUT_TO_NEXT_LEVEL
      },
      GAME_OVER: {
        sign: GAME_OVER_SIGN,
        framesToShowSign: 120,
        nextState: () => this.states.FADE_OUT_TO_MENU
      },
      FADE_OUT_TO_NEXT_LEVEL: 7,
      FADE_OUT_TO_MENU: 8
    };
    this.state = this.states.FADE_IN;

    this.difficulty = 1;
    this.scorer = new Scorer(1);
    this.levelLabel = new LevelLabel(this.difficulty);
    this.timer = new Timer(900);
    this.level = new Level(0, 0, this.difficulty, this.scorer, this.timer);

    this.alpha = 0;
    this.alphaStep = 0.02;

    this.signAlpha = 0;
    this.signFadingIn = true;
    this.signAlphaStep = 0.03;
    this.framesTillFade = 0;

    this.frameNumber = 1; // TODO: remove this as it's ugly!
    this.transition = 1;
    this.transitionStep = 0.08;
  }

  tween(transition) {
    return transition * transition * transition;
  }

  render(graphicsContext, dimensions) {
    graphicsContext.fillStyle = 'black';
    graphicsContext.fillRect(0, 0, dimensions.width, dimensions.height);

    graphicsContext.save();

    graphicsContext.globalAlpha = this.alpha;

    const transition = this.tween(this.transition);
    const offsetX = (dimensions.width - (this.level.map.width * TILE_SIDE)) / 2;
    const offsetY = (dimensions.height - (this.level.map.height * TILE_SIDE)) / 2;
    graphicsContext.translate(offsetX, offsetY);
    this.level.render(graphicsContext, transition, dimensions);

    graphicsContext.translate(-offsetX,-offsetY);

    this.scorer.render(graphicsContext, dimensions);
    this.timer.render(graphicsContext, dimensions);
    this.levelLabel.render(graphicsContext, dimensions);

    if (this.state.sign) {
      graphicsContext.globalAlpha = this.signAlpha;
      Utils.centreSprite(graphicsContext, this.state.sign, dimensions.width, dimensions.height);
    }

    graphicsContext.restore();
  }

  increaseFrameCount() {
    this.frameNumber++;
    this.transition = Math.min(1, this.transition + this.transitionStep);
  }

  handleSignState() {
    this.increaseFrameCount();
    if (this.transition !== 1) {
      return;
    }
    if (this.signFadingIn) {
      this.signAlpha = Math.min(this.signAlpha + this.signAlphaStep, 1);
      if (this.signAlpha === 1) {
        this.signFadingIn = false;
        this.framesTillFade = this.state.framesToShowSign;
      }
    } else {
      if (this.framesTillFade-- <= 0) {
        this.signAlpha = Math.max(this.signAlpha - this.signAlphaStep, 0);
        if (this.signAlpha === 0) {
          this.signFadingIn = true;
          this.state = this.state.nextState();
        }
      }
    }
  }

  fadeOut() {
    this.alpha = Math.max(this.alpha - this.alphaStep, 0);
    return this.alpha === 0;
  }

  levelUp() {
      this.difficulty++;
      this.level = new Level(0, 0, this.difficulty, this.scorer, this.timer);
      this.signAlpha = 0;
      this.signFadingIn = true;
      this.frameNumber = 1;
      this.transition = 1;
      this.timer.reset();
      this.levelLabel.difficulty = this.difficulty;
      this.state = this.states.FADE_IN;
  }

  onFrame(graphicsContext, dimensions) {
    // TODO: tidy this up - too much state.
    if (this.state === this.states.FADE_IN) {
      this.alpha = Math.min(this.alpha + this.alphaStep, 1);
      if (this.alpha === 1) {
        this.state = this.states.READY;
      }
    } else if (this.state.sign) {
      this.handleSignState();
    } else if (this.state === this.states.PLAYING) {
        if (this.frameNumber % 30 === 0) {
          let input = this.inputs.getInput();
          if  (input && this.level.canStep(input)) {
            this.inputs.clear();
            this.level.step(input);
            this.timer.tick();
            if (this.level.isGameOver()) {
              this.state = this.states.GAME_OVER;
            } else if (this.level.isWin()) {
              this.state = this.states.WIN;
            } else if (this.level.machineWentOffline()) {
              this.level.freezeEnemies();
            }
            this.transition = 0;
            this.frameNumber = 1;
          }
        } else {
          this.increaseFrameCount();
        }
    } else if (this.state === this.states.FADE_OUT_TO_MENU) {
        this.fadeOut() && this.toNextState(MENU);
    } else if (this.state === this.states.FADE_OUT_TO_NEXT_LEVEL) {
        this.fadeOut() && this.levelUp();
    }

    this.render(graphicsContext, dimensions);
  }
}

class Game {
  constructor(canvas) {
    this.inputs = new Inputs();

    this.graphicsContext = canvas.getContext('2d');
    this.graphicsContext.imageSmoothingEnabled = false;

    const scale = 2;
    this.graphicsContext.scale(scale, scale);
    this.dimensions = {width: canvas.width / scale, height: canvas.height / scale};

    this.toNextState = nextStateId => {
      this.state = nextStateId === LOADING ? new Loading(this.inputs, this.toNextState) :
                nextStateId === MENU ? new Menu(this.inputs, this.toNextState) :
                new InGame(this.inputs, this.toNextState);
    };

    this.toNextState(LOADING);

    this.onFrame = this.onFrame.bind(this);
    window.requestAnimationFrame(this.onFrame);
  }

  onFrame() {
    this.state.onFrame(this.graphicsContext, this.dimensions);
    window.requestAnimationFrame(this.onFrame);
  }
}
