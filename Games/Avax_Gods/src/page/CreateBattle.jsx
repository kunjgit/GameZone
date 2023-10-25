import React from "react";
import { PageHOC } from "../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";
import { CustomButton, CustomInput, GameLoad } from "../components";
const CreateBattle = () => {
  const navigate = useNavigate();
  const { contract, battleName, setBattleName, gameData } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  useEffect(() => {
    if(gameData?.activeBattle?.battleStatus===1)
    {
      navigate(`/battle/${gameData.activeBattle.name}`)
    }
    else if (gameData?.activeBattle?.battleStatus === 0) {
    setWaitBattle(true);
    }
  }, [gameData]);
  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;
    try {
      await contract.createBattle(battleName,{
        gasLimit:200000
      });
      setWaitBattle(true);
    } catch (error) {}
  };
  return (
    <>
      {waitBattle && <GameLoad></GameLoad>}
      <div className="flex flex-col mt-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restType="mt-6"
        />
      </div>
      <p
        className={`${styles.infoText} mt-4 hover:text-purple-900`}
        onClick={() => {
          navigate("/join-battle");
        }}
      >
        Or Join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create
    <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
);
