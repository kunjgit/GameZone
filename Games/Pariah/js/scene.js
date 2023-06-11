$.Scene= function() {
  var _ = this;

  // Reset values. If h is true then it hides the messages too
  _.r = function(h) {
    _.s = 0; // Step
    _.e = 0; // Elapsed
    _.t = $.n(); // Current time
    _.f = 0; // Fading
    if (!h) return;
    ['s', 's1', 'i', 'g', 'e'].forEach(function(e) {
        $.u.v(e, 0);
    });
    $.u.hide('m1');
  };

  // Load an scene, execute the method m and then call the loop callback c
  _.l = function(m, c) {
    caf($.animId);
    _.r(1);
    $.input.u();
    m();
    $.animId = raf(c);
  };

  // Updates the elapsed time and the input
  _.u = function() {
    $.clr();
    _.e = $.n() - _.t;
    $.input.u();
  };

  _.n = function() {
    var s = _.s;
    _.r();
    _.s = s + 1;
  };

  _.r(1);
};

$.FadeIn = function() {
  var _ = this;
  _.done = true;

  _.start = function(d) {
    _.done = false;
    _.d = d; // Fade duration
    _.e = 0; // Elapsed time
    _.c = $.n(); // Activation time
  };

  _.render = function() {
    if (_.done) return;

    _.e = $.n() - _.c;
    if (_.e > _.d) {
      _.e = _.d;
      _.done = true;
    }
    var a = (1 - _.e / _.d).toString().substr(0, 3);
    $.x.fillStyle = "rgba(0,0,0," + a +")";
    $.x.fr(0, 0, $.cam.w, $.cam.h);
  };
};

$.FadeOut = function() {
  var _ = this;
  _.done = true;
  _.quit = true;

  _.start = function(d, c) {
    _.color = c || '0,0,0';
    _.done = false;
    _.quit = false;
    _.d = d; // Fade duration
    _.e = 0; // Elapsed time
    _.c = $.n(); // Activation time
  };

  _.render = function() {
    if (_.quit) return;

    _.e = $.n() - _.c;
    if (_.e > _.d) {
      _.e = _.d;
      _.done = true;
    }
    var a = (_.e / _.d).toString().substr(0, 3);
    $.x.fillStyle = "rgba(" + _.color + "," + a +")";
    $.x.fr(0, 0, $.cam.w, $.cam.h);
  };
};
