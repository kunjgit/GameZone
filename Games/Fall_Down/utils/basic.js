const windows = window
const documents = document
const math=Math
const PI = math.PI
const timer = performance
const l = windows.localStorage

Rand=a=>math.random()*a
RandInt=a=>Rand(a)|0;
RandIntBetween=(a,b)=>a+RandInt(b-a+1);
Abs=a=>math.abs(a)
Distance=(a,b)=>math.hypot(a,b);
CollisionRect=(a,b)=>(a.x+a.w>b.x&&b.x+b.w>a.x&&a.y+a.h>b.y&&b.y+b.h>a.y)?1:0
Max=(a,b)=>a>b?a:b;
Min =(a,b)=>(a<b)?a:b;
IntToString=a=>a.toString()
Pad=a=>a.padStart(4,"0");
ToFixed=a=>a.toFixed(2)
StringToFloat=a=>parseFloat(a)
SlopeY=(a,b,k=-20)=>a*k+b
localSet=(e,a)=>l.setItem(e,a)
localGet=e=>l.getItem(e)

// mini same function
GetCanvas=a=>documents.getElementById(a)
GetContextAlpha=a=>a.getContext('2d',{
    alpha: false,
    desynchronized: true
})
GetContext=a=>a.getContext('2d')
CreateElement=a=>documents.createElement('canvas')
CanvasToImage=a=>{
    var imagea = new Image();
    imagea.src = a.toDataURL();
    return imagea;
}
// UI frame size
let innerWidth,canvasWidth,canvasHeight,mouseCanvas,resizeWindow,tw,th;
//test speed 
let count =1
let canvas = GetCanvas('a')
let ctx = GetContextAlpha(canvas)
let GamePlayObject = [],BackgroundMoveObject=[]
let BadItemImage  = []
//Wall move speed >>
let wallSpeed = [4,4,4,4,4,4,4,4,8,8,8,8,8,8,16,16,16,16,32]
// change level up 
let levelUpMeter = wallSpeed.map((e,i)=>5+20*i)
// level
let level= 1
let SunToMoon = RandInt(3)

// inputs controls
let key= {},key1={},checkButton=[],startButton,returnButton,INKEYIN=0
let keyStopRestartMute=['r','m','p']
// initial key dict
keyStopRestartMute.forEach(e=>key1[e]=0)

InitailLoopDict=(k,initialValue)=>{
    for (const i in k)k[i]=initialValue
    return k
}
key1.r=1

onblur=e=>{
    key1.p=1
    key1.m=0
}
onfocus=e=>key1.p=0

onmousedown=e=>{
    // let as = e.button==0?e.type=="mouseup"?"b":"a":"c"
    if(!INKEYIN){
        zzfxX = new(window.AudioContext||webkitAudioContext);
        Music()
        INKEYIN=1
    }
    if(!e.button){
        e.pageX>innerWidth/2?key.s=1:key.a=1
        let x= e.clientX - mouseCanvas.left
        let y = e.clientY - mouseCanvas.top
        let h=w=1
        checkButton.forEach((e,i)=>{
            if(CollisionRect(e,{x:x/2,y:y/2,w,h})){
                key1[keyStopRestartMute[i]]=!key1[keyStopRestartMute[i]]
            }
        })
        if(!!startButton){
            if(CollisionRect(startButton,{x:x/2,y:y/2,w,h})){
                NewGame()
                key1.r=0
            }
        }
        if(!!returnButton){
            if(CollisionRect(returnButton,{x:x/2,y:y/2,w,h})){
                NewGame()
                key1.r=1
            }
        }
    }
}
onmouseup=e=>{
    !e.button?key=InitailLoopDict(key,0):0
    if(INKEYIN&&key1.m)PlaySound(1);
}
ontouchstart=e=>{
    
    var x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY;
    let h=w=1
    if(x>innerWidth/2){
        key.s=1
    }else{
        key.a=1
    }
    checkButton.forEach((e,i)=>{
        if(CollisionRect(e,{x:x/2,y:y/2,w,h})){
            key1[keyStopRestartMute[i]]=!key1[keyStopRestartMute[i]]
        }
    })
    if(!!startButton){
        if(CollisionRect(startButton,{x:x/2,y:y/2,w,h})){
            if(!INKEYIN){
                zzfxX = new(window.AudioContext||webkitAudioContext);
                Music()
                INKEYIN=1
            }
            NewGame()
            key1.r=0
        }
    }
    if(!!returnButton){
        if(CollisionRect(returnButton,{x:x/2,y:y/2,w,h})){
            NewGame()
            key1.r=1
         }
    }
}

ontouchend=e=>{
    if(INKEYIN&&key1.m)PlaySound(1);
    key=InitailLoopDict(key,0);
}

// p:pause , R:restart , M:mute sound
onkeydown=e=>{
    if(!INKEYIN){
        zzfxX = new(window.AudioContext||webkitAudioContext);
        Music()
        INKEYIN=1
    }
    let i = e.key
    if(i=='r'){NewGame();}
    if(keyStopRestartMute.includes(i))key1[i]=!key1[i]
    else key[i]=1;
}
onkeyup=e=>{
    let i = e.key
    if(i=='a'||i=="s"||i=="z"||i=='x'){
        if(INKEYIN&&key1.m)PlaySound(1);
    }
    key[e.key]=0
}

// Canvas resizing
const resize = () => {
    const unit = 32,iw=windows.innerWidth,ih=windows.innerHeight;
    const size = Min((Min(iw, ih) / unit)|0, 24);
    tw = canvasWidth=canvas.width = size * unit;
    th = canvasHeight=canvas.height = size * unit + size*4;
    ctx.imageSmoothingEnabled = false;
    tw = canvasWidth/2
    th = canvasHeight/2
    innerWidth=iw
    mouseCanvas = canvas.getBoundingClientRect();
    checkButton=[]
    resizeWindow=0
};
onresize=e=>resize()
resize()