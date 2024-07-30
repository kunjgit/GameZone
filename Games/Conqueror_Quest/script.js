const gameState = {
    currentRoom: 'entrance',
    inventory: [],
    health: 100,
    magic: 50,
    questCompleted: false,
    spells: [],
    finalBattleStarted: false,
    artifactInvestigationDone: false,
    puzzleSolved: false
};

const rooms = {
    entrance: {
        description: "You stand at the entrance of the Enchanted Library. Ancient tomes line the walls, and a mysterious aura fills the air.",
        options: [
            { text: "Explore the main hall", nextRoom: 'mainHall' },
            { text: "Examine the magical seal on the door", action: examineEntrance }
        ]
    },
    mainHall: {
        description: "The grand main hall stretches before you. Floating candles illuminate towering bookshelves.",
        options: [
            { text: "Go to the Alchemy Section", nextRoom: 'alchemySection' },
            { text: "Investigate the Whispering Corner", nextRoom: 'whisperingCorner' },
            { text: "Explore a hidden chamber behind a bookshelf", nextRoom: 'hiddenChamber' },
            { text: "Access the Secret Library", action: accessSecretLibrary }
        ]
    },
    alchemySection: {
        description: "Bubbling potions and strange ingredients fill this section. A complex puzzle lock guards a special book.",
        options: [
            { text: "Attempt to solve the puzzle", action: solvePuzzle },
            { text: "Search for potion ingredients", action: searchIngredients },
            { text: "Go back to the main hall", nextRoom: 'mainHall' }
        ]
    },
    whisperingCorner: {
        description: "In this corner, you hear faint whispers coming from the books. A ghostly librarian appears.",
        options: [
            { text: "Speak with the ghostly librarian", action: speakLibrarian },
            { text: "Listen closely to the whispers", action: listenWhispers },
            { text: "Return to the main hall", nextRoom: 'mainHall' }
        ]
    },
    hiddenChamber: {
        description: "You discover a hidden chamber behind a bookshelf. It contains ancient relics and a mysterious artifact.",
        options: [
            { text: "Investigate the artifact", action: investigateArtifact },
            { text: "Take an ancient relic", action: takeRelic },
            { text: "Return to the main hall", nextRoom: 'mainHall' }
        ]
    },
    secretLibrary: {
        description: "You've unlocked a secret library with a mystical tome at its center. This is where the final puzzle awaits.",
        options: [
            { text: "Solve the final puzzle to gain powerful spells", action: solveFinalPuzzle },
            { text: "Return to the main hall", nextRoom: 'mainHall' }
        ]
    },
    finalBattle: {
        description: "The final battle begins against a dark sorcerer! Use your spells and skills to defeat the sorcerer.",
        options: [
            { text: "Attack with Fireball", action: useFireball },
            { text: "Defend with Shield", action: useShield },
            { text: "Cast Healing Spell", action: useHealingSpell },
            { text: "Use a potion", action: usePotion }
        ]
    },
    ending: {
        description: "Congratulations! You've defeated the dark sorcerer and completed the quest. The magical realm is now yours to explore.",
        options: [
            { text: "Restart the adventure", action: restartGame }
        ]
    }
};

function updateGameState() {
    document.getElementById('health').textContent = gameState.health;
    document.getElementById('magic').textContent = gameState.magic;
    updateInventory();
}

function updateInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    gameState.inventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        inventoryList.appendChild(li);
    });
}

function displayRoom(roomName) {
    const room = rooms[roomName];
    document.getElementById('story-text').textContent = room.description;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    room.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('option');
        button.addEventListener('click', () => {
            if (option.nextRoom) {
                displayRoom(option.nextRoom);
            } else if (option.action) {
                option.action();
            }
        });
        optionsContainer.appendChild(button);
    });
}

function examineEntrance() {
    alert("You notice ancient runes glowing faintly on the seal. They seem to react to your presence.");
    gameState.magic += 10;
    updateGameState();
}

function solvePuzzle() {
    const solution = prompt("Enter the four-digit code to unlock the puzzle:");
    if (solution === "1842") {
        alert("The puzzle unlocks! You find an ancient spellbook.");
        gameState.inventory.push("Ancient Spellbook");
        updateGameState();
    } else {
        alert("Incorrect code. The puzzle remains locked.");
        gameState.health -= 5;
        updateGameState();
    }
}

function searchIngredients() {
    const ingredients = ["Mandrake Root", "Phoenix Feather", "Dragon Scale"];
    const found = ingredients[Math.floor(Math.random() * ingredients.length)];
    alert(`You found: ${found}`);
    gameState.inventory.push(found);
    updateGameState();
}

function speakLibrarian() {
    alert("The ghostly librarian shares ancient knowledge with you, increasing your magical abilities.");
    gameState.magic += 15;
    updateGameState();
}

function listenWhispers() {
    alert("The whispers reveal a secret: 'The code is the year the library was founded: 1842'");
}

function investigateArtifact() {
    alert("The artifact glows and reveals hidden knowledge, enhancing your magic.");
    gameState.magic += 20;
    gameState.artifactInvestigationDone = true;
    updateGameState();
}

function takeRelic() {
    const relics = ["Ancient Sword", "Mystic Amulet", "Enchanted Shield"];
    const taken = relics[Math.floor(Math.random() * relics.length)];
    alert(`You took: ${taken}`);
    gameState.inventory.push(taken);
    updateGameState();
}

function accessSecretLibrary() {
    if (gameState.artifactInvestigationDone) {
        displayRoom('secretLibrary');
    } else {
        alert("You need to investigate the artifact in the Hidden Chamber to access the Secret Library.");
    }
}

function solveFinalPuzzle() {
    const answer = prompt("To gain powerful spells, solve the puzzle: 'I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?'");
    if (answer.toLowerCase() === "pencil") {
        alert("You solved the puzzle! You gain powerful spells: Fireball, Shield, and Healing.");
        gameState.spells.push("Fireball", "Shield", "Healing Spell");
        gameState.puzzleSolved = true;
        updateGameState();
        displayRoom('finalBattle');
    } else {
        alert("Incorrect answer. The puzzle remains unsolved.");
        gameState.health -= 10;
        updateGameState();
    }
}

function useFireball() {
    if (gameState.spells.includes("Fireball")) {
        alert("You cast Fireball! The dark sorcerer is scorched, and their health decreases.");
        gameState.health -= 20;
        updateGameState();
    } else {
        alert("You don't have the Fireball spell!");
    }
}

function useShield() {
    if (gameState.spells.includes("Shield")) {
        alert("You use the Shield spell! Your defense increases, reducing damage taken.");
        gameState.health += 10;  // Temporary defense increase
        updateGameState();
    } else {
        alert("You don't have the Shield spell!");
    }
}

function useHealingSpell() {
    if (gameState.spells.includes("Healing Spell")) {
        alert("You cast Healing Spell! Your health is restored.");
        gameState.health = Math.min(100, gameState.health + 30); // Heal up to 100
        updateGameState();
    } else {
        alert("You don't have the Healing Spell!");
    }
}

function usePotion() {
    if (gameState.inventory.includes("Health Potion")) {
        alert("You drink a Health Potion! Your health is restored.");
        gameState.health = Math.min(100, gameState.health + 20); // Heal up to 100
        gameState.inventory = gameState.inventory.filter(item => item !== "Health Potion");
        updateGameState();
    } else {
        alert("You don't have a Health Potion!");
    }
}

function restartGame() {
    gameState.currentRoom = 'entrance';
    gameState.inventory = [];
    gameState.health = 100;
    gameState.magic = 50;
    gameState.spells = [];
    gameState.questCompleted = false;
    gameState.finalBattleStarted = false;
    gameState.artifactInvestigationDone = false;
    gameState.puzzleSolved = false;
    displayRoom(gameState.currentRoom);
    updateGameState();
}

// Start the game
displayRoom(gameState.currentRoom);
updateGameState();
