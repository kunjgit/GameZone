var secret_code = generateCode();
var step_counter = 0;
var show = document.getElementById('show');
var ans = document.getElementById('code');

document.getElementById("submit").addEventListener("click", getInput);

document.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		getInput();
	}
});

function getInput() {
	var x = document.getElementById('i_p').value;
	var o_p = document.getElementById("o_p");
	o_p.innerHTML = x;
	processInput(x);
}

function processInput(input) {
	var n = input.length;
	if (document.getElementById("submit").innerHTML === "Reset") {
		cleanAll();
	}
	else if (n > 4) {
		o_p.innerHTML = "Input exceeds 4 character!";
	}
	else if (n < 4) {
		o_p.innerHTML = "Input is less than 4 character!";
	}
	else if (step_counter === 10) {
		document.getElementById("is_game").innerHTML = "Fool, You Loose! Eat some Horlics!";

		show.style.display = '';
		show.addEventListener('click', () => {
			ans.style.display = '';
			show.style.display = 'none';
		});
		resetGame();
	}
	else {
		step_counter++;
		checkSubmission(input);
	}

	return;
}

function generateCode() {
	var code = "";
	for (var i = 0; i < 4; i++) {
		var n = getRandomIntInclusive(0, 9);
		code += n.toString();
	}
	document.getElementById("code").innerHTML = code;
	return code;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkSubmission(usr_input) {
	if (usr_input === secret_code) {
		document.getElementById("is_game").innerHTML = "Good guess! You win!!";
		resetGame();
	}
	var result = "";

	for (var i = 0; i < 4; i++) {
		var found = false;
		if (usr_input[i] === secret_code[i]) {
			result += "Y ";
			found = true;
			continue;
		}
		for (var j = 0; j < 4; j++) {
			if (usr_input[i] === secret_code[j]) {
				result += "E ";
				found = true;
				break;
			}
		}
		if (!found) {
			result += "X ";
		}
	}
	document.getElementById("check").innerHTML = result;
	showSubmission(result, usr_input);
	return;
}
function showSubmission(result, usr_input) {
	var ul = document.getElementById("step");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(usr_input + "   >>>    " + result));
	ul.appendChild(li);
}

function resetGame() {
	document.getElementById("submit").innerHTML = "Reset";
}

function cleanAll() {
	secret_code = generateCode();
	step_counter = 0;
	document.getElementById("step").innerHTML = "<li><b>Guess   &nbsp;     Result</b></li>"
	document.getElementById("submit").innerHTML = "Submit";
	show.style.display = 'none';
	ans.style.display = 'none';
	document.getElementById('is_game').innerHTML = '';
	return;
}
