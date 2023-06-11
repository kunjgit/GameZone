"use strict";

/**
 * Creates a Level instance.
 *
 * The level stores the game board and related information like the cost map.
 * 
 * @constructor
 * @this {Level}
 * @param {{x: number, y: number}} start The start point of the player.
 */
function Level(start) {
    var x;
    /** @type {{x: number, y: number}} */
    this.start = start;
    /** @type {Array.<Array.<number>>} */
    this.ids = [];
    /** @type {Array.<Array.<boolean>>} */
    this.changed = [];
    /** @type {Array.<Array.<(Spawner|Tower)>>} */
    this.obj = [];
    /** @type {Array.<Array.<number>>} */
    this.show = [];
    /** @type {Array.<Array.<Array.<Array.<number>>>>} */
    this.cost = [];
    /** @type {Array.<Array.<Array.<Array.<number>>>>} */
    this.dir = [];
    for (x = 0; x < g.columns; x += 1) {
        this.ids[x] = [];
        this.changed[x] = [];
        this.obj[x] = [];
        this.show[x] = [];
        this.cost[x] = [];
        this.dir[x] = [];
    }
}
Level.prototype = {
    /**
     * Iterates over all board columns.
     *
     * @param {Function} cb Callback with parameters (x).
     * @param {Object=} thisObj this object in callback.
     */
    forEachColumn: function (cb, thisObj) {
        var x;
        for (x = 0; x < g.columns; x += 1) {
            if (cb && cb.call(thisObj, x)) {
                return;
            }
        }
    },
    /**
     * Iterates over all board squares.
     *
     * @param {Function} cb Callback with parameters (x, y, id).
     * @param {Object=} thisObj this object in callback.
     */
    forEachSquare: function (cb, thisObj) {
        var x, y;
        for (x = 0; x < g.columns; x += 1) {
            for (y = 0; y < g.rows; y += 1) {
                if (cb.call(thisObj, x, y, this.idAt(x, y))) {
                    return;
                }
            }
        }
    },
    /**
     * Iterates over neighbor squares of (x, y).
     *
     * @param {number} x x coordinate of reference square.
     * @param {number} y y coordinate of reference square.
     * @param {Function} cb Callback with parameters (x, y, id).
     * @param {Object} thisObj this object in callback.
     */
    forEachNeighbor: function (x, y, cb, thisObj) {
        var i, nx, ny;
        for (i = 0; i < 4; i += 1) {
            nx = x + (i - 1) % 2;
            ny = y + (i - 2) % 2;
            if (g.valid(nx, ny)) {
                cb.call(thisObj, nx, ny, this.idAt(nx, ny));
            }
        }
    },
    /**
     * Returns the object at the coordinates.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {Spawner|Tower|null} The object at (x, y).
     */
    objectAt: function (x, y) {
        return this.obj[x][y];
    },
    /**
     * Returns the visible ID at the coordinates.
     * Everything but stone appears as dirt unless uncovered.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {number} The tile id at (x, y).
     */
    idAt: function (x, y) {
        if(this.show[x][y] < 2 && this.ids[x][y] !== 2) {
            return 1;
        }
        return this.ids[x][y];
    },
    /**
     * Returns the number of squares reachable from the start point.
     *
     * @return {number} Number of reachable squares
     */
    numReachable: function () {
        // init
        var cur,
            todo = [this.start],
            reachable = [],
            numReachable = 0,
            setReachable = function (x, y) {
                if (this.ids[x][y] === 0 && !reachable[x][y]) {
                    reachable[x][y] = 1;
                    numReachable += 1;
                    todo.push({x: x, y: y});
                }
            };
        this.forEachColumn(function (x) { reachable[x] = []; });
        this.forEachSquare(function (x, y) { reachable[x][y] = 0; });
        // do breadth-first search for reachable squares
        while (todo.length > 0) {
            cur = todo.shift();
            this.forEachNeighbor(cur.x, cur.y, setReachable, this);
        }
        return numReachable;
    },
    /**
     * Generates a new level.
     */
    generate: function () {
        var x, y, i, k, r, placed, neighbors,
            initSquare = function (x, y) {
                this.ids[x][y] = 0;
                this.changed[x][y] = true;
                this.show[x][y] = g.levelCount === 0 && (x > 0 && x < g.columns - 1 && y > 0) ? 2 : 0;
            },
            countNeighbor = function (x, y, id) {
                if (id !== 2) {
                    neighbors += 1;
                }
            };
        do {
            // place stones
            do {
                // fill with nothing (dirt internally is just a hidden empty square or spawner)
                this.forEachSquare(initSquare, this);
                // generate first level
                if (g.levelCount === 0) {
                    this.start = {x: Math.floor(g.columns / 2), y: g.rows - 3};
                    for (x = 0; x < g.columns; x += 1) {
                        this.ids[x][0] = 2;
                    }
                    for (y = 0; y < g.rows; y += 1) {
                        this.ids[0][y] = this.ids[g.columns - 1][y] = 2;
                        if (y < g.rows - 2 && y % 2 === 0) {
                            this.ids[2][y] = this.ids[g.columns - 3][y] = 2;
                        }
                    }
                    this.ids[Math.floor(g.columns / 2)][2] = -1;
                    this.genCostMap();
                    return;
                }
                // add stones
                for (i = 0; i < g.numStones; i += 1) {
                    r = Math.floor(Math.random() * g.size);
                    placed = false;
                    do {
                        x = r % g.columns;
                        y = (r - x) / g.columns;
                        if (this.ids[x][y] === 0 && (x !== this.start.x || y !== this.start.y)) {
                            this.ids[x][y] = 2;
                            placed = true;
                        }
                        else {
                            r = (r + 1) % g.size;
                        }
                    } while (!placed);
                }
            }
            // assure that all dirt squares are accessible
            while (this.numReachable() < g.size - g.numStones);
            // add spawners
            neighbors = 0;
            this.forEachNeighbor(this.start.x, this.start.y, countNeighbor, this);
            for (i = 0; i < g.numSpawners; i += 1) {
                r = Math.floor(Math.random() * (g.size - i - g.numStones - neighbors - 1));
                for (k = 0; k < g.size; k += 1) {
                    x = k % g.columns;
                    y = (k - x) / g.columns;
                    if (this.ids[x][y] === 0 && Math.abs(x - this.start.x) + Math.abs(y - this.start.y) > 1) {
                        if (r === 0) {
                            this.ids[x][y] = -1;
                            break;
                        }
                        r -= 1;
                    }
                }
            }
        }
        // assure that player doesn't (have to) run into a spawner right away
        while (this.numReachable() < 10);
        // show starting point
        this.uncover(this.start.x, this.start.y);
        this.forEachNeighbor(this.start.x, this.start.y, function (x, y) {
            this.show[x][y] = 2;
        }, this);
        // generate costmap
        this.genCostMap();
    },
    /**
     * Removes dirt (if) from square and lights up neighbors.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     */
    uncover: function (x, y) {
        if (this.show[x][y] === 0) {
            g.redraw = true;
        }
        this.show[x][y] = 2;
        this.changed[x][y] = true;
        this.genCostMap();
        this.forEachNeighbor(x, y, function (nx, ny) {
            this.changed[nx][ny] = true;
            if (this.show[nx][ny] === 0) {
                g.redraw = true;
                this.show[nx][ny] = 1;
            }
        }, this);
    },
    /**
     * Place tower on square unless this traps a spawner or spirits.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @param {number} t ID of tile to place.
     * @return {boolean} Whether the tower was actually placed.
     */
    placeTower: function (x, y, t) {
        var px = Math.floor(g.player.pos.x / 16),
            py = Math.floor(g.player.pos.y / 16),
            blocked = false;
        // place tower and generate cost map
        this.ids[x][y] = t;
        this.genCostMap();
        // check if this cut off the path to some active spawner
        this.forEachSquare(function (tx, ty, id) {
            if (id === -1 && this.obj[tx][ty] && this.cost[px][py][tx][ty] >= 1e4) {
                blocked = true;
                return true;
            }
        }, this);
        // ... or to some spirit
        blocked = blocked || g.spirits.some(function (spirit) {
            return this.cost[px][py][Math.floor(spirit.pos.x / 16)][Math.floor(spirit.pos.y / 16)] >= 1e4;
        }, this);
        // remove tower again
        if (blocked) {
            this.ids[x][y] = 0;
            this.genCostMap();
        }
        // ... or trigger redraw of square
        else {
            this.changed[x][y] = true;
        }
        return !blocked;
    },
    /**
     * Removes an object from the board.
     * 
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     */
    remove: function (x, y) {
        var id = this.ids[x][y];
        this.ids[x][y] = 0;
        this.obj[x][y] = null;
        this.changed[x][y] = true;
        if (id > 0) {
            this.genCostMap();
        }
    },
    /**
     * Generate cost map and directions using Dijkstra's algorithm.
     */
    genCostMap: function () {
        var cmp = function (a, b) { return b.c - a.c; };
        // generate cost and directions for every target square
        this.forEachSquare(function(tx, ty) {
            var dir, cost, x, y, nx, ny, todo, cur;
            // init data structures
            this.cost[tx][ty] = cost = [];
            this.dir[tx][ty] = dir = [];
            this.forEachColumn(function (x) {
                dir[x] = [];
                cost[x] = [];
            });
            this.forEachSquare(function (x, y) {
                dir[x][y] = {x: 0, y: 0};
                cost[x][y] = 1e4;
            });
            // do actual search only for empty squares
            if (g.idAt(tx, ty) < 1) {
                todo = [{x: tx, y: ty, c: 0, d: {x: 0, y: 0}}];
                while (todo.length > 0) {
                    cur = todo.pop();
                    if (cost[cur.x][cur.y] > cur.c) {
                        cost[cur.x][cur.y] = cur.c;
                        dir[cur.x][cur.y] = cur.d;
                        if (g.idAt(cur.x, cur.y) < 1) {
                            for (nx = -1; nx < 2; nx += 1) {
                                x = cur.x + nx;
                                for (ny = -1; ny < 2; ny += 1) {
                                    y = cur.y + ny;
                                    if (g.valid(x, y) && (nx !== 0 || ny !== 0) && g.idAt(cur.x, y) < 1 && g.idAt(x, cur.y) < 1) {
                                        todo.push({x: x, y: y, c: cur.c + Math.sqrt(nx * nx + ny * ny), d: {x: -nx, y: -ny}});
                                    }
                                }
                            }
                        }
                    }
                    todo.sort(cmp);
                }
            }
        }, this);
    }
};