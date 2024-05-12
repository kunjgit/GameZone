console.log("Welcome To Tic Tac Toe Game");

let gameover = false;
let turn_music = new Audio('ding.mp3');
open_game = new Audio('music.mp3');
open_game.play();
let gamesuccess = new Audio('success.mp3');
let gameover_music = new Audio('gameover.mp3');

let turn = 'X';

const changeTurn = () => {
    return turn === 'X' ? 'O' : 'X';
}

const checkWin = () => {
    box = document.getElementsByClassName("boxtext");
    win = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135]
    ]
    win.forEach(e => {
        if (box[e[0]].innerText === box[e[1]].innerText && box[e[1]].innerText === box[e[2]].innerText && box[e[0]].innerText !== '') {
            document.getElementById("turn").innerText = box[e[0]].innerText + "  Won";
            gameover = true;
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.display = "block";
            gamesuccess.play();
            document.querySelector('.line').style.transform = `translate(${e[3]}vw,${e[4]}vw) rotate(${e[5]}deg)`;
            document.querySelector('.line').style.display = 'block';
        }
    });
}

let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener('click', () => {
        open_game.pause();
        if (boxtext.innerText === '') {
            boxtext.innerText = turn;
            turn = changeTurn();
            turn_music.play();
            checkWin();
            if (!gameover) {
                let isFilled = Array.from(box).every(element => element.innerText !== '');
                if (isFilled) {
                    document.getElementById("turn").innerText = "Game is Over!!!";
                    gameover_music.play();
                }
                else {
                    document.getElementById("turn").innerText = "Turn For " + turn;
                }
            }
        }
    });
})

function func() {
    let boxes = document.getElementsByClassName("box");
    Array.from(boxes).forEach(element => {
        element.querySelector(".boxtext").innerText = "";
        document.querySelector('.imgbox').getElementsByTagName('img')[0].style.display = "none";
        document.getElementById("turn").innerText = "Turn For " + 'X';
        open_game.play();
        turn = 'X';
        document.querySelector('.line').style.display = "none";
        gameover = false; 
    })
}
