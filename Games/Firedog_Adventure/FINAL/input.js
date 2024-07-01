export class Inputhandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
   
    window.addEventListener("keydown", (e) => {
      if (
        (e.key == "ArrowDown" ||
          e.key == "ArrowUp" ||
          e.key == "ArrowLeft" ||
          e.key == "ArrowRight" ||
          e.key=="Enter") &&
        this.keys.indexOf(e.key) == -1
      ) {
        this.keys.push(e.key);
        console.log(this.keys);
      } else if (e.key == "d"){this.game.debug = !this.game.debug;} 
      // else if(e.key=="Enter" && this.game.gameover)
      // {
      //   startNewGame();
      // }
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.key == "ArrowDown" ||
        e.key == "ArrowUp" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowRight" ||
        e.key=="Enter"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}
