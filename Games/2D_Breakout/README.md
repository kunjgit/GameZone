# **2D-Breakout** 

---

<br>

## **Description 📃**
In the 2D Breakout game, your objective is to eliminate all the bricks by controlling a bouncing ball and ensuring it doesn't exit the game area by maneuvering the paddle!


## **Functionalities 🎮**
<!-- add functionalities over here -->
- When the ball hits the paddle, it will move in a specific direction determined by the point of impact on the paddle, ensuring that the paddle doesn't act as an immovable barrier. 
This allows you to control the ball's trajectory when striking it with the paddle.

- Within the game, we also implemented a collision detection function. For example, when the ball collides with a brick, the brick disappears, and the player's score increments accordingly.

- The player starts with 3 lives. If a life is lost, the ball's position resets, granting the player an opportunity to continue playing. When all 3 lives are lost, the game ends, displaying a "Game Over" message and a "Play Again" button for restarting.

- To achieve victory in the game, the player must break all the bricks on each of the 7 levels. As the player progresses through the levels, the number of bricks increases, and so does the ball's speed.

> We implemented interactive sounds into the game and added a toggle sound button in the left lower corner of the screen to turn the sound OFF/ON!

<br>

## **How to play? 🕹️**
<!-- add the steps how to play games -->
In order to install and start playing the game on your local computer, please follow these steps:
1. Fork the [GameZone](https://github.com/eludwin/GameZone) repository.
    a. Fork the repository by clicking on the fork button on the top of the GameZone's page. This will create a copy of GameZone's repository in your account.
2. Clone the repository to your machine.
    a. Go to your GitHub account, open the forked repository, click on the code button and then click the copy to clipboard icon.
    b. Open a terminal and run the following git command:
```
git clone "url you just copied"
```
3. Open the 2D_Breakout file.
4. Run index.html in your default browser.
5. Enjoy the game!

### **Game Mechanics**:
- Both the paddle and the ball are drawn on the screen. 
- The paddle control is enabled through the left and right arrow keys on the keyboard. 
- The ball's movement is animated when it touches the paddle.
- Due to collision detection logic, when the ball hits a wall, it changes direction accordingly.

<br>

## **Screenshots 📸**

<br>

![image](https://github.com/Deepanshu0703/GameZone/assets/114489502/4ed9b3f9-b855-41e5-95db-8a6bbabe966a)

<br>

## **Video Preview 📹**
<!-- add your working video over here -->



https://github.com/Deepanshu0703/GameZone/assets/114489502/007f88d4-6e7b-4bf9-81ee-7a6a41adfe15









