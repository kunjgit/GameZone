Game.utils = {};
Game.utils.add_default = function(_var, val){ if (typeof _var == 'undefined'){_var = val;}};
(function(){
  var x_dif, y_dif, a_tan, hyp;
  Game.utils.point_to = function(from_x, from_y, to_x, to_y){
    x_dif = to_x - from_x;
    y_dif = to_y - from_y;
    a_tan = Math.atan2(y_dif,x_dif);
    return a_tan;
  };
  Game.utils.normalize = function(from_x, from_y, to_x, to_y){
    x_dif = to_x - from_x;
    y_dif = to_y - from_y;
    hyp = (x_dif*x_dif)+(y_dif*y_dif);
    hyp = Math.sqrt(hyp);
    return [(x_dif/hyp),(y_dif/hyp)];
  };
  Game.utils.randomize_direction = function(){
    return  Game.utils.normalize(0,0,Math.random()*10-5,Math.random()*10-5);
  };
  Game.utils.proximity = function(obj_1,obj_2){

    x_dif = obj_2.transform.position.x - obj_1.transform.position.x;
    y_dif = obj_2.transform.position.y - obj_1.transform.position.y;
    return Math.sqrt((x_dif*x_dif)+(y_dif*y_dif));
  };
  Game.utils.collision = function(obj_1, obj_2){
    return (Game.utils.proximity(obj_1,obj_2) < (obj_1.col+obj_2.col));
  };
})();
(function(){
  var id = 0;
  Game.utils.assign_id = function(){return id++;};
})();
Game.utils.count_down = function(obj, prop, delta){
  obj[prop] -= delta*1000;
  obj[prop] =(obj[prop] < 0)? 0 : obj[prop];
};
Game.utils.damage = function(obj, amount){
  obj.hp -= amount;
  if (obj.hp <= 0){obj.hp = 0;}
  else if (obj.hp > obj.max_hp){obj.hp = obj.max_hp;}
}
Game.utils.clone = function (obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};

