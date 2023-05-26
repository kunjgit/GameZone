  
  
	function setup() {
    
    createCanvas(1300, 550);
     frameRate(50);
  
	}

    var mouseIsPressed = false;

    var mouseReleased = function(){
        mouseIsPressed = false;
    };
    var mousePressed = function(){
        mouseIsPressed = true;
    };
    var touchStarted = function(){
      mouseIsPressed = true;
    };

    /**
    global variables
    */
    var menu = true;
    var credits = false;
    var instructions = false;
    var multiPlayerOffline = false;
    var multiPlayerOnline = false;
    var statistics = false;
    var winState = false;
    var makeNewMap = false;

    var playerOneTurn = true;
    var singlePlayer = false;
    var singlePlayerWin = false;
    var multiPlayerWin = false;
    var densityLens = false;
    var statTableUpdated = false;
    var playerSwitching = true;
    var playerSwitchingIterator = 0;

    var randomMap = new Array(10);
    for(var i = 0; i < randomMap.length; i++){

        randomMap[i] = new Array(10);
    }  

    var initializeRandomMap = function(){

      for(var i = 0; i < 10; i++){
          for(var j=0; j < 10; j++){

              randomMap[ i ][ j ] = 0;
          }
      }

   }

   initializeRandomMap();


   for(var i = 0; i < 10; i++){
    for(var j=0; j < 10; j++){

        randomMap[ i ][ j ] = 0;
    }
}

    const ISLAND = -2;

    // creating statistics table
    var statTable = new Array(3);
    for (var i = 0; i < statTable.length; i++) {

      statTable[i] = new Array(6);
    }

    // initializing statistics table

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 6; j++) {
        statTable[i][j] = 0;
      }
    }
    
