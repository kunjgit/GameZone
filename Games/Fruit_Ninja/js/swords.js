// Sword
function Sword(color){
    this.swipes = [];
    this.color = color;
};

Sword.prototype.draw = function(){

    var l = this.swipes.length;
    for(var i=0; i< this.swipes.length; i++){
        var size = map(i, 0, this.swipes.length, 2, 27);
        noStroke();
        fill(this.color);
        ellipse(this.swipes[i].x, this.swipes[i].y, size);
    }
    if(l<1){
        return;
    }
    fill(255);
    textSize(20);
};

Sword.prototype.update = function(){
    
    if(this.swipes.length > 20){ // fade swipe - delete last value
        this.swipes.splice(0,1);
        this.swipes.splice(0,1);
    }
    if(this.swipes.length > 0){
        this.swipes.splice(0,1);
    }
};

Sword.prototype.checkSlice = function(fruit){

    if(fruit.sliced || this.swipes.length < 2){
        return false;
    }
    var length = this.swipes.length;
    var stroke1 = this.swipes[length - 1]; // latest stroke
	var stroke2 = this.swipes[length - 2]; // second last stroke
    var d1 = dist(stroke1.x, stroke1.y, fruit.x, fruit.y); // distance between stroke1 and fruit
    var d2 = dist(stroke2.x, stroke2.y, fruit.x, fruit.y); // distance between stroke2 and fruit
    var d3 = dist(stroke1.x, stroke1.y, stroke2.x, stroke2.y); // distance between stroke1 and stroke2
    var sliced = (d1 < fruit.size) || ((d1 < d3 && d2 < d3) && (d3 < width/4));
    fruit.sliced = sliced;
    return sliced;
    
};

Sword.prototype.swipe = function(x,y){ // sword
    this.swipes.push(createVector(x, y));
}