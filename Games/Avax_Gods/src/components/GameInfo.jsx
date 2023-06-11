import React from "react";
import styles from "../styles";
import { useState } from "react";
import CustomButton from "./CustomButton";
import { AlertIcon, alertIcon, gameRules } from "../assets";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
const GameInfo = () => {
  const { contract, gameData, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();
  const handleBattleExit = async () => {
    const battleName = gameData.activeBattle.name;
    try {
      await contract.quitBattle(battleName,{
        gasLimit:200000
      });
      setShowAlert({
        status: true,
        type: "info",
        message: `You are quitting the ${battleName}`,
      });
    } catch (error) {
      setErrorMessage(error);
    }
  };
  return (
    <>
      {" "}
      <div className={`${styles.gameInfoIconBox} `}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter} hover:bg-purple-800`}
          onClick={() => {
            setToggleSidebar(true);
          }}
        >
          <img
            src={alertIcon}
            alt="info"
            className={`${styles.gameInfoIconImg}`}
          />
        </div>
      </div>
      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose} hover:bg-purple-800`}
              onClick={() => {
                setToggleSidebar(false);
              }}
            >
              X
            </div>
          </div>
          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>
          <div cls="mt-3">
            {gameRules.map((rule, index) => (
              <p key={`game-rule-${index}`} className={styles.gameInfoText}>
                <span className="font-bold">{index + 1}</span>.{rule}
              </p>
            ))}
          </div>
        </div>
        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change Battleground"
            handleClick={() => {
              navigate("/battleground");
            }}
          ></CustomButton>
          <CustomButton
            title="Exit Battle"
            handleClick={handleBattleExit}
          ></CustomButton>
        </div>
      </div>
    </>
  );
};

export default GameInfo;
