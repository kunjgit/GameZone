function colorSelectorClass(_screenX1, _screenY1, baseX)
{
	var radius = baseX*3/4|0;
	var px = (baseX *7/5)|0;
	var py = (baseX *7/5)|0;
	var left = screenBorder;
	var top =  baseX/4|0;
	
	var colorCanvas, colorStage;
	var colorSelector;
	var colorShape=[]; 
	var activeCircle;
	
	var smallScale = 0.4;
	var colorSelectorIsSmall = 0;
	
	var outFocusTimer = null;
	var colorStageTicker = null;
	
	var self = this;
	var enabled = 0;
	
	var bgColor= backgroundColor;
	
	init();
	
	function init()
	{
		createColorCanvas();
		createColorSelector();
	}

	this.enable = function ()
	{
		if(enabled) return;

		enabled = 1;
		colorSelector.set({alpha:1});
		colorStage.enableMouseOver(30);
		colorStage.update();
	}
	
	this.disable = function (hidden)
	{
		enabled = 0;
		if(hidden) {
			colorSelector.set({alpha:0});
		} else {
			colorSelector.set({alpha:1})
		}
		colorStage.enableMouseOver(0);
		colorStage.update();
	}
	
	this.themeChange = function()
	{
		for(var i=0; i < maxThemeColor;i++) {
			setColorShape(colorShape[i], i, pinker(getThemeTileColor(i)) );
		}
		setActiveCircle();
		colorStage.update();
	}
	
	this.activeColorChange = function()
	{
		setActiveCircle();
		colorStage.update();
	}

	function createColorCanvas()
	{
		colorCanvas = document.createElement('canvas');
		colorCanvas.id = "theme_color_selector";
		colorCanvas.width  = px * 2;
		colorCanvas.height = py * 2;
		colorCanvas.style.left = left + "px";
		colorCanvas.style.top =  top + "px";
		colorCanvas.style.position = "absolute";
		document.body.appendChild(colorCanvas);
	}	
	
	function createColorSelector()
	{
		var bgCircle = new createjs.Shape();
		colorStage = new createjs.Stage(colorCanvas);
		colorSelector = new createjs.Container();

		bgCircle.graphics.beginFill(bgColor).drawCircle(px,py, radius*5/3|0);
		colorSelector.addChild(bgCircle);
		//colorSelector.regY =radius*5/3*2;
		//colorSelector.y = radius*5/3*2;
		
		addColorShape();
		setColorSelectorMouseEvent();
		colorSelectorTransform(1);
		
		addActiveCircle();
		setActiveCircleMouseEvent();

		colorSelector.set({alpha:0}); //disabled
		colorStage.addChild(colorSelector);
		colorStage.update();
	}
	
//= 2 =========================
	
	function addColorShape()
	{
		for(var i=0; i < maxThemeColor;i++) createColorShape(i);
		for(var i=0; i < maxThemeColor;i++)	createBGBar(i);
		
		function createColorShape(id)
		{
			var color = pinker( getThemeTileColor(i));
			colorShape[id] = new createjs.Shape();
			setColorShape(colorShape[id], id, color);
			setColorShapeMouseEvent(colorShape[id], id)
			colorSelector.addChild(colorShape[id]);
		}	
		
		function createBGBar(id)
		{
			var s = Math.PI*2/5 + (2*Math.PI) * id/5;
			var bar = new createjs.Shape();

			bar.graphics.setStrokeStyle(baseX/6|0)
			.beginStroke(bgColor).moveTo(px, py)
			.lineTo(px+ Math.sin(s)*radius*3/2, py+Math.cos(s)*radius*3/2)
			.endStroke();
			colorSelector.addChild(bar);
		}
	}

	function setColorSelectorMouseEvent()
	{
		colorSelector.on("mouseover", mouseOver);
		colorSelector.on("mouseout", mouseOut);
		colorSelector.on("click", mouseClick);

		function mouseOver()
		{
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) {
				colorSelector.cursor = "default";
				return;
			}
			if(colorSelectorIsSmall) {
				colorSelector.cursor = "pointer";
				return;
			}
			setTransformTimeout(0); //clear timeout
		}
		
		function mouseOut()
		{
			if(colorSelectorIsSmall) return;
			setTransformTimeout(1); //set timeout
		}
		
		function mouseClick()
		{
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(!colorSelectorIsSmall) return;
			colorSelectorTransform(0);
		}
	}
	
	function addActiveCircle()
	{
		activeCircle = new createjs.Shape();
		colorSelector.addChild(activeCircle);
		setActiveCircle();
	}
	
	function setActiveCircleMouseEvent()
	{
		activeCircle.on("mouseover", function(){
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(colorSelectorIsSmall) return; 
			colorSelector.cursor = "pointer";
		});
		activeCircle.on("mouseout", function(){
			if(colorSelectorIsSmall) return; 
			colorSelector.cursor = "default";
		});
		activeCircle.on("click",function() {
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(colorSelectorIsSmall) return;
			setTransformTimeout(0); //clear timeout
			colorSelectorTransform(0); //transform to small
		});
	}
	
	function colorSelectorTransform(immediate)
	{
		if(colorSelectorIsSmall) {
			colorCanvas.width = px * 2; 
			colorCanvas.height = py * 2; 
			if(immediate) {
				colorSelector.scaleX = colorSelector.scaleY = 1;
				colorSelectorIsSmall = 0;
				colorSelector.cursor = "default";
			} else {
				createjs.Tween.get(colorSelector)
				.to({scaleX: 1, scaleY: 1}, 100)
				.call(function(){
					colorSelectorIsSmall = 0; 
					setActiveCircle();
					colorSelector.cursor = "default";
					createjs.Ticker.off("tick", colorStageTicker);
					colorStageTicker = null;
					colorStage.update();
				});
				colorStageTicker = createjs.Ticker.on("tick", colorStage);
			}
			
		} else {
			if(immediate) {
				colorSelector.scaleX = colorSelector.scaleY = smallScale;
				colorSelectorIsSmall = 1;
				colorSelector.cursor = "pointer";
				
				colorCanvas.width = px * 2 * smallScale; 
				colorCanvas.height = py * 2 * smallScale; 
			} else {
				createjs.Tween.get(colorSelector)
				.to({scaleX: smallScale, scaleY: smallScale}, 100)
				.call(function(){
					colorCanvas.width = px * 2 * smallScale; 
					colorCanvas.height = py * 2 * smallScale; 
					
					colorSelectorIsSmall = 1; 
					//setActiveCircle();
					//self.themeChange();
					colorSelector.cursor = "pointer";
					createjs.Ticker.off("tick", colorStageTicker);
					colorStageTicker = null;
					colorStage.update();
				});
				colorStageTicker = createjs.Ticker.on("tick", colorStage);
			}
		}
	}	
	
//= 3 ===========================	
	
	function pinker(hexColor)
	{
		var orgRGB = hexToRGB(hexColor);
		var percent = 1/2, whitePercent = 1-percent;
		for(var i=0; i < 3; i++) {
			orgRGB[i] = (orgRGB[i]*percent+255*whitePercent)|0;
			if(orgRGB[i]>255) orgRGB[i]=255;
		}
		return rgbToHex(orgRGB)
	}
	
	function setColorShape(shape, id, color)
	{
		var s = (2*Math.PI) * id/5-(Math.PI)*7/10+(Math.PI)/40;
		var e = (2*Math.PI) * (id+1)/5-(Math.PI)*7/10-(Math.PI)/40;
		
		shape.graphics.clear().setStrokeStyle(radius-2)
		.beginStroke(color).arc(px, py, radius, s, e).endStroke();
	}

	function setColorShapeMouseEvent(shape, id)
	{
		shape.on("mouseover", mouseOver, null, false, {id:id});
		shape.on("mouseout", mouseOut, null, false, {id:id});
		shape.on("click", mouseClick, null, false, {id:id});
		
		function mouseOver(evt, data)
		{
			var id = data.id;
			var curColorId = getCurColorId();
			
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(colorSelectorIsSmall) return;
			
			colorSelector.cursor = "pointer";
			setColorShape(colorShape[id], id, getThemeTileColor(id));
			colorStage.update();
		}
		
		function mouseOut(evt, data)
		{
			var id = data.id;
			var curColorId = getCurColorId();
			
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(colorSelectorIsSmall) return;
			
			colorSelector.cursor = "default";
			setColorShape(colorShape[id], id,  pinker(getThemeTileColor(id)));
			colorStage.update();
		}
		
		function mouseClick(evt, data)
		{
			var id = data.id;
			var curColorId = getCurColorId();
			
			if(gameState == GAME_PAUSE || (gameState == GAME_WAITING && playMode != PLAY_EDIT)) return;
			if(colorSelectorIsSmall || curColorId == id) return;
			
			themeColorChange(id);
			setActiveCircle();
			colorStage.update();
		}
	}	
	
	function setTransformTimeout(enable)
	{
		//clear timeout
		if(outFocusTimer) {
			clearTimeout(outFocusTimer);
			outFocusTimer = null;
		}
		
		//set timeout
		if(enable) {
			outFocusTimer = setTimeout(function(){ colorSelectorTransform(0); }, 1000);
		}
	}	
	
	function setActiveCircle()
	{
		var color = getThemeTileColor(getCurColorId());
		
		activeCircle.graphics.clear().beginFill(color).drawCircle(px,py, radius*3/8|0);
		//activeCircle.alpha = colorSelectorIsSmall?0:1;
	}	
}