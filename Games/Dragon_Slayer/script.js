// Selecting Elements from DOM
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const button4 = document.getElementById('start-game-btn');
const healthText = document.getElementById('healthText');
const xpText = document.getElementById('xpText');
const text = document.getElementById('text');
const goldText = document.getElementById('goldText');
const choiceContainer = document.getElementById('choice-section');
const monsterStatsContainer = document.getElementById('monster-stats');
const monsterHealthText = document.getElementById('monsterHealthText');
const monsterNameText = document.getElementById('monsterNameText');
const playerStatsDiv = document.getElementById('player-stats');
const fightCountText = document.getElementById('fightCountText');
const gameContainerDiv = document.getElementById('game-container');
gameContainerDiv.style.display = "none";

//Adding background-music
const backgroundMusic = new Audio('./backgroundMusic.mp3');
backgroundMusic.loop = true;


// Creating initial stats
let xp = 0;
let health = 100;
let gold = 50;
let weaponIndex = 0; // Represents weapon index
let fighting; // Represents which monster the player is fighting.
let monsterHealth;
let inventory = ["stick"];
let monstersFought = 0; //Counts how many monsters you fight

/* Creating a locations array which stores all locations as objects,
   buttonText stores what to display on the buttons when you enter a particular place
   buttonFunction stores the functions to call when a particular button is pressed
*/
const locations = [
    {
        name: "Town Square",
        buttonText: ["Go to Store", "Go to Cave", "Fight Dragon"],
        buttonFunctions: [goStore, goCave, fightDragon],
        text: "You are now in Town Square, you see a board that says \"Store\""
    },
    {
        name: "Cave",
        buttonText: ["Fight Slime", "Fight Venomspike", "Go to town square"],
        buttonFunctions: [fightSlime, fightVenomSpike, goTown],
        text: "You enter the cave..."
    },
    {
        name: "Store",
        buttonText: ["Buy Weapon", "Buy Health", "Go to town square"],
        buttonFunctions: [buyWeapon, buyHealth, goTown],
        text: "You enter the store..."
    },
    {
        name: "Fight",
        buttonText: ["Attack", "Dodge", "Run"],
        buttonFunctions: [attack, dodge, run],
        text: "You enter the store..."
    },
    {
        name: "kill monster",
        buttonText : ["Go to town square","Go to town square","Go to town square"],
        buttonFunctions: [goTown,goTown,goTown],
        text: `You defeat the monster! You gain some XP and find some gold` 
    },
    {
        name: "lost",
        buttonText: ["REPLAY?","REPLAY?","REPLAY?"],
        buttonFunctions: [restart,restart,restart],
        text: `You die! 💀`
    },
    {
        name: "replay",
        buttonText: ["REPLAY?","REPLAY?","REPLAY?"],
        buttonFunctions: [restart,restart,restart],
        text: `You defeated the dragon and freed the people of the town from its terror!! Would you like to play again?`
    }
];

//Creating a weapons array for the store cataloge
const weapons = [
    { name:"stick", power:10},
    { name:"dagger", power:15},
    { name:"claw-hammer", power:20},
    { name:"knife", power:25},
    { name:"Axe", power:50},
    { name:"Sword", power:100},
];

const secretWeapon = { name:"Excalibur", power:1000} //Secret Weapon
//Creating a monsters array to store monster infomation
const monsters = [
    {name: "Slime",health: 15,level:1,power:5},
    { name:"Venomspike", health: 30, level:2, power:10 },
    { name: "Fanged Beast", health: 50, level:5, power:20 },
    { name: "Gore Beast", health: 75, level:7, power:40 },
    { name: "Necrofiend", health: 100, level:10, power:50 },
    { name: "Ironclad", health: 150, level:15, power:60 },
    { name: "Dragon", health: 300, power:100 }
];


//Creating a new Division for adding monster buttons
const buttonDiv = document.createElement('div');

//Update Location function
function updateLocation(location) {
    monsterStatsContainer.classList.add("hidden");
    if(location.name === "Cave"){
        buttonDiv.id = "new-buttons";
        buttonDiv.innerHTML = `
        <button id="button4" class="btn" onclick="fightFangedBeast()">Fight Fanged Beast</button>
        <button id="button5" class="btn" onclick="fightGoreBeast()">Fight Gore Beast</button>
        <button id="button6" class="btn" onclick="fightNecrofiend()">Fight Necrofiend</button>
        <button id="button7" class="btn" onclick="fightIronClad()">Fight Ironclad</button>
        `;
        choiceContainer.insertAdjacentElement('beforeend',buttonDiv);
    }
    if(location.name !== "Cave"){
        buttonDiv.remove();
    };
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
    fighting = 6;
    checkEligibility();
}

function checkEligibility(){
    if(monstersFought >= 15){
        goFight();
    }else{
        text.innerText = "You cannot fight the dragon now, you've got to defeat atleast 15 monsters";
    }
}
function fightSlime() {
    fighting = 0;
    goFight();
}
function fightVenomSpike() {
    fighting = 1;
    goFight();
 }
function fightFangedBeast(){
    fighting = 2;
    goFight();
}
function fightGoreBeast () {
    fighting = 3;
    goFight();
}
function fightNecrofiend() {
    fighting = 4;
    goFight();
}
function fightIronClad() {
    fighting = 5;
    goFight();
}

function attack(){
        health-=monsters[fighting].power;
        monsterHealth-= Math.floor(Math.random()*xp) + weapons[weaponIndex].power;
        text.innerText = `You attacked the the ${monsters[fighting].name}, the ${monsters[fighting].name} attacks you!`;
        monsterHealthText.innerText = monsterHealth;
        healthText.innerText = health;
        if(health<=0){
            lose();
        }
        if(monsterHealth<=0){
            win();
        }
}
function dodge(){
    const dogdeProbability = Math.random();
    if(dogdeProbability < 0.5){
        if(health>0){
            health-=monsters[fighting].power;
            text.innerText = `Your dodge failed!, the ${monsters[fighting].name}'s attack hit you!`
            healthText.innerText = health;
        }else{
            lose();
        }
    }else{
        text.innerText = "You dodge the attack from the " + monsters[fighting].name;
    }

}
function run(){ //You can still attack or dodge the attack from the monster while running.
    text.innerText = `You are running from the ${monsters[fighting].name}`;
    setTimeout(() => updateLocation(locations[0]),1500);
}

function win(){
    if(monsters[fighting].name === "Dragon"){
       updateLocation(locations[6])
    }
    monstersFought+=1;
    fightCountText.innerText = monstersFought;
    gold+= Math.round(monsters[fighting].level * 6.5);
    xp+=monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    updateLocation(locations[4]);
}

function lose(){
    health = 0;
    healthText.innerText = health;
    updateLocation(locations[5]);
}

//Restart Game function
function restart() {
    // Reset game state here
    xp = 0;
    xpText.textContent = xp;
    health = 100;
    gold = 50;
    weaponIndex = 0;
    fighting = 0;
    monsterHealth = 0;
    inventory = ["stick"];
    monstersFought = 0;
    fightCountText.textContent = monstersFought;
    healthText.innerText =health;
    goldText.innerText = gold;
    updateLocation(locations[0]);
}

//Creating a goFight function to update the text when fighting a monster
const goFight = () => {
    updateLocation(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStatsContainer.classList.remove("hidden");
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function buyWeapon() {
    if(weaponIndex === 5){
        button2.innerText = "Sell Weapon";
        button2.onclick = sellWeapon;
    }
    if(gold< 20){
        text.innerText = "You don't have sufficient gold to purchase a weapon!"
    }else{
        weaponIndex+=1;
        const currentWeapon = weapons[weaponIndex].name;
        gold-=20;
        goldText.innerText = `${gold}`
        inventory.push(currentWeapon);
        text.innerText = `You buy a weapon, you now have a ${currentWeapon}`;
    }
}
function buyHealth() {
    if(gold >= 10){
        health+=10;
        gold-=10;
        healthText.innerText = health;
        goldText.innerText = gold;
        text.innerText = "You brought a potion that restored your health by 10";
    }else{
        text.innerText = "You don't have sufficient gold to buy health potions!"
    }
}
function sellWeapon() {
    if(inventory.length == 1){
        text.innerText = "You cannot sell your only Weapon!"
    }else{
        gold += 5;
        goldText.innerText = gold;
        weaponIndex-=1;
        text.innerText = `You sold your ${inventory.pop()}, You now have a ${inventory[weaponIndex]}`;
    }
}
// Initialize Buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

//StartGame Button functioning
button4.addEventListener('click', () => {
    openPopup.classList.remove("hidden");
    backgroundMusic.play();
    gameContainerDiv.style.display = "block";
    text.classList.remove("hidden");
    playerStatsDiv.classList.remove('hidden');
    choiceContainer.classList.remove('hidden');
    const startGameDiv = document.getElementById('start-game');
    startGameDiv.classList.add("hidden");
});

//Music Controls 
document.addEventListener('DOMContentLoaded', () => {
    const openPopup = document.getElementById('openPopup');
    const closePopup = document.getElementById('closePopup');
    const musicPopup = document.getElementById('musicPopup');
    const playMusic = document.getElementById('playMusic');
    const pauseMusic = document.getElementById('pauseMusic');
    const muteMusic = document.getElementById('muteMusic');
    const unmuteMusic = document.getElementById('unmuteMusic');
    const volumeControl = document.getElementById('volumeControl');

    openPopup.addEventListener('click', () => {
        musicPopup.style.display = 'flex';
    });

    closePopup.addEventListener('click', () => {
        musicPopup.style.display = 'none';
    });

    playMusic.addEventListener('click', () => {
        backgroundMusic.play().catch(error => console.error('Error playing music:', error));
    });

    pauseMusic.addEventListener('click', () => {
        backgroundMusic.pause();
    });

    muteMusic.addEventListener('click', () => {
        backgroundMusic.muted = true;
    });

    unmuteMusic.addEventListener('click', () => {
        backgroundMusic.muted = false;
    });

    volumeControl.addEventListener('input', (event) => {
        backgroundMusic.volume = event.target.value;
    });
    document.body.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => console.error('Autoplay prevented:', error));
        }
    }, { once: true });
});
