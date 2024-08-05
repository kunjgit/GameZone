const sentences = {
    easy: [
        "the quick brown fox jumps over the lazy dog",
        "javascript is a versatile programming language",
        "a journey of a thousand miles begins with a single step",
        "the early bird catches the worm",
        "actions speak louder than words"
    ],
    medium: [
        "practice makes perfect",
        "coding is both challenging and fun",
        "the only limit to our realization of tomorrow is our doubts of today",
        "a stitch in time saves nine",
        "the pen is mightier than the sword"
    ],
    hard: [
        "in the midst of chaos, there is also opportunity",
        "the best way to predict the future is to invent it",
        "an ounce of prevention is worth a pound of cure",
        "you can't judge a book by its cover",
        "the greatest glory in living lies not in never falling, but in rising every time we fall"
    ]
};


let currentSentence;
let scrambledSentence;
let timer;
let timeLeft;
let interval;
let sentenceCount = 0;
let correctCount = 0;
const maxSentences = 5;

function scrambleSentence(sentence) {
    const words = sentence.split(" ");
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    return words.join(" ");
}

function loadNewSentence() {
    const difficulty = document.getElementById("difficulty").value;
    const sentenceList = sentences[difficulty];
    currentSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
    scrambledSentence = scrambleSentence(currentSentence);
    document.getElementById("scrambled-sentence").textContent = (sentenceCount + 1) + ". " +  scrambledSentence;
    document.getElementById("user-input").value = "";
    document.getElementById("result").textContent = "";

    resetTimer();
    startTimer();
}

function checkAnswer() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput.toLowerCase() === currentSentence.toLowerCase()) {
        correctCount++;
        document.getElementById("result").textContent = "Correct! 🎉";
        document.getElementById("result").style.color = "green";
    } else {
        document.getElementById("result").textContent = "Incorrect, try again.";
        document.getElementById("result").style.color = "red";
    }
    sentenceCount++;
    if (sentenceCount < maxSentences) {
        setTimeout(loadNewSentence, 1000); // Load next sentence after 1 second
    } else {
        setTimeout(showEndScreen, 1000); // Show end screen after 1 second
    }
    stopTimer();
}

function startTimer() {
    timeLeft = 60; // 60 seconds for each sentence
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(interval);
        document.getElementById("result").textContent = "Time's up!";
        document.getElementById("result").style.color = "red";
        sentenceCount++;
        if (sentenceCount < maxSentences) {
            setTimeout(loadNewSentence, 1000); // Load next sentence after 1 second
        } else {
            setTimeout(showEndScreen, 1000); // Show end screen after 1 second
        }
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;
}

function resetTimer() {
    clearInterval(interval);
    document.getElementById("timer").textContent = "Time: 01:00";
}

function showEndScreen() {
    document.getElementById("play").style.display = "none";
    document.getElementById("end").style.display = "block";
    document.getElementById("final-result").textContent = `Game Over! You got ${correctCount} out of ${maxSentences} correct.`;
}

document.getElementById("start-game").addEventListener("click", function() {
    document.getElementById("start").style.display = "none";
    document.getElementById("end").style.display = "none";
    document.getElementById("play").style.display = "block";
    sentenceCount = 0;
    correctCount = 0;
    loadNewSentence();
});

document.getElementById("check-answer").addEventListener("click", checkAnswer);
document.getElementById("restart-game").addEventListener("click", function() {
    document.getElementById("end").style.display = "none";
    document.getElementById("start").style.display = "block";
});
