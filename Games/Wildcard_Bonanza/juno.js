window.onload = function() {

// Scale game container and text relative to window size
// Adapted from http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
function scaleGame() {
  var container = document.getElementById("container");
  container.setScale = function() {
    var widthToHeight = 10 / 5.266;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    if(newWidthToHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight;
      this.style.height = newHeight + "px";
      this.style.width = newWidth + "px";
    }
    else {
      newHeight = newWidth / widthToHeight;
      this.style.width = newWidth + "px";
      this.style.height = newHeight + "px";
    }
    this.style.marginTop = (-newHeight / 2) + "px";
    this.style.marginLeft = (-newWidth / 2) + "px";
    document.body.style.fontSize = (newWidth * 0.14) + '%';
  };
  container.setScale();
  window.onresize = function() {
    container.setScale();
  };
}

/* Initialize game */

function startGame() {
  function makeCards() {
    var deckRound = 1;
    var deck = [];
    function makeDeck(type, color, id) {
      deck[deck.length] = {
        type: type,
        color: color,
        id: id
      };
    }
    var number = 1;
    var color = "";
    for(var i = 0; i < 4; i++) {
      if(i === 0) {
        color = "Blue";
      }
      else if(i === 1) {
        color = "Green";
      }
      else if(i === 2) {
        color = "Red";
      }
      else {
        color = "Yellow";
      }
      for(var x = 0; x < 10; x++) {
        var y = 0;
        if(x < 1) {
          // Make one number 0 card for each color
          makeDeck(x, color, String([x]) + color + number);
          number += 1;
        }
        else {
          // Make two cards for numbers 1-9 in each color
          while(y < 2) {
            makeDeck(x, color, String([x]) + color + number);
            number += 1;
            y += 1;
          }
          while(x === 9 && y < 3) {
            // Make two draw two and two skip cards in each color
            makeDeck("Draw Two", color, "drawTwo" + color + number);
            makeDeck("Draw Two", color, "drawTwo" + color + (number += 1));
            makeDeck("Skip", color, "skip" + color + (number += 1));
            makeDeck("Skip", color, "skip" + color + (number += 1));
            number += 1;
            y += 1;
          }
          while(i === 3 && x === 9 && y < 7) {
            // Make four wild cards
            makeDeck("Wild", "Wild", "wild" + number);
            number += 1;
            y += 1;
          }
          while(i === 3 && x === 9 && y < 11) {
            // Make four wild draw four cards
            makeDeck("Wild Draw Four", "Wild", "wildDrawFour" + number);
            number += 1;
            y += 1;
          }
        }
      }
    }
    shuffleDeck(deck, deckRound);
  }
  makeCards();
}

//  Fisher–Yates shuffle method
//  Adapted from http://bost.ocks.org/mike/shuffle/
function shuffleDeck(deck, deckRound) {
  // Shuffle deck
  var i = deck.length;
  while(i) {
    var x = Math.floor(Math.random() * i--);
    var y = deck[i];
    deck[i] = deck[x];
    deck[x] = y;
  }
  // Deal cards if deck is not being reshuffled
  if(deckRound === 1) {
    dealCards(deck, deckRound);
  }
}

function dealCards(deck, deckRound) {
  var computerHand = [];
  var playerHand = [];
  var discardPile = [];
  // Deal cards to computer and player
  for(var i = 0; i < 14; i += 2) {
    computerHand.push(deck[i]);
    playerHand.push(deck[i + 1]);
  }
  // If top card of deck is wild move it to bottom of deck
  while(deck[14].color === "Wild") {
    var x = deck[14];
    deck.splice(14, 1);
    deck.push(x);
  }
  // Make discard pile
  discardPile.push(deck[14]);
  // Remove dealt cards and discard pile card from deck
  deck.splice(0, 15);
  // Show cards in browser
  showCards(computerHand.length, "computerHand", computerHand);
  showCards(playerHand.length, "playerHand", playerHand);
  showCards(1, "discardPile", discardPile);
  // Show welcome message
  setTimeout(function() {
    document.getElementById("welcomeMessage").removeAttribute("class", "hide");
  }, 500); // Pause before showing welcome message
  // Start player turn
  playerTurn(playerHand, discardPile, computerHand, deck, deckRound);
}

/* Player functions */

function initPlayerTurn(discardPile, playerHand, computerHand, deck, deckRound) {
  // Add class to computer's face indicating start of player's turn
  document.getElementById("computerFace").setAttribute("class", "mute");
  // Excute block if skip card has been played on player
  if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    // Disable skip card to prevent it from taking effect more than once
    document.getElementById("discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    // Begin computer's turn
    computerTurn(discardPile, computerHand, playerHand, deck, deckRound);
  }
  else {
    // Excute block if draw two card has been played on player
    if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      // Disable draw two card to prevent it from taking effect more than once
      document.getElementById("discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
      // Add cards to player's hand
      drawCards(2, deck, deckRound, discardPile, playerHand, "playerHand");
    }
    // Excute block if draw four card has been played on player
    else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      // Disable draw four card to prevent it from taking effect more than once
      document.getElementById("discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
      // Add cards to player's hand
      drawCards(4, deck, deckRound, discardPile, playerHand, "playerHand");
    }
    // Enable player's cards and buttons
    document.getElementById("playerHand").removeAttribute("class", "disabled");
    document.getElementById("drawButton").removeAttribute("class", "disabled");
    document.getElementById("playerFace").removeAttribute("class", "mute");
  }
  // Update player's face
  updateFace("player", playerHand);
}

function playerTurn(playerHand, discardPile, computerHand, deck, deckRound) {
  // Hover card on mouseover
  hoverCard(playerHand);
  document.addEventListener("click", function(event) {
    // Hide welcome message when card or draw button is clicked
    if(!(document.getElementById("welcomeMessage").classList.contains("hide")) && (event.target.parentNode.id === "playerHand" || event.target.innerHTML === "draw")) {
      document.getElementById("welcomeMessage").setAttribute("class", "hide");
    }
    // Check which cards in player's hand are playable
    var playableCards = findPlayableCards(playerHand, discardPile);
    // Execute block if player clicks one of his/her cards during his/her turn
    if(document.getElementById("playerHand").className !== "disabled" && event.target.parentNode.id === "playerHand" && event.target.classList.contains("card")) {
      playerClickCard(event, playableCards, playerHand, discardPile, computerHand, deck, deckRound);
    }
    // Execute block if player clicks draw button when drawing is allowed
    else if(event.target.id === "drawButton" && event.target.className !== "disabled") {
      playerDrawCard(deck, deckRound, discardPile, playerHand, event);
    }
    // Execute block if player clicks pass button when passing is allowed
    else if(event.target.id === "passButton" && document.getElementById("drawButton").className === "disabled" && event.target.className !== "disabled") {
      playerPass(computerHand, playerHand, discardPile, deck, deckRound, event);
    }
    // Execute block if player clicks info button
    else if(event.target.id === "infoButton") {
      showInfo();
    }
  });
}

function playerClickCard(event, playableCards, playerHand, discardPile, computerHand, deck, deckRound) {
  var clickedCardClass = event.target.getAttribute("class");
  var clickedCardId = event.target.getAttribute("id");
  // Compare clicked card against playable cards to see it's playable
  for(var i = 0; i < playableCards.length; i++) {
    // Execute block if clicked card is playable
    if(playableCards[i].id === clickedCardId) {
      var clickedCard = playableCards[i];
      // Play card
      playerPlayCard(event, clickedCardClass, playerHand, clickedCard, discardPile, computerHand, deck, deckRound); // Function call used to avoid creating function within loop
    }
    // Execute block if clicked card isn't among playable cards
    if(i === (playableCards.length - 1) && !(event.target.classList.contains("playCard"))) {
      // Shake card
      shakeCard(event, clickedCardClass);
    }
  }
  // Execute block if card was clicked and there are no playable cards
  if(playableCards.length === 0 && !(event.target.classList.contains("playCard"))) {
    // Shake card
    shakeCard(event, clickedCardClass);
  }
}

function playerDrawCard(deck, deckRound, discardPile, playerHand, event) {
  // Add card to player's hand
  drawCards(1, deck, deckRound, discardPile, playerHand, "playerHand");
  // Update player's face
  updateFace("player", playerHand);
  // Disable draw button
  event.target.className = "disabled";
  // Enable pass button
  document.getElementById("passButton").removeAttribute("class", "disabled");
}

function playerPass(computerHand, playerHand, discardPile, deck, deckRound, event) {
  // Begin computer's turn
  computerTurn(discardPile, computerHand, playerHand, deck, deckRound);
  // Disable pass button
  event.target.className = "disabled";
  // Disable player's cards
  document.getElementById("playerHand").setAttribute("class", "disabled");
}

function playerPlayCard(event, clickedCardClass, playerHand, clickedCard, discardPile, computerHand, deck, deckRound) {
  // Disable player's cards and buttons
  document.getElementById("playerHand").setAttribute("class", "disabled");
  document.getElementById("drawButton").setAttribute("class", "disabled");
  document.getElementById("passButton").setAttribute("class", "disabled");
  // Get position of card to play
  var clickedCardRect = event.target.getBoundingClientRect();
  // Get position of discard pile
  var discardPileRect = document.getElementById("discardPile").firstChild.getBoundingClientRect();
  // Add rule to stylesheet and class to card to animate movement of card from hand to discard pile
  document.styleSheets[0].insertRule(".playCard { -webkit-transform: translate(" + (discardPileRect.left - clickedCardRect.left) + "px, " + (discardPileRect.top - clickedCardRect.top) + "px); -moz-transform: translate(" + (discardPileRect.left - clickedCardRect.left) + "px, " + (discardPileRect.top - clickedCardRect.top) + "px); -ms-transform: translate(" + (discardPileRect.left - clickedCardRect.left) + "px, " + (discardPileRect.top - clickedCardRect.top) + "px); transform: translate(" + (discardPileRect.left - clickedCardRect.left) + "px, " + (discardPileRect.top - clickedCardRect.top) + "px); }", 0);
  event.target.setAttribute("class", clickedCardClass + " playCard");
  setTimeout(function() {
    // Remove rule from stylesheet
    document.styleSheets[0].deleteRule(0);
    // Update arrays and DOM after card has been played
    playCleanup(playerHand, clickedCard, "playerHand", discardPile);
    // Update player's face
    updateFace("player", playerHand);
    // Execute block if card that was played is wild
    if(clickedCard.color === "Wild" && playerHand.length > 0) {
      // Play wild card
      playWild("player", computerHand, playerHand, discardPile, deck, deckRound);
    }
    // Execute block if card that was played isn't wild
    else if(playerHand.length > 0) {
      // Begin computer's turn
      computerTurn(discardPile, computerHand, playerHand, deck, deckRound);
    }
    // Execute block if player has no cards
    else {
      // End game with player as the winner
      gameOver("player");
    }
  }, 300); // Pause for card play animation
}

// I used mouseover/mouseout instead of :hover because I preferred their behavior in some browsers.
// Unlike :hover, they don't cause the effect unless the mouse is actively moved over an element.
function hoverCard(playerHand) {
  var oldCardStyle = "";
  var newCardStyle = "";
  // Hover card on mouseover
  document.getElementById("playerHand").addEventListener("mouseover", function(event) {
    if(event.target.classList.contains("card")) {
      // Execute block if card already has style attribute
      if(event.target.hasAttribute("style")) {
        oldCardStyle = event.target.getAttribute("style");
        // Update existing style attribute for hover
        newCardStyle = oldCardStyle.replace(/z-index: \w*;/, "z-index: " + (playerHand.length + 1) + ";");
        event.target.setAttribute("style", newCardStyle + "; bottom: 10px");
      }
      // Execute block if card doesn't have style attribute
      else {
        // Add style attribute for hover
        event.target.setAttribute("style", "z-index: 2; bottom: 10px");
      }
    }
  });
  // Remove hover on mouseout
  document.getElementById("playerHand").addEventListener("mouseout", function(event) {
    if(event.target.classList.contains("card")) {
      // Execute block if card has right style (indicating that it had style attribute before hover)
      if(event.target.style.right) {
        // Restore pre-hover style
        event.target.setAttribute("style", oldCardStyle);
      }
      // Execute block if card didn't have style attribute before hover
      else {
        // Remove style attribute
        event.target.removeAttribute("style");
      }
    }
  });
}

function shakeCard(event, clickedCardClass) {
  // Add class for shake animation
  event.target.setAttribute("class", clickedCardClass + " shake");
  setTimeout(function() {
    // Restore pre-shake class
    event.target.setAttribute("class", clickedCardClass);
  }, 500); // Pause for card shake animation
}

/* Computer functions */

function computerTurn(discardPile, computerHand, playerHand, deck, deckRound) {
  // Excute block if skip card has been played on computer
  if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    // Disable skip card to prevent it from taking effect more than once
    document.getElementById("discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    // Begin player's turn
    initPlayerTurn(discardPile, playerHand, computerHand, deck, deckRound);
  }
  else {
    // Add class to player's face indicating start of computer's turn
    document.getElementById("playerFace").setAttribute("class", "mute");
    // Remove class from computer's face indicating start of computer's turn
    document.getElementById("computerFace").removeAttribute("class", "mute");
    // Check which cards in computer's hand are playable
    var playableCards = findPlayableCards(computerHand, discardPile);
    // Excute block if draw two card has been played on computer
    if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      computerDrawCards(2, deck, deckRound, discardPile, computerHand, playableCards, playerHand);
    }
    // Excute block if draw four card has been played on computer
    else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      computerDrawCards(4, deck, deckRound, discardPile, computerHand, playableCards, playerHand);
    }
    // Execute block if computer has no playable cards
    else if(playableCards.length < 1) {
      computerDrawCard(deck, deckRound, discardPile, computerHand, playableCards, playerHand);
    }
    // Execute block if computer has playable cards
    else {
      computerPlayCard(playableCards, computerHand, discardPile, playerHand, deck, deckRound);
    }
  }
}

function computerDrawCards(cardsToDraw, deck, deckRound, discardPile, computerHand, playableCards, playerHand) {
  setTimeout(function() {
    // Add cards to computer's hand
    drawCards(cardsToDraw, deck, deckRound, discardPile, computerHand, "computerHand");
    // Disable draw two or draw four card to prevent it from taking effect more than once
    document.getElementById("discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    // Update computer's face
    updateFace("computer", computerHand);
    // Check which cards in computer's hand are playable
    playableCards = findPlayableCards(computerHand, discardPile);
    // Execute block if computer has no playable cards
    if(playableCards.length === 0) {
      computerDrawCard(deck, deckRound, discardPile, computerHand, playableCards, playerHand);
    }
    // Execute block if computer has playable cards
    else {
      computerPlayCard(playableCards, computerHand, discardPile, playerHand, deck, deckRound);
    }
  }, 1000); // Pause before drawing cards
}

function computerDrawCard(deck, deckRound, discardPile, computerHand, playableCards, playerHand) {
  setTimeout(function() {
    // Add card to computer's hand
    drawCards(1, deck, deckRound, discardPile, computerHand, "computerHand");
    // Update computer's face
    updateFace("computer", computerHand);
    // Check which cards in computer's hand are playable
    playableCards = findPlayableCards(computerHand, discardPile);
    // Execute block if computer has playable cards
    if(playableCards.length > 0) {
      computerPlayCard(playableCards, computerHand, discardPile, playerHand, deck, deckRound);
    }
    // Execute block if computer has no playable cards
    else {
      shakeFace(discardPile, playerHand, computerHand, deck, deckRound);
    }
  }, 1000); // Pause before drawing card
}

function computerPlayCard(playableCards, computerHand, discardPile, playerHand, deck, deckRound) {
  setTimeout(function() {
    // Choose random card to play from among playable cards
    var chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];
    // Get position of card to play
    var chosenCardRect = document.getElementById(chosenCard.id).getBoundingClientRect();
    // Get position of discard pile
    var discardPileRect = document.getElementById("discardPile").firstChild.getBoundingClientRect();
    // Add rule to stylesheet and class to card to animate movement of card from hand to discard pile
    document.styleSheets[0].insertRule(".playCard { -webkit-transform: translate(" + (discardPileRect.left - chosenCardRect.left) + "px, " + (discardPileRect.top - chosenCardRect.top) + "px); -moz-transform: translate(" + (discardPileRect.left - chosenCardRect.left) + "px, " + (discardPileRect.top - chosenCardRect.top) + "px); -ms-transform: translate(" + (discardPileRect.left - chosenCardRect.left) + "px, " + (discardPileRect.top - chosenCardRect.top) + "px); transform: translate(" + (discardPileRect.left - chosenCardRect.left) + "px, " + (discardPileRect.top - chosenCardRect.top) + "px); }", 0);
    var chosenCardClass = document.getElementById(chosenCard.id).getAttribute("class");
    document.getElementById(chosenCard.id).setAttribute("class", chosenCardClass + " playCard");
    // Execute block if computer has fewer than eight cards
    if(computerHand.length < 8) {
      // Set style to give played card a z-index greater than discard pile so card will pass over the pile
      document.getElementById(chosenCard.id).setAttribute("style", "z-index: 1");
    }
    setTimeout(function() {
      // Remove rule from stylesheet
      document.styleSheets[0].deleteRule(0);
      // Update arrays and DOM after card has been played
      playCleanup(computerHand, chosenCard, "computerHand", discardPile);
      // Update computer's face
      updateFace("computer", computerHand);
      // Execute block if card that was played is wild
      if(chosenCard.color === "Wild" && computerHand.length > 0) {
        // Play wild card
        playWild("computer", computerHand, playerHand, discardPile, deck, deckRound);
      }
      // Execute block if card that was played isn't wild
      else if(computerHand.length > 0) {
        // Begin player's turn
        initPlayerTurn(discardPile, playerHand, computerHand, deck, deckRound);
      }
      // Execute block if computer has no cards
      else {
        // End game with computer as the winner
        gameOver("computer");
      }
    }, 300); // Pause for card play animation
  }, 1000); // Pause before playing card
}

function shakeFace(discardPile, playerHand, computerHand, deck, deckRound) {
  setTimeout(function() {
  // Add class for shake animation
  document.getElementById("computerFace").setAttribute("class", "shake");
  // Make temporary div
  var tempDiv = document.createElement("div");
  // Append div to playerHand to force refresh of playerHand div; this is to fix a bug in Chrome that causes playerHand to partially disappear after shake animation
  document.getElementById("playerHand").appendChild(tempDiv);
  setTimeout(function() {
    // Remove class for shake animation
    document.getElementById("computerFace").removeAttribute("class", "shake");
    // Remove temporary div
    document.getElementById("playerHand").removeChild(tempDiv);
    // Begin player's turn
    initPlayerTurn(discardPile, playerHand, computerHand, deck, deckRound);
  }, 500); // Pause for shake animation
  }, 1000); // Pause to search for playable cards
}

/* Shared functions */

function showCards(numberOfCards, id, cards) {
  for(var i = 0; i < numberOfCards; i++) {
    // Make div for each card to be shown
    var cardDiv = document.createElement("div");
    // Append div at appropriate point in DOM
    document.getElementById(id).appendChild(cardDiv);
    // Set classes for card
    cardDiv.setAttribute("class", "card " + cards[i].color);
    // Set id for card
    cardDiv.setAttribute("id", cards[i].id);
    // Excute block if more than 7 cards are to be shown
    if(numberOfCards > 7) {
      // Set styles so that cards overlap and shift right as needed to fit within container div
      cardDiv.setAttribute("style", "z-index: " + (i + 1) + "; right: " + i * (((cards.length - 7) * (0.1428 * 100)) / (cards.length - 1)) + "%");
    }
    // Create text div for card
    var cardTextDiv = document.createElement("div");
    // Append text div to card
    document.getElementById(cards[i].id).appendChild(cardTextDiv);
    // Set text for card
    cardTextDiv.innerHTML = cards[i].type;
    // Set class for card text
    cardTextDiv.setAttribute("class", "cardText");
    // Execute block if card belongs to computer
    if(id === "computerHand") {
      cardTextDiv.innerHTML = "JUNO";
    }
    // Execute block if card belongs to player or discard pile
    else {
      cardTextDiv.innerHTML = cards[i].type;
      // Execute block if card text is a number
      if(typeof cards[i].type === "number") {
        // Set style to adjust font size and placement of number
        cardDiv.firstChild.setAttribute("style", "font-size: 210%; margin-top: 40.8%");
      }
    }
  }
}

function findPlayableCards(hand, discardPile) {
  var playableCards = [];
  for(var i = 0; i < hand.length; i++) {
    // Execute block if cards matches the card on the discard pile in number, color, or type or is wild
    if(hand[i].type === discardPile[0].type || hand[i].color === discardPile[0].color || hand[i].color === "Wild") {
      // Add card to array of playable cards
      playableCards.push(hand[i]);
    }
  }
  return playableCards;
}

function drawCards(cardsToDraw, deck, deckRound, discardPile, hand, id) {
  // Execute block once for each card to be drawn
  for(var i = 0; i < cardsToDraw; i++) {
    // Check that deck is not depleted
    checkDeck(deck, deckRound, discardPile);
    // Move card that was drawn from top of deck to player's hand
    hand.push(deck[0]);
    deck.splice(0, 1);
  }
  // Remove hand from DOM
  var element = document.getElementById(id);
  while(element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
  // Show updated hand
  showCards(hand.length, id, hand);
}

function playCleanup(hand, card, id, discardPile) {
  // Remove played card from hand
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].id === card.id) {
      hand.splice(i, 1);
    }
  }
  // Remove hand from DOM
  var element1 = document.getElementById(id);
  while(element1.hasChildNodes()) {
    element1.removeChild(element1.lastChild);
  }
  // Show updated hand
  showCards(hand.length, id, hand);
  // Move played card to top of discard pile
  discardPile.unshift(card);
  // Remove discard pile from DOM
  var element2 = document.getElementById("discardPile");
  element2.removeChild(element2.firstChild);
  // Show updated discard pile
  showCards(1, "discardPile", discardPile);
}

function playWild(whoPlayed, computerHand, playerHand, discardPile, deck, deckRound) {
  // Execute block if player played wild
  if(whoPlayed === "player") {
    // Show wild card menu
    document.getElementById("wildMenu").removeAttribute("class", "hide");
    document.getElementById("wildMenu").onclick = function(event) {
      // Execute block if menu button is clicked
      if(event.target.parentNode.id === "wildMenu" && event.target.classList.contains("wildButton")) {
        // Hide wild card menu
        document.getElementById("wildMenu").setAttribute("class", "hide");
        // Set wild card color equal to id of clicked button
        document.getElementById("discardPile").firstChild.setAttribute("class", "card " + event.target.id);
        discardPile[0].color = event.target.id;
        // Begin computer's turn
        computerTurn(discardPile, computerHand, playerHand, deck, deckRound);
      }
    };
  }
  // Execute block if computer played wild
  else if(whoPlayed === "computer") {
    var handColors = {};
    // Create hash of the colors and number of cards of each color in computer's hand
    computerHand.forEach(function(i) {
      handColors[i.color] = (handColors[i.color] || 0) + 1;
    });
    var colorsSorted = [];
    // Sort colors of cards in computer's hand from greatest to least
    colorsSorted = Object.keys(handColors).sort(function(x, y) {
    return handColors[x] - handColors[y]; }).reverse();
    // Execute block if sorted colors include wild
    if(colorsSorted.indexOf("Wild") !== -1) {
      // Removes wild from sorted colors (to prevent it from being chosen as the wild card color)
      colorsSorted.splice(colorsSorted.indexOf("Wild"), 1);
    }
    // Choose blue as the default wild card color if computer has only wild cards
    if(colorsSorted.length === 0) {
      colorsSorted.push("Blue");
    }
    setTimeout(function() {
      // Set color of wild card on discard pile to chosen color
      document.getElementById("discardPile").firstChild.setAttribute("class", "card " + colorsSorted[0]);
      // Set color of wild card in discard pile array to chosen color
      discardPile[0].color = colorsSorted[0];
      initPlayerTurn(discardPile, playerHand, computerHand, deck, deckRound);
    }, 1000); // Pause for computer to choose wild card color
  }
}

function updateFace(who, hand) {
  // Execute block if player face is being updated
  if(who === "player") {
    // Update player's face based on number of cards in hand
    if(hand.length >= 10) {
      document.getElementById("playerFace").firstElementChild.setAttribute("src", "./images/playerFace4.png");
    }
    else if(hand.length >= 6) {
      document.getElementById("playerFace").firstElementChild.setAttribute("src", "./images/playerFace3.png");
    }
    else if(hand.length >= 4) {
      document.getElementById("playerFace").firstElementChild.setAttribute("src", "./images/playerFace2.png");
    }
    else if(hand.length >= 0) {
      document.getElementById("playerFace").firstElementChild.setAttribute("src", "./images/playerFace1.png");
    }
  }
  // Execute block if computer face is being updated
  else {
    // Update computer's face based on number of cards in hand
    if(hand.length >= 10) {
      document.getElementById("computerFace").firstElementChild.setAttribute("src", "./images/computerFace4.png");
    }
    else if(hand.length >= 8) {
      document.getElementById("computerFace").firstElementChild.setAttribute("src", "./images/computerFace3.png");
    }
    else if(hand.length >= 3) {
      document.getElementById("computerFace").firstElementChild.setAttribute("src", "./images/computerFace2.png");
    }
    else if(hand.length >= 0) {
      document.getElementById("computerFace").firstElementChild.setAttribute("src", "./images/computerFace1.png");
    }
  }
}

function gameOver(winner) {
  // Create placeholder div to maintain height of container for player or computer's hand after all cards have been played
  var placeholderDiv = document.createElement("div");
  // Set class for placeholder div
  placeholderDiv.setAttribute("id", "placeholder");
  // Execute block if player is the winner
  if(winner === "player") {
    // Append placeholder div to playerHand div
    document.getElementById("playerHand").appendChild(placeholderDiv);
    // Set player wins message
    document.getElementById("gameOverMessage").innerHTML = "You won!";
    // Make player wins image
    var playerWinsImg = document.createElement("img");
    // Set source and alt text for image
    playerWinsImg.setAttribute("src", "./images/playerWins.png");
    playerWinsImg.setAttribute("alt", "You won!");
    // Append image to game over div
    document.getElementById("gameOverScreen").appendChild(playerWinsImg);
  }
  // Execute block if computer is the winner
  else {
    // Append placeholder div to computerHand div
    document.getElementById("computerHand").appendChild(placeholderDiv);
    // Set computer wins message
    document.getElementById("gameOverMessage").innerHTML = "You ... did not win.";
    // Make computer wins image
    var computerWinsImg = document.createElement("img");
    // Set source and alt text for image
    computerWinsImg.setAttribute("src", "./images/computerWins.png");
    computerWinsImg.setAttribute("alt", "You ... did not win.");
    // Append image to game over div
    document.getElementById("gameOverScreen").appendChild(computerWinsImg);
  }
  setTimeout(function() {
    //Show overlay screen
    document.getElementById("overlay").removeAttribute("class", "hide");
    // Show game over screen
    document.getElementById("gameOverScreen").removeAttribute("class", "hide");
  }, 500); // Pause before showing overlay
  document.querySelector("body").addEventListener("click", function(event) {
    // Execute block if player clicks button to play again
    if(event.target.id === "yesButton") {
      window.location.reload();
    }
    // Execute block if player clicks button not to play again
    else if(event.target.id === "noButton") {
      // Hide game over screen
      document.getElementById("gameOverScreen").setAttribute("class", "hide");
      // Hide overlay screen
      document.getElementById("overlay").setAttribute("class", "hide");
    }
  });
}

function checkDeck(deck, deckRound, discardPile) {
  // Execute block if deck is depleted
  if(deck.length === 0) {
    // Increment deck round so deck isn't redealt after reshuffle
    deckRound++;
    // Remove colors assigned to wild cards during play
    for(var i = 1; i < discardPile.length; i++) {
      if(discardPile[i].type === "Wild" || discardPile[i].type === "Wild Draw Four") {
        discardPile[i].color = "Wild";
      }
      // Move all but top card of discard pile to deck
      deck.push(discardPile[i]);
    }
    // Remove all but top card of discard pile
    discardPile.splice(1, discardPile.length);
    // Reshuffle deck
    shuffleDeck(deck, deckRound);
  }
}

function showInfo() {
  //Show overlay screen
  document.getElementById("overlay").removeAttribute("class", "hide");
  //Show info screen
  document.getElementById("infoScreen").removeAttribute("class", "hide");
  document.getElementById("infoScreen").onclick = function(event) {
    // Execute block if exit button is clicked
    if(event.target.id === "exitButton") {
      // Hide info screen
      document.getElementById("infoScreen").setAttribute("class", "hide");
      // Hide overlay screen
      document.getElementById("overlay").setAttribute("class", "hide");
    }
  };
}

scaleGame();
startGame();

};