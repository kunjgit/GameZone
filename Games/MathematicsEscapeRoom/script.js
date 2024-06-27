const roomDescription = document.querySelector('.room-description');
const answerInput = document.getElementById('answer');
const checkBtn = document.getElementById('check-btn');
const message = document.getElementById('message');

// Define puzzles and answers for each room
const puzzles = [
  { room: 1, question: 'What is 2 + 2?', answer: '4' },
  { room: 2, question: 'What is 5 * 3?', answer: '15' },
  { room: 3, question: 'What is 8 - 3?', answer: '5' },
  { room: 4, question: 'What is 10 / 2?', answer: '5' },
  { room: 5, question: 'What is 4 * 6?', answer: '24' },
  { room: 6, question: 'What is 12 + 7?', answer: '19' },
  { room: 7, question: 'What is 15 - 9?', answer: '6' },
  { room: 8, question: 'What is 18 / 3?', answer: '6' },
  { room: 9, question: 'What is 9 * 9?', answer: '81' },
  { room: 10, question: 'What is 25 - 12?', answer: '13' },
  { room: 11, question: 'What is 30 / 5?', answer: '6' },
  { room: 12, question: 'What is 11 * 4?', answer: '44' },
  { room: 13, question: 'What is 45 - 27?', answer: '18' },
  { room: 14, question: 'What is 64 / 8?', answer: '8' },
  { room: 15, question: 'What is 16 * 3?', answer: '48' },
  { room: 16, question: 'What is 72 + 18?', answer: '90' },
  { room: 17, question: 'What is 100 - 85?', answer: '15' },
  { room: 18, question: 'What is 144 / 12?', answer: '12' },
  { room: 19, question: 'What is 25 * 5?', answer: '125' },
  { room: 20, question: 'What is 99 - 64?', answer: '35' },
];

let currentRoom = 0;

function displayRoom() {
  const currentPuzzle = puzzles[currentRoom];
  roomDescription.textContent = `You are in Room ${currentPuzzle.room}. ${currentPuzzle.question}`;
  answerInput.value = '';
  answerInput.focus();
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const currentPuzzle = puzzles[currentRoom];

  if (userAnswer === currentPuzzle.answer.toLowerCase()) {
    message.textContent = 'Correct answer! Moving to the next room...';
    message.style.color = '#008000'; // Green color for correct answer message

    // Move to the next room
    currentRoom++;
    if (currentRoom < puzzles.length) {
      setTimeout(displayRoom, 1000); // Display next room after 1 second
    } else {
      roomDescription.textContent = 'Congratulations! You have escaped from all the rooms!';
      answerInput.style.display = 'none';
      checkBtn.style.display = 'none';
    }
  } else {
    message.textContent = 'Oops! Wrong answer. Try again!';
    message.style.color = '#ff0000'; // Red color for wrong answer message
  }
}

checkBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    checkAnswer();
  }
});

// Start the game by displaying the first room
displayRoom();

