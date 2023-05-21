const inputs = document.querySelector(".inputs");
const resetButton = document.querySelector(".reset-btn")
const hint = document.querySelector(".hint span");
const typingInput = document.querySelector(".typing-input")
const wrongLetter = document.querySelector(".wrong_letters span");
const guessesLeft = document.querySelector(".guesses_left span");

let word;
let maxGuesses;
let incorrect_letters = [];
let correct_letters = [];
let wins = 0;
let dif = 0;
function chooseDif1() {
    dif = 1;
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    getRandomWord();
}
function chooseDif2() {
    dif = 2;
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    getRandomWord();
}
function chooseDif3() {
    dif = 3;
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    getRandomWord();
}

//Function to get random word from list
function getRandomWord() {
    //Getting the word randomly from the list
    document.getElementsByClassName('wrapper')[0].style.display = 'block';
    let randomobject = wordlist[Math.floor(Math.random() * wordlist.length)];

    //Getting the word from the object
    word = randomobject.word;
    console.log(word);
    //Getting the hint from the object
    hint.innerText = randomobject.hint;

    //By default, the number of guesses is 8
    //maxGuesses = 5;
    if (dif == 1) {
        maxGuesses = word.length + 5;
    }
    else if (dif == 2) {
        maxGuesses = word.length;
    }
    else if (dif == 3) {
        if (word.length % 2 == 0) {
            maxGuesses = word.length / 2;
        }
        else {
            maxGuesses = (word.length - 1) / 2;
        }
    }
    guessesLeft.innerText = maxGuesses;

    //Resetting values to default 
    incorrect_letters = [];
    correct_letters = [];
    //wins = 0;

    //Creating the input fields for the word
    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type = "text" disabled>`;
        //console.log("Demo Text")
    }
    //Adding the input fields to the html
    inputs.innerHTML = html;
    //console.log("Demo text")
}

function initialiseGame(e)
{
    let key = e.target.value;
    console.log(key);
    if(key.match(/^[A-Za-z]+$/) && !incorrect_letters.includes(` ${key}`) && !correct_letters.includes(` ${key}`))
    {
        console.log(key);
        if(word.includes(key))
        {
            //The key entered by user exists in word
            for(let i = 0; i < word.length; i++)
            {
                //Showing the matched letter in the input field
                if(word[i] === key)
                {
                    correct_letters.push(` ${key}`)
                    inputs.querySelectorAll("input")[i].value = key;
                    //console.log("Letter is found :)");
                }
            }
        }
        else
        {
           // console.log("Letter is not found :(");
           maxGuesses--;
           incorrect_letters.push(` ${key}`);
        }
        wrongLetter.innerText = incorrect_letters;
        guessesLeft.innerText = maxGuesses;
    }
    typingInput.value = "";

    setTimeout(()=>{
        if(correct_letters.length === word.length)
        {
            wins++;
            alert(`Congratulations! You won, you have got the word ${word.toUpperCase()} :)`);
            getRandomWord();    //Restarting the game
        }
        else if(maxGuesses<1)
        {
            alert(`Game Over! You are out of guesses :( , your score is ${wins}`);
            wins = 0;
            for(let i=0;i<word.length;i++)
            {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }
    });
}

function restart() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementsByClassName('wrapper')[0].style.display = 'none';
    document.getElementById('chooseDifficulty').style.display = 'block';
    incorrect_letters = [];
    correct_letters = [];
    maxGuesses = "";
    dif = 0;
}

resetButton.addEventListener("click", restart);
typingInput.addEventListener("input", initialiseGame);
inputs.addEventListener("click",() => typingInput.focus());
document.addEventListener("keydown",() => typingInput.focus());

// getRandomWord();

