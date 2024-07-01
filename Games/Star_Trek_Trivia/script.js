var questions = [
    {
      question: "What is the name of Captain Picard's ship?",
      options: ["Enterprise", "Voyager", "Defiant"],
      answer: 0,
      level: "Easy",
      points: 10
    },
    {
      question: "Who is Spock's father?",
      options: ["Sarek", "Khan", "Q"],
      answer: 0,
      level: "Medium",
      points: 15
    },
    {
      question: "What is the Borg's catchphrase?",
      options: ["Resistance is futile", "Live long and prosper", "Make it so"],
      answer: 0,
      level: "Hard",
      points: 20
    },
    {
      question: "What is the name of Worf's home planet?",
      options: ["Klingon", "Romulus", "Qo'noS"],
      answer: 2,
      level: "Medium",
      points: 15
    },
    {
      question: "Which Star Trek series features Captain Kathryn Janeway?",
      options: ["Star Trek: The Next Generation", "Star Trek: Voyager", "Star Trek: Deep Space Nine"],
      answer: 1,
      level: "Easy",
      points: 10
    },
    {
      question: "Who is the chief engineer on the USS Enterprise-D?",
      options: ["Scotty", "Geordi La Forge", "Miles O'Brien"],
      answer: 1,
      level: "Medium",
      points: 15
    },
    {
      question: "What is the full name of the android Data?",
      options: ["Data", "B-4", "Noonian Soong"],
      answer: 0,
      level: "Hard",
      points: 20
    },
    {
      question: "Which species is known for their ability to assimilate other species into their collective?",
      options: ["Klingons", "Vulcans", "Borg"],
      answer: 2,
      level: "Medium",
      points: 15
    },
    {
      question: "Who is the captain of the USS Discovery in the series Star Trek: Discovery?",
      options: ["Captain Pike", "Captain Lorca", "Captain Burnham"],
      answer: 2,
      level: "Hard",
      points: 20
    },
    {
      question: "What is the name of the time-traveling spaceship in Star Trek: Voyager?",
      options: ["Delta Flyer", "Time-Ship Relativity", "Aeon"],
      answer: 2,
      level: "Medium",
      points: 15
    },
    // Add more questions as needed
  ];
  
  function shuffleQuestions() {
    for (var i = questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = questions[i];
      questions[i] = questions[j];
      questions[j] = temp;
    }
  }
  
  var score = 0;
  var currentQuestionIndex = 0;
  var timer;
  
  var questionElement = document.getElementById("question");
  var optionsElement = document.getElementById("options");
  var scoreElement = document.getElementById("score");
  var resultContainer = document.getElementById("result-container");
  
  function displayQuestion() {
    var question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
  
    optionsElement.innerHTML = "";
    
    for (var i = 0; i < question.options.length; i++) {
      var option = document.createElement("input");
      option.type = "radio";
      option.name = "answer";
      option.value = i;
      option.required = true;
  
      var label = document.createElement("label");
      label.textContent = question.options[i];
  
      optionsElement.appendChild(option);
      optionsElement.appendChild(label);
      optionsElement.appendChild(document.createElement("br"));
    }
  
    // Display the difficulty level
    var levelElement = document.createElement("p");
    levelElement.textContent = "Difficulty: " + question.level;
    optionsElement.appendChild(levelElement);
  
    // Start the countdown timer
    startTimer();
  }
  
  function shuffleOptions(options) {
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = options[i];
      options[i] = options[j];
      options[j] = temp;
    }
    return options;
  }
  
  function startTimer() {
    var timeLeft = 10;
    var timerElement = document.createElement("p");
    optionsElement.appendChild(timerElement);
  
    timer = setInterval(function() {
      timerElement.textContent = "Time left: " + timeLeft + "s";
      timeLeft--;
  
      if (timeLeft < 0) {
        clearInterval(timer);
        endGame("TIME'S UP!");
      }
    }, 1000);
  }
  
  function submitAnswer() {
    var selectedOption = document.querySelector("input[name='answer']:checked");
  
    if (selectedOption) {
      var userAnswer = parseInt(selectedOption.value);
      var question = questions[currentQuestionIndex];
  
      if (userAnswer === question.answer) {
        score += question.points;
      } else {
        score = 0;
        endGame("GAME OVER!");
        return;
      }
  
      scoreElement.textContent = score;
  
      if (score >= 100) {
        endGame("YOU WON!");
        return;
      }
  
      clearInterval(timer);
      currentQuestionIndex++;
  
      if (currentQuestionIndex >= questions.length) {
        endGame("GAME OVER!");
        return;
      }
  
      displayQuestion();
    }
  }
  
  function endGame(message) {
    clearInterval(timer);
    resultContainer.innerHTML = "<h2>" + message + "</h2>";
    optionsElement.innerHTML = "";
  }
  
  document.getElementById("submit-btn").addEventListener("click", submitAnswer);
  
  
  shuffleQuestions();
  displayQuestion();
  