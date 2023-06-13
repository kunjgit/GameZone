import { State, ActionTypes } from './types'
import { ACTION_TYPE } from './actions'
import { BoardPiece } from '@kenrick95/c4'
import { ServerGame } from './game/game'
import { ServerPlayer } from './game/player'
import { ServerBoard } from './game/board'

const INITIAL_STATE: State = {
  matches: {},
  players: {},
}

export function reducer(
  state: State = INITIAL_STATE,
  action: ActionTypes
): State {
  console.log('[reducer] Action: ', action.type)
  switch (action.type) {
    case ACTION_TYPE.NEW_PLAYER_CONNECTION: {
      // Add player to server, no game/match yet
      const { ws, playerId } = action.payload
      return {
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            playerId: playerId,
            lastSeen: Date.now(),
            ws: ws,
            matchId: null,
            gameWon: 0,
          },
        },
      }
    }
    case ACTION_TYPE.NEW_MATCH: {
      // Init board, but no game yet
      const { playerId, matchId } = action.payload
      const player = state.players[playerId]

      return {
        ...state,
        matches: {
          ...state.matches,
          [matchId]: {
            matchId: matchId,
            players: [playerId, null],
            board: new ServerBoard(),
            game: null,
          },
        },
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            matchId,
          },
        },
      }
    }
    case ACTION_TYPE.CONNECT_MATCH: {
      // Start game
      const { matchId, playerId } = action.payload
      const { players, board } = state.matches[matchId]
      const player = state.players[playerId]

      // Guaranteed players[0] to be non-null here, already checked before dispatching action
      const firstPlayer = players[0]!

      const game = new ServerGame(
        [
          new ServerPlayer(BoardPiece.PLAYER_1, firstPlayer),
          new ServerPlayer(BoardPiece.PLAYER_2, playerId),
        ],
        board,
        matchId
      )
      game.start()
      return {
        ...state,
        matches: {
          ...state.matches,
          [matchId]: {
            ...state.matches[matchId],
            players: [firstPlayer, playerId],
            game: game,
          },
        },
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            matchId,
          },
        },
      }
    }
    case ACTION_TYPE.HUNG_UP: {
      const { playerId } = action.payload
      const matchId = state.players[playerId].matchId

      console.log(`[HUNG_UP] player ${playerId}`)

      const newState = { ...state }

      const match = matchId ? newState.matches[matchId] : null
      if (match && matchId) {
        match.players = match.players.map((p) => {
          return p === playerId ? null : p
        })

        if (match.players.length === 0) {
          delete newState.matches[matchId]
        }
      }

      delete newState.players[playerId]
      return newState
    }
    case ACTION_TYPE.MOVE: {
      const { matchId, playerId, column } = action.payload
      const match = state.matches[matchId]
      const game = match.game

      if (process.env.NODE_ENV === 'development') {
        console.log('---- MOVE DEBUG ----')
        console.log('game', game?.isGameWon, game?.isMoveAllowed)
        game?.board.debug()
      }

      const player = game?.players.find((p) => p.playerId === playerId)
      player?.doAction(column)

      if (process.env.NODE_ENV === 'development') {
        console.log('player', player)
        game?.board.debug()
        console.log('---- MOVE DEBUG ----')
      }

      return {
        ...state,
        matches: {
          ...state.matches,
          [matchId]: {
            ...match,
            game,
          },
        },
      }
    }

    case ACTION_TYPE.RENEW_LAST_SEEN: {
      const { playerId, lastSeen } = action.payload
      return {
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            lastSeen,
          },
        },
      }
    }

    case ACTION_TYPE.END_GAME: {
      const { gameWinnerPlayerId } = action.payload

      if (!gameWinnerPlayerId) {
        return state
      }
      const newState = {
        ...state,
        players: {
          ...state.players,
          [gameWinnerPlayerId]: {
            ...state.players[gameWinnerPlayerId],
            gameWon: state.players[gameWinnerPlayerId].gameWon + 1,
          },
        },
      }

      return newState
    }
    case ACTION_TYPE.RESET_GAME: {
      const { matchId } = action.payload
      state.matches[matchId].game?.reset()
      state.matches[matchId].game?.start()
      return state
    }
  }
  return state
}
