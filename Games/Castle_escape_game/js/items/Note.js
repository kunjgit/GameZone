class Note extends Item {
  constructor (props) {
    super(props)
    this.sprite.visible = false
    this.text = props.text.split('\n\n')
    this.seen = false
  }
}
