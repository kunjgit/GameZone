import { Player } from '../player'
import { BoardPiece } from '../board'

export class TestPlayer extends Player {
  getActionPromiseResolver: null | ((column: number) => void)

  /**
   * This promise acts to wait at `doAction` until there is a `getActionPromiseResolver`
   */
  getActionWaiting: null | Promise<void> = null
  getActionWaitingResolver: null | (() => void)

  constructor(boardPiece: BoardPiece) {
    super(boardPiece)
    this.getActionPromiseResolver = null

    this.getActionWaitingResolver = null
    this.renewPromise()
  }
  renewPromise() {
    this.getActionWaiting = new Promise(
      (resolve) => (this.getActionWaitingResolver = resolve)
    )
  }
  async getAction() {
    return new Promise<number>((resolve) => {
      this.getActionPromiseResolver = resolve

      if (this.getActionWaitingResolver) {
        this.getActionWaitingResolver()
      }
    })
  }
  async doAction(column: number) {
    await this.getActionWaiting

    if (this.getActionPromiseResolver) {
      this.getActionPromiseResolver(column)
    }
    this.renewPromise()
  }
}
