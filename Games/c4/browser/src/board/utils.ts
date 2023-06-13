import { Board } from './index'
/**
 * From Mozilla Developer Network
 * https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */
export function onresize(): { add: Function } {
  const callbacks: Array<Function> = []
  let running: boolean = false

  // Fired on resize event.
  function resize() {
    if (!running) {
      running = true

      if (window.requestAnimationFrame)
        window.requestAnimationFrame(runCallbacks)
      else setTimeout(runCallbacks, 66)
    }
  }

  // Run the actual callbacks.
  function runCallbacks() {
    callbacks.forEach((callback: Function): void => {
      callback()
    })

    running = false
  }

  // Adds callback to loop.
  function addCallback(callback: Function): void {
    if (callback) callbacks.push(callback)
  }

  return {
    // Public method to add additional callback.
    add: (callback: Function) => {
      if (!callbacks.length) window.addEventListener('resize', resize)

      addCallback(callback)
    },
  }
}

export function drawCircle(
  context: CanvasRenderingContext2D,
  { x = 0, y = 0, r = 0, fillStyle = '', strokeStyle = '' }
) {
  context.save()
  context.fillStyle = fillStyle
  context.strokeStyle = strokeStyle
  context.beginPath()
  context.arc(x, y, r, 0, 2 * Math.PI, false)
  context.fill()
  context.restore()
}
/**
 * @see http://stackoverflow.com/a/11770000/917957
 * @param context Canvas 2D Context
 * @param board   current board
 */
export function drawMask(board: Board) {
  const context = board.context
  context.save()
  context.fillStyle = Board.MASK_COLOR
  context.beginPath()
  const doubleRadius = 2 * Board.PIECE_RADIUS
  const tripleRadius = 3 * Board.PIECE_RADIUS
  for (let y = 0; y < Board.ROWS; y++) {
    for (let x = 0; x < Board.COLUMNS; x++) {
      context.arc(
        tripleRadius * x + Board.MASK_X_BEGIN + doubleRadius,
        tripleRadius * y + Board.MASK_Y_BEGIN + doubleRadius,
        Board.PIECE_RADIUS,
        0,
        2 * Math.PI
      )
      context.rect(
        tripleRadius * x + Board.MASK_X_BEGIN + 2 * doubleRadius,
        tripleRadius * y + Board.MASK_Y_BEGIN,
        -2 * doubleRadius,
        2 * doubleRadius
      )
    }
  }
  context.fill()
  context.restore()
}

export function clearCanvas(board: Board) {
  board.context.clearRect(0, 0, Board.CANVAS_WIDTH, Board.CANVAS_HEIGHT)
}
