/**
 * Created by robomatix on 06/09/14.
 */


/*
 * Some variable initiation
 ***********************************
 */
var a = ["earth", "water", "air", "fire"]; // The initial array of elements

state = "menu";

score = 0;

/*
 * Menu state
 **************************************
 */
mG();

/*
 * States logic
 **************************************
 */


document.getElementsByTagName('html')[0].onclick = function () {

    if (state === "menu") {
        gameS1();
    } else if (state === "gameS1") {
        gameS2();
    } else if (state === "waitReplay") {
        gameS1();
    }
}

/*
 *******************************************
 * FUNCTIONS
 ******************************************
 */

/*
 * Menu Generator !!!!
 * Menu Generator !!!!
 * Yeah ! Yeah !! Yeah !!!
 * @returns Nothing but generate a menu !!!
 */
function mG() {


    state = "menu";

    document.body.innerHTML = "";

    // Create a div
    var iH1 = document.createElement('h1');
    iH1.id = "h1";
    iH1.innerHTML = "Click the four elements";

    var iP = document.createElement('p');
    iP.id = "pitch";
    iP.innerHTML = "In this game, hand made by robomatix rebirth, you have to remember in which order to click or tap the elements... Click or tap anywhere on the screen to start playing... Memorize the order of the elements and then click or tap anywhere on the screen and then click or tap the elements in the order you remember it... Thirty three seconds is the maximum duration of this game...";

    // Appending the previous elements
    document.getElementsByTagName('body')[0].appendChild(iH1);
    var h1 = document.getElementById("h1");
    insertAfter(iP, h1);
}

/*
 * Add a node after an another one
 * @param newNode : the node to add
 * @param referenceNode : the node after which the new node will be added
 * @returns Nothing
 */
function insertAfter(newNode, referenceNode) {
    /* http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library */
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/*
 * Convert an object to an array
 * @param o : object
 * @param nA : empty array ( new Array )
 * @returns Nothing
 */
function o2a(o, nA) {

    /* https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/getOwnPropertyNames */
    Object.getOwnPropertyNames(o).forEach(function (val, idx, array) {

        //console.log(idx + " ->" + val + " -> " + o[val]);
        nA[idx] = o[val];

    });
}

/*
 * function that randomize an array
 * @param array : array
 * @returns : array
 */
/*http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array*/
function shuffle(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

}

/*
 * Handle the creation of the div that represents the elements (e = name of the element )
 * @param e : name of the element
 * @param w : class for the width of the div generated
 * @returns : nothing
 */
function addEl(e, w) {

    /* http://stackoverflow.com/questions/14004117/javascript-create-div-and-append-div-dynamically */
    // Create a div
    var iDiv = document.createElement('div');
    iDiv.id = e;
    iDiv.className = 'el ' + w;

    // Create a paragraph so we can verticaly center it /* http://phrogz.net/css/vertical-align/ */
    var iP = document.createElement('p');
    iP.innerHTML = e;

    // Appending the previous elements
    document.getElementsByTagName('body')[0].appendChild(iDiv).appendChild(iP);

}

/*
 * Handle the logic needed when an element  is clicked (e = name of the element, the id of the div )
 * @param e : name of the element
 * @returns : nothing
 */
function elClkd(e) {

    document.getElementById(e).onclick = function () {
        //console.log(sA1);
        //console.log('sa1 : ' + sA1[cC]);
        //console.log(e + " " + cC + " score : " + score);

        if (e === sA1[cC]) {// Comparing the element clicked and the one that should have been clicked
            //console.log('Ok');
            var audio = new Audio('click.wav');
            audio.play();
        } else {
            //console.log('Ko');
            gameOver();
        }
        cC++;

        if (cC === 4) {
            score++;
            mG();
        }
    }

}

/*
 *******************************************
 * STATES
 ******************************************
 */

function gameS1() {

    state = "gameS1";

    document.body.innerHTML = "";

    if (score === 0) {
        countDown = setTimeout(function () {
            endGame()
        }, 33000);
    }

    /*
     * Generating the array that will be used for the order in which the elements should be clicked
     * *********************************************************************************************
     */

    shuffle(a); // Randomize the array of elements

    var dB = new Object(); // dB stand for display board. It will be the reference, the order in which the elements should be clicked...
    dB.el1 = a[0];
    dB.el2 = a[1];
    dB.el3 = a[2];
    dB.el4 = a[3];

    sA1 = new Array();
    o2a(dB, sA1);

    //console.log(sA1);


    /*
     * Generating the div in the document displayed in the browser
     ***************************************************************
     */
    i = 0;
    for (tot = sA1.length; i < tot; i++)
        addEl(sA1[i], "w100");

}

function gameS2() {

    state = "gameS2";

    document.body.innerHTML = "";

    /*
     * Generating the array that should be clicked and the order they will be displayed
     * *********************************************************************************
     */


    shuffle(a); // Randomize the array of elements

    var dG = new Object(); // dG stand for display game. It will be the order in which the elements will be displayed...
    dG.el1 = a[0];
    dG.el2 = a[1];
    dG.el3 = a[2];
    dG.el4 = a[3];


    sA2 = new Array();
    o2a(dG, sA2);

    //console.log(sA2);

    /*
     * Generating the div in the document displayed in the browser
     ***************************************************************
     */
    i = 0;
    for (tot = sA2.length; i < tot; i++)
        addEl(sA2[i], "w50");

    /*
     * The logic of the game ! LOL !
     ***********************************************************************************************************
     */

    cC = 0; // cC stand for click counter, sort of index of the "clicks", useful to know if the clicked element is the one that should have been clicked. In the array of elements c should be index of the element in the array

    /* To detected witch element is clicked, not the more concise way, but it always work */
    elClkd("earth");
    elClkd("water");
    elClkd("air");
    elClkd("fire");

}

function gameOver() {

    state = "gameOver";

    clearTimeout(countDown);

    document.body.innerHTML = "";

    var audio = new Audio('gameover.wav');
    audio.play();

    // Create a div
    var iH1 = document.createElement('h1');
    iH1.id = "h1";
    iH1.innerHTML = "GAME OVER !!!";

    var iP = document.createElement('p');
    iP.id = "score";
    iP.innerHTML = "Your score : " + score;

    var iPr = document.createElement('p');
    iPr.id = "replay";
    iPr.innerHTML = "Please wait few seconds before clicking or taping to replay";

    // Adding the previous elements
    document.getElementsByTagName('body')[0].appendChild(iH1);
    var h1 = document.getElementById("h1");
    insertAfter(iP, h1);
    insertAfter(iPr, iP);

    setTimeout(function () {
        iPr.innerHTML = "Click or tap the screen to replay";
        state = "waitReplay"
    }, 3000);

    // Score reinitialisation
    score = 0;

}

function endGame() {

    state = "endGame";

    document.body.innerHTML = "";

    // Create a div
    var iH1 = document.createElement('h1');
    iH1.id = "h1";
    iH1.innerHTML = "The thirty three seconds are over !!!";

    var iP = document.createElement('p');
    iP.id = "score";
    iP.innerHTML = "Your score : " + score;

    var iPr = document.createElement('p');
    iPr.id = "replay";
    iPr.innerHTML = "Please wait few seconds before clicking or taping to replay";

    // Adding the previous elements
    document.getElementsByTagName('body')[0].appendChild(iH1);
    var h1 = document.getElementById("h1");
    insertAfter(iP, h1);
    insertAfter(iPr, iP);

    setTimeout(function () {
        iPr.innerHTML = "Click or tap the screen to replay";
        state = "waitReplay"
    }, 3000);

    // Score reinitialisation
    score = 0;

}

/* Memo */
/* gameOver and endGame could be the same function */
/* http://stackoverflow.com/questions/17157342/pure-js-detect-if-im-clicking-an-element-within-an-element , doesn't always get the id of the div ... */
