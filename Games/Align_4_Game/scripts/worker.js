// constants
const TOTAL_COLUMNS = 7;
const TOTAL_ROWS = 7;
const HUMAN_WIN_SCORE = -4;
const COMPUTER_WIN_SCORE = 4;
const NO_WIN_SCORE = 0;

// global variables
var currentGameState;

// game state object
var GameState = function(cloneGameState) {
  this.board = [];
  this.score = NO_WIN_SCORE;
  this.winningChips = undefined;
  
  // initialize an empty board
  for(var col = 0; col < TOTAL_COLUMNS; col++) {
    this.board[col] = [];
  }
  
  // clone from existing game state (if one was passed in)
  if(cloneGameState) {
    for (var col = 0; col < TOTAL_COLUMNS; col++) {
      for (var row = 0; row < cloneGameState.board[col].length; row++) {
        this.board[col][row] = cloneGameState.board[col][row];
      }
    }
    this.score = cloneGameState.score;
  }
}
GameState.prototype.makeMove = function(player, col) {
  var coords = undefined;
  var row = this.board[col].length;
  if (row < TOTAL_ROWS) {
    this.board[col][row] = player;
    this.setScore(player, col, row);
    coords = { col: col, row: row };
  }
  return coords;
}
GameState.prototype.isBoardFull = function() {
  for (var col = 0; col < TOTAL_COLUMNS; col++) {
    if (this.board[col].length < TOTAL_ROWS) {
      // found an unfilled column
      return false;
    }
  }
  return true;
}
GameState.prototype.setScore = function(player, col, row) {
  var isWin =
      this.checkRuns(player, col, row, 0, 1) || // vertical
      this.checkRuns(player, col, row, 1, 0) || // horizontal
      this.checkRuns(player, col, row, 1, 1) || // diagonal "/"
      this.checkRuns(player, col, row, 1, -1)   // diagonal "\"
  
  if(isWin) {
    this.score = (player === 1) ? HUMAN_WIN_SCORE : COMPUTER_WIN_SCORE;
  } else {
    this.score = NO_WIN_SCORE;
  }
}
GameState.prototype.checkRuns = function(player, col, row, colStep, rowStep) {
  var runCount = 0;
  
  // check from 3 chips before to 3 chips after the specified chip
  // this covers all possible runs of 4 chips that include the specified chip
  for (var step = -3; step <= 3; step++) {
    if (this.getPlayerForChipAt(col + step * colStep, row + step * rowStep) === player) {
      runCount++;
      if (runCount === 4) {
        // winning run, step backwards to find the chips that make up this run
        this.winningChips = [];
        for(var backstep = step; backstep >= step - 3; backstep--) {
          this.winningChips.push({
            col: col + backstep * colStep,
            row: row + backstep * rowStep
          });
        }
        return true;
      }
    } else {
      runCount = 0;
      if(step === 0) {
        // no room left for a win
        break;
      }
    }
  }
  
  // no winning run found
  return false;
}
GameState.prototype.getPlayerForChipAt = function(col, row) {
  var player = undefined;
  if (this.board[col] !== undefined && this.board[col][row] !== undefined) {
    player = this.board[col][row];
  }
  return player;
}
GameState.prototype.isWin = function() {
  return (this.score === HUMAN_WIN_SCORE || this.score === COMPUTER_WIN_SCORE);
}

// listen for messages from the main thread
self.addEventListener('message', function(e) {
  switch(e.data.messageType) {
    case 'reset':
      resetGame();
      break;
    case 'human-move':
      makeHumanMove(e.data.col);
      break;
    case 'computer-move':
      makeComputerMove(e.data.maxDepth);
      break;
  }
}, false);

function resetGame() {
  currentGameState = new GameState();
  
  self.postMessage({
    messageType: 'reset-done'
  });
}

function makeHumanMove(col) {
  // coords is undefined if the move is invalid (column is full)
  var coords = currentGameState.makeMove(1, col);
  var isWin = currentGameState.isWin();
  var winningChips = currentGameState.winningChips;
  var isBoardFull = currentGameState.isBoardFull();
  self.postMessage({
    messageType: 'human-move-done',
    coords: coords,
    isWin: isWin,
    winningChips: winningChips,
    isBoardFull: isBoardFull
  });
}

function makeComputerMove(maxDepth) {
  var col;
  var isWinImminent = false;
  var isLossImminent = false;
  for (var depth = 0; depth <= maxDepth; depth++) {
    var origin = new GameState(currentGameState);
    var isTopLevel = (depth === maxDepth);
    
    // fun recursive AI stuff kicks off here
    var tentativeCol = think(origin, 2, depth, isTopLevel);
    if (origin.score === HUMAN_WIN_SCORE) {
      // AI realizes it can lose, thinks all moves suck now, keep move picked at previous depth
      // this solves the "apathy" problem
      isLossImminent = true;
      break;
    } else if (origin.score === COMPUTER_WIN_SCORE) {
      // AI knows how to win, no need to think deeper, use this move
      // this solves the "cocky" problem
      col = tentativeCol;
      isWinImminent = true;
      break;
    } else {
      // go with this move, for now at least
      col = tentativeCol;
    }
  }
  
  var coords = currentGameState.makeMove(2, col);
  var isWin = currentGameState.isWin();
  var winningChips = currentGameState.winningChips;
  var isBoardFull = currentGameState.isBoardFull();
  self.postMessage({
    messageType: 'computer-move-done',
    coords: coords,
    isWin: isWin,
    winningChips: winningChips,
    isBoardFull: isBoardFull,
    isWinImminent: isWinImminent,
    isLossImminent: isLossImminent
  });
}

function think(node, player, recursionsRemaining, isTopLevel) {
  var scoreSet = false;
  var childNodes = [];

  // consider each column as a potential move
  for (var col = 0; col < TOTAL_COLUMNS; col++) {
    if(isTopLevel) {
      self.postMessage({
        messageType: 'progress',
        col: col
      });
    }
    
    // make sure column isn't already full
    var row = node.board[col].length;
    if (row < TOTAL_ROWS) {
      // create new child node to represent this potential move
      var childNode = new GameState(node);
      childNode.makeMove(player, col);
      childNodes[col] = childNode;
      
      if(!childNode.isWin() && recursionsRemaining > 0) {
        // no game stopping win and there are still recursions to make, think deeper
        var nextPlayer = (player === 1) ? 2 : 1;
        think(childNode, nextPlayer, recursionsRemaining - 1);
      }

      if (!scoreSet) {
        // no best score yet, just go with this one for now
        node.score = childNode.score;
        scoreSet = true;
      } else if (player === 1 && childNode.score < node.score) {
        // assume human will always pick the lowest scoring move (least favorable to computer)
        node.score = childNode.score;
      } else if (player === 2 && childNode.score > node.score) {
        // computer should always pick the highest scoring move (most favorable to computer)
        node.score = childNode.score;
      }
    }
  }

  // collect all moves tied for best move and randomly pick one
  var candidates = [];
  for (var col = 0; col < TOTAL_COLUMNS; col++) {
    if (childNodes[col] != undefined && childNodes[col].score === node.score) {
      candidates.push(col);
    }
  }
  var moveCol = candidates[Math.floor(Math.random() * candidates.length)];
  return moveCol;
}