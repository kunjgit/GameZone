var keyAction = ACT_STOP; //// keyLastLeftRight = ACT_RIGHT;
var shiftLevelNum = 0;
var runnerDebug = 0;

function pressShiftKey(code)
{
/*	cheat key code disable 5/16/2015
	switch(code) {
	case KEYCODE_PERIOD: //SHIFT-. = '>', change to next level
		shiftLevelNum = 1;	
		gameState = GAME_NEXT_LEVEL;
		break;	
	case KEYCODE_COMMA:	 //SHIFT-, = '<', change to previous level	
		shiftLevelNum = 1;	
		gameState = GAME_PREV_LEVEL;
		break;
	case KEYCODE_UP: //SHIFT-UP, inc runner 	
		if(playMode == PLAY_CLASSIC && runnerLife < 10) { //bug fixed: add check playMode, 12/15/2014
			runnerLife++;	
			drawLife();
		}
		break;	
	case KEYCODE_X: //SHIFT-X 
		toggleTrapTile();
		break;
	case KEYCODE_G: //SHIFT-G, toggle god mode
		toggleGodMode();
		break;	
	default:		
		if(runnerDebug) debugKeyPress(code);
		break;
	}
*/	
}

function pressCtrlKey(code)
{
	switch(code) {
	case KEYCODE_A: //CTRL-A : abort level
		gameState = GAME_RUNNER_DEAD;	
		break;	
	case KEYCODE_C: //CTRL-C : copy current level
		copyLevelMap = levelData[curLevel-1];
		copyLevelPassed = 1; //means copy from exists level	
		showTipsText("COPY MAP", 1500);	
		break;	
	case KEYCODE_J:	//CTRL-J : gamepad toggle
		toggleGamepadMode(1);
		//if(gamepadIconObj) gamepadIconObj.updateGamepadImage();	
		break;	
	case KEYCODE_K: //CTRL-K : repeat actions On/Off
		toggleRepeatAction();	
		repeatActionIconObj.updateRepeatActionImage();	
		break;	
	case KEYCODE_R: //CTRL-R : abort game
		runnerLife = 1;	
		gameState = GAME_RUNNER_DEAD;	
		break;	
	case KEYCODE_X: //CTRL-X 
		toggleTrapTile();
		break;
//	case KEYCODE_Z: //CTRL-Z, toggle god mode
//		toggleGodMode();
//		break;	
	case KEYCODE_S: //CTRL-S, toggle sound 
		if( (soundOff ^= 1) == 1) {
			soundStop(soundDig);
			soundStop(soundFall);
			showTipsText("SOUND OFF", 1500);
		} else {
			showTipsText("SOUND ON", 1500);
		}
		soundIconObj.updateSoundImage(); //toggle sound On/Off icon	
		break;	
	case KEYCODE_LEFT: //SHIFT + <- : speed down
		setSpeed(-1);	
		break;	
	case KEYCODE_RIGHT: //SHIFT + -> : speed up
		setSpeed(1);	
		break;
	case KEYCODE_H:	//CTRL-H : redHat mode on/off
		toggleRedhatMode();
		break;
	case KEYCODE_1: //CTRL-1
	case KEYCODE_2: //CTRL-2
	case KEYCODE_3: //CTRL-3
	case KEYCODE_4: //CTRL-4
	case KEYCODE_5: //CTRL-5
		themeColorChange(code - KEYCODE_1);
		break;	
	}
}

function debugKeyPress(code)
{
	switch(code) {
	case KEYCODE_1: //SHIFT-1 , add 5 level
		shiftLevelNum = 5;	
		gameState = GAME_NEXT_LEVEL;
		break;	
	case KEYCODE_2: //SHIFT-2 , add 10 level
		shiftLevelNum = 10;	
		gameState = GAME_NEXT_LEVEL;
		break;	
	case KEYCODE_3: //SHIFT-3 , add 20 level
		shiftLevelNum = 20;	
		gameState = GAME_NEXT_LEVEL;
		break;	
	case KEYCODE_4: //SHIFT-4 , add 50 level
		shiftLevelNum = 50;	
		gameState = GAME_NEXT_LEVEL;
		break;	
	case KEYCODE_6: //SHIFT-6 , dec 5 level
		shiftLevelNum = 5;	
		gameState = GAME_PREV_LEVEL;
		break;	
	case KEYCODE_7: //SHIFT-7 , dec 10 level
		shiftLevelNum = 10;	
		gameState = GAME_PREV_LEVEL;
		break;	
	case KEYCODE_8: //SHIFT-8 , dec 20 level
		shiftLevelNum = 20;	
		gameState = GAME_PREV_LEVEL;
		break;	
	case KEYCODE_9: //SHIFT-9 , dec 50 level
		shiftLevelNum = 50;	
		gameState = GAME_PREV_LEVEL;
		break;
	}
}

var repeatAction = 0;  //1: keyboard repeat on, 0: keyboard repeat Off
var repeatActionPressed = 0;
var gamepadMode = 1; //0: disable, 1: enable
var redhatMode = 1;
var godMode = 0, godModeKeyPressed = 0;

function initHotKeyVariable()
{
	godMode = 0;
	godModeKeyPressed = 0;
	repeatActionPressed = 0;
}

function toggleRepeatAction()
{
	if( (repeatAction ^= 1) == 1) {
		showTipsText("REPEAT ACTIONS ON", 2500);
	} else {
		showTipsText("REPEAT ACTIONS OFF", 2500);
	}
	if(gameState != GAME_START) repeatActionPressed=1; //player change the "repeatAction" Mode at running
	
	setRepeatAction();
}

function toggleGamepadMode(textMsg)
{
	if(!gamepadSupport()) {
		if(textMsg) showTipsText("GAMEPAD NOT SUPPORTED", 2500);
		gamepadMode = 0;
	} else {
		if( (gamepadMode ^= 1) == 1) {
			gamepadEnable();
			if(textMsg) showTipsText("GAMEPAD ON", 2500);
		} else {
			gamepadDisable();
			if(textMsg) showTipsText("GAMEPAD OFF", 2500);
		}
	}
	setGamepadMode();
}

function toggleRedhatMode()
{
	if( (redhatMode ^= 1) == 1 ) { //enable
		for(var i = 0; i < guardCount; i++) {
			if(guard[i].hasGold > 0)
				guard[i].sprite.spriteSheet = redhatData;
			else	
				guard[i].sprite.spriteSheet = guardData;
		}
		showTipsText("REDHAT MODE ON", 1500);
	} else { //disable
		for(var i = 0; i < guardCount; i++) {
				guard[i].sprite.spriteSheet = guardData;
		}
		showTipsText("REDHAT MODE OFF", 1500);
	}
}


function toggleGodMode()
{
	godModeKeyPressed = 1; //means player press the god-mod hot-key
	sometimePlayInGodMode = 1; // 12/23/2014 
	
	godMode ^= 1;
	if(godMode) {
		showTipsText("GOD MODE ON", 1500);
	} else {	
		showTipsText("GOD MODE OFF", 1500);
	}
}

function setSpeed(v)
{
	speed += v;
	if(speed < 0) speed = 0;
	if(speed >= speedMode.length) speed = speedMode.length-1;
	createjs.Ticker.setFPS(speedMode[speed]);
	showTipsText(speedText[speed], 1500);
}

function helpCallBack() //help complete call back
{
	pressKey(KEYCODE_ESC);
}

function pressKey(code)
{
	switch(code) {
	case KEYCODE_LEFT:        
	case KEYCODE_J:	
	case KEYCODE_A:		
		keyAction = ACT_LEFT;
		break;
	case KEYCODE_RIGHT: 
	case KEYCODE_L:		
	case KEYCODE_D:
		keyAction = ACT_RIGHT;
		break;
	case KEYCODE_UP:
	case KEYCODE_I:
	case KEYCODE_W:
		keyAction = ACT_UP;
		break;
	case KEYCODE_DOWN: 
	case KEYCODE_K:
	case KEYCODE_S:
		keyAction = ACT_DOWN;
		break;
	case KEYCODE_Z:
	case KEYCODE_Y:  //Y key to dig left, for German keyboards
	case KEYCODE_U:	
	case KEYCODE_Q:		
	case KEYCODE_COMMA: //,
		keyAction = ACT_DIG_LEFT;
		break;	
	case KEYCODE_X:
	case KEYCODE_O:
	case KEYCODE_E:		
	case KEYCODE_PERIOD: //.
		keyAction = ACT_DIG_RIGHT;
		break;	
	case KEYCODE_ESC: //help & pause
		if(gameState == GAME_PAUSE) {
			gameResume();
			showTipsText("", 1000); //clear text
		} else {
			gamePause();
			showTipsText("PAUSE", 0); //display "PAUSE"
			//helpObj.showHelp(helpCallBack);
		}
		break;
	case KEYCODE_ENTER: //display hi-score
		if(playMode == PLAY_CLASSIC) {
			menuIconDisable(1);
			gamePause();
			showScoreTable(playData, null, function() { menuIconEnable(); gameResume();});	
		} else {
			keyAction = ACT_UNKNOWN;
		}
		break;	
	default:
		keyAction = ACT_UNKNOWN;
		//debug("keycode = " + code);	
		break;	
	}
  if(recordMode && code != KEYCODE_ESC) saveKeyCode(code, keyAction);
}

function gameResume()
{
	gameState = lastGameState;
	soundResume(soundFall);
	soundResume(soundDig);
}

function gamePause()
{
	lastGameState = gameState;	
	gameState = GAME_PAUSE;
	soundPause(soundFall);
	soundPause(soundDig);
}

function handleKeyDown(event) 
{
	if(!event){ event = window.event; } //cross browser issues exist
	
	if(event.shiftKey) {
		if(gameState == GAME_START || gameState == GAME_RUNNING) {
			pressShiftKey(event.keyCode);
		}
	} else 
	if (event.ctrlKey) {
		if(gameState == GAME_START || gameState == GAME_RUNNING) {
			pressCtrlKey(event.keyCode);
		}
	} else {
		 if((gameState == GAME_PAUSE && event.keyCode == KEYCODE_ESC) ||
    	    gameState == GAME_START || gameState == GAME_RUNNING) 
		{
			if(recordMode != RECORD_PLAY && playMode != PLAY_AUTO) {
				pressKey(event.keyCode);
			}
		}
		
	}
	
	if(event.keyCode >= 112 && event.keyCode <= 123) return true; //F1 ~ F12
	return false;
	
}	

function handleKeyUp(event)
{
	if(repeatAction) return true;
	if(!event){ event = window.event; } 
	if(recordKeyCode == event.keyCode && keyPressed != -1) keyPressed = 0;
	return true;
}
