const quizQuestions = [
    {
        question: "A substance which takes the shape of its container and has a definite volume is a ",
        options: ["solid", "liquid", "gas", "crystal"],
        correctAnswer: "liquid"
    },
    {
        question: "What happens to a gas when the temperature decreases ",
        options: ["It expands", "It rises.", "It condenses", "It becomes less dense."],
        correctAnswer: "It condenses"
    },
    {
        question: "Any material that does not allow heat to pass through it easily is called ",
        options: ["conductor", "expand", "contract", "insulator"],
        correctAnswer: "insulator"
    },
    {
        question: "A material through which heat and electricity flow easily is called ",
        options: ["Resistancer", "conductor", "Short circuit", "insulator"],
        correctAnswer: "conductor"
    },
    {
        question: "If you were on the Moon, there would be a change in your ",
        options: ["weight and mass", "weight", "mass", "voulme"],
        correctAnswer: "weight"
    },
    {
        question: "The process by which a liquid changes to a gas is called ",
        options: ["evaporation", "condensation", "precipitation", "transpiration"],
        correctAnswer: "evaporation"
    },
    {
        question: "The ability to do work is called ",
        options: ["rest", "force", "motion", "energy"],
        correctAnswer: "energy"
    },
    {
        question: "A force that occurs when an object rubs against another object ",
        options: ["friction", "conduction", "thermometer", "radiation"],
        correctAnswer: "friction"
    },
    {
        question: "Something that makes an object start moving, stop moving, speed up, or slow down is a ",
        options: ["position", "force", "effort", "load"],
        correctAnswer: "force"
    },
    {
        question: "The buildup of electric charges in one place is called ",
        options: ["Static electricity", "Electric charge", "Electric field", "Electric circuit"],
        correctAnswer: "Static electricity"
    },
    {
        question: "The force that attracts a body toward the center of Earth, or toward any other physical body having mass.",
        options: ["planet", "weightless", "gravity", "orbit"],
        correctAnswer: "gravity"
    },
    {
        question: "The atoms in which state shake, but don't move freely?",
        options: ["liquid", "solid", "gas", "mixture"],
        correctAnswer: "solid"
    },
    {
        question: "An example of a gas is ",
        options: ["chocolate syrup", "a rock", " a pencil", "helium"],
        correctAnswer: "helium"
    },
    {
        question: "The temperature at which a gas becomes a liquid is called the ",
        options: ["freezing point", "condensation point", "boiling point", "sublimation"],
        correctAnswer: "boiling point"
    },
    {
        question: "Water freezes at what temperature?",
        options: ["212 degrees F", "32 degrees C", "32 degrees F", "212 degrees C"],
        correctAnswer: "32 degrees F"
    }
];

// Variables to track quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;

// Function to start the quiz
function startQuiz() {
    document.getElementById("start-button").style.display = "none";
    displayQuestion();
    startTimer();
}

// Function to display a question and its options
function displayQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const questionText = document.getElementById("question-text");
    const answerButtons = document.getElementById("answer-buttons");

    // Clear previous question and answer options
    questionText.innerHTML = "";
    answerButtons.innerHTML = "";

    // Display the current question
    questionText.innerHTML = currentQuestion.question;

    // Create answer buttons for each option
    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("answer-button");
        answerButtons.appendChild(button);

        // Add click event listener to check the answer
        button.addEventListener("click", function () {
            checkAnswer(option, button);
        });
    });
}

// Function to check the selected answer
function checkAnswer(selectedOption, button) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const answerButtons = document.getElementById("answer-buttons");

    // Check if the selected answer is correct
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        button.style.backgroundColor = "darkgreen";
    } else {
        // Indicate the selected answer is wrong
        button.style.backgroundColor = "red";

        // Display the correct answer if the selected answer is incorrect
        const correctAnswerElement = document.createElement("div");
        correctAnswerElement.classList.add("correct-answer");
        correctAnswerElement.innerText = `Correct Answer: ${currentQuestion.correctAnswer}`;
        answerButtons.appendChild(correctAnswerElement);
    }

    // Move to the next question or end the quiz after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
}

// Function to start the timer
function startTimer() {
    // Update the timer text immediately
    document.getElementById("timer").textContent = timeLeft;

    timerInterval = setInterval(function () {
        timeLeft--;

        // Update the timer text
        document.getElementById("timer").textContent = timeLeft;

        // End the quiz if time runs out
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// Function to end the quiz
function endQuiz() {
    // Stop the timer
    clearInterval(timerInterval);

    // Calculate the score percentage
    const scorePercentage = (score / quizQuestions.length) * 100;

    // Display the final score
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `
      <h2>Quiz Completed!</h2>
      <p>Your Score: ${score} out of ${quizQuestions.length}</p>
      <p>Score Percentage: ${scorePercentage}%</p>
    `;
}


document.getElementById("start-button").addEventListener("click", startQuiz);
