/**
 * Render game entities.
 *
 * @param {DisplayObjectContainer} layer
 */
function RenderingSystem(layer) {
  IteratingSystem.call(this, Position, Display);
  this.l = layer;
}

__extend(RenderingSystem, IteratingSystem, {
  a: function onEntityAdded(entity) {
    // Add entity to the display list
    this.l.a(entity.g(Display).gfx);
  },
  r: function onEntityRemoved(entity) {
    // Remove entity from the display list
    this.l.r(entity.g(Display).gfx);
  },
  u: function update(elapsed) {
    // Sort elements
    this.l._c.sort(function(objA, objB) {
      return objA.y - objB.y;
    });

    // Update entity graphics
    IteratingSystem.prototype.u.call(this, elapsed);
  },
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var display = entity.g(Display);
    var gfx = display.gfx;

    // Update asset position
    gfx.x = position.x | 0;
    gfx.y = position.y | 0;

    // Update animation
    if (gfx instanceof AnimatedSprite) {
      gfx.pt(elapsed * 1000 | 0);
    }

    // Fade
    if (display.f) {
      var lifetime = entity.g(Lifetime);
      gfx.o = lifetime.t / lifetime.m;
    }
  }
});
