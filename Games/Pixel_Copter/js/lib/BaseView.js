(function(root) {

    var BaseView = Class.extend({

    // public properties

    // constructor
    init: function()
    {

    },

    //-------o Drawing  Functions o-------//
    font: function(size){
        context.font = 'bold ' + size+ 'px'
                       + ' "Tahoma", "DejaVu Sans Mono", "Bitstream Vera Sans Mono"';
    },
    strokeCircle: function(x, y, size, line, color){
        this.line(line);
        this.stroke(color);
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    },
    fillCircle: function(x, y, size, color){
        this.line(0.5);
        this.fill(color);
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    },
    fillRect: function(x, y, w, h, color, alpha){
        this.fill(color);
        context.globalAlpha=1;
        if (alpha !== undefined) {
            context.globalAlpha=alpha;
        }

        context.fillRect(x, y, w, h);
    },
    line: function(width){
        context.lineWidth = width;
    },
    alpha: function(value){
        context.globalAlpha = value;
    },
    text: function(x, y, text, align, baseline,color){
        context.fillStyle = color;
        context.textAlign = align;
        context.textBaseline = baseline;
        context.fillText(text, x, y);
    },
    fill: function(color){
        context.fillStyle = color;
    },
    stroke: function(color){
        context.strokeStyle = color;
    },
    local: function(x, y, r, xs, ys){
        context.save();
        context.translate(x, y);
        if (r !== undefined && r !== 0) {
            context.rotate(r);
        }
        if (xs !== undefined && xs !== 1) {
            context.scale(xs, ys);
        }
    },
    unlocal: function(){
        context.restore();
    },
    scale: function(x, y){
        context.scale(x, y);
    },
    strokePolygon: function(col, line, points, scale){
        this.stroke(col);
        this.line(line);
        if (scale !== undefined && scale !== 1) {
            context.scale(scale, scale);
        }

        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for(var i = 1; i < points.length; i++) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();
        context.stroke();
    },
    fillPolygon: function(col, line, points, scale, r, x, y, alpha){
        this.fill(col);
        this.line(line);
        if (scale !== undefined && scale !== 1) {
            context.scale(scale, scale);
        }
        if (r !== undefined && r !== 0) {
            context.rotate(r);
        }
        context.globalAlpha=1;
        if (alpha !== undefined) {
            context.globalAlpha=alpha;
        }
        var xPos = 0;
        if (x !== undefined && x !== 0) {
            xPos=x;
        }
        var yPos = 0;
        if (y !== undefined && y !== 0) {
            yPos=y;
        }

        context.beginPath();
        context.moveTo(xPos+points[0][0], yPos+points[0][1]);
        for(var i = 1; i < points.length; i++) {
            context.lineTo(xPos+points[i][0], yPos+points[i][1]);
        }
        context.closePath();
        context.fill();
    },
    drawImage: function(image, xPos, yPos, width, height){
        context.drawImage(image, xPos, yPos, width, height);
        context.closePath();
    }


});

root.HelicopterGame.BaseView = BaseView;

})(window);