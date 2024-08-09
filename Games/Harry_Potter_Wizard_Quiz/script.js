// Example data
const questions = [
  {
    question: "How many people transformed into Harry Potter in the last book when Harry needed to be moved to the Weasley's house?",
    answers: ["Seven", "Five", "Three", "Nine"],
    correct: "Seven",
  },
  {
    question: "What was the prize money of the Triwizard Tournament when Harry took part in it?",
    answers: [ "500 Galleons", "2000 Galleons","1000 Galleons", "750 Galleons"],
    correct: "1000 Galleons",
  },
  {
    question: "Who gifted Harry his very first broomstick?",
    answers: [ "Hagrid","Sirius Black", "Professor McGonagall", "Dumbledore"],
    correct: "Sirius Black",
  },
  {
    question: "What animal did the imposter Mad-Eye Moody convert Malfoy into?",
    answers: ["Rat", "Cat", "Toad","Ferret" ],
    correct: "Ferret",
  },
  {
    question: "What was the first name of Professor Flitwick?",
    answers: ["Filius", "Severus", "Albus", "Gilderoy"],
    correct: "Filius",
  },
  {
    question: "What was the favourite animal of Dolores Umbridge?",
    answers: ["Owl","Cat",  "Rabbit", "Snake"],
    correct: "Cat",
  },
  {
    question: "What kind of creature was Professor Firenze?",
    answers: [ "Goblin", "Elf","Centaur", "Werewolf"],
    correct: "Centaur",
  },
  {
    question: "What was James Potter's Animagus form?",
    answers: ["Stag", "Dog", "Wolf", "Bear"],
    correct: "Stag",
  },
  {
    question: "What was the color of Harry Potter's eyes?",
    answers: [ "Blue", "Brown","Green", "Gray"],
    correct: "Green",
  },
   {
    question: "What is the name of Harry Potter's pet owl?",
    answers: ["Hedwig", "Scabbers", "Crookshanks", "Fawkes"],
    correct: "Hedwig",
  },
  

];

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 150;

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});

function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  document.getElementById("score").textContent = score;
  startTimer();
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.question;
  const answersContainer = document.getElementById("answers");
  answersContainer.innerHTML = "";
  question.answers.forEach((answer) => {
    const button = document.createElement("div");
    button.textContent = answer;
    button.classList.add("answer");
    button.addEventListener("click", () => checkAnswer(answer));
    answersContainer.appendChild(button);
  });
}

function checkAnswer(selectedAnswer) {
  const correctAnswer = questions[currentQuestionIndex].correct;
  if (selectedAnswer === correctAnswer) {
    score += 10;
    document.getElementById("score").textContent = score;
    // Add a sound effect or animation here
  } else {
    // Add a different sound effect or animation for incorrect answers
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("timer").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  document.getElementById("question").textContent = "Game Over!";
  document.getElementById("answers").innerHTML = "";
}
