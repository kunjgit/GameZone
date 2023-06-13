import { BoardPiece, BoardBase } from '../board'
import { Player } from '../player'

export abstract class GameBase<P extends Player = Player> {
  board: BoardBase
  players: Array<P>
  currentPlayerId: number
  isMoveAllowed: boolean = false
  isGameWon: boolean = false
  isGameEnded: boolean = false

  constructor(players: Array<P>, board: BoardBase) {
    this.board = board
    this.players = players
    this.currentPlayerId = 0
    this.reset()
  }
  reset() {
    this.isMoveAllowed = false
    this.isGameWon = false
    this.board.reset()
    // this.board.debug()
  }
  end() {
    this.reset()
    this.isGameEnded = true
  }

  async start() {
    this.isMoveAllowed = true
    while (!this.isGameWon) {
      if (this.isGameEnded) {
        return
      }
      await this.move()
      const winner = this.board.getWinner()
      if (winner !== BoardPiece.EMPTY) {
        console.log('[GameBase] Game over: winner is player ', winner)
        this.isGameWon = true
        this.isMoveAllowed = false
        this.announceWinner(winner)
        break
      }
    }
  }
  async move() {
    if (this.isGameEnded) {
      return
    }
    if (!this.isMoveAllowed) {
      return
    }
    const currentPlayer = this.players[this.currentPlayerId]
    let actionSuccesful = false
    while (!actionSuccesful) {
      if (this.isGameEnded) {
        return
      }
      this.waitingForMove()
      const action = await currentPlayer.getAction(this.board)
      this.isMoveAllowed = false
      this.beforeMoveApplied(action)
      actionSuccesful = await this.board.applyPlayerAction(
        currentPlayer,
        action
      )
      this.isMoveAllowed = true
      if (!actionSuccesful) {
        console.log('Move not allowed! Try again.')
      } else {
        this.afterMove(action)
      }
    }
    this.currentPlayerId = this.getNextPlayer()
  }
  abstract waitingForMove(): void
  abstract beforeMoveApplied(action: number): void
  abstract afterMove(action: number): void

  announceWinner(winnerPiece: BoardPiece) {
    const winner = {
      [BoardPiece.DRAW]: 'draw',
      [BoardPiece.PLAYER_1]: 'Player 1',
      [BoardPiece.PLAYER_2]: 'Player 2',
      [BoardPiece.EMPTY]: 'none',
    }[winnerPiece]
    console.log('[GameBase] Game over: winner is ', winner, winnerPiece)
  }

  private getNextPlayer() {
    return this.currentPlayerId === 0 ? 1 : 0
  }
}
