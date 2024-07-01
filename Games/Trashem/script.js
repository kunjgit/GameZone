var Trashem = function(){
	var a = 1,
		c = document.getElementById("game"),
		ctx = c.getContext("2d"),
		iLoop,
		iLoopAddKlocek,
		pointer,
		selectObject,
		started = false,
		that = this;

		pointer = (function(){
			var isInArea = false,
				tx=0,
				ty=0,
				x=0,
				y=0,
				_x=0,
				_y=0;

			return { 
				setXY: function (xpos, ypos) {
					x = xpos;
					y = ypos;
					if ((x>=0)&&(y>=0)&&(x<=that.utils.areaWidth)&&(y<=that.utils.areaHeight) ) {
						isInArea = true;
					} else {
						isInArea = false;						
					}
				},
				getXY: function () {
					return {x:x, y:y};
				},
				getPrzesuniecie: function() {
					tx = x - _x;
					ty = y - _y;
					_x = x;
					_y = y;
					return {x:x, y:y, tx:tx, ty:ty};
				},
				resetPrzesuniecie: function() {
					tx = 0;
					ty = 0;
					_x = 0;
					_y = 0;
					isInArea = false;
				}
			}
		})();

		this.isPrzesuwane = false;
		this.trashes = {};

		this.utils = {
			canvasWidth: c.width,
			canvasHeight: c.height,
			canvasOffsetLeft : c.offsetLeft,
		    canvasOffsetTop : c.offsetTop,

			klocMinSize : 60,
			klocMaxSize : 170,

			scrollLeft : document.body.scrollLeft || document.documentElement.scrollLeft,
			scrollTop : document.body.scrollTop || document.documentElement.scrollTop,

			trashBorder : 20,

			areaX: 20,
			areaY: 20,
			areaX2: c.width - 20,
			areaY2: c.height - 20,
			areaWidth: c.width - 40,
			areaHeight: c.height - 40,

			trafionyRelease : 60,
			typ : [ 
/*
				{color : 'rgb(33,3,155)' },
				{color : 'rgb(150,150,253)'},
				{color : 'rgb(50,50,50)'}
*/
				{color : 'rgb(245,184,0)'},
				{color : 'rgb(50,50,50)'},
				{color : 'rgb(64,118,165)'},
				{color : 'rgb(187,43,48)'}
			] 	
		}

		this.score = (function(){
			var points = 0;
			return {
				add : function() {
					++points;
				},
				get : function() {
					return points;
				},
				bonus : function(pts) {
					points += pts;
				},
				reset : function() {
					points = 0;
				},
				save : function() {
				}
			}
		})();


		this.recount = function() {

			var elems = this.STOS.listTrashing.length,
				elMoved = this.STOS.clickedItem,
				move,
				stos = this.STOS.list;

			/* wykonujemy dzialania na wciaganych do smietnikow */
			for ( --elems; elems>=0; --elems) {
				this.STOS.trashItem(this.STOS.listTrashing[elems]);
			}

			/* przesuwamy aktywny */
			if ( elMoved !== undefined ) {

				move = pointer.getXY();
			/* ruch = zaznaczone nie wyjezdzaja poza area */
				stos[elMoved].x = move.x;
				stos[elMoved].y = move.y;
			/* w razie przekroczenia - testujemy zgodnosc typow i pasujace "wciagamy" */
			/* trash: left */
				if ( (stos[elMoved].x < 0) || (!move.isIn && (move.x < 0) ) ) {
					if ( stos[elMoved].typ === this.trashes.trashLeft.typ ) {
						stos[elMoved].setAsSlidingToTrash(elMoved,'left');
						that.messages.checkBonus('left',stos[elMoved].x, stos[elMoved].y, stos[elMoved].sizex, stos[elMoved].sizey);
					} else {
						stos[elMoved].x = 0;
					}
				}
			/* trash: right */
				if ( ( (stos[elMoved].x + stos[elMoved].sizex)  > this.utils.areaWidth )
					|| (!move.isIn && (move.x > this.utils.areaWidth - stos[elMoved].sizex) ) ) {
					if ( stos[elMoved].typ === this.trashes.trashRight.typ ) {
						stos[elMoved].setAsSlidingToTrash(elMoved,'right');
						that.messages.checkBonus('right',stos[elMoved].x, stos[elMoved].y, stos[elMoved].sizex, stos[elMoved].sizey);
					} else {
						stos[elMoved].x = this.utils.areaWidth - stos[elMoved].sizex;
					}
				}
			/* trash: top */
				if ( (stos[elMoved].y < 0) || (!move.isIn && (move.y < 0) ) ) {
					if ( stos[elMoved].typ === this.trashes.trashTop.typ ) {
						stos[elMoved].setAsSlidingToTrash(elMoved,'up');
						that.messages.checkBonus('up',stos[elMoved].x, stos[elMoved].y, stos[elMoved].sizex, stos[elMoved].sizey);
					} else {
						stos[elMoved].y = 0;
					}
				}
			/* trash: bottom */
				if ( ( (stos[elMoved].y + stos[elMoved].sizey)  > this.utils.areaHeight ) 
					|| (!move.isIn && (move.y > this.utils.areaHeight - stos[elMoved].sizey) ) ) {
					if ( stos[elMoved].typ === this.trashes.trashBottom.typ ) {
						stos[elMoved].setAsSlidingToTrash(elMoved,'down');
						that.messages.checkBonus('down',stos[elMoved].x, stos[elMoved].y, stos[elMoved].sizex, stos[elMoved].sizey);
					} else {
						stos[elMoved].y = this.utils.areaHeight - stos[elMoved].sizey;
					}
				}

			}

			/* messages */

			this.messages.persist();

		};

		this.redraw = function() {
			var i,
				lnStos = this.STOS.list.length,
				item,
				messagesLen;
				; 
			
			// clear field
			ctx.clearRect(0, 0, c.width, c.height);

			// draw items on field;
			ctx.save();
			ctx.translate(this.utils.trashBorder,this.utils.trashBorder);
			for ( i=0; i<lnStos; i++ ) {
				if ( this.STOS.list[i] === undefined ) {
					continue;
				}
				/* skip moved item */
				if ( this.STOS.list[i] === this.STOS.clickedItem ) {
					continue;
				}

				item = this.STOS.list[i];

				ctx.save();
				ctx.fillStyle = item.color;
				if (item.trafiony === true) {
					ctx.lineJoin = "round";
					ctx.strokeStyle = 'rgb(255,100,100)';
					ctx.lineWidth = 5;
					ctx.strokeRect(item.x, item.y, item.sizex, item.sizey);
				}

				ctx.fillRect(item.x, item.y, item.sizex, item.sizey);
				ctx.restore();

			}

			/* draw moved item as the last */
			if (this.STOS.clickedItem !== undefined) {
				ctx.save();
				item=this.STOS.list[this.STOS.clickedItem];
				ctx.fillStyle = item.color;
				if (item.trafiony === true) {
					ctx.lineJoin = "round";
					ctx.strokeStyle = 'rgb(255,100,100)';
					ctx.lineWidth = 5;
					ctx.strokeRect(item.x, item.y, item.sizex, item.sizey);
				}
				ctx.fillRect(item.x, item.y, item.sizex, item.sizey);
				ctx.restore();
			}

			ctx.restore();

			//draw trash - top
			ctx.save();
			ctx.fillStyle = this.trashes.trashTop.color;
			ctx.fillRect(this.trashes.trashTop.x, this.trashes.trashTop.y, this.trashes.trashTop.width, this.trashes.trashTop.height);
			ctx.restore();

			//draw trash - right
			ctx.save();
			ctx.fillStyle = this.trashes.trashRight.color;
			ctx.fillRect(this.trashes.trashRight.x, this.trashes.trashRight.y, this.trashes.trashRight.width, this.trashes.trashRight.height);
			ctx.restore();

			//draw trash - bottom
			ctx.save();
			ctx.fillStyle = this.trashes.trashBottom.color;
			ctx.fillRect(this.trashes.trashBottom.x, this.trashes.trashBottom.y, this.trashes.trashBottom.width, this.trashes.trashBottom.height);
			ctx.restore();

			//draw trash - left
			ctx.save();
			ctx.fillStyle = this.trashes.trashLeft.color;
			ctx.fillRect(this.trashes.trashLeft.x, this.trashes.trashLeft.y, this.trashes.trashLeft.width, this.trashes.trashLeft.height);
			ctx.restore();


			// messages
			messagesLen = this.messages.lista.length; 
			for ( --messagesLen; messagesLen>=0; --messagesLen ) {
				ctx.save();

				ctx.fillStyle = '#f00';
				ctx.font = ' 20px sans-serif';
				ctx.textBaseline = 'bottom';

				switch ( this.messages.lista[messagesLen].dir) {
					case 'up':
						ctx.fillText(this.messages.lista[messagesLen].text, 
							this.messages.lista[messagesLen].pos.x,
							this.messages.lista[messagesLen].duration/2);
					break;
					case 'left':
						ctx.fillText(this.messages.lista[messagesLen].text, 
							this.messages.lista[messagesLen].duration/2, 
							this.messages.lista[messagesLen].pos.y);
					break;
					case 'right':
						ctx.fillText(this.messages.lista[messagesLen].text, 
							this.utils.canvasWidth - this.messages.lista[messagesLen].duration,
							this.messages.lista[messagesLen].pos.y);
					break;
					case 'down':
						ctx.fillText(this.messages.lista[messagesLen].text, 
							this.messages.lista[messagesLen].pos.x,
							this.utils.canvasHeight - this.messages.lista[messagesLen].duration/2);
					break;
				}

				ctx.restore();
			}

			/* score */
			ctx.save();
				ctx.fillStyle = '#555';
				ctx.font = ' 15px sans-serif';
				ctx.textBaseline = 'bottom';
				ctx.fillText('score: '+this.score.get(), 
					22, this.utils.canvasHeight-22
				);
			ctx.restore();
		};






		this.setPointerPos = function (event) {
			var x,y, touchedItem;
			if ( event.touches === undefined ) {
				x = (window.event) ? event.pageX : event.clientX + TRASHEM.utils.scrollLeft;
				y = (window.event) ? event.pageY : event.clientY + TRASHEM.utils.scrollTop;
			} else {
		        x = event.touches[0].pageX;
		        y = event.touches[0].pageY;
				event.preventDefault();
			}

	        x -= TRASHEM.utils.canvasOffsetLeft;
	        x -= TRASHEM.utils.areaX;
	
	        y -= TRASHEM.utils.canvasOffsetTop;
	        y -= TRASHEM.utils.areaY;

			pointer.setXY(x,y);
		}

		this.clickDown = function (event) {
			var x,y;
			if (started) {
				if ( event.touches === undefined ) {
						x = (window.event) ? event.pageX : event.clientX + TRASHEM.utils.scrollLeft;
						y = (window.event) ? event.pageY : event.clientY + TRASHEM.utils.scrollTop;
				} else {
			        x = event.touches[0].pageX;
			        y = event.touches[0].pageY;
					event.preventDefault();
				}

		        x -= TRASHEM.utils.canvasOffsetLeft;
		        x -= TRASHEM.utils.areaX;
		
		        y -= TRASHEM.utils.canvasOffsetTop;
		        y -= TRASHEM.utils.areaY;

			    pointer.setXY(x,y);

				/* x,y: relatywnie na area */
				if ( (x>0) && (x<TRASHEM.utils.areaWidth)
					&& (y>0) && (y<TRASHEM.utils.areaHeight) ) {
		        	that.STOS.markClickedItems(x,y);
				}
			}
		};

		this.clickRelease = function (event) {
			if ( TRASHEM.isPrzesuwane ) {
				TRASHEM.STOS.unmarkClickedItem();
			}
		};


		this.messages = (function(){
			var lista = [],
				duration = 100,
				setTextPos;


			return {
				lista : lista,
				checkBonus : function(dir,x,y,sizex,sizey) {
					var nr = TRASHEM.STOS.listTrashing.length;
					if (nr === 2) {
						lista.push({
							typ:2,
							dir:dir,
							pos: that.messages.setTextPos(dir,x,y,sizex,sizey),
							duration:duration,
							text:'+20'
						});
						that.score.bonus(20);
					} else if (nr === 3) {
						lista.push({
							typ:3,
							dir:dir,
							pos: that.messages.setTextPos(dir,x,y,sizex,sizey),
							duration:duration,
							text:'+60'
						});
						that.score.bonus(60);
					} else if (nr === 4) {
						lista.push({
							typ:4,
							dir:dir,
							pos: that.messages.setTextPos(dir,x,y,sizex,sizey),
							duration:duration,
							text:'+120'
						});
						that.score.bonus(120);
					} else if (nr === 5) {
						lista.push({
							typ:4,
							dir:dir,
							duration:duration,
							text:'+300'
						});
						that.score.bonus(300);
					} else if (nr > 5) {
						lista.push({
							typ:4,
							dir:dir,
							duration:duration,
							text:'+1000'});
						that.score.bonus(1000);
					}
				},

				persist : function() {
					var len = lista.length;
					for (--len; len >= 0; --len) {
						if ( --this.lista[len].duration < 0 ) {
							this.lista.splice(len,1);
						}
					} 
				},

				reset : function() {
					lista.splice(0, lista.length);
				},

				setTextPos : function(dir,x,y,sizex,sizey) {
					var xpos,ypos;

					switch (dir) {
						case 'up':
							xpos = x + sizex/2;
							ypos = 0;
						break;
						case 'left':
							xpos = 0;
							ypos = y+sizey/2;
						break;
						case 'right':
							xpos = 0;
							ypos = y+sizey/2;
						break;
						case 'down':
							xpos = x + sizex/2;
							ypos = 0;
						break;
					}

					return {x:xpos,y:ypos};
				}

			}

		})();


		this.loop = function() {
			that.recount();
			that.redraw();
		};

		this.play  = function(){
			if (!started) {
			
				document.body.addEventListener('mousemove', that.setPointerPos, false)
				c.addEventListener('mousedown', that.clickDown, false)
				document.body.addEventListener('mouseup', that.clickRelease, false)

				document.body.addEventListener('touchmove', that.setPointerPos, false)
				c.addEventListener('touchstart', that.clickDown, false)
				document.body.addEventListener('touchend', that.clickRelease, false)


				this.trashes.trashTop = new Trash;
				this.trashes.trashTop.generateTyp(0);
				this.trashes.trashTop.setSizes(this.utils.trashBorder, 0, this.utils.areaWidth, this.utils.trashBorder);

				this.trashes.trashRight = new Trash;
				this.trashes.trashRight.generateTyp(1);
				this.trashes.trashRight.setSizes(this.utils.areaX2, this.utils.areaY, this.utils.trashBorder, this.utils.areaHeight);
				
				this.trashes.trashBottom = new Trash;
				this.trashes.trashBottom.generateTyp(2);
				this.trashes.trashBottom.setSizes(this.utils.trashBorder, this.utils.areaX2, this.utils.areaWidth, this.utils.trashBorder);
				
				this.trashes.trashLeft = new Trash;
				this.trashes.trashLeft.generateTyp(3);
				this.trashes.trashLeft.setSizes(0, this.utils.trashBorder, this.utils.trashBorder, this.utils.areaWidth);

				iLoop = setInterval(this.loop, 1000/30);
				iLoopAddKlocek = setInterval(function(){
						klocek = new Klocek;
						klocek.generate();
						that.STOS.list.push(klocek);
					}, 1000);
				started = true;
			}
		};

		this.stop = function(){
			if (started) {
				clearInterval(iLoop);
				clearInterval(iLoopAddKlocek);
				started = !started;
			} else {
				that.play();
			}
		};

		this.reset = function(){
				clearInterval(iLoop);
				clearInterval(iLoopAddKlocek);
				ctx.clearRect(0, 0, c.width, c.height);
				that.STOS.usunWszystkie(); 
				that.score.reset();
				that.messages.reset();
				pointer.resetPrzesuniecie();
				started = false;
		};

		this.listen = function() {
			window.addEventListener('keydown',function(e){
				switch (e.keyCode) {
					case 13:
						TRASHEM.play();
						break;
					case 27:
						TRASHEM.reset();
						break;
					case 32:
						TRASHEM.stop();
						break;
				}
			},false);
			document.getElementById('start').ontouchstart = function() {
				TRASHEM.play();
			}
			document.getElementById('pauza').ontouchstart = function() {
				TRASHEM.stop();
			}
			document.getElementById('reset').ontouchstart = function() {
				TRASHEM.reset();
			}
			document.getElementById('start').onmousedown = function() {
				TRASHEM.play();
			}
			document.getElementById('pauza').onmousedown = function() {
				TRASHEM.stop();
			}
			document.getElementById('reset').onmousedown = function() {
				TRASHEM.reset();
			}
		};

		this.paingBg = function() {
			ctx.clearRect(0, 0, c.width, c.height);

			ctx.fillStyle = '#ff8834';
			ctx.fillRect(30,40, 80,120);

		}
	};









var Stos = function() {
	this.list = [];
	this.listTrashing = [];
	this.clickedItem;
}
Stos.prototype.usunWszystkie = function() {
	this.list.splice(0, this.list.length);
	this.listTrashing.splice(0, this.listTrashing.length);
	delete this.clickedItem;
}
Stos.prototype.detectIsClicked = function(clckx,clcky,objX,objY,objWidth,objHeight) {
	if ( (clckx>objX) && (clcky>objY) && (clckx<(objX+objWidth)) && (clcky<(objY+objHeight)) ) {
		return true;
	} else {
		return false;
	}
};
Stos.prototype.markClickedItems = function(x,y) {
	var elem,
		lenTr,
		stos = this.list;
	
	if ( TRASHEM.isPrzesuwane === false) {
		elem = this.list.length;
		for (--elem; elem>=0; --elem)
		{
			/* oznaczamy tylko pierwszy trafiony - bez aktualnie usuwanych */
			if ( (stos[elem] !== undefined) && !stos[elem].slidingToTrash && this.detectIsClicked(x,y,stos[elem].x,stos[elem].y,stos[elem].sizex, stos[elem].sizey) ) {
				stos[elem].trafiony = true;
				this.clickedItem = elem;
				TRASHEM.isPrzesuwane = true;
				break;
			}		
		}
	}
}

Stos.prototype.unmarkClickedItem = function() {
	TRASHEM.STOS.list[TRASHEM.STOS.clickedItem].trafiony = false;
	delete TRASHEM.STOS.clickedItem;
	TRASHEM.isPrzesuwane = false;
}

Stos.prototype.trashItem = function(el) {
	var dir,
		lenTr;

	if ( this.list[el].toDel ) {
		dir = this.list[el].trashDir;
		if( dir === 'up' ) {
			TRASHEM.trashes.trashTop.delUsuwany();
			if ( TRASHEM.trashes.trashTop.usuwanych === 0 ) {
				TRASHEM.trashes.trashTop.generateTyp();
			}
		} else if ( dir === 'right' ) {
			TRASHEM.trashes.trashRight.delUsuwany();
			if ( TRASHEM.trashes.trashRight.usuwanych === 0 ) {
				TRASHEM.trashes.trashRight.generateTyp();
			}
		} else if ( dir === 'down' ) {
			TRASHEM.trashes.trashBottom.delUsuwany();
			if ( TRASHEM.trashes.trashBottom.usuwanych === 0 ) {
				TRASHEM.trashes.trashBottom.generateTyp();
			}
		} else if ( dir === 'left' ) {
			TRASHEM.trashes.trashLeft.delUsuwany();
			if ( TRASHEM.trashes.trashLeft.usuwanych === 0 ) {
				TRASHEM.trashes.trashLeft.generateTyp();
			}
		}

		/* usuwamy z listy wyrzucanych */
		this.listTrashing.splice(this.listTrashing.indexOf(el),1);

		/* usuwamy klocek */
		delete this.list[el];
	} else {
		this.list[el].slideToTrash(this.list[el].trashDir);
	}
}


Trash = function() {
	this.color;
	this.height;
	this.typ;
	this.x;
	this.y;
	this.usuwanych = 0;
	this.width;
}
Trash.prototype.generateTyp = function(nr) {
	if (nr !== undefined) {
		this.typ = nr;
	} else {
		this.typ = Math.floor(Math.random()*TRASHEM.utils.typ.length);
	}
	this.color = TRASHEM.utils.typ[this.typ].color;
}
Trash.prototype.setSizes = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
Trash.prototype.addUsuwany = function() {
	this.usuwanych = this.usuwanych+1;
}
Trash.prototype.delUsuwany = function() {
	this.usuwanych = this.usuwanych-1;
}






Klocek = function() {
	this.x = 0;
	this.y = 0;
	this.sizex = 0;
	this.sizey = 0;
	this.toDel = false;
	this.slidingToTrash = false;
	this.trashDir;
	this.typ;
	this.trafiony = false;
}
Klocek.prototype.generate = function() {
	var maxsize = TRASHEM.utils.klocMaxSize,
		minsize = TRASHEM.utils.klocMinSize;

	this.sizex = Math.ceil(Math.random()*maxsize);
	if ( this.sizex < minsize ) {
		this.sizex = minsize;
	}

	this.sizey = Math.ceil(Math.random()*maxsize);
	if ( this.sizey < minsize ) {
		this.sizey = minsize;
	}

	/* x,y relatywnie na area */
	this.x = Math.floor( Math.random()*(TRASHEM.utils.areaWidth-(this.sizex)) );
	this.y = Math.floor( Math.random()*(TRASHEM.utils.areaHeight-this.sizey) );

	this.setTyp();
}
Klocek.prototype.setAsSlidingToTrash = function(elNr, dir) {
	this.slidingToTrash = 1;
	this.trashDir = dir;
	this.trafiony = false;

	if (dir === 'up') {
		TRASHEM.trashes.trashTop.addUsuwany();
	} else if (dir === 'right') {
		TRASHEM.trashes.trashRight.addUsuwany();
	} else if (dir === 'down') {
		TRASHEM.trashes.trashBottom.addUsuwany();
	} else if (dir === 'left') {
		TRASHEM.trashes.trashLeft.addUsuwany();
	}
	TRASHEM.STOS.listTrashing.push(elNr);
	TRASHEM.isPrzesuwane = false;
	delete TRASHEM.STOS.clickedItem;
}
Klocek.prototype.setTyp = function() {
	this.typ = Math.floor(Math.random()*TRASHEM.utils.typ.length);
	this.color = TRASHEM.utils.typ[this.typ].color;
}
Klocek.prototype.slideToTrash = function(dir) {
	var result;
	if (dir === 'up') {
		this.sizey = this.sizey-1;
		if (this.sizey<=0 ) {
			this.toDel = true;
		}
	} else if (dir === 'right') {
		this.sizex = this.sizex-1;
		this.x = this.x+1;
		if (this.sizex<=1) {
			this.toDel = true;
		}
	} else if (dir === 'down') {
		this.sizey = this.sizey-1;
		this.y = this.y+1;
		if (this.sizey<=1) {
			this.toDel = true;
		}
	} else if (dir === 'left') {
		this.sizex = this.sizex-1;
		if (this.sizex<=1) {
			this.toDel = true;
		}
	}
	result = TRASHEM.score.add();
}

var TRASHEM = new Trashem();
TRASHEM.listen();
TRASHEM.STOS = new Stos();
