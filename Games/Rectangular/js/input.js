/*
	By Yhoyhoj : twitter.com/yhoyhoj
*/

function onKeyDown(key){
		
	switch(key) {

		case 38:
			up = true;
		break;

		case 39:
			right = true;
		break;

		case 37:
			left = true;
		break;

		case 32:
			space = true;
		break;

	}
}
function onKeyUp(key){
	
	switch(key) {

		case 38:
			up = false;
			player.up = 0;
		break;

		case 39:
			right = false;
		break;

		case 37:
			left = false;
		break;

		case 32:
			space = false;
		break;

	}
}
function onMouseMove(event){

	x = event.clientX;
	y = event.clientY;

}