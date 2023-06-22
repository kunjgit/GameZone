import four_letters from './word_files/four_letters.json' assert { type: 'json' };
import five_letters from './word_files/five_letters.json' assert { type: 'json' };
import three_letters from './word_files/three_letters.json' assert { type: 'json' };


const createBoxes = (size) => {
    document.querySelector('.box-container').innerText = '';
    for(let i=0;i<size*6; i++) {
        const newBox = document.createElement('div')
        newBox.classList.add('box');

        document.querySelector('.box-container').append(newBox);
    }
    document.querySelector('.box-container').style.gridTemplateColumns = `repeat(${size}, var(--box-size))`;
}

// initialise score and size if not assigned

if(!localStorage.getItem('score')) {
    localStorage.setItem('score', 0);
}

if(!localStorage.getItem('size')) {
    localStorage.setItem('size', 4);
}

// fetch the preferred word size

let word_size = parseInt(localStorage.getItem('size'));
createBoxes(word_size);


let boxes = Array.from(document.querySelectorAll('.box'));
boxes[0].classList.add('selected');
const keys = document.querySelectorAll('.key');
const popup = document.querySelector('.popup');
const resetBtn = document.querySelector('.play');
const resetScore = document.querySelector('.reset-score');

const increaseBtn = document.querySelector('.size-inc');
const decreaseBtn = document.querySelector('.size-dec');

const settingBtn = document.querySelector('.setting-btn')
const closePopup = document.querySelector('.close-popup');

// open/close setting popup

const open_setting = () => {
    if(settingIsOpen) return;

    document.querySelector('.word-length').innerText = localStorage.getItem('size');
    document.querySelector('.setting').style.transform = 'scale(1)';
    paused = true;

    settingIsOpen = true;
}

const close_setting = () => {
    document.querySelector('.setting').style.transform = 'scale(0)';
    paused = false;

    settingIsOpen = false;
}

settingBtn.addEventListener('click', open_setting);
closePopup.addEventListener('click', close_setting);

increaseBtn.addEventListener('click', () => {
    let size = parseInt(document.querySelector('.word-length').innerText);
    if(size == 5) return;

    size += 1;
    document.querySelector('.word-length').innerText = size;
    localStorage.setItem('size', size);

    reset();
})

decreaseBtn.addEventListener('click', () => {
    let size = parseInt(document.querySelector('.word-length').innerText);
    if(size == 3) return;

    size -= 1;
    document.querySelector('.word-length').innerText = size;
    localStorage.setItem('size', size);

    reset();
})

resetScore.addEventListener('click', (e) => {
    if(e.detail >= 1) {
        document.querySelector('.high-score').innerText = 0;
        localStorage.setItem('score', 0);
    }
});

let paused = false;
let settingIsOpen = false;
let word = randomWord(word_size).toUpperCase();
console.log(word)
let guessWord = ''
let guessCount = 1;
let score = 12;
let high_score = parseInt(localStorage.getItem('score'));

document.querySelector('.high-score').innerText = high_score;

function randomWord(size) {
    let word_list = four_letters['words'];
    if(size == 5) {
        word_list = five_letters['words'];
    } else if(size == 3) {
        word_list = three_letters['words'];
    }

    return word_list[Math.floor(Math.random() * word_list.length)];
}

keys.forEach((key) => {
    key.addEventListener('click', (e) => {

        const letter = e.target.innerText;

        if (paused) return;

        if (letter === '←') {
            eraseLetter();

            return;
        }

        if (letter == 'Enter') {
            if (guessWord.length !== word_size) return;

            changeBoxColor();
            checkWin();

            return;
        }

        insertLetter(letter);
    })
})

document.addEventListener('keyup', (event) => {
    if (paused)
        return;

    if (event.key == 'Backspace') eraseLetter();

    if (event.key === 'Enter') {

        if (guessWord.length !== word_size) return;

        changeBoxColor();
        checkWin();
    }


    if (event.key.match('[A-Za-z]') === null || event.key.length !== 1) {
        return;
    }

    insertLetter(event.key.toUpperCase());
})

// get current active box where letter need to be inserted
function getActiveBox(box, index) {
    return box.classList.contains('selected');
}

function eraseLetter() {
    const activeBox = boxes.findIndex(getActiveBox);
    boxes[activeBox].classList.remove('selected');

    guessWord = guessWord.substring(0, guessWord.length - 1);
    const pos = (word.length * (guessCount - 1)) + guessWord.length;

    boxes[pos].innerText = '';
    boxes[pos].classList.add('selected');
}

function changeBoxColor() {
    const currentActiveIndex = boxes.findIndex(getActiveBox) + 1;
    const previousBoxes = [...boxes].slice((guessCount * word_size) - word_size, currentActiveIndex);

    previousBoxes.forEach((box, ind) => {
        if (box.innerText === word[ind]) {
            box.style.color = 'white';
            box.style.backgroundColor = 'green';

            // changing color of key elements
            keys.forEach((k) => {
                if (k.innerText === word[ind]) {
                    k.style.backgroundColor = 'green';
                }
            })

        } else if (word.includes(box.innerText)) {
            box.style.color = 'white';
            box.style.backgroundColor = '#d4bc22';

            keys.forEach((k) => {
                if (box.innerText === k.innerText) {
                    k.style.backgroundColor = '#d4bc22';
                }
            })
        } else {
            box.style.color = 'white';
            box.style.backgroundColor = '#292929';

            keys.forEach((k) => {
                if (box.innerText === k.innerText) {
                    k.style.backgroundColor = '#292929';
                }
            })

        }
    })
}

function checkWin() {
    if (guessWord === word) {
        console.log('You Won !!!');

        clearInterval(interval);

        //update score

        updateScores();

        paused = true;

        if(high_score < parseInt(document.querySelector('.score').innerText)) {
            showPopup('You Won !!!', `High Score : ${score}`);
        } else {
            showPopup('You Won !!!', `Score : ${score}`);
        }   

        return true;
    }

    if (guessCount == 6) {
        console.log('You lost :(');

        clearInterval(interval);

        paused = true;
        showPopup('You Lost :(', `The correct word was ${word}`);

        return true;
    }
    const currentActiveInd = boxes.findIndex(getActiveBox);
    boxes[currentActiveInd].classList.remove('selected');

    const activeInd = guessCount * word_size;
    boxes[activeInd].classList.add('selected');

    guessWord = '';
    guessCount += 1;

    score -= 2;
}

function insertLetter(key) {
    const pos = boxes.findIndex(getActiveBox);
    const activeBox = boxes[pos];

    activeBox.innerText = key;

    if (guessWord.length === word.length) {
        guessWord = guessWord.substring(0, guessWord.length - 1);
    }

    guessWord += key;

    if (guessWord.length !== word.length) {
        activeBox.classList.remove('selected');
        boxes[pos + 1].classList.add('selected');
    }
}

resetBtn.addEventListener('click', (e) => {
    if(e.detail >= 1) reset();
})

// show popup on win or loss

function showPopup(title, message) {
    popup.querySelector('h2').innerText = title;
    popup.querySelector('p').innerText = message;

    popup.style.transform = 'scale(1)';
}


// display score

const updateScores = () => {
    const prevScore = parseInt(document.querySelector('.score').innerText)
    score = prevScore + score;

    document.querySelector('.score').innerText = score;

    if(high_score < score) {
        localStorage.setItem('score', score);
        document.querySelector('.high-score').innerText = localStorage.getItem('score');
        console.log('new high score = ',score);
    }
}

// start timer

let interval = null;
let countdown = 59;

const startTimer = () => {
    countdown = 59;

    const timer = document.querySelector('.timer');
    const timer_val = timer.querySelector('.circle');
    timer_val.innerText = '1:00';

    timer.style.background = `conic-gradient(rgb(236, 181, 15) 0deg, rgb(47, 45, 45) 0deg)`;
    
    interval = setInterval(() => {
        if(paused) return;

        timer.style.background = `conic-gradient(rgb(236, 181, 15) ${(60 - countdown) * 6}deg, rgb(47, 45, 45) 0deg)`;

        timer_val.innerText = `0:${countdown}`;
        countdown--;


        if (countdown < 0) {
            if(settingIsOpen) {
                close_setting();
            }
            showPopup('Times up !!!', `The correct word was ${word}`);

            timer_val.innerText = `0:00`;
            clearInterval(interval);
        }
    }, 1000)
}

startTimer();


// reset the game

const reset = () => {
    clearInterval(interval);

    if(settingIsOpen) {
        paused = true;
    } else {
        paused = false;
        settingIsOpen = false;
    }

    
    guessWord = ''
    guessCount = 1;
    score = 12;
    high_score = parseInt(localStorage.getItem('score'));
    
    word_size = parseInt(localStorage.getItem('size'));

    word = randomWord(word_size).toUpperCase();
    console.log(word)

    createBoxes(word_size);

    popup.style.transform = 'scale(0)';

    boxes = Array.from(document.querySelectorAll('.box'));

    keys.forEach((k) => { 
        k.style.backgroundColor = 'black';
    })

    boxes.forEach((box) => {
        box.style.backgroundColor = 'black'
        box.innerText = '';
    })
    boxes.forEach((box) => {
        if(box.classList.contains('selected')) {
            box.classList.remove('selected');
        }
    })

    boxes[0].classList.add('selected');

    startTimer();
}