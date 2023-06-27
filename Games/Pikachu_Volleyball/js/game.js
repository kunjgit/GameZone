var Game = function () {
  this.MAX_POINT = 21;
  this.COURT_SIZE = { width: null, height: null };
  this.START = false;
  // this.COURT_LIMIT = {x: null, y: null};
  this.CURRENT_PLAYER = "p1"; // <-start with P1 DEFAULT
  this.SCORE_TAKER = null;
  this.NET_HEIGHT = 200;
  this.NET_WIDTH = 2;
  this.PLAYER_ON_JUMP = false;
  this.p1 = null;
  this.p2 = null;
  this.ball = null;
  this.SPIKE_MODE = null;
  this.score = { p1: 0, p2: 0 };
  (this.COURT_ORIGIN = { x: null, y: null }), (this.thresholdLevel = null);
  this.bounceIncrement = 0;
  this.onHOLD = false;
  this.border = 5; // border width to check for boundary
};

var on_TIMER = {
  ball: null,
  p1: null,
  p2: null,
  animation: null,
};

Game.prototype.courtSETUP = function () {
  this.COURT_ORIGIN.x = $("#court").offset().left;
  this.COURT_ORIGIN.y = $("#court").offset().top;
  this.COURT_SIZE.width = $("#court").width();
  this.COURT_SIZE.height = 500;
  this.thresholdLevel = $("#p1").offset().top;
  this.p1 = new Player();
  this.p2 = new Player();
  this.p1.initialize(this, "p1");
  this.p2.initialize(this, "p2");
};

Game.prototype.initialize = function () {
  this.p1.initialize(this, "p1");
  this.p2.initialize(this, "p2");
  this.ball = new Ball();
  this.ball.initialize(this, this[this.CURRENT_PLAYER]);
};

function CHECK_BOUNDARY() {
  //* game.ball *//
  var x = game.ball.position.x;
  var y = game.ball.position.y;
  var result = [];

  // X BOUNDARY
  if (x <= game.COURT_ORIGIN.x + game.border) {
    result.push("left-border");
  } else if (
    x >=
    game.COURT_SIZE.width +
      game.COURT_ORIGIN.x -
      game.ball.ballRadius -
      game.border
  ) {
    result.push("right-border");
  }

  // Y BOUNDARY
  if (y <= game.COURT_ORIGIN.y + game.border) {
    result.push("top-border");
  } else if (y >= game.thresholdLevel) {
    // REMOVE LATER
    result.push("bottom-border"); // CASE: TOUCH GROUND
  }

  // WITH PLAYER
  var hit_target = HIT_RADIUS(90);
  if (hit_target.target !== null) {
    if (hit_target.x < 0) {
      // ball x < player x
      result.push("player-at-right");
    } else if (hit_target.x > 0) {
      result.push("player-at-left");
    }
    if (hit_target.y < 0) {
      result.push("player-at-bottom");
    } else if (hit_target.y > 0) {
      result.push("player-at-top");
    }
    result.push("player");
  }

  if (game.ball.t !== 0 && result.length !== 0) {
    //TRAJ->BOUNC
    game.ball.t = 0;
    SUBSEQUENT_MOTION(result);
  } else if (result.length !== 0) {
    //NORMAL BOUNCE
    SUBSEQUENT_MOTION(result);
  }
  return result;
}

function SUBSEQUENT_MOTION(borderArray) {
  if (borderArray.length !== 0) {
    for (var k = 0; k < borderArray.length; k++) {
      switch (borderArray[k]) {
        case "left-border":
          game.ball.position.x += game.border;
          game.ball.velocity.x *= -1;
          break;
        case "right-border":
          game.ball.position.x -= game.border;
          game.ball.velocity.x *= -1;
          break;
        case "top-border":
          game.ball.position.y += game.border;
          game.ball.velocity.y *= -1;
          break;
        case "bottom-border":
          jBeep("./audio/smash.wav");
          clearInterval(on_TIMER.ball);
          lose_ANIMATION();
          ADD_SCORE();
          break;
        case "player":
          if (game.SPIKE_MODE !== null && game.ball.t == 0) {
            // JUST STARTED TRAJECTORY
          }
          game.ball.velocity.y *= -1;
          game.ball.velocity.x *= -1;
          break;
        case "player-at-right":
          game.ball.position.x -= game.bounceIncrement; // VALUE RELATED TO HIT_RADIUS max allowable radius
          break;
        case "player-at-left":
          game.ball.position.x += game.bounceIncrement;
          break;
        case "player-at-bottom":
          game.ball.position.y -= 5;
          break;
        case "player-at-top":
          game.ball.position.y += 5;
          break;
      }
    }
  }
}

function HIT_RADIUS(maxRadius) {
  var player = ["p1", "p2"];
  var ballPosition = game.ball.adjust_REF();

  var result = {
    target: null,
    x: null,
    y: null,
  };

  player.forEach(function (elem) {
    var playerPosition = game[elem].adjust_REF();
    var radius = Math.sqrt(
      Math.pow(ballPosition.x - playerPosition.x, 2) +
        Math.pow(ballPosition.y - playerPosition.y, 2)
    );

    if (radius <= maxRadius) {
      result.target = elem;
      result.x = ballPosition.x - playerPosition.x;
      result.y = ballPosition.y - playerPosition.y;
    }
  });
  return result;
}

function CHECK_NET() {
  //* game.ball.position *//
  var x = game.ball.position.x;
  var y = game.ball.position.y;
  var result = [];

  var lowerLIMIT =
    game.COURT_ORIGIN.x +
    game.COURT_SIZE.width / 2 -
    game.NET_WIDTH -
    game.ball.ballRadius / 1.5;
  var upperLIMIT =
    game.COURT_ORIGIN.x + game.COURT_SIZE.width / 2 + game.NET_WIDTH;
  var netLIMIT =
    game.COURT_ORIGIN.y +
    game.COURT_SIZE.height -
    game.NET_HEIGHT -
    game.ball.ballRadius;

  var result = {
    // target: null,
    x: null,
    y: null,
  };

  if (x >= lowerLIMIT && x <= upperLIMIT && y >= netLIMIT) {
    clearInterval(on_TIMER.ball);
    jBeep("./audio/smash.wav");
    if (game.ball.velocity.x > 0) {
      lose_ANIMATION(200);
      ADD_SCORE("p1");
    } else if (game.ball.velocity.x < 0) {
      lose_ANIMATION(350);
      ADD_SCORE("p2");
    }
  }
}

function lose_ANIMATION(limit) {
  // var limit = limit || 0;
  $("#pika").animate(
    {
      top: 0,
      left: limit,
    },
    500,
    function () {
      $("#pika").animate(
        {
          top: -20,
        },
        200,
        "linear",
        function () {
          $("#pika").animate(
            {
              top: 0,
            },
            200,
            function () {
              $("#pika").css("visiblity:hidden");
            }
          );
        }
      );
    }
  );
  // $("#pika").css(('visiblity:hidden'));
}

function ADD_SCORE(player) {
  switch (player) {
    case "p1":
      game.score.p2++;
      game.CURRENT_PLAYER = "p2";
      break;
    case "p2":
      game.CURRENT_PLAYER = "p1";
      game.score.p1++;
      break;
    case undefined: // CASE FROM SUBSEQUENT MOTION
      if (
        game.ball.position.x <=
        game.COURT_ORIGIN.x + game.COURT_SIZE.width / 2 - game.ball.ballRadius
      ) {
        game.CURRENT_PLAYER = "p2";
        game.score.p2++;
      } else if (
        game.ball.position.x >=
        game.COURT_ORIGIN.x + game.COURT_SIZE.width / 2
      ) {
        game.CURRENT_PLAYER = "p1";
        game.score.p1++;
      }
      break;
  }

  UPDATE_SCOREBOARD();

  if (game.score.p1 >= game.MAX_POINT || game.score.p2 >= game.MAX_POINT) {
    $("#reset").css({ opacity: 0 });
    $("#gameOver").css({ "z-index": 1 });
    clearInterval(on_TIMER.ball);
  } else {
    // START NEW POINT
    // game.onHOLD = true;
    var t = 3;
    var countdownTIMER = setInterval(function () {
      $("#countdown").html(t);
      if (t <= 0) {
        $("#countdown").html("");
        clearInterval(countdownTIMER);
        clearInterval(on_TIMER.ball);
        game.initialize();
      }
      t--;
    }, 1000);
    // game.onHOLD = false;
  }
}
