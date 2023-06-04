/**
 * @extends {Animation}
 * The Paused Animation
 */
class PausedAnimation extends Animation {
    
    /**
     * The Paused Animation
     * @param {Canvas} canvas
     */
    constructor(canvas) {
        super();
        
        this.canvas     = canvas;
        this.blocksGame = true;
        this.timePart   = 500;
        this.partDiv    = 5;
        this.maxSize    = 2.2;
        this.minSize    = 1.5;
        this.clearAll   = true;
    }
    
    /**
     * Returns true if the animation hasn't ended
     * @param {number} time
     * @return {boolean}
     */
    isAnimating() {
        return true;
    }
    
    /**
     * Animates the Paused text alternating sizes increases and decreases
     */
    animate() {
        let time = this.time % this.timePart,
            anim = Math.floor(this.time / this.timePart) % 2,
            part = time * (this.maxSize - this.minSize) / this.timePart,
            size = anim ? this.maxSize - part : this.minSize + part;
        
        this.canvas.clear();
        this.canvas.fill(0.8);
        
        this.canvas.drawText({
            size  : size,
            color : "rgb(255, 255, 51)",
            text  : "Paused!",
            pos   : { x: 14, y: 17.3 },
            alpha : 0.8
        });
    }
}
