let ball = document.querySelector('.ball');
let paddleLeft = document.querySelector('.paddle-left');
let paddleRight = document.querySelector('.paddle-right');
let player1Score = document.querySelector('#player1-score');
let player2Score = document.querySelector('#player2-score');

let ballSpeedX = 4;
let ballSpeedY = 4;
let paddleSpeed = 8;

function moveBall() {
	ball.style.top = `${parseInt(ball.style.top) + ballSpeedY}px`;
	ball.style.left = `${parseInt(ball.style.left) + ballSpeedX}px`;

	if (parseInt(ball.style.top) <= 0 || parseInt(ball.style.top) >= 580) {
		ballSpeedY *= -1;
	}

	if (parseInt(ball.style.left) <= 0 || parseInt(ball.style.left) >= 780) {
		ballSpeedX *= -1;
	}
    if (parseInt(ball.style.left) <= 20 && parseInt(ball.style.top) >= parseInt(paddleLeft.style.top) && parseInt(ball.style.top) <= parseInt(paddleLeft.style.top) + 100) {
		ballSpeedX *= -1;
	}

	if (parseInt(ball.style.left) >= 760 && parseInt(ball.style.top) >= parseInt(paddleRight.style.top) && parseInt(ball.style.top) <= parseInt(paddleRight.style.top) + 100) {
		ballSpeedX *= -1;
	}
    if (parseInt(ball.style.left) <= 0) {
		player2Score.textContent = parseInt(player2Score.textContent) + 1;
		resetBall();
	}

	if (parseInt(ball.style.left) >= 780) {
		player1Score.textContent = parseInt(player1Score.textContent) + 1;
		resetBall();
	}
}
function movePaddles(event) {
	if (event.key === 'w') {
		paddleLeft.style.top = `${parseInt(paddleLeft.style.top) - paddleSpeed}px`;
	}

	if (event.key === 's') {
		paddleLeft.style.top = `${parseInt(paddleLeft.style.top) + paddleSpeed}px`;
	}
    if (event.key === 'ArrowUp') {
		paddleRight.style.top = `${parseInt(paddleRight.style.top) - paddleSpeed}px`;
	}

	if (event.key === 'ArrowDown') {
		paddleRight.style.top = `${parseInt(paddleRight.style.top) + paddleSpeed}px`;
	}
}
function resetBall() {
	ball.style.top = '50%';
	ball.style.left = '50%';
	ballSpeedX = 4;
	ballSpeedY = 4;
}

document.addEventListener('keydown', movePaddles);
setInterval(moveBall, 16);
