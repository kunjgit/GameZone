class InterfaceButtons {
    constructor(arr){
        this.arr = arr;
    }
    pressedLoop(pressedArr){
        for (var i=0;i<this.arr.length;i++){
            if (distance(pressedArr,this.arr[i])<this.arr[i].r && this.arr[i].drawFlag == 1){
                this.arr[i].act();
                return 1;
            }
        }
        return 0;
    }
    drawLoop(){
        for (var i=0;i<this.arr.length;i++){
            if(this.arr[i].drawFlag==1)
                this.arr[i].draw();
        }
    }
}

class ButtonCircle {
    constructor(x,y,r,text,keyTextFunc,action,innerDraw,drawFlag){
        this.x=x;
        this.y=y;
        this.r=r;
        this.keyTextFunc = keyTextFunc;
        this.text=text;
        this.action=action;
        this.innerDraw=innerDraw;
        this.drawFlag = drawFlag;
        this.color = "white";
    }
    draw(){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,2*Math.PI*0.8,2*Math.PI*0.7,false);
        ctx.arc(this.x,this.y,this.r+5,2*Math.PI*0.75,2*Math.PI*0.7,false);
        ctx.stroke();
        this.innerDraw();
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
		ctx.font = '15px monospace';
        ctx.fillText(this.text,this.x-7.5*this.text.length/2,this.y+this.r+20);
        ctx.font = '15px monospace';
        var keyText = this.keyTextFunc();
        ctx.fillText(keyText,this.x+this.r+12,this.y);
        ctx.restore();
    }
    act(){
        this.action();
    }
}

function shoot_btn_draw(){
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x,this.y,10,0,2*Math.PI,true);
    ctx.moveTo(this.x+this.r+5,this.y);
    ctx.lineTo(this.x-this.r-5,this.y);
    ctx.moveTo(this.x,this.y+this.r+5);
    ctx.lineTo(this.x,this.y-this.r-5);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function shoot_btn_funct(){
    shoot_handler();
}
function chg_shoot_mode_draw(){
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x,this.y);
    ctx.moveTo(-10,0);
    ctx.lineTo(15,0);
    if (_spaceship.fire_mode == 0) {
        ctx.moveTo(-10,0);
        ctx.lineTo(Math.sqrt(168),7.5);
        ctx.moveTo(-10,0);
        ctx.lineTo(Math.sqrt(168),-7.5);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
function chg_shoot_mode_funct(){
    firemodeToggle();
}
function fuel_tank_draw(ref,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(ref.x-ref.r/3,ref.y-ref.r/3,ref.r*2/3,ref.r);
    ctx.moveTo(ref.x-ref.r/3,ref.y-ref.r/3);
    ctx.lineTo(ref.x-ref.r/3,ref.y-ref.r/3-5);
    ctx.moveTo(ref.x+ref.r/3,ref.y-ref.r/3);
    ctx.lineTo(ref.x+ref.r/3,ref.y-ref.r/3-5);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}
function fuel_btn_draw(){
    var nextColor;
    if (_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) {
        fuel_tank_draw(this,"red");
        nextColor = "white";
    }
    else {
        fuel_tank_draw(this,"white");
        nextColor = "black";
    }
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.strokeStyle = nextColor;
    ctx.beginPath();
    ctx.moveTo(-3,0);
    ctx.lineTo(3,0);
    ctx.moveTo(0,-3);
    ctx.lineTo(0,3);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}
function fuel_btn_funct(){
    if (_spaceship.pts>=(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) impFuelCapacityToggle();
}
function threelines_draw(ref,color){
    ctx.strokeStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.translate(ref.x,ref.y);
    ctx.moveTo(-10,0);
    ctx.lineTo(15,0);
    ctx.moveTo(-10,0);
    ctx.lineTo(Math.sqrt(168),7.5);
    ctx.moveTo(-10,0);
    ctx.lineTo(Math.sqrt(168),-7.5);
    ctx.moveTo(-3,-12);
    ctx.lineTo(3,-12);
    ctx.moveTo(0,-15);
    ctx.lineTo(0,-9);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
function imp_shoot_draw(){
    if (_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) threelines_draw(this,"red");
    else threelines_draw(this,"white");
}
function imp_shoot_funct(){
    if(_spaceship.pts>=(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) improveShootToggle();
}
function speedometer_draw(ref,color,state){
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.translate(ref.x,ref.y);
    ctx.arc(0,0,13,0,Math.PI,true);
    ctx.moveTo(-13,0);
    ctx.lineTo(-9,0);
    ctx.moveTo(13,0);
    ctx.lineTo(9,0);
    ctx.moveTo(0,-13);
    ctx.lineTo(0,-9);
    ctx.moveTo(9.19,-9.19);
    ctx.lineTo(7.07,-7.07);
    ctx.moveTo(-9.19,-9.19);
    ctx.lineTo(-7.07,-7.07);
    if (state ==0) {
        ctx.moveTo(0,0);
        ctx.lineTo(-8.57,-4.95);
    }
    else if(state==1){
        ctx.moveTo(0,0);
        ctx.lineTo(8.57,-4.95);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
function imp_speed_draw(){
    if (_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) speedometer_draw(this,"red",2);
    else speedometer_draw(this,"white",1);
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x,this.y);
    ctx.moveTo(-2,0);
    ctx.lineTo(2,0);
    ctx.moveTo(0,7);
    ctx.lineTo(0,13);
    ctx.moveTo(-3,10);
    ctx.lineTo(3,10);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
function imp_speed_funct(){
    if (_spaceship.pts>=(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor) improveSpeedToggle();
}
function chg_speed_mode_draw(){
    var currMode = _spaceship.speed_mode;
    if (_spaceship.fuel == 0) {
        speedometer_draw(this,"red",currMode);
        return;
    }
    speedometer_draw(this,"white",currMode);
}
function chg_speed_mode_funct(){
    changeSpeedToggle();
}
function imp_modal_draw(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    var rand = Math.random();
    if (rand>2/3) ctx.shadowBlur = 10;
    ctx.closePath();
    ctx.beginPath();


    ctx.translate(this.x,this.y);
    ctx.fillRect(-this.r/3,-this.r/6,this.r*2/3,this.r*5/6);
    ctx.closePath();
    ctx.beginPath();
    ctx.translate(0,-this.r/2);
    ctx.moveTo(0,-this.r*1/3);
    ctx.rotate(Math.PI*2/3);
    ctx.lineTo(0,-this.r*2/3);
    ctx.rotate(Math.PI*2/3);
    ctx.lineTo(0,-this.r*2/3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function imp_modal_funct(){
    LevelUp();
}
const btn_size = 15;
var b1 = new ButtonCircle(50,110,btn_size,"Shoot",
    ()=>!_spaceship.mobile_flag?"'space'":"",shoot_btn_funct,shoot_btn_draw,1);
var b2 = new ButtonCircle(W-90,110,btn_size,"Shot Mode",
    ()=> !_spaceship.mobile_flag?"'x'":"",chg_shoot_mode_funct,chg_shoot_mode_draw,1);
var b3 = new ButtonCircle(W/2-120,H/2+80,2*btn_size,"Inc. Fuel",
    ()=>_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor?
    "":
    !_spaceship.mobile_flag?"'1'":"",
    fuel_btn_funct,fuel_btn_draw,0);
var b4 = new ButtonCircle(W/2,H/2+80,2*btn_size,"Imp. Spread",
    ()=>_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor?
    "":
    !_spaceship.mobile_flag?"'2'":"",
    imp_shoot_funct,imp_shoot_draw,0);
var b5 = new ButtonCircle(W/2+120,H/2+80,2*btn_size,"Imp. Speed",
    ()=>_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor?
    "":
    !_spaceship.mobile_flag?"'3'":"",
    imp_speed_funct,imp_speed_draw,0);
var b6 = new ButtonCircle(W-90,190,btn_size,"Speed Mode",
    ()=> !_spaceship.mobile_flag?"'UP-DN'":"",chg_speed_mode_funct,chg_speed_mode_draw,1);
var b7 = new ButtonCircle(70,H-100,btn_size*2,"",
    ()=>_spaceship.pts<(_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor?
        "":
        !_spaceship.mobile_flag?"'v'":"",imp_modal_funct,imp_modal_draw,1);

b7.color = "rgba(255, 255, 255, 0.3)";
var btns_arr = [b7,b3,b4,b5,b1,b2,b6];
var Interface_Buttons = new InterfaceButtons(btns_arr);
