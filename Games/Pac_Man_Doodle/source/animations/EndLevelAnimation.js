/**
 * @extends {Animation}
 * The End Level Animation
 */
class EndLevelAnimation extends Animation {
    
    /**
     * The End Level Animation constructor
     * @param {function} callback
     */
    constructor(callback) {
        super();
        
        this.callback   = callback;
        
        this.blinks     = 0;
        this.blocksGame = true;
        this.blinkTimer = 150;
        this.endTime    = 1600;
    }
    
    /**
     * Does the End Level animation
     */
    animate() {
        if (this.time > this.blinkTimer) {
            Board.boardCanvas.clear();
            Board.drawBoard(this.blinks % 2 === 0);
            this.blinks     += 1;
            this.blinkTimer += 150;
        }
    }
}
