import React, { useState, useEffect } from "react";
import BlackoutSound from "./media/Sounds/powerdown.mp3";
import { connect } from "react-redux";
import Game from "./Game";

import StaticImage from "./media/Textures/Static-Cam.webp";
import StaticSound from "./media/Sounds/Dead.mp3";
import VictoryGIF from "./media/Textures/Victory.gif";
import VictorySound from "./media/Sounds/Clock.mp3";

///89000
const TIME_TO_CHANGE_HOUR = 89000;

let gameOverAudio = new Audio(StaticSound);
let hourInterval = null;

function Controller({
    isPlaying,
    hour,
    time,
    energy,
    jumpscare,
    setStart,
    dispatch,
    stages,
}) {
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);


    useEffect(() => {
        dispatch({ type: "CLEAR_DATA" });
        changeEnergy();

        return () => {
            // clearInterval(hourInterval);
            dispatch({ type: "CLEAR_DATA" });
            gameOverAudio.pause();
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (hour === 5 && !gameOver) endGame(true);
            else changeHour(hour);
        }, TIME_TO_CHANGE_HOUR);
    }, [hour])

    useEffect(() => {
        if (energy <= 0) {
            setBlackout();
        } else changeEnergy(energy);
    }, [energy]);

    async function changeHour(h) {
        if (isPlaying && !jumpscare && !gameOver && h < 6) {
            dispatch({ type: "CHANGE_HOUR" });
        }
    }

    async function changeEnergy(e) {
        if (isPlaying && !gameOver && e > 0) {
            setTimeout(() => {
                dispatch({ type: "CHANGE_ENERGY" });
            }, time);
        }
    }

    const setBlackout = () => {
        new Audio(BlackoutSound).play();

        dispatch({ type: "FORCE_CAMERA_CLOSE" });
        dispatch({ type: "CHANGE_CAMERA_BUTTON" });
    };

    const endGame = (hasWon) => {
        if (hasWon) {
            setVictory(true);
            let VictoryMusic = new Audio(VictorySound);
            VictoryMusic.play();

            const victories = JSON.parse(localStorage.getItem("victories")) || {};
            if(stages.mode !== "CUSTOM") victories[stages.mode] = "★"
            
            localStorage.setItem("victories", JSON.stringify(victories));
        } else {
            setGameOver(true);
            gameOverAudio.currentTime = 0;
            gameOverAudio.play();
        }
        dispatch({ type: "SET_GAME_OVER" });
        setTimeout(() => {
            setStart(false);
        }, 10000);
    };

    return (
        <>
            {gameOver ? (
                <img
                    alt="static"
                    src={StaticImage}
                    style={{ width: "100vw" }}
                />
            ) : null}
            {victory ? (
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img alt="victory" src={VictoryGIF} />
                </div>
            ) : null}
            <Game stages={stages} gameOver={gameOver || victory} endGame={endGame} />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        time: state.configReducer.time,
        hour: state.configReducer.hour,
        isPlaying: state.configReducer.isPlaying,
        jumpscare: state.configReducer.jumpscare,
        energy: state.configReducer.energy,
        animatronics: state.animatronicsReducer,
    };
};

export default connect(mapStateToProps)(Controller);
