/**
* minivents from https://github.com/allouis/minivents
*/
function Events(target){
  var events = {}, i, list, args, A = Array;
  target = target || this
    target.on = function(type, func, ctx){
      events[type] || (events[type] = [])
      events[type].push({f:func, c:ctx})
    }
    target.off = function(type, func){
      list = events[type] || []
      i = list.length = func ? list.length : 0
      while(~--i<0) func == list[i].f && list.splice(i,1)
    }
    target.emit = function(){
      args = A.apply([], arguments)
      list = events[args.shift()] || []
      args = args[0] instanceof A && args[0] || args
      i = list.length
      for(j=0; j<i; j++) list[j].f.apply(list[j].c, args);
    }
}