const SHIFT = 16;

const CTRL = [
  81, // q
  87, // w
  69, // e
  65, // a
  83, // s
  68, // d
];

const ROTATION = [
  90, // z
  88, // x
  67, // c
];

class Keyboard {

  constructor( game ) {

    this.game = game;
    this.shift = false;

    this.keydown = this.keydown.bind( this );
    this.keyup = this.keyup.bind( this );

    window.addEventListener( 'keydown', this.keydown, false );
    window.addEventListener( 'keyup', this.keyup, false );

  }

  keydown( e ) {
  
    if ( e.keyCode === SHIFT ) this.shift = true;

    if ( CTRL.includes( e.keyCode ) ) {

      const modifier = ( this.shift ) ? `'` : ``;
      const face = { 65: 'L', 68: 'R', 87: 'U', 83: 'D', 81: 'F', 69: 'B' }[ e.keyCode ];

      const convertedMove = this.game.scrambler.convertMove( face + modifier );

      this.game.controls.keyboardMove( 'LAYER', convertedMove, () => {} );

    } else if ( ROTATION.includes( e.keyCode ) ) {

      const axis = { 90: 'x', 88: 'y', 67: 'z' }[ e.keyCode ];
      const angle = ( this.shift ? 1 : -1 ) * Math.PI / 2;

      this.game.controls.keyboardMove( 'CUBE', { axis, angle }, () => {} );

    }

  }

  keyup( e ) {

    if ( e.keyCode === SHIFT ) this.shift = false;

  }

}

export { Keyboard };