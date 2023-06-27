var Ball = function () {
  this.dt = 1;
  this.bouncing_t = 0;
  this.radiusRange = 80;
  this.ballRadius = 100;
  this.position = { x: null, y: null };
  this.velocity = { x: 0, y: -5 };
  this.up = false;
  this.hit = false;
  this.init_pos = { x: null, y: null };
  this.init_vel = 120;
  this.angle = 0;
  this.g = 12; // [sensitivity parameter]
  this.idName = "#pika";
  this.t = 0;
};

Ball.prototype.initialize = function (parent, current_player, start) {
  if (this.position.x == null || this.position.y == null) {
    switch (current_player.name) {
      case "p1":
        this.position.x = current_player.init_position.x + 90;
        break;
      case "p2":
        this.position.x = current_player.init_position.x - 50;
        break;
    }
    this.position.y = parent.COURT_ORIGIN.y;
  }
  this.UPDATE_POSITION();

  this.start_BOUNCE();
};

Ball.prototype.adjust_REF = function () {
  var result = { x: null, y: null };
  result.x = this.position.x + this.ballRadius * 0.5;
  result.y = this.position.y + this.ballRadius * 0.5;
  return result;
};

Ball.prototype.UPDATE_POSITION = function () {
  $("#pika").offset({
    top: this.position.y,
    left: this.position.x,
  });
};

Ball.prototype.start_BOUNCE = function () {
  on_TIMER.ball = setInterval(BOUNCE_MOTION, 10);
};

function BOUNCE_MOTION() {
  game.ball.position.x += game.ball.velocity.x * game.ball.dt;
  game.ball.position.y += game.ball.velocity.y * game.ball.dt;

  CHECK_BOUNDARY();

  CHECK_NET();
  game.ball.UPDATE_POSITION();
}

Ball.prototype.start_TRAJECTORY = function () {
  on_TIMER.ball = setInterval(TRAJECTORY_MOTION, 10);
};

function TRAJECTORY_MOTION() {
  if (game.ball.t == 0) {
    game.ball.init_pos.x = game.ball.position.x;
    game.ball.init_pos.y = game.ball.position.y;
    // game.ball.velocity.x *= 3; //TBC-UPON COLLISION
    // game.ball.velocity.y *= 3; //TBC-UPON COLLISION
    game.ball.t += 0.2;
  } else {
    game.ball.position.x =
      game.ball.init_pos.x + game.ball.velocity.x * game.ball.t;
    game.ball.position.y =
      game.ball.init_pos.y +
      game.ball.velocity.y * game.ball.t +
      0.5 * game.ball.g * Math.pow(game.ball.t, 2);

    if (CHECK_BOUNDARY().length !== 0) {
      clearInterval(on_TIMER.ball);
      on_TIMER.ball = null;
      game.ball.start_BOUNCE();
      game.ball.velocity.x /= 9;
      game.ball.velocity.y /= 9;
    } else {
      CHECK_NET();
      game.ball.UPDATE_POSITION();
      game.ball.t += 0.2;
    }
  }
}

Ball.prototype.init_TRAJECTORY = function (hitRadius_array) {
  this.angle = Math.atan(hitRadius_array.y / hitRadius_array.x);
  this.velocity.x = this.init_vel * Math.cos(this.angle);
  this.velocity.y = this.init_vel * Math.sin(this.angle);
  this.t = 0;
  this.start_TRAJECTORY();
};
