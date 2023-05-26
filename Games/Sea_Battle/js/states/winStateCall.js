        
        const statisticsEnum = {
            row : {
              Player1: 0,
              Player2: 1,
              botPlayer: 2
            },
            col : {
              matchesWon : 0,
              matchesLost : 1,
              shipsDestroyed : 2,
              shipsLost : 3,
              avgTurnsToWin : 4,
              winPercentage : 5
            }
          };

function roundTo(num){

    return Math.round((num + Number.EPSILON)*100)/100;
}          

var winStateCall = function () {
    // background(0, 0, 0);
    fill(240, 218, 240);

    // display victory message too
    if (player1.win === true) {

        textSize(40);
        text("Player 1 Wins --- player 1 map !!! turns:- " + player1.turn, 400, 400, 400, 400);

        
        if (singlePlayerWin === true) {

            bot.drawGridActual();
            
            if(!statTableUpdated){

            // opponent loses match
              statTable[ statisticsEnum.row.botPlayer ][ statisticsEnum.col.matchesLost ] ++;

              // matches won by player
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] ++;

              // average turns to win
                statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin] += player1.turn;
                statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin] = roundTo( statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin]/ statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] );   
               
                // win percentage
                statTable[statisticsEnum.row.Player1][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost]) )*100 );
                statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesLost]) )*100 );
                // number of ships destroyed

                var numberOfShipsLost = 0;
                for(var i = 0; i < 5; i++){
                    if(player1.currLife[ i ] === 0){
                        numberOfShipsLost ++;
                    }
                }

                statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsDestroyed] += numberOfShipsLost;
                statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.shipsLost] += numberOfShipsLost;
                // number of ships lost

                statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsLost] += bot.countShipStatus("destroyed");
                statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.shipsDestroyed] += bot.countShipStatus("destroyed");
              statTableUpdated = true;              
            }  
        }
        else {

            player2.drawGridActual();

            if(!statTableUpdated){

                statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesLost] ++;

                statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] ++;

              // average turns to win
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin] += player1.turn;
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin] = roundTo(statTable[statisticsEnum.row.Player1][statisticsEnum.col.avgTurnsToWin]/ statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] );   
             
              // win percentage
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost]) )*100.0 );
              statTable[statisticsEnum.row.Player2][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesLost]) )*100.0 );
              // number of ships destroyed
              var numberOfShipsDestroyed = 0;
              for(var i = 0; i < 5; i++){
                  if(player2.currLife[ i ] === 0){
                      numberOfShipsDestroyed ++;
                  }
              }
              var numberOfShipsLost = 0;
              for(var i = 0; i < 5; i++){
                  if(player1.currLife[ i ] === 0){
                      numberOfShipsLost ++;
                  }
              }
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsDestroyed] += numberOfShipsLost;
              statTable[statisticsEnum.row.Player2][statisticsEnum.col.shipsLost] += numberOfShipsLost;
              // number of ships lost

              statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsLost] += numberOfShipsDestroyed;
              statTable[statisticsEnum.row.Player2][statisticsEnum.col.shipsDestroyed] += numberOfShipsDestroyed;
                statTableUpdated = true;                
            }
        }
    }
    else if (player2.win === true) {

        textSize(40);
        text("Player 2 Wins --- player 2 map !!! turns :- " + player2.turn, 400, 400, 400, 400);

        if(!statTableUpdated){
                
            statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] ++;
            statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost] ++;

            // average turns to win
            statTable[statisticsEnum.row.Player2][statisticsEnum.col.avgTurnsToWin] += player2.turn;
            statTable[statisticsEnum.row.Player2][statisticsEnum.col.avgTurnsToWin] = roundTo( statTable[statisticsEnum.row.Player2][statisticsEnum.col.avgTurnsToWin]/ statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] );   
            
            // win percentage
            statTable[statisticsEnum.row.Player2][statisticsEnum.col.winPercentage] = roundTo(  ( statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player2][statisticsEnum.col.matchesLost]) )*100.0 );
            statTable[statisticsEnum.row.Player1][statisticsEnum.col.winPercentage] = roundTo(  ( statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost]) )*100.0 );
            // number of ships destroyed
            var numberOfShipsDestroyed = 0;
            for(var i = 0; i < 5; i++){
                if(player1.currLife[ i ] === 0){
                    numberOfShipsDestroyed ++;
                }
            }
            var numberOfShipsLost = 0;
            for(var i = 0; i < 5; i++){
                if(player2.currLife[ i ] === 0){
                    numberOfShipsLost ++;
                }
            }

            statTable[statisticsEnum.row.Player2][statisticsEnum.col.shipsDestroyed] += numberOfShipsLost;
            statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsLost] += numberOfShipsLost;
            // number of ships lost

            statTable[statisticsEnum.row.Player2][statisticsEnum.col.shipsLost] += numberOfShipsDestroyed;
            statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsDestroyed] += numberOfShipsDestroyed;

            statTableUpdated = true;

        }
        player1.drawGridActual();
    }
    else {

        textSize(40);
        text("BOT Wins --- bot win !!! turns:-" + bot.turn, 400, 400, 400, 400);

        if(statTableUpdated === false){

            statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] ++;
            statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost] ++;

              // average turns to win
              statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.avgTurnsToWin] += bot.turn;
              statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.avgTurnsToWin] = roundTo( statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.avgTurnsToWin]/ statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] );   
             
              // win percentage
              statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.matchesLost]) )*100 );
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.winPercentage] = roundTo( ( statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] / (statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesWon] + statTable[statisticsEnum.row.Player1][statisticsEnum.col.matchesLost]) )*100 );
              // number of ships destroyed
              var numberOfShipsDestroyed = 0;
              for(var i = 0; i < 5; i++){
                  if(player1.currLife[ i ] === 0){
                      numberOfShipsDestroyed ++;
                  }
              }

              statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.shipsDestroyed] += bot.countShipStatus("lost");;
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsLost] += bot.countShipStatus("lost");;
              // number of ships lost

              statTable[statisticsEnum.row.botPlayer][statisticsEnum.col.shipsLost] += numberOfShipsDestroyed;
              statTable[statisticsEnum.row.Player1][statisticsEnum.col.shipsDestroyed] += numberOfShipsDestroyed;

            statTableUpdated = true;
        }

        player1.drawGridActual();
    }

    var backButton = new button("Menu", 150, 450);
    backButton.draw();

    if (backButton.insideButton()) {
        //check to see if the mouse is pressed
        if (!mouseIsPressed) {

            backButton.lightUpButton();
        }
        if (mouseIsPressed) {
            //if mouse is pressed go to menu
            winState = false;
            menu = true;
            statTableUpdated = false;

            singlePlayerWin = false;
            player1.initializeGrid();
            player2.initializeGrid();
            bot.initializeGrid();
	        createNewMultiplayerObject();
            createNewSinglePlayerObject();
        }
    }
};
