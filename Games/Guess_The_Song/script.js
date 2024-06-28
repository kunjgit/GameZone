const moviesObject = {
    "🎸🎤🔥": "We Will Rock You",
    "👶👶": "Baby",
    "💃🕺": "Despacito",
    "🌧️☔": "Purple Rain",
    "🎅🏠": "Santa Claus is Coming to Town",
    "😢🎤": "Crying",
    "🌧️🌧️🔥": "Tip Tip Barsa Pani",
    "😜👩🏻😜": "Aankh Maare",
    "👁️⚫": "Yeh Kaali Kaali Aankhen",
    "💃🏽💍": "London Thumakda",
    "🌟🌛": "Chand Sifarish",
    "🏍️🏍️🏍️": "Dhoom Machale",
    "😊": "Smile",
    "🥳🥳🥳": "Happy Birthday",
    "🛏️👦": "Bad Guy",
    "🕺🐒": "Dance Monkey",
    "👻": "Ghots",
    "⭐🤘": "Rockstar",
    "🚀👶": "Rocket Man",
    "🎅👶": "Santa Baby",
};
const container = document.querySelector(".container");
const startButton = document.getElementById("start");
const letterContainer = document.getElementById("letter-container");
const resultContainer = document.querySelector(".result-container");
const userInputSection = document.getElementById("userInputSection");
const resultText = document.getElementById("result");
const hints = Object.keys(moviesObject);
let randomHint = "",
randomWord = "";
let winCount = 0,
lossCount = 5;

const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

// Blocker
const blocker = () => {
    let letterButtons = document.querySelectorAll(".letters");
    letterButtons.forEach((button) => {
        button.disabled = true;
    });
};

// Start game
const startGame = () => {
    init();
};

// Generate Word
const generateWord = () => {
    letterContainer.classList.remove("hide");
    userInputSection.innerText = "";
    randomHint = hints[generateRandomValue(hints)];
    randomWord = moviesObject[randomHint];
    container.innerHTML = `<div id="movieHint">${randomHint}</div>`;
    let displayItem = "";
    randomWord.split("").forEach((value) => {
        if (value == " ") {
            winCount += 1;
            displayItem += `<span class="inputSpace">&nbsp;</span>`;
        } else {
            displayItem += `<span class="inputSpace">_</span>`;
        }
    });
    userInputSection.innerHTML = displayItem;
};

// Initial Function
const init = () => {
    winCount = 0;
    lossCount = 5;
    document.getElementById(
        "chanceCount"
    ).innerHTML = `<span>Tries Left: </span>${lossCount}`;
    randomHint = null;
    randomWord = "";
    userInputSection.innerHTML = "";
    letterContainer.classList.add("hide");
    letterContainer.innerHTML = "";
    generateWord();
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        // Number to ASCII [A - Z]
        button.innerText = String.fromCharCode(i);
        // Character button click
        button.addEventListener("click", () => {
            let charArray = randomWord.toUpperCase().split("");
            let inputSpace = document.getElementsByClassName("inputSpace");
            if (charArray.includes(button.innerText)) {
                charArray.forEach((char, index) => {
                if (char === button.innerText) {
                        button.classList.add("used");
                        inputSpace[index].innerText = char;
                        winCount += 1;
                        if (winCount == charArray.length) {
                            resultText.innerHTML = "You Won";
                            resultContainer.style.display = '';
                            blocker();
                        }
                    }
                });
            } else {
                lossCount -= 1;
                document.getElementById(
                "chanceCount"
                ).innerHTML = `<span>Tries Left: </span> ${lossCount}`;
                button.classList.add("used");
                if (lossCount == 0) {
                    resultText.innerHTML = "Game Over";
                    blocker();
                    resultContainer.style.display = '';
                    letterContainer.classList.add("hide");
                }
            }
            button.disabled = true;
            });
        letterContainer.appendChild(button);
    }
};

window.onload = () => {
    startGame();
};
