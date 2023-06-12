/**
 * Main function, event handler initialization and application setup
 */
		
function main() {



controls = new Controls(new PersistentData());

if ('ontouchstart' in document.documentElement) {
	document.ontouchstart = function(event) { return controls.onTouchStart(event); }
	document.ontouchenter = function(event) { return controls.onTouchStart(event); }
	document.ontouchend = function(event) { return controls.onTouchEnd(event); }
	document.ontouchleave = function(event) { return controls.onTouchEnd(event); }
	document.ontouchmove = function(event) { return controls.onTouchMove(event); }
} else {
	document.onmousedown = function(event) { return controls.onMouseDown(event); }
	document.onmouseup = function(event) { return controls.onMouseUp(event); }
	document.onmousemove = function(event) { return controls.onMouseMove(event); }
/*
	document.onmousedown = function(event) { return controls.onTouchStart(event); }
	document.onmouseup = function(event) { return controls.onTouchEnd(event); }
	document.onmousemove = function(event) { return controls.mouseLeftButton ? controls.onTouchMove(event) : true; }
*/
}
document.onkeydown = function(event) { return controls.onKeyDown(event); }
document.onkeyup = function(event) { return controls.onKeyUp(event); }
document.oncontextmenu = function(event) { return false; }

// Object storage implementation from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage/3146971
var recordedDataString = localStorage.getItem("LineOfFireData");
var recordedData = {};
if (recordedDataString) {
	recordedData = JSON.parse(recordedDataString);
}

game = new Game(controls, recordedData);
renderer = new Renderer(document.getElementById("c"), document.getElementById("o"), game);

window.addEventListener('resize', function(event) {	renderer.resizeWindow(); } );

//game.world.addExplosionListener(renderer);
game.setRenderer (renderer);
game.launch();

}

window.addEventListener('DOMContentLoaded', main);



function registerControllerEvents(controller) {
	controller.onTriggerStateChangedObservable.add(function(state) { controls.onVRTrigger(state); });
	controller.onMainButtonStateChangedObservable.add(function(state) { controls.onVRMainButton(state); });
	controller.onSecondaryButtonStateChangedObservable.add(function(state) { controls.onVRSecondaryButton(state); });
	controller.onPadValuesChangedObservable.add(function(state) { controls.onVRThumbStick(state); });
}