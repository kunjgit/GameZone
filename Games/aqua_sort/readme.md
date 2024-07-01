# Aqua Sort Game

Aqua Sort is a captivating and addictive puzzle game where players must sort colored water into separate tubes. Each tube can hold multiple layers of water, but only one color can be poured into another at a time. The goal is to complete the sorting process with the fewest possible moves, ensuring that each tube contains only one color of water. This game challenges players' problem-solving skills and strategic thinking.

## Features

- **Challenging Levels**: Multiple levels with increasing difficulty to keep players engaged and entertained.
- **Simple Controls**: Easy-to-use controls for pouring water between tubes.
- **Colorful Graphics**: Vibrant and visually appealing colors to enhance the gameplay experience.
- **Hints and Undo**: Options to get hints or undo the last move to help players solve difficult puzzles.
- **Achievements and Rewards**: Earn rewards and achievements for completing levels and setting new records.
- **Time Challenge Mode**: A mode where players must complete the sorting within a time limit for an added challenge.
- **Offline Mode**: Play the game without an internet connection.

## Game Logic

1. **Setup**:
    - The game starts with a set of tubes, each containing a mix of colored water layers.
    - Each tube can hold a maximum of `n` layers of water.

2. **Objective**:
    - Sort the water so that each tube contains only one color of water.

3. **Gameplay Mechanics**:
    - Players can pour water from one tube to another.
    - Water can only be poured if the target tube has space and the top layer of the target tube is the same color or empty.
    - The game keeps track of the number of moves made by the player.

4. **Move Validation**:
    - Check if the selected tube has water to pour.
    - Ensure the target tube has enough space for the additional layer.
    - Confirm that the top layer of the target tube matches the color being poured or is empty.

5. **Game Flow**:
    - Players select a tube to pour from and then select a tube to pour into.
    - If the move is valid, the top layer of water from the first tube is transferred to the second tube.
    - The game checks if the puzzle is solved after each move.
    - If all tubes contain only one color, the level is completed.

6. **Hints and Undo**:
    - Players can use a hint to get a suggestion for the next move.
    - Players can undo their last move if they make a mistake.

7. **Level Progression**:
    - As players complete levels, new, more challenging levels are unlocked with more tubes and colors.

## How to Play

1. Select a tube to pour water from.
2. Select another tube to pour water into.
3. Continue sorting the water until each tube contains only one color.
4. Use hints or undo moves if necessary.
5. Complete levels to unlock new challenges.
