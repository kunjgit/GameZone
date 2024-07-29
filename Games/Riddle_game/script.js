const riddles = [
    {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: "echo"
    },
    {
        question: "You measure my life in hours and I serve you by expiring. I die once I'm devoured. What am I?",
        answer: "candle"
    },
    {
        question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: "map"
    },
    {
        question: "What is seen in the middle of March and April that can’t be seen at the beginning or end of either month?",
        answer: "r"
    },
    {
        question: "You see a boat filled with people, yet there isn’t a single person on board. How is that possible?",
        answer: "all the people were married"
    },
    {
        question: "What word in the English language does the following: the first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire world signifies a great woman. What is the word?",
        answer: "heroine"
    },
    {
        question: "I have keys but can’t open locks. I have space but no room. You can enter, but can’t go outside. What am I?",
        answer: "keyboard"
    },
    {
        question: "What has many hearts but no other organs?",
        answer: "deck of cards"
    },
    {
        question: "The more of this there is, the less you see. What is it?",
        answer: "darkness"
    },
    {
        question: "What can travel around the world while staying in a corner?",
        answer: "stamp"
    }
];

let currentRiddle = riddles[Math.floor(Math.random() * riddles.length)];

document.getElementById("riddle").textContent = currentRiddle.question;

function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    const result = document.getElementById("result");

    if (userAnswer === currentRiddle.answer.toLowerCase()) {
        result.textContent = "Correct! Well done!";
        result.style.color = "green";
    } else {
        result.textContent = "Wrong answer. Try again!";
        result.style.color = "red";
    }
}
