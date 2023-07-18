/**
 * Manage fog of war.
 *
 * @param {DisplayObjectContainer} camera
 * @param {DisplayObjectContainer} layer
 */
function FogSystem(camera, layer) {
  System.call(this);
  this.c = camera;
  this.l = layer;
  this.f = [];

  var fog = new RenderTexture(16, 16);
  fog.r(new Graphics(function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 16, 16);
    ctx.closePath();
  }));

  // Dirty trick to bypass a Renderer bug.
  // I don't have enough time to fix it...
  var fogTexture = {
    s: fog.s,
    f: {x: 0, y: 0, w: 16, h: 16}
  };

  for (var y = __PW_WORLD_HEIGHT; y--;) {
    this.f[y] = [];
    for (var x = __PW_WORLD_WIDTH; x--;) {
      var tile = layer.a(new Sprite([fogTexture]));
      this.f[y][x] = {
        s: tile,
        b: new Rectangle(tile.x = x * 16, tile.y = y * 16, 16, 16)
      };
    }
  }
}

__extend(FogSystem, System, {
  u: function update() {
    var player = __tm.g(TAG_PLAYER);
    if (!player) {
      return;
    }

    var map = __tm.g(TAG_WORLD).g(Dungeon);
    var position = player.g(Position).g();
    var viewport = new Rectangle(-this.c.x, -this.c.y, __PW_GAME_WIDTH, __PW_GAME_HEIGHT);

    // Culling
    for (var y = __PW_WORLD_HEIGHT; y--;) {
      for (var x = __PW_WORLD_WIDTH; x--;) {
        var tile = this.f[y][x];
        tile.s.v = tile.b.o(viewport);
        tile.s.o = 1;
      }
    }

    var fog = this.f;
    var mult = [
      [1,  0,  0, -1, -1,  0,  0,  1],
      [0,  1, -1,  0,  0, -1,  1,  0],
      [0,  1,  1,  0,  0, -1, -1,  0],
      [1,  0,  0,  1, -1,  0,  0, -1]
    ];

    fog[position.y][position.x].s.o = 0;

    function draw(cx, cy, row, start, end, radius, xx, xy, yx, yy) {
      var radius2 = radius * radius;
      var new_start = 0;

      if (start < end) {
        return;
      }

      for (var i = row; i < radius + 1; i++) {
        var dx = -i - 1;
        var dy = -i;
        var blocked = 0;

        //while (~-dx) {
        while (dx <= 0) {
          dx += 1;

          var x = cx + dx * xx + dy * xy;
          var y = cy + dx * yx + dy * yy;

          if (x < __PW_WORLD_WIDTH && x >= 0 && y < __PW_WORLD_HEIGHT && y >=0) {
            var l_slope = (dx - 0.5) / (dy + 0.5);
            var r_slope = (dx + 0.5) / (dy - 0.5);

            if( end > l_slope) {
              break;
            } else if (r_slope < start) {
              if (dx*dx + dy*dy < radius2) {
                fog[y][x].s.o = ((x - position.x) * (x - position.x) + (y - position.y) * (y - position.y)) / radius2;
              }

              if (blocked) {
                if (isWall(map, x, y)) {
                  new_start = r_slope;
                } else {
                  blocked = false;
                  start = new_start;
                }
              } else {
                if (isWall(map, x, y) && i < radius) {
                  blocked = true;
                  draw(cx, cy, i + 1, start, l_slope, radius, xx, xy, yx, yy);
                  new_start = r_slope;
                }
              }
            }
          }
        }

        if (blocked) {
          break;
        }
      }
    }

    // Adjust opacity
    for (var i = 8; i--;) {
      draw(position.x, position.y, 1, 1.0, 0.0, 5, mult[0][i], mult[1][i], mult[2][i], mult[3][i]);
    }
  }
});
