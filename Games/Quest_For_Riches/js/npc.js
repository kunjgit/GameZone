/**
 * Represents a Non-Player Character (NPC) in the game.
 */
class NPC {
  /**
   * Creates a new NPC instance.
   * @param {number} x - The x-coordinate of the NPC.
   * @param {number} y - The y-coordinate of the NPC.
   * @param {Object} spriteData - The data for the NPC's sprite.
   * @param {number} spriteData.width - The width of a single frame in the sprite.
   * @param {number} spriteData.height - The height of a single frame in the sprite.
   * @param {Object} spriteData.sprites - An object containing sprite animations and their details.
   */
  constructor(x, y, spriteData) {
    this.position = { x, y };
    this.width = spriteData.width; // Width of a single frame
    this.height = spriteData.height; // Height of a single frame
    this.scale = 2; // Scale factor
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.direction = "left"; // Initial direction the NPC is facing
    this.isChatting = false; // Flag to indicate if the NPC is chatting
    this.dialogueState = 0; // Track the dialogue state
    this.finalDialogueDone = false; // Flag to check if the final dialogue is done

    this.chatBubble = document.createElement("div");
    this.chatBubble.classList.add("chatBubble");
    document.body.appendChild(this.chatBubble);
    this.promptE = document.createElement("div");
    this.promptE.classList.add("promptE");
    this.promptE.innerText = "E";
    document.body.appendChild(this.promptE);

    // Load the sprite sheet
    this.sprites = spriteData.sprites;
    this.loaded = false; // Flag to check if images are loaded
    this.currentSprite = "idle";
    this.frameIndex = 0;
    this.frameSpeed = this.sprites[this.currentSprite].speed;
    this.frameTick = 0;

    // Load images
    const img = new Image();
    img.src = this.sprites[this.currentSprite].src;
    img.onload = () => {
      this.loaded = true;
    };
    this.sprites[this.currentSprite].img = img;
  }

  /**
   * Resets the NPC's state to its initial values.
   */
  resetState() {
    this.isChatting = false;
    this.dialogueState = 0;
    this.finalDialogueDone = false;
    this.hideChatBubble();
    this.hidePromptE();
  }

  /**
   * Draws the NPC on the canvas.
   * @param {number} cameraOffsetX - The offset of the camera on the x-axis.
   */
  draw(cameraOffsetX) {
    if (!this.loaded) return; // Only draw if images are loaded

    const sprite = this.sprites[this.currentSprite];
    const sx = this.frameIndex * this.width;
    const sy = 0;

    // Save the current context state
    c.save();

    if (this.direction === "left") {
      // Flip the context horizontally
      c.scale(-1, 1);
      // Draw the image flipped
      c.drawImage(
        sprite.img,
        sx,
        sy,
        this.width,
        this.height,
        -(this.position.x - cameraOffsetX + this.scaledWidth),
        this.position.y,
        this.scaledWidth,
        this.scaledHeight
      );
    } else {
      // Draw the image normally
      c.drawImage(
        sprite.img,
        sx,
        sy,
        this.width,
        this.height,
        this.position.x - cameraOffsetX,
        this.position.y,
        this.scaledWidth,
        this.scaledHeight
      );
    }

    // Restore the context state
    c.restore();
  }

  /**
   * Displays the prompt 'E' above the NPC when the player is in proximity.
   * @param {number} cameraOffsetX - The offset of the camera on the x-axis.
   */
  showPromptE(cameraOffsetX) {
    const promptX = this.position.x - cameraOffsetX + this.scaledWidth / 2;
    const promptY = this.position.y - 30; // Above the NPC

    // Get canvas position
    const canvasRect = document.querySelector("canvas").getBoundingClientRect();

    // Adjust prompt position based on canvas position
    this.promptE.style.left = `${canvasRect.left + promptX - 10}px`;
    this.promptE.style.top = `${canvasRect.top + promptY - 20}px`;
    this.promptE.style.display = "block";
  }

  /**
   * Hides the prompt 'E'.
   */
  hidePromptE() {
    this.promptE.style.display = "none";
  }

  /**
   * Displays a chat bubble above the NPC with the given text.
   * @param {number} cameraOffsetX - The offset of the camera on the x-axis.
   * @param {string} text - The text to display in the chat bubble.
   */
  showChatBubble(cameraOffsetX, text) {
    const bubbleX = this.position.x - cameraOffsetX + this.scaledWidth / 2;
    const bubbleY = this.position.y - 100; // Above the NPC

    // Get canvas position
    const canvasRect = document.querySelector("canvas").getBoundingClientRect();

    // Adjust bubble position based on canvas position
    this.chatBubble.style.left = `${canvasRect.left + bubbleX}px`;
    this.chatBubble.style.top = `${canvasRect.top + bubbleY}px`;
    this.chatBubble.innerHTML = text.replace(/\n/g, "<br>");
    this.chatBubble.style.display = "block";
  }

  /**
   * Hides the chat bubble.
   */
  hideChatBubble() {
    this.chatBubble.style.display = "none";
  }

  /**
   * Updates the NPC's state and handles interactions with the player.
   * @param {number} cameraOffsetX - The offset of the camera on the x-axis.
   * @param {Player} player - The player instance.
   */
  update(cameraOffsetX, player) {
    // Update the frame index for animation
    this.frameTick++;
    if (this.frameTick >= this.frameSpeed) {
      this.frameTick = 0;
      const sprite = this.sprites[this.currentSprite];
      this.frameIndex = (this.frameIndex + 1) % sprite.frames;
    }

    this.draw(cameraOffsetX);

    // Check if player is in proximity
    const proximityRangeX = 150; // Range for X-axis proximity
    const proximityRangeY = 100; // Range for Y-axis proximity
    const inProximity =
      Math.abs(this.position.x - player.position.x) < proximityRangeX &&
      Math.abs(this.position.y - player.position.y) < proximityRangeY;

    if (inProximity && !this.isChatting) {
      this.showPromptE(cameraOffsetX);
      if (player.isInteracting) {
        this.isChatting = true;
        audioManager.playSound("chat"); // Play chat sound
      }
    } else {
      this.hidePromptE();
      if (!inProximity) {
        this.isChatting = false;
        this.dialogueState = 0; // Reset dialogue state when out of proximity
      }
    }

    // Draw chat bubble if chatting
    if (this.isChatting) {
      let chatText = level.getNPCDialogue(
        this.dialogueState,
        player.hasCollectedTreasure
      );
      this.showChatBubble(cameraOffsetX, chatText);
    } else {
      this.hideChatBubble();
    }
  }

  /**
   * Handles player interactions with the NPC, such as progressing dialogue.
   * @param {Player} player - The player instance.
   */
  interact(player) {
    if (this.isChatting) {
      if (this.finalDialogueDone) {
        endLevel(); // Show the transition screen after final dialogue
      } else if (player.hasCollectedTreasure) {
        this.dialogueState = 0; // Reset dialogue state after completion
        this.finalDialogueDone = true; // Set flag for final dialogue
      } else {
        this.dialogueState = (this.dialogueState + 1) % 4; // Cycle through dialogue states
        audioManager.playSound("chat"); // Play chat sound when interaction changes the dialogue state
      }
    }
  }
}
