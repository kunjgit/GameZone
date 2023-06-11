var Player = (function () {
  return {
    create: function () {
      var _ = {};
      Templatable(_, 'player');
      Positionable(_);
      Rotatable(_);
      Scalable(_);
      Renderable(_);
      Physicsable(_);

      _.wheels = {
        fl: {
          el: _.el.getElementsByClassName('wheel-f-l')[0]
        },
        fr: {
          el: _.el.getElementsByClassName('wheel-f-r')[0]
        },
        rl: {
          el: _.el.getElementsByClassName('wheel-r-l')[0]
        },
        rr: {
          el: _.el.getElementsByClassName('wheel-r-r')[0]
        }
      };

      _.bodyL = _.el.querySelector('.body-left');
      _.bodyLT = _.el.querySelector('.body-left-top');
      _.bodyR = _.el.querySelector('.body-right');
      _.bodyRT = _.el.querySelector('.body-right-top');

      _.wheels.fl.el.appendChild(new Template('wheel'));
      _.wheels.fr.el.appendChild(new Template('wheel'));
      _.wheels.rl.el.appendChild(new Template('wheel'));
      _.wheels.rr.el.appendChild(new Template('wheel'));

      _.width = 33;
      _.height = 100;
      _.pos.x = 200;
      _.pos.y = 5700;
      _.pos.z = 2;


      _.speed = 24;
      _.maxSpeed = 55;
      _.handling = 1;
      _.smoothness = 1;
      _.maxLeanAngle = 20;
      _.leanStartTime = 0;
      _.maxTurnAngle = 30;

      _.el.style.width = _.width + 'px';
      _.el.style.height = _.height + 'px';

      _.update = function () {
        //--- TURN
        var rz =  _.rotation.z;
        rz = rz >  _.maxTurnAngle ?  _.maxTurnAngle : rz;
        rz = rz < -_.maxTurnAngle ? -_.maxTurnAngle : rz;
        _.rotation.z = rz;

        // derive vel from turning angle
        _.vel.x = -_.speed * _.rotation.z / 90;
        // increment pos
        _.pos.x -= _.vel.x;
        return _;
      };
      return _;
    }
  };
})();