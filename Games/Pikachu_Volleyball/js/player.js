var Player = function () {
  this.init_position = { x: null, y: null };
  this.position = { x: null, y: null };
  this.velocity = { x: null, y: null };
  this.init_pos = { x: null, y: null };
  this.up = false;
  this.hit = false;
  (this.control = {
    up: false,
    hit: false,
  }),
    (this.g = 12);
  this.t = 0;
  this.dimension = { width: 120, height: 85 };
  this.name = null;
  this.thresholdLevel = null;
  this.traj = {
    velocity: { x: 0, y: -90 },
  };
  this.score = 0;
  this.touch = 0;
};

Player.prototype.initialize = function (parent, name) {
  this.name = name;
  this.dimension.width = $("#p1").width();
  this.dimension.height = $("#p1").height();
  switch (name) {
    case "p1":
      this.init_position.x = parent.COURT_ORIGIN.x + 100;
      break;
    case "p2":
      this.init_position.x =
        parent.COURT_ORIGIN.x +
        parent.COURT_SIZE.width -
        100 -
        this.dimension.width;
      break;
  }
  this.init_position.y = parent.thresholdLevel;

  this.position.x = this.init_position.x;
  this.position.y = this.init_position.y;

  this.UPDATE_POSITION();
};

Player.prototype.start_JUMP = function (game) {
  this.control.up = true;
  this.init_position.x = this.position.x;
  this.init_position.y = this.position.y;
  var player_name = this.name;
  on_TIMER[this.name] = setInterval(function () {
    JUMP_MOTION(game, player_name);
  }, 10);
};

function JUMP_MOTION(parent, player) {
  parent[player].position.x =
    parent[player].init_position.x +
    parent[player].traj.velocity.x * parent[player].t;
  parent[player].position.y =
    parent[player].init_position.y +
    parent[player].traj.velocity.y * parent[player].t +
    0.5 * parent[player].g * Math.pow(parent[player].t, 2);

  if (
    parent[player].position.y >= parent.thresholdLevel &&
    parent[player].t !== 0
  ) {
    parent[player].t = 0;
    parent[player].position.x = parent[player].init_position.x;
    parent[player].position.y = parent[player].init_position.y;
    parent[player].UPDATE_POSITION();
    parent[player].control.up = false;
    clearInterval(on_TIMER[player]);
    on_TIMER[player] = null;
  } else {
    parent[player].UPDATE_POSITION();
    parent[player].t += 0.25;
  }
}

Player.prototype.UPDATE_POSITION = function () {
  $("#" + this.name).offset({
    top: this.position.y,
    left: this.position.x,
  });
};

Player.prototype.adjust_REF = function () {
  var result = { x: null, y: null };
  switch (this.name) {
    case "p1":
      result.x = this.position.x + this.dimension.width * 0.7;
      result.y = this.position.y + this.dimension.height * 0.5;
      break;
    case "p2":
      result.x = this.position.x + this.dimension.width * 0.3;
      result.y = this.position.y + this.dimension.height * 0.5;
      break;
  }
  return result;
};

function RESTRICT_PLAYER(player, direction) {
  //* game.player *//
  var x = game[player].position.x;
  var y = game[player].position.y;
  var result = [];

  switch (game[player].name) {
    case "p1":
      switch (direction) {
        case "left":
          if (x <= game.COURT_ORIGIN.x + game.border) {
            return true;
          }
          break;
        case "right":
          if (
            x >=
            game.COURT_ORIGIN.x +
              game.COURT_SIZE.width / 2 -
              game[player].dimension.width -
              game.border
          ) {
            return true;
          }
          break;
      }
      break;
    case "p2":
      switch (direction) {
        case "left":
          if (
            x <=
            game.COURT_ORIGIN.x + game.COURT_SIZE.width / 2 + game.border
          ) {
            return true;
          }
          break;
        case "right":
          if (
            x >=
            game.COURT_ORIGIN.x +
              game.COURT_SIZE.width -
              game[player].dimension.width -
              game.border
          ) {
            return true;
          }
          break;
      }
  }
}
