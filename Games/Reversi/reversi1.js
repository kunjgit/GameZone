var unlocked = true;

var currentPlayer = 'b'; // Current player's turn
var board = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 'w', 'b', null, null, null],
  [null, null, null, 'b', 'w', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null]
];

function getPossibleMoves() {
  var moves = [];

  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      if (board[x][y] === currentPlayer) {
        checkLine({ x: x, y: y }, -1, -1, moves);
        checkLine({ x: x, y: y }, 0, -1, moves);
        checkLine({ x: x, y: y }, 1, -1, moves);
        checkLine({ x: x, y: y }, -1, 0, moves);
        checkLine({ x: x, y: y }, 1, 0, moves);
        checkLine({ x: x, y: y }, -1, 1, moves);
        checkLine({ x: x, y: y }, 0, 1, moves);
        checkLine({ x: x, y: y }, 1, 1, moves);
      }
    }
  }

  return moves;
}

function checkLine(startPos, xIncr, yIncr, moves) {
  var otherPlayersPieceFound = false;

  var startX = startPos.x;
  var startY = startPos.y;

  var newX = startX + xIncr;
  var newY = startY + yIncr;

  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
    while (board[newX][newY]) {
      if (board[newX][newY] !== currentPlayer) {
        newX += xIncr;
        newY += yIncr;
        otherPlayersPieceFound = true;
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
          break;
        }
      } else {
        break;
      }
    }
  }

  if (otherPlayersPieceFound && newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
    if (!board[newX][newY]) {
      moves.push({ x: newX, y: newY });
    }
  }
}

function highlightMoveLocations(moves) {
  for (var i = 0; i < moves.length; i++) {
    var x = moves[i].x;
    var y = moves[i].y;
    var square = document.getElementById('square-' + x + '-' + y);
    square.classList.add('highlight');
    square.onmouseenter = handleMouseOverSquare;
    square.onmouseleave = handleMouseLeaveSquare;
    square.onclick = handleClickSquare;
  }
}

function handleMouseOverSquare(event) {
  event.preventDefault();
  var tempPiece = document.createElement('div');
  tempPiece.classList.add('temp-piece');
  tempPiece.classList.add('piece-' + currentPlayer);
  event.target.appendChild(tempPiece);
}

function handleMouseLeaveSquare(event) {
  event.preventDefault();
  var tempPieces = event.target.querySelectorAll('.temp-piece');
  if (tempPieces.length > 0) {
    event.target.removeChild(tempPieces[0]);
  }
}

function handleClickSquare(event) {
  event.preventDefault();
  var square = event.target;
  if (event.target.classList.contains('temp-piece')) {
    square = event.target.parentElement;
  }
  clearHighlights();

  var x = square.id.charAt(7);
  var y = square.id.charAt(9);

  var piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add('piece-' + currentPlayer);
  square.appendChild(piece);
  board[x][y] = currentPlayer;

  flipPieces(x, y, -1, -1);
  flipPieces(x, y, 0, -1);
  flipPieces(x, y, 1, -1);
  flipPieces(x, y, -1, 0);
  flipPieces(x, y, 1, 0);
  flipPieces(x, y, -1, 1);
  flipPieces(x, y, 0, 1);
  flipPieces(x, y, 1, 1);

  currentPlayer = currentPlayer === 'b' ? 'w' : 'b';

  runGame();
}

function flipPieces(x, y, xIncr, yIncr) {
  var squaresToFlip = [];
  var newX = parseInt(x) + parseInt(xIncr);
  var newY = parseInt(y) + parseInt(yIncr);

  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
    while (board[newX][newY]) {
      if (board[newX][newY] !== currentPlayer) {
        var square = document.getElementById('square-' + newX + '-' + newY);
        squaresToFlip.push(square);
        newX += parseInt(xIncr);
        newY += parseInt(yIncr);
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
          break;
        }
      } else {
        break;
      }
    }
  }

  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
    if (board[newX][newY] === currentPlayer) {
      for (var i = 0; i < squaresToFlip.length; i++) {
        var currentSquare = squaresToFlip[i];
        currentSquare.innerHTML = '';
        var currentX = currentSquare.id.charAt(7);
        var currentY = currentSquare.id.charAt(9);
        var piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add('piece-' + currentPlayer);
        currentSquare.appendChild(piece);
        board[currentX][currentY] = currentPlayer;
      }
    }
  }
}

function clearHighlights() {
  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function (elem) {
    elem.classList.remove('highlight');
    elem.onmouseenter = null;
    elem.onmouseleave = null;
    elem.onclick = null;
  });
  var tempPieces = document.querySelectorAll('.temp-piece');
  tempPieces.forEach(function (elem) {
    elem.parentElement.removeChild(elem);
  });
}

function setupBoard() {
  var boardContainer = document.createElement('section');
  boardContainer.id = 'game-board';
  document.body.appendChild(boardContainer);

  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      var square = document.createElement('div');
      square.id = 'square-' + x + '-' + y;
      square.classList.add('square');
      boardContainer.appendChild(square);

      if (board[x][y]) {
        var piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add('piece-' + board[x][y]);
        square.appendChild(piece);
      }
    }
  }
}

function runGame() {
  var possibleMoves = getPossibleMoves();

  if (possibleMoves.length > 0) {
    highlightMoveLocations(possibleMoves);
  } else {
    decideWinner();
  }
}
  
function decideWinner() {
  var blackPieces = document.querySelectorAll('.piece-b');
  var whitePieces = document.querySelectorAll('.piece-w');

  var message = '';

  if (blackPieces.length === whitePieces.length) {
    message = 'Draw!';
  } else if (blackPieces.length > whitePieces.length) {
    message = 'Black pieces win!';
  } else if (whitePieces.length > blackPieces.length) {
    message = 'White pieces win!'+whitePieces.length;
  }

  var winnerAlert = document.createElement('div');
  winnerAlert.classList.add('alert-winner');
  winnerAlert.innerHTML += message + ' Refresh page for new game.';
  document.body.appendChild(winnerAlert);
}

function main() {
  setupBoard();
  runGame();
}

main();