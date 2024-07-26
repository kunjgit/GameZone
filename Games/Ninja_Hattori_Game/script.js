score = 0;
cross = true;
audio = new Audio('ninja.MP3');
// audio.loop=true;
setTimeout(() => {
    audio.play()
}, 10);
document.onkeydown = function (e) {
    console.log("Key code is: ", e.keyCode)
    if (e.keyCode == 38) {
        ninja = document.querySelector('.ninja');
        ninja.classList.add('animateDino');
        setTimeout(() => {
            ninja.classList.remove('animateDino')
        }, 700);
    }
    if (e.keyCode == 39) {
        ninja = document.querySelector('.ninja');
        ninjaX = parseInt(window.getComputedStyle(ninja, null).getPropertyValue('left'));
        ninja.style.left = ninjaX + 112 + "px";
    }
    if (e.keyCode == 37) {
        ninja = document.querySelector('.ninja');
        ninjaX = parseInt(window.getComputedStyle(ninja, null).getPropertyValue('left'));
        ninja.style.left = (ninjaX - 112) + "px";
    }
}

setInterval(() => {
    ninja = document.querySelector('.ninja');
    gameOver = document.querySelector('.gameOver');
    obstacle = document.querySelector('.obstacle');

    dx = parseInt(window.getComputedStyle(ninja, null).getPropertyValue('left'));
    dy = parseInt(window.getComputedStyle(ninja, null).getPropertyValue('top'));

    ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    offsetX = Math.abs(dx - ox);
    offsetY = Math.abs(dy - oy);
    // console.log(offsetX, offsetY)
    if (offsetX < 73 && offsetY < 52) {
        gameOver.innerHTML = "Oops! Better Luck Next Time";
        gameOvery = document.querySelector('.gameOvery');
        container = document.querySelector('.gameContainer');
        gameOvery.style.visibility = 'visible';
        container.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(nhome.jpg)';
        obstacle.classList.remove('obstacleAni');
        setTimeout(() => {
            audio.pause();
            // aud.pause();
        }, 1000);
    }
    else if (offsetX < 145 && cross) {
        score += 1;
        updateScore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);
        setTimeout(() => {
            aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            newDur = aniDur - 0.1;
            obstacle.style.animationDuration = newDur + 's';
            console.log('New animation duration: ', newDur)
        }, 500);

    }

}, 10);

function updateScore(score) {
    scoreCont.innerHTML = "Your Score: " + score
}