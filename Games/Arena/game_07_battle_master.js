(function () {
  Game.bm = {};

  Game.enemy_stats = [
    {type: 'lame_brain', hp: 6.0, speed: 70.0, damage: 1.0, graphic: [0,73,24,20,0]},
    {type: 'stand_n_shoot', hp: 6.0, speed: 90.0, damage: 1.0, graphic: [28,0,28,22,1]},
    {type: 'back_stabber', hp: 6.0, speed: 120.0, damage: 2.0, graphic: [0,22,20,18,1]},
    {type: 'big_n_heavy', hp: 12.0, speed: 45.0, damage: 3.0, graphic: [64,40,32,32,0]}
  ];

  Game.bm.wave_time = Game.bm.wave_time_left = 3000;
  var spawn_cooldown = 750;
  Game.bm.spawn_cooldown_left = 0;
  Game.update_battle_master = function(B,delta){
    if (enemies_to_spawn){
      Game.utils.count_down(B, 'spawn_cooldown_left', delta);
      if (!B.spawn_cooldown_left){
        B.spawn_cooldown_left = spawn_cooldown;
        for (var i = 0; i < portal_queue.length; i++){
          if (portal_queue[i].length){
            var type_index = portal_queue[i].splice(Math.floor(Math.random()*portal_queue[i].length),1);
            Game.spawn_enemy(wave_e_types[type_index],portal_transforms[i].position.x,portal_transforms[i].position.y);
            enemies_to_spawn--;
          }
        }
      }
    }else if (!B.enemy_count){
      //add to luck
      B.luck += Math.round(B.wave_time_left/B.wave_time*100);
      if (B.luck > 100){B.luck = 100;}
      B.do_wave();
    }else{
      Game.utils.count_down(B, 'wave_time_left', delta);
      if (!B.wave_time_left){
        //adjust luck
        B.luck -= Math.round(B.enemy_count/B.enemy_count_total*100);
        if (B.luck < 0){B.luck = 0;}
        B.do_wave();
      }
    }
  };

  
  var enemies_to_spawn = 0;
  Game.spawn_enemy = function(stats, x_pos, y_pos){
    var new_enemy = Game.utils.clone(stats);
    new_enemy.active = true;
    new_enemy.transform = {
      visible: true,
      position: {x: x_pos, y: y_pos, z: 1},
      rotation: {x: 0, y: 0, z: 0},
      scale: {x: 4, y: 4},
      offset: {x: new_enemy.graphic[0], y: new_enemy.graphic[1], r: new_enemy.graphic[4]},
      width: new_enemy.graphic[2],
      height: new_enemy.graphic[3]
    };
    new_enemy.max_hp = new_enemy.hp;
    new_enemy.vol = [0,0];
    new_enemy.chasing = false;
    new_enemy.animator = Game.animator.setup_animation(new_enemy);
    switch (new_enemy.type){
      case 'lame_brain':
        new_enemy.col = 14;
        new_enemy.wonder = 0;
        new_enemy.standing = 500;
        new_enemy.attack_wind_up = 400;
        new_enemy.attack_wind_up_left = 400;
      break;
      case 'stand_n_shoot':
        new_enemy.col= 14;
        new_enemy.spread_out = 200;
        new_enemy.cooldown = 1500;
        new_enemy.cooldown_left = 0;
        new_enemy.range_speed = 200;
      break;
      case 'back_stabber':
        new_enemy.col = 14;
        new_enemy.spread_out = 200;
        new_enemy.attack_wind_up = 200;
        new_enemy.attack_wind_up_left = 200;
        new_enemy.cooldown = 400;
        new_enemy.cooldown_left = 400;
      break;
      case 'big_n_heavy':
        new_enemy.col = 20;
        new_enemy.spread_out = 200;
        new_enemy.attack_wind_up = 400;
        new_enemy.attack_wind_up_left = 400;
        new_enemy.cooldown = 600;
        new_enemy.cooldown_left = 600;
      break;
    }
    new_enemy.destroy = Game.enemy_functions.destroy;
    new_enemy.die = Game.enemy_functions.die;
    new_enemy.melee_hit = false;

    Game.enemies.push(new_enemy);
    Game.graphics.draw_list[1].push(new_enemy.transform);
  };

  var type_distribution = [0.45, 0.2, 0.15, 0.1];
  var type_population = [10, 4, 2, 1];
  var wave_base = 20;
  var bm = Game.bm;
  bm.wave = 4;
  bm.enemy_count = 0;
  bm.enemy_count_total = 0;
  var pts;
  Game.bm.craft_enemy = function(obj, points){
    if (points > 50){
      obj.tier = 3;
    }else if(points > 30){
      obj.tier = 2;
    }else if(points > 15){
      obj.tier = 1;
    }else{
      obj.tier = 0;
    }
    var enemy = Game.utils.clone(obj);
    switch (obj.type){
      case 'lame_brain':
      case 'stand_n_shoot':
        enemy.hp += Math.round(points * 0.5 /3 );
        enemy.speed += Math.round(points * 0.5 / 3);
        enemy.damage += Math.round(points * 0.34 / 3);
        break;
      case 'back_stabber':
        enemy.hp += Math.round(points * 0.3 /3 );
        enemy.speed += Math.round(points * 0.8 / 3);
        enemy.damage += Math.round(points * 0.7 / 3);
        break;
      case 'big_n_heavy':
        enemy.hp += Math.round(points * 1 /3 );
        enemy.speed += Math.round(points * 0.25 / 3);
        enemy.damage += Math.round(points * 1 / 3);
        break;
    }
    enemy.points = points;
    return enemy;
  };
  var wave_e_types = [];
  var wave_e_count = [];
  Game.bm.do_wave = function(){
    bm.wave++;
    wave_base *= 1.08;
    // figure in luck meter...
    var _luck = 100 - Game.bm.luck;
    if (_luck < 0){_luck = 0;}
    _luck /= 100;
    _luck *= 4;
    _luck += 1;
    var wave_val = wave_base * _luck;
    // distribute points...
    var e_ratio = [];
    // bm.enemy_count_total = bm.enemy_count;
    enemies_to_spawn = 0;
    var e_ratio_total = 0;
    type_distribution.map(function(item){
      var et = Math.random()*100*item;
      e_ratio_total += et;
      e_ratio.push(et);
    });
    for(var i = 0; i < e_ratio.length; i++){
      e_ratio[i] = (e_ratio[i] / e_ratio_total) * wave_val;
      // number of mobs = points alloted to type / total points for round / type_distribution * type_population
      wave_e_count[i] = Math.round(e_ratio[i]/wave_val/type_distribution[i]*type_population[i]);
      if (wave_e_count[i]){wave_e_types[i] = Game.bm.craft_enemy(Game.enemy_stats[i],e_ratio[i]/wave_e_count[i]);}
      enemies_to_spawn += wave_e_count[i];
      for (var j = 0; j < wave_e_count[i]; j++){
        portal_queue[Math.floor(Math.random()*portal_queue.length)].push(i);
      }
    }
    bm.enemy_count_total = bm.enemy_count += enemies_to_spawn;
    bm.wave_time_left = bm.wave_time = bm.enemy_count_total * 1500;
  };

  var portal_layout = [];
  portal_layout[3] = [1,2];
  portal_layout[4] = [2,2];
  portal_layout[5] = [2,1,2];
  portal_layout[6] = [2,2,2];
  portal_layout[7] = [2,3,2];
  portal_layout[8] = [3,2,3];
  portal_layout[9] = [3,3,3];
  portal_layout[10] = [3,4,3];
  portal_layout[11] = [4,3,4];
  portal_layout[12] = [4,4,4];
  portal_layout[13] = [3,4,3,3];
  portal_layout[14] = [3,4,3,4];
  portal_layout[15] = [4,4,4,3];
  portal_layout[16] = [4,4,4,4];

  var portal_queue = [];
  var portal_transforms = [];
  for (var i = 0; i < 16; i++){
    portal_transforms.push({
      visible: true,
      position: {x: 100, y: 100, z: 0},
      rotation: {x: 0, y: 0, z: 0},
      scale: {x: 1, y: 1},
      offset: {x: 57, y: 110, r: 0},
      width: 38,
      height: 38
    });
  }

  var portal_count = 5;
  Game.bm.set_portals = function(count){
    portal_queue = [];
    for (var i = 0; i < portal_transforms.length; i++){
      portal_transforms[i].visible = false;
    }
    Game.graphics.draw_list[0] = [];
    var portal_spacing = [];
    var portal_spacing_v = 880/(portal_layout[count].length + 1);
    portal_layout[count].map(function(num){
      portal_spacing.push(1200/(num+1));
    });
    var transform_index = 0;
    for (var i = 0; i < portal_layout[count].length; i++){
      for (var j = 0; j < portal_layout[count][i]; j++){
        portal_transforms[transform_index].visible = true;
        portal_transforms[transform_index].position.x = portal_spacing[i] * (j+1);
        portal_transforms[transform_index].position.y = portal_spacing_v * (i+1);
        portal_transforms[transform_index].position.x += (Math.random()*portal_spacing[i])-portal_spacing[i]/2;
        portal_transforms[transform_index].position.y += (Math.random()*portal_spacing_v)-portal_spacing_v/2;
        Game.graphics.draw_list[0].push(portal_transforms[transform_index]);
        portal_queue.push([]);
        transform_index++;
      }
    }
  };

  Game.bm.luck = 100;

  Game.bm._reset = function(){
    Game.bm.luck = 100;
    portal_count = 5;
    wave_base = 20;
    Game.bm.wave = 0;
    Game.bm.enemy_count = 0;
    Game.bm.enemy_count_total = 0;
    type_population = [10, 4, 2, 1];
    Game.bm.set_portals(portal_count);
    Game.bm.do_wave();
  };

  Game.bm.set_portals(portal_count);
  Game.bm.do_wave();
})();

