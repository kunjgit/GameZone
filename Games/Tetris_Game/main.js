const tetriminos = {
  i:[ 
    [
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ],
  [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
  ],
],
  j:[
    [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    [
      [1,1,0],
      [1,0,0],
      [1,0,0],
    ],
    [
      [1,1,1],
      [0,0,1],
      [0,0,0],
    ],
    [
      [0,1,0],
      [0,1,0],
      [1,1,0],
    ],
  ],
  l: [
  [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  [
    [1,0,0],
    [1,0,0],
    [1,1,0],
  ],
  [
    [1,1,1],
    [1,0,0],
    [0,0,0],
  ],
  [
    [1,1,0],
    [0,1,0],
    [0,1,0],
  ],
],
  o: [
  [
    [1,1],
    [1,1]
  ],
  [
    [1,1],
    [1,1]
  ],
],
  s: [
  [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  [
    [1,0,0],
    [1,1,0],
    [0,1,0],
  ],
],

  t: [
  [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ],
  [
    [1,0,0],
    [1,1,0],
    [1,0,0],
  ],
  [
    [1,1,1],
    [0,1,0],
    [0,0,0],
  ],
  [
    [0,1,0],
    [1,1,0],
    [0,1,0],
  ],
],
  z: [
  [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  [
    [0,1,0],
    [1,1,0],
    [1,0,0],
  ],
]
};
const rotationStates = {
  l: {
    0:[0,1],
    1:[1,-1],
    2:[-1,1],
    3:[0,-1],
  },
  j: {
    0:[0,1],
    1:[1,-1],
    2:[-1,1],
    3:[0,-1],
  },
  t: {
    0:[0,0],
    1:[1,-1],
    2:[-1,1],
    3:[0,0],
  },
  s: {
    0:[-1,1],
    1:[1,-1],
  },
  z: {
    0:[-1,1],
    1:[1,-1],
  },
  i: {
    0:[-1,1],
    1:[1,-1],
  },
  o: {
    0:[0,0],
  },
};
let gameOver = false;
let lines=0;
let score=0;
let level=1;
document.getElementById("startGame").addEventListener("click",function(){
  window.game.scene.keys["TetrisScene"].resetGame();
});
class TetrisScene extends Phaser.Scene {
  constructor() {
    super({key: "TetrisScene"});
    this.gameBoard = [];
    this.currentTetrimino = null;
    this.blockSprites = [];
    for (let i=0;i<20;i++) {
      this.blockSprites[i] = new Array(10).fill(null);
    }
  }
  preload() {
    this.load.image("j","assets/Shape Blocks/J.png");
    this.load.image("i","assets/Shape Blocks/I.png");
    this.load.image("l","assets/Shape Blocks/L.png");
    this.load.image("z","assets/Shape Blocks/Z.png");
    this.load.image("s","assets/Shape Blocks/S.png");
    this.load.image("t","assets/Shape Blocks/T.png");
    this.load.image("o","assets/Shape Blocks/O.png");
    this.load.image("j1","assets/Shape Blocks/J1.png");
    this.load.image("i1","assets/Shape Blocks/I1.png");
    this.load.image("l1","assets/Shape Blocks/L1.png");
    this.load.image("z1","assets/Shape Blocks/Z1.png");
    this.load.image("s1","assets/Shape Blocks/S1.png");
    this.load.image("t1","assets/Shape Blocks/T1.png");
    this.load.image("j2","assets/Shape Blocks/J2.png");
    this.load.image("l2","assets/Shape Blocks/L2.png");
    this.load.image("t2","assets/Shape Blocks/T2.png");
    this.load.image("j3","assets/Shape Blocks/J3.png");
    this.load.image("l3","assets/Shape Blocks/L3.png");
    this.load.image("t3","assets/Shape Blocks/T3.png");
    this.load.image("block-j","assets/Single Blocks/Blue.png");
    this.load.image("block-i","assets/Single Blocks/LightBlue.png");
    this.load.image("block-l","assets/Single Blocks/Orange.png");
    this.load.image("block-s","assets/Single Blocks/Green.png");
    this.load.image("block-t","assets/Single Blocks/Purple.png");
    this.load.image("block-z","assets/Single Blocks/Red.png");
    this.load.image("block-o","assets/Single Blocks/Yellow.png");
    this.load.image("board","assets/Board/Board.png");
    this.load.audio("lineClear","assets/Sound Effects/clear-lines.mp3");
    this.load.on("complete",()=>{
      const oTetrimino = this.textures.get("o").getSourceImage();
      this.blockSize = oTetrimino.width/4;
    });
  }
  create() {
    let bg = this.add.image(0,0,"board");
    this.lineClear = this.sound.add("lineClear");
    bg.setOrigin(0,0);
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;
    for(let i=0; i<20;i++) {
      this.gameBoard[i] = [];
      for(let j=0;j<10;j++) {
        this.gameBoard[i][j] = 0;
      }
    }
    this.moveCounter = 0;
    this.moveInterval = 60;
    this.spawnTetrimino();
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  spawnTetrimino() {
    const tetriminos = ["j","i","l","z","s","t","o"];

    if(!this.nextTetriminoType) {
      const randomIndex = Math.floor(Math.random()* tetriminos.length);
      this.nextTetriminoType = tetriminos[randomIndex];
    }
    this.currentTetriminoType = this.nextTetriminoType;
    const randomIndex = Math.floor(Math.random()* tetriminos.length);
    this.nextTetriminoType = tetriminos[randomIndex];
    nextTetriminoImage.src = "assets/Shape Blocks/"+this.nextTetriminoType.toUpperCase()+".png";
    this.currentTetrimino = this.physics.add.image(0,this.blockSize,this.currentTetriminoType);
    const tetriminoWidth = 0.5*this.currentTetrimino.displayWidth/this.blockSize;
    const xOffset = tetriminoWidth%2 === 0 ? (this.blockSize*(10-tetriminoWidth))/2: 3*this.blockSize;
    this.currentTetrimino.x = xOffset;
    this.currentTetrimino.y = 0;
    this.currentTetrimino.rotationState = 0;
    this.currentTetrimino.setOrigin(0,0);
    this.currentTetrimino.setScale(0.5);
    this.physics.world.enable(this.currentTetrimino);
    this.currentTetrimino.body.collideWorldBounds = true;
    this.currentTetrimino.blocks = this.calculateBlockPositions(this.currentTetriminoType,0);
    gameOver = this.isGameOver();
    if(gameOver) {
      this.displayEndGameMessage();
    }
  }
  spawnTetriminoAt(type,x,y,rotationState) {
    this.currentTetrimino = this.physics.add.image(0,this.blockSize,type);
    this.currentTetrimino.setOrigin(0,0);
    this.currentTetrimino.setScale(0.5);
    this.physics.world.enable(this.currentTetrimino);
    this.currentTetrimino.body.collideWorldBounds =true;
    this.currentTetrimino.x = x+rotationStates[this.currentTetriminoType][rotationState][0]*this.blockSize;
    this.currentTetrimino.y = y+rotationStates[this.currentTetriminoType][rotationState][1]*this.blockSize;
    this.currentTetrimino.rotationState = rotationState;
    this.currentTetrimino.blocks = this.calculateBlockPositions(this.currentTetriminoType,rotationState);
  }
   isGameOver() {
    let spawnLocations = {
      i: [0,3],
      o: [0,4],
      default: [0,3]
    };
    let spawnLocation = spawnLocations[this.currentTetriminoType] || spawnLocations["default"];
    let blockPositions = this.calculateBlockPositions(this.currentTetriminoType,this.currentTetrimino.rotationState);
    for(let block of blockPositions) {
      let x = spawnLocation[1]+block.x;
      let y = spawnLocation[0]+block.y;
      if(this.gameBoard[y] && this.gameBoard[y][x] === 1) {
        return true;
      }
    }
     return false;
   }
   displayEndGameMessage() {
    endGameContainer.style.display = "flex";
    finalScore.innerText = score;
   }

   resetGame() {
    endGameContainer.style.display = "none";
    gameOver = false;
    score=0;
    lines=0;
    level=1;
    scoreNumber.innerText =0;
    linesNumber.innerText = 0;
    levelNumber.innerText = 1;
    this.create();
   }
  calculateBlockPositions(type,rotationState) {
    const positions = [];
    const matrix = tetriminos[type][rotationState];
    for (let i = 0;i<matrix.length;i++) {
      for(let j=0;j<matrix[i].length;j++) {
        if(matrix[i][j]===1) {
          positions.push({x:j,y:i});
        }
      }
    }
    return positions;
  }

  rotate() {
    const numberOfstates = {
        i:2,
        j:4,
        l:4,
        t:4,
        s:2,
        z:2,
        o:1
    }
    let rotationState = (this.currentTetrimino.rotationState+1)%numberOfstates[this.currentTetriminoType];
    let allowRotation = this.isRotationValid(this.currentTetriminoType,rotationState);
    if(!allowRotation) return;
    const x = this.currentTetrimino.x;
    const y = this.currentTetrimino.y;
    this.currentTetrimino.rotationState = rotationState;
    let rotatedType = rotationState == 0 ? this.currentTetriminoType: this.currentTetriminoType+rotationState;
    this.currentTetrimino.destroy();
    this.spawnTetriminoAt(rotatedType,x,y,rotationState);
    this.checkAndHandleLandedTetrimino();
  }
  isRotationValid(type,rotationState) {
    let rotationValid = true;
    const positions = [];
    const matrix = tetriminos[type][rotationState];
    for(let i=0;i<matrix.length;i++) {
      for(let j=0;j<matrix.length;j++) {
        if(matrix[i][j]===1) {
          positions.push({x:j,y:i});
        }
      }
    }
    positions.forEach((block)=>{
      let currentTetriminox = this.currentTetrimino.x+rotationStates[this.currentTetriminoType][rotationState][0]*this.blockSize;
      let currentTetriminoy = this.currentTetrimino.y+rotationStates[this.currentTetriminoType][rotationState][1]*this.blockSize;
      const x = Math.floor((currentTetriminox+block.x*this.blockSize)/this.blockSize);
      const y = Math.floor((currentTetriminoy+block.y*this.blockSize)/this.blockSize);
      if(x>9 || x<0 || y<0 || y>19) {
        rotationValid = false;
      } else if (this.gameBoard[y][x] == 1)
        rotationValid = false;
    });
    return rotationValid;
  }
 update() {
  if(gameOver) return;
  this.moveCounter++;
  if(this.currentTetrimino && this.moveCounter>= this.moveInterval) {
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.y += this.blockSize;
    this.moveCounter =0;
    this.setTetriminoOnBoard(2);
    this.time.delayedCall(500,()=>{
      this.checkAndHandleLandedTetrimino();
    });
  }
  if(!this.currentTetrimino) return;
   if(Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
    if(!this.isMoveValid(-1)) return;
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.x -=this.blockSize;
    this.setTetriminoOnBoard(2);
    this.checkAndHandleLandedTetrimino();
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
    if(!this.isMoveValid(1)) return;
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.x +=this.blockSize;
    this.setTetriminoOnBoard(2);
    this.checkAndHandleLandedTetrimino();
   }
   if(this.cursors.down.isDown && this.moveCounter % 5 == 0) {
    this.setTetriminoOnBoard(0);
    if(!this.hasLanded())
      this.currentTetrimino.y+=this.blockSize;
    this.setTetriminoOnBoard(2);
    if(this.hasLanded()) {
      this.landTetrimino();
    }
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && !this.hasLanded()) {
    this.setTetriminoOnBoard(0);
    this.rotate();
    this.setTetriminoOnBoard(2);
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
    while(!this.hasLanded()) {
      this.currentTetrimino.y +=this.blockSize;
    }
    this.landTetrimino();
   }
 }

checkAndHandleLandedTetrimino() {
  if(this.hasLanded()) {
    this.setTetriminoOnBoard(0);
    this.landTetrimino();
  }
}

isMoveValid(direction) {
  let moveValid = true;
  this.currentTetrimino.blocks.forEach((block)=>{
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(this.gameBoard[y][x+direction]===1 || (x+direction)<0 || (x+direction)>9) moveValid = false;
  });
   return moveValid;
}
setTetriminoOnBoard(value) {
   this.currentTetrimino.blocks.forEach((block)=>{
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(x>=0 && x<10 && y>=0 && y<20) {
      this.gameBoard[y][x] = value;
    }
   });
}

hasLanded() {
  for(let block of this.currentTetrimino.blocks) {
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(y>=19) {
      return true;
    }
    if(y<20 && x<10 && this.gameBoard[y+1][x]===1) {
      return true;
    }
  }
  return false;
}
landTetrimino() {
  this.setTetriminoOnBoard(1);
  this.replaceTetriminoWithBlocks();
  this.checkLines();
  this.spawnTetrimino();
}
 replaceTetriminoWithBlocks() {
  for(let block of this.currentTetrimino.blocks) {
    let x = this.currentTetrimino.x+block.x*this.blockSize;
    let y = this.currentTetrimino.y+block.y*this.blockSize;
    let blockSprite = this.physics.add.image(x,y,"block-"+this.currentTetriminoType);
    blockSprite.setOrigin(0,0);
    blockSprite.setScale(0.5);
    this.physics.world.enable(blockSprite);
    let i = Math.floor(y/this.blockSize);
    let j = Math.floor(x/this.blockSize);
    this.blockSprites[i][j] = blockSprite;
  }
  this.currentTetrimino.destroy();
  this.currentTetrimino = null
 }
 checkLines() {
   let linesToRemove = [];
   let completedTweenCount = 0;
   for (let i=19;i>=0;i--){
     if(this.gameBoard[i].every((cell)=>cell === 1)) {
      for (let j=0;j<10;j++) {
        let blockSprite = this.blockSprites[i][j];
        if(blockSprite!==null) {
          this.lineClear.play();
          this.tweens.add({
            targets:blockSprite,
            alpha:0,
            ease:"Power1",
            duration:50,
            yoyo:true,
            repeat:3,
            onComplete:() => {
              blockSprite.destroy();
              completedTweenCount++;
              if(completedTweenCount === linesToRemove.length*10) {
                this.updateScoreAndLevel(linesToRemove);
                this.shiftBlocks(linesToRemove);
              }
            },
          });
          this.blockSprites[i][j] = null;
        }
      }
      this.gameBoard[i] = new Array(10).fill(0);
      linesToRemove.push(i);
     }
   } 
 }
 shiftBlocks(linesToRemove) {
  for(let line of linesToRemove.reverse()){
    for(let k=line;k>=1;k--) {
      for(let j=0;j<10;j++) {
        this.blockSprites[k][j] = this.blockSprites[k-1][j];
        if(this.blockSprites[k][j]!==null) {
          this.blockSprites[k][j].y+= this.blockSize;
        }
      }
      this.gameBoard[k] = [...this.gameBoard[k-1]];
    }
    this.gameBoard[0] = new Array(10).fill(0);
    this.blockSprites[0] = new Array(10).fill(null);
  }
 }

 updateScoreAndLevel(linesToRemove) {
  let linesCleared = linesToRemove.length;
  if(linesCleared>0) {
    let scores = [0,40,100,300,1200];
    score+=scores[linesCleared]*level;
    scoreNumber.innerText = score;
    lines+=linesCleared;
    linesNumber.innerText = lines;
    level = Math.floor(lines/10+1);
    this.moveInterval = Math.max(3,60/Math.pow(2,Math.floor((level-1)/3)));
    levelNumber.innerText = level;
  }
 }
}

const config = {
  type: Phaser.AUTO,
  width:320,
  height:640,
  parent: "boardContainer",
  physics: {
    default:"arcade",
    arcade: {
      gravity:{y:0},
      debug:false,
    },
  },
  scene:[TetrisScene],
};

window.game = new Phaser.Game(config);





















