/**
 * jBeep
 * 
 * Play WAV beeps easily in javascript!
 * Tested on all popular browsers and works perfectly, including IE6.
 * 
 * @date 10-19-2012
 * @license MIT
 * @author Everton (www.ultraduz.com.br)
 * @version 1.0
 * @params soundFile The .WAV sound path
 */
function jBeep(soundFile){
	
	if (!soundFile) soundFile = "jBeep/jBeep.wav";
	
	var soundElem, bodyElem, isHTML5;
	
	isHTML5 = true;
	try {
		if (typeof document.createElement("audio").play=="undefined") isHTML5 = false;
	}
	catch (ex){
		isHTML5 = false;
	}	

	bodyElem = document.getElementsByTagName("body")[0];	
	if (!bodyElem) bodyElem = document.getElementsByTagName("html")[0];
	
	soundElem = document.getElementById("jBeep");		
	if (soundElem) bodyElem.removeChild(soundElem);

	if (isHTML5) {

		soundElem = document.createElement("audio");
		soundElem.setAttribute("id", "jBeep");
		soundElem.setAttribute("src", soundFile);
		soundElem.play();

	}
	else if(navigator.userAgent.toLowerCase().indexOf("msie")>-1){		
		
		soundElem = document.createElement("bgsound");
		soundElem.setAttribute("id", "jBeep");
		soundElem.setAttribute("loop", 1);
		soundElem.setAttribute("src", soundFile);

		bodyElem.appendChild(soundElem);

	}
	else {
		
		var paramElem;
		
		soundElem = document.createElement("object");
		soundElem.setAttribute("id", "jBeep");
		soundElem.setAttribute("type", "audio/wav");
		soundElem.setAttribute("style", "display:none;");
		soundElem.setAttribute("data", soundFile);
		
		paramElem = document.createElement("param");
		paramElem.setAttribute("name", "autostart");
		paramElem.setAttribute("value", "false");
		
		soundElem.appendChild(paramElem);
		bodyElem.appendChild(soundElem);
		
		try {
			soundElem.Play();
		}
		catch (ex) {
			soundElem.object.Play();
		}
		
	}
	
}