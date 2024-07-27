### Demo Video
<video controls src="Bunny Game - Made with Clipchamp.mp4" title="Title"></video>

### Game Logic

The game "Bunny is Lost!" is a 2D side-scrolling survival game where the player controls a bunny that must run away from a forest fire while avoiding and surviving various obstacles. The main objective is to keep the bunny alive for as long as possible by jumping over obstacles and collecting carrots to maintain its health. Here is a detailed breakdown of the game logic:

1. **Initialization and Setup:**
   - The game initializes the HTML and CSS elements required for the game interface and player interaction.
   - The `resizeGame` function adjusts the game canvas based on the window size to ensure the game is displayed correctly on different devices.
   - Background music is generated and played in a loop using the Web Audio API.

2. **Game Start:**
   - When the player clicks the "Run!" button, the game starts by hiding the intro screen and initiating the main game loop (`gameTic`).

3. **Main Game Loop:**
   - The main game loop updates the world’s rotation (`worldDeg`) to create the illusion of the bunny running.
   - Background elements, like mountains and fire, are updated to match the world's rotation.
   - The player’s status and position are updated based on user input and game events.

4. **Player Interaction:**
   - The player can prepare to jump by pressing the up arrow key or the spacebar, which increases the `jumpPrepare` value.
   - Releasing the key triggers the bunny’s jump, calculated based on the `jumpPrepare` value.
   - The bunny’s status transitions between "stopped", "prepare", "jump", and "landing" based on its vertical position and jump force.

5. **Obstacles and Enemies:**
   - Carrots appear at regular intervals and can be collected to increase the bunny’s life.
   - Birds are spawned as enemies that attempt to capture the bunny. If a bird catches the bunny, it results in the bunny’s death.

6. **Health and Status Updates:**
   - The bunny’s health decreases over time and when it prepares to jump.
   - If the bunny’s health drops to zero or if it gets caught by a bird, the game ends.
   - The game displays the distance traveled by the bunny.

7. **Collision Detection:**
   - The game checks for collisions between the bunny and carrots or birds.
   - Collecting a carrot increases the bunny’s health, while a collision with a bird ends the game.

8. **Game Over Conditions:**
   - The game ends when the bunny's health reaches zero, the bunny gets caught by a bird, or if the bunny is overtaken by the fire.
   - On game over, a message is displayed, and the screen transitions to a sepia tone.

### Game Features

1. **Dynamic Scaling:**
   - The game dynamically adjusts its size and layout based on the device’s screen size, ensuring an optimal viewing experience on both desktops and mobile devices.

2. **Background Music:**
   - A procedurally generated background score plays throughout the game, creating an engaging and immersive atmosphere.

3. **Interactive Controls:**
   - Players can control the bunny’s jumps through keyboard inputs (up arrow or spacebar) or touch inputs on mobile devices.

4. **Collectibles:**
   - Carrots are scattered throughout the game, which players can collect to replenish the bunny’s health.

5. **Obstacles and Enemies:**
   - Birds serve as enemies that add challenge by trying to catch the bunny.
   - The fire serves as a constant threat that moves towards the bunny, adding urgency to the gameplay.

6. **Visual Effects:**
   - The game features various visual effects, including a rotating world, animated fire, and dynamically generated mountains and backgrounds.

7. **Health and Jump Indicators:**
   - The game provides visual indicators for the bunny’s health and jump preparation, helping players manage their actions effectively.

8. **Endgame Feedback:**
   - Upon the bunny’s death, the game provides feedback on how the bunny died, adding narrative depth to the game.

The combination of these features creates an engaging and challenging game that requires players to balance their actions to keep the bunny alive while navigating through an ever-changing environment.