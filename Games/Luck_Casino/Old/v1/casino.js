//Constants
var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
var StartingAttendance = 1;
var MaxAttendance = 1;

//Assets
var personImage = new Image();
personImage.src = "person.gif";

var floorImage = new Image();
floorImage.src = "floor.gif";
var floorPattern = 0;
floorImage.onload = function() {floorPattern = context.createPattern(floorImage,"repeat");};

//Game entities
var people = new Array(MaxAttendance);

//The Game Class
function Game(fps) {
    var game = {};

    
    game.fps = fps;
    game.infoPane = document.getElementById("info");
    
    game.popularity = .5;
    game.attendance = 0;
    game.lastFrame = new Date();
    game.currentTime = new Date();

    //Create an initial group of people
    for (var i = 0; i < MaxAttendance; i++) {
      if (game.attendance < StartingAttendance) {
        people[i] = Person();
        game.attendance++;
      }
      else
      {
        people[i] = 0;
      }
    }

    
    game.onMouseClick = function(e) {
        var mouseCoords = getMouse(e, this.canvas);
        context.fillStyle="#F00000";
        context.fillRect(mouseCoords.x,mouseCoords.y,10,10);
    }
    canvas.addEventListener("mousedown",function(e){game.onMouseClick(e)},false);
    
    game.Update = function() {
      var delta = (game.currentTime - game.lastFrame)/16;
      //Add new people based on popularity
      if (game.attendance < MaxAttendance) {
        if (Math.random() < game.popularity) {
          for (var i = 0; i < MaxAttendance; i++) {
            if (people[i] == 0) {
              people[i] = Person();
              break;
            }  
          }   
        }
      }
      
      //Update people and remove them if they are gone.
      for (var i = 0; i < MaxAttendance; i++) {
        if (people[i] != 0) {
          if (people[i].gone == true) {
            delete people[i];
            people[i] = 0;
            attendance--;
          }
          else
          {
            people[i].Update(delta);
          }
        }  
      }
    }
    
    game.Draw = function() {
      var delta = (game.currentTime - game.lastFrame)/16;

      context.clearRect( 0 , 0 , 640 , 480);
      
      //Create the floor
      
      context.rect(0,0,640,480);
      context.fillStyle=floorPattern;
      context.fill();
      
      //Draw all the people
      for (var i = 0; i < MaxAttendance; i++) {
        if (people[i] != 0) {
          people[i].Draw(game.lastFrame);
        }  
      }
     
    }
    
    game.Run = function() {
        game.currentTime = new Date();
        game.Update();
        game.Draw();
        game.lastFrame = new Date();
    }
    
    function getMouse(e, canvas) {
      var element = canvas, offsetX = 0, offsetY = 0, mx, my;
        
      if (element.offsetParent !== undefined) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }
    
      //offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
     // offsetY += stylePaddingTop + styleBorderTop + htmlTop;
    
      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;
      return {x: mx, y: my};
    }
    
    return game;
}

function Person() {
  var person = {};
  
  person.thought = "Nothing";
  person.cash = 100;
  person.mood = 100;
  person.gone = false;
  
  person.x = Math.floor((Math.random()*640));
  person.y = Math.floor((Math.random()*480));
  person.goalX = Math.floor((Math.random()*640));
  person.goalY = Math.floor((Math.random()*480));
  
  person.LoseGame = function()
  {
    person.mood -= 1;
  }
  
  person.WinGame = function()
  {
    person.mood += 1;
  }
  
  person.GetCash = function(cash)
  {
    person.cash += cash;
  }
  
  person.LoseCash = function(cash)
  {
    person.cash -= cash;
  }
  
  person.Update = function(delta)
  {
    //person.cash-=1;
    //delta = Math.round(delta);

    if (person.cash == 0) {
      //person.gone = true;
    }
        //Simple movement
    if (person.x > person.goalX) {
      person.x -= delta;
    }
    else if (person.x < person.goalX) {
      person.x += delta;
    }

    if (person.y > person.goalY) {
      person.y -= delta;
    }
    else if (person.y < person.goalY) {
      person.y += delta;
    }
    
    if (Math.abs(person.x - person.goalX) < 1 && Math.abs(person.y - person.goalY) < 1) {
      person.goalX = Math.floor((Math.random()*640));
      person.goalY = Math.floor((Math.random()*480));

    }

  }
  
  person.Draw = function(delta)
  {
    context.fillStyle="#FF0000";
    context.fillRect(person.goalX-5,person.goalY-5,10,10);
    context.drawImage(personImage,person.x,person.y);
  }
  
  return person;
}


//Input handler
var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
