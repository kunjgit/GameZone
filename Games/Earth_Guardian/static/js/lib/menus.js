// Import Modules
import {player} from "./player.js";
import {game} from "./game.js";
import {sfx} from "../main.js";

const menu = document.querySelector(".menu");
const pauseMenu = document.querySelector(".pause--menu");
const gameOver = document.querySelector(".game--over");
const exitGameBtn = document.querySelectorAll(".exitGame");
const highscoresListMenu = document.querySelector(".highscoresList-menu");
const highscoreList = document.querySelector("#highscoreList");
const orderedList = document.querySelector("#theList");
const clearListBtn = document.querySelector("#clearList");
const closeHighscores = document.querySelector("#closeHighscores")
const shipControls = document.querySelectorAll(`.settings-menu input[type="text"]`);
const displayCommand = document.querySelectorAll(".displayCommand");
const mainMenuButtons = document.querySelectorAll(".main-menu_buttons");
const soundControl = document.querySelectorAll(".soundControl");

// About menu
const aboutMenu = document.querySelector(".aboutMenu");
let aboutShowed = false;
function displayAbout() {
    if(!aboutShowed) {
        aboutMenu.style.display = "block";
        aboutShowed = !aboutShowed;
    } else {
        aboutMenu.style.display = "none";
        aboutShowed = !aboutShowed;
    }
}

// Highscores menu
function displayHighscores() {
    highscoresListMenu.style.display = "block";
    const getHighscores = JSON.parse(localStorage.getItem("highscoresList"));
    const noHighscoresNote = document.querySelector("#noHighscores");

    if(getHighscores.length === 0) {
        noHighscoresNote.style.display = "block";
    } else {
        noHighscoresNote.style.display = "none";
    }

    // Sort the highscores from top to bottom
    getHighscores.sort((a,b) => (a.score > b.score) ? -1 : 1);

    // Create a new list element for each highscore.
    getHighscores.forEach(highscore => {
        const li = document.createElement("li");
        li.classList.add("highscoreList-items");
        li.innerHTML = `<span id="theName">${highscore.name}</span><span>${highscore.score}</span>`;
        orderedList.appendChild(li);

        if(orderedList.childNodes.length > 0) {
            clearListBtn.style.display = "inline-block";
        }
    })
}

// Clear highscores list
function clearHighscores() {
    localStorage.removeItem("highscoresList");
    localStorage.removeItem("highscore");

    // While there is a first child in the ordered list, remove the first child.
    while(orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
}

// Close the highscores menu
function closeHighscoresMenu() {
    highscoresListMenu.style.display = "none";

    // While there is a first child in the ordered list, remove the first child.
    while(orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
}

// Settings menu (in-game)
const volumeControls = document.querySelectorAll(`.settings-menu input[type="range"]`);
const displayChange = document.querySelectorAll(".displayChange");

function controlVolume() {
    if(sfx.controllingVolume) {
        displayChange.forEach(change => {
            if(this.name === change.id) {
                change.textContent = this.value + "%";
            }

            // If input name is SFX, edit sfx, otherwise edit music's volume.
            if(this.name === "sfx") {
                sfx.sfxVolume = this.value / 100;
                sfx.playerShooting.volume = sfx.sfxVolume;
                sfx.explosionSound.volume = sfx.sfxVolume;
                sfx.enemyShooting.volume = sfx.sfxVolume;
                sfx.restorationSound.volume = sfx.sfxVolume;
                sfx.alarmSound.volume = sfx.sfxVolume;;
            } else if(this.name === "bgMusic") {
                sfx.musicVolume = this.value / 100;
                sfx.music.volume = sfx.musicVolume;
            }
        })
    }
}

// Change ship's controls
function changeControls(e) {
    e = e || event;
    const key = e.key;
    const code = e.code;

    if(code === "Space") {
        this.value = code;
    } else if (code !== key) {
        this.value = key;
    }

    displayCommand.forEach(command => {
        // Display the command text
        if(this.name === command.id) {
            command.textContent = this.value || key;
        }

        // Change the player's commands
        if(this.name === "left") {
            player.left = e.keyCode;
        } else if(this.name === "up") {
            player.up = e.keyCode;
        } else if(this.name === "right") {
            player.right = e.keyCode;
        } else if(this.name === "down") {
            player.down = e.keyCode;
        } else if(this.name === "shooting") {
            player.shooting = e.keyCode;
        } else if(this.name === "useBooster") {
            player.useBooster = e.keyCode;
        }
    })
}

// Hover on menues
mainMenuButtons.forEach(button => button.addEventListener("mouseover", ()=>{
    sfx.menuMove.currentTime = 0;
    sfx.menuMove.play();
}))

// Select menues
mainMenuButtons.forEach(button => button.addEventListener("click", ()=>{
    sfx.menuSelected.currentTime = 0;
    sfx.menuSelected.play();
}))

// Toggle sfx / music on and off.
soundControl.forEach(control => control.addEventListener("click", ()=>{
    sfx.toggleMusic();
    if(sfx.soundOff) {
        control.src = `../assets/images/soundOff.png`;
    } else {
        control.src = `../assets/images/soundOn.png`;
    }
}));

// Volume control event listeners
volumeControls.forEach(control => control.addEventListener("mousedown",() => {
    sfx.controllingVolume = true
}));
volumeControls.forEach(control => control.addEventListener("mouseup",() => {
    sfx.controllingVolume = false
}));
volumeControls.forEach(control => control.addEventListener("change", controlVolume));
volumeControls.forEach(control => control.addEventListener("mousemove", controlVolume));

// Menus event listeners
clearListBtn.addEventListener("click", clearHighscores);
closeHighscores.addEventListener("click", closeHighscoresMenu);
highscoreList.addEventListener("click", displayHighscores);
document.getElementById("about").addEventListener("click", displayAbout);
document.getElementById("closeAbout").addEventListener("click", displayAbout);
document.querySelector("#settings").addEventListener("click", ()=>{
    document.querySelector(".settings-menu").style.display = "flex";
})
document.querySelector("#goBack").addEventListener("click", ()=>{
    document.querySelector(".settings-menu").style.display = "none";
})

// Ship controls event listeners
shipControls.forEach(control => control.addEventListener("keyup", changeControls));
shipControls.forEach(control => control.addEventListener("click", function(){
    this.value = ""
}));
