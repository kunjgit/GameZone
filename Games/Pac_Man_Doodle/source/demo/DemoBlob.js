/**
 * @extends {Blob}
 * The Demo Blob Class
 */
class DemoBlob extends Blob {
    
    /**
     * The Demo Blob Cconstructor
     */
    constructor() {
        super();
        
        this.init(Board.screenCanvas);
    }
    
    /**
     * Initialize some variables for the demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} x
     * @param {number} y
     */
    chaseDemo(dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
        this.y     = y;
        this.speed = Data.getLevelData("pmSpeed");
    }
    
    /**
     * The second animation of the demo in Frighten mode
     * @param {{x: number, y: number}} dir
     */
    frightenDemo(dir) {
        this.dir   = Object.create(dir);
        this.speed = Data.getLevelData("pmFrightSpeed");
    }
    
    /**
     * The animation used on the Demo
     * @param {number} speed
     */
    animate(speed) {
        this.x += this.dir.x * this.speed * speed;
        
        this.moveMouth();
        this.draw();
    }
}
