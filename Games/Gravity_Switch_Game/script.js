const gameContainer = document.querySelector('.game-container');
const player = document.querySelector('.player');
const platforms = document.querySelector('.platforms');

let gravityDirection = 1;
let playerY = 50;
let playerSpeed = 4;

function movePlayer() {
	playerY += playerSpeed * gravityDirection;
	player.style.top = `${playerY}px`;
}

function switchGravity() {
	gravityDirection *= -1;
}

document.addEventListener('keydown', (event) => {
	if (event.keyCode === 32) { // Space bar
		switchGravity();
	}
});
setInterval(movePlayer, 16);
