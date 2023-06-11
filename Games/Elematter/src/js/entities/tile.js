/*==============================================================================

Tile

==============================================================================*/

g.Ti = function( opt ) {
	g.merge( this, opt );
	this.init();
};

g.Ti.prototype.init = function() {
	this.guid = g.guid++;
	this.dom = g.cE( this.state.dom.state, this.classes );
	g.css( this.dom, {
		'transform': 'translate(' + this.col * g.size + 'px , ' + this.row * g.size + 'px )',
		'width': g.size + 'px',
		'height': g.size + 'px',
		'zIndex': g.rows - this.row
	});
	g.on( this.dom, 'mouseenter', this.onMouseenter, this );
	g.on( this.dom, 'click', this.onClick, this );
};

g.Ti.prototype.onMouseenter = function() {
	if( !this.isPath ) {
		g.audio.play( 'ui-tap' );
	}
};

g.Ti.prototype.onClick = function( e ) {
	if( !this.state.isBuildMenuOpen ) {
		if( !this.isPath ) {
			this.state.showBuildMenu( this );
			this.state.lastClickedTile = this;
		}
	}
};