(function(){
  Game.projectiles = [];
  var active;
  Game.update_projectiles = function (delta){
    // console.log(Game.projectiles);
    Game.projectiles = Game.projectiles.filter(function(p){
      active = true;
      switch (p.type){
        case 'vector':
          p.transform.position.x += (p.vol[0]*p.speed*delta);
          p.transform.position.y += (p.vol[1]*p.speed*delta);
          p.range -= p.speed*delta;
        break;
      }
      if (p.source == Game.player){
        for (var i = 0; i < Game.enemies.length; i++){
          if (!Game.enemies[i].animator.death_count_left && Game.utils.collision(p,Game.enemies[i])){
            Game.enemy_functions.do_damage.call(Game.enemies[i],p.damage);
            active = false;
            break;
          }
        }
      }else{
        if (Game.utils.collision(p,Game.player)){
          Game.utils.damage(Game.player,p.damage);
          active = false;
        }
      }
      if (p.range < 0){active = false;}
      return p.transform.visible = active;
    });
  };
})();