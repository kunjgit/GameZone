$.TextPop = function(text, x, y, c) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.oy = y - 45;
  _.dy = 0.65;
  _.elapsed = 0;
  _.ctime = $.n();
  _.text = text;
  _.bounds = {r:0, b:0};
  _.c = c;

  _.update = function(i) {
    if (_.y > _.oy)
      _.y -= _.dy;
    _.elapsed = $.n() - _.ctime;
    if (_.elapsed >= 800)
      _.die(i);
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.fillStyle = _.c;
    $.x.fillText(_.text, tx, ty);
    $.x.r();
  };

  _.die = function(i) {
    $.textPops.splice(i, 1);
  };

};
