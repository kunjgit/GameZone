let playfield
let fallingPiece
let paused = false
const width = 40
const height = 80
// to calculate delta time
let prev = 0;
let score = 0

let difficulty = "Intermediate";
let totalWidth
let totalHeight

// mobile touch debounce
let lastTouchTime = 0;
const debounceDelay = 100; // Adjust the debounce delay as needed


let scoreui = document.getElementById("scoreui")
let scrshotbtn = document.getElementById("scrshotbtn")
let pausebtn = document.getElementById("pausebtn")
let resetbtn = document.getElementById("resetbtn")
const radioInputs = document.getElementsByName("difficultyradio");




pausebtn.addEventListener("click", e => {
    paused = !paused
    pausebtn.innerHTML = paused ? `<i class="bi bi-play"></i> Play` : `<i class="bi bi-pause"></i> Pause`;
})

resetbtn.addEventListener("click", e => {
    spawnNewPiece();
    playfield.resetGrid();
    score = 0
    // update score ui
    scoreui.innerText = score

})

scrshotbtn.addEventListener("click", e => {
    saveCanvas('screenshot', 'png'); // Save as PNG file
})

radioInputs.forEach(input => {
    input.addEventListener("change", function () {
        if (input.checked) {
            if (input.id === "difficultyradio1") {
                difficulty = "Intermediate";
            } else if (input.id === "difficultyradio2") {
                difficulty = "Expert";
            }
            // You can add more conditions for other difficulty levels if needed
        }
    });
});




function setup() {
    playfield = new Playfield(width, height);

    totalWidth = playfield.cellSize * width + playfield.borderSize * 2;
    totalHeight = playfield.cellSize * height + playfield.borderSize * 2;
    //  frameRate(10)
    const canvas = createCanvas(totalWidth, totalHeight);
    canvas.parent('canvasBox');

    spawnNewPiece();
}


function draw() {

    // Handle touch events
    for (let i = 0; i < touches.length; i++) {
        let touchX = touches[i].x;
        let touchY = touches[i].y;

        // Calculate the time since the last touch event
        const currentTime = millis();
        const timeSinceLastTouch = currentTime - lastTouchTime;

        if (timeSinceLastTouch > debounceDelay) {
            if (touchY < totalHeight / 4) {
                // Top side touch: 
                fallingPiece.rotateCW();

                // if not valid, rotate back
                if (!playfield.isValid(fallingPiece))
                    fallingPiece.rotateCCW();

            }
        }
        // Update the last touch time
        lastTouchTime = currentTime;

        // Check if the touch event occurred in the left, right, up, or down area
        if (touchX < totalWidth / 4) {
            // Left side touch: Move left
            fallingPiece.moveLeft();
            if (!playfield.isValid(fallingPiece))
                fallingPiece.moveRight()


        } else if (touchX > (totalWidth / 4) * 3) {
            // Right side touch: Move right
            fallingPiece.moveRight();
            if (!playfield.isValid(fallingPiece))
                fallingPiece.moveLeft()


        } else if (touchY > (totalHeight / 4) * 3) {
            // Bottom side touch: Move down
            fallingPiece.moveDown();
            if (!playfield.isValid(fallingPiece))
                fallingPiece.moveUp()
            else
                fallingPiece.resetBuffer()
        }
    }

    // Get time passed since last frame
    let curr = millis();
    let delta = curr - prev;
    prev = curr;

    // Update

    if (!paused) {
        fallingPiece.update(delta);
    }


    // move down piece and spawn a new one
    // if necessary
    if (fallingPiece.timeToFall()) {
        fallingPiece.resetBuffer();
        fallingPiece.moveDown();

        if (!playfield.isValid(fallingPiece)) {
            //      console.log("not valid")
            fallingPiece.moveUp();
            spawnNewPiece();
        }
    }
    playfield.clearLines();


    // Draw
    background(251);
    automatonRules(playfield.grid)
    playfield.show();
    fallingPiece.show();
}


function spawnNewPiece() {
    if (fallingPiece) {
        playfield.addToGrid(fallingPiece);
        //  console.log("added to grid")
    }

    const pieces = ['O', 'J', 'L', 'S', 'Z', 'T', 'I'];
    const choice = random(pieces);
    fallingPiece = new Piece(choice, playfield);
    redraw();

}





function automatonRules(grid) {


    let case0 = 230
    let case1 = '#f43'




    for (let i = height - 2; i >= 0; i--) {
        for (let j = 0; j < width; j++) {
            // Extract values of the 2x2 block clockwise from the top-left cell


            let topleftcolor
            let toprightcolor
            let bottomrightcolor
            let bottomleftcolor

            let topLeft
            if (isInArray(tetrisColors, grid[i][j])) {
                topLeft = 1
                topleftcolor = grid[i][j]
            } else if (grid[i][j] == case0) {
                topLeft = 0
            }

            let topRight
            if (isInArray(tetrisColors, grid[i][j + 1])) {
                topRight = 1
                toprightcolor = grid[i][j + 1]
            } else if (grid[i][j + 1] == case0) {
                topRight = 0
            }


            let bottomRight
            if (isInArray(tetrisColors, grid[i + 1][j + 1])) {
                bottomRight = 1
                bottomrightcolor = grid[i + 1][j + 1]

            } else if (grid[i + 1][j + 1] == case0) {
                bottomRight = 0
            }

            let bottomLeft
            if (isInArray(tetrisColors, grid[i + 1][j])) {
                bottomLeft = 1
                bottomleftcolor = grid[i + 1][j]
            } else if (grid[i + 1][j] == case0) {
                bottomLeft = 0
            }


            // Create an array to represent the 2x2 block
            let block = [topLeft, topRight, bottomRight, bottomLeft];

            // Define rules for each possible block state

            if (arraysEqual(block, [0, 0, 0, 0])) {
                // case 1
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = case0;
                grid[i + 1][j] = case0;
            } else if (arraysEqual(block, [0, 0, 1, 0])) {
                // case 2
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = case0;
            } else if (arraysEqual(block, [0, 0, 0, 1])) {
                // case 3
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = case0;
                grid[i + 1][j] = bottomleftcolor
            } else if (arraysEqual(block, [0, 0, 1, 1])) {
                // case 4
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = bottomleftcolor
            } else if (arraysEqual(block, [0, 1, 0, 0])) {
                // case 5
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = toprightcolor;
                grid[i + 1][j] = case0;
            } else if (arraysEqual(block, [0, 1, 1, 0])) {
                // case 6
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = toprightcolor;
                grid[i + 1][j] = bottomrightcolor
            } else if (arraysEqual(block, [0, 1, 0, 1])) {
                // case 7
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = toprightcolor
                grid[i + 1][j] = bottomleftcolor
            } else if (arraysEqual(block, [0, 1, 1, 1])) {
                // case 8
                grid[i][j] = case0;
                grid[i][j + 1] = toprightcolor
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = bottomleftcolor
            } else if (arraysEqual(block, [1, 0, 0, 0])) {
                // case 9
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = case0;
                grid[i + 1][j] = topleftcolor
            } else if (arraysEqual(block, [1, 0, 1, 0])) {
                // case 10
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = topleftcolor
            } else if (arraysEqual(block, [1, 0, 0, 1])) {
                // case 11
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = bottomleftcolor
                grid[i + 1][j] = topleftcolor
            } else if (arraysEqual(block, [1, 0, 1, 1])) {
                // case 12
                grid[i][j] = topleftcolor
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = bottomleftcolor;
            } else if (arraysEqual(block, [1, 1, 0, 0])) {
                // case 13
                grid[i][j] = case0;
                grid[i][j + 1] = case0;
                grid[i + 1][j + 1] = toprightcolor
                grid[i + 1][j] = topleftcolor
            } else if (arraysEqual(block, [1, 1, 1, 0])) {
                // case 14
                grid[i][j] = case0;
                grid[i][j + 1] = toprightcolor
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = topleftcolor
            } else if (arraysEqual(block, [1, 1, 0, 1])) {
                // case 15
                grid[i][j] = topleftcolor
                grid[i][j + 1] = case0
                grid[i + 1][j + 1] = toprightcolor
                grid[i + 1][j] = bottomleftcolor
            } else if (arraysEqual(block, [1, 1, 1, 1])) {
                // case 16
                grid[i][j] = topleftcolor
                grid[i][j + 1] = toprightcolor
                grid[i + 1][j + 1] = bottomrightcolor
                grid[i + 1][j] = bottomleftcolor
            }

            // Add more rules as needed
        }
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}



function isInArray(arr, value) {
    return arr.includes(value);
}

const tetrisColors = [
    "#00FFFF",    // Cyan
    "#0000FF",    // Blue
    "#FFA500",    // Orange
    "#FFFF00",    // Yellow
    "#00FF00",    // Green
    "#800080",    // Purple
    "#FF0000"     // Red
];




function getLeftSideCells(grid) {
    const leftSideCells = [];
    const rows = grid.length;

    for (let row = 0; row < rows; row++) {
        const value = grid[row][0]; // Get the value at the leftmost cell
        if (value !== 230) {
            // Check if the previous cell had the same color
            const previousRow = leftSideCells[leftSideCells.length - 1];
            if (!previousRow || previousRow.color !== value) {
                leftSideCells.push({ row, col: 0, color: value });
            }
        }
    }

    return leftSideCells;
}

function findConnectedCells(grid, startRow, startCol) {
    const rows = grid.length;
    const cols = grid[0].length;
    const targetValue = grid[startRow][startCol];

    // Initialize a 2D array to track visited cells
    const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));

    // Define the eight possible neighbor directions, including diagonals
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    // Helper function to perform depth-first search
    function dfs(row, col, connectedCells) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
            return;
        }

        visited[row][col] = true;

        if (grid[row][col] === targetValue) {
            connectedCells.push({ row, col });

            // Check all neighbors, including diagonals
            for (const [dx, dy] of directions) {
                dfs(row + dx, col + dy, connectedCells);
            }
        }
    }

    const connectedCells = [];
    dfs(startRow, startCol, connectedCells);

    return connectedCells;
}



// this function does not check diagonal neighboring cells

function findConnectedCellsnodiagonal(grid, startRow, startCol) {
    const rows = grid.length;
    const cols = grid[0].length;
    const targetValue = grid[startRow][startCol];

    // Initialize a 2D array to track visited cells
    const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));

    // Helper function to perform depth-first search
    function dfs(row, col, connectedCells) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
            return;
        }

        visited[row][col] = true;

        if (grid[row][col] === targetValue) {
            connectedCells.push({ row, col });

            // Check all neighbors
            dfs(row - 1, col, connectedCells); // Up
            dfs(row + 1, col, connectedCells); // Down
            dfs(row, col - 1, connectedCells); // Left
            dfs(row, col + 1, connectedCells); // Right
        }
    }

    const connectedCells = [];
    dfs(startRow, startCol, connectedCells);

    return connectedCells;
}



function linetest() {


    let uniqueleftcolors = getLeftSideCells(playfield.grid)
    //  console.log(uniqueleftcolors)

    for (let index = 0; index < uniqueleftcolors.length; index++) {


        // get the cluster
        let connectedcells
        //   console.log(connectedcells)

        if (difficulty == "Intermediate") {
            connectedcells = findConnectedCells(playfield.grid, uniqueleftcolors[index].row, uniqueleftcolors[index].col)
        } else if (difficulty == "Expert") {
            connectedcells = findConnectedCellsnodiagonal(playfield.grid, uniqueleftcolors[index].row, uniqueleftcolors[index].col)

        }




        const hasCol = connectedcells.some(obj => obj.col === width - 1);

        if (hasCol) {
            //  console.log("Found an object with col = 39");

            // loop over the cluster and set their location in grid to 230
            for (let index = 0; index < connectedcells.length; index++) {
                playfield.grid[connectedcells[index].row][connectedcells[index].col] = 230
            }


            score += connectedcells.length
            // update score ui
            scoreui.innerText = score

        }


    }



}

