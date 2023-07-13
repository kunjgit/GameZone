class Gate extends Item {
  constructor (props) {
    super(props)
    this.solid = true
    this.isOpen = false
  }

  interact () {
    if (this.isOpen) return false
    return showText('It\'s closed\nLook for a lever')
  }

  activate () {
    return this.isOpen ? this.close() : this.open()
  }

  open () {
    this.isOpen = true
    this.solid = false
    this.sprite.visible = false
  }

  close () {
    this.isOpen = false
    this.solid = true
    this.sprite.visible = true
  }

}

