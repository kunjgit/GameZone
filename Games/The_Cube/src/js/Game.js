import { World } from './World.js';
import { Cube } from './Cube.js';
import { Controls } from './Controls.js';
import { Scrambler } from './Scrambler.js';
import { Transition } from './Transition.js';
import { Timer } from './Timer.js';
import { Preferences } from './Preferences.js';
import { Confetti } from './Confetti.js';
import { Scores } from './Scores.js';
import { Storage } from './Storage.js';
import { Themes } from './Themes.js';
import { ThemeEditor } from './ThemeEditor.js';
import { States } from './States.js';
// import { Keyboard } from './Keyboard.js';

import { Icons } from './Icons.js';

const STATE = {
  Menu: 0,
  Playing: 1,
  Complete: 2,
  Stats: 3,
  Prefs: 4,
  Theme: 5,
};

const BUTTONS = {
  Menu: [ 'stats', 'prefs' ],
  Playing: [ 'back' ],
  Complete: [],
  Stats: [],
  Prefs: [ 'back', 'theme' ],
  Theme: [ 'back', 'reset' ],
  None: [],
};

const SHOW = true;
const HIDE = false;

const FAST = true;
const SLOW = false;

class Game {

  constructor() {

    this.dom = {
      ui: document.querySelector( '.ui' ),
      game: document.querySelector( '.ui__game' ),
      back: document.querySelector( '.ui__background' ),
      prefs: document.querySelector( '.ui__prefs' ),
      theme: document.querySelector( '.ui__theme' ),
      stats: document.querySelector( '.ui__stats' ),
      texts: {
        title: document.querySelector( '.text--title' ),
        note: document.querySelector( '.text--note' ),
        timer: document.querySelector( '.text--timer' ),
        complete: document.querySelector( '.text--complete' ),
        best: document.querySelector( '.text--best-time' ),
        theme: document.querySelector( '.text--theme' ),
      },
      buttons: {
        prefs: document.querySelector( '.btn--prefs' ),
        back: document.querySelector( '.btn--back' ),
        stats: document.querySelector( '.btn--stats' ),
        reset: document.querySelector( '.btn--reset' ),
        theme: document.querySelector( '.btn--theme' ),
      },
    };

    this.world = new World( this );
    this.cube = new Cube( this );
    this.controls = new Controls( this );
    this.scrambler = new Scrambler( this );
    this.transition = new Transition( this );
    this.timer = new Timer( this );
    this.preferences = new Preferences( this );
    this.scores = new Scores( this );
    this.storage = new Storage( this );
    this.confetti = new Confetti( this );
    this.themes = new Themes( this );
    this.themeEditor = new ThemeEditor( this );

    this.initActions();

    this.state = STATE.Menu;
    this.newGame = false;
    this.saved = false;

    this.storage.init();
    this.preferences.init();
    this.cube.init();
    this.transition.init();

    this.storage.loadGame();
    this.scores.calcStats();

    setTimeout( () => {

      this.transition.float();
      this.transition.cube( SHOW );

      setTimeout( () => this.transition.title( SHOW ), 700 );
      setTimeout( () => this.transition.buttons( BUTTONS.Menu, BUTTONS.None ), 1000 );

    }, 500 );

  }

  initActions() {

    let tappedTwice = false;

    this.dom.game.addEventListener( 'click', event => {

      if ( this.transition.activeTransitions > 0 ) return;
      if ( this.state === STATE.Playing ) return;

      if ( this.state === STATE.Menu ) {

        if ( ! tappedTwice ) {

          tappedTwice = true;
          setTimeout( () => tappedTwice = false, 300 );
          return false;

        }

        this.game( SHOW );

      } else if ( this.state === STATE.Complete ) {

        this.complete( HIDE );

      } else if ( this.state === STATE.Stats ) {

        this.stats( HIDE );

      } 

    }, false );

    this.controls.onMove = () => {

      if ( this.newGame ) {
        
        this.timer.start( true );
        this.newGame = false;

      }

    }

    this.dom.buttons.back.onclick = event => {

      if ( this.transition.activeTransitions > 0 ) return;

      if ( this.state === STATE.Playing ) {

        this.game( HIDE );

      } else if ( this.state === STATE.Prefs ) {

        this.prefs( HIDE );

      } else if ( this.state === STATE.Theme ) {

        this.theme( HIDE );

      }

    };

    this.dom.buttons.reset.onclick = event => {

      if ( this.state === STATE.Theme ) {

        this.themeEditor.resetTheme();

      }
      
    };

    this.dom.buttons.prefs.onclick = event => this.prefs( SHOW );

    this.dom.buttons.theme.onclick = event => this.theme( SHOW );

    this.dom.buttons.stats.onclick = event => this.stats( SHOW );

    this.controls.onSolved = () => this.complete( SHOW );

  }

  game( show ) {

    if ( show ) {

      if ( ! this.saved ) {

        this.scrambler.scramble();
        this.controls.scrambleCube();
        this.newGame = true;

      }

      const duration = this.saved ? 0 :
        this.scrambler.converted.length * ( this.controls.flipSpeeds[0] + 10 );

      this.state = STATE.Playing;
      this.saved = true;

      this.transition.buttons( BUTTONS.None, BUTTONS.Menu );

      this.transition.zoom( STATE.Playing, duration );
      this.transition.title( HIDE );

      setTimeout( () => {

        this.transition.timer( SHOW );
        this.transition.buttons( BUTTONS.Playing, BUTTONS.None );

      }, this.transition.durations.zoom - 1000 );

      setTimeout( () => {

        this.controls.enable();
        if ( ! this.newGame ) this.timer.start( true )

      }, this.transition.durations.zoom );

    } else {

      this.state = STATE.Menu;

      this.transition.buttons( BUTTONS.Menu, BUTTONS.Playing );

      this.transition.zoom( STATE.Menu, 0 );

      this.controls.disable();
      if ( ! this.newGame ) this.timer.stop();
      this.transition.timer( HIDE );

      setTimeout( () => this.transition.title( SHOW ), this.transition.durations.zoom - 1000 );

      this.playing = false;
      this.controls.disable();

    }

  }

  prefs( show ) {

    if ( show ) {

      if ( this.transition.activeTransitions > 0 ) return;

      this.state = STATE.Prefs;

      this.transition.buttons( BUTTONS.Prefs, BUTTONS.Menu );

      this.transition.title( HIDE );
      this.transition.cube( HIDE );

      setTimeout( () => this.transition.preferences( SHOW ), 1000 );

    } else {

      this.cube.resize();

      this.state = STATE.Menu;

      this.transition.buttons( BUTTONS.Menu, BUTTONS.Prefs );

      this.transition.preferences( HIDE );

      setTimeout( () => this.transition.cube( SHOW ), 500 );
      setTimeout( () => this.transition.title( SHOW ), 1200 );

    }

  }

  theme( show ) {

    this.themeEditor.colorPicker( show );
    
    if ( show ) {

      if ( this.transition.activeTransitions > 0 ) return;

      this.cube.loadFromData( States[ '3' ][ 'checkerboard' ] );

      this.themeEditor.setHSL( null, false );

      this.state = STATE.Theme;

      this.transition.buttons( BUTTONS.Theme, BUTTONS.Prefs );

      this.transition.preferences( HIDE );

      setTimeout( () => this.transition.cube( SHOW, true ), 500 );
      setTimeout( () => this.transition.theming( SHOW ), 1000 );

    } else {

      this.state = STATE.Prefs;

      this.transition.buttons( BUTTONS.Prefs, BUTTONS.Theme );

      this.transition.cube( HIDE, true );
      this.transition.theming( HIDE );

      setTimeout( () => this.transition.preferences( SHOW ), 1000 );
      setTimeout( () => {

        const gameCubeData = JSON.parse( localStorage.getItem( 'theCube_savedState' ) );

        if ( !gameCubeData ) {

          this.cube.resize( true );
          return;

        }

        this.cube.loadFromData( gameCubeData );

      }, 1500 );

    }

  }

  stats( show ) {

    if ( show ) {

      if ( this.transition.activeTransitions > 0 ) return;

      this.state = STATE.Stats;

      this.transition.buttons( BUTTONS.Stats, BUTTONS.Menu );

      this.transition.title( HIDE );
      this.transition.cube( HIDE );

      setTimeout( () => this.transition.stats( SHOW ), 1000 );

    } else {

      this.state = STATE.Menu;

      this.transition.buttons( BUTTONS.Menu, BUTTONS.None );

      this.transition.stats( HIDE );

      setTimeout( () => this.transition.cube( SHOW ), 500 );
      setTimeout( () => this.transition.title( SHOW ), 1200 );

    }

  }

  complete( show ) {

    if ( show ) {

      this.transition.buttons( BUTTONS.Complete, BUTTONS.Playing );

      this.state = STATE.Complete;
      this.saved = false;

      this.controls.disable();
      this.timer.stop();
      this.storage.clearGame();

      this.bestTime = this.scores.addScore( this.timer.deltaTime );

      this.transition.zoom( STATE.Menu, 0 );
      this.transition.elevate( SHOW );

      setTimeout( () => {

        this.transition.complete( SHOW, this.bestTime )
        this.confetti.start();

      }, 1000 );

    } else {

      this.state = STATE.Stats;
      this.saved = false;

      this.transition.timer( HIDE );
      this.transition.complete( HIDE, this.bestTime );
      this.transition.cube( HIDE );
      this.timer.reset();

      setTimeout( () => {

        this.cube.reset();
        this.confetti.stop();

        this.transition.stats( SHOW )
        this.transition.elevate( 0 );

      }, 1000 );

      return false;

    }

  }

}

window.game = new Game();
