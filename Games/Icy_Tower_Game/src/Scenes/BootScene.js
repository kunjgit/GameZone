import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', '../src/assets/logo.gif');
    this.load.image('background', '../src/assets/back.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
