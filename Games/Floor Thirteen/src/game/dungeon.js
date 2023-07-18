var TILE_BLANK = 0;
var TILE_FLOOR = 1;

function Dungeon(width, height, map, doors, chests, mobs, prev, next) {
  this.w = width;
  this.h = height;
  this.m = map;
  this.d = doors;
  this.c = chests;
  this.e = mobs;
  this.p = prev;
  this.n = next;
}

function isWall(dungeon, x, y) {
  return x < 0 || y < 0 || x >= dungeon.w || y >= dungeon.h || isWallTile(dungeon.m[y][x]);
}

function isWallTile(t) {
  return t != TILE_FLOOR;
}

var generateDungeon = (function() {
  function getBranchingPosition(room) {
    var x = room.x;
    var y = room.y;
    var w = room.w - 1;
    var h = room.h - 1;

    // Get random branching wall
    //   - 0: West
    //   - 1: East
    //   - 2: South
    //   - 3: North
    var direction = getRandomInt(0, 3);

    // North or south
    if (direction > 1) {
      return {
        d: direction,
        x: x + getRandomInt(1, w - 1),
        y: y + (direction > 2 ? 0 : h)
      };
    }

    // East or west
    return {
      d: direction,
      x: x + (direction ? w : 0),
      y: y + getRandomInt(1, h - 1)
    };
  }

  function generateDungeon(width, height, minSize, maxSize) {
    var x, y, w, h, r, i;
    var rooms = [], room;
    var doors = [];
    var chests = [];
    var mobs = [];

    // Create an empty map
    var map = [];
    for (y = height; y--;) {
      map[y] = [];
      for (x = width; x--;) {
        map[y][x] = TILE_BLANK;
      }
    }

    // Generate the first room at the center of the map
    w = getRandomInt(minSize, maxSize);
    h = getRandomInt(minSize, maxSize);
    rooms.push(room = new Rectangle((width - w) / 2 | 0, (height - h) / 2 | 0, w, h));

    // Draw it
    dig(map, room.x + 1, room.y + 1, room.x + w - 2, room.y + h - 2);

    for (i = width * height * 2; i-- >= 0;) {
      // Generate a new room
      room = new Rectangle(0, 0, getRandomInt(minSize, maxSize), getRandomInt(minSize, maxSize));

      // Get the branching position
      var branchingPos = getBranchingPosition(getRandomElement(rooms));
      var dx = branchingPos.x;
      var dy = branchingPos.y;
      if (branchingPos.d > 2) { // North
        x = -room.w / 2;
        y = -room.h;
        dy--;
      } else if (branchingPos.d > 1) { // South
        x = -room.w / 2;
        y = 1;
        dy++;
      } else if (branchingPos.d) { // East
        x = 1;
        y = -room.h / 2;
        dx++;
      } else { // West
        x = -room.w;
        y = -room.h / 2;
        dx--;
      }

      // Ensure that we have integers
      room.x = branchingPos.x + x | 0;
      room.y = branchingPos.y + y | 0;

      // Ensure that we have enough space for the room
      var free = room.x >= 0 && room.y >= 0 && (room.x + room.w) < width && (room.y + room.h) < height;
      for (r = rooms.length; r-- && free;) {
        if (room.o(rooms[r])) {
          free = false;
        }
      }

      if (free) {
        // Draw the room and dig a wall
        dig(map, room.x + 1, room.y + 1, room.x + room.w - 2, room.y + room.h - 2);
        dig(map, branchingPos.x, branchingPos.y, dx, dy);

        // Put a door
        doors.push(branchingPos);
        rooms.push(room);
      } else {
        i--;
      }
    }

    // Define entrance and exit rooms
    var entrance = getRandomElement(rooms);
    var exit;
    do {
      exit = getRandomElement(rooms);
    } while (entrance === exit);

    // Add mobs
    var prob = [0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    for (r = rooms.length; r--;) {
      room = rooms[r];
      if (room !== entrance) {
        for (i = getRandomElement(prob); i--;) {
          mobs.push({
            x: room.x + getRandomInt(1, room.w - 2),
            y: room.y + getRandomInt(1, room.h - 2),
          });
        }
      }
    }

    // Place entrance elevator
    do {
      x = entrance.x + getRandomInt(1, entrance.w - 2);
    } while (!isWallTile(map[entrance.y][x]));
    entrance = {x: x, y: entrance.y};

    // Place exit elevator
    do {
      x = exit.x + getRandomInt(1, exit.w - 2);
    } while (!isWallTile(map[exit.y][x]));
    exit = {x: x, y: exit.y};

    return new Dungeon(width, height, map, doors, chests, mobs, entrance, exit);
  }

  function dig(map, x1, y1, x2, y2) {
    var tmp;

    if (x1 > x2) {
      tmp = x1; x1 = x2; x2 = tmp;
    }

    if (y1 > y2) {
      tmp = y1; y1 = y2; y2 = tmp;
    }

    for (var y = y1; y <= y2; y++) {
      for (var x = x1; x <= x2; x++) {
        map[y][x] = TILE_FLOOR;
      }
    }
  }

  return generateDungeon;
})();

if (__PW_DEBUG) {
  var dumpDungeon = function(dungeon) {
    var s = '';
    for (var y = 0; y < dungeon.h; y++) {
      for (var x = 0; x < dungeon.w; x++) {
        var t = dungeon.m[y][x];
        var tile;
        switch (t) {
          case 1:
            tile = ' ';
            break;

          case 0:
            tile = '#';
            break;

          default:
            tile = t;
        }

        s += tile;
      }

      s += "\n";
    }

    return s;
  };
}
