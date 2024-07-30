let score,
 	 answer,
 	 chances,
	  currentQuestion;
	  
const question = document.querySelector("#question"),
		counter = document.querySelector("#counter"),
		message = document.querySelector("#error"),
		submitButton = document.querySelector("#submit"),
		nextButton = document.querySelector("#next"),
		scoreDisplay = document.querySelector("#score"),
		input = document.querySelector('#input'),
		guessDisplay = document.querySelector('#guesses');

const database = [
	{
		question: "What animal is the tallest?",
		answer: "giraffe",
	},	
	{
		question: "What animal's baby is called a 'joey'?",
		answer: "kangaroo",
	},
	{
		question: "What animal is the fastest on land?",
		answer: "cheetah",
	},
	{
		question: "What animal can sleep for 3 years?",
		answer: "snail",
	},
	{
		question: "What animal's group name is 'Crash'?",
		answer: "rhinoceros",
	},
	{
		question: "What animal makes a neighing sound?",
		answer: "horse",
	},
	{
		question: "What animal is the only flying mammal?",
		answer: "bat",
	},
	{
		question: "What animal has teeth in its stomach?",
		answer: "lobster",
	},
];

const init = () => {
	score = 0;
	currentQuestion = 0;
	chances = 3;
	displayQuestion();
	checkAnswer();
	next()
};

const displayQuestion = () => {
	question.innerText = database[currentQuestion].question;
	answer = database[currentQuestion].answer;
};

const checkAnswer = () => {

	submitButton.addEventListener('click', function(){
		checkInput()
	})

	document.querySelector('.container').addEventListener('keypress', function(e){
		if (e.keyCode == 13){
			checkInput()
		}
	})
	
}

const checkInput = () => {
	
	if (!input.value){
		showMessage('Please enter a value', 'red')
		setTimeout(clearError, 2500)
		return
	}

	if (typeof (input.value) == "number"){
		showMessage('Numbers are invalid', 'red')
		setTimeout(clearError, 2500)
		return
	}

	if (input.value.toLowerCase() === answer){
		input.classList.remove('bad')
		input.classList.add('good')
		input.disabled = true
		showMessage(`${answer} is correct. Well-done!`, 'green')
		submitButton.disabled = true
		nextButton.disabled = false
		score += 5
		scoreDisplay.textContent = score
		// input.setAttribute.disabled = 'true'
		answeredCorrect = true
	} 
	
	else {

		chances -= 1
		guessDisplay.textContent = chances

		if (chances === 0) {
			input.disabled = true
			showMessage(`You've run out of chances, the answer is ${answer}`, 'red')
			submitButton.disabled = true
			nextButton.disabled = false
			score -= 1
			scoreDisplay.textContent = score
		} 
		else {
			showMessage(`${input.value} is wrong. Try again`, '#db1414')
			input.classList.add('bad')
			submitButton.disabled = true
			setTimeout(clearError, 2500)
		}
	}
}

const next = () => {

	nextButton.addEventListener('click', function(){

		if (currentQuestion === (database.length - 1)){
			localStorage.setItem('finalScore', score)
			reset()
			return window.location.href = "results.html"	 
		}

		if (currentQuestion === (database.length - 2)){
			nextButton.textContent = 'Finish'
		}

		reset()
		currentQuestion++
		displayQuestion()
		counter.textContent = currentQuestion + 1

	})
}


const showMessage = (messageContent, messageColor) => {
	message.textContent = messageContent;
	message.style.color = messageColor
}

const clearError = () => {
	message.textContent = ''
	input.classList.remove('bad')
	input.value = ''
	submitButton.disabled = false
}

const reset = () => {
	nextButton.disabled = true
	submitButton.disabled = false
	input.disabled = false
	input.classList.remove('good')
	input.value = ''
	message.textContent = ''
	chances = 3
	guessDisplay.textContent = chances
}


init();