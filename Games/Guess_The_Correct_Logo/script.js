// Define the questions and their answers
const questions = [
  {
      logo1: './assests/apple1.png',
      logo2: './assests/apple2.png',
      answer: 2
  },
  {
      logo1: './assests/bmw1.png',
      logo2: './assests/bmw2.png',
      answer: 1
  },
  {
    logo1: './assests/burgerking1.png',
    logo2: './assests/burgerking2.png',
    answer: 2
  },
  {
    logo1: './assests/rolex1.png',
    logo2: './assests/rolex2.png',
    answer: 1
  },
  {
    logo1: './assests/dominos1.png',
    logo2: './assests/dominos2.png',
    answer: 2
  },
  { 
  logo1: './assests/google1.png',
  logo2: './assests/google2.png',
  answer: 2
  },
  {
    logo1: './assests/pepsi1.png',
    logo2: './assests/pepsi2.png',
    answer: 1
  },
  {
  logo1: './assests/hp1.png',
  logo2: './assests/hp2.png',
  answer: 2
  },
  {
  logo1: './assests/ibm1.png',
  logo2: './assests/ibm2.png',
  answer: 2
  },
  {
  logo1: './assests/instagram1.png',
  logo2: './assests/instagram2.png',
  answer: 1
  },
  {
  logo1: './assests/microsoft1.png',
  logo2: './assests/microsoft2.png',
  answer: 2
  },
  {
    logo1: './assests/nasa1.png',
    logo2: './assests/nasa2.png',
    answer: 1
  },
  {
    logo1: './assests/starbucks1.png',
    logo2: './assests/starbucks2.png',
    answer: 1
  },
  {
    logo1: './assests/subway1.png',
    logo2: './assests/subway2.png',
    answer: 2
  },
  {
    logo1: './assests/twitter1.png',
    logo2: './assests/twitter2.png',
    answer: 2
  }, 
];

let currentQuestion = 0;
let score = 0;
let timerSeconds=30;
var timerInterval;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timerSeconds--;
  document.getElementById("timer").textContent = "Time-left: " + timerSeconds+ " sec";

  if (timerSeconds === 0) {
    endGame();
  }
}

// Display the question and choices
function displayQuestion() {
  if (currentQuestion >= questions.length) {
      endGame();
      return;
  }

  const question = questions[currentQuestion];
  document.getElementById('question').innerHTML = '';
  document.getElementById('choice1').src = question.logo1;
  document.getElementById('choice2').src = question.logo2;
}

// Check the user's answer
function checkAnswer(choice) {
  const selectedAnswer = choice.id === 'choice1' ? 1 : 2;
  const question = questions[currentQuestion];

  if (selectedAnswer === question.answer) {
      score++;
  }

  currentQuestion++;
  displayQuestion();
}

// Start the game
function startGame() {
  currentQuestion = 0;
  score = 0;
  displayQuestion();

}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('question').innerHTML = '';
  document.getElementById('choices').innerHTML = '';
  document.getElementById('score').innerHTML = `Time's up! Your score: ${score}/${questions.length}`;
}

// Start the game when the page loads
window.onload = startGame;
startTimer();