var multiPlayerOnlineState = function () {

    // coming soon
    var backButton1 = new button("back", 400, 450);
    backButton1.draw();
    var connectButton = new button("connect", 600, 250);

    // draws 10*10 grid for player 1
    player1.drawGridActual();

    if (!player1.confirmButtonPushed) {

        player1AutoButton.draw();
    }

    // draws 10*10 grid for player 2
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

                if (player1.autoButtonPushed === true) {
                    // initializes grid for player 1 
                    player1.initializeGrid();
                    //createNewMultiplayerObject();
                }
                player1.arrangeShip();
                player1.autoButtonPushed = true;
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
                //shipArranged = true;
            }
        }
    }

    if (player1.confirmButtonPushed && player1.sendHtppRequest) {

        connectButton.draw();

        if (connectButton.insideButton()) {
            //check to see if the mouse is pressed
            if (!mouseIsPressed) {
                //if mouse is not pressed then light up button
                connectButton.lightUpButton();
            }
            if (mouseIsPressed) {

                //send http request
                // after receiving the request server creates new database with unique id 
                // then send the below ship coordinates to database
                /*
                // ship are arranged from smaller to bigger (ascending order)
                for(i=0 ; i<5 ; i++){
                player1.ship[i].begin.x;
                player1.ship[i].begin.y;
                player1.ship[i].end.x;
                player1.ship[i].end.y;
                }
                */
                // after receiving this info server implements match making by searching for an unpaired user and assigning both the users the same pairId
                // server also decides which player will start first
                player1.sendHtppRequest = false;
            }
        }
    }

    // after sending deployed ship coordinates , frontend begins listening to port (in this case web socket)
    if ((player1.sendHtppRequest === false) && (player1.startOnlineGame === false)) {

        // listen to port
        // frontend loads the other player ship coordinates from server from server
        /*
        // ship are arranged from smaller to bigger (ascending order)
        // assign other player ship coordinates received from server to the ship coordinates below

        for(i=0 ; i<5 ; i++){

        player2.ship[i].begin.x =  ;
        player2.ship[i].begin.y = ;
        player2.ship[i].end.x =  ;
        player2.ship[i].end.y =  ;
        }
        */
        // NOTE: // implement some condition here to execute below statement only if frontend successfully recieves the data in above mentioned comments inside this if loop
        // method call updates the received coordinates o the gridActual matrix
        //player2.DeployShipsReceivedFromServer();
        // frontend also loads if it is the first player from server
        // playerOneTurn = false; // if other player starts first
        // playerOneTurn = true;  // if current player starts first
        // implement some condition here to execute below statement only if frontend successfully recieves the data in above mentioned comments inside this if loop
        player1.startOnlineGame = true;

    }

    if (player1.startOnlineGame) {
        // if both players have deployed ships start the game
        // main multiplayer pass N play if statement
        if (player1.confirmButtonPushed) {

            if (playerOneTurn) {

                if (player2.play(2) === true) {
                    winState = true;
                    multiPlayerOnline = false;
                }

                // inside play method call on line number 547 and 573 write method call to send this.hitX and this.hitY to the server
            }
            else {
                // listen to hit coordinates of your opponent and assign them to variables below
                // listen to opponents hit coordinates 
                // player1.hitX= ;
                // player1.hitY= ;
                //player1.gridHidden[ hitX ][ hitY ] = 1;
            }

        }

        // draws opponents map on the screen
        player2.drawGridHidden();
        fill(255, 255, 255);
        textSize(80);
        text(" Coming soon ", 470, 250);

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
            multiPlayerOnline = false;
            menu = true;
            //createNewMultiplayerObject();
            player1.initializeGrid();
            player2.initializeGrid();
            //mouseIsPressed = false;
        }
    }
};
