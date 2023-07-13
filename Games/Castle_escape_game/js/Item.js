class Item {
  constructor (props = {}) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.sprite = new Sprite(props.sx, 0)
    this.solid = false
  }

  // bump solid item
  interact () {}

  // used remotely
  activate () {}

  // go onto the same tile as item
  enter () {}

  // leave the same tile as item
  leave () {}

  // accumulate ticks
  update () {}

  render () {
    if (!this.sprite.visible) return
    renderSprite(
      this.sprite.image,
      this.sprite.sx,
      this.sprite.sy,
      this.x * TILE_SIZE,
      this.y * TILE_SIZE
    )
  }
}
