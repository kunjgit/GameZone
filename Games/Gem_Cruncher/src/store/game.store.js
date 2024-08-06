import { writable } from 'svelte/store'
import {
  init,
  reset,
  swapTiles,
  decrementMoves,
  resolveBoard,
  clearBoard,
  scoreBoard,
  checkMatchesAndResolve,
} from './game.actions'

function createStore() {
  const { subscribe, update } = writable({})

  return {
    subscribe,
    update,
    init: (rows, columns, moves) => update(init(rows, columns, moves)),
    reset: () => update(reset()),
    swapTiles: (p, q) => update(swapTiles(p, q)),
    decrementMoves: () => update(decrementMoves()),
    resolveBoard: function doResolve(onMatch, onFinish, n = 1) {
      update(clearBoard())
      setTimeout(() => {
        update(scoreBoard(n))
        update(resolveBoard())
        onMatch()
        setTimeout(() => {
          update(checkMatchesAndResolve(doResolve, onMatch, onFinish, n))
        }, 350)
      }, 200)
    },
  }
}

export default createStore()
