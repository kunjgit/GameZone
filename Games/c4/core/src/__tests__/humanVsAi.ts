import { TestGame } from '../__testHelpers/test-game'
import { BoardPiece, BoardBase } from '../board'
import { TestPlayer } from '../__testHelpers/test-player'
import { describe, test, expect } from 'vitest'
import { PlayerAi } from '../player'

describe('PlayerHuman vs PlayerAi', () => {
  const testPlayer = new TestPlayer(BoardPiece.PLAYER_1)
  const aiPlayer = new PlayerAi(BoardPiece.PLAYER_2)
  const players = [testPlayer, aiPlayer]
  test('Issue #3', async () => {
    const board = new BoardBase()
    const game = new TestGame(players, board)

    /*
    Next move is Player 2 (AI)
  
    Current board:

    0 0 0 0 0 0 0
    0 0 0 1 0 0 0
    0 0 0 1 0 1 0
    0 0 0 2 1 2 1
    0 0 0 1 2 2 2
    0 0 0 1 2 2 1

    Should choose column 2 to block immediate Player 1 from winning
    */
    board.map = [
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
      ],
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_1,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
      ],
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_1,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_1,
        BoardPiece.EMPTY,
      ],
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_1,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_1,
      ],
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_1,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_2,
      ],
      [
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.EMPTY,
        BoardPiece.PLAYER_1,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_2,
        BoardPiece.PLAYER_1,
      ],
    ]

    expect(board.map).toMatchSnapshot()
    game.currentPlayerId = 1
    game.start()
    const chosenAction = await game.afterMovePromise
    expect(chosenAction).toBe(2)
    expect(board.map).toMatchSnapshot()
  })
})
