/**
 * Manage sprites direction.
 */
function SpriteDirectionSystem() {
  IteratingSystem.call(this, Position, State, Display);
}

__extend(SpriteDirectionSystem, IteratingSystem, {
  ue: function updateEntity(entity) {
    var position = entity.g(Position);
    var state = entity.g(State);
    var gfx = entity.g(Display).gfx;

    // Adjust direction
    gfx.sx = position.r < 0 ? -1 : 1;

    // Compute animation direction
    var direction;
    if (position.r == 180) {
      direction = 'n';
    } else if (!position.r) {
      direction = 's';
    } else {
      direction = 'h';
    }

    // Adjust animation
    gfx.p(state.s + direction);
  }
});
