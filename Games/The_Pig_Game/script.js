'use strict';
// Selecting elements 

const Player_1=document.querySelector('.player_1');
const Player_2=document.querySelector('.player_2');
const score1=document.querySelector('#score-1');
const score2=document.querySelector('#score-2');
const current_score_1=document.querySelector('#plyr-1')
const current_score_2=document.querySelector('#plyr-2')
const dice_element=document.querySelector('.dice');


let Dice_Score=0;                       //to calculate die resultant sum
let Player_num=1;                    // to track which player is rolling th die
let Sum_score=[0,0,0];           // to store the sum of the dice resultant
let playing=true;                     // To ensure game is finished or not


//  Initialising score with value zero at start and making the dice hidden

score1.textContent = 0;
score2.textContent = 0;
dice_element.classList.add('hide');

// Selecting the buttons
const roll_button=document.querySelector('.btn_roll');
const hold_button=document.querySelector('.btn_hold');  
const new_button=document.querySelector('.btn_new');

//  Providing dice the functionalities

roll_button.addEventListener('click', function () {

if(playing){
const roll_num=Math.trunc(Math.random()*6)+1;  


dice_element.classList.remove('hide');
dice_element.src=`Images/${roll_num}.png`;

if(roll_num!==1)
{

 Dice_Score+=roll_num;
document.querySelector(`#plyr-${Player_num}`).textContent=Dice_Score;
   
}else{

    // Switching the player
document.querySelector(`#plyr-${Player_num}`).textContent=0;
Dice_Score=0;
Player_num=Player_num===1?2:1;
Player_1.classList.toggle('player_active');   
Player_2.classList.toggle('player_active');
}}

});

//  Hold button Functionalities

hold_button.addEventListener('click', function(){

if(playing){ Sum_score[Player_num]+=  Dice_Score;

document.querySelector(`#score-${Player_num}`).textContent=Sum_score[Player_num];

if(Sum_score[Player_num]>=100){   // checking for winning condition
    playing=false;
    document.querySelector(`.player_${Player_num}`).classList.add('player--winner');
    document.querySelector(`.player_${Player_num}`).classList.add('player_active');
    dice_element.classList.add('hide');
    document.querySelector(`#name--${Player_num}`).textContent=`Player ${Player_num} wins🏆`;

}
else{
    //switching player
document.querySelector(`#plyr-${Player_num}`).textContent=0;
Dice_Score=0;
Player_num=Player_num===1?2:1;
Player_1.classList.toggle('player_active');
Player_2.classList.toggle('player_active');}
}});

//  adding functionalities to new button 
new_button.addEventListener('click', function(){

    Sum_score=[0,0,0];
    Dice_Score=0;
    Player_num=1;
    playing=true;
    score1.textContent = 0;
    score2.textContent = 0;
    current_score_1.textContent=0;
    current_score_2.textContent=0;
    dice_element.classList.add('hide');
    Player_1.classList.remove('player--winner');
    Player_2.classList.remove('player--winner');
    Player_1.classList.add('player_active');
    Player_2.classList.remove('player_active');
    document.querySelector(`#name--1`).textContent=`Player 1`;
    document.querySelector(`#name--2`).textContent=`Player 2`;
    
    });



