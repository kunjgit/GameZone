const storyparts = [
    "You decide to follow a shadowy figure lurking in the mansion.",
    "The figure leads you to a hidden library filled with ancient books.",
    "One book catches your eye—a spell to communicate with spirits.",
    "You perform the spell and a ghostly figure appears before you.",
    "The ghost reveals a tragic tale of love and betrayal within these walls.",
    "The ghostly figure vanishes, leaving behind a cryptic clue.",
    "You must decipher the clue to reveal the next step in your journey.",
    "Searching the mansion, you find a hidden passage in the attic.",
    "The passage leads to a creepy laboratory filled with alchemical equipment.",
    "You encounter a locked chest and must find the correct combination.",
    "After solving the puzzle, the chest reveals an ancient artifact.",
    "The artifact possesses strange powers that grant visions of the past.",
    "As you hold the artifact, you experience a glimpse of a tragic event.",
    "To unravel the mystery, you must recreate the events of that night.",
    "You piece together clues and reveal the truth behind the haunting.",
    "With the mystery solved, the mansion begins to glow with a warm light.",
    "The spirits find peace, and the mansion is no longer haunted.",
    "As you exit the mansion, you feel a sense of accomplishment and closure.",
    "The once daunting mansion is now a symbol of stories untangled.",
    "Your adventure may have ended, but the memories will linger forever."
];

// More rooms and choices
const moreRooms = [
    {
        id: 6,
        description: "You enter a dark corridor. Shadows dance around you as you proceed.",
        choices: [
            {
                text: "Follow the shadows",
                nextRoom: 9,
            },
            {
                text: "Go back to the grand hall",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 7,
        description: "The hidden library is filled with ancient books and mysterious symbols.",
        choices: [
            {
                text: "Examine the ancient books",
                nextRoom: 8,
            },
            {
                text: "Leave the library",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 8,
        description: "One particular book stands out—a spell to communicate with spirits.",
        choices: [
            {
                text: "Perform the spell",
                nextRoom: 12,
            },
            {
                text: "Leave the book and the library",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 9,
        description: "The hidden corridor leads to a locked door and a mysterious room.",
        choices: [
            {
                text: "Try to unlock the door",
                nextRoom: 10,
            },
            {
                text: "Go back to the grand hall",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 10,
        description: "The door unlocks with a loud creak. Inside is a creepy laboratory.",
        choices: [
            {
                text: "Explore the laboratory",
                nextRoom: 13,
            },
            {
                text: "Leave the laboratory",
                nextRoom: 9,
            },
        ],
    },
    {
        id: 11,
        description: "You encounter a locked chest. What could be inside?",
        choices: [
            {
                text: "Attempt to open the chest",
                nextRoom: 14,
            },
            {
                text: "Leave the chest and the laboratory",
                nextRoom: 10,
            },
        ],
    },
    {
        id: 12,
        description: "The spell conjures a ghostly figure before you.",
        choices: [
            {
                text: "Listen to the ghost's tale",
                nextRoom: 15,
            },
            {
                text: "End the spell and leave the library",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 13,
        description: "The laboratory is filled with alchemical equipment and strange potions.",
        choices: [
            {
                text: "Investigate the alchemical equipment",
                nextRoom: 11,
            },
            {
                text: "Leave the laboratory",
                nextRoom: 9,
            },
        ],
    },
    {
        id: 14,
        description: "The chest clicks open, revealing an ancient artifact.",
        choices: [
            {
                text: "Take the artifact",
                nextRoom: 16,
            },
            {
                text: "Leave the artifact and the laboratory",
                nextRoom: 10,
            },
        ],
    },
    {
        id: 15,
        description: "The ghost reveals a cryptic clue about the mansion's past.",
        choices: [
            {
                text: "Decipher the clue",
                nextRoom: 17,
            },
            {
                text: "End the conversation and leave the library",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 16,
        description: "The artifact hums with mysterious powers.",
        choices: [
            {
                text: "Hold onto the artifact",
                nextRoom: 18,
            },
            {
                text: "Leave the artifact and the laboratory",
                nextRoom: 13,
            },
        ],
    },
    {
        id: 17,
        description: "The clue points to a hidden passage in the attic.",
        choices: [
            {
                text: "Investigate the hidden passage",
                nextRoom: 19,
            },
            {
                text: "Leave the library and head to the attic",
                nextRoom: 5,
            },
        ],
    },
    {
        id: 18,
        description: "As you hold the artifact, you see a glimpse of a tragic event.",
        choices: [
            {
                text: "Continue holding the artifact",
                nextRoom: 20,
            },
            {
                text: "Leave the artifact and the laboratory",
                nextRoom: 13,
            },
        ],
    },
    {
        id: 19,
        description: "The attic reveals a hidden passage leading downwards.",
        choices: [
            {
                text: "Follow the passage to the basement",
                nextRoom: 4,
            },
            {
                text: "Leave the attic and return to the grand hall",
                nextRoom: 1,
            },
        ],
    },
    {
        id: 20,
        description: "The artifact reveals more visions of the past, urging you to recreate events.",
        choices: [
            {
                text: "Piece together the events",
                nextRoom: 21,
            },
            {
                text: "Leave the artifact and the laboratory",
                nextRoom: 13,
            },
        ],
    },
    {
        id: 21,
        description: "You successfully recreate the tragic events and uncover the truth.",
        choices: [
            {
                text: "Bask in the sense of accomplishment",
                nextRoom: 22,
            },
            {
                text: "Leave the laboratory and exit the mansion",
                nextRoom: -1,
            },
        ],
    },
    {
        id: 22,
        description: "The mansion begins to glow with a warm light, and the spirits find peace.",
        choices: [
            {
                text: "Witness the transformation",
                nextRoom: 23,
            },
            {
                text: "Leave the mansion",
                nextRoom: -1,
            },
        ],
    },
    {
        id: 23,
        description: "The once daunting mansion is now a symbol of stories untangled.",
        choices: [
            {
                text: "Embrace the newfound tranquility",
                nextRoom: 24,
            },
            {
                text: "Leave the mansion and cherish the memories",
                nextRoom: -1,
            },
        ],
    },
    {
        id: 24,
        description: "Your adventure may have ended, but the memories will linger forever.",
        choices: [
            {
                text: "Revel in the memories",
                nextRoom: -1,
            },
            {
                text: "Start a new journey",
                nextRoom: 1,
            },
        ],
    },
];

const allRooms = [...rooms, ...moreRooms];

let currentRoomIndex = 0;

function startGame() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.setAttribute("data-entered", "false");
    gameContainer.addEventListener("animationend", () => {
        gameContainer.setAttribute("data-entered", "true");
    });
    const storyElement = document.getElementById("story");
    const choicesElement = document.getElementById("choices");
    storyElement.textContent = allRooms[currentRoomIndex].description;
    choicesElement.innerHTML = getChoicesHTML(allRooms[currentRoomIndex].choices);
}

function continueStory(choiceIndex) {
    currentRoomIndex = allRooms[currentRoomIndex].choices[choiceIndex].nextRoom;
    if (currentRoomIndex < 0) {
        alert("Congratulations! You have completed the Haunted Mansion Mystery.");
        startGame();
    } else {
        startGame();
    }
}

function getChoicesHTML(choices) {
    let html = "";
    for (let i = 0; i < choices.length; i++) {
        html += `<button onclick="continueStory(${i})">${choices[i].text}</button>`;
    }
    return html;
}

startGame();
