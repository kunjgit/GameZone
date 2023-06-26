
var movePolicy = [ [0, 0, 0, 0, 0, 0], //* move_map is used to find *//
                   [0, 1, 1, 0, 1, 1], //* wheather to move a enm   *//
                   [1, 1, 1, 1, 1, 1], //* by indexing into it with *//
                   [1, 2, 1, 1, 2, 1], //* enm_byte + num_enm +     *//
                   [1, 2, 2, 1, 2, 2], //* set_num to get a byte.   *//
                   [2, 2, 2, 2, 2, 2], //* then that byte is checked*//
                   [2, 2, 3, 2, 2, 3], //* for !=0 and then decrmnt *//
                   [2, 3, 3, 2, 3, 3], //* for next test until = 0  *// 
                   [3, 3, 3, 3, 3, 3], 
                   [3, 3, 4, 3, 3, 4],
                   [3, 4, 4, 3, 4, 4],
                   [4, 4, 4, 4, 4, 4]
				 ];	

var moveOffset = 0;
var moveId = 0;    //current guard id

var numOfMoveItems = movePolicy[0].length;

//********************************
//initial guard start move value 
//********************************
function initGuardVariable()
{
	moveOffset = moveId = 0;
}

function moveGuard()
{
	var moves;
	var curGuard;
	var x, y, yOffset;
	
	if(!guardCount) return; //no guard
	
	if( ++moveOffset >= numOfMoveItems ) moveOffset = 0;
	moves = movePolicy[guardCount][moveOffset];  // get next moves 
 
	while ( moves-- > 0) {                       // slows guard relative to runner
		if(++moveId >= guardCount) moveId = 0; 
		curGuard = guard[moveId];
		
		if(curGuard.action == ACT_IN_HOLE || curGuard.action == ACT_REBORN) {
			continue;
		}
		
		guardMoveStep(moveId, bestMove(moveId));
	}
}	

function guardMoveStep( id, action)
{
	var curGuard = guard[id];
	var x = curGuard.pos.x;
	var xOffset = curGuard.pos.xOffset;
	var y = curGuard.pos.y;
	var yOffset = curGuard.pos.yOffset;

	var curToken, nextToken;
	var centerX, centerY;
	var curShape, newShape;
	var stayCurrPos;
	
	centerX = centerY = ACT_STOP;
	curShape = newShape = curGuard.shape;

	if(curGuard.action == ACT_CLIMB_OUT && action == ACT_STOP) 
		curGuard.action = ACT_STOP; //for level 16, 30, guard will stock in hole
	
	switch(action) {
	case ACT_UP:
	case ACT_DOWN:
	case ACT_FALL:
		if ( action == ACT_UP ) {	
			stayCurrPos = ( y <= 0 ||
			                (nextToken = map[x][y-1].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == TRAP_T || 
			    	        nextToken == GUARD_T);
			
			if( yOffset <= 0 && stayCurrPos)
				action = ACT_STOP;
		} else { //ACT_DOWN || ACT_FALL
			stayCurrPos = ( y >= maxTileY ||
			                (nextToken = map[x][y+1].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == GUARD_T);	
			
			if( action == ACT_FALL && yOffset < 0 && map[x][y].base == BLOCK_T) {
				action = ACT_IN_HOLE;
				stayCurrPos = 1;
			} else {
				if ( yOffset >= 0 && stayCurrPos) 
					action = ACT_STOP;
			}
		}
		
		if ( action != ACT_STOP ) {
			if ( xOffset > 0) 
				centerX = ACT_LEFT;
			else if ( xOffset < 0)
				centerX = ACT_RIGHT;
		}
		break;
	case ACT_LEFT:
	case ACT_RIGHT:		
		if ( action == ACT_LEFT ) {
			/* original source code from book
			stayCurrPos = ( x <= 0 ||
			                (nextToken = map[x-1][y].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == TRAP_T || 
		                    nextToken == GUARD_T); 
			*/					
			// change check TRAP_T from base, 
			// for support level 41==> runner in trap will cause guard move
			stayCurrPos = ( x <= 0 ||
			                (nextToken = map[x-1][y].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == GUARD_T ||
						    map[x-1][y].base == TRAP_T); 
		
			if (xOffset <= 0 && stayCurrPos)
				action = ACT_STOP;
		} else { //ACT_RIGHT
			/* original source code from book
			stayCurrPos = ( x >= maxTileX ||
			                (nextToken = map[x+1][y].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == TRAP_T || 
		                    nextToken == GUARD_T); 
			*/
			// change check TRAP_T from base, 
			// for support level 41==> runner in trap will cause guard move
			stayCurrPos = ( x >= maxTileX ||
			                (nextToken = map[x+1][y].act) == BLOCK_T ||
			                nextToken == SOLID_T || nextToken == GUARD_T || 
		                    map[x+1][y].base == TRAP_T); 
			
			if (xOffset >= 0 && stayCurrPos)
				action = ACT_STOP;
		}
			
		if ( action != ACT_STOP ) {
			if ( yOffset > 0 ) 
				centerY = ACT_UP;
			else if ( yOffset < 0) 
				centerY = ACT_DOWN;
		}
		break;
	}
	
	curToken = map[x][y].base;

	if ( action == ACT_UP ) {
		yOffset -= yMove;

		if(stayCurrPos && yOffset < 0) yOffset = 0; //stay on current position
		else if(yOffset < -H2) { //move to y-1 position 
			if ( curToken == BLOCK_T || curToken == HLADR_T ) curToken = EMPTY_T; //in hole or hide laddr
			map[x][y].act = curToken; //runner move to [x][y-1], so set [x][y].act to previous state
			y--;
			yOffset = tileH + yOffset;
			if(map[x][y].act == RUNNER_T) setRunnerDead(); //collision
			//map[x][y].act = GUARD_T;
		}
		
		if( yOffset <= 0 && yOffset > -yMove) {
			dropGold(id); //decrease count
		}
		newShape = "runUpDn";
	}
	
	if ( centerY == ACT_UP ) {
		yOffset -= yMove;
		if( yOffset < 0) yOffset = 0; //move to center Y	
	}
	
	if ( action == ACT_DOWN || action == ACT_FALL || action == ACT_IN_HOLE) {
		var holdOnBar = 0;
		if(curToken == BAR_T) {
			if( yOffset < 0) holdOnBar = 1;
			else if(action == ACT_DOWN && y < maxTileY && map[x][y+1].act != LADDR_T) {
				action = ACT_FALL; //shape fixed: 2014/03/27
			}
		}
		
		yOffset += yMove;
		
		if(holdOnBar == 1 && yOffset >= 0) {
			yOffset = 0; //fall and hold on bar
			action = ACT_FALL_BAR;
		}
		if(stayCurrPos && yOffset > 0 ) yOffset = 0; //stay on current position
		else if(yOffset > H2) { //move to y+1 position
			if(curToken == BLOCK_T || curToken == HLADR_T) curToken = EMPTY_T; //in hole or hide laddr
			map[x][y].act = curToken; //runner move to [x][y+1], so set [x][y].act to previous state
			y++;
			yOffset = yOffset - tileH;
			if(map[x][y].act == RUNNER_T) setRunnerDead(); //collision
			//map[x][y].act = GUARD_T;
		}
		
		//add condition: AI version >= 3 will decrease drop count while guard fall
		if( ((curAiVersion >= 3 && action == ACT_FALL) || action == ACT_DOWN) && 
		     yOffset >= 0 && yOffset < yMove) 
		{ 	//try drop gold
			dropGold(id); //decrease count
		}
		
		if(action == ACT_IN_HOLE) { //check in hole or still falling
			if (yOffset < 0) {
				action = ACT_FALL; //still falling
				
				//----------------------------------------------------------------------
				//For AI version >= 4, drop gold before guard failing into hole totally
				if(curAiVersion >= 4 && curGuard.hasGold > 0) {
					if(map[x][y-1].base == EMPTY_T) {
						//drop gold above
						addGold(x, y-1);
					} else 
						decGold(); //gold disappear 
					curGuard.hasGold = 0;
					guardRemoveRedhat(curGuard); //9/4/2016
				}
				//----------------------------------------------------------------------
				
			} else { //fall into hole (yOffset MUST = 0)

				//----------------------------------------------------------------------
				//For AI version < 4, drop gold after guard failing into hole totally
				if( curGuard.hasGold > 0 ) {
					if(map[x][y-1].base == EMPTY_T) {
						//drop gold above
						addGold(x, y-1);
					} else 
						decGold(); //gold disappear 
				}
				curGuard.hasGold = 0;
				guardRemoveRedhat(curGuard); //9/4/2016
				//----------------------------------------------------------------------
				
				if( curShape == "fallRight") newShape = "shakeRight";
				else newShape = "shakeLeft";
				themeSoundPlay("trap");
				shakeTimeStart = recordCount; //for debug
				if(curAiVersion < 3) {
					curGuard.sprite.on("animationend", function() { climbOut(id); });
				} else {
					add2GuardShakeQueue(id, newShape);
				}
				
				if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
					drawScore(SCORE_IN_HOLE);
				} else {
					//for modem mode & edit mode
					//drawGuard(1); //only guard dead need add count
				}
			}
		}
		
		if(action == ACT_DOWN) {
			newShape = "runUpDn";
		} else { //ACT_FALL or ACT_FALL_BAR
			if (action == ACT_FALL_BAR) {
				if(curGuard.lastLeftRight == ACT_LEFT) newShape = "barLeft";
				else newShape = "barRight";
			} else {
				if(action == ACT_FALL && curShape != "fallLeft" && curShape != "fallRight") {
					if (curGuard.lastLeftRight == ACT_LEFT) newShape = "fallLeft";
					else newShape = "fallRight";
				}
			}
		}
	}	

	if ( centerY == ACT_DOWN ) {
		yOffset += yMove;
		if ( yOffset > 0 ) yOffset = 0; //move to center Y
	}
	
	if ( action == ACT_LEFT) {
		xOffset -= xMove;

		if(stayCurrPos && xOffset < 0) xOffset = 0; //stay on current position
		else if ( xOffset < -W2) { //move to x-1 position 
			if(curToken == BLOCK_T || curToken == HLADR_T) curToken = EMPTY_T; //in hole or hide laddr
			map[x][y].act = curToken; //runner move to [x-1][y], so set [x][y].act to previous state
			x--;
			xOffset = tileW + xOffset;
			if(map[x][y].act == RUNNER_T) setRunnerDead(); //collision
			//map[x][y].act = GUARD_T;
		}
		if( xOffset <= 0 && xOffset > -xMove) {
			dropGold(id); //try to drop gold
		}
		if(curToken == BAR_T) newShape = "barLeft";
		else newShape = "runLeft";
	}
	
	if ( centerX == ACT_LEFT ) {
		xOffset -= xMove;
		if ( xOffset < 0) xOffset = 0; //move to center X
	}
	
	if ( action == ACT_RIGHT ) {
		xOffset += xMove;

		if(stayCurrPos && xOffset > 0) xOffset = 0; //stay on current position
		else if ( xOffset > W2) { //move to x+1 position 
			if(curToken == BLOCK_T || curToken == HLADR_T) curToken = EMPTY_T; //in hole or hide laddr
			map[x][y].act = curToken; //runner move to [x+1][y], so set [x][y].act to previous state
			x++;
			xOffset = xOffset - tileW;
			if(map[x][y].act == RUNNER_T) setRunnerDead(); //collision
			//map[x][y].act = GUARD_T;
		}
		if( xOffset >= 0 && xOffset < xMove) {
			dropGold(id);
		}
		if(curToken == BAR_T) newShape = "barRight";
		else newShape = "runRight";
	}
	
	if ( centerX == ACT_RIGHT ) {
		xOffset += xMove;
		if ( xOffset > 0) xOffset = 0; //move to center X
	}
 
	//if(curGuard == ACT_CLIMB_OUT) action == ACT_CLIMB_OUT;
	
 	if(action == ACT_STOP) {
		if(curGuard.action != ACT_STOP){
			curGuard.sprite.stop();
			if(curGuard.action != ACT_CLIMB_OUT) curGuard.action = ACT_STOP;
		}
	} else {
		if(curGuard.action == ACT_CLIMB_OUT) action = ACT_CLIMB_OUT;
		curGuard.sprite.x = (x * tileW + xOffset) * tileScale | 0;
		curGuard.sprite.y = (y * tileH + yOffset) * tileScale | 0;
		curGuard.pos = { x:x, y:y, xOffset:xOffset, yOffset:yOffset};	
		if(curShape != newShape) {
			curGuard.sprite.gotoAndPlay(newShape);
			curGuard.shape = newShape;
		}
		if(action != curGuard.action){
			curGuard.sprite.play();
		}
		curGuard.action = action;
		if(action == ACT_LEFT || action == ACT_RIGHT) curGuard.lastLeftRight = action;
	}
	map[x][y].act = GUARD_T;

	// Check to get gold and carry 
	if(map[x][y].base == GOLD_T && curGuard.hasGold == 0 &&
		((!xOffset && yOffset >= 0 && yOffset < H4) || 
		 (!yOffset && xOffset >= 0 && xOffset < W4) || 
		 (y < maxTileY && map[x][y+1].base == LADDR_T && yOffset < H4) // gold above laddr
		)
	  )  
	{
		//curGuard.hasGold = ((Math.random()*26)+14)|0; //14 - 39 
		curGuard.hasGold = ((Math.random()*26)+12)|0; //12 - 37 change gold drop steps
		guardWearRedhat(curGuard); //9/4/2016
		if(playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) 	getDemoGold(curGuard);
		if(recordMode) processRecordGold(curGuard);
		removeGold(x, y);
		//debug ("get, (x,y) = " + x + "," + y + ", offset = " + xOffset); 
	}

	//check collision again 
	//checkCollision(runner.pos.x, runner.pos.y);
}

//meanings: guard with gold
function guardWearRedhat(guard)
{
	if(redhatMode) guard.sprite.spriteSheet = redhatData;
}

//meanings: guard without gold
function guardRemoveRedhat(guard) 
{
	if(redhatMode) guard.sprite.spriteSheet = guardData;
}

function dropGold(id) 
{
	var curGuard = guard[id];
	var nextToken;
	var drop = 0;
	
	switch (true) {
	case (curGuard.hasGold > 1):
		curGuard.hasGold--; // count > 1,  don't drop it only decrease count 
		//loadingTxt.text = "(" + id + ") = " + curGuard.hasGold;
		break;	
	case (curGuard.hasGold == 1): //drop gold
		var x = curGuard.pos.x, y = curGuard.pos.y;
		
		if(map[x][y].base == EMPTY_T && ( y >= maxTileY ||
		   ((nextToken = map[x][y+1].base) == BLOCK_T || 
			nextToken == SOLID_T || nextToken == LADDR_T) )
		) {
			addGold(x,y);
			curGuard.hasGold = -1; //for record play action always use value = -1
			//curGuard.hasGold =  -(((Math.random()*10)+1)|0); //-1 ~ -10; //waiting time for get gold
			guardRemoveRedhat(curGuard); //9/4/2016	
			drop = 1;
		}
		break;	
	case (curGuard.hasGold < 0):
		curGuard.hasGold++; //wait, don't get gold till count = 0
		//loadingTxt.text = "(" + id + ") = " + curGuard.hasGold;
		break;	
	}
	return drop;
}


//=============================================
// BEGIN NEW SHAKE METHOD for AI version >= 3
//=============================================
var DEBUG_TIME = 0;
var shakeRight  = [  8,  9, 10,  9, 10,  8 ];
var shakeLeft   = [ 30, 31, 32, 31, 32, 30 ];
var shakeTime   = [ 36,  3,  3,  3,  3,  3 ];

var shakingGuardList = [];

function initStillFrameVariable()
{
	initGuardShakeVariable();
	initFillHoleVariable();
	initRebornVariable();
}

function initGuardShakeVariable()
{
	shakingGuardList = [];
	
	//-------------------------------------------------------------------------
	// Shake time extension when guard in hole,
	// so the runner can dig three hold for three guards and pass through them. 
	// The behavior almost same as original lode runner (APPLE-II version).
	// 2016/06/04
	//-------------------------------------------------------------------------
	if(curAiVersion <= 3) shakeTime = [ 36,  3,  3,  3,  3,  3 ]; //for AI VERSION = 3
	else                  shakeTime = [ 51,  3,  3,  3,  3,  3 ]; //for AI VERSION > 3
}

function add2GuardShakeQueue(id, shape)
{
	var curGuard = guard[id];
	
	if(shape == "shakeRight") {
		curGuard.shapeFrame = shakeRight;	
	} else { 
		curGuard.shapeFrame = shakeLeft;	
	}
	
	curGuard.curFrameIdx  =  0;
	curGuard.curFrameTime = -1; //for init
		
	shakingGuardList.push(id);
	//error(arguments.callee.name, "push id =" + id + "(" + shakingGuardList + ")" );
	
}

function processGuardShake()
{
	var curGuard, curIdx;
	for(var i = 0; i < shakingGuardList.length;) {
		curGuard = guard[shakingGuardList[i]];
		curIdx = curGuard.curFrameIdx;
		
		if( curGuard.curFrameTime < 0) { //start shake => set still frame
			curGuard.curFrameTime = 0;
			curGuard.sprite.gotoAndStop(curGuard.shapeFrame[curIdx]);
		} else {
			if(++curGuard.curFrameTime >= shakeTime[curIdx]) {
				if(++curGuard.curFrameIdx < curGuard.shapeFrame.length) {
					//change frame
					curGuard.curFrameTime = 0;
					curGuard.sprite.gotoAndStop(curGuard.shapeFrame[curGuard.curFrameIdx]);
				} else {
					//shake time out 
				
					var id = shakingGuardList[i];
					shakingGuardList.splice(i, 1); //remove from list
					//error(arguments.callee.name, "remove id =" + id + "(" + shakingGuardList + ")" );
					climbOut(id); //climb out
					continue;
				}
				
			}
		}
		i++;
	}
}

function removeFromShake(id)
{
	for(var i = 0; i < shakingGuardList.length;i++) {
		if(shakingGuardList[i] == id) {
			shakingGuardList.splice(i, 1); //remove from list
			//error(arguments.callee.name, "remove id =" + id + "(" + shakingGuardList + ")" );
			return;
		}
	}
	error(arguments.callee.name, "design error id =" + id + "(" + shakingGuardList + ")" );
}

//======================
// END NEW SHAKE METHOD 
//======================

function climbOut(id)
{
	var curGuard = guard[id]
	
	curGuard.action = ACT_CLIMB_OUT;
	curGuard.sprite.removeAllEventListeners ("animationend");
	curGuard.sprite.gotoAndPlay("runUpDn");
	curGuard.shape = "runUpDn";
	curGuard.holePos = {x: curGuard.pos.x, y: curGuard.pos.y };
	
	if(DEBUG_TIME) loadingTxt.text = "ShakeTime = " + (recordCount - shakeTimeStart); //for debug
}

function bestMove(id)
{
	var guarder = guard[id];
	var x = guarder.pos.x;
	var xOffset = guarder.pos.xOffset;
	var y = guarder.pos.y;
	var yOffset = guarder.pos.yOffset;
	
	var curToken, nextBelow, nextMove;
	var checkSameLevelOnly = 0;
	
	curToken = map[x][y].base;
	
	if(guarder.action == ACT_CLIMB_OUT)  { //clib from hole
		if(guarder.pos.y == guarder.holePos.y) {
			return (ACT_UP);
		}else {
			checkSameLevelOnly = 1;
			if(guarder.pos.x != guarder.holePos.x) { //out of hole
				guarder.action = ACT_LEFT;
			}
		}
	}
	
	if( !checkSameLevelOnly) {
	
		/****** next check to see if enm must fall. if so ***********/
		/****** return e_fall and skip the rest.          ***********/
	
		if ( curToken == LADDR_T || (curToken == BAR_T && yOffset === 0) ) { //ladder & bar
			/* no guard fall */ 
		} else if ( yOffset < 0) //no laddr & yOffset < 0 ==> falling
			return (ACT_FALL);
		else if ( y < maxTileY )
		{
			nextBelow = map[x][y+1].act;
			
			if ( (nextBelow == EMPTY_T || nextBelow == RUNNER_T )) {
				return (ACT_FALL);
			} else if ( nextBelow == BLOCK_T || nextBelow == SOLID_T || 
					  nextBelow == GUARD_T || nextBelow == LADDR_T ) {
				/* no guard fall */
			} else {
				return ( ACT_FALL );		
			}
		}	
	}

	/******* next check to see if palyer on same floor *********/
	/******* and whether enm can get him. Ignore walls *********/
	var runnerX = runner.pos.x;
	var runnerY = runner.pos.y;	
	
//	if ( y == runnerY ) { // same floor with runner
	if ( y == runnerY && runner.action != ACT_FALL) { //case : guard on laddr and falling => don't catch it 
		while ( x != runnerX ) {
			if ( y < maxTileY )
				nextBelow = map[x][y+1].base;
			else nextBelow = SOLID_T;
			
			curToken = map[x][y].base;
			
			if ( curToken == LADDR_T || curToken == BAR_T ||  // go through	
				 nextBelow == SOLID_T || nextBelow == LADDR_T ||
				 nextBelow == BLOCK_T || map[x][y+1].act == GUARD_T || //fixed: must check map[].act with guard_t (for support champLevel:43)
			     nextBelow == BAR_T || nextBelow == GOLD_T) //add BAR_T & GOLD_T for support level 92 
			{
				if ( x < runnerX)  // guard left to runner
					++x;	
				else if ( x > runnerX )
					--x;      // guard right to runner
			} else break;     // exit loop with closest x if no path to runner
		}
		
		if ( x == runnerX )  // scan for a path ignoring walls is a success
		{
			if (guarder.pos.x < runnerX ) {  //if left of man go right else left 
				nextMove = ACT_RIGHT;
			} else if ( guarder.pos.x > runnerX ) {
				nextMove = ACT_LEFT;
			} else { // guard X = runner X
				if ( guarder.pos.xOffset < runner.pos.xOffset )
					nextMove = ACT_RIGHT;
				else
					nextMove = ACT_LEFT;
			}
			return (nextMove); 
		}
	} // if ( y == runnerY ) { ... 
	
	/********** If can't reach man on current level, then scan floor *********/
	/********** (ignoring walls) and look up and down for best move  *********/

	return scanFloor(id);
}

var bestPath, bestRating, curRating;		
var leftEnd, rightEnd;	
var startX, startY;

function scanFloor(id)
{
	var x, y;
	var curToken, nextBelow;
	var curPath;
	
	x = startX = guard[id].pos.x;
	y = startY = guard[id].pos.y;
	
	bestRating = 255;   // start with worst rating
	curRating = 255;
	bestPath = ACT_STOP;
	
	/****** get ends for search along floor ******/
	
	while ( x > 0 ) {                                    //get left end first
		curToken = map[x-1][y].act;
		if ( curToken == BLOCK_T || curToken == SOLID_T )
			break;
		if ( curToken == LADDR_T || curToken == BAR_T || y >= maxTileY ||
		     y < maxTileY && ( ( nextBelow = map[x-1][y+1].base) == BLOCK_T ||
		     nextBelow == SOLID_T || nextBelow == LADDR_T ) )
			--x;
		else {
			--x;                                        // go on left anyway 
			break;
		}		
	}
	
	leftEnd = x;
	x = startX;
	while ( x < maxTileX ) {                           // get right end next
		curToken = map[x+1][y].act;
		if ( curToken  == BLOCK_T || curToken == SOLID_T )
			break;
		
		if ( curToken == LADDR_T || curToken == BAR_T || y >= maxTileY ||
		     y < maxTileY && ( ( nextBelow = map[x+1][y+1].base) == BLOCK_T ||
		     nextBelow == SOLID_T || nextBelow == LADDR_T ) )
			++x;
		else {                                         // go on right anyway
			++x;                                        
			break;
		}		
	}
	
	rightEnd = x;

	/******* Do middle scan first for best rating and direction *******/
	
	x = startX;
	if ( y < maxTileY && 
		 (nextBelow = map[x][y+1].base) != BLOCK_T && nextBelow != SOLID_T )
		scanDown( x, ACT_DOWN ); 

	if( map[x][y].base == LADDR_T )
		scanUp( x, ACT_UP );

	/******* next scan both sides of floor for best rating *******/

	curPath = ACT_LEFT;
	x = leftEnd; 
	
	while ( true ) {
		if ( x == startX ) {
			if ( curPath == ACT_LEFT && rightEnd != startX ) {
				curPath = ACT_RIGHT;
				x = rightEnd;
			}
			else break;
		}
	
		if( y < maxTileY && 
			(nextBelow = map [x][y+1].base) != BLOCK_T && nextBelow != SOLID_T )
			scanDown (x, curPath );

		if( map[x][y].base == LADDR_T )
			scanUp ( x, curPath );
		
		if ( curPath == ACT_LEFT )
			x++;
		else x--;	
	}	

	
	return ( bestPath );	
}                           // end scan floor for best direction to go  
	
function scanDown(x, curPath ) 
{
	var y;
	var nextBelow; //curRating;
	var runnerX = runner.pos.x;
	var runnerY = runner.pos.y;
	
	y = startY;
	
	while( y < maxTileY && ( nextBelow = map [x][y+1].base) != BLOCK_T &&
		    nextBelow != SOLID_T )                  // while no floor below ==> can move down
	{
		if ( map[x][y].base != EMPTY_T && map[x][y].base != HLADR_T) { // if not falling ==> try move left or right 
			//************************************************************************************
			// 2014/04/14 Add check  "map[x][y].base != HLADR_T" for support 
			// champLevel 19: a guard in hole with h-ladder can run left after dig the left hole
			//************************************************************************************
			if ( x > 0 ) {                          // if not at left edge check left side
				if ( (nextBelow = map[x-1][y+1].base) == BLOCK_T ||
					nextBelow == LADDR_T || nextBelow == SOLID_T ||
					map[x-1][y].base == BAR_T )     // can move left       
				{
					if ( y >= runnerY )             // no need to go on
						break;                      // already below runner
				}
			}	
			
			if ( x < maxTileX )                     // if not at right edge check right side
			{
				if ( (nextBelow = map[x+1][y+1].base) == BLOCK_T ||
					nextBelow == LADDR_T || nextBelow == SOLID_T ||
					map[x+1][y].base == BAR_T )     // can move right
				{
					if ( y >= runnerY )
						break;
				}
			}
		}                                           // end if not falling
		++y;                                        // go to next level down
	}                                               // end while ( y < maxTileY ... ) scan down
	
	if( y == runnerY ) {                            // update best rating and direct.
		curRating = Math.abs(startX - x); 
//		if ( (curRating = runnerX - x) < 0) //BUG from original book ? (changed by Simon)
//			curRating = -curRating; //ABS
	} else if ( y > runnerY )
		curRating = y - runnerY + 200;               // position below runner
	else curRating = runnerY - y + 100;              // position above runner
	
	if( curRating < bestRating )
	{
		bestRating = curRating;
		bestPath = curPath;
	}
	
}                                                   // end Scan Down

function scanUp( x, curPath )
{
	var y;
	var nextBelow; //curRating;
	var runnerX = runner.pos.x;
	var runnerY = runner.pos.y;
	
	y = startY;
	
	while ( y > 0 && map[x][y].base == LADDR_T ) {  // while can go up
		--y;
		if ( x > 0 ) {                              // if not at left edge check left side
			if ( (nextBelow = map[x-1][y+1].base) == BLOCK_T ||
				nextBelow == SOLID_T || nextBelow == LADDR_T ||
				map[x-1][y].base == BAR_T )         // can move left
			{
				if ( y <= runnerY )                 // no need to go on 
					break;                          // already above runner
			}
		}

		if ( x < maxTileX ) {                       // if not at right edge check right side
			if ( (nextBelow = map[x+1][y+1].base) == BLOCK_T ||
				nextBelow == SOLID_T || nextBelow == LADDR_T ||
				map[x+1][y].base == BAR_T )         // can move right
			{
				if ( y <= runnerY )
					break;
			}
		}  
		//--y;
	}                                               // end while ( y > 0 && laddr up) scan up 
	
	if ( y == runnerY ) {                           // update best rating and direct.
		curRating = Math.abs(startX - x);
		//if ( (curRating = runnerX - x) < 0) // BUG from original book ? (changed by Simon)
		//	curRating = -curRating; //ABS
	} else if ( y > runnerY )
		curRating = y - runnerY + 200;              // position below runner   
	else curRating = runnerY - y + 100;             // position above runner    
	
	if ( curRating < bestRating )
	{
		bestRating = curRating;
		bestPath = curPath;
	}
	
}                                                   // end scan Up

var bornRndX; //range random 0..maxTileX

function initRnd()
{
	//bornRndX = new rangeRandom(0, maxTileX, curLevel); //set fixed seed for demo mode
	bornRndX = new rangeRandom(0, maxTileX, 0); //random range 0 .. maxTileX
}

function getGuardId(x, y)
{
	var id;
	
	for(id = 0; id < guardCount; id++) {
		if ( guard[id].pos.x == x && guard[id].pos.y == y) break;
	}
	assert(id < guardCount, "Error: can not get guard position!");
	
	return id;
}

function guardReborn(x, y)
{
	var id;
	
	//get guard id  by current in hole position
	id = getGuardId(x, y);

	var bornY = 1; //start on line 2
	var bornX = bornRndX.get();
	var rndStart = bornX;
	
	
	while(map[bornX][bornY].act != EMPTY_T || map[bornX][bornY].base == GOLD_T || map[bornX][bornY].base == BLOCK_T ) { 
		//BUG FIXED for level 115 (can not reborn at bornX=27)
		//don't born at gold position & diged position, 2/24/2015
		if( (bornX = bornRndX.get()) == rndStart) {                               
			bornY++;
		}
		assert(bornY <= maxTileY, "Error: Born Y too large !");
	}
	//debug("bornX = " + bornX);
	if(playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) {
		var bornPos = getDemoBornPos();
		bornX = bornPos.x;
		bornY = bornPos.y;
	}
	
	if(recordMode == RECORD_KEY) saveRecordBornPos(bornX, bornY);
	else if(recordMode == RECORD_PLAY) {
		var bornPos = getRecordBornPos();
		bornX = bornPos.x;
		bornY = bornPos.y;
	}
	
	map[bornX][bornY].act = GUARD_T;
	//debug("born (x,y) = (" + bornX + "," + bornY + ")");
	
	var curGuard = guard[id];
	
	curGuard.pos = { x:bornX, y:bornY, xOffset:0, yOffset: 0 };
	curGuard.sprite.x = bornX * tileWScale | 0;
	curGuard.sprite.y = bornY * tileHScale | 0;
	
	rebornTimeStart = recordCount;
	if(curAiVersion < 3) {
		curGuard.sprite.on("animationend", function() { rebornComplete(id); });
		curGuard.sprite.gotoAndPlay("reborn");
	} else {
		add2RebornQueue(id);
	}

	curGuard.shape = "reborn";
	curGuard.action = ACT_REBORN;
	
}

function rebornComplete(id)
{
	var x = guard[id].pos.x;
	var y = guard[id].pos.y;

	if( map[x][y].act == RUNNER_T) setRunnerDead(); //collision
	map[x][y].act  = GUARD_T; 
	guard[id].sprite.removeAllEventListeners ("animationend");
	guard[id].action = ACT_FALL;
	guard[id].shape = "fallRight";
	//guard[id].hasGold = 0;
	guard[id].sprite.gotoAndPlay("fallRight");
	themeSoundPlay("reborn");
	
	if(DEBUG_TIME) loadingTxt.text = "rebornTime = " + (recordCount - rebornTimeStart); //for debug
}

function setRunnerDead()
{
	if(!godMode) gameState = GAME_RUNNER_DEAD; 
}

//===============================================
// BEGIN NEW FOR REBORN (ai version >= 3)
//===============================================
var rebornFrame = [ 28, 29 ];
var rebornTime  = [  6,  2 ];

var rebornGuardList = [];

function initRebornVariable()
{
	rebornGuardList = [];
}

function add2RebornQueue(id)
{
	var curGuard = guard[id];
	
	curGuard.sprite.gotoAndStop("reborn");
	curGuard.curFrameIdx  =   0;
	curGuard.curFrameTime =  -1;
		
	rebornGuardList.push(id);
}

function processReborn()
{
	var curGuard, curIdx;
	
	for(var i = 0; i < rebornGuardList.length;) {
		curGuard = guard[rebornGuardList[i]];
		curIdx = curGuard.curFrameIdx;
		
		if(++curGuard.curFrameTime >= rebornTime[curIdx]) {
			if(++curGuard.curFrameIdx < rebornFrame.length) {
				//change frame
				curGuard.curFrameTime = 0;
				curGuard.sprite.gotoAndStop(rebornFrame[curGuard.curFrameIdx]);
			} else {
				//reborn 
				var id = rebornGuardList[i];
				rebornGuardList.splice(i, 1); //remove from list
				rebornComplete(id);
				continue;
			}
		}
		i++;
	}
}
//====================
// END NEW FOR REBORN 
//====================
