let userScore=0;
let compScore=0;

const choices = document.querySelectorAll(".choice");
const msg=document.querySelector("#msg");
const userScorePara=document.querySelector("#userscore");
const compScorePara=document.querySelector("#compscore");

const genCompChoice = () => {
    const options=["Boy","Elephant","Ant"];
    const randIdx=Math.floor(Math.random()*3);
    return options[randIdx];
}
const drawGame=()=>{
    console.log("It's a tie. Play again!")
    msg.innerText="It's a tie. Play again!"
    msg.style.backgroundColor="rgb(109, 130, 100)"
}
const showWinner=(userWin, userChoice, compChoice)=>{
    if(userWin){
        console.log("Congratulations! You won.")
        userScore++;
        userScorePara.innerText =userScore;
        msg.innerText=`Congratulations! You won. ${userChoice} beats the ${compChoice}`
        msg.style.backgroundColor="green";
    }
    else{
        console.log("Sorry you lost, better luck next time.")
        compScore++;
        compScorePara.innerText=compScore;
        msg.innerText=`Sorry you lost, better luck next time. ${userChoice} lost to the ${compChoice}`
        msg.style.backgroundColor="red";
    }
}

const playGame= (userChoice)=>{
    console.log("userchoice = ", userChoice);
    const compChoice=genCompChoice();
    console.log("compChoice= ", compChoice);

    if (userChoice==compChoice){
        drawGame();
    }else{
        let userWin=true;
        if(userChoice=="Boy"){
            userWin=compChoice==="Elephant"? false:true;
        }
        else if(userChoice=="Elephant"){
            userWin=compChoice==="Ant"? false:true;
        }
        else{
            userWin=compChoice==="Boy"? false:true;
        }
        showWinner(userWin, userChoice, compChoice);

    }
};

choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice= choice.getAttribute("id");
        playGame(userChoice);
    });
});