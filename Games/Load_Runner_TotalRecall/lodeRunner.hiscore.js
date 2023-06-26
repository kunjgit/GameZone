var inputNameState = 0;

function showScoreTable(_playData, _curScoreInfo, _callbackFun, _waitTime)
{
	var hiScoreInfo;
	var canvas2, scoreStage;
	var titleText;
	var recordId = -1;
	var savedKeyDownHander;
	var timeOutHandler = null;

	init();
	
	function init()
	{
		var haveInfo = getHiScoreInfo();
		
		if(_curScoreInfo) {
			recordId = updateScoreInfo();
			if(recordId < 0) {
				if(_callbackFun) _callbackFun();
				return; //don't need update score
			}
		}
		
		if(!haveInfo && !_curScoreInfo) {
			if(_callbackFun) _callbackFun();
			return; //no score info don't need display 
		}
			
		createCanvas2();
		createScoreStage();
		setScoreBackground();
		drawHiScoreList();
		scoreStage.update();
		if(recordId >= 0) {
			var winner = 0;
			if('w' in _curScoreInfo) winner = 1;
			inputHiScoreName(winner);
		} else {
			anyKeyHandler();
			if(typeof _waitTime == "undefined") _waitTime = 3500;
			timeOutHandler = setTimeout( function() { closeScoreTable(); }, _waitTime);
		}
	}
	
	function closeScoreTable()
	{
		removeCanvas2();
		restoreKeyDownHandler();
		if(_callbackFun) _callbackFun();
	}
	
	function getHiScoreInfo()
	{
		var infoJSON = null, levelMap;
		var rc = 0;
		
		infoJSON = getStorage(STORAGE_HISCORE_INFO + _playData);
		
		if(infoJSON) {
			var infoObj = JSON.parse(infoJSON);
			hiScoreInfo = infoObj;
			rc = 1;
		} else {
			// no score
			hiScoreInfo = [];
			for(var i = 0; i < MAX_HISCORE_RECORD; i++) {
				hiScoreInfo[i] = {s:0 , n:"" , l: 0};
			}
		}
		return rc;
	}
	
	function setHiScoreInfo()
	{
		var infoJSON = JSON.stringify(hiScoreInfo);
		setStorage(STORAGE_HISCORE_INFO + _playData, infoJSON); 
	
	}

	function updateScoreInfo()
	{
		var addId = -1;
		
		if(_curScoreInfo.s <= 0) return addId; //don't save if scroe <= 0
		
		for(var i = 0; i < MAX_HISCORE_RECORD; i++) {
			_curScoreInfo.n = "";
			if(_curScoreInfo.s >= hiScoreInfo[i].s) {
				addId = i;
				hiScoreInfo.splice(i, 0, _curScoreInfo);
				hiScoreInfo.splice(MAX_HISCORE_RECORD, 1);
				setHiScoreInfo();
				break;
			}
		}
		return addId;
	}
	
	function createCanvas2()
	{
		canvas2 = document.createElement('canvas');
		canvas2.id     = "canvas2";
		canvas2.width  = canvasX;
		canvas2.height = canvasY;
	
		//Set canvas top left position
		var left = ((screenX1 - canvasX)/2|0),
			top  = ((screenY1 - canvasY)/2|0);
		canvas2.style.left = (left>0?left:0) + "px";
		canvas2.style.top =  (top>0?top:0) + "px";
		canvas2.style.position = "absolute";
		document.body.appendChild(canvas2);
	}	
	
	function createScoreStage() 
	{
		scoreStage = new createjs.Stage(canvas);
	}	
	
	function removeCanvas2()
	{
		scoreStage.removeAllChildren();
		scoreStage.update();
		document.body.removeChild(canvas2);
	}	
	
	function setScoreBackground()
	{
		//set background color
		var background = new createjs.Shape();
		background.graphics.beginFill("black").drawRect(0, 0, canvas2.width, canvas2.height);
		scoreStage.addChild(background);
	}	
	
	function getNameStartPos(nameLength, itemId) 
	{
		var x = (3.75+(MAX_HISCORE_NAME_LENGTH-nameLength)/2)*tileWScale;
		var y = (itemId * 1.2 + 5) * tileHScale;
		
		return { x: x, y: y };
	}
	
	function drawHiScoreList()
	{
		var title = playDataToTitleName(_playData);
		var localHighScore = "LOCAL HIGH SCORES";
		var barTile;

		//title 
		drawText((NO_OF_TILES_X-title.length)/2*tileWScale, 0*tileHScale, title, scoreStage);
		drawText((NO_OF_TILES_X-localHighScore.length)/2*tileWScale, 1.5*tileHScale, localHighScore, scoreStage);
		drawText(0.5*tileWScale, 3*tileHScale, "NO", scoreStage);
		drawText(7.75*tileWScale, 3*tileHScale, "NAME", scoreStage);
		drawText(15.75*tileWScale, 3*tileHScale, "LEVEL", scoreStage);
		drawText(22*tileWScale, 3*tileHScale, "SCORE", scoreStage);

		//bar 
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			barTile = getThemeBitmap("ground");
			barTile.setTransform(x * tileWScale, 4.5*tileHScale , tileScale, tileScale);
			scoreStage.addChild(barTile); 
		}		
	
		for(var i = 0; i < MAX_HISCORE_RECORD; i++) {
			var pos = getNameStartPos(hiScoreInfo[i].n.length, i);
			
			drawText(0.25*tileWScale, pos.y, ("0"+(i+1)).slice(-2) + ".", scoreStage); //no
			
			if(hiScoreInfo[i].s > 0) {
				if(hiScoreInfo[i].n.length > 0) {
					drawText(pos.x, pos.y, hiScoreInfo[i].n, scoreStage, "D"); //name
				}
				drawText(16.75*tileWScale, pos.y, ("00"+hiScoreInfo[i].l).slice(-3), scoreStage); //level
				drawText(21*tileWScale, pos.y, ("000000"+hiScoreInfo[i].s).slice(-7), scoreStage); //score
			}
		}
	}
	
	function anyKeyHandler()
	{
		savedKeyDownHander = document.onkeydown;
		document.onkeydown = function(event) {
			if(!event){ event = window.event; } 
		
			//if( event.keyCode == KEYCODE_ENTER) {
				clearTimeout(timeOutHandler);
				closeScoreTable();
			//}
		};
	}

	function restoreKeyDownHandler()
	{
		document.onkeydown = savedKeyDownHander;
	}			
	
	function inputHiScoreName(winner) 
	{
		var name, nameText;
		var curPos = 0;
		var savedKeyDownHander, hiScoreTicker;
		var cursor;

		if(winner) endingMusicPlay(); //6/15/2015, play ending music for winner
		initInput();
		
		function initInput()
		{
			inputNameState = 1;
			curPos = playerName.length;
			name = playerName.split(""); //string to array;
			nameText = []; //text object
			
			var pos = getNameStartPos(name.length, recordId);
			cursor = new createjs.Sprite(textData, "FLASH");
			cursor.setTransform(pos.x-tileWScale/2, pos.y , tileScale, tileScale);
			scoreStage.addChild(cursor);
			
			//copyPlayerName();
			redrawName();
			changeKeyDownHandler();
			hiScoreTicker = createjs.Ticker.on("tick", scoreStage);	
		}
		
		function changeKeyDownHandler()
		{
			savedKeyDownHander = document.onkeydown;
			document.onkeydown = handleHiScoreName;
		}
		
		function inputFinish(async)
		{
			if(winner) endingMusicStop(); //6/15/2015, stop ending music
			
			//cut tail space
			for(var i = name.length-1; i >= 0; i--) {
				if(name[i] == " ") name.splice(i,1);
				else break;
			}
			
			var nameString = name.join(""); //array to string
			redrawName();
			
			//update name for score info  
			hiScoreInfo[recordId].n = nameString;
			setHiScoreInfo();
			
			if(nameString != playerName && nameString != "???") { //set and save playerName 
				playerName = nameString;
				setPlayerName(nameString);     
			}

			//remove cursor
			scoreStage.removeChild(cursor);
			scoreStage.update();
			
			createjs.Ticker.off("tick", hiScoreTicker);
			setTimeout( function() { closeScoreTable(); }, 1500);
			
			inputNameState = 0;
		}
		
		function removeNameText()
		{
			for(var i = 0; i < nameText.length; i++) 
			scoreStage.removeChild(nameText[i]);
		}

		function redrawName()
		{
			var pos = getNameStartPos(name.length, recordId); 
			removeNameText();
			nameText = drawText(pos.x, pos.y, name.join(""), scoreStage, "D");

			//change cursor position
			if(name.length > 0) cursor.x = pos.x + curPos * tileWScale;
			else cursor.x = pos.x - tileWScale/2;

			//move cursor to top
			moveChild2Top(scoreStage, cursor);
		}
		
		function nextChar(charValue, nextMode)
		{
			if(typeof(charValue) == "undefined")charValue = " ";
			var code = charValue.charCodeAt(0);

			if(nextMode >=0) code++; else code--;
			
			if (code < 65 || code > 90) { //out of A-Z
				if(nextMode >=0) code = 65;
				else code= 90;
			}
			return String.fromCharCode(code); 
		}
		
		function handleHiScoreName(event)
		{
			if(!event){ event = window.event; } //cross browser issues exist
			
			var code = event.keyCode;
			
			if(curPos >= MAX_HISCORE_NAME_LENGTH && 
			   code != KEYCODE_BKSPACE && code != KEYCODE_LEFT && code != KEYCODE_ENTER) 
			{
				soundPlay("beep"); //wrong key code	
				return false;
			}

			switch(true) {
			case (code >= 48 && code <= 57): // 0 ~ 9
				if(curPos == 0) { soundPlay("beep"); break; } //first char except numbers
				name[curPos++] = String.fromCharCode(code);
				break;	
			case (code >=65 && code <= 90): // A ~ Z
			case (code >= 97 && code <= 122): //a ~ z
				if( code > 90) code -= 32;	
				name[curPos++] = String.fromCharCode(code);
				break;
			case (code == KEYCODE_DOT): //'.'		
				if(curPos == 0) { soundPlay("beep"); break;	} //first char except '.'
				name[curPos++] = ".";
				break;
			case (code == KEYCODE_DASH || code == KEYCODE_HYPHEN || code == KEYCODE_SUBTRACT): //'-'
				if(curPos == 0) { soundPlay("beep"); break;	} //first char except '-'
				name[curPos++] = "-";
				break;
			case (code == KEYCODE_SPACE): //space
				if(curPos == 0) { soundPlay("beep"); break;	} //first char except space
				name[curPos++] = " ";
				break;
			case (code == KEYCODE_BKSPACE): //backspace
				if(curPos == 0) break;
				name.splice(--curPos, 1);
				break;
			case (code == KEYCODE_LEFT): //LEFT
				if(curPos > 0) curPos--;	
				break;
			case (code == KEYCODE_RIGHT): //RIGHT
				if(curPos < name.length) curPos++;	
				break;
			case (code == KEYCODE_UP): //UP
				name[curPos] = nextChar(name[curPos], 1);
				break;
			case (code == KEYCODE_DOWN): //DOWN
				name[curPos] = nextChar(name[curPos], -1);
				break;
			case (code == KEYCODE_ENTER): //ENTER
				if(name.length > 0) inputFinish(true);	//async
				else soundPlay("beep");	
				break;	
			default:
				//debug(code);	
				if(code > 32) soundPlay("beep"); //wrong key code	
				break;	
			}
			
			redrawName();
			return false;
		}
	}
}
 
function inputPlayerName(_stage, _callbackFun) 
{
	var constString = "PLAYER NAME:"
	var constSize = constString.length;
	var maxInputSize = MAX_HISCORE_NAME_LENGTH;
	var borderSize = 2;
	var totalSizeX = constSize + maxInputSize + borderSize + 1; //+1 flash 
	var totalSizeY = 3;
	
	var inputBoardX = (NO_OF_TILES_X - totalSizeX) / 2;
	var inputBoardY = (NO_OF_TILES_Y - totalSizeY) / 2;
	
	var inputStartX = inputBoardX + constSize + 1;
	var inputStartY = inputBoardY + 1;
	
	var background = new createjs.Shape();
	var textBorder = new createjs.Shape();
	var textBackground = new createjs.Shape();
	
	background.graphics.beginFill("black").drawRect(0, 0, _stage.canvas.width, _stage.canvas.height).endFill();
	background.alpha = 0.2;
	
	var x = inputBoardX*tileWScale, y = inputBoardY*tileHScale;
	var w = totalSizeX*tileWScale, h = totalSizeY*tileHScale;
	var radius = (tileWScale/4)|0;
	textBorder.graphics.beginFill("#f00").drawRoundRect(x, y, w, h, radius).endFill();
	textBorder.alpha = 0.6;
	textBorder.shadow = new  createjs.Shadow("#111", tileWScale/4, tileHScale/4, 10);
	
	x = (inputBoardX+0.5)*tileWScale; y = (inputBoardY+0.5)*tileHScale;
	w = (totalSizeX-1)*tileWScale; h = (totalSizeY-1)*tileHScale;
	textBackground.alpha = 0.5;
	textBackground.graphics.beginFill("#111").drawRoundRect(x, y, w, h, radius/2).endFill();
	
	_stage.addChild(background, textBorder, textBackground);
	
	x = (inputBoardX+1)*tileWScale; y = (inputBoardY+1)*tileHScale;
	var constObj = drawText(x, y, constString, _stage, "D");

	x = inputStartX*tileWScale; y = inputStartY*tileHScale;
	inputString(_stage, maxInputSize, x, y, playerName, inputComplete);
	
	function inputComplete(string) 
	{
		setPlayerName(string);
		playerName = string;
		
		//remove const object
		for(var i = 0; i < constObj.length; i++) 
			_stage.removeChild(constObj[i]);
		
		//remove textBackground, textBorder & background
		_stage.removeChild(textBackground, textBorder, background);
		_stage.update();
		_callbackFun();
	}
}
 

function inputString(_stage, _maxSize, _startX, _startY, _defaultString, _callbackFun) 
{
	var inputText, inputObj;
	var curPos = 0;
	var savedKeyDownHander, hiScoreTicker;
	var cursor;

	initInput();
		
	function initInput()
	{
		inputNameState = 1;
		
		curPos = _defaultString.length; // cursor start position
		inputText = _defaultString.split(""); //string to array
		inputObj = []; //text object
			
		cursor = new createjs.Sprite(textData, "FLASH");
		cursor.setTransform(_startX, _startY, tileScale, tileScale);
		_stage.addChild(cursor);
			
		drawString();
		changeKeyDownHandler();
		//hiScoreTicker = createjs.Ticker.on("tick", scoreStage);	
	}
		
	function drawString()
	{
		clearStringObj();
		inputObj = drawText(_startX, _startY, inputText.join(""), _stage, "D");

		//change cursor position
		cursor.x = _startX + curPos * tileWScale;

		//move cursor to top
		moveChild2Top(_stage, cursor);
	}	
	
	function clearStringObj()
	{
		for(var i = 0; i < inputObj.length; i++) 
			_stage.removeChild(inputObj[i]);
	}
	
	function changeKeyDownHandler()
	{
		savedKeyDownHander = document.onkeydown;
		document.onkeydown = handleStringInput;
	}
	
	function restoreKeyDownHandler()
	{
		document.onkeydown = savedKeyDownHander;
	}	

	function nextChar(charValue, nextMode)
	{
		if(typeof(charValue) == "undefined") charValue = " ";
		var code = charValue.charCodeAt(0);
			
		if(nextMode >=0) code++; else code--;
			
		if (code < 65 || code > 90) { //out of A-Z
			if(nextMode >=0) code = 65;
			else code= 90;
		}
		return String.fromCharCode(code);
	}	
	
	function handleStringInput(event)
	{
		if(!event){ event = window.event; } //cross browser issues exist
			
		var code = event.keyCode;
			
		if(curPos >= _maxSize && code != KEYCODE_BKSPACE && code != KEYCODE_LEFT && code != KEYCODE_ENTER) 
		{
			soundPlay("beep"); //wrong key code	
			return false;
		}

		switch(true) {
		case (code >= 48 && code <= 57): // 0 ~ 9
			if(curPos == 0) { soundPlay("beep"); break; } //first char except numbers
			inputText[curPos++] = String.fromCharCode(code);
			break;	
		case (code >=65 && code <= 90): // A ~ Z
		case (code >= 97 && code <= 122): //a ~ z
			if( code > 90) code -= 32;	
			inputText[curPos++] = String.fromCharCode(code);
			break;
		case (code == KEYCODE_DOT): //'.'		
			if(curPos == 0) { soundPlay("beep"); break;	} //first char except '.'
			inputText[curPos++] = ".";
			break;
		case (code == KEYCODE_DASH || code == KEYCODE_HYPHEN || code == KEYCODE_SUBTRACT): //'-'
			if(curPos == 0) { soundPlay("beep"); break;	} //first char except '-'
			inputText[curPos++] = "-";
			break;
		case (code == KEYCODE_SPACE): //space
			if(curPos == 0) { soundPlay("beep"); break;	} //first char except space
			inputText[curPos++] = " ";
			break;
		case (code == KEYCODE_BKSPACE): //backspace
			if(curPos == 0) break;
			inputText.splice(--curPos, 1);
			break;
		case (code == KEYCODE_LEFT): //LEFT
			if(curPos > 0) curPos--;	
			break;
		case (code == KEYCODE_RIGHT): //RIGHT
			if(curPos < inputText.length) curPos++;	
			break;
		case (code == KEYCODE_UP): //UP
			inputText[curPos] = nextChar(inputText[curPos], 1);
			break;
		case (code == KEYCODE_DOWN): //DOWN
			inputText[curPos] = nextChar(inputText[curPos], -1);
			break;
		case (code == KEYCODE_ENTER): //ENTER
			if(inputText.length > 0) { 
				inputFinish();
				return true;
			} else soundPlay("beep");	
			break;	
		default:
			//debug(code);	
			if(code > 32) soundPlay("beep"); //wrong key code	
			break;	
		}
			
		drawString();
		return false;
	}
	
	function inputFinish()
	{
		//cut tail space
		for(var i = inputText.length-1; i >= 0; i--) {
			if(inputText[i] == " ") inputText.splice(i,1);
			else break;
		}
		
		restoreKeyDownHandler();

		//remove cursor
		clearStringObj();
		_stage.removeChild(cursor);
		_stage.update();

		_callbackFun(inputText.join(""));
		
		inputNameState = 0;
	}
}
