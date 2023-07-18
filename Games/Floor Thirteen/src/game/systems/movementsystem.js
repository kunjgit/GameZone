/**
 * Manage movement.
 */
function MovementSystem() {
  IteratingSystem.call(this, Position, Motion);
}

__extend(MovementSystem, IteratingSystem, {
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var motion = entity.g(Motion);
    var r, ra;

    // Update position
    position.x += motion.dx * elapsed;
    position.y += motion.dy * elapsed;

    if (motion.dx || motion.dy) {
      // Adjust direction
      r = 180 * Math.atan2(motion.dx, motion.dy) / Math.PI;
      ra = Math.abs(r);
      if (ra == 135) {
        r = 180;
      } else if (ra == 45) {
        r = 0;
      }

      // Update direction
      position.r = r;

      // Apply friction
      motion.dx = Math.abs(motion.dx *= motion.f) < 0.0001 ? 0 : motion.dx;
      motion.dy = Math.abs(motion.dy *= motion.f) < 0.0001 ? 0 : motion.dy;
    }
  }
});
