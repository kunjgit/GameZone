class L15 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-280, y:150});
        this.linePoints[0].push({x:-280, y: -150});
        this.linePoints[0].push({x:-260, y: -150});
        this.linePoints[0].push({x:-260, y: 150});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-100, y:100});
        this.linePoints[1].push({x:-100, y: -100});
        this.linePoints[1].push({x:-80, y: -100});
        this.linePoints[1].push({x:-80, y: 100});

        this.linePoints.push([]);
        this.linePoints[2].push({x:80, y:50});
        this.linePoints[2].push({x:80, y: -50});
        this.linePoints[2].push({x:100, y: -50});
        this.linePoints[2].push({x:100, y: 50});

        this.linePoints.push([]);
        this.linePoints[3].push({x:260, y:25});
        this.linePoints[3].push({x:260, y: -25});
        this.linePoints[3].push({x:280, y: -25});
        this.linePoints[3].push({x:280, y: 25});

        this.name = "BAR GAPS";
    }

    addItems()
    {
        aw.addEntity(new Coin(-130, 0));
        aw.addEntity(new Coin(-180, 0));
        aw.addEntity(new Coin(-230, 0));

        aw.addEntity(new Coin(-130, 80));
        aw.addEntity(new Coin(-180, 80));
        aw.addEntity(new Coin(-230, 80));

        aw.addEntity(new Coin(-130, -80));
        aw.addEntity(new Coin(-180, -80));
        aw.addEntity(new Coin(-230, -80));

        aw.addEntity(new Coin(-50, -30));
        aw.addEntity(new Coin(0, -30));
        aw.addEntity(new Coin(50, -30));

        aw.addEntity(new Coin(-50, 30));
        aw.addEntity(new Coin(0, 30));
        aw.addEntity(new Coin(50, 30));

        aw.addEntity(new Coin(130, 0));
        aw.addEntity(new Coin(180, 0));
        aw.addEntity(new Coin(230, 0));
    }
}