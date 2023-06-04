/**
 * @extends {Food}
 * The Demo Food Class. Used in the chase animation
 */
class DemoFood extends Food {
    
    /**
     * The Demo Food constructor
     */
    constructor() {
        super();
        this.init();
        this.ctx = Board.screenCanvas.context;
    }
    
    /**
     * The wink animation used for the chase anmiation
     */
    wink() {
        let x = Board.getTileCenter(DemoData.chase.enerX),
            y = Board.getTileCenter(DemoData.chase.enerY);
        
        this.calcRadius();
        this.clearEnergizer(x, y);
        this.drawEnergizer(x, y, this.radius);
    }
}
