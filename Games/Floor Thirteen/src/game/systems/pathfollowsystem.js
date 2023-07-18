/**
 * Manage enemies paths.
 */
function PathFollowSystem() {
  IteratingSystem.call(this, Position, Motion, State, Cooldown, Brain);
}

__extend(PathFollowSystem, IteratingSystem, {
  ue: function updateEntity(entity) {
    var position = entity.g(Position);
    var gridPosition = position.g();
    var motion = entity.g(Motion);
    var state = entity.g(State);
    var cooldown = entity.g(Cooldown);
    var path = entity.g(Brain).p;

    // Remove old way points
    while (path.length && gridPosition.x == path[0].x && gridPosition.y == path[0].y) {
      path.shift();
    }

    // Move to the next point
    if (path.length) {
      var speed = getRandomInt(30, 50);
      var pt = path[0];
      var a = Math.atan2((pt.y + 0.5) * 16 - position.y, (pt.x + 0.5) * 16 - position.x);
      motion.dx = Math.cos(a) * speed;
      motion.dy = Math.sin(a) * speed;
      state.s = STATE_WALK;
    } else {
      state.s = cooldown.g('atk') ? STATE_ATTACK : STATE_IDLE;
      motion.dx = motion.dy = 0;
    }
  }
});
