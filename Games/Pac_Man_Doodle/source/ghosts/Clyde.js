/**
 * @extends {Ghost}
 * The Clyde Class
 */
class Clyde extends Ghost {
    
    /**
     * The Clyde constructor
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    constructor(canvas, dots) {
        super();
        
        this.paths = {
            inPen    : [
                { dir : { x:  0, y: -1 }, disty : 168, next : 1 },
                { dir : { x:  0, y:  1 }, disty : 180, next : 0 }
            ],
            exitPen  : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : 2    },
                { dir : { x:  1, y:  0 }, distx : 192, next : null }
            ]
        };
        
        this.id      = 3;
        this.x       = 192;
        this.y       = 174;
        this.scatter = { x: 0, y: 31 };
        this.inPen   = true;
        this.color   = Clyde.color;
        
        this.init(canvas, dots);
        this.setPath("inPen");
    }
    
    /**
     * Returns the Ghost's name
     * @return {string}
     */
    static get name() {
        return "Clyde";
    }
    
    /**
     * Returns the Ghost's color
     * @return {string}
     */
    static get color() {
        return "rgb(255, 153, 0)";
    }
    

    /**
     * Clyde's target is the Blob possition if is further away and the Scatter if is closer
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    chase(blob) {
        let x = Math.pow(this.tile.x - blob.getTile().x, 2),
            y = Math.pow(this.tile.y - blob.getTile().y, 2);
        
        if (Math.sqrt(x + y) > 8) {
            return blob.getTile();
        }
        return this.scatter;
    }
}
