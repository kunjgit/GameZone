/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let playerImg = 'docs/assets/images/main_char_sprite.png'
let bulletImg = 'docs/assets/images/bullet.png';
let bossBulletImg = 'docs/assets/images/boss_bullets.png';
let bossBullet2Img = 'docs/assets/images/boss_bullets_vertical.png';




const player = new Player(canvas.width / 2, canvas.height / 2, 70, 50, 100, 5, ctx, playerImg, 'Ramiro', canvas);
const shot   = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 0);
const shot2  = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 1);
const shot3  = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 2);
const shot4  = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 3);
const shot5  = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 4);
const shot6  = new Shooting(player.x, player.y, player, canvas, bulletImg, 8, ctx, lastKeyPressed, 5);
const magazine = [shot, shot2, shot3, shot4, shot5, shot6];
const reload = new Reload(magazine, 2000, 5, ctx);
//const boss = new Boss(120, 120, 100, 100, 200, ctx, '../docs/assets/images/bossImage.png', shot, 'Boss')
const newGame = new Game(ctx, player, canvas, 5, 5, shot, magazine, reload);


document.getElementById("start-game-button").onclick = () => {
    let hideOnClick = document.getElementsByClassName("hide-on-click");
    for (let i = 0; i < hideOnClick.length; i++) {
        hideOnClick[i].style.display = "none";
    }
  document.getElementById('myForm').classList.remove("hidden")
/*     myForm.style.display = 'flex';
    myForm.style.margin = '0 auto'; */
}

document.getElementById('begin-game').onclick = () => {  

    gameStarted = true;
    newGame.start();
    document.getElementById('myForm').classList.add("hidden")

    let hideOnClick = document.getElementsByClassName("hide-on-click");    
    for (let i = 0; i < hideOnClick.length; i++) {
        hideOnClick[i].style.display = "none";
    }
    canvas.style.display = 'flex';
    canvas.style.margin = '0 auto'; 
    document.getElementById('myAudio').play();
}

document.getElementById("exit-button").onclick = () => {
    window.close();
}

document.getElementById("highscore-button").onclick = () => {
    location.href = "highscore.html"
}

document.getElementById('restart-button').onclick = () => {
    
    newGame.restart();
}

