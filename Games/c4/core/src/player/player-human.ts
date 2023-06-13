import { Player } from './player'
import { BoardBase, BoardPiece } from '../board'

export class PlayerHuman extends Player {
  clickPromiseResolver: null | ((column: number) => void)

  constructor(boardPiece: BoardPiece) {
    super(boardPiece)
    this.clickPromiseResolver = null
  }

  doAction(column: number) {
    if (
      this.clickPromiseResolver &&
      0 <= column &&
      column < BoardBase.COLUMNS
    ) {
      this.clickPromiseResolver(column)
    }
  }

  getAction(board: BoardBase): Promise<number> {
    return new Promise<number>((r) => (this.clickPromiseResolver = r))
  }
}
