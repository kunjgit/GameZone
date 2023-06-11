/*
* lightless.js - mini adventure game
* developed by Viktor Ugrin
* */
;(function(){
	//Some of global vars, which are shared btw modules
	var g = {
			size: [17, 31],
			width: window.innerWidth,
			height: window.innerHeight,
			blockSize: 40,
			memory: 15000,
			level: 2,
			levelCount: 5,
			position: [1, 1],
			stepTime: 600,
			maxWater: 420000,
			maxTime: 3600000,
			water: 420000,
			time: 3600000,
			distortion: 0,
			links: {
				use: 'use-link',
				drink: 'drink-link'
			}
		},
		stepAnimation = {
			start: ( new Date() ).getTime(),
			step: 0,
			shift: [0, 0],
			next: [0, 0]
		},
		//Maps collection
		Maps = [
			// level 0
			'1111111111111111111111111111111' +
			'1000000000000000000000000000001' +
			'1110111011111010101000010111101' +
			'1010021010g0101010001100000d101' +
			'1011101000101000100110010110101' +
			'1000001010001001110100110000101' +
			'1010111011000001b00101111110001' +
			'1010000001011001110101000410101' +
			'1011101001010000110101011110101' +
			'10101011010100002100000100001g1' +
			'1010101000011101010111110111101' +
			'1000100010000000010000000120001' +
			'1610111011010011000111010111001' +
			'1010000000010010010010010001101' +
			'1010111110110111011010111111001' +
			'1e10000000000000000000000000001' +
			'1111111111111111111111111111111',

			// level 1
			'1111111111111111111111111111111' +
			'1000000000000000000000000000001' +
			'1011110100111101110111011101101' +
			'101c010110104101000010010001001' +
			'1011010010101100010000111011101' +
			'1000010010100001111100000000101' +
			'1011110110000100100001101110101' +
			'1012000100010100000000101510101' +
			'1010110001110101011011100010101' +
			'1010100100000101001000001110101' +
			'1000001101011101101011101200001' +
			'1011011001001000001001001101111' +
			'10100g1001011010111011101000001' +
			'100010111102001010000a101111001' +
			'1011101000011110111011101000001' +
			'1000000000000000000000000000001' +
			'1111111111111111111111111111111',

			// level 2
			'1111111111111111111111111111111' +
			'1000000000000000000000003000001' +
			'1010111110011101110101011111101' +
			'1012001000015100200101000000001' +
			'1011101011110101111101001171101' +
			'1000001000000101000001001000101' +
			'1011111110111101011111001010101' +
			'1010000000100001000000001400101' +
			'1000110000100000011111101111101' +
			'1010011110111101010000000000001' +
			'1011110100001001g10010101010001' +
			'1000000111100011111010101010101' +
			'1010010111101000001010111010101' +
			'1011010000001301000010000000101' +
			'1010011111011111110111011011101' +
			'1000000000000000000000000000001' +
			'1111111111111111111111111111111',

			// level 3
			'1111111111111111111111111111111' +
			'1111110000000000000000000000001' +
			'1100010101110111101111011011101' +
			'1104010131010000000001010000001' +
			'1100010111010010111101010111101' +
			'11181100000101f0100001000000101' +
			'1000000011110110101111011110101' +
			'1011101010000010101000000500101' +
			'1010001011010110001011101110001' +
			'1010101001010100111010000100101' +
			'1010111101010110000010110000001' +
			'1000130000210000111000010110101' +
			'1010101101110110000000000000101' +
			'1010000100000100111113101111101' +
			'1011111101101101100111101001001' +
			'1000000000000000000000000000001' +
			'1111111111111111111111111111111',

			// level 4
			'1111111111111111111111111111111' +
			'1000000000000000000000011111111' +
			'1010111110110010111101010000011' +
			'1015100010011110103101010111011' +
			'1000000011113010101100010141011' +
			'1011111010000010100001010101011' +
			'1010001010111010101001010001011' +
			'1010101000000000001101011111011' +
			'1010101111110111001001000000011' +
			'1010100000010001111101111111111' +
			'1010111111010101010000000000121' +
			'1010000001010101000110111110101' +
			'1010111111010101110110001010101' +
			'1010100000010100010110131000001' +
			'1010101111110111010011111010101' +
			'1000000000000000000000000000101' +
			'1111111111111111111111111111111'
		],

		//Messages collection
		Messages = {
			generalThoughts: [
				{ time: 1, message: 'kh........' },
				{ time: 2, message: 'khkhkhhhh........' },
				{ time: 4, message: 'My head.....' },
				{ time: 5, message: 'What...what is?' },
				{ time: 7, message: 'WowwW.........!! Where am I?!' },
				{ time: 9, message: 'Any body is here?!.....' },
				{ time: 11, message: 'Why here is so dark?' },
				{ time: 13, message: 'I`m feeling soo cold...' },
				{ time: 14, message: 'Seems i`m under ground......' },
				{ time: 16, message: 'It`s definitely not my house...' },
				{ time: 18, message: 'Hm... as I remembered, I went to bad early yesterday...' },
				{ time: 20, message: 'What`s happened?!....wars.....' },
				{ time: 22, message: 'I don`t think so...' },
				{ time: 23, message: 'Stop to talk to myself and let`s get out of here...' },

				{ time: 60, message: 'It`s a very strange...Everything are strange here...' },

				{ time: 80, message: 'Here is too dry air...' },
				{ time: 85, message: 'Water...hm...that`s interested. Shall I find some water.' },

				{ time: 100, message: 'AAAaaaa...what`s about food?! I don`t want to die here...' },
				{ time: 102, message: 'I really hope that someone help me to find out...' },
				{ time: 105, message: '...and show me right way...' },

				{ time: 180, message: 'How is there my little doggy...' },
				{ time: 186, message: 'If he was here, he will help me to get out in a few minutes...' },
				{ time: 190, message: 'I missed him...' },

				{ time: 250, message: 'I never find out from this place....' },
				{ time: 252, message: 'I`m really scared now...' },

				{ time: 390, message: 'My footwear is wet...I`m cold...' },

				{ time: 420, message: 'Did You hear it?! What is that?' },
				{ time: 430, message: 'And now again...' },

				{ time: 500, message: 'Stop!!! Seems I`m hearing some voice behind me...' },
				{ time: 503, message: 'I should to check it!' },

				{ time: 550, message: 'Hm......' },
				{ time: 552, message: 'Interesting......' },
				{ time: 555, message: 'I`m listening music in my head...' },
				{ time: 560, message: 'Do You know what`s that?' },

				{ time: 565, message: 'It`s a band, called Queen' },

				{ time: 600, message: '..................' },

				{ time: 650, message: 'I cannot thinking anymore....' },
				{ time: 655, message: 'I`m really tired....' },
				{ time: 660, message: 'I want to go home to my bed....' },
				{ time: 670, message: 'I want to sleep....' },

				{ time: 800, message: 'Did I talk to You about my dog?' },
				{ time: 810, message: 'He is nice dog!' }
			],
			items: {
				a: [
					'Wow, I found a bottle. I think I could use it to get water...',
					'Hm, I`ve never though that I`ll find a bottle here. It could be very useful...',
					'What is that?! Something similar to bottle for water. It`s really useful...'
				],
				b: [
					'Old warder...Interesting, who is owner...Seems it`s very old. But anyway it`s useful',
					'Amazing...I`ve just found that what I need. Warder...',
					'Warder...I could use it to prevent trap into sands...'
				],
				c: [
					'I found rope! Seems it`s the most useful thing!!! Now I can to move up and down easier through the underground...',
					'It`s a rope! It`s very useful for me! Now I`m feeling the sun under my head...'
				],
				d: [
					'It`s a some strange moon-like thing... Seems it`s a key...So, somewhere should be a door...'
				],
				e: [
					'It`s a triangle-like key! I must find a door, which I can open...'
				],
				f: [
					'It`s a rectangle-like key! I hope it helps me to get out of here!'
				],
				g: [
					'I`m feeling some strange on the wall. Perhaps it`s an old pictures or...texts...',
					'Now my mind is a great!',
					'I feel I can fly....fly...fly....'
				]
			},
			places: {
				1: [
					'Ah, it`s just a wall',
					'It`s a cold stone wall',
					'I`m not sure that I could do that...',
					'Are you sure?',
					'I want to do that, but...',
					'I don`t know how...',
					'I want to go home...',
					'Do You think it`s possible?',
					'It`s just a stone',
					'Never mind...',
					'..................'
				],
				2: [
					'Water!!!',
					'I found water! I`m feeling better myself now...',
					'It`s a water...How I was waiting it...',
					'Water is great, lets try to find out...',
					'That`s great that I found water. Here is too dry air...'
				],
				3: [
					'AAAaaaaa...it`s a quicksand... I`m falling down...',
					'Quicksand...I should find something to prevent falling down each time...I`m falling down...'
				],
				'3-alt': [
					'Quicksand again...But now I have warder...',
					'I don`t scare a quicksand now.'
				],
				4: [
					'I feel a hole on the ceiling...',
					'What`s that...Up..Seems that`s a hole.',
					'Lets try to use hole on the ceiling.'
				],
				5: [
					'I feel a hole on the ground...It`s a hole in the ground. I could try to go down...',
					'Here is the hole on the ground. I could try to go down, but I should have a rope for that.',
					'Nice hole in the ground. Is it useful?'
				],
				6: [
					'I feel some strange stone, not like others. Seems it`s a door...Here is the moon-like hole...',
					'Wow...Good news...It`s a door with moon-like hole.',
					'I could use this door, but firstly I need a moon-like key...'
				],
				7: [
					'I feel some strange stone, not like others. Seems it`s a door...Here is the triangle-like hole...',
					'Wow...Good news...It`s a door with triangle-like hole.',
					'I could use this door, but firstly I need a triangle-like key...'
				],
				8: [
					'I feel some strange stone, not like others. Seems it`s a door...Here is the rectangle-like hole...',
					'Wow...Good news...It`s a door with rectangle-like hole.',
					'I could use this door, but firstly I need a rectangle-like key...'
				]
			},
			levels: {
				0: ['Here is too hard air...Too hard to breathe...I must go up ASAP!'],
				1: ['I`m feeling many water places here...I should to find couple...'],
				2: ['Seems, I woke up here...I felt my self like now...'],
				3: ['I`m feel myself fine, but I don`t think that out is somewhere here'],
				4: ['I like this place, nice air, easy to breathe :)'],
				5: ['I`M FREE!!!!!!!!!!']
			},
			needs: {
				drink: [
					'I`m really want to drink...',
					'I should to find water...',
					'I cannot live without water...',
					'I`ll die soon, if I don`t find water!'
				],
				eat: [
					'I need to hurry up...',
					'I cannot think normally without food. I should to go out...',
					'Show me right way!',
					'I feel that i`ll die soon, if I don`t find out...',
					'I`m hearing something...I`m scared...',
					'I`m not sure that it`s a safe placed.'
				]
			},
			dead: {
				drink: [
					'I`m not sure that You can live without water...He couldn`t live...He`s died...',
					'In next time, firstly need to find water...He`s dead...'
				],
				food: [
					'He`s died without food...',
					'Should to be faster... He`s dead...',
					'No food, No Live... He`s dead...'
				]
			}
		},

		/*
		* MapsManager module
		* Provide public methods for working with maps
		* */

		MapsManager = ( function(){
			var length = g.size[0] * g.size[1],
				objects = {
					0: { name: 'Empty space', handler: 'emptySpace' },
					1: { name: 'Stone wall', handler: 'stoneWall', isWall: true },
					2: { name: 'Water', handler: 'water', dependency: 'a', isWater: true },
					3: { name: 'Sands', handler: 'sands', dependency: 'b' },
					4: { name: 'Hole in the ceiling', handler: 'holeUp', dependency: 'c', isHole: true, level: 1 },
					5: { name: 'Hole in the ground', handler: 'holeDown', dependency: 'c', isHole: true, level: -1 },
					6: { name: 'Door ( moon )', handler: 'door', dependency: 'd', isDoor: true },
					7: { name: 'Door ( triangle )', handler: 'door', dependency: 'e', isDoor: true },
					8: { name: 'Door ( rectangle )', handler: 'door', dependency: 'f', isDoor: true },
					a: { name: 'Bottle', handler: 'pickUp', isBottle: true, isEmpty: true, isItem: true },
					b: { name: 'Warder', handler: 'pickUp', isItem: true },
					c: { name: 'Rope', handler: 'pickUp', isItem: true },
					d: { name: 'Key ( moon )', handler: 'pickUp', isItem: true },
					e: { name: 'Key ( triangle )', handler: 'pickUp', isItem: true },
					f: { name: 'Key ( rectangle )', handler: 'pickUp', isItem: true },
					g: { name: 'Engraving', handler: 'memoryUp', amount: 7000 }
				};
			return {
				getPlace: function( coords ){
					var index = coords[1] * g.size[1] + coords[0],
						placeKey,
						place;
					if( index < 0 || index >= length ){
						place = false;
					}else{
						placeKey = Maps[g.level].substr( coords[1] * g.size[1] + coords[0], 1 );
						place = objects[placeKey];
					}
					return place;
				},
				getKey: function( coords ){
					return Maps[g.level].substr( coords[1] * g.size[1] + coords[0], 1 );
				},
				setZero: function( coords ){
					var index = coords[1] * g.size[1] + coords[0];
					Maps[g.level] = Maps[g.level].substring( 0, index ) + '0' + Maps[g.level].substring( index + 1 );
				},
				getPlaceByKey: function( key ){
					return objects[key];
				}
			};
		} )(),

		/*
		 * MessagesManager module
		 * Provide public methods for working with messages
		 */
		MessagesManager = (function(){
			var	notesId = 'notes-wrapper',
				notes,
				showSecond = 0,
				element,
				showPlaceLastUpdate = ( new Date() ).getTime(),
				showNeedsLastUpdate = ( new Date() ).getTime(),
				_addMessage = function( message, type ){
					element = document.createElement( 'div' );
					element.setAttribute( 'class', 'note ' + type );
					if( typeof message === 'string' ){
						element.innerHTML = message;
					}else{
						element.innerHTML = message[parseInt( Math.random() * message.length )];
					}
					notes.appendChild( element );
				};
			return {
				initialize: function(){
					notes = document.getElementById( notesId );
				},
				updateGeneralThoughts: function( gameTime ){
					if( parseInt( gameTime / 1000 ) != showSecond ){
						showSecond = parseInt( gameTime / 1000 );
						Messages.generalThoughts.forEach(
							function( thought ){
								if( thought.time == showSecond ){
									_addMessage( thought.message, ( typeof thought.isSystem !== 'undefined' ) ? 'system-thought' : 'thought' );
								}
							}
						);
					}
				},
				updateNeedsWater: function(){
					var random = Math.random();
					if( ( new Date() ).getTime() - showNeedsLastUpdate >= 7000 ){
						if( random < ( 1 - ( g.water / g.maxWater ) ) ){
							_addMessage( Messages.needs['drink'], 'system-thought' );
						}
						showNeedsLastUpdate = ( new Date() ).getTime();
					}
				},
				updateNeedsEat: function(){
					var random = Math.random();
					if( ( new Date() ).getTime() - showNeedsLastUpdate >= 20000 ){
						if( random < ( 1 - ( g.time / g.maxTime ) ) ){
							_addMessage( Messages.needs['eat'], 'system-thought' );
						}
						showNeedsLastUpdate = ( new Date() ).getTime();
					}
				},
				showItem: function( itemIndex ){
					_addMessage( Messages.items[itemIndex], 'item' );
				},
				showPlace: function( placeIndex, alt ){
					if( ( new Date() ).getTime() - showPlaceLastUpdate >= 1000 ){
						if( alt ){
							_addMessage( Messages.places[placeIndex + '-alt'], 'place' );
						}else{
							_addMessage( Messages.places[placeIndex], 'place' );
						}
						showPlaceLastUpdate = ( new Date() ).getTime();
					}
				},
				showLevel: function(){
					_addMessage( Messages.levels[g.level], 'level' );
				},
				showEnd: function( type ){
					_addMessage( Messages.dead[type], 'dead' );
				},
				showWin: function( gameTime ){
					_addMessage( 'YEAH!!!!!!!!!!!!!! I did it!!!!!!!', 'win' );
					_addMessage( 'Time is: ' + parseInt( ( gameTime / 60000 ) ) + ' min. ' +
						parseInt( ( gameTime - ( parseInt( gameTime / 60000 ) * 60000 ) ) / 1000 ) + ' sec.', 'win' );
					_addMessage( 'It`s a great Time!!!', 'win' );
				}
			};
		})(),
		/*
		 * InventoryManager module
		 * Provide public methods for working with inventory
		 */
		InventoryManager = (function(){
			var inventory = [],
				listId = 'inventory-list';
			return {
				put: function( obj ){
					inventory.push( obj );
					this.updateList();
				},
				check: function( obj ){
					var isExisted = false;
					inventory.forEach(
						function( item ){
							if( item == obj ){
								isExisted = true;
							}
						}
					);
					return isExisted;
				},
				checkBottle: function(){
					var isExisted = false;
					inventory.forEach(
						function( item ){
							if( item.isBottle ){
								isExisted = item;
							}
						}
					);
					return isExisted;
				},
				updateList: function(){
					var fragment = document.createDocumentFragment(),
						listItem;
					inventory.forEach(
						function( item, index ){
							listItem = document.createElement( 'span' );
							listItem.setAttribute( 'class', 'inventory-item' );
							if( item.isBottle ){
								listItem.innerText = ( ( index ) ? ', ' : '' ) +
									item.name + ( ( item.isEmpty ) ? ' ( empty )' : ' ( full )' );
							}else{
								listItem.innerText = ( ( index ) ? ', ' : '' ) + item.name;
							}
							fragment.appendChild( listItem );
						}
					);
					document.getElementById( listId ).innerHTML = '';
					document.getElementById( listId ).appendChild( fragment );
				}
			};
		})(),

		/*
		 * Render module
		 * Use for rendering graphics to the canvas.
		 */
		Render = (function(){
			var game = 'game',
				gameContext,
				walls = [],
				wallsIndexes = [],
				shadowAnimation = {
					alpha: 1,
					angle: 0,
					next: 0,
					step: 0.001
				},
				_updateCanvasSize = function(){
					document.getElementById( game ).width = g.width;
					document.getElementById( game ).height = g.height;
				},
				_clear = function(){
					gameContext.fillStyle = 'rgba( 0, 0, 0, ' + shadowAnimation.alpha + ' )';
					gameContext.fillRect( 0, 0, g.width, g.height );
				},
				_beforeDraw = function(){
					_animatingShadow();
					gameContext.save();
					gameContext.rotate( shadowAnimation.angle );
				},
				_afterDraw = function(){
					gameContext.restore();
				},
				_updateWall = function( x, y ){
					walls.filter(
						function( wall ){
							if( wall.x == x && wall.y == y ){
								wall.startTime = ( new Date() ).getTime();
							}
							return false;
						}
					);
				},
				_renderDoor = function( x1, y1, x2, y2, alpha ){
					gameContext.lineCap = 'round';
					gameContext.lineWidth = 7;
					gameContext.strokeStyle = 'rgba( 170, 170, 170, ' + alpha + ' )';
					gameContext.moveTo( x1, y1 );
					gameContext.lineTo( x2, y2 );
					gameContext.stroke();
				},
				_renderWall = function( x1, y1, x2, y2, alpha ){
					gameContext.lineCap = 'square';
					gameContext.lineWidth = 1;
					gameContext.strokeStyle = 'rgba( 130, 130, 130, ' + alpha + ' )';
					gameContext.moveTo( x1, y1 );
					gameContext.lineTo( x2, y2 );
					gameContext.stroke();
				},
				_draw = function( wall, shift ){
					var x1, y1, x2, y2,
						shiftX = ( g.width / 2 - g.blockSize / 2 ) - ( g.position[0] * g.blockSize ) - shift[0],
						shiftY = ( g.height / 2 - g.blockSize / 2 ) - ( g.position[1] * g.blockSize ) - shift[1],
						partOfLive = ( ( new Date() ).getTime() - wall.startTime ) / wall.liveTime;
					wall.edges.forEach(
						function( edge ){
							if( edge[0] == 'left' ){
								gameContext.beginPath();
								x1 = wall.x * g.blockSize + wall.dieWay.translation * partOfLive;
								y1 = wall.y * g.blockSize;
								x2 = x1;
								y2 = y1 + g.blockSize;
								if( edge[1] == 'wall' ){
									_renderWall( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}else{
									_renderDoor( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}
							}
							if( edge[0] == 'top' ){
								gameContext.beginPath();
								x1 = wall.x * g.blockSize;
								y1 = wall.y * g.blockSize + wall.dieWay.translation * partOfLive;
								x2 = x1 + g.blockSize;
								y2 = y1;
								if( edge[1] == 'wall' ){
									_renderWall( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}else{
									_renderDoor( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}
							}
							if( edge[0] == 'right' ){
								gameContext.beginPath();
								x1 = wall.x * g.blockSize + g.blockSize + wall.dieWay.translation * partOfLive;
								y1 = wall.y * g.blockSize;
								x2 = x1;
								y2 = y1 + g.blockSize;
								if( edge[1] == 'wall' ){
									_renderWall( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}else{
									_renderDoor( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}
							}
							if( edge[0] == 'down' ){
								gameContext.beginPath();
								x1 = wall.x * g.blockSize;
								y1 = wall.y * g.blockSize + g.blockSize + wall.dieWay.translation * partOfLive;
								x2 = x1 + g.blockSize;
								y2 = y1;
								if( edge[1] == 'wall' ){
									_renderWall( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}else{
									_renderDoor( shiftX + x1, shiftY + y1, shiftX + x2, shiftY + y2, 1 - partOfLive );
								}
							}
						}
					);
				},
				_garbageCollector = function(){
					var currentTime = ( new Date() ).getTime();
					wallsIndexes.length = 0;
					walls = walls.filter(
						function( wall ){
							var isDead = currentTime - wall.startTime >= wall.liveTime;
							if( !isDead ){
								wallsIndexes.push( wall.x + '-' + wall.y );
							}
							return !isDead;
						}
					);
				},
				_animatingShadow = function(){
					shadowAnimation.angle += shadowAnimation.step;
					shadowAnimation.alpha = 1 - ( 0.9 * g.distortion );
					if( shadowAnimation.step > 0 && shadowAnimation.angle >= shadowAnimation.next ||
						shadowAnimation.step < 0 && shadowAnimation.angle <= shadowAnimation.next ){
						shadowAnimation.next = ( ( shadowAnimation.next < 0 ) ? 1 : -1 ) * 0.03 * g.distortion;
						shadowAnimation.step = shadowAnimation.next / 30;
					}
				};
			return {
				initialize: function(){
					try{
						gameContext = document.getElementById( game ).getContext( '2d' );
						_updateCanvasSize();
					}catch( error ){
					}
				},
				addWall: function( position ){
					var block, place;
					if( wallsIndexes.indexOf( position[0] + '-' + position[1] ) != -1 ){
						_updateWall( position[0], position[1] );
						return false;
					}
					block = {
						x: position[0],
						y: position[1],
						dieWay: { rotation: -1, translation: Math.random() * g.blockSize - ( g.blockSize / 2 ) },
						edges: [],
						startTime: ( new Date() ).getTime(),
						liveTime: g.memory
					};
					place = MapsManager.getPlace( [position[0] - 1, position[1]] );
					if( place.isWall || place.isDoor ){
						block.edges.push( [ 'left', ( place.isWall ) ? 'wall': 'door' ] );
					}
					place = MapsManager.getPlace( [position[0], position[1] - 1] );
					if( place.isWall || place.isDoor ){
						block.edges.push( [ 'top', ( place.isWall ) ? 'wall': 'door' ] );
					}
					place = MapsManager.getPlace( [position[0] + 1, position[1]] );
					if( place.isWall || place.isDoor ){
						block.edges.push( [ 'right', ( place.isWall ) ? 'wall': 'door' ] );
					}
					place = MapsManager.getPlace( [position[0], position[1] + 1] );
					if( place.isWall || place.isDoor ){
						block.edges.push( [ 'down', ( place.isWall ) ? 'wall': 'door' ] );
					}
					walls.push(block);
					wallsIndexes.push( position[0] + '-' + position[1] );
				},
				clearWalls: function(){
					walls.length = 0;
					wallsIndexes.length = 0;
				},
				update: function(){
					var shift = [stepAnimation.shift[0] * g.blockSize, stepAnimation.shift[1] * g.blockSize];
					_clear();
					_beforeDraw();
					walls.forEach(
						function( wall ){
							_draw( wall, shift );
						}
					);
					_afterDraw();
					_garbageCollector();
				},
				updateCanvas: function(){
					_updateCanvasSize();
				}
			};
		})(),

		/*
		 * Player module
		 * It`s a main module. Use for calculating all movements for player and manipulate to other modules
		 */
		Player = (function(){
			var startTime,
				lastUpdateTime,
				isStopped = false,
				isMoving = false,
				handlers = {
					emptySpace: function( next ){
						_updatePosition( next );
					},
					stoneWall: function( next ){
						//MessagesManager.showPlace( MapsManager.getKey( next ) );
					},
					water: function( next, place ){
						MessagesManager.showPlace( MapsManager.getKey( next ) );
						_drinkWater( place );
						_updatePosition( next );
					},
					sands: function( next, place ){
						MessagesManager.showPlace( MapsManager.getKey( next ) );
						if( !InventoryManager.check( MapsManager.getPlaceByKey( place.dependency ) ) ){
							_updateLevel( -1 );
						}
						_updatePosition( next );
					},
					holeUp: function( next, place ){
						MessagesManager.showPlace( MapsManager.getKey( next ) );
						_updatePosition( next );
						if( InventoryManager.check( MapsManager.getPlaceByKey( place.dependency ) ) ){
							_showUseLink();
						}
					},
					holeDown: function( next, place ){
						MessagesManager.showPlace( MapsManager.getKey( next ) );
						_updatePosition( next );
						if( InventoryManager.check( MapsManager.getPlaceByKey( place.dependency ) ) ){
							_showUseLink();
						}
					},
					door: function( next, place ){
						MessagesManager.showPlace( MapsManager.getKey( next ) );
						if( InventoryManager.check( MapsManager.getPlaceByKey( place.dependency ) ) ){
							_updatePosition( next );
						}
					},
					pickUp: function( next, place ){
						MessagesManager.showItem( MapsManager.getKey( next ) );
						_updatePosition( next );
						InventoryManager.put( place );
						MapsManager.setZero( next );
					},
					memoryUp: function( next, place ){
						MessagesManager.showItem( MapsManager.getKey( next ) );
						_updatePosition( next );
						g.memory += place.amount;
						MapsManager.setZero( next );
					}
				},
				_updateGameProcess = function( elapsedTime ){
					_updateTime( elapsedTime );
					_updateWater( elapsedTime );
					Render.update();
				},
				_go = function( direction ){
					var next = _calculateNext( direction ),
						place = MapsManager.getPlace( next );
					if( place !== false ){
						handlers[place.handler].call( handlers, next, place );
					}
				},
				_calculateNext = function( direction ){
					return [ g.position[0] + direction[0], g.position[1] + direction[1] ];
				},
				_updatePosition = function( next ){
					_hideUseLink();
					isMoving = true;
					stepAnimation.start = ( new Date() ).getTime();
					stepAnimation.step = 0;
					stepAnimation.next[0] = next[0];
					stepAnimation.next[1] = next[1];
					stepAnimation.shift[0] = 0;
					stepAnimation.shift[1] = 0;
				},
				_updateLevel = function( direction ){
					Render.clearWalls();
					g.level = ( g.level + direction < 0 ) ? 0 : g.level + direction;
					if( g.level == g.levelCount ){
						isStopped = true;
						_win();
					}else{
						_go( [0, 0] );
					}
					MessagesManager.showLevel();
				},
				_updateAnimation = function(){
					var index = ( ( new Date() ).getTime() - stepAnimation.start ) / g.stepTime;
					if( index < 1 ){
						stepAnimation.step = index;
						stepAnimation.shift[0] = ( stepAnimation.next[0] - g.position[0] ) * index;
						stepAnimation.shift[1] = ( stepAnimation.next[1] - g.position[1] ) * index;
					}else{
						stepAnimation.shift[0] = 0;
						stepAnimation.shift[1] = 0;
						g.position[0] = stepAnimation.next[0];
						g.position[1] = stepAnimation.next[1];
						Render.addWall( g.position );
						isMoving = false;
					}
				},

				_drinkWater = function( place ){
					var bottle = InventoryManager.checkBottle();
					if( place && place.isWater ){
						g.water = g.maxWater;
						if( bottle && bottle.isEmpty ){
							bottle.isEmpty = false;
							InventoryManager.updateList();
							_showDrinkLink();
						}
					}else{
						if( bottle && !bottle.isEmpty ){
							bottle.isEmpty = true;
							InventoryManager.updateList();
							g.water = g.maxWater;
							_hideDrinkLink();
						}
					}
				},

				_win = function(){
					MessagesManager.showWin( ( new Date() ).getTime() - startTime );
				},

				_showDrinkLink = function(){
					document.getElementById( g.links.drink ).style.display = 'inline';
				},
				_showUseLink = function(){
					document.getElementById( g.links.use ).style.display = 'inline';
				},
				_hideDrinkLink = function(){
					document.getElementById( g.links.drink ).style.display = 'none';
				},
				_hideUseLink = function(){
					document.getElementById( g.links.use ).style.display = 'none';
				},

				_updateTime = function( elapsedTime ){
					g.time -= elapsedTime;
					g.distortion = Math.min( 1, Math.max( g.distortion, 1 - g.time / g.maxTime ) );
					if( g.time <= 0 ){
						_endTime();
					}
					MessagesManager.updateNeedsEat();
				},
				_updateWater = function( elapsedTime ){
					g.water -= elapsedTime;
					g.distortion = Math.min( 1, Math.max( g.distortion, 1 - g.water / g.maxWater ) );
					if( g.water <= 0 ){
						_endWater();
					}
					MessagesManager.updateNeedsWater();
				},
				_endTime = function(){
					isStopped = true;
					MessagesManager.showEnd( 'food' );
				},
				_endWater = function(){
					isStopped = true;
					MessagesManager.showEnd( 'drink' );
				};
			return {
				start: function(){
					startTime = ( new Date() ).getTime();
					lastUpdateTime = startTime;
					MessagesManager.initialize();
					_go( [0, 0] );
					Render.initialize();
				},
				update: function( direction ){
					var elapsedTime = ( new Date() ).getTime() - lastUpdateTime;
					if( !isStopped ){
						MessagesManager.updateGeneralThoughts( ( new Date() ).getTime() - startTime );
						_updateGameProcess( elapsedTime );
						if( isMoving ){
							_updateAnimation();
						}else if( direction[0] || direction[1] ){
							_go( direction );
						}
					}
					lastUpdateTime = ( new Date() ).getTime();
				},
				use: function(){
					var rope,
						currentPlace =  MapsManager.getPlace( g.position );
					if( currentPlace !== false && currentPlace.isHole ){
						rope = MapsManager.getPlaceByKey( currentPlace.dependency );
						if( InventoryManager.check( rope ) ){
							_updateLevel( currentPlace.level );
						}
					}
				},
				drink: function(){
					_drinkWater();
				},
				resize: function(){
					Render.updateCanvas();
				}
			}
		})();

	/*
	 * Game processing, initialization and live cycle module.
	 */
	(function(){
		var status = {
				left: false,
				up: false,
				right: false,
				down: false,
				isTouched: false,
				startTouchX: 0,
				startTouchY: 0,
				shiftX: 0,
				shiftY: 0
			},
			touchHandlerId = 'ui-touch-handler',
			touchHandler,
			direction = [0, 0],
			liveCycleHandler = false,
			_initialize = function(){
				if( 'ontouchstart' in document ){
					document.body.setAttribute( 'class', 'touches' );
					touchHandler = document.getElementById( touchHandlerId );
					_attachTouchEvents();
				}
				_attachEvents();
			},
			_hideWelcome = function(){
				document.getElementsByClassName( 'welcome-screen' )[0].style.display = 'none';
			},
			_updateMovements = function(){
				direction[0] = 0;
				direction[1] = 0;
				if( status.left ){
					direction[0] = -1;
				}else if( status.up ){
					direction[1] = -1;
				}else if( status.right ){
					direction[0] = 1;
				}else if( status.down ){
					direction[1] = 1;
				}
			},
			_keyDownHandler = function( event ){
				if( event.keyCode == 37 ){
					status.left = true;
				}
				if( event.keyCode == 38 ){
					status.up = true;
				}
				if( event.keyCode == 39 ){
					status.right = true;
				}
				if( event.keyCode == 40 ){
					status.down = true;
				}
			},
			_keyUpHandler = function( event ){
				if( event.keyCode == 37 ){
					status.left = false;
				}
				if( event.keyCode == 38 ){
					status.up = false;
				}
				if( event.keyCode == 39 ){
					status.right = false;
				}
				if( event.keyCode == 40 ){
					status.down = false;
				}
			},
			_useHandler = function( event ){
				event.preventDefault();
				Player.use();
			},
			_drinkHandler = function( event ){
				event.preventDefault();
				Player.drink();
			},
			_startGameHandler = function( event ){
				event.preventDefault();
				_hideWelcome();
				Player.start();
				_initializeLiveCycle();
			},
			_resizeHandler = function(){
				g.width = window.innerWidth;
				g.height = window.innerHeight;
				Player.resize();
			},
			_liveCycleHandler = function(){
				_updateMovements();
				Player.update( direction );
			},
			_resetStates = function(){
				status.left = false;
				status.up = false;
				status.right = false;
				status.down = false;
			},
			_updateHandler = function(){
				var r = Math.sqrt( Math.pow( status.shiftX, 2 ) + Math.pow( status.shiftY, 2 ) ),
					x = status.shiftX,
					y = status.shiftY,
					angle;
				_resetStates();
				if( r > 30 ){
					angle = Math.atan2( y, x );
					if( angle <= Math.PI / 4 && angle > - Math.PI / 4 ){
						status.right = true;
					}else if( angle <= - Math.PI / 4 && angle > - 3 * Math.PI / 4 ){
						status.up = true;
					}else if( angle <= - 3 * Math.PI / 4 || angle > 3 * Math.PI / 4 ){
						status.left = true;
					}else if( angle <= 3 * Math.PI / 4 && angle > Math.PI / 4 ){
						status.down = true;
					}
				}
				if( r > 50 ){
					x = ( x / r ) * 50;
					y = ( y / r ) * 50;
				}
				touchHandler.style.left = x + 'px';
				touchHandler.style.top = y + 'px';
			},
			_touchStart = function( event ){
				event.preventDefault();
				status.isTouched = true;
				status.currentTouchX = event.touches[0].pageX;
				status.currentTouchY = event.touches[0].pageY;
			},
			_touchMove = function( event ){
				if( status.isTouched ){
					event.preventDefault();
					status.shiftX = event.touches[0].pageX - status.currentTouchX;
					status.shiftY = event.touches[0].pageY - status.currentTouchY;
					_updateHandler();
				}
			},
			_touchEnd = function(){
				if( status.isTouched ){
					status.currentTouchX = 0;
					status.currentTouchY = 0;
					status.shiftX = 0;
					status.shiftY = 0;
					status.isTouched = false;
					_resetStates();
					_updateHandler();
				}
			},
			_attachTouchEvents = function(){
				touchHandler
					.addEventListener( 'touchstart', _touchStart, false );
				document
					.addEventListener( 'touchmove', _touchMove, false );
				document
					.addEventListener( 'touchend', _touchEnd, false );
			},
			_attachEvents = function(){
				document.addEventListener( 'keydown', _keyDownHandler, false );
				document.addEventListener( 'keyup', _keyUpHandler, false );

				document.getElementById( g.links.use )
					.addEventListener( 'click', _useHandler, true );
				document.getElementById( g.links.drink )
					.addEventListener( 'click', _drinkHandler, true );

				document.getElementById( 'start-game-link' )
					.addEventListener( 'click', _startGameHandler, false );

				window.addEventListener( 'resize', _resizeHandler );
			},
			_initializeLiveCycle = function(){
				liveCycleHandler = window.setInterval( _liveCycleHandler, 30 );
			};

		window.addEventListener( 'load', _initialize, false );
	})();
})();