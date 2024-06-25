const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {}; //this is an object
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
// questions array

//using fetch API to get the question from local file i.e questions.json
let questions = [{}, {}, {}, {}, {}];

//promise function?? response
//fetch rturns a promise
// fetch("../questions.json")
//   .then((res) => {
//     return res.json();
//   })
//   .then((loadedQuestions) => {
//     // console.log(loadedQuestions);
//     questions = loadedQuestions;
//     console.log(loadedQuestions.length);
//     startGame();
//   }).catch(err =>{
//     console.error(err);
//   });
fetch("https://opentdb.com/api.php?amount=50&type=multiple")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    // console.log(loadedQuestions);
    // questions = loadedQuestions;
    // console.log(loadedQuestions);
    questions = loadedQuestions.results.map((loadedQuestions) => {
      const formattedQuestion = {
        question: loadedQuestions.question,
      };
      const answerChoices = [...loadedQuestions.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestions.correct_answer);
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = questions.length;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  //   using spread operator making an entire copy of the questions array
  // console.log(availableQuestions.length);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};
getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page if the questions array is empty
    return window.location.assign("../end page/end.html");
  }
  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  //   get the available question and remove it so that it wont come again while a player is playing
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"]; //this returns a string
    var correct_choice;
    //function to get the correct_choice element
    if (currentQuestion.answer == 1) {
      correct_choice = document.getElementById("1");
    } else if (currentQuestion.answer == 2) {
      correct_choice = document.getElementById("2");
    } else if (currentQuestion.answer == 3) {
      correct_choice = document.getElementById("3");
    } else if (currentQuestion.answer == 4) {
      correct_choice = document.getElementById("4");
    }

    //both these are numbers option numbers
    // console.log(selectedChoice); //this will return the entire element of the selected option
    // console.log(correct_choice);
    // console.log(selectedAnswer); //this will return the option numbrt of the selected answer

    // const classToApply = 'incorrect';
    // if(selectedAnswer == currentQuestion.answer){
    //     classToApply = 'correct';
    // }
    //or can use a ternary operator
    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    //take the parent element of the sleected choice to whome the class will be applied
    //now i want some delay between adding and removing classes
    selectedChoice.parentElement.classList.add(classToApply);
    correct_choice.parentElement.classList.add("correct");
    setTimeout(() => {
      {
        selectedChoice.parentElement.classList.remove(classToApply);
        correct_choice.parentElement.classList.remove("correct");
      }
      getNewQuestion();
    }, 1500);
    // console.log(selectedAnswer);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
