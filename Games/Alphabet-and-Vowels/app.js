const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const vowels = 'AEIOU';
let score = 0;
let target = 'vowel';

document.addEventListener('DOMContentLoaded', () => {
    const alphabetGrid = document.getElementById('alphabetGrid');
    const feedback = document.getElementById('feedback');
    const instruction = document.getElementById('instruction');
    const resetButton = document.getElementById('resetButton');

    const shuffleArray = array => array.sort(() => Math.random() - 0.5);

    const generateButtons = () => {
        shuffleArray(alphabet).forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => checkLetter(letter, button));
            alphabetGrid.appendChild(button);
        });
    };

    const checkLetter = (letter, button) => {
        if ((target === 'vowel' && vowels.includes(letter)) || 
            (target === 'consonant' && !vowels.includes(letter))) {
            button.classList.add('correct');
            score++;
            feedback.textContent = 'Correct!';
        } else {
            button.classList.add('wrong');
            feedback.textContent = 'Try again!';
        }

        button.disabled = true;
        
        if (score === 5) {
            target = 'consonant';
            instruction.textContent = 'Now click on all the consonants!';
            score = 0;
            feedback.textContent = '';
        }
    };

    const resetGame = () => {
        alphabetGrid.innerHTML = '';
        feedback.textContent = '';
        instruction.textContent = 'Click on all the vowels!';
        score = 0;
        target = 'vowel';
        generateButtons();
    };

    resetButton.addEventListener('click', resetGame);

    generateButtons();
});
