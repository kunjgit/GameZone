/** 
 * @license ================================================================================== 
 * Lode Runner main program
 *
 * This program is a HTML5 remake of the Lode Runner games (APPLE II & C64 version).
 *
 * The program code base on CreateJS JavaScript libraries !
 * http://www.createjs.com/
 *
 * The AI algorithm reference book:
 * http://www.kingstone.com.tw/book/book_page.asp?kmcode=2014710650538
 * http://www.amazon.co.jp/Lode-Runnerで学ぶ実践C言語-ビー・エヌ・エヌ企画部/dp/4893690116
 * 
 * Source Code: https://github.com/SimonHung/LodeRunner_TotalRecall
 * Web page: http://LodeRunnerWebGame.com
 *
 * by Simon Hung 06/20/2014, 06/13/2015, 09/28/2016
 * ==================================================================================
 */

window.name = 'lodeRunnerParent'; //for world high score switch back 5/31/2015

var screenX1, screenY1;
var canvasX, canvasY;
var screenBorder;

var tileW, tileH; //tile width & tile height
var tileWScale, tileHScale; //tile width/height with scale
var W2, W4;       //W2: 1/2 tile-width,  W4: 1/4 tile width
var H2, H4;       //H2: 1/2 tile-height, H4: 1/4 tile height

var mainStageX, mainStageY;
var scroeStageX, scoreStageY;

var canvas;
var mainStage, scoreStage;
var loadingTxt;

var gameState, lastGameState;
var tileScale, xMove, yMove;

var speedMode = [14, 18, 23, 29, 35]; //slow   normal  fast , slow down all speed 6/2/2016

var speedText = ["VERY SLOW", "SLOW", "NORMAL", "FAST", "VERY FAST"];
var speed = 2; //normal 
var demoSpeed = 35;

var levelData = defaultLevelData(); //Classic Lode Runner

var curLevel = 1, maxLevel = 1, passedLevel = 0;
var playMode = PLAY_CLASSIC;
var playData = 1; //classic lode runner
var curTime = 0; //count from 0 to MAX_TIME_COUNT

var backgroundColor = "#250535"; //background color

var playerName = "";
var playerUId = "";

var curTheme = THEME_APPLE2; //support 2 themes: apple2 & C64

var dbName = "LodeRunner";

function init()
{
	var screenSize = getScreenSize();
	screenX1 = screenSize.x;
	screenY1 = screenSize.y;
	
	canvasReSize();
	createStage();
	setBackground();
	initAutoDemoRnd(); //init auto demo random levels
	
	loadStoreVariable(); //load data from localStorage
	initMenuVariable();  //init menu variable
	
	getLastPlayInfo();
	initDemoData(); //get demo data from server
	
	////genUserLevel(MAX_EDIT_LEVEL); //for debug only
	getEditLevelInfo(); //load edit levels
	showLoadingPage(); //preload function 
}

function loadStoreVariable()
{
	playerName = getPlayerName();
	if( ((playerUid = getUid()) == "" || playerUid.length != 32) && typeof(uId) != "undefined" ) {
		playerUid = uId; //uId variable in lodeRunner.wData.jss
		setUid(playerUid);
	}
	curTheme = getThemeMode();
	getThemeColor();
	getRepeatAction();
	if(getGamepadMode()) gamepadEnable();
}

function canvasReSize() 
{
	var iconSizeX;
	for (var scale = MAX_SCALE*100; scale >= MIN_SCALE*100; scale -= 5) {
		tileScale = scale / 100;
		canvasX = BASE_SCREEN_X * tileScale;
		canvasY = BASE_SCREEN_Y * tileScale;
		//if (canvasX <= screenX1 && canvasY <= screenY1 || tileScale <= MIN_SCALE) break;
		iconSizeX = BASE_ICON_X * 2 * tileScale;
		if( (canvasX+iconSizeX) <= screenX1 && canvasY <= screenY1 || tileScale <= MIN_SCALE) break;
	}
	debug("SCALE=" + tileScale);
	//debug("screenX1 = " + screenX1 + " screenY1 = " + screenY1 + "scale = " + scale);
	
	screenBorder = (screenX1 - (canvasX+iconSizeX))/2;
	if(screenBorder > ICON_BORDER*2) screenBorder = ICON_BORDER*2; 
	else if (screenBorder < 0) screenBorder = 0;
	screenBorder = (screenBorder * tileScale) | 0;
	
	canvas = document.getElementById('canvas');

	canvas.width = canvasX;
	canvas.height = canvasY;
	
	//Set canvas top left position
	var left = ((screenX1 - canvasX)/2|0),
		top  = ((screenY1 - canvasY)/2|0);
	canvas.style.left = (left>0?left:0) + "px";
	canvas.style.top =  (top>0?top:0) + "px";
	canvas.style.position = "absolute";
	
	tileW = BASE_TILE_X; //tileW and tileH for detection so don't change scale
	tileH = BASE_TILE_Y;
	tileWScale = BASE_TILE_X * tileScale;
	tileHScale = BASE_TILE_Y * tileScale;
	
	W2 = (tileW/2|0); //20, 15, 10,
	H2 = (tileH/2|0); //22, 16, 11 
	
	W4 = (tileW/4|0); //10, 7, 5,
	H4 = (tileH/4|0); //11, 8, 5,
	
}

function createStage() 
{
	mainStage = new createjs.Stage(canvas);

	loadingTxt = new createjs.Text(" ", "36px Arial", "#FF0000");
	loadingTxt.x = (canvas.width - loadingTxt.getBounds().width) / 2 | 0;
	loadingTxt.y = (canvas.height - loadingTxt.getBounds().height) / 2 | 0;
	mainStage.addChild(loadingTxt);
	mainStage.update();
}

function setBackground()
{
	//set background color
	var background = new createjs.Shape();
	background.graphics.beginFill("#000000").drawRect(0, 0, canvas.width, canvas.height);
	mainStage.addChild(background);
	document.body.style.background = backgroundColor;
}

function showCoverPage()
{
	menuIconDisable(1);
	clearIdleDemoTimer();
	mainStage.removeAllChildren();	
	mainStage.addChild(titleBackground); //colorful background
	mainStage.addChild(coverBitmap);
	mainStage.addChild(signetBitmap);
	mainStage.addChild(remakeBitmap);
	mainStage.update();	
	waitIdleDemo(3000);
}

var idleTimer=null, startIdleTime;

function clearIdleDemoTimer()
{
	if(idleTimer) clearInterval(idleTimer);
	idleTimer = null;
}

function waitIdleDemo(maxIdleTime)
{
	startIdleTime = new Date();
	idleTimer = setInterval(function(){ checkIdleTime(maxIdleTime);}, 200);
	anyKeyStopDemo();
}

function anyKeyStopDemo()
{
	document.onkeydown = anyKeyDown; //any key press
	enableStageClickEvent();
}

function stopDemoAndPlay()
{
	var showStartMsg = 1;
	if(changingLevel) return false;
	clearIdleDemoTimer();
	disableStageClickEvent();

	soundStop(soundFall);		
	stopAllSpriteObj();
	
	resumeAudioContext(); //05/15/2018, chrome 66 default mute autoplay, need resume it
	
	if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) selectIconObj.disable(1); 
	if(playMode == PLAY_DEMO_ONCE) showStartMsg = 0;
	////genUserLevel(MAX_EDIT_LEVEL); //for debug only
	////getEditLevelInfo(); //load edit levels
	selectGame(showStartMsg);
}

var stageClickListener = null, stagePressListener = null;

function enableStageClickEvent()
{
	disableStageClickEvent();
	
	//createjs.Touch.enable(mainStage);
	stageClickListener = mainStage.on("click", function(evt) { stopDemoAndPlay(); });
	//stagePressListener = mainStage.on("press", function(evt) { stopDemoAndPlay(); });
}

function disableStageClickEvent()
{
	var rc = 0;
	
	if(stageClickListener) { rc = 1; mainStage.off("click", stageClickListener); }
	//if(stagePressListener) { rc = 1; mainStage.off("press", stagePressListener); }
	stageClickListener = stagePressListener = null;
	//createjs.Touch.disable(mainStage);
	
	return rc;
}

function noKeyDown()
{
	return false;
}

function anyKeyDown()
{
	stopDemoAndPlay();
}

function checkIdleTime(maxIdleTime)
{
	var idleTime = (new Date() - startIdleTime);
		
	if(idleTime > maxIdleTime){ //start demo
		clearIdleDemoTimer();
		playMode = PLAY_AUTO;
		anyKeyStopDemo(); 
		startGame();
	}
}

//==========================
// Get playMode & playData
//==========================
function getLastPlayInfo()
{
	var infoJSON = getStorage(STORAGE_LASTPLAY_MODE);
	playMode = PLAY_NONE;

	if(infoJSON) {
		var infoObj = JSON.parse(infoJSON);
		playMode = infoObj.m; //mode= 1: classic, 2:time 
		playData = infoObj.d; //1: classic lode runner, 2: professional lode runner, 3: lode runner 3 ....
	}
	
	if( (playMode != PLAY_CLASSIC && playMode != PLAY_MODERN) || 
	    (playData < 1 || (playData > maxPlayId && playData != PLAY_DATA_USERDEF) )
	){
		playMode = PLAY_CLASSIC;
		playData = 1; //classic lode runner
	}
}

function selectGame(showDataMsg)
{
	getLastPlayInfo();
	playData2GameVersionMenuId();
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	initShowDataMsg(showDataMsg);
	startGame();	
}

var gameTicker = null;
var changingLevel = 0; 
function startPlayTicker()
{
	stopPlayTicker();
	//createjs.Ticker.timingMode = createjs.Ticker.RAF;
	if(playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) {
		createjs.Ticker.setFPS(demoSpeed); //06/12/2014
	} else {
		createjs.Ticker.setFPS(speedMode[speed]);
	}
	gameTicker = createjs.Ticker.on("tick", mainTick);	
}
	
function stopPlayTicker()
{
	if(gameTicker) {
		createjs.Ticker.off("tick", gameTicker);	
		gameTicker = null;
	}
}

function startGame(noCycle)
{
	var levelMap;
	gameState = GAME_WAITING;
	startPlayTicker();
	changingLevel = 1;
	
	curAiVersion = AI_VERSION; //07/04/2014
	initHotKeyVariable();      //07/09/2014
	
	switch(playMode) {
	case PLAY_CLASSIC:
		getClassicInfo();	
		levelMap = levelData[curLevel-1];	
		if(curLevel >= levelData.length && (passedLevel+1) >= levelData.length) {
			loadEndingMusic(); //6/15/2015, music prepare for winner
		}
		break;
	case PLAY_MODERN:
		getModernInfo();	
		levelMap = levelData[curLevel-1];
		break;	
	case PLAY_TEST:
		levelMap = getTestLevelMap();
		break;
	case PLAY_DEMO:
		getDemoInfo();	
		levelMap = levelData[curLevel-1];
		break;	
	case PLAY_DEMO_ONCE:
		getDemoOnceInfo();	
		levelMap = levelData[curLevel-1];
		break;	
	case PLAY_AUTO:
		getAutoDemoLevel(1);
		levelMap = levelData[curLevel-1];	
		break;
	}
	showLevel(levelMap);
	if(noCycle) {
		beginPlay();
	} else {
		addCycScreen();
		setTimeout(function() { openingScreen(cycDiff*2);}, 5);
	}
}

var maxTileX = NO_OF_TILES_X - 1, maxTileY = NO_OF_TILES_Y - 1;

var runner = null,  guard= [];
var map; //[x][y] = { base: base map, act : active map, state:, bitmap: }
var guardCount, goldCount, goldComplete;

function initVariable()
{
	guard = [];
	keyAction = holeObj.action = ACT_STOP; 
	goldCount = guardCount = goldComplete = 0;
	runner = null;
	dspTrapTile = 0;
	
	initRnd(); 
	initModernVariable();
	initGuardVariable();
	initInfoVariable();
	initCycVariable();
	
	initStillFrameVariable(); //05/01/2015 replace sprite with still frame image 
	setSpeedByAiVersion(); //07/04/2014
	
	debug("curAiVersion = " + curAiVersion);
}

function buildLevelMap(levelMap) 
{
	var index = 0;
	var mapGuardCount = 0; //Number of original guards 
	
	//(1) create empty map[x][y] array;
	map = [];
	for(var x = 0; x < NO_OF_TILES_X; x++) {
		map[x] = [];
		for(var y = 0; y < NO_OF_TILES_Y; y++) {
			map[x][y] = {}; 
			if(levelMap.charAt(index++) == '0') mapGuardCount++;
		}
	}
	
	//(2) draw map
	index = 0;
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			var id = levelMap.charAt(index++);
			var curTile;

			switch(id) {
			default:		
			case ' ': //empty
				map[x][y].base = EMPTY_T;
				map[x][y].act  = EMPTY_T;
				map[x][y].bitmap = null;
				continue;
			case '#': //Normal Brick
				map[x][y].base = BLOCK_T;
				map[x][y].act = BLOCK_T;	
				curTile = map[x][y].bitmap = getThemeBitmap("brick");
				break;	
			case '@': //Solid Brick
				map[x][y].base = SOLID_T;
				map[x][y].act  = SOLID_T;
				curTile = map[x][y].bitmap = getThemeBitmap("solid");
				break;	
			case 'H': //Ladder
				map[x][y].base =LADDR_T;
				map[x][y].act  =LADDR_T;
				curTile = map[x][y].bitmap = getThemeBitmap("ladder");
				break;	
			case '-': //Line of rope
				map[x][y].base = BAR_T;
				map[x][y].act  = BAR_T;
				curTile = map[x][y].bitmap = getThemeBitmap("rope");
				break;	
			case 'X': //False brick
				map[x][y].base = TRAP_T; //behavior same as empty
				map[x][y].act  = TRAP_T; 
				curTile = map[x][y].bitmap = getThemeBitmap("brick");
				break;
			case 'S': //Ladder appears at end of level
				map[x][y].base = HLADR_T; //behavior same as empty before end of level
				map[x][y].act  = EMPTY_T; //behavior same as empty before end of level
				curTile = map[x][y].bitmap = getThemeBitmap("ladder");
				curTile.set({alpha:0});	//hide the laddr
				break;
			case '$': //Gold chest
				map[x][y].base = GOLD_T; //keep gold on base map
				map[x][y].act  = EMPTY_T;
				curTile = map[x][y].bitmap = getThemeBitmap("gold");
				goldCount++;	
				break;	
			case '0': //Guard
				map[x][y].base = EMPTY_T;
				map[x][y].act  = GUARD_T;  
				map[x][y].bitmap = null;
				if(--mapGuardCount >= maxGuard) {
					map[x][y].act = EMPTY_T;
					continue;  //too many guards, set this tile as empty
				}

				curTile = new createjs.Sprite(guardData, "runLeft");
				guard[guardCount] = { 
					sprite: curTile,
					pos: { x:x, y:y, xOffset:0, yOffset:0}, 
					action: ACT_STOP,
					shape: "runLeft",
					lastLeftRight: "ACT_LEFT",
					hasGold: 0
				};					
				guardCount++;	
				curTile.stop();	
				break;	
			case '&': //Player
				map[x][y].base = EMPTY_T;
				map[x][y].act  = RUNNER_T;	
				map[x][y].bitmap = null;
				if(runner !=  null) {
					map[x][y].act  = EMPTY_T;	
					continue;  //too many runner, set this tile as empty
				}
				runner = {};	
				curTile = runner.sprite = new createjs.Sprite(runnerData, "runRight");
				runner.pos = { x:x, y:y, xOffset:0, yOffset:0};	
				runner.action = ACT_UNKNOWN;	
				runner.shape = "runRight";	
				runner.lastLeftRight = "ACT_RIGHT";
				curTile.stop();	
				break;	
			}
			curTile.setTransform(x * tileWScale, y * tileHScale, tileScale, tileScale); //x,y, scaleX, scaleY 
			mainStage.addChild(curTile); 
		}
	}
	assert(mapGuardCount == 0, "Error: mapCuardCount design error !" );
	moveSprite2Top();
}

function moveSprite2Top()
{
	//move guard to top (z index)
	for(var i = 0; i < guardCount; i++) {
		moveChild2Top(mainStage, guard[i].sprite); 
	}
	
	if(runner == null) {
		error(arguments.callee.name, "Without runner ???");
	} else {
		//move runner to top (z index)
		moveChild2Top(mainStage, runner.sprite); 
	}
	
	//move fill hole object to top
	moveFillHoleObj2Top();
	
	//move debug text to top
	moveChild2Top(mainStage, loadingTxt); //for debug
}

function buildGroundInfo()
{
	drawGround();
	drawInfo();
}

var groundTile;
function drawGround()
{
	groundTile = [];
	for(var x = 0; x < NO_OF_TILES_X; x++) {
		groundTile[x] = getThemeBitmap("ground");
		groundTile[x].setTransform(x * tileWScale, NO_OF_TILES_Y * tileHScale, tileScale, tileScale);
		mainStage.addChild(groundTile[x]); 
	}
}


var runnerLife = RUNNER_LIFE;
var curScore = 0;
var curGetGold = 0, curGuardDeadNo = 0; //for modern mode 
var sometimePlayInGodMode = 0; //if sometime play in god mode then don't save to hi-scoe, 12/23/2014

var infoY;
var scoreTxt, scoreTile,
	lifeTxt, lifeTile,
	levelTxt, levelTile,
	demoTxt;

var goldTxt, goldTile,
	guardTxt, guardTile,
	timeTxt, timeTile;

//=============================
// initial modern mode variable
//=============================
function initModernVariable()
{
	//curTime = MAX_TIME_COUNT;
	curTime = curGetGold = curGuardDeadNo = 0;
}

function initInfoVariable()
{
	infoY =  (NO_OF_TILES_Y * BASE_TILE_Y + GROUND_TILE_Y) * tileScale;
	
	scoreTxt = []; 
	scoreTile = [];
	
	lifeTxt = []; 
	lifeTile = [];
	
	demoTxt = [];

	levelTxt = []; 
	levelTile = [];
	
	goldTxt = [];
	goldTile = [];
	
	guardTxt = [];
	guardTile = [];

	timeTxt = []; 
	timeTile = [];
}

function drawInfo()
{
	if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
		//SCORE
		drawScoreTxt();
		drawScore(0);

		if(playMode == PLAY_DEMO) {
			drawDemoTxt();
		} else {
			//MEN
			drawLifeTxt();
			drawLife();
		}
	} else {
		//GOLD 
		drawGoldTxt();
		drawGold(0);
		
		//GUARD
		drawGuardTxt();
		drawGuard(0);
		
		//TIME 
		drawTimeTxt();
		drawTime(0);
	}
	
	//LEVEL
	drawLevelTxt();
	drawLevel();
}

//for classic & auto demo mode
function drawScoreTxt()
{
	scoreTxt = drawText(0, infoY, "SCORE", mainStage);
}

function drawLifeTxt()
{
	lifeTxt = drawText(13*tileWScale, infoY, "MEN", mainStage);
}

function drawLevelTxt()
{
	var xOffset = 20;
	
	levelTxt = drawText(xOffset*tileWScale, infoY, "LEVEL", mainStage);
}

//for demo mode
function drawDemoTxt()
{
	demoTxt = drawText(14*tileWScale, infoY, "DEMO", mainStage);
}

//for time & edit mode
function drawGoldTxt()
{
	goldTxt = drawText(0*tileWScale, infoY, "@", mainStage);
}

function drawGuardTxt()
{
	guardTxt = drawText((5+2/3)*tileWScale, infoY, "#", mainStage);
}

function drawTimeTxt()
{
	timeTxt = drawText((11+1/3)*tileWScale, infoY, "TIME", mainStage);
}

// draw score number 
function drawScore(addScore)
{
	var digitNo;
	
	curScore += addScore;
	for(var i = 0; i < scoreTile.length; i++) 
		mainStage.removeChild(scoreTile[i]);
	
	scoreTile = drawText(5*tileWScale, infoY, ("000000"+curScore).slice(-7), mainStage);
}

function drawLife()
{
	for(var i = 0; i < lifeTile.length; i++) 
		mainStage.removeChild(lifeTile[i]);

	lifeTile = drawText(16*tileWScale, infoY, ("00"+runnerLife).slice(-3), mainStage);
}

function drawLevel()
{
	for(var i = 0; i < levelTile.length; i++) 
		mainStage.removeChild(levelTile[i]);
	
	switch(playMode) {
	case PLAY_AUTO:	
		levelTile = drawText(25*tileWScale, infoY, ("00"+demoLevel).slice(-3), mainStage);
		break;	
	case PLAY_CLASSIC: 
	default:		
		levelTile = drawText(25*tileWScale, infoY, ("00"+curLevel).slice(-3), mainStage);
		break;	
	}
}

function drawGold(addGold)
{
	curGetGold += addGold;
	for(var i = 0; i < goldTile.length; i++) 
		mainStage.removeChild(goldTile[i]);
	
	goldTile = drawText(1*tileWScale, infoY, ("00"+curGetGold).slice(-3), mainStage);
}

function drawGuard(addGuard)
{
	curGuardDeadNo += addGuard;
	if(curGuardDeadNo > 100) curGuardDeadNo = 100;
	for(var i = 0; i < guardTile.length; i++) 
		mainStage.removeChild(guardTile[i]);
	
	guardTile = drawText((6+2/3)*tileWScale, infoY, ("00"+curGuardDeadNo).slice(-3), mainStage);
}


function countTime(addTime)
{
	if(curTime >= MAX_TIME_COUNT) return;
	if(addTime) curTime++;
	if(curTime > MAX_TIME_COUNT) { curTime = MAX_TIME_COUNT;}
}

function drawTime(addTime)
{
	countTime(addTime);
	for(var i = 0; i < timeTile.length; i++) 
		mainStage.removeChild(timeTile[i]);

	timeTile = drawText((15+1/3)*tileWScale, infoY, ("00"+curTime).slice(-3), mainStage);
}

function setGroundInfoOrder()
{
	var i;

	for(i = 0; i < groundTile.length; i++) moveChild2Top(mainStage, groundTile[i]);
	
	if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
		for(i = 0; i < scoreTxt.length; i++) moveChild2Top(mainStage, scoreTxt[i]);
		for(i = 0; i < scoreTile.length; i++) moveChild2Top(mainStage, scoreTile[i]);

		if(playMode == PLAY_DEMO) {
			for(i = 0; i < demoTxt.length; i++) moveChild2Top(mainStage, demoTxt[i]);
		} else {
			for(i = 0; i < lifeTxt.length; i++) moveChild2Top(mainStage, lifeTxt[i]);
			for(i = 0; i < lifeTile.length; i++) moveChild2Top(mainStage, lifeTile[i]);
		}
	} else { //PLAY_MODERN, PLAY_DEMO_ONCE
		for(i = 0; i < goldTxt.length; i++) moveChild2Top(mainStage, goldTxt[i]);
		for(i = 0; i < goldTile.length; i++) moveChild2Top(mainStage, goldTile[i]);

		for(i = 0; i < guardTxt.length; i++) moveChild2Top(mainStage, guardTxt[i]);
		for(i = 0; i < guardTile.length; i++) moveChild2Top(mainStage, guardTile[i]);

		for(i = 0; i < timeTxt.length; i++) moveChild2Top(mainStage, timeTxt[i]);
		for(i = 0; i < timeTile.length; i++) moveChild2Top(mainStage, timeTile[i]);
	}
	
	for(i = 0; i < levelTxt.length; i++) moveChild2Top(mainStage, levelTxt[i]);
	for(i = 0; i < levelTile.length; i++) moveChild2Top(mainStage, levelTile[i]);
}

function drawText(x, y, str, parentObj, numberType)
{
	var text = str.toUpperCase();
	var textTile = [];
	
	if(typeof numberType == "undefined") numberType = "N";
	
	for(var i = 0; i < text.length; i++) {
		var code = text.charCodeAt(i);
		
		switch(true) {
		case (code >=48 && code <=57): //N0 ~ N9 or D0 ~ D9 
			textTile[i] = new createjs.Sprite(textData, numberType+String.fromCharCode(code));	
			break;
		case (code >=65 && code <= 90):
			textTile[i] = new createjs.Sprite(textData, String.fromCharCode(code));	
			break;
		case (code == 46): //'.'
			textTile[i] = new createjs.Sprite(textData, "DOT");	
			break;
		case (code == 60): //'<'
			textTile[i] = new createjs.Sprite(textData, "LT");	
			break;
		case (code == 62): //'>'
			textTile[i] = new createjs.Sprite(textData, "GT");	
			break;
		case (code == 45): //'-'
			textTile[i] = new createjs.Sprite(textData, "DASH");	
			break;
		case (code == 58): //':'
			textTile[i] = new createjs.Sprite(textData, "COLON");	
			break;
		case (code == 95): //'_'
			textTile[i] = new createjs.Sprite(textData, "UNDERLINE");	
			break;
		case (code == 35): //'#': guard dead in trap hole
			textTile[i] = new createjs.Sprite(textData, String.fromCharCode(code));	
			break;
		case (code == 64): //'@': gold
			textTile[i] = new createjs.Sprite(textData, String.fromCharCode(code));	
			break;
		default: //space
			textTile[i] = new createjs.Sprite(textData, "SPACE");	
			break;
		}
		textTile[i].setTransform(x + i*tileWScale, y, tileScale, tileScale).stop();
		parentObj.addChild(textTile[i]); 
	}
	return textTile;	
}

var playTickTimer = 0;
function playGame(deltaS)
{
	if(goldComplete && runner.pos.y == 0 && runner.pos.yOffset == 0) {
		gameState = GAME_FINISH;
		return;
	}
	
	if(++playTickTimer >= TICK_COUNT_PER_TIME) {
		if(playMode != PLAY_CLASSIC && playMode != PLAY_AUTO && playMode != PLAY_DEMO) drawTime(1);
		else countTime(1);
		playTickTimer = 0;
	}
	
	if(playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) playDemo();
	if(recordMode) processRecordKey();
	if(!isDigging()) moveRunner();
	else processDigHole();
	if(gameState != GAME_RUNNER_DEAD) moveGuard();
	
	if(curAiVersion >= 3) {
		processGuardShake();
		processFillHole();
		processReborn();
	}
}

//***********************
// BEGIN show new level *
//***********************
function showLevel(levelMap)
{
	mainStage.removeAllChildren();
	
	loadingTxt.text = "";
	//loadingTxt.text = tileScale;  //for debug
	mainStage.addChild(loadingTxt); //for debug

	initVariable();	
	setBackground();
	
	buildLevelMap(levelMap);
	
	buildGroundInfo();
}

var tipsText = null, tipsRect = null;
var tipsText1 = null, tipsRect1 = null;
function showTipsText(text, time, text1)
{
	var x, y, width, height;
	
	if(tipsText != null) {
		mainStage.removeChild(tipsText);
	}
	if(tipsRect != null) {
		mainStage.removeChild(tipsRect);
	}	

	if(tipsText1 != null) {
		mainStage.removeChild(tipsText1);
		tipsText1 = null;
	}
	
	if(tipsRect1 != null) {
		mainStage.removeChild(tipsRect1);
		tipsRect1 = null;
	}	
	
	tipsText = new createjs.Text("test", "bold " +  (48*tileScale) + "px Helvetica", "#ee1122");
	tipsText.text = text;
	tipsText.set({alpha:1});
	if(text.length) {
		width = tipsText.getBounds().width;
		height = tipsText.getBounds().height;
	} else {
		width = height = 0;
	}
	x = tipsText.x = (canvas.width - width) / 2 | 0;
	y = tipsText.y = (NO_OF_TILES_Y*tileHScale - height) / 2 | 0;
	tipsText.shadow = new createjs.Shadow("white", 2, 2, 1);
	
	tipsRect = new createjs.Shape();
    tipsRect.graphics.beginFill("#020722");
    tipsRect.graphics.drawRect(-1, -1,width+2, height+2);	
	tipsRect.setTransform(x, y).set({alpha:0.8});

	mainStage.addChild(tipsRect);
	mainStage.addChild(tipsText);
	
	if(time){
		createjs.Tween.get(tipsRect,{override:true}).set({alpha:0.8}).to({alpha:0}, time);
		createjs.Tween.get(tipsText,{override:true}).set({alpha:1}).to({alpha:0}, time);
	}
	
	if(text1 != null) { //second tips 
		tipsText1 = new createjs.Text("test", "bold " +  (48*tileScale) + "px Helvetica", "#ee1122");
		tipsText1.text = text1;
		tipsText1.set({alpha:1});
		if(text1.length) {
			width = tipsText1.getBounds().width;
			height = tipsText1.getBounds().height;
		} else {
			width = height = 0;
		}
		x = tipsText1.x = (canvas.width - width) / 2 | 0;
		y = tipsText1.y = (NO_OF_TILES_Y*tileHScale - height) / 2  + tipsText.getBounds().height*2 | 0;
		tipsText1.shadow = new createjs.Shadow("white", 2, 2, 1);
	
		tipsRect1 = new createjs.Shape();
    	tipsRect1.graphics.beginFill("#020722");
    	tipsRect1.graphics.drawRect(-1, -1,width+2, height+2);	
		tipsRect1.setTransform(x, y).set({alpha:0.8});

		mainStage.addChild(tipsRect1);
		mainStage.addChild(tipsText1);
	
		if(time){
			createjs.Tween.get(tipsRect1,{override:true}).set({alpha:0.8}).to({alpha:0}, time);
			createjs.Tween.get(tipsText1,{override:true}).set({alpha:1}).to({alpha:0}, time);
		}
	}	
	
	mainStage.update();
}

var dspTrapTile = 0;
function toggleTrapTile()
{
	dspTrapTile ^= 1;
	
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			if( map[x][y].base == TRAP_T) {
				if(dspTrapTile) {
					map[x][y].bitmap.set({alpha:0.5}); //show trap tile
				} else {
					map[x][y].bitmap.set({alpha:1}); //hide trap tile
				}
			}
		}
	}
	
	if(dspTrapTile) {		
		showTipsText("SHOW TRAP TILE", 2000);
	} else {
		showTipsText("HIDE TRAP TILE", 2000);
	}
	
}

function startAllSpriteObj()
{
	//(1) runner stop
	if(runner && !runner.paused) runner.sprite.play();
	
	//(2) guard stop
	for(var i = 0; i < guardCount; i++) {
		if(!guard[i].paused) guard[i].sprite.play();
	}
	
	if(curAiVersion < 3) { //for sprite only
		//(3) fill hole stop
		for(var i = 0; i < fillHoleObj.length; i++)
			fillHoleObj[i].play();
	
		//(4) hole digging
		if(holeObj.action == ACT_DIGGING) holeObj.sprite.play();
	}
}

function stopAllSpriteObj()
{
	//(1) runner stop
	if(runner) {
		runner.paused = runner.sprite.paused;
		runner.sprite.stop();
	}
	
	//(2) guard stop
	for(var i = 0; i < guardCount; i++) {
		guard[i].paused = guard[i].sprite.paused;
		guard[i].sprite.stop();
	}
	
	if(curAiVersion < 3) { //for sprite only
		//(3) fill hole stop
		for(var i = 0; i < fillHoleObj.length; i++)
			fillHoleObj[i].stop();
	
		//(4) hole digging
		if(holeObj.action == ACT_DIGGING) holeObj.sprite.stop();
	}
	
}

function gameOverAnimation()
{
	var gameOverImage = getThemeBitmap("over");
	var bound = gameOverImage.getBounds();
	var x = (NO_OF_TILES_X*tileWScale)/2|0;
	var y = (NO_OF_TILES_Y*tileHScale)/2|0;
	var regX = (bound.width)/2|0;
	var regY = (bound.height)/2|0;
	
	
	var rectBlock = new createjs.Shape();
    rectBlock.graphics.beginFill("black");
    rectBlock.graphics.drawRect(-1, -1,bound.width+2, bound.height+2);
	
	rectBlock.setTransform(x, y, tileScale, tileScale).set({regX:regX, regY:regY});
	
	gameOverImage.setTransform(x, y, tileScale, tileScale).set({regX:regX, regY:regY});
	createjs.Tween.get(gameOverImage)
			.to({scaleY:-tileScale},80)
			.to({scaleY:tileScale},80)
			.to({scaleY:-tileScale},100)
			.to({scaleY:tileScale},100)
			.to({scaleY:-tileScale},150)
			.to({scaleY:tileScale},150)
			.to({scaleY:-tileScale},300)
			.to({scaleY:tileScale},300)
			.to({scaleY:-tileScale},450)
			.to({scaleY:tileScale},450)
			.to({scaleY:-tileScale},750)
			.to({scaleY:tileScale},750)
			.wait(1500)
			.call(function(){ if(gameState == GAME_OVER_ANIMATION) gameState = GAME_OVER;});
	/* 
		BUG: 
		while in PLAY_AUTO MODE and demo dead into the gameOverAnimation() 
		At this time if player press any key or click mouse will cause 
		  gameState changed to  "GAME_START" and start play the game,  
		  and after the TWEEN function into final "call( function() { gameState = GAME_OVER;})"
		  will cause program orderless and want player record hiscore table 
		  
		BUG FIXED:  9/15/2015
		   if TWEEN complete and into call() func need check gameState MUST = "GAME_OVER_ANIMATION"
		   
		==> call(function(){ if(gameState == GAME_OVER_ANIMATION) gameState = GAME_OVER;});   
		   
	*/
	
	
	mainStage.addChild(rectBlock);
	mainStage.addChild(gameOverImage);
	//stopAllSpriteObj();
}

var cycScreen, cycMaxRadius, cycDiff, cycX, cycY

function initCycVariable()
{
	cycX = NO_OF_TILES_X * tileWScale/2;
	cycY = NO_OF_TILES_Y * tileHScale/2;
	cycMaxRadius = Math.sqrt(cycX*cycX+cycY*cycY)|0+1;
	cycDiff = (cycMaxRadius/CLOSE_SCREEN_SPEED)|0;
}

function addCycScreen()
{
	cycScreen =  new createjs.Shape();
	mainStage.addChild(cycScreen);
	
	setGroundInfoOrder();
}

function removeCycScreen()
{
	mainStage.removeChild(cycScreen);
}

function newLevel(r)
{
	changingLevel = 1;
	//menuIconDisable(0);
	addCycScreen();

	//close screen
	setTimeout(function() { closingScreen(cycMaxRadius);}, 100);
}

function closingScreen(r)
{
	removeCycScreen();
	addCycScreen();
	cycScreen.graphics.beginFill("black").arc( cycX, cycY, r, 0, 2*Math.PI, true)
	cycScreen.graphics.arc( cycX, cycY, cycMaxRadius, 0, 2*Math.PI, false);
	mainStage.update();
	if(r > 0) {
		r -= cycDiff;
		if(r < cycDiff*2) r = 0;
		setTimeout(function() { closingScreen(r);}, 5);
	} else {
		var levelMap;
		
		curAiVersion = AI_VERSION; //07/04/2014
		initHotKeyVariable();      //07/09/2014
		
		if(playMode == PLAY_AUTO) getAutoDemoLevel(0);
		if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) getNextDemoLevel();

		if(playMode == PLAY_TEST) {
			levelMap = getTestLevelMap();
		} else {
			levelMap = levelData[curLevel-1];
		}
		showLevel(levelMap);
		addCycScreen();
		setTimeout(function() { openingScreen(cycDiff*2);}, 5);
	}
}

function menuIconEnable()
{
	mainMenuIconObj.enable();
	if(playMode == PLAY_MODERN || playMode == PLAY_DEMO) {
		selectIconObj.enable();
	}
	if(playMode == PLAY_MODERN) demoIconObj.enable();
	if(playMode != PLAY_EDIT) {
		soundIconObj.enable();
		soundIconObj.updateSoundImage();
		repeatActionIconObj.enable();
		themeColorObj.enable();
	} else {
		if(!editInNarrowScreen) themeColorObj.enable();
	}
	infoIconObj.enable();
	helpIconObj.enable();
	themeIconObj.enable();
}

function menuIconDisable(hidden)
{
	mainMenuIconObj.disable(hidden);
	if(playMode == PLAY_MODERN) {
		selectIconObj.disable(hidden);
	}
	demoIconObj.disable(hidden);
	soundIconObj.disable(hidden);
	infoIconObj.disable(hidden);
	helpIconObj.disable(hidden);
	repeatActionIconObj.disable(hidden);
	themeIconObj.disable(hidden);
	themeColorObj.disable(hidden);
}

var showStartTipsMsg = 1;
function initShowDataMsg(showMsg)
{
	if(typeof showMsg == "undefined") showMsg = 1;
	showStartTipsMsg = showMsg;
}

function showDataMsg()
{
	if(showStartTipsMsg) {
		var nameTxt = null;
		var nameTxt1 = null;
		
		nameTxt = playDataToTitleName(playData);

		switch(playMode) {
		case PLAY_EDIT:
			nameTxt1 = "Edit Mode";
			break;
		case PLAY_TEST:		
			nameTxt1 = "Test Mode";	
			break;	
		case PLAY_DEMO:
			nameTxt1 = "Demo Mode";
			break;	
		case PLAY_CLASSIC:
			if(playData != PLAY_DATA_USERDEF) nameTxt1 = "Challenge Mode";
			else nameTxt1 = "Play Mode";	
			break;
		case PLAY_MODERN:
			if(playData != PLAY_DATA_USERDEF) nameTxt1 = "Training Mode";
			else nameTxt1 = "Play Mode";	
			break;	
		}
		
		if(nameTxt)	showTipsMsg(nameTxt, mainStage, tileScale, nameTxt1);
		showStartTipsMsg = 0;
	}
}

function showHelpMenu()
{
	if(firstPlay) { 
		helpObj.showHelp(0, initForPlay, tileScale, null); 
		setFirstPlayInfo();
	} else {	
		initForPlay();
	}	
}

function initForPlay()
{
	menuIconEnable();
	showDataMsg();
}

function openingScreen(r)
{
	removeCycScreen();
	addCycScreen();
	cycScreen.graphics.beginFill("black").arc( cycX, cycY, r, 0, 2*Math.PI, true)
	cycScreen.graphics.arc( cycX, cycY, cycMaxRadius, 0, 2*Math.PI, false);
	mainStage.update();
	if(r < cycMaxRadius) {
		r += cycDiff;
		if(r > cycMaxRadius) r = cycMaxRadius;
		setTimeout(function() { openingScreen(r);}, 5);
	} else {
		removeCycScreen();
		beginPlay();
	}
}

function beginPlay()
{
	gameState = GAME_START;
	keyAction = ACT_STOP;
	runner.sprite.gotoAndPlay();
	changingLevel = 0;
		
	if(recordMode) initRecordVariable();
	if(playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) {
		initPlayDemo();
		if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) initForPlay();
	} else { 

		if(playerName == "" || playerName.length <= 1) {
			inputPlayerName(mainStage, showHelpMenu);
		} else {
			showHelpMenu();
		}
			
		
		if(playMode != PLAY_TEST && playMode != PLAY_EDIT) {
			enableAutoDemoTimer(); //while start game and idle too long will into demo mode
		}
	}
}

function incLevel(incValue, passed)
{
	var wrap = 0;
	curLevel += incValue;
	while (curLevel > levelData.length) { curLevel-= levelData.length; wrap = 1; }
	if(playMode == PLAY_CLASSIC) setClassicInfo(passed);
	if(playMode == PLAY_MODERN) setModernInfo();
	
	return wrap;
}

function decLevel(decValue)
{
	curLevel -= decValue
	while (curLevel <= 0) curLevel += levelData.length;
	if(playMode == PLAY_CLASSIC) setClassicInfo(0);
	if(playMode == PLAY_MODERN) setModernInfo();
}


function updateModernScoreInfo()
{
	var lastHiScore = modernScoreInfo[curLevel-1];
	var levelScore = ((MAX_TIME_COUNT - curTime) + curGetGold + curGuardDeadNo) * SCORE_VALUE_PER_POINT;
	
	if(lastHiScore < levelScore) {
		modernScoreInfo[curLevel-1] = levelScore;
		setModernScoreInfo();
	}
	
	if(lastHiScore < 0) lastHiScore = 0;
	
	return lastHiScore;
}

function gameFinishActiveNew(level)
{
	curLevel = level;
	setModernInfo();
	startGame();
}

function gameFinishCloseIcon()
{
	startGame();
}

function gameFinishCallback(selectMode)
{
	switch(selectMode) {
	case 0: //return (same level)
		gameState = GAME_NEW_LEVEL;
		break;
	case 1: //menu selection
		//incLevel(1);	
		activeSelectMenu(gameFinishActiveNew, gameFinishCloseIcon, null)	
		break;
	case 2: //new level
		incLevel(1,0);	
		gameState = GAME_NEW_LEVEL;
		break;
	default:
		debug("design error !");	
		break;	
	}
}

function gameFinishTestModeCallback()
{
	back2EditMode(1);
}

var lastScoreTime, scoreDuration;
var scoreIncValue, finalScore;

function mainTick(event)
{ 
	var deltaS = event.delta/1000; 
	var scoreInfo;
	
	switch(gameState) {
	case GAME_START:
		countAutoDemoTimer();	
		if(keyAction != ACT_STOP && keyAction != ACT_UNKNOWN) {
			disableAutoDemoTimer();	
			gamepadClearId();	
			gameState = GAME_RUNNING;
			if(playMode == PLAY_MODERN) demoIconObj.disable(1);
			playTickTimer = 0; //modern mode time counter
			if(goldCount <= 0) showHideLaddr();
		}
		break;	
	case GAME_RUNNING:
		playGame(deltaS);
		break;
	case GAME_RUNNER_DEAD:
		//console.log("Time=" + curTime + ", Tick= " + playTickTimer);
		//if(recordMode) recordModeToggle(GAME_RUNNER_DEAD); //for debug only (if enable it must disable below statement)
		if(recordMode == RECORD_KEY) recordModeDump(GAME_RUNNER_DEAD);	
			
		soundStop(soundFall);
		stopAllSpriteObj();	
		themeSoundPlay("dead");
		switch(playMode) {
		case PLAY_CLASSIC:
		case PLAY_AUTO:
			--runnerLife;
			drawLife();	
			if(runnerLife <= 0) {
				gameOverAnimation();
				menuIconDisable(1);
				if(playMode == PLAY_CLASSIC) clearClassicInfo();
				gameState = GAME_OVER_ANIMATION;
			} else {
				setTimeout(function() {gameState = GAME_NEW_LEVEL; }, 500);
				gameState = GAME_WAITING;	
				if(playMode == PLAY_CLASSIC) setClassicInfo(0);
			}
			break;
		case PLAY_DEMO:	
			error(arguments.callee.name, "DEMO dead level=" + curLevel);
				
			setTimeout(function() {incLevel(1,0); gameState = GAME_NEW_LEVEL; }, 500);
			gameState = GAME_WAITING;	
			break;	
		case PLAY_DEMO_ONCE:
			error(arguments.callee.name, "DEMO dead level=" + curLevel);
				
			disableStageClickEvent();
			document.onkeydown = handleKeyDown;
			setTimeout(function() {playMode = PLAY_MODERN; startGame(); }, 500);
			gameState = GAME_WAITING;	
			break;	
		case PLAY_MODERN:		
			setTimeout(function() {gameState = GAME_NEW_LEVEL; }, 500);
			gameState = GAME_WAITING;	
			break;
		case PLAY_TEST:		
			setTimeout(function() { back2EditMode(0); }, 500);
			gameState = GAME_WAITING;	
			break;
		default:
			debug("GAME_RUNNER_DEAD: desgin error !");	
			break;	
		}
		break;	
	case GAME_OVER_ANIMATION:
		break;	
	case GAME_OVER:
		scoreInfo = null;	
		if(playMode == PLAY_CLASSIC && !sometimePlayInGodMode) {	
			scoreInfo = {s:curScore, l: passedLevel+1 };
		}	
			
		showScoreTable(playData, scoreInfo , function() { showCoverPage();});	
		gameState = GAME_WAITING;	
		return;
	case GAME_FINISH: 
		stopAllSpriteObj();
		//console.log("Time=" + curTime + ", Tick= " + playTickTimer);
			
		switch(playMode) {
		case PLAY_CLASSIC:
		case PLAY_AUTO:		
		case PLAY_DEMO:		
			soundPlay(soundPass);
			finalScore = curScore + SCORE_COMPLETE_LEVEL;
			scoreDuration = ((soundPass.getDuration()) /(SCORE_COUNTER+1))| 0;
			lastScoreTime = event.time;
			scoreIncValue = SCORE_COMPLETE_LEVEL/SCORE_COUNTER|0;
			drawScore(scoreIncValue);
			gameState = GAME_FINISH_SCORE_COUNT;	
			break;
		case PLAY_DEMO_ONCE:
			soundPlay(soundEnding);
			disableStageClickEvent();
			document.onkeydown = handleKeyDown;
			setTimeout(function() {playMode = PLAY_MODERN; startGame(); }, 500);
			gameState = GAME_WAITING;
			break;
		case PLAY_MODERN:
			soundPlay(soundEnding);
			var lastHiScore = lastHiScore = updateModernScoreInfo();
			levelPassDialog(curLevel, curGetGold, curGuardDeadNo, curTime, lastHiScore, 
						  returnBitmap, select1Bitmap, nextBitmap,
						  mainStage, tileScale, gameFinishCallback);	
			gameState = GAME_WAITING;
			break;
		case PLAY_TEST:
			soundPlay(soundEnding);
			setTimeout(function() { back2EditMode(1);},500);	
			gameState = GAME_WAITING;
			break;
		default:
			error(arguments.callee.name, "design error, playMode =" + playMode);
			break;	
		}

		//if(recordMode) recordModeToggle(GAME_FINISH); //for debug only (if enable it must comment below if statement)
		if(recordMode == RECORD_KEY) {
			recordModeDump(GAME_FINISH);	
			
			if( (playMode == PLAY_CLASSIC || playMode == PLAY_MODERN) && playData <= maxPlayId ) {
				updatePlayerDemoData(playData, curDemoData); //update current player demo data
			}
		}
		break;	
	case GAME_FINISH_SCORE_COUNT:		
		if(event.time > lastScoreTime+ scoreDuration) {
			lastScoreTime += scoreDuration;
			if(curScore + scoreIncValue >= finalScore) {
				curScore = finalScore;
				drawScore(0);
				gameState = GAME_NEW_LEVEL;
				
				switch(playMode) {
				case PLAY_TEST:		
					setTimeout(function() { back2EditMode(1);},500);	
					break;
				case PLAY_CLASSIC:
					if(++runnerLife > RUNNER_MAX_LIFE) runnerLife = RUNNER_MAX_LIFE;	
					break;	
				case PLAY_AUTO:
					if(demoCount >= demoMaxCount) {
						setTimeout(function(){ showCoverPage();}, 500);	
						gameState = GAME_WAITING;
					}
					break;	
				}

				if(recordMode != RECORD_PLAY) {
					if(incLevel(1, 1) && playMode == PLAY_CLASSIC && passedLevel >= levelData.length) 
						gameState = GAME_WIN;
				}
				
			} else {
				drawScore(scoreIncValue);
			}
		}
		break;
	case GAME_NEXT_LEVEL:
		soundStop(soundFall);		
		stopAllSpriteObj();
		incLevel(shiftLevelNum, 0);
		gameState = GAME_NEW_LEVEL; 
		return;
	case GAME_PREV_LEVEL:
		soundStop(soundFall);		
		stopAllSpriteObj();
		decLevel(shiftLevelNum);	
		gameState = GAME_NEW_LEVEL; 
		return;
	case GAME_NEW_LEVEL:
		gameState = GAME_WAITING;	
		newLevel();	
		break;
	case GAME_WIN:		
		scoreInfo = {s:curScore, l: levelData.length, w:1 }; //winner	
		menuIconDisable(1);
		clearClassicInfo();
		showScoreTable(playData, scoreInfo , function() { showCoverPage();});	
		gameState = GAME_WAITING;	
		return;			
	case GAME_LOADING:
		break;	
	case GAME_PAUSE:
	default:
		return;	
	}
	
	mainStage.update();
}