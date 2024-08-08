"use strict";

import * as Constants from "../includes/Constants.js";
import * as Methods from "../includes/Methods.js";

export default class GameScene extends Phaser.Scene {
	constructor() {
		super("Game");
	}
	
	setCamera() {
		Methods.log("Setting the camera...");
		
		const screenWidth = Constants.SCREEN_WIDTH;
		const screenHeight = Constants.SCREEN_HEIGHT;
		const offsetY = screenHeight - Constants.INITIAL_CHARACTER_Y;
		
		this.cameras.main.startFollow(this.character, true, 0, 1, 0, offsetY);
		
		Methods.log(`Camera view is set to ${screenWidth}x${screenHeight}`);
	}
	
	createExplosionAnimation() {
		Methods.log("Creating explosion animation...");
		
		this.anims.create({
			key: "explosion",
			frames: this.anims.generateFrameNumbers("explosion", {
				start: 0,
				end: 7,
			}),
			frameRate: 10,
			repeat: -1,
		});
	}
	
	drawBoundary() {
		if (Constants.IS_DEBUG) {
			this.boundaryDebug = 
				this.add.graphics()
					.lineStyle(3, 0x00ffff, 1)
					.strokeRectShape(this.character.body.customBoundsRectangle)
					.setDepth(Constants.SCREEN_HEIGHT);
		}
	}
	
	setCharacterBoundary() {
		Methods.log("Setting the boundary of the character...");
		
		let start = Constants.ROAD_BOUNDARY[0];
		let end = Constants.ROAD_BOUNDARY[1];
		
		this.boundary = new Phaser.Geom.Rectangle(
			start, -Constants.TILE_HEIGHT, end - start, Constants.SCREEN_HEIGHT);
		
		this.character.setCollideWorldBounds(true);
		this.character.body.setBoundsRectangle(this.boundary);
		
		this.drawBoundary();
		
		Methods.log(`Character boundary created from ${start} to ${end}`);
	}
	
	setControls() {
		Methods.log("Setting up the controls...");
		
		this.character.setInteractive();
		
		this.input.setDraggable(this.character);
		
		this.input.on("drag", (ptr, obj, x, y) => {
			if (this.physics.world.isPaused === true) {
				return;
			}
			
			this.character.setX(x);
		});
		
		Methods.log("Controls successfully added. Character is now draggable");
	}
	
	addObjects() {
		Methods.log("Adding objects...");
		
		this.roadCones = this.physics.add.staticGroup();
		this.computerCars = this.physics.add.group();
		
		this.computerCars.defaults = {};
		
		Methods.log("Object group added to the scene");
	}
	
	addExplosion() {
		const explosion = this.add.sprite(
			this.character.x, this.character.y, "explosion")
			.setDepth(Constants.SCREEN_HEIGHT)
			.setScale(1.5);
		
		explosion.anims.play("explosion");
	}
	
	createRetryButton() {
		Methods.log("Creating retry button...");
		
		const retryButton = Methods.createText(this, "Press anywhere");
		
		Methods.log(`retryButton added to ${retryButton.x}, ${retryButton.y}`);
		
		this.input.once("pointerdown", (evt) => {
			Methods.log("retryButton is pressed");
			
			this.crashedSound.stop();
			this.selectSound.play();
			
			this.scene.restart();
		});
	}
	
	setHighScore() {
		Methods.log("Setting the high score...");
		
		const score = this.score.getData("value");
		const width = Constants.SCREEN_WIDTH;
		const height = Constants.SCREEN_HEIGHT;
		
		try {
			let highScore = localStorage.getItem("InfiniteCarsHighScore");
			highScore = parseFloat(highScore);

			if (highScore > score) {
				Methods.log(`The high score is ${highScore}`);

				return;
			}

			localStorage.setItem("InfiniteCarsHighScore", score);

			Methods.log(`The high score is now set to ${highScore}`);
		}
		catch (e) {
			Methods.log("Failed to get highscore data", e);
		}
	}
	
	setGameOver() {
		Methods.log("You collided with other object!");
		
		this.physics.world.pause();
		
		this.setHighScore();
		
		const width = Constants.SCREEN_WIDTH;
		const height = Constants.SCREEN_HEIGHT;
		
		Methods.addText(this, width / 2, height / 2, "Crashed!", "24px")
			.setDepth(height + 100)
			.setOrigin(0.5, 0.5)
			.setScrollFactor(0);
		
		try {
			const highScore = localStorage.getItem("InfiniteCarsHighScore");
			const highScoreText = `High score: ${highScore}`;

			Methods.addText(this, width / 2, (height / 2) + 32, highScoreText, "16px")
				.setDepth(height + 100)
				.setOrigin(0.5, 0.5)
				.setScrollFactor(0);
		}
		catch (e) {
			Methods.log("Failed to get highscore data", e);
		}
		
		Methods.log("Physics world is now paused");
		
		this.addExplosion();
		
		this.accelerateSound.stop();
		this.driveSound.stop();
		this.crashedSound.play();
		
		this.createRetryButton();
	}
	
	setCollisions() {
		Methods.log("Setting collisions...");
		
		this.physics.add.collider(this.character, this.roadCones, () => {
			this.setGameOver();
		});
		this.physics.add.collider(this.character, this.computerCars, () => {
			this.setGameOver();
		});
		
		this.physics.add.collider(this.roadCones, this.roadCones);
		this.physics.add.collider(this.roadCones, this.computerCars);
		
		this.physics.add.collider(this.computerCars, this.computerCars);
		
		Methods.log("Collision is now set");
	}
	
	initializeScore() {
		Methods.log("Initializing score board...");
		
		const height = Constants.SCREEN_HEIGHT;
		const text = "Score: 0";
		
		this.score = Methods.addText(this, 16, 16, text, "16px")
			.setDepth(height + 100)
			.setScrollFactor(0)
			.setDataEnabled()
			.setData("value", 0);
		
		Methods.log("Score initialized");
  }
	
	setStarter() {
		Methods.log("Creating the stop light...");
		
		this.anims.create({
			key: "stop-light",
			frames: this.anims.generateFrameNumbers("stop-light", {
				start: 0,
				end: 3,
			}),
			frameRate: 1,
		});
		
		const height = Constants.SCREEN_HEIGHT;
		
		this.stopLight = this.add.sprite(
			Constants.SCREEN_WIDTH / 2, Constants.SCREEN_HEIGHT / 2, "stop-light")
			.setScrollFactor(0)
			.setDepth(height);
		
		const instructions = "Drag the red car to move";
		
		this.instructions =
			Methods.addText(this, Constants.SCREEN_WIDTH / 2, 400, instructions, "16px")
				.setDepth(height)
				.setOrigin(0.5)
				.setScrollFactor(0);
			
		this.stopLight.anims.play("stop-light");
		
		this.startSound.play();
		
		Methods.log("Stop light created");
		Methods.log("Creating stop light timer...");
		
		this.time.addEvent({
			delay: Constants.GAME_START_TIME,
			callback: () => {
				Methods.log("Game started");
				
				this.physics.world.resume();
				
				this.tweens.add({
					targets: [this.stopLight, this.instructions],
					alpha: 0,
					ease: "Sine.easeOut",
					duration: 512,
					onComplete: () => {
						Methods.log("Removing the stop light instance...");
						
						this.stopLight.destroy();
						this.instructions.destroy();
						
						this.accelerateSound.play();
						this.accelerateSound.addListener("complete", () => {
							this.driveSound.play({
								loop: true,
							})
						})
					}
				});
			},
		});
		
		Methods.log("Stop light timer created");
	}
	
	initialize() {
		this.lowestMapY = -32;
		
		Methods.createMap(this);
		Methods.placeCharacter(this, true);
		Methods.addSoundControl(this);
		Methods.addAudios(this);
		
		this.physics.world.pause();
		
		this.setCharacterBoundary();
		this.setControls();
		this.setCamera();
		this.createExplosionAnimation();
		
		this.addObjects();
		this.setCollisions();
		
		this.character.setVelocityY(-Constants.CHARACTER_SPEED);
		
		this.initializeScore();
		this.setStarter();
	}
	
	create() {
		Methods.sceneEntry(this);
		
		this.initialize();
	}
	
	repositionBoundary() {
		if (Constants.IS_DEBUG) {
			this.boundaryDebug.destroy();
		}
		
		const start = Constants.ROAD_BOUNDARY[0];
		
		this.boundary.setPosition(start, this.cameras.main.scrollY);
		this.drawBoundary();
	}
	
	addRoad() {
		const cameraY = this.cameras.main.scrollY;
		
		if (cameraY - Constants.TILE_HEIGHT > this.lowestMapY) {
			return false;
		}
		
		this.lowestMapY -= Constants.TILE_HEIGHT;
		
		Methods.addMapRow(this, this.lowestMapY);
		
		return true;
	}
	
	getRoadBoundary() {
		const start = Constants.ROAD_BOUNDARY[0]; // + Constants.TILE_WIDTH
		const end = Constants.ROAD_BOUNDARY[1]; // - Constants.TILE_WIDTH
		
		return Methods.random(start, end, 3);
	}
	
	addRoadCone() {
		if (Methods.random(0, 100) > Constants.ROAD_CONE_RATE) {
			return;
		}
		
		const x = this.getRoadBoundary();
		
		const roadCone =
			this.physics.add.staticImage(x, this.lowestMapY, "road-cone")
				.setDepth(Constants.SCREEN_HEIGHT);
		
		this.roadCones.add(roadCone);
	}
	
	removeRoadCone() {
		for (const roadCone of this.roadCones.getChildren()) {
			if (roadCone.y > this.character.y + (Constants.SCREEN_HEIGHT * 0.25)) {
				Methods.log("Removing road cone...")
				
				roadCone.destroy();
				
				Methods.log("Road cone is removed");
				
				break;
			}
		}
	}
	
	addComputerCar() {
		if (Methods.random(1, 100) > Constants.COMPUTER_CAR_RATE) {
			return;
		}
		
		const isFast = (Methods.random(1, 100) < 50) ? false : true;
		const x = this.getRoadBoundary();
		
		let y = this.lowestMapY;
		let minSpeed = Constants.COMPUTER_SLOW_SPEED_MIN;
		let maxSpeed = Constants.COMPUTER_SLOW_SPEED_MAX;
		
		if (isFast === true) {
			y += (Constants.SCREEN_HEIGHT * 2);
			minSpeed = Constants.COMPUTER_FAST_SPEED_MIN;
			maxSpeed = Constants.COMPUTER_FAST_SPEED_MAX;
		}
		
		const speed = Methods.random(minSpeed, maxSpeed);
		const computerCar =
			this.physics.add.sprite(x, y, "computer")
				.setDepth(Constants.SCREEN_HEIGHT)
				.setOrigin(0.5, 1)
				.refreshBody()
				.setDataEnabled()
				.setData("isFast", isFast)
				.setData("velocity", speed * -1)
				.setVelocityY(-(speed));
		
		this.computerCars.add(computerCar);
	}
	
	removeComputerCar() {
		const y = this.character.y;
		const h = Constants.SCREEN_HEIGHT;
		
		for (const computerCar of this.computerCars.getChildren()) {
			const isFast = computerCar.data.list.isFast;
			const cy = computerCar.y;
			
			if (
				(isFast === false && cy > y + (h * 0.25))
				||
				(isFast === true && cy < y - (h * 2))
			) {
				Methods.log("Removing computer car...");
				
				computerCar.destroy();
				
				Methods.log("Computer car is removed");
				
				break;
			}
		}
	}
	
	dodgeComputerCar() {
		for (const computerCar of this.computerCars.getChildren()) {
			const w = computerCar.width;
			const x = computerCar.x;
			const y = computerCar.y
			
			const dodgeList = [].concat(
				this.roadCones.getChildren(),
				this.computerCars.getChildren(),
			);
			
			// 0 = left
			// 1 = right
			let direction = computerCar.data.list.direction;
			let isDodge = false;
			
			for (const dodge of dodgeList) {
				const dw = dodge.width;
				const dx = dodge.x;
				const dy = dodge.y;
				
				if (dy > y) {
					continue;
				}
				
				if (
					Math.abs(dy - y) <= Constants.COMPUTER_DODGE_DISTANCE
					&&
					(
						(x - (w / 2) < (dx - (dw / 2)) && x + (w / 2) > (dx - (dw / 2)))
						||
						(dx - (dw / 2) < (x - (w / 2)) && dx + (dw / 2) > (x - (w / 2)))
					)
				) {
					isDodge = true;
					
					break;
				}
			}
			
			if (isDodge === false) {
				computerCar.setVelocityX(0);
				computerCar.setVelocityY(computerCar.data.list.velocity);
				
				continue;
			}
			
			if (Methods.isNullOrUndefined(direction) === true) {
				direction = Methods.random(0, 1);
			}
			
			if (direction === 0) {
				direction = -1;
			}
			
			if (
				(direction === -1 && x - (w / 2) < Constants.ROAD_BOUNDARY[0])
				||
				(direction === 1 && x + (w / 2) > Constants.ROAD_BOUNDARY[1])
			) {
				direction *= -1;
			}
			
			computerCar.setData("direction", direction);
			computerCar.setVelocityX(direction * Constants.COMPUTER_DODGE_SPEED);
		}
	}
	
	setScore() {
		const height = Constants.SCREEN_HEIGHT;
		const score = Math.abs(this.character.y - (height * 0.75));
		const scoreValue = Math.round(score * 100) / 100;
		const text = `Score: ${scoreValue}`;
		
		this.score.setText(text);
		this.score.setData("value", scoreValue);
	}
	
	setOvertake() {
		for (const computerCar of this.computerCars.getChildren()) {
			if (Math.floor(computerCar.y) === Math.floor(this.character.y)) {
				this.overtakeSound.play();
			}
		}
	}
	
	updateWorld() {
		if (this.physics.world.isPaused === true) {
			return;
		}
		
		this.repositionBoundary();
		
		const isAddRoad = this.addRoad();
		
		if (isAddRoad === true) {
			this.addRoadCone();
			this.addComputerCar();
		}
		
		this.removeRoadCone();
		this.removeComputerCar();
		this.dodgeComputerCar();
		this.setScore();
		this.setOvertake();
	}
	
	update() {
		this.updateWorld();
	}
}
