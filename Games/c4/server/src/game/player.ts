import { BoardPiece } from '@kenrick95/c4'
import { PlayerShadow } from '@kenrick95/c4'
import { PlayerId } from '../types'

export class ServerPlayer extends PlayerShadow {
  playerId: PlayerId
  constructor(boardPiece: BoardPiece, playerId: PlayerId) {
    super(boardPiece)
    this.playerId = playerId
  }
}
