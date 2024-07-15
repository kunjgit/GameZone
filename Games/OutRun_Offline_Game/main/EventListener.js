function EventListener() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
}

let KEY_W = 87;
let KEY_A = 65;
let KEY_S = 83;
let KEY_D = 68;
let KEY_ENTER = 13;
let KEY_SPACE = 32;
let KEY_UP = 38;
let KEY_LEFT = 37;
let KEY_DOWN = 40;
let KEY_RIGHT = 39;

function keyDown(event) {
    if (loading == maxLoading) {
        if (Outrun.scene == MENU_SCENE) {
            if (event.which == KEY_ENTER) {
                Outrun.scene = RADIO_SCENE;
                sounds['coin'].play();
            }
        } else if (Outrun.scene == RADIO_SCENE) {
            if (event.which == KEY_A | event.which == KEY_LEFT) {
                if (Radio.music != 0)
                    Radio.music--;
            } else if (event.which == KEY_D | event.which == KEY_RIGHT) {
                if (Radio.music != 2)
                    Radio.music++;
            } else if (event.which == KEY_ENTER) {
                sounds['wave'].pause();
                Outrun.newGame();
                Outrun.scene = IN_GAME_SCENE;
            }
        } else if (Outrun.scene == IN_GAME_SCENE) {
            if (event.which == KEY_W | event.which == KEY_UP) {
                Driver.accelerate = true;
            } else if (event.which == KEY_S | event.which == KEY_DOWN) {
                Driver.decelerate = true;
            } else if (event.which == KEY_A | event.which == KEY_LEFT) {
                Driver.steerLeft = true;
            } else if (event.which == KEY_D | event.which == KEY_RIGHT) {
                Driver.steerRight = true;
            }
        }
    }
}

function keyUp(event) {
    if (Outrun.scene == IN_GAME_SCENE) {
        if (event.which == KEY_W | event.which == KEY_UP) {
            Driver.accelerate = false;
        } else if (event.which == KEY_S | event.which == KEY_DOWN) {
            Driver.decelerate = false;
        } else if (event.which == KEY_A | event.which == KEY_LEFT) {
            Driver.steerLeft = false;
        } else if (event.which == KEY_D | event.which == KEY_RIGHT) {
            Driver.steerRight = false;
        }
    }
}