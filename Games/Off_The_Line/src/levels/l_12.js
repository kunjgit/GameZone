class L12 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-225, y:150});
        this.linePoints[0].push({x:-225, y:50});
        this.linePoints[0].push({x:-125, y:50});
        this.linePoints[0].push({x:-125, y:150});

        this.linePoints.push([]);
        this.linePoints[1].push({x:175, y:125});
        this.linePoints[1].push({x:175, y:75});
        this.linePoints[1].push({x:225, y:75});
        this.linePoints[1].push({x:225, y:125});

        this.linePoints.push([]);
        this.linePoints[2].push({x:150, y:-75});
        this.linePoints[2].push({x:150, y:-125});
        this.linePoints[2].push({x:200, y:-125});
        this.linePoints[2].push({x:200, y:-75});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-200, y:-85});
        this.linePoints[3].push({x:-200, y:-110});
        this.linePoints[3].push({x:-175, y:-110});
        this.linePoints[3].push({x:-175, y:-85});

        this.name = "QUADS";
    }

    addItems()
    {
        for (let i = 0; i < 5; i++)
        {
            aw.addEntity(new Coin(-75 + i*50, 100));
        }

        for (let i = 0; i < 6; i++)
        {
            aw.addEntity(new Coin(-135 + i*50, -97.5));
        }

        for (let i = 0; i < 2; i++)
        {
            aw.addEntity(new Coin(-187.5, 10 - i*50));
        }

        for (let i = 0; i < 3; i++)
        {
            aw.addEntity(new Coin(187.5, 50 - i*50));
        }
    }
}