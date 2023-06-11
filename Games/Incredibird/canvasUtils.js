sanitize = function(args){
	for(var i=0;i<args.length;args[i]=args[i++]|0);
	return args;
}
CanvasRenderingContext2D.prototype.fr= function(){
	var args = Array.prototype.slice.apply(arguments);
	if (crisp) sanitize(args);
	this.fillRect.apply(this,args);
}

CanvasRenderingContext2D.prototype.tr= function(){
	var args = Array.prototype.slice.apply(arguments);
	if (crisp) sanitize(args);
	this.translate.apply(this,args);
}
