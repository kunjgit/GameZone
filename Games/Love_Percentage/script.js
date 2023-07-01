var boyName = document.getElementById("bn");
var girlName = document.getElementById("gn");
const controls = document.querySelector(".controlsContainer");
const startButton = document.getElementById("startBtn");
const result = document.getElementById("result");
const submitButton = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMsg");
//  generates a radom number between 1 to 100 both inclusive
function generateRandom(maxLimit = 100) {
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);
    return rand;
}
let num = generateRandom();
// start 
startButton.addEventListener("click", () => {
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hide");
    controls.classList.add("hide");
    startButton.classList.add("hide");

});

submitButton.addEventListener("click", () => {
    if (boyName.value === "" || girlName.value === "") {
        errorMessage.classList.remove("hide");
        errorMessage.innerHTML = "Name can't be empty.";
    }
    else {
        stopGame(`The love percentage between you and your partner is ${num}%`);

    }

});
const stopGame = (resultText) => {
    result.innerHTML = resultText;
    startButton.innerText = "Again Check";
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
};

