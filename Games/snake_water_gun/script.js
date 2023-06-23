let myArray = [
    "snake",
    "water",
    "gun"
];
let a = 0;
let score = 0;
let randomItem = "";

function runcode() {

    while (a != 1) {
        user_input();
        play();
        let play_again = prompt("do you want to play again?");
        if (play_again == "yes") {
            a = 0;
            randomItem = "";
            return;

        }
        else if (play_again == "no") {
            a = 1;
            document.getElementsByTagName("h2")[0].innerHTML = "Your Score is " + score + "!!!";

        }
        else {
            alert("please enter yes or no");
            b = prompt("do you want to play again?");
        }

    }

}



function user_input() {

    document.getElementById("btn1").addEventListener("click", () => {
        userSelection = "btn1";

    })
    document.getElementById("btn2").addEventListener("click", () => {
        userSelection = "btn2";

    })
    document.getElementById("btn3").addEventListener("click", () => {
        userSelection = "btn3";

    })
    return;
}



function play() {

    randomItem = myArray[Math.floor(Math.random() * myArray.length)];

    if (randomItem == 'water' && userSelection == 'btn1') {
        alert("you win");
        score++;
        return;
    }
    else if (randomItem == 'gun' && userSelection == 'btn2') {
        alert("you win");
        score++;
        return;
    }
    else if (randomItem == 'snake' && userSelection == 'btn3') {
        alert("you win");
        score++;
        return;
    }
    else if (randomItem == 'snake' && userSelection == 'btn1') {
        alert("draw");
        return;
    }
    else if (randomItem == 'water' && userSelection == 'btn2') {
        alert("draw");
        return;
    }
    else if (randomItem == 'gun' && userSelection == 'btn3') {
        alert("draw");
        return;
    }
    else {
        alert("you lose");
        return;
    }
}