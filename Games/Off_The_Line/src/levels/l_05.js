class L05 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:0});
        this.linePoints[0].push({x:0, y:200});
        this.linePoints[0].push({x:200, y:0});
        this.linePoints[0].push({x:0, y:-200});

        this.levelTime = 12.0;
        this.timer = this.levelTime;
        this.name = "PATIENCE";
    }

    addItems()
    {
        aw.addEntity(new Wall(0, 0, 250, 0, 40));

        aw.addEntity(new Coin(0, 120));
        aw.addEntity(new Coin(30, 90));
        aw.addEntity(new Coin(60, 60));
        aw.addEntity(new Coin(90, 30));

        aw.addEntity(new Coin(-30, 90));
        aw.addEntity(new Coin(-60, 60));
        aw.addEntity(new Coin(-90, 30));
        aw.addEntity(new Coin(-120, 0));

        aw.addEntity(new Coin(-90, -30));
        aw.addEntity(new Coin(-60, -60));
        aw.addEntity(new Coin(-30, -90));
        aw.addEntity(new Coin(0, -120));

        aw.addEntity(new Coin(30, -90));
        aw.addEntity(new Coin(60, -60));
        aw.addEntity(new Coin(90, -30));
        aw.addEntity(new Coin(120,  0));
    }
}