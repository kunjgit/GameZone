// --------------------------------------------- //
// Setting global variables

// We store the game grid, the amount of points and number of cats hit
// in a global object on the window
window.game = [false, false, false, false, false, false, false, false, false];
window.cats = 0;
window.points = 0;

// This array defines whether a cat is going up or down
window.up = [false, false, false, false, false, false, false, false, false];

// This array defines whether a cat has just been hit or not
window.hit = [false, false, false, false, false, false, false, false, false];

// This array defines the position of the cats
window.pos = [1, 1, 1, 1, 1, 1, 1, 1, 1];

// This variable determines if the game has started or not
window.started = false;

// Holds the highest score
window.hiScore = 0;

// Holds the time left of game
window.timeLeft = 0;

// Cat and hit image, just for better performance
window.catImg = new Image();
catImg.src = "cat.jpg";
window.hitImg = new Image();
hitImg.src = "hit.jpg";

// The id for the setInterval for the counter
window.counterId = false;

// End setting global variables
// --------------------------------------------- //

// The keydown adds 10 points for hitting a cat or removes 10 points for hitting
// an empty spot
window.onkeydown = function(e){
  var code = e.which || e.keyCode;
  
  // Keymap
  var keys = {
    "Q" : 81,
    "W" : 87,
    "E" : 69,
    "A" : 65,
    "S" : 83,
    "D" : 68,
    "Z" : 90,
    "X" : 88,
    "C" : 67,
    "SPACE" : 32
  };
  
  // Changes the game if it has started
  if(started){
    // Grid checking and changing the points accordingly
    if(code == keys["Q"]){
      if(game[0]){
        points += 10;
        cats++;
        game[0] = false;
        pos[0] = 1;
        up[0] = false;
        hit[0] = true;
        setTimeout(function(){
          hit[0] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["W"]){
      if(game[1]){
        points += 10;
        cats++;
        game[1] = false;
        pos[1] = 1;
        up[1] = false;
        hit[1] = true;
        setTimeout(function(){
          hit[1] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["E"]){
      if(game[2]){
        points += 10;
        cats++;
        game[2] = false;
        pos[2] = 1;
        up[2] = false;
        hit[2] = true;
        setTimeout(function(){
          hit[2] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["A"]){
      if(game[3]){
        points += 10;
        cats++;
        game[3] = false;
        pos[3] = 1;
        up[3] = false;
        hit[3] = true;
        setTimeout(function(){
          hit[3] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["S"]){
      if(game[4]){
        points += 10;
        cats++;
        game[4] = false;
        pos[4] = 1;
        up[4] = false;
        hit[4] = true;
        setTimeout(function(){
          hit[4] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["D"]){
      if(game[5]){
        points += 10;
        cats++;
        game[5] = false;
        pos[5] = 1;
        up[5] = false;
        hit[5] = true;
        setTimeout(function(){
          hit[5] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["Z"]){
      if(game[6]){
        points += 10;
        cats++;
        game[6] = false;
        pos[6] = 1;
        up[6] = false;
        hit[6] = true;
        setTimeout(function(){
          hit[6] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["X"]){
      if(game[7]){
        points += 10;
        cats++;
        game[7] = false;
        pos[7] = 1;
        up[7] = false;
        hit[7] = true;
        setTimeout(function(){
          hit[7] = false;
        }, 200);
      }else
        points -= 10;
    }else if(code == keys["C"]){
      if(game[8]){
        points += 10;
        cats++;
        game[8] = false;
        pos[8] = 1;
        up[8] = false;
        hit[8] = true;
        setTimeout(function(){
          hit[8] = false;
        }, 200);
      }else{
        points -= 10;
      }
    }
  }else{
    // Starts the game when space is pressed
    if(code == keys["SPACE"]){
      started = true;
      timeLeft = 30;
      counter = setInterval(function(){ timeLeft--; if(timeLeft == 0) endGame(); }, 1000);
    }
  }
};

// Function that ends the game (duh), resetting all variables
function endGame(){
  clearInterval(counter);
  // Sets a new HiScore, if applicable
  if(points > hiScore){
    hiScore = points;
  }
  game = [false, false, false, false, false, false, false, false, false];
  cats = 0;
  points = 0;
  up = [false, false, false, false, false, false, false, false, false];
  hit = [false, false, false, false, false, false, false, false, false];
  pos = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  timeLeft = 0;

  // Really ends the game
  started = false;
}

// Function for rendering the game graphics
function render(){
  
  // Function to simplify drawing the holes
  function drawOval(ctx, xLeft, yCenter){
    ctx.beginPath();
    ctx.moveTo(xLeft, yCenter);
    ctx.bezierCurveTo(xLeft, yCenter-50, xLeft+100, yCenter-50, xLeft+100, yCenter);
    ctx.moveTo(xLeft, yCenter);
    ctx.bezierCurveTo(xLeft, yCenter+50, xLeft+100, yCenter+50, xLeft+100, yCenter);
    ctx.fill();
  }
  
  // Getting the context and setting the environment
  var c = document.getElementById("c"),
  ctx = c.getContext("2d");

  // Does the game logic and rendering if the game is happening, else displays a screen
  if(started){
    ctx.fillStyle = "#808090";
    ctx.fillRect(0,0,500,500);
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    
    // Draws the holes, watch out for ternary operators
    for(var i = 0; i < 9; i++){
      drawOval(ctx, 50 + ((i%3)*150), 100 + (100 * (i < 3 ? 0 : i < 6 ? 1 : 2) ) );
      if(pos[i] <= 9 && !up[i]){
        game[i] = false;
      }
      if(game[i]){
        if(pos[i] < 81 && up[i]){
          pos[i] += 10;
        }else if(pos[i] > 9 && !up[i]){
          pos[i] -= 10;
        }
        ctx.globalCompositeOperation = "darker";
        ctx.drawImage(catImg, 0, 0, 56, pos[i], 70 + ((i%3)*150), 110 + (100 * (i < 3 ? 0 : i < 6 ? 1 : 2) ) - pos[i], 56, pos[i]);
        ctx.globalCompositeOperation = "source-over"; 
      }
      if(hit[i]){
        ctx.globalCompositeOperation = "darker";
        ctx.drawImage(hitImg, 50 + ((i%3)*150), 50 + (100 * (i < 3 ? 0 : i < 6 ? 1 : 2)) );
        ctx.globalCompositeOperation = "source-over"; 
      }
    }
    
    // Sets the font and displays the number of cats hit and points
    ctx.font = "20px Helvetica bold";
    ctx.fillStyle = "#2010CC";
    ctx.fillText("Cats hit: " + cats, 50,430);
    ctx.fillText("Points:   " + points, 50,460);  

    // Show how much time is left
    ctx.font = "30px Helvetica bold";
    ctx.fillText("Time left: " + timeLeft, 150, 35);
  }else{
    // Else it displays a splash screen
    ctx.fillStyle = "#A0A0F0";
    ctx.fillRect(0,0,500,500);

    ctx.fillStyle = "#000000";
    ctx.font = "30px Helvetica bold";
    ctx.fillText("Highest score: " + hiScore, 150, 35);
    ctx.font = "40px Helvetica bold";
    ctx.fillText("Black Cat Lucky Hunter", 50, 100);
    ctx.font = "15px Helvetica bold";
    ctx.fillText("Everybody knows black cats bring bad luck!", 50, 150);
    ctx.fillText("They are from the evil cat dimension and are", 50, 175);
    ctx.fillText("trying dominate our universe! You must ", 50, 200);
    ctx.fillText("stop them from leaving their inter-dimensional ", 50, 225);
    ctx.fillText("portals by pressing the keys for the respective portals, as follows:", 50, 250);

    ctx.fillText("Q     W     E", 200, 300);
    ctx.fillText("A     S     D", 200, 350);
    ctx.fillText("Z     X     C", 200, 400);

    ctx.font = "20px Helvetica bold";
    ctx.fillText("Press spacebar to start the game", 120, 450);
  }

}

setInterval(render, 10);

// Every second a new cat is spawned, with a random lifespan
setInterval(function(){ 
  var dur = Math.random()*10001;
  dur = Math.floor(dur < 1000 ? 1000 : dur);
  var cat = Math.floor(Math.random()*10);
  while(game[cat]){
    cat = Math.floor(Math.random()*10);
  }
  game[cat] = true;
  setTimeout(function(){
    game[cat] = false;
    pos[cat] = 1;
  }, dur);
  // Sets the cat going up
  up[cat] = true;
  setTimeout(function(){
    up[cat] = false;
  }, dur/2);
}, 1000);