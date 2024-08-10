
# Advanced Snake Game in C++

This is an advanced version of the classic Snake game implemented in C++. It includes features such as user authentication, a loading screen, a larger game grid, and adjustable snake speed. The game is played in the console and is a great project for learning and practicing C++ programming.

## Features

- **User Authentication**: Simple login system with username and password validation.
- **Loading Screen**: A loading effect displayed before the game starts.
- **Larger Grid**: The game grid is expanded to 40x20 for more challenging gameplay.
- **Adjustable Speed**: The snake's speed is adjustable, allowing for a more customized experience.
- **Collision Detection**: The game ends when the snake collides with itself.

## Getting Started

### Prerequisites

- **C++ Compiler**: You need a C++ compiler installed on your system (e.g., GCC, Visual Studio).
- **Windows**: Ensure you have the `<conio.h>` and `<windows.h>` headers available.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rugved0102/Snake-Game.git
   cd snake-game-cpp
   ```

2. **Create a `users.txt` file** in the project directory with the following format:
   ```
   username1 password1
   username2 password2
   ```

### Compilation

To compile the game, run the following command:

```bash
g++ -o snake snake.cpp -std=c++11
```

### Running the Game

After compiling, run the game using:

```bash
./snake
```

### Gameplay Instructions

- **Controls**: Use the `W`, `A`, `S`, and `D` keys to move the snake up, left, down, and right, respectively.
- **Objective**: Guide the snake to eat the fruit (`F`) to grow longer while avoiding collisions with itself.

## Files Included

- **snake.cpp**: The main C++ source code file for the game.
- **users.txt**: A text file storing user credentials for login.

## Future Enhancements

- Implement levels with increasing difficulty.
- Add a high-score system to track the best scores.
- Introduce new obstacles and power-ups for more engaging gameplay.
- Implement a graphical user interface using a library like SDL or SFML.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Acknowledgments

- Inspired by the classic Snake game.
- Thanks to the C++ community for providing excellent resources and tutorials.
