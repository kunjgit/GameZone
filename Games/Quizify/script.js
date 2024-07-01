const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const result = document.getElementById('result');

let currentQuestionIndex = 0;
let questions = [];

function fetchQuestions() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      showQuestion();
    })
    .catch((error) => console.log('Error fetching questions:', error));
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.innerHTML = `<p>${currentQuestion.question}</p>`;
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  optionsContainer.innerHTML = options
    .map((option) => `<button class="option">${option}</button>`)
    .join('');
  nextButton.classList.add('hide');
  enableOptions();
}

function enableOptions() {
  const options = document.querySelectorAll('.option');
  options.forEach((option) => {
    option.addEventListener('click', checkAnswer);
  });
}

function disableOptions() {
  const options = document.querySelectorAll('.option');
  options.forEach((option) => {
    option.removeEventListener('click', checkAnswer);
  });
}

function checkAnswer(event) {
  const selectedOption = event.target;
  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.correct_answer;

  if (selectedOption.textContent === correctAnswer) {
    result.textContent = 'Correct!';
  } else {
    result.textContent = 'Wrong!';
  }

  disableOptions();
  nextButton.classList.remove('hide');
}

function showNextQuestion() {
  result.textContent = '';
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    questionContainer.textContent = 'Quiz Completed!';
    optionsContainer.innerHTML = '';
    nextButton.classList.add('hide');
  }
}

nextButton.addEventListener('click', showNextQuestion);

fetchQuestions();
