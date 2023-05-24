/*
  Rock Paper Scissors 🚀🔥
  Concepts covered in this project
    👉 For loops
    👉 Dom Manipulation
    👉 Variables
    👉 Conditionals (if else if)
    👉 Template Literals
    👉 Event Listeners
    👉 Higher order Function (Math.random())
*/

// ** getComputerChoice randomly selects between `rock` `paper` `scissors` and returns that string **
// getComputerChoice() 👉 'Rock'
// getComputerChoice() 👉 'Scissors'

let totalscore={playerscore:0,computerscore:0}
function getComputerChoice() {
  let choices = ['Rock', 'Paper', 'Scissor']
  let random = Math.floor(Math.random() * 3)
  return choices[random];

}



// ** getResult compares playerChoice & computerChoice and returns the score accordingly **
// human wins - getResult('Rock', 'Scissors') 👉 1
// human loses - getResult('Scissors', 'Rock') 👉 -1
// human draws - getResult('Rock', 'Rock') 👉 0
function getResult(playerChoice, computerChoice) {
  let score 
  // return the result of score based on if you won, drew, or lost


  // All situations where human draws, set `score` to 0
  if (playerChoice == computerChoice) {
    score = 0;

  }


  // All situations where human wins, set `score` to 1
  // make sure to use else ifs here
  else if (playerChoice == 'Rock' && computerChoice == 'Scissor') {
    score = 1
  }
  else if (playerChoice == 'Scissor' && computerChoice == 'Paper') {
    score = 1
  }
  else if (playerChoice == 'Paper' && computerChoice == 'Rock') {
    score = 1
  }


  // Otherwise human loses (aka set score to -1)
  else {
    score= -1
  }


  // return score
  return score;

}

// ** showResult updates the DOM to `You Win!` or `You Lose!` or `It's a Draw!` based on the score. Also shows Player Choice vs. Computer Choice**
function showResult(score, playerChoice, computerChoice) {
  // Hint: on a score of -1
  // You should do result.innerText = 'You Lose!'
  // Don't forget to grab the div with the 'result' id!

  if (score == 0) {
   
  
    document.getElementById('result').innerText = `It's a Draw!`
  }

  else if (score == 1) {
    
    document.getElementById('result').innerText = `You Win!`
  }

  else if (score == -1) {
   
    document.getElementById('result').innerText = `You Lose!`
  }
  document.getElementById('hands').innerText = `🤖${computerChoice} VS ${playerChoice}👨`
  document.getElementById('player-score').innerText=`your score ${totalscore['playerscore']}`
}


// ** Calculate who won and show it on the screen **
function onClickRPS(playerChoice) {
let ComputerChoice=getComputerChoice()
  let score=getResult(playerChoice,ComputerChoice)
  showResult(score, playerChoice, ComputerChoice)
  totalscore['playerscore']+=score
  // totalscore['computerChoice']-=score

}


// ** Make the RPS buttons actively listen for a click and do something once a click is detected **
function playGame() {
  // use querySelector to select all RPS Buttons
  let buttons = document.querySelectorAll('.rpsButton')

  // * Adds an on click event listener to each RPS button and every time you click it, it calls the onClickRPS function with the RPS button that was last clicked *  buttons.onclick=()=>{


  // 1. loop through the buttons using a forEach loop
  // 2. Add a 'click' event listener to each button
  // 3. Call the onClickRPS function every time someone clicks
  // 4. Make sure to pass the currently selected rps button as an argument
  buttons.forEach(button => {
    button.onclick = () => {
      onClickRPS(button.value)

    }
  })



  // Add a click listener to the end game button that runs the endGame() function on click

  let endbutton = document.getElementById('endGameButton')
  endbutton.onclick = () => {
    endGame()
  }

}

// ** endGame function clears all the text on the DOM **
function endGame() {
document.getElementById('player-score').innerText=""
  document.getElementById('hands').innerText=""
  document.getElementById('result').innerText=""

}

playGame()