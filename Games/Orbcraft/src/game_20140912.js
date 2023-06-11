(function(){

var Orb = function (x, y, points) {

        var i,
        largest,
        smallest,
        t = this,r,g,b,l; // s is short for this

        //elements=['fire','earth','water','air'];

		/*
        if (points === undefined) {
            t.points = { // this.points should be like this
                fire : 20,
                earth : 0, // level 1 earth Orb by default
                water : 5,
                air : 5
            };

            // this.points contains the amounts for fire, earth, water, and wind in that order
            t.points = [20, 0, 5, 5];

        } else {
            t.points = points;
        }
*/
        t.points = points;

        t.x = x; // the x, and y position that the Orb is to be rendered
        t.y = y;

        t.radius = 10;
        t.socketed = false; // is the orb socketed into a socket building, or in the innovatory


        t.ratio = [0, 0, 0, 0];
        

        // figure ratio

        // find the largest point value
        i = 0;
        largest = 0;
        while (i < 4) {
            //if(this.points[ elements[i] ] > largest){
            if (t.points[i] > largest) {
                //largest = this.points[ elements[i] ];
                largest = t.points[i];
            }
            i+=1;
        }

        // find the smallest point value, and find total Orb Value
        i = 0;
        smallest = largest;
        t.value = 0;
        while (i < 4) {
            /*
            if(this.points[ elements[i] ] < smallest && this.points[ elements[i] ] > 0){
            smallest = this.points[ elements[i] ];
            }
            this.value += this.points[ elements[i] ];
             */
            if (t.points[i] < smallest && t.points[i] > 0) {
                smallest = t.points[i];
            }
            t.value += t.points[i];
            i+=1;
        }

        // find the ratio
        i = 0;
        while (i < 4) {
            //this.ratio[i] = this.points[elements[i]] / this.value;
            t.ratio[i] = t.points[i] / t.value;

            i+=1;
        }

		
        r = t.ratio[0] * 127;
        g = t.ratio[1] * 127;
        b = t.ratio[2] * 127;
        l = t.ratio[3] * 191;

        t.color = 'rgb(' + Math.floor(64 + r + l) + ',' + Math.floor(64 + g + l) + ',' + Math.floor(64 + b + l) + ')';

        // Orb attributes
        // (baseValue * this.value) + (elementRatio * this.value)
        
		//t.attack = (1.5 * t.value) + (t.ratio[0] * t.value);
		
		t.attack = (1.5 * t.value) + (Math.pow(t.ratio[0]+1, t.value));
		
		//1.5 * 30 + (Math.pow(1.15, 1*30 )
        
		t.range = 100 + (0.1 * t.value) + (t.ratio[1] * t.value);
        t.health = 50 + (5 * t.value) + (t.ratio[2] * (t.value*100));
        t.speed = 1 + (0.01 * (t.value-1)) + (t.ratio[3] * ( t.value * 0.05 ));

		// auto heal, and attack rates
		t.attackRate=1000 / t.speed; // used for both heal, and attack
		t.lastAttack = new Date();
		t.lastAutoHeal=new Date();
        
    },

    Enemy = function (x, y, level) {
        var t = this; // t is short for this
        t.x = x;
        t.y = y;
        t.dx = 0;
        t.dy = 1;
        //t.heading=Math.random() * (Math.PI*2);
        t.heading = Shell.rnd(Math.PI * 2);
		t.turnRate = 0.2;
		t.radius = 5; // the actual radius of the enemy
         t.target = 'none';
		
        t.maxHp = 5 + Math.pow(1.15,level);
        t.hp = t.maxHp;
        t.range = 32; // the attack range as a radius
        t.attack = 2 + Math.pow(1.1,level);
		
		t.attackRate = 500;
		t.lastAttack=new Date();
    },
	
	
	Building = function (id, typeIndex, cellX, cellY, boardx, boardy) {
        this.id = id;
        this.typeIndex = typeIndex; // the building type '0: tower, 1: socket, 2: manaWell, 3: manaStore'

        //this.cellSize=32;
        this.cellX = cellX; // the cell x position in the game board
        this.cellY = cellY; // the cell y position in the game board


        this.x = this.cellX * 32 + boardx; // the actual x and y positions
        this.y = this.cellY * 32 + boardy;

        this.maxHp = 100;
        this.hp = this.maxHp;

        this.socketed=undefined; // the orb that is socketed to the building if it is building type 1, undefined means none

    };

	
	
    Enemy.prototype = {
        step : function () {
            var t = this;
            t.x += t.dx;
            t.y += t.dy;
        },

        render : function (ctx) {
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }

    };


/*
    Game Class
    - the game class contains just about everything that has to do with the game, instances of player Orbs,
    Buildings, and Enemy's are stored here


     */

    window.Game = function () {
        var t = this;
        t.user = {
            x : 0,
            y : 0,
            maxIdel : 500, // the amount of time that the mouse is to be idel until a hover action is preformed
            idel : 500, // will be reset to this.user.maxIdel, every time a mouse move is preformed
            lt : new Date(), // start counting down now
            doHover : true // preform the hover action once, rather then doing it over and over killing preformance
        };

        t.infoBoxDefault = ['Welcome to Orb Craft!', 'hover over things for help']; // what is to be displayed in the info box
        t.infoBox = t.infoBoxDefault;

        t.grabed = {
            orb : 'none',
            homeIndex : 0, // the home index of the Orb in Game.OI, or Game.PB
            homeX : 0,
            homeY : 0
        };
        t.setUp();
    };

    window.Game.prototype = {
        setUp : function () {
            var i, // index pointer, used in loops
            len,
            t = this,
			b; // building


            t.level = 1; // the current level, as the level goes up enemy's become more numerous, and more difficult to defeat
            t.waveDelay = 5000; // the amount of time left until the next wave begins
            t.lastTime = new Date();

            t.enemyCount = 1; // first wave is just one enemy

            t.mana = {
                //starting : 200, // then amount of mana that you start with at each level
                current : 200, // your current amount of mana available to spend on Buildings, Orbs, and Actions
                max : 10000, // the maxamum amount of mana you can have
                overTime : 900, // the amount of mana you gain over time (mana per minute)
                overTimeRate : 100, // how often you gain mana over time
                lt : new Date() // used to determine the amunt of mana you should get each time overTime mana is computed
            };

            // the player board (PB), is the area where player buildings can be placed
            t.PB = {
                cellSize : 32,
                cellX : 14,
                cellY : 7,
                offsetX : 25,
                offsetY : 231,
                buildingIndex : []
            };
			
			// set up the player board (PB) grid.
            t.PB.grid = [];
            i = 0;
            len = t.PB.cellX * t.PB.cellY;
            while (i < len) {
                t.PB.grid[i] = -1;
                i+=1;
            }
			
			// the create Orb buttons			
			t.CO = [
			    ['fire', 535-40,140,32,32],
				['earth', 535+40,140,32,32],
				['water', 535,140-40,32,32],
				['air', 535,140+40,32,32],
				['combo', 535-40,140+40,32,32],
				['build', 535+40,140+40,32,32]
			];

            this.comboActive=false;
			this.buildActive=false;

            // the players Orb Inventory (OI), this is where un-socketed Orbs are stored
            t.OI = {
                orbs : [], // unused orbs will be stored here, used Orbs will be stored in Game.buildings
                cellSize : 32,
                cellX : 4,
                cellY : 4,
                offsetX : 640 - (32 * 4) - 25,
                offsetY : 480 - (32 * 4) - 25 - 100
            };

            // set up starting Orbs
			/*
            for (i = 0; i < 12; i+=1) {
                t.makeOrb([Shell.rRnd(5), Shell.rRnd(5), Shell.rRnd(5), Shell.rRnd(5)]);
            }
*/

            // set up the Enemy array
            t.enemys = [];
            //var eCount = Math.round(Math.random()*9)+1;
            for (i = 0; i !== t.enemyCount; i+=1) {
                //t.enemys.push(new Enemy(Math.round(Math.random()*500),-20));
                t.enemys.push(new Enemy(Shell.rRnd(500), -20, t.level));
            }

            // set up starting buildings
            for (i = 0; i !== 14; i += 1) {
                t.PB.grid[i] = new Building(
                        's' + i,
                        1,
                        i,
                        0,
                        t.PB.offsetX, t.PB.offsetY);

                // starting socketed sockets

                if (String(i / 4).indexOf('.') === -1) {
                    b = t.PB.grid[i];
                    b.socketed = new Orb(
                            b.x + t.PB.cellSize / 2, b.y + t.PB.cellSize / 2,
                            [0, 1, 0, 0]// earth gems of level 1
                        );
                    b.socketed.socketed = true;
                }

                t.PB.buildingIndex.push(i);
                //this.buildings.push( new PBBuilding('s'+i,1));

            }

			/*
			var orb1 = new Orb(0,0,[1,0,0,0]);
			var orb2 = new Orb(0,0,[1,1,0,0]);
			
			var combo = t.combineOrbs(0,0,orb1,orb2);
			
			
			*/
			
            // place the wizard tower
            // 14 * y + x
            //t.PB.grid[14 * 5 + 12] = new Building('p', 0, 12, 5, t.PB.offsetX, t.PB.offsetY);
            //t.PB.buildingIndex.push(14 * 5 + 12);
        },

        nextLevel : function () {
            var t = this,i;
            t.level+=1; // up things to the next level
            t.enemyCount+=1;

			
			
			
            // set up the Enemy array
            t.enemys = [];

            for (i = 0; i !== t.enemyCount; i+=1) {
                //t.enemys.push(new Enemy(Math.round(Math.random()*500),-20));
                t.enemys.push(new Enemy(Shell.rRnd(500), -20, t.level));
            }

            t.waveDelay = 1; // reset wave clock
            t.lastTime = new Date(); // start counting down
        },

		
		/*
		    combineOrbs
		    -- make a new Orb from two pre
		*/
		
        combineOrbs : function (x,y,orb1,orb2) {
            var points=[],i=0;
			while(i < 4){
			    points[i] = orb1.points[i] + orb2.points[i];
			    i+=1;
			}
			// BOOKMark
            return new Orb(x,y,points);
        },

        /*
        makeOrb
        -- make an Orb and store it in the players Orb Inventory (OI), if the OI is not full.

         */
        makeOrb : function (points) {
            if (points === undefined){
                points = [0, 0, 0, 1];
			}

            var x,
            y,
            i,
            OI = this.OI,
            len,
			cost=0;
			
			// figure mana cost
			i=0; len=4;
			while(i<len){
			    cost += points[i]*100;
			    i+=1;			
			}
			
			if(this.mana.current >= cost){
			i=0;len = OI.cellX * OI.cellY;
            while (i < len) {
                // if the current Slot is empty, make the new Orb and return out
                if (OI.orbs[i] === undefined) {
                    y = Math.floor(i / OI.cellX);
                    x = i % OI.cellX;					
					OI.orbs[i] = new Orb(
                            OI.offsetX + (OI.cellSize / 2) + (OI.cellSize * x),
                            OI.offsetY + (OI.cellSize / 2) + (OI.cellSize * y),
                            points
					);
					this.mana.current -= cost; // debit players mana
                    return;
                }
                i+=1;
            }
			
			
			}
        },

        userGrab : function () {
            var x,
            y,
            i,
			len,
            OI = this.OI,
            PB = this.PB,
            B, // building
            GR = this.grabed,
            U = this.user,
			points; // used to make Orbs

            // is the player grabbing an Orb from there inventory?
            if (Shell.boundingBox(U.x, U.y, 1, 1, OI.offsetX, OI.offsetY, OI.cellSize * OI.cellX, OI.cellSize * OI.cellY)) {
                x = Math.floor((U.x - OI.offsetX) / OI.cellSize);
                y = Math.floor((U.y - OI.offsetY) / OI.cellSize);
                i = (y * this.OI.cellX) + x;
                
                if (OI.orbs[i] !== undefined) {
                    GR.orb = OI.orbs[i];
                    GR.homeX = GR.orb.x;
                    GR.homeY = GR.orb.y;
                    
                    // if the Orb is not socketed (in the inventory)
                    if (!GR.socketed) {
                        GR.homeIndex = i; // remember where it goes, so we can free up the slot
                    }
                }
            }

            // is the player grabbing at something on the player board?
            if (Shell.boundingBox(U.x, U.y, 1, 1, PB.offsetX, PB.offsetY, PB.cellSize * PB.cellX, PB.cellSize * PB.cellY)) {
                x = Math.floor((U.x - PB.offsetX) / PB.cellSize);
                y = Math.floor((U.y - PB.offsetY) / PB.cellSize);

                i = y * PB.cellX + x;
                B = PB.grid[i];

                if (B !== -1) {
                    // if the building is a socket, and it has an Orb, grab the Orb.
                    if (B.typeIndex === 1 && B.socketed) {

                        GR.orb = B.socketed;
                        GR.homeX = GR.orb.x;
                        GR.homeY = GR.orb.y;
                        GR.homeIndex = i; // remember the index in PB.grid, so it can be placed back
                    }
                }else{
				    // is this.buildingActive true? if so make a socket building
				    
					// NEW BUILDING
					
					
					
					PB.grid[i] = new Building(
                        's'+i, // ALERT! we may not need the id property any more
                        1,
                        x,
                        y,
                        this.PB.offsetX, this.PB.offsetY
					);
					this.PB.buildingIndex.push(i);
				
				}
            }
			
			// is the player trying to do something (make and Orb, combine and Orb, make a new socket)
			i = 0;len = this.CO.length;			
			while(i<len){
			    if(Shell.boundingBox(U.x,U.y,1,1,this.CO[i][1],this.CO[i][2],this.CO[i][3],this.CO[i][4])){
				    
					switch(this.CO[i][0]){
					    case 'combo':
						    this.buildActive = false;
						    this.comboActive = !this.comboActive;
						break;
						
						case 'build':
						    this.comboActive = false;
						    this.buildActive = !this.buildActive;
						break;
					
					    default:
						    points = [0,0,0,0];
					        points[i]=1;
					        this.makeOrb(points);
						break;
					
					}
				
				/*
				    if(this.CO[i][0] !== 'combo' && this.CO[i][0] !== 'build'){
					    points = [0,0,0,0];
					    points[i]=1;
					    this.makeOrb(points);
					}else{
					    this.comboActive = ! this.comboActive;
					    
					}
					*/
				}
			    i+=1;
			}

        },
		
		
		userRelease : function () {
		    var t=this,
			OI = t.OI,
		    GR = t.grabed,
		    PB = t.PB,
		    U = t.user,
		    B, // building
		    x,
		    y,
		    i,
			orb,
			obj,

			
			testIt = function(a){
			   if(Shell.boundingBox(U.x, U.y, 1, 1, a.offsetX, a.offsetY, a.cellX * a.cellSize, a.cellY * a.cellSize)){
			     return true;
			   }			   
			   return false;
			},
			
			findX = function(a){
			    return Math.floor((U.x - a.offsetX) / a.cellSize);
			},
			
			findY = function(a){
			    return Math.floor((U.y - a.offsetY) / a.cellSize);
			};
			
		    // if the player has an Orb in hand...
		    if (GR.orb !== 'none') {

		        // is the Orb Over the Player Board (Game.PB)?
		        //if (Shell.boundingBox(U.x, U.y, 1, 1, PB.offsetX, PB.offsetY, PB.cellX * PB.cellSize, PB.cellY * PB.cellSize)) {
				
				if(testIt(PB)){
				    
		            //x = Math.floor((U.x - PB.offsetX) / PB.cellSize);
		            //y = Math.floor((U.y - PB.offsetY) / PB.cellSize);

					x = findX(PB);
		            y = findY(PB);
					
		            i = (y * PB.cellX) + x;

		            B = PB.grid[i];

		            // is there a building, and is it a socket?
		            if (B !== undefined && B.typeIndex === 1) {
		                    // is it free?
		                    if (B.socketed === undefined) {
		                        // then the Orb Has a new Home.


		                        // if the orb is coming from another socket, free that socket, and set it's hp back
		                        if (GR.orb.socketed) {
								    PB.grid[GR.homeIndex].maxHp = 100;
									PB.grid[GR.homeIndex].hp = 100;
		                            PB.grid[GR.homeIndex].socketed = undefined;

		                        } else {
		                            // else free up it's slot in the inventory
		                            
		                            OI.orbs[GR.homeIndex] = undefined;

		                        }

		                        GR.orb.socketed = true; // no mater what the Orb is socketed
		                        GR.orb.x = B.x + (PB.cellSize / 2);
		                        GR.orb.y = B.y + (PB.cellSize / 2);

		                        B.socketed = GR.orb; // the building now has the Orb
		                        B.maxHp = 100 + GR.orb.health; // apply orb Health to building
                                
								GR.orb = 'none';
								return;
								
		                    } else {

		                        // is combo mode active? if so combine.
		                        if (t.comboActive) {
		                            
		                            x = B.socketed.x;
		                            y = B.socketed.y;
		                            orb = t.combineOrbs(x, y, B.socketed, GR.orb);
		                            orb.socketed = true;
		                            // if the orb is coming from another socket, free that socket
		                            if (GR.orb.socketed) {
		                                // set the base hp back
		                                PB.grid[GR.homeIndex].maxHp = 100;
		                                if (PB.grid[GR.homeIndex].hp > 100) {
		                                    PB.grid[GR.homeIndex].hp = 100;
		                                }
		                                PB.grid[GR.homeIndex].socketed = undefined;
		                            } else {
		                                // free up it's slot in the inventory
		                                
		                                OI.orbs[GR.homeIndex] = undefined;
		                            }
		                            B.socketed = orb;
									B.maxHp = 100 + orb.health; // apply orb Health to building
		                            //t.comboActive = false;

									GR.orb = 'none';
									return;
									
		                        }
		                    }
		            }

					
				
				// if not over player board then...
		        } else {

		            // is the Orb Over the players Orb Invatory (Game.OI)?				
					if(testIt(OI)){
						x = findX(OI);
		                y = findY(OI);
						
		                i = (y * t.OI.cellX) + x;

		                // is the underlying slot empty?
		                if (OI.orbs[i] === undefined) {
		                    // then place it there

		                    OI.orbs[i] = GR.orb;
		                    OI.orbs[i].x = OI.offsetX + (OI.cellSize / 2) + (x * OI.cellSize);
		                    OI.orbs[i].y = OI.offsetY + (OI.cellSize / 2) + (y * OI.cellSize);

		                    if (GR.orb.socketed) {
		                        PB.grid[GR.homeIndex].socketed = undefined;

		                        // set the base hp back
		                        PB.grid[GR.homeIndex].maxHp = 100;
		                        if (PB.grid[GR.homeIndex].hp > 100) {
		                            PB.grid[GR.homeIndex].hp = 100;
		                        }

		                    } else {
		                        OI.orbs[GR.homeIndex] = undefined;
		                    }
		                    GR.orb.socketed = false;
							
							GR.orb = 'none';
							return;		
		                }

		            }

		        } // end if over player board, else over orb inventory 

		    } // end if the player has an Orb in hand
            
			// if you do not return out, then put it back
		    GR.orb.x = GR.homeX;
		    GR.orb.y = GR.homeY;
		    GR.orb = 'none';
		},
		
        userMove : function (x, y) {
            var t = this;
            // update the cursor
            t.user.x = x;
            t.user.y = y;
            t.user.idel = t.user.maxIdel;
            t.user.lt = new Date();
            t.user.doHover = true;
            t.infoBox = t.infoBoxDefault;

            // change the position of an Orb
            if (t.grabed.orb !== 'none') {
                t.grabed.orb.x = t.user.x;
                t.grabed.orb.y = t.user.y;
            }
        },
        userHover : function () {

            
            var i = 0,
			t=this,
            OI = t.OI,
			PB = t.PB,
			U = t.user,
            len = OI.orbs.length,
			B,
			orb,
			
			setInfo=function(orb){
				var p = ['speed','health','range','attack','value'],
				i=p.length;				
				t.infoBox =['Orb Info:'];
				while(i--){
				    t.infoBox.push(p[i]+':'+orb[p[i]]);
				}
				/*
			    t.infoBox = [
                    'Orb Info:',
                    'value:' + orb.value,
                    'attack:' + orb.attack,
                    'range:' + orb.range,
                    'health:' + orb.health,
                    'speed:' + orb.speed				    
                ];
				*/
			};
			
			
			
			// are we hovering over an Orb?
            // Orb in inventory?
            while (i < len) {
			    orb = OI.orbs[i];
                if (orb !== undefined) {
                    if (Shell.boundingBox(U.x, U.y, 1, 1, orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2)) {
					    setInfo(orb);
                    }
                }
                i+=1;
            }
			
			// orb in player board?
			i=0; len = PB.buildingIndex.length;
			while(i<len){
			    B = PB.grid[PB.buildingIndex[i]];
			    if (B.socketed){
				    orb = B.socketed;
				    if(Shell.boundingBox(U.x,U.y,1,1,orb.x-orb.radius,orb.y-orb.radius,orb.radius*2,orb.radius*2)){      
						setInfo(orb);
					}
				}
				i++;
			}

            // ALERT we need to check for orbs in sockets as well
            // Socketed Orb?

            U.doHover = false;
        },

        killBuilding : function (id) {
            var i = 0,
            len = this.PB.buildingIndex.length;
            while (i < len) {
                if (this.PB.grid[this.PB.buildingIndex[i]].id === id) {
                    this.PB.grid[this.PB.buildingIndex[i]] = -1; // remove from grid
                    this.PB.buildingIndex.splice(i, 1); // remove from index
                    break;
                }
                i+=1;
            }

            // reset target ids for all enemy's attacking that building to 'none'
            i = 0;
            len = this.enemys.length;
            while (i < len) {
                if (this.enemys[i].target.id === id) {
                    this.enemys[i].target.id = 'none';
                }
                i+=1;
            }
        },

        killEnemy : function (index) {
            this.enemys.splice(index, 1);
        },

        updateEnemyAI : function () {
            var d,
            ei = 0,
			e, // current enemy being worked with in a loop
            eLen = this.enemys.length,
            bLen = this.PB.buildingIndex.length,
            th,
            angles;
			
            while (ei < eLen && bLen > 0) {
                e = this.enemys[ei];

                // if the enemy has no target get one
                if (e.target === 'none') {
                    //e.target = this.PB.grid[this.PB.buildingIndex[Math.floor(Math.random()*bLen)]];
                    e.target = this.PB.grid[this.PB.buildingIndex[Math.floor(Shell.rnd(bLen))]];
                }

                // if e.heading does not equal target heading change course
                if (e.heading !== th) {

                    // find the target heading, compare to current heading and change course if needed
                    th = Number(Math.atan2(e.target.y + (this.PB.cellSize / 2) - e.y, e.target.x + (this.PB.cellSize / 2) - e.x).toFixed(2));

                    // convert atan2 -PI to PI to 0 to PI*2 form;
                    if (th < 0) {
                        th += Math.PI * 2;
                    }

                    // find the angles that will be used to determine which way the enemy will turn
                    angles = Shell.findAngles(e.heading, th);

                    // change course
                    if (angles.clock < angles.counter) {
                        //e.heading -= 0.1;
                        e.heading -= e.turnRate;
                    } else {
                        //e.heading += 0.1;
                        e.heading += e.turnRate;
                    }
                }

                // adjust e.heading if it goes out of bounds
                if (e.heading > Math.PI * 2){
                    e.heading -= Math.PI * 2;
				}
                if (e.heading < 0){
                    e.heading += Math.PI * 2;
				}

                // format e.heading
                e.heading = Number(e.heading.toFixed(2));

                // set deltaX and deltaY based on current heading
                e.dx = Math.cos(e.heading) * 5;
                e.dy = Math.sin(e.heading) * 5;

                // find distance between enemy and enemy's current target
                d = Shell.distance(e.target.x, e.target.y, e.x, e.y);

                // if the enemy is not in range of it's target step

                if (d > e.range) {

                    e.step();
                } else { // else the enemy can attack
				
				    if(new Date() - e.lastAttack >= e.attackRate){
                        e.target.hp -= e.attack;
						e.lastAttack = new Date();
					}

                    // if the targets hp has reached zero it is destroyed
                    if (e.target.hp <= 0) {
                        this.killBuilding(e.target.id);
                        e.target = 'none';
                        bLen = this.PB.buildingIndex.length;
                        //bLen=this.buildings.length;

                        // check for player defeat
                        this.checkForDefeat();

                    }
                }

                ei+=1;
            }

        },

        updatePlayer : function () {

            var i = 0,
            b,
            len = this.PB.buildingIndex.length,
            ei,
            e,
            eLen = this.enemys.length,
            orb,
            killList = [];
            while (i < len) {
                b = this.PB.grid[this.PB.buildingIndex[i]];

                // does the Building have an Orb?
                if (b.socketed) {
                    orb = b.socketed;
                    ei = 0;

                    //ALERT! fix Auto heal

                    // auto-heal the building
					if(new Date() - orb.lastAutoHeal >= orb.attackRate){
                        if (b.hp < b.maxHp) {
                            b.hp += b.socketed.health*0.1;
                        }
						orb.lastAutoHeal = new Date();
					}

					// can the Orb attack?
					
					if(new Date() - orb.lastAttack >= orb.attackRate){
					
                    // loop threw enemy's, and attack one that is in range
                    while (ei < eLen) {
                        e = this.enemys[ei];
                        if (Shell.distance(orb.x, orb.y, e.x, e.y) < orb.range) {
                            e.hp -= orb.attack;

                            if (e.hp <= 0) {

                                killList.push(ei);

                            }
                            orb.lastAttack = new Date();
                            break; // only attack one enemy in range
                        }
                        ei+=1;
                    }
					
					}
                }
                i+=1;
            }

            i = 0;
            len = killList.length;
            while (i < len) {
                this.killEnemy(killList[i]);
                i+=1;
            }
            this.checkForVictory(); // check to see if the player won

        },

        /*
        checkForDefeat

        -- to be called each time an enemy destroys a player's building.
         */
        checkForDefeat : function () {

            // new Grid
            if (this.PB.buildingIndex.length === 0) {

                //lost+=1;

                this.setUp();
            }

        },
        checkForVictory : function () {
            //if the amount of buildings === 0 then the player has lost

            if (this.enemys.length === 0) {

                //win+=1;

                //this.setUp();
                this.nextLevel();
            }

        },

        /*
        update

        -- the main update function that will be called in thread each game tick, when the app's state machine
        is in 'game' state.
         */
        update : function () {
            var amount; // the amount of mana to be added to current store
            // update user idle if it is greater then 0
            if (this.user.idel > 0) {
                this.user.idel -= new Date() - this.user.lt;
                this.user.lt = new Date();
                if (this.user.idel < 0) {
                    this.user.idel = 0;
                }
            } else {
                // else preform hover action
                if (this.user.doHover) {
                    this.userHover();
                }
            }

            // update mana
            if (this.mana.current < this.mana.max) {
                //var time = new Date() - this.mana.lt;
                if (new Date() - this.mana.lt >= this.mana.overTimeRate) {
                    amount = (new Date() - this.mana.lt) * (this.mana.overTime / (1000 * 60));
                    this.mana.current += amount;

                    if (this.mana.current > this.mana.max) {
                        this.mana.current = this.mana.max;
                    }

                    this.mana.lt = new Date();

                }
            }

            // update the Enemy's, and check for defeat.
            if (this.waveDelay > 0) {

                this.waveDelay -= new Date() - this.lastTime;
                this.lastTime = new Date();
                if (this.waveDelay < 0){
                    this.waveDelay = 0;
				}

            } else {
                this.updateEnemyAI();
                
            }
			
			this.updatePlayer();

        },

        renderBuildings : function (ctx) {
            // render buildings

            var i = 0,obj,
            len = this.PB.grid.length;
            while (i < len) {
                //this.buildings[i].render(ctx);
                obj = this.PB.grid[i];
                if (obj !== undefined) {

                    ctx.fillStyle = '#005f5f';
                    ctx.strokeStyle = '#002f2f';
                    //ctx.strokeRect(obj.x,obj.y,obj.cellSize,obj.cellSize);
                    ctx.strokeRect(obj.x, obj.y, this.PB.cellSize, this.PB.cellSize);
                    ctx.fillRect(obj.x, obj.y, this.PB.cellSize, this.PB.cellSize);

                    // if it has an Orb render it
                    /*
                    if(obj.socketed){
                    var orb = obj.socketed;
                    ctx.fillStyle='#ff00ff';
                    ctx.beginPath();
                    ctx.arc(orb.x,orb.y,orb.radius,0,Math.PI*2);
                    ctx.closePath();
                    ctx.fill();
                    }
                     */

                    // draw building health bars
                    ctx.fillStyle = '#2f2f2f';
                    ctx.fillRect(obj.x, obj.y, 32, 4);
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(obj.x, obj.y, Number(Shell.per(obj.hp, obj.maxHp) / 100) * 32, 4);
                    i+=1;
                }
            }
        },
        renderOrbs : function (ctx) {
            // render orbs
            // render unused OI orbs in the OI inventory
            var i = 0,
            len = this.OI.orbs.length,
            obj;
			
			ctx.font = '8px courier';
			ctx.textAlign = 'center';
			
            while (i < len) {
                obj = this.OI.orbs[i];
                if (obj !== undefined) {
                    //ctx.fillStyle='#ff00ff';
                    ctx.fillStyle = this.OI.orbs[i].color;
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
					
					
					ctx.fillStyle='#000000';					
					ctx.fillText(obj.value,obj.x,obj.y);
					

                }
                i+=1;
            }

            // render any orbs that are in buildings
            i = 0;
            len = this.PB.buildingIndex.length;
            while (i < len) {
                if (this.PB.grid[this.PB.buildingIndex[i]].socketed !== undefined) {
                    obj = this.PB.grid[this.PB.buildingIndex[i]].socketed;

                    //ctx.fillStyle='#ff00ff';
                    ctx.fillStyle = obj.color;
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
					
					ctx.fillStyle='#000000';
					ctx.fillText(obj.value,obj.x,obj.y);
                }
                i+=1;
            }
        },
        renderGridLines : function (ctx) {
            ctx.lineWidth = 2;

            // redner the player board (PB)
            this.renderGL(this.PB, ctx);

            // render the OI
            this.renderGL(this.OI, ctx);

        },

        render : function (ctx) {

            var i,
            len,
            obj,buttonColors;
            ctx.lineWidth = 2;

			
			// render buttons
			ctx.strokeStyle='#ffffff';
						
			i=0;len=this.CO.length;
			buttonColors = ['red','green','blue','white','grey','grey'];
			
			if(!this.comboActive){buttonColors[4] = '#222222';}
			if(!this.buildActive){buttonColors[5] = '#222222';}			
			ctx.textAlign='center';
			while(i<len){
			    ctx.fillStyle=buttonColors[i];
			    ctx.fillRect(this.CO[i][1],this.CO[i][2],this.CO[i][3],this.CO[i][4]);
				ctx.fillStyle='black';
				ctx.fillText(this.CO[i][0],this.CO[i][1]+16,this.CO[i][2]+16);
			    i+=1;
			}
			ctx.textAlign='left';
			
			
			
            // render enemy's
            i = 0;
            len = this.enemys.length;
            while (i < len) {

                obj = this.enemys[i];
                obj.render(ctx);

                ctx.strokeStyle = '#00aa00';
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, 8, 0, Number(Shell.per(obj.hp, obj.maxHp) / 100) * (Math.PI * 2));
                //ctx.closePath();
                ctx.stroke();

                i+=1;
            }

            // infoBox
			ctx.fillStyle='#ffffff';
            ctx.textAlign = 'center';
            i = 0;
            len = this.infoBox.length;
            while (i < len) {
                ctx.fillText(this.infoBox[i], 555, 380 + i * 10);
                i+=1;
            }
            ctx.textAlign = 'left';

            // mana
            ctx.fillStyle = 'rgba(75,75,75,0.75)';
            ctx.fillRect(200, 10, 200, 15);
            ctx.fillStyle = 'rgba(0,0,255,0.75)';
            ctx.fillRect(200, 10, 200 * (Shell.per(this.mana.current, this.mana.max) / 100), 15);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('Mana: ' + Math.round(this.mana.current) + '/' + this.mana.max, 300, 20);
            ctx.textAlign = 'left';

            // win lost count
            ctx.fillStyle = '#ffffff';
            ctx.fillText('level: ' + this.level, 10, 20);
            //ctx.fillText('win:' + win + ', lost:' + lost, 10, 30);
            //ctx.fillText('idel: ' + this.user.idel + '/' + this.user.maxIdel, 10, 40);

			
			// show the PB Grid
		/*
		ctx.fillStyle='#ffffff';
		i=0,len=this.PB.grid.length;
		var out;		
		var x=0,y=0;
		while(i<len){
		    if(this.PB.grid[i] != -1){
			    out = this.PB.grid[i].typeIndex;			
			}else{
			    out = -1;
			}
		    ctx.fillText(out,x*15+100,y*15+80);			
			x++;			
			if(x === this.PB.cellX){
			    x=0;
				y++;
			}			
		    i++;
		}
		ctx.fillText('['+this.PB.buildingIndex+']',100,65);
		*/
			
        },

        /*
        renderGL
        -- render grid lines the Player Board (Game.PB), or the players Orb Inventory (Game.OI)

         */
        renderGL : function (what, ctx) {
            var cx = 0,
            cy = 0;
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            while (cy < what.cellY) {
                cx = 0;
                while (cx < what.cellX) {
                    ctx.strokeRect(
                        cx * what.cellSize + what.offsetX,
                        cy * what.cellSize + what.offsetY,
                        what.cellSize,
                        what.cellSize);
                    cx+=1;
                }
                cy+=1;
            }
        }
    };




    

    /*
    Building Class

     */
    
	
}());