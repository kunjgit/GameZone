$.Hud = function() {
  var _ = this;
  _.ts = $.u.ts();

  _.render = function() {
    $.x.s();
    $.x.fillStyle = 'hsla(0,0%,30%,1)';
    $.x.fr(55, 5, 80, 10);
    $.x.fr(55, 20, 80, 10);
    $.x.fillStyle = $.C.w;
    $.x.ft('HEALTH', 10, 15);
    $.x.ft('MANA', 10, 30);
    $.x.ft('LEVEL ' + $.lv, 560, 15);
    $.x.ft('SCORE ' + $.sco, 560, 30);

    var co = [$.C.o, $.C.e, $.C.u, $.C.s],
        i;
    for (i in $.epow) {
      $.x.fillStyle = co[$.epow[i] - 1];
      $.x.beginPath();
      $.x.arc(150 + (15 * $.epow[i]), 10, 4, 0, (2 * Math.PI), 0);
      $.x.fill();
    }

    /* Health bar */
    var v = $.hero.he * 80 / $.hero.maxH;
    $.x.fillStyle = $.HCOLOR;
    $.x.fr(55, 5, v, 10);

    /* Mana bar */
    v = $.hero.ma * 80 / $.hero.maxM;
    $.x.fillStyle = $.MCOLOR;
    $.x.fr(55, 20, v, 10);

    $.x.sc(2, 2);
    if ($.hero.key)
      $.x.d(_.ts, 0, 17, 5, 10, 72, 2.5, 5, 10);
    $.x.r();
  };
};
