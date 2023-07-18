/**
 * Manage doors.
 */
function DoorSystem() {
  System.call(this, Position, Door);
}

__extend(DoorSystem, System, {
  a: function onEntityAdded(entity) {
    var position = entity.g(Position);
    AStar.w(position.x / 16 | 0, position.y / 16 | 0, true);
  },
  r: function onEntityRemoved(entity) {
    var position = entity.g(Position);
    AStar.w(position.x / 16 | 0, position.y / 16 | 0, false);
  }
});
