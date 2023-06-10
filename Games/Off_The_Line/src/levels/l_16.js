class L16 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-275, y:-200});
        this.linePoints[0].push({x:-250, y:-200});
        this.normals.push([]);
        this.normals[0].push({x:0, y: 1});
        this.normals[0].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-275, y:0});
        this.linePoints[1].push({x:-250, y:25});
        this.normals.push([]);
        this.normals[1].push({x:0.707, y: -0.707});
        this.normals[1].push({x:0.707, y: -0.707});

        this.linePoints.push([]);
        this.linePoints[2].push({x:-150, y:-200});
        this.linePoints[2].push({x:-25, y:-200});
        this.normals.push([]);
        this.normals[2].push({x:0, y: 1});
        this.normals[2].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-75, y:100});
        this.linePoints[3].push({x:-50, y:125});
        this.normals.push([]);
        this.normals[3].push({x:0.707, y: -0.707});
        this.normals[3].push({x:0.707, y: -0.707});

        this.linePoints.push([]);
        this.linePoints[4].push({x:160, y:-200});
        this.linePoints[4].push({x:285, y:-200});
        this.normals.push([]);
        this.normals[4].push({x:0, y: 1});
        this.normals[4].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[5].push({x:160, y:180});
        this.linePoints[5].push({x:285, y:180});
        this.normals.push([]);
        this.normals[5].push({x:0, y: -1});
        this.normals[5].push({x:0, y: -1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;

        this.name = "ZIG ZAG";
    }

    addItems()
    {
        for (let i = 0; i < 3; i++)
        {
            aw.addEntity(new Coin(-262, -150 + i*50));
        }

        for (let i = 1; i < 4; i++)
        {
            aw.addEntity(new Coin(-262 + i*50, 12 - i*50));
        }

        for (let i = 0; i < 5; i++)
        {
            aw.addEntity(new Coin(-62, -150 + i*50));
        }

        for (let i = 1; i < 6; i++)
        {
            aw.addEntity(new Coin(-62 + i*50, 112 - i*50));
        }

        for (let i = 0; i < 7; i++)
        {
            aw.addEntity(new Coin(222, -150 + i*50));
        }

        aw.addEntity(new Wall(-225, -75, 100, 0, -180));
        aw.addEntity(new Wall(-12, 0, 125, 0, 180));

        aw.addEntity(new Wall(222, 50, 100, 0, 0, -100, 0, 1.0, 0.5));
        aw.addEntity(new Wall(222, -50, 100, 0, 0, 100, 0, 1.0, 0.5));
    }
}