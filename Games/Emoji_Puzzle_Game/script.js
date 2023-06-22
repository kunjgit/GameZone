let pic = ['🎮', '🔊', '⚙️', '😍', '😴', '🤑', '💀', '👻', '👽', '🐭', '🐸', '🐢', '🐬', '🧟', '🥷', '🎈', '🎉', '😷', '🕸️', '🎯', '🔒', '🔑', '🧲', '☎️', '🏧', '⏰', '🧭', '🏚️', '☢️', '📵', '🚓']

let randomNumber = [];
// Generate a random number between 1 and 30
let randomNumber1 = Math.floor(Math.random() * 30) + 1;
randomNumber.push(randomNumber1);
let randomNumber2 = Math.floor(Math.random() * 30) + 1;
while (randomNumber.includes(randomNumber2)) {
    randomNumber2 = Math.floor(Math.random() * 30) + 1;
}
randomNumber.push(randomNumber2);
let randomNumber3 = Math.floor(Math.random() * 30) + 1;
while (randomNumber.includes(randomNumber3)) {
    randomNumber3 = Math.floor(Math.random() * 30) + 1;
}
randomNumber.push(randomNumber3);
let randomNumber4 = Math.floor(Math.random() * 30) + 1;
while (randomNumber.includes(randomNumber4)) {
    randomNumber4 = Math.floor(Math.random() * 30) + 1;
}
randomNumber.push(randomNumber4);
let randomNumber5 = Math.floor(Math.random() * 30) + 1;
while (randomNumber.includes(randomNumber5)) {
    randomNumber5 = Math.floor(Math.random() * 30) + 1;
}

let sum1 = randomNumber1 + randomNumber1 + randomNumber1;
let sum2 = randomNumber1 + randomNumber2 + randomNumber2;
let sum3 = randomNumber1 + randomNumber2 + randomNumber3;
let sum4 = randomNumber3 + randomNumber1 + randomNumber4;
let sum5 = randomNumber3 + randomNumber4 + randomNumber5;
let sum6 = randomNumber5 + randomNumber4 + randomNumber2;
let sum = [sum1, sum2, sum3, sum4, sum5, sum6];

const container = document.getElementById('container');

const rightAnswer = new Audio('./sounds/rightAnswer.mp3');
const wrongAnswer = new Audio('./sounds/wrongAnswer.mp3');

// function which handle the formation of game page
function createGamePage() {

    // Result declaring objects
    let rightWrong = document.createElement('div');
    let rightAns = document.createElement('span');
    let wrongAns = document.createElement('span');
    rightAns.classList.add('show', 'an');
    wrongAns.classList.add('show', 'an');
    rightAns.setAttribute('id', 'right');
    wrongAns.setAttribute('id', 'wrong');
    rightAns.textContent = "Right Answer";
    wrongAns.textContent = "Wrong Answer";
    rightAns.style.display = 'none';
    wrongAns.style.display = 'none';
    rightWrong.appendChild(rightAns);
    rightWrong.appendChild(wrongAns);
    container.appendChild(rightWrong);

    // Hint and play again buttons
    let btnUpdate = document.createElement('div');
    btnUpdate.classList.add('btn_update');
    let hintBtn = document.createElement('button'); // Hint Btn
    hintBtn.textContent = 'Hint';
    hintBtn.setAttribute('id', 'hintBtn');
    let hintAns = document.createElement('span'); // Hint -> answer
    hintAns.classList.add('show');
    hintAns.setAttribute('id', 'hintAns');
    // hintAns.textContent = 45;
    hintAns.style.display = 'none';
    let againBtn = document.createElement('button'); // Play again btn
    againBtn.classList.add('again');
    againBtn.setAttribute('id', 'playAgainBtn');
    againBtn.textContent = 'Play Again';
    btnUpdate.appendChild(hintBtn);
    btnUpdate.appendChild(hintAns);
    btnUpdate.appendChild(againBtn);
    container.appendChild(btnUpdate);

    // Creating emoji table
    let emojiTable = document.createElement('div');
    emojiTable.classList.add('emogy');
    for (let i = 1; i <= 6; i++) {
        let row = document.createElement('div');
        row.classList.add('rendomimg');
        for (let j = 1; j <= 5; j++) {
            let cell = document.createElement('span');
            if (j % 2 === 1) {
                cell.classList.add('sp');

                // Setting emojis on the table
                if (i === 1) cell.textContent = pic[randomNumber1];
                else if (i === 2) {
                    if (j === 3) cell.textContent = pic[randomNumber1];
                    else cell.textContent = pic[randomNumber2];
                } else if (i === 3) {
                    if (j === 1) cell.textContent = pic[randomNumber1];
                    else if (j === 3) cell.textContent = pic[randomNumber2];
                    else cell.textContent = pic[randomNumber3];
                } else if (i === 4) {
                    if (j === 1) cell.textContent = pic[randomNumber3];
                    else if (j === 3) cell.textContent = pic[randomNumber1];
                    else cell.textContent = pic[randomNumber4];
                } else if (i === 5) {
                    if (j === 1) cell.textContent = pic[randomNumber3];
                    else if (j === 3) cell.textContent = pic[randomNumber4];
                    else cell.textContent = pic[randomNumber5];
                } else {
                    if (j === 1) cell.textContent = pic[randomNumber5];
                    else if (j === 3) cell.textContent = pic[randomNumber4];
                    else cell.textContent = pic[randomNumber2];
                }
            }
            else {
                cell.classList.add('add');
                cell.textContent = '+';
            }
            row.appendChild(cell);
        }
        let eqSpan = document.createElement('span');
        eqSpan.classList.add('eq');
        eqSpan.textContent = '=';
        row.appendChild(eqSpan);
        let ansSpan = document.createElement('span');
        if (i === 6) {
            ansSpan.classList.add('qes');
            ansSpan.textContent = '❓';
        }
        else {
            ansSpan.classList.add('ans');
            ansSpan.textContent = sum[i - 1];
        }
        row.appendChild(ansSpan);
        emojiTable.appendChild(row);
    }
    container.appendChild(emojiTable);

    // input box and submit button
    let check = document.createElement('div');
    check.classList.add('chackown');
    let input = document.createElement('input');
    input.type = 'number';
    check.appendChild(input);
    let submitBtn = document.createElement('button');
    submitBtn.classList.add('submitBtn');
    submitBtn.textContent = "Submit Answer";
    check.appendChild(submitBtn);
    container.appendChild(check);
}

createGamePage();

// Adding functioning using pressing the enter button
let myInput = document.querySelector('input');
myInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        checkValue();
    }
})

// Working of Submit button
let submitBtn = document.querySelector('.submitBtn');
submitBtn.addEventListener('click', () => {
    checkValue();
});

// Function handle the checking of entered value
function checkValue() {
    let inputBox = document.querySelector('input');
    let enteredValue = parseInt(inputBox.value);
    if (enteredValue === sum6) {
        let rightAns = document.getElementById('right');
        rightAns.style.display = 'block';
        rightAnswer.play();
        setTimeout(() => {
            rightAns.style.display = 'none';
            document.location.reload();
        }, 4000);
    } else {
        let wrongAns = document.getElementById('wrong');
        wrongAns.style.display = 'block';
        wrongAnswer.play();
        setTimeout(() => {
            wrongAns.style.display = 'none';
        }, 1800);
    }
}

// Working of Hint Button
let hintBtn = document.getElementById('hintBtn');
hintBtn.addEventListener('click', () => {
    let hintAns = document.getElementById('hintAns');
    hintAns.textContent = sum6;
    hintAns.style.display = 'block';
    setTimeout(() => {
        hintAns.style.display = 'none';
    }, 2000);
});

// Working of Play Again Button
let playBtn = document.getElementById('playAgainBtn');
playBtn.addEventListener('click', () => {
    document.location.reload();
});