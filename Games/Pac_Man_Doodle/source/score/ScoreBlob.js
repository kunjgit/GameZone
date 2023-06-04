/**
 * @extends {Blob}
 * The Demo Blob Class
 */
class ScoreBlob extends Blob {
    
    /**
     * The Demo Blob constructor
     * @param {number} number
     */
    constructor(number) {
        super();
        this.init(Board.boardCanvas);
        
        this.tile = { x: 19.5, y: 31.8 },
        this.x    = Board.getTileCenter(this.tile.x + number * 1.4);
        this.y    = Board.getTileCenter(this.tile.y);
        this.dir  = Board.startingDir;
    }
    
    /**
     * Clears the Blob
     */
    clear() {
        this.ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
