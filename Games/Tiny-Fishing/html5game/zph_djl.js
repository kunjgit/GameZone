// (key:string, defValue, ...rest)
function dj_loading_value(key, defValue) {
	var f = window.gml_Script_gmcallback_dj_loading, v = null;
	if (f) {
		var p = Array.prototype.slice.call(arguments, 2);
		p.unshift(key);
		p.unshift(null);
		p.unshift(null);
		v = f.apply(this, p);
	}
	return v != null ? v : defValue;
}
function dj_loading_color(key, defValue) {
	var v = dj_loading_value.apply(this, arguments);
	if (typeof v == "number") {
		v = ((v >> 16) & 0xff) | (v & 0xff00) | ((v & 0xff) << 16); // BGR -> RGB
		v = v.toString(16);
		while (v.length < 6) v = "0" + v;
		v = "#" + v;
	}
	return v;
}
function dj_loading_number(key, defValue) {
	var v = dj_loading_value.apply(this, arguments);
	if (typeof v != "number") v = defValue;
	return v;
}
function dj_loading_string(key, defValue) {
	var v = dj_loading_value.apply(this, arguments);
	if (typeof v != "string") v = defValue;
	return v;
}


var dj_loading_logo = new Image();
dj_loading_logo.src = "html5game/" + dj_loading_string("logo_path", "load.png");


var dj_loading_current = 0;
///
function dj_loading_get_current() { return dj_loading_current; }
/// dj_loading_current = dj_loading_get_current():


var dj_loading_total = 0;
///
function dj_loading_get_total() { return dj_loading_total; }
/// dj_loading_total = dj_loading_get_total():


var dj_loading_width = 0;
///
function dj_loading_get_width() { return dj_loading_width; }
/// dj_loading_width = dj_loading_get_width():


var dj_loading_height = 0;
///
function dj_loading_get_height() { return dj_loading_height; }
/// dj_loading_height = dj_loading_get_height():

///

var showBH5Icon = false;
var loadingBg = document.getElementById('img_loadingbg');
var loadingIcon = document.getElementById('img_loadingicon');
var loadingLogoIcon = document.getElementById('img_loadinglogoicon');
var loadingBar = document.getElementById('img_loadingbar');
var loadingBarOverlay = document.getElementById('img_loadingbaroverlay');

if (showBH5Icon == false)
{
      loadingLogoIcon.style.display        ="none";
      loadingLogoIcon.style.visibility     ="hidden";
      loadingLogoIcon.style.pointerEvents  = 'none';
      loadingLogoIcon.parentNode.removeChild(loadingLogoIcon);
      loadingLogoIcon = null;
}
function dj_loading(ctx, width, height, total, current, _) 
{
	//
	var node = ctx.canvas;
	// Force fullscreen mode:
	width = window.innerWidth;
	if (node.width != width) node.width = width;
	height = window.innerHeight;
	if (node.height != height) node.height = height;
	
	// bg update
	if (loadingBg)
	{
	    loadingBg.style.width = width +"px";
	    loadingBg.style.height = height +"px";
	    loadingBg.style.left = -width*0 + "px";
	    loadingBg.style.top  = -height*0 + "px";
	}

	// icon update
	var size = height * 0.3;
	if (width > height) size = height * 0.3; 

	if (loadingIcon)
	{
	    loadingIcon.style.width = size +"px";
	    loadingIcon.style.height = size +"px";
	    loadingIcon.style.left = (width-size)*0.5 + "px";
	    loadingIcon.style.top  = height*0.4-size*0.5 + "px";
	}

    // bar
	var barWidth = 200;//width * 0.5;
	var barHeight = 10;//height * 0.01;
	var barDistFromTop = 0.6;

	if (loadingBar)
	{
	    loadingBar.style.width = barWidth +"px";
	    loadingBar.style.height = barHeight +"px";
	    loadingBar.style.left = (width-barWidth)*0.5 + "px";
	    loadingBar.style.top  = height*barDistFromTop-barHeight*0.5 + "px";
	}

    // bar overlay
	var barCurrent = Math.round(current / total * barWidth);

	if (loadingBarOverlay)
	{
	    loadingBarOverlay.style.width = barCurrent +"px";
	    loadingBarOverlay.style.height = barHeight +"px";
	    loadingBarOverlay.style.left = (width-barWidth)*0.5 + "px";
	    loadingBarOverlay.style.top  = height*barDistFromTop-barHeight*0.5 + "px";
	}


	// logo icon update
	var size = height * 0.13;
	//if (width > height) size = height * 0.3; 

	if (loadingLogoIcon)
	{
	    loadingLogoIcon.style.width = size +"px";
	    loadingLogoIcon.style.height = size +"px";
	    loadingLogoIcon.style.left = (width-size)*0.5 + "px";
	    loadingLogoIcon.style.top  = (height-size - 50) + "px";
	}
	
	//
	dj_loading_value("draw_post");
}



function dg_hide_loading()
{
	if (loadingBg)
	{
      loadingBg.style.display        ="none";
      loadingBg.style.visibility     ="hidden";
      loadingBg.style.pointerEvents  = 'none';
      loadingBg.parentNode.removeChild(loadingBg);
      loadingBg = null;
	}

    if (loadingIcon)
    {
      loadingIcon.style.display        ="none";
      loadingIcon.style.visibility     ="hidden";
      loadingIcon.style.pointerEvents  = 'none';
      loadingIcon.parentNode.removeChild(loadingIcon);
      loadingIcon = null;
    }
    if (loadingBar)
    {
      loadingBar.style.display        ="none";
      loadingBar.style.visibility     ="hidden";
      loadingBar.style.pointerEvents  = 'none';
      loadingBar.parentNode.removeChild(loadingBar);
      loadingBar = null;
    }
    if (loadingLogoIcon)
    {
      loadingLogoIcon.style.display        ="none";
      loadingLogoIcon.style.visibility     ="hidden";
      loadingLogoIcon.style.pointerEvents  = 'none';
      loadingLogoIcon.parentNode.removeChild(loadingLogoIcon);
      loadingLogoIcon = null;
    }
    if (loadingBarOverlay)
    {
      loadingBarOverlay.style.display        ="none";
      loadingBarOverlay.style.visibility     ="hidden";
      loadingBarOverlay.style.pointerEvents  = 'none';
      loadingBarOverlay.parentNode.removeChild(loadingBarOverlay);
      loadingBarOverlay = null;
    }


}