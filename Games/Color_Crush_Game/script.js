var ColorMatch = Sketch.create({
      fullscreen: false,
      height: 500,
      width: 500,
      container: document.getElementById('container')
    }),
    i = w = h = 0;

function normalize(x, y, size) {
  return {
    x: Math.ceil( x / size) - 1,
    y: Math.ceil( y / size) - 1
  }
};

function distance(ax, ay, bx, by) {
  return Math.sqrt(Math.pow( ax - bx, 2) + Math.pow( ay - by, 2));
};

function Particle(options) {

  this.x = options.x;
  this.y = options.y;
  this.vx = options.vx;
  this.vy = options.vy;
  this.size = options.size;
  this.color = options.color;
  this.orbitX = options.orbitX;
  this.orbitY = options.orbitY;
  this.speedX = options.speedX;
  this.speedY = options.speedY;
  this.aceleration = 1.02;

  this.angle = 0;

};

Particle.prototype.update = function() {

  // this.vx *= this.aceleration;
  // this.vy *= this.aceleration;

  this.x += this.vx;
  this.y += this.vy;

  if( distance( this.x, this.y, ColorMatch.mouse.x, ColorMatch.mouse.y ) < 200 ){
    this.x += this.vx;
    this.y += this.vy;
  }

  this.x += Math.cos(this.angle * this.speedX) * this.orbitX;
  this.y += Math.sin(this.angle * this.speedY) * this.orbitY;

  this.angle += 0.02;

  this.size *= 0.99;

};

Particle.prototype.draw = function() {
  ColorMatch.fillStyle = this.color;
  ColorMatch.fillRect(this.x, this.y, this.size, this.size);
};

function Score(options) {
  this.x = options.x;
  this.y = options.y;
  this.initialPosition = {
    x: this.x,
    y: this.y
  };
  this.stayPosition = {
    x: this.x,
    y: this.y - 20
  };
  this.text = options.text;
  this.color = '#fff';
};

Score.prototype.update = function() {

  if(this.y > this.initialPosition.y - 15){
    this.y += (this.stayPosition.y - this.y) * 0.05;
  } else {
    this.y += (-50 - this.y) * 0.05;
    this.x += (450 - this.x) * 0.05;
  }

};

Score.prototype.draw = function() {
  ColorMatch.fillStyle = this.color;
  ColorMatch.fillText(this.text, this.x, this.y);
};

//Each tile
function Node(options){
  this.x = options.x;
  this.y = options.y;
  this.position = {x: this.x * ColorMatch.gridSize, y: -(this.y * ColorMatch.gridSize) - 300} || options.position;
  this.adjacent = [];
  this.type = random([1,2,2,3,4,4,5]) || options.type;
  this.color = ColorMatch.colors[this.type] || options.color;
}

Node.prototype.update = function() {
  this.position.x += ((this.x * ColorMatch.gridSize) - this.position.x) * 0.2;
  this.position.y += ((this.y * ColorMatch.gridSize) - this.position.y) * 0.2;
};

Node.prototype.draw = function() {
  if(this.type !== 0){
    ColorMatch.fillStyle = this.color;
  } else {
    ColorMatch.fillStyle = ColorMatch.colors[0];
  }
  ColorMatch.fillRect(this.position.x - 1, this.position.y - 1, ColorMatch.gridSize - 2, ColorMatch.gridSize - 2);

};

ColorMatch.setup = function() {

  this.map = [];
  this.gridSize = 50;
  this.rows = this.height / this.gridSize;
  this.cols = this.width / this.gridSize;
  this.score = 0;
  this.blockScore = 10;
  this.scoreContainer = document.getElementById('score');
  this.reachable = [];
  this.particles = [];
  this.particlesMax = 20;
  this.particlesIndex = 0;
  this.scoreParticles = [];
  this.scoreParticlesMax = 10;
  this.scoreParticlesIndex = 0;
  this.path = [];
  this.can = [];
  this.currentTile = 0+','+0;
  this.explored = [];
  this.colors = ['#e3e3e3', '#16a085', '#2c3e50', '#e74c3c', '#2980b9', '#8e44ad'];
  this.currentColor = this.colors[0];

  this.normalizeMouse = {x: 0, y: 0};

  this.setScore = function(score) {
    this.score += score;
    this.scoreContainer.style.color = this.currentColor;

    this.scoreParticles[(this.scoreParticlesIndex++)%this.scoreParticlesMax] = new Score({
      x: this.mouse.x,
      y: this.mouse.y,
      text: score,
      color: this.currentColor
    });

    this.scoreContainer.innerHTML = this.score;
  };


  this.findAdjacents = function() {
    for (h = 0; h < this.rows; h++) {
      for (w = 0; w < this.cols; w++) {
        var node = this.map[this.cols * h + w];
        if(node !== null){

          node.adjacent = [];

          //up
          if(h > 0 && this.map[this.cols * (h-1) + w] !== null){
            node.adjacent.push(this.map[this.cols * (h-1) + w]);
          }

          //down
          if(h < this.rows - 1 && this.map[this.cols * (h+1) + w] !== null){
            node.adjacent.push(this.map[this.cols * (h+1) + w]);
          }

          //left
          if(w > 0 && this.map[this.cols * h + (w - 1)] !== null){
            node.adjacent.push(this.map[this.cols * h + (w - 1)]);
          }

          //right
          if(w < this.cols - 1 && this.map[this.cols * h + (w + 1)] !== null){
            node.adjacent.push(this.map[this.cols * h + (w + 1)]);
          }

          //diagonal

          // //up-left
          // if(h > 0 && w > 0){
          //   node.adjacent.push(this.map[this.cols * (h-1) + (w-1)]);
          // }

          // //up-right
          // if(h > 0 && w < this.cols - 1){
          //   node.adjacent.push(this.map[this.cols * (h-1) + (w+1)]);
          // }

          // //down-left
          // if(h < this.rows - 1 && w > 0){
          //   node.adjacent.push(this.map[this.cols * (h+1) + (w-1)]);
          // }

          // //down-right
          // if(w < this.cols - 1 && w < this.cols - 1){
          //   node.adjacent.push(this.map[this.cols * (h+1) + (w+1)]);
          // }
        }
      }
    }
  };

  //generate a random map
  this.generate = function() {
    for (h = 0; h < this.rows; h++) {
      for (w = 0; w < this.cols; w++) {
        this.map[this.cols * h + w] = new Node({
          x: w,
          y: h
        });
      }
    }

    this.findAdjacents();
  }

  this.generate();

  //used for pathfinder
  this.getNodeIndex = function(node, list) {
    for (i in list) {
        if (node == list[i]) {
            return i;
        }
    }
    return -1;
  }

  //used for pathfinder
  this.findNode = function(node, list) {
    return this.getNodeIndex(node, list) >= 0;
  };

  //used for pathfinder
  this.addReachable = function(node, adjacent) {

    if(this.findNode(adjacent, this.explored) || this.findNode(adjacent, this.reachable)){
      return;
    }

    adjacent.previous = this.node;
    this.reachable.push(adjacent);

  };

  //used for pathfinder
  this.removeReachable = function(node) {

    this.reachable = this.reachable.filter(function(element) {
      return element !== node;
    });

  };

  //add the tiles that match to an array
  this.addCan = function(node) {

    if(this.findNode(node, this.can)){
      return;
    }

    this.can.push(node);
  };

};

//Pathfinder
ColorMatch.find = function(start) {
  var node;

  this.lookfor = this.map[this.cols * start.y + start.x].type;

  this.reachable = [];
  this.explored = [];
  this.can = [];

  this.reachable.push(start);
  this.addCan(start);

  while(this.reachable.length > 0){

    node = this.reachable[0];

    this.removeReachable(node);
    this.explored.push(node);

    for (var i in node.adjacent) {
      if(node.adjacent[i].type === this.lookfor){
        this.addReachable(node, node.adjacent[i]);
        this.addCan(node.adjacent[i]);
      }
    }
  }

  //if find just one tile
  if(this.can.length <= 1){
    this.can = [];
  }

};


ColorMatch.mousemove = function() {
  this.normalizeMouse = normalize(this.mouse.x, this.mouse.y, this.gridSize);

  //check if the tile exist and look for color match when the mouse is over a different tile
  // if(this.map[this.cols * this.normalizeMouse.y + this.normalizeMouse.x] !== null && this.currentTile !== this.normalizeMouse.x+','+this.normalizeMouse.y){

  //   this.currentTile = this.normalizeMouse.x+','+this.normalizeMouse.y;

  //   this.can = [];

  // }

};

ColorMatch.click = function() {

  this.lookfor = this.map[this.cols * this.normalizeMouse.y + this.normalizeMouse.x];

  this.currentColor = this.colors[this.lookfor.type];

  this.find(this.map[this.cols * this.normalizeMouse.y + this.normalizeMouse.x]);

  //if any color match, lose 200 points
  if(this.can.length <= 1){

    this.setScore(-200);

    return false;
  }


  if(this.lookfor !== null){

    //remove the matching tiles and throw particles
    for (i = 0; i < this.can.length; i++) {
      node = this.map[this.cols * this.can[i].y + this.can[i].x];
      this.map[this.cols * this.can[i].y + this.can[i].x] = null;

      for (o = 0; o < 4; o++) {

        this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
          x: random(node.x * this.gridSize, (node.x * this.gridSize) + this.gridSize ),
          y: random(node.y * this.gridSize, (node.y * this.gridSize) + this.gridSize ),
          vx: random([-5,-3,5,3]),
          vy: random([-5,-3,5,3]),
          size: random(4,8),
          orbitX: random(1,8),
          orbitY: random(1,8),
          speedX: random(1,8),
          speedY: random(1,8),
          color: this.colors[this.lookfor.type]
        });

      };
    };

    //add score
    this.setScore(this.can.length * this.blockScore);

    //look for empty blocks to fill up with the first not empty block
    for (h = this.rows - 1; h >= 0; h--) {
      for (w = this.cols - 1; w >= 0; w--) {
        var node = this.map[this.cols * h + w];

        if(this.map[this.cols * h + w] === null){
          i = h;
          while(i>=0 && i<10){
            var block = this.map[this.cols * i + w];

            if(block !== null){
              this.map[this.cols * i + w] = null;
              this.map[this.cols * h + w] = block;
              block.y = h;

              break;
            }

            i--;
          };
        }
      };
    };

    //look for empty blocks to generate a new one
    for (h = 0; h < this.rows; h++) {
      for (w = 0; w < this.cols; w++) {

        if(this.map[this.cols * h + w] === null){
          this.map[this.cols * h + w] = new Node({
            x: w,
            y: h
          })
        }

      }
    }

    //look adjacents block of each block
    this.findAdjacents();

  }

};

ColorMatch.update = function() {

  //update each tile
  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {
      node = this.map[this.cols * h + w];
      if(node !== null){
        node.update();
      }
    }
  }

  //update particle
  for (i = this.particles.length - 1; i >= 0; i--) {
    this.particles[i].update();
  };

  //update score number
  for (i = this.scoreParticles.length - 1; i >= 0; i--) {
    this.scoreParticles[i].update();
  };

};

ColorMatch.draw = function() {

  //draw the map
  for (h = 0; h < this.rows; h++) {
    for (w = 0; w < this.cols; w++) {
      node = this.map[this.cols * h + w];
      if(node !== null){
        node.draw();
      }
    };
  };

  //this.fillStyle = 'rgba(227,227,227,0.2)';

  // for (var i = 0; i < this.can.length; i++) {

  //   this.fillRect(this.can[i].x * this.gridSize, this.can[i].y * this.gridSize, this.gridSize, this.gridSize);

  // };

  this.globalCompositeOperation  = 'lighter';

  //draw particles
  for (i = this.particles.length - 1; i >= 0; i--) {
    this.particles[i].draw();
  };

  //draw score
  this.font = "bold 20px sans-serif";
  for (i = this.scoreParticles.length - 1; i >= 0; i--) {
    this.scoreParticles[i].draw();
  };


};