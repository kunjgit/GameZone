
let operators = ["+", "-", "*"];
const startButton = document.getElementById("startBtn");
const question = document.getElementById("question");
const controls = document.querySelector(".controlsContainer");
const result = document.getElementById("result");
const submitButton = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMsg");
let answerValue;
let operatorQuestion;


// Random Value Generator

const randomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const questionGenerator = () => {
  // Two random values between 1 and 30
  let [num1, num2] = [randomValue(1, 30), randomValue(1, 30)];
  // For getting the random operator
  let randomOperator = operators[Math.floor(Math.random() * operators.length)];
  if (randomOperator == "-" && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  let solution = eval(`${num1}${randomOperator}${num2}`);

  let randomVar = randomValue(1, 5);
  if (randomVar == 1) {
    answerValue = num1;
    question.innerHTML = `<input type="number" id="inputValue" placeholder="?"\> ${randomOperator} ${num2} = ${solution}`;
  } else if (randomVar == 2) {
    answerValue = num2;
    question.innerHTML = `${num1} ${randomOperator}<input type="number" id="inputValue" placeholder="?"\> = ${solution}`;
  } else if (randomVar == 3) {
    answerValue = randomOperator;
    operatorQuestion = true;
    question.innerHTML = `${num1} <input type="text" id="inputValue" placeholder="?"\> ${num2} = ${solution}`;
  } else {
    answerValue = solution;
    question.innerHTML = `${num1} ${randomOperator} ${num2} = <input type="number" id="inputValue" placeholder="?"\>`;
  }

  submitButton.addEventListener("click", () => {
    errorMessage.classList.add("hide");
    let userInput = document.getElementById("inputValue").value;
    // If user input is not empty
    if (userInput) {
      // If the user choose correct answer
      if (userInput == answerValue) {
        stopGame(`Congrats!! You have entered <span>Correct</span> Answer.`);
      }

      // If user inputs operator other than +,-,*


      else if (operatorQuestion && !operators.includes(userInput)) {
        errorMessage.classList.remove("hide");
        errorMessage.innerHTML = "Please enter a valid operator.";
      }

      // If user has choosed wrong answer

      else {
        stopGame(`Sorry!! You have entered <span>Wrong</span> Answer.`);
      }
    }
    // If user input is empty
    else {
      errorMessage.classList.remove("hide");
      errorMessage.innerHTML = "Input field can't be empty.";
    }
  });
};
// Start Game
startButton.addEventListener("click", () => {
  operatorQuestion = false;
  answerValue = "";
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hide");

  controls.classList.add("hide");
  startButton.classList.add("hide");
  questionGenerator();
});

const stopGame = (resultText) => {
  result.innerHTML = resultText;
  startButton.innerText = "Restart";
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
};









