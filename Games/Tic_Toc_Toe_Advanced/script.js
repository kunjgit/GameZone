let gameover = new Audio("music/music_gameover.mp3");
let select = new Audio("music/select.mp3");
let winning = new Audio("music/winning.mp3");
let isgameover = false;
let isover = 0;
let img = document.getElementsByClassName("img").style;
let a = true;
let b = prompt("Enter player 1 name :");
let c = prompt("Enter player 2 name :");



let turn = 'X';
const changeTurn = () => {
    return turn === 'X' ? '0' : 'X';
}

const checkWin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    wins.forEach(e => {
        if ((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== "")) {
            if (a) {
                if (boxtext[e[0]].innerText == 'X') {
                    document.querySelector('.turn').innerText = `${b} Won`;
                } else {
                    document.querySelector('.turn').innerText = `${c} Won`;
                }
                document.querySelector('.container').getElementsByTagName('div')[e[0]].style.backgroundColor = "rgb(206, 153, 255)";
                document.querySelector('.container').getElementsByTagName('div')[e[1]].style.backgroundColor = "rgb(206, 153, 255)";
                document.querySelector('.container').getElementsByTagName('div')[e[2]].style.backgroundColor = "rgb(206, 153, 255)";
                winning.play();
            }
            isgameover = true;
            document.querySelector('.img').getElementsByTagName('img')[0].style.width = "250px";
            a = false;
        }
        if (isover == 9) {
            gameover.play();
        }

    })
}

let boxes = document.getElementsByClassName('box');
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener("click", () => {
        if (boxtext.innerHTML === " ") {
            boxtext.innerHTML = turn;
            select.play();
            turn = changeTurn();
            isover++;
            checkWin();
            if (!isgameover) {
                document.getElementsByClassName("turn")[0].innerHTML = "Turn for " + turn;
            }
        }
    })
}
)
let replay = document.getElementById("replay");
replay.addEventListener("click", () => {
    let boxtext = document.getElementsByClassName('boxtext');
    Array.from(boxtext).forEach((e) => { e.innerText = " "; })
    document.getElementsByClassName("turn")[0].innerHTML = "Turn for X";
    let backColor = document.getElementsByClassName("box");
    Array.from(backColor).forEach((e) => { e.style.backgroundColor = "#f0f8ff"; })
    document.querySelector('.img').getElementsByTagName('img')[0].style.width = "0px";
    isgameover = false;
    turn = "X";
    isover = 0;
    a = true;
})

let reload = document.getElementById("reset");
reload.addEventListener("click", () => {
    document.location.reload();
})