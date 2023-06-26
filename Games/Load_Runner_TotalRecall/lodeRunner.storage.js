
var modernScoreInfo, editScoreInfo;

//=======================
// LOCAL STORAGE SET/GET 
//=======================

function setLastPlayMode()
{
	var infoObj = { m:playMode, d:playData };
	var infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_LASTPLAY_MODE, infoJSON); 	
}

function initClassicInfo()
{
	curScore = 0;	
	curLevel = maxLevel = 1;
	passedLevel = 0; //6/3/2015
	runnerLife = RUNNER_LIFE;
	sometimePlayInGodMode = 0;
}

function base64Decode(str)
{
	//----------------------------------------------------------------------------------------------------------
	// check string is base64 or not 
	// ref: http://stackoverflow.com/questions/8571501/how-to-check-whether-the-string-is-base64-encoded-or-not
	//----------------------------------------------------------------------------------------------------------
	var pattern = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$");
	
	if(pattern.test(str) == true) {
		return atob(str); //base64 decode
	}
	return null; //string is not base64 
}

function getClassicInfo()
{
	var infoJSON = null;
	var needEncode = 0;
	
	if(playData >= 1 && playData <= maxPlayId) {
		infoJSON = getStorage(STORAGE_CLASSIC_INFO+playData); 
		//==================================
		// BEGIN for support base64 encode 
		//==================================
/*	for backward compatible disable it !	
		if(infoJSON) {
			if(infoJSON.charAt(0) != '{' ) { //assume base64 encoded
				infoJSON = base64Decode(infoJSON); //base64 decode
			} else { //no encode (for backward compatibility)
				if( getStorage(STORAGE_FIRST_PLAY) >= VERSION) infoJSON = null; //something wrong, reset it 
				else {
					setFirstPlayInfo(); //set current version
				}
				needEncode = 1; 
			}
		}
*/		
		//================================
		// END for support base64 encode
		//================================
	} else {
		error(arguments.callee.name, "design error, value =" + playData );
		playData = 1;	
	}
	levelData = getPlayVerData(playData);
	
	if(infoJSON == null) {
		initClassicInfo();
	} else {
		var infoObj = JSON.parse(infoJSON);
		
		if( ! (infoObj && ("s" in infoObj) && ("l" in infoObj) && ("m" in infoObj) ) ) {
			initClassicInfo(); //something wrong, reset it !
		} else {
			if(!infoObj.hasOwnProperty('g')) infoObj.g = 0; //god-mode
			if(!infoObj.hasOwnProperty('p')) infoObj.p = infoObj.l-1; //passed level
		
			curScore = infoObj.s;
			curLevel = infoObj.l;
			maxLevel = infoObj.m;
			passedLevel = infoObj.p;
			runnerLife = infoObj.r;
			sometimePlayInGodMode = infoObj.g;
		}
	}
	
	if(needEncode) setClassicInfo(0);
}

function setClassicInfo(passed)
{
	maxLevel = (maxLevel < curLevel)?curLevel:maxLevel;
	if(passed) passedLevel++;
	var infoObj = { s:curScore, l:curLevel, r:runnerLife, m: maxLevel, g: sometimePlayInGodMode, p: passedLevel};
	var infoJSON = JSON.stringify(infoObj);
	
	// for backward compatible disable it !	
	// infoJSON = btoa(infoJSON); //base64 encode, 6/3/2015
	
	if(playData >= 1 && playData <= maxPlayId) {
		setStorage(STORAGE_CLASSIC_INFO+playData, infoJSON); 	
	} else {
		error(arguments.callee.name, "design error, value =" + playData );
	}
}

function clearClassicInfo()
{
	clearStorage(STORAGE_CLASSIC_INFO + playData);
}

function getModernInfo()
{
	var infoJSON;
	
	switch(true) {
	case (playData >= 1 && playData <= maxPlayId):
		infoJSON = getStorage(STORAGE_MODERN_INFO+playData); 
		levelData = getPlayVerData(playData);
		break;
	case (playData == PLAY_DATA_USERDEF):
		if(editLevels > 0) {
			infoJSON = getStorage(STORAGE_USER_INFO); 
			levelData = editLevelData;
		} else { //no any user created level !
			playData = 1;
			playData2MainMenuId();
			infoJSON = getStorage(STORAGE_MODERN_INFO+1); 
			levelData = getPlayVerData(playData);
		}
		break;	
	default:		
		error(arguments.callee.name, "design error, value =" + playData );
		playData = 1;	
		break;
	}
	
	if(infoJSON == null) {
		curScore = 0;	
		curLevel = 1;
		runnerLife = RUNNER_LIFE;
	} else {
		var infoObj = JSON.parse(infoJSON);
		curScore = 0;
		curLevel = infoObj.l;
		runnerLife = RUNNER_LIFE;
	}
	getModernScoreInfo();	
}

function setModernInfo()
{
	var infoObj = { l:curLevel};
	var infoJSON = JSON.stringify(infoObj);
	
	switch(true) {
	case (playData >= 1 && playData <= maxPlayId):		
		setStorage(STORAGE_MODERN_INFO + playData, infoJSON); 
		break;
	case (playData == PLAY_DATA_USERDEF):
		setStorage(STORAGE_USER_INFO, infoJSON); //user created
		break;
	default:
		error(arguments.callee.name, "design error, value =" + playData );
		break;	
	}
}

function clearModernInfo()
{
	switch(true) {
	case (playData >= 1 && playData <= maxPlayId):		
		clearStorage(STORAGE_MODERN_INFO+playData);	
		break;
	case (playData == PLAY_DATA_USERDEF):
		clearStorage(STORAGE_USER_INFO);	
		break;
	default:
		error(arguments.callee.name, "design error, value =" + playData );
		break;	
	}	
}

function getModernScoreInfo()
{
	var infoJSON, levelSize;

	switch(true) {
	case (playData >= 1 && playData <= maxPlayId):		
		infoJSON = getStorage(STORAGE_MODERN_SCORE_INFO+playData); 
		levelSize = levelData.length;
		break;
	case (playData == PLAY_DATA_USERDEF):
		infoJSON = getStorage(STORAGE_USER_SCORE_INFO);  //user created
		levelSize = MAX_EDIT_LEVEL;	
		break;
	default:
		error(arguments.callee.name, "design error, value =" + playData );
		break;	
	}	
	
	if(infoJSON) {
		modernScoreInfo = JSON.parse(infoJSON);
		if(modernScoreInfo.length != levelSize) infoJSON = null;
	} 
	if(infoJSON == null) {
		modernScoreInfo = [];
		for(var i = 0; i < levelSize; i++) modernScoreInfo[i] = -1;
	}
}

function setModernScoreInfo()
{
	var infoJSON = JSON.stringify(modernScoreInfo);
	
	switch(true) {
	case (playData >= 1 && playData <= maxPlayId):		
		setStorage(STORAGE_MODERN_SCORE_INFO+playData, infoJSON); 
		break;
	case (playData == PLAY_DATA_USERDEF):
		setStorage(STORAGE_USER_SCORE_INFO, infoJSON); 
		break;
	default:
		error(arguments.callee.name, "design error, value =" + playData );
		break;	
	}
}

function getFirstPlayInfo()
{
	var firstValue;
	
	firstValue =  parseFloat(getStorage(STORAGE_FIRST_PLAY));
	
	if( isNaN(firstValue) || firstValue < parseFloat(VERSION) ) {
		firstPlay = 1; 
	}
}

function setFirstPlayInfo()
{
	setStorage(STORAGE_FIRST_PLAY, VERSION);
}

//=====================
// for edit mode
//=====================

var editLevelData, editLevels = -1, editLevelInfo;

function delEditLevel(level) 
{
	if(level > editLevels || level< 1) return false;
	
	var delId = editLevelInfo[level-1];
	
	editLevelInfo.splice(level-1,1); //delete id and shift others
	editLevelInfo.push(delId); //put the deleted id to last of array
	clearStorage(STORAGE_USER_LEVEL+("00"+(delId)).slice(-3));
	if(--editLevels <= 0) {
		clearEditLevelInfo(); //no edit levels
		clearStorage(STORAGE_USER_SCORE_INFO); //clear user score info
		initEditLevelInfo();
	} else {
		setEditLevelInfo();
		delUserLevelScore(level);
	}

	editLevelData.splice(level-1,1);
	
	return true;
}

function addEditLevel(levelMap) 
{
	if(editLevels >= MAX_EDIT_LEVEL) return false;
	setEditLevel(++editLevels, levelMap);
	setEditLevelInfo();
	
	return true;
}

function setEditLevel(level, levelMap)
{
	setStorage(STORAGE_USER_LEVEL+("00"+(editLevelInfo[level-1])).slice(-3), levelMap); 
	editLevelData[level-1] = levelMap;
}

function initEditLevelInfo()
{
	editLevels = 0;
	editLevelInfo = [];
	for(var i = 0; i < MAX_EDIT_LEVEL; i++) {
		editLevelInfo[i] = i+1;
	}	
}

function getEditLevelInfo()
{
	var infoJSON, levelMap;

	if(editLevels >= 0) return; //just once
	
	infoJSON = getStorage(STORAGE_EDIT_INFO); 
	editLevelData = [];
	
	if(infoJSON) {
		var infoObj = JSON.parse(infoJSON);
		editLevels = infoObj.no;
		editLevelInfo = infoObj.id;
	} else {
		initEditLevelInfo();
		if(getStorage(STORAGE_FIRST_PLAY) == null) {
			createUserDefaultLevel(); //first time, create user default level
		}
	}
	
	for(var i = 0; i < editLevels; i++) {
		levelMap = getStorage(STORAGE_USER_LEVEL + ("00"+(editLevelInfo[i])).slice(-3));
		if(levelMap == null || levelMap.length !=  NO_OF_TILES_X * NO_OF_TILES_Y) {
			debug("LOCAL STORAGE: get edit level map failed (" + i + ") !");
			editLevels =i; 
			break;
		}
		editLevelData[i] = levelMap;
	}

	curScore = 0;
	curLevel = editLevels+1;
	runnerLife = RUNNER_LIFE;
}

function setEditLevelInfo()
{
	var infoObj = { no:editLevels, id: editLevelInfo};
	var infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_EDIT_INFO, infoJSON); 
}

function clearEditLevelInfo()
{
	clearStorage(STORAGE_EDIT_INFO);
}

function initNewLevelInfo(testInfo)
{
	testInfo.level = editLevels+1;
	testInfo.levelMap = "";
	testInfo.pass = 0;
	testInfo.modified = 0;
	testInfo.fromPlayData = -1;
	testInfo.fromLevel = -1;
	for(var i = 0; i < NO_OF_TILES_X * NO_OF_TILES_Y; i++) 
		testInfo.levelMap += " "; //empty map
}

function compareWithExist(existLevelMap, testLevelMap)
{
	for(var i = 0; i < NO_OF_TILES_X * NO_OF_TILES_Y; i++) {
		if(existLevelMap.charAt(i) != testLevelMap.charAt(i)) return 1;
	}
	return 0;
}

function getTestLevel(testInfo)
{
	var infoJSON;
	
	if((infoJSON = getStorage(STORAGE_TEST_LEVEL)) == null)	{
		initNewLevelInfo(testInfo);
	} else {
		var init = testInfo.level<0?1:0;
		var infoObj = JSON.parse(infoJSON);
		
		testInfo.level  = infoObj.level;
		testInfo.levelMap = infoObj.map;
		testInfo.pass     = infoObj.pass;
		
		if(('fromPlayData' in infoObj) && ('fromLevel' in infoObj)) {
			testInfo.fromPlayData  = infoObj.fromPlayData;
			testInfo.fromLevel  = infoObj.fromLevel;
		} else {
			testInfo.fromPlayData  = testInfo.fromLevel  = -1;
		}

		//BEGIN for debug ====================
		var i = 0;
		for(var y = 0; y < NO_OF_TILES_Y; y++) {
			var string = ""
			for(var x = 0; x < NO_OF_TILES_X; x++) {
				string += testInfo.levelMap[i++];
			}
			//debug('"' + string + '"');
		}
		//END   for debug ====================
		
		if(testInfo.level > editLevels) testInfo.modified = 1;
		else {
			if(compareWithExist(editLevelData[infoObj.level-1], testInfo.levelMap) == 0) { 
				if(init) {
					//same as exist level, new level 
					clearTestLevel();
					initNewLevelInfo(testInfo);
				}
			} else {
				testInfo.modified = 1;
			}
		}
		
	}
}

function setTestLevel(testInfo)
{
	var infoObj = { level:testInfo.level, 
					map: testInfo.levelMap, 
					pass: testInfo.pass, 
					fromPlayData: testInfo.fromPlayData,
					fromLevel: testInfo.fromLevel
				  };
	var infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_TEST_LEVEL, infoJSON); 	
}

function clearTestLevel()
{
	clearStorage(STORAGE_TEST_LEVEL);
}

function createUserDefaultLevel()
{
	var myDefaultLevel =    //Double Happy 2014/05/25
		"0-------- ------- ---------0" +
		"H     &  #   $   #         H" +
		"H     #######S#######      H" +
		"H      $ #       # $       H" +
		"H     @@@#@@@S@@@#@@@      H" +
		"H        #       #         H" +
		"H     ####### #######      H" +
		"H     #  $  # #  $  #      H" +
		"H     #@@#### ####@@#      H" +
		"H        X       X         H" +
		"H     @@@#@@@X@@@#@@@      H" +
		"H        #       #         H" +
		"H     ####### #######      H" +
		"H     #  $  # #  $  #      H" +
		"H     ####### #######      H" +
		"H        #       #         H";		
	
	addEditLevel(myDefaultLevel);
}

//======================
// Repeat Action ON/OFF
//======================
function getRepeatAction()
{
	if((repeatAction = getStorage(STORAGE_REPEAT_ACTION)) == null)	{
		repeatAction = 0; //set default off (NES keyboard mode)
	} else {
		repeatAction = parseInt(repeatAction);
	}
}

function setRepeatAction()
{
	setStorage(STORAGE_REPEAT_ACTION, repeatAction); 	
}

//========================
// Gamepad Enable/Disable
//========================
function getGamepadMode()
{
	if((gamepadMode = getStorage(STORAGE_GAMEPAD_MODE)) == null)	{
		gamepadMode = 1; //set default enable
	} else {
		gamepadMode = parseInt(gamepadMode)?1:0;
	}
	return gamepadMode;
}

function setGamepadMode()
{
	setStorage(STORAGE_GAMEPAD_MODE, gamepadMode); 	
}

//====================
// Theme color state
//====================
function getThemeColor()
{
	var colorId, themeName;
	
	for(var i = 0; i < themeNameList.length; i++) {
		themeName = themeNameList[i];
		if((colorId = getStorage(STORAGE_THEME_COLOR + themeName)) == null)	{
			colorId = 0;
		} else {
			colorId = parseInt(colorId);
			if(colorId < 0 || colorId >= maxThemeColor) colorId = 0;
		}	
		curColorId[themeName] = colorId;
	}
}

function setThemeColor()
{
	setStorage(STORAGE_THEME_COLOR + curTheme, curColorId[curTheme]);
}

//===================
// Theme state
//===================
function getThemeMode()
{
	var themeName;
	if((themeName = getStorage(STORAGE_THEME_MODE)) == null)	{
		themeName = THEME_APPLE2;
	}
	return themeName;
}

function setThemeMode(themeName)
{
	setStorage(STORAGE_THEME_MODE, themeName); 	
}

//===================
// player name
//===================
function getPlayerName()
{
	var name;
	if((name = getStorage(STORAGE_PLAYER_NAME)) == null)	{
		name = "";
	}
	return name;
}

function setPlayerName(name)
{
	setStorage(STORAGE_PLAYER_NAME, name); 	
}

//===================
// uid
//===================
function getUid()
{
	var uid;
	if((uid = getStorage(STORAGE_UID)) == null)	{
		uid = "";
	}
	return uid;
}

function setUid(uid)
{
	setStorage(STORAGE_UID, uid); 	
}

//=========================
// for debug only 
//=========================
function genUserLevel(levels)
{
	var levelMap = 
		"                    H       " +
		"                   &H       " +
		"                   ##       " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " ;
	getEditLevelInfo();
	while(editLevels > 0) delEditLevel(1); //clear all user level
	
	for(var i = 1; i <= levels; i++) {
		var tmpMap = levelMap;
		var no = i%5;
		var str = "##########";
		for(var j = 0; j < no; j++) {
			var index = (no+j*2)*NO_OF_TILES_X;
			tmpMap = tmpMap.substr(0, index) + str + tmpMap.substr(index+str.length); 
		}
		addEditLevel(tmpMap);
	}
}

//=======================================
// BEGIN for set|get|clear localstorage
//=======================================
function setStorage(key, value) 
{
	if(typeof(window.localStorage) != 'undefined'){ 
		window.localStorage.setItem(key,value); 
	} 
}

function getStorage(key) 
{
	var value = null;
	if(typeof(window.localStorage) != 'undefined'){ 
		value = window.localStorage.getItem(key); 
	} 
	return value;
}

function clearStorage(key) 
{
	if(typeof(window.localStorage) != 'undefined'){ 
		window.localStorage.removeItem(key); 
	} 
}