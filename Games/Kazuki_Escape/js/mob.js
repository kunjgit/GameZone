var mobs_data = [
	[
		'Guardian',
		2,//rot. speed
		1,//mov. speed
		60,//lantern angle
		100,//lantern distance
		10,//health
		2,//points
		1//level
	],
	[
		'Officer',
		1.25,//rot. speed
		0.5,//mov. speed
		60,//lantern angle
		80,//lantern distance
		6,//health
		2,//points
		2//level
	],
	[
		'Enforcer',
		1,//rot. speed
		0.5,//mov. speed
		100,//lantern angle
		90,//lantern distance
		20,//health
		3,//points
		3//level
	],
	[
		'SWAT',
		1.75,//rot. speed
		2,//mov. speed
		50,//lantern angle
		70,//lantern distance
		40,//health
		5,//points
		4//level
	]
];
var bosses = [
    [
        'Captain',
        [
            'Hiro',
            'Toshi'
        ],
        'black'
    ],
    [
        'Sergent',
        [
            'Hideki',
            'Jiro',
            'Kobe'
        ],
        'grey'
    ],
    [
        'Amiral',
        [
            'Kaito',
            'Hiroshi'
        ],
        'red'
    ],
    [
    	'Sergeant',
    	[
    		'Hideo',
    		'Akira'
    	],
        'white'
    ]
];
function detect_player(x, y, angle, half_lantern_angle, lantern_light_distance){
	x+=Math.cos(Math.radians(angle+35))*15;
	y+=Math.sin(Math.radians(angle+35))*15;
	px = player.x;
	py = player.y;

	var dx = px - x;
	var dy = py - y;

	var a = Math.atan2(dy, dx)*180/Math.PI;
		a += a < 0?360:0;

	if( Math.sqrt( dx*dx + dy*dy )  <= lantern_light_distance && a > angle - half_lantern_angle && a < angle + half_lantern_angle )
		return true;
	return false;
}
function Mob(d){
	this.x = d.x;
	this.y = d.y;
	this.angle = d.angle;
	this.new_angle;
	this.rotate_speed = d.rotate_speed;
	this.angle_increment = d.rotate_speed;
	this.lantern = d.lantern;
	this.distance;
	this.state = 0;
	this.speed = d.movement_speed;
	this.max_health = d.health;
	this.health = d.health;
	this.name = d.name;
	this.points = d.points;
	this.boss = d.boss;
	this.img_type = d.img_type;
	this.update = function(){
		if(detect_player( this.x, this.y, this.angle, this.lantern.angle/2, this.lantern.distance)){
			end_game();
			return 0;
		}
		switch(this.state){
			case 0://pick a random angle
				this.new_angle = Math.floor(Math.random()*360);
				this.angle_increment = Math.abs(this.rotate_speed)*( this.angle<this.new_angle?1:-1 );//this.angle-this.new_angle>this.new_angle+360-this.angle
				this.state = 1;
			break;
			case 1://rotate to the new angle
				this.angle += this.angle_increment;
				if( (this.angle > this.new_angle && this.angle_increment > 0) || (this.angle < this.new_angle && this.angle_increment < 0) ){
					this.distance = Math.floor( Math.random()*100+50 );
					this.state = 2;
				}
			break;
			case 2://move
				var sin = Math.sin(Math.radians(this.angle)),
					cos = Math.cos(Math.radians(this.angle));

				this.distance -= this.speed;
				if(this.x-16 < 0 || this.x+16 > ww || this.y-16 < 0 || this.y+16 > wh){
					if(this.x-16 < 0){this.x = 16;this.distance = 0;}
					if(this.y-16 < 0){this.y = 16;this.distance = 0;}
					if(this.x+16 > ww){this.x = ww-16;this.distance = 0;}
					if(this.y+16 > wh){this.y = wh-16;this.distance = 0;}
				}
				else{
					this.x += cos*this.speed;
					this.y += sin*this.speed;
					if(this.distance <= 0) this.state = 0;
				}

			break;
		}
	};
	this.render = function(){
		eCtx.save();
		eCtx.translate(this.x, this.y);
		eCtx.rotate(Math.radians(this.angle)+Math.PI/2);
		eCtx.drawImage(enemyCanvas, this.img_type*26, 0, 26, 28, -13, -14, 26, 28);
		eCtx.restore();
		drawHealthbar(eaCtx, this.x, this.y-20, (this.health/this.max_health)*100, 50, 2);
		drawText(this.name, this.x+1, this.y-34, {textSize: 12, ctx: eaCtx, textColor: 'black'});
		drawText(this.name, this.x, this.y-35, {textSize: 12, ctx: eaCtx, textColor: this.boss?'red':'white'});
		castLight(this.angle, this.lantern.angle, this.lantern.distance, this.x+Math.cos( Math.radians(this.angle+35) )*15, this.y+Math.sin( Math.radians(this.angle+35) )*15);
	};
}