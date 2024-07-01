const grid = document.querySelector(".grid")
const doodler = document.createElement("div")

let doodlerLeftSpace = 50
let doodlerBottomSpace = 150
let startPoint = 150
let isGameOver = false

let platformCount = 5
let platforms = []

let enemys = []

let upTimerId
let downTimeId

let isJumping = true
let isGoingLeft = false
let isGoingRight = false

let leftTimerId
let rightTimeId

let score = 0


function createDoodler(){
    grid.appendChild(doodler)
    doodler.classList.add("doodler")
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + "px"
    doodler.style.bottom = doodlerBottomSpace + "px"
}

class Platform{
    constructor(newPlatformBottom){
        this.bottom = newPlatformBottom
        this.left = Math.random() * 315
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("platform")

        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"

        grid.appendChild(visual)
    }
}

class Enemy{
    constructor(newenemyBottom){
        this.bottom = newenemyBottom
        this.left = Math.random() * 315
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("enemy")

        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"

        grid.appendChild(visual)
    }
}

function createPlatforms(){
    for(let i=0;i < platformCount;i++){
        let platformGap = 600 / platformCount
        let newPlatformBottom = 100 + i * platformGap
        let newPlatform = new Platform(newPlatformBottom)

        platforms.push(newPlatform)
    }
}

function createEnemy(){
    for(let i=0;i < 5;i++){
        let enemyGap = 600 / 5
        let newenemyBottom = 5 + i * enemyGap
        let newEnemy = new Enemy(newenemyBottom)

        enemys.push(newEnemy)
    }
}


function movePlatforms(){
    if(doodlerBottomSpace > 200){
        platforms.forEach(platform => {
            platform.bottom -= 4
            
            let visual = platform.visual
            visual.style.bottom = platform.bottom + "px"

            if(platform.bottom < 10){
                let firstPlatform = platforms[0].visual
                firstPlatform.classList.remove("platform")
                platforms.shift()

                score++
                let newPlatform = new Platform(600)
                platforms.push(newPlatform)
            }

        })
    }
}

function moveEnemys(){
    if(doodlerBottomSpace > 200){
        enemys.forEach(enemy => {
            enemy.bottom -= 4
            
            let visual = enemy.visual
            visual.style.bottom = enemy.bottom + "px"

            if(enemy.bottom < 10){
                let firstEnemy = enemys[0].visual
                firstEnemy.classList.remove("enemy")
                enemys.shift()

                score--
                let newEnemys = new Enemy(1000)
                enemys.push(newEnemys)
            }

        })
    }
}

function jump(){
    clearInterval(downTimeId)
    isJumping = true
    upTimerId = setInterval(function(){
        doodlerBottomSpace += 20
        doodler.style.bottom = doodlerBottomSpace + "px"

        if(doodlerBottomSpace > startPoint + 200){
            fall()
        }
    },30)
}

function fall(){
    clearInterval(upTimerId)
    isJumping = false
    downTimeId = setInterval(function(){
        doodlerBottomSpace -= 5

        doodler.style.bottom = doodlerBottomSpace + "px"

        if(doodlerBottomSpace <= 0){
            gameOver()
        }

        platforms.forEach(platform => {
            if(doodlerBottomSpace >= platform.bottom && doodlerBottomSpace <= platform.bottom + 15 && doodlerLeftSpace+60 >= platform.left && doodlerLeftSpace <= platform.left + 85 && !isJumping){
                startPoint = doodlerBottomSpace
                jump()
            }
        })
    },30)
}

function display(){
    let gameoverMenu = `
        <audio autoplay>
            <source src="./assets/music/doraemon.mp3" type="audio/mpeg">
        </audio>
        <h2>Game Over!<h2>
        <p>Your Score: ${score}</p>
        <img class="gameOver" src="./assets/img/game over.png" alt="crying doraemon">
        <p class="play">Press f5 to play again!</p>
    `

    return gameoverMenu
}


function gameOver(){
    isGameOver = true
    while(grid.firstChild){
        grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = display()
    
    clearInterval(upTimerId)
    clearInterval(downTimeId)
    clearInterval(leftTimerId)
    clearInterval(rightTimeId)
}



function control(e){
    if(e.key === "ArrowLeft"){
        moveLeft()
    }
    else if(e.key === "ArrowRight"){
        moveRight()
    }
    else if(e.key === "ArrowUp"){
        moveStraight()
    }
}
function moveLeft(){
    isGoingLeft = true
    if(isGoingRight){
        clearInterval(rightTimeId)
        isGoingRight = false
    }
    leftTimerId = setInterval(function () {
        if(doodlerLeftSpace >= 0){
            doodlerLeftSpace-=5
            doodler.style.left = doodlerLeftSpace + "px"
        }
        else{
            moveRight()
        }
        
    },20)
}

function moveRight(){
    isGoingRight =  true
    if(isGoingLeft){
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    rightTimeId = setInterval(function () {
        if(doodlerLeftSpace <= 340){
            doodlerLeftSpace+=5
            doodler.style.left = doodlerLeftSpace + "px"
        }
        else{
            moveLeft()
        }
        
    },20)
}

function moveStraight(){
    isGoingLeft = false
    isGoingRight = false
    clearInterval(rightTimeId)
    clearInterval(leftTimerId)
}


function start(){
    document.getElementById("start").style.display = "none"
    document.getElementById("title").style.visibility = "hidden"

    if(!isGameOver){
        createPlatforms()
        createDoodler()
        createEnemy()
        setInterval(movePlatforms,30)
        setInterval(moveEnemys,30)
        jump()

        document.addEventListener('keyup',control)
    }
}

document.getElementById("start").addEventListener('click',start)

