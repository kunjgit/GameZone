const symbols = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍒'];
let balance = 100;

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const rulesButton = document.getElementById('rulesButton');
const balanceDisplay = document.getElementById('balance');
const messageDisplay = document.getElementById('message');

function updateBalance() {
    balanceDisplay.textContent = balance;
}

function spin() {
    if (balance < 10) {
        messageDisplay.textContent = "Not enough balance to spin!";
        messageDisplay.style.color = "#f44336";
        return;
    }

    balance -= 10;
    updateBalance();

    spinButton.disabled = true;
    messageDisplay.textContent = "";

    // Add spin animation
    reel1.classList.add('spin');
    reel2.classList.add('spin');
    reel3.classList.add('spin');

    setTimeout(() => {
        const result1 = symbols[Math.floor(Math.random() * symbols.length)];
        const result2 = symbols[Math.floor(Math.random() * symbols.length)];
        const result3 = symbols[Math.floor(Math.random() * symbols.length)];

        reel1.textContent = result1;
        reel2.textContent = result2;
        reel3.textContent = result3;

        // Remove spin animation
        reel1.classList.remove('spin');
        reel2.classList.remove('spin');
        reel3.classList.remove('spin');

        if (result1 === result2 && result2 === result3) {
            balance += 50;
            messageDisplay.textContent = "Congratulations! You won $50!";
            messageDisplay.style.color = "#4CAF50";
        } else {
            messageDisplay.textContent = "Try again!";
            messageDisplay.style.color = "#2196F3";
        }

        updateBalance();
        spinButton.disabled = false;
    }, 1000);
}

function resetGame() {
    balance = 100;
    updateBalance();
    reel1.textContent = '🍎';
    reel2.textContent = '🍊';
    reel3.textContent = '🍇';
    messageDisplay.textContent = "";
}

function showRules() {
    alert("Fruity Fortune Slot Machine Rules:\n\n" +
          "1. Each spin costs $10\n" +
          "2. Match all three symbols to win $50\n" +
          "3. Starting balance is $100\n" +
          "4. Game over when balance reaches $0");
}

spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);
rulesButton.addEventListener('click', showRules);

updateBalance();