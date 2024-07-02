// Selecting Elements from DOM
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const healthText = document.getElementById('healthText');
const xpText = document.getElementById('xpText');
const text = document.getElementById('text');

// Creating initial stats
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0; // Represents weapon index
let fighting; // Represents whether the player is fighting or not
let monsterHealth;
let inventory = ["stick"];

/* Creating a locations array which stores all locations as objects,
   buttonText stores what to display on the buttons when you enter a particular place
   buttonFunction stores the functions to call when a particular button is pressed
*/
const locations = [
    {
        name: "Town Square",
        buttonText: ["Go to Store", "Go to Cave", "Fight Dragon"],
        buttonFunctions: [goStore, goCave, fightDragon],
        text: "You are now in Town Square, you see a board that says Store"
    },
    {
        name: "Cave",
        buttonText: ["Fight Slime", "Fight Fanged Beast", "Go to town square"],
        buttonFunctions: [fightSlime, fightBeast, goTown],
        text: "You enter the cave..."
    },
    {
        name: "Store",
        buttonText: ["Buy Weapon", "Sell Weapon", "Go to town square"],
        buttonFunctions: [buyWeapon, sellWeapon, goTown],
        text: "You enter the store..."
    }
];

// Initialize Buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function updateLocation(location) {
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];
    button3.innerText = location.buttonText[2];
    button1.onclick = location.buttonFunctions[0];
    button2.onclick = location.buttonFunctions[1];
    button3.onclick = location.buttonFunctions[2];
    text.innerText = location.text;
}

function goStore() {
    updateLocation(locations[2]);
}

function goCave() {
    updateLocation(locations[1]);
}

function goTown() {
    updateLocation(locations[0]);
}

function fightDragon() {
    text.innerText = "You are fighting the dragon!";
}

function fightSlime() {
    text.innerText = "You are fighting a slime!";
}

function fightBeast() {
    text.innerText = "You are fighting a fanged beast!";
}

function buyWeapon() {
    text.innerText = "You buy a weapon.";
}

function sellWeapon() {
    text.innerText = "You sell a weapon.";
}
