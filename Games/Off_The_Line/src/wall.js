class Wall
{
    constructor(x, y, length, angle, rotSpeed, xMove, yMove, moveTime, idleTime)
    {
        this.xCenter = x;
        this.yCenter = y;
        this.length = length;
        this.halfLength = length * 0.5;
        this.angle = angle !== undefined ? angle * Math.PI/180 : 0;
        this.rotSpeed = rotSpeed !== undefined ? rotSpeed * Math.PI/180 : 0;
        this.xMove = xMove !== undefined ? xMove : 0;
        this.yMove = yMove !== undefined ? yMove : 0;
        this.moveTime = moveTime !== undefined ? moveTime : 0;
        this.idleTime = idleTime !== undefined ? idleTime : 0;
        this.curTimer = this.moveTime;
        this.isMoving = true;
        this.moveForward = true;
        this.curMovePct = 0.0;

        this.updateEndPoints();
    }

    update(deltaTime)
    {
        let changed = false;

        if (this.rotSpeed !== 0)
        {
            this.angle += this.rotSpeed*deltaTime;
            changed = true;
        }

        if ((this.xMove !== 0 || this.yMove !== 0) && this.moveTime !== 0)
        {
            if (this.isMoving)
            {
                this.curMovePct = this.moveForward ? 1.0 - (this.curTimer / this.moveTime) : this.curTimer / this.moveTime;
            }
            else
            {
                this.curMovePct = this.moveForward ? 0.0 : 1.0;
            }

            this.curTimer -= deltaTime;
            if (this.curTimer <= 0.0)
            {
                if (this.isMoving)
                {                    
                    this.curTimer = this.idleTime;
                    this.moveForward = !this.moveForward;
                }
                else
                {
                    this.curTimer = this.moveTime;
                }
                this.isMoving = !this.isMoving;
            }

            changed = true;
        }

        if (changed)
        {
            this.updateEndPoints();
        }
    }

    updateEndPoints()
    {
        let xDir = Math.cos(this.angle);
        let yDir = Math.sin(this.angle);

        let xCenterCur = this.xCenter + this.xMove*this.curMovePct;
        let yCenterCur = this.yCenter + this.yMove*this.curMovePct;

        this.x1 = xCenterCur - xDir*this.halfLength;
        this.y1 = yCenterCur - yDir*this.halfLength;
        this.x2 = xCenterCur + xDir*this.halfLength;
        this.y2 = yCenterCur + yDir*this.halfLength;
    }

    render()
    {
        aw.ctx.save();
        aw.ctx.lineWidth = 2;
        aw.ctx.strokeStyle = "#F00";
        aw.ctx.shadowColor = "#F00";
        aw.ctx.beginPath();
        aw.ctx.moveTo(this.x1, this.y1);
        aw.ctx.lineTo(this.x2, this.y2);
        aw.ctx.stroke();
        aw.ctx.restore();
    }
}