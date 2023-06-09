/**
 * Graphic renderer for the overlaid 2D canvas.
 */
 
/**
 * OverlayRenderer constructor
 * @param canvas the canvas to draw on.
 * @constructor
 */
function OverlayRenderer(canvas) 
{
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.resize();
	
	// common font setup. Reset to default prior to exiting any method that modifies these.
	this.context.lineJoin="bevel";
	this.context.lineWidth=4;
	this.context.textAlign="center";


	this.renderingTimer=0;
	this.mainMenuText = ["1 UP", "2 UP", "CONTROLS", "MUSIC : ", "SOUND FX : "];
	this.pauseMenuText = ["RESUME RACE", "QUIT TO MENU", "CONTROLS", "MUSIC : ", "SOUND FX : "];
	this.controlsMenuStaticText = ["ACCELERATE", "BRAKE", "STEER LEFT", "STEER RIGHT", "CHANGE CAMERA"];
	this.endRaceMenuText = ["RACE AGAIN", "BACK TO TRACK MENU", "TWEET RACE TIME"];
	this.message = ["", ""];
	this.messageTimer = [0, 0];
	this.keyToString = "PRESS KEYaaaaaaaaaBACKSPACEaTABaaaKEYPAD 5aENTERaaaSHIFTaCTRLaALTaPAUSEaCAPS LOCKaaaaaaaaaaaaSPACEaPAGE UPaPAGE DOWNaENDaHOMEaLEFT ARROWaUP ARROWaRIGHT ARROWaDOWN ARROWa)a*a+a,aINSaDELa/a0a1a2a3a4a5a6a7a8a9a:a;a<a=a>a?a@aAaBaCaDaEaFaGaHaIaJaKaLaMaNaOaPaQaRaSaTaUaVaWaXaYaZaLEFT WINDOWSaRIGHT WINDOWSaSELECTa^a_aKEYPAD 0aKEYPAD 1aKEYPAD 2aKEYPAD 3aKEYPAD 4aKEYPAD 5aKEYPAD 6aKEYPAD 7aKEYPAD 8aKEYPAD 9aKEYPAD *aKEYPAD +alaKEYPAD -aKEYPAD .aKEYPAD /aF1aF2aF3aF4aF5aF6aF7aF8aF9aF10aF11aF12a|a}a~aaaaaaaaaaaaaaaaaaNUM LOCKaSCROLL LOCKaaaaaaaaaaaaaaa^a!aaa$a%aaaa)a*aaaaaaaaaaaaaaaa;a=a,a-a.a/a`aaaaaaaaaaaaaaaaaaaaaaaaaaa[a\\a]a'aaAPPLE".split("a");
	/*
	this.keyToString = [];
	for (var i=0; i<128; ++i) this.keyToString.push(String.fromCharCode(i));
	this.keyToString[8]="BACKSPACE";
	this.keyToString[9]="TAB";
	this.keyToString[12]="KEYPAD 5";
	this.keyToString[13]="ENTER";
	this.keyToString[16]="SHIFT";
	this.keyToString[17]="CTRL";
	this.keyToString[18]="ALT";
	this.keyToString[19]="PAUSE";
	this.keyToString[20]="CAPS LOCK";
	this.keyToString[32]="SPACE";
	this.keyToString[33]="PAGE UP";
	this.keyToString[34]="PAGE DOWN";
	this.keyToString[35]="END";
	this.keyToString[36]="HOME";
	this.keyToString[37]="LEFT ARROW";
	this.keyToString[38]="UP ARROW";
	this.keyToString[39]="RIGHT ARROW";
	this.keyToString[40]="DOWN ARROW";
	this.keyToString[45]="INS";
	this.keyToString[46]="DEL";
	this.keyToString[91]="LEFT WINDOWS";
	this.keyToString[92]="RIGHT WINDOWS";
	this.keyToString[93]="SELECT";
	this.keyToString[96]="KEYPAD 0";
	this.keyToString[97]="KEYPAD 1";
	this.keyToString[98]="KEYPAD 2";
	this.keyToString[99]="KEYPAD 3";
	this.keyToString[100]="KEYPAD 4";
	this.keyToString[101]="KEYPAD 5";
	this.keyToString[102]="KEYPAD 6";
	this.keyToString[103]="KEYPAD 7";
	this.keyToString[104]="KEYPAD 8";
	this.keyToString[105]="KEYPAD 9";
	this.keyToString[106]="KEYPAD *";
	this.keyToString[107]="KEYPAD +";
	this.keyToString[109]="KEYPAD -";
	this.keyToString[110]="KEYPAD .";
	this.keyToString[111]="KEYPAD /";
	this.keyToString[112]="F1";
	this.keyToString[113]="F2";
	this.keyToString[114]="F3";
	this.keyToString[115]="F4";
	this.keyToString[116]="F5";
	this.keyToString[117]="F6";
	this.keyToString[118]="F7";
	this.keyToString[119]="F8";
	this.keyToString[120]="F9";
	this.keyToString[121]="F10";
	this.keyToString[122]="F11";
	this.keyToString[123]="F12";
	this.keyToString[144]="NUM LOCK";
	this.keyToString[145]="SCROLL LOCK";
	this.keyToString[160]="^";
	this.keyToString[161]="!";
	this.keyToString[164]="$";
	this.keyToString[165]="%";
	this.keyToString[169]=")";
	this.keyToString[170]="*";
	this.keyToString[186]=";";
	this.keyToString[187]="=";
	this.keyToString[188]=",";
	this.keyToString[189]="-";
	this.keyToString[190]=".";
	this.keyToString[191]="/";
	this.keyToString[192]="`";
	this.keyToString[219]="[";
	this.keyToString[220]="\\";
	this.keyToString[221]="]";
	this.keyToString[222]="'";
	this.keyToString[224]="APPLE";
	this.keyToString.unshift("PRESS KEY");
	*/
}

OverlayRenderer.prototype = {

	resize : function() {
		var width = window.innerWidth, height=window.innerHeight;
		
		this.canvas.height=this.context.height=height;
		this.canvas.width=this.context.width=width;
		this.context.translate(width>>1,height>>1);
		this.scale = .1*Math.min(.5*width, height);
	},

	outlineText : function(text,x,y,size) {
		this.context.font = Math.ceil(size*this.scale)+"px Verdana";
		this.context.strokeText(text, x, y);
		this.context.fillText(text, x, y);
	},
	
	/**
	 * Clear the canvas
	 */
	clear : function() {
		this.context.clearRect(-this.context.width>>1, -this.context.height>>1, this.context.width, this.context.height);
	},
	
	/**
	 *	Offset menu display for transition
	 *  @param ratio : any value between -1(one screen up) and 1 (one screen down). 0 means unchanged.
	 */
	offsetDisplay : function(ratio) {
		this.context.save();
		this.context.translate(0, this.canvas.height*ratio);
	},
	
	/**
	 * Restore the context as before the offset
	 */
	endOffset : function() {
		this.context.restore();
	},

	/**
	 * Draw the main menu options
	 * @param menu the active menu (selected line, controls, ...)
	 * @param pause true if the menu was invoked from ingame pause
	 */
	renderMainMenu : function(menu, pause) {
		
		this.context.save();
		var highlightColor = "#FFF";
		if ((this.renderingTimer%3)==0 && ((Math.floor(this.renderingTimer/50)&1)==0)) {
			highlightColor = "#F77";
		}
		var gray = Math.round(50+50*Math.cos(this.renderingTimer/20));
			
		for (var index=0; index<5; ++index) {
			this.context.fillStyle=(menu.selectedLine==index?highlightColor : "#AAA");
			this.context.strokeStyle="hsl(0,0%,"+(menu.selectedLine==index?gray:0)+"%)";			
			var text=pause?this.pauseMenuText[index]:this.mainMenuText[index];
			text+=(index==3?(menu.soundManager.audioTagSupport?(menu.soundManager.persistentData.data.musicOn?"ON":"OFF"):"not supported"):"");
			text+=(index==4?(menu.soundManager.webAudioSupport?(menu.soundManager.persistentData.data.soundOn?"ON":"OFF"):"not supported"):"");
			this.outlineText(text, 0, (index-2)*1.5*this.scale, .8);
		}
		this.context.restore();
		++this.renderingTimer;
	},
	
	/**
	 * Draw the menu that offers actions to edit the control keys
	 */
	renderControlsMenu : function(menu, controls) {
		this.context.save();

		var highlightColor = "#FFF";
		if ((this.renderingTimer%3)==0 && ((Math.floor(this.renderingTimer/50)&1)==0)) {
			highlightColor = "#F77";
		}
		var gray = Math.round(50+50*Math.cos(this.renderingTimer/20));
			
		this.context.fillStyle="#AAA";			
		this.context.strokeStyle="#000";
		for (var index=0; index<5; ++index) {
			this.outlineText(this.controlsMenuStaticText[index], 0, (index-3)*1.2*this.scale, .6);
		}
		
		for (var column=0; column<2; ++column) for (var line=0; line<6-column; ++line) {
			this.context.strokeStyle="hsl(0,0%,"+((menu.selectedLine==line&&(menu.selectedColumn==column||line==5))?gray:0)+"%)";
			this.context.fillStyle=(menu.selectedLine==line&&(menu.selectedColumn==column||line==5)?highlightColor : "#AAA");
			var text=(line<5?this.keyToString[1+controls.persistentData.data.keys[column][line]]:"BACK");
			var x=-400+800*column+400*(line==5);
			var y=(line==5?3:line-3);
			this.outlineText(text, x, y*1.2*this.scale, .6);
		}
		this.context.restore();
		++this.renderingTimer;
	},
	
	/**
	 * Display on the overlay canvas the track menu :
	 *  - one line for each track, featuring track name and records
	 *  - one final line to return to main menu
	 */ 
	renderTrackMenu : function(menu, season, allTrackRecords)
	{
		this.context.save();
		var highlightColor = "#FFF";
		if ((this.renderingTimer%3)==0 && ((Math.floor(this.renderingTimer/50)&1)==0)) {
			highlightColor = "#F77";
		}
		var gray = Math.round(50+50*Math.cos(this.renderingTimer/20));
			
		for (var index=0; index<menu.lineCount-1; ++index) {
			this.context.fillStyle=(menu.selectedLine==index?highlightColor : "#AAA");
			this.context.strokeStyle="hsl(0,0%,"+(menu.selectedLine==index?gray:0)+"%)";			
			this.context.textAlign="left";
			var y = (index+1)*9*this.scale/menu.lineCount-(this.context.height>>1);
			this.outlineText(season.trackName[index], -.48*this.context.width, y, .75);
			this.context.textAlign="right";
			this.outlineText(this.formatTime(allTrackRecords[index].lap), .24*this.context.width, y, .75);
			this.outlineText(this.formatTime(allTrackRecords[index].track), .48*this.context.width, y, .75);
			
		}
		var index = menu.lineCount-1;
		var y = (index+1)*9*this.scale/menu.lineCount-(this.context.height>>1);
		this.context.fillStyle=(menu.selectedLine==index?highlightColor : "#AAA");
		this.context.strokeStyle="hsl(0,0%,"+(menu.selectedLine==index?gray:0)+"%)";			
		this.context.textAlign="center";
		
		this.outlineText("BACK TO MAIN", 0, y, .75);
		this.context.restore();
		++this.renderingTimer;
	},
	
	/**
	 * Display the message "Get Ready" at the beginning of a race
	 * Location and offset depend on timer :
	 *  x : enter right at -7s, leave left at 0 s
	 *  y : enter top at -7, leave bottom at 0 s
	 */
	renderGetReadyMessage : function (time)
	{
		this.context.font=Math.ceil(10*this.scale)+"px Verdana";

		this.context.fillStyle="#FFF";			
		var x = this.context.width*(-4.8-time);	// 1 to -2.5
		var y = this.context.height*(time+7)/5;	// -0.4 to 1
		this.context.fillText("GET READY !", x, y);
	},
	
	/**
	 * Display the traffic lights that control the start of the race
	 * Color and position depend only on timer
	 * -5 to -4s : move down
	 *  -4 to -1 s : red lights
	 *  0 s : green light
	 *  0 to 1s : move up
	 * 
	 */
	renderLights : function (time)
	{
		var y = this.scale*(-4-4*(time<-4?-4-time:time>0?time:0));
		this.context.fillStyle="#000";
		for (var x=0; x<5; ++x) {
			this.context.fillRect(this.scale*(2*x-4.8), y, this.scale*1.6, this.scale*1.8);
		}
		for (var x=0; x<5; ++x) {
			this.context.fillStyle = (x<4?(x-time>=3?"#F00":"#000"):(time>=0?"#0F0":"#000"));
			this.context.beginPath();
			this.context.arc(this.scale*(2*x-4), y+this.scale*.9, this.scale*.6, 0, 7, false);
			this.context.fill();
		}	
	},
	
	/**
	 * Formats the time as ss:cc (below 1 mn) or mm:ss:cc otherwise
	 * Leading zeroes are added except for the first block (5:20 vs 1:05:20)
	 * @param time time counter in frames
	 */
	formatTime : function(time)
	{
		if (time==0) 
			return "--:--";
		time*=2;
		var cs = time%100, s = ((time-cs)/100)%60, m = (time-cs-s*100)/6000;
		return (m>0?m+":":"")+(m>0&s<10?"0":"")+s+":"+(cs<10?"0":"")+cs;
	},
	
	/**
	 * Draw the ingame top bar : car speed, lap times, elapsed time
	 */
	renderStatusBar : function(playerCount, cars, currentTime, showTime)
	{
		this.context.save();
		this.context.translate(0, -this.context.height>>1);
		this.context.fillStyle="rgba(0,0,0,.5)";
		this.context.fillRect(-this.context.width>>1, 0, this.context.width, .5*this.scale);
		var panelWidth = this.context.width/playerCount;
		this.context.textAlign="right";
		for (var player=0; player<playerCount; ++player) {
			var panelLeft = [-.5, .1][player]*this.context.width;
			var car = cars[player];
			this.context.fillStyle="#C00";	
			this.context.fillRect(panelLeft+panelWidth/30, this.scale/15, Math.min(car.speed, 60)*panelWidth/8/60, this.scale/3);
			this.context.strokeRect(panelLeft+panelWidth/30, this.scale/15, panelWidth/8, this.scale/3);
			var text=Math.round(3.6*car.speed)+" km/h";
			this.context.fillStyle="#FFF";		
			this.outlineText(text, panelLeft+.12*panelWidth, this.scale/3, .25);
			for (var laps=0; laps<4; ++laps)
			{
				var timeString = "--:--";
				if (car.lapTimes.length>1+laps) {
					timeString = this.formatTime(car.lapTimes[laps+1]-car.lapTimes[laps]);
				}
				this.outlineText(timeString, panelLeft+panelWidth*(laps+1.5)/6, this.scale/3, .25);	
			}
		}
		if (showTime && currentTime > 0) {
			var timeString = this.formatTime(currentTime);
			this.context.textAlign="center";
			this.outlineText(timeString, [panelLeft+panelWidth-2*this.scale, 0][playerCount-1], this.scale/2-2, .5);	
		}
		this.context.restore();
	},
	
	/**
	 * Display the results at the end of a race
	 */
	renderTimingPanel : function(player, playerCount, car, trackRecord)
	{
		var panelWidth = this.context.width/playerCount;
		var panelLeft = (player-1)*(this.context.width>>1);
		var x = panelLeft + (panelWidth>>1);
		
		this.context.fillStyle="#FFF";			
		this.context.strokeStyle="#000";			

		this.outlineText("YOUR BEST LAP", x, -3.5*this.scale, .5);
		this.outlineText("TOTAL RACE TIME", x, -0.5*this.scale, .5);

		this.outlineText(this.formatTime(car.bestLap), x, -2.5*this.scale, .8);

		var carTotalTime = car.lapTimes[car.lapTimes.length-1];
		this.outlineText(this.formatTime(carTotalTime), x, .5*this.scale, .8);

		var text="You just drove the fastest lap on that track !";
		if (car.bestLap>trackRecord.lap) {
			text = "Best lap ever "+this.formatTime(trackRecord.lap);
		} 
		this.outlineText(text, x, -2*this.scale, .3);

		if (carTotalTime>trackRecord.track) {
			text = "All time best "+this.formatTime(trackRecord.track);
		} else {
			text = "NEW TRACK RECORD !";
		}
		this.outlineText(text, x, this.scale, .3);
		
	},
	
	
	/**
	 * Draw the menu at the end of a race
	 */
	renderEndRaceMenu : function(menu) {
		
		this.context.save();
		var highlightColor = "#FFF";
		if ((this.renderingTimer%3)==0 && ((Math.floor(this.renderingTimer/50)&1)==0)) {
			highlightColor = "#F77";
		}
		var gray = Math.round(50+50*Math.cos(this.renderingTimer/20));
			
		for (var index=0; index<3; ++index) {
			this.context.strokeStyle="hsl(0,0%,"+(menu.selectedLine==index?gray:0)+"%)";			
			this.context.fillStyle=(menu.selectedLine==index?highlightColor : "#AAA");
			this.outlineText(this.endRaceMenuText[index], 0, (2.4+index)*this.scale, .8);
		}
		this.context.restore();
		++this.renderingTimer;
	},
	
	/**
	 * Defines the message to display on each player screen
	 * and sets the display countdown (the message goes away after 2s)
	 */
	setMessage : function(player, message) {
		this.message[player] = message;
		this.messageTimer[player] = 50;
	},
	
	/**
	 * Display the messages for both players, if any
	 */
	showMessages : function(playerCount) {
		for (var i=0; i<playerCount; ++i) if (this.messageTimer[i]) {
			this.context.strokeStyle="#000";			
			this.context.fillStyle="#FFF";			
			var panelWidth = this.context.width/playerCount;
			var panelLeft = (i-1)*(this.context.width>>1);
			var x = panelLeft + (panelWidth>>1);
			this.outlineText(this.message[i], x, -3.5*this.scale, .5);
			--this.messageTimer[i];
		}
		
	}
	 
	
}  