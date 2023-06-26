
var mouseOverBGColor = "#fefef1"; //icon background color while mouse over it

function mainMenuIconClass( _screenX1, _screenY1, _scale, _mainMenuBitmap)
{
	//_scale = _scale*2/3;
	var border = 4 * _scale;
	var mainMainCanvas, stage;
	var	menuIcon, menuBG;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _mainMenuBitmap.getBounds().width * _scale;
	var bitmapY = _mainMenuBitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	init();
	
	function init()
	{
		createCanvas();
		createMenuIcon();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		menuIcon.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			menuIcon.set({alpha:0})
		} else {
			menuIcon.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}
	
	function enableMouseHandler()
	{
		mouseOverHandler = menuIcon.on("mouseover", mouseOver);
		mouseOutHandler = menuIcon.on("mouseout", mouseOut);
		mouseClickHandler = menuIcon.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		menuIcon.removeEventListener("mouseover", mouseOverHandler);
		menuIcon.removeEventListener("mouseout", mouseOutHandler);
		menuIcon.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		mainMainCanvas = document.createElement('canvas');
		mainMainCanvas.id     = "main_menu";
		mainMainCanvas.width  = bitmapX+border*2;
		mainMainCanvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - mainMainCanvas.width - screenBorder),
		    top  = bitmapY/2|0;
		
		mainMainCanvas.style.left = left + "px";
		mainMainCanvas.style.top =  top + "px";
		mainMainCanvas.style.position = "absolute";
		document.body.appendChild(mainMainCanvas);
	}
	
	function createMenuIcon()
	{
		stage = new createjs.Stage(mainMainCanvas);
		menuIcon = new createjs.Container();
		menuBG = new createjs.Shape();
		
		menuBG.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		menuBG.alpha = 0;
		menuIcon.addChild(menuBG);
		_mainMenuBitmap.setTransform(border, border, _scale, _scale);
		menuIcon.addChild(_mainMenuBitmap);
		
		menuIcon.set({alpha:0})
		stage.addChild(menuIcon);
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || //// demoDataLoading ||
		   (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		stage.cursor = "pointer";
		menuBG.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		menuBG.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || //// demoDataLoading ||
		   (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		saveState();
		////mainMenu(restoreState);
		gameMenu(restoreState);
		mouseOut();
	}

	function saveState()
	{
		saveStateObj = saveKeyHandler(noKeyDown);
		gamePause();
		if(playMode == PLAY_EDIT) {
			if(editLevelModified()) saveTestState();
			stopEditTicker();
		} else {
			stopPlayTicker();
			stopAllSpriteObj();
		}
		self.disable();
	}
	
	function restoreState()
	{
		restoreKeyHandler(saveStateObj);
		if(playMode == PLAY_EDIT) {
			startEditTicker();
		} else {
			startAllSpriteObj();
			startPlayTicker();
		}
		gameResume();
		self.enable();
	}
}

function selectIconClass( _screenX1, _screenY1, _scale, _bitmap)
{
	var border = 4 * _scale;
	var selectCanvas, stage;
	var	selectIcon, selectBG;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _bitmap.getBounds().width * _scale;
	var bitmapY = _bitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	init();
	
	function init()
	{
		createCanvas();
		createSelectIcon();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		document.body.appendChild(selectCanvas);
		selectIcon.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			selectIcon.set({alpha:0})
		} else {
			selectIcon.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}
	
	function enableMouseHandler()
	{
		mouseOverHandler = selectIcon.on("mouseover", mouseOver);
		mouseOutHandler = selectIcon.on("mouseout", mouseOut);
		mouseClickHandler = selectIcon.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		selectIcon.removeEventListener("mouseover", mouseOverHandler);
		selectIcon.removeEventListener("mouseout", mouseOutHandler);
		selectIcon.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		selectCanvas = document.createElement('canvas');
		selectCanvas.id     = "select_menu";
		selectCanvas.width  = bitmapX+border*2;
		selectCanvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - selectCanvas.width - screenBorder),
		    top  = (selectCanvas.height + bitmapY)|0;
		
		selectCanvas.style.left = left + "px";
		selectCanvas.style.top =  top + "px";
		selectCanvas.style.position = "absolute";
		document.body.appendChild(selectCanvas);
	}
	
	function createSelectIcon()
	{
		stage = new createjs.Stage(selectCanvas);
		selectIcon = new createjs.Container();
		selectBG = new createjs.Shape();
		
		selectBG.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		selectBG.alpha = 0;
		selectIcon.addChild(selectBG);
		_bitmap.setTransform(border, border, _scale, _scale);
		selectIcon.addChild(_bitmap);
		
		selectIcon.set({alpha:0})
		stage.addChild(selectIcon);
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || 
		   (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		stage.cursor = "pointer";
		selectBG.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		selectBG.alpha = 0;
		stage.update();
	}
	
	function startSelectMenu()
	{
		saveState();
		activeSelectMenu(activeSelectPlay, restoreState);
		mouseOut();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || 
		   (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		
		if(playMode == PLAY_EDIT && editLevelModified()) {
			if(editLevelModified())saveTestState();
			editConfirmAbortState(startSelectMenu);
		} else {
			startSelectMenu();
		}
	}

	function activeSelectPlay(level)
	{
		soundStop(soundDig); 
		soundStop(soundFall);
		switch(playMode) {
		case PLAY_EDIT:
			editSelectLevel(level);
			break;
		case PLAY_DEMO:
			curLevel = level;
			setDemoInfo();	
			startGame();
			break;	
		case PLAY_MODERN:		
			curLevel = level;
			//playMode = PLAY_MODERN;
			//document.onkeydown = handleKeyDown;
			//setLastPlayMode();
			setModernInfo();
			startGame();
			break;	
		default:
			debug("activeSelectPlay design error ! playMode = " + playMode);
			break;	
		}
	}	

	function saveState()
	{
		saveStateObj = saveKeyHandler(noKeyDown);
		gamePause();
		if(playMode == PLAY_EDIT) {
			stopEditTicker();
		} else {
			stopPlayTicker();
			stopAllSpriteObj();
		}
		self.disable();
	}
	
	function restoreState()
	{
		restoreKeyHandler(saveStateObj);
		if(playMode == PLAY_EDIT) {
			startEditTicker();
		} else {
			startAllSpriteObj();
			startPlayTicker();
		}
		gameResume();
		self.enable();
	}
}

function demoIconClass( _screenX1, _screenY1, _scale, _bitmap)
{
	var border = 4 * _scale;
	var canvas, stage;
	var	iconObj, bgObj;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _bitmap.getBounds().width * _scale;
	var bitmapY = _bitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	init();
	
	function init()
	{
		createCanvas();
		createIconObj();
	}
	
	this.enable = function ()
	{
		if(!curDemoLevelIsVaild()) {
			self.disable(1); 
			return;
		}
		if(enabled) return;
		
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		iconObj.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			iconObj.set({alpha:0});
		} else {
			iconObj.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}
	
	function enableMouseHandler()
	{
		mouseOverHandler = iconObj.on("mouseover", mouseOver);
		mouseOutHandler = iconObj.on("mouseout", mouseOut);
		mouseClickHandler = iconObj.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		iconObj.removeEventListener("mouseover", mouseOverHandler);
		iconObj.removeEventListener("mouseout", mouseOutHandler);
		iconObj.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		canvas = document.createElement('canvas');
		canvas.id = "theme_menu";
		canvas.width  = bitmapX+border*2;
		canvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - canvas.width - screenBorder),
			top  = (canvas.height*2 + bitmapY*3/2)|0;
		
		canvas.style.left = left + "px";
		canvas.style.top =  top + "px";
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);
	}
	
	function createIconObj()
	{
		stage = new createjs.Stage(canvas);
		iconObj = new createjs.Container();
		
		//create background shape
		bgObj = new createjs.Shape();
		bgObj.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		bgObj.alpha = 0;
		
		//change bitmap size
		_bitmap.setTransform(border, border, _scale, _scale);
		
		iconObj.addChild(bgObj);
		iconObj.addChild(_bitmap);
		iconObj.set({alpha:0})
		
		stage.addChild(iconObj);
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || 
		   (gameState != GAME_START  && playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE && playMode != PLAY_EDIT))
			return;
		
		stage.cursor = "pointer";
		bgObj.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		bgObj.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || playMode == PLAY_DEMO_ONCE ||
		   (gameState != GAME_START && playMode != PLAY_DEMO && playMode != PLAY_EDIT))
			return;

		mouseOut();
		demoSoundOff = 1; //always sound off when start demo
		playMode = PLAY_DEMO_ONCE;
		anyKeyStopDemo();

		startGame(1);
		setTimeout(function() {showTipsText("HIT ANY KEY TO STOP DEMO", 3500);}, 50);
	}
	
	function saveState()
	{
		setThemeMode(curTheme);
		if(playMode == PLAY_EDIT) {
			if(editLevelModified()) saveTestState();
			stopEditTicker();
		} else {
			stopPlayTicker();
			stopAllSpriteObj();
		}
	}
}

function soundIconClass( _screenX1, _screenY1, _scale, _soundOnBitmap, _soundOffBitmap)
{
	var border = 4 * _scale;
	var canvas, stage;
	var	iconObj, bgObj;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _soundOnBitmap.getBounds().width * _scale;
	var bitmapY = _soundOnBitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	
	function init()
	{
		createCanvas();
		createIconObj();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		iconObj.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			iconObj.set({alpha:0});
		} else {
			iconObj.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}

	function enableMouseHandler()
	{
		mouseOverHandler = iconObj.on("mouseover", mouseOver);
		mouseOutHandler = iconObj.on("mouseout", mouseOut);
		mouseClickHandler = iconObj.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		iconObj.removeEventListener("mouseover", mouseOverHandler);
		iconObj.removeEventListener("mouseout", mouseOutHandler);
		iconObj.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		canvas = document.createElement('canvas');
		canvas.id = "theme_menu";
		canvas.width  = bitmapX+border*2;
		canvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - canvas.width - screenBorder),
			//top  = (_screenY1 - bitmapY*7)|0;
			top  = (_screenY1 - bitmapY*8.6)|0;
		
		canvas.style.left = left + "px";
		canvas.style.top =  top + "px";
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);
	}
	
	this.updateSoundImage = function()
	{
		iconObj.removeAllChildren();
		iconObj.addChild(bgObj);
		
		if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) {
			if(demoSoundOff) iconObj.addChild(_soundOffBitmap);
			else iconObj.addChild(_soundOnBitmap);
		} else {
			if(soundOff) iconObj.addChild(_soundOffBitmap);
			else iconObj.addChild(_soundOnBitmap);
		}
		stage.update();
	}	
	
	function createIconObj()
	{
		stage = new createjs.Stage(canvas);
		iconObj = new createjs.Container();
		
		//create background shape
		bgObj = new createjs.Shape();
		bgObj.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		bgObj.alpha = 0;
		
		//change bitmap size
		_soundOnBitmap.setTransform(border, border, _scale, _scale);
		_soundOffBitmap.setTransform(border, border, _scale, _scale);
		
		iconObj.set({alpha:0})
		
		stage.addChild(iconObj);
		self.updateSoundImage();
		stage.update();
	}

	function mouseOver()
	{
		if( gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING) ) return;
		   
		stage.cursor = "pointer";
		bgObj.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		bgObj.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if( gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING) ) return;

		if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) {
			if((demoSoundOff ^= 1)) { soundStop(soundDig); soundStop(soundFall); }
		} else {
			if((soundOff ^= 1)) { soundStop(soundDig); soundStop(soundFall); }
		}
		
		self.updateSoundImage();
		mouseOut();
	}	
	
	init();
}

function repeatActionIconClass( _screenX1, _screenY1, _scale, _repeatActionOnBitmap, _repeatActionOffBitmap)
{
	var border = 4 * _scale;
	var canvas, stage;
	var	iconObj, bgObj;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _repeatActionOnBitmap.getBounds().width * _scale;
	var bitmapY = _repeatActionOnBitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	function init()
	{
		createCanvas();
		createIconObj();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		iconObj.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			iconObj.set({alpha:0});
		} else {
			iconObj.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}

	function enableMouseHandler()
	{
		mouseOverHandler = iconObj.on("mouseover", mouseOver);
		mouseOutHandler = iconObj.on("mouseout", mouseOut);
		mouseClickHandler = iconObj.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		iconObj.removeEventListener("mouseover", mouseOverHandler);
		iconObj.removeEventListener("mouseout", mouseOutHandler);
		iconObj.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		canvas = document.createElement('canvas');
		canvas.id = "theme_menu";
		canvas.width  = bitmapX+border*2;
		canvas.height = bitmapY+border*2;
		
		var left = (_screenX1 - canvas.width - screenBorder),
		    top  = (_screenY1 - bitmapY*6.4)|0;
		
		canvas.style.left = left + "px";
		canvas.style.top =  top + "px";
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);
	}
	
	this.updateRepeatActionImage = function()
	{
		iconObj.removeAllChildren();
		iconObj.addChild(bgObj);
		
		if(repeatAction) iconObj.addChild(_repeatActionOnBitmap);
		else iconObj.addChild(_repeatActionOffBitmap);
		stage.update();
	}	
	
	function createIconObj()
	{
		stage = new createjs.Stage(canvas);
		iconObj = new createjs.Container();
		
		//create background shape
		bgObj = new createjs.Shape();
		bgObj.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		bgObj.alpha = 0;
		
		//change bitmap size
		_repeatActionOnBitmap.setTransform(border, border, _scale, _scale);
		_repeatActionOffBitmap.setTransform(border, border, _scale, _scale);
		
		iconObj.set({alpha:0})
		
		stage.addChild(iconObj);
		self.updateRepeatActionImage();
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING) ||
		   playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE || playMode == PLAY_EDIT) return;
		   
		stage.cursor = "pointer";
		bgObj.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		bgObj.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING) ||
		   playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE || playMode == PLAY_EDIT) return;
		
		toggleRepeatAction();
		self.updateRepeatActionImage();
		mouseOut();
	}	
	
	init();
}

function infoIconClass( _screenX1, _screenY1, _scale, _bitmap)
{
	var border = 4 * _scale;
	var canvas, stage;
	var	iconObj, bgObj;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _bitmap.getBounds().width * _scale;
	var bitmapY = _bitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	
	function init()
	{
		createCanvas();
		createIconObj();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		iconObj.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			iconObj.set({alpha:0});
		} else {
			iconObj.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}

	function enableMouseHandler()
	{
		mouseOverHandler = iconObj.on("mouseover", mouseOver);
		mouseOutHandler = iconObj.on("mouseout", mouseOut);
		mouseClickHandler = iconObj.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		iconObj.removeEventListener("mouseover", mouseOverHandler);
		iconObj.removeEventListener("mouseout", mouseOutHandler);
		iconObj.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		canvas = document.createElement('canvas');
		canvas.id = "info_menu";
		canvas.width  = bitmapX+border*2;
		canvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - canvas.width - screenBorder),
		    top  = (_screenY1 - bitmapY*4.8);
		
		canvas.style.left = left + "px";
		canvas.style.top =  top + "px";
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);
	}
	
	function createIconObj()
	{
		stage = new createjs.Stage(canvas);
		iconObj = new createjs.Container();
		
		//create background shape
		bgObj = new createjs.Shape();
		bgObj.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		bgObj.alpha = 0;
		
		//change bitmap size
		_bitmap.setTransform(border, border, _scale, _scale);
		
		iconObj.addChild(bgObj);
		iconObj.addChild(_bitmap);
		
		iconObj.set({alpha:0})
		
		stage.addChild(iconObj);
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		
		stage.cursor = "pointer";
		bgObj.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		bgObj.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		saveState();
		infoMenu(restoreState, null);
		mouseOut();
	}	
	
	function saveState()
	{
		saveStateObj = saveKeyHandler(noKeyDown);
		gamePause();
		if(playMode == PLAY_EDIT) {
			if(editLevelModified()) saveTestState();
			stopEditTicker();
		} else {
			stopPlayTicker();
			stopAllSpriteObj();
		}
		self.disable();
	}
	
	function restoreState()
	{
		restoreKeyHandler(saveStateObj);
		if(playMode == PLAY_EDIT) {
			startEditTicker();
		} else {
			startAllSpriteObj();
			startPlayTicker();
		}
		gameResume();
		self.enable();
	}	
	init();
}

function helpIconClass( _screenX1, _screenY1, _scale, _bitmap)
{
	var border = 4 * _scale;
	var canvas, stage;
	var	iconObj, bgObj;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _bitmap.getBounds().width * _scale;
	var bitmapY = _bitmap.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	
	function init()
	{
		createCanvas();
		createIconObj();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		iconObj.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			iconObj.set({alpha:0});
		} else {
			iconObj.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}

	function enableMouseHandler()
	{
		mouseOverHandler = iconObj.on("mouseover", mouseOver);
		mouseOutHandler = iconObj.on("mouseout", mouseOut);
		mouseClickHandler = iconObj.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		iconObj.removeEventListener("mouseover", mouseOverHandler);
		iconObj.removeEventListener("mouseout", mouseOutHandler);
		iconObj.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		canvas = document.createElement('canvas');
		canvas.id = "help_menu";
		canvas.width  = bitmapX+border*2;
		canvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - canvas.width - screenBorder),
		    top  = (_screenY1 - bitmapY*3.2);
		
		canvas.style.left = left + "px";
		canvas.style.top =  top + "px";
		canvas.style.position = "absolute";
		document.body.appendChild(canvas);
	}
	
	function createIconObj()
	{
		stage = new createjs.Stage(canvas);
		iconObj = new createjs.Container();
		
		//create background shape
		bgObj = new createjs.Shape();
		bgObj.graphics.beginFill(mouseOverBGColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		bgObj.alpha = 0;
		
		//change bitmap size
		_bitmap.setTransform(border, border, _scale, _scale);
		
		iconObj.addChild(bgObj);
		iconObj.addChild(_bitmap);
		
		iconObj.set({alpha:0})
		
		stage.addChild(iconObj);
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		
		stage.cursor = "pointer";
		bgObj.alpha = 1;
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		bgObj.alpha = 0;
		stage.update();
	}
	
	function mouseClick()
	{
		if(gameState == GAME_PAUSE || (gameState != GAME_START && gameState != GAME_RUNNING && playMode != PLAY_EDIT)) return;
		saveState();
		helpMenu(restoreState); 
		mouseOut();
	}	
	
	function saveState()
	{
		saveStateObj = saveKeyHandler(noKeyDown);
		gamePause();
		if(playMode == PLAY_EDIT) {
			if(editLevelModified()) saveTestState();
			stopEditTicker();
		} else {
			stopPlayTicker();
			stopAllSpriteObj();
		}
		self.disable();
	}
	
	function restoreState()
	{
		restoreKeyHandler(saveStateObj);
		if(playMode == PLAY_EDIT) {
			startEditTicker();
		} else {
			startAllSpriteObj();
			startPlayTicker();
		}
		gameResume();
		self.enable();
	}	
	init();

}

function themeIconClass( _screenX1, _screenY1, _scale, _themeBitmapApple2, _themeBitmapC64)
{
	var border = 4 * _scale;
	var themeCanvas, stage;
	var	themeIcon, themeBG;
	var saveStateObj;
	var mouseOverHandler = null, mouseOutHandler = null, mouseClickHandler = null;
	
	var bitmapX = _themeBitmapApple2.getBounds().width * _scale;
	var bitmapY = _themeBitmapApple2.getBounds().height * _scale;	
	var self = this;
	var enabled = 0;
	
	var outColor = backgroundColor;
	
	init();
	
	function init()
	{
		createCanvas();
		createThemeIcon();
	}
	
	this.enable = function ()
	{
		if(enabled) return;
		enabled = 1;
		disableMouseHandler();
		enableMouseHandler();
		themeIcon.set({alpha:1})
		stage.enableMouseOver(60);
		stage.update();
	}
	
	this.disable = function (hidden)
	{
		disableMouseHandler();
		if(hidden) {
			themeIcon.set({alpha:0});
		} else {
			themeIcon.set({alpha:1})
		}
		stage.update();
		enabled = 0;
		stage.enableMouseOver(0);
	}
	
	function enableMouseHandler()
	{
		mouseOverHandler = themeIcon.on("mouseover", mouseOver);
		mouseOutHandler = themeIcon.on("mouseout", mouseOut);
		mouseClickHandler = themeIcon.on("click", mouseClick);
	}
	
	function disableMouseHandler()
	{
		themeIcon.removeEventListener("mouseover", mouseOverHandler);
		themeIcon.removeEventListener("mouseout", mouseOutHandler);
		themeIcon.removeEventListener("click", mouseClickHandler);
		stage.cursor = "default";
		stage.update();
	}
	
	function createCanvas()
	{
		themeCanvas = document.createElement('canvas');
		themeCanvas.id = "theme_menu";
		themeCanvas.width  = bitmapX+border*2;
		themeCanvas.height = bitmapY+border*2;
	
		var left = (_screenX1 - themeCanvas.width - screenBorder),
		    top  = (_screenY1 - bitmapY*1.5);
		
		themeCanvas.style.left = left + "px";
		themeCanvas.style.top =  top + "px";
		themeCanvas.style.position = "absolute";
		document.body.appendChild(themeCanvas);
	}
	
	function createThemeIcon()
	{
		stage = new createjs.Stage(themeCanvas);
		themeIcon = new createjs.Container();
		
		//create background shape
		themeBG = new createjs.Shape();
		themeBG.graphics.beginFill(outColor)
			      .drawRect(0, 0, bitmapX+border*2, bitmapY+border*2).endFill();
		//themeBG.alpha = 0;
		
		//change bitmap size
		_themeBitmapApple2.setTransform(border, border, _scale, _scale);
		_themeBitmapC64.setTransform(border, border, _scale, _scale);
		
		themeIcon.set({alpha:0})
		stage.addChild(themeIcon);
		updateThemeImage(0);
	}
	
	function updateThemeImage(showTips)
	{
		themeIcon.removeAllChildren();
		themeIcon.addChild(themeBG);
		
		if(curTheme == THEME_APPLE2) {
			themeIcon.addChild(_themeBitmapApple2);
			//if(showTips) setTimeout(function() {showTipsText("APPLE-II THEME MODE", 2500);}, 50);
		} else {
			themeIcon.addChild(_themeBitmapC64);
			//if(showTips) setTimeout(function() {showTipsText("C64 THEME MODE", 2500);}, 50);
		}
		
		stage.update();
	}
	
	function mouseOver()
	{
		if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
		stage.cursor = "pointer";
		stage.update();
	}
	
	function mouseOut()
	{
		stage.cursor = "default";
		stage.update();
	}

	function mouseClick()
	{
		if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
		curTheme = (curTheme == THEME_APPLE2?THEME_C64:THEME_APPLE2);
		
		saveState();

		soundStop(soundDig); 
		soundStop(soundFall);
	
		themeDataReset(1);
		updateThemeImage(1);
		themeColorIconUpdate();
		
		if(playMode == PLAY_EDIT) {
			startEditMode();		
		} else {
			changeThemeScreen(); //real time change theme screen
		}
	}
	
	function saveState()
	{
		setThemeMode(curTheme);
		if(playMode == PLAY_EDIT) {
			if(editLevelModified()) saveTestState();
			stopEditTicker();
		}
	}
}

function themeColorIconUpdate()
{
	themeColorObj.themeChange();
}

//======================================
// BEGIN: Change Theme Screen real time
//======================================

function changeThemeScreen()
{
	rebuildMap();
	
	//Change runner theme
	runner.sprite.spriteSheet = runnerData;
	
	//change guard theme
	for(var i = 0; i < guardCount; i++) {
		if(redhatMode && guard[i].hasGold > 0)
			guard[i].sprite.spriteSheet = redhatData;
		else
			guard[i].sprite.spriteSheet = guardData;
	}
	
	//change holeObj theme
	holeObj.sprite.spriteSheet = holeData;
	
	//change fillHoleObj theme
	for(var i = 0; i < fillHoleObj.length; i++) {
		fillHoleObj[i].spriteSheet = holeData;
	}
	
	moveSprite2Top();
	
	clearGround();
	clearInfo();
	initInfoVariable();
	buildGroundInfo();
}

function rebuildMap() 
{
	var curTile;
	
	for(var x = 0; x < NO_OF_TILES_X; x++) {
		for(var y = 0; y < NO_OF_TILES_Y; y++) {
			switch(map[x][y].base) {
			default:		
			case EMPTY_T: //empty		
				continue;
			case BLOCK_T: //Normal Brick		
				curTile = getThemeBitmap("brick");		
				if(map[x][y].bitmap.alpha < 1) curTile.set({alpha:0}); //hide brick digging
				break;	
			case SOLID_T: //Solid Brick		
				curTile = getThemeBitmap("solid");		
				break;	
			case LADDR_T: //Ladder
				curTile = getThemeBitmap("ladder");
				break;	
			case BAR_T: //Line of rope
				curTile = getThemeBitmap("rope");
				break;	
			case TRAP_T: //False brick
				curTile = getThemeBitmap("brick");
				if(map[x][y].bitmap.alpha < 1) curTile.set({alpha:0.5}); //show trap tile
				break;
			case HLADR_T: //Ladder appears at end of level
				curTile = getThemeBitmap("ladder");
				curTile.set({alpha:0});	//hide the laddr
				break;
			case GOLD_T: //Gold
				curTile = getThemeBitmap("gold");
				break;	
			}
			mainStage.removeChild(map[x][y].bitmap); //remove old
			curTile.setTransform(x * tileWScale, y * tileHScale, tileScale, tileScale); //x,y, scaleX, scaleY 
			mainStage.addChild(curTile);  //add new
			map[x][y].bitmap = curTile;   //replace bitmap 
		}
	}
}

function clearGround()
{
	for(var i = 0; i < groundTile.length; i++) 
		mainStage.removeChild(groundTile[i]);
}

function clearInfo()
{
	var i;

	if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
		for(i = 0; i < scoreTxt.length; i++) mainStage.removeChild(scoreTxt[i]);
		for(i = 0; i < scoreTile.length; i++) mainStage.removeChild(scoreTile[i]);

		if(playMode == PLAY_DEMO) {
			for(i = 0; i < demoTxt.length; i++) mainStage.removeChild(demoTxt[i]);
		} else {
			for(i = 0; i < lifeTxt.length; i++) mainStage.removeChild(lifeTxt[i]);
			for(i = 0; i < lifeTile.length; i++) mainStage.removeChild(lifeTile[i]);
		}
	} else { //PLAY_MODERN, PLAY_DEMO_ONCE
		for(i = 0; i < goldTxt.length; i++) mainStage.removeChild(goldTxt[i]);
		for(i = 0; i < goldTile.length; i++) mainStage.removeChild(goldTile[i]);

		for(i = 0; i < guardTxt.length; i++) mainStage.removeChild(guardTxt[i]);
		for(i = 0; i < guardTile.length; i++) mainStage.removeChild(guardTile[i]);

		for(i = 0; i < timeTxt.length; i++) mainStage.removeChild(timeTxt[i]);
		for(i = 0; i < timeTile.length; i++) mainStage.removeChild(timeTile[i]);
	}
	
	for(i = 0; i < levelTxt.length; i++) mainStage.removeChild(levelTxt[i]);
	for(i = 0; i < levelTile.length; i++) mainStage.removeChild(levelTile[i]);	
}

//======================================
// END: Change Theme Screen real time
//======================================