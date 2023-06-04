let Board = (function () {
    "use strict";
    
    /**
     * @const The Board MAtrix (28x31) and the Values
     * 0 Wall | 1 Path | 2 Pill on Path | 3 Intersection | 4 Pill on Interection | 5 Tunnel
     */
    const wallValue    = 0,
        pillPathValue  = 2,
        interValue     = 3,
        interPillValue = 4,
        tunnelValue    = 5,
        
        boardMatrix    = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 4, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 4, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 5, 5, 5, 5, 5, 5, 4, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 4, 5, 5, 5, 5, 5, 5 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
            [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
            [ 0, 3, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 1, 1, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 3, 0 ],
            [ 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0 ],
            [ 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0 ],
            [ 0, 4, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 4, 0 ],
            [ 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0 ],
            [ 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0 ],
            [ 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ],
    
    /**
     * @const Possible Turns at the Intersections
     * 0 Up | 1 Left | 2 Down | 3 Right
     */
        boardTurns = {
            x1y1   : [ 2, 3       ],
            x6y1   : [ 1, 2, 3    ],
            x12y1  : [ 1, 2       ],
            x15y1  : [ 2, 3       ],
            x21y1  : [ 1, 2, 3    ],
            x26y1  : [ 1, 2       ],
            x1y5   : [ 0, 2, 3    ],
            x6y5   : [ 0, 1, 2, 3 ],
            x9y5   : [ 1, 2, 3    ],
            x12y5  : [ 0, 1, 3    ],
            x15y5  : [ 0, 1, 3    ],
            x18y5  : [ 1, 2, 3    ],
            x21y5  : [ 0, 1, 2, 3 ],
            x26y5  : [ 0, 1, 2    ],
            x1y8   : [ 0, 3       ],
            x6y8   : [ 0, 1, 2    ],
            x9y8   : [ 0, 3       ],
            x12y8  : [ 1, 2       ],
            x15y8  : [ 2, 3       ],
            x18y8  : [ 0, 1       ],
            x21y8  : [ 0, 2, 3    ],
            x26y8  : [ 0, 1       ],
            x9y11  : [ 2, 3       ],
            x12y11 : [ 1, 3       ],
            x15y11 : [ 1, 3       ],
            x18y11 : [ 1, 2       ],
            x6y14  : [ 0, 1, 2, 3 ],
            x9y14  : [ 0, 1, 2    ],
            x18y14 : [ 0, 2, 3    ],
            x21y14 : [ 0, 1, 2, 3 ],
            x9y17  : [ 0, 2, 3    ],
            x18y17 : [ 0, 1, 2    ],
            x1y20  : [ 2, 3       ],
            x6y20  : [ 0, 1, 2, 3 ],
            x9y20  : [ 0, 1, 3    ],
            x12y20 : [ 1, 2       ],
            x15y20 : [ 2, 3       ],
            x18y20 : [ 0, 1, 3    ],
            x21y20 : [ 0, 1, 2, 3 ],
            x26y20 : [ 1, 2       ],
            x1y23  : [ 0, 3       ],
            x3y23  : [ 1, 2       ],
            x6y23  : [ 0, 2, 3    ],
            x9y23  : [ 1, 2, 3    ],
            x12y23 : [ 1, 3       ],
            x15y23 : [ 1, 3       ],
            x18y23 : [ 1, 2, 3    ],
            x21y23 : [ 0, 1, 2    ],
            x24y23 : [ 2, 3       ],
            x26y23 : [ 0, 1       ],
            x1y26  : [ 2, 3       ],
            x3y26  : [ 0, 1, 3    ],
            x6y26  : [ 0, 1       ],
            x9y26  : [ 0, 3       ],
            x12y26 : [ 1, 2       ],
            x15y26 : [ 2, 3       ],
            x18y26 : [ 0, 1       ],
            x21y26 : [ 0, 3       ],
            x24y26 : [ 0, 1, 3    ],
            x26y26 : [ 1, 2       ],
            x1y29  : [ 0, 3       ],
            x12y29 : [ 0, 1, 3    ],
            x15y29 : [ 0, 1, 3    ],
            x26y29 : [ 0, 1       ]
        },
    
    /** @const Board data */
        energizers    = [{ x: 1, y: 3 }, { x: 26, y: 3 }, { x: 1, y: 23 }, { x: 26, y: 23 }],
        pillAmount    = 244,
        fruitTile     = { x: 13.25, y: 16.8333 },
        fruitSize     = 20,
        tileSize      = 12,
        lineWidth     = 2,
        halfLine      = lineWidth / 2,
        bigRadius     = tileSize / 2,
        smallRadius   = tileSize / 4,
        eraseSize     = tileSize * 2,
        boardCols     = boardMatrix[0].length,
        boardRows     = boardMatrix.length,
        canvasWidth   = tileSize * boardCols,
        canvasHeight  = tileSize * boardRows,
        scoreHeight   = tileSize * 2,
        totalHeight   = canvasHeight + scoreHeight,
        tunnelStart   = -tileSize / 2,
        tunnelEnd     = tileSize * boardCols + tunnelStart,
        ghostSize     = tileSize * 1.5,
        blobRadius    = Math.round(tileSize / 1.5),
        pillSize      = Math.round(tileSize * 0.16666),
        energizerSize = Math.round(tileSize * 0.41666),
        boardColor    = "rgb(0, 51, 255)",
        startingPos   = { x: 14, y: 23 },
        startingDir   = { x: -1, y:  0 },
        eyesTarget    = { x: 13, y: 11 };
    
    /** @type {Canvas} The Game Canvas */
    let boardCanvas, screenCanvas, gameCanvas;
    
    
    /**
     * Returns the position at the middle of a tile
     * @param {number} tile
     * @return {number}
     */
    function getTileCenter(tile) {
        return Math.round((tile + 0.5) * tileSize);
    }
    
    /**
     * Converts an x,y tile into an x,y position
     * @param {{x: number, y: number}} tile
     * @return {{x: number, y: number}}
     */
    function tileToPos(tile) {
        return { x: tile.x * tileSize, y: tile.y * tileSize };
    }
    
    
    
    /**
     * The Board API
     */
    return {
        create() {
            boardCanvas  = new BoardCanvas();
            screenCanvas = new Canvas().init("screen");
            gameCanvas   = new GameCanvas();
        },

        /**
         * Returns the conetext for the board element
         * @return {Canvas}
         */
        get boardCanvas() {
            return boardCanvas;
        },

        /**
         * Returns the conetext for the screen element
         * @return {Canvas}
         */
        get screenCanvas() {
            return screenCanvas;
        },

        /**
         * Returns the conetext for the game element
         * @return {Canvas}
         */
        get gameCanvas() {
            return gameCanvas;
        },
        
        
        
        /**
         * Clears the saved rects in the Game Canvas
         */
        clearGame() {
            gameCanvas.clearSavedRects();
        },
        
        /**
         * Draws the board
         * @param {boolean} newLevel
         */
        drawBoard(newLevel) {
            boardCanvas.drawBoard(newLevel);
        },
        
        /**
         * Clears all the Canvas
         */
        clearAll() {
            boardCanvas.clear();
            gameCanvas.clear();
            screenCanvas.clear();
        },
        
        
        
        /**
         * Returns the width of the canvas
         * @return {number}
         */
        get width() {
            return canvasWidth;
        },
        
        /**
         * Returns the height of the canvas
         * @return {number}
         */
        get height() {
            return totalHeight;
        },
        
        /**
         * Returns the amount of columns of the matrix
         * @return {number}
         */
        get cols() {
            return boardCols;
        },
        
        /**
         * Returns the amount of rows of the matrix
         * @return {number}
         */
        get rows() {
            return boardRows;
        },
        
        /**
         * Returns the tile size
         * @return {number}
         */
        get tileSize() {
            return tileSize;
        },
        
        /**
         * Returns the line width
         * @return {number}
         */
        get lineWidth() {
            return lineWidth;
        },
        
        /**
         * Returns the half of the line width
         * @return {number}
         */
        get halfLine() {
            return halfLine;
        },
        
        /**
         * Returns the big radius
         * @return {number}
         */
        get bigRadius() {
            return bigRadius;
        },
        
        /**
         * Returns the small radius
         * @return {number}
         */
        get smallRadius() {
            return smallRadius;
        },
        
        /**
         * Returns the erase size
         * @return {number}
         */
        get eraseSize() {
            return eraseSize;
        },
        
        /**
         * Returns the board color
         * @return {string}
         */
        get boardColor() {
            return boardColor;
        },
        
        /**
         * Returns an array with the position of the energizers
         * @return {Array.<{x: number, y: number}>}
         */
        get energizers() {
            return energizers;
        },

        /**
         * Returns the amount of Pills in the board
         * @return {number}
         */
        get pillAmount() {
            return pillAmount;
        },
        
        /**
         * The tile of the fruit in the board
         * @return {{x: number, y: number}}
         */
        get fruitTile() {
            return fruitTile;
        },
        
        /**
         * The position of the fruit in the board
         * @return {{x: number, y: number}}
         */
        get fruitPos() {
            return tileToPos(fruitTile);
        },
        
        /**
         * The size of the fruit in the board
         * @return {number}
         */
        get fruitSize() {
            return fruitSize;
        },
        
        /**
         * The size of the pill in the board
         * @return {number}
         */
        get pillSize() {
            return pillSize;
        },
        
        /**
         * The size of the energizer in the board
         * @return {number}
         */
        get energizerSize() {
            return energizerSize;
        },
        
        /**
         * The ghost size in the board
         * @return {number}
         */
        get ghostSize() {
            return ghostSize;
        },
        
        /**
         * The blob radius in the board
         * @return {number}
         */
        get blobRadius() {
            return blobRadius;
        },
        
        /**
         * Returns the starting position of the blob
         * @return {{x: number, y: number}}
         */
        get startingPos() {
            return { x: startingPos.x, y: startingPos.y };
        },
        
        /**
         * Returns the starting direction of the blob
         * @return {{x: number, y: number}}
         */
        get startingDir() {
            return { x: startingDir.x, y: startingDir.y };
        },
        
        
        /**
         * Returns the eyes target
         * @return {{x: number, y: number}}
         */
        get eyesTarget() {
            return eyesTarget;
        },
        
        /**
         * Returns the ghost starting tile depending if is on the pen
         * @param {boolean} inPen
         * @return {{x: number, y: number}}
         */
        getGhostStartTile(inPen) {
            return inPen ? { x: 13, y: 14 } : { x: 13, y: 11 };
        },
        
        /**
         * Returns the ghost starting turn depending if is on the pen
         * @param {boolean} inPen
         * @return {?{x: number, y: number}}
         */
        getGhostStartTurn(inPen) {
            return inPen ? { x: -1, y: 0 } : null;
        },
        
        
        /**
         * Returns the position at the middle of a tile
         * @param {{x: number, y: number}} tile
         * @return {{x: number, y: number}}
         */
        getTileXYCenter(tile) {
            return {
                x : getTileCenter(tile.x),
                y : getTileCenter(tile.y)
            };
        },
        
        /**
         * Returns the position at the top-left corner of a tile
         * @param {number} tile
         * @return {number}
         */
        getTileCorner(tile) {
            return Math.round(tile * tileSize);
        },
        
        /**
         * Returns the position of a tile in terms of the matrix coordinates
         * @param {number} x
         * @param {number} y
         * @return {{x: number, y: number}}
         */
        getTilePos(x, y) {
            return {
                x : Math.floor(x / tileSize),
                y : Math.floor(y / tileSize)
            };
        },
        
        /**
         * Does a sumatory over all the tiles
         * @param {...{x: number, y: number}} tiles
         * @return {{x: number, y: number}}
         */
        sumTiles(...tiles) {
            return tiles.reduce((last, current) => {
                return { x: last.x + current.x, y: last.y + current.y };
            }, { x: 0, y: 0 });
        },
        
        /**
         * Returns true if the given tiles are the same
         * @param {{x: number, y: number}} tile1
         * @param {{x: number, y: number}} tile2
         * @return {boolean}
         */
        equalTiles(tile1, tile2) {
            return tile1.x === tile2.x && tile1.y === tile2.y;
        },
        
        
        /**
         * Returns the rectangle for the Pill at the given position
         * @param {number} x
         * @param {number} y
         * @return {{x: number, y: number, size: number}}
         */
        getPillRect(x, y) {
            return {
                x    : Board.getTileCenter(x) - Board.pillSize / 2,
                y    : Board.getTileCenter(y) - Board.pillSize / 2,
                size : Board.pillSize
            };
        },
        
        /**
         * Returns the rectangle for the Fruit
         * @return {{left: number, right: number, top: number, bottom: number}}
         */
        getFruitRect() {
            let pos  = Board.fruitPos,
                size = Board.fruitSize / 3;
            
            return {
                left   : pos.x - size,
                right  : pos.x + size,
                top    : pos.y - size,
                bottom : pos.y + size
            };
        },
        
        
        /**
         * Returns a new position for a player if is at the end of the tunnel
         * @param {number} x
         * @return {number}
         */
        tunnelEnds(x) {
            if (x < tunnelStart) {
                return tunnelEnd;
            }
            if (x > tunnelEnd) {
                return tunnelStart;
            }
            return x;
        },
        
        
        /**
         * Returns true if there is a wall at the given position
         * @param {number} col
         * @param {number} row
         * @return {boolean}
         */
        inBoard(col, row) {
            return row >= 0 && col >= 0 && row < boardRows && col < boardCols;
        },
        
        /**
         * Returns true if there is a wall at the given position
         * @param {number} col
         * @param {number} row
         * @return {boolean}
         */
        isWall(col, row) {
            return boardMatrix[row][col] === wallValue;
        },
        
        /**
         * Returns true if there is an intersection at the given position
         * @param {number} col
         * @param {number} row
         * @return {boolean}
         */
        isIntersection(col, row) {
            return boardMatrix[row][col] === interValue || boardMatrix[row][col] === interPillValue;
        },
        
        /**
         * Returns true if there is a tunnel at the given position
         * @param {number} col
         * @param {number} row
         * @return {boolean}
         */
        isTunnel(col, row) {
            return boardMatrix[row][col] === tunnelValue;
        },
        
        /**
         * Returns true if there can be a pill at the given position
         * @param {number} col
         * @param {number} row
         * @return {boolean}
         */
        hasPill(col, row) {
            return boardMatrix[row][col] === pillPathValue || boardMatrix[row][col] === interPillValue;
        },
        
        
        /**
         * Returns all the possible turns at a given position
         * @param {string} pos
         * @return {Array.<number>}
         */
        getTurns(pos) {
            return boardTurns[pos] || null;
        },
        
        /**
         * Converts a x,y object into a string
         * @param {{x: number, y: number}} tile
         * @return {string}
         */
        tileToString(tile) {
            return "x" + String(tile.x) + "y" + String(tile.y);
        },
        
        /**
         * Transforms a number into an x,y direction
         * @param {number} value
         * @return {{x: number, y: number}}
         */
        numberToDir(value) {
            switch (value) {
            case 0:
                return { x:  0, y: -1 };   // Up
            case 1:
                return { x: -1, y:  0 };   // Left
            case 2:
                return { x:  0, y:  1 };   // Down
            case 3:
                return { x:  1, y:  0 };   // Right
            }
        },
        
        /**
         * Transforms an x,y direction into a number
         * @param {{x: number, y: number}} dir
         * @return {number}
         */
        dirToNumber(dir) {
            switch (this.tileToString(dir)) {
            case "x0y-1":
                return 0;   // Up
            case "x-1y0":
                return 1;   // Left
            case "x0y1":
                return 2;   // Down
            case "x1y0":
                return 3;   // Right
            }
        },
                
        
        getTileCenter,
        tileToPos
    };
}());
