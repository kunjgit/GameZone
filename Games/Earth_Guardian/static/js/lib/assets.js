// Import modules
import {sfx} from "../main.js";
import {endPath} from "./path.js";

// Graphical assets
export class Graphics{ 
    constructor() {
        this.bg = new Image();
        this.ship = new Image();
        this.enemy = new Image();
        this.missile = new Image();
        this.explosion = new Image();
        this.timerImage = new Image();
        this.healthImage = new Image();
        this.shieldImage = new Image();
        this.enemyMissile = new Image();
        this.engineFlames = new Image();

        this.bg.src = `${endPath}/assets/images/background.png`;
        this.ship.src = `${endPath}/assets/images/player.png`;
        this.enemy.src = `${endPath}/assets/images/enemy.png`;
        this.missile.src = `${endPath}/assets/images/playerRocket.png`;
        this.explosion.src = `${endPath}/assets/images/3.png`;
        this.healthImage.src = `${endPath}/assets/images/firstAid.png`;
        this.enemyMissile.src = `${endPath}/assets/images/enemyRocket.png`;
        this.timerImage.src = `${endPath}/assets/images/timer.png`;
        this.shieldImage.src = `${endPath}/assets/images/shieldImage.png`;
        this.engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
    }
}

// Sound assets
export class Sfx {
    constructor() {
        this.music = new Audio();
        this.goVoice = new Audio();
        this.alarmSound = new Audio();
        this.enemyShooting = new Audio();
        this.playerShooting = new Audio();
        this.explosionSound = new Audio();
        this.restorationSound = new Audio();
        
        this.playerShooting.src = `${endPath}/assets/audio/weapon_player.wav`;
        this.explosionSound.src = `${endPath}/assets/audio/explosion_enemy.wav`;
        this.enemyShooting.src = `${endPath}/assets/audio/laser1.ogg`;
        this.music.src = `${endPath}/assets/audio/music_background.wav`;
        this.restorationSound.src = `${endPath}/assets/audio/powerUp11.ogg`;
        this.alarmSound.src = `${endPath}/assets/audio/alarm.wav`;
        this.goVoice.src =`${endPath}/assets/audio/go.ogg`;
        
        this.sfxVolume = 0.3;
        this.musicVolume = 0.4;
        this.music.loop = true;
        this.soundOff = false;
        this.controllingVolume = false;

        this.playerShooting.volume = this.sfxVolume;
        this.explosionSound.volume = this.sfxVolume;
        this.enemyShooting.volume = this.sfxVolume;
        this.music.volume = this.musicVolume;
        this.restorationSound.volume = this.sfxVolume;
        this.alarmSound.volume = this.sfxVolume;
        this.goVoice.volume = 0.1;

        // Menu sounds
        this.menuMove = new Audio();
        this.menuSelected = new Audio();
        this.menuMove.src = `${endPath}/assets/audio/menu hover.wav`
        this.menuSelected.src = `${endPath}/assets/audio/menu select.wav`;
    }

    // Toggle all music / sound on and off
    toggleMusic() {
        this.soundOff = !this.soundOff;
        if(this.soundOff) {
            this.sfxVolume = 0;
            this.musicVolume = 0;
            this.menuSelected.volume = 0;
            this.menuMove.volume = 0;
        } else {
            this.playerShooting.volume = this.sfxVolume;
            this.explosionSound.volume = this.sfxVolume;
            this.enemyShooting.volume = this.sfxVolume;
            this.music.volume = this.musicVolume;
            this.restorationSound.volume = this.sfxVolume;
            this.volume = this.sfxVolume;
            this.menuSelected.volume = 1;
            this.menuMove.volume = 1;
        }
    }

    // Play restoration sound effect when player picks up health, shield or timer.
    restorationEffect() {
        this.restorationSound.currentTime = 0;
        this.restorationSound.play();
    }
}

export const graphics = new Graphics();
