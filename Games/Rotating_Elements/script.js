var game = {
  points : 0,
  delay  : 510,
  init : function(node, point, tweet, w, h){
    this.map = new Array(w*h);
    
    this.node = node;
    this.point = point;
    this.tweet = tweet;
    
    this.w = w;
    this.h = h;
    
    
    this.node.addEventListener('click', function(e){
      var element = e.srcElement || e.target;
      game.points = 0;
      game.turn(element.dataPos, true);
    }, true); 
       
    this._initNode(); 
  },
    
  turn : function(pos, start){   
    var item = this.map[pos];
    
    if (start === true){
       game.chain(pos, item)
     }else{
      setTimeout(function(){
        game.chain(pos, item);
      }, game.delay); // This have to be in sync with the turn animation .5s
     }
  },
  
  chain : function(pos, item){
    if (item.animationRunning) return; // Only do thing when it's not currently animating. 
                                       // Fixing bugs where strange things can happen
    
    var state = item.state, 
        nextItem, 
        nextPos, 
        allowed;
    
    state = ( item.state + 1 ) % 4;
    
    if (state === 0 || state === 1){
      this.startNext(pos+game.w, [2, 3])
    }
    if (state === 0 || state === 3){
      this.startNext(pos+1, [1,2])
    }
    if (state === 1 || state === 2){
      this.startNext(pos-1, [0,3])
    }
    if (state === 2 || state === 3){
      this.startNext(pos-game.w, [0,1])
    }
    
    item.state = state;
    item.animationRunning = true;
    item.li.setAttribute('data-state', state);
    
    // Just want to make this working. 
    // here i should use the animationend event! 
    setTimeout(function(){item.animationRunning = false;}, 500)
      
    game.addPoints();
  },
  
  startNext : function(nextPos, allowed){
    var nextItem = game.map[nextPos];    
    if (nextItem !== undefined && allowed.indexOf(nextItem.state) !== -1){
      game.turn(nextPos);
    }
  },
  
  addPoints : function(){ 
    game.points++;
    game.tweet.setAttribute('href', "https://twitter.com/intent/tweet?&text="+encodeURIComponent("I scored '"+game.points+"' in this Little Game https://cdpn.io/JjBhk"))
    game.point.innerHTML = game.points;
  },
  
  _initNode : function(){
    var frag = document.createDocumentFragment(),
        b = 0, map = this.map;
    for (var i=0;i<map.length;i++){
      var state = Math.floor(Math.random()*4),
          li   = document.createElement('li'); 
      
          li.setAttribute('data-state', state);
          li.dataPos = i;
      
      map[i] = {state : state, li : li};
      frag.appendChild(li);
    }
    this.node.innerHTML = "";
    this.node.appendChild(frag);
  }
}

var board = document.getElementById('board'),
    point =  document.getElementById('point'),
    tweet =  document.getElementById('tweet');
game.init(board, point, tweet, 10, 10);



var fast =  document.getElementById('fast');
fast.addEventListener('click', function(e){
  game.delay = 0;
  e.preventDefault();
});
var normal = document.getElementById('normal');
normal.addEventListener('click', function(e){
  game.delay = 510;
  e.preventDefault();
});