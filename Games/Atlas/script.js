document.getElementById("restartButton").addEventListener("click", restartGame);
var computerCountries = [];
var playerCountries = [];
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus",
  "Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
  "Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","East Timor",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","North Korea","South Korea","Kosovo","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova",
  "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal",
  "Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
  "Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe"
];
var score = 0;
var incorrectAttempts = 0;
var maxIncorrectAttempts = 3;
var passes = 0;
var maxPasses = 2;
function displayCountries() {
  var computerList = document.getElementById("computerList");
  var playerList = document.getElementById("playerList");

  // Clear the previous lists
  computerList.innerHTML = "";
  playerList.innerHTML = "";

  // Display the computer's countries
  for (var i = 0; i < computerCountries.length; i++) {
    var countryItem = document.createElement("li");
    countryItem.textContent = computerCountries[i];
    computerList.appendChild(countryItem);
  }

  // Display the player's countries
  for (var j = 0; j < playerCountries.length; j++) {
    var countryItem = document.createElement("li");
    countryItem.textContent = playerCountries[j];
    playerList.appendChild(countryItem);
  }
}
function passTurn() {
	
  if (passes >= maxPasses || countries.length === 0) {
    endGame();
    return;
  }

  passes++;
  var lastComputerCountry = document.getElementById("result").textContent.split(": ")[1];
  var lastLetter = lastComputerCountry.charAt(lastComputerCountry.length - 1).toLowerCase();

  var countriesWithLastLetter = countries.filter(function (country) {
    return country.charAt(0).toLowerCase() === lastLetter;
  });

  if (countriesWithLastLetter.length > 0) {
    var randomIndex = Math.floor(Math.random() * countriesWithLastLetter.length);
    var computerCountry = countriesWithLastLetter[randomIndex];

    document.getElementById("result").textContent = "My Country: " + computerCountry;
	computerCountries.push(computerCountry);
    updateScore(0);

  } else {
    document.getElementById("result").textContent = "No more countries available. Game Over!";
    endGame();
  }
}




function playGame() {
  document.getElementById("instructions").style.display = "none";
  var userCountry = document.getElementById("userCountry").value.toLowerCase(); // Convert input to lowercase
  var lastLetter = userCountry.charAt(userCountry.length - 1).toLowerCase();

  if (incorrectAttempts >= maxIncorrectAttempts || passes >= maxPasses || countries.length === 0) {
    endGame();
    return;
  }

  if (userCountry === "pass") {
    passes++;
    document.getElementById("result").textContent = "You passed!";
    return;
  }

  var index = countries.findIndex(function(country) { // Use findIndex() for case-insensitive match
    return country.toLowerCase() === userCountry;
  });

  if (index > -1) {
    countries.splice(index, 1);
    var countriesWithLastLetter = countries.filter(function (country) {
      return country.charAt(0).toLowerCase() === lastLetter;
    });

    if (countriesWithLastLetter.length > 0) {
		playerCountries.push(userCountry);
      var randomIndex = Math.floor(Math.random() * countriesWithLastLetter.length);
      var computerCountry = countriesWithLastLetter[randomIndex];
		
      document.getElementById("result").textContent = "Computer's Country: " + computerCountry;
	computerCountries.push(computerCountry);
      updateScore(1);
      passes = 0;
    } else {
      document.getElementById("result").textContent = "No more countries available. Game Over!";
      endGame();
    }
    document.getElementById("userCountry").value = ""; 
  } else {
    document.getElementById("result").textContent = "Invalid country. Sorry! I don't know about this country.";

    updateScore(-1);
    incorrectAttempts++;
  }
}

function updateScore(points) {
  score += points;
  document.getElementById("score").textContent = "Your Score: " + score;

  displayCountries();
}


function endGame() {
  var message = "";
  if (incorrectAttempts >= maxIncorrectAttempts) {
    message = "Game Over! You made too many incorrect attempts.";
  } else if (passes >= maxPasses) {
    message = "Game Over! You passed too many times.";
  }

  document.getElementById("result").textContent = message;
  document.getElementById("userCountry").disabled = true;
}

function restartGame() {
  playerCountries = [];
  computerCountries = [];

  score = 0;
  incorrectAttempts = 0;
  passes = 0;

  document.getElementById("userCountry").value = ""; 
  document.getElementById("userCountry").disabled = false;
  document.getElementById("result").textContent = "Enter a country name to start the game.";
  document.getElementById("score").textContent = "Your Score: " + score;

  displayCountries();
}
