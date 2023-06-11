/**
* @constructor
*/
function LinkedNode( data ){

  this.next = null;
  this.prev = null;
  this.data = data;

}

LinkedNode.prototype.remove = function() {

  if(this.next) this.next.prev = this.prev;
  if(this.prev) this.prev.next = this.next;

};

/**
* @constructor
*/
function LinkedList() {

  this.head = null;
  this.tail = null;
  this.length = 0;
  this.cache = [];

};

LinkedList.prototype.push = function( data ) {

  if(typeof this.cache[data] === 'undefined'){

    this.cache[data] = new LinkedNode( data );

  }

  if(!this.head){

    this.head = this.tail = this.cache[data];

  } else {

    this.cache[data].prev = this.tail;
    this.tail.next = this.cache[data];
    this.tail = this.cache[data];

  }

  this.length++;

};

LinkedList.prototype.shift = function() {

  var head = this.head;
  this.head = head.next;
  head.remove();
  head.next = null;
  this.length--;
  if(this.head == null){
    this.length = 0;
  }

};

Game.LinkedList = LinkedList;