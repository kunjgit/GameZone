const canvas = document.getElementById('game-board')
const gameOver = document.getElementById('game-over')
const gameStart = document.getElementById('game-start')
const restart = document.getElementById('restart')
const start = document.getElementById('start')
const scoreCard = document.getElementById('score-card')
const Currscore = document.getElementById('current-score')
const highScoreCard = document.getElementById('highest-score')

const ctx = canvas.getContext('2d')

const highestScoreKey = 'arkanoid'
let highestScore = localStorage.getItem(highestScoreKey) ? parseInt(localStorage.getItem(highestScoreKey)) : 0

highScoreCard.textContent += highestScore

//paddle
const paddleWidth = 130
const paddleHeight = 12
const paddleSpeed = 16

const ballRadius = 10
//let gameRunning

//brick
const brickRowCount = 7
const brickColumnCount = 9
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 25

let score = 0

const keys = {
    left : false,
    right : false
}

bricks = []

//When we press the arrow key
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') keys.left = true
    if (e.key === 'ArrowRight') keys.right = true
})

//When arrow key is released
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') keys.left = false
    if (e.key === 'ArrowRight') keys.right = false
})

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath() //It's typically used when you want to start a new shape or line segment without connecting it to the previous shapes or lines drawn on the canvas.
    //canvas.height: This is the total height of the canvas. Placing something exactly at canvas.height would put it right at the bottom edge of the canvas, which means it would be off-screen because the y-coordinates start at 0 at the top and increase downward.
    //paddleHeight: This is the height of the paddle itself. By subtracting the paddle's height from the canvas height, you ensure that the top edge of the paddle is positioned exactly paddleHeight pixels above the bottom edge of the canvas.
    // x-coordinate, y-coordinate, width of paddle, height of paddle
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = '#00FF00'
    ctx.fill()
    ctx.closePath()
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        if (c === 4){
            continue
        }
        for (let r = 0; r < brickRowCount; r++) {
            // Only draw the brick if it has hit points left
            if (bricks[c][r].hitPoints > 0) {
                //c * (brickWidth + brickPadding) calculates the total horizontal distance from the left edge of the first brick to the left edge of the current brick.
                //brickOffsetLeft ensures that the entire row of bricks is offset from the left edge of the canvas by a specific amount
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = bricks[c][r].color
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

function movePaddle(){
    if (keys.left && paddleX > 0){
        paddleX -= paddleSpeed
    }
    if (keys.right && paddleX < canvas.width - paddleWidth){
        paddleX += paddleSpeed
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.hitPoints > 0) {
                //Checking if ball's x-coordinate is greater than the brick's left edge and less than the brick's right edge
                //Similarly for y-coordinate
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy //it reverses the vertical direction of the ball by negating its vertical velocity (dy). This makes the ball bounce off the brick.
                    brick.hitPoints-- 
                    if (brick.hitPoints === 2) {
                        brick.color = "#bebebe" //silver
                    } else if (brick.hitPoints === 1) {
                        brick.color = "red"
                    }
                    else {
                        brick.color = "";
                        score += (r === 3 || r === 0) ? 25 : (r === 2) ? 15 : 8
                    }
                }
            }
        }
    }
}

function adjustSpeedBasedOnScore() {
    const baseSpeed = 3
    const speedIncrement = 0.5 // Adjust increment as needed
    const additionalSpeed = Math.floor(score / 30) * speedIncrement;

    const newSpeed = baseSpeed + additionalSpeed

    // Adjust dx and dy proportionally to maintain the direction
    const speedRatio = newSpeed / Math.sqrt(dx * dx + dy * dy);
    dx *= speedRatio;
    dy *= speedRatio;
}

let animationFrameId

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
   
    drawBricks()
    drawBall()
    drawPaddle()
    collisionDetection()
    adjustSpeedBasedOnScore()


    //Horizontal Collision Detection
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    //Top Collision Detection
    if (y + dy < ballRadius) {
        dy = -dy
    } 
    //Bottom Collision Detection
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            //gameRunning = false
            scoreCard.textContent = 'Your Score is : ' + score
            gameOver.style.display = 'block'
            Currscore.style.display = 'none'

            if (score > highestScore){
                highestScore = score
                localStorage.setItem(highestScoreKey, highestScore)
                highScoreCard.textContent = 'Highest Score is : ' + highestScore
            }
            return
        }
    }
    movePaddle()

    x += dx
    y += dy
    Currscore.textContent = 'Current Score : ' + score
    animationFrameId = requestAnimationFrame(draw)
}

function resetGame() {
    //so that on restarting game speed of ball remains same, it happened bcoz each time resetGame is called, it starts a new game 
    //loop by calling draw again, which can result in multiple overlapping game loops, causing the ball to move faster.
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Reset ball position
    x = canvas.width / 2
    y = canvas.height - 30
    
    // Reset ball velocity
    const speed = 3
    dx = (Math.random() * 2 - 1) * speed
    dy = -speed //so that ball always moves upward
    
    //Reset paddle
    //By dividing the remaining space of the canvas (canvas.width - paddleWidth) by 2, we find the amount of space needed on the left 
    //side of the paddle to center it horizontally. This places the paddle in the middle of the canvas
    paddleX = (canvas.width - paddleWidth) / 2
    
    // Reset bricks
    //it initializes a grid of bricks with different hit points and colors based on their row positions
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRowCount; r++) {
            const hitPoints = (r === 3 || r === 0) ? 3 : (r === 2 || r === 4) ? 2 : 1;
            let color
            if (hitPoints === 3) {
                color = '#ffcc00'  //gold
            } else if (hitPoints === 2) {
                color = '#bebebe'   //silver
            } else {
                color = 'red'
            }
            bricks[c][r] = { x: 0, y: 0, hitPoints, color }
        }
    }

    score = 0
    Currscore.style.display = 'block'
    // Restart the game loop
    draw()
}

start.addEventListener('click', e => {
    gameStart.style.display = 'none' 
    canvas.style.display = 'block'
    resetGame()
})

//Re-initializing all variables
restart.addEventListener('click', e => {
    gameOver.style.display = 'none'
    resetGame()
    
})