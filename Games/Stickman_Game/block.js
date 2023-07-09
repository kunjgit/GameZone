function drawObstacles(){
  //ctx.fillStyle = "#A76F6F";     // these cases are the levels of the game
  switch(level){
    case 1:

      obstacles = {

        A1B: ["ctx.fillRect(","243,","567,","2100,","20)"],
        A2B: ["ctx.fillRect(","103,","656,","33,","33)"],
        A3B: ["ctx.fillRect(","124,","647,","50,","41)"],
        A4B: ["ctx.fillRect(","147,","638,","40,","49)"],
        A5B: ["ctx.fillRect(","166,","625,","79,","62)"],
        A6B: ["ctx.fillRect(","73,","674,","171,","36)"],
        A7B: ["ctx.fillRect(","1380,","495,","156,","78)"],
        A8B: ["ctx.fillRect(","10,","157,","438,","28)"],
        A9B: ["ctx.fillRect(","0,","700,","80,","50)"],
        A10B: ["ctx.fillRect(","596,","458,","50,","110)"]

      }

      if(spawned==0){  // stops the enemies from being spawned over and over
        spawnEnemy('1',120,38,null,false);
        spawnEnemy('1',547,600,1300,false);
        spawnEnemy('1',500,700,1000,false);
        spawned = 1;
      }
      if (level===1){
        ctx.font = "100px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL 1", canvas.width/2, 100);
      }

      break;
    case 2:
      obstacles = {
        A1B: ["ctx.fillRect(","100,","canvas.height-105,","800,","85)"],
        A2B: ["ctx.fillRect(","800,","canvas.height-145,","30,","125)"],
        A3B: ["ctx.fillRect(","850,","canvas.height-200,","55,","45)"],
        A7B: ["ctx.fillRect(","1050,","canvas.height-300,","55,","45)"],
        A8B: ["ctx.fillRect(","1200,","canvas.height-350,","55,","45)"],

        A4B: ["ctx.fillRect(","370,","canvas.height-240,","50,","135)"],
        A6B: ["ctx.fillRect(","270,","canvas.height-190,","50,","125)"],
        A5B:  ["ctx.fillRect(","950,","canvas.height-250,","55,","45)"]
      }
      if(spawned==0){
        spawnEnemy(3,canvas.height-105-12,450,778);
        spawnEnemy(3,canvas.height-105-12,600,778);
        spawnEnemy(1,canvas.height-34,1000,canvas.width-50);
        spawnEnemy(1,canvas.height-34,900,canvas.width-50);
        spawnEnemy(1,canvas.height-34,1200,canvas.width-50);
        spawned=1;
      }
      if (level===2){
        ctx.font = "100px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL 2", canvas.width/2, 100);
      }
      break;
    case 3:
      obstacles = {
        A1B: ["ctx.fillRect(","100,","canvas.height-105,","100,","85)"],
        A2B: ["ctx.fillRect(","200,","canvas.height-165,","900,","145)"],
        A3B: ["ctx.fillRect(","250,","canvas.height-240,","55,","45)"],
        A7B: ["ctx.fillRect(","750,","canvas.height-280,","55,","45)"],
        A8B: ["ctx.fillRect(","850,","canvas.height-320,","55,","45)"],

        A4B: ["ctx.fillRect(","470,","canvas.height-455,","20,","155)"],
        A10B: ["ctx.fillRect(","1270,","canvas.height-655,","20,","500)"],

        A6B: ["ctx.fillRect(","970,","canvas.height-400,","20,","155)"],
        A9B: ["ctx.fillRect(","1070,","canvas.height-400,","200,","40)"],

        A5B:  ["ctx.fillRect(","600,","canvas.height-98,","55,","45)"]
      }
      if(spawned==0){
        spawnEnemy(3,canvas.height-165-12,325,490);
        spawnEnemy(2,canvas.height-165-12,490,700);
        spawnEnemy(2,canvas.height-165-12,700,900);


        spawnEnemy(4,canvas.height-34,670,canvas.width-15);
        spawned=1;
      }
      if (level===3){
        ctx.font = "100px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL 3", canvas.width/2, 100);
      }
      break;
    case 4:
      obstacles = {
        A1B: ["ctx.fillRect(","53,","650,","53,","47)"],
        A2B: ["ctx.fillRect(","105,","620,","51,","54)"],
        A3B: ["ctx.fillRect(","165,","570,","50,","91)"],
        // A4B: ["ctx.fillRect(","579,","310,","28,","19)"],
        // A5B: ["ctx.fillRect(","606,","263,","32,","24)"],
        A6B: ["ctx.fillRect(","237,","471,","54,","129)"],
        A7B: ["ctx.fillRect(","297,","369,","554,","53)"],
        A8B: ["ctx.fillRect(","1024,","180,","50,","396)"],
        A9B: ["ctx.fillRect(","375,","323,","50,","48)"],
        A10B: ["ctx.fillRect(","0,","142,","782,","49)"],
        A11B: ["ctx.fillRect(","545,","556,","519,","25)"]
      }
      if(spawned==0){
        spawnEnemy('1',332,310,367,false);
        spawnEnemy('3',646,445,1340,false);
        spawnEnemy('4',546,700,1340,false);

        spawnEnemy('3',292,401,401,false);
        spawnEnemy('1',120,78,null,false);

        spawned=1;
      }
      if (level===4){
        ctx.font = "100px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL 4", canvas.width/2, 100);
      }
      break;
    case 5:
      obstacles = {
        A1B: ["ctx.fillRect(","52,","680,","355,","37)"],
        A2B: ["ctx.fillRect(","197,","593,","50,","88)"],
        A3B: ["ctx.fillRect(","247,","538,","50,","50)"],
        A4B: ["ctx.fillRect(","347,","340,","190,","104)"],
        A5B: ["ctx.fillRect(","1252,","118,","50,","450)"],
        A6B: ["ctx.fillRect(","0,","430,","177,","29)"],
        A7B: ["ctx.fillRect(","347,","340,","670,","22)"],
        A9B: ["ctx.fillRect(","0,","177,","670,","22)"],
        A8B: ["ctx.fillRect(","260,","342,","70,","29)"],
        //A9B: ["ctx.fillRect(","89,","189,","50,","87)"],
        // A10B: ["ctx.fillRect(","0,","125,","90,","137)"],
        A11B: ["ctx.fillRect(","297,","538,","50,","50)"],
        A12B: ["ctx.fillRect(","297,","488,","50,","50)"],
        A13B: ["ctx.fillRect(","428,","418,","50,","26)"],
        // A14B: ["ctx.fillRect(","461,","484,","50,","26)"],
        // A15B: ["ctx.fillRect(","528,","537,","50,","65)"],
        A16B: ["ctx.fillRect(","587,","518,","673,","50)"]
      }
      if(spawned==0){
        spawnEnemy('3',496,531,1000,false);
        spawnEnemy('2',310,255,443,false);
        spawnEnemy('3',229,158,158,false);
        spawnEnemy('2',521,712,null,false);
        spawnEnemy('1',71,347,867,false);
        spawnEnemy('2',78,357,867,false);
        spawnEnemy('3',510,585,1200,false);
        spawned=1;
      }
      if (level===5){
        ctx.font = "100px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL 5", canvas.width/2, 100);
      }
      break;
    // case 6:
    //   obstacles = {
    //     A1B: ["ctx.fillRect(","10,","223,","259,","22)"],
    //     A2B: ["ctx.fillRect(", "340,", "10,", "19,", "193)"],
    //     A3B: ["ctx.fillRect(","11,","385,","414,","20)"],
    //     A4B: ["ctx.fillRect(","390,","350,","35,","36)"],
    //     A5B: ["ctx.fillRect(","424,","316,","58,","89)"],
    //     A6B: ["ctx.fillRect(","521,","211,","285,","21)"],
    //     A7B: ["ctx.fillRect(","573,","231,","31,","172)"],
    //     A8B: ["ctx.fillRect(","10,","551,","599,","28)"],
    //     //A9B: ["ctx.fillRect(","69,","503,","50,","50)"],
    //     A10B: ["ctx.fillRect(","607,","551,","95,","28)"],
    //     A11B: ["ctx.fillRect(","665,","476,","36,","79)"],
    //     A12B: ["ctx.fillRect(","700,","432,","105,","147)"],
    //     A13B: ["ctx.fillRect(","732,","485,","50,","50)"]
    //   }
    //   if(spawned==0){
    //     spawnEnemy('4',224,377,511,false);
    //     spawnEnemy('2',166,780,null,false);
    //     spawnEnemy('1',396,710,780,false);
    //     spawnEnemy('1',343,37,360,false);
    //     spawnEnemy('1',349,222,360,false);
    //     spawnEnemy('3',466,98,617,false);
    //     spawned=1;
    //   }
    //   break;
    case 6:
    if (level===6){

      ctx.font = "100px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Winner winner 🏆🏆", canvas.width/2, canvas.height/2);
    }

     break;


    default:
      level = 1;
      setTimeout(function(){calc = 0;},1); // needs to be on time out or the hitboxes didn't update
      break;
  }
  if(drawed==0){    // creates new function only once per level, then the function is called repeatedly
    string = "";
    if (level!==6){
      for(var i in obstacles){
        eval("obs = obstacles."+i);
        for(var j in obs){
          string += obs[j];
        }
        string += ";";
      }
    }
    // for(var i in obstacles){
    //   eval("obs = obstacles."+i);
    //   for(var j in obs){
    //     string += obs[j];
    //   }
    //   string += ";";
    // }
    draw = new Function(string);
    drawed=0;
  }
  draw();
}
