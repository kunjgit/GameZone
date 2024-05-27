// initialisation
let inputDir = { x: 0, y: 0 };
const musicSound = new Audio('image/musicdoralarge.mp3');
const movesound = new Audio('image/move.mp3');
const foodsound = new Audio('image/food.mp3');
const gameover = new Audio('image/gameover.mp3');
const chuaa = new Audio('image/chuaaa.mp3');
const tasty = new Audio('image/tasty.m4a');

let score = 0;
let speed = 4.9;
let health = 5.0;
let lastPaintTime = 0.0;
let snakeArr = [{ x: 11, y: 11 }];
food = { x: 11, y: 5 };

mouse1 = { x: 13, y: 8 };//immovable mouse
mouse2 = { x: 9, y: 7 };
mouse3 = { x: 4, y: 4 };
mouse4 = { x: 10, y: 14 };
mouse5 = { x: 9, y: 13 };



let topp = false;
let down = false;
let left = false;
let right = false;

let safter = 0;

let aa = 1;
let bb = 16;
let a = 2;
b = 17;





//my functions
function mousedead() {

    //display mouse
    mouseElement = document.createElement('div');
    mouseElement.style.gridRowStart = mouse1.y;
    mouseElement.style.gridColumnStart = mouse1.x;
    mouseElement.classList.add('mouse');
    board.appendChild(mouseElement);

    //display mouse
    mouseElement = document.createElement('div');
    mouseElement.style.gridRowStart = mouse2.y;
    mouseElement.style.gridColumnStart = mouse2.x;
    mouseElement.classList.add('mouse');
    board.appendChild(mouseElement);

    //display mouse
    mouseElement = document.createElement('div');
    mouseElement.style.gridRowStart = mouse3.y;
    mouseElement.style.gridColumnStart = mouse3.x;
    mouseElement.classList.add('mouse');
    board.appendChild(mouseElement);

    //display mouse
    mouseElement = document.createElement('div');
    mouseElement.style.gridRowStart = mouse4.y;
    mouseElement.style.gridColumnStart = mouse4.x;
    mouseElement.classList.add('mouse');
    board.appendChild(mouseElement);

    //display mouse
    mouseElement = document.createElement('div');
    mouseElement.style.gridRowStart = mouse5.y;
    mouseElement.style.gridColumnStart = mouse5.x;
    mouseElement.classList.add('mouse');
    board.appendChild(mouseElement);

    if ((snakeArr[0].y === mouse1.y && snakeArr[0].x === mouse1.x) || (snakeArr[0].y === mouse2.y && snakeArr[0].x === mouse2.x) || (snakeArr[0].y === mouse3.y && snakeArr[0].x === mouse3.x) || snakeArr[0].y === mouse4.y && snakeArr[0].x === mouse4.x||(snakeArr[0].y === mouse5.y && snakeArr[0].x === mouse5.x)) {
        health--;
        chuaa.play();
        // incerease speed
        if(speed<8){
            speed = speed+0.1
        }
        else if(speed >= 8 && speed < 10){
            speed = speed + 0.09;
        }
        else if(speed >= 10 && speed < 11.6){
            speed =speed + 0.068;
        }
        else if(speed >= 11.6){
            speed = speed +0.032;
        }
    }

}

function healthplus(staken) {
    if (staken != safter)
        if (score % 8 === 0 && score != 0) {
            health = health + 1;
        }
        else {
            return;
        }
    safter = staken;
}


//functions

// main function
function main(ctime) {

    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

//if you bump on mouse or over the boundry
function isCollide(snake) {

    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    if (health == 0) {
        return true;
    }
}

// gameEngine function
function gameEngine() {

    // if collided 
    if (isCollide(snakeArr)) {
        gameover.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert('Game Over. Press any key to play again');
        snakeArr = [{ x: 4, y: 17 }];
        musicSound.play();
        score = 0;
        scorebox.innerHTML = "Score: " + score;
        health = 5;
        healthbox.innerHTML = "Health: " + health;
        speed = 4.5;
        snakeElement.style.rotate = '360deg';
        topp = false;
        down = false;
        left = false;
        right = false;
        healthbox.style.color = 'rgb(0, 255, 0)';
        snakeElement.classList.remove('can');
    }



    // if dora has eaten doracake, increment score and regenerate food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodsound.play();
        tasty.play();

        // score
        score++;

        // incerease speed
        if(speed<8){
            speed = speed+0.1
        }
        else if(speed >= 8 && speed < 10){
            speed = speed + 0.09;
        }
        else if(speed >= 10 && speed < 11.6){
            speed =speed + 0.068;
        }
        else if(speed >= 11.6){
            speed = speed +0.032;
        }

        scorebox.innerHTML = "Score: " + score;
        // hiscore
        if (score > hiscore) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscorebox.innerHTML = "Hi Score: " + hiscoreval;
        }
        //regenfood
        food = { x: Math.round(a + (bb - aa) * Math.random()), y: Math.round(aa + (bb - aa) * Math.random()) };

        mouse1 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        mouse2 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        mouse3 = { x: Math.round(a + (b - aa) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        mouse4 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        mouse5 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        //regenmouse

        if (food.x === mouse4.x && food.y === mouse4.y) {
            mouse4 = { x: (food.x + 2), y: 14 };
        }

        if (food.x === mouse3.x && food.y === mouse3.y) {
            mouse3 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }

        if (food.x === mouse2.x && food.y === mouse2.y) {
            mouse2 = { x: 10, y: (food.y+1) };
        }

        if (food.x === mouse1.x && food.y === mouse1.y) {
            mouse1 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }

        if (food.x === mouse5.x && food.y === mouse5.y) {
            mouse5 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }

    }

    //missing for loop for body increment 
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    // clean board except doraemon
    const board = document.getElementById('board');
    const children = Array.from(board.children);

    const childrenToClear = children.filter(child => child.id !== 'dora' && child.id !== 'heartid');

    childrenToClear.forEach(child => child.remove());


    //display snake
    snakeArr.forEach((e, index) => {
        snakeElement = document.getElementById('dora');
        // console.log(snakeElement)
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
    })


    //    display food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);



    //display mouse
    mousedead();

    // rotate ///////
    if (topp === true) {
        snakeElement.style.rotate = '270deg';
    }
    if (down === true) {
        snakeElement.style.rotate = '90deg';
    }
    if (left === true) {
        snakeElement.style.rotate = '180deg';
    }
    if (right) {
        snakeElement.style.rotate = '360deg';
    }


    // Change healthtext color
    if (health === 3) {
        healthbox.style.color = 'rgb(255, 150, 0)'
    }
    if (health <= 2) {
        healthbox.style.color = 'rgb(255, 0, 0)';
    }


    // increase health on eating per 8 doracakes
    healthplus(score);
    healthbox.innerHTML = "Health: " + health;


    // increasing animation speed
    if(speed>=5){
        snakeElement.style.animation= 'walky 1s steps(6) infinite';
    }
    if(speed>=10){
        snakeElement.style.animation= 'walky 0.9s steps(6) infinite';
    }


}   //End of gameEngine()


// main logic
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscorebox.innerHTML = "Hi Score: " + hiscoreval;
}

setTimeout(() => {
    alert("Controls:\nUp Aroow\nDown Arrow\nLeft Arrow\nRight Arrow");
}, 500);
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {

    topp = false;
    down = false;
    left = false;
    right = false;
    snakeElement.classList.add('can');
    inputDir = { x: 0, y: 1 } //start the game
    switch (e.key) {
        case "ArrowUp":
            console.log("up");
            inputDir.x = 0;
            inputDir.y = -1;
            topp = true;
            if(score>5){
                mouse5 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            }
            break;
        case "ArrowDown":
            console.log("down");
            inputDir.x = 0;
            inputDir.y = 1;
            down = true;
            if(score>15){
                mouse3 = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            }
            break;
        case "ArrowLeft":
            console.log("left");
            inputDir.x = -1;
            inputDir.y = 0;
            left = true;
            break;
        case "ArrowRight":
            console.log("right");
            inputDir.x = 1;
            inputDir.y = 0;
            right = true;
            break;
    }
    musicSound.play();
});

