class Vector{
  constructor(x,y,w=32,h=32){
    this.x = x
    this.y = y
    this.h= h
    this.w= w
    this.maxWidth=w
  }
  set(v){
    this.x = v.x
    this.y = v.y
    return this;
  }
  add(v){
    this.x+=v.x
    this.y+=v.y
  }
  addOne(v){
    this.x+=v
    this.y+=v
  }
  addX(v){
      this.x+=v.x
  }
  zero(){
    this.x=this.y=0
  }
  substract(v){
    this.x -= v.x
    this.y -= v.y
    return this;
  }
  dot(a){
    this.x*=a
    this.y*=a
    return this
  }
  clone(){
    return new Vector(this.x,this.y,this.w,this.h)
  }
  norm(v){
    let tx = v.x-this.x,ty =v.y-this.y
    let dist = Distance(tx,ty)
    return new Vector(tx/dist,ty/dist)
  }
  size(v,th){
      this.w =(this.maxWidth-v.w)/(th-v.y)*this.w
      //return new Vector(this.x,this.y,this.w*this.y,this.h)
  }
  less(mw,mh){
    return this.x<mw||this.y<mh
  }
  collisionRect(a){
      return CollisionRect(this,a)
  }
}