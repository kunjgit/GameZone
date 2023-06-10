class L06 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:200});
        this.linePoints[0].push({x:-50, y: 200});
        this.linePoints[0].push({x:-50, y: 20});
        this.linePoints[0].push({x:200, y: 20});

        this.linePoints[0].push({x:200, y:-200});
        this.linePoints[0].push({x:50, y: -200});
        this.linePoints[0].push({x:50, y: -20});
        this.linePoints[0].push({x:-200, y: -20});

        this.name = "BOOMERANG";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(-30, 0));
        aw.addEntity(new Coin(-60, 0));
        aw.addEntity(new Coin(30, 0));
        aw.addEntity(new Coin(60, 0));
        aw.addEntity(new Coin(90, 0));
        aw.addEntity(new Coin(-90, 0));
        aw.addEntity(new Coin(120, 0));
        aw.addEntity(new Coin(-120, 0));

        aw.addEntity(new Wall(-125, 160, 150));
        aw.addEntity(new Wall(125, -160, 150));
        aw.addEntity(new Coin(-125, 180));
        aw.addEntity(new Coin(125, -180));

        aw.addEntity(new Wall(-60, 40, 40, 90));
        aw.addEntity(new Wall(60, -40, 40, 90));
    }
}