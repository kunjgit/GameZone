//=============================================================================
// AI reference book: "玩 Lode Runner 學 C 語言"
// http://www.kingstone.com.tw/book/book_page.asp?kmcode=2014710650538
//=============================================================================

var STATE_OK_TO_MOVE = 1, STATE_FALLING = 2;

function moveRunner()
{
	var x = runner.pos.x;
	var xOffset = runner.pos.xOffset;
	var y = runner.pos.y;
	var yOffset = runner.pos.yOffset;
	
	var curState;
	var curToken, nextToken;
	
	curToken = map[x][y].base;
	
	if ( curToken == LADDR_T || (curToken == BAR_T && yOffset == 0) ) { //ladder & bar
		curState = STATE_OK_TO_MOVE; //ok to move (on ladder or bar)
	} else if (yOffset < 0) {  //no ladder && yOffset < 0 ==> falling 
		curState = STATE_FALLING;
	} else if (y < maxTileY) { //no laddr && y < maxTileY && yOffset >= 0

		nextToken = map[x][y+1].act; 
		
		switch (true) {
		case (nextToken == EMPTY_T):
			curState = STATE_FALLING;
			break;
		case ( nextToken == BLOCK_T || nextToken == LADDR_T || nextToken == SOLID_T):
			curState = STATE_OK_TO_MOVE;
			break;	
		case ( nextToken == GUARD_T):
			curState = STATE_OK_TO_MOVE;
			break;
		default:
			curState = STATE_FALLING;
			break;	
		}
	} else { // no laddr && y == maxTileY 
		curState = STATE_OK_TO_MOVE;
	}
		
	if ( curState == STATE_FALLING ) {
		stayCurrPos = ( y >= maxTileY ||
			(nextToken = map[x][y+1].act) == BLOCK_T ||
			 nextToken == SOLID_T || nextToken == GUARD_T);
		
		runnerMoveStep(ACT_FALL, stayCurrPos);
		return;
	}
	
	/****** Check Key Action ******/
	
	var moveStep = ACT_STOP;
	var stayCurrPos = 1;
	
	switch(keyAction) {
	case ACT_UP:
		stayCurrPos = ( y <= 0 ||
			 ( nextToken = map[x][y-1].act) == BLOCK_T ||
			   nextToken == SOLID_T || nextToken == TRAP_T );
			
		if (y > 0 && map[x][y].base != LADDR_T && yOffset < H4 && yOffset > 0 && map[x][y+1].base == LADDR_T)
		{
			stayCurrPos = 1;
			moveStep = ACT_UP;
		} else
		if (!( map[x][y].base != LADDR_T &&
			(yOffset <= 0 || map[x][y+1].base != LADDR_T) ||
			(yOffset <= 0 &&  stayCurrPos ) ) 
		) {
			moveStep = ACT_UP;
		} 
			
 		break;	
	case ACT_DOWN:
		stayCurrPos = ( y >= maxTileY ||
			(nextToken = map[x][y+1].act) == BLOCK_T ||
			 nextToken == SOLID_T);	
			
		if (!(yOffset >= 0 && stayCurrPos))
			moveStep = ACT_DOWN;	
		break;
	case ACT_LEFT:
		stayCurrPos = ( x <= 0 ||
			(nextToken = map[x-1][y].act) == BLOCK_T ||
			 nextToken == SOLID_T || nextToken == TRAP_T); 
		
		if (!(xOffset <= 0 && stayCurrPos))
			moveStep = ACT_LEFT;
		break;
	case ACT_RIGHT:
		stayCurrPos = ( x >= maxTileX	||
			(nextToken = map[x+1][y].act) == BLOCK_T ||
			 nextToken == SOLID_T || nextToken == TRAP_T);
			
		if (!(xOffset >= 0 && stayCurrPos))
			moveStep = ACT_RIGHT;
		break;
	case ACT_DIG_LEFT:
	case ACT_DIG_RIGHT:
		if(ok2Dig(keyAction)) {
			runnerMoveStep(keyAction, stayCurrPos);
			digHole(keyAction);
		} else {
			runnerMoveStep(ACT_STOP, stayCurrPos);	
		}
		keyAction = ACT_STOP;
		return;	
	}		
	runnerMoveStep(moveStep, stayCurrPos);	
}

function runnerMoveStep(action, stayCurrPos )
{
	var x = runner.pos.x;
	var xOffset = runner.pos.xOffset;
	var y = runner.pos.y;
	var yOffset = runner.pos.yOffset;

	var curToken, nextToken, centerX, centerY;
	var curShape, newShape;
	
	curShape = newShape = runner.shape;
	
	centerX = centerY = ACT_STOP;
	
	switch(action)	{
	case ACT_DIG_LEFT:		
	case ACT_DIG_RIGHT:	
		xOffset = 0;
		yOffset = 0;	
		break;	
	case ACT_UP:
	case ACT_DOWN:
	case ACT_FALL:	
		if ( xOffset > 0 ) centerX = ACT_LEFT;
		else if (xOffset < 0) centerX = ACT_RIGHT;
		break;
	case ACT_LEFT:
	case ACT_RIGHT:
		if( yOffset > 0 ) centerY = ACT_UP;
		else if (yOffset < 0) centerY = ACT_DOWN;
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
			if(map[x][y].act == GUARD_T && guardAlive(x,y)) setRunnerDead(); //collision
		}
		newShape = "runUpDn";
	}
	
	if ( centerY == ACT_UP ) {
		yOffset -= yMove;
		if( yOffset < 0) yOffset = 0; //move to center Y	
	}
	
	if ( action == ACT_DOWN || action == ACT_FALL) {
		var holdOnBar = 0;
		if(curToken == BAR_T) {
			if( yOffset < 0) holdOnBar = 1;
			else {
				//when runner with bar and press down will into falling state 
				// except "laddr" or "guard" at below, 11/25/2016
				if(action == ACT_DOWN && y < maxTileY && 
					map[x][y+1].act != LADDR_T && map[x][y+1].act != GUARD_T) 
				{
					action = ACT_FALL;
				}
			}
		}
		
		yOffset += yMove;
		
		if(holdOnBar == 1 && yOffset >= 0) {
			yOffset = 0; //fall and hold on bar
			action = ACT_FALL_BAR;
		}
		if(stayCurrPos && yOffset > 0) yOffset = 0; //stay on current position
		else if(yOffset > H2) { //move to y+1 position
			if(curToken == BLOCK_T || curToken == HLADR_T) curToken = EMPTY_T; //in hole or hide laddr
			map[x][y].act = curToken; //runner move to [x][y+1], so set [x][y].act to previous state
			y++;
			yOffset = yOffset - tileH;
			if(map[x][y].act == GUARD_T && guardAlive(x,y)) setRunnerDead(); //collision
		}
		
		if(action == ACT_DOWN) { 
			newShape = "runUpDn";
		} else { //ACT_FALL or ACT_FALL_BAR
			
			if (y < maxTileY && map[x][y+1].act == GUARD_T) { //over guard
				//don't collision
				var id = getGuardId(x, y+1);
				if(yOffset > guard[id].pos.yOffset)	yOffset = guard[id].pos.yOffset;
			}

			if (action == ACT_FALL_BAR) {
				if(runner.lastLeftRight == ACT_LEFT) newShape = "barLeft";
				else newShape = "barRight";
			} else {
				if(runner.lastLeftRight == ACT_LEFT) newShape = "fallLeft";
				else newShape = "fallRight";
				
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
			if(map[x][y].act == GUARD_T && guardAlive(x,y)) setRunnerDead(); //collision
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
			if(map[x][y].act == GUARD_T && guardAlive(x,y)) setRunnerDead(); //collision
		}
		if(curToken == BAR_T) newShape = "barRight";
		else newShape = "runRight";
	}
	
	if ( centerX == ACT_RIGHT ) {
		xOffset += xMove;
		if ( xOffset > 0) xOffset = 0; //move to center X
	}
	
	if(action == ACT_STOP ) {
		if(runner.action == ACT_FALL) {
			soundStop(soundFall);
			themeSoundPlay("down");
		}
		if(runner.action != ACT_STOP){
			runner.sprite.stop();
			runner.action = ACT_STOP;
		}
	} else {
		runner.sprite.x = (x * tileW + xOffset) * tileScale | 0;
		runner.sprite.y = (y * tileH + yOffset) * tileScale | 0;
		runner.pos = { x:x, y:y, xOffset:xOffset, yOffset:yOffset};	
		if(curShape != newShape) {
			runner.sprite.gotoAndPlay(newShape);
			runner.shape = newShape;
		}
		if(action != runner.action){
			if(runner.action == ACT_FALL) {
				soundStop(soundFall);
				themeSoundPlay("down");
			} else if ( action == ACT_FALL) {
				soundPlay(soundFall);
			}
			runner.sprite.play();
		}
		if(action == ACT_LEFT || action == ACT_RIGHT) runner.lastLeftRight = action;
		runner.action = action;
	}
	map[x][y].act = RUNNER_T;
	
	//show trap tile if runner fall into the tile, 9/12/2015
	if(map[x][y].base == TRAP_T) map[x][y].bitmap.set({alpha:0.5}); //show trap tile
	
	// Check runner to get gold (MAX MOVE MUST < H4 & W4) 
	if( map[x][y].base == GOLD_T &&
		((!xOffset && yOffset >= 0 && yOffset < H4) || 
		 (!yOffset && xOffset >= 0 && xOffset < W4) || 
		 (y < maxTileY && map[x][y+1].base == LADDR_T && yOffset < H4) // gold above laddr
		)
	  )  
	{
		removeGold(x,y);
		themeSoundPlay("getGold");
		decGold();
		//debug("gold = " + goldCount);
		if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
			drawScore(SCORE_GET_GOLD);
		} else {	
			//for modern mode , edit mode
			drawGold(1); //get gold 
		}
	}
	//if(!goldCount && !goldComplete) showHideLaddr();
	
	//check collision with guard !
	checkCollision(x, y);
}

//dec gold count
function decGold()
{
	if(--goldCount <= 0) {
		showHideLaddr();
		if(runner.pos.y > 0) {
			if(curTheme == "C64")  soundPlay("goldFinish" + ((curLevel-1)%6+1)); //six sounds
			else soundPlay("goldFinish"); //for all apple2 mode, 9/12/2015
		}
	}
}

function removeGold(x,y)
{
	map[x][y].base = EMPTY_T;
	mainStage.removeChild(map[x][y].bitmap);
	map[x][y].bitmap = null;
}

function addGold(x, y)
{
	var tile;
	
	map[x][y].base = GOLD_T;
	tile = map[x][y].bitmap = getThemeBitmap("gold");
	tile.setTransform(x * tileWScale, y * tileHScale,tileScale, tileScale); //x,y, scaleX, scaleY 
	mainStage.addChild(tile); 
	
	moveSprite2Top(); //reset runner, guard & fill hole object order
}

function showHideLaddr()
{
	var haveHLadder = 0;
	for(var y = 0; y < NO_OF_TILES_Y; y++) {
		for(var x = 0; x < NO_OF_TILES_X; x++) {
			if( map[x][y].base == HLADR_T) {
				haveHLadder = 1;
				map[x][y].base =LADDR_T;
				map[x][y].act  =LADDR_T;
				map[x][y].bitmap.set({alpha:1}); //display laddr
			}
		}
	}
	goldComplete = 1;
	return haveHLadder;
}

function checkCollision(runnerX, runnerY)
{
	var x = -1, y = -1;
	//var dbg = "NO";

	switch(true) {
	case ( runnerY > 0 && map[runnerX][runnerY-1].act == GUARD_T):
		x = runnerX; y = runnerY-1;	
		//dbg = "UP";	
		break;	
	case ( runnerY < maxTileY && map[runnerX][runnerY+1].act == GUARD_T):
		x = runnerX; y = runnerY+1;	
		//dbg = "DN";	
		break;	
	case ( runnerX > 0 && map[runnerX-1][runnerY].act == GUARD_T):
		x = runnerX-1; y = runnerY;	
		//dbg = "LF";	
		break;
	case ( runnerX < maxTileX && map[runnerX+1][runnerY].act== GUARD_T):
		x = runnerX+1; y = runnerY;	
		//dbg = "RT";	
		break;	
	}
	//if( dbg != "NO") debug(dbg);
	if( x >= 0) {
		for(var i = 0; i < guardCount; i++) {
			if( guard[i].pos.x == x && guard[i].pos.y == y) break;
		}
		assert( (i < guardCount), "checkCollision design error !");
		if(guard[i].action != ACT_REBORN) { //only guard alive need check collection
			//var dw = Math.abs(runner.sprite.x - guard[i].sprite.x);
			//var dh = Math.abs(runner.sprite.y - guard[i].sprite.y);
			
      //change detect method ==> don't depend on scale 
			var runnerPosX = runner.pos.x*tileW+runner.pos.xOffset;
			var runnerPosY = runner.pos.y*tileH+runner.pos.yOffset;
			var guardPosX = guard[i].pos.x*tileW+guard[i].pos.xOffset;
			var guardPosY = guard[i].pos.y*tileH+guard[i].pos.yOffset;

			var dw = Math.abs(runnerPosX - guardPosX);
			var dh = Math.abs(runnerPosY - guardPosY);
			
			if( dw <= W4*3 && dh <= H4*3 ) {
				setRunnerDead(); //07/04/2014
				//debug("runner dead!");
			}
		}
	}
}

//Page 276 misc.c (book)
function ok2Dig(nextMove)
{
	var x = runner.pos.x;
	var y = runner.pos.y;
	var token, rc = 0;
	
	switch(nextMove) {
	case ACT_DIG_LEFT:
//		debug("[x-1][y+1] = " + map[x-1][y+1].act + " [x-1][y] = " + map[x-1][y].act + 
//			  "[x-1][y].base = " + map[x-1][y].base );
 	
		if( y < maxTileY && x > 0 && map[x-1][y+1].act == BLOCK_T &&
		    map[x-1][y].act == EMPTY_T && map[x-1][y].base != GOLD_T)
			rc = 1;
		break;
	case ACT_DIG_RIGHT:
//		debug("[x+1][y+1] = " + map[x+1][y+1].act + " [x+1][y] = " + map[x+1][y].act + 
//			  "[x+1][y].base = " + map[x+1][y].base );
 	
		if( y < maxTileY && x < maxTileX && map[x+1][y+1].act == BLOCK_T && 
		    map[x+1][y].act == EMPTY_T && map[x+1][y].base != GOLD_T)
			rc = 1;
		break;		
	}
	
	return rc;
}

//=======================
// BEGIN NEW DIG METHOD
//=======================
var digHoleLeft =	[ 0, 1,  2,  2,  3,  4,  4,  5,  6,  6,  7 ];
var digHoleRight =	[ 8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15 ];

function processDigHole()
{
	if(curAiVersion < 3) return;
	
	if(++holeObj.curFrameIdx < holeObj.shapeFrame.length) {
		// change frame
		holeObj.sprite.gotoAndStop(holeObj.shapeFrame[holeObj.curFrameIdx]);
		holeObj.sprite.currentAnimationFrame = holeObj.curFrameIdx;
	} else { //dig complete
		digComplete();
	}
}
//========================
// END NEW DIG METHOD 
//========================

var digTimeStart, shakeTimeStart;       //for debug       
var fillHoleTimeStart, rebornTimeStart; //for debug
function digHole(action)
{
	var x,y, holeShape;
	
	if(action == ACT_DIG_LEFT) {
		x = runner.pos.x-1;
		y = runner.pos.y;
		
		runner.shape = "digLeft";
		holeShape = "digHoleLeft";

	} else { //DIG RIGHT
		
		x = runner.pos.x+1;
		y = runner.pos.y;
		
		runner.shape = "digRight";
		holeShape = "digHoleRight";
	}
	
	soundPlay(soundDig);
	map[x][y+1].bitmap.set({alpha:0}); //hide block (replace with digging image)
	runner.sprite.gotoAndPlay(runner.shape);
		
	holeObj.action = ACT_DIGGING;
	holeObj.pos = { x: x, y: y };
	holeObj.sprite.setTransform(x * tileWScale, y * tileHScale,tileScale, tileScale);
	
	digTimeStart = recordCount; //for debug
	
	if(curAiVersion < 3) {
		holeObj.sprite.gotoAndPlay(holeShape);
		holeObj.sprite.on("animationend", digComplete);
	} else {
		if(action == ACT_DIG_LEFT) holeShape = digHoleLeft;
		else holeShape = digHoleRight; 
			
		holeObj.sprite.gotoAndStop(holeShape[0]);
		holeObj.shapeFrame = holeShape;
		holeObj.curFrameIdx = 0;
	}

	mainStage.addChild(holeObj.sprite);
}

var DEBUG_DIG=0;
function isDigging()
{
	var rc = 0;
	
	if(holeObj.action == ACT_DIGGING) {
		var x = holeObj.pos.x, y = holeObj.pos.y;
		if(map[x][y].act == GUARD_T) { //guard come close to the digging hole !
			var id = getGuardId(x, y);
			if(holeObj.sprite.currentAnimationFrame < holeObj.digLimit && guard[id].pos.yOffset > -H4) {
				if(DEBUG_DIG) loadingTxt.text = "dig : " + holeObj.sprite.currentAnimationFrame + " (X)";

				stopDigging(x,y);
			} else {
				if(DEBUG_DIG) loadingTxt.text = "dig : " + holeObj.sprite.currentAnimationFrame + " (O)";
				if(curAiVersion >= 3) { //This is a bug while AI VERSION < 3
					map[x][y+1].act = EMPTY_T; //assume hole complete
					rc = 1;
				}
			}
		} else {
			switch( runner.shape ) {
			case "digLeft":
				if(holeObj.sprite.currentAnimationFrame > 2 ) {
					runner.sprite.gotoAndStop("runLeft"); //change shape
					runner.shape = "runLeft";
					runner.action = ACT_STOP;
				}
				break;
			case "digRight":
				if(holeObj.sprite.currentAnimationFrame > 2) {
					runner.sprite.gotoAndStop("runRight"); //change shape
					runner.shape = "runRight";
					runner.action = ACT_STOP;
				}
				break;
			}
			rc = 1;
		}
	}
	return rc;
}

function stopDigging(x,y)
{
	//(1) remove holeObj
	holeObj.sprite.removeAllEventListeners ("animationend");
	holeObj.action = ACT_STOP; //no digging
	mainStage.removeChild(holeObj.sprite); 

	//(2) fill hole
	y++;
	map[x][y].act = map[x][y].base; //BLOCK_T
	assert(map[x][y].base == BLOCK_T, "fill hole != BLOCK_T");
	map[x][y].bitmap.set({alpha:1}); //display block
	
	//(3) change runner shape
	switch( runner.shape ) {
	case "digLeft":
		runner.sprite.gotoAndStop("runLeft");
		runner.shape = "runLeft";
		runner.action = ACT_STOP;
		break;
	case "digRight":
		runner.sprite.gotoAndStop("runRight");
		runner.shape = "runRight";
		runner.action = ACT_STOP;
		break;
	}
	
	soundStop(soundDig); //stop sound of digging
}

function digComplete()
{
	var x = holeObj.pos.x;
	var y = holeObj.pos.y + 1;
	
	map[x][y].act = EMPTY_T;
	holeObj.sprite.removeAllEventListeners ("animationend");
	holeObj.action = ACT_STOP; //no digging
	mainStage.removeChild(holeObj.sprite); 
	
	if(DEBUG_TIME) loadingTxt.text = "DigTime = " + (recordCount - digTimeStart);
	
	fillHole(x, y);
}

var fillHoleObj = [];
function fillHole(x, y)
{
	var fillSprite = new createjs.Sprite(holeData, "fillHole");
	
	fillSprite.pos = { x:x, y:y }; //save position 11/18/2014
	fillSprite.setTransform(x * tileWScale, y * tileHScale, tileScale, tileScale);
	
	if(curAiVersion < 3) {
		fillSprite.on("animationend", fillComplete, null, false, {obj:fillSprite} );
		fillSprite.play();
	} else {
		fillSprite.curFrameIdx  =   0;
		fillSprite.curFrameTime =  -1;
		fillSprite.gotoAndStop(fillHoleFrame[0]);
	}
	mainStage.addChild(fillSprite); 
	fillHoleObj.push(fillSprite);
	
	fillHoleTimeStart = recordCount; //for debug
}

function moveFillHoleObj2Top()
{
	for(var i = 0; i < fillHoleObj.length; i++) {
		moveChild2Top(mainStage, fillHoleObj[i]);
	}
}

function fillComplete(evt, data)
{
	//don't use "divide command", it will cause loss of accuracy while scale changed (ex: tileScale = 0.6...)
	//var x = this.x / tileWScale | 0; //this : scope default to the dispatcher
	//var y = this.y / tileHScale | 0;
	
	var fillObj = data.obj;
	var x = fillObj.pos.x, y = fillObj.pos.y; //get position 

	map[x][y].bitmap.set({alpha:1}); //display block
	fillObj.removeAllEventListeners ("animationend");
	mainStage.removeChild(fillObj);
	removeFillHoleObj(fillObj);
	
	switch(map[x][y].act) {
	case RUNNER_T : // runner dead
		//loadingTxt.text = "RUNNER DEAD"; 
		gameState = GAME_RUNNER_DEAD;
		runner.sprite.set({alpha:0}); //hidden runner --> dead
		break;
	case GUARD_T: //guard dead
		var id = getGuardId(x,y);
		if(curAiVersion >= 3 && guard[id].action == ACT_IN_HOLE) removeFromShake(id);	
		if(guard[id].hasGold > 0) { //guard has gold and not fall into the hole
			decGold(); 
			guard[id].hasGold = 0;
			guardRemoveRedhat(guard[id]); //9/4/2016	
		}
		guardReborn(x,y);
		if(playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {	
			drawScore(SCORE_GUARD_DEAD);
		} else {
			//for modern mode & edit mode
			drawGuard(1); //guard dead, add count
		}
		break;
	}
	map[x][y].act = BLOCK_T;
	
	if(DEBUG_TIME) loadingTxt.text = "FillHoleTime = " + (recordCount - fillHoleTimeStart); //for debug
}

function removeFillHoleObj(spriteObj)
{
	for(var i = 0; i < fillHoleObj.length; i++) {
		if(fillHoleObj[i] == spriteObj) {
			fillHoleObj.splice(i,1);
			return;
		}
	}
	error(arguments.callee.name, "design error !");
}

//=======================================
// BEGIN NEW fill Hold (Ai version >= 3)
//=======================================

var fillHoleFrame = [  16, 17, 18, 19];
var fillHoleTime  = [ 166,  8,  8,  4];

function initFillHoleVariable()
{
	fillHoleObj = [];
}

function processFillHole()
{
	var curIdx, curFillObj;
	
	for(var i = 0; i < fillHoleObj.length;) {
		curFillObj = fillHoleObj[i];
		curIdx = curFillObj.curFrameIdx;
		
		if(++curFillObj.curFrameTime >= fillHoleTime[curIdx]) {
			if(++curFillObj.curFrameIdx < fillHoleFrame.length) {
				//change frame
				curFillObj.curFrameTime = 0;
				curFillObj.gotoAndStop(fillHoleFrame[curFillObj.curFrameIdx]);
			} else {
				//fill hole complete 
				fillComplete(null, {obj: curFillObj});
				continue;
			}
				
		}
		i++;
	}
}
//====================
// END NEW fill Hold 
//====================

//==================================
// Check guard is alive or not 
// 2014/10/31
//==================================
function guardAlive(x, y)
{
	for(var i = 0; i < guardCount; i++) {
		if( guard[i].pos.x == x && guard[i].pos.y == y) break;
	}
	assert( (i < guardCount), "guardAlive() design error !");
	
	if(guard[i].action != ACT_REBORN) return 1; //alive
	
	return 0; //reborn
}