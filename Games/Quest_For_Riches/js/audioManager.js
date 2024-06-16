class AudioManager {
  constructor() {
    this.sounds = {};
  }

  loadSound(name, src) {
    const sound = new Audio(src);
    this.sounds[name] = sound; // Corrected this line
  }

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    }
  }

  setVolume(name, volume) {
    if (this.sounds[name]) {
      this.sounds[name].volume = volume;
    }
  }
}

const audioManager = new AudioManager();
audioManager.loadSound("coin", "assets/sounds/coin.wav");
audioManager.loadSound("chat", "assets/sounds/chat.wav");
audioManager.loadSound("levelComplete", "assets/sounds/levelcomplete.wav");
audioManager.loadSound("menu", "assets/sounds/menu.wav");
audioManager.loadSound("treasure", "assets/sounds/treasure.wav");
audioManager.loadSound("background", "assets/sounds/backgroundmusic.mp3");
audioManager.setVolume("background", 0.25);
