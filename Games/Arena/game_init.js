window.onload = function(e){

  document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

  Game.utils.add_default(Game.config, {});
  Game.utils.add_default(Game.config.fps, 60);
  Game.utils.add_default(Game.config.canvas_id, 'game_canvas');
  Game.utils.add_default(Game.config.fps_counter_id, 'fps_counter');


  Game.paused = false;
  Game.update = function(delta){
    if (!Game.paused){
      Game.update_player(Game.player, delta);
      if (!Game.player.isDead){
        Game.update_projectiles(delta);
        Game.update_enemies(delta);
        Game.update_battle_master(Game.bm,delta);
      }
    }
  };

  Game.run = (function() {
    var update_interval = 1000 / Game.config.fps;
    start_tick = next_tick = last_tick = (new Date).getTime();
    num_frames = 0;

    return function() {
      current_tick = (new Date).getTime();
      while ( current_tick > next_tick ) {
        delta = (current_tick - last_tick) / 1000;
        Game.update(delta);
        next_tick += update_interval;
        last_tick = (new Date).getTime();
      }

      Game.graphics.draw(Game.graphics.context);

      fps = (num_frames / (current_tick - start_tick)) * 1000;
      Game.graphics.fps_counter.textContent = Math.round(fps);
      num_frames++;
    }
  })();

  if( window.webkitRequestAnimationFrame) {
    window.each_frame = function(cb) {
      var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    window.each_frame = function(cb) {
      var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    window.each_frame = function(cb) {
      setInterval(cb, 1000 / Game.config.fps);
    }
  }
  window.each_frame(Game.run);


  Game.reset_game = function (){
    if (Game.player.isDead){
      Game.enemies = [];
      Game.projectiles = [];
      Game.graphics.draw_list = [[],[],[]];
      Game.bm._reset();
      Game.player._reset();
      Game.graphics.camera = {x:0,y:0};
    }
  }
};