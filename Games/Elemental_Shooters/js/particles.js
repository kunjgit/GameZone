var minX = minY = maxX = maxY = 0, lastOverlapping, node;

/**
* @constructor
*/
function Particles(x,y,angle, size, i, type, camera, color) {
  this.x = this.y = this.size = this.angle = 0;

  this.next = {
    x: this.x,
    y: this.y
  };
  this.speed = 8;
  this.init(x, y, angle, size);
  this.overlaping = [];
  this.dead = false;
  this.free = true;
  this.ID = i;
  this.type = type;
  this.camera = camera || true;
  this.color = color;

};

Particles.prototype.init = function(x,y,angle, size, speed, type, camera, nodeID, color) {

  this.x = x;
  this.y = y;
  this.next.x = this.x;
  this.next.y = this.y;
  this.size = size || 8;
  this.angle = angle;
  this.free = false;
  this.type = type;
  this.camera = camera;
  this.nodeID = nodeID;
  this.speed = speed;
  this.color = color;

  if(Game.weapons[Game.player.currentWeapon].speedVariation && type === 'bullet'){
    this.speed = randomChoice(Game.weapons[Game.player.currentWeapon].speedVariation);
  }

  if(Game.weapons[Game.player.currentWeapon].angleVariationMin && Game.weapons[Game.player.currentWeapon].angleVariationMax && type === 'bullet'){
    this.angle = angleCalc( Game.player.x - (Game.currentMap.camera.x), Game.player.y - (Game.currentMap.camera.y), random((Game.mouse.x - 8) + Game.weapons[Game.player.currentWeapon].angleVariationMin, (Game.mouse.x - 8) + Game.weapons[Game.player.currentWeapon].angleVariationMax), random((Game.mouse.y - 8) + Game.weapons[Game.player.currentWeapon].angleVariationMin, (Game.mouse.y - 8) + Game.weapons[Game.player.currentWeapon].angleVariationMax))
  }

};

Particles.prototype.checkCollision = function() {

    minX = (this.next.x / Game.tileSize) >> 0;
    maxX = (this.next.x + this.size) / Game.tileSize >> 0;
    minY = (this.next.y / Game.tileSize) >> 0;
    maxY = (this.next.y + this.size) / Game.tileSize >> 0;

    for (h = minY; h <= maxY && h >= 0; h++) {

      for (w = minX; w <= maxX && w >= 0; w++) {

        node = Game.currentMap.map[Game.currentMap.cols * h + w];

        if(lastOverlapping !== node.i){

          if(this.intercects(node) && node.solid){

            if(node.type === 'enemy'){

              node[node.type]();

            }

            Game.audio.play('damageWall');

            this.dead = true;
          }

          lastOverlapping = node.i;
        }

      }
    }

};

Particles.prototype['bullet'] = function() {

  if(this.dead) return false;

    this.next.x += Math.cos((Math.PI * 2) + (this.angle) ) * this.speed;
    this.next.y += Math.sin((Math.PI * 2) + (this.angle) ) * this.speed;

    this.checkCollision();

    this.x = this.next.x;
    this.y = this.next.y;

};

Particles.prototype['enemyBullet'] = function() {

  if(this.dead) return false;

  this.next.x += Math.cos((Math.PI * 2) + (this.angle) ) * this.speed;
  this.next.y += Math.sin((Math.PI * 2) + (this.angle) ) * this.speed;

  minX = (this.next.x / Game.tileSize) >> 0;
  maxX = (this.next.x + this.size) / Game.tileSize >> 0;
  minY = (this.next.y / Game.tileSize) >> 0;
  maxY = (this.next.y + this.size) / Game.tileSize >> 0;

  for (h = minY; h <= maxY && h >= 0; h++) {
    for (w = minX; w <= maxX && w >= 0; w++) {

      node = Game.currentMap.map[Game.currentMap.cols * h + w];

      if(this.intercects(node) && node.solid && node.i !== this.nodeID){

        Game.audio.play('damageWall');
        this.dead = true;

        return false;
      }

    }
  }

  if(Game.player.intercectsBullet(this)){

    Game.player.gunForce.x += Math.cos((Math.PI * 2) + this.angle) * 4;
    Game.player.gunForce.y += Math.sin((Math.PI * 2) + this.angle) * 4;

    Game.currentMap.cameraShake.y += random(-14, 14);
    Game.currentMap.cameraShake.x += random(-14, 14);

    Game.player.health -= Game.weapons[Game.currentMap.map[this.nodeID].weapon].damage / 2;
    Game.audio.play('damage');
    this.dead = true;

    return false;
  }

  this.x = this.next.x;
  this.y = this.next.y;

};

Particles.prototype['orb'] = function() {

  if(this.dead) return false;

    this.x += (Game.player.x - this.x) * 0.1;
    this.y += (Game.player.y - this.y) * 0.1;

    if(Game.player.intercectsBullet(this)){
      Game.player.health += this.size / 2;
      Game.audio.play('orb');
      this.dead = true;
    }

};

Particles.prototype.intercects = function(obj){
  if(obj){

    if((obj.x * Game.tileSize) < this.next.x + this.size && (obj.y * Game.tileSize) < this.next.y + this.size &&
       (obj.x * Game.tileSize) + Game.tileSize > this.next.x && (obj.y * Game.tileSize) + Game.tileSize > this.next.y ){

      return true;
    }
  }
  return false;
};

Particles.prototype.draw = function() {

  if(this.dead) return false;

  Game.c1ctx.fillStyle = this.color;
  if(this.camera){
    Game.c1ctx.fillRect(this.x - (Game.currentMap.camera.x + Game.currentMap.cameraShake.x), this.y - (Game.currentMap.camera.y + Game.currentMap.cameraShake.y), this.size, this.size);
  } else {
    Game.c1ctx.fillRect((this.x) + Game.currentMap.cameraShake.x, (this.y) + Game.currentMap.cameraShake.y, this.size, this.size);
  }

};

Particles.prototype.isDead = function() {
  return this.dead;
};

Game.Particles = Particles;
