function input () {

  if (down(KEY_SPACE)) {
    if (state === STATE_WIN) return restart()
    if (state === STATE_MENU) return start()
    if (state === STATE_READING) return nextText()
  }

  if (player.locked) return

  if (state !== STATE_MOVING) return

  let x = player.x
  let y = player.y

  let moved = false

  if (down(KEY_W)) {
    y -= 1
    moved = true
  } else if (down(KEY_A)) {
    x -= 1
    moved = true
  } else if (down(KEY_S)) {
    y += 1
    moved = true
  } else if (down(KEY_D)) {
    x += 1
    moved = true
  }

  if (!moved) return

  const tile = map.getTileAt(x, y)
  if (tile && tile.isSolid()) return

  const item = map.getItemAt(x, y)
  if (item && item.solid) return item.interact()

  player.goTo(x, y)
}


function checkTiles () {

  const tile = map.getTileAt(player.x, player.y)
  const item = map.getItemAt(player.x, player.y)

  if (tile instanceof Lava) {
    // TODO handle more than lava
    if (!player.has(LavaBoots)) {
      setTimeout(() => {
        player.goBack()
      }, 200)
    }
    return
  }

  if (tile.hole && !(item && item.walkable) && !player.falling) {
    player.fall()
  }

}


function checkItems () {

  const newItem = map.getItemAt(player.x, player.y)

  if (newItem) newItem.enter()

  const oldItem = map.getItemAt(player.previous.x, player.previous.y)

  if (oldItem) oldItem.leave()
}

function checkMapChange () {

  let mapChanged = false

  let { x, y } = player

  if (y < 0) {
    player.wy -= 1
    y = MAP_HEIGHT - 1
    mapChanged = true
  } else if (y >= MAP_HEIGHT) {
    player.wy += 1
    y = 0
    mapChanged = true
  } else if (x >= MAP_WIDTH) {
    player.wx += 1
    x = 0
    mapChanged = true
  } else if (x < 0) {
    player.wx -= 1
    x = MAP_WIDTH - 1
    mapChanged = true
  }

  if (player.wy === -1) {
    return win()
  }

  if (mapChanged) {
    map = world.getCurrentRoom()
    map.setEntrance(x, y)
    map.onEnter()
    player.goTo(x, y)
  }

}
