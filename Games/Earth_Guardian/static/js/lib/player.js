import {game} from "./game.js";
import {enemies} from "./enemies.js";
import {graphics, sfx} from "../main.js";

const emptyWarningText = document.querySelector(".emptyWarning-text");

export class Player {
    constructor() {
        this.d = null; // Direction
        this.x = 50;
        this.y = 250;
        this.speed = 5;
        this.hp = 100;
        this.shield = 100;
        this.overheat = 0;
        this.booster = 100;
        this.missileSpeed = 15;
        this.increasedSpeed = 5; // Speed increased by level up
        this.heat = -1;

        this.ammo = [];

        this.speedBooster = false;
        this.isOverheated = false;
        this.isSpaceDown = false;
        this.shieldDestroyed = false;

        
        // Player related elements
        this.blocks = document.querySelectorAll(".overheat-bar_block");
        this.currentLevel = document.querySelector("#currentLevel");
        this.shieldText = document.querySelector("#shieldText");
        this.healthText = document.querySelector("#healthText");

        // Player ship interval
        this.graduallyRestoreInterval;
        this.dynamicRestoration = 400;

        // Player's level
        this.level = 1;
        this.exp = 0;
        this.killCount = 0;

        // Ship's default commands
        this.left = 37;
        this.right = 39;
        this.up = 38;
        this.down = 40;
        this.shooting = 32;
        this.useBooster = 16;
        this.map = {};
    };

    // Level up
    levelUp() {
        this.level++;
        this.currentLevel.textContent = this.level;
        this.shieldDestroyed = false;
        
        // Increase the movement and missile speed on level up
        this.increasedSpeed++;
        this.speed = this.increasedSpeed;
        this.missileSpeed += 1;

        // Dynamic restoration (cooling) of weapons
        if(this.dynamicRestoration >= 150) {
            // First clear the current interval for player restoration
            clearInterval(player.graduallyRestoreInterval);

            // Change the interval's speed
            this.dynamicRestoration -= 50;
            
            // After that re-add the interval with the new updated speed now
            player.graduallyRestoreInterval = setInterval(player.graduallyRestore.bind(player), player.dynamicRestoration);
        }

        // Restore health and shield to the ship
        if(this.hp <= 60) {
            this.hp += 40;
        }

        if(this.shield <= 80) {
            this.shield += 20;
        }
        this.healthText.textContent = this.hp + "%";
        this.shieldText.textContent = this.shield + "%";

        // Small animation to notify the player he's leveled up
        document.querySelector("#levelText").classList.add("levelTextActive");

        setTimeout(() => {
            document.querySelector("#levelText").classList.remove("levelTextActive");
        }, 1500);
    };
    
    // Player movement
    playerMovement (e) {
        e = e || event;
        if(game.isStarted) {
            this.map[e.keyCode] = e.type === "keydown";
            if(this.map[this.left] && this.map[this.up] || this.map[this.left] && this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP_LEFT";
            } else if (this.map[this.left] && this.map[this.down] || this.map[this.left] && this.map[this.down] && this.map[this.shooting]) {
                this.d = "DOWN_LEFT";
            } else if (this.map[this.left] || this.map[this.left] && this.map[this.shooting]) {
                this.d = "LEFT"; 
            } else if(this.map[this.right] && this.map[this.up] || this.map[this.right] && this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP_RIGHT";
            } else if(this.map[this.right] && this.map[this.down] || this.map[this.right] && this.map[this.down] && this.map[this.shooting]) {
                this.d = "DOWN_RIGHT";
            } else if(this.map[this.right] || this.map[this.right] && this.map[this.shooting]) {
                this.d = "RIGHT";
            } else if(this.map[this.down] || this.map[this.down] && this.map[this.shooting]) {
                this.d = "DOWN";
            } else if(this.map[this.up] || this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP";
            }

            // Player uses speed booster
            if(this.map[this.useBooster] && this.d === "LEFT"
            || this.map[this.useBooster] && this.d === "RIGHT"){
                if(this.booster > 0 && this.booster <= 100) {
                    this.speedBooster = true;
                    this.speed += 10;

                    // Empty the booster
                    this.booster -= 2;
                }

                // Disable the booster if it reaches 0
                if(this.booster <= 0) {
                    this.speedBooster = false;
                    this.speed = this.speed;
                    emptyWarningText.textContent = "BOOSTER EMPTY !";
                    emptyWarningText.classList.add("emptyWarning-textActive");

                    // Play alarm sound
                    sfx.alarmSound.currentTime = 0;
                    sfx.alarmSound.play();

                    // Restore the booster to max
                    this.restoreBooster();
                }
            }
        }
    };

    // Clear the ship commands when player doesn't holds a key down
    clearShipCommands() {
        this.speed = this.increasedSpeed;
        this.isSpaceDown = false;
        this.speedBooster = false;
        this.d = "";
    }

    // Shoot
    shoot(e) {
        e = e || event;
        if(game.isStarted && !this.isOverheated) {
        if(this.isSpaceDown) return; // End the function if user is already holding space

        if(e.keyCode === this.shooting) {
            this.isSpaceDown = true;
            if(this.level < 3) {
                new Ammo(0, 0);
            } else if (this.level >= 3 && this.level <= 5) {
                new Ammo(0, 0)
                new Ammo(0, 20);
            } else if (this.level >= 5 && this.level <= 7) {
                new Ammo(0, 0);
                new Ammo(0, 20);
                new Ammo(0, -20);
            } else if(this.level >= 8) {
                new Ammo(0, 0);
                new Ammo(0, 40);
                new Ammo(0, -40);
                new Ammo(15, 60);
                new Ammo(15, -60);
                new Ammo(30, 80);
                new Ammo(30, -80);
            }
            sfx.playerShooting.currentTime = 0;
            sfx.playerShooting.play();
            this.overheating();

            //  Prevent default action if user sets shooting to be on alt, ctrl etc.
            e.preventDefault();
        }
     }
    };

    // Overheating
    overheating() {
        this.overheat = this.overheat + 10;

        // If player.overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
        if(this.overheat === 100) {
            this.isOverheated = true;
            emptyWarningText.textContent = "OVERHEATED !";
            emptyWarningText.classList.add("emptyWarning-textActive");

            // Play alarm sound
            sfx.alarmSound.currentTime = 0;
            sfx.alarmSound.play();
            this.coolOut();
        } else if (this.overheat > 0 && this.overheat < 100) {
            this.isOverheated = false;
            this.displayOverheating();
        }
     };

     // Display overheating by painting the blocks
     displayOverheating() {
         if(this.heat >= -1 && this.heat <= 10) {
             this.heat++;
         }

         // Cycle trough the blocks and add according classes.
         if(this.heat >= 0 && this.heat <= 3) {
             this.blocks[this.heat].classList.add("greenPhase");
         } else if(this.heat >= 4 && this.heat <= 6) {
             this.blocks[this.heat].classList.add("yellowPhase");
         } else if(this.heat >= 7 && this.heat <= 10) {
             this.blocks[this.heat].classList.add("redPhase");
         }
     };

    // Gradually restore guns heat and booster
    graduallyRestore() {
        if(this.overheat >= 10 && this.overheat <= 90) {
            this.overheat = this.overheat - 10;

            // Re-color the blocks (remove classes)
            if(this.heat >= 0 && this.heat <= 3) {
                this.blocks[this.heat].classList.remove("greenPhase");
                this.heat--;
            } else if (this.heat >= 4 && this.heat <= 6) {
                this.blocks[this.heat].classList.remove("yellowPhase");
                this.heat--;
            } else if(this.heat >= 7 && this.heat <= 10) {
                this.blocks[this.heat].classList.remove("redPhase");
                this.heat--;
            }
        }

        //  Restore ship's booster
        if(this.booster >= 0 && this.booster <= 98) {
            this.booster = this.booster + 2;
        }
    };

    // When guns overheat (reach 100), wait 2 seconds and restore to 0.
    coolOut() {
        setTimeout(() => {
            this.overheat = 0;
            this.isOverheated = false;
            emptyWarningText.classList.remove("emptyWarning-textActive");
            this.blocks.forEach(block => {
                block.classList.remove("greenPhase")
                block.classList.remove("yellowPhase")
                block.classList.remove("redPhase")
            });
            this.heat = -1;
        }, 2000);
    };

    // Restore the booster to max (100) after 5 seconds after it is emptied.
    restoreBooster() {
        setTimeout(() => {
            this.booster = 100;
            this.speedBooster = true;
            emptyWarningText.classList.remove("emptyWarning-textActive");
        }, 5000);
    };

    // If the player is hit by the enemies
    playerHit() {
        // Play explosion sound
        sfx.explosionSound.currentTime = 0;
        sfx.explosionSound.play();

        // Destroy the alien ammo upon hit
        for(let i = 0; i < enemies.ammo.length; i++) {
            let enemyRockets = enemies.ammo[i];
            let enemyRocketsIndex = enemies.ammo.indexOf(enemyRockets);
            if(enemyRocketsIndex > -1) {
                enemies.ammo.splice(enemyRocketsIndex, 1);
            } 
        }

        // Decrease shield
        this.decreaseShield();

        // Decrease ship HP
        this.decreaseShipHP();

        if(this.hp === 0) {
            game.endgame();
        }
    };

    // Restore the ship's HP
    restoreShipHP() {
        // If ship's already on max health dont do anything
        if(this.hp === 100) {
            this.hp = this.hp;
        } else{
            // Restore ships HP and display a notification.
            this.hp = this.hp + 20;
            this.healthText.textContent = this.hp+"%";
            game.displayNotification("Restored health!");
        }
    };

    // Decrease the ship's HP on hit
    decreaseShipHP() {
        if(this.hp >= 20 && this.hp <= 100 && this.shieldDestroyed){
            this.hp = this.hp - 20;
            this.healthText.textContent = this.hp+"%";
        } else if(this.hp === 0) {
            game.endgame();
        }
    };

    // Restoring the ship's shield
    restoreShield() {
        if(this.shield === 100) {
            this.shieldDestroyed = false;
            this.shield = this.shield;
        } else if(this.shield <= 80){
            // Enable shield on player's ship
            this.shieldDestroyed = false;

            // Restore shield points and display a notification
            this.shield = this.shield + 20;
            this.shieldText.textContent = this.shield+"%";
            game.displayNotification("Restored shield!");
        }
    };

    // Decrease the ship's shield on hit
    decreaseShield() {
        // Decrease shield
        if(this.shield >= 20 && this.shield <= 100) {
            this.shield = this.shield - 20;
            this.shieldText.textContent = this.shield+"%";
        } else if(this.shield < 20) {
            // If shield is at 0 (at 20% shield gets deducted 20, so it goes straight to 0), mark it as destroyed
            this.shieldDestroyed = true;
        }
    }
};

class Ammo {
    constructor(ammoX, ammoY) {
        player.ammo.push({
            x: player.x + graphics.ship.width + ammoX,
            y: player.y + (graphics.ship.height / 2 ) + ammoY
        })
    }
};

export const player = new Player();

// Set the restoration interval on load
player.graduallyRestoreInterval = setInterval(player.graduallyRestore.bind(player), player.dynamicRestoration);

// Bind event listeners
onkeydown = onkeyup = player.playerMovement.bind(player);
document.addEventListener("keydown", player.shoot.bind(player));
document.addEventListener("keyup", player.clearShipCommands.bind(player));