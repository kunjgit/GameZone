(function(){

  Game.player = {
    hp: 10,
    max_hp: 10,
    health_regen: 1,
    health_regen_time: 5000,
    speed: 200,
    col: 12,
    melee: {
      active: false,
      damage: 4,
      reach: 25,
      cooldown: 500,
      cooldown_left: 0,
      duration: 200,
      duration_left: 0,
      movement: 0
    },
    ranged: {
      damage: 3,
      speed: 750,
      cooldown: 500,
      cooldown_left: 0,
      ammo: 6,
      max_ammo: 6,
      reload_time: 5000,
      reload_time_left: 0,
      movement: 0,
      range: 200
    },
    bomb: {
      active: false,
      damage: 10,
      col: 100,
      cooldown: 10000,
      cooldown_left: 0,
      duration: 200,
      duration_left: 0
    },
    transform: {
      visible: true,
      position: {x: 100, y: 100, z: 1},
      rotation: {x: 0, y: 0, z: 0.5},
      scale: {x: 4, y: 4},
      offset: {x: 322, y: 111, r: 1},
      width: 28,
      height: 28
    },
    isDead: false
  }
  Game.graphics.draw_list[1].push(Game.player.transform);

  Game.player.die = function(){
    if (!Game.player.isDead){
      Game.player.isDead = true;
      Game.player.transform.width = 32; 
      Game.player.transform.height = 32;
      Game.player.transform.offset.x = 286;
      Game.player.transform.offset.y = 106;
    }
    if (Game.input.keyboard.r){
      Game.reset_game();
    }
  }

  Game.update_player = function(P, delta){
    if (P.hp == 0){P.die();return;}
    if (Game.input.keyboard.a){P.transform.position.x -= (P.speed * delta);}
    if (Game.input.keyboard.d){P.transform.position.x += (P.speed * delta);}
    if (Game.input.keyboard.w){P.transform.position.y -= (P.speed * delta);}
    if (Game.input.keyboard.s){P.transform.position.y += (P.speed * delta);}
    P.transform.rotation.z = Game.utils.point_to(P.transform.position.x-Game.graphics.camera.x , P.transform.position.y-Game.graphics.camera.y, Game.input.mouse.x, Game.input.mouse.y);
    // console.log(P.transform.rotation.z);
    if (P.transform.position.x < 40 + P.col){P.transform.position.x = 40 + P.col;}
    if (P.transform.position.x > 1240 - P.col){P.transform.position.x = 1240 - P.col;}
    if (P.transform.position.y < 40 + P.col){P.transform.position.y = 40 + P.col;}
    if (P.transform.position.y > 920 - P.col){P.transform.position.y = 920 - P.col;}
    //adjust the camera
    if (P.transform.position.x > 320 && P.transform.position.x < 960){ Game.graphics.camera.x = P.transform.position.x - 320;}
    if (P.transform.position.y > 240 && P.transform.position.y < 720){ Game.graphics.camera.y = P.transform.position.y - 240;}
    Game.utils.count_down(P.melee,'cooldown_left',delta);
    Game.utils.count_down(P.ranged,'cooldown_left',delta);
    Game.utils.count_down(P.bomb,'cooldown_left',delta);
    if (!P.ranged.reload_time_left){
      if (Game.input.keyboard.r && P.ranged.ammo < P.ranged.max_ammo){P.ranged.ammo = P.ranged.max_ammo; P.ranged.reload_time_left = P.ranged.reload_time;}
      if (Game.input.mouse.right){ P.do_ranged(P);}  
    }else{
      P.ranged.reload_time_left -= delta * 1000;
      if (P.ranged.reload_time_left < 0){P.ranged.reload_time_left = 0;}
    }
    if (Game.input.mouse.left && !P.melee.cooldown_left){
      P.melee.cooldown_left = P.melee.cooldown;
      P.do_melee(P);
    }
    if (P.melee.active){P.update_melee(P, P.melee, delta);}
    if (Game.input.keyboard.space && !P.bomb.cooldown_left){
      P.bomb.cooldown_left = P.bomb.cooldown;
      P.do_bomb(P);
    }
    if (P.bomb.active){P.update_bomb(P.bomb, delta);}
    if (P.hp < P.max_hp){
      if ((P.health_regen_time -= delta * 1000) < 0){
        Game.utils.damage(P, -1);
        P.health_regen_time += 5000/P.health_regen;
      }
    }
  }


  Game.player.do_melee = function(P){
    P.melee.active = true;
    P.melee.transform.visible = true;
    P.melee.duration_left = P.melee.duration;
    Game.graphics.draw_list[2].push(Game.player.melee.transform);
  };

  var melee_offset_x, melee_offset_y;
  Game.player.update_melee = function(P, M, delta){
    Game.utils.count_down(M,'duration_left', delta);
    if (M.duration_left){
      // algin the rotation
      M.transform.rotation.z = P.transform.rotation.z;
      // align the position
      M.transform.position.x = melee_col_obj.transform.position.x = P.transform.position.x;
      M.transform.position.y = melee_col_obj.transform.position.y = P.transform.position.y;
      melee_offset_x = Math.cos(M.transform.rotation.z);
      melee_offset_y = Math.sin(M.transform.rotation.z);
      M.transform.position.x += melee_offset_x * M.transform.width/1.35;
      M.transform.position.y += melee_offset_y * M.transform.width/1.35;
      // check collision
      melee_col_obj.transform.position.x += melee_offset_x * M.reach;
      melee_col_obj.transform.position.y += melee_offset_y * M.reach;
      Game.enemies.map(function(E){
        if(Game.utils.collision(E,melee_col_obj)){
          if (!E.melee_hit){
            Game.enemy_functions.do_damage.call(E,M.damage);
            E.melee_hit = true;
          }
        }
      });      
    }else{
      Game.enemies.map(function(E){E.melee_hit = false;});
      M.active = false;
      M.transform.visible = false;
    }
  };

  Game.player.do_ranged = function(P){
    if (P.ranged.cooldown_left == 0){
        P.ranged.ammo--;
        Game.projectiles.push({
          source: P,
          damage: P.ranged.damage,
          type: 'vector',
          speed: P.ranged.speed,
          vol: Game.utils.normalize(P.transform.position.x-Game.graphics.camera.x, P.transform.position.y-Game.graphics.camera.y, Game.input.mouse.x, Game.input.mouse.y),
          range: P.ranged.range,
          transform: {
            visible: true,
            position: {x: P.transform.position.x, y: P.transform.position.y, z: 2},
            rotation: {x: 0, y: 0, z: 0.5},
            scale: {x: 4, y: 4},
            offset: {x: 300, y: 22, r: 1},
            width: 12,
            height: 12
          },
          col: 6
        });
        Game.graphics.draw_list[2].push(Game.projectiles[Game.projectiles.length-1].transform);
        if (P.ranged.ammo == 0){
          P.ranged.ammo = P.ranged.max_ammo;
          P.ranged.reload_time_left = P.ranged.reload_time;
        }
        P.ranged.cooldown_left = P.ranged.cooldown;
      }
  };

  Game.player.do_bomb = function(P){
    P.bomb.active = true;
    P.bomb.duration_left = P.bomb.duration;
    P.bomb.transform.position.x = P.transform.position.x;
    P.bomb.transform.position.y = P.transform.position.y;
  }
  Game.player.update_bomb = function(B, delta){
    Game.utils.count_down(B, 'duration_left', delta);
    if (!B.duration_left){
      B.active = false;
      Game.enemies.map(function(E){
        if(Game.utils.collision(E,B)){Game.enemy_functions.do_damage.call(E,B.damage);}
      });
    }
  };

  Game.player.melee.transform = {
    visible: true,
    position: {x: 100, y: 100, z: 2},
    rotation: {x: 0, y: 0, z: 0},
    scale: {x: 4, y: 4},
    offset: {x: 188, y: 104, r: 0},
    width: 31,
    height: 15
  };
  Game.player.bomb.transform = {
    visible: true,
    position: {x: 100, y: 100, z: 2},
    rotation: {x: 0, y: 0, z: 0},
    scale: {x: 4, y: 4},
    offset: {x: 8, y: 364, r: 0},
    width: 24,
    height: 10
  };
  var melee_col_obj = {
    col: 10,
    transform: {
      visible: true,
      position: {x: 100, y: 100, z: 2},
      rotation: {x: 0, y: 0, z: 0},
      scale: {x: 4, y: 4},
      offset: {x: 292, y: 46, r: 0},
      height: 20,
      width: 20
    }
  }
  // Game.graphics.draw_list[2].push(melee_col_obj.transform);

  Game.player.exp = {};
  var pe = Game.player.exp;
  pe.total = 0;
  pe.selected = 'melee';
  pe.melee = {
    xp: 25,
    next: 10,
    level: 0,
    perk_levels: [30,60,100],
    // perk_levels: [1,2,3,4],
    perk_names: ['sword_2','sword_3','swipe']
  };
  pe.ranged = {
    xp: 0,
    next: 10,
    level: 0,
    perk_levels: [20,40,60,80,100],
    // perk_levels: [1,2,3,4],
    perk_names: ['clip_x2','reload_half','clip_x4','range_x2','spread_shot']
  };
  pe.bomb = {
    xp: 0,
    next: 10,
    level: 0,
    perk_levels: [20,40,60,80,100],
    // perk_levels: [1,2,3,4],
    perk_names: ['radius_150','cooldown_75','radius_200','cooldown_40','panic_bomb']
  };

  var level_xp_base = 10;
  Game.player.add_xp = function(exp,amount){
    exp.total += amount;
    if (exp[exp.selected].level < 100){
      exp[exp.selected].xp += amount;
      if (exp[exp.selected].xp >= exp[exp.selected].next){
        exp[exp.selected].xp -= exp[exp.selected].next;
        exp[exp.selected].level++;
        exp['level_'+exp.selected]();
        for (var i = 0; i < exp[exp.selected].perk_levels.length; i++){
          if (exp[exp.selected].perk_levels[i] == exp[exp.selected].level){
            exp['perk_'+exp[exp.selected].perk_names[i]]();
          }
        }
        Game.player.hp = Game.player.max_hp;
        Game.player.ranged.reload_time_left = 0;
        Game.player.ranged.ammo = Game.player.ranged.max_ammo;
        Game.player.bomb.cooldown_left = 0;
        exp[exp.selected].next = Math.floor(level_xp_base * (Math.pow(1.05,exp[exp.selected].level))+(5*exp[exp.selected].level));
      }
    }
  };

  (function(P){
    P.exp.level_melee = function(){
      P.melee.damage += 1;
      P.melee.movement += 1;
      P.max_hp += 2;
    };
    P.exp.level_ranged = function(){
      P.ranged.damage += 0.75;
      P.ranged.movement += 1;
      P.ranged.cooldown -= 2.5;
      P.speed += 1.5;
    };
    P.exp.level_bomb = function(){
      P.bomb.damage += 4;
      P.health_regen += 0.5;
    };

    P.exp.perk_sword_2 = function(){
      P.melee.transform.width = 37;
      P.melee.transform.height = 16;
      P.melee.transform.offset.x = 183;
      P.melee.transform.offset.y = 118;
      P.melee.reach = 40;
    };
    P.exp.perk_sword_3 = function(){
      P.melee.transform.width = 45;
      P.melee.transform.height = 15;
      P.melee.transform.offset.x = 176;
      P.melee.transform.offset.y = 134;
      P.melee.reach = 45;
    };
    P.exp.perk_swipe = function(){};

    P.exp.perk_clip_x2 = function(){P.ranged.max_ammo *= 2;};
    P.exp.perk_reload_half = function(){P.ranged.reload_time /= 2;};
    P.exp.perk_clip_x4 = function(){P.ranged.max_ammo *= 2;};
    P.exp.perk_range_x2 = function(){P.ranged.range *= 2};
    P.exp.perk_spread_shot = function(){};

    P.exp.perk_radius_150 = function(){P.bomb.col = 150;};
    P.exp.perk_cooldown_75 = function(){P.bomb.cooldown = 10000 * 0.75;};
    P.exp.perk_radius_200 = function(){P.bomb.col = 200;};
    P.exp.perk_cooldown_40 = function(){P.bomb.cooldown = 10000 * 0.4};
    P.exp.perk_panic_bomb = function(){};


    P._reset = function () {
      P.hp = P.max_hp = 10;
      P.health_regen = 1;
      P.speed = 200;
      P.melee.damage = 4;
      P.melee.reach = 25;
      P.melee.cooldown_left = 0;
      P.ranged.damage = 3;
      P.ranged.cooldown = 500;
      P.ranged.cooldown_left = 0;
      P.ranged.ammo = P.ranged.max_ammo = 6;
      P.ranged.reload_time = 5000;
      P.ranged.reload_time_left = 0;
      P.ranged.range = 200;
      P.bomb.active = false;
      P.bomb.damage = 10;
      P.bomb.col = 100;
      P.bomb.cooldown = 10000;
      P.bomb.cooldown_left = 0;
      P.transform = {
        visible: true,
        position: {x: 100, y: 100, z: 1},
        rotation: {x: 0, y: 0, z: 0.5},
        scale: {x: 4, y: 4},
        offset: {x: 322, y: 111, r: 1},
        width: 28,
        height: 28
      };
      P.isDead = false;
      Game.player.melee.transform = {
        visible: true,
        position: {x: 100, y: 100, z: 2},
        rotation: {x: 0, y: 0, z: 0},
        scale: {x: 4, y: 4},
        offset: {x: 188, y: 104, r: 0},
        width: 31,
        height: 15
      };
      P.exp.total = 0;
      P.exp.melee.xp = 0;
      P.exp.melee.next = 10;
      P.exp.melee.level = 0;
      P.exp.ranged.xp = 0;
      P.exp.ranged.next = 10;
      P.exp.ranged.level = 0;
      P.exp.bomb.xp = 0;
      P.exp.bomb.next = 10;
      P.exp.bomb.level = 0;
      Game.graphics.draw_list[1].push(Game.player.transform);
    };


  })(Game.player);
  


})();

