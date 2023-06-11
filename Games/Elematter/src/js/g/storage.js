/*==============================================================================

Storage

==============================================================================*/
/*
Storage.prototype.setObject = function( key, value ) {
	this.setItem( key, JSON.stringify( value ) );
};

Storage.prototype.getObject = function( key ) {
	var value = this.getItem( key );
	return value && JSON.parse( value );
};

Storage.prototype.removeObject = function( key ) {
	this.removeItem( key );
};

g.Storage = function( namespace ) {
	this.namespace = namespace;
	this.obj = localStorage.getObject( this.namespace ) || {};
};

g.Storage.prototype.get = function( key ) {
	return this.obj[ key ];
};

g.Storage.prototype.set = function( key, val ) {
	this.obj[ key ] = val;
	this.sync();
};

g.Storage.prototype.sync = function() {
	localStorage.setObject( this.namespace, this.obj );
};

g.Storage.reset = function() {
	this.obj = {};
	this.sync();
};*/