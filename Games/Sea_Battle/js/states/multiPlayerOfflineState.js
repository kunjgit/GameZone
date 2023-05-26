//play
var multiPlayerOfflineState = function () {
    //background
    //background(0, 255, 255,100);
    var backButton1 = new button("back", 400, 450);
    backButton1.draw();

    // draws 10*10 grid for player 1
    if (!player1.confirmButtonPushed) {

        player1.drawGridActual();
        player1AutoButton.draw();
    }
    else {
        player1.drawGridHidden();
    }

    // draws 10*10 grid for player 2
    if (!player2.confirmButtonPushed) {

        player2.drawGridActual();
        player2AutoButton.draw();
    }
    else {
        player2.drawGridHidden();
    }

    // auto button for player 1
    if (player1.shipArranged === false) {

        player1AutoButton.draw();

        if (player1AutoButton.insideButton()) {
            //check to see if the mouse is pressed
            if (!mouseIsPressed) {
                //if mouse is not pressed then light up button
                player1AutoButton.lightUpButton();

            }
            if (mouseIsPressed) {

                player1.initializeGrid();
                player1.arrangeShip();
                player1.autoButtonPushed = true;
                mouseIsPressed = false;
                //shipArranged = true;
            }
        }
    }

    // confirm button for player1
    if (player1.autoButtonPushed) {

        player1ConfirmButton.draw();

        if (player1ConfirmButton.insideButton()) {
            //check to see if the mouse is pressed
            if (!mouseIsPressed) {
                //if mouse is not pressed then light up button
                player1ConfirmButton.lightUpButton();
            }
            if (mouseIsPressed) {
                player1.autoButtonPushed = false;
                player1.shipArranged = true;
                player1.confirmButtonPushed = true;
                mouseIsPressed = false;                
                //shipArranged = true;
            }
        }
    }

    // auto button for player 2 
    if (player2.shipArranged === false) {

        player2AutoButton.draw();

        if (player2AutoButton.insideButton()) {
            //check to see if the mouse is pressed
            if (!mouseIsPressed) {
                //if mouse is not pressed then light up button
                player2AutoButton.lightUpButton();
            }
            if (mouseIsPressed) {

                player2.initializeGrid();                
                player2.arrangeShip();
                player2.autoButtonPushed = true;
                mouseIsPressed = false;                
                //shipArranged = true;
            }
        }
    }

    // confirm button for player2
    if (player2.autoButtonPushed) {

        player2ConfirmButton.draw();

        if (player2ConfirmButton.insideButton()) {
            //check to see if the mouse is pressed
            if (!mouseIsPressed) {
                //if mouse is not pressed then light up button
                player2ConfirmButton.lightUpButton();

            }
            if (mouseIsPressed) {

                player2.autoButtonPushed = false;
                player2.confirmButtonPushed = true;
                player2.shipArranged = true;
                // swap maps of players
                mapSwap("multiPlayer");
                mouseIsPressed = false;                
            }
        }
    }

    // if both players have deployed ships start the game
    // main multiplayer pass N play if statement
    if (player1.confirmButtonPushed && player2.confirmButtonPushed) {

        if(playerSwitching){

            // delay loop
            playerSwitchingIterator ++;

                if(playerOneTurn){
                anim.showMessage("PLAYER 1 TURN");
                }
                else{
                anim.showMessage("PLAYER 2 TURN");
                }

            if(playerSwitchingIterator > 50){

                playerSwitchingIterator = 0;

                playerSwitching = false;

                if(playerOneTurn === true){
                playerOneTurn = false;
                }
                else{
                    playerOneTurn = true;
                }

             }
        }

        else  if (playerOneTurn) {


            if (player2.play(2) === true) {
                // make separate class for win 
                winState = true;
                multiPlayerOffline = false;
                player2.win = true;
                singlePlayerWin = false;
            }
        }
        else {
            if (player1.play(1) === true) {

                winState = true;
                multiPlayerOffline = false;
                player1.win = true;
                singlePlayerWin = false;

            }
        }

    }

    // back button  - common for both the players
    if (backButton1.insideButton()) {
        //check to see if the mouse is pressed
        if (!mouseIsPressed) {
            //if mouse is not pressed then light up button
            backButton1.lightUpButton();

        }
        if (mouseIsPressed) {
            //if mouse is pressed go to menu
            multiPlayerOffline = false;
            menu = true;
            createNewMultiplayerObject();
            player1.initializeGrid();
            player2.initializeGrid();
            mouseIsPressed = false;
            //mouseIsPressed = false;
        }
    }
};
