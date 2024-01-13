import TasDeFeuille from "../js/tasDeFeuille.js";
import Warrior from "../js/warrior.js";
import Wizard from "../js/wizard.js";
import Blob from "../js/blob.js";

var capacite1  = document.getElementById('spell1');
var capacite2  = document.getElementById('spell2');
var pass =  document.getElementById('next');
var tour = 1;


const heroClasse = window.localStorage.getItem('Character');

// Instantiate player
if (heroClasse == "warrior"){
    var joueur = new Warrior;
    var ennemi = new TasDeFeuille;
    var element = document.getElementById("character-bloc");
    element.classList.add("warriorIdle");
} else if (heroClasse == "wizard"){
    var joueur = new Wizard;
    var ennemi = new TasDeFeuille;
    var element = document.getElementById("character-bloc");
    element.classList.add("wizardIdle");
} else {
    window.localStorage.setItem('Name', 'Blobby');
    var joueur = new Blob;
    var ennemi = new TasDeFeuille;
    var element = document.getElementById("character-bloc");
    element.classList.add("blobIdle");
}

var heroName = window.localStorage.getItem('Name');
if (!heroName) {
    heroName = "Bob";
}
const hpEnnemiMax = ennemi.hp;
const hpJoueurMax = joueur.hp;
const energieJoueurMax = joueur.energie;

document.getElementById("counter-bloc").innerHTML = 'Round </br>' + tour;
document.getElementById("log-bloc").innerHTML = heroName + " gains experience and continues on his way, he comes across a pile of leaves!";
document.getElementById("character-xp").style.width = '30%';
joueur.xp += 3;

console.log(joueur.xp);

// Use capacity number 1
capacite1.addEventListener('click', function () {
    document.getElementById("log-bloc").innerHTML = heroName + joueur.capacite1();
    // recalculation energy
    let energieJoueurRestant = joueur.energie * 100 / energieJoueurMax;
    // recalculation monster's hp
    document.getElementById("character-energy").style.width = energieJoueurRestant+'%';
});

// Use capacity number 2
capacite2.addEventListener('click', function () {
    document.getElementById("log-bloc").innerHTML = heroName + joueur.capacite2(ennemi);
    // recalculation player's hp and energy
    let hpEnnemiRestant = ennemi.hp * 100 / hpEnnemiMax;
    let energieJoueurRestant = joueur.energie * 100 / energieJoueurMax;
    document.getElementById("monster-hp").style.width = hpEnnemiRestant+'%';
    document.getElementById("character-energy").style.width = energieJoueurRestant+'%';
    if (ennemi.hp <= 0){
        document.getElementById("monster-hp").style.width = '0%';
        // Redirect in next stage 
        document.location.href='game-lvl3.html';
    }
});

pass.addEventListener('click', function () {
    // If warrior use protection
    if (window.localStorage.getItem('Protection') == 'true'){
        document.getElementById("log-bloc").innerHTML = heroName + ' protects itself, so it doesn\'t take any damage.'
        window.localStorage.setItem('Protection', 'false');
    } else {
        document.getElementById("log-bloc").innerHTML = 'The monster inflicts ' + ennemi.attack(joueur) + " damage.";
        // Recalculate player's hp
        let hpJoueurRestant = joueur.hp * 100 / hpJoueurMax;
        document.getElementById("character-hp").style.width = hpJoueurRestant+'%';
        if (joueur.hp <= 0){
            document.getElementById("character-hp").style.width = '0%';
            // Redirect in game over page
            document.location.href='game-over.html';
        }
    }
    joueur.energie = energieJoueurMax;
    document.getElementById("character-energy").style.width = '100%';
    // Round counter
    tour += 1;
    document.getElementById("counter-bloc").innerHTML = 'Round </br>' + tour;
});
