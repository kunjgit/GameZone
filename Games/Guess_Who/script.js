
/* ======================
CACHED DOM NOTES
=========================*/

const body = document.querySelector("body")
const getStartedBtn = document.querySelector("#get-started")
const startGameBtn = document.querySelector("#start-game")
const board = document.querySelector("#chris-board")
const gameConsole = document.querySelector("#game-controls")
const guessCounter = document.querySelector("#guess-count > span")
const questionCounter = document.querySelector("#question-count > span")
const menu = document.querySelector(".menu")
const tutorial = document.querySelector("#modal-textbox")
const characters = document.querySelectorAll(".square")
const askButtons = document.querySelectorAll(".ask button")
const answers = document.querySelector("#answers > span")
const makeGuessBtn = document.getElementById("make-guess")
const cancelBtn = document.getElementById("cancel-guess")
const resultTitle = document.getElementById("result-title")
const scoreNumber = document.getElementById("score-number")
const scoreText = document.getElementById("score-text")
const stars = document.getElementById("stars")
const playAgain = document.getElementById("play-again")
const closeTryModal = document.getElementById("close-modal")
const tryModal = document.getElementById("try-textbox")
const updatesModal = document.getElementById("updates-textbox")
const modalBackground = document.querySelector(".modal-background")

console.log(makeGuessBtn)

/* ======================
CLASSES
=========================*/
class Character{
    constructor(lastName, sex, human = true, color, brand, hairColor){
        this.lastName = lastName
        this.sex = sex
        this.human = human
        this.color = color
        this.brand = brand
        this.hairColor = hairColor
    }
    
}

// Define a class named Player
class Player {
    // Constructor method with default values for guess count and question count
    constructor(guessCount = 3, questionCount = 0) {
        // Initialize instance variables
        this.guessCount = guessCount; // Number of guesses allowed
        this.questionCount = questionCount; // Number of questions answered
        // Array of game character names
        this.currentChars = [
            "mario", "luigi", "bowser", "cloud", "donkeykong", "doom",
            "ganon", "inkling", "jinx", "joker", "kratos", "lara",
            "leon", "link", "masterchief", "nathan", "pacman", "pikachu",
            "ryu", "samus", "snake", "steve", "tracer", "zelda",
        ];
    }

    // Method to update guess count and update corresponding HTML element
    updateGuessCount() {
        this.guessCount--; // Decrement guess count
        guessCounter.textContent = this.guessCount; // Update guess counter in HTML
    }

    // Method to update question count and update corresponding HTML element
    updateQuestionCount() {
        this.questionCount++; // Increment question count
        questionCounter.textContent = this.questionCount; // Update question counter in HTML
    }

    // Method to handle win scenario
    win() {
        // Update result and score display in HTML
        resultTitle.textContent = "Congrats! You won!";
        scoreText.textContent = "You sure know your game characters!";
        this.checkScore(); // Check and update score
        this.checkStars(); // Check and update star rating
        // Display modal
        modalBackground.style.display = "block";
        updatesModal.style.display = "block";
    }

    // Method to handle lose scenario
    lose() {
        // Update result and score display in HTML
        resultTitle.textContent = "You Lost";
        scoreText.textContent = "Better luck next time.";
        this.checkScore(); // Check and update score
        stars.textContent = "☆☆☆"; // Reset star rating
        // Display modal
        modalBackground.style.display = "block";
        updatesModal.style.display = "block";
    }

    // Method to calculate and display score based on question count
    checkScore() {
        scoreNumber.textContent = this.questionCount * 1000; // Calculate score and update HTML
    }

    // Method to calculate and display star rating based on question count
    checkStars() {
        if (this.questionCount < 6) {
            stars.textContent = "★★★"; // 3 stars for fewer questions
        } else if (this.questionCount >= 6 && this.questionCount <= 11) {
            stars.textContent = "★★☆"; // 2 stars for moderate questions
        } else if (this.questionCount >= 12 && this.questionCount <= 16) {
            stars.textContent = "★☆☆"; // 1 star for more questions
        } else {
            stars.textContent = "☆☆☆"; // No stars for too many questions
        }
    }
}

/* ======================
GLOBAL VARS
=========================*/
let computedChars = ""

let player = new Player()
const chrisList = [
    new Character("mario", "male", true, ["red"], "Nintendo", "brunette"),
    new Character("luigi", "male", true, ["green"], "Nintendo", "brunette"),
    new Character("bowser", "male", false, ["yellow"], "Nintendo", "red"),
    new Character("cloud", "male", true, ["gray"], "Square Enix", "blond"),
    new Character("donkeykong", "male", false, ["brown"], "Nintendo", "brunette"),
    new Character("doom", "male", true, ["brown", "green"], "Bethesda", "black"),
    new Character("ganon", "male", true, ["brown", "red"], "Nintendo", "red"),
    new Character("inkling", "female", false, ["orange", "white"], "Nintendo", "orange"),
    new Character("jinx", "female", true, ["purple, blue"], "Riot Games", "blue"),
    new Character("joker", "male", true, ["black"], "Sega", "black"),
    new Character("kratos", "male", false, ["red", "white"], "Sony", "bald"),
    new Character("lara", "female", true, ["white", "brown"], "Square Enix", "brunette"),
    new Character("leon", "male", true,["blue"], "Capcom", "brunette"),
    new Character("link", "male", true, ["green", "blue"], "Nintendo", "brunette"),
    new Character("masterchief", "male", true, ["green"], "Microsoft", "black"),
    new Character("nathan", "male", true, ["gray, brown"], "Sony", "brunette"),
    new Character("pacman", "male", false, ["yellow"], "Bandai Namco", "bald"),
    new Character("pikachu", "male", false, ["yellow"], "Nintendo", "bald"),
    new Character("ryu", "male", true, ["white", "red"], "Capcom", "black"),
    new Character("samus", "female", true, ["orange", "red"], "Nintendo", "blond"),
    new Character("steve", "male", true, ["blue", "white"], "Microsoft", "brunette"),
    new Character("snake", "male", true, ["gray"], "Konami", "brunette"),
    new Character("tracer", "female", true, ["orange"], "Blizzard", "black"),
    new Character("zelda", "female", true, ["white", "purple"], "Nintendo", "brunette")
]

console.log(chrisList)
console.log(player)
/* =============================
FUNCTIONS
============================= */
const startTutorial = () => {
    menu.style.display = "none"
    tutorial.style.display = "block"
}

const startGame = () => {
    computedChars = randomizeChars()
    console.log(computedChars)
    setupGame()
}

const setupGame = () =>{
    tutorial.style.display = "none"
    board.style.display = "block"
    gameConsole.style.display = "block"

}

const randomizeChars = () =>{
    console.log(Math.floor(Math.random() * 24))
    return  chrisList[Math.floor(Math.random() * 24)];
}

const makeGuess = () => {
    // Display cancel button
    cancelBtn.style.display = "block";

    // Iterate over each character element
    characters.forEach((character) => {
        // Get the character name element
        let characterName = character.querySelector(".name");

        // Check if the character ID is included in the player's current characters
        if (player.currentChars.includes(character.id)) {
            // Add an event listener to the character element
            character.addEventListener('click', function () {
                // Update guess count for the player
                player.updateGuessCount();

                // Check if the clicked character matches the last name of the computed characters
                if (computedChars.lastName !== character.id && player.guessCount === 0) {
                    console.log("you lose");
                    // Player loses the game
                    player.lose();
                } else if (computedChars.lastName === character.id) {
                    console.log("You win");
                    // Player wins the game
                    player.win();
                } else if (computedChars.lastName !== character.id && player.guessCount !== 0) {
                    // Display try again modal if the character is not correct and guesses are left
                    tryModal.style.display = "block";
                    modalBackground.style.display = "block";
                }
            });
        } else {
            // Style characters that are not included in player's current characters
            character.style.backgroundColor = "#c7c7c7";
            character.classList.add("no-click");
        }
    });
};


const cancelGuess = () => {
    
    cancelBtn.style.display = "none"
    characters.forEach((character) =>{  
   
        if(player.currentChars.includes(character.id)){
        }
        else{
            character.classList.remove("no-click")
            character.style.backgroundColor = "#d3232c"
            character.style.color = "aliceblue"
        }

    })
}

const closeModal = () => {
    tryModal.style.display = "none"
    modalBackground.style.display = "none"
}

const restartGame = () => {
    window.location.reload();
}

/* =============================
EVENT LISTENERS
============================= */

closeTryModal.addEventListener("click", closeModal)
getStartedBtn.addEventListener("click", startTutorial)

startGameBtn.addEventListener("click", startGame)

makeGuessBtn.addEventListener("click", makeGuess)

cancelBtn.addEventListener("click", cancelGuess)

playAgain.addEventListener("click", restartGame)


characters.forEach((character) =>{
    let charactername = character.querySelector(".name")
    if(player.currentChars.includes(character.id)){
        character.addEventListener('mouseenter', function (){
            charactername.style.backgroundColor = "#094f8f"
            charactername.style.color = "aliceblue"
        })  
        character.addEventListener('mouseleave', function (){
            charactername.style.backgroundColor = "aliceblue"
            charactername.style.color = "#094f8f"
        })

    }
    character.addEventListener('dblclick', function(){

        let selectedChar = document.getElementById(character.id)
        let index = player.currentChars.indexOf(character.id)
      
        let characterName = selectedChar.querySelector(".name")
        let characterImage = selectedChar.querySelector(".image")

        
        if (characterImage.style.display === "none"){
            characterImage.style.display = "initial"
            characterName.style.backgroundColor = "aliceblue"
            characterName.style.color = "#094f8f"
            player.currentChars.push(character.id)
            

        } 
        else {
            characterImage.style.display = "none"
            player.currentChars.splice(index,1)
            
        }

    })
})


//Question logic below
askButtons.forEach((question) =>{
    question.addEventListener('click', function(){
  
        let selectedQuestion = question.id
        let color = computedChars.color
        let selectedButton = document.getElementById(selectedQuestion)

        selectedButton.disabled = true
        selectedButton.style.backgroundColor = "#c7c7c7"
        selectedButton.style.color = "#c7c7c7"
        player.updateQuestionCount()

        
        switch(selectedQuestion){
            case "female":
                if(computedChars.sex === "female"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                
                break
            case "male":
                if(computedChars.sex === "male"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "human":
                if(computedChars.human){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "red":
                if(color.includes("red")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "green":
                if(color.includes("green")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "yellow":
                if(color.includes("yellow")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "gray":
                if(color.includes("gray")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "brown":
                if(color.includes("brown")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "orange":
                if(color.includes("orange")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "purple":
                if(color.includes("purple")){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "blue":
                if(color.includes("blue")){
                    answers.textContent = "Yes"
                }
                else {
                    answers.textContent = "No!"
                }
            case "black":
                if(color.includes("black")){
                    answers.textContent = "Yes"
                }
                else {
                    answers.textContent = "No!"
                }
            case "white":
                if(color.includes("white")){
                    answers.textContent = "Yes"
                }
                else {
                    answers.textContent = "No!"
                }
            case "Nintendo":
                if(computedChars.brand === "Nintendo"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Square Enix":
                if(computedChars.brand === "Square Enix"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Bethesda":
                if(computedChars.brand === "Bethesda"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Riot Games":
                if(computedChars.brand === "Riot Games"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Sega":
                if(computedChars.brand === "Sega"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Sony":
                if(computedChars.brand === "Sony"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Capcom":
                if(computedChars.brand === "Capcom"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Micrsoft":
                if(computedChars.brand === "Microsoft"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Bandai Namco":
                if(computedChars.brand === "Bandai Namco"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Konami":
                if(computedChars.brand === "Konami"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "Blizzard":
                if(computedChars.brand === "Blizzard"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "blond":
                console.log("blond")
                
                if(computedChars.hairColor === "blond"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "brunette":
                console.log("brunette")
                if(computedChars.hairColor === "brunette"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "red":
                console.log("red")
                if(computedChars.hairColor === "red"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "black":
                if(computedChars.hairColor === "black"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "orange":
                if(computedChars.hairColor === "orange"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
            case "bald":
                if(computedChars.hairColor === "bald"){
                    answers.textContent = "Yes"
                }
                else{
                    answers.textContent = "No!"
                }
                break
        }

    })
})