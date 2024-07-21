// JavaScript
let hiddenPattern = createRandomSequence();
let attemptLog = [];
let attempts = 0;
let score = 0;

function createRandomSequence() {
    const distinctNumbers = new Set();
    while (distinctNumbers.size < 4) {
        distinctNumbers.add(Math.floor(Math.random() * 10));
    }
    return Array.from(distinctNumbers).join("");
}

function evaluateGuess() {
    const userAttempt = document.getElementById("guess-input").value;
    let exactMatches = 0;
    let partialMatches = 0;

    for (let i = 0; i < 4; i++) {
        if (userAttempt[i] === hiddenPattern[i]) {
            exactMatches++;
        } else if (hiddenPattern.includes(userAttempt[i]) && userAttempt[i]!== hiddenPattern[i]) {
            partialMatches++;
        }
    }

    const resultMessage = `${exactMatches} Bull${exactMatches!== 1? "s" : ""} and ${partialMatches} Cow${partialMatches!== 1? "es" : ""}`;
    const attemptSummary = `Attempt: ${userAttempt} - ${resultMessage}`;
    attemptLog.push(attemptSummary);

    document.getElementById("output-panel").innerText = attemptSummary;
    document.getElementById("guess-log").innerHTML = `<strong>Attempt History:</strong><br>${attemptLog.join("<br>")}`;

    attempts++;

    if (exactMatches === 4) {
        // Show the custom modal
        document.getElementById("modal-message").innerText = "Congratulations, you cracked the code!";
        document.getElementById("modal").style.display = "block";

        // Calculate score based on the number of attempts
        switch (attempts) {
            case 1:
                score = 70;
                break;
            case 2:
                score = 60;
                break;
            case 3:
                score = 50;
                break;
            case 4:
                score = 40;
                break;
            case 5:
                score = 30;
                break;
            case 6:
                score = 20;
                break;
            case 7:
                score = 10;
                break;
            default:
                score = 0;
        }
        alert(`You scored ${score} points!`);
        // Reset the game
        hiddenPattern = createRandomSequence();
        attemptLog = [];
        attempts = 0;
        score = 0;
        document.getElementById("guess-input").value = ""; // Clear the guess input
        document.getElementById("output-panel").innerText = "";
        document.getElementById("guess-log").innerHTML = "";
        document.getElementById("container").classList.add("celebration"); // Add celebration class
        setTimeout(() => {
            document.getElementById("container").classList.remove("celebration"); // Remove celebration class after 2 seconds
        }, 2000);
    } else if (attempts === 7) {
        document.getElementById("modal-message").innerText = "Sorry, you didn't guess the code in 7 attempts. You scored 0 points.";
        document.getElementById("modal").style.display = "block";
        // Reset the game
        hiddenPattern = createRandomSequence();
        attemptLog = [];
        attempts = 0;
        score = 0;
        document.getElementById("guess-input").value = ""; // Clear the guess input
        document.getElementById("output-panel").innerText = "";
        document.getElementById("guess-log").innerHTML = "";
    }
}

document.getElementById("submit").addEventListener("click", evaluateGuess);