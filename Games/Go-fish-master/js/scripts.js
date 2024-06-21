var gameActive = false;
var dealer;
var searchValue = "x";
var searchPlayer = "x";

$(document).ready(function () {
  $("#startButton").click(buttonPress);
  $("#continue").click(moveOn);
  $("#cardContainer").on("click", ".card", function () {
    cardPress(this);
  });
  $("#opponentContainer").on("click", ".opponent", function() {
    opponentPress(this);
  });
});

function buttonPress() {
  // var element = document.getElementById("sven");
  // var playDeck = new Deck();
  if(!gameActive) {
    dealer = new Dealer(requestPlayers());
    sounds = new Sounds();
    gameActive = true;
    alert("Hands dealt, ready to play.\n Click to begin.");
  }
}

function moveOn() {
  if(gameActive) {
    playGame(searchValue, searchPlayer);
  }
}

function cardPress(press) {
  var value = $(press).attr('value');
  searchValue = value;

  switch (value) {
    case "11":
      value = "Jack";
      break;
    case "12":
      value = "Queen";
      break;
    case "13":
      value = "King";
      break;
    case "1":
      value = "Ace";
      break;
    default:
  }

  $("#searchValue").html(value);
}

function opponentPress(press) {
  var value = $(press).attr('number');
  searchPlayer = value;
  $("#searchPlayer").html("Opponent: " + searchPlayer);
}

function resetSearchValues() {
  $("#searchValue").html("");
  $("#searchPlayer").html("");
  searchValue = "x";
  searchPlayer = "x";
}

// Gameplay cycle runs here after setup
function playGame(playerInputValue, playerInputOpponent) {
  if(playerInputValue === "x" || playerInputOpponent === "x") {
    $("playerInfo").html("Select opponent and card value to fish!");
    return;
  }

  // For each player:
  for (var i = 0; i < dealer.players.length; i++) {
    var playerTakingTurn = dealer.players[i];

    var canTakeTurn = playerTakingTurn.takeTurn();

    // Overrides autoplay with human interraction
    if (canTakeTurn === 2) {
      if(playerTakingTurn.getHand() > 1) {
        // If player cannot draw a card because deck is empty
        if(!dealer.dealCard(playerTakingTurn)) {
          // Skip player, there is nothing else they can do
          $("#playerInfo").html("Deck is empty. Please continue to end.")
          $("#continue").html("Continue");
          continue;
        }
      }

      // Switch value to int (collected as string from image)
      var valueToSearch = parseInt(playerInputValue);
      var opponentToSearch = dealer.players[playerInputOpponent];
      instigateCall(valueToSearch, opponentToSearch, playerTakingTurn);
      resetSearchValues();

      if(playerTakingTurn.getHand() > 1) {
        $("#continue").html("Draw Card");
      }
      continue;
    }

    // If the player has no cards, draw a card
    if(canTakeTurn === 0) {
      // If player cannot draw a card because deck is empty
      if(!dealer.dealCard(playerTakingTurn)) {
        // Skip player, there is nothing else they can do
        continue;
      }
    // Else pick a card and player to fish
    } else {
      // An array containing:
      // [0] = direct reference to a card
      // [1] = index of a player
      var cardAndPlayerInt = playerTakingTurn.callCardAndPlayer(dealer.players.length);

      // Card value
      var cardToFind = cardAndPlayerInt[0].value;

      // Direct reference to a player (from index)
      var playerToFish = dealer.players[cardAndPlayerInt[1]];

      instigateCall(cardToFind, playerToFish, playerTakingTurn);
    }
  }

  if(!dealer.checkWinCondition()) {
    var winnersArray = [];
    var winValue = 0;
    for (var i = 0; i < dealer.players.length; i++) {
      if(dealer.players[i].getNumSets() > winValue) {
        winValue = dealer.players[i].getNumSets();
        winnersArray = [];
        winnersArray.push(i);
      }
      else if (dealer.players[i].getNumSets() === winValue) {
        winnersArray.push(i);
      }
    }

    $("#cardContainer").empty();
    for (var i = 0; i < winnersArray.length; i++) {
      if(dealer.players[winnersArray[i]].id > 1) {
        $("#cardContainer").append("<h3>OPPONENT " + (dealer.players[winnersArray[i]].id - 1) + " WINS!</h3>");
      } else {
        $("#cardContainer").append("<h3>YOU WIN!</h3>");
      }
    }
    gameActive = false;
  }
}

function instigateCall(cardToFind, playerToFish, playerTakingTurn) {
  // Array of index values point to search matches
  var matchingValueIndicies = dealer.findCardInPlayer(cardToFind, playerToFish);

  // If no matches
  if(matchingValueIndicies.length < 1) {
    // If player cannot draw a card because deck is empty
    if(!dealer.dealCard(playerTakingTurn)) {
      // Skip player, there is nothing else they can do
    }
    // continue;
  }

  // Cards to pass to fishing player
  var cardsToPass = playerToFish.removeCards(matchingValueIndicies);
  for (var j = 0; j < cardsToPass.length; j++) {
    playerTakingTurn.addCard(cardsToPass[j]);
  }

  switch (cardToFind) {
    case 11:
      cardToFind = "Jack";
      break;
    case 12:
      cardToFind = "Queen";
      break;
    case 13:
      cardToFind = "King";
      break;
    case 1:
      cardToFind = "Ace";
      break;
    default:
  }

  var num = playerToFish.id;
  if(!playerTakingTurn.human) {
    if(num === 1) {
      num = "YOU"
    } else {
      num = "Opponent " + (playerToFish.id - 1);
    }

    if(matchingValueIndicies < 1) {
      $(".actionExplain").eq((playerTakingTurn.id - 2)).html("Hunted " + cardToFind + " from " + num + ".<br>GO FISH!");
    } else {
      $(".actionExplain").eq(playerTakingTurn.id - 2).html("Hunted " + cardToFind + " from " + num + ".<br>Gained " + matchingValueIndicies.length + " cards!");
    }

  } else {
    num = "Opponent " + (playerToFish.id - 1);
    if(matchingValueIndicies < 1) {
      $("#playerInfo").html("Hunted " + cardToFind + " from " + num + ". GO FISH!");
    } else {
      $("#playerInfo").html("Hunted " + cardToFind + " from " + num + ". Gained " + matchingValueIndicies.length + " cards!");
    }
  }
}

// Get number of players
function requestPlayers() {
  do {
    var players = prompt("Choose a number of players, between 2 and 7!");
    players = parseInt(players);
  } while (players === NaN || players < 2 || players > 7);
  return players;
}

// Manages cards
class Deck {
  constructor() {
    this.deck = [];
    this.initialise();
    this.printDeck();
  }

  // Build and shuffle standard deck of 52 cards
  initialise() {
    const SUITS_QUANTITY = 4;
    const SUIT_SIZE = 13;

    var suits = [4,3,2,1];

    // Build a sorted deck in suits descending order - S,H,C,D
    for(var i = 0; i < SUITS_QUANTITY; i++) {
      for(var j = 0; j < SUIT_SIZE; j++) {

        /*
        Objects are passed by reference in JS, therefore duplicating the global variable 'card' and editing it edits ALL deriviatives of card.
        Thus creating a deck of cards that are ALL THE SAME!
        Therefore variable must be instantiated each time.
        CAN YOU TELL I SPENT A LONG TIME WORKING THIS OUT?!?
        */

        // Template for each card
        var card = {suit: 0, value: 0, image: ""};

        card.suit = suits[i];
        card.value = (j+1);
        // Apply reference to corresponding card image:
        // ../images/cardsjpg/card.image.jpg
        var imageRef = "";
        switch (card.value) {
          case 11:
            imageRef += "J";
            break;
          case 12:
            imageRef += "Q";
            break;
          case 13:
            imageRef += "K";
            break;
          case 1:
            imageRef += "A";
            break;
          default:
            imageRef += String(card.value);
        }

        switch (card.suit) {
          case 4:
            imageRef += "S";
            break;
          case 3:
            imageRef += "H";
            break;
          case 2:
            imageRef += "C";
            break;
          case 1:
            imageRef += "D";
            break;
          default:
            imageRef += "HELP I DON'T HAVE A SUIT!"
        }
        card.image = "../images/cardsjpg/" + imageRef + ".jpg";
        this.deck.push(card);
      }
    }
    this.shuffleDeck();
  }

  // Could randomly grab a single card from the deck rather than suffle
  // BUT a shuffled deck allows for reusable code in other card games
  shuffleDeck() {

    // Shuffles using the Fisher-Yates method, an 'in-place, O(n) algorithm'
    var m = this.deck.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = this.deck[m];
      this.deck[m] = this.deck[i];
      this.deck[i] = t;
    }
  }

  printDeck() {
    $("#deckSize").html(this.deck.length);
  }

  getCard() {
    var drawnCard = this.deck.pop();
    this.printDeck()
    return drawnCard;
  }
}

// Manages interractions between deck and players
class Dealer {
  constructor(players) {
    // Number of players
    this.playerCount = players;
    // Array of players
    this.players = [];

    // Can't play by yourself
    this.MIN_PLAYERS = 2;
    // Number of players necessary for 5 cards rather than 7 to be dealt
    this.DEAL_THRESHOLD = 4
    // Max 7 players for now (technically 10 can play)
    this.MAX_PLAYERS = 7;

    // The deck for this game
    this.playDeck = new Deck();

    this.createPlayers();
    this.dealHands();
  }

  // Create necessary number of player objects
  createPlayers () {
    // Create player class for each player
    $("#opponentContainer").empty();
    for (var i = 0; i < this.playerCount; i++) {
      var newPlayer = new Player();
      newPlayer.id = i+1;
      if (i === 0) {
        newPlayer.setHuman();
      } else {
        var opponentNumber = i;
        $("#opponentContainer").append("<div class=\"opponent\" number=\"" + opponentNumber + "\">\n<button class=\"\" type=\"button\">Opponent " + opponentNumber + "</button>\n<h5>Sets:</h5>\n<h3 class=\"opponentSets\">0</h3>\n<h5 class=\"actionExplain\">==========</h5>\n</div>");
      }
      this.players.push(newPlayer);
    }
    this.playerNum = this.players.length;
  }

  // Deal hand of correct size to each player
  dealHands () {
    var toDeal = 0;
    if (this.playerCount >= this.MIN_PLAYERS && this.playerCount < this.DEAL_THRESHOLD) {
      toDeal = 7;
    }
    else if (this.playerCount >= this.DEAL_THRESHOLD && this.playerCount <= this.MAX_PLAYERS) {
      toDeal = 5;
    }
    else {
      throw "invalidPlayerNumberException";
    }

    for (var i = 0; i < toDeal; i++) {
      for (var j = 0; j < this.players.length; j++) {
        this.dealCard(this.players[j]);
      }
    }
    //
    // for (var i = 0; i < this.players.length; i++) {
    //   console.log(this.players[i].getHand());
    // }
  }

  // Send a single card from the deck to a player
  dealCard (player) {
    if(this.playDeck.deck.length < 1) {
      return false
    } else {
      player.addCard(this.getCardFromDeck());
    }
    return true;
  }

  // TAKE a card value and a player
  // RETURN array of matching cards
  findCardInPlayer(card, opponent) {
    var cardsOfMatchingValue = [];
    // For each card in oppenent's hand
    for (var i = 0; i < opponent.hand.length; i++) {
      // If card value matches value searched for
      if(opponent.hand[i].value === card) {
        // Add index to cardsOfMatchingValue
        cardsOfMatchingValue.push(i);
      }
    }
    return cardsOfMatchingValue;
  }

  // Returns a card from the deck
  getCardFromDeck() {
    return this.playDeck.getCard();
  }

  // Checks if all sets are down
  // If true
  // Player with most sets wins
  checkWinCondition () {
    var totalSets = 0;
    for (var i = 0; i < this.players.length; i++) {
      totalSets += this.players[i].getNumSets();
    }

    if(totalSets === 13) {
      return false;
    }
    return true;
  }

  // Returns length of players array
  getPlayersLength() {
    return this.players.length;
  }
}

// The players
class Player {
  constructor () {
    // Player id (index 1)
    this.id = 0;
    // Array of cards in hand
    this.hand = [];
    // Is this player controlled by a human?
    this.human = false;
    // An array of the sets a player has
    this.sets = [];
    // Human controller
    this.humanController;
  }

  // Add card to hand
  addCard (card) {
    this.hand.push(card);
    this.sortHand();
    this.checkHand();
  }

  // Returns player hand
  getHand () {
    return this.hand;
  }

  setHuman () {
    this.human = true;
    this.humanController = new Human(this);
  }

  // TAKES array of index values for cards to remove
  // Removes cards from hand by interating from end to beginning
  // This avoids incorrect references after splice
  // RETURN the removed cards
  removeCards (indexArray) {
    var removedCards = [];
    for (var i = (indexArray.length - 1); i >= 0; i--) {

      // Capture card in singlecard variable
      var singleCard = this.hand[indexArray[i]];

      // Delete card from array
      this.hand.splice(indexArray[i], 1);

      // Push singleCard to removedCards array
      removedCards.push(singleCard);
    }

    if(this.human) {
      this.humanController.populateCardContainer(this.getHand());
    }

    // Checks hand again to ensure there are cards still in hand
    this.checkHand();
    return removedCards;
  }

  // If hand empty, get card ELSE call a card
  takeTurn () {
    if(this.human) {
      if(this.hand.length < 1) {
        return 0;
      } else {
        return 2;
      }

    } else {
      if(this.hand.length < 1) {
        return 0;
      } else {
        return 1;
      }
    }
  }

  // Takes: total number of players from Dealer
  // Returns:
  // A card to find
  // An integer value for the player to 'fish' from
  callCardAndPlayer (playerTot) {
    // Randomly generated values for the player and card value being fished
    do {
      var rand1 = Math.floor(Math.random() * this.hand.length);
      var rand2 = Math.floor(Math.random() * playerTot);
    } while (rand2 === this.id-1);

    return [this.hand[rand1], rand2];
  }

  // Organise hand S,H,C,D, value ascending
  sortHand () {
    this.hand.sort(function (a,b) {return a.value - b.value});

    if(this.human) {
      this.humanController.populateCardContainer(this.getHand());
    }
  }

  // Checks this player's hand for any sets
  checkHand() {
    var currentValue = 0;
    var valueCount = 1;
    if(this.hand.length < 1 && this.human) {
      this.humanController.emptyHand();
      return;
    } else if(this.human) {
      this.humanController.fullHand();
    }

    // Checks for sets of 4
    for (var i = 0; i < this.hand.length; i++) {
      if (this.hand[i].value !== currentValue) {
        currentValue = this.hand[i].value;
        valueCount = 1;
      } else {
        valueCount++;
      }

      // If 4 matching values are FOUND
      // Removes the latest value, and the 3 preceding
      // This works because the deck is always sorted
      if(valueCount === 4) {
        var set = this.hand[i].value;
        this.playSet(set);

        // Remove set from hand
        this.removeCards([i-3, i-2, i-1, i]);
      }
    }
  }

  // TAKES a complete set
  playSet(set) {
    this.sets.push(set);
    this.updateSetsUI();
  }

  updateSetsUI() {
    var setsString = "";
    if(this.human) {
      for (var i = 0; i < this.sets.length; i++) {
        var toAdd = " |" + this.sets[i] + "s| ";

        switch (this.sets[i]) {
          case 11:
            toAdd = " |Jacks| ";
            break;
          case 12:
            toAdd = " |Queens| ";
            break;
          case 13:
            toAdd = " |Kings| ";
            break;
          case 1:
            toAdd = " |Aces| ";
            break;
          default:
        }
        setsString += toAdd;
      }
      $('#humanSets').html(setsString);
    } else {
      for (var i = 0; i < this.sets.length; i++) {
        var toAdd = " |" + this.sets[i] + "s| ";

        switch (this.sets[i]) {
          case 11:
            toAdd = " |Jacks| ";
            break;
          case 12:
            toAdd = " |Queens| ";
            break;
          case 13:
            toAdd = " |Kings| ";
            break;
          case 1:
            toAdd = " |Aces| ";
            break;
          default:
        }
        setsString += toAdd;
      }
      $('#opponentContainer').children("[number=" + (this.id-1) + "]").eq(0).children(".opponentSets").eq(0).html(setsString);
    }
  }

  getNumSets() {
    return this.sets.length;
  }

  getSets() {
    return this.sets;
  }
}

// Human
class Human {
  constructor() {
    this.cardContainer;
  }

  setCardContainer() {
    this.cardContainer = $("#cardContainer");
  }

  populateCardContainer(hand) {
    this.clearBoard();
    var cardCount = 0;
    for (var i = 0; i < hand.length; i++) {
      cardCount++;
      this.addCardToContainer(hand[i]);
    }
  }

  clearBoard() {
    var cardContainer = $("#cardContainer").empty();
  }

  addCardToContainer(card) {
    $("#cardContainer").append("<img class=\"card\" src=\"" + card.image + "\" value=\"" + card.value + "\" alt=\"A card\">");
  }

  emptyHand() {
    $("#continue").html("Draw Card");
    searchValue = "drawCard";
    searchPlayer = "drawCard";
  }

  fullHand() {
    $("#continue").html("Take Turn");
    searchValue = "x";
    searchPlayer = "x";
  }
}

// Global SFX
class Sounds {
  constructor() {

  }
}
