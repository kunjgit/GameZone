const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  radius: 10,
  color: '#FF0000', // Initial color (red)
};

const obstacles = [];

let score = 0;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.beginPath();
    ctx.fillStyle = obstacle.color;
    obstacle.parts.forEach(part => {
      ctx.moveTo(obstacle.x + part.startAngle, obstacle.y);
      ctx.arc(obstacle.x, obstacle.y, obstacle.radius, part.startAngle, part.endAngle);
    });
    ctx.fill();
    ctx.closePath();
  });
}

function generateObstacle() {
  const colors = ['#00FF00', '#0000FF', '#FFFF00']; // Green, Blue, Yellow
  const radius = 50;
  const y = -radius;
  const x = canvas.width / 2;
  const partAngle = Math.PI / 3; // 60 degrees

  const obstacle = {
    x: x,
    y: y,
    radius: radius,
    color: colors[Math.floor(Math.random() * colors.length)],
    parts: []
  };

  for (let i = 0; i < 6; i++) {
    const startAngle = i * partAngle;
    const endAngle = (i + 1) * partAngle;
    obstacle.parts.push({ startAngle: startAngle, endAngle: endAngle });
  }

  obstacles.push(obstacle);
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.y += 2; // Adjust the speed of the obstacles' movement (increase to make it faster)
  });

  if (obstacles.length > 0 && obstacles[0].y - obstacles[0].radius > canvas.height) {
    // Remove the first obstacle from the array if it goes out of the canvas
    obstacles.shift();
    score++; // Increment the score when the ball passes the obstacle successfully
  }
}

function checkCollision() {
  obstacles.forEach(obstacle => {
    if (
      ball.y - ball.radius < obstacle.y &&
      ball.y + ball.radius > obstacle.y &&
      ball.color !== obstacle.color
    ) {
      // Ball collides with an obstacle of a different color
      resetGame();
    }
  });
}

function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function resetGame() {
  score = 0;
  ball.color = '#FF0000'; // Reset ball color to red
  ball.y = canvas.height - 50;
  obstacles.length = 0;
  generateObstacle(); // Push a new obstacle to start the game
}

function update() {
  updateObstacles();
  checkCollision();

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > 100) {
    generateObstacle();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObstacles();
  drawBall();
  drawScore();

  requestAnimationFrame(update);
}

document.addEventListener('keydown', function(event) {
  // Change the ball color on spacebar press
  if (event.code === 'Space') {
    if (ball.color === '#FF0000') ball.color = '#00FF00'; // Red to Green
    else if (ball.color === '#00FF00') ball.color = '#0000FF'; // Green to Blue
    else if (ball.color === '#0000FF') ball.color = '#FFFF00'; // Blue to Yellow
    else if (ball.color === '#FFFF00') ball.color = '#FF0000'; // Yellow to Red
  }
});

// Adjust canvas size on window resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

update();
