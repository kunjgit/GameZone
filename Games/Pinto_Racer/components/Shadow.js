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