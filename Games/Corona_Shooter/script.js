"use strict"
		var stage = {
			w:1280,
			h:720
		}

		var _pexcanvas = document.getElementById("canvas");
		_pexcanvas.width = stage.w;
		_pexcanvas.height = stage.h;
		var ctx = _pexcanvas.getContext("2d");




		var pointer = {
			x:stage.w/2,
			y:stage.h/4
		}

		var scale = 1;
		var portrait = true;
		var loffset = 0;
		var toffset = 0;
		var mxpos = 0;
		var mypos = 0;


// ------------------------------------------------------------------------------- Gamy

var againprog = 0;

var healthprog = 0;


function newGame() {
	score = 0;
	health = 100;
	enemies=[];
	enemies.push(new Enemy());
	enemies.push(new Enemy());
	enemies.push(new Enemy());
	againprog = 0;
}



function drawHeart(x,y,w) {
	ctx.beginPath();
	ctx.arc(x-w/4, y, w/4, 0.75*Math.PI,0);
	ctx.arc(x+w/4, y, w/4, 1*Math.PI, 2.25*Math.PI);
	ctx.lineTo(x,y+w/1.5);
	ctx.closePath();
	ctx.fill();
}


var Cannon = function(x,y,tx,ty) {
	this.x = x;
	this.y = y;
	this.tx = tx;
	this.ty = ty;
	this.r = 10;
}

var cannons = [];

var gameover = false;

cannons.push(new Cannon(stage.w,stage.h,stage.w/2,stage.h/2));

var firetm = 0;
var fireact = true;

var health = 100;
var score = 0;


var arm = {x:stage.w,y:stage.h};
var arm2 = {x:0,y:stage.h};
var danger = false;
var dangera = 0;



var Enemy = function() {
	this.x = stage.w/2;
	this.y = stage.h/2;
	this.r = 10;
	this.tx = Math.floor(Math.random()*stage.w);
	this.ty = Math.floor(Math.random()*stage.h);
	this.des = false;
	this.eyeX = 0.4;
	this.eyeY = 0.25;
	this.eyeR = 0.25;
	this.sp = 50;
	this.spl = 1.4;
	this.op=1;
	this.danger = false;
	this.nuked = false;
}

var enemies = [];
// for (var i = 0; i < 10; i++) {
// 	enemies[i] = new Enemy();
// }
		enemies.push(new Enemy());
		enemies.push(new Enemy());
		enemies.push(new Enemy());

var entm = 0;
var ga =0;

var steptime = 0;


var Star = function() {
	this.a = Math.random()*Math.PI*2;
	this.v = 3+Math.random()*5;
	this.x = stage.w/2;
	this.y = stage.h/2;
	this.r = 0.2;
}

var Power = function() {
	this.type = Math.floor(Math.random()*2)+1;
	this.a = Math.random()*Math.PI*2;
	this.v = 3+Math.random()*5;
	this.x = stage.w/2;
	this.y = stage.h/2;
	this.r = 0.2;
	this.dis = false;
	this.op = 1;
}


var powers = [];
var powertm = 0;
var powermax = Math.random()*800+300;
// powermax = 10;

var stars = [];

for (var i =0;i<200;i++) {
	stars[i] = new Star();
	var st = stars[i];
	var move = Math.random()*400;

	st.x += Math.sin(st.a)*move;
	st.y += Math.cos(st.a)*move;


}

// powers.push(new Power());



function enginestep() {
	steptime = Date.now();
	ctx.clearRect(0,0,stage.w,stage.h);
	
	ctx.fillStyle = "#ffffff";

	
	for (var i = 0; i < stars.length; i++) {
		var st = stars[i];

		st.x += Math.sin(st.a)*st.v;
		st.y += Math.cos(st.a)*st.v;
		st.r += st.v/200;

		ctx.beginPath();
		ctx.arc(st.x,st.y, st.r, 2*Math.PI, 0);
		ctx.fill();

		if (st.x>stage.w||st.x<0||st.y<0||st.y>stage.h) {
			stars[i] = new Star();
		}
	}
	if (!gameover) {
		danger = false;


		powertm++;
		if (powertm>powermax) {
			powers.push(new Power());
			powertm = 0;
			powermax = Math.random()*1200+600;
			// powermax = 10;
		}




		for (var i = 0; i < powers.length; i++) {
			var st = powers[i];

			if (!st.des) {
				st.x += Math.sin(st.a)*st.v/1.5;
				st.y += Math.cos(st.a)*st.v/1.5;
				st.r += st.v/15;
			} else {
				st.r *=1.1;
				if (st.type==1) {
				st.op += (0-st.op)/10;
			} else {
				st.op += (0-st.op)/20;

			}
				st.x += (stage.w/2-st.x)/10;
				st.y += (stage.h/2-st.y)/10;

			}

			
			if (st.type ==1) {
				ctx.fillStyle = "rgba(255,0,0,"+st.op+")";

				drawHeart(st.x,st.y-st.r/4, st.r*2);

			} else {
				ctx.fillStyle = "rgba(255,255,0,"+st.op+")";
				ctx.strokeStyle = "rgba(255,255,0,"+st.op+")";
				ctx.lineWidth = st.r/10;
				ctx.beginPath();
				ctx.arc(st.x,st.y, st.r, 2*Math.PI, 0);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(st.x,st.y, st.r*0.15, 2*Math.PI, 0);
				ctx.fill();


				ctx.beginPath();
				ctx.arc(st.x,st.y, st.r*0.85, 1.67*Math.PI, 2*Math.PI);
				ctx.arc(st.x,st.y, st.r*0.25, 2*Math.PI, 1.67*Math.PI,true);

				ctx.closePath();
				ctx.fill();



				ctx.beginPath();
				ctx.arc(st.x,st.y, st.r*0.85, 3*Math.PI, 3.33*Math.PI);
				ctx.arc(st.x,st.y, st.r*0.25, 3.33*Math.PI,3*Math.PI, true);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.arc(st.x,st.y, st.r*0.85, 2.33*Math.PI, 2.67*Math.PI);
				ctx.arc(st.x,st.y, st.r*0.25, 2.67*Math.PI,2.33*Math.PI, true);
				ctx.lineTo(st.x,st.y);
				ctx.closePath();
				ctx.fill();

			}
			if (st.x>stage.w||st.x<0||st.y<0||st.y>stage.h||st.r>stage.w/2) {
				powers.splice(i,1);
				if (st.type == 2&&st.r>stage.w/2) {
					for (var e = 0; e < enemies.length; e++) {
						enemies[e].des = true;
						enemies[e].nuked = true;

					}
				}
				i--;
			}


		}

		entm++;
		if (enemies.length<10&&entm>300) {
			entm=0;
			enemies.push(new Enemy());

		}

			ctx.lineWidth = 2;
		for (var i = 0; i < enemies.length; i++) {
			var en = enemies[i];
			if (!en.danger) {
				ctx.strokeStyle = "rgba(0,255,255,"+en.op*2+")";
			} else {
				health -= 0.01;
				ctx.strokeStyle = "rgba(255,0,0,"+en.op*2+")";
				danger = true;
			}




			if (!en.des) {

				if (en.danger) {
					var randx = Math.floor(Math.random()*4)-2;
					var randy = Math.floor(Math.random()*4)-2;

					en.x = en.tx+randx;
					en.y = en.ty+randy;
				} else {
					en.x += (en.tx-en.x)/100;
					en.y += (en.ty-en.y)/100;
					var randx = 0;
					var randy = 0;
				}

				en.r += (50-en.r)/100;
				if (Math.abs(50-en.r)<2&&!en.danger) {
					en.tx=en.x;
					en.ty=en.y;
					en.danger=true;
				}
				ctx.beginPath();
				ctx.arc(en.x-en.r*en.eyeX,en.y-en.r*en.eyeY, en.r*en.eyeR, 0, 2*Math.PI);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(en.x+en.r*en.eyeX,en.y-en.r*en.eyeY, en.r*en.eyeR, 0, 2*Math.PI);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(en.x,en.y+en.r/4, en.r/3, 2*Math.PI, Math.PI);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(en.x,en.y, en.r, 0, 2*Math.PI);
				ctx.stroke();
			} else {

				en.eyeR += (0.5-en.eyeR)/5;
				en.op += (0-en.op)/5;
				// en.sp += (5-en.sp)/20;
				en.r += (100-en.r)/20;
				en.spl += (2.5-en.spl)/5;
				ctx.beginPath();
				ctx.arc(en.x-en.r*en.eyeX,en.y-en.r*en.eyeY, en.r*en.eyeR, 0, 2*Math.PI);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(en.x+en.r*en.eyeX,en.y-en.r*en.eyeY, en.r*en.eyeR, 0, 2*Math.PI);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(en.x,en.y+en.r/2, en.r*en.eyeR, Math.PI,2*Math.PI);
				ctx.stroke();

			ctx.beginPath();
			ctx.arc(en.x,en.y, en.r, 0, 2*Math.PI);
			ctx.stroke();
			}

			//spikes
			for (var s = 0; s < 12; s++) {
				var a = (Math.PI*2/12)*s+ga;
				ctx.beginPath();
				ctx.moveTo(en.x+Math.sin(a)*en.r,en.y+Math.cos(a)*en.r);
				ctx.lineTo(en.x+Math.sin(a)*en.r*1.2,en.y+Math.cos(a)*en.r*1.2);
				ctx.lineTo(en.x+Math.sin(a+Math.PI/en.sp)*en.r*en.spl,en.y+Math.cos(a+Math.PI/en.sp)*en.r*en.spl);
				ctx.lineTo(en.x+Math.sin(a-Math.PI/en.sp)*en.r*en.spl,en.y+Math.cos(a-Math.PI/en.sp)*en.r*en.spl);
				ctx.lineTo(en.x+Math.sin(a)*en.r*1.2,en.y+Math.cos(a)*en.r*1.2);
				ctx.stroke();
				// ctx.fill();
			}

			if (Math.abs(0.5-en.eyeR)<0.01) {
				var rand = Math.floor(Math.random()*2);
				if (enemies[i].nuked&&rand==1) {
				enemies.splice(i,1);

				} else {
				enemies[i] = new Enemy();

				}
			}
		}







	    if (danger) {
	    	dangera += 0.05+(100-health)/1000;
	    	if (dangera>=Math.PI) {
	    		dangera=0;
	    	}
	    	ctx.fillStyle='rgba(255,0,0,'+(1-Math.sin(dangera))/4+')';
			ctx.fillRect(0,0,stage.w,stage.h);
			if (health<10) {
		    	ctx.fillStyle='rgba(255,255,0,'+(Math.sin(dangera))+')';
		    	ctx.strokeStyle='rgba(255,255,0,'+(Math.sin(dangera))+')';

			    ctx.lineWidth = 10;
			    ctx.beginPath();
			    ctx.lineJoin = 'round';
			    ctx.moveTo(stage.w/2,stage.h/4);
			    ctx.lineTo(stage.w/2+stage.h/7,stage.h/2);
			    ctx.lineTo(stage.w/2-stage.h/7,stage.h/2);
			    ctx.closePath();
			    ctx.stroke();

			    ctx.font = "bold 130px arial";
			    ctx.textAlign = "center"; 
			    ctx.textBaseline = "middle"; 
			    ctx.fillText("!",stage.w/2,stage.h/2.5);

			    ctx.font = "bold 50px arial";
			    ctx.fillText("LOW HEALTH",stage.w/2,stage.h*0.6);
			}
	    } else {
	    	dangera = 0;
	    }

	    healthprog += (health-healthprog)/5;
	    ctx.fillStyle='#00ffff';
	    ctx.font = "30px arial";
	    ctx.textAlign = "left"; 
	    ctx.textBaseline = "middle"; 
	    ctx.fillText("Health: ",20,40);

	    ctx.fillText("Score: "+score,stage.w-200,40);
	    // ctx.fillText("Step:   "+(Date.now()-steptime),20,120);
	    if (health>30) {
	    	ctx.fillStyle='rgba(0,255,255,0.8)';
		} else {
	    	ctx.fillStyle='rgba(255,0,0,0.8)';
		}
		ctx.lineWidth = 2;
	    ctx.fillRect(130,25,healthprog*3,30);
	    ctx.strokeStyle = "#00ffff";
	    ctx.strokeRect(130,25,300,30);
	    
	    if (health<0) {
	    	gameover = true;
	    }

	} else {	


	    ctx.fillStyle='rgba(0,255,255,0.3)';
	    ctx.fillRect((stage.w-220)/2,stage.h*0.65-25,againprog,50);

    	ctx.fillStyle='#00ffff';
	    ctx.font = "bold 130px arial";
	    ctx.textAlign = "center"; 
	    ctx.textBaseline = "middle"; 
	    ctx.fillText("GAME OVER",stage.w/2,stage.h/3);
	    ctx.font = "bold 50px arial";
	    ctx.fillText("SCORE: "+score,stage.w/2,stage.h/2);

	    ctx.font = "bold 30px arial";

	    ctx.fillText("PLAY AGAIN",stage.w/2,stage.h*0.65);
	    ctx.strokeRect((stage.w-220)/2,stage.h*0.65-25,220,50);

	    againprog += (0-againprog)/50;

	}

		ctx.strokeStyle = "#00ffff";
		ctx.fillStyle = "#00ffff";
			ctx.lineWidth = 2;
		if (fireact) {
			firetm++;
			if(firetm>5) {

				cannons.push(new Cannon(pointer.x+(stage.w-pointer.x)/2.5,pointer.y+(stage.h-pointer.y)/2.5,pointer.x,pointer.y));
				cannons.push(new Cannon(pointer.x-(pointer.x)/2.5,pointer.y+(stage.h-pointer.y)/2.5,pointer.x,pointer.y));


				firetm=0;
			}

			arm.x=Math.floor(Math.random()*50)-25+stage.w;
			arm.y=Math.floor(Math.random()*50)-25+stage.h;
			arm2.x=Math.floor(Math.random()*30)-15;
			arm2.y=Math.floor(Math.random()*30)-15+stage.h;
		} else {
			arm.x=stage.w;
			arm.y=stage.h;
			arm2.x=0;
			arm2.y=stage.h;
		}






		for (var i = 0; i < cannons.length; i++) {
			
			var can = cannons[i];

			can.x += (can.tx-can.x)/5;
			can.y += (can.ty-can.y)/5;
			can.r += (0-can.r)/5;

			ctx.beginPath();
			ctx.arc(can.x,can.y, can.r, 0, 2*Math.PI);
			ctx.fill();


			if (can.r<2&&!gameover) {
				for (var a = 0; a < enemies.length; a++) {
					var en = enemies[a];
					var dx = can.x-en.x;
					var dy = can.y-en.y;
					var dis = dx*dx+dy*dy;
					if (dis<en.r*en.r) {

						// enemies.splice(a,1);
						if (!enemies[a].des) {
						enemies[a].des = true;

						score+=10;

						}
					}

				}
				
			}

			if (can.r<1&&!gameover) {
				for (var a = 0; a < powers.length; a++) {
					var en = powers[a];
					var dx = can.x-en.x;
					var dy = can.y-en.y;
					var dis = dx*dx+dy*dy;
					if (dis<en.r*en.r) {

						if (!en.des) {
							powers[a].des = true;
							if (en.type==1) {
							health = 100;
							}

						}
					}

				}

			}

			if (can.r<1&&gameover) {

				if (can.x>(stage.w-220)/2&&can.y>stage.h*0.65-25&&can.x<(stage.w-220)/2+220&&can.y<stage.h*0.65-25+50) {

					againprog +=1;
					if (againprog>220) {
						newGame();
						gameover = false;
					}
				}
			}
			if (Math.abs(can.tx-can.x)<1) {




				cannons.splice(i,1);
			}


		
		}
		ctx.beginPath();
		ctx.moveTo(pointer.x-20,pointer.y);
		ctx.lineTo(pointer.x+20,pointer.y);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(pointer.x,pointer.y-20);
		ctx.lineTo(pointer.x,pointer.y+20);
		ctx.stroke();

			ctx.beginPath();
			ctx.arc(pointer.x,pointer.y, 8, 0, 2*Math.PI);
			ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(pointer.x+(arm.x-pointer.x)/3,pointer.y+(arm.y-pointer.y)/3+10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2.5,pointer.y+(arm.y-pointer.y)/2.5+10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2,pointer.y+(arm.y-pointer.y)/2+10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.5,pointer.y+(arm.y-pointer.y)/1.5+50);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.2,pointer.y+(arm.y-pointer.y)/1.2+80);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.1,pointer.y+(arm.y-pointer.y)/1.1+100);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(pointer.x+(arm.x-pointer.x)/3-10,pointer.y+(arm.y-pointer.y)/3);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2.5-10,pointer.y+(arm.y-pointer.y)/2.5);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2-10,pointer.y+(arm.y-pointer.y)/2);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.5-50,pointer.y+(arm.y-pointer.y)/1.5);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.2-80,pointer.y+(arm.y-pointer.y)/1.2);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.1-100,pointer.y+(arm.y-pointer.y)/1.1);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(pointer.x+(arm.x-pointer.x)/3,pointer.y+(arm.y-pointer.y)/3-10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2.5,pointer.y+(arm.y-pointer.y)/2.5-10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/2,pointer.y+(arm.y-pointer.y)/2-10);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.5,pointer.y+(arm.y-pointer.y)/1.5-50);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.2,pointer.y+(arm.y-pointer.y)/1.2-80);
		ctx.lineTo(pointer.x+(arm.x-pointer.x)/1.1,pointer.y+(arm.y-pointer.y)/1.1-100);
		ctx.stroke();



		ctx.beginPath();
		ctx.moveTo(arm2.x+pointer.x-(pointer.x)/3,pointer.y+(arm2.y-pointer.y)/3+10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2.5,pointer.y+(arm2.y-pointer.y)/2.5+10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2,pointer.y+(arm2.y-pointer.y)/2+10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.5,pointer.y+(arm2.y-pointer.y)/1.5+50);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.2,pointer.y+(arm2.y-pointer.y)/1.2+80);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.1,pointer.y+(arm2.y-pointer.y)/1.1+100);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(arm2.x+pointer.x-(pointer.x)/3-10,pointer.y+(arm2.y-pointer.y)/3);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2.5-10,pointer.y+(arm2.y-pointer.y)/2.5);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2-10,pointer.y+(arm2.y-pointer.y)/2);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.5-50,pointer.y+(arm2.y-pointer.y)/1.5);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.2-80,pointer.y+(arm2.y-pointer.y)/1.2);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.1-100,pointer.y+(arm2.y-pointer.y)/1.1);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(arm2.x+pointer.x-(pointer.x)/3,pointer.y+(arm2.y-pointer.y)/3-10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2.5,pointer.y+(arm2.y-pointer.y)/2.5-10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/2,pointer.y+(arm2.y-pointer.y)/2-10);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.5,pointer.y+(arm2.y-pointer.y)/1.5-50);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.2,pointer.y+(arm2.y-pointer.y)/1.2-80);
		ctx.lineTo(arm2.x+pointer.x-(pointer.x)/1.1,pointer.y+(arm2.y-pointer.y)/1.1-100);
		ctx.stroke();




		ctx.beginPath();
		ctx.arc(pointer.x+(arm.x-pointer.x)/3,pointer.y+(arm.y-pointer.y)/3, 10, 0, 2*Math.PI);
		ctx.arc(pointer.x+(arm.x-pointer.x)/2.5,pointer.y+(arm.y-pointer.y)/2.5, 10, 0, 2*Math.PI);
		ctx.arc(pointer.x+(arm.x-pointer.x)/2,pointer.y+(arm.y-pointer.y)/2, 10, 0, 2*Math.PI);
		ctx.arc(pointer.x+(arm.x-pointer.x)/1.5,pointer.y+(arm.y-pointer.y)/1.5, 50, 0, 2*Math.PI);
		ctx.arc(pointer.x+(arm.x-pointer.x)/1.2,pointer.y+(arm.y-pointer.y)/1.2, 80, 0, 2*Math.PI);
		ctx.arc(pointer.x+(arm.x-pointer.x)/1.1,pointer.y+(arm.y-pointer.y)/1.1, 100, 0, 2*Math.PI);
		ctx.stroke();

		
		ctx.beginPath();
		ctx.arc(arm2.x+pointer.x-(pointer.x/3),pointer.y+(arm2.y-pointer.y)/3, 10, 0, 2*Math.PI);
		ctx.arc(arm2.x+pointer.x-(pointer.x/2.5),pointer.y+(arm2.y-pointer.y)/2.5, 10, 0, 2*Math.PI);
		ctx.arc(arm2.x+pointer.x-(pointer.x)/2,pointer.y+(arm2.y-pointer.y)/2, 10, 0, 2*Math.PI);
		ctx.arc(arm2.x+pointer.x-(pointer.x)/1.5,pointer.y+(arm2.y-pointer.y)/1.5, 50, 0, 2*Math.PI);
		ctx.arc(arm2.x+pointer.x-(pointer.x)/1.2,pointer.y+(arm2.y-pointer.y)/1.2, 80, 0, 2*Math.PI);
		ctx.arc(arm2.x+pointer.x-(pointer.x)/1.1,pointer.y+(arm2.y-pointer.y)/1.1, 100, 0, 2*Math.PI);
		ctx.stroke();


    	ctx.fillStyle='#004444';
	    ctx.font = "14px arial";
	    ctx.textAlign = "center"; 
	    ctx.textBaseline = "middle"; 
	    ctx.fillText("Coronavirus Shooting Game",stage.w/2,stage.h-20);
}



// ------------------------------------------------------------------------------- events
// ------------------------------------------------------------------------------- events
// ------------------------------------------------------------------------------- events
// ------------------------------------------------------------------------------- events

function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);

	}
	else {
		cancelFullScreen.call(doc);

	}
}


var ox = 0;
var oy = 0;
function mousestart(e) {
	mxpos = (e.pageX-loffset)*scale;
	mypos = (e.pageY-toffset)*scale;
	pointer.x = mxpos;
	pointer.y = mypos;

    fireact = true;



}
function mousemove(e) {
	mxpos = (e.pageX-loffset)*scale;
	mypos = (e.pageY-toffset)*scale;
	pointer.x = mxpos;
	pointer.y = mypos;

	// ball.vY += (mxpos-ox)/15*line.d;

	ox = mxpos;
}

function mouseend(e) {
    fireact = false;

}

var moveX = 0;
var moveY = 0;
var moveZ = 0;


function keydowned(e) {
	// if (e.keyCode==65) {
	// 	moveX = 10;
	// } else if (e.keyCode==68) {
	// 	moveX = -10;
	// }
	// if (e.keyCode==83) {
	// 	moveY = -10;
	// } else if (e.keyCode==87) {
	// 	moveY = 10;
	// }

	// if (e.keyCode==69) {
	// 	moveZ = 10;
	// } else if (e.keyCode==81) {
	// 	moveZ = -10;
	// }
	// console.log(e.keyCode);
}



function keyuped(e) {
	// if (e.keyCode==65) {
	// 	moveX = 0;
	// } else if (e.keyCode==68) {
	// 	moveX = 0;
	// }
	// if (e.keyCode==87) {
	// 	moveY = 0;
	// } else if (e.keyCode==83) {
	// 	moveY = 0;
	// }
	// if (e.keyCode==81) {
	// 	moveZ = 0;
	// } else if (e.keyCode==69) {
	// 	moveZ = 0;
	// }
	// console.log("u"+e.keyCode);
}



window.addEventListener('mousedown', function(e) {
	mousestart(e);
}, false);
window.addEventListener('mousemove', function(e) {
	mousemove(e);
}, false);
window.addEventListener('mouseup', function(e) {
	mouseend(e);
}, false);
window.addEventListener('touchstart', function(e) {
	e.preventDefault();
	mousestart(e.touches[0]);
}, false);
window.addEventListener('touchmove', function(e) {
	e.preventDefault();
	mousemove(e.touches[0]);
}, false);
window.addEventListener('touchend', function(e) {
	e.preventDefault();
	mouseend(e.touches[0]);
}, false);


window.addEventListener('keydown', function(e) {
	keydowned(e);
}, false);
window.addEventListener('keyup', function(e) {
	keyuped(e);
}, false);

// ------------------------------------------------------------------------ stager
// ------------------------------------------------------------------------ stager
// ------------------------------------------------------------------------ stager
// ------------------------------------------------------------------------ stager
function _pexresize() {
	var cw = window.innerWidth;
	var ch = window.innerHeight;
	if (cw<=ch*stage.w/stage.h) {
		portrait = true;
		scale = stage.w/cw;
		loffset = 0;
		toffset = Math.floor(ch-(cw*stage.h/stage.w))/2;
		_pexcanvas.style.width = cw + "px";
		_pexcanvas.style.height = Math.floor(cw*stage.h/stage.w) + "px";
	} else {
		scale = stage.h/ch;
		portrait = false;
		loffset = Math.floor(cw-(ch*stage.w/stage.h))/2;
		toffset = 0;
		_pexcanvas.style.height = ch + "px";
		_pexcanvas.style.width = Math.floor(ch*stage.w/stage.h) + "px";
	}
	_pexcanvas.style.marginLeft = loffset +"px";
	_pexcanvas.style.marginTop = toffset +"px";
}


window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};})();



	var fps = 60;


	var nfcount = 0;

function animated() {
	requestAnimFrame(animated);
	enginestep();

   	nfcount++;
    ctx.fillStyle='#00ffff';
    ctx.font = "12px arial";
    ctx.textAlign = "left"; 
    ctx.fillText("FPS: "+Math.floor(fps),10,stage.h-20);
}

_pexresize();
animated();


function countfps() {
	fps = nfcount;
	nfcount = 0;
}
setInterval(countfps,1000);