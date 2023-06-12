// JS 13k 2019 entry

// Game state
var gs={
  // Animation frame of reference
  step:(1/60), // target step time @ 60 fps
  acc:0, // accumulated time since last frame
  lasttime:0, // time of last frame

  // Control state
  gamepad:-1,
  gamepadbuttons:[], // Button mapping
  gamepadaxes:[], // Axes mapping
  gamepadaxesval:[], // Axes values

  // SVG interface
  svg:new svg3d(),

  // Active 3D models
  activemodels:[],
  terrain:{},

  // Characters
  player:{id:null, keystate:0, padstate:0}, // input bitfield [action][down][right][up][left]
  thiskey:0,
  lastkey:0,
  clientx:0,
  clienty:0,
  clientdx:0,
  clientdy:0,
  leanx:0,
  leany:0,
  leanz:0,
  shottimeout:0,
  shots:[],
  npcs:[],
  score:0,

  level:1,
  newlevel:0,
  blastradius:500,
  infecttimeout:(5*60),
  infectradius:150,

  randoms:new randomizer(3,6,6,4),
  timeline:new timelineobj(),
  state:0 // 0=intro, 1=title, 2=ingame 3=completed
};

function updateposition()
{
  var dbg="";

  dbg+="X:"+Math.floor(gs.svg.tranx)+" Y:"+Math.floor(gs.svg.trany)+" Z:"+Math.floor(gs.svg.tranz)+"<br/>";
  dbg+="RX:"+Math.floor(gs.svg.rotx)+" RY:"+Math.floor(gs.svg.roty)+" RZ:"+Math.floor(gs.svg.rotz)+"<br/>";
  dbg+="KEY:"+gs.player.keystate;
  if (gs.gamepad!=-1) dbg+=" PAD:"+gs.player.padstate;
  dbg+="<br/>INV "+gs.npcs.length;

  try
  {
    if (document.getElementById("debug")==null)
    {
      document.getElementById("wrapper").innerHTML+='<div id="debug" style="position:absolute; top:0px; left:0px; color:white;"></div>';
    }

    document.getElementById("debug").innerHTML=dbg;
  }

  catch (e) {}
}

// Clear both keyboard and gamepad input state
function clearinputstate(character)
{
  character.keystate=0;
  character.padstate=0;
}

// Check if an input is set in either keyboard or gamepad input state
function ispressed(character, keybit)
{
  return (((character.keystate&keybit)!=0) || ((character.padstate&keybit)!=0));
}

// Update the position of players/enemies
function updatemovements(character)
{
  // Move player when a key is pressed
  if ((character.keystate!=0) || (character.padstate!=0))
  {
    var val=0;

    // Left key
    if ((ispressed(character, 1)) && (!ispressed(character, 4)))
    {
      if ((character.padstate&1)!=0)
        val=gs.gamepadaxesval[0];
      else
        val=-1;

      // Yaw - Turn L/R
      gs.svg.roty+=val*2;
      gs.leanx=-val*50;
      gs.leany=-val*50;
    }

    // Right key
    if ((ispressed(character, 4)) && (!ispressed(character, 1)))
    {
      if ((character.padstate&4)!=0)
        val=gs.gamepadaxesval[0];
      else
        val=1;

      // Yaw - Turn L/R
      gs.svg.roty+=val*2;
      gs.leanx=-val*50;
      gs.leany=-val*50;
    }

    // Up key
    if ((ispressed(character, 2)) && (!ispressed(character, 8)))
    {
      if ((character.padstate&2)!=0)
        val=gs.gamepadaxesval[1];
      else
        val=-1;

      // Pitch - F/B
      gs.svg.tranx+=(val*36)*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz+=(val*36)*Math.cos(gs.svg.roty*PIOVER180);
    }
    else
    {
      gs.svg.tranx-=15*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz-=15*Math.cos(gs.svg.roty*PIOVER180);
    }

    // Down key
    if ((ispressed(character, 8)) && (!ispressed(character, 2)))
    {
      if ((character.padstate&8)!=0)
        val=gs.gamepadaxesval[1];
      else
        val=1;

      // Pitch - F/B
      gs.svg.tranx+=(val*24)*Math.sin(gs.svg.roty*PIOVER180);
      gs.svg.tranz+=(val*24)*Math.cos(gs.svg.roty*PIOVER180);
    }

/*
    // Collective Up/Down
    gs.svg.trany+=val*16;
*/

    // Prevent angle over/underflow
    if (gs.svg.rotx<0) gs.svg.rotx=360+gs.svg.rotx;
    if (gs.svg.roty<0) gs.svg.roty=360+gs.svg.roty;
    if (gs.svg.rotz<0) gs.svg.rotz=360+gs.svg.rotz;

    if (gs.svg.rotx>360) gs.svg.rotx-=360;
    if (gs.svg.roty>360) gs.svg.roty-=360;
    if (gs.svg.rotz>360) gs.svg.rotz-=360;

    // Action key
    if (ispressed(character, 16))
    {
      if ((gs.shottimeout==0) && (gs.shots.length<5))
      {
        var o=addnamedmodel("missile", -gs.svg.tranx, -gs.svg.trany, -gs.svg.tranz, gs.svg.rotx, gs.svg.roty, 0);

        gs.activemodels[o].vx=100*Math.sin(gs.activemodels[o].roty*PIOVER180);
        gs.activemodels[o].vz=100*Math.cos(gs.activemodels[o].roty*PIOVER180);
        gs.activemodels[o].decay=(3*60);
        gs.shots.push(gs.activemodels[o].id);

        audio_fire();

        gs.shottimeout=(0.5*60);
      }
    }
  }
  else
  {
    // Continue forwards if nothing pressed
    gs.svg.tranx-=15*Math.sin(gs.svg.roty*PIOVER180);
    gs.svg.tranz-=15*Math.cos(gs.svg.roty*PIOVER180);
  }

  // Roll - Sidestep / Strafe L/R
  if (gs.clientdx!=gs.clientx)
  {
    val=gs.clientdx-gs.clientx;

    gs.svg.tranx+=val*Math.sin((gs.svg.roty+90)*PIOVER180);
    gs.svg.tranz+=val*Math.cos((gs.svg.roty+90)*PIOVER180);

    // Update cache
    gs.clientdx=gs.clientx;
    gs.clientdx=gs.clientx;
  }

  // Do a dampened lean return
  if (gs.leanx>0) gs.leanx-=gs.leanx>2?2:1;
  if (gs.leanx<0) gs.leanx+=gs.leanx<-2?2:1;

  if (gs.leany>0) gs.leany-=gs.leany>2?2:1;
  if (gs.leany<0) gs.leany+=gs.leany<-2?2:1;

  // Rotate new level to flat
  if (gs.svg.rotz>20) gs.svg.rotz-=0.25;
}

function angle2d(x1, y1, x2, y2)
{
  var result=(Math.atan2(y2-y1,x2-x1)*(180/Math.PI));

  return result;
}

// Distance between 2 [x,y,z] points
function distance3d(x1, y1, z1, x2, y2, z2)
{
  return (
    Math.sqrt(
      Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) + Math.pow(z2-z1, 2)
    )
  );
}

// Roughly see if two points have overlap
function overlap3d(x1, y1, z1, x2, y2, z2, overlap)
{
  var dx=Math.abs(Math.max(x1, x2)-Math.min(x1, x2));
  var dy=Math.abs(Math.max(y1, y2)-Math.min(y1, y2));
  var dz=Math.abs(Math.max(z1, z2)-Math.min(z1, z2));

  return ((dx<overlap) && (dy<overlap) && (dz<overlap));
}

// Find a model with matching id
function findmodelbyid(id)
{
  for (var i=0; i<gs.activemodels.length; i++)
  {
    if (gs.activemodels[i].id==id)
      return i;
  }

  return -1;
}

// Switch model colours
function swapcolours(modelid, source, target)
{
  try
  {
    if (modelid==-1) return;

    for (var i=0; i<gs.activemodels[modelid].c.length; i++)
      if (gs.activemodels[modelid].c[i]==source)
        gs.activemodels[modelid].c[i]=target;
  }

  catch (e) {}
}

// Check infection status flag
function infectedstatus(flag)
{
  var counter=0;

  for (var i=0; i<gs.npcs.length; i++)
  {
    var npc=findmodelbyid(gs.npcs[i]);
    if (npc==-1) continue;

    if (gs.activemodels[npc].flags==flag)
      counter++;
  }

  return counter;
}

// Remove all NPCs
function removenpcs()
{
  for (var i=0; i<gs.npcs.length; i++)
  {
    var npc=findmodelbyid(gs.npcs[i]);
    if (npc!=-1)
      gs.activemodels.splice(npc, 1);
  }

  // Wipe NPC array
  gs.npcs=[];
}

// Remove all models
function removeallmodels()
{
  removenpcs();
  gs.activemodels=[];
}

// Determine if level completed
function levelcompleted()
{
  return ((infectedstatus(1)==0) || (gs.npcs.length==0));
}

function showinfection()
{
  var info="";
  var infected=infectedstatus(1);
  var ok=infectedstatus(0);
  var total=infected+ok;

  info+='<rect x="1200" y="100" width="50" height="300" rx="15" fill="black" fill-opacity="0" stroke="rgb(255,215,0)" stroke-width="4"/>';

  // Infected
  info+='<rect x="1210" y="110" width="30" height="'+((infected/total)*280)+'" rx="5" fill="red" stroke="none" />';

  // Disinfected
  info+='<rect x="1210" y="'+(110+((infected/total)*280))+'" width="30" height="'+((ok/total)*280)+'" rx="5" fill="green" stroke="none" />';

  gs.svg.svghud.innerHTML+=info;
}

// Update the HUD
function updatehud()
{
  clear(gs.svg.svghud);

  switch (gs.state)
  {
    case 1:
      writeseg(gs.svg.svghud, 180, 200, "BACKSPACE", "gold", 2);
      writeseg(gs.svg.svghud, 180, 300, "RETURN TO PLANET FIGADORE", "gold", 0.7);
      writeseg(gs.svg.svghud, 120, 700, "WASD/CURSORS/SPACE/ENTER/GAMEPAD TO PLAY", "gold", 0.5);
      break;

    case 2:
      writeseg(gs.svg.svghud, 1000, 50, "SCORE "+gs.score, "gold", 0.5);

      if (gs.newlevel==1)
        writeseg(gs.svg.svghud, 300, 300, "LEVEL "+gs.level, "gold", 2);

      // Percentage infected
      showinfection();
      break;

    case 3:
      if (infectedstatus(1)==0)
      {
        writeseg(gs.svg.svghud, 100, 340, "YOU'VE DONE IT", "gold", 1.5);
        writeseg(gs.svg.svghud, 185, 480, "PLANET FIGADORE IS SAVED", "gold", 0.7);
      }
      else
      {
        writeseg(gs.svg.svghud, 350, 340, "FAILED", "red", 2);
        writeseg(gs.svg.svghud, 140, 480, "TO DISINFECT PLANET FIGADORE", "red", 0.7);
        writeseg(gs.svg.svghud, 200, 700, "PRESS FIRE TO GO BACK AND TRY AGAIN", "gold", 0.5);
      }
      break;

    default:
      break;
  }
}

function addnpcs(count)
{
  // Remove NPCs from previous level
  removenpcs();

  // Add some new invaders
  for (var n=0; n<count; n++)
  {
    var o=addnamedmodel("invader", gs.randoms.rnd(10000)-5000, 800, 0-gs.randoms.rnd(10000), 0, gs.randoms.rnd(360), 0);

    // Swap first half to red and mark as infected
    if (n<(count/2))
    {
      swapcolours(o, 0, 1);
      gs.activemodels[o].flags=1;
    }

    gs.npcs.push(gs.activemodels[o].id);

    gs.activemodels[o].vx=25*Math.sin(gs.activemodels[o].roty*PIOVER180);
    gs.activemodels[o].vz=-25*Math.cos(gs.activemodels[o].roty*PIOVER180);
  }
}

// Update the game world state
function update()
{
  if (gs.state!=2) return;

  if (levelcompleted())
  {
    gs.level++;
    if (gs.level==6)
    {
      gs.state=3;
      gs.level=1;
      gs.lastkey=0; gs.thiskey=0;

      updatehud();

      removeallmodels();

      // Start a timeout before allowing keys
      gs.timeline.reset();
      gs.timeline.add(1000, function(){ window.requestAnimationFrame(awaitkeyboard); });
      gs.timeline.begin();

      return;
    }
    else
    {
      gs.newlevel=1;

      // World rotation in degrees
      gs.svg.rotx=0;
      gs.svg.roty=180;
      gs.svg.rotz=45;

      // World translation in pixels
      gs.svg.tranx=0;
      gs.svg.trany=-600;
      gs.svg.tranz=5000;

      gs.timeline.reset();
      gs.timeline.add(2000, function(){ gs.newlevel=0; });
      gs.timeline.begin();
    }

    gs.blastradius=500-(gs.level*50);
    gs.infecttimeout=(5*60);
    gs.svg.rotz=45;

    // Play audio to signify change of level
    audio_collect();

    // Add invaders
    addnpcs(5*gs.level);

    return;
  }

  // Infection timeout
  if (gs.infecttimeout>0)
    gs.infecttimeout--;

  // Weapon timeouts
  if (gs.shottimeout>0)
    gs.shottimeout--;

  for (var h=0; h<gs.shots.length; h++)
  {
    var shotid=findmodelbyid(gs.shots[h]);
    if (shotid==-1) continue;

    gs.activemodels[shotid].decay--;
    if (gs.activemodels[shotid].decay<=0)
    {
      gs.activemodels.splice(shotid, 1);
      gs.shots.splice(h, 1);
      break;
    }
  }

  // Invader <-> Invader hit detection
  if ((gs.npcs.length>0) && (gs.infecttimeout==0))
  {
    for (var i=0; i<gs.npcs.length; i++)
    {
      var npcid=findmodelbyid(gs.npcs[i]);
      if (npcid==-1) continue;

      for (var j=0; j<gs.npcs.length; j++)
      {
        var npcid2=findmodelbyid(gs.npcs[j]);
        if (npcid2==-1) continue;

        var nme=gs.activemodels[npcid];
        var nme2=gs.activemodels[npcid2];

        // If first infected and second not then see if they are within infection radius
        if ((nme.flags==1) && (nme2.flags==0))
        {
          if (overlap3d(nme.x, nme.y, nme.z, nme2.x, nme2.y, nme2.z, gs.infectradius))
          {
            // Swap grey to red
            swapcolours(npcid2, 0, 1);

            // Mark second as threat
            gs.activemodels[npcid2].flags=1;

            // See if this was the last one to be infected
            if (infectedstatus(1)==gs.npcs.length)
            {
              // Level failed
              audio_failed();

              gs.state=3;
              gs.level=1;
              gs.lastkey=0; gs.thiskey=0;

              updatehud();

              removeallmodels();

              gs.timeline.reset();
              gs.timeline.add(1000, function(){ window.requestAnimationFrame(awaitkeyboard); });
              gs.timeline.begin();

              return;
            }
            else
            {
              // Sound the infection
              audio_alien();
            }
          }
        }
        else
        if ((nme.flags==0) && (nme2.flags==1)) // Clear sees infected
        {
          // If infected within range of clear, take evasive action
          if (overlap3d(nme.x, nme.y, nme.z, nme2.x, nme2.y, nme2.z, gs.infectradius*2.5))
          {
            var angle=gs.activemodels[npcid].roty;

            // Slow npc down momentarily
            gs.activemodels[npcid].vx=5*Math.sin(angle*PIOVER180);
            gs.activemodels[npcid].vz=-5*Math.cos(angle*PIOVER180);
          }
        }
      }
    }
  }

  // Weapon <-> Invader hit detection
  for (var g=0; g<gs.shots.length; g++)
  {
    var shotid=findmodelbyid(gs.shots[g]);
    if (shotid==-1) continue;
    gs.activemodels[shotid].roty=gs.lasttime%360;

    for (var i=0; i<gs.npcs.length; i++)
    {
      var npcid=findmodelbyid(gs.npcs[i]);
      if (npcid==-1) continue;

      var shot=gs.activemodels[shotid];
      var nme=gs.activemodels[npcid];

      if ((nme.flags==1) && (overlap3d(shot.x, shot.y, shot.z, nme.x, nme.y, nme.z, gs.blastradius)))
      {
        // Remove shot
        gs.activemodels.splice(shotid, 1);
        gs.shots.splice(g, 1);

        // Remove npc
//        gs.activemodels.splice(npcid, 1);
//        gs.npcs.splice(i, 1);

        // Swap red back to grey
        swapcolours(npcid, 1, 0);

        // Sound the de-infection
        if (gs.activemodels[npcid].flags==1)
          audio_deinfect();

        // Mark as non-threat
        gs.activemodels[npcid].flags=0;

        gs.score++;

        shotid=-1;
        break;
      }
    }

    if (shotid==-1) break;
  }

  // Apply keystate to player
  updatemovements(gs.player);

  // If player out of bounds, then reset
  if ((gs.svg.tranx<-5000) ||
   (gs.svg.tranx>5000) ||
   (gs.svg.tranz<0) ||
   (gs.svg.tranz>10000))
  {
    gs.svg.tranx=0;
    gs.svg.tranz=5000;
  }

  // Keep player in view
  gs.activemodels[gs.player.id].x=-gs.svg.tranx;
  gs.activemodels[gs.player.id].y=-gs.svg.trany;
  gs.activemodels[gs.player.id].z=-gs.svg.tranz;

  gs.activemodels[gs.player.id].rotx=-gs.svg.rotx;
  gs.activemodels[gs.player.id].roty=-gs.svg.roty;
  gs.activemodels[gs.player.id].rotz=0;

  // Update player angle
  gs.activemodels[gs.player.id].rotx+=gs.leanx;
  gs.activemodels[gs.player.id].roty+=gs.leany;
  gs.activemodels[gs.player.id].rotz+=gs.leanz;

//  updateposition();

  // Move object by velocity (if required)
  gs.activemodels.forEach(function (item, index) {
    item.x+=item.vx;
    item.y+=item.vy;
    item.z+=item.vz;
  });

  // Move enemies around
  for (var i=0; i<gs.npcs.length; i++)
  {
    var npcid=findmodelbyid(gs.npcs[i]);
    if (npcid==-1) continue;
    var angle=gs.activemodels[npcid].roty;

    // Change direction sometimes
    if (gs.randoms.rnd(250)<10)
    {
      // Randomize a new angle
      angle=(gs.activemodels[npcid].roty+(gs.randoms.rnd(50)-25))%360;
      gs.activemodels[npcid].roty=angle;

      // Set new movement vector
      gs.activemodels[npcid].vx=25*Math.sin(angle*PIOVER180);
      gs.activemodels[npcid].vz=-25*Math.cos(angle*PIOVER180);
    }

    // If out of bounds, then set on a new random course
    if ((gs.activemodels[npcid].x<-5000) ||
       (gs.activemodels[npcid].z<-10000) ||
       (gs.activemodels[npcid].x>5000) ||
       (gs.activemodels[npcid].z>0))
    {
      // Randomize a new angle
      angle=(gs.activemodels[npcid].roty+180+gs.randoms.rnd(45))%360;
      gs.activemodels[npcid].roty=angle;

      // Set new movement vector
      gs.activemodels[npcid].vx=25*Math.sin(angle*PIOVER180);
      gs.activemodels[npcid].vz=-25*Math.cos(angle*PIOVER180);

      // Move enemy away from boundary
      gs.activemodels[npcid].x+=gs.activemodels[npcid].vx;
      gs.activemodels[npcid].z+=gs.activemodels[npcid].vz;
    }
  }

  updatehud();
}

// Request animation frame callback
function rafcallback(timestamp)
{
  // First time round, just save epoch
  if (gs.lasttime>0)
  {
    // Determine accumulated time since last call
    gs.acc+=((timestamp-gs.lasttime) / 1000);

    // If it's more than 15 seconds since last call, reset
    if ((gs.acc>gs.step) && ((gs.acc/gs.step)>(60*15)))
      gs.acc=gs.step*2;

    var progress=timestamp/100;

    // Gamepad support
    if (!!(navigator.getGamepads))
      gamepadscan();

    // Process "steps" since last call
    while (gs.acc>gs.step)
    {
      update();
      gs.acc-=gs.step;
    }

    // Render the game world
    gs.svg.render(progress);
  }

  // Remember when we were last called
  gs.lasttime=timestamp;

  // Request we are called on the next frame if still playing
  if (gs.state==2)
    window.requestAnimationFrame(rafcallback);
}

// Handle resize events
function playfieldsize()
{
  gs.svg.resize();
}

function generateterrain(gridx, gridy, gridsize)
{
  var terrain={t:"terrain", w:gridx, d:gridy, tilesize:gridsize, heightmap:[], v:[], f:[], c:[], s:10, x:0, y:0, z:0};
  var maxheight=32;

  for (var y=0; y<gridy; y++)
    for (var x=0; x<gridx; x++)
    {
      if (x>0)
        terrain.heightmap[(y*gridx)+x]=terrain.heightmap[(y*gridx)+(x-1)]+(gs.randoms.rnd(maxheight/2)-(maxheight/4));
      else
        terrain.heightmap[(y*gridx)+x]=gs.randoms.rnd(maxheight);

      terrain.v.push([x*gridsize-((gridx*gridsize)/2), (terrain.heightmap[(y*gridx)+x]), 0-(y*gridsize)]);
    }

  for (y=1; y<gridy; y++)
    for (x=1; x<gridx; x++)
    {
      var offs=((y*gridx)+x)+1;

      terrain.f.push([
      offs,
      offs-1,
      offs-gridy-1
      ]);

      terrain.c.push(2);

      terrain.f.push([
      offs,
      offs-gridy-1,
      offs-gridy
      ]);

      terrain.c.push(2);
    }

  return terrain;
}

// Scan for any connected gamepads
function gamepadscan()
{
  var gamepads=navigator.getGamepads();
  var found=0;

  var gleft=false;
  var gright=false;
  var gup=false;
  var gdown=false;
  var gjump=false;

  for (var padid=0; padid<gamepads.length; padid++)
  {
    // Only support first found gamepad
    if ((found==0) && (gamepads[padid] && gamepads[padid].connected))
    {
      found++;

      // If we don't already have this one, add mapping for it
      if (gs.gamepad!=padid)
      {
//        console.log("Found new gamepad "+padid+" '"+gamepads[padid].id+"'");

        gs.gamepad=padid;

        if (gamepads[padid].mapping==="standard")
        {
	  // Browser supported "standard" gamepad
          gs.gamepadbuttons[0]=14; // left (left) d-left
          gs.gamepadbuttons[1]=15; // right (left) d-right
          gs.gamepadbuttons[2]=12; // top (left) d-up
          gs.gamepadbuttons[3]=13; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="054c-0268-Sony PLAYSTATION(R)3 Controller")
        {
          // PS3 DualShock 3
          gs.gamepadbuttons[0]=15; // left (left) d-left
          gs.gamepadbuttons[1]=16; // right (left) d-right
          gs.gamepadbuttons[2]=13; // top (left) d-up
          gs.gamepadbuttons[3]=14; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="045e-028e-Microsoft X-Box 360 pad")
        {
          // XBOX 360
          // 8Bitdo GBros. Adapter (XInput mode)
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=6; // left/right axis
          gs.gamepadaxes[1]=7; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="0f0d-00c1-  Switch Controller")
        {
          // Nintendo Switch
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=1;  // bottom button (right) x

          gs.gamepadaxes[0]=4; // left/right axis
          gs.gamepadaxes[1]=5; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        if ((gamepads[padid].id=="054c-05c4-Sony Computer Entertainment Wireless Controller") || (gamepads[padid].id=="045e-02e0-8Bitdo SF30 Pro") || (gamepads[padid].id=="045e-02e0-8BitDo GBros Adapter"))
        {
          // PS4 DualShock 4
          // 8Bitdo SF30 Pro GamePad (XInput mode)
          // 8Bitdo GBros. Adapter (XInput mode)
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=3; // cam left/right axis
          gs.gamepadaxes[3]=4; // cam up/down axis
        }
        else
        if ((gamepads[padid].id=="054c-0ce6-Sony Interactive Entertainment Wireless Controller") || (gamepads[padid].id=="054c-0ce6-Wireless Controller"))
        {
          // PS5 DualSense
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=1;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=5; // cam up/down axis
        }
        else
        if ((gamepads[padid].id=="057e-2009-Pro Controller") || (gamepads[padid].id=="18d1-9400-Google Inc. Stadia Controller") || (gamepads[padid].id=="18d1-9400-Google LLC Stadia Controller rev. A") || (gamepads[padid].id.match("/^18d1-9400-Stadia/i")))
        {
          // Nintendo Switch Pro Controller
          // 8Bitdo SF30 Pro GamePad (Switch mode)
          // 8Bitdo GBros. Adapter (Switch mode)
          // Google Stadia Controller (Wired and Bluetooth)
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=0;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        if (gamepads[padid].id=="2dc8-6100-8Bitdo SF30 Pro")
        {
          // 8Bitdo SF30 Pro GamePad (DInput mode)
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=1;  // bottom button (right) x

          gs.gamepadaxes[0]=0; // left/right axis
          gs.gamepadaxes[1]=1; // up/down axis
          gs.gamepadaxes[2]=2; // cam left/right axis
          gs.gamepadaxes[3]=3; // cam up/down axis
        }
        else
        {
          // Unknown non-"standard" mapping
          gs.gamepadbuttons[0]=-1; // left (left) d-left
          gs.gamepadbuttons[1]=-1; // right (left) d-right
          gs.gamepadbuttons[2]=-1; // top (left) d-up
          gs.gamepadbuttons[3]=-1; // bottom (left) d-down
          gs.gamepadbuttons[4]=-1;  // bottom button (right) x

          gs.gamepadaxes[0]=-1; // left/right axis
          gs.gamepadaxes[1]=-1; // up/down axis
          gs.gamepadaxes[2]=-1; // cam left/right axis
          gs.gamepadaxes[3]=-1; // cam up/down axis
        }
      }

      // Check analog axes
      for (var i=0; i<gamepads[padid].axes.length; i++)
      {
        var val=gamepads[padid].axes[i];

        if (i==gs.gamepadaxes[0])
        {
          gs.gamepadaxesval[0]=val;

          if (val<-0.5) // Left
            gleft=true;

          if (val>0.5) // Right
            gright=true;
        }

        if (i==gs.gamepadaxes[1])
        {
          gs.gamepadaxesval[1]=val;

          if (val<-0.5) // Up
            gup=true;

          if (val>0.5) // Down
            gdown=true;
        }

        if (i==gs.gamepadaxes[2])
          gs.gamepadaxesval[2]=val;

        if (i==gs.gamepadaxes[3])
          gs.gamepadaxesval[3]=val;
      }

      // Check buttons
      for (i=0; i<gamepads[padid].buttons.length; i++)
      {
        var val=gamepads[padid].buttons[i];
        var pressed=val==1.0;

        if (typeof(val)=="object")
        {
          pressed=val.pressed;
          val=val.value;
        }

        if (pressed)
        {
          switch (i)
          {
            case gs.gamepadbuttons[0]: gleft=true; break;
            case gs.gamepadbuttons[1]: gright=true; break;
            case gs.gamepadbuttons[2]: gup=true; break;
            case gs.gamepadbuttons[3]: gdown=true; break;
            case gs.gamepadbuttons[4]: gjump=true; break;
            default: break;
          }
        }
      }

      // Update padstate
      if (gup)
        gs.player.padstate|=2;
      else
        gs.player.padstate&=~2;

      if (gdown)
        gs.player.padstate|=8;
      else
        gs.player.padstate&=~8;

      if (gleft)
        gs.player.padstate|=1;
      else
        gs.player.padstate&=~1;

      if (gright)
        gs.player.padstate|=4;
      else
        gs.player.padstate&=~4;

      if (gjump)
        gs.player.padstate|=16;
      else
        gs.player.padstate&=~16;
    }
  }

  // Detect disconnect
  if ((found==0) && (gs.gamepad!=-1))
  {
//    console.log("Disconnected gamepad "+padid);
    
    gs.gamepad=-1;
  }
}

// Deep clone an object
function clone(obj)
{
  return JSON.parse(JSON.stringify(obj));
}

// Generate a UUID v4 as per RFC 4122
function uuidv4()
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Add models to active models
function addmodel(model, x, y, z, rotx, roty, rotz)
{
  var obj=clone(model);

  obj.id=uuidv4();

  // Translation
  obj.x=x;
  obj.y=y;
  obj.z=z;

  // Rotation
  obj.rotx=rotx;
  obj.roty=roty;
  obj.rotz=rotz;

  // Velocity
  obj.vx=0;
  obj.vy=0;
  obj.vz=0;

  // Flags
  obj.flags=0;

  gs.activemodels.push(obj);

  return (gs.activemodels.length-1);
}

// Update the player key state
function updatekeystate(e, dir)
{
  switch (e.which)
  {
    case 37: // cursor left
    case 65: // A
    case 90: // Z
      if (dir==1)
        gs.player.keystate|=1;
      else
        gs.player.keystate&=~1;
      e.preventDefault();
      break;

    case 38: // cursor up
    case 87: // W
    case 59: // semicolon
      if (dir==1)
        gs.player.keystate|=2;
      else
        gs.player.keystate&=~2;
      e.preventDefault();
      break;

    case 39: // cursor right
    case 68: // D
    case 88: // X
      if (dir==1)
        gs.player.keystate|=4;
      else
        gs.player.keystate&=~4;
      e.preventDefault();
      break;

    case 40: // cursor down
    case 83: // S
    case 190: // dot
      if (dir==1)
        gs.player.keystate|=8;
      else
        gs.player.keystate&=~8;
      e.preventDefault();
      break;

    case 13: // enter
    case 32: // space
      if (dir==1)
        gs.player.keystate|=16;
      else
        gs.player.keystate&=~16;
      e.preventDefault();
      break;

    case 27: // escape
      e.preventDefault();
      break;

    default:
      break;
  }

  if (dir==1)
    gs.thiskey=e.which;
}

// Add a model by name
function addnamedmodel(name, x, y, z, rotx, roty, rotz)
{
  for (var i=0; i<models.length; i++)
    if (models[i].t==name)
      return addmodel(models[i], x, y, z, rotx, roty, rotz);
}

// Track mouse movement
function mousemovement(e)
{
  gs.clientx=e.clientX;
  gs.clienty=e.clientY;
}

function startgame()
{
  // World rotation in degrees
  gs.svg.rotx=0;
  gs.svg.roty=180;
  gs.svg.rotz=45;

  // World translation in pixels
  gs.svg.tranx=0;
  gs.svg.trany=-600;
  gs.svg.tranz=5000;

  gs.state=2;

  window.requestAnimationFrame(rafcallback);
}

function awaitkeyboard(timestamp)
{
  if (gs.state==1)
  {
    // Render the model
    gs.svg.render(timestamp/100);
    gs.activemodels[0].rotx=((gs.activemodels[0].rotx+2) % 360);
    gs.activemodels[0].roty=((gs.activemodels[0].roty+2) % 360);
    gs.activemodels[0].rotz=((gs.activemodels[0].rotz+1) % 360);
    if (gs.activemodels[0].s<150)
      gs.activemodels[0].s++;
  }

  // See if something newly pressed
  if (gs.thiskey!=gs.lastkey)
  {
    switch (gs.state)
    {
      case 1: // Title, so start game
        gs.timeline.reset();
        gs.score=0;
        gs.level=1;

        gs.lastkey=0;
        gs.thiskey=0;

        removeallmodels();

        // Generate terrain model
        var terrainx=10, terrainy=10;
        gs.terrain=generateterrain(terrainx, terrainy, 100);

        for (var y=0; y<terrainy; y++)
          for (var x=0; x<terrainx; x++)
          {
            if (gs.randoms.rnd(10)<5)
              addnamedmodel("tree",
                ((x-5)*gs.terrain.tilesize)*gs.terrain.s,
                (((4+gs.terrain.heightmap[(y*gs.terrain.w)+x])*gs.terrain.s)),
                0-(((y)*gs.terrain.tilesize)*gs.terrain.s),
                0,
                gs.randoms.rnd(90),
                0);
          }

        addnamedmodel("moon", 200, 900, -50000, 0, 0, 0);

        gs.player.id=addnamedmodel("starship", 0, 0, 0, 0, 0, 0);
        addnamedmodel("chipcube", 200, 200, -200, 10, 10, 10);
        addmodel(gs.terrain, 0, 0, 0, 0, 0, 0);
   
        // Add invaders
        addnpcs(5);

        startgame();
        break;

      case 2: // In-game, so already processed
        break;

      case 3: // SUCCESS/FAIL, so return to title
        showtitle();
        break;

      default:
        gs.lastkey=gs.thiskey;
        break;
    }
  }
  else
    window.requestAnimationFrame(awaitkeyboard);
}

function showtitle()
{
  gs.state=1;
  gs.lastkey=0; gs.thiskey=0;

  updatehud();

  removeallmodels();

  var o=addnamedmodel("invader", 0, 0, 0, 0, 0, 0);
  gs.activemodels[0].s=0.1;

  // World rotation in degrees
  gs.svg.rotx=0;
  gs.svg.roty=0;
  gs.svg.rotz=0;

  // World translation in pixels
  gs.svg.tranx=0;
  gs.svg.trany=0;
  gs.svg.tranz=0;

  gs.svg.render(0);

  // Start a timeout before allowing keys
  gs.timeline.reset();
  gs.timeline.add(1000, function(){ window.requestAnimationFrame(awaitkeyboard); });
  gs.timeline.begin();
}

// Entry point
function init()
{
  // Initialise stuff
  document.onkeydown=function(e)
  {
    e = e || window.event;
    updatekeystate(e, 1);
  };

  document.onkeyup=function(e)
  {
    e = e || window.event;
    updatekeystate(e, 0);
  };

  // Stop things from being dragged around
  window.ondragstart=function(e)
  {
    e = e || window.event;
    e.preventDefault();
  };

  // Set up game state
  gs.svg.init();

  window.addEventListener("resize", function() { playfieldsize(); });

  window.addEventListener("mousemove", function(e) { mousemovement(e); });

  playfieldsize();

  showtitle();
}

// Run the init() once page has loaded
window.onload=function() { init(); };
