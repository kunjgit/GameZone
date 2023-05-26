//instructions
var instructionsState = function () {
    //background
    //image(space, 0, 0, 400, 400);
    //text
    //background(0, 255, 255,100);
    textSize(35);
    fill(255, 255, 255);
    text("Instructions", 50, 50);
    fill(237, 34, 93, 250);
    rect(100,100,500,350,20);
    fill(255,255,255);
    textSize(17);
    text("Two players arrange five ships on their maps and then do guess-fire on each other's map in alternate turns until either player wins by sinking all the ships. Players get bonus turn if they hit opponents ship. BOT uses probability density map to guess coordinates of ship .\n\n 1. Press AUTO to arrange your ships randomly on map , press auto again if you want to re-arranage your ships in different order. \n\n 2. Press 'CONFIRM' to start the game. \n\n 3. NOTE : online-multiplayer is not yet developed. \n\n ENJOY GAME !!!!! ", 125, 125, 450,300);
    //make button
    var backButton = new button("back", 225, 500);
    backButton.draw();
    //if the mouse is in the same place as the button
    if (mouseX > backButton.x && mouseX < backButton.x + backButton.width && mouseY > backButton.y && mouseY < backButton.y + backButton.height) {
        //check to see if the mouse is pressed
        if (!mouseIsPressed) {
            //if mouse is not pressed then light up button
            backButton.lightUpButton();
        }
        if (mouseIsPressed) {
            //if mouse is pressed go to menu
            instructions = false;
            menu = true;
        }
    }
};
