class Tile {

  constructor (x, y, type) {
    this.x = x
    this.y = y
    this.type = type

    const ix = type - 1
    const width = 16
    const sy = Math.floor(ix / width)
    const sx = ix % width

    this.solid = true

    const data = tileData[type] || {}

    Object.entries(data).forEach(([key, val]) => {
      this[key] = val
    })

    this.sprite = new Sprite(sx * TILE_SIZE, sy * TILE_SIZE, tiles)
  }

  render () {
    renderSprite(
      this.sprite.image,
      this.sprite.sx,
      this.sprite.sy,
      this.x * TILE_SIZE,
      this.y * TILE_SIZE
    )
  }

  update () {}

  isSolid () {
    return this.solid
  }
}

class Lava extends Tile {
  constructor (x, y, tile) {
    super(x, y, tile)
    this.solid = true
    this.counter = 0
    this.alt = true
  }

  update (tick) {
    this.counter += tick
    if (this.counter > 1200) {
      this.counter = 0
      this.toggle()
    }
  }

  toggle () {
    if (this.alt) {
      this.alt = false
      this.sprite.sy += 8
      return
    }
    this.alt = true
    this.sprite.sy -= 8
  }

  isSolid () {
    return !player.has(LavaBoots)
  }
}
