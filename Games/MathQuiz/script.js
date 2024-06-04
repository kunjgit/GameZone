let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion;
let gameStarted = false;
let timer;
let timeLeft = 30;

function startGame() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    if (!gameStarted) {
        gameStarted = true;
        generateQuestion();
        updateTimer();
        timer = setInterval(updateTimer, 1000);
        setTimeout(endGame, 20000);
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    if (operation === '/' && num1 % num2 !== 0) {
        generateQuestion();  // Avoid division questions with remainders
        return;
    }

    currentQuestion = { num1, num2, operation };
    document.getElementById('question').innerText = `What is ${num1} ${operation} ${num2}?`;
}

function submitAnswer() {
    const answer = parseFloat(document.getElementById('answer').value);
    let correctAnswer;

    switch (currentQuestion.operation) {
        case '+':
            correctAnswer = currentQuestion.num1 + currentQuestion.num2;
            break;
        case '-':
            correctAnswer = currentQuestion.num1 - currentQuestion.num2;
            break;
        case '*':
            correctAnswer = currentQuestion.num1 * currentQuestion.num2;
            break;
        case '/':
            correctAnswer = currentQuestion.num1 / currentQuestion.num2;
            break;
    }

    if (answer === correctAnswer) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    document.getElementById('answer').value = '';
    generateQuestion();
}

function updateTimer() {
    if (timeLeft > 0) {
        document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
        timeLeft--;
    } else {
        clearInterval(timer);
    }
}

function endGame() {
    clearInterval(timer);
    gameStarted = false;
    document.getElementById('result').innerText = 'Time is up!';
    document.getElementById('score').innerText = `Correct Answers: ${correctAnswers}, Wrong Answers: ${wrongAnswers}`;
}
