import { BoardPiece } from '@kenrick95/c4'
import { PlayerAi } from '@kenrick95/c4'
import { GameLocal, initGameLocal } from './game-local'

class GameLocalAi extends GameLocal {}
export function initGameLocalAi() {
  return initGameLocal(GameLocalAi, new PlayerAi(BoardPiece.PLAYER_2))
}
