const userboard = document.getElementById('playerBoard')
const cpuBoard = document.getElementById('cpuBoard')
const totalNumbers = document.getElementById('totalNumbers')
const numberDraw = document.getElementById('numberDraw')
const automaticBtn = document.getElementById('automatica')
const stopAutomatic = document.getElementById('stopAutomatica')
const scoreSpan = document.getElementById('score')

const maxScore = localStorage.getItem('maxScore') || 0
scoreSpan.innerText = maxScore

const userNumbers = fifteenRandomNumbers()
const cpuNumbers = fifteenRandomNumbers()


let userAcerts = 0
let cpuAcerts = 0

// Creo el array con todos los numeros del 1 al 99, ya que son las bolas que pueden salir
const balls = []
for (let i = 1; i < 100; i++) {
    balls.push(i)
}

for (let i = 0; i < userNumbers.length; i++) {
    userboard.innerHTML += `<div class="numero-contenedor__child" id='userNum${i}'>${userNumbers[i]}</div>`
}

for (let i = 0; i < cpuNumbers.length; i++) {
    cpuBoard.innerHTML += `<div class="numero-contenedor__child" id='cpuNum${i}'>${cpuNumbers[i]}</div>`
}



numberDraw.addEventListener('click', randomNumberDraw)
automaticBtn.addEventListener('click', () => automatic(true))
stopAutomatic.addEventListener('click', () => automatic(false))



function automatic(value) {

    if (value) {
        alert('Automatico activado!')
        automaticInterval = setInterval(randomNumberDraw, 300)
    } else {
        alert('Automatico desactivado!')
        clearInterval(automaticInterval)
    }

    automaticBtn.classList.toggle('hidden')
    stopAutomatic.classList.toggle('hidden')
}

function randomNumberDraw() {
    const randomNumber = balls[Math.floor(Math.random() * balls.length)]
    balls.splice(balls.indexOf(randomNumber), 1)
    console.log(balls)

    numberDraw.innerText = randomNumber

    totalNumbers.innerHTML += `<div class="numero-obtenido">${randomNumber}</div>`

    if (userNumbers.includes(randomNumber)) {
        document.getElementById(`userNum${userNumbers.indexOf(randomNumber)}`).style.backgroundColor = 'green'
        userAcerts++
    }

    if (cpuNumbers.includes(randomNumber)) {
        document.getElementById(`cpuNum${cpuNumbers.indexOf(randomNumber)}`).style.backgroundColor = 'red'
        cpuAcerts++
    }

    checkWinner()

    if (balls.length === 0) {
        alert('No quedan mas bolas!')
        document.getElementById('numberDraw').style.display = 'none'
    }
}

function checkWinner() {
    if (userAcerts === 15) {
        document.getElementById('numberDraw').style.display = 'none'
        alert(`You won! They were left in the closet ${balls.length} balls`)
        clearInterval(automaticInterval)
        stopAutomatic.classList.toggle('hidden')
        document.querySelector('.jugada-automatica').style.minHeight = '30px'
        if (balls.length > maxScore) {
            localStorage.setItem('maxScore', balls.length)
            scoreSpan.innerText = balls.length
        }
    } else if (cpuAcerts === 15) {
        document.getElementById('numberDraw').style.display = 'none'
        alert(`You lost, the winner is the CPU! They were left in the closet ${balls.length} balls`)
        clearInterval(automaticInterval)
        stopAutomatic.classList.toggle('hidden')
        document.querySelector('.jugada-automatica').style.minHeight = '30px'
    }
}

function fifteenRandomNumbers() {

    const arr = [];

    for (let i = 0; i < 15; i++) {
        const randomNumber = Math.floor(Math.random() * 100)

        isInArray = arr.includes(randomNumber)

        if (randomNumber == 100 || randomNumber == 0) {
            i-- // Si bien no lo agrega al array por el continue, con el i-- "vuelvo" un ciclo, ya que si no lo pierdo y quedo con menos de 15
            continue
        } else if (!isInArray) {
            arr.push(randomNumber)
        } else {
            i--
        }
    }

    return arr
}