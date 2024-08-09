document.addEventListener("DOMContentLoaded", () => {
    const inventoryList = document.getElementById("inventoryList");
    const dialogueBox = document.getElementById("dialogue");
    const dialogueText = document.getElementById("dialogueText");
    const closeDialogueButton = document.getElementById("closeDialogue");
    const solvePuzzleButton = document.getElementById("solvePuzzleButton");
    const stopGameButton = document.getElementById("stopGameButton");
    const restartGameButton = document.getElementById("restartGameButton");
    
    let gameActive = true;

    // Room Navigation
    document.querySelectorAll(".navButton").forEach(button => {
        button.addEventListener("click", function () {
            if (gameActive) {
                const targetRoomId = this.getAttribute("data-room");
                switchRoom(targetRoomId);
            }
        });
    });

    // Object Interaction
    document.querySelectorAll(".object").forEach(object => {
        object.addEventListener("click", function () {
            if (gameActive) {
                const itemName = this.getAttribute("data-item");
                addToInventory(itemName);
                this.style.display = "none";
            }
        });
    });

    // Solve Puzzle
    solvePuzzleButton.addEventListener("click", function () {
        if (gameActive) {
            if (inventoryList.innerHTML.includes("Old Key") && inventoryList.innerHTML.includes("Mystery Book")) {
                showDialogue("Congratulations! You solved the puzzle and uncovered the secret!");
                gameActive = false; // Game is won
            } else {
                showDialogue("You need more items to solve this puzzle.");
            }
        }
    });

    // Close Dialogue
    closeDialogueButton.addEventListener("click", function () {
        dialogueBox.style.display = "none";
    });

    // Stop Game
    stopGameButton.addEventListener("click", function () {
        if (gameActive) {
            showDialogue("The game has been stopped.");
            gameActive = false;
        }
    });

    // Restart Game
    restartGameButton.addEventListener("click", function () {
        inventoryList.innerHTML = ""; // Clear inventory
        document.querySelectorAll(".object").forEach(object => {
            object.style.display = "block"; // Reset objects
        });
        switchRoom("room1"); // Reset to first room
        gameActive = true; // Reactivate game
        showDialogue("The game has been restarted.");
    });

    function addToInventory(item) {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        inventoryList.appendChild(listItem);
    }

    function switchRoom(roomId) {
        document.querySelectorAll(".room").forEach(room => {
            room.style.display = "none";
        });
        document.getElementById(roomId).style.display = "block";
    }

    function showDialogue(message) {
        dialogueText.textContent = message;
        dialogueBox.style.display = "block";
    }

    // Start game in the first room
    switchRoom("room1");
});
