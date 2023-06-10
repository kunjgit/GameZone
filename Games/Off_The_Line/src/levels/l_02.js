class L02 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:100});
        this.linePoints[0].push({x:200, y: 100});
        this.linePoints[0].push({x:200, y: -100});
        this.linePoints[0].push({x:-200, y: -100});

        this.name = "PEGBOARD";
    }

    addItems()
    {
        let xCols = [-150, -75, 0, 75, 150];
        let yCols = [-60, -20, 20, 60];
        for (let y = 0; y < yCols.length; y++)
        {
            for (let x = 0; x < xCols.length; x++)
            {
                aw.addEntity(new Coin(xCols[x], yCols[y]));
            }
        }
    }
}