// Importing Required Elements

let container_1 = document.getElementById("1");
let container_2 = document.getElementById("2");
let container_3 = document.getElementById("3");
let container_4 = document.getElementById("4");
let container_5 = document.getElementById("5");
let container_6 = document.getElementById("6");
let container_7 = document.getElementById("7");
let container_8 = document.getElementById("8");
let container_9 = document.getElementById("9");
let containers = document.querySelectorAll(".span_container")

let count = 0;



function fillBox(num) {


    if (containers[num].innerHTML == "X" || containers[num].innerHTML == "O") {
        alert("You Have Allready Made a Selection");
        document.getElementsByClassName("span_container")[num].removeEventListener("click", fillBox);
    } else {
        if (count % 2 == 0) {
            containers[num].innerHTML = "X";
        } else if (count % 2 == 1) {
            containers[num].innerHTML = "O";
        }
        count++;
    }


}



function xWINS() {
    X_Wins.style.display = "flex";
    div.style.zIndex = "2"
    game_display.style.display = "none";
}

function yWINS() {
    O_Wins.style.display = "flex";
    div2.style.zIndex = "2";
    game_display.style.display = "none";
}
let game_display = document.getElementById("Container");
let div = document.getElementById("div");
let div2 = document.getElementById("div2");
let X_Wins = document.getElementById("xWins");
let O_Wins = document.getElementById("yWins");
setInterval(CheckWins, 1)
function CheckWins() {

    if (count == 9) {
        document.getElementById("tied").style.display = "flex";
        document.getElementById("tie").style.zIndex = "2";
        game_display.style.display = "none";
    }
    // else {
        // condition For X Wins
        if (container_1.innerHTML == "X" && container_2.innerHTML == "X" && container_3.innerHTML == "X") {
            xWINS()
        } else if (container_1.innerHTML == "X" && container_4.innerHTML == "X" && container_7.innerHTML == "X") {
            xWINS()
        } else if (container_1.innerHTML == "X" && container_5.innerHTML == "X" && container_9.innerHTML == "X") {
            xWINS()
        } else if (container_3.innerHTML == "X" && container_6.innerHTML == "X" && container_9.innerHTML == "X") {
            xWINS()
        } else if (container_3.innerHTML == "X" && container_5.innerHTML == "X" && container_7.innerHTML == "X") {
            xWINS()
        } else if (container_7.innerHTML == "X" && container_8.innerHTML == "X" && container_9.innerHTML == "X") {
            xWINS()
        } else if (container_4.innerHTML == "X" && container_5.innerHTML == "X" && container_6.innerHTML == "X") {
            xWINS()
        } else if (container_2.innerHTML == "X" && container_5.innerHTML == "X" && container_8.innerHTML == "X") {
            xWINS()
        }

        // Conditons For O Wins
        if (container_1.innerHTML == "O" && container_2.innerHTML == "O" && container_3.innerHTML == "O") {
            yWINS()
        } else if (container_1.innerHTML == "O" && container_4.innerHTML == "O" && container_7.innerHTML == "O") {
            yWINS()
        } else if (container_1.innerHTML == "O" && container_5.innerHTML == "O" && container_9.innerHTML == "O") {
            yWINS()
        } else if (container_3.innerHTML == "O" && container_6.innerHTML == "O" && container_9.innerHTML == "O") {
            yWINS()
        } else if (container_3.innerHTML == "O" && container_5.innerHTML == "O" && container_7.innerHTML == "O") {
            yWINS()
        } else if (container_7.innerHTML == "O" && container_8.innerHTML == "O" && container_9.innerHTML == "O") {
            yWINS()
        } else if (container_4.innerHTML == "O" && container_5.innerHTML == "O" && container_6.innerHTML == "O") {
            yWINS()
        } else if (container_2.innerHTML == "O" && container_5.innerHTML == "O" && container_8.innerHTML == "O") {
            yWINS()
        }
    // }

}



function reStart() {
    for (let i = 0; i < containers.length; i++) {
        containers[i].innerHTML = "";
    }
    count = 0;
    game_display.style.display = "flex";
    X_Wins.style.display = "none";
    document.getElementById("tied").style.display = "none";
    O_Wins.style.display = "none";
    div2.style.zIndex = "-1";
    div.style.zIndex = "-1";
}

function Exit() {
    window.close();
}