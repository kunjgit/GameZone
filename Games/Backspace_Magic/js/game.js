var gameModule = (function(module) {
    "use strict";
    
    // Game ====================
    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.isSceneLoaded = false;
            //this.audioManager = null;//new audioModule.AudioManager();
            this.gameDataManager = new dataModule.GameDataManager();
        }
        startGameLoop() {
            if (!this.isSceneLoaded) {
                this.loadScenes();
            }
            //this.audioManager.load();
            let stepFunction = gameStep(this);
            requestAnimationFrame(stepFunction);
        }
        loadScenes() {
            this.sceneStack = [];
            this.currentScene = null;
            this.modalScene = null;
            this.isSceneLoaded = true;
        }
        changeScene(sceneObj) {
            this.backScene();
            this.pushScene(sceneObj);
        }
        pushScene(sceneObj) {
            // Stop the current scene
            if (this.currentScene) {
                this.currentScene.pause();
            }
            // Set the scene properly
            //sceneObj.setParentGame(this);
            this.currentScene = sceneObj;
            this.sceneStack.push(sceneObj);
            activateScene(this.currentScene);
        }
        backScene() {
            this.currentScene.pause();
            this.sceneStack.pop();
            if (this.sceneStack.length === 0) {
                this.currentScene = null;
            }
            else {
                this.currentScene = this.sceneStack[this.sceneStack.length - 1];
                activateScene(this.currentScene);
            }
        }
        backSceneTillOne() {
            while (this.sceneStack.length > 1) {
                this.backScene();
            }
        }
        // openModal(sceneObj, pauseInputOnly = true) {
        //     // Stop the current scene
        //     if (this.currentScene) {
        //         this.currentScene.pause(pauseInputOnly);
        //     }
        //     this.modalScene = sceneObj;
        //     this.modalScene.onlyDrawIfUpdate = false; // Always draw
        //     activateScene(this.modalScene, false);
        // }
        // closeModal() {
        //     if (this.modalScene !== null) {
        //         this.modalScene.pause(true);
        //         this.modalScene = null;
        //         activateScene(this.currentScene, false);
        //     }
        // }
        setCanvasConfig(canvasConfig) {
            if (this.canvas) {
                if (canvasConfig.canvasWidth) {
                    this.canvas.setAttribute("width", canvasConfig.canvasWidth);
                }
                if (canvasConfig.canvasHeight) {
                    this.canvas.setAttribute("height", canvasConfig.canvasHeight);
                }
            }
            // else {
            //     throw new Error("The game object does not have canvas.");
            // }
        }
    }
    
    // Private methods ====================
    let gameStep = function(gameObj)  {
        let lastTimeStamp = 0;
        
        return function step(nowTimeStamp) {
            let passedTimeMillisecond = nowTimeStamp - lastTimeStamp;
            lastTimeStamp = nowTimeStamp;
        
            if (gameObj.currentScene !== null) {
                gameObj.currentScene.update(passedTimeMillisecond);
                gameObj.currentScene.draw();
            }
            
            if (gameObj.modalScene !== null) {
                gameObj.modalScene.update(passedTimeMillisecond);
                gameObj.modalScene.draw();
            }
            
            requestAnimationFrame(step);
        };  
    };
    
    let activateScene = function(scene, isFadeIn = true) {
        scene.resume();
        if (isFadeIn) {
            scene.startFadeIn();
        }
    };
    
    // The Actual Game ====================
    class TheGame extends Game{
        constructor(canvas) {
            super(canvas);
        }
        loadScenes() {
            super.loadScenes();
            this.pushScene(new sceneModule.TitleScene(this));
        }
    }
    

    // Expose Public Classes ====================
    module.TheGame = TheGame;

    return module;

})(gameModule || {});
