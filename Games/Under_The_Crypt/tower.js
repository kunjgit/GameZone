'use strict';

/**
 * @constructor
 */
function Tower(pos) {
    /**
     * Tower position in pixels.
     * @type {{x: number, y: number}}
     */
    this.pos = pos;
}
Tower.prototype = {
    /**
     * The upgrade level [1,4].
     * @type {number}
     */
    level: 1,
    /**
     * Whether the tower has been used.
     * @type {boolean}
     */
    used: false,
    /**
     * Tower action per cycle.
     */
    update: function () {},
    /**
     * Whether the tower is currently shooting, ...
     */
    active: function () { return this.targets.length > 0; },
    /**
     * Helper function that returns the distance between two points in board coordinates
     */
    distance: function (a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    },
    /**
     * Returns the maximal range of a tower determined by level and environment.
     *
     * @return Maximal range.
     */
    maxRange: function () {
        var i, id,
            max = 0,
            x = Math.floor(this.pos.x / 16),
            y = Math.floor(this.pos.y / 16);
        for(i = 1; i <= this.level; i += 1) {
            x += this.dir.x;
            y += this.dir.y;
            // check board limits
            if (!g.valid(x, y)) {
                break;
            }
            // check for blocking dirt and stone
            id = g.idAt(x, y);
            if (id === 1 || id === 2) {
                break;
            }
            // increase max range
            max = i;
        }
        return max;
    }
};

/**
 * Creates a LightTower lights up all spirits in range.
 * @constructor
 * @extends Tower
 */
function LightTower(pos) {
    Tower.call(this, pos);
}
LightTower.prototype = Object.create(Tower.prototype);
LightTower.prototype.constructor = LightTower;

LightTower.prototype.update = function() {
    var targeted = false;
    // target spirits
    this.targets = g.spirits.filter(function (spirit) {
        if (this.distance(spirit.pos, this.pos) < 32) {
            var a = Math.atan2(spirit.pos.y - this.pos.y, spirit.pos.x - this.pos.x);
            // target additional spirits that are in the cone
            if (targeted) {
                return Math.abs(a - this.a) < this.range;
            }
            // target first spirits
            this.a = a;
            this.range = (this.level + 1) / 12 * Math.PI;
            targeted = true;
            return true;
        }
        return false;
    }, this);
    if (this.targets.length > 0) {
        this.used = true;
    }
    // hit all targeted spirits
    this.targets.forEach(function (spirit) {
        spirit.life -= 2 * spirit.resLight;
    });
};

/**
 * Creates a TeslaTower that shoots a chain of lightning
 * at one or more spirits depending on its level.
 * @constructor
 * @extends Tower
 */
function TeslaTower(pos) {
    Tower.call(this, pos);
    /** @type {Array.<Spirit>} */
    this.targets = [];
}
TeslaTower.prototype = Object.create(Tower.prototype);
TeslaTower.prototype.constructor = TeslaTower;

TeslaTower.prototype.update = function () {
    var i, last = this,
        targetSpirit = function (spirit) {
            // add spirit if it's close enough and not yet targeted
            if (this.targets.every(function (s) { return s !== spirit; }) &&
                this.distance(spirit.pos, last.pos) < 32) {
                last = spirit;
                this.targets.push(spirit);
                return true;
            }
            return false;
        };
    // target $level spirits in a row
    this.targets = [];
    for (i = 0; i < this.level; i += 1) {
        // stop if we didn't find one last time
        if (this.targets.length < i) {
            break;
        }
        // target additional spirit
        g.spirits.some(targetSpirit, this);
    }
    // mark as used if we hit anything
    if (this.targets.length > 0) {
        this.used = true;
    }
    // hit targeted spirits
    this.targets.forEach(function (spirit) { spirit.life -= 2 * spirit.resLightning; });
};

/**
 * Creates a FanTower that slows spirits down by blowing or sucking air in a fixed direction.
 *
 * @constructor
 * @extends Tower
 */
function FanTower(pos) {
    Tower.call(this, pos);
    /** @type {Array.<Spirit>} */
    this.targets = [];
    /** @type {{x: number, y: number}} */
    this.dir = {x: 0, y: 1};
}
FanTower.prototype = Object.create(Tower.prototype);
FanTower.prototype.constructor = FanTower;

FanTower.prototype.update = function () {
    var max = this.maxRange(),
        x = Math.floor(this.pos.x / 16),
        y = Math.floor(this.pos.y / 16);
    // target all spirits in range
    this.targets = g.spirits.filter(function(spirit) {
        for(var i = max; i > 0; i -= 1) {
            if (spirit.isAt(x + this.dir.x * i, y + this.dir.y * i)) {
                return true;
            }
        }
        return false;
    }, this);
    if (this.targets.length > 0) {
        this.used = true;
    }
    // slow down targeted spirits
    this.targets.forEach(function (spirit) { spirit.slowdown = spirit.resAir; });
};

/**
 * Creates new FireTower that burns spirits in a fixed direction.
 *
 * @constructor
 * @extends Tower
 */
function FireTower(pos) {
    Tower.call(this, pos);
    /** @type {{x: number, y: number}} */
    this.dir = {x: 0, y: 1};
    /** @type number */
    this.range = 0;
}
FireTower.prototype = Object.create(Tower.prototype);
FireTower.prototype.constructor = FireTower;

/**
 * Whether the tower is currently shooting, ...
 */
FireTower.prototype.active = function () {
    return this.range > 0;
};

/**
 * Checks whether a spirit is in range w.r.t the current direction.
 *
 * @return {boolean} True if spirit is in range.
 */
FireTower.prototype.inRange = function (spirit, range) {
    // check vertical
    if (this.dir.x === 0) {
        return Math.abs(spirit.pos.x - this.pos.x) <= 8 &&
            (spirit.pos.y - this.pos.y) * this.dir.y > 0 &&
            (spirit.pos.y - this.pos.y) * this.dir.y < range;
    }
    // check horizontal
    else {
        return Math.abs(spirit.pos.y - this.pos.y) <= 8 &&
            (spirit.pos.x - this.pos.x) * this.dir.x > 0 &&
            (spirit.pos.x - this.pos.x) * this.dir.x < range;
    }
};

FireTower.prototype.update = function () {
    var max = this.maxRange() * 16 + 8;
    // increase range if spirits are in max range
    if (g.spirits.some(function (spirit) { return this.inRange(spirit, max); }, this)) {
        this.range = Math.min(this.range + 0.5, max + 1);
        this.used = true;
    }
    // else decrease
    else {
        this.range = Math.max(this.range - 0.5, 0);
    }
    // hit spirits in current range
    g.spirits.forEach(function (spirit) {
        if (this.inRange(spirit, this.range)) {
            spirit.life -= 4 * spirit.resFire;
        }
    }, this);
};