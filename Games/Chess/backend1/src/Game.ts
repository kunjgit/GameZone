// interface Game{
//     id:number;
//     name:string;
//     players1:WebSocket;
//     players2:WebSocket;
// }

import { WebSocket } from "ws";
import {Chess} from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board:Chess;
    private startTime:Date;
    private moveCount=0;


    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color :"white"
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color :"black"
            }
        }));

    }

    makeMove(socket:WebSocket,move:{
        from : string;
        to : string;
    })
    
    {
        console.log(move);
        //Validation of the type of move useing zod
        //Is it this users move?

        if(this.moveCount%2===0 && socket!== this.player1)
        {
            return;
        }
        if(this.moveCount%2===1 && socket!== this.player2)
        {
            return;
        }

        //Is the move valid
        //Update the board
        //Push the move

        try{
            this.board.move(move);
        }
        catch(e){
            console.log(e);
            return;
        }
        


        //Check if the game is over
        if(this.board.isGameOver()){
            //Send this to both the players
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn() ==="w"?"black":"white"
                }
            }))
            return;
        }

        //Send the updated board to both players

        if(this.moveCount%2===0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        this.moveCount++;

    }
}