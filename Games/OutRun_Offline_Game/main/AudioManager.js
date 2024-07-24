function AudioManager() {
    this.delay = 0;
    this.music = 1;
    this.dots = 3;
    this.background = 0;
    this.tree = 0;
    this.flash = 0;
}

const radioDelay = 6;

AudioManager.prototype.update = function () {
    if (Outrun.scene == MENU_SCENE | Outrun.scene == RADIO_SCENE) {
        this.delay = (this.delay + 1) % radioDelay;
        if (!this.delay) {
            this.dots--;
            if (this.dots < 0) {
                this.dots = 3 + Math.random() * 4;
            }
            this.background = (this.background + 1) % 6;
            this.tree = (this.tree + 1) % 3;
            this.flash = (this.flash + 1) % 10;
        }
        if (sounds['wave'].paused)
            sounds['wave'].play();
    } else if (Outrun.scene == IN_GAME_SCENE) {
        if (sounds['music-' + this.music].paused)
            sounds['music-' + this.music].play();
    }
}

AudioManager.prototype.draw = function () {
    Canvas.fill('#008BFF');
    Canvas.drawStaticImage(sprites['radio-car'], 0, 0, Canvas.width, Canvas.height);
    Canvas.drawStaticImage(sprites['radio'], 127, 166, 126, 30);
    Canvas.drawStaticImage(sprites['radio-freq-' + this.music], 143, 173, 24, 7);
    for (var i = 0; i < this.dots; i++) {
        Canvas.drawStaticImage(sprites['radio-dot-' + (i < 4 ? 'green' : 'red')], 156 + i * 3, 187, 2, 2);
        Canvas.drawStaticImage(sprites['radio-dot-' + (i < 4 ? 'green' : 'red')], 156 + i * 3, 190, 2, 2);
    }
    Canvas.drawStaticImage(sprites['radio-hand-' + this.music], 117, 165, 133, 59);
    if (Outrun.scene == MENU_SCENE) {
        Canvas.drawStaticImage(sprites['logo-bg-' + this.background], 72, 18, 176, 88);
        Canvas.drawStaticImage(sprites['logo-road'], 81, 80, 95, 25);
        Canvas.drawStaticImage(sprites['logo-car'], 127, 66, 64, 39);
        Canvas.drawStaticImage(sprites['logo-tree-' + this.tree], 75, 30, 46, 57);
        Canvas.drawStaticImage(sprites['logo-text'], 109, 33, 135, 36);
        if (this.flash < 5)
            Canvas.drawStaticImage(sprites['press-enter'], 111, 123, 97, 8);
    } else {
        Canvas.drawStaticImage(sprites['select-music'], 65, 67, 191, 14);
        if (this.music == 0) {
            Canvas.drawStaticImage(sprites['music-0'], 72, 88, 175, 16);
        } else if (this.music == 1) {
            Canvas.drawStaticImage(sprites['music-1'], 96, 88, 127, 16);
        } else {
            Canvas.drawStaticImage(sprites['music-2'], 108, 88, 103, 16);
        }
    }
}

let Radio = new AudioManager();