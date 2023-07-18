/**
 * Manage damages.
 */
function DamageSystem() {
  System.call(this, Health);

  __evt.a(EVENT_HIT, function(entity, bullet) {
    if (this.h(entity)) {
      var player = __tm.g(TAG_PLAYER);
      if (!player) {
        return;
      }

      var position = bullet.g(Position);
      var health = entity.g(Health);
      var weapon = bullet.g(Weapon);
      var damage = weapon.d;
      var i;

      // Generate gibs
      for (i = damage * 2 + getRandomInt(4, 9); i--;) {
        EntityCreator.gib(position, getRandomElement(health.c), 1.0);
      }

      // Kill the entity
      if ((health.h -= damage) <= 0) {
        // Generate more gibs!
        for (i = getRandomInt(20, 30); i--;) {
          EntityCreator.gib(position, getRandomElement(health.c), 1.5);
        }

        // Paint blood splash
        health.b && __tm.g(TAG_WORLD).g(Display).gfx.b(position);

        // Die!
        __em.k(entity);

        // Check if the player died
        entity == player && gameOver();
      }
    }
  }, this);
}

__extend(DamageSystem, System);
