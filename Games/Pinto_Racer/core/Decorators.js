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