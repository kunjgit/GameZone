class L07 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:50, y:-100});
        this.linePoints[0].push({x:-50, y:-100});
        this.normals.push([]);
        this.normals[0].push({x:0, y:1});
        this.normals[0].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-125, y:100});
        this.linePoints[1].push({x:-25, y:100});
        this.normals.push([]);
        this.normals[1].push({x:0, y:-1});
        this.normals[1].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:125, y:100});
        this.linePoints[2].push({x:25, y:100});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:0, y:-1});

        this.name = "SPLITTER";
    }

    addItems()
    {
        aw.addEntity(new Coin(-35, -50));
        aw.addEntity(new Coin(-35, -25));
        aw.addEntity(new Coin(-35, 0));
        aw.addEntity(new Coin(-35, 25));
        aw.addEntity(new Coin(-35, 50));

        aw.addEntity(new Coin(35, -50));
        aw.addEntity(new Coin(35, -25));
        aw.addEntity(new Coin(35, 0));
        aw.addEntity(new Coin(35, 25));
        aw.addEntity(new Coin(35, 50));
    }
}