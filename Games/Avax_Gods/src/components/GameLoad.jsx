import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context";
import { player01, player02 } from "../assets";
import styles from "../styles";
const GameLoad = () => {
  const { walletAddress } = useGlobalContext();
  const navigate = useNavigate();
  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
      <div className={styles.gameLoadBtnBox}>
        <CustomButton
          title="Choose Battleground"
          handleClick={() => {
            navigate("/battleground");
          }}
          restType="mt-6"
        ></CustomButton>
      </div>
      <div className={`flex-1 ${styles.flexCenter} flex-col`}>
        <h1 className={`${styles.headText} text-center`}>
          Waiting for a<br />
          worthy opponent....
        </h1>
        <p className={styles.gameLoadText}>
          Pro tip: While you're waiting, choose your preferred battleground
        </p>
        <div className={styles.gameLoadPlayersBox}>
          <div className={`${styles.flexCenter} flex-col`}>
            <img src={player01} className={styles.gameLoadPlayerImg}></img>
            <p className={styles.gameLoadPlayerText}>
              {`${walletAddress.slice(0, 8)}.......${walletAddress.slice(35)}`}
            </p>
          </div>

          <h2 className={styles.gameLoadVS}>VS</h2>

          <div className={`${styles.flexCenter} flex-col`}>
            <img src={player02} className={styles.gameLoadPlayerImg}></img>
            <p className={styles.gameLoadPlayerText}>
              {"???????????"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoad;
