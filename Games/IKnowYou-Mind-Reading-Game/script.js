document.getElementById('start-btn').addEventListener('click', startGame);

const slides = document.querySelectorAll('.slide');
const slideImages = [
    'assets/one.jpeg',  // Image for slide 1
    'assets/two.jpeg',  // Image for slide 2
    'assets/three.jpeg',  // Image for slide 3
    'assets/four.jpeg',  // Image for slide 4
    'assets/five.jpeg',  // Image for slide 5
    'assets/shock.jpeg'  // Image for slide 6
];
let currentSlide = 0;

document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        nextSlide();
    });
});

document.getElementById('show-result').addEventListener('click', () => {
    // Proceed to guessing game
    document.getElementById('questions').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
});

const money = [100,150,200,250,300,250,400,450,500,550,600];

const myMoney = document.getElementById('myMoney');
const randomIndex = Math.floor(Math.random() * money.length);
myMoney.textContent = money[randomIndex];

const myGuess = [50,75,100,125,150,175,200,225,250,275,300];
document.getElementById('guess').textContent = myGuess[randomIndex];


function startGame() {
    currentSlide = 0;
    showSlide(currentSlide);
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('questions').classList.remove('hidden');
}

function showSlide(index) {
    const slideImageElement = document.getElementById('slide-image');
    console.log("index: ", index);
    if(index==6){
        console.log("index1: ", index);
        slideImageElement.src = 'assets/cover.jpeg';
    }
    slides.forEach((slide, i) => {
        slide.classList.toggle('hidden', i !== index);
    });
    if(index<6){
        console.log("indexif: ", index);
        slideImageElement.src = slideImages[index];
    }
}

function nextSlide() {
    currentSlide++;
    // if (currentSlide < (slides.length+1)) {
        showSlide(currentSlide);
    // }
}

const reset = document.getElementById('reset-btn').addEventListener('click', resetGame);

function resetGame() {
    // currentSlide= 0;
    document.getElementById('start-btn').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
}