

window.onload = function() {
    var pack = document.getElementById("pokemon-cards-pack");
    pack.addEventListener("click", openPack);
}

function randomNumber(min, max) { 
    return Math.ceil(Math.random() * (max - min) + min);
} 

function openPack() {
    // alert("pack is opened");
    let cardsOpened = document.getElementById("pokemon-pack-opened");
    while (cardsOpened.firstChild) {
        cardsOpened.firstChild.remove()
    }

    for (let i = 0; i < 11; i++) {
        
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("assest/cards-set");

        let cardImg = document.createElement("img");
        cardImg.id = i;

        let num = 1;
        if (i == 10) {
            num = randomNumber(1, 16); 
        } else {
            num = randomNumber(17, 101); 
        }

        cardImg.src = "./assets/cards-set/card (" + num.toString() + ").png";

        cardDiv.appendChild(cardImg);

        document.getElementById("pokemon-pack-opened").appendChild(cardDiv);
    }
}
