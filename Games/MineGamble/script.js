document.addEventListener("DOMContentLoaded", function () {
    const boxContainer = document.querySelector(".box");
    const playButton = document.getElementById("play");
    const rangeInput = document.getElementById("rangeInput");
    const amountInput = document.querySelector(".console input[type='number']");
    const moneyDisplay = document.querySelector(".display-money");
    const cashoutButton = document.getElementById("cashout");

    let score = 10000;
    let betAmount = 0;
    let wonMoney = 0;
    let gameActive = false;

    function createGrid() {
        boxContainer.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            let box = document.createElement("div");
            box.classList.add("small-box");
            // box.textContent = "?"; // Add a placeholder text
            boxContainer.appendChild(box);
        }
    }

    function populateGrid(minesCount) {
        const boxes = document.querySelectorAll(".small-box");
        let minePositions = new Set();

        while (minePositions.size < minesCount) {
            let randomPosition = Math.floor(Math.random() * 25);
            minePositions.add(randomPosition);
        }

        boxes.forEach((box, index) => {
            if (minePositions.has(index)) {
                box.dataset.type = "bomb";
            } else {
                box.dataset.type = "diamond";
            }
            box.addEventListener("click", handleBoxClick);
        });
    }

    function handleBoxClick(event) {
        if (!gameActive) return;
        
        const box = event.target;
        if (box.dataset.type === "diamond") {
            box.textContent = "💎";
            box.classList.add("diamond");
            wonMoney += betAmount;
            updateMoneyDisplay();
        } else {
            box.textContent = "💣";
            box.classList.add("bomb");
            gameOver();
        }
        box.removeEventListener("click", handleBoxClick);
    }

    function updateMoneyDisplay() {
        moneyDisplay.textContent = `$${score + wonMoney}`;
    }

    function gameOver() {
        gameActive = false;
        score -= betAmount;
        moneyDisplay.textContent = `$${score}`;
        revealAllBoxes();
        alert(`Game Over! Your final money is $${score}`);
    }

    function revealAllBoxes() {
        const boxes = document.querySelectorAll(".small-box");
        boxes.forEach(box => {
            box.removeEventListener("click", handleBoxClick);
            if (box.dataset.type === "bomb") {
                box.textContent = "💣";
                box.classList.add("bomb");
            } else {
                box.textContent = "💎";
                box.classList.add("diamond");
            }
        });
    }

    function resetGame() {
        if (gameActive) {
            alert("Please cash out or finish the current game before starting a new one.");
            return;
        }
        
        betAmount = parseInt(amountInput.value) || 0;
        if (betAmount > score) {
            alert("Insufficient funds. Please enter a lower bet amount.");
            return;
        }
        
        wonMoney = 0;
        gameActive = true;
        updateMoneyDisplay();
        createGrid();
        populateGrid(parseInt(rangeInput.value));
    }

    function cashoutMoney() {
        if (!gameActive) return;
        
        gameActive = false;
        score += wonMoney;
        wonMoney = 0;
        updateMoneyDisplay();
        revealAllBoxes();
    }

    cashoutButton.addEventListener("click", cashoutMoney);
    playButton.addEventListener("click", resetGame);

    // Initial setup
    createGrid();
    updateMoneyDisplay();
});