import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyController {
  enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];
  enemyRows = [];

  currentDirection = MovingDirection.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1;
  defaultYVelocity = 1;
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;
  fireBulletDefault = 100;
  fireBulletTimer = this.fireBulletDefault;

  constructor(canvas,enemyBullet,playerBullet) {
    this.canvas = canvas;
    this.enemyBullet=enemyBullet;
    this.playerBullet = playerBullet;
    this.enemyDeathsound = new Audio ("sounds/enemy-death.wav");
    this.enemyDeathsound.volume = .2;
    this.createEnemies();
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection(){
    this.enemyRows.forEach(enemyRow=>{
      enemyRow.forEach((enemy,enemyIndex)=>{
        if(this.playerBullet.collideWith(enemy)){
          this.enemyDeathsound.currentTime =0;
          this.enemyDeathsound.play();
          enemyRow.splice(enemyIndex,1)
        }
      })
    })

    this.enemyRows = this.enemyRows.filter(enemyRow=> enemyRow.length>0)
  }

  fireBullet(){
    this.fireBulletTimer--;
    if(this.fireBulletTimer<=0)
    {
      this.fireBulletTimer = this.fireBulletDefault;
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length)
      const enemy = allEnemies[enemyIndex];
      this.enemyBullet.shoot(enemy.x+enemy.width/2,enemy.y,-3);
      
    }
  }
  
  resetMoveDownTimer(){
    if(this.moveDownTimer <=0)
    {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer(){
    if(this.currentDirection === MovingDirection.downLeft || this.currentDirection === MovingDirection.downRight)
    {
       this.moveDownTimer--;
    }
  }
  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection === MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if(rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
    }
  }
  else if (this.currentDirection === MovingDirection.downLeft) {
      if(this.MoveDown(MovingDirection.left)){
        break;
      }
    }
    else if(this.currentDirection === MovingDirection.left){
      this.xVelocity = -this.defaultXVelocity;
      this.yVelocity = 0;
      const leftMostEnemy = enemyRow[0];
      if(leftMostEnemy.x <=0)
      {
        this.currentDirection = MovingDirection.downRight;
        break;
      }
    }
    else if(this.currentDirection === MovingDirection.downRight)
    {
      if(this.MoveDown(MovingDirection.right)){
        break;
    }
  }
}
}

  MoveDown(newDirection) {
    this.xVelocity = 0;
      this.yVelocity = this.defaultYVelocity;
      if(this.moveDownTimer <= 0){
        this.currentDirection = newDirection;
        return true;
  }
  return false;
  }

  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

 

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNubmer, enemyIndex) => {
        if (enemyNubmer > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(enemyIndex * 50, rowIndex * 35, enemyNubmer)
          );
        }
      });
    });
  }

  collideWith(sprite){
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }

}
