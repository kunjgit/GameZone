// Initialize player scores and dice arrays
let player1Score=[];
let player2Score=[];
let player1Dice=[];
let player2Dice=[];
let rollCount=0;
let roundCount=0;
let onlyPossibleRow="blank";
let jokerCard=false;
let isPlayerOneTurn=true;

// Transform values for dice animation
let transformValues=[
[0,30],[-5,40],[0,35],[5,40],[0,30]
];

// DOM element references
const player1Container=document.getElementById("player1Container");
const player2Container=document.getElementById("player2Container");
const diceElements=document.querySelectorAll(".dice");
const rollButton = document.getElementById("roll");
const scoreTableCells=document.querySelectorAll(".cell");

// Add event listener to the roll button
rollButton.addEventListener("click",rollDice);

// Sound effect for rolling dice
let rollSound=new Audio("/assets/audio/Yahtzee_roll.wav");
function rollDice() {
  rollCount++;
  let diceArr=[1,2,3,4,5];
  let randomDice=[];

// Generate random values for each die
  for (let i=0;i<diceArr.length;i++) {
    randomDice.push(Math.floor(Math.random()*6)+1);
  }
  const playArea=document.getElementById("playArea");
  const diceContainer=document.getElementById("player1Container");
  let numDice=diceContainer.children.length;
  let counter=0;
  diceElements.forEach(function(diceElement,index){
    if(diceElement.classList.contains("active")|| rollCount==1){
      resetDicePositions();
      const x = transformValues[index][0];
      const y = transformValues[index][1];

      setTimeout(function(){
        counter++;
        changeDiePosition(diceElement,x,y);
        changeDiceFaces(randomDice);
      
        if(counter==1) {
          if (isPlayerOneTurn) writeTempValuesInScoreTable(player1Dice);
          else writeTempValuesInScoreTable(player2Dice);
       }
        if(rollCount==3){
          rollButton.disabled=true;
          rollButton.style.opacity=0.5;
        }
        rollSound.play();
      },500);
    }
  });

}
function resetDicePositions(){
  diceElements.forEach(function(diceElement){
    diceElement.style.transform="none";
  })
}
function changeDiePosition(diceElement,x,y){
  let angle=135*Math.floor(Math.random()*10);
  let diceRollDirection = -1;
  if(!isPlayerOneTurn) diceRollDirection=1;
  angle=135*Math.floor(Math.random()*10);
  diceElement.style.transform=
  "translateX("+
  x+"vw) translateY("+diceRollDirection*y+
  "vh) rotate(" + angle + "deg)";
}
function changeDiceFaces(randomDice) {
  for (let i=0; i < diceElements.length;i++) {
    if(rollCount ===1) diceElements[i].classList.add("active");
    if(diceElements[i].classList.contains("active")) {
      if(isPlayerOneTurn) player1Dice[i]=randomDice[i];
      else player2Dice[i]=randomDice[i];

      let face = diceElements[i].getElementsByClassName("face")[0];
      face.src="/assets/images/Yahtzee_dice"+randomDice[i]+".png";
    }
  }
}
function resetDiceFaces() {
  for (let i=0;i<diceElements.length;i++){
    let face = diceElements[i].getElementsByClassName("face")[0];
    diceElements[i].classList.remove("active");
    let diceNumber=i+1;
    face.src="/assets/images/Yahtzee_dice"+diceNumber+".png";
  }
}

// Toggle dice active state on click
diceElements.forEach(function(diceElement,index){
  diceElement.addEventListener("click",function(){
    if(rollCount==0) return;
    diceElement.classList.toggle("active");
    if(!diceElement.classList.contains("active")){
      diceElement.style.transform="none";      
    }
    else {
      const diceNumber=diceElement.id.charAt(3);
      const x = transformValues[diceNumber-1][0];
      const y = transformValues[diceNumber-1][1];
      changeDiePosition(diceElement,x,y);

    }
  })
})
function writeTempValuesInScoreTable(dice) {
  let scoreTable = [];
  scoreTable = player1Score.slice();
  let playerNumber = 1;
  if (!isPlayerOneTurn) {
    scoreTable = [];
    playerNumber = 2;
    scoreTable = player2Score.slice();
  }
  jokerCard=false;
  onlyPossibleRow="blank";
  let yahtzeeScore=calculateYahtzee(dice);
  const yahtzeeElement=document.getElementById("yahtzee"+playerNumber);
  if(scoreTable[12]===undefined){
    yahtzeeElement.innerHTML=yahtzeeScore;
  } else if(yahtzeeScore>0 && scoreTable[12]) {
    yahtzeeScore=parseInt(yahtzeeElement.innerHTML)+100;
    yahtzeeElement.innerHTML=yahtzeeScore;
  }
  
// Handle Yahtzee with Joker rule
  if(yahtzeeScore>0 && scoreTable[dice[0]-1]!=undefined && scoreTable[12]!==undefined){
    jokerCard=true;
  }
  if(yahtzeeScore>0 && scoreTable[dice[0]-1]==undefined && scoreTable[12]!==undefined){
    onlyPossibleRow=dice[0];
    writeTempValueOnOnlyPossibleRaw(dice,playerNumber);
    return;
  }
  //------------------------------------------------------------
  if (scoreTable[0] === undefined) {
    let onesScore = calculateOnes(dice);
    document.getElementById("ones" + playerNumber).innerHTML = onesScore;
  }
  if (scoreTable[1] === undefined) {
    let twosScore = calculateTwos(dice);
    document.getElementById("twos" + playerNumber).innerHTML = twosScore;
  }
  if (scoreTable[2] === undefined) {
    let threesScore = calculateThrees(dice);
    document.getElementById("threes" + playerNumber).innerHTML = threesScore;
  }
  if (scoreTable[3] === undefined) {
    let foursScore = calculateFours(dice);
    document.getElementById("fours" + playerNumber).innerHTML = foursScore;
  }
  if (scoreTable[4] === undefined) {
    let fivesScore = calculateFives(dice);
    document.getElementById("fives" + playerNumber).innerHTML = fivesScore;
  }
  if (scoreTable[5] === undefined) {
    let sixesScore = calculateSixes(dice);
    document.getElementById("sixes" + playerNumber).innerHTML = sixesScore;
  }
  if (scoreTable[6] === undefined) {
    let threeOfAKindScore = calculateThreeOfAKind(dice);
    document.getElementById("threeOfAKind" + playerNumber).innerHTML =
      threeOfAKindScore;
  }
  if (scoreTable[7] === undefined) {
    let fourOfAKindScore = calculateFourOfAKind(dice);
    document.getElementById("fourOfAKind" + playerNumber).innerHTML =
      fourOfAKindScore;
  }
  if (scoreTable[8] === undefined) {
    let fullHouseScore = calculateFullHouse(dice);
    document.getElementById("fullHouse" + playerNumber).innerHTML =
      fullHouseScore;
  }
  if (scoreTable[9] === undefined) {
    let smallStraightScore = jokerCard ? 30: calculateSmallStraight(dice);
    document.getElementById("smallStraight" + playerNumber).innerHTML =
      smallStraightScore;
  }
  if (scoreTable[10] === undefined) {
    let largeStraightScore = jokerCard ? 40 : calculateLargeStraight(dice);
    document.getElementById("largeStraight" + playerNumber).innerHTML =
      largeStraightScore;
  }
  if (scoreTable[11] === undefined) {
    let chanceScore = calculateChance(dice);
    document.getElementById("chance" + playerNumber).innerHTML = chanceScore;
  }
}

function writeTempValueOnOnlyPossibleRaw(dice,playerNumber) {
  if(dice[0]==1) {
    let score=calculateOnes(dice);
    document.getElementById("ones"+playerNumber).innerHTML=score;
  }
  if(dice[0]==2) {
    let score=calculateTwos(dice);
    document.getElementById("twos"+playerNumber).innerHTML=score;
  }
  if(dice[0]==3) {
    let score=calculateThrees(dice);
    document.getElementById("threes"+playerNumber).innerHTML=score;
  }
  if(dice[0]==4) {
    let score=calculateFours(dice);
    document.getElementById("fours"+playerNumber).innerHTML=score;
  }
  if(dice[0]==5) {
    let score=calculateFives(dice);
    document.getElementById("fives"+playerNumber).innerHTML=score;
  }
  if(dice[0]==6) {
    let score=calculateSixes(dice);
    document.getElementById("sixes"+playerNumber).innerHTML=score;
  }
}

scoreTableCells.forEach(function(cell){
  cell.addEventListener("click",onCellClick);
});
function onCellClick(){
  let row=this.getAttribute("data-row");
  let column=this.getAttribute("data-column");
  if(
    rollCount==0 ||
    row===null ||(onlyPossibleRow!="blank" && row!=onlyPossibleRow)
  ) return;
  if(isPlayerOneTurn && column==1){
    player1Score[row-1]=parseInt(this.innerHTML);
    let upperSectionScore1=calculateUpperSection(player1Score);
    let bonusScore1=upperSectionScore1>63 ? 35 : 0;
    let lowerSectionScore1=calculateLowerSectionScore(player1Score);
    let totalScore1=upperSectionScore1+lowerSectionScore1+bonusScore1;
    sum1.innerHTML=upperSectionScore1;
    bonus1.innerHTML=bonusScore1;
    total1.innerHTML=totalScore1;
    this.removeEventListener("click",onCellClick);
    this.style.color="white";
    sum1.style.color="white";
    bonus1.style.color="white";
    total1.style.color="white";
    changeTurn();
  }
  if(!isPlayerOneTurn && column==2){
    player2Score[row-1]=parseInt(this.innerHTML);
    let upperSectionScore2=calculateUpperSection(player2Score);
    let bonusScore2=upperSectionScore2>63 ? 35 : 0;
    let lowerSectionScore2=calculateLowerSectionScore(player2Score);
    let totalScore2=upperSectionScore2+lowerSectionScore2+bonusScore2;
    sum2.innerHTML=upperSectionScore2;
    bonus2.innerHTML=bonusScore2;
    total2.innerHTML=totalScore2;
    this.removeEventListener("click",onCellClick);
    this.style.color="white";
    sum2.style.color="white";
    bonus2.style.color="white";
    total2.style.color="white";
    changeTurn();
  }
}

function changeTurn(){
  roundCount++;
  updateScoreTable();
  resetDiceFaces();
  isPlayerOneTurn=!isPlayerOneTurn;
  rollCount=0;
  if(isPlayerOneTurn){
    const player2ContainerDice=player2Container.querySelectorAll(".dice");
    player2ContainerDice.forEach((diceElement)=> {
      diceElement.style.transform="none";
      player2Container.removeChild(diceElement);
      player1Container.appendChild(diceElement);
    });
  }else {
    const player1ContainerDice=player1Container.querySelectorAll(".dice");
    player1ContainerDice.forEach((diceElement)=> {
      diceElement.style.transform="none";
      player1Container.removeChild(diceElement);
      player2Container.appendChild(diceElement);
    });
}
  if(roundCount==26)  {
    calculateEndGameScore();
    return;
  }
  rollButton.disabled=false;
  rollButton.style.opacity=1;
}
function updateScoreTable(){
  let scoreTable=[];
  scoreTable=player1Score.slice();
  let column =1 ;
  if(!isPlayerOneTurn) {
    scoreTable=[];
    scoreTable=player2Score.slice();
    column=2;
  }
  let scoreCells=document.querySelectorAll('[data-column="'+column+'"]');
  for (let i=0;i<scoreCells.length;i++) {
    if(scoreTable[i]===undefined) {
      scoreCells[i].innerHTML="";
    }
  }
}

function calculateEndGameScore() {
  let player1Total=parseInt(document.getElementById("total1").innerHTML);
  let player2Total=parseInt(document.getElementById("total2").innerHTML);
  const endGameMessage=player1Total==player2Total ? "Draw" : player1Total>player2Total ? "Player 1 Wins" : "Player 2 Wins";
  document.getElementById("endGameMessage").innerHTML=endGameMessage;
  rollButton.disabled=true;
  rollButton.style.opacity=0.5;

}






//--------------------------------------------------------------
function calculateOnes(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===1) {
      score+=1;
    }
  }
  return score;
}
function calculateTwos(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===2) {
      score+=2;
    }
  }
  return score;
}
function calculateThrees(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===3) {
      score+=3;
    }
  }
  return score;
}
function calculateFours(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===4) {
      score+=4;
    }
  }
  return score;
}
function calculateFives(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===5) {
      score+=5;
    }
  }
  return score;
}
function calculateSixes(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){
    if(dice[i]===6) {
      score+=6;
    }
  }
  return score;
}
function calculateChance(dice) {
  let score=0;
  for (let i=0;i<dice.length;i++){ 
      score+=dice[i];
  }
  return score;
}
function calculateYahtzee(dice) {
  let firstDie=dice[0];
  let score=50;
  for (let i=0;i<dice.length;i++){
    if(dice[i]!==firstDie) {
      score=0;
    }
  }
  return score;
}

function calculateThreeOfAKind(dice) {
  let score=0;
  for(let i=0;i<dice.length;i++){
    let count=1;
    for(let j=0;j<dice.length;j++) {
      if(j!==i && dice[i]===dice[j]){
        count++;
      }
    }
    if(count>=3) {
      score=dice.reduce((acc,val)=>acc+val);
      break;
    }
  }
  return score;
}
function calculateFourOfAKind(dice) {
  let score=0;
  for(let i=0;i<dice.length;i++){
    let count=1;
    for(let j=0;j<dice.length;j++) {
      if(j!==i && dice[i]===dice[j]){
        count++;
      }
    }
    if(count>=4) {
      score=dice.reduce((acc,val)=>acc+val);
      break;
    }
  }
  return score;
}
function calculateFullHouse(dice) {
  let score=0;
  let diceCopy=dice.slice();
  diceCopy.sort();
  if(
    (diceCopy[0]==diceCopy[1] &&
      diceCopy[1]==diceCopy[2] &&
      diceCopy[3]==diceCopy[4]   
      ) ||
        (diceCopy[0]==diceCopy[1] &&
          diceCopy[2]==diceCopy[3] &&
          diceCopy[3]==diceCopy[4]   
          )     
  ) {
    score=25;
    return score;
  }
  return score;
}
function calculateSmallStraight(dice) {
  let score=0;
  let diceCopy=[...new Set(dice)];
  diceCopy.sort();
  if(
    (diceCopy[1]==diceCopy[0]+1 &&
      diceCopy[2]==diceCopy[1]+1 &&
      diceCopy[3]==diceCopy[2] +1  
      ) ||
        (diceCopy[2]==diceCopy[1]+1 &&
          diceCopy[3]==diceCopy[2]+1 &&
          diceCopy[4]==diceCopy[3] +1  
          )     
  ) {
    score=30;
  }
  return score;
}
function calculateLargeStraight(dice) {
  let score=0;
  let diceCopy=[...new Set(dice)];
  diceCopy.sort();
  if(
    (diceCopy[1]==diceCopy[0]+1 &&
      diceCopy[2]==diceCopy[1]+1 &&
      diceCopy[3]==diceCopy[2] +1 &&
      diceCopy[4]==diceCopy[3] +1
      )  
  ) {
    score=40;
  }
  return score;
}
function calculateUpperSection(playerScore){
  let score=0;
  let ones=playerScore[0]==undefined ? 0 : playerScore[0];
  let twos=playerScore[1]==undefined ? 0 : playerScore[1];
  let threes=playerScore[2]==undefined ? 0 : playerScore[2];
  let fours=playerScore[3]==undefined ? 0 : playerScore[3];
  let fives=playerScore[4]==undefined ? 0 : playerScore[4];
  let sixes=playerScore[5]==undefined ? 0 : playerScore[5];
  score=ones+twos+threes+fours+fives+sixes;
  return score;
}
function calculateLowerSectionScore(playerScore){
  let lowerSectionScore=0;
  let threeOfAKind=playerScore[6]===undefined ? 0 : playerScore[6];
  let fourOfAKind=playerScore[7]===undefined ? 0 : playerScore[7];
  let fullHouse=playerScore[8]===undefined ? 0 : playerScore[8];
  let smallStraight=playerScore[9]===undefined ? 0 : playerScore[9];
  let largeStraight=playerScore[10]===undefined ? 0 : playerScore[10];
  let chance=playerScore[11]===undefined ? 0 : playerScore[11];
  let yahtzee=playerScore[12]===undefined ? 0 : playerScore[12];
  if(yahtzee>0) {
    playerNumber=isPlayerOneTurn ? 1 : 2;
    yahtzee=parseInt(document.getElementById("yahtzee"+playerNumber).innerHTML);
  }
  lowerSectionScore=threeOfAKind+fourOfAKind+fullHouse+smallStraight+largeStraight
  + chance+yahtzee;
  return lowerSectionScore;
}



















































