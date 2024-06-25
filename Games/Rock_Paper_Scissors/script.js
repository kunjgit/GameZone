var choices = ["rock", "paper", "scissors"];
var userScore = 0;
var computerScore = 0;
var tieScore = 0;
let isAutoPlaying=false;
let id;

function autoPlay(){
    if(! isAutoPlaying){
        id=setInterval(function (){
        const playerMove=getComputerChoice();
        play(playerMove);
        },2000);
        isAutoPlaying=true;
    
    } else{
        clearInterval(id);
        isAutoPlaying=false;

    }

}
var resultText = document.getElementById("resultText");
var scoreText = document.getElementById("scoreText");
var computerEmoji = document.getElementById("computerEmoji");
function getComputerChoice() {
    var randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "It's a tie!";
    } else if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
    ) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

function updateScore(result) {
    if (result === "You win!") {
        userScore++;
    } else if (result === "Computer wins!") {
        computerScore++;
    }else{
        tieScore++;
    }
    updateResult();
    
}
function updateResult(){
    scoreText.textContent = "Score: You - " + `${userScore}` + " | Computer - " + `${computerScore}`;
    tieText.textContent = "Ties: "+`${tieScore}`;
}
function play(userChoice) {
    var computerChoice = getComputerChoice();

    computerEmoji.textContent = getEmoji(computerChoice);

    var result = determineWinner(userChoice, computerChoice);
    resultText.textContent = result;

    updateScore(result);
}

function getEmoji(choice) {
    switch (choice) {
        case "rock":
            return "👊";
        case "paper":
            return "✋";
        case "scissors":
            return "✌️";
        default:
            return "";
    }
}
function change(){
    const name=document.querySelector('.but5');
    if(name.innerHTML==='Auto Play'){
        name.innerHTML='Stop Play';
    }else{
        name.innerHTML='Auto Play';
    }
}
