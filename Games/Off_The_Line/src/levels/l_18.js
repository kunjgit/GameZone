class L18 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-250, y:0});
        this.linePoints[0].push({x:-250, y:50});
        this.linePoints[0].push({x:250, y:50});
        this.linePoints[0].push({x:-250, y:50});
        this.normals.push([]);
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[1].push({x:250, y:0});
        this.linePoints[1].push({x:250, y:-50});
        this.linePoints[1].push({x:-250, y:-50});
        this.linePoints[1].push({x:250, y:-50});
        this.normals.push([]);
        this.normals[1].push({x:-1, y:0});
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:-1, y:0});

        this.name = "X FACTOR";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, -25));
        aw.addEntity(new Coin(0, 25));

        aw.addEntity(new Coin(100, -25));
        aw.addEntity(new Coin(100, 25));

        aw.addEntity(new Coin(-100, -25));
        aw.addEntity(new Coin(-100, 25));

        aw.addEntity(new Coin(200, -25));
        aw.addEntity(new Coin(200, 25));

        aw.addEntity(new Coin(-200, -25));
        aw.addEntity(new Coin(-200, 25));

        aw.addEntity(new Wall(200, 0, 80, 0, 270, -400, 0, 0.75, 0));
        aw.addEntity(new Wall(200, 0, 80, 90, 270, -400, 0, 0.75, 0));
    }
}