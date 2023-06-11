var io;
var gameSocket;

exports.initGame = function(sio, socket) {
	io = sio;
	gameSocket = socket;
	gameSocket.emit('connected', {message: "You are connected!"});

	gameSocket.on('hostCreateLobby', hostCreateLobby);
	gameSocket.on('hostLobbyFull', hostPrepareGame);
	gameSocket.on('hostCountdownFinished', hostStartGame);
	gameSocket.on('playerJoinGame', playerJoinGame);
	gameSocket.on('playerRestart', playerRestart);
}

function hostCreateLobby() {
	var thisLobbyId = (Math.random() * 100000) | 0;
	this.emit('newLobbyCreated', {lobbyID: thisLobbyID, mySocketID: this.id});
	this.join(thisLobbyID.toString());
};

function hostPrepareGame(gameID) {
	var sock = this;
	var data = {
		mySocketID: sock.id,
		gameID: gameID
	};
	io.sockets.in(data.gameID).emit('beginNewGame', data);
};

function hostStartGame(gameID) {
	console.log('Game Started.');
	startGame(gameID);
};

function playerJoinGame(data) {
	var sock = this;
	var room = gameSocket.manager.rooms["/" + data.gameID];

	if( room != undefined ) {
		data.mySocketID = sock.id;
		sock.join(data.gameID);
		io.sockets.in(data.gameID).emit('playerJoinedGame', data);
	} else {
		this.emit('error',{message:"This lobby does not exist."});
	}
}

function playerRestart(data) {
	data.playerID = this.id;
	io.sockets.in(data.gameID).emit('playerJoinedGame');
}

function startGame(gameID) {
	io.sockets.in(data.gameID).emit('gameStarted', data);
}