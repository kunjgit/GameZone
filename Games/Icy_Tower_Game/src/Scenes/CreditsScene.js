import Phaser from 'phaser';
import config from '../Config/config';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  preload() {
    this.add.image(config.width / 2, config.height / 2, 'background');
  }

  create() {
    this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '45px', fill: '#fff' });
    this.madeByText = this.add.text(
      0,
      0,
      '\n\n Created By: Pavitraa \n\n Inspired from: Icy Tower ',
      { fontSize: '30px', fill: '#fff' },
    );
    this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);

    Phaser.Display.Align.In.Center(this.madeByText, this.zone);

    this.madeByText.setY(1000);
    /*eslint-disable */
		this.creditsTween = this.tweens.add({
			targets: this.creditsText,
			y: -100,
			ease: 'Power1',
			duration: 3000,
			delay: 500,
			onComplete() {
				this.destroy;
			}
		});

		this.madeByTween = this.tweens.add({
			targets: this.madeByText,
			y: -200,
			ease: 'Power1',
			duration: 9000,
			delay: 200,
			onComplete: function() {
				this.madeByTween.destroy;
				this.scene.start('Title');
			}.bind(this)
		});
		/* eslint-enable */
  }
}
