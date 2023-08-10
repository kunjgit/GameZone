const wordList = [
  "New York",
  "Paris",
  "Tokyo",
  "London",
  "Sydney",
  "Rome",
  "Mumbai",
  "Toronto",
  "Dubai",
  "Los Angeles",

  "Carrot",
  "Broccoli",
  "Spinach",
  "Potato",
  "Cucumber",
  "Tomato",
  "Bell Pepper",
  "Zucchini",
  "Onion",
  "Lettuce",

  "Apple",
  "Banana",
  "Orange",
  "Grapes",
  "Strawberry",
  "Watermelon",
  "Pineapple",
  "Mango",
  "Kiwi",
  "Blueberry",

  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Lamborghini",
  "Ferrari",
  "Tesla",

  "Mountain",
  "Ocean",
  "Sunset",
  "Adventure",
  "Music",
  "Book",
  "Star",
  "Moon",
  "Friendship",
  "Laughter",
];

const popup_before = document.querySelector('.popup-before')
const start = document.querySelector('.popup-before button')
const word_display = document.querySelector('.word-display')
const guess_btn = document.querySelector('.guess')
const input = document.querySelector('input')
const words_cont = document.querySelector('.right-words')
const cont = document.querySelector('.container')

let displayed = []

start.addEventListener('click', () => {
    popup_before.style.display = 'none';
    cont.style.display='flex';
    startTimer();
    
})

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

guess_btn.addEventListener('click', () => {
    let word = input.value;
    input.value = ''

    if(displayed.includes(word.toLowerCase())) {
        const sp = document.createElement('span')
        sp.classList.add('label');
        sp.innerText = word
        words_cont.appendChild(sp);
    }
})




const startTimer = () => {
    countdown = 14;

    const timer = document.querySelector('.timer');
    const timer_val = timer.querySelector('.circle');
    timer_val.innerText = '1:00';

    timer.style.background = `conic-gradient(rgb(236, 181, 15) 0deg, rgb(47, 45, 45) 0deg)`;
    
    interval = setInterval(() => {
       

        timer.style.background = `conic-gradient(rgb(236, 181, 15) ${(60 - countdown) * 6}deg, rgb(47, 45, 45) 0deg)`;

        timer_val.innerText = `0:${countdown}`;
        countdown--;

        const gw = getRandomWord();
        word_display.innerHTML = gw;

        displayed.push(gw.toLowerCase())


        if (countdown < 0) {
            timer_val.innerText = `0:00`;
            word_display.innerHTML = 'Start Guessing';
            clearInterval(interval);
        }
    }, 1000)
}

