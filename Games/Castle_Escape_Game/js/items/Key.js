class Key extends Item {

  constructor (props = { sx: TILE_SIZE }) {
    super(props)
    this.description = 'A Key'
  }

  enter () {
    map.destroyItem(this)
    player.add(this)
  }
}

