class Chest {
  constructor(x, y) {
    this.position = { x, y };
    this.width = 48; // Width of a single frame
    this.height = 33; // Height of a single frame
    this.scale = 3; // Scale factor to fit the game
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.isOpen = false;
    this.coinPile = null; // Reference to the coin pile animation

    // Load the chest sprite
    this.image = new Image();
    this.image.src = "assets/images/sprites/Chests.png";

    // Define the frames for the chest we want to use (row 5 and 6)
    this.frames = 5;
    this.frameX = 0;
    this.frameY = 4; // Start at row 5
    this.frameSpeed = 10;
    this.frameTick = 0;
    this.animationComplete = false; // Flag to check if animation is complete

    // Create the chat bubble and prompt elements
    this.chatBubble = document.createElement("div");
    this.chatBubble.classList.add("chatBubble");
    document.body.appendChild(this.chatBubble);

    this.promptE = document.createElement("div");
    this.promptE.classList.add("promptE");
    this.promptE.innerText = "E";
    document.body.appendChild(this.promptE);

    // Puzzle elements
    this.puzzleModal = document.getElementById("puzzleModal");
    this.puzzleInstructions = document.getElementById("puzzleInstructions");
    this.puzzleInput = document.getElementById("puzzleInput");
    this.submitPuzzleButton = document.getElementById("submitPuzzle");
    this.puzzleSolution = "";

    // Add event listeners for puzzle interactions
    this.submitPuzzleButton.addEventListener("click", () => {
      if (this.puzzleInput.value === this.puzzleSolution) {
        this.solvePuzzle(player);
      } else {
        this.shakePuzzleModal(); // Trigger shake animation
      }
    });

    const closeModal = () => {
      this.puzzleModal.style.display = "none";
      this.puzzleInput.value = "";
    };

    document.querySelector(".close").addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === this.puzzleModal) {
        closeModal();
      }
    });
  }

  // Draw the chest on the canvas
  draw(cameraOffsetX) {
    c.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.position.x - cameraOffsetX,
      this.position.y,
      this.scaledWidth,
      this.scaledHeight
    );
  }

  // Show the 'E' prompt above the chest
  showPromptE(cameraOffsetX) {
    const promptX = this.position.x - cameraOffsetX + this.scaledWidth / 2;
    const promptY = this.position.y - 30; // Above the chest

    const canvasRect = document.querySelector("canvas").getBoundingClientRect();
    this.promptE.style.left = `${canvasRect.left + promptX - 10}px`;
    this.promptE.style.top = `${canvasRect.top + promptY - 20}px`;
    this.promptE.style.display = "block";
  }

  // Hide the 'E' prompt
  hidePromptE() {
    this.promptE.style.display = "none";
  }

  // Show a chat bubble above the chest
  showChatBubble(cameraOffsetX, text) {
    const bubbleX = this.position.x - cameraOffsetX + this.scaledWidth / 2;
    const bubbleY = this.position.y - 100; // Above the chest

    const canvasRect = document.querySelector("canvas").getBoundingClientRect();
    this.chatBubble.style.left = `${canvasRect.left + bubbleX}px`;
    this.chatBubble.style.top = `${canvasRect.top + bubbleY}px`;
    this.chatBubble.innerHTML = text.replace(/\n/g, "<br>");
    this.chatBubble.style.display = "block";
  }

  // Hide the chat bubble
  hideChatBubble() {
    this.chatBubble.style.display = "none";
  }

  // Generate a random puzzle solution
  generatePuzzle() {
    const patternLength = 5;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.puzzleSolution = Array.from({ length: patternLength })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      )
      .join("");
    this.puzzleInstructions.innerText = this.puzzleSolution;
  }

  // Solve the puzzle and open the chest
  solvePuzzle(player) {
    this.isOpen = true;
    this.frameY = 5; // Change to row 6 for the open chest
    // Create coin pile animation
    this.coinPile = new CoinPile(
      this.position.x,
      this.position.y - this.scaledHeight / 2
    );
    player.coins += 50; // Add 50 coins to the player's coin count
    player.hasCollectedTreasure = true; // Set treasure collected state
    audioManager.playSound("treasure");
    this.hidePromptE();
    this.puzzleModal.style.display = "none"; // Close the modal
  }

  // Shake the puzzle modal to indicate incorrect solution
  shakePuzzleModal() {
    const modalContent = this.puzzleModal.querySelector(".modal-content");
    modalContent.classList.add("shake");
    setTimeout(() => {
      modalContent.classList.remove("shake");
    }, 500); // Duration of the shake animation
  }

  // Update the chest state and animations
  update(cameraOffsetX, player, enemies) {
    const modalVisible = this.puzzleModal.style.display === "block";

    // Interaction logic when the player is near the chest
    if (
      !modalVisible && // Only interact if the modal is not visible
      !this.isOpen &&
      player.position.x < this.position.x + this.scaledWidth &&
      player.position.x + player.width > this.position.x &&
      player.position.y < this.position.y + this.scaledHeight &&
      player.height + player.position.y > this.position.y
    ) {
      // Show E prompt if in proximity
      if (!player.isInteracting) {
        this.showPromptE(cameraOffsetX + 40);
      }

      // Check if player is in proximity and presses 'e' to open the chest
      if (keys.e.pressed) {
        if (!player.hasKey) {
          this.showChatBubble(
            cameraOffsetX,
            "You need a key to open this chest."
          );
        } else if (enemies.length > 0) {
          this.showChatBubble(
            cameraOffsetX,
            "Defeat all enemies to open the chest."
          );
        } else {
          this.generatePuzzle();
          this.puzzleModal.style.display = "block";
        }
      }
    } else {
      this.hidePromptE();
      this.hideChatBubble();
    }

    // Update frame animation
    if (!this.animationComplete) {
      this.frameTick++;
      if (this.frameTick >= this.frameSpeed) {
        this.frameTick = 0;
        this.frameX++;
        if (this.frameX >= this.frames) {
          this.frameX = this.frames - 1; // Stay on the last frame
          this.animationComplete = true; // Animation complete
        }
      }
    }

    // Update coin pile animation if present
    if (this.coinPile) {
      this.coinPile.update(cameraOffsetX);
    }

    this.draw(cameraOffsetX);
  }
}
