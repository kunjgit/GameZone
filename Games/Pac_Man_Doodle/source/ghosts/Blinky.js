/**
 * @extends {Ghost}
 * The Blinky Class
 */
class Blinky extends Ghost {
    
    /**
     * The Blinky constructor
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    constructor(canvas, dots) {
        super();
        
        this.paths = {
            exitPen : [
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : null }
            ]
        };
        
        this.id      = 0;
        this.x       = 168;
        this.y       = 138;
        this.dir     = { x: -1, y:  0 };
        this.scatter = { x: 25, y: -3 };
        this.inPen   = false;
        this.color   = Blinky.color;
        
        this.init(canvas, dots);
        
        this.elroyMode   = 0;
        this.activeElroy = dots !== null;
    }
    
    /**
     * Returns the Ghost's name
     * @return {string}
     */
    static get name() {
        return "Blinky";
    }
    
    /**
     * Returns the Ghost's color
     * @return {string}
     */
    static get color() {
        return "rgb(221, 0, 0)";
    }
    
    
    /**
     * Blinky's target is always the current tile of the Blob
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    chase(blob) {
        return blob.getTile();
    }
    
    /**
     * Sets Blinky's "Cruise Elroy" Mode when the number of dots left reaches the target
     * @param {number} dots
     */
    checkElroyDots(dots) {
        if (dots === Data.getLevelData("elroyDotsLeft1") ||
                dots === Data.getLevelData("elroyDotsLeft2")) {
            this.elroy += 1;
        }
    }
    
    /**
     * Returns true when Blinky is in "Cruise Elroy" Mode. Only used for Blinky
     * @return {boolean}
     */
    isElroy() {
        return this.activeElroy && this.elroy > 0;
    }
    
    /**
     * Makes it possible for Blinky to switch to "Cruise Elroy" Mode
     */
    activateElroy() {
        this.activeElroy = true;
    }
}
