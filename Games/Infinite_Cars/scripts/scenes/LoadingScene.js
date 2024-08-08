"use strict";

import * as Constants from "../includes/Constants.js";
import * as Methods from "../includes/Methods.js";

export default class LoadingScene extends Phaser.Scene {
	constructor() {
		super("Loading");
	}
	
	setAssets() {
		Methods.loadImage(this, "character", "infinite-cars-character.png");
		Methods.loadImage(this, "computer", "infinite-cars-computer.png");
		Methods.loadImage(this, "flower", "infinite-cars-flower.png");
		Methods.loadImage(this, "grass", "infinite-cars-grass.png");
		Methods.loadImage(this, "left-road", "infinite-cars-left-road.png");
		Methods.loadImage(this, "middle-road", "infinite-cars-middle-road.png");
		Methods.loadImage(this, "right-road", "infinite-cars-right-road.png");
		Methods.loadImage(this, "road-cone", "infinite-cars-road-cone.png");
		Methods.loadImage(this, "tree", "infinite-cars-tree.png");
		Methods.loadImage(this, "left-gutter", "infinite-cars-left-gutter.png");
		Methods.loadImage(this, "right-gutter", "infinite-cars-right-gutter.png");
		
		Methods.loadSpriteSheet(this, "explosion", "infinite-cars-explosion.png", 32, 32);
		Methods.loadSpriteSheet(this, "stop-light", "infinite-cars-stop-light.png", 96, 240);
		Methods.loadSpriteSheet(this, "sound", "infinite-cars-sound.png", 16, 16);
		
		Methods.loadAudio(this, "accelerate", "accelerate.wav");
		Methods.loadAudio(this, "crashed", "crashed.wav");
		Methods.loadAudio(this, "drive", "drive.wav");
		Methods.loadAudio(this, "overtake", "overtake.wav");
		Methods.loadAudio(this, "select", "select.wav");
		Methods.loadAudio(this, "start", "start.wav");
	}
	
	createLoader() {
		const progressBar = this.add.graphics();
		const progress = this.add.graphics();
		
		const p = 2;
		const w = 192;
		const h = 24;
		const x = (Constants.SCREEN_WIDTH / 2) - (w / 2);
		const y = (Constants.SCREEN_HEIGHT / 2) - (h / 2);
		
		progressBar.fillStyle(0xffffff, 1);
		progressBar.fillRect(x, y, w, h);
		
		this.load.on("progress", v => {
			progress.clear();
			progress.fillStyle(0x14a02e, 1);
			progress.fillRect(x + p, y + p, (w - (p * 2)) * v, h - (p * 2));
		});
		
		this.load.on("fileprogress", evt => {
			Methods.log(`Asset "${evt.key}" has been loaded`);
		});
		
		this.load.on("complete", evt => {
			Methods.log(`${evt.totalComplete}/${evt.totalToLoad} assets loaded`);
			
			Methods.moveScene(this, "Main");
		});
	}
	
	preload() {
		Methods.log("Start preloading assets...");
		
		this.setAssets();
		this.createLoader();
		
		this.load.on("complete", evt => {
			Methods.log(`${evt.totalComplete}/${evt.totalToLoad} assets loaded`);
			
			Methods.moveScene(this, "Main");
		});
	}
}
