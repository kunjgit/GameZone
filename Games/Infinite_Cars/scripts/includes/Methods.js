"use strict";

import * as Constants from "./Constants.js";

export function log(...message) {
	if (Constants.IS_DEBUG) {
		console.log(...message);
	}
}

export function isNullOrUndefined(obj) {
	return obj === undefined || obj === null;
}

export function random(min, max, flt) {
	flt = isNullOrUndefined(flt) ? 0 : flt;
	flt = 10 ** flt;
	min *= flt;
	max *= flt;

	return Math.round(Math.random() * (max - min) + min) / flt;
}
 
export function sceneEntry(scene) {
	log(`Entering "${scene.scene.key}" scene...`);

	scene.cameras.main.fadeIn(Constants.CAMERA_FADE_TIME);
}

export function moveScene(scene, nextSceneName) {
	log(`Exiting "${scene.scene.key}" scene...`);

	scene.cameras.main.fadeOut(Constants.CAMERA_FADE_TIME);

	scene.cameras.main.once("camerafadeoutcomplete", () => {
		log(`Moving to "${nextSceneName}" scene...`);

		scene.scene.start(nextSceneName);
	}, scene);
}

export function loadImage(scene, key, fileName) {
	scene.load.image(key, `${Constants.IMAGES_PATH}/${fileName}`);
}

export function loadSpriteSheet(scene, key, fileName, frameWidth, frameHeight) {
	scene.load.spritesheet(key, `${Constants.IMAGES_PATH}/${fileName}`, {
		frameWidth: frameWidth,
		frameHeight: frameHeight,
	});
}

export function loadAudio(scene, key, fileName) {
	scene.load.audio(key, `${Constants.AUDIOS_PATH}/${fileName}`);
}

export function addGrassImage(scene, x, y) {
	if (random(0, 100) > Constants.GRASS_RATE) {
		return;
	}
	
	const selectedIndex = random(0, Constants.GRASS_MAP.length - 1);
	const textureKey = Constants.GRASS_MAP[selectedIndex];
	
	const scoreImage =
		scene.add.image(x, y, textureKey)
			.setOrigin(random(0, 1, 3))
			.setDepth(y + 2);
}

export function addMapRow(scene, y) {
	for (let i = 0; i < Constants.ROAD_LAYOUT.length; i++) {
		const textureKey = Constants.ROAD_LAYOUT[i];
		const width = Constants.TILE_WIDTH;
		const x = i * width;

		let	tile = scene.add.image(x, y, textureKey).setOrigin(0).setDepth(y);
		
		scene.roadGroup.add(tile);
		
		if (textureKey === "grass") {
			addGrassImage(scene, x, y);
		}
	}
}

export function createMap(scene) {
	log("Creating map layout...");

	scene.roadGroup = scene.add.group();
	
	const height = Constants.TILE_HEIGHT;

	for (let y = -(height); y < Constants.SCREEN_HEIGHT; y += height) {
		addMapRow(scene, y);
	}

	log("Map layout created");
}

export function placeCharacter(scene, hasPhysics) {
	log("Initializing the character position...");
	
	const x = Constants.INITIAL_CHARACTER_X;
	const y = Constants.INITIAL_CHARACTER_Y;
	
	if (hasPhysics === true) {
		scene.character = scene.physics.add.sprite(x, y, "character");
	}
	else {
		scene.character = scene.add.image(x, y, "character");
	}
	
	scene.character.setDepth(Constants.SCREEN_HEIGHT);
	
	log(`The character is place at ${x}, ${y}`);
}

export function createText(scene, text) {
	const button = scene.add.text(
		Constants.SCREEN_WIDTH / 2,
		Constants.SCREEN_HEIGHT / 1.25,
		text, Constants.FONT_SETTINGS)
			.setOrigin(0.5, 0.5)
			.setScrollFactor(0)
			.setDepth(Constants.SCREEN_HEIGHT)
			.setInteractive();

	scene.tweens.add({
		targets: button,
		alpha: 0,
		ease: "Sine.easeOut",
		duration: 1024,
		repeat: -1,
		yoyo: true,
	});
	
	return button;
}

export function addText(scene, x, y, text, fontSize) {
	const settings = Constants.FONT_SETTINGS;
	
	settings.fontSize = fontSize;
	
	const obj = scene.add.text(x, y, text, settings)
	
	settings.fontSize = "24px";
	
	return obj;
}

export function addSoundControl(scene) {
	log("Creating sound control button...");
	
	scene.soundControl = scene.add.sprite(
		Constants.SCREEN_WIDTH - Constants.SOUND_CONTROL_WIDTH - 16, 16, "sound")
		.setOrigin(0)
		.setScrollFactor(0)
		.setDepth(Constants.SCREEN_HEIGHT)
		.setInteractive();
	
	if (scene.sound.mute === true) {
		scene.soundControl.setFrame(1);
	}
	
	scene.soundControl.on("pointerdown", (pointer, x, y, evt) => {
		evt.stopPropagation();
		
		log("Sound control clicked");
		
		let isMuted = !scene.sound.mute;
		
		scene.sound.setMute(isMuted);
		scene.selectSound.play();
		
		scene.soundControl.setFrame((isMuted === true) ? 1 : 0);
		
		log(`Sound set to ${isMuted === true ? "Mute" : "Unmute"}`);
	});
	
	log("Sound control button created");
}

export function addAudios(scene) {
	scene.accelerateSound = scene.sound.add("accelerate");
	scene.crashedSound = scene.sound.add("crashed");
	scene.driveSound = scene.sound.add("drive");
	scene.overtakeSound = scene.sound.add("overtake");
	scene.selectSound = scene.sound.add("select");
	scene.startSound = scene.sound.add("start");
}
