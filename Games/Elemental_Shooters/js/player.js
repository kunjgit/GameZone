var x = y = minX = minY = maxX = maxY = 0, lastOverlapping, node;

 /**
 * @constructor
 */
Game.Player = function(x,y) {

  this.size = 16;
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.speed = 0.8;
  this.maxSpeed = 20;
  this.overlaping = [];
  this.nextX = this.x;
  this.nextY = this.y;
  this.colliding = [];
  this.health = 10;
  this.currentWeapon = 'pistol';
  this.gunForce = {
    x: 0,
    y: 0
  }

};

Game.Player.prototype.setNewWeapon = function (weapons) {

  var weapon = randomChoice(weapons),
  index = weapons.indexOf(weapon) + 1;

  if(index > weapons.length - 1){
    index = 0;
  }

  if(this.currentWeapon === weapon){

    weapon = weapons[index];

  }

  this.currentWeapon = weapon;

}



Game.Player.prototype.update = function() {

  this.vy *= 0.72;
  this.vx *= 0.72;

  this.x = this.nextX;
  this.y = this.nextY;

  this.previousy = this.y;
  this.previousx = this.x;

  if(Game.key.up && this.vy > -this.maxSpeed){
    this.vy -= this.speed;
  }

  if(Game.key.down && this.vy < this.maxSpeed){
    this.vy += this.speed;
  }

  if(Game.key.right && this.vx < this.maxSpeed){
    this.vx += this.speed;
  }

  if(Game.key.left && this.vx > -this.maxSpeed){
    this.vx -= this.speed;
  }

  if(Game.weapons[Game.player.currentWeapon].smoothForce){
    this.vx += this.gunForce.x;
    this.vy += this.gunForce.y;
  } else {
    this.nextX += this.gunForce.x;
    this.nextY += this.gunForce.y;
  }

  this.nextX += this.vx;
  this.nextY += this.vy;


  // while (this.overlaping.length > 0) {
  //   this.overlaping.pop();
  // }

  // this.addOverlaping(Game.currentMap.map[Game.currentMap.cols * Math.floor((this.nextY) / Game.tileSize) + Math.floor((this.nextX) / Game.tileSize)]);
  // this.addOverlaping(Game.currentMap.map[Game.currentMap.cols * Math.floor((this.nextY + this.size) / Game.tileSize) + Math.floor((this.nextX + this.size) / Game.tileSize)]);
  // this.addOverlaping(Game.currentMap.map[Game.currentMap.cols * Math.floor((this.nextY + this.size) / Game.tileSize) + Math.floor((this.nextX) / Game.tileSize)]);
  // this.addOverlaping(Game.currentMap.map[Game.currentMap.cols * Math.floor((this.nextY) / Game.tileSize) + Math.floor((this.nextX + this.size) / Game.tileSize)]);

  minX = Math.floor((this.nextX) / Game.tileSize);
  maxX = Math.floor((this.nextX + this.size) / Game.tileSize);
  minY = Math.floor((this.nextY) / Game.tileSize);
  maxY = Math.floor((this.nextY + this.size) / Game.tileSize);

  for (h = minY; h <= maxY; h++) {
    for (w = minX; w <= maxX; w++) {
      node = Game.currentMap.map[Game.currentMap.cols * h + w];

        if(this.intercects(node) && node.solid){
        //COLLISION DETECTION DEBUG
        //this.collidaing.push(node);

        if(node.edges.indexOf('r') > -1 && this.intercectsRight( node ) ){

          x = Math.floor(this.nextX);

          while(!this.intercectsRight(node, x)){

            x++;

          }

          this.nextX = x;
          this.vx = 0;

        }

        if(node.edges.indexOf('t') > -1 && this.intecectsTop(node)){

          y = Math.floor(this.nextY);

          while(!this.intecectsTop(node, y)){
            y--;
          }

          this.nextY = y;
          this.vy = 0;

        }

        if(node.edges.indexOf('b') > -1 && this.intercectsBottom(node)){

          y = Math.floor(this.nextY);

          while(!this.intercectsBottom(node, y)){
            y++;
          }

          this.nextY = y;
          this.vy = 0;

        }

        if ( node.edges.indexOf('l') > -1 && this.intercectsLeft( node ) ){

          x = Math.floor(this.nextX);

          while(!this.intercectsLeft(node, x)){

            x--;

          }

          this.nextX = x;
          this.vx = 0;

        }

      } else if(node.type === 'p'){

        this.setNewWeapon(Game.mapsConfig[Game.mode][Game.mapsCountConfig].dropWeapons);
        node.setModelType(34 + (60 * Game.currentMap.type), 'w');
        Game.audio.play('powerup');

      } else if(node.type === 't' && Game.currentMap.enemies === 0){

        if(distance(this.x + (this.size / 2), this.y + (this.size / 2), (node.x * Game.tileSize) + (Game.tileSize / 2 ), (node.y * Game.tileSize) + (Game.tileSize / 2))<=10){

          Game.currentMap.nextMap();
          Game.audio.play('teleport');

        }

      } else if(node.type !== 'pz' && Game.peacefulZone){

        if(distance(this.x + (this.size / 2), this.y + (this.size / 2), (node.x * Game.tileSize) + (Game.tileSize / 2 ), (node.y * Game.tileSize) + (Game.tileSize / 2))<=16){

          Game.peacefulZone = false;

          Game.currentMap.room((Game.currentMap.playerPosition.x / Game.tileSize >> 0) - 2, (Game.currentMap.playerPosition.y / Game.tileSize >> 0) - 2, (Game.currentMap.playerPosition.x / Game.tileSize >> 0) + 2, (Game.currentMap.playerPosition.y / Game.tileSize >> 0) + 2, [34 + (60 * Game.currentMap.type),34 + (60 * Game.currentMap.type),34 + (60 * Game.currentMap.type),35 + (60 * Game.currentMap.type),36 + (60 * Game.currentMap.type)], 'f');
          Game.currentMap.map[Game.currentMap.cols * (Game.currentMap.playerPosition.y / Game.tileSize >> 0) + (Game.currentMap.playerPosition.x / Game.tileSize >> 0)].setModelType(57 + (60 * Game.currentMap.type), 't');

        }

      }

    }

  }

  this.gunForce.x = 0;
  this.gunForce.y = 0;

  if(this.x - Game.currentMap.camera.x > Game.width / 2 ||
    this.x - Game.currentMap.camera.x < Game.width / 2){
    Game.currentMap.cameraPosition.x = this.x - (Game.width / 2) + (this.size / 2);
  }

  if(this.y - Game.currentMap.camera.y > Game.width / 2 ||
     this.y - Game.currentMap.camera.y < Game.width / 2 ){
    Game.currentMap.cameraPosition.y = this.y - (Game.height / 2) + (this.size / 2);
  }

};

// Game.Player.prototype.addOverlaping = function(node) {

//   if(this.overlaping.indexOf(node) === -1){
//     this.overlaping.push(node);
//   }

// };


Game.Player.prototype.intercects = function(obj){

  if(obj){

    if((obj.x * Game.tileSize) < this.nextX + this.size && (obj.y * Game.tileSize) < this.nextY + this.size &&
       (obj.x * Game.tileSize) + Game.tileSize > this.nextX && (obj.y * Game.tileSize) + Game.tileSize > this.nextY ){

      return true;
    }
  }

  return false;
};

Game.Player.prototype.intercectsBullet = function(obj){

    if(obj.x < this.nextX + this.size && obj.y < this.nextY + this.size &&
       obj.x + obj.size > this.nextX && obj.y + obj.size > this.nextY ){

      return true;
    }

  return false;
};


Game.Player.prototype.intecectsTop = function(obj, y) {
  y = y || this.y;
  if((obj.x * Game.tileSize) <= this.x + this.size &&
     (obj.x * Game.tileSize) + Game.tileSize >= this.x && (obj.y * Game.tileSize) >= y + this.size){
    return true;
  }
  return false;

};

Game.Player.prototype.intercectsRight = function(obj, x) {
  x = x || this.x;
  if((obj.x * Game.tileSize) + Game.tileSize <= x){
    return true;
  }

  return false;
};

Game.Player.prototype.intercectsLeft = function(obj, x) {
  x = x || this.x;
  if((obj.x * Game.tileSize) >= x + this.size){
    return true;
  }

  return false;

};

Game.Player.prototype.intercectsBottom = function(obj, y) {
  y = y || this.y;

  if((obj.x * Game.tileSize) + Game.tileSize >= this.x && (obj.y * Game.tileSize) + Game.tileSize <= y){
    return true;
  }

  return false;

};


Game.Player.prototype.draw = function() {

  Game.c1ctx.fillStyle = '#181818';
  Game.c1ctx.fillRect(this.x - (Game.currentMap.camera.x + Game.currentMap.cameraShake.x), this.y - (Game.currentMap.camera.y + Game.currentMap.cameraShake.y), this.size, this.size);

  //DEBUG: SHOW THE ID OF THE CURRENT TILE
  //Game.c1ctx.fillText(Game.currentMap.cols * Math.floor((this.nextY + this.size) / Game.tileSize) + Math.floor((this.nextX + this.size) / Game.tileSize), 10,10);

  //COLLSION DETECTION DEBUG
  // Game.c1ctx.fillStyle = 'rgba(24,24,24,0.5)';
  // for (var i = 0; i < this.overlaping.length; i++) {
  //   Game.c1ctx.fillRect((this.overlaping[i].x * 32) - Game.currentMap.camera.x, (this.overlaping[i].y * 32) - Game.currentMap.camera.y, 32, 32);
  // };
};