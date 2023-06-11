var plane = document.getElementById('plane');
var players = document.getElementById('players');
var scores = document.getElementById('score');
var generalMessage = document.getElementById('generalMessage');
var gameOverMessage = document.getElementById('gameOverMessage');


class GameBoard {
    constructor(gridSize, gridConfig){
        this.start = false;
        this.score = 0;
        this.gridSize = gridSize;
        plane.style.width = `${this.gridSize}em`;
        plane.style.height = `${this.gridSize}em`;
        this.p1 = new Player(1);
        this.p2 = new Player(2);
        this.shortIndices = [];
        this.initBlockProb = 20;
        if (!gridConfig || !gridConfig.grid) {
            this.grid = this.createGameBoard();
        }
        else {
            this.grid = gridConfig.grid;
        }
        console.log(gridConfig);
        if (!gridConfig || !gridConfig.message) {
            generalMessage.innerText = '';
        }
        else {
            generalMessage.innerText = gridConfig.message;
        }
        this.getPlayerInitialPos();
        this.start = true;
        this.end = false;
        this.powerups = [];
        let powerup = new TransportationPowerup(this.p1, this.p2, this.grid);
        this.powerups.push(powerup);
        this.spacePressed = false;
    }
    

    computeL1Distance(pointA, pointB){
        return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
    }

    getPlayerInitialPos() {
        let move, new_p1_pos, new_p2_pos;
        let moveset = ['up', 'down', 'left', 'right', null];
        let maxDistanceDir;
        let distance, maxdistance;
        let total_moves = 0;
        for (let i=0; i<100; i++){ 
            maxdistance = 0;
            for (let j=0; j<moveset.length; j++){
                move = moveset[j];
                if (move) {
                    this.setPlayerDir(move);
                    new_p1_pos = this.p1.handleMovement(this.grid, this.gridSize);
                    new_p2_pos = this.p2.handleMovement(this.grid, this.gridSize);
                    distance = this.computeL1Distance(new_p1_pos, new_p2_pos);
                    if (distance >= maxdistance){
                        maxdistance = distance;
                        maxDistanceDir = move;
                        }
                    }
                }
            this.setPlayerDir(maxDistanceDir);
            if (maxDistanceDir === 'up') {
                total_moves += 1;
            } else if (maxDistanceDir === 'down') {
                total_moves -= 1;
            } else if (maxDistanceDir === 'left') {
                total_moves += 1;
            } else if (maxDistanceDir === 'right') {
                total_moves -= 1;
            }
            this.p1.movePlayer(this.grid, this.gridSize);
            this.p2.movePlayer(this.grid, this.gridSize);
        }
    }

    setPlayerDir(dir){
        if (this.end) {
            return;
        }
        this.p1.state.dir = dir;
        if (dir === 'up') {
            this.p2.state.dir = 'down';
        }
        else if (dir === 'down') {
            this.p2.state.dir = 'up';
        }
        else if (dir === 'left') {
            this.p2.state.dir = 'right';
        }
        else if (dir === 'right') {
            this.p2.state.dir = 'left';
        }
        // update
        if (this.start) {
            this.score = this.score + 1;
        }
        else {
            this.score = 0;
        }
        scores.innerText = `Score: ${this.score}`;

    }


    checkPlayerOverlap(probability, coords){
        return (
            Math.random() < probability
            && !this.p1.detectOverlap(coords)
            && !this.p2.detectOverlap(coords)
        )
    }


    static createEmptyGrid(gridSize) {
        let grid = [];
        for (let i=0; i<gridSize; i++) {
            let col = [];
            for (let j=0; j<gridSize; j++) {
                let block = {
                    height: 0,
                    init_height: 0,
                    div: null,
                    x: i,
                    y: j,
                    powerup: null
                }
                col.push(block);
            }
            grid.push(col);
        }
        return grid;
    }

    createGameBoard(){
        let grid = [];

        grid = GameBoard.createEmptyGrid(this.gridSize);

        let midpoint = parseInt(this.gridSize/2) + 1
        let n_kernels = parseInt(this.gridSize/2)-1
        for (let i=0; i<n_kernels; i++) {
            let area_size = 3 + 2*i;
            let min = midpoint - (i+1);
            let max = midpoint + (i+1);
            for (let j=min; j<max; j++) {
                for (let k=min; k<max; k++) {
                    if (
                        j === min
                        || k === min
                        || j === max
                        || k === max
                    ) {
                        let prob = this.initBlockProb + i*(Math.log(90/n_kernels));
                        if (this.checkPlayerOverlap(prob/100, {x: j, y: k})) {
                            let block = grid[j][k]
                            block.height = 1;
                            block.init_height = 10;
                        }
                    }
                }
            }
        }
         
    return grid;
    }
  
    detectOverlap(pos1, pos2){
        return (
            pos1.x === pos2.x
            && pos1.y === pos2.y
        )
    }

  handleLevelEnd(){
    if (
        this.p1.state.x == this.p2.state.x
        && this.p1.state.y == this.p2.state.y
    ){
        this.end = true;
        this.p2.state.div.classList.add('playerComplete');
        this.score = 0; // wtf??
        }
    else {
        this.end = false;
        this.p2.state.div.classList.remove('playerComplete');

        }
  }


  createMapDiv(block){
    let div = document.createElement('div');
    // if the height is 1, give it a .tall attribute
    if (block.height == 1) {
      div.classList.add('tall');
    } else {
      div.classList.add('short');
    }
    // set css properties for div and update state for block
    return div;
  }

  render() {
    for (let i=0; i<this.gridSize; i++){
      for (let j=0; j<this.gridSize; j++){
        // create a new div
        let block = this.grid[i][j];
        if (!block.div) {
          let div = this.createMapDiv(block);
          plane.appendChild(div);
          if (block.x == this.p1.state.x && block.y == this.p1.state.y && !this.p1.state.div) {
              this.p1.createPlayerDiv();
          }
          else if (block.x == this.p2.state.x && block.y == this.p2.state.y && !this.p2.state.div) {
              this.p2.createPlayerDiv();
          }
          block.div = div;
          if (block.powerup){
            block.div.classList.add('transport');
          }
        }
        // if the init_height is > 0, set the ztransform attr
        // to init_height and reduce it by 1
        // if the init_height == height, don't modify ztransform
        ;
      }
    }
  }

    update() {
        this.p1.movePlayer(this.grid, this.gridSize);
        this.p2.movePlayer(this.grid, this.gridSize);
        this.powerups.forEach((element) => {element.update(this.spacePressed, [this.p1, this.p2])})
        this.handleLevelEnd();
        this.spacePressed = false;
    }

}



class Level {
    constructor(level, gridConfig) {
        generalMessage.style.display = 'block';
        gameOverMessage.style.display = 'none';
        this.board = new GameBoard(17, gridConfig);
        this.eventHandler = this.handleEvents(this);
        this.bindEventHandlers()
        this.next = null;
        this.level = level;
        this.spacePressed = false;
        this.interval = null;
    }

    handleEvents(obj) {
        let board = this.board;
        return (function(event) {

            if (event.defaultPrevented){
                return;
            }

            switch(event.code){
                case 'ArrowDown':
                    board.setPlayerDir('down');
                    break;
                case 'ArrowUp':
                    board.setPlayerDir('up');
                    break;
                case 'ArrowLeft':
                    board.setPlayerDir('left');
                    break;
                case 'ArrowRight':
                    board.setPlayerDir('right');
                    break;
                case 'Space':
                    obj.spacePressed = true;
                    board.spacePressed = true;
                    break;
                default:
                    return;
            }

            event.preventDefault();

        });
    }


    tearDown() {
        let removeDivsFromParent = (className) => {
            let divs = document.getElementsByClassName(className);
            Array.from(divs).forEach(element => {
              element.parentNode.removeChild(element);
            });
        }
        //only needs to be called at level end
        removeDivsFromParent('tall');
        removeDivsFromParent('short');
        removeDivsFromParent('players');
    }

    bindEventHandlers() {
        window.addEventListener("keydown", this.eventHandler, true);
    }

    unbindEventHandlers() {
        window.removeEventListener("keydown", this.eventHandler, true);
    }

    onGameEnd(resolve, animationReq) {
        if (this.board.end) {
            // hide general div
            generalMessage.style.display = 'none';

            // show game over div
            gameOverMessage.style.display = 'block';
             
            // if space is pressed return resolve
            if (this.spacePressed) {
                this.unbindEventHandlers();
                this.tearDown();
                window.cancelAnimationFrame(animationReq);
                this.spacePressed = false;
                return resolve();
            }
        }
        else {
            this.spacePressed = false;
        }
    }


    go() {

        const fps = 30;
        let fpsInterval = 1000/fps;
        let tFrame = 0;
        let board = this.board;
        var animationReq;
        function loop(timestamp) {
            animationReq = window.requestAnimationFrame(loop);
            let elapsed = timestamp - tFrame;
            if (elapsed > fpsInterval) {
                tFrame = timestamp - (elapsed % fpsInterval)  
                board.render();
                board.update();
            }
        }
        
        // start render loop
        loop();

        // return a promise that resolves once the level ends
        return new Promise(resolve => {
            
            this.interval = setInterval(() => {
                this.onGameEnd(resolve, animationReq)
            }, 30);
        })
    }
}

async function main() {
    levelConfigs = {
        0: {
            grid: GameBoard.createEmptyGrid(17),
            message: "Use the arrow keys to move the blue and red square"
        },
        2: {
            message: "Use the static blocks to align the blocks",
            initBlockProb: 0
        },
        1: {
            grid: GameBoard.createEmptyGrid(17),
            message: "Press Space on a purple block to teleport",
            initBlockProb: 10
        }
    }
    gridOverrides = {
        0: GameBoard.createEmptyGrid(17),
        1: GameBoard.createEmptyGrid(17),
    }
    for (let i=0; i<10; i++) {
        let level;
        if (i in levelConfigs) {
            level = new Level(i, levelConfigs[i]);
        }
        else {
            level = new Level(i);
        }
        await level.go();
        clearInterval(level.interval);
    }
}

main();

