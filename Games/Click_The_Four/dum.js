//dummy js server file to make the game woks on js-game-server

var socketio = require('sandbox-io');


socketio.on('connection', function(socket){
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});
