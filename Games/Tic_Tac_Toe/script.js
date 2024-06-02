let gameoverAudio = new Audio("gameover.mp3")
let turnAudio = new Audio("ting.mp3")
let turn = 'X'
let gameover = false;
let music = new Audio("music.mp3")

const info = document.querySelector('.info')
const reset = document.querySelector('#reset')
const start = document.querySelector('#start')
const playerInfo = document.querySelector('.playerInfo')
const gameContainer = document.querySelector('.gameContainer')
const p1 = document.querySelector('.p1')
const p2 = document.querySelector('.p2')
const line = document.querySelector('.line')


start.addEventListener('click', () => {
    playerInfo.style.display = 'none';
    gameContainer.style.display = 'flex';
    info.innerText = 'Turn for ' + p1.value + ' (' + turn + ')';
    music.play()
})


const changeTurn = () => {
    return turn === 'X' ? 'O' : 'X';
}

const checkWin = () => {
    let boxText = document.querySelectorAll('.boxText')
    let wins = [
        [0, 1, 2, '24%', 0,0],
        [3, 4, 5, '50%', 0,0],
        [6, 7, 8, '75%', 0,0],
        [0, 3, 6, '50%', '-34%','90'],
        [1, 4, 7, '50%', 0,'90'],
        [2, 5, 8, '50%', '33%','90'],
        [0, 4, 8, '50%',0,'45'],
        [2, 4, 6, '50%', 0,'135']
    ]
    wins.forEach(e => {
        if ((boxText[e[0]].innerText === boxText[e[1]].innerText) && (boxText[e[2]].innerText === boxText[e[1]].innerText) && (boxText[e[0]].innerText !== '')) {
            if (boxText[e[0]].innerText === 'X') {
                info.innerText = p1.value + ' Wins !'
            } else {
                info.innerText = p2.value + ' Wins !'
            }
            document.querySelector('.confetti').style.visibility = 'visible';
            line.style.visibility = 'visible'
            line.style.top = e[3];
            line.style.left = e[4];
            line.style.transform = `rotate(${e[5]}deg)`;
            music.pause()
            music.currentTime = 0;
            gameoverAudio.play()
            gameover = true;
        }
    })
}

let boxes = document.querySelectorAll('.box')
Array.from(boxes).forEach((e) => {
    let boxText = e.querySelector('.boxText')
    e.addEventListener("click", () => {
        if (boxText.innerText === '') {
            boxText.innerText = turn
            turnAudio.play();
            turn = changeTurn();
            checkWin();
            if (!gameover) {
                if (turn === 'X') {
                    info.innerText = 'Turn for ' + p1.value + ' (' + turn + ')';
                } else {
                    info.innerText = 'Turn for ' + p2.value + ' (' + turn + ')';

                }
            }
        }
    })

})

reset.addEventListener('click', () => {
    let boxText = document.querySelectorAll('.boxText')
    Array.from(boxText).forEach(e => {
        e.innerText = ''
        turn = 'X'
        info.innerText = 'Turn for ' + p1.value + ' (' + turn + ')';
        document.querySelector('.confetti').style.visibility = 'hidden';
        line.style.transform = '';
        line.style.visibility = 'hidden'
        gameover = false;
        music.play()

    })
})
