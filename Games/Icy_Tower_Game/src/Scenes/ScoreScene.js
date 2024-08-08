import Phaser from 'phaser';
import config from '../Config/config';
import { getScore } from '../modules/score';
import Button from '../Objects/Button';

const updatePanel = (panel, content) => {
  const sizer = panel.getElement('panel');
  const { scene } = panel;

  sizer.clear(true);
  const lines = content.split('\n');
  for (let li = 0, lcnt = lines.length; li < lcnt; li += 1) {
    const words = lines[li].split(' ');
    for (let wi = 0, wcnt = words.length; wi < wcnt; wi += 1) {
      sizer.add(
        scene.add
          .text(0, 0, words[wi], {
            fontSize: 30,
          })
          .setInteractive()
          .on('pointerdown', () => {
            this.scene.print.text = this.text;
            this.setTint(Phaser.Math.Between(0, 0xffffff));
          }),
      );
    }
    if (li < lcnt - 1) {
      sizer.addNewLine();
    }
  }

  panel.layout();
  return panel;
};

export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super('ScoreBoard');
  }

  preload() {
    this.add.image(config.width / 2, config.height / 2, 'background');
  }

  async create() {
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height - 50,
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title',
    );

    this.COLOR_PRIMARY = 0x305556;
    this.COLOR_LIGHT = 0x40798e;
    this.COLOR_DARK = 0x89bac7;

    const scoreBoard = this.rexUI.add
      .scrollablePanel({
        x: config.width / 2,
        y: config.height / 2,
        width: 400,
        height: 600,

        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 30, this.COLOR_PRIMARY),

        panel: {
          child: this.rexUI.add.fixWidthSizer({
            space: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5,
              item: 5,
              line: 5,
            },
          }),

          mask: {
            padding: 2,
          },
        },

        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 50,
          panel: 10,
        },
      })
      .layout();
    updatePanel(scoreBoard, 'Loading...');

    let result = await getScore();
    result = result.sort((a, b) => +b.score - +a.score);
    const answer = {};
    result.forEach((element) => {
      if (!answer[element.user]) {
        answer[element.user] = element.score;
      } else if (+element.score > +answer[element.user]) {
        answer[element.user] = element.score;
      }
    });

    let output = 'TOP 10 \n\n';

    const filteredResult = {};

    for (let index = 0; index < 10; index += 1) {
      const key = Object.keys(answer)[index];
      filteredResult[key] = answer[key];
    }
    /* eslint-disable */
		for (const el in filteredResult) {
			output += `${el} - ${filteredResult[el]} \n`;
		}
		/* eslint-enable */
    updatePanel(scoreBoard, output);
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
