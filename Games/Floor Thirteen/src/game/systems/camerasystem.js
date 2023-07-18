/**
 * Manage camera position.
 *
 * @param {DisplayObjectContainer} layer
 */
function CameraSystem(layer) {
  System.call(this);
  this.l = layer;
}

__extend(CameraSystem, System, {
  u: function update() {
    var player = __tm.g(TAG_PLAYER);
    if (!player) {
      return;
    }

    var position = player.g(Position);
    var camera = this.l;

    camera.x = -clamp(position.x - __PW_GAME_WIDTH / 2 | 0, 0, __PW_WORLD_WIDTH * 16 - __PW_GAME_WIDTH);
    camera.y = -clamp(position.y - __PW_GAME_HEIGHT / 2 | 0, 0, __PW_WORLD_HEIGHT * 16 - __PW_GAME_HEIGHT);
  }
});
