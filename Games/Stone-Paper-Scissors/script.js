document.addEventListener('DOMContentLoaded', () => {
    const choices = ['rock', 'paper', 'scissors'];
    const buttons = document.querySelectorAll('.fancy');
    const userChoiceDisplay = document.getElementById('user-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    const resultMessageDisplay = document.getElementById('result-message');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const userChoice = button.id;
            userChoiceDisplay.textContent = `Your choice: ${userChoice}`;
            
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            computerChoiceDisplay.textContent = `Computer's choice: ${computerChoice}`;
            
            const result = determineWinner(userChoice, computerChoice);
            resultMessageDisplay.textContent = `Result: ${result}`;
        });
    });

    function determineWinner(userChoice, computerChoice) {
        if (userChoice === computerChoice) {
            return "It's a tie!";
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'You win!';
        } else {
            return 'You lose!';
        }
    }
});
