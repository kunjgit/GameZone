/* eslint-disable no-underscore-dangle */
class Player extends Component {
  constructor(
    context,
    posX,
    posY,
    width,
    height,
    color,
    horizontalLimit,
    facingDirection = 'right'
  ) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.horizontalLimit = horizontalLimit;

    this.facingDirection = facingDirection;
    this.isAttacking = false;
    this.velocityX = 0.0; //
    this.velocityY = 0.4;
  }

  drawSetup(color = this.color, direction = this.facingDirection) {
    this.c.fillStyle = color;
    this.c.fillRect(
      this.posX,
      this.posY + 10,
      this.width + 10,
      this.height - 10
    );
    this.drawFacingDirectionSetUp(direction);
    this.drawPantsSetup();
  }

  drawFacingDirectionSetUp(direction) {
    if (direction === 'right') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 22,
        this.posY + 15,
        this.width - this.width / 1.9,
        this.height - this.height / 1.2
      );
    } else if (direction === 'left') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 6,
        this.posY + 15,
        this.width - this.width / 1.9,
        this.height - this.height / 1.2
      );
    }
  }

  drawPantsSetup() {
    this.c.fillStyle = 'black';
    this.c.fillRect(this.posX, this.posY + 32, this.width + 10, 3);
    this.c.fillRect(this.posX + 22, this.posY + 35, 5, 13);
  }

  drawStanding(color = this.color, direction = this.facingDirection) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
    this.drawFacingDirection(direction);
    this.drawPants();
  }

  drawFacingDirection(facingDirection) {
    if (facingDirection === 'right') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 19,
        this.posY + 5,
        this.width - this.width / 1.7,
        this.height - this.height / 1.4
      );
    } else if (facingDirection === 'left') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 5,
        this.posY + 5,
        this.width - this.width / 1.7,
        this.height - this.height / 1.4
      );
    }
  }

  drawPants() {
    this.c.fillStyle = 'black';
    this.c.fillRect(this.posX, this.posY + 32, this.width, 3);
    this.c.fillRect(this.posX + 18, this.posY + 35, 5, 13);
  }

  drawKicking(color = this.color, direction = this.facingDirection) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.height + 5, this.width - 5);
    this.drawFacingDirectionKicking(direction);
    this.drawPantsKicking(direction);
    // this.drawPants();
  }

  drawFacingDirectionKicking(facingDirection) {
    if (facingDirection === 'right') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 10,
        this.posY + 20,
        this.width - this.width / 1.05,
        this.height - this.height / 1.4
      );
    } else {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 40,
        this.posY + 20,
        this.width - this.width / 1.05,
        this.height - this.height / 1.4
      );
    }
  }

  drawPantsKicking(facingDirection) {
    if (facingDirection === 'right') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 30,
        this.posY,
        this.width - this.width / 1.07,
        this.height - this.height / 3.8
      );
      this.c.fillRect(
        this.posX + 30,
        this.posY + 16.5,
        this.height / 2.1,
        this.width - this.width / 1.07
      );
    } else {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 20,
        this.posY,
        this.width - this.width / 1.07,
        this.height - this.height / 3.8
      );
      this.c.fillRect(
        this.posX,
        this.posY + 16.5,
        this.height / 2.1,
        this.width - this.width / 1.07
      );
    }
  }

  drawDead(color = this.color, direction = this.facingDirection) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
    this.drawDeadFace();
    this.drawPantsDead();
  }

  drawDeadFace() {
    this.c.strokeStyle = 'black';
    this.c.lineWidth = 4;
    this.c.beginPath();
    this.c.moveTo(this.posX+5, this.posY+30);
    this.c.lineTo(this.posX+15, this.posY+40);
    this.c.stroke();

    this.c.beginPath();
    this.c.moveTo(this.posX+15, this.posY+30);
    this.c.lineTo(this.posX+5, this.posY+40);
    this.c.stroke();

    this.c.beginPath();
    this.c.moveTo(this.posX+25, this.posY+30);
    this.c.lineTo(this.posX+35, this.posY+40);
    this.c.stroke();  

    this.c.beginPath();
    this.c.moveTo(this.posX+35, this.posY+30);
    this.c.lineTo(this.posX+25, this.posY+40);
    this.c.stroke();
  }

  drawPantsDead() {
    this.c.fillStyle = 'black';
    this.c.fillRect(this.posX, this.posY + 15, this.width, 3);
    this.c.fillRect(this.posX + 18, this.posY, 5, 18);
  }

  // *** PLAYER MOVEMENT ***
  // TODO: use velocityX. fix leftover velocityX.
  goLeft(deltaValue) {
    this.facingDirection = 'left';
    if (this.posX <= 0) return;
    // this.velocityX -= 0.02;
    // this.posX += this.velocityX * deltaValue;
    this.posX -= 4;
  }

  goRight(deltaValue) {
    this.facingDirection = 'right';
    if (this.posX >= this.horizontalLimit - this.width - 5) return;
    this.posX += 4;
  }

  DROPKICK(deltaValue) {
    if (this.facingDirection === 'right') {
      if (this.posX >= this.horizontalLimit - this.width - 5) return;
      this.posX += 0.25 * deltaValue;
    } else if (this.facingDirection === 'left') {
      if (this.posX <= 0) return;
      this.posX -= 0.25 * deltaValue;
    }
  }

  StopDropKick(deltaValue) {
    if (this.facingDirection === 'right') {
      if (this.posX >= this.horizontalLimit - this.width - 5) return;
      this.posX += 0.05 * deltaValue;
    } else if (this.facingDirection === 'left') {
      if (this.posX <= 0) return;
      this.posX -= 0.05 * deltaValue;
    }
  }

  goLeftWhileJumping(deltaValue) {
    this.facingDirection = 'left';
    if (this.posX <= 0) return;
    // this.velocityX -= 0.02;
    // this.posX += this.velocityX * deltaValue;
    this.posX -= 6.5;
  }

  goRightWhileJumping(deltaValue) {
    this.facingDirection = 'right';
    if (this.posX >= this.horizontalLimit - 5) return;
    // this.velocityX += 0.02;
    // this.posX += this.velocityX * deltaValue;
    this.posX += 6.5;
  }

  fall(deltaValue) {
    this.velocityY = 0.4;
    this.posY += this.velocityY * deltaValue;
  }

  jump(deltaValue) {
    this.velocityY = -0.85;
    this.posY += this.velocityY * deltaValue;
  }

  // *** PLAYER HITBOX ***
  _isRightCompBorderCollided(enemy) {
    return this._rightCompHb() >= enemy._leftCompHb();
  }

  _isLeftCompBorderCollided(enemy) {
    return this._leftCompHb() <= enemy._rightCompHb();
  }

  _isTopCompBorderCollided(enemy) {
    return this._topCompHb() <= enemy._botCompHb();
  }

  _isBottomCompBorderCollided(enemy) {
    return this._botCompHb() >= enemy._topCompHb();
  }

  isHitTaken(enemy) {
    return (
      this._isRightCompBorderCollided(enemy) &&
      this._isLeftCompBorderCollided(enemy) &&
      this._isTopCompBorderCollided(enemy) &&
      this._isBottomCompBorderCollided(enemy)
    );
  }

  // *** ATTACK STATE ***
  startAttack() {
    this.isAttacking = true;
  }

  stopAttack() {
    this.isAttacking = false;
  }

  // *** ATTACK HITBOX ***
  drawAttackHitbox() {
    this.c.fillStyle = 'transparent';
    if (this.facingDirection === 'right') {
      this.c.fillRect(
        this.posX + 40,
        this.posY - 1,
        this.width / 2.3,
        this.height - 11
      );
    } else {
      this.c.fillRect(
        this.posX - 4,
        this.posY - 1,
        this.width / 2.3,
        this.height - 11
      );
    }
  }

  _leftAttackHb() {
    if (this.facingDirection === 'right') {
      return this.posX + 10;
    }
    return this.posX - 10;
  }

  _rightAttackHb() {
    if (this.facingDirection === 'right') {
      return this.posX + 10 + this.width;
    }
    return this.posX - 10 + this.width;
  }

  _topAttackHb() {
    return this.posY - 3;
  }

  _botAttackHb() {
    return this.posY - 3 + this.height - 5;
  }

  _isRightAttackBorderCollided(enemy) {
    return this._rightAttackHb() >= enemy._leftCompHb();
  }

  _isLeftAttackBorderCollided(enemy) {
    return this._leftAttackHb() <= enemy._rightCompHb();
  }

  _isTopAttackBorderCollided(enemy) {
    return this._topAttackHb() <= enemy._botCompHb();
  }

  _isBottomAttackBorderCollided(enemy) {
    return this._botAttackHb() >= enemy._topCompHb();
  }

  isHitGiven(enemy) {
    return (
      this._isRightAttackBorderCollided(enemy) &&
      this._isLeftAttackBorderCollided(enemy) &&
      this._isTopAttackBorderCollided(enemy) &&
      this._isBottomAttackBorderCollided(enemy)
    );
  }
}
