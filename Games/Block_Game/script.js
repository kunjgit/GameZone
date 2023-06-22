let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in array height
let gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";
// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the
// box on the canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

// 3. Will hold all the Tetrominos 
let tetrominos = [];
// 3. The tetromino array with the colors matched to the tetrominos array
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red'];
// 3. Holds current Tetromino color
let curTetrominoColor;

// 4. Create gameboard array so we know where other squares are
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));

// 6. Array for storing stopped shapes
// It will hold colors when a shape stops and is added
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

// 4. Created to track the direction I'm moving the Tetromino
// so that I can stop trying to move through walls
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Execute SetupCanvas when page loads
document.addEventListener('DOMContentLoaded', SetupCanvas); 

// Creates the array with square coordinates [Lookup Table]
// [0,0] Pixels X: 11 Y: 9, [1,0] Pixels X: 34 Y: 9, ...
function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        // 12 * 23 = 276 - 12 = 264 Max X value
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            // console.log(i + ":" + j + " = " + coordinateArray[i][j].x + ":" + coordinateArray[i][j].y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    // Double the size of elements to fit the screen
    ctx.scale(2, 2);

    // Draw Canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw gameboard rectangle
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    // Set font for score label text and draw
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    // Draw score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // Draw score
    ctx.fillText(score.toString(), 310, 127);
    
    // Draw level label text
    ctx.fillText("LEVEL", 300, 157);

    // Draw level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // Draw level
    ctx.fillText(level.toString(), 310, 190);

    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 221);

    // Draw playing condition
    ctx.fillText(winOrLose, 310, 261);

    // Draw playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);
    
    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 354);

    // Draw controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    // 2. Handle keyboard presses
    document.addEventListener('keydown', HandleKeyPress);

    // 3. Create the array of Tetromino arrays
    CreateTetrominos();
    // 3. Generate random Tetromino
    CreateTetromino();

    // Create the rectangle lookup table
    CreateCoordArray();

    DrawTetromino();
}

function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino(){
    // Cycle through the x & y array for the tetromino looking
    // for all the places a square would be drawn
    for(let i = 0; i < curTetromino.length; i++){

        // Move the Tetromino x & y values to the tetromino
        // shows in the middle of the gameboard
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // 4. Put Tetromino shape in the gameboard array
        gameBoardArray[x][y] = 1;
        // console.log("Put 1 at [" + x + "," + y + "]");

        // Look for the x & y values in the lookup table
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        // console.log("X : " + x + " Y : " + y);
        // console.log("Rect X : " + coordinateArray[x][y].x + " Rect Y : " + coordinateArray[x][y].y);

        // 1. Draw a square at the x & y coordinates that the lookup
        // table provides
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// ----- 2. Move & Delete Old Tetrimino -----
// Each time a key is pressed we change the either the starting
// x or y value for where we want to draw the new Tetromino
// We also delete the previously drawn shape and draw the new one
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
    // a keycode (LEFT)
    if(key.keyCode === 65){
        // 4. Check if I'll hit the wall
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX--;
            DrawTetromino();
        } 

    // d keycode (RIGHT)
    } else if(key.keyCode === 68){
        
        // 4. Check if I'll hit the wall
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }

    // s keycode (DOWN)
    } else if(key.keyCode === 83){
        MoveTetrominoDown();
        // 9. e keycode calls for rotation of Tetromino
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}

function MoveTetrominoDown(){
    // 4. Track that I want to move down
    direction = DIRECTION.DOWN;

    // 5. Check for a vertical collision
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

// 10. Automatically calls for a Tetromino to fall every second

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 1000);


// Clears the previously drawn Tetromino
// Do the same stuff when we drew originally
// but make the square white this time
function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // 4. Delete Tetromino square from the gameboard array
        gameBoardArray[x][y] = 0;

        // Draw white where colored squares used to be
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// 3. Generate random Tetrominos with color
// We'll define every index where there is a colored block
function CreateTetrominos(){
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino];
    // Get the color for it
    curTetrominoColor = tetrominoColors[randomTetromino];
}

// 4. Check if the Tetromino hits the wall
// Cycle through the squares adding the upper left hand corner
// position to see if the value is <= to 0 or >= 11
// If they are also moving in a direction that would be off
// the board stop movement
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}

// 5. Check for vertical collison
function CheckForVerticalCollison(){
    // Make a copy of the tetromino so that I can move a fake
    // Tetromino and check for collisions before I move the real
    // Tetromino
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;

    // Cycle through all Tetromino squares
    for(let i = 0; i < tetrominoCopy.length; i++){
        // Get each square of the Tetromino and adjust the square
        // position so I can check for collisions
        let square = tetrominoCopy[i];
        // Move into position based on the changing upper left
        // hand corner of the entire Tetromino shape
        let x = square[0] + startX;
        let y = square[1] + startY;

        // If I'm moving down increment y to check for a collison
        if(direction === DIRECTION.DOWN){
            y++;
        }

        // Check if I'm going to hit a previously set piece
        // if(gameBoardArray[x][y+1] === 1){
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            // console.log("COLLISON x : " + x + " y : " + y);
            // If so delete Tetromino
            DeleteTetromino();
            // Increment to put into place and draw
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over and if so set game over text
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {

            // 6. Add stopped Tetromino to stopped shape array
            // so I can check for future collisions
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }

            // 7. Check for completed rows
            CheckForCompletedRows();

            CreateTetromino();

            // Create the next Tetromino and draw it and reset direction
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}

// 6. Check for horizontal shape collision
function CheckForHorizontalCollision(){
    // Copy the Teromino so I can manipulate its x value
    // and check if its new value would collide with
    // a stopped Tetromino
    var tetrominoCopy = curTetromino;
    var collision = false;

    // Cycle through all Tetromino squares
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        // Get the square and move it into position using
        // the upper left hand coordinates
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        // Move Tetromino clone square into position based
        // on direction moving
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }

        // Get the potential stopped square that may exist
        var stoppedShapeVal = stoppedShapeArray[x][y];

        // If it is a string we know a stopped square is there
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}

// 7. Check for completed rows
// ***** SLIDE *****
function CheckForCompletedRows(){

    // 8. Track how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    // Check every row to see if it has been completed
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array
            let square = stoppedShapeArray[x][y];

            // Check if nothing is there
            if (square === 0 || (typeof square === 'undefined'))
            {
                // If there is nothing there once then jump out
                // because the row isn't completed
                completed=false;
                break;
            }
        }

        // If a row has been completed
        if (completed)
        {
            // 8. Used to shift down the rows
            if (startOfDeletion === 0) {
              startOfDeletion = y;
            }
            rowsToDelete++;

            // Delete the line everywhere
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous squares
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the square as white
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

// 8. Move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = square; // Draw color into stopped

                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

// 9. Rotate the Tetromino
// ***** SLIDE *****
function RotateTetromino()
{
    let newRotation = [];
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino
        // We are cloning the array otherwise it would 
        // create a reference to the array that caused the error
        curTetrominoBU = [...curTetromino];

        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

// Gets the x value for the last square in the Tetromino
// so we can orientate all other squares using that as
// a boundary. This simulates rotating the Tetromino
function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX) {
          lastX = square[0];
        }
    }
    return lastX;
}
