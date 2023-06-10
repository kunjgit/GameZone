class L04 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-60, y:150});
        this.linePoints[0].push({x:60, y: 150});
        this.linePoints[0].push({x:60, y: -150});
        this.linePoints[0].push({x:-60, y: -150});

        this.name = "NEEDLE";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 50));
        aw.addEntity(new Coin(0, -50));

        aw.addEntity(new Wall(-40, 25, 40, 0));
        aw.addEntity(new Wall(40, -25, 40, 0));
        aw.addEntity(new Wall(40, 75, 40, 0));
        aw.addEntity(new Wall(-40, -75, 40, 0));
    }
}