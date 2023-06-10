class L11 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:0});
        this.linePoints[0].push({x:-225, y: 0});
        this.linePoints[0].push({x:-225, y: 50});
        this.linePoints[0].push({x:225, y: 50});
        this.linePoints[0].push({x:225, y: 0});
        this.linePoints[0].push({x:300, y: 0});
        this.linePoints[0].push({x:225, y: 0});
        this.linePoints[0].push({x:225, y: -50});
        this.linePoints[0].push({x:-225, y: -50});
        this.linePoints[0].push({x:-225, y: 0});

        this.name = "CIRCUIT";
    }

    addItems()
    {
        for (let i = 0; i < 6; i++)
        {
            aw.addEntity(new Coin(-125 + 50*i, 30));
            aw.addEntity(new Coin(-125 + 50*i, 0));
            aw.addEntity(new Coin(-125 + 50*i, -30));
        }

        aw.addEntity(new Wall(0, -50, 50, 90));
        aw.addEntity(new Wall(-50, 50, 50, 90));
        aw.addEntity(new Wall(50, 50, 50, 90));
        aw.addEntity(new Wall(-100, -50, 50, 90));
        aw.addEntity(new Wall(100, -50, 50, 90));
        aw.addEntity(new Wall(-150, 50, 50, 90));
        aw.addEntity(new Wall(150, 50, 50, 90));
    }
}