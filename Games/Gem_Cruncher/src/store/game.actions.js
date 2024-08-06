import {
  generateRandomBoard,
  getMatches,
  getResolvedBoard,
  getClearedBoard,
  getBoardScore,
} from './game.utils'

export const init = (rows, columns, moves) => (state) => {
  return {
    rows,
    columns,
    board: generateRandomBoard(rows, columns),
    startingMoves: moves,
    moves,
    score: 0,
  }
}

export const reset = () => (state) => {
  return {
    ...state,
    board: generateRandomBoard(state.rows, state.columns),
    moves: state.startingMoves,
    score: 0,
  }
}

export const swapTiles = (p, q) => (state) => {
  const { board } = state
  const aux = board[p]
  board[p] = board[q]
  board[q] = aux

  return {
    ...state,
    board,
  }
}

export const decrementMoves = () => (state) => {
  return {
    ...state,
    moves: state.moves - 1,
  }
}

export const clearBoard = () => (state) => {
  const { board, rows, columns } = state
  const clearedBoard = getClearedBoard(board, rows, columns)

  return {
    ...state,
    board: clearedBoard,
  }
}

export const resolveBoard = () => (state) => {
  const { board, rows, columns } = state
  const resolvedBoard = getResolvedBoard(board, rows, columns)

  return {
    ...state,
    board: resolvedBoard,
  }
}

export const scoreBoard = (chainMultiplier) => (state) => {
  const { board, rows, columns, score } = state
  const newScore = getBoardScore(board, rows, columns, chainMultiplier) + score

  return {
    ...state,
    score: newScore,
  }
}

export const checkMatchesAndResolve = (resolveCb, onMatch, onFinish, n) => (
  state
) => {
  const { board, rows, columns } = state
  const matches = getMatches(board, rows, columns)
  if (matches.length > 0) {
    resolveCb(onMatch, onFinish, n + 1)
  } else {
    onFinish()
  }

  return state
}
