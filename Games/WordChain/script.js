//Adding timer to the game
let timelimit = 30;
let time = 0;
var threading;
let previousWord = "";
const wordList = document.getElementById("word-list");
const message = document.getElementById("message");
let score = 0;
setTimeout(()=>{
    let Intro_page=document.getElementById('Intro_page')
    Intro_page.style.transform="translateX(-100%)"
},3000)
function playTurn() {
  const inputWord = document.getElementById("input-word").value;
  clearInterval(threading);
  threading = setInterval(function () {
    time += 0.01;
    if (time >= timelimit) {
      clearInterval(threading);
      document.getElementById("countdown").innerHTML = "";
      message.textContent = `Game Over! Your score is ${score}.`;
    } else document.getElementById("countdown").innerHTML = time.toPrecision(4);
  }, 10);
  if (inputWord === "") {
    message.textContent = "Please enter a word.";
    return;
  }

  if (previousWord === "") {
    previousWord = inputWord;
    addWordToList(inputWord);
    document.getElementById("input-word").value = "";
    message.textContent = "";
  } else {
    const lastChar = previousWord.charAt(previousWord.length - 1);
    const firstChar = inputWord.charAt(0);
    if (lastChar.toLowerCase() === firstChar.toLowerCase()) {
      previousWord = inputWord;
      addWordToList(inputWord);
      document.getElementById("input-word").value = "";
      message.textContent = "";
    } else {
      // clearInterval(threading);
      score=`${(100 - time)/10}`
      console.log(time,score)
      document.getElementById("countdown").innerHTML = "";
      clearInterval(threading);
      document.getElementById("countdown").innerHTML = "";
      message.textContent = `Game Over! Your score is ${score.slice(0,4)}`;
      time = 0;
      score=0
    }
  }
}

function addWordToList(word) {
  const listItem = document.createElement("li");
  listItem.textContent = word;
  wordList.appendChild(listItem);
}

function restart() {
  time = 0;
  previousWord = "";
  wordList.innerHTML = "";
  document.getElementById("input-word").value = "";
  message.textContent = "";
  score = 0;
  document.getElementById("countdown").innerHTML = "";
  clearInterval(threading);
  //document.getElementById('word-list').style.display = 'none';
}
