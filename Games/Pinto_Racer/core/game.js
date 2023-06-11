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
