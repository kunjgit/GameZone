import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles";
import { Alert, GameInfo, PlayerInfo, Card, ActionButton } from "../components";
import { useGlobalContext } from "../context";
import {
  attack,
  attackSound,
  battlegrounds,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02,
  player02 as player02Icon,
} from "../assets";
import { playAudio } from "../utils/animation";
const Battle = () => {
  const navigate = useNavigate();
  const {
    contract,
    gameData,
    walletAddress,
    showAlert,
    setShowAlert,
    battleGround,
    updateGameData,
    setErrorMessage,
    player1Ref,
    player2Ref,
  } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();
  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;

        if (
          gameData.activeBattle.players[0].toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
        }

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const Player01 = await contract.getPlayer(player01Address);
        const Player02 = await contract.getPlayer(player02Address);
        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = Player01.playerHealth.toNumber();
        const p1M = Player01.playerMana.toNumber();
        const p2H = Player02.playerHealth.toNumber();
        const p2M = Player02.playerMana.toNumber();
        setPlayer1({
          ...Player01,
          att: p1Att,
          def: p1Def,
          health: p1H,
          Mana: p1M,
        });
        setPlayer2({
          ...Player02,
          att: "X",
          def: "X",
          health: p2H,
          Mana: p2M,
        });
      } catch (error) {
        setErrorMessage(error);
      }
    };
    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName]);
  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);
    try {
      await contract.attackOrDefendChoice(choice, battleName,{
        gasLimit:200000
      });
      setShowAlert({
        status: true,
        type: "info",
        message: `initiating ${choice === 1 ? "attack" : "defense"}`,
      });
    } catch (error) {
      setErrorMessage(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) {
        navigate("/");
      }
    }, [2000]);
    return ()=> clearTimeout(timer);
  }, []);
  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}
    >
      {showAlert.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />
      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card
          card={player2}
          title={player2?.playerName}
          cardRef={player2Ref}
          playerTwo
        ></Card>
        <div className="flex items-center flex-row">
          <ActionButton
            imgUrl={attack}
            handleClick={() => {
              makeAMove(1);
            }}
            restStyles="mr-2 hover:border-yellow-400"
          ></ActionButton>
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-3"
          ></Card>
          <ActionButton
            imgUrl={defense}
            handleClick={() => {
              makeAMove(2);
            }}
            restStyles="ml-6 hover:border-red-600"
          ></ActionButton>
        </div>
      </div>
      <div>
        <PlayerInfo player={player1} playerIcon={player01Icon} />
        <GameInfo />
      </div>
    </div>
  );
};

export default Battle;
