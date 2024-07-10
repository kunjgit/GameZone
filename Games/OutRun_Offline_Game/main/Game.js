function Game() {
    this.scene = MENU_SCENE;
    this.renderSize = 300;
    this.playable = false;
    this.startDelay = 0;
}

var controlCount = 0;

const MENU_SCENE = 'menu';
const RADIO_SCENE = 'radio';
const IN_GAME_SCENE = 'drive';

const FPS = 60;

var time = null;
var currentTime = null;

Game.prototype.init = function () {
    time = new Date().getTime();
    loadAssets();
    this.eventListener = new EventListener();
}

Game.prototype.newGame = function () {
    this.gameWorld = new GameWorld();
}

Game.prototype.start = function () {
    Outrun.init();
    Outrun.mainLoop();
}

Game.prototype.mainLoop = function () {
    currentTime = new Date().getTime();
    var milliseconds = currentTime - time;
    if (milliseconds >= 1000 / FPS) {
        time = currentTime;
        if (loading < maxLoading) {
            Outrun.drawLoading();
        } else {
            Radio.update();
            if (Outrun.scene == MENU_SCENE | Outrun.scene == RADIO_SCENE) {
                Radio.draw();
            } else if (Outrun.scene == IN_GAME_SCENE) {
                if(!Outrun.playable){
                    Outrun.startDelay = (Outrun.startDelay + 1) % FPS;
                    if(!Outrun.startDelay)
                        Outrun.gameWorld.road.nextLight();
                }
                Outrun.gameWorld.play();
                Outrun.gameWorld.update();
                Outrun.gameWorld.draw();
            }
        }
        Canvas.fix();
    }

    requestAnimationFrame(Outrun.mainLoop);
}

Game.prototype.drawLoading = function () {
    Canvas.fill('#008BFF');
    Canvas.canvasContext.fillStyle = "#000000";
    Canvas.canvasContext.fillRect(99, 126, 121, 12);
    Canvas.canvasContext.fillStyle = "#F7F700";
    Canvas.canvasContext.fillRect(99, 126, 121 * (loading / maxLoading), 12);
    Canvas.drawStaticImage(sprites['loading-box'], 98, 125, 124, 15);
    Canvas.drawStaticImage(sprites['loading-text'], 106, 84, 109, 28);
}

let Outrun = new Game();
