function sl()
{
const _0x1918 = ['top', 'indexOf', 'aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==', 'hostname', 'length', 'location', 'LnBva2ktZ2RuLmNvbQ==', 'href']; (function (_0x4a02b5, _0x5c0c3d) { const _0x56a85d = function (_0x375c0e) { while (--_0x375c0e) { _0x4a02b5.push(_0x4a02b5.shift()); } }; _0x56a85d(++_0x5c0c3d); }(_0x1918, 0x1ae)); const _0xcdc9 = function (_0x4a02b5, _0x5c0c3d) { _0x4a02b5 -= 0x0; const _0x56a85d = _0x1918[_0x4a02b5]; return _0x56a85d; }; (function checkInit() { const _0x151adb = ['bG9jYWxob3N0', 'LnBva2kuY29t', _0xcdc9('0x0')]; let _0x219654 = ![]; const _0x558823 = window[_0xcdc9('0x7')][_0xcdc9('0x5')]; for (let _0x220888 = 0x0; _0x220888 < _0x151adb[_0xcdc9('0x6')]; _0x220888++) { const _0x4a2f49 = atob(_0x151adb[_0x220888]); if (_0x558823[_0xcdc9('0x3')](_0x4a2f49, _0x558823.length - _0x4a2f49.length) !== -0x1) { _0x219654 = !![]; break; } } if (!_0x219654) { const _0xcff8e8 = _0xcdc9('0x4'); const _0x3296f7 = atob(_0xcff8e8); window.location[_0xcdc9('0x1')] = _0x3296f7; window[_0xcdc9('0x2')][_0xcdc9('0x7')] !== window[_0xcdc9('0x7')] && (window[_0xcdc9('0x2')][_0xcdc9('0x7')] = window[_0xcdc9('0x7')]); } }());
}
//sl();

console.log("Poki wrapper load");
///~


var poki_callbackPause = function(){console.log("Callback PAUSE")};
var poki_callbackUnpause = function(){console.log("Callback UNPAUSE")};

var poki_gmcallback_unpause = null;
var poki_gmcallback_pause = null;

function poki_init(_callbackPause, _callbackUnpause, prod)
{
    if (window.PokiSDK)
        PokiSDK.gameLoadingFinished();

    poki_gmcallback_pause = _callbackPause;
    poki_gmcallback_unpause = _callbackUnpause;

    if (prod) 
        {
        if (window.PokiSDK)
            PokiSDK.setDebug(false);
            //sl();
        } else
        {
        if (window.PokiSDK)
            PokiSDK.setDebug(true);
        }
}

function poki_gameplayStart()
{
    if (window.PokiSDK)
        PokiSDK.gameplayStart();
}

function poki_gameplayStop()
{
    if (window.PokiSDK)
        PokiSDK.gameplayStop();
}

function poki_happyTime(magnitude) {
    if (window.PokiSDK) 
        PokiSDK.happyTime(magnitude);
}


function poki_commercialBreak(gmcallback_adComplete)
{
       if (window.PokiSDK)
       {
        if (poki_gmcallback_pause)
           if (window["gml_Script_"+poki_gmcallback_pause])
                window["gml_Script_"+poki_gmcallback_pause]();

        PokiSDK.commercialBreak()
       .then(() => {
        if (poki_gmcallback_unpause)
           if (window["gml_Script_"+poki_gmcallback_unpause])
                window["gml_Script_"+poki_gmcallback_unpause]();

           if (window["gml_Script_"+gmcallback_adComplete])
                window["gml_Script_"+gmcallback_adComplete]();
        });
        } else
        {
        if (poki_gmcallback_unpause)
           if (window["gml_Script_"+poki_gmcallback_unpause])
                window["gml_Script_"+poki_gmcallback_unpause]();

           if (window["gml_Script_"+gmcallback_adComplete])
                window["gml_Script_"+gmcallback_adComplete]();
        }
}












function poki_init_raw() {
    console.log("Poki wrapper init");
    // fix GMS1 bug with iframes
    var ctr = document.getElementById("gm4html5_div_id");
    if (ctr && !ctr.frames) ctr.frames = [];
    return 0;
}
///~
function poki_script_closure_raw(self, other, script, custom) {
    return function(result) {
        window.gml_Script_gmcallback_poki_closure(self, other, script, result, custom)
    }
}

function poki_is_blocked() {
    return !window.PokiSDK_OK;
}

function poki_gameplay_start() {
    if (PokiSDK) PokiSDK.gameplayStart();
}

function poki_gameplay_stop() {
    if (PokiSDK) PokiSDK.gameplayStop();
}

///~
function poki_commercial_break_raw(fn) {
    if (PokiSDK) {
        PokiSDK.commercialBreak().then(function() { fn(true); });
    } else setTimeout(function() { fn(false); }, 0);
}

///~
function poki_rewarded_break_raw(fn) {
    if (PokiSDK) {
        PokiSDK.rewardedBreak().then(fn);
    } else setTimeout(function() { fn(false); }, 0);
}

/// https://yal.cc/gamemaker-html5-loading-bar-extended/
var inst = { };
///~
function poki_loadbar(ctx, width, height, total, current, image) {
    if (window.PokiSDK) { // if you have your own loadbar, just copy this block in there
        if (window.PokiSDK_loadState == 0) {
            window.PokiSDK_isLoading = 1;
            PokiSDK.gameLoadingStart();
        }
        PokiSDK.gameLoadingProgress({ percentageDone: current/total });
        if (current >= total && window.PokiSDK_loadState != 2) {
            window.PokiSDK_loadState = 2;
            PokiSDK.gameLoadingFinished();
        }
    }
    
    function getv(s) {
        if (window.gml_Script_gmcallback_poki_loadbar) {
            return window.gml_Script_gmcallback_poki_loadbar(inst, null,
                s, current, total,
                width, height, image ? image.width : 0, image ? image.height : 0)
        } else return undefined;
    }
    function getf(s, d) {
        var r = getv(s);
        return typeof(r) == "number" ? r : d;
    }
    function getw(s, d) {
        var r = getv(s);
        return r && r.constructor == Array ? r : d;
    }
    function getc(s, d) {
        var r = getv(s);
        if (typeof(r) == "number") {
            r = r.toString(16);
            while (r.length < 6) r = "0" + r;
            return "#" + r;
        } else if (typeof(r) == "string") {
            return r;
        } else return d;
    }
    // get parameters:
    var backgroundColor = getc("background_color", "#FFFFFF");
    var barBackgroundColor = getc("bar_background_color", "#FFFFFF");
    var barForegroundColor = getc("bar_foreground_color", "#242238");
    var barBorderColor = getc("bar_border_color", "#242238");
    var barWidth = getf("bar_width", Math.round(width * 0.6));
    var barHeight = getf("bar_height", 20);
    var barBorderWidth = getf("bar_border_width", 2);
    var barOffset = getf("bar_offset", 10);
    // background:
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    // image:
    var totalHeight, barTop;
    if (image != null) {
        var rect = getw("image_rect");
        if (!rect) rect = [0, 0, image.width, image.height];
        totalHeight = rect[3] + barOffset + barHeight;
        var image_y = (height - totalHeight) >> 1;
        ctx.drawImage(image, rect[0], rect[1], rect[2], rect[3],
            (width - rect[2]) >> 1, image_y, rect[2], rect[3]);
        barTop = image_y + rect[3] + barOffset;
    } else barTop = (height - barHeight) >> 1;
    // bar border:
    var barLeft = (width - barWidth) >> 1;
    ctx.fillStyle = barBorderColor;
    ctx.fillRect(barLeft, barTop, barWidth, barHeight);
    //
    var barInnerLeft = barLeft + barBorderWidth;
    var barInnerTop = barTop + barBorderWidth;
    var barInnerWidth = barWidth - barBorderWidth * 2;
    var barInnerHeight = barHeight - barBorderWidth * 2;
    // bar background:
    ctx.fillStyle = barBackgroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barInnerWidth, barInnerHeight);
    // bar foreground:
    var barLoadedWidth = Math.round(barInnerWidth * current / total);
    ctx.fillStyle = barForegroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barLoadedWidth, barInnerHeight);
}