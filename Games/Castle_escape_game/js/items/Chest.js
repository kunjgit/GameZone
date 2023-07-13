class Chest extends Item {
  constructor (props) {
    super(props)
    this.contains = createItem(props.contains)
    this.solid = true
    this.open = false
  }

  interact () {
    if (this.open) return
    this.open = true
    this.sprite.sx = 96
    player.add(this.contains)
    showText(`You found ${this.contains.description}`)
  }
}

