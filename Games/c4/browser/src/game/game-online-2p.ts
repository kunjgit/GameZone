import { Board } from '../board'
import { BoardBase, BoardPiece } from '@kenrick95/c4'
import {
  GameBase,
  MESSAGE_TYPE,
  constructMessage,
  parseMessage,
  GameOnlineMessage,
} from '@kenrick95/c4'
import { Player, PlayerHuman, PlayerShadow } from '@kenrick95/c4'
import { getColumnFromCoord } from '@kenrick95/c4'
import { showMessage } from '../utils/message'

enum GAME_MODE {
  FIRST = BoardPiece.PLAYER_1,
  SECOND = BoardPiece.PLAYER_2,
}

const statusbox = document.querySelector('.statusbox')
const statusboxBodyGame = document.querySelector('.statusbox-body-game')
const statusboxBodyConnection = document.querySelector(
  '.statusbox-body-connection'
)
const statusboxBodyPlayer = document.querySelector('.statusbox-body-player')

const C4_SERVER_ENDPOINT =
  import.meta.env.MODE === 'production'
    ? import.meta.env.C4_SERVER_ENDPOINT
      ? import.meta.env.C4_SERVER_ENDPOINT
      : `wss://c4-server.fly.dev/`
    : `ws://${location.hostname}:8080`

export class GameOnline2p extends GameBase {
  connectionPlayerId: null | string = null
  connectionMatchId: null | string = null
  ws: null | WebSocket = null
  gameMode: GAME_MODE

  playerMain: PlayerHuman
  playerShadow: PlayerShadow

  constructor(
    players: Array<Player>,
    board: BoardBase,
    { gameMode }: { gameMode: GAME_MODE }
  ) {
    super(players, board)
    this.gameMode = gameMode
    if (gameMode === GAME_MODE.FIRST) {
      this.playerMain = players[0] as PlayerHuman
      this.playerShadow = players[1] as PlayerShadow
    } else {
      this.playerMain = players[1] as PlayerHuman
      this.playerShadow = players[0] as PlayerShadow
    }
    this.initConnection()
  }

  end() {
    super.end()
    this.endConnection()
  }

  endConnection() {
    if (this.ws) {
      this.ws.close()
    }
  }

  initConnection() {
    this.connectionPlayerId = null
    this.connectionMatchId = null
    if (this.ws) {
      this.ws.close()
    }

    const setStatusDisconnected = () => {
      this.isMoveAllowed = false
      if (statusboxBodyConnection) {
        statusboxBodyConnection.textContent = 'Disconnected from server'
      }
      if (statusboxBodyGame) {
        statusboxBodyGame.textContent = `Game over`
      }
      if (statusboxBodyPlayer) {
        statusboxBodyPlayer.textContent = `Disconnected from match`
      }
    }

    this.ws = new WebSocket(C4_SERVER_ENDPOINT)
    this.ws.addEventListener('message', (event) => {
      this.messageActionHandler(parseMessage(event.data))
    })
    this.ws.addEventListener('open', () => {
      if (this.ws) {
        this.ws.send(
          constructMessage(MESSAGE_TYPE.NEW_PLAYER_CONNECTION_REQUEST)
        )
      }
      if (statusboxBodyConnection) {
        statusboxBodyConnection.textContent = 'Connected to server'
      } 
      if (statusboxBodyGame) {
        statusboxBodyGame.textContent = ``
      }
      if (statusboxBodyPlayer) {
        statusboxBodyPlayer.textContent = ``
      }
    })
    this.ws.addEventListener('close', (event) => {
      console.log('[ws] close event', event)
      setStatusDisconnected()
    })
    this.ws.addEventListener('error', (event) => {
      console.log('[ws] error event', event)
      setStatusDisconnected()
    })
  }

  initMatch = () => {
    if (this.ws) {
      this.ws.send(
        constructMessage(MESSAGE_TYPE.NEW_MATCH_REQUEST, {
          playerId: this.connectionPlayerId,
        })
      )
    }
  }

  connectToMatch = (matchId: string) => {
    if (!this.ws) {
      return
    }
    this.ws.send(
      constructMessage(MESSAGE_TYPE.CONNECT_MATCH_REQUEST, {
        playerId: this.connectionPlayerId,
        matchId,
      })
    )
  }

  messageActionHandler = (message: GameOnlineMessage) => {
    switch (message.type) {
      case MESSAGE_TYPE.NEW_PLAYER_CONNECTION_OK:
        {
          this.connectionPlayerId = message.payload.playerId
          if (this.gameMode === GAME_MODE.FIRST) {
            this.initMatch()
          } else if (this.gameMode === GAME_MODE.SECOND) {
            // there is a matchid in URL
            const searchParams = new URLSearchParams(location.search)
            const connectionMatchId = searchParams.get('matchId')
            if (!connectionMatchId) {
              return
            }
            this.connectToMatch(connectionMatchId)
          }
        }
        break
      case MESSAGE_TYPE.NEW_MATCH_OK:
        {
          this.connectionMatchId = message.payload.matchId
          const shareUrl = `${location.href}?matchId=${this.connectionMatchId}`
          // TODO: button to copy share url again?
          console.log('[url] Share this', shareUrl)
          showMessage(
            `<h1>Share this URL</h1>` +
              `<p>` +
              `Please share this URL to your friend to start the game: ` +
              `<input type="text" id="copy-box" class="copy-box" readonly value="${shareUrl}" />` +
              `<button type="button" id="copy-button">Copy</button>` +
              `</p>`
          )
          // Select all
          const copyBox: HTMLInputElement | null = document.getElementById(
            'copy-box'
          ) as HTMLInputElement
          copyBox.focus()
          copyBox.select()

          // Click to copy
          document
            .getElementById('copy-button')
            ?.addEventListener('click', async () => {
              let isClipboardApiSuccessful = false

              if (navigator.clipboard) {
                try {
                  await navigator.clipboard.writeText(shareUrl)
                  console.log(
                    'Using Clipboard API to write share url into clipboard'
                  )
                  isClipboardApiSuccessful = true
                } catch (err) {}
              }

              if (!isClipboardApiSuccessful) {
                // Old method: use as fallback
                copyBox?.select()
                copyBox?.setSelectionRange(0, 99999)
                document.execCommand('copy')
                console.log(
                  'Using fallback method to write share url into clipboard'
                )
              }
            })
        }
        break
      case MESSAGE_TYPE.CONNECT_MATCH_OK:
        {
          this.connectionMatchId = message.payload.matchId
        }
        break
      case MESSAGE_TYPE.CONNECT_MATCH_FAIL:
        {
          showMessage(`<h1>Error</h1> Failed to connect to match.`)

          if (statusboxBodyConnection) {
            statusboxBodyConnection.textContent = 'Connection error'
          }
        }
        break
      case MESSAGE_TYPE.GAME_READY:
        {
          showMessage(
            `<h1>Game started</h1> The first piece should be dropped by ${
              this.isCurrentMoveByCurrentPlayer() ? 'you' : 'the other player'
            }`
          )

          if (statusboxBodyGame) {
            statusboxBodyGame.textContent = 'Wating for move'
          }

          if (statusboxBodyPlayer) {
            statusboxBodyPlayer.textContent =
              (this.currentPlayerId === 0 ? `Player 1 🔴` : `Player 2 🔵`) +
              ` ` +
              (this.isCurrentMoveByCurrentPlayer()
                ? `(you)`
                : `(the other player)`)
          }
          this.start()
        }
        break
      case MESSAGE_TYPE.MOVE_SHADOW:
        {
          this.playerShadow.doAction(message.payload.column)
        }
        break
      case MESSAGE_TYPE.GAME_ENDED:
        {
          const { winnerBoardPiece } = message.payload

          const messageWinner =
            winnerBoardPiece === BoardPiece.DRAW
              ? `It's a draw`
              : `Player ${
                  winnerBoardPiece === BoardPiece.PLAYER_1 ? '1 🔴' : '2 🔵'
                } wins`

          showMessage(
            `<h1>Thank you for playing</h1>` +
              messageWinner +
              `<br />Next game will be started in 10 seconds.`
          )

          if (statusboxBodyGame) {
            statusboxBodyGame.textContent = 'Game over'
          }
          if (statusboxBodyPlayer) {
            statusboxBodyPlayer.textContent = messageWinner
          }
        }
        break
      case MESSAGE_TYPE.GAME_RESET:
        {
          this.reset()
        }
        break

      case MESSAGE_TYPE.OTHER_PLAYER_HUNGUP:
        {
          showMessage(
            `<h1>Other player disconnected</h1> Please reload the page to start a new match`
          )
        }
        break
    }
  }

  /**
   * @returns true if the game is waiting for current player to make a move
   */
  isCurrentMoveByCurrentPlayer() {
    return this.currentPlayerId + 1 === this.gameMode
  }

  beforeMoveApplied = () => {
    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = `Dropping ${
        this.currentPlayerId === 0 ? '🔴' : '🔵'
      } disc`
    }
  }

  waitingForMove = () => {
    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = 'Wating for move'
    }

    if (statusboxBodyPlayer) {
      statusboxBodyPlayer.textContent =
        (this.currentPlayerId === 0 ? `Player 1 🔴` : `Player 2 🔵`) +
        ` ` +
        (this.isCurrentMoveByCurrentPlayer() ? `(you)` : `(the other player)`)
    }
  }

  afterMove = (action: number) => {
    if (this.ws && this.isCurrentMoveByCurrentPlayer()) {
      this.ws.send(
        constructMessage(MESSAGE_TYPE.MOVE_MAIN, {
          playerId: this.connectionPlayerId,
          matchId: this.connectionMatchId,
          column: action,
        })
      )
    }
  }

  announceWinner(winnerBoardPiece: BoardPiece) {
    super.announceWinner(winnerBoardPiece)
    // Do nothing here, will wait for server to announce
  }
}

export function initGameOnline2p() {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas DOM is null')
    return
  }

  const searchParams = new URLSearchParams(location.search)
  const connectionMatchId = searchParams.get('matchId')
  const gameMode = !!connectionMatchId ? GAME_MODE.SECOND : GAME_MODE.FIRST

  const board = new Board(canvas)
  const players =
    gameMode === GAME_MODE.FIRST
      ? [
          new PlayerHuman(BoardPiece.PLAYER_1),
          new PlayerShadow(BoardPiece.PLAYER_2),
        ]
      : [
          new PlayerShadow(BoardPiece.PLAYER_1),
          new PlayerHuman(BoardPiece.PLAYER_2),
        ]

  const game = new GameOnline2p(players, board, {
    gameMode,
  })
  statusbox?.classList.remove('hidden')
  statusboxBodyConnection?.classList.remove('hidden')

  async function handleCanvasClick(event: MouseEvent) {
    if (!game.isGameWon) {
      if (!canvas) {
        return
      }
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const column = getColumnFromCoord({ x: x, y: y })
      game.playerMain.doAction(column)
    }
  }

  canvas.addEventListener('click', handleCanvasClick)

  return {
    end: () => { 
      game.end()
      canvas.removeEventListener('click', handleCanvasClick)
      statusbox?.classList.add('hidden')
    },
  }
}
