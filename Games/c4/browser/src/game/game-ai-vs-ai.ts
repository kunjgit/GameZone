import { BoardBase, BoardPiece } from '@kenrick95/c4'
import { PlayerAi } from '@kenrick95/c4'
import { GameLocal } from './game-local'
import { Board } from '../board'
import { animationFrame } from '../utils/animate-frame'

const statusbox = document.querySelector('.statusbox')
const statusboxBodyGame = document.querySelector('.statusbox-body-game')
const statusboxBodyConnection = document.querySelector(
  '.statusbox-body-connection'
)
const statusboxBodyPlayer = document.querySelector('.statusbox-body-player')

class GameAiVsAi extends GameLocal {
  constructor(players: Array<PlayerAi>, board: BoardBase) {
    super(players, board)
  }
  announceWinner(winnerBoardPiece: BoardPiece): void {
    super.announceWinner(winnerBoardPiece)
  }
}
export function initGameAiVsAi() {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas DOM is null')
    return
  }
  const board = new Board(canvas)
  const firstPlayer = new PlayerAi(BoardPiece.PLAYER_1)
  const secondPlayer = new PlayerAi(BoardPiece.PLAYER_2)
  const game = new GameAiVsAi([firstPlayer, secondPlayer], board)

  statusbox?.classList.remove('hidden')
  statusboxBodyConnection?.classList.add('hidden')
  game.start()

  async function handleCanvasClick(event: MouseEvent) {
    if (game.isGameWon) {
      game.reset()
      await animationFrame()
      game.start()
    }
  }

  canvas.addEventListener('click', handleCanvasClick)
  return {
    end: () => {
      game.end()
      canvas.removeEventListener('click', handleCanvasClick)
    },
  }
}
