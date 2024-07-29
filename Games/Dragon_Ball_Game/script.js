const questions = [
    {
      question: "What is Goku's Saiyan name?",
      answers: [
        { text: "Kakarot", correct: true },
        { text: "Raditz", correct: false },
        { text: "Vegeta", correct: false },
        { text: "Bardock", correct: false }
      ]
    },
    {
      question: "Who created the Dragon Balls?",
      answers: [
        { text: "Kami", correct: false },
        { text: "King Kai", correct: false },
        { text: "Namekians", correct: true },
        { text: "Supreme Kai", correct: false }
      ]
    },
    {
      question: "What is the highest Super Saiyan level Goku reaches in Dragon Ball Z?",
      answers: [
        { text: "Super Saiyan 2", correct: false },
        { text: "Super Saiyan 3", correct: true },
        { text: "Super Saiyan 4", correct: false },
        { text: "Super Saiyan God", correct: false }
      ]
    },
    {
      question: "What is the name of Goku's first son?",
      answers: [
        { text: "Gohan", correct: true },
        { text: "Trunks", correct: false },
        { text: "Goten", correct: false },
        { text: "Krillin", correct: false }
      ]
    },
    {
      question: "Who defeats Cell in the Cell Saga?",
      answers: [
        { text: "Goku", correct: false },
        { text: "Vegeta", correct: false },
        { text: "Gohan", correct: true },
        { text: "Trunks", correct: false }
      ]
    },
    {
      question: "Which character is known for their destructo disc attack?",
      answers: [
        { text: "Goku", correct: false },
        { text: "Vegeta", correct: false },
        { text: "Krillin", correct: true },
        { text: "Piccolo", correct: false }
      ]
    },
    {
      question: "What is the name of Vegeta's father?",
      answers: [
        { text: "King Cold", correct: false },
        { text: "King Kai", correct: false },
        { text: "King Vegeta", correct: true },
        { text: "King Piccolo", correct: false }
      ]
    },
    {
      question: "Which Dragon Ball character is a reincarnation of Majin Buu?",
      answers: [
        { text: "Uub", correct: true },
        { text: "Broly", correct: false },
        { text: "Jiren", correct: false },
        { text: "Beerus", correct: false }
      ]
    },
    {
      question: "What is the name of the fusion technique that Goku and Vegeta use?",
      answers: [
        { text: "Potara Fusion", correct: false },
        { text: "Fusion Dance", correct: true },
        { text: "Metamoran Fusion", correct: false },
        { text: "Namekian Fusion", correct: false }
      ]
    },
    {
      question: "Who is the main antagonist of the Frieza Saga?",
      answers: [
        { text: "Cell", correct: false },
        { text: "Majin Buu", correct: false },
        { text: "Frieza", correct: true },
        { text: "Android 18", correct: false }
      ]
    },
    {
        question: "What is the name of the planet where Goku trains with King Kai?",
        answers: [
            { text: "Planet Vegeta", correct: false },
            { text: "Planet Namek", correct: false },
            { text: "Planet Yardrat", correct: false },
            { text: "King Kai's Planet", correct: true }
        ]
    },
    {
        question: "Who is the legendary Super Saiyan that appears in the Dragon Ball Z movies?",
        answers: [
            { text: "Broly", correct: true },
            { text: "Bardock", correct: false },
            { text: "Turles", correct: false },
            { text: "Paragus", correct: false }
        ]
    },
    {
        question: "What is the technique used by Master Roshi to increase his strength and size?",
        answers: [
            { text: "Kaio-ken", correct: false },
            { text: "Kamehameha", correct: false },
            { text: "Roshi Power-Up", correct: false },
            { text: "Max Power", correct: true }
        ]
    },
    {
        question: "Which form does Frieza take when he first fights Goku on Planet Namek?",
        answers: [
            { text: "First Form", correct: false },
            { text: "Second Form", correct: false },
            { text: "Third Form", correct: false },
            { text: "Final Form", correct: true }
        ]
    },
    {
        question: "What is the special ability of the Namekian Dragon Balls compared to the Earth Dragon Balls?",
        answers: [
            { text: "They can grant any wish", correct: false },
            { text: "They are larger in size", correct: false },
            { text: "They can grant three wishes", correct: true },
            { text: "They have no limitations", correct: false }
        ]
    },
    {
        question: "Who is the Supreme Kai's attendant?",
        answers: [
            { text: "Whis", correct: false },
            { text: "Beerus", correct: false },
            { text: "Kibito", correct: true },
            { text: "Elder Kai", correct: false }
        ]
    },
    {
        question: "What technique does Goku use to travel long distances instantly?",
        answers: [
            { text: "Flying Nimbus", correct: false },
            { text: "Kaio-ken", correct: false },
            { text: "Instant Transmission", correct: true },
            { text: "Fusion Dance", correct: false }
        ]
    },
    {
        question: "Which form of Buu absorbs Gohan?",
        answers: [
            { text: "Kid Buu", correct: false },
            { text: "Fat Buu", correct: false },
            { text: "Super Buu", correct: true },
            { text: "Evil Buu", correct: false }
        ]
    },
    {
        question: "What is the name of the God of Destruction introduced in Dragon Ball Super?",
        answers: [
            { text: "Champa", correct: false },
            { text: "Beerus", correct: true },
            { text: "Whis", correct: false },
            { text: "Zeno", correct: false }
        ]
    },
    {
        question: "Which character kills King Piccolo?",
        answers: [
            { text: "Goku", correct: true },
            { text: "Piccolo Jr.", correct: false },
            { text: "Tien", correct: false },
            { text: "Kami", correct: false }
        ]
    }
];


  let currentQuestion = 0;
  let score = 0;
  let wrongAnswers = [];

  const questionContainer = document.getElementById('question-container');
  const nextButton = document.getElementById('next-btn');
  const resultContainer = document.getElementById('result');

  function displayQuestion() {
    const currentQ = questions[currentQuestion];
    questionContainer.innerHTML = `
      <h2>${currentQ.question}</h2>
      <ul>
        ${currentQ.answers.map((answer, index) => `
          <li>
            <input type="radio" id="answer${index}" name="answer" value="${answer.correct}">
            <label for="answer${index}">${answer.text}</label>
          </li>
        `).join('')}
      </ul>
    `;
    nextButton.style.display = 'inline';
  }

  function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) return;

    if (selectedAnswer.value === 'true') {
      score++;
    } else {
      wrongAnswers.push({
        question: questions[currentQuestion].question,
        correctAnswer: questions[currentQuestion].answers.find(answer => answer.correct).text,
        userAnswer: selectedAnswer.nextElementSibling.innerText
      });
    }

    currentQuestion++;
    selectedAnswer.checked = false;

    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    questionContainer.innerHTML = '';
    nextButton.style.display = 'none';

    resultContainer.innerHTML = `<h3>Your Score: ${score}/${questions.length}</h3>`;
    if (wrongAnswers.length > 0) {
      resultContainer.innerHTML += '<h3>Incorrect Answers:</h3>';
      wrongAnswers.forEach(wrong => {
        resultContainer.innerHTML += `
          <p><strong>Question:</strong> ${wrong.question}</p>
          <p><strong>Your Answer:</strong> ${wrong.userAnswer}</p>
          <p><strong>Correct Answer:</strong> ${wrong.correctAnswer}</p>
        `;
      });
    }
  }

  displayQuestion();

  nextButton.addEventListener('click', function() {
    this.classList.add('button-clicked');
    checkAnswer();
  });