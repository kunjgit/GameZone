const score= {
    wins:0,
    loses:0,
    tie:0
};
// const jsonobj=JSON.stringify(score);
// console.log(JSON.parse(jsonobj))
updateScores();
let isAutoPlaying=false;
let id;

function autoPlay(){
    if(! isAutoPlaying){
        id=setInterval(function (){
        const playerMove=compGen;
        play(playerMove);
        },2000);
        isAutoPlaying=true;
    
    } else{
        clearInterval(id);
        isAutoPlaying=false;

    }

}
let compGen = '';
let res = '';
function play(playerMove) {
    if (playerMove === 'scissors') {

        game();
        if (compGen === 'stone') {
            res = 'You Lose';
        } else if (compGen === 'paper') {
            res = 'You Won';
        } else {
            res = 'TIE';
        }
    } else if (playerMove === 'paper') {
        game();
        if (compGen === 'stone') {
            res = 'You Won';
        } else if (compGen === 'paper') {
            res = 'TIE';
        } else {
            res = 'You Lose';
        }

    } else {
        game();
        if (compGen === 'stone') {
            res = 'TIE';
        } else if (compGen === 'paper') {
            res = 'You Lose';
        } else {
            res = 'You Won';
        }


    }
    if(res==='You Won'){
        score.wins++;
    }else if(res==='You Lose'){
        score.loses++;
    }else{
        score.tie++;
    }
    // localStorage('name','jsonobj');
    updateScores();
    document.querySelector('.result').innerHTML=res;
    document.querySelector('.moves').innerHTML=
    `You chose : <img src=./assets/${playerMove}-emoji.png class='img'> Computer chose : <img src=./assets/${compGen}-emoji.png class='img'>`;


    // alert(`You chose ${playerMove}. Computer selects ${compGen}.${res}Wins : ${score.wins}. Loses : ${score.loses}. Ties : ${score.tie}`);
}
function updateScores(){
    document.querySelector('.scores').innerHTML=`Wins : ${score.wins}. Loses : ${score.loses}. Ties : ${score.tie}`;
}
function game() {
    const randomNumberComp = Math.random();
    if ((randomNumberComp >= 0) && (randomNumberComp < 1 / 3)) {
        compGen = 'stone';

    } else if ((randomNumberComp >= 1 / 3) && (randomNumberComp < 2 / 3)) {
        compGen = 'paper';

    } else {
        compGen = 'scissors';
    }
    return compGen;

}
function change(){
    const name=document.querySelector('.but5');
    if(name.innerHTML==='Auto Play'){
        name.innerHTML='Stop Play';
    }else{
        name.innerHTML='Auto Play';
    }
}