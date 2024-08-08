const CLIENT_WIDTH = document.documentElement.clientWidth;
const CLIENT_HEIGHT = document.documentElement.clientHeight;

// const fight = new Audio('./assets/sound/fight.mp3');
// fight.play();


const enemy = document.getElementById('enemy');
const player = document.getElementById('player');
const popup = document.getElementById('popup');
const popupStatus = document.getElementById('popup-status');
const specialMove = 30;
let playerLife = document.querySelector('#playerLife');
let enemyLife = document.querySelector('#enemyLife');

// const audio = new Audio('./assets/sound/fight.mp3');
// audio.play();

let isGameOver = false;

let playerLifeVal = 100;
let enemyLifeVal = 100;

let currPos = 0;
let i = 0;

const gameOverOverlay = (playerNo)=> {
    if(playerNo) {
        popupStatus.innerText = 'You Win';
    } else{
        popupStatus.innerText = 'You Lost';

    }
    popup.classList.remove('d-none')
}

const enemyMoves = [
    { img: 1, width: 300, height: 500, mirror: true},
    { img: 2, width: 550, height: 600, mirror: false},
    { img: 3, width: 600, height: 600, mirror: false},
    { img: 4, width: 500, height: 600, mirror: false},
];
const playerMoves = [
    { img: 1, width: 300, height: 500, mirror: false},
    { img: 2, width: 300, height: 500, mirror: false},
    { img: 3, width: 300, height: 500, mirror: false},
    { img: 4, width: 300, height: 600, mirror: false},
    { img: 5, width: 800, height: 600, mirror: false},
    { img: 6, width: 500, height: 600, mirror: false},
];

const changeEnemyMove = (move)=> {
    if(!enemyMoves[move%enemyMoves.length].mirror) {
        enemy.style.webkitTransform = 'scaleX(0)';
        enemy.style.transform = 'scaleX(1)';
        // console.log(enemy.style.transform)
    } else {
        enemy.style.webkitTransform = 'scaleX(-1)';
        enemy.style.transform = 'scaleX(-1)';
    }
    enemy.src = `./assets/ninjas-imgs/2/${enemyMoves[move%enemyMoves.length].img}.gif`;
    enemy.style.width = `${enemyMoves[move%enemyMoves.length].width}px`;
    enemy.style.height = `${enemyMoves[move%enemyMoves.length].height}px`;
}

const chengePlayerImg = (img)=> {
    // console.log(img)
    player.src = `./assets/ninjas-imgs/1/${playerMoves[img%playerMoves.length].img}.gif`;
    player.style.width = `${playerMoves[img%playerMoves.length].width}px`;
    player.style.height = `${playerMoves[img%playerMoves.length].height}px`;
}

const changeEnemyScore = (val)=> {

    if ((currPos >= CLIENT_WIDTH-500 || currPos < CLIENT_WIDTH-800) && val < specialMove) {
        // console.log(player.style.left)
        return;
    }

    enemyLifeVal = (+enemyLifeVal - val > 0)? (+enemyLifeVal - val): 0;

    // console.log(enemyLifeVal)
    if(+enemyLifeVal == 0) {
        enemyLife.style.setProperty('--width', '0%');
        isGameOver = true;
        gameOverOverlay(1);
    } else {
        enemyLife.style.setProperty('--width', `${enemyLifeVal}%`);
    }
}
const changePlayerScore = (val)=> {

    if ((currPos >= CLIENT_WIDTH-500 || currPos < CLIENT_WIDTH-800) && val < specialMove) {
        console.log(player.style.left)
        return;
    }

    playerLifeVal = (+playerLifeVal - val > 0)? (+playerLifeVal - val): 0;

    console.log(playerLifeVal)
    if(+playerLifeVal == 0) {
        playerLife.style.setProperty('--width', '0%');
        isGameOver = true;
        gameOverOverlay(0);
    } else {
        playerLife.style.setProperty('--width', `${playerLifeVal}%`);
    }
}

const getPlayerMove=()=> {
    let x = Math.floor(Math.random()*100);
    return (x%2)? 1: 5;
}
const getEnemyMove=()=> {
    let x = Math.floor(Math.random()*100);
    return (x%2)? 3: 2;
}

const changePlayerMove = (key)=> {
    console.log(key)
    if(key == 'ArrowRight' || key == 'keyD') {
        player.style.webkitTransform = 'scaleX(1)';
        player.style.transform = 'scaleX(1)';
        currPos += 50;
    } else if(key == 'ArrowLeft' || key == 'keyA') {
        player.style.webkitTransform = 'scaleX(-1)';
        player.style.transform = 'scaleX(-1)';
        currPos -= 50;
    } else if(key == 'Space') {
        chengePlayerImg(3);
        setTimeout(()=> {
            chengePlayerImg(4);
        }, 500);
        setTimeout(()=> {
            chengePlayerImg(2);
            changeEnemyScore(specialMove);
        }, 1500);

    } else if(key == 'Enter') {
        // chengePlayerImg(Math.floor(Math.random()*100));
        chengePlayerImg(getPlayerMove());
        setTimeout(()=> {
            chengePlayerImg(2);
            changeEnemyScore(10);
        }, 1500);
    }


    if(currPos < CLIENT_WIDTH-500 && currPos >= 0) {
        player.style.left = `${currPos}px`;
    } else if(currPos < 0){
        currPos = 0;
    }  else if(currPos > CLIENT_WIDTH-500){
        currPos = CLIENT_WIDTH-500;
    }
    // enemy.src = `./assets/ninjas-imgs/2/${enemyMoves[move%enemyMoves.length].img}.gif`;
    // enemy.style.width = `${enemyMoves[move%enemyMoves.length].width}px`;
    // enemy.style.height = `${enemyMoves[move%enemyMoves.length].height}px`;
}

setInterval(()=> {
    // changeEnemyMove(i++);
}, 2000);

setTimeout(()=> {
    chengePlayerImg(2);
}, 1500);

let enemyRestTime = 0;

const autoEnemyMoves = ()=>{

    if(enemyLifeVal == 0) {
        changeEnemyMove(1);
        return;
    }

    if ((currPos < CLIENT_WIDTH-450 && currPos >= CLIENT_WIDTH-800)) {

        // console.log("Attack");
        if(enemyRestTime%100 == 0) {
            changeEnemyMove(getEnemyMove());
            changePlayerScore(20);
            enemyRestTime++;
        }
        enemyRestTime++;
    } else {
        // console.log("No Attk");
        if(enemy.src != `${currPath}assets/ninjas-imgs/2/1.gif`) {
            // changeEnemyMove(3);
            changeEnemyMove(0);
            enemyRestTime++;
        }
    }

    requestAnimationFrame(autoEnemyMoves);
};
    
requestAnimationFrame(autoEnemyMoves);
    
const scripts = document.getElementsByTagName("script"),
src = scripts[0].src;
const currPath = src.slice(0, 22);
console.log(currPath)

const body = document.getElementById('body');

body.addEventListener('keydown', (e)=> {
    if(!isGameOver) {
        changePlayerMove(e.code);
    }
})

// body.addEventListener('DOMContentLoaded', (e)=> {
//     console.log("fdg")
// })
// const startFight = async()=> {
//     

// }
// startFight();