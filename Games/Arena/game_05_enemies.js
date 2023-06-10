(function(){

  Game.enemies = [];

  Game.enemy_functions = {}
  Game.update_enemies = function (delta){
    Game.enemies = Game.enemies.filter(function(mob){
      return Game.enemy_functions['update_'+mob.type](mob,Game.player,delta);
    });
  };
  Game.enemy_functions.update_lame_brain = function(mob,P,delta){
    if(!mob.active){return false;}
    if(mob.animator.death_count_left){
      Game.animator.mob_update(mob,delta);
      return true;
    }
    mob.chasing = (Game.utils.proximity(mob, P) < 200);
    if (mob.chasing){
      mob.animator.paused = false;
      mob.transform.rotation.z = Game.utils.point_to(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
      if (Game.utils.proximity(mob,P) < 35){
        mob.vol = [0, 0];
        Game.utils.count_down(mob,'attack_wind_up_left',delta);
        if (!mob.attack_wind_up_left){
          Game.utils.damage(P,mob.damage);
          mob.attack_wind_up_left = mob.attack_wind_up;
        }
      } else {
        mob.vol = Game.utils.normalize(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
      }
    }else if (mob.standing){
      Game.utils.count_down(mob,'standing',delta);
      if (!mob.standing){
        mob.vol = Game.utils.randomize_direction();
        Game.enemy_functions.point_walk(mob);
        mob.wonder = Math.random()*275+75;
        mob.animator.paused = false;
      }
    }else if (mob.wonder){
      mob.wonder -= mob.speed * delta;
      if (mob.wonder <= 0){
        mob.wonder = 0;
        mob.vol = [0,0];
        mob.standing = Math.random()*250+500;
        mob.animator.paused = true;
      }
    }
    Game.enemy_functions.move(mob,delta);
    Game.animator.mob_update(mob,delta);
    return true;
  };


  Game.enemy_functions.update_stand_n_shoot = function(mob,P,delta){
    if(!mob.active){return false;}
    if(mob.animator.death_count_left){
      Game.animator.mob_update(mob,delta);
      return true;
    }
    if (mob.spread_out){
      if (mob.vol[0] || mob.vol[1]){
        mob.spread_out -= mob.speed * delta;
        if (mob.spread_out < 0){mob.spread_out = 0;}
      }else{
        mob.vol = Game.utils.randomize_direction();
        Game.enemy_functions.point_walk(mob);
      }
    }else{
      mob.vol = Game.utils.normalize(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
      Game.enemy_functions.point_walk(mob);
      mob.animator.paused = false;
      if (Game.utils.proximity(mob, P) < 250){
        mob.animator.paused = true;
        mob.vol = [0,0]
        Game.utils.count_down(mob, 'cooldown_left', delta);
        if (!mob.cooldown_left){
          mob.cooldown_left = mob.cooldown;
          Game.projectiles.push({
          source: mob,
          damage: mob.damage,
          type: 'vector',
          speed: mob.range_speed,
          vol: Game.utils.normalize(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y),
          range: 700,
          transform: {
            visible: true,
            position: {x: mob.transform.position.x, y: mob.transform.position.y, z: 2},
            rotation: {x: 0, y: 0, z: 0.5},
            scale: {x: 4, y: 4},
            offset: {x: 312, y: 22, r: 0},
            width: 12,
            height: 12
          },
          col: 10
        });
        Game.graphics.draw_list[2].push(Game.projectiles[Game.projectiles.length-1].transform);
        }
      }
    }
    Game.enemy_functions.move(mob,delta);
    Game.animator.mob_update(mob,delta);
    return true;
  };

  (function(){

    var two_pi = Math.PI*2;
    var p_z, m_z, d, r;
    Game.enemy_functions.update_back_stabber = function(mob,P){
      if(!mob.active){return false;}
      if(mob.animator.death_count_left){
        Game.animator.mob_update(mob,delta);
        return true;
      }
      if (mob.spread_out){
        if (mob.vol[0] || mob.vol[1]){
          mob.spread_out -= mob.speed * delta;
          if (mob.spread_out < 0){mob.spread_out = 0;}
        }else{
          mob.vol = Game.utils.randomize_direction();
          Game.enemy_functions.point_walk(mob);
        }
      }else{
        Game.utils.count_down(mob,'cooldown_left',delta);
        // if the player's back is turned.
        mob.transform.rotation.z = Game.utils.point_to(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
        mob.animator.paused = false;
        p_z = (P.transform.rotation.z + two_pi)%two_pi;
        m_z = (mob.transform.rotation.z + two_pi)%two_pi;
        d = Math.abs(p_z - m_z) % two_pi;
        r = (d > Math.PI)? two_pi - d : d;
        if (r <  (Math.PI/2)){
          if (Game.utils.proximity(mob,P) < 35){
            mob.vol = [0, 0];
            if (!mob.cooldown_left){Game.utils.count_down(mob,'attack_wind_up_left',delta);}
            if (!mob.attack_wind_up_left){
              Game.utils.damage(P,mob.damage);
              mob.attack_wind_up_left = mob.attack_wind_up;
              mob.cooldown_left = mob.cooldown;
            }
          }else{
            mob.vol = Game.utils.normalize(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
          }
        }else{
          mob.vol = [0,0];
          mob.animator.paused = true;
        }
      }
      Game.enemy_functions.move(mob,delta);
      Game.animator.mob_update(mob,delta);
      return true;
    };
  })();
  Game.enemy_functions.update_big_n_heavy = function(mob,P){
    if(!mob.active){return false;}
    if(mob.animator.death_count_left){
      Game.animator.mob_update(mob,delta);
      return true;
    }
    if (mob.spread_out){
      if (mob.vol[0] || mob.vol[1]){
        mob.spread_out -= mob.speed * delta;
        if (mob.spread_out < 0){mob.spread_out = 0;}
      }else{
        mob.vol = Game.utils.randomize_direction();
      }
    }else{
      Game.utils.count_down(mob,'cooldown_left',delta);
      if (Game.utils.proximity(mob,P) < 35){
        mob.vol = [0, 0];
        if (!mob.cooldown_left){Game.utils.count_down(mob,'attack_wind_up_left',delta);}
        if (!mob.attack_wind_up_left){
          Game.utils.damage(P,mob.damage);
          mob.attack_wind_up_left = mob.attack_wind_up;
          mob.cooldown_left = mob.cooldown;
        }
      } else {
        mob.vol = Game.utils.normalize(mob.transform.position.x, mob.transform.position.y, P.transform.position.x, P.transform.position.y);
      }
    }
    Game.enemy_functions.move(mob,delta);
    Game.animator.mob_update(mob,delta);
    return true;
  };

  Game.enemy_functions.move = function(mob,delta){
    mob.transform.position.x += (mob.vol[0]*mob.speed*delta);
    mob.transform.position.y += (mob.vol[1]*mob.speed*delta);
    if (mob.transform.position.x < 40 + mob.col){
      mob.transform.position.x = 40 + mob.col; mob.vol[0] *= -1;
      Game.enemy_functions.point_walk(mob);
    }
    if (mob.transform.position.x > 1240 - mob.col){
      mob.transform.position.x = 1240 - mob.col; mob.vol[0] *= -1;
      Game.enemy_functions.point_walk(mob);
    }
    if (mob.transform.position.y < 40 + mob.col){
      mob.transform.position.y = 40 + mob.col; mob.vol[1] *= -1;
      Game.enemy_functions.point_walk(mob);
    }
    if (mob.transform.position.y > 920 - mob.col){
      mob.transform.position.y = 920 - mob.col; mob.vol[1] *= -1;
      Game.enemy_functions.point_walk(mob);
    }
    if (mob.type == 'big_n_heavy'){mob.transform.rotation.z = 0}
  };

  Game.enemy_functions.point_walk = function(mob){
    mob.transform.rotation.z = Game.utils.point_to(mob.transform.position.x,mob.transform.position.y,mob.transform.position.x+mob.vol[0],mob.transform.position.y+mob.vol[1]);
  };

  Game.enemy_functions.do_damage = function(amount){
    Game.utils.damage(this, amount);
    if (!this.hp){
      Game.enemy_functions.die.call(this);
    }else{
      this.animator.hurt_count_left = this.animator.hurt_count;
    }
  }

  Game.enemy_functions.die = function(){
    Game.player.add_xp(Game.player.exp,this.points);
    Game.bm.enemy_count--;
    this.animator.death_count_left = 4;
    // Game.graphics.draw_list[1].splice(Game.graphics.draw_list[1].indexOf(this.transform),0);
    // Game.graphics.draw_list[0].push(this.transform);
    for (var i = 0; i < Game.graphics.draw_list[1].length; i++){
      if (this.transform === Game.graphics.draw_list[1][i]){
        Game.graphics.draw_list[1].splice(i,1);
        Game.graphics.draw_list[0].push(this.transform);
      }
    }
  };

  Game.enemy_functions.destroy = function () {
    this.active = false;
    this.transform.visible = false;
  }


})();