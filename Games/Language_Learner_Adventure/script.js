const questions = [
    { word: 'apple', correct: 'manzana', options: ['manzana', 'pera', 'plátano', 'uva'] },
    { word: 'dog', correct: 'perro', options: ['gato', 'caballo', 'perro', 'ratón'] },
    { word: 'house', correct: 'casa', options: ['edificio', 'casa', 'escuela', 'tienda'] },
    { word: 'book', correct: 'libro', options: ['revista', 'periódico', 'libro', 'cuaderno'] },
    { word: 'car', correct: 'coche', options: ['bicicleta', 'coche', 'avión', 'barco'] }
];

let currentQuestionIndex = 0;
let score = 0;

document.getElementById('next-button').addEventListener('click', nextQuestion);

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('word').innerText = question.word;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerText = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
    document.getElementById('feedback').innerText = '';
}

function checkAnswer(selected) {
    const question = questions[currentQuestionIndex];
    if (selected === question.correct) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        document.getElementById('feedback').innerText = `Incorrect! The correct answer is ${question.correct}.`;
    }
    document.getElementById('score').innerText = score;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        document.getElementById('question-container').innerHTML = '<p>You have completed the quiz!</p>';
        document.getElementById('next-button').style.display = 'none';
        document.getElementById('feedback').innerText = `Final Score: ${score}`;
    }
}

// Initialize the first question
loadQuestion();
