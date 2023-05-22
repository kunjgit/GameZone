const inputs = document.querySelector(".inputs");
const resetButton = document.querySelector(".reset-btn")
const hint = document.querySelector(".hint span");
const typingInput = document.querySelector(".typing-input")
const wrongLetter = document.querySelector(".wrong_letters span");
const guessesLeft = document.querySelector(".guesses_left span");
const nextButton = document.querySelector(".next");
let word;
let maxGuesses;
let incorrect_letters = [];
let correct_letters = [];
let wins = 0;
let dif = 0;
let element;
let newelement;
let score = 0;
let count = 0;

window.onload = function () {
    document.getElementById('startButton').style.display = 'none';
    document.getElementsByClassName('wrapper')[0].style.display = 'none';
}

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

nextButton.addEventListener("click", function(e){
    incorrect_letters = [];
    correct_letters = [];
    count++;
    maxGuesses = "";
    element.innerHTML = "";
    element = "";
    newelement = "";
    // if(count<10)
    getRandomWord();
    // else
    // alert(`Your score is ${score}`);
    // else{
    //     alert(`Your score is ${score}`);
    // }
});

//Function to get random word from list
function getRandomWord() {
    if(count>9)
    {
        alert(`Your score is ${score}`);
    }
    //Getting the word randomly from the list
    document.getElementsByClassName('wrapper')[0].style.display = 'block';
    let randomobject = wordlist[Math.floor(Math.random() * wordlist.length)];
    element = document.querySelector('.emoji-display')
    newelement = document.createElement("span");
    element.appendChild(newelement);
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
    //count++;
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
                   //$('.emoji--happy').classList.add('hover');
                   newelement.innerHTML= '<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png" alt="Grinning Face with Big Eyes" width="300" height="300" />'
                   element.style.display = 'flex';
                }
                console.log("Out of the loop")
                // element.removeChild(lastChild);
                // console.log("Element removed");
            }
        }
        else
        {
            newelement.innerHTML = '<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Worried%20Face.png" alt="Worried Face" width="300" height="300"/>'
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
            //newelement.innerHTML = '<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png" alt="Star-Struck" width="25" height="25" />';
            wins++;
            //alert(`Congratulations! You won, you have got the word ${word.toUpperCase()} :)`);
            score++;
            //getRandomWord();    //Restarting the game
            $('.next').onclick(function(e){
                incorrect_letters = [];
                correct_letters = [];
                maxGuesses = "";
                element.innerHTML = "";
                element = "";
                newelement = "";
                getRandomWord();
                initialiseGame();
            });
            
        }
        else if(maxGuesses<1)
        {
            alert(`Game Over! You are out of guesses :( , your score is ${wins}`);
            for(let i=0;i<word.length;i++)
            {
                inputs.querySelectorAll("input")[i].value = word[i];
                //alert(`The score is ${score}`);
                restart();
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
    element.innerHTML = "";
    element = "";
    newelement = "";
    //score = 0;
    count = 0;
}

resetButton.addEventListener("click", restart);
typingInput.addEventListener("input", initialiseGame);
inputs.addEventListener("click",() => typingInput.focus());
document.addEventListener("keydown",() => typingInput.focus());

// getRandomWord();

