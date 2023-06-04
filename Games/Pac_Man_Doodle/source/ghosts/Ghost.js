/**
 * The Ghost Base Class
 */
class Ghost {
    
    /**
     * Initializes the Ghost
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    init(canvas, dots) {
        this.canvas     = canvas;
        this.ctx        = canvas.context;
        
        this.mode       = "scatter";
        this.tile       = Board.getGhostStartTile(this.inPen);
        this.tileCenter = Board.getTileXYCenter(this.tile);
        this.turn       = Board.getGhostStartTurn(this.inPen);
        this.center     = false;
        this.dotsCount  = dots || 0;
        this.target     = this.scatter;
        this.speed      = Data.getGhostSpeed(this.inPen);
        this.feet       = 0;
        this.path       = null;
        this.pathName   = null;
        this.pathStep   = 0;
    }
    
    /**
     * Switches the Ghost mode
     * @param {number} oldMode
     * @param {number} newMode
     * @param {Blob}   blob
     */
    switchMode(oldMode, newMode, blob) {
        if (!this.dontSwitch(oldMode)) {
            this.mode   = newMode;
            this.target = this.getTarget(blob);
            this.speed  = this.getSpeed();
                
            if (!this.dontHalfTurn(oldMode)) {
                if (this.path === null) {
                    this.turn = {
                        x : this.dir.x * -1,
                        y : this.dir.y * -1
                    };
                } else {
                    this.turn = { x: 1, y: 0 };
                }
            }
        }
    }
    
    /**
     * Moves the Ghost
     * @param {number} speed
     * @param {Blob}   blob
     * @param {number} switchMode
     * @return {boolean}
     */
    move(speed, blob, switchMode) {
        let addToPen = false;
        this.x += this.dir.x * this.speed * speed;
        this.y += this.dir.y * this.speed * speed;
        
        if (this.path !== null) {
            addToPen = this.pathMove(blob, switchMode);
        } else {
            this.normalMove(blob);
        }
        
        this.moveFeet();
        this.draw();
        return addToPen;
    }
    
    /**
     * Moves the Ghost in a predefined path
     * @param {Blob}   blob
     * @param {number} switchMode
     * @return {boolean}
     */
    pathMove(blob, switchMode) {
        let step = this.path[this.pathStep];
        if (this.passedDist()) {
            if (this.dir.x) {
                this.x = step.distx;
            }
            if (this.dir.y) {
                this.y = step.disty;
            }
            
            if (step.next !== null) {
                this.pathStep = step.next;
                this.dir      = this.path[this.pathStep].dir;
            
            } else if (this.pathName === "exitPen") {
                this.path  = null;
                this.dir   = this.turn;
                this.turn  = null;
                this.speed = Data.getGhostSpeed(false);
            
            } else if (this.pathName === "enterPen") {
                this.mode       = switchMode;
                this.target     = this.getTarget(blob);
                this.tile       = Board.getGhostStartTile(false);
                this.tileCenter = Board.getTileXYCenter(this.tile);
                this.turn       = Board.getGhostStartTurn(true);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Moves the Ghost around the board
     * @param {Blob} blob
     */
    normalMove(blob) {
        this.newTile(blob);
        this.x = Board.tunnelEnds(this.x);
        
        if (!this.center && this.passedCenter()) {
            if (this.turn) {
                this.makeTurn();
            }
            if (this.isNextIntersection()) {
                this.decideTurn();
            }
            this.speed  = this.getSpeed();
            this.center = true;
        }
    }
    
    
    /**
     * The Ghost moved to a new Tile
     * @param {Blob} blob
     */
    newTile(blob) {
        var tile = Board.getTilePos(this.x, this.y);
        if (!Board.equalTiles(this.tile, tile)) {
            this.tile       = tile;
            this.tileCenter = Board.getTileXYCenter(this.tile);
            this.center     = false;
            
            if (this.isEnteringPen()) {
                this.setPath("enterPen");
            }
        }
    }
    
        
    /**
     * Sets the Path of the Ghost
     * @param {string} path
     */
    setPath(name) {
        this.pathName = name;
        this.pathStep = 0;
        this.path     = this.paths[this.pathName];
        this.dir      = this.path[this.pathStep].dir;
        this.speed    = Data.getPathSpeed(name);
    }
    
    /**
     * Returns true if the Ghost is entering the Pen
     * @return {boolean}
     */
    isEnteringPen() {
        return this.mode === "eyes" && Board.equalTiles(this.tile, Board.eyesTarget);
    }
    
    
    /**
     * The Ghost turns used the previously stored turn direction
     */
    makeTurn() {
        this.x    = this.tileCenter.x;
        this.y    = this.tileCenter.y;
        this.dir  = this.turn;
        this.turn = null;
    }
    
    /**
     * The Ghost decided which direction to do next depending on different factors
     */
    decideTurn() {
        let turns = this.getTurns();
        if (turns.length === 1) {
            this.turn = turns[0];
        } else if (Data.isFrighten(this.mode)) {
            this.turn = turns[Utils.rand(0, turns.length - 1)];
        } else {
            this.turn = this.getTargetTurn(turns);
        }
    }
    
    /**
     * Returns a list with all the possible turns a Ghost can do at an intersection
     * @return {Array.<{x: number, y: number}>}
     */
    getTurns() {
        let tile   = this.getNextTile(),
            pos    = Board.tileToString(tile),
            turns  = Board.getTurns(pos),
            result = [];
        
        turns.forEach((turn) => {
            if ((turn + 2) % 4 !== Board.dirToNumber(this.dir)) {
                result.push(Board.numberToDir(turn));
            }
        });
        return result;
    }
    
    /**
     * Decides the best turn depending on which cell after the intersection is closes to the target
     * @param {Array.<{x: number, y: number}>} turns
     * @return {{x: number, y: number}}
     */
    getTargetTurn(turns) {
        let tile   = this.getNextTile(),
            best   = 999999,
            result = {};
        
        turns.forEach((turn) => {
            let ntile = Board.sumTiles(tile, turn),
                distx = Math.pow(this.target.x - ntile.x, 2),
                disty = Math.pow(this.target.y - ntile.y, 2),
                dist  = Math.sqrt(distx + disty);
            
            if (dist < best) {
                best   = dist;
                result = turn;
            }
        });
        return result;
    }
    
    /**
     * Checks if the Ghost and the Blob are in the same tile and when those
     * are the same depending on the Ghost's mode, it can kill the blob or die
     * @param {{x: number, y: number}} blobTile
     * @return {string}
     */
    killOrDie(blobTile) {
        if (Board.equalTiles(this.tile, blobTile) && !this.path) {
            if (Data.isFrighten(this.mode)) {
                this.mode   = "eyes";
                this.target = Board.eyesTarget;
                this.speed  = Data.eyesSpeed;
                return "kill";
            
            } else if (this.mode !== "eyes") {
                return "die";
            }
        }
    }
    
    /**
     * Returns true if the Ghost should change it's target
     * @param {number} globalMode
     * @return {boolean}
     */
    shouldChangeTarget(globalMode) {
        return this.mode !== "eyes" && (globalMode === "chase" || this.isElroy());
    }
    
    /**
     * Don't let the Ghost change mode on certain cases
     * @param {number} mode
     * @return {boolean}
     */
    dontSwitch(mode) {
        return (Data.isFrighten(mode) && !Data.isFrighten(this.mode)) || this.mode === "eyes";
    }
    
    /**
     * Don't let the Ghost half turn when switching from Blue to White mode
     * @param {number} mode
     * @return {boolean}
     */
    dontHalfTurn(mode) {
        return mode === "blue" || mode === "white";
    }
    
    /**
     * Returns the Ghost's Speed based on diferent factors
     * @return {number}
     */
    getSpeed() {
        let speed = Data.getGhostSpeed(false);
        
        if (this.mode === "eyes") {
            speed = Data.eyesSpeed;
        } else if (Data.isFrighten(this.mode)) {
            speed = Data.getLevelData("ghostFrightSpeed");
        } else if (Board.isTunnel(this.tile.x, this.tile.y)) {
            speed = Data.getLevelData("tunnelSpeed");
        } else if (this.isElroy()) {
            speed = Data.getLevelData("elroySpeed" + this.elroyMode);
        }
        return speed;
    }
    
    /**
     * Returns true if the Ghost moved past certain distance stored in the Path
     * @return {boolean}
     */
    passedDist() {
        let path = this.path[this.pathStep];
        return (
            (this.dir.x ===  1 && this.x >= path.distx) ||
            (this.dir.x === -1 && this.x <= path.distx) ||
            (this.dir.y ===  1 && this.y >= path.disty) ||
            (this.dir.y === -1 && this.y <= path.disty)
        );
    }
    
    /**
     * Returns true if the Ghost passed the center of the tile
     * @return {boolean}
     */
    passedCenter() {
        return (
            (this.dir.x ===  1 && this.x >= this.tileCenter.x) ||
            (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
            (this.dir.y ===  1 && this.y >= this.tileCenter.y) ||
            (this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
    }
    
    /**
     * Returns the next tile
     * @return {{x: number, y: number}}
     */
    getNextTile() {
        return Board.sumTiles(this.tile, this.dir);
    }
    
    /**
     * Returns true if the next tile is an intersection
     * @return {boolean}
     */
    isNextIntersection() {
        let tile = this.getNextTile();
        return Board.isIntersection(tile.x, tile.y);
    }
    
    /**
     * Returns the Ghost's target depending on the current mode
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    getTarget(blob) {
        if (this.mode === "chase" || this.isElroy()) {
            return this.chase(blob);
        }
        return this.scatter;
    }
    
    
    /**
     * Returns true if the Ghost is in "Cruise Elroy" Mode. Only used for Blinky
     * @return {boolean}
     */
    isElroy() {
        return false;
    }
    
    /**
     * Makes it possible for a Ghost to switch to "Cruise Elroy" Mode. Only used for Blinky
     */
    activateElroy() {
        return undefined;
    }
    
    /**
     * Increases the internal pills count of a Ghost
     */
    increaseDots() {
        this.dotsCount += 1;
    }
    
    /**
     * Sets the Chase target of the Ghost
     * @param {Blob} blob
     */
    setChaseTarget(blob) {
        this.target = this.chase(blob);
    }
    
    
    /**
     * Changes the Drawing for the Ghosts feet
     */
    moveFeet() {
        this.feet = (this.feet + 0.3) % 2;
    }
    
    /**
     * Draws the Ghost
     */
    draw() {
        let center = Board.ghostSize / 2;
        this.canvas.savePos(this.x, this.y);
        this.ctx.save();
        this.ctx.translate(Math.round(this.x) - center, Math.round(this.y) - center);
        
        this.ghostBody();
        if (Data.isFrighten(this.mode)) {
            this.ghostFrightenFace();
        } else {
            this.ghostNormalFace();
        }
        this.ctx.restore();
    }
    
    /**
     * Draws the Ghost's Body
     */
    ghostBody() {
        this.ctx.fillStyle = this.getBodyColor();
        this.ctx.beginPath();
        this.ctx.arc(8,  8, 8, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(10, 8, 8, 1.5 * Math.PI, 2 * Math.PI, false);
        
        if (!Math.floor(this.feet)) {
            this.ghostFeet0();
        } else {
            this.ghostFeet1();
        }
        this.ctx.fill();
    }
    
    /**
     * Draws one of the variations of the Ghost's Feet
     */
    ghostFeet0() {
        this.ctx.lineTo(18, 16);
        this.ctx.lineTo(16, 18);
        this.ctx.lineTo(15, 18);
        this.ctx.lineTo(12, 15);
        this.ctx.lineTo(9, 18);
        this.ctx.lineTo(6, 15);
        this.ctx.lineTo(3, 18);
        this.ctx.lineTo(2, 18);
        this.ctx.lineTo(0, 16);
        this.ctx.lineTo(0, 8);
    }
    
    /**
     * Draws the other variation of the Ghost's Feet
     */
    ghostFeet1() {
        this.ctx.lineTo(18, 18);
        this.ctx.lineTo(15, 15);
        this.ctx.lineTo(12, 18);
        this.ctx.lineTo(11, 18);
        this.ctx.lineTo(9, 15);
        this.ctx.lineTo(7, 18);
        this.ctx.lineTo(6, 18);
        this.ctx.lineTo(3, 15);
        this.ctx.lineTo(0, 18);
        this.ctx.lineTo(0, 8);
    }
    
    /**
     * Draws the Ghost's Face for the Chase/Scatter/Eyes modes
     */
    ghostNormalFace() {
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6    + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6    + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    /**
     * Draws the Ghost's Face for the Frighten (Blue/White) modes
     */
    ghostFrightenFace() {
        this.ctx.fillStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.arc(6, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.moveTo(3, 14);
        this.ctx.lineTo(5, 11);
        this.ctx.lineTo(7, 14);
        this.ctx.lineTo(9, 11);
        this.ctx.lineTo(11, 14);
        this.ctx.lineTo(13, 11);
        this.ctx.lineTo(15, 14);
        this.ctx.stroke();
    }
    
    /**
     * Returns the color for the Ghosts body depending on the mode
     * @return {string}
     */
    getBodyColor() {
        switch (this.mode) {
        case "blue":
            return "rgb(0, 51, 255)";
        case "white":
            return "rgb(255, 255, 255)";
        case "eyes":
            return "rgb(0, 0, 0)";
        default:
            return this.color;
        }
    }
    
    /**
     * Returns the color used for the Ghosts face depending on the mode
     * @return {string}
     */
    getFaceColor() {
        return this.mode === "blue" ? "rgb(255, 255, 255)" : "rgb(255, 0, 0)";
    }
    
    
    /**
     * Returns the Ghost's ID
     * @return {number}
     */
    getID() {
        return this.id;
    }
    
    /**
     * Returns the Ghost's x position
     * @return {number}
     */
    getX() {
        return this.x;
    }
    
    /**
     * Returns the Ghost's y position
     * @return {number}
     */
    getY() {
        return this.y;
    }
    
    /**
     * Returns the Ghost's tile position
     * @return {{x: number, y: number}}
     */
    getTile() {
        return this.tile;
    }
    
    /**
     * Returns the Ghost's interntal dots counter
     * @return {number}
     */
    getDots() {
        return this.dotsCount;
    }
    
    /**
     * Returns the Ghost's current target tile
     * @return {number}
     */
    getTargetTile() {
        return this.target;
    }
}
