const body = document.getElementById('game-body');
const player = document.getElementById('player-rocket-shooter');
const ststusBox = document.getElementById('game-status');
const enemyes = document.getElementsByClassName('enemy-rockets');

const audio = new Audio('./sounds/shooting.mp3');
audio.play();

const CLIENT_WIDTH = document.documentElement.clientWidth;
const CLIENT_HEIGHT = document.documentElement.clientHeight;
const PLAYER_BULLET = `<img src="./assets/bullet.png" class="position-absolute bullet-animation">`;

let isGameOver = false;
let playerPos = 100/2;
let enemyePos = new Array(10);
let bullets = [];

const isValidPosition = (val)=> {
    if(val+10 > 100) {
        playerPos = 100-10;
    }
    if(val-10 < 0) {
        playerPos = 10;
    }
}
const removeBullets = async()=> {
    setTimeout(()=> {

        bullets.pop();
    },5000);
}

body.addEventListener('keydown', (e)=> {
    // tmp.innerText = e.code;
    // console.log(e)
    isValidPosition(playerPos);

    if ((e.code == 'ArrowLeft' || e.code == 'KeyA') && !isGameOver) {
        player.style.left = `${playerPos-=5}%`;
    }
    if ((e.code == 'ArrowRight' || e.code == 'KeyD') && !isGameOver) {
        player.style.left = `${playerPos+=5}%`;
    }
});

let bulletsTimer = setInterval(()=> {
    if(isGameOver) {
        clearInterval(bulletsTimer);
    }
    let bullet = document.createElement('img');
    bullet.classList.add('bullet-animation');
    bullet.classList.add('position-absolute');
    bullet.src = './assets/bullet.png';
    bullet.style.left = `${playerPos}%`
    body.appendChild(bullet);

    bullets.push(bullet);
    // removeBullets();
    
    // console.log(bullets[0].style.left)
    audio.play();

}, 200);

const gameOver = ()=> {
    isGameOver = true;
    clearInterval(bulletsTimer);
    score.innerText = tmp.innerText;
    ststusBox.classList.toggle('d-none')
}

let attack = setInterval(()=> {
    if(isGameOver) {
        clearInterval(attack);
    }
    let enmyCnt = 0;
    for (let i = 0; i < enemyes.length; i++) {
        // isOver = false;
        (enemyePos[i] != -1)? enmyCnt : enmyCnt++;
        enemyePos[i] = (enemyePos[i] != -1)? Math.round((Math.random() * 100)%90): -1;
        enemyes[i].style.left = `${enemyePos[i]}%`;
        enemyes[i].style.top = `${(Math.random() * 100)%20}%`;

        if(enemyePos[i]-10 <= playerPos && playerPos >= enemyePos[i]+10) {
            enemyes[i].src = './assets/blast.gif';
            // setTimeout(()=> {
            enemyePos[i] = -1;
            enemyes[i].style.opacity = 0;

            // }, 2000);
        }
        console.log('Enemy L:' + enemyePos[i] + '  Player:'+playerPos)
        tmp.innerText = enmyCnt;
        if(enmyCnt == 10) {
            console.log('GAME OVER');
            clearInterval(attack);
            gameOver()
            return;
        }
    }
    
}, 2000);