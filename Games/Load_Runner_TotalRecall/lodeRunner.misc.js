//============
// MISC
//============
var DEBUG = 0;
var demoSoundOff = 1;

function debug(string) 
{
	if(DEBUG) console.log(string);
}

function assert(expression, msg)
{
	console.assert(expression, msg);
}

function error(funName, string) 
{
	console.log("Error In " + funName + "( ): " + string);
}

function getScreenSize() 
{
	var x, y;
	
	//----------------------------------------------------------------------
	// Window size and scrolling:
	// URL: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
	//----------------------------------------------------------------------
	if (typeof (window.innerWidth) == 'number') {
		//Non-IE
		x = window.innerWidth;
		y = window.innerHeight;
	} else if ((document.documentElement) &&
		(document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return {x:x, y:y};
}

//================================
// show tips messgae
//===============================
function showTipsMsg(_tipsTxt, _stage, _scale, _tipsTxt1)
{
	var TEXT_SIZE = 72* _scale;
	var TEXT_COLOR = "#ff2020";
	var tipsText = new createjs.Text(_tipsTxt, "bold " +  TEXT_SIZE + "px Helvetica", TEXT_COLOR);
	var screenX1 = _stage.canvas.width;
	var screenY1 = _stage.canvas.height;

	tipsText.x = (screenX1) / 2 | 0;
	tipsText.y = screenY1/2 - tipsText.getBounds().height*5/4 | 0;
	tipsText.shadow = new createjs.Shadow("white", 3, 3, 2);
	tipsText.textAlign = "center";
	
	_stage.addChild(tipsText);
	
	createjs.Tween.get(tipsText).set({alpha:1}).wait(50).to({scaleX:1.2, scaleY:1.2, alpha:0}, 3500)
		.call(function(){_stage.removeChild(tipsText);});
		
	if(_tipsTxt1 != null) {
		// two tips 
		var tipsText1 = new createjs.Text(_tipsTxt1, "bold " +  TEXT_SIZE + "px Helvetica", TEXT_COLOR);
		
		tipsText1.x = (screenX1) / 2 | 0;
		tipsText1.y = screenY1/2 | 0;
		tipsText1.shadow = new createjs.Shadow("white", 3, 3, 2);
		tipsText1.textAlign = "center";

		_stage.addChild(tipsText1);
		
		createjs.Tween.get(tipsText1).set({alpha:1}).wait(50).to({scaleX:1.2, scaleY:1.2, alpha:0}, 3500)
			.call(function(){_stage.removeChild(tipsText1);});
		
	}
}

//==========================================
// move z-index to top for a child of stage
//==========================================
function moveChild2Top(stage, obj)
{
	stage.setChildIndex(obj, stage.getNumChildren() - 1);
}

//==========================
// BEGIN for Sound function
//==========================
var soundOff = 0;

function themeSoundPlay(name) 
{
	soundPlay(name + curTheme);
}

function soundDisable()
{
	if(playMode == PLAY_AUTO) return 1;
	if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) return demoSoundOff;
	else return soundOff;
}

function soundPlay(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.play(name);
	} else {
		name.stop(); //12/21/2014 , for support soundJS 0.6.0
		name.play();
	}
}

function soundStop(name)
{
	if(typeof name == "string") {
		return createjs.Sound.stop(name);
	} else {
		name.stop();
	}
}

function soundPause(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.pause(name);
	} else {
		name.paused=true; //SoundJS 0.6.2 API Changed, 8/28/2016 
	}
}

function soundResume(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.resume(name);
	} else {
		name.paused=false; //SoundJS 0.6.2 API Changed, 8/28/2016
	}
}

//==============================
// get time zone for php format
//==============================
function phpTimeZone()
{
	var d = new Date()
	var n = d.getTimezoneOffset();
	var n1 = Math.abs(n);

	//------------------------------------------------------------------------------------
	// AJAX POST and Plus Sign ( + ) — How to Encode:
	// Use encodeURIComponent() in JS and in PHP you should receive the correct values.
	// http://stackoverflow.com/questions/1373414/ajax-post-and-plus-sign-how-to-encode
	//------------------------------------------------------------------------------------
	
	//+0:00, +1:00, +8:00, -8:00 ....
	return ((n <=0)?encodeURIComponent("+"):"-")+ (n1/60|0) + ":" + ("0"+n1%60).slice(-2);
}

//========================================
// get local time (YYYY-MM-DD HH:MM:SS)
//========================================
function getLocalTime()
{
	var d = new Date();
	
	return (("000"+d.getFullYear()).slice(-4)+ "-" +("0"+(d.getMonth() + 1)).slice(-2)+ "-" +("0"+d.getDate()).slice(-2)+ " " +	
	       ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":"  + ("0"+d.getSeconds()).slice(-2));
}

//===============
// Random Object
//===============
function  rangeRandom(minValue, maxValue, seedValue)
{
	var rndList, idx, items;
	var min, max;
	var reset;
	var seed = 0;
	
	function rndStart()
	{
		var swapId, tmp;
	
		rndList = [];
		for(var i = 0; i < items; i++) rndList[i] = min + i;
		for(var i = 0; i < items; i++) {
			if(seedValue > 0) {
				seed = seedValue;	
				swapId = (seedRandom() * items) | 0;
			} else {
				swapId = (Math.random() * items) | 0;
			}
			tmp = rndList[i];
			rndList[i] = rndList[swapId];
			rndList[swapId] = tmp;
		}
		idx = 0;
		//debug(rndList);
	}
	
	function seedRandom() 
	{
    	var x = Math.sin(seed++) * 10000;
    	return x - Math.floor(x);
	}
	
	this.get = function ()
	{
		if( idx >= items) {
			rndStart();
			reset = 1;
		} else {
			reset = 0;
		}
		return rndList[idx++];
	}
	
	this.rndReset = function ()
	{
		return reset;
	}
	
	//---------
	// initial 
	//---------
	reset = 0;
	min = minValue;
	max = maxValue;
	if(min > max) { //swap
		var tmp;
		tmp = min;
		min = max;
		max = tmp;
	}
	items = max - min + 1;
	
	rndStart();
}

//======================================
// get demo data by playData (wData.js)
//======================================
function getDemoData(playData) 
{
	wDemoData = [];	
	switch(playData) {
	case 1:
		if(	typeof wfastDemoData1 !== "undefined" ) wDemoData = wfastDemoData1;
		break;
	case 2:
		if(	typeof wfastDemoData2 !== "undefined" ) wDemoData = wfastDemoData2;
		break;
	case 3:
		if(	typeof wfastDemoData3 !== "undefined" ) wDemoData = wfastDemoData3;
		break;
	case 4:
		if(	typeof wfastDemoData4 !== "undefined" ) wDemoData = wfastDemoData4;
		break;
	case 5:
		if(	typeof wfastDemoData5 !== "undefined" ) wDemoData = wfastDemoData5;
		break;
	}
	for(var i = 0; i < wDemoData.length; i++) { //temp
		playerDemoData[wDemoData[i].level-1] = wDemoData[i]; 
	}
}

//===========================================================================
// Chrome 66 policy changes default mute autoplay, need resume it 
// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes 
//
// Reference: https://github.com/CreateJS/SoundJS/issues/297
//===========================================================================
function resumeAudioContext() 
{
	// handler for fixing suspended audio context in Chrome
	//------------------------------------------------------------------
	// Error Msgs:
	// "The AudioContext was not allowed to start. 
	//  It must be resume (or created) after a user gesture on the page.
	//  https://goo.gl/7K7WLu"
	//------------------------------------------------------------------
	try {
		if (createjs.WebAudioPlugin.context.state === "suspended") {
			createjs.WebAudioPlugin.context.resume();
			console.log("Resume Web Audio context...");
		}
	} catch (e) {
		// SoundJS context or web audio plugin may not exist
		console.error("There was an error while trying to resume the SoundJS Web Audio context...");
		console.error(e);
	}
}