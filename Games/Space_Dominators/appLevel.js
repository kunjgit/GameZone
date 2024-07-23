/*
    Javascript Space Game
    By Nishant kaushal  

*/

'use strict';

const tileType_ladder  = -1;
const tileType_empty   = 0;
const tileType_solid   = 1;
const tileType_dirt    = 2;
const tileType_base    = 3;
const tileType_pipeH   = 4;
const tileType_pipeV   = 5;
const tileType_glass   = 6;
const tileType_baseBack= 7;
const tileType_window  = 8;

const tileRenderOrder = -1e3;
const tileBackgroundRenderOrder = -2e3;

// level objects
let players=[], playerLives, tileLayer, tileBackgroundLayer, totalKills;

// level settings
let levelSize, level, levelSeed, levelEnemyCount, levelWarmup;
let levelColor, levelBackgroundColor, levelSkyColor, levelSkyHorizonColor, levelGroundColor;
let skyParticles, skyRain, skySoundTimer = new Timer;
let gameTimer = new Timer, levelTimer = new Timer, levelEndTimer = new Timer;

let tileBackground;
const setTileBackgroundData = (pos, data=0)=>
    pos.arrayCheck(tileCollisionSize) && (tileBackground[(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);
const getTileBackgroundData = (pos)=>
    pos.arrayCheck(tileCollisionSize) ? tileBackground[(pos.y|0)*tileCollisionSize.x+pos.x|0] : 0;

///////////////////////////////////////////////////////////////////////////////
// level generation

const resetGame=()=>
{
    levelEndTimer.unset();
    gameTimer.set(totalKills = level = 0);
    nextLevel(playerLives = 6);
}

function buildTerrain(size)
{
    tileBackground = [];
    initTileCollision(size);
    let startGroundLevel = rand(40, 60);
    let groundLevel = startGroundLevel;
    let groundSlope = rand(.5,-.5);
    let canayonWidth = 0, backgroundDelta = 0, backgroundDeltaSlope = 0;
    for(let x=0; x < size.x; x++)
    {
        // pull slope towards start ground level
        groundLevel += groundSlope = rand() < .05 ? rand(.5,-.5) :
            groundSlope + (startGroundLevel - groundLevel)/1e3;
        
        // small jump
        if (rand() < .04)
            groundLevel += rand(9,-9);

        if (rand() < .03)
        {
            // big jump
            const jumpDelta = rand(9,-9);
            startGroundLevel = clamp(startGroundLevel + jumpDelta, 80, 20);
            groundLevel += jumpDelta;
            groundSlope = rand(.5,-.5);
        }

        --canayonWidth;
        if (rand() < .005)
            canayonWidth = rand(7, 2);

        backgroundDelta += backgroundDeltaSlope;
        if (rand() < .1)
            backgroundDelta = rand(3, -1);
        if (rand() < .1)
            backgroundDelta = 0;
        if (rand() < .1)
            backgroundDeltaSlope = rand(1,-1);
        backgroundDelta = clamp(backgroundDelta, 3, -1)

        groundLevel = clamp(groundLevel, 99, 30);
        for(let y=0; y < size.y; y++)
        {
            const pos = vec2(x,y);

            let frontTile = tileType_empty;
            if (y < groundLevel && canayonWidth <= 0)
                 frontTile = tileType_dirt;

            let backTile = tileType_empty;
            if (y < groundLevel + backgroundDelta)
                 backTile = tileType_dirt;
            
            setTileCollisionData(pos, frontTile);
            setTileBackgroundData(pos, backTile);
        }
    }

    // add random holes
    for(let i=levelSize.x; i--;)
    {
        const pos = vec2(rand(levelSize.x), rand(levelSize.y-19, 19));
        for(let x = rand(9,1)|0;--x;)
        for(let y = rand(9,1)|0;--y;)
            setTileCollisionData(pos.add(vec2(x,y)), tileType_empty);
    }
}

function spawnProps(pos)
{
    if (abs(checkpointPos.x-pos.x) > 5)
    {
        new Prop(pos);
        const propPlaceSize = .51;
        if (randSeeded() < .2)
        {
            // 3 triangle prop stack
            new Prop(pos.add(vec2(propPlaceSize*2,0)));
            if (randSeeded() < .2)
                new Prop(pos.add(vec2(propPlaceSize,propPlaceSize*2)));
        }
        else if (randSeeded() < .2)
        {
            // 3 column prop stack
            new Prop(pos.add(vec2(0,propPlaceSize*2)));
            if (randSeeded() < .2)
                new Prop(pos.add(vec2(0,propPlaceSize*4)));
        }
    }
}

function buildBase()
{
    let raycastHit;
    for(let tries=99;!raycastHit;)
    {
        if (!tries--)
            return 1; // count not find pos

        const pos = vec2(randSeeded(levelSize.x-40,40), levelSize.y);

        // must not be near player start
        if (abs(checkpointPos.x-pos.x) > 30)
            raycastHit = tileCollisionRaycast(pos, vec2(pos.x, 0));
    }

    const cave = rand() < .5;
    const baseBottomCenterPos = raycastHit.int();
    const baseSize = randSeeded(20,9)|0;
    const baseFloors = cave? 1 : randSeeded(6,1)|0;
    const basementFloors = randSeeded(cave?7:4, 0)|0;
    let floorBottomCenterPos = baseBottomCenterPos.subtract(vec2(0,basementFloors*6));
    floorBottomCenterPos.y = max(floorBottomCenterPos.y, 9); // prevent going through bottom

    let floorWidth = baseSize;
    let previousFloorHeight = 0;
    for(let floor=-basementFloors; floor <= baseFloors; ++floor)
    {  
        const topFloor = floor == baseFloors;
        const groundFloor = !floor;
        const isCaveFloor = cave ? rand() < .8 | (floor == 0 && rand() < .6): 0;
        let floorHeight = isCaveFloor ? randSeeded(9,2)|0 : topFloor? 0 : groundFloor? randSeeded(9,4)|0 : randSeeded(7,2)|0;
        const floorSpace = topFloor ? 4 : max(floorHeight - 1, 0);

        let backWindow = rand() < .5;
        const windowTop = rand(4,2);

        for(let x=-floorWidth; x <= floorWidth; ++x)
        {
            const isWindow = !isCaveFloor && randSeeded() < .3;
            const hasSide = !isCaveFloor && randSeeded() < .9;

            if (cave)
                backWindow = 0;
            else if (rand() < .1)
                backWindow = !backWindow;

            if (cave && rand() < .2)
                floorHeight = clamp(floorHeight + rand(3,-3)|0, 9, 2)

            for(let y=-1; y < floorHeight; ++y)
            {
                const pos = floorBottomCenterPos.add(vec2(x,y));
                let foregroundTile = tileType_empty;
                if (isCaveFloor)
                {
                    // add ceiling and floor
                    if ( y < 0 | y == floorHeight-1)
                        foregroundTile = tileType_dirt;

                    setTileBackgroundData(pos, tileType_dirt);
                    setTileCollisionData(pos, foregroundTile);
                }
                else
                {
                    // add ceiling and floor
                    const isHorizontal = y < 0 | y == floorHeight-1;
                    if (isHorizontal)
                        foregroundTile = tileType_pipeH;

                    // add walls and windows
                    if (abs(x) == floorWidth)
                        foregroundTile = isHorizontal ? tileType_base : isWindow ? tileType_glass : tileType_pipeV;

                    let backgroundTile = foregroundTile>0||floorHeight<3? tileType_baseBack : tileType_base;
                    if (backWindow && y > 0 && y < floorHeight-windowTop && abs(x) < floorWidth-2)
                        backgroundTile = tileType_window;

                    setTileBackgroundData(pos, backgroundTile);
                    setTileCollisionData(pos, foregroundTile);
                }
            }
        }

        // add ladders to floor below
        if (!cave || !topFloor)
        for(let ladderCount=randSeeded(2)+1|0;ladderCount--;)
        {
            const x = randSeeded(floorWidth-1, -floorWidth+1)|0;
            const pos = floorBottomCenterPos.add(vec2(x,-2));

            let y=0;
            let hitBottom = 0;
            for(; y < levelSize.y; ++y)
            {
                const pos = floorBottomCenterPos.add(vec2(x,-y-1));
                if (pos.y < 2)
                {
                    // hit bottom, no ladder
                    break;
                }
                if (y && getTileCollisionData(pos) > 0 && getTileCollisionData(pos.add(vec2(0,1))) <= 0 )
                {
                    for(;y--;)
                    {
                        const pos = floorBottomCenterPos.add(vec2(x,-y-1));
                        setTileCollisionData(pos, tileType_ladder);
                    }
                    break;
                }
            }
        }

        // spawn crates
        const propCount = randSeeded(floorWidth/2)|0;
        for(let i = propCount; i--;)
            spawnProps(floorBottomCenterPos.add(vec2(randSeeded( floorWidth-2,-floorWidth+2),.5)));

        if (topFloor || floorSpace > 1)
        {
            // spawn enemies
            for(let i = propCount; i--;)
            {
                const pos = floorBottomCenterPos.add(vec2(randSeeded( floorWidth-1,-floorWidth+1),.7));
                new Enemy(pos);
            }
        }

        const oldFloorWidth = floorWidth;
        floorWidth = max(floorWidth + randSeeded(8,-8),9)|0;
        floorBottomCenterPos.y += floorHeight;
        floorBottomCenterPos.x += randSeeded(oldFloorWidth - floorWidth+1)|0;
        previousFloorHeight = floorHeight;
    }

    //checkpointPos = floorBottomCenterPos.copy(); // start player on base for testing

    // spawn random enemies and props
    for(let i=20;levelEnemyCount>0&&i--;)
    {
        const pos = vec2(floorBottomCenterPos.x + randSeeded(99, -99), levelSize.y);
        raycastHit = tileCollisionRaycast(pos, vec2(pos.x, 0));
        // must not be near player start
        if (raycastHit && abs(checkpointPos.x-pos.x) > 20)
        {
            const pos = raycastHit.add(vec2(0,2));
            randSeeded() < .7 ? new Enemy(pos) : spawnProps(pos);
        }
    }
}

function generateLevel()
{
    levelEndTimer.unset();

    // remove all objects that are not persistnt or are descendants of something persitant
    for(const o of engineObjects)
        o.destroy();
    engineObjects = [];
    engineCollideObjects = [];

    // randomize ground level hills
    buildTerrain(levelSize);

    // find starting poing for player
    let raycastHit;
    for(let tries=99;!raycastHit;)
    {
        if (!tries--)
            return 1; // count not find pos

        // start on either side of level
        checkpointPos = vec2(levelSize.x/2 + (levelSize.x/2-10-randSeeded(9))*(randSeeded()<.5?-1:1) | 0, levelSize.y);
        raycastHit = tileCollisionRaycast(checkpointPos, vec2(checkpointPos.x, 0));
    }
    checkpointPos = raycastHit.add(vec2(0,1));

    // random bases until there enough enemies
    for(let tries=99;levelEnemyCount>0;)
    {
        if (!tries--)
            return 1; // count not spawn enemies

        if (buildBase())
            return 1;
    }

    // build checkpoints
    for(let x=0; x<levelSize.x-9; )
    {
        x += rand(100,70);
        const pos = vec2(x, levelSize.y);
        raycastHit = tileCollisionRaycast(pos, vec2(pos.x, 0));
        // must not be near player start
        if (raycastHit && abs(checkpointPos.x-pos.x) > 50)
        {
            // todo prevent overhangs
            const pos = raycastHit.add(vec2(0,1));
            new Checkpoint(pos);
        }
    }
}

const groundTileStart = 8;

function makeTileLayers(level_)
{
    // create foreground layer
    tileLayer = new TileLayer(vec2(), levelSize);
    tileLayer.renderOrder = tileRenderOrder;

    // create background layer
    tileBackgroundLayer = new TileLayer(vec2(), levelSize);
    tileBackgroundLayer.renderOrder = tileBackgroundRenderOrder;

    for(let x=levelSize.x;x--;)
    for(let y=levelSize.y;y--;)
    {
        const pos = vec2(x,y);
        let tileType = getTileCollisionData(pos);
        if (tileType)
        {
            // todo pick tile, direction etc based on neighbors tile type
            let direction = rand(4)|0
            let mirror = rand(2)|0;
            let color;

            let tileIndex = groundTileStart;
            if (tileType == tileType_dirt)
            {
                tileIndex = groundTileStart+2 + rand()**3*2|0;
                color = levelColor.mutate(.03);
            }
            else if (tileType == tileType_pipeH)
            {
                tileIndex = groundTileStart+5;
                direction = 1;
            }
            else if (tileType == tileType_pipeV)
            {
                tileIndex = groundTileStart+5;
                direction = 0;
            }
            else if (tileType == tileType_glass)
            {
                tileIndex = groundTileStart+5;
                direction = 0;
                color = new Color(0,1,1,.5);
            }
            else if (tileType == tileType_base)
                tileIndex = groundTileStart+4;
            else if (tileType == tileType_ladder)
            {
                tileIndex = groundTileStart+7;
                direction = mirror = 0;
            }
            tileLayer.setData(pos, new TileLayerData(tileIndex, direction, mirror, color));
        }
        
        tileType = getTileBackgroundData(pos);
        if (tileType)
        {
            // todo pick tile, direction etc based on neighbors tile type
            const direction = rand(4)|0
            const mirror = rand(2)|0;
            let color = new Color();

            let tileIndex = groundTileStart;
            if (tileType == tileType_dirt)
            {
                tileIndex = groundTileStart +2 + rand()**3*2|0;
                color = levelColor.mutate();
            }
            else if (tileType == tileType_base)
            {
                tileIndex = groundTileStart+6;
                color = color.scale(rand(1,.7),1)
            }
            else if (tileType == tileType_baseBack)
            {
                tileIndex = groundTileStart+6;
                color = color.scale(rand(.5,.3),1).mutate();
            }
            else if (tileType == tileType_window)
            {
                tileIndex = 0;
                color = new Color(0,1,1,.5);
            }
            tileBackgroundLayer.setData(pos, new TileLayerData(tileIndex, direction, mirror, color.scale(.4,1)));
        }
    }
    tileLayer.redraw();
    tileBackgroundLayer.redraw();
}

function applyArtToLevel()
{
    makeTileLayers();
    
    // apply decoration to level tiles
    for(let x=levelSize.x;x--;)
    for(let y=levelSize.y;--y;)
    {
        decorateBackgroundTile(vec2(x,y));
        decorateTile(vec2(x,y));
    }

    generateParallaxLayers();

    if (precipitationEnable && !lowGraphicsSettings)
    {
        // create rain or snow particles
        if (skyRain = rand() < .5)
        {
            // rain
            skyParticles = new ParticleEmitter(
                vec2(), 3, 0, 0, .3, // pos, emitSize, emitTime, emitRate, emiteCone
                0, undefined,   // tileIndex, tileSize
                new Color(.8,1,1,.6), new Color(.5,.5,1,.2), // colorStartA, colorStartB
                new Color(.8,1,1,.6), new Color(.5,.5,1,.2), // colorEndA, colorEndB
                2, .1, .1, .2, 0,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                .99, 1, .5, PI, .2,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
                .5, 1              // randomness, collide, additive, randomColorLinear, renderOrder
            );
            skyParticles.elasticity = .2;
            skyParticles.trailScale = 2;
        }
        else
        {
            // snow
            skyParticles = new ParticleEmitter(
                vec2(), 3, 0, 0, .5, // pos, emitSize, emitTime, emitRate, emiteCone
                0, undefined,   // tileIndex, tileSize
                new Color(1,1,1,.8), new Color(1,1,1,.2), // colorStartA, colorStartB
                new Color(1,1,1,.8), new Color(1,1,1,.2), // colorEndA, colorEndB
                3, .1, .1, .3, .01,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                .98, 1, .2, PI, .2,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
                .5, 1              // randomness, collide, additive, randomColorLinear, renderOrder
            );
        }
        skyParticles.emitRate = precipitationEnable && rand()<.5 ? rand(500) : 0;
        skyParticles.angle = PI+rand(.5,-.5);
    }
}

function nextLevel()
{
    playerLives += 4; // three for beating a level plus 1 for respawning
    levelEnemyCount = 15 + min(level * 30, 300);
    ++level;
    levelSeed = randSeed = rand(1e9)|0;
    levelSize = vec2(min(level*99,400),200);
    levelColor = randColor(new Color(.2,.2,.2), new Color(.8,.8,.8));
    levelSkyColor = randColor(new Color(.5,.5,.5), new Color(.9,.9,.9));
    levelSkyHorizonColor = levelSkyColor.subtract(new Color(.05,.05,.05)).mutate(.3).clamp();
    levelGroundColor = levelColor.mutate().add(new Color(.3,.3,.3)).clamp();

    // keep trying until a valid level is generated
    for(;generateLevel(););

    // warm up level
    levelWarmup = 1;

    // objects that effect the level must be added here
    const firstCheckpoint = new Checkpoint(checkpointPos).setActive();

    applyArtToLevel();

    const warmUpTime = 2;
    for(let i=warmUpTime * FPS; i--;)
    {
        updateSky();
        engineUpdateObjects();
    }
    levelWarmup = 0;

    // destroy any objects that are stuck in collision
    forEachObject(0, 0, (o)=>
    {
        if (o.isGameObject && o != firstCheckpoint)
        {
            const checkBackground = o.isCheckpoint;
            (checkBackground ? getTileBackgroundData(o.pos) > 0 : tileCollisionTest(o.pos,o.size))  && o.destroy();
        }
    });

    // hack, subtract off warm up time from main game timer
    //gameTimer.time += warmUpTime;
    levelTimer.set();

    // spawn player
    players = [];
    new Player(checkpointPos);
    //new Enemy(checkpointPos.add(vec2(3))); // test enemy
}