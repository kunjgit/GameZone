function drawCircle(x,y,r,color,ctx){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r-3, 0, 2 * Math.PI, false);
    ctx.stroke();
}
function drawCircleS(x,y,r,ctx){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.stroke();

}
function drawRect(x,y,width,height,color,ctx){
    ctx.fillStyle = color;
	ctx.fillRect(x,y,width,height);
}
function drawRectS(x,y,width,height,ctx){
    ctx.rect(x, y, width, height);
	ctx.stroke();
}
function drawArc(x,y,r,angle_st,angle_end,ctx){
    ctx.beginPath();
    ctx.arc(x, y, r, angle_st, angle_end, false);
    ctx.stroke();
}
function drawLine(x1,y1,x2,y2,colorL,ctx){
   	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
    //ctx.lineWidth = 10;
	ctx.strokeStyle = colorL;
	ctx.stroke();
}
