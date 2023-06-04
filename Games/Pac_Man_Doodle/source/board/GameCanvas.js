/**
 * @extends {Canvas}
 * The Game Canvas Class
 */
class GameCanvas extends Canvas {
    
    /**
     * The Game Canvas constructor
     */
    constructor() {
        super();
        this.init("game");
    }
    
    /**
     * Draws the Ghosts Targets for testing
     * @param {Array.<Ghost>} ghosts
     */
    drawTargets(ghosts) {
        this.ctx.save();
        ghosts.forEach((ghost) => {
            this.ctx.fillStyle   = ghost.getBodyColor();
            this.ctx.strokeStyle = ghost.getBodyColor();
            
            let tile = Board.getTileXYCenter(ghost.getTargetTile());
            this.ctx.beginPath();
            this.ctx.moveTo(ghost.getX(), ghost.getY());
            this.ctx.lineTo(tile.x, tile.y);
            this.ctx.fillRect(tile.x - 4, tile.y - 4, 8, 8);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }
}
