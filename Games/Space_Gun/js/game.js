
_STARS_NUM = 600;
_METEORS_NUM = 15;
const _stars = stars(_STARS_NUM);
m = meteors(_METEORS_NUM);
const _spaceship = new Spaceship(15,0);
const _steering = Math.PI/100;
_shots = [];
_electrics = [];
colls = [];

hits_counter = 0;
shots_counter = 0;

document.addEventListener('keydown', (event)=>{
	onkeydown(event);
	});
map = {};
shot_timeout = 0;
help_timeout = 0;
firemode_timeout = 0;
speed_timeout = 0;
fuel_refill_timeout = 0;
upgrade_timeout = 0;
upgrade_request = 0;


document.addEventListener('touchstart', function(e) {
	var pressLoc = {'x':e.touches[0].pageX, 'y':e.touches[0].pageY};
	var pressed = Interface_Buttons.pressedLoop(pressLoc);
	if (pressed == 1) return;
  	var theta =  Math.atan(((e.touches[0].pageY-H/2) / (e.touches[0].pageX-W/2)))/Math.PI+1;
	if (e.touches[0].pageX>W/2 && e.touches[0].pageY > H/2)
  	_spaceship.d = theta -1;
	else if (e.touches[0].pageX>W/2 && e.touches[0].pageY < H/2)
 	 _spaceship.d = theta + 1;
	else 	_spaceship.d = theta;

}, false);

function shoot_handler(){
	if (_spaceship.life_state == 1) {
		_spaceship.reset(_spaceship.mobile_flag);
		hide_selected_btns();
		Spaceship_Fuel_Capacity = 100;
		Spaceship_Acc_Factor = 2;			
		return;
	}
	let ex= W/2 + 900 * Math.cos(_spaceship.d *Math.PI);
	let ey= H/2 + 900 * Math.sin(_spaceship.d *Math.PI);
	if (_spaceship.fire_mode == 0 && _spaceship.shotI_bank>0) {
	_shots.push(new ShotI(ex,ey,_spaceship.d));
	shots_counter += 1;
	for (var i=1;i<=_spaceship.spread_amount/2;i++) {
		ex= W/2 + 900 * Math.cos((_spaceship.d+0.01*i) *Math.PI);
		ey= H/2 + 900 * Math.sin((_spaceship.d+0.01*i) *Math.PI);
		_shots.push(new ShotI(ex,ey,_spaceship.d));
		ex= W/2 + 900 * Math.cos((_spaceship.d-0.01*i) *Math.PI);
		ey= H/2 + 900 * Math.sin((_spaceship.d-0.01*i) *Math.PI);
		_shots.push(new ShotI(ex,ey,_spaceship.d));
		shots_counter += 2;
		}
	_spaceship.shotI_bank -= 1;
	}
	else if(_spaceship.fire_mode == 1){
		ex= W/2 + _spaceship.shotII_range * Math.cos(_spaceship.d *Math.PI);
		ey= H/2 + _spaceship.shotII_range * Math.sin(_spaceship.d *Math.PI);
		_electrics.push(new ShotII(ex,ey,_spaceship.d));
		_spaceship.shotII_range = 50;
		shots_counter += 1;

	}
}
function increaseUpgradeLvl(){
	_spaceship.upgrade_lvl+=1;
}
function helpToggle(){
	_spaceship.help_flag += 1;
	_spaceship.help_flag %= 2;
}
function firemodeToggle(){
	_spaceship.fire_mode += 1;
	_spaceship.fire_mode %= 2;
}
function refillToggle(){
	_spaceship.fuel = _spaceship.fuel_capacty;
	_spaceship.pts -= 500;
	zzfx(...[2.14,,32,.08,.4,.3,,1.94,,,4,.07,.15,,,.1,.12,.52,.02]);
}
function impFuelCapacityToggle(){
	_spaceship.fuel_capacty += 50;
	_spaceship.fuel = _spaceship.fuel_capacty;
	_spaceship.pts -= (_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor;
	increaseUpgradeLvl();
	hide_selected_btns();
}
function improveShootToggle(){
	_spaceship.spread_amount += 2;
	_spaceship.pts -= (_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor;
	increaseUpgradeLvl();
	hide_selected_btns();
	zzfx(...[2.14,,32,.08,.4,.3,,1.94,,,4,.07,.15,,,.1,.12,.52,.02]);
}
function improveSpeedToggle(){
	_spaceship.speed_lower_limit += 1.5;
	_spaceship.pts -= (_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor;
	increaseUpgradeLvl();
	_spaceship.speed_mode = 0;
	_spaceship.speed = _spaceship.speed_lower_limit;
	hide_selected_btns();
	zzfx(...[2.14,,32,.08,.4,.3,,1.94,,,4,.07,.15,,,.1,.12,.52,.02]);
}
function changeSpeedToggle(){
	var curr = _spaceship.speed_mode;
	var next = (curr+1)%2;
	_spaceship.speed_mode = next;

	if (next == 0) {
		_spaceship.speed_mode = 0;
		_spaceship.speed = _spaceship.speed_lower_limit;
		_spaceship.fuel_penalty = 0;
	}
	else if(_spaceship.fuel<=0) {
		_spaceship.speed_mode = 0;
		_spaceship.speed = _spaceship.speed_lower_limit;
		_spaceship.fuel_penalty = 0;
		return;
	}
	else{
		_spaceship.speed_mode = 1;
		_spaceship.speed = 2 * _spaceship.speed_lower_limit;
		_spaceship.fuel_penalty = 1;
	}
}
function LevelUp(){
	btns_arr[1].drawFlag = btns_arr[2].drawFlag = btns_arr[3].drawFlag = 1;
	btns_arr[0].color = "rgba(255, 255, 255, 0.3)";
	upgrade_request = 1;
	
	for(var i=0;i<5;i++) m.push(createRandomMeteor());
}
function hide_selected_btns(){
	btns_arr[1].drawFlag = btns_arr[2].drawFlag = btns_arr[3].drawFlag = 0;
	upgrade_request = 0;
	btns_arr[0].color = "rgba(255, 255, 255, 0.3)";
}
onkeydown = onkeyup = function(e){
	e = e || event;
	var key =  e.keyCode || e.key ;
	map[key] = e.type == 'keydown';
	clearTimeout(shot_timeout);
	clearTimeout(help_timeout);
	clearTimeout(firemode_timeout);
	clearTimeout(speed_timeout);
	this.clearTimeout(upgrade_timeout);
	if (map[68] || map[39]){
		_spaceship.d += _steering;
	}
	if (map[65] || map[37]){
		_spaceship.d -= _steering;
	}
	if (_spaceship.d < 0) _spaceship.d += 2;
		_spaceship.d %= 2;

	var req_pts = (_spaceship.upgrade_lvl+1)*_spaceship.upgrade_factor;
	if (map[32]) {
		shot_timeout = setTimeout(shoot_handler,30);
	}
	if (map[72]) {
		help_timeout = setTimeout(helpToggle,30);
	}
	if (map[88]) {
		firemode_timeout = setTimeout(firemodeToggle,30);
	}

	if (map[49] && _spaceship.pts>=req_pts){
		impFuelCapacityToggle();
	}
	if (map[50] && _spaceship.pts>=req_pts){
		improveShootToggle();
	}

	if (map[51] && _spaceship.pts>=req_pts){
		improveSpeedToggle();
	}
	if ((map[83] || map[38]) && _spaceship.fuel > 0){
		speed_timeout = setTimeout(changeSpeedToggle,30);
	}
	if ((map[40]) && _spaceship.fuel > 0){
		_spaceship.speed_mode = (_spaceship.speed_mode-1)%3;
		speed_timeout = setTimeout(changeSpeedToggle,30);
	}
	if (map[71] && _spaceship.pts>=100){
		Spaceship_Acc_Factor += 1;
		_spaceship.pts -= 100;
	}
	if (map[86] && _spaceship.pts>= req_pts){
		upgrade_timeout = setTimeout(LevelUp,30);
	}
}

function fuel_refill(){
	if(_spaceship.fuel<_spaceship.fuel_capacty) _spaceship.fuel+=3;
	else _spaceship.speed_mode = 0;

}
setInterval(fuel_refill,500);
function shootI_reload(){
	if(_spaceship.shotI_bank<_spaceship.shotI_capacity) _spaceship.shotI_bank += 1;
}
setInterval(shootI_reload,1000);

function shotII_reload(){
	if(_spaceship.shotII_range<_spaceship.shotII_max_range)
		_spaceship.shotII_range += 100;
}
setInterval(shotII_reload,1000);

function gameLoop() {
	ctx.clearRect(0,0,W,H);

	ctx.fillStyle = "#150050";
	ctx.fillRect(0,0,W,H);
	for (var i=0;i<_STARS_NUM;i++){
		_stars[i].draw();
		_stars[i].update(_spaceship.d);
	}

	_spaceship.draw();
	Spaceship_NINTH = 5;	

	for (var i=0;i<_METEORS_NUM;i++){
		m[i].update(_spaceship.d);
		m[i].draw();
	}

	for (var i=0;i<_METEORS_NUM;i++){
		for (var j=i+1;j<_METEORS_NUM;j++){
			if (distance(m[i],m[j])<=Math.max(m[i].r,m[j].r)){
				colls.push(new Collision (m[i].x,m[i].y));
				m[i].reset();
				m[j].reset();
				play(m[i].soundlst,30,.19,.18,.2,.05,0,'sine');
				hit_sound();
			}
		}
		if (distance(_spaceship,m[i])<=Math.max(m[i].r,_spaceship.r)) {
			_spaceship.life -= 25;
			m[i].reset();
			play(m[i].soundlst,30,.19,.18,.2,.05,0,'sine');
			hit_sound();
			colls.push(new Collision (W/2,H/2));
			if (_spaceship.life <= 0) _spaceship.life_state = 1;
		}
	}

	for (var i=0;i<_shots.length;i++){
		for (var j=0;j<_METEORS_NUM;j++){
			if (distance(_shots[i],m[j])<=m[j].r){
				colls.push(new Collision (m[j].x,m[j].y));
				play(m[j].soundlst,30,.19,.18,.2,.05,0,'sine');
				m[j].reset();
				_shots[i].flag=1;
				hits_counter += 1;
				_spaceship.pts += 100+Spaceship_Acc_Factor*_spaceship.acc;
				break;
			}
		}
	}

	for (var i=0;i<_electrics.length;i++){
		for (var j=0;j<_METEORS_NUM;j++){
			var a = _electrics[i], b=m[j];
			var m1 = (a.ey-a.sy)/(a.ex-a.sx);
			var m2 = (b.y-H/2)/(b.x-W/2);
			if (Math.abs(m1-m2)<0.3 && (a.sx < b.x && b.x < a.ex||
			 a.ex < b.x && b.x < a.sx
			 )){
				colls.push(new Collision (m[j].x,m[j].y));
				electric_hit_sound();
				m[j].reset();
				_electrics.ex = m[j].x;
				_electrics.ey = m[j].y;
				hits_counter += 1;
				_spaceship.pts += 100+Spaceship_Acc_Factor*_spaceship.acc;
				break;
			}
		}
	}
	_electrics = _electrics.filter(function(value,index,arr){
		return value.flag == 0;
	});
	for (var i=0;i<_electrics.length;i++){
		_electrics[i].draw();
		_electrics[i].update();
	}
	for (var i=0;i<_shots.length;i++){
		_shots[i].draw(_spaceship.d);
		_shots[i].update();
	}
	_shots= _shots.filter(function(value,index,arr){
		return value.flag == 0;
	});




	for (var i=0;i<colls.length;i++){
		colls[i].draw();
		colls[i].update();
	}
	colls = colls.filter(function(v,i,a){
		return v.flag == 0;
	});

	if(shots_counter>0) _spaceship.acc = Math.floor((hits_counter / shots_counter)*100);

	if(_spaceship.pts>=(_spaceship.upgrade_lvl+1)*+_spaceship.upgrade_factor && upgrade_request == 0) {
		btns_arr[0].color = "white";
	}
	else {
		btns_arr[0].color = "rgba(255, 255, 255, 0.3)";
	}
	Interface_Buttons.drawLoop();

	if (_spaceship.fire_mode == 0) ShotI.drawHood();
	else ShotII.drawHood();
}


window.mobileAndTabletCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };

if(!mobileAndTabletCheck()){
	_spaceship.mobile_flag = 0;
	window.setInterval(gameLoop,30);
}

else {
	_spaceship.mobile_flag = 1;
	window.setInterval(gameLoop,30);
}
