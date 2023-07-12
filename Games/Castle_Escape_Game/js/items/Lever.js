class Lever extends Item {
  constructor (props) {
    super(props)
    this.resetAfter = props.resetAfter
    this.targets = props.targets.split(',').map(t => +t)
    this.solid = true
    this.isOn = false
    this.counter = 0
  }

  update (tick) {
    if (this.isOn && this.resetAfter) {
      this.counter += tick
      if (this.counter > this.resetAfter) {
        this.counter = 0
        this.interact()
      }
    }
  }

  interact () {
    this.targets.map(id => map.getItemById(id)).forEach(t => t && t.activate())
    return this.isOn ? this.turnOff() : this.turnOn()
  }

  turnOn () {
    this.isOn = true
    this.sprite.sx += TILE_SIZE
  }

  turnOff () {
    this.isOn = false
    this.sprite.sx -= TILE_SIZE
  }

  render () {
    renderSprite(
      this.sprite.image,
      this.sprite.sx,
      this.sprite.sy,
      this.x * TILE_SIZE,
      this.y * TILE_SIZE
    )
    if (this.resetAfter) this.renderDots()
  }

  renderDots () {
    const y = this.y * TILE_SIZE + TILE_SIZE - 2
    for (let i = 0; i < 3; i++) {
      let x = (this.x * TILE_SIZE) + (i * 2)
      ctx.fillStyle = '#0f2738'
      if (this.isOn) {
        const progress = 3 - ((this.counter / this.resetAfter) * 4)
        if (i <= progress) {
          ctx.fillStyle = '#0e82ce'
        }
      }
      ctx.fillRect(x, y, 1, 1)
    }
  }

}

