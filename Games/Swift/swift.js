// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var Swift = (function(){
	//PRIVATE
	var _body,
		_info,
		_canvas, 
		_context,
		_posX = 400, //position x of ship
		_posY = 190, //position y of ship
		_position = false, //false position means horizontal, true is vertical
		_up = false, //false - on click ship goes down, true - ship goes up
		_right = true, //false - ship goes left, true - ship goes right
		_shiftX = 0, //shift of level x position
		_shiftY = 0, //shift of level y position
		_shipDim = 12, //width and height of ship is ~12px
		_stroke = '#FFF', //color of level borders
		_animationId = 0,
		_v = [2,2,3,3,4,4,5,5,4,5], //velocity of each level
		_lives = 5, //start game with 5 lives,
		_lvl = 0,
		_lines = [ //lines after which we change mode, vert: true means that line is vertical, mode: true means that vertical mode will be changed, last line is end of level
			[{x1:1780,y1:1200,x2:1780,y2:1400,vert:true,mode:true}],
			[{x1:900,y1:300,x2:900,y2:500,vert:true,mode:true},{x1:1200,y1:100,x2:1200,y2:300,vert:true,mode:true},{x1:1580,y1:300,x2:1580,y2:500,vert:true,mode:true}],
			[{x1:800,y1:400,x2:1000,y2:400,vert:false,mode:false},{x1:0,y1:802,x2:200,y2:802,vert:false,mode:false},{x1:979,y1:900,x2:979,y2:1100,vert:true,mode:true}],
			[{x1:400,y1:559,x2:600,y2:559,vert:false,mode:true},{x1:400,y1:-461,x2:600,y2:-461,vert:false,mode:true},{x1:1200,y1:559,x2:1400,y2:559,vert:false,mode:true},{x1:1200,y1:-479,x2:1400,y2:-479,vert:false,mode:true}],
			[{x1:500,y1:100,x2:500,y2:300,vert:true,mode:true},{x1:1080,y1:-400,x2:1080,y2:-300,vert:true,mode:false},{x1:500,y1:-500,x2:500,y2:-400,vert:true,mode:true},{x1:300,y1:-302,x2:400,y2:-302,vert:false,mode:false},{x1:428,y1:-200,x2:428,y2:-100,vert:true,mode:true}],
			[{x1:680,y1:260,x2:680,y2:300,vert:true,mode:true},{x1:700,y1:240,x2:700,y2:300,vert:true,mode:true},{x1:720,y1:220,x2:720,y2:300,vert:true,mode:true},{x1:740,y1:240,x2:740,y2:300,vert:true,mode:true},{x1:760,y1:260,x2:760,y2:300,vert:true,mode:true},{x1:680,y1:100,x2:680,y2:120,vert:true,mode:true},{x1:700,y1:100,x2:700,y2:140,vert:true,mode:true},{x1:720,y1:100,x2:720,y2:160,vert:true,mode:true},{x1:740,y1:100,x2:740,y2:180,vert:true,mode:true},{x1:760,y1:100,x2:760,y2:200,vert:true,mode:true},{x1:780,y1:100,x2:780,y2:220,vert:true,mode:true},{x1:800,y1:100,x2:800,y2:240,vert:true,mode:true},{x1:1100,y1:100,x2:1100,y2:130,vert:true,mode:true},{x1:1680,y1:580,x2:1680,y2:780,vert:true,mode:true}],
			[{x1:750,y1:500,x2:750,y2:550,vert:true,mode:true},{x1:800,y1:20,x2:900,y2:20,vert:false,mode:true},{x1:980,y1:100,x2:980,y2:200,vert:true,mode:false},{x1:20,y1:-100,x2:20,y2:0,vert:true,mode:true}],
			[{x1:1120,y1:900,x2:1120,y2:1000,vert:true,mode:true},{x1:1260,y1:500,x2:1260,y2:600,vert:true,mode:true},{x1:1400,y1:800,x2:1400,y2:900,vert:true,mode:true},{x1:1450,y1:500,x2:1520,y2:500,vert:false,mode:false},{x1:1100,y1:260,x2:1180,y2:260,vert:false,mode:false},{x1:1300,y1:160,x2:1300,y2:200,vert:true,mode:true},{x1:1480,y1:140,x2:1520,y2:140,vert:false,mode:false},{x1:1120,y1:20,x2:1120,y2:60,vert:true,mode:true},{x1:740,y1:240,x2:940,y2:240,vert:false,mode:true}],
			[{x1:600,y1:450,x2:600,y2:500,vert:true,mode:true},{x1:752,y1:0,x2:752,y2:50,vert:true,mode:true},{x1:900,y1:450,x2:900,y2:500,vert:true,mode:true},{x1:1052,y1:0,x2:1052,y2:50,vert:true,mode:true},{x1:1500,y1:220,x2:1500,y2:350,vert:true,mode:true},{x1:1600,y1:300,x2:1600,y2:350,vert:true,mode:false},{x1:1600,y1:202,x2:1700,y2:202,vert:false,mode:false},{x1:1552,y1:50,x2:1552,y2:100,vert:true,mode:true},{x1:20,y1:140,x2:20,y2:240,vert:true,mode:true}],
			[{x1:600,y1:100,x2:600,y2:300,vert:true,mode:true},{x1:600,y1:-600,x2:600,y2:-100,vert:true,mode:false},{x1:920,y1:-450,x2:920,y2:-100,vert:true,mode:false},{x1:920,y1:-600,x2:920,y2:-500,vert:true,mode:true},{x1:1100,y1:-600,x2:1100,y2:-250,vert:true,mode:false},{x1:1100,y1:-200,x2:1100,y2:-100,vert:true,mode:true},{x1:1300,y1:-450,x2:1300,y2:-100,vert:true,mode:false},{x1:1300,y1:-600,x2:1300,y2:-500,vert:true,mode:true},{x1:1370,y1:-600,x2:1370,y2:-550,vert:true,mode:false},{x1:1500,y1:-520,x2:1500,y2:-100,vert:true,mode:false},{x1:1680,y1:-580,x2:1680,y2:-480,vert:true,mode:false},{x1:1580,y1:-580,x2:1680,y2:-580,vert:false,mode:true},{x1:1800,y1:-120,x2:1800,y2:-52,vert:true,mode:false},{x1:2000,y1:-150,x2:2000,y2:-30,vert:true,mode:true},{x1:2280,y1:-400,x2:2280,y2:-300,vert:true,mode:true}]
		],
		_level = [ //each level has separate coordinates
			[{x:0,y:100},{x:1000,y:100},{x:1000,y:600},{x:1400,y:600},{x:1400,y:1200},{x:1800,y:1200},{x:1800,y:1400},{x:1200,y:1400},{x:1200,y:800},{x:800,y:800},{x:800,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:100},{x:800,y:100},{x:800,y:300},{x:1000,y:300},{x:1000,y:100},{x:1400,y:100},{x:1400,y:300},{x:1600,y:300},{x:1600,y:500},{x:1300,y:500},{x:1300,y:300},{x:1100,y:300},{x:1100,y:500},{x:700,y:500},{x:700,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:100},{x:1000,y:100},{x:1000,y:700},{x:200,y:700},{x:200,y:900},{x:1000,y:900},{x:1000,y:1100},{x:0,y:1100},{x:0,y:500},{x:800,y:500},{x:800,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:100},{x:400,y:100},{x:400,y:-500},{x:600,y:-500},{x:600,y:-440},{x:1000,y:-440},{x:1000,y:100},{x:1200,y:100},{x:1200,y:-500},{x:1400,y:-500},{x:1400,y:600},{x:1200,y:600},{x:1200,y:300},{x:800,y:300},{x:800,y:-240},{x:600,y:-240},{x:600,y:600},{x:400,y:600},{x:400,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:100},{x:600,y:100},{x:600,y:-200},{x:900,y:-200},{x:900,y:-300},{x:600,y:-300},{x:600,y:-400},{x:400,y:-400},{x:400,y:-200},{x:450,y:-200},{x:450,y:-100},{x:300,y:-100},{x:300,y:-500},{x:700,y:-500},{x:700,y:-400},{x:1100,y:-400},{x:1100,y:-300},{x:1000,y:-300},{x:1000,y:-100},{x:700,y:-100},{x:700,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:100},{x:1200,y:100},{x:1700,y:600},{x:1700,y:800},{x:1200,y:300},{x:0,y:300},{x:0,y:100}],
			[{x:0,y:140},{x:600,y:140},{x:600,y:0},{x:0,y:0},{x:0,y:-100},{x:700,y:-100},{x:700,y:500},{x:800,y:500},{x:800,y:0},{x:900,y:0},{x:900,y:100},{x:1000,y:100},{x:1000,y:200},{x:900,y:200},{x:900,y:600},{x:600,y:600},{x:600,y:240},{x:0,y:240},{x:0,y:140}],
			[{x:0,y:100},{x:700,y:100},{x:700,y:500},{x:1100,y:500},{x:1100,y:800},{x:1140,y:800},{x:1140,y:500},{x:1380,y:500},{x:1380,y:800},{x:1420,y:800},{x:1420,y:400},{x:1060,y:400},{x:1060,y:160},{x:1420,y:160},{x:1420,y:120},{x:940,y:120},{x:940,y:260},{x:740,y:260},{x:740,y:20},{x:1520,y:20},{x:1520,y:260},{x:1260,y:260},{x:1260,y:300},{x:1520,y:300},{x:1520,y:1000},{x:1280,y:1000},{x:1280,y:700},{x:1240,y:700},{x:1240,y:1000},{x:1000,y:1000},{x:1000,y:600},{x:600,y:600},{x:600,y:300},{x:0,y:300},{x:0,y:100}],		
			[{x:0,y:140},{x:550,y:140},{x:550,y:450},{x:650,y:450},{x:650,y:0},{x:850,y:0},{x:850,y:450},{x:950,y:450},{x:950,y:0},{x:1150,y:0},{x:1150,y:150},{x:1400,y:150},{x:1400,y:50},{x:1700,y:50},{x:1700,y:350},{x:1400,y:350},{x:1400,y:200},{x:1100,y:200},{x:1100,y:50},{x:1000,y:50},{x:1000,y:500},{x:800,y:500},{x:800,y:50},{x:700,y:50},{x:700,y:500},{x:500,y:500},{x:500,y:240},{x:0,y:240},{x:0,y:140}],
			[{x:0,y:100},{x:700,y:100},{x:700,y:-100},{x:500,y:-100},{x:500,y:-600},{x:1700,y:-600},{x:1700,y:-300},{x:2100,y:-100},{x:2100,y:-400},{x:2300,y:-400},{x:2300,y:-300},{x:2200,y:-300},{x:2200,y:100},{x:2100,y:100},{x:1700,y:-100},{x:900,y:-100},{x:900,y:300},{x:0,y:300},{x:0,y:100}]
		],
		Ship = (function(){
			var len = 10,
				fraction = 2/3,
				lineWidth = 2.5, //need to add 0.5px because of http://stackoverflow.com/questions/8696631/canvas-drawings-are-blurry
				strokeActive = '#FF4040', //red
				strokeInactive = '#8a8a8a', //grey
				firstGrey = '#797979',
				secGrey = '#4d4c4c',
				thirdGrey = '#302f2f',
				fourthGrey = '#111111';
				
				function right(x,y){
					_context.lineTo(x+len,y);
					_context.lineTo(x-len,y-len*fraction);
					_context.lineTo(x-len,y+len*fraction);
					_context.lineTo(x+len,y);
					_context.fillStyle = firstGrey;
					_context.fillRect(x+12,y,4,1);
					_context.fillStyle = secGrey;
					_context.fillRect(x+20,y,4,1);
					_context.fillStyle = thirdGrey;
					_context.fillRect(x+28,y,4,1);
					_context.fillStyle = fourthGrey;
					_context.fillRect(x+36,y,4,1);
				}
				
				function left(x,y){
					_context.lineTo(x-len,y);
					_context.lineTo(x+len,y-len*fraction);
					_context.lineTo(x+len,y+len*fraction);
					_context.lineTo(x-len,y);
					_context.fillStyle = firstGrey;
					_context.fillRect(x-16,y,4,1);
					_context.fillStyle = secGrey;
					_context.fillRect(x-24,y,4,1);
					_context.fillStyle = thirdGrey;
					_context.fillRect(x-32,y,4,1);
					_context.fillStyle = fourthGrey;
					_context.fillRect(x-40,y,4,1);
				}
				
				function up(x,y,s){
					_context.lineTo(x,y-len);
					_context.lineTo(x+len*fraction,y+len);
					_context.lineTo(x-len*fraction,y+len);
					_context.lineTo(x,y-len);
					if(!s){
						_context.fillStyle = firstGrey;
						_context.fillRect(x,y-16,1,4);
						_context.fillStyle = secGrey;
						_context.fillRect(x,y-24,1,4);
						_context.fillStyle = thirdGrey;
						_context.fillRect(x,y-32,1,4);
						_context.fillStyle = fourthGrey;
						_context.fillRect(x,y-40,1,4);	
					}					
				}
				
				function down(x,y){
					_context.lineTo(x,y+len);
					_context.lineTo(x+len*fraction,y-len);
					_context.lineTo(x-len*fraction,y-len);
					_context.lineTo(x,y+len);
					_context.fillStyle = firstGrey;
					_context.fillRect(x,y+12,1,4);
					_context.fillStyle = secGrey;
					_context.fillRect(x,y+20,1,4);
					_context.fillStyle = thirdGrey;
					_context.fillRect(x,y+28,1,4);
					_context.fillStyle = fourthGrey;
					_context.fillRect(x,y+36,1,4);	
				}
				
			return {
				draw : function(x,y,single){
					if(!single){
						_context.beginPath();
						_context.lineWidth = 1.5;
						_context.strokeStyle = strokeInactive; //first draw grey ship
						if(!_position){
							if(_up){
								up(x,y,0);
							}
							else{
								down(x,y);
							}
						}
						else{
							if(_right){
								right(x,y); 
							}
							else{
								left(x,y);
							}
						}
						_context.stroke();
						_context.closePath();
					}
							
					_context.beginPath();
					_context.lineWidth = lineWidth;
					_context.strokeStyle = strokeActive; //now draw red ship
					
					if(!single){
						if(!_position){
							if(_right){
								right(x,y);
							}
							else{
								left(x,y);
							}	
						}
						else{
							if(_up){
								up(x,y,0);
							}
							else{
								down(x,y);
							}
						}
					}
					else{
						up(x,y,1);
					}
					
					_context.stroke();
					_context.closePath();
				}
			}
		})();
		
		function moveVertical(e){
			_position = true;
		}
			
		function moveHorizontal(e){
			_position = false;
		}
		
		function drawChangeModeLines(){
			var i;
			_context.lineWidth = 4;
			for(i = 0; i<_lines[_lvl].length; i++){
				_context.beginPath();
				if(i===_lines[_lvl].length-1){//last one is end of level, so red color
					_context.strokeStyle = '#FF4040';
				}
				else if(_lines[_lvl][i].mode){ //blue
					_context.strokeStyle = '#37B6CE';
				}
				else{ //green
					_context.strokeStyle = '#00BD39';
				}
				_context.lineTo(_lines[_lvl][i].x1-_shiftX,_lines[_lvl][i].y1-_shiftY);
				_context.lineTo(_lines[_lvl][i].x2-_shiftX,_lines[_lvl][i].y2-_shiftY);
				_context.stroke();
				_context.closePath();
			}
		}
		
		function drawLevelShape(){
			var i;
			_context.beginPath();
			_context.lineWidth = 2;
			_context.strokeStyle = _stroke;
			
			for(i = 0; i<_level[_lvl].length; i++){
				_context.lineTo(_level[_lvl][i].x-_shiftX,_level[_lvl][i].y-_shiftY);
			}

			_context.stroke();
			_context.closePath();
		}
		
		function moveWholeLevel(){
			if(_position){
				if(_up){
					_shiftY -= _v[_lvl];
				}
				else {
					_shiftY += _v[_lvl];
				}
			}
			else{
				if(_right){
					_shiftX += _v[_lvl];
				}
				else{
					_shiftX -= _v[_lvl];
				}
			}
		}
		
		function drawInfo(){
			var i=_lvl+1;
			_context.fillStyle = "#FFFFFF";
			_context.font = "bold 16px Arial";
			_context.fillText("Level "+i, 10, 585);
			_context.fillText("Lives", 90, 585);

			for(i=1; i<=_lives; i++){
				Ship.draw(125+(i*20),580,1);
			}
		}
		
		function resetOptions(){
			_shiftX = 0;
			_shiftY = 0;
			_position = false;
			_up = false;
			_right = true;
		}
			
		function changeModesOnSpecialLines(){
			var i;
			for(i = 0; i<_lines[_lvl].length; i++){
				if(((_lines[_lvl][i].vert && _shiftX+_posX===_lines[_lvl][i].x1) && (_shiftY+_posY>=_lines[_lvl][i].y1 && _shiftY+_posY<=_lines[_lvl][i].y2)) //moving horizontal
					|| ((!_lines[_lvl][i].vert && _shiftY+_posY===_lines[_lvl][i].y1) && (_shiftX+_posX>=_lines[_lvl][i].x1 && _shiftX+_posX<=_lines[_lvl][i].x2))){ //moving vertical
					if(i==_lines[_lvl].length-1){//last line is end of level			
						//clearInterval(_animationId);
						cancelAnimationFrame(_animationId);
						if(_lvl===9){//end of game
							_lvl = 0;
							_lives = 5;
							resetOptions();
							showInfo(10);			
						}
						else{
							_lvl++;
							resetOptions();
							showInfo(_lvl);
						}							
					}
					else if(_lines[_lvl][i].mode){
						_up = !_up;
					}
					else{
						_right = !_right;
					}
				}
			}
		}	

		function detectCollision(){
			if (!_context.isPointInPath(_posX-_shipDim,_posY-_shipDim) || !_context.isPointInPath(_posX+_shipDim,_posY-_shipDim) || !_context.isPointInPath(_posX-_shipDim,_posY+_shipDim) || !_context.isPointInPath(_posX+_shipDim,_posY+_shipDim)){
				cancelAnimationFrame(_animationId);
				//clearInterval(_animationId);
				_lives--;
				if(_lives){
					resetOptions();
					showInfo(100);
				}
				else{ //game over
					_lvl=0;
					resetOptions();
					_lives = 5;
					showInfo(99);
				}
			}
		}
			
		function animate(){
			_context.clearRect(0, 0, 800, 600);		
			
			//draw information about current level and lives
			drawInfo();

			//draw change mode lines, last one is end of level
			drawChangeModeLines();
			
			//show ship		
			Ship.draw(_posX,_posY,0);
		
			//draw level
			drawLevelShape();
	
			//set shift variables for next animation step
			moveWholeLevel();
						
			//check if ship is on change mode line
			//if yes, then change _up or _right mode
			changeModesOnSpecialLines();
				
			//stop the game when ship hits the wall	
			detectCollision();	
		}		
			
		function run(){
			/*_animationId = setInterval(function() {	
				animate();						
			}, (1000/60));*/
			_animationId = requestAnimationFrame(run);
			animate();
		}
		
		function showInfo(no){
			var message='',
				startButton;
			
			if(no==99){
				message = '<h2>SWIFT</h2>GAME OVER :(<div id=\'s\'>RESTART GAME</div>';
			}
			else if(no==100){
				message = '<h2>SWIFT</h2>Oops!<div id=\'s\'>RESTART LEVEL</div>';
			}
			else if(no==0){
				message = '<h2>SWIFT</h2>Welcome to the SWIFT game! Rules are easy. Just hold the left mouse button to move ship vertically or release it to move horizontally.<div id=\'s\'>START GAME</div>';
			}
			else if(no==1){
				message = '<h2>SWIFT</h2>Congratulations!<br/>You finished level 1.<br/>Let\'s complicate it a bit. Fly through <span id=\'b\'>blue</span> lines to change your vertical direction.<div id=\'s\'>START NEXT LEVEL</div>';
			}
			else if(no==2){
				message = '<h2>SWIFT</h2>Congratulations!<br/>You finished level 2.<br/>Now fly through <span id=\'g\'>green</span> lines to change your horizontal direction.<div id=\'s\'>START NEXT LEVEL</div>';
			}
			else if(no==3){
				message = '<h2>SWIFT</h2>Congratulations!<br/>You finished level 3.<br/>Now you know all the rules. Good luck with other levels!<div id=\'s\'>START NEXT LEVEL</div>';
			}
			else if(no==10){
				message = '<h2>SWIFT</h2>Congratulations!<br/>You finished all levels.<br/>Thanks for playing!<div id=\'s\'>RESTART GAME</div>';
			}
			else{
				message = '<h2>SWIFT</h2>Congratulations!<br/>You finished level '+no+'<br/><div id=\'s\'>START NEXT LEVEL</div>';
			}
				
			_info.style.display="block";
			_info.innerHTML = message;
			
			startButton = document.getElementById('s');
			startButton.addEventListener('click',function(){
				_info.style.display="none";
				run();
			},true);
		}
	
	return {
        init : function() {
			_body = document.body;
			_info = document.getElementById('info');			
			_canvas = document.getElementById('myCanvas');
			_context = _canvas.getContext('2d');
				
			if (_context){
				showInfo(_lvl);
			}
			
			_body.addEventListener('mousedown',moveVertical,true);
			_body.addEventListener('mouseup',moveHorizontal,true);
			_body.addEventListener('touchstart',moveVertical,true);
			_body.addEventListener('touchend',moveHorizontal,true);
			//prevent bug with selecting canvas
			//doesn't work on ipad ;(
			_body.onselectstart = function(){return false;};
			_canvas.addEventListener('selectstart', function(e){e.preventDefault();return false;},false);
        }
    }

})();