/*==============================================================================

Group

==============================================================================*/

g.Group = function() {
	this.collection = [];
	this.length = 0;
};

g.Group.prototype.push = function( item ) {
	this.length++;
	return this.collection.push( item );
};

g.Group.prototype.pop = function() {
	this.length--;
	return this.collection.pop();
};

g.Group.prototype.unshift = function( item ) {
	this.length++;
	return this.collection.unshift( item );
};

g.Group.prototype.shift = function() {
	this.length--;
	return this.collection.shift();
};

g.Group.prototype.getAt = function( index ) {
	return this.collection[ index ];
};

g.Group.prototype.getByPropVal = function( prop, val ) {
	var foundItem = null;
	this.each( function( item, i, collection ) {
		if( item[ prop ] == val ) {
			foundItem = item;
			return;
		}
	}, 0, this );
	return foundItem;
};

g.Group.prototype.removeAt = function( index ) {
	if( index < this.length ) {
		this.collection.splice( index, 1 );
		this.length--;
	}
};

g.Group.prototype.remove = function( item ) {
	var index = this.collection.indexOf( item );
	if( index > -1 ) {
		this.collection.splice( index, 1 );
		this.length--;
	}
};

g.Group.prototype.empty = function() {
	this.collection.length = 0;
	this.length = 0;
};

g.Group.prototype.each = function( action, asc, context ) {
	var length = this.length,
		isString = g.isString( action ),
		ctx = context || window,
		i;
	if( asc ) {
		for( i = 0; i < length; i++ ) {
			if( isString ) {
				this.collection[ i ][ action ]( i );
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )();
			}
		}
	} else {
		i = length;
		while( i-- ) {
			if( isString ) {
				this.collection[ i ][ action ]( i );
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )();
			}
		}
	}
};