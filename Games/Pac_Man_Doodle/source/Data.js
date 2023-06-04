let Data = (function (){
    "use strict";
    
    const levelsData = [
        { // 1
            ghostSpeed        : 0.75,                           // Normal Ghost speed
            tunnelSpeed       : 0.4,                            // Ghost speed in the tunel
            pmSpeed           : 0.8,                            // Normal Pacman speed
            eatingSpeed       : 0.71,                           // Pacman speed while eating
            ghostFrightSpeed  : 0.5,                            // Ghost speed in Fright mode
            pmFrightSpeed     : 0.9,                            // Pacman speed in Fright mode
            eatingFrightSpeed : 0.79,                           // Pacman speed in Fright mode while eating
            elroyDotsLeft1    : 20,                             // How many dots left before Blinky "Cruise Elroy" mode 1
            elroySpeed1       : 0.8,                            // The speed of Blinky "Cruise Elroy" mode 1
            elroyDotsLeft2    : 10,                             // How many dots left before Blinky "Cruise Elroy" mode 2
            elroySpeed2       : 0.85,                           // The speed of Blinky "Cruise Elroy" mode 2
            fruitType         : 1,                              // The type of fruit for this level
            fruitScore        : 100,                            // The score when catching a fruit
            frightTime        : 6,                              // The fright mode time
            frightBlinks      : 5,                              // The amount of blinks before turning back
            switchTimes       : [ 7, 20, 7, 20, 5, 20, 5, 1 ],  // The times between scatter, chase, scatter... modes
            penForceTime      : 4,                              // The time after a ghost leaves the pen while the pacman is not eating dots
            penLeavingLimit   : [ 0, 0, 30, 60 ]                // Amount of dots before each ghost leaves the pen
        },
        { // 2
            ghostSpeed        : 0.85,
            tunnelSpeed       : 0.45,
            pmSpeed           : 0.9,
            eatingSpeed       : 0.79,
            ghostFrightSpeed  : 0.55,
            pmFrightSpeed     : 0.95,
            eatingFrightSpeed : 0.83,
            elroyDotsLeft1    : 30,
            elroySpeed1       : 0.9,
            elroyDotsLeft2    : 15,
            elroySpeed2       : 0.95,
            fruitType         : 2,
            fruitScore        : 300,
            frightTime        : 5,
            frightBlinks      : 5,
            switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
            penForceTime      : 4,
            penLeavingLimit   : [ 0, 0, 0, 50 ]
        },
        { // 3
            ghostSpeed        : 0.85,
            tunnelSpeed       : 0.45,
            pmSpeed           : 0.9,
            eatingSpeed       : 0.79,
            ghostFrightSpeed  : 0.55,
            pmFrightSpeed     : 0.95,
            eatingFrightSpeed : 0.83,
            elroyDotsLeft1    : 40,
            elroySpeed1       : 0.9,
            elroyDotsLeft2    : 20,
            elroySpeed2       : 0.95,
            fruitType         : 3,
            fruitScore        : 500,
            frightTime        : 4,
            frightBlinks      : 5,
            switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
            penForceTime      : 4,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 4
            ghostSpeed        : 0.85,
            tunnelSpeed       : 0.45,
            pmSpeed           : 0.9,
            eatingSpeed       : 0.79,
            ghostFrightSpeed  : 0.55,
            pmFrightSpeed     : 0.95,
            eatingFrightSpeed : 0.83,
            elroyDotsLeft1    : 40,
            elroySpeed1       : 0.9,
            elroyDotsLeft2    : 20,
            elroySpeed2       : 0.95,
            fruitType         : 3,
            fruitScore        : 500,
            frightTime        : 3,
            frightBlinks      : 5,
            switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
            penForceTime      : 4,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 5
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 40,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 20,
            elroySpeed2       : 10.05,
            fruitType         : 4,
            fruitScore        : 700,
            frightTime        : 2,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 6
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 50,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 25,
            elroySpeed2       : 10.05,
            fruitType         : 4,
            fruitScore        : 700,
            frightTime        : 5,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 7
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 50,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 25,
            elroySpeed2       : 1.05,
            fruitType         : 5,
            fruitScore        : 1000,
            frightTime        : 2,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 8
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 50,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 25,
            elroySpeed2       : 1.05,
            fruitType         : 5,
            fruitScore        : 1000,
            frightTime        : 2,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 9
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 60,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 30,
            elroySpeed2       : 1.05,
            fruitType         : 6,
            fruitScore        : 2000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 10
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 60,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 30,
            elroySpeed2       : 1.05,
            fruitType         : 6,
            fruitScore        : 2000,
            frightTime        : 5,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 11
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 60,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 30,
            elroySpeed2       : 1.05,
            fruitType         : 7,
            fruitScore        : 3000,
            frightTime        : 2,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 12
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 80,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 40,
            elroySpeed2       : 1.05,
            fruitType         : 7,
            fruitScore        : 3000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 13
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 80,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 40,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 14
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 80,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 40,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 3,
            frightBlinks      : 5,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 15
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 100,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 50,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 16
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 100,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 50,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 17
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 100,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 50,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 0,
            frightBlinks      : 0,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 18
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 100,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 50,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 1,
            frightBlinks      : 3,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 19
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 120,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 60,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 0,
            frightBlinks      : 0,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 20
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 1,
            eatingSpeed       : 0.87,
            ghostFrightSpeed  : 0.6,
            pmFrightSpeed     : 1,
            eatingFrightSpeed : 0.87,
            elroyDotsLeft1    : 120,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 60,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 0,
            frightBlinks      : 0,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        },
        { // 21+
            ghostSpeed        : 0.95,
            tunnelSpeed       : 0.5,
            pmSpeed           : 0.9,
            eatingSpeed       : 0.79,
            ghostFrightSpeed  : 0.75,
            pmFrightSpeed     : 0.9,
            eatingFrightSpeed : 0.79,
            elroyDotsLeft1    : 120,
            elroySpeed1       : 1,
            elroyDotsLeft2    : 60,
            elroySpeed2       : 1.05,
            fruitType         : 8,
            fruitScore        : 5000,
            frightTime        : 0,
            frightBlinks      : 0,
            switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
            penForceTime      : 3,
            penLeavingLimit   : [ 0, 0, 0, 0 ]
        }],
    
    /** @const Data */
        fruitNames     = [ "Cherries", "Strawberry", "Peach", "Apple", "Grapes", "Galaxian", "Bell", "Key" ],
        fruitDots1     = 174,
        fruitDots2     = 74,
        energizerValue = 5,
        pillValue      = 1,
        extraLife      = 10000,
        pillMult       = 10,
        eyesBonus      = 12000,
        totalSwitchs   = 7,
        blinksTimer    = 200,
        penDotsCount   = [ 0, 7, 17, 32 ],
        inPenSpeed     = 0.6,
        eyesSpeed      = 2,
        exitPenSpeed   = 0.4,
        pathSpeeds     = {
            inPen    : inPenSpeed,
            exitPen  : exitPenSpeed,
            enterPen : eyesSpeed
        };
    
    /** @type {number} the current game level */
    let gameLevel = 1;
    
    
    
    
    /** The public API */
    return {
        /**
         * Sets the game level
         * @param {number} level
         */
        set level(level) {
            gameLevel = level;
        },
        
        
        /**
         * The amount of time a fruit stays in the board
         * @return {number}
         */
        get fruitTime() {
            return Math.round(Math.random() * 1000) + 9000;
        },
        
        /**
         * The amount of dots left before showing the fruit
         * @return {number}
         */
        get fruitDots1() {
            return fruitDots1;
        },
        
        /**
         * The amount of dots left before showing the fruit
         * @return {number}
         */
        get fruitDots2() {
            return fruitDots2;
        },
        
        /**
         * The value for the energizer
         * @return {number}
         */
        get energizerValue() {
            return energizerValue;
        },
        
        /**
         * The value for the pill
         * @return {number}
         */
        get pillValue() {
            return pillValue;
        },
        
        
        /**
         * The score required for each extra life
         * @return {number}
         */
        get extraLife() {
            return extraLife;
        },
        
        /**
         * Returns the pills multiplier
         * @return {number}
         */
        get pillMult() {
            return pillMult;
        },
        
        /**
         * Returns the eves bonus score
         * @return {number}
         */
        get eyesBonus() {
            return eyesBonus;
        },
        
        /**
         * Returns the total amount of Ghost's mode switchs
         * @return {number}
         */
        get totalSwitchs() {
            return totalSwitchs;
        },
        
        /**
         * Returns the Ghost's blink time
         * @return {number}
         */
        get blinksTimer() {
            return blinksTimer;
        },
        
        /**
         * Returns the Ghost's eyes mode speed
         * @return {number}
         */
        get eyesSpeed() {
            return eyesSpeed;
        },
        
        
        /**
         * Returns the value asociated with the given key for the current level
         * @param {string} variable
         * @return {(number|string|Array.<number>)}
         */
        getLevelData(variable) {
            var level = Math.min(gameLevel - 1, levelsData.length - 1),
                data  = levelsData[level],
                value = data[variable];

            if (Array.isArray(value)) {
                return Object.create(value);
            }
            return value;
        },
            
        /**
         * Returns the fruit name for the current level
         * @return {string}
         */
        getFruitName() {
            return fruitNames[Data.getLevelData("fruitType") - 1];
        },
        
        /**
         * Returns the Pen Force time in miliseconds
         * @return {number}
         */
        getPenForceTime() {
            return Data.getLevelData("penForceTime") * 1000;
        },
        
        /**
         * Returns the switch time at the given mode in miliseconds
         * @param {number} mode
         * @return {number}
         */
        getSwitchTime(mode) {
            return Data.getLevelData("switchTimes")[mode] * 1000;
        },
        
        /**
         * Returns the Fright time in miliseconds
         * @return {number}
         */
        getFrightTime() {
            return Data.getLevelData("frightTime") * 1000;
        },
        
        /**
         * Returns the amount of switchs when blinking in fright mode
         * @return {number}
         */
        getBlinks() {
            return Data.getLevelData("frightBlinks") * 2;
        },
        
        /**
         * Returns the ghost speed
         * @param {boolean} inPen
         * @return {number}
         */
        getGhostSpeed(inPen) {
            return inPen ? inPenSpeed : Data.getLevelData("ghostSpeed");
        },
        
        /**
         * Returns the ghost speed inside a path
         * @param {string} path
         * @return {number}
         */
        getPathSpeed(path) {
            return pathSpeeds[path];
        },
        
        /**
         * Returns the Score for a dead Ghost
         * @param {number} amount
         * @return {number}
         */
        getGhostScore(amount) {
            return Math.pow(2, amount) * 100;
        },
        
        /**
         * Returns the amount of dots required before exiting the Pen for the given ghost
         * @param {number} ghost
         * @return {number}
         */
        getPenDotsCount(ghost) {
            return penDotsCount[ghost];
        },
        
        /**
         * Returns true if the given mode is Frighten
         * @param {number} mode
         * @return {boolean}
         */
        isFrighten(mode) {
            return mode === "blue" || mode === "white";
        }
    };
    
}());
