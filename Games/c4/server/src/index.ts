import WebSocket, { WebSocketServer } from 'ws'

import { reducer } from './reducer'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import {
  newPlayerConnection,
  newMatch,
  connectMatch,
  hungUp,
  move,
  renewLastSeen,
} from './actions'
import { MatchId, State, ActionTypes } from './types'

import { MESSAGE_TYPE, parseMessage } from '@kenrick95/c4'

const port = parseInt(process.env.PORT || '') || 8080
const wss = new WebSocketServer({ port: port })
console.log(`[server] Started listening on ws://localhost:${port}`)

function configureStore() {
  const middleware = applyMiddleware(
    thunk as ThunkMiddleware<State, ActionTypes>
  )
  return createStore(reducer, middleware)
}
export const store = configureStore()

function alivenessLoop() {
  const state = store.getState()
  const now = Date.now()
  for (const player of Object.values(state.players)) {
    if (now - player.lastSeen >= 60000) {
      player.ws.terminate()
    }

    player.ws.ping()
  }
}

wss.on('connection', (ws: WebSocket) => {
  const playerId = store.dispatch(newPlayerConnection(ws))
  let matchId: null | MatchId = null

  ws.on('pong', () => {
    store.dispatch(renewLastSeen(playerId))
  })

  ws.on('message', (message: string) => {
    const parsedMessage = parseMessage(message)
    switch (parsedMessage.type) {
      case MESSAGE_TYPE.NEW_MATCH_REQUEST:
        {
          matchId = store.dispatch(newMatch(playerId))
        }
        break
      case MESSAGE_TYPE.CONNECT_MATCH_REQUEST:
        {
          matchId = store.dispatch(
            connectMatch(playerId, parsedMessage.payload.matchId)
          )
        }
        break
      case MESSAGE_TYPE.MOVE_MAIN:
        {
          store.dispatch(move(playerId, matchId, parsedMessage.payload.column))
        }
        break
      case MESSAGE_TYPE.HUNG_UP:
        {
          store.dispatch(hungUp(playerId))
        }
        break
    }
  })
  ws.on('close', () => {
    store.dispatch(hungUp(playerId))
  })
})
setInterval(alivenessLoop, 30000)

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    console.log('Closing server before reloading')
    wss.close()
  })
}
