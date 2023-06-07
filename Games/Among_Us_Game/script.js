var loadingScreen = document.querySelector('#loading img');
var playbtn = document.querySelector('#overlay ion-icon');
var loadingOverlay = document.querySelector('#overlay');
var bgmusic = document.querySelector('#audio1 audio');
var killingAudio = document.querySelector('#audio2 audio');

playbtn.addEventListener('click', function (dets) {
    setTimeout(function () {
        loadingScreen.style.opacity = '0';
        bgmusic.play();
        loadingOverlay.style.display = 'none';
    }, 500);
    setTimeout(function () {
        loadingScreen.style.display = 'none';
    }, 1000);
});

var posX = 10;
var posY = 260;

var impostor = document.querySelector('#impostor img');
var crewmate = document.querySelector('#crewmate img');
var overlay = document.querySelector('.overlay');
var killbtn = document.querySelector('#kill img');
var distanceX;
var distanceY;
var distance;
var killDistance = 140;
var killState = 0;

var anim = document.querySelector('#animation img');

window.addEventListener('keydown', function (dets) {
    if (dets.keyCode === 38) { //up
        if (posY > 0) {
            posY -= 20;
            impostor.style.top = `${posY}px`;
        }
    }
    else if (dets.keyCode === 40) { //down
        if (posY < document.body.getBoundingClientRect().bottom - 100 - 20) {
            posY += 20;
            impostor.style.top = `${posY}px`;
        }
    }
    else if (dets.keyCode === 37) { //left
        if (posX >= 0) {
            posX -= 20;
            impostor.style.left = `${posX}px`;
        }
    }
    else if (dets.keyCode === 39) { //right
        posX += 20;
        impostor.style.left = `${posX}px`;
    }

    distanceX = crewmate.getBoundingClientRect().left - impostor.getBoundingClientRect().left;
    distanceY = crewmate.getBoundingClientRect().top - impostor.getBoundingClientRect().top;
    distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance <= killDistance) {
        overlay.style.display = 'none';
        impostor.setAttribute('src', "./assets/images/Impostor_Killing.png");
        killCrew();
    }
    else {
        impostor.setAttribute('src', "./assets/images/Impostor_normalWalk.png");
        overlay.style.display = 'initial';
    }

    if (posX > document.body.getBoundingClientRect().width) {
        bgmusic.pause();
        this.alert("The End!");
    }
});

function killCrew() {
    killbtn.addEventListener('click', function () {
        impostor.style.left = `590px`;
        impostor.style.top = `440px`;
        crewmate.setAttribute('src', "./assets/images/Crewmate_killed.png");
        crewmate.style.top = `500px`;
        posX = 590;
        posY = 440;
        setTimeout(function () {
            impostor.setAttribute('src', "./assets/images/Impostor_normalWalk.png");
        }, 100);
        killDistance = -1;
        anim.style.height = 60 + '%';
        anim.style.opacity = 1;
        bgmusic.pause();
        killingAudio.currentTime = '1';
        killingAudio.play();
        setTimeout(function () {
            anim.style.height = 0;
            anim.style.opacity = 0;
            killingAudio.pause();
        }, 2500);
        setTimeout(function(){
            bgmusic.play();
        }, 3250);
        setTimeout(function () {
            crewmate.style.display = 'none';
        }, 8000);
    });
}