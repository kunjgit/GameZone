
import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import "./style.css"
import Confetti from "react-confetti"

export default function App() {
  
  const [audio] = React.useState(new Audio('http://streaming.tdiradio.com:8000/house.mp3'));

  // const playSound = () => {
  //   audio.play();
  // };

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [noOfRol, setNoOfRol] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(parseInt(localStorage.getItem('bestTime')) || Infinity );


  const times = [];


  const [timeElapsed, setTimeElapsed] = React.useState(0);
  let timer = 0;

  React.useEffect(() => {
    // Code to start the timer and update the timeElapsed state
    timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    if (tenzies) {
      if (timeElapsed < bestTime) {
        setBestTime(timeElapsed);
        localStorage.setItem('bestTime', timeElapsed.toString());
      }
      clearInterval(timer);
      // console.log("you win !!");
    }

    return () => {
      if (timeElapsed < bestTime && tenzies) {
        setBestTime(timeElapsed);
        localStorage.setItem("best", JSON.stringify(bestTime));

      }
      clearInterval(timer); // Cleanup the interval when the component unmounts
    };
  }, [timeElapsed]);

  React.useEffect(() => {
    let check1 = true;
    let check2 = true;
    for (let i = 0; i < 10; i++) {
      if (dice[i].isHeld === false) {
        check1 = false;
        break;
      }
    }
    let value1 = dice[0].value;
    for (let i = 0; i < 10; i++) {
      if (dice[i].value !== value1) {
        check2 = false;
        break;
      }
    }
    if (check1 && check2) {
      setTenzies(true);
      clearInterval(timer);
      // console.log("you win !!");
    }
    if (tenzies) {
      if (timeElapsed < bestTime) {
        setBestTime(timeElapsed);
        localStorage.setItem("best", JSON.stringify(bestTime));

        times.push(timeElapsed);
        console.log("array length is", times.length);
      }
    }
  }, [dice]);



  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      const num = Math.ceil(Math.random() * 6);
      newDice.push({
        value: num,
        isHeld: false,
        id: nanoid()
      });
    }
    return newDice;
  }

  function holdDice(id) {
    console.log(id);
    const newDices = [];
    for (let i = 0; i < 10; i++) {
      if (dice[i].id === id) {
        // setDice(dice[i].isHeld = !dice[i].isHeld)
        newDices.push({
          // value: dice[i].value,
          // id: dice[i].id
          ...dice[i],
          isHeld: !dice[i].isHeld,
        })
        // dice[i].isHeld = !dice[i].isHeld;
        console.log(dice[i].isHeld);
      }
      else {
        newDices.push({
          ...dice[i]
        })
      }
    }
    setDice(newDices);

  }
  // holdDice(dice);

  function rollDice() {
    audio.play();
    if (!tenzies) {
      const ans = [];
      for (let i = 0; i < dice.length; i++) {
        if (dice[i].isHeld) {
          ans.push({ ...dice[i] });
        }
        else {
          ans.push({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
          })
        }
      }
      setNoOfRol(pre => pre + 1);
      // noOfRol = 5;
      setDice(ans);

    }
    else {
      setDice(allNewDice());
      setTenzies(false);
      setNoOfRol(0);
      setTimeElapsed(0);
      clearInterval(timer);
    }

  }
  // console.log(allNewDice());

  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} id={die.id} holdDice={holdDice} />);
  let show = false;
  if (times.length > 0) {
    show = true;
  }

  const numericalSort = (a, b) => a - b;
  const sortedTime = times.sort(numericalSort);

  console.log("times", times.length);


  return (
    <main>
      {/* <button onClick={playSound}>Play Sound</button> */}
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies !</h1>
      <p className="instructions">Roll untill all dice are the same. Click each die to freeze it at its current value between rolls.</p>

      <div className="extra">
        <div className="noOfRolls">
          Number of rolls :
          <span> {noOfRol}</span>
        </div>
        <div>Best time : {bestTime === Infinity ? 'N/A' : `${bestTime} seconds`}</div>
        <div className="timegone">Time Elapsed: {timeElapsed} seconds</div>
      </div>



      <div className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
    </main>
  )
}
