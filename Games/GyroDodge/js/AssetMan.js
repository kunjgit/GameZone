class AssetMan {
  constructor() {
    this.sounds = {};
  }


  preload() {
    this.sounds.music = loadSound('./assets/sfx/music.mp3');
    this.sounds.pew = loadSound('./assets/sfx/laser2.mp3');
    this.sounds.gameover = loadSound('./assets/sfx/gameover.mp3');
    this.sounds.gamewin = loadSound('./assets/sfx/win.mp3');
    this.sounds.blast = loadSound('./assets/sfx/bomb2.mp3');
  }
}