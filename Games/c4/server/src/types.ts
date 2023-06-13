import WebSocket from 'ws'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { ServerGame } from './game/game'
import { ServerBoard } from './game/board'

export type PlayerId = string
export type MatchId = string
export type MatchState = {
  matchId: MatchId
  players: Array<PlayerId | null>
  board: ServerBoard
  game: null | ServerGame
}
export type PlayerState = {
  playerId: PlayerId
  /**
   * JS timestamp
   */
  lastSeen: number
  ws: WebSocket

  matchId: null | MatchId

  gameWon: number
}
export type State = {
  matches: {
    [matchId: string]: MatchState
  }
  players: {
    [playerId: string]: PlayerState
  }
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  Action<string>
>

export type ActionTypes =
  | NewPlayerConnectionAction
  | NewMatchAction
  | HungUpAction
  | MoveAction
  | ConnectMatchAction
  | RenewLastSeenAction
  | EndGameAction
  | ResetGameAction

export type NewPlayerConnectionAction = {
  type: 'NEW_PLAYER_CONNECTION'
  payload: {
    playerId: PlayerId
    ws: WebSocket
  }
}
export type NewMatchAction = {
  type: 'NEW_MATCH'
  payload: {
    playerId: PlayerId
    matchId: MatchId
  }
}
export type HungUpAction = {
  type: 'HUNG_UP'
  payload: {
    playerId: PlayerId
  }
}
export type MoveAction = {
  type: 'MOVE'
  payload: {
    playerId: PlayerId
    matchId: MatchId
    column: number
  }
}
export type ConnectMatchAction = {
  type: 'CONNECT_MATCH'
  payload: {
    playerId: PlayerId
    matchId: MatchId
  }
}
export type RenewLastSeenAction = {
  type: 'RENEW_LAST_SEEN'
  payload: {
    playerId: PlayerId
    lastSeen: number
  }
}

export type EndGameAction = {
  type: 'END_GAME'
  payload: {
    matchId: MatchId

    /**
     * Either a PlayerId (player 1 or player 2 wins) or null (draw)
     */
    gameWinnerPlayerId: PlayerId | null
  }
}

export type ResetGameAction = {
  type: 'RESET_GAME'
  payload: {
    matchId: MatchId
  }
}
