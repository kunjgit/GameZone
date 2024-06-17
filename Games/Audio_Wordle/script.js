var era = null;
const tunes = [
    { answer: "MOHIT", link: "https://www.youtube.com/watch?v=Cb6wuzOurPc", audio: "testAudio/Tum_Se_Hi_Mohit.mp3" },
    { answer: "NITIN", link: "https://www.youtube.com/watch?v=BG8w0DNIYWw", audio: "testAudio/Zindagi_Ka_Naam_Dosti_Nitin.mp3"},
    { answer: "JAVED", link: "https://www.youtube.com/watch?v=PukqEK_CPaQ", audio: "testAudio/Maula_Javed.mp3"},
    { answer: "SHAAN", link: "https://www.youtube.com/watch?v=7PzwOiW8-n0", audio: "testAudio/All_Iz_Well_Shaan.mp3"},
    { answer: "REKHA", link: "https://www.youtube.com/watch?v=7jZwAl0ArQw", audio: "testAudio/Kabira_Rekha"},
    { answer: "VINOD", link: "https://www.youtube.com/watch?v=UCsW7nea7sI", audio: "testAudio/Ae_Mere_Humsafar_Vinod.mp3"}
];

let selectedTune = tunes[Math.floor(Math.random() * tunes.length)];
const answer = selectedTune.answer;
const link = selectedTune.link;
const audio = selectedTune.audio;

const num_guesses = 6;
var guess = [];
var guess_;
var currentLevel = 1;
var currentBox = 1;

const colors = ["#54514a","#e0c40b","rgb(125,183,0)"];
const textColor = ["#21241f","#f0f8ff"];
const finished = ["brilliant!","magnificent!","great work!","well done!","spot on!","correct!","no attempts left!","hard luck!"];
const delay = 100;


window.addEventListener('DOMContentLoaded', (event) => {
    var aud = document.getElementsByClassName("clue1")[0];
    aud.src = audio;
    
    for (let i=1; i<=num_guesses; i++) {
        let row = document.querySelector(".row-"+i);
        let boxes = row.children;
        for (let j = 1; j<=answer.length; j++) {
            boxes[j-1].style.display = "flex";
            boxes[j-1].style.width = Math.min(85/answer.length, 17)+"%";
        }
    }

    activateKeyboard();

    cluebox.addEventListener("click", async function() {
        clueNeeded(cluebox);
    });
});

function activateKeyboard() {
    document.documentElement.addEventListener('keydown',handleKeys,false);

    let keyb_rows = document.querySelector(".keyboard").children;
    for (let i=0;i<keyb_rows.length;i++) {
        let keys = (keyb_rows[i].children);
        for(let j=0;j<keys.length;j++) {
            keys[j].addEventListener("click",function() {
                handleKeys(keys[j].className);
            });
        }
    }
}

function displayAnswer() {
    document.querySelector("#link").href = link;
    document.querySelector("#link").innerText= link;
    document.querySelector(".finish").style.display = "block";
    document.querySelector(".finish_").innerText = "answer: " + answer + " ";
}

async function clueNeeded(cb) {
    cb.style.transform = "scale(0.2,0.17)";
    await sleep(100);
    cb.style.opacity = "0";
    cb.style.display = "none";

    if (currentLevel>num_guesses) {
        let messageBox = document.querySelector(".message-box");
        let message = messageBox.firstChild;
        message.innerHTML = finished[num_guesses];
        messageBox.style.display = "flex";
        document.documentElement.removeEventListener('keydown',handleKeys,false);
        displayAnswer();
    }
    else {
        document.querySelector(".clue2").style.display = "flex";
        await sleep(100);
        document.querySelector(".clue2").style.opacity = "1";
        document.querySelector("#guess-instructions").innerText = "guess the movie in 6 attempts!";
    }
}

async function setEra(input_era) {
    era = input_era;
    document.querySelector(".era").style.opacity = "0";
    await sleep(500);
    document.querySelector(".era").style.display = "none";
    document.querySelector(".container").style.display = "flex";
    await sleep(200);
    document.querySelector(".container").style.opacity = "1";
}

function handleKeys(e) {
    let messageBox = document.querySelector(".message-box");
    let message = messageBox.firstChild;
    let inp ="";

    if (typeof e === 'string') {
        inp = e;
    }
    else{
        inp = e.key;
    }
    
    if (guess_!==answer && currentLevel<=num_guesses){
        messageBox.style.display = "none";
    
        if (isLetter(inp)) {
            if (currentBox<=answer.length) {
                let key = inp.toUpperCase();
                guess.push(key);
                updateLevel(key)
            }
        }
        else if (inp === 'Backspace' && currentBox>1) {
            let row = document.getElementsByClassName("row-"+(currentLevel))[0];
            let box = row.children[currentBox-2];
            guess.pop(box.innerHTML);
            box.innerHTML = "";
            box.style.border = "3px solid #a9a9a9";
            currentBox -=1;
        }
        else if (inp === 'Enter') {
            if (guess.length===answer.length) {
                submit();
            }
            else {
                message.innerHTML = "not enough letters!";
                messageBox.style.display = "flex";
            }
        }
    }
    else {
        document.documentElement.removeEventListener('keydown',handleKeys,false);
    }

    if (currentLevel>num_guesses) {
        message.innerHTML = finished[num_guesses];
        messageBox.style.display = "flex";
        displayAnswer();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function updateLevel(letter) {
    let row = document.getElementsByClassName("row-"+currentLevel)[0];
    let box = row.children[currentBox-1];
    box.innerHTML = letter;
    box.style.border = "3px solid #666666";
    currentBox += 1;
}

async function submit() {
    let row = document.getElementsByClassName("row-"+currentLevel)[0];
    let boxes = row.children;
    let correct = 0;

    guess_ = guess.join("");

    for (let i=0; i<answer.length; i++) {
        if (guess[i]===answer[i]) {
            await sleep(delay);
            colorBox(boxes[i],colors[2]);
            colorKey(guess[i],colors[2]);
            correct += 1;
        }
        else if (answer.includes(guess[i])) {
            await sleep(delay);
            colorBox(boxes[i],colors[1]);
            colorKey(guess[i],colors[1]);
        }
        else {
            await sleep(delay);
            colorBox(boxes[i],colors[0]);
            colorKey(guess[i],colors[0]);
        }
    }

    if (correct===answer.length) {
        let messageBox = document.querySelector(".message-box");
        let message = messageBox.firstChild;
        message.innerHTML = finished[currentLevel-1];
        messageBox.style.display = "flex";
        displayAnswer();
        document.documentElement.removeEventListener('keydown',handleKeys,false);
    }
    else {
        currentLevel += 1;
        currentBox = 1;
        guess = [];
        let messageBox = document.querySelector(".message-box");
        let message = messageBox.firstChild;
        message.innerHTML = "try again!";
        messageBox.style.display = "flex";
    }
}

function colorBox(box,color) {
    box.style.backgroundColor = color;
    box.style.border = "3px solid "+color;
    box.style.color = "#f0f8ff";
}

function colorKey(key,color) {
    let keyb_rows = document.querySelector(".keyboard").children;
    for (let i=0;i<keyb_rows.length;i++) {
        let keys = (keyb_rows[i].children);
        for(let j=0;j<keys.length;j++) {
            if (keys[j].className===key.toUpperCase()) {
                keys[j].style.backgroundColor = color;
                keys[j].style.border = "3px solid "+color;
                keys[j].style.color = textColor[1];
            }
        }
    }
}
