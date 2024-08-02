// script.js

const typingText = document.querySelector(".text p");
const field = document.querySelector(".container .input");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const cpmTag = document.querySelector(".cpm span");
const wpmTag = document.querySelector(".wpm span");
const tryAgain = document.querySelector("button");
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let timer;
let maxTime = 60;
let timeLeft = maxTime;

function randomParagraph() {
    let randIndex = Math.floor(Math.random() * paragraphs.length); // Get a random paragraph
    typingText.innerHTML = ""; // Clear previous paragraph
   
    paragraphs[randIndex].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    // Focusing input field on keydown or click event
    document.addEventListener("keydown", () => field.focus());
    typingText.addEventListener("click", () => field.focus());
}

function initTyping() {
    const characters = typingText.querySelectorAll("span");
    let typedChar = field.value.split("")[charIndex];
    if(charIndex<characters.length -1 && timeLeft > 0 ){
    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) { // If typed character is null or presses backspace
        if (charIndex > 0) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--; // Decrements mistakes only if class is incorrect
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        }
    } else {
        if (characters[charIndex].innerText === typedChar) {
            // If user types character correctly then class becomes correct otherwise incorrect with mistakes incremented
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        charIndex++;
    }
    
    characters.forEach(span => span.classList.remove("active"));
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    }
    let wpm = Math.round((((charIndex-mistakes)/5)/(maxTime-timeLeft)) * 60);
    //if wpm value is less than 0,empty or infinity then setting its value to 0
    wpm=wpm<0 || !wpm || wpm === Infinity ? 0: wpm;
    wpmTag.innerText=wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
}else{
   
   clearInterval(timer);
}
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
        field.disabled = true; // Optional: Disable input when time runs out
        alert("Time's up!");
    }
}
function reset()
{
    randomParagraph();
    field.value="";
    clearInterval(timer);
    timeLeft=maxTime;
    charIndex=mistakes=isTyping =0;
    timeTag.innerText = timeLeft;
    wpmTag.innerText=0;
    mistakeTag.innerText =mistakes;
    cpmTag.innerText = 0;
}
randomParagraph();
field.addEventListener("input", initTyping);
tryAgain.addEventListener("click", reset);