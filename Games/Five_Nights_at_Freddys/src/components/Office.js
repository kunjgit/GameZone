import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Default from "../media/Textures/Office/Default.webp";
import Media from "./Media";

import Blackout from "../media/Textures/Office/304.webp";
import MusicBox from "../media/Sounds/music box.mp3";
import FreddyBlackout from "../media/Textures/Freddy.webp";

import JumpscareMP3 from "../media/Sounds/jumpscare.mp3";
import BonnieJumpscare from "../media/Textures/Bonnie-Jumpscare.webp";
import ChicaJumpscare from "../media/Textures/Chica-Jumpscare.webp";
import FreddyJumpscare1 from "../media/Textures/Freddy-Jumpscare1.gif";
import FreddyJumpscare2 from "../media/Textures/Freddy-Jumpscare.webp";
import FoxyJumpscare from "../media/Textures/Foxy-Jumpscare.gif";

import LD from "../media/Textures/Office/LD.webp";
import RD from "../media/Textures/Office/RD.webp";
import RD_LD from "../media/Textures/Office/RD_LD.webp";
import LD_RL from "../media/Textures/Office/LD_RL.webp";
import RD_LL from "../media/Textures/Office/RD_LL.webp";

import RD_LL_BONNIE from "../media/Textures/Office/RD_LL_BONNIE.webp";
import LD_RL_CHICA from "../media/Textures/Office/LD_RL_CHICA.webp";
import RL from "../media/Textures/Office/RL.webp";

import RL_LL_BONNIE from "../media/Textures/Office/RL_LL_BONNIE.webp";
import LL from "../media/Textures/Office/LL.webp";
import LL_BONNIE from "../media/Textures/Office/LL_BONNIE.webp";
import RL_LL from "../media/Textures/Office/RL_LL.webp";
import RL_CHICA from "../media/Textures/Office/RL_CHICA.webp";
import RL_LL_CHICA from "../media/Textures/Office/RL_LL_CHICA.webp";
import RL_LL_BONNIE_CHICA from "../media/Textures/Office/RL_LL_BONNIE_CHICA.webp";

let canJumpscare = true;

const officeImages = {
  LD,
  RD,
  RD_LD,
  LD_RL,
  RD_LL,
  RD_LL_BONNIE,
  LD_RL_CHICA,
  RL,
  RL_LL_BONNIE,
  LL,
  LL_BONNIE,
  RL_CHICA,
  RL_LL,
  RL_LL_CHICA,
  RL_LL_BONNIE_CHICA,
};

let musicBox = new Audio(MusicBox);
let jumpscareSound = new Audio(JumpscareMP3);
musicBox.loop = "true";

function Office({
  blackout,
  animatronics,
  officeConfig,
  jumpscare,
  isCameraOpen,
  endGame,
  dispatch,
}) {
  const [isJumpscare, setIsJumpscare] = useState(null);
  const [background, setBackground] = useState(Default);
  const [blackoutBackground, setBlackoutBackground] = useState(Blackout);

  useEffect(() => {
    checkBackground();
  }, [
    officeConfig.leftDoor,
    officeConfig.leftLight,
    officeConfig.rightDoor,
    officeConfig.rightLight,
  ]);

  useEffect(() => {
    if (isCameraOpen) return;
    checkBackground();

    if (jumpscare) {
      dispatch({ type: "CHANGE_CAMERA_BUTTON" });
      setIsJumpscare(jumpscare);
      jumpscareSound.play();
      setTimeout(() => {
        endGame(false);
      }, 5000);
    }
  }, [isCameraOpen]);

  useEffect(() => {
    if (animatronics.Foxy.jumpscare) {
      dispatch({ type: "CHANGE_CAMERA_BUTTON" });
      setIsJumpscare("Foxy");
      jumpscareSound.play();
      setTimeout(() => {
        endGame(false);
      }, 5000);
    }
  }, [animatronics.Foxy.jumpscare]);

  useEffect(() => {
    if (animatronics.Freddy.jumpscare) {
      dispatch({ type: "CHANGE_CAMERA_BUTTON" });
      setIsJumpscare("Freddy");
      jumpscareSound.play();
      setTimeout(() => {
        endGame(false);
      }, 5000);
    }
  }, [animatronics.Freddy.jumpscare]);

  async function checkBackground() {
    const { leftDoor, rightDoor, leftLight, rightLight } = officeConfig;
    const { Bonnie, Chica } = animatronics;

    function getBackground() {
      const result = [];

      if (rightDoor) result.push("RD");
      if (leftDoor) result.push("LD");

      if (rightLight && !rightDoor) result.push("RL");
      if (leftLight && !leftDoor) result.push("LL");
      if (Bonnie.door && leftLight) result.push("BONNIE");
      if (Chica.door && rightLight) result.push("CHICA");

      return result;
    }

    const result = await getBackground();
    if (result.length === 0) setBackground(Default);
    else setBackground(officeImages[result.join("_")]);
  }

  const checkDoorSounds = (light) => {
    const { leftDoor, rightDoor } = officeConfig;
    const { Bonnie, Chica } = animatronics;

    let condition1 = light === "leftLight" && !leftDoor && Bonnie.door;
    let condition2 = light === "rightLight" && !rightDoor && Chica.door;

    if (condition1 || condition2) Media.Sounds.Surprise.play();
  };

  useEffect(() => {
    if (blackout) FreddyJumpscare();
  }, [blackout]);

  useEffect(() => {
    canJumpscare = true;
    return () => {
      canJumpscare = false;
      musicBox.pause();
    };
  }, []);

  const FreddyJumpscare = () => {
    const musicBoxInterval = setInterval(() => {
      let musicBoxNumber = Math.floor(Math.random() * 9);
      if (!canJumpscare) clearInterval(musicBoxInterval);
      if (musicBoxNumber < 3 && canJumpscare) {
        musicBox.currentTime = 0;
        musicBox.play();
        setBlackoutBackground(FreddyBlackout);
        clearInterval(musicBoxInterval);

        const pauseMusicInterval = setInterval(() => {
          let pauseNumber = Math.floor(Math.random() * 3);
          if (!canJumpscare) clearInterval(pauseMusicInterval);
          if (pauseNumber == 0 && canJumpscare) {
            setBlackoutBackground(null);
            musicBox.pause();
            clearInterval(pauseMusicInterval);

            const freddyInterval = setInterval(() => {
              let freddyNumber = Math.floor(Math.random() * 9);
              if (!canJumpscare) clearInterval(freddyInterval);
              if (freddyNumber == 0 && canJumpscare) {
                const JumpscareImage = FreddyJumpscare1;
                setBlackoutBackground(JumpscareImage);
                jumpscareSound.play();
                dispatch({
                  type: "CHANGE_JUMPSCARE",
                  animatronic: true,
                });
                clearInterval(freddyInterval);
                setTimeout(() => {
                  endGame(false);
                  setBlackoutBackground(Blackout);
                }, 5000);
              }
            }, 3000);
          }
        }, 5000);
      }
    }, 3000);
  };

  if (isJumpscare === "Bonnie" && !isCameraOpen)
    return (
      <div className="office-container">
        <img
          alt="Office"
          draggable="false"
          style={{ width: "100vw" }}
          src={BonnieJumpscare}
          className="office-img"
          useMap="#office"
        />
      </div>
    );
  else if (isJumpscare === "Foxy")
    return (
      <div className="office-container">
        <img
          alt="Office"
          draggable="false"
          style={{ width: "100vw" }}
          src={FoxyJumpscare}
          className="office-img"
          useMap="#office"
        />
      </div>
    );
  else if (isJumpscare === "Freddy")
    return (
      <div className="office-container">
        <img
          alt="Office"
          draggable="false"
          style={{ width: "100vw" }}
          src={FreddyJumpscare2}
          className="office-img"
          useMap="#office"
        />
      </div>
    );
  else if (isJumpscare === "Chica" && !isCameraOpen)
    return (
      <div className="office-container">
        <img
          alt="Office"
          draggable="false"
          style={{ width: "100vw" }}
          src={ChicaJumpscare}
          className="office-img"
          useMap="#office"
        />
      </div>
    );

  return (
    <>
      {!blackout ? (
        <div className="office-container">
          <div style={{ width: "fit-content" }}>
            <img
              alt="Office"
              draggable="false"
              style={{ width: "100vw" }}
              src={background}
              className="office-img"
              useMap="#office"
            />
            <a
              href=""
              title="leftDoor"
              style={{
                position: "absolute",
                left: "1.63%",
                top: "46.53%",
                width: "3.13%",
                height: "10.56%",
                zIndex: 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "CHANGE_OFFICE_CONFIG",
                  obj: "leftDoor",
                });
                checkBackground();
                Media.Sounds.Door.play();
              }}
            ></a>
            <a
              href=""
              title="leftLight"
              style={{
                position: "absolute",
                left: "1.75%",
                top: "58.06%",
                width: "3.13%",
                height: "10.56%",
                zIndex: 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "CHANGE_OFFICE_CONFIG",
                  obj: "leftLight",
                });
                checkBackground();
                checkDoorSounds("leftLight");
              }}
            ></a>

            <a
              href=""
              title="rightDoor"
              style={{
                position: "absolute",
                left: "94.25%",
                top: "46.94%",
                width: "3.13%",
                height: "10.56%",
                zIndex: 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "CHANGE_OFFICE_CONFIG",
                  obj: "rightDoor",
                });
                checkBackground();
                Media.Sounds.Door.play();
              }}
            ></a>

            <a
              href=""
              title="rightLight"
              style={{
                position: "absolute",
                left: "94.44%",
                top: "58.47%",
                width: "3.13%",
                height: "10.56%",
                zIndex: 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "CHANGE_OFFICE_CONFIG",
                  obj: "rightLight",
                });
                checkBackground();
                checkDoorSounds("rightLight");
              }}
            ></a>
          </div>
        </div>
      ) : (
        <div className="office-container">
          <img
            alt="Office"
            draggable="false"
            style={{ width: "100vw" }}
            src={blackoutBackground}
            className="office-img"
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    officeConfig: state.officeReducer,
    animatronics: state.animatronicsReducer,
    isCameraOpen: state.cameraReducer.isCameraOpen,
    jumpscare: state.configReducer.jumpscare,
  };
};

export default connect(mapStateToProps)(Office);
