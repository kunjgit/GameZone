import { GameBase } from '../game'
import { BoardBase } from '../board'
import { Player } from '../player'

export class TestGame extends GameBase {
  afterMoveResolve: null | ((action: number) => void) = null
  afterMovePromise: null | Promise<number> = null

  constructor(players: Array<Player>, board: BoardBase) {
    super(players, board)
    this.renewAfterMovePromise()
  }

  waitingForMove() {
    // no-op
  }
  beforeMoveApplied() {
    // no-op
  }
  afterMove(action: number) {
    if (this.afterMoveResolve) {
      this.afterMoveResolve(action)
    }
    this.renewAfterMovePromise()
  }

  renewAfterMovePromise() {
    this.afterMovePromise = new Promise(
      (resolve) => (this.afterMoveResolve = resolve)
    )
  }
}
