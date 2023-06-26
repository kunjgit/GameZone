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
function jBeep(a){if(!a)a="jBeep/jBeep.wav";var b,c,d;d=true;try{if(typeof document.createElement("audio").play=="undefined")d=false}catch(e){d=false}c=document.getElementsByTagName("body")[0];if(!c)c=document.getElementsByTagName("html")[0];b=document.getElementById("jBeep");if(b)c.removeChild(b);if(d){b=document.createElement("audio");b.setAttribute("id","jBeep");b.setAttribute("src",a);b.play()}else if(navigator.userAgent.toLowerCase().indexOf("msie")>-1){b=document.createElement("bgsound");b.setAttribute("id","jBeep");b.setAttribute("loop",1);b.setAttribute("src",a);c.appendChild(b)}else{var f;b=document.createElement("object");b.setAttribute("id","jBeep");b.setAttribute("type","audio/wav");b.setAttribute("style","display:none;");b.setAttribute("data",a);f=document.createElement("param");f.setAttribute("name","autostart");f.setAttribute("value","false");b.appendChild(f);c.appendChild(b);try{b.Play()}catch(e){b.object.Play()}}}