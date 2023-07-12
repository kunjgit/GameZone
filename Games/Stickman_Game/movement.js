function movement(){
  if(timerClock ==0){     // this calculates the current fps the game is running at
    timer = new Date();
    timer = timer.getTime();
  }
  timerClock++;
  current_x = player_x-28;
  current_y = player_y-12;
  if(keyState[38]){   //UP
    if(jumpCheck == 0 || onsomething==1){
   //   jumpSound.play();   // JUMPING
      jumpStart_y = player_y;
      jumpCheck = 1;
    }
  }  
  if(keyState[40]){   //DOWN
    if(player_y < canvas.height-40){  
    }
  }
  if(keyState[37]){       // LEFT          
    if(player_x > 30){ 
      direction = 0;
      if (animation < 15){
        animation++;
      }
      else{
        animation = 0;
      }
    }  
    player_x -= speed;
    current_x -= speed;
  }  
  if(keyState[39]){   //RIGHT
    if(player_x < canvas.width-30){ 
      direction = 1
      if (animation < 15){
        animation++;
      }
      else{
        animation = 0;
      } 
    }
    player_x += speed;
//    current_x += speed;         
  }   
  if(keyState[39] && keyState[37]){
    animation -= 2;                                   // this stops the animation entirely when opposing directions are pressed
  }
  if(keyState[32]){             // Spacebar
    if(swordInHand == 1){
      setTimeout(spaceBarRelease, 20);     // needs to have a timeout or the spaceBarRelease function doesn't have enough time to get new state of spacebar and it wouldn't go through the check    
      ctx.moveTo(throwStr-140, 20);          // these give a visual indicator to how much throw strength is being used
      ctx.lineTo(throwStr-140, 50);   
      throwStr += chargeSpeed; 
      if(throwStr < 200){                   // Projectile speed and how far it goes and how fast it rotates is determined by how long spacebar is pressed
        projectileSpeed = 4;
        r = 0.15;
        swordDamage = 5;
      }
      else if(throwStr < 400){
        projectileSpeed = 4;
        r = 0.15;
        swordDamage =  7;
      }
      else if(throwStr < canvas.width-50 ){
        projectileSpeed = 4;
        r = 0.2;
        swordDamage = 10;
      }
      else{
        projectileSpeed = 4;
        r = 0.2;
        throwStr = canvas.width-50
        swordDamage = 12;
      }
    }
    if(swordInHand == 0){  // allows a knife to be thrown only when the sword is not in hand
      if(counter == 0){
        knifeTable.push(new knife(current_x, current_y, direction, 0));
        counter = 1;
      }      
    }  
  }
  if(keyState[65] && keyState[83] && keyState[68]){
    spd = parseInt(prompt("Speed:", ""));
//    chargeSpeed = parseInt(prompt("charge speed:", ""));
    lvl = parseInt(prompt("Level:", ""));
    if(lvl>0){
      level = lvl;
      calc = 0;
      drawed = 0;
      enemies = [];
      spawned = 0;
      player_x = 10;
    }
    if(spd>0){
      speed = spd;
    }
    keyState[65] = false;
    keyState[83] = false;
    keyState[68] = false;
  }
  if(player_y < 105){ //These handle the player coordinates so that it won't move off the canvas
    //player_y = 105;
  //  current_y = player_y-12;
  }
  if(player_y > canvas.height-50){
    player_y = canvas.height-50;
 //   current_y = player_y-12;
  }
  if(player_x < 30){
    player_x = 30;
 //   current_x = player_x-28
  }
  if(player_x > canvas.width-30){
    player_x = 30;
    sword_x = player_x;
    sword_y = player_y;
    level++;
    calc = 0;   
    drawed = 0;
    enemies = [];
    spawned = 0;
//    current_x = 30;
  }
  if(swordInHand == 1){
    sword_x = current_x;
    sword_y = current_y;
  }
  if(animation < 0){
    animation = 0;
  }
  if(player_y<canvas.height-50&&onsomething==0){
    falling = 1;
  }
  else{
    falling = 0;
  }
  backGround();
  level1();
  sword();
  ctx.moveTo(10,20);
  ctx.lineTo(10,50);
  for(var i in knifeTable){   // draws the knives
    var knives = knifeTable[i];
    knife_x = knives.knife_x;
    knife_y = knives.knife_y;
    j = knives.j;
    ctx.save();
    ctx.translate(knife_x,knife_y-12.5);
    ctx.rotate(0.1*j);
    ctx.translate(-knife_x,-knife_y+12.5);
    ctx.moveTo(knife_x, knife_y);
    ctx.lineTo(knife_x, knife_y-25);
    ctx.moveTo(knife_x-5, knife_y-8);
    ctx.lineTo(knife_x+5, knife_y-8);
    ctx.stroke();
    ctx.restore();   
    knives.update(); 
  }
  drawEnemies();   
  swordThrow();   
  stickMan();
  drawObstacles();  
  obstacleHitbox(player_x,player_y,25,25,30,100,speed)
  onsomething = onsome;
  if(collidedX){
    player_x = collidedX;
  }
  if(collidedY){
    player_y = collidedY;
  }
  if(bot){
    jumpCheck=2;
  }
  jumping();
  if(counter != 0){
    knifeCounter();
  }
  if(timerClock==60){     // related to calculating fps
    elapsed = new Date();
    elapsed = elapsed.getTime()-timer;
    text.innerHTML = "fps: "+Math.floor((60/(elapsed/1000)));
    timerClock=0;
  }
}

function jumping(){            //JUMP
  if(jumpStart_y < player_y+100 && jumpCheck == 1){
      player_y -= 6;
  }
  else{
    jumpCheck = 2;
    if(jumpStart_y > player_y && jumpCheck == 2 && onsomething==0||falling == 1){
      player_y += 6;     // also acts as physics
    }
    else{
      jumpCheck = 0;
    }
  }
}
  
function spaceBarRelease(){   // The sword is thrown once spacebar is released
  if(!keyState[32]){
    checkHitbox(player_x,player_y,50+projectileSpeed,50+projectileSpeed,30,100,speed)
    if(!collidedX || collidedX > player_x && direction == 1 || collidedX < player_x && direction == 0){
      if(swordInHand == 1){           // allows sword to be thrown only when it wouldn't clip through an obstacle
        swordInHand = 0;
        sword_x = current_x;
        sword_y = current_y;
        initial_x = current_x;
        initial_y = current_y;
        if(jumpCheck > 0){
          throwStr *= 2;
        }
      }
    }
    else{
      throwStr = 150;
    }
  }  
} 