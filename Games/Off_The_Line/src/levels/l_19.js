class L19 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-150, y:150});
        this.linePoints[0].push({x:-200, y:150});
        this.linePoints[0].push({x:-200, y:100});
        this.linePoints[0].push({x:-200, y:150});
        this.normals.push([]);
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-150, y:0});
        this.linePoints[1].push({x:-200, y:0});
        this.linePoints[1].push({x:-200, y:50});
        this.linePoints[1].push({x:-200, y:0});
        this.normals.push([]);
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:150, y:50});
        this.linePoints[2].push({x:200, y:50});
        this.linePoints[2].push({x:200, y:0});
        this.linePoints[2].push({x:200, y:50});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:-1, y:0});
        this.normals[2].push({x:-1, y:0});
        this.normals[2].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:150, y:-100});
        this.linePoints[3].push({x:200, y:-100});
        this.linePoints[3].push({x:200, y:-50});
        this.linePoints[3].push({x:200, y:-100});
        this.normals.push([]);
        this.normals[3].push({x:0, y:1});
        this.normals[3].push({x:-1, y:0});
        this.normals[3].push({x:-1, y:0});
        this.normals[3].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[4].push({x:-150, y:-50});
        this.linePoints[4].push({x:-200, y:-50});
        this.linePoints[4].push({x:-200, y:-100});
        this.linePoints[4].push({x:-200, y:-50});
        this.normals.push([]);
        this.normals[4].push({x:0, y:-1});
        this.normals[4].push({x:1, y:0});
        this.normals[4].push({x:1, y:0});
        this.normals[4].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[5].push({x:-150, y:-200});
        this.linePoints[5].push({x:-200, y:-200});
        this.linePoints[5].push({x:-200, y:-150});
        this.linePoints[5].push({x:-200, y:-200});
        this.normals.push([]);
        this.normals[5].push({x:0, y:1});
        this.normals[5].push({x:1, y:0});
        this.normals[5].push({x:1, y:0});
        this.normals[5].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[6].push({x:150, y:-200});
        this.linePoints[6].push({x:200, y:-200});
        this.linePoints[6].push({x:200, y:-150});
        this.linePoints[6].push({x:200, y:-200});
        this.normals.push([]);
        this.normals[6].push({x:0, y:1});
        this.normals[6].push({x:-1, y:0});
        this.normals[6].push({x:-1, y:0});
        this.normals[6].push({x:0, y:1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;
        this.name = "SNAKE";
    }

    addItems()
    {
        aw.addEntity(new Coin(-175, 125));
        aw.addEntity(new Coin(-175, 75));
        aw.addEntity(new Coin(-175, 25));

        for (let i = 0; i < 7; i++)
        {
            aw.addEntity(new Coin(-125 + 50*i, 25));
            aw.addEntity(new Coin(-125 + 50*i, -75));
            aw.addEntity(new Coin(-125 + 50*i, -175));
        }

        aw.addEntity(new Coin(175, -25));
        aw.addEntity(new Coin(-175, -75));
        aw.addEntity(new Coin(-175, -125));
        aw.addEntity(new Coin(-175, -175));

        aw.addEntity(new Wall(0, -25, 150, 0, 180));
    }
}