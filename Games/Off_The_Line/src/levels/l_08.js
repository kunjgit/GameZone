class L08 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-250, y:-100});
        this.linePoints[0].push({x:250, y: -100});
        this.normals.push([]);
        this.normals[0].push({x:0, y:1});
        this.normals[0].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-140, y:100});
        this.linePoints[1].push({x:-110, y:100});
        this.normals.push([]);
        this.normals[1].push({x:0, y:-1});
        this.normals[1].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:140, y:100});
        this.linePoints[2].push({x:110, y:100});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-15, y:100});
        this.linePoints[3].push({x:15, y:100});
        this.normals.push([]);
        this.normals[3].push({x:0, y:-1});
        this.normals[3].push({x:0, y:-1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;

        this.name = "TRIPLE SHOT";
    }

    addItems()
    {
        aw.addEntity(new Coin(-125, -50));
        aw.addEntity(new Coin(-125, 0));
        aw.addEntity(new Coin(-125, 50));

        aw.addEntity(new Coin(0, -50));
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 50));

        aw.addEntity(new Coin(125, -50));
        aw.addEntity(new Coin(125, 0));
        aw.addEntity(new Coin(125, 50));
    }
}