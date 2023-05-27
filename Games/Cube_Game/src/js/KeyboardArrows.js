const ARROW = [
  37, // left
  39, // right
  38, // up
  40, // down
];

const CTRL = [
  81, // q
  87, // w
  69, // e
  65, // a
  83, // s
  68, // d
  90, // z
  88, // x
  67, // c
];

class Keyboard {

  constructor( game ) {

    this.game = game;
    this.ctrl = false;

    this.keydown = this.keydown.bind( this );
    this.keyup = this.keyup.bind( this );

    window.addEventListener( 'keydown', this.keydown, false );
    window.addEventListener( 'keyup', this.keyup, false );

    const dbg = document.querySelector('#dbg');

    const animate = () => {

      dbg.innerHTML = ( this.ctrl ) ? this.ctrl : '';

      requestAnimationFrame( animate );

    }

    animate();

  }

  keydown( e ) {

    const { keyCode } = e;
    const { ctrl, game } = this;
    // const {  }

    if ( CTRL.includes( keyCode ) ) {

      this.ctrl = keyCode;

    }

    if ( ARROW.includes( keyCode) && ctrl !== false ) {

      let face = false, modifier = false;

      if ( ctrl === 65 ) { // A

        face = 'L';
        if (keyCode === 38) modifier = "'"; // UP
        if (keyCode === 40) modifier = ''; // DOWN

      }

      if ( ctrl === 68 ) { // D

        face = 'R';
        if (keyCode === 38) modifier = ''; // UP
        if (keyCode === 40) modifier = "'"; // DOWN

      }

      if ( ctrl === 87 ) { // W

        face = 'U';
        if (keyCode === 37) modifier = ''; // LEFT
        if (keyCode === 39) modifier = "'"; // RIGHT

      }

      if ( ctrl === 83 ) { // S

        face = 'D';
        if (keyCode === 37) modifier = "'"; // LEFT
        if (keyCode === 39) modifier = ''; // RIGHT

      }

      if ( ctrl === 81 ) { // Q

        face = 'F';
        if (keyCode === 37) modifier = "'"; // LEFT
        if (keyCode === 39) modifier = ''; // RIGHT

      }

      if ( ctrl === 69 ) { // E

        face = 'B';
        if (keyCode === 37) modifier = ''; // LEFT
        if (keyCode === 39) modifier = "'"; // RIGHT

      }

      if ( face === false || modifier === false ) return;

      const convertedMove = game.scrambler.convertMove( face + modifier );
      game.controls.execute( convertedMove, () => {} );

    }

  }

  keyup( e ) {

    const { keyCode } = e;
    const { ctrl } = this;

    if ( ctrl == keyCode ) {

      this.ctrl = false;

    }

  }

}

export { Keyboard };