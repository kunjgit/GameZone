// FRUIT 
function Fruit(x,y,speed,color,size,fruit,slicedFruit1,slicedFruit2,name){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;
    this.size = size;
    this.xSpeed = randomXSpeed(x);
    this.ySpeed = random(-10.4, -7.4);
    this.fruit = fruit;
    this.slicedFruit1 = slicedFruit1;
    this.slicedFruit2 = slicedFruit2;
    this.name = name;
    this.sliced = false;
    this.visible = true;
}

Fruit.prototype.draw = function(){
    fill(this.color);
    if(this.sliced && this.name != 'boom'){ // Draw sliced fruit
        image(this.slicedFruit1, this.x - 25, this.y, this.size, this.size);
        image(this.slicedFruit2, this.x + 25, this.y, this.size, this.size);
    }else{ // Draw fruit
        image(this.fruit, this.x, this.y, this.size, this.size);
    }
};

Fruit.prototype.update = function(){
    if(this.sliced && this.name != 'boom'){
        this.x -= this.xSpeed ;
        this.y += this.ySpeed;
        this.ySpeed += gravity*5;
    }else{
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.ySpeed += gravity;
    }
    if(this.y > height){
        this.visible = false;
    }
};

function randomFruit(){ // Create random fruit
    var x = random(width);
    var y = height;
    var size = noise(frameCount)*20 + 40;
    var col = color(random(255),random(255),random(255));
    var speed = random(3,5);
    var idx = round(random(0,fruitsList.length-1));
    var fruit = fruitsImgs[idx];
    var slicedFruit1 = slicedFruitsImgs[2*idx];
    var slicedFruit2 = slicedFruitsImgs[2*idx + 1];
    var name = fruitsList[idx];
    return new Fruit(x,y,speed,col,size,fruit,slicedFruit1,slicedFruit2,name);
}

function randomXSpeed(x){
    if( x > width/2 ){
        return random(-2.8,-0.5); // If fruit generated on right side, go left
    }else{
        return random(0.5,2.8); // If fruit generated on right side, go left  
    }
};
