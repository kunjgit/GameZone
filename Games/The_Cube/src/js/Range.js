import { Draggable } from './Draggable.js';

const RangeHTML = [

  '<div class="range">',
    '<div class="range__label"></div>',
    '<div class="range__track">',
      '<div class="range__track-line"></div>',
      '<div class="range__handle"><div></div></div>',
    '</div>',
    '<div class="range__list"></div>',
  '</div>',

].join( '\n' );

document.querySelectorAll( 'range' ).forEach( el => {

  const temp = document.createElement( 'div' );
  temp.innerHTML = RangeHTML;

  const range = temp.querySelector( '.range' );
  const rangeLabel = range.querySelector( '.range__label' );
  const rangeList = range.querySelector( '.range__list' );

  range.setAttribute( 'name', el.getAttribute( 'name' ) );
  rangeLabel.innerHTML = el.getAttribute( 'title' );

  if ( el.hasAttribute( 'color' ) ) {

    range.classList.add( 'range--type-color' );
    range.classList.add( 'range--color-' + el.getAttribute( 'name' ) );

  }

  if ( el.hasAttribute( 'list' ) ) {

    el.getAttribute( 'list' ).split( ',' ).forEach( listItemText => {

      const listItem = document.createElement( 'div' );
      listItem.innerHTML = listItemText;
      rangeList.appendChild( listItem );

    } );

  }

  el.parentNode.replaceChild( range, el );

} );

class Range {

  constructor( name, options ) {

    options = Object.assign( {
      range: [ 0, 1 ],
      value: 0,
      step: 0,
      onUpdate: () => {},
      onComplete: () => {},
    }, options || {} );

    this.element = document.querySelector( '.range[name="' + name + '"]' );
    this.track = this.element.querySelector( '.range__track' );
    this.handle = this.element.querySelector( '.range__handle' );
    this.list = [].slice.call( this.element.querySelectorAll( '.range__list div' ) );

    this.value = options.value;
    this.min = options.range[0];
    this.max = options.range[1];
    this.step = options.step;

    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    this.setValue( this.value );

    this.initDraggable();

  }

  setValue( value ) {

    this.value = this.round( this.limitValue( value ) );
    this.setHandlePosition();

  }

  initDraggable() {

    const oldPosition = null;

    let current;

    this.draggable = new Draggable( this.handle, { calcDelta: true } );

    this.draggable.onDragStart = position => {

      current = this.positionFromValue( this.value );
      this.handle.style.left = current + 'px';

    }

    this.draggable.onDragMove = position => {

      current = this.limitPosition( current + position.delta.x );
      this.value = this.round( this.valueFromPosition( current ) );
      this.setHandlePosition();
      
      this.onUpdate( this.value );

    }

    this.draggable.onDragEnd = position => {

      this.onComplete( this.value );

    }

  }

  round( value ) {

    if ( this.step < 1 ) return value;

    return Math.round( ( value - this.min ) / this.step ) * this.step + this.min;

  }

  limitValue( value ) {

    const max = Math.max( this.max, this.min );
    const min = Math.min( this.max, this.min );

    return Math.min( Math.max( value, min ), max );

  }

  limitPosition( position ) {

    return Math.min( Math.max( position, 0 ), this.track.offsetWidth );

  }

  percentsFromValue( value ) {

    return ( value - this.min ) / ( this.max - this.min );

  }

  valueFromPosition( position ) {

    return this.min + ( this.max - this.min ) * ( position / this.track.offsetWidth );

  }

  positionFromValue( value ) {

    return this.percentsFromValue( value ) * this.track.offsetWidth;

  }

  setHandlePosition() {

    this.handle.style.left = this.percentsFromValue( this.value ) * 100 + '%';

  }

}

export { Range };
