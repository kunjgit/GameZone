class Playfield {

    constructor(w, h) {
        // colors
        // this.foreground = [230];
        this.foreground = 230;
        this.background = [255];

        // dimensions and grid
        this.cols = w;
        this.rows = h;
        this.grid = [];
        this.resetGrid();

        // drawing sizes
        const canvasContainer = select('#canvasBox');
        this.cellSize = canvasContainer.width / w
        this.borderSize = 2;

        // whether or not gridlines are seen
        this.gridlines = false;
    }

    addToGrid(piece) {
        for (let row = 0; row < piece.size; row++) {
            for (let col = 0; col < piece.size; col++) {

                if (piece.cells[row][col] != null) {
                    let gridRow = piece.y + row;
                    let gridCol = piece.x + col;

                    this.grid[gridRow][gridCol] =
                        piece.cells[row][col];
                }

            }
        }

    }


    clearLines() {

        linetest()
    }

    isValid(piece) {

        for (let row = 0; row < piece.size; row++) {
            for (let col = 0; col < piece.size; col++) {

                if (piece.cells[row][col] != null) {

                    let gridRow = piece.y + row;
                    let gridCol = piece.x + col;

                    if (gridRow < 0 || gridRow >= this.rows ||
                        gridCol < 0 || gridCol >= this.cols ||
                        this.grid[gridRow][gridCol] != this.foreground)
                        return false;
                }

            }
        }

        return true;

    }

    resetGrid() {
        //   console.log("reset grid called!")
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = new Array(this.cols).fill(this.foreground);
        }
    }


    show() {
        // Draw the rectangle behind all the cells
        // for the border and gridlines


        let bs = this.borderSize
        let cs = this.cellSize

        if (this.gridlines) fill(this.background);
        else fill(this.foreground);

        stroke(this.background)
        strokeWeight(bs);

        // offset the rectangle so that
        // top and right borders stay in canvas
        let offset = floor(bs / 2)
        rect(offset, offset, cs * this.cols + bs - 1, cs * this.rows + bs - 1)


        //===========================
        // Draw cells over the big rectangle
        //===========================

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {

                // offset the cells by the size of the border
                let offset = this.borderSize;

                let cs = this.cellSize;

                // this.grid contains the colors of each cell
                stroke(this.grid[row][col])
                fill(this.grid[row][col]);

                //    noStroke();
                rect(cs * col + offset, cs * row + offset, cs - 1, cs - 1);
            }
        }

    } // end of show()


}



