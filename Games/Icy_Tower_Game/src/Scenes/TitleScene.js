import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

const COLOR_PRIMARY = 0x305556;
const COLOR_LIGHT = 0x40798e;

const { GetValue } = Phaser.Utils.Objects;
const CreateLoginDialog = (scene, config) => {
  let username = GetValue(config, 'username', '');
  const title = GetValue(config, 'title');
  const x = GetValue(config, 'x', 0);
  const y = GetValue(config, 'y', 0);
  const width = GetValue(config, 'width', undefined);
  const height = GetValue(config, 'height', undefined);

  const background = scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_PRIMARY);
  const titleField = scene.add.text(0, 0, title);
  const userNameField = scene.rexUI.add
    .label({
      orientation: 'x',
      background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT),
      text: scene.rexUI.add.BBCodeText(0, 0, username, { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
      space: { left: 10, bottom: 0, top: 0 },
    })
    .setInteractive()
    .on('pointerdown', () => {
      const config = {
        onTextChanged(textObject, text) {
          username = text;
          textObject.text = text;
        },
      };
      scene.rexUI.edit(userNameField.getElement('text'), config);
    });

  const loginButton = scene.rexUI.add
    .label({
      orientation: 'x',
      background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
      text: scene.add.text(0, 0, 'PLAY'),
      space: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8,
      },
    })
    .setInteractive()
    .on('pointerdown', () => {
			loginDialog.emit('login', username); /* eslint-disable-line */
    });

  const loginDialog = scene.rexUI.add
    .sizer({
      orientation: 'y',
      x,
      y,
      width,
      height,
    })
    .addBackground(background)
    .add(
      titleField,
      0,
      'center',
      {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      false,
    )
    .add(userNameField, 0, 'top', { bottom: 10, left: 10, right: 10 }, true)
    .add(loginButton, 0, 'center', { bottom: 10, left: 10, right: 10 }, false)
    .layout();

  return loginDialog;
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  preload() {
    this.add.image(config.width / 2, config.height / 2, 'background');
  }

  create() {
    // Options
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 100,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options',
    );

    // Credits
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'Credits',
      'Credits',
    );

    // Scoreboard
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 100,
      'blueButton1',
      'blueButton2',
      'ScoreBoard',
      'ScoreBoard',
    );

    this.model = this.sys.game.globals.model;
    const { model } = this;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
    CreateLoginDialog(this, {
      x: config.width / 2,
      y: 200,
      title: 'Please enter your username',
      username: model.userName,
    }).on('login', function played(username) {
      if (username.length > 0) {
        model.userName = username;
        this.scene.scene.start('Game');
      }
    });
  }

  centerButton(gameObject, offset = 0) {
    const cW = config.width;
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(cW / 2, config.height / 2 - offset * 100, cW, config.height),
    );
  }
  /* eslint-disable */
	centerButtonText(gameText, gameButton) {
		Phaser.Display.Align.In.Center(gameText, gameButton);
	}
	/* eslint-enable */
}
