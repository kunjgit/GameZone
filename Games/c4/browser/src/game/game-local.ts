import { Board } from '../board'
import { BoardBase, BoardPiece } from '@kenrick95/c4'
import { GameBase } from '@kenrick95/c4'
import { Player, PlayerHuman, PlayerAi } from '@kenrick95/c4'
import { getColumnFromCoord } from '@kenrick95/c4'
import { showMessage } from '../utils/message'
import { animationFrame } from '../utils/animate-frame'

const statusbox = document.querySelector('.statusbox')
const statusboxBodyGame = document.querySelector('.statusbox-body-game')
const statusboxBodyConnection = document.querySelector(
  '.statusbox-body-connection'
)
const statusboxBodyPlayer = document.querySelector('.statusbox-body-player')

export class GameLocal extends GameBase {
  constructor(players: Array<Player>, board: BoardBase) {
    super(players, board)
  }
  beforeMoveApplied() {
    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = `Dropping ${
        this.currentPlayerId === 0 ? '🔴' : '🔵'
      } disc`
    }
  }
  waitingForMove() {
    if (!this.isMoveAllowed || this.isGameWon) {
      return
    }

    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = 'Wating for move'
    }

    if (statusboxBodyPlayer) {
      // `currentPlayerId` is not updated yet
      statusboxBodyPlayer.textContent =
        this.currentPlayerId === 0 ? `Player 1 🔴` : `Player 2 🔵`
    }
  }
  afterMove() {
    // no-op
  }

  announceWinner(winnerBoardPiece: BoardPiece) {
    super.announceWinner(winnerBoardPiece)

    if (winnerBoardPiece === BoardPiece.EMPTY) {
      return
    }
    let message = '<h1>Thank you for playing.</h1>'
    if (winnerBoardPiece === BoardPiece.DRAW) {
      message += `It's a draw`
    } else {
      message += `Player ${winnerBoardPiece} wins`
    }
    message +=
      '.<br />After dismissing this message, click the board to reset game.'
    showMessage(message)

    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = 'Game over'
    }
    if (statusboxBodyPlayer) {
      statusboxBodyPlayer.textContent =
        winnerBoardPiece === BoardPiece.DRAW
          ? `It's a draw`
          : `Player ${
              winnerBoardPiece === BoardPiece.PLAYER_1 ? '1 🔴' : '2 🔵'
            } wins`
    }
  }
}
export function initGameLocal(
  GameLocalCosntructor: typeof GameLocal,
  secondPlayer: PlayerHuman | PlayerAi
) {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas DOM is null')
    return
  }
  const board = new Board(canvas)
  const firstPlayer = new PlayerHuman(BoardPiece.PLAYER_1)
  const game = new GameLocalCosntructor([firstPlayer, secondPlayer], board)
  statusbox?.classList.remove('hidden')
  statusboxBodyConnection?.classList.add('hidden')

  game.start()
  if (statusboxBodyGame) {
    statusboxBodyGame.textContent = 'Wating for move'
  }

  if (statusboxBodyPlayer) {
    statusboxBodyPlayer.textContent = `Player 1 🔴`
  }

  async function handleCanvasClick(event: MouseEvent) {
    if (game.isGameWon) {
      game.reset()
      await animationFrame()
      game.start()
    } else {
      if (!canvas) {
        return
      }
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const column = getColumnFromCoord({ x: x, y: y })
      if (game.currentPlayerId === 0) {
        firstPlayer.doAction(column)
      } else if (
        game.currentPlayerId === 1 &&
        secondPlayer instanceof PlayerHuman
      ) {
        secondPlayer.doAction(column)
      }
    }
  }

  canvas.addEventListener('click', handleCanvasClick)
  return {
    end: () => {
      game.end()
      canvas.removeEventListener('click', handleCanvasClick)
      statusbox?.classList.add('hidden')
    }
  }
}
