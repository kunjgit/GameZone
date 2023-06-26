var endingLoadFinish=0;
function loadEndingMusic()
{
	if(endingLoadFinish) return;
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.registerSound({id:"win", src:"sound/ending/win.ogg"});	

	createjs.Sound.addEventListener("fileload", handleFileLoad);
	function handleFileLoad(event) {
    	// A sound has been preloaded.
		//console.log("Preloaded:", event.id, event.src);
		endingLoadFinish = 1;
	}
}

function endingMusicPlay()
{
	if(endingLoadFinish) soundPlay("win");
}

function endingMusicStop()
{
	if(endingLoadFinish) soundStop("win");
}
