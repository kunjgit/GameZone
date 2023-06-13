import { BoardBase, BoardPiece } from '../board'

export abstract class Player {
  boardPiece: BoardPiece
  /** @return {number} column number (0-index) */
  abstract getAction(board: BoardBase): Promise<number>
  constructor(boardPiece: BoardPiece) {
    this.boardPiece = boardPiece
  }
}
