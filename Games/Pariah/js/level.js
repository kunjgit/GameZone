// Based on http://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
// Arguments: level number, width, height, number of enemies, item to be placed, leaf size
$.Level = function(n, w, h, en, it, ls) {
  var _ = this,
      root = new $.Leaf(0, 0, w, h);
  _.n = n;
  // Randomize w and h if they are undefined
  _.w = w;
  _.h = h;
  _.maxLeafSize = ls || 15;
  _.leafs = [];
  _.map = [];

  _.leafs.push(root);

  _.isWall = function(x, y) {
    return (_.map[x][y] === '#') ? true : false;
  };

  // Return a random point inside a room
  _.rPoint = function(r, p) {
    var pad = p || 0; // Padding
    return {
      x: $.u.rand(r.l + pad, r.r - pad),
      y: $.u.rand(r.t + pad, r.b - pad)
    };
  };

  // Checks if the point (x,y) is a corner of the room r
  _.isCorner = function(x, y, r) {
    return ((x === r.t && y === r.l) ||
            (x === r.t && y === r.r) ||
            (x === r.b && y === r.l) ||
            (x === r.b && y === r.r));
  };

  // Let's create all the leafs using a recursive method
  //this.makeLeafs = function(l) {
  function makeLeafs(l) {
    if (l.lc === null && l.rc === null) {
      // Split if the leaf is too big or 75% chance
      if (l.w > _.maxLeafSize || l.height > _.maxLeafSize || $.u.rand(0, 101) > 25) {
        if (l.split()) {
          _.leafs.push(l.lc);
          _.leafs.push(l.rc);
          makeLeafs.call(_, l.lc);
          makeLeafs.call(_, l.rc);
        }
      }
    }
  }

  makeLeafs.call(_, root);
  root.makeRooms();

  // Make map
  var i = 0, j = 0;
  for (i=0; i<w; i++) {
    _.map[i] = [];
    for (j=0; j<h; j++){
      _.map[i][j] = '#';
    }
  }

  var ar = []; // Available rooms
  _.leafs.forEach(function(l) {
    var r = l.room;
    if (r !== null) {
      ar.push(r);
      for (i=r.l; i<=r.r; i++) {
        for (j=r.t; j<=r.b; j++) {
          _.map[i][j] = '.';
        }
      }
    }

    l.halls.forEach(function(h) {
      for (i=h.l; i<=h.r; i++) {
        for (j=h.t; j<=h.b; j++) {
          _.map[i][j] = '.';
        }
      }
    });
  });

  // Last room
  var lr = ar.pop();

  // Place enemies
  // We chose a random point in a random room and we try to put the 
  // enemy. If there is an enemy in that position another point will
  // be selected inside the same room. If after 5 tries the algorithm
  // can't find a spot for the enemy, another room is selected.
  var ec = en,
      p = null,
      epr = (en / ar.length),
      t = 0;
  while (ec > 0) {
    var rr = ar[$.u.rand(0, ar.length)];
    p = _.rPoint(rr);
    while (_.map[p.x][p.y] === 'e') {
      t++;
      if (t > 4) {
        rr = ar[$.u.rand(0, ar.length)];
        t = 0;
      }
      p = _.rPoint(rr);
    }
    $.enemies.push(new $.Zombie(p.x * 32, p.y * 32));
    ec--;
    _.map[p.x][p.y] = 'e';
  }

  // Place hero and entrance
  p = _.rPoint(lr);
  var b = null;
  while (true) {
    b = {x: p.x, y: p.y};
    var rw = $.u.rand(0, 4);
    if (rw === 0) { // North wall
      p.y = lr.t - 1;
      b.y = p.y + 2;
    } else if (rw === 1) { // East wall
      p.x = lr.r + 1;
      b.x = p.x - 2;
    } else if (rw === 2) { // South wall
      p.y = lr.b + 1;
      b.y = p.y - 2;
    } else if (rw === 3) { // West wall
      p.x = lr.l - 1;
      b.x = p.x + 2;
    }
    if (!_.isWall(p.x, p.y) || _.isCorner(p.x, p.y, lr)) {
      p = _.rPoint(lr);
    } else {
      break;
    }
  }
  $.hero = new $.Hero(b.x * 32, b.y * 32);
  $.walls.push(new $.Entrance(p.x * 32, p.y * 32));
  _.map[p.x][p.y] = '*';
  _.map[b.x][b.y] = 'h';

  // Place exit
  // We select a random room and place the exit in one of its walls
  var xr = ar[$.u.rand(0, ar.length)];
  p = _.rPoint(xr);
  while (true) {
    var xw = $.u.rand(0, 4);
    if (xw === 0) { // North wall
      p.y = xr.t - 1;
    } else if (xw === 1) { // East wall
      p.x = xr.r + 1;
    } else if (xw === 2) { // South wall
      p.y = xr.b + 1;
    } else if (xw === 3) { // West wall
      p.x = xr.l - 1;
    }
    if (!_.isWall(p.x, p.y) || _.isCorner(p.x, p.y, xr)) {
      p = _.rPoint(xr);
    } else {
      break;
    }
  }
  $.exit[0] = new $.Exit(p.x * 32, p.y * 32);
  _.map[p.x][p.y] = '@';

  // Place items
  t = 0;
  for (i=it.length; i--;) {
    var ir = ar[$.u.rand(0, ar.length)];
    p = _.rPoint(ir);
    while (_.map[p.x][p.y] === 'i') {
      t++;
      if (t > 4) {
        ir = ar[$.u.rand(0, ar.length)];
        t = 0;
      }
      p = _.rPoint(ir);
    }
    $.items.push(new it[i](p.x * 32 + 8, p.y * 32 + 8));
    _.map[p.x][p.y] = 'i';
  }


  // Showing off
  //for (var v=0; v<_.h; v++) {
  //  var row = [];
  //  for (var u=0; u<_.w; u++) {
  //    row.push(_.map[u][v]);
  //  }
  //  console.log(v, row.join(''));
  //}

};

$.Leaf = function(x, y, w, h) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = w;
  _.h = h;
  _.lc = null; // left child
  _.rc = null; // right child
  _.min = 6; // Min leaf size
  _.room = null;
  _.halls = [];

  _.split = function() {
    // Abort if the leaf is already splitted
    if (_.lc !== null || _.rc !== null)
      return false;

    // Determine direction of split
    // If the width is >25% larger than the height, we split vertically
    // If the height is >25% larger than the width, we split horizontally
    // Else we split randomly
    var splith = !!$.u.rand(0, 2);
    if (_.w > _.h && _.w / _.h >= 0.25)
      splith = false;
    else if (_.h > _.w && _.h / _.w >= 0.25)
      splith = true;

    var max = (splith ? _.h : _.w) - _.min;
    // Abort if the area is too small to split
    if (max <= _.min)
      return false;

    var split = $.u.rand(_.min, max);

    // Create the left and right children
    if (splith) {
      _.lc = new $.Leaf(_.x, _.y, _.w, split);
      _.rc = new $.Leaf(_.x, _.y + split, _.w, _.h - split);
    } else {
      _.lc = new $.Leaf(_.x, _.y, split, _.h);
      _.rc = new $.Leaf(_.x + split, _.y, _.w - split, _.h);
    }

    return true;
  };

  _.makeRooms = function() {
    if (_.lc !== null || _.rc !== null) {
      if (_.lc !== null)
        _.lc.makeRooms();
      if (_.rc !== null)
        _.rc.makeRooms();
      if (_.lc !== null && _.rc !== null)
        _.makeHall(_.lc.getRoom(), _.rc.getRoom());
    } else {
      var size = {
            w: $.u.rand(3, _.w - 2),
            h: $.u.rand(3, _.h - 2)
          },
          pos = {
            x: $.u.rand(1, _.w - size.w - 1),
            y: $.u.rand(1, _.h - size.h - 1),
          };
      _.room = new $.Rect(_.x + pos.x, _.y + pos.y, size.w, size.h);
    }
  };

  _.getRoom = function() {
    if (_.room !== null) {
      return _.room;
    } else {
      var lRoom = null,
          rRoom = null;

      if (_.lc !== null)
        lRoom = _.lc.getRoom();
      if (_.rc !== null)
        rRoom = _.lc.getRoom();

      if (lRoom === null && rRoom === null) {
        return null;
      } else if (rRoom === null) {
        return lRoom;
      } else if (lRoom === null) {
        return rRoom;
      } else if ($.u.rand(1, 11) > 5) {
        return lRoom;
      } else {
        return rRoom;
      }
    }
  };

  // This method connects the two rooms together (l and r) with hallways
  _.makeHall = function(lRoom, rRoom) {
    var r = $.Rect,
        p1 = {
          x: $.u.rand(lRoom.l + 1, lRoom.r - 2),
          y: $.u.rand(lRoom.t + 1, lRoom.b -2)
        },
        p2 = {
          x: $.u.rand(rRoom.l + 1, rRoom.r - 2),
          y: $.u.rand(rRoom.t + 1, rRoom.b -2)
        },
        width = p2.x - p1.x,
        height = p2.y - p1.y;

    if (width < 0) {
      if (height < 0) {
        if ($.u.rand(0, 10) > 4) {
          _.halls.push(new r(p2.x, p1.y, abs(width), 1));
          _.halls.push(new r(p2.x, p2.y, 1, abs(height)));
        } else {
          _.halls.push(new r(p2.x, p2.y, abs(width), 1));
          _.halls.push(new r(p1.x, p2.y, 1, abs(height)));
        }
      } else if (height > 0) {
        if ($.u.rand(0, 10) > 4) {
          _.halls.push(new r(p2.x, p1.y, abs(width), 1));
          _.halls.push(new r(p2.x, p1.y, 1, abs(height)));
        } else {
          _.halls.push(new r(p2.x, p2.y, abs(width), 1));
          _.halls.push(new r(p1.x, p1.y, 1, abs(height)));
        }
      // if (height === 0)
      } else {
        _.halls.push(new r(p2.x, p2.y, abs(width), 1));
      }
    } else if (width > 0){
      if (height < 0) {
        if ($.u.rand(0, 10) > 4) {
          _.halls.push(new r(p1.x, p2.y, abs(width), 1));
          _.halls.push(new r(p1.x, p2.y, 1, abs(height)));
        } else {
          _.halls.push(new r(p1.x, p1.y, abs(width), 1));
          _.halls.push(new r(p2.x, p2.y, 1, abs(height)));
        }
      } else if (height > 0) {
        if ($.u.rand(0, 10) > 4) {
          _.halls.push(new r(p1.x, p1.y, abs(width), 1));
          _.halls.push(new r(p2.x, p1.y, 1, abs(height)));
        } else {
          _.halls.push(new r(p1.x, p2.y, abs(width), 1));
          _.halls.push(new r(p1.x, p1.y, 1, abs(height)));
        }
      // if (height === 0)
      } else {
        _.halls.push(new r(p1.x, p1.y, abs(width), 1));
      }
    // if (width === 0)
    } else {
      if (height < 0) {
        _.halls.push(new r(p2.x, p2.y, 1, abs(height)));
      } else {
        _.halls.push(new r(p1.x, p1.y, 1, abs(height)));
      }
    }
  };
};
