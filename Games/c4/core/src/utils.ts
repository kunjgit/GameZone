import { BoardPiece, BoardBase } from './board/base'

export const BIG_POSITIVE_NUMBER: number = 10 ** 9 + 7
export const BIG_NEGATIVE_NUMBER: number = -BIG_POSITIVE_NUMBER

/**
 *
 * @param {{ x: number; y: number }} coord The Coordinates of the point to be checked.
 * @param {number} columnXBegin The X-Coordinate of N-th column.
 * @param {number} radius The radius of a piece.
 */
export function isCoordOnColumn(
  coord: { x: number; y: number },
  columnXBegin: number,
  radius: number
): boolean {
  return (coord.x - columnXBegin) * (coord.x - columnXBegin) <= radius * radius
}

export function getColumnFromCoord(coord: { x: number; y: number }): number {
  for (let i: number = 0; i < BoardBase.COLUMNS; i++)
    if (
      isCoordOnColumn(
        coord,
        3 * BoardBase.PIECE_RADIUS * i +
          BoardBase.MASK_X_BEGIN +
          2 * BoardBase.PIECE_RADIUS,
        BoardBase.PIECE_RADIUS
      )
    )
      return i

  return -1
}

export function getRandomColumnNumber(): number {
  return Math.floor(Math.random() * BoardBase.COLUMNS)
}

export function choose<T>(choice: Array<T>): T {
  return choice[Math.floor(Math.random() * choice.length)]
}

export function clone<T>(array: Array<Array<T>>): Array<Array<T>> {
  const arr: Array<Array<T>> = []

  for (let i: number = 0; i < array.length; i++) arr[i] = array[i].slice()

  return arr
}

export function getMockPlayerAction(
  map: Array<Array<number>>,
  boardPiece: BoardPiece,
  column: number
): {
  success: boolean
  map: Array<Array<number>>
} {
  const clonedMap: Array<Array<number>> = clone(map)

  if (
    clonedMap[0][column] !== BoardPiece.EMPTY ||
    column < 0 ||
    column >= BoardBase.COLUMNS
  )
    return {
      success: false,
      map: clonedMap,
    }

  let isColumnEverFilled: boolean = false
  let row: number = 0
  for (let i: number = 0; i < BoardBase.ROWS - 1; i++)
    if (clonedMap[i + 1][column] !== BoardPiece.EMPTY) {
      isColumnEverFilled = true
      row = i

      break
    }

  if (!isColumnEverFilled) row = BoardBase.ROWS - 1

  clonedMap[row][column] = boardPiece

  return {
    success: true,
    map: clonedMap,
  }
}
