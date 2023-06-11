const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 480;
// const MAX_RATIO = 1.25;
// const MIN_RATIO = 1.25;//0.6;

let theCanvas = document.getElementById("main_game");

// Loading
let game = new gameModule.TheGame(theCanvas);

game.setCanvasConfig({
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
});

game.startGameLoop();

// function getCanvasHeight(canvasWidth) {
//     let newWidth = window.innerWidth;
//     let newHeight = window.innerHeight;
//     let newWidthToHeight = newWidth / newHeight;

//     return canvasWidth / Math.max(Math.min(newWidthToHeight, MAX_RATIO), MIN_RATIO);
// }