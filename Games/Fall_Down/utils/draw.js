// Colour adjustment function
// Nicked from http://stackoverflow.com/questions/5560248

shadeColor=(color, percent)=>{
    color = color.substr(1);
    var num = parseInt(color, 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
rect1=(ctx,x,y,w,h,c="red",r=5,a=0)=>{
    ctx.save()
    ctx.fillStyle=c
    ctx.strokeStyle=c
    ctx.beginPath()
    //ctx.miterLimit=30
    ctx.lineWidth=2
    ctx.moveTo(x, y)
    ctx.lineTo(x+w, y)
    ctx.arcTo(x+w+r, y, x+w+r, y+r, r)
    ctx.lineTo(x+w+r,y+h+r)
    ctx.arcTo(x+w+r,y+h+r+r,x+w,y+h+r+r,r)
    ctx.lineTo(x,y+h+r+r)
    ctx.arcTo(x-r,y+h+r+r,x-r,y+h+r,r)
    ctx.lineTo(x-r,y+r)
    ctx.arcTo(x-r,y,x,y,r)
    a?ctx.fill():ctx.stroke()
    ctx.closePath()
    ctx.restore()
}
// Game darw  Wall
CreateWall=color=>{
    var fontCanvas = CreateElement()
    var fontCtx = GetContext(fontCanvas),ww,hh
    ww=hh=fontCanvas.width=fontCanvas.height=32
    fontCtx.scale(2,2);
    fontCtx.fillStyle=shadeColor(color,-10);
    fontCtx.fillRect(0,0,ww,hh);
    ww = ww/6,hh=hh/6
    let x=y=c=0,gap=0
    for(var i=0;i<9;i++){
        fontCtx.fillStyle=shadeColor(color,RandInt(3))
        let appendWidth= RandInt(ww/2)
        fontCtx.fillRect(x+gap,y,ww+appendWidth,hh)
        //fontCtx.strokeRect(x+oldWidth,y,ww+tt,hh)
        gap=appendWidth
        if(c==2){
            y+=hh
            x=c=0
        }else{
            x+=ww
            c++
        }
    }
    return CanvasToImage(fontCanvas)
}
CreateItem=(stroke,color,type,angle=0)=>{
    var fontCanvas = CreateElement()
    var fontCtx = GetContext(fontCanvas)
    fontCanvas.width=fontCanvas.height=64
    let halfh = 32
    fontCtx.translate(halfh,halfh);
    fontCtx.rotate(PI*angle);
    fontCtx.translate(-halfh,-halfh);
    rect1(fontCtx,type.x,type.y,type.w,type.h,color,type.r,stroke)
    fontCtx.setTransform(1, 0, 0, 1, 0, 0);
    return CanvasToImage(fontCanvas)
}
CreateItemDraw=(a,frames)=>{
    //     [1,"#00000",[64,32,-64,-64,30],[.5,,,1],.1]
    let framesArray = []
    for(var i=0;i<frames;i++){
        framesArray.push(CreateItem(a[0],shadeColor(a[1],1),{
            x:a[2][0]+i*a[3][0],
            y:a[2][1]+i*a[3][1],
            w:a[2][2]+i*a[3][2],
            h:a[2][3]+i*a[3][3],
            r:a[2][4]+i*a[3][4]},i*a[4]))
    }
    return framesArray
}

CreateCloud=(size,fc)=>{
    var fontCanvas = CreateElement()
    var fontCtx = GetContext(fontCanvas)
    fontCtx.height = 50
    fontCtx.width = size*18+20
    fontCtx.beginPath();
    fontCtx.moveTo(20, 20);
    fontCtx.fillStyle = fc
    for(var i=1;i<size;i++){
        fontCtx.quadraticCurveTo(20+i*10, 10, 20+i*20, 20);
        //ctx.quadraticCurveTo(20+i*10, 50, 20+i*20, 50);
    }
    fontCtx.quadraticCurveTo(20+i*20, 45, 20+(i-1)*18, 40);
    fontCtx.moveTo(20,20)
    fontCtx.quadraticCurveTo(10, 30, 30, 40);
    for(var i=1;i<size;i++){
        fontCtx.quadraticCurveTo(20+i*10, 40+10, 20+i*18, 40);
        //ctx.quadraticCurveTo(20+i*10, 50, 20+i*20, 50);
    }
    fontCtx.fill()
    fontCtx.stroke();
    return CanvasToImage(fontCanvas)
}

cloudDrawImageFrame=_=>{
    let temp = {},i,j,a=["#fff","#58B","#BBC"]
    for(j=0;j<3;j++){
        temp[j]=[]
        for(i=3;i<6;i++){
            temp[j].push(CreateCloud(i,a[j]))
        }
    }
    return temp
}
let cloudDrawImage = cloudDrawImageFrame()
hand=(x,y,w,h,c=0,a=90,lega=250)=>{
    ctx.save()
    ctx.translate(x, y);
	ctx.rotate(PI/360*a);
	ctx.translate(-x, -y);
	rect1(ctx,x+2,y+c*2+h*2,1,1,"black",c/5)
    ctx.fillStyle="#0fa"
    ctx.fill()
    rect1(ctx,x,y,w,h+c*2,"black",c/8)
    ctx.fillStyle="#fff"
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.translate(x, y);
	ctx.rotate(PI/360*lega);
	ctx.translate(-x, -y);
    rect1(ctx,x,y,w+h,h+c*2,"black",c/8)
    ctx.fillStyle="#fff"
    ctx.fill()
    rect1(ctx,x,y+c*2+h*2,w+h,h,"black",c/8)
    ctx.fillStyle="#0ff"
    ctx.fill()
    ctx.restore()
}
face=(x,y,w,h,c,a1=230,a2=-20,eyepos=0,tonepos=0)=>{
    hand(x,y,w,h/4,c,a1,430+a1/10)
    hand(x,y,w,h/4,c,a2,330+a2/10)
    ctx.save()
	ctx.fillStyle="#fff"
    rect1(ctx,x,y-c*1.5,w,h+c/1.5,"black",c-c/4)
    rect1(ctx,x,y-c*1.5,w,h+c/1.5,"white",c-c/4,1)
	rect1(ctx,x,y,w,h,"black",c)
    rect1(ctx,x,y,w,h,"white",c,1)
    // eyepos -2~2
    // tonepos -4 ~ 4
    eye(x,y,w,h,c,eyepos,tonepos)
    ctx.restore()
}
eye=(x,y,w,h,c,gapx,gapMounth)=>{
    ctx.save()
	rect1(ctx,x-c/3,y+c*1.5,2,2,"#111",c/4)
    rect1(ctx,x-c/3+gapx,y+c*1.7,2,2,"#111",c/8,1)
    rect1(ctx,x+c/2,y+c*1.5,2,2,"#111",c/4)
    rect1(ctx,x+c/2+gapx,y+c*1.7,2,2,"#111",c/8,1)
    
    ctx.beginPath()
    ctx.moveTo(x-c/4, y+c/4);
    ctx.quadraticCurveTo(x-c/4*gapMounth,y+c,x-c/4+w+c/2,y+c/4);
    ctx.stroke()
    ctx.fillStyle="#DD404B"
    ctx.fill()
    ctx.closePath()
    rect1(ctx,x-c/4,y+c/4,w+c/2,h+c/4,"#111",1)
    ctx.restore()
}
//background view 1 ~ 2
background=_=>{
    var fontCanvas = CreateElement()
    var fontCtx = GetContext(fontCanvas)
    fontCanvas.width=tw
    fontCanvas.height=th
    var radialGradient = fontCtx.createRadialGradient(tw,0, 40, tw, 0, th/10);
    radialGradient.addColorStop(.3, '#FFE261');
    radialGradient.addColorStop(.7, '#F3CD05');
    radialGradient.addColorStop(.8, '#F49F05');
    radialGradient.addColorStop(1, '#FFF8C8');
    fontCtx.beginPath()
    fontCtx.fillStyle = radialGradient;
    fontCtx.fillRect(0, 0, tw, th);
    //fontCtx.globalCompositeOperation = "screen"
    //GameObjectTest=[]
    for(var i=0;i<tw;i+=40){
        let height = RandIntBetween(th/4,th-th/8)
        let color = shadeColor("#36688D",RandIntBetween(-20,20))
        rect1(fontCtx,RandIntBetween(0,tw),th-height,RandInt(64),height,color,8,1)
    }
    return CanvasToImage(fontCanvas)
}
let back = background()
//building 
BackgroundView=_=>{
    ctx.drawImage(back,0,0,tw,th)
}
BuildingWallInitial=_=>{
    
    for(let j =0;j<th/28;j++){
        for (let i = 0; i < tw/32; i++) {
            new BuildingWall(32*i,32*j,32,32)
        }
    }
    CloudCreate(0)
}
CloudCreate=bc=>{
    let cl = cloudDrawImage[SunToMoon]
    for(let i=0;i<10;i++){
        let a = i%2?RandIntBetween(tw-tw/8,tw):RandIntBetween(0,tw/18)-Rand(10)
        new Cloud(a,th+Rand(300),cl[RandInt(cl.length)])
    }
}
// UI Bar textfield
TextField=(str,x,y,size,color="#fff",type=1)=>{
    ctx.save()
    ctx.fillStyle=color
    ctx.font=size+"px Impact"
    ctx.fillText(str,x,y)
    type?ctx.strokeText(str,x,y):0
    ctx.restore()
}
Bar=(x,y,h,live,ml,str)=>{
    ctx.save()
	let cy = h/ml*live,ty=y
    rect1(ctx,x,y+=(h-cy),5,cy,"#1fc",5,1)
    rect1(ctx,x,ty,5,h,"#000")
 	for(var i=0;i<live;i+=25){
    	rect1(ctx,x,ty+(h-h/ml*i),8,1,"#a11",1,1)
    }
    ctx.fillStyle="#0F0"
    ctx.font="20px Impact"
    ctx.fillText(str,x-11,ty+h+10*2)
    ctx.restore()
}
let miniMapY,reachColor = ["#b88","#8b8","#88b","#FFE8D6","#DDBEA9","#5F6256","#7C6354","#F9FBB2","#B5179E"],cur1color=1,cur2color=0
ScaleLine=(x,y,gh,colors,h=200)=>{
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 3
    for(var i=0,c=0;i<=h;i+=gh*2,c++){
        ctx.strokeStyle="#fff"
        if(c==5)rect1(ctx,x-gh/2,y+i,gh,gh,reachColor[colors],5,1)
        else rect1(ctx,x+gh/2,y+i,-gh,gh)
        ctx.stroke()
    }
    ctx.restore()
}
let itemColor = "#25315D"
let iron_ball_shake = CreateItemDraw([1,itemColor,[64,32,-64,-64,30],[0,0,0,0,0],.5],20)
let long_wall = CreateItemDraw([1,itemColor,[16,16,32,-38,16],[0,0,0,0,0],0],1)
let iron_ball_rotate = CreateItemDraw([0,itemColor,[64,32,-64,-64,30],[0,0,0,0,0],.5],20)
let fix_arrow = CreateItemDraw([1,itemColor,[64,32,-64,-64,32],[0,-1,0,0,1],0],30)
let ciclre = CreateItemDraw([1,itemColor,[64,32,-64,-64,32],[0,-1,0,0,1],.1],30)
let fansa = CreateItemDraw([1,itemColor,[64,0,-64,-64,64],[0,0,0,0,0],.1],10)
let adsf = CreateItemDraw([0,itemColor,[64,32,-64,-32,32],[0,-1,0,-1,-.1],.1],30)
BadItemImage = [iron_ball_shake,long_wall,fansa,fix_arrow,ciclre,iron_ball_rotate,adsf]

AppearArry = _=>{
    // -----------------|
    let randomnumbers = new Set, ans;
    while (randomnumbers.size < 6) {    
        randomnumbers.add(RandInt(6));
    }
    return ans = [...randomnumbers]
}
AppearDist=a=>a.join("").replace("0","#0#").split("#").filter(e=>e)
WallResize=a=>a.map((e)=>e!="0"?e.length*tw/8:tw/6)
Pause=a=>{
    ctx.save()
    ctx.fillStyle="rgba(10,10,10,.5)"
    ctx.fillRect(0,0,tw,th)
    TextField("-- PAUSE --",tw/2-tw/4,th/2+th/15,tw/15+th/15)
    ctx.restore()
}
let lightx=scaleOut=0
Start=a=>{
    ctx.save()
    TextField("- FALL　      -",tw/2-tw/4,th/5,tw/15+th/15)
    TextField("-  DOWN　-",tw/2-tw/4,th/3,tw/15+th/15)
    TextField("Score:"+Pad(IntToString(PlayerConfig.maxScore)),tw/2-tw/8,th/2+th/6,tw/15,"#b88")
    TextField("Meter:"+Pad(IntToString(PlayerConfig.maxMeter)),tw/2-tw/8,th/2+th/4,tw/15,"#8b8")
    TextField("Touch Me",tw/2-tw/7.5,th-th/10,tw/15,shadeColor("#aaaaaa",lightx))
    rect1(ctx,tw/2-tw/4,th-th/5,tw/2,th/8,shadeColor("#aaaaaa",lightx))
    startButton = {x:tw/2-tw/4,y:th-th/5,w:tw/2,h:th/8}
    lightx+=1
    lightx = lightx>40?0:lightx
    GamePlayObject.forEach(e=>{if(e instanceof Cloud){e.render()}})
    ctx.restore()
}
End=a=>{
    ctx.save()
    ctx.fillStyle="rgba(10,10,10,.5)"
    ctx.fillRect(0,0,tw,th)
    rect1(ctx,tw/2-tw/4,th/4,tw/2,th/2,shadeColor("#555555",1),5,1)
    rect1(ctx,tw/2-tw/4,th/4,tw/2,th/2,shadeColor("#aaaaaa",lightx))
    rect1(ctx,tw/2-tw/4,th/4+th/9,tw/2,1,shadeColor("#F7DD72",lightx))
    TextField("Best",tw/2-tw/12,th/4+th/10,tw/10,"#F7DD72")
    TextField("Score : "+Pad(IntToString(PlayerConfig.maxScore)),tw/4+tw/10,th/4+th/5,tw/16,"#b88")
    TextField("Meter : "+Pad(IntToString(PlayerConfig.maxMeter)),tw/4+tw/10,th/2,tw/16,"#8b8")
    //TextField("Score:"+Pad(IntToString(PlayerConfig.score)),tw/2-tw/8,th/2+th/6,tw/15,"#b88")
    //TextField("Meter:"+Pad(IntToString(PlayerConfig.maxMeter)),tw/2-tw/8,th/2+th/4,tw/15,"#8b8")
    rect1(ctx,tw/2-tw/9,th/2+th/32,tw/4,th/5,shadeColor("#F7DD72",lightx),5,1)
    returnButton={x:tw/2-tw/9,y:th/2+th/32,w:tw/4,h:th/5}
    TextField("AGAIN",tw/2-tw/9.5,th/2+th/5.5,tw/10,shadeColor("#8888bb",lightx))
    lightx+=1
    lightx = lightx>40?0:lightx
    ctx.restore()
}
let tutorialTimes=removetutorialTimes=0
Tutorial=ms=>{
    ctx.save()
    let w = tw
    let h = th
    let color = "#eeeeee"
    // give an shadow frame
    ctx.globalAlpha=0.5
    ctx.fillStyle='#333'
    ctx.fillRect(0,0,w,h)
    ctx.beginPath();
    ctx.strokeStyle=shadeColor(color,tutorialTimes)
    ctx.setLineDash([9]);
    ctx.lineWidth=5
    ctx.strokeRect(w/2+w/3.5,5,w/5,h/16)
    ctx.moveTo(w/2,0)
    ctx.lineTo(w/2,h*ms*tutorialTimes)
    tutorialTimes+=2
    removetutorialTimes+=ms
    tutorialTimes= math.min(h,tutorialTimes)
    ctx.globalAlpha=tutorialTimes/h
    ctx.stroke()
    ctx.fillStyle=shadeColor(color,tutorialTimes)
    ctx.font=w/20+"px sans-serif"
    ctx.fillText("Move Left",w/8,h-5)
    ctx.fillText("Move Right",w/8+w/2,h-5)
    let x = w/4+w/2,y=h/2+h/4
    ctx.moveTo(x,y)
    ctx.bezierCurveTo(x+100, y+100, x-100, y, x,h-w/20);
    x=w/4
    ctx.moveTo(x,y)
    ctx.bezierCurveTo(x+100, y+100, x-100, y, x,h-w/20);
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
}