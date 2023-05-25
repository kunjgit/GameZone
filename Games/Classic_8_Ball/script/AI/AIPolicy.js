function AIPolicy(){
    
}

AIPolicy.prototype.evaluate = function(state, gamePolicy){

    let evaluation = 1;

    for (var i = 0 ; i < state.balls.length; i++){
        for(var j = i + 1 ; j < state.balls.length ; j++){

            let firstBall = state.balls[i];
            let secondBall = state.balls[j];

            if(firstBall === state.whiteBall || secondBall === state.whiteBall 
                || 
                firstBall.inHole || secondBall.inHole){
                continue;
            }
            evaluation += firstBall.position.distanceFrom(secondBall.position);
        }
    }

    evaluation = evaluation/5800;

    if(!gamePolicy.firstCollision){
        evaluation+= 100;
    }

    evaluation += 2000 * gamePolicy.validBallsInsertedOnTurn;

    gamePolicy.updateTurnOutcome();


    if(gamePolicy.won){
        if(!gamePolicy.foul){
            evaluation += 10000;
        }
        else{
            evaluation -= 10000;
        }
    }

    if(gamePolicy.foul){
        evaluation = evaluation - 3000;
    }

    return evaluation;
}