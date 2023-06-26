//===============
// Auto Demo 
//===============

var demoRecordIdx, demoGoldIdx, demoBornIdx;
var	demoTickCount;
var demoRnd, demoIdx;

function initAutoDemoRnd()
{
	demoRnd = [];
	demoRnd[0] = new rangeRandom(0, demoData1.length-1, 0); //random range 0 .. demoData1.length-1
}

var demoRecord, demoGoldDrop, demoBornPos;
var demoLevel, demoData, demoCount, demoMaxCount;
function getAutoDemoLevel(initValue)
{
	if(initValue) {
		curScore = 0;	
		runnerLife = 1;
		demoLevel = 1;
		demoCount = 1;
		demoMaxCount = 3;
		demoData = demoData1;
		levelData = playVersionInfo[0].verData;
		demoIdx = 0;
	} else {
		demoLevel++;
		demoCount++;
	}
	var idx = demoRnd[demoIdx].get();
		
	demoRecord = demoData[idx].action;
	demoGoldDrop = demoData[idx].goldDrop;
	demoBornPos = demoData[idx].bornPos;
	curLevel = demoData[idx].level;
	
	curAiVersion = demoData[idx].ai; //07/04/2014
	if("godMode" in demoData[idx]) 
		godMode = demoData[idx].godMode; //07/09/2014
}

var demoCountTime = 0, demoCountEnable = 0;
function enableAutoDemoTimer()
{
	demoCountEnable = 1;
	demoCountTime = 0;
}

function disableAutoDemoTimer()
{
	demoCountEnable = 0;
}

function countAutoDemoTimer()
{
	if(demoCountEnable) {
		demoCountTime++;
		//debug(demoCountTime);
		if(demoCountTime > MAX_DEMO_WAIT_COUNT) {
			disableAutoDemoTimer();
			gameState = GAME_WAITING;	
			showCoverPage();
		}
	}
}

//=====================================
// function for auto demo & demo mode
//=====================================

function initPlayDemo()
{
	demoRecordIdx = demoGoldIdx = demoBornIdx = 0;
	demoTickCount = 0;
	playTickTimer = 0; //modern mode time counter
	gameState = GAME_RUNNING;
	
	if(playMode == PLAY_DEMO_ONCE) {
		demoIconObj.disable(1);
		selectIconObj.disable(1);
	}
}

function playDemo()
{
	if(demoRecordIdx < demoRecord.length) {
		if(demoRecord[demoRecordIdx*2] == demoTickCount) {
			//loadingTxt.text = demoRecordIdx + " " + demoTickCount ; //for debug
			pressKey(demoRecord[demoRecordIdx*2+1]);
			demoRecordIdx++;
		}
	}
	demoTickCount++;
}

function getDemoGold(guard)
{
	guard.hasGold = demoGoldDrop[demoGoldIdx++];
}

function getDemoBornPos()
{
	if(demoBornPos[0] == 2) {
		demoBornIdx += 2;
		return { x: demoBornPos[demoBornIdx-1], y: demoBornPos[demoBornIdx] };
	} else {
		return { x: demoBornPos[++demoBornIdx], y: 1 };
	}
}

//====================================
// for demo mode (User select level)
//====================================

var playerDemoData = [], wDemoData = [];
var demoPlayData = 0; //for syn demo data with current playData
var demoDataLoading = 0;

function initDemoData()
{
	demoPlayData = playData;
	playerDemoData = [];
	wDemoData = [];
	demoDataLoading = 1; 
	getDemoData(playData); //ajax 
}

function setDemoData(jsonTxt)
{
	if(jsonTxt.substring(0, 1) == "[" ) { 		
		wDemoData = JSON.parse(jsonTxt);
		for(var i = 0; i < wDemoData.length; i++) {
			playerDemoData[wDemoData[i].level-1] = wDemoData[i]; 
		}
	} else {
		error(arguments.callee.name, "Wrong Demo Data: " + jsonTxt);
	}
	demoDataLoading = 0; 
	if(playMode == PLAY_MODERN && gameState == GAME_START ) demoIconObj.enable();
}

function initDemoInfo()
{
	var idx = curLevel - 1;
	
	curScore = 0;	
	runnerLife = 1;
		
	demoRecord = demoData[idx].action;
	demoGoldDrop = demoData[idx].goldDrop;
	demoBornPos = demoData[idx].bornPos;
	assert(curLevel == demoData[idx].level, "curLevel != level of demoData");	
	
	curAiVersion = demoData[idx].ai; //07/04/2014
	if("godMode" in demoData[idx]) 
		godMode = demoData[idx].godMode; //07/09/2014
}

function getDemoOnceInfo() //for demo once
{
	//DEMO ONCE in Training mode, so curLevel & levelData are same as training mode 
	demoData = playerDemoData;
	initDemoInfo();	
}

function getDemoInfo()
{
	var infoJSON;

	if (playData >= 1 && playData <= maxPlayId) {
		infoJSON = getStorage(STORAGE_DEMO_INFO + playData); 
		levelData = getPlayVerData(playData);
		//demoData = playerDemoData[playData-1];
		demoData = playerDemoData;
	} else {
		error(arguments.callee.name, "design error, value =" + playData );
	}	

	if(infoJSON == null) {
		curLevel = 1;
	} else {
		var infoObj = JSON.parse(infoJSON);
		curLevel = infoObj.l;
	}
	getValidDemoLevel();
	initDemoInfo();	
}

function setDemoInfo()
{
	var infoObj = { l:curLevel};
	var infoJSON = JSON.stringify(infoObj);

	if (playData >= 1 && playData <= maxPlayId) {
		setStorage(STORAGE_DEMO_INFO + playData, infoJSON); 	
	} else {
		error(arguments.callee.name, "design error, value =" + playData );
	}	
}

function getValidDemoLevel()
{
	while(typeof demoData[curLevel-1] == "undefined") {
		if(++curLevel > levelData.length) curLevel = 1;
	}
}

function getNextDemoLevel()
{
	getValidDemoLevel();
	setDemoInfo();
	initDemoInfo();
}

function curDemoLevelIsVaild()
{
	if(playData == PLAY_DATA_USERDEF) return 0;
	return (typeof playerDemoData[curLevel-1] != "undefined");
}

function updatePlayerDemoData(playData, demoDataInfo)
{
	var level = demoDataInfo.level;
	
	playerDemoData[level-1] = { 
		level: demoDataInfo.level, 
		ai: demoDataInfo.ai, 
		time: demoDataInfo.time, 
		state: demoDataInfo.state,
		action: demoDataInfo.action,
		goldDrop: demoDataInfo.goldDrop,
		bornPos: demoDataInfo.bornPos,
		godMode: demoDataInfo.godMode,
		player: playerName,
		date:   getLocalTime(),
		location: "Unknown", //update by sendDemoData2Server() resp.
		cId: "Unknown",
		ip: "updating"
	};
}

//======================
// resp from server
//======================
function respUpdatePlayerDemoData(jsonTxt)
{
	var respObj, level;
	
	if(jsonTxt.substring(0, 1) == "{" ) { 		
		respObj = JSON.parse(jsonTxt);
		level = respObj.level;
		
		if(respObj.playData == playData && playerDemoData[level-1].ip == "updating") {
			playerDemoData[level-1].ip = respObj.ip;
			playerDemoData[level-1].location = respObj.location;
			playerDemoData[level-1].cId = respObj.cId;
		}
	} else {
		error(arguments.callee.name, "Wrong resp Data: " + jsonTxt);
	}
}

//==============================
// Record play action for demo
//==============================

var RECORD_NONE = 0, RECORD_KEY = 1, RECORD_PLAY = 2;
var recordMode = RECORD_KEY; 
//var recordMode = RECORD_NONE; 

var recordCount, recordKeyCode = 0, lastKeyCode = -1;
var playRecord, goldRecord, bornRecord;
var goldRecordIdx, bornRecordIdx;
var playRecordTime, recordState;

function initRecordVariable()
{
	recordCount = 0;
	goldRecordIdx = 0;
	bornRecordIdx = 0;
	playRecordTime = 0;

	switch(recordMode) {
	case RECORD_KEY:
		recordKeyCode = 0;
		lastKeyCode = -1;	
		playRecord = [];
		goldRecord = [];
		bornRecord = [];
		break;
	case RECORD_PLAY:		
		recordIdx = 0;
		gameState = GAME_RUNNING;
		break;
	}
}

var alwaysRecord = 0, keyPressed = 0;
function saveKeyCode(code, keyAction)
{
	//-----------------------------------------------------------------------------
	// Don't care repeat times, always record key when press dig-left or dig-right 
	// fixed by Simon 12/12/2014
	//-----------------------------------------------------------------------------
	alwaysRecord = 0;
	if(keyAction == ACT_DIG_LEFT || keyAction == ACT_DIG_RIGHT) alwaysRecord = 1;
		
	recordKeyCode = code;
	keyPressed = 1;
}

function recordModeDump(state)
{
	recordPlayTime(state);
	remapActionKey();
	convertBornPos();
	dumpRecord();
}

function recordModeToggle(state)
{
	if(recordMode == RECORD_KEY) {
		if(playMode != PLAY_AUTO && playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE) recordMode = RECORD_PLAY;
		recordModeDump(state);
	} else recordMode = RECORD_KEY;
}

function processRecordKey()
{
	switch(recordMode) {
	case RECORD_KEY: //record the play key action
		recordKeyAction();
		break;
	case RECORD_PLAY: //play the record key 
		recordPlayDemo();
		break;
	}	
	recordCount++;
}

function recordKeyAction()
{
	if(repeatAction) recordKeyAction1();
	else recordKeyAction2()
}

//record key for "keyboard repeat on"	   
function recordKeyAction1()
{
	if(!keyPressed) return;
	if(recordKeyCode != lastKeyCode || alwaysRecord) {
		playRecord.push(recordCount);
		playRecord.push(recordKeyCode);
		lastKeyCode = recordKeyCode;
	}
	keyPressed = 0;
}

//record key for "keyboard repeat off"
// keyPressed= 1:pressed, 0:released, -1:floating (do nothing till pressed again)
function recordKeyAction2()
{
	switch(keyPressed) {
	case 1: //pressed
		if(recordKeyCode != lastKeyCode || alwaysRecord) {
			playRecord.push(recordCount);
			playRecord.push(recordKeyCode);
			lastKeyCode = recordKeyCode;
		}
		if(alwaysRecord) keyPressed = -1; //floating
		break;
	case 0:	//release	
		if(recordKeyCode != KEYCODE_SPACE) { 
			playRecord.push(recordCount);
			playRecord.push(KEYCODE_SPACE);
			lastKeyCode = recordKeyCode = KEYCODE_SPACE;
			keyAction = ACT_STOP;
		}
		break;	
	}
}

var recordIdx;

function recordPlayDemo()
{
	if(recordIdx < playRecord.length) {
		if(playRecord[recordIdx*2] == recordCount) {
			//loadingTxt.text = recordIdx;  //for debug
			pressKey(playRecord[recordIdx*2+1]);
			recordIdx++;
		}
	}
}

function processRecordGold(guard)
{
	switch(recordMode) {
	case RECORD_KEY: //record the play key action, save gold
		goldRecord.push(guard.hasGold);
		break;
	case RECORD_PLAY: //play the record key, get gold 
		guard.hasGold = goldRecord[goldRecordIdx++];
		break;
	}	

}

function saveRecordBornPos(x, y)
{
	bornRecord.push({ x:x, y:y });
}

function getRecordBornPos()
{
	if(bornRecord[0] == 2) {
		bornRecordIdx += 2;
		return { x: bornRecord[bornRecordIdx-1], y: bornRecord[bornRecordIdx] };
	} else {
		return { x: bornRecord[++bornRecordIdx], y: 1 };
	}
}

function recordPlayTime(state)
{
	playRecordTime = recordCount;
	recordState = (state == GAME_FINISH)?1:0; //finish or dead
}

var actionKeyMapping = [
	[ KEYCODE_A, KEYCODE_LEFT],  //move left
	[ KEYCODE_D, KEYCODE_RIGHT], //move right
	[ KEYCODE_W, KEYCODE_UP],    //move up
	[ KEYCODE_S, KEYCODE_DOWN],  //move down
	[ KEYCODE_Q, KEYCODE_Z],     //dig left
	[ KEYCODE_E, KEYCODE_X],     //dig right
	[ KEYCODE_COMMA, KEYCODE_Z], //dig left
	[ KEYCODE_PERIOD, KEYCODE_X] //dig right
];

//Remap action key to orignal "left, right, up down and Z, X"
//for backward compatible
function remapActionKey()
{
	for(var i = 0; i < playRecord.length; i+=2){
		for(var j = 0; j < actionKeyMapping.length; j++) {
			if(actionKeyMapping[j][0] == playRecord[i+1]) {
				playRecord[i+1] = actionKeyMapping[j][1];
				break;
			}
		}
	}
}

function convertBornPos()
{
	var len, offset = 1;
	var tmpRecord = [];
	
	if((len = bornRecord.length) <= 0) return;
	
	for(var i = 0; i < len; i++) if(bornRecord[i].y != 1) offset = 2;
	
	tmpRecord[0] = offset;
	for(var i = 0; i < len; i++) {
		tmpRecord[i*offset+1] = bornRecord[i].x;
		if(offset == 2) tmpRecord[i*offset+2] = bornRecord[i].y;
	}
	bornRecord = tmpRecord;
}

var curDemoData;
function dumpRecord()
{
	var txtStr;	
	
	curDemoData = {};
	curDemoData.level = curLevel;
	curDemoData.ai = AI_VERSION;
	curDemoData.time = playRecordTime;
	curDemoData.state = recordState; //game finish or not
	curDemoData.action = [];
	curDemoData.goldDrop = [];
	curDemoData.bornPos = [];
	curDemoData.godMode = godModeKeyPressed; //07/09/2014

	for(var i = 0; i < playRecord.length; i++) {
		curDemoData.action[i] = playRecord[i];
	}
	
	for(var i = 0; i < goldRecord.length; i++) {
		curDemoData.goldDrop[i] = goldRecord[i];
	}
	
	for(var i = 0; i < bornRecord.length; i++) {
		curDemoData.bornPos[i] = bornRecord[i];
	}

	debug(curDemoData);
	
	debug("	{ level: " + curLevel + ","); 
	debug("		ai: " + AI_VERSION + ","); 
	debug("		time: " + playRecordTime + ",");
	debug("		state: " + recordState + ",");
	debug("		godMode: " + godModeKeyPressed + ","); //07/09/2014

	if(playRecord.length > 0) {
		txtStr = "		action: [ " + playRecord[0];
		for(var i = 1; i < playRecord.length; i++) {
			txtStr += ", " + playRecord[i];
		}
		debug(txtStr+ " ], //" + (playRecord.length/2));
	} else {
		debug("		action: [ ],");
	}
	
	if(goldRecord.length > 0) {
		txtStr = "		goldDrop: [ " + goldRecord[0];
		for(var i = 1; i < goldRecord.length; i++) {
			txtStr += ", " + goldRecord[i];
		}
		debug(txtStr+ " ],");
	} else {
		debug("		goldDrop: [ ],");
	}
	if( bornRecord.length > 0) {
		txtStr = "		bornPos: [ " + bornRecord[0];
		for(var i = 1; i < bornRecord.length; i++) {
			txtStr += ", " + bornRecord[i];
		}
		debug(txtStr+" ]");
	} else {
		debug("		bornPos: [ ]");
	}
	
	debug("	},");
}
