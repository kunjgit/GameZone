var board = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', 'B', 'W', '', '', ''],
  ['', '', '', 'W', 'B', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '']
];

var currentPlayer = 'B';
var blackScore = 2;
var whiteScore = 2;
var gameOver = false;

var boardElement = document.getElementById('board');
var blackScoreElement = document.getElementById('black-score');
var whiteScoreElement = document.getElementById('white-score');
var messageElement = document.getElementById('message');

renderBoard();

boardElement.addEventListener('click', handleMove);

function renderBoard() {
  boardElement.innerHTML = '';

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;

      if (board[i][j] === 'B') {
        cell.innerText = '●';
      } else if (board[i][j] === 'W') {
        cell.innerText = '○';
        cell.classList.add('white');
      } else {
        cell.classList.add('empty');
      }

      boardElement.appendChild(cell);
    }
  }

  updateScores();
}

function handleMove(event) {
  if (gameOver) {
    return;
  }

  var row = parseInt(event.target.dataset.row);
  var col = parseInt(event.target.dataset.col);

  if (isValidMove(row, col)) {
    flipTiles(row, col);
    currentPlayer = currentPlayer === 'B' ? 'W' : 'B';
    renderBoard();

    if (!hasValidMoves()) {
      currentPlayer = currentPlayer === 'B' ? 'W' : 'B';

      if (!hasValidMoves()) {
        gameOver = true;
        showGameResult();
      } else if (currentPlayer === 'W') {
        setTimeout(makeAIMove, 500);
      }
    }
  }
}

function makeAIMove() {
  var validMoves = [];

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (isValidMove(i, j)) {
        validMoves.push({ row: i, col: j });
      }
    }
  }

  if (validMoves.length > 0) {
    var randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    flipTiles(randomMove.row, randomMove.col);
    currentPlayer = 'B';
    renderBoard();

    if (!hasValidMoves()) {
      currentPlayer = 'W';

      if (!hasValidMoves()) {
        gameOver = true;
        showGameResult();
      }
    }
  }
}

function isValidMove(row, col) {
  if (board[row][col] !== '') {
    return false;
  }

  var directions = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
  ];

  for (var i = 0; i < directions.length; i++) {
    var dx = directions[i].x;
    var dy = directions[i].y;
    var x = row + dx;
    var y = col + dy;

    if (
      x >= 0 && x < 8 &&
      y >= 0 && y < 8 &&
      board[x][y] !== '' &&
      board[x][y] !== currentPlayer
    ) {
      while (
        x >= 0 && x < 8 &&
        y >= 0 && y < 8 &&
        board[x][y] !== '' &&
        board[x][y] !== currentPlayer
      ) {
        x += dx;
        y += dy;
      }

      if (
        x >= 0 && x < 8 &&
        y >= 0 && y < 8 &&
        board[x][y] === currentPlayer
      ) {
        return true;
      }
    }
  }

  return false;
}

function flipTiles(row, col) {
  var directions = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
  ];

  for (var i = 0; i < directions.length; i++) {
    var dx = directions[i].x;
    var dy = directions[i].y;
    var x = row + dx;
    var y = col + dy;

    if (
      x >= 0 && x < 8 &&
      y >= 0 && y < 8 &&
      board[x][y] !== '' &&
      board[x][y] !== currentPlayer
    ) {
      var tilesToFlip = [];
      while (
        x >= 0 && x < 8 &&
        y >= 0 && y < 8 &&
        board[x][y] !== '' &&
        board[x][y] !== currentPlayer
      ) {
        tilesToFlip.push({ row: x, col: y });
        x += dx;
        y += dy;
      }

      if (
        x >= 0 && x < 8 &&
        y >= 0 && y < 8 &&
        board[x][y] === currentPlayer
      ) {
        for (var j = 0; j < tilesToFlip.length; j++) {
          var flipRow = tilesToFlip[j].row;
          var flipCol = tilesToFlip[j].col;
          board[flipRow][flipCol] = currentPlayer;
        }
      }
    }
  }

  board[row][col] = currentPlayer;
}

function hasValidMoves() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (isValidMove(i, j)) {
        return true;
      }
    }
  }

  return false;
}

function updateScores() {
  var blackCount = 0;
  var whiteCount = 0;

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (board[i][j] === 'B') {
        blackCount++;
      } else if (board[i][j] === 'W') {
        whiteCount++;
      }
    }
  }

  blackScore = blackCount;
  whiteScore = whiteCount;

  blackScoreElement.innerText = blackScore;
  whiteScoreElement.innerText = whiteScore;
}

function showGameResult() {
  if (blackScore > whiteScore) {
    messageElement.innerText = 'Black wins!';
  } else if (blackScore < whiteScore) {
    messageElement.innerText = 'White wins!';
  } else {
    messageElement.innerText = 'It\'s a draw!';
  }
}
