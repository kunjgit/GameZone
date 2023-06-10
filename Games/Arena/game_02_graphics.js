(function(){



  Game.graphics = {};
  Game.graphics.canvas = document.getElementById(Game.config.canvas_id);
  Game.graphics.fps_counter = document.getElementById(Game.config.fps_counter_id);
  Game.graphics.context = Game.graphics.canvas.getContext('2d');
  Game.graphics.draw_list = [[],[],[]];
  Game.graphics.image = document.createElement('img');
  Game.graphics.image.src = 'sprites.png';
  Game.graphics.camera = {x:0,y:0};

  var image_loaded = false; 
  Game.graphics.draw = function(ctx){
    if (!image_loaded){if (Game.graphics.image.width){image_loaded = true;}}

    ctx.clearRect(0, 0, Game.graphics.canvas.width, Game.graphics.canvas.height);
    if (!Game.paused){
      
      //BACKGROUND
      for (var by = 0; by < 24; by++){
        for (var bx = 0; bx < 32; bx++){
          if (by == 0 || by == 23 || bx == 0 || bx == 31){
            ctx.drawImage(Game.graphics.image,0,93,56,56,bx*40-Game.graphics.camera.x,by*40-Game.graphics.camera.y,40,40);
          }else{
            ctx.drawImage(Game.graphics.image,420,0,40,40,bx*40-Game.graphics.camera.x,by*40-Game.graphics.camera.y,40,40);
          }
        }
      }
      var tX, tY, tR;
      Game.graphics.draw_list.map(function(dl){
        dl = dl.filter(function(t){
          if (!t.visible){return false;}
          ctx.save();
          tX = t.position.x-Game.graphics.camera.x;
          tY = t.position.y-Game.graphics.camera.y;
          tR = t.rotation.z+(t.offset.r * -1.570796327);
          ctx.translate(tX,tY);
          ctx.rotate(tR);
          ctx.translate(-tX,-tY);
          ctx.drawImage(Game.graphics.image,t.offset.x,t.offset.y,t.width,t.height,(t.position.x-(t.width/2))-Game.graphics.camera.x,(t.position.y-(t.height/2))-Game.graphics.camera.y,t.width,t.height);
          ctx.restore();
          return true;
        });
      });

      // BOMB:
      (function(B){
        if (B.active){
          ctx.fillStyle = 'rgba(95,232,232,0.7)';
          ctx.beginPath();
          ctx.arc(B.transform.position.x-Game.graphics.camera.x, B.transform.position.y-Game.graphics.camera.y, B.col-(B.duration_left/B.duration)*B.col, 0, Math.PI*2, true); 
          ctx.closePath();
          ctx.fill();
        }
      })(Game.player.bomb);
      


      //UI
      //HP:
      ctx.save();
      ctx.strokeStyle = '#555555 4px solid';
      ctx.font = "bold 20px sans-serif";

      ctx.fillStyle = '#F2392C';
      ctx.fillRect(50,10,Game.player.hp/Game.player.max_hp*200,20);
      ctx.strokeRect(50,10,200,20);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText("HEALTH:   "+Game.player.hp, 85, 27);

      //AMMO:
      ctx.fillStyle = '#968E59'
      if (Game.player.ranged.reload_time_left){
        ctx.fillRect(300,10,200 - Game.player.ranged.reload_time_left/Game.player.ranged.reload_time*200,20);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText("RELOADING...", 335, 27);
      }else{
        ctx.fillRect(300,10,Game.player.ranged.ammo/Game.player.ranged.max_ammo*200,20);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText("AMMO:   "+Game.player.ranged.ammo, 335, 27);
      }
      ctx.strokeRect(300,10,200,20);

      //BOMB:
      ctx.fillStyle = '#5FE8E8';
      ctx.fillRect(50,40, 200 - Game.player.bomb.cooldown_left/Game.player.bomb.cooldown*200,20);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText("MANA BURST", 85, 57);
      ctx.strokeRect(50,40,200,20);

      //SCORE:
      ctx.fillStyle = '#46A343';
      ctx.fillRect(300,40, 200, 20);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText("Score: "+Math.floor(Game.player.exp.total), 335, 57);
      ctx.strokeRect(300,40,200,20);

      //LUCK
      ctx.fillStyle = '#7EF280';
      ctx.fillRect(570, 210-(Game.bm.luck*2), 20, Game.bm.luck*2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText("L", 573, 40);
      ctx.fillText("U", 573, 80);
      ctx.fillText("C", 573, 120);
      ctx.fillText("K", 573, 160);
      ctx.strokeRect(570,10,20,200);

      //WAVE
      ctx.fillStyle = '#BEF27E';
      ctx.fillRect(600, 210-(Game.bm.wave_time_left/Game.bm.wave_time*200), 20, Game.bm.wave_time_left/Game.bm.wave_time*200);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText("W", 600, 40);
      ctx.fillText("A", 603, 70);
      ctx.fillText("V", 603, 100);
      ctx.fillText("E", 603, 130);
      var wave = Game.bm.wave.toString()
      for (var i = 0; i < wave.length; i++){
        ctx.fillText(wave[i], 605, 165+(20*i));
      }
      ctx.strokeRect(600,10,20,200);


      if (Game.player.isDead){
        ctx.fillStyle = '#BE0000';
        ctx.font = "bold 120px sans-serif";
        ctx.fillText("DEAD!", 160, 300);
        ctx.font = "bold 40px sans-serif";
        ctx.fillText("Press 'R' to replay!", 160, 400);
      }

      ctx.restore();
    }else{

      ctx.save();
      ctx.strokeStyle = '#555555 4px solid';
      ctx.font = "20px sans-serif";
      ctx.fillStyle = '#DDD';

      ctx.fillText('==CONTROLES==',200,25);
      ctx.font = '14px sans-serif';
      ctx.fillText('A: Move Left', 10, 50);
      ctx.fillText('S: Move Down', 10, 69);
      ctx.fillText('D: Move Right', 10, 88);
      ctx.fillText('W: Move Up', 10, 107);

      ctx.fillText('Left Click: Melee Attack', 125, 50);
      ctx.fillText('Right Click: Ranged Attack', 125, 69);
      ctx.fillText('Space Bar: Mana Burst', 125, 88);
      ctx.fillText('R: Manual Reload', 125, 107);

      ctx.fillText('1: Develop Melee', 325, 50);
      ctx.fillText('2: Develop Ranged', 325, 69);
      ctx.fillText('3: Develop Mana Burst', 325, 88);

      ctx.fillStyle = '#E77';
      ctx.fillText('P: Pause / Unpause / Start Game', 325, 107);

      ctx.font = "20px sans-serif";
      ctx.fillStyle = '#DDD';

      ctx.fillText('==HERO STATS==',200,130);
      ctx.font = '14px sans-serif';

      ctx.fillText('HEALTH:   '+Game.player.hp, 70, 149);
      ctx.fillText('SPEED:   '+Game.player.speed/10, 70, 168);
      ctx.fillText('HP REGEN: '+Game.player.health_regen+' per 5 sec', 70, 187);

      ctx.fillText('MELEE DAMAGE:   '+Game.player.melee.damage, 70, 210);

      ctx.fillText('MANA BURST DAMAGE:   '+Game.player.bomb.damage, 70, 229);
      ctx.fillText('MANA BURST RANGE:   '+Game.player.bomb.col/10, 70, 248);

      ctx.fillText('RANGED DAMAGE:   '+Game.player.ranged.damage, 360, 149);
      ctx.fillText('RANGED RANGE:   '+Game.player.ranged.range/10, 360, 168);
      ctx.fillText('FIRE RATE: '+1000/Game.player.ranged.cooldown+' per sec', 360, 187);

      ctx.fillText('RELOAD TIME:   '+Game.player.ranged.reload_time/1000+' sec', 360, 210);
      ctx.fillText('CLIP SIZE:   '+Game.player.ranged.max_ammo, 360, 229);

      ctx.font = "20px sans-serif";
      ctx.fillStyle = '#DDD';

      ctx.fillText('==HERO DEVELOPMENT==',160,275);
      ctx.font = '12px sans-serif';

      if (Game.player.exp.selected == 'melee'){ctx.fillStyle = '#7E7';}else{ctx.fillStyle = '#DDD';}
      ctx.fillText('MELEE: Improves your melee damage and health per level.', 10, 294);
      ctx.fillText('Level: '+Game.player.exp.melee.level, 10, 310);
      ctx.fillText('Level Progress: '+Math.floor(Game.player.exp.melee.xp)+'/'+Game.player.exp.melee.next, 10, 326);
      ctx.fillText('PERKS: Level 30: Bigger Sword,   Level 60: Biggest Sword', 10, 342);

      if (Game.player.exp.selected == 'ranged'){ctx.fillStyle = '#7E7';}else{ctx.fillStyle = '#DDD';}
      ctx.fillText('RANGE: Improves your ranged damage, movement speed, and fire rate per level.', 10, 363);
      ctx.fillText('Level: '+Game.player.exp.ranged.level, 10, 379);
      ctx.fillText('Level Progress: '+Math.floor(Game.player.exp.ranged.xp)+'/'+Math.floor(Game.player.exp.ranged.next), 10, 395);
      ctx.fillText('PERKS: Level 20: x2 Clip,  Level 40: 1/2 reload time,  Level 60: clip x4 (base),  Level 80: x2 range.', 10, 412);

      if (Game.player.exp.selected == 'bomb'){ctx.fillStyle = '#7E7';}else{ctx.fillStyle = '#DDD';}
      ctx.fillText('MANA BURST: Improves your Mana Burst damage, and health regeneration per level.', 10, 432);
      ctx.fillText('Level: '+Game.player.exp.bomb.level, 10, 448);
      ctx.fillText('Level Progress: '+Math.floor(Game.player.exp.bomb.xp)+'/'+Game.player.exp.bomb.next, 10, 463);
      ctx.fillText('PERKS: Level 20: x2 Clip,  Level 40: 1/2 reload time,  Level 60: clip x4 (base),  Level 80: x2 range.', 10, 478);

      ctx.restore();
    }

  };


})();

