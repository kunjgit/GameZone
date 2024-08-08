// TODO: Check if there's a better way to generate unique IDs without relying on this
// variable, which makes it basically a singleton.
let lastTileID = 0
export function generateRandomTile() {
  lastTileID += 1

  return {
    id: lastTileID,
    type: Math.floor(Math.random() * 5) + 1,
  }
}

/**
 * Generates a game board as a flat array of rows * columns elements,
 * each tile is randomly generated.
 *
 * @param {int} rows
 * @param {int} columns
 * @returns {array}
 */
export function generateRandomBoard(rows, columns) {
  const size = rows * columns
  let board = []

  for (let i = 0; i < size; i += 1) {
    board[i] = generateRandomTile()
  }

  let matches = getMatches(board, rows, columns)

  while (matches.length > 0) {
    board = getResolvedBoard(board, rows, columns)
    matches = getMatches(board, rows, columns)
  }

  return board
}

/**
 * Returns x and y coordiates for tile at index.
 *
 * @param {int} index
 * @param {int} columns
 * @retunrs {object}
 */
export function getCoordinates(index, columns) {
  return {
    x: index % columns,
    y: Math.floor(index / columns),
  }
}

/**
 * Returns true if the tiles at indexes p and q are adjacent.
 *
 * @param {int} p
 * @param {int} q
 * @param {int} columns
 * @returns {boolean}
 */
export function areTilesAdjacent(p, q, columns) {
  const pCoords = getCoordinates(p, columns)
  const qCoords = getCoordinates(q, columns)

  return (
    (pCoords.x === qCoords.x && Math.abs(pCoords.y - qCoords.y) === 1) ||
    (pCoords.y === qCoords.y && Math.abs(pCoords.x - qCoords.x) === 1)
  )
}

const BASE_SCORE = 60

export function getBoardScore(board, rows, columns, chainMultiplier) {
  const matches = getMatches(board, rows, columns)
  let score = 0

  matches.forEach((match) => {
    const tileMultiplier = match.indices.length - 2
    return (score += BASE_SCORE * tileMultiplier * chainMultiplier)
  })

  return score
}

export function getClearedBoard(board, rows, columns) {
  const matches = getMatches(board, rows, columns)
  const clearedBoard = [...board]

  if (matches.length === 0) {
    return board
  }

  matches.forEach((match) => {
    match.indices.forEach((index) => {
      clearedBoard[index].type = null
    })
  })

  return clearedBoard
}

export function getResolvedBoard(board, rows, columns) {
  const clearedBoard = getClearedBoard(board, rows, columns)
  const resolvedBoard = [...board]
  let emptyTiles = []

  // Drop tiles to fill empty spaces
  for (let i = 0; i < columns; i += 1) {
    const colEmptyTiles = []
    for (let j = rows - 1; j > -1; j -= 1) {
      const index = j * columns + i
      if (resolvedBoard[index].type === null) {
        colEmptyTiles.push(index)
      } else if (colEmptyTiles.length > 0) {
        const firstEmptyTile = colEmptyTiles.shift()
        const aux = resolvedBoard[firstEmptyTile]
        resolvedBoard[firstEmptyTile] = resolvedBoard[index]
        resolvedBoard[index] = aux
        colEmptyTiles.push(index)
      }
    }

    emptyTiles = [...emptyTiles, ...colEmptyTiles]
  }

  emptyTiles.forEach((index) => {
    resolvedBoard[index] = generateRandomTile()
  })

  return resolvedBoard
}

export function getMatches(board, rows, columns, minMatch = 3) {
  const hMatches = getHorizontalMatches(board, rows, columns, minMatch)
  const vMatches = getVerticalMatches(board, rows, columns, minMatch)

  return [...hMatches, ...vMatches]
}

export function getHorizontalMatches(board, rows, columns, minMatch = 3) {
  const matches = []

  for (let i = 0; i < rows; i += 1) {
    let matchLength = 1
    for (let j = 0; j < columns; j += 1) {
      const index = i * columns + j
      let checkMatch = false

      if (j === columns - 1) {
        // Last tile in the row
        checkMatch = true
      } else {
        if (board[index].type === board[index + 1].type) {
          matchLength += 1
        } else {
          checkMatch = true
        }
      }

      if (checkMatch) {
        if (matchLength >= minMatch) {
          // add match to arraw of matches
          const start = index + 1 - matchLength
          const end = index
          matches.push({
            start,
            end,
            indices: getIndices(start, end),
            length: matchLength,
            orientation: 'horizontal',
          })
        }

        matchLength = 1
      }
    }
  }

  return matches
}

export function getVerticalMatches(board, rows, columns, minMatch = 3) {
  const matches = []

  for (let i = 0; i < columns; i += 1) {
    let matchLength = 1
    for (let j = 0; j < rows; j += 1) {
      const index = j * columns + i
      let checkMatch = false

      if (j === rows - 1) {
        // Last tile in the column
        checkMatch = true
      } else {
        if (board[index].type === board[index + columns].type) {
          matchLength += 1
        } else {
          checkMatch = true
        }
      }

      if (checkMatch) {
        if (matchLength >= minMatch) {
          // add match to arraw of matches
          const start = index - (matchLength - 1) * columns
          const end = index
          matches.push({
            start,
            end,
            indices: getIndices(start, end, columns),
            length: matchLength,
            orientation: 'vertical',
          })
        }

        matchLength = 1
      }
    }
  }

  return matches
}

export function getIndices(start, end, step = 1) {
  const indices = []
  let index = start

  while (index <= end) {
    indices.push(index)
    index += step
  }

  return indices
}
