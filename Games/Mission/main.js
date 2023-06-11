(function(){

var browserWidth;
var browserHeight;
var canvas;
var ctx;
var maxHaloOffset;

var planets = [];

var uiSpacing = 50;

var totalPlanetWidth;

var stars;

var textContainer;
var textInner;

var gameState = 0;


//button status variables
var preachLevel;
var hasLife;

var fuel;
var crew;
var souls;

var currentPlanet;

var turnCounter;

window.onload = function(){
	browserWidth = window.innerWidth;
	browserHeight = window.innerHeight;
	margin = 20;
	maxRadius = (((browserHeight-uiSpacing) / 3) - margin) / 2;

	totalPlanetWidth = maxRadius * 4.6;

	maxHaloOffset = maxRadius*.15;

	canvas = document.querySelector('#c');
	ctx = canvas.getContext('2d');

	c.width = browserWidth;
	c.height = browserHeight;
	c.style.width = browserWidth+"px";
	c.style.height = browserHeight+"px";

  buttonContainer = document.querySelector("#button-container");
  buttonContainer.style.width = browserWidth;

  buttonContainer.addEventListener("click", function(e){
    var el = e.srcElement || e.target;
    if(el.id != "button-container"){
      var buttonHtml = el.innerHTML;
      e.preventDefault();
      e.stopPropagation();

      if(buttonHtml == "..."){
        quotaTurns--;
        turnCounter++;
        checkStats();
        generate();
        //todo:
        //  -turn--;
        //  -update UI
      }else if(buttonHtml == "LEAVE"){
        gameState = 3;
        quotaTurns--;
        turnCounter++;
        checkStats();
        generate();
      }else if(buttonHtml == "THREATEN"){
        if(Math.random()>.5){
          var lostCrew = Math.min(crew,rand(50,200+20*turnCounter));
          crew -=lostCrew;
          showText("These aliens are more advanced than you expected and they don't take kindly to threats. During the counterattack, you lose "+lostCrew+" crew members.");
        }else{
          preachLevel--;
          showText("A little spin of your dark matter cannon has set these aliens straight. Their civilization is mesmerized by your God's fearsome power.");
        }
      }else if(buttonHtml == "PREACH"){
        if(preachLevel <=0){
          var newFollowers = Math.floor(Math.random()*3*1000000000);
          souls+=newFollowers;
          followerText = 'The denizens of this planet are receptive to your divine claims. You gain '+commaIt(newFollowers)+' new followers.';
          while(souls>=quota){
            fuel+=Math.min(3,quotaTurns);
            followerText+='<h3>Congratulations!</h3>You\'ve reached the quota, so you have been awarded '+Math.min(3,quotaTurns)+' fuel and 100 new crew members.';
            crew+=100;
            newQuota();
          }
          showText(followerText);
          preachLevel = 100;
        }else{
          showText('The lifeforms on this planet give you odd looks. No one is swayed by your proselytizing.');
        }
      }else if(buttonHtml == "TRADE (fuel for crew)"){
          showText("You've traded 1 fuel for 100 crew new members.");
          fuel--;
          crew+=100;
      }else if(buttonHtml == "GIFT (fuel)"){
        if(Math.random()>.333){
          preachLevel--;
        }
        fuel--;
        showText("Your generous gift of fuel has demonstrated the blessings of your God.<br><br>However, gifts are never a surefire method of influence. You'll have to wait and see.");
      }
      checkStats();
      updateUi();
    }
  },false);

  textContainer = document.querySelector("#text-container");
  textInner = document.querySelector("#text-inner");
  textContainer.style.width = browserWidth-20;
  textContainer.style.height = browserHeight-120;


	html = document.querySelector('html');
	html.style.width = browserWidth+"px";
	html.style.height = browserHeight+"px";

/*
  document.querySelector('body').addEventListener("touchstart", function(e){
    x = e.targetTouches[0].clientX;
    y = e.targetTouches[0].clientY;

    handleTouch(x,y);
  },false);
*/
  document.querySelector('body').addEventListener("click", function(e){
    x = e.clientX;
    y = e.clientY;

    handleTouch(x,y);
  },false);




  stars = drawStars();

  drawTitle();

}

var drawTitle = function(){
  ctx.clearRect(0,0,browserWidth,browserHeight);
  ctx.drawImage(stars, 0,0);

  var titleSize = 20;
  ctx.fillStyle = "white"
  ctx.font = "bold 20px Helvetica, Arial";
  while(ctx.measureText("MISSION").width<(browserWidth - 20) && titleSize < 150){
    titleSize++;
    ctx.font = 'bold '+titleSize+'px Helvetica, Arial';
  };

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("MISSION",browserWidth/2,browserHeight/2);
}

var newQuota = function(){
  var quotaB = rand(1,4);
  quota+= quotaB*1000000000;
  quotaTurns+=quotaB+Math.floor(Math.max(0, 4-turnCounter*.08));
}

var quota, quotaTurns;

var startGame = function(){
  quota = 2*1000000000;
  quotaTurns = 5;

  fuel=6;
  crew=1000;
  souls=0;

  turnCounter=0;

  generate();
}

var handleTouch = function(x,y){
    if(gameState==0){
      gameState++;
      ctx.clearRect(0,0,browserWidth,browserHeight);
      ctx.drawImage(stars,0,0);
      showText("You are Reverend Captain Lore Whitaker. You're a missionary, flying deep into the galactic backwaters.<br><br>There's billions and billions of stars in the galaxy. And way out in prefecture 461, there's billions of billions of souls still waiting for the good news. But if you're going to save souls, first you've got to find them.<br><br>For centuries, successful missions have been founded on one simple concept: that the four elements describe both our terrestial lives and our spiritual lives. Easy to remember. Easy to spread to alien civilizations. We call it the worldless book: <h3><div class='earth'></div> EARTH</h3>Earth represents the sin we are instilled with by being worldly creatures.<h3><div class='fire'></div> FIRE</h3>Fire represents a choice between hellfire (continuing in sin) and the blood of the savior. <h3><div class='water'></div> WATER</h3> Water represents baptism and forgiveness of sins.<h3><div class='air'></div> AIR</h3> Air represents heaven, purity, and freedom from sin.");

//QUOTAS:
//how it works
//  -pick a planet
//  -go there, hopefully it is inhabited
//  -

    }else if(gameState ==1){
      gameState++;
      ctx.clearRect(0,0,browserWidth,browserHeight);
      ctx.drawImage(stars,0,0);
      showText("This is what we teach, but we also use it as a rule of thumb for finding habitable planets:<h3><div class='earth'></div> EARTH</h3>The size/mass of a planet.<h3><div class='fire'></div> FIRE</h3>Heat, the distance from a planet's star. <h3><div class='water'></div> WATER</h3> Liquid water.<h3><div class='air'></div> AIR</h3> A planet's atmosphere.<h3>Planet Hunting</h3>Try to pick planets that might be habitable. If you don't like your current selection, you can hit the '...' button to search for more planets. This takes a turn, but doesn't waste fuel.<h3>Ratings</h3>When you visit a planet, you'll see a rating of 1-4 for each element. Three is ideal. All elements can be estimated from a <u>visual inspection</u>, so try to learn the relationship between the look of the planet and the ratings! <h3>Quotas</h3>Upcoming follower quotas are noted at the bottom of your screen along with how many turns you have to meet them. Meet a quota early and you'll be rewarded with fuel and crew. Failing a quota means failing the mission.<br><br>Godspeed!");
    }else if(gameState ==2){
      gameState++;
      startGame();
      hideText();
    }else if(gameState==3){
      planet = Math.floor(y/((browserHeight-uiSpacing)/3));
      if(planet<3){
        currentPlanet=planet;
        gameState++;

        preachLevel = rand(0,1);
        hasLife = planets[planet].hasLife;

        fuel--;


        updateUi();
      }
    }else if(gameState ==4){
      hideText();
    }else if(gameState == 5){
      hideText();
      gameState = 0;
      drawTitle();
    }
}

var checkStats = function(){
  if(gameState!=5){
    if(fuel <= 0 && gameState == 3){
      showText("<h3>Mission failed</h3>You have ran out of fuel.<br><br>Followers: <strong>"+commaIt(souls)+"</strong>");
      gameState=5;
    }

    if(crew <=0){
      showText("<h3>Mission failed</h3>Your entire crew was killed in battle.<br><br>Followers: <strong>"+commaIt(souls)+"</strong>");
      updateUi();
      gameState=5;
    }

    if(quotaTurns < 0){
      showText("<h3>Mission failed</h3>You failed to meet a quota.<br><br>Followers: <strong>"+commaIt(souls)+"</strong>");
      updateUi();
      gameState=5;
    }
  }
}

var updateUi = function(){

  if(gameState==4){
    drawPlanet(currentPlanet);
  }

  ctx.fillStyle = "white";
  ctx.font = "16px Courier";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  var iconSize = 20;
  ctx.drawImage(fuelIcon(iconSize), browserWidth/20, browserHeight - 100);

  ctx.fillText(fuel, browserWidth/20+30, browserHeight-100);

  ctx.drawImage(crewIcon(iconSize), browserWidth/20, browserHeight - 75);
  ctx.fillText(commaIt(crew), browserWidth/20+30, browserHeight-75);

  ctx.drawImage(peopleIcon(iconSize), browserWidth/20, browserHeight - 50);
  ctx.fillText(commaIt(souls), browserWidth/20+30, browserHeight-50);

  ctx.drawImage(quotaIcon(iconSize), browserWidth/20, browserHeight - 25);
  ctx.fillText( commaIt(quota)+ ' ('+quotaTurns+')', browserWidth/20+30, browserHeight-25)


  buttonContainer.innerHTML = "";
  if(gameState == 4){
    //draw buttons
    
    if(hasLife){
      if(preachLevel < 100){
        buttonContainer.innerHTML += '<div class="button">PREACH</div>';
        buttonContainer.innerHTML += '<div class="button">THREATEN</div>';
        buttonContainer.innerHTML += '<div class="button">GIFT (fuel)</div>';
      }
      if(fuel>0){
        buttonContainer.innerHTML += '<div class="button">TRADE (fuel for crew)</div>';
      }
    }
    buttonContainer.innerHTML += '<div class="button">LEAVE</div>';
  }else if(gameState == 3){
      buttonContainer.innerHTML += '<div class="button corner-button">...</div>';
  }
}

var mkGradient = function(opts){
    opts.ctx.rect(0, 0, opts.r2*2, opts.r2*2);
    
  var g = opts.ctx.createRadialGradient(opts.r2*(opts.s ? .75:1), opts.r2*(opts.s ? .75:1), opts.r1, opts.r2*(opts.s ? .75:1), opts.r2*(opts.s ? .75:1), opts.r2);
    
    g.addColorStop(0, opts.c1);
    g.addColorStop(1, opts.c2);
    
    
    opts.ctx.fillStyle = g;
    opts.ctx.fill();
}

var peopleIcon = function(size){
    var canvas = document.createElement('canvas');
    canvas.width = size*2;
    canvas.height = size*2;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(size/2, size/4, size/4, 0, 2 * Math.PI);
    ctx.fill();


    ctx.beginPath();
    ctx.arc(size/2, size, size/2, Math.PI, 2 * Math.PI);
    ctx.fill();

    return canvas;
}

var quotaIcon = function(size){
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#777";

    ctx.beginPath();
    ctx.arc(size/2, size/4, size/4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size/2, size, size/2, Math.PI, 2 * Math.PI);
    ctx.fill();


    
    ctx.fillStyle = "white";
    ctx.fillRect(size/2,size*(4/6),size/2, size/6);
    ctx.fillRect(size*(4/6),size*(3/6),size/6, size/2);

    return canvas;
}

var fuelIcon = function(size){
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "white";

    for(var i=0;i<3;i++){
      ctx.fillRect(i*size/3,0,size/6, size);
    }

    return canvas;
}

var crewIcon = function(size){
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(0, size*(2/5));
    ctx.lineTo(size, size*(2/5));
    ctx.lineTo(size*(1/5), size);
    ctx.lineTo(size*(1/2), 0);
    ctx.lineTo(size*(4/5), size);

    ctx.fill();

    return canvas;
}



var mkPlanet = function(opts){
    var canvas = document.createElement('canvas');
    canvas.width = opts.r*2.4;
    canvas.height = opts.r*2.4;
    var ctx = canvas.getContext('2d');
    
    var haloSize = 1.03+.04*opts.air;
    var haloValue = .4+opts.air*.2;
    var atmosphereValue = .97-opts.air*.05;

    // Halo
    mkGradient({
        ctx: ctx,
        r1: opts.r,
        r2: opts.r*haloSize,
        c1: opts.c3.substr(0,opts.c3.length-2)+(haloValue+0)+')',
        c2: opts.c3.substr(0,opts.c3.length-2)+'0)'
    });

    var offset = opts.r*haloSize-opts.r;
    ctx.translate(offset, offset);

    /// Create planet outline clip
    ctx.beginPath();
    ctx.arc(opts.r, opts.r, opts.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Fill the ocean
    mkGradient({
        ctx: ctx,
        r1: 0,
        r2: opts.r,
        c1: opts.o2,
        c2: opts.o1
    });


    // Add some continents
    //var numCircles = Math.pow(opts.r/2,2)*(.2+.15*Math.random());
    var numCircles = 1500+2500*Math.random();
    var cutoff = (Math.random()*.25+.25)*numCircles;
    for(var i=0;i<numCircles; i++){
        ctx.globalAlpha = Math.random()*.1;
        var x = Math.random()*opts.r*2;
        var y = Math.random()*opts.r*2
        ctx.beginPath();
        ctx.arc(x, y, Math.random()*(opts.r/5), 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = i > cutoff ? opts.c3 : opts.c2;
        if(opts.c4 && numCircles > 3500 && Math.random()>.5){
          ctx.globalAlpha*=.5;
          ctx.fillStyle = opts.c4;
        }

        ctx.fill();
    }  
    ctx.globalAlpha = 1.0;
    
    // shadow
    if(opts.s){
      ctx.rect(0, 0, opts.r*2, opts.r*2);
      var g = ctx.createRadialGradient(
        opts.r*.5,
        opts.r*.75,
        opts.r*.3,
        opts.r*.5,
        opts.r*.75,
        opts.r*(1.1+.4*Math.random())
      ); 
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,1)');    
      ctx.fillStyle = g;
      ctx.fill();






	    //atmoshpere
	    mkGradient({
	          ctx: ctx,
	          r1: opts.r*atmosphereValue,
	          r2: opts.r,
	          c1: opts.c3.substr(0,opts.c3.length-2)+'0)',
	          c2: opts.c3
	     });
	}
    return canvas;
}


var randColor = function(opts){
  if(opts){
    var hue = (Math.random()*(opts[1]-opts[0])+opts[0]);
    var saturation = (Math.random()*(opts[3]-opts[2])+opts[2]);
    var lightness = (Math.random()*(opts[5]-opts[4])+opts[4]);
  }else{
    var hue = (Math.random()*360);
    var saturation = (Math.random()*40+60);
    var lightness = (Math.random()*80+15);
  }

  if(opts.length==8){
    var alpha = (Math.random()*(opts[7]-opts[6])+opts[6])/100;
  }else{
    var alpha = 1;
  }
  
  return 'hsla('+
    hue+','+ saturation+'%,'+lightness+'%,'+alpha+')';
}

var generate = function(){
  ctx.clearRect(0,0,browserWidth,browserHeight);

  
  ctx.drawImage(stars, 0,0);

  //create three planets
  planets = [];
  for(var i =0; i<3;i++){
  	var earthValue = rand(0,3);
  	var airValue = rand(1,3);
  	var radius = ((earthValue+5)/8)*maxRadius;


	var fireValue = rand(0,3);
	var maxSunradius = maxRadius/3;
	var sunRadius = ((fireValue+1)/4)*maxSunradius;
	var sun1 = randColor([0,30,100,100,20,40]);
	var sun2 = randColor([20,50,100,100,85,95]);
	var sunOpts = {
		r: sunRadius*2,
		o1: 'rgba(255,200,200,1)',
		o2: 'rgba(150,0,0,1)',
		c2: 'rgba(255,255,255,1)',
		c3: 'rgba(255,255,25,1)',
		s: false,
		air: 3
	};
	//var sunHalo = halo(sunOpts);
	var sun = mkPlanet(sunOpts);


	var r = Math.random();
	if(r >.6){
		//regular
  		var colorOpt1 = [0, 360,30,100,0,100];
      var colorOpt2 = [0, 360,30,100,30,100];
  	}else if(r>.3){
		//saturated
  		var colorOpt1 = [0, 360,70,100,0,100];
      var colorOpt2 = [0, 360,70,100,30,100];
	}else if(r>.05){
		//solid
    	var color = Math.random()*360;
   		var colorOpt1 = [color,color+25,0,100,0,100];
      var colorOpt2 = [color,color+20,0,100,30,100];
	}else{
		//MOON
  		var colorOpt1 = [0,360,0,20,0,100];
      var colorOpt2 = [0,360,0,20,30,100];
	}


	var planetOpts = {
		r: radius*2,
		o1: randColor(colorOpt1),
		o2: randColor(colorOpt1),
		c2: randColor(colorOpt1),
		c3: randColor(colorOpt2),
    c4: randColor(colorOpt1),
		s: true,
		air: airValue
	};

  if(Math.random()>.8){
    waterValue = 2;
  }else{
    waterValue = 1;
  }

  	if(waterValue==2){
  		var ocean = [205, 240,85,95,40,60];
  		planetOpts.c3 = randColor(ocean);
      planetOpts.c4 = randColor(ocean);
  		planetOpts.o1 = randColor(ocean);
  	}
  	//var planetHalo = halo(planetOpts);
	var planet = mkPlanet(planetOpts);

  var consonants = "BCDFGHJKLMNPQRSTVWXYZ";
  var vowels = "AEIOUY";

  var name="";
  for(var k=0;k<4;k++){
    if(Math.random()>.5 || k<=1){
      name+=consonants[rand(0,consonants.length-1)];
      name+=vowels[rand(0,vowels.length-1)];
      if(Math.random()>.6666){
        if(Math.random()>.5){
          name+=consonants[rand(0,consonants.length-1)];
        }else{
          name+=vowels[rand(0,vowels.length-1)];
        }
      }
    }else{
      break;
    }
  }

  name += "-";
  if(Math.random()>.666){
    name += consonants[rand(0,consonants.length-1)];;
  }else{
    name += Math.floor(Math.random()*1000);
  }

	var totalWidth = radius*(2.06+.08*airValue);

  var elements = [earthValue, fireValue, waterValue, airValue];
  var chance = 1;
  for(var k=0;k<elements.length;k++){
    if(elements[k]==3){
      chance*=.9;
    }else if(elements[k]==1){
      chance*=.8;
    }else if(elements[k]==0){
      chance*=.5;
    }
  }

  var hasLife = false;
  if(Math.random()<=chance){
    hasLife = true;
  }

	planets.push({
		planet: planet,
		totalWidth: totalWidth,
    elements:elements,
    name: name,
    chance: chance,
    hasLife: hasLife,
    introed: false
	});


	var x = browserWidth/2 - totalWidth/2;
	var y = maxRadius*2*i + margin*(i+.5)  - .15*radius + (maxRadius-radius);
	var sunX = x - (maxRadius-radius) + (maxSunradius - sunRadius);
	var sunY =y+maxHaloOffset;
  	//ctx.drawImage(sunHalo, 0, 0, totalPlanetWidth, totalPlanetWidth, sunX, sunY, totalPlanetWidth/2, totalPlanetWidth/2);
  	ctx.drawImage(sun, 0, 0, Math.floor(sunRadius*2.4*2), Math.floor(sunRadius*2.4*2), sunX, sunY, sunRadius*2.4, sunRadius*2.4);

    //ctx.drawImage(planetHalo, 0, 0, totalPlanetWidth, totalPlanetWidth, x, y, totalPlanetWidth/2, totalPlanetWidth/2);
  	ctx.drawImage(planet, 0, 0, Math.floor(radius*2.4*2), Math.floor(radius*2.4*2), x, y, radius*2.4, radius*2.4);
  }


  updateUi();


}

var commaIt = function(value){
  value = value+"";
  var count=0;
  var returnValue= "";
  for(var i=value.length-1;i>=0;i--){
    count++;
    returnValue = value[i]+returnValue;
    if(count%3==0 && i>0){
      returnValue = ","+returnValue;
    }
  }
  return returnValue;
}

var drawStars = function(){
  var canvas = document.createElement('canvas');
  canvas.width = browserWidth;
  canvas.height = browserHeight;
  var ctx = canvas.getContext('2d');
	for(var i=0;i<browserWidth*browserHeight/100;i++){
	 	ctx.beginPath();
		ctx.arc(Math.random()*browserWidth, Math.random()*browserHeight, Math.random()*.5+.25, 0, 2 * Math.PI);
		//ctx.fillStyle = 'rgba(100,100,255,'+(Math.random()*.6+.2)+')';
    ctx.fillStyle = randColor([210, 280, 100, 100, 70, 100, 30, 60]);
		ctx.fill();
	}
	for(var i=0;i<browserWidth*browserHeight/500;i++){
	 	ctx.beginPath();
		ctx.arc(Math.random()*browserWidth, Math.random()*browserHeight, Math.random()*.5+.5, 0, 2 * Math.PI);
		ctx.fillStyle = 'rgba(122,122,255,'+(Math.random()*.25+.7)+')';
    ctx.fillStyle = randColor([210, 280, 100, 100, 90, 100, 50, 90]);
		ctx.fill();
	}
  return canvas;
}

var drawPlanet = function(i){
	ctx.clearRect(0,0,browserWidth,browserHeight);

	ctx.drawImage(stars, 0,0);

	var x = browserWidth/2 -planets[i].totalWidth; 
	var y = 350;
	//ctx.drawImage(planets[i].halo, x, y);
  ctx.drawImage(planets[i].planet, x, y);



  ctx.fillStyle = "white";

  var nameSize = 24;
  ctx.font = "bold 20px Helvetica, Arial";
  while(ctx.measureText(planets[i].name).width<browserWidth - 30 && nameSize < 120){
    nameSize++;
    ctx.font = 'bold '+nameSize+'px Helvetica, Arial';
  };

  ctx.textBaseline = "bottom";
  ctx.textAlign = "center";
  ctx.fillText(planets[i].name, browserWidth/2,y+5);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  var introText = '<h3>Welcome to '+planets[i].name+'</h3>';
  var elements = ['earth', 'fire', 'water', 'air'];
  for(var j=0;j<4;j++){
    for(var k=planets[i].elements[j];k>=0;k--){
      introText+='<div class="'+elements[j]+'"></div>';
    }
    introText+='<br>';
  }

  introText += "<h3>Estimated habitability: "+ (Math.floor(planets[i].chance*10000)/100)+"%</h3>";
  if(planets[i].hasLife){
    introText += planets[i].name+' harbors life!';

    var alienTypes = [
      'insect',
      'humanoid',
      'reptile',
      'crow',
      'squid',
      'cow',
      'spider',
      'bear',
      'worm',
      'duck',
      'fungus',
      'coyote',
      'goat'
    ];

    var alienAppendages = [
      'arms',
      'legs',
      'eyes',
      'tentacles',
      'antennae',
      'wings',
      'horns',
      'tails',
      'fins',
      'claws',
      'spikes'
    ];

    var alienLanguages = [
      'emojis',
      'clicks',
      'beeps and boops',
      'awkward silences',
      'brow furrowing',
      'whistling',
      'secret handshakes',
      'clapping',
      'winks',
      'high fives',
      'telepathy',
      'song',
      'poetry'
    ];

    shuffleArray(alienTypes);
    shuffleArray(alienAppendages);
    shuffleArray(alienLanguages);

    introText += " The dominant species is some sort of " +
      alienTypes[0]+'/'+alienTypes[1] + " with "+rand(2,12)+" "+alienAppendages[0]+
      " that appears to communicate solely through "+alienLanguages[0]+".";

    if(Math.random()>.666){
      fuel++;
      introText += '<br><br>You found some fuel deposits. Without the technology to mine it, the locals surely won\'t mind. ';
    }
  }else{
    introText += 'Sorry. There are no intelligent life-forms here.';

    if(Math.random()>.666){
      fuel++;
      introText += '<br><br>At least you found some fuel deposits.';
    }
  }

  if(!planets[i].introed){
    planets[i].introed = true;
    showText(introText);
  }
}

//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var rand = function(min, max){
	return Math.floor(Math.random()*(max-min+1))+min;
}

var showText = function(txt){
  textContainer.style.display = "block";
  textContainer.scrollTop = 0;
  textInner.innerHTML =txt;
}

var hideText = function(){
  textContainer.style.display = "none";
}

})()