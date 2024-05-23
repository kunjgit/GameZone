document.addEventListener("DOMContentLoaded", function() {
    const room = document.getElementById("room");
    const key = document.getElementById("key");
    const door = document.getElementById("door");
    const pointsTable = document.getElementById("pointsTable");
    const pointsList = document.getElementById("pointsList");
    const intro = document.getElementById("intro");
    const instructions = document.getElementById("instructions");
    const startButton = document.getElementById("startButton");
    const numberOfQuestions = 4;
    let correctAnswers = 0;

    const puzzles = [
        { question: "Puzzle 1: What is 5 + 3?", answer: "8" },
        { question: "Puzzle 2: What is the capital of France?", answer: "paris" },
        { question: "Puzzle 3: Solve the riddle - 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?'", answer: "echo" },
        { question: "Puzzle 4: What is 10 divided by 2?", answer: "5" },
        { question: "Puzzle 5: What is the boiling point of water in Celsius?", answer: "100" },
        { question: "Puzzle 6: What is the chemical symbol for water?", answer: "h2o" },
        { question: "Puzzle 7: What planet is known as the Red Planet?", answer: "mars" },
        { question: "Puzzle 8: What is the largest mammal?", answer: "blue whale" },
        { question: "Puzzle 9: What is the square root of 81?", answer: "9" },
        { question: "Puzzle 10: Who wrote 'Romeo and Juliet'?", answer: "shakespeare" }
    ];

    const introText = "Welcome to the Escape Room Game! Solve 4 puzzles to find the key and unlock the door. Good luck!";
    let charIndex = 0;

    function typeInstructions() {
        if (charIndex < introText.length) {
            instructions.textContent += introText.charAt(charIndex);
            charIndex++;
            setTimeout(typeInstructions, 50);
        } else {
            startButton.classList.remove("hidden");
        }
    }

    function startGame() {
        intro.classList.add("hidden");
        room.classList.remove("hidden");
        pointsTable.classList.add("hidden");
        pointsList.innerHTML = '';
        correctAnswers = 0;

        const selectedPuzzles = getRandomPuzzles(numberOfQuestions);
        selectedPuzzles.forEach((puzzle, index) => {
            const puzzleDiv = document.createElement("div");
            puzzleDiv.classList.add("puzzle");
            if (index !== 0) puzzleDiv.classList.add("hidden");

            const puzzleParagraph = document.createElement("p");
            puzzleParagraph.textContent = puzzle.question;
            puzzleDiv.appendChild(puzzleParagraph);

            const input = document.createElement("input");
            input.type = "text";
            input.id = `answer${index}`;
            puzzleDiv.appendChild(input);

            const button = document.createElement("button");
            button.textContent = "Submit";
            button.onclick = () => checkAnswer(index, puzzle.answer);
            puzzleDiv.appendChild(button);

            room.appendChild(puzzleDiv);
        });
    }

    function getRandomPuzzles(count) {
        const shuffledPuzzles = puzzles.sort(() => 0.5 - Math.random());
        return shuffledPuzzles.slice(0, count);
    }

    function checkAnswer(index, correctAnswer) {
        const input = document.getElementById(`answer${index}`).value.trim().toLowerCase();
        if (input === correctAnswer) {
            correctAnswers++;
            updatePointsTable(index + 1, true);
            const currentPuzzle = room.children[index];
            if (index + 1 < room.children.length) {
                currentPuzzle.classList.add("hidden");
                room.children[index + 1].classList.remove("hidden");
            } else {
                currentPuzzle.classList.add("hidden");
                key.classList.remove("hidden");
            }
        } else {
            alert("Incorrect! Try again.");
            updatePointsTable(index + 1, false);
        }
    }

    function updatePointsTable(questionNumber, isCorrect) {
        const listItem = document.createElement("li");
        listItem.textContent = `Question ${questionNumber}: ${isCorrect ? "Correct" : "Incorrect"}`;
        pointsList.appendChild(listItem);
        pointsTable.classList.remove("hidden");
    }

    function unlockDoor() {
        key.classList.add("hidden");
        door.classList.remove("hidden");
        door.classList.add("animated");
    }

    function resetGame() {
        room.innerHTML = '';
        key.classList.add("hidden");
        door.classList.add("hidden");
        startInstructions();
    }

    function startInstructions() {
        instructions.textContent = '';
        charIndex = 0;
        intro.classList.remove("hidden");
        room.classList.add("hidden");
        typeInstructions();
    }

    // Expose functions to the global scope
    window.startGame = startGame;
    window.unlockDoor = unlockDoor;
    window.resetGame = resetGame;

    // Initialize the game with instructions
    startInstructions();
});
