import React from 'react';
import styles from "./css/CustomNight.module.css"

import Freddy from "./media/Textures/CustomNight/freddy.png";
import Bonnie from "./media/Textures/CustomNight/bonnie.png";
import Chica from "./media/Textures/CustomNight/chica.png";
import Foxy from "./media/Textures/CustomNight/foxy.png";

import goldenFreddyJumpscare from "./media/Sounds/golden_freddy.ogg";

const images = {
    Freddy,
    Bonnie,
    Chica,
    Foxy
}

const AnimatronicContainer = (props) => {
    const {range, changeRange, character} = props;

    return (
        <div className={styles.animatronic}>
            <img
                alt="Five Nights At Freddy's"
                src={images[character]}
                title={character}
                
            />
            
            <div className={styles.range_buttons}>
                <button onClick={() => {changeRange(-1, character)}} disabled={range === 0}> {"<"} </button>
                <span> {range} </span>
                <button onClick={() => {changeRange(+1, character)}} disabled={range === 20}> {">"} </button>
            </div>
        </div>
    )
};

const CustomNight = ({state, setStart}) => {
    const [goldenFreddy, setGoldenFreddy] = React.useState(false);
    const changeMode = (value) => {

        let animatronics = {};

        switch(value) {
            case "EASY": 
                animatronics = {Bonnie: 2, Freddy: 2, Chica: 2, Foxy: 2};
                break;
            case "NORMAL": 
                animatronics = {Bonnie: 10, Freddy: 10, Chica: 10, Foxy: 10};
                break;
            case "HARD": 
                animatronics = {Bonnie: 15, Freddy: 15, Chica: 15, Foxy: 15};
                break;
            case "IMPOSSIBLE":
                animatronics = {Bonnie: 20, Freddy: 20, Chica: 20, Foxy: 20};
                break;
            default: 
                return;
        }

        state.setStages((stages) => ({...animatronics, mode: value}));
    };

    const changeRange = (value, character) => {
        const handleValue = (state, value) => 
            (state === 0 && value < 0) || (state === 20 && value > 0) ? state : state + value
        

        state.setStages((stages) => ({...stages, mode: "CUSTOM", [character]: handleValue(stages[character], value)}));
    }

    const hasWon = (mode) => {
        const victories = JSON.parse(localStorage.getItem("victories")) || {};

        return victories[mode] || " ";
    }
    
    const handleStart = () => {
        if (
            state.ranges.Freddy === 1 &&
            state.ranges.Bonnie === 9 &&
            state.ranges.Chica === 8 &&
            state.ranges.Foxy === 7
        ) {
            const golden = new Audio(goldenFreddyJumpscare);
            golden.play();
            return setGoldenFreddy(true);
        }
        setStart(true);
    }

    if(goldenFreddy) return <GoldenFreddy setGoldenFreddy={setGoldenFreddy} />;

    return (
        <div className={styles.custom_night_container}>

                <a href="#" target="_blank" className={styles.github_icon}>
                    <img src="https://icon-library.com/images/github-icon-white/github-icon-white-6.jpg" width="50" height="50" />
                </a>
            
            <h1>{"Five Nights at Freddy's Web"}</h1>

        <div className={styles.animatronics_container}>
            <AnimatronicContainer character={"Freddy"} range={state.ranges.Freddy} {...{changeRange}} />
            <AnimatronicContainer character={"Bonnie"} range={state.ranges.Bonnie} {...{changeRange}} />
            <AnimatronicContainer character={"Chica"} range={state.ranges.Chica} {...{changeRange}} />
            <AnimatronicContainer character={"Foxy"} range={state.ranges.Foxy} {...{changeRange}} />
        </div>
            
            
            <div className={styles.start_screen} style={{margin: "2% auto 1% auto"}}>
                <button className={styles.ready_button} onClick={handleStart}>
                    READY {"▶"}
                </button>
            </div>

            <div className={styles.start_screen}>
                <button onClick={() => {
                    changeMode("EASY")
                }} data-selected={state.ranges.mode === "EASY"}>
                    EASY {hasWon("EASY")}
                </button>
                <button onClick={() => {
                    changeMode("NORMAL")
                }} data-selected={state.ranges.mode === "NORMAL"}>
                    NORMAL {hasWon("NORMAL")}
                </button>
                <button onClick={() => {
                    changeMode("HARD")
                }} data-selected={state.ranges.mode === "HARD"}>
                    HARD {hasWon("HARD")}
                </button>
                <button onClick={() => {
                    changeMode("IMPOSSIBLE")
                }} data-selected={state.ranges.mode === "IMPOSSIBLE"}>
                    IMPOSSIBLE {hasWon("IMPOSSIBLE")}
                </button>
            </div>

            <footer className={styles.footer}>
                <p>Made by Wendell de Sousa | 2021 </p>
                {/* <p>Five Nights at Freddy's © Scott Cawthon</p> */}
            </footer>
        </div>
    )
}; 

export default CustomNight;

function GoldenFreddy({setGoldenFreddy}) {
    React.useEffect(() => {
        setTimeout(() => {
            window.open("about:blank", "_self");
            window.close();
            setGoldenFreddy(false);
        }, 5000);
    }, [])

    return <div className={styles.golden_freddy} />
}