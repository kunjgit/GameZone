import { Infantry } from './Infantry.js';
import { game } from '../core/Game.js';
import { getTypes } from '../core/global.js';

const Engineer = (options = {}) => {

  // flag as an engineer
  options.role = 1;

  // hackish: BNB - alternate characters with each group.
  if (!options.isEnemy) {
    options.isBeavis = !game.data.engineerSwitch;
    options.isButthead = !options.isBeavis;
    game.data.engineerSwitch = !game.data.engineerSwitch;
  }

  // hack: -ve lookahead offset allowing engineers to be basically atop turrets
  options.xLookAhead = (options.isEnemy ? 4 : -8);

  // special case
  options.xLookAheadBunker = {
    beavis: 11,
    butthead: -9
  };

  /**
   * Hackish: override nearby list to include usual enemies, *plus* only friendly bunkers.
   * Infantry can interact with both friendly and enemy bunkers.
   * Engineers can interact with both friendly and enemy turrets.
   */
   
  // Ahead-of-time data for `getTypes()`
  const fakeExports = {
    data: {
      isEnemy: options.isEnemy
    }
  }
  
  options.nearbyItems = getTypes('tank, van, missileLauncher, infantry, engineer, helicopter, turret:all, bunker:friendly', { group: 'enemy', exports: fakeExports });

  return Infantry(options);

};

export { Engineer };