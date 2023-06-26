var MAX_CONTROLLER = 4;

var gamepadReady = 0;
var gamepadPollingId = null;
var gamepadLastId = -1; //for send to server only

var requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

var cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
	window.webkitCancelRequestAnimationFrame ||
	window.mozCancelRequestAnimationFrame;

function gamepadEnable()
{
	if(!gamepadSupport()) return;
	
	window.addEventListener("gamepadconnected",gamepadConnectFun, false);
	window.addEventListener("gamepaddisconnected", gamepadDisconnectFun, false);
	gamepadPollingId = setInterval(gamepadCheck, 500);
}

function gamepadSupport() 
{
	return ("getGamepads" in navigator) || ("webkitGetGamepads" in navigator);
}
 
function gamepadConnectFun(e)
{
	//console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
	//            e.gamepad.index, e.gamepad.id,
	//            e.gamepad.buttons.length, e.gamepad.axes.length);
	gamepadReady = 1;
	if(gamepadPollingId) { 
		clearInterval(gamepadPollingId); 
		gamepadPollingId = null; 
	}
	requestAnimationFrame(gamepadRequestState);
}

function gamepadDisconnectFun(e) 
{
	console.log("disconnection game port#%d", e.gamepad.index );
	gamepadReady = 0;
	if(!gamepadPollingId) gamepadPollingId = setInterval(gamepadCheck, 500);
}

function gamepadCheck()
{
	gamepad = gamepadGetInstance();
	for(var id=0; id < MAX_CONTROLLER; id ++) {	
		if(gamepad[id]) {	
			if(!gamepadReady) { 
				gamepadConnectTrigger(gamepad[id]);
			}
		}
	}
}

function gamepadGetInstance()
{
	return ("getGamepads" in navigator) ? 
	       navigator.getGamepads() : 
	       (("webkitGetGamepads" in navigator) ? navigator.webkitGetGamepads() : []);
}

//=================================
// Generate gamepadconnected event 
//=================================
function gamepadConnectTrigger(gamepad)
{
	var event = document.createEvent('Event');
	event.initEvent("gamepadconnected", true, true); //can bubble, and is cancellable
	event.gamepad = gamepad;
	dispatchEvent(event);
}

function gamepadDisable()
{
	if(!gamepadSupport()) return;
	
	window.removeEventListener("gamepadconnected",gamepadConnectFun, false);
	window.removeEventListener("gamepaddisconnected", gamepadDisconnectFun, false);
	if(gamepadPollingId) { 
		clearInterval(gamepadPollingId); 
		gamepadPollingId = null; 
	}
	gamepadReady = 0;
}

function getLastGamepadInfo()
{
	var gamepadInfo = null;
	
	if(gamepadLastId >= 0 && gamepadLastId < MAX_CONTROLLER ) {
		var gamepad = gamepadGetInstance()[gamepadLastId];
		if(gamepad) {
			gamepadInfo =gamepad.index + "." + gamepad.id + 
			           (gamepad.mapping != ""?("." +gamepad.mapping):"");
		}
	}
	
	return gamepadInfo;
}

//===========================================================================

var keyCodeMapping  = [
  //[[keyCode1, ctrl, shift], [keyCode2, ctrl, shift]	
	[[KEYCODE_UP,    0, 0],   [KEYCODE_UP,    0, 0]], //up
	[[KEYCODE_DOWN,  0, 0],   [KEYCODE_DOWN,  0, 0]], //down
	[[KEYCODE_LEFT,  0, 0],   [KEYCODE_LEFT,  0, 0]], //left
	[[KEYCODE_RIGHT, 0, 0],   [KEYCODE_RIGHT, 0, 0]], //right
	[[KEYCODE_Z,     0, 0],   [KEYCODE_ENTER, 0, 0]], //dig-left
	[[KEYCODE_X,     0, 0],   [KEYCODE_ENTER, 0, 0]], //dig-right
	[[KEYCODE_ESC,   0, 0],   [KEYCODE_ENTER, 0, 0]], //pause
	[[KEYCODE_ENTER, 0, 0],   [KEYCODE_ENTER, 0, 0]], //enter
	[[KEYCODE_A,     1, 0],   [KEYCODE_ENTER, 0, 0]]  //game abort
];

var gameButtonMapping = [ 
	//index[0] buttonMethod: 0: don't repeat, 1: repeat, 2: combine button
	
	[ 1, ['B', 12],['A', 1, "<", -0.6],['B', 16]],    //UP
	[ 1, ['B', 13],['A', 1, ">",  0.6],['B', 17]],    //DOWN
	[ 1, ['B', 14],['A', 0, "<", -0.6],['B', 18]],    //LEFT
	[ 1, ['B', 15],['A', 0, ">",  0.6],['B', 19]],    //RIGHT
	[ 1, ['B',  2],['B', 3]],                         //DIG-LEFT
	[ 1, ['B',  1]],                                  //DIG-RIGHT
	[ 0, ['B',  8],['B', 11]],                        //PAUSE  (ESC)
	[ 0, ['B',  9]],                        //Enter (Accept)
	[ 2, ['B',  4],['B',  5], ['B',  6],['B',  7]]    //GAME ABORT (CTRL-A)
];

var lastButtonState = [ 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0] 
];  

function gamepadRequestState()
{
	var i, j;
	var gamepad, curButtonState;
	var buttonMethod;
	
	for(var id=0; id < MAX_CONTROLLER; id ++) {	
		gamepad = gamepadGetInstance()[id];
		curButtonState = [];
		if(gamepad) {
			for(i = 0; i < gameButtonMapping.length; i++) {
				curButtonState[i] = 0;
				buttonMethod = gameButtonMapping[i][0];
				for(j = 1; j < gameButtonMapping[i].length && !curButtonState[i]; j++) {
					var curButtonMapping = gameButtonMapping[i][j];
					switch(curButtonMapping[0]) {
					case 'A': //axes
						var axesId = curButtonMapping[1];
						if(gamepad.axes.length > axesId) {	
							var axesCmpSign = curButtonMapping[2];	
							var axesCmpValue = curButtonMapping[3];
							var axesValue = Math.trunc(gamepad.axes[axesId]*100)/100;	
							if(typeof axesValue != 'undefined' ) {
								if( (axesCmpSign == ">" && axesValue > axesCmpValue && axesValue <= 1.05) 
								  ||(axesCmpSign == "<" && axesValue < axesCmpValue && axesValue >= -1.05) ) 
								{
									//console.log("axes#%d = %f", axesId, axesValue );
									curButtonState[i] = 1;
								}
							}
						}
						break;
					case 'B': //button
						var buttonId = curButtonMapping[1];
						var button = gamepad.buttons[buttonId];	
						if(buttonPressed(button))
							curButtonState[i] = 1;
						
						if(buttonMethod == 2) { //combine mode
							j++;
							if(curButtonState[i]) {
								curButtonMapping = gameButtonMapping[i][j];
								buttonId = curButtonMapping[1];
								button = gamepad.buttons[buttonId];	
								if(buttonPressed(button)) {
									curButtonState[i] = 1;							
								} else {
									curButtonState[i] = 0;
								}
							}
						}
						break;		
					}
				}
				switch(buttonMethod) {
				case 1: //repeat
					if(document.onkeydown == handleKeyDown || document.onkeydown == anyKeyDown) {
						if(curButtonState[i])sendKeyDown(keyCodeMapping[i], id); 
						else if(lastButtonState[id][i]) sendKeyUp(keyCodeMapping[i], id);
						break;
					}
				case 0: //don't repeat
				case 2:		
					if(lastButtonState[id][i] != curButtonState[i]) {
						if(curButtonState[i])sendKeyDown(keyCodeMapping[i], id); 
						else if(lastButtonState[id][i]) sendKeyUp(keyCodeMapping[i], id);
					}
					break;	
				}
			}
			lastButtonState[id] = curButtonState;
		}
	}
	if(gamepadReady) requestAnimationFrame(gamepadRequestState);
}

function buttonPressed(button)
{
	var pressed = button == 1.0;
	
	if (typeof(button) == "object") {
        pressed = button.pressed;
	}
	
	return pressed;
}

function gamepadClearId()
{
	gamepadLastId = -1;
}

function sendKeyUp(twinKey, id)
{
	var key = (inputNameState)? twinKey[1]:twinKey[0];
	if(key[0] == null) return;
	
	var event = {keyCode: key[0], ctrlKey: key[1], shiftKey: key[2]};
	//console.log("sendKeyUp = %d",keyCode );
	if(typeof document.onkeydown == "function" ) document.onkeyup(event);
	gamepadLastId = id;
}

function sendKeyDown(twinKey, id)
{
	var key = (inputNameState)? twinKey[1]:twinKey[0];
	if(key[0] == null) return;
	
	var event = {keyCode: key[0], ctrlKey: key[1], shiftKey: key[2]};
	//console.log("sendKeyDown = %d",keyCode );
	if(typeof document.onkeydown == "function" ) document.onkeydown(event);
	gamepadLastId = id;
}