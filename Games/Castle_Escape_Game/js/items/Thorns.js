class Thorns extends Item {

  constructor (props) {
    super(props)
    this.solid = true
    this.cut = false
  }

  interact () {
    if (this.cut) return
    if (player.has(Shears)) return this.cutDown()
  }

  cutDown () {
    this.cut = true
    this.solid = false
    this.sprite.sx = 128
  }
}

