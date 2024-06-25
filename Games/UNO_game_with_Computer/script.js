document.addEventListener("DOMContentLoaded", () => {
    const deck = [];
    const playerHand = [];
    const computerHand = [];
    const discardPile = [];
    const colors = ["red", "yellow", "green", "blue"];
    const specialCards = ["skip", "reverse", "+2", "wild", "wild+4"];
  
    let currentPlayer = "player";
  
    // Generate deck
    function generateDeck() {
      for (const color of colors) {
        for (let i = 0; i <= 9; i++) {
          deck.push({ color, number: i });
          if (i !== 0) deck.push({ color, number: i });
        }
        for (const special of specialCards) {
          if (special.includes("wild")) {
            deck.push({ color: null, type: special });
          } else {
            deck.push({ color, type: special });
            deck.push({ color, type: special });
          }
        }
      }
      shuffleDeck();
    }
  
    // Shuffle deck
    function shuffleDeck() {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
  
    // Draw a card
    function drawCard() {
      if (deck.length === 0) {
        // Reshuffle discard pile into deck
        const topCard = discardPile.pop();
        deck.push(...discardPile);
        discardPile.length = 0;
        discardPile.push(topCard);
        shuffleDeck();
      }
      return deck.pop();
    }
  
    // Deal cards to players
    function dealCards() {
      for (let i = 0; i < 7; i++) {
        playerHand.push(drawCard());
        computerHand.push(drawCard());
      }
    }
  
  // Play a card
  function playCard(cardIndex) {
    const card =
      currentPlayer === "player"
        ? playerHand[cardIndex]
        : computerHand[cardIndex];
    const topCard = discardPile[discardPile.length - 1];
  
    if (isValidMove(card, topCard)) {
      discardPile.push(card);
      currentPlayer === "player"
        ? playerHand.splice(cardIndex, 1)
        : computerHand.splice(cardIndex, 1);
      displayDiscardPile();
      displayPlayerHand();
      displayComputerHand();
      checkWinner();
      if (currentPlayer === "player" && playerHand.length === 1) {
        alert("UNO!");
      }
      if (card.type === "wild+4") {
        // Draw 4 cards for the next player
        const nextPlayerHand = currentPlayer === "player" ? computerHand : playerHand;
        for (let i = 0; i < 4; i++) {
          nextPlayerHand.push(drawCard());
        }
        displayPlayerHand();
        displayComputerHand();
      }
      if (card.type === "+2") {
        // Draw 2 cards for the next player
        const nextPlayerHand = currentPlayer === "player" ? computerHand : playerHand;
        for (let i = 0; i < 2; i++) {
          nextPlayerHand.push(drawCard());
        }
        displayPlayerHand();
        displayComputerHand();
      }
      handleSpecialCard(card);
      if (currentPlayer === "computer") {
        setTimeout(computerPlay, 1000); // Add a delay to simulate computer thinking
      }
    } else {
      alert("Invalid move! You can't play that card.");
    }
  }
  
  
   // Handle special cards
  function handleSpecialCard(card) {
    if (card.type === "reverse") {
      switchTurn();
      switchTurn();
    } else if (card.type === "skip") {
      switchTurn();
      switchTurn();
    } else if (card.type === "wild" || card.type === "wild+4") {
      let selectedColor;
      if (currentPlayer === "player") {
        selectedColor = prompt("Choose a color (red, yellow, green, blue):").toLowerCase();
      } else {
        selectedColor = colors[Math.floor(Math.random() * colors.length)];
        alert(`Computer has chosen ${selectedColor}!`);
      }
      if (selectedColor && colors.includes(selectedColor)) {
        discardPile.push({ color: selectedColor, type: card.type });
      } else {
        switchTurn();
      }
      switchTurn();
    } else {
      switchTurn();
    }
  }
    function computerPlay() {
      let playableCards = computerHand.filter((card) =>
        isValidMoveForComputer(card, discardPile[discardPile.length - 1])
      );
      if (playableCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * playableCards.length);
        const cardIndex = computerHand.indexOf(playableCards[randomIndex]);
        playCard(cardIndex);
      } else {
        drawCardForComputer();
      }
    }
  
    function isValidMoveForComputer(card, topCard) {
      if (card.type === "wild" || card.type === "wild+4") {
        return true;
      }
      if (topCard.type === "reverse" && card.type === "reverse") {
        return true;
      }
      if (card.type === "skip" && topCard.type === "skip") {
        return true;
      }
      if (card.type === "+2" && topCard.type === "+2") {
        return true;
      }
      return (
        card.color === topCard.color ||
        (card.number !== undefined && card.number === topCard.number)
      );
    }
  
    // Draw a card for the computer player
    function drawCardForComputer() {
      computerHand.push(drawCard());
      displayComputerHand();
      switchTurn();
    }
  
    // Check if a move is valid
    function isValidMove(card, topCard) {
      if (card.type === "wild" || card.type === "wild+4") {
        return true;
      }
      if (card.type === "reverse" && topCard.type === "reverse") {
        return true;
      }
      if (card.type === "skip" && topCard.type === "skip") {
        return true;
      }
      if (card.type === "+2" && topCard.type === "+2") {
        return true;
      }
      return (
        card.color === topCard.color ||
        (card.number !== undefined && card.number === topCard.number)
      );
    }
  
    // Display player's hand
    function displayPlayerHand() {
      const playerHandDiv = document.getElementById("player-hand");
      playerHandDiv.innerHTML = "";
      for (const [index, card] of playerHand.entries()) {
        const cardDiv = createCardElement(card, index, "player");
        playerHandDiv.appendChild(cardDiv);
      }
    }
  
    // Display computer's hand
    function displayComputerHand() {
      const computerHandDiv = document.getElementById("computer-hand");
      computerHandDiv.innerHTML = "";
      for (const [index, card] of computerHand.entries()) {
        const cardDiv = createCardElement(
          { color: null, type: "back" },
          index,
          "computer"
        );
        computerHandDiv.appendChild(cardDiv);
      }
    }
  
    // Display discard pile
    function displayDiscardPile() {
      const discardPileDiv = document.getElementById("discard-pile");
      const topCard = discardPile[discardPile.length - 1];
      discardPileDiv.innerText = topCard.color
        ? `${topCard.color} ${
            topCard.number !== undefined ? topCard.number : topCard.type
          }`
        : topCard.type;
      discardPileDiv.style.backgroundColor = topCard.color || "black";
      discardPileDiv.style.color = topCard.color === "yellow" ? "black" : "white";
    }
  
    // Create card element
    function createCardElement(card, index, player) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";
      cardDiv.dataset.index = index;
      if (player === "computer" && card.type === "back") {
        cardDiv.style.backgroundColor = "#333";
        cardDiv.style.color = "white";
        cardDiv.innerText = "UNO";
      } else {
        if (card.color) {
          cardDiv.innerText = `${
            card.number !== undefined ? card.number : card.type
          }`;
          cardDiv.style.backgroundColor = card.color;
          cardDiv.style.color = card.color === "yellow" ? "black" : "white"; // Adjust text color for better readability
        } else {
          cardDiv.innerText = `${card.type}`;
          cardDiv.style.backgroundColor = "black";
          cardDiv.style.color = "white";
        }
        if (player === "player") {
          cardDiv.addEventListener("click", () => playCard(index));
        }
      }
      return cardDiv;
    }
  
    // Switch turn between player and computer
    function switchTurn() {
      currentPlayer = currentPlayer === "player" ? "computer" : "player";
      document.getElementById("current-turn").innerText = `Current Turn: ${
        currentPlayer === "player" ? "Player" : "Computer"
      }`;
    }
  
    // Check if any player has won
    function checkWinner() {
      if (playerHand.length === 0) {
        alert("Congratulations! You win!");
        resetGame();
      } else if (computerHand.length === 0) {
        alert("Computer wins! Better luck next time!");
        resetGame();
      }
    }
  
    // Reset the game
    function resetGame() {
      deck.length = 0;
      playerHand.length = 0;
      computerHand.length = 0;
      discardPile.length = 0;
      currentPlayer = "player";
      generateDeck();
      dealCards();
      discardPile.push(drawCard());
      displayDiscardPile();
      displayPlayerHand();
      displayComputerHand();
      document.getElementById("current-turn").innerText = "Current Turn: Player";
    }
  
    // Initial setup
    generateDeck();
    dealCards();
  
    // Draw the first card from the deck
    let firstCard = drawCard();
    // If the first card is a wild card, choose a random color for it
    if (firstCard.type === "wild" || firstCard.type === "wild+4") {
      firstCard.color = colors[Math.floor(Math.random() * colors.length)];
    }
    discardPile.push(firstCard);
  
    // Display the first card on the discard pile
    displayDiscardPile();
    displayPlayerHand();
    displayComputerHand();
    document.getElementById("current-turn").innerText = "Current Turn: Player";
  
    // Draw button functionality
    document.getElementById("draw-button").addEventListener("click", () => {
      if (currentPlayer === "player") {
        playerHand.push(drawCard());
        displayPlayerHand();
        switchTurn();
        setTimeout(computerPlay, 1000); // Add a delay to simulate computer thinking
      }
    });
  });