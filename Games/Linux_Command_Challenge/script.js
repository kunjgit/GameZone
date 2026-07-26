"use strict";

const questions = [
    {
        question: "Which command displays the current working directory?",
        answers: ["ls", "pwd", "cd", "whoami"],
        correctAnswer: "pwd",
        explanation: "The pwd command prints the full path of the current directory."
    },
    {
        question: "Which command lists files and directories?",
        answers: ["ls", "mkdir", "touch", "clear"],
        correctAnswer: "ls",
        explanation: "The ls command lists the contents of a directory."
    },
    {
        question: "Which command creates a new directory?",
        answers: ["cp", "mkdir", "mv", "rmdir"],
        correctAnswer: "mkdir",
        explanation: "The mkdir command creates one or more new directories."
    },
    {
        question: "Which command changes the current directory?",
        answers: ["cd", "pwd", "cat", "grep"],
        correctAnswer: "cd",
        explanation: "The cd command moves the user to another directory."
    },
    {
        question: "Which command copies a file or directory?",
        answers: ["mv", "rm", "cp", "nano"],
        correctAnswer: "cp",
        explanation: "The cp command creates a copy of a file or directory."
    },
    {
        question: "Which command moves or renames a file?",
        answers: ["mv", "ls", "touch", "echo"],
        correctAnswer: "mv",
        explanation: "The mv command moves files and can also rename them."
    },
    {
        question: "Which command removes a file?",
        answers: ["rm", "cat", "chmod", "ps"],
        correctAnswer: "rm",
        explanation: "The rm command permanently removes files."
    },
    {
        question: "Which command changes file permissions?",
        answers: ["chown", "grep", "chmod", "sudo"],
        correctAnswer: "chmod",
        explanation: "The chmod command modifies read, write, and execute permissions."
    },
    {
        question: "Which command displays currently running processes?",
        answers: ["ps", "pwd", "man", "history"],
        correctAnswer: "ps",
        explanation: "The ps command displays information about active processes."
    },
    {
        question: "Which command manages systemd services?",
        answers: ["systemctl", "servicefile", "process", "apt"],
        correctAnswer: "systemctl",
        explanation: "The systemctl command starts, stops, and checks systemd services."
    }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const questionNumber = document.getElementById("question-number");
const totalQuestions = document.getElementById("total-questions");
const scoreElement = document.getElementById("score");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const feedback = document.getElementById("feedback");
const progressFill = document.getElementById("progress-fill");

const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");
const resultMessage = document.getElementById("result-message");

let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;

totalQuestions.textContent = questions.length;
finalTotal.textContent = questions.length;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", moveToNextQuestion);
restartButton.addEventListener("click", startGame);

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;

    scoreElement.textContent = score;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    displayQuestion();
}

function displayQuestion() {
    resetQuestionState();

    const currentQuestion = questions[currentQuestionIndex];

    questionNumber.textContent = currentQuestionIndex + 1;
    questionText.textContent = currentQuestion.question;

    const progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;

    progressFill.style.width = `${progressPercentage}%`;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(button, answer);
        });

        answerButtons.appendChild(button);
    });
}

function resetQuestionState() {
    answerSelected = false;

    nextButton.classList.add("hidden");
    feedback.classList.add("hidden");
    feedback.classList.remove("correct", "incorrect");
    feedback.textContent = "";

    answerButtons.replaceChildren();
}

function checkAnswer(selectedButton, selectedAnswer) {
    if (answerSelected) {
        return;
    }

    answerSelected = true;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
        selectedAnswer === currentQuestion.correctAnswer;

    const buttons = answerButtons.querySelectorAll(".answer-button");

    buttons.forEach((button) => {
        button.disabled = true;

        if (button.textContent === currentQuestion.correctAnswer) {
            button.classList.add("correct");
        }
    });

    if (isCorrect) {
        score += 1;
        scoreElement.textContent = score;

        feedback.textContent =
            `Correct! ${currentQuestion.explanation}`;

        feedback.classList.add("correct");
    } else {
        selectedButton.classList.add("incorrect");

        feedback.textContent =
            `Incorrect. The correct answer is "${currentQuestion.correctAnswer}". ` +
            currentQuestion.explanation;

        feedback.classList.add("incorrect");
    }

    feedback.classList.remove("hidden");
    nextButton.classList.remove("hidden");

    nextButton.textContent =
        currentQuestionIndex === questions.length - 1
            ? "View Results"
            : "Next Question";
}

function moveToNextQuestion() {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    finalScore.textContent = score;

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
        resultMessage.textContent =
            "Perfect score! You have excellent Linux command knowledge.";
    } else if (percentage >= 80) {
        resultMessage.textContent =
            "Great work! You have a strong understanding of Linux commands.";
    } else if (percentage >= 60) {
        resultMessage.textContent =
            "Good attempt. Review a few commands and try the challenge again.";
    } else {
        resultMessage.textContent =
            "Keep practicing. Repeating the challenge will strengthen your skills.";
    }
}