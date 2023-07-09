// Initial References
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");

// Data of countries
const data = [
	"belgium",
	"bhutan",
	"brazil",
	"china",
	"cuba",
	"ecuador",
	"georgia",
	"germany",
	"hong-kong",
	"india",
	"iran",
	"myanmar",
	"norway",
	"spain",
	"sri-lanka",
	"sweden",
	"switzerland",
	"united-states",
	"uruguay",
	"wales",
];

// Data keys from google drive
const dataKeys = [
	'https://drive.google.com/uc?export=view&id=1_CkXcFAYkIVqHHv2ttYhQxBZSZff3Q_W',
	'https://drive.google.com/uc?export=view&id=1H7FyMYqeEYi9RKx0FUWMKq6FRY3lgSvn',
	'https://drive.google.com/uc?export=view&id=13-sAz6JVkBvQh4db227HYdTTYJh2ca51',
	'https://drive.google.com/uc?export=view&id=1DCrkxUy5yvG9L3ZdqzGrrQOtF2U5M9rn',
	'https://drive.google.com/uc?export=view&id=1oVXpDNN1QiB18in4L-IG9744uaat9aq6',
	'https://drive.google.com/uc?export=view&id=1U6XguYxSyhxB9B7zf5Sk2uuyM-YAsIx_',
	'https://drive.google.com/uc?export=view&id=12XEp-MdQvs7MW_eh-GKD89MQD3Cm7cju',
	'https://drive.google.com/uc?export=view&id=1_rKOSzv6d3B5LUxdBo730pwlG22BnQ_4',
	'https://drive.google.com/uc?export=view&id=1Y1o3PzkHNoVd-ZmtOCKQ6swDqZbiR0E_',
	'https://drive.google.com/uc?export=view&id=1T6A7-Qm5rHqUdL1-SqIccgXVDX7KP_v3',
	'https://drive.google.com/uc?export=view&id=1TbgXbDZSeuHOGBcWrSUmveHQmgHz4zgw',
	'https://drive.google.com/uc?export=view&id=1xwRs1Ahsc6ATp1B1t5myAG8QhzDElv5h',
	'https://drive.google.com/uc?export=view&id=1Oi0N9OGn9AVGtfNVh1FZlKqCrNa_GESA',
	'https://drive.google.com/uc?export=view&id=1y-8mF4oOwoaNLsR_J-EUVs11XNro0esZ',
	'https://drive.google.com/uc?export=view&id=1Ml0-wrArYyJd0Mk1ZXmN_Gp9PnntSLAT',
	'https://drive.google.com/uc?export=view&id=1C0uP2mCR4d9x1DeMpWJdQFrUSOYDWwqV',
	'https://drive.google.com/uc?export=view&id=15seW5u7_ITNVA4417kQTHHT3q6yTf0Q4',
	'https://drive.google.com/uc?export=view&id=1L2n2w_LVAaYumgiNi1S1ZtMgjgfmDMuO',
	'https://drive.google.com/uc?export=view&id=171ezM11DpauSrQOCylnZf6UWz9HgZe57',
	'https://drive.google.com/uc?export=view&id=1xDAFnznSPMMBGZDz0VeLoYuZSPbTCTEt',
];

// global variables
let deviceType = "";
let initialX = 0, initialY = 0;
let currentElement = "";
let moveElement = false;

// Audio variables
const bgMusic = new Audio();
bgMusic.src = 'https://drive.google.com/uc?export=download&id=1RZrEjs6-lZK3B9uu20qW-sbruxjwScSi';

const correctAns = new Audio();
correctAns.src = 'https://drive.google.com/uc?export=download&id=1zZHbTCgTHG_wGYk6ir_Rc4An-vL70ubd';

const gameOver = new Audio();
gameOver.src = 'https://drive.google.com/uc?export=download&id=1F0dr1NTXDF-J_rJvNPUa_T8DPuuv4a7a';

const move = new Audio();
move.src = 'https://drive.google.com/uc?export=download&id=1RpeMfpkAAE8vFLAc3saTE2hN_xv8-1pM';

const wrongAns = new Audio();
wrongAns.src = 'https://drive.google.com/uc?export=download&id=1hI9DPEwRic_zQOxaknoffAHR4Qg27EyI';

// Detect touch device
const isTouchDevice = () => {
	try {
		// We try to create Touch Event (It would fail for desktops and throw error)
		document.createEvent("TouchEvent");
		deviceType = "touch";
		return true;
	} catch (e) {
		deviceType = "mouse";
		return false;
	}
};

let count = 0;

// Random value from Array
const randomValueGenerator = () => {
	return data[Math.floor(Math.random() * data.length)];
};

// Win Game Display
const stopGame = () => {
	controls.classList.remove("hide");
	startButton.classList.remove("hide");
};

// Drag & Drop Functions
function dragStart(e) {
	move.play();
	if (isTouchDevice()) {
		initialX = e.touches[0].clientX;
		initialY = e.touches[0].clientY;
		// Start movement for touch
		moveElement = true;
		currentElement = e.target;
	} else {
		// For non touch devices set data to be transfered
		e.dataTransfer.setData("text", e.target.id);
	}
}

// Events fired on the drop target
function dragOver(e) {
	e.preventDefault();
}

// For touchscreen movement
const touchMove = (e) => {
	if (moveElement) {
		e.preventDefault();
		let newX = e.touches[0].clientX;
		let newY = e.touches[0].clientY;
		let currentSelectedElement = document.getElementById(e.target.id);
		currentSelectedElement.parentElement.style.top =
			currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
		currentSelectedElement.parentElement.style.left =
			currentSelectedElement.parentElement.offsetLeft -
			(initialX - newX) +
			"px";
		initialX = newX;
		initialY - newY;
	}
};

const drop = (e) => {
	e.preventDefault();
	// For touch screen
	if (isTouchDevice()) {
		moveElement = false;
		// Select country name div using the custom attribute
		const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
		// Get boundaries of div
		const currentDropBound = currentDrop.getBoundingClientRect();
		// if the position of flag falls inside the bounds of the countru name
		if (
			initialX >= currentDropBound.left &&
			initialX <= currentDropBound.right &&
			initialY >= currentDropBound.top &&
			initialY <= currentDropBound.bottom
		) {
			correctAns.play();
			currentDrop.classList.add("dropped");
			// hide actual image
			currentElement.classList.add("hide");
			currentDrop.innerHTML = ``;
			// Insert new img element
			currentDrop.insertAdjacentHTML(
				"afterbegin",
				`<img src= "${dataKeys[data.indexOf(currentElement.id)]}">`
			);
			count += 1;
		} else {
			wrongAns.play();
		}
	} else {
		// Access data
		const draggedElementData = e.dataTransfer.getData("text");
		// Get custom attribute value
		const droppableElementData = e.target.getAttribute("data-id");
		if (draggedElementData === droppableElementData) {
			correctAns.play();
			const draggedElement = document.getElementById(draggedElementData);
			// dropped class
			e.target.classList.add("dropped");
			// hide current img
			draggedElement.classList.add("hide");
			// draggable set to false
			draggedElement.setAttribute("draggable", "false");
			e.target.innerHTML = ``;
			// insert new img
			e.target.insertAdjacentHTML(
				"afterbegin",
				`<img src="${dataKeys[data.indexOf(draggedElementData)]}">`
			);
			count += 1;
		} else {
			wrongAns.play();
		}
	}
	// Winning condition
	if (count == 3) {
		correctAns.pause();
		bgMusic.pause();
		gameOver.play();
		result.innerText = `You Won!`;
		stopGame();
	}
};

// Creates flags and countries
const creator = () => {
	dragContainer.innerHTML = "";
	dropContainer.innerHTML = "";
	let randomData = [];
	// for string random values in array
	for (let i = 1; i <= 3; i++) {
		let randomValue = randomValueGenerator();
		if (!randomData.includes(randomValue)) {
			randomData.push(randomValue);
		} else {
			// If value already exists then decrement i by 1
			i -= 1;
		}
	}
	for (let i of randomData) {
		const flagDiv = document.createElement("div");
		flagDiv.classList.add("draggable-image");
		flagDiv.setAttribute("draggable", true);
		if (isTouchDevice()) {
			flagDiv.style.position = "absolute";
		}
		flagDiv.innerHTML = `<img src="${dataKeys[data.indexOf(i)]}" id="${i}">`;
		dragContainer.appendChild(flagDiv);
	}
	// Sort the array randomly before creating country divs
	randomData = randomData.sort(() => 0.5 - Math.random());
	for (let i of randomData) {
		const countryDiv = document.createElement("div");
		countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>
    `;
		dropContainer.appendChild(countryDiv);
	}
};

// Start Game
startButton.addEventListener("click", (startGame = async () => {
	bgMusic.play();
	currentElement = "";
	controls.classList.add("hide");
	startButton.classList.add("hide");
	// This will wait for creator to create the images and then move forward
	await creator();
	count = 0;
	dropPoints = document.querySelectorAll(".countries");
	draggableObjects = document.querySelectorAll(".draggable-image");

	// Events
	draggableObjects.forEach((element) => {
		element.addEventListener("dragstart", dragStart);
		// for touch screen
		element.addEventListener("touchstart", dragStart);
		element.addEventListener("touchend", drop);
		element.addEventListener("touchmove", touchMove);
	});
	dropPoints.forEach((element) => {
		element.addEventListener("dragover", dragOver);
		element.addEventListener("drop", drop);
	});
})
);
