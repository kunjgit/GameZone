var you
var opponent

var choices = ["rock", "paper", "scissors"]

window.onload = function () {
    for (let i = 0; i < 3; i++) {
        let choice = document.createElement("img")
        choice.id = choices[i];
        choice.src = "./public/" + choices[i] + ".png"
        document.getElementById("choice").append(choice)
        choice.addEventListener("click", selectchoice)
    }
}

function selectchoice() {
    you = this.id
    document.getElementById("your-choice").src = "./public/" + you + ".png"
    opponent = choices[Math.floor(Math.random() * 3)]
    document.getElementById("opponent-choice").src = "./public/" + opponent + ".png"

    if (you == opponent) {
        let result = document.getElementById("opponent-score")
        result.innerText = "Its a Tie 🤔"
    }

    else {
        if (you == "rock") {
            if (opponent == "scissors") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Won! 😃"
            }
            else if (opponent == "paper") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Loose! 😔"
            }
        }

        else if (you == "scissors") {
            if (opponent == "paper") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Won! 😃"
            }
            else if (opponent == "rock") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Loose! 😔"
            }
        }

        else if (you == "paper") {
            if (opponent == "rock") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Won! 😃"
            }
            else if (opponent == "scissors") {
                result = document.getElementById("opponent-score")
                result.innerText = "You Loose! 😔"
            }
        }
    }

    document.getElementById("your-score").innerText = yourscore
    document.getElementById("opponent-score").innerText = opponentScore
}



