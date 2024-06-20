class AudioManager {
  constructor() {
    this.sounds = {};
  }

  // Load a sound and store it in the sounds object
  loadSound(name, src) {
    const sound = new Audio(src);
    this.sounds[name] = sound;
  }

  // Play a sound by name
  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    }
  }

  // Stop a sound by name
  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    }
  }

  // Set the volume for a specific sound
  setVolume(name, volume) {
    if (this.sounds[name]) {
      this.sounds[name].volume = volume;
    }
  }
}

// Instantiate AudioManager and load sounds
const audioManager = new AudioManager();
audioManager.loadSound("coin", "assets/sounds/coin.wav");
audioManager.loadSound("chat", "assets/sounds/chat.wav");
audioManager.loadSound("levelComplete", "assets/sounds/levelcomplete.wav");
audioManager.loadSound("menu", "assets/sounds/menu.wav");
audioManager.loadSound("treasure", "assets/sounds/treasure.wav");
audioManager.loadSound("background", "assets/sounds/backgroundmusic.mp3");

// Set initial volume for background music
audioManager.setVolume("background", 0.25);
