import Phaser from 'phaser';
import config from '../Config/config';
import { updateScore } from '../modules/score';

let cursors;
let score = 0;
let scoreText;

const gameOptions = {
  platformStartSpeed: 75,
  platformSizeRange: [200, 350],
  platformCounter: 0,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.add.image(config.width / 2, config.height / 2, 'background');
    this.load.image('platform', '../src/assets/platform.png');
    this.load.spritesheet('dude', '../src/assets/dude.png', { frameWidth: 32, frameHeight: 64 });
    this.sys.game.globals.bgMusic.stop();
    this.jumper = this.sound.add('jumper', { volume: 1, loop: false });
    this.sys.game.globals.jumper = this.jumper;
  }

  create() {
    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    this.addPlatform(config.width, config.width / 2);

    this.player = this.physics.add.sprite(100, -100, 'dude');
    this.player.body.setGravityY(400);
    this.player.setBounce(0.2);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.platformGroup);

    scoreText = this.add.text(280, 730, 'Score:0', { fontSize: '40px', fill: '#222' });
  }

  addPlatform(platformWidth, posX) {
    let platform;
		platform = this.physics.add.sprite(posX, config.height * 0, 'platform'); // eslint-disable-line
    platform.setImmovable(true);
    platform.setVelocityY(score / 2 + 60);
    this.platformGroup.add(platform);

    platform.displayWidth = platformWidth;
  }

  update() {
    this.model = this.sys.game.globals.model;

    if (this.player.y > config.height) {
      /* eslint-disable */
			let url =
				'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/gv40Y9XXDktliqpcA0vA/scores';
			/* eslint-enable */
      const data = {
        user: this.model.userName,
        score,
      };
      fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      gameOptions.platformCounter = 0;
      score = 0;
      this.create();
      this.scene.start('ScoreBoard');
    }

    const platform = this.platformGroup.getChildren();
    const canvasWidth = 500;
    for (let i = gameOptions.platformCounter; i < platform.length; i += 1) {
      if (platform[i].y > 150) {
        const nextPlatformWidth = Phaser.Math.Between(
          gameOptions.platformSizeRange[0],
          gameOptions.platformSizeRange[1],
        );
        let position;

        if (gameOptions.platformCounter % 2 === 0) {
          position = Phaser.Math.Between(0, canvasWidth / 2);
        } else {
          position = Phaser.Math.Between(canvasWidth / 2, canvasWidth);
        }

        this.addPlatform(nextPlatformWidth, position);
        score = updateScore(score);
        scoreText.setText(`Score:${score}`);
        gameOptions.platformCounter += 1;
      }
    }
    if (cursors.left.isDown) {
      this.player.setVelocityX(-180);
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(180);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (cursors.up.isDown && this.player.body.touching.down) {
      this.sys.game.globals.jumper.play();
      this.player.setVelocityY(-340);
    }
  }
}
