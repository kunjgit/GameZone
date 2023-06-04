/**
 * Creates a new List. A list lets you add and remove elements at the current position
 * of the iterator, which starts at the start of the list and can be moved with the functions.
 */
var List = (function () {
    "use strict";
    
    
    /**
     * @constructor
     * @private
     * The List Node Class
     * @param {*} data
     * @param {Node} prev
     * @param {Node} next
     */
    function Node(data, prev, next) {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }
    
    
    /**
     * @constructor
     * @private
     * The List Iterator Class
     * @param {List} list
     * @param {Node} prev
     * @param {Node} next
     */
    function Iterator(list, prev, next) {
        this.list      = list;
        this.previows  = prev;
        this.following = next;
    }
    
    /**
     * Moves to the next element if there is one
     */
    Iterator.prototype.next = function () {
        if (this.hasNext()) {
            this.previows  = this.following;
            this.following = this.following.next;
        }
    };
    
    /**
     * Moves to the previews element if there is one
     */
    Iterator.prototype.prev = function () {
        if (this.hasPrev()) {
            this.following = this.previows;
            this.previows  = this.previows.prev;
        }
    };
        
    /**
     * Checks if there is a next elements (from the current one)
     * @return {boolean}
     */
    Iterator.prototype.hasNext = function () {
        return this.following !== null;
    };
        
    /**
     * Checks if there is a previews element (from the current one)
     * @return {boolean}
     */
    Iterator.prototype.hasPrev = function () {
        return this.previows !== null;
    };
        
    /**
     * Returns the following elements data
     * @return {*}
     */
    Iterator.prototype.getNext = function () {
        if (this.hasNext()) {
            return this.following.data;
        }
    };
        
    /**
     * Returns the previws elements data
     * @param {*}
     */
    Iterator.prototype.getPrev = function () {
        if (this.hasPrev()) {
            return this.previows.data;
        }
    };
    
    
    /**
     * Removes the follwing element and sets the next one as the new following element
     */
    Iterator.prototype.removeNext = function () {
        // Cant remove next if there isnt one
        if (!this.hasNext()) {
            return;
        }
        
        if (this.following.next) {
            this.following.next.prev = this.following.prev;
        } else {
            this.list.tail = this.following.prev;
        }
        
        if (this.following.prev) {
            this.following.prev.next = this.following.next;
        } else {
            this.list.head = this.following.next;
        }
        
        this.following    = this.following.next;
        this.list.length -= 1;
    };
    
    /**
     * Removes the previows element and sets the prev one as the new previows element
     */
    Iterator.prototype.removePrev = function () {
        if (this.hasPrev()) {
            this.prev();
            this.removeNext();
        }
    };
    
    
    
    /**
     * @constructor
     * The List Class
     */
    function List() {
        this.head   = null;
        this.tail   = null;
        this.length = 0;
    }
    
    /**
     * @private
     * Adds the element between the previows and following
     * @param {*} item
     * @param {Node} prev
     * @param {Node} next
     * @return {Node}
     */
    List.prototype.add = function (item, prev, next) {
        var node = new Node(item, prev, next);
        
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else if (prev) {
            this.tail.next = node;
            this.tail      = node;
        } else if (next) {
            this.head.prev = node;
            this.head      = node;
        }
        
        this.length += 1;
        return node;
    };
    
    /**
     * Adds the item at the beggining of the list
     * @param {*} item
     * @return {Iterator}
     */
    List.prototype.addFirst = function (item) {
        this.add(item, null, this.head);
        return this.iterate();
    };
    
    /**
     * Adds the item at the end of the list
     * @param {*} item
     * @return {Iterator}
     */
    List.prototype.addLast = function (item) {
        this.add(item, this.tail, null);
        return this.iterateLast();
    };
    
    
    /**
     * Returns the data from the first element
     * @return {*}
     */
    List.prototype.first = function () {
        if (this.head) {
            return this.head.data;
        }
        return null;
    };
    
    /**
     * Returns the data from the last element
     * @return {*}
     */
    List.prototype.last = function () {
        if (this.tail) {
            return this.tail.data;
        }
        return null;
    };
    
    
    /**
     * Returns true if the queue is empty, and false otherwise
     * @return {boolean}
     */
    List.prototype.isEmpty = function () {
        return this.head === null;
    };
    
    /**
     * Returns the size of the list
     * @return {number}
     */
    List.prototype.size = function () {
        return this.length;
    };
    
    /**
     * Creates and returns a new Iterator at the start of the list
     * @return {Iterator}
     */
    List.prototype.iterate = function () {
        if (this.head) {
            return new Iterator(this, null, this.head);
        }
        return null;
    };
    
    /**
     * Creates and returns a new Iterator at the end of the list
     * @return {Iterator}
     */
    List.prototype.iterateLast = function () {
        if (this.tail) {
            return new Iterator(this, this.tail, null);
        }
        return null;
    };
    
    
    /**
     * Iterates througth the list calling the callback with the data as parameter
     * @param {function(*, number)}
     */
    List.prototype.forEach = function (callback) {
        if (this.head) {
            var it = this.iterate(), count = 0;
            while (it.hasNext()) {
                callback(it.getNext(), count);
                it.next();
                count += 1;
            }
        }
    };
    
    /**
     * Iterates througth the list calling the callback with the data as parameter,
     * but it breaks the loop if the function returns true
     * @param {function(*, number): boolean}
     * @return {boolean}
     */
    List.prototype.some = function (callback) {
        if (this.head) {
            var it = this.iterate(), count = 0;
            while (it.hasNext()) {
                if (callback(it.getNext(), count)) {
                    return true;
                }
                it.next();
                count += 1;
            }
        }
        return false;
    };
    
    
    return List;
}());
