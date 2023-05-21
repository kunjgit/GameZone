score = 0;
cross = true;


window.addEventListener('keydown' , checkkey) 
setTimeout(() => {
    audio.play();
}, 1000);

function checkkey(e){
console.log(e.key);
if(e.key == 'ArrowUp'){
player = document.querySelector('.player');
player.classList.add('animatePlayer');
setTimeout(() => {
    player.classList.remove('animatePlayer')
}, 700);
}
if(e.key == 'ArrowRight'){
    player = document.querySelector('.player');
    playerX = parseInt(window.getComputedStyle(player, null).getPropertyValue('left'));
    player.style.left = playerX + 112 +"px";
    }
if(e.key == 'ArrowLeft'){
        player = document.querySelector('.player');
        playerX = parseInt(window.getComputedStyle(player, null).getPropertyValue('left'));
        player.style.left = (playerX - 112) +"px";
        }
}
setInterval(() => {
    player = document.querySelector('.player');
    gameOver = document.querySelector('.gameOver');
    ghost = document.querySelector('.ghost');

    px = parseInt(window.getComputedStyle(player, null).getPropertyValue('left'));
    py = parseInt(window.getComputedStyle(player, null).getPropertyValue('top'));

    gx = parseInt(window.getComputedStyle(ghost, null).getPropertyValue('left'));
    gy = parseInt(window.getComputedStyle(ghost, null).getPropertyValue('top'));
    offsetX = Math.abs(px-gx);
    offsetY = Math.abs(py-gy);
    //console.log(offsetX, offsetY)
    if(offsetX < 73 && offsetY < 52){
        gameOver.style.visibility = 'visible';
        ghost.classList.remove('ghostAni')
        audiogo.play();
        setTimeout(() => {
            audiogo.pause();
            audio.pause();
        }, 1000);


    }
    else if(offsetX< 145 && cross){
        score+=1;
        updateScore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);
        setTimeout(() => {
            aniDur = parseFloat(window.getComputedStyle(ghost, null).getPropertyValue('animation-duration'));
        newDur = aniDur - 0.2;
        ghost.style.animationDuration = newDur + 's';
            
        }, 500);
        
    }
}, 10);
function updateScore(score){
    scoreCont.innerHTML = "Your Score: " + score
}