$.UI = {
  logoY: -80,
  logoYMin: -80,
  logoYMax: 60,
  startAlpha: 0,
  menuShowing: false
};

$.UI.update = function(dt) {
  if($.DEAD) {
    if($.REVIVING) {
      $.UI.logoY -= 200 * dt;
      $.UI.startAlpha -= dt;
    } else {
      $.UI.logoY += 200 * dt;
      $.UI.startAlpha += dt;
    }

    $.UI.logoY = $.UTILS.clamp($.UI.logoY, $.UI.logoYMin, $.UI.logoYMax);
    $.UI.startAlpha = $.UTILS.clamp($.UI.startAlpha, 0, 1);

    $.UI.menuShowing = $.UI.logoY == $.UI.logoYMax && $.UI.startAlpha == 1;
  }
};

$.UI.render = function(c) {

  c.strokeStyle = c.fillStyle = "#fff";

  if(!$.DEAD) {

    c.save();

      c.translate(40, 20);
      c.scale(2, 2);

      c.textAlign = "left";

      c.lineWidth = 2;
      c.strokeRect(0, 0, 100, 8);
      c.stroke();

      c.clearRect(-1, -1, 2, 2);
      c.clearRect(-1, 7, 2, 2);
      c.clearRect(99, -1, 2, 2);
      c.clearRect(99, 7, 2, 2);

      c.beginPath();
      c.fillRect(
        2,
        2,
        $.DEAD ? 0 : 96 / $.LEVEL_MAX * ($.LEVEL_MAX - $.LEVEL),
        4);
      c.fill();

      c.font = "bold 7px sans-serif";
      c.fillText("SANITY", 1, 16);

    c.restore();

    c.save();

      c.translate($.W - 250, 20);
      c.scale(2, 2);

      c.lineWidth = 2;
      c.strokeRect(0, 0, 100, 8);
      c.stroke();

      c.clearRect(-1, -1, 2, 2);
      c.clearRect(-1, 7, 2, 2);
      c.clearRect(99, -1, 2, 2);
      c.clearRect(99, 7, 2, 2);

      c.textAlign = "right";

      c.font = "bold 7px sans-serif";
      c.fillText("SCORE", 99, 16);

      c.font = "bold 7px sans-serif";
      c.fillText("" + $.PLAYER.score, 98, 6.5);

    c.restore();
  } else {

    c.fillStyle = "#143";
    var marginH = 90;
    c.roundRect(marginH, $.UI.logoY, $.W - marginH * 2, 80, 5).fill();
    c.strokeStyle = "#fff";
    c.roundRect(marginH + 5, $.UI.logoY + 5, $.W - (marginH + 5) * 2, 70, 3).stroke();

    c.textAlign = "center";
    c.font = "bold 50px sans-serif";
    c.fillStyle = "#333";
    var t = "MEXICO ESCAPE";
    c.fillText(t, $.W / 2, $.UI.logoY + 60);
    c.fillStyle = "#fff";
    c.fillText(t, $.W / 2, $.UI.logoY + 58);

    c.save();
    c.globalAlpha = $.UI.startAlpha;

    if($.ONE_RUN) {
      c.font = "bold 24px sans-serif";
      c.fillText("SCORE: " + $.PLAYER.score, $.W / 2, 210);
    }

    c.font = "bold 16px sans-serif";
    c.fillText(($.MOBILE ? "TAP" : "PRESS SPACE") + " TO START", $.W / 2, 300);
    c.restore();
  }
};