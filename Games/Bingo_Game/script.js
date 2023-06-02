const container = document.querySelector('.container');

const crossSound = new Audio('./assets/sounds/crossSound.m4a');
const drawSound = new Audio('./assets/sounds/drawSound.mp3');
const failSound = new Audio('./assets/sounds/failSound.mp3');
const winSound = new Audio('./assets/sounds/winSound.mp3');
const welcomeSound = new Audio('./assets/sounds/welcomeSound.mp3');

// This will activate when page load
window.addEventListener('load', function () {
    let loadingPage = document.getElementById('loading-page');
    let mainPage = document.getElementById('main-page');
    let gamePage = document.getElementById('game-page');
    let startButton = document.getElementById('start-button');
    let messageElement = document.getElementById('message');
    let players = document.getElementById('players');

    mainPage.style.display = 'none';
    gamePage.style.display = 'none';
    loadingPage.style.display = 'flex';

    setTimeout(function () {
        loadingPage.style.display = 'none';
        gamePage.style.display = 'none';
        mainPage.style.display = 'block';
    }, 2200);

    startButton.addEventListener('click', function () {
        let playersInput = document.getElementById('players');

        let numPlayers = parseInt(playersInput.value);
        if (isNaN(numPlayers)) {
            failSound.play();
            messageElement.textContent = 'Please enter a value';
        } else if (numPlayers < 2 || numPlayers > 10) {
            failSound.play();
            messageElement.textContent = 'Please enter a number between 2 and 10';
        } else {
            welcomeSound.play();
            mainPage.style.display = 'none';
            gamePage.style.display = 'none';
            loadingPage.style.display = 'flex';

            setTimeout(function () {
                loadingPage.style.display = 'none';
                mainPage.style.display = 'none';
                gamePage.style.display = 'block';
                startGame(numPlayers);
            }, 1900);
        }
    });
    players.addEventListener('input', function () {
        messageElement.textContent = '';
    });
});

// StartGame function is trigger when start game button is pressed on the webpage
function startGame(numPlayers) {

    // This is handling the sound background sound effect
    let backgroundMusic = document.getElementById('backgroundMusic');
    let muteButton = document.getElementById('muteButton');
    let unmuteButton = document.getElementById('unmuteButton');
    let volumeSlider = document.getElementById('volumeSlider');

    function playBackgroundMusic() {
        backgroundMusic.play();
        unmuteButton.disabled = true;
    }
    playBackgroundMusic();

    function pauseBackgroundMusic() {
        backgroundMusic.pause();
    }

    function muteBackgroundMusic() {
        backgroundMusic.muted = true;
        muteButton.disabled = true;
        unmuteButton.disabled = false;
    }

    function unmuteBackgroundMusic() {
        backgroundMusic.muted = false;
        muteButton.disabled = false;
        unmuteButton.disabled = true;
    }

    muteButton.addEventListener('click', muteBackgroundMusic);
    unmuteButton.addEventListener('click', unmuteBackgroundMusic);

    function setVolume() {
        backgroundMusic.volume = volumeSlider.value;
    }

    muteButton.addEventListener('click', muteBackgroundMusic);
    unmuteButton.addEventListener('click', unmuteBackgroundMusic);

    volumeSlider.addEventListener('input', setVolume);

    // Game algorithm starts
    function shuffle(arr) {
        let currentIndex = arr.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }

    let data = [];
    for (var i = 0; i < numPlayers; i++) {
        data.push(Array(12).fill(false));
    }

    // This for loop creats the board for each and every player of the game
    for (let k = 0; k < numPlayers; k++) {
        let div = document.createElement('div');
        div.classList.add('card', `card-${k + 1}`);
        let table = document.createElement('table');
        table.setAttribute("id", "tblBingo");

        let playerNumber = document.createElement('p');
        playerNumber.classList.add('player');
        if (k === 0) {
            playerNumber.classList.add('nextPlayer');
        }
        playerNumber.textContent = `Player ${k + 1}`;

        div.appendChild(playerNumber);

        let iterator = 0;
        let arr = Array.apply(null, { length: 26 }).map(Number.call, Number);
        arr.shift();
        shuffle(arr);

        for (let i = 0; i < 5; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < 5; j++) {
                let td = document.createElement("td");
                td.id = arr[iterator].toString();
                td.style.height = "20%";
                td.style.width = "20%";
                td.classList.add("main-table-cell");

                let div = document.createElement("div");
                div.classList.add("cell-format");
                div.textContent = arr[iterator].toString();
                td.appendChild(div);
                tr.appendChild(td);
                iterator++;
            }
            table.appendChild(tr);
        }
        div.appendChild(table);

        let letterDiv = document.createElement('div');
        letterDiv.classList.add('letter-div');
        let tableLetter = document.createElement('table');
        tableLetter.setAttribute("id", "tblLetter");
        let letterRow = document.createElement('tr');
        let letters = ['B', 'I', 'N', 'G', 'O'];
        for (let a = 0; a < 5; a++) {
            let letterColumn = document.createElement('td');
            letterColumn.classList.add('letters-bingo');
            letterColumn.textContent = letters[a];
            letterRow.appendChild(letterColumn);
        }
        tableLetter.appendChild(letterRow);
        letterDiv.appendChild(tableLetter);

        div.appendChild(letterDiv);

        container.appendChild(div);
    }

    // This will activate all the function on each and every clicked on the numbers
    document.addEventListener('click', function (event) {
        let text = event.target.textContent;
        if (text >= 1 && text <= 25) {
            crossSound.play();

            addStrike(text);
            changePlayer(event);
            addEffect();
            checkWinningConditions();
        }
    });

    // This function adds crosses on the numbers after clicked
    function addStrike(text) {
        const cards = document.querySelectorAll('.card');
        for (let k = 0; k < numPlayers; k++) {
            const cells = cards[k].querySelectorAll('.main-table-cell');
            for (let i = 0; i < 25; i++) {
                if (cells[i].textContent === text) {
                    cells[i].classList.add('strikeout');
                }
            }
        }
    }

    // This function handles the change of the player
    function changePlayer(event) {
        const cards = document.querySelectorAll('.card');

        let clickedCard = event.target.closest('.card');
        let str = clickedCard.classList[1];
        let index = parseInt(str.slice(str.indexOf('-') + 1));
        let lastPlayer = clickedCard.querySelector('p');
        if (lastPlayer.classList.contains('nextPlayer')) {
            lastPlayer.classList.remove('nextPlayer');
        }

        index = (index % numPlayers) + 1;
        let nextPlayer = `card-${index}`;

        cards.forEach(function (card) {
            let currentCard = card.classList[1];
            if (currentCard === nextPlayer) {
                let para = card.querySelector('p');
                para.classList.add('nextPlayer');
            }
        });
    }

    // Adding extra css for the pressed numbers and handling the board effect
    function addEffect() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(function (card) {
            let isCurrentPlayer = card.querySelector('p').classList.contains('nextPlayer');
            const cell = card.querySelectorAll('.main-table-cell');
            if (!isCurrentPlayer) {
                card.style.pointerEvents = "none";
                for (let i = 0; i < 25; i++) {
                    if (!cell[i].classList.contains('strikeout')) {
                        let target = cell[i].getElementsByClassName('cell-format')[0];
                        target.style.opacity = 0.6;
                    }
                }
            }
            if (isCurrentPlayer) {
                card.style.pointerEvents = "";
                for (let i = 0; i < 25; i++) {
                    if (!cell[i].classList.contains('strikeout')) {
                        let target = cell[i].getElementsByClassName('cell-format')[0];
                        target.style.opacity = 1;
                    }
                }
            }
        });
    }
    addEffect();

    // Handling the winning conditions and check on every click
    function checkWinningConditions() {
        const cards = document.querySelectorAll('.card');
        for (let k = 0; k < numPlayers; k++) {
            const cell = cards[k].querySelectorAll('.main-table-cell');
            const letter = cards[k].querySelectorAll('.letters-bingo');
            const winningPositions = [
                [0, 1, 2, 3, 4],
                [5, 6, 7, 8, 9],
                [10, 11, 12, 13, 14],
                [15, 16, 17, 18, 19],
                [20, 21, 22, 23, 24],
                [0, 5, 10, 15, 20],
                [1, 6, 11, 16, 21],
                [2, 7, 12, 17, 22],
                [3, 8, 13, 18, 23],
                [4, 9, 14, 19, 24],
                [0, 6, 12, 18, 24],
                [4, 8, 12, 16, 20]
            ]

            checkMatchWin(cell, k, winningPositions);

            let cnt = 0, j = 0;
            for (let i = 0; i < 12; i++) {
                if (data[k][i]) cnt++;
            }

            while (j < cnt) {
                letter[j].classList.add('show-bingo');
                j++;
                if (j === 5) {
                    pauseBackgroundMusic();
                    if (checkDrawCondition()) {
                        winSound.play();
                        giveCongratulations(k);
                        setTimeout(function () {
                            location.reload();
                        }, 5500);
                    } else {
                        drawSound.play();
                        alert("Game Draw !!");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }
                }
            }
        }
    }

    // Before announcing winner, checking draw condition
    function checkDrawCondition() {
        let a = [];
        for (let i = 0; i < numPlayers; i++) {
            let cnt = 0;
            for (let j = 0; j < 12; j++) {
                if (data[i][j]) cnt++;
            }
            if (a.includes(cnt)) return false;
            else if (cnt >= 5) {
                for (let x = 0; x < a.length; x++) {
                    if (a[x] >= cnt) return false;
                }
            }
            a.push(cnt);
        }
        return true;
    }

    function checkMatchWin(cell, k, winningPositions) {
        for (let i = 0; i < 12; i++) {
            if (!data[k][i]) {
                let flag = true;
                for (let j = 0; j < 5; j++) {
                    if (!cell[winningPositions[i][j]].classList.contains('strikeout')) {
                        flag = false;
                        break;
                    }
                }
                data[k][i] = flag;
            }
        }
    }

    // Adding congratulation page which declare the winner of the game.
    function giveCongratulations(id) {
        let congratsPage = document.getElementById('congratsPage');
        var winnerNumberElement = document.getElementById('winnerName');
        winnerNumberElement.textContent = id + 1;

        let loadingPage = document.getElementById('loading-page');
        let mainPage = document.getElementById('main-page');
        let gamePage = document.getElementById('game-page');

        loadingPage.style.display = 'none';
        mainPage.style.display = 'none';
        gamePage.style.display = 'none';
        congratsPage.style.display = 'flex';
    }

}
