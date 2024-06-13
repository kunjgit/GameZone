// script.js

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('time');

let shuffledQuestions, currentQuestionIndex, score, timeLeft, timerInterval;

// define questions array with question and answer
const questions = [
    {
        question: 'What was the first animated feature film released by Disney?',
        answers: [
            { text: 'Snow White and the Seven Dwarfs', correct: true },
            { text: 'Cinderella', correct: false },
            { text: 'Sleeping Beauty', correct: false },
            { text: 'Bambi', correct: false }
        ]
    },
    {
        question: 'In "The Lion King," what is the name of Simba\'s father?',
        answers: [
            { text: 'Scar', correct: false },
            { text: 'Mufasa', correct: true },            
            { text: 'Timon', correct: false },
            { text: 'Pumbaa', correct: false }
        ]
    },
    {
        question: 'What is the name of the toy cowboy in "Toy Story"?',
        answers: [
            { text: 'Buzz Lightyear', correct: false },
            { text: 'Jessie', correct: false },
            { text: 'Bullseye', correct: false },
            { text: 'Woody', correct: true },            
        ]
    },
    {
        question: 'Which Disney princess has a pet tiger named Rajah?',
        answers: [
            { text: 'Jasmine', correct: true },
            { text: 'Ariel', correct: false },
            { text: 'Belle', correct: false },
            { text: 'Mulan', correct: false }
        ]
    },
    {
        question: 'What does the crocodile swallow in "Peter Pan"?',
        answers: [
            { text: 'Captain Hook\'s hook', correct: false },
            { text: 'Peter Pan\'s hat', correct: false },
            { text: 'A clock', correct: true },            
            { text: 'A map', correct: false }
        ]
    },
    {
        question: 'What kind of animal is Dumbo?',
        answers: [
            { text: 'A mouse', correct: false },
            { text: 'An elephant', correct: true },
            { text: 'A lion', correct: false },
            { text: 'A bear', correct: false }
        ]
    },
    {
        question: 'In "Beauty and the Beast," what is the name of the teapot?',
        answers: [
            { text: 'Mrs. Potts', correct: true },
            { text: 'Lumière', correct: false },
            { text: 'Cogsworth', correct: false },
            { text: 'Belle', correct: false }
        ]
    },
    {
        question: 'In which Disney movie do two dogs share a plate of spaghetti?',
        answers: [
            { text: '101 Dalmatians', correct: false },
            { text: 'The Fox and the Hound', correct: false },
            { text: 'Lady and the Tramp', correct: true },            
            { text: 'Oliver & Company', correct: false }
        ]
    },
    {
        question: 'What is the name of the bear in "The Jungle Book"?',
        answers: [
            { text: 'Baloo', correct: true },
            { text: 'Bagheera', correct: false },
            { text: 'Shere Khan', correct: false },
            { text: 'Kaa', correct: false }
        ]
    },
    {
        question: 'Which Disney princess sings "Part of Your World"?',
        answers: [
            { text: 'Belle', correct: false },
            { text: 'Cinderella', correct: false },
            { text: 'Rapunzel', correct: false },
            { text: 'Ariel', correct: true },            
        ]
    },
    {
        question: 'In "Aladdin," what is the name of Aladdin\'s pet monkey?',
        answers: [
            { text: 'Iago', correct: false },
            { text: 'Abu', correct: true },            
            { text: 'Rajah', correct: false },
            { text: 'Sultan', correct: false }
        ]
    },
    {
        question: 'In "Finding Nemo," what kind of fish is Nemo?',
        answers: [
            { text: 'Clownfish', correct: true },
            { text: 'Goldfish', correct: false },
            { text: 'Betta fish', correct: false },
            { text: 'Angelfish', correct: false }
        ]
    },
    {
        question: 'In "Frozen," which song does Elsa sing as she builds the castle?',
        answers: [
            { text: 'Let It Go', correct: true },
            { text: 'Do You Want to Build a Snowman?', correct: false },
            { text: 'For the First Time in Forever', correct: false },
            { text: 'Love Is an Open Door', correct: false }
        ]
    },
    {
        question: 'In "Mulan," what is the name of Mulan\'s dragon guardian?',
        answers: [
            { text: 'Shan Yu', correct: false },
            { text: 'Crikee', correct: false },
            { text: 'Mushu', correct: true },            
            { text: 'Li Shang', correct: false }
        ]
    },
    {
        question: 'What does Rapunzel use to hit Flynn Ryder over the head?',
        answers: [
            { text: 'A book', correct: false },
            { text: 'A frying pan', correct: true },            
            { text: 'A chair', correct: false },
            { text: 'A vase', correct: false }
        ]
    },
    {
        question: 'In "Hercules," what are the names of the two little demons that work for Hades?',
        answers: [            
            { text: 'Famine and Pestilence', correct: false },
            { text: 'Destruction and Chaos', correct: false },
            { text: 'Pain and Panic', correct: true },
            { text: 'Wrath and Fury', correct: false }
        ]
    },
    {
        question: 'In "Cinderella," what are the names of Cinderella\'s stepsisters?',
        answers: [            
            { text: 'Beatrice and Eugenie', correct: false },
            { text: 'Hilda and Helga', correct: false },
            { text: 'Flora and Fauna', correct: false },
            { text: 'Anastasia and Drizella', correct: true },           
        ]
    },
    {
        question: 'In "The Little Mermaid," what does Ariel call the fork she collects?',
        answers: [
            { text: 'Dinglehopper', correct: true },
            { text: 'Snarfblatt', correct: false },
            { text: 'Thingamabob', correct: false },
            { text: 'Gizmo', correct: false }
        ]
    }    
];


startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

skipButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

// function to start the game
function startGame() {
    startButton.classList.add('hide'); // hide start button
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0; // reset question
    score = 0; // reset score
    scoreContainer.classList.add('hide'); //hide score container
    questionContainerElement.classList.remove('hide'); //show question container
    setNextQuestion();
}

// function to set next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    startTimer(); 
}

// function to display the question and answers
function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button'); // create a button for each answer
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// function to reset
function resetState() {
    clearInterval(timerInterval);
    timerElement.innerText = '15';
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// function to select answer
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++; // if correct answer then increment score
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        scoreContainer.classList.remove('hide');
        scoreElement.innerText = `Your Score: ${score}`;
        questionContainerElement.classList.add('hide');
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// function to start timer
function startTimer() {
    timeLeft = 15;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentQuestionIndex++;  
            setNextQuestion();                        
        }
    }, 1000);
}

