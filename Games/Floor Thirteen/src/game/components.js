/**
 * Entity spatial position.
 *
 * @param {float} x Horizontal coordinate
 * @param {float} y Vertical coordinate
 * @param {float} r Rotation
 */
function Position(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 0;

  /**
   * Convert the position into grid position.
   *
   * @return {Object}
   */
  this.g = function toGrid() {
    return {
      x: this.x / 16 | 0,
      y: this.y / 16 | 0
    };
  };
}

/**
 * Entity bounds.
 *
 * @param {int} width
 * @param {int} height
 */
function Bounds(width, height) {
  Rectangle.call(this, 0, 0, width, height);
}

__extend(Bounds, Rectangle, {
  /**
   * Translate the bounds to the specified position.
   *
   * @param {Position} position
   */
  t: function translate(position) {
    this.x = (position.x | 0) - (this.w / 2 | 0);
    this.y = (position.y | 0) - (this.h / 2 | 0);
  }
});

/**
 * Entity motion.
 *
 * @param {float} dx
 * @param {float} dy
 * @param {float} friction
 */
function Motion(dx, dy, friction) {
  this.dx = dx || 0;
  this.dy = dy || 0;
  this.f = friction || 1;
}

/**
 * Manage entity display.
 *
 * @param {DisplayObject} gfx
 * @param {Boolean} fade
 */
function Display(gfx, fade) {
  this.gfx = gfx;
  this.f = fade;
}

/**
 * Holds the remaining entity lifetime.
 *
 * @param {float} t
 */
function Lifetime(t) {
  this.m = this.t = t;
}

/**
 * Holds the entity current state.
 *
 * @param {String} s
 */
function State(s) {
  this.s = s;
}

/**
 * Entity health monitor.
 *
 * @param {int} h Entity current hit points
 * @param {Boolean} b Can the entity bleed?
 * @param {Array} c Blood colors
 */
function Health(h, b, c) {
  this.h = h;
  this.b = b;
  this.c = c;
}

/**
 * AI brain.
 */
function Brain() {
  this.p = [];
  this.a = 0;
}

/**
 * Medipack.
 */
function Medipack() {}

/**
 * Entity weapon.
 *
 * @param {int} type Type
 * @param {float} fireRate Fire rate
 * @param {int} dmg Damage
 * @param {int} size Barrel size
 * @param {float} reloadTime Reload time
 * @param {Boolean} fullAuto Does the weapon allow full auto?
 * @param {int} spread Number of spread bullets
 */
function Weapon(type, fireRate, dmg, size, reloadTime, fullAuto, spread) {
  this.t = type;
  this.d = dmg;
  this.fr = fireRate;
  this.rt = reloadTime;
  this.fa = fullAuto;
  this.sp = spread || 1;
  this.bs = size;
  this.b = size;

  __mixin(this, {
    r: function reload() {
      this.b = this.bs;
    },
    c: function canShoot() {
      return this.b > 0;
    },
    s: function shoot() {
      this.b--;
    },
  });
}

/**
 * Holds door specifications.
 *
 * @param {Boolean} k Does the door require a key?
 */
function Door(k) {
  this.k = k;
}
