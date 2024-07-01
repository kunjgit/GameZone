
class GameObject{
    constructor(x,y,o,w=32,h=32){
      //poisition
      this.pos = new Vector(x,y,w,h)
      this.VectorXY = new Vector(0,0,w,h)
      this.w = w
      this.h = h
      this.p = o
      this.frameTime = 0
      GamePlayObject.push(this)
    }
    render(ms){
        this.draw()
        this.update(ms)
    }
    draw(){}
    update(ms){}
    remove(){
      GamePlayObject.splice(GamePlayObject.indexOf(this),1);
    }
}
class Faller extends GameObject{
  constructor(x,y,w,h){
      super(x,y,1,w,h)
      this.D = 0 // dierction 0 1 2 ,decide the image
      this.frameTime = 1
      this.tw =tw
      this.life = 100
      this.score=0
      // max 0~ 180
      this.rightAni = 0
      this.leftAni =0
      this.rightHandAngle = 90
      this.leftHandAngle = -90
      // -4 ~ 4
      this.toneAni =0
      this.tonePos = 0
      // meter
      this.meter = 0
      this.oldmeter=0
  }
  draw(){
      //hand(this.pos.x-2,this.pos.y-10,5,this.h,-150)
      ctx.save()
      //body(this.pos.x+this.w/2.5,this.pos.y-this.h,10,this.h)
      if(this.frameTime<1){
          ctx.globalCompositeOperation = "xor"
          rect1(ctx,this.pos.x,this.pos.y,this.w,this.h,"#aaa",5,10)
      }
      face(this.pos.x+this.w/2.5,this.pos.y-this.w/4,5,5,this.w-this.w/8,this.leftHandAngle,this.rightHandAngle,this.D,this.tonePos)
      ctx.restore()
  }
  move(ms){
      let move = ms*200
      this.meter += move
      this.leftHandAngle+=this.leftAni?2:-2
      this.rightHandAngle+=this.rightAni?2:-2
      this.tonePos+= this.toneAni?.6:-.6
      this.rightAni=this.rightHandAngle>200?0:this.rightAni
      this.rightAni=this.rightHandAngle<80?1:this.rightAni
      this.leftAni=this.leftHandAngle>-80?0:this.leftAni
      this.leftAni=this.leftHandAngle<-200?1:this.leftAni
      this.toneAni=this.tonePos<-3?1:this.toneAni
      this.toneAni=this.tonePos>3?0:this.toneAni
      this.VectorXY.zero()
      if(this.meter/100>(levelUpMeter[level]||270)){
          this.oldmeter = this.meter
          level++
          INKEYIN&&key1.m?PlaySound(3):0
      }
      // keyboard in or mouse in
      if(key.a||key.A||key.z||key.Z){
          this.VectorXY.substract(new Vector(move,0))
          this.rightHandAngle+=this.rightAni?5:-5
          this.D = -2
      }//left

      if(key.S||key.s||key.X||key.x){
          this.VectorXY.add(new Vector(move,0))
          this.leftHandAngle+=this.leftAni?5:-5
          this.D = 2
      }//right
      this.oldPos = this.pos.clone()
      this.pos.addX(this.VectorXY)
      if(this.pos.x>tw-tw/5.5){
          this.pos = this.oldPos.substract(this.VectorXY)
      }
      if(this.pos.x<tw/8.5){
          this.pos = this.oldPos.substract(this.VectorXY)
      }
  }
  update(ms){
      this.move(ms)
      this.frameTime+=ms
      if(this.frameTime>=1){
          this.score+=ms*.1*level
          this.life+=ms*1.5
          this.life=Min(this.life,100)
      }
      GamePlayObject.forEach(e=>{
          if(e.p>=2){
              if(e.pos.collisionRect(this.pos)&&this.frameTime>1){
                  if(e.p==2){
                      this.life -= 20
                      this.frameTime=0
                      this.hurt()
                  }
              }
          }
      })
      if(this.life<=0){
          this.destory()
      }
  }
  destory(){
      for (var i = 0; i < 30; i++) {
          new Blood(this.pos.x,this.pos.y,RandIntBetween(5,10),shadeColor("#640D14",RandInt(5)))
      }
      PlayerConfig.maxMeter = ToFixed(Max((this.meter/100)|0,parseFloat(PlayerConfig.maxMeter)))
      PlayerConfig.maxScore = Max(this.score,PlayerConfig.maxScore)|0
      localSet("M",PlayerConfig.maxMeter)
      localSet("S",PlayerConfig.maxScore)
      this.remove()
  }
  hurt(){
      for (var i = 0; i < 20; i++) {
          new Blood(this.pos.x,this.pos.y,5,shadeColor("#9A2D26",RandInt(20)))
      }
      INKEYIN&&key1.m?PlaySound(2):0
  }
}
class Blood extends GameObject{
  constructor(x,y,w,c){
      super(x,y,0,w,w)
      this.dx = (Rand(1)<.5?3:-3)*Rand(3)*.8
      this.dy = (Rand(1)<.5?3:-3)*Rand(3)*.8
      this.c = c
  }
  draw(){
      rect1(ctx,this.pos.x,this.pos.y,2,2,this.c,this.pos.w,1)
  }
  update(ms){
      this.frameTime+=ms
      this.frameTime>3||this.pos.w<.3?this.remove():0
      this.dy -= ms*0.9
      this.pos.x -= this.dx
      this.pos.y -= this.dy
      this.pos.w -= .05
      this.pos.w = Max(this.pos.w,1)
  }
}
class Cloud extends GameObject{
  constructor(x,y,f){
      super(x,y,0,0,0)
      this.frames = f
  }
  draw(){
      ctx.drawImage(this.frames,this.pos.x,this.pos.y,this.frames.width,this.frames.height)
  }   
  update(ms){
      this.VectorXY = this.pos.norm(new Vector(this.pos.x,-th))
      this.VectorXY.dot(level)
      this.pos.add(this.VectorXY)
      if(this.pos.less(0,-this.frames.height)){
          this.destory()
      }
  }
  destory(){
      let cl = cloudDrawImage[RandInt(2)]
      new Cloud(this.pos.x,th+Rand(300),cl[RandInt(cl.length)])
      this.remove()
  }
}
class Item extends GameObject{
  constructor(x,y,w,h,f,type){
      super(x,y,type,w,h)
      this.initialX = this.pos.x
      //animation
      this.frameArray = f
      this.curFrame = f[0]
      this.frameTime = 0
      this.th = th
  }
  draw(){
      //rect1(ctx,this.pos.x,this.pos.y,1,1,"#35fa12",this.w,1)
      ctx.drawImage(this.curFrame,this.pos.x,this.pos.y,this.pos.w,this.pos.h)
  }
  update(ms){
      let l = this.frameArray.length
      this.frameTime ++
      this.curFrame = this.frameArray[(this.frameTime%l)|0]
      let gap = 1
      let targetX  = this.initialX+gap
      let targetPosX = this.pos.x>=tw/2?Min(tw-tw/7,this.initialX)-this.w:Max(tw/4,targetX)
      this.VectorXY = this.pos.norm(new Vector(targetPosX,-this.th))
      this.VectorXY.dot(level)
      this.pos.add(this.VectorXY)
      this.pos.w -= (this.pos.maxWidth)/Distance(0,this.th*2)*Abs(this.VectorXY.y)
      this.pos.w = Max(this.pos.w,this.pos.maxWidth/2)
      if(this.pos.less(0,-this.pos.h)){
          this.destory()
      }
      this.frameTime = this.frameTime>l*2?0:this.frameTime
  }
  destory(){
      //new Item(this.initialX,this.th,this.w,this.h,this.frameArray,this.p)
      this.remove()
  }
}
class BuildingWall{
  constructor(x,y,w,h,c="#5F6256"){
      this.pos = new Vector(x,y,w,h)
      this.VectorXY=this.pos.clone()
      this.initialX = x
      this.initialY = canvasHeight/2
      this.f = CreateWall(c)
      this.th = th
      this.frameTime = 0
      this.meter = 0
      this.colorCount = 0
      BackgroundMoveObject.push(this)
  }
  render(ms){
      this.draw()
      this.update(ms)
  }
  draw(){
      ctx.drawImage(this.f,this.pos.x,this.pos.y,this.pos.w,this.pos.h)
  }
  update(ms){
      this.VectorXY = this.pos.norm(new Vector(this.pos.x,-this.th,1,1))
      let move = ms*200
      this.meter += move
      //this.VectorXY.dot(Min(PlayerConfig.speed,PlayerConfig.maxSpeed))
      this.VectorXY.dot(wallSpeed[level]||32)
      PlayerConfig.speed = this.VectorXY.y
      
      if(this.pos.less(0,-this.pos.h)){
          this.loop()
      }
      this.pos.add(this.VectorXY)
  }
  loop(){
      this.pos.set({x:this.initialX,y:this.th})
  }
}

// initial game config
let PlayerConfig={
    speed:1,
    maxSpeed:32,
    targetPos:new Vector(tw/2,-th,2,2),
    score:0,
    meter:0,
    life:100,
    maxScore:0,
    maxMeter:0
}
let player = null

GameUIView=ms=>{
  ctx.save()
  ctx.beginPath()
  let ci =1,firstLineY=20,secondLineY=80,sizeW=100
  for(var k in keyStopRestartMute){
      ctx.globalAlpha = Max(1-key1[keyStopRestartMute[k]],.5)
      let x = tw-20*ci-5,y=firstLineY,h=12,w=18
      resizeWindow?0:checkButton.push({x,y:y-10,w,h})
      ctx.fillText(ci-1?ci-2?"⏯️":"🎧":"🏠",x,y)
      ci++
  }
  ctx.restore()
  resizeWindow=1
  ctx.save()
  ctx.beginPath()
  ctx.fillStyle="#fff"
  ctx.font="30px Impact"
  let score = Pad(IntToString(Min(player.score|0,9999)))

  TextField(score,tw-firstLineY*3.5,secondLineY-firstLineY,30)
  TextField("Meter",10,firstLineY+5,15)
  TextField(ToFixed(player.meter/100)+"  /m",15,firstLineY*2,12)
  TextField("G-Speed",10,firstLineY*3,15)
  TextField(ToFixed(level+Rand(ms))+"  /g",15,firstLineY*4,12)
  ScaleLine(20,th/2,10,cur1color,sizeW)
  Bar(tw-firstLineY,secondLineY,40,player.life|0,sizeW,"🧡")
  //bar(tw-firstLineY,secondLineY,40,sizeW,sizeW,"🥶")
  miniMapY = sizeW/levelUpMeter[level] * (player.meter-player.oldmeter)/sizeW*level
  rect1(ctx,25,th/2+miniMapY,2,2,reachColor[cur2color],2,1)
  if(miniMapY>=sizeW-13){
      cur2color=cur1color
      cur1color++
      cur1color=cur1color>=reachColor.length?0:cur1color
  }
  ctx.restore()
}
ItemGenerator=l=>{
  // level linear up
  // bad item appear 
  let badIt = [1,2,3,4,5,6]
  let randAppearNum = Min(RandInt(l),5)
  let randAppearChance=AppearArry()
  let maxRandBadImageLength = Min(badIt.length,l)
  // level 3 6 9
  if(!(level%3)&&level){
  // if(1){
      let curX = 0
      let appearLength = AppearDist(randAppearChance)
      WallResize(appearLength).forEach((e,i)=>{
          if(appearLength[i]!="0"){
              new Item(curX,th+32,e,32,BadItemImage[1],2)
          }else{
              curX+=tw/6
          }
          curX+=e
      })
  }else{
  // level 1 2 4 5 7 8
      randAppearChance.forEach((e,i)=>{
          if(e&&e<=randAppearNum){
              let item = RandInt(maxRandBadImageLength)
              new Item(i*tw/6,th+32,48,48,BadItemImage[item],2)
          }
      })
  }
}
GameWorldInit=a=>{
  BackgroundMoveObject=[]
  BuildingWallInitial()
  BadItemImage = [iron_ball_shake,long_wall,iron_ball_rotate,fix_arrow,ciclre,fansa,adsf]
  GamePlayObject=GamePlayObject.filter(e=>e instanceof Cloud)
  PlayerConfig.maxScore = StringToFloat(localGet("S"))|| 0
  PlayerConfig.maxMeter = StringToFloat(localGet("M"))|| 0
  //INKEYIN&&key1.m?CanPlaysong("song1"):0
}
NewGame=_=>{
  GamePlayObject = []
  CloudCreate(RandInt(3))
  player = new Faller(tw/2,th/8,tw/16,th/16,10)
  returnButton=null
  startButton=null
  level = 1
  key1.p=0
  key1.m=1
  removetutorialTimes=0
  CanPlaysong("song1")
}
// speed max 32 
let lastUpdate = timer.now(),distanceY=soundStop=0,changeSong= 1
Update=()=>{
  const now = timer.now();
  const deltaMs = now - lastUpdate;
  const delta = deltaMs / 1000;
  lastUpdate = now;
  BackgroundView()
  if(!key1.m&&SoundNode){
      StopSong()
      soundStop=1
  }else{
      if(soundStop){
          PlaySong(level<8?"song1":"song2")
          soundStop=0
      }
      if(level>=10&&changeSong){
          StopSong()
          PlaySong(level<10?"song1":"song2")
          changeSong=0
      }
  }
  
  // if playing >
  if(key1.r){
      Start(delta)
      //End(delta)
  }else{
      if(!key1.p){
          ctx.save()
          
          ctx.strokeStyle="#FF1"
          ctx.fillStyle="#555"
          ctx.beginPath()
          ctx.moveTo(tw/8,0)
          ctx.lineTo(0,th)
          ctx.lineTo(tw,th)
          ctx.lineTo(tw-tw/8,0)
          ctx.fill()
          ctx.clip()
          BackgroundMoveObject.forEach(e=>{
              e.render(delta)
          })
          ctx.restore()
          GamePlayObject.forEach(e=>{
              if(e.pos.y<=th){
                  e.render(delta)
              }else{
                  e.update(delta)
              }
          })
          distanceY+=level
          if(distanceY>=128+level*20){
          ItemGenerator(level)
          distanceY=0
          }
          if(player.life<=0){
              End(delta)
          }
          if(removetutorialTimes<=5){
              Tutorial(delta)
          }else{
              removetutorialTimes=6
          }
          GameUIView(delta)
      }else{
          Pause()
          GameUIView(0)
      }
  }
}
MainLoop=_=>{
  ctx.clearRect(0,0,canvasWidth,canvasHeight)
  ctx.save()
  ctx.scale(2,2)
  tw = canvasWidth/2
  th = canvasHeight/2
  Update()
  ctx.restore()
  requestAnimationFrame(MainLoop)
}
GameWorldInit(0)
MainLoop(0)