var game;

var KEY_CODE = {
  87: { action: "up", player: "p1" },
  65: { action: "left", player: "p1" },
  68: { action: "right", player: "p1" },
  32: { action: "hit", player: "p1" },
  38: { action: "up", player: "p2" },
  37: { action: "left", player: "p2" },
  39: { action: "right", player: "p2" },
  13: { action: "hit", player: "p2" },
};

$(function () {
  game = new Game();
  game.courtSETUP();
  setup_COURT();
  setup_INSTRUCTION();
  animCount = 0;
  on_TIMER.animation = setInterval(animateStart, 1200);

  $("#start").on("click", function (event) {
    jBeep("./audio/pikachu.wav");
    clearInterval(on_TIMER.animation);
    $("#start").css("visibility:hidden");
    $("#reset").css("opacity", "1");
    $("#instruction").css({
      "z-index": -1,
    });
    game.bounceIncrement = 5;

    $(document).keydown(function (e) {
      e.preventDefault();
      if (e.which in KEY_CODE) {
        // if (game.onHOLD == false){
        switch (KEY_CODE[e.which].action) {
          case "up":
            if (game[KEY_CODE[e.which].player].control.up == false) {
              game[KEY_CODE[e.which].player].start_JUMP(game);
              game[KEY_CODE[e.which].player].UPDATE_POSITION();
            }
            break;
          case "left":
            if (
              !RESTRICT_PLAYER(
                KEY_CODE[e.which].player,
                KEY_CODE[e.which].action
              )
            ) {
              game[KEY_CODE[e.which].player].position.x -= 20;
              game[KEY_CODE[e.which].player].UPDATE_POSITION();
            }
            break;
          case "right":
            if (
              !RESTRICT_PLAYER(
                KEY_CODE[e.which].player,
                KEY_CODE[e.which].action
              )
            ) {
              game[KEY_CODE[e.which].player].position.x += 20;
              game[KEY_CODE[e.which].player].UPDATE_POSITION();
            }
            break;
          case "hit":
            var hit_target = HIT_RADIUS(130);
            if (hit_target.target !== null) {
              jBeep("./audio/pi.wav");
              clearInterval(on_TIMER.ball);
              spark_effect(hit_target.target);
              game.SPIKE_MODE = true;
              game.ball.init_TRAJECTORY(hit_target);
            }
            break;
        }
        // };
      }
    });
  });

  $("#reset").on("click", function () {
    document.location.reload(true);
  });
  $("#restart").on("click", function () {
    document.location.reload(true);
  });

  game.initialize();
});

function initiate() {
  game.ball.start_BOUNCE();
}

function spark_effect(player) {
  $("#effect").append(
    "<img src='img/light2.png' id='tmp_spark' style='width:300px'>"
  );
  switch (player) {
    case "p1":
      $("#tmp_spark").offset({
        top: game[player].position.y - 100,
        left: game[player].position.x - 50,
      });
      break;
    case "p2":
      $("#tmp_spark").offset({
        top: game[player].position.y - 100,
        left: game[player].position.x - 150,
      });
      break;
  }
  $("#tmp_spark").animate(
    {
      opacity: 0,
    },
    1000,
    function () {
      $("#tmp_spark").remove();
    }
  );
}

function UPDATE_SCOREBOARD() {
  $(".score").each(function () {
    $(this).html(game.score[$(this).attr("id").split("_score")[0]]);
  });
}

function setup_COURT() {
  $("#NET").offset({
    top: game.thresholdLevel - game.NET_HEIGHT + game.p1.dimension.height,
    left: game.COURT_ORIGIN.x + game.COURT_SIZE.width / 2 - 2,
  });
  $("#countdown").offset({
    top: $("#court").offset().top,
  });
}

function guideOffHover() {
  $("#userGuide").css({ "z-index": -2 });
}

function setup_INSTRUCTION() {
  $("td").hover(function () {
    if (
      $(this).attr("class") !== undefined &&
      $(this).attr("class") !== "playerCell"
    ) {
      var opsName = $(this).attr("class").split("user")[1];
      $("#userGuide")
        .css({ "z-index": 2 })
        .html("<span>" + opsName + "</span>");
    }
  }, guideOffHover);
  $("#saveSetting").on("click", function () {
    if ($("#max-point").val() == "") {
    } else if ($("#max-point").val() > 1) {
      game.MAX_POINT = parseInt($("#max-point").val());
    } else {
      alert("must be larger than 1!");
    }
    $("#max-point").val("");
  });
}

function animateStart() {
  animCount++;
  jBeep("./audio/pika4.wav");
  $("#starterImage").animate(
    {
      width: 400,
    },
    500,
    function () {
      $("#starterImage").animate(
        {
          width: 300,
        },
        500
      );
    }
  );
  if (animCount > 10 || game.START) {
    clearInterval(on_TIMER.animation);
  }
}
