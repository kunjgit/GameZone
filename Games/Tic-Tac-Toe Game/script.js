// Access the elements

let boxes = document.querySelectorAll(".box");
let resetButton = document.querySelector("#resetButton");
let newGameButton = document.querySelector("#newButton");
let msgContainer = document.querySelector(".msgContainer");
let msg = document.querySelector("#msg");

// 2 Players : player-X , player-O

let turn_O = true;

// 2D Array : 0-9

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Iterate through each winner pattern for turn and write the value

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turn_O){
            box.innerText = "O";
            turn_O = false;
        }
        else{
            box.innerText = "X";
            turn_O = true;
        }
        checkWinner();
        // disable box so that no box can be repeated for marking
        box.disabled = true;
    });
});

// Disable Boxes after winner is selected

const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}

// Enable Boxes after winner is selected

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

// Show Winner

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msg.classList.remove("hide");
    disableBoxes();
}

// Check isWinner or Not on every click

const checkWinner = () => {
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        if(pos1Val != "" && pos2Val != "" && pos3Val != ""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                console.log("winner", pos1Val);
                showWinner(pos1Val);
            }
        }
    }

};

// Reset Game

const resetGame = () => {
    turn_O = true;
    enableBoxes();
    msg.classList.add("hide");
}

// Reset Game & Reset button - trigger

newGameButton.addEventListener("click", resetGame);
resetButton.addEventListener("click", resetGame);