'use strict';

// requestAnimationFrame browser compatibility
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (cb) { cb(); };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// game states
var state = {
    ACTIVE: 0, // in game
    PAUSED: 1, // pause screen
    TITLE:  2, // title screen
    WIN:    3, // epilog
    POTION: 4, // potion buying screen
    MODE:   5  // mode selection screen
};

/**
 * Creates the Game.
 *
 * @constructor
 * @this {Game}
 */
function Game() {
    /**
     * Columns on the board.
     * @type {number}
     */
    this.columns = 9;
    /**
     * Rows on the board.
     * @type {number}
     */
    this.rows = 11;
    /**
     * Squares on the board.
     * @type {number}
     */
    this.size = this.columns * this.rows;
    // load save
    if (localStorage['utc3']) {
        this.save = JSON.parse(localStorage['utc3']);
    }
    // ... or create new one
    else {
        this.save = {
            level: 0,
            spirits: 0,
            full: true,
            lastLevel: 0,
            lastMoney: 0,
            lastStart: 0,
            lastHealth: 0,
            permaDeath: false
        };
        this.storeSave();
    }
}

Game.prototype = {
    /**
     * Number of stones to be placed on the board.
     * @type {number}
     */
    numStones: 30,
    /**
     * Number of spawners to be placed on the board.
     * @type {number}
     */
    numSpawners: 8,
    /** @type {number} */
    finalLevel: 20,
    /** @type {number} */
    potionCost: 50,
    /** @type {Array.<number>} */
    towerPrices: [20, 30, 30, 50],
    /**
     * Current spirit wave.
     * @type {number}
     */
    wave: 0,
    /** @type {UI} */
    ui: null,
    /** @type {number} */
    money: 0,
    /** @type {Level} */
    level: null,
    /** @type {number} */
    levelCount: 0,
    /** @type {number} */
    placeTower: 0,
    /**
     * State of the game (including info screens).
     * @type {number}
     */
    state: state.TITLE,
    /**
     * Whether the game is currently forwarding.
     * @type {boolean}
     */
    ffwd: false,
    /**
     * Whether to do a full reset and redraw of the UI.
     * @type {boolean}
     */
    redraw: true,
    /**
     * Currently selected tower for interaction.
     * @type {?{x: number, y: number}}
     */
    selTower: null,

    /**
     * Writes save to localStorage.
     */
    storeSave: function() {
        localStorage['utc3'] = JSON.stringify(this.save);
    },

    /**
     * Inits UI including loading assets, then starts game loop.
     */
    init: function() {
        this.ui = new UI(function() {
            setInterval(function () {
                var i;
                // stop forwarding if not in game
                if (g.state !== state.ACTIVE) {
                    g.forward(false);
                }
                // update game once (or twice in forward mode)
                for (i = g.ffwd ? 2 : 1; i > 0; i -= 1) {
                    if (g.state === state.ACTIVE && !g.update()) {
                        g.end(true);
                        break;
                    }
                }
                // draw state
                window.requestAnimationFrame(function() { g.draw(); });
            }, 1000 / 30);
        });
    },

    /**
     * Starts a new game or resumes a previous one.
     */
    start: function (resume) {
        this.player = new Player();
        // resume old state (position, leven count, money)
        if (this.save.lastLevel && resume) {
            this.money = this.save.lastMoney;
            this.levelCount = this.save.lastLevel - 1;
            this.player.life = this.save.lastHealth;
            this.nextLevel(this.save.lastStart);
        }
        // start new game
        else {
            this.state = state.MODE;
            this.redraw = true;
        }
    },
    /**
     * Selects difficulty and starts the game.
     *
     * @param {boolean} hard Hard mode (else normal).
     */
    hard: function (hard) {
        this.save.permaDeath = hard;
        this.storeSave();
        this.money = 40;
        this.levelCount = -1;
        this.nextLevel({x: Math.floor(this.columns / 2), y: this.rows - 1});
    },

    /**
     * Ends the game after being killed or quitting.
     *
     * @param {boolean} death Whether the end was caused by death.
     */
    end: function (death) {
        this.level = null;
        if (!death || this.save.permaDeath) {
            this.save.lastLevel = 0;
        }
        this.storeSave();
        this.state = state.TITLE;
        this.redraw = true;
    },

    /**
     * Draws the game and resets what needs (re-)drawing.
     */
    draw: function() {
        // sort spirits so first to draw come first
        if (this.state === state.ACTIVE) {
            this.spirits.sort(function (a, b) {
                return a.pos.y - b.pos.y || a.pos.x - b.pos.x;
            });
        }
        // draw state
        this.ui.update();
        // reset redraw state
        if (this.state === state.ACTIVE) {
            this.redraw = false;
            this.level.forEachSquare(function (x, y) {
                this.changed[x][y] = false;
            }, this.level);
        }
    },

    /**
     * Checks whether coordinates are valid (on the board).
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {boolean} Whether (x, y) is valid.
     */
    valid: function (x, y) {
        return x >= 0 && x < this.columns && y >= 0 && y < this.rows;
    },

    /**
     * Starts a wave at the given coordinates by creating a spawner.
     *
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     */
    startWave: function (x, y) {
        this.wave += 1;
        var spawner = this.level.obj[x][y] = new Spawner({x: x, y: y}, this.wave);
        this.spawners.push(spawner);
    },

    /**
     * Loads the next level.
     *
     * @param {{x: number, y: number}} start Start position.
     */
    nextLevel: function (start) {
        this.state = state.ACTIVE;
        this.wave = -1;
        this.levelCount += 1;
        this.spirits = [];
        this.towers = [];
        this.spawners = [];
        // generate new level
        this.player.pos = {x: start.x * 16 + 8, y: start.y * 16 + 8};
        this.level = new Level(start);
        this.level.generate();
        this.redraw = true;
        // update save
        this.save.level = Math.max(this.save.level, this.levelCount);
        this.save.lastLevel = this.levelCount;
        this.save.lastStart = start;
        this.save.lastMoney = this.money;
        this.save.lastHealth = this.player.life;
        this.storeSave();
    },

    /**
     * Moves the player (near) the square and triggers an action.
     *
     * @param {number} tx x coordinate of target.
     * @param {number} ty y coordinate of target.
     * @param {boolean} neighbor Whether to force targeting a neighbor instead.
     * @param {?number} tower Tower type if tower is to be placed, else undefined
     */
    movePlayer: function (tx, ty, neighbor, tower) {
        if (tower !== undefined && this.idAt(tx, ty) === 0 && this.towerPrices[tower] <= this.money) {
            this.placeTower = tower + 3;
        }
        else {
            this.placeTower = 0;
        }
        if (this.player.setTarget(tx, ty, neighbor)) {
            this.player.targetCB = function () {
                g.playerMoved(tx, ty);
            };
        }
    },

    /**
     * Executes player actions after reaching a target.
     *
     * @param {number} tx x coordinate of target (not current position).
     * @param {number} ty y coordinate of target (not current position).
     */
    playerMoved: function (tx, ty) {
        var tower;
        // turn to target if at a neighbor square
        if (!this.player.isAt(tx, ty)) {
            this.player.dir = {x: tx - Math.floor(this.player.pos.x / 16), y: ty - Math.floor(this.player.pos.y / 16)};
        }
        // place tower
        if (this.placeTower !== 0) {
            if(this.level.placeTower(tx, ty, this.placeTower)) {
                tower = new [LightTower, TeslaTower, FanTower, FireTower][this.placeTower - 3]({x: tx * 16 + 8, y: ty * 16 + 8});
                this.level.obj[tx][ty] = tower;
                this.towers.push(tower);
                this.money -= this.towerPrices[this.placeTower - 3];
            }
            this.placeTower = 0;
        }
        // remove dirt
        else if (this.idAt(tx, ty) === 1) {
            this.level.uncover(tx, ty);
            if (this.idAt(tx, ty) === -1) {
                // start wave if level < final level
                if (this.levelCount !== this.finalLevel) {
                    this.startWave(tx, ty);
                }
                // skip activating every second spawner in final level
                else if ((this.wave + 2) % 2 === 1) {
                    this.wave += 1;
                }
                // ... and instead activate two at the same time
                else {
                    this.wave -= 1;
                    this.level.forEachSquare(function (x, y, id) {
                        if (id === -1 && !this.objectAt(x, y)) {
                            this.startWave(x, y);
                        }
                    }, this);
                }
            }
        }
        // leave current level
        else if (this.idAt(tx, ty) === -1) {
            if (!this.objectAt(tx, ty) && this.spirits.length === 0 &&
                (this.levelCount === 0 || this.wave === this.numSpawners - 1)) {
                // sell remaining towers
                this.level.forEachSquare(function (x, y, id) {
                    if (id > 2) {
                        this.money += this.towerPrices[id - 3] / 2;
                    }
                }, this);
                // end game if final level
                if (this.levelCount === this.finalLevel) {
                    this.state = state.WIN;
                    this.redraw = true;
                }
                // ... or show potion buying screen
                else if (this.player.life < this.player.maxLife && this.potionCost <= this.money && Math.random() < 0.6) {
                    this.nextStart = {x: tx, y: ty};
                    this.state = state.POTION;
                    this.redraw = true;
                }
                // ... or proceed to next level
                else {
                    this.nextLevel({x: tx, y: ty});
                }
            }
        }
        else if (this.idAt(tx, ty) > 2) {
            this.selTower = {x: tx, y: ty};
        }
    },

    /**
     * Sells an existing tower.
     * 
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     */
    sellTower: function (x, y) {
        var obj = this.objectAt(x, y),
            price = this.towerPrices[this.idAt(x, y) - 3];
        this.money += obj.used ? price / 2 : price;
        this.level.remove(x, y);
        this.towers = this.towers.filter(function (tower) {
            return tower !== obj;
        });
    },

    /**
     * Upgrades an existing tower.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {boolean} Whether the tower has been upgraded.
     */
    upgradeTower: function (x, y) {
        var tower = this.objectAt(x, y),
            price = this.towerPrices[this.idAt(x, y) - 3];
        if (tower.level < 4 && price <= this.money) {
            tower.level += 1;
            this.money -= price;
            this.level.changed[x][y] = true;
            return true;
        }
        return false;
    },

    /**
     * Turns an existing tower.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     */
    turnTower: function (x, y) {
        var tower = this.objectAt(x, y);
        if (tower.dir) {
            tower.dir = {x: -tower.dir.y, y: tower.dir.x};
            this.level.changed[x][y] = true;
        }
    },
    /**
     * Returns the object at the coordinates.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {?(Tower|Spawner)} Object at (x, y).
     */
    objectAt: function (x, y) { return this.level.objectAt(x, y); },

    /**
     * Returns the tile ID at the coordinates.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {number} Tile ID at (x, y).
     */
    idAt: function (x, y) { return this.level.idAt(x, y); },

    /**
     * Returns whether the square needs to be redrawn.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {boolean} Whether (x, y) has changed.
     */
    hasChanged: function (x, y) { return this.level.changed[x][y]; },

    /**
     * Returns whether the square is (fully) visible.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {number} 0 - hidden, 1 - shown as dirt (unless stone), 2 - shown.
     */
    show: function (x, y) { return this.level.show[x][y]; },

    /**
     * (De-)activates forwarding.
     *
     * @param {boolean} on Whether to turn it on or off.
     */
    forward: function (on) { this.ffwd = on; },

    /**
     * Toggles pause (screen) state.
     */
    togglePause: function () {
        if (this.state === state.PAUSED) {
            this.state = state.ACTIVE;
        }
        else if (this.state === state.ACTIVE) {
            this.state = state.PAUSED;
        }
        this.redraw = true;
    },

    /**
     * Toggles fullscreen mode.
     */
    toggleFS: function () {
        // remember for later
        this.save.full = !this.save.full;
        this.storeSave();
        // make sure UI is redrawn
        this.redraw = true;
    },

    /**
     * Buys a potion and / or closes the potion screen.
     * @param {boolean} buy Whether to buy or just close.
     */
    buy: function (buy) {
        if (buy) {
            this.money -= this.potionCost;
            this.player.life = this.player.maxLife;
        }
        this.nextLevel(this.nextStart);
    },

    /**
     * Checks whether spawners are near the coordinates.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @return {number} 2 if a spawner is adjacent, 1 if one is close, else 0.
     */
    spawnersNear: function(x, y) {
        var ret = 0, nx, ny;
        for (nx = -1; nx < 2; nx += 1) {
            for (ny = -1; ny < 2; ny += 1) {
                if (this.valid(x + nx, y + ny)) {
                    if (this.level.ids[x + nx][y + ny] === -1) {
                        ret = Math.max(ret, nx && ny ? 1 : 2);
                    }
                }
            }
        }
        return ret;
    },

    /**
     * Chooses the spirit type to spawn next.
     *
     * @param {number} wave Current wave of spirits [0-7].
     * @return {Spirit} Spirit type to spawn.
     */
    selectSpirit: function (wave) {
        var i, w, r, sum = 0, buckets = [];
        // calculate current ratios of enemy types
        for (i = 0; i < 5; i += 1) {
            w = (this.levelCount - 1) * this.numSpawners + wave;
            w = (w + w % this.numSpawners * 2) / (20 * this.numSpawners);
            sum += buckets[i] = Math.max(0, w > i / 4 ? 1 + i / 4 - w : w * 4 - i + 1);
        }
        // randomly select an enemy
        r = Math.random() * sum;
        w = 0;
        for (i = 0; i < 5; i += 1) {
            w += buckets[i];
            if (r < w) {
                // save highest enemy type encountered
                if (i + 1 > this.save.spirits) {
                    this.save.spirits = i + 1;
                    this.storeSave();
                }
                return [Shadow, Ghost, Cat, Heathen, Demon][i];
            }
        }
    },
    /**
     * Spawn a spirit.
     *
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @param {number} wave Current wave of spirits [0-7].
     */
    spawnSpirit: function (x, y, wave) {
        var health = 700 + this.levelCount * 48 - Math.floor((100 + this.levelCount * 8) * Math.log(Math.pow(this.numSpawners - wave, 2)) / Math.log(2)),
            spirit = new (this.selectSpirit(wave))({x: x * 16 + 8, y: y * 16 + 8}, health);
        // target the player
        spirit.target = this.player.pos;
        // die and hurt the player when reaching target
        spirit.targetCB = function () {
            this.life = 0;
            g.player.life -= 1;
        };
        this.spirits.push(spirit);
    },
    /**
     * Updates the game every cycle.
     *
     * @return {boolean} True if the game has not ended.
     */
    update: function () {
        var cost, follower, newSpirits;
        // move player
        this.player.move();
        // update spawners
        this.spawners = this.spawners.filter(function (spawner) {
            if (spawner.update()) {
                return true;
            }
            // only remove the remove if it's the last one
            if (spawner.wave === this.numSpawners - 1) {
                this.level.obj[spawner.pos.x][spawner.pos.y] = null;
                this.level.changed[spawner.pos.x][spawner.pos.y] = true;
            }
            // else remove spawner and close hole
            else {
                this.level.remove(spawner.pos.x, spawner.pos.y);
            }
            return false;
        }, this);
        // sort spirits so closest to player come first
        cost = this.level.cost[Math.floor(this.player.pos.x / 16)][Math.floor(this.player.pos.y / 16)];
        this.spirits.sort(function (a, b) {
            return cost[Math.floor(a.pos.x / 16)][Math.floor(a.pos.y / 16)] -
                   cost[Math.floor(b.pos.x / 16)][Math.floor(b.pos.y / 16)];
        });
        // update towers
        this.towers.forEach(function (tower) {
            tower.update();
        });
        // update spirits
        newSpirits = [];
        this.spirits = this.spirits.filter(function (spirit) {
            if (!spirit.move() && spirit.life <= 0) { 
                // get money for dead spirit
                this.money += 2 + Math.floor(this.wave / 4) + Math.floor(this.levelCount / 3);
                // spawn follower
                follower = spirit.follower();
                if (follower) {
                    follower.target = this.player.pos;
                    follower.dir = spirit.dir;
                    follower.targetCB = function () {
                        this.life = 0;
                        g.player.life -= 1;
                    };
                    newSpirits.push(follower);
                }
                return false;
            }
            return spirit.life > 0;
        }, this);
        this.spirits = this.spirits.concat(newSpirits);
        return this.player.life > 0;
    }
};

// exports for closure compiler
window['Game'] = Game;
Game.prototype['buy'] = Game.prototype.buy;
Game.prototype['end'] = Game.prototype.end;
Game.prototype['init'] = Game.prototype.init;
Game.prototype['start'] = Game.prototype.start;
Game.prototype['hard'] = Game.prototype.hard;
Game.prototype['toggleFS'] = Game.prototype.toggleFS;
Game.prototype['togglePause'] = Game.prototype.togglePause;