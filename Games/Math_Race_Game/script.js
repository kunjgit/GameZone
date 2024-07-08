// script.js
let playerPosition = 0;
let computerPosition = 0;
let num1, num2, operation, correctAnswer;
let questionCount = 0;
const totalQuestions = 10;
const operations = ['+', '-', '*', '/']

function generateQuestion() {
    if (questionCount < totalQuestions) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = operations[parseInt(Math.random() * 100 % 4)]
        console.log(parseInt(Math.random()*100%4))
        correctAnswer = parseInt(eval(`${num1} ${operation} ${num2}`));
        document.getElementById('question').innerText = `${questionCount + 1}. What is ${num1} ${operation} ${num2}?`;
    } else {
        endGame();
    }
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    if (userAnswer === correctAnswer) {
        playerPosition += 10;
        if (Math.random() > 0.2) {
            computerPosition += 10;
        }
        document.getElementById('result').innerText = 'Correct!';
        document.getElementById('result').style.color = 'green';
    } else {
        computerPosition+=10;
        document.getElementById('result').innerText = 'Incorrect. Try again!';
        document.getElementById('result').style.color = 'red';
    }
    moveCharacter('player', playerPosition);
    moveCharacter('computer', computerPosition);
    document.getElementById('answer').value = '';
    questionCount++;
    generateQuestion();
}

function moveCharacter(character, position) {
    document.getElementById(character).style.bottom = position + 'px';
}

function checkWinner() {
    if (playerPosition > computerPosition) {
        return `You wins! You win by ${playerPosition-computerPosition} points.`;
    } else if (computerPosition > playerPosition) {
        return `Computer wins! You loss by ${computerPosition-playerPosition} points.`;
    } else {
        return "It's a tie!";
    }
}

function endGame() {
    document.getElementById('question').style.display = 'none';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('replay-button').style.display = 'block';
    document.getElementById('final-result').innerText = checkWinner();
    document.getElementById('final-result').style.display = 'block';
    document.getElementById('submit').style.display = 'none';
}

function resetGame() {
    playerPosition = 0;
    computerPosition = 0;
    questionCount = 0;
    moveCharacter('player', playerPosition);
    moveCharacter('computer', computerPosition);
    document.getElementById('question').style.display = 'block';
    document.getElementById('answer').style.display = 'block';
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').textContent = '';
    document.getElementById('replay-button').style.display = 'none';
    document.getElementById('final-result').style.display = 'none';
    document.getElementById('submit').style.display = 'block';
    generateQuestion();
}

// Initialize the game
generateQuestion();
