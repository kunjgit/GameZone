class Room {

  constructor(x, y) {
    this.x = x
    this.y = y
    this.data = []
    this.items = []
    this.entrance = { x: 7, y: 7 }
  }

  onEnter () {
    const note = this.getItemOfType(Note)
    if (note && !note.seen) {
      showText(note.text)
      note.seen = true
    }

    const platforms = this.getItemsOfType(MovingPlatform)
    platforms.forEach(platform => platform.reset())
  }

  getTileAt (x, y) {
    const row = this.data[y]
    return row && row[x]
  }

  getItemAt (x, y) {
    return this.items.find(i => i.x === x && i.y === y)
  }

  setEntrance (x, y) {
    this.entrance.x = x
    this.entrance.y = y
  }

  destroyItem (item) {
    this.items = this.items.filter(i => i !== item)
  }

  getItemOfType (type) {
    return this.getItemsOfType(type)[0]
  }

  getItemsOfType (type) {
    return this.items.filter(item => item instanceof type)
  }

  getItemById (id) {
    return this.items.find(item => item.id === id)
  }
}
