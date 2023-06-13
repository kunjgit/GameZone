import { BoardPiece } from '../../board'

export enum MESSAGE_TYPE {
  NEW_PLAYER_CONNECTION_REQUEST = 'NEW_PLAYER_CONNECTION_REQUEST',
  NEW_PLAYER_CONNECTION_OK = 'NEW_PLAYER_CONNECTION_OK',

  NEW_MATCH_REQUEST = 'NEW_MATCH_REQUEST',
  NEW_MATCH_OK = 'NEW_MATCH_OK',

  GAME_READY = 'GAME_READY',
  GAME_ENDED = 'GAME_ENDED',
  GAME_RESET = 'GAME_RESET',

  CONNECT_MATCH_REQUEST = 'CONNECT_MATCH_REQUEST',
  CONNECT_MATCH_OK = 'CONNECT_MATCH_OK',
  CONNECT_MATCH_FAIL = 'CONNECT_MATCH_FAIL',

  HUNG_UP = 'HUNG_UP',
  OTHER_PLAYER_HUNGUP = 'OTHER_PLAYER_HUNGUP',

  MOVE_MAIN = 'MOVE_MAIN',
  MOVE_SHADOW = 'MOVE_SHADOW',
}

export type PlayerId = string

export type MatchId = string

export type GameOnlineMessage =
  | { type: 'NEW_PLAYER_CONNECTION_REQUEST'; payload: {} }
  | {
      type: 'NEW_PLAYER_CONNECTION_OK'
      payload: { playerId: PlayerId }
    }
  | { type: 'NEW_MATCH_REQUEST'; payload: { playerId: PlayerId } }
  | { type: 'NEW_MATCH_OK'; payload: { matchId: MatchId } }
  | { type: 'GAME_READY'; payload: { matchId: MatchId } }
  | {
      type: 'GAME_ENDED'
      payload: {
        winnerBoardPiece: BoardPiece
        matchId: MatchId
        gameWinnerPlayerId: PlayerId
      }
    }
  | { type: 'GAME_RESET'; payload: { matchId: MatchId } }
  | {
      type: 'CONNECT_MATCH_REQUEST'
      payload: { playerId: PlayerId; matchId: MatchId }
    }
  | {
      type: 'CONNECT_MATCH_OK'
      payload: { matchId: MatchId; playerId: PlayerId }
    }
  | {
      type: 'CONNECT_MATCH_FAIL'
      payload: { matchId: MatchId; playerId: PlayerId }
    }
  | { type: 'HUNG_UP'; payload: {} }
  | { type: 'OTHER_PLAYER_HUNGUP'; payload: {} }
  | { type: 'MOVE_MAIN'; payload: { column: number } }
  | { type: 'MOVE_SHADOW'; payload: { column: number } }

export function constructMessage(
  type: MESSAGE_TYPE,
  payload?: GameOnlineMessage['payload']
): string {
  console.log('[ws] send: ', type, payload)
  return JSON.stringify({
    type,
    payload: payload || {},
  })
}
export function parseMessage(message: string): GameOnlineMessage {
  const parsedMessage = JSON.parse(message)
  console.log('[ws] receive: ', parsedMessage)
  return parsedMessage
}
