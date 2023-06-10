(function(){
  Game.animator = {};
  
  Game.animator.setup_animation = function (obj) {
    var new_obj = {};
    if (obj.type){
      switch (obj.type){
        case 'lame_brain':
        new_obj.looping = true;
        new_obj.loop_tiers = []
        new_obj.base_loop = [[0,73],[24,73],[0,73],[48,73]];
        new_obj.tier_width = 72;
        new_obj.frame_rate = 240;
        new_obj.frame_rate_left = 96;
        break;
        case 'stand_n_shoot':
        new_obj.looping = true;
        new_obj.loop_tiers = []
        new_obj.base_loop = [[0,0],[28,0],[0,0],[56,0]];
        new_obj.tier_width = 84;
        new_obj.frame_rate = 80;
        new_obj.frame_rate_left = 80;
        break;
        case 'back_stabber':
        new_obj.looping = true;
        new_obj.loop_tiers = []
        new_obj.base_loop = [[0,22],[20,22],[0,22],[40,22]];
        new_obj.tier_width = 60;
        new_obj.frame_rate = 60;
        new_obj.frame_rate_left = 60;
        break;
        case 'big_n_heavy':
        new_obj.looping = true;
        new_obj.loop_tiers = []
        new_obj.base_loop = [[64,40],[32,40],[0,40]];
        new_obj.tier_width = 96;
        new_obj.frame_rate = 70;
        new_obj.frame_rate_left = 50;
        break;
      }
    }
    new_obj.tier = 0;
    new_obj.tier_base = obj.tier;
    new_obj.loop_index = 0;
    new_obj.paused = false;
    new_obj.hurt_count = 8;
    new_obj.hurt_count_left = 0;
    new_obj.hurt_frame = 34;
    new_obj.hurt_frame_left = 0;
    new_obj.death_count_left = 0;
    new_obj.death_frame_left = 0;
    return new_obj;
  }
  Game.animator.mob_update = function (mob,delta) {
    if (mob.animator.death_count_left){
      Game.utils.count_down(mob.animator, 'death_frame_left', delta);
      if (!mob.animator.death_frame_left){
        if (mob.animator.death_count_left == 4){
          mob.transform.width = mob.transform.height = 32;
          mob.transform.offset.x = 222;
          mob.transform.offset.y = 106;
          mob.animator.death_frame_left = 34;
          mob.animator.death_count_left--;
        }else if(mob.animator.death_count_left == 3){
          mob.transform.offset.x = 254;
          mob.transform.offset.y = 106;
          mob.animator.death_frame_left = 34;
          mob.animator.death_count_left--;
        }else if(mob.animator.death_count_left == 2){
          mob.transform.offset.x = 286;
          mob.transform.offset.y = 106;
          mob.animator.death_frame_left = 2250;
          mob.animator.death_count_left--;
        }else{
          // distroy enemy
          mob.destroy();
        }
      }
      return;
    }
    if (mob.animator.hurt_count_left){
      Game.utils.count_down(mob.animator, 'hurt_frame_left', delta);
      if (!mob.animator.hurt_frame_left){
        mob.animator.hurt_frame_left = mob.animator.hurt_frame;
        mob.animator.hurt_count_left--;
        if (mob.animator.hurt_count_left % 2 == 1){
          mob.animator.tier = 4;
        }else{
          mob.animator.tier = mob.animator.tier_base;
        }
      }
    }
    if (mob.animator.looping){
      if (!mob.animator.paused){Game.utils.count_down(mob.animator,'frame_rate_left',delta);}
      if (!mob.animator.frame_rate_left){
        mob.animator.frame_rate_left = mob.animator.frame_rate;
        mob.animator.loop_index++;
        if (mob.animator.loop_index >= mob.animator.base_loop.length){mob.animator.loop_index = 0;}
      }
    }
    mob.transform.offset.x = mob.animator.base_loop[mob.animator.loop_index][0] + (mob.animator.tier * mob.animator.tier_width) ;
    mob.transform.offset.y = mob.animator.base_loop[mob.animator.loop_index][1];
  }
})();