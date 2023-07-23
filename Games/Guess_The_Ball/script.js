const glassElements = document.querySelectorAll('.glass');
const block = document.querySelector('.block');
const body = document.querySelector('body');
const h2 = document.querySelector('h2')
let canGuess = true;
ballGlass = Math.floor(Math.random() * 3) + 1;
if(ballGlass === 1) block.style.left = '125px'; 
else if(ballGlass === 2) block.style.left = '326px';
else block.style.left = '526px';

function liftGlass(glass) {
	glass.style.animation = 'lift 0.8s ease-in-out';
	setTimeout(() => {
		glass.style.animation = '';
	}, 800);
}

function resetGame() {
	ballGlass = Math.floor(Math.random() * 3) + 1;
	if(ballGlass === 1) block.style.left = '125px'; 
	else if(ballGlass === 2) block.style.left = '326px';
	else block.style.left = '526px';  
	canGuess = true;
	h2.textContent = 'Guess the ball.'
	body.style.backgroundColor = 'white';
	glassElements.forEach((glass) => {
		glass.classList.remove('ball');
		glass.style.pointerEvents = 'auto';
	});
}

function checkGlass(selectedGlass) {
	ballGlass = Math.floor(Math.random() * 3) + 1;
	if(ballGlass === 1) block.style.left = '125px'; 
	else if(ballGlass === 2) block.style.left = '326px';
	else block.style.left = '526px';

	if (!canGuess) return;

	liftGlass(glassElements[selectedGlass - 1]);

	setTimeout(() => {
		if (selectedGlass === ballGlass) {
			h2.textContent = 'Hurrah! Ball found.'
			glassElements[selectedGlass - 1].classList.add('ball');
			body.style.backgroundImage = 'radial-gradient(white, rgb(107, 255, 107))';
		} else {
			h2.textContent = 'OOPS! Ball not found. Try again'
			body.style.backgroundImage = 'radial-gradient(white, rgb(255, 86, 86))';
		}

		canGuess = false;
		
		setTimeout(() => {
		resetGame();
		}, 800);
	}, 800);
}
