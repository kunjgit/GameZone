//GLOBAL VARIABLES
var rootX = 60, rootY = 45, boardSize = 9, boxSize = 50;
var player = 0;

const EMPTY = -1;
const CHECKED = 1, UNCHECKED = 0;

var directs = [
	[0, 1], [0, -1], [1, 0], [-1, 0]
];

//Current board
var board = []; 
//Calculate liberties by checking each position
var checkBoard = [];
//Test valid move by checking the test board
var testBoard = [];
//Back up board
var backupBoard = [];  	
var historyBoards = [];

for(var i = 0; i < boardSize; i++) {
    board.push([]);
	checkBoard.push([]);
	testBoard.push([]);
	backupBoard.push([]);
	for(var j = 0; j < boardSize; j++) {
        board[i].push(EMPTY);
		checkBoard[i].push(UNCHECKED);
		testBoard[i].push(EMPTY);
		backupBoard[i].push(EMPTY);
	}
}

window.onload = function() {
    
    var canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas);
	var ctx = canvas.getContext('2d');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	drawBoard(ctx);
	
	createGrid();
	
	paintBoard();
	
	$('.box').on('click', function() {
		
		if($(this).hasClass('hide')) {			
			var box = $(this).attr('id').split('-');
			var x = parseInt(box[1]);
			var y = parseInt(box[2]);
			
			testBoard[x][y] = player;			
			clearBoard(testBoard);
			
			if(invalidTestBoard() || invalidMove(x, y)) {
				showInvalidMove(x, y);
				copyBoard(testBoard, board);
				resetCheckBoard();
			} else { //Valid move
				
				historyBoards.push( JSON.parse(JSON.stringify( backupBoard.slice(0) )) );
				
				copyBoard(backupBoard, board);
				
				copyBoard(board, testBoard);
				updateGameBy(board);
				
				$(this).addClass(player === 0 ? 'black' : 'white');
				$(this).removeClass('hide');
			
				player === 0 ? player++ : player--;	
			}		
			
			paintBoard();
		}
		
	});
	
	function paintBoard() {
		var test = $('#test');
		test.html("current board<br>");
		for(var i = 0; i < 9; i++) {
			for(var j = 0; j < 9; j++) {
				if(board[i][j] === EMPTY)
					test.append('*   ');
				else
					test.append(board[i][j] + '    ');
			}
			test.append('<br>');
		}
		test.append(historyBoards.length + '<br>');
		test.append('backup board<br>');
		for(var i = 0; i < 9; i++) {
			for(var j = 0; j < 9; j++) {
				if(backupBoard[i][j] === EMPTY)
					test.append('*   ');
				else
					test.append(backupBoard[i][j] + '    ');
			}
			test.append('<br>');
		}
		test.append('test board<br>');
		for(var i = 0; i < 9; i++) {
			for(var j = 0; j < 9; j++) {
				if(testBoard[i][j] === EMPTY)
					test.append('*   ');
				else
					test.append(testBoard[i][j] + '    ');
			}
			test.append('<br>');
		}
	}
	
	$('.undo-btn').on('click', function() {		
		if(historyBoards.length > 0) {
			
			copyBoard(board, backupBoard);
			copyBoard(testBoard, backupBoard);
			
			updateGameBy(board);
			
			copyBoard(backupBoard, historyBoards.pop());

			player === 0 ? player++ : player--;	
		}
		paintBoard();
	});
	
	$('.reset-btn').on('click', function() {
		reset();		
		paintBoard();
	});
	
}

//FUNCTIONS

function getLiberties(board, x, y) {
	if(board[x][y] === EMPTY) 
		return -1;
	if(checkBoard[x][y] === CHECKED)
		return 0;
	
	checkBoard[x][y] = CHECKED;
	
	var count = 0;
	
	for(var i = 0; i < directs.length; i++) {
		var pX = x + directs[i][0];
		var pY = y + directs[i][1];
		
		if(!outOfBounds(pX, pY)) { //valid position
			if(board[pX][pY] === EMPTY) { //1 liberty
				count++;
			} else if(board[pX][pY] === board[x][y]) { //next chain
				count += getLiberties(board, pX, pY);
				checkBoard[pX][pY] = CHECKED;
			}
		}
	
	}
	return count;
}

function getChain(x, y) {
	var chain = [];
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			if(checkBoard[i][j] === CHECKED) {
				chain.push([i, j]);
			}
		}
	}
	return chain;
}

function clearBoard(board) {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			if(board[i][j] !== EMPTY && board[i][j] !== player) {
				if(getLiberties(board, i, j) === 0) {
					//Remove dead pieces in board
					var chain = getChain(i, j);
					for(var k = 0; k < chain.length; k++) {
						var pX = chain[k][0];
						var pY = chain[k][1];

						board[pX][pY] = EMPTY;
					}
				}
				resetCheckBoard();
			}
		}
	}
}

//Update game by selected board
function updateGameBy(board) {
	deleteBox($('.box'));
	
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			if(board[i][j] !== EMPTY) {
				var box = $('#box-' + i + '-' + j);
				
				box.addClass(board[i][j] === 0 ? 'black' : 'white');
				box.removeClass('hide');
			}
		}
	}
}

//Copy two board
function copyBoard(board, copyBoard) {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			board[i][j] = copyBoard[i][j];
		}
	}
}

//Check if board changed or not
//Compare test board to backup board
function invalidTestBoard() {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			if(testBoard[i][j] !== backupBoard[i][j]) {
				return false;
			}
		}
	}
	return true;
}

//Check if this move is valid
function invalidMove(x, y) {
	if(testBoard[x][y] !== EMPTY && getLiberties(testBoard, x, y) === 0) {
		return true;
	}
	resetCheckBoard();
	return false;
}

//Check valid position
function outOfBounds(x, y) {
	return x < 0 || x >= boardSize || y < 0 || y >= boardSize;
}

function resetCheckBoard() {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			checkBoard[i][j] = UNCHECKED;
		}
	}
}

//Reset board to start new game
function resetBoard(board) {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			board[i][j] = EMPTY;
		}
	}
}

function deleteBox(box) {
	box.removeClass('black');
	box.removeClass('white');
	box.addClass('hide');	
}

function reset() {
	deleteBox($('.box'));
	
	player = 0;
	
	resetBoard(board);
	resetBoard(testBoard);
	resetBoard(backupBoard);
	
	historyBoards = [];
}

function showInvalidMove(x, y) {
	var box = $('#box-' + x + '-' + y);
	
	box.addClass('invalid');
	setTimeout(function() {
		box.removeClass('invalid');
	}, 50);
}

//Create grid board game
function createGrid() {
	$('.board').empty();
        
	for(var i = 0; i < boardSize; i++) {
		$('.board').append('<div class=\"row\" id=\"row-' + i + '\">');
		for(var j = 0; j < boardSize; j++) {
			$('#row-' + i).append('<div class=\"box hide\" id=\"box-' + i + '-' + j + '\">');
		}
	}
}

//Draw board functions
function drawBoard(ctx) {
	
	var x = rootX, y = rootY;
	
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	ctx.fillStyle = '#F2B06D';
	ctx.fillRect(rootX - 40, rootY - 40, 80 + boxSize * (boardSize - 1), 80 + boxSize * (boardSize - 1));
	
	for(var i = 0; i < boardSize; i++) {
		drawLine(ctx, x, y, 0, boxSize * (boardSize - 1));
		x += boxSize;
	}
	x = rootX, y = rootY;
	for(var i = 0; i < boardSize; i++) {
		drawLine(ctx, x, y, boxSize * (boardSize - 1), 0);
		y += boxSize;
	}
	
	drawLine(ctx, rootX - 40, rootY - 40, 0, 80 + boxSize * (boardSize - 1));
	drawLine(ctx, rootX + 40 + boxSize * (boardSize - 1), rootY - 40, 0, 80 + boxSize * (boardSize - 1));
	drawLine(ctx, rootX - 40, rootY - 40, 80 + boxSize * (boardSize - 1), 0);
	drawLine(ctx, rootX - 40, rootY + 40 + boxSize * (boardSize - 1), 80 + boxSize * (boardSize - 1), 0);
	
	ctx.fillStyle = '#000';
	drawPoint(ctx, 2, 2);
	drawPoint(ctx, 2, 6);
	drawPoint(ctx, 6, 2);
	drawPoint(ctx, 6, 6);
	drawPoint(ctx, 4, 4);
}

function drawLine(ctx, x, y, a, b) {
	ctx.moveTo(x, y);
	ctx.lineTo(x + a, y + b);
	ctx.stroke();
}

function drawPoint(ctx, x, y) {
	ctx.beginPath();
	ctx.arc(rootX + boxSize * x, rootY + boxSize * y, 5, 0, 2 * Math.PI);
	ctx.fill();
}