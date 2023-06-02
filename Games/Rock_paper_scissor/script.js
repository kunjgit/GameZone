const buttons = document.querySelectorAll('button');
const resultele=document.getElementById("result");
const playerscoreele=document.getElementById("user-score");
const computerscoreele=document.getElementById("computer-score");


let playerscore=0;
let computerscore=0;

function computerPlay() {
    const choices = ["rock","paper","scissors"];
    const randomchoice = Math.floor(Math.random()* choices.length); 
    return choices[randomchoice];
}

function playRound(playerSelection,computerSelection){
    if(playerSelection===computerSelection){

        return "It's a tie !";
    }
    else if((playerSelection==="rock" && computerSelection==="scissors")||(playerSelection==="paper" && computerSelection==="rock")||(playerSelection==="scissors" && computerSelection==="paper"))
    {
        playerscore++;
        playerscoreele.textContent=playerscore;
        return "You win! " + playerSelection + " beats "+ computerSelection;
    }
    else{

        computerscore++;
        computerscoreele.textContent=computerscore;
        return "You lose! " + computerSelection + " beats "+playerSelection;
    }
}

buttons.forEach((button) =>{
    button.addEventListener('click',()=>{
     const result = playRound(button.id,computerPlay());
     resultele.textContent= result;
     
    });;
})

