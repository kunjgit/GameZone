import React, { useState, useEffect } from "react";
import Functions from "./Functions";
import Media from "./Media";
import { connect } from "react-redux";

let FreddyIterator = Functions.Freddy();
let BonnieIterator = Functions.Bonnie();
let ChicaIterator = Functions.Chica();
let FoxyIterator = Functions.Foxy();

FreddyIterator.next();

let FreddyTime = 10000;
let BonnieTime = 5000;
let ChicaTime = 7300;
let FoxyTime = 13000;

const ranges = {
  Freddy: 1,
  Bonnie: 1,
  Chica: 2,
  Foxy: 1,
}

let isBlackout = false;
let isGameOver = false;

function Animatronic({
  animatronics,
  config,
  handleJumpscare,
  isThisDoorOpen,
  dispatch,
  stages
}) {
  const { hour, gameOver, blackout } = config;

  useEffect(() => {
    ranges["Freddy"] = stages.Freddy;
    ranges["Bonnie"] = stages.Bonnie;
    ranges["Chica"] = stages.Chica;
    ranges["Foxy"] = stages.Foxy;

    if(stages.Bonnie) willMove("Bonnie", BonnieIterator, BonnieTime);
    if(stages.Chica) willMove("Chica", ChicaIterator, ChicaTime);
    if(stages.Foxy) willMove("Foxy", FoxyIterator, FoxyTime, true);
    if(stages.Freddy && stages.Chica && stages.Bonnie)willMove("Freddy", FreddyIterator, FreddyTime, true);

    return () => {
      FreddyIterator = Functions.Freddy();
      BonnieIterator = Functions.Bonnie();
      ChicaIterator = Functions.Chica();
      FoxyIterator = Functions.Foxy();

      FreddyIterator.next();

      FreddyTime = 10000;
      BonnieTime = 5000;
      ChicaTime = 7300;
      FoxyTime = 13000;
      ranges["Freddy"] = stages.Freddy;
      ranges["Bonnie"] = stages.Bonnie;
      ranges["Chica"] = stages.Chica;
      ranges["Foxy"] = stages.Foxy;

      isBlackout = false;
      isGameOver = false;
    };
  }, []);

  useEffect(() => {
    if (hour === 2) {
      FreddyTime = 9500;
      BonnieTime = 4700;
      ChicaTime = 6800;
      FoxyTime = 10000;

      
      ranges["Bonnie"] = ranges["Bonnie"] + 1;
      ranges["Chica"] = ranges["Chica"] + 1;
    } else if (hour === 4) {
      ranges["Bonnie"] = ranges["Bonnie"] + 2;
      ranges["Chica"] = ranges["Chica"] + 2;
      ranges["Freddy"] = ranges["Freddy"] + 1;
      ranges["Foxy"] = ranges["Foxy"] + 1;
    } else if (hour === 5) {
      ranges["Bonnie"] = ranges["Bonnie"] + 2;
      ranges["Chica"] = ranges["Chica"] + 2;
      ranges["Freddy"] = ranges["Freddy"] + 2;
      ranges["Foxy"] = ranges["Foxy"] + 2;
    }
  }, [hour]);

  useEffect(() => {
    if (gameOver) isGameOver = gameOver;
  }, [gameOver]);

  const changeAnimatronic = (func) => {
    dispatch({ type: "CHANGE_ANIMATRONICS_MOVING", content: true });

    func();

    setTimeout(() => {
      dispatch({
        type: "CHANGE_ANIMATRONICS_MOVING",
        content: false,
      });
    }, 1500);
  };

  const animatronicFailed = (character) => {
    changeAnimatronic(() => {
      dispatch({
        type: "CHANGE_ANIMATRONIC",
        animatronic: character,
        animatronicState: {
          door: false,
          camera:
            character === "Freddy"
              ? "Stage"
              : character === "Foxy"
              ? ""
              : "Dinning Area",
          jumpscare: false,
        },
      });

      if (character === "Bonnie") {
        BonnieIterator = Functions.Bonnie();
        willMove("Bonnie", BonnieIterator, BonnieTime);
      } else if (character === "Chica") {
        ChicaIterator = Functions.Chica();
        willMove("Chica", ChicaIterator, ChicaTime);
      } else if (character === "Foxy") {
        FoxyIterator = Functions.Foxy();
        Media.Sounds.FoxyPunch.play();
        willMove("Foxy", FoxyIterator, FoxyTime, true);
      } else if (character === "Freddy") {
        FreddyIterator = Functions.Freddy();
        FreddyIterator.next();
        willMove("Freddy", FreddyIterator, FreddyTime, true);
      }
    });
  };

  const freddyLaugh = () => {
    if (isBlackout) return;
    let FreddyNumber = Math.floor(Math.random() * 2);
    if (FreddyNumber == 0) {
      Media.Sounds.FreddyLaugh1.play();
    } else {
      Media.Sounds.FreddyLaugh2.play();
    }
  };
  useEffect(() => {
    if (blackout) isBlackout = true;
  }, [blackout]);

  function willMove (character, iterator, animaTime) {
    const thisInterval = setInterval(() => {
      const max = character === "Bonnie" || character === "Chica" ? 22 : 30;
      let luckyNumber = Math.floor(Math.random() * max);

      let condition = luckyNumber < ranges[character] && !animatronics[character].door;

      let newPlace;
      if (condition) {
        changeAnimatronic(() => {
          newPlace = iterator.next().value;

          const newState = {
            door: newPlace === "Door" || newPlace === "_3",
            jumpscare: false,
            camera: newPlace,
          };
          dispatch({
            type: "CHANGE_ANIMATRONIC",
            animatronic: character,
            animatronicState: newState,
          });
        });

        if (character === "Freddy") freddyLaugh();
      }

      if (isBlackout || isGameOver) clearInterval(thisInterval);

      if (newPlace === "Door" || newPlace === "_3") {
        if (!isBlackout) checkDoors(character);
        clearInterval(thisInterval);
      }
    }, animaTime);
  };

  async function checkDoors(character) {
    const door =
      character === "Bonnie" || character === "Foxy" ? "leftDoor" : "rightDoor";

    setTimeout(async () => {
      const isDoorOpen = await isThisDoorOpen(door);
      if (!isDoorOpen) {
        setTimeout(async () => {
          const isDoorOpen = await isThisDoorOpen(door);
          if (!isDoorOpen) {
            setTimeout(async () => {
              const isDoorOpen = await isThisDoorOpen(door);
              if (!isDoorOpen) {
                handleJumpscare(character);
              } else animatronicFailed(character);
            }, 3000);
          } else animatronicFailed(character);
        }, 5000);
      } else animatronicFailed(character);
    }, 10000);
  }

  return <></>;
}

const mapStateToProps = (state) => {
  return {
    leftDoor: state.officeReducer.leftDoor,
    rightDoor: state.officeReducer.rightDoor,
    animatronics: state.animatronicsReducer,
    config: state.configReducer,
  };
};

export default connect(mapStateToProps)(Animatronic);
