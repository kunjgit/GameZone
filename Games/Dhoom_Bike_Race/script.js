score = 0;
res = true;
cross = true;

audio = new Audio('dhoom.mp3');
audiogo = new Audio('off.mp3');
setTimeout(() => {
    audio.play();
}, 1000);

document.onkeydown = function (e) {
    if (e.keyCode == 38) {
        dino = document.querySelector('.dino');
        dino.classList.add('animateDino');
        setTimeout(() => {
            dino.classList.remove('animateDino');
        }, 700);
        setInterval(() => {
            ct1 = parseInt(window.getComputedStyle(dino, null).getPropertyValue('top'));
            ct2 = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));
            c1 = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            c2 = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
            if ((ct2 - ct1) < 130 && (c1 - c2) < 200 && (c1 > c2)) {
                res = false;
                gameOver.style.visibility = 'visible';
                obstacle.classList.remove('obstacleAni');
                audiogo.play();
                audio.pause();
                setTimeout(() => {
                    audiogo.pause();
                }, 2000);
            }
        }, 100);
    }
    if (e.keyCode == 39) {
        dino = document.querySelector('.dino');
        dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        dino.style.left = dinoX + 100 + "px";
    }
    if (e.keyCode == 37) {
        dino = document.querySelector('.dino');
        dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        dino.style.left = (dinoX - 100) + "px";
        ctr1 = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        ctr2 = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
        if ((ctr1 - ctr2) < 200 && (ctr1 > ctr2)) {
            res = flase;
            gameOver.style.visibility = 'visible';
            obstacle.classList.remove('obstacleAni');
            audiogo.play();
            audio.pause();
            setTimeout(() => {
                audiogo.pause();
            }, 2000);
        }

    }
}

setInterval(() => {
    dino = document.querySelector('.dino');
    gameOver = document.querySelector('.gameOver');
    obstacle = document.querySelector('.obstacle');

    dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
    dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('top'));

    ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    offsetX = Math.abs(dx - ox);
    offsetY = Math.abs(dy - oy);
    console.log(offsetX, offsetY);

    if (offsetX < 80 && offsetY < 63) {
        gameOver.style.visibility = 'visible';
        obstacle.classList.remove('obstacleAni');
        audiogo.play();
        audio.pause();
        setTimeout(() => {
            audiogo.pause();
        }, 2000);
    }
    else if (offsetX < 82 && cross && res) {
        score += 1;
        updateScore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);
        setTimeout(() => {
            newDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            if (newDur > 3) {
                newDur = newDur - 0.1;
                obstacle.style.animationDuration = newDur + 's';
            }

        }, 500);

    }

}, 10);

function updateScore(score) {
    console.log("Your Score: " + score);
    scoreCont.innerHTML = "Your Score: " + score;
}