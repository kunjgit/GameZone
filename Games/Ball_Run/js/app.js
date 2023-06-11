(function () {
    "use strict";
    var root = this;
    var sqrtOf2 = Math.sqrt(2);
    var degToRadFactor = Math.PI / 180;

    var degToRad = function (degrees) {
        return degToRadFactor * degrees;
    };

    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.zero = function () {
        return new this(0, 0);
    };

    Vector.getSquaredDistance = function (p1, p2) {
        return p1.sub(p2).getSquaredLength();
    };

    Vector.direction = function (angleInRadians) {
        var x = Math.cos(angleInRadians), y = Math.sin(angleInRadians);
        return new this(x, y);
    };

    var vecproto = Vector.prototype;

    vecproto.clone = function () {
        return new this.constructor(this.x, this.y);
    };

    vecproto._addCoords = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };

    vecproto._add = function (b) {
        return this._addCoords(b.x, b.y);
    };

    vecproto._sub = function (b) {
        return this._addCoords(-b.x, -b.y);
    };

    vecproto._scalarMul = function (c) {
        this.x *= c;
        this.y *= c;
        return this;
    };

    vecproto._normalize = function () {
        return this._scalarMul(1.0 / this.getLength());
    };

    vecproto.reset = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };

    vecproto.add = function (b) {
        return this.clone()._add(b);
    };

    vecproto.sub = function (b) {
        return this.clone()._sub(b);
    };

    vecproto.scalarMul = function (c) {
        return this.clone()._scalarMul(c);
    };

    vecproto.neg = function () {
        return new this.constructor(-this.x, -this.y);
    };

    vecproto.dot = function (b) {
        return this.x * b.x + this.y * b.y;
    };

    vecproto.getSquaredLength = function () {
        return this.dot(this);
    };

    vecproto.getLength = function () {
        return Math.sqrt(this.getSquaredLength());
    };

    vecproto.isZero = function () {
        return this.x === 0 && this.y === 0;
    };

    vecproto.toString = function () {
        return '(' + this.x + ', ' + this.y + ')';
    };



    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    var rectproto = Rect.prototype;

    rectproto.collidesWithPoint = function (pos) {
        return (this.x <= pos.x && pos.x <= this.x + this.width &&
                this.y <= pos.y && pos.y <= this.y + this.height);
    };

    rectproto._loadCollisionVector = function (vec, pos) {
        vec.x = (pos.x < this.x ? pos.x - this.x : (this.x2 < pos.x ? pos.x - this.x2 : 0));
        vec.y = (pos.y < this.y ? pos.y - this.y : (this.y2 < pos.y ? pos.y - this.y2 : 0));
        return vec;
    };



    function GameObj(level, pos, r) {
        this.level = level;
        this.pos = pos;
        this.move = Vector.zero();
        this.r = r;
        this.rot = 0;
        this.disposed = false;
    }

    var gameobjproto = GameObj.prototype;

    gameobjproto.color = 'rgb(255,255,255)';

    gameobjproto.wallCollisionSlide = false;

    gameobjproto.render = function (ctx) {
        var pos = this.pos;
        var r = this.r;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };

    gameobjproto.advance = function () {
        this.pos._add(this.move);
    };

    gameobjproto.react = function () {
    };

    gameobjproto.collidesWithObj = function (obj) {
        var rsum = obj.r + this.r;
        var rsumSquared = rsum * rsum;
        return Vector.getSquaredDistance(obj.pos, this.pos) < rsumSquared;
    };

    gameobjproto.attack = function (obj, attackPoints) {
        // "mediating" the attack
        this.level.attack(this, obj, attackPoints);
    };

    gameobjproto.decreaseHealth = function (damagePoints) {
    };

    gameobjproto._markDisposed = function () {
        this.disposed = true;
    };



    function Bullet(level, pos, move, sender, attackPoints) {
        GameObj.call(this, level, pos, 2);
        this.move = move;
        this.sender = sender;
        this.attackPoints = attackPoints;
    }

    var bulletproto = Bullet.prototype = Object.create(GameObj.prototype);

    bulletproto.color = 'rgb(255,255,0)';

    bulletproto.react = function () {

        var i, objects = [this.level.player].concat(this.level.enemies);

        for (i = 0; i < objects.length; i++) {
            if (this.collidesWithObj(objects[i])) {
                this.sender.attack(objects[i], this.attackPoints);
                this.move.reset();
            }
        }

        if (this.move.isZero()) {
            this._markDisposed();
        }
    };


    function AliveObj() {
        GameObj.apply(this, arguments);
        this.health = 100;
    }

    var aliveobjproto = AliveObj.prototype = Object.create(GameObj.prototype);

    aliveobjproto.wallCollisionSlide = true;

    aliveobjproto.decreaseHealth = function (damagePoints) {

        if (this.health <= damagePoints) {
            this.health = 0;
            this._markDisposed();
        } else {
            this.health -= damagePoints;
        }
    };



    function Enemy(level, pos) {
        AliveObj.call(this, level, pos, 10);
    }

    var enemyproto = Enemy.prototype = Object.create(AliveObj.prototype);

    enemyproto.color = 'rgb(0,0,255)';


    function MeleeEnemy(level, pos) {
        Enemy.call(this, level, pos);
        this.reloadCount = 0;
        this.following = false;
        this.bfsReloadCount = 0;
    }

    var meleeenemyproto = MeleeEnemy.prototype = Object.create(Enemy.prototype);

    meleeenemyproto.react = function () {
        var player = this.level.player;
        var level = this.level;
        var playerCell = level.mapObjToCell(player);
        var myCell = level.mapObjToCell(this);
        var distances, adjCells, i, bestCell, bestDistance, cell;
        var di = Math.abs(myCell.i - playerCell.i), dj = Math.abs(myCell.j - playerCell.j);
        var movedi, movedj;
        var moveDistance = 0.5;

        this.move._scalarMul(0.8);

        if (this.collidesWithObj(player) && this.reloadCount === 0) {
            this.attack(player, 3);
            this.reloadCount = 10;
        }

        if (!this.following) {
            if (di < 5 && dj < 5) {
                this.following = true;
            }
        } else {
            if (di > 10 || dj > 10) {
                this.following = false;
            }
        }

        if (di <= 1 && dj <= 1) {
            this.move._add(player.pos.sub(this.pos)._normalize()._scalarMul(moveDistance));
        } else if (this.following) {
            if (this.bfsReloadCount === 0) {
                //TODO: collective BFS from the player
                distances = this._bfsdistances = level.cellBFS(playerCell, myCell);
                this.bfsReloadCount = 10000 + (Math.random() * 10) | 0;
            } else {
                distances = this._bfsdistances;
            }
            distances = level.cellBFS(playerCell, myCell);
            adjCells = myCell.getAdjacentCells().filter(function (cell) {
                return typeof distances[cell.getHashKey()] !== 'undefined';
            });

            bestCell = myCell;
            bestDistance = distances[bestCell.getHashKey()];
            for (i = 0; i < adjCells.length; ++i) {
                cell = adjCells[i];
                if (distances[cell.getHashKey()] < bestDistance) {
                    bestCell = cell;
                    bestDistance = distances[cell.getHashKey()];
                }
            }

            movedi = bestCell.i - myCell.i;
            movedj = bestCell.j - myCell.j;

            this.move._addCoords(movedi * moveDistance, movedj * moveDistance);
        }

        if (this.reloadCount > 0) {
            --this.reloadCount;
        }

        if (this.bfsReloadCount > 0) {
            --this.bfsReloadCount;
        }

    };



    function Player(level, pos) {
        AliveObj.call(this, level, pos, 10);
        this.reloadCount = 0;
        this.rangedAttackPoints = 20;
    }

    var playerproto = Player.prototype  = Object.create(AliveObj.prototype);

    playerproto.color = 'rgb(255,0,0)';

    playerproto.react = function (actions, mouseHoldPos) {
        var moveDistance = 4, bullet, bulletPos, bulletMove, bulletNormalizedMove,
            move = Vector.zero();

        if (actions[MOVE_UP]) {
            move._addCoords(0, -moveDistance);
        }
        if (actions[MOVE_DOWN]) {
            move._addCoords(0, moveDistance);
        }
        if (actions[MOVE_LEFT]) {
            move._addCoords(-moveDistance, 0);
        }
        if (actions[MOVE_RIGHT]) {
            move._addCoords(moveDistance, 0);
        }

        var dir = Vector.direction(degToRad(this.rot + 270));

        if (actions[MOVE_FORWARD]) {
            move._add(dir.scalarMul(moveDistance));
        }
        if (actions[MOVE_BACKWARD]) {
            move._sub(dir.scalarMul(moveDistance));
        }
        if (actions[TURN_LEFT]) {
            this.rot -= 5;
        }
        if (actions[TURN_RIGHT]) {
            this.rot += 5;
        }


        if (move.getSquaredLength() === 2 * moveDistance * moveDistance) {
            move._scalarMul(1 / sqrtOf2);
        }

        this.move._scalarMul(0.5);
        this.move._add(move);

        if ((actions[FIRE] || mouseHoldPos) && this.reloadCount === 0) {
            if (mouseHoldPos) {
                bulletNormalizedMove = mouseHoldPos.clone()._addCoords(-width / 2, -height / 2)._normalize();
            } else{
                bulletNormalizedMove = this.move.clone()._normalize();
            }
            bulletPos = this.pos.add(bulletNormalizedMove.scalarMul(this.r * 1.5));
            bulletMove = bulletNormalizedMove.scalarMul(15);
            bullet = new Bullet(this.level, bulletPos, bulletMove, this, this.rangedAttackPoints);
            this.level.bullets.push(bullet);
            this.reloadCount = 10;
        }

        if (this.reloadCount > 0) {
            --this.reloadCount;
        }
    };



    function Cell(level, i, j, type) {
        this.objs = [];
        this.type = type;
        this.level = level;
        this.i = i;
        this.j = j;
        this.rect = new Rect(i * level.cellWidth, j * level.cellWidth,
                             level.cellWidth, level.cellWidth);
    }

    var cellproto = Cell.prototype;

    cellproto.render = function (ctx) {
        var cellWidth = this.level.cellWidth;
        var i = this.i, j = this.j;
        if (cellImages[this.type]) {
            ctx.drawImage(cellImages[this.type], i * cellWidth, j * cellWidth);
        } else {
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(i * cellWidth, j * cellWidth, cellWidth, cellWidth);
        }
    };


    cellproto.getHashKey = function () {
        return this.i + 'x' + this.j;
    };

    cellproto.getCenterPoint = function () {
        var w = this.level.cellWidth;
        return new Vector(w * (this.i + 0.5), w * (this.j + 0.5));
    };

    cellproto.getAdjacentCells = function () {
        var i = this.i, j = this.j, cells = this.level.cells;
        return [
            cells[j - 1][i],
            cells[j][i - 1],
            cells[j + 1][i],
            cells[j][i + 1]
        ];
    };

    var CELL_WALL = 'wall';
    var CELL_EMPTY = 'empty';
    var CELL_EXIT = 'exit';

    var MOVE_UP = 'move-up';
    var MOVE_DOWN = 'move-down';
    var MOVE_LEFT = 'move-left';
    var MOVE_RIGHT = 'move-right';
    var FIRE = 'fire';
    var MOVE_FORWARD = 'move-forward';
    var MOVE_BACKWARD = 'move-backward';
    var TURN_LEFT = 'turn-left';
    var TURN_RIGHT = 'turn-right';

    var controlType = 1;

    var keyMap;

    if (controlType === 2) {
        keyMap = {
            37: TURN_LEFT,
            38: MOVE_FORWARD,
            39: TURN_RIGHT,
            40: MOVE_BACKWARD,
            65: FIRE,
        };
    } else {
        keyMap = {
            37: MOVE_LEFT,
            38: MOVE_UP,
            39: MOVE_RIGHT,
            40: MOVE_DOWN,

            87: MOVE_UP,
            83: MOVE_DOWN,
            65: MOVE_LEFT,
            68: MOVE_RIGHT,

            //17: FIRE,
            13: FIRE,
        };
    }

    var actions = {}, mouseHoldPos = null, mousePos = Vector.zero(), mouseDown = false,
        mouseIn = false;



    function Level(numCellRows, numCellCols, cellWidth, onLevelExit, onGameOver) {
        var cells = [];
        var cellRow;
        var i, j;

        if (numCellRows % 2 === 0 || numCellCols % 2 === 0) {
            throw "Gimme odd numbers";
        }

        this.cellWidth = cellWidth;
        this.numCellRows = numCellRows;
        this.numCellCols = numCellCols;

        for(j = 0; j < numCellRows; j++) {
            cellRow = [];
            for (i = 0; i < numCellCols; i++) {
                cellRow.push(new Cell(this, i, j, CELL_EMPTY));
            }
            cells.push(cellRow);
        }

        for(j = 0; j < numCellRows; j++) {
            cells[j][0].type = CELL_WALL;
            cells[j][numCellCols - 1].type = CELL_WALL;
        }
        for(i = 0; i < numCellCols; i++) {
            cells[0][i].type = CELL_WALL;
            cells[numCellRows - 1][i].type = CELL_WALL;
        }
        this.cells = cells;
        this.bullets = [];
        this.enemies = [];
        this.onLevelExit = onLevelExit;
        this.onGameOver = onGameOver;
        this.player = new Player(this, cells[1][1].getCenterPoint());
        this.generate();
    }

    var levproto = Level.prototype;

    levproto.generate = function () {
        var cells = this.cells;
        var rowH = (this.numCellRows / 2) | 0, colH = (this.numCellCols / 2) | 0;
        var rowQ = (rowH / 2) | 0, colQ = (colH / 2) | 0;
        var i, j, k, enemy;
        var randint = function (n) {
            return (Math.random() * n) | 0;
        };

        for (k = 0; k < rowQ * colQ; k++) {
            i = randint(colQ - 1) * 4 + 4;
            j = randint(rowQ - 1) * 4 + 4;
            cells[j][i].type = CELL_WALL;
        }


        for (k = 0; k < rowH * colH * 0.5; k++) {
            i = randint(colH - 1) * 2 + 2;
            j = randint(rowH - 1) * 2 + 2;
            cells[j][i].type = CELL_WALL;
        }

        for (k = 0; k < rowH * colH * 2; k++) {
            i = randint(colH) * 2 + 1;
            j = randint(rowH - 1) * 2 + 2;
            if (!(cells[j][i - 1].type === CELL_WALL && cells[j][i + 1].type === CELL_WALL)) {
                continue;
            }
            cells[j][i].type = CELL_WALL;
            if (!this.areCellsConnected()) {
                cells[j][i].type = CELL_EMPTY;
                continue;
            }
        }

        for (k = 0; k < rowH * colH * 2; k++) {
            i = randint(colH - 1) * 2 + 2;
            j = randint(rowH) * 2 + 1;
            if (!(cells[j - 1][i].type === CELL_WALL && cells[j + 1][i].type === CELL_WALL)) {
                continue;
            }
            cells[j][i].type = CELL_WALL;
            if (!this.areCellsConnected()) {
                cells[j][i].type = CELL_EMPTY;
                continue;
            }
        }

        var startCell = cells[1][1];
        var distances = this.cellBFS(startCell);
        var maxDistance = 0;
        var maxDistanceCell = startCell;

        this.eachCell(function (cell) {
            if (distances[cell.getHashKey()] > maxDistance) {
                maxDistance = distances[cell.getHashKey()];
                maxDistanceCell = cell;
            }
        });

        maxDistanceCell.type = CELL_EXIT;

        var numOfMeleeEnemies = 30;

        for (k = 0; k < numOfMeleeEnemies; k++) {
            i = randint(colH) * 2 + 1;
            j = randint(rowH) * 2 + 1;

            if (i === 1 && j === 1) {
                continue;
            }

            enemy = new MeleeEnemy(this, cells[j][i].getCenterPoint());

            this.enemies.push(enemy);
        }


    };

    levproto.remove = function () {
        // to prevent memory leaks
        delete this.player;
        delete this.bullets;
        delete this.cells;
        delete this.onLevelExit;
        delete this.onGameOver;
    };

    levproto.cellBFS = function (startCell, stopCell) {
        var cells = this.cells;
        var visited = {};
        var distances = {};
        var queue = [];
        var elem;
        var key;

        var getNextCells = function (cell) {
            return cell.getAdjacentCells().filter(function (elem) {
                return elem && elem.type !== CELL_WALL;
            });
        };

        var getNextElements = function (elem) {
            return getNextCells(elem[0]).map(function(cell) {
                return [cell, elem[1] + 1];
            });
        };


        queue.push([startCell, 0]);

        while(queue.length > 0) {
            elem = queue.shift();
            key = elem[0].getHashKey();
            if (!visited[key]) {
                distances[key] = elem[1];
                visited[key] = true;
                if (elem[1] === stopCell) {
                    break;
                }
                Array.prototype.push.apply(queue, getNextElements(elem));
            }
        }

        return distances;
    };

    levproto.eachCell = function (cb) {
        var i, j;
        for (j = 0; j < this.numCellRows; j++) {
            for (i = 0; i < this.numCellCols; i++) {
                cb(this.cells[j][i]);
            }
        }
    };

    levproto.getAllCells = function () {
        var cells = [];
        this.eachCell(function (cell) {
            cells.push(cell);
        });
        return cells;
    };

    levproto.areCellsConnected = function () {
        var distances = this.cellBFS(this.cells[1][1]);

        return this.getAllCells().filter(function (cell) {
            return cell.type != CELL_WALL;
        }).every(function (cell) {
            return typeof distances[cell.getHashKey()] !== 'undefined';
        });
    };

    levproto.render = function (ctx) {
        var i, j;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(degToRad(-this.player.rot));
        ctx.translate(-this.player.pos.x | 0, -this.player.pos.y | 0);
        //ctx.translate(width / 2 - this.player.pos.x | 0,
        //             height / 2 - this.player.pos.y | 0);
        for (j = 0; j < this.numCellRows; j++) {
            for (i = 0; i < this.numCellCols; i++) {
                this.cells[j][i].render(ctx);
            }
        }
        this.player.render(ctx);
        for (i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render(ctx);
        }
        for (i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(ctx);
        }
        ctx.restore();
    };

    levproto.mapObjToCell = function (obj) {
        var i = (obj.pos.x / this.cellWidth) | 0;
        var j = (obj.pos.y / this.cellWidth) | 0;
        return this.cells[j][i];
    };

    levproto.checkObjCollisions = function (obj) {
        var i, j, cell, vec = Vector.zero(),
            nextpos, sqLen, rsq = obj.r * obj.r;

        nextpos = obj.pos.add(obj.move);

        for (j = 0; j < this.numCellRows; j++) {
            for (i = 0; i < this.numCellCols; i++) {
                cell = this.cells[j][i];
                if (cell.type !== CELL_WALL && cell.type !== CELL_EXIT) {
                    continue;
                }
                cell.rect._loadCollisionVector(vec, nextpos);
                sqLen = vec.getSquaredLength();
                if (sqLen <= rsq) {

                    if (cell.type === CELL_EXIT && obj === this.player) {
                        this.levelExitHappened = true;
                        return;
                    }

                    if (obj.wallCollisionSlide) {
                        //console.log('vec, sqlen', vec.toString(), sqLen);
                        //if (vec.x === 0 && vec.y === 0) {
                        //    debugger
                        //}
                        if (sqLen > 0) {
                            vec._scalarMul(obj.move.dot(vec) / sqLen);
                            //console.log('vec2', vec.toString());
                            obj.move._sub(vec);
                            nextpos = obj.pos.add(obj.move);
                            continue;
                        } else {
                            obj.move.reset();
                            return;
                        }
                    } else {
                        obj.move.reset();
                        return;
                    }
                }
            }
        }

    };

    levproto.checkCollisions = function () {
        var i, objects = [this.player].concat(this.bullets, this.enemies);
        for (i = 0; i < objects.length; i++) {
            this.checkObjCollisions(objects[i]);
        }
    };

    levproto.react = function () {
        var i, objects = [].concat(this.bullets, this.enemies);
        mouseHoldPos = (mouseIn && mouseDown )? mousePos : null;
        this.player.react(actions, mouseHoldPos);
        for (i = 0; i < objects.length; i++) {
            objects[i].react();
        }
    };

    levproto.advance = function () {
        var i, objects = [this.player].concat(this.bullets, this.enemies);
        for (i = 0; i < objects.length; i++) {
            objects[i].advance();
        }
    };

    levproto.disposeObjectsInArray = function (arr) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].disposed){
                arr.splice(i, 1);
                --i;
            }
        }
    };

    levproto.disposeObjects = function () {
        this.disposeObjectsInArray(this.bullets);
        this.disposeObjectsInArray(this.enemies);
    };

    levproto.tick = function () {
        this.react();
        this.checkCollisions();
        this.advance();
        this.disposeObjects();

        if (this.player.health <= 0) {
            this.onGameOver(this);
            return;
        }

        if (this.levelExitHappened) {
            this.onLevelExit(this);
            return;
        }
    };

    levproto.attack = function (attackingObj, attackedObj, attackPoints) {
        // console.log(attackingObj, ' attacked ', attackedObj, ' with ', attackPoints);
        attackedObj.decreaseHealth(attackPoints);
    };



    var canvas = document.getElementById('canvas');
    var bufferCanvas = root.document.createElement('canvas');
    var ctx = bufferCanvas.getContext('2d');
    var directCtx = canvas.getContext('2d');
    var width = 800, height = 600;

    bufferCanvas.width = width;
    bufferCanvas.height = height;

    var cellImages = {}, wallImage, exitImage;
    wallImage = new Image();
    wallImage.src = 'img/wall.gif';
    exitImage = new Image();
    exitImage.src = 'img/exit.gif';
    cellImages[CELL_WALL] = wallImage;
    cellImages[CELL_EXIT] = exitImage;

    var level = null;
    var levelNum = 1;

    function generateNewLevel () {
        var onLevelExit = function (sourceLevel) {
            levelNum++;
            generateNewLevel();
            level.player.health = sourceLevel.player.health;
            sourceLevel.remove();
        };
        var onGameOver = function (sourceLevel) {
            levelNum = 1;
            generateNewLevel();
            sourceLevel.remove();
        };
        level = new Level(33, 31, 40, onLevelExit, onGameOver);
    }

    var animFrameRequest, doInterval;

    function asyncAnimLoop() {
        root.requestAnimationFrame(asyncAnimLoop);
        render();
    }

    function render() {
        directCtx.drawImage(bufferCanvas, 0, 0);
        level.render(ctx);
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText("HP " + level.player.health, 30, 30);
        ctx.fillText("Level " + levelNum, 700, 30);
    }

    function asyncDoLoop() {
        setInterval(function () {
            level.tick();
        }, 16);
    }

    window.addEventListener('keyup', function (e) {
        var keyCode = e.which || e.keyCode;
        if (keyMap[keyCode]) {
            actions[keyMap[keyCode]] = false;
        }
    }, false);

    window.addEventListener('keydown', function (e) {
        var keyCode = e.which || e.keyCode;
        if (keyMap[keyCode]) {
            actions[keyMap[keyCode]] = true;
        }
    }, false);

    var canvasContainerEl = document.getElementById('canvas-container');

    canvasContainerEl.addEventListener('mousedown', function (e) {
        mousePos.x = e.clientX - canvasContainerEl.offsetLeft;
        mousePos.y = e.clientY - canvasContainerEl.offsetTop;
        mouseDown = true;
    }, false);

    canvasContainerEl.addEventListener('mousemove', function (e) {
        mousePos.x = e.clientX - canvasContainerEl.offsetLeft;
        mousePos.y = e.clientY - canvasContainerEl.offsetTop;
    }, false);

    canvasContainerEl.addEventListener('mouseup', function (e) {
        mouseDown = false;
    }, false);

    canvasContainerEl.addEventListener('mouseenter', function (e) {
        mouseIn = true;
    }, false);

    canvasContainerEl.addEventListener('mouseleave', function (e) {
        mouseIn = false;
        mouseDown = false;
    }, false);

    generateNewLevel();

    asyncDoLoop();
    asyncAnimLoop();

    root.Vector = Vector;


}).call(this);
