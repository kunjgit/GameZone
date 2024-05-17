document.addEventListener('DOMContentLoaded', () => {
    const lettersContainer = document.getElementById('letters-container');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    let score = 0;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function generateLetters() {
        lettersContainer.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const letter = document.createElement('div');
            letter.classList.add('letter');
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            letter.textContent = randomLetter;
            letter.addEventListener('click', () => {
                if (randomLetter === 'A') {
                    score++;
                    scoreElement.textContent = score;
                    letter.style.visibility = 'hidden';
                }
            });
            lettersContainer.appendChild(letter);
        }
    }

    startButton.addEventListener('click', () => {
        score = 0;
        scoreElement.textContent = score;
        generateLetters();
    });
});
