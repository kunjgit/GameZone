
var baseBitmapName = [
	"empty", "brick", "solid", "ladder", "rope",
	"trapBrick", "hladder", "gold", "redhat", "guard1", "runner1",
	"runner", "guard", "hole", "ground", "over", "text"
];


var themeColor = {};
themeColor[THEME_APPLE2] = [
	null,      //original image color
	"#60C0A0",
	"#DD8D5D",
	"#C080F0",
	"#FF83BB",
];

themeColor[THEME_C64] = [
	null,     //original image color
	"#DF5050",
	"#F7993E",
	"#4A4AFF",
	"#2E8B57"
];

var maxThemeColor = themeColor[THEME_APPLE2].length;
var themeBaseBitmap = {};
var curColorId = {};
var orgImageColor = {};
var themeNameList = [THEME_APPLE2, THEME_C64];

function createBaseBitmapInstance()
{
	for(var i = 0; i < themeNameList.length; i++) {
		var themeName = themeNameList[i];
		var id = curColorId[themeName];
		orgImageColor[themeName] = getOrgImageColor(themeName);
		createThemeBaseBitmap(themeName, hexToRGB(themeColor[themeName][id]), id);
	}
	
	//for edit mode only 
	themeBaseBitmap["eraser"] = createBitmap("eraser", null, null);
}

function createThemeBaseBitmap(themeName, newColor, id)
{
	var oldColor = orgImageColor[themeName]; //get original image color

	for(var i=0; i < baseBitmapName.length; i++){
		var imageName = baseBitmapName[i]+themeName;
		if( (imageName+id) in themeBaseBitmap) 
			return;
		themeBaseBitmap[imageName+id] = createBitmap(imageName, oldColor, newColor);
	}
}

function getThemeBitmap(name)
{
	if(name == "eraser") return themeBaseBitmap[name].clone(); //for edit mode only
	
	return themeBaseBitmap[name+ curTheme+curColorId[curTheme]].clone();
}

function getThemeImage(name) 
{
	return preload.getResult(name);
}

function getThemeTileColor(id)
{
	var curId = (typeof id != 'undefined')?id:curColorId[curTheme];
	
	if(curId == 0) return rgbToHex(orgImageColor[curTheme]); //original color	
	
	return themeColor[curTheme][curId];
}

function getCurColorId()
{
	return curColorId[curTheme];
}

function getOrgImageColor(themeName)
{
	var canvas = document.createElement('canvas');
	var ctx=canvas.getContext("2d");
	var stage = new createjs.Stage(canvas);
	var bitmap = new createjs.Bitmap(getThemeImage("solid"+themeName)); //"solid" as sample image
	var imgData, orgColor;
	
	canvas.width  = bitmap.getBounds().width;
	canvas.height = bitmap.getBounds().height;
	stage.addChild(bitmap);	
	stage.update();
	stage.cache(0, 0, canvas.width, canvas.height);

	imgData=ctx.getImageData(0, 0, canvas.width, canvas.height);
	orgColor = [imgData.data[0], imgData.data[1], imgData.data[2] ];
	stage.uncache();
	stage.removeAllChildren();
	stage.update();
	
	return orgColor;
}

function createBitmap(imageName, oldColor, newColor)
{
	var bitmap = new createjs.Bitmap(getThemeImage(imageName));
	var newBitmap;
	
	if(newColor != null && (newBitmap = changeBitmapColor(bitmap, oldColor, newColor)) != null)
		return newBitmap; //color changed
	else 
		return bitmap;
}

function changeBitmapColor(bitmap, oldColor, newColor)
{
	var canvas = document.createElement('canvas');
	var stage = new createjs.Stage(canvas);
	var changed;
	
	canvas.width  = bitmap.getBounds().width;
	canvas.height = bitmap.getBounds().height;
	stage.addChild(bitmap);	
	stage.update();
	stage.cache(0, 0, canvas.width, canvas.height);

	changed = changeColor(canvas, oldColor, newColor);
	stage.uncache();
	stage.removeAllChildren();
	
	if(changed) return (new createjs.Bitmap(stage.canvas));
	else return null;
}

function changeColor(canvas, oldColor, newColor)
{
	var ctx=canvas.getContext("2d");
	var imgData=ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imgData.data;
	var bitChanged = 0;
	
	for (var i = 0; i < data.length; i += 4) {
		var red   = data[i + 0];
		var green = data[i + 1];
		var blue  = data[i + 2];
		var alpha = data[i + 3];
		if(oldColor[0] == red && oldColor[1] == green && oldColor[2] == blue) {
			data[i+0] = newColor[0];
			data[i+1] = newColor[1];
			data[i+2] = newColor[2];
			bitChanged = 1;
		}
	}
	ctx.putImageData(imgData, 0, 0);
	return bitChanged;
}

function themeColorChange(id)
{
	var newColor;

	if(curColorId[curTheme] == id) return; //don't need change 
	
	newColor = hexToRGB(themeColor[curTheme][id]);
	curColorId[curTheme] = id;
	createThemeBaseBitmap(curTheme, newColor, id)
	themeDataReset(0); //don't need reset sound instance
	
	setThemeColor();
	themeColorObj.activeColorChange();
	
	if(playMode == PLAY_EDIT) {
		if(editLevelModified()) saveTestState();
		stopEditTicker();
		startEditMode();		
	} else {
		changeThemeScreen(); //real time change theme screen
	}
}

function hexToRGB(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [ 
		parseInt(result[1], 16), 
		parseInt(result[2], 16), 
		parseInt(result[3], 16)
	] : null;
}

function rgbToHex(rgb)
{
	return "#" + 
		("00" + rgb[0].toString(16)).slice(-2)+
		("00" + rgb[1].toString(16)).slice(-2)+
		("00" + rgb[2].toString(16)).slice(-2);
}
