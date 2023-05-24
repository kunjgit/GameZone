const userGuess = document.getElementById("user-guess");
const submitBtn = document.getElementById("submit");
const usersWord = document.getElementById("scrambled-word");
const info = document.getElementById("info");
const levelOutput = document.getElementById("level");
const scoreOutput = document.getElementById("score");
const attemptsOutput = document.getElementById("attempts");
const gameContainer = document.getElementById("game-container");
const guessContainer = document.getElementById("guess-container");
const rules = document.getElementById("rules");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");

let level = 1;
let score = 0;
let word;
let attempts = 0;
let correct = 0;

const lvlOneWords = [
    "aim", "bed", "buy", "can", "cow", "dry", "egg",  "fat", "fix", "few", "gym", "hen", "hut", "ice", "jet", "job", "jaw", 
    "kid", "lip", "leg", "let", "led", "law", "lid", "mud", "mid", "now", "oil", "owl", "off", "one", "pea", "pen", "rob", 
    "saw", "sec", "shy", "sly", "the", "try", "van", "vet", "wow", "yah", "yak", "yay", "you", "zig", "zip"
];

const lvlTwoWords = [
    "able", "acid", "also", "area", "aunt", "axis", "baby", "back", "ball", "babe", "bell", "bind", "book", "case", "chef", 
    "curl", "chat", "chin", "chop", "damp", "dart", "dark", "deck", "deep", "diva", "dice", "easy", "ends", "epic", "evil", 
    "exam", "face", "fact", "fail", "fair", "fall", "farm", "gain", "glad", "hats", "haze", "help", "head", "hers", "hike", 
    "junk", "jury", "kept", "keys", "kiss", "lamp", "less", "mark", "mile", "mine", "name", "obey", "pack", "palm", "raid", 
    "self", "slip", "thin", "tied", "tofu", "tree", "ugly", "used", "vans", "visa", "wait", "wasp", "zone", "zest", "zero"
];

const lvlThreeWords = [
    "about", "abort", "above", "adapt", "array", "angry", "basic", "brisk", "bends", "berry", "below", "blush", "cable", 
    "champ", "crack", "cycle", "daddy", "dance", "denim", "digit", "dolly", "douse", "dryer", "earth", "event", "exact", 
    "equal", "false", "fever", "fiber", "fifty", "froze", "fruit", "gamma", "gangs", "guild", "hairy", "hello", "honor", 
    "image", "issue", "ionic", "japan", "jewel", "juice", "keeps", "lamps", "laser", "miles", "meats", "might", "mixer", 
    "moths", "movie", "named", "newer", "nexus", "noise", "north", "nutty", "olive", "opens", "owner", "paced", "puppy", 
    "petty", "phone", "phase", "pound", "pride", "print", "purse", "queen", "query", "quiet", "rafts", "rated", "react", 
    "ready", "rides", "rigid", "rumor", "sadly", "safes", "salsa", "sauce", "seeds", "scums", "sense", "shark", "sheds", 
    "shout", "shove", "sides", "sixth", "skill", "solid", "sound", "south", "spoil", "stall", "stole", "store", "sword", 
    "texts", "texas", "today", "tried", "truth", "using", "usual", "valid", "venue", "vowel", "waked", "waist", "whole", 
    "wordy", "zones", "zeros", "yummy", "youth"
];


function reset() 
{
    level = 1;
    score = 0;
    correct = 0;
    attempts = 0;
    word = "";
    updateBoard();
    info.innerHTML = "";
    userGuess.value = "";
}

function randomWord(lvl) 
{
    word = lvl[Math.floor(Math.random() * lvl.length + 1) - 1];
    return word;
}

function scrambleWord(word) 
{
    let letters = word.split("");
    let currentIndex = letters.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) 
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = letters[currentIndex];
        letters[currentIndex] = letters[randomIndex];
        letters[randomIndex] = temporaryValue;
    }
    return letters.join(" ");
}

function updateBoard() 
{
    scoreOutput.innerHTML = score;
    levelOutput.innerHTML = level;
    attemptsOutput.innerHTML = attempts;
}

function checkAnswer(guess) 
{
    console.log(`Correct: ${correct}`);
    if(level == 1)
    {
        if (correct == 2) 
        {
            level += 1;
            correct = 0;
        }
    }
    else if(level == 2)
    {
        if (correct == 2) 
        {
            level += 1;
            correct = 0;
        }
    }
    else if(level == 3)
    {
        if (correct == 2) 
        {
            level += 1;
            correct = 0;
        }
    }

    if (attempts < 3) 
    {
        if (guess === word) 
        {
            info.innerHTML = "<span class='correct'>CORRECT</span>";
            score += 1;
            correct += 1;
            attempts = 0;
            setLevel();
        } 
        else 
        {
            info.innerHTML = "<span class='incorrect'>Bzzzt! That's not right!</span>";
            score -= 1;
            attempts += 1;
        }
    }
    else
    {
        alert("Attempts are over. Better luck next time.");
        reset();
        setLevel();
    }
    updateBoard();
}

function setLevel() 
{
    if (level == 1) 
    {
        randomWord(lvlOneWords);
    } 
    else if (level == 2) 
    {
        randomWord(lvlTwoWords);
    } 
    else if (level == 3) 
    {
        randomWord(lvlThreeWords);
    } 
    else if (level == 4) 
    {
        alert("You Win! Great job! Click Ok to reset Game");
        reset();
        setLevel();
    }
    usersWord.innerHTML = scrambleWord(word);
}

playBtn.addEventListener("click", function(e) {
    rules.classList.toggle("hidden");
    gameContainer.classList.remove("hidden");
});

submitBtn.addEventListener("click", function(e) {
    checkAnswer(userGuess.value.toLowerCase());
    userGuess.value = "";
});

window.addEventListener("keypress", function(e) {
        if (e.keyCode == 13) {
            checkAnswer(userGuess.value.toLowerCase());
            userGuess.value = "";
        }
    },
    false
);

resetBtn.addEventListener("click", function(e) {
    reset();
    setLevel();
    guessContainer.classList.remove("hidden");
    userGuess.value = "";
});

setLevel();