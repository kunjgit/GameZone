var player = function (playerName, playeris) {

    // inherits objects/attributes from network class
    networkClass.call(this);
    // inherits objects/attributes from ship class
    shipClass.call(this);
    // can an if condition come inside constructor ??
    this.gridHidden = new Array(10);
    this.gridHidden[0] = new Array(10);
    this.gridHidden[1] = new Array(10);
    this.gridHidden[2] = new Array(10);
    this.gridHidden[3] = new Array(10);
    this.gridHidden[4] = new Array(10);
    this.gridHidden[5] = new Array(10);
    this.gridHidden[6] = new Array(10);
    this.gridHidden[7] = new Array(10);
    this.gridHidden[8] = new Array(10);
    this.gridHidden[9] = new Array(10);

    this.gridActual = new Array(10);
    this.gridActual[0] = new Array(10);
    this.gridActual[1] = new Array(10);
    this.gridActual[2] = new Array(10);
    this.gridActual[3] = new Array(10);
    this.gridActual[4] = new Array(10);
    this.gridActual[5] = new Array(10);
    this.gridActual[6] = new Array(10);
    this.gridActual[7] = new Array(10);
    this.gridActual[8] = new Array(10);
    this.gridActual[9] = new Array(10);

    this.currLife = [2, 3, 3, 4, 5];
    this.name = playerName;
    this.playerIs = playeris;
    this.turn = 0;
    this.shipArranged = false;
    this.autoButtonPushed = false;
    this.confirmButtonPushed = false;
    //   this.hitX;
    //  this.hitY;
    this.ship = [
        //patrolBoat : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //submarine  : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //destroyer  : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //battleship : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //aircraftCarrier : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    ];

};
// inherit methods from playClass o player class
//player.prototype = Object.create(playClass.prototype);
player.prototype.drawGridActual = function () {

    var i = 1, j = 1, indent = 0;

    //
    if (this.playerIs === 2) {
        indent = 700;
    }

    for (i = 0; i < this.shipName.length; i++) {

        for (j = 0; j < this.shipName[i].size; j++) {

            noFill();
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }
        for (j = 0; j < this.currLife[i]; j++) {

            fill(this.shipName[i].color.r, this.shipName[i].color.g, this.shipName[i].color.b);
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }
    }


    fill(64, 54, 255);
    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 10; j++) {

            fill(64, 54, 255);
            rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);

            // draws the ships on the map
            if (this.gridActual[i - 1][j - 1] > 0) {

                fill(this.shipName[this.gridActual[i - 1][j - 1] - 1].color.r, this.shipName[this.gridActual[i - 1][j - 1] - 1].color.g, this.shipName[this.gridActual[i - 1][j - 1] - 1].color.b);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 25, 25);
            }

            if(this.gridActual[i - 1][j - 1] === ISLAND){
                fill(255, 212, 128);
                rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
            }

        }
    }
};
player.prototype.drawGridHidden = function () {

    var i = 1, j = 1, indent = 0;

    
    fill(255, 255, 255);
    textSize(30);

    if (this.playerIs === 2) {

        indent = 700;

        text("Player 2", 160 + indent, 400, 200, 50);
    }
    else{

        text("Player 1", 160 + indent, 400, 200, 50);
    }


    textSize(20);
    text("turn : " + this.turn, 90 + indent, 10, 100, 20);


    for (i = 0; i < this.shipName.length; i++) {

        for (j = 0; j < this.shipName[i].size; j++) {

            noFill();
            if(this.currLife[i] > 0 && j < this.shipName[i].size){
                fill(this.shipName[i].color.r, this.shipName[i].color.g, this.shipName[i].color.b);  
            }
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }

    }


    fill(64, 54, 255);

    for (i = 1; i <= 10; i++) {

        for (j = 1; j <= 10; j++) {

            // block not yet hit
            //   if(this.gridHidden[i-1][j-1] === 0){

            fill(64, 54, 255);
            if(densityLens === false || this.playeris !== 2){

            if(this.gridHidden[i - 1][j - 1] === ISLAND){
                //sandy beach colour
                fill(255, 212, 128);
            }
    
            rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
               }
            // target hit inside the block
            if (this.gridHidden[i - 1][j - 1] > 0) {
                // red color
                fill(255, 56, 63);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 20, 20);
            }

            // missed inside block
            else if (this.gridHidden[i - 1][j - 1] === -1) {
                // yellow color
                fill(255, 255, 0);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 20, 20);
            }
        }
    }
    return 0;
};
player.prototype.arrangeShip = function () {

    // solve random function ceiling
    var size;
    var a, b, i, num, shipOverlapped = false;

    for (size = 5; size > 0; size--) {
        // put condition for overlap check !!!!!!!!!!!!!!!!!!!!!
        shipOverlapped = false;

        num = size;

        if (size === 1 || size === 2) {

            num++;

        }

        if (floor(random(0, 2))) { // horizontal arrangement trigger       

            while (1) {

                a = floor(random(0, 10));
                b = floor(random(0, 11 - num));

                for (i = 0; i < num; i++) {

                    if (this.gridActual[a][b + i] !== 0) {

                        shipOverlapped = true;

                        // break and search for a non-overlapping spot again 
                        break;
                    }
                }

                if (!shipOverlapped) {

                    // updates ships begin coordinate which will be sent to database
                    this.ship[size - 1].begin.x = a;
                    this.ship[size - 1].begin.y = b;

                    for (i = 0; i < num; i++) {

                        this.gridActual[a][b + i] = size; //  horizontal arrangement by random
                    }

                    // updates ships end coordinate which will be sent to database
                    this.ship[size - 1].end = a;
                    this.ship[size - 1].end = b + i;

                    break; // breaks from while loop as ship is arranged successfully
                }
                shipOverlapped = false;
            }

        }

        else {

            while (1) {

                b = floor(random(0, 10));
                a = floor(random(0, 11 - num));

                for (i = 0; i < num; i++) {

                    if (this.gridActual[a + i][b] !== 0) {

                        shipOverlapped = true;
                        // break from for loop if ship overlaps
                        break;
                    }


                }

                if (!shipOverlapped) {

                    // updates ships begin coordinate which will be sent to database
                    this.ship[size - 1].begin.x = a;
                    this.ship[size - 1].begin.x = b;

                    for (i = 0; i < num; i++) {

                        this.gridActual[a + i][b] = size; //  vertical arrangement by random

                    }
                    // updates ships end coordinate which will be sent to database
                    this.ship[size - 1].end = a + i;
                    this.ship[size - 1].end = b;

                    break;
                }
                shipOverlapped = false;

            }
        }

    }
    //  return 0;
};
player.prototype.initializeGrid = function () {
/*
    for(var i = 0; i < 10; i++){
        this.gridHidden[ i ] = new Array(10);
    }

    for(var i = 0; i < 10; i++){
        this.gridActual[ i ] = new Array(10);
    }
*/
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){

                this.gridHidden[ i ][ j ] = randomMap[i][j];
                this.gridActual[ i ][ j ] = randomMap[i][j];
        }
    }

    this.turn = 0;
    this.shipArranged = false;
    this.autoButtonPushed = false;
    this.confirmButtonPushed = false;

    this.currLife = [2, 3, 3, 4, 5];
    this.ship = [
        //patrolBoat : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //submarine  : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //destroyer  : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //battleship : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
        //aircraftCarrier : 
        { begin: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    ];

    this.sendHtppRequest = true;
    this.startOnlineGame = false;

};
player.prototype.checkShipLifeStatus = function () {

    if ((this.currLife[0] + this.currLife[1] + this.currLife[2] + this.currLife[3] + this.currLife[4]) === 0) {
        return true;
    }

    return false;

};
player.prototype.play = function (playerIs) {


    var indent = 0, i = 1, j = 1;


    // if all oponents ships have sunk declare victory
    if (this.checkShipLifeStatus() === true) {

        return true;
    }


    if (this.turn < 100) {
        // check for win condition in each turn
        if (playerIs === 2) {
            indent = 700;
        }

        // ensure player is not able to hit the same grid again
        for (i = 1; i <= 10; i++) {

            for (j = 1; j <= 10; j++) {

                if (mouseX > indent + 50 + 30 * i && mouseX < indent + 50 + 30 * (i + 1) && mouseY > 50 + 30 * j && mouseY < 50 + 30 * (j + 1)) {

                    if (!mouseIsPressed) {

                        fill(140, 184, 250, 200);
                        rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
                    }

                    if (mouseIsPressed) {
                        /*
                        fill(255, 0, 0);
                        rect(indent+50+25*i,5+25*j,25,25);
                        */
                        if ((this.gridActual[i - 1][j - 1] === 0) && (this.gridHidden[i - 1][j - 1] === 0)) {

                            this.turn++;
                            // this deletes water block at location
                            this.gridHidden[i - 1][j - 1] = -1;

                            this.hitX = i - 1;
                            this.hitY = j - 1;
                            //send your hit coordinates info to the server
                            // send player2.hitX and player2.hitY

                                playerSwitching = true;

                                if (this.checkShipLifeStatus() === true) {

                                    return true;
                                }   


                            // returns when shot misses
                            return 0;
                        }

                        else if ((this.gridActual[i - 1][j - 1] > 0) && (this.gridHidden[i - 1][j - 1] === 0)) {

                            // subtract ships life which is hit 
                            // mark as hit on hidden grid
                            this.gridHidden[i - 1][j - 1] = 1;
                            this.currLife[this.gridActual[i - 1][j - 1] - 1]--;

                            this.hitX = i - 1;
                            this.hitY = j - 1;
                            //send your hit coordinates info to the server
                            // send player2.hitX and player2.hitY
                            if (playerIs === 2) {

                                playerOneTurn = true;

                            }
                            else {
                                playerOneTurn = false;
                            }
                            return 0;
                        }

                        //player1.gridHidden[i-1][j-1]=-1;
                        mouseIsPressed = false;
                    }

                }

            }
        }
        // if above if statement dosnt return than extra shot 
    }
    return 0;
};
player.prototype.DeployShipsReceivedFromServer = function () {

    var i = 0, j = 0;

    for (i = 0; i < 5; i++) {
        // ship is arranged horizontally
        if (this.ship[i].beign.x === this.ship[i].end.x) {

            for (j = 0; j < this.shipName[i].size; j++) {

                this.gridActual[this.ship[i].begin.x][this.ship[i].begin.y + j] = 1;
            }
        }

        //ship is arranged vertically
        else {
            for (j = 0; j < this.shipName[i].size; j++) {

                this.gridActual[this.ship[i].begin.x + j][this.ship[i].begin.y] = 1;
            }

        }
    }
};
