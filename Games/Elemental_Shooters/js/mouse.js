Game.mouse = {
  x: 0,
  y: 0,
  angle: 0,
  down: false
};

Game.c1.addEventListener('mousemove', function(e) {
  var rect = Game.c1.getBoundingClientRect();

  Game.mouse.x = e.clientX - rect.left;
  Game.mouse.y = e.clientY - rect.top;

});

Game.c1.addEventListener('mousedown', function(e) {

  Game.mouse.down = true;

});

Game.c1.addEventListener('mouseup', function(e) {

  Game.mouse.down = false;

});