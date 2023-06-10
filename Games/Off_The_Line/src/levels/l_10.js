class L10 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:100});
        this.linePoints[0].push({x:-300, y:-100});
        this.normals.push([]);
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[1].push({x:300, y:100});
        this.linePoints[1].push({x:300, y:-100});
        this.normals.push([]);
        this.normals[1].push({x:-1, y:0});
        this.normals[1].push({x:-1, y:0});

        this.name = "LONG DISTANCE";
    }

    addItems()
    {
        aw.addEntity(new Coin(-50, 0));
        aw.addEntity(new Coin(50, 0));
        aw.addEntity(new Coin(100, 0));
        aw.addEntity(new Coin(-100, 0));
        aw.addEntity(new Coin(200, 0));
        aw.addEntity(new Coin(-200, 0));
        aw.addEntity(new Coin(250, 0));
        aw.addEntity(new Coin(-250, 0));

        aw.addEntity(new Wall(0, -100, 75, 90, 0, 0, 200, 1.0, 0.5));
        aw.addEntity(new Wall(-150, -100, 75, 90, 0, 0, 200, 1.5, 0.5));
        aw.addEntity(new Wall(150, -100, 75, 90, 0, 0, 200, 0.5, 0.5));
    }
}