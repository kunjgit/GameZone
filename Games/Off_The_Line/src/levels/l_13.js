class L13 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:100});

        this.linePoints[0].push({x:-145, y:100});
        this.linePoints[0].push({x:-135, y:80});
        this.linePoints[0].push({x:-115, y:80});
        this.linePoints[0].push({x:-105, y:100});

        this.linePoints[0].push({x:105, y:100});
        this.linePoints[0].push({x:115, y:80});
        this.linePoints[0].push({x:135, y:80});
        this.linePoints[0].push({x:145, y:100});

        this.linePoints[0].push({x:300, y: 100});

        this.linePoints[0].push({x:300, y:20});
        this.linePoints[0].push({x:280, y:10});
        this.linePoints[0].push({x:280, y:-10});
        this.linePoints[0].push({x:300, y:-20});

        this.linePoints[0].push({x:300, y: -100});

        this.linePoints[0].push({x:145, y:-100});
        this.linePoints[0].push({x:135, y:-80});
        this.linePoints[0].push({x:115, y:-80});
        this.linePoints[0].push({x:105, y:-100});

        this.linePoints[0].push({x:-105, y:-100});
        this.linePoints[0].push({x:-115, y:-80});
        this.linePoints[0].push({x:-135, y:-80});
        this.linePoints[0].push({x:-145, y:-100});

        this.linePoints[0].push({x:-300, y: -100});

        this.linePoints[0].push({x:-300, y:-20});
        this.linePoints[0].push({x:-280, y:-10});
        this.linePoints[0].push({x:-280, y:10});
        this.linePoints[0].push({x:-300, y:20});

        this.name = "RAZOR";
    }

    addItems()
    {
        for (let i = 0; i < 10; i++)
        {
            aw.addEntity(new Coin(-225 + i*50, 0));
        }
        
        aw.addEntity(new Coin(-125, 40));
        aw.addEntity(new Coin(-125, -40));
        aw.addEntity(new Coin(125, 40));
        aw.addEntity(new Coin(125, -40));
    }
}