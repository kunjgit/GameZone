const timer = document.querySelector('.timer');
const popup = document.querySelector('.popup');
const reset = document.querySelector('.reset');
const submit = document.querySelector('.submit');
const input = document.querySelector('input')
const word_container = document.querySelector('.word-container')
const popup_content = document.querySelector('.popup-content')

const colors = [
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Gray",
    "Silver",
    "Gold",
    "Indigo",
    "Cyan",
    "Magenta",
    "Maroon"
  ];

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const current = [
    getRandomColor(),
    getRandomColor()
]


let start=60
const interva = setInterval(function () {
    start-=1;
    let label = `00:${start}`;
    if(start < 10) {
        label = `00:0${start}`;
    }
    timer.innerText = label;
    
    if(start < 0) {
        popup_content.innerText = `Times Upppp !!! \n Right color : ${current[1]}`
        clearInterval(interva);
        popup.classList.toggle('close');
    }
}, 1000)

reset.addEventListener('click', () => {
    location.reload();
})



word_container.innerText = current[0];
word_container.style.color = current[1];

submit.addEventListener('click', () => {
    
    const val = input.value;
    if(!val) return;

    console.log(current[1].toLowerCase, '----', val.toLowerCase)
    if(val.toLowerCase() === current[1].toLowerCase()) {
        popup_content.innerText = 'Yayy , You Won !!!'
        popup.classList.toggle('close');
    } else {
        popup_content.innerText = `You lost !!! \n Right color : ${current[1]}`
        popup.classList.toggle('close');
    }
})