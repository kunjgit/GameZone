//////////////////// Functionality ////////////////////
var appFocused = true;


// scaling for mobiles
function js_scale_canvas(baseWidth, baseHeight, targetWidth, targetHeight) {
    var aspect = (baseWidth / baseHeight);
 
    // Calculate pixel ratio and new canvas size
    var pixelRatio = window.devicePixelRatio || 1;
    var backStoreRatio = (g_CurrentGraphics.webkitBackingStorePixelRatio || g_CurrentGraphics.mozBackingStorePixelRatio || g_CurrentGraphics.msBackingStorePixelRatio ||
                          g_CurrentGraphics.oBackingStorePixelRatio || g_CurrentGraphics.backingStorePixelRatio || 1);
    var pixelScale = pixelRatio / backStoreRatio;
 
    var scaledWidth = targetWidth * pixelScale;
    var scaledHeight = targetHeight * pixelScale;
 
    var posx = 0;
    var posy = 0;
    if ((scaledWidth / aspect) > scaledHeight) {
        var sW = scaledWidth;
        scaledWidth = scaledHeight * aspect;
        posx = Math.round(((sW - scaledWidth) / pixelScale) / 2);
        scaledWidth = Math.round(scaledWidth);
    } else {
        var sH = scaledHeight;
        scaledHeight = scaledWidth / aspect;
        posy = Math.round(((sH - scaledHeight) / pixelScale) / 2);
        scaledHeight = Math.round(scaledHeight);
    }
 
    // Update canvas size
    var ret = '{"w":'+scaledWidth+',"h":'+scaledHeight+',"x":'+posx+',"y":'+posy+'}';
    eval("gml_Script_gmcallback_window_set_size(null,null,'"+ret+"')");
 
    // Scale back canvas with CSS
    if(pixelScale != 1) {
        canvas.style.width = (scaledWidth / pixelScale) + "px";
        canvas.style.height = (scaledHeight / pixelScale) + "px";
    } else {
        canvas.style.width = "";
        canvas.style.height = "";
    }
 
    // Update canvas scale
    if(typeof g_CurrentGraphics.scale === "function")
        g_CurrentGraphics.scale(pixelScale, pixelScale);
}


function js_resize_canvas(width,height) {
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;
  
    js_scale_canvas(width, height, displayWidth, displayHeight+1);
}







function js_init(appBlurGmCallback)
{
  window.onfocus = function()
  {
    appFocused = true;
  }

  window.onblur = function()
  {
    appFocused = false;
    //eval("gml_Script_"+appBlurGmCallback+"(null,null)");
  }
}

function js_browserLanguage()
{
  var lang = navigator.language;

  lang = lang.substr(0, 2);

  return lang.toUpperCase();
}


function js_trace(text)
{
  console.log(text);
}

// SITELOCKS

function js_iframed( )
{
  if(window.self != window.top)
      return 1; else
      return 0;
}

function js_getParentDomain()
{
  return window.top.location.href;
}

function js_getDomainOfSubDomain()
{
  //*** window.location.host is subdomain.domain.com

  var siteName;
  if (js_iframed())
    siteName = window.top.location.host; else
    siteName = window.location.host;

  var parts   = siteName.split('.');

  if (parts.length >= 2)
  {
  	//*** sub is 'subdomain', 'domain', type is 'com'
    var sub  = parts[parts.length-3]
    var domain  = parts[parts.length-2]
    var type    = parts[parts.length-1]
    
    return domain + "." + type;
  } else
  {
    return siteName;
  }
}


/// EVAL

function js_eval(code)
{
  eval(code);
}

/// SOME EXTRA FUNC-S

function js_set_document_body_color(newColor)
{
  document.body.style.backgroundColor = newColor;
}

function js_set_document_title(newTitle)
{
  document.title = newTitle;
}


/// INVISIBLE BUTTONS

function js_CreateInvisibleButton( buttonID, link )
{
  var btn = document.createElement('invisible_button');

  btn.id = buttonID;
  btn.link = ' ';
  btn.draggable = false;

  if (link == 'fullscreen')
  btn.onclick = function(){ // FULLSCREEN BUTTON
	if (screenfull.enabled)
	    screenfull.toggle();//toggle(document.getElementById("canvas"));
  }; else
  btn.onclick = function(){ // OPEN LINK BUTTON
  	window.open(this.link)
  };

  btn.onmousedown = function(){return false};
  document.body.appendChild(btn);
}

function js_UpdateInvisibleButton( buttonID, x1, y1, x2, y2, link, active )
{
  var btn = document.getElementById(buttonID);

  btn.link = link;

  var scale_scr     = getDocHeight()/game_height;

  btn.style.left    = parseInt(canvas.style.left, 10) + x1*scale_scr + "px";//(wbr-scale_scr * game_width)/2 + x - width * 0.5 + "px";
  btn.style.top     = parseInt(canvas.style.top, 10) + y1*scale_scr + "px";//(hbr-scale_scr * game_height)/2 + y - height * 0.5 + "px";

  btn.style.width   = (x2-x1) * scale_scr + "px";
  btn.style.height  = (y2-y1) * scale_scr + "px";

  if (active) 
  {
    btn.style.pointerEvents = 'auto';
  } else
  {
    btn.style.pointerEvents = 'none';
  }

}

function js_DestroyInvisibleButton( buttonID )
{
  var btn = document.getElementById(buttonID);
  btn.parentNode.removeChild(btn);
}
