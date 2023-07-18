/**
 * Manage cooldowns.
 */
function ExpirationSystem() {
  System.call(this);
}

__extend(ExpirationSystem, System, {
  u: function update(elapsed) {
    // Kill expired entities
    var entities = __em.f(Lifetime);
    var i = entities.length;
    for (; i--;) {
      if ((entities[i].g(Lifetime).t -= elapsed) <= 0) {
        __em.k(entities[i]);
      }
    }

    // Update cooldowns
    entities = __em.f(Cooldown);
    i = entities.length;
    for (; i--;) {
      entities[i].g(Cooldown).u(elapsed);
    }
  }
});
