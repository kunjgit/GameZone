class Door extends Item {
  constructor (props) {
    super(props)
    this.solid = true
    this.isOpen = false
  }

  interact () {
    if (this.isOpen) return false
    const key = player.getItemOfType(Key)
    if (!key) return showText('It\'s locked\nYou need a key')
    player.use(key)
    this.open()
  }

  open () {
    this.isOpen = true
    this.solid = false
    this.sprite.visible = false
  }
}

