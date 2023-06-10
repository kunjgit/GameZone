class L20 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-100, y:100});
        this.linePoints[0].push({x:100, y: 100});
        this.linePoints[0].push({x:100, y: -100});
        this.linePoints[0].push({x:-100, y: -100});

        this.name = "REVENGE OF THE BOX";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(-50, 0));
        aw.addEntity(new Coin(50, 0));
        aw.addEntity(new Coin(-25, 0));
        aw.addEntity(new Coin(25, 0));

        aw.addEntity(new Coin(0, 50));
        aw.addEntity(new Coin(-50, 50));
        aw.addEntity(new Coin(50, 50));
        aw.addEntity(new Coin(-25, 50));
        aw.addEntity(new Coin(25, 50));

        aw.addEntity(new Coin(0, -50));
        aw.addEntity(new Coin(-50, -50));
        aw.addEntity(new Coin(50, -50));
        aw.addEntity(new Coin(-25, -50));
        aw.addEntity(new Coin(25, -50));

        aw.addEntity(new Wall(-32, 32, 50, 0, 180));
        aw.addEntity(new Wall(38, -50, 50, 90, 0, 0, 50, 1.0, 0.5));
    }
}