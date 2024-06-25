alert("Select the objects in boat with farmer and press the boat to cross the game");
let background, canvas, c, w, h, w2, h2, elements, boat, farmer, wolf, goat, cabbage, moves, textures, solution;
		
function init(){
	let old = document.querySelector('canvas');
	if(old)
		old.remove();
	
	moves = 0;
	solution = [1,3,0,3,0,4,0,4,3,0,3,2,0,2,0,3,0,3,1];
	
	canvas = document.createElement('canvas');
	canvas.width = w = innerWidth;
	canvas.height = h = innerHeight;
	w4 = w/4;
	h4 = h/4;
	canvas.addEventListener('click', getElement );
	
	c = canvas.getContext('2d');
  
	document.body.appendChild(canvas);

	c.shadowColor = 'rgba(0,0,0,0.5)';
	c.shadowBlur = 50;

	background = c.createLinearGradient(0,0,w,0);
	background.addColorStop(0,'green');
	background.addColorStop(0.2,'green');
	background.addColorStop(0.27,'#654321');
	background.addColorStop(0.3,'blue');
	background.addColorStop(0.5,'#00BFFF');
	background.addColorStop(0.7,'blue');
	background.addColorStop(0.73,'#654321');
	background.addColorStop(0.8,'green');
	background.addColorStop(1,'green');
	c.fillStyle = background;
	
	elements = [];

	farmer = new Passenger(textures['img/farmer.png'],w2,h2,'farmer',0,true);
	
	wolf = new Passenger(textures['img/wolf.png'],w2,h2,'wolf',1);
	
	goat = new Passenger(textures['img/goat.png'],w2,h2,'goat',2);
	
	cabbage = new Passenger(textures['img/cabbage.png'],w2,h2,'cabbage',3);

	boat = new Boat(textures['img/boat.png']); 

	elements.push( boat );
	elements.push( farmer );
	elements.push( wolf );
	elements.push( goat );
	elements.push( cabbage );

	/* hack to quick implement a solution's button */
	let solve = {
		pos: {
			x: w-150,
			y: h-50
		},
		h: 30,
		w: 130,
		
		show: function(){
			c.fillStyle = 'gray';
			c.fillRect(this.pos.x, this.pos.y, this.w, this.h);
			c.fillStyle = 'black';
			c.font = '1.2rem Arial';
			let text = 'Solution';
			let m = c.measureText(text);
			c.fillText(text, this.pos.x+m.width/2, this.pos.y+20);
		},
		
		action: function(){
			init();
			canvas.removeEventListener('click', getElement);
			solveMe();
		}
	};

	elements.push( solve );

	draw();
}

function solveMe(){
	if( solution.length > 0 ){
		elements[ solution.shift() ].action();
		draw();
		setTimeout( solveMe, 1000 );
	}
}

function draw(){
	c.fillStyle = background;
	c.fillRect(0,0,w,h);
	for(let i = 0; i < elements.length; i++){
		elements[i].show();
	}
	check();
}

function check(){
	if( farmer.side == 2 && (wolf.side == 0 && goat.side == 0) ||
			farmer.side == 1 && (wolf.side == 3 && goat.side == 3) ||
			farmer.side == 2 && (goat.side == 0 && cabbage.side == 0) ||
			farmer.side == 1 && (goat.side == 3 && cabbage.side == 3 )
	){
		gameOver('You Lose');
	}
	if( farmer.side == 3 && wolf.side == 3 && goat.side == 3 && cabbage.side == 3){
		gameOver('You Win');
	}
}

let getElement = function(e){
	let x = e.offsetX, y = e.offsetY;
	let found = null;
	for(let i = 0; i < elements.length; i++){
		let e = elements[i];
		if( x > e.pos.x && x < e.pos.x + e.w &&
				y > e.pos.y && y < e.pos.y + e.h ){
			found = e;
		}
	}
	if(found){
		found.action();
	}
	draw();
	moves+=1;
}

function gameOver(result){
	canvas.removeEventListener('click', getElement);
	setTimeout( function(){
		canvas.addEventListener('click', function(){
			init();
		});
	}, 1500);
	c.fillStyle = "black";
	c.font = "3rem Arial";
	c.fillText(result, (w-c.measureText(result).width)/2, 100);
}

function loadImages(){
	let total = 0;
	imgSrc = ['img/farmer.png','img/wolf.png','img/goat.png','img/cabbage.png','img/boat.png'];
	textures = {};
	for(name of imgSrc){
		textures[name] = new Image();
		textures[name].src = name;
		textures[name].onload = function(){
			total++;
			if( total == imgSrc.length )
				init();
		}
	}
}

loadImages();

window.onresize = function(){
	init();
};