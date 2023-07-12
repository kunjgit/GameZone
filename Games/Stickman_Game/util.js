var timer;
var elapsed;
var interval;
function begin(){
  canvas = document.getElementById("Canvas1");
  ctx = canvas.getContext("2d");
  text = document.getElementById("text");
  text.innerHTML = "Score : 0";
  swordSound = document.getElementById("swordSound");
  jumpSoud = document.getElementById("jumpSound")
//  enemyHitpoints = document.getElementById("enemyHP");
//  enemyHitpoints.innerHTML = "enemy hp: 5";
  // VARIABLES             
  playerHealth = 20;
  player_x = 20;               //These set the initial coordinates
  player_y = canvas.height-50;
  sword_x = player_x-28;
  sword_y = player_y-12;
  current_x = sword_x;          // keeps track where the player moves so that the sword can be returned to and thrown from the stickman again
  current_y = sword_y;
  initial_x = sword_x;          // keeps track of where the sword was when it was thrown
  initial_y = sword_y;
  knife_x = player_x-28;        // keeps track of the position of the knife
  knife_y = player_y-12;
  return1 = 1;                  // checks if the sword is leaving or returning to player
  animation = 2;                // This counts the phase of animation
  direction = 1;                // checks the direction of last key press
  keyState = {};                // keeps track of the state of different keys
  speed = 3;                    // The speed at which the player moves(Default: 2)
  projectileSpeed = 3;          // Speed of the projectiles (Default: 3) NO EFFECT WHEN throwStr DECIDES PROJECTILE SPEED
  throwStr = 150;               // This sets how far the sword is thrown
  chargeSpeed = 2;              // sets how fast the throw strength rises
  r = 0.1;  
  swordInHand = 1;              // different flags for different things
  swordCheck1 = 0;
  swordCheck2 = 0;
  swordDamage = 5;
  swordJump = 0;
  knifeTable = [];              // creates an empty array where different knife function values are saved
  knifeDamage = 1;
  enemies = [];
  counter = 0;
  i = parseInt(0);
  jumpStart_y = player_y;
  score = 0;
  j = 0;
  k = 0;
  timerClock = 0;  
  calc = 0;
  drawed = 0;
  jump = 0;
  jumpCheck = 0; 
  onsomething = 0;
  falling = 0;
  boxHits = {};
  level = 1;
  spawned = 0;
  // Variable related to enemies
  enemy_x = canvas.width-20;
  enemy_y = canvas.height-35;
  enemyAnimation = 0;
  enemyDirection = 0;
  enemySpeed = 1;
  enemyHP = 5;
  enemyHealth = 5;
  // END OF VARIABLES
  ctx.translate(0.5,0.5);         // Stops javascript from messing with colors because of antialiasing and wierd pixel placement.
  document.addEventListener("keyup", function(event){
    keyState[event.keyCode] = false;                     // These functions set a "false" or "true" state to pressed keys which are then 
  });                                                    // Read with interval to make stickman move when ever an arrow key state is true
  document.addEventListener("keydown", function(event){  // This makes it possible to move diagonally and smoother movement in general
    keyState[event.keyCode] = true;                      // Special thanks to Jussi Parkkinen for the keyStates idea
    if(event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40){
      event.preventDefault();
    }
  }); 
  interval = setInterval(movement, 1000/60);    // Draws everything 60 times per second
}
function knifeCounter(){     // allows knife to be thrown every time the counter reaches a set limit.
  counter++;
  if(counter == 30){       // sets how frequently a knife can be thrown
    counter = 0;   
  }
}     
function blur(){      // Sets the keys to false so that when the user presses out of the window they don't get "stuck"
  keyState[40] = false;
  keyState[39] = false;
  keyState[38] = false;
  keyState[37] = false;
  keyState[32] = false;
} 
function knife(x, y, dir, j){                 // sets the variables for the knives
  if(dir == 0 || dir == 3){
    this.knife_x = x;
  }
  if(dir == 1 || dir == 2){
    this.knife_x = x+56;
  }
  this.knife_y = y;
  this.j = j;
  this.dir = dir;
}  
knife.prototype.update = function(){         // Updates the knives position until they hit border of the canvas
  checkHitbox(this.knife_x, this.knife_y,10,10,10,10,4)
  if(collidedX){
    remover(knifeTable, this);
  }
  if(this.dir == 0 || this.dir == 3){
    this.knife_x -= 4;
    this.j--;
    if(this.knife_x < 5){
      remover(knifeTable, this);
    }
  }
  if(this.dir == 1 || this.dir == 2){
    this.knife_x += 4;
    this.j++;
    if(this.knife_x > canvas.width){
      remover(knifeTable, this);
    }
  }
  if(enemy_x > this.knife_x && enemy_x-15 < this.knife_x){
    enemy_x += +50;
    enemyHealth -= knifeDamage;
    remover(knifeTable, this);           
  }
  if(enemy_x < this.knife_x && enemy_x+5 > this.knife_x){
    enemy_x -= +50;
    enemyHealth -= knifeDamage;
    remover(knifeTable, this);
  }   
}        
function remover(list, object){              // Removes  a thrown knife from the knifeTable array when it reaches the edge of the canvas
  for(i in list){
    if(object == list[i]){
      list.splice(i, 1);
      break;
    }
  }
}                       
function swordThrow(){
  if(swordInHand == 0 ){       // Checks if spacebar has been pressed to initatiate swordthrow
    if(direction == 0 && swordCheck1 == 0 && swordCheck2 == 0|| direction == 3  && swordCheck1 == 0 && swordCheck2 == 0){
      swordCheck1 = 1; 
      swordCheck2 = 0;
    }
    if(direction == 1 && swordCheck1 == 0 && swordCheck2 == 0 || direction == 2 && swordCheck1 == 0 && swordCheck2 == 0){
      swordCheck1 = 0;
      swordCheck2 = 1;
    }
    if(r*k < (Math.PI*2)){
      k++;                         // For some reason can't have "i" as variable here because it gets unexplained value changes and makes the swords rotation look clumsy
    }                              // Even when removing all the references to "i" from everywhere (except the knifeTable array for clauses) console.log reports it's value changing to 0.15 and 0.3 all of a sudden
    else{
      k = 0;
    }
    if(swordCheck1 == 1){   // LEFT
      checkHitbox(sword_x,sword_y,5+projectileSpeed,5+projectileSpeed,7+projectileSpeed,60,projectileSpeed)
      if(collidedX){
        sword_x = collidedX+projectileSpeed;
        return1 = 0;
        k = 0
      }
      if(collidedY){
        sword_y = collidedY-projectileSpeed;
      }
      ctx.save();
      ctx.translate(sword_x,sword_y-30);
      if(sword_x >= player_x || return1 == 1){                   // determines the direction the sword is spinning so that it spins to the other way when returning to player
        ctx.rotate(-r*k);
      }
      if(sword_x < player_x && return1 == 0){
        ctx.rotate(r*k);
      }
      ctx.translate(-sword_x,-sword_y+30);
      ctx.moveTo(sword_x,sword_y);
      ctx.lineTo(sword_x,sword_y-60);
      ctx.moveTo(sword_x-5,sword_y-15);
      ctx.lineTo(sword_x+3,sword_y-15); 
      ctx.stroke();
      ctx.restore();
      if(sword_x > initial_x-throwStr && return1 == 1 && sword_x > 0){             // This sets how far the sword flies, and it bounces back if it hits a wall
        sword_x -= projectileSpeed;
        if(jumpCheck > 0 ||swordJump == 1){
          swordJump = 1;
          if(sword_x > initial_x-(throwStr/4)){
            sword_y -= 3;        
          }
          else if(sword_x > initial_x-(throwStr/3)){
            sword_y -= 2;
          }
          else if(sword_x > initial_x-(throwStr/2)){
            sword_y -= 1;
          }
          else{
            sword_y += 3;
          }
        }
      }
      else {
        return1 = 0;
      }  
      if(return1 == 0){
        if(sword_x < player_x-projectileSpeed || sword_x > player_x+projectileSpeed || sword_y < player_y-projectileSpeed-10 || sword_y > player_y+projectileSpeed-10){
          if(sword_x < player_x){
            sword_x += projectileSpeed;
          }
          if(sword_x > player_x){
            sword_x -= projectileSpeed;
          }
          if(sword_y < player_y-10){
            sword_y += projectileSpeed;
          }
          if(sword_y > player_y-10){
            sword_y -= projectileSpeed;
          }
        }
        else{
          return1 = 1;                                    // resets all the variables related to throwing the sword
          swordInHand = 1;
          sword_y = current_y;
          sword_x = current_x;
          swordCheck1 = 0;
          swordCheck2 = 0;  
          throwStr = 150;
          swordJump = 0;
        }  
      } 
    }
    if(swordCheck2 == 1){   // RIGHT
      checkHitbox(sword_x+56,sword_y,5+projectileSpeed,5+projectileSpeed,7+projectileSpeed,60,projectileSpeed)
      if(collidedX){
        return1 = 0;
        sword_x = collidedX-56-projectileSpeed;
        k = 0;
      }
      if(collidedY){
        sword_y = collidedY-projectileSpeed;
      }
      ctx.save();
      ctx.translate(sword_x+56,sword_y-30);
      if(sword_x+56 <= player_x || return1 == 1){                   // determines the direction the sword is spinning so that it spins to the other way when returning to player
        ctx.rotate(r*k);
      }
      if(sword_x+56 > player_x && return1 == 0){
        ctx.rotate(-r*k);
      }
      ctx.translate(-sword_x-56,-sword_y+30);
      ctx.moveTo(sword_x+56,sword_y);
      ctx.lineTo(sword_x+56,sword_y-60);
      ctx.moveTo(sword_x+51,sword_y-15);
      ctx.lineTo(sword_x+59,sword_y-15); 
      ctx.stroke();
      ctx.restore();
      if(sword_x < initial_x+throwStr && return1 == 1 && sword_x < canvas.width-50){             // when the sword hits the wall it bounces back and starts to return to player
        sword_x += projectileSpeed;
        if(jumpCheck > 0 ||swordJump == 1){
          swordJump = 1;
          if(sword_x < initial_x+(throwStr/4)){
            sword_y -= 3;
          }
          else if(sword_x < initial_x+(throwStr/3)){
            sword_y -= 2;
          }
          else if(sword_x < initial_x+(throwStr/2)){
            sword_y -= 1;
          }
          else{
            sword_y += 3;
          }
        }    
      }
      else {
        return1 = 0;
      }  
      if(return1 == 0){
        if(sword_x+56 > player_x+projectileSpeed || sword_x+56 < player_x-projectileSpeed || sword_y < player_y-projectileSpeed-10 || sword_y > player_y+projectileSpeed-10){
          if(sword_x+56+projectileSpeed > player_x){
            sword_x -= projectileSpeed;
          }
          if(sword_x+56+projectileSpeed < player_x){
            sword_x += projectileSpeed;
          }
          if(sword_y < player_y-10){
            sword_y += projectileSpeed;
          }
          if(sword_y > player_y-10){
            sword_y -= projectileSpeed;
          }
        }
        else{       
          return1 = 1;                                    // resets all the variables related to throwing the sword
          sword_y = current_y;
          sword_x = current_x;
          swordInHand = 1;
          swordCheck1 = 0; 
          swordCheck2 = 0;
          throwStr = 150;
          swordJump = 0;   
        }  
      }
    }  
  }                                         
}
function spawnEnemy(i,spawn_y,patrol1,patrol2,passive){
  enemies.push(new enemyList(i,spawn_y,patrol1,patrol2,passive));  
}   