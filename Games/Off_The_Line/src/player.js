class Player
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.xPrev = 0;
        this.yPrev = 0;
        this.xPrev2 = 0;
        this.yPrev2 = 0;
        this.boxSize = 12;
        this.speed = difficultyMode === 0 ? 250 : 400;
        this.maxButtonClickLookBackTime = 0.2;
        this.lastLeftButtonClickedDeltaTime = Number.MAX_SAFE_INTEGER;
        this.curLineDist = 0;
        this.curLevelGroup = 0;
        this.curState = this.onLineUpdate;
        this.jumpVel = {x:0, y:0};
        this.jumpSpeed = 1500;
        this.isJumping = false;
        this.isDead = false;
        this.angle = 0;
        this.rotSpeed = 180;
        this.xLineDir = 0;
        this.yLineDir = 0;

        let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
        this.x = posInfo.x;
        this.y = posInfo.y;
        this.xPrev2 = this.x;
        this.yPrev2 = this.y;
        this.xPrev = this.x;
        this.yPrev = this.y;
        this.xJump = this.x;
        this.yJump = this.y;
    }

    update(deltaTime)
    {
        this.xPrev2 = this.xPrev;
        this.yPrev2 = this.yPrev;
        this.xPrev = this.x;
        this.yPrev = this.y;

        this.angle += this.rotSpeed*deltaTime;

        if (this.curState !== undefined)
        {
            this.curState(deltaTime);
        }
    }

    onLineUpdate(deltaTime)
    {
        this.curLineDist += this.speed*deltaTime;
        if (this.curLineDist < 0.0)
        {
            this.curLineDist += level.totalDistance[this.curLevelGroup];
        }
        this.curLineDist = (this.curLineDist % level.totalDistance[this.curLevelGroup]);
        let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
        this.x = posInfo.x;
        this.y = posInfo.y;
        this.xLineDir = posInfo.xDir;
        this.yLineDir = posInfo.yDir;

        // Check for death
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Wall)
            {
                let lineIntersectInfo = getLineIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y, entity.x1, entity.y1, entity.x2, entity.y2);
                if (lineIntersectInfo.intersect)
                {
                    addDeathParticle(lineIntersectInfo.x, lineIntersectInfo.y);
                    this.hit();
                }
            }
        });

        if (!this.isDead)
        {
            this.lastLeftButtonClickedDeltaTime += deltaTime;
            if ((aw.mouseLeftButtonJustPressed && (aw.mousePos.x < 460.0 || aw.mousePos.y > 50.0)) || aw.keysJustPressed["space"])
            {
                this.lastLeftButtonClickedDeltaTime = 0;
            }

            if (this.lastLeftButtonClickedDeltaTime <= this.maxButtonClickLookBackTime)
            {
                this.jumpVel = {x:posInfo.nx * this.jumpSpeed, y:posInfo.ny * this.jumpSpeed};
                this.xJump = this.x;
                this.yJump = this.y;

                this.isJumping = true;
                this.curState = this.jumpingUpdate;

                aw.playNote("a", 5, 0.01);
                aw.playNote("a#", 5, 0.01, 0.01);
                aw.playNote("b", 5, 0.01, 0.02);
            }
        }
    }

    jumpingUpdate(deltaTime)
    {
        this.x += this.jumpVel.x * deltaTime;
        this.y += this.jumpVel.y * deltaTime;

        // Check for death
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Wall)
            {
                let lineIntersectInfo = getLineIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y, entity.x1, entity.y1, entity.x2, entity.y2);
                if (lineIntersectInfo.intersect)
                {
                    addDeathParticle(lineIntersectInfo.x, lineIntersectInfo.y);
                    this.hit();
                }
            }
        });
        
        // Off screen?
        if (this.x < -screenWidth*0.5 - this.boxSize || this.x > screenWidth*0.5 + this.boxSize ||
            this.y < -screenHeight*0.5 - this.boxSize || this.y > screenHeight*0.5 + this.boxSize)
        {
            this.hit();
        }

        if (!this.isDead)
        {
            // Check for hitting coins
            aw.entities.forEach(entity =>
            {
                if (entity instanceof Coin)
                {
                    let distToPlayer = sqDistanceToLine(this.xPrev, this.yPrev, this.x, this.y, entity.x, entity.y);
                    if (distToPlayer <= entity.hitSizeSq)
                    {
                        entity.hit();
                    }
                }
            });

            // Check for hitting level again
            let intersectInfo = level.getIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y);
            if (intersectInfo.intersect)
            {
                let xDist = intersectInfo.x - this.xJump;
                let yDist = intersectInfo.y - this.yJump;
                let sqDist = xDist*xDist + yDist*yDist;
                if (sqDist > 225.0) // > 15.0 dist
                {
                    this.curLineDist = intersectInfo.distance;
                    this.curLevelGroup = intersectInfo.group;
                    let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
                    this.x = posInfo.x;
                    this.y = posInfo.y;
                    this.lastLeftButtonClickedDeltaTime = Number.MAX_SAFE_INTEGER;

                    this.isJumping = false;
                    this.curState = this.onLineUpdate;

                    // Change direction if the line we jumped to is in the opposite direction
                    // compared to the line we jumped from. This makes the player keep going
                    // in the same direction that you were previously going.
                    let dot = posInfo.xDir*this.xLineDir + posInfo.yDir*this.yLineDir;
                    if (dot < 0.0)
                    {
                        this.speed = -this.speed;
                    }

                    startCameraShake(2.5, 0.15);

                    aw.playNote("a", 4, 0.01);
                    aw.playNote("a#", 4, 0.01, 0.01);
                }
            }
        }
    }

    deadUpdate()
    {

    }

    render()
    {
        if (!this.isDead)
        {
            aw.ctx.save();
            aw.ctx.translate(this.x, this.y);
            aw.ctx.rotate(this.angle);
            let lineWidthSave = aw.ctx.lineWidth;
            aw.ctx.lineWidth = 4;
            aw.ctx.strokeStyle = "#08F";
            aw.ctx.shadowColor = "#08F";
            aw.ctx.beginPath();
            aw.ctx.rect(-this.boxSize*0.5, -this.boxSize*0.5, this.boxSize, this.boxSize);
            aw.ctx.stroke();
            aw.ctx.restore();
            aw.ctx.lineWidth = lineWidthSave;
        }
    }

    hit()
    {
        lives = Math.max(lives - 1, 0);
        this.isDead = true;
        this.curState = this.deadUpdate;

        startCameraShake(5, 0.2);
        aw.playNote("a", 1, 0.2, 0.0, "square");
        aw.playNoise(0.05);
    }
}