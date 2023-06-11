function level() {
	this.num = -1;
    this.matrix = new Array();
    this.direction = '';
    this.velocity = -1;
}
//level.prototype.num = -1;
//level.prototype.matrix = new Array();
//level.prototype.direction = '';
level.prototype.getRowCount = function(){
    return this.matrix.length;
}
level.prototype.getColCount = function(){
    return this.matrix[0].length;
}