var classicInfo = [
	{type: 'TITLE', contain: " Classic Lode Runner " },
	{type: 'TEXT' , contain: "Release year : 1983, 1984"},
	{type: 'TEXT' , contain: "Platform : APPLE-II, Commodore 64, IBM PC, NES ..."},
	{type: 'TEXT' , contain: "Publisher : Br\u00F8derbund & Ariolasoft" }, //Brøderbund
	{type: 'TEXT' , contain: "Developer : Douglas E. Smith" },
	{type: 'TEXT' , contain: "Difficulty : \u2605 \u2605 \u2605" } //★ ★ ★
];

//ref: http://www.gb64.com/game.php?id=5906&d=42
var proInfo = [
	{type: 'TITLE', contain: "    Professional Lode Runner    " },
	{type: 'TEXT' , contain: "Release year : 1984, 1985"},
	{type: 'TEXT' , contain: "Platform : Commodore 64"},
	{type: 'TEXT' , contain: "Publisher : DodoSoft & AlphaSoft" },
	{type: 'TEXT' , contain: "Developer : Unknown" },
	{type: 'TEXT' , contain: "Difficulty : \u2605 \u2605 \u2605 \u2605" } //★ ★ ★ ★
];

//ref:http://www.vizzed.com/play/revenge-of-lode-runner-appleii-online-apple-ii-6223-game
var revengeInfo = [
	{type: 'TITLE', contain: "    Revenge of Lode Runner    " },
	{type: 'TEXT' , contain: "Release year : 1985, 1986"},
	{type: 'TEXT' , contain: "Platform : APPLE-II"},
	{type: 'TEXT' , contain: "Publisher : Br\u00F8derbund" }, //Brøderbund
	{type: 'TEXT' , contain: "Developer : Mad Man" },
	{type: 'TEXT' , contain: "Difficulty : \u2605 \u2605 \u2605 \u2605" } //★ ★ ★ ★
];

var fanBookInfo = [
	{type: 'TITLE', contain: " Lode Runner Fan Book " },
	{type: 'TEXT' , contain: 'From : "Apple Lode Runner - The Remake 1.0h"'},
	{type: 'TEXT' , contain: "Platform : Microsoft Windows"},
	{type: 'TEXT' , contain: "Publisher : Spoonbill Software" },
	{type: 'TEXT' , contain: 'Developer : Custom levels'},
	{type: 'TEXT_LINK' , text: "URL : ",
	 				     textLink: "http://www.spoonbillsoftware.com.au/loderunner.htm",
	 				     url: "http://www.spoonbillsoftware.com.au/loderunner.htm"
	},
	{type: 'TEXT' , contain: "Difficulty : \u2605 \u2605 \u2605 \u2605 \u2605" } //★ ★ ★ ★ ★
];

var championInfo = [
	{type: 'TITLE', contain: " Championship Lode Runner " },
	{type: 'TEXT' , contain: "Release year : 1984, 1985"},
	{type: 'TEXT' , contain: "Platform : APPLE-II, Commodore 64, NES ..."},
	{type: 'TEXT' , contain: "Publisher : Br\u00F8derbund & Hudson Soft" }, //Brøderbund
	{type: 'TEXT' , contain: "Developer : Douglas E. Smith" },
	{type: 'TEXT' , contain: "Difficulty : \u2605 \u2605 \u2605 \u2605 \u2605" } //★ ★ ★ ★ ★
];

//=========================================================================================

var editInfo = [
	{type: 'TITLE', contain: "Edit Custom Level"},
	{type: 'TEXT' , contain: "NEW : New or clear editing level"},
	{type: 'TEXT' , contain: "LOAD : Load exists level for customization"},
	{type: 'TEXT' , contain: "TEST : Test editing level" },
	{type: 'TEXT' , contain: "SAVE : Save current level" }
	
];

var testInfo = [
	{type: 'TITLE', contain: "Test Custom Level"},
	{type: 'TEXT' , contain: "If test success, players can save it. "}
];

var customInfo = [
	{type: 'TITLE', contain: "Custom Levels"},
	{type: 'TEXT' , contain: "Players can create new levels or edit exists levels."}
];

var demoHelp = [
	{type: 'TITLE', contain: " Demo Mode "},
	{type: 'TEXT' , contain: "     Demo data collected from players," },
	{type: 'TEXT' , contain: " Only demo the fastest passed levels or" },
	{type: 'TEXT' , contain: "Recently passed levels of current player." }
];

function createDemoInfo()
{
	var titleName = playDataToTitleName(playData);
	var player = playerDemoData[curLevel-1].player;
	
	if(player == "") player = "Unknown";
	
	var demoInfo = [
		{type: 'TITLE', contain: "    " + playDataToTitleName(playData)+ "    " },
		{type: 'TEXT' , contain: "Demo level : " + curLevel},
		{type: 'TEXT' , contain: "Player : " + player },
		{type: 'TEXT_flagID_MSG' , text: "Location :  ",  
		                           flagId: playerDemoData[curLevel-1].cId.toLowerCase(),
		                           msg: " " + playerDemoData[curLevel-1].location
		},
		{type: 'TEXT' , contain: "Date : " + playerDemoData[curLevel-1].date+ " (" + playerDemoData[curLevel-1].ai+")" }
	];
	
	return demoInfo;
}

function infoMenu(callbackFun, args)
{
	var infoMsg = null;
	
	switch(playMode) {
	case PLAY_CLASSIC:
	case PLAY_MODERN:
		if(playData == PLAY_DATA_USERDEF) {
			infoMsg = customInfo;
		} else {
			infoMsg = getPlayVerInfo(playData);	
		}
		break;	
	case PLAY_DEMO:
	case PLAY_DEMO_ONCE:
		infoMsg = createDemoInfo();	
		break;
	case PLAY_EDIT:
		infoMsg = editInfo;
		break;
	case PLAY_TEST:
		infoMsg = testInfo;
		break;
	}
	 
	if(infoMsg) infoObj.showInfo(infoMsg, callbackFun, args);
	else {
		if(callbackFun) callbackFun(args);
		error(arguments.callee.name, "Error:  playMode = " + playMode);
	}
}

function infoMenuClass(_stage, _scale)
{
	var coverBackground, closeIcon;
	var infoBorder, infoBackground;
	var infoObj = [];
	
	var INFO_BORDER_SIZE  = 24 * _scale;	
	var INFO_BORDER_HALF  = INFO_BORDER_SIZE / 2;
		
	var TITLE_TEXT_SIZE = 40 * _scale;
	var TITLE_TEXT_COLOR = "white";
	var TITLE_TEXT_SHADOW_COLOR = "#FF0";

	var ITEM_TEXT_SIZE = 32 * _scale;
	var ITEM_TEXT_COLOR = "yellow";
	
	var FLAG_SCALE = _scale * 5/4;
	var FLAG_MSG_SIZE = 28 * _scale;
	var FLAG_MSG_COLOR = "white";
	
	var TOP_BORDER_SIZE = TITLE_TEXT_SIZE/2 | 0;
	var BOTTOM_BORDER_SIZE = ITEM_TEXT_SIZE/ 2 | 0;
	var BORDER_WIDTH =  ITEM_TEXT_SIZE;
	
	var CLOSE_BOX_SIZE = 12 * _scale + 2;
	
	var menuX, menuY, startX, startY;
	
	var callBackFun, callBackArgs;
	var saveStateObj;


	this.showInfo = function(info, callback, args)
	{
		if(typeof args == "undefined") args = null;
		callBackFun = callback;
		callBackArgs = args;
		closeIcon = null;
		
		initInfo(info);
		drawBackground();
		drawInfoBackground();
		drawInfo();
		drawCloseIcon(0);
		_stage.update();
		
		saveStateObj = saveKeyHandler(InfoKeyDown);
	}	
	
	function initInfo(infoList)
	{
		var textLength;
		var maxTextWidth =0;
		
		infoObj = [];
		menuX = menuY = 0;
		for(var i = 0; i < infoList.length; i++) {
			
			switch(	infoList[i].type) {
			case 'TITLE':
				infoObj[i] = {};	
				infoObj[i].type = 'TITLE';	
				infoObj[i].text = new createjs.Text(infoList[i].contain, 
				                      "bold " + TITLE_TEXT_SIZE + "px Helvetica",TITLE_TEXT_COLOR);
				infoObj[i].text.shadow = new createjs.Shadow(TITLE_TEXT_SHADOW_COLOR, 1, 1, 1 );
				infoObj[i].width = infoObj[i].text.getBounds().width;
				infoObj[i].height = infoObj[i].text.getBounds().height;
				menuY += (infoObj[i].height * 3/2|0);	
				break;
			case 'TEXT':
				infoObj[i] = {};	
				infoObj[i].type = 'TEXT';	
				infoObj[i].text = new createjs.Text(infoList[i].contain, 
				                      "bold " + ITEM_TEXT_SIZE + "px Helvetica",ITEM_TEXT_COLOR);
				infoObj[i].width = infoObj[i].text.getBounds().width;
				infoObj[i].height = infoObj[i].text.getBounds().height;
				menuY += (infoObj[i].height * 3/2|0);	
				break;	
			case 'TEXT_flagID_MSG':
				infoObj[i] = {};	
				infoObj[i].type = 'TEXT_flagID_MSG';	
					
				infoObj[i].text = new createjs.Text(infoList[i].text, 
				                      "bold " + ITEM_TEXT_SIZE + "px Helvetica", ITEM_TEXT_COLOR);
				infoObj[i].textWidth = infoObj[i].text.getBounds().width;
				infoObj[i].textHeight = infoObj[i].text.getBounds().height;
					
				if(infoList[i].flagId in countryId) {
					infoObj[i].flag = new createjs.Sprite(countryFlagData, infoList[i].flagId);		
				} else {
					infoObj[i].flag = new createjs.Sprite(countryFlagData, "unknown");		
				}
				infoObj[i].flag.setTransform(0, 0, FLAG_SCALE, FLAG_SCALE);	
				infoObj[i].flagWidth = infoObj[i].flag.getTransformedBounds().width;
				infoObj[i].flagHeight = infoObj[i].flag.getTransformedBounds().height;
					
				infoObj[i].msg = new createjs.Text(infoList[i].msg, 
				                      "bold " + FLAG_MSG_SIZE + "px Helvetica", FLAG_MSG_COLOR);
				infoObj[i].msg.set({alpha:0});	
				infoObj[i].msgWidth = infoObj[i].msg.getBounds().width;
				infoObj[i].msgHeight = infoObj[i].msg.getBounds().height;
					
				infoObj[i].flag.msgObj = infoObj[i].msg;	
				infoObj[i].flag.on('mouseover',function(evt) {
					this.msgObj.set({alpha:1});	
					_stage.update();
				});
				infoObj[i].flag.on('mouseout', function(evt){
					this.msgObj.set({alpha:0});	
					_stage.update();
				});
					
				infoObj[i].width = infoObj[i].textWidth + infoObj[i].flagWidth + infoObj[i].msgWidth;
				menuY += (infoObj[i].textHeight * 3/2|0);	
				break;	
			case 'TEXT_LINK':		
				infoObj[i] = {};	
				infoObj[i].type = 'TEXT_LINK';	
					
				infoObj[i].text = new createjs.Text(infoList[i].text, 
				                      "bold " + ITEM_TEXT_SIZE + "px Helvetica", ITEM_TEXT_COLOR);
				infoObj[i].textWidth = infoObj[i].text.getBounds().width;
				infoObj[i].textHeight = infoObj[i].text.getBounds().height;
					
				infoObj[i].textLink = new createjs.Text(infoList[i].textLink, 
				                      "bold " + ITEM_TEXT_SIZE + "px Helvetica", ITEM_TEXT_COLOR);
				infoObj[i].texLinktWidth = infoObj[i].textLink.getBounds().width;
				infoObj[i].texLinktHeight = infoObj[i].textLink.getBounds().height;

				infoObj[i].textLink.url = infoList[i].url;	
				infoObj[i].textLink.on('mouseover',function(evt) {
					_stage.cursor = "pointer";
					_stage.update();
				});
				infoObj[i].textLink.on('mouseout', function(evt){
					_stage.cursor = "default";
					_stage.update();
				});
				infoObj[i].textLink.on('click', function(evt){
					window.open(this.url).focus();
					_stage.cursor = "default";
					_stage.update();
				});
					
				infoObj[i].width = infoObj[i].textWidth + infoObj[i].texLinktWidth;
				menuY += (infoObj[i].textHeight * 3/2|0);	
				break;	
			default:
				error(arguments.callee.name, "Error: type don't support, type = " + infoList[i].type);
					continue;	
			}
			if(maxTextWidth < infoObj[i].width) maxTextWidth = infoObj[i].width;
		}
		menuX = maxTextWidth + BORDER_WIDTH * 2;
		menuY += (TOP_BORDER_SIZE + BOTTOM_BORDER_SIZE);
		
		startX = (_stage.canvas.width-menuX)/2|0;
		startY = (_stage.canvas.height-menuY)/2|0;
		if(startX < 0) startX = 0; 
		if(startY < 0) startY = 0;
	}
	
	function drawBackground()
	{
		coverBackground = new createjs.Shape();
		coverBackground.graphics.beginFill("black").drawRect(0, 0, _stage.canvas.width, _stage.canvas.height).endFill();
		coverBackground.alpha = 0.3;
		_stage.addChild(coverBackground);		
	}	
	
	function removeBackground()
	{
		_stage.removeChild(coverBackground);
	}		
	
	function drawInfoBackground()
	{
	
		infoBorder = new createjs.Shape();
		infoBackground = new createjs.Shape();
	
		infoBorder.alpha = 0.8;
		infoBorder.graphics.beginFill("#FF0")
			.drawRoundRect(startX-INFO_BORDER_HALF, startY-INFO_BORDER_HALF, menuX+INFO_BORDER_SIZE, menuY+INFO_BORDER_SIZE, INFO_BORDER_HALF).endFill();
		
		infoBackground.alpha = 0.6;
		infoBackground.graphics.beginFill("#190218")
			 .drawRoundRect(startX, startY, menuX, menuY, INFO_BORDER_HALF/2).endFill();
	
		_stage.addChild(infoBorder);
		_stage.addChild(infoBackground);
	}	
	
	function removeInfoBackground()
	{
		_stage.removeChild(infoBackground);
		_stage.removeChild(infoBorder);
	}
	
	function drawInfo()
	{
		var tmpY = startY;
		for(var i = 0; i < infoObj.length; i++) {
			switch(	infoObj[i].type) {
			case 'TITLE':
				tmpY += (infoObj[i].height/2|0);
				infoObj[i].text.x = startX + (menuX - infoObj[i].width)/2|0;	
				infoObj[i].text.y = tmpY;	
				tmpY += infoObj[i].height *3/2|0;
				_stage.addChild(infoObj[i].text);
				break;
			case 'TEXT':
				infoObj[i].text.x = startX + BORDER_WIDTH;
				infoObj[i].text.y = tmpY;	
				tmpY += infoObj[i].height *3/2|0;	
				_stage.addChild(infoObj[i].text);
				break;	
			case 'TEXT_flagID_MSG':
				infoObj[i].text.x = startX + BORDER_WIDTH;
				infoObj[i].text.y = tmpY;
					
				infoObj[i].flag.x = startX + BORDER_WIDTH + infoObj[i].textWidth;
				infoObj[i].flag.y = tmpY+ (infoObj[i].textHeight - infoObj[i].flagHeight)/3;
					
				infoObj[i].msg.x = startX + BORDER_WIDTH + infoObj[i].textWidth + infoObj[i].flagWidth;
				infoObj[i].msg.y = tmpY+ (infoObj[i].textHeight - infoObj[i].msgHeight);
					
				tmpY += infoObj[i].textHeight *3/2|0;	
				_stage.addChild(infoObj[i].text);
				_stage.addChild(infoObj[i].flag);
				_stage.addChild(infoObj[i].msg);
				break;	
			case 'TEXT_LINK':
				infoObj[i].text.x = startX + BORDER_WIDTH; 	
				infoObj[i].text.y = tmpY;
				
				infoObj[i].textLink.x = startX + BORDER_WIDTH + infoObj[i].textWidth; 	
				infoObj[i].textLink.y = tmpY;
				tmpY += infoObj[i].textHeight *3/2|0;	
				_stage.addChild(infoObj[i].text);
				_stage.addChild(infoObj[i].textLink);
				break;	
			default:
				error(arguments.callee.name, "Error: type don't support, type = " + infoObj[i].type);
				continue;	
			}
		}
	}

	function removeInfo()
	{
		for(var i = 0; i < infoObj.length; i++) {
			switch(infoObj[i].type) {
			case 'TITLE':
			case 'TEXT':
				_stage.removeChild(infoObj[i].text);
				break;
			case 'TEXT_flagID_MSG':
				_stage.removeChild(infoObj[i].text);
				_stage.removeChild(infoObj[i].flag);
				break;
			case 'TEXT_LINK':
				_stage.removeChild(infoObj[i].text);
				_stage.removeChild(infoObj[i].textLink);
				break;
			default:
				error(arguments.callee.name, "Error: type don't support, type = " + infoObj[i].type);
				continue;	
			}
		}
		
	}
	
	function InfoKeyDown(event)
	{
		if(!event){ event = window.event; } //cross browser issues exist
		if(event.keyCode == KEYCODE_ESC) {
			closeInfoMenu();
		}
		return false;
	}		
	
	function drawCloseIcon(mouseOver)
	{
		var cycle, cross;
		var alpha, cycColor, crosColor;
		if(closeIcon == null) {
			closeIcon = new createjs.Container();
			cross = new createjs.Shape();
			cycle = new createjs.Shape();
			closeIcon.addChild(cycle, cross);
			closeIcon.on("mouseover", handleMouseOver);
			closeIcon.on("mouseout", handleMouseOut);
			closeIcon.on("click", closeInfoMenu);
			closeIcon.x = startX+menuX - CLOSE_BOX_SIZE*3;
			closeIcon.y = startY + CLOSE_BOX_SIZE*2;
			_stage.enableMouseOver(30);
			_stage.addChild(closeIcon);
		} else {
			cycle = closeIcon.getChildAt(0);
			cross = closeIcon.getChildAt(1);
		}
		if(mouseOver) {
			alpha = 0.6;
			cycColor = "red";
			crosColor = "white";	
		} else {
			alpha = 0.01;
			cycColor = "gold";
			crosColor = "white";
		}
		
		var g = cycle.graphics; 
		g.clear();
		cycle.alpha = alpha;	
		g.beginFill(cycColor).dc(CLOSE_BOX_SIZE/2, CLOSE_BOX_SIZE/2, CLOSE_BOX_SIZE*5/4);
		
		g = cross.graphics;
		g.clear();
		//cross.alpha = 1;
	    g.setStrokeStyle(CLOSE_BOX_SIZE/4).beginStroke(crosColor).moveTo(0,0)
		 .lineTo(CLOSE_BOX_SIZE,CLOSE_BOX_SIZE).closePath();
		
		g.moveTo(CLOSE_BOX_SIZE,0).lineTo(0,CLOSE_BOX_SIZE).closePath();
		
		_stage.update();	
	}
	
	function removeCloseIcon()
	{
		_stage.removeChild(closeIcon);
	}
	
	function handleMouseOver(event) 
	{
		_stage.cursor = 'pointer'; 
		drawCloseIcon(1);
	}

	function handleMouseOut(event) 
	{
		_stage.cursor = 'default'; 
		drawCloseIcon(0);
	}
	
	function closeInfoMenu() 
	{
		removeCloseIcon();
		removeInfo();
		removeInfoBackground();
		removeBackground();
		_stage.cursor = 'default'; 
		_stage.update();
		_stage.enableMouseOver(0);
		restoreKeyHandler(saveStateObj);

		//add setTimeout just don't cause mouse event (click) cascade!
		if(callBackFun) setTimeout(function() { callBackFun(callBackArgs);}, 10); 
	}	
}