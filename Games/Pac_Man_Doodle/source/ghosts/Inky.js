/**
 * @extends {Ghost}
 * The Inky Class
 */
class Inky extends Ghost {
    
    /**
     * The Inky constructor
     * @param {Canvas} canvas
     * @param {number} dots
     * @param {Blinky} blinky
     */
    constructor(canvas, dots, blinky) {
        super();
        
        this.paths = {
            inPen    : [
                { dir : { x:  0, y: -1 }, disty : 168, next : 1 },
                { dir : { x:  0, y:  1 }, disty : 180, next : 0 }
            ],
            exitPen  : [
                { dir : { x:  1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : 2    },
                { dir : { x: -1, y:  0 }, distx : 144, next : null }
            ]
        };
        
        this.id      = 2;
        this.x       = 144;
        this.y       = 174;
        this.scatter = { x: 27, y: 31 };
        this.inPen   = true;
        this.color   = Inky.color;
        this.blinky  = blinky;
        
        this.init(canvas, dots);
        this.setPath("inPen");
    }
    
    /**
     * Returns the Ghost's name
     * @return {string}
     */
    static get name() {
        return "Inky";
    }
    
    /**
     * Returns the Ghost's color
     * @return {string}
     */
    static get color() {
        return "rgb(102, 255, 255)";
    }

    
    /**
     * Inky's target is an average of Blinky's position and the Blob's position
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    chase(blob) {
        let offsetx = blob.getTile().x + 2 * blob.getDir().x,
            offsety = blob.getTile().y + 2 * blob.getDir().y;
        
        // Recreating bug where Up = Up+Left
        if (blob.getDir().y === -1) {
            offsetx -= 2;
        }
        return {
            x : offsetx * 2 - this.blinky.getTile().x,
            y : offsety * 2 - this.blinky.getTile().y
        };
    }
}
