/**
 * Handle world collisions
 */
function CollisionSystem() {
  System.call(this);
}

__extend(CollisionSystem, System, {
  u: function update(elapsed) {
    // Get player
    var player = __tm.g(TAG_PLAYER);
    if (!player) {
      return;
    }

    var fixPosition, i;
    var position = player.g(Position);
    var bounds = player.g(Bounds);
    var motion = player.g(Motion);

    if (!bounds) {
      return;
    }

    // Get world
    var world = __tm.g(TAG_WORLD);
    var map = world.g(Dungeon);

    // Translate bounds
    var entities = __em.f(Position, Bounds);
    for (i = entities.length; i--;) {
      entities[i].g(Bounds).t(entities[i].g(Position));
    }

    // World collisions
    var tileX = bounds.x / 16 | 0;
    var tileY = (bounds.y + 8) / 16 | 0;
    var tile2X = (bounds.x + bounds.w - 1) / 16 | 0;
    var tile2Y = (bounds.y + bounds.h - 1) / 16 | 0;
    if (isWall(map, tileX, tileY) || isWall(map, tile2X, tileY) || isWall(map, tileX, tile2Y) || isWall(map, tile2X, tile2Y)) {
      fixPosition = 1;
    }

    // Doors collisions
    var doors = __gm.g(GROUP_DOORS);
    for (i = doors.length; i-- && !fixPosition;) {
      doors[i].g(Bounds).o(bounds) && (fixPosition = 1);
    }

    // Fix position and clear velocity
    if (fixPosition) {
      bounds.x = (position.x -= motion.dx * elapsed);
      bounds.y = (position.y -= motion.dy * elapsed);
      motion.dx = motion.dy = 0;
    }
  }
});
