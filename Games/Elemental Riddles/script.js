const elements = [
    {
        symbol: "H",
        name: "Hydrogen",
        atomicWeight: 1.008,
        description: "Hydrogen is the lightest and most abundant element in the universe.",
        hint: "It is the first element in the periodic table.",
        hint2: "The Hindenburg disaster involved this element in its flammable form."
    },
    {
        symbol: "He",
        name: "Helium",
        atomicWeight: 4.0026,
        description: "Helium is a chemical element with the symbol He and atomic number 2.",
        hint: "It is used to cool superconducting magnets in MRI machines.",
        hint2: "This element has the lowest boiling point of all elements."
    },
    {
        symbol: "Li",
        name: "Lithium",
        atomicWeight: 6.94,
        description: "Lithium is a soft, silvery metal used in batteries and some medications.",
        hint: "It is a key component in rechargeable batteries.",
        hint2: "This element is used to treat bipolar disorder."
    },
    {
        symbol: "C",
        name: "Carbon",
        atomicWeight: 12.011,
        description: "Carbon is the basis of life and an essential element for organic compounds.",
        hint: "It has several allotropes, including diamond and graphite.",
        hint2: "This element is a primary component of greenhouse gases."
    },
    {
        symbol: "O",
        name: "Oxygen",
        atomicWeight: 15.999,
        description: "Oxygen is a gas that is essential for respiration and combustion.",
        hint: "It makes up about 21% of Earth's atmosphere.",
        hint2: "This element is used in medical applications, like oxygen tanks."
    },
    {
        symbol: "Fe",
        name: "Iron",
        atomicWeight: 55.845,
        description: "Iron is a strong and abundant metal used in construction and manufacturing.",
        hint: "It is a key component of hemoglobin in red blood cells.",
        hint2: "This element can form rust when exposed to moisture and air."
    },
    {
        symbol: "Ag",
        name: "Silver",
        atomicWeight: 107.8682,
        description: "Silver is a precious metal often used in jewelry and currency.",
        hint: "It has the highest electrical conductivity of all elements.",
        hint2: "This element is known for its antimicrobial properties."
    },
    {
        symbol: "Au",
        name: "Gold",
        atomicWeight: 196.9665,
        description: "Gold is a highly valued metal known for its beauty and rarity.",
        hint: "It has been used for coins, jewelry, and art throughout history.",
        hint2: "This element is inert and does not corrode."
    },
    {
        symbol: "Na",
        name: "Sodium",
        atomicWeight: 22.99,
        description: "Sodium is a highly reactive metal that reacts vigorously with water.",
        hint: "It is an essential element in nerve impulse transmission.",
        hint2: "This element is commonly found in table salt (sodium chloride)."
    },
    {
        symbol: "Cl",
        name: "Chlorine",
        atomicWeight: 35.453,
        description: "Chlorine is a greenish gas used to disinfect water and as a bleach.",
        hint: "It is used in swimming pools to kill bacteria and algae.",
        hint2: "This element is a halogen and is highly reactive."
    },

];
const MAX_HINTS = 2;
const FIRST_GUESS_POINTS = 10;
const SECOND_GUESS_POINTS = 5;
const WRONG_GUESS_POINTS = 0;

const hintElement = document.getElementById("hint");
const userGuessInput = document.getElementById("user-guess");
const submitButton = document.getElementById("submit-btn");
const resultElement = document.getElementById("result");
const elementPropertiesElement = document.getElementById("element-properties");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("reset-btn");

let randomElement;
let score = 0;
let guessCount = 0;
let guessedCorrectly = false;

function initializeGame() {
    randomElement = generateRandomElement();
    hintElement.textContent = randomElement.hint;
}

function generateRandomElement() {
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
}

function displayProperties() {
    resultElement.textContent = `Congratulations! You guessed it right. The element is ${randomElement.name}.`;
    elementPropertiesElement.innerHTML = `
        <p><strong>Symbol:</strong> ${randomElement.symbol}</p>
        <p><strong>Name:</strong> ${randomElement.name}</p>
        <p><strong>Atomic Weight:</strong> ${randomElement.atomicWeight}</p>
        <p><strong>Description:</strong> ${randomElement.description}</p>
    `;
    scoreElement.textContent = `Score: ${score}`;
}

function checkGuess() {
    const userGuess = userGuessInput.value.toLowerCase();
    const lowercaseElementName = randomElement.name.toLowerCase();

    if (userGuess === lowercaseElementName) {
        guessedCorrectly = true;
        if (guessCount === 0) {
            score += FIRST_GUESS_POINTS;
        } else if (guessCount === 1) {
            score += SECOND_GUESS_POINTS;
        }
    }

    guessCount++;
    if (guessedCorrectly) {
        displayProperties();
    } else if (guessCount < MAX_HINTS) {
        hintElement.textContent = randomElement[`hint${guessCount + 1}`];
        userGuessInput.value = "";
    } else {
        resultElement.textContent = `Oops! You didn't guess correctly. The correct element is ${randomElement.name}.`;
        elementPropertiesElement.innerHTML = `
            <p><strong>Symbol:</strong> ${randomElement.symbol}</p>
            <p><strong>Name:</strong> ${randomElement.name}</p>
            <p><strong>Atomic Weight:</strong> ${randomElement.atomicWeight}</p>
            <p><strong>Description:</strong> ${randomElement.description}</p>
        `;
        scoreElement.textContent = `Score: ${score}`;
    }
}

function resetGame() {
    guessedCorrectly = false;
    guessCount = 0;
    score = 0;
    hintElement.textContent = "";
    userGuessInput.value = "";
    resultElement.textContent = "";
    elementPropertiesElement.innerHTML = "";
    scoreElement.textContent = "";
    initializeGame();
}

submitButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", resetGame);

initializeGame();