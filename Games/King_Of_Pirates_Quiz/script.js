const questions = [
    {
      question: "Who is the captain of the Straw Hat Pirates?",
      answers: ["Luffy", "Zoro", "Sanji", "Nami"],
      correctAnswer: "Luffy"
    },
    {
      question: "What is the name of Luffy's signature attack?",
      answers: ["Gum-Gum Pistol", "Gum-Gum Bazooka", "Gum-Gum Gatling", "Gum-Gum Red Hawk"],
      correctAnswer: "Gum-Gum Gatling"
    },
    {
      question: "Who is known as the 'Pirate Hunter'?",
      answers: ["Luffy", "Zoro", "Sanji", "Nami"],
      correctAnswer: "Zoro"
    },
    {
        question: "Who is known as the 'King of the Pirates'?",
    answers: ["Shanks", "Whitebeard", "Roger", "Kaido"],
    correctAnswer: "Roger"

    },
    {
    question: "What is the name of the Devil Fruit that Luffy eats?",
    answers: ["Gum-Gum Fruit", "Fire-Fire Fruit", "Ice-Ice Fruit", "Dark-Dark Fruit"],
    correctAnswer: "Gum-Gum Fruit"

    },
    {
    question: "Who is Luffy's adoptive brother?",
    answers: ["Zoro", "Ace", "Sanji", "Law"],
    correctAnswer: "Ace"

    },

    
    {
    question: "What is the name of Luffy's ship?",
    answers: ["Polar Tang", "Going Merry", "Moby Dick", "Red Force"],
    correctAnswer: "Going Merry"
    
  },
  {
    question: "What is Zoro's dream?",
    answers: ["To become the greatest swordsman", "To find the One Piece", "To become a famous chef", "To become a doctor"],
    correctAnswer: "To become the greatest swordsman"
    
  },
  {
    question: "Who is the creator of the One Piece manga and anime series?",
    answers: ["Eiichiro Oda", "Akira Toriyama", "Masashi Kishimoto", "Tite Kubo"],
    correctAnswer: "Eiichiro Oda"
    
  },
  {
    question: "Who is the doctor of the Straw Hat Pirates?",
    answers: ["Chopper", "Law", "Franky", "Brook"],
    correctAnswer: "Chopper"
  },
  {
    question: "What is the name of the island where Luffy first meets the Warlord Dracule Mihawk?",
    answers: ["Water 7", "Loguetown", "Sabaody Archipelago", "Baratie"],
    correctAnswer: "Baratie"
    
  },
  
  {
    question: "Which character has the highest known bounty in the One Piece series?",
    answers: ["Monkey D. Luffy", "Charlotte Katakuri", "Edward Newgate (Whitebeard)", "Marshall D. Teach (Blackbeard)"],
    correctAnswer: "Edward Newgate (Whitebeard)"
    
  },
  
  {
    question: "Who is the original owner of the Straw Hat that Luffy wears?",
    answers: ["Gol D. Roger", "Shanks", "Rayleigh", "Whitebeard"],
    correctAnswer: "Gol D. Roger"
  },
  {
    question: "What is the name of the island where the One Piece treasure is said to be located?",
    answers: ["Skypiea", "Raftel", "Wano", "Elbaf"],
    correctAnswer: "Raftel"
  },
  {
    question: "Which character can transform into a dragon?",
    answers: ["Marco", "Kaido", "Law", "Kin'emon"],
    correctAnswer: "Kaido"
  },
  {
    question: "What is the name of Luffy's first bounty poster?",
    answers: ["30,000,000 Berries", "100,000,000 Berries", "1,000,000 Berries", "10,000,000 Berries"],
    correctAnswer: "30,000,000 Berries"
  },
  {
    question: "Who is the captain of the Heart Pirates?",
    answers: ["Trafalgar Law", "Eustass Kid", "X Drake", "Killer"],
    correctAnswer: "Trafalgar Law"
  },
  {
    question: "What is the name of the special technique used by Zoro, where he creates multiple sword illusions?",
    answers: ["Oni Giri", "Tatsumaki", "Santoryu Ogi: Sanzen Sekai", "Asura"],
    correctAnswer: "Santoryu Ogi: Sanzen Sekai"
  },
  {
    question: "Who was the first character to defeat Luffy in a one-on-one fight?",
    answers: ["Crocodile", "Arlong", "Enel", "Mihawk"],
    correctAnswer: "Crocodile"
  },
  {
    question: "What is the name of Sanji's family of assassins?",
    answers: ["Baroque Works", "Big Mom Pirates", "Germa 66", "Beasts Pirates"],
    correctAnswer: "Germa 66"
  },
  {
    question: "Which character is known as the 'Magician'?",
    answers: ["Buggy", "Blackbeard", "Kizaru", "Magellan"],
    correctAnswer: "Magellan"
  },
  {
    question: "Who is the current Fleet Admiral of the Marines?",
    answers: ["Sengoku", "Aokiji", "Akainu", "Kizaru"],
    correctAnswer: "Akainu"
  },
  {
    question: "What is the name of the Devil Fruit eaten by Trafalgar Law?",
    answers: ["Op-Op Fruit", "Soul-Soul Fruit", "Room-Room Fruit", "Ope-Ope Fruit"],
    correctAnswer: "Ope-Ope Fruit"
  },
  {
    question: "Who is the captain of the Blackbeard Pirates?",
    answers: ["Blackbeard", "Shiryu", "Burgess", "Van Augur"],
    correctAnswer: "Blackbeard"
  },
  {
    question: "What is the name of the weapon used by Franky after the timeskip?",
    answers: ["Coup de Vent", "General Cannon", "Iron Pirate General Franky", "Franky Radical Beam"],
    correctAnswer: "Iron Pirate General Franky"
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
      ${currentQ.answers.map(answer => `<li><input type="radio" name="answer" value="${answer}">${answer}</li>`).join('')}
    </ul>
  `;
}

function checkAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) return;

  if (selectedAnswer.value === questions[currentQuestion].correctAnswer) {
    score++;
  } else {
    wrongAnswers.push({
      question: questions[currentQuestion].question,
      correctAnswer: questions[currentQuestion].correctAnswer,
      userAnswer: selectedAnswer.value
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
  