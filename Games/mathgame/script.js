// Main game function
function playGame() {
  var score = 0;
  var count = 0;
  var numExpressions = 5;
  var accuracyElement  = document.getElementById('accuracy');
  var expressionElement = document.getElementById('expression');
  var answerInput = document.getElementById('answer');
  var scoreSpan = document.getElementById('score');
  var timerSpan = document.getElementById('timer');
  var submitBtn = document.getElementById('submitBtn');
  var messageElement = document.getElementById('message');
  var startBtn = document.getElementById('startBtn');
  var quitBtn = document.getElementById('quitBtn');
  var countdownInterval; // Declare the interval variable

  startBtn.addEventListener('click', startGame);
  quitBtn.addEventListener('click', quitGame);

  function quitGame(){
    expressionElement.textContent=`Your score: ${score}`;
    accuracyElement.textContent=`Accuracy: ${score/(count-1)*100}%`;
    startBtn.style.display = 'block';
    clearInterval(countdownInterval);
    timerSpan.textContent='10';
    scoreSpan.textContent='0';
  }
  function generateExpression() {
    var operators = ['+', '-', '*', '/'];
    var operand1 = Math.floor(Math.random() * 10) + 1;
    var operand2 = Math.floor(Math.random() * 10) + 1;
    var operand3 = Math.floor(Math.random() * 10) + 1;
    var operator1 = operators[Math.floor(Math.random() * operators.length)];
    var operator2 = operators[Math.floor(Math.random() * operators.length)];
    return operand1 + ' ' + operator1 + ' ' + operand2 + ' ' + operator2 + ' ' + operand3;
  }
  
  function startGame() {
    score = 0;
    count = 0;
    scoreSpan.textContent = score;
    messageElement.textContent = '';
    accuracyElement.textContent='';
    startBtn.style.display = 'none';
    // quitBtn.style.display = 'block';
    expressionElement.style.display = 'block';
    answerInput.style.display = 'block';
    submitBtn.style.display = 'block';
    answerInput.disabled = false;

    submitBtn.addEventListener('click', checkAnswer);
    nextExpression(); // Call nextExpression immediately after starting the game
  }

  function nextExpression() {
    count++;
    messageElement.textContent = '';
    var expression = generateExpression();
    expressionElement.textContent = 'Expression: ' + expression;
    console.log(expression);
    var timeLeft = 10;
    timerSpan.textContent = timeLeft;

    countdownInterval = setInterval(function () {
      timeLeft--;
      timerSpan.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(countdownInterval);
        messageElement.textContent = 'Time\'s up!';
        nextExpression();
      }
    }, 1000);
 // Clear the previous interval
    
  }

  function checkAnswer() {
    var answer = parseInt(answerInput.value);
    answerInput.value = '';
    var exp=eval(expressionElement.textContent);
    
    
    
    if (!isNaN(answer)) {
      var expression = expressionElement.textContent;
      
      if (answer===exp) {
        score++;
        scoreSpan.textContent = score;
        messageElement.textContent = 'Correct!';
      } else {
        messageElement.textContent = 'Incorrect!';
      }
      clearInterval(countdownInterval);
      setTimeout(nextExpression(),1000); // Move to the next expression immediately
    } else {
      messageElement.textContent = 'Please enter a valid number!';
    }
  }
}

// Run the game
playGame();
