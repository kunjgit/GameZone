const wordtext = document.querySelector('.word');
const hinttext = document.querySelector('.hint span');
const timetext = document.querySelector('.time span');
const inputtext = document.querySelector('input');
const refreshbtn = document.querySelector('.refreshword');
const checktext = document.querySelector('.checkword');
let scores = document.querySelector('.score');
let ans;
let elementvalue;
let correctWord;
let timer;
let dif;
let nextelement;
let nextnewelement;
let count = 0;
let score = 0;
let element = document.querySelector('.emoji-display');
let msg = document.querySelector('.status-msg');

let newelement;
window.onload = function() {
  document.getElementsByClassName('container')[0].style.display = 'none';
}
window.onload = function() {
  clearInterval(timer);
  document.getElementsByClassName('container')[0].style.display = 'none';
  document.getElementById('chooseDifficulty').style.display = 'block';
  document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
  element.innerHTML = '<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Raising%20Hand.png" alt="Woman Raising Hand" width="300" height="300" /></span>';
  element.style.display = 'flex';
}

function chooseDif1() {
  dif = 1;
  //document.getElementById('startButton').style.display = 'block';
  document.getElementById('chooseDifficulty').style.display = 'none';
  document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'block';
  initialiseGame();
}
function chooseDif2() {
  dif = 2;
  //document.getElementById('startButton').style.display = 'block';
  document.getElementById('chooseDifficulty').style.display = 'none';
  document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'block';
  initialiseGame();
}
function chooseDif3() {
  dif = 3;
  //document.getElementById('startButton').style.display = 'block';
  document.getElementById('chooseDifficulty').style.display = 'none';
  document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'block';
  initialiseGame();
}

function abc() {
  checkword();
  count++;
  if (count >= 10) {
    clearInterval(timer);
    scoredisplay();
  }
  initialiseGame();
  // nextelement.style.display = 'none';
  // if (ans == 5) {
  //   chooseDif1();
  // }

  // else if (ans == 6) {
  //   chooseDif2();
  // }
  // else if (ans == 7) {
  //   chooseDif3();
  // }
}

function abc1()
{
    nextelement.style.display = 'none';
    if (ans == 5) {
      chooseDif1();
    }
  
    else if (ans == 6) {
      chooseDif2();
    }
    else if (ans == 7) {
      chooseDif3();
    }
}

const initialiseTimer = (time) => {
  timer = setInterval(() => {
    // let time = parseInt(timetext.innerHTML);
    if(count==10)
    {
      document.getElementsByClassName('container')[0].style.display = 'none';
      clearInterval(timer);
    }
    if(time == 0){
      clearInterval(timer);
      scoredisplay();
    } 
    if (time > 0) {
      time--;
      timetext.innerHTML = time;
      //document.getElementsByClassName('container')[0].style.display = 'block'
    }
  }, 1000);
}

const initialiseGame = () => {
  element = "";
  newelement = "";
  // document.getElementsByClassName('container')[0].style.display = 'block';
  element = document.querySelector('.emoji-display')
  element.style.display = 'none';
  msg.style.display = 'none';
  // newelement = document.createElement("span");
  // element.appendChild(newelement);
  
  if (dif == 1) {
    clearInterval(timer);
    initialiseTimer(30);
  }
  else if (dif == 2) {
    clearInterval(timer);
    initialiseTimer(20);
  }
  else if (dif == 3) {
    clearInterval(timer);
    initialiseTimer(10);
  }

  let randomWord = wordlist[Math.floor(Math.random() * wordlist.length)]; //Selecting a random word from the wordlist
  correctWord = randomWord.word;          //Storing the correct word
  let words = randomWord.word.split("");  //Splitting the word into an array of characters
  for (let i = words.length - 1; i > 0; i--) {   //Shuffling the characters
    let j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  wordtext.innerHTML = words.join("");    //Joining the characters to form a word
  hinttext.innerHTML = randomWord.hint;   //Displaying the hint
  inputtext.value = "";                   //Clearing the input field
  inputtext.focus();                     //Focusing on the input field
  if (dif == 1) {
    timetext.innerHTML = 30;
  }
  else if (dif == 2) {
    timetext.innerHTML = 20;
  }
  else if (dif == 3) {
    timetext.innerHTML = 10;
  }
  document.getElementsByClassName('container')[0].style.display = 'block';
  inputtext.setAttribute('maxlength', correctWord.length); //Setting the max length of the input field
};

const checkword = () => {
  let userword = inputtext.value.toLocaleLowerCase();
  element = document.querySelector('.emoji-display')
  // newelement = document.createElement("span");
  // element.appendChild(newelement);
  if (!userword) {
    element.innerHTML = `<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grimacing%20Face.png" alt="Grimacing Face" width="300" height="300" /></span>`;
    element.style.display = 'flex';
    msg.innerText = 'Can"t be empty';
    msg.style.display = 'block';
  }
  else{
      if (userword !== correctWord) {
        element.innerHTML = "";
        document.getElementsByClassName('emoji-display')[0].style.display = 'none';
        // return alert(`Oops! The correct word is ${correctWord}`);
        element.innerHTML = '<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Worried%20Face.png" alt="Worried Face" width="300" height="300"/></span>';
        element.style.display = 'flex';

        msg.innerText = 'Wrong Answer : (';
        msg.style.display = 'block';
        //document.getElementsByClassName('emoji-display')[0].style.display = 'flex';
      
      }
      else{
        // alert(`Congratulations! You have guessed the correct word ${correctWord}`);
        element.innerHTML = "";
        document.getElementsByClassName('emoji-display')[0].style.display = 'none';
        score++;
        element.innerHTML= '<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png" alt="Grinning Face with Big Eyes" width="300" height="300" /></span>';
        element.style.display = 'flex';

        msg.innerText = 'Right Answer : )';
        msg.style.display = 'block';

        setTimeout(() => {
          initialiseGame();
        }, 3000)

      }
    }
}

initialiseGame();

onclick = (e) => {
  if (e.target.className === "refreshword") {
    element.innerHTML = `<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Shaking%20Face.png" alt="Shaking Face" width="300" height="300" /></span>`;
    element.style.display = 'flex';
    initialiseGame();

  }
  if (e.target.className === "checkword") {
    checkword();
  }
  if (e.target.className === "next") {
    element="";
    newelement="";
    clearInterval(timer);
    abc();
  }
}


const buttonGroup = document.getElementById("button-group");
const buttonGroupPressed = e => {
  // element.display.style = 'none';
  const isButton = e.target.nodeName === 'BUTTON';

  if (!isButton) {
    return
  }

  elementvalue = e.target.id;
  if (elementvalue == "1") {
    ans = 5;
  }
  else if (elementvalue == "2") {
    ans = 6;
  }
  else if (elementvalue == "3") {
    ans = 7;
  }
  document.getElementById('chooseDifficulty').style.display = 'none';
  nextelement = document.querySelector('.wrapper-new');
  let nextnewelement = document.getElementById('abc');
  document.querySelector('.emoji-display').style.display = 'none';
  nextnewelement.innerHTML = '<div id ="abc"><div><h1 id = "rules"><span style="font-size:40px; color:bisque;">&#128204;</span>Rules</h1><p style = "color : bisque;"><ol style ="color : bisque;"><li>There are <span id = "rulespart">10 questions</span> and you will be scored <span id= "rulespart">1 mark </span>for each question.</li><li>You will have to guess the word, within the given number of time interval only.</li><li>You will be given the scrambled words, you will have to try figuring out the word from that.</li><li>The time to guess the word would be according to the the difficulty level that you would select.</li></ol></p><button type="button" class="nextnew" onclick = "abc1()"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="45" height="45" id="rocketimg"/><b style="color:bisque; font-size : 20px">Start your Game! &nbsp; </b></button></div></div>';
  nextelement.style.display = 'block';

}

buttonGroup.addEventListener("click", buttonGroupPressed);

function resetgame() {
  window.clearInterval(timer);
  dif = 0;
  count = 0;
  document.getElementById('chooseDifficulty').style.display = 'block';
  document.getElementsByClassName('wrapper-new')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'none';
  document.getElementsByClassName('score')[0].style.display = 'none';
  element.innerHTML = '<span><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Raising%20Hand.png" alt="Woman Raising Hand" width="300" height="300" /></span>';
  element.style.display = 'flex';
  // document.getElementsByClassName('emoji-display')[0].style.display = 'block';
  // element.innerHTML = "";
  // element = "";
  score = 0;
  count = 0;
  nextnewelement = "";
  ans = 0;
  element = "";
  newelement = "";
}

function scoredisplay() {
  clearInterval(timer);
  document.getElementsByClassName('emoji-display')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'none';
  scores.innerHTML = `<img src = "background.png" style="width : 500px; height : 400px"><div id="scorecard"><h1 style = "font-size:50px; color : bisque;">Your score is <span class="info">${score}</span></h1></div><button class="reset1" onclick="resetgame()" id="resetbtn">Click here to restart</button>`;
  document.getElementsByClassName('score')[0].style.display = 'block';
  element.innerHTML = "";
}