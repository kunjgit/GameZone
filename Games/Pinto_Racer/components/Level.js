var Level = (function () {
  return {
    create: function (options, player) {
      var _ = {};
      Templatable(_, 'level');
      Collectable(_,'children');
      Positionable(_);
      Rotatable(_);
      Scalable(_);
      Renderable(_);

      body.on('reset-cone-combo', function (e) {
        _.numCombo = 0;
      });

      _.width = 604;
      _.height = 2000;
      _.offsetX = 0;
      _.offsetZ = 0;
      _.rotation.x = 0;
      _.pos.y = 0;
      _.gridSize = 160;
      _.cones = [];
      _.conesPassed = 0;
      _.guardOffset = -10;
      _.numConesHit = 0;
      _.numCombo = 0;
      _.coneColors = [];
      _.score = 0;
      _.timer = $('#timer');
      _.completedTime = $('#completed-time');
      _.startTime = 0;
      _.endTime = 0;
      _.offsetTime = 0;

      _.el.style.width = _.width + 'px';
      _.el.style.height = _.height + 'px';

      _.road = {
        el: _.el.getElementsByClassName('road')[0]
      };
      Positionable(_.road);

      _.setOptions = function (options) {
        for(var i in options) {
          _[i] = options[i];
        }
        _.changeBg(_.topColor, _.botColor);
        _.restart();
      };

      _.setScore = function (score) {
        _.score = score;
        $('.progress-fill').style.width = _.percentComplete() + '%';
      };

      _.pause = function () {
        _.pauseStartTime = time();
      };
      _.unpause = function () {
        _.offsetTime += time() - _.pauseStartTime;
      };
      _.changeBg = function (topColor, botColor) {
        $('.bg-gradient').style.background = linearGradient(topColor,botColor);
        $('.bg-gradient').classList.add('show');
        delay(function () {
          document.body.style.background = linearGradient(topColor,botColor);
          $('.bg-gradient').classList.remove('show');
        }, 2000, _);
      };
      _.restart = function () {
        _.setScore(0);
        _.numConesHit = 0;
        _.destroyCones();
        _.startTime = 0;
        _.endTime = 0;
        _.offsetTime = 0;
        _.numCombo = 0;
        _.isFinished = false;

        $('.combo-counter-animate').classList.remove('show');
        _.start();
      };
      _.start = function () {
        _.createCones();
        _.startTime = time();
        _.pauseStartTime = 0;
      };
      _.elapsedTime = function () {
        var ms = Math.floor((_.endTime - _.startTime - _.offsetTime) * 0.1);
        return (ms * 0.01).toFixed(2);
      };
      _.percentComplete = function () {
        return _.score / _.scoreToWin * 100;
      };
      _.isBestTime = function (lvlIndex, newTime) {
        var old = parseFloat(retreive('lvl'+lvlIndex+'time')) || Number.MAX_VALUE;
        return newTime < old;
      };
      _.createCones = function () {
        var cone;
        for (var i = 0; i < _.numCones; i++) {
          cone = Cone.create(_.getRandomConeColor(),player);
          cone.setHidden(true);
          cone.pos.x = rand(20, _.width - 20);
          cone.pos.y = i/_.numCones * _.height;

          _.add(cone,'children');
          _.cones.push(cone);
        }
        return _;
      };
      _.destroyCones = function () {
        _.cones.forEach( function (cone, index, cones) {
          cone.el.remove();
        });
        while(_.cones.length > 0) {
          _.cones.pop();
        }
      };

      _.getRandomConeColor = function () {
        var n = Math.floor(rand(0,_.coneColors.length)),
          color = _.coneColors[n];

        if (rand(0,1) < _.bonusConeRatio) {
          color = 'gold';
        }
        return color;
      };

      _.finished = function () {
        var userTime,
            i = game.levelIndex;

        _.isFinished = true;
        _.destroyCones();
        delay(function () {
          body.trigger(new CustomEvent('change-view', { detail: 'complete-view' }));
        },1000);
        _.endTime = time();
        userTime = _.elapsedTime();
        _.completedTime.innerText = userTime;

        save('lvl' + i + 'combo',_.userCombo);
        $('.level-combo')[i].innerText = _.userCombo;

        if (_.isBestTime(i, userTime)) {
          // best time
          $('.complete-view').classList.add('best-time');
          save('lvl' + i + 'time',userTime);
          $('.level-time')[i].innerText = userTime;
        } else {
          $('.complete-view').classList.remove('best-time');
        }

      };
      _.update = function () {
        if (!_.isFinished) _.endTime = time();
        _.timer.innerHTML = _.elapsedTime();

        var levelSpeed = _.speed + Math.floor(_.numCombo / 1) - Math.abs(player.vel.x),
            _level = _;
        _.road.pos.y -= levelSpeed;
        _.road.pos.y = _.road.pos.y < -_.gridSize ? _.road.pos.y%_.gridSize : _.road.pos.y;
        _.road.el.style.transform = 'translateY(' + -_.road.pos.y + 'px) translateZ(0px)';

        // shift level
        _.pos.x = -_.width * 0.5;
        _.pos.z = _.offsetZ;

        // cone loop
        _.cones.forEach(function (cone, index) {
          cone.pos.y += levelSpeed;

          // reset cone position
          if (cone.pos.y > _level.height) {
            cone
              .setHidden(false)
              .reset(false);

            cone.pos.y = 0;
            cone.pos.x = _level.patterns[0](_level.conesPassed);
            cone.rotation.z = 0;
            cone.setColor( _level.getRandomConeColor() );
            _level.conesPassed++;
          }
        });
        // end cone loop

        var maxPlayerX = _.width + _.guardOffset - player.width * 0.5;
        if ( player.pos.x < -_.guardOffset ) {
          player.pos.x = -_.guardOffset;
        } else if ( player.pos.x > maxPlayerX ) {
          player.pos.x = maxPlayerX;
        }

        return _;
      };

      _.setOptions(options);
      return _;
    }
  };
})();