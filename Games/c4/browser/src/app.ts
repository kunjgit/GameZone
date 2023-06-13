import * as Game from './game'
import { Board } from './board'
import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('.section-canvas') as HTMLCanvasElement

  if (!canvas) {
    console.error('Canvas element not found')
    return
  }
  const modeDOM = document.querySelector('.mode-chooser') as HTMLDialogElement
  if (!modeDOM) {
    console.error('Mode element not found ')
    return
  }
  const board = new Board(canvas)
  board.render()

  const searchParams = new URLSearchParams(location.search)
  const connectionMatchId = searchParams.get('matchId')
  const backToModeSelector = document.querySelector(
    '.statusbox-button-back'
  ) as HTMLDivElement
  let currentGameHandler:
    | {
        end: () => void
      }
    | undefined
    | null = null

  if (!!connectionMatchId) {
    currentGameHandler = Game.initGameOnline2p()
    return
  }
  backToModeSelector?.classList.add('hidden')
  modeDOM.showModal()

  const modeChooser = document.querySelector(
    '.mode-chooser-form'
  ) as HTMLFormElement

  if (!modeChooser) {
    console.error('.mode-chooser-form not found ')
    return
  }

  backToModeSelector?.addEventListener('click', () => {
    if (currentGameHandler && currentGameHandler.end) {
      currentGameHandler.end()
    }
    backToModeSelector?.classList.add('hidden')
    modeDOM.showModal()
  })

  modeDOM.addEventListener('cancel', (ev) => {
    ev.preventDefault()
  })

  modeDOM.addEventListener('close', (ev) => {
    const formData = new FormData(modeChooser)
    initGame(formData.get('mode') as string)
  })

  function initGame(chosenMode: string | null) {
    console.log('initGame chosenMode:', chosenMode)
    backToModeSelector?.classList.remove('hidden')
    if (chosenMode === 'offline-human') {
      currentGameHandler = Game.initGameLocal2p()
    } else if (chosenMode === 'offline-ai') {
      currentGameHandler = Game.initGameLocalAi()
    } else if (chosenMode === 'online-human') {
      currentGameHandler = Game.initGameOnline2p()
    } else if (chosenMode === 'ai-vs-ai') {
      currentGameHandler = Game.initGameAiVsAi()
    } else {
      console.error('Invalid game mode received', chosenMode)
    }
  }
})
