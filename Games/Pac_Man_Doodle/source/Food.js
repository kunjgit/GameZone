/**
 * The Food Class
 */
class Food {
    
    /**
     * The Food constructor
     */
    constructor() {
        this.ctx = Board.boardCanvas.context;
        
        this.init();
        this.createMatrix();
        this.createEnergizers();
    }
    
    /**
     * Initializes the instance
     */
    init() {
        this.total      = Board.pillAmount;
        this.minRadius  = Board.pillSize;
        this.maxRadius  = Board.energizerSize;
        this.radius     = this.maxRadius;
        this.energizers = [];
        this.matrix     = [];
        this.mult       = -1;
    }
    
    /**
     * Creates a Matrix with the positions of the pills and energizers
     */
    createMatrix() {
        for (let i = 0; i < Board.rows; i += 1) {
            this.matrix[i] = [];
            for (let j = 0; j < Board.cols; j += 1) {
                this.matrix[i][j] = Board.hasPill(j, i) ? Data.pillValue : 0;
            }
        }
        
        Board.energizers.forEach((pos) => {
            this.matrix[pos.y][pos.x] = Data.energizerValue;
        });
    }
    
    /**
     * Creates a list with only the active energizers
     */
    createEnergizers() {
        this.energizers = [];
        
        Board.energizers.forEach((pos) => {
            if (this.matrix[pos.y][pos.x] === Data.energizerValue) {
                this.energizers.push(Board.getTileXYCenter(pos));
            }
        });
    }
    
    
    /**
     * Does the Enerigizers animation
     */
    wink() {
        this.calcRadius();
        this.drawEnergizers();
    }
    
    /**
     * Calculates the Radius for the Energizers
     */
    calcRadius() {
        this.radius += this.mult * 0.1;
        
        if (this.radius <= this.minRadius) {
            this.mult = 1;
        } else if (this.radius >= this.maxRadius) {
            this.mult = -1;
        }
    }
    
    
    /**
     * Draws all the Pills and Energizers in the board
     */
    draw() {
        this.drawPills();
        this.drawEnergizers();
    }
    
    /**
     * Draws all the Pills in the board
     */
    drawPills() {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        
        this.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                let rect = Board.getPillRect(x, y);
                if (value === Data.pillValue) {
                    this.ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
                }
            });
        });
        this.ctx.restore();
    }
    
    /**
     * Clears a Pill at the given position
     * @param {number} x
     * @param {number} y
     */
    clearPill(x, y) {
        let rect = Board.getPillRect(x, y);
        this.ctx.clearRect(rect.x, rect.y, rect.size, rect.size);
    }
    
    
    /**
     * Draws all the remaining Energizers with the given radius
     */
    drawEnergizers() {
        this.energizers.forEach((pos) => {
            this.clearEnergizer(pos.x, pos.y);
            this.drawEnergizer(pos.x, pos.y, this.radius);
        });
    }
    
    /**
     * Draws an Energizer at the given position with the given radius
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     */
    drawEnergizer(x, y, radius) {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    /**
     * Clears an Energizer at the given position
     * @param {number} x
     * @param {number} y
     */
    clearEnergizer(x, y) {
        let radius = this.maxRadius;
        this.ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    
    
    /**
     * Returns true if there is a Pill at the given cell
     * @param {{x: number, y: number}} tile
     * @return {boolean}
     */
    isAtPill(tile) {
        return this.matrix[tile.y][tile.x] > 0;
    }
    
    /**
     * The Blob eats the Pill at the given cell. Returns the value of the pill. 1 for dot, 5 for energizer
     * @param {{x: number, y: number}} tile
     * @return {number}
     */
    eatPill(tile) {
        let value = this.matrix[tile.y][tile.x],
            pos   = Board.getTileXYCenter(tile);
        
        this.clearPill(tile.x, tile.y);
        this.matrix[tile.y][tile.x] = 0;
        this.total -= 1;
        
        if (value === Data.energizerValue) {
            this.clearEnergizer(pos.x, pos.y);
            this.createEnergizers();
        }
        return value;
    }
    
    
    /**
     * Returns the amount of Pîlls left
     * return {number}
     */
    getLeftPills() {
        return this.total;
    }
}
