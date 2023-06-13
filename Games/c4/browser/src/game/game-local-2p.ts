import { BoardPiece } from '@kenrick95/c4'
import { PlayerHuman } from '@kenrick95/c4'
import { GameLocal, initGameLocal } from './game-local'

class GameLocal2p extends GameLocal {}
export function initGameLocal2p() {
  return initGameLocal(GameLocal2p, new PlayerHuman(BoardPiece.PLAYER_2))
}
