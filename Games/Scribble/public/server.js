'use strict';

var games = [];
var words = ['ball', 'harry potter', 'spaggathi', 'table', 'knife', 'grinch', 'pen', 'pot', 'jug', 'Spectacles', 'laptop', 'space suit', 'apple', 'bed bug', 'phone', 'mouse', 'bag'];

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; 
  }

function findGame() {
	for (var i=0; i < games.length; i++) {
		if (games[i].hasSpot()) {
			return games[i];
		}
	}
	var newGame = new Game()
	games.push(newGame);
	return newGame;
}

function Game() {
	this.users = [];
	this.drawingUser = -1;
	this.capacity = 2;
	this.word = '';
	this.correctlyGuessedPlayers = 0;
}

Game.prototype.hasSpot = function() {
	return this.users.length < this.capacity;
}

Game.prototype.join = function (user) {
	if (this.users.length == this.capacity) {
		return;
	}
	this.users.push(user);
	this.users[this.users.length - 1].id = this.users.length - 1;
	if (this.users.length == this.capacity) {
		this.start();
	}
}

Game.prototype.leave = function (user) {
	this.users.splice(users.indexOf(user), 1);
}

Game.prototype.start = function (playerId) {
	if (!playerId)
		this.drawingUser = 0;
	else
		this.drawingUser = playerId;

	this.word = words[getRandomInt(0, words.length - 1)];
	this.guessedCorrectPlayers = 0;
	for (var i=0; i < this.users.length; i++) {
		console.log('users[i]', this.users[i].socket);
		var startPayload = {players: this.getUsers(), drawingPlayerId: this.drawingUser};
		if (i === this.drawingUser) {
			startPayload.word = this.word;
		}
		this.users[i].start(startPayload);
	}
}

Game.prototype.announce = function (event, payload) {
	for (var i = 0; i < this.users.length; i++) {
		this.users[i].socket.emit(event, payload);	
	}
}

Game.prototype.getUsers = function () {
	var users = [];
	for (var i = 0; i < this.users.length; i++) {
		users.push({
			name: this.users[i].name,
			id: this.users[i].id,
			score: this.users[i].score
		});
	}
	return users
}

function User(socket) {
	this.socket = socket;
	this.id = null;
	this.name = '';
	this.state = 'Waiting';
	this.game = null;
	this.score = 0;
}

User.prototype.start = function (payload) {
	this.socket.emit('gameStart', payload);
}

User.prototype.emit = function (eventName, payload) {
	this.socket.emit(eventName, payload);
}

User.prototype.guessWord = function (word) {
	var isCorrectGuess = this.game.word === word;
	if (isCorrectGuess) {
		this.score = this.game.capacity - this.game.guessedCorrectPlayers;
	}
	return isCorrectGuess;
};

User.prototype.broadcastToOthers = function (event, payload) {
	for (var i=0; i < this.game.users.length; i++) {
		if (i !== this.id) {
			this.game.users[i].emit(event, payload);
		}
	}
}

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
	var connectedUser = new User(socket);

	socket.on('disconnect', function () {
		console.log('Disconnected: ' + socket.id);
	});

	socket.on('join', function (payload) {
		console.log(payload);
		connectedUser.name = payload.username;
		var game = findGame();
		console.log(game);
		console.log('before join')
		game.join(connectedUser);
		console.log('after join')
		connectedUser.game = game;
		console.log('end of  join')
		console.log(game);
	});

	socket.on('draw-mousedown', function (payload) {
		if (connectedUser.game)
			connectedUser.broadcastToOthers('draw-mousedown', payload);
	});
	socket.on('draw-mouseup', function (payload) {
		if (connectedUser.game)
			connectedUser.broadcastToOthers('draw-mouseup', payload);
	});
	socket.on('draw-mousemove', function (payload) {
		if (connectedUser.game)
			connectedUser.broadcastToOthers('draw-mousemove', payload);
	});	
	socket.on('guess', function (payload) {
		if (connectedUser.game) {
			var guessPayload = {
				by: connectedUser.name,
				byId: connectedUser.id
			};
			var isCorrectGuess = connectedUser.guessWord(payload.word);
			if (!isCorrectGuess) {
				guessPayload.result = 'guess-wrong';
				guessPayload.word = payload.word;
			} else {
				guessPayload.result = 'guess-correct';
				connectedUser.game.correctlyGuessedPlayers++;
			}
			guessPayload.score = connectedUser.score;
			connectedUser.game.announce(guessPayload.result, guessPayload);
			if (connectedUser.game.correctlyGuessedPlayers === connectedUser.game.users.length - 1) {
				connectedUser.game.announce('game-end',
					{
						word: connectedUser.game.word,
						reason: 'All players found the lost object',
						players: connectedUser.game.getUsers(),
						drawingPlayerId: connectedUser.game.drawingUser
					}
				);
			}
		}
	});
	console.log('Connected: ' + socket.id);
}
