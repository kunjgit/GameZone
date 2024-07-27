/* As soon as you initialize the page, choose a random image */
window.onload = choosePic;
let index;
let points = 0;
let hintTaken = false;

/* Array that receives all Pokemons in the game. You can greatly improve this array */
const allPokemons = new Array(abra, alakazam, arcanine, arbok, articuno, beedrill, bulbasaur, charmander, 
    charmeleon, charizard, chimecho, crobat, dragonair, eevee, ekans, espeon, flareon, glaceon, golbat, 
    gyarados, haunter, horsea, igglybuff, jigglypuff, jolteon, kadabra, magikarp, magneton, 
    meowth, pichu, pidgey, pikachu, psyduck);

function randomNumber() {
    return Math.floor(Math.random() * allPokemons.length) + 1;
}

/* Choose a random Pokemon */
function choosePic() {
    index = randomNumber();
    document.getElementById("canvas").src = allPokemons[index].source;
    hintTaken = false;
}

function clearInput() {
    document.getElementById("guessInput").value = "";
}

function showAlert(num) {
    if (num == 1) {
        if (!hintTaken) {
            points += 100;
        } else {
            points += 50;
        }
        document.getElementById("modal-message").innerText="Congratulations, You did it! It's " + allPokemons[index].name + "!"+"You earned " + (hintTaken ? 50 : 100) + " points!" +"\n Total Points are :" + points;
        document.getElementById("modal").style.display = "block";
    } else {
        document.getElementById("modal-message").innerText = "Oops, Thats' not correct. It was " + allPokemons[index].name + "!";
        document.getElementById("modal").style.display = "block";
        points += 0;
    }
    // Add event listener to the cancel button
    var closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    });
}

function tryGuess() {
    if (document.getElementById("guessInput").value.trim().toLowerCase() === allPokemons[index].name) {

        showAlert(1);
        document.getElementById("canvas").style.filter = "brightness(100%)";
        allPokemons.splice(index, 1);

        if (allPokemons.length >= 1){
            setTimeout(function () {

                document.getElementById("canvas").style.filter = "brightness(0%)";
                choosePic();
                clearInput();
    
            }, 500);
        } else {
            alert("You managed to guess all the Pokemons! You are awesome! Thanks for playing, I hope you had fun ^~^ ")
            document.getElementById("title").innerHTML = "You win! Yay!";
        }
        
    } else {
        showAlert(0);
        choosePic();
        clearInput();
    }
}

function giveHint() {
    hintTaken = true;
    document.getElementById("modal-message").innerText="Hint: " + allPokemons[index].hint;
    document.getElementById("modal").style.display = "block";

    // Add event listener to the cancel button
    var closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    });
}