const startBtn = document.getElementById('start_btn');
const image = document.getElementById("image");
const replayBtn = document.getElementById("replay");
const options = document.querySelectorAll("#game ul li");
const nextBtn = document.getElementById("next_ques");
const resultInfo = document.querySelector("#result h1");
const gameBox = document.getElementById("game");
const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");
const intro = document.getElementById('intro');
const showHint = document.getElementById("hint_btn");
const ansBody = document.getElementById("result");
const maskImg = document.getElementById("mask");
let question = [], i = 0, score = 0, wrongCount = 0, clickCount = 0;

// Function to start the game by clicking the start button

startBtn.addEventListener('click', () => {
    intro.classList.add('fadeOut');
    initQuestions();
    gameBox.classList.remove("showResult");
});

// Array Of Objects For Questions And Answers

const initQuestions = () => {
    question = [];
    i = 0; score = 0; clickCount = 0;wrongCount = 0;
    while (question.length < 5) {
        const randomInd = Math.floor(Math.random() * info.length);
        if (!question.includes(randomInd)) {
            question.push(randomInd);
        }
    }
    changeQuestion(i);
}

// Function For Changing The Active Class

options.forEach((option) => {
    option.addEventListener("click", () => {
        options.forEach((opt) => {
            opt.classList.remove("active");
        })
        option.classList.add("active");
    })
});

// Function For Changing The Question

const changeQuestion = (i) => {
    image.src = info[question[i]].img_src;
    opt1.textContent = info[question[i]].option1;
    opt2.textContent = info[question[i]].option2;
    opt3.textContent = info[question[i]].option3;
    opt4.textContent = info[question[i]].option4;
}

// Function For Checking The Answer And Deside the correct Answer and Wrong Answer and give score to the user

nextBtn.addEventListener("click", () => {
    let selected = document.querySelector(".active");
    if (!selected) {
        alert("Please select an option");
        return;
    }
    if (selected.textContent === info[question[i]].answer) {
        i++;
        score += (3 - wrongCount);
        if (i === 5) {
            resultInfo.textContent = `Your Score is ${score}`;
            gameBox.classList.add("showResult");
            ansBody.classList.remove("showReplay");
            options.forEach((opt) => {
                opt.classList.remove("active");
            })
            initQuestions();
            return;
        }
        clickCount = 0;
        maskImg.style.height = "60%";
        maskImg.style.width = "80%";
        changeQuestion(i);
        options.forEach((opt) => {
            opt.classList.remove("active");
        })
    }
    else {
        alert("Wrong Answer");
        wrongCount++;
        if (wrongCount === 3) {
            i++;
            if (i == 5) {
                resultInfo.textContent = `Your Score is ${score}`;
                gameBox.classList.add("showResult");
                ansBody.classList.remove("showReplay");
                options.forEach((opt) => {
                    opt.classList.remove("active");
                })
                initQuestions();
                return;
            }
            clickCount = 0;
            wrongCount = 0;
            maskImg.style.height = "60%";
            maskImg.style.width = "80%";
            changeQuestion(i);
            options.forEach((opt) => {
                opt.classList.remove("active");
            })
        }
    }
})

// Function For Giving Hint To The User

showHint.addEventListener("click", () => {
    if (clickCount === 0) {
        maskImg.style.height = info[question[i]].maskh;
        maskImg.style.width = info[question[i]].maskw;
        clickCount++;
        score--;
    } else {
        maskImg.style.height = "0%";
        maskImg.style.width = "0%";
        score--;
    }
})

// Function For Restart The Game By Showing The Main Screen

replayBtn.addEventListener("click", () => {
    initQuestions();
    ansBody.classList.add("showReplay");
    intro.classList.remove('fadeOut');
})