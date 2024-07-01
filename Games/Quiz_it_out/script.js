const questions = [
    {
        question: "Which company was originally called Cadabra ?",
        answers: [
            { text: "Flipkart", correct: false},
            { text: "Apple", correct: false},
            { text: "Amazon", correct: true},
            { text: "Netflix", correct: false},
        ]
    },
    {
        question: "Which planet in the options can be seen without the telescope ?",
        answers: [
            { text: "Neptune", correct: false},
            { text: "Uranus", correct: false},
            { text: "Saturn", correct: false},
            { text: "Venus", correct: true },
        ]
    },
    {
        question: "What is the 3rd letter of the Greek alphabet ?",
        answers: [
            { text: "Delta (Δ)", correct: false},
            { text: "Gamma (Γ)", correct: true},
            { text: "Alpha (Α)", correct: false},
            { text: "Beta  (Β)", correct: false },
        ]
    },
    {
        question: "How many hearts does an octopus have ?",
        answers: [
            { text: "6", correct: false},
            { text: "3 ", correct: true},
            { text: "5 ", correct: false},
            { text: "4 ", correct: false },
        ]
    },
    {
        question: "What country drinks the most coffee ? ",
        answers: [
            { text: "Denmark", correct: false},
            { text: "Sweden ", correct: false},
            { text: "Luxembourg", correct: false},
            { text: "Finland ", correct: true },
        ]
    },
    {
        question: "Which planet has a day which lasts eight months? ",
        answers: [
            { text: "Venus", correct: true},
            { text: "Jupiter ", correct: false},
            { text: "Saturn", correct: false},
            { text: "Mars ", correct: false },
        ]
    },
    {
        question: "Tsunami is a word in which language? ",
        answers: [
            { text: "Urdu", correct: false},
            { text: "Japanese ", correct: true},
            { text: "Spanish", correct: false},
            { text: "French ", correct: false },
        ]
    },
    {
        question: "Who was India’s first Deputy Prime Minister? ",
        answers: [
            { text: "Morarji Desai", correct: false},
            { text: "Devi Lal ", correct: false},
            { text: "Vallabhbhai Patel", correct: true},
            { text: "Charan Singh ", correct: false },
        ]
    }
]

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn'); 

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Next';
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectBtn = e.target;
    const isCorrect = selectBtn.dataset.correct === 'true';
    if(isCorrect){
        selectBtn.classList.add("correct");
        score++;
    }else{
        selectBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You Scored ${score} out of ${questions.length}`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton (){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=> {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        //To display outPut
        startQuiz();
    }
})

 //To display outPut
 startQuiz();

