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

startBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", startNewGame);

function startGame() {
    startBtn.style.display = "none";
    gameContainer.classList.remove("hidden");
    startTimer();
    
}

function startTimer() {
    var time = 30; // Set the time limit in seconds

    var intervalId = setInterval(function() {
        timer.textContent = "Time Left: " + time + "s";
        time--;

        if (time < 0) {
            clearInterval(intervalId);
            finishGame();
        }
    }, 1000);


}

function finishGame() {
    gameContainer.classList.add("hidden");
    modalText.innerHTML = "<p id='timeUp'>Time's up!</p><p>You have guessed " + existingArr.length + " countries.</p>";
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
    startBtn.style.display = "block";
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
