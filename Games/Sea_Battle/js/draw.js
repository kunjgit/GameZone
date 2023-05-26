//   var playClass = function(){
// inherit attributes from ship class
//   shipClass.call( this );
// };
var player1AutoButton = new button("auto", 50, 400);
var player1ConfirmButton = new button("confirm", 250, 400);
var player2ConfirmButton = new button("confirm", 750, 400);
var player2AutoButton = new button("auto", 550, 400);

var posX = 400, posY = 70;
var singlePlayerButton = new button("singleplayer", posX + 100, posY + 40);
var multiplayerButton = new button("Multiplayer", posX + 100, posY + 90);
var onlineButton = new button("Online", posX + 100, posY + 140);
var instructionsButton = new button("Instructions", posX + 100, posY + 190);
var creditsButton = new button("Credits", posX + 100, posY + 240);
var statisticsButton = new button("statistics", posX + 100, posY + 290);

var anim = new animation();

/**
* draw
* description: draw function is executed 60 frames per second, it invokes different gameStates based on values 
*/

var draw = function () {

    anim.animationPlay();

    if(densityLens){
        background(0, 300, 0, 100);
    }
    
    if (menu === true){
        menuState();
    }
    else if(makeNewMap === true){
        newMapState();
    }
    else if (singlePlayer === true){
        singlePlayerState();
    }
    else if (multiPlayerOnline === true){
        multiPlayerOnlineState();
    }
    else if (credits === true){
        creditsState();
    }
    else if (instructions === true){
        instructionsState();
    }
    else if (multiPlayerOffline === true){
        multiPlayerOfflineState();
    }
    else if (statistics === true){
        statisticsState();
    }
    else if (winState === true){
        winStateCall();
    }



};
