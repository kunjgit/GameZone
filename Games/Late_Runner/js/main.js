// shim layer with setTimeout fallback
;window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
if(!console || !console.log) {
    console = {log:function(){}};
}

LateRunner.startGame = function(){
    console.log("LateRunner::startGame");
    var gameModel = new GameModel();
    LateRunner.events = new Events();
    LateRunner.game = new GameController(gameModel);
};