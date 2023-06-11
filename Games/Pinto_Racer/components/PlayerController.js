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