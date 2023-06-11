/*! Super Pinto Rally Racer - v0.9 - 2014-09-17
* Copyright (c) 2014 ; Licensed  */
Element.prototype.on = Element.prototype.addEventListener;
Element.prototype.off = Element.prototype.removeEventListener;
Element.prototype.index = function (child) {
  for(var i=0; i<this.children.length; i++) {
    if (child==this.children[i]) return i;
  }
  return 0;
};
EventTarget.prototype.trigger = EventTarget.prototype.dispatchEvent;
window.$ = function (q) {
  var items = document.querySelectorAll(q);
  return items.length === 1 ? items[0] : items;
};
window.toInt = window.parseInt;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame;
window.Matrix = window.WebKitCSSMatrix || window.MSCSSMatrix || window.CSSMatrix;
window.PI = Math.PI;
window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
window.body = document.body;

window.save = function (key,val) {
  window.localStorage.setItem(key,val);
};
window.retreive = function(key) {
  return window.localStorage.getItem(key);
};
window.el = function (tag) {
  return document.createElement(tag);
};
window.linearGradient = function (topColor,botColor) {
  return 'linear-gradient(180deg, ' + topColor + ' 0%, ' + botColor + ' 100%)';
};
window.delay = function (callback, time, context) {
  context = !context ? this : context;
  return setTimeout((callback).bind(context),time);
};
window.time = function() {
  return new Date().getTime();
};
window.rand = function (min,max) {
  return Math.random() * (max - min) + min;
};

function Template (name) {
  return $('#' + name + '-template').content.cloneNode(true);
}

function Templatable (o,templateName) {
  o.el = el('div');
  o.el.classList.add(templateName);
  o.el.appendChild(Template([templateName]));
}

function Collectable (o,type) {
  if (!o.collections) o.collections = {};
  o.collections[type] = [];
  o.add = function (n,type) {
    try {
      o.collections[type].push(n);
      if (n.render) {
        o.el.appendChild(n.el);
      }
    } catch (e) {
      throw new Error('Cannot add \'undefined\' to collection ' + 'to ' + type);
    }
    return o;
  };
  o.remove = function (n,type) {
    log('remove');
    var item;
    for (var i in o.collections[type]) {
      log(o.collections[type][i], n);
      item = o.collections[type][i];
      if (item == n) {
        if (item.render) {
          item.el.parentNode.removeChild(item.el);
        }
        o.collections[type] = o.collections[type].splice(1,i);
      }
    }
  };
}

function Positionable (o) {
  o.pos = {
    x: 0,
    y: 0,
    z: 0
  };
}

function Physicsable (o,minVel,maxVel) {
  o.minVel = minVel || -250;
  o.maxVel = maxVel || 250;

  o.vel = {
    x: 0,
    y: 0,
    z: 0
  };
}

function Scalable (o) {
  o.scale = {
    x: 1,
    y: 1,
    z: 1
  };
}

function Rotatable (o) {
  o.rotation = {
    x: 0,
    y: 0,
    z: 0
  };
}

function Renderable (o) {
  o.update = function () {
    return o;
  };
  o.render = function () {
    var s = {
      x: o.scale.x,
      y: o.scale.y,
      z: o.scale.z
    },
    p = {
      x: o.pos.x,
      y: o.pos.y,
      z: o.pos.z,
    },
    r = {
      x: o.rotation.x,
      y: o.rotation.y,
      z: o.rotation.z,
    };

    o.el.style.transform = 'translate3d(' + p.x + 'px, ' + p.y + 'px, ' + p.z + 'px) ' +
                            'scale3d(' + s.x + ', ' + s.y + ', ' + s.z + ') ' +
                            'rotateX(' + r.x + 'deg) ' +
                            'rotateZ(' + r.z + 'deg) ' +
                            'rotateY(' + r.y + 'deg) ' +
                            '';
    return o;
  };
}
var Audio = (function () {
  var C4 = 261.626,
      E4 = 329.628,
      A3 = 220,
      A4 = 440,
      D4 = 293.665,
      F4 = 349.228,
      G3 = 195.998,
      G4 = 391.995,
      B3 = 246.942,
      SONG  = [C4,C4,E4,E4,A3,A3,C4,C4,D4,D4,F4,F4,G3,G3,B3,B3];

  function play (noteIndex, type, volume) {
    var oscNode = audioCtx.createOscillator(),
        gainNode = audioCtx.createGain();

    oscNode.type = type;
    oscNode.frequency.value = SONG[noteIndex % SONG.length];
    oscNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = volume;
    oscNode.start(0);

    setTimeout(function () {
      oscNode.stop(0);
    },600);
  }

  return {
    playNote: function (noteIndex, useAccent) {
      var type = useAccent ? 'triangle' : 'sine',
          volume = useAccent ? 0.7 : 0.5;

      play(noteIndex, type, volume);
    }
  };
})();
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
var Cone = (function () {

  return {
    create: function (color, player) {
      var _ = {},
          rotatedPos = { x: 0, y: 0 },
          tunnelPos = { x: 0, y: 0 };

      Templatable(_, 'cone');
      Positionable(_);
      Rotatable(_);
      Scalable(_);
      Renderable(_);
      Physicsable(_);

      _.width = 20;
      _.height = 20;
      _.padding = 3;

      _.setHidden = function (n) {
        if (n) {
          _.el.classList.add('hide');
        } else {
          _.el.classList.remove('hide');
        }
        _isHidden = n;
        return _;
      };
      _.isHidden = function () {
        return _isHidden;
      };

      _.setColor = function (color) {
        _.color = color;
        _.el.classList.remove('cone-blue');
        _.el.classList.remove('cone-red');
        _.el.classList.remove('cone-gold');
        _.el.classList.remove('cone-green');
        _.el.classList.add('cone-' + color);
        return _;
      };

      _.reset = function () {
        _.isHit = false;
        _.el.classList.remove('cone-fall');
        return _;
      };

      _.worldToPlayer = function () {
        var angle = player.rotation.z * (Math.PI/180),
            localX = player.pos.x - _.pos.x,
            localY = player.pos.y - _.pos.y;

        rotatedPos.x = -Math.cos(angle) * (localX) - Math.sin(angle) * (localY);
        rotatedPos.y = Math.sin(angle) * (localX) + Math.cos(angle) * (localY);
      };

      _.checkCollision = function (pos) {
        var isHitX = pos.x > -_.width - _.padding && pos.x < player.width + _.padding,
            isHitY = pos.y < _.height && pos.y > -player.height,
            isHit = isHitX && isHitY && !_isHidden;

        return isHit;
      };

      _.update = function () {

        _.worldToPlayer();

        // tunneling prevention
        // tunnelPos.x = (rotatedPos.x + _.prevX) * 0.5;
        // tunnelPos.y = (rotatedPos.y + _.prevY) * 0.5;
        // var isHit = _.checkCollision(rotatedPos) ? true : _.checkCollision(tunnelPos);

        var isHit = _.checkCollision(rotatedPos);

        if (isHit && !_.isHit) {
          if (!_.el.classList.contains('cone-fall')) {
            _.rotation.z = rand(0,40);
            body.trigger(new CustomEvent('hit-cone',{detail: {cone:_}}));
          }
          _.el.classList.add('cone-fall');
          _.isHit = true;
        }

        if (_.pos.y > player.pos.y + player.height  && !_.isHit) {
          body.trigger(new CustomEvent('reset-cone-combo'));

          if ($('.combo-counter-animate').classList.contains('show')) {
            delay(function() {
              $('.combo-counter-animate').classList.remove('show');
            },200);
          }
        }

        _.prevX = rotatedPos.x;
        _.prevY = rotatedPos.y;
        return _;
      };


      var _isHidden = false;
      _.el.classList.add('cone');
      _.pos.z = 1;

      _.coneAnimate = _.el.querySelector('.cone-animate');
      _.coneAnimate.classList.add('fall'+(Math.ceil(rand(0,3))));

      _.setColor(color || 'blue');
      return _;
    }
  };
})();
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
var LevelMenuItem = (function () {
  return {
    create: function (data) {
      var btn       = el('button'),
          userTime  = retreive('lvl' + data.id + 'time') || '0.00',
          userCombo = retreive('lvl' + data.id + 'combo') || '0',
          content;

      content = new Template('level-menu-item');
      content.querySelector('.level-title').innerText = data.name;
      content.querySelector('.level-time').innerText = userTime;
      content.querySelector('.level-combo').innerText = userCombo;
      data.userCombo = userCombo;
      btn.appendChild(content);
      btn.style.backgroundImage = linearGradient(data.topColor,data.botColor);

      return btn;
    }
  };
})();
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
var PlayerController = (function () {
  var instance;

  function init (player) {
    var _isRight = false,
        _isLeft = false;

    function onKeyDown (e) {
      if (!7280%e.keyCode) e.preventDefault();
      var handler = {
        37: onLeftDown,
        39: onRightDown,
        65: onLeftDown,
        68: onRightDown,
        80: game.togglePlay.bind(game)
      };
      if (handler[e.keyCode]) handler[e.keyCode]();
    }

    function onKeyUp (e) {
      e.preventDefault();
      var handler = {
        37: onLeftUp,
        39: onRightUp,
        65: onLeftUp,
        68: onRightUp
      };
      if (handler[e.keyCode]) handler[e.keyCode]();
    }

    function onLeftDown ()  { _isLeft = true; }
    function onRightDown () { _isRight = true; }
    function onLeftUp ()    { _isLeft = false; }
    function onRightUp()    { _isRight = false; }

    body.on('keydown', onKeyDown);
    body.on('keyup', onKeyUp);

    return {
      isLeft: _isLeft,
      isRight: _isRight,
      update: function () {
        var angle = 0,
            wheelAngle;

        if (_isLeft) {
          angle = -player.handling;

          // leaning
          if (player.rotation.y > -player.maxLeanAngle * (player.speed/player.maxSpeed)) {
            player.rotation.y -= 1;
          }

        } else if (_isRight) {
          angle = player.handling;

          // leaning
          if (player.rotation.y < player.maxLeanAngle * (player.speed/player.maxSpeed)) {
            player.rotation.y += 1;
          }
        } else {
          player.rotation.z *= player.smoothness;

          // leaning return
          if (player.rotation.y !== 0) {
            player.rotation.y *= 0.9;
            player.rotation.y = Math.abs(player.rotation.y) < 0.1 ? 0 : player.rotation.y;
          }
        }

        player.rotation.prevZ = player.rotation.z;
        player.rotation.z += angle;
      }
    };
  }

  return {
    getInstance: function (player) {
      if ( !instance ) {
        instance = init(player);
      }
      return instance;
    }
  };
})();
var Shadow = (function () {
  return {
    create: function (shadowType,target, options) {
      var _ = {};
      _.target = target;
      _.options = options;

      Positionable(_);
      Rotatable(_);
      Scalable(_);
      Renderable(_);

      _.update = function () {
        _.pos.x = _.target.pos.x - _.options.padding;
        _.pos.y = _.target.pos.y - _.options.padding;
        _.rotation.x = _.target.rotation.x;
        _.rotation.z = _.target.rotation.z;
        return _;
      };

      _.el = el('div');
      _.el.classList.add('shadow');
      _.el.classList.add(shadowType);
      _.el.style.width = toInt(_.target.el.style.width) + _.options.padding * 2 + 'px';
      _.el.style.height = toInt(_.target.el.style.height) + _.options.padding * 2 + 'px';
      _.pos.z = 2;
      return _;
    }
  };
})();
var game = (function(){
  var _container = $('.game-container'),
      _canvas = $('#game-canvas'),
      _camera = Camera.create('#game-camera'),
      _cameraPerspective = 500,
      _hasInit = false,
      _isPaused = true,
      _requestId,
      _player,
      _playerShadow,
      _level,
      _playerController,
      _cameraResizeTimeout,

      _levels = [{
        id: 0,
        name: 'Twin Peaks',
        numCones: 4,
        coneColors: ['blue'],
        bonusConeRatio: 0.2,
        scoreToWin: 50,
        speed: 18,
        topColor: '#1D2B64',
        botColor: '#F8CDDA',
        patterns: [
          // ampMulti, conesPerWave, len, dir
          makeWavePattern(0.5, 70, 10, 1)
        ]
      },{
        id: 1,
        name: 'Stinson',
        numCones: 8,
        coneColors: ['blue'],
        bonusConeRatio: 0.1,
        scoreToWin: 70,
        speed: 24,
        topColor: '#4CB8C4',
        botColor: '#3CD3AD',
        patterns: [
          makeWavePattern(0.15, 40, 70, 1)
        ]
      },{
        id: 2,
        name: 'Big Basin',
        numCones: 6,
        coneColors: ['green'],
        bonusConeRatio: 0.3,
        scoreToWin: 100,
        speed: 24,
        topColor: '#16222A',
        botColor: '#3A6073',
        patterns: [
          makeWavePattern(0.3, 120, 10, 1)
        ]
      },{
        id: 3,
        name: 'Alcatraz',
        numCones: 2,
        coneColors: ['red'],
        bonusConeRatio: 0.6,
        scoreToWin: 120,
        speed: 14,
        topColor: '#1F1C2C',
        botColor: '#928DAB',
        patterns: [
          function (n) {
            var os = 200 + n * 2,
                p = rand(os, _level.width-os);

            return p;
          }
        ]
      },{
        id: 4,
        name: 'Ocean Beach',
        numCones: 14,
        coneColors: ['green'],
        bonusConeRatio: 0,
        scoreToWin: 10,
        speed: 24,
        topColor: '#085078',
        botColor: '#85D8CE',
        patterns: [
          makeWavePattern(0.5, 70, 10, 1)
        ]
      },{
        id: 5,
        name: 'Muir Woods',
        numCones: 8,
        coneColors: ['green'],
        bonusConeRatio: 0.5,
        scoreToWin: 40,
        speed: 22,
        topColor: '#134E5E',
        botColor: '#71B280',
        patterns: [
          makeWavePattern(0.6, 70, 5, 1)
        ]
      },{
        id: 6,
        name: 'San Quentin',
        numCones: 12,
        coneColors: ['red'],
        bonusConeRatio: 0.4,
        scoreToWin: 180,
        speed: 24,
        topColor: '#C04848',
        botColor: '#480048',
        patterns: [
          function (n) {
            n = rand(0, n * 10);
            n %= _level.width - 300;
            n += 150;
            return n;
          }
        ]
      },{
        id: 7,
        name: 'The Abyss',
        numCones: 40,
        coneColors: ['red'],
        bonusConeRatio: 0.666,
        scoreToWin: 666,
        speed: 46,
        topColor: '#000',
        botColor: '#000',
        patterns: [
          function (n) {
            return rand(50, _level.width-50);
          }
        ]
      }];

  function init () {
    _hasInit = true;
    _player = Player.create();
    _playerShadow = Shadow.create(
      'car-shadow',
      _player,
      { padding: 3 });

    _level = Level.create(_levels[0], _player);
    _playerController = PlayerController.getInstance(_player);
    _level.destroyCones();

    $('.title-view').classList.add('animated','bounceInDown');

    _level.add(_player,'children');
    _level.add(_playerShadow,'children');
    _camera.el.appendChild(_level.el);

    updateScene();

    body.on('change-view', function (e) {
      setView(e.detail);
    });

    body.on('hit-cone', function (e) {
      var cone = e.detail.cone,
        points = 1;

      _level.numConesHit++;
      _level.numCombo++;

      if (_level.numCombo > 3) {
        $('.combo-counter').innerText = _level.numCombo;
        $('.combo-counter-animate').classList.add('show');

        if (_level.userCombo < _level.numCombo) {
          _level.userCombo = _level.numCombo;
        }
      }

      if (cone && cone.color === 'gold') {
        points = 4;
        Audio.playNote(_level.numConesHit, true);
      }

      Audio.playNote(_level.numConesHit);

      points = _level.score + points;
      _level.setScore(points);

      if (_level.percentComplete() >= 100) {
        _level.finished();
      }

    });

    // init level buttons
    var lvlData,
        lvlBtn,
        lvlRating,
        lvlTime,
        star,
        btnContent;

    for (var i=0; i < _levels.length; i++) {
      lvlBtn = LevelMenuItem.create(_levels[i]);
      $('.levels').appendChild(lvlBtn);
    }
    $('.levels').on('click', function (e) {
      if (e.target !== e.currentTarget) {
        var lvlIndex = e.currentTarget.index(e.target);
        _level.restart();
        game.setLevel(lvlIndex);
        game.setView('hud-view');
        game.start();
      }
    });
    // end init level buttons

    window.onresize = onSceneResize;

    window.player = _player;
    window.playerShadow = _playerShadow;
    window.level = _level;
    window.camera = _camera;
  }

  function onSceneResize () {
    clearTimeout( _cameraResizeTimeout );
    _cameraResizeTimeout = setTimeout(function () { updateScene(); }, 300);
  }

  function updateScene () {
    _camera.render();

    _player.pos.y = _level.height - 200;
    _level.offsetZ = -_container.clientHeight * 0.36;
    _level.pos.y =  - _player.pos.y - _player.height * 0.5;
    _level.render();
  }


  function onStep () {
    _playerController.update();

    _player
      .update()
      .render();

    _playerShadow
      .update()
      .render();

    _level
      .update()
      .render();

    _camera
      .update()
      .render();

    for (var i = _level.cones.length - 1; i >= 0; --i) {
      if (_level.cones[i]) {
        _level.cones[i]
          .update()
          .render();
      }
    }

    if (_cameraPerspective >= 1200) {
      _cameraPerspective = 1200;
    } else {
      _cameraPerspective += 6;
    }
    _canvas.style.perspective = _cameraPerspective + 'px';
  }


  function step (timestamp) {
    _requestId = requestAnimationFrame(step);
    onStep();
  }

  function setView (view, isRestart) {
    var views = ['title-view', 'instructions-view', 'level-select-view', 'pause-view', 'hud-view','complete-view'],
        isPause = view === 'pause-view',
        isHud = view === 'hud-view';

    // hide all views
    views.forEach(function (v, index) {
      if (view !== v && !(v==='hud-view' && isPause)) {
        $('.' + v).classList.add('exitOutDown');
        $('.' + v).classList.remove('bounceInDown');
      }
    });
    delay(function(){
      views.forEach(function (v, index) {
        if (view !== v && !(v==='hud-view' && isPause)) {
          $('.' + v).classList.remove('exitOutDown','animated');
        }
      });
    },800);

    // show this view
    $('.' + view).classList.add('animated', 'bounceInDown');

    if (view==='pause-view') {
      _camera.set360View(true);
      clearInterval(this.pauseInterval);
      _level.pause();
      this.pauseInterval = setInterval(function () {
        _camera
          .update()
          .render();
      },10);
      game.pause();
    }

    if (view==='hud-view') {
      _camera.set360View(false);

      if (this.prevView==='pause-view') {
        delay(function(){
          if (!isRestart) _level.unpause();
          game.start();
        },1000);
      }
    }

    if (view==='complete-view') {
      if (game.levelIndex >= _levels.length - 1) {
        $('.btn-next-level').classList.add('hide');
      } else {
        $('.btn-next-level').classList.remove('hide');
      }
    }

    this.prevView = view;
  }

  return {
    togglePlay: function () {
      return _isPaused? this.start() : this.pause();
    },
    start: function () {
      if (!_hasInit) {
        init();
      }
      if (_isPaused) {
        step();
      }
      _isPaused = false;
      _camera.el.classList.remove('game-paused');
      return this;
    },
    pause: function () {
      cancelAnimationFrame(_requestId);
      _stopTime = time();
      _camera.el.classList.add('game-paused');
      _isPaused = true;
      return this;
    },
    setLevel: function (num) {
      game.levelIndex = num;
      _camera.set360View(false);
      _level.setOptions(_levels[num]);
      return this;
    },
    nextLevel: function () {
      var lvlIndex = game.levelIndex + 1;
      game
        .setLevel(lvlIndex)
        .start();
      setView('hud-view');
      _level.restart();

      return this;
    },
    restartLevel: function () {
      setView('hud-view', true);
      _level.restart();
    },
    exit: function () {
      setView('title-view');
      _level.destroyCones();
      game.start();
    },
    setView: function (view) {
      setView(view);
    }
  };


  /*
   *  UTILS
   */

  function makeWavePattern (ampMulti, conesPerWave, len, dir) {
    return function (n) {
      // ampMulti => width of wave
      // len => stretch out wave

      var amp = dir*(n%conesPerWave);
      return ampMulti * _level.width * 0.5 * Math.sin(amp/len * PI*2) + _level.width *0.5;
    }
  }
})();
