function boot () {
  tiles.src = 'assets/tiles.png'
  sprites.src = 'assets/sprites.png'
  font.src = 'assets/font.png'
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  reset()
  render()
  setInterval(tick, TICK_INTERVAL)
}

function tick() {
  input()
  pressedLastTick = {}
  if (state !== STATE_MENU && state !== STATE_WIN) {
    updateTiles()
    map.items.forEach(item => item.update(TICK_INTERVAL))
    checkMapChange()
    if (state === STATE_WIN) return
    checkItems()
    checkTiles()
  }
  render()
}

function reset () {
  resetMap()
  player.reset()
}

function start () {
  map = world.getCurrentRoom()
  state = STATE_MOVING
  map.onEnter()
}

function updateTiles () {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = map.data[y][x]
      if (!tile) continue
      tile.update(TICK_INTERVAL)
    }
  }
}

function restart() {
  state = STATE_MENU
  reset()
}

function win () {
  state = STATE_WIN
}

boot()
