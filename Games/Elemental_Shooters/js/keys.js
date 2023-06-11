Game.key = {
  up: false,
  right: false,
  down: false,
  left: false,
  keydown: false,
  keydownPressed: false,
  esc: false,
  enter: false,
  enterPressed: false
};

document.addEventListener('keydown', function(e) {

  //38 up
  if(e.keyCode === 38 || e.keyCode === 87){
    Game.key.up = true;
  }

  //39 right
  if(e.keyCode === 39 || e.keyCode === 68){
    Game.key.right = true;
  }

  //40 bottom
  if(e.keyCode === 40 || e.keyCode === 83){
    Game.key.down = true;
  }

  //37 left
  if(e.keyCode === 37 || e.keyCode === 65){
    Game.key.left = true;
  }

  if(e.keyCode === 27){
    Game.key.esc = true;
  }

  if(e.keyCode === 13){
    Game.key.enter = true;
  }

  Game.key.keydown = true;
  //1
  if(e.keyCode === 49){

    changeScreenSize(32 * 12, 32 * 12);

  }
  //2
  if(e.keyCode === 50){

    changeScreenSize(32 * 16, 32 * 12);

  }
  //3
  if(e.keyCode === 51){

    changeScreenSize(32 * 20, 32 * 12);

  }
  //4
  if(e.keyCode === 52){

    changeScreenSize(32 * 20, 32 * 16);

  }
  //5
  if(e.keyCode === 53){

    changeScreenSize(32 * 20, 32 * 20);

  }

});

document.addEventListener('keyup', function(e) {

   //38 up
  if(e.keyCode === 38 || e.keyCode === 87){
    Game.key.up = false;
  }

  //39 right
  if(e.keyCode === 39 || e.keyCode === 68){
    Game.key.right = false;
  }

  //40 bottom
  if(e.keyCode === 40 || e.keyCode === 83){
    Game.key.down = false;
  }

  //37 left
  if(e.keyCode === 37 || e.keyCode === 65){
    Game.key.left = false;
  }

  if(e.keyCode === 27){
    Game.key.esc = false;
  }

  if(e.keyCode === 13){
    Game.key.enter = false;
    Game.key.enterPressed = false;
  }

  Game.key.keydown = false;
  Game.key.keydownPressed = false;

});