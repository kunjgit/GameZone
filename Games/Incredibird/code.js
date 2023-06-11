var body = document.body;
var allButtons = Array.prototype.slice.call(document.getElementsByClassName("button"));
var aspect = 228.5/154;

function calculateCanvasDimensions() {
	var width = wrapper.offsetWidth;
	var height = wrapper.offsetHeight;
	var targetWidth = clamp(body.clientWidth * .95,228.5,1000);
	var targetHeight = clamp(body.clientHeight * .95,228.5/aspect,1000/aspect);
	var wDiff = width/targetWidth;
	var hDiff = height / targetHeight;
	var factor = Math.max(wDiff,hDiff);
	wrapper.style.width = width  / factor + "px";
	wrapper.style.height = width/aspect / factor + "px";
	veil.style.width = wrapper.style.width;
	veil.style.height = wrapper.style.height;
	document.body.style.fontSize = Math.round(16*(wrapper.offsetWidth-228.5)/800+8) + "px";
	
	clearTimeout(calculateCanvasDimensions.timeout);
	calculateCanvasDimensions.timeout = setTimeout(function(){
		for(var i = 0 ; i < allButtons.length; i++){
			var btn = allButtons[i];
				var ctx = btn.getContext("2d");
				ctx.fillStyle = P[3];
				ctx.fillRect(0,0,btn.width,btn.height);
				ctx.imageSmoothingEnabled = false;
				ctx.webkitImageSmoothingEnabled = false;
				var p = spritePosCache[btn.id];
				ctx.drawImage(imglol, p[0], p[1], p[2], p[3], 0,0,btn.width,btn.height);
		}
	},200);
}

var spritePosCache = {
	"72bfire": [0,12,15,16],
	"74bwater":[30,12,15,16],
	"75bearth":[60,12,15,16],
	"76bair":[90,12,15,16],
	"87top" :[120,15,10,10],
	"83bottom":[130,15,10,10],
	"32slowmo":[126,1,11,11]

}

calculateCanvasDimensions();

window.onresize = function(event) {
    calculateCanvasDimensions();
};

setTimeout(calculateCanvasDimensions,500);

document.body.addEventListener('touchmove',function(e){
      e.preventDefault();
});
