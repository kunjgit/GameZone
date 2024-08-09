import * as Constants from "./includes/Constants.js";

import LoadingScene from "./scenes/LoadingScene.js";
import MainScene from "./scenes/MainScene.js";
import GameScene from "./scenes/GameScene.js";

new Phaser.Game({
	type: Phaser.AUTO,
	parent: "infinite-cars",
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			debug: Constants.IS_DEBUG,
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: Constants.SCREEN_WIDTH,
		height: Constants.SCREEN_HEIGHT,
		min: {
			width: Constants.MIN_SCREEN_WIDTH,
			height: Constants.MIN_SCREEN_HEIGHT,
		},
		max: {
			width: Constants.MAX_SCREEN_WIDTH,
			height: Constants.MAX_SCREEN_HEIGHT,
		},
	},
	scene: [
		LoadingScene,
		MainScene,
		GameScene,
	],
});
