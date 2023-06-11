var express = require('express');
var path = require('path');
var app = express();
var ei = require('./eigame');

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname,'public')));
});

var server = require('http').createServer(app).listen(3000);
var io = require('socket.io').listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket) {
	ei.initGame(io,socket);
});