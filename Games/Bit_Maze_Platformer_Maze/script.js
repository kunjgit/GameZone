'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

console.clear();

class Settings {}_defineProperty(Settings, "MAP",
[
[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 2, 2, 2, 2, 2, 2, 0, 1],
[1, 0, 2, 0, 0, 0, 0, 2, 2, 1],
[1, 0, 2, 0, 2, 2, 0, 2, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
[1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
[1, 0, 0, 1, 1, 0, 1, 1, 1, 1],
[1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
[1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 3, 3, 0, 0, 0, 1],
[3, 3, 3, 3, 4, 4, 3, 3, 3, 3]]);_defineProperty(Settings, "TRAPS_MAP",


[
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);_defineProperty(Settings, "BLOCK_SIZE",


32);_defineProperty(Settings, "CHARACTER_X",

Settings.BLOCK_SIZE * 8);_defineProperty(Settings, "CHARACTER_Y",
Settings.BLOCK_SIZE * 1);_defineProperty(Settings, "FINISH_X",

Settings.BLOCK_SIZE * 8);_defineProperty(Settings, "FINISH_Y",
Settings.BLOCK_SIZE * 13);_defineProperty(Settings, "FONT_SETTINGS",

{
  fontFamily: 'VT323',
  fontSize: 24,
  stroke: '#000000',
  strokeThickness: 4 });_defineProperty(Settings, "IS_DEBUG",


false);


class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const path = 'https://assets.codepen.io/430361';

    this.load.image('character', `${path}/bit-maze-character.png`);
    this.load.image('block', `${path}/bit-maze-block.png`);
    this.load.image('grass', `${path}/bit-maze-grass.png`);
    this.load.image('land', `${path}/bit-maze-land.png`);
    this.load.image('cloud', `${path}/bit-maze-cloud.png`);
    this.load.image('background', `${path}/bit-maze-background.png`);
    this.load.image('tilemap', `${path}/bit-maze-tilemap.png`);

    this.load.spritesheet('character-run', `${path}/bit-maze-character-run.png`, {
      frameWidth: 24,
      frameHeight: 24 });

    this.load.spritesheet('character-jump', `${path}/bit-maze-character-jump.png`, {
      frameWidth: 24,
      frameHeight: 24 });

    this.load.spritesheet('character-idle', `${path}/bit-maze-character-idle.png`, {
      frameWidth: 24,
      frameHeight: 24 });

    this.load.spritesheet('character-trap', `${path}/bit-maze-character-trap.png`, {
      frameWidth: 24,
      frameHeight: 24 });

    this.load.spritesheet('buttons', `${path}/bit-maze-buttons.png`, {
      frameWidth: 48,
      frameHeight: 48 });

    this.load.spritesheet('trap', `${path}/bit-maze-trap.png`, {
      frameWidth: Settings.BLOCK_SIZE,
      frameHeight: Settings.BLOCK_SIZE });

    this.load.spritesheet('finish', `${path}/bit-maze-finish.png`, {
      frameWidth: Settings.BLOCK_SIZE,
      frameHeight: Settings.BLOCK_SIZE });


    this.load.on("complete", evt => {
      this.cameras.main.fadeOut(128);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start('Main');
      }, this);
    });
  }}


class MainScene extends Phaser.Scene {







  constructor() {
    super('Main');_defineProperty(this, "mapLayer", null);_defineProperty(this, "finish", null);_defineProperty(this, "traps", null);_defineProperty(this, "leftKey", false);_defineProperty(this, "rightKey", false);_defineProperty(this, "jumpKey", false);
  }

  createMap() {
    let width = this.game.config.width;
    let height = this.game.config.height;

    this.add.image(width / 2, height / 2, 'background').setScrollFactor(0);

    const map = this.make.tilemap({
      data: Settings.MAP,
      tileWidth: Settings.BLOCK_SIZE,
      tileHeight: Settings.BLOCK_SIZE });


    const tileset = map.addTilesetImage('tilemap');

    this.mapLayer = map.createLayer(0, tileset, 0, 0);
    this.mapLayer.setCollision([1, 2, 3, 4]);
  }

  placeCharacter() {
    const x = Settings.CHARACTER_X;
    const y = Settings.CHARACTER_Y;

    this.physics.add.sprite(x, y, 'character').
    setName('character').
    setOrigin(0).
    refreshBody().
    setBounce(0.3).
    setDepth(1);

    let character = this.children.getByName('character');

    character.setCollideWorldBounds(true);

    const b = Settings.BLOCK_SIZE;
    const width = Settings.MAP[0].length * b;
    const height = Settings.MAP.length * b;

    this.setCharacterCamera(width, height);
  }

  setGameOver(otherText) {
    this.physics.world.pause();

    let width = this.game.config.width;

    this.add.text(
    width / 2, 168, otherText, Settings.FONT_SETTINGS).
    setOrigin(0.5).
    setScrollFactor(0).
    setDepth(2);
    this.add.text(
    width / 2, 192, 'PRESS ANYWHERE TO RETRY', Settings.FONT_SETTINGS).
    setOrigin(0.5).
    setScrollFactor(0).
    setDepth(2);

    this.tweens.add({
      targets: [
      this.children.getByName('btn-left'),
      this.children.getByName('btn-right'),
      this.children.getByName('btn-up')],

      alpha: 0,
      tease: 'Sine.easeOut',
      duration: 256 });


    this.input.once('pointerdown', () => {
      this.scene.restart();
    });

    this.input.keyboard.once('keydown', () => {
      this.scene.restart();
    });
  }

  setCharacterCamera(width, height) {
    let boundary = new Phaser.Geom.Rectangle(0, 0, width, height);
    let character = this.children.getByName('character');

    character.body.setBoundsRectangle(boundary);

    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(character, true, 1, 1);
  }

  setCharacterAnimation() {
    this.anims.create({
      key: 'character-run',
      frames: this.anims.generateFrameNumbers('character-run', {
        start: 0,
        end: 7 }),

      frameRate: 10,
      repeat: -1 });

    this.anims.create({
      key: 'character-jump',
      frames: this.anims.generateFrameNumbers('character-jump', {
        start: 0,
        end: 1 }),

      frameRate: 17.5 });

    this.anims.create({
      key: 'character-idle',
      frames: this.anims.generateFrameNumbers('character-idle', {
        start: 0,
        end: 2 }),

      frameRate: 7,
      repeat: -1,
      yoyo: true });

    this.anims.create({
      key: 'character-trap',
      frames: this.anims.generateFrameNumbers('character-trap', {
        start: 0,
        end: 7 }),

      frameRate: 10 });

  }

  createLeftController() {
    this.add.image(32, 208, 'buttons').
    setName('btn-left').
    setFrame(0).
    setScrollFactor(0).
    setInteractive().
    on('pointerdown', () => {
      this.leftKey = true;
      this.hideInstructions();
    }).on('pointerup', () => {
      this.leftKey = false;
    });

    this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.LEFT).
    on('down', () => {
      this.leftKey = true;
      this.hideInstructions();
    }).on('up', () => {
      this.leftKey = false;
    });
  }

  createRightController() {
    this.add.image(288, 208, 'buttons').
    setName('btn-right').
    setFrame(1).
    setScrollFactor(0).
    setInteractive().
    on('pointerdown', () => {
      this.rightKey = true;
      this.hideInstructions();
    }).on('pointerup', () => {
      this.rightKey = false;
    });

    this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.RIGHT).
    on('down', () => {
      this.rightKey = true;
      this.hideInstructions();
    }).on('up', () => {
      this.rightKey = false;
    });
  }

  createJumpController() {
    this.add.image(288, 154, 'buttons').
    setName('btn-up').
    setFrame(2).
    setScrollFactor(0).
    setInteractive().
    on('pointerdown', () => {
      this.jumpKey = true;
      this.hideInstructions();
    }).on('pointerup', () => {
      this.jumpKey = false;
    });

    this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.UP).
    on('down', () => {
      this.jumpKey = true;
      this.hideInstructions();
    }).on('up', () => {
      this.jumpKey = false;
    });

    this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE).
    on('down', () => {
      this.jumpKey = true;
      this.hideInstructions();
    }).on('up', () => {
      this.jumpKey = false;
    });
  }

  createController() {
    this.input.addPointer(2);

    this.createLeftController();
    this.createRightController();
    this.createJumpController();
  }

  hideInstructions() {
    const txtInstructions = this.children.getByName('txt-instructions');

    if (txtInstructions === null || this.tweens.getTweensOf(txtInstructions).length > 0) {
      return;
    }

    this.tweens.add({
      targets: txtInstructions,
      alpha: 0,
      tease: 'Sine.easeOut',
      duration: 512,
      onComplete: evt => {
        evt.targets[0].destroy();
      } });

  }

  placeFinish() {
    const x = Settings.FINISH_X;
    const y = Settings.FINISH_Y;

    this.finish = this.physics.add.staticSprite(x, y, 'finish').
    setName('finish').
    setOrigin(0).
    refreshBody().
    setDepth(1);
    this.finish.anims.play('finish');
  }

  placeTraps() {
    const map = Settings.TRAPS_MAP;
    const b = Settings.BLOCK_SIZE;

    this.traps = this.physics.add.staticGroup();

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 0) {
          continue;
        }

        this.traps.create(x * b, y * b, 'trap').
        setOrigin(0).
        refreshBody();
      }
    }
  }

  setCollision() {
    let character = this.children.getByName('character');

    this.physics.add.collider(character, this.mapLayer);
    this.physics.add.collider(character, this.traps, (obj1, obj2) => {
      character.anims.play('character-trap');

      obj2.anims.play('trap');

      this.setGameOver('YOU GOT CAUGHT BY A TRAP!');
    });
    this.physics.add.collider(character, this.finish, () => {
      this.setGameOver('YOU COMPLETED THE GAME!');
    });
  }

  setObjectAnimation() {
    this.anims.create({
      key: 'trap',
      frames: this.anims.generateFrameNumbers('trap', {
        start: 1,
        end: 4 }),

      frameRate: 10,
      repeat: -1 });

    this.anims.create({
      key: 'finish',
      frames: this.anims.generateFrameNumbers('finish', {
        start: 0,
        end: 2 }),

      frameRate: 7.5,
      repeat: -1,
      yoyo: true });

  }

  create() {
    this.placeCharacter();
    this.createMap();
    this.createController();
    this.setCharacterAnimation();
    this.setObjectAnimation();
    this.placeFinish();
    this.placeTraps();
    this.setCollision();

    let width = this.game.config.width;

    this.add.text(
    width / 2, 192, 'PRESS ARROW KEYS TO MOVE', Settings.FONT_SETTINGS).
    setName('txt-instructions').
    setOrigin(0.5).
    setScrollFactor(0).
    setDepth(2);
  }

  animateCharacter() {
    let character = this.children.getByName('character');

    if (this.leftKey === true) {
      character.setVelocityX(-60);
      character.setFlipX(false);
      character.anims.play('character-run', true);
    } else
    if (this.rightKey === true) {
      character.setVelocityX(60);
      character.setFlipX(true);
      character.anims.play('character-run', true);
    } else
    {
      character.setVelocityX(0);
    }

    if (character.body.blocked.down && character.body.velocity.x === 0) {
      character.anims.play('character-idle', true);
    }

    if (character.body.blocked.down && this.jumpKey === true) {
      character.setVelocityY(760);
    }

    if (
    !character.body.blocked.down && (


    character.anims.currentAnim === null ||

    character.anims.currentAnim.key !== 'character-jump'))

    {
      character.anims.play('character-jump');
    }
  }

  update() {
    if (this.physics.world.isPaused === true) {
      return;
    }

    this.animateCharacter();
  }}


new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'bit-maze',
  pixelArt: true,
  parent: {
    activePointers: 3 },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400 },

      debug: false } },


  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 320,
    height: 240,
    min: {
      width: 40,
      height: 30 },

    max: {
      width: 1280,
      height: 960 } },


  scene: [
  PreloadScene,
  MainScene] });