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