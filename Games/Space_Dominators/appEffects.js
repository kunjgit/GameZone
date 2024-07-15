/*
    Javascript Space Game
    By Nishant kaushal  

*/

'use strict';

const precipitationEnable = 1;
const debugFire = 0;

///////////////////////////////////////////////////////////////////////////////
// sounds

const sound_shoot =        [,,90,,.01,.03,4,,,,,,,9,50,.2,,.2,.01];
const sound_destroyTile =  [.5,,1e3,.02,,.2,1,3,.1,,,,,1,-30,.5,,.5];
const sound_die =          [.5,.4,126,.05,,.2,1,2.09,,-4,,,1,1,1,.4,.03];
const sound_jump =         [.4,.2,250,.04,,.04,,,1,,,,,3];
const sound_dodge =        [.4,.2,150,.05,,.05,,,-1,,,,,4,,,,,.02];
const sound_walk =         [.3,.1,70,,,.01,4,,,,-9,.1,,,,,,.5];
const sound_explosion =    [2,.2,72,.01,.01,.2,4,,,,,,,1,,.5,.1,.5,.02];
const sound_checkpoint =   [.6,0,500,,.04,.3,1,2,,,570,.02,.02,,,,.04];
const sound_rain =         [.02,,1e3,2,,2,,,,,,,,99];
const sound_wind =         [.01,.3,2e3,2,1,2,,,,,,,1,2,,,,,,.1];
const sound_grenade =      [.5,.01,300,,,.02,3,.22,,,-9,.2,,,,,,.5];

///////////////////////////////////////////////////////////////////////////////
// special effects

const persistentParticleDestroyCallback = (particle)=>
{
    // copy particle to tile layer on death
    ASSERT(particle.tileIndex < 0); // quick draw to tile layer uses canvas 2d so must be untextured
    if (particle.groundObject)
        tileLayer.drawTile(particle.pos, particle.size, particle.tileIndex, particle.tileSize, particle.color, particle.angle, particle.mirror);
}

function makeBlood(pos, amount=50)
{
    const emitter = new ParticleEmitter(
        pos, 1, .1, amount, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        undefined, undefined,   // tileIndex, tileSize
        new Color(1,0,0), new Color(.5,0,0), // colorStartA, colorStartB
        new Color(1,0,0), new Color(.5,0,0), // colorEndA, colorEndB
        3, .1, .1, .1, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        1, .95, .7, PI, 0,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 1              // randomness, collide, additive, randomColorLinear, renderOrder
    );
    emitter.particleDestroyCallback = persistentParticleDestroyCallback;
    return emitter;
}

function makeFire(pos = vec2())
{
    return new ParticleEmitter(
        pos, 1, 0, 60, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        0, undefined,   // tileIndex, tileSize
        new Color(1,1,0), new Color(1,.5,.5), // colorStartA, colorStartB
        new Color(1,0,0), new Color(1,.5,.1), // colorEndA, colorEndB
        .5, .5, .1, .01, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .95, .1, -.05, PI, .5,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 0, 1);             // randomness, collide, additive, randomColorLinear, renderOrder
}

function makeDebris(pos, color = new Color, amount = 100)
{
    const color2 = color.lerp(new Color, .5);
    const emitter = new ParticleEmitter(
        pos, 1, .1, amount, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        undefined, undefined, // tileIndex, tileSize
        color, color2,       // colorStartA, colorStartB
        color, color2,       // colorEndA, colorEndB
        3, .2, .2, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        1, .95, .4, PI, 0,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 1               // randomness, collide, additive, randomColorLinear, renderOrder
    );
    emitter.elasticity = .3;
    emitter.particleDestroyCallback = persistentParticleDestroyCallback;
    return emitter;
}

function makeWater(pos, amount=400)
{
    // overall spray
    new ParticleEmitter(
        pos, 1, .05, 400, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        0, undefined,        // tileIndex, tileSize
        new Color(1,1,1,.5), new Color(.5,1,1,.2), // colorStartA, colorStartB
        new Color(1,1,1,.5), new Color(.5,1,1,.2), // colorEndA, colorEndB
        .5, .5, 2, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .9, 1, 0, PI, .5,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 0, 0, 0, 1e9              // randomness, collide, additive, randomColorLinear, renderOrder
    );

    // droplets
    const emitter = new ParticleEmitter(
        pos, 1, .1, amount, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        0, undefined,   // tileIndex, tileSize
        new Color(.8,1,1,.6), new Color(.5,.5,1,.2), // colorStartA, colorStartB
        new Color(.8,1,1,.6), new Color(.5,.5,1,.2), // colorEndA, colorEndB
        2, .1, .1, .2, 0,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .99, 1, .5, PI, .2,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 1              // randomness, collide, additive, randomColorLinear, renderOrder
    );
    emitter.elasticity = .2;
    emitter.trailScale = 2;

    // put out fires
    const radius = 3;
    forEachObject(pos, 3, (o)=> 
    {
        if (o.isGameObject)
        {
            o.burnTimer.isSet() && o.extinguish();
            const d = o.pos.distance(pos);
            const p = percent(d, radius/2, radius);
            const force = o.pos.subtract(pos).normalize(p*radius*.2);
            o.applyForce(force);
            if (o.isDead && o.isDead())
                o.angleVelocity += randSign()*rand(radius/4,.3);
        }
    });

    debugFire && debugCircle(pos, radius, '#0ff', 1)

    return emitter;
}

///////////////////////////////////////////////////////////////////////////////

function explosion(pos, radius=2)
{
    ASSERT(radius > 0);
    if (levelWarmup)
        return;

    const damage = radius*2;

    // destroy level
    for(let x = -radius; x < radius; ++x)
    {
        const h = (radius**2 - x**2)**.5;
        for(let y = -h; y <= h; ++y)
            destroyTile(pos.add(vec2(x,y)), 0, 0);
    }

    // cleanup neighbors
    const cleanupRadius = radius + 1;
    for(let x = -cleanupRadius; x < cleanupRadius; ++x)
    {
        const h = (cleanupRadius**2 - x**2)**.5;
        for(let y = -h; y < h; ++y)
            decorateTile(pos.add(vec2(x,y)).int());
    }

    // kill/push objects
    const maxRangeSquared = (radius*1.5)**2;
    forEachObject(pos, radius*3, (o)=> 
    {
        const d = o.pos.distance(pos);
        if (o.isGameObject)
        {
            // do damage
            d < radius && o.damage(damage);

            // catch fire
            d < radius*1.5 && o.burn();
        }

        // push
        const p = percent(d, radius, 2*radius);
        const force = o.pos.subtract(pos).normalize(p*radius*.2);
        o.applyForce(force);
        if (o.isDead && o.isDead())
            o.angleVelocity += randSign()*rand(p*radius/4,.3);
    });

    playSound(sound_explosion, pos);
    debugFire && debugCircle(pos, maxRangeSquared**.5, '#f00', 2);
    debugFire && debugCircle(pos, radius**.5, '#ff0', 2);

    // smoke
    new ParticleEmitter(
        pos, radius/2, .2, 50*radius, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        0, undefined,        // tileIndex, tileSize
        new Color(0,0,0), new Color(0,0,0), // colorStartA, colorStartB
        new Color(0,0,0,0), new Color(0,0,0,0), // colorEndA, colorEndB
        1, .5, 2, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .9, 1, -.3, PI, .1,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 0, 0, 0, 1e8              // randomness, collide, additive, randomColorLinear, renderOrder
    );

    // fire
    new ParticleEmitter(
        pos, radius/2, .1, 100*radius, PI, // pos, emitSize, emitTime, emitRate, emiteCone
        0, undefined,        // tileIndex, tileSize
        new Color(1,.5,.1), new Color(1,.1,.1), // colorStartA, colorStartB
        new Color(1,.5,.1,0), new Color(1,.1,.1,0), // colorEndA, colorEndB
        .5, .5, 2, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .9, 1, 0, PI, .05,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
        .5, 0, 1, 0, 1e9              // randomness, collide, additive, randomColorLinear, renderOrder
    );
}

///////////////////////////////////////////////////////////////////////////////

class TileCascadeDestroy extends EngineObject 
{
    constructor(pos, cascadeChance=1, glass=0)
    {
        super(pos, vec2());
        this.cascadeChance = cascadeChance;
        this.destroyTimer = new Timer(glass ? .05 : rand(.3, .1));
    }

    update()
    {
        if (this.destroyTimer.elapsed())
        {
            destroyTile(this.pos, 1, 1, this.cascadeChance);
            this.destroy();
        }
    }
}

function decorateBackgroundTile(pos)
{
    const tileData = getTileBackgroundData(pos);
    if (tileData <= 0)
        return; // no need to clear if background cant change

    // round corners
    for(let i=4;i--;)
    {
        // check corner neighbors
        const neighborTileDataA = getTileBackgroundData(pos.add(vec2().setAngle(i*PI/2)));
        const neighborTileDataB = getTileBackgroundData(pos.add(vec2().setAngle((i+1)%4*PI/2)));

        if (neighborTileDataA > 0 | neighborTileDataB > 0)
            continue;

        const directionVector = vec2().setAngle(i*PI/2+PI/4, 10).int();
        let drawPos = pos.add(vec2(.5))            // center
            .scale(16).add(directionVector).int(); // direction offset

        // clear rect without any scaling to prevent blur from filtering
        const s = 2;
        tileBackgroundLayer.context.clearRect(
            drawPos.x - s/2|0, 
            tileBackgroundLayer.canvas.height - drawPos.y - s/2|0, 
            s|0, s|0);
    }
}

function decorateTile(pos)
{
    ASSERT((pos.x|0) == pos.x && (pos.y|0)== pos.y);
    const tileData = getTileCollisionData(pos);
    if (tileData <= 0)
    {
        tileData || tileLayer.setData(pos, new TileLayerData, 1); // force it to clear if it is empty
        return;
    }

    if (tileData != tileType_dirt &
            tileData != tileType_base &
            tileData != tileType_pipeV &
            tileData != tileType_pipeH &
            tileData != tileType_solid)
        return;

    for(let i=4;i--;)
    {
        // outline towards neighbors of differing type
        const neighborTileData = getTileCollisionData(pos.add(vec2().setAngle(i*PI/2)));
        if (neighborTileData == tileData)
            continue;

        // hacky code to make pixel perfect outlines
        let size = tileData == tileType_dirt ? vec2( rand(16,8), 2) : vec2( 16, 1);
        i&1 && (size = size.flip());

        const color = tileData == tileType_dirt ? levelGroundColor.mutate(.1) : new Color(.1,.1,.1);
        tileLayer.context.fillStyle = color.rgba();
        const drawPos = pos.scale(16);
        if (tileData == tileType_dirt)
            tileLayer.context.fillRect(
                drawPos.x +   ((i==1?14:0)+(i&1?0:8-size.x/2)) |0, 
                tileLayer.canvas.height - drawPos.y + ((i==0?-14:0)-(i&1?8-size.y/2:0)) |0, 
                size.x|0, -size.y|0);
        else
            tileLayer.context.fillRect(
                drawPos.x +  (i==1?15:0) |0, 
                tileLayer.canvas.height - drawPos.y + (i==0?-15:0) |0, 
                size.x|0, -size.y|0);
    }
}

function destroyTile(pos, makeSound = 1, cleanNeighbors = 1, maxCascadeChance = 1)
{
    // pos must be an int
    pos = pos.int();

    // destroy tile
    const tileType = getTileCollisionData(pos);

    if (!tileType) return 1;                  // empty
    if (tileType == tileType_solid) return 0; // indestructable

    const centerPos = pos.add(vec2(.5));
    const layerData = tileLayer.getData(pos);
    if (layerData)
    {
        makeDebris(centerPos, layerData.color.mutate());
        makeSound && playSound(sound_destroyTile, centerPos);

        setTileCollisionData(pos, tileType_empty);
        tileLayer.setData(pos, new TileLayerData, 1); // set and clear tile

        // cleanup neighbors
        if (cleanNeighbors)
        {
            for(let i=-1;i<=1;++i)
            for(let j=-1;j<=1;++j)
                decorateTile(pos.add(vec2(i,j)));
        }

        // if weak earth, random chance of delayed destruction of tile directly above
        if (tileType == tileType_glass)
        {
            maxCascadeChance = 1;
            if (getTileCollisionData(pos.add(vec2(0,-1))) == tileType)
                new TileCascadeDestroy(pos.add(vec2(0,-1)), 1, 1);
        }
        else if (tileType != tileType_dirt)
            maxCascadeChance = 0;

        if (rand() < maxCascadeChance && getTileCollisionData(pos.add(vec2(0,1))) == tileType)
            new TileCascadeDestroy(pos.add(vec2(0,1)), maxCascadeChance * .4, tileType == tileType_glass);
    }

    return 1;
}

///////////////////////////////////////////////////////////////////////////////

function drawStars()
{
    randSeed = levelSeed;
    for(let i = lowGraphicsSettings ? 400 : 1e3; i--;)
    {
        let size = randSeeded(6, 1);
        let speed = randSeeded() < .9 ? randSeeded(5) : randSeeded(99,9);
        let color = (new Color).setHSLA(randSeeded(.2,-.3), randSeeded()**9, randSeeded(1,.5), randSeeded(.9,.3));
        if (i < 9)
        {
            // suns or moons
            size = randSeeded()**3*99 + 9;
            speed = randSeeded(5);
            color = (new Color).setHSLA(randSeeded(), randSeeded(), randSeeded(1,.5)).add(levelSkyColor.scale(.5)).clamp();
        }
        
        const w = mainCanvas.width+400, h = mainCanvas.height+400;
        const screenPos = vec2(
            (randSeeded(w)+time*speed)%w-200,
            (randSeeded(h)+time*speed*randSeeded(1,.2))%h-200);

        if (lowGraphicsSettings)
        {
            // drawing stars with gl wont work in low graphics mode, just draw rects
            mainContext.fillStyle = color.rgba();
            if (size < 9)
                mainContext.fillRect(screenPos.x, screenPos.y, size, size);
            else
                mainContext.beginPath(mainContext.fill(mainContext.arc(screenPos.x, screenPos.y, size, 0, 9)));
        }
        else
            drawTileScreenSpace(screenPos, vec2(size), 0, vec2(16), color);
    }
}

function updateSky()
{
    if (!skyParticles)
        return;

    let skyParticlesPos = cameraPos.add(vec2(rand(-40,40),0));
    const raycastHit = tileCollisionRaycast(vec2(skyParticlesPos.x, levelSize.y), vec2(skyParticlesPos.x, 0));
    if (raycastHit && raycastHit.y > cameraPos.y+10)
        skyParticlesPos = raycastHit;
    skyParticles.pos = skyParticlesPos.add(vec2(0,20));
    
    if (rand() < .002)
    {
        skyParticles.emitRate = clamp(skyParticles.emitRate + rand(200,-200), 500);
        skyParticles.angle = clamp(skyParticles.angle + rand(.3,-.3),PI+.5,PI-.5);
    }
   
    if (!levelWarmup && !skySoundTimer.active())
    {
        skySoundTimer.set(rand(2,1));
        playSound(skyRain ? sound_rain : sound_wind, skyParticlesPos, 20, skyParticles.emitRate/1e3);
        if (rand() < .1)
            playSound(sound_wind, skyParticlesPos, 20, rand(skyParticles.emitRate/1e3));
    }
}

///////////////////////////////////////////////////////////////////////////////

let tileParallaxLayers = [];

function generateParallaxLayers()
{
    tileParallaxLayers = [];
    for(let i=0; i<3; ++i)
    {
        const parallaxSize = vec2(600,300), startGroundLevel = rand(99,120)+i*30;
        const tileParallaxLayer = tileParallaxLayers[i] = new TileLayer(vec2(), parallaxSize);
        let groundLevel = startGroundLevel, groundSlope = rand(1,-1);
        tileParallaxLayer.renderOrder = -3e3+i;
        tileParallaxLayer.canvas.width = parallaxSize.x;

        const layerColor = levelColor.mutate(.2).lerp(levelSkyColor,.95-i*.15);
        const gradient = tileParallaxLayer.context.fillStyle = tileParallaxLayer.context.createLinearGradient(0,0,0,tileParallaxLayer.canvas.height = parallaxSize.y);
        gradient.addColorStop(0,layerColor.rgba());
        gradient.addColorStop(1,layerColor.subtract(new Color(1,1,1,0)).mutate(.1).clamp().rgba());

        for(let x=parallaxSize.x;x--;)
        {
            // pull slope towards start ground level
            tileParallaxLayer.context.fillRect(x,groundLevel += groundSlope = rand() < .05 ? rand(1,-1) :
                groundSlope + (startGroundLevel - groundLevel)/2e3,1,parallaxSize.y)
        }
    }
}

function updateParallaxLayers()
{
    tileParallaxLayers.forEach((tileParallaxLayer, i)=>
    {
        const distance = 4+i;
        const parallax = vec2(150,30).scale((i*i+1));
        const cameraDeltaFromCenter = cameraPos.subtract(levelSize.scale(.5)).divide(levelSize.scale(-.5).divide(parallax));
        tileParallaxLayer.scale = vec2(distance/cameraScale);
        tileParallaxLayer.pos = cameraPos
            .subtract(tileParallaxLayer.size.multiply(tileParallaxLayer.scale).scale(.5))
            .add(cameraDeltaFromCenter.scale(1/cameraScale))
            .subtract(vec2(0,150/cameraScale))
    });
}