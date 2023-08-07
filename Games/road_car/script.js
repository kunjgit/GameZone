let road = document.querySelector('.road')
startGame = document.querySelector('.startGame')
message = document.querySelector('.message')
car = document.querySelector('.car')
carWrapper = document.querySelector('.carWrapper')
audio = new Audio('https://drive.google.com/uc?id=1tOELLh3MnHMaP15LlDIM-81-SQ5zS0lD&export=view')
crash = new Audio('https://drive.google.com/uc?id=1tg095mYxhJP12QAGf35am773uHrYlrEB&export=view')

audio.loop = true;
audio.volume = 0.2;
crash.volume = 0.8;

let carType = localStorage.getItem('carType')
let levelType = localStorage.getItem('levelType')

if (carType == null || levelType == null) {
    localStorage.setItem('carType', 'redCar')
    localStorage.setItem('levelType', 'easy')
} else {
    car.style.backgroundImage = `url(https://drive.google.com/uc?id=1Nq7Xz4B28fA2jzzOyq9Ho0Ag1cteAZfW&export=view)`;
}

let carPosition = car.getBoundingClientRect();
let carWrapperPosition = carWrapper.getBoundingClientRect();
let carLeft = 35;

function increment() {
    return (carLeft++);
}

function decrement() {
    return (carLeft--);
}

let gameOver = () => {
    audio.pause();
    crash.play()
    message.style.display = 'block'
    message.innerHTML = 'Game Over'
    road.classList.remove('moveRoad')
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

startGame.addEventListener('click', () => {
    startGame.style.display = 'none'
    message.style.display = 'none'
    road.classList.toggle('moveRoad')

    audio.play();

    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 37) {
            if (decrement() < -5) {
                gameOver()
            } else {
                car.style.left = `${decrement()}%`;
            }
        }

        if (e.keyCode === 39) {
            if (increment() > 75) {
                gameOver()
            } else {
                car.style.left = `${increment()}%`;
            }
        }
    })
})