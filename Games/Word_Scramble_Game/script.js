const wordtext = document.querySelector('.word');
const hinttext = document.querySelector('.hint span');
const timetext = document.querySelector('.time span');
const inputtext = document.querySelector('input');
const refreshbtn = document.querySelector('.refreshword');
const checktext = document.querySelector('.checkword');
let ans;
let elementvalue;
let correctWord;
let timer;
let dif;
let nextelement;
let nextnewelement;

window.onload = function() {
    document.getElementById('chooseDifficulty').style.display = 'block';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    document.getElementsByClassName('container')[0].style.display = 'none';

}

function chooseDif1() {
    dif = 1;
    //document.getElementById('startButton').style.display = 'block';
    console.log("easy");
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    initialiseGame();
}
function chooseDif2() {
    dif = 2;
    //document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    initialiseGame();
}
function chooseDif3() {
    dif = 3;
    //document.getElementById('startButton').style.display = 'block';
    document.getElementById('chooseDifficulty').style.display = 'none';
    document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
    initialiseGame();
}

function abc()
{
    nextelement.style.display = 'none';
    nextelement.removeChild(nextnewelement);
    console.log(ans);
    console.log(elementvalue);
    if(ans==5)
    {
        //nextelement.style.display = 'none';
        console.log(ans);
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
}


const initialiseTimer = (time) => {
    timer = setInterval(() => {
        // let time = parseInt(timetext.innerHTML);
        if(time > 0) {
            time--;
            timetext.innerHTML = time;
        } else {
            clearInterval(timer);
            alert(`Oops! The correct word is ${correctWord}`);
            initialiseGame();
        }
    }, 1000);
}

const initialiseGame = () => {
    document.getElementsByClassName('container')[0].style.display = 'block';

    if(dif==1){
        initialiseTimer(30);
    }         
    else if(dif==2){
        initialiseTimer(20);
    }
    else if(dif==3){
        initialiseTimer(10);
    }

    let randomWord = wordlist[Math.floor(Math.random() * wordlist.length)]; //Selecting a random word from the wordlist
    correctWord = randomWord.word;          //Storing the correct word
    let words = randomWord.word.split("");  //Splitting the word into an array of characters
    for(let i=words.length-1; i>0; i--) {   //Shuffling the characters
        let j = Math.floor(Math.random() * (i+1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    wordtext.innerHTML = words.join("");    //Joining the characters to form a word
    hinttext.innerHTML = randomWord.hint;   //Displaying the hint
    inputtext.value = "";                   //Clearing the input field
    inputtext.focus();                      //Focusing on the input field
    if(dif==1){
        timetext.innerHTML = 30;
    }         
    else if(dif==2){
        timetext.innerHTML = 20;
    }
    else if(dif==3){
        timetext.innerHTML = 10;
    }
    console.log(wordtext.innerHTML);
    inputtext.setAttribute('maxlength', correctWord.length); //Setting the max length of the input field
    console.log(correctWord);
};

const checkword = () => {
    let userword = inputtext.value.toLocaleLowerCase();
    console.log(userword);
    if(!userword) {
        return alert("Please enter a word");
    }
    if(userword !== correctWord) {
        return alert(`Oops! The correct word is ${correctWord}`);   
    }

    alert(`Congratulations! You have guessed the correct word ${correctWord}`);
    initialiseGame();
}

initialiseGame();

onclick = (e) => {
    if(e.target.className === "refreshword") {
        initialiseGame();
    }
    if(e.target.className === "checkword") {
        checkword();
    }
}


const buttonGroup = document.getElementById("button-group");
const buttonGroupPressed = e => { 
  
  const isButton = e.target.nodeName === 'BUTTON';
  
  if(!isButton) {
    return
  }
  
  elementvalue = e.target.id;
  if(elementvalue=="1"){
    console.log("hello");
      ans = 5;
  }
  else if(elementvalue=="2"){
      ans = 6;
  }   
  else if(elementvalue=="3"){
      ans = 7;
  }
  console.log(ans);
  //document.querySelector('#buttonid').value = 6;
  document.getElementById('chooseDifficulty').style.display = 'none';
  nextelement = document.querySelector('.wrapper-new');
  nextnewelement = document.createElement("div");
  nextelement.appendChild(nextnewelement);
  nextnewelement.innerHTML = '<div id ="abc"><div><h1 id = "rules"><span style="font-size:40px;">&#128204;</span>Rules</h1><p style = "color : bisque;"><ol style ="color : bisque;"><li>There are <span id = "rulespart">10 questions</span> and you will be scored <span id= "rulespart">1 mark </span>for each question.</li><li>You will have to guess the word, within the given number of guesses only.</li><li>You will have to <span id="rulespart">test your luck</span>, give us the word, that we are having for a hint. And that makes our game interesting.Example : For a fruit of 5 letters, if we have set apple and you are entering mango, then your answer would be rejected. And that is also making it a game of Luck!!</li><li>Another twist of game is : If we are having Hello in our answer and you are entering hello, you are rejected. <span id = "rulespart">Casing of letters!!</span></li></ol></p><button type="button" class="nextnew" onclick = "abc()"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="45" height="45" id="rocketimg"/>Start your Game!</button></div></div>';
  nextelement.style.display = 'block';
  
}

buttonGroup.addEventListener("click", buttonGroupPressed);