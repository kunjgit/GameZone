/**
 * @extends {Ghost}
 * The Demo Ghost Class
 */
class DemoGhost extends Ghost {

    /**
     * The Demo Ghost constructor
     * @param {string} name
     * @param {string} color
     */
    constructor(name, color) {
        super();
        
        this.canvas = Board.screenCanvas;
        this.ctx    = this.canvas.context;
        this.feet   = 0;
        
        this.name   = name;
        this.color  = color;
    }
    
    /**
     * Returns the Ghost's name
     * @return {number}
     */
    getName() {
        return this.name;
    }
        
    
    /**
     * Initialize some variables for the chase demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} x
     * @param {number} y
     */
    chaseDemo(dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
        this.y     = y;
        this.mode  = "chase";
        this.speed = Data.getGhostSpeed(false);
    }
    
    /**
     * Initialize some variables for the frighten demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} speed
     */
    frightenDemo(dir, speed) {
        this.dir   = Object.create(dir);
        this.mode  = "blue";
        this.speed = speed;
    }
    
    /**
     * Initialize some variables for the present demo animation
     * @param {{x: number, y: number}} dir
     */
    presentDemo(dir) {
        this.dir   = Object.create(dir);
        this.x     = -Board.ghostSize;
        this.mode  = "chase";
        this.speed = Data.getGhostSpeed(false);
    }
    
    
    /**
     * The animation used on the Demo
     * @param {number} speed
     */
    demoAnimate(speed) {
        this.x += this.dir.x * this.speed * speed;
        
        this.moveFeet();
        this.draw();
    }
}
