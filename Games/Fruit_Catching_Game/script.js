const canvas = document.getElementById('game-board')
const gameOver = document.getElementById('game-over')
const gameStart = document.getElementById('game-start')
const restart = document.getElementById('restart')
const start = document.getElementById('start')
const scoreCard = document.getElementById('score-card')
const highScoreCard = document.getElementById('highest-score')

const ctx = canvas.getContext('2d')

const basketWidth = 160
const basketHeight = 36
const basketSpeed = 14

//fruitRadius defines the radius of the circular fruits.
const fruitRadius = 32
fruits = []

let highestScore = localStorage.getItem('highestScore') || 0
highScoreCard.textContent += highestScore

const keys = {
    left : false,
    right : false
}

const fruitImages = {
    apple : new Image(),
    banana : new Image(),
    watermelon : new Image(),
    orange : new Image(),
}

fruitImages.apple.src = 'images/apple.png'
fruitImages.banana.src = 'images/grapes.png'
fruitImages.watermelon.src = 'images/watermelon.webp'
fruitImages.orange.src = 'images/orange.png'

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

function drawBasket(){
    ctx.beginPath()
    ctx.rect(basketX, canvas.height - basketHeight, basketWidth, basketHeight)
    ctx.fillStyle = '#8B4513';
    ctx.fill();
    ctx.closePath();
}

function moveBasket(){
    if ( keys.left && basketX > 0){
        basketX -= basketSpeed
    }
    if (keys.right && basketX < canvas.width - basketWidth){
        basketX += basketSpeed
    }
}

function drawFruit(fruit){
    const img = fruitImages[fruit.type]
    ctx.drawImage(img, fruit.x - fruitRadius, fruit.y - fruitRadius, fruitRadius * 2, fruitRadius * 2)
}

function createFruit() {
    // x and y are initial coordinates of the fruit generated
    //this calculation ensures that the fruit's horizontal position (x) is a random value within the valid range where the entire fruit is visible on the canvas.
    const x = Math.random() * (canvas.width - fruitRadius * 2) + fruitRadius;
    //it ensures fruit appears to emerge from top of canvas edge
    const y = -fruitRadius;
    
    //Randomly selects a fruit type from the available fruits
    const types = Object.keys(fruitImages);
    //Math.random() generates a random number within 0 - 1 inclusive 
    const type = types[Math.floor(Math.random() * types.length)];
    fruits.push({ x, y, type });
}

function updateFruits(){
    for (i = 0; i < fruits.length; i++){
        const fruit = fruits[i]
        fruit.y += 4   // Increase the y coordinate of the fruit by 5, making it fall down the screen.

        // Check if the fruit collides with the basket
        if (fruit.y + fruitRadius > canvas.height - basketHeight && // Fruit's bottom edge is at or below the basket's top edge
            fruit.x > basketX &&                                    // Fruit's left edge is to the right of the basket's left edge
            fruit.x < basketX + basketWidth) {                      // Fruit's right edge is to the left of the basket's right edge
            fruits.splice(i, 1)                                     // Remove the fruit from the array
            score++;
        } else if (fruit.y - fruitRadius > canvas.height) {
            fruits.splice(i, 1)
            lives--;
        }
        
    }
}

function draw(){
    //Clears the entire canvas before redrawing the frame, i.e, it prevents drawing over the previous frame, ensuring that moving 
    //objects (like fruits and the basket) do not leave a trail of their previous positions
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBasket()

    for (const fruit of fruits){
        drawFruit(fruit)
    }
    ctx.font = '22px Arial'
    ctx.fillStyle = '#000'
    ctx.fillText(`Score : ${score}`, 17, 30)
    ctx.fillText(`Lives : ${lives}`, canvas.width - 103, 30)

    if (lives > 0) {
        requestAnimationFrame(draw);
    } else {
        scoreCard.textContent = 'Your Score is : ' + score
        gameOver.style.display = 'block'

        if (score > highestScore){
            highestScore = score
            localStorage.setItem('highestScore', highestScore)
            highScoreCard.textContent = 'Highest Score is : ' + highestScore
        }
    }

    moveBasket()
    updateFruits()

    //it determines probability of a fruit getting created, in this case there is 2% chance of a fruit being created
    //Higher Probability:  0.1 means 10% chance of fruit getting created
    //Lower Probability: 0.01 means 1% chance of fruit getting created
    //Higher number will create more fruits and lower will create less
    if (Math.random() < .02){
        createFruit()
    }
}

function startGame(){
    fruits = []
    score = 0
    lives = 5
    scoreCard.textContent = 'Your Score is : '
    basketX = (canvas.width - basketWidth) / 2
    draw()
}
start.addEventListener('click', e => {
    gameStart.style.display = 'none' 
    canvas.style.display = 'block'
    startGame()
})

//Re-initializing all variables
restart.addEventListener('click', e => {
    gameOver.style.display = 'none'
    startGame()
    
})