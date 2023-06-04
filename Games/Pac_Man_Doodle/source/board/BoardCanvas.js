/**
 * @extends {Canvas}
 * The Board Canvas Class
 */
class BoardCanvas extends Canvas {
    
    /**
     * The Board Canvas constructor
     */
    constructor() {
        super();
        
        this.init("board");
        
        this.ctx.lineWidth   = Board.lineWidth;
        this.ctx.strokeStyle = Board.boardColor;
        
        
        this.drawTShapes = {
            "down"  : { radians: 0,   x:  0, y:  0 },
            "left"  : { radians: 0.5, x:  0, y: -5 },
            "right" : { radians: 1.5, x: -1, y:  0 },
            "up"    : { radians: 1,   x: -1, y: -5 }
        };
        this.radians = {
            "top-left"     : { from:   1, to: 1.5 },
            "top-right"    : { from: 1.5, to:   2 },
            "bottom-right" : { from:   0, to: 0.5 },
            "bottom-left"  : { from: 0.5, to:   1 }
        };
        this.corners = {
            "top-left"     : { x:  1, y:  1 },
            "top-right"    : { x: -1, y:  1 },
            "bottom-right" : { x: -1, y: -1 },
            "bottom-left"  : { x:  1, y: -1 }
        };
        this.smallCorners = {
            "top-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 1, line: -1 }
            },
            "top-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 1, line: -1 }
            },
            "bottom-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 0, line:  1 }
            },
            "bottom-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 0, line:  1 }
            }
        };
    }
    
    
    /**
     * Draw the Board
     * @param {boolean} newLevel
     */
    drawBoard(newLevel) {
        this.drawGhostsPen();
        
        this.ctx.save();
        this.ctx.strokeStyle = newLevel ? "white" : Board.boardColor;
        this.drawOuterBorder();
        this.drawInnerBorder();
        
        // First Row
        this.drawRectangle(2,  2,  4, 3);
        this.drawRectangle(7,  2,  5, 3);
        this.drawRectangle(16, 2,  5, 3);
        this.drawRectangle(22, 2,  4, 3);
        
        // Second Row
        this.drawRectangle(2,  6, 4, 2);
        this.drawTShape(7,     6, 4, 4, "right");
        this.drawTShape(10,    6, 4, 4, "down");
        this.drawTShape(16,    6, 4, 4, "left");
        this.drawRectangle(22, 6, 4, 2);
        
        // Third Row
        this.drawRectangle(7,  15, 2, 5);
        this.drawTShape(10,    18, 4, 4, "down");
        this.drawRectangle(19, 15, 2, 5);
        
        // Fourth Row
        this.drawLShape(2,     21, false);
        this.drawRectangle(7,  21, 5, 2);
        this.drawRectangle(16, 21, 5, 2);
        this.drawLShape(22,    21, true);
        
        // Fith Row
        this.drawTShape(2,  24, 4, 6, "up");
        this.drawTShape(10, 24, 4, 4, "down");
        this.drawTShape(16, 24, 6, 4, "up");
        
        this.ctx.restore();
    }
    
    /**
     * Draws the Ghosts Pen House
     */
    drawGhostsPen() {
        this.ctx.strokeRect(10.5 * Board.tileSize,                  12.5 * Board.tileSize,                  7 * Board.tileSize,                   4 * Board.tileSize);
        this.ctx.strokeRect(11   * Board.tileSize - Board.halfLine, 13   * Board.tileSize - Board.halfLine, 6 * Board.tileSize + Board.lineWidth, 3 * Board.tileSize + Board.lineWidth);
        this.ctx.strokeRect(13   * Board.tileSize - Board.halfLine, 12.5 * Board.tileSize,                  2 * Board.tileSize + Board.lineWidth, Board.tileSize / 2 - Board.halfLine);
        this.ctx.clearRect(13    * Board.tileSize,                  12.5 * Board.tileSize - Board.halfLine, 2 * Board.tileSize,                   Board.tileSize / 2 + Board.halfLine);
        
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(13   * Board.tileSize + Board.halfLine, 12.5 * Board.tileSize + Board.lineWidth, 2 * Board.tileSize - Board.lineWidth, Board.halfLine);
        this.ctx.restore();
    }
    
    /**
     * Draws the Board outer border
     */
    drawOuterBorder() {
        this.ctx.beginPath();
        
        // Top Corners
        this.drawOuterBigCorner(0,  0, "top-left");
        this.drawOuterBigCorner(27, 0, "top-right");
        
        // Right Tunnel
        this.drawOuterBigCorner(27,    9, "bottom-right");
        this.drawOuterSmallCorner(22,  9, "top-left");
        this.drawOuterSmallCorner(22, 13, "bottom-left");
        this.ctx.lineTo(28 * Board.tileSize, 13 * Board.tileSize + Board.halfLine);
        this.ctx.moveTo(28 * Board.tileSize, 16 * Board.tileSize - Board.halfLine);
        this.drawOuterSmallCorner(22, 15, "top-left");
        this.drawOuterSmallCorner(22, 19, "bottom-left");
        this.drawOuterBigCorner(27,   19, "top-right");
        
        // Bottom Corners
        this.drawOuterBigCorner(27,   30, "bottom-right");
        this.drawOuterBigCorner(0,    30, "bottom-left");
        
        // Left Tunnel
        this.drawOuterBigCorner(0,    19, "top-left");
        this.drawOuterSmallCorner(5,  19, "bottom-right");
        this.drawOuterSmallCorner(5,  15, "top-right");
        this.ctx.lineTo(0, 16 * Board.tileSize - Board.halfLine);
        this.ctx.moveTo(0, 13 * Board.tileSize + Board.halfLine);
        this.drawOuterSmallCorner(5,  13, "bottom-right");
        this.drawOuterSmallCorner(5,   9, "top-right");
        this.drawOuterBigCorner(0,     9, "bottom-left");
        
        this.ctx.lineTo(Board.halfLine, Board.bigRadius + Board.halfLine);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Board inner border
     */
    drawInnerBorder() {
        this.ctx.beginPath();
        
        // Top Border
        this.drawInnerCorner(0,   0, "top-left",     false, false);
        this.drawInnerCorner(13,  0, "top-right",    false, false);
        this.drawInnerCorner(13,  4, "bottom-left",  true,  true);
        this.drawInnerCorner(14,  4, "bottom-right", true,  true);
        this.drawInnerCorner(14,  0, "top-left",     false, false);
        this.drawInnerCorner(27,  0, "top-right",    false, false);
        
        // Right Border
        this.drawInnerCorner(27,  9, "bottom-right", false, false);
        this.drawInnerCorner(22,  9, "top-left",     true,  true);
        this.drawInnerCorner(22, 13, "bottom-left",  true,  true);
        this.ctx.lineTo(28 * Board.tileSize, 13.5 * Board.tileSize);
        this.ctx.moveTo(28 * Board.tileSize, 15.5 * Board.tileSize);
        this.drawInnerCorner(22, 15, "top-left",     true,  true);
        this.drawInnerCorner(22, 19, "bottom-left",  true,  true);
        this.drawInnerCorner(27, 19, "top-right",    false, false);
        this.drawInnerCorner(27, 24, "bottom-right", false, false);
        this.drawInnerCorner(25, 24, "top-left",     true,  true);
        this.drawInnerCorner(25, 25, "bottom-left",  true,  true);
        this.drawInnerCorner(27, 25, "top-right",    false, false);
        
        // Bottom Border
        this.drawInnerCorner(27, 30, "bottom-right", false, false);
        this.drawInnerCorner(0,  30, "bottom-left",  false, false);
        
        // Left Border
        this.drawInnerCorner(0,  25, "top-left",     false, false);
        this.drawInnerCorner(2,  25, "bottom-right", true,  true);
        this.drawInnerCorner(2,  24, "top-right",    true,  true);
        this.drawInnerCorner(0,  24, "bottom-left",  false, false);
        this.drawInnerCorner(0,  19, "top-left",     false, false);
        this.drawInnerCorner(5,  19, "bottom-right", true,  true);
        this.drawInnerCorner(5,  15, "top-right",    true,  true);
        this.ctx.lineTo(0, 15.5 * Board.tileSize);
        this.ctx.moveTo(0, 13.5 * Board.tileSize);
        this.drawInnerCorner(5,  13, "bottom-right", true,  true);
        this.drawInnerCorner(5,   9, "top-right",    true,  true);
        this.drawInnerCorner(0,   9, "bottom-left",  false, false);
        this.ctx.lineTo(Board.tileSize / 2, Board.tileSize / 2 + Board.smallRadius);
        
        this.ctx.stroke();
    }
    
    
    /**
     * Draws a drawRectangle at the given position with the given size
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    drawRectangle(x, y, width, height) {
        this.ctx.save();
        this.ctx.translate(x * Board.tileSize, y * Board.tileSize);
        
        this.ctx.beginPath();
        this.drawInnerCorner(0,                  0, "top-left",     true, false);
        this.drawInnerCorner(width - 1,          0, "top-right",    true, false);
        this.drawInnerCorner(width - 1, height - 1, "bottom-right", true, false);
        this.drawInnerCorner(0,         height - 1, "bottom-left",  true, false);
        this.ctx.closePath();
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Draws a t shape at the given position and with the given properties
     * @param {number} x
     * @param {number} y
     * @param {number} left
     * @param {number} right
     * @param {string} type
     */
    drawTShape(x, y, left, right, type) {
        let data  = this.drawTShapes[type],
            width = left + right;
        
        this.ctx.save();
        this.ctx.translate(x * Board.tileSize, y * Board.tileSize);
        this.ctx.rotate(data.radians * Math.PI);
        this.ctx.translate(data.x * width * Board.tileSize, data.y * Board.tileSize);
        
        this.ctx.beginPath();
        this.drawInnerCorner(0,         0, "top-left",     true,  false);
        this.drawInnerCorner(width - 1, 0, "top-right",    true,  false);
        this.drawInnerCorner(width - 1, 1, "bottom-right", true,  false);
        this.drawInnerCorner(left,      1, "top-left",     false, true);
        this.drawInnerCorner(left,      4, "bottom-right", true,  false);
        this.drawInnerCorner(left - 1,  4, "bottom-left",  true,  false);
        this.drawInnerCorner(left - 1,  1, "top-right",    false, true);
        this.drawInnerCorner(0,         1, "bottom-left",  true,  false);
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Draws an l shape at the given position
     * @param {number} x
     * @param {number} y
     * @param {boolean} reflect
     */
    drawLShape(x, y, reflect) {
        this.ctx.save();
        this.ctx.translate(x * Board.tileSize, y * Board.tileSize);
        
        if (reflect) {
            this.ctx.transform(-1, 0, 0, 1, 0, 0);
            this.ctx.translate(-4 * Board.tileSize, 0);
        }
        
        this.ctx.beginPath();
        this.drawInnerCorner(0, 0, "top-left",     true,  false);
        this.drawInnerCorner(3, 0, "top-right",    true,  false);
        this.drawInnerCorner(3, 4, "bottom-right", true,  false);
        this.drawInnerCorner(2, 4, "bottom-left",  true,  false);
        this.drawInnerCorner(2, 1, "top-right",    false, true);
        this.drawInnerCorner(0, 1, "bottom-left",  true,  false);
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    
    /**
     * Draws a corner for the outer line with a big angle
     * @param {number} x
     * @param {number} y
     * @param {string} type
     */
    drawOuterBigCorner(x, y, type) {
        let data = this.corners[type],
            pos  = {
                x : x * Board.tileSize + Board.bigRadius + data.x * Board.halfLine,
                y : y * Board.tileSize + Board.bigRadius + data.y * Board.halfLine
            };
        
        this.corner(pos, Board.bigRadius, type, false);
    }
    
    /**
     * Draws a corner for the outer line with a small angle
     * @param {number} x
     * @param {number} y
     * @param {string} type
     */
    drawOuterSmallCorner(x, y, type) {
        let radius = this.corners[type],
            data   = this.smallCorners[type],
            pos    = {
                x : (x + data.x.cell) * Board.tileSize + radius.x * Board.smallRadius + data.x.line * Board.halfLine,
                y : (y + data.y.cell) * Board.tileSize + radius.y * Board.smallRadius + data.y.line * Board.halfLine
            };
        
        this.corner(pos, Board.smallRadius, type, true);
    }
    
    /**
     * Draws a corner for the board
     * @param {number} x
     * @param {number} y
     * @param {string} type
     * @param {boolean} isBig
     * @param {boolean} anitclockwise
     */
    drawInnerCorner(x, y, type, isBig, anitclockwise) {
        let radius = isBig ? Board.bigRadius : Board.smallRadius,
            data   = this.corners[type],
            pos    = {
                x : (x + 0.5) * Board.tileSize + data.x * radius,
                y : (y + 0.5) * Board.tileSize + data.y * radius
            };
        
        this.corner(pos, radius, type, anitclockwise);
    }
    
    /**
     * Draws a corner at the given position and with the given radius and type
     * @param {{x: number, y: number}} pos
     * @param {number} radius
     * @param {string} type
     * @param {boolean} anitclockwise
     */
    corner(pos, radius, type, anitclockwise) {
        let rad    = this.radians[type],
            result = [rad.from * Math.PI, rad.to * Math.PI];
        
        if (anitclockwise) {
            result.reverse();
        }
        rad = { from: result[0], to: result[1] };
        
        this.ctx.arc(pos.x, pos.y, radius, rad.from, rad.to, anitclockwise);
    }
    
    
    /**
     * Draws lines over the board for testing
     */
    drawLines() {
        this.ctx.strokeStyle = "#CCC";
        this.ctx.lineWidth   = 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < Board.rows; i += 1) {
            this.ctx.moveTo(0,           i * Board.tileSize);
            this.ctx.lineTo(Board.width, i * Board.tileSize);
        }
        for (let i = 0; i < Board.cols; i += 1) {
            this.ctx.moveTo(i * Board.tileSize, 0);
            this.ctx.lineTo(i * Board.tileSize, Board.canvasHeight);
        }
        this.ctx.stroke();
    }
    
    /**
     * Draws the intersections over the board for testing
     */
    drawIntersections() {
        Object.keys(Board.boardTurns).forEach((key) => {
            let coords = key.replace("x", "").split("y"),
                x      = Board.getTileCorner(Number(coords[0])),
                y      = Board.getTileCorner(Number(coords[1]));
            
            this.ctx.fillRect(x, y, Board.tileSize, Board.tileSize);
            this.ctx.save();
            this.ctx.strokeStyle = "white";
            
            Board.boardTurns[key].forEach((value) => {
                let dir = Board.numberToDir(value),
                    bx  = Board.getTileCorner(Number(coords[0]) + dir.x),
                    by  = Board.getTileCorner(Number(coords[1]) + dir.y);
                
                this.ctx.strokeRect(bx, by, Board.tileSize, Board.tileSize);
            });
            this.ctx.restore();
        });
    }
}
