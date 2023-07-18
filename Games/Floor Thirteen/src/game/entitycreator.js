function bloodSpray(size, color) {
  var offset = getRandomElement([0, 0.5]);
  return new Graphics(function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(offset, offset, size, size);
    ctx.closePath();
  });
}

var EntityCreator = (function() {
  var middleCenter = {x: 0.5, y: 0.5};
  var gibsBlood = ['#c30', '#920', '#b20', '#820'];
  var gibsSparkles = ['#eeb', '#ffe', '#fd6'];
  var entity;

  function getFourWaysAnimatedSprite(texture) {
    return new AnimatedSprite(__textureManager.g(texture), {
      _n: __textureManager.a('_n'),
      _s: __textureManager.a('_s'),
      _h: __textureManager.a('_h'),
      wn: __textureManager.a('wn'),
      ws: __textureManager.a('ws'),
      wh: __textureManager.a('wh'),
      an: __textureManager.a('an'),
      as: __textureManager.a('as'),
      ah: __textureManager.a('ah')
    }, '_s', middleCenter);
  }

  return {
    exit: function(pos) {
      __tm.r(TAG_EXIT, entity = __em.e(
        new Position(pos.x * 16 + 6, pos.y * 16 + 10),
        new Bounds(11, 16)
      ));

      return entity;
    },
    door: function(pos) {
      var x = pos.x * 16;
      var y = pos.y * 16;
      if (pos.d > 1) {
        entity = __em.e(
          new Position(x + 8, y + (pos.d > 2 ? 0 : 16)),
          new Bounds(16, 14),
          new Display(new Sprite(__textureManager.g('dh'), middleCenter))
        );
      } else {
        entity = __em.e(
          new Position(x + (pos.d ? 16 : 0), y + 3),
          new Bounds(3, 25),
          new Display(new Sprite(__textureManager.g('dv'), middleCenter))
        );
      }

      entity.a(new Door());
      entity.a(new Health(2, false, gibsSparkles));

      __gm.a(GROUP_DOORS, entity);
      return entity;
    },
    hero: function(pos, health, weapon) {
      __tm.r(TAG_PLAYER, entity = __em.e(
        health || new Health(__PW_PLAYER_LIFE, true, gibsBlood),
        weapon ||WeaponCreator.g(WEAPON_PISTOL, 2),
        new Position(pos.x * 16 + 7, pos.y * 16 + 26),
        new Bounds(6, 13),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('h')),
        new Cooldown(),
        new State(STATE_IDLE)
      ));

      return entity;
    },
    bodyguard: function(pos) {
      return __em.e(
        WeaponCreator.g(-1),
        new Position(pos.x * 16 + 7, pos.y * 16 + 10),
        new Bounds(8, 13),
        new Motion(),
        new Display(getFourWaysAnimatedSprite('b')),
        new Health(5, true, gibsBlood),
        new Brain(),
        new Cooldown(),
        new State(STATE_IDLE)
      );
    },
    bullet: function(pos, weapon) {
      var i = weapon.sp;
      var v = pos.r == 180 || !pos.r;
      var r = pos.r / 180 * Math.PI;
      while (i--) {
        var r2 = (pos.r + getRandomInt(-3, 3) + i * 8 - 4 * (weapon.sp - 1)) / 180 * Math.PI;
        var s;

        __gm.a(GROUP_BULLETS, __em.e(
          weapon,
          new Position(pos.x + (v ? 0 : (pos.r > 0 ? 5 : -5)), pos.y + (v ? (!pos.r ? 10 : -10) : 0), pos.r),
          new Bounds(3, 3),
          new Motion(120 * Math.sin(r2) | 0, 120 * Math.cos(r2) | 0),
          new Display(s = new Sprite(__textureManager.g(v ? 'bv' : 'bh'), v ? {x: 0, y: 1} : {x: 1, y: 0}))
        ));

        s.sx = pos.r < 0 ? -1 : 1;
        s.sy = pos.r == 180 ? -1 : 1;
      }
    },
    gib: function(pos, color, power) {
      var size = !getRandomInt(0, 3) ? 2 : 1;
      return __em.e(
        new Lifetime(power * 0.5),
        new Position(pos.x, pos.y),
        new Motion(power * getRandomInt(-70, 70), power * getRandomInt(-70, 70), 0.95),
        new Display(bloodSpray(size, color), true)
      );
    },
    weapon: function(pos, weapon) {
      __gm.a(GROUP_LOOTS, entity = __em.e(
        weapon, pos, // Reuse components
        new Display(new AnimatedSprite(__textureManager.g('l'), {l: __textureManager.a('l')}, 'l', middleCenter)),
        new Bounds(3, 3)
      ));

      return entity;
    },
    medic: function(pos) {
      __gm.a(GROUP_LOOTS, entity = __em.e(
        pos, // Reuse component
        new Medipack(),
        new Display(new Sprite(__textureManager.g('m'), middleCenter)),
        new Bounds(3, 4)
      ));

      return entity;
    },
    world: function() {
      var dungeon = generateDungeon(__PW_WORLD_WIDTH, __PW_WORLD_HEIGHT, 4, 7);
      if (__PW_DEBUG) {
        console.log(dumpDungeon(dungeon));
      }

      __tm.r(TAG_WORLD, entity = __em.e(
        new Position(),
        new Display(new Tilemap(dungeon)),
        dungeon
      ));

      return entity;
    }
  };
})();
