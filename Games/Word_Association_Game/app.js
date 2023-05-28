import level1Questions from './level1.js';
import level2Questions from './level2.js';
import level3Questions from './level3.js';
import level4Questions from './level4.js';
import level5Questions from './level5.js';

const scoreDisplay = document.getElementById('score-display');
const questionDisplay = document.getElementById('question-display');
const levelSelect = document.getElementById('level-select');
const nextLevelButton = document.getElementById('next-level-button');
const restartButton = document.getElementById('restart-button');
const questions = [
  level1Questions,
  level2Questions,
  level3Questions,
  level4Questions,
  level5Questions,
];

let score = 0;
let totalScore = 0; // Accumulated score across levels
let currentLevel = 0;
let isLevelCompleted = false;
let count = 0;
scoreDisplay.textContent = score;

function populateQuestions() {
  const selectedLevel = questions[currentLevel];

  if (selectedLevel) {
    const selectedSet = getRandomSet(selectedLevel, 5);
    questionDisplay.innerHTML = '';

    selectedSet.forEach((question) => {
      const questionBox = document.createElement('div');
      questionBox.classList.add('question-box');

      const logoDisplay = document.createElement('h1');
      logoDisplay.textContent = '✒';
      logoDisplay.classList.add('logo');
      questionBox.appendChild(logoDisplay);

      question.quiz.forEach((tip) => {
        const tipText = document.createElement('p');
        tipText.textContent = tip;
        questionBox.appendChild(tipText);
      });

      const questionButtons = document.createElement('div');
      questionButtons.classList.add('question-buttons');
      questionBox.appendChild(questionButtons);

      question.option.forEach((option, optionIndex) => {
        const questionButton = document.createElement('button');
        questionButton.classList.add('question-button');
        questionButton.textContent = option;
        questionButton.addEventListener('click', () =>
          checkAnswer(
            questionBox,
            questionButton,
            option,
            optionIndex + 1,
            question.correct
          )
        );
        questionButtons.appendChild(questionButton);
      });

      const answerDisplay = document.createElement('div');
      answerDisplay.classList.add('answer-display');
      questionBox.appendChild(answerDisplay);

      questionDisplay.appendChild(questionBox);
    });
    // Enable the "Next Level" button if all questions are answered
    if (selectedSet.every((question) => question.isAnswered)) {
      isLevelCompleted = true;
      nextLevelButton.disabled = false;
    } else {
      isLevelCompleted = false;
      nextLevelButton.disabled = true;
    }
  } else {
    // Clear the question display area
    questionDisplay.innerHTML = '';
    // Enable the "Next Level" button if there are more levels
    if (currentLevel < questions.length - 1) {
      nextLevelButton.disabled = false;
    } else {
      // Display a message or take appropriate action to indicate that the user needs to answer all questions
      console.log("Please answer all questions before moving to the next level.");
      questionDisplay.textContent = '';
    }
  }
}

function changeLevel() {
  const selectedLevel = parseInt(levelSelect.value);

  // Check if the selected level is the same as the current level
  if (selectedLevel !== currentLevel) {
    if (isLevelCompleted && areAllQuestionsAnswered(questions[currentLevel])) {
      // Add the current level score to the totalScore
      totalScore += score;
      // Reset the score to 0 for the new level
      score = 0;
      currentLevel = selectedLevel;
      isLevelCompleted = false;
      populateQuestions();
      // Update the level selector dropdown to reflect the current level
      levelSelect.value = currentLevel;
      // Enable the Next Level button if the current level is completed
      if (isLevelCompleted) {
        nextLevelButton.disabled = false;
      } else {
        nextLevelButton.disabled = true;
      }
    } else {
      // Display a prompt message to the user
      alert("Please answer all questions before changing the level.");
      // Reset the level selector to the current level
      levelSelect.value = currentLevel;
    }
  }
}

function checkAnswer(questionBox, selectedButton, option, optionIndex, correctAnswer) {
  const questionButtons = questionBox.querySelectorAll('.question-button');

  questionButtons.forEach((button, index) => {
    button.disabled = true; // Disable all buttons in the question box

    if (index === correctAnswer - 1) {
      button.classList.add('correct-answer');
    }

    if (button === selectedButton) {
      if (optionIndex === correctAnswer) {
        score++;
        button.classList.add('correct-answer');
        addResult(questionBox, 'Correct!', 'correct');
      } else {
        score--;
        button.classList.add('wrong-answer');
        addResult(questionBox, 'Wrong!', 'wrong');
      }
    }
  });

  count++;

  scoreDisplay.textContent = totalScore + score;

  if (count === 5) {
    isLevelCompleted = true;
    nextLevelButton.disabled = false;
    count = 0;
  }
}

function addResult(questionBox, answer, className) {
  const answerDisplay = questionBox.querySelector('.answer-display');
  answerDisplay.classList.remove('wrong');
  answerDisplay.classList.remove('correct');
  answerDisplay.classList.add(className);
  answerDisplay.textContent = answer;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomSet(level, setSize) {
  const shuffledLevel = shuffleArray(level);
  return shuffledLevel.slice(0, setSize);
}

function areAllQuestionsAnswered(questionSet) {
  return questionSet.every((question) => question.isAnswered);
}

function goToNextLevel() {
  if (currentLevel < questions.length - 1) {
    currentLevel++;
    populateQuestions();
    levelSelect.value = currentLevel;
    nextLevelButton.disabled = true;
    isLevelCompleted = false;
  } else {
    // All levels completed, display the final score
    showFinalScore();
    nextLevelButton.style.display = 'none';
  }
}

function restartQuiz() {
  // Reset variables and score
  score = 0;
  totalScore = 0;
  currentLevel = 0;
  isLevelCompleted = false;
  count = 0;
  scoreDisplay.textContent = score;

  // Enable the level selector and next level button
  levelSelect.disabled = false;
  nextLevelButton.disabled = true;

  // Clear the question display area
  questionDisplay.innerHTML = '';

  // Populate questions for the first level
  populateQuestions();
  levelSelect.value = currentLevel;

}

restartButton.addEventListener('click', restartQuiz);
restartButton.style.display = 'inline-block'; // Make restart button always visible
restartButton.style.marginLeft = '10px'; 

function showFinalScore() {
  // Clear the question display area
  questionDisplay.innerHTML = '';

  // Create a final score message element
  const finalScoreMessage = document.createElement('h2');
  finalScoreMessage.textContent = `Congratulations! Your final score is ${totalScore + score}`;

  // Append the final score message to the question display area
  questionDisplay.appendChild(finalScoreMessage);

  // Hide the next level button
  nextLevelButton.style.display = 'none';
  restartButton.style.display = 'block';
}

nextLevelButton.addEventListener('click', goToNextLevel);
nextLevelButton.disabled = true; // Initially disable the "Next Level" button

populateQuestions();

levelSelect.addEventListener('change', changeLevel);
