var RUNNER_SPEED = 0.65;  
var DIG_SPEED = 0.68;    //for support champLevel, change DIG_SPEED and FILL_SPEED, 2014/04/12
var FILL_SPEED = 0.24;
var GUARD_SPEED = 0.3;

var FLASH_SPEED = 0.25; //for flash cursor (hi-score input mode)

var COVER_PROGRESS_BAR_H = 32;
var COVER_PROGRESS_UNDER_Y = 90;
var COVER_RUNNER_UNDER_Y = 136;
var COVER_SIDE_X = 56;		

var SIGNET_UNDER_X = 30;
var SIGNET_UNDER_Y = 30;

//*********************
// preload cover page
//*********************
var coverBitmap, titleBackground, remakeBitmap, signetBitmap;
var helpObj, helpBitmap, editHelpBitmap;
var mainMenuIconBitmap, mainMenuIconObj;
var selectIconBitmap, selectIconObj;
var demoIconBitmap, demoIconObj;
var soundOnIconBitmap, soundOffIconBitmap, soundIconObj;
var helpIconBitmap, helpIconObj;
var infoObj, infoIconBitmap, infoIconObj;
var repeatActionOnIconBitmap, repeatActionOffIconBitmap, repeatActionIconObj;
var apple2IconBitmap, C64IconBitmap, themeIconObj, themeColorObj;
var checkBitmap;
var returnBitmap, select1Bitmap, nextBitmap;
var yesBitmap, noBitmap;
var coverPageLoad;
var noCache = "?" + VERSION+ ".1051230";

function showLoadingPage() 
{
	var coverPageImages = [
		{ src: "image/cover.png"+noCache,  id: "cover" },
		{ src: themeImagePath + THEME_APPLE2 + "/runner.png"+noCache,  id: "runner" }
	];
		
	coverPageLoad = new createjs.LoadQueue(true);
	coverPageLoad.on("error", handleCoverPageError);
	coverPageLoad.on("fileload", handleCoverPageFileLoad);
	coverPageLoad.on("complete", handleCoverPageComplete);
	coverPageLoad.loadManifest(coverPageImages);
		
	function handleCoverPageError(e)
	{
		console.log("error", e);
	}

	function handleCoverPageFileLoad(e)
	{
		switch(e.item.id) {	
		case "cover":	
			addCover2Screen(e.result);
			break;
		case "runner":
			createRunnerSpriteSheet(e.result);
			break;
		} 
	}

	function handleCoverPageComplete(e)
	{
		preloadResource();
	}
		
	function addCover2Screen(image)
	{
		coverBitmap = new createjs.Bitmap(image);
		coverBitmap.setTransform(0, 0, tileScale, tileScale); //x,y, scaleX, scaleY 
		
		addTitleBackground(coverBitmap.getBounds().width*tileScale|0,
		                   coverBitmap.getBounds().height*tileScale|0);
		
		mainStage.addChild(coverBitmap);	
		mainStage.update();	
	}
	
	function addTitleBackground(width, height)
	{
		titleBackground = new createjs.Shape();
		titleBackground.graphics.beginFill("white").drawRect(0, 0, width, height);
		mainStage.addChild(titleBackground);
	}
}

function createRunnerSpriteSheet(runnerImage)
{
	runnerData = new createjs.SpriteSheet({
		images: [runnerImage],
		
		frames: { regX:0, height: BASE_TILE_Y,  regY:0, width: BASE_TILE_X},
		
		animations: { 
			runRight: [0,2, "runRight", RUNNER_SPEED], 
			runLeft : [3,5, "runLeft",  RUNNER_SPEED], 
			runUpDn : [6,7, "runUpDn",  RUNNER_SPEED],

			barRight: {
				frames: [ 18, 19, 19, 20, 20 ],
				next:  "barRight",
				speed: RUNNER_SPEED
			},

			barLeft: {
				frames: [ 21, 22, 22, 23, 23 ],
				next:  "barLeft",
				speed: RUNNER_SPEED
			},
					 
			digRight: 24,
			digLeft : 25,

			fallRight : 8,
			fallLeft: 26
		} 
	});
}

//*****************************************************************************		
//BEGIN of preload		
//*****************************************************************************		
var preload; //preload resource object
var firstPlay = 0;

var runnerData;
var guardData = {}, redhatData = {};
var holeData, holeObj = {};
var textData;
var countryFlagData;

var soundFall, soundDig, soundPass, soundEnding;

var themeImagePath = "image/Theme/";
var themeSoundPath = "sound/Theme/";

function preloadResource() 
{
	var runnerSprite = new createjs.Sprite(runnerData, "runRight");
	var progress = new createjs.Shape(); 
	var progressBorder = new createjs.Shape();
	var percentTxt = new createjs.Text("0", (COVER_PROGRESS_BAR_H* tileScale) + "px Arial", "#FF0000");

	var resource = [
		{ src: "image/remake.png"+noCache,  id: "remake" },
		{ src: "image/signet.png"+noCache,  id: "signet" },

		{ src: themeImagePath + THEME_APPLE2 + "/empty.png"+noCache,   id: "empty" + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/brick.png"+noCache,   id: "brick" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/block.png"+noCache,   id: "solid" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/ladder.png"+noCache,  id: "ladder" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/rope.png"+noCache,    id: "rope" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/trap.png"+noCache,    id: "trapBrick" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/hladder.png"+noCache, id: "hladder" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/gold.png"+noCache,    id: "gold" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/guard1.png"+noCache,  id: "guard1" + THEME_APPLE2  },
		{ src: themeImagePath + THEME_APPLE2 + "/runner1.png"+noCache, id: "runner1" + THEME_APPLE2  },

		{ src: themeImagePath + THEME_APPLE2 + "/runner.png"+noCache,  id: "runner"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/guard.png"+noCache,   id: "guard"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/redhat.png"+noCache,  id: "redhat"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/hole.png"+noCache,    id: "hole"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/ground.png"+noCache,  id: "ground"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/over.png"+noCache,    id: "over"  + THEME_APPLE2 },
		{ src: themeImagePath + THEME_APPLE2 + "/text.png"+noCache,    id: "text"  + THEME_APPLE2 },

		
		{ src: themeImagePath + THEME_C64 + "/empty.png"+noCache,   id: "empty" + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/brick.png"+noCache,   id: "brick" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/block.png"+noCache,   id: "solid" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/ladder.png"+noCache,  id: "ladder" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/rope.png"+noCache,    id: "rope" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/trap.png"+noCache,    id: "trapBrick" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/hladder.png"+noCache, id: "hladder" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/gold.png"+noCache,    id: "gold" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/guard1.png"+noCache,  id: "guard1" + THEME_C64  },
		{ src: themeImagePath + THEME_C64 + "/runner1.png"+noCache, id: "runner1" + THEME_C64  },

		{ src: themeImagePath + THEME_C64 + "/runner.png"+noCache,  id: "runner"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/guard.png"+noCache,   id: "guard"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/redhat.png"+noCache,  id: "redhat"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/hole.png"+noCache,    id: "hole"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/ground.png"+noCache,  id: "ground"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/over.png"+noCache,    id: "over"  + THEME_C64 },
		{ src: themeImagePath + THEME_C64 + "/text.png"+noCache,    id: "text"  + THEME_C64 },
		
		{ src: "image/eraser.png"+noCache,  id: "eraser" },
	
		{ src: "image/help.png"+noCache,    id: "help" },
		{ src: "image/editHelp.png"+noCache,id: "editHelp" },
		
		{ src: "image/menu.png"+noCache,    id: "menu" },
		{ src: "image/select.png"+noCache,  id: "select" },
		{ src: "image/check.png"+noCache,   id: "check" }, //check icon for select menu
		
		{ src: "image/return.png"+noCache,  id: "return" },
		{ src: "image/select1.png"+noCache, id: "select1" },
		{ src: "image/next.png"+noCache,    id: "next" },
		
		{ src: "image/yes.png"+noCache,     id: "yes" },
		{ src: "image/no.png"+noCache,      id: "no" },

		{ src: "image/demo.png"+noCache,id: "demo" },
		
		{ src: "image/soundOn.png"+noCache,  id: "soundOn" },
		{ src: "image/soundOff.png"+noCache, id: "soundOff" },
		
		{ src: "image/infoIcon.png"+noCache, id: "infoIcon" },
		{ src: "image/helpIcon.png"+noCache, id: "helpIcon" },

		{ src: "image/repeatOn.png"+noCache,  id: "repeatOn" },
		{ src: "image/repeatOff.png"+noCache, id: "repeatOff" },
		
		{ src: "image/apple2.png"+noCache,     id: "apple2" },
		{ src: "image/commodore64.png"+noCache,id: "C64" },
		
		{ src: "image/flags32.png"+noCache,     id: "flag" },
	
		{ src: themeSoundPath + THEME_APPLE2 + "/born.ogg"+noCache,    id:"reborn" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/dead.ogg"+noCache,    id:"dead" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/dig.ogg"+noCache,     id:"dig" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/getGold.ogg"+noCache, id:"getGold" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/fall.ogg"+noCache,    id:"fall" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/down.ogg"+noCache,    id:"down" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/pass.ogg"+noCache,    id:"pass" + THEME_APPLE2},
		{ src: themeSoundPath + THEME_APPLE2 + "/trap.ogg"+noCache,    id:"trap" + THEME_APPLE2},

		
		{ src: themeSoundPath + THEME_C64 + "/born.ogg"+noCache,    id:"reborn" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/dead.ogg"+noCache,    id:"dead" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/dig.ogg"+noCache,     id:"dig" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/getGold.ogg"+noCache, id:"getGold" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/fall.ogg"+noCache,    id:"fall" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/down.ogg"+noCache,    id:"down" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/pass.ogg"+noCache,    id:"pass" + THEME_C64},
		{ src: themeSoundPath + THEME_C64 + "/trap.ogg"+noCache,    id:"trap" + THEME_C64},

		{ src: themeSoundPath + THEME_C64 + "/goldFinish1.ogg"+noCache,    id:"goldFinish1"},
		{ src: themeSoundPath + THEME_C64 + "/goldFinish2.ogg"+noCache,    id:"goldFinish2"},
		{ src: themeSoundPath + THEME_C64 + "/goldFinish3.ogg"+noCache,    id:"goldFinish3"},
		{ src: themeSoundPath + THEME_C64 + "/goldFinish4.ogg"+noCache,    id:"goldFinish4"},
		{ src: themeSoundPath + THEME_C64 + "/goldFinish5.ogg"+noCache,    id:"goldFinish5"},
		{ src: themeSoundPath + THEME_C64 + "/goldFinish6.ogg"+noCache,    id:"goldFinish6"},
		
		{ src: "sound/goldFinish.ogg"+noCache,  id:"goldFinish"},
		{ src: "sound/ending.ogg"+noCache,      id:"ending"},
		{ src: "sound/scoreBell.ogg"+noCache,   id:"scoreBell"},
		{ src: "sound/scoreCount.ogg"+noCache,  id:"scoreCount"},
		{ src: "sound/scoreEnding.ogg"+noCache, id:"scoreEnding"},
		
		{ src: "sound/beep.ogg"+noCache, id:"beep"},
		
		{ src: "cursor/openhand.cur"+noCache, id:"openHand"}, //preload cursor
		{ src: "cursor/closedhand.cur"+noCache, id:"closeHand"}
		
	];	
	
	preload = new createjs.LoadQueue(true);
	createjs.Sound.alternateExtensions = ["mp3"];
	preload.installPlugin(createjs.Sound);
	preload.on("error", handleFileError);
	preload.on("progress", handleProgress);
	preload.on("complete", handleComplete);

	preload.loadManifest(resource);

	createjs.Ticker.setFPS(30);
	var preloadTicker = createjs.Ticker.on("tick", mainStage);

	//Set runner sprite size & position
	runnerSprite.setTransform(COVER_SIDE_X* tileScale, 
							  (BASE_SCREEN_Y - COVER_RUNNER_UNDER_Y)* tileScale,
							  tileScale, 
							  tileScale);
	runnerSprite.gotoAndPlay();	

	var width = canvas.width - 2*COVER_SIDE_X* tileScale;
	var height = COVER_PROGRESS_BAR_H * tileScale;

	//Set progress & progressborder size & position
	progressBorder.graphics.beginStroke("gold").drawRect(0,0,width,height);
	progress.x = progressBorder.x = COVER_SIDE_X * tileScale;
	progress.y = progressBorder.y = (BASE_SCREEN_Y - COVER_PROGRESS_UNDER_Y) * tileScale;
	
	//Set percentTxt position
	percentTxt.x = (canvas.width - percentTxt.getBounds().width) / 2 | 0;
	percentTxt.y = (BASE_SCREEN_Y - COVER_PROGRESS_UNDER_Y) * tileScale;
	
	mainStage.addChild(runnerSprite, progress, progressBorder, percentTxt);
	
	function handleFileError(event) 
	{
		console.log("error", event);
	}

	function handleProgress(event) 
	{
		progress.graphics.clear();
		progress.graphics.beginFill("gold").drawRect(0,0,width*(event.loaded / event.total),height);
		percentTxt.text = (100*(event.loaded / event.total)|0) + "%";
		percentTxt.x = (canvas.width - percentTxt.getBounds().width) / 2 | 0;
	}

	function handleComplete(event) 
	{
		percentTxt.text = "100%";
		mainStage.update();

		createSoundInstance();
		createBaseBitmapInstance(); //9/1/2016
		setTimeout(clearLoadingInfo, 500);
	}
	
	function clearLoadingInfo()
	{
		mainStage.removeChild(runnerSprite, progress, progressBorder, percentTxt);
		colorTitleBackground();
		showSignetBitmap();
		mainStage.addChild(signetBitmap);
		showRemakeBitmap();
		mainStage.addChild(remakeBitmap);
		mainStage.update();
	}
	
	//change title color to rainbow gradient color
	function colorTitleBackground()
	{
		var width = coverBitmap.getBounds().width*tileScale|0;
	 	var height = coverBitmap.getBounds().height*tileScale|0;
		
		//rainbow gradient color
    	titleBackground.graphics
		.clear().beginLinearGradientFill(
			//https://simple.wikipedia.org/wiki/Rainbow
			["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"], 
			[0, .14, .28, .42, .56, .70, .84, .98], 
			0, height/5,width*6/5,height*2/5)
		.drawRect(0, 0, width, height);
	}
	
	function showSignetBitmap()
	{
		var x, y;
		signetBitmap = new createjs.Bitmap(preload.getResult("signet"));
		x = (BASE_SCREEN_X - SIGNET_UNDER_X - signetBitmap.getBounds().width )* tileScale;
		y = (BASE_SCREEN_Y - SIGNET_UNDER_Y - signetBitmap.getBounds().height)* tileScale;
		signetBitmap.setTransform(x, y, tileScale, tileScale); //x,y, scaleX, scaleY 
		signetBitmap.set({alpha:0.8});
		createjs.Tween.get(signetBitmap).set({alpha:0.8}).to({alpha:1}, 500);
	}	
	
	//create remake image 
	function showRemakeBitmap()
	{
		var x = 372 * tileScale;
		var y = 130 * tileScale;
		remakeBitmap = new createjs.Bitmap(preload.getResult("remake"));
		remakeBitmap.setTransform(x, y, tileScale, tileScale); //x,y, scaleX, scaleY 
		remakeBitmap.rotation = -5;
		remakeBitmap.set({alpha:0.6});
		createjs.Tween.get(remakeBitmap).set({alpha:0.6}).to({alpha:1}, 800).call(preloadComplet);
	}
	
	function createHelpObj()
	{
		helpBitmap = new createjs.Bitmap(preload.getResult("help"));
		editHelpBitmap = new createjs.Bitmap(preload.getResult("editHelp"));
		//demoHelpBitmap = new createjs.Bitmap(preload.getResult("demoHelp")); //replace by infoMenu, 5/14/2015
		
		helpObj = new helpMenuClass(mainStage, helpBitmap, editHelpBitmap, tileScale);
	}
	
	function createMenuBitmapIcon()
	{
		mainMenuIconBitmap = new createjs.Bitmap(preload.getResult("menu"));
		mainMenuIconObj = new mainMenuIconClass(screenX1, screenY1, tileScale, mainMenuIconBitmap);
		
		selectIconBitmap = new  createjs.Bitmap(preload.getResult("select"));
		selectIconObj = new selectIconClass(screenX1, screenY1, tileScale, selectIconBitmap); 
		
		demoIconBitmap = new createjs.Bitmap(preload.getResult("demo")); //04/18/2015
		demoIconObj = new demoIconClass(screenX1, screenY1, tileScale, demoIconBitmap);

		soundOnIconBitmap = new createjs.Bitmap(preload.getResult("soundOn")); //04/18/2015
		soundOffIconBitmap = new createjs.Bitmap(preload.getResult("soundOff"));
		soundIconObj = new soundIconClass(screenX1, screenY1, tileScale, soundOnIconBitmap, soundOffIconBitmap);
		
		infoIconBitmap = new createjs.Bitmap(preload.getResult("infoIcon")); //05/12/2015
		infoIconObj = new infoIconClass(screenX1, screenY1, tileScale, infoIconBitmap);
		infoObj = new infoMenuClass(mainStage, tileScale);
		
		helpIconBitmap = new createjs.Bitmap(preload.getResult("helpIcon")); //04/21/2015
		helpIconObj = new helpIconClass(screenX1, screenY1, tileScale, helpIconBitmap);

		repeatActionOnIconBitmap = new createjs.Bitmap(preload.getResult("repeatOn")); //05/17/2015
		repeatActionOffIconBitmap = new createjs.Bitmap(preload.getResult("repeatOff"));
		repeatActionIconObj = new repeatActionIconClass(screenX1, screenY1, tileScale, repeatActionOnIconBitmap, repeatActionOffIconBitmap);
		
		apple2IconBitmap = new createjs.Bitmap(preload.getResult("apple2")); //04/18/2015
		C64IconBitmap = new createjs.Bitmap(preload.getResult("C64"));
		themeIconObj = new themeIconClass(screenX1, screenY1, tileScale, apple2IconBitmap, C64IconBitmap);

		themeColorObj = new colorSelectorClass(screenX1, screenY1, tileWScale);
		checkBitmap = new  createjs.Bitmap(preload.getResult("check"));
		
		returnBitmap = new createjs.Bitmap(preload.getResult("return"));
		select1Bitmap = new createjs.Bitmap(preload.getResult("select1"));
		nextBitmap = new createjs.Bitmap(preload.getResult("next"));
		
		yesBitmap = new createjs.Bitmap(preload.getResult("yes"));
		noBitmap = new createjs.Bitmap(preload.getResult("no"));
		
	}

	function preloadComplet()
	{
		createHelpObj();
		createMenuBitmapIcon();
		getFirstPlayInfo();
		createjs.Ticker.off("tick", preloadTicker); //remove ticker of cover page
		waitIdleDemo(4000); //wait user key or show demo level
	}
}

function createSoundInstance()
{
	soundFall = createjs.Sound.createInstance("fall" + curTheme); 
	soundDig = createjs.Sound.createInstance("dig" + curTheme);
	soundPass = createjs.Sound.createInstance("pass" + curTheme);
	
	soundEnding = createjs.Sound.createInstance("ending"); //for training mode only 
	
}

//==============================
// support different AI-version 
//==============================

var spriteSpeed = [
	{ runnerSpeed: 0.65, guardSpeed: 0.3,  digSpeed: 0.68, fillSpeed: 0.24, xMoveBase: 8, yMoveBase: 8 }, //ver 1
	{ runnerSpeed: 0.70, guardSpeed: 0.35, digSpeed: 0.68, fillSpeed: 0.27, xMoveBase: 8, yMoveBase: 9 }, //ver 2
	{ runnerSpeed: 0.8,  guardSpeed: 0.4,  digSpeed: 1,    fillSpeed: 1,    xMoveBase: 8, yMoveBase: 9 }  //ver 3 & 4 
];

var curAiVersion = AI_VERSION;
var maxGuard = MAX_NEW_GUARD; 
function setSpeedByAiVersion()
{
	var idx = (curAiVersion > spriteSpeed.length)?(spriteSpeed.length-1):(curAiVersion-1); //array index don't overflow
	var speedObj = spriteSpeed[idx];
	
	RUNNER_SPEED = speedObj.runnerSpeed;
	GUARD_SPEED = speedObj.guardSpeed;
	DIG_SPEED = speedObj.digSpeed;
	FILL_SPEED = speedObj.fillSpeed;
	
	xMove = speedObj.xMoveBase; 
 	yMove = speedObj.yMoveBase;
	
	//------------------------------------------------------------------------------------
	// Change move policy for support LR FAN BOOK with one guard 
	// Original policy for one guard is [0, 1, 1] ==> 2/3 speed of runner 
	// while AI_VERSION >= 3 change policy to [ 0, 1, 0, 1, 0, 1 ] ==> 1/2 speed of runner
	//------------------------------------------------------------------------------------
	if(curAiVersion < 3) {
		movePolicy[1] = [0, 1, 1, 0, 1, 1];
		maxGuard = MAX_OLD_GUARD;
	} else {
		movePolicy[1] = [0, 1, 0, 1, 0, 1]; //slow down the guard when only one guard
		maxGuard = MAX_NEW_GUARD;           //change max guard 
	}
	
	themeDataReset(1); //4/16/2015
	createHoleObj();  //6/27/2016
}

function themeDataReset(resetAll)
{
	if(resetAll) createSoundInstance(); //Base on current theme
	createSpriteSheet();   //Base on theme & Ai Version
}

function createSpriteSheet()
{
	//createRunnerSpriteSheet(coverPageLoad.getResult("runner"));
	createRunnerSpriteSheet(getThemeBitmap("runner").image);
	createPreloadSpriteSheet();
	createFlagSpriteSheet();
}

function createPreloadSpriteSheet() 
{
	guardData = createGuardObj("guard");
	redhatData = createGuardObj("redhat");
		
	holeData = new createjs.SpriteSheet( {
		images: [getThemeBitmap("hole").image],
		
		frames: [
			//dig hole Left
			[BASE_TILE_X*0,0,BASE_TILE_X,BASE_TILE_Y*2], //0 [x,y, width, height]
			[BASE_TILE_X*1,0,BASE_TILE_X,BASE_TILE_Y*2], //1
			[BASE_TILE_X*2,0,BASE_TILE_X,BASE_TILE_Y*2], //2
			[BASE_TILE_X*3,0,BASE_TILE_X,BASE_TILE_Y*2], //3
			[BASE_TILE_X*4,0,BASE_TILE_X,BASE_TILE_Y*2], //4
			[BASE_TILE_X*5,0,BASE_TILE_X,BASE_TILE_Y*2], //5
			[BASE_TILE_X*6,0,BASE_TILE_X,BASE_TILE_Y*2], //6
			[BASE_TILE_X*7,0,BASE_TILE_X,BASE_TILE_Y*2], //7
			
			//dig hole right
			[BASE_TILE_X*0,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //08
			[BASE_TILE_X*1,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //09
			[BASE_TILE_X*2,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //10
			[BASE_TILE_X*3,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //11
			[BASE_TILE_X*4,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //12
			[BASE_TILE_X*5,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //13
			[BASE_TILE_X*6,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //14
			[BASE_TILE_X*7,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y*2], //15
			
			//fill hole
			[BASE_TILE_X*7,BASE_TILE_Y*2,BASE_TILE_X,BASE_TILE_Y], //16
			[BASE_TILE_X*8,BASE_TILE_Y,  BASE_TILE_X,BASE_TILE_Y], //17
			[BASE_TILE_X*8,0,            BASE_TILE_X,BASE_TILE_Y], //18
			[BASE_TILE_X*8,BASE_TILE_Y*3,BASE_TILE_X,BASE_TILE_Y]  //19
		],	
		
		animations: { 
			digHoleLeft:  [0, 7, false, DIG_SPEED],
			digHoleRight: [8,15, false, DIG_SPEED],
			fillHole: { 
				frames: [16, 16, 16, 16, 16, 16, 16, 16, 16,
				         16, 16, 16, 16, 16, 16, 16, 16, 16,
				         16, 16, 16, 16, 16, 16, 16, 16, 16,
				         16, 16, 16, 16, 16, 16, 16, 16, 16, 
				         16, 16, 16, 16, 16, 16, 16, 16, 16,
				         17, 17, 18, 18, 19 ], //delay fill time for champLevel, 2014/04/12
				next:  false,
				speed: FILL_SPEED
			}	
		}
	});
	
	textData = new createjs.SpriteSheet({
		images: [getThemeBitmap("text").image],
		
		frames: {regX:0, height: BASE_TILE_Y,  regY: 0, width: BASE_TILE_X},
		
		animations: { 
			"N0": 0, "N1": 1, "N2": 2, "N3": 3, "N4": 4, 
			"N5": 5, "N6": 6, "N7": 7, "N8": 8, "N9": 9,
			"A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17,
			"I": 18, "J": 19, "K": 20, "L": 21, "M": 22, "N": 23, "O": 24, "P": 25,
			"Q": 26, "R": 27, "S": 28, "T": 29, "U": 30, "V": 31, "W": 32, "X": 33,
			"Y": 34, "Z": 35, 
			"DOT": 36, "LT": 37, "GT": 38, "DASH": 39,
			"@":40,  //gold
			"#":41,  //trap
			"FLASH": { //42 & 43 
				frames: [42, 42, 43, 43],
				next: "FLASH",
				speed: FLASH_SPEED
			},
			"SPACE":43, "COLON":44, "UNDERLINE": 45, 
			"D0": 50, "D1": 51, "D2": 52, "D3": 53, "D4": 54,  //blue digit number for player name, 11/17/2014
 			"D5": 55, "D6": 56, "D7": 57, "D8": 58, "D9": 59
		}
	});
}

function createGuardObj(imageName)
{
	var guard = new createjs.SpriteSheet(
	{
		images: [getThemeBitmap(imageName).image],
		
		frames: {regX:0, height: BASE_TILE_Y,  regY: 0, width: BASE_TILE_X},
		
		animations: { 
			runRight: [0,2,  "runRight", GUARD_SPEED], 
			runLeft : [3,5,  "runLeft",  GUARD_SPEED],
			runUpDn : [6,7,  "runUpDn",  GUARD_SPEED],
					 
			barRight: {
				frames: [ 22, 23, 23, 24, 24 ],
				next:  "barRight",
				speed: GUARD_SPEED
			},
				 
			barLeft: {
				frames: [ 25, 26, 26, 27, 27 ],
				next:  "barLeft",
				speed: GUARD_SPEED
			},

			reborn: {
				frames: [ 28, 28, 29 ], //if change frame idx, don't forgot change "rebornFrame"
				speed: GUARD_SPEED
			},

			fallRight : 8,
			fallLeft: 30,

			shakeRight: {
				frames: [ 8, 8, 8, 8, 8, 8, 8,
				          8, 8, 8, 8, 8, 8,
				          9, 10, 9, 10, 8 ],
				next: null,
				speed: GUARD_SPEED
			},

			shakeLeft: {
				frames: [ 30, 30, 30, 30, 30, 30, 30,
				          30, 30, 30, 30, 30, 30, 
				          31, 32, 31, 32, 30],
				next: null,
				speed: GUARD_SPEED
			}
		}
	});
	
	return guard;
}
	
function createHoleObj()
{
	holeObj.sprite = new createjs.Sprite(holeData, "digHoleLeft");
	
	if(curAiVersion < 3) {
		holeObj.digLimit = 6; //for check guard is close to runner when digging
	} else {
		holeObj.digLimit = 8; //for check guard is close to runner when digging
	}
	
	holeObj.action = ACT_STOP; //no digging 
}

//=======================================
// country flag for demo info 5/14/2015
//=======================================
function createFlagSpriteSheet()
{
	countryFlagData = new createjs.SpriteSheet({
		images: [preload.getResult("flag")],
		frames: {regX:0, height: 32,  regY: 0, width: 32},
		animations: countryId
	});
}