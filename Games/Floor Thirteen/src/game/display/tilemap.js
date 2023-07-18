function Tilemap(dungeon) {
  // Methods variables
  var that = this, texture, sprite, x, y, a, r, i, edges;
  var gibsBlood = ['#930', '#820', '#710'];
  var renderTexture = new RenderTexture(dungeon.w * 16, dungeon.h * 16);

  /**
   * Paint blood splash
   *
   * @param  {Position} pos
   */
  that.b = function paintBlood(pos) {
    for (i = getRandomInt(50, 80); i--;) {
      sprite = bloodSpray(!getRandomInt(0, 3) ? 2 : 1, getRandomElement(gibsBlood));
      sprite.o = getRandomInt(6, 8) / 10;

      a = Math.PI * getRandomInt(-180, 180) / 180;
      r = getRandomInt(0, 8);
      renderTexture.r(sprite, {
        x: pos.x + Math.cos(a) * r,
        y: pos.y + Math.sin(a) * r,
      });
    }
  };

  function isFrontWall(dungeon, x, y) {
    return isWall(dungeon, x, y) && !isWall(dungeon, x, y + 1);
  }

  function isRoof(dungeon, x, y) {
    return isWall(dungeon, x, y) && isWall(dungeon, x, y + 1);
  }

  function addEdge(x1, y1, x2, y2) {
    edges.push(function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(x1 + 0.5, y1 - 0.5);
      ctx.lineTo(x2 + 0.5, y2 - 0.5);
      ctx.stroke();
      ctx.closePath();
    });
  }

  function drawElevator(pos, up) {
    x = pos.x * 16;
    y = pos.y * 16;

    // Draw the elevator
    renderTexture.r(new Sprite(__textureManager.g('e')), {x: x, y: y});

    // Draw light arrow
    x += isFrontWall(dungeon, pos.x - 1, pos.y) ? -8 : (isFrontWall(dungeon, pos.x + 1, pos.y) ? 18 : (isWall(dungeon, pos.x - 1, pos.y) ? -8 : 18));
    sprite = new Sprite(__textureManager.g('a'), {x: 0, y: 0.5});
    sprite.sy = up ? 1 : -1;
    renderTexture.r(sprite, {x: x, y: y + 9});
  }

  // Render map
  for (y = dungeon.h; y--;) {
    for (x = dungeon.w; x--;) {
      var pos = {x: x * 16, y: y * 16};
      edges = [];

      if (isFrontWall(dungeon, x, y)) {
        texture = 'w';

        if (!isWall(dungeon, x, y + 1)) {
          addEdge(0, 17, 16, 17);
        }

        if (!isWall(dungeon, x - 1, y)) {
          addEdge(0, 0, 0, 16);
        }

        if (!isWall(dungeon, x + 1, y)) {
          addEdge(15, 0, 15, 16);
          addEdge(16, 0, 16, 17);
        }
      } else if (isRoof(dungeon, x, y)) {
        texture = 'r';

        if (!isRoof(dungeon, x, y - 1)) {
          addEdge(0, 1, 16, 1);
        }

        if (!isRoof(dungeon, x, y + 1)) {
          addEdge(0, 18, 16, 18);
        }

        if (!isWall(dungeon, x - 1, y)) {
          addEdge(0, 0, 0, 16);
        } else if (!isRoof(dungeon, x - 1, y)) {
          addEdge(0, 2, 0, 16);
        }

        if (!isWall(dungeon, x + 1, y)) {
          addEdge(15, 0, 15, 16);
          addEdge(16, 0, 16, 16);
        } else if (!isRoof(dungeon, x + 1, y)) {
          addEdge(15, 2, 15, 16);
          addEdge(16, 2, 16, 16);
        }
      } else {
        texture = 'f';
      }

      renderTexture.r(new Sprite(__textureManager.g(texture)), pos);

      for (i = edges.length; i--;) {
        renderTexture.r(new Graphics(edges[i], 'rgba(0,0,0,.2)'), pos);
      }
    }
  }

  // Render exits
  drawElevator(dungeon.p);
  drawElevator(dungeon.n, 1);

  Sprite.call(that, [renderTexture]);
}

__extend(Tilemap, Sprite);
