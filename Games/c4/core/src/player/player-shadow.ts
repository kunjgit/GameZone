import { Player } from './player'
import { BoardBase, BoardPiece } from '../board'

export class PlayerShadow extends Player {
  actionPromiseResolver: null | ((column: number) => void)

  constructor(boardPiece: BoardPiece) {
    super(boardPiece)
    this.actionPromiseResolver = null
  }

  doAction(column: number) {
    if (
      this.actionPromiseResolver &&
      0 <= column &&
      column < BoardBase.COLUMNS
    ) {
      this.actionPromiseResolver(column)
    }
  }

  getAction(board: BoardBase): Promise<number> {
    return new Promise<number>((r) => (this.actionPromiseResolver = r))
  }
}
