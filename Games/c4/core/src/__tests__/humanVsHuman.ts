import { TestGame } from '../__testHelpers/test-game'
import { BoardPiece, BoardBase } from '../board'
import { TestPlayer } from '../__testHelpers/test-player'
import { clone } from '../utils'
import { describe, test, expect } from 'vitest'

describe('PlayerHuman vs PlayerHuman', () => {
  const players = [
    new TestPlayer(BoardPiece.PLAYER_1),
    new TestPlayer(BoardPiece.PLAYER_2),
  ]
  test('Basic test', async () => {
    const board = new BoardBase()
    const game = new TestGame(players, board)
    game.start()
    expect(board.map).toMatchSnapshot()
    await players[0].doAction(3)
    await game.afterMovePromise
    expect(board.map).toMatchSnapshot()
    await players[1].doAction(3)
    await game.afterMovePromise
    expect(board.map).toMatchSnapshot()
  })
  test('Cannot move on a filled column', async () => {
    const board = new BoardBase()
    const game = new TestGame(players, board)
    game.start()
    await players[0].doAction(3)
    await players[1].doAction(3)
    await players[0].doAction(3)
    await players[1].doAction(3)
    await players[0].doAction(3)
    await players[1].doAction(3)
    await game.afterMovePromise
    const currentMap = clone(board.map)
    expect(game.currentPlayerId).toEqual(0)
    expect(board.map).toMatchSnapshot()
    await players[0].doAction(3)
    expect(board.map).toEqual(currentMap)
    expect(game.currentPlayerId).toEqual(0)
    expect(board.map).toMatchSnapshot()
  })
})
