class Player {
    constructor(id){
        this.id = id;
        this.state = this.initState();
    }

    initState(){
        return {
            x: 5,
            y: 5,
            dir: null,
            div: null,
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            active: false
        }
        
    }


    detectOverlap(pos) {
        return (
            pos.x === this.state.x
            && pos.y === this.state.y
        )

    }

    createPlayerDiv(){
        let div = document.createElement('div');
        div.classList.add('tall');
        div.classList.add('player');
        div.classList.add(`player${this.id}`);
        players.appendChild(div);
        this.state.div = div;
    }

    detectCollision(pos, grid, gridSize){
        if (pos.x === null || pos.y === null){
            return true;
        }
        if (
            pos.x >= gridSize
            || pos.y >= gridSize
            || pos.x < 0
            || pos.y < 0
            || grid[pos.y][pos.x].height === 1
        ){
            return true;
        }
        return false;
    }

  handleMovement(grid, gridSize){
    const velocity = 1;
    let newPos = {x: null, y: null}
    if (this.state.dir === 'up') {
      newPos = {x: this.state.x, y: this.state.y-velocity}
    }
    else if (this.state.dir === 'down') {
      newPos = {x: this.state.x, y: this.state.y+velocity}
    }
    else if (this.state.dir === 'left') {
      newPos = {x: this.state.x-velocity, y: this.state.y}
    }
    else if (this.state.dir === 'right') {
      newPos = {x: this.state.x+velocity, y: this.state.y}
    }
    if (!this.detectCollision(newPos, grid, gridSize)) {
      return newPos;
    } else {
      return {x: this.state.x, y: this.state.y};
    }
  }

  movePlayer(grid, gridSize){
    // move player div by modifying css
    let newPos = this.handleMovement(grid, gridSize);
    this.state.x = newPos.x;
    this.state.y = newPos.y;
    if (this.state.div) {
      this.state.div.style.transform = `translateZ(1em) translateY(${this.state.y}em) translateX(${this.state.x}em)`;
    }
    this.state.dir = null;
  }
    
}
