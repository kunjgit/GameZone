const data = {
    "bollywood": [
        {
            "name": "O Saki Saki",
            "path": "./songs/O Saki Saki.mp3"
        },
        {
            "name": "Apna Bna Le",
            "path": "./songs/Apna Bna Le.mp3"
        },
        {
            "name": "Jeda Nasha Nasha",
            "path": "./songs/Jeda Nasha Nasha.mp3"
        },
        {
            "name": "Jhoome Jo Pathan",
            "path": "./songs/Jhoome Jo Pathan.mp3"
        },
        {
            "name": "Aafat - Liger",
            "path": "./songs/Aafat - Liger.mp3"
        },
        {
            "name": "Thumkeswari",
            "path": "./songs/Thumkeswari.mp3"
        },
        {
            "name": "Om Deva Deva",
            "path": "./songs/Om Deva Deva.mp3"
        },
        {
            "name": "Nacho Nacho",
            "path": "./songs/Nacho Nacho.mp3"
        },
        {
            "name": "Mast Nazron Se Allah Bachaye",
            "path": "./songs/Mast Nazron Se Allah Bachaye.mp3"
        },
        {
            "name": "Current Laga Re",
            "path": "./songs/Current Laga Re.mp3"
        },
        {
            "name": "Chorbazari",
            "path": "./songs/Chorbazari.mp3"
        },
        {
            "name": "Chand Chuppa",
            "path": "./songs/Chand Chuppa.mp3"
        },
        {
            "name": "Aapke Pyaar Mein Hum",
            "path": "./songs/Aapke Pyaar Mein Hum.mp3"
        },
        {
            "name": "Apni Toh Jaise Taise",
            "path": "./songs/Apni Toh Jaise Taise.mp3"
        },
        {
            "name": "Ban Meri Rani",
            "path": "./songs/Ban Meri Rani.mp3"
        },
        {
            "name": "Bholi Si Surat",
            "path": "./songs/Bholi Si Surat.mp3"
        },
        {
            "name": "Chupke Chupke",
            "path": "./songs/Chupke Chupke.mp3"
        },
        {
            "name": "Daru Badnam",
            "path": "./songs/Daru Badnam.mp3"
        },
        {
            "name": "Girl I Need You",
            "path": "./songs/Girl I Need You.mp3"
        },
        {
            "name": "Kaun Tujhe",
            "path": "./songs/Kaun Tujhe.mp3"
        },
        {
            "name": "Kitna Haseen Chehra",
            "path": "./songs/Kitna Haseen Chehra.mp3"
        },
        {
            "name": "Maarkhayega",
            "path": "./songs/Maarkhayega.mp3"
        },
        {
            "name": "Neele Neele Amber",
            "path": "./songs/Neele Neele Amber.mp3"
        },
        {
            "name": "Ramaiya Vastavaiya",
            "path": "./songs/Ramaiya Vastavaiya.mp3"
        },
        {
            "name": "Tujh Me Rab Dikhta",
            "path": "./songs/Tujh Me Rab Dikhta.mp3"
        },
        {
            "name": "Zara Tasveer Se Tu",
            "path": "./songs/Zara Tasveer Se Tu.mp3"
        }
    ]
};

const gameOver = new Audio('./sounds/gameOver.mp3');
const playAgain = new Audio('./sounds/playAgain.mp3');
const rightAnswer = new Audio('./sounds/rightAnswer.mp3');
const wrongAnswer = new Audio('./sounds/wrongAnswer.mp3');

// At the start of the game or on reloading the game
window.addEventListener('load', () => {
    let loadingPage = document.getElementById('loading-page');
    let gamePage = document.getElementById('game-page');
    let startButton = document.getElementById('start-game');

    gamePage.style.display = 'none';

    startButton.addEventListener('click', (event) => {
        event.preventDefault();
        loadingPage.style.display = 'none';
        gamePage.style.display = 'grid';
        startGame();
    });
});

function startGame() {
    let categoryInputs = ['bollywood'];
    // List of the played songs during a complete game
    let lastSongs = [];

    // Check the game is still playing or not
    let isPlaying = true;

    // Storing the chosen category songs in a list
    let songs = [];
    categoryInputs.forEach(function (category) {
        if (data.hasOwnProperty(category)) {
            songs = songs.concat(data[category]);
        }
    });

    // Function handling of reloading the page
    function pageReload() {
        playAgain.play();
        playAgain.addEventListener('ended', function () {
            location.reload();
        });
    }

    // Working of New Game Button
    let btnNew = document.querySelector('.btn-new');
    btnNew.addEventListener('click', pageReload);

    let player1 = document.querySelector('.player-1');
    let player2 = document.querySelector('.player-2');
    let container1 = document.querySelector('.options-container-1');
    let container2 = document.querySelector('.options-container-2');
    let optionBtn = document.querySelectorAll('.option');
    let btnNext = document.querySelector('.btn-next');
    let scores = document.querySelectorAll('.score');

    function nextSong() {
        let randomIndex = Math.floor(Math.random() * songs.length);
        while (lastSongs.includes(randomIndex)) randomIndex = Math.floor(Math.random() * songs.length);
        lastSongs.push(randomIndex);
        if (lastSongs.length > 15) lastSongs.shift();

        let randomSong = songs[randomIndex];
        let s = document.querySelector('.song');
        let audio = new Audio(randomSong.path);
        let timeoutId;
        audio.play();
        s.style.display = '';
        container1.style.display = 'none';
        container2.style.display = 'none';
        btnNext.style.display = 'none';

        audio.addEventListener('play', function () {
            timeoutId = setTimeout(function () {
                audio.pause();
                s.style.display = 'none';
                randomOptionFill(randomIndex, songs);
            }, 10000);
        });

        audio.addEventListener('ended', function () {
            clearTimeout(timeoutId);
        });
    }
    nextSong();

    // Switch player function
    function switchPlayer() {
        optionBtn.forEach(b => {
            if (b.classList.contains('correct-option')) b.classList.remove('correct-option');
            else if (b.classList.contains('wrong-option')) b.classList.remove('wrong-option');
        });
        if (isPlaying) {
            if (player1.classList.contains('player-active')) {
                container1.style.display = 'none';
                container2.style.display = '';
            } else {
                container1.style.display = '';
                container2.style.display = 'none';
            }
            player1.classList.toggle('player-active');
            player2.classList.toggle('player-active');
            nextSong();
        }
    };
    btnNext.addEventListener('click', switchPlayer);

    // Function which shuffle the values of 4 random variables
    function shuffle(a, b, c, d) {
        let values = [a, b, c, d];
        for (let i = values.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = values[i];
            values[i] = values[j];
            values[j] = temp;
        }
        return values;
    }

    // Function handling the random the options
    function randomOptionFill(id, songs) {
        let random1 = Math.floor(Math.random() * songs.length);
        while (random1 == id) random1 = Math.floor(Math.random() * songs.length);

        let random2 = Math.floor(Math.random() * songs.length);
        while (random2 == id || random1 == random2) random2 = Math.floor(Math.random() * songs.length);

        let random3 = Math.floor(Math.random() * songs.length);
        while (random3 == id || random1 == random3 || random2 == random3) random3 = Math.floor(Math.random() * songs.length);

        if (player1.classList.contains('player-active')) {
            let values = shuffle(random1, random2, random3, id);
            let option1 = document.getElementById('btn-11');
            option1.innerHTML = songs[values[0]].name;

            let option2 = document.getElementById('btn-12');
            option2.innerHTML = songs[values[1]].name;

            let option3 = document.getElementById('btn-13');
            option3.innerHTML = songs[values[2]].name;

            let option4 = document.getElementById('btn-14');
            option4.innerHTML = songs[values[3]].name;

            container1.style.display = '';
            container2.style.display = 'none';
        } else {
            let values = shuffle(random1, random2, random3, id);
            let option1 = document.getElementById('btn-21');
            option1.innerHTML = songs[values[0]].name;

            let option2 = document.getElementById('btn-22');
            option2.innerHTML = songs[values[1]].name;

            let option3 = document.getElementById('btn-23');
            option3.innerHTML = songs[values[2]].name;

            let option4 = document.getElementById('btn-24');
            option4.innerHTML = songs[values[3]].name;

            container1.style.display = 'none';
            container2.style.display = '';
        }

        function optionClickHandler(event) {
            let clickedBtn = event.target;
            if (clickedBtn.innerHTML == songs[id].name) {
                rightAnswer.play();
                rightAnswer.addEventListener('ended', function () {
                    btnNext.style.display = '';
                });
                clickedBtn.classList.add('correct-option');
                if (player1.classList.contains('player-active')) {
                    scores[0].innerHTML = parseInt(scores[0].innerHTML) + 1;
                } else {
                    scores[1].innerHTML = parseInt(scores[1].innerHTML) + 1;
                }
                if (parseInt(scores[0].innerHTML) === 10 || parseInt(scores[1].innerHTML) == 10) {
                    isPlaying = false;
                    gameOver.play();
                    document.querySelector('.player-active').classList.add('player-winner');
                    btnNext.style.display = 'none';
                }
            } else {
                wrongAnswer.play();
                wrongAnswer.addEventListener('ended', function () {
                    btnNext.style.display = '';
                });
                clickedBtn.classList.add('wrong-option');
                if (player1.classList.contains('player-active')) {
                    scores[0].innerHTML = parseInt(scores[0].innerHTML) - 1;
                } else {
                    scores[1].innerHTML = parseInt(scores[1].innerHTML) - 1;
                }
            }
            optionBtn.forEach(btn => {
                btn.removeEventListener('click', optionClickHandler);
            });
        }
        optionBtn.forEach(btn => {
            btn.addEventListener('click', optionClickHandler);
        });
    }
}
