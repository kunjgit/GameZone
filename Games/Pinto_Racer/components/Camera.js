var Camera = (function () {
  return {
    create: function (selector) {
      var _ = {};
      Positionable(_);
      Rotatable(_);
      Scalable(_);
      Renderable(_);

      _.el = $(selector);
      _.pos.x = 0;
      _.pos.y = -170;
      _.pos.z = 600;
      _.rotation.x = 75;
      _.rotation.y = 0;
      _.rotation.z = 0;
      _.has360View = true;

      _.set360View = function (n, speed) {
        _.has360View = n;
        _.viewRotateSpeed = speed;
        if (!n) {
          _.rotation.z %= 360;
          if (_.rotation.z > 180) {
            _.rotation.z %= 180;
            _.rotation.z = 180 - _.rotation.z;
          }
        }
        return _;
      };

      _.update = function () {
        if (_.has360View) {
          // rate of 360 spin
          _.rotation.z += 0.25;
        } else {
          // rate of return to normal view
          _.rotation.z *= 0.97;

          if (_.rotation.z !== 0) {
            _.rotation.z = Math.abs(_.rotation.z) > 0.001 ? _.rotation.z : 0;
          }
        }
        return _;
      };

      return _;
    }
  };
})();