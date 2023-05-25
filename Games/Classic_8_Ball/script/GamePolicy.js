
function GamePolicy(){

    this.turn = 0;
    this.firstCollision = true;
    let player1TotalScore = new Score(new Vector2(Game.size.x/2 - 75,Game.size.y/2 - 45));
    let player2TotalScore = new Score(new Vector2(Game.size.x/2 + 75,Game.size.y/2 - 45));

    let player1MatchScore = new Score(new Vector2(Game.size.x/2 - 280,108));
    let player2MatchScore = new Score(new Vector2(Game.size.x/2 + 230,108));

    this.players = [new Player(player1MatchScore,player1TotalScore), new Player(player2MatchScore,player2TotalScore)];
    this.foul = false;
    this.scored = false;
    this.won = false;
    this.turnPlayed = false;
    this.validBallsInsertedOnTurn = 0;

    this.leftBorderX = BORDER_SIZE;
    this.rightBorderX = Game.size.x - BORDER_SIZE;
    this.topBorderY = BORDER_SIZE;
    this.bottomBorderY = Game.size.y - BORDER_SIZE;

    this.topCenterHolePos = new Vector2(750,32);
    this.bottomCenterHolePos = new Vector2(750,794);
    this.topLeftHolePos = new Vector2(62,62);
    this.topRightHolePos = new Vector2(1435,62);
    this.bottomLeftHolePos = new Vector2(62,762)
    this.bottomRightHolePos = new Vector2(1435,762);
}

GamePolicy.prototype.reset = function(){
    this.turn = 0;
    this.players[0].matchScore.value = 0;
    this.players[0].color = undefined;
    this.players[1].matchScore.value = 0;
    this.players[1].color = undefined;
    this.foul = false;
    this.scored = false;
    this.turnPlayed = false;
    this.won = false;
    this.firstCollision = true;
    this.validBallsInsertedOnTurn = 0;
}
GamePolicy.prototype.drawScores = function(){
    Canvas2D.drawText("PLAYER " + (this.turn+1), new Vector2(Game.size.x/2 + 40,200), new Vector2(150,0), "#096834", "top", "Impact", "70px");
    this.players[0].totalScore.draw();
    this.players[1].totalScore.draw();

    this.players[0].matchScore.drawLines(this.players[0].color);
    this.players[1].matchScore.drawLines(this.players[1].color);
}

GamePolicy.prototype.checkColisionValidity = function(ball1,ball2){

    let currentPlayerColor = this.players[this.turn].color;

    if(this.players[this.turn].matchScore.value == 7 &&
       (ball1.color == Color.black || ball2.color == Color.black)){
        this.firstCollision = false;
        return;
       }

    if(!this.firstCollision)
        return;

    if(currentPlayerColor == undefined){
        this.firstCollision = false;
        return;
    }

    if(ball1.color == Color.white){
        if(ball2.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }

    if(ball2.color == Color.white){
        if(ball1.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }
}
GamePolicy.prototype.handleBallInHole = function(ball){

    setTimeout(function(){ball.out();}, 100);

    let currentPlayer = this.players[this.turn];
    let secondPlayer = this.players[(this.turn+1)%2];

    if(currentPlayer.color == undefined){
        if(ball.color === Color.red){
            currentPlayer.color = Color.red;
            secondPlayer.color = Color.yellow;
        }
        else if(ball.color === Color.yellow){
            currentPlayer.color = Color.yellow;
            secondPlayer.color = Color.red;
        }
        else if(ball.color === Color.black){
            this.won = true; 
            this.foul = true;
        }
        else if(ball.color === Color.white){
            this.foul = true;
        }
    }

    if(currentPlayer.color === ball.color){
        currentPlayer.matchScore.increment();
        this.scored = true;
        this.validBallsInsertedOnTurn++;
    }
    else if(ball.color === Color.white){

        if(currentPlayer.color != undefined){
            this.foul = true;

            let ballsSet = Game.gameWorld.getBallsSetByColor(currentPlayer.color);

            let allBallsInHole = true;

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    allBallsInHole = false;
                }
            }

            if(allBallsInHole){
                this.won = true;
            }
        }
    }
    else if(ball.color === Color.black){

        if(currentPlayer.color != undefined){
            let ballsSet = Game.gameWorld.getBallsSetByColor(currentPlayer.color);

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    this.foul = true;
                }
            }
            
            this.won = true;
        }
    }
    else{
        secondPlayer.matchScore.increment();
        this.foul = true;
    }
}

GamePolicy.prototype.switchTurns = function(){
    this.turn++;
    this.turn%=2;
}

GamePolicy.prototype.updateTurnOutcome = function(){
    
    if(!this.turnPlayed){
        return;
    }

    if(this.firstCollision == true){
        this.foul = true;
    }

    if(this.won){
        
        if(!this.foul){
            this.players[this.turn].totalScore.increment();
            if(AI.finishedSession){
                this.reset()
                setTimeout(function(){Game.gameWorld.reset();
                }, 1000);
            }
        }
        else{
            this.players[(this.turn+1)%2].totalScore.increment();
            if(AI.finishedSession){
                this.reset();
                setTimeout(function(){Game.gameWorld.reset();
                }, 1000);
            }
        }
        return;
    }

    if(!this.scored || this.foul)
        this.switchTurns();

    this.scored = false;
    this.turnPlayed = false;
    this.firstCollision = true;
    this.validBallsInsertedOnTurn = 0;

    setTimeout(function(){Game.gameWorld.whiteBall.visible=true;}, 200);

    if(AI_ON && this.turn === AI_PLAYER_NUM && AI.finishedSession){
        AI.startSession();
    }
}

GamePolicy.prototype.handleFoul = function(){

    if(!Mouse.left.down){
        Game.gameWorld.whiteBall.position = Mouse.position;
    }

}
GamePolicy.prototype.isXOutsideLeftBorder = function(pos, origin){
    return (pos.x - origin.x) < this.leftBorderX;
}
GamePolicy.prototype.isXOutsideRightBorder = function(pos, origin){
    return (pos.x + origin.x) > this.rightBorderX;
}
GamePolicy.prototype.isYOutsideTopBorder = function(pos, origin){
    return (pos.y - origin.y) < this.topBorderY;
}
GamePolicy.prototype.isYOutsideBottomBorder = function(pos , origin){
    return (pos.y + origin.y) > this.bottomBorderY;
}

GamePolicy.prototype.isOutsideBorder = function(pos,origin){
    return this.isXOutsideLeftBorder(pos,origin) || this.isXOutsideRightBorder(pos,origin) || 
    this.isYOutsideTopBorder(pos, origin) || this.isYOutsideBottomBorder(pos , origin);
}

GamePolicy.prototype.isInsideTopLeftHole = function(pos){
    return this.topLeftHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopRightHole = function(pos){
    return this.topRightHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomLeftHole = function(pos){
    return this.bottomLeftHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomRightHole = function(pos){
    return this.bottomRightHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopCenterHole = function(pos){
    return this.topCenterHolePos.distanceFrom(pos) < (HOLE_RADIUS + 6);
}

GamePolicy.prototype.isInsideBottomCenterHole = function(pos){
    return this.bottomCenterHolePos.distanceFrom(pos) < (HOLE_RADIUS + 6);
}

GamePolicy.prototype.isInsideHole = function(pos){
    return this.isInsideTopLeftHole(pos) || this.isInsideTopRightHole(pos) || 
           this.isInsideBottomLeftHole(pos) || this.isInsideBottomRightHole(pos) ||
           this.isInsideTopCenterHole(pos) || this.isInsideBottomCenterHole(pos);
}

GamePolicy.prototype.initiateState = function(policyState){

    this.turn = policyState.turn;
    this.firstCollision = policyState.firstCollision;
    this.foul = policyState.foul;
    this.scored = policyState.scored;
    this.won = policyState.won;
    this.turnPlayed = policyState.turnPlayed;
    this.validBallsInsertedOnTurn = policyState.validBallsInsertedOnTurn;

    this.players[0].totalScore.value = policyState.players[0].totalScore.value;
    this.players[1].totalScore.value = policyState.players[1].totalScore.value;

    this.players[0].matchScore.value = policyState.players[0].matchScore.value;
    this.players[0].color = policyState.players[0].color;
    this.players[1].matchScore.value = policyState.players[1].matchScore.value;
    this.players[1].color = policyState.players[1].color;

}