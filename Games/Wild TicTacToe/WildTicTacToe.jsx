import React, { useState } from 'react';
import './WildTicTacToe.css';
import oImage from '../Assets/o.png';
import xImage from '../Assets/x.png';

let opt1 = "Pressed";
let opt2 = "Option";

const WildTicTacToe = () => {
    let message = '';

    const [option, setOption] = useState(1);

    const setTo1 = () => {
        setOption(1);
        opt1 = "Pressed";
        opt2 = "Option"
    }

    const setTo2 = () => {
        setOption(2);
        opt2 = "Pressed";
        opt1 = "Option";
    }



    const [game, setGame] = useState(false);
    const [grid, setGrid] = useState([
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ]);

    const [count, setCount] = useState(0);

    if (count === 25 && game === false)
        message = "It's a tie!";

    if (game){
        message = "Game!";
    }

    const handleButtonClick = (rowIndex, colIndex, option) => {
        if (grid[rowIndex][colIndex] === '' && option === 2 && game === false) {
            const newGrid = [...grid];
            newGrid[rowIndex][colIndex] = '2';
            setGrid(newGrid);
            setCount(count + 1);
        } else if (grid[rowIndex][colIndex] === '' && option === 1 && game === false) {
            const newGrid = [...grid];
            newGrid[rowIndex][colIndex] = '1';
            setGrid(newGrid);
            setCount(count + 1);
        }
    };

    const startOver = () => {
        const newGrid = [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];
        setGrid(newGrid);
        setCount(1);
        setGame(false);
    };

    const checkWin = (rowIndex, colIndex, option) => {
        let c = 0;
        let hold;
        if (option === 1)
            hold = '1';
        else
            hold = '2';
    
        for (let i = 0; i < 5; ++i) {
            if (grid[rowIndex][i] !== hold) {
                c = 0;
                continue;
            }
            else if (grid[rowIndex][i] === hold){
                ++c;
            }

            if (c === 3)
                    break;
        }

        if (c === 3) {
            setGame(true);
            return;
        }
        else{
            c = 0;
        }

        for (let i = 0; i < 5; ++i) {
            if (grid[i][colIndex] !== hold) {
                c = 0;
                continue;
            }
            else if (grid[i][colIndex] === hold){
                ++c;

                if (c === 3)
                    break;
            }
        }
        if (c === 3) {
            setGame(true);
            return;
        }
        else{
            c = 0;
        }

        if (rowIndex === 0 && colIndex < 3) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex + 1] &&  grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex + 2]) {
                setGame(true);
                return;
            }
            
        }
        if (rowIndex === 0 && colIndex > 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex -1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex-2]) {
                setGame(true);
                return;
            }
            
        }

        if (rowIndex === 0 && colIndex === 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex -1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex-2]) {
                setGame(true);
                return;
            }

            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex +1] && grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex+2]) {
                setGame(true);
                return;
            }
            
        }

        if (colIndex === 0 && rowIndex === 1) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex +1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex +2]) {
                setGame(true);
                return;
            }

        }

        if (colIndex === 0 && rowIndex === 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex +1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex +2]) {
                setGame(true);
                return;
            }

            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex +1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex +2]) {
                setGame(true);
                return;
            }

        }

        if (colIndex === 0 && rowIndex === 3) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex +1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex +2]) {
                setGame(true);
                return;
            }
        }

        if (rowIndex === 4 && colIndex < 3) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex +1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex +2]) {
                setGame(true);
                return;
            }

        }

        if (rowIndex === 4 && colIndex > 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex - 2]) {
                setGame(true);
                return;
            }

        }

        if (rowIndex === 4 && colIndex === 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex - 2]) {
                setGame(true);
                return;
            }

            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex + 1] &&grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex + 2]) {
                setGame(true);
                return;
            }

        }

        if (colIndex === 4 && rowIndex === 1) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex - 2]) {
                setGame(true);
                return;
            }
        }

        if (colIndex === 4 && rowIndex === 2) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex - 2]) {
                setGame(true);
                return;
            }

            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex  - 2][colIndex - 2]) {
                setGame(true);
                return;
            }
        }

        if (colIndex === 4 && rowIndex === 3) {
            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] &&grid[rowIndex][colIndex] === grid[rowIndex  - 2][colIndex - 2]) {
                setGame(true);
                return;
            }
        }
        
        if (rowIndex !== 0 && rowIndex !== 4 && colIndex !== 0 && colIndex !== 4) {
            if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex - 1] && grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex + 1]) {
                setGame(true);
                return;
            }
            
            if (colIndex - 2 >= 0 && rowIndex + 2 <= 4) {
                if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex - 1] && grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex -2]) {
                    setGame(true);
                    return;
                }
            }
            
            if (colIndex + 2 <= 4 && rowIndex - 2 >= 0) {
                if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex + 1] && grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex +2]) {
                    setGame(true);
                    return;
                }
            }

            if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] && grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex + 1]) {
                setGame(true);
                return;
            }
            
            if (colIndex + 2 <= 4 && rowIndex + 2 <= 4) {
                if (grid[rowIndex][colIndex] === grid[rowIndex + 1][colIndex + 1] && grid[rowIndex][colIndex] === grid[rowIndex + 2][colIndex + 2]) {
                    setGame(true);
                    return;
                }
            }
            
            if (colIndex - 2 >= 0 && rowIndex - 2 >= 0) {
                if (grid[rowIndex][colIndex] === grid[rowIndex - 1][colIndex - 1] && grid[rowIndex][colIndex] === grid[rowIndex - 2][colIndex - 2]) {
                    setGame(true);
                    return;
                }
            }
        }
       
    }

    return (
        <div>
            <h1 className="Title">Wild Tic-Tac-Toe </h1>
            <p class="SP">Select Option</p>
            
            <div className="grid-container">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((col, colIndex) => (
                            <button
                                key={colIndex}
                                className="grid-button"
                                onClick={() => {handleButtonClick(rowIndex, colIndex, option)
                                    checkWin(rowIndex, colIndex, option)
                                }}
                            >
                                {grid[rowIndex][colIndex] === '1' && 
                                    <img className="image" src={xImage} alt="X" />
                                }
                                {grid[rowIndex][colIndex] === '2' && 
                                    <img className="image" src={oImage} alt="O" />
                                }

                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <div className="cont2">
                    <button class={opt1} onClick={() => setTo1()} >
                        X
                    </button>
                    <button class={opt2} onClick ={() => setTo2()}>
                        O
                    </button>
                    <button class="Reset" onClick={() => startOver()}>
                      Reset
                    </button>
                </div>
            </div>
            <p class="Message">
                {message}
            </p>
        </div>
    );
};

export default WildTicTacToe;


