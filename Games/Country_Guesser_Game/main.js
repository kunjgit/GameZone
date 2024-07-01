//creating empty array to store guessed countries
var existingArr = [];
var misMatch = document.querySelector(".misMatch");

var startBtn = document.getElementById("start-btn");
var gameContainer = document.getElementById("game-container");
var timer = document.getElementById("timer");
var progress = document.getElementById("progress");
var countryInput = document.getElementById("country");
var modal = document.getElementById("modal");
var modalText = document.getElementById("modal-text");
var newGameBtn = document.getElementById("new-game-btn");
var interval;
var timerValue = 0;

var modeContainer = document.getElementById("mode-container");
var easyBtn = document.getElementById("easy-btn");
var mediumBtn = document.getElementById("medium-btn");
var hardBtn = document.getElementById("hard-btn");
var timeLimit = 0;

var instructionsBtn = document.getElementById("instructions-btn");
var instructions = document.getElementById("instructions");
var instructionsText = document.getElementById("instructions-text");

instructionsBtn.addEventListener("click", showInstructions);

function showInstructions() {
    instructionsText.innerHTML = "<h4>Instructions:</h4><p>1. Guess the name of the country based on the given clues.</p><p>2. Type the name of the country in the input field and press Enter to submit your answer.</p><p>3. If your answer is correct, it will be added to the list of guessed countries.</p><p>4. Keep guessing until you have guessed all 195 countries. </p> <p>5. Easy: 200 seconds,  Medium: 120 seconds,  Hard: 60 seconds </p>";
    instructions.classList.remove("hidden");
    instructions.classList.add("show");
}

var closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", closeInstructions);

function closeInstructions() {
    instructions.classList.add("hidden");
    instructions.classList.remove("show");
}


startBtn.addEventListener("click", function() {
    startBtn.style.display = "none";
	instructionsBtn.style.display = "none";
    modeContainer.classList.remove("hidden");
});

easyBtn.addEventListener("click", function() {
    timeLimit = 200; // Set the time limit for easy mode (200 seconds)
    startGame();
});

mediumBtn.addEventListener("click", function() {
    timeLimit = 120; // Set the time limit for medium mode (120 seconds)
    startGame();
});

hardBtn.addEventListener("click", function() {
    timeLimit = 60; // Set the time limit for hard mode (60 seconds)
    startGame();
});

newGameBtn.addEventListener("click", startNewGame);

function startGame() {
    modeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    startTimer(timeLimit);
    
}

function startTimer(timeLimit) {
    var intervalId = setInterval(function() {
        timer.textContent = "Time Left: " + timeLimit + "s";
        timeLimit--;

        if (timeLimit < 0) {
            clearInterval(intervalId);
            finishGame();
        }
    }, 1000);
}

function finishGame() {
    gameContainer.classList.add("hidden");
    modalText.innerHTML = "<p id='timeUp'>Time's up!</p><p>You have guessed " + existingArr.length + " countries. <br> Click on replay to play again in the same mode or the home button to return to main menu.</p>";
    modal.classList.remove("hidden");
    modal.classList.add("show");	
}

function startNewGame() {
    clearInterval(interval);
    timerValue = 0;
    timer.textContent = "Timer: 0s";
    existingArr = [];
    progress.textContent = "0";
    countryInput.value = "";
    misMatch.style.display = "none";
    document.querySelector(".listNations").innerHTML = "";
    modal.classList.add("hidden");
    modeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    startTimer(timeLimit);
    gameContainer.classList.add("hidden");
    modal.classList.remove("show");
    modal.classList.add("hidden");
    startGame();
}


function search(ele) {
    if (event.key === "Enter") {
        var countries = [ "afghanistan",
        "åland Islands",
        "albania",
        "algeria",
        "american Samoa",
        "andorra",
        "angola",
        "anguilla",
        "antigua and Barbuda",
        "argentina",
        "armenia",
        "aruba",
        "australia",
        "austria",
        "azerbaijan",
        "bangladesh",
        "barbados",
        "bahamas",
        "bahrain",
        "belarus",
        "belgium",
        "belize",
        "benin",
        "bermuda",
        "bhutan",
        "bolivia",
        "bosnia and Herzegovina",
        "botswana",
        "brazil",
        "british Indian Ocean Territory",
        "british virgin Islands",
        "brunei Darussalam",
        "bulgaria",
        "burkina Faso",
        "burma",
        "burundi",
        "cambodia",
        "cameroon",
        "canada",
        "cape Verde",
        "cayman Islands",
        "central African Republic",
        "chad",
        "chile",
        "china",
        "christmas Island",
        "cocos (Keeling) Islands",
        "colombia",
        "comoros",
        "congo-Brazzaville",
        "congo-Kinshasa",
        "cook Islands",
        "costa rica",
        "$_[",
        "croatia",
        "curaçao",
        "cyprus",
        "czech Republic",
        "denmark",
        "djibouti",
        "dominica",
        "dominican Republic",
        "east Timor",
        "ecuador",
        "el Salvador",
        "egypt",
        "equatorial Guinea",
        "eritrea",
        "estonia",
        "ethiopia",
        "falkland Islands",
        "faroe Islands",
        "federated states of Micronesia",
        "fiji",
        "finland",
        "france",
        "french guiana",
        "french polynesia",
        "french southern lands",
        "gabon",
        "gambia",
        "georgia",
        "germany",
        "ghana",
        "gibraltar",
        "greece",
        "greenland",
        "grenada",
        "guadeloupe",
        "guam",
        "guatemala",
        "guernsey",
        "guinea",
        "guinea-Bissau",
        "guyana",
        "haiti",
        "heard and McDonald Islands",
        "honduras",
        "hong Kong",
        "hungary",
        "iceland",
        "india",
        "indonesia",
        "iraq",
        "ireland",
        "isle of Man",
        "israel",
        "italy",
        "jamaica",
        "japan",
        "jersey",
        "jordan",
        "kazakhstan",
        "kenya",
        "kiribati",
        "kuwait",
        "kyrgyzstan",
        "laos",
        "latvia",
        "lebanon",
        "lesotho",
        "liberia",
        "libya",
        "liechtenstein",
        "lithuania",
        "luxembourg",
        "macau",
        "macedonia",
        "madagascar",
        "malawi",
        "malaysia",
        "maldives",
        "mali",
        "malta",
        "marshall Islands",
        "martinique",
        "mauritania",
        "mauritius",
        "mayotte",
        "mexico",
        "moldova",
        "monaco",
        "mongolia",
        "montenegro",
        "montserrat",
        "morocco",
        "mozambique",
        "namibia",
        "nauru",
        "nepal",
        "netherlands",
        "new caledonia",
        "new zealand",
        "nicaragua",
        "niger",
        "nigeria",
        "niue",
        "norfolk Island",
        "northern mariana Islands",
        "norway",
        "oman",
        "pakistan",
        "palau",
        "panama",
        "papua New Guinea",
        "paraguay",
        "peru",
        "philippines",
        "pitcairn Islands",
        "poland",
        "portugal",
        "puerto rico",
        "qatar",
        "réunion",
        "romania",
        "russia",
        "rwanda",
        "saint barthélemy",
        "saint helena",
        "saint kitts and nevis",
        "saint lucia",
        "saint martin",
        "saint pierre and miquelon",
        "saint vincent",
        "samoa",
        "san marino",
        "são tomé and príncipe",
        "saudi arabia",
        "senegal",
        "serbia",
        "seychelles",
        "sierra leone",
        "singapore",
        "sint maarten",
        "slovakia",
        "slovenia",
        "solomon islands",
        "somalia",
        "south africa",
        "south georgia",
        "south korea",
        "spain",
        "sri lanka",
        "sudan",
        "suriname",
        "svalbard and jan mayen",
        "sweden",
        "swaziland",
        "switzerland",
        "syria",
        "taiwan",
        "tajikistan",
        "tanzania",
        "thailand",
        "togo",
        "tokelau",
        "tonga",
        "trinidad",
        "tunisia",
        "turkey",
        "turkmenistan",
        "turks and caicos islands",
        "tuvalu",
        "uganda",
        "ukraine",
        "uae",
        "uk",
        "usa",
        "uruguay",
        "uzbekistan",
        "vanuatu",
        "vatican city",
        "vietnam",
        "venezuela",
        "wallis and futuna",
        "western sahara",
        "yemen",
        "zambia",
        "zimbabwe"];
        //The array will store and check if the country has already been guessed
        if (existingArr.includes(ele.value.trim().toLowerCase())) {
            misMatch.innerHTML = "You've already guessed the country";
            misMatch.style.display = "block";
            ele.value = "";
        } else {
            //it will check whether the country name is valid or not
            if (countries.includes(ele.value.trim().toLowerCase())) {
                existingArr.push(ele.value.trim().toLowerCase());
                var prog = Number(document.querySelector("#progress").textContent);
                document.querySelector("#progress").innerHTML = prog + 1;
                misMatch.style.display = "none";
                ele.value = "";
            }
            //if the country name doesn't exist or in case of speeling mistake
            else {
                misMatch.innerHTML =
                    "Country Doesn't Exist, Please Check Your Spellings!";
                misMatch.style.display = "block";
                ele.value = "";
            }
        }
    }
    //displaying all the guessed countries
    document.querySelector(".listNations").innerHTML =
        "Guessed Countries: <br/><br/>" + existingArr.map(country => `<span class="guessed-country">${country}</span>`).join(" , ");
}
