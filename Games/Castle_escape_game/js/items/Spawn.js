class Spawn extends Item {
  constructor (props) {
    super(props)
    this.sprite.visible = false
    this.items = []
    if (props.items) {
      this.items = props.items.split(',').map(type => createItem(type))
    }
  }
}
