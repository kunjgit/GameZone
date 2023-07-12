class PopupPlatform extends Item {

  constructor (props) {
    super(props)
    this.isUp = false
    this.walkable = false
  }

  activate () {
    this.isUp ? this.down() : this.up()
  }

  down () {
    this.isUp = false
    this.sprite.sx -= 8
    this.walkable = false
  }

  up () {
    this.isUp = true
    this.sprite.sx += 8
    this.walkable = true
  }

}

