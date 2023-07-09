enemyList.prototype.update = function(){  // moves the enemies
  // HITBOXES                
  if(!this.enemyPassive){
    checkHitbox(this.enemy_x,this.enemy_y,this.enemyLeft,this.enemyRight,this.enemyBottom,this.enemyTop,this.enemySpeed);
  /*  ctx.fillStyle = "#000000";
    ctx.fillRect(this.enemy_x-14,this.enemy_y-50,27,65);
    ctx.fill();    */
    this.enemyOnsomething = onsome;
    if(collidedX){
      this.enemy_x = collidedX;
      if(this.patrol == 2){
        this.patrol = 1;
      }
      else if(this.patrol == 1){
        this.patrol = 2;
      }
    }
    if(collidedY){
      this.enemy_y = collidedY;
    }
    if(bot){
      this.enemyJumpCheck = 2;
    }
    if(this.enemyHealth > 0){
      if(swordInHand == 0){       // SWORD
        if(this.enemy_x-42+this.enemyRight > sword_x-5 && this.enemy_x-42-this.enemyLeft < sword_x+5 && player_x < this.enemy_x && sword_y > this.enemy_y-this.enemyTop && sword_y-7 < this.enemy_y+this.enemyBottom){
          this.enemyHealth -= swordDamage;
          if(this.enemyHealth > 0){
            this.enemy_x += (throwStr/5)+10;
          }
          return1 = 0;       
        }
        if(this.enemy_x-this.enemyLeft < sword_x+5 && this.enemy_x+this.enemyRight > sword_x-5 && player_x > this.enemy_x && sword_y > this.enemy_y-this.enemyTop && sword_y-7 < this.enemy_y+this.enemyBottom){
          this.enemyHealth -= swordDamage;
          if(this.enemyHealth > 0){
            this.enemy_x -= (throwStr/5)+10;
          }
          return1 = 0;        
        }
      }              // KNIVES
      xx = this.enemy_x; // the below function doesn't like the this.enemy_x|y and just updates global enemy_x if it is not defined into different variable
      yy = this.enemy_y;
      tt = this.enemyTop;
      bb = this.enemyBottom;
      ll = this.enemyLeft;
      rr  =this.enemyRight
      if(!knifeTable.every(function(elem){
          if(elem.knife_x < xx+ll && elem.knife_x > xx && elem.knife_y > yy-tt && elem.knife_y < yy+bb){
            remover(knifeTable, elem);
            return false;
          }
          return true; 
        })){
        this.enemyHealth -= knifeDamage;
        if(player_x > this.enemy_x && this.enemyHealth > 0){
          this.enemy_x -= 50;  
        }
        if(player_x < this.enemy_x && this.enemyHealth > 0){
          this.enemy_x += 50;
        }
      }
    }            // PLAYER
    if(this.enemy_x > player_x-25 && this.enemy_x < player_x+25 && this.enemy_y > player_y-100 && this.enemy_y < player_y+75 && this.enemyHealth>0){
      checkHitbox(player_x,player_y,76,76,30,100,speed)
      if(this.enemy_x < player_x && collidedX > player_x ||this.enemy_x < player_x &&  !collidedX){
        player_x += 50;    // these stop the player from being knocked back if he would be knocked back into an obstacle
      }
      else if(this.enemy_x > player_x && collidedX < player_x ||this.enemy_x > player_x && !collidedX){
        player_x -= 50;
      }
      playerHealth -= 5;
      if(playerHealth <= 0){      // resets everything if player dies;
        score = 0;
        speed = 3;
        player_x = 30;
        sword_x = player_x;
        sword_y = player_y;
        playerHealth = 20;
        enemies = []; 
        level = 1;
        calc = 0;
        spawned = 0;
      }    
    }
    // END OF HITBOXES
    if(!this.enemyFlying){      //Physics
      if(this.enemy_y<canvas.height-33&&this.enemyOnsomething==0){
        this.enemyFalling = 1;
      }
      else{
        this.enemyFalling = 0;
      }
      if(this.enemyType == 3){
        if(this.enemyJumpCheck == 0 || this.enemyOnsomething==1){
          this.jumpStart = this.enemy_y;
          this.enemyJumpCheck = 1;
        }
      }
      if(this.jumpStart < (this.enemy_y+this.enemyJumpHeight) && this.enemyJumpCheck == 1){
          this.enemy_y -= 5;
      }
      else{
        this.enemyJumpCheck = 2;
        if(this.jumpStart_y > this.enemy_y && this.enemyJumpCheck == 2 && this.enemyOnsomething==0||this.enemyFalling == 1){
          this.enemy_y += 5;
        }
        else{
          this.enemyJumpCheck = 0;
        }
      }  
    }
    if(this.enemyHealth <= 0){
      this.enemyScale -= 0.0125;
      if(this.enemyScale <= 0){
        remover(enemies, this);
      }
    }
    if(this.enemy_x > canvas.width-15){
      this.enemy_x = canvas.width-15;
    }
    if(this.enemy_x < 15){
      this.enemy_x = 15;
    }
    if(this.enemy_y > canvas.height-30){
      this.enemy_y = canvas.height-30;
    }
    if(this.enemyAnimation < 15){
      this.enemyAnimation++;
    }
    else{
      this.enemyAnimation = 0;
    }
    if(this.patrol && this.enemyHealth > 0){    // patrolling
      if(this.patrol==2){
        if(this.enemy_x > this.patrol_start){
          this.enemy_x -= this.enemySpeed;
          this.enemyDirection = 0;
        }
        else{
          this.patrol=1;
        }
      }    
      if(this.patrol==1 && this.enemyHealth > 0){
        if(this.enemy_x < this.patrol_end){
          this.enemy_x += this.enemySpeed;
          this.enemyDirection = 1;
        }
        else{
          this.patrol=2;
        }
      }
    }
    else{
      if(this.enemy_x > player_x && this.enemyHealth > 0){
        this.enemy_x -= this.enemySpeed;
        this.enemyDirection = 0;  
      }
      if(this.enemy_x < player_x && this.enemyHealth > 0){
        this.enemy_x += this.enemySpeed;
        this.enemyDirection = 1;
      }
    }
  }
}  
function drawEnemies(){      // draws the enemies;
  for(var i in enemies){
    var enemy = enemies[i];
    var enemyScale = enemy.enemyScale;
    var enemy_x = enemy.enemy_x;
    var enemy_y = enemy.enemy_y;
    var enemySpeed = enemy.enemySpeed;
    var enemyHealth = enemy.enemyHealth;
    var enemyDirection = enemy.enemyDirection;
    var enemyAnimation = enemy.enemyAnimation;
    var type = enemy.enemyType;
    ctx.save()
    ctx.translate(enemy_x, enemy_y);
    ctx.scale(enemyScale, enemyScale);  
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(0,0);               //Body
    ctx.lineTo(0,-50);
    ctx.stroke();    
    switch(enemyAnimation){                     // NOTE: The different cases only affect the animation and each are only varied by different x and y coordinates!!
      case 0:
      case 1:
      default:
        if(enemyDirection == 0){                          // 0 = left
          ctx.moveTo(-28,-17);
          ctx.lineTo(0,-40);
          ctx.stroke();
        }                                           // 1 = right
        if(enemyDirection == 1){
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+28,-17);
          ctx.stroke();                                  // 2 = up
        }                                           // 3 = down
        if(enemyDirection == 2 || enemyDirection == 3){
          ctx.moveTo(-28,-17);        //Left arm
          ctx.lineTo(0,-40);
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+28,-17);
          ctx.stroke();    
        }        
        ctx.moveTo(0,0);               //Left Leg                                //X=400
        ctx.lineTo(0,+30);                                                   //Y=250
        ctx.moveTo(0,0);               //Right leg
        ctx.lineTo(0,+30);
        ctx.stroke();      
        break;
      case 2:
      case 3:
      case 14:
      case 15:
        if(enemyDirection == 0){                          // 0 = left
          ctx.moveTo(-31,-23);
          ctx.lineTo(0,-40);
          ctx.stroke();
        }                                           // 1 = right
        if(enemyDirection == 1){
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+31,-23);
          ctx.stroke();                                  // 2 = up
        }                                           // 3 = down
        if(enemyDirection == 2 || enemyDirection == 3){
          ctx.moveTo(-31,-23);        //Left arm
          ctx.lineTo(0,-40);
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+31,-23);
          ctx.stroke();    
        }
        ctx.moveTo(0,0);               //Left Leg                                //X=400
        ctx.lineTo(-5,+30);                                                   //Y=250
        ctx.moveTo(0,0);               //Right leg
        ctx.lineTo(+5,+30);
        ctx.stroke();      
        break;
      case 4:
      case 5:
      case 12:
      case 13:
        if(enemyDirection == 0){                          // 0 = left
          ctx.moveTo(-35,-29);
          ctx.lineTo(0,-40);
          ctx.stroke();
        }                                           // 1 = right
        if(enemyDirection == 1){
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+35,-29);
          ctx.stroke();                                  // 2 = up
        }                                           // 3 = down
        if(enemyDirection == 2 || enemyDirection == 3){
          ctx.moveTo(-35,-29);        //Left arm
          ctx.lineTo(0,-40);
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+35,-29);
          ctx.stroke();    
        }
        ctx.moveTo(0,0);               //Left Leg                                //X=400
        ctx.lineTo(-10,+30);                                                   //Y=250
        ctx.moveTo(0,0);               //Right leg
        ctx.lineTo(+10,+30);
        ctx.stroke();      
        break;
      case 6:
      case 7:
      case 10:
      case 11:
        if(enemyDirection == 0){                          // 0 = left
          ctx.moveTo(-30,-35);
          ctx.lineTo(0,-40);
          ctx.stroke();
        }                                           // 1 = right
        if(enemyDirection == 1){
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+30,-35);
          ctx.stroke();                                  // 2 = up
        }                                           // 3 = down
        if(enemyDirection == 2 || enemyDirection == 3){
          ctx.moveTo(-30,-35);        //Left arm
          ctx.lineTo(0,-40);
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+30,-35);
          ctx.stroke();    
        }
        ctx.moveTo(0,0);               //Left Leg                                //X=400
        ctx.lineTo(-15,+30);                                                   //Y=250
        ctx.moveTo(0,0);               //Right leg
        ctx.lineTo(+15,+30);
        ctx.stroke();      
        break;
      case 8:
      case 9:
        if(enemyDirection == 0){                          // 0 = left
          ctx.moveTo(-35,-40);
          ctx.lineTo(0,-40);
          ctx.stroke();
        }                                           // 1 = right
        if(enemyDirection == 1){
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+35,-40);
          ctx.stroke();                                  // 2 = up
        }                                           // 3 = down
        if(enemyDirection == 2 || enemyDirection == 3){
          ctx.moveTo(-35,-32);        //Left arm
          ctx.lineTo(0,-40);
          ctx.moveTo(0,-40);           //Right arm
          ctx.lineTo(+35,-32);
          ctx.stroke();    
        }
        ctx.moveTo(0,0);               //Left Leg                                //X=400
        ctx.lineTo(-20,+30);                                                   //Y=250
        ctx.moveTo(0,0);               //Right leg
        ctx.lineTo(+20,+30);
        ctx.stroke();      
        break;                                                 
    }
    switch(enemyDirection){
      case 0:
        ctx.beginPath();
        ctx.arc(0,-75,25,0,2*Math.PI);   //Head
        if(type == 1){
          ctx.fillStyle = "#FF0000";
        }
        if(type == 2){
          ctx.fillStyle = "#FFFF00";
        }
        if(type == 3){
          ctx.fillStyle = "#00FF00";
        }
        if(type == 4){
          ctx.fillStyle = "#005555";
        }
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-10,-80,3,0,2*Math.PI);    //Left eye
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.beginPath();
        ctx.closePath();
        ctx.moveTo(-15,-65);               //Mouth
        ctx.lineTo(-5,-65);               //Needs to be down here or else it'll go behind the head
        ctx.stroke();
        break;    
      case 1:
        ctx.beginPath();
        ctx.arc(0,-75,25,0,2*Math.PI);   //Head
        if(type == 1){
          ctx.fillStyle = "#FF0000";
        }
        if(type == 2){
          ctx.fillStyle = "#FFFF00";
        }
        if(type == 3){
          ctx.fillStyle = "#00FF00";
        }
        if(type == 4){
          ctx.fillStyle = "#005555";
        }
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(+12,-80,3,0,2*Math.PI);    //Right eye
        ctx.fill();
        ctx.beginPath();
        ctx.closePath();      
        ctx.moveTo(+5,-65);               //Mouth
        ctx.lineTo(+15,-65);               //Needs to be down here or else it'll go behind the head
        ctx.stroke();
        break;                                           
    }
    ctx.restore(); 
    enemy.update();     // and here we call the update for the enemies
  }
}