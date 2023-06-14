// animationFrame API
var requestAnimFrame = window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback){
                window.setTimeout(callback,1000/60);
            };
})();

// Vibration api
navigator.vibrate = (function(){
    return navigator.vibrate 
        || navigator.mozVibrate
        || navigator.webkitVibrate
        || navigator.oVibrate
        || navigator.msVibrate
        || new Function();
})();

// Creating a fake console if needed
// It could be better to use a DOM-based console in some cases.
var console = (function(){
    return window.console
            || { 
                log : new Function(),
                debug : new Function(),
                warn : new Function(),
                error : new Function(),
                clear : new Function()
             };
})();

var cycleManager = {
    init : function(cycle,fpsMin){
        this.pause = false;
        this.oncycle = cycle;
        
        // Gestion du focus
        this.focus = true;
        window.onfocus = function(){
            cycleManager.focus = true;
        }
        window.onblur = function(){
            cycleManager.focus = false;
        };
        
        this.lastCycle = Date.now();
        this.fpsMin = fpsMin || 10;
        this.framesUntilNextStat = 0;
        this.lastStat = 0;
        this.fakeLag = false;
        this.fps = 0;
        
        (function(){
            cycleManager.cycle();
            if(cycleManager.fakeLag){
                setTimeout(arguments.callee,1000/this.fpsMin);
            }else{
                requestAnimFrame(arguments.callee);
            }
        })();
        
        this.init = null;
    },
    cycle : function(){
        var now = Date.now();
        var elapsed = Math.min((now - this.lastCycle) / 1000,1/this.fpsMin);
        this.lastCycle = now;
        
        // Triggering cycle only if not paused and with focus
        if(this.focus && !this.pause){
            try{
                this.oncycle(elapsed);
            }catch(e){
                console.log('Error: ' + e + ' - ');
                throw e;
            }
            
            // Calculating FPS
            this.framesUntilNextStat--;
            if(this.framesUntilNextStat <= 0){
                this.framesUntilNextStat = 60; // Scheduling the next statistics
                this.fps = ~~(60 * 1000 / (Date.now() - this.lastStat + elapsed));
                this.lastStat = Date.now();
            }
        }
    }
}

/**
 * Resizer : handles screen size for a specific element.
 */
var resizer = {
    init : function(width,height,element,desktop){
        // Storing parameters
        this.enabled = Util.isTouchScreen() || desktop;
        this.targetWidth = width;
        this.targetHeight = height;
        this.element = element;
        
        // Storing dimensions and scale
        this.dimensions = {
            width : width,
            height : height
        };
        this.scale = 1;
        
        // No need to resize on a desktop computer
        if(Util.isTouchScreen() || desktop){
            DOM.on(window,'resize orientationchange',function(){
                resizer.resize();
            });
            this.resize();
            this.toResize = null;
        }
        
        // Just freeing some memory
        this.init = null;
    },
    resize : function(){
        // If a resizing is already planned, no need to do it another time
        if(!this.toResize && this.enabled){        
            // Scheduling a resizing with a short delay
            this.toResize = setTimeout(function(){
                if(!resizer.enabled) return;
                
                window.scrollTo(0,1); // Skipping the address bar
                
                resizer.toResize = null;
                resizer.dimensions = DOM.fitScreen(resizer.element,resizer.targetWidth / resizer.targetHeight);
                resizer.scale = (resizer.dimensions.height / resizer.targetHeight);
            },100);
        }
    }
};
var DOM = {
    /**
     * Returns the element matching the specified id.
     */
    get : function(el){
        return (el == document || el == window || el instanceof HTMLElement ? el : document.getElementById(el));
    },
    /**
     * Adds an event listener to the specified element.
     */
    on : function(el,evt,handler){
        var split = evt.split(' ');
        for(var i in split){
            this.get(el).addEventListener(split[i],handler,false);
        }
    },
    /**
     * Removes the specified event handler.
     */
    un : function(el,evt,handler){
        var split = evt.split(' ');
        for(var i in split){
            this.get(el).removeEventListener(split[i],handler,false);
        }
    },
    /**
     * Shows the specified element.
     */
    show : function(el){
        this.get(el).style.display = 'block';
    },
    /**
     * Hides the specified element.
     */
    hide : function(el){
        this.get(el).style.display = 'none';
    },
    /**
     * Creates an element of the specified type.
     */
    create : function(type){
        return document.createElement(type);
    },
    /**
     * Makes the specified element fit screen size.
     * Once the window is resized, you will need to call this function
     * again.
     */
    fitScreen : function(element,ratio){
        var clientRatio = window.innerWidth / window.innerHeight;
        
        var width, height;
        if(clientRatio <= ratio){
            width = window.innerWidth;
            height = width / ratio;
        }else{
            height = window.innerHeight;
            width = height * ratio;
        }
        
        element = DOM.get(element);
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        
        // Returning the element's size
        return {
            width : width,
            height : height
        };
    },
    /**
     * Fades the element in
     */
    fadeIn : function(element,duration,callback){
        element = this.get(element);
        duration = duration || 1000;
        
        this.show(element); // in case it was hidden
        element.style.opacity = 0;
        Util.interpolate(element.style,{opacity:1},duration,callback);
    },
    /**
     * Fades the element out
     */
    fadeOut : function(element,duration,callback){
        element = this.get(element);
        duration = duration || 1000;
        
        this.show(element); // in case it was hidden
        element.style.opacity = 1;
        Util.interpolate(element.style,{opacity:0},duration,function(){
            DOM.hide(element);
            if(callback)
                callback();
        });
    },
    /**
     * Shows a message to the user
     */
    notify : function(htmlMessage,duration,container){
        container = container ? this.get(container) : document.body;
        
        this.notification = this.notification || (function(){
            var block = DOM.create('div');
            container.appendChild(block);
            DOM.applyStyle(block,{
                zIndex : 999999,
                position : 'absolute',
                bottom : '10px',
                width : '100%',
                textAlign : 'center'
            });
            
            var message = DOM.create('span');
            block.appendChild(message);
            DOM.applyStyle(message,{
                backgroundColor :'rgba(0,0,0,0.7)',
                border : '1px solid white',
                borderRadius : '3px',
                margin : 'auto',
                color : 'white',
                padding : '2px',
                paddingLeft : '10px',
                paddingRight : '10px',
                width : '50%',
                fontSize : '0.7em',
                boxShadow : '0px 0px 2px black'
            });
            
            return {
                block : block,
                message : message,
                queue : [],
                add : function(message,duration){
                    this.queue.push({
                        message : message,
                        duration : duration
                    });
                    
                    if(this.queue.length == 1){
                        this.applyOne();
                    }
                },
                applyOne : function(){
                    var notif = this.queue[0];
                    
                    this.message.innerHTML = notif.message;
                    
                    DOM.fadeIn(this.block,500);
                    setTimeout(function(){
                        DOM.fadeOut(DOM.notification.block,500,function(){
                            DOM.notification.queue.shift();
                            if(DOM.notification.queue.length > 0){
                                DOM.notification.applyOne();
                            }
                        });
                    },notif.duration + 500);
                }
            }
        })();
        
        duration = duration || 3000;
        
        this.notification.add(htmlMessage,duration);
    },
    /**
     * Applying a series of CSS properties
     */
    applyStyle : function(element,style){
        element = this.get(element);
        for(var i in style){
            element.style[i] = style[i];
        }
    }
};


// Utility class
var Util = {
    /**
     * Returns n if between min and max, min if lower than min, max if higher than max.
     */
    limit : function(n,min,max){
        if(n < min)
            return min;
        else if(n > max)
            return max;
        else
            return n;
    },
    /**
     * Returns true if the client is using a touchscreen.
     */
    isTouchScreen : function(){
        return (
            'ontouchstart' in window 
            || window.DocumentTouch && document instanceof DocumentTouch
            || 'ontouchstart' in document.documentElement 
            || window.location.search.indexOf('touch') >= 0 // Allows you to test your touchscreen-specific code on a regular PC
        );
    },
    /**
     * Removing duplicate elements from an array
     */
    arrayUnique : function(a){
        for(var i = 0 ; i < a.length ; i++){
            var j = i+1;
            while(a[j]){
                if(a[i] == a[j]){
                    a.splice(j,1);
                }else{
                    j++;
                }
            }
        }
    },
    interpolate : function(obj,props,duration,callback){
        // Getting the state before the interpolation
        var before = {};
        for(var i in props){
            before[i] = parseFloat(obj[i]);
        }
        
        var tStart = Date.now();
        (function(){
            var now = Date.now();
            var prct = Math.min(1,(now - tStart) / duration);
            
            // Updating each property
            for(var i in props){
                obj[i] = prct * (props[i] - before[i]) + before[i];
            }
            
            if(prct < 1){
                requestAnimFrame(arguments.callee);
            }else{
                if(callback){
                    callback.call(obj);
                }
            }
        })();
    },
    /**
     * Setting and getting cookies
     */
    cookie : {
        /**
         * Setting a cookie with the specified key with the specified TTL
         */
        set : function(name,value,ttl){
            // By default, a cookie is available for one year
            if(ttl == undefined)
                ttl = 1000 * 3600 * 24 * 365;
            
            document.cookie = name + "=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            
            var expires = new Date();
            expires.setTime(expires.getTime() + ttl);
            
            document.cookie = [
                name+'='+value+'; ',
                'expires='+expires.toGMTString() +'; ',
                'path=/'
            ].join('');
        },
        /**
         * Getting the value of a cookie with the specified key.
         */
        get : function(name){
            var cookie = document.cookie.split('; ');
            for(var i in cookie){
                var spl = cookie[i].split('=');
                if(spl.length == 2 && spl[0] == name){
                    return spl[1];
                }
            }
            return undefined;
        }
    }
};

var can,ctx,thunderInterval;

var P = {
	width : 320,
	height : 460,
	floorY : 340,
	rainWidth : 40,
	presentHealthLossPerSecond : 0.8,
	protectionRadius : 20
}

var clouds = [];
var cars = [];
var npcs = [];
var items = [];

var controller = {
	leftKeys : [37,65,81],
	rightKeys : [39,68],
	init : function(){
		document.onkeydown = function(e){
			if(controller.leftKeys.indexOf(e.keyCode) != -1){
				controller.movesLeft = true;
			}
			if(controller.rightKeys.indexOf(e.keyCode) != -1){
				controller.movesRight = true;
			}
			
			if(game.state == 'menu' && e.keyCode == 13){
				game.start();
			}
		}
		document.onkeyup = function(e){
			if(controller.leftKeys.indexOf(e.keyCode) != -1){
				controller.movesLeft = false;
			}
			if(controller.rightKeys.indexOf(e.keyCode) != -1){
				controller.movesRight = false;
			}
		}
		document.ontouchstart = document.ontouchmove = function(e){
			e.preventDefault();
			
			if(game.state == 'menu'){
				game.start();
				controller.lock = true;
			}
			
			controller.movesLeft = controller.movesRight = false;
			if(!controller.lock){
				if(e.touches[0].pageX < window.innerWidth / 2){
					controller.movesLeft = true;
				}else{
					controller.movesRight = true;
				}
			}
		}
		document.ontouchend = function(){
			controller.movesLeft = controller.movesRight = false;
			controller.lock = false;
		}
	}
}

var game = {
	init : function(){
        window.scrollTo(0,1);
    
		this.controllable = false;
		this.state = 'menu';
        this.mobile = Util.isTouchScreen();
		
		controller.init();
		player.init();
		
		this.t = 0;
	
		cycleManager.init(function(e){
			game.cycle(e);
		});
		
		resizer.init(P.width,P.height,'viewport');
		
		if(!this.mobile){
			// Ajout du CSS spécifique au desktop
			var link = document.createElement("link")
			link.setAttribute("rel","stylesheet")
			link.setAttribute("type","text/css")
			link.setAttribute("href",'css/desktop.css')
			document.head.appendChild(link)
		}
        
        // Adding useless messages to distract the player
        var msgs = [
            'Hey, is that distracting?',
            'Brian likes chocolate',
            'Actually, Brian has no girlfriend',
            'Brian hates rain',
            'The present cost $13',
            'The present weights 13kg',
            'Brian does have a soul'
        ];
        var distract = function(){
            if(game.state == 'game' && game.msgTime <= 0){
                game.showMessage(msgs[~~(Math.random() * msgs.length)]);
            }
            setTimeout(arguments.callee,15000 + Math.random() * 10000);
        }
        distract();
        
        // Highscore
        this.highScore = 0;
        
        var cookie = Util.cookie.get('blb-best');
        if(cookie){
            this.highScore = parseInt(cookie) || 0;
        }
        
        var cookieLast = Util.cookie.get('blb-last') || Date.now();
        var now = Date.now();
        if((now - cookieLast) > 1000 * 60 * 60){
            alert('Hey, good to see you back, I knew you would love it!');
        }
        Util.cookie.set('blb-last',now);
	},
	start : function(){
		window.scrollTo(0,1);
		
		this.controllable = true;
		this.state = 'game';
		this.generatedClouds = 0;
		this.generatedNPCs = 0;
		this.nextNPC = 6;
		this.nextCar = 3;
		this.nextCloud = 12;
        this.nextItem = 15;
		this.time = 0;
        this.shakeTime = 0;
	
		player.init();
		
		player.salutes = true;
		
		npcs = [];
        items = [];
		
		this.showMessage('Meet Brian');
		setTimeout(function(){
			game.showMessage('Brian just bought a present for his gf');
		},3000);
		setTimeout(function(){
			game.showMessage('Oh no, it\'s raining today!');
			game.thunder();
			
			thunderInterval = setInterval(function(){
				game.thunder();
			},15000);
			
			game.addNPC();
		},6000);
		setTimeout(function(){
			game.showMessage('Protect the present from the rain!');
		},9000);
		setTimeout(function(){
			game.showMessage('Use the umbrellas!');
		},12000);
		
		if(this.mobile){
			DOM.notify('Touch left or right to move Brian',3000,'viewport');
		}else{
			DOM.notify('Use arrow keys to move',3000,'viewport');
		}
	},
	end : function(){
		// Avoiding multiple calls to end()
		if(this.state != 'game')
			return;
		
		window.scrollTo(0,1);
		
		clearInterval(thunderInterval);
		
		this.state = 'end';
		this.controllable = false;
		
		this.showMessage('Oh no! The present is ruined!');
		setTimeout(function(){
			game.showMessage('You protected it for ' +  ~~game.time + ' seconds');
		},3000);
		
		setTimeout(function(){
			game.showMessage('Brian\'s girlfriend is going to be very angry!');
		},6000);
		setTimeout(function(){
			game.state = 'menu';
		},9000);
        
        // Setting the high score
        this.highScore = Math.max(this.highScore,this.time);
        Util.cookie.set('blb-best',this.highScore);
	},
	cycle : function(elapsed){
		with(ctx){
            save();
            
            this.shakeTime -= elapsed;
            if(this.shakeTime > 0){
                translate(P.width / 2,P.height / 2);
                rotate(Math.random() * Math.PI / 16 - Math.PI / 32);
                translate(-P.width / 2,-P.height / 2);
            }
        
			this.t += elapsed;
			
			if(this.state == 'game'){
				this.time += elapsed;
			}
			
			drawImage(bgImage,0,0);
			
			player.cycle(elapsed);
			
			// Splitting cycle and drawing in case of deleting elements
			for(var i = clouds.length - 1 ; i >= 0 ; i--){
				clouds[i].cycle(elapsed);
			}
			for(var i = cars.length - 1 ; i >= 0 ; i--){
				cars[i].cycle(elapsed);
			}
			for(var i = npcs.length - 1 ; i >= 0 ; i--){
				npcs[i].cycle(elapsed);
			}
			for(var i = items.length - 1 ; i >= 0 ; i--){
				items[i].cycle(elapsed);
			}
			
			for(var i = clouds.length - 1 ; i >= 0 ; i--){
				clouds[i].draw();
			}
			for(var i = npcs.length - 1 ; i >= 0 ; i--){
				npcs[i].draw();
			}
			for(var i = items.length - 1 ; i >= 0 ; i--){
				items[i].draw();
			}
			player.draw();
			for(var i = cars.length - 1 ; i >= 0 ; i--){
				cars[i].draw();
			}
			
			shadowColor = '#000';
			shadowOffsetX = 2;
			shadowOffsetY = 2;
			shadowBlur = 0;
			
			if(this.state == 'menu'){
				fillStyle = '#ffffff';
				font = '10pt Arial';
				textAlign = 'left';
				textBaseline = 'middle';
				
				fillText('Buys his girlfriend a present',(P.width - logoImage.width) / 2,140);
				
				if(~~(this.t % 2) == 1){
					textAlign = 'center';
					font = '10pt Arial';
					
					if(this.mobile){
						fillText('Tap to play',P.width / 2,P.height / 2);
					}else{
						fillText('Press enter to play',P.width / 2,P.height / 2);
					}
				}
				
				drawImage(logoImage,(P.width - logoImage.width) / 2,100);
			}
			
			this.msgTime -= elapsed;
			if(this.msgTime > 0 && this.state != 'menu'){
				var x = P.width / 2;
				if(this.msgTime > 2.5){
					x = (0.5 - (this.msgTime - 2.5)) * 2 * P.width / 2;
					globalAlpha = (0.5 - (this.msgTime - 2.5)) * 2;
				}else if(this.msgTime < 0.5){
					x += 2 * (0.5 - this.msgTime) * P.width / 2;
					globalAlpha = 1 - 2 * (0.5 - this.msgTime);
				}
			
				font = '12pt Arial';
				textAlign = 'center';
				textBaseline = 'middle';
				
				fillStyle = '#ffffff';
				fillText(this.msg,x,P.height / 4);
				
				globalAlpha = 1;
			}
			
			shadowColor = 'rgba(0,0,0,0)';
			
			this.thunderTime -= elapsed;
			if(this.thunderTime > 0){
				// Flashing effect
				if(Math.round(this.thunderTime * 10) % 2 == 1){
					fillStyle = 'rgba(255,255,255,1)';
					fillRect(0,0,P.width,P.height);    
				}
				
				if(this.thunderCloud){
					// Thunder effect
					var x,prct;
					var deltaX = player.x - this.thunderCloud.x;
					var deltaY = (player.y - 20) - this.thunderCloud.y;
					strokeStyle = '#ffffff';
					beginPath();
					moveTo(this.thunderCloud.x,this.thunderCloud.y);
					for(var y = this.thunderCloud.y ; y < (player.y - 20) ; y += ~~(Math.random() * 20)){
						prct = (y - this.thunderCloud.y) / deltaY;
						lineTo(this.thunderCloud.x + deltaX * prct + Math.random() * 15,y);
					}
					stroke();
				}
			}
			
            if(this.state == 'game'){
                this.nextCloud -= elapsed;
                if(this.nextCloud <= 0){
                    this.addCloud();
                }
                
                this.nextNPC -= elapsed;
                if(this.nextNPC <= 0){
                    this.addNPC();
                }
                
                this.nextCar -= elapsed;
                if(this.nextCar <= 0){
                    this.addCar();
                }
                
                this.nextItem -= elapsed;
                if(this.nextItem <= 0){
                    this.addItem();
                }
            }
			
			if(this.mobile && this.controllable){
				globalAlpha = (controller.movesLeft ? 0.8 : 0.2);
				drawImage(arrowImage,20,380);
				
				globalAlpha = (controller.movesRight ? 0.8 : 0.2);
				save();
				translate(300,380);
				scale(-1,1);
				drawImage(arrowImage,0,0);
				restore();
				
				globalAlpha = 1;
			}
            
            restore();
            
            /*font = '10pt Arial';
            fillStyle = '#ffffff';
            textAlign = 'left';
            textBaseline = 'top';
            if(this.highScore > 0 && this.state == 'menu'){
                fillText('Best: ' + ~~this.highScore + 's',10,10);
            }
            fillText(cycleManager.fps,P.width - 20,10);*/
		}
	},
	showMessage : function(msg){
		this.msg = msg;
		this.msgTime = 3;
	},
	thunder : function(){
		this.thunderTime = 0.5;
		if(player.isUnder){
			this.thunderCloud = player.isUnder;
		}else if(clouds.length > 0){
			this.thunderCloud = null;
			var minDist = Number.MAX_VALUE,minI=0,d;
			for(var i in clouds){
				d = Math.abs(player.x - clouds[i].x);
				if(d < minDist && d < 100){
					minDist = d;
					this.thunderCloud = clouds[i];
				}
			}
		}else{
			this.thunderCloud = null;
		}
		
		if(this.thunderCloud){
			player.hitByThunder();
			this.showMessage('Ouch! Brian was hit by thunder!');
            this.shakeTime = 1;
            navigator.vibrate(1000);
		}
	},
	addCloud : function(){
        clouds.push(newCloud());
        this.generatedClouds++;
        
        var interval = 3 - this.generatedClouds * 0.2;
        interval = Math.max(interval,0.8);
        
        this.nextCloud = interval;
	},
	addNPC : function(){
        if(npcs.length < 3){
            npcs.push(newNPC());
            this.generatedNPCs++;
        }
        
        var interval = 3 - this.generatedNPCs * 0.01;
        interval = Math.max(interval,0.8);
        
        this.nextNPC = interval;
	},
	addCar : function(){
        cars.push(newCar());
        this.nextCar = 2;
	},
    addItem : function(){
        var f;
        var r = Math.random();
        if(r < 0.333){
            f = newUmbrellaItem;
        }else if(r < 0.666){
            f = newWindItem;
        }else{
            f = newHealthItem;
        }

        items.push(f());
        this.nextItem = 10;
    }
}

var player = {
	init : function(){
		this.x = P.width / 2;
		this.y = P.floorY;
		this.health = 1;
		this.t = 0;
		this.isProtected = false;
		this.presentHealth = 1;
		this.isUnderCloud = false;
		this.isUnder = null;
		this.salutes = false;
        this.umbrellaTime = 0;
	},
	hitByThunder : function(){
		this.y = P.floorY - 20;
	},
    getUmbrella : function(){
        this.umbrellaTime = 8;
    },
	cycle : function(elapsed){
		if(game.controllable){
			if(controller.movesLeft){ this.x -= elapsed * 100; this.salutes = false; }
			if(controller.movesRight){ this.x += elapsed * 100; this.salutes = false; }
			this.x = Math.max(this.x,0);
			this.x = Math.min(this.x,P.width);
		}
		
		if(this.y < P.floorY){
			this.y = Math.min(P.floorY,this.y + 100 * elapsed);
		}
		
		this.t += elapsed;
        
        this.umbrellaTime -= elapsed;
		
        if(this.umbrellaTime <= 0){
            var dX;
            
            this.isProtected = false;
            
            // Checking if the player is located under a cloud
            this.isUnderCloud = false;
            this.isUnder = null;
            for(var i in clouds){
                dX = Math.abs(this.x - clouds[i].x);
                if(dX < P.rainWidth / 2){
                    this.isUnderCloud = true;
                    this.isUnder = clouds[i];
                    break;
                }
            }
            
            if(this.isUnderCloud){
                // Checking if near an NPC to know if there is a protecting umbrella
                for(var i in npcs){
                    dX = Math.abs(this.x - npcs[i].x);
                    if(dX < P.protectionRadius){
                        this.isProtected = true;
                        break;
                    }
                }
                
                // Applying damage
                if(!this.isProtected){
                    this.presentHealth -= elapsed * P.presentHealthLossPerSecond;
                    
                    navigator.vibrate(100);
                    
                    if(this.presentHealth <= 0){
                        game.end();
                    }
                }
            }
        }else{
            this.isUnder = null;
            this.isUnderCloud = false;
            this.isProtected = true;
        }
	},
	draw : function(){
		with(ctx){
			save();
			translate(this.x - 10,this.y - 44);
		
			fillStyle = strokeStyle = '#ffffff';
			
			// Stomach
			fillRect(5,10,10,20);
			
			// Legs
			if(game.controllable && (controller.movesLeft || controller.movesRight)){
				fillRect(5,30,2,12 + Math.sin((this.t * Math.PI * 4) + Math.PI) * 2);
				fillRect(13,30,2,12 + Math.sin(this.t * Math.PI * 4) * 2);
			}else{
				fillRect(5,30,2,14);
				fillRect(13,30,2,14);
			}
			
			// Head
			var yHead = 0;
			if(game.controllable && (controller.movesLeft || controller.movesRight)){
				yHead = 1 + Math.sin(this.t * Math.PI * 4);
			}
			fillRect(7,yHead,6,8);
			
			// Neck
			fillRect(9,8,2,2);
			
			// Arms
			lineWidth = 2;
			beginPath();
			if(this.salutes){
				moveTo(6,11);
				lineTo(1,16);
				lineTo(6,20);
				moveTo(14,11);
				lineTo(19,6);
				lineTo(18 + 2 * Math.sin(this.t * Math.PI * 4),-2);
            }else if(this.presentHealth > 0){
				moveTo(6,11);
				lineTo(1,16);
				lineTo(6,20);
				moveTo(14,11);
				lineTo(19,16);
				lineTo(14,20);
			}else{
				moveTo(6,11);
				lineTo(1,6);
				lineTo(6,1);
				moveTo(14,11);
				lineTo(19,6);
				lineTo(13,1);
			}
			ctx.stroke();
            
            if(this.umbrellaTime > 0 && (this.umbrellaTime > 2 || ~~(this.umbrellaTime * 6 % 2) == 0)){
                drawImage(umbrellaImage,16 - umbrellaImage.width / 2,17-umbrellaImage.height);
            }
			
			// Hair
			fillStyle = '#ff8800';
			fillRect(7,yHead,6,1);
			fillRect(7,yHead + 1,1,2);
			fillRect(12,yHead + 1,1,2);
			
			// Present
			if(this.presentHealth <= 0){
				translate(3,26);
			}
            
            drawImage(presentImage,5,11);
			
			fillStyle = '#ff0000';
			fillRect(5,14,10,10);
			fillStyle = '#0000ff';
			fillRect(9,12,2,12);
			fillRect(5,18,10,2);
			fillRect(8,11,1,1);
			fillRect(7,12,1,1);
			fillRect(8,13,1,1);
			fillRect(11,11,1,1);
			fillRect(12,12,1,1);
			fillRect(11,13,1,1);
			
			restore();
			
			// HUD
			if(game.state == 'game'){
				save();
				translate(5,-4);
				fillStyle = '#ffffff';
				fillRect(5,14,10,10);
				fillStyle = 'gray';
				fillRect(9,12,2,12);
				fillRect(5,18,10,2);
				fillRect(8,11,1,1);
				fillRect(7,12,1,1);
				fillRect(8,13,1,1);
				fillRect(11,11,1,1);
				fillRect(12,12,1,1);
				fillRect(11,13,1,1);
				restore();
				
				
				if(this.isUnderCloud && !this.isProtected){
					fillStyle = '#ff0000';
				}else{
					fillStyle = '#ffffff';
				}
				fillRect(30,10,~~(this.presentHealth * 150),10);
			}
		}
	}
}

var newCloud = function(){
	var x = -cloudImage.width / 2;
	var way = 1;
	if(Math.random() < 0.5){
		x = P.width + cloudImage.width / 2;
		way = -1;
	}
	
	return {
		x : x,
		y : 60 + ~~(Math.random() * 100),
		o : 0,
		way : way,
		speed : 100 + Math.random() * 100,
		cycle : function(elapsed){
			this.o += elapsed * 300;
			this.x += elapsed * this.speed * this.way;
			if(this.x < -cloudImage.width || this.x > P.width + cloudImage.width){
				clouds.splice(clouds.indexOf(this),1);
			}
		},
		draw : function(){
			with(ctx){
				drawImage(cloudImage,this.x - cloudImage.width / 2,this.y - cloudImage.width / 2);
				
				save();
				translate(this.x - P.rainWidth / 2,~~this.o);
				fillStyle = rainPattern;
				fillRect(0,this.y - ~~this.o,P.rainWidth,P.floorY - this.y);
				restore();
			}
		}
	}
}

var newCar = function(){
	var x = -carImage.width / 2;
	var way = 1;
	if(Math.random() < 0.5){
		x = P.width + carImage.width / 2;
		way = -1;
	}

	return {
		x : x,
		y : P.floorY,
		way : way,
		cycle : function(elapsed){
			this.x += this.way * 400 * elapsed;
			if(this.x < -carImage.width || this.x > P.width + carImage.width){
				cars.splice(cars.indexOf(this),1);
			}
		},
		draw : function(){
			ctx.drawImage(carImage,~~(this.x - carImage.width / 2),~~(this.y - carImage.height));
		}
	}
}

var newNPC = function(){
	var x = -40;
	var way = 1;
	if(Math.random() < 0.5){
		x = P.width + 40;
		way = -1;
	}
	
	return {
		x : x,
		y : P.floorY,
		way : way,
		t : 0,
        directionChange : 6 + Math.random() * 5,
		speed : 20 + Math.random() * 90,
		cycle : function(elapsed){
			this.t += elapsed;
			this.x += this.way * this.speed * elapsed;
			if(this.x < -50 || this.x > P.width + 50){
				npcs.splice(npcs.indexOf(this),1);
			}
            
            this.directionChange -= elapsed;
            if(this.directionChange <= 0){
                if(this.speed == 0){
                    this.speed = this.prevSpeed;
                    this.directionChange = 6 + Math.random() * 5;
                    this.way =  (Math.random() < 0.5 ? -1 : 1);
                }else{
                    this.prevSpeed = this.speed;
                    this.speed = 0;
                    this.directionChange = Math.random() * 1.5;
                }
            }
		},
		draw : function(){
			with(ctx){
				save();
				//translate(~~(this.x - 20),~~(this.y - 61));
				translate(~~this.x,this.y);
				
				if(this.way < 0){
					scale(-1,1);
				}
				
				translate(-20,-61);
				
				fillStyle = '#ffffff';
				
				// Head
				fillRect(9,17,6,8);
				fillRect(10,25,2,2);
				
				// Stomach
				fillRect(8,27,7,20);
				
				// Legs
				fillRect(8,47,2,13 + Math.sin((this.t * Math.PI * 2) + Math.PI));
				fillRect(13,47,2,13 + Math.sin(this.t * Math.PI * 2));
			//ctx.fillRect(5,30,2,12 + Math.sin((this.t * Math.PI * 4) + Math.PI) * 2);
			//ctx.fillRect(13,30,2,12 + Math.sin(this.t * Math.PI * 4) * 2);
				
				// Arm
				fillRect(15,34,5,2);
				
                drawImage(umbrellaImage,0,0);
				
				restore();
				
				//fillStyle = 'rgba(255,0,0,0.5)';
				//fillRect(this.x - P.protectionRadius / 2,this.y - 50,P.protectionRadius,50);
			}
		}
	}
}

var newUmbrellaItem = function(){
    return {
        x : 20 + ~~(Math.random() * (P.width - 40)),
        y : -umbrellaImage.height,
        cycle : function(e){
            this.y += e * 100;
            if(this.y >= P.floorY){
                items.splice(items.indexOf(this),1);
            }else if(game.controllable && this.y >= P.floorY - 40 && Math.abs(this.x - player.x) < 20){
                // pickup
                items.splice(items.indexOf(this),1);
                player.getUmbrella();
                game.showMessage('Here\'s an umbrella for you');
            }
        },
        draw : function(){
            ctx.drawImage(umbrellaImage,this.x - umbrellaImage.width / 2,this.y - umbrellaImage.height / 2);
        }
    }
}

var newWindItem = function(){
    return {
        x : 20 + ~~(Math.random() * (P.width - 40)),
        y : -windImage.height,
        cycle : function(e){
            this.y += e * 100;
            if(this.y >= P.floorY){
                items.splice(items.indexOf(this),1);
            }else if(game.controllable && this.y >= P.floorY - 40 && Math.abs(this.x - player.x) < 20){
                // pickup
                items.splice(items.indexOf(this),1);
                
                // Pushing all clouds away
                for(var i in clouds){
                    clouds[i].way = (clouds[i].x < player.x ? -1 : 1);
                    clouds[i].speed = Math.max(clouds[i].speed,200);
                }
                
                game.nextCloud = Math.max(game.nextCloud,4);
                game.showMessage('Wind pushes clouds away');
            }
        },
        draw : function(){
            ctx.drawImage(windImage,this.x - windImage.width / 2,this.y - windImage.height / 2);
        }
    }
}

var newHealthItem = function(){
    return {
        x : 20 + ~~(Math.random() * (P.width - 40)),
        y : -heartImage.height,
        cycle : function(e){
            this.y += e * 100;
            if(this.y >= P.floorY){
                items.splice(items.indexOf(this),1);
            }else if(game.controllable && this.y >= P.floorY - 40 && Math.abs(this.x - player.x) < 20){
                // pickup
                items.splice(items.indexOf(this),1);
                
                // Adding health
                player.presentHealth = Math.min(1,player.presentHealth + 0.3);
            }
        },
        draw : function(){
            ctx.drawImage(heartImage,this.x - windImage.width / 2,this.y - windImage.height / 2);
        }
    }
}

var cloudImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 64;
	cache.height = 33;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
	
	var centers = [{x:26,y:11},{x:12,y:18},{x:37,y:22},{x:22,y:23},{x:44,y:12},{x:51,y:19}];
	for(var i in centers){
		cacheCtx.beginPath();
		cacheCtx.arc(centers[i].x,centers[i].y,10,0,2*Math.PI,true);
		cacheCtx.fill();
	}
	
	return cache;
})();

var rainPattern = (function(){
	var cache = document.createElement('canvas');
	cache.width = P.rainWidth;
	cache.height = 180;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
	
	for(var i = 0 ; i < 15 ; i++){
		cacheCtx.fillRect(~~(Math.random() * cache.width),~~(Math.random() * cache.height - 6),1,6);
	}
	
	return cacheCtx.createPattern(cache,'repeat');
})();

var logoImage = (function(){
	var representation = [
		'11100100110000100010100110101000111011001001001001',
		'10101010101000100010101000101000101010101010101101',
		'11001110101000100010101000110000110011001011101011',
		'10101010101000100010101000101000101010101010101001',
		'11101010110000111001000110101000111010101010101001'
	];

	var cache = document.createElement('canvas');
	cache.width = representation[0].length * 5;
	cache.height = representation.length * 5;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
	
	for(var i = 0 ; i < representation.length ; i++){
		for(var j = 0 ; j < representation[i].length ; j++){
			if(representation[i].charAt(j) == '1'){
				cacheCtx.fillRect(j*5,i*5,5,5);
			}
		}
	}
	
	return cache;
})();

var arrowImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 40;
	cache.height = 40;
	
	var cacheCtx = cache.getContext('2d');
	
	with(cacheCtx){
		fillStyle = '#000';
		beginPath();
		moveTo(0,20);
		lineTo(20,0);
		lineTo(20,10);
		lineTo(40,10);
		lineTo(40,30);
		lineTo(20,30);
		lineTo(20,40);
		closePath();
		fill();
	}
	
	return cache;
})();

var heartImage = (function(){
    var cache = document.createElement('canvas');
    cache.width = 18;
    cache.height = 15;
    
    var cacheCtx = cache.getContext('2d');
    with(cacheCtx){
        fillStyle = '#ffffff'
        beginPath();
        moveTo(0,2);
        lineTo(2,0);
        lineTo(6,0);
        lineTo(8,2);
        lineTo(10,2);
        lineTo(11,0);
        lineTo(15,0);
        lineTo(17,2);
        lineTo(17,6);
        lineTo(10,14);
        lineTo(8,14);
        lineTo(0,6);
        closePath();
        fill();
    }

    return cache;
})();

var carImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 81;
	cache.height = 25;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
	
	with(cacheCtx){
		beginPath();
		moveTo(0,8);
		lineTo(15,8);
		lineTo(23,0);
		lineTo(55,0);
		lineTo(62,8);
		lineTo(80,8);
		lineTo(80,19);
		lineTo(0,19);
		fill();
		
		beginPath();
		arc(19,19,6,0,2*Math.PI,true);
		arc(65,19,6,0,2*Math.PI,true);
		fill();
	}
	
	return cache;
})();

var umbrellaImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 40;
	cache.height = 36;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
    
    with(cacheCtx){
        // Umbrella stick
        fillRect(19,0,1,36);
        
        // Umbrella
        beginPath();
        moveTo(0,9);
        bezierCurveTo(11,2,11,2,20,1);
        bezierCurveTo(29,2,29,2,39,9);
        bezierCurveTo(28,7,28,7,19,8);
        bezierCurveTo(10,7,10,7,0,9);
        
        closePath();
        fill();
    }
    
    return cache;
})();

var windImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 20;
	cache.height = 11;
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
    
    with(cacheCtx){
        fillRect(0,3,16,1);
        fillRect(16,1,1,2);
        fillRect(14,0,2,1);
        fillRect(13,1,1,1);
        
        fillRect(2,5,17,1);
        fillRect(19,3,1,2);
        fillRect(18,2,1,1);
        
        fillRect(4,7,13,1);
        fillRect(17,8,1,2);
        fillRect(15,10,2,1);
        fillRect(14,9,1,1);
    }
    
    return cache;
})();

var presentImage = (function(){
	var cache = document.createElement('canvas');
	cache.width = 20;
	cache.height = 26;
	
	var cacheCtx = cache.getContext('2d');
    
    with(cacheCtx){
        fillStyle = '#ff0000';
        fillRect(0,3,10,10);
        fillStyle = '#0000ff';
        fillRect(4,1,2,12);
        fillRect(0,7,10,2);
        fillRect(3,0,1,1);
        fillRect(2,1,1,1);
        fillRect(3,2,1,1);
        fillRect(6,0,1,1);
        fillRect(7,1,1,1);
        fillRect(6,2,1,1);
    }
    
    return cache;
})();

var bgImage = (function(){
	var cache = document.createElement('canvas');
	
	var cacheCtx = cache.getContext('2d');
	cacheCtx.fillStyle = '#ffffff';
	
	cache.width = 20;	
	cache.height = 20;
	
	var windowFgPattern;
	with(cacheCtx){
		fillStyle = '#888888';
		fillRect(0,0,20,20);
		
		fillStyle = '#ababab';
		fillRect(10,10,10,10);
		
		windowFgPattern = createPattern(cache,'repeat');
	}
	
	cache.width = 20;	
	cache.height = 20;
	
	var windowBgPattern;
	with(cacheCtx){
		fillStyle = '#444444';
		fillRect(0,0,20,20);
		
		fillStyle = '#535353';
		fillRect(10,10,10,10);
		
		windowBgPattern = createPattern(cache,'repeat');
	}
	
	var floorGradient = cacheCtx.createLinearGradient(0,P.floorY,0,P.height);
	floorGradient.addColorStop(0,'#ffffff');
	floorGradient.addColorStop(1,'#878787');
	
	cache.width = P.width;
	cache.height = P.height;
	
	with(cacheCtx){
		// Sky
		fillStyle = '#000';
		fillRect(0,0,P.width,P.height);
		
		// Stars
		fillStyle = '#ffffff';
		for(var i = 0 ; i < 100 ; i++){
			fillRect(~~(Math.random() * P.width),~~(Math.random() * P.floorY),1,1);
		}
		
		// Moon
		fillStyle = '#ffffff';
		beginPath();
		arc(270,50,30,0,Math.PI * 2,true);
		fill();
		
		// Buildings background
		fillStyle = windowBgPattern;
		fillRect(20,200,170,140);
		fillRect(220,160,50,180);
		fillRect(280,240,20,100);
		
		// Buildings foreground
		fillStyle = windowFgPattern;
		fillRect(0,220,50,120);
		fillRect(80,160,70,180);
		fillRect(160,240,70,100);
		fillRect(240,200,50,140);
		fillRect(300,160,20,180);
	
		// Floor
		fillStyle = floorGradient;
		fillRect(0,P.floorY,P.width,P.height - P.floorY);
	}
	
	return cache;
})();

window.onload = function(){
	can = document.getElementById('game');
	can.width = P.width;
	can.height = P.height;
	
	ctx = can.getContext('2d');
	
	game.init();

    // Creating a favicon based on the umbrella image.
    (function(){
        var cache = document.createElement('canvas');
        cache.width = 64;
        cache.height = 64;
        
        var cacheCtx = cache.getContext('2d');
        cacheCtx.fillStyle = '#000';
        cacheCtx.fillRect(0,0,cache.width,cache.height);

        cacheCtx.translate(cache.width / 2,cache.height / 2);
        cacheCtx.scale(1.5,1.5);
        cacheCtx.rotate(-Math.PI / 4);
        cacheCtx.drawImage(umbrellaImage,-umbrellaImage.width / 2,-umbrellaImage.height / 2);

        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = cache.toDataURL("image/x-icon");
        document.head.appendChild(link);
    })();

    // Creating an icon for iOS devices
    (function(){
        if('standalone' in navigator){
            var cache = document.createElement('canvas');
            cache.width = 114;
            cache.height = 114;
            
            var cacheCtx = cache.getContext('2d');
            cacheCtx.fillStyle = '#000';
            cacheCtx.fillRect(0,0,cache.width,cache.height);

            cacheCtx.translate(cache.width / 2,cache.height / 2);
            cacheCtx.scale(1.5,1.5);
            cacheCtx.rotate(-Math.PI / 4);
            cacheCtx.drawImage(umbrellaImage,-umbrellaImage.width / 2,-umbrellaImage.height / 2);

            document.head.innerHTML += '<meta name="apple-mobile-web-app-capable" content="yes" />'
            + '<meta name="apple-mobile-web-app-status-bar-style" content="black" />'
            + '<link rel="apple-touch-icon" href="' + cache.toDataURL("image/png") + '" />';
        }
    })();
}