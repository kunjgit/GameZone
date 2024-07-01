// Import modules
import {player} from "./player.js";
import {enemies} from "./enemies.js";
import {sfx, powerups, startGame} from "../main.js";
import {endPath} from "./path.js";


export class Game {
    constructor() {
        // Game elements
        this.canvas = document.querySelector("#canvas");
        this.displayKills = document.querySelector("#killCount");
        this.currentExp = document.querySelector("#currentExp");
        this.requiredExpText = document.querySelector("#requiredExp");
        this.levelBar = document.querySelector(".level-bar_fill");
        this.notificationText = document.querySelector(".notification");
        this.timerDisplay = document.querySelector("#timerDisplay");
        this.gameOver = document.querySelector(".game--over");
        this.ctx = this.canvas.getContext("2d");
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.minHeight = 0;
        this.maxHeight = 500;

        // On start values
        this.requiredExp = 80;
        this.score = 0;
        this.startingTime;
        this.endTime;
        this.pausedTime;
        this.timePassed;
        this.init;
        this.preGame;
        this.isStarted = false;

        // Time
        this.time = 30;
        this.secondsLeft;
        this.countdown;
        this.currentTime; // Used for pausing / continuing game

        // Scores
        this.highscore;
    };

    // Update kills and increase experience when player kills an enemy
    updateKillcount() {
        player.killCount++;
        this.displayKills.textContent = player.killCount;

        player.exp += 20;
        this.currentExp.textContent = player.exp;

        // When required exp is met, level up
        if(player.exp === this.requiredExp) {
            player.exp = 0;
            this.requiredExp = this.requiredExp * 2;
            this.currentExp.textContent = player.exp;
            this.requiredExpText.textContent = this.requiredExp + " XP";
            player.levelUp();
        }
        let levelExp = (player.exp / this.requiredExp) * 100;
        this.levelBar.style.width = `${levelExp}%`;
    };

    // Increase game's difficulty as time goes by
    increaseDifficulty() {
        // Get how much time has passed since the game has started
        this.endTime = new Date();
        this.timePassed = Math.floor((this.endTime - this.startingTime) / 1000);

        if(this.timePassed === 30) {
            // Clear the interval for enemies shooting
            clearInterval(enemies.enemiesShootingInterval);
            
            // Increase enemies shooting speed
            enemies.speed = 2;
            enemies.shootingSpeed = 600;

            // After speed update, enable interval again
            enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);

            this.displayNotification("They are speeding up!");
        } else if (this.timePassed === 60) {
            // Clear the interval for enemies shooting
            clearInterval(enemies.enemiesShootingInterval);

            // Increase enemies shooting speed
            enemies.speed = 4;
            enemies.shootingSpeed = 400;

            // After speed update, enable interval again
            enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);

            this.displayNotification("They are speeding up again!!");
        } else if (this.timePassed === 90) {
            // Clear the interval for enemies shooting
            clearInterval(enemies.enemiesShootingInterval);

            // Increase enemies shooting speed
            enemies.speed = 8;
            enemies.shootingSpeed = 300;
            
            // After speed update, enable interval again
            enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);
            this.displayNotification("Oh my god, will we make it?!");
        } else if (this.timePassed === 120) {
            // Clear the interval for enemies shooting
            clearInterval(enemies.enemiesShootingInterval);

            // Increase enemies shooting speed
            enemies.speed = 10;
            enemies.shootingSpeed = 200;

            // After speed update, enable interval again
            enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);

            this.displayNotification("They are way too fast!!!");
        }
    };

    // Display notifications
    displayNotification(message) {
        this.notificationText.classList.add("activeNotification");

        this.notificationText.innerHTML = `<i class="material-icons">warning</i> <p>${message}</p>`;

        // Remove the notification active class after 4 seconds
        setTimeout(() => {
            this.notificationText.classList.remove("activeNotification");
        }, 3000);
    }

    // Game's timer
    timer(secondsLeft){
        clearInterval(this.countdown);

        const now = Date.now();
        const then = now + this.time * 1000;
        this.displayTimeLeft(this.time);

        this.countdown = setInterval(() =>{
            this.secondsLeft = Math.round((then - Date.now()) / 1000);

            // Show a warning for few seconds left
            if(this.secondsLeft === 10) {
                this.timerDisplay.classList.add("timeLow");
                this.displayNotification("You don't have much time left!");
            } else if (this.secondsLeft < 0) {
                // If the timer ran out, end the game
                clearInterval(this.countdown);
                clearInterval(game);
                this.endgame(this.secondsLeft);
                return;
            }
            this.currentTime = this.secondsLeft; 
            this.time = this.currentTime;
            
            this.displayTimeLeft(this.secondsLeft);
        }, 1000)
    };

    // Display time left
    displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainder = seconds % 60;
        this.timerDisplay.textContent = `${minutes}:${remainder < 10 ? 0 : ""}${remainder}`;
    };

    // Add playtime when user picks up timer
    addPlaytime() {
        // First remove the class before re-adding it
        document.querySelector(".time").classList.remove("timeShake");

        // Random time awarded for picking up the time renewal
        let minTime = 8;
        let maxTime = 12;
        minTime = Math.ceil(minTime);
        maxTime = Math.floor(maxTime);
        let spawnTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        this.time = this.secondsLeft + spawnTime;
        this.timer(this.time);

        // Display message and add shaking to the time
        document.querySelector(".time").classList.add("timeShake");
        this.timerDisplay.classList.remove("timeLow");
        this.displayNotification("Added play time!");
    };

    // New score
    newScore(finalScore) {
        const inputMenu = document.querySelector(".newHighscore-input");
        const scoreText = document.querySelector("#scoreText");
        const inputField = document.querySelector("#playerName-input");
        const saveBtn = document.querySelector("#savePlayer");
        inputMenu.style.display = "flex";

        // Display different message according to the score
        if(finalScore > this.highscore) {
            scoreText.innerHTML = `<h2 class="newHighscore-notification">NEW HIGHSCORE !!! </h2>`;
        } else {
            scoreText.innerHTML = `<h2>NOT BAD</h2>`;
        }

        // Save player's name and score to local storage
        saveBtn.addEventListener("click", () => {
            const value = inputField.value;
            const results = {
                name: value,
                score: finalScore
            }
            let highscoresArray =  JSON.parse(localStorage.getItem("highscoresList")) || [];
            highscoresArray.push(results);
            localStorage.setItem("highscoresList", JSON.stringify(highscoresArray));

            // Hide the menu
            inputMenu.style.display = "none";
        })
    };

    // Get saved highscore in local storage
    savedHighscore() {
        this.highscore = localStorage.getItem("highscore");
    };

    // New Highscore
    newHighscore() {
        const emptyWarningText = document.querySelector(".emptyWarning-text");

        // Display notification that a new highscore was set!
        emptyWarningText.textContent = "NEW HIGHSCORE !!!";
        emptyWarningText.classList.add("emptyWarning-Highscore");

        // Remove the notification
        setTimeout(() => {
            emptyWarningText.classList.remove("emptyWarning-Highscore");
        }, 2000);
    };

    // Clear intervals
    clearGameIntervals () {
        clearInterval(enemies.enemiesShootingInterval); // Enemies module
        clearInterval(player.graduallyRestoreInterval); // Player module
        clearInterval(this.countdown);
        clearInterval(powerups.timerInterval);
        clearInterval(powerups.healthInterval);
        clearInterval(powerups.shieldInterval);

        clearInterval(this.countdown);
        clearInterval(player.graduallyRestoreInterval); // Player module
        clearInterval(enemies.enemiesShootingInterval); // Enemies module
        clearInterval(powerups.timerInterval);
        clearInterval(powerups.healthInterval);
        clearInterval(powerups.shieldInterval);
        
    }
    
    // End the game
    endgame(secondsLeft){
        // Disable the intervals
        this.clearGameIntervals();
        
        // End measuring time
        this.endTime = new Date();

        // Divide the difference to get the starting time
        let timeDifference = (this.endTime - this.startingTime) / 1000;
        let timePlayed = Math.floor(timeDifference);

        // Multiplie the ending score by the time played divided by 100, which will result in a multiplier in the form of, for example x0.5 - x3, based on time played
        let multiplier = timePlayed / 100;
        this.score = player.killCount * 100;
        let finalScore = this.score + (this.score * multiplier);

        // Stop movements
        this.isStarted = false;

        // Disable enemies
        enemies.spawned = false;
        
        // Destroy all powerups
        powerups.healthRenew.length = 0;
        powerups.shieldRenew.length = 0;
        powerups.timeRenew.length = 0;

        // Game Over / Game finished menu
        this.gameOver.style.display = "block";

        // If player was killed.
        if(player.hp === 0){
            displayImage.src = `${endPath}/assets/images/tombstone.png`;
            message.textContent = "At least you tried...";
        }

        // If the time is up
        if(secondsLeft <= 0) {
            message.textContent = "Time's up !";
        }

        // Play game-ending music (currently plays ontop of the game music ?_?)
        sfx.music.src = `${endPath}/assets/audio/Fallen in Battle.mp3`;
        sfx.music.volume = 0.2;
        sfx.music.play();
        sfx.music.loop = false;

        // Score and Highscore
        document.querySelector("#totalKills").textContent = player.killCount;
        document.querySelector("#multiplier").textContent = "x" + multiplier;
        document.querySelector("#finalScore").textContent = finalScore;
        document.querySelector("#highscore").textContent = this.highscore;

        // Display the menu with an input to enter player's name
        this.newScore(finalScore);

        // If the new final score is bigger than the current highscore, save it and display notification
        if(finalScore > this.highscore) {
            localStorage.setItem("highscore", finalScore);
            document.querySelector("#highscore").textContent = localStorage.getItem("highscore");
            this.newHighscore();
        }
    };

    // Restart game
    restartGame() {
        // Clear the intervals
        this.clearGameIntervals();
        clearInterval(this.init);
        
        // Reset game parameters
        this.isStarted = false;

        // Reset timer
        this.timerDisplay.classList.remove("timeLow"); // In case user died while time was low.
        this.timerDisplay.textContent = "0:30";

        // Reset the colored blocks
        player.blocks.forEach(block => {
            block.classList.remove("greenPhase")
            block.classList.remove("yellowPhase")
            block.classList.remove("redPhase")
        });

        // Destroy all enemies, healths, timers, shields and reset them to 0.
        enemies.enemiesArray.splice(0, enemies.enemiesArray.length);
        enemies.ammo.splice(0, enemies.ammo.length);
        
        // Delete all existing items in the arrays
        powerups.healthRenew.length = 0;
        powerups.shieldRenew.length = 0;
        powerups.timeRenew.length = 0;

        player.ammo.splice(0, player.ammo.length);
        player.map = {};

        // Reset the kill count text.
        player.killCount = 0;
        this.displayKills.textContent = player.killCount;

        // Reset pregame countdown and hide game over menu
        this.preGame = 3;
        this.gameOver.style.display = "none";
        this.time = 30;

        // Reset player's (ship's) parameters
        player.d = "";
        player.hp = 100;
        player.shield = 100;
        player.overheat = 0;
        player.boost = 100
        player.x = 50;
        player.y = 250;
        player.speed = 5;
        player.increasedSpeed = 5;
        player.heat = -1;
        player.dynamicRestoration = 400;
        player.shieldDestroyed = false;
        player.exp = 0;
        player.level = 1;
        player.currentLevel.textContent = player.level;

        // Reset level and experience
        this.requiredExp = 80;
        this.requiredExpText.textContent = this.requiredExp + " XP";
        this.currentExp.textContent = player.exp;

        let levelExp = (player.exp / this.requiredExp) * 100;
        this.levelBar.style.width = `${levelExp}%`;

        // Restart current time which affets difficulty
        this.startingTime = new Date();
        this.increaseDifficulty();

        // Reset enemies data
        enemies.spawned = false;
        enemies.speed = 1;
        enemies.shootingSpeed = 700;

        // Reset health and shield text display
        player.healthText.textContent = player.hp + "%";
        player.shieldText.textContent = player.shield + "%";

        // Clear input field at game over menu
        const inputField = document.querySelector("#playerName-input");
        inputField.value = "";

        // Set restoration and enemy shooting intervals again.
        player.graduallyRestoreInterval = setInterval(player.graduallyRestore.bind(player), player.dynamicRestoration);
        enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);

        // Run the game again
        startGame();
    }
}
export const game = new Game();
game.savedHighscore();
