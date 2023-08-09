const ball = document.querySelector(".ball")
const obstacle = document.querySelector(".obstacle")
const gameOver = document.querySelector(".gameover")


ball.addEventListener('click', function () {
  anime({
    targets: '.ball',
    bottom: [100,280],
    duration: 400,
    direction: 'alternate',
    easing: 'easeOutSine'
  });
  anime({
    targets: '.ball',
    rotateZ: [0, 180],
    duration: 400,
    easing: 'easeOutSine'
  });
})

let animation = anime({
  targets: '.obstacle',
  autoplay: false,
  left: -100,
  duration: 2000,
  loop: true,
  easing: 'linear'
});


let points = anime({
  targets: '.points',
  autoplay: false,
  innerHTML: [0, 6000],
  duration: 600000,
  easing: 'linear',
  round: 1
});


document.querySelector('.pause').addEventListener('click', function () {
  animation.pause();
  points.pause();
})

document.querySelector('.play').addEventListener('click', function () {
  animation.play();
  gameOver.style.display = "none";
  points.play();
})

document.querySelector('.restart').addEventListener('click', function () {
  animation.restart();
  gameOver.style.display = "none";
  points.restart();
})

function isTouching() {
  var ballL = ball.offsetLeft;
  var ballT = ball.offsetTop;
  var ballR = ball.offsetLeft + ball.offsetWidth;
  var ballB = ball.offsetTop + ball.offsetWidth;

  var obstacleL = obstacle.offsetLeft;
  var obstacleT = obstacle.offsetTop;
  var obstacleR = obstacle.offsetLeft + obstacle.offsetWidth;
  var obstacleB = obstacle.offsetTop + obstacle.offsetWidth;


  if ((ballR >= obstacleL && ballL <= obstacleR) && ballB >= obstacleT) {
    gameOver.style.display = "block";
    document.querySelector('.pause').click();
  }
}

window.setInterval(function () {
  isTouching();
}, 10);