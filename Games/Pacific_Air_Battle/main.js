class MyWorld extends World
{
    static get Palette()
	{
        return( 
            {
                DarkBlue: World.HextoRGB(0x305981),
                Red: World.HextoRGB(0xff4f69),
                White: World.HextoRGB(0xfff7f8),
                Orange: World.HextoRGB(0xea7d2a),
                Yellow: World.HextoRGB(0xffda45),
                Blue: World.HextoRGB(0x68aed4),
                Green: World.HextoRGB(0x8bd155),
                DarkGreen: World.HextoRGB(0x237350),
                Black: World.HextoRGB(0x000000),
                Grey: World.HextoRGB(0x76808c)
            })
	}
    static get Altitude()
    {
        return(
        {
            DogFight: 5,
            SurfaceAttack: 1
        });
    }
    static get SoundFX()
    {
        return(
            {
                Explosion: [2.42,,749,.03,.19,.52,4,2.71,,.6,,,,1.2,,1,.37,.48,.09],
                Shoot: [0.5,,490,,.05,.08,4,1.14,-7,,,,,.4,,.2,,.5,.09,.01],
                Hit: [1.04,,365,,.01,.11,2,2.76,-4.2,4.6,,,,1.9,.3,.1,,.95,.01],
                PowerUp: [1.36,,441,.02,.12,.3,1,1.75,-7,3.9,434,.19,.1,,,,.01,.85,.14]
            })
    }
    constructor()
    {
        super();

        this.keyBinds = 
		{
			fire1: "Space",
			forward1: "KeyW",
			backward1: "KeyS",
			left1: "KeyA",
			right1: "KeyD",
            fire2: "KeyF",
			forward2: "ArrowUp",
			backward2: "ArrowDown",
			left2: "ArrowLeft",
			right2: "ArrowRight",
		};

        let keyBindsArray = Object.values(this.keyBinds);
		keyBindsArray.push("ArrowDown");
        keyBindsArray.push("ArrowUp");

		window.addEventListener("keydown", function(e)
		{
			if(keyBindsArray.indexOf(e.code) > -1)
			{
				e.preventDefault();
			}
		}, false);

        window.addEventListener("click", (e) =>
        {
            if(titleGroup.active)
            {
                this.camera.position = [20, 20, 20];
                this.camera.target = [0, 0, 0];
                this.camera.setProperties();
                this.projectionMatrix = this.orthographicProjection();
                titleGroup.active = false;
                this.removeChild(titleGroup);
                this.gameGroup.setVisible(true);
                this.gameGroup.newLevel();
            }
        });

        this.projectionMatrix = this.perspectiveProjection();
        this.camera.position = [15, 10, -100];
        this.camera.target = [0, 0, 0];
        this.camera.setProperties();
        let titleGroup = new TitleGroup(this);
        this.addChild(titleGroup);
        this.gameGroup = new GameGroup(this);
        this.addChild(this.gameGroup);
        this.gameGroup.setVisible(false);
        this.shadowGroup = new Spatial(this);
        this.addChild(this.shadowGroup);
    }
    startPropellors(numberOfProps, structures)
    {
        for(let i = 1; i <= numberOfProps; i++)
        {
            let propeller = structures[structures.length - i];
            propeller.zAngularVelocity = Math.PI * 8;
        }
    }
    isOffScreen(position)
    {
        let screenPos = this.isoCoordToScreen(position[0], position[1], position[2])
        return (screenPos[0] > this.xScreen / 2 || screenPos[0] < -this.xScreen / 2 ||
            screenPos[1] > this.yScreen / 2 || screenPos[1] < -this.yScreen / 2);
    }
    hellcatCubeDatas()
    {
        return(
        [
            [0.1875, 0, 0, 0.375, 1.1, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.1875, 0, -0.625, 0.375, 1, 0.75, 0].concat(MyWorld.Palette.DarkBlue),
            [0.1875, 0, -1.375, 0.375, 1, 0.75, 0].concat(MyWorld.Palette.DarkBlue),
            [0.1875, -0.1, -1.9375, 0.375, 0.9, 0.375, 0].concat(MyWorld.Palette.DarkBlue),
            [0.16875, 0, -2.25, 0.3375, 0.8, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0.15, 0, -2.5, 0.3, 0.7, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0.16875, -0.05, 0.5, 0.3375, 1, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.15, -0.0875, 1, 0.3, 0.825, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.13125, -0.125, 1.5, 0.2625, 0.65, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.1125, -0.1625, 2, 0.225, 0.5, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.09375, -0.1375, 2.75, 0.1875, 0.425, 1, 0].concat(MyWorld.Palette.DarkBlue),
            [0.15, 0.5125, -0.875, 0.3, 0.125, 0.25, 0].concat(MyWorld.Palette.Black),
            [0.15, 0.575, -0.5, 0.3, 0.25, 0.5, 0].concat(MyWorld.Palette.Black),
            [0.675, -0.35, -0.65, 0.6, 0.1, 1.8, 0].concat(MyWorld.Palette.DarkBlue),
            [1.275, -0.35, -0.7, 0.6, 0.1, 1.5, 0].concat(MyWorld.Palette.DarkBlue),
            [1.875, -0.35, -0.75, 0.6, 0.1, 1.2, 0].concat(MyWorld.Palette.DarkBlue),
            [2.475, -0.35, -0.8, 0.6, 0.1, 0.9, 0].concat(MyWorld.Palette.DarkBlue),
            [3.075, -0.35, -0.85, 0.6, 0.1, 0.6, 0].concat(MyWorld.Palette.DarkBlue),
            [0.375, 0.025, 2.375, 0.375, 0.1, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0.5625, 0.025, 2.625, 0.75, 0.1, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0.6875, 0.025, 3, 1, 0.1, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.025, 0.575, 3, 0.05, 1, 0.5, 0].concat(MyWorld.Palette.DarkBlue),
            [0.025, 0.45, 2.625, 0.05, 0.75, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0.025, 0.2625, 2.375, 0.05, 0.375, 0.25, 0].concat(MyWorld.Palette.DarkBlue),
            [0, 0, -2.725, 0.2, 2, 0.2, 1].concat(MyWorld.Palette.Black),
        ]);
    }
    bettyCubeDatas()
    {
        let mainColor = MyWorld.Palette.DarkGreen
        return(
            [
                [0,0,0, 1,1,1, 1].concat(mainColor),
                [0,0,-1, 1,1,1, 1].concat(mainColor),
                [0,0.05,-2, 0.8,0.9,1, 1].concat(mainColor),
                [0,0.05,-2.75, 0.6,0.7,0.5, 1].concat(mainColor),
                [0,0.05,-3.125, 0.4,0.5,0.25, 1].concat(MyWorld.Palette.Black),
                [0,0.05,-3.3125, 0.2,0.3,0.125, 1].concat(MyWorld.Palette.Black),
                [0,0.05,1.5, 0.8,0.9,2, 1].concat(mainColor),
                [0,0.125,2.75, 0.6,0.85,0.5, 1].concat(mainColor),
                [0,0.125,3.25, 0.4,0.65,0.5, 1].concat(mainColor),
                [0,0.125,3.625, 0.2,0.45,0.25, 1].concat(MyWorld.Palette.Black),
                [0,0.575,-2.35, 0.6,0.15,0.2, 1].concat(MyWorld.Palette.Black),
                [0,0.65,-1.5, 0.6,0.3,1.5, 1].concat(MyWorld.Palette.Black),
                [0,0.575,0.875, 0.6,0.15,3.25, 1].concat(mainColor),
                [0,0.8,2.125, 0.1,0.3,0.25, 1].concat(mainColor),
                [0,0.95,2.375, 0.1,0.6,0.25, 1].concat(mainColor),
                [0,1.05,2.625, 0.1,1,0.25, 1].concat(mainColor),
                [0,1.1,2.875, 0.1,1.1,0.25, 1].concat(mainColor),
                [0,0.9,3.125, 0.1,0.9,0.25, 1].concat(mainColor),
                [0,0.75,3.375, 0.1,0.6,0.25, 1].concat(mainColor),
                [0.75,0,-0.6, 0.5,0.1,1.8, 0].concat(mainColor),
                [1.25,0,-0.6, 0.5,0.1,1.6, 0].concat(mainColor),
                [1.75,0,-0.6, 0.5,0.1,1.4, 0].concat(mainColor),
                [2.25,0,-0.6, 0.5,0.1,1.2, 0].concat(mainColor),
                [2.75,0,-0.6, 0.5,0.1,1, 0].concat(mainColor),
                [3.25,0,-0.6, 0.5,0.1,0.8, 0].concat(mainColor),
                [3.75,0,-0.6, 0.5,0.1,0.6, 0].concat(mainColor),
                [4.25,0,-0.6, 0.5,0.1,0.4, 0].concat(mainColor),
                [4.625,0,-0.6, 0.25,0.1,0.2, 0].concat(mainColor),
                [1.25,0,-0.25, 0.3,0.3,0.5, 0].concat(mainColor),
                [1.25,0,-0.75, 0.4,0.4,0.5, 0].concat(mainColor),
                [1.25,0,-1.5, 0.5,0.5,1, 0].concat(mainColor),
                [1.25,0,-2.125, 0.4,0.4,0.25, 0].concat(mainColor),
                [0.6,0.4,2.625, 0.6,0.1,0.25, 0].concat(mainColor),
                [0.8,0.4,2.875, 1,0.1,0.25, 0].concat(mainColor),
                [0.9,0.4,3.125, 1.4,0.1,0.25, 0].concat(mainColor),
                [0.8,0.4,3.375, 1.2,0.1,0.25, 0].concat(mainColor),
                [1.25, 0, -2.35, 0.1, 1.1, 0.1, 1].concat(MyWorld.Palette.Black),
                [-1.25, 0, -2.35, 0.1, 1.1, 0.1, 1].concat(MyWorld.Palette.Black)
            ]);
    }
}

class TitleGroup extends Spatial
{
    constructor(world)
    {
        super(world);
        let initAircraft = () =>
        {
            displayHellCat.position = [0, 0, 150];
            displayBetty.position = [0, 0, 0];
            readyBullets = [...bullets];
            hitBullets = 0;
            displayHellCat.zRotation = 0;
            displayHellCat.zAngularVelocity = 0;
            bettyCubes.forEach((cube, index) =>
            {
                let a = bettyOGCubePositions[index];
                cube.position = [...a];
                cube.speed = [0, 0];
            });
        }
        let displayHellCat = new Spatial(world);
        let hellCatCubes = VehicleBuilder.BuildVehicle(world, world.hellcatCubeDatas(), 4);
        world.startPropellors(1, hellCatCubes);
        world.addChildren(hellCatCubes, displayHellCat);
        world.addChild(displayHellCat, this);
        displayHellCat.speed[1] = -30;
        let displayBetty = new Spatial(world);
        let bettyCubes = VehicleBuilder.BuildVehicle(world, world.bettyCubeDatas(), 4);
        world.addChildren(bettyCubes, displayBetty);
        world.addChild(displayBetty, this);
        displayBetty.speed[1] = -20;
        world.startPropellors(2, bettyCubes);
        let bettyOGCubePositions = [];
        bettyCubes.forEach((cube) =>
        {
            bettyOGCubePositions.push([...cube.position]);
        });

        let noBullets = 6
        let hitBullets = 0;
        let bullets = [];
        let readyBullets = [];
        for(let i = 0; i < noBullets; i++)
        {
            let bullet = new Spatial(world, [0,0,0], new Cube(world.gl, [1.5, 1.5, 3], MyWorld.Palette.Red));
            bullets.push(bullet);
        }
        readyBullets = [...bullets];
        let playerFireTimer = new Timer(world, 0.2);
        playerFireTimer.onComplete = () =>
        {
            let bullet = readyBullets.pop();
            if(bullet)
            {
                bullet.speed[1] = -80;
                bullet.position = [...displayHellCat.position];
                world.addChild(bullet, this);
            }
            playerFireTimer.reset(true);
        }
        playerFireTimer.reset(true);

        world.hudItems[0] = "Click to Start";
        initAircraft();
        this.update = (deltaTimeSec) =>
        {
            bullets.forEach((bullet) =>
            {
                if(bullet.position[2] < displayBetty.position[2])
                {
                    bullet.position = [0, 0, 0];
                    bullet.speed = [0, 0];
                    world.removeChild(bullet);
                    hitBullets ++;
                    if(hitBullets == 6)
                    {
                        bettyCubes.forEach((cube) =>
                        {
                            cube.speed[0] = MathsFunctions.RandomFloat(-50, 50);
                            cube.speed[1] = MathsFunctions.RandomFloat(-50, 50);
                            displayHellCat.zAngularVelocity = 1.5;
                        })
                    }
                }
            });
            if(displayHellCat.position[2] < -120)
            {
                initAircraft();
            }
        } 
    }
}

class GameGroup extends Spatial
{
	constructor(world)
	{
		super(world, [0, 0, 0]);
        this.player = null;
        this.hellCatPool = new HellCatPool();
        this.terrain = new Terrain(world);
        world.addChild(this.terrain, this);
        this.waveManager = new WaveManager(world, this.terrain);
        world.addChild(this.waveManager, this);
        this.powerUpManager = new PowerUpManager(world);
        world.addChild(this.powerUpManager, this);
        this.restartOnNextFrame = false;
        this.onLevelReset = new Signal();
        this.bulletGroup = new Spatial(world, [0,0,0]);
        world.addChild(this.bulletGroup, this);
        this.stageText = "Stage: ";
        this.healthText = " Health: ";
        this.scoreText = " Score: ";
        this.stageIndex = 1;
        this.healthIndex = 3;
        this.scoreIndex = 5;
        this.score = 0;
        this.scorePerPowerUp = 500;
        this.lastPowerUpScore = 0;
        this.readyForPowerUp = false;
        this.takingOffTimer = new Timer(world, 4);
        this.takingOffTimer.onComplete = () =>
        {
            this.player.checkKeyInput = true;
        }
        this.carrierVisibleTimer = new Timer(world, 8);
        this.carrierVisibleTimer.onComplete = () =>
        {
            this.carrier.setVisible(false);
            this.carrier.active = false;
            this.waveManager.activateWave();
        }
        this.carrier = new Carrier(world, [0,0,0], this.terrain);
        world.addChild(this.carrier, this);
        this.carrier.setVisible(false);
        this.stage = 0;
    }
    update(deltaTimeSec)
    {
        if(this.restartOnNextFrame)
        {
            this.restartOnNextFrame = false;
            this.resetLevel();
            this.onLevelReset.dispatch();
        }
        if(this.readyForPowerUp && this.waveManager.canPowerUp)
        {
            this.powerUpManager.addNewPowerUp();
            this.readyForPowerUp = false;
        }
    }
    newLevel()
    {
        
        let px2d = 0;
        let py2d = 0;
        let py3d = MyWorld.Altitude.DogFight;

        let c = this.world.screenToIsoCoord(px2d, py2d, py3d);
        this.player = this.hellCatPool.obtain({world: this.world, position: c, terrain: this.terrain});
        this.world.addCollisionSpatial(this.player);
        this.world.addChild(this.player);
        this.player.onDoneDestroyed.addListener((spatial1, spatia2) =>
        {
            this.restartOnNextFrame = true;
        });    
        this.player.onHealthChanged.addListener(() =>
        {
            this.world.hudItems[this.healthIndex] = Math.round(this.player.health * 100);
        });
        this.terrain.initTerrain(this.player.position[0]);
        this.waveManager.onAltitudeChanged.addListener((newAltitude) =>
        {
            this.player.targetAltitude = newAltitude;
        });
        this.waveManager.onEnemyStartDestroyed.addListener((startDestroyedEnemy) =>
        {
            this.score += startDestroyedEnemy.points;
            this.world.hudItems[this.scoreIndex] = this.score;
            if(this.score - this.lastPowerUpScore > this.scorePerPowerUp)
            {
                this.readyForPowerUp = true;
                this.lastPowerUpScore = Math.floor(this.score / this.scorePerPowerUp) * this.scorePerPowerUp;
            }
        });
        this.waveManager.onStageCleared.addListener(() =>
        {
            this.stage ++;
            this.world.hudItems[this.stageIndex] = this.stage + 1;
        });
        this.world.hudItems.length = 0;
        this.world.hudItems.push(this.stageText, this.stage + 1, this.healthText, 0, this.scoreText, 0);
        this.world.hudItems[this.healthIndex] = Math.round(this.player.health * 100);

        this.carrier.position = [...this.player.position];
        this.carrier.position[1] = 0;
        this.carrier.speed[1] = Terrain.Speed;
        this.carrier.setVisible(true);
        this.carrier.active = true;
        this.takingOffTimer.reset(true);
        this.carrierVisibleTimer.reset(true);
    }
    resetLevel()
    {
        this.hellCatPool.free(this.player);
        this.world.removeCollisionSpatial(this.player);
        this.world.removeChild(this.player);
        this.waveManager.stopWaves();
        this.waveManager.onAltitudeChanged.clearListeners();
        this.waveManager.onEnemyStartDestroyed.clearListeners();
        this.waveManager.onStageCleared.clearListeners();
        this.powerUpManager.clearPowerUps();
        this.score = 0;
        this.lastPowerUpScore = 0;
        this.readyForPowerUp = false;
        this.takingOffTimer.reset(false);
        this.carrierVisibleTimer.reset(false);
        this.carrier.setVisible(false);
        this.carrier.active = false;
        this.stage = 0;
        this.newLevel();
    }
}

class Terrain extends Spatial
{
    static get Speed()
    {
        return 5;
    }
    constructor(world)
    {
        super(world, [0,0,0]);
        this.terrainChunkPool = new TerrainChunkPool();
        this.terrainBlockPool = new TerrainBlockPool();
        this.terrainChunks = [];
        this.terrainSpeed = Terrain.Speed;
        this.totalTerrainChunks = 2;
        this.onTerrainChunkPassed = new Signal();
        let sea = new Cube(world.gl, [100, 1, 100], MyWorld.Palette.Blue)
        let seaBlock = new Spatial(world, [0, -0.5, 0], sea)
        world.addChild(seaBlock, this);
        for(let i = 0; i < this.totalTerrainChunks; i++)
        {
            let zPos = -i * TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution
            let terrainChunk = this.terrainChunkPool.obtain({world: world, position:[0, 0, zPos]});
            world.addChild(terrainChunk, this);
            this.terrainChunks.push(terrainChunk);
        }
    }
    update(deltaTimeSec)
    {
        this.handleTerrain(deltaTimeSec);
    }
    handleTerrain(deltaTimeSec)
    {
        this.terrainChunks.forEach((terrainChunk) =>
        {
            terrainChunk.position[2] += this.terrainSpeed * deltaTimeSec;
        });
        if(this.terrainChunks[0].position[2] > TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution)
        {
            this.terrainChunks.push(this.terrainChunks.shift());
            this.terrainChunks[1].position[2] = -(this.totalTerrainChunks - 1) * TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution;
            this.terrainChunks[1].clearTerrain();
            this.terrainChunks[1].fillTerrain();
            this.onTerrainChunkPassed.dispatch(this);
        }
        
    }
    initTerrain(playerX)
    {
        this.terrainChunks.forEach((terrainChunk, index) =>
        {
            terrainChunk.clearTerrain();
            let zPos = -index * TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution
            terrainChunk.position[2] = zPos;
        });
        let halfSize = TerrainChunk.Size / 2;
        let xArea = 3
        let zArea = TerrainChunk.Size;

        for(let x = -xArea + halfSize + playerX; x < xArea + halfSize + playerX; x++)
        {
            for(let z = 9; z < zArea; z ++)
            {
                this.terrainChunks[0].grid[x][z] = MyWorld.Altitude.DogFight - 0.5;
            }
        }
    }
}

class TerrainChunk extends Spatial
{
    static get Attribs()
    {
        return(
        {
            GridSize: 2,
            Resolution: 20,
            MaxHeight: 3
        });
    }
    static get Size()
    {
        return TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution;
    }
    constructor(world, position)
    {
        super(world, position);
        this.perlin = new Perlin();
        this.terrainBlockPool = new TerrainBlockPool();
        this.terrainBlocks = [];
        this.size = TerrainChunk.Attribs.GridSize * TerrainChunk.Attribs.Resolution;
        this.startGrid = (-TerrainChunk.Attribs.Resolution * (TerrainChunk.Attribs.GridSize / 2));
        this.endGrid = -this.startGrid;
        this.grid = [];
        this.clearTerrain();
    }
    makeGrid()
    {
        let grid = [];
        for(let x = this.startGrid; x < this.endGrid; x++)
		{
			let col = [];
			grid.push(col);
			for(let z = this.startGrid; z < this.endGrid; z++)
			{
				col.push(0);
			}
		}
        return grid
    }
    fillTerrain()
    {
        this.perlin.seed();
        let gridSize = TerrainChunk.Attribs.GridSize;
        let resolution = TerrainChunk.Attribs.Resolution;
        let numCubes = 1 / resolution;
        let maxHeight = TerrainChunk.Attribs.MaxHeight;
        let gridXCounter = this.startGrid
        let gridZCounter = -this.startGrid

        for(let y = 0; y < gridSize; y+= numCubes)
        {
            gridXCounter = this.startGrid
            for(let x = 0; x < gridSize; x+= numCubes)
            {
                let a = this.perlin.get(x, y);
                let v = Math.floor(a * 2 * maxHeight)
                if(v > 0)
                {
                    let block = this.terrainBlockPool.obtain({world: this.world, position: [gridXCounter, (v/2) - 0.5, gridZCounter], height: v})
                    this.grid[gridXCounter + this.endGrid][gridZCounter + this.endGrid - 1] = v - 0.5;
                    this.terrainBlocks.push(block);
                }
                gridXCounter ++;
            }
            gridZCounter --;
        }
        this.world.addChildren(this.terrainBlocks, this);
    }
    clearTerrain()
    {
        this.terrainBlockPool.freeAll(this.terrainBlocks);
        this.world.removeChildren(this.terrainBlocks);
        this.terrainBlocks.length = 0;
        this.grid = this.makeGrid(); //store coordinates of terrainBlocks
    }
    poolReset()
    {
        super.poolReset();
        this.clearTerrain();
    }
}
class TerrainBlock extends Spatial
{
    constructor(world, position, height)
    {
        super(world, position, new Cube(world.gl, [1, height, 1], MyWorld.Palette.Green));
    }
    poolSet(objectArgs)
    {
        super.poolSet(objectArgs);
        this.cube.size = [1, objectArgs.height, 1];
    }
}

class Vehicle extends Spatial
{
    constructor(world, position, terrain)
    {
        super(world, position);
        this.terrain = terrain;
        this._vehicleScale = 0;
        let cubeDatas = this._makeCubeDatas();
        this.structures = VehicleBuilder.BuildVehicle(world, cubeDatas, this.vehicleScale);
        this.hitColor = MyWorld.Palette.Red;
        this.ogColors = [];
        this.fireRateDelta = 0.2

        world.addChildren(this.structures, this);
        this.shadow = new Spatial(world, [position[0], 0, position[2]]);
        this.shadowArea = 4;
        let shadowSpatials = VehicleBuilder.BuildShadow(world, cubeDatas, this.vehicleScale);
        world.addChildren(shadowSpatials, this.shadow);
        world.addChild(this.shadow, world.shadowGroup);
        this.children.forEach((spatial) =>
        {
            this.ogColors.push(spatial.cube.color);
        });

        this.shadowDamp = 5;
        this.shadowDampCount = 0;
        this.lastMaxHeight = 0;
        this.onStartDestroyed = new Signal();
        this.onDoneDestroyed = new Signal();
        this.exploding = false;
        let explodedTime = 2;
        this.fireTimer = new Timer(world, this.fireTime);
        this.destroyTimer = new Timer(world, explodedTime);
        this.destroyTimer.onComplete = () =>
		{
			this.onDoneDestroyed.dispatch(this);
		};
        this.hitTimer = new Timer(world, 0.2);
        this.hitTimer.onComplete = () =>
        {
            this.unsetHitColor();
        }
        
        
        this.addCollideListener();
        this.activeBullets = [];
        this.bulletPool = null;
        this.bulletSpeed = -10;
        this.canFire = true;
        this.collideDamage = 0.1; //Damage dealt when colliding with another vehicle
    }
    get fireTime()
    {
        return 2;
    }
    get mainColor()
    {
        return MyWorld.Palette.White;
    }
    addCollideListener()
    {

    }
    _makeCubeDatas()
    {
        //override
        return [];
    }
    get vehicleScale()
    {
        return 0.5;
    }
    doDamageCollide(damageBy)
    {
        zzfx(...MyWorld.SoundFX.Hit);
        this.setHitColor();
        this.hitTimer.reset(true);
        this.health -= damageBy;
        if(this.health < 0)
        {
            this.health = 0;
            this.initDestroy();
        }
    }
    initDestroy()
    {
        this.exploding = true;
        zzfx(...MyWorld.SoundFX.Explosion);
        this.shadow.setVisible(false);
        this.world.removeCollisionSpatial(this);
        this.destroyTimer.reset(true);
        this.children.forEach((child) =>
        {
            child.speed = [MathsFunctions.RandomFloat(-4, 4), MathsFunctions.RandomFloat(-4, 4)]
        });
        this.onStartDestroyed.dispatch(this);
        this.speed = [0,0];
        this.fireTimer.reset(false);
    }
    update(deltaTimeSec)
    {
        this.doShadow();
    }
    doShadow()
    {
        let m = this.matrix
        let maxHeight = 0;
        this.terrain.terrainChunks.forEach((terrainChunk) =>
        {
            let offset = Math.round(terrainChunk.position[2]);
            let size = TerrainChunk.Size;
            let halfSize = size / 2;
            let heights = []
            let xBound = Math.round(m[12]) + halfSize - Math.round(this.shadowArea / 2);
            let zBound = halfSize - offset + Math.round(m[14]) - Math.round(this.shadowArea / 2);
            for (let x = xBound; x < xBound + this.shadowArea; x++)
            {
                if(terrainChunk.grid[x])
                {
                    for(let z = zBound; z < zBound + this.shadowArea; z++)
                    {
                        let value = terrainChunk.grid[x][z];
                        if(value !== undefined)
                        {
                            heights.push(value);
                        }
                    }
                }    
            }
            if(heights.length > 0)
            {
                let newMaxHeight = Math.max(...heights);
                if(newMaxHeight > maxHeight)
                {
                    maxHeight = newMaxHeight;
                } 
            }
        });
        this.shadow.position = [m[12], this.shadow.position[1], m[14]];
        if(maxHeight != m[12])
        {
            if(maxHeight == this.lastMaxHeight)
            {
                this.shadowDampCount ++;
                if(this.shadowDampCount == this.shadowDamp)
                {
                    this.shadow.position[1] = maxHeight;
                    this.shadowDampCount = 0;
                }
            }
            else
            {
                this.shadowDampCount = 0;
            }
        }
        this.lastMaxHeight = maxHeight;
        this.shadow.yRotation = this.yRotation;
    }
    poolReset()
    {
        super.poolReset();
        this.shadow.setVisible(false);
        this.onStartDestroyed.clearListeners();
        this.onDoneDestroyed.clearListeners();
        this.onCollide.clearListeners();
        this.destroyTimer.reset(false);
        this.exploding = false;
        VehicleBuilder.ReconstructVehicle(this, this._makeCubeDatas(), this.vehicleScale);
        this.bulletPool.freeAll(this.activeBullets);
		this.world.removeChildren(this.activeBullets);
        this.world.removeCollisionSpatials(this.activeBullets);
        this.activeBullets.length = 0;
        this.hitTimer.reset(false);
        this.unsetHitColor();
        this.fireTimer.reset(false);
    }
    poolSet(objectArgs)
    {
        super.poolSet(objectArgs);
        this.shadow.setVisible(true);
        this.shadow.position = [...objectArgs.position];
        this.shadow.position[1] = 0;
        this.addCollideListener();
        this.fireTimer.reset(true);
    }
    setHitColor()
    {
        this.children.forEach((spatial) =>
        {
            spatial.cube.color = this.hitColor;
        });
    }
    unsetHitColor()
    {
        this.children.forEach((spatial, index) =>
        {
            spatial.cube.color = this.ogColors[index];
        });
    }
    fireBullet(angle, position = [...this.worldPosition])
    {
        let bullet = this.bulletPool.obtain({world: this.world, 
            position: position});
        this.activeBullets.push(bullet);
        this.world.addChild(bullet, this.world.gameGroup.bulletGroup);
        this.world.addCollisionSpatial(bullet);
        bullet.speed[0] = Math.cos(angle) * this.bulletSpeed;
        bullet.speed[1] = Math.sin(angle) * this.bulletSpeed;
        bullet.yRotation = -angle;
        bullet.onCollide.addListener((collideBullet, spatialHit) =>
        {
            this.bulletPool.free(collideBullet);
            this.world.removeCollisionSpatial(collideBullet);
            this.world.removeChild(collideBullet);
            this.activeBullets.splice(this.activeBullets.findIndex((activeBullet) =>
            {
                return collideBullet === activeBullet;
            }), 1)
        });
        bullet.onBulletOffScreen.addListener((offScreenBullet) =>
        {
            this.bulletPool.free(offScreenBullet);
            this.world.removeCollisionSpatial(offScreenBullet);
            this.world.removeChild(offScreenBullet);
            this.activeBullets.splice(this.activeBullets.findIndex((activeBullet) =>
            {
                return offScreenBullet === activeBullet;
            }), 1)
        });
    }
    setVisible(value)
    {
        super.setVisible(value);
        this.shadow.setVisible(value);
    }
}



class PropellerPlane extends Vehicle
{
    static get Propellors()
    {
        return 1
    }
    
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        let propellors = this.constructor.Propellors;
        for(let i = 1; i <= propellors; i++)
        {
            let propeller = this.structures[this.structures.length - i];
            propeller.zAngularVelocity = Math.PI * 8;
        }
    }
}

class EnemyVehicle extends Vehicle
{
    static get CollisionID()
	{
		return 1 << 0;
	}
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.t = 0
        this.collisionGroup |= HellCat.CollisionID;
        this.bulletPool = new EnemyBulletPool();
        this.fireTimer.reset(true);
        this.fireTimer.onComplete = () =>
        {
            this.canFire = true;
        }
        this.onFired = new Signal();
        this._clearedToFire = false
        this.clearedToFire = false;
        this.canFire = false;
        this.points = 100; //points awarded per kill
        
        
    }
    get clearedToFire()
    {
        return this._clearedToFire;
    }
    get minFireTime()
    {
        return 0.5
    }
    get fireTime()
    {
        let a = super.fireTime - this.fireRateDelta * this.world.gameGroup.stage;
        return a > this.minFireTime ? a : this.minFireTime;
    }
    set clearedToFire(clearedToFire)
    {
        this._clearedToFire = clearedToFire;
        this.canFire = false;
        this._clearedToFire ? this.fireTimer.reset(true, this.fireTime) : this.fireTimer.reset(false);
    }
    
    update(deltaTimeSec)
    {
        super.update(deltaTimeSec);
        if(this.canFire && this.clearedToFire)
        {
            this.doShoot();
            this.onFired.dispatch(this);
            this.canFire = false;
        }
    }
    poolReset()
    {
        super.poolReset();
        this.t = 0;
        this.onFired.clearListeners();
        this.clearedToFire = false;
        this.canFire = false;
    }
    addCollideListener()
    {
        this.onCollide.addListener((spatial1, spatial2) =>
        {
            if(spatial2.constructor === PlayerBullet)
			{
                let playerBullet = spatial2;
                this.doDamageCollide(playerBullet.damage);
            }
            else if(spatial2.constructor === HellCat)
            {
                let hellCat = spatial2;
                this.doDamageCollide(hellCat.collideDamage);
            }
        });
    }
    doShoot()
    {
        let ang = Math.PI / 4;
        let count = 0
        for(let i = 0; i < 8; i++)
        {
            this.fireBullet(i * ang);
            count ++;
        }
    }
}

class EnemyShip extends EnemyVehicle
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.size = [8.8, 1.6];
    }
    get mainColor()
    {
        return MyWorld.Palette.Grey;
    }
    _makeCubeDatas()
    {
        return(
        [
            [0, 0, 0,   1, 1, 20,   1].concat(this.mainColor),
            [0, 1, 0.5,   2, 1, 21,   1].concat(this.mainColor),
            [0, 2, 1,   4, 1, 22,   1].concat(this.mainColor),
            [0, 3, 9,   1, 1, 1,   1].concat(this.mainColor),
            [0, 3, 10,   0.3, 0.3, 1,   1].concat(this.mainColor),
            [0, 3.5, 6,   2, 2, 2,   1].concat(this.mainColor),
            [0, 5, 5.75,   1.5, 1, 1.5,   1].concat(this.mainColor),
            [0, 5.75, 5.5,   1, 0.5, 1,   1].concat(this.mainColor),
            [0, 3, 2,   2, 1, 4,   1].concat(this.mainColor),
            [0, 4.25, 2,   1, 1.5, 1,   1].concat(this.mainColor),
            [0, 5.25, 2,   1, 0.5, 1,   1].concat(MyWorld.Palette.Black),
            [0, 3, -4,   1.5, 1, 3,   1].concat(this.mainColor),
            [0, 4, -4,   1, 1, 1,   1].concat(this.mainColor),
            [0, 4, -5,   0.3, 0.3, 1,   1].concat(this.mainColor),
            [0, 3, -7,   1, 1, 1,   1].concat(this.mainColor),
            [0, 3, -8,   0.3, 0.3, 1,   1].concat(this.mainColor)
        ]);
    }
    get vehicleScale()
    {
        return 0.4;
    }
}

class EnemyPlane extends EnemyVehicle
{
    static get Propellors()
    {
        return 1;
    }
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        world.startPropellors(this.constructor.Propellors, this.structures);
    }
}

class Zero extends EnemyPlane
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.size = [3, 2.5];
    }
    get mainColor()
    {
        return MyWorld.Palette.White
    }

    get vehicleScale()
    {
        return 0.37;
    }
    _makeCubeDatas()
    {
        return(
        [
            [0, 0, 0, 1, 1, 1, 1].concat(this.mainColor),
            [0, 0, -1.5, 1, 1, 2, 1].concat(this.mainColor),
            [0, 0.575, -1.4, 0.5, 0.15, 0.2, 1].concat(MyWorld.Palette.Black),
            [0, 0.65, -0.6, 0.5, 0.3, 1.4, 1].concat(MyWorld.Palette.Black),
            [0, 0.6, 0.2, 0.5, 0.2, 0.2, 1].concat(MyWorld.Palette.Black),
            [0, 0.55, 0.4, 0.5, 0.1, 0.2, 1].concat(MyWorld.Palette.Black),
            [0, -0.05, 0.875, 0.8, 0.9, 0.75, 1].concat(this.mainColor),
            [0, -0.1, 1.625, 0.6, 0.6, 0.75, 1].concat(this.mainColor),
            [0, -0.15, 2.375, 0.4, 0.7, 0.75, 1].concat(this.mainColor),
            [0, -0.125, 3.25, 0.2, 0.65, 1, 1].concat(this.mainColor),
            [0, 0.35, 3.2, 0.1, 0.3, 0.9, 1].concat(this.mainColor),
            [0, 0.65, 3.25, 0.1, 0.3, 0.7, 1].concat(this.mainColor),
            [0, 0.95, 3.3, 0.1, 0.3, 0.5, 1].concat(this.mainColor),
            [0.75, -0.45, -0.65, 0.75, 0.1, 2.3, 0].concat(this.mainColor)].concat(this._wingCowlCubeDatas()).concat([
            [0.25, 0.15, 3.2, 0.3, 0.1, 0.9, 0].concat(this.mainColor),
            [0.55, 0.15, 3.25, 0.3, 0.1, 0.7, 0].concat(this.mainColor),
            [0.85, 0.15, 3.3, 0.3, 0.1, 0.5, 0].concat(this.mainColor),
            [1.15, 0.15, 3.325, 0.3, 0.1, 0.25, 0].concat(this.mainColor),
            [0, 0, -3.2, 0.3, 3, 0.2, 1].concat(MyWorld.Palette.Black)
        ]));
    }
    _wingCowlCubeDatas()
    {
        return(
        [
            [0, 0, -2.75, 0.9, 0.9, 0.5, 1].concat(MyWorld.Palette.Black),
            [1.5, -0.45, -0.7, 0.75, 0.1, 2.05, 0].concat(this.mainColor),
            [2.25, -0.45, -0.725, 0.75, 0.1, 1.9, 0].concat(this.mainColor),
            [3, -0.45, -0.75, 0.75, 0.1, 1.7, 0].concat(this.mainColor),
            [3.75, -0.45, -0.775, 0.75, 0.1, 1.5, 0].concat(this.mainColor),
            [4.3125, -0.45, -0.75, 0.375, 0.1, 1.1, 0].concat(this.mainColor),
            [4.6875, -0.45, -0.75, 0.375, 0.1, 0.7, 0].concat(this.mainColor),
            [4.9688, -0.45, -0.75, 0.188, 0.1, 0.3, 0].concat(this.mainColor)
        ]);
    }
}

class Kate extends Zero
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
    }
    _wingCowlCubeDatas()
    {
        return(
        [
            [0, 0, -2.75, 1.2, 1.2, 0.5, 1].concat(MyWorld.Palette.Black),
            [1.5, -0.45, -0.75375, 0.75, 0.1, 2.07, 0].concat(this.mainColor),
            [2.25, -0.45, -0.825, 0.75, 0.1, 1.85, 0].concat(this.mainColor),
            [3, -0.45, -0.9125, 0.75, 0.1, 1.62, 0].concat(this.mainColor),
            [3.75, -0.45, -1, 0.75, 0.1, 1.4, 0].concat(this.mainColor),
            [4.5, -0.45, -1.0875, 0.75, 0.1, 1.17, 0].concat(this.mainColor),
            [5.25, -0.45, -1.175, 0.75, 0.1, 0.95, 0].concat(this.mainColor)
        ]);
    }
    get mainColor()
    {
        return MyWorld.Palette.DarkGreen;
    }
}

class Betty extends EnemyPlane
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.size = [8, 8];
        this.shadowArea = 8;
        this.health = 3;
    }
    static get Propellors()
    {
        return 2;
    }
    get vehicleScale()
    {
        return 1;
    }
    get fireTime()
    {
        return 0.75;
    }
    poolReset()
    {
        super.poolReset();
        this.health = 3;
    }
    _makeCubeDatas()
    {
        return this.world.bettyCubeDatas();
    }
}

class HellCat extends Vehicle
{
	static get CollisionID()
	{
		return 1 << 1;
	}
    static get Propellors()
    {
        return 1;
    }
    static get FirePower()
    {
        return(
        {
            Single: 0,
            Double: 1,
            Quad: 2
        });
    }
	constructor(world, position, terrain)
	{
		super(world, position, terrain);
        this.keyStates =
		{
			left: false,
			right: false,
			forward: false,
			backward: false,
			fire: false,
		}
        this.initInput();
        this.moveSpeed = 10;
        this.maxX2d = world.xScreen / 2;
        this.minX2d = -this.maxX2d;
        this.maxY2d = world.yScreen / 2;
        this.minY2d = - this.maxY2d;
        this.size = [3, 2.5];
        this.collisionGroup = Zero.CollisionID + EnemyBullet.CollisionID;
        this.bulletPool = new PlayerBulletPool();
        this.fireTimer.onComplete = () =>
		{
			this.canFire = true;
		}
        this._targetAltitude = this.position[1]; 
        this.changingAltitude = false;
        world.startPropellors(HellCat.Propellors, this.structures);
        this.firePower = HellCat.FirePower.Single;
        this.firePowerTimer = new Timer(this.world, 20);
        this.firePowerTimer.onComplete = () =>
        {
            this.firePower = HellCat.FirePower.Single;
        };
        this.onHealthChanged = new Signal();
        this.collideDamage = 0.7;
        this.checkKeyInput = false;
        this.bulletSpeed = -15;
    }
    get targetAltitude()
    {
        return this._targetAltitude;
    }
    set targetAltitude(newTargetAltitude)
    {
        if(newTargetAltitude != this.targetAltitude)
        {
            this._targetAltitude = newTargetAltitude;
            this.changingAltitude = true;
        }
    }
    get vehicleScale()
    {
        return 0.5;
    }
    get fireTime()
    {
        return 0.3;
    }
    _makeCubeDatas()
    {
        return this.world.hellcatCubeDatas();
    }
    addCollideListener()
    {
        this.onCollide.addListener((spatial1, spatial2) =>
        {
            if(spatial2.constructor.CollisionID == EnemyVehicle.CollisionID)
            {
                let enemyVehicle = spatial2;
                this.doDamageCollide(enemyVehicle.collideDamage);
                this.onHealthChanged.dispatch(this);
            }
            else if(spatial2.constructor === EnemyBullet)
            {
                let enemyBullet = spatial2;
                this.doDamageCollide(enemyBullet.damage);
                this.onHealthChanged.dispatch(this);
            }
            else if(spatial2.constructor.CollisionID == PowerUp.CollisionID)
            {
                zzfx(...MyWorld.SoundFX.PowerUp);
                let powerUp = spatial2;
                switch(powerUp.activeAbility)
                {
                    case PowerUp.Abilities.Health:
                        this.health = 1;
                        this.onHealthChanged.dispatch(this);
                        break;
                    case PowerUp.Abilities.DoubleFire:
                        this.firePower = HellCat.FirePower.Double;
                        break;
                    case PowerUp.Abilities.QuadFire:
                        this.firePower = HellCat.FirePower.Quad;
                        break;
                    default:
                        break
                }
                this.firePowerTimer.reset(true);
            }
        });
    }
    update(deltaTimeSec)
    {
        super.update(deltaTimeSec);
        if(this.checkKeyInput)
        {
            this.doKeyInput();
        }
        if(this.changingAltitude)
        {
            let d = this.position[1] - this.targetAltitude;
            if(d < 0)
            {
                this.position[1] += this.moveSpeed * deltaTimeSec;
            }
            else if(d > 0)
            {
                this.position[1] -= this.moveSpeed * deltaTimeSec;
            }
            d = this.position[1] - this.targetAltitude;
            if(Math.abs(d) < 0.2)
            {
                this.position[1] = this.targetAltitude;
                this.changingAltitude = false;
            }
        }
    }
    doKeyInput()
    {
        let m = this.matrix
        let c = this.world.isoCoordToScreen(m[12], m[13], m[14])
        let x2d = c[0];
        let y2d = c[1];

        this.speed = [0, 0]

        if(this.keyStates.right && x2d < this.maxX2d && y2d < this.maxY2d)
		{
			this.speed[0] = this.moveSpeed
        } 
        else if (this.keyStates.left && x2d > this.minX2d && y2d > this.minY2d)
		{
			this.speed[0] = -this.moveSpeed
        } 
        if(this.keyStates.forward && x2d < this.maxX2d && y2d > this.minY2d)
		{
            this.speed[1] = - this.moveSpeed
        }    
        else if(this.keyStates.backward && x2d > this.minX2d && y2d < this.maxY2d)
		{
            this.speed[1] = this.moveSpeed
        }    
        if(this.keyStates.fire && this.canFire)
		{
            zzfx(...MyWorld.SoundFX.Shoot);
            let fireAng = Math.PI / 2;
            let fireDouble = () =>
            {
                let posA = [...this.worldPosition];
                let posB = [...this.worldPosition];
                posA[0] -= 0.25;
                posB[0] += 0.25;
                this.fireBullet(fireAng, posA);
                this.fireBullet(fireAng, posB);
            }

            if(this.firePower == HellCat.FirePower.Single)
            {
                this.fireBullet(fireAng, [...this.position]);
            }
            else if(this.firePower == HellCat.FirePower.Double)
            {
                fireDouble()
            }
            else if(this.firePower == HellCat.FirePower.Quad)
            {
                fireDouble();
                this.fireBullet(fireAng + Math.PI / 5);
                this.fireBullet(fireAng - Math.PI / 5);
            }
            this.canFire = false;
            this.fireTimer.reset(true);
            
		}
    }
    initInput()
	{
		let setKeyStates = (code, value) =>
		{
			let keyBinds = this.world.keyBinds;
			if(keyBinds.right1 == code || keyBinds.right2 == code)
			{
				this.keyStates.right = value;
			}
			if(keyBinds.left1 == code || keyBinds.left2 == code)
			{
				this.keyStates.left = value;
			}
			if(keyBinds.forward1 === code || keyBinds.forward2 == code)
			{
				this.keyStates.forward = value;
			}
			if(keyBinds.backward1 === code || keyBinds.backward2 == code)
			{
				this.keyStates.backward = value;
			}
			if(keyBinds.fire1 === code || keyBinds.fire2 == code)
			{
				this.keyStates.fire = value;
			}
		}
		this.world.events.onKeyDown = ((event) =>
		{
			setKeyStates(event.code, true);
		});
		this.world.events.onKeyUp = ((event) =>
		{
			setKeyStates(event.code, false);
		});
	}
    poolReset()
    {
        super.poolReset();
		this.canFire = true;
        this.targetAltitude = MyWorld.Altitude.DogFight;
        this.firePower = HellCat.FirePower.Single;
        this.firePowerTimer.reset(false);
        this.onHealthChanged.clearListeners();
        this.checkKeyInput = false;
    }
}

class PowerUpManager extends Spatial
{
    constructor(world)
    {
        super(world, [0,0,0]);
        this.powerUpPool = new PowerUpPool();
    }
    addNewPowerUp()
    {
        let powerUp = this.powerUpPool.obtain({world: this.world})
        this.world.addChild(powerUp, this);
        this.world.addCollisionSpatial(powerUp);
        powerUp.onOffScreen.addListener((offScreenPowerUp) =>
        {
            this.world.removeChild(offScreenPowerUp);
            this.world.removeCollisionSpatial(offScreenPowerUp);
            this.powerUpPool.free(offScreenPowerUp);
        });
        powerUp.onCollide.addListener((collidePowerUp, spatial) =>
        {
            this.world.removeChild(collidePowerUp);
            this.world.removeCollisionSpatial(collidePowerUp);
            this.powerUpPool.free(collidePowerUp);
        });
    }
    clearPowerUps()
    {
        this.children.forEach((powerUp) =>
        {
            this.powerUpPool.free(powerUp);
            this.world.removeCollisionSpatial(powerUp);
        });
        this.world.removeAllChildren(this);
    }
}

class Carrier extends Vehicle
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
    }
    get mainColor()
    {
        return MyWorld.Palette.Grey;
    }
    _makeCubeDatas()
    {
        return(
        [
            [0, 0, 0,   1, 1, 20,   1].concat(this.mainColor),
            [0, 1, 0.5,   2, 1, 21,   1].concat(this.mainColor),
            [0, 2, 1,   4, 1, 22,   1].concat(this.mainColor),
            [1.625, 2.875, 0,   0.75, 0.75, 4,   1].concat(this.mainColor),
            [1.625, 3.625, 0,   0.75, 0.75, 3,   1].concat(this.mainColor),
            [1.625, 4.25, 0.5,   0.75, 0.5, 0.75,   1].concat(this.mainColor),
            [1.625, 4.625, 0.5,   0.75, 0.25, 0.75,   1].concat(MyWorld.Palette.Black)
        ]);
    }
    get vehicleScale()
    {
        return 1.8;
    }
    doShadow()
    {
        this.shadow.position = [...this.position];
    }
}

class PowerUp extends Spatial
{
    static get CollisionID()
    {
        return 1 << 4;
    }
    static get Abilities()
    {
        return(
        {
            Health: 0,
            DoubleFire: 1,
            QuadFire: 2
        });
    }
    constructor(world)
    {
        super(world);
        this.spatialGroups = this._initSpatialGroups();
        world.addChildren(this.spatialGroups, this);
        this._activeAbility= null;
        this.activeAbility = MathsFunctions.RandomPick(Object.values(PowerUp.Abilities));
        this.speed[1] = Terrain.Speed;
        this.onOffScreen = new Signal();
        let px2d = this.world.xScreen / 2;
        let py2d = -this.world.yScreen / 2;
        let py3d = MyWorld.Altitude.DogFight;
        this.position  = this.world.screenToIsoCoord(px2d, py2d, py3d);
        this.zAngularVelocity = Math.PI;
        this.yAngularVelocity = Math.PI;
        this.collisionGroup |= HellCat.CollisionID;
    }
    get activeAbility()
    {
        return this._activeAbility;
    }
    set activeAbility(ability)
    {
        this.spatialGroups.forEach((spatialGroup) =>
        {
            spatialGroup.setVisible(false);
        });
        let group = this.spatialGroups.find((item) =>
        {
            return item.ability === ability;
        });
        this._activeAbility = group.ability;
        group.setVisible(true);
    }
    update(deltaTimeSec)
    {
        if(this.world.isOffScreen(this.position))
        {
            this.speed[1] = 0;
            this.onOffScreen.dispatch(this);
        }
    }
    poolSet(objectArgs)
    {
        super.poolSet(objectArgs);
        this.speed[1] = Terrain.Speed;
        this.activeAbility = MathsFunctions.RandomPick(Object.values(PowerUp.Abilities));
        let px2d = this.world.xScreen / 2;
        let py2d = -this.world.yScreen / 2;
        let py3d = MyWorld.Altitude.DogFight;

        this.position  = this.world.screenToIsoCoord(px2d, py2d, py3d);
        this.size = [1.5,1.5];
        this.speed[1] = Terrain.Speed;
    }
    poolReset()
    {
        super.poolReset()
        this.onOffScreen.clearListeners();
        this.onCollide.clearListeners();
    }
    _initSpatialGroups()
    {
        let spatialGroups = []
        let healthSpatialDatas =
        [
            [0, 0, 0,    2, 2, 0.5, 1].concat(MyWorld.Palette.Red),
            [0, 0, 0,    0.5, 1.5, 1, 1].concat(MyWorld.Palette.White),
            [0, 0, 0,    1.5, 0.5, 1, 1].concat(MyWorld.Palette.White)
        ]
        let doubleFireSpatialDatas = 
        [
            [0, 0, 0,    2, 2, 0.5, 1].concat(MyWorld.Palette.Orange),
            [0.3, 0, 0,    0.2, 1.5, 1, 0].concat(MyWorld.Palette.White),
        ]
        let quadFireSpatialDatas = 
        [
            [0, 0, 0,    2, 2, 0.5, 1].concat(MyWorld.Palette.Orange),
            [0.3, 0, 0,    0.2, 1.5, 1, 0].concat(MyWorld.Palette.White),
            [0.7, 0, 0,    0.2, 1.5, 1, 0].concat(MyWorld.Palette.White)
        ]
        let healthSpatialGroup = new AbilitySpatial(this.world, PowerUp.Abilities.Health, VehicleBuilder.BuildVehicle(this.world, healthSpatialDatas, 0.75));
        let doubleFireSpatialGroup = new AbilitySpatial(this.world, PowerUp.Abilities.DoubleFire, VehicleBuilder.BuildVehicle(this.world, doubleFireSpatialDatas, 0.75));
        let quadFireSpatialGroup = new AbilitySpatial(this.world, PowerUp.Abilities.QuadFire, VehicleBuilder.BuildVehicle(this.world, quadFireSpatialDatas, 0.75));
        spatialGroups.push(healthSpatialGroup, doubleFireSpatialGroup, quadFireSpatialGroup);
        return spatialGroups;
    }
}

class AbilitySpatial extends Spatial
{
    constructor(world, ability, spatials)
    {
        super(world, [0,0,0]);
        this.ability = ability;
        world.addChildren(spatials, this);
    }
}

class WaveManager extends Spatial
{
    constructor(world, terrain)
    {
        super(world, [0,0,0]);
        this.waves = 
        [
            new BezierCurveLeftEnemyWave(world, [0, 0, 0], terrain),
            new BezierCurveRightEnemyWave(world, [0, 0, 0], terrain),
            new VerticalEnemyWave(world, [0, 0, 0], terrain),
            new HorizontalEnemyWave(world, [0, 0, 0], terrain),
            new KateWave(world, [0, 0, 0], terrain),
            new BettyWave(world, [0, 0, 0], terrain),
            new ShippingEnemyWave(world, [0, 0, 0], terrain)
        ];
        this.waves.forEach((wave) =>
        {
            wave.onWaveFinished.addListener((finishedWave) =>
            {
                this.onWaveFinished.dispatch(finishedWave);
                this.activeWaves.splice(this.activeWaves.findIndex((item) =>
                {return item === finishedWave}), 1);
                this.activateWave();
            });
            world.addChild(wave, this);
            wave.onAltitudeChanged.addListener((newAltitude) =>
            {
                this.onAltitudeChanged.dispatch(newAltitude);
            });
            wave.onEnemyStartDestroyed.addListener((startDestroyedEnemy) =>
            {
                this.onEnemyStartDestroyed.dispatch(startDestroyedEnemy);
            });
        });
        this.activeWaves = [];
        this.onAltitudeChanged = new Signal();
        this.onWaveFinished = new Signal();
        this.onEnemyStartDestroyed = new Signal();
        this.onStageCleared = new Signal();
        this.currentWaveLevel = 0;
    }
    activateWave()
    {
        let availableWaves = [];
        this.waves.forEach((wave) =>
        {
            if(!wave.active && wave.waveLevel == Math.floor(this.currentWaveLevel))
            {
                availableWaves.push(wave);
            }
        });
        if(availableWaves.length > 0)
        {
            let waveToActivate = availableWaves[MathsFunctions.RandomInt(0, availableWaves.length)];
            waveToActivate.start();
            this.activeWaves.push(waveToActivate);
            this.currentWaveLevel += waveToActivate.waveInc;
        }
        else
        {
            this.currentWaveLevel = 0;
            this.onStageCleared.dispatch();
            this.activateWave();
        }
    }
    stopWaves()
    {
        this.activeWaves.forEach((wave) =>
        {
            wave.stop(false);
        });
        this.activeWaves.length = 0;
        this.currentWaveLevel = 0;
    }
    get canPowerUp()
    {
        return this.activeWaves.some((wave) =>
        {
            return wave.canPowerUp;
        });
    }
}

class AbstractEnemyWave extends Spatial
{
    constructor(world, position, terrain)
    {
        super(world, position);
        this.enemyVehiclePool = this._enemyVehiclePool;
        this.vehicles = 0;
        this.vehiclesCount = 0;
        this.terrain = terrain;
        this.active = false;
        this.onWaveFinished = new Signal();
        this.destroyedCount = 0;
        this.vehiclesLeft = 0;//vehicles left at each yoyo
        this.maxActiveShooters = 1;
        this.onAltitudeChanged = new Signal();
        this.onEnemyStartDestroyed = new Signal();
        this.canPowerUp = true;
        this.waveLevel = 0;
        this.waveInc = 0.2
    }
    get _enemyVehiclePool()
    {
        return new ZeroPool();
    }
    get availableShooters()
    {
        let availableShooters = [];
        this.children.forEach((vehicle) =>
        {
            if(!vehicle.clearedToFire)
            {
                availableShooters.push(vehicle)
            }
        });
        return availableShooters;
    }
    update(deltaTimeSec)
    {
        this.coordinateVehicles(deltaTimeSec)
    }
    start()
    {
        this.active = true;
        this.randomize();
        this.vehiclesLeft = this.vehicles - this.destroyedCount;
    }
    stop(sendSignal = true)
    {
        this.enemyVehiclePool.freeAll(this.children);
        this.world.removeCollisionSpatials(this.children);
        this.world.removeAllChildren(this);
        
        this.active = false;
        this.vehiclesCount = 0;
        this.destroyedCount = 0;
        this.vehiclesLeft = 0;
        if(sendSignal)
        {
            this.onWaveFinished.dispatch(this);
        }
    }

    coordinateVehicles(deltaTimeSec)
    {
        let toRemove = [];
        this.children.forEach((vehicle) =>
        {
            
            this.moveVehicle(vehicle, deltaTimeSec);
            if(this.testDone(vehicle))
            {
                this.doDone(vehicle);
                this.enemyVehiclePool.free(vehicle);
                toRemove.push(vehicle);
            }
        });
        if(toRemove.length > 0)
        {
            this.world.removeChildren(toRemove);
            this.world.removeCollisionSpatials(toRemove);
            this.chooseNewShooters();
        }
        if(this.vehiclesCount == this.vehiclesLeft && this.children.length == 0)
        {
            this.doFinished();
        }
        else if(this.doTestAddNewVehicles())
        {
            this.addNewVehicles(this.startPositions)
            this.chooseNewShooters()
        }
    
    }
    chooseNewShooters()
    {
        let availableShooters = [];
        this.children.forEach((vehicle) =>
        {
            if(!vehicle.clearedToFire)
            {
                availableShooters.push(vehicle)
            }
        });
        let currentActiveShooters = this.children.length - availableShooters.length;
        
        while(currentActiveShooters < this.maxActiveShooters && this.children.length >= this.maxActiveShooters)
        {
            let index = MathsFunctions.RandomInt(0, availableShooters.length);
            availableShooters[index].clearedToFire = true;
            availableShooters.splice(index, 1);
            currentActiveShooters ++;
        }
        
    }
    
    addNewVehicles(positions)
    {
        positions.forEach((pos) =>
        {
           this.addNewVehicle(pos); 
        });
    }
    addNewVehicle(pos)
    {
        let vehicle = this.enemyVehiclePool.obtain({world: this.world, position: pos, terrain: this.terrain});
        this.world.addChild(vehicle, this);
        this.world.addCollisionSpatial(vehicle);
        this.vehiclesCount += 1;
        vehicle.onDoneDestroyed.addListener((destroyedVehicle) =>
        {
            this.enemyVehiclePool.free(destroyedVehicle);
            this.world.removeChild(destroyedVehicle);
            this.world.removeCollisionSpatial(destroyedVehicle);
            this.destroyedCount ++;
            if(this.vehiclesCount == this.vehicles && this.children.length == 0)
            {
                this.doFinished();
            }
            this.chooseNewShooters();
        });
        vehicle.onFired.addListener((firedVehicle) =>
        {
            firedVehicle.clearedToFire = false;
            this.chooseNewShooters();
        });
        vehicle.onStartDestroyed.addListener((startdestroyedVehicle) =>
        {
            this.onEnemyStartDestroyed.dispatch(startdestroyedVehicle);
        });
        return vehicle;
    }
    doTestAddNewVehicles(positions = [])
    {
        //override
        return false;
    }
    
    doFinished()
    {
        this.stop();
    }
    testDone(vehicle)
    {
        //override
        return false;
    }
    moveVehicle(vehicle, deltaTimeSec)
    {
        //override
    }
    get startPositions()
    {
        //override
        return [];
    }
    randomize()
    {
        //override
    }
    doDone(vehicle)
    {
        //override
    }
    
}

class AbstractBezierCurveEnemyWave extends AbstractEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.vehicles = 5;
        this.easeRate = 0.125;
        this.newVehicle = 0.2; //new vehicle at t=
        this.yoyo = false;
        this.reversing = false;
        this.alignWithCurve = true;
        this.healths = [];
        this.bezier = this._bezier;
    }
    get startPositions()
    {
        return [this.bezier.pos(0)];
    }
    moveVehicle(vehicle, deltaTimeSec)
    {
        if(!vehicle.exploding)
        {
            let sign = this.reversing ? -1 : 1;
            vehicle.t += sign * this.easeRate * deltaTimeSec;
            let pos = this.bezier.pos(vehicle.t)
            let coords = this.world.screenToIsoCoord(pos[0], pos[1], MyWorld.Altitude.DogFight);
            if(this.alignWithCurve)
            {
                vehicle.yRotation = Math.atan2(-(coords[2] - vehicle.position[2]), coords[0] - vehicle.position[0]) - Math.PI / 2;
            }
            vehicle.position = [coords[0], coords[1], coords[2]];
        }
    }
    stop(sendSignal)
    {
        super.stop(sendSignal);
        this.reversing = false;
        this.healths = [];
    }
    doTestAddNewVehicles()
    {
        return this.children.length == 0 || (this.vehiclesCount < this.vehiclesLeft && ((!this.reversing && this.children[this.children.length - 1].t > this.newVehicle) ||
            (this.reversing && this.children[this.children.length - 1].t < 1 - this.newVehicle)));
    }
    testDone(vehicle)
    {
        return (vehicle.t > 1 || vehicle.t < 0);
    }
    get _bezier()
    {
        return null;
    }
    addNewVehicle(pos)
    {
        let vehicle = null
        if(this.yoyo)
        {
            vehicle = super.addNewVehicle(pos);
            if(this.healths.length > 0)
            {
                vehicle.health = this.healths.shift();
            }
            if(this.reversing)
            {
                vehicle.t = 1;
            }
        }
        else 
        {
            vehicle = super.addNewVehicle(pos);
        } 
        return vehicle;
    }
    doFinished()
    {
        if(this.yoyo)
        {
            this.reversing = this.reversing ? false : true;
            this.vehiclesCount = 0;
            this.vehiclesLeft = this.vehicles - this.destroyedCount;
            if(this.vehiclesLeft == 0)
            {
                this.stop();
            }
        }
        else
        {
            this.stop();
        }
    }
    doDone(vehicle)
    {
        this.healths.push(vehicle.health);
    }
}

class BezierCurveLeftEnemyWave extends AbstractBezierCurveEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
    }
    get _bezier()
    {
        return new CubicBezier(-this.world.xScreen / 2, -this.world.yScreen / 2, 
            this.world.xScreen / 2, -this.world.yScreen / 4, -this.world.xScreen / 2, this.world.yScreen / 4,
            this.world.xScreen / 2, this.world.yScreen / 2);
    }
}

class BezierCurveRightEnemyWave extends AbstractBezierCurveEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
    }
    get _bezier()
    {
        return new CubicBezier(this.world.xScreen / 2, -this.world.yScreen / 2, 
            -this.world.xScreen / 2, -this.world.yScreen / 4, this.world.xScreen / 2, this.world.yScreen / 4,
            -this.world.xScreen / 2, this.world.yScreen / 2);
    }
}

class BomberWave extends AbstractBezierCurveEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.yoyo = true;
        this.vehicles = 1;
        this.alignWithCurve = false;
    }
    get _bezier()
    {
        return new CubicBezier(-this.world.xScreen * 3 / 8, -this.world.yScreen / 2, 
            0, 0, 0, 0,
            this.world.xScreen / 2, -this.world.yScreen / 4);
    }
}

class BettyWave extends BomberWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.waveLevel = 1;
        this.waveInc = 1;
    }
    get _enemyVehiclePool()
    {
        return new BettyPool();
    }
}

class KateWave extends BomberWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.vehicles = 4;
    }
    get _enemyVehiclePool()
    {
        return new KatePool();
    }
}

class StraightLineEnemyWave extends AbstractEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.startIsoCoord = [0,0,0];
        this.zeroSpeed = 6;
        this.vehicleRotation = Math.PI;
    }
    addNewVehicle(pos)
    {
        let vehicle = super.addNewVehicle(pos);
        vehicle.yRotation = this.vehicleRotation;
        vehicle.speed[1] = this.zeroSpeed;
        return vehicle;
    }
    testDone(vehicle)
    {
        let coords = this.world.isoCoordToScreen(vehicle.position[0], vehicle.position[1], vehicle.position[2]);
        return (coords[0] < -this.world.xScreen / 2 || coords[1] > this.world.yScreen / 2);
    }

}

class VerticalEnemyWave extends StraightLineEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.randomize();      
        this.vehicles = 5;
        this.separation = 6
        
    }
    randomize(yPos = MyWorld.Altitude.DogFight)
    {
        if(MathsFunctions.RandomIntInclusive(0, 1))
        {
            //start on x
            let ran = MathsFunctions.RandomFloat(this.world.xScreen / 4, this.world.xScreen / 2);
            this.startIsoCoord = this.world.screenToIsoCoord(ran, -this.world.yScreen / 2, yPos);
        }
        else
        {
            //start on z
            let ran = MathsFunctions.RandomFloat(-this.world.yScreen / 2, -this.world.yScreen / 4);
            this.startIsoCoord = this.world.screenToIsoCoord(this.world.xScreen / 2, ran, yPos);
        }
        
    }
    get startPositions()
    {
        return [[...this.startIsoCoord]];
    }
    doTestAddNewVehicles()
    {
        return this.children.length == 0 || (this.vehiclesCount < this.vehiclesLeft && (MathsFunctions.Dis([this.children[this.children.length - 1].position[0], this.children[this.children.length - 1].position[2]], [this.startIsoCoord[0], this.startIsoCoord[2]]) > this.separation));
    }
}

class ShippingEnemyWave extends VerticalEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain)
        terrain.onTerrainChunkPassed.addListener(() =>
        {
            if(this.active)
            {
                terrain.terrainChunks[1].clearTerrain();
                this.terrainPassesCount ++;
                if(this.terrainPassesCount == this.altitudeTerrainPasses)
                {
                    this.onAltitudeChanged.dispatch((MyWorld.Altitude.SurfaceAttack));
                }
                else if(this.terrainPassesCount == this.terrainPasses)
                {
                    this.terrainReady = true;
                }
            }
        });
        this.terrainReady = false;
        this.separation = 12;
        this.zeroSpeed = terrain.terrainSpeed;
        this.terrainPasses = 3;
        this.terrainPassesCount = 0;
        this.altitudeTerrainPasses = this.terrainPasses - 1;
        this.vehicleRotation = Math.PI / 2;
        this.canPowerUp = false;
        this.waveLevel = 2;
        this.waveInc = 1;
    }
    doTestAddNewVehicles()
    {
        return this.terrainReady && super.doTestAddNewVehicles();
    }
    get startPositions()
    {
        this.randomize(0.5);
        return super.startPositions;
    }
    stop(sendSignal)
    {
        this.terrainPassesCount = 0;
        this.terrainReady = false;
        super.stop(sendSignal);
        this.onAltitudeChanged.dispatch((MyWorld.Altitude.DogFight));
    }
    get _enemyVehiclePool()
    {
        return new EnemyShipPool();
    }
}

class HorizontalEnemyWave extends StraightLineEnemyWave
{
    constructor(world, position, terrain)
    {
        super(world, position, terrain);
        this.vehicles = 4;
        this.separation = 4.5;
        this.maxXOffset = 15;
        this.randomize();
    }
    randomize()
    {
        this.startIsoCoord = this.world.screenToIsoCoord(this.world.xScreen / 2, -this.world.yScreen / 2, MyWorld.Altitude.DogFight);
        this.startIsoCoord[0] += MathsFunctions.RandomFloat(this.maxXOffset, 0)
    }
    get startPositions()
    {
        let positions = []
        for(let i = 0; i < this.vehicles; i++)
        {
            let pos = [...this.startIsoCoord];
            pos[0] -= i * this.separation;
            positions.push(pos);
        }
        return positions;
    }
    doTestAddNewVehicles(positions)
    {
        return this.children.length == 0 || this.vehiclesCount < this.vehiclesLeft
    }
}

class AbstractBullet extends Spatial
{
	
	constructor(world, position, color)
	{
		super(world, position, new Cube(world.gl, [0.5,0.2,0.2],
			color));
		this.size = [0.5, 0.5];    
		this.damage = 1 / 3;
        this.onBulletOffScreen = new Signal();
	}
	poolReset()
	{
		super.poolReset();
		this.onCollide.clearListeners();
        this.onBulletOffScreen.clearListeners();
	}
    update(deltaTimeSec)
    {
        if(this.world.isOffScreen(this.position))
        {
            this.speed = [0,0];
            this.onBulletOffScreen.dispatch(this);
        }
    }
}

class PlayerBullet extends AbstractBullet
{
	static get CollisionID()
	{
		return 1 << 2;
	}
	constructor(world, position)
	{
		super(world, position, MyWorld.Palette.Red);
		this.collisionGroup |= EnemyVehicle.CollisionID;
	}
	
}

class EnemyBullet extends AbstractBullet
{
	static get CollisionID()
	{
		return 1 << 3;
	}
	constructor(world, position)
	{
		super(world, position, MyWorld.Palette.Yellow);
		this.damage = 1/6;
	}
}
    

class VehicleBuilder
{
    static BuildVehicle(world, datas, scale = 1)
    {
        let spatials = [];
        let xScales = [-1, 1]
        xScales.forEach((xScale) =>
        {
            datas.forEach((data) =>
            {
                if(!(data[6] && xScale == -1))
                {
                    let scaledData = data.slice(0);
                    for (let i = 0; i < 6; i ++)
                    {
                        scaledData[i] *= scale;
                    }
                    let pos = scaledData.slice(0, 3);
                    pos[0] *= xScale;
                    let size = scaledData.slice(3, 6);
                    let color = data.slice(7, 11);
                    let spatial = new Spatial(world, pos, new Cube(world.gl, size, color));
                    spatials.push(spatial);
                }
            });
        });
        return spatials;
    }
    static BuildShadow(world, datas, scale = 1)
    {
        let spatials = [];
        let xScales = [-1, 1]
        let color = MyWorld.Palette.Black
        xScales.forEach((xScale) =>
        {
            datas.forEach((data) =>
            {
                let scaledData = data.slice(0);
                for (let i = 0; i < 6; i ++)
                {
                    scaledData[i] *= scale;
                }
                let pos = scaledData.slice(0, 3);
                pos[0] *= xScale;
                pos[1] = 0;
                let size = scaledData.slice(3, 6);
                size[1] = 0.1;
                let spatial = new Spatial(world, pos, new Cube(world.gl, size, color));
                spatials.push(spatial);
            });
        });
        return spatials;
    }
    static ReconstructVehicle(vehicle, datas, scale = 1)
    {
        let xScales = [-1, 1]
        let index = 0;
        xScales.forEach((xScale) =>
        {
            datas.forEach((data) =>
            {
                if(!(data[6] && xScale == -1))
                {
                    let scaledData = data.slice(0);
                    for (let i = 0; i < 6; i ++)
                    {
                        scaledData[i] *= scale;
                    }
                    let pos = scaledData.slice(0, 3);
                    pos[0] *= xScale;
                    let size = scaledData.slice(3, 6);
                    let spatial = vehicle.children[index];
                    spatial.size = size;
                    spatial.position = pos;
                    spatial.speed = [0, 0];
                    index ++;
                }
            });
        });
    }
} 

class TerrainChunkPool extends Pool
{
    constructor()
    {
        super()
    }
    newObject(objectArgs)
    {
        return new TerrainChunk(objectArgs.world, objectArgs.position);
    }
    
}

class TerrainBlockPool extends Pool
{
	constructor()
	{
		super();
	}
	newObject(objectArgs)
	{
		return new TerrainBlock(objectArgs.world,
			objectArgs.position, objectArgs.height);
	}
    free(object)
    {
        super.free(object);
    }
}

class ZeroPool extends Pool
{
    constructor()
    {
        super();
    }
    newObject(objectArgs)
    {
        return new Zero(objectArgs.world,
            objectArgs.position, objectArgs.terrain)
    }
}

class BettyPool extends Pool
{
    constructor()
    {
        super();
    }
    newObject(objectArgs)
    {
        return new Betty(objectArgs.world,
            objectArgs.position, objectArgs.terrain)
    }
}

class KatePool extends Pool
{
    constructor()
    {
        super();
    }
    newObject(objectArgs)
    {
        return new Kate(objectArgs.world,
            objectArgs.position, objectArgs.terrain)
    }
}

class EnemyShipPool extends Pool
{
    constructor()
    {
        super();
    }
    newObject(objectArgs)
    {
        return new EnemyShip(objectArgs.world,
            objectArgs.position, objectArgs.terrain)
    }
}

class HellCatPool extends Pool
{
    constructor()
    {
        super();
    }
    newObject(objectArgs)
    {
        return new HellCat(objectArgs.world,
            objectArgs.position, objectArgs.terrain)
    }
}

class PlayerBulletPool extends Pool
{
	constructor()
	{
		super();
	}
	newObject(objectArgs)
	{
		return new PlayerBullet(objectArgs.world,
			objectArgs.position);
	}
}

class EnemyBulletPool extends Pool
{
	constructor()
	{
		super();
	}
	newObject(objectArgs)
	{
		return new EnemyBullet(objectArgs.world,
			objectArgs.position);
	}
}

class PowerUpPool extends Pool
{
    constructor()
    {
        super()
    }
    newObject(objectArgs)
	{
		return new PowerUp(objectArgs.world);
	}
}

let myWorld = new MyWorld()