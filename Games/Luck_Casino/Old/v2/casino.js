//Fps variables
var avgFramerate = 0;
var frameCount = 0;
var elapsedCounter = 0;
var lastFrame = Date.now();
var thisFrame;
var elapsed;

//Assets
var personImage = new Image();
personImage.src = "Person.png";
var personHighRollerImage = new Image();
personHighRollerImage.src = "PersonHighRoller.png";

var doorImage = new Image();
doorImage.src = "door.png";

var floorImage = new Image();
floorImage.src = "floor.png";
var floorPattern = 0;
floorImage.onload = function() {
  var backgroundCanvas = document.getElementById("backgroundCanvas");
  var backgroundContext = backgroundCanvas.getContext("2d");
  floorPattern = backgroundContext.createPattern(floorImage,"repeat");
  };
  
var slotsImage = new Image();
slotsImage.src = "SlotMachine.png";
var rouletteImage = new Image();
rouletteImage.src = "roulettewheel.png";
var blackjackImage = new Image();
blackjackImage.src = "blackjack.png";
var crapsImage = new Image();
crapsImage.src = "craps.png";

var doodadImage = new Image();
doodadImage.src = "doodads.png";


//Constants
  var StartingAttendance = 10;
  var MaxAttendance = 500;
  var MaxGames = 100;
  var doorX = 320;
  var doorY = 448;
  
//Events
var goodEvents = new Array(2);
goodEvents[0] = "You have won an award!  Here's your prize!";
goodEvents[1] = "You are the most fun casino around!  Here's a bonus!";

var badEvents = new Array(3);
badEvents[0] = "Someone broke in and stole money!";
badEvents[1] = "A slot machine malfunctioned and emptied its contents.";
badEvents[2] = "A fee is being charged by the state.";

//Game class
function Game() {
  this.stoppedRunning = false;
  this.mX = 0;
  this.mY = 0;
  this.cursorMode = "move";
  this.movingObject = 0;
  this.pause = false;
  this.selectedGame = 0;
  
 
  //Canvas
  this.backgroundCanvas = document.getElementById("backgroundCanvas");
  this.backgroundContext = this.backgroundCanvas.getContext("2d");
  this.midgroundCanvas = document.getElementById("midgroundCanvas");
  this.midgroundContext = this.midgroundCanvas.getContext("2d");
  this.forgroundCanvas = document.getElementById("forgroundCanvas");
  this.forgroundContext = this.forgroundCanvas.getContext("2d");
  
  //Info Pane
  this.personInfo = document.getElementById("personInfo");
  this.casinoGameInfo = document.getElementById("gameInfo");
  this.casinoInfo = document.getElementById("casinoInfo");
  
  //Constants
  var gameCosts = new Array();
  gameCosts['slots'] = 100;
  gameCosts['blackjack'] = 250;
  gameCosts['craps'] = 500;
  gameCosts['roulette'] = 150;
  
  var ticks = 0;
  
  //Game specific variables

  this.attendance = 0;
  this.amountOfDoodads = 0;
  this.people = new Array(MaxAttendance);
  this.cash = 1000;
  this.popularity = 50;
  this.casinoGames = new Array(100);
  
  this.doodads = new Array(500);
  
  //Standard functions
  this.init = function(){
    for (var i = 0; i < MaxAttendance; i++) {
      if (this.attendance < StartingAttendance){
        this.people[i] = new Person();
        this.people[i].init(doorX, doorY, this.forgroundContext);
        this.attendance++;
      }
      else {
        this.people[i] = 0;
      }
    }
    
    for (var i = 0; i < MaxGames; i++) {
      this.casinoGames[i] = 0;
      
    }
    
    for (var i = 0; i < 500; i++) {
      this.doodads[i] = 0;
      
    }
    
  }
  
  this.update = function(){
    ticks++;
    
    if (this.popularity > 100) {
      this.popularity = 100;
    }
    else if (this.popularity < 0) {
      this.popularity = 0;
    }
    
    if (this.pause == false) {
      for (var i = 0; i < MaxAttendance; i++) {
        if (this.people[i] != 0) {
          this.people[i].update();
        }
        
        if (this.people[i].gone == true){
          delete this.people[i];
          this.people[i] = 0;
          this.attendance--;
        }
      }
      
      for (var i = 0; i < MaxGames; i++) {
          if (this.casinoGames[i] != 0) {
            this.casinoGames[i].update();
          }
      }
      
      if (ticks%180 == 0) {
      var roll = Math.random() * 100;
      
      if (this.popularity > roll) {
        for (var i = 0; i < MaxAttendance; i++) {
          if (this.people[i] == 0) {
            this.people[i] = new Person();
            this.people[i].init(doorX,doorY, this.forgroundContext);
            this.attendance++;
            break;
          }
        }
      }
    }
    
    if (Math.random() < .0001)
    {
      var extraCash = Math.ceil(Math.random() * 200);
      if (Math.random() > .5) {
        alert(goodEvents[Math.floor(Math.random() * 2)]);
        this.cash += extraCash;
        alert("You gained $"+extraCash+"!");
      }
      else
      {
        alert(badEvents[Math.floor(Math.random() * 3)]);
        this.cash -= extraCash;
        alert("You lost $"+extraCash+"!");
      }
    } 
    }
    

    
    document.getElementById("casinoCash").innerHTML = "$"+this.cash;
    document.getElementById("casinoAttendance").innerHTML = this.attendance;
    document.getElementById("casinoPopularity").innerHTML = this.popularity+"%";
  }
  
  this.draw = function(){
    //Forground items
    this.forgroundContext.clearRect( 0 , 0 , 640 , 480);

    for (var i = 0; i < MaxAttendance; i++) {
      if (this.people[i] != 0) {
        this.people[i].draw();
      }
    }
    
    this.forgroundContext.drawImage(doorImage,doorX,doorY);
        
    //Midground items
    if (this.cursorMode == "move" ||this.cursorMode == "sell")
    {
      this.midgroundContext.clearRect( 0 , 0 , 640 , 480);
    }
    
    for (var i = 0; i < MaxGames; i++) {
      if (this.casinoGames[i] != 0) {
        this.casinoGames[i].draw();
      }
    }
    
    
    //Background items
    this.backgroundContext.fillRect(0,0,640,480);
    this.backgroundContext.fillStyle= floorPattern;
    
    for (var i = 0; i < 500; i++) {
      if (this.doodads[i] != 0) {
        this.doodads[i].draw();
      }
    }
    

    if (this.cash <= 0) {
      this.forgroundContext.font = "30px Arial";
      this.forgroundContext.fillStyle = "#0026FF";
      this.forgroundContext.fillText("You have gone bankrupt!  Refresh to play again!", 0,240);
      this.pause = true;
    }
  }
  
  this.run = function(){
    this.update();
    this.draw(); 
  }
  
  //Event listeners
  this.mouseClicked = function(e)
  {
    if (this.cursorMode == "select")
    {
      var noneSelected = true;
      for (var i = 0; i < MaxGames; i++) {
        if (this.casinoGames[i] != 0) {
          if (this.mouseWithinBounds(this.casinoGames[i].x,this.casinoGames[i].y,this.casinoGames[i].width,this.casinoGames[i].height) && noneSelected == true) {
            this.selectedGame = this.casinoGames[i];
            this.casinoGames[i].selected = true;
            noneSelected = false;
            
            document.getElementById("gameWinRate").value = this.casinoGames[i].winRate;
            document.getElementById("gameCashOut").value = this.casinoGames[i].cashOut;
            document.getElementById("gameCostToPlay").value = this.casinoGames[i].costToPlay;
            document.getElementById("gameUpKeep").innerHTML = "$"+this.casinoGames[i].upKeep;
            document.getElementById("gameMaxPlayers").innerHTML = this.casinoGames[i].maxPlayers;

            this.casinoInfo.style.display = 'none';
            this.casinoGameInfo.style.display = 'block';
            this.personInfo.style.display = 'none';
          }
          else
          {
            this.midgroundContext.clearRect( 0 , 0 , 640 , 480);
            this.casinoGames[i].selected = false;
          }
        }
      }

        for (var i = 0; i < MaxAttendance; i++) {
          if (this.people[i] != 0) {
            if (this.mouseWithinBounds(this.people[i].x,this.people[i].y,16,16) && noneSelected == true) {
              this.people[i].selected = true;
              noneSelected = false;
              
              document.getElementById("personMood").innerHTML = this.people[i].mood+"%";
              document.getElementById("personCash").innerHTML = "$"+this.people[i].cash;
              document.getElementById("personThought").innerHTML = this.people[i].thought;
              document.getElementById("personTemp").innerHTML = this.people[i].temperament;
              
              this.casinoInfo.style.display = 'none';
              this.casinoGameInfo.style.display = 'none';
              this.personInfo.style.display = 'block';
            }
            else
            {
              this.people[i].selected = false;
            }
          }
        
      }

      
      if (noneSelected == true) {
        this.casinoInfo.style.display = 'block';
        this.personInfo.style.display = 'none';
        this.casinoGameInfo.style.display = 'none';
      }
    }
    else if (this.cursorMode == "move")
    {
      if (this.movingObject == 0) {
        
        for (var i = 0; i < 500; i++) {  
          if (this.doodads[i] != 0) {
            if (this.mouseWithinBounds(this.doodads[i].x,this.doodads[i].y,16,16)) {
              this.doodads[i].selected = true;
              this.movingObject = this.doodads[i];
            }
            else
            {
              this.doodads[i].selected = false;
            }
          }
        }
        
        for (var i = 0; i < MaxGames; i++) {
          if (this.casinoGames[i] != 0) {
            if (this.mouseWithinBounds(this.casinoGames[i].x,this.casinoGames[i].y,this.casinoGames[i].width,this.casinoGames[i].height)) {
              if (this.movingObject != 0) {
                this.movingObject.selected = false;
              }
              this.casinoGames[i].selected = true;
              this.movingObject = this.casinoGames[i];
              break;
            }
            else
            {
              this.casinoGames[i].selected = false;
            }
          }
        }
      }
      else
      {
        this.movingObject.selected = false;
        this.movingObject = 0;
      }
    }
    else if (this.cursorMode == "sell")
    {
      for (var i = 0; i < 500; i++) {  
        if (this.doodads[i] != 0) {
          if (this.mouseWithinBounds(this.doodads[i].x,this.doodads[i].y,16,16)) {
            if (confirm("Do you want to sell this decoration?"))
            {
              this.cash += 5;
              delete this.doodads[i];
              this.doodads[i] = 0;
              break;
            }
          }
        }
      }
      
      for (var i = 0; i < MaxGames; i++) {
        if (this.casinoGames[i] != 0) {
          if (this.mouseWithinBounds(this.casinoGames[i].x,this.casinoGames[i].y,this.casinoGames[i].width,this.casinoGames[i].height)) {
            if (confirm("Do you want to sell this game?"))
            {
              this.cash += gameCosts[this.casinoGames[i].type];
              this.casinoGames[i].sold = true;
              delete this.casinoGames[i];
              this.casinoGames[i] = 0;
              break;
            }
          }
        }
        
      }
      
    }
  }
  
  this.mouseMoved = function(e)
  {
    this.mX = e.pageX - this.forgroundCanvas.offsetLeft;
    this.mY = e.pageY - this.forgroundCanvas.offsetTop;
    if (this.cursorMode == "move") {
      if (this.movingObject != 0) {
        this.movingObject.x = Math.round(this.mX/16)*16;
        this.movingObject.y = Math.round(this.mY/16)*16; 
      }
    }
  }
  
  this.keyPress = function(e)
  {
    switch (String.fromCharCode(e.keyCode))
    {
      case "1":
          this.addGame("slots");
        break;
      case "2":
          this.addGame("roulette");
        break;
      case "3":
          this.addGame("blackjack");
        break;
      case "4":
          this.addGame("craps");
        break;
      case "5":
          this.addDoodad(1);
        break;
      case "6":
        this.addDoodad(0);
        break;
      case "7":
        this.addDoodad(2);
        break;
      case "8":
        this.addDoodad(3);
        break;
      case "9":
        this.addDoodad(4);
        break;
    }
  }
      
  this.mouseWithinBounds = function(x,y,width,height)
  {
    return x < this.mX && x+width > this.mX  && y < this.mY && y + height > this.mY;
  }
  
  this.pauseGame = function()
  {
    if (this.pause == true) {
      this.pause = false;
    }
    else
    {
      this.pause = true;
    }
  }
  
  this.saveCasinoGame = function()
  {
    this.selectedGame.winRate = parseFloat(document.getElementById("gameWinRate").value);
    this.selectedGame.cashOut = parseFloat(document.getElementById("gameCashOut").value);
    this.selectedGame.costToPlay =  parseFloat(document.getElementById("gameCostToPlay").value);
  }
  
  this.addGame = function(newGame)
  {
    if (game.cash > gameCosts[newGame]) {
      var noneCreated = true;
      for (var i = 0; i < MaxGames; i++) {
        if (this.casinoGames[i] == 0) {
          this.casinoGames[i] = new CasinoGame();
          this.casinoGames[i].setType(newGame);
          this.changeCursorMode("move");
          this.movingObject = this.casinoGames[i];
          this.casinoGames[i].init(0,0,this.midgroundContext);
          game.cash -= gameCosts[newGame];
          noneCreated = false;
          break;
        }
      }
      if (noneCreated == true) {
        alert("You have maxed out the number of games you can own.");
      }
    }
    else
    {
      alert("If you buy anymore games you will go bankrupt.");
    }
  }
  
  this.addDoodad = function(doodad)
  {
    if (game.cash > 10) {
      var noneCreated = true;
      for (var i = 0; i < 500; i++) {
        if (this.doodads[i] == 0) {
          this.doodads[i] = new Doodad();
          this.doodads[i].frame = doodad;
          this.cursorMode = "move";
          this.movingObject = this.doodads[i];
          this.doodads[i].init(0,0,this.midgroundContext);
          game.cash -= 10;
          noneCreated = false;
          this.amountOfDoodads++;
          this.popularity += .5;
          break;
        }
      }
      if (noneCreated == true) {
        alert("You have maxed out the number of decorations you can own.");
      }
    }
    else
    {
      alert("If you buy anymore decorations you will go bankrupt.");
   }
  }
  
  this.changeCursorMode = function(mode)
  {
    this.cursorMode = mode;
    this.movingObject.x = 0;
    this.movingObject.y = 0;
    this.movingObject = 0;
    
    var move = document.getElementById("move");
    var select = document.getElementById("select");
    var sell = document.getElementById("sell");
    
    if (this.cursorMode == "move") {
      move.className = "buttonSelected";
      select.className = "button";
      sell.className = "button"; 
    }
    else if (this.cursorMode == "select") 
    {
      select.className = "buttonSelected";
      move.className = "button";
      sell.className = "button"; 
    }
    else
    {
      sell.className = "buttonSelected";
      move.className = "button";
      select.className = "button";  
    }
  }
  
  //Register event listeners
  forgroundCanvas.addEventListener("mousedown",function(e){game.mouseClicked(e)},false);
  forgroundCanvas.addEventListener("mousemove",function(e){game.mouseMoved(e)},false);
  document.onkeydown = function(e){game.keyPress(e);};

}
//Entity base class
function Entity() {
  //Position
  this.x = 0;
  this.y = 0;
  
  //Canvas layer this drawable belongs to.
  this.context = 0;
  
  this.init = function(x,y,context)
  {
    this.x = x;
    this.y = y;
    this.context = context;
  };
  
  this.update = function()
  {
    
  };
  
  this.draw = function()
  {
    
  };
}

function Person() {
  this.goalX = Math.floor((Math.random()*640));
  this.goalY = Math.floor((Math.random()*480));
  
  this.thought = "wandering";
  this.cash = Math.ceil(Math.random()*500);
  if (Math.random() < game.popularity/100 && game.popularity > 70) {
    this.cash += 2000; //High roller boost
  }
  this.mood = 100;
  this.gameImPlaying = 0;
  this.imPlayerNumber = 0;
  
  this.selected = false;
  this.gone = false;
  this.temperament  = Math.ceil(Math.random() * 3);
  
  this.frame = 0;
  this.ticks = Math.floor(Math.random()*1000); //Add some variety
  this.image = 0;
  
  if (this.cash > 500) {
    this.image = personHighRollerImage;
    this.temperament  = 5;
  }
  else
  {
    this.image = personImage;
  }
  
  this.update = function()
  {
    this.ticks++;
    if (this.mood > 100) {
      this.mood = 100;
    }
    //The person state machine
    switch (this.thought)
    {
      case "wandering":
        if (this.closeToGoal()) {
          this.goalX = Math.floor((Math.random()*640));
          this.goalY = Math.floor((Math.random()*480));
        }
        
        if (this.cash <= 0 || this.mood <= 0)
        {
          this.thought = "leave";
        }
        
        if (this.ticks%30 == 0) {
          this.mood-= Math.ceil(this.temperament  / 2);
        }
        
        if (this.ticks%120 == 0) {
          this.thought = "findGameToPlay";
        }
      
        this.move();
        
        //Decide if I want to play something here
        break;
      
      case "findGameToPlay":
          //Search for a free game here.
          for (var i = 0; i < MaxGames; i++) {
            if (game.casinoGames[i] != 0)
            {
              if (game.casinoGames[i].currentPlayers < game.casinoGames[i].maxPlayers  && game.casinoGames[i].costToPlay < this.cash && game.casinoGames[i] != game.movingObject) {
                this.gameImPlaying = game.casinoGames[i];
                this.thought = "moveToGame";
                break;
              }
            }
          }
        if (this.gameImPlaying == 0)
        {
          this.thought = "wandering";
          this.mood -= this.temperament ; //I'm upset because I couldn't find a game to play.
          game.popularity--;
        }
        
        break;
      
      case "moveToGame":
        this.goalX = this.gameImPlaying.x;
        this.goalY = this.gameImPlaying.y;
        this.move();
      
        if (this.closeToGoal()) {
          //Check if game is still free
          if (this.gameImPlaying.currentPlayers >= this.gameImPlaying.maxPlayers) {
            this.gameImPlaying = 0;
            this.thought = "findGameToPlay";
            this.mood -=  Math.ceil(this.temperament  / 2);  //I didn't make it in time and now I'm sad.
          }
          else
          {
            this.thought="playGame";
            this.imPlayerNumber = this.gameImPlaying.currentPlayers;
            this.gameImPlaying.currentPlayers++;   
          }

        }
        break;
      
      //Position myself on the game and play it
      case "playGame":
        //The game has been moved on me!
        this.frame = 1;
        if (this.gameImPlaying.sold == true) {
          delete this.gameImPlaying;
          this.gameImPlaying = 0;
          this.thought = "wandering";  
        }
        if (this.goalX != this.gameImPlaying.x || this.goalY != this.gameImPlaying.y) {
          this.gameImPlaying.currentPlayers--;
          this.gameImPlaying = 0;
          this.thought = "findGameToPlay";
          break;
        }
        
        if (this.gameImPlaying.height > 16) {
          this.y = this.gameImPlaying.y+16;
          this.x = this.gameImPlaying.x+16*this.imPlayerNumber;
        }
        
        if (this.cash < this.gameImPlaying.costToPlay) {
          this.thought = "wandering";
          this.gameImPlaying.currentPlayers -= 1;
          this.gameImPlaying = 0;
        }
        
        if (this.ticks%60 == 0) {
          //Play da game!
          this.cash -= this.gameImPlaying.costToPlay;
          game.cash += this.gameImPlaying.costToPlay;
          if (this.gameImPlaying.didIWin() == true) {
            this.cash += this.gameImPlaying.cashOut;
            this.mood += 10;
            game.popularity++;
          }
          else
          {
            this.mood -=  Math.ceil(this.temperament  / 2);
          }
        }
        
        if (this.mood <= 0) {
          this.thought = "leave";
          this.gameImPlaying.currentPlayers -= 1;
          this.gameImPlaying = 0;
        }
        break;
      
      case "leave":
        this.goalX = doorX+16;
        this.goalY = doorY+16;
      
        if (this.closeToGoal()) {
          if (this.mood <= 30)
          {
            game.popularity -= 5;
            if (this.temperament  > 4) {
              game.popularity -= 5;
            }
          }
          this.gone = true;
        }
        
        this.move();
        break;
    }
  };
  this.draw = function()
  {
    if (this.selected == true) {
        this.context.fillStyle="#54FF29";
        this.context.fillRect(this.x-1,this.y-1,18,18);
    }
    
    //this.context.drawImage(personImage,this.x,this.y);
    this.context.drawImage(this.image, 16 * this.frame, 0, 16, 16, this.x, this.y, 16, 16);
  };
  
  this.move = function()
  {
    //Simple movement
    if (this.x > this.goalX) {
      this.x -= 1;
      this.frame = 2;
    }
    else if (this.x < this.goalX) {
      this.x += 1;
      this.frame = 3;
    }

    if (this.y > this.goalY) {
      this.y -= 1;
      this.frame = 1;
    }
    else if (this.y < this.goalY) {
      this.y += 1;
      this.frame = 0;
    }
  }
  
  this.closeToGoal = function()
  {
    return (Math.abs(this.x - this.goalX) < 1 && Math.abs(this.y - this.goalY) < 1);
  }
}
Person.prototype = new Entity();


function CasinoGame() {
  //Stat variables
  this.winRate = .5;
  this.cashOut = 100;
  this.costToPlay = 0;
  this.upKeep = 0;
  this.maxPlayers = 0;
  this.type = "";
  this.sold = false;
  
  this.width = 16;
  this.height = 16;
  
  //Animation Variables
  this.frame = 0;
  this.ticks = 0;
  this.frameCount = 0;
  
  this.selected = false;
  
  //State Variables
  this.currentPlayers = 0;
  this.currentLoses = 0;
  this.currentWins = 0;
  

  
  this.setType = function(type)
  {
    this.type = type;
    switch (type) {
      case "slots":
        this.frameCount = 1;
        this.maxPlayers = 1;
        this.upKeep = 1;
        this.costToPlay = 1;
        this.cashOut = 10;
        this.winRate = .1;
        break;
      case "roulette":
        this.frameCount = 2;
        this.maxPlayers = 5;
        this.width = 32;
        this.height = 32;
        this.upKeep = 4.5;
        this.costToPlay = 15;
        this.cashOut = 20;
        this.winRate = .3
        break;
    case "blackjack":
        this.frameCount = 2;
        this.maxPlayers = 3;
        this.width = 32;
        this.height = 32;
        this.upKeep = 2;
        this.costToPlay = 15;
        this.cashOut = 20;
        this.winRate = .3
        break;
 
    case "craps":
        this.frameCount = 2;
        this.maxPlayers = 6;
        this.width = 32;
        this.height = 32;
        this.upKeep = 3;
        this.costToPlay = 15;
        this.cashOut = 20;
        this.winRate = .3
        break;
    }
  }
  
  this.update = function()
  {
    this.ticks++;
    if (this.ticks > 60)
    {
      if (this.currentPlayers > 0) {
        this.frame++;
      }
      else
      {
        this.frame = 0;
      }
      
      game.cash += this.currentLoses*this.costToPlay - this.currentWins*this.cashOut - this.upKeep;
      this.currentLoses = 0;
      this.currentWins = 0;
      this.ticks = 0;
    }

    
    if (this.frame >= this.frameCount) {
      this.frame = 0;
    }
  };
  
  this.draw = function()
  {
    if (this.selected == true) {
      this.context.fillStyle="#54FF29";
      this.context.fillRect(this.x-1,this.y-1,this.width+2,this.height+2);
    }
    var image = 0;
    switch (this.type) {
      case "slots":
        image = slotsImage;
        break;
      case "roulette":
        image = rouletteImage;
        break;
      case "blackjack":
        image = blackjackImage;
        break;
      case "craps":
        image = crapsImage;
        break;
    }
    
    this.context.drawImage(image, this.width * this.frame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  };
  
  this.didIWin = function()
  {
    var roll = Math.random();
    if (this.winRate < roll) {
      this.currentLoses++;
      return false;
    }
    else
    {
      this.currentWins++;
      return true;
    }
  }
}
CasinoGame.prototype = new Entity();

function Doodad() {
  this.frame = 0;
  this.selected = false;
  this.draw = function()
  {
    if (this.selected == true) {
      this.context.fillStyle="#54FF29";
      this.context.fillRect(this.x-1,this.y-1,18,18);
    }
    
    this.context.drawImage(doodadImage, 16 * this.frame, 0, 16, 16, this.x, this.y, 16, 16);
  };
}
Doodad.prototype = new Entity();
//***************************
//****Initialize*************
//***************************
var game = new Game();


function StartGame() {
  game.init();
  run();
}


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

function run() {
  //Fps stuff
  thisFrame = Date.now();
  elapsed = thisFrame - lastFrame;
  lastFrame = thisFrame;
  var span = document.getElementById('fps-text').innerHTML =avgFramerate;
  
  //Game running
  game.run();
  if (game.stoppedRunning == false)
  {
    requestAnimFrame( run );
  }
  
  //FPS Stuff
  frameCount++;
  elapsedCounter += elapsed;
   
  if (elapsedCounter > 1000) {
    elapsedCounter -= 1000;
    avgFramerate = frameCount;
    frameCount = 0;
  }
}


//Start the game already!
StartGame();
game.changeCursorMode('select');