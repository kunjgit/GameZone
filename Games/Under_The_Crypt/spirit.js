'use strict';

/**
 * Create a new Spirit which is the base for both evil spirits and the player.
 *
 * @constructor
 * @param {Object} pos
 * @param {number} life
 * @param {number} speed
 * @param {number=} resLight
 * @param {number=} resLightning
 * @param {number=} resAir
 * @param {number=} resFire
 */
function Spirit(pos, life, speed, resLight, resLightning, resAir, resFire) {
    /**
     * Position of the spirit in unscaled pixels.
     * @const
     */
    this.pos = pos;
    this.life = this.maxLife = life;
    this.speed = speed;

    // resistances
    this.resLight = resLight || 1;
    this.resLightning = resLightning || 1;
    this.resAir = resAir || 1;
    this.resFire = resFire || 1;
}
Spirit.prototype = {
    dir: {x: 0, y: 0},
    // overwrite!
    target: 0,
    /** @type {Function} */
    targetCB: null,
    slowdown: 0,
    isAt: function (x, y) {
        return Math.floor(this.pos.x / 16) === x && Math.floor(this.pos.y / 16) === y;
    },
    follower: function () {
    },
    // move the spirit and return true if it reached its target
    move: function () {
        var speed = this.speed * (1 - this.slowdown);
        this.slowdown = 0;
        if (this.target && Math.abs(this.pos.x - this.target.x) < 1 && Math.abs(this.pos.y - this.target.y) < 1) {
            this.pos.x = this.target.x;
            this.pos.y = this.target.y;
            if (this.targetCB) {
                this.targetCB();
                this.targetCB = null;
            }
            return true;
        }
        if (Math.abs(this.pos.x % 16 - 8) <= speed / 2 && Math.abs(this.pos.y % 16 - 8) <= speed / 2) {
            this.pos.x = Math.floor(this.pos.x / 16) * 16 + 8;
            this.pos.y = Math.floor(this.pos.y / 16) * 16 + 8;
            if (this.target) {
                this.dir = g.level.dir[Math.floor(this.target.x / 16)][Math.floor(this.target.y / 16)][Math.floor(this.pos.x / 16)][Math.floor(this.pos.y / 16)];
            }
            else {
                this.dir = {x: 0, y: 0};
            }
        }
        this.pos.x += this.dir.x * speed;
        this.pos.y += this.dir.y * speed;
        return false;
    }
};

/**
 * @constructor
 * @extends Spirit
 */
function Shadow(pos, multiplier) {
    Spirit.call(this, pos, multiplier, 0.5, 1.0, 0.9, 0.5, 0.8);
    this.id = 0;
}
Shadow.prototype = Object.create(Spirit.prototype);
Shadow.prototype.constructor = Shadow;

/**
 * @constructor
 * @extends Spirit
 */
function Ghost(pos, multiplier) {
    Spirit.call(this, pos, multiplier, 0.5, 0.7, 0.8, 0.8, 0.7);
    this.id = 1;
}
Ghost.prototype = Object.create(Spirit.prototype);
Ghost.prototype.constructor = Ghost;

/**
 * @constructor
 * @extends Spirit
 */
function Cat(pos, multiplier) {
    Spirit.call(this, pos, multiplier, 0.7, 0.8, 1.0, 0.6, 1.0);
    this.id = 2;
    this.followerType = Shadow;
}
Cat.prototype = Object.create(Spirit.prototype);
Cat.prototype.constructor = Cat;

Cat.prototype.follower = function () {
    if (Math.random() < 0.5) {
        return 0;
    }
    else {
        return new this.followerType({x: this.pos.x, y: this.pos.y}, this.maxLife);
    }
};

/**
 * @constructor
 * @extends Cat
 */
function Heathen(pos, multiplier) {
    Spirit.call(this, pos, multiplier, 0.5, 0.3, 0.8, 0.8, 0.8);
    this.id = 3;
    this.followerType = Ghost;
}
Heathen.prototype = Object.create(Cat.prototype);
Heathen.prototype.constructor = Heathen;

/**
 * @constructor
 * @extends Spirit
 */
function Demon(pos, multiplier) {
    Spirit.call(this, pos, multiplier, 0.2, 0.2, 0.2, 0.5, 0.5);
    this.id = 4;
}
Demon.prototype = Object.create(Spirit.prototype);
Demon.prototype.constructor = Demon;

/**
 * Creates a Player instance.
 *
 * @constructor
 * @extends Spirit
 */
function Player() {
    Spirit.call(this, null, 10, 2);
    this.id = -1;
}
Player.prototype = Object.create(Spirit.prototype);
Player.prototype.constructor = Player;

Player.prototype.setTarget = function (tx, ty, neighbor) {
    var nearest = null,
        distance = 10000,
        x = Math.floor(this.pos.x / 16),
        y = Math.floor(this.pos.y / 16);
    this.targetCB = null;
    // set target directly
    if (!neighbor && g.level.cost[tx][ty][x][y] < 10000) {
        this.target = {x: tx * 16 + 8, y: ty * 16 + 8};
        return true;
    }
    // set neighbor of target
    g.level.forEachNeighbor(tx, ty, function (nx, ny) {
        var cost = g.level.cost[nx][ny][x][y];
        if (cost < distance) {
            nearest = {x: nx * 16 + 8, y: ny * 16 + 8};
            distance = cost;
        }
    });
    this.target = nearest;
    return this.target !== null;
};