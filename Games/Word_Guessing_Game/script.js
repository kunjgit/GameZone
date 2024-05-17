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
let nextelement;
let nextnewelement;
let elementvalue;
let ans;

wordUsed=[];    //array of words used till now

element = document.querySelector('.emoji-display');
let msg = document.querySelector('.status-msg');

window.onload = function () {
    document.getElementById('startButton').style.display = 'none';
    document.getElementsByClassName('wrapper')[0].style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    document.getElementsByClassName('scorecard')[0].style.display = 'none';
}

function chooseDif1() {
    dif = 1;
    //document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    getRandomWord();
}
function chooseDif2() {
    dif = 2;
    //document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    getRandomWord();
}
function chooseDif3() {
    dif = 3;
    //document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    getRandomWord();
}

nextButton.addEventListener("click", function(e){
    wrongLetter.innerText = "";
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
       // document.getElementsByClassName('wrapper')[0].style.display = 'none';
        scoredisplay();
    }
    //Getting the word randomly from the list
    if(count<=9)
    document.getElementsByClassName('wrapper')[0].style.display = 'block';
    let randomobject;                                                           //Declaring word, so we can use it otside do-while loop
    do{                                                                         //Getting a random word, one time
    randomobject = wordlist[Math.floor(Math.random() * wordlist.length)];
    //Getting the word from the object
    word = randomobject.word;
    }   while(wordUsed.includes(word));                                         //If the word is already in the used words list, pick another ranndom word
    wordUsed.push(word);                                                        //Appending the word to the used words list
    element = document.querySelector('.emoji-display')
    newelement = document.createElement("span");
    element.appendChild(newelement);
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
    }
    //Adding the input fields to the html
    inputs.innerHTML = html;
    //document.getElementsByClassName('wrapper')[0].style.display = 'block';
}

function initialiseGame(e)
{
    //document.getElementsByClassName('wrapper')[0].style.display = 'block';
    //count++;
    //document.getElementsByClassName('wrapper')[0].style.display = 'block'
    let key = e.target.value;
    if(key.match(/^[A-Za-z]+$/) && !incorrect_letters.includes(` ${key}`) && !correct_letters.includes(` ${key}`))
    {
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
                   //$('.emoji--happy').classList.add('hover');
                   newelement.innerHTML= '<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png" alt="Grinning Face with Big Eyes" width="300" height="300" />'
                   element.style.display = 'flex';
                   msg.innerText = 'Right'
                   msg.style.display = 'block'
                }
                // element.removeChild(lastChild);
            }
        }
        else
        {
            newelement.innerHTML = '<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Worried%20Face.png" alt="Worried Face" width="300" height="300"/>'
            maxGuesses--;

           incorrect_letters.push(` ${key}`);   
           msg.innerText = 'Wrong'
        msg.style.display = 'block'
           
        }
        wrongLetter.innerText = incorrect_letters;
        guessesLeft.innerText = maxGuesses;
    }
    if(guessedWord() === word) {
        msg.innerText = 'You guessed it right : )'
        setTimeout(() => {
            wrongLetter.innerText = "";
            incorrect_letters = [];
            correct_letters = [];
            count++;
            maxGuesses = "";
            element.innerHTML = "";
            element = "";
            newelement = "";
            msg.style.display = 'none';
            // if(count<10)
            getRandomWord();
        }, 3000);
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
            
        }

        else if(maxGuesses<1)
        {
            for(let i=0;i<word.length;i++)
            {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
            //alert(`Sorry! You lost, the word was ${word.toUpperCase()} :(`);
            //document.getElementsByClassName('wrapper')[0].style.display = 'none';
            msg.style.display = 'none';
            scoredisplay();
        }
    });
}

const guessedWord = () => {
    const ent = Array.from(inputs.querySelectorAll("input")).map((m) => m.value).join("");
    return ent;
}

function scoredisplay()
{
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper')[0].style.display = 'none';
    document.getElementsByClassName('emoji-display')[0].style.display = 'none';
    document.getElementsByClassName('scorecard')[0].innerHTML = `
    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png" alt="Trophy" width="200" height="200" id="trophy"/><h1 id = "scorep">Your Score is <span id="scoreportion">${score}</span></h1><br><button type="button" class="nextnew1" onclick = "restart()">Click here to Restart</button>`;
    document.getElementsByClassName('scorecard')[0].style.display = 'block';
    //restart();
}

function restart() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementsByClassName('wrapper')[0].style.display = 'none';
    document.getElementsByClassName('scorecard')[0].style.display = 'none';
    document.getElementById('chooseDifficulty').style.display = 'block';
    incorrect_letters.innerHTML = "";
    incorrect_letters = [];
    correct_letters = [];
    maxGuesses = "";
    dif = 0;
    element.innerHTML = "";
    element = "";
    newelement = "";
    score = 0;
    count = 0;
    nextnewelement = "";
    ans = 0;
    elementvalue = 0;
}

function abc()
{
    nextelement.style.display = 'none';
    nextelement.removeChild(nextnewelement);
    if(ans==5)
    {
        //nextelement.style.display = 'none';
        chooseDif1();
    }

    else if(ans==6)
    {
        //nextelement.style.display = 'none';
        chooseDif2();
    }
    else if(ans==7)
    {
        //nextelement.style.display = 'none';
        chooseDif3();
    }
    //document.getElementsByClassName('wrapper')[0].style.display = 'block';
}

resetButton.addEventListener("click", restart);
typingInput.addEventListener("input", initialiseGame);
inputs.addEventListener("click",() => typingInput.focus());
document.addEventListener("keydown",() => typingInput.focus());

// getRandomWord();

const buttonGroup = document.getElementById("button-group");
const buttonGroupPressed = e => { 
  
  const isButton = e.target.nodeName === 'BUTTON';
  
  if(!isButton) {
    return
  }
  
  elementvalue = e.target.id;
  if(elementvalue=="1"){
      ans = 5;
  }
  else if(elementvalue=="2"){
      ans = 6;
  }   
  else if(elementvalue=="3"){
      ans = 7;
  }
  //document.querySelector('#buttonid').value = 6;
  document.getElementById('chooseDifficulty').style.display = 'none';
  nextelement = document.querySelector('.wrapper-new');
  nextnewelement = document.createElement("div");
  nextelement.appendChild(nextnewelement);
  nextnewelement.innerHTML = '<div id ="abc"><div><h1 id = "rules"><span style="font-size:40px;">&#128204;</span>Rules</h1><p style = "color : bisque;"><ol style ="color : bisque;"><li>There are <span id = "rulespart">10 questions</span> and you will be scored <span id= "rulespart">1 mark </span>for each question.</li><li>You will have to guess the word, within the given number of guesses only.</li><li>You will have to <span id="rulespart">test your luck</span>, give us the word, that we are having for a hint. And that makes our game interesting.Example : For a fruit of 5 letters, if we have set apple and you are entering mango, then your answer would be rejected. And that is also making it a game of Luck!!</li><li>Another twist of game is : If we are having Hello in our answer and you are entering hello, you are rejected. <span id = "rulespart">Casing of letters!!</span></li></ol></p><button type="button" class="nextnew" onclick = "abc()"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="45" height="45" id="rocketimg"/>Start your Game!</button></div></div>';
  nextelement.style.display = 'block';
  
}

buttonGroup.addEventListener("click", buttonGroupPressed);