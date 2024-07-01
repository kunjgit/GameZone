const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

// Category of questions in each column
const jeopardyCategories = [
	{
		genre: "WHO",
		questions: [
			{
				question: "Who wrote Harry Potter books?",
				answers: ["JK Rowling", "Rudyard Kipling"],
				correct: "JK Rowling",
				level: "easy",
			},
			{
				question: "Who was born on Krypton?",
				answers: ["Aquaman", "Superman"],
				correct: "Superman",
				level: "medium",
			},
			{
				question: "Who designed the first car?",
				answers: ["Karl Benz", "Henry Ford"],
				correct: "Karl Benz",
				level: "medium",
			},
		],
	},

	{
		genre: "WHERE",
		questions: [
			{
				question: "Where is Buckingham Palace?",
				answers: ["Richmond", "London"],
				correct: "London",
				level: "easy",
			},
			{
				question: "Where is the Colosseum?",
				answers: ["Rome", "Milan"],
				correct: "Rome",
				level: "medium",
			},
			{
				question: "Where is Mount Kilimanjaro?",
				answers: ["Zimbabwe", "Tanzania"],
				correct: "Tanzania",
				level: "hard",
			},
		],
	},

	{
		genre: "WHEN",
		questions: [
			{
				question: "When is Christmas?",
				answers: ["30th December", "25th December"],
				correct: "25th December",
				level: "easy",
			},
			{
				question: "When was JFK assassinated?",
				answers: ["1963", "1961"],
				correct: "1963",
				level: "hard",
			},
			{
				question: "When was WW2?",
				answers: ["1932", "1939"],
				correct: "1939",
				level: "medium",
			},
		],
	},

	{
		genre: "WHAT",
		questions: [
			{
				question: "What is the capital of Saudi Arabia?",
				answers: ["Jeddah", "Riyadh"],
				correct: "Riyadh",
				level: "hard",
			},

			{
				question: "What do Koalas eat?",
				answers: ["Straw", "Eucalyptus"],
				correct: "Eucalyptus",
				level: "medium",
			},

			{
				question: "What is a kg short for?",
				answers: ["Kilojoule", "Kilogram"],
				correct: "Kilogram",
				level: "easy",
			},
		],
	},

	{
		genre: "HOW MANY",
		questions: [
			{
				question: "How many players in a football team?",
				answers: ["15", "11"],
				correct: "11",
				level: "easy",
			},
			{
				question: "How many seconds in an hour?",
				answers: ["36000", "3600"],
				correct: "3600",
				level: "medium",
			},
			{
				question: "How many people in China?",
				answers: ["1.1 billion", "1.4 billion"],
				correct: "1.4 billion",
				level: "hard",
			},
		],
	},
];

let score = 0;

function addCategory(category) {
	// create a div and add a class to it
	const column = document.createElement("div");
	column.classList.add("genre-column");

	const genreTitle = document.createElement("div");
	genreTitle.classList.add("genre-title");
	genreTitle.innerHTML = category.genre; // from the jeopardyCategories

	column.appendChild(genreTitle); // put one div inside another
	game.append(column);

	// for each question inside questions array inside category
	category.questions.forEach((question) => {
		const card = document.createElement("div");
		card.classList.add("card");
		column.append(card);

		if (question.level === "easy") {
			card.innerHTML = 100;
		}

		if (question.level === "medium") {
			card.innerHTML = 100;
		}

		if (question.level === "hard") {
			card.innerHTML = 300;
		}

		card.setAttribute("data-question", question.question); // for each div  set this attribute with actual question as its value

		// options
		card.setAttribute("data-answer-1", question.answers[0]);
		card.setAttribute("data-answer-2", question.answers[1]);

		card.setAttribute("data-correct", question.correct); // correct answer

		// get points on card
		card.setAttribute("data-value", card.getInnerHTML());

		// flip functionality
		card.addEventListener("click", flipCard);
	});
}

jeopardyCategories.forEach((category) => addCategory(category));

function flipCard() {
	this.innerHTML = "";

	// change font style of text elements on card
	this.style.fontSize = "15px";
	this.style.lineHeight = "30px";

	this.style.backgroundColor = "red";
	this.style.borderColor = "red";
	const textDisplay = document.createElement("div");
	textDisplay.classList.add("card-text");

	textDisplay.innerHTML = this.getAttribute("data-question");

	const firstButton = document.createElement("button");
	const secondButton = document.createElement("button");

	firstButton.classList.add("first-button");
	secondButton.classList.add("second-button");

	firstButton.innerHTML = this.getAttribute("data-answer-1");
	secondButton.innerHTML = this.getAttribute("data-answer-2");

	// on choosing answer
	firstButton.addEventListener("click", getResult);
	secondButton.addEventListener("click", getResult);

	// put all of them inside the Card
	this.append(textDisplay, firstButton, secondButton);

	// select all cards with class card and put them in an array
	const allCards = Array.from(document.querySelectorAll(".card"));

	// If a card is clicked, then don't allow another card click also
	allCards.forEach((card) => card.removeEventListener("click", flipCard));
}

function getResult() {
	const allCards = Array.from(document.querySelectorAll(".card"));
	allCards.forEach((card) => card.addEventListener("click", flipCard));

	const cardOfButton = this.parentElement;

	// if attribute in parent is equal to chosen answer
	if (cardOfButton.getAttribute("data-correct") == this.innerHTML) {
		score = score + parseInt(cardOfButton.getAttribute("data-value"));
		scoreDisplay.innerHTML = score;
		cardOfButton.classList.add("correct-answer");

		var correctSound = document.getElementById("correctSound");
		correctSound.play();

		// display only if correct answer is chosen
		setTimeout(() => {
			while (cardOfButton.firstChild) {
				cardOfButton.removeChild(cardOfButton.lastChild);
			}

			cardOfButton.innerHTML = cardOfButton.getAttribute("data-value");
		}, 100);
	} else {
		cardOfButton.classList.add("wrong-answer");

		var wrongSound = document.getElementById("wrongSound");
		wrongSound.play();

		setTimeout(() => {
			while (cardOfButton.firstChild) {
				cardOfButton.removeChild(cardOfButton.lastChild);
			}

			cardOfButton.innerHTML = 0;
		}, 100);
	}
	cardOfButton.removeEventListener("click", flipCard);
}
