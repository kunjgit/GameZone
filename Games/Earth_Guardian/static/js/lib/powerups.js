// Import modules
import {game} from "./game.js";
import {graphics} from "./assets.js";

export class Powerups{
    constructor() {
        this.healthRenew = [];
        this.healthRenew[0] = {
            x: game.cWidth,
            y: Math.floor(Math.random() * ( (game.maxHeight - graphics.healthImage) - game.minHeight) + game.minHeight)
        }
        this.shieldRenew = [];
        this.shieldRenew[0] = {
            x: game.cWidth,
            y: Math.floor(Math.random() * ( (game.maxHeight - graphics.shieldImage) - game.minHeight) + game.minHeight)
        }
        this.timeRenew = [];
        this.timeRenew[0] = {
            x: game.cWidth,
            y: Math.floor(Math.random() * ( (game.maxHeight - graphics.timerImage) - game.minHeight) + game.minHeight)
        }

        // Intervals
        this.healthInterval = null;
        this.shieldInterval = null;
        this.timerInterval = null;
    }

    // Spawn health restoration every 20 seconds
    healthRenewFunction() {
        this.healthInterval = setInterval(() => {
            this.healthRenew.push({
                x: game.cWidth,
                y: Math.floor(Math.random() * (game.maxHeight - graphics.healthImage.height) - game.minHeight) + game.minHeight
            })
            console.log("Pushed health")
        }, 20 * 1000);
    }

    // Spawn shield restoration every 60 seconds
    shieldRenewFunction() {
        this.shieldInterval = setInterval(() => {
            this.shieldRenew.push({
                x: game.cWidth,
                y: Math.floor(Math.random() * (game.maxHeight - graphics.shieldImage.height) - game.minHeight) + game.minHeight
            })
            console.log("Pushed shield")
        }, 30 * 1000);
    }

    // Spawn a timer to add more playing time every 10 to 15 seconds
    timeRenewFunction() {
        this.timerInterval = setInterval(() => {
            this.timeRenew.push({
                x: game.cWidth,
                y: Math.floor(Math.random() * (game.maxHeight - graphics.timerImage.height) - game.minHeight) + game.minHeight
            });
            console.log("Pushed time")
        }, 10 * 1000);
    }
}