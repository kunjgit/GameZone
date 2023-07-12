class Spikes extends Item {

  constructor (props) {
    super(props)
    this.sprite.visible = false
    this.retracted = true
    this.counter = 0
  }

  enter () {
    if (this.retracted) return
    setTimeout(() => {
      player.goBack()
    }, 200)
  }

  update (tick) {
    this.counter += tick
    if (this.counter > 1000) {
      this.counter = 0
      this.toggle()
    }
  }

  toggle () {
    this.retracted = !this.retracted
    this.sprite.visible = !this.sprite.visible
  }
}

