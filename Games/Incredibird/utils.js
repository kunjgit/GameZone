randBetween = function(min,max,floorit){
	if (arguments.length==1){
		if (min instanceof Array){
			max = min[1];
			min = min[0];
		} else {
			return min;
		}
	} 
	var n = Math.random()*(max-min)+min;
	return floorit?Math.floor(n):n;
};

clamp = function(value,min,max){
	return Math.min(Math.max(value,min),max);
}

Array.prototype.maxInRange = function(from,to){
	if (from>=0 && to<=this.length && from<to) return Math.max.apply(null,this.slice(from,to));
	return NaN;
};

Array.prototype.random = function(){
	if (this.length<=1) return this[0] || null;
	return this[randBetween(0,this.length,1)];
};

Array.prototype.copy = function(){
	if (this.length==2) 
		return new Vector2d(this[0],this[1]);
	return this.slice();
}

noop = function(e){return e};

Object.prototype.mixin = function(what) {
  for (var k in what) 
  	if (what.hasOwnProperty(k) && !this.hasOwnProperty(k)) this[k] = what[k];
  return this;
}

Object.prototype.markForRemoval= function(){
	this.isVisible = false;
	this.isAlive = false;
	this.isMarked = true;
	if (this.onRemove) this.onRemove();
	if (this.resources) this.resources.length=0;
}

Object.prototype.clone = function(){
	return JSON.parse(JSON.stringify(this));
}

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

able = function(btns,en){
	for(var i=0;i<btns.length;i++) if (en) btns[i].classList.remove("disabled"); else btns[i].classList.add("disabled");
}
