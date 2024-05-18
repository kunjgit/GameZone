export default class Mouse {
  constructor(entities, canvas, ctx) {
    this.entities = entities;
    // Drag Interaction
    this.draggedPoint = null;
    this.down = false;
    this.coord = new Vector();
    this.offset = new Vector();
    this.offsetCoord = new Vector();
    this.canvas = canvas;
    this.ctx = ctx;

    this.canvas.addEventListener('mousedown', (e) => {
      this.down = true;
      if (this.draggedPoint) {
        this.offset.setXY(e.offsetX - this.draggedPoint.pos.x, e.offsetY - this.draggedPoint.pos.y);
        this.offsetCoord = Vector.sub(this.coord, this.offset);
      }
    })
    this.canvas.addEventListener('mouseup', (e) => {
      if (this.draggedPoint) {
        this.draggedPoint.resetVelocity();
      };
      this.down = false;
      this.draggedPoint = null;
    })

    this.canvas.addEventListener('mousemove', (e) => {
      this.coord.setXY(e.offsetX, e.offsetY);
      this.offsetCoord = Vector.sub(this.coord, this.offset);
    })

    // TOUCH
    this.canvas.addEventListener('touchstart', (e) => {
      let offset = e.touches[0];
      this.down = true;
      if (this.draggedPoint) {
        this.offset.setXY(offset.clientX - this.draggedPoint.pos.x, offset.clientY - this.draggedPoint.pos.y);
        this.offsetCoord = Vector.sub(this.coord, this.offset);
      }
    })
    this.canvas.addEventListener('touchend', (e) => {
      if (this.draggedPoint) {
        this.draggedPoint.resetVelocity();
      };
      this.down = false;
      this.draggedPoint = null;
    })
    this.canvas.addEventListener('touchmove', (e) => {
      let offset = e.touches[0];
      this.coord.setXY(offset.pageX, offset.pageY);
      this.offsetCoord = Vector.sub(this.coord, this.offset);
    })
  }

  dragPoint() {
    if (!this.down) return;
    this.draggedPoint.pos.setXY(this.offsetCoord.x, this.offsetCoord.y);
  }

  drag() {
    if (!this.down) {
      this.draggedPoint = this.getNearestPoint();
    }
    if (this.draggedPoint) {
      this.renderDraggedPoint(this.draggedPoint);
      this.dragPoint();
    }
  }
  
  renderDraggedPoint(point) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.arc(point.pos.x, point.pos.y, point.radius * 1.5, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }


  getNearestPoint() {
    // if (!this.down) return false;
    let d = 20;
    let p = null;
    for (let k = 0; k < this.entities.length; k++) {
      for (let i = 0; i < this.entities[k].points.length; i++) {
        let dist = this.entities[k].points[i].pos.dist(this.coord);
        if (dist < d) {
          p = this.entities[k].points[i];
        }
      }
    }
    return p;
  }
}
