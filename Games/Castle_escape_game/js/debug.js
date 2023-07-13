// removeIf(production)

const DEBUG = window.location.search.substr(1) === 'debug'

const debugTextNode = document.createElement('div')
document.body.appendChild(debugTextNode)
debugTextNode.style.position = 'absolute'
debugTextNode.style.top = 0
debugTextNode.style.left = 0
debugTextNode.style.color = '#FFFFFF'

function debugRender () {
  if (!DEBUG) return
  debugTileCollision()
  debugItems()
  debugText(`x: ${player.x}
y: ${player.y}`)
}

function debugText (text) {
  debugTextNode.innerText = text
}

function debugItems () {
  ctx.fillStyle = 'rgba(0, 255, 0, 0.4)'
  for(const item of map.items) {
    ctx.fillRect(item.x * TILE_SIZE, item.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  }
}

function debugTileCollision () {
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = map.data[y][x]
      if (!tile) continue
      if (!tile.solid) continue
      ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }
}

// endRemoveIf(production)
