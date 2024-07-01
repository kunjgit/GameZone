import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { CustomButton } from "../components";
import { PageHOC } from "../components";
import styles from "../styles";
const JoinBattle = () => {
  const { contract, walletAddress, gameData, setShowAlert, setBattleName } =
    useGlobalContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus===1)
      navigate(`/battle/${gameData.activeBattle.name}`);
  }, [gameData]);
  const handleClick = async (battleName) => {
    setBattleName(battleName);
    try {
      await contract.joinBattle(battleName,{
        gasLimit:200000
      });
      setShowAlert({status:true,type:'success',message:`joining ${battleName}`})
    } catch (error) {
      setErrorMessage(error);
    }
  };
  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>
      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="join"
                  handleClick={() => {
                    handleClick(battle.name);
                  }}
                ></CustomButton>
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>
            Reload the page to see new battles
          </p>
        )}
      </div>
      <p
        className={`${styles.infoText} hover:text-purple-900`}
        onClick={() => {
          navigate("/create-battle");
        }}
      >
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join
    <br />a Battle
  </>,
  <>Join already existing battles</>
);
