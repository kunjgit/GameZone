function render () {
  clear()
  if (state === STATE_MENU) return renderMenu()
  if (state === STATE_WIN) return renderWin()
  ctx.translate(0, 8)
  renderMap()
  map.items.forEach(item => item.render())
  player.render()
// removeIf(production)
  debugRender()
// endRemoveIf(production)
  ctx.translate(0, -8)
  renderUI()
}

function clear () {
  ctx.fillStyle = BLACK
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
}

function renderUI () {
  ctx.fillStyle = '#26243a'
  ctx.fillRect(0, 7, GAME_WIDTH, 1)
  renderInventory()
  if (currentText) {
    renderText(currentText)
  }
}

function renderInventory () {
  player.inventory.forEach((item, i) => {
    const x = (MAP_WIDTH - (i + 1)) * TILE_SIZE
    renderSprite(sprites, item.sprite.sx, item.sprite.sy, x, 0)
  })
}


function renderMap () {
  if (!map) return
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = map.data[y][x]
      if (!tile) continue
      tile.render()
    }
  }
}

function renderSprite (image, sx, sy, x, y) {
  ctx.drawImage(
    image,
    sx,
    sy,
    TILE_SIZE,
    TILE_SIZE,
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  )
}

function renderMenu () {
  renderText('Developed by Bindu')
}

function renderWin () {
  renderText('YOU ESCAPED')
}

