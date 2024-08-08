import Phaser from 'phaser';
import Button from '../Objects/Button';
import config from '../Config/config';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  preload() {
    this.add.image(config.width / 2, config.height / 2, 'background');
  }

  create() {
    this.model = this.sys.game.globals.model;

    this.text = this.add.text(150, 100, 'Options', { fontSize: 40 });
    this.musicButton = this.add.image(100, 200, 'checkedBox');
    this.musicText = this.add.text(150, 190, 'Music Enabled', { fontSize: 24 });

    this.musicButton.setInteractive();

    this.musicButton.on('pointerdown', () => {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    });

    this.menuButton = new Button(this, config.width / 2, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');

    this.updateAudio();
  }

  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box');
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }
  }
}
