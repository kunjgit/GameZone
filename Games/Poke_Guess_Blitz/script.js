
var apiUrl = "https://pokeapi.co/api/v2/pokemon/?"; //API base URL
var offset = 0;
var limit = 665; //limiting Pokemons - sprites are not numbered properly after 665
var pokemonUrl = apiUrl + "limit=" + limit + "&offset=" + offset; //complete URL with limit
var spriteUrl =
 "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"; //base URL from which sprites are fetched
const guess = document.getElementById("guess"); 
const streakElement = document.getElementById("streak"); 
const pokemonNameElement = document.getElementById("pokemon-name"); 
const spriteElement = document.getElementById("sprite"); 

//Variables
var streak = 0; 
var pokemonName = ""; 
var pokemonData; 
var correct = new Audio("./Assets/sounds/correct.mp3");
var wrong = new Audio("./Assets/sounds/wrong.mp3");


guess.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkGuess();
  }
});

//function that fetched Pokemon data from the API
const fetchPokemonData = async function getDataFromServer(url) {
  return fetch(url).then((response) => response.json());
};

//main function
var main = async function mainFunction() {
  let response = await fetchPokemonData(pokemonUrl);
  pokemonData = response.results; //save API response to pokemonData variable
  // console.log(pokemonData);
  getPokemon();
};

//function that compares player's guess with Pokemon name and based on that either increases or resets streak
function checkGuess() {
  if (pokemonName.toLowerCase() === guess.value.toLowerCase()) {
    correct.play();
    streak++; //correct guess - increase streak by one
  }else{
    wrong.play();
  }
  showPokemon(); 
}

function getPokemon() {
  pokemonNameElement.innerHTML = "";
  guess.value = "";
  let pokemonNumber = getRandomIntInclusive(offset, limit + offset); 
  pokemonName = pokemonData[pokemonNumber].name; //get pokemon name who's number is randomly generated number
  spriteElement.style.setProperty("transition", "initial"); //reset CSS transition property
  spriteElement.src = ""; 
  spriteElement.style.setProperty("filter", "brightness(0)");
  const sprite = spriteUrl + (pokemonNumber + 1).toString() + ".png"; 
  spriteElement.src = sprite; 
}


function showPokemon() {
  streakElement.innerHTML = "Score: " + streak; 
  spriteElement.style.setProperty("transition", "filter 1s ease-out"); 
  spriteElement.style.setProperty("filter", "initial");
  pokemonNameElement.innerHTML = pokemonName; // show Pokemon's name
  setTimeout(() => getPokemon(), 2000); 
}


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

//Start
main();
