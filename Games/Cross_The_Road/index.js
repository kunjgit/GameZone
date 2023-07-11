var manStartLoc = 15;
var level = 1;

var cars = [];
var carNo = 0;
var carStartloc = 29;
var carEndLoc = carStartloc + 2;
var temp = 0;

var song = new Audio("audio/songs.mp3");
var carCrah = new Audio("audio/car.wav");

var gameTime = 500;

function manMove(){
  if (manStartLoc === 1){
    manStartLoc = 15;
    level += 1;

    if(gameTime < 100){
      if(gameTime < 50){
          gameTime = gameTime;
      }
      else{
        gameTime -= 10;
      }
    }
    else{
      gameTime -= 25;
    };

    $(".levelH1").text("LEVEL: " + level);
  }
  else{
    manStartLoc = manStartLoc - 1;
  };
  $(".man_div").css("grid-row-start", manStartLoc);
}

var space = 32;
var fd = 0;
$(document).keydown(function(e){
    if (e.which == fd) {
        manMove()
      return false;
    };
    if (e.which == 13) {
      location.reload();
      return false;
    };
    if (e.which == space) {
      setTimeout(myFunction, gameTime);
      space = 0;
      fd = 38;
      $(".levelH1").text("LEVEL: 1");
      return false;
    };
});

var myFunction = function() {
  song.play();
  var n = Math.floor(Math.random()*13+2);
  var m = Math.floor(Math.random()*9+1);
  while(temp === n){
    n = Math.floor(Math.random()*13+2);
  };
  $(".game").append("<div class='car car" + carNo +"' style='grid-column-start:"+carStartloc+"; grid-column-end: "+carEndLoc+"; grid-row-start: "+n+";' allign = 'center'><img class='car' src='images/car"+m+".jpg'></div>")
  cars.push("car"+carNo)
  carNo += 1;
  carStartloc -= 1;
  carEndLoc = carStartloc + 2;
  for (var i=0; i < cars.length; i++){
      $("."+ cars[i]).css("grid-column-start", carStartloc + i);
      $("."+ cars[i]).css("grid-column-end", carEndLoc + i);
      if ( $("."+ cars[i]).css('grid-column-start') == "1"){
          $("."+ cars[i]).remove();
      };
  };
  temp = n;
    setTimeout(myFunction, gameTime);
}

var interval = setInterval(function(){
  var babu = 0;
  for (var i=0; i < cars.length; i++){
    if ( $("."+ cars[i]).css('grid-column-start') === $(".man_div").css('grid-column-start') &&  $("."+ cars[i]).css('grid-row-start') === $(".man_div").css('grid-row-start')){
      clearInterval(interval);
      babu += 1;
      if (babu === 1){
        $(".game").remove();
        $(".body").append("<div class='gameOver'><p>GAME OVER</p></div>");
        $(".levelH1").text("Press Enter To Restart");
        song.pause();
        song = 0;
        carCrah.play();
      };
    };
  };
},50);

