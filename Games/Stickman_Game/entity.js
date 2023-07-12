function enemyList(type,spawn_y, patrol_start, patrol_end, passive){
  this.enemyDirection = 0;    // this is the constructor function for all the enemies
  this.enemyAnimation = 1;
  this.enemyScale = 0.5;
  this.enemy_y = spawn_y;
  this.enemy_x = canvas.width-50;
  this.jumpStart = 0;
  this.enemyJumpHeight = 50;
  this.enemyJumpCheck = 0;
  this.enemyFalling = 0;
  this.enemyOnsomething = 0;
  this.enemyType = type;
  this.enemySpeed = 1;
  this.enemyHealth = 1;
  this.enemyFlying = 0;
  this.enemyPassive = false;
  if(passive){
    this.enemyPassive = true;  // makes the enemy to not do anything
  }
  if(type == 1 || type=="fast"){
    this.enemyLeft = 12;
    this.enemyRight = 12;
    this.enemyTop = 50;
    this.enemyBottom = 15;
    this.enemyHealth = 5;
    this.enemySpeed = 2;
    this.enemyType = 1;
  }
  if(type == 2 || type=="slow"){
    this.enemyLeft = 12;
    this.enemyRight = 12;
    this.enemyTop = 50;
    this.enemyBottom = 15;
    this.enemyHealth = 8;
    this.enemySpeed = 1;
    this.enemyType = 2;
  }
  if(type == 3 || type=="jumpy"){
    this.enemyLeft = 12;
    this.enemyRight = 12;
    this.enemyTop = 50;
    this.enemyBottom = 15;
    this.enemyHealth = 5;
    this.enemySpeed = 3;
    this.enemyType = 3;
  }
  if(type == 4 || type=="flying"){
    this.enemyLeft = 12;
    this.enemyRight = 12;
    this.enemyTop = 50;
    this.enemyBottom = 15;
    this.enemyHealth = 6;
    this.enemySpeed = 5;
    this.enemyFlying = 1;
    this.enemyType = 4;
  }
  if(patrol_start){
    this.enemy_x = patrol_start;
  }
  if(patrol_end){
    this.patrol = 1;
    this.patrol_start = patrol_start;
    this.patrol_end = patrol_end; 
  }
}