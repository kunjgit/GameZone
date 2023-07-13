const spaceToNull = char => char === ' ' ? null : char

function resetMap () {
  const rooms = []
  for (let y = 0; y < roomData.length; y++) {
    for (let x = 0; x < roomData[y].length; x++) {
      if(!rooms[y]) rooms[y] = []
      rooms[y][x] = parseRoom(roomData, x, y)
    }
  }
  world.rooms = rooms
}


function parseRoom (data, x, y) {

  const input = data[y][x]
  const tiles = input.data.map(spaceToNull)
  const room = new Room(x, y)

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = []
    for (let x = 0; x < MAP_WIDTH; x++) {
      const ix = y * MAP_WIDTH + x
      let type = tiles[ix]
      const tile = createTile(x, y, type)
      row.push(tile)
    }
    room.data.push(row)
  }

  room.items = input.items ? input.items.map(props => {
    const { type } = props
    return createItem(type, props)
  }).filter(i => i) : []

  return room
}

function createItem (type, props) {
  try {
    const ClassName = eval(type)
    return new ClassName(props)
  } catch (e) {
    return console.warn(e)
  }
}

const tileData = {
  0: { solid: false, hole: true },
  1: { solid: false },
  9: { solid: false },
  11: { solid: false },
  13: { solid: false, hole: true },
  14: { solid: false },
  16: { solid: false, hole: true },
}

const tileClasses = {
  10: Lava
}

function createTile (x, y, type) {
  if (tileClasses[type]) return new tileClasses[type](x, y, type)
  return new Tile(x, y, type)
}
