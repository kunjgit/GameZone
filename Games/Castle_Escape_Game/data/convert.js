const fs = require('fs')
const path = require('path')

const TILE_SIZE = 8
const ROOM_SIZE = 15

const input = fs.readFileSync(path.resolve(__dirname, 'map.json'));
const data = JSON.parse(input)

/**
 * extract a single room from the larger map
 */
function getRoom (rx, ry, tiles) {

  let startX = rx * ROOM_SIZE
  let startY = ry * ROOM_SIZE

  const { width } = tiles

  const room = {
    data: [],
    items: []
  }

  for (let y = startY; y < startY + ROOM_SIZE; y++) {
    for (let x = startX; x < startX + ROOM_SIZE; x++) {
      const i = y * width + x
      const tile = tiles.data[i]
      room.data.push(tile)
    }
  }

  return room
}

/**
 * parse the map file
 */
function parseMap (map) {
  const rooms = []
  const tiles = map.layers.find(layer => layer.name === 'tiles')

  const objects = map.layers.filter(layer => layer.type === 'objectgroup').reduce((arr, layer) => {
    arr = arr.concat(layer.objects)
    return arr
  }, [])

  const { width, height } = tiles

  for (let y = 0; y < height / ROOM_SIZE; y++) {
    for (let x = 0; x < width / ROOM_SIZE; x++) {
      const room = getRoom(x, y, tiles)
      if (!rooms[y]) rooms[y] = []
      rooms[y][x] = room
    }
  }

  objects.forEach(object => {

    const x = object.x / TILE_SIZE
    const y = object.y / TILE_SIZE

    const localX = x % ROOM_SIZE
    const localY = (y - 1) % ROOM_SIZE

    const roomX = Math.floor(x / ROOM_SIZE)
    const roomY = Math.floor((y - 1) / ROOM_SIZE)

    object.x = localX
    object.y = localY

    const tileset = map.tilesets.find(set => set.name === 'sprites')

    rooms[roomY][roomX].items.push(parseObject(object, tileset))
  })

  return rooms
}

function parseObject (object, tileset) {
  const { type, id, x, y, properties = {}, gid } = object
  const ix = gid - tileset.firstgid
  return {
    id,
    type,
    x, y,
    sx: ix * TILE_SIZE, // TODO sy
    ...properties
  }
}

function writeOutput (data) {
  const output = `let roomData = ${JSON.stringify(data)}`
  fs.writeFileSync('./src/js/rooms.js', output)
}


const rooms = parseMap(data)

writeOutput(rooms)
