var w = 0, h = 0, i = 0, spriteCoords = {x: 0, y: 0};

var types = [];
types[11] = 'w'; //walls
types[48] = 'e'; //enemies
types[56] = 'pz'; //peace zone
types[57] = 't'; //teleport
types[34] = 'f'; //floor
types[58] = 'p'; //powerup

var type = [];
type['w'] = {
  typeString: 'w',
  defaultIndex: 11,
  rules: []
};
type['f'] =  {
  typeString: 'f',
  defaultIndex: [34, 34, 34, 35, 36],
  rules: []
};
type['e'] = {
  typeString: 'e',
  defaultIndex: 48,
  rules: []
};
type['pz'] = {
  typeString: 'pz',
  defaultIndex: 56,
  rules: []
};
type['t'] = {
  typeString: 't',
  defaultIndex: 57,
  rules: []
};
type['p'] = {
  typeString: 'p',
  defaultIndex: 58,
  rules: []
};

function pushRules(i, r){
  type['w'].rules.push({tileIndex: i, map: r});
};
function pushRulesF(i, r){
  type['f'].rules.push({tileIndex: i, map: r});
};

//this is for save some bytes
pushRules(3, {e: '!w', w: '!w', s: '!w', n: '!w'});
pushRules(7, {n: 'w', ne: 'w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w', nw: 'w' });
pushRules(4, {n: '!w', e: 'w', se: '!w', s: 'w', w: '!w'});
pushRules(9, {n: 'w', ne: 'w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
pushRules(11,  {n: 'w', ne: 'w', e: 'w', se: 'w', s: 'w', sw: 'w', w: 'w', nw: 'w' });
pushRules(2, {n: '!w', e: '!w',s: 'w', w: 'w', sw: 'w' });
pushRules(0, {w: '!w', n: '!w', e: 'w', s: 'w', se: 'w'});
pushRules(27, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', sw: 'w', w: 'w', nw: 'w' });
pushRules(29, {n: 'w', ne: 'w', e: 'w', se: 'w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(28, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(38, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(1, {n: '!w', e: 'w', se:'w', s:'w', sw: 'w', w: 'w'});
pushRules(8, {n: 'w', ne: 'w', e: 'w', se: '!w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
pushRules(5, {n: '!w', e: 'w', se: '!w', s: 'w',sw: '!w', w: 'w'});
pushRules(6, {n: '!w', e: '!w', s: 'w', sw: '!w', w: 'w'});
pushRules(39, {n: 'w', ne: 'w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w', nw: '!w' });
pushRules(10, {n: 'w', ne: 'w', e: 'w',s: 'w', se: 'w', w: '!w'});
pushRules(12, {w: 'w', s: 'w', sw: 'w', n: 'w', nw: 'w', e: '!w'});
pushRules(13, {n: '!w', e: '!w',s: 'w', w: '!w' });
pushRules(37, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w', nw: 'w' });
pushRules(14, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', w: '!w' });
pushRules(16, {n: 'w', e: '!w',s: 'w', sw:'!w', w: 'w', nw: '!w' });
pushRules(17, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w', nw: 'w' });
pushRules(18, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', sw: '!w', w: 'w', nw: '!w' });
pushRules(19, {n: 'w', ne: 'w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w', nw: '!w' });
pushRules(20, {n: 'w', ne: 'w', e: 'w', s: '!w', w: '!w'});
pushRules(21, {n: 'w', ne: 'w', e: 'w', s: '!w', w: 'w', nw: 'w'});
pushRules(22, {n: 'w', e: '!w',s: '!w', w: 'w', nw: 'w'});
pushRules(23, {n: 'w', e: '!w',s: 'w', w: '!w' });
pushRules(24, {n: 'w', ne:'!w', e: 'w', s: '!w', w: '!w' });
pushRules(25, {n: 'w', ne: '!w', e: 'w', s: '!w', w: 'w', nw: '!w' });
pushRules(26, {n: 'w', e: '!w', s: '!w', w: 'w', nw: '!w' });
pushRules(30, {n: '!w', e: 'w',s: '!w', w: '!w' });
pushRules(31, {n: '!w', e: 'w',s: '!w', w: 'w' });
pushRules(32, {n: '!w', e: '!w',s: '!w', w: 'w' });
pushRules(33, {n: 'w', e: '!w',s: '!w', w: '!w' });
pushRules(40, {n: '!w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w'});
pushRules(41, {n: 'w', e: '!w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
//pushRules(41, {n: 'w', ne: 'w', e: '!w', se: '!w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
pushRules(42, {n: 'w', ne: 'w', e: 'w', se: '!w', s: 'w', w: '!w'});
pushRules(43, {n: '!w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w'});
pushRules(44, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
pushRules(45, {n: 'w', ne: 'w', e: 'w', se: '!w', s: 'w', sw: '!w', w: 'w', nw: '!w' });
pushRules(46, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w', nw: 'w' });
pushRules(47, {n: 'w', ne: 'w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(50, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', w: '!w'});
pushRules(51, {n: 'w', ne: 'w', e: 'w', s: '!w', w: 'w', nw: '!w' });
pushRules(52, {n: 'w', ne: '!w', e: 'w', s: '!w', w: 'w', nw: 'w' });
pushRules(53, {n: 'w', e: '!w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(54, {n: 'w', ne: '!w', e: 'w', se: '!w', s: 'w', sw: 'w', w: 'w', nw: '!w' });
pushRules(55, {n: 'w', ne: '!w', e: 'w', se: 'w', s: 'w', sw: '!w', w: 'w', nw: '!w' });

/**
 * @constructor
 */
function MapNode(x,y,i) {

  this.adjacents = [];
  this.edges = [];

  this.init(x, y, i);

};

MapNode.prototype.init = function(x, y, i) {

  this.solid = null;
  this.setModelType( randomChoice( [34, 34, 11] ) );
  this.x = x;
  this.y = y;
  this.i = i;
  this.adjacents.length = 0;
  this.edges.length = 0;
  this.previous = null;

};

MapNode.prototype.setType = function(type) {

  this.typeID = type;
  if(type === 48 || type === 108 || type === 168 || type === 228){
    this.type = 'enemy';
    this.health = Game.mapsConfig[Game.mode][Game.mapsCountConfig].enemyHealth;
    this.weapon = randomChoice(Game.mapsConfig[Game.mode][Game.mapsCountConfig].enemyWeapons);
  }

  this.solid = Game.solidTiles.indexOf(type) > -1;
};

MapNode.prototype['enemy'] = function() {

  this.health-=Game.weapons[Game.player.currentWeapon].damage;
  Game.audio.play('damage');
  Game.currentMap.cameraShake.y += randomChoice([-Game.weapons[Game.player.currentWeapon].force / 2, Game.weapons[Game.player.currentWeapon].force /2 ]);
  Game.currentMap.cameraShake.x += randomChoice([-Game.weapons[Game.player.currentWeapon].force / 2, Game.weapons[Game.player.currentWeapon].force /2 ]);

  if(this.health <= 0){

    this.typeID = 3 + (60 * Game.currentMap.type);
    this.type = 'w';
    Game.currentMap.enemies--;
    Game.enemiesKilled++;

    if(randomChoice([true, false, false, false])){
      this.setModelType(58 + (60 * Game.currentMap.type), 'p')
    }

    if(randomChoice(Game.mapsConfig[Game.mode][Game.mapsCountConfig].dropProbability)){

      Game.particlePool.get(((this.x * Game.tileSize) + (Game.tileSize / 2)), ((this.y * Game.tileSize) + (Game.tileSize / 2)), 4.2, randomChoice([4,4,6,6,10]), 8, 'orb', true, null, 'hsl(120, 10%, 30%)');

    }

    Game.minimapCtx.fillStyle = 'rgba(18,18,18, 0.6)';
    Game.minimapCtx.clearRect(this.x * 3, this.y  * 3, 3, 3);
    Game.minimapCtx.fillRect(this.x * 3, this.y  * 3, 3, 3);

    Game.currentMap.cameraShake.y += randomChoice([-Game.weapons[Game.player.currentWeapon].force, Game.weapons[Game.player.currentWeapon].force ]);
    Game.currentMap.cameraShake.x += randomChoice([-Game.weapons[Game.player.currentWeapon].force, Game.weapons[Game.player.currentWeapon].force ]);

  }

};

MapNode.prototype['enemyUpdate'] = function() {

  var angle;

  if(Game.tick%Game.weapons[this.weapon].timeBetween == 0 && randomChoice([true, false]) && !Game.peacefulZone){
    for (i = 0; i < Game.weapons[this.weapon].quantity; i++) {
      angle = angleCalc(
        (this.x * Game.tileSize) + (Game.tileSize / 4) - (Game.currentMap.camera.x),
        (this.y * Game.tileSize) + (Game.tileSize / 4) - (Game.currentMap.camera.y),
        random((Game.player.x - (Game.currentMap.camera.x + Game.currentMap.cameraShake.x)) + Game.weapons[this.weapon].angleVariationMin, (Game.player.x - (Game.currentMap.camera.x + Game.currentMap.cameraShake.x)) + Game.weapons[this.weapon].angleVariationMax ),
        random((Game.player.y - (Game.currentMap.camera.y + Game.currentMap.cameraShake.y)) + Game.weapons[this.weapon].angleVariationMin, (Game.player.y - (Game.currentMap.camera.y + Game.currentMap.cameraShake.y)) + Game.weapons[this.weapon].angleVariationMax )
      );
      Game.particlePool.get((this.x * Game.tileSize) + (Game.tileSize / 4) , (this.y * Game.tileSize) + (Game.tileSize / 4) , angle, Game.weapons[this.weapon].size, randomChoice(Game.weapons[this.weapon].speedVariation), 'enemyBullet', true,  this.i, Game.currentMap.colors[Game.currentMap.type]);

    };

    Game.currentMap.cameraShake.y += random(-1, 1);
    Game.currentMap.cameraShake.x += random(-1, 1);

  }

};

MapNode.prototype.setModelType = function(type, type2) {

  this.typeID = type;
  this.type = type2 || types[type];

  this.solid = Game.solidTiles.indexOf(type) > -1;

};

 /**
 * Map render
 *
 * @constructor
 */
Game.Map = function(type) {
  this.cols = 64;
  this.rows = 64;
  this.map = [];
  this.camera = {x: 0, y: 0};
  this.cameraPosition = {x: 500, y: 500};
  this.cameraShake = {x: 0, y: 0};
  this.viewport = {
    width: Game.width,
    height: Game.height
  };
  this.enemies = 0;
  this.types = ['air', 'water', 'earth', 'fire'];
  this.type = this.types.indexOf( type );
  this.generated = false;
  this.colors = ['hsl(91, 40%, 25%)', 'hsl(205, 40%, 25%)', 'hsl(40, 40%, 25%)', 'hsl(0, 40%, 25%)'];
  this.reachable = [];
  this.explored = [];
  this.playerPosition = {
    x: 0,
    y: 0
  };

};

Game.Map.prototype.room = function(x,y,width,height, type, type2) {

  for (h = x; h < width; h++) {
    for (w = y; w < height; w++) {

      if(typeof this.map[this.cols * h + w] !== 'undefined'){

        if(type instanceof Array){
          this.map[this.cols * h + w].setModelType(randomChoice(type), type2);
        } else {
          this.map[this.cols * h + w].setModelType(type);
        }

      }

    }
  }

};

Game.Map.prototype.reset = function() {

  this.generate();

}

Game.Map.prototype.generate = function() {
  this.generated = false;
  Game.peacefulZone = true;

  this.rows = random(Game.mapsConfig[Game.mode][Game.mapsCountConfig].rowsMin, Game.mapsConfig[Game.mode][Game.mapsCountConfig].rowsMax) >>0;
  this.cols = random(Game.mapsConfig[Game.mode][Game.mapsCountConfig].colsMin, Game.mapsConfig[Game.mode][Game.mapsCountConfig].colsMax) >>0;

  this.enemies = 0;

  for (i = 0; i < Game.particlePool.elements.length; i++) {

    if(!Game.particlePool.elements[i].free){

      Game.particlePool.free(Game.particlePool.elements[i]);

    }

  };

  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {

      if(typeof this.map[this.cols * h + w] == 'undefined'){
        this.map[this.cols * h + w] = new MapNode(w, h, this.cols * h + w);
      } else {
        this.map[this.cols * h + w].init(w, h, this.cols * h + w);
      }

      //Walls
      if(h === 0) this.map[this.cols * h + w].setModelType(11);
      if(w === 0) this.map[this.cols * h + w].setModelType(11);
      if(h === this.rows - 1) this.map[this.cols * h + w].setModelType(11);
      if(w === this.cols - 1) this.map[this.cols * h + w].setModelType(11);

    }
  }

  Game.player.nextX = Game.player.x = this.playerPosition.x = ((this.cols * Game.tileSize) / 2);
  Game.player.nextY = Game.player.y = this.playerPosition.y = ((this.rows * Game.tileSize) / 2);

  this.room((this.playerPosition.x / Game.tileSize >> 0) - 2, (this.playerPosition.y / Game.tileSize >> 0) - 2, (this.playerPosition.x / Game.tileSize >> 0) + 2, (this.playerPosition.y / Game.tileSize >> 0) + 2, 56);

  this.findAdjacents();

  this.addEnemies();

  this.enemiesPath();

  this.autoTile();

  this.drawMinimap();

  this.generated = true;
};

Game.Map.prototype.nextMap = function() {

  Game.mapsCount++;

  if(Game.mode === 'survivor'){
    this.generated = false;
    this.type = this.types.indexOf( randomChoice(this.types) );
    Game.currentState = 'map';
    Game.mapsCountConfig = Math.max(0, Math.min(Game.mapsCount, Game.mapsConfig[Game.mode].length - 1));
  }

  if(Game.mode === 'arcade'){
    this.generated = false;
    this.type = this.types.indexOf( Game.mapsConfig[Game.mode][Game.mapsCountConfig].mapType );
    Game.currentState = 'map';
    Game.mapsCountConfig++;

    if(Game.mapsCountConfig > Game.mapsConfig[Game.mode].length - 1){
      Game.mapsCountConfig = 0;
        Game.arcadeLoop++;
    }

  }

};

Game.Map.prototype.drawMinimap = function() {

  Game.minimap.width = this.cols * 3;
  Game.minimap.height = this.rows * 3;

  Game.minimapCtx.fillStyle = 'rgba(18,18,18, 0.3)';
  Game.minimapCtx.fillRect(0,0, Game.minimap.width, Game.minimap.height);

  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {

      if(this.map[this.cols * h + w].solid){

        if(this.map[this.cols * h + w].type === 'enemy'){

          Game.minimapCtx.fillStyle = 'rgba(255,35,35, 0.8)';

        } else {

          Game.minimapCtx.fillStyle = 'rgba(18,18,18, 0.6)';

        }

        Game.minimapCtx.fillRect(this.map[this.cols * h + w].x * 3, this.map[this.cols * h + w].y  * 3, 3, 3);
      }
    }
  }

};

Game.Map.prototype.findPath = function(x, y) {

  var node;

  this.reachable.length = 0;
  this.explored.length = 0;

  this.reachable.push(this.map[this.cols * Math.floor(Game.player.y / Game.tileSize) +  Math.floor(Game.player.x / Game.tileSize)]);

  while(this.reachable.length > 0){

    node = randomChoice(this.reachable);

    if(node.x === x && node.y === y){

      while(node) {

        if(node.typeID === 48 && node.x !== x && node.y !== y){
          node.setModelType( 34 );
          this.enemies--;
        } else if(node.typeID !== 48 && node.typeID !== 56) {
          node.setModelType( 34 );
        }

        for (i = node.adjacents.length - 1; i >= 0; i--) {
          if(node.adjacents[i].typeID !== 48 && node.adjacents[i].typeID !== 56 && node.adjacents[i].x > 0 && node.adjacents[i].x < this.cols - 1 &&
            node.adjacents[i].y > 0 && node.adjacents[i].y < this.rows - 1 && randomChoice([true, false, false])){

            node.adjacents[i].setModelType(34);

          }
        }

        node = node.previous;
      }

      return false;
    }

    this.reachable.remove(this.reachable.indexOf(node));
    this.explored.push(node);

    for (i = node.adjacents.length - 1; i >= 0; i--) {

      if(
        this.reachable.indexOf(node.adjacents[i]) == -1 &&
        this.explored.indexOf(node.adjacents[i]) == -1 &&
        node.x > 0 && node.x < this.cols - 1 &&
        node.y > 0 && node.y < this.rows - 1){

        //if(!node.adjacents[i].solid){

          node.adjacents[i].previous = node;
          this.reachable.push(node.adjacents[i]);

        //}

      }

    };

  }

};

Game.Map.prototype.enemiesPath = function() {

  for (h = 0; h < this.rows; h++) {

    for (w = 0; w < this.cols; w++) {

      if(this.map[this.cols * h + w].typeID === 48){

          this.findPath(w,h);

      }

    }

  }

};

Game.Map.prototype.addEnemies = function() {
  var tileType;

  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {

      if(this.map[this.cols * h + w].type === 'w'){

        tileType = this.checkEnemy(w, h);

        if(tileType === 48 && randomChoice([true, false])){

          this.map[this.cols * h + w].setModelType( tileType );
          this.enemies++;

        }

      }

    }
  }

};

Game.Map.prototype.checkEnemy = function(x, y) {

  var rule = type['w'].rules[0];

  if(this.checkAdjacents(x, y, rule)){

      return 48;

  };

  return 3;

};



Game.Map.prototype.findAdjacents = function() {

  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {

      this.addAdjacents(this.map[this.cols * h + w], this.map[this.cols * (h + 1) + w]);
      this.addAdjacents(this.map[this.cols * h + w], this.map[this.cols * (h - 1) + w]);
      this.addAdjacents(this.map[this.cols * h + w], this.map[this.cols * (h) + (w + 1)]);
      this.addAdjacents(this.map[this.cols * h + w], this.map[this.cols * (h) + (w - 1)]);

    }

  }

};

Game.Map.prototype.autoTile = function() {
  var tileType;

  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {

      tileType = this.check(w, h) + (60 * this.type);

      this.map[this.cols * h + w].setType( tileType );


      if(this.map[this.cols * h + w].solid){
        if(typeof this.map[this.cols * (h + 1) + w] !== 'undefined' && !this.map[this.cols * (h + 1) + w].solid){
          this.map[this.cols * h + w].edges.push('b');
        }

        if(typeof this.map[this.cols * (h - 1) + w] !== 'undefined' && !this.map[this.cols * (h - 1) + w].solid){
          this.map[this.cols * h + w].edges.push('t');
        }

        if(typeof this.map[this.cols * (h) + (w + 1)] !== 'undefined' && !this.map[this.cols * (h) + (w + 1)].solid){
          this.map[this.cols * h + w].edges.push('r');
        }

        if(typeof this.map[this.cols * (h) + (w - 1)] !== 'undefined' && !this.map[this.cols * (h) + (w - 1)].solid){
          this.map[this.cols * h + w].edges.push('l');

        }
      }

    }
  }

};

Game.Map.prototype.check = function(x, y) {

  var rules = type[this.map[this.cols * y + x ].type].rules;

  for (i = 0; i < rules.length; i++) {
    if(this.checkAdjacents(x, y, rules[i])){
      if(rules[i].tileIndex instanceof Array){
        return randomChoice(rules[i].tileIndex);
      }
        return rules[i].tileIndex;
    };
  };

  if(type[this.map[this.cols * y + x].type].defaultIndex instanceof Array){
    return randomChoice(type[this.map[this.cols * y + x].type].defaultIndex);
  }

  return type[this.map[this.cols * y + x].type].defaultIndex;

};

Game.Map.prototype.checkAdjacents = function(x,y, rules) {

  if( !this.checkTile(x, y - 1, rules.map.n, x, y) ) return false; //n
  if( !this.checkTile(x + 1, y - 1, rules.map.ne, x, y) ) return false; //ne
  if( !this.checkTile(x + 1, y, rules.map.e, x, y) ) return false; //e
  if( !this.checkTile(x + 1, y + 1, rules.map.se, x, y) ) return false; //se
  if( !this.checkTile(x, y + 1, rules.map.s, x, y ) ) return false; //s
  if( !this.checkTile(x - 1, y + 1, rules.map.sw, x, y ) ) return false; //sw
  if( !this.checkTile(x - 1, y, rules.map.w, x, y ) ) return false; //w
  if( !this.checkTile(x - 1, y - 1, rules.map.nw, x, y  ) ) return false; //w

  return true;

};

Game.Map.prototype.checkTile = function(x,y, rule, w, h) {
  var type = this.map[this.cols * y + x];

  if(!type || x < 0 || y < 0 || x >= this.cols || y >= this.rows ) {

    type = this.map[this.cols * h + w];

  }

  if(!rule){
    return true;
  }

  if( /(!\w*)/.test(rule) ) return ~rule.indexOf(type.type) > -1;

  return (rule === type.type);
};

Game.Map.prototype.addAdjacents = function(node, adjacent) {

  if(typeof adjacent !== 'undefined'){

    node.adjacents.push(adjacent);

  }

};

Game.Map.prototype.drawTile = function(w, h, type) {
  spriteCoords.y = type / 10 >> 0;
  spriteCoords.x = (type - spriteCoords.y * 10);

  Game.c1ctx.drawImage(
    Game.spriteCache,
    spriteCoords.x * Game.tileSize,
    spriteCoords.y * Game.tileSize,
    Game.tileSize,
    Game.tileSize,
    (w * Game.tileSize) - (this.camera.x + this.cameraShake.x),
    (h * Game.tileSize) - (this.camera.y + this.cameraShake.y),
    Game.tileSize,
    Game.tileSize
  );

};


Game.Map.prototype.draw = function() {

  var lastRightCol = ((Game.width + (this.camera.x)) / Game.tileSize) >> 0,
      lastRightRow = ((Game.height + this.camera.y) / Game.tileSize) >> 0;

  h = (this.camera.y / Game.tileSize) >> 0;

  if((this.camera.x) % Game.tileSize){
    lastRightCol+=1;
  }

  if(this.camera.y % Game.tileSize){
    lastRightRow+=1;
  }

  for ( ; h < lastRightRow && h < this.rows; h++) {
    w = (((this.camera.x) / Game.tileSize) >> 0);
    for ( ; w < lastRightCol && w < this.cols; w++) {

      this.drawTile(w, h, this.map[this.cols * h + w].typeID);

      if(this.map[this.cols * h + w].type === 'enemy'){
        this.map[this.cols * h + w]['enemyUpdate']();
      }

        //crazy stuff to show all edged that can collide
        // Game.c1ctx.fillStyle = '#CF2B2B';
        // if(this.map[this.cols * h + w].edges.indexOf('t') > -1){
        //   Game.c1ctx.fillRect((w * Game.tileSize) - this.camera.x, (h * Game.tileSize) - this.camera.y, Game.tileSize, 2);
        // }
        // if(this.map[this.cols * h + w].edges.indexOf('b') > -1){
        //   Game.c1ctx.fillRect((w * Game.tileSize) - this.camera.x, ((h * Game.tileSize) + (Game.tileSize - 2)) - this.camera.y, Game.tileSize, 2);
        // }
        // if(this.map[this.cols * h + w].edges.indexOf('l') > -1){
        //   Game.c1ctx.fillRect((w * Game.tileSize) - this.camera.x, (h * Game.tileSize) - this.camera.y, 2, Game.tileSize);
        // }
        // if(this.map[this.cols * h + w].edges.indexOf('r') > -1){
        //   Game.c1ctx.fillRect(((w * Game.tileSize) + (Game.tileSize - 2)) - this.camera.x, (h * Game.tileSize) - this.camera.y, 2, Game.tileSize);
        // }

    };
  };

  Game.c1ctx.drawImage(Game.minimap, (Game.width - Game.minimap.width) - 16, (Game.height - Game.minimap.height) - 16);
  Game.c1ctx.fillStyle = '#e3e3e3';
  Game.c1ctx.fillRect( ((Game.width - Game.minimap.width) - 16) + (Game.player.x / 32 >> 0) * 3, ((Game.height - Game.minimap.height) - 16) + (Game.player.y / 32 >> 0) * 3, 3, 3);

};

Game.Map.prototype.update = function() {

  this.setCamera(
    (this.cameraPosition.x - (this.camera.x)) * 0.05 >> 0,
    (this.cameraPosition.y - (this.camera.y)) * 0.05 >> 0
  );

  if(Game.tick % 8 === 0){
    this.cameraShake.x = this.cameraShake.y = 0;
  }

};

Game.Map.prototype.setCamera = function(x, y) {

  this.camera.x += x;
  this.camera.y += y;

  this.camera.x = Math.max(0, Math.min(this.camera.x, (Game.tileSize * this.cols) - Game.width));
  this.camera.y = Math.max(0, Math.min(this.camera.y, (Game.tileSize * this.rows) - Game.height));

};



