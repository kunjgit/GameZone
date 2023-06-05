// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

const diceRoll = new Audio('./sounds/DiceRoll.mp3');
const gameOver = new Audio('./sounds/GameOver.mp3');

let scores, currentScore, activePlayer, playing;

// Game starts
const init = function () {
	scores = [0, 0];
	currentScore = 0;
	activePlayer = 0;
	playing = true;

	score0El.textContent = 0;
	score1El.textContent = 0;
	current0El.textContent = 0;
	current1El.textContent = 0;

	diceEl.classList.add('hidden');
	player0El.classList.remove('player--winner');
	player1El.classList.remove('player--winner');
	player0El.classList.add('player--active');
	player1El.classList.remove('player--active');
};
init();

// Switch player function
const switchPlayer = function () {
	document.getElementById(`current--${activePlayer}`).textContent = 0;
	currentScore = 0;
	activePlayer = activePlayer === 0 ? 1 : 0;
	player0El.classList.toggle('player--active');
	player1El.classList.toggle('player--active');
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
	if (playing) {
		// Generating a random number
		const dice = Math.trunc(Math.random() * 6) + 1;

		// Display dice
		diceRoll.play();
		diceEl.classList.remove('hidden');
		diceEl.src = `./images/dice-${dice}.png`;

		// Checking the condition for dice 1
		if (dice !== 1) {
			// Add dice to current score
			currentScore += dice;
			document.getElementById(
				`current--${activePlayer}`
			).textContent = currentScore;
		} else {
			// Switch to next player
			switchPlayer();
		}
	}
});

btnHold.addEventListener('click', function () {
	if (playing) {
		// Add current score to active player's score
		scores[activePlayer] += currentScore;

		document.getElementById(`score--${activePlayer}`).textContent =
			scores[activePlayer];

		// Checking player's score is >= 100
		if (scores[activePlayer] >= 100) {
			// Finally, Finish the game
			playing = false;
			diceEl.classList.add('hidden');
			gameOver.play();
			document
				.querySelector(`.player--${activePlayer}`)
				.classList.add('player--winner');
			document
				.querySelector(`.player--${activePlayer}`)
				.classList.remove('player--active');
		} else {
			// Switch to the next player
			switchPlayer();
		}
	}
});

btnNew.addEventListener('click', init);
