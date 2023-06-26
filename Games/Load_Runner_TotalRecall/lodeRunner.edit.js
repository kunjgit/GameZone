var emptyTile, actTile;
var cursorTileObj;
var editMap;
	
var MAX_EDIT_GUARD = 5;     //maximum number of guards
var EMPTY_ID = 0, GUARD_ID = 8, RUNNER_ID = 9;
var EDIT_PADDING = 1;

//value | Character | Type
//------+-----------+-----------
//  0x0 |  <space>  | Empty space
//  0x1 |     #     | Normal Brick
//  0x2 |     @     | Solid Brick
//  0x3 |     H     | Ladder
//  0x4 |     -     | Hand-to-hand bar (Line of rope)
//  0x5 |     X     | False brick
//  0x6 |     S     | Ladder appears at end of level
//  0x7 |     $     | Gold chest
//  0x8 |     0     | Guard
//  0x9 |     &     | Player

var tileIdMapping = { ' ':0, '#':1, '@':2, 'H':3, '-':4, 'X':5, 'S':6, '$':7, '0':8, '&':9 };

var tileInfo = [
	[ "eraser",   ' ' ], //(0), empty
	[ "brick",    '#' ], //(1)
	[ "solid",    '@' ], //(2)
	[ "ladder",   'H' ], //(3)
	[ "rope",     '-' ], //(4)
	[ "trapBrick",'X' ], //(5)
	[ "hladder",  'S' ], //(6)
	[ "gold",     '$' ], //(7)
	[ "guard1",   '0' ], //(8)
	[ "runner1",  '&' ]  //(9)
];

var baseTile=[];	
var lastRunner = null;
var lastGuardList = [];	
var editBorder, editStartX;
var testLevelInfo = {level: -1};

var mouseInStage = 1;
//var mouseOver = 0;	
var mouseDown = 0;
var lastDown = {x:-1, y:-1};

var testButton, newButton, saveButton, loadButton;
var editorTile =[], editorActiveTileId = -1;
var editorButton = [], editorButtonMouseOverId = -1;
var editInNarrowScreen = 0;

function startEditMode() 
{
	playMode = PLAY_EDIT;
	playData = PLAY_DATA_USERDEF; //for title name only
	mainStage.removeAllChildren();
	document.onkeydown = editHandleKeyDown;
	
	editInNarrowScreen = canvasEditReSize();
	
	soundIconObj.disable(1);
	repeatActionIconObj.disable(1);
	if(editInNarrowScreen) themeColorObj.disable(1);
	//if(gamepadIconObj) gamepadIconObj.disable(1);
	
	
	setEditSelectMenu();
	
	createBaseTile();
	createEditMap();
	startEditTicker();
	setButtonState();
	initForPlay();
}

function setEditSelectMenu()
{
	if(editLevels>0)selectIconObj.enable(); 
	else selectIconObj.disable(1);
}

function canvasEditReSize()
{
	var menuIconAreaX = screenBorder + BASE_ICON_X * tileScale; //current icon size X
	var toolAreaX = BASE_TILE_X*3/2; //edit tool size X
	var canvas = document.getElementById('canvas');
	var narrowScreen = 0;
	
	//(1) try use scale same as play mode 
	canvasX = (BASE_SCREEN_X+toolAreaX) * tileScale + EDIT_PADDING * (NO_OF_TILES_X+1);
	canvasY =  BASE_SCREEN_Y * tileScale + EDIT_PADDING * (NO_OF_TILES_Y+1);
	
	if(canvasX > (screenX1 - menuIconAreaX) || canvasY > screenY1) {
		//(2) can not fit, find new scale 
		for (var scale = MAX_SCALE*100; scale >= MIN_SCALE*100; scale -= 10) {
			tileScale = scale/100; //new scale 
			canvasX = (BASE_SCREEN_X+toolAreaX) * tileScale + EDIT_PADDING * (NO_OF_TILES_X+1);
			canvasY =  BASE_SCREEN_Y * tileScale + EDIT_PADDING * (NO_OF_TILES_Y+1);
			if (canvasX <= (screenX1 - menuIconAreaX) && canvasY <= screenY1 || tileScale <= MIN_SCALE) break;
		}
	}
	debug("EDIT SCALE = " + tileScale);

	var left = ((screenX1 - canvasX)/2|0),
		top  = ((screenY1 - canvasY)/2|0);
	
	if(left < menuIconAreaX) {
		narrowScreen = 1;
		left = ((screenX1 - canvasX - menuIconAreaX)/2|0);
	}

	canvas.width = canvasX;
	canvas.height = canvasY;
	
	canvas.style.left = (left>0?left:0) + "px";
	canvas.style.top =  (top>0?top:0) + "px";
	canvas.style.position = "absolute";
	
	tileWScale = BASE_TILE_X * tileScale;
	tileHScale = BASE_TILE_Y * tileScale;
	
	editBorder = 4 * tileScale;	
	editStartX = (tileWScale + W2 * tileScale);
	
	return narrowScreen;
}

function createBaseTile()
{
	for(var id = 0; id < tileInfo.length; id++) {
		baseTile[id] = { image: getThemeBitmap(tileInfo[id][0]).image, id: id };
	}
	
	emptyTile = { image: getThemeBitmap("empty").image, id: 0 };
	actTile = baseTile[1];
}

function createEditMap() 
{
	var tile, backColor, bitmap;
		
	setCanvasBackground();
	setEditBackground(editStartX,0, 
				 (tileWScale+EDIT_PADDING)*NO_OF_TILES_X+EDIT_PADDING,
				 (tileHScale+EDIT_PADDING)*NO_OF_TILES_Y+EDIT_PADDING
	);
	initMapInfo();
	getTestLevel(testLevelInfo);
	
	
	//(1) create empty map[x][y] array;
	editMap = [];
	for(var x = 0; x < NO_OF_TILES_X; x++) {
		editMap[x] = [];
	}
	
	//(2) draw map
	var index = 0;
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			var id = tile2Id(testLevelInfo.levelMap.charAt(index++));
			tile = new createjs.Container();
				
			backColor = new createjs.Shape();
			backColor.graphics.beginFill("black").drawRect(0, 0, tileWScale, tileHScale).endFill();
			if(id == 0) {
				bitmap = new createjs.Bitmap(emptyTile.image);
			} else {
				bitmap = new createjs.Bitmap(baseTile[id].image);
			}
			bitmap.scaleX = bitmap.scaleY = tileScale;
			
			tile.addChild(backColor, bitmap);
			tile.x = (tileWScale + EDIT_PADDING) * x+EDIT_PADDING + editStartX;
			tile.y = (tileHScale + EDIT_PADDING) * y+EDIT_PADDING;
			editMap[x][y] = { tile: tile, id: id };
			mainStage.addChild(tile); 
			addManCheck(id, x, y);
		}
	}
	
	drawEditGround();
	drawEditBlock(editStartX,0, canvasX-editStartX-1,
				 (tileHScale+EDIT_PADDING)*NO_OF_TILES_Y+EDIT_PADDING
	);
	
	addSelectIcon();
 	addCursorTile();
	drawEditLevel();
 	
	addEditorButton();
	
	mouseInStage = 1;
	mainStage.on("stagemouseup", stageMouseUp);
	mainStage.on("stagemousedown", stageMouseDown);
	mainStage.on("mouseleave", function() { mouseInStage = 0; });
	mainStage.on("mouseenter", function() { mouseInStage = 1; });
}

function clearEditMap()
{
	initMapInfo();	
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			var tileObj = editMap[x][y];
			tileObj.tile.getChildAt(1).image =  emptyTile.image;
			tileObj.id = emptyTile.id;
		}
	}
}

function tile2Id(tileChar)
{
	if( tileIdMapping.hasOwnProperty(tileChar)) {
		return tileIdMapping[tileChar];
	} else {
		return 0;
	}
}

function setCanvasBackground()
{
	//set background color
	var background = new createjs.Shape();
	background.graphics.beginFill("black").drawRect(0, 0, canvas.width, canvas.height);
	mainStage.addChild(background);
	document.body.style.background = backgroundColor;
}

function setEditBackground(startX, startY, width, height)
{
	var editBack = new createjs.Shape();
	editBack.alpha = 0.6;
	editBack.graphics.beginFill("gold").drawRect(startX, startY, width, height);
	mainStage.addChild(editBack);
}
	
function drawEditBlock(startX, startY, width, height)
{
	var editBlock = new createjs.Shape();

	editBlock.alpha = 0.6;
	editBlock.graphics.setStrokeStyle(2);
	editBlock.graphics.beginStroke("red");	
	editBlock.graphics.moveTo(startX, startY);
	editBlock.graphics.lineTo(startX+width, startY);
	editBlock.graphics.lineTo(startX+width, startY+height);
	editBlock.graphics.lineTo(startX, startY+height);
	editBlock.graphics.lineTo(startX, startY);
	editBlock.graphics.endStroke();
	
	mainStage.addChild(editBlock);
}

function drawEditGround()
{
	var groundTile;
	var x = (tileWScale + EDIT_PADDING) * NO_OF_TILES_X+EDIT_PADDING + editStartX;
	var y = (tileHScale + EDIT_PADDING) * NO_OF_TILES_Y+EDIT_PADDING;
	
	groundTile = new createjs.Shape();
	groundTile.graphics.beginFill(getThemeTileColor()).drawRect(0, 0, x, 10*tileScale);
	groundTile.x = 0;
	groundTile.y = y;

	mainStage.addChild(groundTile); 
}

function addSelectIcon()
{
	var x = W4 * tileScale;
	var y;
	for(var i = 1; i < baseTile.length; i++) {
		y = (tileHScale*5/3)*(i-1) + tileHScale/10;
		drawSelectIcon(i, x, y);
	}
	y = (tileHScale*5/3)*(i-1) + tileHScale/10;
	drawSelectIcon(0, x, y);
}
	
function addCursorTile()
{
	var backColor, bitmap;
	
	cursorTileObj = new createjs.Container();
				
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("black").drawRect(0, 0, tileWScale, tileHScale).endFill();
	bitmap = new createjs.Bitmap(actTile.image);
	bitmap.scaleX = bitmap.scaleY = tileScale;
				
	cursorTileObj.addChild(backColor, bitmap);
	cursorTileObj.alpha = 0;	
	mainStage.addChild(cursorTileObj);

}

//var gameTicker = null; ....//same as playTicker
function startEditTicker()
{
	stopEditTicker();
	createjs.Ticker.setFPS(60);
	mainStage.enableMouseOver(0);
	gameTicker = createjs.Ticker.on("tick", editTick);	
}
	
function stopEditTicker()
{
	if(gameTicker) {
		createjs.Ticker.off("tick", gameTicker);
		mainStage.enableMouseOver(0);
		//mainStage.cursor = 'default';
		gameTicker = null;
	}
}

function drawSelectIcon(id, x, y)
{
	var tile, border, backColor, bitmap;
	var selColor;
	
	tile = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	if(id == actTile.id) {
		selColor = "red";
		selectedTile = tile;
	} else {
		selColor = "black";
	}
	border.graphics.beginFill(selColor).drawRect(-editBorder, -editBorder, tileWScale+editBorder*2, tileHScale+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("black").drawRect(0, 0, tileWScale, tileHScale).endFill();
	
	//child id = 2
	if(id == 0) {
		bitmap = new createjs.Bitmap(preload.getResult("eraser")); //id=2
	} else {
		bitmap = new createjs.Bitmap(baseTile[id].image); //id=2
	}
	bitmap.scaleX = bitmap.scaleY = tileScale;
				
	tile.addChild(border, backColor, bitmap);
		
	tile.x = x;
	tile.y = y;
	tile.myId = id;
	tile.on('click', selectTileClick);
	mainStage.addChild(tile);
	
	tile.x1 = x + tileWScale;
	tile.y1 = y + tileHScale;
	editorTile[id] = tile;
}
	
function selectTileClick()
{
	var actBorder = this.getChildAt(0);
	var inActBorder = selectedTile.getChildAt(0);
	
	inActBorder.graphics.clear();
	inActBorder.graphics.beginFill("black").drawRect(-editBorder, -editBorder, tileWScale+editBorder*2, tileHScale+editBorder*2).endFill();
	
	actBorder.graphics.clear();
	actBorder.graphics.beginFill("red").drawRect(-editBorder, -editBorder, tileWScale+editBorder*2, tileHScale+editBorder*2).endFill();
	
	actTile = baseTile[this.myId];
	cursorTileObj.getChildAt(1).image =  actTile.image;
	selectedTile = this;
}
	
function drawEditLevel()
{
	var x = 17.2*(tileWScale+EDIT_PADDING)+EDIT_PADDING;	
	var y = canvas.height - tileHScale - editBorder;
	
	drawText(x, y, "EDIT", mainStage);	
	x += 4.3*(tileWScale+EDIT_PADDING);
	drawText(x, y, "LEVEL", mainStage);	
	drawEditLevelNo();
}

var editLevelNoObj = [];
function drawEditLevelNo()
{
	var y = canvas.height - tileHScale - editBorder;
	
	for(var i = 0; i < editLevelNoObj.length; i++) 
		mainStage.removeChild(editLevelNoObj[i]);
	
	editLevelNoObj = drawText(26.5*(tileWScale+EDIT_PADDING), y, ("00"+(testLevelInfo.level)).slice(-3), mainStage);
}

function addEditorButton()
{
	editorButton = [];
	editorButtonMouseOverId = -1;
	
	drawNewButton();
	drawLoadButton();
	drawTestButton();
	drawSaveButton();
	
	enableTestButton();
}

function drawNewButton()
{
	var border, backColor, text;
	var textSting = "NEW";
	var width = textSting.length * tileWScale;
	var x = 0.5*(tileWScale+EDIT_PADDING)+EDIT_PADDING;
	var y = canvas.height - tileHScale - editBorder;
	
	newButton = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	border.graphics.beginFill("#40F").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileHScale).endFill();
	
	newButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, newButton);
		
	newButton.x = x;
	newButton.y = y;
	newButton.on('click', newButtonClick);
	mainStage.addChild(newButton);	
	
	newButton.x1 = x + width;
	newButton.y1 = y + tileHScale;
	editorButton[editorButton.length] = newButton;
	
	function newLevel(rc)
	{
		if(rc) 	{
			clearEditMap();
			if(testLevelInfo.level <= editLevels) { //edit exist level
				testLevelInfo.level = editLevels+1;
				drawEditLevelNo();
			}
			if(testLevelInfo.level > MAX_EDIT_LEVEL) {
				setButtonState();
			} else {
				disableTestButton();
			}
			clearTestLevel();
			testLevelInfo.fromPlayData = -1; 
			testLevelInfo.fromLevel = -1;
		}
		startEditTicker();
		gameResume();
	}
	
	function newButtonClick()
	{
		gamePause();
		stopEditTicker();
		if(testLevelInfo.modified) {
			yesNoDialog(["Abort current editing ?"], yesBitmap, noBitmap, mainStage, tileScale, newLevel);
		} else {
			newLevel(1);
		}
	}
}

function drawLoadButton()
{
	var border, backColor, text;
	var textSting = "LOAD";
	var width = textSting.length * tileWScale;
	var x = 4*(tileWScale+EDIT_PADDING)+EDIT_PADDING;
	var y = canvas.height - tileHScale - editBorder;
	var saveStateObj;
	var loadLevelData, loadPlayData;
	var editGameVersionList = [
		{ activeItem: 0 } //game version menu ID
	];
	
	loadButton = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	border.graphics.beginFill("#40F").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileHScale).endFill();
	
	loadButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, loadButton);
		
	loadButton.x = x;
	loadButton.y = y;
	loadButton.on('click', loadButtonClick);
	mainStage.addChild(loadButton);	
	initLoadVariable();

	loadButton.x1 = x + width;
	loadButton.y1 = y + tileHScale;
	editorButton[editorButton.length] = loadButton;
	
	function saveState()
	{
		//saveStateObj = saveKeyHandler(noKeyDown);
		gamePause();
		stopEditTicker();
	}
	
	function restoreState()
	{
		//restoreKeyHandler(saveStateObj);
		startEditTicker();
		gameResume();
	}
	
	function initLoadVariable()
	{
		for(var i = 0; i < playVersionInfo.length; i++) {
			editGameVersionList.push( 
			{ 
				name: playVersionInfo[i].name + " (" + playVersionInfo[i].verData.length + " Levels) ", 
				id :playVersionInfo[i].id,
				activeFun:  loadSelectMenu
			});
		}
	}
	
	function menuId2GameVersionId(id)			
	{
		return editGameVersionList[id+1].id;
	}

	function loadSelectLevel(level)
	{
		restoreState();
		testLevelInfo.levelMap = loadLevelData[level-1];
		testLevelInfo.pass = 1;
		testLevelInfo.fromPlayData = loadPlayData;
		testLevelInfo.fromLevel = level;
		setTestLevel(testLevelInfo);
		startEditMode();
	}
	
	function loadSelectMenu(id, callbackFun)
	{
		loadPlayData = menuId2GameVersionId(id);
		var titleName = playDataToTitleName(loadPlayData);
		loadLevelData = getPlayVerData(loadPlayData);
		
		titleName = "Load From: " + titleName;
		
		selectDialog(titleName, checkBitmap, loadLevelData, 1, screenX1, screenY1, 
				mainStage, tileScale, loadSelectLevel, null, restoreState)		
	}
			
	function loadExistLevel(yes)
	{
		if(yes) {
			menuDialog("Load Game Version ", editGameVersionList, mainStage, tileScale, 1, restoreState, null); 
		} else {
			restoreState();
		}
	}

	function loadButtonClick()
	{
		saveState();
		if(!editMapIsEmpty()) {
			yesNoDialog(["Abort current editing ?"], yesBitmap, noBitmap, mainStage, tileScale, loadExistLevel);
		} else {
			loadExistLevel(1);
		}
	}
}

function drawTestButton()
{
	var border, backColor, text;
	var textSting = "TEST";
	
	var width = textSting.length * tileWScale;
	var x = 8.5*(tileWScale+EDIT_PADDING)+EDIT_PADDING;
	var y = canvas.height - tileHScale - editBorder;
	
	testButton = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	border.graphics.beginFill("#40F").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileHScale).endFill();
	
	testButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, testButton);
		
	testButton.x = x;
	testButton.y = y;
	testButton.on('click', testButtonClick);
	testButton.alpha = 0;
	mainStage.addChild(testButton);	

	testButton.x1 = x + width;
	testButton.y1 = y + tileHScale;
	editorButton[editorButton.length] = testButton;
	
	function testButtonClick()
	{
		//mainStage.cursor = 'default';
		startTestMode();
	}
}

function drawSaveButton()
{
	var border, backColor, text;
	var textSting = "SAVE";
	
	var width = textSting.length * tileWScale;
	var x = 13*(tileWScale+EDIT_PADDING)+EDIT_PADDING;
	var y = canvas.height - tileHScale - editBorder;
	
	saveButton = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	border.graphics.beginFill("#40F").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileHScale).endFill();
	
	saveButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, saveButton);
		
	saveButton.x = x;
	saveButton.y = y;
	saveButton.on('click', saveButtonClick);
	saveButton.alpha = 0;
	mainStage.addChild(saveButton);	
	
	saveButton.x1 = x + width;
	saveButton.y1 = y + tileHScale;
	editorButton[editorButton.length] = saveButton;

	function saveButtonClick()
	{
		gamePause();
		stopEditTicker();
		saveEditLevel();
		yesNoDialog(["Save Successful", "Play It ?"], yesBitmap, noBitmap, mainStage, tileScale, playConfirm);

	}

	function playConfirm(rc)
	{
		gameResume();
		if(rc) { //yes
			clearTestLevel(); //clear current edit level 
			startPlayUserLevel();
		} else { //no
			setButtonState();
			startEditTicker();
		}
	}
	
	function startPlayUserLevel()
	{
		playMode = PLAY_MODERN;
		playData = PLAY_DATA_USERDEF;
	
		curLevel = testLevelInfo.level;
		setModernInfo();
	
		canvasReSize();
		document.onkeydown = handleKeyDown;
		initShowDataMsg();
		startGame();
	}	
}

//=======================
// BEGIN for TEST Mode 
//=======================
function startTestMode()
{
	playMode = PLAY_TEST;
	playData = PLAY_DATA_USERDEF;
	
	curLevel = testLevelInfo.level;
	stopEditTicker();
	saveTestState();
	canvasReSize();
	document.onkeydown = handleKeyDown; //key press
	selectIconObj.disable(1);
	initShowDataMsg();
	startGame();
}

function saveTestState()
{
	map2LevelData();
	setTestLevel(testLevelInfo);
}

function back2EditMode(rc)
{
	if(rc == 1) { //pass
		testLevelInfo.pass = 1;
		setTestLevel(testLevelInfo);
		//enableSaveButton();
	} else { //fail
		//if(testLevelInfo.pass && !testLevelInfo.modified) enableSaveButton();
	}
	startEditMode();
}

function getTestLevelMap(initValue)
{
	return testLevelInfo.levelMap;
}

function enableTestButton()
{
	if(lastRunner) testButton.alpha = 1;
}
//==========================

function editLevelModified()
{
	return (testLevelInfo.modified);
}

function editConfirmAbortState(callbackFun)
{
	gamePause();
	stopEditTicker();
	yesNoDialog(["Abort current editing ?"], yesBitmap, noBitmap, mainStage, tileScale, 
				function(rc) {  gameResume(); if(rc) callbackFun(); else startEditTicker(); } );
}

function disableTestButton()
{
	testButton.alpha = 0;
	saveButton.alpha = 0;
}

function clearUserLevelScore()
{
	playData = PLAY_DATA_USERDEF;
	getModernScoreInfo();
	modernScoreInfo[testLevelInfo.level-1] = -1;
	setModernScoreInfo();
}

function delUserLevelScore(level)
{
	playData = PLAY_DATA_USERDEF;
	getModernScoreInfo();
	modernScoreInfo.splice(level-1, 1);
	modernScoreInfo[MAX_EDIT_LEVEL-1] = -1;
	setModernScoreInfo();
}

function saveEditLevel()
{
	map2LevelData();
	if(testLevelInfo.level > editLevels) { // new level
		addEditLevel(testLevelInfo.levelMap);
	} else {
		setEditLevel(testLevelInfo.level, testLevelInfo.levelMap);
	}
	clearUserLevelScore(); //clear score 
	testLevelInfo.modified = 0;
	setEditSelectMenu();
}
	
function stageMouseDown(event)
{
	var e = event.nativeEvent;
	// ------------------------------------------------------------------------
	// nativeEvent: https://createjs.com/docs/easeljs/classes/MouseEvent.html
	// which: https://www.w3schools.com/jsref/event_which.asp
	// ------------------------------------------------------------------------
	if( e.which === undefined || e.which == 1 ) { // 1: left, 2: middle, 3: right 
		// only support left mouse button
		mouseDown = 1;
		//console.log(e.which)
		//console.log("DOWN");
	} 	
}
	
function stageMouseUp(event)
{
	var e = event.nativeEvent;	
	// ------------------------------------------------------------------------
	// nativeEvent: https://createjs.com/docs/easeljs/classes/MouseEvent.html
	// which: https://www.w3schools.com/jsref/event_which.asp
	// ------------------------------------------------------------------------
	if( e.which === undefined || e.which == 1 ) { // 1: left, 2: middle, 3: right
		// only support left mouse button
		mouseDown = 0;
		lastDown = {x:-1, y:-1};
		//console.log(e.which)
		//console.log("UP");
	}
}

function initMapInfo()
{
	lastRunner = null;
	lastGuardList = [];	

	testLevelInfo.modified = 0;
	testLevelInfo.pass = 0;
}
		
function addManCheck(id, x, y)
{
	switch(id) {
	case RUNNER_ID:
		if (lastRunner && (lastRunner.x != x || lastRunner.y != y)) {
			var lastRunnerTile = editMap[lastRunner.x][lastRunner.y];
			lastRunnerTile.tile.getChildAt(1).image =  emptyTile.image;
			lastRunnerTile.id = emptyTile.id;
		}
		lastRunner = { x:x, y:y };
		break;	
	case GUARD_ID:
		var sameGuard=0, guardNo = lastGuardList.length;
			
		for(var i = 0; i < guardNo; i++) {
			if(lastGuardList[i].x == x && lastGuardList[i].y == y) {
				sameGuard = 1;
				break;
			}
		}
		if(!sameGuard) {
			if(guardNo >= MAX_EDIT_GUARD) { //too many guards remove first one
				var x1 = lastGuardList[0].x, y1 = lastGuardList[0].y;
				var guardTile = editMap[x1][y1];
					
				guardTile.tile.getChildAt(1).image =  emptyTile.image;
				guardTile.id = emptyTile.id;
				lastGuardList.splice(0,1); //remove first one from array
			}
			lastGuardList.push({x:x, y:y});
		}
		break;	
	}
}

function delManCheck(id, x, y)
{
	switch(id) {
	case RUNNER_ID:
		//assert(lastRunner != null, "runner == null error");
		var lastRunnerTile = editMap[lastRunner.x][lastRunner.y];
		lastRunnerTile.tile.getChildAt(1).image =  emptyTile.image;
		lastRunnerTile.id = emptyTile.id;
		lastRunner = null;
		disableTestButton();	
		break;
	case GUARD_ID:		
		var removeId = -1, guardNo = lastGuardList.length;
			
		for(var i = 0; i < guardNo; i++) {
			if(lastGuardList[i].x == x && lastGuardList[i].y == y) {
				removeId = i;
				break;
			}
		}
		if(removeId >= 0) {
			var x1 = lastGuardList[removeId].x, y1 = lastGuardList[removeId].y;
			var guardTile = editMap[x1][y1];
			
			guardTile.tile.getChildAt(1).image =  emptyTile.image;
			guardTile.id = emptyTile.id;
			lastGuardList.splice(removeId,1);
		} else {
			error(arguments.callee.name, "design error !");
		}
		break;	
	}
}

//state: = 0: no change, < 0: level deleted, > 0 level change to newLevel
function editSelectMenuClose(levelDeleted, newLevel, state)
{
	if(levelDeleted) {
		switch(true) {
		case (state > 0): //level changed
			getTestLevel(testLevelInfo);
			testLevelInfo.level = newLevel;
			setTestLevel(testLevelInfo);
			startEditMode();
			break;
		case (state < 0): //level deleted
			clearTestLevel();
			setEditSelectMenu();	
			startEditMode();
			break;	
		case (state == 0 && newLevel == 0): //new level
			if(testLevelInfo.modified == 1) {	
				testLevelInfo.level = editLevels+1;
				setTestLevel(testLevelInfo);
			} 
			startEditMode();
			break;
		}
	}
}

function editSelectLevel(level)
{
	testLevelInfo.level = level;
	testLevelInfo.levelMap = editLevelData[level-1];
	testLevelInfo.fromPlayData = testLevelInfo.fromLevel = -1;
	setTestLevel(testLevelInfo);
	startEditMode();
}

function map2LevelData()
{
	var i=0;
	
	testLevelInfo.levelMap = "";
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			testLevelInfo.levelMap += tileInfo[editMap[x][y].id][1];
		}
	}
}

function editMapIsEmpty()
{
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			if(editMap[x][y].id != emptyTile.id) return 0;
		}
	}
	return 1;
}

function copyEditingMap()
{
	var curEditMap = "";
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			curEditMap += tileInfo[editMap[x][y].id][1];
		}
	}
	
	return curEditMap;
}

//==============================
// Too many user created Levels
//==============================
var editWarningText = null;
function editWarningMsg(hidden)
{
	var x, y, width, height;

	if(editWarningText == null) 
		editWarningText = new createjs.Text("Too many custom levels !", 
											"bold " +  (64*tileScale) + "px Helvetica", "#fc5c1c");
	
	width = editWarningText.getBounds().width;
	height = editWarningText.getBounds().height;
	x = editWarningText.x = (NO_OF_TILES_X*(tileWScale+EDIT_PADDING) - width) / 2 | 0;
	y = editWarningText.y = (NO_OF_TILES_Y*tileHScale - height) / 2 | 0;
	editWarningText.shadow = new createjs.Shadow("white", 2, 2, 1);
	
	if(hidden) {
		mainStage.removeChild(editWarningText);
	} else {
		mainStage.addChild(editWarningText);
	}
	mainStage.update();
}

var copyLevelMap = null, copyLevelPassed = 0;
function editHandleKeyDown(event)
{
	if(!event){ event = window.event; } //cross browser issues exist
	
	if (event.ctrlKey) {
		switch(event.keyCode) {
		case KEYCODE_C: //CTRL-C : copy current level
			copyLevelMap = copyEditingMap();
			copyLevelPassed = (!testLevelInfo.modified && lastRunner) || testLevelInfo.pass;
			setTimeout(function() { showTipsText("COPY MAP", 1500);}, 50);
			break;	
		case KEYCODE_V: //CTRL-V : paste copy map
			if(copyLevelMap != null) {
				testLevelInfo.levelMap = copyLevelMap;
				testLevelInfo.modified = 1;
				testLevelInfo.pass = copyLevelPassed;
				testLevelInfo.fromPlayData = testLevelInfo.fromLevel = -1;
				setTestLevel(testLevelInfo);
				startEditMode();
				////setButtonState();
				setTimeout(function() { showTipsText("PASTE MAP", 1500);}, 50);
			}
			break;	
		}
	}
	return true;
}	

function checkTileMouseOver(x, y)
{
	var curTile;
	for(var i = 0; i < editorTile.length; i++) {
		curTile = editorTile[i];
		if(curTile.x <= x && curTile.y <= y && curTile.x1 >= x && curTile.y1 >= y) {
			if(editorActiveTileId == i) return;
			selectTileMouseOver(curTile);
			if(editorActiveTileId >= 0) selectTileMouseOut(editorTile[editorActiveTileId]);
			editorActiveTileId = i;
			return;
		}
	}
	if(editorActiveTileId >= 0) selectTileMouseOut(editorTile[editorActiveTileId]);
	editorActiveTileId = -1;
}

function selectTileMouseOver(tile)
{ 
	var border = tile.getChildAt(0);
	
	border.graphics.clear();
	border.graphics.beginFill("gold").drawRect(-editBorder, -editBorder, tileWScale+editBorder*2, tileHScale+editBorder*2).endFill();
	//mouseOver = 1;
}
	
function selectTileMouseOut(tile)
{ 
	var border = tile.getChildAt(0);
	var color = (actTile.id == tile.myId)?"red":"black";
	
	border.graphics.clear();
	border.graphics.beginFill(color).drawRect(-editBorder, -editBorder, tileWScale+editBorder*2, tileHScale+editBorder*2).endFill();
	//mouseOver = 0;
}

function checkButtonMouseOver(x, y)
{
	var curButton;
	for(var i = 0; i < editorButton.length; i++) {
		curButton = editorButton[i];
		if(curButton.x <= x && curButton.y <= y && curButton.x1 >= x && curButton.y1 >= y) {
			if(editorButtonMouseOverId == i) return;
			editorButtonMouseOver(curButton);
			if(editorButtonMouseOverId >= 0) editorButtonMouseOut(editorButton[editorButtonMouseOverId]);
			editorButtonMouseOverId = i;
			return;
		}
	}
	if(editorButtonMouseOverId >= 0) editorButtonMouseOut(editorButton[editorButtonMouseOverId]);
	editorButtonMouseOverId = -1;
}

function editorButtonMouseOver(button)
{
	var border = button.getChildAt(0);
	var width = button.x1-button.x;
	
	border.graphics.clear();
	border.graphics.beginFill("red").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
		
	var backColor = button.getChildAt(1);
	backColor.graphics.clear();
	backColor.graphics.beginFill("#ffa").drawRect(0, 0, width, tileHScale).endFill();
		
	//mouseOver = 1;	
}

function editorButtonMouseOut(button)
{
	var border = button.getChildAt(0);
	var width = button.x1-button.x;
	
	border.graphics.clear();
	border.graphics.beginFill("#40F").drawRect(-editBorder, -editBorder, width+editBorder*2, tileHScale+editBorder*2).endFill();
	
	var backColor = button.getChildAt(1);
	backColor.graphics.clear();
	backColor.graphics.beginFill("#fff").drawRect(0, 0, width, tileHScale).endFill();
		
	//mouseOver = 0;	
}	

function setButtonState()
{
	if(testLevelInfo.level > MAX_EDIT_LEVEL) {
		newButton.alpha = 0;
		testButton.alpha = 0;
		saveButton.alpha = 0;
		editWarningMsg(0);
		return;
	} else {
		newButton.alpha = 1;
		editWarningMsg(1);
	}
	
	if(testLevelInfo.modified) 	{
		enableTestButton();
		if(testLevelInfo.pass) {
			saveButton.alpha = 1;
		} else {
			saveButton.alpha = 0;
		}
	} else {
		testLevelInfo.pass = 0;
		saveButton.alpha = 0;
	}
} 

function editTick() 
{
	var x = ((mainStage.mouseX-EDIT_PADDING - editStartX)/(tileWScale+EDIT_PADDING));
	var x = (x < 0)?-1:(x|0);
	var y = ((mainStage.mouseY-EDIT_PADDING) / (tileHScale+EDIT_PADDING) )| 0;
	
	if(testLevelInfo.level > MAX_EDIT_LEVEL) {
		return;
	}
	//debug(mainStage.mouseX,editStartX, x,y);
	if(mouseInStage && x >= 0 && x < NO_OF_TILES_X && y >= 0 && y < NO_OF_TILES_Y) {
		//edit area

		if(editorActiveTileId >= 0) selectTileMouseOut(editorTile[editorActiveTileId]);
		if(editorButtonMouseOverId >= 0) editorButtonMouseOut(editorButton[editorButtonMouseOverId]);
		
		if( x != lastDown.x || y != lastDown.y) {
			cursorTileObj.alpha = 1;
			cursorTileObj.x = (tileWScale + EDIT_PADDING) * x+EDIT_PADDING + editStartX;
			cursorTileObj.y = (tileHScale + EDIT_PADDING) * y+EDIT_PADDING;
			if(mouseDown) {
				var clickTile = editMap[x][y];
				
				if(!actTile.id || clickTile.id == actTile.id) {
					if(actTile.id) cursorTileObj.alpha = 0.1;
					delManCheck(clickTile.id, x, y);
					clickTile.tile.getChildAt(1).image =  emptyTile.image;
					clickTile.id = emptyTile.id;
				} else {	
					delManCheck(clickTile.id, x, y);
					clickTile.tile.getChildAt(1).image =  actTile.image;
					clickTile.id = actTile.id;
					addManCheck(actTile.id, x, y);
				}
				lastDown = {x:x, y:y};
				
				if(testLevelInfo.pass || actTile.id == RUNNER_ID || testLevelInfo.modified == 0) {
					testLevelInfo.modified = 1;
					testLevelInfo.pass = 0;
					setButtonState();
				}
			}
		}
	} else {
		checkTileMouseOver(mainStage.mouseX, mainStage.mouseY);
		checkButtonMouseOver(mainStage.mouseX, mainStage.mouseY);
		cursorTileObj.alpha = 0;
	}
	mainStage.update();
}