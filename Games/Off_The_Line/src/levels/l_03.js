class L03 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 150;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = Math.PI*2 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.name = "ORBIT";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 0, 50, 90, 70));
        aw.addEntity(new Coin(0, 0, 100, 90, 70));
        aw.addEntity(new Coin(0, 0, 50, 270, 70));
        aw.addEntity(new Coin(0, 0, 100, 270, 70));
    }
}