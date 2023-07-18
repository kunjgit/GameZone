/**
 * Manage AI.
 */
function AISystem() {
  IteratingSystem.call(this, Position, Brain, Weapon, Cooldown);

  __evt.a(EVENT_HIT, function(entity) {
    if (this.h(entity)) {
      var player = __tm.g(TAG_PLAYER);
      if (!player) {
        return;
      }

      if (this.h(entity)) {
        var brain = entity.g(Brain);
        if (!brain.a) {
          // Active the entity brain
          brain.a = true;

          // Add reaction cooldown
          entity.g(Cooldown).s('react', 0.8);
        }
      }
    }
  }, this);
}

__extend(AISystem, IteratingSystem, {
  r: function onEntityRemoved(entity) {
    if (getRandomInt(0, 99) < __PW_DROP_RATE_WEAPON) {
      // Drop the current weapon
      EntityCreator.weapon(entity.g(Position), entity.g(Weapon));
    } else if (getRandomInt(0, 99) < __PW_DROP_RATE_MEDIC) {
      // Drop the current weapon
      EntityCreator.medic(entity.g(Position));
    }
  },
  ue: function update(entity) {
    var player = __tm.g(TAG_PLAYER);
    if (!player) {
      return;
    }

    var playerPosition = player.g(Position);
    var brain = entity.g(Brain);
    var cooldown = entity.g(Cooldown);
    var position = entity.g(Position);
    var weapon = entity.g(Weapon);

    var gridPosition = position.g();
    var playerGridPosition = playerPosition.g();
    var seePlayer = AStar.r(gridPosition, playerGridPosition);
    var delay, a, ra;

    // Check if the enemy brain is active
    if (brain.a) {
      if (seePlayer && !cooldown.g('atk') && (gridPosition.x == playerGridPosition.x || gridPosition.y == playerGridPosition.y)) {
          // Stop chasing the player
          brain.p = [];

          // Face him
          r = 180 * Math.atan2(playerPosition.x - position.x, playerPosition.y - position.y) / Math.PI;
          ra = Math.abs(r);
          position.r = ra > 135 ? 180 : (ra < 45 ? 0 : (r < 0 ? -90 : 90));

          // Shoot if the weapon has enough bullets
          if (weapon.c()) {
            // Fire!
            weapon.s();
            EntityCreator.bullet(position, weapon);
            cooldown.s('atk', weapon.fr);
          } else {
            // Reload
            weapon.r();
            cooldown.s('atk', weapon.rt);
          }
      } else {
        if (!cooldown.g('react')) {
          // Chase the player
          brain.p = AStar.s(gridPosition, playerGridPosition);

          // Delay next decision
          cooldown.s('react', 1.0);
        }
      }
    } else {
      if (seePlayer) {
        // Active the entity brain
        brain.a = true;

        // Add reaction cooldown
        cooldown.s('react', 0.8);
      }
    }
  }
});
